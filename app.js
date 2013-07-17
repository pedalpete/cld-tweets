var express = require('express');
var app = express();

var Twit= require('ntwitter');
var twit = new Twit({
	consumer_key: '6kHU6nFRR7OmeslN3bjgQ',
	consumer_secret: 'SRiFuy23hG52P9MdmU4IYXY8tUl8Pha14211Eyzg',
	access_token_key: '1947401-SB3BZaiR1EwR49Wi6iOlyJuUA4dGy9K1Hso6mbY',
	access_token_secret: 'juuk5UAaikZHrV1wUC4rPzB6NlnEno4FUF0z3GbPM'
});
var ext_request = require('request');
var cheerio = require('cheerio');

app.get('/', function(req,res){
	res.sendfile('index.html');
});
app.get('/js/:js', function(req,res){
	console.log('looking for js');
	res.sendfile('js/'+req.params.js);
});
app.get('/tweets/:username', function(req,res){

	twit.getUserTimeline({screen_name: req.params.username}, function(err,data){
		 res.type('json');
		if(err){
			return res.jsonp({error:"error getting twitter data"});
		}
		if(!data.length){
			return res.jsonp({error: "user doesn't have any tweets"});
		
		}
		return res.jsonp(data);


		});
});

app.get('/wikipedia/:query', function(req,res){

	ext_request('http://en.wikipedia.org/wiki/'+req.params.query, function(err,resp,body){
		 res.type('json');
		if(err){
			return res.jsonp({error: "dang! There was a probem getting the wikipedia page. Is it possible wikipedia doesn't know what "+req.params.query+" is?"});
		} else {
			$=cheerio.load(body);
			var first_p = $('p').slice(0).eq(0).text();
			return res.jsonp({first_paragraph: first_p});
		}
	});
	
});
app.listen(process.env.PORT || 4730);

	