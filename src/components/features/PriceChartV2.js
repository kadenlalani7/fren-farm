import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getInnerDimensions, drawLine, drawXAxis, drawYAxis, addTitle, addXAxisLabel, addYAxisLabel } from '../../utils/chartHelpers';

function PriceChart({ data, isPriceChartExpanded }) {
  const svgRef = useRef(null), chartContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0), [containerHeight, setContainerHeight] = useState(0), [brushedRange, setBrushedRange] = useState(null);
  const [selectedTwitterName, setSelectedTwitterName] = useState(null);
  const [tooltipData, setTooltipData] = useState({ x: 0, y: 0, value: null });

  useEffect(() => {
    const container = chartContainerRef.current;
    if (container) {
      const { width, height } = getInnerDimensions(container);
      setContainerWidth(width);
      setContainerHeight(height);
    }
  }, [isPriceChartExpanded]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 50, right: 20, bottom: 50, left: 60 };
    const svg = d3.select(svgRef.current).attr("width", containerWidth).attr("height", containerHeight);
    svg.selectAll("*").remove();
    const chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const width = containerWidth - margin.left - margin.right, height = containerHeight - margin.top - margin.bottom;
    // const highestEthAmount = d3.max(data.flatMap(d => d.historical_prices.map(p => p.ethAmount)));
    // const xDomain = brushedRange || [0, d3.max(data, d => d.historical_prices.length - 1)];
    // const x = d3.scaleLinear().domain(xDomain).range([0, width]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    // const yDomain = brushedRange ? [0, d3.max(data.flatMap(d => {
    //     const startIndex = Math.floor(xDomain[0]), endIndex = Math.ceil(xDomain[1]);
    //     return d.historical_prices.slice(startIndex, endIndex + 1).reduce((max, price) => Math.max(max, price.ethAmount), 0);
    //   }))] : [0, highestEthAmount];
    // const y = d3.scaleLinear().domain(yDomain).range([height, 0]);

    let renderData = data;

    if (selectedTwitterName) {
      renderData = data.filter(d => d.token.twitterName === selectedTwitterName);
    }

    // Identify the maximum ethAmount in the filtered data
    const highestEthAmount = d3.max(renderData.flatMap(d => d.historical_prices.map(p => p.ethAmount)));
    
    // Adjusting x and y domains
    const xDomain = brushedRange || [0, d3.max(renderData, d => d.historical_prices.length - 1)];
    const yDomain = brushedRange 
        ? [0, d3.max(renderData.flatMap(d => {
            const startIndex = Math.floor(xDomain[0]), endIndex = Math.ceil(xDomain[1]);
            return d.historical_prices.slice(startIndex, endIndex + 1).map(p => p.ethAmount);
          }))] 
        : [0, highestEthAmount];

    // Define x and y scales based on the domains
    const x = d3.scaleLinear().domain(xDomain).range([0, width]);
    const y = d3.scaleLinear().domain(yDomain).range([height, 0]);


    renderData.forEach((datum, idx) => {
  const reversedData = [...datum.historical_prices].reverse();
  drawLine(chartGroup, reversedData, x, y, color(idx));

  // Create a new group for each datum
  const datumGroup = chartGroup.append("g").attr("class", `dot-group-${idx}`);
  
// Now select and append circles to this new group
datumGroup.selectAll(".dot")
    .data(reversedData.filter(d => d.isUserTrade))  // Filter the data to only those points where isBuy is true
    .enter()
    .append("circle")  
      .attr("class", "dot")
      .attr("cx", d => x(reversedData.indexOf(d)))
      .attr("cy", d => y(d.ethAmount))
      .attr("r", 4)
      .style("fill", color(idx))
      .on("mouseover", (event, d) => {
        setTooltipData({
          x: event.pageX,
          y: event.pageY,
          value: `ETH Amount: ${d.ethAmount}`
        });
      })
      .on("mouseout", () => setTooltipData({ ...tooltipData, value: null }));
});

// ... rest of your code

    chartGroup.select(".y-axis").call(d3.axisLeft(y));
    chartGroup.append("g").attr("class", "gridlines").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickSize(-height).tickFormat("").tickSizeOuter(0));
    chartGroup.append("g").attr("class", "gridlines").call(d3.axisLeft(y).tickSize(-width).tickFormat("").tickSizeOuter(0));
    d3.selectAll(".gridlines line").style("stroke-dasharray", "2,2").style("stroke-opacity", 0.2);

    drawXAxis(chartGroup, x, height);
    drawYAxis(chartGroup, y);
    addTitle(svg, "Your Chart Title", containerWidth);
    addXAxisLabel(svg, "Date (Time Period)", containerWidth, containerHeight);
    addYAxisLabel(svg, "ETH Amount", containerHeight);

    chartGroup.append("g").attr("class", "brush").call(d3.brushX().extent([[0, 0], [width, height]]).on("end", event => {
      if (!event.selection) setBrushedRange(null);
      else setBrushedRange(event.selection.map(x.invert));
    }));

    svgRef.current.style.backgroundColor = "white";
  }, [data, selectedTwitterName, containerWidth, containerHeight, brushedRange]);

  const tooltip = d3.select(chartContainerRef.current).append("div")
    .attr("class", "tooltip bg-black text-white p-2 rounded absolute opacity-0 transition-opacity duration-200 pointer-events-none")
    .style("z-index", "999");

    return (
      <div ref={chartContainerRef} className="p-4 h-full flex justify-center items-center relative">
      <select style={{width: '20px'}} onChange={(e) => setSelectedTwitterName(e.target.value)} value={selectedTwitterName}>
        <option value={null}>All</option>
        {data.map(d => (
          <option key={d.token.id} value={d.token.twitterName}>
            {d.token.twitterName}
          </option>
        ))}
        </select>
        <svg ref={svgRef}></svg>
        {tooltipData.value && (
          <div
            className="tooltip bg-black text-white p-2 rounded absolute transition-opacity duration-200 pointer-events-none"
            style={{
              left: `${tooltipData.x + 5}px`,
              top: `${tooltipData.y - 20}px`,
              zIndex: 999,
              opacity: 1
            }}
          >
            {tooltipData.value}
          </div>
        )}
      </div>
    );
  }
  
  export default PriceChart;
