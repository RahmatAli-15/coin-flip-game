import React, { useState } from "react";
import Web3 from "web3";
import { Button } from "@mui/material";
import { TOKEN_ADDRESS, TOKEN_ABI } from "../contracts/TokenABI";

async function getAccount() {
  const web3 = new Web3(window.ethereum);
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
}

async function getTokenBalance(account) {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
  const balance = await contract.methods.balanceOf(account).call();
  return web3.utils.fromWei(balance, "ether");
}

export default function ConnectButton() {
  const [accountAddress, setAccountAddress] = useState("");
  const [balance, setBalance] = useState("");

  const connectButtonOnClick = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const account = await getAccount();
        setAccountAddress(account);
        const tokenBalance = await getTokenBalance(account);
        setBalance(tokenBalance);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.log("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={connectButtonOnClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
      >
        {!!accountAddress ? `${accountAddress.substring(0, 6)}...${accountAddress.substring(accountAddress.length - 4)}` : "Connect Wallet"}
      </Button>
      {accountAddress && balance && (
        <div className="mt-2 text-white">
          <p>Token Balance: {balance} TUT</p>
        </div>
      )}
    </div>
  );
}
