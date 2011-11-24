App.Routers.Main = Backbone.Router.extend({

    initialize: function(options) {
		Todos.fetch();

        new App.Views.CreateTodoView;
        
        var listView = new App.Views.TodoListView;
        listView.addAll();

        //new App.Views.TodoStats;
    }

});