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
Overrides kube-proxy's idea of what its node's primary IP is. Note that the name is a historical artifact, and kube-proxy does not actually bind any sockets to this IP. This parameter is ignored if a config file is specified by --config.
-->
重写 kube-proxy 对其节点主要 IP 的理解。请注意，此名称是一个历史遗留字段，
并且 kube-proxy 实际上并没有将任何套接字绑定到此 IP。
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
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
The CIDR range of the pods in the cluster. (For dual-stack clusters, this can be a comma-separated dual-stack pair of CIDR ranges.). When --detect-local-mode is set to ClusterCIDR, kube-proxy will consider traffic to be local if its source IP is in this range. (Otherwise it is not used.) This parameter is ignored if a config file is specified by --config.
-->
集群中 Pod 的 CIDR 范围。对于双协议栈集群，这可以是逗号分隔的双协议栈 CIDR 范围对。
当 <code>--detect-local-mode</code> 设置为 ClusterCIDR 时，
kube-proxy 会将源 IP 在此范围内的流量视为本地流量。否则不使用此字段。
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
<td colspan="2">--conntrack-tcp-be-liberal</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Enable liberal mode for tracking TCP packets by setting nf_conntrack_tcp_be_liberal to 1
-->
通过将 <code>nf_conntrack_tcp_be_liberal</code> 设置为 1，启用宽松模式以跟踪 TCP 数据包。
</p></td>
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
<td colspan="2">--conntrack-udp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Idle timeout for UNREPLIED UDP connections (0 to leave as-is)
-->
UNREPLIED UDP 连接的空闲超时（0 保持当前设置）。
</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-udp-timeout-stream duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Idle timeout for ASSURED UDP connections (0 to leave as-is)
-->
ASSURED UDP 连接的空闲超时（0 保持当前设置）。
</p></td>
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
APIResponseCompression=true|false (BETA - default=true)<br/>
APIServerIdentity=true|false (BETA - default=true)<br/>
APIServerTracing=true|false (BETA - default=true)<br/>
APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
AllAlpha=true|false (ALPHA - default=false)<br/>
AllBeta=true|false (BETA - default=false)<br/>
AnonymousAuthConfigurableEndpoints=true|false (ALPHA - default=false)<br/>
AnyVolumeDataSource=true|false (BETA - default=true)<br/>
AuthorizeNodeWithSelectors=true|false (ALPHA - default=false)<br/>
AuthorizeWithSelectors=true|false (ALPHA - default=false)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
CRDValidationRatcheting=true|false (BETA - default=true)<br/>
CSIMigrationPortworx=true|false (BETA - default=true)<br/>
CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
ClusterTrustBundle=true|false (ALPHA - default=false)<br/>
ClusterTrustBundleProjection=true|false (ALPHA - default=false)<br/>
ComponentSLIs=true|false (BETA - default=true)<br/>
ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
ConsistentListFromCache=true|false (BETA - default=true)<br/>
ContainerCheckpoint=true|false (BETA - default=true)<br/>
ContextualLogging=true|false (BETA - default=true)<br/>
CoordinatedLeaderElection=true|false (ALPHA - default=false)<br/>
CronJobsScheduledAnnotation=true|false (BETA - default=true)<br/>
CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
CustomResourceFieldSelectors=true|false (BETA - default=true)<br/>
DRAControlPlaneController=true|false (ALPHA - default=false)<br/>
DisableAllocatorDualWrite=true|false (ALPHA - default=false)<br/>
DisableNodeKubeProxyVersion=true|false (BETA - default=true)<br/>
DynamicResourceAllocation=true|false (ALPHA - default=false)<br/>
EventedPLEG=true|false (ALPHA - default=false)<br/>
GracefulNodeShutdown=true|false (BETA - default=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
HPAScaleToZero=true|false (ALPHA - default=false)<br/>
HonorPVReclaimPolicy=true|false (BETA - default=true)<br/>
ImageMaximumGCAge=true|false (BETA - default=true)<br/>
ImageVolume=true|false (ALPHA - default=false)<br/>
InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
InformerResourceVersion=true|false (ALPHA - default=false)<br/>
JobBackoffLimitPerIndex=true|false (BETA - default=true)<br/>
JobManagedBy=true|false (ALPHA - default=false)<br/>
JobPodReplacementPolicy=true|false (BETA - default=true)<br/>
JobSuccessPolicy=true|false (BETA - default=true)<br/>
KubeletCgroupDriverFromCRI=true|false (BETA - default=true)<br/>
KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>
KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>
KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
KubeletTracing=true|false (BETA - default=true)<br/>
LoadBalancerIPMode=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
LoggingBetaOptions=true|false (BETA - default=true)<br/>
MatchLabelKeysInPodAffinity=true|false (BETA - default=true)<br/>
MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
MemoryManager=true|false (BETA - default=true)<br/>
MemoryQoS=true|false (ALPHA - default=false)<br/>
MultiCIDRServiceAllocator=true|false (BETA - default=false)<br/>
MutatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>
NFTablesProxyMode=true|false (BETA - default=true)<br/>
NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>
NodeLogQuery=true|false (BETA - default=false)<br/>
NodeSwap=true|false (BETA - default=true)<br/>
OpenAPIEnums=true|false (BETA - default=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
PodDeletionCost=true|false (BETA - default=true)<br/>
PodIndexLabel=true|false (BETA - default=true)<br/>
PodLifecycleSleepAction=true|false (BETA - default=true)<br/>
PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
PortForwardWebsockets=true|false (BETA - default=true)<br/>
ProcMountType=true|false (BETA - default=false)<br/>
QOSReserved=true|false (ALPHA - default=false)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>
RecursiveReadOnlyMounts=true|false (BETA - default=true)<br/>
RelaxedEnvironmentVariableValidation=true|false (ALPHA - default=false)<br/>
ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
ResilientWatchCacheInitialization=true|false (BETA - default=true)<br/>
ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
RetryGenerateName=true|false (BETA - default=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
SELinuxMount=true|false (ALPHA - default=false)<br/>
SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
SchedulerQueueingHints=true|false (BETA - default=false)<br/>
SeparateCacheWatchRPC=true|false (BETA - default=true)<br/>
SeparateTaintEvictionController=true|false (BETA - default=true)<br/>
ServiceAccountTokenJTI=true|false (BETA - default=true)<br/>
ServiceAccountTokenNodeBinding=true|false (BETA - default=true)<br/>
ServiceAccountTokenNodeBindingValidation=true|false (BETA - default=true)<br/>
ServiceAccountTokenPodNodeInfo=true|false (BETA - default=true)<br/>
ServiceTrafficDistribution=true|false (BETA - default=true)<br/>
SidecarContainers=true|false (BETA - default=true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>
StatefulSetAutoDeletePVC=true|false (BETA - default=true)<br/>
StorageNamespaceIndex=true|false (BETA - default=true)<br/>
StorageVersionAPI=true|false (ALPHA - default=false)<br/>
StorageVersionHash=true|false (BETA - default=true)<br/>
StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
StrictCostEnforcementForVAP=true|false (BETA - default=false)<br/>
StrictCostEnforcementForWebhooks=true|false (BETA - default=false)<br/>
StructuredAuthenticationConfiguration=true|false (BETA - default=true)<br/>
StructuredAuthorizationConfiguration=true|false (BETA - default=true)<br/>
SupplementalGroupsPolicy=true|false (ALPHA - default=false)<br/>
TopologyAwareHints=true|false (BETA - default=true)<br/>
TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
TopologyManagerPolicyOptions=true|false (BETA - default=true)<br/>
TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
UserNamespacesSupport=true|false (BETA - default=false)<br/>
VolumeAttributesClass=true|false (BETA - default=false)<br/>
VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
WatchFromStorageWithoutResourceVersion=true|false (BETA - default=false)<br/>
WatchList=true|false (ALPHA - default=false)<br/>
WatchListClient=true|false (BETA - default=false)<br/>
WinDSR=true|false (ALPHA - default=false)<br/>
WinOverlay=true|false (BETA - default=true)<br/>
WindowsHostNetwork=true|false (ALPHA - default=true)<br/>
This parameter is ignored if a config file is specified by --config.
-->
一组 key=value 对，用来描述测试性/试验性功能的特性门控。可选项有：<br/>
APIResponseCompression=true|false (BETA - 默认值=true)<br/>
APIServerIdentity=true|false (BETA - 默认值=true)<br/>
APIServerTracing=true|false (BETA - 默认值=true)<br/>
APIServingWithRoutine=true|false (ALPHA - 默认值=false)<br/>
AllAlpha=true|false (ALPHA - 默认值=false)<br/>
AllBeta=true|false (BETA - 默认值=false)<br/>
AnonymousAuthConfigurableEndpoints=true|false (ALPHA - 默认值=false)<br/>
AnyVolumeDataSource=true|false (BETA - 默认值=true)<br/>
AuthorizeNodeWithSelectors=true|false (ALPHA - 默认值=false)<br/>
AuthorizeWithSelectors=true|false (ALPHA - 默认值=false)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - 默认值=false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - 默认值=true)<br/>
CPUManagerPolicyOptions=true|false (BETA - 默认值=true)<br/>
CRDValidationRatcheting=true|false (BETA - 默认值=true)<br/>
CSIMigrationPortworx=true|false (BETA - 默认值=true)<br/>
CSIVolumeHealth=true|false (ALPHA - 默认值=false)<br/>
CloudControllerManagerWebhook=true|false (ALPHA - 默认值=false)<br/>
ClusterTrustBundle=true|false (ALPHA - 默认值=false)<br/>
ClusterTrustBundleProjection=true|false (ALPHA - 默认值=false)<br/>
ComponentSLIs=true|false (BETA - 默认值=true)<br/>
ConcurrentWatchObjectDecode=true|false (BETA - 默认值=false)<br/>
ConsistentListFromCache=true|false (BETA - 默认值=true)<br/>
ContainerCheckpoint=true|false (BETA - 默认值=true)<br/>
ContextualLogging=true|false (BETA - 默认值=true)<br/>
CoordinatedLeaderElection=true|false (ALPHA - 默认值=false)<br/>
CronJobsScheduledAnnotation=true|false (BETA - 默认值=true)<br/>
CrossNamespaceVolumeDataSource=true|false (ALPHA - 默认值=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默认值=false)<br/>
CustomResourceFieldSelectors=true|false (BETA - 默认值=true)<br/>
DRAControlPlaneController=true|false (ALPHA - 默认值=false)<br/>
DisableAllocatorDualWrite=true|false (ALPHA - 默认值=false)<br/>
DisableNodeKubeProxyVersion=true|false (BETA - 默认值=true)<br/>
DynamicResourceAllocation=true|false (ALPHA - 默认值=false)<br/>
EventedPLEG=true|false (ALPHA - 默认值=false)<br/>
GracefulNodeShutdown=true|false (BETA - 默认值=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 默认值=true)<br/>
HPAScaleToZero=true|false (ALPHA - 默认值=false)<br/>
HonorPVReclaimPolicy=true|false (BETA - 默认值=true)<br/>
ImageMaximumGCAge=true|false (BETA - 默认值=true)<br/>
ImageVolume=true|false (ALPHA - 默认值=false)<br/>
InPlacePodVerticalScaling=true|false (ALPHA - 默认值=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - 默认值=false)<br/>
InformerResourceVersion=true|false (ALPHA - 默认值=false)<br/>
JobBackoffLimitPerIndex=true|false (BETA - 默认值=true)<br/>
JobManagedBy=true|false (ALPHA - 默认值=false)<br/>
JobPodReplacementPolicy=true|false (BETA - 默认值=true)<br/>
JobSuccessPolicy=true|false (BETA - 默认值=true)<br/>
KubeletCgroupDriverFromCRI=true|false (BETA - 默认值=true)<br/>
KubeletInUserNamespace=true|false (ALPHA - 默认值=false)<br/>
KubeletPodResourcesDynamicResources=true|false (ALPHA - 默认值=false)<br/>
KubeletPodResourcesGet=true|false (ALPHA - 默认值=false)<br/>
KubeletSeparateDiskGC=true|false (BETA - 默认值=true)<br/>
KubeletTracing=true|false (BETA - 默认值=true)<br/>
LoadBalancerIPMode=true|false (BETA - 默认值=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - 默认值=false)<br/>
LoggingAlphaOptions=true|false (ALPHA - 默认值=false)<br/>
LoggingBetaOptions=true|false (BETA - 默认值=true)<br/>
MatchLabelKeysInPodAffinity=true|false (BETA - 默认值=true)<br/>
MatchLabelKeysInPodTopologySpread=true|false (BETA - 默认值=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - 默认值=false)<br/>
MemoryManager=true|false (BETA - 默认值=true)<br/>
MemoryQoS=true|false (ALPHA - 默认值=false)<br/>
MultiCIDRServiceAllocator=true|false (BETA - 默认值=false)<br/>
MutatingAdmissionPolicy=true|false (ALPHA - 默认值=false)<br/>
NFTablesProxyMode=true|false (BETA - 默认值=true)<br/>
NodeInclusionPolicyInPodTopologySpread=true|false (BETA - 默认值=true)<br/>
NodeLogQuery=true|false (BETA - 默认值=false)<br/>
NodeSwap=true|false (BETA - 默认值=true)<br/>
OpenAPIEnums=true|false (BETA - 默认值=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - 默认值=false)<br/>
PodDeletionCost=true|false (BETA - 默认值=true)<br/>
PodIndexLabel=true|false (BETA - 默认值=true)<br/>
PodLifecycleSleepAction=true|false (BETA - 默认值=true)<br/>
PodReadyToStartContainersCondition=true|false (BETA - 默认值=true)<br/>
PortForwardWebsockets=true|false (BETA - 默认值=true)<br/>
ProcMountType=true|false (BETA - 默认值=false)<br/>
QOSReserved=true|false (ALPHA - 默认值=false)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - 默认值=false)<br/>
RecursiveReadOnlyMounts=true|false (BETA - 默认值=true)<br/>
RelaxedEnvironmentVariableValidation=true|false (ALPHA - 默认值=false)<br/>
ReloadKubeletServerCertificateFile=true|false (BETA - 默认值=true)<br/>
ResilientWatchCacheInitialization=true|false (BETA - 默认值=true)<br/>
ResourceHealthStatus=true|false (ALPHA - 默认值=false)<br/>
RetryGenerateName=true|false (BETA - 默认值=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - 默认值=true)<br/>
RuntimeClassInImageCriApi=true|false (ALPHA - 默认值=false)<br/>
SELinuxMount=true|false (ALPHA - 默认值=false)<br/>
SELinuxMountReadWriteOncePod=true|false (BETA - 默认值=true)<br/>
SchedulerQueueingHints=true|false (BETA - 默认值=false)<br/>
SeparateCacheWatchRPC=true|false (BETA - 默认值=true)<br/>
SeparateTaintEvictionController=true|false (BETA - 默认值=true)<br/>
ServiceAccountTokenJTI=true|false (BETA - 默认值=true)<br/>
ServiceAccountTokenNodeBinding=true|false (BETA - 默认值=true)<br/>
ServiceAccountTokenNodeBindingValidation=true|false (BETA - 默认值=true)<br/>
ServiceAccountTokenPodNodeInfo=true|false (BETA - 默认值=true)<br/>
ServiceTrafficDistribution=true|false (BETA - 默认值=true)<br/>
SidecarContainers=true|false (BETA - 默认值=true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - 默认值=true)<br/>
StatefulSetAutoDeletePVC=true|false (BETA - 默认值=true)<br/>
StorageNamespaceIndex=true|false (BETA - 默认值=true)<br/>
StorageVersionAPI=true|false (ALPHA - 默认值=false)<br/>
StorageVersionHash=true|false (BETA - 默认值=true)<br/>
StorageVersionMigrator=true|false (ALPHA - 默认值=false)<br/>
StrictCostEnforcementForVAP=true|false (BETA - 默认值=false)<br/>
StrictCostEnforcementForWebhooks=true|false (BETA - 默认值=false)<br/>
StructuredAuthenticationConfiguration=true|false (BETA - 默认值=true)<br/>
StructuredAuthorizationConfiguration=true|false (BETA - 默认值=true)<br/>
SupplementalGroupsPolicy=true|false (ALPHA - 默认值=false)<br/>
TopologyAwareHints=true|false (BETA - 默认值=true)<br/>
TopologyManagerPolicyAlphaOptions=true|false (ALPHA - 默认值=false)<br/>
TopologyManagerPolicyBetaOptions=true|false (BETA - 默认值=true)<br/>
TopologyManagerPolicyOptions=true|false (BETA - 默认值=true)<br/>
TranslateStreamCloseWebsocketRequests=true|false (BETA - 默认值=true)<br/>
UnauthenticatedHTTP2DOSMitigation=true|false (BETA - 默认值=true)<br/>
UnknownVersionInteroperabilityProxy=true|false (ALPHA - 默认值=false)<br/>
UserNamespacesPodSecurityStandards=true|false (ALPHA - 默认值=false)<br/>
UserNamespacesSupport=true|false (BETA - 默认值=false)<br/>
VolumeAttributesClass=true|false (BETA - 默认值=false)<br/>
VolumeCapacityPriority=true|false (ALPHA - 默认值=false)<br/>
WatchCacheInitializationPostStartHook=true|false (BETA - 默认值=false)<br/>
WatchFromStorageWithoutResourceVersion=true|false (BETA - 默认值=false)<br/>
WatchList=true|false (ALPHA - 默认值=false)<br/>
WatchListClient=true|false (BETA - 默认值=false)<br/>
WinDSR=true|false (ALPHA - 默认值=false)<br/>
WinOverlay=true|false (BETA - 默认值=true)<br/>
WindowsHostNetwork=true|false (ALPHA - 默认值=true)<br/>
如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：<code>0.0.0.0:10256</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--  
The IP address and port for the health check server to serve on, defaulting to &quot;0.0.0.0:10256&quot;. This parameter is ignored if a config file is specified by --config.
-->
服务健康状态检查的 IP 地址和端口，默认为 “0.0.0.0:10256”。
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
If non-empty, will be used as the name of the Node that kube-proxy is running on. If unset, the node name is assumed to be the same as the node's hostname.
-->
如果非空，将使用此字符串而不是实际的主机名作为标识。
如果不设置，节点名称假定为与节点的主机名相同。
</p>
</td>
</tr>

<tr>
<td colspan="2">--init-only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, perform any initialization steps that must be done with full root privileges, and then exit. After doing this, you can run kube-proxy again with only the CAP_NET_ADMIN capability.
-->
如果设置为 true，则执行需要完整 root 权限才能执行的所有初始化步骤，然后退出。
完成此操作后，你可以仅使用 CAP_NET_ADMIN 权能再次运行 kube-proxy。
</p></td>
</tr>

<tr>
<td colspan="2">--iptables-localhost-nodeports&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
If false, kube-proxy will disable the legacy behavior of allowing NodePort services to be accessed via localhost. (Applies only to iptables mode and IPv4; localhost NodePorts are never allowed with other proxy modes or with IPv6.)
-->
<p>
如果设为 false，Kube-proxy 将禁用允许通过本地主机访问 NodePort 服务的传统行为，
这仅适用于 iptables 模式和 ipv4。本地主机的 NodePort 在其他代理模式或 IPv6 下是不允许的。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If using the iptables or ipvs proxy mode, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].
-->
在使用 iptables 或 ipvs 代理模式时，用来设置 fwmark 空间的 bit，标记需要
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
The minimum period between iptables rule resyncs (e.g. '5s', '1m', '2h22m'). A value of 0 means every Service or EndpointSlice change will result in an immediate iptables resync.
-->
iptables 规则重新同步之间的最小间隔（例如 '5s'、'1m'、'2h22m'）。
值为 0 表示每次 Service 或 EndpointSlice 更改都会立即进行 iptables 重新同步。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
An interval (e.g. '5s', '1m', '2h22m') indicating how frequently various re-synchronizing and cleanup operations are performed. Must be greater than 0.
-->
表示各种重新同步和清理操作执行频率的时间间隔（例如 '5s'、'1m'、'2h22m'）。必须大于 0。
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
<td colspan="2">--ipvs-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The minimum period between IPVS rule resyncs (e.g. '5s', '1m', '2h22m'). A value of 0 means every Service or EndpointSlice change will result in an immediate IPVS resync.
-->
ipvs 规则重新同步之间的最小间隔（例如 '5s'、'1m'、'2h22m'）。
值为 0 表示每次 Service 或 EndpointSlice 更改都会立即进行 ipvs 重新同步。
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
An interval (e.g. '5s', '1m', '2h22m') indicating how frequently various re-synchronizing and cleanup operations are performed. Must be greater than 0.
-->
表示各种重新同步和清理操作执行频率的时间间隔（例如 '5s'、'1m'、'2h22m'）。必须大于 0。
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
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Maximum number of seconds between log flushes
-->
日志清洗之间的最大秒数
</p>
</td>
</tr>

<tr>
<td colspan="2">--log-text-info-buffer-size quantity</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[Alpha] In text format with split output streams, the info messages can be buffered for a while to increase performance.
The default value of zero bytes disables buffering.
The size can be specified as number of bytes (512), multiples of 1000 (1K), multiples of 1024 (2Ki), or powers of those (3M, 4G, 5Mi, 6Gi).
Enable the LoggingAlphaOptions feature gate to use this.
-->
[Alpha] 在具有分割输出流的文本格式中，信息消息可以被缓冲一段时间以提高性能。
默认值零字节表示禁用缓冲机制。
大小可以指定为字节数（512）、1000 的倍数（1K）、1024 的倍数（2Ki）或它们的幂（3M、4G、5Mi、6Gi）。
启用 LoggingAlphaOptions 特性门控以使用此功能。
</p>
</td>

<tr>
<td colspan="2">--log-text-split-stream</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[Alpha] In text format, write error messages to stderr and info messages to stdout.
The default is to write a single stream to stdout.
Enable the LoggingAlphaOptions feature gate to use this.
-->
[Alpha] 以文本格式，将错误消息写入 stderr，将信息消息写入 stdout。
默认是将单个流写入标准输出。
启用 LoggingAlphaOptions 特性门控以使用它。
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
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Sets the log format. Permitted formats: &quot;text&quot;.
-->
设置日志格式。允许的格式为：&quot;text&quot;。
</p>
</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>

<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
log to standard error instead of files
-->
日志输出到 stderr 而不是文件。
</p></td>
</tr>

<tr>
<td colspan="2">--masquerade-all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If using the iptables or ipvs proxy mode, SNAT all traffic sent via Service cluster IPs. This may be required with some CNI plugins.
SNAT all traffic sent via Service cluster IPs. This may be required with some CNI plugins. Only supported on Linux.
-->
对通过 Service 集群 IP 发送的所有流量进行 SNAT。
这对某些 CNI 插件可能是必需的。仅支持 Linux。
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
The IP address and port for the metrics server to serve on, defaulting to &quot;127.0.0.1:10249&quot;. (Set to &quot;0.0.0.0:10249&quot; / &quot;[::]:10249&quot; to bind on all interfaces.) Set empty to disable. This parameter is ignored if a config file is specified by --config.
-->
metrics 服务器要使用的 IP 地址和端口。
如果 <code>--bind-address</code> 未设置或设置为 IPv4，则默认为 "127.0.0.1:10249"。
设置为 "0.0.0.0:10249" / "[::]:10249" 可以在所有接口上进行绑定。
设置为空则禁用。如果配置文件由 <code>--config</code> 指定，则忽略此参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">--nodeport-addresses strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
A list of CIDR ranges that contain valid node IPs, or alternatively, the single string 'primary'. If set to a list of CIDRs, connections to NodePort services will only be accepted on node IPs in one of the indicated ranges. If set to 'primary', NodePort services will only be accepted on the node's primary IP(s) according to the Node object. If unset, NodePort connections will be accepted on all local IPs. This parameter is ignored if a config file is specified by --config.
-->
一个包含有效节点 IP 的 CIDR 范围列表，或者单个字符串 “primary”。
如果设置为 CIDR 列表，则仅在某所给范围内的节点 IP 上接受对 NodePort 服务的连接。
如果设置为 “primary”，则将根据 Node 对象仅在其主 IP 上接受对 NodePort 服务的连接。
如果不设置，则 NodePort 连接将在所有本地 IP 上被接受。
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
A bridge interface name. When --detect-local-mode is set to BridgeInterface, kube-proxy will consider traffic to be local if it originates from this bridge.
-->
一个桥接接口名称。当 <code>--detect-local-mode</code> 设置为 BridgeInterface 时，
kube-proxy 会将源自此桥接的流量视为本地流量。
</td>
</tr>

<tr>
<td colspan="2">--pod-interface-name-prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
An interface name prefix. When --detect-local-mode is set to InterfaceNamePrefix, kube-proxy will consider traffic to be local if it originates from any interface whose name begins with this prefix.
-->
一个接口名称前缀。当 <code>--detect-local-mode</code> 设置为 InterfaceNamePrefix 时，
kube-proxy 会将源自名称以该前缀开头的所有接口的流量视为本地流量。
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
如果为 true，则避免在日志消息中使用头部前缀。
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
logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=true)
-->
当写入到文件或 stderr 时设置严重程度达到或超过此阈值的日志输出到 stderr
（当 <code>--logtostderr=true</code> 或 <code>--alsologtostderr=true</code> 时不生效）。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version
-->
--version, --version=raw 打印版本信息并退出；
--version=vX.Y.Z... 设置报告的版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--vmodule pattern=N,...</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
comma-separated list of pattern=N settings for file-filtered logging (only works for text log format)
-->
以逗号分割的 pattern=N 设置的列表，用于文件过滤日志（仅适用于文本日志格式）
</p>
</td>
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
