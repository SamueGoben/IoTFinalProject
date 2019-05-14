var type;
var button;
var num;
var fillIn;
var pump;

document.getElementById("button-select-open").onclick = function () {OpenFunction();};

document.getElementById("button-select-close").onclick = function () {CloseFunction();};

document.getElementById("button-select-auto").onclick = function () {AutoFunction();};

document.getElementById("button-select-pump").onclick = function () {PumpFunction();};

function OpenFunction() {
    type = document.getElementById("actuate").value;
    button = document.getElementById("button-select-open").innerHTML;

    if (type == "Fan") {
        num = 1;
        fillIn = ", Vent Automatic";
    }
    else if (type == "Vent") {
        num = 2;
        fillIn = ", Fan Automatic";
    }
    else if (type == "Fan and Vent") {
        num = 3;
        fillIn = " ";
    }
    
    document.getElementById("entry").innerHTML = button + ' ' + type + fillIn;
    document.getElementById("entry").style.color = "red";

    getdata();
}

function CloseFunction() {
    type = document.getElementById("actuate").value;
    button = document.getElementById("button-select-close").innerHTML;

    if (type == "Fan") {
        num = -1;
        fillIn = ", Vent Automatic";
    }
    else if (type == "Vent") {
        num = -2;
        fillIn = ", Fan Automatic";
    }
    else if (type == "Fan/Vent") {
        num = -3;
        fillIn = " ";
    }
    
    document.getElementById("entry").innerHTML = button + ' ' + type + fillIn;
    document.getElementById("entry").style.color = "red";

    getdata();
}

function AutoFunction() {
    type = document.getElementById("actuate").value;
    button = document.getElementById("button-select-auto").innerHTML;

    num = 0;
    fillIn = "Everything Automatic";
    
    document.getElementById("entry").innerHTML = fillIn;
    document.getElementById("entry").style.color = "red";

    getdata();
}

function PumpFunction() {
    type = document.getElementById("actuate2").value;
    
    if (type == "Pump On") pump = 1;
    else if (type == "Pump Off") pump = 0;

    document.getElementById("entry2").innerHTML = type;
    document.getElementById("entry2").style.color = "red";

    getdata2();
}

function getdata(){
    var echoUrl = 'http://localhost:8888/testing_echo_server';
    var send = type + button;
    if (button == "Automatic") send = button;

    $(document).ready( //#A
    $.ajax({    //#B
        traditional: true,
        type: "GET",
        dataType: "json",
        data: send,
        url: echoUrl,
        success: function(data1) {
            console.log("hello");   
            console.log(data1.data1);

            console.log("it's me");
            console.log(data1);

            jsonObj = data1;

        }, 
        error: function(err){
          console.log(err);
        }
    })
    );
}

function getdata2(){
    var echoUrl = 'http://localhost:8888/testing_echo_server';
    var send = pump.toString();

    $(document).ready( //#A
    $.ajax({    //#B
        traditional: true,
        type: "GET",
        dataType: "json",
        data: send,
        url: echoUrl,
        success: function(data1) {
            console.log("hello");   
            console.log(data1.data1);

            console.log("it's me");
            console.log(data1);

            jsonObj = data1;

        }, 
        error: function(err){
          console.log(err);
        }
    })
    );
}