

let main = function() {
    try {
        var title = document.querySelector("title");
        if( title ) {
            return {title: title.innerHTML}
        } else {
            return {title: "failed to get title" }
        }    
    } catch(err) {
        return {error:err.name, message:err.message, stack:err.stack}
    }
};
main();

