## HTTPIngressRuleValue v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | HTTPIngressRuleValue



HTTPIngressRuleValue is a list of http selectors pointing to backends. In the example: http://<host>/<path>?<searchpart> -> backend where where parts of the url correspond to RFC 3986, this resource will be used to match against everything after the last '/' and before the first '?' or '#'.

<aside class="notice">
Appears In  <a href="#ingressrule-v1beta1">IngressRule</a> </aside>

Field        | Description
------------ | -----------
paths <br /> *[HTTPIngressPath](#httpingresspath-v1beta1) array*  | A collection of paths that map requests to backends.

