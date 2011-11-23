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
			return this.filter(function(todo) {
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

	// Todo Item View
	// --------------

	// The DOM element for a todo item...
	// Not a strict convention
	window.TodoView = Backbone.View.extend({

		//... is a list tag.
		"tagName":  "li",

		// Cache the template function for a single item.
		"template": _.template(function() {
			var result;
			$.ajax({
				"async": false,
			    "url":   "js/templates/_todo.html",
			  	success: function(data) {
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
			$(this.el).addClass("editing");
			this.input.focus();
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function() {
			this.model.save({text: this.input.val()});
			$(this.el).removeClass("editing");
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

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	window.AppView = Backbone.View.extend({

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
			this.$("#todo-stats").html(this.statsTemplate({
				"total":      Todos.length,
				"done":       Todos.done().length,
				"remaining":  Todos.remaining().length
			}));
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
			var text = this.input.val();
			if (!text || e.keyCode != 13) return;
			
			Todos.create({text: text});
			this.input.val('');
		},

		// Clear all done todo items, destroying their models.
		clearCompleted: function() {
			_.each(Todos.done(), function(todo){ todo.destroy(); });
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

	// Finally, we kick things off by creating the **App**.
	window.App = new AppView;

});