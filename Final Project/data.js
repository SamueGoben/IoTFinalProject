var options;
var data;
var socket;
var result;
var track = 0;
var begin = 'temperature';

document.getElementById("button").onclick = function () {selectFunction();};

function selectFunction() {
  if (track > 0) {
    track = 0;
    socket.close();
  }
  track++;
  document.getElementById("demo").innerHTML = document.getElementById("info").value;
  document.getElementById("demo").style.color = "red";

  $(document).ready(function () {
    var maxDataPoints = 10;
    var chart = new google.visualization.LineChart($('.chart')[0]);
    
    options = {
      title: document.getElementById("info").value,
      curveType: 'function',
      animation: {
        duration: 1000,
        easing: 'in'
      },
      legend: {position: 'bottom'}
    };

    data = google.visualization.arrayToDataTable([
      ['Time', document.getElementById("info").value],
      [getTime(), 0]
      ]);


    function addDataPoint(dataPoint) {
      if (data.getNumberOfRows() > maxDataPoints) {
        data.removeRow(0);
      }
      data.addRow([getTime(), dataPoint.value]);

      chart.draw(data, options);
    }

    function getTime() {
      var d = new Date();
      return d.toLocaleTimeString();
    }

  begin = document.getElementById("info").value.toLowerCase();
  socket = new WebSocket('ws://devices.webofthings.io/pi/sensors/' + begin);
  
  socket.onmessage = function (event) { //#B
    result = JSON.parse(event.data);
    addDataPoint(result); //#G
  };
  
  socket.onerror = function (error) { //#C
    console.log('WebSocket error!');
    console.log(error);
  };
});
}