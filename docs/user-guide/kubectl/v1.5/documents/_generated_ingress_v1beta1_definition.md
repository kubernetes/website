## Ingress v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | Ingress

> Example yaml coming soon...



Ingress is a collection of rules that allow inbound connections to reach the endpoints defined by a backend. An Ingress can be configured to give services externally-reachable urls, load balance traffic, terminate SSL, offer name based virtual hosting etc.

<aside class="notice">
Appears In  <a href="#ingresslist-v1beta1">IngressList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[IngressSpec](#ingressspec-v1beta1)* | Spec is the desired state of the Ingress. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[IngressStatus](#ingressstatus-v1beta1)* | Status is the current state of the Ingress. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

