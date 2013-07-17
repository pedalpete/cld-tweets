var express = require('express');
var app = express();

var Twit= require('ntwitter');
var twit = new Twit({ //these shouldn't be in here, but I had to put it up to github
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
	var url = 'http://en.wikipedia.org/wiki/'+req.params.query;
	ext_request(url, function(err,resp,body){
		 res.type('json');
		if(err){
			return res.jsonp({error: "dang! There was a probem getting the wikipedia page. Is it possible wikipedia doesn't know what "+req.params.query+" is?"});
		} else {
			$=cheerio.load(body);
			var first_p = $('p').slice(0).eq(0).text();
			return res.jsonp({first_paragraph: first_p,url: url});
		}
	});
	
});

app.get('/bing-images/:query', function(req,res){

	ext_request('http://www.bing.com/images/search?q='+req.params.query, function(err,resp,body){
		res.type('json');
		if(err){
			return res.jsonp({error:"hhhmmm something went wrong her, maybe no pictures"});
		} else {
			$=cheerio.load(body);
			var images = [];
			var index =0;
			var last_image ='';
			 $('img').each(function(index){
	
				 while(index<16){
					var this_image = $(this).attr('src');
			 		if(this_image.slice(0,4)=='http' && last_image!=this_image){
			 			console.log(index);
			 			images.push({img: this_image});
			 			last_image = this_image;
			 		}
			 		index++;
			 	}
			 	return;
			 });

			console.log(images);
			return res.jsonp(images)
		}
	});
});

app.get('/:username', function(req,res){ //catch-all for if a username gets entered into the url field, or a non-previous match, we still try to show something
	res.sendfile('index.html');
});

app.listen(process.env.PORT || 4730);

	