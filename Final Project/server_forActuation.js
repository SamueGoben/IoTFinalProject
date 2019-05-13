

// Example of simple server which displays info about incoming requests and sends simple response
var http = require("http");    //#A
var port = 8888;    // can use any port # you prefer (above 1024) - client must use same port #
var request2 = require('request');
// anonymous function - function which handles requests to server
// request - incoming request message
// response - response message to be sent to client



http.createServer(function(request,response){    //#B

  console.log(request.url);

  let requestData = request.url.split("?");
  let determineData = requestData[1];
  console.log(determineData);

  

}).listen(port);    //#H
console.log('Server listening on http://localhost:' + port);
