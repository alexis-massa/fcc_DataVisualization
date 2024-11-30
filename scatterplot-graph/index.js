// Constants
const API_URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
const margin = { top: 50, right: 30, bottom: 30, left: 50 }
const width = 800 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

// Fetch data and initialize chart
$.getJSON(API_URL, data => {
  createChart(data)
})

const createChart = dataset => {

  // Parse data
  const parseTime = d3.timeParse("%M:%S")
  dataset.forEach(d => {
    d.Time = parseTime(d.Time)
    d.Year = new Date(d.Year, 0) // Use Date object for years
  })

  // Scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, d => d.Year))
    .range([0, width])

  const yScale = d3.scaleTime()
    .domain(d3.extent(dataset, d => d.Time))
    .range([0, height])


  // Create SVG container
  const svg = d3.select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)


  // Add x-axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"))
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)

  // Add y-axis
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"))
  svg.append("g")
    .attr("id", "y-axis")
    .call(yAxis)

  // Add dots
  svg.selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Time))
    .attr("r", 5) // Radius of the dots
    .attr("data-xvalue", d => d.Year.getFullYear()) // x-value: Year
    .attr("data-yvalue", d => d.Time.toISOString()) // y-value: Time in ISO format
    .style("fill", d => d.Doping ? "red" : "blue")

  // Add Legend
  const legend = svg.append("g").attr("id", "legend");

  // Legend Items
  const legendData = [
    { color: "blue", text: "No doping allegations" },
    { color: "red", text: "Riders with doping allegations" },
  ];

  legend.selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", width - 200)
    .attr("y", (_, i) => i * 20)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", d => d.color);

  legend.selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", width - 180)
    .attr("y", (_, i) => i * 20 + 12)
    .text(d => d.text)
    .style("font-size", "12px")
    .style("alignment-baseline", "middle");

  // Create tooltip container
  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "#f9f9f9")
    .style("padding", "5px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px")
    .style("display", "none");

  // Add tooltip interactions to dots
  svg.selectAll(".dot")
    .on("mouseover", (event, d) => {
      tooltip
        .style("display", "block")
        .html(
          `<strong>${d.Name} (${d.Nationality})</strong><br/>
         Year: ${d.Year.getFullYear()}<br/>
         Time: ${d3.timeFormat("%M:%S")(d.Time)}<br/>
         ${d.Doping ? `Doping: ${d.Doping}` : "No doping allegations"}`
        )
        .attr("data-year", d.Year.getFullYear()); // Add data-year attribute
    })
    .on("mousemove", event => {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => tooltip.style("display", "none"));

}
