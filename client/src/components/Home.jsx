import React from "react";
import react, { useEffect, useState } from "react";
import abi from "../contracts/coffeekachakkar.json";
import { ethers } from "ethers";
// import './App.css';
import Buy from "./Buy";
import Memos from "./Memos";
import Product from "./data.json";
import WalletConnect from "./WalletConnect";
import { useParams } from "react-router-dom";
const Home = ({ account, setAccount, paid, setPaid }) => {
  const param = useParams();
  const idd = param.id;
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-4">
            Koffee ka Chakkar ❤️
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Send love through coffee payments on the blockchain
          </p>
        </div>
        
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <div className="w-full flex justify-center px-2">
            <Buy state={state} id={idd} />
          </div>
          <div className="w-full flex justify-center px-2">
            <Memos state={state} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
