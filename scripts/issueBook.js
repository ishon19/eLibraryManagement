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
})

$("#issueBook").click(function(){
   //check the book id and update the db 
   var bookName = $("#bookName").val();
   var studentName = $("#studentName").val();
   var issueDate = $("#issueDate").val();
   var returnDate = $("#returnDate").val();

   if(!checkValue(bookName) || !checkValue(studentName) || !checkValue(issueDate) ||!checkValue(returnDate)){
       bootbox.alert("Please fill all the fields before issuing the book.");
       return;
   }

   //check if the database exists
   fs.readFile(file, function(err, data){
    if(!err){
        var localData = JSON.parse(data);
        var issueArr = localData.issueInfo===undefined||localData.issueInfo===null?[]:localData.issueInfo;
        var issueObj = {};

        //Set the object
        issueObj["bookName"] = bookName;
        issueObj["studentName"] = studentName;
        issueObj["issueDate"] = issueDate;
        issueObj["returnDate"] = returnDate;

        //set in the array
        issueArr.push(issueObj);
        localData["issueInfo"] = issueArr;

        //Update the count of the book in the bookInfo key
        localData.bookInfo.map(function(item,index){
          if(item.bookName===bookName){
          //check if the book is available
          if(item.numBooks<=0){
            bootbox.alert("Sorry, no copy of "+item.bookName+" is available.");
            return;
           }
          item.numBooks = (parseInt(item.numBooks)-1)<0?0:parseInt(item.numBooks)-1;
          }
        });

        var finalData = JSON.stringify(localData);
        //Write the data
        fs.writeFile(file, finalData, function(err){
            if(err){
              console.log("err has occured");
            }
            bootbox.alert("Book issued successfully.",function(){
                document.location.replace('./adminPage.html');  
            });
            return;
          });
    }else{
        console.log("No database file exists");
    }
})
});