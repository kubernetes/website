---
---

## kubectl get

Display one or many resources

### Synopsis


Display one or many resources.

Possible resource types include (case insensitive): pods (po), services (svc),
replicationcontrollers (rc), nodes (no), events (ev), componentstatuses (cs),
limitranges (limits), persistentvolumes (pv), persistentvolumeclaims (pvc),
resourcequotas (quota), namespaces (ns), endpoints (ep),
horizontalpodautoscalers (hpa), serviceaccounts or secrets.

By specifying the output as 'template' and providing a Go template as the value
of the --template flag, you can filter the attributes of the fetched resource(s).

```
kubectl get [(-o|--output=)json|yaml|wide|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=...] (TYPE [NAME | -l label] | TYPE/NAME ...) [flags]
```

### Examples

```
# List all pods in ps output format.
kubectl get pods

# List all pods in ps output format with more information (such as node name).
kubectl get pods -o wide

# List a single replication controller with specified NAME in ps output format.
kubectl get replicationcontroller web

# List a single pod in JSON output format.
kubectl get -o json pod web-pod-13je7

# List a pod identified by type and name specified in "pod.yaml" in JSON output format.
kubectl get -f pod.yaml -o json

# Return only the phase value of the specified pod.
kubectl get -o template pod/web-pod-13je7 --template={% raw %}{{.status.phase}}{% endraw %}

# List all replication controllers and services together in ps output format.
kubectl get rc,services

# List one or more resources by their type and names.
kubectl get rc/web service/frontend pods/web-pod-13je7
```

### Options

```
      --all-namespaces[=false]: If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace.
      --export[=false]: If true, use 'export' for the resources.  Exported resources are stripped of cluster-specific information.
  -f, --filename=[]: Filename, directory, or URL to a file identifying the resource to get from a server.
  -L, --label-columns=[]: Accepts a comma separated list of labels that are going to be presented as columns. Names are case-sensitive. You can also use multiple flag statements like -L label1 -L label2...
      --no-headers[=false]: When using the default output, don't print headers.
  -o, --output="": Output format. One of: json|yaml|wide|name|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=... See golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://releases.k8s.io/release-1.2/docs/user-guide/jsonpath.md].
      --output-version="": Output the formatted object with the given group version (for ex: 'extensions/v1beta1').
  -l, --selector="": Selector (label query) to filter on
  -a, --show-all[=false]: When printing, show all resources (default hide terminated pods.)
      --show-labels[=false]: When printing, show all labels as the last column (default hide labels column)
      --sort-by="": If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string.
      --template="": Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
  -w, --watch[=false]: After listing/getting the requested object, watch for changes.
      --watch-only[=false]: Watch for changes to the requested object(s), without listing/getting first.
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
