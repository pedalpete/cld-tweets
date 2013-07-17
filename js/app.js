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
})


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
		$('div#popup').css({top: e.pageY, left: e.pageX}).empty().addClass('hidden');
		if(selectedText!=''){
			wiki_p = new app.Models.Wikipedia({data: {query:selectedText}});
			wiki_p.fetch({
				error: function(){

				},
				success: function(response,e){
					new app.Views.Wikipedia({
						model: response
					});
				}

			});
		}
		
	}

});

app.Views.Wikipedia = Backbone.View.extend({
	el: 'div#popup',
	initialize: function(){
		$(this.el).empty();
		this.render();
		console.log(this);
	},
	render: function(){
		$(this.el).text(this.model.attributes.first_paragraph).removeClass('hidden');
	}
});

