---
title: kubectl
---

kubectl controls the Kubernetes cluster manager.

Find more information at [https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

```
kubectl
```

### Options

```
      --alsologtostderr                  log to standard error as well as files
      --as string                        Username to impersonate for the operation
      --certificate-authority string     Path to a cert file for the certificate authority
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

### SEE ALSO

* [kubectl annotate](/docs/user-guide/kubectl/{{page.version}}/#annotate)     - Update the annotations on a resource
* [kubectl api-versions](/docs/user-guide/kubectl/{{page.version}}/#api-versions)     - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](/docs/user-guide/kubectl/{{page.version}}/#apply)     - Apply a configuration to a resource by filename or stdin
* [kubectl attach](/docs/user-guide/kubectl/{{page.version}}/#attach)     - Attach to a running container
* [kubectl autoscale](/docs/user-guide/kubectl/{{page.version}}/#autoscale)     - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](/docs/user-guide/kubectl/{{page.version}}/#certificate)     - Modify certificate resources.
* [kubectl cluster-info](/docs/user-guide/kubectl/{{page.version}}/#cluster-info)     - Display cluster info
* [kubectl completion](/docs/user-guide/kubectl/{{page.version}}/#completion)     - Output shell completion code for the given shell (bash or zsh)
* [kubectl config](/docs/user-guide/kubectl/{{page.version}}/#config)     - Modify kubeconfig files
* [kubectl convert](/docs/user-guide/kubectl/{{page.version}}/#convert)     - Convert config files between different API versions
* [kubectl cordon](/docs/user-guide/kubectl/{{page.version}}/#cordon)     - Mark node as unschedulable
* [kubectl cp](/docs/user-guide/kubectl/{{page.version}}/#cp)     - Copy files and directories to and from containers.
* [kubectl create](/docs/user-guide/kubectl/{{page.version}}/#create)     - Create a resource by filename or stdin
* [kubectl delete](/docs/user-guide/kubectl/{{page.version}}/#delete)     - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubectl describe](/docs/user-guide/kubectl/{{page.version}}/#describe)     - Show details of a specific resource or group of resources
* [kubectl drain](/docs/user-guide/kubectl/{{page.version}}/#drain)     - Drain node in preparation for maintenance
* [kubectl edit](/docs/user-guide/kubectl/{{page.version}}/#edit)     - Edit a resource on the server
* [kubectl exec](/docs/user-guide/kubectl/{{page.version}}/#exec)     - Execute a command in a container
* [kubectl explain](/docs/user-guide/kubectl/{{page.version}}/#explain)     - Documentation of resources
* [kubectl expose](/docs/user-guide/kubectl/{{page.version}}/#expose)     - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](/docs/user-guide/kubectl/{{page.version}}/#get)     - Display one or many resources
* [kubectl label](/docs/user-guide/kubectl/{{page.version}}/#label)     - Update the labels on a resource
* [kubectl logs](/docs/user-guide/kubectl/{{page.version}}/#logs)     - Print the logs for a container in a pod
* [kubectl options](/docs/user-guide/kubectl/{{page.version}}/#options)     -
* [kubectl patch](/docs/user-guide/kubectl/{{page.version}}/#patch)     - Update field(s) of a resource using strategic merge patch
* [kubectl port-forward](/docs/user-guide/kubectl/{{page.version}}/#port-forward)     - Forward one or more local ports to a pod
* [kubectl proxy](/docs/user-guide/kubectl/{{page.version}}/#proxy)     - Run a proxy to the Kubernetes API server
* [kubectl replace](/docs/user-guide/kubectl/{{page.version}}/#replace)     - Replace a resource by filename or stdin
* [kubectl rolling-update](/docs/user-guide/kubectl/{{page.version}}/#rolling-update)     - Perform a rolling update of the given ReplicationController
* [kubectl rollout](/docs/user-guide/kubectl/{{page.version}}/#rollout)     - Manage a deployment rollout
* [kubectl run](/docs/user-guide/kubectl/{{page.version}}/#run)     - Run a particular image on the cluster
* [kubectl scale](/docs/user-guide/kubectl/{{page.version}}/#scale)     - Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job
* [kubectl set](/docs/user-guide/kubectl/{{page.version}}/#set)     - Set specific features on objects
* [kubectl taint](/docs/user-guide/kubectl/{{page.version}}/#taint)     - Update the taints on one or more nodes
* [kubectl top](/docs/user-guide/kubectl/{{page.version}}/#top)     - Display Resource (CPU/Memory/Storage) usage
* [kubectl uncordon](/docs/user-guide/kubectl/{{page.version}}/#uncordon)     - Mark node as schedulable
* [kubectl version](/docs/user-guide/kubectl/{{page.version}}/#version)     - Print the client and server version information

###### Auto generated by spf13/cobra on 13-Dec-2016

<!-- BEGIN MUNGE: GENERATED_ANALYTICS -->
[![Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/docs/user-guide/kubectl/kubectl.md?pixel)]()
<!-- END MUNGE: GENERATED_ANALYTICS -->
