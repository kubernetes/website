---
title: kubectl
content_type: tool-reference
weight: 30
---

## {{% heading "synopsis" %}}

kubectl controls the Kubernetes cluster manager.

Find more information in [Command line tool](/docs/reference/kubectl/) (`kubectl`).

```shell
kubectl [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--add-dir-header</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If true, adds the file directory to the header of the log messages</td>
</tr>

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
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Default cache directory</td>
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
<td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">CIDRs opened in GCE firewall for L7 LB traffic proxy & health checks</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">CIDRs opened in GCE firewall for L4 LB traffic proxy & health checks</td>
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
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.</td>
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
<td colspan="2">--one-output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If true, only write logs to their native severity level (vs also writing to each lower severity level)</td>
</tr>

<tr>
<td colspan="2">--password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Password for basic authentication to the API server</td>
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
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If true, avoid headers when opening log files</td>
</tr>

<tr>
<td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">logs at or above this threshold go to stderr</td>
</tr>

<tr>
<td colspan="2">--tls-server-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used</td>
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
<td colspan="2">--username string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Username for basic authentication to the API server</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">number for the log level verbosity</td>
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

<tr>
<td colspan="2">--warnings-as-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Treat warnings received from the server as errors and exit with a non-zero exit code</td>
</tr>

</tbody>
</table>

## {{% heading "envvars" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">KUBECONFIG</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the kubectl configuration ("kubeconfig") file. Default: "$HOME/.kube/config"</td>
</tr>

<tr>
<td colspan="2">KUBECTL_COMMAND_HEADERS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">When set to false, turns off extra HTTP headers detailing invoked kubectl command (Kubernetes version v1.22 or later)</td>
</tr>

<tr>
<td colspan="2">KUBECTL_DEBUG_CUSTOM_PROFILE</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">When set to true, custom flag will be enabled in kubectl debug. This flag is used to customize the pre-defined profiles.
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_EXPLAIN_OPENAPIV3</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Toggles whether calls to `kubectl explain` use the new OpenAPIv3 data source available. OpenAPIV3 is enabled by default since Kubernetes 1.24.
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_ENABLE_CMD_SHADOW</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">When set to true, external plugins can be used as subcommands for builtin commands if subcommand does not exist. In alpha stage, this feature can only be used for create command(e.g. kubectl create networkpolicy). 
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_PORT_FORWARD_WEBSOCKETS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">When set to true, the kubectl port-forward command will attempt to stream using the websockets protocol. If the upgrade to websockets fails, the commands will fallback to use the current SPDY protocol.
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_REMOTE_COMMAND_WEBSOCKETS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">When set to true, the kubectl exec, cp, and attach commands will attempt to stream using the websockets protocol. If the upgrade to websockets fails, the commands will fallback to use the current SPDY protocol.
</td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

* [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/) - Update the annotations on a resource
* [kubectl api-resources](/docs/reference/kubectl/generated/kubectl_api-resources/) - Print the supported API resources on the server
* [kubectl api-versions](/docs/reference/kubectl/generated/kubectl_api-versions/) - Print the supported API versions on the server,
  in the form of "group/version"
* [kubectl apply](/docs/reference/kubectl/generated/kubectl_apply/) - Apply a configuration to a resource by filename or stdin
* [kubectl attach](/docs/reference/kubectl/generated/kubectl_attach/) - Attach to a running container
* [kubectl auth](/docs/reference/kubectl/generated/kubectl_auth/) - Inspect authorization
* [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](/docs/reference/kubectl/generated/kubectl_certificate/) - Modify certificate resources.
* [kubectl cluster-info](/docs/reference/kubectl/generated/kubectl_cluster-info/) - Display cluster info
* [kubectl completion](/docs/reference/kubectl/generated/kubectl_completion/) - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](/docs/reference/kubectl/generated/kubectl_config/) - Modify kubeconfig files
* [kubectl cordon](/docs/reference/kubectl/generated/kubectl_cordon/) - Mark node as unschedulable
* [kubectl cp](/docs/reference/kubectl/generated/kubectl_cp/) - Copy files and directories to and from containers.
* [kubectl create](/docs/reference/kubectl/generated/kubectl_create/) - Create a resource from a file or from stdin.
* [kubectl debug](/docs/reference/kubectl/generated/kubectl_debug/) - Create debugging sessions for troubleshooting workloads and nodes
* [kubectl delete](/docs/reference/kubectl/generated/kubectl_delete/) - Delete resources by filenames,
  stdin, resources and names, or by resources and label selector
* [kubectl describe](/docs/reference/kubectl/generated/kubectl_describe/) - Show details of a specific resource or group of resources
* [kubectl diff](/docs/reference/kubectl/generated/kubectl_diff/) - Diff live version against would-be applied version
* [kubectl drain](/docs/reference/kubectl/generated/kubectl_drain/) - Drain node in preparation for maintenance
* [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/) - Edit a resource on the server
* [kubectl events](/docs/reference/kubectl/generated/kubectl_events/)  - List events
* [kubectl exec](/docs/reference/kubectl/generated/kubectl_exec/) - Execute a command in a container
* [kubectl explain](/docs/reference/kubectl/generated/kubectl_explain/) - Documentation of resources
* [kubectl expose](/docs/reference/kubectl/generated/kubectl_expose/) - Take a replication controller,
  service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](/docs/reference/kubectl/generated/kubectl_get/) - Display one or many resources
* [kubectl kustomize](/docs/reference/kubectl/generated/kubectl_kustomize/) - Build a kustomization
  target from a directory or a remote url.
* [kubectl label](/docs/reference/kubectl/generated/kubectl_label/) - Update the labels on a resource
* [kubectl logs](/docs/reference/kubectl/generated/kubectl_logs/) - Print the logs for a container in a pod
* [kubectl options](/docs/reference/kubectl/generated/kubectl_options/) - Print the list of flags inherited by all commands
* [kubectl patch](/docs/reference/kubectl/generated/kubectl_patch/) - Update field(s) of a resource
* [kubectl plugin](/docs/reference/kubectl/generated/kubectl_plugin/) - Provides utilities for interacting with plugins.
* [kubectl port-forward](/docs/reference/kubectl/generated/kubectl_port-forward/) - Forward one or more local ports to a pod
* [kubectl proxy](/docs/reference/kubectl/generated/kubectl_proxy/) - Run a proxy to the Kubernetes API server
* [kubectl replace](/docs/reference/kubectl/generated/kubectl_replace/) - Replace a resource by filename or stdin
* [kubectl rollout](/docs/reference/kubectl/generated/kubectl_rollout/) - Manage the rollout of a resource
* [kubectl run](/docs/reference/kubectl/generated/kubectl_run/) - Run a particular image on the cluster
* [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/) - Set a new size for a Deployment, ReplicaSet or Replication Controller
* [kubectl set](/docs/reference/kubectl/generated/kubectl_set/) - Set specific features on objects
* [kubectl taint](/docs/reference/kubectl/generated/kubectl_taint/) - Update the taints on one or more nodes
* [kubectl top](/docs/reference/kubectl/generated/kubectl_top/) - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](/docs/reference/kubectl/generated/kubectl_uncordon/) - Mark node as schedulable
* [kubectl version](/docs/reference/kubectl/generated/kubectl_version/) - Print the client and server version information
* [kubectl wait](/docs/reference/kubectl/generated/kubectl_wait/) - Experimental: Wait for a specific condition on one or many resources.
