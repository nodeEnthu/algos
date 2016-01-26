/*
* This algorithm tries to find the shortest path
* from a given vertex to all possible nodes in the
* its respective connected component
*/
import {Component, ElementRef,EventEmitter} from 'angular2/core';
import {BfsSearch} from '../../services/bfs/../bfs/bfs';
import {Graph} from '../../services/graph/graph';
import {Vertex} from '../../services/vertex/vertex';
import {RenderGraphPath} from '../../services/renderGraphPath/renderGraphPath';
declare var d3:any;
@Component({
  selector: 'dfs',
  templateUrl: './components/dfs/dfs.html',
  styleUrls: ['./components/dfs/dfs.css'],
  providers: [ElementRef,Graph]
})
export class BfsCmp {
  constructor(public graph:Graph,public eleRef :ElementRef, public renderGraphPath:RenderGraphPath) {}
  resultSet:Array<Array<string>>=[];
  changeListener($event: any) {
    var self = this;
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    myReader.readAsText(file);
    let resultSet: Array<any> = [];
    myReader.onloadend = function(e){
      // you can perform an action with readed data here
      var columns = myReader.result.split(/\r\n|\r|\n/g);
      for (var i = 0; i < columns.length; i++) {
          resultSet.push(columns[i].split(' '));
      }
      self.resultSet=resultSet;
      self.render(resultSet);
    };
  }
  render(resultSet:Array<any>):void {
    this.graph.addVertices(13,this.eleRef);
    this.graph.render(this.eleRef, resultSet);
    this.graph.linkVerticesSubmittedThroughFile(resultSet);
    var bfsSearch:BfsSearch = new BfsSearch(this.graph);
    bfsSearch.createBfsContextForNode(this.graph.vertices[0]);
    var shortestPath = bfsSearch.generateShortestPathBetweenTwoNodes(this.graph.vertices[0], this.graph.vertices[8]);
    this.renderGraphPath.ballTracingPathBetweenNodes(shortestPath.split("-->"));
    console.log(shortestPath);
  }
}
