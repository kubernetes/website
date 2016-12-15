

-----------
# LoadBalancerIngress v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | LoadBalancerIngress







LoadBalancerIngress represents the status of a load-balancer ingress point: traffic intended for the service should be sent to an ingress point.

<aside class="notice">
Appears In <a href="#loadbalancerstatus-v1">LoadBalancerStatus</a> </aside>

Field        | Description
------------ | -----------
hostname <br /> *string*  | Hostname is set for load-balancer ingress points that are DNS based (typically AWS load-balancers)
ip <br /> *string*  | IP is set for load-balancer ingress points that are IP based (typically GCE or OpenStack load-balancers)






