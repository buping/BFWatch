/**
 * Created by beifen-honglei on 2017/4/17.
 */
const socketio = require('socket.io');
var util = require('util');

var models = require('./models');

var bfstatus = models.nodeStatus;
var scanstat = models.scanstat;
var invalidscan = models.invalidscan;


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

    bfstatus.findAll({where: {projectName: projectName}}).then(function (allret) {
        socket.emit('update', allret);
      }
    );

    scanstat.findAll({
      where: {
        projectName: projectName
      },
      order: 'scanHour DESC',
      limit: 24
    }).then(function (allret) {
        socket.emit('scanstat', allret);
      }
    );

    socket.on('searchinvalid', function (data) {
      var barcode = '%' + data + '%';
      invalidscan.findOne({
        where: {
          scanResult: {$like: barcode}
        },
        order: 'scanTime DESC'
      }).then(function (entry) {
        console.log(entry);
        if (entry != null) {
          socket.emit('foundinvalid', entry);
        }
      });
    });
  }.bind(this));

  this.io.listen(this.wsPort);
  console.log('start websocket server for project '+this.projectName+' on port:'+this.wsPort);
  setInterval(this.CheckDeadNode.bind(this),5000);
};


BFViewInstance.prototype.CheckDeadNode=function(){
  var now = Date.now();
  bfstatus.findAll({where:{projectName:this.projectName,online:true}}).then(function(allret){
      for (let entry of allret){
        var elapsed = now - entry.lastReportTime;
        //console.log("elapsed:"+elapsed);
        if (elapsed > 30000){
          //console.log(entry.nodeName+" is offline");
          entry.online = false;
          entry.lastOfflineTime = entry.lastReportTime;
          entry.save();
        }
      }
      //io.emit('update',allret);
      this.emit('update',allstatus);
    }
  ).bind(this);
};


BFViewInstance.prototype.emit = function(msgType,msg){
  if (this.io == undefined)
    return;

  this.io.emit(msgType,msg);
};

module.exports = BFViewInstance;



