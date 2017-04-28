/**
 * Created by beifen-honglei on 2017/4/17.
 */
const socketio = require('socket.io');
var util = require('util');

var models = require('./models');

var bfproject = models.project;
var BfInstance = require('./BFViewInstance');

var serverMap = new Map();

function StartAll(){
  serverMap.clear();
	bfproject.findAll().then(function (allRet){
			for (let entry of allret) {
        var oneServer = new BfInstance(entry);
        oneServer.Init();
        serverMap.set(entry.projectName,oneServer);
			}
		});
}

function EmitMsg(projectName,msgType,msg){
  var server = serverMap.get(projectName);
  if (server != undefined && server != null){
    server.emit(msgType,msg);
  }
}
