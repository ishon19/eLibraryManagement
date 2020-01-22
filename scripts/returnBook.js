const fs = require("fs");
const path = require("path");
var $ = require("jquery");
var bootstrap = require('bootstrap');
var bootbox = require("bootbox");
const DatabaseName = "DB";
let pathName = path.join(__dirname, 'data');
let file = path.join(pathName, DatabaseName);
var timeElapseMsg = '';

//utility function
function checkValue(value){
    if(value===undefined || value===null || value.trim()==="") return false;
    return true;
  }

//Load the saved books list
fs.readFile(file, function(err, data){
    if(!err){
        var localData = JSON.parse(data);
        var bookArr = localData.bookInfo;

        //Iterate over book array
        bookArr.map(function(item,index){
          var bookObj = item;

          //extract the data
          var bookID = bookObj["bookID"];
          var bookName = bookObj["bookName"];
          var authorName = bookObj["authorName"];
          var numBooks = bookObj["numBooks"];
          var edition = bookObj["edition"];
          var element = bookName.trim()===""?'':'<option>'+bookName+'</option>';
          $("#bookName").append(element);
        });
    }else{
        console.log("No database file exists");
    }
});

$("#returnBook").click(function(){
    var bookName = $("#bookName").val();
    var studentName = $("#studentName").val();
    var returnDate = $("#returnDate").val();
    var feedBack  = $("#feedBack").val();

    //simple validation
    if(!checkValue(bookName) || !checkValue(studentName) || !checkValue(returnDate) || !checkValue(feedBack)){
        bootbox.alert("Please fill all the fields before returning the book.");
        return;
    }
    
    //check if the database exists
   fs.readFile(file, function(err, data){
    if(!err){
        var localData = JSON.parse(data);
        var feedbackArr = localData.feedbackInfo===undefined||localData.feedbackInfo===null?[]:localData.feedbackInfo;
        var feedbackObj = {};
        var issueFlag = false;

        //check if book was issued
        localData.issueInfo.map(function(item,index){
         if(item.studentName===studentName && item.bookName===bookName){
            issueFlag = true;
         }
        });

       if(!issueFlag){
           bootbox.alert("No Issue record found, please check the entered information");
           return;
       }

        //Set the object
        feedbackObj["bookName"] = bookName;
        feedbackObj["studentName"] = studentName;
        feedbackObj["returnDate"] = returnDate;
        feedbackObj["feedBack"] = feedBack;

        //set in the array
        feedbackArr.push(feedbackObj);
        localData["feedbackInfo"] = feedbackArr;

        //Update the count of the book in the bookInfo key
        localData.bookInfo.map(function(item,index){
          if(item.bookName===bookName){
          item.numBooks = parseInt(item.numBooks)+1;
          }
        });

        //check if book returned in time
        localData.issueInfo.map(function(item,index){
            if(item.studentName===studentName && item.bookName===bookName){
               var scheduledReturnDate = item.returnDate;
               var dateReturned = new Date(returnDate);
               var dateToBeReturned = new Date(scheduledReturnDate)
               if(dateReturned>dateToBeReturned){
                   var timeElapsed = (dateReturned - dateToBeReturned)/(24*60*60*1000);
                   timeElapseMsg +="Book return is delayed by "+timeElapsed+" days, please collect late return charge.";
               }

              //remove the issue record
              localData.issueInfo.splice(index,1);
            }
           });


        var finalData = JSON.stringify(localData);
        //Write the data
        fs.writeFile(file, finalData, function(err){
            if(err){
              console.log("err has occured");
            }
            bootbox.alert("<p class='display-5 text-dark '>Book returned successfully. "+timeElapseMsg+'</p>',function(){
                document.location.replace('./adminPage.html');
            });
            return;
          });
    }else{
        console.log("No database file exists");
    }
})

});