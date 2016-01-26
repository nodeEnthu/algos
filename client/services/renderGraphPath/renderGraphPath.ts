declare var d3: any;
export class RenderGraphPath {
  constructor() {
    // nothing here
  }
  ballTracingPathBetweenNodes(pathToBeRendered:Array<string>):void{
    var pathDataPoints:Array<any>  = [];
    for (var i =0; i< pathToBeRendered.length; i++){
      pathDataPoints.push([d3.select("#node"+pathToBeRendered[i]).attr("cx"), d3.select("#node"+pathToBeRendered[i]).attr("cy")]);
    }
    var svg = d3.select("svg");
    var path = svg.append("path")
    .data([pathDataPoints])
    .attr("d", d3.svg.line()
    .interpolate("linear"));

    svg.selectAll(".point")
      .data(pathDataPoints)
      .enter().append("circle")
      .attr("r", 4)
      .attr("transform", function(d: any) { return "translate(" + d + ")"; });

    var circle = svg.append("circle")
        .attr("r", 5)
        .attr("transform", "translate(" + pathDataPoints[0] + ")");


      circle.transition()
          .duration(25000)
          .attrTween("transform", translateAlong(path.node()))
          .each("end","transition");


    // Returns an attrTween for translating along the specified path element
    function translateAlong(path:any) {
      var l = path.getTotalLength();
      return function(d:any, i:any, a:any) {
        return function(t:any) {
          var p = path.getPointAtLength(t * l);
          return "translate(" + p.x + "," + p.y + ")";
        };
      };
    }
  }
}
