---
title: kube-proxy 設定 (v1alpha1)
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
## 資源類型    {#resource-types}

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

## `FormatOptions`     {#FormatOptions}

<!--
**Appears in:**
-->
**出現在：**

- [LoggingConfiguration](#LoggingConfiguration)

<p>
<!--
FormatOptions contains options for the different logging formats.
-->
`FormatOptions` 包含不同日誌格式的選項。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>text</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#TextOptions"><code>TextOptions</code></a>
</td>
<td>
<p>
<!--
[Alpha] Text contains options for logging format &quot;text&quot;.
Only available when the LoggingAlphaOptions feature gate is enabled.
-->
[Alpha] text 包含日誌格式 &quot;text&quot; 的選項。
僅在啓用了 `LoggingAlphaOptions` 特性門控時可用。
</p>
</td>
</tr>
<tr><td><code>json</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
<p>
<!--
[Alpha] JSON contains options for logging format &quot;json&quot;.
Only available when the LoggingAlphaOptions feature gate is enabled.
-->
[Alpha] JSON 包含日誌格式 &quot;json&quot; 的選項。
僅在啓用了 `LoggingAlphaOptions` 特性門控時可用。
</p>
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

<p>
<!--
JSONOptions contains options for logging format &quot;json&quot;.
-->
`JSONOptions` 包含日誌格式 &quot;json&quot; 的選項。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>


<tr><td><code>OutputRoutingOptions</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#OutputRoutingOptions"><code>OutputRoutingOptions</code></a>
</td>
<td>
<!--
(Members of <code>OutputRoutingOptions</code> are embedded into this type.)
-->
（<code>OutputRoutingOptions</code> 的成員嵌入到此類型中。）
<span class="text-muted">
<!--
No description provided.
-->
未提供描述。
</span></td>
</tr>
</tbody>
</table>

## `LogFormatFactory`     {#LogFormatFactory}

<p>
<!--
LogFormatFactory provides support for a certain additional,
non-default log format.
-->
`LogFormatFactory` 提供對某種額外的、非預設日誌格式的支持。
</p>

## `LoggingConfiguration`     {#LoggingConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<p>
<!--
LoggingConfiguration contains logging options.
-->
`LoggingConfiguration` 包含日誌記錄選項。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>format</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
Format Flag specifies the structure of log messages.
default value of format is <code>text</code>
-->
`format` 標誌指定日誌消息的結構。
格式的預設值是 <code>text</code>。
</p>
</td>
</tr>
<tr><td><code>flushFrequency</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#TimeOrMetaDuration"><code>TimeOrMetaDuration</code></a>
</td>
<td>
<p>
<!--
Maximum time between log flushes.
If a string, parsed as a duration (i.e. &quot;1s&quot;)
If an int, the maximum number of nanoseconds (i.e. 1s = 1000000000).
Ignored if the selected logging backend writes log messages without buffering.
-->
指定兩次日誌清洗之間的最大時間：

- 如果是字符串，則被解析爲持續時間（例如 &quot;1s&quot;）。
- 如果是整數，則表示最大納秒數（例如 1s = 1000000000）。

如果選擇的日誌後端在寫入日誌消息時不進行緩衝，則此設置將被忽略。
</p>
</td>
</tr>
<tr><td><code>verbosity</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#VerbosityLevel"><code>VerbosityLevel</code></a>
</td>
<td>
<p>
<!--
Verbosity is the threshold that determines which log messages are
logged. Default is zero which logs only the most important
messages. Higher values enable additional messages. Error messages
are always logged.
-->
verbosity 是決定哪些日誌消息會被記錄的閾值。
預設值爲零，僅記錄最重要的消息。更高的值會啓用額外的消息記錄。錯誤消息始終會被記錄。
</p>
</td>
</tr>
<tr><td><code>vmodule</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#VModuleConfiguration"><code>VModuleConfiguration</code></a>
</td>
<td>
<p>
<!--
VModule overrides the verbosity threshold for individual files.
Only supported for &quot;text&quot; log format.
-->
vmodule 爲個別檔案覆蓋 verbosity 閾值。
僅支持 "text" 日誌格式。
</p>
</td>
</tr>
<tr><td><code>options</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#FormatOptions"><code>FormatOptions</code></a>
</td>
<td>
<p>
<!--
[Alpha] Options holds additional parameters that are specific
to the different logging formats. Only the options for the selected
format get used, but all of them get validated.
Only available when the LoggingAlphaOptions feature gate is enabled.
-->
[Alpha] options 包含特定於不同日誌格式的附加參數。
只有與選中格式相關的選項會被使用，但所有選項都會被校驗。
僅在啓用了 LoggingAlphaOptions 特性門控時可用。
</p>
</td>
</tr>
</tbody>
</table>

## `LoggingOptions`     {#LoggingOptions}

<p>
<!--
LoggingOptions can be used with ValidateAndApplyWithOptions to override
certain global defaults.
-->
LoggingOptions 可以與 ValidateAndApplyWithOptions 一起使用，以覆蓋某些全局預設設置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>ErrorStream</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/io#Writer"><code>io.Writer</code></a>
</td>
<td>
<p>
<!--
ErrorStream can be used to override the os.Stderr default.
-->
ErrorStream 可以用於覆蓋預設的 os.Stderr。
</p>
</td>
</tr>
<tr><td><code>InfoStream</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/io#Writer"><code>io.Writer</code></a>
</td>
<td>
<p>
<!--
InfoStream can be used to override the os.Stdout default.
-->
InfoStream 可以用於覆蓋預設的 os.Stdout。
</p>
</td>
</tr>
</tbody>
</table>

## `OutputRoutingOptions`     {#OutputRoutingOptions}

<!--
**Appears in:**
-->
**出現在：**

- [JSONOptions](#JSONOptions)

- [TextOptions](#TextOptions)

<p>
<!--
OutputRoutingOptions contains options that are supported by both &quot;text&quot; and &quot;json&quot;.
-->
OutputRoutingOptions 包含同時被 "text" 和 "json" 日誌格式支持的選項。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>splitStream</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
<p>
<!--
[Alpha] SplitStream redirects error messages to stderr while
info messages go to stdout, with buffering. The default is to write
both to stdout, without buffering. Only available when
the LoggingAlphaOptions feature gate is enabled.
-->
[Alpha] SplitStream 將錯誤消息重定向到 stderr，而資訊消息則輸出到 stdout，並且帶有緩衝。
預設情況下，兩者都寫入 stdout，且不帶緩衝。
僅在啓用了 LoggingAlphaOptions 特性門控時可用。
</p>
</td>
</tr>
<tr><td><code>infoBufferSize</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#QuantityValue"><code>k8s.io/apimachinery/pkg/api/resource.QuantityValue</code></a>
</td>
<td>
<p>
<!--
[Alpha] InfoBufferSize sets the size of the info stream when
using split streams. The default is zero, which disables buffering.
Only available when the LoggingAlphaOptions feature gate is enabled.
-->
[Alpha] infoBufferSize 設置在使用分離流時資訊流的緩衝區大小。預設值爲零，表示禁用緩衝。
僅在啓用了 LoggingAlphaOptions 特性門控時可用。
</p>
</td>
</tr>
</tbody>
</table>

## `TextOptions`     {#TextOptions}

<!--
**Appears in:**
-->
**出現在：**

- [FormatOptions](#FormatOptions)

<p>
<!--
TextOptions contains options for logging format &quot;text&quot;.
-->
TextOptions 包含日誌格式 &quot;text&quot; 的選項。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>OutputRoutingOptions</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#OutputRoutingOptions"><code>OutputRoutingOptions</code></a>
</td>
<td>
<!--
(Members of <code>OutputRoutingOptions</code> are embedded into this type.)
-->
（<code>OutputRoutingOptions</code> 的成員嵌入到此類型中。）
<span class="text-muted">
<!--
No description provided.
-->
未提供描述。
</span></td>
</tr>
</tbody>
</table>

## `TimeOrMetaDuration`     {#TimeOrMetaDuration}

<!--
**Appears in:**
-->
**出現在：**

- [LoggingConfiguration](#LoggingConfiguration)

<p>
<!--
TimeOrMetaDuration is present only for backwards compatibility for the
flushFrequency field, and new fields should use metav1.Duration.
-->
TimeOrMetaDuration 僅出於 flushFrequency 字段的向後兼容性而存在，
新字段應使用 `metav1.Duration`。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>Duration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
<!--
Duration holds the duration
-->
Duration 包含持續時間。
</p>
</td>
</tr>
<tr><td><code>-</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
<p>
<!--
SerializeAsString controls whether the value is serialized as a string or an integer
-->
SerializeAsString 控制值是被序列化爲字符串還是整數。
</p>
</td>
</tr>
</tbody>
</table>

## `VModuleConfiguration`     {#VModuleConfiguration}

<!--
(Alias of `[]k8s.io/component-base/logs/api/v1.VModuleItem`)
-->
`[]k8s.io/component-base/logs/api/v1.VModuleItem` 的別名

<!--
**Appears in:**
-->
**出現在：**

- [LoggingConfiguration](#LoggingConfiguration)

<p>
<!--
VModuleConfiguration is a collection of individual file names or patterns
and the corresponding verbosity threshold.
-->
VModuleConfiguration 是個別檔案名或模式及其對應 verbosity 閾值的集合。
</p>

## `VerbosityLevel`     {#VerbosityLevel}

<!--
(Alias of `uint32`)
-->
（`uint32` 的別名）

<!--
**Appears in:**
-->
**出現在：**

- [LoggingConfiguration](#LoggingConfiguration)

<p>
<!--
VerbosityLevel represents a klog or logr verbosity threshold.
-->
VerbosityLevel 表示 klog 或 logr 的日誌詳細程度（verbosity）閾值。
</p>

## `ClientConnectionConfiguration`     {#ClientConnectionConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<!--
ClientConnectionConfiguration contains details for constructing a client.
-->
ClientConnectionConfiguration 包含構造客戶端所需要的細節資訊。

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
   <p><code>kubeconfig</code> 字段是指向一個 KubeConfig 檔案的路徑。</p>
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
   <p><code>acceptContentTypes</code> 字段定義客戶端在連接到伺服器時所發送的 Accept 頭部字段。
   此設置值會覆蓋預設設定 'application/json'。
   此字段會控制某特定客戶端與指定伺服器的所有鏈接。</p>
</td>
</tr>
<tr><td><code>contentType</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   contentType is the content type used when sending data to the server from this client.
   -->
   <p><code>contentType</code> 字段是從此客戶端向伺服器發送資料時使用的內容類型（Content Type）。</p>
</td>
</tr>
<tr><td><code>qps</code> <B><!--[Required]-->[必需]</B><br/>
<code>float32</code>
</td>
<td>
   <!--
   qps controls the number of queries per second allowed for this connection.
   -->
   <p><code>qps</code> 字段控制此連接上每秒鐘可以發送的查詢請求個數。</p>
</td>
</tr>
<tr><td><code>burst</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   burst allows extra queries to accumulate when a client is exceeding its rate.
   -->
   <p><code>burst</code> 字段允許客戶端超出其速率限制時可以臨時累積的額外查詢個數。</p>
</td>
</tr>
</tbody>
</table>

## `DebuggingConfiguration`     {#DebuggingConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<!--
DebuggingConfiguration holds configuration for Debugging related features.
-->
DebuggingConfiguration 包含調試相關功能的設定。

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
   <p><code>enableProfiling</code> 字段通過位於 <code>host:port/debug/pprof/</code>
   的 Web 介面啓用性能分析。</p>
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
   爲 true 時啓用阻塞分析。</p>
</td>
</tr>
</tbody>
</table>

## `LeaderElectionConfiguration`     {#LeaderElectionConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<!--
LeaderElectionConfiguration defines the configuration of leader election
clients for components that can run with leader election enabled.
-->
LeaderElectionConfiguration 爲能夠支持領導者選舉的組件定義其領導者選舉客戶端的設定。

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
   <code>leaderElect</code> 字段允許領導者選舉客戶端在進入主循環執行之前先獲得領導者角色。
   運行多副本組件時啓用此功能有助於提高可用性。
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
   <code>leaseDuration</code> 字段是非領導角色候選者在觀察到需要領導席位更新時要等待的時間；
   只有經過所設置時長纔可以嘗試去獲得一個仍處於領導狀態但需要被刷新的席位。
   這裏的設置值本質上意味着某個領導者在被另一個候選者替換掉之前可以停止運行的最長時長。
   只有當啓用了領導者選舉時此字段有意義。
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
   <code>renewDeadline</code> 字段設置的是當前領導者在停止扮演領導角色之前需要刷新領導狀態的時間間隔。
   此值必須小於或等於租約期限的長度。只有到啓用了領導者選舉時此字段纔有意義。
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
   <code>retryPeriod</code> 字段是客戶端在連續兩次嘗試獲得或者刷新領導狀態之間需要等待的時長。
   只有當啓用了領導者選舉時此字段纔有意義。
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
   <p><code>resourceLock</code> 字段給出在領導者選舉期間要作爲鎖來使用的資源對象類型。</p>
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
   <p><code>resourceName</code> 字段給出在領導者選舉期間要作爲鎖來使用的資源對象名稱。</p>
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
   <p><code>resourceNamespace</code> 字段給出在領導者選舉期間要作爲鎖來使用的資源對象所在名字空間。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration}

<!--
KubeProxyConfiguration contains everything necessary to configure the
Kubernetes proxy server.
-->
KubeProxyConfiguration 包含用來設定 Kubernetes 代理伺服器的所有設定資訊。

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
   <p><code>featureGates</code> 字段是一個功能特性名稱到布爾值的映射表，
   用來啓用或者禁用測試性質的功能特性。</p>
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
   <code>clientConnection</code> 指定了代理伺服器與 apiserver 通信時應使用的 <code>kubeconfig</code> 檔案和客戶端連接設置。
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
   <code>logging</code> 指定了日誌記錄的選項。有關更多資訊，
   請參閱<a href="https://github.com/kubernetes/component-base/blob/master/logs/options.go">日誌選項</a>。
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
   <code>hostnameOverride</code> 如果不爲空，將作爲 kube-proxy 所運行節點的名稱使用。
   如果未設置，則預設使用節點的主機名作爲節點名稱。
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
   <p><code>bindAddress</code> 可以用來指定 kube-proxy 所認爲的節點主 IP。請注意，
   雖然名稱中有綁定的意思，但實際上 kube-proxy 並不會將任何套接字綁定到這個 IP 地址上。
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
   <p><code>healthzBindAddress</code> 是健康檢查伺服器的 IP 地址和端口，預設情況下，
   如果 bindAddress 未設置或爲 IPv4，則爲 "0.0.0.0:10256"；如果 bindAddress 爲 IPv6，
   則爲 "[::]:10256"。</p>
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
   <p><code>metricsBindAddress</code> 是指標伺服器監聽的 IP 地址和端口，預設情況下，
   如果 bindAddress 未設置或爲 IPv4，則爲 "127.0.0.1:10249"；
   如果 bindAddress 爲 IPv6，則爲 "[::1]:10249"。
  （設置爲 "0.0.0.0:10249" / "[::]:10249" 以綁定到所有介面。）。</p>
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
   <p><code>bindAddressHardFail</code> 字段設置爲 true 時，
   kube-proxy 將無法綁定到某端口這類問題視爲致命錯誤並直接退出。</p>
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
   <p><code>enableProfiling</code> 字段通過 '/debug/pprof' 處理程式在 Web 界面上啓用性能分析。
   性能分析處理程式將由指標伺服器執行。</p>
</td>
</tr>
<tr><td><code>showHiddenMetricsForVersion</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   showHiddenMetricsForVersion is the version for which you want to show hidden metrics.
   -->
   <p><code>showHiddenMetricsForVersion</code> 用於指定要顯示隱藏指標的版本。</p>
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
   <p><code>iptables</code> 字段字段包含與 iptables 相關的設定選項。</p>
</td>
</tr>
<tr><td><code>ipvs</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration"><code>KubeProxyIPVSConfiguration</code></a>
</td>
<td>
   <!--
   ipvs contains ipvs-related configuration options.
   -->
   <p><code>ipvs</code> 字段中包含與 ipvs 相關的設定選項。</p>
</td>
</tr>
<tr><td><code>nftables</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyNFTablesConfiguration"><code>KubeProxyNFTablesConfiguration</code></a>
</td>
<td>
   <!--
   nftables contains nftables-related configuration options
   -->
   <p><code>nftables</code> 包含與 nftables 相關的設定選項。</p>
</td>
</tr>
<tr><td><code>winkernel</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyWinkernelConfiguration"><code>KubeProxyWinkernelConfiguration</code></a>
</td>
<td>
   <!--
   winkernel contains winkernel-related configuration options.
   -->
   <p><code>winkernel</code> 包含與 winkernel 相關的設定選項。</p>
</td>
</tr>
<tr><td><code>detectLocalMode</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-LocalMode"><code>LocalMode</code></a>
</td>
<td>
   <!--
   detectLocalMode determines mode to use for detecting local traffic, defaults to ClusterCIDR.
   -->
   <p><code>detectLocalMode</code> 確定用於檢測本地流量的模式，預設爲 ClusterCIDR。</p>
</td>
</tr>
<tr><td><code>detectLocal</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-DetectLocalConfiguration"><code>DetectLocalConfiguration</code></a>
</td>
<td>
   <!--
   detectLocal contains optional configuration settings related to DetectLocalMode.
   -->
   <p><code>detectLocal</code> 包含與 DetectLocalMode 相關的可選設定設置。</p>
</td>
</tr>
<tr><td><code>clusterCIDR</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   clusterCIDR is the CIDR range of the pods in the cluster. (For dual-stack
clusters, this can be a comma-separated dual-stack pair of CIDR ranges.). When
DetectLocalMode is set to ClusterCIDR, kube-proxy will consider
traffic to be local if its source IP is in this range. (Otherwise it is not
used.)
   -->
   <p><code>clusterCIDR</code> 指定叢集中 Pod 的 CIDR 範圍。
  （對於雙棧叢集，這個參數可以是一個用逗號分隔的雙棧 CIDR 範圍對。）
   當 DetectLocalMode 設置爲 LocalModeClusterCIDR 時，如果流量的源 IP 在這個範圍內，
   kube-proxy 會將其視爲本地流量。（否則不會使用此設置。）</p>
</td>
</tr>
<tr><td><code>nodePortAddresses</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   nodePortAddresses is a list of CIDR ranges that contain valid node IPs, or
alternatively, the single string 'primary'. If set to a list of CIDRs,
the indicated ranges. If set to 'primary', NodePort services will only be
accepted on the node's primary IPv4 and/or IPv6 address according to the Node
object. If unset, NodePort connections will be accepted on all local IPs.</p>
   -->
   <p><code>nodePortAddresses</code> 是一個包含有效節點 IP 的 CIDR 範圍列表或單個字符串 `primary`。
   如果設置爲 CIDR 範圍列表，只有來自這些範圍內的節點 IP 的 NodePort 服務連接纔會被接受。
   如果設置爲 `primary`，則根據 Node 對象，NodePort 服務將僅在節點的主 IPv4 和/或 IPv6 地址上被接受。
   如果未設置，將接受所有本地 IP 的 NodePort 連接。</p>
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
   <p><code>oomScoreAdj</code> 是 kube-proxy 進程的 OOM 評分調整值。該值必須在 [-1000, 1000] 範圍內。</p>
</td>
</tr>
<tr><td><code>conntrack</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConntrackConfiguration"><code>KubeProxyConntrackConfiguration</code></a>
</td>
<td>
   <!--
   conntrack contains conntrack-related configuration options.
   -->
   <p><code>conntrack</code> 包含與 conntrack 相關的設定選項。</p>
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
   <p><code>configSyncPeriod</code> 指定從 apiserver 刷新設定的頻率，必須大於 0。</p>
</td>
</tr>

<tr><td><code>portRange</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   portRange was previously used to configure the userspace proxy, but is now unused.
   -->
   <p><code>portRange</code> 之前用於設定使用者空間代理，但現在已不再使用。</p>
</td>
</tr>
<tr><td><code>windowsRunAsService</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
    <!--
    windowsRunAsService, if true, enables Windows service control manager API integration.
    -->
    如果爲 <code>windowsRunAsService</code> 爲 True，則啓用 Windows 服務控制管理器 API 集成。
   </p>
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
DetectLocalConfiguration 包含與 DetectLocalMode 選項相關的可選設置。

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
   <p><code>bridgeInterface</code> 指的是橋接介面的名稱。
   當 DetectLocalMode 設置爲 LocalModeBridgeInterface 時，
   如果流量來自這個橋接介面，kube-proxy 會將其視爲本地流量。</p>
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
   <p><code>interfaceNamePrefix</code> 是介面名稱的前綴。
   當 DetectLocalMode 設置爲 LocalModeInterfaceNamePrefix 時，
   如果流量來自任何名稱以該前綴開頭的介面，kube-proxy 會將其視爲本地流量。</p>
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
KubeProxyConntrackConfiguration 包含爲 Kubernetes 代理伺服器提供的 conntrack 設置。

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
   <p><code>maxPerCore</code> 字段是每個 CPU 核所跟蹤的 NAT 鏈接個數上限
   （0 意味着保留當前上限限制並忽略 min 字段設置值）。</p>
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
   <p><code>min</code> 字段給出要分配的鏈接跟蹤記錄個數下限。
   設置此值時會忽略 maxPerCore 的值（將 maxPerCore 設置爲 0 時不會調整上限值）。</p>
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
   <p><code>tcpEstablishedTimeout</code> 字段給出空閒 TCP 連接的保留時間（例如，'2s'）。
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
   <p><code>tcpCloseWaitTimeout</code> 字段用來設置空閒的、處於 CLOSE_WAIT 狀態的 conntrack 條目
   保留在 conntrack 表中的時間長度（例如，'60s'）。
   此設置值必須大於 0。</p>
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
   <p><code>tcpBeLiberal</code> 如果設置爲 true，
   kube-proxy 將設定 conntrack 以寬鬆模式運行，
   對於 TCP 連接和超出窗口序列號的報文不會被標記爲 INVALID。</p>
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
   <p><code>udpTimeout</code> 指定處於 UNREPLIED 狀態的空閒 UDP conntrack 條目在 conntrack 表中保留的時間
  （例如 '30s'）。該值必須大於 0。</p>
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
   <p><code>udpStreamTimeout</code> 指定處於 ASSURED 狀態的空閒 UDP conntrack 條目在 conntrack 表中保留的時間
  （例如 '300s'）。該值必須大於 0。</p>
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
KubeProxyIPTablesConfiguration 包含用於 Kubernetes 代理伺服器的、與 iptables 相關的設定細節。

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
   <p><code>masqueradeBit</code> 字段是 iptables fwmark 空間中的具體一位，
   用來在 iptables 或 ipvs 代理模式下設置 SNAT。此值必須介於 [0, 31]（含邊界值）。</p>
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
   <p><code>masqueradeAll</code> 字段用來通知 kube-proxy
   在使用 iptables 或 ipvs 代理模式時對所有流量執行 SNAT 操作。這在某些 CNI 插件中可能是必需的。</p>
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
   <p><code>localhostNodePorts</code> 如果設置爲 false，
   則會通知 kube-proxy 禁用通過本地主機訪問 NodePort 服務的舊有行爲。
  （僅適用於 iptables 模式和 IPv4；在其他代理模式或 IPv6 下，不允許本地主機訪問 NodePort 服務。）</p>
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
   <p><code>syncPeriod</code> 是時間間隔（例如 '5s'、'1m'、'2h22m'），
   指示各種重新同步和清理操作的執行頻率。該值必須大於 0。</p>
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
   <p><code>minSyncPeriod</code> 是 iptables 規則重新同步的最小時間間隔（例如 '5s'、'1m'、'2h22m'）。
   如果值爲 0，表示每次服務或 EndpointSlice 發生變化時都會立即重新同步 iptables。</p>
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
KubeProxyIPVSConfiguration 包含用於 Kubernetes 代理伺服器的、與 ipvs 相關的設定細節。

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
   <p><code>syncPeriod</code> 是各種重新同步和清理操作執行頻率的時間間隔（例如 '5s', '1m', '2h22m'）。
   該值必須大於 0</p>
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
   <p><code>minSyncPeriod</code> 是 IPVS 規則重新同步之間的最小時間間隔（例如 '5s', '1m', '2h22m'）。
   值爲 0 表示每次服務或 EndpointSlice 發生變化時都會立即觸發 IPVS 重新同步。</p>
</td>
</tr>
<tr><td><code>scheduler</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   scheduler is the IPVS scheduler to use
   -->
   <p><code>scheduler</code> 是用於 IPVS 的調度器。</p>
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
   <p><code>excludeCIDRs</code> 字段取值爲一個 CIDR 列表，ipvs 代理程式在清理 IPVS 服務時不應觸碰這些 IP 地址。</p>
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
   <p><code>strictARP</code> 字段用來設定 arp_ignore 和 arp_announce，以避免（錯誤地）響應來自 kube-ipvs0 介面的
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
   <p><code>tcpTimeout</code> 字段是用於設置空閒 IPVS TCP 會話的超時值。
   預設值爲 0，意味着使用系統上當前的超時值設置。</p>
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
   <p><code>tcpFinTimeout</code> 字段用來設置 IPVS TCP 會話在收到 FIN 之後的超時值。
   預設值爲 0，意味着使用系統上當前的超時值設置。</p>
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
   <p><code>udpTimeout</code> 字段用來設置 IPVS UDP 包的超時值。
   預設值爲 0，意味着使用系統上當前的超時值設置。</p>
</td>
</tr>
</tbody>
</table>

## `KubeProxyNFTablesConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyNFTablesConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
KubeProxyNFTablesConfiguration contains nftables-related configuration
+details for the Kubernetes proxy server.
-->
<p>KubeProxyNFTablesConfiguration 包含 Kubernetes 代理伺服器的 nftables 相關設定詳細資訊。</p>

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
   <p><code>masqueradeBit</code> 字段是 iptables fwmark 空間中的具體一位，
   用來在 nftables 代理模式下設置 SNAT。此值必須介於 [0, 31]（含邊界值）。</p>
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
   <p><code>masqueradeAll</code> 通知 kube-proxy 在使用 nftables 模式時，
   對發送到服務叢集 IP 的所有流量執行 SNAT。這在某些 CNI 插件中可能是必需的。</p>
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
   <p><code>syncPeriod</code> 表示各種重新同步和清理操作執行頻率的時間間隔（例如 '5s'、'1m'、'2h22m'）。
   該值必須大於 0。</p>
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
   <p><code>minSyncPeriod</code>是 iptables 規則重新同步之間的最小時間間隔（例如 '5s'、'1m'、'2h22m'）。
   值爲 0 時，表示每次服務或 EndpointSlice 發生變化時都會立即重新同步 iptables。</p>
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
KubeProxyWinkernelConfiguration 包含 Kubernetes 代理伺服器的 Windows/HNS 設置。

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
   <p><code>networkName</code> 字段是 kube-proxy 用來創建端點和策略的網路名稱。</p>
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
   <p><code>sourceVip</code> 字段是執行負載均衡時進行 NAT 轉換所使用的源端 VIP 端點 IP 地址。</p>
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
   <p><code>enableDSR</code> 字段通知 kube-proxy 是否使用 DSR 來創建 HNS 策略。</p>
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
   字段是附加到用於根網路命名空間二層橋接的 hnsendpoint 的名稱。</p>
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
   字段爲 Windows 上的健康檢查端口轉發服務 VIP。</p>
</td>
</tr>
</tbody>
</table>

## `LocalMode`     {#kubeproxy-config-k8s-io-v1alpha1-LocalMode}

<!--
(Alias of `string`)

**Appears in:**
-->
（<code>string</code> 類型的別名）

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

（<code>string</code> 類型的別名）

**出現在：**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)

<!--
ProxyMode represents modes used by the Kubernetes proxy server.

Three modes of proxy are available on Linux platforms: <code>iptables</code>, <code>ipvs</code>, and
<code>nftables</code>. One mode of proxy is available on Windows platforms: <code>kernelspace</code>.
-->
<p>ProxyMode 表示的是 Kubernetes 代理伺服器所使用的模式。</p>

<p>Linux 平臺上有三種可用的代理模式：<code>iptables</code>、<code>ipvs</code>
和 <code>nftables</code>。
在 Windows 平臺上可用的一種代理模式是：<code>kernelspace</code>。</p>

<!--
If the proxy mode is unspecified, the default proxy mode will be used (currently this
is <code>iptables</code> on Linux and <code>kernelspace</code> on Windows). If the selected proxy mode cannot be
used (due to lack of kernel support, missing userspace components, etc) then kube-proxy
will exit with an error.
-->
<p>如果代理模式未被指定，將使用預設的代理模式（目前在 Linux 上是 <code>iptables</code>，在 Windows 上是 <code>kernelspace</code>）。
如果不能使用選定的代理模式（由於缺少內核支持、缺少使用者空間組件等），則 kube-proxy 將出錯並退出。</p>
