var express = require('express');
var app = express();

var Twit= require('ntwitter');
var twit = new Twit({
	consumer_key: '6kHU6nFRR7OmeslN3bjgQ',
	consumer_secret: 'SRiFuy23hG52P9MdmU4IYXY8tUl8Pha14211Eyzg',
	access_token_key: '1947401-SB3BZaiR1EwR49Wi6iOlyJuUA4dGy9K1Hso6mbY',
	access_token_secret: 'juuk5UAaikZHrV1wUC4rPzB6NlnEno4FUF0z3GbPM'
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

app.listen(process.env.PORT || 4730);

	