var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var util = require('util');

var mqtt = require('mqtt')
var models = require('./models');

var bfstatus = models.nodeStatus;
var scanstat = models.scanstat;
var invalidscan = models.invalidscan;

var project = 'shengbanghangzhou';

bfstatus.sync().then(function (){
  console.log('create status successful');
});

scanstat.sync().then(function (){
  console.log('create scanstat successful');
});

invalidscan.sync().then(function (){
  console.log('create invalidscan successful');
});


var client  = mqtt.connect('mqtt://47.90.45.27' ,{
        username:'beifen',
        password:'beifen111',
        reconnectPeriod: 5000
}
);

server.listen(27407);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  console.log('on connection');
  
  bfstatus.findAll({where:{projectName:project}}).then(function(allret){
  	socket.emit('update',allret);
	}
	);
	
	var now = Date.now()- 1000*60*60*24;
	scanstat.findAll({where:
		  {
			projectName:project
            //   ,
			//scanHour:{gt:now}
		  },
          order:'scanHour DESC',
          limit:24
      }).then(function(allret){
  		socket.emit('scanstat',allret);
		}
	);
	
	socket.on('searchinvalid', function (data) {
		var barcode = '%'+data+'%';
		invalidscan.findOne({
			where: {
				scanResult: {$like:barcode}
			},
			order: 'scanTime DESC'
			}).then(function (entry){
				console.log(entry);
			if (entry != null){
				socket.emit('foundinvalid',entry);
			}
		});
  });
  

 /*
  socket.on('my other event', function (data) {
    console.log(data);
  });
*/

  //setInterval(socket.emit.bind(socket,'news','test'),1000);
});


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
	bfstatus.findOne({where: {projectName:messObj.project,nodeName:messObj.name}}).then(
		function(myNode){
			if (myNode == undefined || myNode == null){
					myNode = {};
					myNode.projectName = messObj.project;
					myNode.nodeName = messObj.name;
					myNode.online = true;
					myNode.lastReportTime = Date.now();
					myNode.lastOnlineTime = Date.now();
					bfstatus.upsert(myNode);
			}else{			
				if (myNode.online == false){
					myNode.lastOnlineTime = Date.now();
					myNode.lastOfflineTime = myNode.lastReportTime;
				}
				myNode.online = true;
				myNode.lastReportTime = Date.now();
				var allstatus = [];
		  	allstatus.push(myNode);
		  	io.emit('update',allstatus);		  
		  	myNode.save().then(function(){
		  		//console.log('update db successful');
		  	}).catch(function(err){
		  		console.log('update db error:'+err);
		  	});
		  }
		});
};

var CheckDeadNode=function(){
	var now = Date.now();	
  bfstatus.findAll({where:{projectName:project,online:true}}).then(function(allret){
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
  		io.emit('update',allret);
		}
	);	
};
setInterval(CheckDeadNode,3000);


function saveInvalidScan(project,msg){
	//console.log("got invalid msg"+msg);
	var msgObj = JSON.parse(msg);
	if (msgObj.id != undefined){
		var invalidEntry={};
		invalidEntry.projectName = project;
		invalidEntry.scanTime = Date.now();
		invalidEntry.scanResult = JSON.stringify(msgObj.scan);
		invalidEntry.packetID = msgObj.id;
		invalidscan.upsert(invalidEntry).catch(function(err){
			console.log('insert invalid scan error:'+err);
		});
	}
}


var handleScan=function (scanMsg){
	var project = scanMsg.project;
	var scanType = scanMsg.scanType;
	var msg = scanMsg.msg;
	io.emit('scan',scanMsg);
	
	var now = new Date();
	var hourTime = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours());
	
	scanstat.findOne({where:{projectName:project,scanHour:hourTime}}).then(
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
					scanstat.upsert(stat).catch(function(err){
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
				io.emit('scanstat',allres);
			}
		});

}



