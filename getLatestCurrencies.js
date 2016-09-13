var express = require('express');
var request = require('request');
var jsonfile = require('jsonfile');
var currencies = require('./data/currencies.json');
var config = require('./config');

/*
  Create a config.js file and add your key like this:
  module.exports = {
    currencyKey : "YOUR-KEY"
  };
*/

var oneYearAgo = function(){
  var lastYear = new Date();
  var dd = lastYear.getDate();
  var mm = lastYear.getMonth()+1; //January is 0!
  var yyyy = lastYear.getFullYear()-1;

  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 

  lastYear = yyyy+'-'+mm+'-'+dd;
  return(lastYear);
}

var app = express();
app.use(express.static('./data'));

// all other request point to index
var currencyWithValues = [];
var file = './data/latestCurrencies.json';

request.get({ url: "http://www.apilayer.net/api/live?access_key="+config.currencyKey+"&format=1"}, function(error, response, body) { 
  if (!error && response.statusCode == 200) { 
    parsedBody = JSON.parse(body);

    for(var c in currencies){

      var currencyObject = {
        code:currencies[c].cc,
        name:currencies[c].name,
        currentRate:0,
        historicalRate:0,
        difference:0
      }

      for(var b in parsedBody.quotes){
        if(currencyObject.code === b.substring(3)){
          currencyObject.currentRate = parsedBody.quotes[b];
        }
      }
      currencyWithValues.push(currencyObject);
    }

    request.get({ url: "http://apilayer.net/api/historical?access_key="+config.currencyKey+"&date="+ oneYearAgo() +"&format=1"}, function(error, response, body) { 
      console.log("http://apilayer.net/api/historical?access_key="+config.currencyKey+"="+ oneYearAgo());
      if (!error && response.statusCode == 200) { 
        parsedBody = JSON.parse(body);

        for(var c in currencyWithValues){

          for(var b in parsedBody.quotes){
            if(currencyWithValues[c].code === b.substring(3)){
              currencyWithValues[c].historicalRate = parsedBody.quotes[b];
              currencyWithValues[c].difference = (currencyWithValues[c].currentRate / currencyWithValues[c].historicalRate - 1) * 100;
            }
          }
          
        }

        jsonfile.writeFile(file, currencyWithValues, function (err) {
          console.error(err);
        })
      } 
    }); 
  } 
}); 

app.listen(process.env.PORT || 3001);