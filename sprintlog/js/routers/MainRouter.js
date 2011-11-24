App.Routers.Main = Backbone.Router.extend({

    initialize: function(options) {
    	App.Models.Todos = new TodoList;
		App.Models.Todos.fetch();

        new App.Views.CreateTodoView;
        
        var listView = new App.Views.TodoListView;
        listView.addAll();

        //new App.Views.TodoStats;
    }

});