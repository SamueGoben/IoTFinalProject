/* jshint esversion: 6 */

// Example of simple server which displays info about incoming requests and sends simple response
var http = require("http");    //#A
var port = 8888;    // can use any port # you prefer (above 1024) - client must use same port #
var request2 = require('request');
// anonymous function - function which handles requests to server
// request - incoming request message
// response - response message to be sent to client

var num;
var pump;

function overrideMqtt(num) {
  // Example of MQTT client application
  //  Connects to MQTT broker on Thingspeak
  //  Subscribe to topic
  //  On message receive from subscription, publish to another topic

  // 16 ms delay - since Thingspeak only allows one publish per channel per 15 seconds
  var PUBDELAY = 16000;

  var mqttAPIKey = 'PON9BR1J9345M5OJ';
  var channelWriteKey = 'FGXCNKG6IPJN9H0L';
  var channelID = '759369';
  var fieldID = 'field6';

  var pubTopic = 'channels/'+channelID+'/publish/fields/'+fieldID; 
  var pubTimer;

  // Connect to MQTT broker at Thingspeak
  var mqtt = require('mqtt');
  var client  = mqtt.connect('mqtt://mqtt.thingspeak.com:1883', {username: 'MyThingspeakName', password: mqttAPIKey});

  client.publish(pubTopic+'/'+channelWriteKey, String(num));
  console.log("publish to " + fieldID + " value: " + String(num));

  // Listen to the event triggered on CTRL+C
  process.on('SIGINT', function () {
      clearTimeout(pubTimer);
      client.end();
      console.log('Bye, bye!');
      process.exit();
  });
}

function pumpMqtt(pump) {
  // Example of MQTT client application
  //  Connects to MQTT broker on Thingspeak
  //  Subscribe to topic
  //  On message receive from subscription, publish to another topic

  // 16 ms delay - since Thingspeak only allows one publish per channel per 15 seconds
  var PUBDELAY = 16000;

  var mqttAPIKey = 'PON9BR1J9345M5OJ';
  var channelWriteKey = 'KI7ZMB4QPQ5I0R3W';
  var channelID = '776756';
  var fieldID = 'field5';

  var pubTopic = 'channels/'+channelID+'/publish/fields/'+fieldID; 
  var pubTimer;

  // Connect to MQTT broker at Thingspeak
  var mqtt = require('mqtt');
  var client  = mqtt.connect('mqtt://mqtt.thingspeak.com:1883', {username: 'MyThingspeakName', password: mqttAPIKey});

  client.publish(pubTopic+'/'+channelWriteKey, String(pump));
  console.log("publish to " + fieldID + " value: " + String(pump));

  // Listen to the event triggered on CTRL+C
  process.on('SIGINT', function () {
      clearTimeout(pubTimer);
      client.end();
      console.log('Bye, bye!');
      process.exit();
  });
}

http.createServer(function(request,response){    //#B

  console.log(request.url);

  let requestData = request.url.split("?");
  let determineData = requestData[1];
  console.log(determineData);

  if (determineData == "FanOpen") {
    num = 1;
    overrideMqtt(num);
  }
  else if (determineData == "VentOpen") {
    num = 2;
    overrideMqtt(num);
  }
  else if (determineData == "Fan/VentOpen") {
    num = 3;
    overrideMqtt(num);
  }
  else if (determineData == "FanClose") {
    num = -1;
    overrideMqtt(num);
  }
  else if (determineData == "VentClose") {
    num = -2;
    overrideMqtt(num);
  }
  else if (determineData == "Fan/VentClose") {
    num = -3;
    overrideMqtt(num);
  }
  else if (determineData == "Automatic") {
    num = 0;
    overrideMqtt(num);
  }
  else if (determineData == "1") {
    pump = 1;
    pumpMqtt(pump);
  }
  else if (determineData == "0") {
    pump = 0;
    pumpMqtt(pump);
  }
  return;

}).listen(port);    //#H
console.log('Server listening on http://localhost:' + port);
