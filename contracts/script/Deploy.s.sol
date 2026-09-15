// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ListingRegistry} from "../src/ListingRegistry.sol";
import {BookingEscrow} from "../src/BookingEscrow.sol";
import {ReputationPoints} from "../src/ReputationPoints.sol";

/**
 * @notice Deploy script for TrustStay core contracts.
 * Usage:
 *   forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC --broadcast --private-key $PK
 *
 * On Base mainnet use the official USDC address.
 * Base Sepolia USDC mock or official test token should be used in testing.
 */
contract Deploy is Script {
    // Base Mainnet USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
    // For Sepolia use a mock or the official test USDC if available.

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address usdc = vm.envAddress("USDC_ADDRESS"); // set in .env
        address feeRecipient = vm.envOr("FEE_RECIPIENT", deployer);

        vm.startBroadcast(deployerPrivateKey);

        ListingRegistry registry = new ListingRegistry(deployer);
        console.log("ListingRegistry:", address(registry));

        BookingEscrow escrow = new BookingEscrow(usdc, address(registry), feeRecipient, deployer);
        console.log("BookingEscrow:", address(escrow));

        ReputationPoints reputation = new ReputationPoints(deployer);
        console.log("ReputationPoints:", address(reputation));

        // Wire reputation as minter for escrow later if needed
        reputation.setMinter(address(escrow), true);

        vm.stopBroadcast();
    }
}
