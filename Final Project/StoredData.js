


let jsonObj;
function tempfunc(){
    $('#sumbitButton').submit(getdata); 
}

(function($){ function addToDom(e){

    let holder1 = jsonObj.data1;
    let holder2 = jsonObj.data2;
    let holder3 = jsonObj.data3;
    let holder4 = jsonObj.data4;
    let holder5 = jsonObj.data5;
    let holder6 = jsonObj.data6;

    let data1 = document.createElement("P");
    let data1txt = document.createTextNode("Sensor Name: " + holder1.Name + ", Temperature: " + holder1.Temperature +
        ", Timestamp: " + holder1.TimeStamp + ", Date: " + holder1.Date);
    data1.appendChild(data1txt);
    document.body.appendChild(data1);

    let data2 = document.createElement("P");
    let data2txt = document.createTextNode("Sensor Name: " + holder2.Name + ", Temperature: " + holder2.Temperature +
        ", Timestamp: " + holder2.TimeStamp + ", Date: " + holder2.Date);
    data2.appendChild(data2txt);
    document.body.appendChild(data2);

    let data3 = document.createElement("P");
    let data3txt = document.createTextNode("Sensor Name: " + holder3.Name + ", Temperature: " + holder3.Temperature +
        ", Timestamp: " + holder3.TimeStamp + ", Date: " + holder3.Date);
    data3.appendChild(data3txt);
    document.body.appendChild(data3);

    let data4 = document.createElement("P");
    let data4txt = document.createTextNode("Sensor Name: " + holder4.Name + ", Temperature: " + holder4.Temperature +
        ", Timestamp: " + holder4.TimeStamp + ", Date: " + holder4.Date);
    data4.appendChild(data4txt);
    document.body.appendChild(data4);

    let data5 = document.createElement("P");
    let data5txt = document.createTextNode("Sensor Name: " + holder5.Name + ", Temperature: " + holder5.Temperature +
        ", Timestamp: " + holder5.TimeStamp + ", Date: " + holder5.Date);
    data5.appendChild(data5txt);
    document.body.appendChild(data5);

    let data6 = document.createElement("P");
    let data6txt = document.createTextNode("Sensor Name: " + holder6.Name + ", Temperature: " + holder6.Temperature +
        ", Timestamp: " + holder6.TimeStamp + ", Date: " + holder6.Date);
    data6.appendChild(data6txt);
    document.body.appendChild(data6);

    e.preventDefault(); 
}
$('#sumbitButton').submit(addToDom); 
})(jQuery); 

function getdata(){
    var echoUrl = 'http://localhost:9999/testing_echo_server';

    $(document).ready( //#A
    $.ajax({    //#B
        traditional: true,
        type: "GET",
        dataType: "json",
        data: "this", //use this to determine what data you want
        url: echoUrl,
        success: function(data1) {   

            console.log(data1);

            jsonObj = data1;

        }, 
        error: function(err){
            console.log(err);
        }
    })
    );

}

$(window).on('load', getdata);
    

