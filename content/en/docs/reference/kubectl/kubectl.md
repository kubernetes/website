---
title: kubectl
notitle: true
---

## kubectl

kubectl controls the Kubernetes cluster manager

### Synopsis

kubectl controls the Kubernetes cluster manager. 

Find more information at: https://kubernetes.io/docs/reference/kubectl/overview/

```
kubectl [flags]
```

### Options

```
      --alsologtostderr                  log to standard error as well as files
      --as string                        Username to impersonate for the operation
      --as-group stringArray             Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --cache-dir string                 Default HTTP cache directory (default "/home/username/.kube/http-cache")
      --certificate-authority string     Path to a cert file for the certificate authority
      --client-certificate string        Path to a client certificate file for TLS
      --client-key string                Path to a client key file for TLS
      --cluster string                   The name of the kubeconfig cluster to use
      --context string                   The name of the kubeconfig context to use
  -h, --help                             help for kubectl
      --insecure-skip-tls-verify         If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string                Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files
      --match-server-version             Require server version to match client version
  -n, --namespace string                 If present, the namespace scope for this CLI request
      --request-timeout string           The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                    The address and port of the Kubernetes API server
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
      --token string                     Bearer token for authentication to the API server
      --user string                      The name of the kubeconfig user to use
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```

### SEE ALSO

* [kubectl alpha](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#alpha)	 - Commands for features in alpha
* [kubectl annotate](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#annotate)	 - Update the annotations on a resource
* [kubectl api-resources](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#api-resources)	 - Print the supported API resources on the server
* [kubectl api-versions](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#api-versions)	 - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply)	 - Apply a configuration to a resource by filename or stdin
* [kubectl attach](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#attach)	 - Attach to a running container
* [kubectl auth](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#auth)	 - Inspect authorization
* [kubectl autoscale](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#autoscale)	 - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#certificate)	 - Modify certificate resources.
* [kubectl cluster-info](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#cluster-info)	 - Display cluster info
* [kubectl completion](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#completion)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#config)	 - Modify kubeconfig files
* [kubectl convert](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#convert)	 - Convert config files between different API versions
* [kubectl cordon](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#cordon)	 - Mark node as unschedulable
* [kubectl cp](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#cp)	 - Copy files and directories to and from containers.
* [kubectl create](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create)	 - Create a resource from a file or from stdin.
* [kubectl delete](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubectl describe](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe)	 - Show details of a specific resource or group of resources
* [kubectl drain](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#drain)	 - Drain node in preparation for maintenance
* [kubectl edit](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#edit)	 - Edit a resource on the server
* [kubectl exec](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec)	 - Execute a command in a container
* [kubectl explain](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#explain)	 - Documentation of resources
* [kubectl expose](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#expose)	 - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get)	 - Display one or many resources
* [kubectl label](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#label)	 - Update the labels on a resource
* [kubectl logs](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs)	 - Print the logs for a container in a pod
* [kubectl options](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#options)	 - Print the list of flags inherited by all commands
* [kubectl patch](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#patch)	 - Update field(s) of a resource using strategic merge patch
* [kubectl plugin](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#plugin)	 - Runs a command-line plugin
* [kubectl port-forward](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward)	 - Forward one or more local ports to a pod
* [kubectl proxy](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#proxy)	 - Run a proxy to the Kubernetes API server
* [kubectl replace](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#replace)	 - Replace a resource by filename or stdin
* [kubectl rollout](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#rollout)	 - Manage the rollout of a resource
* [kubectl run](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#run)	 - Run a particular image on the cluster
* [kubectl scale](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale)	 - Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job
* [kubectl set](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#set)	 - Set specific features on objects
* [kubectl taint](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#taint)	 - Update the taints on one or more nodes
* [kubectl top](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#top)	 - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#uncordon)	 - Mark node as schedulable
* [kubectl version](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#version)	 - Print the client and server version information
* [kubectl wait](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#wait)	 - Experimental: Wait for one condition on one or many resources

###### Auto generated by spf13/cobra on 16-Jun-2018
