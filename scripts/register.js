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

$('#register').click(function(){
  var userName = $('#username').val();
  var password = $('#password').val();

  if(!checkValue(userName) || !checkValue(password)){
    bootbox.alert('Please fill both of the fields.');
    return;
  }

  fs.readFile(file,(err,data)=>{
    if(!err){
     var mainObj = JSON.parse(data);
     adminObj = {};
     adminObj['username'] = userName;
     adminObj['password'] = password;

     if(!checkObj(mainObj.adminDetails)){
      mainObj['adminDetails'] = [];
      mainObj.adminDetails.push(adminObj); 
     }else{
      mainObj.adminDetails.push(adminObj); 
     }
     var finalData = JSON.stringify(mainObj);
     fs.writeFile(file,finalData,function(err){
       if(!err){
         bootbox.alert("Admin registered successfully!",()=>{
           location.replace('./login.html');
         });
       }
     })
    }else{
      var mainObj = {};
      adminObj = {};
      adminObj['username'] = userName;
      adminObj['password'] = password;
      mainObj['adminDetails'] = [];
      mainObj.adminDetails.push(adminObj);
    
      var finalData = JSON.stringify(mainObj);
      fs.writeFile(file,finalData,function(err){
        if(!err){
          bootbox.alert("Admin registered successfully!",()=>{
            location.replace('./login.html');
          });
        }
      })
    }
  })
});