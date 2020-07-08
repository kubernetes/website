---
title: kube-scheduler
content_type: tool-reference
weight: 28
---
<!-- 
---
title: kube-scheduler
content_type: tool-reference
weight: 28
--- 
-->

## {{% heading "synopsis" %}}



<!-- 
The Kubernetes scheduler is a policy-rich, topology-aware,
workload-specific function that significantly impacts availability, performance,
and capacity. The scheduler needs to take into account individual and collective
resource requirements, quality of service requirements, hardware/software/policy
constraints, affinity and anti-affinity specifications, data locality, inter-workload
interference, deadlines, and so on. Workload-specific requirements will be exposed
through the API as necessary. 
-->
Kubernetes 调度器是一个策略丰富、拓扑感知、工作负载特定的功能，调度器显著影响可用性、性能和容量。调度器需要考虑个人和集体的资源要求、服务质量要求、硬件/软件/政策约束、亲和力和反亲和力规范、数据局部性、负载间干扰、完成期限等。工作负载特定的要求必要时将通过 API 暴露。

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
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!-- 
    If true, adds the file directory to the header
    -->
    如果为 true，则将文件目录添加到标题中
    </td>
</tr>

<tr>
    <td colspan="2">
    <!-- 
    --address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "0.0.0.0" 
    -->
    --address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "0.0.0.0"
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!-- 
    DEPRECATED: the IP address on which to listen for the --port port (set to 0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces). See --bind-address instead. 
    -->
    弃用: 要监听 --port 端口的 IP 地址（对于所有 IPv4 接口设置为 0.0.0.0，对于所有 IPv6 接口设置为 ::）。 请参阅 --bind-address。
    </td>
</tr>

<tr>
    <td colspan="2">--algorithm-provider string</td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: the scheduling algorithm provider to use, one of: ClusterAutoscalerProvider | DefaultProvider
    -->
    弃用: 要使用的调度算法，可选值：ClusterAutoscalerProvider | DefaultProvider
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
    指向具有足够权限以创建  tokenaccessreviews.authentication.k8s.io 的 'core' kubernetes 服务器的 kubeconfig 文件。这是可选的。如果为空，则所有令牌请求均被视为匿名请求，并且不会在集群中查找任何客户端 CA。
    -->
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
    <td colspan="2">
    <!--
    --authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s
    -->
    --authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10s
    </td>
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
    <td colspan="2">
    <!--
    --authentication-tolerate-lookup-failure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
    -->
    --authentication-tolerate-lookup-failure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: true
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.
    -->
    如果为 true，则无法从集群中查找缺少的身份验证配置是致命的。请注意，这可能导致身份验证将所有请求视为匿名。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --authorization-always-allow-paths stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [/healthz]
    -->
    --authorization-always-allow-paths stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: [/healthz]
    </td>
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
    指向具有足够权限以创建 subjectaccessreviews.authorization.k8s.io 的 'core' kubernetes 服务器的 kubeconfig 文件。这是可选的。如果为空，则禁止所有未经授权跳过的请求。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s
    -->
    --authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10s
    </td>
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
    <td colspan="2">
    <!--
    --authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s
    -->
    --authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10s
    </td>
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
    <td colspan="2">
    <!--
    --bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0
    -->
    --bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 0.0.0.0
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank, all interfaces will be used (0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces).
    -->
    侦听 --secure-port 端口的 IP 地址。集群的其余部分以及 CLI/ Web 客户端必须可以访问关联的接口。如果为空，将使用所有接口（所有 IPv4 接口使用 0.0.0.0，所有 IPv6 接口使用 ::）。
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
    TLS 证书所在的目录。如果提供了--tls-cert-file 和 --tls private-key-file，则将忽略此参数。
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
    如果已设置，由 client-ca-file 中的授权机构签名的客户端证书的任何请求都将使用与客户端证书的 CommonName 对应的身份进行身份验证。
    </td>
</tr>

<tr>
    <td colspan="2">--config string</td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    The path to the configuration file. Flags override values in this file.
    -->
    配置文件的路径。标志会覆盖此文件中的值。
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
    弃用: 如果启用了性能分析，则启用锁竞争分析
    </td>
</tr>

<tr>
    <td colspan="2">--feature-gates mapStringBool</td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>AttachVolumeLimit=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BlockVolume=true|false (BETA - default=true)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIBlockVolume=true|false (BETA - default=true)<br/>CSIDriverRegistry=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (ALPHA - default=false)<br/>CSIMigrationAWS=true|false (ALPHA - default=false)<br/>CSIMigrationAzureDisk=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - default=false)<br/>CSIMigrationGCE=true|false (ALPHA - default=false)<br/>CSIMigrationOpenStack=true|false (ALPHA - default=false)<br/>CSINodeInfo=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomResourceDefaulting=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DryRun=true|false (BETA - default=true)<br/>DynamicAuditing=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EndpointSlice=true|false (ALPHA - default=false)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>EvenPodsSpread=true|false (ALPHA - default=false)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>IPv6DualStack=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>LegacyNodeRoleBehavior=true|false (ALPHA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>MountContainers=true|false (ALPHA - default=false)<br/>NodeDisruptionExclusion=true|false (ALPHA - default=false)<br/>NodeLease=true|false (BETA - default=true)<br/>NonPreemptingPriority=true|false (ALPHA - default=false)<br/>PodOverhead=true|false (ALPHA - default=false)<br/>PodShareProcessNamespace=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (ALPHA - default=false)<br/>RequestManagement=true|false (ALPHA - default=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>ResourceQuotaScopeSelectors=true|false (BETA - default=true)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RunAsGroup=true|false (BETA - default=true)<br/>RuntimeClass=true|false (BETA - default=true)<br/>SCTPSupport=true|false (ALPHA - default=false)<br/>ScheduleDaemonSetPods=true|false (BETA - default=true)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceLoadBalancerFinalizer=true|false (BETA - default=true)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>StartupProbe=true|false (BETA - default=true)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportNodePidsLimit=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (BETA - default=true)<br/>Sysctls=true|false (BETA - default=true)<br/>TTLAfterFinished=true|false (ALPHA - default=false)<br/>TaintBasedEvictions=true|false (BETA - default=true)<br/>TaintNodesByCondition=true|false (BETA - default=true)<br/>TokenRequest=true|false (BETA - default=true)<br/>TokenRequestProjection=true|false (BETA - default=true)<br/>TopologyManager=true|false (ALPHA - default=false)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumePVCDataSource=true|false (BETA - default=true)<br/>VolumeSnapshotDataSource=true|false (ALPHA - default=false)<br/>VolumeSubpathEnvExpansion=true|false (BETA - default=true)<br/>WatchBookmark=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (ALPHA - default=false)<br/>WindowsGMSA=true|false (BETA - default=true)<br/>WindowsRunAsUserName=true|false (ALPHA - default=false)
    -->
    一组 key=value 对，描述了 alpha/experimental 特征开关。选项包括：<br/>APIListChunking=true|false (BETA - 默认值=true)<br/>APIResponseCompression=true|false (BETA - 默认值=true)<br/>AllAlpha=true|false (ALPHA - 默认值=false)<br/>AppArmor=true|false (BETA - 默认值=true)<br/>AttachVolumeLimit=true|false (BETA - 默认值=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - 默认值=false)<br/>BlockVolume=true|false (BETA - 默认值=true)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - 默认值=false)<br/>CPUManager=true|false (BETA - 默认值=true)<br/>CRIContainerLogRotation=true|false (BETA - 默认值=true)<br/>CSIBlockVolume=true|false (BETA - 默认值=true)<br/>CSIDriverRegistry=true|false (BETA - 默认值=true)<br/>CSIInlineVolume=true|false (BETA - 默认值=true)<br/>CSIMigration=true|false (ALPHA - 默认值=false)<br/>CSIMigrationAWS=true|false (ALPHA - 默认值=false)<br/>CSIMigrationAzureDisk=true|false (ALPHA - 默认值=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - 默认值=false)<br/>CSIMigrationGCE=true|false (ALPHA - 默认值=false)<br/>CSIMigrationOpenStack=true|false (ALPHA - 默认值=false)<br/>CSINodeInfo=true|false (BETA - 默认值=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默认值=false)<br/>CustomResourceDefaulting=true|false (BETA - 默认值=true)<br/>DevicePlugins=true|false (BETA - 默认值=true)<br/>DryRun=true|false (BETA - 默认值=true)<br/>DynamicAuditing=true|false (ALPHA - 默认值=false)<br/>DynamicKubeletConfig=true|false (BETA - 默认值=true)<br/>EndpointSlice=true|false (ALPHA - 默认值=false)<br/>EphemeralContainers=true|false (ALPHA - 默认值=false)<br/>EvenPodsSpread=true|false (ALPHA - 默认值=false)<br/>ExpandCSIVolumes=true|false (BETA - 默认值=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - 默认值=true)<br/>ExpandPersistentVolumes=true|false (BETA - 默认值=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 默认值=false)<br/>HPAScaleToZero=true|false (ALPHA - 默认值=false)<br/>HyperVContainer=true|false (ALPHA - 默认值=false)<br/>IPv6DualStack=true|false (ALPHA - 默认值=false)<br/>KubeletPodResources=true|false (BETA - 默认值=true)<br/>LegacyNodeRoleBehavior=true|false (ALPHA - 默认值=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - 默认值=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 默认值=false)<br/>MountContainers=true|false (ALPHA - 默认值=false)<br/>NodeDisruptionExclusion=true|false (ALPHA - 默认值=false)<br/>NodeLease=true|false (BETA - 默认值=true)<br/>NonPreemptingPriority=true|false (ALPHA - 默认值=false)<br/>PodOverhead=true|false (ALPHA - 默认值=false)<br/>PodShareProcessNamespace=true|false (BETA - 默认值=true)<br/>ProcMountType=true|false (ALPHA - 默认值=false)<br/>QOSReserved=true|false (ALPHA - 默认值=false)<br/>RemainingItemCount=true|false (BETA - 默认值=true)<br/>RemoveSelfLink=true|false (ALPHA - 默认值=false)<br/>RequestManagement=true|false (ALPHA - 默认值=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - 默认值=false)<br/>ResourceQuotaScopeSelectors=true|false (BETA - 默认值=true)<br/>RotateKubeletClientCertificate=true|false (BETA - 默认值=true)<br/>RotateKubeletServerCertificate=true|false (BETA - 默认值=true)<br/>RunAsGroup=true|false (BETA - 默认值=true)<br/>RuntimeClass=true|false (BETA - 默认值=true)<br/>SCTPSupport=true|false (ALPHA - 默认值=false)<br/>ScheduleDaemonSetPods=true|false (BETA - 默认值=true)<br/>ServerSideApply=true|false (BETA - 默认值=true)<br/>ServiceLoadBalancerFinalizer=true|false (BETA - 默认值=true)<br/>ServiceNodeExclusion=true|false (ALPHA - 默认值=false)<br/>StartupProbe=true|false (BETA - 默认值=true)<br/>StorageVersionHash=true|false (BETA - 默认值=true)<br/>StreamingProxyRedirects=true|false (BETA - 默认值=true)<br/>SupportNodePidsLimit=true|false (BETA - 默认值=true)<br/>SupportPodPidsLimit=true|false (BETA - 默认值=true)<br/>Sysctls=true|false (BETA - 默认值=true)<br/>TTLAfterFinished=true|false (ALPHA - 默认值=false)<br/>TaintBasedEvictions=true|false (BETA - 默认值=true)<br/>TaintNodesByCondition=true|false (BETA - 默认值=true)<br/>TokenRequest=true|false (BETA - 默认值=true)<br/>TokenRequestProjection=true|false (BETA - 默认值=true)<br/>TopologyManager=true|false (ALPHA - 默认值=false)<br/>ValidateProxyRedirects=true|false (BETA - 默认值=true)<br/>VolumePVCDataSource=true|false (BETA - 默认值=true)<br/>VolumeSnapshotDataSource=true|false (ALPHA - 默认值=false)<br/>VolumeSubpathEnvExpansion=true|false (BETA - 默认值=true)<br/>WatchBookmark=true|false (BETA - 默认值=true)<br/>WinDSR=true|false (ALPHA - 默认值=false)<br/>WinOverlay=true|false (ALPHA - 默认值=false)<br/>WindowsGMSA=true|false (BETA - 默认值=true)<br/>WindowsRunAsUserName=true|false (ALPHA - 默认值=false)
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --hard-pod-affinity-symmetric-weight int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1
    -->
    --hard-pod-affinity-symmetric-weight int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 1
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: RequiredDuringScheduling affinity is not symmetric, but there is an implicit PreferredDuringScheduling affinity rule corresponding to every RequiredDuringScheduling affinity rule. --hard-pod-affinity-symmetric-weight represents the weight of implicit PreferredDuringScheduling affinity rule. Must be in the range 0-100.This option was moved to the policy configuration file
    -->
    弃用: RequiredDuringScheduling 亲和力不是对称的，但是存在与每个 RequiredDuringScheduling 关联性规则相对应的隐式 PreferredDuringScheduling 关联性规则 --hard-pod-affinity-symmetric-weight 代表隐式 PreferredDuringScheduling 关联性规则的权重。权重必须在 0-100 范围内。此选项已移至策略配置文件。
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
    服务器为客户端提供的 HTTP/2 连接最大限制。零表示使用 golang 的默认值。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100
    -->
    --kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 100
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: burst to use while talking with kubernetes apiserver
    -->
    弃用: 与 kubernetes apiserver 通信时使用
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"
    -->
    --kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "application/vnd.kubernetes.protobuf"
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: content type of requests sent to apiserver.
    -->
    弃用: 发送到 apiserver 的请求的内容类型。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 50
    -->
    --kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 50
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: QPS to use while talking with kubernetes apiserver
    -->
    弃用: 与 kubernetes apiserver 通信时要使用的 QPS
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
    弃用: 具有授权和主节点位置信息的 kubeconfig 文件的路径。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
    -->
    --leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: true
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.
    -->
    在执行主循环之前，开始领导者选举并选出领导者。为实现高可用性，运行多副本的组件并选出领导者。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s
    -->
    --leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 15s
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.
    -->
    非领导者候选人在观察到领导者更新后将等待直到试图获得领导但未更新的领导者职位的等待时间。这实际上是领导者在被另一位候选人替代之前可以停止的最大持续时间。该情况仅在启用了领导者选举的情况下才适用。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s
    -->
    --leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10s
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.
    -->
    </td>
    领导者尝试在停止领导之前更新领导职位的间隔时间。该时间必须小于或等于租赁期限。仅在启用了领导者选举的情况下才适用。
</tr>

<tr>
    <td colspan="2">
    <!--
    --leader-elect-resource-lock endpoints&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "endpoints"
    -->
    --leader-elect-resource-lock endpoints&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "endpoints"
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    The type of resource object that is used for locking during leader election. Supported options are endpoints (default) and `configmaps`.
    -->
    在领导者选举期间用于锁定的资源对象的类型。支持的选项是端点（默认）和 `configmaps`
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-scheduler"
    -->
    --leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "kube-scheduler"
    </td>
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
    <td colspan="2">
    <!--
    --leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"
    -->
    --leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "kube-system"
    </td>
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
    <td colspan="2">
    <!--
    --leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s
    -->
    --leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 2s
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
    <td colspan="2">
    <!--
    --lock-object-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-scheduler"
    -->
    --lock-object-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "kube-scheduler"
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: define the name of the lock object. Will be removed in favor of leader-elect-resource-name
    -->
    弃用: 定义锁对象的名称。将被删除以便使用 Leader-elect-resource-name
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --lock-object-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"
    -->
    --lock-object-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "kube-system"
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: define the namespace of the lock object. Will be removed in favor of leader-elect-resource-namespace.
    -->
    弃用: 定义锁对象的命名空间。将被删除以便使用 leader-elect-resource-namespace。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0
    -->
    --log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: :0
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    when logging hits line file:N, emit a stack trace
    -->
    当记录命中行文件：N 时发出堆栈跟踪
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
    如果为非空，则在此目录中写入日志文件
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
    如果为非空，请使用此日志文件
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800
    -->
    --log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 1800
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.
    -->
    定义日志文件可以增长到的最大值。单位为兆字节。如果值为0，则最大文件大小为无限制。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s
    -->
    --log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 5s
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    Maximum number of seconds between log flushes
    -->
    两次日志刷新之间的最大秒数
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
    -->
    --logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: true
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    log to standard error instead of files
    -->
    日志记录到标准错误而不是文件
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
    Kubernetes API 服务器的地址（覆盖 kubeconfig 中的任何值）
    </td>
</tr>

<tr>
    <td colspan="2">--policy-config-file string</td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: file with scheduler policy configuration. This file is used if policy ConfigMap is not provided or --use-legacy-policy-config=true
    -->
    弃用：具有调度程序策略配置的文件。如果未提供 policy ConfigMap 或 --use-legacy-policy-config = true，则使用此文件
    </td>
</tr>

<tr>
    <td colspan="2">--policy-configmap string</td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: name of the ConfigMap object that contains scheduler's policy configuration. It must exist in the system namespace before scheduler initialization if --use-legacy-policy-config=false. The config must be provided as the value of an element in 'Data' map with the key='policy.cfg'
    -->
    弃用: 包含调度程序策略配置的 ConfigMap 对象的名称。如果 --use-legacy-policy-config = false，则它必须在调度程序初始化之前存在于系统命名空间中。必须将配置作为键为 'policy.cfg' 的 'Data' 映射中元素的值提供
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --policy-configmap-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"
    -->
    --policy-configmap-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "kube-system"
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: the namespace where policy ConfigMap is located. The kube-system namespace will be used if this is not provided or is empty.
    -->
    弃用: 策略 ConfigMap 所在的命名空间。如果未提供或为空，则将使用 kube-system 命名空间。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10251
    -->
    --port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10251
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: the port on which to serve HTTP insecurely without authentication and authorization. If 0, don't serve plain HTTP at all. See --secure-port instead.
    -->
    弃用: 在没有身份验证和授权的情况下不安全地为 HTTP 服务的端口。如果为0，则根本不提供 HTTP。请参见--secure-port。
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
    弃用: 通过 Web 界面主机启用配置文件：port/debug/pprof/
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
    客户端证书通用名称列表允许在 --requestheader-username-headers 指定的头部中提供用户名。如果为空，则允许任何由权威机构 --requestheader-client-ca-file 验证的客户端证书。
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
    在信任 --requestheader-username-headers 指定的头部中的用户名之前用于验证传入请求上的客户端证书的根证书包。警告：通常不依赖于传入请求已经完成的授权。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --requestheader-extra-headers-prefix stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [x-remote-extra-]
    -->
    --requestheader-extra-headers-prefix stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: [x-remote-extra-]
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    List of request header prefixes to inspect. X-Remote-Extra- is suggested.
    -->
    要检查请求头部前缀列表。建议使用 X-Remote-Extra- 
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --requestheader-group-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [x-remote-group]
    -->
    --requestheader-group-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: [x-remote-group]
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    List of request headers to inspect for groups. X-Remote-Group is suggested.
    -->
    用于检查组的请求头部列表。建议使用 X-Remote-Group。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --requestheader-username-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [x-remote-user]
    -->
    --requestheader-username-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: [x-remote-user]
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    List of request headers to inspect for usernames. X-Remote-User is common.
    -->
    用于检查用户名的请求头部列表。  X-Remote-User 很常见。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --scheduler-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default-scheduler"
    -->
    --scheduler-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "default-scheduler"
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!-- 
    DEPRECATED: name of the scheduler, used to select which pods will be processed by this scheduler, based on pod's "spec.schedulerName".
    -->
    弃用: 调度程序名称用于根据 Pod 的 "spec.schedulerName" 选择此调度程序将处理的 Pod。
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10259
    -->
    --secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10259
    </td>
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
    <td colspan="2">--skip-headers</td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    If true, avoid header prefixes in the log messages
    -->
    如果为 true，请在日志消息中避免头部前缀
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
    如果为true，则在打开日志文件时避免头部
    </td>
</tr>

<tr>
    <td colspan="2">
    <!--
    --stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2
    -->
    --stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 2
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    logs at or above this threshold go to stderr
    -->
    达到或超过此阈值的日志转到 stderr
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
    包含默认的 HTTPS x509 证书的文件。（CA证书（如果有）在服务器证书之后并置）。如果启用了 HTTPS 服务，并且未提供 --tls-cert-file 和 --tls-private-key-file，则会为公共地址生成一个自签名证书和密钥，并将其保存到 --cert-dir 指定的目录中。
    </td>
</tr>

<tr>
    <td colspan="2">--tls-cipher-suites stringSlice</td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!-- 
    Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be use.  Possible values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA
    -->
    服务器的密码套件列表，以逗号分隔。如果省略，将使用默认的 Go 密码套件。可能的值：
    TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA
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
    <td colspan="2">
    <!--
    --tls-sni-cert-key namedCertKey&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: []
    -->
    --tls-sni-cert-key namedCertKey&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: []
    </td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com".
    -->
    一对 x509 证书和私钥文件路径，可选地后缀为完全限定域名的域模式列表，并可能带有前缀的通配符段。如果未提供域模式，则获取证书名称。非通配符匹配胜过通配符匹配，显式域模式胜过获取名称。 对于多个密钥/证书对，请多次使用 --tls-sni-cert-key。例如: "example.crt,example.key" 或者 "foo.crt,foo.key:*.foo.com,foo.com"。
    </td>
</tr>

<tr>
    <td colspan="2">--use-legacy-policy-config</td>
</tr>
<tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">
    <!--
    DEPRECATED: when set to true, scheduler will ignore policy ConfigMap and uses policy config file
    -->
    弃用: 设置为 true 时，调度程序将忽略策略 ConfigMap 并使用策略配置文件
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
    日志级别详细程度的数字
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
    打印版本信息并退出
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
    以逗号分隔的 pattern = N 设置列表，用于文件过滤的日志记录
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
    如果已设置，请将配置值写入此文件并退出。
    </td>
</tr>

  </tbody>
</table>





