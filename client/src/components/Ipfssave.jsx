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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4" style={{backgroundColor: '#ECE4CF'}}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl" style={{background: 'linear-gradient(to bottom right, #DEB887, #CD853F)'}}>
              <img
                className="w-16 h-16 md:w-20 md:h-20 opacity-90"
                src="https://i.imgur.com/xmrplgH.png"
                alt="IPFS Logo"
              />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-4">
            💕 Love's Photo Gallery
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            Collecting love's snapshots, our hearts treasure each frame of togetherness.
          </p>
          
          {/* Account Status */}
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
            <div className={`w-3 h-3 rounded-full ${account ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm md:text-base font-medium text-gray-700">
              {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Not Connected"}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
                📸 Upload Memory
              </h2>
              <FileUpload account={account} provider={provider} contract={contract} />
            </div>
          </div>
          
          {/* Display Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
                🖼️ Photo Gallery
              </h2>
              <Display contract={contract} account={account} />
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="flex justify-center">
          {!modalOpen && (
            <button
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
              style={{background: 'linear-gradient(to right, #DEB887, #CD853F)'}}
              onClick={() => setModalOpen(true)}
            >
              <span className="text-xl">🔗</span>
              <span>Share Gallery Access</span>
            </button>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
        )}
      </div>
    </div>
  );
}

export default Ipfssave;
