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

function checkObj(value){
  if(value===undefined || value===null) return false;
  return true;
}

$('#changeButton').click(function(){
  var oldPassword = $('#oldPass').val();
  var newPassword = $('#newPass').val();

  if(!checkValue(oldPassword) || !checkValue(newPassword)){
    bootbox.alert('Please fill both of the fields.');
    return;
  }

  fs.readFile(file,(err,data)=>{
    if(!err){
     var mainObj = JSON.parse(data);
     var flag = false;
     if(checkObj(mainObj.adminDetails)){
      mainObj.adminDetails.map((item,idx)=>{
        if(item.username===localStorage.getItem('loggedInUser') && item.password===oldPassword){
            item.password = newPassword;
            flag=true;
        } 
      });

      if(flag){
          bootbox.alert('Password Changed Successfully!', function(){
            location.replace('./login.html');
          });
      }else{
          bootbox.alert("No user found. Please check if the old password is correct.");
          return;
      }
     }else{
      bootbox.alert("Please register an admin first");
      return;
     }
     var finalData = JSON.stringify(mainObj);
     fs.writeFile(file,finalData,function(err){
       if(!err){
       }
     })
    }
  })
});