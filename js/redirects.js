$( document ).ready(function() {
    var doRedirect = false;
    var notHere = false;
    var forwardingURL = window.location.href;

    var oldURLs = ["/README.md","/README.html","/index.md",".html",".md","/v1.1/","/v1.0/"];

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
    var forwardingRules = [{
        "from":"/docs/api-reference/v1/definitions",
        "pattern":"#_v1_(\\w+)",
        "to":"/docs/api-reference/v1.7",
        "postfix":"/#<token>-v1-core"
    },
    {
        "from":"/docs/user-guide/kubectl/kubectl_",
        "pattern":"kubectl_(\\w+)",
        "to":"/docs/user-guide/kubectl/v1.7",
        "postfix":"/#<token>"
    },
    {
        "from":"/docs/contribute/",
        "pattern":"\/contribute\/([0-9a-zA-Z\-\_]+)",
        "to":"/docs/home/contribute",
        "postfix":"/<token>"
    },
    {
        "from":"/resource-quota",
        "pattern":"",
        "to":"/docs/concepts/policy/resource-quotas/",
        "postfix":""
    },
    {
        "from":"/horizontal-pod-autoscaler",
        "pattern":"",
        "to":"/docs/tasks/run-application/horizontal-pod-autoscale/",
        "postfix":""
    },
    {
        "from":"/docs/roadmap",
        "pattern":"",
        "to":"https://github.com/kubernetes/kubernetes/milestones/",
        "postfix":""
    },
    {
        "from":"/api-ref/",
        "pattern":"",
        "to":"https://github.com/kubernetes/kubernetes/milestones/",
        "postfix":""
    },
    {
        "from":"/kubernetes/third_party/swagger-ui/",
        "pattern":"",
        "to":"/docs/reference",
        "postfix":""
    },
    {
        "from":"/docs/user-guide/overview",
        "pattern":"",
        "to":"/docs/concepts/overview/what-is-kubernetes/",
        "postfix":""
    },
    {
        "from": "/docs/admin/multiple-schedulers",
        "to": "/docs/tutorials/clusters/multiple-schedulers/"
    },
    {
        "from": "/docs/troubleshooting/",
        "to": "/docs/tasks/debug-application-cluster/troubleshooting/"
    },
    {
        "from": "/docs/concepts/services-networking/networkpolicies/",
        "to": "/docs/concepts/services-networking/network-policies/"
    },
    {
        "from": "/docs/getting-started-guides/meanstack/",
        "to": "https://medium.com/google-cloud/running-a-mean-stack-on-google-cloud-platform-with-kubernetes-149ca81c2b5d"
    },
    {
        "from": "/docs/samples/",
        "to": "/docs/tutorials/"
    }
    ];

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
