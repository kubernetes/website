## LoadBalancerStatus v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | LoadBalancerStatus

> Example yaml coming soon...



LoadBalancerStatus represents the status of a load-balancer.

<aside class="notice">
Appears In  <a href="#ingressstatus-v1beta1">IngressStatus</a>  <a href="#servicestatus-v1">ServiceStatus</a> </aside>

Field        | Description
------------ | -----------
ingress <br /> *[LoadBalancerIngress](#loadbalanceringress-v1) array* | Ingress is a list containing ingress points for the load-balancer. Traffic intended for the service should be sent to these ingress points.

