import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getInnerDimensions, drawLine, drawXAxis, drawYAxis, addTitle, addXAxisLabel, addYAxisLabel, addTooltip } from '../../utils/chartHelpers';

function PriceChartV3({ data }) {
  const svgRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [selectedTwitterName, setSelectedTwitterName] = useState(null);

  useEffect(() => {
    const container = svgRef.current;
    if (container) {
      const { width, height } = getInnerDimensions(container);
      setContainerWidth(width);
      setContainerHeight(height);
    }
  }, []);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    const margin = { top: 50, right: 20, bottom: 50, left: 60 };
    const svg = d3.select(svgRef.current).attr("width", containerWidth).attr("height", containerHeight);
    svg.selectAll("*").remove();

    // Add background color
    svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .attr("fill", "#f3f4f6"); 
    const chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Filter data based on selected Twitter name
    const filteredData = selectedTwitterName ? data.filter(d => d.token.twitterName === selectedTwitterName) : data;

    // Update scales based on filtered data
    const x = d3.scaleLinear().domain([0, filteredData[0].historical_prices.length - 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(filteredData[0].historical_prices, d => d.ethAmount)]).range([height, 0]);

    // Remove old axes
    chartGroup.selectAll(".axis").remove();

    // Draw lines for each token/user
    filteredData.forEach((tokenData, idx) => {
      drawLine(chartGroup, tokenData.historical_prices, x, y, d3.schemeCategory10[idx % 10]);
    });

    // Draw new axes
    drawXAxis(chartGroup, x, height, filteredData[0].historical_prices.map(d => new Date(d.createdAt).toLocaleDateString()));
    drawYAxis(chartGroup, y, 6);
    addTitle(svg, "Price Chart V3", containerWidth);
    addXAxisLabel(svg, "Time", containerWidth, containerHeight);
    addYAxisLabel(svg, "ETH Amount", containerHeight);
  }, [data, containerWidth, containerHeight, selectedTwitterName]);

  return (
    <div className="p-4 h-full flex flex-col justify-between items-center relative">
      <svg ref={svgRef} className="flex-grow w-full h-full"></svg>
      <div className="w-full flex justify-center items-center">
        <select className="w-1/4" onChange={e => setSelectedTwitterName(e.target.value)}>
          <option value={null}>All</option>
          {data && data.map((d, idx) => (
            <option key={idx} value={d.token.twitterName}>{d.token.twitterName}</option>
          ))}
        </select>
      </div>
    </div>
  );
}


export default PriceChartV3;
