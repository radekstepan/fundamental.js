var Mediator = {};
_.extend(Mediator, Backbone.Events);

var App = {

    Views: {},
    Routers: {},

    init: function() {
        new App.Routers.Main;
    }

};