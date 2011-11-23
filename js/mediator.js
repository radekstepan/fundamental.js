var Mediator = function() {
    
    var listeners = {};

    var publish = function(name) {
        if (typeof listeners[name] !== 'undefined') {
            var args = [].slice.call(arguments, 1);
            for (module in listeners[name]) {
                listeners[name][module].apply(this, args);
            }
        }
    }
  
    var listen = function(module, name, callback) {
        if (typeof(listeners[name]) == 'undefined') {
            listeners[name] = {};
        }
        listeners[name][module] = callback;
    }
  
    return {
        publish: publish,
        listen:  listen
    }

}();

// View
var View = function() {
    
    var text = 'This is the value passed: ';

    var example = function() {
        Mediator.publish('exampleViewCalled', this, 1984);
    }

    return {
        example: example,
        text:    text
    }
}();

// Module - Console Logging registered to listen to the View
Mediator.listen('consoleModule', 'exampleViewCalled', function(context, value) {
    console.log(context.text + value);
});

View.example(); // event happenz...