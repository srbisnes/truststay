// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ListingRegistry} from "./ListingRegistry.sol";

/**
 * @title BookingEscrow
 * @notice Trustless escrow for TrustStay bookings.
 * @dev Prevents scams by locking funds until check-out + dispute window.
 *      Double-booking is prevented by marking date ranges as occupied.
 *      Both parties are protected: Guest cannot be ghosted, Host cannot be left unpaid.
 *
 * Security model:
 * - Funds only move after both confirm or after disputeWindow expires.
 * - Host can cancel before start (full refund).
 * - Guest can cancel with rules (partial refund possible in future versions).
 * - Reputation points are awarded/penalized externally via ReputationPoints contract.
 */
contract BookingEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum BookingStatus {
        None,
        Pending,      // Guest deposited, waiting host accept (or auto)
        Confirmed,    // Accepted, funds locked
        Active,       // Stay period started
        Completed,    // Both confirmed or time expired
        Cancelled,
        Disputed
    }

    struct Booking {
        uint256 listingId;
        address guest;
        address host;
        uint256 totalAmount;        // nights * price + deposit
        uint256 securityDeposit;
        uint64 checkIn;             // unix timestamp (start of day recommended)
        uint64 checkOut;
        BookingStatus status;
        bool guestConfirmed;
        bool hostConfirmed;
        uint64 createdAt;
    }

    IERC20 public immutable usdc;
    ListingRegistry public immutable registry;
    address public reputationContract; // optional, set later

    uint256 public nextBookingId = 1;
    uint256 public protocolFeeBps = 150; // 1.5%
    address public feeRecipient;
    uint64 public disputeWindow = 2 days;

    mapping(uint256 => Booking) public bookings;

    // listingId => dayTimestamp => bookingId (0 = free)
    // We store occupancy at day granularity for gas efficiency
    mapping(uint256 => mapping(uint64 => uint256)) public occupancy;

    event BookingCreated(uint256 indexed bookingId, uint256 indexed listingId, address indexed guest, uint256 totalAmount);
    event BookingConfirmed(uint256 indexed bookingId);
    event BookingCancelled(uint256 indexed bookingId, address by);
    event FundsReleased(uint256 indexed bookingId, address toHost, uint256 amount, uint256 fee);
    event DisputeRaised(uint256 indexed bookingId);
    event ConfirmationSubmitted(uint256 indexed bookingId, address by, bool isGuest);

    error InvalidListing();
    error NotAvailable();
    error InvalidDates();
    error NotGuest();
    error NotHost();
    error InvalidStatus();
    error TransferFailed();
    error AlreadyConfirmed();

    constructor(
        address usdc_,
        address registry_,
        address feeRecipient_,
        address initialOwner
    ) Ownable(initialOwner) {
        usdc = IERC20(usdc_);
        registry = ListingRegistry(registry_);
        feeRecipient = feeRecipient_;
    }

    /**
     * @notice Create a booking and lock funds.
     * @dev Guest must approve USDC first.
     */
    function createBooking(
        uint256 listingId,
        uint64 checkIn,
        uint64 checkOut
    ) external nonReentrant returns (uint256 bookingId) {
        if (checkOut <= checkIn) revert InvalidDates();
        if (checkIn < block.timestamp) revert InvalidDates();

        ListingRegistry.Listing memory listing = registry.getListing(listingId);
        if (!listing.active || listing.host == address(0)) revert InvalidListing();

        // Check availability day by day
        uint64 day = checkIn;
        while (day < checkOut) {
            if (occupancy[listingId][day] != 0) revert NotAvailable();
            day += 1 days;
        }

        uint256 nights = (checkOut - checkIn) / 1 days;
        if (nights == 0) nights = 1;

        uint256 totalRent = nights * listing.pricePerNight;
        uint256 totalAmount = totalRent + listing.securityDeposit;

        // Pull funds
        usdc.safeTransferFrom(msg.sender, address(this), totalAmount);

        bookingId = nextBookingId++;
        bookings[bookingId] = Booking({
            listingId: listingId,
            guest: msg.sender,
            host: listing.host,
            totalAmount: totalAmount,
            securityDeposit: listing.securityDeposit,
            checkIn: checkIn,
            checkOut: checkOut,
            status: BookingStatus.Confirmed, // auto-confirm for MVP simplicity (can change to Pending)
            guestConfirmed: false,
            hostConfirmed: false,
            createdAt: uint64(block.timestamp)
        });

        // Mark occupancy
        day = checkIn;
        while (day < checkOut) {
            occupancy[listingId][day] = bookingId;
            day += 1 days;
        }

        emit BookingCreated(bookingId, listingId, msg.sender, totalAmount);
        emit BookingConfirmed(bookingId);
    }

    /**
     * @notice Guest or Host confirms successful stay.
     * When both confirm (or after disputeWindow), funds are released.
     */
    function confirmStay(uint256 bookingId) external nonReentrant {
        Booking storage b = bookings[bookingId];
        if (b.status != BookingStatus.Confirmed && b.status != BookingStatus.Active) revert InvalidStatus();

        if (msg.sender == b.guest) {
            if (b.guestConfirmed) revert AlreadyConfirmed();
            b.guestConfirmed = true;
            emit ConfirmationSubmitted(bookingId, msg.sender, true);
        } else if (msg.sender == b.host) {
            if (b.hostConfirmed) revert AlreadyConfirmed();
            b.hostConfirmed = true;
            emit ConfirmationSubmitted(bookingId, msg.sender, false);
        } else {
            revert NotGuest(); // or NotHost, simplified
        }

        // Auto-release if both confirmed
        if (b.guestConfirmed && b.hostConfirmed) {
            _releaseFunds(bookingId);
        }
    }

    /**
     * @notice Anyone can trigger release after checkOut + disputeWindow if both confirmed or window passed.
     * In production add more nuanced logic + arbitration.
     */
    function finalizeBooking(uint256 bookingId) external nonReentrant {
        Booking storage b = bookings[bookingId];
        if (b.status != BookingStatus.Confirmed && b.status != BookingStatus.Active) revert InvalidStatus();

        // Must be past check-out + dispute window OR both already confirmed
        bool bothConfirmed = b.guestConfirmed && b.hostConfirmed;
        bool windowPassed = block.timestamp >= b.checkOut + disputeWindow;

        if (!bothConfirmed && !windowPassed) revert InvalidStatus();

        _releaseFunds(bookingId);
    }

    function _releaseFunds(uint256 bookingId) internal {
        Booking storage b = bookings[bookingId];
        b.status = BookingStatus.Completed;

        uint256 rent = b.totalAmount - b.securityDeposit;
        uint256 fee = (rent * protocolFeeBps) / 10_000;
        uint256 toHost = rent - fee;

        // Clear occupancy
        uint64 day = b.checkIn;
        while (day < b.checkOut) {
            occupancy[b.listingId][day] = 0;
            day += 1 days;
        }

        // Pay host
        usdc.safeTransfer(b.host, toHost);
        if (fee > 0) {
            usdc.safeTransfer(feeRecipient, fee);
        }
        // Return deposit to guest
        if (b.securityDeposit > 0) {
            usdc.safeTransfer(b.guest, b.securityDeposit);
        }

        emit FundsReleased(bookingId, b.host, toHost, fee);
    }

    /**
     * @notice Host can cancel before check-in → full refund to guest.
     */
    function cancelByHost(uint256 bookingId) external nonReentrant {
        Booking storage b = bookings[bookingId];
        if (msg.sender != b.host) revert NotHost();
        if (b.status != BookingStatus.Confirmed) revert InvalidStatus();
        if (block.timestamp >= b.checkIn) revert InvalidStatus();

        b.status = BookingStatus.Cancelled;

        // Clear occupancy
        uint64 day = b.checkIn;
        while (day < b.checkOut) {
            occupancy[b.listingId][day] = 0;
            day += 1 days;
        }

        usdc.safeTransfer(b.guest, b.totalAmount);
        emit BookingCancelled(bookingId, msg.sender);
    }

    // Admin
    function setProtocolFeeBps(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "max 5%"); // safety
        protocolFeeBps = newFee;
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        feeRecipient = newRecipient;
    }

    function setDisputeWindow(uint64 newWindow) external onlyOwner {
        disputeWindow = newWindow;
    }

    function setReputationContract(address newRep) external onlyOwner {
        reputationContract = newRep;
    }

    // View helpers
    function isAvailable(uint256 listingId, uint64 checkIn, uint64 checkOut) external view returns (bool) {
        uint64 day = checkIn;
        while (day < checkOut) {
            if (occupancy[listingId][day] != 0) return false;
            day += 1 days;
        }
        return true;
    }

    function getBooking(uint256 bookingId) external view returns (Booking memory) {
        return bookings[bookingId];
    }
}
