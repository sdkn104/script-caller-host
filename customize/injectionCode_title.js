// Injection Code
//
// Object returned by IIFE will be passed to Native code
// If the returned object have "error" key, it is handled as error.

(function() { // IIFE (Immediately Invoked Function Expression) 
    try {
        var title = document.querySelector("title");
        if( title ) {
            return {title: title.innerHTML}
        } else {
            return {title: "failed to get title" }
        }
    } catch(err) {
        // when error, return object should have "error" key
        return {error:err.name, message:err.message, stack:err.stack}
    }
})();
