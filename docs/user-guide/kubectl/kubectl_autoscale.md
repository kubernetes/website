---
---

## kubectl autoscale

Auto-scale a Deployment, ReplicaSet, or ReplicationController

### Synopsis


Creates an autoscaler that automatically chooses and sets the number of pods that run in a kubernetes cluster.

Looks up a Deployment, ReplicaSet, or ReplicationController by name and creates an autoscaler that uses the given resource as a reference.
An autoscaler can automatically increase or decrease number of pods deployed within the system as needed.

```
kubectl autoscale (-f FILENAME | TYPE NAME | TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]
```

### Examples

```
# Auto scale a deployment "foo", with the number of pods between 2 and 10, no target CPU utilization specfied so a default autoscaling policy will be used:
kubectl autoscale deployment foo --min=2 --max=10

# Auto scale a replication controller "foo", with the number of pods between 1 and 5, target CPU utilization at 80%:
kubectl autoscale rc foo --max=5 --cpu-percent=80
```

### Options

```
      --cpu-percent=-1: The target average CPU utilization (represented as a percent of requested CPU) over all the pods. If it's not specified or negative, a default autoscaling policy will be used.
      --dry-run[=false]: If true, only print the object that would be sent, without sending it.
  -f, --filename=[]: Filename, directory, or URL to a file identifying the resource to autoscale.
      --generator="horizontalpodautoscaler/v1": The name of the API generator to use. Currently there is only 1 generator.
      --include-extended-apis[=true]: If true, include definitions of new APIs via calls to the API server. [default true]
      --max=-1: The upper limit for the number of pods that can be set by the autoscaler. Required.
      --min=-1: The lower limit for the number of pods that can be set by the autoscaler. If it's not specified or negative, the server will apply a default value.
      --name="": The name for the newly created object. If not specified, the name of the input resource will be used.
      --no-headers[=false]: When using the default output, don't print headers.
  -o, --output="": Output format. One of: json|yaml|wide|name|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=... See golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://releases.k8s.io/release-1.3/docs/user-guide/jsonpath.md].
      --output-version="": Output the formatted object with the given group version (for ex: 'extensions/v1beta1').
      --record[=false]: Record current kubectl command in the resource annotation.
  -R, --recursive[=false]: Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
      --save-config[=false]: If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future.
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
[![Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/docs/user-guide/kubectl/kubectl_autoscale.md?pixel)]()
<!-- END MUNGE: GENERATED_ANALYTICS -->
