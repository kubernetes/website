

-----------
# EndpointAddress v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | EndpointAddress







EndpointAddress is a tuple that describes single IP address.

<aside class="notice">
Appears In <a href="#endpointsubset-v1">EndpointSubset</a> </aside>

Field        | Description
------------ | -----------
hostname <br /> *string*  | The Hostname of this endpoint
ip <br /> *string*  | The IP of this endpoint. May not be loopback (127.0.0.0/8), link-local (169.254.0.0/16), or link-local multicast ((224.0.0.0/24). IPv6 is also accepted but not fully supported on all platforms. Also, certain kubernetes components, like kube-proxy, are not IPv6 ready.
nodeName <br /> *string*  | Optional: Node hosting this endpoint. This can be used to determine endpoints local to a node.
targetRef <br /> *[ObjectReference](#objectreference-v1)*  | Reference to object providing the endpoint.






