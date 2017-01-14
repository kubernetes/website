

-----------
# IngressSpec v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | IngressSpec







IngressSpec describes the Ingress the user wishes to exist.

<aside class="notice">
Appears In <a href="#ingress-v1beta1">Ingress</a> </aside>

Field        | Description
------------ | -----------
backend <br /> *[IngressBackend](#ingressbackend-v1beta1)*  | A default backend capable of servicing requests that don't match any rule. At least one of 'backend' or 'rules' must be specified. This field is optional to allow the loadbalancer controller or defaulting logic to specify a global default.
rules <br /> *[IngressRule](#ingressrule-v1beta1) array*  | A list of host rules used to configure the Ingress. If unspecified, or no rule matches, all traffic is sent to the default backend.
tls <br /> *[IngressTLS](#ingresstls-v1beta1) array*  | TLS configuration. Currently the Ingress only supports a single TLS port, 443. If multiple members of this list specify different hosts, they will be multiplexed on the same port according to the hostname specified through the SNI TLS extension, if the ingress controller fulfilling the ingress supports SNI.






