//This file will handle making calls to get stored data
// and display data
//
let bucketList;
let objectList;

let dataBucket;
let dataObject;

let dataNum;

function populateForm(Buckets, Objects){

    let bucketForm = document.getElementById("buckets");
    let objectForm = document.getElementById("objects");

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

function chooseData(){

    console.log("start making form");

    var echoUrl = 'http://localhost:9999/testing_echo_server';

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

function populatePageData(dataRecv){

    console.log("in page data");

    let i = 0;
    
    for(i = 0; i <= dataRecv.size; i++){

        let currPre = document.createElement('pre');
        
        let accessName = "data" + i;

        if (dataRecv[accessName] == undefined){
            let text = accessName + ":";
            let text2 = "N/A";
            let dataTextNode = document.createTextNode(text);
            let textNode = document.createTextNode(text2);

            currPre.appendChild(dataTextNode);
            currPre.appendChild(textNode);
    
            document.getElementById("displayData").appendChild(currPre);
        }

        else{

            let text = accessName + ":";
            let dataTextNode = document.createTextNode(text);
            let textnode = document.createTextNode(JSON.stringify(dataRecv[accessName], undefined, 2));
            currPre.appendChild(dataTextNode);
            currPre.appendChild(textnode);
    
            document.getElementById("displayData").appendChild(currPre);

        }
      
    }

}

function getData(_callback){

    console.log("in get data");
    
    console.log(dataBucket);
    console.log(dataObject);

    var echoUrl = 'http://localhost:9999/testing_echo_server';

    $(document).ready( 
        $.ajax({    
            traditional: true,
            type: "GET",
            dataType: "json",
            data: "populateData?" + dataBucket + "?" + dataObject, //use this to determine what data you want; populate will tell server to send list of buckets
            url: echoUrl,
            success: function(data1) {   
    
                console.log("success");
                console.log(data1);

                populatePageData(data1);
                        
            }, 
            error: function(err){
                console.log("there was an error");
                console.log(err);
            }
        })
    );

}

//find bucket based off of value from form
function findBucket(formVal){

    let splitData = formVal.split('-');
    let currNum = 0;

    bucketList.ListOfBuckets.forEach(element => {
        
        if (element.includes(splitData[0]) && element.includes("-"+splitData[1])){
            dataBucket = element; 
            dataNum = currNum;
            
        }
        currNum = currNum + 1;

    });

    console.log("out of bucketFind");

}
//find object based off value from form
function findObject(formVal, _callback){

    //console.log(formVal);
    objectList.ListOfObjects.forEach(element => {
        
        if (element.includes(formVal)){
            dataObject = element;
            
            //hardcoded some examples
            //work needs to be done on returned list of objects, to make sure the are in the correct order;
            if (formVal == "humidity" && dataBucket.includes("iot")){
                //console.log("inif");
                dataObject = "humidity-dataset.json";
                
                
            }

            else if (formVal == "humidity"){
                dataObject = "humidity-percent-dataset.json";
                
                
            }             
            
        }
    });
    _callback();
}

(function($){ function addToDom(e){

    let dataStart = document.getElementById("displayData");
    while(dataStart.firstChild){
        dataStart.removeChild(dataStart.firstChild);
    }

    let form = document.getElementById("buckets");

    let formVal = form.value;

    findBucket(formVal);

    findObject((formVal.split("-"))[1], function(){

        getData(function(){

            console.log("getData callback");
    
        }); 

    });


    e.preventDefault(); 
}
$('#sumbitButton').submit(addToDom); 
})(jQuery); 


$(window).on('load', chooseData);
    

