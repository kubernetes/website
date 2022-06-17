---
title: kube-scheduler
content_type: tool-reference
weight: 30
---
<!-- 
title: kube-scheduler
content_type: tool-reference
weight: 30
auto_generated: true
-->

## {{% heading "synopsis" %}}

<!-- 
The Kubernetes scheduler is a control plane process which assigns
Pods to Nodes. The scheduler determines which Nodes are valid placements for
each Pod in the scheduling queue according to constraints and available
resources. The scheduler then ranks each valid Node and binds the Pod to a
suitable Node. Multiple different schedulers may be used within a cluster;
kube-scheduler is the reference implementation.
See [scheduling](https://kubernetes.io/docs/concepts/scheduling-eviction/)
for more information about scheduling and the kube-scheduler component.
-->
Kubernetes 排程器是一個控制面程序，負責將 Pods 指派到節點上。
排程器基於約束和可用資源為排程佇列中每個 Pod 確定其可合法放置的節點。
排程器之後對所有合法的節點進行排序，將 Pod 繫結到一個合適的節點。
在同一個叢集中可以使用多個不同的排程器；kube-scheduler 是其參考實現。
參閱[排程](/zh-cn/docs/concepts/scheduling-eviction/)以獲得關於排程和
kube-scheduler 元件的更多資訊。

```
kube-scheduler [flags]
```

## {{% heading "options" %}}


<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>


<tr>
<td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default-->預設值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The map from metric-label to value allow-list of this label. The key's format is &lt;MetricName&gt;,&lt;LabelName&gt;. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.
-->
這個鍵值對映表設定度量標籤所允許設定的值。
其中鍵的格式是 &lt;MetricName&gt;,&lt;LabelName&gt;。
值的格式是 &lt;allowed_value&gt;,&lt;allowed_value&gt;。
例如：metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'。
</td>
</tr>

<tr>
<td colspan="2">--authentication-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
kubeconfig file pointing at the 'core' kubernetes server with enough rights to create tokenreviews.authentication.k8s.io. This is optional. If empty, all token requests are considered to be anonymous and no client CA is looked up in the cluster.
-->
指向具有足夠許可權以建立 <code>tokenaccessreviews.authentication.k8s.io</code> 的
Kubernetes 核心伺服器的 kubeconfig 檔案。
這是可選的。如果為空，則所有令牌請求均被視為匿名請求，並且不會在叢集中查詢任何客戶端 CA。
</td>
</tr>

<tr>
<td colspan="2">--authentication-skip-lookup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If false, the authentication-kubeconfig will be used to lookup missing authentication configuration from the cluster.
-->
如果為 false，則 authentication-kubeconfig 將用於從叢集中查詢缺少的身份驗證配置。
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache responses from the webhook token authenticator.
-->
快取來自 Webhook 令牌身份驗證器的響應的持續時間。
</td>
</tr>

<tr>
<td colspan="2">--authentication-tolerate-lookup-failure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.
-->
如果為 true，則無法從叢集中查詢缺少的身份驗證配置是致命的。
請注意，這可能導致身份驗證將所有請求視為匿名。
</td>
</tr>

<tr>
<td colspan="2">--authorization-always-allow-paths strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："/healthz,/readyz,/livez"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.
-->
在授權過程中跳過的 HTTP 路徑列表，即在不聯絡 “core” kubernetes 伺服器的情況下被授權的 HTTP 路徑。
</td>
</tr>

<tr>
<td colspan="2">--authorization-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
kubeconfig file pointing at the 'core' kubernetes server with enough rights to create subjectaccessreviews.authorization.k8s.io. This is optional. If empty, all requests not skipped by authorization are forbidden.
-->
指向具有足夠許可權以建立 subjectaccessreviews.authorization.k8s.io 的
Kubernetes 核心伺服器的 kubeconfig 檔案。這是可選的。
如果為空，則所有未被鑑權機制略過的請求都會被禁止。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer.
-->
快取來自 Webhook 授權者的 “authorized” 響應的持續時間。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer.
-->
快取來自 Webhook 授權者的 “unauthorized” 響應的持續時間。
</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the file containing Azure container registry configuration information.
-->
包含 Azure 容器倉庫配置資訊的檔案的路徑。
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces will be used.
-->
監聽 --secure-port 埠的 IP 地址。
叢集的其餘部分以及 CLI/ Web 客戶端必須可以訪問關聯的介面。
如果為空，將使用所有介面（0.0.0.0 表示使用所有 IPv4 介面，“::” 表示使用所有 IPv6 介面）。
如果為空或未指定地址 (0.0.0.0 或 ::)，所有介面將被使用。
</td>
</tr>

<tr>
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.
-->
TLS 證書所在的目錄。如果提供了--tls-cert-file 和 --tls private-key-file，
則將忽略此引數。
</td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.
-->
如果已設定，由 client-ca-file 中的證書機構簽名的客戶端證書的任何請求都將使用
與客戶端證書的 CommonName 對應的身份進行身份驗證。
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to the configuration file. 
-->
配置檔案的路徑。
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: enable lock contention profiling, if profiling is enabled. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 如果啟用了效能分析，則啟用鎖競爭分析。
如果 --config 指定了一個配置檔案，那麼這個引數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--disabled-metrics strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This flag provides an escape hatch for misbehaving metrics. You must provide the fully qualified metric name in order to disable it. Disclaimer: disabling metrics is higher in precedence than showing hidden metrics.
-->
這個標誌提供了一個規避不良指標的選項。你必須提供完整的指標名稱才能禁用它。
免責宣告：禁用指標的優先順序比顯示隱藏的指標更高。
</td>
</tr>


<tr>
<td colspan="2">--feature-gates &lt;<!--comma-separated 'key=True|False' pairs-->逗號分隔的 'key=True|False' 對&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>
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
CSIMigrationAWS=true|false (BETA - default=false)<br/>
CSIMigrationAzureFile=true|false (BETA - default=false)<br/>
CSIMigrationGCE=true|false (BETA - default=true)<br/>
CSIMigrationPortworx=true|false (ALPHA - default=false)<br/>
CSIMigrationRBD=true|false (ALPHA - default=false)<br/>
CSIMigrationvSphere=true|false (BETA - default=false)<br/>
CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
ContextualLogging=true|false (ALPHA - default=false)<br/>
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
obMutableNodeSchedulingDirectives=true|false (BETA - default=true)<br/>
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
-->
一組 key=value 對，描述了 alpha/experimental 特徵開關。選項包括：<br/>
APIListChunking=true|false (BETA - 預設值為 true)<br/>
APIPriorityAndFairness=true|false (BETA - 預設值為 true)<br/>
APIResponseCompression=true|false (BETA - 預設值為 true)<br/>
APIServerIdentity=true|false (ALPHA - 預設值為 false)<br/>
APIServerTracing=true|false (ALPHA - 預設值為 false)<br/>
AllAlpha=true|false (ALPHA - 預設值為 false)<br/>
AllBeta=true|false (BETA - 預設值為 false)<br/>
AnyVolumeDataSource=true|false (BETA - 預設值為 true)<br/>
AppArmor=true|false (BETA - 預設值為 true)<br/>
CPUManager=true|false (BETA - 預設值為 true)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - 預設值為 false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - 預設值為 true)<br/>
CPUManagerPolicyOptions=true|false (BETA - 預設值為 true)<br/>
CSIInlineVolume=true|false (BETA - 預設值為 true)<br/>
CSIMigration=true|false (BETA - 預設值為 true)<br/>
CSIMigrationAWS=true|false (BETA - 預設值為 false)<br/>
CSIMigrationAzureFile=true|false (BETA - 預設值為 false)<br/>
CSIMigrationGCE=true|false (BETA - 預設值為 true)<br/>
CSIMigrationPortworx=true|false (ALPHA - 預設值為 false)<br/>
CSIMigrationRBD=true|false (ALPHA - 預設值為 false)<br/>
CSIMigrationvSphere=true|false (BETA - 預設值為 false)<br/>
CSIVolumeHealth=true|false (ALPHA - 預設值為 false)<br/>
ContextualLogging=true|false (ALPHA - 預設值為 false)<br/>
CronJobTimeZone=true|false (ALPHA - 預設值為 false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 預設值為 false)<br/>
CustomResourceValidationExpressions=true|false (ALPHA - 預設值為 false)<br/>
DaemonSetUpdateSurge=true|false (BETA - 預設值為 true)<br/>
DelegateFSGroupToCSIDriver=true|false (BETA - 預設值為 true)<br/>
DevicePlugins=true|false (BETA - 預設值為 true)<br/>
DisableAcceleratorUsageMetrics=true|false (BETA - 預設值為 true)<br/>
DisableCloudProviders=true|false (ALPHA - 預設值為 false)<br/>
DisableKubeletCloudCredentialProviders=true|false (ALPHA - 預設值為 false)<br/>
DownwardAPIHugePages=true|false (BETA - 預設值為 true)<br/>
EndpointSliceTerminatingCondition=true|false (BETA - 預設值為 true)<br/>
EphemeralContainers=true|false (BETA - 預設值為 true)<br/>
ExpandedDNSConfig=true|false (ALPHA - 預設值為 false)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 預設值為 false)<br/>
GRPCContainerProbe=true|false (BETA - 預設值為 true)<br/>
GracefulNodeShutdown=true|false (BETA - 預設值為 true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 預設值為 true)<br/>
HPAContainerMetrics=true|false (ALPHA - 預設值為 false)<br/>
HPAScaleToZero=true|false (ALPHA - 預設值為 false)<br/>
HonorPVReclaimPolicy=true|false (ALPHA - 預設值為 false)<br/>
IdentifyPodOS=true|false (BETA - 預設值為 true)<br/>
InTreePluginAWSUnregister=true|false (ALPHA - 預設值為 false)<br/>
InTreePluginAzureDiskUnregister=true|false (ALPHA - 預設值為 false)<br/>
InTreePluginAzureFileUnregister=true|false (ALPHA - 預設值為 false)<br/>
InTreePluginGCEUnregister=true|false (ALPHA - 預設值為 false)<br/>
InTreePluginOpenStackUnregister=true|false (ALPHA - 預設值為 false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - 預設值為 false)<br/>
InTreePluginRBDUnregister=true|false (ALPHA - 預設值為 false)<br/>
InTreePluginvSphereUnregister=true|false (ALPHA - 預設值為 false)<br/>
obMutableNodeSchedulingDirectives=true|false (BETA - 預設值為 true)<br/>
JobReadyPods=true|false (BETA - 預設值為 true)<br/>
JobTrackingWithFinalizers=true|false (BETA - 預設值為 false)<br/>
KubeletCredentialProviders=true|false (BETA - 預設值為 true)<br/>
KubeletInUserNamespace=true|false (ALPHA - 預設值為 false)<br/>
KubeletPodResources=true|false (BETA - 預設值為 true)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - 預設值為 true)<br/>
LegacyServiceAccountTokenNoAutoGeneration=true|false (BETA - 預設值為 true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - 預設值為 true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 預設值為 false)<br/>
LogarithmicScaleDown=true|false (BETA - 預設值為 true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - 預設值為 false)<br/>
MemoryManager=true|false (BETA - 預設值為 true)<br/>
MemoryQoS=true|false (ALPHA - 預設值為 false)<br/>
MinDomainsInPodTopologySpread=true|false (ALPHA - 預設值為 false)<br/>
MixedProtocolLBService=true|false (BETA - 預設值為 true)<br/>
NetworkPolicyEndPort=true|false (BETA - 預設值為 true)<br/>
NetworkPolicyStatus=true|false (ALPHA - 預設值為 false)<br/>
NodeOutOfServiceVolumeDetach=true|false (ALPHA - 預設值為 false)<br/>
NodeSwap=true|false (ALPHA - 預設值為 false)<br/>
OpenAPIEnums=true|false (BETA - 預設值為 true)<br/>
OpenAPIV3=true|false (BETA - 預設值為 true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - 預設值為 false)<br/>
PodDeletionCost=true|false (BETA - 預設值為 true)<br/>
PodSecurity=true|false (BETA - 預設值為 true)<br/>
ProbeTerminationGracePeriod=true|false (BETA - 預設值為 false)<br/>
ProcMountType=true|false (ALPHA - 預設值為 false)<br/>
ProxyTerminatingEndpoints=true|false (ALPHA - 預設值為 false)<br/>
QOSReserved=true|false (ALPHA - 預設值為 false)<br/>
ReadWriteOncePod=true|false (ALPHA - 預設值為 false)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - 預設值為 false)<br/>
RemainingItemCount=true|false (BETA - 預設值為 true)<br/>
RotateKubeletServerCertificate=true|false (BETA - 預設值為 true)<br/>
SeccompDefault=true|false (ALPHA - 預設值為 false)<br/>
ServerSideFieldValidation=true|false (ALPHA - 預設值為 false)<br/>
ServiceIPStaticSubrange=true|false (ALPHA - 預設值為 false)<br/>
ServiceInternalTrafficPolicy=true|false (BETA - 預設值為 true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - 預設值為 true)<br/>
StatefulSetAutoDeletePVC=true|false (ALPHA - 預設值為 false)<br/>
StatefulSetMinReadySeconds=true|false (BETA - 預設值為 true)<br/>
StorageVersionAPI=true|false (ALPHA - 預設值為 false)<br/>
StorageVersionHash=true|false (BETA - 預設值為 true)<br/>
TopologyAwareHints=true|false (BETA - 預設值為 true)<br/>
TopologyManager=true|false (BETA - 預設值為 true)<br/>
VolumeCapacityPriority=true|false (ALPHA - 預設值為 false)<br/>
WinDSR=true|false (ALPHA - 預設值為 false)<br/>
WinOverlay=true|false (BETA - 預設值為 true)<br/>
WindowsHostProcessContainers=true|false (BETA - 預設值為 true)
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kube-scheduler
-->
kube-scheduler 幫助命令
</td>
</tr>

<tr>
<td colspan="2">--http2-max-streams-per-connection int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.
-->
伺服器為客戶端提供的 HTTP/2 連線最大限制。零表示使用 Golang 的預設值。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: burst to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 與 kubernetes API 通訊時使用的突發請求個數限值。
如果 --config 指定了一個配置檔案，那麼這個引數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: content type of requests sent to apiserver. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 傳送到 API 伺服器的請求的內容型別。
如果 --config 指定了一個配置檔案，那麼這個引數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: QPS to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 與 kubernetes apiserver 通訊時要使用的 QPS
如果 --config 指定了一個配置檔案，那麼這個引數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: path to kubeconfig file with authorization and master location information. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 包含鑑權和主節點位置資訊的 kubeconfig 檔案的路徑。
如果 --config 指定了一個配置檔案，那麼這個引數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.
-->
在執行主迴圈之前，開始領導者選舉並選出領導者。
使用多副本來實現高可用性時，可啟用此標誌。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.
-->
非領導者候選人在觀察到領導者更新後將等待直到試圖獲得領導但未更新的領導者職位的等待時間。
這實際上是領導者在被另一位候選人替代之前可以停止的最大持續時間。
該情況僅在啟用了領導者選舉的情況下才適用。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.
-->
領導者嘗試在停止領導之前更新領導職位的間隔時間。該時間必須小於或等於租賃期限。
僅在啟用了領導者選舉的情況下才適用。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："leases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The type of resource object that is used for locking during leader election. Supported options are 'leases', 'endpointsleases' and 'configmapsleases'.
-->
在領導者選舉期間用於鎖定的資源物件的型別。支援的選項有 `leases`、`endpointleases` 和 `configmapsleases`。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："kube-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The name of resource object that is used for locking during leader election.
-->
在領導者選舉期間用於鎖定的資源物件的名稱。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The namespace of resource object that is used for locking during leader election.
-->
在領導者選舉期間用於鎖定的資源物件的名稱空間。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：2s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.
-->
客戶應在嘗試獲取和更新領導之間等待的時間。僅在啟用了領導者選舉的情況下才適用。
</td>
</tr>

<tr>
<td colspan="2">--lock-object-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："kube-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: define the name of the lock object. Will be removed in favor of leader-elect-resource-name. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 定義鎖物件的名稱。將被刪除以便使用 <code>--leader-elect-resource-name</code>。
如果 --config 指定了一個配置檔案，那麼這個引數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--lock-object-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: define the namespace of the lock object. Will be removed in favor of leader-elect-resource-namespace. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 定義鎖物件的名稱空間。將被刪除以便使用 <code>leader-elect-resource-namespace</code>。
如果 --config 指定了一個配置檔案，那麼這個引數將被忽略。
</td>
</tr>


<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes
-->
兩次日誌重新整理之間的最大秒數。
</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：“text”</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets the log format. Permitted formats: &quot;text&quot;.<br/>
Non-default formats don't honor these flags: --add-dir-header, --alsologtostderr, --log-backtrace-at, 
--log-dir, --log-file, --log-file-max-size, 
--logtostderr, --one-output, --skip-headers, --skip-log-headers, 
--stderrthreshold, --vmodule.<br/>
Non-default choices are currently alpha and subject to change without warning.
-->
設定日誌格式。可選格式：“text”。<br/>
採用非預設格式時，以下標識不會生效：
--add-dir-header, --alsologtostderr, --log-backtrace-at, 
--log-dir, --log-file, --log-file-max-size, 
--logtostderr, --one-output, --skip-headers, --skip-log-headers, 
--stderrthreshold, --vmodule.<br/>
非預設選專案前處於 Alpha 階段，有可能會出現變更且無事先警告。
</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
log to standard error instead of files
-->
日誌記錄到標準錯誤輸出而不是檔案。
</td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The address of the Kubernetes API server (overrides any value in kubeconfig)
-->
Kubernetes API 伺服器的地址（覆蓋 kubeconfig 中的任何值）。
</td>
</tr>

<tr>
<td colspan="2">--permit-address-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, SO_REUSEADDR will be used when binding the port. This allows binding to wildcard IPs like 0.0.0.0 and specific IPs in parallel, and it avoids waiting for the kernel to release sockets in TIME_WAIT state. [default=false]
-->
如果為 true，在繫結埠時將使用 SO_REUSEADDR。
這將允許同時繫結諸如 0.0.0.0 這類萬用字元 IP和特定 IP，
並且它避免等待核心釋放處於 TIME_WAIT 狀態的套接字。
預設值：false
</td>
</tr>

<tr>
<td colspan="2">--permit-port-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, SO_REUSEPORT will be used when binding the port, which allows more than one instance to bind on the same address and port. [default=false]
-->
如果此標誌為 true，在繫結埠時會使用 SO_REUSEPORT，從而允許不止一個
例項繫結到同一地址和埠。
預設值：false
</td>
</tr>

<tr>

<td colspan="2">--pod-max-in-unschedulable-pods-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: the maximum time a pod can stay in unschedulablePods. If a pod stays in unschedulablePods for longer than this value, the pod will be moved from unschedulablePods to backoffQ or activeQ. This flag is deprecated and will be removed in 1.2.
-->
已棄用：Pod 可以在 unschedulablePods 中停留的最長時間。
如果 Pod 在 unschedulablePods 中停留的時間超過此值，則該 pod 將被從
unschedulablePods 移動到 backoffQ 或 activeQ。
此標誌已棄用，將在 1.2 中刪除。

</td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: enable profiling via web interface host:port/debug/pprof/. 
This parameter is ignored if a config file is specified in --config.
-->
已棄用: 透過 Web 介面主機啟用配置檔案：<code>host:port/debug/pprof/</code>。
如果 --config 指定了一個配置檔案，這個引數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-allowed-names stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.
-->
客戶端證書通用名稱列表，允許在 <code>--requestheader-username-headers</code>
指定的頭部中提供使用者名稱。如果為空，則允許任何由
<code>--requestheader-client-ca-file</code> 中證書機構驗證的客戶端證書。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.
-->
在信任 <code>--requestheader-username-headers</code> 指定的頭部中的使用者名稱之前
用於驗證傳入請求上的客戶端證書的根證書包。
警告：通常不應假定傳入請求已經完成鑑權。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-extra-headers-prefix strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default:-->預設值："x-remote-extra-"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request header prefixes to inspect. X-Remote-Extra- is suggested.
-->
要檢查請求頭部字首列表。建議使用 <code>X-Remote-Extra-</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default:-->預設值："x-remote-group"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for groups. X-Remote-Group is suggested.
-->
用於檢查組的請求頭部列表。建議使用 <code>X-Remote-Group</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default:-->預設值："x-remote-user"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for usernames. X-Remote-User is common.
-->
用於檢查使用者名稱的請求頭部列表。<code>X-Remote-User</code> 很常用。
</td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10259</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.
-->
透過身份驗證和授權為 HTTPS 服務的埠。如果為 0，則根本不提供 HTTPS。
</td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is &lt;major&gt;.&lt;minor&gt;, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that.
-->
你希望顯式隱藏指標的老版本號。只有較早的此版本號有意義，其它值都是不允許的。
格式為 &lt;主版本&gt;.&lt;此版本&gt;，例如：'1.16'。
此格式的目的是確保你有機會注意到是否下一個發行版本中隱藏了一些額外的指標，
而不是當某些指標在該版本之後被徹底移除時感到震驚。
</td>
</tr>


<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.
-->
包含預設的 HTTPS x509 證書的檔案。（如果有 CA 證書，在伺服器證書之後並置）。
如果啟用了 HTTPS 服務，並且未提供 <code>--tls-cert-file</code> 和
<code>--tls-private-key-file</code>，則會為公共地址生成一個自簽名證書和金鑰，
並將其儲存到 <code>--cert-dir</code> 指定的目錄中。
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>
Preferred values: 
TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384.<br/>
Insecure values: 
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.
-->
伺服器的密碼套件列表，以逗號分隔。如果省略，將使用預設的 Go 密碼套件。
優先考慮的值：
TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384.<br/>
不安全的值：
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.
</td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum TLS version supported. Possible values: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13
-->
支援的最低 TLS 版本。可能的值：VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13
</td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing the default x509 private key matching --tls-cert-file.
-->
包含與 --tls-cert-file 匹配的預設 x509 私鑰的檔案。
</td>
</tr>

<tr>
<td colspan="2">--tls-sni-cert-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. The domain patterns also allow IP addresses, but IPs should only be used if the apiserver has visibility to the IP address requested by a client. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: &quot;example.crt,example.key&quot; or &quot;foo.crt,foo.key:*.foo.com,foo.com&quot;.
-->
一對 x509 證書和私鑰檔案路徑，也可以包含由全限定域名構成的域名模式列表作為字尾，
並可能帶有字首的萬用字元段。域名匹配還允許是 IP 地址，
但是隻有當 apiserver 對客戶端請求的 IP 地址可見時，才能使用 IP。
如果未提供域名匹配模式，則提取證書名稱。
非萬用字元匹配優先於萬用字元匹配，顯式域名匹配優先於提取而來的名稱。
若有多個金鑰/證書對，可多次使用 <code>--tls-sni-cert-key</code>。
例如: "example.crt,example.key" 或者 "foo.crt,foo.key:*.foo.com,foo.com"。
</td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
number for the log level verbosity
-->
設定日誌級別詳細程度的數字
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Print version information and quit
-->
列印版本資訊並退出。
</td>
</tr>

<tr>
<td colspan="2">--vmodule pattern=N,...</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
comma-separated list of pattern=N settings for file-filtered logging (only works for text log format)
-->
以逗號分隔的 “pattern=N” 設定列表，用於檔案過濾的日誌記錄（僅適用於文字日誌格式）。
</td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, write the configuration values to this file and exit.
-->
如果設定此引數，將配置值寫入此檔案並退出。
</td>
</tr>

</tbody>
</table>



