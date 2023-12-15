// banned book analysis bar chart (state count)
d3.csv('Data/state_counts.csv').then(function (data) {
  data.forEach(function (d) {
    d.Count = +d.Count;
    console.log(d.Count);
  });

  const svgWidth = 1200;
  const svgHeight = 400;

  const barPadding = 5;

  const svg = d3
    .select('#chart-container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const xScale = d3
    .scaleBand()
    .domain(
      data.map(function (d) {
        return d.State;
      })
    )
    .range([0, svgWidth])
    .padding(0.1);
    
  // add x-axis
  const xAxis = d3.axisBottom(xScale);
  svg
    .append('g')
    .attr('transform', 'translate(0,' + (svgHeight - 160) + ')')
    .call(xAxis)
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
    .style('fill', 'white')
    .style('font-size', '12px')
    .style('font-family', 'neulis-sans');
  // .style('font-weight', '700');
  svg.selectAll('.domain').style('stroke', 'white');
  // create bars for each state
  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('id', (d) => d.State)
    .attr('x', function (d, i) {
      return xScale(d.State);
    })
    .attr('y', function (d) {
      return svgHeight - Math.sqrt(d.Count) * 7 - 160;
    })
    .attr('width', xScale.bandwidth())
    .attr('height', function (d) {
      return Math.sqrt(d.Count) * 7;
    })
    .attr('fill', '#f2bb05')
    .on('mouseover', function (e) {
      d3.selectAll('.label').attr('opacity', (d) =>
        d.State === e.target.id ? 1 : 0
      );

      d3.select(this).attr('fill', '#D56062');
    })
    .on('mouseout', function () {
      d3.select(this).attr('fill', '#f2bb05');

      svg.select('.hover-rect').remove();
      svg.select('.hover-text').remove();
    });

  console.log(data);
  // create labels for each state
  svg
    .selectAll('labels')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('font-size', '20px')
    .attr('id', (d) => d.State)
    .attr('x', (d) => xScale(d.State) + xScale.bandwidth() / 2) // Centering text within the bar
    .attr('y', (d) => svgHeight - Math.sqrt(d.Count) * 7 - 180)
    .attr('opacity', 0)
    .attr('fill', 'white')
    .attr('text-anchor', 'middle') // Center text horizontally
    .text((d) => d.Count);
});
