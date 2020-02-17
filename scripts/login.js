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

  fs.readFile(file, function(err, data){
    if(err){
      location.replace('./register.html');
      return;
    }else if(!checkObj(JSON.parse(data).adminDetails)){
      location.replace('./register.html');
    }
  });

  $('#loginButton').click(function(){
    var userName = $('#username').val();
    var password = $('#password').val();

    if(!checkValue(userName) || !checkValue(password)){
      bootbox.alert('Please fill both of the fields.');
      return;
    }
    
    fs.readFile(file, (err,data)=>{
      if(!err){
        var mainObj = JSON.parse(data);
        mainObj.adminDetails.map((item,idx)=>{
          if(item.username===userName && item.password===password){
            location.replace('./adminPage.html');
          }else{
            bootbox.alert("No Admin found with these credentials, Please try again.");
            return;
          }
        });
      }
    })

  });
