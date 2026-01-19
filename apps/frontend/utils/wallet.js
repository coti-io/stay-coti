// import { ethers } from "ethers";

export async function connectWallet() {
  // if (typeof window.ethereum !== "undefined") {
  //   try {
  //     await window.ethereum.request({ method: "eth_requestAccounts" });
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const address = await signer.getAddress();
  //     // Ask user to sign a message
  //     const message = `Welcome to COTI! Please sign this message to verify your wallet ownership.`;
  //     const signature = await signer.signMessage(message);
  //     console.log("Wallet connected and verified:", address);
  //     return { address, signature };
  //   } catch (error) {
  //     console.error("Error connecting to wallet:", error);
  //     return null;
  //   }
  // } else {
  //   console.error("No Ethereum wallet found");
  //   return null;
  // }
}
