import * as d3 from 'd3';

export function getInnerDimensions(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return {
        width: rect.width - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)),
        height: rect.height - (parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth))
    };
}

// ... (other utility functions)

export const drawLine = (chartGroup, data, xScale, yScale, color) => {
    const line = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.ethAmount));
  
    chartGroup.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1)
      .attr("d", line);
  
    // Add dots
    chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", d => yScale(d.ethAmount))
      .attr("r", 5)
      .attr("fill", d => d.isBuy ? "green" : "red");
  };
  

  export const drawXAxis = (chartGroup, xScale, height, tickLabels = null) => {
    const xAxis = d3.axisBottom(xScale);
    if (tickLabels) {
      xAxis.tickFormat((d, i) => tickLabels[i] || '');
    }
    chartGroup.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);
  };
  
  export const drawYAxis = (chartGroup, yScale, tickCount = null) => {
    const yAxis = d3.axisLeft(yScale);
    if (tickCount) {
      yAxis.ticks(tickCount);
    }
    chartGroup.append("g")
      .attr("class", "axis")
      .call(yAxis);
  };
  
  // ... (other helper functions)
  

export function addTitle(svg, title, width) {
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (10))  // Adjust this depending on your margin.top value
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(title);
}

export function addXAxisLabel(svg, label, width, height) {
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40) // Adjust this depending on your margin.bottom value
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(label);
}

export function addYAxisLabel(svg, label, height) {
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 60) // Adjust this depending on your margin.left value
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(label);
}

export const addTooltip = (line, twitterName) => {
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
    line.on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(`Twitter: ${twitterName}<br/>ETH Amount: ${d.ethAmount}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
  };