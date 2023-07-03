---
title: kube-proxy
content_type: tool-reference
weight: 30
auto_generated: true
---


<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->


## {{% heading "synopsis" %}}


The Kubernetes network proxy runs on each node. This
reflects services as defined in the Kubernetes API on each node and can do simple
TCP, UDP, and SCTP stream forwarding or round robin TCP, UDP, and SCTP forwarding across a set of backends.
Service cluster IPs and ports are currently found through Docker-links-compatible
environment variables specifying ports opened by the service proxy. There is an optional
addon that provides cluster DNS for these cluster IPs. The user must create a service
with the apiserver API to configure the proxy.

```
kube-proxy [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--add_dir_header</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, adds the file directory to the header of the log messages</p></td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>log to standard error as well as files (no effect when -logtostderr=true)</p></td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address for the proxy server to serve on (set to '0.0.0.0' for all IPv4 interfaces and '::' for all IPv6 interfaces). This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--bind-address-hard-fail</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true kube-proxy will treat failure to bind to a port as fatal and exit</p></td>
</tr>

<tr>
<td colspan="2">--boot_id_file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/proc/sys/kernel/random/boot_id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Comma-separated list of files to check for boot-id. Use the first one that exists.</p></td>
</tr>

<tr>
<td colspan="2">--cleanup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true cleanup iptables and ipvs rules and exit.</p></td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The CIDR range of pods in the cluster. When configured, traffic sent to a Service cluster IP from outside this range will be masqueraded and traffic sent from pods to an external LoadBalancer IP will be directed to the respective cluster IP instead. For dual-stack clusters, a comma-separated list is accepted with at least one CIDR per IP family (IPv4 and IPv6). This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The path to the configuration file.</p></td>
</tr>

<tr>
<td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>How often configuration from the apiserver is refreshed.  Must be greater than 0.</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 32768</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum number of NAT connections to track per CPU core (0 to leave the limit as-is and ignore conntrack-min).</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 131072</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Minimum number of conntrack entries to allocate, regardless of conntrack-max-per-core (set conntrack-max-per-core=0 to leave the limit as-is).</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>NAT timeout for TCP connections in the CLOSE_WAIT state</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Idle timeout for established TCP connections (0 to leave as-is)</p></td>
</tr>

<tr>
<td colspan="2">--detect-local-mode LocalMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Mode to use to detect local traffic. This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;comma-separated 'key=True|False' pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIPriorityAndFairness=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>APISelfSubjectReview=true|false (BETA - default=true)<br/>APIServerIdentity=true|false (BETA - default=true)<br/>APIServerTracing=true|false (BETA - default=true)<br/>AdmissionWebhookMatchConditions=true|false (ALPHA - default=false)<br/>AggregatedDiscoveryEndpoint=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AnyVolumeDataSource=true|false (BETA - default=true)<br/>AppArmor=true|false (BETA - default=true)<br/>CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>CSIMigrationPortworx=true|false (BETA - default=false)<br/>CSIMigrationRBD=true|false (ALPHA - default=false)<br/>CSINodeExpandSecret=true|false (BETA - default=true)<br/>CSIVolumeHealth=true|false (ALPHA - default=false)<br/>CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>CloudDualStackNodeIPs=true|false (ALPHA - default=false)<br/>ClusterTrustBundle=true|false (ALPHA - default=false)<br/>ComponentSLIs=true|false (BETA - default=true)<br/>ContainerCheckpoint=true|false (ALPHA - default=false)<br/>ContextualLogging=true|false (ALPHA - default=false)<br/>CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomResourceValidationExpressions=true|false (BETA - default=true)<br/>DisableCloudProviders=true|false (ALPHA - default=false)<br/>DisableKubeletCloudCredentialProviders=true|false (ALPHA - default=false)<br/>DynamicResourceAllocation=true|false (ALPHA - default=false)<br/>ElasticIndexedJob=true|false (BETA - default=true)<br/>EventedPLEG=true|false (BETA - default=false)<br/>ExpandedDNSConfig=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GracefulNodeShutdown=true|false (BETA - default=true)<br/>GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>HPAContainerMetrics=true|false (BETA - default=true)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HonorPVReclaimPolicy=true|false (ALPHA - default=false)<br/>IPTablesOwnershipCleanup=true|false (BETA - default=true)<br/>InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>InTreePluginRBDUnregister=true|false (ALPHA - default=false)<br/>InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>JobPodFailurePolicy=true|false (BETA - default=true)<br/>JobReadyPods=true|false (BETA - default=true)<br/>KMSv2=true|false (BETA - default=true)<br/>KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>KubeletPodResourcesGetAllocatable=true|false (BETA - default=true)<br/>KubeletTracing=true|false (BETA - default=true)<br/>LegacyServiceAccountTokenTracking=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>LogarithmicScaleDown=true|false (BETA - default=true)<br/>LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>LoggingBetaOptions=true|false (BETA - default=true)<br/>MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>MemoryManager=true|false (BETA - default=true)<br/>MemoryQoS=true|false (ALPHA - default=false)<br/>MinDomainsInPodTopologySpread=true|false (BETA - default=true)<br/>MinimizeIPTablesRestore=true|false (BETA - default=true)<br/>MultiCIDRRangeAllocator=true|false (ALPHA - default=false)<br/>MultiCIDRServiceAllocator=true|false (ALPHA - default=false)<br/>NetworkPolicyStatus=true|false (ALPHA - default=false)<br/>NewVolumeManagerReconstruction=true|false (BETA - default=true)<br/>NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>NodeLogQuery=true|false (ALPHA - default=false)<br/>NodeOutOfServiceVolumeDetach=true|false (BETA - default=true)<br/>NodeSwap=true|false (ALPHA - default=false)<br/>OpenAPIEnums=true|false (BETA - default=true)<br/>PDBUnhealthyPodEvictionPolicy=true|false (BETA - default=true)<br/>PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>PodDeletionCost=true|false (BETA - default=true)<br/>PodDisruptionConditions=true|false (BETA - default=true)<br/>PodHasNetworkCondition=true|false (ALPHA - default=false)<br/>PodSchedulingReadiness=true|false (BETA - default=true)<br/>ProbeTerminationGracePeriod=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>ProxyTerminatingEndpoints=true|false (BETA - default=true)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>ReadWriteOncePod=true|false (BETA - default=true)<br/>RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RetroactiveDefaultStorageClass=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>SecurityContextDeny=true|false (ALPHA - default=false)<br/>ServiceNodePortStaticSubrange=true|false (ALPHA - default=false)<br/>SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>StableLoadBalancerNodeSet=true|false (BETA - default=true)<br/>StatefulSetAutoDeletePVC=true|false (BETA - default=true)<br/>StatefulSetStartOrdinal=true|false (BETA - default=true)<br/>StorageVersionAPI=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>TopologyAwareHints=true|false (BETA - default=true)<br/>TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>TopologyManagerPolicyBetaOptions=true|false (BETA - default=false)<br/>TopologyManagerPolicyOptions=true|false (ALPHA - default=false)<br/>UserNamespacesStatelessPodsSupport=true|false (ALPHA - default=false)<br/>ValidatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>WatchList=true|false (ALPHA - default=false)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (BETA - default=true)<br/>WindowsHostNetwork=true|false (ALPHA - default=true)<br/>This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0:10256</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address with port for the health check server to serve on (set to '0.0.0.0:10256' for all IPv4 interfaces and '[::]:10256' for all IPv6 interfaces). Set empty to disable. This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for kube-proxy</p></td>
</tr>

<tr>
<td colspan="2">--hostname-override string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-empty, will use this string as identification instead of the actual hostname.</p></td>
</tr>

<tr>
<td colspan="2">--iptables-localhost-nodeports&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If false Kube-proxy will disable the legacy behavior of allowing NodePort services to be accessed via localhost, This only applies to iptables mode and ipv4.</p></td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If using the pure iptables proxy, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].</p></td>
</tr>

<tr>
<td colspan="2">--iptables-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The minimum interval of how often the iptables rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum interval of how often iptables rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-exclude-cidrs strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A comma-separated list of CIDR's which the ipvs proxier should not touch when cleaning up IPVS rules.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-min-sync-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The minimum interval of how often the ipvs rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-scheduler string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The ipvs scheduler type when proxy mode is ipvs</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-strict-arp</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Enable strict ARP by setting arp_ignore to 1 and arp_announce to 2</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum interval of how often ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-tcp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The timeout for idle IPVS TCP connections, 0 to leave as-is. (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-tcpfin-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The timeout for IPVS TCP connections after receiving a FIN packet, 0 to leave as-is. (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-udp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The timeout for IPVS UDP packets, 0 to leave as-is. (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Burst to use while talking with kubernetes apiserver</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Content type of requests sent to apiserver.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>QPS to use while talking with kubernetes apiserver</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to kubeconfig file with authorization information (the master location can be overridden by the master flag).</p></td>
</tr>

<tr>
<td colspan="2">--log_backtrace_at &lt;a string in the form 'file:N'&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>when logging hits line file:N, emit a stack trace</p></td>
</tr>

<tr>
<td colspan="2">--log_dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-empty, write log files in this directory (no effect when -logtostderr=true)</p></td>
</tr>

<tr>
<td colspan="2">--log_file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-empty, use this log file (no effect when -logtostderr=true)</p></td>
</tr>

<tr>
<td colspan="2">--log_file_max_size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Defines the maximum size a log file can grow to (no effect when -logtostderr=true). Unit is megabytes. If the value is 0, the maximum file size is unlimited.</p></td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>log to standard error instead of files</p></td>
</tr>

<tr>
<td colspan="2">--machine_id_file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/machine-id,/var/lib/dbus/machine-id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Comma-separated list of files to check for machine-id. Use the first one that exists.</p></td>
</tr>

<tr>
<td colspan="2">--masquerade-all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If using the pure iptables proxy, SNAT all traffic sent via Service cluster IPs (this not commonly needed)</p></td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The address of the Kubernetes API server (overrides any value in kubeconfig)</p></td>
</tr>

<tr>
<td colspan="2">--metrics-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 127.0.0.1:10249</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address with port for the metrics server to serve on (set to '0.0.0.0:10249' for all IPv4 interfaces and '[::]:10249' for all IPv6 interfaces). Set empty to disable. This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--nodeport-addresses strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A string slice of values which specify the addresses to use for NodePorts. Values may be valid IP blocks (e.g. 1.2.3.0/24, 1.2.3.4/32). The default empty string slice ([]) means to use all local addresses. This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--one_output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, only write logs to their native severity level (vs also writing to each lower severity level; no effect when -logtostderr=true)</p></td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -999</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The oom-score-adj value for kube-proxy process. Values must be within the range [-1000, 1000]. This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--pod-bridge-interface string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A bridge interface name in the cluster. Kube-proxy considers traffic as local if originating from an interface which matches the value. This argument should be set if DetectLocalMode is set to BridgeInterface.</p></td>
</tr>

<tr>
<td colspan="2">--pod-interface-name-prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>An interface prefix in the cluster. Kube-proxy considers traffic as local if originating from interfaces that match the given prefix. This argument should be set if DetectLocalMode is set to InterfaceNamePrefix.</p></td>
</tr>

<tr>
<td colspan="2">--profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true enables profiling via web interface on /debug/pprof handler. This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--proxy-mode ProxyMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Which proxy mode to use: on Linux this can be 'iptables' (default) or 'ipvs'. On Windows the only supported value is 'kernelspace'.This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--proxy-port-range port-range</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Range of host ports (beginPort-endPort, single port or beginPort+offset, inclusive) that may be consumed in order to proxy service traffic. If (unspecified, 0, or 0-0) then ports will be randomly chosen.</p></td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is &lt;major&gt;.&lt;minor&gt;, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that. This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--skip_headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, avoid header prefixes in the log messages</p></td>
</tr>

<tr>
<td colspan="2">--skip_log_headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, avoid headers when opening log files (no effect when -logtostderr=true)</p></td>
</tr>

<tr>
<td colspan="2">--stderrthreshold int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=false)</p></td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>number for the log level verbosity</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Print version information and quit</p></td>
</tr>

<tr>
<td colspan="2">--vmodule &lt;comma-separated 'pattern=N' settings&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>comma-separated list of pattern=N settings for file-filtered logging</p></td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, write the default configuration values to this file and exit.</p></td>
</tr>

</tbody>
</table>



