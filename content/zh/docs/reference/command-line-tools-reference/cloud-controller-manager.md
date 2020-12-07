---
title: cloud-controller-manager
content_type: tool-reference
weight: 30
---

## {{% heading "synopsis" %}}

<!--
The Cloud controller manager is a daemon that embeds
the cloud specific control loops shipped with Kubernetes.
-->
云控制器管理器是一个守护进程，其中包含与 Kubernetes 一起发布的特定于云平台的控制回路。

```
cloud-controller-manager [flags]
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
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If true, adds the file directory to the header of the log messages-->
若为 true，则将文件目录名添加到日志消息头部。
</td>
</tr>

<tr>
<td colspan="2">--allocate-node-cidrs</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Should CIDRs for Pods be allocated and set on the cloud provider.-->
是否基于云供应商来为 Pods 分配 CIDR 并进行设置。
</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- log to standard error as well as files-->
在将日志输出到文件的同时也输出到标准错误输出。
</td>
</tr>

<tr>
<td colspan="2">--authentication-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- kubeconfig file pointing at the 'core' kubernetes server with enough rights to create tokenreviews.authentication.k8s.io. This is optional. If empty, all token requests are considered to be anonymous and no client CA is looked up in the cluster.-->
指向“核心”Kubernetes 服务器的 kubeconfig 文件，其中包含创建
tokenreviews.authentication.k8s.io 的足够权限。此标志为可选。
如果取值为空，则所有令牌请求都被视为匿名请求，并且不会在集群中寻找客户端的证书机构。
</td>
</tr>

<tr>
<td colspan="2">--authentication-skip-lookup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If false, the authentication-kubeconfig will be used to lookup missing authentication configuration from the cluster.-->
如果为 false，则 authentication-kubeconfig 所指的 kubeconfig
文件会被用来寻找集群中缺失的身份认证配置信息。
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The duration to cache responses from the webhook token authenticator.-->
对来自 Webhook 令牌身份认证组件的响应的缓存时长。
</td>
</tr>

<tr>
<td colspan="2">--authentication-tolerate-lookup-failure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.-->
如果为 true，则在集群中未找到缺失的认证配置信息也不会被认为是致命错误。
注意，这一设置可能导致身份认证组件将所有请求都视为匿名请求。
</td>
</tr>

<tr>
<td colspan="2">--authorization-always-allow-paths stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：[/healthz]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.-->
在鉴权期间会忽略的一组 HTTP 路径。这些路径在不与 “核心” Kubernetes
服务器沟通的前提下就会被授权。
</td>
</tr>

<tr>
<td colspan="2">--authorization-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- kubeconfig file pointing at the 'core' kubernetes server with enough rights to create subjectaccessreviews.authorization.k8s.io. This is optional. If empty, all requests not skipped by authorization are forbidden.-->
指向“核心” Kubernetes 服务器的 kubeconfig 文件，其中包含创建
subjectaccessreviews.authorization.k8s.io 的足够权限。此标志为可选。
如果取值为空，则所有未被鉴权组件忽略的请求都会被拒绝。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The duration to cache 'authorized' responses from the webhook authorizer.--></td>
对来自 Webhook 鉴权组件的“authorized”响应的缓存时长。
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The duration to cache 'unauthorized' responses from the webhook authorizer.-->
对来自 Webhook 鉴权组件的“Unauthorized”响应的缓存时长。
</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Path to the file containing Azure container registry configuration information.-->
包含 Azure 容器仓库配置信息的文件路径。
</td>
</tr>

<tr>
<td colspan="2">--bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The IP address on which to listen for the -secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces will be used.-->
在 --secure-port 所给端口上监听时所使用 IP 地址。所关联的网络接口必须从集群中其他部分可达，
且可被命令行和 Web 客户端访问。如果此值为空或者为未设定地址（<code>0.0.0.0</code> 或 <code>::</code>），
则所有接口都会被使用。
</td>
</tr>

<tr>
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.-->
TLS 证书所在的目录。如果 --tls-cert-file 和 --tls-private-key-file
都已指定，则此标志值被忽略。
</td>
</tr>

<tr>
<td colspan="2">--cidr-allocator-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值："RangeAllocator"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Type of CIDR allocator to use-->
要使用的 CIDR 分配器类型。
</td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.-->
若此标志被设置，所有能够提供由 client-ca-file 文件中所包含的机构之一签名的
客户端证书的请求都会通过身份认证，且其身份标识对应客户证书中的 CommonName。
</td>
</tr>

<tr>
<td colspan="2">--cloud-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The path to the cloud provider configuration file. Empty string for no configuration file.-->
云供应商配置文件的路径。空字符串表示没有配置文件。
</td>
</tr>

<tr>
<td colspan="2">--cloud-provider string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The provider for cloud services. Empty string for no provider.-->
云服务的供应商。空字符串表示没有供应商。
</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：<code>130.211.0.0/22,35.191.0.0/16</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- CIDRs opened in GCE firewall for L7 LB traffic proxy & health checks-->
在 GCE 防火墙上为第七层负载均衡器流量代理和健康检查所打开的 CIDR。
</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：<code>130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- CIDRs opened in GCE firewall for L4 LB traffic proxy & health checks-->
在 GCE 防火墙上为第四层负载均衡器流量代理和健康检查所打开的 CIDR。
</td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- CIDR Range for Pods in cluster. Requires -allocate-node-cidrs to be true-->
集群中 Pod 的 CIDR 范围。要求 --allocate-node-cidrs 为 true。
</td>
</tr>

<tr>
<td colspan="2">--cluster-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值： "kubernetes"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The instance prefix for the cluster.-->
集群的实例前缀。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-service-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值： 1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The number of services that are allowed to sync concurrently. Larger number = more responsive service management, but more CPU (and network) load-->
可并发同步的服务个数。较大数值意味着服务管理的响应能力更高，不过也意味着更多的
CPU （和网络）压力。
</td>
</tr>

<tr>
<td colspan="2">--configure-cloud-routes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值： true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Should CIDRs allocated by allocate-node-cidrs be configured on the cloud provider.-->
是否要在云供应商平台上配置由 allocate-node-cidrs 所分配的 CIDRs。
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Enable lock contention profiling, if profiling is enabled-->
启用锁竞争分析，前提是 profiling 被弃用。
</td>
</tr>

<tr>
<td colspan="2">--controller-start-interval duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Interval between starting controller managers.-->
启动控制器管理器之间的时间间隔。
</td>
</tr>

<tr>
<td colspan="2">--controllers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：[&#42;]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- A list of controllers to enable. '*' enables all on-by-default controllers, 'foo' enables the controller named 'foo', '-foo' disables the controller named 'foo'.<br/>All controllers: cloud-node, cloud-node-lifecycle, route, service<br/>Disabled-by-default controllers: -->
一组要启用的控制器列表。'&#42;' 意味着要启用所有默认打开的控制器，'foo'
意味着要启用名为 'foo' 的控制器；'-foo' 意味着要禁用名为 'foo' 的控制器。<br/>
控制器全集：<code>cloud-node</code>、<code>cloud-node-lifecycle</code>、
<code>route</code>、<code>service</code>。
默认禁用的控制器：&lt;无&gt;。
</td>
</tr>

<tr>
<td colspan="2">--external-cloud-volume-plugin string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The plugin to use when cloud provider is set to external. Can be empty, should only be set when cloud-provider is external. Currently used to allow node and volume controllers to work for in tree cloud providers.-->
当云驱动被设置为 external 时要使用的插件。可以为空，只有当 cloud-provider 为
external 时才应设置。当前用来保证内置的云驱动的节点控制器和卷控制器能够正常工作。
</td>
</tr>

<tr>
<td colspan="2">--feature-gates mapStringBool</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><!--A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIPriorityAndFairness=true|false (ALPHA - default=false)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AllowInsecureBackendProxy=true|false (BETA - default=true)<br/>AnyVolumeDataSource=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (BETA - default=true)<br/>CSIMigrationAWS=true|false (BETA - default=false)<br/>CSIMigrationAWSComplete=true|false (ALPHA - default=false)<br/>CSIMigrationAzureDisk=true|false (BETA - default=false)<br/>CSIMigrationAzureDiskComplete=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFileComplete=true|false (ALPHA - default=false)<br/>CSIMigrationGCE=true|false (BETA - default=false)<br/>CSIMigrationGCEComplete=true|false (ALPHA - default=false)<br/>CSIMigrationOpenStack=true|false (BETA - default=false)<br/>CSIMigrationOpenStackComplete=true|false (ALPHA - default=false)<br/>CSIMigrationvSphere=true|false (BETA - default=false)<br/>CSIMigrationvSphereComplete=true|false (BETA - default=false)<br/>CSIStorageCapacity=true|false (ALPHA - default=false)<br/>CSIVolumeFSGroupPolicy=true|false (ALPHA - default=false)<br/>ConfigurableFSGroupPolicy=true|false (ALPHA - default=false)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>DefaultPodTopologySpread=true|false (ALPHA - default=false)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DisableAcceleratorUsageMetrics=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EndpointSlice=true|false (BETA - default=true)<br/>EndpointSliceProxying=true|false (BETA - default=true)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GenericEphemeralVolume=true|false (ALPHA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HugePageStorageMediumSize=true|false (BETA - default=true)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>IPv6DualStack=true|false (ALPHA - default=false)<br/>ImmutableEphemeralVolumes=true|false (BETA - default=true)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>LegacyNodeRoleBehavior=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>NodeDisruptionExclusion=true|false (BETA - default=true)<br/>NonPreemptingPriority=true|false (BETA - default=true)<br/>PodDisruptionBudget=true|false (BETA - default=true)<br/>PodOverhead=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (ALPHA - default=false)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RunAsGroup=true|false (BETA - default=true)<br/>RuntimeClass=true|false (BETA - default=true)<br/>SCTPSupport=true|false (BETA - default=true)<br/>SelectorIndex=true|false (BETA - default=true)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceAccountIssuerDiscovery=true|false (ALPHA - default=false)<br/>ServiceAppProtocol=true|false (BETA - default=true)<br/>ServiceNodeExclusion=true|false (BETA - default=true)<br/>ServiceTopology=true|false (ALPHA - default=false)<br/>SetHostnameAsFQDN=true|false (ALPHA - default=false)<br/>StartupProbe=true|false (BETA - default=true)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>SupportNodePidsLimit=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (BETA - default=true)<br/>Sysctls=true|false (BETA - default=true)<br/>TTLAfterFinished=true|false (ALPHA - default=false)<br/>TokenRequest=true|false (BETA - default=true)<br/>TokenRequestProjection=true|false (BETA - default=true)<br/>TopologyManager=true|false (BETA - default=true)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumeSnapshotDataSource=true|false (BETA - default=true)<br/>WarningHeaders=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (ALPHA - default=false)<br/>WindowsEndpointSliceProxying=true|false (ALPHA - default=false)-->
一组 key=value 偶对，描述 alpha/试验性功能的特性门控。可选项包括：<br/>
APIListChunking=true|false (BETA - 默认值=true)<br/>
APIPriorityAndFairness=true|false (ALPHA - 默认值=false)<br/>
APIResponseCompression=true|false (BETA - 默认值=true)<br/>
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
CSIMigrationAWS=true|false (BETA - 默认值=false)<br/>
CSIMigrationAWSComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationAzureDisk=true|false (BETA - 默认值=false)<br/>
CSIMigrationAzureDiskComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationAzureFile=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationAzureFileComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationGCE=true|false (BETA - 默认值=false)<br/>
CSIMigrationGCEComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationOpenStack=true|false (BETA - 默认值=false)<br/>
CSIMigrationOpenStackComplete=true|false (ALPHA - 默认值=false)<br/>
CSIMigrationvSphere=true|false (BETA - 默认值=false)<br/>
CSIMigrationvSphereComplete=true|false (BETA - 默认值=false)<br/>
CSIStorageCapacity=true|false (ALPHA - 默认值=false)<br/>
CSIVolumeFSGroupPolicy=true|false (ALPHA - 默认值=false)<br/>
ConfigurableFSGroupPolicy=true|false (ALPHA - 默认值=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默认值=false)<br/>
DefaultPodTopologySpread=true|false (ALPHA - 默认值=false)<br/>
DevicePlugins=true|false (BETA - 默认值=true)<br/>
DisableAcceleratorUsageMetrics=true|false (ALPHA - 默认值=false)<br/>
DynamicKubeletConfig=true|false (BETA - 默认值=true)<br/>
EndpointSlice=true|false (BETA - 默认值=true)<br/>
EndpointSliceProxying=true|false (BETA - 默认值=true)<br/>
EphemeralContainers=true|false (ALPHA - 默认值=false)<br/>
ExpandCSIVolumes=true|false (BETA - 默认值=true)<br/>
ExpandInUsePersistentVolumes=true|false (BETA - 默认值=true)<br/>
ExpandPersistentVolumes=true|false (BETA - 默认值=true)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 默认值=false)<br/>
GenericEphemeralVolume=true|false (ALPHA - 默认值=false)<br/>
HPAScaleToZero=true|false (ALPHA - 默认值=false)<br/>
HugePageStorageMediumSize=true|false (BETA - 默认值=true)<br/>
HyperVContainer=true|false (ALPHA - 默认值=false)<br/>
IPv6DualStack=true|false (ALPHA - 默认值=false)<br/>
ImmutableEphemeralVolumes=true|false (BETA - 默认值=true)<br/>
KubeletPodResources=true|false (BETA - 默认值=true)<br/>
LegacyNodeRoleBehavior=true|false (BETA - 默认值=true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - 默认值=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 默认值=false)<br/>
NodeDisruptionExclusion=true|false (BETA - 默认值=true)<br/>
NonPreemptingPriority=true|false (BETA - 默认值=true)<br/>
PodDisruptionBudget=true|false (BETA - 默认值=true)<br/>
PodOverhead=true|false (BETA - 默认值=true)<br/>
ProcMountType=true|false (ALPHA - 默认值=false)<br/>
QOSReserved=true|false (ALPHA - 默认值=false)<br/>
RemainingItemCount=true|false (BETA - 默认值=true)<br/>
RemoveSelfLink=true|false (ALPHA - 默认值=false)<br/>
RotateKubeletServerCertificate=true|false (BETA - 默认值=true)<br/>
RunAsGroup=true|false (BETA - 默认值=true)<br/>
RuntimeClass=true|false (BETA - 默认值=true)<br/>
SCTPSupport=true|false (BETA - 默认值=true)<br/>
SelectorIndex=true|false (BETA - 默认值=true)<br/>
ServerSideApply=true|false (BETA - 默认值=true)<br/>
ServiceAccountIssuerDiscovery=true|false (ALPHA - 默认值=false)<br/>
ServiceAppProtocol=true|false (BETA - 默认值=true)<br/>
ServiceNodeExclusion=true|false (BETA - 默认值=true)<br/>
ServiceTopology=true|false (ALPHA - 默认值=false)<br/>
SetHostnameAsFQDN=true|false (ALPHA - 默认值=false)<br/>
StartupProbe=true|false (BETA - 默认值=true)<br/>
StorageVersionHash=true|false (BETA - 默认值=true)<br/>
SupportNodePidsLimit=true|false (BETA - 默认值=true)<br/>
SupportPodPidsLimit=true|false (BETA - 默认值=true)<br/>
Sysctls=true|false (BETA - 默认值=true)<br/>
TTLAfterFinished=true|false (ALPHA - 默认值=false)<br/>
TokenRequest=true|false (BETA - 默认值=true)<br/>
TokenRequestProjection=true|false (BETA - 默认值=true)<br/>
TopologyManager=true|false (BETA - 默认值=true)<br/>
ValidateProxyRedirects=true|false (BETA - 默认值=true)<br/>
VolumeSnapshotDataSource=true|false (BETA - 默认值=true)<br/>
WarningHeaders=true|false (BETA - 默认值=true)<br/>
WinDSR=true|false (ALPHA - 默认值=false)<br/>
WinOverlay=true|false (ALPHA - 默认值=false)<br/>
WindowsEndpointSliceProxying=true|false (ALPHA - 默认值=false)
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- help for cloud-controller-manager-->
<code>cloud-controller-manager</code> 的帮助信息。
</td>
</tr>

<tr>
<td colspan="2">--http2-max-streams-per-connection int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.-->
在 HTTP/2 连接中，服务器为客户端提供的最大流式连接个数。0 意味着使用 Go
语言库中的默认值。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：30</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Burst to use while talking with kubernetes apiserver.-->
在与 Kubernetes API 服务器通信时可使用的突发性请求速率。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Content type of requests sent to apiserver.-->
向 API 服务器发送请求时使用的内容类型（Content-Type）。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：20</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- QPS to use while talking with kubernetes apiserver.-->
与 Kubernetes API 服务器通信时要遵循的 QPS（每秒查询数）约束。
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Path to kubeconfig file with authorization and master location information.-->
指向 kubeconfig 文件的路径；该文件中包含鉴权信息以及主控节点位置信息。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.-->
启动领导者选举客户端，并在开始执行主循环之前尝试获得领导者角色。
在运行多副本组件时启用此标志以达到高可用性。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.-->
当观察到领导者需要续约时，当前处于非领导者角色的候选组件要等待这里设置的时长，
之后才能尝试去获得曾经处于领导者角色但未能成功续约的席位。
此标志值本质上是当前领导者在被其他候选者替代之前可以停止的最长时长。
只有启用了领导者选举时此标志值才有意义。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值： 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.-->
当前领导者身份的组件在停止领导角色前需要对领导者席位续约，此标志值设置续约操作时间间隔。
此值必须小于等于租期时长。只有启用了领导者选举时此标志值才有意义。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值："endpointsleases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The type of resource object that is used for locking during leader election. Supported options are 'endpoints', 'configmaps', 'leases', 'endpointsleases' and 'configmapsleases'.-->
在领导者选举期间用来锁定的资源对象类型。支持的选项包括
'<code>endpoints</code>'、'<code>configmaps</code>'、'<code>leases</code>'、
'<code>endpointsleases</code>' 和 '<code>configmapsleases</code>'。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值："cloud-controller-manager"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The name of resource object that is used for locking during leader election.-->
在领导者选举期间用来锁定的资源对象名称。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值："kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The namespace of resource object that is used for locking during leader election.-->
在领导者选举期间用来锁定的资源对象的名字空间。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.-->
客户端在尝试抢占或者续约领导者席位时连续两次尝试之间的时间间隔。
仅在启用了领导者选举时可用。
</td>
</tr>

<tr>
<td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：<code>:0</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- when logging hits line file:N, emit a stack trace-->
当日志机制执行到文件行 <code>file:N</code> 时打印调用堆栈。
</td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If non-empty, write log files in this directory-->
若此标志值非空，则将日志写入到所指定的目录中。
</td>
</tr>

<tr>
<td colspan="2">--log-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If non-empty, use this log file-->
当此标志值非空时，表示使用该字符串值作为日志文件名。
</td>
</tr>

<tr>
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.-->
定义日志文件可增长到的最大尺寸。单位为 MB 字节。如果此值为
0，则不限制文件的最大尺寸。
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Maximum number of seconds between log flushes-->
相邻两次日志清洗操作之间的最大间隔秒数。
</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- log to standard error instead of files-->
将日支输出到标准错误输出而不是日志文件中。
</td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The address of the Kubernetes API server (overrides any value in kubeconfig).-->
Kubernetes API 服务器的地址（覆盖 kubeconfig 文件中的设置值。
</td>
</tr>

<tr>
<td colspan="2">--min-resync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：12h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The resync period in reflectors will be random between MinResyncPeriod and 2*MinResyncPeriod.-->
反射器（Reflectors）的再同步周期将介于 min-resync-period 和
2&#42;min-resync-period 之间。
</td>
</tr>

<tr>
<td colspan="2">--node-monitor-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The period for syncing NodeStatus in NodeController.-->
在节点控制器中对节点状态进行同步的周期。
</td>
</tr>

<tr>
<td colspan="2">--node-status-update-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Specifies how often the controller updates nodes' status.-->
设置控制器更新节点状态的频率。
</td>
</tr>

<tr>
<td colspan="2">--permit-port-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If true, SO_REUSEPORT will be used when binding the port, which allows more than one instance to bind on the same address and port. [default=false]-->
此标志值为 true 时，在绑定端口时将使用 SO_REUSEPORT
标志，允许多个实例绑定到同一地址和端口。默认值为 false。
</td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Enable profiling via web interface host:port/debug/pprof/-->
通过 Web 接口 <code>host:port/debug/pprof/</code> 提供性能观测。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-allowed-names stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.-->
客户证书中 CommonName 的列表，用于允许通过 <code>--requestheader-allowed-names</code>
标识所设置的头部中提供用户名。此标志值为空时，通过
<code>--requestheader-client-ca-file</code> 中的机构验证的所有客户端证书都可使用。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.-->
用来对所收到的请求中客户端证书进行验证的根证书包。在此验证之前，不能信任
<code>--requestheader-username-headers</code> 所指定的头部中的用户名。
警告：此操作一般不会理会是否已经对所收到的请求执行了鉴权。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-extra-headers-prefix stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：<code>[x-remote-extra-]</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- List of request header prefixes to inspect. X-Remote-Extra- is suggested.-->
要检查的请求头部前缀列表。建议使用 <code>X-Remote-Extra-</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：<code>[x-remote-group]</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- List of request headers to inspect for groups. X-Remote-Group is suggested.-->
为获取组名而要检查的请求头部列表。建议使用 <code>X-Remote-Group</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：<code>[x-remote-user]</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- List of request headers to inspect for usernames. X-Remote-User is common.-->
为获取用户名而要检查的请求头部列表。常用的是 <code>X-Remote-User</code>。
</td>
</tr>

<tr>
<td colspan="2">--route-reconciliation-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The period for reconciling routes created for Nodes by cloud provider.-->
对云供应商为节点所创建的路由进行协商的周期。
</td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：10258</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.-->
此标志值给出的是一个端口号，云控制器管理器在此端口上提供 HTTPS 服务以供身份认证和鉴权。
如果此值为 0，则云控制器管理器不提供 HTTPS 服务。
</td>
</tr>

<tr>
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If true, avoid header prefixes in the log messages-->
此值为 true 时，不在日志消息中添加头部前缀。
</td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If true, avoid headers when opening log files-->
此标志值为 true 时，不在打开日志文件时使用头部。
</td>
</tr>

<tr>
<td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- logs at or above this threshold go to stderr-->
处于或者高于此阈值的日志消息会被输出到标准错误输出。
</td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.-->
为 HTTPS 通信所给出的默认 x509 证书文件。如果有机构证书，要串接在服务器证书之后。
当启用 HTTPS 服务时，如果 <code>--tls-cert-file</code> 和 <code>--tls-private-key-file</code> 未设置，
则组件会自动生成一个自签名的证书和密钥，用于公开的网络地址，并将其保存在
<code>--cert-dir</code> 所指定的目录下。
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used. <br/>Preferred values: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384. <br/>Insecure values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.-->
为服务器设定的逗号分隔的加密包列表。如果忽略此标志，则使用默认的 Go 语言加密包。<br/>
优选的设置：TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384. <br/>
不安全的配置值：TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.
</td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Minimum TLS version supported. Possible values: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13-->
所支持的 TLS 最低版本。可选值为：<code>VersionTLS10</code>、<code>VersionTLS11</code>、
<code>VersionTLS12</code>、<code>VersionTLS13</code>。
</td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- File containing the default x509 private key matching --tls-cert-file.-->
包含与 <code>--tls-cert-file</code> 所设定证书匹配的默认 x509 私钥文件。
</td>
</tr>

<tr>
<td colspan="2">--tls-sni-cert-key namedCertKey&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default:-->默认值：<code>[]</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. The domain patterns also allow IP addresses, but IPs should only be used if the apiserver has visibility to the IP address requested by a client. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com".-->
一组 x509 证书和私钥文件路径偶对。可选地，可以在路径名之后添加域名模式的后缀，
每个后缀都是一个全限定的域名，也可带有前置的通配符部分。
域名模式也允许使用 IP 地址，不过只有 API 服务器可以在客户请求的 IP 地址上访问
时才可使用 IP 地址。如果未指定域名模式，则从证书中抽取名字。
非通配符的匹配要优先于通配符匹配；显式的域名模式匹配也优先于抽取名字匹配。
对于多个密钥/证书偶对，可多次使用 <code>--tls-sni-cert-key</code> 标志。
例如："<code>example.crt,example.key</code>" 或
"<code>foo.crt,foo.key:*.foo.com,foo.com</code>"。
</td>
</tr>

<tr>
<td colspan="2">--use-service-account-credentials</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- If true, use individual service account credentials for each controller.-->
此标志值为 true 时，为每个控制器使用独立的服务账号凭据。
</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- number for the log level verbosity-->
日志级别详细程度值。
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- Print version information and quit-->
打印版本信息并退出。
</td>
</tr>

<tr>
<td colspan="2">--vmodule moduleSpec</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- comma-separated list of pattern=N settings for file-filtered logging-->
逗号分隔的 <code>pattern=N</code> 字符串列表，用来基于文件来执行日志操作。
</td>
</tr>

</tbody>
</table>



