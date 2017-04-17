var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://47.90.45.27' ,{
	username:'beifen',
	password:'beifen111',
	reconnectPeriod: 5000
}
);

client.on('error',function(err){
	console.log("error occured,reconnect in 5 seconds:"+err);
});
 
 
client.on('connect', function () {
  client.subscribe('shengbang');
});

client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
  //client.end()
});