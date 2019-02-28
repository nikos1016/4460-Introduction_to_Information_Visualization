

// **** Your JavaScript code goes here ****
var svg = d3.select('svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 20, r: 20, b: 60, l: 60};

trellisWidth = svgWidth / 2 - padding.l - padding.r;
trellisHeight = svgHeight / 2 - padding.t - padding.b;

var dateDomain = [1875, 2010];
var priceDomain = [0,4600];

d3.csv('./data/real_estate.csv', function(error, dataset) {
    if(error) {
        console.error('Error while loading ./real_estate.csv dataset.');
        console.error(error);
        return;
    }

    var xScale = d3.scaleLinear()
        .domain(dateDomain)
        .range([0, trellisWidth]);

    var yScale = d3.scaleLinear()
        .domain(priceDomain)
        .range([trellisHeight, 0]);

    var nested = d3.nest()
        .key(function(d) {
            return d.location;
        }).entries(dataset);
        console.log(nested);

    var colorScale = d3.scaleOrdinal(d3.schemeCategory20c)
        .domain(nested.map(function(d){
            return d.key;
        }));

    var trellisG = svg.selectAll('.trellis')
        .data(nested)
        .enter()
        .append('g')
        .attr('class', 'trellis')
        .attr('transform', function(d,i) {
            var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
            return 'translate('+[tx, ty]+')';
        });

    trellisG.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,'+trellisHeight+')')
        .call(d3.axisBottom(xScale).tickFormat(function(d){
          if (d%20 == 0){
            return d;
          }
        }));

    trellisG.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(d3.axisLeft(yScale));

    trellisG.append('text')
        .attr('class', 'location-label')
        .attr('transform', 'translate('+[trellisWidth / 2.8, trellisHeight / 10]+')')
        .attr('fill', function(d){
            return colorScale(d.key);
        })
        .text(function(d){
            return d.key;
        });

    trellisG.append('text')
        .attr('class', 'x axis-label')
        .attr('transform', 'translate('+[trellisWidth / 2.7, trellisHeight + 34]+')')
        .text('Year Built')
        .style('fill', function(d){return d3.color('#8B0000');});

    trellisG.append('text')
        .attr('class', 'y axis-label')
        .attr('transform', 'translate('+[-45, trellisHeight / 1.2]+') rotate(270)')
        .text('Price per Square Foot (USD)')
        .style('fill', function(d){return d3.color('#8B0000');});

    var a;
    var s1 = trellisG.selectAll('.plot')
        .data(function(d){
            console.log(d.values);
            console.log(d.values)
            return d.values;
        })
        .enter()
        .append('circle')
        .attr('class', 'plot')
        .attr('r',2)
        .attr('cx', function(d){
            return xScale(d.year_built);
        }).attr('cy', function(d){
            return yScale(d.price_per_sqft);
        }).style('fill', function(d){
          if (d.beds<=2) {
            return d3.color("#499936");
          } else {
            return d3.color("#2e5d90");
          }
        });
});
