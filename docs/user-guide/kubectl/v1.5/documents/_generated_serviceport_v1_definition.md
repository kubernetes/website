## ServicePort v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ServicePort

> Example yaml coming soon...



ServicePort contains information on service's port.

<aside class="notice">
Appears In  <a href="#servicespec-v1">ServiceSpec</a> </aside>

Field        | Description
------------ | -----------
name <br /> *string* | The name of this port within the service. This must be a DNS_LABEL. All ports within a ServiceSpec must have unique names. This maps to the 'Name' field in EndpointPort objects. Optional if only one ServicePort is defined on this service.
nodePort <br /> *integer* | The port on each node on which this service is exposed when type=NodePort or LoadBalancer. Usually assigned by the system. If specified, it will be allocated to the service if unused or else creation of the service will fail. Default is to auto-allocate a port if the ServiceType of this Service requires one. More info: http://kubernetes.io/docs/user-guide/services#type--nodeport
port <br /> *integer* | The port that will be exposed by this service.
protocol <br /> *string* | The IP protocol for this port. Supports "TCP" and "UDP". Default is TCP.
targetPort <br /> *[IntOrString](#intorstring-intstr)* | Number or name of the port to access on the pods targeted by the service. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME. If this is a string, it will be looked up as a named port in the target Pod's container ports. If this is not specified, the value of the 'port' field is used (an identity map). This field is ignored for services with clusterIP=None, and should be omitted or set equal to the 'port' field. More info: http://kubernetes.io/docs/user-guide/services#defining-a-service

