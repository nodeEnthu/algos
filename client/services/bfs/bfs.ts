import {Vertex} from '../vertex/vertex';
//import {GraphInterface} from '../graph/graph';
import {Graph} from '../graph/graph';
declare var d3: any;
export class BfsSearch {
  searchQueue: any=[];
  _searchOrigin:Vertex;
  _shortestPath:Array<string>=[];
  constructor(public graph: Graph) {
  }
  createBfsContextForNode(node:Vertex){
    this._searchOrigin = node;
    this._searchOrigin.alreadyReached = true;
    this._searchOrigin.path.reachedFromDuringBfsSearch[this._searchOrigin.identity]=[];
    this.searchQueue.push(node);
    this._populateClosestParentsFromSearchOriginInConnectedComponenet(node);
    while(this.searchQueue.length > 0){
      var node:Vertex  = this.searchQueue.pop()
      this._populateClosestParentsFromSearchOriginInConnectedComponenet(node);
    }
  }

  // This function populates all the reachedFromDuringBfsSearch attr for each node
  // in the connected component for {{this._searchOrigin}}
  // while trying to search from the search origin

  _populateClosestParentsFromSearchOriginInConnectedComponenet(v: Vertex) {
    var self = this;
    v.linkedVertices.forEach(function(node,index){
      if(node.alreadyReached === true){
        // dont do anything
      } else{
        node.alreadyReached = true;
        self.searchQueue.push(node);
        node.path.reachedFromDuringBfsSearch[self._searchOrigin.identity]=[];
        node.path.reachedFromDuringBfsSearch[self._searchOrigin.identity].push(v);
      }
    });
  }

  generateShortestPathBetweenTwoNodes(origin:Vertex,target:Vertex):string {
    var resultArr:Array<string>=[];
    // you got to check whether bfs context was set up for origin node
    resultArr.push(target.identity);
    if(target.path.reachedFromDuringBfsSearch[origin.identity]){
      while(target.path.reachedFromDuringBfsSearch[origin.identity][0] !== origin){
        resultArr.push(target.path.reachedFromDuringBfsSearch[origin.identity][0].identity);
        target = target.path.reachedFromDuringBfsSearch[origin.identity][0];
      }
      resultArr.push(origin.identity);
      return resultArr.join('-->');
    } else return 'not connected';
  }
}
