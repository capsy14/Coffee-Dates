import React, { useEffect, useState } from "react";
import "../styles/memos.css";

const Memos = ({ state }) => {
  const [memos, setMemos] = useState([]);
  const { contract } = state;

  useEffect(() => {
    const memosMessage = async () => {
      try {
        if (contract && contract.getMemos) {
          const memos = await contract.getMemos();
          setMemos(memos);
        }
      } catch (error) {
        console.error("Error fetching memos:", error);
        // Set empty array if contract call fails
        setMemos([]);
      }
    };
    contract && memosMessage();
  }, [contract]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); 
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = String(hours % 12 || 12).padStart(2, "0"); 
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };
  return (
    <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 border-b border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
          💕 Love Transactions
        </h2>
        <p className="text-center text-gray-600 mt-2">Recent coffee purchases with love messages</p>
      </div>
      
      <div className="p-6">
        {memos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">☕</div>
            <p className="text-gray-500 text-lg">No transactions yet</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to send some love!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Message</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">From Address</th>
                  </tr>
                </thead>
                <tbody>
                  {memos.map((memo, index) => (
                    <tr key={memo.timestamp} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="py-4 px-6 font-medium text-gray-800">{memo.name}</td>
                      <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{memo.message}</td>
                      <td className="py-4 px-6 text-gray-500 text-sm whitespace-nowrap">{formatDate(memo.timestamp)}</td>
                      <td className="py-4 px-6 text-gray-400 text-xs font-mono break-all">{memo.from}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {memos.map((memo, index) => (
                <div key={memo.timestamp} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {memo.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{memo.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(memo.timestamp)}</span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-600 italic">"{memo.message}"</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2">
                    <p className="text-xs text-gray-400 font-mono break-all">
                      <span className="font-medium">From:</span> {memo.from}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Memos;
