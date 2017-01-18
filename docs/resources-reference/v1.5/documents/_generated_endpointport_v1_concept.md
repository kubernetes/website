

-----------
# EndpointPort v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | EndpointPort







EndpointPort is a tuple that describes a single port.

<aside class="notice">
Appears In <a href="#endpointsubset-v1">EndpointSubset</a> </aside>

Field        | Description
------------ | -----------
name <br /> *string*  | The name of this port (corresponds to ServicePort.Name). Must be a DNS_LABEL. Optional only if one port is defined.
port <br /> *integer*  | The port number of the endpoint.
protocol <br /> *string*  | The IP protocol for this port. Must be UDP or TCP. Default is TCP.






