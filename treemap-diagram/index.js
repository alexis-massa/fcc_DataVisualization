// APIs
const VIDEO_GAME_SALES_URL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
const CONSOLE_COLORS = {
  "2600": "brown",
  "Wii": "white",
  "NES": "gray",
  "GB": "green",
  "DS": "silver",
  "X360": "green",
  "PS3": "black",
  "PS2": "blue",
  "SNES": "lightgray",
  "PS4": "darkblue",
  "3DS": "red",
  "N64": "black",
  "PS": "gray",
  "XB": "green",
  "PC": "silver",
  "PSP": "black",
  "XOne": "darkgreen",
  "GBA": "purple"
}

let videoGameData

let chart = d3.select('#chart')
let legend = d3.select('#legend')
let tooltip = d3.select('#tooltip')

let drawTreeMap = () => {
  // hierarchy of data
  let hierarchy = d3
    .hierarchy(videoGameData, node => node['children'])
    .sum(node => node['value'])
    .sort((node1, node2) => node2['value'] - node1['value'])

  // create treemap tiles with nodes and sizes based on value (auto by d3)
  let createTreeMap = d3.treemap().size([1000, 600])
  createTreeMap(hierarchy)

  // Get the leaves of each branch
  let videoGameTiles = hierarchy.leaves()

  // Create a block for each leaf
  let block = chart.selectAll('g')
    .data(videoGameTiles)
    .enter()
    .append('g')
    // Move it to correct placement
    .attr('transform', vg => `translate(${vg['x0']}, ${vg['y0']})`)
    // Show tooltip on mouseover
    .on('mouseover', (e, vg) => {
      tooltip
        .transition().style('visibility', 'visible')
      tooltip.html(`$${vg['data']['value'].toString().replace(/\B(?=(\d{3}))+(?!\d)/g, ',')}<br /> ${vg['data']['name']}`)
        .attr('data-value', vg['data']['value'])
    })
    // Hide tooltip on mouseout
    .on('mouseout', (e, vg) => tooltip.transition().style('visibility', 'hidden'))

  // Add rect with data and color for each tile
  block
    .append('rect')
    .attr('class', 'tile')
    .attr('fill', vg => CONSOLE_COLORS[vg['data']['category']])
    .attr('data-name', vg => vg['data']['name'])
    .attr('data-category', vg => vg['data']['category'])
    .attr('data-value', vg => vg['data']['value'])
    .attr('width', vg => vg['x1'] - vg['x0'])
    .attr('height', vg => vg['y1'] - vg['y0'])

  // Add text for each tile
  block
    .append('text')
    .text(vg => vg['data']['name'])
    .attr('x', '5')
    .attr('y', '20')

  // Create a legend group for each console/color
  let groups = legend.selectAll("g")
    .data(Object.keys(CONSOLE_COLORS))
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${(i % 4) * (40)}, ${Math.floor(i / 4) * (40 * 2)})`)

  // Add a rect with color for each group
  groups.append("rect")
    .attr("width", 40)
    .attr("height", 40)
    .attr('class', 'legend-item')
    .attr("fill", d => CONSOLE_COLORS[d])

  // Add text to each group
  groups.append("text")
    .attr("x", 40 / 2)
    .attr("y", 40 + 12)
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .text(d => d)
}

// Fetch data
d3.json(VIDEO_GAME_SALES_URL).then((data, err) => {
  if (err) return console.error(err)
  videoGameData = data
  drawTreeMap()
})