import {Vertex} from "../vertex/vertex";

export class WeighedQuickUnion {
  constructor() {
    // nothing here
  }
  _findRoot(v: Vertex): Vertex {
    let root:Vertex = v.root;
    while(root !== v){
      v=root;
      root = root.root;
    }
    return root;
  }
  union(p: Vertex, q: Vertex) {
    // calculate the root of p and q
    let pRoot: Vertex = this._findRoot(p);
    let qRoot: Vertex = this._findRoot(q);
    if(pRoot === qRoot){
      console.log("already connected do not worry");
    }
    else if (pRoot.maxDepth > qRoot.maxDepth) {
      this._computeDepthAndAddToLinkedVertices(qRoot, pRoot);
    } else if (qRoot.maxDepth > pRoot.maxDepth) {
      this._computeDepthAndAddToLinkedVertices(pRoot, qRoot);
    } else {
      if (pRoot.childVertices.length > qRoot.childVertices.length) {
        this._computeDepthAndAddToLinkedVertices(qRoot, pRoot);
      } else if (qRoot.childVertices.length > pRoot.childVertices.length) {
        this._computeDepthAndAddToLinkedVertices(pRoot, qRoot);
      } else {
        this._computeDepthAndAddToLinkedVertices(pRoot, qRoot);
      }
    }
  }
  _computeDepthAndAddToLinkedVertices(child: Vertex, parent: Vertex): void {
    parent.childVertices.push(child);
    child.root = parent;
    // now find out whether we ned to increase the parent maxDepth
    child.levelInTree = parent.levelInTree + 1;
    let toBeDepth: number = 0;
    toBeDepth = child.maxDepth + 1;
    parent.maxDepth = (parent.maxDepth >= toBeDepth) ? parent.maxDepth : toBeDepth;
    // for rendering purposes
    this._recursivelyChangeAllChildrenLevel(child);
    // increases the maxDepth on all the roots up the chain
    this._recursivelyChangeRootDepth(parent);
  }

  _recursivelyChangeAllChildrenLevel(v: Vertex) {
    for (let node in v.childVertices) {
      node.levelInTree++;
      this._recursivelyChangeAllChildrenLevel(node);
    }
  }
  _recursivelyChangeRootDepth(v: Vertex) {
    if (v.root === v) {
      // dont do anything
    } else {
      let vertexRoot: Vertex = v.root;
      let toBeDepth: number = 0;
      toBeDepth = v.maxDepth + 1;
      vertexRoot.maxDepth = (vertexRoot.maxDepth >= toBeDepth) ? vertexRoot.maxDepth : toBeDepth;
      this._recursivelyChangeRootDepth(vertexRoot);
    }
  }
}
