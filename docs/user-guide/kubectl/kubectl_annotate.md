---
---

## kubectl annotate

Update the annotations on a resource

### Synopsis


Update the annotations on one or more resources.

An annotation is a key/value pair that can hold larger (compared to a label), and possibly not human-readable, data.
It is intended to store non-identifying auxiliary data, especially data manipulated by tools and system extensions.
If --overwrite is true, then existing annotations can be overwritten, otherwise attempting to overwrite an annotation will result in an error.
If --resource-version is specified, then updates will use this resource version, otherwise the existing resource-version will be used.

Possible resources include (case insensitive):
  pod (po), service (svc), replicationcontroller (rc),
  node (no), event (ev), componentstatuse (cs),
  limitrange (limits), persistentvolume (pv), persistentvolumeclaim (pvc),
  horizontalpodautoscaler (hpa), resourcequota (quota), secret


```
kubectl annotate [--overwrite] (-f FILENAME | TYPE NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version]
```

### Examples

```
# Update pod 'foo' with the annotation 'description' and the value 'my frontend'.
# If the same annotation is set multiple times, only the last value will be applied
kubectl annotate pods foo description='my frontend'

# Update a pod identified by type and name in "pod.json"
kubectl annotate -f pod.json description='my frontend'

# Update pod 'foo' with the annotation 'description' and the value 'my frontend running nginx', overwriting any existing value.
kubectl annotate --overwrite pods foo description='my frontend running nginx'

# Update all pods in the namespace
kubectl annotate pods --all description='my frontend running nginx'

# Update pod 'foo' only if the resource is unchanged from version 1.
kubectl annotate pods foo description='my frontend running nginx' --resource-version=1

# Update pod 'foo' by removing an annotation named 'description' if it exists.
# Does not require the --overwrite flag.
kubectl annotate pods foo description-
```

### Options

```
      --all[=false]: select all resources in the namespace of the specified resource types
  -f, --filename=[]: Filename, directory, or URL to a file identifying the resource to update the annotation
      --include-extended-apis[=true]: If true, include definitions of new APIs via calls to the API server. [default true]
      --no-headers[=false]: When using the default output, don't print headers.
  -o, --output="": Output format. One of: json|yaml|wide|name|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=... See golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://releases.k8s.io/release-1.3/docs/user-guide/jsonpath.md].
      --output-version="": Output the formatted object with the given group version (for ex: 'extensions/v1beta1').
      --overwrite[=false]: If true, allow annotations to be overwritten, otherwise reject annotation updates that overwrite existing annotations.
      --record[=false]: Record current kubectl command in the resource annotation.
  -R, --recursive[=false]: Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
      --resource-version="": If non-empty, the annotation update will only succeed if this is the current resource-version for the object. Only valid when specifying a single resource.
  -l, --selector="": Selector (label query) to filter on
  -a, --show-all[=false]: When printing, show all resources (default hide terminated pods.)
      --show-labels[=false]: When printing, show all labels as the last column (default hide labels column)
      --sort-by="": If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string.
      --template="": Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
```

### Options inherited from parent commands

```
      --alsologtostderr[=false]: log to standard error as well as files
      --as="": Username to impersonate for the operation.
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

* [kubectl](kubectl.md)	 - kubectl controls the Kubernetes cluster manager

###### Auto generated by spf13/cobra on 12-Aug-2016





<!-- BEGIN MUNGE: GENERATED_ANALYTICS -->
[![Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/docs/user-guide/kubectl/kubectl_annotate.md?pixel)]()
<!-- END MUNGE: GENERATED_ANALYTICS -->
