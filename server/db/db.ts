
import * as mongodb from 'mongodb';
let server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
let db = new mongodb.Db('mydb', server, { w: 1 });
db.open(function() {});
