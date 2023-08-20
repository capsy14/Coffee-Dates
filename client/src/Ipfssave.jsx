import "./styles/ipfssave.css";
import Upload from "./contracts/coffeekachakkar.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components-p/FileUpload";
import Display from "./components-p/Display";
import Modal from "./components-p/Modal";

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
      <div className="toporder">
        <img className="photoipfs" src="https://i.imgur.com/xmrplgH.png" />
        <h1 className="headingdapp">dappDrive</h1>
      </div>
      <p className="middleliners">
        Collecting love's snapshots, our hearts treasure each frame of
        togetherness.
      </p>
      <p className="myAccount">
        Account : {account ? account : "Not Connected"}
      </p>
      <FileUpload account={account} provider={provider} contract={contract} />
      <Display contract={contract} account={account} />
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
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
