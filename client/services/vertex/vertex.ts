
import {ElementRef} from 'angular2/core';
import {Path} from '../paths/path';
declare var d3: any;

export class Vertex  {
  identity: string;
  // this proprty is only to determine the place where the child needs to ne rendered
  levelInTree:number;
  // this property determines whether p/q will determine parent or child
  maxDepth:number=0;
  linkedVertices: Array<Vertex> = [];
  alreadyReached: boolean = false;
  path:Path = new Path();
  root:Vertex = this;
  findGraph:any;
  constructor(v: string, elementRef: ElementRef) {
    this.identity = v;
  }
  connectTo(v: Vertex) {
    if (this.linkedVertices.indexOf(v) === -1) {
      this.linkedVertices.push(v);
    }
  }
}
