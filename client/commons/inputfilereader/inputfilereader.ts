import {Component, ElementRef, EventEmitter, Output} from 'angular2/core';
@Component({
  selector: 'filereader',
  templateUrl: './commons/inputfilereader/filereader.html',
  styleUrls: ['./commons/inputfilereader/filereader.css'],
  providers: [ElementRef]
})

export class InputFileReader {
  @Output() complete :any = new EventEmitter();
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
      self.complete.next(self.resultSet);
    };
  }
}
