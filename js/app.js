// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

	// Todo Model
	// Models are the heart of any JavaScript application, containing the interactive data as well as a large part
	//  of the logic surrounding it: conversions, validations, computed properties, and access control.
	// ----------

	// Our basic **Todo** model has `text`, `order`, and `done` attributes.
	window.Todo = Backbone.Model.extend({

		// Default attributes for a todo item.
		defaults: function() {
			// `text` attr is implied
			return {
				"done":  false,
				"order": Todos.nextOrder()
			};
		},

		// Toggle the `done` state of this todo item.
		toggle: function() {
			this.save({"done": !this.get("done")});
		}

	});

	// Todo Collection
	// Collections are ordered sets of models
	// ---------------

	// The collection of todos is backed by *localStorage* instead of a remote server.
	window.TodoList = Backbone.Collection.extend({

		// Reference to this collection's model.
		// Override this property to specify the model class that the collection contains.
		"model": Todo,

		// Save all of the todo items under the `"todos"` namespace.
		"localStorage": new Store("todos"),

		// Filter down the list of all todo items that are finished.
		done: function() {
			return this.filter(function (todo) {
				return todo.get("done"); // all items with `done` attr set to true
			});
		},

		// Filter down the list to only todo items that are still not finished.
		remaining: function() {
			return this.without.apply(this, this.done()); // reverse of `done()` filter
		},

		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function() {
			if (!this.length) return 1; // first item
			return this.last().get("order") + 1; // last +1
		},

		// Todos are sorted by their original insertion order.
		// If you define a comparator, it will be used to maintain the collection in sorted order.
		comparator: function(todo) {
			return todo.get("order");
		}

	});

	// Create our global collection of **Todos**.
	window.Todos = new TodoList;

	$.getScript("js/views/TodoView.js", function() {
		$.getScript("js/views/AppView.js", function() {
				// Finally, we kick things off by creating the **App**.
				window.App = new AppView;
		});		
	});

	// Modules called from Views
	// ---------------

	// Todo entry counter listens to when the app is rendered
	Mediator.listen('todoCounter', 'appRendered', function (view, Todos) {
		view.$("#todo-stats").html(view.statsTemplate({
			"total":      Todos.length,
			"done":       Todos.done().length,
			"remaining":  Todos.remaining().length
		}));
	});

	// Create a new todo entry on enter press listens to createWhenEntered
   Mediator.listen('keyboardManager', 'createWhenEntered', function (view, e, Todos) {
		var text = view.input.val();
		if (!text || e.keyCode != 13) return;
		
		Todos.create({text: text});
		view.input.val('');
    });

    // Clear all completed todos when clearContent is dispatched
    Mediator.listen('garbageCollector', 'clearContent', function (Todos) {
		_.each(Todos.done(), function (todo) {
			todo.destroy();
		});
    });

    Mediator.listen('editFocus', 'beginContentEditing', function (view) {
    	$(view.el).addClass("editing");
		view.input.focus();
    });

    Mediator.listen('todoSaver', 'endContentEditing', function (view) {
		view.model.save({text: view.input.val()});
		$(view.el).removeClass("editing");
    });

});