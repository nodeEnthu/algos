import {Vertex} from '../vertex/vertex';
import {Graph} from '../graph/graph';
declare var d3: any;
export class DfsSearch {
  searchQueue: any=[];
  _searchOrigin:Vertex;
  constructor(public graph: Graph) {
  }
  createDfsContextForNode(node:Vertex){
    this._searchOrigin = node;
    this._searchOrigin.alreadyReached = true;
    this._searchOrigin.path.addToDfsRenderPath(this._searchOrigin.identity);
    this._searchOrigin.path.addToComponentPath(this._searchOrigin.identity);
    this.searchQueue.push(node);
    this._search(node);
  }

  // this method makes sure whether all the nodes are
  // connected to a given node
  // it returns an object {connected: // trueORfalse, connectedTo:Array<Vertex>}

  _search(v: Vertex) {
    var self = this;
    // rearrange the linked vertices
    var commonElems:Array<any> = [];
    // first search for the common elements in between queue and linkedVertices
    // and put the common elements at the end of the queue with the
    // closest node from which v was reached at the end of the array (done by commonElems.sort)
    v.linkedVertices = v.linkedVertices.filter(function(obj){
      if(self.searchQueue.indexOf(obj) > - 1){
        commonElems.push({
          index:self.searchQueue.indexOf(obj),
          node: obj
        });
        return false;
      } else return true;
    });
    commonElems.sort(function(a,b){
      if(a.index <b.index){
        return 1;
      }
      if(a.index >b.index) {
        return -1;
      }
      return 0;
    });
    for(var i=commonElems.length-1; i >= 0;i--){
      v.linkedVertices.push(commonElems[i].node);
    }
    // basic algorithm starts here
    for (var i = 0; i < v.linkedVertices.length; i++) {
      var node: Vertex = v.linkedVertices[i];
      if (node.alreadyReached) {
        self._searchOrigin.path.addToDfsRenderPath(node.identity);
        /*
        * this just checks whether we have reached end of the iterated
        * nodes .. is if its the last one you dont need to come back to
        * the parent node .... the rerranging of teh linkedVertices makes sure that
        * the last linkedVertex is same as the one that leads to the same node
        */
        if(i !== v.linkedVertices.length-1){
          self._searchOrigin.path.addToDfsRenderPath(v.identity);
        }
      } else {
        self._searchOrigin.path.addToComponentPath(node.identity);
        self._searchOrigin.path.addToDfsRenderPath(node.identity);
        node.alreadyReached = true;
        this.searchQueue.push(node);
        this._search(node);
        // everytime this line is executes means that a {{node}} was done searching for
        // as it is only executed when the execution has stopped for {{node}}
        this.searchQueue.pop();
      }
    }
  }
}
