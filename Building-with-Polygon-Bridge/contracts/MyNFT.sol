// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenCounter;

    constructor() ERC721("Code Eater NFT", "CEN") {}

    function mintToken(address recipient, uint256 tokenId, string memory tokenURI)
        public
        onlyOwner
    {
        require(!_exists(tokenId), "Token with this ID already exists");
        
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
}
