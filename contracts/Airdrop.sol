// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.3;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract Airdrop is Initializable, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    // address of PCR
    address public token;

    // amount for airdrop: 1000 PCR
    uint256 public airdropAmount;

    // addresses eligble for airdrop
    mapping(address => bool) public inAirDrop;

    // final claim time of airdrop
    uint256 public endTime;

    function initialize(address _token, uint256 _airdropAmount, uint256 _endTime) external initializer {
        __Ownable_init();

        airdropAmount = _airdropAmount;
        endTime = _endTime;
        token = _token;
    }

    function addRecipient(address[] memory recps) external onlyOwner {
        for (uint256 i = 0; i < recps.length; i += 1) {
            inAirDrop[recps[i]] = true;
        }
    }

    function withdrawToken() external onlyOwner {
        uint256 balance = IERC20Upgradeable(token).balanceOf(address(this));
        IERC20Upgradeable(token).safeTransfer(msg.sender, balance);
    }

    function claim() external {
        require(block.timestamp < endTime, "can't claim any more");
        require(inAirDrop[msg.sender] == true, "not in airdrop");
        inAirDrop[msg.sender] = false;
        IERC20Upgradeable(token).safeTransfer(msg.sender, airdropAmount);
    }
}
