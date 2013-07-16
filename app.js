var express = require('express');
var app = express();

app.get('/', function(req,res){
	res.type('text/plain');
	res.send('first stuff in node');
});

app.listen(process.env.PORT || 4730);