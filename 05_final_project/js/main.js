var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var chart1 = svg.append("g").attr("transform", "scale(1.05)")
.attr("transform", "translate(280, -5)");

var chart2 = svg.append("g").attr("transform", "translate("+width/5+","+height/1.4+")"),
    chart3 = svg.append("g").attr("transform", "translate("+width/1.9+","+height/1.4+")"),
    chart4 = svg.append("g").attr("transform", "translate("+width/1.17+","+height/1.4+")"),
    radius = Math.min(width, height)/10;

var format = d3.format(",d");
function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }
var color1 = d3.scaleOrdinal(d3.schemeCategory20c);
var color = d3.scaleSequential()
	.domain([0, 10])
	.interpolator(d3.interpolateGreens);


var pack = d3.pack()
    .size([width/1.7, height/1.7])
    .padding(1.5);

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "50px")
    .style("background-color", "rgba(0, 0, 0, 0.9)")
    .style("border-radius", "6px")
    .style("font", "14px sans-serif")
    .text("tooltip");

var arr_total;
var arr_candy;
var arr_male;
var arr_female;
var arr_others;
var arr_t_male;
var arr_t_female;
var arr_t_others;
var num_joy = 0;
var num_meh = 0;
var num_despair = 0;
var num_male_joy = 0;
var num_male_meh = 0;
var num_male_despair = 0;
var num_female_joy = 0;
var num_female_meh = 0;
var num_female_despair = 0;
var num_other_joy = 0;
var num_other_meh = 0;
var num_other_despair = 0;
d3.csv("./data/candy.csv", function(error, data) {
    if (error) throw error;

    arr_total = data.columns.slice(6,53).map(function(id) {
         return {
             id: id,
             values: data.map(function(d) {
                 return {
                     gender: d.Q2_GENDER,
                     age: d.Q3_AGE,
                     country: d.Q4_COUNTRY,
                     rate: d[id],
                 }
             })
         }
    });

    arr_candy = arr_total.map(function(id) {
        num_joy = 0;
        num_meh = 0;
        num_despair = 0;
        temp = id.values.map(function(v) {
            if (v.rate === "JOY") {num_joy++;}
            else if (v.rate ==="MEH") {num_meh++;}
            else {num_despair++;}});
        return {
            id: id.id,
            joy: num_joy,
            meh: num_meh,
            despair: num_despair,
        }
    });

    arr_male = arr_total.map(function(id) {
        num_male_joy = 0;
        num_male_meh = 0;
        num_male_despair = 0;
        temp = id.values.map(function(v) {
            if (v.rate === "JOY" && v.gender === "Male") {num_male_joy++;}
            else if (v.rate === "MEH" && v.gender === "Male") {num_male_meh++;}
            else if (v.rate === "DESPAIR" && v.gender === "Male") {num_male_despair++;}
        });
        return {
            id: id.id,
            joy: num_male_joy,
            meh: num_male_meh,
            despair: num_male_despair,
        }
    });
    console.log(arr_male);

    arr_female = arr_total.map(function(id) {
        num_female_joy = 0;
        num_female_meh = 0;
        num_female_despair = 0;
        temp = id.values.map(function(v) {
            if (v.rate === "JOY" && v.gender === "Female") {num_female_joy++;}
            else if (v.rate === "MEH" && v.gender === "Female") {num_female_meh++;}
            else if (v.rate === "DESPAIR" && v.gender === "Female") {num_female_despair++;}
        });
        return {
            id: id.id,
            joy: num_female_joy,
            meh: num_female_meh,
            despair: num_female_despair,
        }
    });

    arr_others = arr_total.map(function(id) {
        num_other_joy = 0;
        num_other_meh = 0;
        num_other_despair = 0;
        temp = id.values.map(function(v) {
            if (v.rate === "JOY" && (v.gender === "Other" || v.gender === "I'd rather not say")) {num_other_joy++;}
            else if (v.rate === "MEH" && (v.gender === "Other" || v.gender === "I'd rather not say")) {num_other_meh++;}
            else if (v.rate === "DESPAIR" && (v.gender === "Other" || v.gender === "I'd rather not say")) {num_other_despair++;}
        });
        return {
            id: id.id,
            joy: num_other_joy,
            meh: num_other_meh,
            despair: num_other_despair,
        }
    });


    var root = d3.hierarchy({children: arr_candy})
        .sum(function(d) { return d.joy; })
        .each(function(d) {
          if (id = d.data.id) {
            var id, i = id.lastIndexOf(".");
            d.id = id;
            d.j = d.data.joy;
            d.m = d.data.meh;
            d.de = d.data.despair;
            d.package = id.slice(0, i);
            d.class = id.slice(i + 1);
          }
        });

    var node = chart1.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) {
            if (d.j > 800) {
                console.log(color(9));
                return color(9);
            } else if (d.j > 500) {
                console.log(color(7));
                return color(7);
            } else if (d.j > 200) {
                console.log(color(5));
                return color(5);
            } else {
                console.log(color(3));
                return color(3);
            }
        })
        .on("mouseover", function(d) {
            var str = d.id;
            str = str.replace(/Q6_/, "");
            str = str.replace(/_/g, "-");
                tooltip.html(str + "<br/><br/>" + "Joy: " + (d.j/1386*100).toFixed(2) + " %" + "<br/>" + "Meh: " + (d.m/1386*100).toFixed(2) + " %"
            + "<br/>" + "Despair: " + (d.de/1386*100).toFixed(2) + " %");
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
        .on('click', function(d) {

          filterMV = Object.values(arr_male);
          // console.log(filterMV);
          filterFV = Object.values(arr_female);
          filterOV = Object.values(arr_others);
          var targetM;
          var targetF;
          var targetO;
          for (i=0;i<47;i++) {

            if(d.id === filterMV[i].id) {

              targetM = [{type: "joy", rate : filterMV[i].joy},{type: "meh", rate :filterMV[i].meh},{type: 'despair', rate: filterMV[i].despair}];
            }
            if(d.id === filterFV[i].id) {

              targetF = [{type: "joy", rate : filterFV[i].joy},{type: "meh", rate : filterFV[i].meh},{type: 'despair', rate: filterFV[i].despair}];
            }
            if(d.id === filterOV[i].id) {

              targetO = [{type: "joy", rate : filterOV[i].joy},{type: "meh", rate : filterOV[i].meh},{type: 'despair', rate: filterOV[i].despair}];
            }
          }
          console.log("======================");
          // console.log([targetM]);
          // console.log([targetF]);
          // console.log([targetO]);
          pieChart_m(targetM);
          pieChart_f(targetF);
          pieChart_o(targetO);
        });

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });

    node.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
        .selectAll("tspan")
        .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 1.5 - 0.5) * 10; })
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .style("fill", function(d){return "Black";})
        .text(function(d) {
            var str = d;
            str = str.replace(/Q6_/, "");
            str = str.replace(/_/g, "-");
            return str;
        });

function pieChart_m(data){

    var arc = d3.arc()
        .outerRadius(radius + 20)
        .innerRadius(0);

    var newdata = []
    data.map(function(d){
      newdata.push(d.rate);
    })
var total = data.reduce(function(prev, d) {return prev + d.rate;}, 0);
    var pie = d3.pie()(newdata);

    var arcs = chart2.selectAll(".arc")
        .data(pie)
        .enter()
        .append("svg:g")
        .attr("class", "slice");

        arcs.append("path")
                .attr("fill", function(d, i) { return color1(i); } )
                .attr("d", arc);

        arcs.append("svg:text")
                .attr("transform", function(d) {

                d.innerRadius = 0;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                return (d.data/total*100).toFixed(1) + " %";
                console.log(d);
            });
}

function pieChart_f(data){

    var arc = d3.arc()
        .outerRadius(radius + 20)
        .innerRadius(0);

    var newdata = []
    data.map(function(d){
      newdata.push(d.rate);
    })
var total = data.reduce(function(prev, d) {return prev + d.rate;}, 0);
    var pie = d3.pie()(newdata);

    var arcs = chart3.selectAll(".arc")
        .data(pie)
        .enter()
        .append("svg:g")
        .attr("class", "slice");

        arcs.append("path")
                .attr("fill", function(d, i) {console.log(color1(i));
                    return color1(i); } )
                .attr("d", arc);
        arcs.append("svg:text")
                .attr("transform", function(d) {

                d.innerRadius = 0;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                return (d.data/total*100).toFixed(1) + " %";
                console.log(d);
            });

}

function pieChart_o(data){

    var arc = d3.arc()
        .outerRadius(radius + 20)
        .innerRadius(0);
    console.log(data);
    var newdata = []
    data.map(function(d){
      newdata.push(d.rate);
    })
    var total = data.reduce(function(prev, d) {return prev + d.rate;}, 0);
    console.log(total);


    var pie = d3.pie()(newdata);

    var arcs = chart4.selectAll(".arc")
        .data(pie)
        .enter()
        .append("svg:g")
        .attr("class", "slice");

console.log(data);
        arcs.append("path")
                .attr("fill", function(d, i) { return color1(i); } )
                .attr("d", arc);

        arcs.append("svg:text")
                .attr("transform", function(d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                return (d.data/total*100).toFixed(1) + " %";
                console.log(d);
            });
}
  });
