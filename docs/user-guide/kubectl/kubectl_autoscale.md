---
title: kubectl autoscale
---

## kubectl autoscale

Auto-scale a Deployment, ReplicaSet, or ReplicationController

### Synopsis


Creates an autoscaler that automatically chooses and sets the number of pods that run in a Kubernetes cluster.

Looks up a Deployment, ReplicaSet, or ReplicationController by name and creates an autoscaler that uses the given resource as a reference. An autoscaler can automatically increase or decrease number of pods deployed within the system as needed.

```
kubectl autoscale (-f FILENAME | TYPE NAME | TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]
```

### Examples

```
  # Auto scale a deployment "foo", with the number of pods between 2 and 10, target CPU utilization specified so a default autoscaling policy will be used:
  kubectl autoscale deployment foo --min=2 --max=10
  
  # Auto scale a replication controller "foo", with the number of pods between 1 and 5, target CPU utilization at 80%:
  kubectl autoscale rc foo --max=5 --cpu-percent=80
```

### Options

```
      --cpu-percent int         The target average CPU utilization (represented as a percent of requested CPU) over all the pods. If it's not specified or negative, a default autoscaling policy will be used. (default -1)
      --dry-run                 If true, only print the object that would be sent, without sending it.
  -f, --filename stringSlice    Filename, directory, or URL to files identifying the resource to autoscale.
      --generator string        The name of the API generator to use. Currently there is only 1 generator. (default "horizontalpodautoscaler/v1")
      --max int                 The upper limit for the number of pods that can be set by the autoscaler. Required. (default -1)
      --min int                 The lower limit for the number of pods that can be set by the autoscaler. If it's not specified or negative, the server will apply a default value. (default -1)
      --name string             The name for the newly created object. If not specified, the name of the input resource will be used.
      --no-headers              When using the default or custom-column output format, don't print headers.
  -o, --output string           Output format. One of: json|yaml|wide|name|custom-columns=...|custom-columns-file=...|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath].
      --output-version string   Output the formatted object with the given group version (for ex: 'extensions/v1beta1').
      --record                  Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.
  -R, --recursive               Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
      --save-config             If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future.
  -a, --show-all                When printing, show all resources (default hide terminated pods.)
      --show-labels             When printing, show all labels as the last column (default hide labels column)
      --sort-by string          If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string.
      --template string         Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
```

### Options inherited from parent commands

```
      --alsologtostderr                  log to standard error as well as files
      --as string                        Username to impersonate for the operation
      --certificate-authority string     Path to a cert. file for the certificate authority
      --client-certificate string        Path to a client certificate file for TLS
      --client-key string                Path to a client key file for TLS
      --cluster string                   The name of the kubeconfig cluster to use
      --context string                   The name of the kubeconfig context to use
      --insecure-skip-tls-verify         If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string                Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files
      --match-server-version             Require server version to match client version
  -n, --namespace string                 If present, the namespace scope for this CLI request
      --password string                  Password for basic authentication to the API server
      --request-timeout string           The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                    The address and port of the Kubernetes API server
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
      --token string                     Bearer token for authentication to the API server
      --user string                      The name of the kubeconfig user to use
      --username string                  Username for basic authentication to the API server
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```



###### Auto generated by spf13/cobra on 13-Dec-2016

<!-- BEGIN MUNGE: GENERATED_ANALYTICS -->
[![Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/docs/user-guide/kubectl/kubectl_autoscale.md?pixel)]()
<!-- END MUNGE: GENERATED_ANALYTICS -->
