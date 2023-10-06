import React from "react";

function TransactionLogs({ data }) {
  // Render each token's historical price data
  const renderHistoricalPrices = (tokenData) => {
    return tokenData.historical_prices.map((price, idx) => (
      <div key={idx} className="border rounded p-2 m-2">
        <p className="text-xs">Date: {new Date(price.createdAt).toLocaleString()}</p>
        <p className="text-xs">ETH Amount: {price.ethAmount}</p>
        <p className="text-xs">Type: {price.isBuy ? "Buy" : "Sell"}</p>
        <p className="text-xs">{price.isUserTrade ? "User Trade" : "Not a user trade"}</p>
      </div>
    ));
  }

  // Render each token's transaction logs
  const renderTokenData = (tokenData) => {
    return (
      <div key={tokenData.token.address} className="col-span-2 p-4 h-full overflow-y-scroll">
        <h3 className="text-center text-xs">Twitter Username: {tokenData.token.twitterUsername}</h3>
        <p className="text-xs break-words">Token Address: {tokenData.token.address}</p>
        <p className="text-xs">Token Balance: {tokenData.token.balance}</p>
        <div className="overflow-y-scroll h-48">
          {renderHistoricalPrices(tokenData)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-y-4 h-full overflow-y-auto">
    {data.map(renderTokenData)}
    </div>
  );
}

export default TransactionLogs;
