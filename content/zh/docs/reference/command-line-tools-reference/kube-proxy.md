---
title: kube-proxy
content_type: tool-reference
weight: 30
---
<!-- 
---
title: kube-proxy
content_type: tool-reference
weight: 28
--- 
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
Kubernetes 网络代理在每个节点上运行。网络代理反映了每个节点上 Kubernetes API 中定义的服务，并且可以执行简单的 TCP、UDP 和 SCTP 流转发，或者在一组后端进行循环 TCP、UDP 和 SCTP 转发。当前可通过 Docker-links-compatible 环境变量找到服务集群 IP 和端口，这些环境变量指定了服务代理打开的端口。有一个可选的插件，可以为这些集群 IP 提供集群 DNS。用户必须使用 apiserver API 创建服务才能配置代理。

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
--bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0
-->
--bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 0.0.0.0
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address for the proxy server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)
-->
代理服务器要使用的 IP 地址（对于所有 IPv4 接口设置为 0.0.0.0，对于所有 IPv6 接口设置为 ::）
</td>
</tr>

<tr>
<td colspan="2">--cleanup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true cleanup iptables and ipvs rules and exit.
-->
如果为 true，清理 iptables 和 ipvs 规则并退出。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--cleanup-ipvs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
-->
--cleanup-ipvs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: true
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true and --cleanup is specified, kube-proxy will also flush IPVS rules, in addition to normal cleanup.
-->
如果设置为 true 并指定了 --cleanup，则 kube-proxy 除了常规清理外，还将刷新 IPVS 规则。
</td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The CIDR range of pods in the cluster. When configured, traffic sent to a Service cluster IP from outside this range will be masqueraded and traffic sent from pods to an external LoadBalancer IP will be directed to the respective cluster IP instead
-->
集群中 Pod 的 CIDR 范围。配置后，将从该范围之外发送到服务集群 IP 的流量被伪装，从 Pod 发送到外部 LoadBalancer IP 的流量将被重定向到相应的集群 IP。
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
<td colspan="2">
<!--
--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s
-->
--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 15m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
How often configuration from the apiserver is refreshed.  Must be greater than 0.
-->
来自 apiserver 的配置的刷新频率。必须大于 0。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 32768
-->
--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 32768
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of NAT connections to track per CPU core (0 to leave the limit as-is and ignore conntrack-min).
-->
每个 CPU 核跟踪的最大 NAT 连接数（0 表示保留原样限制并忽略 conntrack-min）。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 131072
-->
--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 131072
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum number of conntrack entries to allocate, regardless of conntrack-max-per-core (set conntrack-max-per-core=0 to leave the limit as-is).
-->
无论 conntrack-max-per-core 多少，要分配的 conntrack 条目的最小数量（将 conntrack-max-per-core 设置为 0 即可保持原样的限制）。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1h0m0s
-->
--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 1h0m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
NAT timeout for TCP connections in the CLOSE_WAIT state
-->
处于 CLOSE_WAIT 状态的 TCP 连接的 NAT 超时
</td>
</tr>

<tr>
<td colspan="2">
<!--
--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s
-->
--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 24h0m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Idle timeout for established TCP connections (0 to leave as-is)
-->
已建立的 TCP 连接的空闲超时（0 保持原样）
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
一组键=值（key=value）对，描述了 alpha/experimental 的特征。可选项有：<br/>APIListChunking=true|false (BETA - 默认值=true)<br/>APIResponseCompression=true|false (BETA - 默认值=true)<br/>AllAlpha=true|false (ALPHA - 默认值=false)<br/>AppArmor=true|false (BETA - 默认值=true)<br/>AttachVolumeLimit=true|false (BETA - 默认值=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - 默认值=false)<br/>BlockVolume=true|false (BETA - 默认值=true)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - 默认值=false)<br/>CPUManager=true|false (BETA - 默认值=true)<br/>CRIContainerLogRotation=true|false (BETA - 默认值=true)<br/>CSIBlockVolume=true|false (BETA - 默认值=true)<br/>CSIDriverRegistry=true|false (BETA - 默认值=true)<br/>CSIInlineVolume=true|false (BETA - 默认值=true)<br/>CSIMigration=true|false (ALPHA - 默认值=false)<br/>CSIMigrationAWS=true|false (ALPHA - 默认值=false)<br/>CSIMigrationAzureDisk=true|false (ALPHA - 默认值=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - 默认值=false)<br/>CSIMigrationGCE=true|false (ALPHA - 默认值=false)<br/>CSIMigrationOpenStack=true|false (ALPHA - 默认值=false)<br/>CSINodeInfo=true|false (BETA - 默认值=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默认值=false)<br/>CustomResource默认值ing=true|false (BETA - 默认值=true)<br/>DevicePlugins=true|false (BETA - 默认值=true)<br/>DryRun=true|false (BETA - 默认值=true)<br/>DynamicAuditing=true|false (ALPHA - 默认值=false)<br/>DynamicKubeletConfig=true|false (BETA - 默认值=true)<br/>EndpointSlice=true|false (ALPHA - 默认值=false)<br/>EphemeralContainers=true|false (ALPHA - 默认值=false)<br/>EvenPodsSpread=true|false (ALPHA - 默认值=false)<br/>ExpandCSIVolumes=true|false (BETA - 默认值=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - 默认值=true)<br/>ExpandPersistentVolumes=true|false (BETA - 默认值=true)<br/>ExperimentalHostUserNamespace默认值ing=true|false (BETA - 默认值=false)<br/>HPAScaleToZero=true|false (ALPHA - 默认值=false)<br/>HyperVContainer=true|false (ALPHA - 默认值=false)<br/>IPv6DualStack=true|false (ALPHA - 默认值=false)<br/>KubeletPodResources=true|false (BETA - 默认值=true)<br/>LegacyNodeRoleBehavior=true|false (ALPHA - 默认值=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - 默认值=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 默认值=false)<br/>MountContainers=true|false (ALPHA - 默认值=false)<br/>NodeDisruptionExclusion=true|false (ALPHA - 默认值=false)<br/>NodeLease=true|false (BETA - 默认值=true)<br/>NonPreemptingPriority=true|false (ALPHA - 默认值=false)<br/>PodOverhead=true|false (ALPHA - 默认值=false)<br/>PodShareProcessNamespace=true|false (BETA - 默认值=true)<br/>ProcMountType=true|false (ALPHA - 默认值=false)<br/>QOSReserved=true|false (ALPHA - 默认值=false)<br/>RemainingItemCount=true|false (BETA - 默认值=true)<br/>RemoveSelfLink=true|false (ALPHA - 默认值=false)<br/>RequestManagement=true|false (ALPHA - 默认值=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - 默认值=false)<br/>ResourceQuotaScopeSelectors=true|false (BETA - 默认值=true)<br/>RotateKubeletClientCertificate=true|false (BETA - 默认值=true)<br/>RotateKubeletServerCertificate=true|false (BETA - 默认值=true)<br/>RunAsGroup=true|false (BETA - 默认值=true)<br/>RuntimeClass=true|false (BETA - 默认值=true)<br/>SCTPSupport=true|false (ALPHA - 默认值=false)<br/>ScheduleDaemonSetPods=true|false (BETA - 默认值=true)<br/>ServerSideApply=true|false (BETA - 默认值=true)<br/>ServiceLoadBalancerFinalizer=true|false (BETA - 默认值=true)<br/>ServiceNodeExclusion=true|false (ALPHA - 默认值=false)<br/>StartupProbe=true|false (BETA - 默认值=true)<br/>StorageVersionHash=true|false (BETA - 默认值=true)<br/>StreamingProxyRedirects=true|false (BETA - 默认值=true)<br/>SupportNodePidsLimit=true|false (BETA - 默认值=true)<br/>SupportPodPidsLimit=true|false (BETA - 默认值=true)<br/>Sysctls=true|false (BETA - 默认值=true)<br/>TTLAfterFinished=true|false (ALPHA - 默认值=false)<br/>TaintBasedEvictions=true|false (BETA - 默认值=true)<br/>TaintNodesByCondition=true|false (BETA - 默认值=true)<br/>TokenRequest=true|false (BETA - 默认值=true)<br/>TokenRequestProjection=true|false (BETA - 默认值=true)<br/>TopologyManager=true|false (ALPHA - 默认值=false)<br/>ValidateProxyRedirects=true|false (BETA - 默认值=true)<br/>VolumePVCDataSource=true|false (BETA - 默认值=true)<br/>VolumeSnapshotDataSource=true|false (ALPHA - 默认值=false)<br/>VolumeSubpathEnvExpansion=true|false (BETA - 默认值=true)<br/>WatchBookmark=true|false (BETA - 默认值=true)<br/>WinDSR=true|false (ALPHA - 默认值=false)<br/>WinOverlay=true|false (ALPHA - 默认值=false)<br/>WindowsGMSA=true|false (BETA - 默认值=true)<br/>WindowsRunAsUserName=true|false (ALPHA - 默认值=false)
</td>
</tr>

<tr>
<td colspan="2">
<!--
--healthz-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0:10256
-->
--healthz-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 0.0.0.0:10256
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address for the health check server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)
-->
服务健康检查的 IP 地址和端口（对于所有 IPv4 接口设置为 0.0.0.0，对于所有 IPv6 接口设置为 ::）
</td>
</tr>

<tr>
<td colspan="2">
<!--
--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10256
-->
--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 10256
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port to bind the health check server. Use 0 to disable.
-->
绑定健康检查服务的端口。使用 0 表示禁用。
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kube-proxy
-->
kube-proxy 操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">--hostname-override string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, will use this string as identification instead of the actual hostname.
-->
如果非空，将使用此字符串作为标识而不是实际的主机名。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 14
-->
--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 14
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If using the pure iptables proxy, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].
-->
如果使用纯 iptables 代理，则 fwmark 空间的 bit 用于标记需要 SNAT 的数据包。必须在 [0,31] 范围内。
</td>
</tr>

<tr>
<td colspan="2">--iptables-min-sync-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The minimum interval of how often the iptables rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').
-->
iptables 规则可以随着端点和服务的更改而刷新的最小间隔（例如 '5s'、'1m'、'2h22m'）。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s
-->
--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 30s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum interval of how often iptables rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.
-->
刷新 iptables 规则的最大间隔（例如 '5s'、'1m'、'2h22m'）。必须大于 0。
</td>
</tr>

<tr>
<td colspan="2">--ipvs-exclude-cidrs stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma-separated list of CIDR's which the ipvs proxier should not touch when cleaning up IPVS rules.
-->
逗号分隔的 CIDR 列表，ipvs 代理在清理 IPVS 规则时不应使用此列表。
</td>
</tr>

<tr>
<td colspan="2">--ipvs-min-sync-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The minimum interval of how often the ipvs rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').
-->
ipvs 规则可以随着端点和服务的更改而刷新的最小间隔（例如 '5s'、'1m'、'2h22m'）。
</td>
</tr>

<tr>
<td colspan="2">--ipvs-scheduler string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The ipvs scheduler type when proxy mode is ipvs
-->
代理模式为 ipvs 时的 ipvs 调度器类型
</td>
</tr>

<tr>
<td colspan="2">--ipvs-strict-arp</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable strict ARP by setting arp_ignore to 1 and arp_announce to 2
-->
通过将 arp_ignore 设置为 1 并将 arp_announce 设置为 2 启用严格的 ARP
</td>
</tr>

<tr>
<td colspan="2">
<!--
--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s
-->
--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 30s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum interval of how often ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.
-->
刷新 ipvs 规则的最大间隔（例如 '5s'、'1m'、'2h22m'）。必须大于 0。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10
-->
--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 10
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Burst to use while talking with kubernetes apiserver
-->
与 kubernetes apiserver 通信的数量
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"
-->
--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "application/vnd.kubernetes.protobuf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Content type of requests sent to apiserver.
-->
发送到 apiserver 的请求的内容类型。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5
-->
--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 5
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
QPS to use while talking with kubernetes apiserver
-->
与 kubernetes apiserver 交互时使用的 QPS
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to kubeconfig file with authorization information (the master location is set by the master flag).
-->
包含授权信息的 kubeconfig 文件的路径（master 位置由 master 标志设置）。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s
-->
--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 5s
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
<td colspan="2">--masquerade-all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If using the pure iptables proxy, SNAT all traffic sent via Service cluster IPs (this not commonly needed)
-->
如果使用纯 iptables 代理，则对通过服务集群 IP 发送的所有流量进行 SNAT（通常不需要）
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
<td colspan="2">
<!--
--metrics-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 127.0.0.1:10249
-->
--metrics-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 127.0.0.1:10249
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address for the metrics server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)
-->
metrics 服务器要使用的 IP 地址（所有 IPv4 接口设置为 0.0.0.0，所有 IPv6 接口设置为 `::`）
</td>
</tr>

<tr>
<td colspan="2">
<!--
--metrics-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10249
-->
--metrics-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 10249
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port to bind the metrics server. Use 0 to disable.
-->
绑定 metrics 服务器的端口。使用 0 表示禁用。
</td>
</tr>

<tr>
<td colspan="2">--nodeport-addresses stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A string slice of values which specify the addresses to use for NodePorts. Values may be valid IP blocks (e.g. 1.2.3.0/24, 1.2.3.4/32). The default empty string slice ([]) means to use all local addresses.
-->
一个字符串值，指定用于 NodePorts 的地址。值可以是有效的 IP 块（例如 1.2.3.0/24, 1.2.3.4/32）。默认的空字符串切片（[]）表示使用所有本地地址。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -999
-->
--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: -999
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The oom-score-adj value for kube-proxy process. Values must be within the range [-1000, 1000]
-->
kube-proxy 进程中的 oom-score-adj 值必须在 [-1000,1000] 范围内
</td>
</tr>

<tr>
<td colspan="2">--profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true enables profiling via web interface on /debug/pprof handler.
-->
如果为 true，则通过 Web 接口 /debug/pprof 启用性能分析。
</td>
</tr>

<tr>
<td colspan="2">--proxy-mode ProxyMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Which proxy mode to use: 'userspace' (older) or 'iptables' (faster) or 'ipvs'. If blank, use the best-available proxy (currently iptables).  If the iptables proxy is selected, regardless of how, but the system's kernel or iptables versions are insufficient, this always falls back to the userspace proxy.
-->
使用哪种代理模式：'userspace'（较旧）或 'iptables'（较快）或 'ipvs'（实验）。如果为空，使用最佳可用代理（当前为 iptables）。如果选择了 iptables 代理，无论如何，但系统的内核或 iptables 版本较低，这总是会回退到用户空间代理。
</td>
</tr>

<tr>
<td colspan="2">--proxy-port-range port-range</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Range of host ports (beginPort-endPort, single port or beginPort+offset, inclusive) that may be consumed in order to proxy service traffic. If (unspecified, 0, or 0-0) then ports will be randomly chosen.
-->
可以使用代理服务流量的主机端口（包括 beginPort-endPort、single port、beginPort+offset）的范围。如果（未指定，0 或 0-0）则随机选择端口。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 250ms
-->
--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 250ms
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
How long an idle UDP connection will be kept open (e.g. '250ms', '2s').  Must be greater than 0. Only applicable for proxy-mode=userspace
-->
空闲 UDP 连接将保持打开的时长（例如 '250ms'，'2s'）。必须大于 0。仅适用于 proxy-mode=userspace
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
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, write the default configuration values to this file and exit.
-->
如果设置，将配置值写入此文件并退出。
</td>
</tr>

</tbody>
</table>




