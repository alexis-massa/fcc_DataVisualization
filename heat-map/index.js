// Constants for API and chart dimensions
const API_URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const margin = { top: 50, right: 120, bottom: 30, left: 50 }; // Increase right margin for legend
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const colors = ["#69b3a2", "#9ac2b3", "#d67f0f", "#cc4e2a"];

// Fetch data and initialize chart
$.getJSON(API_URL, (data) => {
  createChart(data);
});

const createChart = (dataset) => {
  const baseTemp = dataset.baseTemperature;
  const variance = dataset.monthlyVariance;
  const years = dataset.monthlyVariance.map((d) => d.year); // Get all the years
  const months = Array.from(
    new Set(dataset.monthlyVariance.map((d) => d.month - 1))
  ); // Adjust months to 0-11

  // Color scale for temperature
  const colorScale = d3
    .scaleQuantile()
    .domain(
      variance.map((d) => baseTemp + d.variance) // Total temperature (base + variance)
    )
    .range(colors); // Define 4 colors

  const xScale = d3
    .scaleBand()
    .domain(variance.map((d) => d.year))
    .range([0, width])
    .padding(0.01);

  const yScale = d3
    .scaleBand()
    .domain(d3.range(1, 13)) // 1 to 12 for months
    .range([0, height])
    .padding(0.01);

  // Add the SVG container with increased right margin to prevent overlap
  const svg = d3
    .select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", width + margin.left + margin.right) // Adjusted width for the chart
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // x-axis
  const xAxis = d3.axisBottom(xScale).tickValues(
    xScale.domain().filter((year) => year % 10 === 0) // Show tick every 10 years
  );

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // y-axis
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => d3.timeFormat("%B")(new Date(0, d - 1))); // Format month names

  svg.append("g").attr("id", "y-axis").call(yAxis);

  // Tooltip element
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // Create heatmap cells (rect elements)
  svg
    .selectAll(".cell")
    .data(dataset.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemp + d.variance)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", (d) => colorScale(baseTemp + d.variance)) // Set color based on temperature
    // Tooltip interaction
    .on("mouseover", (event, d) => {
      const temp = baseTemp + d.variance;
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `${d.year} - ${d3.timeFormat("%B")(
            new Date(0, d.month - 1)
          )}<br>${temp.toFixed(1)}°C`
        )
        .attr("id", "tooltip")
        .attr("data-year", d.year)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });
  // Add Legend
  const legend = svg.append("g").attr("id", "legend");

  // Legend Items - Using four color ranges
  const legendData = [
    { color: "#69b3a2", text: "2.8°C - 5.0°C" },
    { color: "#9ac2b3", text: "5.1°C - 7.2°C" },
    { color: "#d67f0f", text: "7.3°C - 9.5°C" },
    { color: "#cc4e2a", text: "9.6°C - 12.8°C" }
  ];

  // Position legend more to the right but within the viewable area
  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", width + margin.left - 25) // Make sure the legend is within the SVG's right margin
    .attr("y", (_, i) => i * 30) // Stagger each rect vertically
    .attr("width", 30) // Set the width of each color block
    .attr("height", 30) // Set the height of each color block
    .style("fill", (d) => d.color); // Set the color for each block

  // Add the corresponding text labels
  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", width + margin.left + 5) // Position the text beside the color block
    .attr("y", (_, i) => i * 30 + 20) // Align vertically with the color blocks
    .text((d) => d.text) // Add the temperature range text
    .style("font-size", "12px")
    .style("alignment-baseline", "middle");
};
