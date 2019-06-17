---
title: kube-proxy
notitle: true
---
## kube-proxy


<!--
### Synopsis


The Kubernetes network proxy runs on each node. This
reflects services as defined in the Kubernetes API on each node and can do simple
TCP and UDP stream forwarding or round robin TCP and UDP forwarding across a set of backends.
Service cluster IPs and ports are currently found through Docker-links-compatible
environment variables specifying ports opened by the service proxy. There is an optional
addon that provides cluster DNS for these cluster IPs. The user must create a service
with the apiserver API to configure the proxy.
-->
### 概要

Kubernetes 在每个节点上运行网络代理。这反映每个节点上 Kubernetes API 中定义的服务，并且可以做简单的
TCP 和 UDP 流转发或在一组后端中轮询，进行 TCP 和 UDP 转发。目前服务集群 IP 和端口通过由服务代理打开的端口
的 Docker-links-compatible 环境变量找到。有一个可选的为这些集群 IP 提供集群 DNS 的插件。用户必须
通过 apiserver API 创建服务去配置代理。

```
kube-proxy [flags]
```

<!--
### Options
-->
### 选项

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
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
      -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">包含 Azure 容器仓库配置信息的文件的路径。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
    -->
      <td colspan="2">--bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 0.0.0.0</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address for the proxy server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">要服务的代理服务器的 IP 地址（对于所有 IPv4 接口设置为 0.0.0.0，对于所有 IPv6 接口设置为 ::）</td>
    </tr>

    <tr>
      <td colspan="2">--cleanup</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true cleanup iptables and ipvs rules and exit.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果为 true，清理 iptables 和 ipvs 规则并退出。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--cleanup-ipvs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    -->
      <td colspan="2">--cleanup-ipvs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: true</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true make kube-proxy cleanup ipvs rules before running.  Default is true</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果为 true，则使 kube-proxy 在运行之前清理 ipvs 规则。 默认为 true</td>
    </tr>

    <tr>
      <td colspan="2">--cluster-cidr string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The CIDR range of pods in the cluster. When configured, traffic sent to a Service cluster IP from outside this range will be masqueraded and traffic sent from pods to an external LoadBalancer IP will be directed to the respective cluster IP instead</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">集群中的 CIDR 范围。 配置后，从该范围之外发送到服务集群 IP 的流量将被伪装，从 pod 发送到外部 LoadBalancer IP 的流量将被定向到相应的集群 IP</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the configuration file.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">配置文件的路径。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s</td>
    -->
      <td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 15m0s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">How often configuration from the apiserver is refreshed.  Must be greater than 0.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">来自 apiserver 的配置的刷新频率。必须大于 0。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 32768</td>
    -->
      <td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 32768</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of NAT connections to track per CPU core (0 to leave the limit as-is and ignore conntrack-min).</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">每个 CPU 核跟踪的最大 NAT 连接数（0 表示保留原样限制并忽略 conntrack-min）。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 131072</td>
    -->
      <td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 131072</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Minimum number of conntrack entries to allocate, regardless of conntrack-max-per-core (set conntrack-max-per-core=0 to leave the limit as-is).</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">要分配的最小 conntrack 条目数，不管 conntrack-max-per-core（设置 conntrack-max-per-core = 0 保留原样限制）。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1h0m0s</td>
    -->
      <td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 1h0m0s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">NAT timeout for TCP connections in the CLOSE_WAIT state</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">处于 CLOSE_WAIT 状态的 TCP 连接的 NAT 超时</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s</td>
    -->
      <td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 24h0m0s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Idle timeout for established TCP connections (0 to leave as-is)</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">已建立的 TCP 连接的空闲超时（0 保持原样）</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates mapStringBool</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (ALPHA - default=false)<br/>AdvancedAuditing=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>AttachVolumeLimit=true|false (ALPHA - default=false)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BlockVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIBlockVolume=true|false (ALPHA - default=false)<br/>CSIPersistentVolume=true|false (BETA - default=true)<br/>CustomPodDNS=true|false (BETA - default=true)<br/>CustomResourceSubresources=true|false (BETA - default=true)<br/>CustomResourceValidation=true|false (BETA - default=true)<br/>DebugContainers=true|false (ALPHA - default=false)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>DynamicProvisioningScheduling=true|false (ALPHA - default=false)<br/>EnableEquivalenceClassCache=true|false (ALPHA - default=false)<br/>ExpandInUsePersistentVolumes=true|false (ALPHA - default=false)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GCERegionalPersistentDisk=true|false (BETA - default=true)<br/>HugePages=true|false (BETA - default=true)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>KubeletPluginsWatcher=true|false (ALPHA - default=false)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>MountContainers=true|false (ALPHA - default=false)<br/>MountPropagation=true|false (BETA - default=true)<br/>PersistentLocalVolumes=true|false (BETA - default=true)<br/>PodPriority=true|false (BETA - default=true)<br/>PodReadinessGates=true|false (BETA - default=false)<br/>PodShareProcessNamespace=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>ReadOnlyAPIDataVolumes=true|false (DEPRECATED - default=true)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>ResourceQuotaScopeSelectors=true|false (ALPHA - default=false)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (ALPHA - default=false)<br/>RunAsGroup=true|false (ALPHA - default=false)<br/>ScheduleDaemonSetPods=true|false (ALPHA - default=false)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>ServiceProxyAllowExternalIPs=true|false (DEPRECATED - default=false)<br/>StorageObjectInUseProtection=true|false (default=true)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportIPVSProxyMode=true|false (default=true)<br/>SupportPodPidsLimit=true|false (ALPHA - default=false)<br/>Sysctls=true|false (BETA - default=true)<br/>TaintBasedEvictions=true|false (ALPHA - default=false)<br/>TaintNodesByCondition=true|false (ALPHA - default=false)<br/>TokenRequest=true|false (ALPHA - default=false)<br/>TokenRequestProjection=true|false (ALPHA - default=false)<br/>VolumeScheduling=true|false (BETA - default=true)<br/>VolumeSubpath=true|false (default=true)<br/>VolumeSubpathEnvExpansion=true|false (ALPHA - default=false)</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一组 key=value 对，用于描述 alpha/experimental 特征的特征门。选项包括：<br/>APIListChunking=true|false (BETA - 默认=true)<br/>APIResponseCompression=true|false (ALPHA - 默认=false)<br/>AdvancedAuditing=true|false (BETA - 默认=true)<br/>AllAlpha=true|false (ALPHA - 默认=false)<br/>AppArmor=true|false (BETA - 默认=true)<br/>AttachVolumeLimit=true|false (ALPHA - 默认=false)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - 默认=false)<br/>BlockVolume=true|false (ALPHA - 默认=false)<br/>CPUManager=true|false (BETA - 默认=true)<br/>CRIContainerLogRotation=true|false (BETA - 默认=true)<br/>CSIBlockVolume=true|false (ALPHA - 默认=false)<br/>CSIPersistentVolume=true|false (BETA - 默认=true)<br/>CustomPodDNS=true|false (BETA - 默认=true)<br/>CustomResourceSubresources=true|false (BETA - 默认=true)<br/>CustomResourceValidation=true|false (BETA - 默认=true)<br/>DebugContainers=true|false (ALPHA - 默认=false)<br/>DevicePlugins=true|false (BETA - 默认=true)<br/>DynamicKubeletConfig=true|false (BETA - 默认=true)<br/>DynamicProvisioningScheduling=true|false (ALPHA - 默认=false)<br/>EnableEquivalenceClassCache=true|false (ALPHA - 默认=false)<br/>ExpandInUsePersistentVolumes=true|false (ALPHA - 默认=false)<br/>ExpandPersistentVolumes=true|false (BETA - 默认=true)<br/>ExperimentalCriticalPodAnnotation=true|false (ALPHA - 默认=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 默认=false)<br/>GCERegionalPersistentDisk=true|false (BETA - 默认=true)<br/>HugePages=true|false (BETA - 默认=true)<br/>HyperVContainer=true|false (ALPHA - 默认=false)<br/>KubeletPluginsWatcher=true|false (ALPHA - 默认=false)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>MountContainers=true|false (ALPHA - 默认=false)<br/>MountPropagation=true|false (BETA - 默认=true)<br/>PersistentLocalVolumes=true|false (BETA - 默认=true)<br/>PodPriority=true|false (BETA - 默认=true)<br/>PodReadinessGates=true|false (BETA - 默认=false)<br/>PodShareProcessNamespace=true|false (ALPHA - 默认=false)<br/>QOSReserved=true|false (ALPHA - 默认=false)<br/>ReadOnlyAPIDataVolumes=true|false (弃用 - 默认=true)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - 默认=false)<br/>ResourceQuotaScopeSelectors=true|false (ALPHA - 默认=false)<br/>RotateKubeletClientCertificate=true|false (BETA - 默认=true)<br/>RotateKubeletServerCertificate=true|false (ALPHA - 默认=false)<br/>RunAsGroup=true|false (ALPHA - 默认=false)<br/>ScheduleDaemonSetPods=true|false (ALPHA - 默认=false)<br/>ServiceNodeExclusion=true|false (ALPHA - 默认=false)<br/>ServiceProxyAllowExternalIPs=true|false (弃用 - 默认=false)<br/>StorageObjectInUseProtection=true|false (default=true)<br/>StreamingProxyRedirects=true|false (BETA - 默认=true)<br/>SupportIPVSProxyMode=true|false (默认=true)<br/>SupportPodPidsLimit=true|false (ALPHA - 默认=false)<br/>Sysctls=true|false (BETA - 默认=true)<br/>TaintBasedEvictions=true|false (ALPHA - 默认=false)<br/>TaintNodesByCondition=true|false (ALPHA - 默认=false)<br/>TokenRequest=true|false (ALPHA - 默认=false)<br/>TokenRequestProjection=true|false (ALPHA - 默认=false)<br/>VolumeScheduling=true|false (BETA - 默认=true)<br/>VolumeSubpath=true|false (默认=true)<br/>VolumeSubpathEnvExpansion=true|false (ALPHA - 默认=false)</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--healthz-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0:10256</td>
    -->
      <td colspan="2">--healthz-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 0.0.0.0:10256</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address and port for the health check server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">服务健康检查的 IP 地址和端口（对于所有 IPv4 接口设置为 0.0.0.0，对于所有 IPv6 接口设置为 ::）</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10256</td>
    -->
      <td colspan="2">--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10256</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port to bind the health check server. Use 0 to disable.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">绑定健康检查服务的端口。使用 0 禁用。</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kube-proxy</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kube-proxy 帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--hostname-override string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, will use this string as identification instead of the actual hostname.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果非空，将使用此字符串作为标识而不是实际的主机名。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 14</td>
    -->
      <td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 14</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If using the pure iptables proxy, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果使用纯 iptables 代理，则 fwmark 空间的位用于标记需要 SNAT 的数据包。 必须在 [0,31] 范围内。</td>
    </tr>

    <tr>
      <td colspan="2">--iptables-min-sync-period duration</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The minimum interval of how often the iptables rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">当端点和服务发生变化时，iptables 规则的刷新的最小间隔（例如 '5s'，'1m'，'2h22m'）。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    -->
      <td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 30s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum interval of how often iptables rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">iptables 规则刷新的最大时间间隔（例如 '5s'，'1m'，'2h22m'）。必须大于 0。</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-exclude-cidrs stringSlice</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A comma-separated list of CIDR's which the ipvs proxier should not touch when cleaning up IPVS rules.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">以逗号分隔的 CIDR 列表，在清理 IPVS 规则时，不应该触及 ipvs proxier。</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-min-sync-period duration</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The minimum interval of how often the ipvs rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">当端点和服务发生变化时，ipvs 规则的刷新的最小间隔（例如 '5s'，'1m'，'2h22m'）。</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-scheduler string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The ipvs scheduler type when proxy mode is ipvs</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">代理模式为 ipvs 时的 ipvs 调度器类型</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    -->
      <td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 30s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum interval of how often ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">ipvs 规则刷新的最大时间间隔（例如 '5s'，'1m'，'2h22m'）。必须大于 0。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
    -->
      <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Burst to use while talking with kubernetes apiserver</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">每秒与 kubernetes apiserver 交互的数量</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
    -->
      <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "application/vnd.kubernetes.protobuf"</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Content type of requests sent to apiserver.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">发送到 apiserver 的请求的内容类型。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td>
    -->
      <td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 5</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">QPS to use while talking with kubernetes apiserver</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">与 kubernetes apiserver 交互时使用的 QPS</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeconfig file with authorization information (the master location is set by the master flag).</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">包含授权信息的 kubeconfig 文件的路径（master 位置由 master 标志设置）。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    -->
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 5s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">日志刷新最大间隔</td>
    </tr>

    <tr>
      <td colspan="2">--masquerade-all</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If using the pure iptables proxy, SNAT all traffic sent via Service cluster IPs (this not commonly needed)</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果使用纯 iptables 代理，SNAT 所有通过服务句群 IP 发送的流量（这通常不需要）</td>
    </tr>

    <tr>
      <td colspan="2">--master string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The address of the Kubernetes API server (overrides any value in kubeconfig)</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Kubernetes API 服务器的地址（覆盖 kubeconfig 中的任何值）</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--metrics-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 127.0.0.1:10249</td>
    -->
      <td colspan="2">--metrics-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 127.0.0.1:10249</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address and port for the metrics server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">要服务的度量服务器的 IP 地址和端口（对于所有 IPv4 接口设置为 0.0.0.0，对于所有 IPv6 接口设置为 ::）</td>
    </tr>

    <tr>
      <td colspan="2">--nodeport-addresses stringSlice</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A string slice of values which specify the addresses to use for NodePorts. Values may be valid IP blocks (e.g. 1.2.3.0/24, 1.2.3.4/32). The default empty string slice ([]) means to use all local addresses.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一个字符串值，指定用于 NodePorts 的地址。 值可以是有效的 IP 块（例如 1.2.3.0/24, 1.2.3.4/32）。 默认的空字符串切片（[]）表示使用所有本地地址。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -999</td>
    -->
      <td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: -999</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The oom-score-adj value for kube-proxy process. Values must be within the range [-1000, 1000]</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kube-proxy 进程的 oom-score-adj 值。 值必须在 [-1000,1000] 范围内</td>
    </tr>

    <tr>
      <td colspan="2">--profiling</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true enables profiling via web interface on /debug/pprof handler.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果为 true，则通过 Web 接口 /debug/pprof 启用性能分析。</td>
    </tr>

    <tr>
      <td colspan="2">--proxy-mode ProxyMode</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Which proxy mode to use: 'userspace' (older) or 'iptables' (faster) or 'ipvs' (experimental). If blank, use the best-available proxy (currently iptables).  If the iptables proxy is selected, regardless of how, but the system's kernel or iptables versions are insufficient, this always falls back to the userspace proxy.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">使用哪种代理模式：'userspace'（较旧）或 'iptables'（较快）或 'ipvs'（实验）。 如果为空，使用最佳可用代理（当前为 iptables）。 如果选择了 iptables 代理，无论如何，但系统的内核或 iptables 版本不足，这总是会回退到用户空间代理。</td>
    </tr>

    <tr>
      <td colspan="2">--proxy-port-range port-range</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Range of host ports (beginPort-endPort, single port or beginPort+offset, inclusive) that may be consumed in order to proxy service traffic. If (unspecified, 0, or 0-0) then ports will be randomly chosen.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">主机端口的范围（beginPort-endPort，单端口或 beginPort + offset，包括），可以被代理服务流量消耗。 如果（未指定，0 或 0-0）则随机选择端口。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 250ms</td>
    -->
      <td colspan="2">--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 250ms</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">How long an idle UDP connection will be kept open (e.g. '250ms', '2s').  Must be greater than 0. Only applicable for proxy-mode=userspace</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">空闲 UDP 连接将保持打开的时长（例如 '250ms'，'2s'）。 必须大于 0。仅适用于 proxy-mode=userspace</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">打印版本信息并退出</td>
    </tr>

    <tr>
      <td colspan="2">--write-config-to string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, write the default configuration values to this file and exit.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果设置，将配置值写入此文件并退出。</td>
    </tr>

  </tbody>
</table>
