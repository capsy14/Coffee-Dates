import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import abi from "../contracts/coffeekachakkar.json"; // Update the path to your JSON file

const WalletConnect = ({ account, setAccount }) => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

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
          setAccount(account);
          setConnected(true);
          provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS_WALLETCONNECT;
          const contractABI = abi.abi;

          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          setState({ provider, signer, contract });
        } else {
          alert("Please install MetaMask to use this app.");
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
        setAccount(account);
      } else {
        alert("Please install MetaMask to use this app.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const success = () => {
    toast.success(`Connected Account: ${account} `, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        {connected ? (
          <>
            {" "}
            <button onClick={success}>Connected to Metamask</button>
            <ToastContainer className="mt-14" />
          </>
        ) : (
          <button onClick={requestAccount}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
};

export default WalletConnect;

// export function Account() {
//   return <h1 className="connected">{acc}</h1>;
// }
// module.exports = { Account };
