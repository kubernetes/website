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
Kubernetes 網路代理在每個節點上運行。網路代理反映了每個節點上 Kubernetes API
中定義的服務，並且可以執行簡單的 TCP、UDP 和 SCTP 流轉發，或者在一組後端進行
循環 TCP、UDP 和 SCTP 轉發。
當前可通過 Docker-links-compatible 環境變量找到服務叢集 IP 和端口，
這些環境變量指定了服務代理打開的端口。
有一個可選的插件，可以爲這些叢集 IP 提供叢集 DNS。
使用者必須使用 apiserver API 創建服務才能設定代理。

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
如果爲 true，將檔案目錄添加到日誌消息的頭部
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
設置爲 true 表示將日誌輸出到檔案的同時輸出到 stderr（當 <code>--logtostderr=true</code> 時不生效）
</p>
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Overrides kube-proxy's idea of what its node's primary IP is. Note that the name is a historical artifact, and kube-proxy does not actually bind any sockets to this IP. This parameter is ignored if a config file is specified by --config.
-->
重寫 kube-proxy 對其節點主要 IP 的理解。請注意，此名稱是一個歷史遺留字段，
並且 kube-proxy 實際上並沒有將任何套接字綁定到此 IP。
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
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
如果爲 true，清理 iptables 和 ipvs 規則並退出。
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
叢集中 Pod 的 CIDR 範圍。對於雙協議棧叢集，這可以是逗號分隔的雙協議棧 CIDR 範圍對。
當 <code>--detect-local-mode</code> 設置爲 ClusterCIDR 時，
kube-proxy 會將源 IP 在此範圍內的流量視爲本地流量。否則不使用此字段。
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
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
設定檔案的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：15m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
How often configuration from the apiserver is refreshed.  Must be greater than 0.
-->
來自 apiserver 的設定的刷新頻率。必須大於 0。
</p>
</td>
</tr>

<tr>
<td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：32768</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Maximum number of NAT connections to track per CPU core (0 to leave the limit as-is and ignore conntrack-min).
-->
每個 CPU 核跟蹤的最大 NAT 連接數（0 表示保留當前限制並忽略 conntrack-min 設置）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：131072</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Minimum number of conntrack entries to allocate, regardless of conntrack-max-per-core (set conntrack-max-per-core=0 to leave the limit as-is).
-->
無論 <code>conntrack-max-per-core</code> 多少，要分配的 conntrack
條目的最小數量（將 <code>conntrack-max-per-core</code> 設置爲 0 即可
保持當前的限制）。
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
通過將 <code>nf_conntrack_tcp_be_liberal</code> 設置爲 1，啓用寬鬆模式以跟蹤 TCP 資料包。
</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1h0m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
NAT timeout for TCP connections in the CLOSE_WAIT state
-->
處於 <code>CLOSE_WAIT</code> 狀態的 TCP 連接的 NAT 超時。
</p>
</td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：24h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Idle timeout for established TCP connections (0 to leave as-is)
-->
已建立的 TCP 連接的空閒超時（0 保持當前設置）。
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
UNREPLIED UDP 連接的空閒超時（0 保持當前設置）。
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
ASSURED UDP 連接的空閒超時（0 保持當前設置）。
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
用於檢測本地流量的模式。
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
</p>
</td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;<!--comma-separated 'key=True|False' pairs-->逗號分隔的 'key=True|False' 對&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>
APIResponseCompression=true|false (BETA - default=true)<br/>
APIServerIdentity=true|false (BETA - default=true)<br/>
APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
AllAlpha=true|false (ALPHA - default=false)<br/>
AllBeta=true|false (BETA - default=false)<br/>
AllowParsingUserUIDFromCertAuth=true|false (BETA - default=true)<br/>
AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
ClearingNominatedNodeNameAfterBinding=true|false (ALPHA - default=false)<br/>
ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
ClusterTrustBundle=true|false (BETA - default=false)<br/>
ClusterTrustBundleProjection=true|false (BETA - default=false)<br/>
ComponentFlagz=true|false (ALPHA - default=false)<br/>
ComponentStatusz=true|false (ALPHA - default=false)<br/>
ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
ContainerCheckpoint=true|false (BETA - default=true)<br/>
ContainerRestartRules=true|false (ALPHA - default=false)<br/>
ContainerStopSignals=true|false (ALPHA - default=false)<br/>
ContextualLogging=true|false (BETA - default=true)<br/>
CoordinatedLeaderElection=true|false (BETA - default=false)<br/>
CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
DRAAdminAccess=true|false (BETA - default=true)<br/>
DRAConsumableCapacity=true|false (ALPHA - default=false)<br/>
DRADeviceBindingConditions=true|false (ALPHA - default=false)<br/>
DRADeviceTaints=true|false (ALPHA - default=false)<br/>
DRAExtendedResource=true|false (ALPHA - default=false)<br/>
DRAPartitionableDevices=true|false (ALPHA - default=false)<br/>
DRAPrioritizedList=true|false (BETA - default=true)<br/>
DRAResourceClaimDeviceStatus=true|false (BETA - default=true)<br/>
DRASchedulerFilterTimeout=true|false (BETA - default=true)<br/>
DeclarativeValidation=true|false (BETA - default=true)<br/>
DeclarativeValidationTakeover=true|false (BETA - default=false)<br/>
DeploymentReplicaSetTerminatingReplicas=true|false (ALPHA - default=false)<br/>
DetectCacheInconsistency=true|false (BETA - default=true)<br/>
DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - default=true)<br/>
EnvFiles=true|false (ALPHA - default=false)<br/>
EventedPLEG=true|false (ALPHA - default=false)<br/>
ExternalServiceAccountTokenSigner=true|false (BETA - default=true)<br/>
GracefulNodeShutdown=true|false (BETA - default=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
HPAConfigurableTolerance=true|false (ALPHA - default=false)<br/>
HPAScaleToZero=true|false (ALPHA - default=false)<br/>
HostnameOverride=true|false (ALPHA - default=false)<br/>
ImageMaximumGCAge=true|false (BETA - default=true)<br/>
ImageVolume=true|false (BETA - default=false)<br/>
InOrderInformers=true|false (BETA - default=true)<br/>
InPlacePodVerticalScaling=true|false (BETA - default=true)<br/>
InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - default=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
InformerResourceVersion=true|false (ALPHA - default=false)<br/>
JobManagedBy=true|false (BETA - default=true)<br/>
KubeletCrashLoopBackOffMax=true|false (ALPHA - default=false)<br/>
KubeletEnsureSecretPulledImages=true|false (ALPHA - default=false)<br/>
KubeletFineGrainedAuthz=true|false (BETA - default=true)<br/>
KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
KubeletPSI=true|false (BETA - default=true)<br/>
KubeletPodResourcesDynamicResources=true|false (BETA - default=true)<br/>
KubeletPodResourcesGet=true|false (BETA - default=true)<br/>
KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - default=true)<br/>
ListFromCacheSnapshot=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
LoggingBetaOptions=true|false (BETA - default=true)<br/>
MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - default=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
MemoryQoS=true|false (ALPHA - default=false)<br/>
MutableCSINodeAllocatableCount=true|false (BETA - default=false)<br/>
MutatingAdmissionPolicy=true|false (BETA - default=false)<br/>
NodeLogQuery=true|false (BETA - default=false)<br/>
NominatedNodeNameForExpectation=true|false (ALPHA - default=false)<br/>
OpenAPIEnums=true|false (BETA - default=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
PodCertificateRequest=true|false (ALPHA - default=false)<br/>
PodDeletionCost=true|false (BETA - default=true)<br/>
PodLevelResources=true|false (BETA - default=true)<br/>
PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
PodObservedGenerationTracking=true|false (BETA - default=true)<br/>
PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
PodTopologyLabelsAdmission=true|false (ALPHA - default=false)<br/>
PortForwardWebsockets=true|false (BETA - default=true)<br/>
PreferSameTrafficDistribution=true|false (BETA - default=true)<br/>
PreventStaticPodAPIReferences=true|false (BETA - default=true)<br/>
ProcMountType=true|false (BETA - default=true)<br/>
QOSReserved=true|false (ALPHA - default=false)<br/>
ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - default=false)<br/>
RelaxedServiceNameValidation=true|false (ALPHA - default=false)<br/>
ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
RemoteRequestHeaderUID=true|false (BETA - default=true)<br/>
ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
SELinuxChangePolicy=true|false (BETA - default=true)<br/>
SELinuxMount=true|false (BETA - default=false)<br/>
SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
SchedulerAsyncAPICalls=true|false (BETA - default=true)<br/>
SchedulerAsyncPreemption=true|false (BETA - default=true)<br/>
SchedulerPopFromBackoffQ=true|false (BETA - default=true)<br/>
ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
SizeBasedListCostEstimate=true|false (BETA - default=true)<br/>
StorageCapacityScoring=true|false (ALPHA - default=false)<br/>
StorageVersionAPI=true|false (ALPHA - default=false)<br/>
StorageVersionHash=true|false (BETA - default=true)<br/>
StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
StrictIPCIDRValidation=true|false (ALPHA - default=false)<br/>
StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - default=true)<br/>
SupplementalGroupsPolicy=true|false (BETA - default=true)<br/>
SystemdWatchdog=true|false (BETA - default=true)<br/>
TokenRequestServiceAccountUIDValidation=true|false (BETA - default=true)<br/>
TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
UserNamespacesSupport=true|false (BETA - default=true)<br/>
WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
WatchList=true|false (BETA - default=true)<br/>
WatchListClient=true|false (BETA - default=false)<br/>
WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
WindowsGracefulNodeShutdown=true|false (BETA - default=true)<br/>
This parameter is ignored if a config file is specified by --config.
-->
一組 key=value 對，用來描述測試性/試驗性功能的特性門控。可選項有：<br/>
APIResponseCompression=true|false (BETA - 預設值=true)<br/>
APIServerIdentity=true|false (BETA - 預設值=true)<br/>
APIServingWithRoutine=true|false (ALPHA - 預設值=false)<br/>
AllAlpha=true|false (ALPHA - 預設值=false)<br/>
AllBeta=true|false (BETA - 預設值=false)<br/>
AllowParsingUserUIDFromCertAuth=true|false (BETA - 預設值=true)<br/>
AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - 預設值=false)<br/>
CBORServingAndStorage=true|false (ALPHA - 預設值=false)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - 預設值=false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - 預設值=true)<br/>
CSIVolumeHealth=true|false (ALPHA - 預設值=false)<br/>
ClearingNominatedNodeNameAfterBinding=true|false (ALPHA - 預設值=false)<br/>
ClientsAllowCBOR=true|false (ALPHA - 預設值=false)<br/>
ClientsPreferCBOR=true|false (ALPHA - 預設值=false)<br/>
CloudControllerManagerWebhook=true|false (ALPHA - 預設值=false)<br/>
ClusterTrustBundle=true|false (BETA - 預設值=false)<br/>
ClusterTrustBundleProjection=true|false (BETA - 預設值=false)<br/>
ComponentFlagz=true|false (ALPHA - 預設值=false)<br/>
ComponentStatusz=true|false (ALPHA - 預設值=false)<br/>
ConcurrentWatchObjectDecode=true|false (BETA - 預設值=false)<br/>
ContainerCheckpoint=true|false (BETA - 預設值=true)<br/>
ContainerRestartRules=true|false (ALPHA - 預設值=false)<br/>
ContainerStopSignals=true|false (ALPHA - 預設值=false)<br/>
ContextualLogging=true|false (BETA - 預設值=true)<br/>
CoordinatedLeaderElection=true|false (BETA - 預設值=false)<br/>
CrossNamespaceVolumeDataSource=true|false (ALPHA - 預設值=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 預設值=false)<br/>
DRAAdminAccess=true|false (BETA - 預設值=true)<br/>
DRAConsumableCapacity=true|false (ALPHA - 預設值=false)<br/>
DRADeviceBindingConditions=true|false (ALPHA - 預設值=false)<br/>
DRADeviceTaints=true|false (ALPHA - 預設值=false)<br/>
DRAExtendedResource=true|false (ALPHA - 預設值=false)<br/>
DRAPartitionableDevices=true|false (ALPHA - 預設值=false)<br/>
DRAPrioritizedList=true|false (BETA - 預設值=true)<br/>
DRAResourceClaimDeviceStatus=true|false (BETA - 預設值=true)<br/>
DRASchedulerFilterTimeout=true|false (BETA - 預設值=true)<br/>
DeclarativeValidation=true|false (BETA - 預設值=true)<br/>
DeclarativeValidationTakeover=true|false (BETA - 預設值=false)<br/>
DeploymentReplicaSetTerminatingReplicas=true|false (ALPHA - 預設值=false)<br/>
DetectCacheInconsistency=true|false (BETA - 預設值=true)<br/>
DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - 預設值=true)<br/>
EnvFiles=true|false (ALPHA - 預設值=false)<br/>
EventedPLEG=true|false (ALPHA - 預設值=false)<br/>
ExternalServiceAccountTokenSigner=true|false (BETA - 預設值=true)<br/>
GracefulNodeShutdown=true|false (BETA - 預設值=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 預設值=true)<br/>
HPAConfigurableTolerance=true|false (ALPHA - 預設值=false)<br/>
HPAScaleToZero=true|false (ALPHA - 預設值=false)<br/>
HostnameOverride=true|false (ALPHA - 預設值=false)<br/>
ImageMaximumGCAge=true|false (BETA - 預設值=true)<br/>
ImageVolume=true|false (BETA - 預設值=false)<br/>
InOrderInformers=true|false (BETA - 預設值=true)<br/>
InPlacePodVerticalScaling=true|false (BETA - 預設值=true)<br/>
InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - 預設值=false)<br/>
InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - 預設值=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - 預設值=false)<br/>
InformerResourceVersion=true|false (ALPHA - 預設值=false)<br/>
JobManagedBy=true|false (BETA - 預設值=true)<br/>
KubeletCrashLoopBackOffMax=true|false (ALPHA - 預設值=false)<br/>
KubeletEnsureSecretPulledImages=true|false (ALPHA - 預設值=false)<br/>
KubeletFineGrainedAuthz=true|false (BETA - 預設值=true)<br/>
KubeletInUserNamespace=true|false (ALPHA - 預設值=false)<br/>
KubeletPSI=true|false (BETA - 預設值=true)<br/>
KubeletPodResourcesDynamicResources=true|false (BETA - 預設值=true)<br/>
KubeletPodResourcesGet=true|false (BETA - 預設值=true)<br/>
KubeletSeparateDiskGC=true|false (BETA - 預設值=true)<br/>
KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - 預設值=true)<br/>
ListFromCacheSnapshot=true|false (BETA - 預設值=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - 預設值=false)<br/>
LoggingAlphaOptions=true|false (ALPHA - 預設值=false)<br/>
LoggingBetaOptions=true|false (BETA - 預設值=true)<br/>
MatchLabelKeysInPodTopologySpread=true|false (BETA - 預設值=true)<br/>
MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - 預設值=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - 預設值=false)<br/>
MemoryQoS=true|false (ALPHA - 預設值=false)<br/>
MutableCSINodeAllocatableCount=true|false (BETA - 預設值=false)<br/>
MutatingAdmissionPolicy=true|false (BETA - 預設值=false)<br/>
NodeLogQuery=true|false (BETA - 預設值=false)<br/>
NominatedNodeNameForExpectation=true|false (ALPHA - 預設值=false)<br/>
OpenAPIEnums=true|false (BETA - 預設值=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - 預設值=false)<br/>
PodCertificateRequest=true|false (ALPHA - 預設值=false)<br/>
PodDeletionCost=true|false (BETA - 預設值=true)<br/>
PodLevelResources=true|false (BETA - 預設值=true)<br/>
PodLogsQuerySplitStreams=true|false (ALPHA - 預設值=false)<br/>
PodObservedGenerationTracking=true|false (BETA - 預設值=true)<br/>
PodReadyToStartContainersCondition=true|false (BETA - 預設值=true)<br/>
PodTopologyLabelsAdmission=true|false (ALPHA - 預設值=false)<br/>
PortForwardWebsockets=true|false (BETA - 預設值=true)<br/>
PreferSameTrafficDistribution=true|false (BETA - 預設值=true)<br/>
PreventStaticPodAPIReferences=true|false (BETA - 預設值=true)<br/>
ProcMountType=true|false (BETA - 預設值=true)<br/>
QOSReserved=true|false (ALPHA - 預設值=false)<br/>
ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - 預設值=false)<br/>
RelaxedServiceNameValidation=true|false (ALPHA - 預設值=false)<br/>
ReloadKubeletServerCertificateFile=true|false (BETA - 預設值=true)<br/>
RemoteRequestHeaderUID=true|false (BETA - 預設值=true)<br/>
ResourceHealthStatus=true|false (ALPHA - 預設值=false)<br/>
RotateKubeletServerCertificate=true|false (BETA - 預設值=true)<br/>
RuntimeClassInImageCriApi=true|false (ALPHA - 預設值=false)<br/>
SELinuxChangePolicy=true|false (BETA - 預設值=true)<br/>
SELinuxMount=true|false (BETA - 預設值=false)<br/>
SELinuxMountReadWriteOncePod=true|false (BETA - 預設值=true)<br/>
SchedulerAsyncAPICalls=true|false (BETA - 預設值=true)<br/>
SchedulerAsyncPreemption=true|false (BETA - 預設值=true)<br/>
SchedulerPopFromBackoffQ=true|false (BETA - 預設值=true)<br/>
ServiceAccountNodeAudienceRestriction=true|false (BETA - 預設值=true)<br/>
SizeBasedListCostEstimate=true|false (BETA - 預設值=true)<br/>
StorageCapacityScoring=true|false (ALPHA - 預設值=false)<br/>
StorageVersionAPI=true|false (ALPHA - 預設值=false)<br/>
StorageVersionHash=true|false (BETA - 預設值=true)<br/>
StorageVersionMigrator=true|false (ALPHA - 預設值=false)<br/>
StrictIPCIDRValidation=true|false (ALPHA - 預設值=false)<br/>
StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - 預設值=true)<br/>
SupplementalGroupsPolicy=true|false (BETA - 預設值=true)<br/>
SystemdWatchdog=true|false (BETA - 預設值=true)<br/>
TokenRequestServiceAccountUIDValidation=true|false (BETA - 預設值=true)<br/>
TopologyManagerPolicyAlphaOptions=true|false (ALPHA - 預設值=false)<br/>
TopologyManagerPolicyBetaOptions=true|false (BETA - 預設值=true)<br/>
TranslateStreamCloseWebsocketRequests=true|false (BETA - 預設值=true)<br/>
UnauthenticatedHTTP2DOSMitigation=true|false (BETA - 預設值=true)<br/>
UnknownVersionInteroperabilityProxy=true|false (ALPHA - 預設值=false)<br/>
UserNamespacesPodSecurityStandards=true|false (ALPHA - 預設值=false)<br/>
UserNamespacesSupport=true|false (BETA - 預設值=true)<br/>
WatchCacheInitializationPostStartHook=true|false (BETA - 預設值=false)<br/>
WatchList=true|false (BETA - 預設值=true)<br/>
WatchListClient=true|false (BETA - 預設值=false)<br/>
WindowsCPUAndMemoryAffinity=true|false (ALPHA - 預設值=false)<br/>
WindowsGracefulNodeShutdown=true|false (BETA - 預設值=true)<br/>
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
</p>
</td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>0.0.0.0:10256</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--  
The IP address and port for the health check server to serve on, defaulting to &quot;0.0.0.0:10256&quot;. This parameter is ignored if a config file is specified by --config.
-->
服務健康狀態檢查的 IP 地址和端口，預設爲 “0.0.0.0:10256”。
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
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
kube-proxy 操作的幫助命令。
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
如果非空，將使用此字符串而不是實際的主機名作爲標識。
如果不設置，節點名稱假定爲與節點的主機名相同。
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
如果設置爲 true，則執行需要完整 root 權限才能執行的所有初始化步驟，然後退出。
完成此操作後，你可以僅使用 CAP_NET_ADMIN 權能再次運行 kube-proxy。
</p></td>
</tr>

<tr>
<td colspan="2">--iptables-localhost-nodeports&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
If false, kube-proxy will disable the legacy behavior of allowing NodePort services to be accessed via localhost. (Applies only to iptables mode and IPv4; localhost NodePorts are never allowed with other proxy modes or with IPv6.)
-->
<p>
如果設爲 false，Kube-proxy 將禁用允許通過本地主機訪問 NodePort 服務的傳統行爲，
這僅適用於 iptables 模式和 ipv4。本地主機的 NodePort 在其他代理模式或 IPv6 下是不允許的。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If using the iptables or ipvs proxy mode, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].
-->
在使用 iptables 或 ipvs 代理模式時，用來設置 fwmark 空間的 bit，標記需要
SNAT 的資料包。必須在 [0,31] 範圍內。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The minimum period between iptables rule resyncs (e.g. '5s', '1m', '2h22m'). A value of 0 means every Service or EndpointSlice change will result in an immediate iptables resync.
-->
iptables 規則重新同步之間的最小間隔（例如 '5s'、'1m'、'2h22m'）。
值爲 0 表示每次 Service 或 EndpointSlice 更改都會立即進行 iptables 重新同步。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
An interval (e.g. '5s', '1m', '2h22m') indicating how frequently various re-synchronizing and cleanup operations are performed. Must be greater than 0.
-->
表示各種重新同步和清理操作執行頻率的時間間隔（例如 '5s'、'1m'、'2h22m'）。必須大於 0。
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
逗號分隔的 CIDR 列表，ipvs 代理在清理 IPVS 規則時不會此列表中的地址範圍。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The minimum period between IPVS rule resyncs (e.g. '5s', '1m', '2h22m'). A value of 0 means every Service or EndpointSlice change will result in an immediate IPVS resync.
-->
ipvs 規則重新同步之間的最小間隔（例如 '5s'、'1m'、'2h22m'）。
值爲 0 表示每次 Service 或 EndpointSlice 更改都會立即進行 ipvs 重新同步。
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
代理模式爲 ipvs 時所選的 ipvs 調度器類型。
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
通過將 <code>arp_ignore</code> 設置爲 1 並將 <code>arp_announce</code>
設置爲 2 啓用嚴格的 ARP。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
An interval (e.g. '5s', '1m', '2h22m') indicating how frequently various re-synchronizing and cleanup operations are performed. Must be greater than 0.
-->
表示各種重新同步和清理操作執行頻率的時間間隔（例如 '5s'、'1m'、'2h22m'）。必須大於 0。
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
空閒 IPVS TCP 連接的超時時間，0 保持連接（例如 '5s'、'1m'、'2h22m'）。
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
收到 FIN 資料包後，IPVS TCP 連接的超時，0 保持當前設置不變。（例如 '5s'、'1m'、'2h22m'）。
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
IPVS UDP 資料包的超時，0 保持當前設置不變。（例如 '5s'、'1m'、'2h22m'）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Burst to use while talking with kubernetes apiserver
-->
與 kubernetes apiserver 通信的突發數量。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Content type of requests sent to apiserver.
-->
發送到 apiserver 的請求的內容類型。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
QPS to use while talking with kubernetes apiserver
-->
與 kubernetes apiserver 交互時使用的 QPS。
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
包含鑑權資訊的 kubeconfig 檔案的路徑（主控節點位置由 master 標誌設置）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Maximum number of seconds between log flushes
-->
日誌清洗之間的最大秒數
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
[Alpha] 在具有分割輸出流的文本格式中，資訊消息可以被緩衝一段時間以提高性能。
預設值零字節表示禁用緩衝機制。
大小可以指定爲字節數（512）、1000 的倍數（1K）、1024 的倍數（2Ki）或它們的冪（3M、4G、5Mi、6Gi）。
啓用 LoggingAlphaOptions 特性門控以使用此功能。
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
[Alpha] 以文本格式，將錯誤消息寫入 stderr，將資訊消息寫入 stdout。
預設是將單個流寫入標準輸出。
啓用 LoggingAlphaOptions 特性門控以使用它。
</p>
</td>
</tr>

<tr>
<td colspan="2">--log_backtrace_at &lt;<!--a string in the form 'file:N'-->“file:N” 格式的字符串&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
when logging hits line file:N, emit a stack trace
-->
當日誌命中 file:N，觸發一次堆棧追蹤
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
如果非空，則在此目錄中寫入日誌檔案（當 <code>--logtostderr=true</code> 時不生效）
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
如果非空，使用此日誌檔案（當 <code>--logtostderr=true</code> 時不生效）
</p></td>
</tr>

<tr>
<td colspan="2">--log_file_max_size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Defines the maximum size a log file can grow to (no effect when -logtostderr=true). Unit is megabytes. If the value is 0, the maximum file size is unlimited.
-->
定義日誌檔案可以增長到的最大大小（當 <code>--logtostderr=true</code> 時不生效）。
單位是兆字節。如果值爲 0，則最大檔案大小不受限制。
</p></td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Sets the log format. Permitted formats: &quot;text&quot;.
-->
設置日誌格式。允許的格式爲：&quot;text&quot;。
</p>
</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>

<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
log to standard error instead of files
-->
日誌輸出到 stderr 而不是檔案。
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
對通過 Service 叢集 IP 發送的所有流量進行 SNAT。
這對某些 CNI 插件可能是必需的。僅支持 Linux。
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
Kubernetes API 伺服器的地址（覆蓋 kubeconfig 中的相關值）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--metrics-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>127.0.0.1:10249</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The IP address and port for the metrics server to serve on, defaulting to &quot;127.0.0.1:10249&quot;. (Set to &quot;0.0.0.0:10249&quot; / &quot;[::]:10249&quot; to bind on all interfaces.) Set empty to disable. This parameter is ignored if a config file is specified by --config.
-->
metrics 伺服器要使用的 IP 地址和端口。
如果 <code>--bind-address</code> 未設置或設置爲 IPv4，則預設爲 "127.0.0.1:10249"。
設置爲 "0.0.0.0:10249" / "[::]:10249" 可以在所有介面上進行綁定。
設置爲空則禁用。如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
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
一個包含有效節點 IP 的 CIDR 範圍列表，或者單個字符串 “primary”。
如果設置爲 CIDR 列表，則僅在某所給範圍內的節點 IP 上接受對 NodePort 服務的連接。
如果設置爲 “primary”，則將根據 Node 對象僅在其主 IP 上接受對 NodePort 服務的連接。
如果不設置，則 NodePort 連接將在所有本地 IP 上被接受。
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
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
如果爲 true，則僅將日誌寫入其本身的嚴重性級別
（而不是寫入每個較低的嚴重性級別；當 <code>--logtostderr=true</code> 時不生效）。
</p></td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：-999</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The oom-score-adj value for kube-proxy process. Values must be within the range [-1000, 1000]. This parameter is ignored if a config file is specified by --config.
-->
kube-proxy 進程中的 oom-score-adj 值，必須在 [-1000,1000] 範圍內。
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
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
一個橋接介面名稱。當 <code>--detect-local-mode</code> 設置爲 BridgeInterface 時，
kube-proxy 會將源自此橋接的流量視爲本地流量。
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
一個介面名稱前綴。當 <code>--detect-local-mode</code> 設置爲 InterfaceNamePrefix 時，
kube-proxy 會將源自名稱以該前綴開頭的所有介面的流量視爲本地流量。
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
如果爲 true，則通過 Web 介面 <code>/debug/pprof</code> 啓用性能分析。
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
</p>
</td>
</tr>

<tr>
<td colspan="2">--proxy-mode ProxyMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Which proxy mode to use: on Linux this can be 'iptables' (default), 'ipvs', or 'nftables'. On Windows the only supported value is 'kernelspace'. This parameter is ignored if a config file is specified by --config.
-->
使用哪種代理模式：在 Linux 上可以是 'iptables'（預設）、'ipvs' 或 'nftables'。
在 Windows 上唯一支持的值是 'kernelspace'。
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
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
要顯示隱藏指標的先前版本。
僅先前的次要版本有意義，不允許其他值。
格式爲 &lt;major&gt;.&lt;minor&gt;，例如 '1.16'。
這種格式的目的是確保你有機會注意到下一個發行版是否隱藏了其他指標，
而不是在之後將其永久刪除時感到驚訝。
如果設定檔案由 <code>--config</code> 指定，則忽略此參數。
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
如果爲 true，則避免在日誌消息中使用頭部前綴。
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
如果爲 true，則在打開日誌檔案時避免使用頭部（當 <code>--logtostderr=true</code> 時不生效）
</p></td>
</tr>

<tr>
<td colspan="2">--stderrthreshold int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=true)
-->
當寫入到檔案或 stderr 時設置嚴重程度達到或超過此閾值的日誌輸出到 stderr
（當 <code>--logtostderr=true</code> 或 <code>--alsologtostderr=true</code> 時不生效）。
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
設置日誌級別詳細程度的數值。
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
--version, --version=raw 打印版本資訊並退出；
--version=vX.Y.Z... 設置報告的版本。
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
以逗號分割的 pattern=N 設置的列表，用於檔案過濾日誌（僅適用於文本日誌格式）
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
如果設置，將預設設定資訊寫入此檔案並退出。
</p>
</td>
</tr>

</tbody>
</table>
