var app = {
	Models:{},
	Views:{},
	Routers:{},
	Collections:{},
	Init: function(){

	var router = new app.Routers.routes;
        Backbone.history.start();
		
	}
}

app.Routers.routes = Backbone.Router.extend({
	routes: {
		"":				"index"
	},

	index: function(){
		new app.Views.GetTweets();
	}
});

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
		"keyup input" : "emptyError"
	},
	render: function(){
		$(this.el).html('<input type="text" name="twitter_handle"/><input id="tweets_button" type="submit" value="Get Tweets"/><div id="errors"></div>');
	},
	getNewTweets: function(){
		var getInput = $("input[type=text]",this.el).val();
		if(getInput.length==0){
			$('div#errors',this.el).text('Type a twitter username into the text box!');
		} else {
			var tweets = new app.Collections.Tweets({data:{query:getInput}});
			tweets.fetch({
					error: function(){
						$('div#errors',this.el).text('oops, something went wrong');
					},
					success: function(model,response){

				if(response.error!=undefined){
					$('div#errors',this.el).text(response.error);
						} else {
						console.log(tweets);
					new app.Views.Tweets({collection:tweets});
					}
				}
			});
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

		var selectedText = document.getSelection();
		selectedText = encodeURI(selectedText.toString().replace(' ','_'));
		$('div#popup').css({top: e.pageY, left: e.pageX}).html('<div id="wiki"></div><div id="images"></div>').addClass('hidden');
		if(selectedText!=''){
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

		}
		
	}

});

app.Views.Wikipedia = Backbone.View.extend({
	el: 'div#wiki',
	initialize: function(){
		this.render();

	},
	render: function(){
		if(this.model.attributes.first_paragraph.length<100){
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
		$('div#images').append('<img src="'+img.attributes.img+'"/>');
	}
});


