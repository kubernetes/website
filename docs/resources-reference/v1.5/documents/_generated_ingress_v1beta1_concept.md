

-----------
# Ingress v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | Ingress







Ingress is a collection of rules that allow inbound connections to reach the endpoints defined by a backend. An Ingress can be configured to give services externally-reachable urls, load balance traffic, terminate SSL, offer name based virtual hosting etc.

<aside class="notice">
Appears In <a href="#ingresslist-v1beta1">IngressList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[IngressSpec](#ingressspec-v1beta1)*  | Spec is the desired state of the Ingress. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[IngressStatus](#ingressstatus-v1beta1)*  | Status is the current state of the Ingress. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### IngressSpec v1beta1

<aside class="notice">
Appears In <a href="#ingress-v1beta1">Ingress</a> </aside>

Field        | Description
------------ | -----------
backend <br /> *[IngressBackend](#ingressbackend-v1beta1)*  | A default backend capable of servicing requests that don't match any rule. At least one of 'backend' or 'rules' must be specified. This field is optional to allow the loadbalancer controller or defaulting logic to specify a global default.
rules <br /> *[IngressRule](#ingressrule-v1beta1) array*  | A list of host rules used to configure the Ingress. If unspecified, or no rule matches, all traffic is sent to the default backend.
tls <br /> *[IngressTLS](#ingresstls-v1beta1) array*  | TLS configuration. Currently the Ingress only supports a single TLS port, 443. If multiple members of this list specify different hosts, they will be multiplexed on the same port according to the hostname specified through the SNI TLS extension, if the ingress controller fulfilling the ingress supports SNI.

### IngressStatus v1beta1

<aside class="notice">
Appears In <a href="#ingress-v1beta1">Ingress</a> </aside>

Field        | Description
------------ | -----------
loadBalancer <br /> *[LoadBalancerStatus](#loadbalancerstatus-v1)*  | LoadBalancer contains the current status of the load-balancer.

### IngressList v1beta1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[Ingress](#ingress-v1beta1) array*  | Items is the list of Ingress.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata





