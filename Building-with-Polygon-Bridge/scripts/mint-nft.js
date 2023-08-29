// Import and configure dotenv to load environment variables from a .env file
require("dotenv").config();

// Load environment variables
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Import the necessary libraries
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL); // Initialize Alchemy Web3

// Load the JSON contract ABI
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

// Define the contract address and create an instance of the contract
const contractAddress = "0xE9181dbAC9B0D9380d3B362f1f49074Bd67Aad55";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

// Function to mint an NFT
async function mintNFT(tokenURI) {
  // Get the latest nonce for the sender's address
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

  // Define the transaction parameters
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000, // Specify the gas limit
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  };

  // Sign the transaction with the sender's private key
  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

  signPromise
    .then((signedTx) => {
      // Send the signed transaction to the Ethereum network
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (err, hash) {
        if (!err) {
          console.log(
            "The hash of your transaction is: ",
            hash,
            "\nCheck Alchemy's Mempool to view the status of your transaction!"
          );
        } else {
          console.log("Something went wrong when submitting your transaction:", err);
        }
      });
    })
    .catch((err) => {
      console.log("Promise failed:", err);
    });
}

// Call the mintNFT function with the tokenURI to mint a new NFT
mintNFT(
  "https://gateway.pinata.cloud/ipfs/QmQX2tK3AYNPyEiaFxf6fX97QmoTfXxsLhHmaKcqvAdUoq"
);
