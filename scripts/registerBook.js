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

function checkObj(value){
  if(value===undefined || value===null) return false;
  return true;
}

//Events
var saveButton = $('#saveButton');
saveButton.click(function(){
   console.log("save Button clicked");

   //saving the data 
   fs.readFile(file, function(err, data){
    if(err){
      console.log("No file exists, creating a new one.");

      //Parent Object
      var toStore = {
          "bookInfo" : []
      };

      var bookObj = {};
     
      //data to be stored
      var bookID = $.now();
      var bookName = $("#bookName").val();
      var authorName = $("#authorName").val();
      var numBooks = $("#numBooks").val();
      var edition = $("#edition").val();

      if(!checkValue(edition) || !checkValue(bookName) || !checkValue(authorName) || !checkValue(numBooks)){
        bootbox.alert("Please enter all the fields before saving.");
        return;
      }

      bookObj["bookID"] = bookID;
      bookObj["bookName"] = bookName;
      bookObj["authorName"] = authorName;
      bookObj["numBooks"] = parseInt(numBooks);
      bookObj["edition"] = edition;


      //set the data
      toStore.bookInfo.push(bookObj);

      //Finally store the data
      var finalData = JSON.stringify(toStore);
      fs.writeFile(file, finalData, function(err){
        if(err){
          console.log("err has occured");
        } else{
          bootbox.alert("Data Saved Successfully!",function(){
            location.replace("./adminPage.html");
          });
        }
        return;
      })

    } else {
       //the database file has some content - update the data    
       toStore = JSON.parse(data);

       //Get and set the values
       var bookObj = {};
     
      //data to be stored
      var bookID = $.now();
      var bookName = $("#bookName").val();
      var authorName = $("#authorName").val();
      var numBooks = $("#numBooks").val();
      var edition = $("#edition").val();

      if(!checkValue(edition) || !checkValue(bookName) || !checkValue(authorName) || !checkValue(numBooks)){
        bootbox.alert("Please enter all the fields before saving.");
        return;
      }

      bookObj["bookID"] = bookID;
      bookObj["bookName"] = bookName;
      bookObj["authorName"] = authorName;
      bookObj["numBooks"] = numBooks;
      bookObj["edition"] = edition;


      //set the data
      toStore.bookInfo.push(bookObj);

      //Finally store the data
      var finalData = JSON.stringify(toStore);
      fs.writeFile(file, finalData, function(err){
        if(err){
          console.log("err has occured");
        } else{
          bootbox.alert("Data Saved Successfully!",function(){
            location.replace("./adminPage.html");
          });
        }
        return;
      })
    }
    
  })
});
