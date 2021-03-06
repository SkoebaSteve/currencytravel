var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use(express.static('./data'));

// all other request point to index

app.get('/api/common-currency', function(req, res){
  res.sendFile(__dirname + '/data/countries-currencies.json');
})

app.get('/api/current-rate', function(req, res){
  res.sendFile(__dirname + '/data/latestCurrencies.json');
})

app.get('*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');

});

app.listen(process.env.PORT || 3000);