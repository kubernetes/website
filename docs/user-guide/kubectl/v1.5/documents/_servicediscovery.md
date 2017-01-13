# <strong>DISCOVERY & LOAD BALANCING</strong>

These are responsible for stitching your workloads together into an accessible Loadbalanced Service.  By default,
[Workloads](#workloads) are only accessible within the cluster, and they must be exposed externally using a either
a *LoadBalancer* or *NodePort* [Service](#service-v1), or an (Ingress)[#ingress].  For development,
Workloads that are not exposed externally can be accessed locally from a machine using the `kubectl proxy` command.

Common resource types:

- [Services](#service-v1) for providing a single ip endpoint loadbalanced across multiple Workload replicas.
- [Ingress](#ingress-v1beta1) for providing a https(s) endpoint http(s) routed to one or more *Services*

------------
