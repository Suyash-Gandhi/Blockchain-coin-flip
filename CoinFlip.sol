// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    event CoinFlipped(address indexed player, uint256 betAmount, bool won);

    constructor() {
        owner = msg.sender;
    }

    function flipCoin(bool guess) external payable {
        require(msg.value > 0, "You must bet some MATIC!");
        bool result = (block.timestamp % 2 == 0);
        
        if (result == guess) {
            uint256 winnings = msg.value * 2;
            payable(msg.sender).transfer(winnings);
            emit CoinFlipped(msg.sender, msg.value, true);
        } else {
            emit CoinFlipped(msg.sender, msg.value, false);
        }
    }

    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
