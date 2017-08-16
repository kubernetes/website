$( document ).ready(function() {
    var doRedirect = false;
    var notHere = false;
    var forwardingURL = window.location.href;

    var oldURLs = ["/README.md","/README.html","/index.md",".html",".md"];

    /* var:  forwardingRules
     * type: array of objects
     * example rule object:
     * {
     *   "from":    "/path/from/old/location", //search in incoming forwardingURL for this string
     *   "pattern": "#([0-9a-zA-Z\-\_]+)",     //[optional] regex to parse out a token of digits, letters, hyphen, or underscore
     *   "to":      "/path/to/new/location",   //base URL to forward to
     *   "postfix": "/#<token>"                //[optional] append this to base URL w/ <token> found by "pattern"
     * }
     */
    var forwardingRules = [];

    forwardingRules.forEach(function(rule) {
        if (forwardingURL.indexOf(rule.from) > -1) {
            var newURL = rule.to;
            var re = new RegExp(rule.pattern, 'g');
            var matchary = re.exec(forwardingURL);
            if (matchary !== null && rule.postfix) {
                newURL += rule.postfix.replace("<token>", matchary[1]);
            }
            notHere = true;
            window.location.replace(newURL);
        }

    });

    if (!notHere) {
        for (var i = 0; i < oldURLs.length; i++) {
            if (forwardingURL.indexOf(oldURLs[i]) > -1 &&
                    forwardingURL.indexOf("404.html") < 0){
                doRedirect = true;
                forwardingURL = forwardingURL.replace(oldURLs[i],"/");
            }
        }
        if (doRedirect){
            window.location.replace(forwardingURL);
        };
    }
});
