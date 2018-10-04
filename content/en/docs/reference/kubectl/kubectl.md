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
      <td colspan="2">--allow-verification-with-non-compliant-keys</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Allow a SignatureVerifier to use keys which are technically non-compliant with RFC6962.</td>
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
      <td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/Users/zarnold/.kube/http-cache"</td>
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
* [kubectl alpha](kubectl_alpha.md)	 - Commands for features in alpha
* [kubectl annotate](kubectl_annotate.md)	 - Update the annotations on a resource
* [kubectl api-resources](kubectl_api-resources.md)	 - Print the supported API resources on the server
* [kubectl api-versions](kubectl_api-versions.md)	 - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](kubectl_apply.md)	 - Apply a configuration to a resource by filename or stdin
* [kubectl attach](kubectl_attach.md)	 - Attach to a running container
* [kubectl auth](kubectl_auth.md)	 - Inspect authorization
* [kubectl autoscale](kubectl_autoscale.md)	 - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](kubectl_certificate.md)	 - Modify certificate resources.
* [kubectl cluster-info](kubectl_cluster-info.md)	 - Display cluster info
* [kubectl completion](kubectl_completion.md)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](kubectl_config.md)	 - Modify kubeconfig files
* [kubectl convert](kubectl_convert.md)	 - Convert config files between different API versions
* [kubectl cordon](kubectl_cordon.md)	 - Mark node as unschedulable
* [kubectl cp](kubectl_cp.md)	 - Copy files and directories to and from containers.
* [kubectl create](kubectl_create.md)	 - Create a resource from a file or from stdin.
* [kubectl delete](kubectl_delete.md)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubectl describe](kubectl_describe.md)	 - Show details of a specific resource or group of resources
* [kubectl drain](kubectl_drain.md)	 - Drain node in preparation for maintenance
* [kubectl edit](kubectl_edit.md)	 - Edit a resource on the server
* [kubectl exec](kubectl_exec.md)	 - Execute a command in a container
* [kubectl explain](kubectl_explain.md)	 - Documentation of resources
* [kubectl expose](kubectl_expose.md)	 - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](kubectl_get.md)	 - Display one or many resources
* [kubectl label](kubectl_label.md)	 - Update the labels on a resource
* [kubectl logs](kubectl_logs.md)	 - Print the logs for a container in a pod
* [kubectl options](kubectl_options.md)	 - Print the list of flags inherited by all commands
* [kubectl patch](kubectl_patch.md)	 - Update field(s) of a resource using strategic merge patch
* [kubectl plugin](kubectl_plugin.md)	 - Provides utilities for interacting with plugins.
* [kubectl port-forward](kubectl_port-forward.md)	 - Forward one or more local ports to a pod
* [kubectl proxy](kubectl_proxy.md)	 - Run a proxy to the Kubernetes API server
* [kubectl replace](kubectl_replace.md)	 - Replace a resource by filename or stdin
* [kubectl rollout](kubectl_rollout.md)	 - Manage the rollout of a resource
* [kubectl run](kubectl_run.md)	 - Run a particular image on the cluster
* [kubectl scale](kubectl_scale.md)	 - Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job
* [kubectl set](kubectl_set.md)	 - Set specific features on objects
* [kubectl taint](kubectl_taint.md)	 - Update the taints on one or more nodes
* [kubectl top](kubectl_top.md)	 - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](kubectl_uncordon.md)	 - Mark node as schedulable
* [kubectl version](kubectl_version.md)	 - Print the client and server version information
* [kubectl wait](kubectl_wait.md)	 - Experimental: Wait for a specific condition on one or many resources.

