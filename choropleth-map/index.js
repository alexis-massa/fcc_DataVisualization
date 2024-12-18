const EDUCATION_DATA_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const COUNTY_DATA_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let countyData
let educationData

let chart = d3.select('#chart')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
  chart.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    // class county
    .attr('class', 'county')
    // fill with color based on %age
    .attr('fill', countyItem => {
      let percentage = educationData.find(i => i.fips === countyItem['id'])['bachelorsOrHigher']
      if (percentage <= 25) return 'tomato'
      else if (percentage <= 50) return 'orange'
      else if (percentage <= 75) return 'lightgreen'
      else if (percentage <= 100) return 'limegreen'
    })
    // data-fips and data-education attributes
    .attr('data-fips', countyItem => countyItem['id'])
    .attr('data-education', countyItem => educationData.find(i => i.fips === countyItem['id'])['bachelorsOrHigher'])
    // Show tooltip on mouseover
    .on('mouseover', (e, countyItem) => {
      let county = educationData.find(i => i.fips === countyItem['id'])
      tooltip
        .transition().style('visibility', 'visible')
        .text(`${county['fips']} - ${county['area_name']}, ${county['state']}: ${county['bachelorsOrHigher']}%`)
        .attr('data-education', county['bachelorsOrHigher'])
    })
    // Hide tooltip on mouseout
    .on('mouseout', (e, countyItem) => tooltip.transition().style('visibility', 'hidden'))

}

// Fetch county data
d3.json(COUNTY_DATA_URL).then((data, err) => {
  if (err) return console.error(err)
  countyData = topojson.feature(data, data.objects.counties).features

  // Fetch education data
  d3.json(EDUCATION_DATA_URL).then((data, err) => {
    if (err) return console.error(err)
    educationData = data
    drawMap()
  })
})
