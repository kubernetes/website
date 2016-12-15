

-----------
# IngressRule v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | IngressRule







IngressRule represents the rules mapping the paths under a specified host to the related backend services. Incoming requests are first evaluated for a host match, then routed to the backend associated with the matching IngressRuleValue.

<aside class="notice">
Appears In <a href="#ingressspec-v1beta1">IngressSpec</a> </aside>

Field        | Description
------------ | -----------
host <br /> *string*  | Host is the fully qualified domain name of a network host, as defined by RFC 3986. Note the following deviations from the "host" part of the URI as defined in the RFC: 1. IPs are not allowed. Currently an IngressRuleValue can only apply to the 	  IP in the Spec of the parent Ingress. 2. The `:` delimiter is not respected because ports are not allowed. 	  Currently the port of an Ingress is implicitly :80 for http and 	  :443 for https. Both these may change in the future. Incoming requests are matched against the host before the IngressRuleValue. If the host is unspecified, the Ingress routes all traffic based on the specified IngressRuleValue.






