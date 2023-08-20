import React from "react";
import react, { useEffect, useState } from "react";
import abi from "../contracts/coffeekachakkar.json";
import { ethers } from "ethers";
// import './App.css';
import Buy from "./Buy";
import Memos from "./Memos";
import WalletConnect from "./WalletConnect";
const Home = ({ account, setAccount, paid, setPaid }) => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS_HOME;
      const contractAbi = abi.abi;
      try {
        const { ethereum } = window;
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        setState({ provider, signer, contract });
        setPaid(true);
      } catch (e) {
        console.log(e);
      }
    };
    connectWallet();
  }, []);
  console.log(state);
  return (
    <div className="App mt-10">
      <WalletConnect account={account} setAccount={setAccount} />
      {/* <h1 className="lovmatch">Koffee ka Chakkar❤️</h1> */}
      <Buy state={state} />
      <Memos state={state} />
    </div>
  );
};

export default Home;
