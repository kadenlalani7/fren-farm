import React from 'react';

function Prices({ currentBuyPrice }) {
  return (
    <div className="col-span-1 p-4 overflow-auto h-full">
      <h2 className="text-center text-sm">Current Buy Price</h2>
      <p className="text-center">{currentBuyPrice}</p>
    </div>
  );
}

export default Prices;
