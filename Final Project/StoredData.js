
//
let jsonObj;
let bucketInfo;
let dataInfo;

let listInfo;

function chooseData(){

    console.log("start making form");

    var echoUrl = 'http://localhost:9999/testing_echo_server';

    $(document).ready( //#A
    $.ajax({    //#B
        traditional: true,
        type: "GET",
        dataType: "json",
        data: "populate", //use this to determine what data you want; populate will tell server to send list of buckets
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

    //javascript to make form. 


}

(function($){ function addToDom(e){

    console.log("sdf");


    e.preventDefault(); 
}
$('#sumbitButton').submit(addToDom); 
})(jQuery); 

// function getdata(){
//     var echoUrl = 'http://localhost:9999/testing_echo_server';
//     console.log("here1");
//     $(document).ready( //#A
//     $.ajax({    //#B
//         traditional: true,
//         type: "GET",
//         dataType: "json",
//         data: "this", //use this to determine what data you want
//         url: echoUrl,
//         success: function(data1) {   

//             console.log(data1);

//             jsonObj = data1;

//         }, 
//         error: function(err){
//             console.log(err);
//         }
//     })
//     );

// }

$(window).on('load', chooseData);
    

