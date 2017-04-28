/**
 * Created by beifen-honglei on 2017/4/17.
 */
var mqtt = require('mqtt');
var bfConfig = require ('./config/bfconfig.json');

var bfStatus = require('./BFStatus.js');

//bfStatus.StartAll();

var models = require('./models');

var bfstatusdb = models.nodeStatus;
var scanstatdb = models.scanstat;
var invalidscandb = models.invalidscan

var client = mqtt.connect(bfConfig.mqttserver,bfConfig.mqttoptions);

client.on('error',function(err){
  console.log("mqtt error occured,reconnect in 5 seconds:"+err);
});


client.on('connect', function () {
  console.log('connect to mqtt server');

  client.subscribe('heartbeat');
  client.subscribe('scan');
});

client.on('message', function (topic, message) {
  // message is Buffer
  //console.log(message.toString());
  if (topic == 'heartbeat'){
    var messObj = JSON.parse(message);
    handleHeartBeat(messObj);
  }else if (topic == 'scan'){
    var scanMsg = JSON.parse(message);
    handleScan(scanMsg);
  }
  //client.end()
});

var handleHeartBeat = function (messObj){
  bfstatusdb.findOne({where: {projectName:messObj.project,nodeName:messObj.name}}).then(
    function(myNode){
      if (myNode == undefined || myNode == null){
        myNode = {};
        myNode.projectName = messObj.project;
        myNode.nodeName = messObj.name;
        myNode.online = true;
        myNode.lastReportTime = Date.now();
        myNode.lastOnlineTime = Date.now();
        bfstatusdb.upsert(myNode);
      }else{
        if (myNode.online == false){
          myNode.lastOnlineTime = Date.now();
          myNode.lastOfflineTime = myNode.lastReportTime;
        }
        myNode.online = true;
        myNode.lastReportTime = Date.now();
        var allstatus = [];
        allstatus.push(myNode);
        //io.emit('update',allstatus);
        //bfStatus.EmitMsg(messObj.project,'update',allstatus);
        myNode.save().then(function(){
          //console.log('update db successful');
        }).catch(function(err){
          console.log('update db error:'+err);
        });
      }
    });
};



function saveInvalidScan(project,msg){
  //console.log("got invalid msg"+msg);
  var msgObj = JSON.parse(msg);
  if (msgObj.id != undefined){
    var invalidEntry={};
    invalidEntry.projectName = project;
    invalidEntry.scanTime = Date.now();
    invalidEntry.scanResult = JSON.stringify(msgObj.scan);
    invalidEntry.packetID = msgObj.id;
    invalidscandb.upsert(invalidEntry).catch(function(err){
      console.log('insert invalid scan error:'+err);
    });
  }
}


var handleScan=function (scanMsg){
  var project = scanMsg.project;
  var scanType = scanMsg.scanType;
  var msg = scanMsg.msg;
  bfStatus.EmitMsg(project,'scan',scanMsg);

  var now = new Date();
  var hourTime = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours());

  scanstatdb.findOne({where:{projectName:project,scanHour:hourTime}}).then(
    function(stat){
      if (stat == undefined || stat == null){
        stat = {};
        stat.projectName = project;
        stat.scanHour = hourTime;
        stat.allScan =0;
        stat.validScan=0;
        stat.emptyCart=0;
        stat.invalidScan=0;
        if (scanType == 0)
          stat.validScan++;
        else if (scanType == 1)
          stat.emptyCart++;
        else if (scanType == 2){
          stat.invalidScan++;
          saveInvalidScan(project,msg);
        }
        stat.allScan++;
        scanstatdb.upsert(stat).catch(function(err){
          console.log('database error');
        });
      }else{
        stat.allScan++;
        if (scanType == 0)
          stat.validScan++;
        else if (scanType == 1)
          stat.emptyCart++;
        else if (scanType == 2){
          stat.invalidScan++;
          saveInvalidScan(project,msg);
        }

        stat.save();

        var allres = [];
        allres.push(stat);
        bfStatus.EmitMsg(project,'scanstat',allres);
      }
    });

};

