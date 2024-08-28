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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Overrides kube-proxy's idea of what its node's primary IP is. Note that the name is a historical artifact, and kube-proxy does not actually bind any sockets to this IP. This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--bind-address-hard-fail</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true kube-proxy will treat failure to bind to a port as fatal and exit</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The CIDR range of the pods in the cluster. (For dual-stack clusters, this can be a comma-separated dual-stack pair of CIDR ranges.). When --detect-local-mode is set to ClusterCIDR, kube-proxy will consider traffic to be local if its source IP is in this range. (Otherwise it is not used.) This parameter is ignored if a config file is specified by --config.</p></td>
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
<td colspan="2">--conntrack-tcp-be-liberal</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Enable liberal mode for tracking TCP packets by setting nf_conntrack_tcp_be_liberal to 1</p></td>
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
<td colspan="2">--conntrack-udp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Idle timeout for UNREPLIED UDP connections (0 to leave as-is)</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-udp-timeout-stream duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Idle timeout for ASSURED UDP connections (0 to leave as-is)</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIResponseCompression=true|false (BETA - default=true)<br/>APIServerIdentity=true|false (BETA - default=true)<br/>APIServerTracing=true|false (BETA - default=true)<br/>APIServingWithRoutine=true|false (ALPHA - default=false)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AnonymousAuthConfigurableEndpoints=true|false (ALPHA - default=false)<br/>AnyVolumeDataSource=true|false (BETA - default=true)<br/>AuthorizeNodeWithSelectors=true|false (ALPHA - default=false)<br/>AuthorizeWithSelectors=true|false (ALPHA - default=false)<br/>CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>CRDValidationRatcheting=true|false (BETA - default=true)<br/>CSIMigrationPortworx=true|false (BETA - default=true)<br/>CSIVolumeHealth=true|false (ALPHA - default=false)<br/>CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>ClusterTrustBundle=true|false (ALPHA - default=false)<br/>ClusterTrustBundleProjection=true|false (ALPHA - default=false)<br/>ComponentSLIs=true|false (BETA - default=true)<br/>ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>ConsistentListFromCache=true|false (BETA - default=true)<br/>ContainerCheckpoint=true|false (BETA - default=true)<br/>ContextualLogging=true|false (BETA - default=true)<br/>CoordinatedLeaderElection=true|false (ALPHA - default=false)<br/>CronJobsScheduledAnnotation=true|false (BETA - default=true)<br/>CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomResourceFieldSelectors=true|false (BETA - default=true)<br/>DRAControlPlaneController=true|false (ALPHA - default=false)<br/>DisableAllocatorDualWrite=true|false (ALPHA - default=false)<br/>DisableNodeKubeProxyVersion=true|false (BETA - default=true)<br/>DynamicResourceAllocation=true|false (ALPHA - default=false)<br/>EventedPLEG=true|false (ALPHA - default=false)<br/>GracefulNodeShutdown=true|false (BETA - default=true)<br/>GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HonorPVReclaimPolicy=true|false (BETA - default=true)<br/>ImageMaximumGCAge=true|false (BETA - default=true)<br/>ImageVolume=true|false (ALPHA - default=false)<br/>InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>InformerResourceVersion=true|false (ALPHA - default=false)<br/>JobBackoffLimitPerIndex=true|false (BETA - default=true)<br/>JobManagedBy=true|false (ALPHA - default=false)<br/>JobPodReplacementPolicy=true|false (BETA - default=true)<br/>JobSuccessPolicy=true|false (BETA - default=true)<br/>KubeletCgroupDriverFromCRI=true|false (BETA - default=true)<br/>KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>KubeletTracing=true|false (BETA - default=true)<br/>LoadBalancerIPMode=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>LoggingBetaOptions=true|false (BETA - default=true)<br/>MatchLabelKeysInPodAffinity=true|false (BETA - default=true)<br/>MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>MemoryManager=true|false (BETA - default=true)<br/>MemoryQoS=true|false (ALPHA - default=false)<br/>MultiCIDRServiceAllocator=true|false (BETA - default=false)<br/>MutatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>NFTablesProxyMode=true|false (BETA - default=true)<br/>NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>NodeLogQuery=true|false (BETA - default=false)<br/>NodeSwap=true|false (BETA - default=true)<br/>OpenAPIEnums=true|false (BETA - default=true)<br/>PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>PodDeletionCost=true|false (BETA - default=true)<br/>PodIndexLabel=true|false (BETA - default=true)<br/>PodLifecycleSleepAction=true|false (BETA - default=true)<br/>PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>PortForwardWebsockets=true|false (BETA - default=true)<br/>ProcMountType=true|false (BETA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>RecursiveReadOnlyMounts=true|false (BETA - default=true)<br/>RelaxedEnvironmentVariableValidation=true|false (ALPHA - default=false)<br/>ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>ResilientWatchCacheInitialization=true|false (BETA - default=true)<br/>ResourceHealthStatus=true|false (ALPHA - default=false)<br/>RetryGenerateName=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>SELinuxMount=true|false (ALPHA - default=false)<br/>SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>SchedulerQueueingHints=true|false (BETA - default=false)<br/>SeparateCacheWatchRPC=true|false (BETA - default=true)<br/>SeparateTaintEvictionController=true|false (BETA - default=true)<br/>ServiceAccountTokenJTI=true|false (BETA - default=true)<br/>ServiceAccountTokenNodeBinding=true|false (BETA - default=true)<br/>ServiceAccountTokenNodeBindingValidation=true|false (BETA - default=true)<br/>ServiceAccountTokenPodNodeInfo=true|false (BETA - default=true)<br/>ServiceTrafficDistribution=true|false (BETA - default=true)<br/>SidecarContainers=true|false (BETA - default=true)<br/>SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>StatefulSetAutoDeletePVC=true|false (BETA - default=true)<br/>StorageNamespaceIndex=true|false (BETA - default=true)<br/>StorageVersionAPI=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>StorageVersionMigrator=true|false (ALPHA - default=false)<br/>StrictCostEnforcementForVAP=true|false (BETA - default=false)<br/>StrictCostEnforcementForWebhooks=true|false (BETA - default=false)<br/>StructuredAuthenticationConfiguration=true|false (BETA - default=true)<br/>StructuredAuthorizationConfiguration=true|false (BETA - default=true)<br/>SupplementalGroupsPolicy=true|false (ALPHA - default=false)<br/>TopologyAwareHints=true|false (BETA - default=true)<br/>TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>TopologyManagerPolicyOptions=true|false (BETA - default=true)<br/>TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>UserNamespacesSupport=true|false (BETA - default=false)<br/>VolumeAttributesClass=true|false (BETA - default=false)<br/>VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>WatchFromStorageWithoutResourceVersion=true|false (BETA - default=false)<br/>WatchList=true|false (ALPHA - default=false)<br/>WatchListClient=true|false (BETA - default=false)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (BETA - default=true)<br/>WindowsHostNetwork=true|false (ALPHA - default=true)<br/>This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0:10256</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address and port for the health check server to serve on, defaulting to &quot;0.0.0.0:10256&quot;. This parameter is ignored if a config file is specified by --config.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-empty, will be used as the name of the Node that kube-proxy is running on. If unset, the node name is assumed to be the same as the node's hostname.</p></td>
</tr>

<tr>
<td colspan="2">--init-only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, perform any initialization steps that must be done with full root privileges, and then exit. After doing this, you can run kube-proxy again with only the CAP_NET_ADMIN capability.</p></td>
</tr>

<tr>
<td colspan="2">--iptables-localhost-nodeports&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If false, kube-proxy will disable the legacy behavior of allowing NodePort services to be accessed via localhost. (Applies only to iptables mode and IPv4; localhost NodePorts are never allowed with other proxy modes or with IPv6.)</p></td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If using the iptables or ipvs proxy mode, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].</p></td>
</tr>

<tr>
<td colspan="2">--iptables-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The minimum period between iptables rule resyncs (e.g. '5s', '1m', '2h22m'). A value of 0 means every Service or EndpointSlice change will result in an immediate iptables resync.</p></td>
</tr>

<tr>
<td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>An interval (e.g. '5s', '1m', '2h22m') indicating how frequently various re-synchronizing and cleanup operations are performed. Must be greater than 0.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-exclude-cidrs strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A comma-separated list of CIDRs which the ipvs proxier should not touch when cleaning up IPVS rules.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The minimum period between IPVS rule resyncs (e.g. '5s', '1m', '2h22m'). A value of 0 means every Service or EndpointSlice change will result in an immediate IPVS resync.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>An interval (e.g. '5s', '1m', '2h22m') indicating how frequently various re-synchronizing and cleanup operations are performed. Must be greater than 0.</p></td>
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
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum number of seconds between log flushes</p></td>
</tr>

<tr>
<td colspan="2">--log-text-info-buffer-size quantity</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] In text format with split output streams, the info messages can be buffered for a while to increase performance. The default value of zero bytes disables buffering. The size can be specified as number of bytes (512), multiples of 1000 (1K), multiples of 1024 (2Ki), or powers of those (3M, 4G, 5Mi, 6Gi). Enable the LoggingAlphaOptions feature gate to use this.</p></td>
</tr>

<tr>
<td colspan="2">--log-text-split-stream</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] In text format, write error messages to stderr and info messages to stdout. The default is to write a single stream to stdout. Enable the LoggingAlphaOptions feature gate to use this.</p></td>
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
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Sets the log format. Permitted formats: &quot;text&quot;.</p></td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>log to standard error instead of files</p></td>
</tr>

<tr>
<td colspan="2">--masquerade-all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>SNAT all traffic sent via Service cluster IPs. This may be required with some CNI plugins. Only supported on Linux.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address and port for the metrics server to serve on, defaulting to &quot;127.0.0.1:10249&quot;. (Set to &quot;0.0.0.0:10249&quot; / &quot;[::]:10249&quot; to bind on all interfaces.) Set empty to disable. This parameter is ignored if a config file is specified by --config.</p></td>
</tr>

<tr>
<td colspan="2">--nodeport-addresses strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A list of CIDR ranges that contain valid node IPs, or alternatively, the single string 'primary'. If set to a list of CIDRs, connections to NodePort services will only be accepted on node IPs in one of the indicated ranges. If set to 'primary', NodePort services will only be accepted on the node's primary IP(s) according to the Node object. If unset, NodePort connections will be accepted on all local IPs. This parameter is ignored if a config file is specified by --config.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A bridge interface name. When --detect-local-mode is set to BridgeInterface, kube-proxy will consider traffic to be local if it originates from this bridge.</p></td>
</tr>

<tr>
<td colspan="2">--pod-interface-name-prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>An interface name prefix. When --detect-local-mode is set to InterfaceNamePrefix, kube-proxy will consider traffic to be local if it originates from any interface whose name begins with this prefix.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=true)</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version</p></td>
</tr>

<tr>
<td colspan="2">--vmodule pattern=N,...</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>comma-separated list of pattern=N settings for file-filtered logging (only works for text log format)</p></td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, write the default configuration values to this file and exit.</p></td>
</tr>

</tbody>
</table>



