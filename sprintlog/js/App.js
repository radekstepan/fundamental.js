var App = {

	Mediator: {},

    Views: {},
    Routers: {},

    init: function() {
    	_.extend(App.Mediator, Backbone.Events);
        new App.Routers.Main;
    }

};