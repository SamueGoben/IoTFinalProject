//This file will handle displaying current data from subscribing to other teams thingspeak/sensors
//It will also handle actuation by publishing to other teams thingspeak

//populate form list of possible data entries
function populateForm(Buckets, Objects){

  let bucketForm = document.getElementById("info");
  
  Buckets.ListOfBuckets.forEach(element => {
      
      let first = (element.split("-"))[1]; 
      let sec = (element.split("-"))[3];
      let name = first +"-"+ sec;
     
      let opt = document.createElement('option');
      opt.appendChild(document.createTextNode(name));
      opt.value = name;

      bucketForm.appendChild(opt);

  });

  //This will be needed when there are multiple datasets for each bucket

  // Objects.ListOfObjects.forEach(element => {
      
  //     let name = (element.split("."))[0]; 
     
  //     let opt = document.createElement('option');
  //     opt.appendChild(document.createTextNode(name));
  //     opt.value = name;

  //     objectForm.appendChild(opt);

  // });

}

//this will be used to populate form list
function chooseData(){

  console.log("start making form");

  var echoUrl = 'http://localhost:9999/testing_echo_server'; //this server is the one between web app and google cloud storage

  $(document).ready( 
  $.ajax({    
      traditional: true,
      type: "GET",
      dataType: "json",
      data: "populateForm", //use this to determine what data you want; populate will tell server to send list of buckets
      url: echoUrl,
      success: function(data1) {   

          console.log("success");

          let splitData = data1.split("/n")
          
          bucketList = JSON.parse(splitData[0]);
          objectList = JSON.parse(splitData[1]);

          //console.log(bucketList.ListOfBuckets[0]);

          populateForm(bucketList, objectList);

      }, 
      error: function(err){
          console.log("there was an error");
          console.log(err);
      }
  })
  );
}

var options;
var data;
var socket;
var result;
var track = 0;
var begin = 'temperature';

let retData;
let oldData = "no Data yet";
let statement1 = "no Data";
let statement2 = "no Data yet";
let breakVal = 1;
let breakFunc = 0;
let firstClick = 0;

document.getElementById("button").onclick = function ()
 {
   breakFunc = 1;
   console.log("on click: " + breakFunc);

   if (firstClick == 0){
    selectFunction(firstClick, breakFunc);
    firstClick = firstClick + 1;
   }

   else{

    setTimeout( function(){
      console.log("in func on click");
      breakFunc = 0;
      console.log(breakFunc);
      selectFunction(firstClick);
      firstClick = firstClick + 1;
      
  
     }, 20000);

   }

};

function getCurrentData(dataToGet, _callback){

  console.log("In get current Data");
  var echoUrl = 'http://localhost:8888/testing_echo_server';

  $.ajax({    
    traditional: true,
    type: "GET",
    dataType: "json",
    data: dataToGet,
    url: echoUrl,
    success: function(data1) {
        console.log("success");   
        console.log(data1);
        retData = data1;
        if (retData != 'no Data'){
          oldData = retData;
        }
        breakVal = 0;

        _callback();


    }, 
    error: function(err){
      breakVal = 1;
      retData = 0;
      _callback();
      //console.log(err);
    }
  });

}

let maxDataPoints;
let chart;

//get current time
function getTime() {
  var d = new Date();
  return d.toLocaleTimeString();
}
//add data point to graph
function addDataPoint(dataPoint, _callback) {

  console.log("in add Data Point");

  if (data.getNumberOfRows() > maxDataPoints) {
    data.removeRow(0);
  }
  data.addRow([getTime(), parseInt(dataPoint)]);

  chart.draw(data, options);
  _callback();
  
}


function beginLoop(dataToGet, _callback){

  console.log("in begin loop");

  getCurrentData(dataToGet, function(){

    console.log("in Get current data callback: " + retData + " " + oldData);
    console.log(oldData === statement2);

    if (retData == 'no Data'){
      console.log("ret Data is no Data");
      if (oldData == statement2){
        document.getElementById("no-data").innerHTML = "No Current Data to Display Yet";
        _callback();
      }
      else{
          document.getElementById("no-data").innerHTML = " ";
          addDataPoint(oldData, function(){
            console.log("in add atat point callback");
          _callback();
        });
      }
    }
    else{

      if (breakVal == 0){
        document.getElementById("no-data").innerHTML = " ";
        addDataPoint(retData, function(){
          console.log("in add atat point callback");
          _callback();
        });
  
      }
  
      else{
        document.getElementById("no-data").innerHTML = "No Current Data to Display Yet";
        _callback();
      }

    }



  });

}

function selectFunction(firstClick, breakFunc) {
  if (track > 0) {
    track = 0;
    
  }
  track++;
  console.log("first click?: " + firstClick);

  if (firstClick == 0){

    breakFunc = 0;

  }

  maxDataPoints = 10;
  chart = new google.visualization.LineChart($('.chart')[0]);

  data = google.visualization.arrayToDataTable([
    [{label: 'Time', type: 'string'},
    {label: document.getElementById("info").value, type: 'number'}]
  ]);

  let dataToGet = document.getElementById("info").value;

  let nameToDisp = (dataToGet.split("-"))[1];

  options = {
    hAxis: {
      title: 'Time'
    },
    vAxis: {
      title: nameToDisp
    },
    title: document.getElementById("info").value,
    curveType: 'line',
    pointSize: 15,
    animation: {
      duration: 1000,
      easing: 'in'
    },
    legend: {position: 'bottom'}
  };

  document.getElementById("demo").innerHTML = nameToDisp;
  document.getElementById("demo").style.color = "red";

  //$(document).ready(function () {
    console.log("in select Function");
    myLoop();
    //this function is used periodically check if any new messages have be recieved from
    // the server
    function myLoop(){

      console.log("brakFunc:" + breakFunc);

      if (breakFunc == 1){
        console.log("broke");
        return;
        //break;
      }

      console.log("in my loop");
      
      beginLoop(dataToGet, function(){ //added to handle asyncronus call to mqtt data

        console.log("in begin loop callback");
        
        //if(breakVal == 0){
          //console.log("did not break");

          setTimeout(function(){
            if (breakFunc == 1){
              console.log("broke");
              return;
            }

            myLoop();

          }, 15000); //trying not to subscribe to often;
        //}


      });
    };
  //});
}

$(window).on('load', chooseData);