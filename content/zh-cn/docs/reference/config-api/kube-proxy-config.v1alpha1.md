---
title: kube-proxy 配置 (v1alpha1)
content_type: tool-reference
package: kubeproxy.config.k8s.io/v1alpha1
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

## `ClientConnectionConfiguration`     {#ClientConnectionConfiguration}
    
<!--
**Appears in:**
-->
**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

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

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

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
enableContentionProfiling enables block profiling, if
enableProfiling is true.
-->
   <p><code>enableContentionProfiling</code> 字段在 <code>enableProfiling</code>
   为 true 时启用阻塞分析。</p>
</td>
</tr>
</tbody>
</table>


## `LeaderElectionConfiguration`     {#LeaderElectionConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

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
<tr><td><code>clientConnection</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#ClientConnectionConfiguration"><code>ClientConnectionConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   clientConnection specifies the kubeconfig file and client connection settings for the proxy
   server to use when communicating with the apiserver.
   -->
   <code>clientConnection</code> 指定了代理服务器与 apiserver 通信时应使用的 <code>kubeconfig</code> 文件和客户端连接设置。
   </p>
</td>
</tr>
<tr><td><code>logging</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#LoggingConfiguration"><code>LoggingConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   logging specifies the options of logging.
   Refer to <a href="https://github.com/kubernetes/component-base/blob/master/logs/options.go">Logs Options</a>
   for more information.
   -->
   <code>logging</code> 指定了日志记录的选项。有关更多信息，
   请参阅<a href="https://github.com/kubernetes/component-base/blob/master/logs/options.go">日志选项</a>。
   </p>
</td>
</tr>
<tr><td><code>hostnameOverride</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   hostnameOverride, if non-empty, will be used as the name of the Node that
   kube-proxy is running on. If unset, the node name is assumed to be the same as
   the node's hostname.
   -->
   <code>hostnameOverride</code> 如果不为空，将作为 kube-proxy 所运行节点的名称使用。
   如果未设置，则默认使用节点的主机名作为节点名称。
   </p>
</td>
</tr>
<tr><td><code>bindAddress</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   bindAddress can be used to override kube-proxy's idea of what its node's
primary IP is. Note that the name is a historical artifact, and kube-proxy does
not actually bind any sockets to this IP.
   -->
   <p><code>bindAddress</code> 可以用来指定 kube-proxy 所认为的节点主 IP。请注意，
   虽然名称中有绑定的意思，但实际上 kube-proxy 并不会将任何套接字绑定到这个 IP 地址上。
   </p>
</td>
</tr>
<tr><td><code>healthzBindAddress</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   healthzBindAddress is the IP address and port for the health check server to
serve on, defaulting to &quot;0.0.0.0:10256&quot; (if bindAddress is unset or IPv4), or
&quot;[::]:10256&quot; (if bindAddress is IPv6).
   -->
   <p><code>healthzBindAddress</code> 是健康检查服务器的 IP 地址和端口，默认情况下，
   如果 bindAddress 未设置或为 IPv4，则为 "0.0.0.0:10256"；如果 bindAddress 为 IPv6，
   则为 "[::]:10256"。</p>
</td>
</tr>
<tr><td><code>metricsBindAddress</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   metricsBindAddress is the IP address and port for the metrics server to serve
on, defaulting to &quot;127.0.0.1:10249&quot; (if bindAddress is unset or IPv4), or
&quot;[::1]:10249&quot; (if bindAddress is IPv6). (Set to &quot;0.0.0.0:10249&quot; / &quot;[::]:10249&quot;
to bind on all interfaces.)
   -->
   <p><code>metricsBindAddress</code> 是指标服务器监听的 IP 地址和端口，默认情况下，
   如果 bindAddress 未设置或为 IPv4，则为 "127.0.0.1:10249"；
   如果 bindAddress 为 IPv6，则为 "[::1]:10249"。
  （设置为 "0.0.0.0:10249" / "[::]:10249" 以绑定到所有接口。）。</p>
</td>
</tr>
<tr><td><code>bindAddressHardFail</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   bindAddressHardFail, if true, tells kube-proxy to treat failure to bind to a
port as fatal and exit
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
   性能分析处理程序将由指标服务器执行。</p>
</td>
</tr>
<tr><td><code>showHiddenMetricsForVersion</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   showHiddenMetricsForVersion is the version for which you want to show hidden metrics.
   -->
   <p><code>showHiddenMetricsForVersion</code> 用于指定要显示隐藏指标的版本。</p>
</td>
</tr>
<tr><td><code>mode</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-ProxyMode"><code>ProxyMode</code></a>
</td>
<td>
   <!--
   mode specifies which proxy mode to use.
   -->
   <p><code>mode</code> 指定要使用的代理模式。</p>
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
<tr><td><code>nftables</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyNFTablesConfiguration"><code>KubeProxyNFTablesConfiguration</code></a>
</td>
<td>
   <!--
   nftables contains nftables-related configuration options
   -->
   <p><code>nftables</code> 包含与 nftables 相关的配置选项。</p>
</td>
</tr>
<tr><td><code>winkernel</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyWinkernelConfiguration"><code>KubeProxyWinkernelConfiguration</code></a>
</td>
<td>
   <!--
   winkernel contains winkernel-related configuration options.
   -->
   <p><code>winkernel</code> 包含与 winkernel 相关的配置选项。</p>
</td>
</tr>
<tr><td><code>detectLocalMode</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-LocalMode"><code>LocalMode</code></a>
</td>
<td>
   <!--
   detectLocalMode determines mode to use for detecting local traffic, defaults to LocalModeClusterCIDR.
   -->
   <p><code>detectLocalMode</code> 确定用于检测本地流量的模式，默认为 LocalModeClusterCIDR。</p>
</td>
</tr>
<tr><td><code>detectLocal</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-DetectLocalConfiguration"><code>DetectLocalConfiguration</code></a>
</td>
<td>
   <!--
   detectLocal contains optional configuration settings related to DetectLocalMode.
   -->
   <p><code>detectLocal</code> 包含与 DetectLocalMode 相关的可选配置设置。</p>
</td>
</tr>
<tr><td><code>clusterCIDR</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   clusterCIDR is the CIDR range of the pods in the cluster. (For dual-stack
clusters, this can be a comma-separated dual-stack pair of CIDR ranges.). When
DetectLocalMode is set to LocalModeClusterCIDR, kube-proxy will consider
traffic to be local if its source IP is in this range. (Otherwise it is not
used.)
   -->
   <p><code>clusterCIDR</code> 指定集群中 Pod 的 CIDR 范围。
  （对于双栈集群，这个参数可以是一个用逗号分隔的双栈 CIDR 范围对。）
   当 DetectLocalMode 设置为 LocalModeClusterCIDR 时，如果流量的源 IP 在这个范围内，
   kube-proxy 会将其视为本地流量。（否则不会使用此设置。）</p>
</td>
</tr>
<tr><td><code>nodePortAddresses</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   nodePortAddresses is a list of CIDR ranges that contain valid node IPs. If set,
connections to NodePort services will only be accepted on node IPs in one of
the indicated ranges. If unset, NodePort connections will be accepted on all
local IPs.
   -->
   <p><code>nodePortAddresses</code> 是一个包含有效节点 IP 的 CIDR 范围列表。
   如果设置了此项，只有来自这些范围内的节点 IP 的 NodePort 服务连接才会被接受。
   如果未设置，将接受所有本地 IP 的 NodePort 连接。</p>
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
   <p><code>oomScoreAdj</code> 是 kube-proxy 进程的 OOM 评分调整值。该值必须在 [-1000, 1000] 范围内。</p>
</td>
</tr>
<tr><td><code>conntrack</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConntrackConfiguration"><code>KubeProxyConntrackConfiguration</code></a>
</td>
<td>
   <!--
   conntrack contains conntrack-related configuration options.
   -->
   <p><code>conntrack</code> 包含与 conntrack 相关的配置选项。</p>
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
   <p><code>configSyncPeriod</code> 指定从 apiserver 刷新配置的频率，必须大于 0。</p>
</td>
</tr>

<tr><td><code>portRange</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   portRange was previously used to configure the userspace proxy, but is now unused.
   -->
   <p><code>portRange</code> 之前用于配置用户空间代理，但现在已不再使用。</p>
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
bridgeInterface is a bridge interface name. When DetectLocalMode is set to
LocalModeBridgeInterface, kube-proxy will consider traffic to be local if
it originates from this bridge.
-->
   <p><code>bridgeInterface</code> 指的是桥接接口的名称。
   当 DetectLocalMode 设置为 LocalModeBridgeInterface 时，
   如果流量来自这个桥接接口，kube-proxy 会将其视为本地流量。</p>
</td>
</tr>
<tr><td><code>interfaceNamePrefix</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
interfaceNamePrefix is an interface name prefix. When DetectLocalMode is set to
LocalModeInterfaceNamePrefix, kube-proxy will consider traffic to be local if
it originates from any interface whose name begins with this prefix.
-->
   <p><code>interfaceNamePrefix</code> 是接口名称的前缀。
   当 DetectLocalMode 设置为 LocalModeInterfaceNamePrefix 时，
   如果流量来自任何名称以该前缀开头的接口，kube-proxy 会将其视为本地流量。</p>
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
regardless of maxPerCore (set maxPerCore=0 to leave the limit as-is).
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
<tr><td><code>tcpBeLiberal</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   tcpBeLiberal, if true, kube-proxy will configure conntrack
to run in liberal mode for TCP connections and packets with
out-of-window sequence numbers won't be marked INVALID.
   -->
   <p><code>tcpBeLiberal</code> 如果设置为 true，
   kube-proxy 将配置 conntrack 以宽松模式运行，
   对于 TCP 连接和超出窗口序列号的报文不会被标记为 INVALID。</p>
</td>
</tr>
<tr><td><code>udpTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   udpTimeout is how long an idle UDP conntrack entry in
UNREPLIED state will remain in the conntrack table
(e.g. '30s'). Must be greater than 0 to set.
   -->
   <p><code>udpTimeout</code> 指定处于 UNREPLIED 状态的空闲 UDP conntrack 条目在 conntrack 表中保留的时间
  （例如 '30s'）。该值必须大于 0。</p>
</td>
</tr>
<tr><td><code>udpStreamTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   udpStreamTimeout is how long an idle UDP conntrack entry in
ASSURED state will remain in the conntrack table
(e.g. '300s'). Must be greater than 0 to set.
   -->
   <p><code>udpStreamTimeout</code> 指定处于 ASSURED 状态的空闲 UDP conntrack 条目在 conntrack 表中保留的时间
  （例如 '300s'）。该值必须大于 0。</p>
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
the iptables or ipvs proxy mode. Values must be within the range [0, 31].
   -->
   <p><code>masqueradeBit</code> 字段是 iptables fwmark 空间中的具体一位，
   用来在 iptables 或 ipvs 代理模式下设置 SNAT。此值必须介于 [0, 31]（含边界值）。</p>
</td>
</tr>
<tr><td><code>masqueradeAll</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   masqueradeAll tells kube-proxy to SNAT all traffic sent to Service cluster IPs,
when using the iptables or ipvs proxy mode. This may be required with some CNI
plugins.
   -->
   <p><code>masqueradeAll</code> 字段用来通知 kube-proxy
   在使用 iptables 或 ipvs 代理模式时对所有流量执行 SNAT 操作。这在某些 CNI 插件中可能是必需的。</p>
</td>
</tr>
<tr><td><code>localhostNodePorts</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--localhostNodePorts, if false, tells kube-proxy to disable the legacy behavior
of allowing NodePort services to be accessed via localhost. (Applies only to
iptables mode and IPv4; localhost NodePorts are never allowed with other proxy
modes or with IPv6.)-->
   <p><code>localhostNodePorts</code> 如果设置为 false，
   则会通知 kube-proxy 禁用通过本地主机访问 NodePort 服务的旧有行为。
  （仅适用于 iptables 模式和 IPv4；在其他代理模式或 IPv6 下，不允许本地主机访问 NodePort 服务。）</p>
</td>
</tr>
<tr><td><code>syncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   syncPeriod is an interval (e.g. '5s', '1m', '2h22m') indicating how frequently
various re-synchronizing and cleanup operations are performed. Must be greater
than 0.
   -->
   <p><code>syncPeriod</code> 是时间间隔（例如 '5s'、'1m'、'2h22m'），
   指示各种重新同步和清理操作的执行频率。该值必须大于 0。</p>
</td>
</tr>
<tr><td><code>minSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   minSyncPeriod is the minimum period between iptables rule resyncs (e.g. '5s',
'1m', '2h22m'). A value of 0 means every Service or EndpointSlice change will
result in an immediate iptables resync.
   -->
   <p><code>minSyncPeriod</code> 是 iptables 规则重新同步的最小时间间隔（例如 '5s'、'1m'、'2h22m'）。
   如果值为 0，表示每次服务或 EndpointSlice 发生变化时都会立即重新同步 iptables。</p>
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
   syncPeriod is an interval (e.g. '5s', '1m', '2h22m') indicating how frequently
various re-synchronizing and cleanup operations are performed. Must be greater
than 0.
   -->
   <p><code>syncPeriod</code> 是各种重新同步和清理操作执行频率的时间间隔（例如 '5s', '1m', '2h22m'）。
   该值必须大于 0</p>
</td>
</tr>
<tr><td><code>minSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   mminSyncPeriod is the minimum period between IPVS rule resyncs (e.g. '5s', '1m',
'2h22m'). A value of 0 means every Service or EndpointSlice change will result
in an immediate IPVS resync.
   -->
   <p><code>minSyncPeriod</code> 是 IPVS 规则重新同步之间的最小时间间隔（例如 '5s', '1m', '2h22m'）。
   值为 0 表示每次服务或 EndpointSlice 发生变化时都会立即触发 IPVS 重新同步。</p>
</td>
</tr>
<tr><td><code>scheduler</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   scheduler is the IPVS scheduler to use
   -->
   <p><code>scheduler</code> 是用于 IPVS 的调度器。</p>
</td>
</tr>
<tr><td><code>excludeCIDRs</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   excludeCIDRs is a list of CIDRs which the ipvs proxier should not touch
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
   strictARP configures arp_ignore and arp_announce to avoid answering ARP queries
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

## `KubeProxyNFTablesConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyNFTablesConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyNFTablesConfiguration contains nftables-related configuration
+details for the Kubernetes proxy server.
-->
<p>KubeProxyNFTablesConfiguration 包含 Kubernetes 代理服务器的 nftables 相关配置详细信息。</p>

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>

<tr><td><code>masqueradeBit</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   masqueradeBit is the bit of the iptables fwmark space to use for SNAT if using
the nftables proxy mode. Values must be within the range [0, 31].
   -->
   <p><code>masqueradeBit</code> 字段是 iptables fwmark 空间中的具体一位，
   用来在 nftables 代理模式下设置 SNAT。此值必须介于 [0, 31]（含边界值）。</p>
</td>
</tr>
<tr><td><code>masqueradeAll</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   masqueradeAll tells kube-proxy to SNAT all traffic sent to Service cluster IPs,
when using the nftables mode. This may be required with some CNI plugins.
   -->
   <p><code>masqueradeAll</code> 通知 kube-proxy 在使用 nftables 模式时，
   对发送到服务集群 IP 的所有流量执行 SNAT。这在某些 CNI 插件中可能是必需的。</p>
</td>
</tr>
<tr><td><code>syncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   syncPeriod is an interval (e.g. '5s', '1m', '2h22m') indicating how frequently
various re-synchronizing and cleanup operations are performed. Must be greater
than 0.
   -->
   <p><code>syncPeriod</code> 表示各种重新同步和清理操作执行频率的时间间隔（例如 '5s', '1m', '2h22m'）。
   该值必须大于 0。</p>
</td>
</tr>
<tr><td><code>minSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   minSyncPeriod is the minimum period between iptables rule resyncs (e.g. '5s',
'1m', '2h22m'). A value of 0 means every Service or EndpointSlice change will
result in an immediate iptables resync.
   -->
   <p><code>minSyncPeriod</code>是 iptables 规则重新同步之间的最小时间间隔（例如 '5s', '1m', '2h22m'）。
   值为 0 时，表示每次服务或 EndpointSlice 发生变化时都会立即重新同步 iptables。</p>
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
   sourceVip is the IP address of the source VIP endpoint used for
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
rootHnsEndpointName is the name of hnsendpoint that is attached to
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
forwardHealthCheckVip forwards service VIP for health check port on
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

Currently, two modes of proxy are available on Linux platforms: 'iptables' and 'ipvs'.
One mode of proxy is available on Windows platforms: 'kernelspace'.
-->
<p>ProxyMode 表示的是 Kubernetes 代理服务器所使用的模式。</p>

<p>目前 Linux 平台上有两种可用的代理模式：'iptables' 和 'ipvs'。
在 Windows 平台上可用的一种代理模式是：'kernelspace'。</p>

<!--
If the proxy mode is unspecified, the best-available proxy mode will be used (currently this
is <code>iptables</code> on Linux and <code>kernelspace</code> on Windows). If the selected proxy mode cannot be
used (due to lack of kernel support, missing userspace components, etc) then kube-proxy
will exit with an error.
-->
<p>如果代理模式未被指定，将使用最佳可用的代理模式（目前在 Linux 上是 <code>iptables</code>，在 Windows 上是 <code>kernelspace</code>）。
如果不能使用选定的代理模式（由于缺少内核支持、缺少用户空间组件等），则 kube-proxy 将出错并退出。</p>
