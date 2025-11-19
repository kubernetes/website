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
Kubernetes 調度器是一個控制面進程，負責將 Pods 指派到節點上。
調度器基於約束和可用資源爲調度隊列中每個 Pod 確定其可合法放置的節點。
調度器之後對所有合法的節點進行排序，將 Pod 綁定到一個合適的節點。
在同一個集羣中可以使用多個不同的調度器；kube-scheduler 是其參考實現。
參閱[調度](/zh-cn/docs/concepts/scheduling-eviction/)以獲得關於調度和
kube-scheduler 組件的更多信息。

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
<!--Default-->默認值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The map from metric-label to value allow-list of this label. The key's format is &lt;MetricName&gt;,&lt;LabelName&gt;. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.
-->
這個鍵值映射表設置度量標籤所允許設置的值。
其中鍵的格式是 &lt;MetricName&gt;,&lt;LabelName&gt;。
值的格式是 &lt;allowed_value&gt;,&lt;allowed_value&gt;。
例如：metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'。
</td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels-manifest string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the manifest file that contains the allow-list mapping. The format of the file is the same as the flag --allow-metric-labels. Note that the flag --allow-metric-labels will override the manifest file.
-->
包含允許列表映射的清單文件的路徑。此文件的格式與 <code>--allow-metric-labels</code> 標誌相同。
請注意，<code>--allow-metric-labels</code> 標誌將覆蓋此清單文件。
</p>
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
指向具有足夠權限以創建 <code>tokenaccessreviews.authentication.k8s.io</code> 的
Kubernetes 核心服務器的 kubeconfig 文件。
這是可選的。如果爲空，則所有令牌請求均被視爲匿名請求，並且不會在集羣中查找任何客戶端 CA。
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
如果爲 false，則 authentication-kubeconfig 將用於從集羣中查找缺少的身份驗證配置。
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache responses from the webhook token authenticator.
-->
緩存來自 Webhook 令牌身份驗證器的響應的持續時間。
</td>
</tr>

<tr>
<td colspan="2">--authentication-tolerate-lookup-failure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.
-->
如果爲 true，則無法從集羣中查找缺少的身份驗證配置是致命的。
請注意，這可能導致身份驗證將所有請求視爲匿名。
</td>
</tr>

<tr>
<td colspan="2">--authorization-always-allow-paths strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："/healthz,/readyz,/livez"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.
-->
在授權過程中跳過的 HTTP 路徑列表，即在不聯繫 “core” kubernetes 服務器的情況下被授權的 HTTP 路徑。
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
指向具有足夠權限以創建 subjectaccessreviews.authorization.k8s.io 的
Kubernetes 核心服務器的 kubeconfig 文件。這是可選的。
如果爲空，則所有未被鑑權機制略過的請求都會被禁止。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer.
-->
緩存來自 Webhook 授權者的 “authorized” 響應的持續時間。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer.
-->
緩存來自 Webhook 授權者的 “unauthorized” 響應的持續時間。
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces and IP address families will be used.
-->
監聽 --secure-port 端口的 IP 地址。
集羣的其餘部分以及 CLI/ Web 客戶端必須可以訪問關聯的接口。
如果爲空，將使用所有接口（0.0.0.0 表示使用所有 IPv4 接口，“::” 表示使用所有 IPv6 接口）。
如果爲空或未指定地址 (0.0.0.0 或 ::)，所有接口和 IP 地址簇將被使用。
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
則將忽略此參數。
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
如果已設置，由 client-ca-file 中的證書機構簽名的客戶端證書的任何請求都將使用
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
配置文件的路徑。
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: enable lock contention profiling, if profiling is enabled. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 如果啓用了性能分析，則啓用鎖競爭分析。
如果 --config 指定了一個配置文件，那麼這個參數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--disable-http2-serving</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, HTTP2 serving will be disabled [default=false]
-->
如果爲 true，HTTP2 服務將被禁用 [默認值=false]
</p></td>
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
免責聲明：禁用指標的優先級比顯示隱藏的指標更高。
</td>
</tr>

<tr>
<td colspan="2">--emulated-version strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The versions different components emulate their capabilities (APIs, features, ...) of.<br/>If set, the component will emulate the behavior of this version instead of the underlying binary version.<br/>Version format could only be major.minor, for example: '--emulated-version=wardle=1.2,kube=1.31'.<br/>Options are: kube=1.31..1.34(default:1.34)<br/>If the component is not specified, defaults to &quot;kube&quot;
-->
版本格式只能是 major.minor，例如 “--emulated-version=wardle=1.2,kube=1.31”。
選項包括：<br/>kube=1.31..1.34（默認 1.34）。<br/>如果組件未被指定，默認爲 “kube”。
</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates colonSeparatedMultimapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Comma-separated list of component:key=value pairs that describe feature gates for alpha/experimental features of different components.<br/>
If the component is not specified, defaults to &quot;kube&quot;. This flag can be repeatedly invoked. For example: --feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'<br/>
Options are:<br/>
kube:APIResponseCompression=true|false (BETA - default=true)<br/>
kube:APIServerIdentity=true|false (BETA - default=true)<br/>
kube:APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
kube:AllAlpha=true|false (ALPHA - default=false)<br/>
kube:AllBeta=true|false (BETA - default=false)<br/>
kube:AllowParsingUserUIDFromCertAuth=true|false (BETA - default=true)<br/>
kube:AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
kube:CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
kube:CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
kube:ClearingNominatedNodeNameAfterBinding=true|false (ALPHA - default=false)<br/>
kube:ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
kube:ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
kube:CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
kube:ClusterTrustBundle=true|false (BETA - default=false)<br/>
kube:ClusterTrustBundleProjection=true|false (BETA - default=false)<br/>
kube:ComponentFlagz=true|false (ALPHA - default=false)<br/>
kube:ComponentStatusz=true|false (ALPHA - default=false)<br/>
kube:ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
kube:ContainerCheckpoint=true|false (BETA - default=true)<br/>
kube:ContainerRestartRules=true|false (ALPHA - default=false)<br/>
kube:ContainerStopSignals=true|false (ALPHA - default=false)<br/>
kube:ContextualLogging=true|false (BETA - default=true)<br/>
kube:CoordinatedLeaderElection=true|false (BETA - default=false)<br/>
kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
kube:DRAAdminAccess=true|false (BETA - default=true)<br/>
kube:DRAConsumableCapacity=true|false (ALPHA - default=false)<br/>
kube:DRADeviceBindingConditions=true|false (ALPHA - default=false)<br/>
kube:DRADeviceTaints=true|false (ALPHA - default=false)<br/>
kube:DRAExtendedResource=true|false (ALPHA - default=false)<br/>
kube:DRAPartitionableDevices=true|false (ALPHA - default=false)<br/>
kube:DRAPrioritizedList=true|false (BETA - default=true)<br/>
kube:DRAResourceClaimDeviceStatus=true|false (BETA - default=true)<br/>
kube:DRASchedulerFilterTimeout=true|false (BETA - default=true)<br/>
kube:DeclarativeValidation=true|false (BETA - default=true)<br/>
kube:DeclarativeValidationTakeover=true|false (BETA - default=false)<br/>
kube:DeploymentReplicaSetTerminatingReplicas=true|false (ALPHA - default=false)<br/>
kube:DetectCacheInconsistency=true|false (BETA - default=true)<br/>
kube:DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - default=true)<br/>
kube:EnvFiles=true|false (ALPHA - default=false)<br/>
kube:EventedPLEG=true|false (ALPHA - default=false)<br/>
kube:ExternalServiceAccountTokenSigner=true|false (BETA - default=true)<br/>
kube:GracefulNodeShutdown=true|false (BETA - default=true)<br/>
kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
kube:HPAConfigurableTolerance=true|false (ALPHA - default=false)<br/>
kube:HPAScaleToZero=true|false (ALPHA - default=false)<br/>
kube:HostnameOverride=true|false (ALPHA - default=false)<br/>
kube:ImageMaximumGCAge=true|false (BETA - default=true)<br/>
kube:ImageVolume=true|false (BETA - default=false)<br/>
kube:InOrderInformers=true|false (BETA - default=true)<br/>
kube:InPlacePodVerticalScaling=true|false (BETA - default=true)<br/>
kube:InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
kube:InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - default=false)<br/>
kube:InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
kube:InformerResourceVersion=true|false (ALPHA - default=false)<br/>
kube:JobManagedBy=true|false (BETA - default=true)<br/>
kube:KubeletCrashLoopBackOffMax=true|false (ALPHA - default=false)<br/>
kube:KubeletEnsureSecretPulledImages=true|false (ALPHA - default=false)<br/>
kube:KubeletFineGrainedAuthz=true|false (BETA - default=true)<br/>
kube:KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
kube:KubeletPSI=true|false (BETA - default=true)<br/>
kube:KubeletPodResourcesDynamicResources=true|false (BETA - default=true)<br/>
kube:KubeletPodResourcesGet=true|false (BETA - default=true)<br/>
kube:KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
kube:KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - default=true)<br/>
kube:ListFromCacheSnapshot=true|false (BETA - default=true)<br/>
kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
kube:LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:LoggingBetaOptions=true|false (BETA - default=true)<br/>
kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
kube:MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - default=true)<br/>
kube:MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
kube:MemoryQoS=true|false (ALPHA - default=false)<br/>
kube:MutableCSINodeAllocatableCount=true|false (BETA - default=false)<br/>
kube:MutatingAdmissionPolicy=true|false (BETA - default=false)<br/>
kube:NodeLogQuery=true|false (BETA - default=false)<br/>
kube:NominatedNodeNameForExpectation=true|false (ALPHA - default=false)<br/>
kube:OpenAPIEnums=true|false (BETA - default=true)<br/>
kube:PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
kube:PodCertificateRequest=true|false (ALPHA - default=false)<br/>
kube:PodDeletionCost=true|false (BETA - default=true)<br/>
kube:PodLevelResources=true|false (BETA - default=true)<br/>
kube:PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
kube:PodObservedGenerationTracking=true|false (BETA - default=true)<br/>
kube:PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
kube:PodTopologyLabelsAdmission=true|false (ALPHA - default=false)<br/>
kube:PortForwardWebsockets=true|false (BETA - default=true)<br/>
kube:PreferSameTrafficDistribution=true|false (BETA - default=true)<br/>
kube:PreventStaticPodAPIReferences=true|false (BETA - default=true)<br/>
kube:ProcMountType=true|false (BETA - default=true)<br/>
kube:QOSReserved=true|false (ALPHA - default=false)<br/>
kube:ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - default=false)<br/>
kube:RelaxedServiceNameValidation=true|false (ALPHA - default=false)<br/>
kube:ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
kube:RemoteRequestHeaderUID=true|false (BETA - default=true)<br/>
kube:ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
kube:RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
kube:RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
kube:SELinuxChangePolicy=true|false (BETA - default=true)<br/>
kube:SELinuxMount=true|false (BETA - default=false)<br/>
kube:SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
kube:SchedulerAsyncAPICalls=true|false (BETA - default=true)<br/>
kube:SchedulerAsyncPreemption=true|false (BETA - default=true)<br/>
kube:SchedulerPopFromBackoffQ=true|false (BETA - default=true)<br/>
kube:ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
kube:SizeBasedListCostEstimate=true|false (BETA - default=true)<br/>
kube:StorageCapacityScoring=true|false (ALPHA - default=false)<br/>
kube:StorageVersionAPI=true|false (ALPHA - default=false)<br/>
kube:StorageVersionHash=true|false (BETA - default=true)<br/>
kube:StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
kube:StrictIPCIDRValidation=true|false (ALPHA - default=false)<br/>
kube:StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - default=true)<br/>
kube:SupplementalGroupsPolicy=true|false (BETA - default=true)<br/>
kube:SystemdWatchdog=true|false (BETA - default=true)<br/>
kube:TokenRequestServiceAccountUIDValidation=true|false (BETA - default=true)<br/>
kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
kube:UserNamespacesSupport=true|false (BETA - default=true)<br/>
kube:WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
kube:WatchList=true|false (BETA - default=true)<br/>
kube:WatchListClient=true|false (BETA - default=false)<br/>
kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
kube:WindowsGracefulNodeShutdown=true|false (BETA - default=true)<br/>
-->
逗號分隔的組件列表，這些 <code>key=value</code> 對用來描述不同組件測試性/試驗性特性的特性門控。<br/>
如果組件未被指定，默認值爲 "kube"。此標誌可以被重複調用。例如：
--feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'
可選項爲：<br/>
ube:APIResponseCompression=true|false (BETA - 默認值=true)<br/>
kube:APIServerIdentity=true|false (BETA - 默認值=true)<br/>
kube:APIServingWithRoutine=true|false (ALPHA - 默認值=false)<br/>
kube:AllAlpha=true|false (ALPHA - 默認值=false)<br/>
kube:AllBeta=true|false (BETA - 默認值=false)<br/>
kube:AllowParsingUserUIDFromCertAuth=true|false (BETA - 默認值=true)<br/>
kube:AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - 默認值=false)<br/>
kube:CBORServingAndStorage=true|false (ALPHA - 默認值=false)<br/>
kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - 默認值=false)<br/>
kube:CPUManagerPolicyBetaOptions=true|false (BETA - 默認值=true)<br/>
kube:CSIVolumeHealth=true|false (ALPHA - 默認值=false)<br/>
kube:ClearingNominatedNodeNameAfterBinding=true|false (ALPHA - 默認值=false)<br/>
kube:ClientsAllowCBOR=true|false (ALPHA - 默認值=false)<br/>
kube:ClientsPreferCBOR=true|false (ALPHA - 默認值=false)<br/>
kube:CloudControllerManagerWebhook=true|false (ALPHA - 默認值=false)<br/>
kube:ClusterTrustBundle=true|false (BETA - 默認值=false)<br/>
kube:ClusterTrustBundleProjection=true|false (BETA - 默認值=false)<br/>
kube:ComponentFlagz=true|false (ALPHA - 默認值=false)<br/>
kube:ComponentStatusz=true|false (ALPHA - 默認值=false)<br/>
kube:ConcurrentWatchObjectDecode=true|false (BETA - 默認值=false)<br/>
kube:ContainerCheckpoint=true|false (BETA - 默認值=true)<br/>
kube:ContainerRestartRules=true|false (ALPHA - 默認值=false)<br/>
kube:ContainerStopSignals=true|false (ALPHA - 默認值=false)<br/>
kube:ContextualLogging=true|false (BETA - 默認值=true)<br/>
kube:CoordinatedLeaderElection=true|false (BETA - 默認值=false)<br/>
kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - 默認值=false)<br/>
kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默認值=false)<br/>
kube:DRAAdminAccess=true|false (BETA - 默認值=true)<br/>
kube:DRAConsumableCapacity=true|false (ALPHA - 默認值=false)<br/>
kube:DRADeviceBindingConditions=true|false (ALPHA - 默認值=false)<br/>
kube:DRADeviceTaints=true|false (ALPHA - 默認值=false)<br/>
kube:DRAExtendedResource=true|false (ALPHA - 默認值=false)<br/>
kube:DRAPartitionableDevices=true|false (ALPHA - 默認值=false)<br/>
kube:DRAPrioritizedList=true|false (BETA - 默認值=true)<br/>
kube:DRAResourceClaimDeviceStatus=true|false (BETA - 默認值=true)<br/>
kube:DRASchedulerFilterTimeout=true|false (BETA - 默認值=true)<br/>
kube:DeclarativeValidation=true|false (BETA - 默認值=true)<br/>
kube:DeclarativeValidationTakeover=true|false (BETA - 默認值=false)<br/>
kube:DeploymentReplicaSetTerminatingReplicas=true|false (ALPHA - 默認值=false)<br/>
kube:DetectCacheInconsistency=true|false (BETA - 默認值=true)<br/>
kube:DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - 默認值=true)<br/>
kube:EnvFiles=true|false (ALPHA - 默認值=false)<br/>
kube:EventedPLEG=true|false (ALPHA - 默認值=false)<br/>
kube:ExternalServiceAccountTokenSigner=true|false (BETA - 默認值=true)<br/>
kube:GracefulNodeShutdown=true|false (BETA - 默認值=true)<br/>
kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 默認值=true)<br/>
kube:HPAConfigurableTolerance=true|false (ALPHA - 默認值=false)<br/>
kube:HPAScaleToZero=true|false (ALPHA - 默認值=false)<br/>
kube:HostnameOverride=true|false (ALPHA - 默認值=false)<br/>
kube:ImageMaximumGCAge=true|false (BETA - 默認值=true)<br/>
kube:ImageVolume=true|false (BETA - 默認值=false)<br/>
kube:InOrderInformers=true|false (BETA - 默認值=true)<br/>
kube:InPlacePodVerticalScaling=true|false (BETA - 默認值=true)<br/>
kube:InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - 默認值=false)<br/>
kube:InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - 默認值=false)<br/>
kube:InTreePluginPortworxUnregister=true|false (ALPHA - 默認值=false)<br/>
kube:InformerResourceVersion=true|false (ALPHA - 默認值=false)<br/>
kube:JobManagedBy=true|false (BETA - 默認值=true)<br/>
kube:KubeletCrashLoopBackOffMax=true|false (ALPHA - 默認值=false)<br/>
kube:KubeletEnsureSecretPulledImages=true|false (ALPHA - 默認值=false)<br/>
kube:KubeletFineGrainedAuthz=true|false (BETA - 默認值=true)<br/>
kube:KubeletInUserNamespace=true|false (ALPHA - 默認值=false)<br/>
kube:KubeletPSI=true|false (BETA - 默認值=true)<br/>
kube:KubeletPodResourcesDynamicResources=true|false (BETA - 默認值=true)<br/>
kube:KubeletPodResourcesGet=true|false (BETA - 默認值=true)<br/>
kube:KubeletSeparateDiskGC=true|false (BETA - 默認值=true)<br/>
kube:KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - 默認值=true)<br/>
kube:ListFromCacheSnapshot=true|false (BETA - 默認值=true)<br/>
kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - 默認值=false)<br/>
kube:LoggingAlphaOptions=true|false (ALPHA - 默認值=false)<br/>
kube:LoggingBetaOptions=true|false (BETA - 默認值=true)<br/>
kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - 默認值=true)<br/>
kube:MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - 默認值=true)<br/>
kube:MaxUnavailableStatefulSet=true|false (ALPHA - 默認值=false)<br/>
kube:MemoryQoS=true|false (ALPHA - 默認值=false)<br/>
kube:MutableCSINodeAllocatableCount=true|false (BETA - 默認值=false)<br/>
kube:MutatingAdmissionPolicy=true|false (BETA - 默認值=false)<br/>
kube:NodeLogQuery=true|false (BETA - 默認值=false)<br/>
kube:NominatedNodeNameForExpectation=true|false (ALPHA - 默認值=false)<br/>
kube:OpenAPIEnums=true|false (BETA - 默認值=true)<br/>
kube:PodAndContainerStatsFromCRI=true|false (ALPHA - 默認值=false)<br/>
kube:PodCertificateRequest=true|false (ALPHA - 默認值=false)<br/>
kube:PodDeletionCost=true|false (BETA - 默認值=true)<br/>
kube:PodLevelResources=true|false (BETA - 默認值=true)<br/>
kube:PodLogsQuerySplitStreams=true|false (ALPHA - 默認值=false)<br/>
kube:PodObservedGenerationTracking=true|false (BETA - 默認值=true)<br/>
kube:PodReadyToStartContainersCondition=true|false (BETA - 默認值=true)<br/>
kube:PodTopologyLabelsAdmission=true|false (ALPHA - 默認值=false)<br/>
kube:PortForwardWebsockets=true|false (BETA - 默認值=true)<br/>
kube:PreferSameTrafficDistribution=true|false (BETA - 默認值=true)<br/>
kube:PreventStaticPodAPIReferences=true|false (BETA - 默認值=true)<br/>
kube:ProcMountType=true|false (BETA - 默認值=true)<br/>
kube:QOSReserved=true|false (ALPHA - 默認值=false)<br/>
kube:ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - 默認值=false)<br/>
kube:RelaxedServiceNameValidation=true|false (ALPHA - 默認值=false)<br/>
kube:ReloadKubeletServerCertificateFile=true|false (BETA - 默認值=true)<br/>
kube:RemoteRequestHeaderUID=true|false (BETA - 默認值=true)<br/>
kube:ResourceHealthStatus=true|false (ALPHA - 默認值=false)<br/>
kube:RotateKubeletServerCertificate=true|false (BETA - 默認值=true)<br/>
kube:RuntimeClassInImageCriApi=true|false (ALPHA - 默認值=false)<br/>
kube:SELinuxChangePolicy=true|false (BETA - 默認值=true)<br/>
kube:SELinuxMount=true|false (BETA - 默認值=false)<br/>
kube:SELinuxMountReadWriteOncePod=true|false (BETA - 默認值=true)<br/>
kube:SchedulerAsyncAPICalls=true|false (BETA - 默認值=true)<br/>
kube:SchedulerAsyncPreemption=true|false (BETA - 默認值=true)<br/>
kube:SchedulerPopFromBackoffQ=true|false (BETA - 默認值=true)<br/>
kube:ServiceAccountNodeAudienceRestriction=true|false (BETA - 默認值=true)<br/>
kube:SizeBasedListCostEstimate=true|false (BETA - 默認值=true)<br/>
kube:StorageCapacityScoring=true|false (ALPHA - 默認值=false)<br/>
kube:StorageVersionAPI=true|false (ALPHA - 默認值=false)<br/>
kube:StorageVersionHash=true|false (BETA - 默認值=true)<br/>
kube:StorageVersionMigrator=true|false (ALPHA - 默認值=false)<br/>
kube:StrictIPCIDRValidation=true|false (ALPHA - 默認值=false)<br/>
kube:StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - 默認值=true)<br/>
kube:SupplementalGroupsPolicy=true|false (BETA - 默認值=true)<br/>
kube:SystemdWatchdog=true|false (BETA - 默認值=true)<br/>
kube:TokenRequestServiceAccountUIDValidation=true|false (BETA - 默認值=true)<br/>
kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - 默認值=false)<br/>
kube:TopologyManagerPolicyBetaOptions=true|false (BETA - 默認值=true)<br/>
kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - 默認值=true)<br/>
kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - 默認值=true)<br/>
kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - 默認值=false)<br/>
kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - 默認值=false)<br/>
kube:UserNamespacesSupport=true|false (BETA - 默認值=true)<br/>
kube:WatchCacheInitializationPostStartHook=true|false (BETA - 默認值=false)<br/>
kube:WatchList=true|false (BETA - 默認值=true)<br/>
kube:WatchListClient=true|false (BETA - 默認值=false)<br/>
kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - 默認值=false)<br/>
kube:WindowsGracefulNodeShutdown=true|false (BETA - 默認值=true)<br/>
</p>
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
服務器爲客戶端提供的 HTTP/2 連接最大限制。零表示使用 Golang 的默認值。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: burst to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 與 kubernetes API 通信時使用的突發請求個數限值。
如果 --config 指定了一個配置文件，那麼這個參數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: content type of requests sent to apiserver. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 發送到 API 服務器的請求的內容類型。
如果 --config 指定了一個配置文件，那麼這個參數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: QPS to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.
-->
已棄用: 與 kubernetes apiserver 通信時要使用的 QPS
如果 --config 指定了一個配置文件，那麼這個參數將被忽略。
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
已棄用: 包含鑑權和主節點位置信息的 kubeconfig 文件的路徑。
如果 --config 指定了一個配置文件，那麼這個參數將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.
-->
在執行主循環之前，開始領導者選舉並選出領導者。
使用多副本來實現高可用性時，可啓用此標誌。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.
-->
非領導者候選人在觀察到領導者更新後將等待直到試圖獲得領導但未更新的領導者職位的等待時間。
這實際上是領導者在被另一位候選人替代之前可以停止的最大持續時間。
該情況僅在啓用了領導者選舉的情況下才適用。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than the lease duration. This is only applicable if leader election is enabled.
-->
領導者嘗試在停止領導之前更新領導職位的間隔時間。該時間必須小於租賃期限。
僅在啓用了領導者選舉的情況下才適用。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："leases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The type of resource object that is used for locking during leader election. Supported options are 'leases'.
-->
在領導者選舉期間用於鎖定的資源對象的類型。支持的選項有 `leases`。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："kube-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The name of resource object that is used for locking during leader election.
-->
在領導者選舉期間用於鎖定的資源對象的名稱。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The namespace of resource object that is used for locking during leader election.
-->
在領導者選舉期間用於鎖定的資源對象的命名空間。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：2s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.
-->
客戶應在嘗試獲取和更新領導之間等待的時間。僅在啓用了領導者選舉的情況下才適用。
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes
-->
兩次日誌刷新之間的最大秒數。
</td>
</tr>

<tr>
<td colspan="2">--log-text-info-buffer-size quantity</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[Alpha] In text format with split output streams, the info messages can be buffered for a while to increase performance. The default value of zero bytes disables buffering. The size can be specified as number of bytes (512), multiples of 1000 (1K), multiples of 1024 (2Ki), or powers of those (3M, 4G, 5Mi, 6Gi). Enable the LoggingAlphaOptions feature gate to use this.
-->
[Alpha] 在具有分割輸出流的文本格式中，信息消息可以被緩衝一段時間以提高性能。
默認值零字節表示禁用緩衝區機制。
大小可以指定爲字節數（512）、1000 的倍數（1K）、1024 的倍數（2Ki）或它們的冪（3M、4G、5Mi、6Gi）。
啓用 LoggingAlphaOptions 特性門控以使用此功能。
</p>
</td>
</tr>

<tr>
<td colspan="2">--log-text-split-stream</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[Alpha] In text format, write error messages to stderr and info messages to stdout. The default is to write a single stream to stdout. Enable the LoggingAlphaOptions feature gate to use this.
-->
[Alpha] 以文本格式，將錯誤消息寫入 stderr，將信息消息寫入 stdout。
默認是將單個流寫入標準輸出。
啓用 LoggingAlphaOptions 特性門控以使用此功能。
</p>
</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：“text”</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets the log format. Permitted formats: &quot;text&quot;.
-->
設置日誌格式。可選格式：“text”。
</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
log to standard error instead of files
-->
日誌記錄到標準錯誤輸出而不是文件。
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
Kubernetes API 服務器的地址（覆蓋 kubeconfig 中的任何值）。
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
如果爲 true，在綁定端口時將使用 SO_REUSEADDR。
這將允許同時綁定諸如 0.0.0.0 這類通配符 IP和特定 IP，
並且它避免等待內核釋放處於 TIME_WAIT 狀態的套接字。
默認值：false
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
如果此標誌爲 true，在綁定端口時會使用 SO_REUSEPORT，從而允許不止一個
實例綁定到同一地址和端口。
默認值：false
</td>
</tr>

<tr>

<td colspan="2">--pod-max-in-unschedulable-pods-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: the maximum time a pod can stay in unschedulablePods. If a pod stays in unschedulablePods for longer than this value, the pod will be moved from unschedulablePods to backoffQ or activeQ. This flag is deprecated and will be removed in a future version.
-->
已棄用：Pod 可以在 unschedulablePods 中停留的最長時間。
如果 Pod 在 unschedulablePods 中停留的時間超過此值，則該 pod 將被從
unschedulablePods 移動到 backoffQ 或 activeQ。
此標誌已棄用，將在後續版本中移除。

</td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: enable profiling via web interface host:port/debug/pprof/. 
This parameter is ignored if a config file is specified in --config.
-->
已棄用: 通過 Web 界面主機啓用配置文件：<code>host:port/debug/pprof/</code>。
如果 --config 指定了一個配置文件，這個參數將被忽略。
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
指定的頭部中提供用戶名。如果爲空，則允許任何由
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
在信任 <code>--requestheader-username-headers</code> 指定的頭部中的用戶名之前
用於驗證傳入請求上的客戶端證書的根證書包。
警告：通常不應假定傳入請求已經完成鑑權。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-extra-headers-prefix strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default:-->默認值："x-remote-extra-"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request header prefixes to inspect. X-Remote-Extra- is suggested.
-->
要檢查請求頭部前綴列表。建議使用 <code>X-Remote-Extra-</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default:-->默認值："x-remote-group"</td>
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
<td colspan="2">--requestheader-uid-headers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
List of request headers to inspect for UIDs. X-Remote-Uid is suggested. Requires the RemoteRequestHeaderUID feature to be enabled.
-->
用於檢查 UID 的請求標頭列表。建議使用 X-Remote-Uid。
需要啓用 RemoteRequestHeaderUID 特性。
</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default:-->默認值："x-remote-user"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for usernames. X-Remote-User is common.
-->
用於檢查用戶名的請求頭部列表。<code>X-Remote-User</code> 很常用。
</td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10259</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.
-->
通過身份驗證和授權爲 HTTPS 服務的端口。如果爲 0，則根本不提供 HTTPS。
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
格式爲 &lt;主版本&gt;.&lt;此版本&gt;，例如：'1.16'。
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
包含默認的 HTTPS x509 證書的文件。（如果有 CA 證書，在服務器證書之後並置）。
如果啓用了 HTTPS 服務，並且未提供 <code>--tls-cert-file</code> 和
<code>--tls-private-key-file</code>，則會爲公共地址生成一個自簽名證書和密鑰，
並將其保存到 <code>--cert-dir</code> 指定的目錄中。
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>Preferred values: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256.<br/>Insecure values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384, TLS_RSA_WITH_RC4_128_SHA.
-->
服務器的密碼套件列表，以逗號分隔。如果省略，將使用默認的 Go 密碼套件。<br/>
優先考慮的值：
TLS_AES_128_GCM_SHA256、TLS_AES_256_GCM_SHA384、TLS_CHACHA20_POLY1305_SHA256、TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA、
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384、
TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256、TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA、
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256。<br/>
不安全的值：
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_ECDSA_WITH_RC4_128_SHA、TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA、
TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_RSA_WITH_RC4_128_SHA、TLS_RSA_WITH_3DES_EDE_CBC_SHA、
TLS_RSA_WITH_AES_128_CBC_SHA、TLS_RSA_WITH_AES_128_CBC_SHA256、TLS_RSA_WITH_AES_128_GCM_SHA256、
TLS_RSA_WITH_AES_256_CBC_SHA、TLS_RSA_WITH_AES_256_GCM_SHA384、TLS_RSA_WITH_RC4_128_SHA。
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
支持的最低 TLS 版本。可能的值：VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13
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
包含與 --tls-cert-file 匹配的默認 x509 私鑰的文件。
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
一對 x509 證書和私鑰文件路徑，也可以包含由全限定域名構成的域名模式列表作爲後綴，
並可能帶有前綴的通配符段。域名匹配還允許是 IP 地址，
但是隻有當 apiserver 對客戶端請求的 IP 地址可見時，才能使用 IP。
如果未提供域名匹配模式，則提取證書名稱。
非通配符匹配優先於通配符匹配，顯式域名匹配優先於提取而來的名稱。
若有多個密鑰/證書對，可多次使用 <code>--tls-sni-cert-key</code>。
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
設置日誌級別詳細程度的數字
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version
-->
--version, --version=raw 打印版本信息並推出；
--version=vX.Y.Z... 設置報告的版本。
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
以逗號分隔的 “pattern=N” 設置列表，用於文件過濾的日誌記錄（僅適用於文本日誌格式）。
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
如果設置此參數，將配置值寫入此文件並退出。
</td>
</tr>

</tbody>
</table>



