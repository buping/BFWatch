/**
 * Created by beifen-honglei on 2017/4/17.
 */
const socketio = require('socket.io');
var util = require('util');
var Emitter = require("events").EventEmitter;

var models = require('./models');


var defaults = {
  //reportVersionTimeout: 5000,
  projectName: "default",
  wsPort: 21435
};

function BFViewInstance(options) {
  if (!(this instanceof BFViewInstance)) {
    return new BFViewInstance(options);
  }
  Emitter.call(this);

  this.settings = Object.assign({}, defaults, options);
  this.projectName = this.settings.projectName;
  this.wsPort = this.settings.wsPort;
  this.Init();
}

BFViewInstance.prototype.Init = function(){
  this.InitDb();
  this.StartServer();
};

BFViewInstance.prototype.InitDb = function(){
};

BFViewInstance.prototype.StartServer = function(){
  this.io = socketio();

  this.io.on('connection', function (socket) {
    var projectName = this.projectName;
    console.log('project:'+projectName +' websocket on connection');

  }.bind(this));

  this.io.listen(this.wsPort);
  console.log('start websocket server for project '+this.projectName+' on port:'+this.wsPort);
};



BFViewInstance.prototype.emit = function(msgType,msg){
  if (this.io == undefined)
    return;

  this.io.emit(msgType,msg);
};

module.exports = BFViewInstance;



