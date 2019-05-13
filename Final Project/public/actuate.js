var type;
var button;
var num;
var fillIn;

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
    else if (type == "Fan and Vent") {
        num = -3;
        fillIn = " ";
    }
    
    document.getElementById("entry").innerHTML = button + ' ' + type + fillIn;
    document.getElementById("entry").style.color = "red";
}

function AutoFunction() {
    type = document.getElementById("actuate").value;
    button = document.getElementById("button-select-auto").innerHTML;

    num = 0;
    fillIn = "Everything Automatic";
    
    document.getElementById("entry").innerHTML = fillIn;
    document.getElementById("entry").style.color = "red";
}

function PumpFunction() {
    type = document.getElementById("actuate2").value;
    
    document.getElementById("entry2").innerHTML = type;
    document.getElementById("entry2").style.color = "red";
}