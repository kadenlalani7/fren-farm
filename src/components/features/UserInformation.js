import React from "react";
import UserInfoBox from "../common/UserInfoBox";

function UserInformation({ data, handleBoxSelection }) {
  return (
    <div className="p-y-4 h-full flex flex-col items-center justify-center w-full">
      <div className="items-center justify-center"><h2 className="text-lg font-semibold py-2">User Information</h2></div>
      <div className="overflow-y-auto h-[90%] border-x-1 border-slate-200 rounded-b-lg">
        {data.map((tokenData) => {
          const recentPrice =
            tokenData.historical_prices.length > 0
              ? tokenData.historical_prices[0]
              : null;
          const isBuy = recentPrice ? recentPrice.isBuy : false;
          const remainingChars = recentPrice
            ? 22 - String(recentPrice.ethAmount).length
            : 22; // Set to 22 if recentPrice is null
          const paddedAmount = recentPrice
            ? String(recentPrice.ethAmount).slice(5) + "0".repeat(remainingChars)
            : "N/A"; // Set to "N/A" if recentPrice is null
          const rightContent = recentPrice && (
            <div className="flex flex-col items-center">
              <p
                className={`text-[7px] ${
                  isBuy ? "text-green-600" : "text-red-600"
                }`}
              >
                {isBuy ? "Last Bought" : "Last Sold"} At:
              </p>
              <div className="flex flex-col items-center">
                <span className="text-[20px]">
                  {" "}
                  {String(recentPrice.ethAmount).slice(0, 5)}
                </span>
                <span className="text-[6px]"> {paddedAmount}</span>
              </div>
            </div>
          );

          return (
            <UserInfoBox
              key={tokenData.token.twitterUsername}
              tokenData={tokenData}
              onClick={() => handleBoxSelection(tokenData)}
              rightContent={rightContent}
            />
          );
        })}
      </div>
    </div>
  );
}

export default UserInformation;
