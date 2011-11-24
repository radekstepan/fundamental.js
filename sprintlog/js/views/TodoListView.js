// Todo Item View
// --------------

// The DOM element for a todo item...
// Not a strict convention
App.Views.TodoListView = Backbone.View.extend({

	// Instead of generating a new element, bind to the existing skeleton of
	// the App already present in the HTML.
	"el": $("#todos"),

	initialize: function(options) {
		_.bindAll(this, "addOne");
		App.Mediator.bind("todoCreated", this.addOne);	
	},

	// Add a single todo item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function(todo) {
		var view = new App.Views.TodoView({model: todo});
		$("#todo-list").append(view.render().el);
	},

	// Add all items in the **Todos** collection at once.
	addAll: function() {
		App.Models.Todos.each(this.addOne);
	},

});