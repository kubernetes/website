---
title: kube-scheduler
content_type: tool-reference
weight: 30
---
<!-- 
title: kube-scheduler
content_type: tool-reference
weight: 28
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
参阅[调度](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/)
以获得关于调度和 kube-scheduler 组件的更多信息。

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
<td colspan="2">--add-dir-header</td>
</tr>
<tr><td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
If true, adds the file directory to the header of the log messages
-->
如果为 true，则将文件目录添加到日志消息的头部
</td>
</tr>

<tr><td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："0.0.0.0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
DEPRECATED: the IP address on which to listen for the --port port (set to 0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces). See --bind-address instead. 
-->
已弃用: 要监听 --port 端口的 IP 地址（对于所有 IPv4 接口设置为 0.0.0.0，对于所有 IPv6 接口设置为 ::）。 
请参阅 --bind-address。
</td>
</tr>

<tr>
<td colspan="2">--algorithm-provider string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: the scheduling algorithm provider to use, this sets the default plugins for component config profiles. Choose one of: ClusterAutoscalerProvider | DefaultProvider
-->
已弃用: 要使用的调度算法驱动，此标志设置组件配置框架的默认插件。
可选值：ClusterAutoscalerProvider | DefaultProvider
</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
日志记录到标准错误以及文件
-->
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
<td colspan="2">--authorization-always-allow-paths stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：[/healthz]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.
-->
在授权过程中跳过的 HTTP 路径列表，即在不联系 'core'  kubernetes 服务器的情况下被授权的 HTTP 路径。
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
缓存来自 Webhook 授权者的 'authorized' 响应的持续时间。
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
缓存来自 Webhook 授权者的 'unauthorized' 响应的持续时间。
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
包含 Azure 容器仓库配置信息的文件的路径。
</td>
</tr>

<tr>
<td colspan="2">--bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank, all interfaces will be used (0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces).
-->
监听 --secure-port 端口的 IP 地址。
集群的其余部分以及 CLI/ Web 客户端必须可以访问关联的接口。
如果为空，将使用所有接口（0.0.0.0 表示使用所有 IPv4 接口，"::" 表示使用所有 IPv6 接口）。
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
The path to the configuration file. The following flags can overwrite fields in this file:<br/>  --address<br/>  --port<br/>  --use-legacy-policy-config<br/>  --policy-configmap<br/>  --policy-config-file<br/>  --algorithm-provider
-->
配置文件的路径。以下标志会覆盖此文件中的值：<br/>
--address<br/>
--port<br/>
--use-legacy-policy-config<br/>
--policy-configmap<br/>
--policy-config-file<br/>
--algorithm-provider
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: enable lock contention profiling, if profiling is enabled
-->
已弃用: 如果启用了性能分析，则启用锁竞争分析
</td>
</tr>

<tr>
<td colspan="2">--experimental-logging-sanitization</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] When enabled prevents logging of fields tagged as sensitive (passwords, keys, tokens).<br/>Runtime log sanitization may introduce significant computation overhead and therefore should not be enabled in production.
-->
[试验性功能] 当启用此标志时，标记为敏感的字段（密码、密钥、令牌）等不会被日志
输出。<br/>
运行时的日志清理操作可能引入相当程度的计算开销，因此不应在生产环境中启用。
</td>
</tr>

<tr>
<td colspan="2">--feature-gates mapStringBool</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>
APIListChunking=true|false (BETA - default=true)<br/>
APIPriorityAndFairness=true|false (BETA - default=true)<br/>
APIResponseCompression=true|false (BETA - default=true)<br/>
APIServerIdentity=true|false (ALPHA - default=false)<br/>
AllAlpha=true|false (ALPHA - default=false)<br/>
AllBeta=true|false (BETA - default=false)<br/>
AllowInsecureBackendProxy=true|false (BETA - default=true)<br/>
AnyVolumeDataSource=true|false (ALPHA - default=false)<br/>
AppArmor=true|false (BETA - default=true)<br/>
BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>
BoundServiceAccountTokenVolume=true|false (ALPHA - default=false)<br/>
CPUManager=true|false (BETA - default=true)<br/>
CRIContainerLogRotation=true|false (BETA - default=true)<br/>
CSIInlineVolume=true|false (BETA - default=true)<br/>
CSIMigration=true|false (BETA - default=true)<br/>
CSIMigrationAWS=true|false (BETA - default=false)<br/>
CSIMigrationAWSComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationAzureDisk=true|false (BETA - default=false)<br/>
CSIMigrationAzureDiskComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationAzureFile=true|false (ALPHA - default=false)<br/>
CSIMigrationAzureFileComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationGCE=true|false (BETA - default=false)<br/>
CSIMigrationGCEComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationOpenStack=true|false (BETA - default=false)<br/>
CSIMigrationOpenStackComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationvSphere=true|false (BETA - default=false)<br/>
CSIMigrationvSphereComplete=true|false (BETA - default=false)<br/>
CSIServiceAccountToken=true|false (ALPHA - default=false)<br/>
CSIStorageCapacity=true|false (ALPHA - default=false)<br/>
CSIVolumeFSGroupPolicy=true|false (BETA - default=true)<br/>
ConfigurableFSGroupPolicy=true|false (BETA - default=true)<br/>
CronJobControllerV2=true|false (ALPHA - default=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
DefaultPodTopologySpread=true|false (BETA - default=true)<br/>
DevicePlugins=true|false (BETA - default=true)<br/>
DisableAcceleratorUsageMetrics=true|false (BETA - default=true)<br/>
DownwardAPIHugePages=true|false (ALPHA - default=false)<br/>
DynamicKubeletConfig=true|false (BETA - default=true)<br/>
EfficientWatchResumption=true|false (ALPHA - default=false)<br/>
EndpointSlice=true|false (BETA - default=true)<br/>
EndpointSliceNodeName=true|false (ALPHA - default=false)<br/>
EndpointSliceProxying=true|false (BETA - default=true)<br/>
EndpointSliceTerminatingCondition=true|false (ALPHA - default=false)<br/>
EphemeralContainers=true|false (ALPHA - default=false)<br/>
ExpandCSIVolumes=true|false (BETA - default=true)<br/>
ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>
ExpandPersistentVolumes=true|false (BETA - default=true)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>
GenericEphemeralVolume=true|false (ALPHA - default=false)<br/>
GracefulNodeShutdown=true|false (ALPHA - default=false)<br/>
HPAContainerMetrics=true|false (ALPHA - default=false)<br/>
HPAScaleToZero=true|false (ALPHA - default=false)<br/>
HugePageStorageMediumSize=true|false (BETA - default=true)<br/>
IPv6DualStack=true|false (ALPHA - default=false)<br/>
ImmutableEphemeralVolumes=true|false (BETA - default=true)<br/>
KubeletCredentialProviders=true|false (ALPHA - default=false)<br/>
KubeletPodResources=true|false (BETA - default=true)<br/>
LegacyNodeRoleBehavior=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>
MixedProtocolLBService=true|false (ALPHA - default=false)<br/>
NodeDisruptionExclusion=true|false (BETA - default=true)<br/>
NonPreemptingPriority=true|false (BETA - default=true)<br/>
PodDisruptionBudget=true|false (BETA - default=true)<br/>
PodOverhead=true|false (BETA - default=true)<br/>
ProcMountType=true|false (ALPHA - default=false)<br/>
QOSReserved=true|false (ALPHA - default=false)<br/>
RemainingItemCount=true|false (BETA - default=true)<br/>
RemoveSelfLink=true|false (BETA - default=true)<br/>
RootCAConfigMap=true|false (BETA - default=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
RunAsGroup=true|false (BETA - default=true)<br/>
ServerSideApply=true|false (BETA - default=true)<br/>
ServiceAccountIssuerDiscovery=true|false (BETA - default=true)<br/>
ServiceLBNodePortControl=true|false (ALPHA - default=false)<br/>
ServiceNodeExclusion=true|false (BETA - default=true)<br/>
ServiceTopology=true|false (ALPHA - default=false)<br/>
SetHostnameAsFQDN=true|false (BETA - default=true)<br/>
SizeMemoryBackedVolumes=true|false (ALPHA - default=false)<br/>
StorageVersionAPI=true|false (ALPHA - default=false)<br/>
StorageVersionHash=true|false (BETA - default=true)<br/>
Sysctls=true|false (BETA - default=true)<br/>
TTLAfterFinished=true|false (ALPHA - default=false)<br/>
TopologyManager=true|false (BETA - default=true)<br/>
ValidateProxyRedirects=true|false (BETA - default=true)<br/>
WarningHeaders=true|false (BETA - default=true)<br/>
WinDSR=true|false (ALPHA - default=false)<br/>
WinOverlay=true|false (BETA - default=true)<br/>
WindowsEndpointSliceProxying=true|false (ALPHA - default=false)
-->
一组 key=value 对，描述了 alpha/experimental 特征开关。选项包括：<br/>
APIListChunking=true|false (BETA - 默认值=true)<br/>
APIPriorityAndFairness=true|false (BETA - 默认值=true)<br/>
APIResponseCompression=true|false (BETA - 默认值=true)<br/>
APIServerIdentity=true|false (ALPHA - 默认值=false)<br/>
AllAlpha=true|false (ALPHA - 默认值=false)<br/>
AllBeta=true|false (BETA - 默认值=false)<br/>
AllowInsecureBackendProxy=true|false (BETA - 默认值=true)<br/>
AnyVolumeDataSource=true|false (ALPHA - 默认值=false)<br/>
AppArmor=true|false (BETA - 默认值=true)<br/>
BalanceAttachedNodeVolumes=true|false (ALPHA - 默认值=false)<br/>
BoundServiceAccountTokenVolume=true|false (ALPHA - 默认值=false)<br/>
CPUManager=true|false (BETA - 默认值=true)<br/>
CRIContainerLogRotation=true|false (BETA - 默认值=true)<br/>
CSIInlineVolume=true|false (BETA - 默认值=true)<br/>
CSIMigration=true|false (BETA - 默认值=true)<br/>
CSIMigrationAWS=true|false (BETA - 默认值=true)<br/>
CSIMigrationAWSComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationAzureDisk=true|false (BETA - 默认值=true)<br/>
CSIMigrationAzureDiskComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationAzureFile=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationAzureFileComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationGCE=true|false (BETA - 默认值=true)<br/>
CSIMigrationGCEComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationOpenStack=true|false (BETA - 默认值=true)<br/>
CSIMigrationOpenStackComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationvSphere=true|false (BETA - 默认值=false)<br/>
CSIMigrationvSphereComplete=true|false (BETA - default=false)<br/>
CSIServiceAccountToken=true|false (ALPHA - 默认值=false)<br/>
CSIStorageCapacity=true|false (ALPHA - 默认值=false)<br/>
CSIVolumeFSGroupPolicy=true|false (BETA - 默认值=true)<br/>
ConfigurableFSGroupPolicy=true|false (BETA - 默认值=true)<br/>
CronJobControllerV2=true|false (ALPHA - 默认值=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默认值=false)<br/>
DefaultPodTopologySpread=true|false (BETA - 默认值=true)<br/>
DevicePlugins=true|false (BETA - 默认值=true)<br/>
DisableAcceleratorUsageMetrics=true|false (BETA - 默认值=true)<br/>
DownwardAPIHugePages=true|false (ALPHA - 默认值=false)<br/>
DynamicKubeletConfig=true|false (BETA - 默认值=true)<br/>
EfficientWatchResumption=true|false (ALPHA - 默认值=false)<br/>
EndpointSlice=true|false (ALPHA - 默认值=false)<br/>
EndpointSliceNodeName=true|false (ALPHA - 默认值=false)<br/>
EndpointSliceProxying=true|false (BETA - 默认值=true)<br/>
EndpointSliceTerminatingCondition=true|false (ALPHA - 默认值=false)<br/>
EphemeralContainers=true|false (ALPHA - 默认值=false)<br/>
ExpandCSIVolumes=true|false (BETA - 默认值=true)<br/>
ExpandInUsePersistentVolumes=true|false (BETA - 默认值=true)<br/>
ExpandPersistentVolumes=true|false (BETA - 默认值=true)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 默认值=false)<br/>
GenericEphemeralVolume=true|false (ALPHA - 默认值=false)<br/>
GracefulNodeShutdown=true|false (ALPHA - 默认值=false)<br/>
HPAContainerMetrics=true|false (ALPHA - 默认值=false)<br/>
HPAScaleToZero=true|false (ALPHA - 默认值=false)<br/>
HugePageStorageMediumSize=true|false (BETA - 默认值=true)<br/>
IPv6DualStack=true|false (ALPHA - 默认值=false)<br/>
ImmutableEphemeralVolumes=true|false (BETA - 默认值=true)<br/>
KubeletCredentialProviders=true|false (ALPHA - 默认值=false)<br/>
KubeletPodResources=true|false (BETA - 默认值=true)<br/>
LegacyNodeRoleBehavior=true|false (BETA - 默认值=true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - 默认值=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 默认值=false)<br/>
MixedProtocolLBService=true|false (ALPHA - 默认值=false)<br/>
NodeDisruptionExclusion=true|false (BETA - 默认值=false)<br/>
NonPreemptingPriority=true|false (BETA - 默认值=true)<br/>
PodDisruptionBudget=true|false (BETA - 默认值=true)<br/>
PodOverhead=true|false (BETA - 默认值=true)<br/>
ProcMountType=true|false (ALPHA - 默认值=false)<br/>
QOSReserved=true|false (ALPHA - 默认值=false)<br/>
RemainingItemCount=true|false (BETA - 默认值=true)<br/>
RemoveSelfLink=true|false (BETA - 默认值=true)<br/>
RootCAConfigMap=true|false (BETA - 默认值=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - 默认值=true)<br/>
RunAsGroup=true|false (BETA - 默认值=true)<br/>
ServerSideApply=true|false (BETA - 默认值=true)<br/>
ServiceAccountIssuerDiscovery=true|false (BETA - 默认值=true)<br/>
ServiceLBNodePortControl=true|false (ALPHA - 默认值=false)<br/>
ServiceNodeExclusion=true|false (BETA - 默认值=true)<br/>
ServiceTopology=true|false (ALPHA - 默认值=false)<br/>
SetHostnameAsFQDN=true|false (BETA - 默认值=true)<br/>
SizeMemoryBackedVolumes=true|false (ALPHA - 默认值=false)<br/>
StorageVersionAPI=true|false (ALPHA - 默认值=false)<br/>
StorageVersionHash=true|false (BETA - 默认值=true)<br/>
Sysctls=true|false (BETA - 默认值=true)<br/>
TTLAfterFinished=true|false (ALPHA - 默认值=false)<br/>
TopologyManager=true|false (BETA - 默认值=true)<br/>
ValidateProxyRedirects=true|false (BETA - 默认值=true)<br/>
WarningHeaders=true|false (BETA - 默认值=true)<br/>
WinDSR=true|false (ALPHA - 默认值=false)<br/>
WinOverlay=true|false (BETA - 默认值=true)<br/>
WindowsEndpointSliceProxying=true|false (ALPHA - 默认值=false)
</td>
</tr>

<tr>
<td colspan="2">--hard-pod-affinity-symmetric-weight int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: RequiredDuringScheduling affinity is not symmetric, but there is an implicit PreferredDuringScheduling affinity rule corresponding to every RequiredDuringScheduling affinity rule. --hard-pod-affinity-symmetric-weight represents the weight of implicit PreferredDuringScheduling affinity rule. Must be in the range 0-100.This option was moved to the policy configuration file
-->
已弃用: RequiredDuringScheduling 亲和性是不对称的，但是存在与每个
RequiredDuringScheduling 关联性规则相对应的隐式 PreferredDuringScheduling 关联性规则。
<code>--hard-pod-affinity-symmetric-weight</code> 代表隐式 PreferredDuringScheduling
关联性规则的权重。权重必须在 0-100 范围内。此选项已移至策略配置文件。
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
DEPRECATED: burst to use while talking with kubernetes apiserver
-->
已弃用: 与 kubernetes API 通信时使用的突发请求个数限值。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: content type of requests sent to apiserver.
-->
已弃用: 发送到 API 服务器的请求的内容类型。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: QPS to use while talking with kubernetes apiserver
-->
已弃用: 与 kubernetes apiserver 通信时要使用的 QPS
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: path to kubeconfig file with authorization and master location information.
-->
已弃用: 包含鉴权和主节点位置信息的 kubeconfig 文件的路径。
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
The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.
-->
领导者尝试在停止领导之前更新领导职位的间隔时间。该时间必须小于或等于租赁期限。
仅在启用了领导者选举的情况下才适用。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock endpoints&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："leases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The type of resource object that is used for locking during leader election. Supported options are 'endpoints', 'configmaps', 'leases', 'endpointsleases' and 'configmapsleases'.
-->
在领导者选举期间用于锁定的资源对象的类型。支持的选项是 `endpoints`、
`configmaps`、`leases`、`endpointleases` 和 `configmapsleases`。
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
<td colspan="2">--lock-object-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："kube-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: define the name of the lock object. Will be removed in favor of leader-elect-resource-name
-->
已弃用: 定义锁对象的名称。将被删除以便使用 <code>--leader-elect-resource-name</code>。
</td>
</tr>

<tr>
<td colspan="2">--lock-object-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: define the namespace of the lock object. Will be removed in favor of leader-elect-resource-namespace.
-->
已弃用: 定义锁对象的命名空间。将被删除以便使用 <code>leader-elect-resource-namespace</code>。
</td>
</tr>

<tr>
<td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：:0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
when logging hits line file:N, emit a stack trace
-->
当记录命中行文件 <code>file</code> 的第 <code>N</code> 行时输出堆栈跟踪。
</td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, write log files in this directory
-->
如果为非空，则在此目录中写入日志文件。
</td>
</tr>

<tr>
<td colspan="2">--log-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, use this log file
-->
如果为非空，则使用此文件作为日志文件。
</td>
</tr>

<tr>
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.
-->
定义日志文件可以增长到的最大值。单位为兆字节。
如果值为 0，则最大文件大小为无限制。
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
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets the log format. Permitted formats: "json", "text".<br/>Non-default formats don't honor these flags: --add_dir_header, --alsologtostderr, --log_backtrace_at, --log_dir, --log_file, --log_file_max_size, --logtostderr, --one_output, --skip_headers, --skip_log_headers, --stderrthreshold, --vmodule, --log-flush-frequency.<br/>Non-default choices are currently alpha and subject to change without warning.
-->
设置日志格式。可选格式："json"、"text"。<br/>
非默认格式不会在意以下标志设置：
--add_dir_header、--alsologtostderr、--log_backtrace_at、--log_dir、
--log_file、--log_file_max_size、--logtostderr、--one_output、
--skip_headers、--skip_log_headers、--stderrthreshold、--vmodule、
--log-flush-frequency.<br/>
非默认选项目前处于 Alpha 阶段，有可能会出现变更且无事先警告。
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
<td colspan="2">--one-output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, only write logs to their native severity level (vs also writing to each lower severity level
-->
若此标志为 true，则日志仅写入其自身的严重性级别，而不会写入所有较低严重性级别。
</td>
</tr>

<tr>
<td colspan="2">--permit-port-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, SO_REUSEPORT will be used when binding the port, which allows more than one instance to bind on the same address and port.
-->
如果此标志为 true，在绑定端口时会使用 SO_REUSEPORT，从而允许不止一个
实例绑定到同一地址和端口。 
</td>
</tr>

<tr>
<td colspan="2">--policy-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: file with scheduler policy configuration. This file is used if policy ConfigMap is not provided or --use-legacy-policy-config=true. Note: The scheduler will fail if this is combined with Plugin configs
-->
已弃用：包含调度器策略配置的文件。
当策略 ConfigMap 为提供时，或者 <code>--use-legacy-policy-config=true</code> 时使用此文件。
注意：当此标志与插件配置一起使用时，调度器会失败。
</td>
</tr>

<tr>
<td colspan="2">--policy-configmap string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: name of the ConfigMap object that contains scheduler's policy configuration. It must exist in the system namespace before scheduler initialization if --use-legacy-policy-config=false. The config must be provided as the value of an element in 'Data' map with the key='policy.cfg'. Note: The scheduler will fail if this is combined with Plugin configs
-->
已弃用: 包含调度器策略配置的 ConfigMap 对象的名称。
如果 --use-legacy-policy-config=false，则它必须在调度器初始化之前存在于
系统命名空间中。配置数据必须对应 'data' 映射中键名为 'policy.cfg' 的元素的值。
注意：如果与插件配置一起使用，调度器会失败。
</td>
</tr>

<tr>
<td colspan="2">--policy-configmap-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: the namespace where policy ConfigMap is located. The kube-system namespace will be used if this is not provided or is empty. Note: The scheduler will fail if this is combined with Plugin configs
-->
已弃用: 策略 ConfigMap 所在的名字空间。如果未提供或为空，则将使用 kube-system 名字空间。
注意：如果与插件配置一起使用，调度器会失败。
</td>
</tr>

<tr>
<td colspan="2">--port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10251</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: the port on which to serve HTTP insecurely without authentication and authorization. If 0, don't serve plain HTTP at all. See --secure-port instead.
-->
已弃用: 在没有身份验证和授权的情况下不安全地为 HTTP 服务的端口。
如果为0，则根本不提供 HTTP。请参见--secure-port。
</td>
</tr>

<tr>
<td colspan="2">--profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: enable profiling via web interface host:port/debug/pprof/
-->
已弃用: 通过 Web 界面主机启用配置文件：<code>host:port/debug/pprof/</code>。
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
<td colspan="2"> --requestheader-extra-headers-prefix stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：[x-remote-extra-]</td>
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
<td colspan="2">--requestheader-group-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：[x-remote-group]</td>
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
<td colspan="2">--requestheader-username-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：[x-remote-user]</td>
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
<td colspan="2">--scheduler-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："default-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
DEPRECATED: name of the scheduler, used to select which pods will be processed by this scheduler, based on pod's "spec.schedulerName".
-->
已弃用: 调度器名称，用于根据 Pod 的 "spec.schedulerName" 选择此
调度器将处理的 Pod。
</td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10259</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port on which to serve HTTPS with authentication and authorization.If 0, don't serve HTTPS at all.
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
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, avoid header prefixes in the log messages
-->
如果为 true，日志消息中不再写入头部前缀。
</td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, avoid headers when opening log files
-->
如果为 true，则在打开日志文件时忽略其头部。
</td>
</tr>

<tr>
<td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
logs at or above this threshold go to stderr
-->
达到或超过此阈值的日志会被写入到标准错误输出。
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
包含默认的 HTTPS x509 证书的文件。（CA证书（如果有）在服务器证书之后并置）。
如果启用了 HTTPS 服务，并且未提供 <code>--tls-cert-file</code> 和
<code>--tls-private-key-file</code>，则会为公共地址生成一个自签名证书和密钥，
并将其保存到 <code>--cert-dir</code> 指定的目录中。
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>
Preferred values:
TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384. <br/>
Insecure values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.
-->
服务器的密码套件列表，以逗号分隔。如果省略，将使用默认的 Go 密码套件。
优先考虑的值：
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
<td colspan="2">--tls-sni-cert-key namedCertKey&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com".
-->
一对 x509 证书和私钥文件路径，可选地后缀为完全限定域名的域模式列表，
并可能带有前缀的通配符段。如果未提供域名模式，则提取证书名称。
非通配符匹配优先于通配符匹配，显式域名模式优先于提取而来的名称。
若有多个密钥/证书对，可多次使用 <code>--tls-sni-cert-key</code>。
例如: "example.crt,example.key" 或者 "foo.crt,foo.key:*.foo.com,foo.com"。
</td>
</tr>

<tr>
<td colspan="2">--use-legacy-policy-config</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: when set to true, scheduler will ignore policy ConfigMap and uses policy config file. Note: The scheduler will fail if this is combined with Plugin configs
-->
已弃用：设置为 true 时，调度程序将忽略策略 ConfigMap 并使用策略配置文件。
注意：当此标志与插件配置一起使用时，调度器会失败。
</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
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
Print version information and quit
-->
打印版本信息并退出。
</td>
</tr>

<tr>
<td colspan="2">--vmodule moduleSpec</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
comma-separated list of pattern=N settings for file-filtered logging
-->
以逗号分隔的 pattern=N 设置列表，用于文件过滤的日志记录。
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
如果已设置，将配置值写入此文件并退出。
</td>
</tr>

</tbody>
</table>





