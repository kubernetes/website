---
title: kube-scheduler 配置 (v1beta3)
content_type: tool-reference
package: kubescheduler.config.k8s.io/v1beta3
auto_generated: true
---
<!--
title: kube-scheduler Configuration (v1beta3)
content_type: tool-reference
package: kubescheduler.config.k8s.io/v1beta3
auto_generated: true
-->

<!--
## Resource Types
-->
## 資源型別

- [DefaultPreemptionArgs](#kubescheduler-config-k8s-io-v1beta3-DefaultPreemptionArgs)
- [InterPodAffinityArgs](#kubescheduler-config-k8s-io-v1beta3-InterPodAffinityArgs)
- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)
- [NodeAffinityArgs](#kubescheduler-config-k8s-io-v1beta3-NodeAffinityArgs)
- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1beta3-NodeResourcesBalancedAllocationArgs)
- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs)
- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadArgs)
- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1beta3-VolumeBindingArgs)

## `ClientConnectionConfiguration`     {#ClientConnectionConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)
- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)

<!--
ClientConnectionConfiguration contains details for constructing a client.
-->
<p>ClientConnectionConfiguration 中包含用來構造客戶端所需的細節。</p>

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
   <p>此欄位為指向 KubeConfig 檔案的路徑。</p>
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
   <p>
   <code>acceptContentTypes</code> 定義的是客戶端與伺服器建立連線時要傳送的 Accept 頭部，
   這裡的設定值會覆蓋預設值 "application/json"。此欄位會影響某特定客戶端與伺服器的所有連線。
   </p>
</td>
</tr>
<tr><td><code>contentType</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   contentType is the content type used when sending data to the server from this client.
   -->
   <p>
   <code>contentType</code> 包含的是此客戶端向伺服器傳送資料時使用的內容型別（Content Type）。
   </p>
</td>
</tr>
<tr><td><code>qps</code> <B><!--[Required]-->[必需]</B><br/>
<code>float32</code>
</td>
<td>
   <!--
   qps controls the number of queries per second allowed for this connection.
   -->
   <p><code>qps</code> 控制此連線允許的每秒查詢次數。</p>
</td>
</tr>
<tr><td><code>burst</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   burst allows extra queries to accumulate when a client is exceeding its rate.
   -->
   <p><code>burst</code> 允許在客戶端超出其速率限制時可以累積的額外查詢個數。</p>
</td>
</tr>
</tbody>
</table>

## `DebuggingConfiguration`     {#DebuggingConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)
- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

<!--
DebuggingConfiguration holds configuration for Debugging related features.
-->
<p>DebuggingConfiguration 儲存與除錯功能相關的配置。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>enableProfiling</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   enableProfiling enables profiling via web interface host:port/debug/pprof/
   -->
   <p>此欄位允許透過 Web 介面 host:port/debug/pprof/ 執行效能分析。</p>
</td>
</tr>
<tr><td><code>enableContentionProfiling</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   enableContentionProfiling enables lock contention profiling, if
enableProfiling is true.
   -->
   <p>此欄位在 <code>enableProfiling</code> 為 true 時允許執行鎖競爭分析。</p>
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
<p>FormatOptions 中包含不同日誌格式的配置選項。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>json</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
   <!--
   [Experimental] JSON contains options for logging format &quot;json&quot;.
   -->
   <p>[實驗特性] <code>json</code> 欄位包含為 &quot;json&quot; 日誌格式提供的配置選項。</p>
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
JSONOptions contains options for logging format &quot;json&quot;.
-->
<p>JSONOptions 包含為 &quot;json&quot; 日誌格式所設定的配置選項。</p>

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
   <p>[實驗特性] 此欄位將錯誤資訊重定向到標準錯誤輸出（stderr），
   將提示訊息重定向到標準輸出（stdout），並且支援快取。
   預設配置為將二者都輸出到標準輸出（stdout），且不提供快取。</p>
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
   <p>
   [實驗特性] <code>infoBufferSize</code> 用來在分離資料流場景是設定提示資訊資料流的大小。
   預設值為 0，意味著禁止快取。
   </p>
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

<!--
LeaderElectionConfiguration defines the configuration of leader election
clients for components that can run with leader election enabled.
-->
<p>
LeaderElectionConfiguration 為能夠支援領導者選舉的元件定義其領導者選舉客戶端的配置。
</p>

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
   <code>leaderElect</code> 允許領導者選舉客戶端在進入主迴圈執行之前先獲得領導者角色。
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
   <code>leaseDuration</code> 是非領導角色候選者在觀察到需要領導席位更新時要等待的時間；
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
   <code>renewDeadline</code> 設定的是當前領導者在停止扮演領導角色之前需要重新整理領導狀態的時間間隔。
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
   <code>retryPeriod</code> 是客戶端在連續兩次嘗試獲得或者重新整理領導狀態之間需要等待的時長。
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
   <p>此欄位給出在領導者選舉期間要作為鎖來使用的資源物件型別。</p>
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
   <p>此欄位給出在領導者選舉期間要作為鎖來使用的資源物件名稱。</p>
</td>
</tr>
<tr><td><code>resourceNamespace</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   resourceName indicates the namespace of resource object that will be used to lock
during leader election cycles.
   -->
   <p>此欄位給出在領導者選舉期間要作為鎖來使用的資源物件所在名字空間。</p>
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
<p>
LoggingConfiguration 包含日誌選項。
參考 [Logs Options](https://github.com/kubernetes/component-base/blob/master/logs/options.go) 以瞭解更多資訊。
</p>

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
   <p><code>format</code> 設定日誌訊息的結構。預設的格式取值為 <code>text</code>。</p>
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
   <p><code>verbosity</code> 用來確定日誌訊息記錄的詳細程度閾值。
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
   <p><code>vmodule</code> 會在單個檔案層面過載 verbosity 閾值的設定。
   這一選項僅支援 &quot;text&quot; 日誌格式。</p>
</td>
</tr>
<tr><td><code>options</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#FormatOptions"><code>FormatOptions</code></a>
</td>
<td>
<!--
[Experimental] Options holds additional parameters that are specific
to the different logging formats. Only the options for the selected
format get used, but all of them get validated.
-->
   <p>[實驗特性] <code>options</code> 中包含特定於不同日誌格式的配置引數。
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

（`[]k8s.io/component-base/config/v1alpha1.VModuleItem` 的別名)

**出現在：**

- [LoggingConfiguration](#LoggingConfiguration)

<!--
VModuleConfiguration is a collection of individual file names or patterns
and the corresponding verbosity threshold.
-->
<p>VModuleConfiguration 是一組檔名（萬用字元）及其對應的日誌詳盡程度閾值。</p>

## `DefaultPreemptionArgs`     {#kubescheduler-config-k8s-io-v1beta3-DefaultPreemptionArgs}

<!--
DefaultPreemptionArgs holds arguments used to configure the
DefaultPreemption plugin.
-->
<p>DefaultPreemptionArgs 包含用來配置 DefaultPreemption 外掛的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>DefaultPreemptionArgs</code></td></tr>

<tr><td><code>minCandidateNodesPercentage</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   MinCandidateNodesPercentage is the minimum number of candidates to
shortlist when dry running preemption as a percentage of number of nodes.
Must be in the range [0, 100]. Defaults to 10% of the cluster size if
unspecified.
   -->
   <p>此欄位為試執行搶佔時 shortlist 中候選節點數的下限，數值為節點數的百分比。
   欄位值必須介於 [0, 100] 之間。未指定時預設值為整個叢集規模的 10%。</p>
</td>
</tr>
<tr><td><code>minCandidateNodesAbsolute</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   MinCandidateNodesAbsolute is the absolute minimum number of candidates to
shortlist. The likely number of candidates enumerated for dry running
preemption is given by the formula:
numCandidates = max(numNodes &lowast; minCandidateNodesPercentage, minCandidateNodesAbsolute)
We say "likely" because there are other factors such as PDB violations
that play a role in the number of candidates shortlisted. Must be at least
0 nodes. Defaults to 100 nodes if unspecified.
   -->
   <p>此欄位設定 shortlist 中候選節點的絕對下限。
   用於試執行搶佔而列舉的候選節點個數近似於透過下面的公式計算的：<br/>
   候選節點數 = max(節點數 * minCandidateNodesPercentage, minCandidateNodesAbsolute)
   之所以說是&quot;近似於&quot;是因為存在一些類似於 PDB 違例這種因素，
   會影響到進入 shortlist中候選節點的個數。
   取值至少為 0 節點。若未設定預設為 100 節點。</p>
</td>
</tr>
</tbody>
</table>

## `InterPodAffinityArgs`     {#kubescheduler-config-k8s-io-v1beta3-InterPodAffinityArgs}

<!--
InterPodAffinityArgs holds arguments used to configure the InterPodAffinity plugin.
-->
<p>InterPodAffinityArgs 包含用來配置 InterPodAffinity 外掛的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InterPodAffinityArgs</code></td></tr>

<tr><td><code>hardPodAffinityWeight</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   HardPodAffinityWeight is the scoring weight for existing pods with a
matching hard affinity to the incoming pod.
   -->
   <p>此欄位是一個計分權重值。針對新增的 Pod，要對現存的、
   帶有與新 Pod 匹配的硬性親和性設定的 Pods 計算親和性得分。
   </p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerConfiguration`     {#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration}

<!--
KubeSchedulerConfiguration configures a scheduler
-->
<p>KubeSchedulerConfiguration 用來配置排程器。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeSchedulerConfiguration</code></td></tr>

<tr><td><code>parallelism</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Parallelism defines the amount of parallelism in algorithms for scheduling a Pods. Must be greater than 0. Defaults to 16
   -->
   <p>
   此欄位設定為排程 Pod 而執行演算法時的併發度。此值必須大於 0。預設值為 16。
   </p>
</td>
</tr>
<tr><td><code>leaderElection</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#LeaderElectionConfiguration"><code>LeaderElectionConfiguration</code></a>
</td>
<td>
   <!--
   LeaderElection defines the configuration of leader election client.
   -->
   <p>此欄位用來定義領導者選舉客戶端的配置。</p>
</td>
</tr>
<tr><td><code>clientConnection</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#ClientConnectionConfiguration"><code>ClientConnectionConfiguration</code></a>
</td>
<td>
   <!--
   ClientConnection specifies the kubeconfig file and client connection
settings for the proxy server to use when communicating with the apiserver.
   -->
   <p>此欄位為與 API 伺服器通訊時使用的代理伺服器設定 kubeconfig 檔案和客戶端連線配置。</p>
</td>
</tr>
<tr><td><code>DebuggingConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#DebuggingConfiguration"><code>DebuggingConfiguration</code></a>
</td>
<!--
(Members of <code>DebuggingConfiguration</code> are embedded into this type.)
-->
<td>（<code>DebuggingConfiguration</code> 的成員被內嵌到此型別中）
   <!--
   DebuggingConfiguration holds configuration for Debugging related features
   TODO: We might wanna make this a substruct like Debugging componentbaseconfigv1alpha1.DebuggingConfiguration
   -->
   <p>此欄位設定與除錯相關功能特性的配置。
   TODO：我們可能想把它做成一個子結構，像除錯 component-base/config/v1alpha1.DebuggingConfiguration 一樣。</p>
</td>
</tr>
<tr><td><code>percentageOfNodesToScore</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   PercentageOfNodesToScore is the percentage of all nodes that once found feasible
for running a pod, the scheduler stops its search for more feasible nodes in
the cluster. This helps improve scheduler's performance. Scheduler always tries to find
at least "minFeasibleNodesToFind" feasible nodes no matter what the value of this flag is.
Example: if the cluster size is 500 nodes and the value of this flag is 30,
then scheduler stops finding further feasible nodes once it finds 150 feasible ones.
When the value is 0, default percentage (5%--50% based on the size of the cluster) of the
nodes will be scored.
   -->
   <p>
   此欄位為所有節點的百分比，一旦排程器找到所設定比例的、能夠執行 Pod 的節點，
   則停止在叢集中繼續尋找更合適的節點。這一配置有助於提高排程器的效能。
   排程器總會嘗試尋找至少 &quot;minFeasibleNodesToFind&quot; 個可行節點，無論此欄位的取值如何。
   例如：當叢集規模為 500 個節點，而此欄位的取值為 30，
   則排程器在找到 150 個合適的節點後會停止繼續尋找合適的節點。當此值為 0 時，
   排程器會使用預設節點數百分比（基於叢集規模確定的值，在 5% 到 50% 之間）來執行打分操作。
   </p>
</td>
</tr>
<tr><td><code>podInitialBackoffSeconds</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <!--
   PodInitialBackoffSeconds is the initial backoff for unschedulable pods.
If specified, it must be greater than 0. If this value is null, the default value (1s)
will be used.
   -->
   <p>此欄位設定不可排程 Pod 的初始回退秒數。如果設定了此欄位，其取值必須大於零。
   若此值為 null，則使用預設值（1s）。</p>
</td>
</tr>
<tr><td><code>podMaxBackoffSeconds</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <!--
   PodMaxBackoffSeconds is the max backoff for unschedulable pods.
If specified, it must be greater than podInitialBackoffSeconds. If this value is null,
the default value (10s) will be used.
   -->
   <p>此欄位設定不可排程的 Pod 的最大回退秒數。
   如果設定了此欄位，則其值必須大於 podInitialBackoffSeconds 欄位值。
   如果此值設定為 null，則使用預設值（10s）。</p>
</td>
</tr>
<tr><td><code>profiles</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile"><code>[]KubeSchedulerProfile</code></a>
</td>
<td>
   <!--
   Profiles are scheduling profiles that kube-scheduler supports. Pods can
choose to be scheduled under a particular profile by setting its associated
scheduler name. Pods that don't specify any scheduler name are scheduled
with the "default-scheduler" profile, if present here.
   -->
   <p>此欄位為 kube-scheduler 所支援的方案（profiles）。
   Pod 可以透過設定其對應的排程器名稱來選擇使用特定的方案。
   未指定排程器名稱的 Pod 會使用&quot;default-scheduler&quot;方案來排程，如果存在的話。
   </p>
</td>
</tr>
<tr><td><code>extenders</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-Extender"><code>[]Extender</code></a>
</td>
<td>
   <!--
   Extenders are the list of scheduler extenders, each holding the values of how to communicate
with the extender. These extenders are shared by all scheduler profiles.
   -->
   <p>此欄位為排程器擴充套件模組（Extender）的列表，
   每個元素包含如何與某擴充套件模組通訊的配置資訊。
   所有排程器模仿會共享此擴充套件模組列表。</p>
</td>
</tr>
</tbody>
</table>

## `NodeAffinityArgs`     {#kubescheduler-config-k8s-io-v1beta3-NodeAffinityArgs}

<!--
NodeAffinityArgs holds arguments to configure the NodeAffinity plugin.
-->
<p>NodeAffinityArgs 中包含配置 NodeAffinity 外掛的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeAffinityArgs</code></td></tr>

<tr><td><code>addedAffinity</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#nodeaffinity-v1-core"><code>core/v1.NodeAffinity</code></a>
</td>
<td>
   <!--
   AddedAffinity is applied to all Pods additionally to the NodeAffinity
specified in the PodSpec. That is, Nodes need to satisfy AddedAffinity
AND .spec.NodeAffinity. AddedAffinity is empty by default (all Nodes
match).
When AddedAffinity is used, some Pods with affinity requirements that match
a specific Node (such as Daemonset Pods) might remain unschedulable.
   -->
   <p>
   <code>addedAffinity</code> 會作為附加的親和性屬性新增到所有 Pod 的規約中指定的 NodeAffinity 中。
   換言之，節點需要同時滿足 addedAffinity 和 .spec.nodeAffinity。
   預設情況下，addedAffinity 為空（與所有節點匹配）。使用了 addedAffinity 時，
   某些帶有已經能夠與某特定節點匹配的親和性需求的 Pod （例如 DaemonSet Pod）可能會繼續呈現不可排程狀態。
   </p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesBalancedAllocationArgs`     {#kubescheduler-config-k8s-io-v1beta3-NodeResourcesBalancedAllocationArgs}

<!--
NodeResourcesBalancedAllocationArgs holds arguments used to configure NodeResourcesBalancedAllocation plugin.
-->
<p>NodeResourcesBalancedAllocationArgs 包含用來配置 NodeResourcesBalancedAllocation 外掛的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesBalancedAllocationArgs</code></td></tr>

<tr><td><code>resources</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   <!--
   Resources to be managed, the default is "cpu" and "memory" if not specified.
   -->
   <p>要管理的資源；如果未設定，則預設值為 &quot;cpu&quot; 和 &quot;memory&quot;。</p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesFitArgs`     {#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs}

<!--
NodeResourcesFitArgs holds arguments used to configure the NodeResourcesFit plugin.
-->
<p>NodeResourcesFitArgs 包含用來配置 NodeResourcesFit 外掛的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesFitArgs</code></td></tr>

<tr><td><code>ignoredResources</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   IgnoredResources is the list of resources that NodeResources fit filter
should ignore. This doesn't apply to scoring.
   -->
   <p>此欄位為 NodeResources 匹配過濾器要忽略的資源列表。此列表不影響節點打分。</p>
</td>
</tr>
<tr><td><code>ignoredResourceGroups</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   IgnoredResourceGroups defines the list of resource groups that NodeResources fit filter should ignore.
e.g. if group is ["example.com"], it will ignore all resource names that begin
with "example.com", such as "example.com/aaa" and "example.com/bbb".
A resource group name can't contain '/'. This doesn't apply to scoring.
   -->
   <p>此欄位定義 NodeResources 匹配過濾器要忽略的資源組列表。
   例如，如果配置值為 [&quot;example.com&quot;]，
   則以 &quot;example.com&quot; 開頭的資源名
   （如&quot;example.com/aaa&quot; 和 &quot;example.com/bbb&quot;）都會被忽略。
   資源組名稱中不可以包含 '/'。此設定不影響節點的打分。</p>
</td>
</tr>
<tr><td><code>scoringStrategy</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy"><code>ScoringStrategy</code></a>
</td>
<td>
   <!--
   ScoringStrategy selects the node resource scoring strategy.
The default strategy is LeastAllocated with an equal "cpu" and "memory" weight.
   -->
   <p>此欄位用來選擇節點資源打分策略。預設的策略為 LeastAllocated，
   且 &quot;cpu&quot; 和 &quot;memory&quot; 的權重相同。</p>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadArgs`     {#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadArgs}

<!--
PodTopologySpreadArgs holds arguments used to configure the PodTopologySpread plugin.
-->
<p>PodTopologySpreadArgs 包含用來配置 PodTopologySpread 外掛的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodTopologySpreadArgs</code></td></tr>

<tr><td><code>defaultConstraints</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#topologyspreadconstraint-v1-core"><code>[]core/v1.TopologySpreadConstraint</code></a>
</td>
<td>
   <!--
   DefaultConstraints defines topology spread constraints to be applied to
Pods that don't define any in `pod.spec.topologySpreadConstraints`.
`.defaultConstraints[&lowast;].labelSelectors` must be empty, as they are
deduced from the Pod's membership to Services, ReplicationControllers,
ReplicaSets or StatefulSets.
When not empty, .defaultingType must be "List".
   -->
   <p>此欄位針對未定義 <code>.spec.topologySpreadConstraints</code> 的 Pod，
   為其提供拓撲分佈約束。<code>.defaultConstraints[&lowast;].labelSelectors</code>必須為空，
   因為這一資訊要從 Pod 所屬的 Service、ReplicationController、ReplicaSet 或 StatefulSet 來推導。
   此欄位不為空時，<code>.defaultingType</code> 必須為 &quot;List&quot;。</p>
</td>
</tr>
<tr><td><code>defaultingType</code><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadConstraintsDefaulting"><code>PodTopologySpreadConstraintsDefaulting</code></a>
</td>
<td>
   <!--
   DefaultingType determines how .defaultConstraints are deduced. Can be one
of "System" or "List".
- "System": Use kubernetes defined constraints that spread Pods among
  Nodes and Zones.
- "List": Use constraints defined in .defaultConstraints.
Defaults to &quot;System&quot;.
   -->
   <p><code>defaultingType</code> 決定如何推導 <code>.defaultConstraints</code>。
   可選值為 &quot;System&quot; 或 &quot;List&quot;。</p>
   <ul>
     <li>&quot;System&quot;：使用 Kubernetes 定義的約束，將 Pod 分佈到不同節點和可用區；</li>
     <li>&quot;List&quot;：使用 <code>.defaultConstraints</code> 中定義的約束。</li>
   </ul>
   <p>預設值為 "System"。</p>
</td>
</tr>
</tbody>
</table>

## `VolumeBindingArgs`     {#kubescheduler-config-k8s-io-v1beta3-VolumeBindingArgs}

<!--
VolumeBindingArgs holds arguments used to configure the VolumeBinding plugin.
-->
<p>VolumeBindingArgs 包含用來配置 VolumeBinding 外掛的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>VolumeBindingArgs</code></td></tr>

<tr><td><code>bindTimeoutSeconds</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <!--
   BindTimeoutSeconds is the timeout in seconds in volume binding operation.
Value must be non-negative integer. The value zero indicates no waiting.
If this value is nil, the default value (600) will be used.
   -->
   <p>此欄位設定卷繫結操作的超時秒數。欄位值必須是非負數。
   取值為 0 意味著不等待。如果此值為 null，則使用預設值（600）。</p>
</td>
</tr>
<tr><td><code>shape</code><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   <!--
   Shape specifies the points defining the score function shape, which is
used to score nodes based on the utilization of statically provisioned
PVs. The utilization is calculated by dividing the total requested
storage of the pod by the total capacity of feasible PVs on each node.
Each point contains utilization (ranges from 0 to 100) and its
associated score (ranges from 0 to 10). You can turn the priority by
specifying different scores for different utilization numbers.
The default shape points are:
1) 0 for 0 utilization
2) 10 for 100 utilization
All points must be sorted in increasing order by utilization.
   -->
   <p><code>shape</code> 用來設定打分函式曲線所使用的計分點，
   這些計分點用來基於靜態製備的 PV 卷的利用率為節點打分。
   卷的利用率是計算得來的，
   將 Pod 所請求的總的儲存空間大小除以每個節點上可用的總的卷容量。
   每個計分點包含利用率（範圍從 0 到 100）和其對應的得分（範圍從 0 到 10）。
   你可以透過為不同的使用率值設定不同的得分來反轉優先順序：</p>
   <p>預設的曲線計分點為：</p>
   <ol>
     <li>利用率為 0 時得分為 0；</li>
     <li>利用率為 100 時得分為 10。</li>
   </ol>
   <p>所有計分點必須按利用率值的升序來排序。</p>
</td>
</tr>
</tbody>
</table>

## `Extender`     {#kubescheduler-config-k8s-io-v1beta3-Extender}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)

<!--
Extender holds the parameters used to communicate with the extender. If a verb is unspecified/empty,
it is assumed that the extender chose not to provide that extension.
-->
<p>Extender 包含與擴充套件模組（Extender）通訊所用的引數。
如果未指定 verb 或者 verb 為空，則假定對應的擴充套件模組選擇不提供該擴充套件功能。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>urlPrefix</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   URLPrefix at which the extender is available
   -->
   <p>用來訪問擴充套件模組的 URL 字首。</p>
</td>
</tr>
<tr><td><code>filterVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the filter call, empty if not supported. This verb is appended to the URLPrefix when issuing the filter call to extender.
   -->
   <p>filter 呼叫所使用的動詞，如果不支援過濾操作則為空。
   此動詞會在向擴充套件模組傳送 filter 呼叫時追加到 urlPrefix 後面。</p>
</td>
</tr>
<tr><td><code>preemptVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the preempt call, empty if not supported. This verb is appended to the URLPrefix when issuing the preempt call to extender.
   -->
   <p>preempt 呼叫所使用的動詞，如果不支援過濾操作則為空。
   此動詞會在向擴充套件模組傳送 preempt 呼叫時追加到 urlPrefix 後面。</p>
</td>
</tr>
<tr><td><code>prioritizeVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the prioritize call, empty if not supported. This verb is appended to the URLPrefix when issuing the prioritize call to extender.
   -->
   <p>prioritize 呼叫所使用的動詞，如果不支援過濾操作則為空。
   此動詞會在向擴充套件模組傳送 prioritize 呼叫時追加到 urlPrefix 後面。</p>
</td>
</tr>
<tr><td><code>weight</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <!--
   The numeric multiplier for the node scores that the prioritize call generates.
The weight should be a positive integer
   -->
   <p>針對 prioritize 呼叫所生成的節點分數要使用的數值係數。
   weight 值必須是正整數。</p>
</td>
</tr>
<tr><td><code>bindVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the bind call, empty if not supported. This verb is appended to the URLPrefix when issuing the bind call to extender.
If this method is implemented by the extender, it is the extender's responsibility to bind the pod to apiserver. Only one extender
can implement this function.
   -->
   <p>bind 呼叫所使用的動詞，如果不支援過濾操作則為空。
   此動詞會在向擴充套件模組傳送 bind 呼叫時追加到 urlPrefix 後面。
   如果擴充套件模組實現了此方法，擴充套件模組要負責將 Pod 繫結到 API 伺服器。
   只有一個擴充套件模組可以實現此函式。</p>
</td>
</tr>
<tr><td><code>enableHTTPS</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   EnableHTTPS specifies whether https should be used to communicate with the extender
   -->
   <p>此欄位設定是否需要使用 HTTPS 來與擴充套件模組通訊。</p>
</td>
</tr>
<tr><td><code>tlsConfig</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ExtenderTLSConfig"><code>ExtenderTLSConfig</code></a>
</td>
<td>
   <!--
   TLSConfig specifies the transport layer security config
   -->
   <p>此欄位設定傳輸層安全性（TLS）配置。</p>
</td>
</tr>
<tr><td><code>httpTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   HTTPTimeout specifies the timeout duration for a call to the extender. Filter timeout fails the scheduling of the pod. Prioritize
timeout is ignored, k8s/other extenders priorities are used to select the node.
   -->
   <p>此欄位給出擴充套件模組功能呼叫的超時值。filter 操作超時會導致 Pod 無法被排程。
   prioritize 操作超時會被忽略，
   Kubernetes 或者其他擴充套件模組所給出的優先順序值會被用來選擇節點。</p>
</td>
</tr>
<tr><td><code>nodeCacheCapable</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   NodeCacheCapable specifies that the extender is capable of caching node information,
so the scheduler should only send minimal information about the eligible nodes
assuming that the extender already cached full details of all nodes in the cluster
   -->
   <p>此欄位指示擴充套件模組可以快取節點資訊，從而排程器應該傳送關於可選節點的最少資訊，
   假定擴充套件模組已經快取了叢集中所有節點的全部詳細資訊。</p>
</td>
</tr>
<tr><td><code>managedResources</code><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ExtenderManagedResource"><code>[]ExtenderManagedResource</code></a>
</td>
<td>
   <!--
   ManagedResources is a list of extended resources that are managed by
this extender.
- A pod will be sent to the extender on the Filter, Prioritize and Bind
  (if the extender is the binder) phases iff the pod requests at least
  one of the extended resources in this list. If empty or unspecified,
  all pods will be sent to this extender.
- If IgnoredByScheduler is set to true for a resource, kube-scheduler
  will skip checking the resource in predicates.
   -->
   <p><code>managedResources</code> 是一個由此擴充套件模組所管理的擴充套件資源的列表。</p>
   <ul>
     <li>如果某 Pod 請求了此列表中的至少一個擴充套件資源，則 Pod 會在 filter、
      prioritize 和 bind （如果擴充套件模組可以執行繫結操作）階段被髮送到該擴充套件模組。</li>
     <li>如果某資源上設定了 <code>ignoredByScheduler</code> 為 true，則 kube-scheduler
      會在斷言階段略過對該資源的檢查。</li>
   </ul>
</td>
</tr>
<tr><td><code>ignorable</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   Ignorable specifies if the extender is ignorable, i.e. scheduling should not
fail when the extender returns an error or is not reachable.
   -->
   <p>此欄位用來設定擴充套件模組是否是可忽略的。
   換言之，當擴充套件模組返回錯誤或者完全不可達時，排程操作不應失敗。</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderManagedResource`     {#kubescheduler-config-k8s-io-v1beta3-ExtenderManagedResource}

<!--
**Appears in:**
-->
**出現在：**

- [Extender](#kubescheduler-config-k8s-io-v1beta3-Extender)

<!--
ExtenderManagedResource describes the arguments of extended resources
managed by an extender.
-->
<p>ExtenderManagedResource 描述某擴充套件模組所管理的擴充套件資源的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Name is the extended resource name.
   -->
   <p>擴充套件資源的名稱。</p>
</td>
</tr>
<tr><td><code>ignoredByScheduler</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   IgnoredByScheduler indicates whether kube-scheduler should ignore this
resource when applying predicates.
   -->
   <p>此欄位標明 kube-scheduler 是否應在應用斷言時忽略此資源。</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderTLSConfig`     {#kubescheduler-config-k8s-io-v1beta3-ExtenderTLSConfig}

<!--
**Appears in:**
-->
**出現在：**

- [Extender](#kubescheduler-config-k8s-io-v1beta3-Extender)

<!--
ExtenderTLSConfig contains settings to enable TLS with extender
-->
<p>ExtenderTLSConfig 包含啟用與擴充套件模組間 TLS 傳輸所需的配置引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>insecure</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   Server should be accessed without verifying the TLS certificate. For testing only.
   -->
   <p>訪問伺服器時不需要檢查 TLS 證書。此配置僅針對測試用途。</p>
</td>
</tr>
<tr><td><code>serverName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   ServerName is passed to the server for SNI and is used in the client to check server
certificates against. If ServerName is empty, the hostname used to contact the
server is used.
   -->
   <p><code>serverName</code> 會被髮送到伺服器端，作為 SNI 標誌；
   客戶端會使用此設定來檢查伺服器證書。
   如果 <code>serverName</code> 為空，則會使用聯絡伺服器時所用的主機名。
   </p>
</td>
</tr>
<tr><td><code>certFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Server requires TLS client certificate authentication
   -->
   <p>伺服器端所要求的 TLS 客戶端證書認證。</p>
</td>
</tr>
<tr><td><code>keyFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Server requires TLS client certificate authentication
   -->
   <p>伺服器端所要求的 TLS 客戶端秘鑰認證。</p>
</td>
</tr>
<tr><td><code>caFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Trusted root certificates for server
   -->
   <p>伺服器端被信任的根證書。</p>
</td>
</tr>
<tr><td><code>certData</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]byte</code>
</td>
<td>
   <!--
   CertData holds PEM-encoded bytes (typically read from a client certificate file).
CertData takes precedence over CertFile
   -->
   <p><code>certData</code> 包含 PEM 編碼的位元組流（通常從某客戶端證書檔案讀入）。
   此欄位優先順序高於 certFile 欄位。</p>
</td>
</tr>
<tr><td><code>keyData</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]byte</code>
</td>
<td>
   <!--
   KeyData holds PEM-encoded bytes (typically read from a client certificate key file).
KeyData takes precedence over KeyFile
   -->
   <p><code>keyData</code> 包含 PEM 編碼的位元組流（通常從某客戶端證書秘鑰檔案讀入）。
   此欄位優先順序高於 keyFile 欄位。</p>
</td>
</tr>
<tr><td><code>caData</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]byte</code>
</td>
<td>
   <!--
   CAData holds PEM-encoded bytes (typically read from a root certificates bundle).
CAData takes precedence over CAFile
   -->
   <p><code>caData</code> 包含 PEM 編碼的位元組流（通常從某根證書包檔案讀入）。
   此欄位優先順序高於 caFile 欄位。</p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerProfile`     {#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)

<!--
KubeSchedulerProfile is a scheduling profile.
-->
<p>KubeSchedulerProfile 是一個排程方案。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>schedulerName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   schedulername is the name of the scheduler associated to this profile.
if schedulername matches with the pod's "spec.schedulername", then the pod
is scheduled with this profile.
   -->
   <p><code>schedulerName</code> 是與此排程方案相關聯的排程器的名稱。
   如果 <code>schedulerName</code> 與 Pod 的 <code>spec.schedulerName</code>匹配，
   則該 Pod 會使用此方案來排程。</p>
</td>
</tr>
<tr><td><code>plugins</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-Plugins"><code>Plugins</code></a>
</td>
<td>
   <!--
   Plugins specify the set of plugins that should be enabled or disabled.
Enabled plugins are the ones that should be enabled in addition to the
default plugins. Disabled plugins are any of the default plugins that
should be disabled.
When no enabled or disabled plugin is specified for an extension point,
default plugins for that extension point will be used if there is any.
If a QueueSort plugin is specified, the same QueueSort Plugin and
PluginConfig must be specified for all profiles.
   -->
   <p><code>plugins</code> 設定一組應該被啟用或禁止的外掛。
   被啟用的外掛是指除了預設外掛之外需要被啟用的外掛。
   被禁止的外掛是指需要被禁用的預設外掛。</p>
   <p>如果針對某個擴充套件點沒有設定被啟用或被禁止的外掛，
   則使用該擴充套件點的預設外掛（如果有的話）。如果設定了 QueueSort 外掛，
   則同一個 QueueSort 外掛和 <code>pluginConfig</code> 要被設定到所有排程方案之上。
   </p>
</td>
</tr>
<tr><td><code>pluginConfig</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginConfig"><code>[]PluginConfig</code></a>
</td>
<td>
   <!--
   PluginConfig is an optional set of custom plugin arguments for each plugin.
Omitting config args for a plugin is equivalent to using the default config
for that plugin.
   -->
   <p><code>pluginConfig</code> 是為每個外掛提供的一組可選的定製外掛引數。
   如果忽略了外掛的配置引數，則意味著使用該外掛的預設配置。</p>
</td>
</tr>
</tbody>
</table>

## `Plugin`     {#kubescheduler-config-k8s-io-v1beta3-Plugin}

<!--
**Appears in:**
-->
**出現在：**

- [PluginSet](#kubescheduler-config-k8s-io-v1beta3-PluginSet)

<!--
Plugin specifies a plugin name and its weight when applicable. Weight is used only for Score plugins.
-->
<p>Plugin 指定外掛的名稱及其權重（如果適用的話）。權重僅用於評分（Score）外掛。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Name defines the name of plugin
   -->
   <p>外掛的名稱。</p>
</td>
</tr>
<tr><td><code>weight</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Weight defines the weight of plugin, only used for Score plugins.
   -->
   <p>外掛的權重；僅適用於評分（Score）外掛。</p>
</td>
</tr>
</tbody>
</table>

## `PluginConfig`     {#kubescheduler-config-k8s-io-v1beta3-PluginConfig}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile)

<!--
PluginConfig specifies arguments that should be passed to a plugin at the time of initialization.
A plugin that is invoked at multiple extension points is initialized once. Args can have arbitrary structure.
It is up to the plugin to process these Args.
-->
<p>PluginConfig 給出初始化階段要傳遞給外掛的引數。
在多個擴充套件點被呼叫的外掛僅會被初始化一次。
引數可以是任意結構。外掛負責處理這裡所傳的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Name defines the name of plugin being configured
   -->
   <p><code>name</code> 是所配置的外掛的名稱。</p>
</td>
</tr>
<tr><td><code>args</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <!--
   Args defines the arguments passed to the plugins at the time of initialization. Args can have arbitrary structure.
   -->
   <p><code>args</code> 定義在初始化階段要傳遞給外掛的引數。引數可以為任意結構。</p>
</td>
</tr>
</tbody>
</table>

## `PluginSet`     {#kubescheduler-config-k8s-io-v1beta3-PluginSet}

<!--
**Appears in:**
-->
**出現在：**

- [Plugins](#kubescheduler-config-k8s-io-v1beta3-Plugins)

<!--
PluginSet specifies enabled and disabled plugins for an extension point.
If an array is empty, missing, or nil, default plugins at that extension point will be used.
-->
<p>PluginSet 為某擴充套件點設定要啟用或禁用的外掛。
如果陣列為空，或者取值為 null，則使用該擴充套件點的預設外掛集合。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>enabled</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   <!--
   Enabled specifies plugins that should be enabled in addition to default plugins.
If the default plugin is also configured in the scheduler config file, the weight of plugin will
be overridden accordingly.
These are called after default plugins and in the same order specified here.
   -->
   <p><code>enabled</code> 設定在預設外掛之外要啟用的外掛。
   如果在排程器的配置檔案中也配置了預設外掛，則對應外掛的權重會被覆蓋。
   此處所設定的外掛會在預設外掛之後被呼叫，呼叫順序與陣列中元素順序相同。</p>
</td>
</tr>
<tr><td><code>disabled</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   <!--
   Disabled specifies default plugins that should be disabled.
When all default plugins need to be disabled, an array containing only one "&lowast;" should be provided.
   -->
   <p><code>disabled</code> 設定要被禁用的預設外掛。
   如果需要禁用所有的預設外掛，應該提供僅包含一個元素 "&lowast;" 的陣列。</p>
</td>
</tr>
</tbody>
</table>

## `Plugins`     {#kubescheduler-config-k8s-io-v1beta3-Plugins}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile)

<!--
Plugins include multiple extension points. When specified, the list of plugins for
a particular extension point are the only ones enabled. If an extension point is
omitted from the config, then the default set of plugins is used for that extension point.
Enabled plugins are called in the order specified here, after default plugins. If they need to
be invoked before default plugins, default plugins must be disabled and re-enabled here in desired order.
-->
<p>Plugins 結構中包含多個擴充套件點。當此結構被設定時，
針對特定擴充套件點所啟用的所有外掛都在這一列表中。
如果配置中不包含某個擴充套件點，則使用該擴充套件點的預設外掛集合。
被啟用的外掛的呼叫順序與這裡指定的順序相同，都在預設外掛之後呼叫。
如果它們需要在預設外掛之前呼叫，則需要先行禁止預設外掛，
之後在這裡按期望的順序重新啟用。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>queueSort</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   QueueSort is a list of plugins that should be invoked when sorting pods in the scheduling queue.
   -->
   <p><code>queueSort</code> 是一個在對排程佇列中 Pod 排序時要呼叫的外掛列表。</p>
</td>
</tr>
<tr><td><code>preFilter</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PreFilter is a list of plugins that should be invoked at "PreFilter" extension point of the scheduling framework.
   -->
   <p><code>preFilter</code> 是一個在排程框架中&quot;PreFilter（預過濾）&quot;擴充套件點上要
   呼叫的外掛列表。</p>
</td>
</tr>
<tr><td><code>filter</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Filter is a list of plugins that should be invoked when filtering out nodes that cannot run the Pod.
   -->
   <p><code>filter</code> 是一個在需要過濾掉無法執行 Pod 的節點時被呼叫的外掛列表。</p>
</td>
</tr>
<tr><td><code>postFilter</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PostFilter is a list of plugins that are invoked after filtering phase, but only when no feasible nodes were found for the pod.
   -->
   <p><code>postFilter</code> 是一個在過濾階段結束後會被呼叫的外掛列表；
   這裡的外掛只有在找不到合適的節點來執行 Pod 時才會被呼叫。</p>
</td>
</tr>
<tr><td><code>preScore</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PreScore is a list of plugins that are invoked before scoring.
   -->
   <p><code>preScore</code> 是一個在打分之前要呼叫的外掛列表。</p>
</td>
</tr>
<tr><td><code>score</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Score is a list of plugins that should be invoked when ranking nodes that have passed the filtering phase.
   -->
   <p><code>score</code> 是一個在對已經透過過濾階段的節點進行排序時呼叫的外掛的列表。</p>
</td>
</tr>
<tr><td><code>reserve</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Reserve is a list of plugins invoked when reserving/unreserving resources
after a node is assigned to run the pod.
   -->
   <p><code>reserve</code> 是一組在執行 Pod 的節點已被選定後，需要預留或者釋放資源時呼叫的外掛的列表。</p>
</td>
</tr>
<tr><td><code>permit</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Permit is a list of plugins that control binding of a Pod. These plugins can prevent or delay binding of a Pod.
   -->
   <p><code>permit</code> 是一個用來控制 Pod 繫結關係的外掛列表。
   這些外掛可以禁止或者延遲 Pod 的繫結。</p>
</td>
</tr>
<tr><td><code>preBind</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PreBind is a list of plugins that should be invoked before a pod is bound.
   -->
   <p><code>preBind</code> 是一個在 Pod 被繫結到某節點之前要被呼叫的外掛的列表。</p>
</td>
</tr>
<tr><td><code>bind</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Bind is a list of plugins that should be invoked at "Bind" extension point of the scheduling framework.
The scheduler call these plugins in order. Scheduler skips the rest of these plugins as soon as one returns success.
   -->
   <p>
   <code>bind</code> 是一個在排程框架中&quot;Bind（繫結）&quot;擴充套件點上要呼叫的外掛的列表。
   排程器按順序呼叫這些外掛。只要其中某個外掛返回成功，則排程器就略過餘下的外掛。
   </p>
</td>
</tr>
<tr><td><code>postBind</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PostBind is a list of plugins that should be invoked after a pod is successfully bound.
   -->
   <p><code>postBind</code> 是一個在 Pod 已經被成功繫結之後要呼叫的外掛的列表。</p>
</td>
</tr>
<tr><td><code>multiPoint</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   MultiPoint is a simplified config section to enable plugins for all valid extension points.
Plugins enabled through MultiPoint will automatically register for every individual extension
point the plugin has implemented. Disabling a plugin through MultiPoint disables that behavior.
The same is true for disabling "&lowast;" through MultiPoint (no default plugins will be automatically registered).
Plugins can still be disabled through their individual extension points.
   -->
   <p><code>multiPoint</code> 是一個簡化的配置段落，用來為所有合法的擴充套件點啟用外掛。
   透過 <code>multiPoint</code> 啟用的外掛會自動註冊到外掛所實現的每個獨立的擴充套件點上。
   透過 <code>multiPoint</code> 禁用的外掛會禁用對應的操作行為。
   透過 <code>multiPoint</code> 所禁止的 &quot;&lowast;&quot; 
   也是如此，意味著所有預設外掛都不會被自動註冊。
   外掛也可以透過各個獨立的擴充套件點來禁用。</p>
   <!--
In terms of precedence, plugin config follows this basic hierarchy
  1. Specific extension points
  2. Explicitly configured MultiPoint plugins
  3. The set of default plugins, as MultiPoint plugins
This implies that a higher precedence plugin will run first and overwrite any settings within MultiPoint.
Explicitly user-configured plugins also take a higher precedence over default plugins.
Within this hierarchy, an Enabled setting takes precedence over Disabled. For example, if a plugin is
set in both `multiPoint.Enabled` and `multiPoint.Disabled`, the plugin will be enabled. Similarly,
including `multiPoint.Disabled = '&lowast;'` and `multiPoint.Enabled = pluginA` will still register that specific
plugin through MultiPoint. This follows the same behavior as all other extension point configurations.
   -->
   <p>就優先序而言，外掛配置遵從以下基本層次：</p>
   <ol>
     <li>特定的擴充套件點；</li>
     <li>顯式配置的 <code>multiPoint</code> 外掛；</li>
     <li>預設外掛的集合，以及 <code>multiPoint</code> 外掛。</li>
   </ol>
   <p>這意味著優先序較高的外掛會先被執行，並且覆蓋 <code>multiPoint</code> 中的任何配置。</p>
   <p>使用者顯式配置的外掛也會比預設外掛優先序高。</p>
   <p>在這樣的層次結構設計之下，<code>enabled</code> 的優先序高於 <code>disabled</code>。
   例如，某外掛同時出現在 <code>multiPoint.enabled</code> 和 <code>multiPoint.disalbed</code> 時，
   該外掛會被啟用。類似的，
   同時設定 <code>multiPoint.disabled = '&lowast;'</code>和 <code>multiPoint.enabled = pluginA</code> 時，
   外掛 pluginA 仍然會被註冊。這一設計與所有其他擴充套件點的配置行為是相符的。</p>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadConstraintsDefaulting`     {#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadConstraintsDefaulting}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 型別的別名）

**出現在：**

- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadArgs)

<!--
PodTopologySpreadConstraintsDefaulting defines how to set default constraints
for the PodTopologySpread plugin.
-->
<p>PodTopologySpreadConstraintsDefaulting
定義如何為 PodTopologySpread 外掛設定預設的約束。</p>

## `RequestedToCapacityRatioParam`     {#kubescheduler-config-k8s-io-v1beta3-RequestedToCapacityRatioParam}

<!--
**Appears in:**
-->
**出現在：**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy)

<!--
RequestedToCapacityRatioParam define RequestedToCapacityRatio parameters
-->
<p>RequestedToCapacityRatioParam 結構定義 RequestedToCapacityRatio 的引數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>shape</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   <!--
   Shape is a list of points defining the scoring function shape.
   -->
   <p><code>shape</code> 是一個定義評分函式曲線的計分點的列表。</p>
</td>
</tr>
</tbody>
</table>

## `ResourceSpec`     {#kubescheduler-config-k8s-io-v1beta3-ResourceSpec}

<!--
**Appears in:**
-->
**出現在：**

- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1beta3-NodeResourcesBalancedAllocationArgs)
- [ScoringStrategy](#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy)

<!--
ResourceSpec represents a single resource.
-->
<p>ResourceSpec 用來代表某個資源。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Name of the resource.
   -->
   <p>資源名稱。</p>
</td>
</tr>
<tr><td><code>weight</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <!--
   Weight of the resource.
   -->
   <p>資源權重。</p>
</td>
</tr>
</tbody>
</table>

## `ScoringStrategy`     {#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy}

<!--
**Appears in:**
-->
**出現在：**

- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs)

<!--
ScoringStrategy define ScoringStrategyType for node resource plugin
-->
<p>ScoringStrategy 為節點資源外掛定義 ScoringStrategyType。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>type</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ScoringStrategyType"><code>ScoringStrategyType</code></a>
</td>
<td>
   <!--
   Type selects which strategy to run.
   -->
   <p><code>type</code> 用來選擇要執行的策略。</p>
</td>
</tr>
<tr><td><code>resources</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   <!--
   Resources to consider when scoring.
The default resource set includes "cpu" and "memory" with an equal weight.
Allowed weights go from 1 to 100.
Weight defaults to 1 if not specified or explicitly set to 0.
   -->
   <p><code>resources</code> 設定在評分時要考慮的資源。</p>
   <p>預設的資源集合包含 &quot;cpu&quot; 和 &quot;memory&quot;，且二者權重相同。</p>
   <p>權重的取值範圍為 1 到 100。</p>
   <p>當權重未設定或者顯式設定為 0 時，意味著使用預設值 1。</p>
</td>
</tr>
<tr><td><code>requestedToCapacityRatio</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-RequestedToCapacityRatioParam"><code>RequestedToCapacityRatioParam</code></a>
</td>
<td>
   <!--
   Arguments specific to RequestedToCapacityRatio strategy.
   -->
   <p>特定於 RequestedToCapacityRatio 策略的引數。</p>
</td>
</tr>
</tbody>
</table>

## `ScoringStrategyType`     {#kubescheduler-config-k8s-io-v1beta3-ScoringStrategyType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 資料型別的別名）

**出現在：**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy)

<!--
ScoringStrategyType the type of scoring strategy used in NodeResourcesFit plugin.
-->
<p>ScoringStrategyType 是 NodeResourcesFit 外掛所使用的的評分策略型別。</p>

## `UtilizationShapePoint`     {#kubescheduler-config-k8s-io-v1beta3-UtilizationShapePoint}

<!--
**Appears in:**
-->
**出現在：**

- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1beta3-VolumeBindingArgs)
- [RequestedToCapacityRatioParam](#kubescheduler-config-k8s-io-v1beta3-RequestedToCapacityRatioParam)

<!--
UtilizationShapePoint represents single point of priority function shape.
-->
<p>UtilizationShapePoint 代表的是優先順序函式曲線中的一個評分點。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>utilization</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Utilization (x axis). Valid values are 0 to 100. Fully utilized node maps to 100.
   -->
   <p>利用率（x 軸）。合法值為 0 到 100。完全被利用的節點對映到 100。</p>
</td>
</tr>
<tr><td><code>score</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Score assigned to given utilization (y axis). Valid values are 0 to 10.
   -->
   <p>分配給指定利用率的分值（y 軸）。合法值為 0 到 10。</p>
</td>
</tr>
</tbody>
</table>
