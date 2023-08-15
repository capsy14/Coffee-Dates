import React, { useEffect, useState } from 'react';
import '../styles/memos.css'; 

const Memos = ({ state }) => {
  const [memos, setMemos] = useState([]);
  const { contract } = state;

  useEffect(() => {
    const memosMessage = async () => {
      const memos = await contract.getMemos();
      setMemos(memos);
    };
    contract && memosMessage();
  }, [contract]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0'); // Convert to 12-hour format
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };
  return (
    <div className="memo-container"> {/* Apply the CSS class to the container */}
      <h2 className='all-transactions'>Love Transactions</h2>
      <table className="memo-table"> {/* Apply the CSS class to the table */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Message</th>
            <th>Timestamp</th>
            <th>From</th>
          </tr>
        </thead>
        <tbody>
          {memos.map((memo) => (
            <tr key={memo.timestamp}>
              <td>{memo.name}</td>
              <td>{memo.message}</td>
              <td>{formatDate(memo.timestamp)}</td>
              <td>{memo.from}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Memos;
