import React from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import useDataProcessing from './useDataProcessing';


function DashboardPage({ data }) {
    // Extract price and date data for the chart
    const prices = data.map(tokenData => tokenData.historical_prices.map(p => p.ethAmount));
    const dates = data.map(tokenData => tokenData.historical_prices.map(p => new Date(p.createdAt).toLocaleString()));

    // Calculate the current buy price (you can adjust this logic)
    const currentBuyPrice = prices[prices.length - 1];

    // Calculate average prices (simple example for the sake of demonstration)
    const averageBuyPrice = prices.filter(price => price.isBuy).reduce((a, b) => a + b, 0) / prices.length;
    const averageSellPrice = prices.filter(price => !price.isBuy).reduce((a, b) => a + b, 0) / prices.length;

    // Line chart data
    const lineChartData = {
        labels: dates,
        datasets: [{
            label: 'Price over Time',
            data: prices,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)'
        }]
    };

    return (
        <div>
            {/* Price Movement Graph */}
            <div>
                <h2>Price Movement Over Time</h2>
                <Line data={lineChartData} />
            </div>

            {/* Current Buy Price */}
            <div>
                <h2>Current Buy Price</h2>
                <p>{currentBuyPrice}</p>
            </div>

            {/* Average Buy/Sell Price */}
            <div>
                <h2>Average Prices</h2>
                <p>Average Buy Price: {averageBuyPrice}</p>
                <p>Average Sell Price: {averageSellPrice}</p>
            </div>

            {/* Placeholder for other visualizations */}
            <div>
                {/* You can add more charts or visual representations here */}
            </div>
        </div>
    );
}

export default DashboardPage;
