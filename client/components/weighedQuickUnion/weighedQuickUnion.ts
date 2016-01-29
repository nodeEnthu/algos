import {Component, ElementRef,EventEmitter} from 'angular2/core';
import {Vertex} from '../../services/vertex/vertex';
import {UnionFindTree} from '../../services/unionFindTree/unionFindTree';
declare var d3:any;
@Component({
  selector: 'dfs',
  templateUrl: './components/dfs/dfs.html',
  styleUrls: ['./components/dfs/dfs.css'],
  providers: [ElementRef,UnionFindTree]
})
export class Wqu {
  constructor(public elementref:ElementRef, public unionFindTree:UnionFindTree) {}
  vertices:Array<Vertex>=[];
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
    }
  }
  render(resultSet:Array<Array<string>>):void {
    this.unionFindTree.addVertices(13,this.elementref,this.vertices);
    this.unionFindTree.linkVerticesSubmittedThroughFile(resultSet,this.vertices);
    this.unionFindTree.render(this.elementref,resultSet,this.vertices);
    console.log(this.vertices);
  }
}
