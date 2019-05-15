/* jshint esversion: 6 */

//This file handles communication between the web application and thingspeak
//primarily in regards to handling publish to fields that allow for writing to in thingspeak
//also it subscribes to channels in thingspeak, that are used to send current data back
//to the webstie

// Example of simple server which displays info about incoming requests and sends simple response
var http = require("http");    //#A
var port = 8888;    // can use any port # you prefer (above 1024) - client must use same port #
var request2 = require('request');
// anonymous function - function which handles requests to server
// request - incoming request message
// response - response message to be sent to client

var num;
var pump;

var oldVal;
//actuate the override field in thingspeak using mqtt
//team temperature and humidity
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
//actuate the pump field in thingspeak using mqtt
//team irrigation
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

let channelID;
let dataId;
let channelWriteKey;
let subTopic;
let fieldID;
let projectFields;

let retData;

//determine which thingSpeak channel to access and which field to access
function getChannelData(channelIDDetermine, fieldIDDetermine, _callback){

  console.log("in get Channel Data");

  if (channelIDDetermine == "iotece597"){
    dataId = 'iotece597';
    channelWriteKey = 'QNZX1HHTT68JGLPF';
    channelID = '480910';

    projectFields = ["tempc", "humidity", "occupancy", "ledr", "ledg", "ledb", "ledy", "cmid"];

    if (fieldIDDetermine == "cmid"){
      fieldID = "field8";
    }
    else if (fieldIDDetermine == "tempc"){
      fieldID = "field1";
    }
    else if (fieldIDDetermine == "humidity"){
      fieldID = "field2";
    }
    else if (fieldIDDetermine == "occupancy"){
      fieldID = "field3";
    }
    else if (fieldIDDetermine == "ledr"){
      fieldID = "field4";
    }
    else if (fieldIDDetermine == "ledg"){
      fieldID = "field5";
    }
    else if (fieldIDDetermine == "ledb"){
      fieldID = "field6";
    }
    else if (fieldIDDetermine == "ledy"){
      fieldID = "field7";
    }

    subTopic = "channels/480910/subscribe/fields/" + fieldID + "/JGB4EQPE2UWPMMFY";
    _callback();
  }

  else if (channelIDDetermine == "irrigationteam"){
    channelID = '776756';
    dataId = 'irrigationteam';
    channelWriteKey = 'QNZX1HHTT68JGLPF';
    channelID = '776756';

    projectFields = ["tempc", "humidity-percent", "soilmoisture", "rain", "pump-status"];

    if (fieldIDDetermine == "tempc"){
      fieldID = "field1";
    }
    else if (fieldIDDetermine == "humidity"){
      fieldID = "field2";
    }
    else if (fieldIDDetermine == "soilmoisture"){
      fieldID = "field3";
    }
    else if (fieldIDDetermine == "rain"){
      fieldID = "field4";
    }
    else if (fieldIDDetermine == "pump"){
      fieldID = "field5";
    }

    subTopic = 'channels/776756/subscribe/fields/' + fieldID + '/LKKUM8Y741JBBGHH';
    _callback();
  }

  else{
    channelID = '759369';
    dataId = 'temperaturehumidityteam';
    channelWriteKey = 'FGXCNKG6IPJN9H0L';

    projectFields = ["tempc", "humidity-percent", "pressure-kpa", "fan-status", "vent-status", "user-override"];

    if (fieldIDDetermine == "tempc"){
      fieldID = "field1";
    }
    else if (fieldIDDetermine == "humidity"){
      fieldID = "field2";
    }
    else if (fieldIDDetermine == "pressure"){
      fieldID = "field3";
    }
    else if (fieldIDDetermine == "fan"){
      fieldID = "field4";
    }
    else if (fieldIDDetermine == "vent"){
      fieldID = "field5";
    }
    else if (fieldIDDetermine == "user"){
      fieldID = "field6";
    }

    subTopic = 'channels/759369/subscribe/fields/' + fieldID + '/V9MCF08KEH3UZYEB';
    _callback();
  }


}

//get current data using mqtt subscribe to thingspeak channels/fields
function getCurrentData(identify, _callback){

  console.log("in Get current data");

  var PUBDELAY = 16000;
  var mqttAPIKey = 'PON9BR1J9345M5OJ';

  let channelIDDetermine = (identify.split("-"))[0];
  let fieldIDDetermine = (identify.split("-"))[1];

  getChannelData(channelIDDetermine, fieldIDDetermine, function(){

    console.log(subTopic);
    console.log("in get channel data");

    let startTime = new Date().getTime();

    var mqtt = require('mqtt');
    var client  = mqtt.connect('mqtt://mqtt.thingspeak.com:1883', {username: 'user', password: mqttAPIKey});
  
    client.on('connect', function () {
      console.log('MQTT connection established');
      client.subscribe(subTopic);

      setTimeout(function(){

        console.log("in timeout func");
        retData = 'no Data';
        console.log("no new data");
        client.end();
        _callback();

      }, 20000); //this time out function will help get rid of errors in no responses
    
    });

    client.on('message', function (topic, message) {
    
      console.log(topic + ': ' + message.toString());
      var fields = topic.split('/');
    
      console.log(message.toString());
      retData = message.toString().trim();
      client.end();
      _callback();

    });

    // while (new Date().getTime() - startTime < 30000){

    //   console.log("in while loop");

    //   // client.on('message', function (topic, message) {
    
    //   //   console.log(topic + ': ' + message.toString());
    //   //   var fields = topic.split('/');
      
    //   //   console.log(message.toString());
    //   //   retData = message.toString().trim();
    //   //   client.end();
    //   //   _callback();
  
    //   // });

    //   if (new Date().getTime() - startTime > 30000){

    //     retData = 'no Data';
    //     console.log("no new data");
    //     client.end();
    //     _callback();

    //   }

    // }

    if (new Date().getTime() - startTime > 30000){
      console.log("in if statement");
      retData = 'no Data';
      console.log("no new data");
      client.end();
      _callback();

    }

  


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

  else{

    getCurrentData(determineData, function(){

      console.log("in get current data callback");

      response.writeHead(200,    
        {'Content-Type': 'application/json',    
        'Access-Control-Allow-Origin': '*'});    
      
      response.end(JSON.stringify(retData));

    });

  }

  //return;

}).listen(port);    //#H
console.log('Server listening on http://localhost:' + port);
