// Constants
const API_URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
const margin = { top: 20, right: 30, bottom: 30, left: 50 }
const width = 800 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

// Fetch data and initialize chart
$.getJSON(API_URL, data => {
  const dataset = data.data
  createChart(dataset)
})

const createChart = dataset => {
  // Create the SVG container
  const svg = d3.select('#chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // xScale: Date values (use d3.scaleBand for categorical x-axis)
  const xScale = d3.scaleBand()
    .domain(dataset.map(d => d[0])) // Use the date as the domain
    .range([0, width])
    .padding(0.1)

  // yScale: GDP values (use d3.scaleLinear for numeric y-axis)
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([height, 0])

  // Axes
  const xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter((_, i) => i % Math.ceil(dataset.length / 10) === 0)) // Reduce number of ticks
  const yAxis = d3.axisLeft(yScale)


  // Add x-axis to SVG
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)

  // Add y-axis to SVG
  svg.append('g')
    .attr('id', 'y-axis')
    .call(yAxis)

  // Create bars (rect elements)
  svg.selectAll('.bar')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('data-date', d => d[0]) // Store date in data-date attribute
    .attr('data-gdp', d => d[1]) // Store GDP in data-gdp attribute
    .attr('class', 'bar') // Add the .bar class to each rect
    .attr('x', d => xScale(d[0])) // Set x position based on date (align with x-axis ticks)
    .attr('y', d => yScale(d[1])) // Set y position based on GDP
    .attr('width', xScale.bandwidth()) // Set the width based on the scale
    .attr('height', d => height - yScale(d[1])) // Set height based on GDP value

    .append("title")
    .text(d => `${d[0]}: $${d[1]} Billion`) // Add tooltip text

  // Create text labels (for showing GDP value and date on hover)
  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(d => `${d[0]}: $${d[1]} Billion`)
    .attr("x", d => xScale(d[0])) // Center text over each bar
    .attr("y", d => yScale(d[1]) - 5) // Position text above the bar
    .style("text-anchor", "middle") // Center the text horizontally
    .style("display", 'none') // Initially hide the text
}

// Handle mouseover effect
d3.selectAll('.bar')
  .on('mouseover', function (event, d) {
    const tooltip = d3.select('#tooltip')
    tooltip.style('opacity', 1)
      .attr('data-date', d[0])
      .html(`${d[0]}: $${d[1]} Billion`)

    // Show corresponding text on hover
    d3.select(this).select('text').style('display', 'block')
  })
  .on('mouseout', function () {
    d3.select('#tooltip').style('opacity', 0) // Hide tooltip on mouseout
    d3.select(this).select('text').style('display', 'none') // Hide the text again
  })
