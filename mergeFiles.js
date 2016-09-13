var express = require('express');
var request = require('request');
var jsonfile = require('jsonfile');

var currencies = require('./data/currencies.json');
var countries = require('./data/countries.json');

var app = express();
app.use(express.static('./data'));

var combined = [];

var file = './data/output.json';

for (cr in currencies){

  for (co in countries){
    if(countries[co]['alpha-2'] === currencies[cr]["countrycode"]){
      currencies[cr].countryName = countries[co].name;
    }
  }
}

jsonfile.writeFile(file, currencies, function (err) {
  console.error(err);
})


app.listen(process.env.PORT || 3001);