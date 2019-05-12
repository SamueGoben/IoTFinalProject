

// Example of simple server which displays info about incoming requests and sends simple response
var http = require("http");    //#A
var port = 9999;    // can use any port # you prefer (above 1024) - client must use same port #
var request2 = require('request');
// anonymous function - function which handles requests to server
// request - incoming request message
// response - response message to be sent to client

var options = { method: 'GET',
  url: 'http://storage.googleapis.com/presentation-data-bucket/Fake-TemperatureSensor-dataset.json',
  headers: 
   { 'cache-control': 'no-cache',
     Connection: 'keep-alive',
     'accept-encoding': 'gzip, deflate',
     Host: 'storage.googleapis.com',
     'Cache-Control': 'no-cache',
     Accept: '*/*',
     'User-Agent': 'PostmanRuntime/7.11.0' } };

http.createServer(function(request,response){    //#B
  var x;
  var headers = request.headers;
  var trailers = request.trailers;

  var decodeUrl = decodeURIComponent(request.url);
  console.log(decodeUrl);

  var split = decodeUrl.split("http");
  var yelpURL = "http" + split[1];

  console.log('New incoming client request for ');
  
  console.log('Request method: ' + request.method);
  console.log('Headers: ');
  for (x in headers) {
    console.log('\t{' + x + ': \"' + headers[x] + '\"}');
  }
  console.log('Trailers: ');
  for (x in trailers) {
    console.log('\t{' + x + ': \"' + trailers[x] + '\"}');
  }

  console.log('here');

  request2(options, function (error, res, body) {
    if (error) throw new Error(error);
  
    //console.log(body);
    console.log('here2');

    //console.log(body);

    var jsonRet = JSON.parse(body);
    console.log(jsonRet);

    //var jsonRet = JSON.parse(body);
    response.writeHead(200,    //#C
        {'Content-Type': 'application/json',    //#D
        'Access-Control-Allow-Origin': '*'});    //#E
    //response.write(JSON.stringify(body));
    response.end(body);

    // response.writeHead(200,    //#C
    //       {'Content-Type': 'application/json',    //#D
    //       'Access-Control-Allow-Origin': '*'});    //#E
    // response.write(body);    //#F
    // response.end(); 

    console.log('here3');
    
  });

}).listen(port);    //#H
console.log('Server listening on http://localhost:' + port);
