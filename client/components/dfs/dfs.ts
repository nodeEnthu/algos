import {Component, ElementRef,EventEmitter} from 'angular2/core';
import {DfsSearch} from '../../services/dfs/dfsSearch';
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
export class DfsCmp {
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
    // render the graph .. spreading the nodes across perimeter of a triangle
    this.graph.render(this.eleRef, resultSet);
    // link those vertices according to the resultset
    this.graph.linkVerticesSubmittedThroughFile(resultSet);
    var dfsSearch:DfsSearch = new DfsSearch(this.graph);
    // this will populate node attrs like connected vertices, paths to that node etc
    dfsSearch.createDfsContextForNode(this.graph.vertices[0]);
    // after search dfsSearch now has the path to all the connecting routes to node passed in the argument
    this.renderGraphPath.ballTracingPathBetweenNodes(this.graph.vertices[0].path.dfsOnlyForDisplayPath)
    console.log("This is the render graph of a given node", this.graph.vertices[0].path.dfsOnlyForDisplayPath);
    console.log("This is the component graph of a given node", this.graph.vertices[0].path.dfsComponentPath);
  }
}
