var app = {
	Models:{},
	Views:{},
	Routers:{},
	Collections:{},
	Helpers: {},
	Init: function(){

	router = new app.Routers.routes;
        Backbone.history.start();
		
	}
}

app.Routers.routes = Backbone.Router.extend({
	routes: {
		"":				"index",
		":username": 	"getTweets"  //this ends up being a catch-all for all twitter handles
	},

	index: function(){
		new app.Views.GetTweets();
	},
	getTweets: function(username){
		new app.Views.GetTweets();
		app.Helpers.getTweets(username);
	}
});

app.Helpers = {
	getTweets : function(username){
		$('div#tweets').html('<h1>Loading...</h1>');
		if($("input[name=twitter_handle]").val()=='' && username !=''){
			$("input[name=twitter_handle]").val(username)
		}
		var tweets = new app.Collections.Tweets({data:{query: username}});
		tweets.fetch({
			error: function(){
				$('div#errors').text('oops, something went wrong');
				},
				success: function(model,response){

			if(response.error!=undefined){
				$('div#errors').text(response.error);
				$('div#tweets').empty();
					} else {
				new app.Views.Tweets({collection:tweets});
				}
			}
		});
	}

}
app.Collections.Tweets = Backbone.Collection.extend({
	url: function(){
		return '/tweets/'+this.username;
	},
	initialize: function(options){
		options || (options={});
		this.username=options.data.query;
	}
});

app.Models.Wikipedia = Backbone.Model.extend({
	url: function(){
		return '/wikipedia/'+this.query;
	},
	initialize: function(options){
		options || (options={});
		this.query=options.data.query;
	}
});

app.Collections.Images = Backbone.Collection.extend({
	url: function(){
		return '/bing-images/'+this.query;
	},
	initialize: function(options){
		options || (options={});
		this.query = options.data.query;
	}
});




app.Views.GetTweets = Backbone.View.extend({
	el: 'form#getTweets',
	initialize: function(){
		this.render();
	},
	events: {
		"submit": "getNewTweets",
		"keyup input" : "emptyError" //this empties the error when the users starts typing
	},
	render: function(){
		$(this.el).html('<input type="text" name="twitter_handle" placeholder="enter twitter username"/><input id="tweets_button" type="submit" value="Get Tweets"/><div id="errors"></div>');
	},
	getNewTweets: function(){
		var getInput = $("input[type=text]",this.el).val();
		if(getInput.length==0){
			$('div#errors',this.el).text('Type a twitter username into the text box!');
		} else {
			router.navigate(getInput);
			app.Helpers.getTweets(getInput);
		}
		return false;
	},
	emptyError: function(){
		$('div#errors',this.el).text('');
	}
});

app.Views.Tweets = Backbone.View.extend({
	el: 'div#tweets',
	initialize: function(){
		$(this.el).empty();
		this.collection.each(this.add);
	},
	events: {
		"mouseup":"getSelectedText"
	},
	add: function(tweet){
		$('div#tweets').append('<div class="tweet">'+tweet.attributes.text+'</div>');
	},
	getSelectedText: function(e){

		var selectedText = document.getSelection().toString();

		if(selectedText.replace(' ','')==''){ //if selected string is empty, just hide the popup if it's open
			$('div#popup').addClass('hidden');
			return;
		}
		selectedText = encodeURI(selectedText.replace(' ','_')); //seems wikipedia uses underscores rather than + for official articles try to get _'s
	
		if(selectedText.match("^[a-zA-Z0-9]*$")!=null){ //check that the selected text has some valid characters. 
			$('div#popup').css({top: e.pageY, left: e.pageX}).html('<div id="wiki"><h1>Loading...</h1></div><div id="images"></div>').removeClass('hidden');
	
			var wiki_p = new app.Models.Wikipedia({data: {query:selectedText}});
			wiki_p.fetch({
				error: function(){
					$('div#wiki').html('It looks like there was a problem getting results from wikipedia');
				},
				success: function(response){
					new app.Views.Wikipedia({
						model: response
					});
				}

			});

		 var bings = new app.Collections.Images({data: {query: selectedText}});
		 bings.fetch({
		 	error: function(){
		 		$('div#images').html('It looks like there was a problem getting image results');
		 	},
		 	success: function(response){
		 		new app.Views.Images({collection:response});
		 	}
		 });

		} else {
			$('div#popup').addClass('hidden');
		}
		
	}

});

app.Views.Wikipedia = Backbone.View.extend({
	el: 'div#wiki',
	initialize: function(){
		this.render();

	},
	render: function(){
		if(this.model.attributes.first_paragraph.length<100){ // short entry was likely that wikipedia didn't find one great  match
			this.model.attributes.first_paragraph = 'There is no single Wikipedia entry which best matches your selection.';
		}
		$(this.el).html('<span>'+this.model.attributes.first_paragraph+'</span> <a href="'+this.model.attributes.url+'" target="new">See more on Wikipedia</a>');
		$('div#popup').removeClass('hidden');
	}
});

app.Views.Images = Backbone.View.extend({
	el: 'div#images',
	initialize: function(){
		console.log(this);
		this.collection.each(this.add);
	},
	add: function(img){
		console.log(img.attributes);
		$('div#images').append('<div class="img" style="background-image: url('+img.attributes.img+')"/></div>');
	}
});


