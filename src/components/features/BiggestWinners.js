import React from 'react';
import UserInfoBox from '../common/UserInfoBox';

// Utility function to compute price based on supply and amount
function getPrice(supply, amount) {
    const sum1 = supply === 0 ? 0 : ((supply - 1) * supply * (2 * (supply - 1) + 1)) / 6;
    const sum2 = supply === 0 && amount === 1 ? 0 : ((supply - 1 + amount) * (supply + amount) * (2 * (supply - 1 + amount) + 1)) / 6;
    return (sum2 - sum1) * 1 / 16000;
}

// Compute sell price
function getSellPrice(supply, amount) {
    return getPrice(supply - amount, amount);
}

// Compute sell price after deducting fee
function getSellPriceAfterFee(sharesSupply, amount, protocolFeePercent, subjectFeePercent) {
    const price = getSellPrice(sharesSupply, amount);
    const totalFee = price * (protocolFeePercent + subjectFeePercent);
    return price - totalFee;
}

function BiggestWinners({ data, handleBoxSelection }) {
    const protocolFeePercent = 0.05;  // Adjust as necessary
    const subjectFeePercent = 0.05;   // Adjust as necessary

    // Compute the sellable total of a user
    function calculateSellableTotal(buys, sharesSupply) {
        return buys.reduce((acc, buy) => acc + getSellPriceAfterFee(sharesSupply, 1, protocolFeePercent, subjectFeePercent), 0);
    }

    // Compute profit or loss for each user
    const profits = data.flatMap(dataPoint => {
        const userBuys = dataPoint.historical_prices.filter(entry => entry.isBuy && entry.isUserTrade);

        if (userBuys.length === 0) return [];
        const sellableTotal = calculateSellableTotal(userBuys, dataPoint.user.shareSupply);
        const totalCost = userBuys.reduce((sum, buy) => sum + buy.ethAmount, 0);
        return {
            ...dataPoint,
            profit: sellableTotal - totalCost,
            purchasePrice: totalCost,
            sellableTotal
        };
    });

    const sortedProfits = profits.sort((a, b) => b.profit - a.profit);

    return (
        
        <div className="p-y-4 h-full flex flex-col items-center justify-center w-full">
            <div className="items-center justify-center"><h2 className="text-lg font-semibold py-2">Profit / Loss</h2></div>
            <div className="overflow-y-auto h-[90%] border-x-1 border-slate-200 rounded-b-lg">
          {sortedProfits.map((tokenData, index) => {
            const displayPriceInEth = parseFloat(tokenData.user.displayPrice) / (10 ** 18);
            const remainingChars = 22 - String(displayPriceInEth).length; // 10 or any other total length you prefer
            const paddedAmount = String(tokenData.profit).slice(5) + "0".repeat(remainingChars);
              const rightContent = (
                <div className="flex flex-col items-center">
                    <p
                    className={`text-[7px] ${
                        parseFloat(tokenData.profit) > 0 ? "text-green-600" : "text-red-600"
                    }`}
                    >
                      {parseFloat(tokenData.profit) > 0 ? 'Profit made:' : 'Loss so far:'}
                  </p>
                  <div className="flex flex-col items-center">
                  <span className="text-[20px]">
                {" "}
                {String(tokenData.profit).slice(0, 5)}
              </span>
              <span className="text-[6px]">
                {" "}
                {paddedAmount}ETH
              </span>
                  </div>
                  </div>
              );

              return <UserInfoBox
                  key={index}
                  tokenData={tokenData}
                  onClick={() => handleBoxSelection(tokenData)}
                  rightContent={rightContent}
              />;
          })}
      </div>
      </div>
  );
}

export default BiggestWinners;
