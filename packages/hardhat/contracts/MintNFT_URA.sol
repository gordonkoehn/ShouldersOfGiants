//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MintNFT_URA is ERC721 {
    // using SafeERC20 for IERC20;
    // IERC20 public usdc; // USDC token contract

    address public owner; // Address to receive USDC
    uint256 public price; // Price in USDC
    uint256 public nextTokenId = 1; // Token ID

    constructor(address _owner, uint256 _price) ERC721("G15N University Resources Access", "G15N") {
        owner = _owner;
        price = _price;
    }

    function mintERC20() external payable {
        require(msg.value == price, 'MintNFT_URA: Wrong payment amount');
        // usdc.safeTransferFrom(msg.sender, owner, price);
        uint tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);   
    }

    function _baseURI() internal override view returns (string memory) {
        return "https://g15n.net/ethglobalnfts/nft.json";
    }

    // function mintERC20WithPermit( 
    //     uint256 deadline,
    //     uint8 v,
    //     bytes32 r,
    //     bytes32 s) external {
    //     IERC20Permit(address(usdc)).permit(msg.sender, address(this), price, deadline, v, r, s);
    //     usdc.safeTransferFrom(msg.sender, owner, price);
    //     uint tokenId = nextTokenId++;
    //     _safeMint(msg.sender, tokenId);   
    // }


}
