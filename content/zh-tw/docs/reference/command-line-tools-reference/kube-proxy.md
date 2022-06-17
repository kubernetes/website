---
title: kube-proxy
content_type: tool-reference
weight: 30
---
<!-- 
title: kube-proxy
content_type: tool-reference
weight: 28
-->

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the 
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
Kubernetes 網路代理在每個節點上執行。網路代理反映了每個節點上 Kubernetes API
中定義的服務，並且可以執行簡單的 TCP、UDP 和 SCTP 流轉發，或者在一組後端進行
迴圈 TCP、UDP 和 SCTP 轉發。
當前可透過 Docker-links-compatible 環境變數找到服務叢集 IP 和埠，
這些環境變數指定了服務代理開啟的埠。
有一個可選的外掛，可以為這些叢集 IP 提供叢集 DNS。
使用者必須使用 apiserver API 建立服務才能配置代理。

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
如果為 true，將檔案目錄新增到日誌訊息的頭部
</p>
</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
log to standard error as well as files
-->
設定為 true 表示將日誌輸出到檔案的同時輸出到 stderr
</p>
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The IP address for the proxy server to serve on (set to '0.0.0.0' for all IPv4 interfaces and '::' for all IPv6 interfaces). This parameter is ignored if a config file is specified by --config.
-->
代理伺服器的 IP 地址（所有 IPv4 介面設定為 “0.0.0.0”，所有 IPv6 介面設定為 “::”）。
如果配置檔案由 <code>--config</code> 指定，則忽略此引數。
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
如果為 true，kube-proxy 會將無法繫結埠的失敗操作視為致命錯誤並退出。
</p></td>
</tr>

<tr>
<td colspan="2">--boot_id_file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："/proc/sys/kernel/random/boot_id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- Comma-separated list of files to check for boot-id. Use the first one that exists. -->
逗號分隔的檔案列表，用於檢查 boot-id。使用第一個存在的檔案。
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
如果為 true，清理 iptables 和 ipvs 規則並退出。
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
叢集中 Pod 的 CIDR 範圍。配置後，將從該範圍之外傳送到服務叢集 IP
的流量被偽裝，從 Pod 傳送到外部 LoadBalancer IP
的流量將被重定向到相應的叢集 IP。
對於雙協議棧叢集，接受一個逗號分隔的列表，
每個 IP 協議族（IPv4 和 IPv6）至少包含一個 CIDR。
如果配置檔案由 --config 指定，則忽略此引數。
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
配置檔案的路徑。
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
來自 apiserver 的配置的重新整理頻率。必須大於 0。
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
每個 CPU 核跟蹤的最大 NAT 連線數（0 表示保留當前限制並忽略 conntrack-min 設定）。
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
條目的最小數量（將 <code>conntrack-max-per-core</code> 設定為 0 即可
保持當前的限制）。
</p>
</td>
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
處於 <code>CLOSE_WAIT</code> 狀態的 TCP 連線的 NAT 超時。
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
已建立的 TCP 連線的空閒超時（0 保持當前設定）。
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
用於檢測本地流量的模式。
如果配置檔案由 --config 指定，則忽略此引數。
</p>
</td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;<!--comma-separated 'key=True|False' pairs-->逗號分隔的 'key=True|False' 對&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
A set of key=value pairs that describe feature gates for alpha/experimental features. Options are
:<br/>
APIListChunking=true|false (BETA - default=true)<br/>
APIPriorityAndFairness=true|false (BETA - default=true)<br/>
APIResponseCompression=true|false (BETA - default=true)<br/>
APIServerIdentity=true|false (ALPHA - default=false)<br/>
APIServerTracing=true|false (ALPHA - default=false)<br/>
AllAlpha=true|false (ALPHA - default=false)<br/>
AllBeta=true|false (BETA - default=false)<br/>
AnyVolumeDataSource=true|false (BETA - default=true)<br/>
AppArmor=true|false (BETA - default=true)<br/>
CPUManager=true|false (BETA - default=true)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
CSIInlineVolume=true|false (BETA - default=true)<br/>
CSIMigration=true|false (BETA - default=true)<br/>
CSIMigrationAWS=true|false (BETA - default=true)<br/>
CSIMigrationAzureFile=true|false (BETA - default=true)<br/>
CSIMigrationGCE=true|false (BETA - default=true)<br/>
CSIMigrationPortworx=true|false (ALPHA - default=false)<br/>
CSIMigrationRBD=true|false (ALPHA - default=false)<br/>
CSIMigrationvSphere=true|false (BETA - default=false)<br/>
CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
CronJobTimeZone=true|false (ALPHA - default=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
CustomResourceValidationExpressions=true|false (ALPHA - default=false)<br/>
DaemonSetUpdateSurge=true|false (BETA - default=true)<br/>
DelegateFSGroupToCSIDriver=true|false (BETA - default=true)<br/>
DevicePlugins=true|false (BETA - default=true)<br/>
DisableAcceleratorUsageMetrics=true|false (BETA - default=true)<br/>
DisableCloudProviders=true|false (ALPHA - default=false)<br/>
DisableKubeletCloudCredentialProviders=true|false (ALPHA - default=false)<br/>
DownwardAPIHugePages=true|false (BETA - default=true)<br/>
EndpointSliceTerminatingCondition=true|false (BETA - default=true)<br/>
EphemeralContainers=true|false (BETA - default=true)<br/>
ExpandedDNSConfig=true|false (ALPHA - default=false)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>
GRPCContainerProbe=true|false (BETA - default=true)<br/>
GracefulNodeShutdown=true|false (BETA - default=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
HPAContainerMetrics=true|false (ALPHA - default=false)<br/>
HPAScaleToZero=true|false (ALPHA - default=false)<br/>
HonorPVReclaimPolicy=true|false (ALPHA - default=false)<br/>
IdentifyPodOS=true|false (BETA - default=true)<br/>
InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginRBDUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>
JobMutableNodeSchedulingDirectives=true|false (BETA - default=true)<br/>
JobReadyPods=true|false (BETA - default=true)<br/>
JobTrackingWithFinalizers=true|false (BETA - default=false)<br/>
KubeletCredentialProviders=true|false (BETA - default=true)<br/>
KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
KubeletPodResources=true|false (BETA - default=true)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - default=true)<br/>
LegacyServiceAccountTokenNoAutoGeneration=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>
LogarithmicScaleDown=true|false (BETA - default=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
MemoryManager=true|false (BETA - default=true)<br/>
MemoryQoS=true|false (ALPHA - default=false)<br/>
MinDomainsInPodTopologySpread=true|false (ALPHA - default=false)<br/>
MixedProtocolLBService=true|false (BETA - default=true)<br/>
NetworkPolicyEndPort=true|false (BETA - default=true)<br/>
NetworkPolicyStatus=true|false (ALPHA - default=false)<br/>
NodeOutOfServiceVolumeDetach=true|false (ALPHA - default=false)<br/>
NodeSwap=true|false (ALPHA - default=false)<br/>
OpenAPIEnums=true|false (BETA - default=true)<br/>
OpenAPIV3=true|false (BETA - default=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
PodDeletionCost=true|false (BETA - default=true)<br/>
PodSecurity=true|false (BETA - default=true)<br/>
ProbeTerminationGracePeriod=true|false (BETA - default=false)<br/>
ProcMountType=true|false (ALPHA - default=false)<br/>
ProxyTerminatingEndpoints=true|false (ALPHA - default=false)<br/>
QOSReserved=true|false (ALPHA - default=false)<br/>
ReadWriteOncePod=true|false (ALPHA - default=false)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>
RemainingItemCount=true|false (BETA - default=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
SeccompDefault=true|false (ALPHA - default=false)<br/>
ServerSideFieldValidation=true|false (ALPHA - default=false)<br/>
ServiceIPStaticSubrange=true|false (ALPHA - default=false)<br/>
ServiceInternalTrafficPolicy=true|false (BETA - default=true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>
StatefulSetAutoDeletePVC=true|false (ALPHA - default=false)<br/>
StatefulSetMinReadySeconds=true|false (BETA - default=true)<br/>
StorageVersionAPI=true|false (ALPHA - default=false)<br/>
StorageVersionHash=true|false (BETA - default=true)<br/>
TopologyAwareHints=true|false (BETA - default=true)<br/>
TopologyManager=true|false (BETA - default=true)<br/>
VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
WinDSR=true|false (ALPHA - default=false)<br/>
WinOverlay=true|false (BETA - default=true)<br/>
WindowsHostProcessContainers=true|false (BETA - default=true)
This parameter is ignored if a config file is specified by --config.
-->
一組鍵=值（key=value）對，描述了 alpha/experimental 的特徵。可選項有：<br/>
APIListChunking=true|false (BETA - 預設值=true)<br/>
APIPriorityAndFairness=true|false (BETA - 預設值=true)<br/>
APIResponseCompression=true|false (BETA - 預設值=true)<br/>
APIServerIdentity=true|false (ALPHA - 預設值=false)<br/>
APIServerTracing=true|false (ALPHA - 預設值=false)<br/>
AllAlpha=true|false (ALPHA - 預設值=false)<br/>
AllBeta=true|false (BETA - 預設值=false)<br/>
AnyVolumeDataSource=true|false (BETA - 預設值=true)<br/>
AppArmor=true|false (BETA - 預設值=true)<br/>
CPUManager=true|false (BETA - 預設值=true)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - 預設值=false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - 預設值=true)<br/>
CPUManagerPolicyOptions=true|false (BETA - 預設值=true)<br/>
CSIInlineVolume=true|false (BETA - 預設值=true)<br/>
CSIMigration=true|false (BETA - 預設值=true)<br/>
CSIMigrationAWS=true|false (BETA - 預設值=true)<br/>
CSIMigrationAzureFile=true|false (BETA - 預設值=true)<br/>
CSIMigrationGCE=true|false (BETA - 預設值=true)<br/>
CSIMigrationPortworx=true|false (ALPHA - 預設值=false)<br/>
CSIMigrationRBD=true|false (ALPHA - 預設值=false)<br/>
CSIMigrationvSphere=true|false (BETA - 預設值=false)<br/>
CSIVolumeHealth=true|false (ALPHA - 預設值=false)<br/>
CronJobTimeZone=true|false (ALPHA - 預設值=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 預設值=false)<br/>
CustomResourceValidationExpressions=true|false (ALPHA - 預設值=false)<br/>
DaemonSetUpdateSurge=true|false (BETA - 預設值=true)<br/>
DelegateFSGroupToCSIDriver=true|false (BETA - 預設值=true)<br/>
DevicePlugins=true|false (BETA - 預設值=true)<br/>
DisableAcceleratorUsageMetrics=true|false (BETA - 預設值=true)<br/>
DisableCloudProviders=true|false (ALPHA - 預設值=false)<br/>
DisableKubeletCloudCredentialProviders=true|false (ALPHA - 預設值=false)<br/>
DownwardAPIHugePages=true|false (BETA - 預設值=true)<br/>
EndpointSliceTerminatingCondition=true|false (BETA - 預設值=true)<br/>
EphemeralContainers=true|false (BETA - 預設值=true)<br/>
ExpandedDNSConfig=true|false (ALPHA - 預設值=false)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 預設值=false)<br/>
GRPCContainerProbe=true|false (BETA - 預設值=true)<br/>
GracefulNodeShutdown=true|false (BETA - 預設值=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 預設值=true)<br/>
HPAContainerMetrics=true|false (ALPHA - 預設值=false)<br/>
HPAScaleToZero=true|false (ALPHA - 預設值=false)<br/>
HonorPVReclaimPolicy=true|false (ALPHA - 預設值=false)<br/>
IdentifyPodOS=true|false (BETA - 預設值=true)<br/>
InTreePluginAWSUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginAzureDiskUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginAzureFileUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginGCEUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginOpenStackUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginRBDUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginvSphereUnregister=true|false (ALPHA - 預設值=false)<br/>
JobMutableNodeSchedulingDirectives=true|false (BETA - 預設值=true)<br/>
JobReadyPods=true|false (BETA - 預設值=true)<br/>
JobTrackingWithFinalizers=true|false (BETA - 預設值=false)<br/>
KubeletCredentialProviders=true|false (BETA - 預設值=true)<br/>
KubeletInUserNamespace=true|false (ALPHA - 預設值=false)<br/>
KubeletPodResources=true|false (BETA - 預設值=true)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - 預設值=true)<br/>
LegacyServiceAccountTokenNoAutoGeneration=true|false (BETA - 預設值=true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - 預設值=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 預設值=false)<br/>
LogarithmicScaleDown=true|false (BETA - 預設值=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - 預設值=false)<br/>
MemoryManager=true|false (BETA - 預設值=true)<br/>
MemoryQoS=true|false (ALPHA - 預設值=false)<br/>
MinDomainsInPodTopologySpread=true|false (ALPHA - 預設值=false)<br/>
MixedProtocolLBService=true|false (BETA - 預設值=true)<br/>
NetworkPolicyEndPort=true|false (BETA - 預設值=true)<br/>
NetworkPolicyStatus=true|false (ALPHA - 預設值=false)<br/>
NodeOutOfServiceVolumeDetach=true|false (ALPHA - 預設值=false)<br/>
NodeSwap=true|false (ALPHA - 預設值=false)<br/>
OpenAPIEnums=true|false (BETA - 預設值=true)<br/>
OpenAPIV3=true|false (BETA - 預設值=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - 預設值=false)<br/>
PodDeletionCost=true|false (BETA - 預設值=true)<br/>
PodSecurity=true|false (BETA - 預設值=true)<br/>
ProbeTerminationGracePeriod=true|false (BETA - 預設值=false)<br/>
ProcMountType=true|false (ALPHA - 預設值=false)<br/>
ProxyTerminatingEndpoints=true|false (ALPHA - 預設值=false)<br/>
QOSReserved=true|false (ALPHA - 預設值=false)<br/>
ReadWriteOncePod=true|false (ALPHA - 預設值=false)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - 預設值=false)<br/>
RemainingItemCount=true|false (BETA - 預設值=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - 預設值=true)<br/>
SeccompDefault=true|false (ALPHA - 預設值=false)<br/>
ServerSideFieldValidation=true|false (ALPHA - 預設值=false)<br/>
ServiceIPStaticSubrange=true|false (ALPHA - 預設值=false)<br/>
ServiceInternalTrafficPolicy=true|false (BETA - 預設值=true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - 預設值=true)<br/>
StatefulSetAutoDeletePVC=true|false (ALPHA - 預設值=false)<br/>
StatefulSetMinReadySeconds=true|false (BETA - 預設值=true)<br/>
StorageVersionAPI=true|false (ALPHA - 預設值=false)<br/>
StorageVersionHash=true|false (BETA - 預設值=true)<br/>
TopologyAwareHints=true|false (BETA - 預設值=true)<br/>
TopologyManager=true|false (BETA - 預設值=true)<br/>
VolumeCapacityPriority=true|false (ALPHA - 預設值=false)<br/>
WinDSR=true|false (ALPHA - 預設值=false)<br/>
WinOverlay=true|false (BETA - 預設值=true)<br/>
WindowsHostProcessContainers=true|false (BETA - 預設值=true)
如果配置檔案由 --config 指定，則忽略此引數。
</p>
</td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>0.0.0.0:10256</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--  
The IP address with port for the health check server to serve on (set to '0.0.0.0:10256' for all IPv4 interfaces and '[::]:10256' for all IPv6 interfaces). Set empty to disable. This parameter is ignored if a config file is specified by --config.
-->
服務健康狀態檢查的 IP 地址和埠（設定為 '0.0.0.0:10256' 表示使用所有
IPv4 介面，設定為 '[::]:10256' 表示使用所有 IPv6 介面）；
設定為空則禁用。
如果配置檔案由 --config 指定，則忽略此引數。
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
If non-empty, will use this string as identification instead of the actual hostname.
-->
如果非空，將使用此字串而不是實際的主機名作為標識。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If using the pure iptables proxy, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].
-->
在使用純 iptables 代理時，用來設定 fwmark 空間的 bit，標記需要
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
The minimum interval of how often the iptables rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').
-->
iptables 規則可以隨著端點和服務的更改而重新整理的最小間隔（例如 '5s'、'1m'、'2h22m'）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The maximum interval of how often iptables rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.
-->
重新整理 iptables 規則的最大間隔（例如 '5s'、'1m'、'2h22m'）。必須大於 0。
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
<td colspan="2">--ipvs-min-sync-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The minimum interval of how often the ipvs rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').
-->
ipvs 規則可以隨著端點和服務的更改而重新整理的最小間隔（例如 '5s'、'1m'、'2h22m'）。
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
代理模式為 ipvs 時所選的 ipvs 排程器型別。
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
透過將 <code>arp_ignore</code> 設定為 1 並將 <code>arp_announce</code>
設定為 2 啟用嚴格的 ARP。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The maximum interval of how often ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.
-->
重新整理 ipvs 規則的最大間隔（例如 '5s'、'1m'、'2h22m'）。必須大於 0。
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
空閒 IPVS TCP 連線的超時時間，0 保持連線（例如 '5s'、'1m'、'2h22m'）。
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
收到 FIN 資料包後，IPVS TCP 連線的超時，0 保持當前設定不變。（例如 '5s'、'1m'、'2h22m'）。
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
IPVS UDP 資料包的超時，0 保持當前設定不變。（例如 '5s'、'1m'、'2h22m'）。
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
與 kubernetes apiserver 通訊的突發數量。
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
傳送到 apiserver 的請求的內容型別。
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
與 kubernetes apiserver 互動時使用的 QPS。
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
包含鑑權資訊的 kubeconfig 檔案的路徑（主控節點位置由 master 標誌設定）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--log_backtrace_at &lt;<!--a string in the form 'file:N'-->“file:N” 格式的字串&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
when logging hits line file:N, emit a stack trace
-->
當日志命中 file:N，觸發一次堆疊追蹤
</p></td>
</tr>

<tr>
<td colspan="2">--log_dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- If non-empty, write log files in this directory -->
如果非空，則在此目錄中寫入日誌檔案
</p></td>
</tr>

<tr>
<td colspan="2">--log_file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- If non-empty, use this log file -->
如果非空，使用此日誌檔案
</p></td>
</tr>

<tr>
<td colspan="2">--log_file_max_size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum ile size is unlimited. -->
定義日誌檔案可以增長到的最大大小。單位是兆位元組。
如果值為 0，則最大檔案大小不受限制。
</p></td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!-- log to standard error instead of files -->
日誌輸出到 stderr 而不是檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">--machine_id_file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："/etc/machine-id,/var/lib/dbus/machine-id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Comma-separated list of files to check for machine-id. Use the first one that exists.
-->
用來檢查 Machine-ID 的檔案列表，用逗號分隔。
使用找到的第一個檔案。
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
如果使用純 iptables 代理，則對透過服務叢集 IP 傳送的所有流量
進行 SNAT（通常不需要）。
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
The IP address with port for the metrics server to serve on (set to '0.0.0.0:10249' for all IPv4 interfaces and '[::]:10249' for all IPv6 interfaces). Set empty to disable. This parameter is ignored if a config file is specified by --config.
-->
metrics 伺服器要使用的 IP 地址和埠
（設定為 '0.0.0.0:10249' 則使用所有 IPv4 介面，設定為 '[::]:10249' 則使用所有 IPv6 介面）
設定為空則禁用。
如果配置檔案由 --config 指定，則忽略此引數。
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
一個字串值，指定用於 NodePort 服務的地址。
值可以是有效的 IP 塊（例如 1.2.3.0/24, 1.2.3.4/32）。
預設的空字串切片（[]）表示使用所有本地地址。
如果配置檔案由 --config 指定，則忽略此引數。
</p>
</td>
</tr>

<tr>
<td colspan="2">--one_output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- If true, only write logs to their native severity level (vs also writing to each lower severity level) -->
如果為 true，則僅將日誌寫入本地的嚴重性級別（而不是寫入每個較低的嚴重性級別）
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
kube-proxy 程序中的 oom-score-adj 值，必須在 [-1000,1000] 範圍內。
如果配置檔案由 --config 指定，則忽略此引數。
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
叢集中的一個橋接介面名稱。
Kube-proxy 將來自與該值匹配的橋接介面的流量視為本地流量。
如果 DetectLocalMode 設定為 BridgeInterface，則應設定該引數。
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
叢集中的一個介面字首。
Kube-proxy 將來自與給定字首匹配的介面的流量視為本地流量。
如果 DetectLocalMode 設定為 InterfaceNamePrefix，則應設定該引數。
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
如果為 true，則透過 Web 介面 <code>/debug/pprof</code> 啟用效能分析。
如果配置檔案由 --config 指定，則忽略此引數。
</p>
</td>
</tr>

<tr>
<td colspan="2">--proxy-mode ProxyMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Which proxy mode to use: 'iptables' (Linux-only), 'ipvs' (Linux-only), 'kernelspace' (Windows-only), or 'userspace' (Linux/Windows, deprecated). The default value is 'iptables' on Linux and 'userspace' on Windows.This parameter is ignored if a config file is specified by --config.
-->
使用哪種代理模式：'iptables'（僅 Linux）、'ipvs'（僅 Linux）、'kernelspace'（僅 Linux）
或者 'userspace'（Linux/Windows, 已棄用）。
Linux 系統上的預設值是 'iptables'，Windows 系統上的預設值是 'userspace'。
如果配置檔案由 --config 指定，則忽略此引數。
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
可以用來代理服務流量的主機埠範圍（包括'起始埠-結束埠'、
'單個埠'、'起始埠+偏移'幾種形式）。
如果未指定或者設定為 0（或 0-0），則隨機選擇埠。
</p>
</td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--  
The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is &lt;major&gt;.&lt;minor&gt;, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that.This parameter is ignored if a config file is specified by --config.
-->
要顯示隱藏指標的先前版本。 
僅先前的次要版本有意義，不允許其他值。
格式為 &lt;major&gt;.&lt;minor&gt; ，例如：'1.16'。 
這種格式的目的是確保你有機會注意到下一個發行版是否隱藏了其他指標，
而不是在之後將其永久刪除時感到驚訝。
如果配置檔案由 --config 指定，則忽略此引數。
</p>
</td>
</tr>

<tr>
<td colspan="2">--skip_headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- If true, avoid header prefixes in the log messages -->
如果為 true，則避免在日誌訊息中使用頭部字首
</p></td>
</tr>

<tr>
<td colspan="2">--skip_log_headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- If true, avoid headers when opening log files -->
如果為 true，則在開啟日誌檔案時避免使用頭部
</p></td>
</tr>

<tr>
<td colspan="2">--stderrthreshold int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- logs at or above this threshold go to stderr -->
設定嚴重程度達到或超過此閾值的日誌輸出到標準錯誤輸出。
</p></td>
</tr>

<tr>
<td colspan="2">--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：250ms</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
How long an idle UDP connection will be kept open (e.g. '250ms', '2s').  Must be greater than 0. Only applicable for proxy-mode=userspace
-->
空閒 UDP 連線將保持開啟的時長（例如 '250ms'，'2s'）。必須大於 0。
僅適用於 proxy-mode=userspace。
</p>
</td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- number for the log level verbosity -->
設定日誌級別詳細程度的數值。
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
列印版本資訊並退出。
</p>
</td>
</tr>

<tr>
<td colspan="2">--vmodule &lt;<!--comma-separated 'pattern=N' settings-->逗號分割的 “pattern=N” 設定&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- comma-separated list of pattern=N settings for file-filtered logging -->
以逗號分割的 pattern=N 設定的列表，用於檔案過濾日誌
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
如果設定，將預設配置資訊寫入此檔案並退出。
</p>
</td>
</tr>

</tbody>
</table>




