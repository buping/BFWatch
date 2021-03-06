/**
 * Created by beifen-honglei on 2017/4/17.
 */
const socketio = require('socket.io');
var util = require('util');
var Emitter = require("events").EventEmitter;

var models = require('./models');
var bfstatusdb = models.nodeStatus;
var scanstatdb = models.scanstat;


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

    bfstatusdb.findAll({where:{projectName:projectName}}).then(function(allret){
        socket.emit('update',allret);
      }
    );

    var now = Date.now()- 1000*60*60*24;
    scanstatdb.findAll({where:
    {
      projectName:projectName
      //   ,
      //scanHour:{gt:now}
    },
      order:'scanHour DESC',
      limit:24
    }).then(function(allret){
        socket.emit('scanstat',allret);
      }
    );

  }.bind(this));

  this.io.listen(this.wsPort);
  setInterval(this.CheckDeadNode.bind(this),5000);
  console.log('start websocket server for project '+this.projectName+' on port:'+this.wsPort);
};



BFViewInstance.prototype.emit = function(msgType,msg){
  if (this.io == undefined)
    return;

  this.io.emit(msgType,msg);
};


BFViewInstance.prototype.CheckDeadNode=function(){
  var now = Date.now();
  bfstatusdb.findAll({where:{projectName:this.projectName,online:true}}).then(function(allret){
      for (let entry of allret){
        var elapsed = now - entry.lastReportTime;
        //console.log("elapsed:"+elapsed);
        if (elapsed > 20000){
          //console.log(entry.nodeName+" is offline");
          entry.online = false;
          entry.lastOfflineTime = entry.lastReportTime;
          entry.save();
        }
      }
      this.emit('update',allret);
    }.bind(this)
  );
};


module.exports = BFViewInstance;



