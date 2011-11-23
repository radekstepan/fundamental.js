// Todo Item View
// --------------

// The DOM element for a todo item...
// Not a strict convention
var TodoView = Backbone.View.extend({

	//... is a list tag.
	"tagName":  "li",

	// Cache the template function for a single item.
	"template": _.template(function() {
		var result;
		$.ajax({
			"async": false,
		    "url":   "js/templates/_todo.html",
		  	success: function (data) {
		    	result = data;
		  	},
		});
		return result;
	}()),

	// The DOM events specific to an item.
	"events": {
		"click .check"              : "toggleDone",
		"dblclick div.todo-text"    : "edit",
		"click span.todo-destroy"   : "clear",
		"keypress .todo-input"      : "updateOnEnter"
	},

	// The TodoView listens for changes to its model, re-rendering.
	// If the view defines an initialize function, it will be called when the view is first created.
	initialize: function() {
		this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.remove, this);
	},

	// Re-render the contents of the todo item.
	// Override this function with your code that renders the view template from model data, and updates this.el with the new HTML.
	render: function() {
		$(this.el).html(this.template(this.model.toJSON())); // serialize to JSON, fill tml, set as innerHTML
		this.setText();
		return this;
	},

	// To avoid XSS (not that it would be harmful in this particular app),
	// we use `jQuery.text` to set the contents of the todo item.
	setText: function() {
		// get attr from the model
		var text = this.model.get('text');
		// set the text on the element
		this.$('.todo-text').text(text);
		this.input = this.$('.todo-input');
		this.input.bind('blur', _.bind(this.close, this)).val(text);
	},

	// Toggle the `"done"` state of the model.
	toggleDone: function() {
		this.model.toggle();
	},

	// Switch this view into `"editing"` mode, displaying the input field.
	edit: function() {
		Mediator.publish('beginContentEditing', this);
	},

	// Close the `"editing"` mode, saving changes to the todo.
	close: function() {
		Mediator.publish('endContentEditing', this);
	},

	// If you hit `enter`, we're through editing the item.
	updateOnEnter: function(e) {
		if (e.keyCode == 13) this.close();
	},

	// Remove this view from the DOM.
	remove: function() {
		$(this.el).remove();
	},

	// Remove the item, destroy the model.
	clear: function() {
		// HTTP DELETE
		this.model.destroy();
	}

});