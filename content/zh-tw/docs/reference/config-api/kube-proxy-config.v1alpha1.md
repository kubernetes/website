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
## 資源型別    {#resource-types}

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

## `KubeProxyConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration}

<!--
KubeProxyConfiguration contains everything necessary to configure the
Kubernetes proxy server.
-->
KubeProxyConfiguration 包含用來配置 Kubernetes 代理伺服器的所有配置資訊。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
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
   <p><code>featureGates</code> 欄位是一個功能特性名稱到布林值的對映表，
   用來啟用或者禁用測試性質的功能特性。</p>
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
   <p><code>bindAddress</code> 欄位是代理伺服器提供服務時所用 IP 地址（設定為 0.0.0.0
時意味著在所有網路介面上提供服務）。</p>
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
   <p><code>healthzBindAddress</code> 欄位是健康狀態檢查伺服器提供服務時所使用的的 IP 地址和埠，
   預設設定為 '0.0.0.0:10256'。</p>
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
   <p><code>metricsBindAddress</code> 欄位是度量值伺服器提供服務時所使用的的 IP 地址和埠，
   預設設定為 '127.0.0.1:10249'（設定為 0.0.0.0 意味著在所有介面上提供服務）。</p>
</td>
</tr>
<tr><td><code>bindAddressHardFail</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   bindAddressHardFail, if true, kube-proxy will treat failure to bind to a port as fatal and exit
   -->
   <p><code>bindAddressHardFail</code> 欄位設定為 true 時，
   kube-proxy 將無法繫結到某埠這類問題視為致命錯誤並直接退出。</p>
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
   <p><code>enableProfiling</code> 欄位透過 '/debug/pprof' 處理程式在 Web 介面上啟用效能分析。
   效能分析處理程式將由度量值伺服器執行。</p>
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
   <p><code>clusterCIDR</code> 欄位是叢集中 Pods 所使用的 CIDR 範圍。
   這一地址範圍用於對來自叢集外的請求流量進行橋接。
   如果未設定，則 kube-proxy 不會對非叢集內部的流量做橋接。</p>
</td>
</tr>
<tr><td><code>hostnameOverride</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   hostnameOverride, if non-empty, will be used as the identity instead of the actual hostname.
   -->
   <p><code>hostnameOverride</code> 欄位非空時，
   所給的字串（而不是實際的主機名）將被用作 kube-proxy 的標識。</p>
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
   <p><code>clientConnection</code> 欄位給出代理伺服器與 API
   伺服器通訊時要使用的 kubeconfig 檔案和客戶端連結設定。</p>
</td>
</tr>
<tr><td><code>iptables</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration"><code>KubeProxyIPTablesConfiguration</code></a>
</td>
<td>
   <!--
   iptables contains iptables-related configuration options.
   -->
   <p><code>iptables</code> 欄位欄位包含與 iptables 相關的配置選項。</p>
</td>
</tr>
<tr><td><code>ipvs</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration"><code>KubeProxyIPVSConfiguration</code></a>
</td>
<td>
   <!--
   ipvs contains ipvs-related configuration options.
   -->
   <p><code>ipvs</code> 欄位中包含與 ipvs 相關的配置選項。</p>
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
   <p><code>oomScoreAdj</code> 欄位是為 kube-proxy 程序所設定的 oom-score-adj 值。
   此設定值必須介於 [-1000, 1000] 範圍內。</p>
</td>
</tr>
<tr><td><code>mode</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-ProxyMode"><code>ProxyMode</code></a>
</td>
<td>
   <!--
   mode specifies which proxy mode to use.
   -->
   <p><code>mode</code> 欄位用來設定將使用的代理模式。</p>
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
   <p><code>portRange</code> 欄位是主機埠的範圍，形式為 ‘beginPort-endPort’（包含邊界），
   用來設定代理服務所使用的埠。如果未指定（即‘0-0’），則代理服務會隨機選擇埠號。</p>
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
   <p><code>udpIdleTimeout</code> 欄位用來設定 UDP 連結保持活躍的時長（例如，'250ms'、'2s'）。
   此值必須大於 0。此欄位僅適用於 mode 值為 'userspace' 的場合。</p>
</td>
</tr>
<tr><td><code>conntrack</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConntrackConfiguration"><code>KubeProxyConntrackConfiguration</code></a>
</td>
<td>
   <!--
   conntrack contains conntrack-related configuration options.
   -->
   <p><code>conntrack</code> 欄位包含與 conntrack 相關的配置選項。</p>
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
   <p><code>configSyncPeriod</code> 欄位是從 API 伺服器重新整理配置的頻率。此值必須大於 0。</p>
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
   <p><code>nodePortAddresses</code> 欄位是 kube-proxy 程序的
   <code>--nodeport-addresses</code> 命令列引數設定。
   此值必須是合法的 IP 段。所給的 IP 段會作為引數來選擇 NodePort 型別服務所使用的介面。
   如果有人希望將本地主機（Localhost）上的服務暴露給本地訪問，同時暴露在某些其他網路介面上
   以實現某種目標，可以使用 IP 段的列表。
   如果此值被設定為 &quot;127.0.0.0/8&quot;，則 kube-proxy 將僅為 NodePort
   服務選擇本地迴路（loopback）介面。
   如果此值被設定為非零的 IP 段，則 kube-proxy 會對 IP 作過濾，僅使用適用於當前節點的 IP 地址。
   空的字串列表意味著選擇所有網路介面。</p>
</td>
</tr>
<tr><td><code>winkernel</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyWinkernelConfiguration"><code>KubeProxyWinkernelConfiguration</code></a>
</td>
<td>
   <!--
   winkernel contains winkernel-related configuration options.
   -->
   <p><code>winkernel</code> 欄位包含與 winkernel 相關的配置選項。</p>
</td>
</tr>
<tr><td><code>showHiddenMetricsForVersion</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   ShowHiddenMetricsForVersion is the version for which you want to show hidden metrics.
   -->
   <p><code>showHiddenMetricsForVersion</code> 欄位給出的是一個 Kubernetes 版本號字串，
   用來設定你希望顯示隱藏度量值的版本。</p>
</td>
</tr>
<tr><td><code>detectLocalMode</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-LocalMode"><code>LocalMode</code></a>
</td>
<td>
   <!--
   DetectLocalMode determines mode to use for detecting local traffic, defaults to LocalModeClusterCIDR
   -->
   <p><code>detectLocalMode</code> 欄位用來確定檢測本地流量的方式，預設為 LocalModeClusterCIDR。</p>
</td>
</tr>
<tr><td><code>detectLocal</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-DetectLocalConfiguration"><code>DetectLocalConfiguration</code></a>
</td>
<td>
<!--
DetectLocal contains optional configuration settings related to DetectLocalMode.
-->
   <p><code>detectLocal</code> 欄位包含與 DetectLocalMode 相關的可選配置設定。</p>
</td>
</tr>
</tbody>
</table>

## `DetectLocalConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-DetectLocalConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
DetectLocalConfiguration contains optional settings related to DetectLocalMode option
-->
DetectLocalConfiguration 包含與 DetectLocalMode 選項相關的可選設定。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
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
   <p><code>bridgeInterface</code> 欄位是一個表示單個橋接介面名稱的字串引數。
   Kube-proxy 將來自這個給定橋接介面的流量視為本地流量。
   如果 DetectLocalMode 設定為 LocalModeBridgeInterface，則應設定該引數。</p>
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
   <p><code>interfaceNamePrefix</code> 欄位是一個表示單個介面字首名稱的字串引數。
   Kube-proxy 將來自一個或多個與給定字首匹配的介面流量視為本地流量。
   如果 DetectLocalMode 設定為 LocalModeInterfaceNamePrefix，則應設定該引數。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyConntrackConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConntrackConfiguration}
    
<!--
**Appears in:**
-->
**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyConntrackConfiguration contains conntrack settings for
the Kubernetes proxy server.
-->
KubeProxyConntrackConfiguration 包含為 Kubernetes 代理伺服器提供的 conntrack 設定。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>maxPerCore</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   maxPerCore is the maximum number of NAT connections to track
per CPU core (0 to leave the limit as-is and ignore min).
   -->
   <p><code>maxPerCore</code> 欄位是每個 CPU 核所跟蹤的 NAT 連結個數上限
   （0 意味著保留當前上限限制並忽略 min 欄位設定值）。</p>
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
   <p><code>min</code> 欄位給出要分配的連結跟蹤記錄個數下限。
   設定此值時會忽略 maxPerCore 的值（將 maxPerCore 設定為 0 時不會調整上限值）。</p>
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
   <p><code>tcpEstablishedTimeout</code> 欄位給出空閒 TCP 連線的保留時間（例如，'2s'）。
   此值必須大於 0。</p>
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
   <p><code>tcpCloseWaitTimeout</code> 欄位用來設定空閒的、處於 CLOSE_WAIT 狀態的 conntrack 條目
   保留在 conntrack 表中的時間長度（例如，'60s'）。
   此設定值必須大於 0。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyIPTablesConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration}
    
<!--
**Appears in:**
-->
**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyIPTablesConfiguration contains iptables-related configuration
details for the Kubernetes proxy server.
-->
KubeProxyIPTablesConfiguration 包含用於 Kubernetes 代理伺服器的、與 iptables 相關的配置細節。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>masqueradeBit</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   masqueradeBit is the bit of the iptables fwmark space to use for SNAT if using
the pure iptables proxy mode. Values must be within the range [0, 31].
   -->
   <p><code>masqueradeBit</code> 欄位是 iptables fwmark 空間中的具體一位，
   用來在純 iptables 代理模式下設定 SNAT。此值必須介於 [0, 31]（含邊界值）。</p>
</td>
</tr>
<tr><td><code>masqueradeAll</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   masqueradeAll tells kube-proxy to SNAT everything if using the pure iptables proxy mode.
   -->
   <p><code>masqueradeAll</code> 欄位用來通知 kube-proxy
   在使用純 iptables 代理模式時對所有流量執行 SNAT 操作。</p>
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
   <p><code>syncPeriod</code> 欄位給出 iptables
   規則的重新整理週期（例如，'5s'、'1m'、'2h22m'）。此值必須大於 0。</p>
</td>
</tr>
<tr><td><code>minSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   minSyncPeriod is the minimum period that iptables rules are refreshed (e.g. '5s', '1m', '2h22m').
   -->
   <p><code>minSyncPeriod</code> 欄位給出 iptables
   規則被重新整理的最小週期（例如，'5s'、'1m'、'2h22m'）。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyIPVSConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration}
    
<!--
**Appears in:**
-->
**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyIPVSConfiguration contains ipvs-related configuration
details for the Kubernetes proxy server.
-->
KubeProxyIPVSConfiguration 包含用於 Kubernetes 代理伺服器的、與 ipvs 相關的配置細節。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
 
<tr><td><code>syncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   syncPeriod is the period that ipvs rules are refreshed (e.g. '5s', '1m',
'2h22m').  Must be greater than 0.
   -->
   <p><code>syncPeriod</code> 欄位給出 ipvs 規則的重新整理週期（例如，'5s'、'1m'、'2h22m'）。
   此值必須大於 0。</p>
</td>
</tr>
<tr><td><code>minSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   minSyncPeriod is the minimum period that ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').
   -->
   <p><code>minSyncPeriod</code> 欄位給出 ipvs 規則被重新整理的最小週期（例如，'5s'、'1m'、'2h22m'）。</p>
</td>
</tr>
<tr><td><code>scheduler</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   ipvs scheduler
   -->
   <p>IPVS 排程器。</p>
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
   <p><code>excludeCIDRs</code> 欄位取值為一個 CIDR 列表，ipvs 代理程式在清理 IPVS 服務時不應觸碰這些 IP 地址。</p>
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
   <p><code>strictARP</code> 欄位用來配置 arp_ignore 和 arp_announce，以避免（錯誤地）響應來自 kube-ipvs0 介面的
   ARP 查詢請求。</p>
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
   <p><code>tcpTimeout</code> 欄位是用於設定空閒 IPVS TCP 會話的超時值。
   預設值為 0，意味著使用系統上當前的超時值設定。</p>
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
   <p><code>tcpFinTimeout</code> 欄位用來設定 IPVS TCP 會話在收到 FIN 之後的超時值。
   預設值為 0，意味著使用系統上當前的超時值設定。</p>
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
   <p><code>udpTimeout</code> 欄位用來設定 IPVS UDP 包的超時值。
   預設值為 0，意味著使用系統上當前的超時值設定。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyWinkernelConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyWinkernelConfiguration}
    
<!--
**Appears in:**
-->
**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyWinkernelConfiguration contains Windows/HNS settings for
the Kubernetes proxy server.
-->
KubeProxyWinkernelConfiguration 包含 Kubernetes 代理伺服器的 Windows/HNS 設定。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>networkName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   networkName is the name of the network kube-proxy will use
to create endpoints and policies
   -->
   <p><code>networkName</code> 欄位是 kube-proxy 用來建立端點和策略的網路名稱。</p>
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
   <p><code>sourceVip</code> 欄位是執行負載均衡時進行 NAT 轉換所使用的源端 VIP 端點 IP 地址。</p>
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
   <p><code>enableDSR</code> 欄位通知 kube-proxy 是否使用 DSR 來建立 HNS 策略。</p>
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
   欄位是附加到用於根網路名稱空間二層橋接的 hnsendpoint 的名稱。</p>
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
   欄位為 Windows 上的健康檢查埠轉發服務 VIP。</p>
</td>
</tr>
</tbody>
</table>

## `LocalMode`     {#kubeproxy-config-k8s-io-v1alpha1-LocalMode}

<!--
(Alias of `string`)

**Appears in:**
-->
（<code>string</code> 型別的別名）

**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
LocalMode represents modes to detect local traffic from the node
-->
LocalMode 代表的是對節點上本地流量進行檢測的模式。

## `ProxyMode`     {#kubeproxy-config-k8s-io-v1alpha1-ProxyMode}

<!--    
(Alias of `string`)

**Appears in:**
-->

（<code>string</code> 型別的別名）

**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
ProxyMode represents modes used by the Kubernetes proxy server.

Currently, three modes of proxy are available in Linux platform: 'userspace' (older, going to be EOL), 'iptables'
(newer, faster), 'ipvs'(newest, better in performance and scalability).

Two modes of proxy are available in Windows platform: 'userspace'(older, stable) and 'kernelspace' (newer, faster).
-->
ProxyMode 表示的是 Kubernetes 代理伺服器所使用的模式。

目前 Linux 平臺上有三種可用的代理模式：'userspace'（相對較老，即將被淘汰）、
'iptables'（相對較新，速度較快）、'ipvs'（最新，在效能和可擴縮性上表現好）。

在 Windows 平臺上有兩種可用的代理模式：'userspace'（相對較老，但穩定）和
'kernelspace'（相對較新，速度更快）。

<!--
In Linux platform, if proxy mode is blank, use the best-available proxy (currently iptables, but may change in the
future). If the iptables proxy is selected, regardless of how, but the system's kernel or iptables versions are
insufficient, this always falls back to the userspace proxy. IPVS mode will be enabled when proxy mode is set to 'ipvs',
and the fall back path is firstly iptables and then userspace.
-->
在 Linux 平臺上，如果代理的 mode 為空，則使用可用的最佳代理（目前是 iptables，
將來可能會發生變化）。如果選擇的是 iptables 代理（無論原因如何），但系統的核心
或者 iptables 的版本不夠高，kube-proxy 也會回退為 userspace 代理伺服器所使用的模式。
當代理的 mode 設定為 'ipvs' 時會啟用 IPVS 模式，對應的回退路徑是先嚐試 iptables，
最後回退到 userspace。

<!--
In Windows platform, if proxy mode is blank, use the best-available proxy (currently userspace, but may change in the
future). If winkernel proxy is selected, regardless of how, but the Windows kernel can't support this mode of proxy,
this always falls back to the userspace proxy.
-->
在 Windows 平臺上，如果代理 mode 為空，則使用可用的最佳代理（目前是 userspace，
不過將來可能會發生變化）。如果所選擇的是 winkernel 代理（無論原因如何），
但 Windows 核心不支援此代理模式，則 kube-proxy 會回退到 userspace 代理。


## `ClientConnectionConfiguration`     {#ClientConnectionConfiguration}
    
<!--
**Appears in:**
-->
**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<!--
ClientConnectionConfiguration contains details for constructing a client.
-->
ClientConnectionConfiguration 包含構造客戶端所需要的細節資訊。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>kubeconfig</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   kubeconfig is the path to a KubeConfig file.
   -->
   <p><code>kubeconfig</code> 欄位是指向一個 KubeConfig 檔案的路徑。</p>
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
   <p><code>acceptContentTypes</code> 欄位定義客戶端在連線到伺服器時所傳送的 Accept 頭部欄位。
   此設定值會覆蓋預設配置 'application/json'。
   此欄位會控制某特定客戶端與指定伺服器的所有連結。</p>
</td>
</tr>
<tr><td><code>contentType</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   contentType is the content type used when sending data to the server from this client.
   -->
   <p><code>contentType</code> 欄位是從此客戶端向伺服器傳送資料時使用的內容型別（Content Type）。</p>
</td>
</tr>
<tr><td><code>qps</code> <B><!--[Required]-->[必需]</B><br/>
<code>float32</code>
</td>
<td>
   <!--
   qps controls the number of queries per second allowed for this connection.
   -->
   <p><code>qps</code> 欄位控制此連線上每秒鐘可以傳送的查詢請求個數。</p>
</td>
</tr>
<tr><td><code>burst</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   burst allows extra queries to accumulate when a client is exceeding its rate.
   -->
   <p><code>burst</code> 欄位允許客戶端超出其速率限制時可以臨時累積的額外查詢個數。</p>
</td>
</tr>
</tbody>
</table>

## `DebuggingConfiguration`     {#DebuggingConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<!--
DebuggingConfiguration holds configuration for Debugging related features.
-->
DebuggingConfiguration 包含除錯相關功能的配置。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>enableProfiling</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
<!--
enableProfiling enables profiling via web interface host:port/debug/pprof/
-->
   <p><code>enableProfiling</code> 欄位透過位於 <code>host:port/debug/pprof/</code>
   的 Web 介面啟用效能分析。</p>
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
   <p><code>enableContentionProfiling</code> 欄位在 <code>enableProfiling</code>
   為 true 時允許執行鎖競爭分析。</p>
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
FormatOptions 包含不同日誌記錄格式的配置選項。


<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>json</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
   <!--
   [Experimental] JSON contains options for logging format "json".
   -->
   <p>[實驗特性] <code>json</code> 欄位包含 &quot;JSON&quot; 日誌格式的配置選項。</p>
</td>
</tr>
</tbody>
</table>

## `JSONOptions`     {#JSONOptions}
    
<!--
**Appears in:**
-->
**出現在：**

- [FormatOptions](#FormatOptions)

<!--
JSONOptions contains options for logging format "json".
-->
JSONOptions 包含 &quot;json&quot; 日誌格式的配置選項。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
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
   <p>[實驗特性] <code>splitStream</code> 欄位將資訊型別的資訊輸出到標準輸出，錯誤資訊重定向到標準
   錯誤輸出，並提供快取。預設行為是將二者都輸出到標準輸出且不提供快取。</p>
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
   <p>[實驗特性] <code>infoBufferSize</code> 欄位設定在使用分離資料流時 info 資料流的緩衝區大小。
   預設值為 0，意味著不提供快取。</p>
</td>
</tr>
</tbody>
</table>

## `LeaderElectionConfiguration`     {#LeaderElectionConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<!--
LeaderElectionConfiguration defines the configuration of leader election
clients for components that can run with leader election enabled.
-->
LeaderElectionConfiguration 為能夠支援領導者選舉的元件定義其領導者選舉客戶端的配置。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
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
   <code>leaderElect</code> 欄位允許領導者選舉客戶端在進入主迴圈執行之前先獲得領導者角色。
   執行多副本元件時啟用此功能有助於提高可用性。
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
   <code>leaseDuration</code> 欄位是非領導角色候選者在觀察到需要領導席位更新時要等待的時間；
   只有經過所設定時長才可以嘗試去獲得一個仍處於領導狀態但需要被重新整理的席位。
   這裡的設定值本質上意味著某個領導者在被另一個候選者替換掉之前可以停止執行的最長時長。
   只有當啟用了領導者選舉時此欄位有意義。
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
   <code>renewDeadline</code> 欄位設定的是當前領導者在停止扮演領導角色之前需要重新整理領導狀態的時間間隔。
   此值必須小於或等於租約期限的長度。只有到啟用了領導者選舉時此欄位才有意義。
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
   <code>retryPeriod</code> 欄位是客戶端在連續兩次嘗試獲得或者重新整理領導狀態之間需要等待的時長。
   只有當啟用了領導者選舉時此欄位才有意義。
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
   <p><code>resourceLock</code> 欄位給出在領導者選舉期間要作為鎖來使用的資源物件型別。</p>
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
   <p><code>resourceName</code> 欄位給出在領導者選舉期間要作為鎖來使用的資源物件名稱。</p>
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
   <p><code>resourceNamespace</code> 欄位給出在領導者選舉期間要作為鎖來使用的資源物件所在名字空間。</p>
</td>
</tr>
</tbody>
</table>

## `LoggingConfiguration`     {#LoggingConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<!--
LoggingConfiguration contains logging options
Refer <a href="https://github.com/kubernetes/component-base/blob/master/logs/options.go">Logs Options</a> for more information.
-->
LoggingConfiguration 包含日誌選項。
參考 [Logs Options](https://github.com/kubernetes/component-base/blob/master/logs/options.go) 以瞭解更多資訊。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>format</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
Format Flag specifies the structure of log messages.
default value of format is <code>text</code>
-->
   <p><code>format</code> 欄位設定日誌訊息的結構。預設的格式取值為 <code>text</code>。</p>
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
   <p>對日誌進行清洗的最大間隔納秒數（例如，1s = 1000000000）。
   如果所選的日誌後端在寫入日誌訊息時不提供快取，則此配置會被忽略。</p>
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
   <p><code>verbosity</code> 欄位用來確定日誌訊息記錄的詳細程度閾值。
   預設值為 0，意味著僅記錄最重要的訊息。
   數值越大，額外的訊息越多。錯誤訊息總是被記錄下來。</p>
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
   <p><code>vmodule</code> 欄位會在單個檔案層面過載 verbosity 閾值的設定。
   這一選項僅支援 &quot;text&quot; 日誌格式。</p>
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
   <p>[實驗特性] <code>options</code> 欄位中包含特定於不同日誌格式的配置引數。
   只有針對所選格式的選項會被使用，但是合法性檢查時會檢視所有選項配置。</p>
</td>
</tr>
</tbody>
</table>

## `VModuleConfiguration`     {#VModuleConfiguration}
   
<!-- 
(Alias of `[]k8s.io/component-base/config/v1alpha1.VModuleItem`)

**Appears in:**
-->
（`[]k8s.io/component-base/config/v1alpha1.VModuleItem` 的別名）

**出現在：**

- [LoggingConfiguration](#LoggingConfiguration)

<!--
VModuleConfiguration is a collection of individual file names or patterns
and the corresponding verbosity threshold.
-->
VModuleConfiguration 是一組檔名或檔名模式，及其對應的日誌詳盡程度閾值配置。
