App.Routers.Main = Backbone.Router.extend({

    initialize: function(options) {
    	App.Models.Todos = new TodoList;
		App.Models.Todos.fetch();

        new App.Views.CreateTodoView;
        
		new App.Views.TodoStatsView;

        new App.Views.TodoListView;
    }

});