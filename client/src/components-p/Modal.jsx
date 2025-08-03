import { useEffect } from "react";
import "./modal.css";
const Modal = ({ setModalOpen, contract }) => {
  const sharing = async () => {
    const address = document.querySelector(".address").value;
    await contract.allow(address);
    setModalOpen(false);
  };
  useEffect(() => {
    const accessList = async () => {
      const addressList = await contract.shareAccess();
      let select = document.querySelector("#selectNumber");
      const options = addressList;

      for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        let e1 = document.createElement("option");
        e1.textContent = opt;
        e1.value = opt;
        select.appendChild(e1);
      }
    };
    contract && accessList();
  }, [contract]);
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-2xl" style={{background: 'linear-gradient(to right, #DEB887, #CD853F)'}}>
            <h2 className="text-xl font-bold text-center">🔗 Share Gallery Access</h2>
            <p className="text-amber-100 text-sm text-center mt-2">
              Grant someone access to view your photos
            </p>
          </div>
          
          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Address Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Wallet Address
              </label>
              <input
                type="text"
                className="address w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="0x1234...abcd"
              />
              <p className="text-xs text-gray-500">
                Enter the wallet address of the person you want to share with
              </p>
            </div>

            {/* Access List */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Current Access List
              </label>
              <select 
                id="selectNumber"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
              >
                <option>People with access will appear here</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 pt-0">
            <button 
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={sharing}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
              style={{background: 'linear-gradient(to right, #DEB887, #CD853F)'}}
            >
              Share Access
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;