import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Filtered from "./features/Filtered";
import Prices from "./features/Prices";
import UserInformation from "./features/UserInformation";
import PriceChart from "./features/PriceChartV2";
import TransactionLogs from "./features/TransactionLogs";
import BiggestWinners from "./features/BiggestWinners"

function ResultsPage() {
  const { address } = useParams();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPriceChartExpanded, setIsPriceChartExpanded] = useState(false);
  const chartContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleBoxSelection = (user) => {
    setSelectedUser(user);
  };

  const togglePriceChartExpanded = () => {
    setIsPriceChartExpanded(!isPriceChartExpanded);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://fren-api-app-9351a5576832.herokuapp.com/get_purchase_data/${address}`
        );
        const retrievedData = await response.json();

        // Only take the first 50 results
        const slicedData = retrievedData.slice(0, 50);
        setData(slicedData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartContainerRef.current) {
      const { width, height } = chartContainerRef.current.getBoundingClientRect();
      setContainerWidth(width);
      setContainerHeight(height);
    }
  }, [isPriceChartExpanded]);

  const currentBuyPrice = data.reduce((maxPrice, tokenData) => {
    const tokenPrices = tokenData.historical_prices.filter(
      (price) => price.isBuy
    );
    const latestPrice =
      tokenPrices.length > 0
        ? tokenPrices[tokenPrices.length - 1].ethAmount
        : 0;
    return Math.max(maxPrice, latestPrice);
  }, 0);

  const filteredData = data.map((tokenData) => ({
    ...tokenData,
    historical_prices: tokenData.historical_prices.filter((price) => {
      if (filter === "buy") return price.isBuy;
      if (filter === "sell") return !price.isBuy;
      return true;
    }),
  }));

  return (
    <div className="bg-background text-text rounded w-screen h-screen">
     <div className="text-center text-4xl font-bold pt-4">Fren Farm</div>
    <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[95%]">
      
      {/* <div id="FilteredContainer" className="bg-primary rounded">
        <Filtered filter={filter} setFilter={setFilter} />
      </div> */}

      <div id="PriceChartContainer" className={`bg-primary rounded ${
          isPriceChartExpanded ? "col-span-3 row-span-2" : "col-span-2"
        }`} ref={chartContainerRef}
      >
        <PriceChart
          data={data}
          selectedUser={selectedUser}
          onClick={() => togglePriceChartExpanded()}
          isPriceChartExpanded={isPriceChartExpanded}
        />
      </div>

      <div id="PricesContainer" className="bg-primary rounded">
        <Prices currentBuyPrice={currentBuyPrice} />
      </div>

      <div id="TransactionLogsContainer" className="bg-primary rounded">
        <TransactionLogs data={filteredData} />
      </div>

      <div id="UserInformationContainer" className="bg-primary rounded">
        <UserInformation data={data} handleBoxSelection={handleBoxSelection} />
      </div>

      <div id="BiggestWinnersContainer" className="bg-primary rounded-lg">
        <BiggestWinners data={data} />
      </div>
      </div>
    </div>
);

}

export default ResultsPage;
