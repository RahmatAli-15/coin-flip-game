// src/CoinImages.jsx
import React from 'react';

const CoinImages = () => {
  return (
    <div className="hidden">
      <svg id="coin-heads" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#ffd700" />
        <text x="50%" y="50%" textAnchor="middle" stroke="#000" strokeWidth="1px" dy=".3em">Heads</text>
      </svg>
      <svg id="coin-tails" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#c0c0c0" />
        <text x="50%" y="50%" textAnchor="middle" stroke="#000" strokeWidth="1px" dy=".3em">Tails</text>
      </svg>
    </div>
  );
};

export default CoinImages;
