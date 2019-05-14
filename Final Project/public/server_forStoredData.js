

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

let ListOfBuckets;
let listOfObjects;
let numBuckets = 0;

function createArray(length) {
  var arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }

  return arr;
}

//remove a vlaue from an array
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
      ListOfBuckets = buckets;

      //console.log(ListOfBuckets);
      //console.log('Buckets:');
      buckets.forEach(bucket => {
        numBuckets = numBuckets + 1;
      });
      _callback();
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

//list all objects, given a name of a bucket, with currBucket being used to determine which value of array to put in files
function listObjects(bucketName, currBucket, _callback){

  console.log("list Objects: " + bucketName + " " + currBucket);
  let arrNames;
  storage
    .bucket(bucketName).getFiles()

    .then(results => {

      const[files] = results[0];
      console.log(files.name);
      
      // files.forEach(file => {

      //   console.log(file.name);
      //   arrNames.push(file.name);

      // });

    })

    .then(results => {

      //listOfObjects[currBucket] = arrNames;
     
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

  if (determineData == "populate"){

    listBuckets(function() {                            
      
      console.log("list of buckets populated");
      let currSpot = 0;
      console.log("numBuckets: "+ numBuckets);
      numBuckets = numBuckets - 3;

      listOfObjects = createArray(numBuckets, 1);

      currBucket = 0;
      
      ListOfBuckets.forEach(bucket => {

        if (bucket.name == "demodeploymentapp.appspot.com" ||
              bucket.name == "presentation-data-bucket" ||
               bucket.name == "staging.demodeploymentapp.appspot.com"){ //these are not relevant to and not necessary for project
            
          //console.log(bucket.name);
          ListOfBuckets.splice(currSpot, currSpot);
          currSpot = currSpot - 1;
            
        }

        else{

          console.log(bucket.name);

          listObjects(bucket.name, currBucket, function(){

              // listOfObjects.forEach(object =>{
              //   console.log("object name: " + object.name);
              // });
            
          });

          currBucket = currBucket + 1;

        }  //end of else
        currSpot = currSpot + 1;

      });
    });

  } //end of if statement



}).listen(port);    //#H
console.log('Server listening on http://localhost:' + port);
