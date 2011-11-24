// Create Todo Item View
// --------------

// The DOM element for a todo item...
// Not a strict convention
App.Views.CreateTodoView = Backbone.View.extend({

	// bind to existing element
	"el":  "#create-todo",

	// The DOM events
	"events": {
		"keypress #new-todo":  "createOnEnter"
	},

	initialize: function() {
		this.input = this.$("#new-todo");	
	},

	// If you hit return in the main input field, and there is text to save,
	// create new **Todo** model persisting it to *localStorage*.
	createOnEnter: function(e) {
		var text = this.input.val();
		if (!text || e.keyCode != 13) return;
		
		var todo = Todos.create({text: text});
		
		this.input.val('');

		Mediator.trigger("todoCreated", todo);
	}

});