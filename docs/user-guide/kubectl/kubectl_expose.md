---
---

## kubectl expose

Take a replication controller, service or pod and expose it as a new Kubernetes Service

### Synopsis


Take a replication controller, service, replica set or pod and expose it as a new Kubernetes service.

Looks up a replication controller, service, replica set or pod by name and uses the selector for that
resource as the selector for a new service on the specified port. A replica set will be exposed as a
service only if it's selector is convertible to a selector that service supports, i.e. when the
replica set selector contains only the matchLabels component. Note that if no port is specified
via --port and the exposed resource has multiple ports, all will be re-used by the new service. Also
if no labels are specified, the new service will re-use the labels from the resource it exposes.

```
kubectl expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type]
```

### Examples

```
# Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000.
kubectl expose rc nginx --port=80 --target-port=8000

# Create a service for a replication controller identified by type and name specified in "nginx-controller.yaml", which serves on port 80 and connects to the containers on port 8000.
kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000

# Create a service for a pod valid-pod, which serves on port 444 with the name "frontend"
kubectl expose pod valid-pod --port=444 --name=frontend

# Create a second service based on the above service, exposing the container port 8443 as port 443 with the name "nginx-https"
kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https

# Create a service for a replicated streaming application on port 4100 balancing UDP traffic and named 'video-stream'.
kubectl expose rc streamer --port=4100 --protocol=udp --name=video-stream

# Create a service for a replicated nginx using replica set, which serves on port 80 and connects to the containers on port 8000.
kubectl expose rs nginx --port=80 --target-port=8000
```

### Options

```
      --container-port="": Synonym for --target-port
      --dry-run[=false]: If true, only print the object that would be sent, without creating it.
      --external-ip="": Additional external IP address (not managed by Kubernetes) to accept for the service. If this IP is routed to a node, the service can be accessed by this IP in addition to its generated service IP.
  -f, --filename=[]: Filename, directory, or URL to a file identifying the resource to expose a service
      --generator="service/v2": The name of the API generator to use. There are 2 generators: 'service/v1' and 'service/v2'. The only difference between them is that service port in v1 is named 'default', while it is left unnamed in v2. Default is 'service/v2'.
  -l, --labels="": Labels to apply to the service created by this call.
      --load-balancer-ip="": IP to assign to to the Load Balancer. If empty, an ephemeral IP will be created and used (cloud-provider specific).
      --name="": The name for the newly created object.
      --no-headers[=false]: When using the default output, don't print headers.
  -o, --output="": Output format. One of: json|yaml|wide|name|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=... See golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://releases.k8s.io/release-1.2/docs/user-guide/jsonpath.md].
      --output-version="": Output the formatted object with the given group version (for ex: 'extensions/v1beta1').
      --overrides="": An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field.
      --port="": The port that the service should serve on. Copied from the resource being exposed, if unspecified
      --protocol="TCP": The network protocol for the service to be created. Default is 'tcp'.
      --record[=false]: Record current kubectl command in the resource annotation.
      --save-config[=false]: If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future.
      --selector="": A label selector to use for this service. Only equality-based selector requirements are supported. If empty (the default) infer the selector from the replication controller or replica set.
      --session-affinity="": If non-empty, set the session affinity for the service to this; legal values: 'None', 'ClientIP'
  -a, --show-all[=false]: When printing, show all resources (default hide terminated pods.)
      --show-labels[=false]: When printing, show all labels as the last column (default hide labels column)
      --sort-by="": If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string.
      --target-port="": Name or number for the port on the container that the service should direct traffic to. Optional.
      --template="": Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
      --type="": Type for this service: ClusterIP, NodePort, or LoadBalancer. Default is 'ClusterIP'.
```

### Options inherited from parent commands

```
      --alsologtostderr[=false]: log to standard error as well as files
      --certificate-authority="": Path to a cert. file for the certificate authority.
      --client-certificate="": Path to a client certificate file for TLS.
      --client-key="": Path to a client key file for TLS.
      --cluster="": The name of the kubeconfig cluster to use
      --context="": The name of the kubeconfig context to use
      --insecure-skip-tls-verify[=false]: If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure.
      --kubeconfig="": Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at=:0: when logging hits line file:N, emit a stack trace
      --log-dir="": If non-empty, write log files in this directory
      --log-flush-frequency=5s: Maximum number of seconds between log flushes
      --logtostderr[=true]: log to standard error instead of files
      --match-server-version[=false]: Require server version to match client version
      --namespace="": If present, the namespace scope for this CLI request.
      --password="": Password for basic authentication to the API server.
  -s, --server="": The address and port of the Kubernetes API server
      --stderrthreshold=2: logs at or above this threshold go to stderr
      --token="": Bearer token for authentication to the API server.
      --user="": The name of the kubeconfig user to use
      --username="": Username for basic authentication to the API server.
      --v=0: log level for V logs
      --vmodule=: comma-separated list of pattern=N settings for file-filtered logging
```

### SEE ALSO

* [kubectl](/docs/user-guide/kubectl/kubectl/)	 - kubectl controls the Kubernetes cluster manager

###### Auto generated by spf13/cobra on 11-Mar-2016

