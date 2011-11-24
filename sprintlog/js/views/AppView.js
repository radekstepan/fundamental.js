// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
var AppView = Backbone.View.extend({

	// Instead of generating a new element, bind to the existing skeleton of
	// the App already present in the HTML.
	"el": $("#todoapp"),

	// Our template for the line of statistics at the bottom of the app.
	// Compiles JavaScript templates into functions that can be evaluated for rendering.
	"statsTemplate": _.template(function() {
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
		"keypress #new-todo":  "createOnEnter",
		"keyup #new-todo":     "showTooltip",
		"click .todo-clear a": "clearCompleted"
	},

	// At initialization we bind to the relevant events on the `Todos`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting todos that might be saved in *localStorage*.
	initialize: function() {
		this.input = this.$("#new-todo");

		Todos.bind("add",   this.addOne, this);
		Todos.bind("reset", this.addAll, this);
		Todos.bind("all",   this.render, this);

		Todos.fetch();
	},

	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
	render: function() {
		Mediator.publish('appRendered', this, Todos);
	},

	// Add a single todo item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function(todo) {
		var view = new TodoView({model: todo});
		this.$("#todo-list").append(view.render().el);
	},

	// Add all items in the **Todos** collection at once.
	addAll: function() {
		Todos.each(this.addOne);
	},

	// If you hit return in the main input field, and there is text to save,
	// create new **Todo** model persisting it to *localStorage*.
	createOnEnter: function(e) {
		Mediator.publish('createWhenEntered', this, e, Todos);
	},

	// Clear all done todo items, destroying their models.
	clearCompleted: function() {
		Mediator.publish('clearContent', Todos);
		return false;
	},

	// Lazily show the tooltip that tells you to press `enter` to save
	// a new todo item, after one second.
	showTooltip: function(e) {
		var tooltip = this.$(".ui-tooltip-top");
		var val = this.input.val();
		tooltip.fadeOut();
		if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
		if (val == '' || val == this.input.attr('placeholder')) return;
		var show = function(){ tooltip.show().fadeIn(); };
		this.tooltipTimeout = _.delay(show, 1000);
	}

});