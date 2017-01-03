------------

# expose

>bdocs-tab:example Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000.

```bdocs-tab:example_shell
kubectl expose rc nginx --port=80 --target-port=8000
```

>bdocs-tab:example Create a service for a replication controller identified by type and name specified in "nginx-controller.yaml", which serves on port 80 and connects to the containers on port 8000.

```bdocs-tab:example_shell
kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000
```

>bdocs-tab:example Create a service for a pod valid-pod, which serves on port 444 with the name "frontend"

```bdocs-tab:example_shell
kubectl expose pod valid-pod --port=444 --name=frontend
```

>bdocs-tab:example Create a second service based on the above service, exposing the container port 8443 as port 443 with the name "nginx-https"

```bdocs-tab:example_shell
kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https
```

>bdocs-tab:example Create a service for a replicated streaming application on port 4100 balancing UDP traffic and named 'video-stream'.

```bdocs-tab:example_shell
kubectl expose rc streamer --port=4100 --protocol=udp --name=video-stream
```

>bdocs-tab:example Create a service for a replicated nginx using replica set, which serves on port 80 and connects to the containers on port 8000.

```bdocs-tab:example_shell
kubectl expose rs nginx --port=80 --target-port=8000
```

>bdocs-tab:example Create a service for an nginx deployment, which serves on port 80 and connects to the containers on port 8000.

```bdocs-tab:example_shell
kubectl expose deployment nginx --port=80 --target-port=8000
```


Expose a resource as a new Kubernetes service. 

Looks up a deployment, service, replica set, replication controller or pod by name and uses the selector for that resource as the selector for a new service on the specified port. A deployment or replica set will be exposed as a service only if its selector is convertible to a selector that service supports, i.e. when the selector contains only the matchLabels component. Note that if no port is specified via --port and the exposed resource has multiple ports, all will be re-used by the new service. Also if no labels are specified, the new service will re-use the labels from the resource it exposes. 

Possible resources include (case insensitive): 

pod (po), service (svc), replicationcontroller (rc), deployment (deploy), replicaset (rs)

### Usage

`$ expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
cluster-ip |  |  | ClusterIP to be assigned to the service. Leave empty to auto-allocate, or set to 'None' to create a headless service. 
container-port |  |  | Synonym for --target-port 
create-external-load-balancer |  | false | If true, create an external load balancer for this service (trumped by --type). Implementation is cloud provider dependent. Default is 'false'. 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
external-ip |  |  | Additional external IP address (not managed by Kubernetes) to accept for the service. If this IP is routed to a node, the service can be accessed by this IP in addition to its generated service IP. 
filename | f | [] | Filename, directory, or URL to files identifying the resource to expose a service 
generator |  | service/v2 | The name of the API generator to use. There are 2 generators: 'service/v1' and 'service/v2'. The only difference between them is that service port in v1 is named 'default', while it is left unnamed in v2. Default is 'service/v2'. 
labels | l |  | Labels to apply to the service created by this call. 
load-balancer-ip |  |  | IP to assign to the Load Balancer. If empty, an ephemeral IP will be created and used (cloud-provider specific). 
name |  |  | The name for the newly created object. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
overrides |  |  | An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field. 
port |  |  | The port that the service should serve on. Copied from the resource being exposed, if unspecified 
protocol |  |  | The network protocol for the service to be created. Default is 'TCP'. 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
selector |  |  | A label selector to use for this service. Only equality-based selector requirements are supported. If empty (the default) infer the selector from the replication controller or replica set. 
session-affinity |  |  | If non-empty, set the session affinity for the service to this; legal values: 'None', 'ClientIP' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
target-port |  |  | Name or number for the port on the container that the service should direct traffic to. Optional. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
type |  |  | Type for this service: ClusterIP, NodePort, or LoadBalancer. Default is 'ClusterIP'. 


