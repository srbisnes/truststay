// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ListingRegistry
 * @notice On-chain registry of rental properties for TrustStay.
 * @dev Metadata (photos, full description) lives on IPFS. Only critical booking data is on-chain.
 *      Availability is managed via BookingEscrow to prevent double-booking.
 */
contract ListingRegistry is Ownable, ReentrancyGuard {
    struct Listing {
        address host;
        uint256 pricePerNight;      // in USDC (6 decimals)
        uint256 securityDeposit;    // in USDC
        uint16 maxGuests;
        bytes32 locationHash;       // keccak256 of city/country or geohash for privacy
        string ipfsCID;             // metadata: title, description, photos, amenities
        bool active;
        uint64 createdAt;
    }

    uint256 public nextListingId = 1;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public hostListings;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed host,
        uint256 pricePerNight,
        uint256 securityDeposit,
        string ipfsCID
    );
    event ListingUpdated(uint256 indexed listingId);
    event ListingDeactivated(uint256 indexed listingId);

    error NotHost();
    error ListingNotActive();
    error InvalidPrice();

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Create a new property listing.
     * @param pricePerNight Price in USDC (6 decimals)
     * @param securityDeposit Required deposit in USDC
     * @param maxGuests Maximum number of guests
     * @param locationHash keccak256 of location data (privacy-preserving)
     * @param ipfsCID IPFS content identifier for full metadata
     */
    function createListing(
        uint256 pricePerNight,
        uint256 securityDeposit,
        uint16 maxGuests,
        bytes32 locationHash,
        string calldata ipfsCID
    ) external nonReentrant returns (uint256 listingId) {
        if (pricePerNight == 0) revert InvalidPrice();

        listingId = nextListingId++;
        listings[listingId] = Listing({
            host: msg.sender,
            pricePerNight: pricePerNight,
            securityDeposit: securityDeposit,
            maxGuests: maxGuests,
            locationHash: locationHash,
            ipfsCID: ipfsCID,
            active: true,
            createdAt: uint64(block.timestamp)
        });

        hostListings[msg.sender].push(listingId);

        emit ListingCreated(listingId, msg.sender, pricePerNight, securityDeposit, ipfsCID);
    }

    function updateListing(
        uint256 listingId,
        uint256 pricePerNight,
        uint256 securityDeposit,
        uint16 maxGuests,
        string calldata ipfsCID
    ) external {
        Listing storage listing = listings[listingId];
        if (listing.host != msg.sender) revert NotHost();
        if (!listing.active) revert ListingNotActive();
        if (pricePerNight == 0) revert InvalidPrice();

        listing.pricePerNight = pricePerNight;
        listing.securityDeposit = securityDeposit;
        listing.maxGuests = maxGuests;
        listing.ipfsCID = ipfsCID;

        emit ListingUpdated(listingId);
    }

    function deactivateListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        if (listing.host != msg.sender) revert NotHost();
        listing.active = false;
        emit ListingDeactivated(listingId);
    }

    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    function getHostListings(address host) external view returns (uint256[] memory) {
        return hostListings[host];
    }
}
