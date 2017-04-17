var express = require('express');
var router = express.Router();

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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
