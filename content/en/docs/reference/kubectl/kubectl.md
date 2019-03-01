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

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--alsologtostderr</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error as well as files</td>
    </tr>

    <tr>
      <td colspan="2">--as string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Username to impersonate for the operation</td>
    </tr>

    <tr>
      <td colspan="2">--as-group stringArray</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Group to impersonate for the operation, this flag can be repeated to specify multiple groups.</td>
    </tr>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
    </tr>

    <tr>
      <td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/Users/tim/.kube/http-cache"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Default HTTP cache directory</td>
    </tr>

    <tr>
      <td colspan="2">--certificate-authority string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a cert file for the certificate authority</td>
    </tr>

    <tr>
      <td colspan="2">--client-certificate string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a client certificate file for TLS</td>
    </tr>

    <tr>
      <td colspan="2">--client-key string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a client key file for TLS</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">CIDRs opened in GCE firewall for LB traffic proxy & health checks</td>
    </tr>

    <tr>
      <td colspan="2">--cluster string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The name of the kubeconfig cluster to use</td>
    </tr>

    <tr>
      <td colspan="2">--context string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The name of the kubeconfig context to use</td>
    </tr>

    <tr>
      <td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.</td>
    </tr>

    <tr>
      <td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kubectl</td>
    </tr>

    <tr>
      <td colspan="2">--insecure-skip-tls-verify</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the kubeconfig file to use for CLI requests.</td>
    </tr>

    <tr>
      <td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">when logging hits line file:N, emit a stack trace</td>
    </tr>

    <tr>
      <td colspan="2">--log-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, write log files in this directory</td>
    </tr>

    <tr>
      <td colspan="2">--log-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, use this log file</td>
    </tr>

    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td>
    </tr>

    <tr>
      <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error instead of files</td>
    </tr>

    <tr>
      <td colspan="2">--match-server-version</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Require server version to match client version</td>
    </tr>

    <tr>
      <td colspan="2">-n, --namespace string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If present, the namespace scope for this CLI request</td>
    </tr>

    <tr>
      <td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "none"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)</td>
    </tr>

    <tr>
      <td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "profile.pprof"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Name of the file to write the profile to</td>
    </tr>

    <tr>
      <td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "0"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</td>
    </tr>

    <tr>
      <td colspan="2">-s, --server string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The address and port of the Kubernetes API server</td>
    </tr>

    <tr>
      <td colspan="2">--skip-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, avoid header prefixes in the log messages</td>
    </tr>

    <tr>
      <td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">logs at or above this threshold go to stderr</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Bearer token for authentication to the API server</td>
    </tr>

    <tr>
      <td colspan="2">--user string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The name of the kubeconfig user to use</td>
    </tr>

    <tr>
      <td colspan="2">-v, --v Level</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log level for V logs</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td>
    </tr>

    <tr>
      <td colspan="2">--vmodule moduleSpec</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">comma-separated list of pattern=N settings for file-filtered logging</td>
    </tr>

  </tbody>
</table>



### SEE ALSO
* [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands#annotate)	 - Update the annotations on a resource
* [kubectl api-resources](/docs/reference/generated/kubectl/kubectl-commands#api-resources)	 - Print the supported API resources on the server
* [kubectl api-versions](/docs/reference/generated/kubectl/kubectl-commands#api-versions)	 - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply)	 - Apply a configuration to a resource by filename or stdin
* [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands#attach)	 - Attach to a running container
* [kubectl auth](/docs/reference/generated/kubectl/kubectl-commands#auth)	 - Inspect authorization
* [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)	 - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](/docs/reference/generated/kubectl/kubectl-commands#certificate)	 - Modify certificate resources.
* [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands#cluster-info)	 - Display cluster info
* [kubectl completion](/docs/reference/generated/kubectl/kubectl-commands#completion)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)	 - Modify kubeconfig files
* [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert)	 - Convert config files between different API versions
* [kubectl cordon](/docs/reference/generated/kubectl/kubectl-commands#cordon)	 - Mark node as unschedulable
* [kubectl cp](/docs/reference/generated/kubectl/kubectl-commands#cp)	 - Copy files and directories to and from containers.
* [kubectl create](/docs/reference/generated/kubectl/kubectl-commands#create)	 - Create a resource from a file or from stdin.
* [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands#delete)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubectl describe](/docs/reference/generated/kubectl/kubectl-commands#describe)	 - Show details of a specific resource or group of resources
* [kubectl diff](/docs/reference/generated/kubectl/kubectl-commands#diff)	 - Diff live version against would-be applied version
* [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands#drain)	 - Drain node in preparation for maintenance
* [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands#edit)	 - Edit a resource on the server
* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands#exec)	 - Execute a command in a container
* [kubectl explain](/docs/reference/generated/kubectl/kubectl-commands#explain)	 - Documentation of resources
* [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands#expose)	 - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](/docs/reference/generated/kubectl/kubectl-commands#get)	 - Display one or many resources
* [kubectl label](/docs/reference/generated/kubectl/kubectl-commands#label)	 - Update the labels on a resource
* [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands#logs)	 - Print the logs for a container in a pod
* [kubectl options](/docs/reference/generated/kubectl/kubectl-commands#options)	 - Print the list of flags inherited by all commands
* [kubectl patch](/docs/reference/generated/kubectl/kubectl-commands#patch)	 - Update field(s) of a resource using strategic merge patch
* [kubectl plugin](/docs/reference/generated/kubectl/kubectl-commands#plugin)	 - Provides utilities for interacting with plugins.
* [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands#port-forward)	 - Forward one or more local ports to a pod
* [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy)	 - Run a proxy to the Kubernetes API server
* [kubectl replace](/docs/reference/generated/kubectl/kubectl-commands#replace)	 - Replace a resource by filename or stdin
* [kubectl rollout](/docs/reference/generated/kubectl/kubectl-commands#rollout)	 - Manage the rollout of a resource
* [kubectl run](/docs/reference/generated/kubectl/kubectl-commands#run)	 - Run a particular image on the cluster
* [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands#scale)	 - Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job
* [kubectl set](/docs/reference/generated/kubectl/kubectl-commands#set)	 - Set specific features on objects
* [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)	 - Update the taints on one or more nodes
* [kubectl top](/docs/reference/generated/kubectl/kubectl-commands#top)	 - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](/docs/reference/generated/kubectl/kubectl-commands#uncordon)	 - Mark node as schedulable
* [kubectl version](/docs/reference/generated/kubectl/kubectl-commands#version)	 - Print the client and server version information
* [kubectl wait](/docs/reference/generated/kubectl/kubectl-commands#wait)	 - Experimental: Wait for a specific condition on one or many resources.

