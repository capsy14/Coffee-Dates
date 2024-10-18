import "../styles/ipfssave.css";
import Upload from "../contracts/coffeekachakkar.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "../components-p/FileUpload";
import Display from "../components-p/Display";
import Modal from "../components-p/Modal";

function Ipfssave({ paid }) {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS_IPFSSAVE;
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        alert("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <div>
      <div className=" items-center mt-9 ">
        <img
          className=" w-1/4 opacity-40 mx-auto"
          src="https://i.imgur.com/xmrplgH.png"
        />
      </div>
      <p className=" text-center mt-2 text-sm sm:text-2xl text-wrap">
        Collecting love's snapshots, our hearts treasure each frame of
        togetherness.
      </p>
      <p className=" text-center text-slate-600 text-xs sm:text-xl text-wrap mt-3">
        Account : {account ? account : "Not Connected"}
      </p>
      <FileUpload account={account} provider={provider} contract={contract} />
      <Display contract={contract} account={account} />
      {!modalOpen && (
        <button
          className="w-1/5 mx-auto block mt-5 drop-shadow-lg text-xs sm:text-xl"
          onClick={() => setModalOpen(true)}
        >
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
    </div>
  );
}

export default Ipfssave;
