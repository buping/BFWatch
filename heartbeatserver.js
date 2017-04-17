var mqtt = require('mqtt')
var models = require('./models');

var bfstatus = models.nodeStatus;

bfstatus.sync().then(function (){
  console.log('create status successful');
});


var client  = mqtt.connect('mqtt://47.90.45.27' ,{
	username:'beifen',
	password:'beifen111',
	reconnectPeriod: 5000
}
);

client.on('error',function(err){
	console.log("mqtt error occured,reconnect in 5 seconds:"+err);
});
 
 
client.on('connect', function () {
  console.log('connect to mqtt server');

  client.subscribe('heartbeat')
});

client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  if (topic == 'heartbeat'){
  	handleHeartBeat(message);
  }
  //client.end()
});

var handleHeartBeat = function (message){
	
};

