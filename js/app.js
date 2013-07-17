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

app.Collections.Tweets = Backbone.Collection.extend();


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
			$.getJSON('/tweets/'+getInput,function(data){
				if(data.error!=undefined){
					$('div#errors',this.el).text(data.error);
				} else {
					var tweets = new app.Collections.Tweets(data);
					new app.Views.Tweets({collection:tweets});
				}
			})
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
		var top = e.pageX;
		var left = e.pageY;
		var selectedText = document.getSelection();
		if(selectedText==''){

		} else {
			
		}
	}

});

app.Views.Wikipedia = Backbone.View.extend({

});

