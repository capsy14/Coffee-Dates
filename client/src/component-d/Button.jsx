import React from 'react';

const Button = ({ children, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 px-4 py-3 rounded-lg text-white ${
        disabled ? 'opacity-50' : ''
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
