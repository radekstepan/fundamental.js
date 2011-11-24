App.Views.TodoStatsView = Backbone.View.extend({

	// Instead of generating a new element, bind to the existing skeleton of
	// the App already present in the HTML.
	"el": "#todo-stats",

	// Our template for the line of statistics at the bottom of the app.
	// Compiles JavaScript templates into functions that can be evaluated for rendering.
	"template": _.template(function() {
		var result;
		$.ajax({
			"async": false,
		    "url":   "js/templates/_stats.html",
		  	success: function(data) {
		    	result = data;
		  	},
		});
		return result;
	}()),

	// Delegated events for creating new items, and clearing completed ones.
	"events": {
		"click .todo-clear a": "clearCompleted"
	},

	initialize: function(options) {
		_.bindAll(this, "render");
		App.Mediator.bind("todosStatsUpdated", this.render);
	},

	render: function(options) {
		$(this.el).html(this.template({
			"total":      App.Models.Todos.length,
			"done":       App.Models.Todos.done().length,
			"remaining":  App.Models.Todos.remaining().length
		}));
		return this;
	},

	// Clear all done todo items, destroying their models.
	clearCompleted: function() {
		_.each(App.Models.Todos.done(), function (todo) {
			todo.destroy();
		});
		this.render();
		return false;
	}

});