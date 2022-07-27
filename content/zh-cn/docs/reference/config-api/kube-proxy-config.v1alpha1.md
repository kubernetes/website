---
title: kube-proxy 配置 (v1alpha1)
content_type: tool-reference
package: kubeproxy.config.k8s.io/v1alpha1
auto_generated: true
---

<!--
title: kube-proxy Configuration (v1alpha1)
content_type: tool-reference
package: kubeproxy.config.k8s.io/v1alpha1
auto_generated: true
-->

<!--
## Resource Types
-->
## 资源类型    {#resource-types}

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

## `KubeProxyConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration}

<!--
KubeProxyConfiguration contains everything necessary to configure the
Kubernetes proxy server.
-->
KubeProxyConfiguration 包含用来配置 Kubernetes 代理服务器的所有配置信息。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeproxy.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeProxyConfiguration</code></td></tr>
  
<tr><td><code>featureGates</code> <B><!--[Required]-->[必需]</B><br/>
<code>map[string]bool</code>
</td>
<td>
   <!--
   featureGates is a map of feature names to bools that enable or disable alpha/experimental features.
   -->
   <p><code>featureGates</code> 字段是一个功能特性名称到布尔值的映射表，
   用来启用或者禁用测试性质的功能特性。</p>
</td>
</tr>
<tr><td><code>bindAddress</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   bindAddress is the IP address for the proxy server to serve on (set to 0.0.0.0
for all interfaces)
   -->
   <p><code>bindAddress</code> 字段是代理服务器提供服务时所用 IP 地址（设置为 0.0.0.0
时意味着在所有网络接口上提供服务）。</p>
</td>
</tr>
<tr><td><code>healthzBindAddress</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   healthzBindAddress is the IP address and port for the health check server to serve on,
defaulting to 0.0.0.0:10256
   -->
   <p><code>healthzBindAddress</code> 字段是健康状态检查服务器提供服务时所使用的的 IP 地址和端口，
   默认设置为 '0.0.0.0:10256'。</p>
</td>
</tr>
<tr><td><code>metricsBindAddress</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   metricsBindAddress is the IP address and port for the metrics server to serve on,
defaulting to 127.0.0.1:10249 (set to 0.0.0.0 for all interfaces)
   -->
   <p><code>metricsBindAddress</code> 字段是度量值服务器提供服务时所使用的的 IP 地址和端口，
   默认设置为 '127.0.0.1:10249'（设置为 0.0.0.0 意味着在所有接口上提供服务）。</p>
</td>
</tr>
<tr><td><code>bindAddressHardFail</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   bindAddressHardFail, if true, kube-proxy will treat failure to bind to a port as fatal and exit
   -->
   <p><code>bindAddressHardFail</code> 字段设置为 true 时，
   kube-proxy 将无法绑定到某端口这类问题视为致命错误并直接退出。</p>
</td>
</tr>
<tr><td><code>enableProfiling</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   enableProfiling enables profiling via web interface on /debug/pprof handler.
Profiling handlers will be handled by metrics server.
   -->
   <p><code>enableProfiling</code> 字段通过 '/debug/pprof' 处理程序在 Web 界面上启用性能分析。
   性能分析处理程序将由度量值服务器执行。</p>
</td>
</tr>
<tr><td><code>clusterCIDR</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   clusterCIDR is the CIDR range of the pods in the cluster. It is used to
bridge traffic coming from outside of the cluster. If not provided,
no off-cluster bridging will be performed.
   -->
   <p><code>clusterCIDR</code> 字段是集群中 Pods 所使用的 CIDR 范围。
   这一地址范围用于对来自集群外的请求流量进行桥接。
   如果未设置，则 kube-proxy 不会对非集群内部的流量做桥接。</p>
</td>
</tr>
<tr><td><code>hostnameOverride</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   hostnameOverride, if non-empty, will be used as the identity instead of the actual hostname.
   -->
   <p><code>hostnameOverride</code> 字段非空时，
   所给的字符串（而不是实际的主机名）将被用作 kube-proxy 的标识。</p>
</td>
</tr>
<tr><td><code>clientConnection</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#ClientConnectionConfiguration"><code>ClientConnectionConfiguration</code></a>
</td>
<td>
   <!--
   clientConnection specifies the kubeconfig file and client connection settings for the proxy
server to use when communicating with the apiserver.
   -->
   <p><code>clientConnection</code> 字段给出代理服务器与 API
   服务器通信时要使用的 kubeconfig 文件和客户端链接设置。</p>
</td>
</tr>
<tr><td><code>iptables</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration"><code>KubeProxyIPTablesConfiguration</code></a>
</td>
<td>
   <!--
   iptables contains iptables-related configuration options.
   -->
   <p><code>iptables</code> 字段字段包含与 iptables 相关的配置选项。</p>
</td>
</tr>
<tr><td><code>ipvs</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration"><code>KubeProxyIPVSConfiguration</code></a>
</td>
<td>
   <!--
   ipvs contains ipvs-related configuration options.
   -->
   <p><code>ipvs</code> 字段中包含与 ipvs 相关的配置选项。</p>
</td>
</tr>
<tr><td><code>oomScoreAdj</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   oomScoreAdj is the oom-score-adj value for kube-proxy process. Values must be within
the range [-1000, 1000]
   -->
   <p><code>oomScoreAdj</code> 字段是为 kube-proxy 进程所设置的 oom-score-adj 值。
   此设置值必须介于 [-1000, 1000] 范围内。</p>
</td>
</tr>
<tr><td><code>mode</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-ProxyMode"><code>ProxyMode</code></a>
</td>
<td>
   <!--
   mode specifies which proxy mode to use.
   -->
   <p><code>mode</code> 字段用来设置将使用的代理模式。</p>
</td>
</tr>
<tr><td><code>portRange</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   portRange is the range of host ports (beginPort-endPort, inclusive) that may be consumed
in order to proxy service traffic. If unspecified (0-0) then ports will be randomly chosen.
   -->
   <p><code>portRange</code> 字段是主机端口的范围，形式为 ‘beginPort-endPort’（包含边界），
   用来设置代理服务所使用的端口。如果未指定（即‘0-0’），则代理服务会随机选择端口号。</p>
</td>
</tr>
<tr><td><code>udpIdleTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   udpIdleTimeout is how long an idle UDP connection will be kept open (e.g. '250ms', '2s').
Must be greater than 0. Only applicable for proxyMode=userspace.
   -->
   <p><code>udpIdleTimeout</code> 字段用来设置 UDP 链接保持活跃的时长（例如，'250ms'、'2s'）。
   此值必须大于 0。此字段仅适用于 mode 值为 'userspace' 的场合。</p>
</td>
</tr>
<tr><td><code>conntrack</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConntrackConfiguration"><code>KubeProxyConntrackConfiguration</code></a>
</td>
<td>
   <!--
   conntrack contains conntrack-related configuration options.
   -->
   <p><code>conntrack</code> 字段包含与 conntrack 相关的配置选项。</p>
</td>
</tr>
<tr><td><code>configSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   configSyncPeriod is how often configuration from the apiserver is refreshed. Must be greater
than 0.
   -->
   <p><code>configSyncPeriod</code> 字段是从 API 服务器刷新配置的频率。此值必须大于 0。</p>
</td>
</tr>
<tr><td><code>nodePortAddresses</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   nodePortAddresses is the --nodeport-addresses value for kube-proxy process. Values must be valid
IP blocks. These values are as a parameter to select the interfaces where nodeport works.
In case someone would like to expose a service on localhost for local visit and some other interfaces for
particular purpose, a list of IP blocks would do that.
If set it to "127.0.0.0/8", kube-proxy will only select the loopback interface for NodePort.
If set it to a non-zero IP block, kube-proxy will filter that down to just the IPs that applied to the node.
An empty string slice is meant to select all network interfaces.
   -->
   <p><code>nodePortAddresses</code> 字段是 kube-proxy 进程的
   <code>--nodeport-addresses</code> 命令行参数设置。
   此值必须是合法的 IP 段。所给的 IP 段会作为参数来选择 NodePort 类型服务所使用的接口。
   如果有人希望将本地主机（Localhost）上的服务暴露给本地访问，同时暴露在某些其他网络接口上
   以实现某种目标，可以使用 IP 段的列表。
   如果此值被设置为 &quot;127.0.0.0/8&quot;，则 kube-proxy 将仅为 NodePort
   服务选择本地回路（loopback）接口。
   如果此值被设置为非零的 IP 段，则 kube-proxy 会对 IP 作过滤，仅使用适用于当前节点的 IP 地址。
   空的字符串列表意味着选择所有网络接口。</p>
</td>
</tr>
<tr><td><code>winkernel</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyWinkernelConfiguration"><code>KubeProxyWinkernelConfiguration</code></a>
</td>
<td>
   <!--
   winkernel contains winkernel-related configuration options.
   -->
   <p><code>winkernel</code> 字段包含与 winkernel 相关的配置选项。</p>
</td>
</tr>
<tr><td><code>showHiddenMetricsForVersion</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   ShowHiddenMetricsForVersion is the version for which you want to show hidden metrics.
   -->
   <p><code>showHiddenMetricsForVersion</code> 字段给出的是一个 Kubernetes 版本号字符串，
   用来设置你希望显示隐藏度量值的版本。</p>
</td>
</tr>
<tr><td><code>detectLocalMode</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-LocalMode"><code>LocalMode</code></a>
</td>
<td>
   <!--
   DetectLocalMode determines mode to use for detecting local traffic, defaults to LocalModeClusterCIDR
   -->
   <p><code>detectLocalMode</code> 字段用来确定检测本地流量的方式，默认为 LocalModeClusterCIDR。</p>
</td>
</tr>
<tr><td><code>detectLocal</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-DetectLocalConfiguration"><code>DetectLocalConfiguration</code></a>
</td>
<td>
<!--
DetectLocal contains optional configuration settings related to DetectLocalMode.
-->
   <p><code>detectLocal</code> 字段包含与 DetectLocalMode 相关的可选配置设置。</p>
</td>
</tr>
</tbody>
</table>

## `DetectLocalConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-DetectLocalConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
DetectLocalConfiguration contains optional settings related to DetectLocalMode option
-->
DetectLocalConfiguration 包含与 DetectLocalMode 选项相关的可选设置。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>bridgeInterface</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
BridgeInterface is a string argument which represents a single bridge interface name.
Kube-proxy considers traffic as local if originating from this given bridge.
This argument should be set if DetectLocalMode is set to LocalModeBridgeInterface.
-->
   <p><code>bridgeInterface</code> 字段是一个表示单个桥接接口名称的字符串参数。
   Kube-proxy 将来自这个给定桥接接口的流量视为本地流量。
   如果 DetectLocalMode 设置为 LocalModeBridgeInterface，则应设置该参数。</p>
</td>
</tr>
<tr><td><code>interfaceNamePrefix</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
InterfaceNamePrefix is a string argument which represents a single interface prefix name.
Kube-proxy considers traffic as local if originating from one or more interfaces which match
the given prefix. This argument should be set if DetectLocalMode is set to LocalModeInterfaceNamePrefix.
-->
   <p><code>interfaceNamePrefix</code> 字段是一个表示单个接口前缀名称的字符串参数。
   Kube-proxy 将来自一个或多个与给定前缀匹配的接口流量视为本地流量。
   如果 DetectLocalMode 设置为 LocalModeInterfaceNamePrefix，则应设置该参数。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyConntrackConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConntrackConfiguration}
    
<!--
**Appears in:**
-->
**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyConntrackConfiguration contains conntrack settings for
the Kubernetes proxy server.
-->
KubeProxyConntrackConfiguration 包含为 Kubernetes 代理服务器提供的 conntrack 设置。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>maxPerCore</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   maxPerCore is the maximum number of NAT connections to track
per CPU core (0 to leave the limit as-is and ignore min).
   -->
   <p><code>maxPerCore</code> 字段是每个 CPU 核所跟踪的 NAT 链接个数上限
   （0 意味着保留当前上限限制并忽略 min 字段设置值）。</p>
</td>
</tr>
<tr><td><code>min</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   min is the minimum value of connect-tracking records to allocate,
regardless of conntrackMaxPerCore (set maxPerCore=0 to leave the limit as-is).
   -->
   <p><code>min</code> 字段给出要分配的链接跟踪记录个数下限。
   设置此值时会忽略 maxPerCore 的值（将 maxPerCore 设置为 0 时不会调整上限值）。</p>
</td>
</tr>
<tr><td><code>tcpEstablishedTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   tcpEstablishedTimeout is how long an idle TCP connection will be kept open
(e.g. '2s').  Must be greater than 0 to set.
   -->
   <p><code>tcpEstablishedTimeout</code> 字段给出空闲 TCP 连接的保留时间（例如，'2s'）。
   此值必须大于 0。</p>
</td>
</tr>
<tr><td><code>tcpCloseWaitTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   tcpCloseWaitTimeout is how long an idle conntrack entry
in CLOSE_WAIT state will remain in the conntrack
table. (e.g. '60s'). Must be greater than 0 to set.
   -->
   <p><code>tcpCloseWaitTimeout</code> 字段用来设置空闲的、处于 CLOSE_WAIT 状态的 conntrack 条目
   保留在 conntrack 表中的时间长度（例如，'60s'）。
   此设置值必须大于 0。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyIPTablesConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration}
    
<!--
**Appears in:**
-->
**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyIPTablesConfiguration contains iptables-related configuration
details for the Kubernetes proxy server.
-->
KubeProxyIPTablesConfiguration 包含用于 Kubernetes 代理服务器的、与 iptables 相关的配置细节。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>masqueradeBit</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   masqueradeBit is the bit of the iptables fwmark space to use for SNAT if using
the pure iptables proxy mode. Values must be within the range [0, 31].
   -->
   <p><code>masqueradeBit</code> 字段是 iptables fwmark 空间中的具体一位，
   用来在纯 iptables 代理模式下设置 SNAT。此值必须介于 [0, 31]（含边界值）。</p>
</td>
</tr>
<tr><td><code>masqueradeAll</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   masqueradeAll tells kube-proxy to SNAT everything if using the pure iptables proxy mode.
   -->
   <p><code>masqueradeAll</code> 字段用来通知 kube-proxy
   在使用纯 iptables 代理模式时对所有流量执行 SNAT 操作。</p>
</td>
</tr>
<tr><td><code>syncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   syncPeriod is the period that iptables rules are refreshed (e.g. '5s', '1m',
'2h22m').  Must be greater than 0.
   -->
   <p><code>syncPeriod</code> 字段给出 iptables
   规则的刷新周期（例如，'5s'、'1m'、'2h22m'）。此值必须大于 0。</p>
</td>
</tr>
<tr><td><code>minSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   minSyncPeriod is the minimum period that iptables rules are refreshed (e.g. '5s', '1m', '2h22m').
   -->
   <p><code>minSyncPeriod</code> 字段给出 iptables
   规则被刷新的最小周期（例如，'5s'、'1m'、'2h22m'）。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyIPVSConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration}
    
<!--
**Appears in:**
-->
**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyIPVSConfiguration contains ipvs-related configuration
details for the Kubernetes proxy server.
-->
KubeProxyIPVSConfiguration 包含用于 Kubernetes 代理服务器的、与 ipvs 相关的配置细节。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
 
<tr><td><code>syncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   syncPeriod is the period that ipvs rules are refreshed (e.g. '5s', '1m',
'2h22m').  Must be greater than 0.
   -->
   <p><code>syncPeriod</code> 字段给出 ipvs 规则的刷新周期（例如，'5s'、'1m'、'2h22m'）。
   此值必须大于 0。</p>
</td>
</tr>
<tr><td><code>minSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   minSyncPeriod is the minimum period that ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').
   -->
   <p><code>minSyncPeriod</code> 字段给出 ipvs 规则被刷新的最小周期（例如，'5s'、'1m'、'2h22m'）。</p>
</td>
</tr>
<tr><td><code>scheduler</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   ipvs scheduler
   -->
   <p>IPVS 调度器。</p>
</td>
</tr>
<tr><td><code>excludeCIDRs</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   excludeCIDRs is a list of CIDR's which the ipvs proxier should not touch
when cleaning up ipvs services.
   -->
   <p><code>excludeCIDRs</code> 字段取值为一个 CIDR 列表，ipvs 代理程序在清理 IPVS 服务时不应触碰这些 IP 地址。</p>
</td>
</tr>
<tr><td><code>strictARP</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   strict ARP configure arp_ignore and arp_announce to avoid answering ARP queries
from kube-ipvs0 interface
   -->
   <p><code>strictARP</code> 字段用来配置 arp_ignore 和 arp_announce，以避免（错误地）响应来自 kube-ipvs0 接口的
   ARP 查询请求。</p>
</td>
</tr>
<tr><td><code>tcpTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   tcpTimeout is the timeout value used for idle IPVS TCP sessions.
The default value is 0, which preserves the current timeout value on the system.
   -->
   <p><code>tcpTimeout</code> 字段是用于设置空闲 IPVS TCP 会话的超时值。
   默认值为 0，意味着使用系统上当前的超时值设置。</p>
</td>
</tr>
<tr><td><code>tcpFinTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   tcpFinTimeout is the timeout value used for IPVS TCP sessions after receiving a FIN.
The default value is 0, which preserves the current timeout value on the system.
   -->
   <p><code>tcpFinTimeout</code> 字段用来设置 IPVS TCP 会话在收到 FIN 之后的超时值。
   默认值为 0，意味着使用系统上当前的超时值设置。</p>
</td>
</tr>
<tr><td><code>udpTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   udpTimeout is the timeout value used for IPVS UDP packets.
The default value is 0, which preserves the current timeout value on the system.
   -->
   <p><code>udpTimeout</code> 字段用来设置 IPVS UDP 包的超时值。
   默认值为 0，意味着使用系统上当前的超时值设置。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyWinkernelConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyWinkernelConfiguration}
    
<!--
**Appears in:**
-->
**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyWinkernelConfiguration contains Windows/HNS settings for
the Kubernetes proxy server.
-->
KubeProxyWinkernelConfiguration 包含 Kubernetes 代理服务器的 Windows/HNS 设置。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>networkName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   networkName is the name of the network kube-proxy will use
to create endpoints and policies
   -->
   <p><code>networkName</code> 字段是 kube-proxy 用来创建端点和策略的网络名称。</p>
</td>
</tr>
<tr><td><code>sourceVip</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
   sourceVip is the IP address of the source VIP endoint used for
NAT when loadbalancing
   -->
   <p><code>sourceVip</code> 字段是执行负载均衡时进行 NAT 转换所使用的源端 VIP 端点 IP 地址。</p>
</td>
</tr>
<tr><td><code>enableDSR</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   enableDSR tells kube-proxy whether HNS policies should be created
with DSR
   -->
   <p><code>enableDSR</code> 字段通知 kube-proxy 是否使用 DSR 来创建 HNS 策略。</p>
</td>
</tr>
<tr><td><code>rootHnsEndpointName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
RootHnsEndpointName is the name of hnsendpoint that is attached to
l2bridge for root network namespace
-->
   <p><code>rootHnsEndpointName</code>
   字段是附加到用于根网络命名空间二层桥接的 hnsendpoint 的名称。</p>
</td>
</tr>
<tr><td><code>forwardHealthCheckVip</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
<!--
ForwardHealthCheckVip forwards service VIP for health check port on
Windows
-->
   <p><code>forwardHealthCheckVip</code>
   字段为 Windows 上的健康检查端口转发服务 VIP。</p>
</td>
</tr>
</tbody>
</table>

## `LocalMode`     {#kubeproxy-config-k8s-io-v1alpha1-LocalMode}

<!--
(Alias of `string`)

**Appears in:**
-->
（<code>string</code> 类型的别名）

**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
LocalMode represents modes to detect local traffic from the node
-->
LocalMode 代表的是对节点上本地流量进行检测的模式。

## `ProxyMode`     {#kubeproxy-config-k8s-io-v1alpha1-ProxyMode}

<!--    
(Alias of `string`)

**Appears in:**
-->

（<code>string</code> 类型的别名）

**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
ProxyMode represents modes used by the Kubernetes proxy server.

Currently, three modes of proxy are available in Linux platform: 'userspace' (older, going to be EOL), 'iptables'
(newer, faster), 'ipvs'(newest, better in performance and scalability).

Two modes of proxy are available in Windows platform: 'userspace'(older, stable) and 'kernelspace' (newer, faster).
-->
ProxyMode 表示的是 Kubernetes 代理服务器所使用的模式。

目前 Linux 平台上有三种可用的代理模式：'userspace'（相对较老，即将被淘汰）、
'iptables'（相对较新，速度较快）、'ipvs'（最新，在性能和可扩缩性上表现好）。

在 Windows 平台上有两种可用的代理模式：'userspace'（相对较老，但稳定）和
'kernelspace'（相对较新，速度更快）。

<!--
In Linux platform, if proxy mode is blank, use the best-available proxy (currently iptables, but may change in the
future). If the iptables proxy is selected, regardless of how, but the system's kernel or iptables versions are
insufficient, this always falls back to the userspace proxy. IPVS mode will be enabled when proxy mode is set to 'ipvs',
and the fall back path is firstly iptables and then userspace.
-->
在 Linux 平台上，如果代理的 mode 为空，则使用可用的最佳代理（目前是 iptables，
将来可能会发生变化）。如果选择的是 iptables 代理（无论原因如何），但系统的内核
或者 iptables 的版本不够高，kube-proxy 也会回退为 userspace 代理服务器所使用的模式。
当代理的 mode 设置为 'ipvs' 时会启用 IPVS 模式，对应的回退路径是先尝试 iptables，
最后回退到 userspace。

<!--
In Windows platform, if proxy mode is blank, use the best-available proxy (currently userspace, but may change in the
future). If winkernel proxy is selected, regardless of how, but the Windows kernel can't support this mode of proxy,
this always falls back to the userspace proxy.
-->
在 Windows 平台上，如果代理 mode 为空，则使用可用的最佳代理（目前是 userspace，
不过将来可能会发生变化）。如果所选择的是 winkernel 代理（无论原因如何），
但 Windows 内核不支持此代理模式，则 kube-proxy 会回退到 userspace 代理。


## `ClientConnectionConfiguration`     {#ClientConnectionConfiguration}
    
<!--
**Appears in:**
-->
**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<!--
ClientConnectionConfiguration contains details for constructing a client.
-->
ClientConnectionConfiguration 包含构造客户端所需要的细节信息。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>kubeconfig</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   kubeconfig is the path to a KubeConfig file.
   -->
   <p><code>kubeconfig</code> 字段是指向一个 KubeConfig 文件的路径。</p>
</td>
</tr>
<tr><td><code>acceptContentTypes</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   acceptContentTypes defines the Accept header sent by clients when connecting to a server, overriding the
default value of 'application/json'. This field will control all connections to the server used by a particular client.
   -->
   <p><code>acceptContentTypes</code> 字段定义客户端在连接到服务器时所发送的 Accept 头部字段。
   此设置值会覆盖默认配置 'application/json'。
   此字段会控制某特定客户端与指定服务器的所有链接。</p>
</td>
</tr>
<tr><td><code>contentType</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   contentType is the content type used when sending data to the server from this client.
   -->
   <p><code>contentType</code> 字段是从此客户端向服务器发送数据时使用的内容类型（Content Type）。</p>
</td>
</tr>
<tr><td><code>qps</code> <B><!--[Required]-->[必需]</B><br/>
<code>float32</code>
</td>
<td>
   <!--
   qps controls the number of queries per second allowed for this connection.
   -->
   <p><code>qps</code> 字段控制此连接上每秒钟可以发送的查询请求个数。</p>
</td>
</tr>
<tr><td><code>burst</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   burst allows extra queries to accumulate when a client is exceeding its rate.
   -->
   <p><code>burst</code> 字段允许客户端超出其速率限制时可以临时累积的额外查询个数。</p>
</td>
</tr>
</tbody>
</table>

## `DebuggingConfiguration`     {#DebuggingConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<!--
DebuggingConfiguration holds configuration for Debugging related features.
-->
DebuggingConfiguration 包含调试相关功能的配置。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>enableProfiling</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
<!--
enableProfiling enables profiling via web interface host:port/debug/pprof/
-->
   <p><code>enableProfiling</code> 字段通过位于 <code>host:port/debug/pprof/</code>
   的 Web 接口启用性能分析。</p>
</td>
</tr>
<tr><td><code>enableContentionProfiling</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
<!--
enableContentionProfiling enables lock contention profiling, if
enableProfiling is true.
-->
   <p><code>enableContentionProfiling</code> 字段在 <code>enableProfiling</code>
   为 true 时允许执行锁竞争分析。</p>
</td>
</tr>
</tbody>
</table>

## `FormatOptions`     {#FormatOptions}
    
<!--
**Appears in:**
-->

<!--
FormatOptions contains options for the different logging formats.
-->
FormatOptions 包含不同日志记录格式的配置选项。


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>json</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
   <!--
   [Experimental] JSON contains options for logging format "json".
   -->
   <p>[实验特性] <code>json</code> 字段包含 &quot;JSON&quot; 日志格式的配置选项。</p>
</td>
</tr>
</tbody>
</table>

## `JSONOptions`     {#JSONOptions}
    
<!--
**Appears in:**
-->
**出现在：**

- [FormatOptions](#FormatOptions)

<!--
JSONOptions contains options for logging format "json".
-->
JSONOptions 包含 &quot;json&quot; 日志格式的配置选项。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>splitStream</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   [Experimental] SplitStream redirects error messages to stderr while
info messages go to stdout, with buffering. The default is to write
both to stdout, without buffering.
   -->
   <p>[实验特性] <code>splitStream</code> 字段将信息类型的信息输出到标准输出，错误信息重定向到标准
   错误输出，并提供缓存。默认行为是将二者都输出到标准输出且不提供缓存。</p>
</td>
</tr>
<tr><td><code>infoBufferSize</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#QuantityValue"><code>k8s.io/apimachinery/pkg/api/resource.QuantityValue</code></a>
</td>
<td>
   <!--
   [Experimental] InfoBufferSize sets the size of the info stream when
using split streams. The default is zero, which disables buffering.
   -->
   <p>[实验特性] <code>infoBufferSize</code> 字段设置在使用分离数据流时 info 数据流的缓冲区大小。
   默认值为 0，意味着不提供缓存。</p>
</td>
</tr>
</tbody>
</table>

## `LeaderElectionConfiguration`     {#LeaderElectionConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<!--
LeaderElectionConfiguration defines the configuration of leader election
clients for components that can run with leader election enabled.
-->
LeaderElectionConfiguration 为能够支持领导者选举的组件定义其领导者选举客户端的配置。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>leaderElect</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
<!--
leaderElect enables a leader election client to gain leadership
before executing the main loop. Enable this when running replicated
components for high availability.
-->
   <p>
   <code>leaderElect</code> 字段允许领导者选举客户端在进入主循环执行之前先获得领导者角色。
   运行多副本组件时启用此功能有助于提高可用性。
   </p>
</td>
</tr>
<tr><td><code>leaseDuration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<!--
leaseDuration is the duration that non-leader candidates will wait
after observing a leadership renewal until attempting to acquire
leadership of a led but unrenewed leader slot. This is effectively the
maximum duration that a leader can be stopped before it is replaced
by another candidate. This is only applicable if leader election is
enabled.
-->
   <p>
   <code>leaseDuration</code> 字段是非领导角色候选者在观察到需要领导席位更新时要等待的时间；
   只有经过所设置时长才可以尝试去获得一个仍处于领导状态但需要被刷新的席位。
   这里的设置值本质上意味着某个领导者在被另一个候选者替换掉之前可以停止运行的最长时长。
   只有当启用了领导者选举时此字段有意义。
   </p>
</td>
</tr>
<tr><td><code>renewDeadline</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<!--
renewDeadline is the interval between attempts by the acting master to
renew a leadership slot before it stops leading. This must be less
than or equal to the lease duration. This is only applicable if leader
election is enabled.
-->
   <p>
   <code>renewDeadline</code> 字段设置的是当前领导者在停止扮演领导角色之前需要刷新领导状态的时间间隔。
   此值必须小于或等于租约期限的长度。只有到启用了领导者选举时此字段才有意义。
   </p>
</td>
</tr>
<tr><td><code>retryPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<!--
retryPeriod is the duration the clients should wait between attempting
acquisition and renewal of a leadership. This is only applicable if
leader election is enabled.
-->
   <p>
   <code>retryPeriod</code> 字段是客户端在连续两次尝试获得或者刷新领导状态之间需要等待的时长。
   只有当启用了领导者选举时此字段才有意义。
   </p>
</td>
</tr>
<tr><td><code>resourceLock</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
resourceLock indicates the resource object type that will be used to lock
during leader election cycles.
-->
   <p><code>resourceLock</code> 字段给出在领导者选举期间要作为锁来使用的资源对象类型。</p>
</td>
</tr>
<tr><td><code>resourceName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
resourceName indicates the name of resource object that will be used to lock
during leader election cycles.
-->
   <p><code>resourceName</code> 字段给出在领导者选举期间要作为锁来使用的资源对象名称。</p>
</td>
</tr>
<tr><td><code>resourceNamespace</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
resourceNamespace indicates the namespace of resource object that will be used to lock
during leader election cycles.
-->
   <p><code>resourceNamespace</code> 字段给出在领导者选举期间要作为锁来使用的资源对象所在名字空间。</p>
</td>
</tr>
</tbody>
</table>

## `LoggingConfiguration`     {#LoggingConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<!--
LoggingConfiguration contains logging options
Refer <a href="https://github.com/kubernetes/component-base/blob/master/logs/options.go">Logs Options</a> for more information.
-->
LoggingConfiguration 包含日志选项。
参考 [Logs Options](https://github.com/kubernetes/component-base/blob/master/logs/options.go) 以了解更多信息。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>format</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
Format Flag specifies the structure of log messages.
default value of format is <code>text</code>
-->
   <p><code>format</code> 字段设置日志消息的结构。默认的格式取值为 <code>text</code>。</p>
</td>
</tr>
<tr><td><code>flushFrequency</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/time#Duration"><code>time.Duration</code></a>
</td>
<td>
<!--
Maximum number of nanoseconds (i.e. 1s = 1000000000) between log
flushes.  Ignored if the selected logging backend writes log
messages without buffering.
-->
   <p>对日志进行清洗的最大间隔纳秒数（例如，1s = 1000000000）。
   如果所选的日志后端在写入日志消息时不提供缓存，则此配置会被忽略。</p>
</td>
</tr>
<tr><td><code>verbosity</code> <B><!--[Required]-->[必需]</B><br/>
<code>uint32</code>
</td>
<td>
<!--
Verbosity is the threshold that determines which log messages are
logged. Default is zero which logs only the most important
messages. Higher values enable additional messages. Error messages
are always logged.
-->
   <p><code>verbosity</code> 字段用来确定日志消息记录的详细程度阈值。
   默认值为 0，意味着仅记录最重要的消息。
   数值越大，额外的消息越多。错误消息总是被记录下来。</p>
</td>
</tr>
<tr><td><code>vmodule</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#VModuleConfiguration"><code>VModuleConfiguration</code></a>
</td>
<td>
<!--
VModule overrides the verbosity threshold for individual files.
Only supported for &quot;text&quot; log format.
-->
   <p><code>vmodule</code> 字段会在单个文件层面重载 verbosity 阈值的设置。
   这一选项仅支持 &quot;text&quot; 日志格式。</p>
</td>
</tr>
<tr><td><code>options</code> <B>[Required]</B><br/>
<a href="#FormatOptions"><code>FormatOptions</code></a>
</td>
<td>
<!--
[Experimental] Options holds additional parameters that are specific
to the different logging formats. Only the options for the selected
format get used, but all of them get validated.
-->
   <p>[实验特性] <code>options</code> 字段中包含特定于不同日志格式的配置参数。
   只有针对所选格式的选项会被使用，但是合法性检查时会查看所有选项配置。</p>
</td>
</tr>
</tbody>
</table>

## `VModuleConfiguration`     {#VModuleConfiguration}
   
<!-- 
(Alias of `[]k8s.io/component-base/config/v1alpha1.VModuleItem`)

**Appears in:**
-->
（`[]k8s.io/component-base/config/v1alpha1.VModuleItem` 的别名）

**出现在：**

- [LoggingConfiguration](#LoggingConfiguration)

<!--
VModuleConfiguration is a collection of individual file names or patterns
and the corresponding verbosity threshold.
-->
VModuleConfiguration 是一组文件名或文件名模式，及其对应的日志详尽程度阈值配置。
