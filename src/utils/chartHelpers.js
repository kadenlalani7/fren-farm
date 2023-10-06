import * as d3 from 'd3';

export function getInnerDimensions(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return {
        width: rect.width - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)),
        height: rect.height - (parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth))
    };
}

export function drawLine(svg, data, x, y, color) {
    const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d.ethAmount));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

export function drawXAxis(svg, xScale, height) {
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
}

export function drawYAxis(svg, yScale) {
    svg.append("g")
        .call(d3.axisLeft(yScale));
}

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
