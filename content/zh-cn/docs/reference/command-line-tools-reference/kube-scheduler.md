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
Kubernetes 调度器是一个控制面进程，负责将 Pods 指派到节点上。
调度器基于约束和可用资源为调度队列中每个 Pod 确定其可合法放置的节点。
调度器之后对所有合法的节点进行排序，将 Pod 绑定到一个合适的节点。
在同一个集群中可以使用多个不同的调度器；kube-scheduler 是其参考实现。
参阅[调度](/zh-cn/docs/concepts/scheduling-eviction/)以获得关于调度和
kube-scheduler 组件的更多信息。

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
<!--Default-->默认值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The map from metric-label to value allow-list of this label. The key's format is &lt;MetricName&gt;,&lt;LabelName&gt;. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.
-->
这个键值映射表设置度量标签所允许设置的值。
其中键的格式是 &lt;MetricName&gt;,&lt;LabelName&gt;。
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
包含允许列表映射的清单文件的路径。此文件的格式与 <code>--allow-metric-labels</code> 标志相同。
请注意，<code>--allow-metric-labels</code> 标志将覆盖此清单文件。
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
指向具有足够权限以创建 <code>tokenaccessreviews.authentication.k8s.io</code> 的
Kubernetes 核心服务器的 kubeconfig 文件。
这是可选的。如果为空，则所有令牌请求均被视为匿名请求，并且不会在集群中查找任何客户端 CA。
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
如果为 false，则 authentication-kubeconfig 将用于从集群中查找缺少的身份验证配置。
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache responses from the webhook token authenticator.
-->
缓存来自 Webhook 令牌身份验证器的响应的持续时间。
</td>
</tr>

<tr>
<td colspan="2">--authentication-tolerate-lookup-failure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.
-->
如果为 true，则无法从集群中查找缺少的身份验证配置是致命的。
请注意，这可能导致身份验证将所有请求视为匿名。
</td>
</tr>

<tr>
<td colspan="2">--authorization-always-allow-paths strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/healthz,/readyz,/livez"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.
-->
在授权过程中跳过的 HTTP 路径列表，即在不联系 “core” kubernetes 服务器的情况下被授权的 HTTP 路径。
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
指向具有足够权限以创建 subjectaccessreviews.authorization.k8s.io 的
Kubernetes 核心服务器的 kubeconfig 文件。这是可选的。
如果为空，则所有未被鉴权机制略过的请求都会被禁止。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer.
-->
缓存来自 Webhook 授权者的 “authorized” 响应的持续时间。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer.
-->
缓存来自 Webhook 授权者的 “unauthorized” 响应的持续时间。
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces and IP address families will be used.
-->
监听 --secure-port 端口的 IP 地址。
集群的其余部分以及 CLI/ Web 客户端必须可以访问关联的接口。
如果为空，将使用所有接口（0.0.0.0 表示使用所有 IPv4 接口，“::” 表示使用所有 IPv6 接口）。
如果为空或未指定地址 (0.0.0.0 或 ::)，所有接口和 IP 地址簇将被使用。
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
TLS 证书所在的目录。如果提供了--tls-cert-file 和 --tls private-key-file，
则将忽略此参数。
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
如果已设置，由 client-ca-file 中的证书机构签名的客户端证书的任何请求都将使用
与客户端证书的 CommonName 对应的身份进行身份验证。
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
配置文件的路径。
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: enable lock contention profiling, if profiling is enabled. This parameter is ignored if a config file is specified in --config.
-->
已弃用: 如果启用了性能分析，则启用锁竞争分析。
如果 --config 指定了一个配置文件，那么这个参数将被忽略。
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
如果为 true，HTTP2 服务将被禁用 [默认值=false]
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
这个标志提供了一个规避不良指标的选项。你必须提供完整的指标名称才能禁用它。
免责声明：禁用指标的优先级比显示隐藏的指标更高。
</td>
</tr>

<tr>
<td colspan="2">--emulated-version strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The versions different components emulate their capabilities (APIs, features, ...) of.<br/>If set, the component will emulate the behavior of this version instead of the underlying binary version.<br/>Version format could only be major.minor, for example: '--emulated-version=wardle=1.2,kube=1.31'. Options are:<br/>kube=1.31..1.31 (default=1.31)If the component is not specified, defaults to &quot;kube&quot;
-->
不同组件所模拟的能力（API、特性等）的版本。<br/>
如果设置了该选项，组件将模拟此版本的行为，而不是下层可执行文件版本的行为。<br/>
版本格式只能是 major.minor，例如 “--emulated-version=wardle=1.2,kube=1.31”。
选项包括：<br/>kube=1.31..1.31（默认值=1.31）。如果组件未被指定，默认为 “kube”。
</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates colonSeparatedMultimapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Comma-separated list of component:key=value pairs that describe feature gates for alpha/experimental features of different components.<br/>
If the component is not specified, defaults to &quot;kube&quot;. This flag can be repeatedly invoked. For example: --feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'Options are:<br/>
kube:APIResponseCompression=true|false (BETA - default=true)<br/>
kube:APIServerIdentity=true|false (BETA - default=true)<br/>
kube:APIServerTracing=true|false (BETA - default=true)<br/>
kube:APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
kube:AllAlpha=true|false (ALPHA - default=false)<br/>
kube:AllBeta=true|false (BETA - default=false)<br/>
kube:AnonymousAuthConfigurableEndpoints=true|false (ALPHA - default=false)<br/>
kube:AnyVolumeDataSource=true|false (BETA - default=true)<br/>
kube:AuthorizeNodeWithSelectors=true|false (ALPHA - default=false)<br/>
kube:AuthorizeWithSelectors=true|false (ALPHA - default=false)<br/>
kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
kube:CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
kube:CRDValidationRatcheting=true|false (BETA - default=true)<br/>
kube:CSIMigrationPortworx=true|false (BETA - default=true)<br/>
kube:CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
kube:CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
kube:ClusterTrustBundle=true|false (ALPHA - default=false)<br/>
kube:ClusterTrustBundleProjection=true|false (ALPHA - default=false)<br/>
kube:ComponentSLIs=true|false (BETA - default=true)<br/>
kube:ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
kube:ConsistentListFromCache=true|false (BETA - default=true)<br/>
kube:ContainerCheckpoint=true|false (BETA - default=true)<br/>
kube:ContextualLogging=true|false (BETA - default=true)<br/>
kube:CoordinatedLeaderElection=true|false (ALPHA - default=false)<br/>
kube:CronJobsScheduledAnnotation=true|false (BETA - default=true)<br/>
kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
kube:CustomResourceFieldSelectors=true|false (BETA - default=true)<br/>
kube:DRAControlPlaneController=true|false (ALPHA - default=false)<br/>
kube:DisableAllocatorDualWrite=true|false (ALPHA - default=false)<br/>
kube:DisableNodeKubeProxyVersion=true|false (BETA - default=true)<br/>
kube:DynamicResourceAllocation=true|false (ALPHA - default=false)<br/>
kube:EventedPLEG=true|false (ALPHA - default=false)<br/>
kube:GracefulNodeShutdown=true|false (BETA - default=true)<br/>
kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
kube:HPAScaleToZero=true|false (ALPHA - default=false)<br/>
kube:HonorPVReclaimPolicy=true|false (BETA - default=true)<br/>
kube:ImageMaximumGCAge=true|false (BETA - default=true)<br/>
kube:ImageVolume=true|false (ALPHA - default=false)<br/>
kube:InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>
kube:InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
kube:InformerResourceVersion=true|false (ALPHA - default=false)<br/>
kube:JobBackoffLimitPerIndex=true|false (BETA - default=true)<br/>
kube:JobManagedBy=true|false (ALPHA - default=false)<br/>
kube:JobPodReplacementPolicy=true|false (BETA - default=true)<br/>
kube:JobSuccessPolicy=true|false (BETA - default=true)<br/>
kube:KubeletCgroupDriverFromCRI=true|false (BETA - default=true)<br/>
kube:KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
kube:KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>
kube:KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>
kube:KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
kube:KubeletTracing=true|false (BETA - default=true)<br/>
kube:LoadBalancerIPMode=true|false (BETA - default=true)<br/>
kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
kube:LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:LoggingBetaOptions=true|false (BETA - default=true)<br/>
kube:MatchLabelKeysInPodAffinity=true|false (BETA - default=true)<br/>
kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
kube:MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
kube:MemoryManager=true|false (BETA - default=true)<br/>
kube:MemoryQoS=true|false (ALPHA - default=false)<br/>
kube:MultiCIDRServiceAllocator=true|false (BETA - default=false)<br/>
kube:MutatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>
kube:NFTablesProxyMode=true|false (BETA - default=true)<br/>
kube:NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>
kube:NodeLogQuery=true|false (BETA - default=false)<br/>
kube:NodeSwap=true|false (BETA - default=true)<br/>
kube:OpenAPIEnums=true|false (BETA - default=true)<br/>
kube:PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
kube:PodDeletionCost=true|false (BETA - default=true)<br/>
kube:PodIndexLabel=true|false (BETA - default=true)<br/>
kube:PodLifecycleSleepAction=true|false (BETA - default=true)<br/>
kube:PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
kube:PortForwardWebsockets=true|false (BETA - default=true)<br/>
kube:ProcMountType=true|false (BETA - default=false)<br/>
kube:QOSReserved=true|false (ALPHA - default=false)<br/>
kube:RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>
kube:RecursiveReadOnlyMounts=true|false (BETA - default=true)<br/>
kube:RelaxedEnvironmentVariableValidation=true|false (ALPHA - default=false)<br/>
kube:ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
kube:ResilientWatchCacheInitialization=true|false (BETA - default=true)<br/>
kube:ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
kube:RetryGenerateName=true|false (BETA - default=true)<br/>
kube:RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
kube:RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
kube:SELinuxMount=true|false (ALPHA - default=false)<br/>
kube:SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
kube:SchedulerQueueingHints=true|false (BETA - default=false)<br/>
kube:SeparateCacheWatchRPC=true|false (BETA - default=true)<br/>
kube:SeparateTaintEvictionController=true|false (BETA - default=true)<br/>
kube:ServiceAccountTokenJTI=true|false (BETA - default=true)<br/>
kube:ServiceAccountTokenNodeBinding=true|false (BETA - default=true)<br/>
kube:ServiceAccountTokenNodeBindingValidation=true|false (BETA - default=true)<br/>
kube:ServiceAccountTokenPodNodeInfo=true|false (BETA - default=true)<br/>
kube:ServiceTrafficDistribution=true|false (BETA - default=true)<br/>
kube:SidecarContainers=true|false (BETA - default=true)<br/>
kube:SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>
kube:StatefulSetAutoDeletePVC=true|false (BETA - default=true)<br/>
kube:StorageNamespaceIndex=true|false (BETA - default=true)<br/>
kube:StorageVersionAPI=true|false (ALPHA - default=false)<br/>
kube:StorageVersionHash=true|false (BETA - default=true)<br/>
kube:StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
kube:StrictCostEnforcementForVAP=true|false (BETA - default=false)<br/>
kube:StrictCostEnforcementForWebhooks=true|false (BETA - default=false)<br/>
kube:StructuredAuthenticationConfiguration=true|false (BETA - default=true)<br/>
kube:StructuredAuthorizationConfiguration=true|false (BETA - default=true)<br/>
kube:SupplementalGroupsPolicy=true|false (ALPHA - default=false)<br/>
kube:TopologyAwareHints=true|false (BETA - default=true)<br/>
kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
kube:TopologyManagerPolicyOptions=true|false (BETA - default=true)<br/>
kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
kube:UserNamespacesSupport=true|false (BETA - default=false)<br/>
kube:VolumeAttributesClass=true|false (BETA - default=false)<br/>
kube:VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
kube:WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
kube:WatchFromStorageWithoutResourceVersion=true|false (BETA - default=false)<br/>
kube:WatchList=true|false (ALPHA - default=false)<br/>
kube:WatchListClient=true|false (BETA - default=false)<br/>
kube:WinDSR=true|false (ALPHA - default=false)<br/>
kube:WinOverlay=true|false (BETA - default=true)<br/>
kube:WindowsHostNetwork=true|false (ALPHA - default=true)
-->
逗号分隔的组件列表，这些 key=value 对用来描述不同组件测试性/试验性特性的特性门控。<br/>
如果组件未被指定，默认值为 “kube”。此标志可以被重复调用。例如：
--feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'
可选项为：<br/>
kube:APIResponseCompression=true|false (BETA - 默认值=true)<br/>
kube:APIServerIdentity=true|false (BETA - 默认值=true)<br/>
kube:APIServerTracing=true|false (BETA - 默认值=true)<br/>
kube:APIServingWithRoutine=true|false (ALPHA - 默认值=false)<br/>
kube:AllAlpha=true|false (ALPHA - 默认值=false)<br/>
kube:AllBeta=true|false (BETA - 默认值=false)<br/>
kube:AnonymousAuthConfigurableEndpoints=true|false (ALPHA - 默认值=false)<br/>
kube:AnyVolumeDataSource=true|false (BETA - 默认值=true)<br/>
kube:AuthorizeNodeWithSelectors=true|false (ALPHA - 默认值=false)<br/>
kube:AuthorizeWithSelectors=true|false (ALPHA - 默认值=false)<br/>
kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - 默认值=false)<br/>
kube:CPUManagerPolicyBetaOptions=true|false (BETA - 默认值=true)<br/>
kube:CPUManagerPolicyOptions=true|false (BETA - 默认值=true)<br/>
kube:CRDValidationRatcheting=true|false (BETA - 默认值=true)<br/>
kube:CSIMigrationPortworx=true|false (BETA - 默认值=true)<br/>
kube:CSIVolumeHealth=true|false (ALPHA - 默认值=false)<br/>
kube:CloudControllerManagerWebhook=true|false (ALPHA - 默认值=false)<br/>
kube:ClusterTrustBundle=true|false (ALPHA - 默认值=false)<br/>
kube:ClusterTrustBundleProjection=true|false (ALPHA - 默认值=false)<br/>
kube:ComponentSLIs=true|false (BETA - 默认值=true)<br/>
kube:ConcurrentWatchObjectDecode=true|false (BETA - 默认值=false)<br/>
kube:ConsistentListFromCache=true|false (BETA - 默认值=true)<br/>
kube:ContainerCheckpoint=true|false (BETA - 默认值=true)<br/>
kube:ContextualLogging=true|false (BETA - 默认值=true)<br/>
kube:CoordinatedLeaderElection=true|false (ALPHA - 默认值=false)<br/>
kube:CronJobsScheduledAnnotation=true|false (BETA - 默认值=true)<br/>
kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - 默认值=false)<br/>
kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默认值=false)<br/>
kube:CustomResourceFieldSelectors=true|false (BETA - 默认值=true)<br/>
kube:DRAControlPlaneController=true|false (ALPHA - 默认值=false)<br/>
kube:DisableAllocatorDualWrite=true|false (ALPHA - 默认值=false)<br/>
kube:DisableNodeKubeProxyVersion=true|false (BETA - 默认值=true)<br/>
kube:DynamicResourceAllocation=true|false (ALPHA - 默认值=false)<br/>
kube:EventedPLEG=true|false (ALPHA - 默认值=false)<br/>
kube:GracefulNodeShutdown=true|false (BETA - 默认值=true)<br/>
kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 默认值=true)<br/>
kube:HPAScaleToZero=true|false (ALPHA - 默认值=false)<br/>
kube:HonorPVReclaimPolicy=true|false (BETA - 默认值=true)<br/>
kube:ImageMaximumGCAge=true|false (BETA - 默认值=true)<br/>
kube:ImageVolume=true|false (ALPHA - 默认值=false)<br/>
kube:InPlacePodVerticalScaling=true|false (ALPHA - 默认值=false)<br/>
kube:InTreePluginPortworxUnregister=true|false (ALPHA - 默认值=false)<br/>
kube:InformerResourceVersion=true|false (ALPHA - 默认值=false)<br/>
kube:JobBackoffLimitPerIndex=true|false (BETA - 默认值=true)<br/>
kube:JobManagedBy=true|false (ALPHA - 默认值=false)<br/>
kube:JobPodReplacementPolicy=true|false (BETA - 默认值=true)<br/>
kube:JobSuccessPolicy=true|false (BETA - 默认值=true)<br/>
kube:KubeletCgroupDriverFromCRI=true|false (BETA - 默认值=true)<br/>
kube:KubeletInUserNamespace=true|false (ALPHA - 默认值=false)<br/>
kube:KubeletPodResourcesDynamicResources=true|false (ALPHA - 默认值=false)<br/>
kube:KubeletPodResourcesGet=true|false (ALPHA - 默认值=false)<br/>
kube:KubeletSeparateDiskGC=true|false (BETA - 默认值=true)<br/>
kube:KubeletTracing=true|false (BETA - 默认值=true)<br/>
kube:LoadBalancerIPMode=true|false (BETA - 默认值=true)<br/>
kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - 默认值=false)<br/>
kube:LoggingAlphaOptions=true|false (ALPHA - 默认值=false)<br/>
kube:LoggingBetaOptions=true|false (BETA - 默认值=true)<br/>
kube:MatchLabelKeysInPodAffinity=true|false (BETA - 默认值=true)<br/>
kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - 默认值=true)<br/>
kube:MaxUnavailableStatefulSet=true|false (ALPHA - 默认值=false)<br/>
kube:MemoryManager=true|false (BETA - 默认值=true)<br/>
kube:MemoryQoS=true|false (ALPHA - 默认值=false)<br/>
kube:MultiCIDRServiceAllocator=true|false (BETA - 默认值=false)<br/>
kube:MutatingAdmissionPolicy=true|false (ALPHA - 默认值=false)<br/>
kube:NFTablesProxyMode=true|false (BETA - 默认值=true)<br/>
kube:NodeInclusionPolicyInPodTopologySpread=true|false (BETA - 默认值=true)<br/>
kube:NodeLogQuery=true|false (BETA - 默认值=false)<br/>
kube:NodeSwap=true|false (BETA - 默认值=true)<br/>
kube:OpenAPIEnums=true|false (BETA - 默认值=true)<br/>
kube:PodAndContainerStatsFromCRI=true|false (ALPHA - 默认值=false)<br/>
kube:PodDeletionCost=true|false (BETA - 默认值=true)<br/>
kube:PodIndexLabel=true|false (BETA - 默认值=true)<br/>
kube:PodLifecycleSleepAction=true|false (BETA - 默认值=true)<br/>
kube:PodReadyToStartContainersCondition=true|false (BETA - 默认值=true)<br/>
kube:PortForwardWebsockets=true|false (BETA - 默认值=true)<br/>
kube:ProcMountType=true|false (BETA - 默认值=false)<br/>
kube:QOSReserved=true|false (ALPHA - 默认值=false)<br/>
kube:RecoverVolumeExpansionFailure=true|false (ALPHA - 默认值=false)<br/>
kube:RecursiveReadOnlyMounts=true|false (BETA - 默认值=true)<br/>
kube:RelaxedEnvironmentVariableValidation=true|false (ALPHA - 默认值=false)<br/>
kube:ReloadKubeletServerCertificateFile=true|false (BETA - 默认值=true)<br/>
kube:ResilientWatchCacheInitialization=true|false (BETA - 默认值=true)<br/>
kube:ResourceHealthStatus=true|false (ALPHA - 默认值=false)<br/>
kube:RetryGenerateName=true|false (BETA - 默认值=true)<br/>
kube:RotateKubeletServerCertificate=true|false (BETA - 默认值=true)<br/>
kube:RuntimeClassInImageCriApi=true|false (ALPHA - 默认值=false)<br/>
kube:SELinuxMount=true|false (ALPHA - 默认值=false)<br/>
kube:SELinuxMountReadWriteOncePod=true|false (BETA - 默认值=true)<br/>
kube:SchedulerQueueingHints=true|false (BETA - 默认值=false)<br/>
kube:SeparateCacheWatchRPC=true|false (BETA - 默认值=true)<br/>
kube:SeparateTaintEvictionController=true|false (BETA - 默认值=true)<br/>
kube:ServiceAccountTokenJTI=true|false (BETA - 默认值=true)<br/>
kube:ServiceAccountTokenNodeBinding=true|false (BETA - 默认值=true)<br/>
kube:ServiceAccountTokenNodeBindingValidation=true|false (BETA - 默认值=true)<br/>
kube:ServiceAccountTokenPodNodeInfo=true|false (BETA - 默认值=true)<br/>
kube:ServiceTrafficDistribution=true|false (BETA - 默认值=true)<br/>
kube:SidecarContainers=true|false (BETA - 默认值=true)<br/>
kube:SizeMemoryBackedVolumes=true|false (BETA - 默认值=true)<br/>
kube:StatefulSetAutoDeletePVC=true|false (BETA - 默认值=true)<br/>
kube:StorageNamespaceIndex=true|false (BETA - 默认值=true)<br/>
kube:StorageVersionAPI=true|false (ALPHA - 默认值=false)<br/>
kube:StorageVersionHash=true|false (BETA - 默认值=true)<br/>
kube:StorageVersionMigrator=true|false (ALPHA - 默认值=false)<br/>
kube:StrictCostEnforcementForVAP=true|false (BETA - 默认值=false)<br/>
kube:StrictCostEnforcementForWebhooks=true|false (BETA - 默认值=false)<br/>
kube:StructuredAuthenticationConfiguration=true|false (BETA - 默认值=true)<br/>
kube:StructuredAuthorizationConfiguration=true|false (BETA - 默认值=true)<br/>
kube:SupplementalGroupsPolicy=true|false (ALPHA - 默认值=false)<br/>
kube:TopologyAwareHints=true|false (BETA - 默认值=true)<br/>
kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - 默认值=false)<br/>
kube:TopologyManagerPolicyBetaOptions=true|false (BETA - 默认值=true)<br/>
kube:TopologyManagerPolicyOptions=true|false (BETA - 默认值=true)<br/>
kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - 默认值=true)<br/>
kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - 默认值=true)<br/>
kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - 默认值=false)<br/>
kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - 默认值=false)<br/>
kube:UserNamespacesSupport=true|false (BETA - 默认值=false)<br/>
kube:VolumeAttributesClass=true|false (BETA - 默认值=false)<br/>
kube:VolumeCapacityPriority=true|false (ALPHA - 默认值=false)<br/>
kube:WatchCacheInitializationPostStartHook=true|false (BETA - 默认值=false)<br/>
kube:WatchFromStorageWithoutResourceVersion=true|false (BETA - 默认值=false)<br/>
kube:WatchList=true|false (ALPHA - 默认值=false)<br/>
kube:WatchListClient=true|false (BETA - 默认值=false)<br/>
kube:WinDSR=true|false (ALPHA - 默认值=false)<br/>
kube:WinOverlay=true|false (BETA - 默认值=true)<br/>
kube:WindowsHostNetwork=true|false (ALPHA - 默认值=true)
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
kube-scheduler 帮助命令
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
服务器为客户端提供的 HTTP/2 连接最大限制。零表示使用 Golang 的默认值。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: burst to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.
-->
已弃用: 与 kubernetes API 通信时使用的突发请求个数限值。
如果 --config 指定了一个配置文件，那么这个参数将被忽略。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: content type of requests sent to apiserver. This parameter is ignored if a config file is specified in --config.
-->
已弃用: 发送到 API 服务器的请求的内容类型。
如果 --config 指定了一个配置文件，那么这个参数将被忽略。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: QPS to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.
-->
已弃用: 与 kubernetes apiserver 通信时要使用的 QPS
如果 --config 指定了一个配置文件，那么这个参数将被忽略。
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
已弃用: 包含鉴权和主节点位置信息的 kubeconfig 文件的路径。
如果 --config 指定了一个配置文件，那么这个参数将被忽略。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.
-->
在执行主循环之前，开始领导者选举并选出领导者。
使用多副本来实现高可用性时，可启用此标志。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.
-->
非领导者候选人在观察到领导者更新后将等待直到试图获得领导但未更新的领导者职位的等待时间。
这实际上是领导者在被另一位候选人替代之前可以停止的最大持续时间。
该情况仅在启用了领导者选举的情况下才适用。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than the lease duration. This is only applicable if leader election is enabled.
-->
领导者尝试在停止领导之前更新领导职位的间隔时间。该时间必须小于租赁期限。
仅在启用了领导者选举的情况下才适用。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："leases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The type of resource object that is used for locking during leader election. Supported options are 'leases', 'endpointsleases' and 'configmapsleases'.
-->
在领导者选举期间用于锁定的资源对象的类型。支持的选项有 `leases`、`endpointleases` 和 `configmapsleases`。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："kube-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The name of resource object that is used for locking during leader election.
-->
在领导者选举期间用于锁定的资源对象的名称。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The namespace of resource object that is used for locking during leader election.
-->
在领导者选举期间用于锁定的资源对象的命名空间。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：2s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.
-->
客户应在尝试获取和更新领导之间等待的时间。仅在启用了领导者选举的情况下才适用。
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes
-->
两次日志刷新之间的最大秒数。
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
[Alpha] 在具有分割输出流的文本格式中，信息消息可以被缓冲一段时间以提高性能。
默认值零字节表示禁用缓冲区机制。
大小可以指定为字节数（512）、1000 的倍数（1K）、1024 的倍数（2Ki）或它们的幂（3M、4G、5Mi、6Gi）。
启用 LoggingAlphaOptions 特性门控以使用此功能。
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
[Alpha] 以文本格式，将错误消息写入 stderr，将信息消息写入 stdout。
默认是将单个流写入标准输出。
启用 LoggingAlphaOptions 特性门控以使用此功能。
</p>
</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：“text”</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets the log format. Permitted formats: &quot;text&quot;.
-->
设置日志格式。可选格式：“text”。
</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
log to standard error instead of files
-->
日志记录到标准错误输出而不是文件。
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
Kubernetes API 服务器的地址（覆盖 kubeconfig 中的任何值）。
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
如果为 true，在绑定端口时将使用 SO_REUSEADDR。
这将允许同时绑定诸如 0.0.0.0 这类通配符 IP和特定 IP，
并且它避免等待内核释放处于 TIME_WAIT 状态的套接字。
默认值：false
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
如果此标志为 true，在绑定端口时会使用 SO_REUSEPORT，从而允许不止一个
实例绑定到同一地址和端口。
默认值：false
</td>
</tr>

<tr>

<td colspan="2">--pod-max-in-unschedulable-pods-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: the maximum time a pod can stay in unschedulablePods. If a pod stays in unschedulablePods for longer than this value, the pod will be moved from unschedulablePods to backoffQ or activeQ. This flag is deprecated and will be removed in a future version.
-->
已弃用：Pod 可以在 unschedulablePods 中停留的最长时间。
如果 Pod 在 unschedulablePods 中停留的时间超过此值，则该 pod 将被从
unschedulablePods 移动到 backoffQ 或 activeQ。
此标志已弃用，将在后续版本中移除。

</td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: enable profiling via web interface host:port/debug/pprof/. 
This parameter is ignored if a config file is specified in --config.
-->
已弃用: 通过 Web 界面主机启用配置文件：<code>host:port/debug/pprof/</code>。
如果 --config 指定了一个配置文件，这个参数将被忽略。
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
客户端证书通用名称列表，允许在 <code>--requestheader-username-headers</code>
指定的头部中提供用户名。如果为空，则允许任何由
<code>--requestheader-client-ca-file</code> 中证书机构验证的客户端证书。
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
在信任 <code>--requestheader-username-headers</code> 指定的头部中的用户名之前
用于验证传入请求上的客户端证书的根证书包。
警告：通常不应假定传入请求已经完成鉴权。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-extra-headers-prefix strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default:-->默认值："x-remote-extra-"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request header prefixes to inspect. X-Remote-Extra- is suggested.
-->
要检查请求头部前缀列表。建议使用 <code>X-Remote-Extra-</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default:-->默认值："x-remote-group"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for groups. X-Remote-Group is suggested.
-->
用于检查组的请求头部列表。建议使用 <code>X-Remote-Group</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--Default:-->默认值："x-remote-user"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for usernames. X-Remote-User is common.
-->
用于检查用户名的请求头部列表。<code>X-Remote-User</code> 很常用。
</td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10259</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.
-->
通过身份验证和授权为 HTTPS 服务的端口。如果为 0，则根本不提供 HTTPS。
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
你希望显式隐藏指标的老版本号。只有较早的此版本号有意义，其它值都是不允许的。
格式为 &lt;主版本&gt;.&lt;此版本&gt;，例如：'1.16'。
此格式的目的是确保你有机会注意到是否下一个发行版本中隐藏了一些额外的指标，
而不是当某些指标在该版本之后被彻底移除时感到震惊。
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
包含默认的 HTTPS x509 证书的文件。（如果有 CA 证书，在服务器证书之后并置）。
如果启用了 HTTPS 服务，并且未提供 <code>--tls-cert-file</code> 和
<code>--tls-private-key-file</code>，则会为公共地址生成一个自签名证书和密钥，
并将其保存到 <code>--cert-dir</code> 指定的目录中。
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
服务器的密码套件列表，以逗号分隔。如果省略，将使用默认的 Go 密码套件。<br/>
优先考虑的值：
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
包含与 --tls-cert-file 匹配的默认 x509 私钥的文件。
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
一对 x509 证书和私钥文件路径，也可以包含由全限定域名构成的域名模式列表作为后缀，
并可能带有前缀的通配符段。域名匹配还允许是 IP 地址，
但是只有当 apiserver 对客户端请求的 IP 地址可见时，才能使用 IP。
如果未提供域名匹配模式，则提取证书名称。
非通配符匹配优先于通配符匹配，显式域名匹配优先于提取而来的名称。
若有多个密钥/证书对，可多次使用 <code>--tls-sni-cert-key</code>。
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
设置日志级别详细程度的数字
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
--version, --version=raw 打印版本信息并推出；
--version=vX.Y.Z... 设置报告的版本。
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
以逗号分隔的 “pattern=N” 设置列表，用于文件过滤的日志记录（仅适用于文本日志格式）。
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
如果设置此参数，将配置值写入此文件并退出。
</td>
</tr>

</tbody>
</table>



