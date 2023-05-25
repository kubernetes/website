---
title: kube-proxy
content_type: tool-reference
weight: 30
---
<!-- 
title: kube-proxy
content_type: tool-reference
weight: 30
-->

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

<!--
The Kubernetes network proxy runs on each node. This
reflects services as defined in the Kubernetes API on each node and can do simple
TCP, UDP, and SCTP stream forwarding or round robin TCP, UDP, and SCTP forwarding across a set of backends.
Service cluster IPs and ports are currently found through Docker-links-compatible
environment variables specifying ports opened by the service proxy. There is an optional
addon that provides cluster DNS for these cluster IPs. The user must create a service
with the apiserver API to configure the proxy.
-->
Kubernetes 网络代理在每个节点上运行。网络代理反映了每个节点上 Kubernetes API
中定义的服务，并且可以执行简单的 TCP、UDP 和 SCTP 流转发，或者在一组后端进行
循环 TCP、UDP 和 SCTP 转发。
当前可通过 Docker-links-compatible 环境变量找到服务集群 IP 和端口，
这些环境变量指定了服务代理打开的端口。
有一个可选的插件，可以为这些集群 IP 提供集群 DNS。
用户必须使用 apiserver API 创建服务才能配置代理。

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, adds the file directory to the header of the log messages
-->
如果为 true，将文件目录添加到日志消息的头部
</p>
</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
log to standard error as well as files (no effect when -logtostderr=true)
-->
设置为 true 表示将日志输出到文件的同时输出到 stderr（当 <code>--logtostderr=true</code> 时不生效）
</p>
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The IP address for the proxy server to serve on (set to '0.0.0.0' for all IPv4 interfaces and '::' for all IPv6 interfaces). This parameter is ignored if a config file is specified by --config.
-->
代理服务器的 IP 地址（所有 IPv4 接口设置为 “0.0.0.0”，所有 IPv6 接口设置为 “::”）。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p></td>
</tr>

<tr>
<td colspan="2">--bind-address-hard-fail</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true kube-proxy will treat failure to bind to a port as fatal and exit
-->
如果为 true，kube-proxy 会将无法绑定端口的失败操作视为致命错误并退出。
</p></td>
</tr>

<tr>
<td colspan="2">--boot_id_file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/proc/sys/kernel/random/boot_id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- Comma-separated list of files to check for boot-id. Use the first one that exists. -->
逗号分隔的文件列表，用于检查 boot-id。使用第一个存在的文件。
</p></td>
</tr>

<tr>
<td colspan="2">--cleanup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true cleanup iptables and ipvs rules and exit.
-->
如果为 true，清理 iptables 和 ipvs 规则并退出。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The CIDR range of pods in the cluster. When configured, traffic sent to a Service cluster IP from outside this range will be masqueraded and traffic sent from pods to an external LoadBalancer IP will be directed to the respective cluster IP instead. For dual-stack clusters, a comma-separated list is accepted with at least one CIDR per IP family (IPv4 and IPv6). This parameter is ignored if a config file is specified by --config.
-->
集群中 Pod 的 CIDR 范围。配置后，将从该范围之外发送到服务集群 IP
的流量被伪装，从 Pod 发送到外部 LoadBalancer IP
的流量将被重定向到相应的集群 IP。
对于双协议栈集群，接受一个逗号分隔的列表，
每个 IP 协议族（IPv4 和 IPv6）至少包含一个 CIDR。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The path to the configuration file.
-->
配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：15m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
How often configuration from the apiserver is refreshed.  Must be greater than 0.
-->
来自 apiserver 的配置的刷新频率。必须大于 0。
</p>
</td>
</tr>

<tr>
<td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：32768</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Maximum number of NAT connections to track per CPU core (0 to leave the limit as-is and ignore conntrack-min).
-->
每个 CPU 核跟踪的最大 NAT 连接数（0 表示保留当前限制并忽略 conntrack-min 设置）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：131072</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Minimum number of conntrack entries to allocate, regardless of conntrack-max-per-core (set conntrack-max-per-core=0 to leave the limit as-is).
-->
无论 <code>conntrack-max-per-core</code> 多少，要分配的 conntrack
条目的最小数量（将 <code>conntrack-max-per-core</code> 设置为 0 即可
保持当前的限制）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1h0m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
NAT timeout for TCP connections in the CLOSE_WAIT state
-->
处于 <code>CLOSE_WAIT</code> 状态的 TCP 连接的 NAT 超时。
</p>
</td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：24h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Idle timeout for established TCP connections (0 to leave as-is)
-->
已建立的 TCP 连接的空闲超时（0 保持当前设置）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--detect-local-mode LocalMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Mode to use to detect local traffic. This parameter is ignored if a config file is specified by --config.
-->
用于检测本地流量的模式。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;<!--comma-separated 'key=True|False' pairs-->逗号分隔的 'key=True|False' 对&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>
APIListChunking=true|false (BETA - default=true)<br/>
APIPriorityAndFairness=true|false (BETA - default=true)<br/>
APIResponseCompression=true|false (BETA - default=true)<br/>
APISelfSubjectReview=true|false (BETA - default=true)<br/>
APIServerIdentity=true|false (BETA - default=true)<br/>
APIServerTracing=true|false (BETA - default=true)<br/>
AdmissionWebhookMatchConditions=true|false (ALPHA - default=false)<br/>
AggregatedDiscoveryEndpoint=true|false (BETA - default=true)<br/>
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
CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
CloudDualStackNodeIPs=true|false (ALPHA - default=false)<br/>
ClusterTrustBundle=true|false (ALPHA - default=false)<br/>
ComponentSLIs=true|false (BETA - default=true)<br/>
ContainerCheckpoint=true|false (ALPHA - default=false)<br/>
ContextualLogging=true|false (ALPHA - default=false)<br/>
CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
CustomResourceValidationExpressions=true|false (BETA - default=true)<br/>
DisableCloudProviders=true|false (ALPHA - default=false)<br/>
DisableKubeletCloudCredentialProviders=true|false (ALPHA - default=false)<br/>
DynamicResourceAllocation=true|false (ALPHA - default=false)<br/>
ElasticIndexedJob=true|false (BETA - default=true)<br/>
EventedPLEG=true|false (BETA - default=false)<br/>
ExpandedDNSConfig=true|false (BETA - default=true)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>
GracefulNodeShutdown=true|false (BETA - default=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
HPAContainerMetrics=true|false (BETA - default=true)<br/>
HPAScaleToZero=true|false (ALPHA - default=false)<br/>
HonorPVReclaimPolicy=true|false (ALPHA - default=false)<br/>
IPTablesOwnershipCleanup=true|false (BETA - default=true)<br/>
InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>
InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginRBDUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>
JobPodFailurePolicy=true|false (BETA - default=true)<br/>
JobReadyPods=true|false (BETA - default=true)<br/>
KMSv2=true|false (BETA - default=true)<br/>
KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
KubeletPodResources=true|false (BETA - default=true)<br/>
KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>
KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - default=true)<br/>
KubeletTracing=true|false (BETA - default=true)<br/>
LegacyServiceAccountTokenTracking=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>
LogarithmicScaleDown=true|false (BETA - default=true)<br/>
LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
LoggingBetaOptions=true|false (BETA - default=true)<br/>
MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
MemoryManager=true|false (BETA - default=true)<br/>
MemoryQoS=true|false (ALPHA - default=false)<br/>
MinDomainsInPodTopologySpread=true|false (BETA - default=true)<br/>
MinimizeIPTablesRestore=true|false (BETA - default=true)<br/>
MultiCIDRRangeAllocator=true|false (ALPHA - default=false)<br/>
MultiCIDRServiceAllocator=true|false (ALPHA - default=false)<br/>
NetworkPolicyStatus=true|false (ALPHA - default=false)<br/>
NewVolumeManagerReconstruction=true|false (BETA - default=true)<br/>
NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>
NodeLogQuery=true|false (ALPHA - default=false)<br/>
NodeOutOfServiceVolumeDetach=true|false (BETA - default=true)<br/>
NodeSwap=true|false (ALPHA - default=false)<br/>
OpenAPIEnums=true|false (BETA - default=true)<br/>
PDBUnhealthyPodEvictionPolicy=true|false (BETA - default=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
PodDeletionCost=true|false (BETA - default=true)<br/>
PodDisruptionConditions=true|false (BETA - default=true)<br/>
PodHasNetworkCondition=true|false (ALPHA - default=false)<br/>
PodSchedulingReadiness=true|false (BETA - default=true)<br/>
ProbeTerminationGracePeriod=true|false (BETA - default=true)<br/>
ProcMountType=true|false (ALPHA - default=false)<br/>
ProxyTerminatingEndpoints=true|false (BETA - default=true)<br/>
QOSReserved=true|false (ALPHA - default=false)<br/>
ReadWriteOncePod=true|false (BETA - default=true)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>
RemainingItemCount=true|false (BETA - default=true)<br/>
RetroactiveDefaultStorageClass=true|false (BETA - default=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
SecurityContextDeny=true|false (ALPHA - default=false)<br/>
ServiceNodePortStaticSubrange=true|false (ALPHA - default=false)<br/>
SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>
StableLoadBalancerNodeSet=true|false (BETA - default=true)<br/>
StatefulSetAutoDeletePVC=true|false (BETA - default=true)<br/>
StatefulSetStartOrdinal=true|false (BETA - default=true)<br/>
StorageVersionAPI=true|false (ALPHA - default=false)<br/>
StorageVersionHash=true|false (BETA - default=true)<br/>
TopologyAwareHints=true|false (BETA - default=true)<br/>
TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
TopologyManagerPolicyBetaOptions=true|false (BETA - default=false)<br/>
TopologyManagerPolicyOptions=true|false (ALPHA - default=false)<br/>
UserNamespacesStatelessPodsSupport=true|false (ALPHA - default=false)<br/>
ValidatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>
VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
WatchList=true|false (ALPHA - default=false)<br/>
WinDSR=true|false (ALPHA - default=false)<br/>
WinOverlay=true|false (BETA - default=true)<br/>
WindowsHostNetwork=true|false (ALPHA - default=true)<br/>
This parameter is ignored if a config file is specified by --config.
-->
一组 key=value 对，用来描述测试性/试验性功能的特性门控。可选项有：<br/>
APIListChunking=true|false (BETA - 默认值为 true)<br/>
APIPriorityAndFairness=true|false (BETA - 默认值为 true)<br/>
APIResponseCompression=true|false (BETA - 默认值为 true)<br/>
APISelfSubjectReview=true|false (BETA - 默认值为 true)<br/>
APIServerIdentity=true|false (BETA - 默认值为 true)<br/>
APIServerTracing=true|false (BETA - 默认值为 true)<br/>
AdmissionWebhookMatchConditions=true|false (ALPHA - 默认值为 false)<br/>
AggregatedDiscoveryEndpoint=true|false (BETA - 默认值为 true)<br/>
AllAlpha=true|false (ALPHA - 默认值为 false)<br/>
AllBeta=true|false (BETA - 默认值为 false)<br/>
AnyVolumeDataSource=true|false (BETA - 默认值为 true)<br/>
AppArmor=true|false (BETA - 默认值为 true)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - 默认值为 false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - 默认值为 true)<br/>
CPUManagerPolicyOptions=true|false (BETA - 默认值为 true)<br/>
CSIMigrationPortworx=true|false (BETA - 默认值为 false)<br/>
CSIMigrationRBD=true|false (ALPHA - 默认值为 false)<br/>
CSINodeExpandSecret=true|false (BETA - 默认值为 true)<br/>
CSIVolumeHealth=true|false (ALPHA - 默认值为 false)<br/>
CloudControllerManagerWebhook=true|false (ALPHA - 默认值为 false)<br/>
CloudDualStackNodeIPs=true|false (ALPHA - 默认值为 false)<br/>
ClusterTrustBundle=true|false (ALPHA - 默认值为 false)<br/>
ComponentSLIs=true|false (BETA - 默认值为 true)<br/>
ContainerCheckpoint=true|false (ALPHA - 默认值为 false)<br/>
ContextualLogging=true|false (ALPHA - 默认值为 false)<br/>
CrossNamespaceVolumeDataSource=true|false (ALPHA - 默认值为 false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默认值为 false)<br/>
CustomResourceValidationExpressions=true|false (BETA - 默认值为 true)<br/>
DisableCloudProviders=true|false (ALPHA - 默认值为 false)<br/>
DisableKubeletCloudCredentialProviders=true|false (ALPHA - 默认值为 false)<br/>
DynamicResourceAllocation=true|false (ALPHA - 默认值为 false)<br/>
ElasticIndexedJob=true|false (BETA - 默认值为 true)<br/>
EventedPLEG=true|false (BETA - 默认值为 false)<br/>
ExpandedDNSConfig=true|false (BETA - 默认值为 true)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 默认值为 false)<br/>
GracefulNodeShutdown=true|false (BETA - 默认值为 true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 默认值为 true)<br/>
HPAContainerMetrics=true|false (BETA - 默认值为 true)<br/>
HPAScaleToZero=true|false (ALPHA - 默认值为 false)<br/>
HonorPVReclaimPolicy=true|false (ALPHA - 默认值为 false)<br/>
IPTablesOwnershipCleanup=true|false (BETA - 默认值为 true)<br/>
InPlacePodVerticalScaling=true|false (ALPHA - 默认值为 false)<br/>
InTreePluginAWSUnregister=true|false (ALPHA - 默认值为 false)<br/>
InTreePluginAzureDiskUnregister=true|false (ALPHA - 默认值为 false)<br/>
InTreePluginAzureFileUnregister=true|false (ALPHA - 默认值为 false)<br/>
InTreePluginGCEUnregister=true|false (ALPHA - 默认值为 false)<br/>
InTreePluginOpenStackUnregister=true|false (ALPHA - 默认值为 false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - 默认值为 false)<br/>
InTreePluginRBDUnregister=true|false (ALPHA - 默认值为 false)<br/>
InTreePluginvSphereUnregister=true|false (ALPHA - 默认值为 false)<br/>
JobPodFailurePolicy=true|false (BETA - 默认值为 true)<br/>
JobReadyPods=true|false (BETA - 默认值为 true)<br/>
KMSv2=true|false (BETA - 默认值为 true)<br/>
KubeletInUserNamespace=true|false (ALPHA - 默认值为 false)<br/>
KubeletPodResources=true|false (BETA - 默认值为 true)<br/>
KubeletPodResourcesDynamicResources=true|false (ALPHA - 默认值为 false)<br/>
KubeletPodResourcesGet=true|false (ALPHA - 默认值为 false)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - 默认值为 true)<br/>
KubeletTracing=true|false (BETA - 默认值为 true)<br/>
LegacyServiceAccountTokenTracking=true|false (BETA - 默认值为 true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 默认值为 false)<br/>
LogarithmicScaleDown=true|false (BETA - 默认值为 true)<br/>
LoggingAlphaOptions=true|false (ALPHA - 默认值为 false)<br/>
LoggingBetaOptions=true|false (BETA - 默认值为 true)<br/>
MatchLabelKeysInPodTopologySpread=true|false (BETA - 默认值为 true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - 默认值为 false)<br/>
MemoryManager=true|false (BETA - 默认值为 true)<br/>
MemoryQoS=true|false (ALPHA - 默认值为 false)<br/>
MinDomainsInPodTopologySpread=true|false (BETA - 默认值为 true)<br/>
MinimizeIPTablesRestore=true|false (BETA - 默认值为 true)<br/>
MultiCIDRRangeAllocator=true|false (ALPHA - 默认值为 false)<br/>
MultiCIDRServiceAllocator=true|false (ALPHA - 默认值为 false)<br/>
NetworkPolicyStatus=true|false (ALPHA - 默认值为 false)<br/>
NewVolumeManagerReconstruction=true|false (BETA - 默认值为 true)<br/>
NodeInclusionPolicyInPodTopologySpread=true|false (BETA - 默认值为 true)<br/>
NodeLogQuery=true|false (ALPHA - 默认值为 false)<br/>
NodeOutOfServiceVolumeDetach=true|false (BETA - 默认值为 true)<br/>
NodeSwap=true|false (ALPHA - 默认值为 false)<br/>
OpenAPIEnums=true|false (BETA - 默认值为 true)<br/>
PDBUnhealthyPodEvictionPolicy=true|false (BETA - 默认值为 true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - 默认值为 false)<br/>
PodDeletionCost=true|false (BETA - 默认值为 true)<br/>
PodDisruptionConditions=true|false (BETA - 默认值为 true)<br/>
PodHasNetworkCondition=true|false (ALPHA - 默认值为 false)<br/>
PodSchedulingReadiness=true|false (BETA - 默认值为 true)<br/>
ProbeTerminationGracePeriod=true|false (BETA - 默认值为 true)<br/>
ProcMountType=true|false (ALPHA - 默认值为 false)<br/>
ProxyTerminatingEndpoints=true|false (BETA - 默认值为 true)<br/>
QOSReserved=true|false (ALPHA - 默认值为 false)<br/>
ReadWriteOncePod=true|false (BETA - 默认值为 true)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - 默认值为 false)<br/>
RemainingItemCount=true|false (BETA - 默认值为 true)<br/>
RetroactiveDefaultStorageClass=true|false (BETA - 默认值为 true)<br/>
RotateKubeletServerCertificate=true|false (BETA - 默认值为 true)<br/>
SELinuxMountReadWriteOncePod=true|false (BETA - 默认值为 true)<br/>
SecurityContextDeny=true|false (ALPHA - 默认值为 false)<br/>
ServiceNodePortStaticSubrange=true|false (ALPHA - 默认值为 false)<br/>
SizeMemoryBackedVolumes=true|false (BETA - 默认值为 true)<br/>
StableLoadBalancerNodeSet=true|false (BETA - 默认值为 true)<br/>
StatefulSetAutoDeletePVC=true|false (BETA - 默认值为 true)<br/>
StatefulSetStartOrdinal=true|false (BETA - 默认值为 true)<br/>
StorageVersionAPI=true|false (ALPHA - 默认值为 false)<br/>
StorageVersionHash=true|false (BETA - 默认值为 true)<br/>
TopologyAwareHints=true|false (BETA - 默认值为 true)<br/>
TopologyManagerPolicyAlphaOptions=true|false (ALPHA - 默认值为 false)<br/>
TopologyManagerPolicyBetaOptions=true|false (BETA - 默认值为 false)<br/>
TopologyManagerPolicyOptions=true|false (ALPHA - 默认值为 false)<br/>
UserNamespacesStatelessPodsSupport=true|false (ALPHA - 默认值为 false)<br/>
ValidatingAdmissionPolicy=true|false (ALPHA - 默认值为 false)<br/>
VolumeCapacityPriority=true|false (ALPHA - 默认值为 false)<br/>
WatchList=true|false (ALPHA - 默认值为 false)<br/>
WinDSR=true|false (ALPHA - 默认值为 false)<br/>
WinOverlay=true|false (BETA - 默认值为 true)<br/>
WindowsHostNetwork=true|false (ALPHA - 默认值为 true)<br/>
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：<code>0.0.0.0:10256</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--  
The IP address with port for the health check server to serve on (set to '0.0.0.0:10256' for all IPv4 interfaces and '[::]:10256' for all IPv6 interfaces). Set empty to disable. This parameter is ignored if a config file is specified by --config.
-->
服务健康状态检查的 IP 地址和端口（设置为 '0.0.0.0:10256' 表示使用所有
IPv4 接口，设置为 '[::]:10256' 表示使用所有 IPv6 接口）；
设置为空则禁用。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for kube-proxy
-->
kube-proxy 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--hostname-override string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If non-empty, will use this string as identification instead of the actual hostname.
-->
如果非空，将使用此字符串而不是实际的主机名作为标识。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-localhost-nodeports&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
If false Kube-proxy will disable the legacy behavior of allowing NodePort services to be accessed via localhost, This only applies to iptables mode and ipv4.
-->
<p>
如果设为 false，Kube-proxy 将禁用允许通过本地主机访问 NodePort 服务的传统行为，
这仅适用于 iptables 模式和 ipv4。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If using the pure iptables proxy, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].
-->
在使用纯 iptables 代理时，用来设置 fwmark 空间的 bit，标记需要
SNAT 的数据包。必须在 [0,31] 范围内。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The minimum interval of how often the iptables rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').
-->
iptables 规则可以随着端点和服务的更改而刷新的最小间隔（例如 '5s'、'1m'、'2h22m'）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The maximum interval of how often iptables rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.
-->
刷新 iptables 规则的最大间隔（例如 '5s'、'1m'、'2h22m'）。必须大于 0。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-exclude-cidrs strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
A comma-separated list of CIDR's which the ipvs proxier should not touch when cleaning up IPVS rules.
-->
逗号分隔的 CIDR 列表，ipvs 代理在清理 IPVS 规则时不会此列表中的地址范围。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-min-sync-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The minimum interval of how often the ipvs rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').
-->
ipvs 规则可以随着端点和服务的更改而刷新的最小间隔（例如 '5s'、'1m'、'2h22m'）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-scheduler string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The ipvs scheduler type when proxy mode is ipvs
-->
代理模式为 ipvs 时所选的 ipvs 调度器类型。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-strict-arp</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Enable strict ARP by setting arp_ignore to 1 and arp_announce to 2
-->
通过将 <code>arp_ignore</code> 设置为 1 并将 <code>arp_announce</code>
设置为 2 启用严格的 ARP。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The maximum interval of how often ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.
-->
刷新 ipvs 规则的最大间隔（例如 '5s'、'1m'、'2h22m'）。必须大于 0。
</p>
</td>
</tr>


<tr>
<td colspan="2">--ipvs-tcp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--  
The timeout for idle IPVS TCP connections, 0 to leave as-is. (e.g. '5s', '1m', '2h22m').
-->
空闲 IPVS TCP 连接的超时时间，0 保持连接（例如 '5s'、'1m'、'2h22m'）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-tcpfin-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--  
The timeout for IPVS TCP connections after receiving a FIN packet, 0 to leave as-is. (e.g. '5s', '1m', '2h22m').
-->
收到 FIN 数据包后，IPVS TCP 连接的超时，0 保持当前设置不变。（例如 '5s'、'1m'、'2h22m'）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-udp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--  
The timeout for IPVS UDP packets, 0 to leave as-is. (e.g. '5s', '1m', '2h22m').
-->
IPVS UDP 数据包的超时，0 保持当前设置不变。（例如 '5s'、'1m'、'2h22m'）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Burst to use while talking with kubernetes apiserver
-->
与 kubernetes apiserver 通信的突发数量。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Content type of requests sent to apiserver.
-->
发送到 apiserver 的请求的内容类型。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
QPS to use while talking with kubernetes apiserver
-->
与 kubernetes apiserver 交互时使用的 QPS。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to kubeconfig file with authorization information (the master location is set by the master flag).
-->
包含鉴权信息的 kubeconfig 文件的路径（主控节点位置由 master 标志设置）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--log_backtrace_at &lt;<!--a string in the form 'file:N'-->“file:N” 格式的字符串&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
when logging hits line file:N, emit a stack trace
-->
当日志命中 file:N，触发一次堆栈追踪
</p></td>
</tr>

<tr>
<td colspan="2">--log_dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If non-empty, write log files in this directory (no effect when -logtostderr=true)
-->
如果非空，则在此目录中写入日志文件（当 <code>--logtostderr=true</code> 时不生效）
</p></td>
</tr>

<tr>
<td colspan="2">--log_file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If non-empty, use this log file (no effect when -logtostderr=true)
-->
如果非空，使用此日志文件（当 <code>--logtostderr=true</code> 时不生效）
</p></td>
</tr>

<tr>
<td colspan="2">--log_file_max_size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Defines the maximum size a log file can grow to (no effect when -logtostderr=true). Unit is megabytes. If the value is 0, the maximum file size is unlimited.
-->
定义日志文件可以增长到的最大大小（当 <code>--logtostderr=true</code> 时不生效）。
单位是兆字节。如果值为 0，则最大文件大小不受限制。
</p></td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!-- log to standard error instead of files -->
日志输出到 stderr 而不是文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--machine_id_file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/etc/machine-id,/var/lib/dbus/machine-id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Comma-separated list of files to check for machine-id. Use the first one that exists.
-->
用来检查 Machine-ID 的文件列表，用逗号分隔。
使用找到的第一个文件。
</p></td>
</tr>

<tr>
<td colspan="2">--masquerade-all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If using the pure iptables proxy, SNAT all traffic sent via Service cluster IPs (this not commonly needed)
-->
如果使用纯 iptables 代理，则对通过服务集群 IP 发送的所有流量
进行 SNAT（通常不需要）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The address of the Kubernetes API server (overrides any value in kubeconfig)
-->
Kubernetes API 服务器的地址（覆盖 kubeconfig 中的相关值）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--metrics-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：<code>127.0.0.1:10249</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The IP address with port for the metrics server to serve on (set to '0.0.0.0:10249' for all IPv4 interfaces and '[::]:10249' for all IPv6 interfaces). Set empty to disable. This parameter is ignored if a config file is specified by --config.
-->
metrics 服务器要使用的 IP 地址和端口
（设置为 '0.0.0.0:10249' 则使用所有 IPv4 接口，设置为 '[::]:10249' 则使用所有 IPv6 接口）
设置为空则禁用。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--nodeport-addresses strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
A string slice of values which specify the addresses to use for NodePorts. Values may be valid IP blocks (e.g. 1.2.3.0/24, 1.2.3.4/32). The default empty string slice ([]) means to use all local addresses.This parameter is ignored if a config file is specified by --config.
-->
一个字符串值，指定用于 NodePort 服务的地址。
值可以是有效的 IP 块（例如 1.2.3.0/24, 1.2.3.4/32）。
默认的空字符串切片（[]）表示使用所有本地地址。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--one_output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, only write logs to their native severity level (vs also writing to each lower severity level; no effect when -logtostderr=true)
-->
如果为 true，则仅将日志写入其本身的严重性级别
（而不是写入每个较低的严重性级别；当 <code>--logtostderr=true</code> 时不生效）。
</p></td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：-999</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The oom-score-adj value for kube-proxy process. Values must be within the range [-1000, 1000]. This parameter is ignored if a config file is specified by --config.
-->
kube-proxy 进程中的 oom-score-adj 值，必须在 [-1000,1000] 范围内。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--pod-bridge-interface string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A bridge interface name in the cluster. Kube-proxy considers traffic as local if originating from an interface which matches the value. This argument should be set if DetectLocalMode is set to BridgeInterface.
-->
集群中的一个桥接接口名称。
Kube-proxy 将来自与该值匹配的桥接接口的流量视为本地流量。
如果 DetectLocalMode 设置为 BridgeInterface，则应设置该参数。
</td>
</tr>

<tr>
<td colspan="2">--pod-interface-name-prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
An interface prefix in the cluster. Kube-proxy considers traffic as local if originating from interfaces that match the given prefix. This argument should be set if DetectLocalMode is set to InterfaceNamePrefix.
-->
集群中的一个接口前缀。
Kube-proxy 将来自与给定前缀匹配的接口的流量视为本地流量。
如果 DetectLocalMode 设置为 InterfaceNamePrefix，则应设置该参数。
</td>
</tr>

<tr>
<td colspan="2">--profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true enables profiling via web interface on /debug/pprof handler. This parameter is ignored if a config file is specified by --config.
-->
如果为 true，则通过 Web 接口 <code>/debug/pprof</code> 启用性能分析。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--proxy-mode ProxyMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Which proxy mode to use: on Linux this can be 'iptables' (default) or 'ipvs'. On Windows the only supported value is 'kernelspace'.This parameter is ignored if a config file is specified by --config.
-->
使用哪种代理模式：在 Linux 上可以是 'iptables'（默认）或 'ipvs'。
在 Windows 上唯一支持的值是 'kernelspace'。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--proxy-port-range port-range</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Range of host ports (beginPort-endPort, single port or beginPort+offset, inclusive) that may be consumed in order to proxy service traffic. If (unspecified, 0, or 0-0) then ports will be randomly chosen.
-->
可以用来代理服务流量的主机端口范围（包括'起始端口-结束端口'、
'单个端口'、'起始端口+偏移'几种形式）。
如果未指定或者设置为 0（或 0-0），则随机选择端口。
</p>
</td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--  
The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is &lt;major&gt;.&lt;minor&gt;, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that. This parameter is ignored if a config file is specified by --config.
-->
要显示隐藏指标的先前版本。
仅先前的次要版本有意义，不允许其他值。
格式为 &lt;major&gt;.&lt;minor&gt;，例如 '1.16'。
这种格式的目的是确保你有机会注意到下一个发行版是否隐藏了其他指标，
而不是在之后将其永久删除时感到惊讶。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--skip_headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, avoid header prefixes in the log messages
-->
如果为 true，则避免在日志消息中使用头部前缀
</p></td>
</tr>

<tr>
<td colspan="2">--skip_log_headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, avoid headers when opening log files (no effect when -logtostderr=true)
-->
如果为 true，则在打开日志文件时避免使用头部（当 <code>--logtostderr=true</code> 时不生效）
</p></td>
</tr>

<tr>
<td colspan="2">--stderrthreshold int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=false)
-->
当写入到文件或 stderr 时设置严重程度达到或超过此阈值的日志输出到 stderr
（当 <code>--logtostderr=true</code> 或 <code>--alsologtostderr=false</code> 时不生效）。
</p></td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
number for the log level verbosity
-->
设置日志级别详细程度的数值。
</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Print version information and quit
-->
打印版本信息并退出。
</p>
</td>
</tr>

<tr>
<td colspan="2">--vmodule &lt;<!--comma-separated 'pattern=N' settings-->逗号分割的 “pattern=N” 设置&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
comma-separated list of pattern=N settings for file-filtered logging
-->
以逗号分割的 pattern=N 设置的列表，用于文件过滤日志
</p></td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If set, write the default configuration values to this file and exit.
-->
如果设置，将默认配置信息写入此文件并退出。
</p>
</td>
</tr>

</tbody>
</table>

