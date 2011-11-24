var App = {

	Mediator: {},

    Views: {},
    Models: {},
    Routers: {},

    init: function() {
    	_.extend(App.Mediator, Backbone.Events);
        new App.Routers.Main;
    }

};