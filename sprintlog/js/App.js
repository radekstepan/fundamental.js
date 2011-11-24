// An example Backbone application using Mediator pattern to communicate between its Views.
// [Radek Stepan](http://radekstepan.com/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.html)
// to persist Backbone models within your browser.

// Todo App
// ----------

var App = {

	Mediator: {},

	// The standard trio of components. `Routers` used to be `Controllers`.
    Views: {},
    Models: {},
    Routers: {},

    init: function() {
    	// Used to pass notifications round.
    	_.extend(App.Mediator, Backbone.Events);
    	// Call the main application router.
        new App.Routers.Main;
    }

};

// Initialize the app when DOM is ready.
$(function() {
	App.init();
});