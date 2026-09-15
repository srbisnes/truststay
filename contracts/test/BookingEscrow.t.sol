// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {ListingRegistry} from "../src/ListingRegistry.sol";
import {BookingEscrow} from "../src/BookingEscrow.sol";
import {ReputationPoints} from "../src/ReputationPoints.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1_000_000e6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract BookingEscrowTest is Test {
    ListingRegistry public registry;
    BookingEscrow public escrow;
    ReputationPoints public reputation;
    MockUSDC public usdc;

    address public owner = makeAddr("owner");
    address public host = makeAddr("host");
    address public guest = makeAddr("guest");
    address public feeRecipient = makeAddr("feeRecipient");

    uint256 public constant PRICE_PER_NIGHT = 100e6;
    uint256 public constant DEPOSIT = 50e6;
    uint16 public constant MAX_GUESTS = 4;

    function setUp() public {
        vm.startPrank(owner);
        usdc = new MockUSDC();
        registry = new ListingRegistry(owner);
        escrow = new BookingEscrow(address(usdc), address(registry), feeRecipient, owner);
        reputation = new ReputationPoints(owner);
        reputation.setMinter(address(escrow), true);
        vm.stopPrank();

        usdc.mint(guest, 10_000e6);
    }

    function _createListing() internal returns (uint256 listingId) {
        vm.prank(host);
        listingId = registry.createListing(
            PRICE_PER_NIGHT,
            DEPOSIT,
            MAX_GUESTS,
            keccak256("Buenos Aires, Argentina"),
            "QmTestCID123"
        );
    }

    function test_CreateListing() public {
        uint256 id = _createListing();
        ListingRegistry.Listing memory l = registry.getListing(id);
        assertEq(l.host, host);
        assertEq(l.pricePerNight, PRICE_PER_NIGHT);
        assertEq(l.securityDeposit, DEPOSIT);
        assertTrue(l.active);
    }

    function test_CreateBooking_Success() public {
        uint256 listingId = _createListing();

        uint64 checkIn = uint64(block.timestamp + 1 days);
        uint64 checkOut = uint64(block.timestamp + 4 days);

        uint256 nights = 3;
        uint256 total = nights * PRICE_PER_NIGHT + DEPOSIT;

        vm.startPrank(guest);
        usdc.approve(address(escrow), total);
        uint256 bookingId = escrow.createBooking(listingId, checkIn, checkOut);
        vm.stopPrank();

        BookingEscrow.Booking memory b = escrow.getBooking(bookingId);
        assertEq(b.guest, guest);
        assertEq(b.host, host);
        assertEq(b.totalAmount, total);
        assertEq(uint8(b.status), uint8(BookingEscrow.BookingStatus.Confirmed));
        assertTrue(escrow.isAvailable(listingId, checkOut, checkOut + 1 days));
        assertFalse(escrow.isAvailable(listingId, checkIn, checkOut));
    }

    function test_CannotDoubleBook() public {
        uint256 listingId = _createListing();
        uint64 checkIn = uint64(block.timestamp + 1 days);
        uint64 checkOut = uint64(block.timestamp + 3 days);

        uint256 total = 2 * PRICE_PER_NIGHT + DEPOSIT;

        vm.startPrank(guest);
        usdc.approve(address(escrow), total * 2);
        escrow.createBooking(listingId, checkIn, checkOut);

        vm.expectRevert(BookingEscrow.NotAvailable.selector);
        escrow.createBooking(listingId, checkIn + 1 days, checkOut + 1 days);
        vm.stopPrank();
    }

    function test_ConfirmAndRelease() public {
        uint256 listingId = _createListing();
        uint64 checkIn = uint64(block.timestamp + 1 days);
        uint64 checkOut = uint64(block.timestamp + 3 days);
        uint256 nights = 2;
        uint256 total = nights * PRICE_PER_NIGHT + DEPOSIT;

        vm.startPrank(guest);
        usdc.approve(address(escrow), total);
        uint256 bookingId = escrow.createBooking(listingId, checkIn, checkOut);
        vm.stopPrank();

        vm.warp(checkOut + 1);

        vm.prank(guest);
        escrow.confirmStay(bookingId);
        vm.prank(host);
        escrow.confirmStay(bookingId);

        uint256 rent = nights * PRICE_PER_NIGHT;
        uint256 fee = (rent * 150) / 10_000;
        assertEq(usdc.balanceOf(host), rent - fee);
        assertEq(usdc.balanceOf(feeRecipient), fee);
        assertEq(usdc.balanceOf(guest), 10_000e6 - total + DEPOSIT);
    }

    function test_HostCancelBeforeCheckIn() public {
        uint256 listingId = _createListing();
        uint64 checkIn = uint64(block.timestamp + 2 days);
        uint64 checkOut = uint64(block.timestamp + 5 days);
        uint256 total = 3 * PRICE_PER_NIGHT + DEPOSIT;

        vm.startPrank(guest);
        usdc.approve(address(escrow), total);
        uint256 bookingId = escrow.createBooking(listingId, checkIn, checkOut);
        vm.stopPrank();

        uint256 guestBalBefore = usdc.balanceOf(guest);

        vm.prank(host);
        escrow.cancelByHost(bookingId);

        assertEq(usdc.balanceOf(guest), guestBalBefore + total);
        assertTrue(escrow.isAvailable(listingId, checkIn, checkOut));
    }

    function test_FinalizeAfterDisputeWindow() public {
        uint256 listingId = _createListing();
        uint64 checkIn = uint64(block.timestamp + 1 days);
        uint64 checkOut = uint64(block.timestamp + 2 days);
        uint256 total = PRICE_PER_NIGHT + DEPOSIT;

        vm.startPrank(guest);
        usdc.approve(address(escrow), total);
        uint256 bookingId = escrow.createBooking(listingId, checkIn, checkOut);
        vm.stopPrank();

        vm.warp(checkOut + 3 days);

        escrow.finalizeBooking(bookingId);

        BookingEscrow.Booking memory b = escrow.getBooking(bookingId);
        assertEq(uint8(b.status), uint8(BookingEscrow.BookingStatus.Completed));
    }

    function test_ReputationSoulbound() public {
        vm.prank(owner);
        reputation.award(guest, 100, "Good stay");

        assertEq(reputation.balanceOf(guest), 100);

        vm.expectRevert(ReputationPoints.TransfersDisabled.selector);
        vm.prank(guest);
        reputation.transfer(host, 10);
    }
}
