

-----------
# ContainerPort v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ContainerPort







ContainerPort represents a network port in a single container.

<aside class="notice">
Appears In <a href="#container-v1">Container</a> </aside>

Field        | Description
------------ | -----------
containerPort <br /> *integer*  | Number of port to expose on the pod's IP address. This must be a valid port number, 0 < x < 65536.
hostIP <br /> *string*  | What host IP to bind the external port to.
hostPort <br /> *integer*  | Number of port to expose on the host. If specified, this must be a valid port number, 0 < x < 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.
name <br /> *string*  | If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.
protocol <br /> *string*  | Protocol for port. Must be UDP or TCP. Defaults to "TCP".






