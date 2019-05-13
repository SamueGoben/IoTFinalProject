

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

http.createServer(function(request,response){    //#B


  // listBuckets(function() {
      
  //   console.log("here");


  // });

  let reqData = request.data;
  console.log(request);

  var x;
  var headers = request.headers;
  var trailers = request.trailers;

  var decodeUrl = decodeURIComponent(request.url);
  console.log(decodeUrl);

  var split = decodeUrl.split("http");
  var yelpURL = "http" + split[1];

  // console.log('New incoming client request for ');
  
  // console.log('Request method: ' + request.method);
  // console.log('Headers: ');
  // for (x in headers) {
  //   console.log('\t{' + x + ': \"' + headers[x] + '\"}');
  // }
  // console.log('Trailers: ');
  // for (x in trailers) {
  //   console.log('\t{' + x + ': \"' + trailers[x] + '\"}');
  // }

  console.log('here2');

}).listen(port);    //#H
console.log('Server listening on http://localhost:' + port);
