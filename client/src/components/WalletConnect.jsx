import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer } from "react-toastify";
import { showToast } from "../utils/toastUtils";
import "react-toastify/dist/ReactToastify.css";
import abi from "../contracts/coffeekachakkar.json";
import { useDispatch, useSelector } from "react-redux";
import { SET_ACCOUNT, selectAccount } from "../redux/slice/userSlice";

const WalletConnect = () => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connectToBlockchain = async () => {
      try {
        const { ethereum } = window;
        let provider;
        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const account = accounts[0];
          setConnected(true);
          provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractAddress = import.meta.env
            .VITE_CONTRACT_ADDRESS_WALLETCONNECT;
          console.log(contractAddress + " hello");
          const contractABI = abi.abi;

          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          setState({ provider, signer, contract });
        } else {
          showToast.success("Please install MetaMask to use this app.");
        }
      } catch (error) {
        alert(error.message);
      }
    };

    connectToBlockchain();
  }, []);

  const requestAccount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        const account = accounts[0];
        dispatch(SET_ACCOUNT(account));
        localStorage.setItem("account", account);
        showToast.success(`Successfully connected ${account}`);
      } else {
        showToast.error("Please install MetaMask to use this app.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const success = () => {
    const account_data = localStorage.getItem("account");
    showToast.info(`Metamask is connected`);
  };

  return (
    <>
      {/* Fixed position wallet button in bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        {connected ? (
          <button 
            onClick={success} 
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-full font-semibold text-sm shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 border-2 border-amber-400 relative overflow-hidden"
            style={{background: 'linear-gradient(to right, #f59e0b, #DEB887)'}}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg animate-pulse">🦊</span>
              <span className="hidden sm:inline">Connected</span>
              <span className="sm:hidden text-xs">🦊</span>
            </div>
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 translate-x-full hover:translate-x-[-100%]"></div>
          </button>
        ) : (
          <button 
            onClick={requestAccount} 
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-4 rounded-full font-bold text-sm sm:text-base shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2 border-2 border-amber-400 pulse-animation"
            style={{background: 'linear-gradient(to right, #DEB887, #CD853F)'}}
          >
            <span className="text-lg">🦊</span>
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </button>
        )}
      </div>
      
      {/* Toast container positioned to not overlap with button */}
      <ToastContainer 
        className="mt-14" 
        style={{ bottom: '100px', right: '24px' }}
        position="bottom-right"
      />
      
    </>
  );
};

export default WalletConnect;

// export function Account() {
//   return <h1 className="connected">{acc}</h1>;
// }
// module.exports = { Account };
