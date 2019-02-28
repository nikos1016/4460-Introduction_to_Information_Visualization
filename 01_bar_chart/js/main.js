
// **** Your JavaScript code goes here ****

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 150, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var svg2 = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 150, left: 50},
    width = +svg2.attr("width") - margin.left - margin.right,
    height = +svg2.attr("height") - margin.top - margin.bottom;

var x1 = d3.scaleBand().rangeRound([0, width/3]).padding(0.1),
    y1 = d3.scaleLinear().rangeRound([height, 0]);

var x2 = d3.scaleBand().rangeRound([width/1.5, width]).padding(0.1),
    y2 = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g2 = svg2.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var reg;
          // [{"key": "Central", "value": 265045},
          // {"key": "East", "value": 178576},
          // {"key": "South", "value": 103926},
          // {"key": "West", "value": 272264}]

var cate; // {Coffee: 216828, Tea: 172773, Espresso: 222996, Herbal Tea: 207214}
d3.csv("./data/coffee_data.csv", function(error, data) {
    data.map(function(d) {
        reg = d3.nest()
          .key(function(d) { return d.region; })
          .rollup(function(v) {
            return d3.sum(v, function(d) { return d.sales; });
          }).entries(data);
          //console.log(JSON.stringify(reg));

        cate = d3.nest()
          .key(function(d) { return d.category; })
          .rollup(function(v) { return d3.sum(v, function(d) { return d.sales; }); })
          .entries(data);
          //console.log(JSON.stringify(cate));

    });

var reg_max = Math.max.apply(Math,reg.map(function(d){return d.value;}));
var cate_max = Math.max.apply(Math,cate.map(function(d){return d.value;}));

x1.domain(data.map(function(d) { return d.region; }));
y1.domain([0, reg_max]);

x2.domain(data.map(function(d) { return d.category; }));
y2.domain([0, cate_max]);

g.append("g")
.attr('transform', 'translate(60,0)')
  .attr("class", "axis axis--x")
  .attr("transform", "translate(60," + height + ")")
  .call(d3.axisBottom(x1))

g.selectAll("path.domain").style("opacity", 0);
//g2.select("path.domain").style("opacity", 0);

g2.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x2));

g.append("g")
.attr('transform', 'translate(60,0)')
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y1))
  .append("text")
  .attr("transform", "rotate(-90)")

g2.append("g")
.attr('transform', 'translate(455)')
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y2))
  .append("text")
  .attr("transform", "rotate(-90)")

g.append('text')
  .text('Coffee Sales by Region(USD)')
  .attr('class', 'label')
  .attr('transform', 'translate(80,500)');

g2.append('text')
  .text('Coffee Sales by Product(USD)')
  .attr('class', 'label')
  .attr('transform', 'translate(460,500)');

g.append('text')
  .text('Region')
  .attr('class', 'label')
  .attr('transform', 'translate(140,470)');

g2.append('text')
  .text('Product')
  .attr('class', 'label')
  .attr('transform', 'translate(530,470)');

svg.append('text')
  .text('Coffee Sales (USD)')
  .attr('class', 'label')
  .attr('transform', 'translate(55,360) rotate(-90)');

svg.append('text')
  .text('Coffee Sales (USD)')
  .attr('class', 'label')
  .attr('transform', 'translate(450,360) rotate(-90)');

g.selectAll(".bar")
  .data(reg)
  .enter()
  .append("rect")

  .attr("class", "bar")
  .attr('transform', 'translate(60,0)')
  .attr("x", function(d) {
  //  console.log(d.key);
    return x1(d.key); })
  .attr("y", function(d) {
  //  console.log(d.value);
    return y1(d.value); })
  .attr("width", x1.bandwidth())
  .attr("height", function(d) { return height - y1(d.value); });

g2.selectAll(".bar")
  .data(cate)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x2(d.key); })
  .attr("y", function(d) { return y2(d.value); })
  .attr("width", x2.bandwidth())
  .attr("height", function(d) { return height - y2(d.value); });

  // console.log(reg);
  // console.log(cate);

});

	// Here you have access to the dataset variable (if there was no error)
