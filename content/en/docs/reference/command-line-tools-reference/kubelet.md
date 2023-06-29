---
title: kubelet
content_type: tool-reference
weight: 20
---

## {{% heading "synopsis" %}}

The kubelet is the primary "node agent" that runs on each node. It can
register the node with the apiserver using one of: the hostname; a flag to
override the hostname; or specific logic for a cloud provider.

The kubelet works in terms of a PodSpec. A PodSpec is a YAML or JSON object
that describes a pod. The kubelet takes a set of PodSpecs that are provided
through various mechanisms (primarily through the apiserver) and ensures that
the containers described in those PodSpecs are running and healthy. The
kubelet doesn't manage containers which were not created by Kubernetes.

Other than from a PodSpec from the apiserver, there are two ways that a
container manifest can be provided to the Kubelet.

- File: Path passed as a flag on the command line. Files under this path will be
  monitored periodically for updates. The monitoring period is 20s by default
  and is configurable via a flag.
- HTTP endpoint: HTTP endpoint passed as a parameter on the command line. This
  endpoint is checked every 20 seconds (also configurable with a flag).

```
kubelet [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0 </td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address for the Kubelet to serve on (set to <code>0.0.0.0</code> or <code>::</code> for listening in all interfaces and IP families)  (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--allowed-unsafe-sysctls strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated whitelist of unsafe sysctls or unsafe sysctl patterns (ending in <code>&ast;</code>). Use these at your own risk. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Enables anonymous requests to the Kubelet server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of <code>system:anonymous</code>, and a group name of <code>system:unauthenticated</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Use the <code>TokenReview</code> API to determine authentication for bearer tokens. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>2m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache responses from the webhook token authenticator. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--authorization-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>AlwaysAllow</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Authorization mode for Kubelet server. Valid options are AlwaysAllow or Webhook. Webhook mode uses the SubjectAccessReview API to determine authorization. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>5m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'authorized' responses from the webhook authorizer. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>30s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'unauthorized' responses from the webhook authorizer. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
</tr>

<tr>
<td colspan="2">--bootstrap-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeconfig file that will be used to get client certificate for kubelet. If the file specified by <code>--kubeconfig</code> does not exist, the bootstrap kubeconfig is used to request a client certificate from the API server. On success, a kubeconfig file referencing the generated client certificate and key is written to the path specified by <code>--kubeconfig</code>. The client certificate and key file will be stored in the directory pointed by <code>--cert-dir</code>.</td>
</tr>

<tr>
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>/var/lib/kubelet/pki</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The directory where the TLS certs are located. If <code>--tls-cert-file</code> and <code>--tls-private-key-file</code> are provided, this flag will be ignored.</td>
</tr>

<tr>
<td colspan="2">--cgroup-driver string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>cgroupfs</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Driver that the kubelet uses to manipulate cgroups on the host.  Possible values: <code>cgroupfs</code>, <code>systemd</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--cgroup-root string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>''</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Optional root cgroup to use for pods. This is handled by the container runtime on a best effort basis. Default: '', which means use the container runtime default. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--cgroups-per-qos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Enable creation of QoS cgroup hierarchy, if true top level QoS and pod cgroups are created. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the <code>CommonName</code> of the client certificate. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--cloud-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the cloud provider configuration file. Empty string for no configuration file. (DEPRECATED: will be removed in 1.24 or later, in favor of removing cloud providers code from kubelet.)</td>
</tr>

<tr>
<td colspan="2">--cloud-provider string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The provider for cloud services. Set to empty string for running with no cloud provider. If set, the cloud provider determines the name of the node (consult cloud provider documentation to determine if and how the hostname is used). (DEPRECATED: will be removed in 1.24 or later, in favor of removing cloud provider code from Kubelet.)</td>
</tr>

<tr>
<td colspan="2">--cluster-dns strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of DNS server IP address. This value is used for containers DNS server in case of Pods with "dnsPolicy=ClusterFirst".<br/><B>Note:</B> all DNS servers appearing in the list MUST serve the same set of records otherwise name resolution within the cluster may not work correctly. There is no guarantee as to which DNS server may be contacted for name resolution. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--cluster-domain string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Domain for this cluster. If set, kubelet will configure all containers to search this domain in addition to the host's search domains (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The Kubelet will load its initial configuration from this file. The path may be absolute or relative; relative paths start at the Kubelet's current working directory. Omit this flag to use the built-in default configuration values. Command-line flags override configuration from this file.</td>
</tr>

<tr>
<td colspan="2">--container-log-max-files int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">&lt;Warning: Beta feature&gt; Set the maximum number of container log files that can be present for a container. The number must be &gt;= 2. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--container-log-max-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>10Mi</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">&lt;Warning: Beta feature&gt; Set the maximum size (e.g. <code>10Mi</code>) of container log file before it is rotated.  (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--container-runtime-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The endpoint of remote runtime service. Unix Domain Sockets are supported on Linux, while npipe and tcp endpoints are supported on windows. Examples: <code>unix:///path/to/runtime.sock</code>, <code>npipe:////./pipe/runtime</code>.</td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Enable block profiling, if profiling is enabled (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--cpu-cfs-quota&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Enable CPU CFS quota enforcement for containers that specify CPU limits (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--cpu-cfs-quota-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>100ms</code></td>
   </tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Sets CPU CFS quota period value, <code>cpu.cfs_period_us</code>, defaults to Linux Kernel default. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>none</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">CPU Manager policy to use. Possible values: <code>none</code>, <code>static</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-policy-options string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value CPU Manager policy options to use, to fine tune their behaviour. If not supplied, keep the default behaviour. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-reconcile-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>10s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">&lt;Warning: Alpha feature&gt; CPU Manager reconciliation period. Examples: <code>10s</code>, or <code>1m</code>. If not supplied, defaults to node status update frequency. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--enable-controller-attach-detach&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Enables the Attach/Detach controller to manage attachment/detachment of volumes scheduled to this node, and disables kubelet from executing any attach/detach operations. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--enable-debugging-handlers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Enables server endpoints for log collection and local running of containers and commands. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--enable-server&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Enable the Kubelet's server. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--enforce-node-allocatable strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>pods</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A comma separated list of levels of node allocatable enforcement to be enforced by kubelet. Acceptable options are <code>none</code>, <code>pods</code>, <code>system-reserved</code>, and <code>kube-reserved</code>. If the latter two options are specified, <code>--system-reserved-cgroup</code> and <code>--kube-reserved-cgroup</code> must also be set, respectively. If <code>none</code> is specified, no additional options should be set. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/">here</a> for more details. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--event-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum size of a bursty event records, temporarily allows event records to burst to this number, while still not exceeding <code>--event-qps</code>. The number must be &gt;= 0. If 0 will use default burst (100). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--event-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">QPS to limit event creations. The number must be &gt;= 0. If 0 will use default QPS (50). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--eviction-hard strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>imagefs.available<15%,memory.available<100Mi,nodefs.available<10%</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of eviction thresholds (e.g. <code>memory.available<1Gi</code>) that if met would trigger a pod eviction. On a Linux node, the default value also includes <code>nodefs.inodesFree<5%</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--eviction-max-pod-grace-period int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"> Maximum allowed grace period (in seconds) to use when terminating pods in response to a soft eviction threshold being met. If negative, defer to pod specified value. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--eviction-minimum-reclaim string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of minimum reclaims (e.g. <code>imagefs.available=2Gi</code>) that describes the minimum amount of resource the kubelet will reclaim when performing a pod eviction if that resource is under pressure. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--eviction-pressure-transition-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>5m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Duration for which the kubelet has to wait before transitioning out of an eviction pressure condition. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--eviction-soft string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of eviction thresholds (e.g. <code>memory.available<1.5Gi</code>) that if met over a corresponding grace period would trigger a pod eviction. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--eviction-soft-grace-period string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of eviction grace periods (e.g. <code>memory.available=1m30s</code>) that correspond to how long a soft eviction threshold must hold before triggering a pod eviction. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--exit-on-lock-contention</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Whether kubelet should exit upon lock-file contention.</td>
</tr>

<tr>
<td colspan="2">--experimental-allocatable-ignore-eviction&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>false</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">When set to <code>true</code>, hard eviction thresholds will be ignored while calculating node allocatable. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/">here</a> for more details. (DEPRECATED: will be removed in 1.24 or later)</td>
</tr>

<tr>
<td colspan="2">--experimental-mounter-path string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>mount</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">[Experimental] Path of mounter binary. Leave empty to use the default <code>mount</code>. (DEPRECATED: will be removed in 1.24 or later, in favor of using CSI.)</td>
</tr>

<tr>
<td colspan="2">--fail-swap-on&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Makes the Kubelet fail to start if swap is enabled on the node. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;A list of 'key=true/false' pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of <code>key=value</code> pairs that describe feature gates for alpha/experimental features. Options are:<br/>
APIListChunking=true|false (BETA - default=true)<br/>
APIPriorityAndFairness=true|false (BETA - default=true)<br/>
APIResponseCompression=true|false (BETA - default=true)<br/>
APISelfSubjectReview=true|false (ALPHA - default=false)<br/>
APIServerIdentity=true|false (BETA - default=true)<br/>
APIServerTracing=true|false (ALPHA - default=false)<br/>
AggregatedDiscoveryEndpoint=true|false (ALPHA - default=false)<br/>
AllAlpha=true|false (ALPHA - default=false)<br/>
AllBeta=true|false (BETA - default=false)<br/>
AnyVolumeDataSource=true|false (BETA - default=true)<br/>
AppArmor=true|false (BETA - default=true)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
CSIMigrationPortworx=true|false (BETA - default=false)<br/>
CSIMigrationRBD=true|false (ALPHA - default=false)<br/>
CSINodeExpandSecret=true|false (BETA - default=true)<br/>
CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
ComponentSLIs=true|false (ALPHA - default=false)<br/>
ContainerCheckpoint=true|false (ALPHA - default=false)<br/>
ContextualLogging=true|false (ALPHA - default=false)<br/>
CronJobTimeZone=true|false (BETA - default=true)<br/>
CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
CustomResourceValidationExpressions=true|false (BETA - default=true)<br/>
DisableCloudProviders=true|false (ALPHA - default=false)<br/>
DisableKubeletCloudCredentialProviders=true|false (ALPHA - default=false)<br/>
DownwardAPIHugePages=true|false (BETA - default=true)<br/>
DynamicResourceAllocation=true|false (ALPHA - default=false)<br/>
EventedPLEG=true|false (ALPHA - default=false)<br/>
ExpandedDNSConfig=true|false (BETA - default=true)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>
GRPCContainerProbe=true|false (BETA - default=true)<br/>
GracefulNodeShutdown=true|false (BETA - default=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
HPAContainerMetrics=true|false (ALPHA - default=false)<br/>
HPAScaleToZero=true|false (ALPHA - default=false)<br/>
HonorPVReclaimPolicy=true|false (ALPHA - default=false)<br/>
IPTablesOwnershipCleanup=true|false (ALPHA - default=false)<br/>
InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginRBDUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>
JobMutableNodeSchedulingDirectives=true|false (BETA - default=true)<br/>
JobPodFailurePolicy=true|false (BETA - default=true)<br/>
JobReadyPods=true|false (BETA - default=true)<br/>
KMSv2=true|false (ALPHA - default=false)<br/>
KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
KubeletPodResources=true|false (BETA - default=true)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - default=true)<br/>
KubeletTracing=true|false (ALPHA - default=false)<br/>
LegacyServiceAccountTokenTracking=true|false (ALPHA - default=false)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>
LogarithmicScaleDown=true|false (BETA - default=true)<br/>
LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
LoggingBetaOptions=true|false (BETA - default=true)<br/>
MatchLabelKeysInPodTopologySpread=true|false (ALPHA - default=false)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
MemoryManager=true|false (BETA - default=true)<br/>
MemoryQoS=true|false (ALPHA - default=false)<br/>
MinDomainsInPodTopologySpread=true|false (BETA - default=false)<br/>
MinimizeIPTablesRestore=true|false (ALPHA - default=false)<br/>
MultiCIDRRangeAllocator=true|false (ALPHA - default=false)<br/>
NetworkPolicyStatus=true|false (ALPHA - default=false)<br/>
NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>
NodeOutOfServiceVolumeDetach=true|false (BETA - default=true)<br/>
NodeSwap=true|false (ALPHA - default=false)<br/>
OpenAPIEnums=true|false (BETA - default=true)<br/>
OpenAPIV3=true|false (BETA - default=true)<br/>
PDBUnhealthyPodEvictionPolicy=true|false (ALPHA - default=false)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
PodDeletionCost=true|false (BETA - default=true)<br/>
PodDisruptionConditions=true|false (BETA - default=true)<br/>
PodHasNetworkCondition=true|false (ALPHA - default=false)<br/>
PodSchedulingReadiness=true|false (ALPHA - default=false)<br/>
ProbeTerminationGracePeriod=true|false (BETA - default=true)<br/>
ProcMountType=true|false (ALPHA - default=false)<br/>
ProxyTerminatingEndpoints=true|false (BETA - default=true)<br/>
QOSReserved=true|false (ALPHA - default=false)<br/>
ReadWriteOncePod=true|false (ALPHA - default=false)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>
RemainingItemCount=true|false (BETA - default=true)<br/>
RetroactiveDefaultStorageClass=true|false (BETA - default=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
SELinuxMountReadWriteOncePod=true|false (ALPHA - default=false)<br/>
SeccompDefault=true|false (BETA - default=true)<br/>
ServerSideFieldValidation=true|false (BETA - default=true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>
StatefulSetAutoDeletePVC=true|false (ALPHA - default=false)<br/>
StatefulSetStartOrdinal=true|false (ALPHA - default=false)<br/>
StorageVersionAPI=true|false (ALPHA - default=false)<br/>
StorageVersionHash=true|false (BETA - default=true)<br/>
TopologyAwareHints=true|false (BETA - default=true)<br/>
TopologyManager=true|false (BETA - default=true)<br/>
TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
TopologyManagerPolicyBetaOptions=true|false (BETA - default=false)<br/>
TopologyManagerPolicyOptions=true|false (ALPHA - default=false)<br/>
UserNamespacesStatelessPodsSupport=true|false (ALPHA - default=false)<br/>
ValidatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>
VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
WinDSR=true|false (ALPHA - default=false)<br/>
WinOverlay=true|false (BETA - default=true)<br/>
WindowsHostNetwork=true|false (ALPHA - default=true)<br/>
(DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--file-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>20s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Duration between checking config files for new data. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--hairpin-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>promiscuous-bridge</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">How should the kubelet setup hairpin NAT. This allows endpoints of a Service to load balance back to themselves if they should try to access their own Service. Valid values are <code>promiscuous-bridge</code>, <code>hairpin-veth</code> and <code>none</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>127.0.0.1</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address for the healthz server to serve on (set to <code>0.0.0.0</code> or <code>::</code> for listening in all interfaces and IP families). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10248</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The port of the localhost healthz endpoint (set to <code>0</code> to disable). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for kubelet</td>
</tr>

<tr>
<td colspan="2">--hostname-override string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, will use this string as identification instead of the actual hostname. If <code>--cloud-provider</code> is set, the cloud provider determines the name of the node (consult cloud provider documentation to determine if and how the hostname is used).</td>
</tr>

<tr>
<td colspan="2">--http-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>20s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Duration between checking HTTP for new data. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--image-credential-provider-bin-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the directory where credential provider plugin binaries are located.</td>
</tr>

<tr>
<td colspan="2">--image-credential-provider-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the credential provider plugin config file.</td>
</tr>

<tr>
<td colspan="2">--image-gc-high-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 85</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The percent of disk usage after which image garbage collection is always run. Values must be within the range [0, 100], To disable image garbage collection, set to 100.   (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--image-gc-low-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 80</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. Values must be within the range [0, 100] and should not be larger than that of <code>--image-gc-high-threshold</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--image-service-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">[Experimental] The endpoint of remote image service. If not specified, it will be the same with <code>--container-runtime-endpoint</code> by default. Unix Domain Socket are supported on Linux, while npipe and TCP endpoints are supported on Windows.  Examples: <code>unix:///var/run/dockershim.sock</code>, <code>npipe:////./pipe/dockershim</code></td>
</tr>

<tr>
<td colspan="2">--iptables-drop-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The bit of the <code>fwmark</code> space to mark packets for dropping. Must be within the range [0, 31]. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The bit of the <code>fwmark</code> space to mark packets for SNAT. Must be within the range [0, 31]. Please match this parameter with corresponding parameter in <code>kube-proxy</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--keep-terminated-pod-volumes</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Keep terminated pod volumes mounted to the node after the pod terminates. Can be useful for debugging volume related issues. (DEPRECATED: will be removed in a future version)</td>
</tr>

<tr>
<td colspan="2">--kernel-memcg-notification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If enabled, the kubelet will integrate with the kernel memcg notification to determine if memory eviction thresholds are crossed rather than polling. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Burst to use while talking with kubernetes API server. The number must be >= 0. If 0 will use default burst (100). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>application/vnd.kubernetes.protobuf</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Content type of requests sent to apiserver. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">QPS to use while talking with kubernetes API server. The number must be &gt;= 0. If 0 will use default QPS (50). Doesn't cover events and node heartbeat apis which rate limiting is controlled by a different set of flags. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--kube-reserved string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: &lt;None&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of <code>&lt;resource name&gt;=&lt;resource quantity&gt;</code> (e.g. <code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>) pairs that describe resources reserved for kubernetes system components. Currently <code>cpu</code>, <code>memory</code> and local <code>ephemeral-storage</code> for root file system are supported. See <a href="http://kubernetes.io/docs/user-guide/compute-resources">here</a> for more detail. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--kube-reserved-cgroup string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>''</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Absolute name of the top level cgroup that is used to manage kubernetes components for which compute resources were reserved via <code>--kube-reserved</code> flag. Ex. <code>/kube-reserved</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeconfig file, specifying how to connect to the API server. Providing <code>--kubeconfig</code> enables API server mode, omitting <code>--kubeconfig</code> enables standalone mode. </td>
</tr>

<tr>
<td colspan="2">--kubelet-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Optional absolute name of cgroups to create and run the Kubelet in. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--local-storage-capacity-isolation&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If true, local ephemeral storage isolation is enabled. Otherwise, local storage isolation feature will be disabled. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)</td>
</tr>

<tr>
<td colspan="2">--lock-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">&lt;Warning: Alpha feature&gt; The path to file for kubelet to use as a lock file.</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>5s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes.</td>
</tr>

<tr>
<td colspan="2">--log-json-info-buffer-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>'0'</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">[Alpha] In JSON format with split output streams, the info messages can be buffered for a while to increase performance. The default value of zero bytes disables buffering. The size can be specified as number of bytes (512), multiples of 1000 (1K), multiples of 1024 (2Ki), or powers of those (3M, 4G, 5Mi, 6Gi). Enable the <code>LoggingAlphaOptions</code> feature gate to use this. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--log-json-split-stream</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">[Alpha] In JSON format, write error messages to stderr and info messages to stdout. The default is to write a single stream to stdout. Enable the <code>LoggingAlphaOptions</code> feature gate to use this. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>text</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Sets the log format. Permitted formats: <code>text</code>, <code>json</code> (gated by <code>LoggingBetaOptions</code>). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--make-iptables-util-chains&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If true, kubelet will ensure <code>iptables</code> utility rules are present on host. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--manifest-url string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">URL for accessing additional Pod specifications to run (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--manifest-url-header string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of HTTP headers to use when accessing the URL provided to <code>--manifest-url</code>. Multiple headers with the same name will be added in the same order provided. This flag can be repeatedly invoked. For example: <code>--manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'</code> (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--max-open-files int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1000000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Number of files that can be opened by Kubelet process. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--max-pods int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 110</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Number of Pods that can run on this Kubelet. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--maximum-dead-containers int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of old instances of containers to retain globally. Each container takes up some disk space. To disable, set to a negative number. (DEPRECATED: Use <code>--eviction-hard</code> or <code>--eviction-soft</code> instead. Will be removed in a future version.)</td>
</tr>

 <tr>
<td colspan="2">--maximum-dead-containers-per-container int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of old instances to retain per container.  Each container takes up some disk space. (DEPRECATED: Use <code>--eviction-hard</code> or <code>--eviction-soft</code> instead. Will be removed in a future version.)</td>
</tr>

<tr>
<td colspan="2">--memory-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>None</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Memory Manager policy to use. Possible values: <code>'None'</code>, <code>'Static'</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--minimum-container-ttl-duration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Minimum age for a finished container before it is garbage collected. Examples: <code>'300ms'</code>, <code>'10s'</code> or <code>'2h45m'</code> (DEPRECATED: Use <code>--eviction-hard</code> or <code>--eviction-soft</code> instead. Will be removed in a future version.)</td>
</tr>

<tr>
<td colspan="2">--minimum-image-ttl-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>2m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Minimum age for an unused image before it is garbage collected. Examples: <code>'300ms'</code>, <code>'10s'</code> or <code>'2h45m'</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--node-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">IP address (or comma-separated dual-stack IP addresses) of the node. If unset, kubelet will use the node's default IPv4 address, if any, or its default IPv6 address if it has no IPv4 addresses. You can pass <code>'::'</code> to make it prefer the default IPv6 address rather than the default IPv4 address.</td>
</tr>

<tr>
<td colspan="2">--node-labels &lt;key=value pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">&lt;Warning: Alpha feature&gt;Labels to add when registering the node in the cluster. Labels must be <code>key=value pairs</code> separated by <code>','</code>. Labels in the <code>'kubernetes.io'</code> namespace must begin with an allowed prefix (<code>'kubelet.kubernetes.io'</code>, <code>'node.kubernetes.io'</code>) or be in the specifically allowed set (<code>'beta.kubernetes.io/arch'</code>, <code>'beta.kubernetes.io/instance-type'</code>, <code>'beta.kubernetes.io/os'</code>, <code>'failure-domain.beta.kubernetes.io/region'</code>, <code>'failure-domain.beta.kubernetes.io/zone'</code>, <code>'kubernetes.io/arch'</code>, <code>'kubernetes.io/hostname'</code>, <code>'kubernetes.io/os'</code>, <code>'node.kubernetes.io/instance-type'</code>, <code>'topology.kubernetes.io/region'</code>, <code>'topology.kubernetes.io/zone'</code>)</td>
</tr>

<tr>
<td colspan="2">--node-status-max-images int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum number of images to report in <code>node.status.images</code>. If <code>-1</code> is specified, no cap will be applied. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--node-status-update-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>10s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Specifies how often kubelet posts node status to master. Note: be cautious when changing the constant, it must work with <code>nodeMonitorGracePeriod</code> in Node controller. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -999</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The <code>oom-score-adj</code> value for kubelet process. Values must be within the range [-1000, 1000]. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--pod-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The CIDR to use for pod IP addresses, only used in standalone mode. In cluster mode, this is obtained from the master. For IPv6, the maximum number of IP's allocated is 65536 (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--pod-infra-container-image string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>registry.k8s.io/pause:3.9</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Specified image will not be pruned by the image garbage collector. CRI implementations have their own configuration to set this image. (DEPRECATED: will be removed in 1.27. Image garbage collector will get sandbox image information from CRI.)</td>
</tr>

<tr>
<td colspan="2">--pod-manifest-path string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the directory containing static pod files to run, or the path to a single static pod file. Files starting with dots will be ignored. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--pod-max-pids int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Set the maximum number of processes per pod. If <code>-1</code>, the kubelet defaults to the node allocatable PID capacity. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--pods-per-core int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Number of Pods per core that can run on this kubelet. The total number of pods on this kubelet cannot exceed <code>--max-pods</code>, so <code>--max-pods</code> will be used if this calculation results in a larger number of pods allowed on the kubelet. A value of <code>0</code> disables this limit. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10250</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The port for the kubelet to serve on. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--protect-kernel-defaults</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Default kubelet behaviour for kernel tuning. If set, kubelet errors if any of kernel tunables is different than kubelet defaults. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--provider-id string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Unique identifier for identifying the node in a machine database, i.e cloud provider. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--qos-reserved string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">&lt;Warning: Alpha feature&gt; A set of <code>&lt;resource name&gt;=&lt;percentage&gt;</code> (e.g. <code>memory=50%</code>) pairs that describe how pod resource requests are reserved at the QoS level. Currently only <code>memory</code> is supported. Requires the <code>QOSReserved</code> feature gate to be enabled. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--read-only-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10255</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The read-only port for the kubelet to serve on with no authentication/authorization (set to <code>0</code> to disable). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--register-node&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Register the node with the API server. If <code>--kubeconfig</code> is not provided, this flag is irrelevant, as the Kubelet won't have an API server to register with. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--register-schedulable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Register the node as schedulable. Won't have any effect if <code>--register-node</code> is <code>false</code>. (DEPRECATED: will be removed in a future version)</td>
  </tr>

<tr>
<td colspan="2">--register-with-taints string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Register the node with the given list of taints (comma separated <code>&lt;key&gt;=&lt;value&gt;:&lt;effect&gt;</code>). No-op if <code>--register-node</code> is <code>false</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--registry-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum size of a bursty pulls, temporarily allows pulls to burst to this number, while still not exceeding <code>--registry-qps</code>. Only used if <code>--registry-qps</code> is greater than 0. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--registry-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If &gt; 0, limit registry pull QPS to this value.  If <code>0</code>, unlimited. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--reserved-cpus string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A comma-separated list of CPUs or CPU ranges that are reserved for system and kubernetes usage. This specific list will supersede cpu counts in <code>--system-reserved</code> and <code>--kube-reserved</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--reserved-memory string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A comma-separated list of memory reservations for NUMA nodes. (e.g. <code>--reserved-memory 0:memory=1Gi,hugepages-1M=2Gi --reserved-memory 1:memory=2Gi</code>). The total sum for each memory type should be equal to the sum of <code>--kube-reserved</code>, <code>--system-reserved</code> and <code>--eviction-threshold</code>. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#reserved-memory-flag">here</a> for more details. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--resolv-conf string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>/etc/resolv.conf</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Resolver configuration file used as the basis for the container DNS resolution configuration. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--root-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>/var/lib/kubelet</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Directory path for managing kubelet files (volume mounts, etc).</td>
</tr>

<tr>
<td colspan="2">--rotate-certificates</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Auto rotate the kubelet client certificates by requesting new certificates from the <code>kube-apiserver</code> when the certificate expiration approaches. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--rotate-server-certificates</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">&lt;Warning: Beta feature&gt; Auto-request and rotate the kubelet serving certificates by requesting new certificates from the <code>kube-apiserver</code> when the certificate expiration approaches. Requires the <code>RotateKubeletServerCertificate</code> feature gate to be enabled, and approval of the submitted <code>CertificateSigningRequest</code> objects. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--runonce</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">If <code>true</code>, exit after spawning pods from local manifests or remote urls. Exclusive with <code>--enable-server</code> (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--runtime-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Optional absolute name of cgroups to create and run the runtime in.</td>
</tr>

<tr>
<td colspan="2">--runtime-request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>2m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Timeout of all runtime requests except long running request - <code>pull</code>, <code>logs</code>, <code>exec</code> and <code>attach</code>. When timeout exceeded, kubelet will cancel the request, throw out an error and retry later. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--seccomp-default&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>false</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">&lt;Warning: Beta feature&gt; Enable the use of <code>RuntimeDefault</code> as the default seccomp profile for all workloads. The <code>SeccompDefault</code> feature gate must be enabled to allow this flag.</td>
</tr>

<tr>
<td colspan="2">--serialize-image-pulls&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Pull images one at a time. We recommend *not* changing the default value on nodes that run docker daemon with version &lt; 1.9 or an <code>aufs</code> storage backend. Issue #10959 has more details. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--streaming-connection-idle-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>4h0m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum time a streaming connection can be idle before the connection is automatically closed. <code>0</code> indicates no timeout. Example: <code>5m</code>. Note: All connections to the kubelet server have a maximum duration of 4 hours.  (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--sync-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>1m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Max period between synchronizing running containers and config. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--system-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Optional absolute name of cgroups in which to place all non-kernel processes that are not already inside a cgroup under <code>'/'</code>. Empty for no container. Rolling back the flag requires a reboot. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--system-reserved string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: &lt;none&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of <code>&lt;resource name&gt;=&lt;resource quantity&gt;</code> (e.g. <code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>) pairs that describe resources reserved for non-kubernetes components. Currently only <code>cpu</code> and <code>memory</code> and local ephemeral storage for root file system are supported. See <a href="http://kubernetes.io/docs/user-guide/compute-resources">here</a> for more detail. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--system-reserved-cgroup string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>''</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Absolute name of the top level cgroup that is used to manage non-kubernetes components for which compute resources were reserved via <code>--system-reserved</code> flag. Ex. <code>/system-reserved</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">File containing x509 Certificate used for serving HTTPS (with intermediate certs, if any, concatenated after server cert). If <code>--tls-cert-file</code> and <code>--tls-private-key-file</code> are not provided, a self-signed certificate and key are generated for the public address and saved to the directory passed to <code>--cert-dir</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>
Preferred values:
<code>TLS_AES_128_GCM_SHA256</code>, <code>TLS_AES_256_GCM_SHA384</code>, <code>TLS_CHACHA20_POLY1305_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384</code>, <code>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305</code>, <code>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384</code>, <code>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305</code>, <code>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256</code>, <code>TLS_RSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_RSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_256_GCM_SHA384</code><br/>
Insecure values:
<code>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_RC4_128_SHA</code>, <code>TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_RC4_128_SHA</code>, <code>TLS_RSA_WITH_3DES_EDE_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_RSA_WITH_RC4_128_SHA</code>.<br/>
(DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Minimum TLS version supported. Possible values: <code>VersionTLS10</code>, <code>VersionTLS11</code>, <code>VersionTLS12</code>, <code>VersionTLS13</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">File containing x509 private key matching <code>--tls-cert-file</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>


<tr>
<td colspan="2">--topology-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>'none'</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Topology Manager policy to use. Possible values: <code>'none'</code>, <code>'best-effort'</code>, <code>'restricted'</code>, <code>'single-numa-node'</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--topology-manager-policy-options string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value Topology Manager policy options to use, to fine tune their behaviour. If not supplied, keep the default behaviour. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--topology-manager-scope string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>container</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Scope to which topology hints are applied. Topology Manager collects hints from Hint Providers and applies them to the defined scope to ensure the pod admission. Possible values: <code>'container'</code>, <code>'pod'</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Number for the log level verbosity</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td>
</tr>

<tr>
<td colspan="2">--vmodule &lt;A list of 'pattern=N' strings&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of <code>pattern=N</code> settings for file-filtered logging</td>
</tr>

<tr>
<td colspan="2">--volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>/usr/libexec/kubernetes/kubelet-plugins/volume/exec/</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The full path of the directory in which to search for additional third party volume plugins. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>

<tr>
<td colspan="2">--volume-stats-agg-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>1m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Specifies interval for kubelet to calculate and cache the volume disk usage for all pods and volumes. To disable volume calculations, set to <code>0</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
</tr>
</tbody>
</table>

