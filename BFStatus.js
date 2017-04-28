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
			for (let entry of allRet) {
			  console.log(entry.projectCnName);
        try {
          var oneServer = new BfInstance({projectName: entry.projectName, wsPort: entry.wsPort});
          serverMap.set(entry.projectName, oneServer);
        }catch(err){}
			}
		});
}

function EmitMsg(projectName,msgType,msg){
  var server = serverMap.get(projectName);
  if (server != undefined && server != null){
    server.emit(msgType,msg);
  }
}

module.exports.StartAll = StartAll;