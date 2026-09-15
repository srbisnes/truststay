// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputationPoints
 * @notice Non-transferable (soulbound-style) points for TrustStay users.
 * @dev Points can only be minted/burned by the protocol (BookingEscrow or admin).
 *      Transfer is disabled to keep reputation tied to the wallet/identity.
 *      Future: integrate with ERC-5192 or similar soulbound standard.
 */
contract ReputationPoints is ERC20, Ownable {
    mapping(address => bool) public minters;

    event MinterUpdated(address indexed minter, bool allowed);
    event PointsAwarded(address indexed user, uint256 amount, string reason);
    event PointsSlashed(address indexed user, uint256 amount, string reason);

    error TransfersDisabled();
    error NotMinter();

    constructor(address initialOwner) ERC20("TrustStay Reputation", "TSR") Ownable(initialOwner) {
        minters[initialOwner] = true;
    }

    function setMinter(address minter, bool allowed) external onlyOwner {
        minters[minter] = allowed;
        emit MinterUpdated(minter, allowed);
    }

    function award(address user, uint256 amount, string calldata reason) external {
        if (!minters[msg.sender]) revert NotMinter();
        _mint(user, amount);
        emit PointsAwarded(user, amount, reason);
    }

    function slash(address user, uint256 amount, string calldata reason) external {
        if (!minters[msg.sender]) revert NotMinter();
        _burn(user, amount);
        emit PointsSlashed(user, amount, reason);
    }

    // Soulbound: disable transfers
    function transfer(address, uint256) public pure override returns (bool) {
        revert TransfersDisabled();
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert TransfersDisabled();
    }

    function approve(address, uint256) public pure override returns (bool) {
        revert TransfersDisabled();
    }
}
