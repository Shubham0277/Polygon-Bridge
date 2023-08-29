// Import required libraries and JSON files
const hre = require("hardhat");
const fxRootContractABI = require("../fxRootContractABI.json"); // Replace with the actual ABI file path
const tokenContractJSON = require("../artifacts/contracts/MyNFT.sol/MyNFT.json"); // Replace with the actual path to your NFT contract JSON file

// Define contract and wallet addresses
const tokenAddress = "0xE9181dbAC9B0D9380d3B362f1f49074Bd67Aad55"; // Replace with your NFT contract address
const FxERC721RootTunnel = "0xF9bc4a80464E48369303196645e876c8C7D972de"; // Replace with your FxERC721RootTunnel contract address
const walletAddress = "0x0D53f8320766e9384846Da681dbd51db9D1Ef228"; // Replace with your wallet address

async function main() {
  // Get the contract factory for your NFT contract (replace "MyNFT" with your actual contract name)
  const contract = await hre.ethers.getContractFactory("MyNFT");

  // Get instances of the token contract and FxERC721RootTunnel contract
  const tokenContract = await hre.ethers.getContractAt(tokenContractJSON.abi, tokenAddress);
  const fxContract = await hre.ethers.getContractAt(fxRootContractABI, FxERC721RootTunnel);

  // Approve the FxERC721RootTunnel contract to transfer tokens
  const approveTx = await tokenContract.approve(FxERC721RootTunnel, 1);
  await approveTx.wait();

  console.log('Approval confirmed');

  // Define the NFT contract addresses and token IDs you want to deposit
  const nftAddresses = [tokenAddress]; // Add more NFT contract addresses if needed
  const tokenIds = [1];

  // Function to deposit NFTs to the FxERC721RootTunnel
  async function depositNFTs(fxContract, nftAddresses, tokenIds, walletAddress) {
    for (let i = 0; i < nftAddresses.length; i++) {
      const nftAddress = nftAddresses[i];
      const tokenId = tokenIds[i];
      const depositTx = await fxContract.deposit(nftAddress, walletAddress, tokenId, "0x6556");
      await depositTx.wait();
    }
  }

  // Call the depositNFTs function to deposit NFTs to the FxERC721RootTunnel
  await depositNFTs(fxContract, nftAddresses, tokenIds, walletAddress);

  console.log("Tokens deposited");
}

// Execute the main function and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
