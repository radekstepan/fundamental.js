var Mediator = function() {
    
    var listeners = {},
        debug     = true;

    // publish a notification to whoever listens
    var publish = function(notification) {
        if (typeof listeners[notification] !== 'undefined') {
            var args = [].slice.call(arguments, 1);
            for (module in listeners[notification]) {
                listeners[notification][module].apply(this, args);

                if (debug) {
                    console.log('"' + notification + '" is heard by ' + module);
                }
            }
        }
    }
  
    // a specific module listens to notification passed
    var listen = function(module, notification, callback) {
        if (typeof(listeners[notification]) == 'undefined') {
            listeners[notification] = {};
        }
        listeners[notification][module] = callback;

        if (debug) {
            console.log(module + ' listening for "' + notification + '"');
        }
    }
  
    return {
        publish:   publish,
        listen:    listen,
        subscribe: listen,
        bind:      listen 
    }

}();