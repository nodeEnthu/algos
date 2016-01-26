import {Vertex} from '../vertex/vertex';
import {ElementRef} from 'angular2/core';
declare var d3: any;

export interface GraphInterface {
  vertices:Array<Vertex>;
  edges:number;
  addVertex(v:Vertex):void;
  addVertices(numberOfVertices:number,elementRef:ElementRef):void;
  linkVertices(p:string,q:string):void;
  numberOfEdges():number;
  render(elementRef:ElementRef, resultSet:Array<Array<string>>):void;
}

export class Graph implements GraphInterface {
  vertices: Array<Vertex>=[];
  edges: number=0;
  addVertices(numberOfVertices:number,elementRef:ElementRef):void {
    for(var i:number =0; i<numberOfVertices;i++) {
      var v:Vertex = new Vertex(i.toString(),elementRef);
      this.vertices.push(v);
    }
  }
  addVertex(v:Vertex) {
    this.vertices.push(v);
  }
  linkVertices(p:string,q:string) {
    var pVertex:Vertex;
    var qVertex:Vertex;
    for(var i:number =0; i < this.vertices.length ; i++) {
      var vertex:Vertex = this.vertices[i];
      if(vertex.identity === p) {
        pVertex = vertex;
      }
      if (vertex.identity === q) {
        qVertex = vertex;
      }
    }
    pVertex.connectTo(qVertex);
    qVertex.connectTo(pVertex);
  }

  numberOfEdges():number {
    return this.edges;
  }

  linkVerticesSubmittedThroughFile(resultSet:Array<Array<string>>):void{
    for (var i = 0; i < resultSet.length; i++) {
        this.linkVertices(resultSet[i][0].trim(), resultSet[i][1].trim());
    }
  }
  render(elementRef:ElementRef, resultSet:Array<Array<string>>):void {
    var circleAttributes:any = {};
    var svgContainer:any = {};
    var size = this.vertices.length;
    var initialXCoordinate = 600;
    var initialYCoordinate = 400;
    var widthOfSvgContainter = 1200;
    var radius = 300;
    var heightOfSvgContainer =1200;
    //// test code
    var jsonCircles:Array<any> = [];

    for (var i:number = 0; i < size; i++) {
      jsonCircles.push({
        "x_axis": radius * Math.cos(2 * Math.PI * i / size),
        "y_axis": radius * Math.sin(2 * Math.PI * i / size),
        "radius": 3,
        "color" : "purple"
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
        .attr("cx", function(d: any) {
            return d.x_axis + initialXCoordinate;
        })
        .attr("cy", function(d: any) {
            return d.y_axis +initialYCoordinate;
        })
        .attr("r", function(d: any){
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
        .style("fill", function(d:any) {
            return 'black';
        });
    //Add the SVG Text Element to the svgContainer
    var text = svgContainer.svg.selectAll("text")
        .data(jsonCircles)
        .enter()
        .append("text");

    //Add SVG Text Element Attributes
    text.attr("x", function(d:any) {
            return d.x_axis+initialXCoordinate +10;
        })
        .attr("y", function(d:any) {
            return d.y_axis+initialYCoordinate +10;
        })
        .text(function(d:any, i:any) {
            return i;
        })
        .attr('id', function(d:any, i:any) {
            return 'text' + i;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "red");

    for(var i=0; i< resultSet.length;i++){
      var childNode =  d3.select("#node"+resultSet[i][0]);
      var parentNode = d3.select("#node"+resultSet[i][1]);
      svgContainer.svg
        .append("line")
        .attr({
          x1:parentNode.attr('cx'),
          y1:parentNode.attr('cy'),
          x2:parentNode.attr('cx'),
          y2:parentNode.attr('cy')
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
