import {Vertex} from "../vertex/vertex";

export class WeighedQuickUnion{
  constructor(){
    // nothing here
  }
  union(p:Vertex,q:Vertex) {
    if(p.maxDepth>q.maxDepth){
      this._computeDepthAndAddToLinkedVertices(q,p);
    } else if(q.maxDepth>p.maxDepth){
      this._computeDepthAndAddToLinkedVertices(p,q);
    } else {
      if(p.linkedVertices.length > q.linkedVertices.length ){
        this._computeDepthAndAddToLinkedVertices(q,p);
      } else if(q.linkedVertices.length > p.linkedVertices.length){
        this._computeDepthAndAddToLinkedVertices(p,q);
      } else{
        this._computeDepthAndAddToLinkedVertices(p,q);
      }
    }
  }
  _computeDepthAndAddToLinkedVertices(child:Vertex,parent:Vertex):void{
    parent.linkedVertices.push(child);
    // now find out whether we ned to increase the parent maxDepth
    child.levelInTree++;
    let toBeDepth:number = 0;
    toBeDepth =  child.maxDepth+1;
    parent.maxDepth = (parent.maxDepth >= toBeDepth)? parent.maxDepth: toBeDepth;
    // for rendering purposes
    this._recursivelyChangeAllChildrenLevel(child);
    // increases the maxDepth on all the roots up the chain
    this._recursivelyChangeRootDepth(parent);
  }

  _recursivelyChangeAllChildrenLevel(v:Vertex){
    for(let node in v.linkedVertices){
      node.levelInTree++;
      this._recursivelyChangeAllChildrenLevel(node);
    }
  }
  _recursivelyChangeRootDepth(v:Vertex){
    if(v.root===v){
      // dont do anything
    } else{
      let vertexRoot:Vertex = v.root;
      let toBeDepth:number = 0;
      toBeDepth =  v.maxDepth+1;
      vertexRoot.maxDepth = (vertexRoot.maxDepth >= toBeDepth)? vertexRoot.maxDepth: toBeDepth;
      this._recursivelyChangeRootDepth(vertexRoot);
    }
  }
}
