import {Vertex} from '../vertex/vertex';
import {ElementRef} from 'angular2/core';
import {WeighedQuickUnion} from '../weighedQuickUnion/weighedQuickUnion';
declare var d3: any;


export class UnionFindTree {
  edges: number = 0;
  wquAlgo = new WeighedQuickUnion();
  addVertices(numberOfVertices: number, elementRef: ElementRef, vertices: Array<Vertex>): void {
    for (var i: number = 0; i < numberOfVertices; i++) {
      var v: Vertex = new Vertex(i.toString(), elementRef);
      vertices.push(v);
    }
  }
  linkVertices(p: string, q: string, vertices: Array<Vertex>) {
    var pVertex: Vertex;
    var qVertex: Vertex;
    for (var i: number = 0; i < vertices.length; i++) {
      var vertex: Vertex = vertices[i];
      if (vertex.identity === p) {
        pVertex = vertex;
      }
      if (vertex.identity === q) {
        qVertex = vertex;
      }
    }
    this.wquAlgo.union(pVertex, qVertex);
  }

  linkVerticesSubmittedThroughFile(resultSet: Array<Array<string>>, vertices: Array<Vertex>): void {
    for (var i = 0; i < resultSet.length; i++) {
      this.linkVertices(resultSet[i][0].trim(), resultSet[i][1].trim(), vertices);
    }
  }

  render(elementRef: ElementRef, resultSet: Array<Array<string>>, vertices: Array<Vertex>): void {
    var circleAttributes: any = {};
    var svgContainer: any = {};
    var size = vertices.length;
    var widthOfSvgContainter = 1200;
    var radius = 300;
    var heightOfSvgContainer = 1200;
    var jsonCircles: Array<any> = [];
    const y_coordinate = 150;
    const x_coordinate = 400;
    const x_spacing = 20;
    const text_offset = 5;
    for (var i: number = 0; i < size; i++) {
      jsonCircles.push({
        "x_axis": x_coordinate + i * x_spacing,
        "y_axis": y_coordinate,
        "radius": 3,
        "color": "purple"
      });
    }
    svgContainer.svg = d3.select(elementRef.nativeElement).append("svg")
      .attr("width", widthOfSvgContainter)
      .attr("height", heightOfSvgContainer);

    var circles = svgContainer.svg.selectAll("circle")
      .data(jsonCircles)
      .enter()
      .append("circle");
    circleAttributes.circles = circles
      .attr("cx", function(d: any, index: number) {
      return d.x_axis;
    })
      .attr("cy", function(d: any, index: number) {
      return d.y_axis + vertices[index].levelInTree * 20;
    })
      .attr("r", function(d: any) {
      return d.radius;
    })
      .attr("id", function(d: any, i: any) {
      return 'node' + i;
    })
      .attr("root", function(d: any, i: any) {
      return i;
    })
      .attr("weight", function() {
      return 0;
    })
      .attr("level", function() {
      return 0;
    })
      .style("fill", function(d: any) {
      return 'black';
    });
    //Add the SVG Text Element to the svgContainer
    var text = svgContainer.svg.selectAll("text")
      .data(jsonCircles)
      .enter()
      .append("text");

    //Add SVG Text Element Attributes
    text.attr("x", function(d: any) {
      return d.x_axis + text_offset;
    })
      .attr("y", function(d: any, index: number) {
      return d.y_axis + text_offset + +vertices[index].levelInTree * 20;
    })
      .text(function(d: any, i: any) {
      return i;
    })
      .attr('id', function(d: any, i: any) {
      return 'text' + i;
    })
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("fill", "red");

    for (var i = 0; i < resultSet.length; i++) {
      let pVertex:Vertex = vertices[resultSet[i][0]];
      let qVertex:Vertex = vertices[resultSet[i][1]];
      let childVertex:Vertex;
      let parentVertex:Vertex;
      if(pVertex.root === qVertex.root){
        // check is p is the real root
        if(pVertex === pVertex.root && qVertex!==pVertex){
          childVertex = qVertex;
          parentVertex = pVertex;
          // check if q is the real root
        }else if(qVertex ===qVertex.root && pVertex!==qVertex){
          childVertex = pVertex;
          parentVertex = qVertex;
          // both have same root but both are kids of the root
          // so we got to find out which connection already exists
          // of if both of them already exist
        } else{
          // check if qconnection with root already exists
          // if it exists then its safe to assume other one doesnt
          let checkPConnectionLine = d3.select("#line" + pVertex.identity+pVertex.root.identity)||
                                      d3.select("#line" + pVertex.root.identity+pVertex.identity);
          if(checkPConnectionLine){
            // we only need to connect q now
            childVertex = qVertex;
            parentVertex = qVertex.root;
          } else{
            // p connection does not exist... q does possibly so connect it
            childVertex = pVertex;
            parentVertex = pVertex.root;
          }
        }
      }
      let childNode = d3.select("#node" + childVertex.identity);
      let parentNode = d3.select("#node" + parentVertex.identity);
      svgContainer.svg
        .append("line")
        .attr({
        x1: parentNode.attr('cx'),
        y1: parentNode.attr('cy'),
        x2: parentNode.attr('cx'),
        y2: parentNode.attr('cy')
      })
        .transition()
      // .duration(150)
        .attr("x2", childNode.attr('cx'))
        .attr("y2", childNode.attr('cy'))
        .attr("id", 'line' + childNode.attr('id').replace('node', '') + parentNode.attr('id').replace('node', ''))
        .attr("class", "link")
        .attr("stroke", "#CCC")
        .attr("fill", "black");
      }
    }

}
