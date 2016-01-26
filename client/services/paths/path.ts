export class Path {
  dfsOnlyForDisplayPath:Array<string>=[];
  dfsComponentPath:Array<string>=[];
  reachedFromDuringBfsSearch:any={};
  addToDfsRenderPath(nodeId:string):Array<String>{
    this.dfsOnlyForDisplayPath.push(nodeId);
    return this.dfsOnlyForDisplayPath;
  };
  addToComponentPath(nodeId:string):Array<String>{
    this.dfsComponentPath.push(nodeId);
    return this.dfsComponentPath;
  };
}
