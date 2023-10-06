import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function PriceChart({ data, selectedUser, onClick, isPriceChartExpanded }) {
  // State for dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Ref for the chart container
  const chartRef = useRef(null);

  // Handle resizing
  useEffect(() => {
    function handleResize() {
      if (chartRef.current) {
        setDimensions({
          width: chartRef.current.offsetWidth,
          height: chartRef.current.offsetHeight ? chartRef.current.offsetHeight : 300,
        });
      }
    }

    // Call once to set initial dimensions
    handleResize();

    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle chart updates
  useEffect(() => {
    const container = d3.select(chartRef.current);
    container.selectAll("*").remove(); // Clear the chart container

    const handleTransitionEnd = () => {
      container.selectAll("*").remove(); // Clear the chart container again
      let updatedHistoricalData = [];

      if (selectedUser) {
        updatedHistoricalData = selectedUser.historical_prices;
      } else if (data) {
        // Sorting and formatting data
        const sortedData = data.map(tokenData => ({
          ...tokenData,
          historical_prices: tokenData.historical_prices
            .slice()
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .filter(item => !isNaN(item.createdAt))
            .map(price => ({
              date: new Date(price.createdAt),
              ethAmount: price.ethAmount,
            })),
        }));

        if (sortedData.length > 0) {
          updatedHistoricalData = sortedData[0].historical_prices;
        }
      }

      if (updatedHistoricalData.length > 0) {
        generateGraph(updatedHistoricalData);
      }
    };

    if (chartRef.current) {
      // Add the event listener
      chartRef.current.addEventListener('transitionend', handleTransitionEnd);
    }

    let historicalData = [];

    if (selectedUser) {
      historicalData = selectedUser.historical_prices;
    } else if (data) {
      // Sorting and formatting data
      const sortedData = data.map(tokenData => ({
        ...tokenData,
        historical_prices: tokenData.historical_prices
          .slice()
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .filter(item => !isNaN(item.createdAt))
          .map(price => ({
            date: new Date(price.createdAt),
            ethAmount: price.ethAmount,
          })),
      }));

      if (sortedData.length > 0) {
        historicalData = sortedData[0].historical_prices;
      }
    }

    if (historicalData.length > 0) {
      generateGraph(historicalData);
    }

    // Clean up the event listener
    return () => {
      if (chartRef.current) {
        chartRef.current.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
  }, [data, selectedUser, dimensions]);

  // Generate the graph
  const generateGraph = (historicalData) => {
    if (!historicalData || historicalData.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Clear any previous SVG elements before drawing a new chart
    d3.select(chartRef.current).selectAll("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, historicalData.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(historicalData, d => d.ethAmount)])
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat((d, i) => {
        if (historicalData[i] && historicalData[i].date instanceof Date) {
          const timestamp = historicalData[i].date;
          return timestamp.toLocaleTimeString();
        }
        return "";
      });

    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    // Gridlines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""));

    // Draw squares at data points
    svg.selectAll("square")
      .data(historicalData)
      .enter()
      .append("rect")
      .attr("class", "data-square")
      .attr("x", (d, i) => xScale(i) - 3)
      .attr("y", d => yScale(d.ethAmount) - 3)
      .attr("width", 6)
      .attr("height", 6)
      .attr("fill", d => d.isUserTrade ? "red" : "blue");

    // Line generator
    const line = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.ethAmount));

    svg.append("path")
      .datum(historicalData)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2);

    // Set the background color
    svg.style("background-color", "#3464A2");
  };

  return (
    <div
      className={`bg-black transition duration-150 ease-in-out 
      ${isPriceChartExpanded ? 'w-[90%] h-[90%] fixed top-[5%] left-[5%]' : 'col-span-1 row-span-1'}`}
      onClick={onClick}
    >
      <div className="p-4 h-full">
        <div ref={chartRef}></div>
      </div>
    </div>
  );
}

export default PriceChart;
