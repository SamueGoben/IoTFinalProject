//Shane Slaven getting and uploading data to cloud storage from Thingspeak
//requirements
// fs
// npm 
// mqtt
// google apis
// edit-json-file
//These have been saved in package-lock.json

//For future use, make date apart of the naming convention so files don't get to big
let today;
let date;
let time;
let dateTime;

let bucketExists = 0;

//get current date and time
function getDateandTime(){

    today = new Date();
    date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date+' '+time;

}

// Imports the Google Cloud client library.
'use strict';
const {Storage} = require('@google-cloud/storage');

// Instantiates a client. Explicitly use service account credentials by
// specifying the private key file. All clients in google-cloud-node have this
// helper, see https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
const storage = new Storage({
  projectId: 'demodeploymentapp',
  keyFilename: 'C:/Users/slavensr/Downloads/demodeploymentapp-4504f8886214.json', //this is a local file, will need to be changed to relative location of individual json credential file
});

let ListOfBuckets;

//list all buckets in project
function listBuckets(_callback){

  storage
    .getBuckets()
    .then(results => {
      const buckets = results[0];
      ListOfBuckets = buckets;

      //console.log(ListOfBuckets);
      //console.log('Buckets:');
      // buckets.forEach(bucket => {
      //   console.log(bucket.name);
      // });
      _callback();
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

//creates a bucket for our project. bucket Name is currently set when function is called
function createBucket(bucketName, _callback){

  storage
    .createBucket(bucketName, {
      location: 'us-central1',
      storageClass: 'Regional',
    })
    .then(results => {
      console.log(`Bucket ${bucketName} created`);
      _callback(bucketName);
    })

    .catch(err => {
      console.error('ERROR:', err);
    });
}

//createBucket for new field of current project that the app is connected to
function createDataBucket(dataString, dataId, currField){

  let bucketName = "project-" + dataId + "-datatype-" + currField;
  
  createBucket(bucketName, function(bucketName) {

      console.log("here123");
      
      let dataName = "" + currField + "-dataset.json";
      var fs = require('fs');
      fs.writeFile(dataName, dataString);

      let fileName = 'C:/Users/slavensr/Documents/ECE597/Final Project Website/IoTFinalProject/Final Project/' + dataName;

      storage.bucket(bucketName).upload(fileName, {

        gzip: true,
      });

      console.log(`${dataName} uploaded to ${bucketName}.`);
  });
}


function updateBucket(currData, dataId, currField){

  console.log('start update bucket');

  let bucketName = "project-" + dataId + "-datatype-" + currField;
  let dataName = "" + currField + "-dataset.json";

  let destFilename = 'C:/Users/slavensr/Documents/ECE597/Final Project Website/IoTFinalProject/Final Project/' + dataName;

  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
  };
  

  storage
    .bucket(bucketName)
    .file(dataName)
    .download(options)

    .then(results => {

      //console.log('here');

      var fs = require("fs");

      //console.log("dataName:" +dataName);

      var contents = fs.readFileSync(dataName);

      //console.log("cont" + contents);

      var jsonContent = JSON.parse(contents);

      var currSize = jsonContent.size;
      let newSize = parseInt(currSize) + 1;

      let newData = "data" + newSize;

      //console.log(newSize);

      const editJsonFile = require("edit-json-file");
      let file = editJsonFile(destFilename);

      //console.log("in file set");

      file.set("size", newSize);

      file.set(newData + ".Name", currField);
      file.set(newData + ".Date", date);
      file.set(newData + ".Time", time);
      file.set(newData + ".Data", currData);

      file.save();

      //console.log("after file set");

      storage.bucket(bucketName).upload(destFilename, {
        gzip: true,
      })
      .then(results => {
        console.log(`${dataName} uploaded to ${bucketName}.`);
      })
      .catch(err => {
        console.error('ERROR:', err)});

    })
    .catch(err => {
      console.error('ERROR:', err);
    });

      
}
//come up with command arguement to set this;
let channelID;

let projectFields;
let dataId;
const PUBDELAY = 16000;

let mqttAPIKey = 'LQLH4I4IPOCVQ6HQ';
let channelWriteKey;

var pubTopic; 
var subTopic;
var pubTimer;

function determineAPIfields(channel){

  if (channel == '480910'){
    //dataID cannot have capital letters
    dataId = 'iotece597';
    channelWriteKey = 'QNZX1HHTT68JGLPF';
    channelID = '480910';

    pubTopic = 'channels/'+channelID+'/publish/fields/'; 
    subTopic = 'channels/480910/subscribe/fields/+/JGB4EQPE2UWPMMFY';
    //these cannot not have capital letters
    projectFields = ["tempc", "humidity", "occupancy", "ledr", "ledg", "ledb", "ledy", "cmid"];

  }

  else if (channel == '759369'){

    //dataID cannot have capital letters
    dataId = 'temperaturehumidityteam';
    channelWriteKey = 'FGXCNKG6IPJN9H0L';
    channelID = '759369';

    pubTopic = 'channels/'+channelID+'/publish/fields/'; 
    subTopic = 'channels/759369/subscribe/fields/+/V9MCF08KEH3UZYEB';
    //these cannot not have capital letters
    projectFields = ["tempc", "humidity-percent", "pressure-kpa", "fan-status", "vent-status", "user-override"];

  }

  else if (channel == '776756'){

    //dataID cannot have capital letters
    dataId = 'irrigationteam';
    channelWriteKey = 'QNZX1HHTT68JGLPF';
    channelID = '776756';

    pubTopic = 'channels/'+channelID+'/publish/fields/'; 
    subTopic = 'channels/776756/subscribe/fields/+/LKKUM8Y741JBBGHH';
    //these cannot not have capital letters
    projectFields = ["tempc", "humidity-percent", "soilmoisture", "rain", "pump-status"];

  }

}

determineAPIfields('759369');
//console.log(fields[0]);

// Connect to MQTT broker at Thingspeak
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://mqtt.thingspeak.com:1883', {username: 'user', password: mqttAPIKey});

client.on('connect', function () {
  console.log('MQTT connection established');
  client.subscribe(subTopic);
  
});

// When message from subscription is received, display topic and value
//  Schedule publish after delay due to Thingspeak publish limit
client.on('message', function (topic, message) {

  bucketExists = 0;

  console.log(topic + ': ' + message.toString());
  var fields = topic.split('/');

  console.log(message.toString());
  let currData = message.toString().trim();
 
  var fieldLocal = (fields[4].trim()).split('field');

  var currField = projectFields[fieldLocal[1]-1]; // minus 1 because arrayed based but fields start at 1

  let currBucketName = "project-" + dataId + "-datatype-" + currField;

  getDateandTime();
  
  listBuckets(function() {
      
      ListOfBuckets.forEach(bucket => {

        if (bucket.name == currBucketName){
          bucketExists = 1;
        }
      });

      console.log("bucketExits: " + bucketExists);

      if (bucketExists == 0){

        var data = {
          "size": "0",
          "data0": {
            "Name": currField,
            "Date": date,
            "Time": time,
            "Data": currData
          }
        };
        var dataString = JSON.stringify(data);
        createDataBucket(dataString, dataId, currField);

      }
      
      else{

        updateBucket(currData, dataId, currField);
      }
  });
});

// Listen to the event triggered on CTRL+C
process.on('SIGINT', function () {
  clearTimeout(pubTimer);
  client.end();
  console.log('Bye, bye!');
  process.exit();
});
