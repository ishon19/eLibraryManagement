console.log("Inside the bookdetails page");
const fs = require("fs");
const path = require("path");
var $ = require("jquery");
var bootstrap = require('bootstrap');
var bootbox = require("bootbox");
const DatabaseName = "DB";
let pathName = path.join(__dirname, 'data');
let file = path.join(pathName, DatabaseName);

//utility function
function checkValue(value){
    if(value===undefined || value===null || value.trim()==="") return false;
    return true;
  }

//Render the data on load
fs.readFile(file, function(err, data){
    if(!err){
        var localData = JSON.parse(data);
        var bookArr = localData.bookInfo;

        //Store the data on the local storage for use on the card click
        localStorage.setItem("localData",JSON.stringify(localData));

        //Iterate over book array
        bookArr.map(function(item,index){
          var bookObj = item;

          //extract the data
          var bookID = bookObj["bookID"];
          var bookName = bookObj["bookName"];
          var authorName = bookObj["authorName"];
          var numBooks = bookObj["numBooks"];
          var edition = bookObj["edition"];

          //Create the element
          var statusFlag = parseInt(numBooks)>0?'project-success':'project-danger';
          var Available = parseInt(numBooks)>0?'Available':'Not Available';
          var bookDataMarkup = '<div class="col-xs-3 bookCard" bookName="'+bookName+'"> <div class="project project-radius '+statusFlag+'"> <div class="shape"> <div class="shape-text">'+Available+' </div> </div> <div class="project-content"> <h1 class="project-header"> '+bookName+' </h1> <p> <span><h3> Author: '+authorName+'</h3></span> <br> <span><h3> Edition: '+edition+'</h3></span> <br> <span><h3>Books Left: '+numBooks+'</h3></span> </p> </div> </div> </div>';
          $('.row').append(bookDataMarkup);

            //Onclick of the cards
            $(".bookCard").off().on().click(function(){
                var bookName = $(this).attr('bookName');
                var toDisplay = '';
                if(checkValue(bookName) && checkValue(localStorage.getItem('localData'))){
                //get the feedback details from local db
                var localData = JSON.parse(localStorage.getItem('localData'));
                localData.feedbackInfo.map(function(item,index){
                    if(item.bookName===bookName){
                        //create the markup to be displayed
                        toDisplay += '<blockquote class="blockquote text-right"> <p class="mb-0 display-3">'+item.feedBack+'</p> <footer class="blockquote-footer"><span class="display-3">'+item.studentName+'</span></footer> </blockquote>';
                    }
                });

                toDisplay = toDisplay.trim()===''?'<p class="display-3">No Feedbacks yet for <strong>'+bookName+'</strong></p><br>':toDisplay;

                //Display the markup
                bootbox.dialog({
                    title: '<p class="display-3 text-success"><strong>Feedbacks for '+bookName+'</strong></p>',
                    message: toDisplay,
                    size: 'large',
                    buttons: {
                        ok: {
                            label: "Go Back!!",
                            className: 'btn btn-lg btn-success text-light text-center p-3 m-auto h3',
                            callback: function(){
                                console.log('OK clicked');
                            }
                        }
                    }
                });
                }
            });
        });
    }else{
        console.log("No database file exists");
    }
});

$('#searchBox').keyup(function(){
    var value = $(this).val();
    if(checkValue(value)){
        $('.bookCard').each(function(){
           if($(this).text().toLowerCase().indexOf(value.toLowerCase()) != -1){
               $(this).show();
           }else{
               $(this).hide();
           }
        });
    }else{
        $('.bookCard').show();
    }
});
