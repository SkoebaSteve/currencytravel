var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(express.static('./public'));

// all other request point to index

app.get('*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT || 3000);