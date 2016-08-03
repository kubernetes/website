---
assignees:
- bprashanth
- freehan

---
* TOC
{:toc}

Services map a port on each cluster node to ports on one or more pods.

The mapping uses a `selector` key:value pair in the service, and the
`labels` property of pods. Any pods whose labels match the service selector
are made accessible through the service's port.

For more information, see the
[Services Overview](/docs/user-guide/services/).

## Create a service

Services are created by passing a configuration file to the `kubectl create`
command:

```shell
$ kubectl create -f FILE
```

Where:

* `-f FILE` or `--filename FILE` is a relative path to a
  [service configuration file](#service-configuration-file) in either JSON
  or YAML format.

A successful service create request returns the service name. You can use
a [sample file](#sample_files) below to try a create request.

### Service configuration file

When creating a service, you must point to a service configuration file as the
value of the `-f` flag. The configuration file can be formatted as
YAML or as JSON, and supports the following fields:

```json
{
  "kind": "Service",
  "apiVersion": "v1",
  "metadata": {
    "name": string
  },
  "spec": {
    "ports": [{
      "port": int,
      "targetPort": int
    }],
    "selector": {
      string: string
    },
    "type": "LoadBalancer",
    "loadBalancerSourceRanges": [
      "10.180.0.0/16",
      "10.245.0.0/24"
    ]
  }
}
```

Required fields are:

* `kind`: Always `Service`.
* `apiVersion`: Currently `v1`.
* `metadata`: Contains:
    * `name`: The name to give to this service.
* `spec`: Contains:
    * `ports`: The ports to map. `port` is the service port to expose on the
      cluster IP. `targetPort` is the port to target on the pods that are part
      of this service.
    * `selector`: The label key:value pair that defines the pods to
      target.
    * `type`: Optional. If the type is `LoadBalancer`, sets up a [network load balancer](/docs/user-guide/load-balancer/)
      for your service. This provides an externally-accessible IP address that
      sends traffic to the correct port on your cluster nodes. 
    * `loadBalancerSourceRanges:`: Optional. Must use with `LoadBalancer` type. 
      If specified and supported by the cloud provider, this will restrict traffic 
      such that the load balancer will be accessible only to clients from the specified IP ranges.
      This field will be ignored if the cloud-provider does not support the feature. 

For the full `service` schema see the
[Kubernetes api reference](/docs/api-reference/v1/definitions/#_v1_service).

### Sample files

The following service configuration files assume that you have a set of pods
that expose port 9376 and carry the label `app=example`.

Both files create a new service named `myapp` which resolves to TCP port 9376
on any pod with the `app=example` label.

The difference in the files is in how the service is accessed. The first file
does not create an external load balancer; the service can be accessed through
port 8765 on any of the nodes' IP addresses.

{% capture tabspec %}servicesample
JSON,json,service-sample.json,/docs/user-guide/services/service-sample.json
YAML,yaml,service-sample.yaml,/docs/user-guide/services/service-sample.yaml{% endcapture %}
{% include tabs.html %}

The second file uses
[network load balancing](/docs/user-guide/load-balancer/) to create a
single IP address that spreads traffic to all of the nodes in
your cluster. This option is specified with the
`"type": "LoadBalancer"` property.

{% capture tabspec %}loadbalancesample
JSON,json,load-balancer-sample.json,/docs/user-guide/services/load-balancer-sample.json
YAML,yaml,load-balancer-sample.yaml,/docs/user-guide/services/load-balancer-sample.yaml{% endcapture %}
{% include tabs.html %}

To access the service, a client connects to the external IP address, which
forwards to port 8765 on a node in the cluster, which in turn accesses
port 9376 on the pod. See the
[Service configuration file](#service-configuration-file) section of this doc
for directions on finding the external IP address.

## View a service

To list all services on a cluster, use the
`kubectl get` command:

```shell
$ kubectl get services
```

A successful get request returns all services that exist on the specified
cluster:

```shell
NAME    LABELS   SELECTOR    IP              PORT
myapp   <none>   app=MyApp   10.123.255.83   8765/TCP
```

To return information about a specific service, use the
`kubectl describe` command:

```shell
$ kubectl describe service NAME
```

Details about the specific service are returned:

```conf
Name:                   myapp
Labels:                 <none>
Selector:               app=MyApp
IP:                     10.123.255.83
Port:                   <unnamed>       8765/TCP
NodePort:               <unnamed>       31474/TCP
Endpoints:              <none>
Session Affinity:       None
No events.
```

To return information about a service when event information is not required,
substitute `get` for `describe`.

## Delete a service

To delete a service, use the `kubectl delete` command:

```shell
$ kubectl delete service NAME
```

A successful delete request returns the deleted service's name.
