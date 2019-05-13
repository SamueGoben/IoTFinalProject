//This file handles the communication betweeen the web app and accessing data from 
// the google cloud storage platform

// Example of simple server which displays info about incoming requests and sends simple response
var http = require("http");    //#A
var port = 9999;    // can use any port # you prefer (above 1024) - client must use same port #
var request2 = require('request');
// anonymous function - function which handles requests to server
// request - incoming request message
// response - response message to be sent to client
'use strict';
const {Storage} = require('@google-cloud/storage');

// Instantiates a client. Explicitly use service account credentials by
// specifying the private key file. All clients in google-cloud-node have this
// helper, see https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
const storage = new Storage({
  projectId: 'demodeploymentapp',
  keyFilename: 'C:/Users/slavensr/Downloads/demodeploymentapp-4504f8886214.json', //this is a local file, will need to be changed to relative location of individual json credential file
});

let ListOfBuckets = [];
let listOfObjects = [];
let numBuckets = 0;
let currBucketGlobal;

let jsonToReturn;

//creates array based off length dimension
//adds more dimensions for more input arguements
function createArray(length) {
  var arr = new Array(length || 0),
      i = length;
  if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }
  return arr;
}

//remove a element from an array
function arrayRemove(arr, value) {
  return arr.filter(function(ele){
      return ele != value;
  });
}

//list all buckets in project
function listBuckets(_callback){

  storage
    .getBuckets()
    .then(results => {
      const buckets = results[0];

      buckets.forEach(bucket => {
        
        if (bucket.name != "demodeploymentapp.appspot.com" &&
            bucket.name != "presentation-data-bucket" &&
             bucket.name != "staging.demodeploymentapp.appspot.com"){ //these are not relevant to and not necessary for project

                ListOfBuckets.push(bucket.name);
                numBuckets = numBuckets + 1;
        }
        
      });
      _callback();
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

//list all objects, given a name of a bucket, with currBucket being used to determine which value of array to put in files
function listObjects(bucketName, currBucket, _callback){

  storage
    .bucket(bucketName).getFiles()
    .then(results => {

      const[files] = results[0];
      
      listOfObjects.push(files.name);
      currBucketGlobal = currBucketGlobal + 1;
      _callback();

    })
    .catch(err => {
      console.error('ERROR:', err);
    });

}
//populate arrays of the different buckets and objects in the bucket.
//these arrays will be then sent back to website to create forms.
function populateForm(_callback){
  console.log("popForm");

  listBuckets(function() {                            
      
    console.log("list of buckets populated");
    let currSpot = 0;
    console.log("numBuckets: "+ numBuckets);
    
    //listOfObjects = createArray(numBuckets);
    currBucketGlobal = 0;

    console.log("List of bucks: " + ListOfBuckets);
    
    ListOfBuckets.forEach(bucket => {
      
      listObjects(bucket, currBucketGlobal, function(){
        
        if (currBucketGlobal == numBuckets){
          _callback();
        }
        
      });

    });
  });
}

//acquire data from storage based on bucket name and object name
function populateData(findBucketName, findObjectName, _callback){

  console.log("object Name: " + findObjectName);
  console.log("in Populate Data");

  let destFilename = 'C:/Users/slavensr/Documents/ECE597/Final Project Website/IoTFinalProject/Final Project/' + findObjectName;

  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
  };

  storage
    .bucket(findBucketName)
    .file(findObjectName)
    .download(options)

    .then(results => {

      console.log("looking for dataset");

      var fs = require("fs");
      var contents = fs.readFileSync(findObjectName);

      var jsonContent = JSON.parse(contents);
      console.log(jsonContent);
      jsonToReturn = jsonContent;


      _callback();

    })

    .catch(err => {
      console.error('ERROR:', err);
    });

}

http.createServer(function(request,response){    //#B

  console.log(request.url);

  let requestData = request.url.split("?");
  let determineData = requestData[1];
  console.log(determineData);
  console.log(requestData);

  if (determineData == "populateForm"){

    populateForm(function(){
      
      let jsonListOfBuckets = JSON.stringify(ListOfBuckets);
      let jsonListOfObjects = JSON.stringify(listOfObjects);
      
      let jsonCombined = '{ "ListOfBuckets": ' + jsonListOfBuckets + "}/n" + '{ "ListOfObjects": ' + jsonListOfObjects + "}";

      response.writeHead(200,    
        {'Content-Type': 'application/json',    
        'Access-Control-Allow-Origin': '*'});    
      
      response.end(JSON.stringify(jsonCombined));

      ListOfBuckets = [];
      listOfObjects = [];
      numBuckets = 0;
      currBucketGlobal = 0;

    });
  } //end of if statement

  else if (determineData == "populateData"){

    console.log("poulate Data");

    let findBucket = requestData[2];
    let findObject = requestData[3];

    populateData(findBucket, findObject, function (){

      console.log("in Populate data callback");

      response.writeHead(200,    
        {'Content-Type': 'application/json',    
        'Access-Control-Allow-Origin': '*'});    
      
      response.end(JSON.stringify(jsonToReturn));

    });


  }



}).listen(port);    //#H
console.log('Server listening on http://localhost:' + port);
