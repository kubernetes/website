---
title: kube-scheduler 設定 (v1)
content_type: tool-reference
package: kubescheduler.config.k8s.io/v1
---
<!--
title: kube-scheduler Configuration (v1)
content_type: tool-reference
package: kubescheduler.config.k8s.io/v1
auto_generated: true
-->

<!--
## Resource Types
-->
## 資源類型 {#resource-types}

- [DefaultPreemptionArgs](#kubescheduler-config-k8s-io-v1-DefaultPreemptionArgs)
- [DynamicResourcesArgs](#kubescheduler-config-k8s-io-v1-DynamicResourcesArgs)
- [InterPodAffinityArgs](#kubescheduler-config-k8s-io-v1-InterPodAffinityArgs)
- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)
- [NodeAffinityArgs](#kubescheduler-config-k8s-io-v1-NodeAffinityArgs)
- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs)
- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)
- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs)
- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)

## `ClientConnectionConfiguration`     {#ClientConnectionConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

<!--
ClientConnectionConfiguration contains details for constructing a client.
-->
<p>ClientConnectionConfiguration 中包含用來構造客戶端所需的細節。</p>

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
   <p><code>kubeconfig</code> 字段爲指向 KubeConfig 文件的路徑。</p>
</td>
</tr>
<tr><td><code>acceptContentTypes</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   acceptContentTypes defines the Accept header sent by clients when connecting to a server, overriding the
default value of 'application/json'. This field will control all connections to the server used by a particular
client.
   -->
   <code>acceptContentTypes</code> 定義的是客戶端與伺服器建立連接時要發送的 Accept 頭部，
   這裏的設置值會覆蓋默認值 "application/json"。此字段會影響某特定客戶端與伺服器的所有連接。
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
   <code>contentType</code> 包含的是此客戶端向伺服器發送數據時使用的內容類型（Content Type）。
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
   <p><code>qps</code> 控制此連接允許的每秒查詢次數。</p>
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

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

<!--
DebuggingConfiguration holds configuration for Debugging related features.
-->
<p>DebuggingConfiguration 包含與調試功能相關的設定。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>enableProfiling</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   enableProfiling enables profiling via web interface host:port/debug/pprof/
   -->
   <p><code>enableProfiling</code> 字段允許通過 Web 接口 host:port/debug/pprof/ 執行性能分析。</p>
</td>
</tr>
<tr><td><code>enableContentionProfiling</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   enableContentionProfiling enables block profiling, if
enableProfiling is true.
   -->
   <p><code>enableContentionProfiling</code> 字段在 
   <code>enableProfiling</code> 爲 true 時啓用阻塞分析。</p>
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

<!--
LeaderElectionConfiguration defines the configuration of leader election
clients for components that can run with leader election enabled.
-->
<p>
LeaderElectionConfiguration 爲能夠支持領導者選舉的組件定義其領導者選舉客戶端的設定。
</p>

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
   <code>leaderElect</code> 允許領導者選舉客戶端在進入主循環執行之前先獲得領導者角色。
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
   <code>leaseDuration</code> 是非領導角色候選者在觀察到需要領導席位更新時要等待的時間；
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
   <code>renewDeadline</code> 設置的是當前領導者在停止扮演領導角色之前需要刷新領導狀態的時間間隔。
   此值必須小於或等於租約期限的長度。只有到啓用了領導者選舉時此字段纔有意義。
   </p>
</td>
</tr>
<tr><td><code>retryPeriod</code> <B>[Required<!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   retryPeriod is the duration the clients should wait between attempting
acquisition and renewal of a leadership. This is only applicable if
leader election is enabled.
   -->
   <p>
   <code>retryPeriod</code> 是客戶端在連續兩次嘗試獲得或者刷新領導狀態之間需要等待的時長。
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
   resourceName indicates the namespace of resource object that will be used to lock
during leader election cycles.
   -->
   <p><code>resourceNamespace</code> 字段給出在領導者選舉期間要作爲鎖來使用的資源對象所在名字空間。</p>
</td>
</tr>
</tbody>
</table>

## `DefaultPreemptionArgs`     {#kubescheduler-config-k8s-io-v1-DefaultPreemptionArgs}

<!--
DefaultPreemptionArgs holds arguments used to configure the
DefaultPreemption plugin.
-->
<p>DefaultPreemptionArgs 包含用來設定 DefaultPreemption 插件的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
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
   <p><code>minCandidateNodesPercentage</code> 字段爲試運行搶佔時 shortlist 中候選節點數的下限，
   數值爲節點數的百分比。字段值必須介於 [0, 100] 之間。未指定時默認值爲整個叢集規模的 10%。</p>
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
numCandidates = max(numNodes * minCandidateNodesPercentage, minCandidateNodesAbsolute)
We say &quot;likely&quot; because there are other factors such as PDB violations
that play a role in the number of candidates shortlisted. Must be at least
0 nodes. Defaults to 100 nodes if unspecified.
   -->
   <p><code>minCandidateNodesAbsolute</code> 字段設置 shortlist 中候選節點的絕對下限。
   用於試運行搶佔而列舉的候選節點個數近似於通過下面的公式計算的：<br/>
   候選節點數 = max(節點數 * minCandidateNodesPercentage, minCandidateNodesAbsolute)<br/>
   之所以說是&quot;近似於&quot;是因爲存在一些類似於 PDB 違例這種因素，
   會影響到進入 shortlist 中候選節點的個數。
   取值至少爲 0 節點。若未設置默認爲 100 節點。</p>
</td>
</tr>
</tbody>
</table>

## `DynamicResourcesArgs`     {#kubescheduler-config-k8s-io-v1-DynamicResourcesArgs}

<p>
<!--
DynamicResourcesArgs holds arguments used to configure the DynamicResources plugin.
-->
DynamicResourcesArgs 封裝了用來設定 DynamicResources 插件的參數。
</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>DynamicResourcesArgs</code></td></tr>
    
  
<tr><td><code>filterTimeout</code> <B><!--[Required]-->必需</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
<!--
FilterTimeout limits the amount of time that the filter operation may
take per node to search for devices that can be allocated to scheduler
a pod to that node.
-->
<code>filterTimeout</code> 限制了過濾操作每節點可花費的時間，
過濾操作用於搜索可以分配給該節點調度 Pod 的設備。
</p>
<p>
<!--
In typical scenarios, this operation should complete in 10 to 200
milliseconds, but could also be longer depending on the number of
requests per ResourceClaim, number of ResourceClaims, number of
published devices in ResourceSlices, and the complexity of the
requests. Other checks besides CEL evaluation also take time (usage
checks, match attributes, etc.).
-->
在典型場景中，此操作應在 10 到 200 毫秒內完成，
但根據每個 ResourceClaim 的請求數量、ResourceClaim 的數量、
ResourceSlices 中發佈的設備數量以及請求的複雜性，也可能需要更長時間。
除了 CEL 評估之外的其他檢查（使用情況檢查、匹配屬性等）也需要時間。
</p>
<p>
<!--
Therefore the scheduler plugin applies this timeout. If the timeout
is reached, the Pod is considered unschedulable for the node.
If filtering succeeds for some other node(s), those are picked instead.
If filtering fails for all of them, the Pod is placed in the
unschedulable queue. It will get checked again if changes in
e.g. ResourceSlices or ResourceClaims indicate that
another scheduling attempt might succeed. If this fails repeatedly,
exponential backoff slows down future attempts.
-->
因此，調度器插件應用了此超時。如果達到超時，
Pod 將被視爲無法調度到該節點。
如果其他一些節點的過濾成功，那麼這些節點將被選中。
如果所有節點的過濾都失敗，Pod 將被放入無法調度隊列。
如果有變化（例如 ResourceSlices 或 ResourceClaims 的變化）
表明另一次調度嘗試可能會成功，則會再次檢查它。
如果這反覆失敗，指數退避機制將減慢未來的嘗試。
</p>
<p>
<!--
The default is 10 seconds.
This is sufficient to prevent worst-case scenarios while not impacting normal
usage of DRA. However, slow filtering can slow down Pod scheduling
also for Pods not using DRA. Administators can reduce the timeout
after checking the
<code>scheduler_framework_extension_point_duration_seconds</code> metrics.
-->
默認是 10 秒。
這足以防止最壞的情況發生，而不會影響 DRA 的正常使用。
然而，緩慢的過濾也會減慢不使用 DRA 的 Pod 的調度。
管理員可以在檢查
<code>scheduler_framework_extension_point_duration_seconds</code> 指標後減少超時時間。
</p>
<p>
<!--
Setting it to zero completely disables the timeout.
-->
將其設置爲零將完全禁用超時。
</p>
</td>
</tr>
</tbody>
</table>

## `InterPodAffinityArgs`     {#kubescheduler-config-k8s-io-v1-InterPodAffinityArgs}

<!--
InterPodAffinityArgs holds arguments used to configure the InterPodAffinity plugin.
-->
<p>InterPodAffinityArgs 包含用來設定 InterPodAffinity 插件的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InterPodAffinityArgs</code></td></tr>

<tr><td><code>hardPodAffinityWeight</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   HardPodAffinityWeight is the scoring weight for existing pods with a
matching hard affinity to the incoming pod.
   -->
   <p><code>hardPodAffinityWeight</code> 字段是一個計分權重值。針對新增的 Pod，要對現存的、
   帶有與新 Pod 匹配的硬性親和性設置的 Pods 計算親和性得分。
</td>
</tr>
<tr><td><code>ignorePreferredTermsOfExistingPods</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   IgnorePreferredTermsOfExistingPods configures the scheduler to ignore existing pods' preferred affinity
rules when scoring candidate nodes, unless the incoming pod has inter-pod affinities.
   -->
   <p>ignorePreferredTermsOfExistingPods 設定調度器在爲候選節點評分時忽略現有 Pod 的優選親和性規則，
   除非傳入的 Pod 具有 Pod 間的親和性。</p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerConfiguration`     {#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration}

<!--
KubeSchedulerConfiguration configures a scheduler
-->
<p>KubeSchedulerConfiguration 用來設定調度器。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeSchedulerConfiguration</code></td></tr>

<tr><td><code>parallelism</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Parallelism defines the amount of parallelism in algorithms for scheduling a Pods. Must be greater than 0. Defaults to 16
   -->
   <p>
   <code>parallelism</code> 字段設置爲調度 Pod 而執行算法時的併發度。此值必須大於 0。默認值爲 16。
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
   <p>LeaderElection 字段用來定義領導者選舉客戶端的設定。</p>
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
   <p><code>clientConnection</code> 字段爲與 API 伺服器通信時使用的代理伺服器設置 kubeconfig 文件和客戶端連接設定。</p>
</td>
</tr>
<tr><td><code>DebuggingConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#DebuggingConfiguration"><code>DebuggingConfiguration</code></a>
</td>
<!--
(Members of <code>DebuggingConfiguration</code> are embedded into this type.)
-->
<td>（<code>DebuggingConfiguration</code> 的成員被內嵌到此類型中）
   <!--
   DebuggingConfiguration holds configuration for Debugging related features
   TODO: We might wanna make this a substruct like Debugging componentbaseconfigv1alpha1.DebuggingConfiguration
   -->
   <p><code>DebuggingConfiguration</code> 字段設置與調試相關功能特性的設定。
   TODO：我們可能想把它做成一個子結構，像調試 component-base/config/v1alpha1.DebuggingConfiguration 一樣。</p>
</td>
</tr>
<tr><td><code>percentageOfNodesToScore</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!--
   PercentageOfNodesToScore is the percentage of all nodes that once found feasible
for running a pod, the scheduler stops its search for more feasible nodes in
the cluster. This helps improve scheduler's performance. Scheduler always tries to find
at least &quot;minFeasibleNodesToFind&quot; feasible nodes no matter what the value of this flag is.
Example: if the cluster size is 500 nodes and the value of this flag is 30,
then scheduler stops finding further feasible nodes once it finds 150 feasible ones.
When the value is 0, default percentage (5%--50% based on the size of the cluster) of the
nodes will be scored. It is overridden by profile level PercentageOfNodesToScore.
   -->
   <code>percentageOfNodesToScore</code> 字段爲所有節點的百分比，一旦調度器找到所設置比例的、能夠運行 Pod 的節點，
   則停止在叢集中繼續尋找更合適的節點。這一設定有助於提高調度器的性能。
   調度器總會嘗試尋找至少 &quot;minFeasibleNodesToFind&quot; 個可行節點，無論此字段的取值如何。
   例如：當叢集規模爲 500 個節點，而此字段的取值爲 30，
   則調度器在找到 150 個合適的節點後會停止繼續尋找合適的節點。當此值爲 0 時，
   調度器會使用默認節點數百分比（基於叢集規模確定的值，在 5% 到 50% 之間）來執行打分操作。
   它可被設定文件級別的 PercentageOfNodesToScore 覆蓋。
   </p>
</td>
</tr>
<tr><td><code>podInitialBackoffSeconds</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <p>
   <!--
   PodInitialBackoffSeconds is the initial backoff for unschedulable pods.
If specified, it must be greater than 0. If this value is null, the default value (1s)
will be used.
   -->
   <code>podInitialBackoffSeconds</code> 字段設置不可調度 Pod 的初始回退秒數。
   如果設置了此字段，其取值必須大於零。若此值爲 null，則使用默認值（1s）。
   </p>
</td>
</tr>
<tr><td><code>podMaxBackoffSeconds</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <!--
   podMaxBackoffSeconds is the max backoff for unschedulable pods.
If specified, it must be greater than podInitialBackoffSeconds. If this value is null,
the default value (10s) will be used.
   -->
   <p><code>podMaxBackoffSeconds</code> 字段設置不可調度的 Pod 的最大回退秒數。
   如果設置了此字段，則其值必須大於 podInitialBackoffSeconds 字段值。
   如果此值設置爲 null，則使用默認值（10s）。</p>
</td>
</tr>
<tr><td><code>profiles</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile"><code>[]KubeSchedulerProfile</code></a>
</td>
<td>
   <!--
   Profiles are scheduling profiles that kube-scheduler supports. Pods can
choose to be scheduled under a particular profile by setting its associated
scheduler name. Pods that don't specify any scheduler name are scheduled
with the &quot;default-scheduler&quot; profile, if present here.
   -->
   <p>
   <code>profiles</code> 字段爲 kube-scheduler 所支持的方案（profiles）。
   Pod 可以通過設置其對應的調度器名稱來選擇使用特定的方案。
   未指定調度器名稱的 Pod 會使用 &quot;default-scheduler&quot; 方案來調度，如果存在的話。
   </p>
</td>
</tr>
<tr><td><code>extenders</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-Extender"><code>[]Extender</code></a>
</td>
<td>
   <!--
   Extenders are the list of scheduler extenders, each holding the values of how to communicate
with the extender. These extenders are shared by all scheduler profiles.
   -->
   <p><code>extenders</code> 字段爲調度器擴展模塊（Extender）的列表，每個元素包含如何與某擴展模塊通信的設定信息。
   所有調度器方案會共享此擴展模塊列表。</p>
</td>
</tr>
<tr><td><code>delayCacheUntilActive</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!--
   DelayCacheUntilActive specifies when to start caching. If this is true and leader election is enabled,
   the scheduler will wait to fill informer caches until it is the leader. Doing so will have slower
   failover with the benefit of lower memory overhead while waiting to become leader.
   Defaults to false.
   -->
   DelayCacheUntilActive 指定何時開始緩存。如果字段設置爲 true 並且啓用了領導者選舉，
   則調度程序將等待填充通知者緩存，直到它成爲領導者，這樣做會減慢故障轉移速度，
   並在等待成爲領導者時降低內存開銷。
   默認爲 false。
   </p>
</td>
</tr>
</tbody>
</table>

## `NodeAffinityArgs`     {#kubescheduler-config-k8s-io-v1-NodeAffinityArgs}

<!--
NodeAffinityArgs holds arguments to configure the NodeAffinity plugin.
-->
<p>NodeAffinityArgs 中包含設定 NodeAffinity 插件的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeAffinityArgs</code></td></tr>

<tr><td><code>addedAffinity</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#nodeaffinity-v1-core"><code>core/v1.NodeAffinity</code></a>
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
   <code>addedAffinity</code> 會作爲附加的親和性屬性添加到所有 Pod 的規約中指定的 NodeAffinity 中。
   換言之，節點需要同時滿足 addedAffinity 和 .spec.nodeAffinity。
   默認情況下，addedAffinity 爲空（與所有節點匹配）。使用了 addedAffinity 時，
   某些帶有已經能夠與某特定節點匹配的親和性需求的 Pod （例如 DaemonSet Pod）可能會繼續呈現不可調度狀態。
   </p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesBalancedAllocationArgs`     {#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs}

<!--
NodeResourcesBalancedAllocationArgs holds arguments used to configure NodeResourcesBalancedAllocation plugin.
-->
<p>NodeResourcesBalancedAllocationArgs 包含用來設定 NodeResourcesBalancedAllocation 插件的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesBalancedAllocationArgs</code></td></tr>

<tr><td><code>resources</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   <!--
   Resources to be managed, the default is &quot;cpu&quot; and &quot;memory&quot; if not specified.
   -->
   <p>要管理的資源；如果未設置，則默認值爲 &quot;cpu&quot; 和 &quot;memory&quot;。</p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesFitArgs`     {#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs}

<!--
NodeResourcesFitArgs holds arguments used to configure the NodeResourcesFit plugin.
-->
<p>NodeResourcesFitArgs 包含用來設定 NodeResourcesFit 插件的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesFitArgs</code></td></tr>

<tr><td><code>ignoredResources</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   IgnoredResources is the list of resources that NodeResources fit filter
should ignore. This doesn't apply to scoring.
   -->
   <p><code>ignoredResources</code> 字段爲 NodeResources 匹配過濾器要忽略的資源列表。此列表不影響節點打分。</p>
</td>
</tr>
<tr><td><code>ignoredResourceGroups</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   IgnoredResourceGroups defines the list of resource groups that NodeResources fit filter should ignore.
e.g. if group is [&quot;example.com&quot;], it will ignore all resource names that begin
with &quot;example.com&quot;, such as &quot;example.com/aaa&quot; and &quot;example.com/bbb&quot;.
A resource group name can't contain '/'. This doesn't apply to scoring.
   -->
   <p><code>ignoredResourceGroups</code> 字段定義 NodeResources 匹配過濾器要忽略的資源組列表。
   例如，如果設定值爲 [&quot;example.com&quot;]，
   則以 &quot;example.com&quot; 開頭的資源名
   （如&quot;example.com/aaa&quot; 和 &quot;example.com/bbb&quot;）都會被忽略。
   資源組名稱中不可以包含 '/'。此設置不影響節點的打分。</p>
</td>
</tr>
<tr><td><code>scoringStrategy</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ScoringStrategy"><code>ScoringStrategy</code></a>
</td>
<td>
   <!--
   ScoringStrategy selects the node resource scoring strategy.
The default strategy is LeastAllocated with an equal &quot;cpu&quot; and &quot;memory&quot; weight.
   -->
   <p><code>scoringStrategy</code> 用來選擇節點資源打分策略。默認的策略爲 LeastAllocated，
   且 &quot;cpu&quot; 和 &quot;memory&quot; 的權重相同。</p>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadArgs`     {#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs}

<!--
PodTopologySpreadArgs holds arguments used to configure the PodTopologySpread plugin.
-->
<p>PodTopologySpreadArgs 包含用來設定 PodTopologySpread 插件的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodTopologySpreadArgs</code></td></tr>

<tr><td><code>defaultConstraints</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#topologyspreadconstraint-v1-core"><code>[]core/v1.TopologySpreadConstraint</code></a>
</td>
<td>
   <!--
   DefaultConstraints defines topology spread constraints to be applied to
Pods that don't define any in <code>pod.spec.topologySpreadConstraints</code>.
<code>.defaultConstraints[*].labelSelectors</code> must be empty, as they are
deduced from the Pod's membership to Services, ReplicationControllers,
ReplicaSets or StatefulSets.
When not empty, .defaultingType must be &quot;List&quot;.
   -->
   <p><code>defaultConstraints</code> 字段針對未定義 <code>.spec.topologySpreadConstraints</code> 的 Pod，
   爲其提供拓撲分佈約束。<code>.defaultConstraints[&lowast;].labelSelectors</code>必須爲空，
   因爲這一信息要從 Pod 所屬的 Service、ReplicationController、ReplicaSet 或 StatefulSet 來推導。
   此字段不爲空時，<code>.defaultingType</code> 必須爲 &quot;List&quot;。</p>
</td>
</tr>
<tr><td><code>defaultingType</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-PodTopologySpreadConstraintsDefaulting"><code>PodTopologySpreadConstraintsDefaulting</code></a>
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
   可選值爲 &quot;System&quot; 或 &quot;List&quot;。</p>
   <ul>
     <li>&quot;System&quot;：使用 Kubernetes 定義的約束，將 Pod 分佈到不同節點和可用區；</li>
     <li>&quot;List&quot;：使用 <code>.defaultConstraints</code> 中定義的約束。</li>
   </ul>
   <p>默認值爲 "System"。</p>
</td>
</tr>
</tbody>
</table>

## `VolumeBindingArgs`     {#kubescheduler-config-k8s-io-v1-VolumeBindingArgs}

<!--
VolumeBindingArgs holds arguments used to configure the VolumeBinding plugin.
-->
<p>VolumeBindingArgs 包含用來設定 VolumeBinding 插件的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
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
   <p><code>bindTimeoutSeconds</code> 字段設置卷綁定操作的超時秒數。字段值必須是非負數。
   取值爲 0 意味着不等待。如果此值爲 null，則使用默認值（600）。</p>
</td>
</tr>
<tr><td><code>shape</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   <!--
   Shape specifies the points defining the score function shape, which is
used to score nodes based on the utilization of provisioned PVs.
The utilization is calculated by dividing the total requested
storage of the pod by the total capacity of feasible PVs on each node.
Each point contains utilization (ranges from 0 to 100) and its
associated score (ranges from 0 to 10). You can turn the priority by
specifying different scores for different utilization numbers.
The default shape points are:
1) 10 for 0 utilization
2) 0 for 100 utilization
All points must be sorted in increasing order by utilization.
   -->
   <p><code>shape</code> 用來設置打分函數曲線所使用的計分點，
   這些計分點用來基於製備的 PV 卷的利用率爲節點打分。
   卷的利用率是計算得來的，
   將 Pod 所請求的總的存儲空間大小除以每個節點上可用的總的卷容量。
   每個計分點包含利用率（範圍從 0 到 100）和其對應的得分（範圍從 0 到 10）。
   你可以通過爲不同的使用率值設置不同的得分來反轉優先級：</p>
   <p>默認的曲線計分點爲：</p>
   <ol>
     <li>利用率爲 10 時得分爲 0；</li>
     <li>利用率爲 0 時得分爲 100。</li>
   </ol>
   <p>所有計分點必須按利用率值的升序來排序。</p>
</td>
</tr>
</tbody>
</table>

## `Extender`     {#kubescheduler-config-k8s-io-v1-Extender}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

<!--
Extender holds the parameters used to communicate with the extender. If a verb is unspecified/empty,
it is assumed that the extender chose not to provide that extension.
-->
<p>Extender 包含與擴展模塊（Extender）通信所用的參數。
如果未指定 verb 或者 verb 爲空，則假定對應的擴展模塊選擇不提供該擴展功能。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>urlPrefix</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   URLPrefix at which the extender is available
   -->
   <p>用來訪問擴展模塊的 URL 前綴。</p>
</td>
</tr>
<tr><td><code>filterVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the filter call, empty if not supported. This verb is appended to the URLPrefix when issuing the filter call to extender.
   -->
   <p>filter 調用所使用的動詞，如果不支持過濾操作則爲空。
   此動詞會在向擴展模塊發送 filter 調用時追加到 urlPrefix 後面。</p>
</td>
</tr>
<tr><td><code>preemptVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the preempt call, empty if not supported. This verb is appended to the URLPrefix when issuing the preempt call to extender.
   -->
   <p>preempt 調用所使用的動詞，如果不支持 preempt 操作則爲空。
   此動詞會在向擴展模塊發送 preempt 調用時追加到 urlPrefix 後面。</p>
</td>
</tr>
<tr><td><code>prioritizeVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the prioritize call, empty if not supported. This verb is appended to the URLPrefix when issuing the prioritize call to extender.
   -->
   <p>prioritize 調用所使用的動詞，如果不支持 prioritize 操作則爲空。
   此動詞會在向擴展模塊發送 prioritize 調用時追加到 urlPrefix 後面。</p>
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
   <p>針對 prioritize 調用所生成的節點分數要使用的數值係數。
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
   <p>bind 調用所使用的動詞，如果不支持 bind 操作則爲空。
   此動詞會在向擴展模塊發送 bind 調用時追加到 urlPrefix 後面。
   如果擴展模塊實現了此方法，擴展模塊要負責將 Pod 綁定到 API 伺服器。
   只有一個擴展模塊可以實現此函數。</p>
</td>
</tr>
<tr><td><code>enableHTTPS</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   EnableHTTPS specifies whether https should be used to communicate with the extender
   -->
   <p><code>enableHTTPS</code> 字段設置是否需要使用 HTTPS 來與擴展模塊通信。</p>
</td>
</tr>
<tr><td><code>tlsConfig</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig"><code>ExtenderTLSConfig</code></a>
</td>
<td>
   <!--
   TLSConfig specifies the transport layer security config
   -->
   <p><code>tlsConfig</code> 字段設置傳輸層安全性（TLS）設定。</p>
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
   <p><code>httpTimeout</code> 給出擴展模塊功能調用的超時值。filter 操作超時會導致 Pod 無法被調度。
   prioritize 操作超時會被忽略，
   Kubernetes 或者其他擴展模塊所給出的優先級值會被用來選擇節點。</p>
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
   <p><code>nodeCacheCapable</code> 指示擴展模塊可以緩存節點信息，從而調度器應該發送關於可選節點的最少信息，
   假定擴展模塊已經緩存了叢集中所有節點的全部詳細信息。</p>
</td>
</tr>
<tr><td><code>managedResources</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-ExtenderManagedResource"><code>[]ExtenderManagedResource</code></a>
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
   <p><code>managedResources</code> 是一個由此擴展模塊所管理的擴展資源的列表。</p>
   <ul>
     <li>如果某 Pod 請求了此列表中的至少一個擴展資源，則 Pod 會在 filter、
      prioritize 和 bind （如果擴展模塊可以執行綁定操作）階段被髮送到該擴展模塊。</li>
     <li>如果某資源上設置了 <code>ignoredByScheduler</code> 爲 true，則 kube-scheduler
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
   <p><code>ignorable</code> 用來設置擴展模塊是否是可忽略的。
   換言之，當擴展模塊返回錯誤或者完全不可達時，調度操作不應失敗。</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderManagedResource`     {#kubescheduler-config-k8s-io-v1-ExtenderManagedResource}

<!--
**Appears in:**
-->
**出現在：**

- [Extender](#kubescheduler-config-k8s-io-v1-Extender)

<!--
ExtenderManagedResource describes the arguments of extended resources
managed by an extender.
-->
<p>ExtenderManagedResource 描述某擴展模塊所管理的擴展資源的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Name is the extended resource name.
   -->
   <p>擴展資源的名稱。</p>
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
   <p><code>ignoredByScheduler</code> 標明 kube-scheduler 是否應在應用斷言時忽略此資源。</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderTLSConfig`     {#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig}

<!--
**Appears in:**
-->
**出現在：**

- [Extender](#kubescheduler-config-k8s-io-v1-Extender)

<!--
ExtenderTLSConfig contains settings to enable TLS with extender
-->
<p>ExtenderTLSConfig 包含啓用與擴展模塊間 TLS 傳輸所需的設定參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>insecure</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   Server should be accessed without verifying the TLS certificate. For testing only.
   -->
   <p>訪問伺服器時不需要檢查 TLS 證書。此設定僅針對測試用途。</p>
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
   <p><code>serverName</code> 會被髮送到伺服器端，作爲 SNI 標誌；
   客戶端會使用此設置來檢查伺服器證書。
   如果 <code>serverName</code> 爲空，則會使用聯繫伺服器時所用的主機名。
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
   <p>伺服器端所要求的 TLS 客戶端祕鑰認證。</p>
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
   <p><code>certData</code> 包含 PEM 編碼的字節流（通常從某客戶端證書文件讀入）。
   此字段優先級高於 certFile 字段。</p>
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
   <p><code>keyData</code> 包含 PEM 編碼的字節流（通常從某客戶端證書祕鑰文件讀入）。
   此字段優先級高於 keyFile 字段。</p>
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
   <p><code>caData</code> 包含 PEM 編碼的字節流（通常從某根證書包文件讀入）。
   此字段優先級高於 caFile 字段。</p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerProfile`     {#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

<!--
KubeSchedulerProfile is a scheduling profile.
-->
<p>KubeSchedulerProfile 是一個調度方案。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>schedulerName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   SchedulerName is the name of the scheduler associated to this profile.
If SchedulerName matches with the pod's &quot;spec.schedulerName&quot;, then the pod
is scheduled with this profile.
   -->
   <p><code>schedulerName</code> 是與此調度方案相關聯的調度器的名稱。
   如果 <code>schedulerName</code> 與 Pod 的 <code>spec.schedulerName</code> 匹配，
   則該 Pod 會使用此方案來調度。</p>
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
at least &quot;minFeasibleNodesToFind&quot; feasible nodes no matter what the value of this flag is.
Example: if the cluster size is 500 nodes and the value of this flag is 30,
then scheduler stops finding further feasible nodes once it finds 150 feasible ones.
When the value is 0, default percentage (5%--50% based on the size of the cluster) of the
nodes will be scored. It will override global PercentageOfNodesToScore. If it is empty,
global PercentageOfNodesToScore will be used.
  -->
   <p>percentageOfNodesToScore 是已發現可運行 Pod 的節點與所有節點的百分比，
   調度器所發現的可行節點到達此閾值時，將停止在叢集中繼續搜索可行節點。
這有助於提高調度器的性能。無論此標誌的值是多少，調度器總是嘗試至少找到 “minFeasibleNodesToFind” 個可行的節點。
例如：如果叢集大小爲 500 個節點並且此標誌的值爲 30，則調度器在找到 150 個可行節點後將停止尋找更多可行的節點。
當值爲 0 時，默認百分比（根據叢集大小爲 5% - 50%）的節點將被評分。此設置值將覆蓋全局的 PercentageOfNodesToScore 值。
如果爲空，將使用全局 PercentageOfNodesToScore。</p>
</td>
</tr>
<tr><td><code>plugins</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-Plugins"><code>Plugins</code></a>
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
   <p><code>plugins</code> 設置一組應該被啓用或禁止的插件。
   被啓用的插件是指除了默認插件之外需要被啓用的插件。
   被禁止的插件是指需要被禁用的默認插件。</p>
   <p>如果針對某個擴展點沒有設置被啓用或被禁止的插件，
   則使用該擴展點的默認插件（如果有的話）。如果設置了 QueueSort 插件，
   則同一個 QueueSort 插件和 <code>pluginConfig</code> 要被設置到所有調度方案之上。
   </p>
</td>
</tr>
<tr><td><code>pluginConfig</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginConfig"><code>[]PluginConfig</code></a>
</td>
<td>
   <!--
   PluginConfig is an optional set of custom plugin arguments for each plugin.
Omitting config args for a plugin is equivalent to using the default config
for that plugin.
   -->
   <p><code>pluginConfig</code> 是爲每個插件提供的一組可選的定製插件參數。
   如果忽略了插件的設定參數，則意味着使用該插件的默認設定。</p>
</td>
</tr>
</tbody>
</table>

## `Plugin`     {#kubescheduler-config-k8s-io-v1-Plugin}

<!--
**Appears in:**
-->
**出現在：**

- [PluginSet](#kubescheduler-config-k8s-io-v1-PluginSet)

<!--
Plugin specifies a plugin name and its weight when applicable. Weight is used only for Score plugins.
-->
<p>Plugin 指定插件的名稱及其權重（如果適用的話）。權重僅用於評分（Score）插件。</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Name defines the name of plugin
   -->
   <p>插件的名稱。</p>
</td>
</tr>
<tr><td><code>weight</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Weight defines the weight of plugin, only used for Score plugins.
   -->
   <p>插件的權重；僅適用於評分（Score）插件。</p>
</td>
</tr>
</tbody>
</table>

## `PluginConfig`     {#kubescheduler-config-k8s-io-v1-PluginConfig}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)

<!--
PluginConfig specifies arguments that should be passed to a plugin at the time of initialization.
A plugin that is invoked at multiple extension points is initialized once. Args can have arbitrary structure.
It is up to the plugin to process these Args.
-->
<p>PluginConfig 給出初始化階段要傳遞給插件的參數。
在多個擴展點被調用的插件僅會被初始化一次。
參數可以是任意結構。插件負責處理這裏所傳的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Name defines the name of plugin being configured
   -->
   <p><code>name</code> 是所設定的插件的名稱。</p>
</td>
</tr>
<tr><td><code>args</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <!--
   Args defines the arguments passed to the plugins at the time of initialization. Args can have arbitrary structure.
   -->
   <p><code>args</code> 定義在初始化階段要傳遞給插件的參數。參數可以爲任意結構。</p>
</td>
</tr>
</tbody>
</table>

## `PluginSet`     {#kubescheduler-config-k8s-io-v1-PluginSet}

<!--
**Appears in:**
-->
**出現在：**

- [Plugins](#kubescheduler-config-k8s-io-v1-Plugins)

<!--
PluginSet specifies enabled and disabled plugins for an extension point.
If an array is empty, missing, or nil, default plugins at that extension point will be used.
-->
<p>PluginSet 爲某擴展點設置要啓用或禁用的插件。
如果數組爲空，或者取值爲 null，則使用該擴展點的默認插件集合。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>enabled</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   <!--
   Enabled specifies plugins that should be enabled in addition to default plugins.
If the default plugin is also configured in the scheduler config file, the weight of plugin will
be overridden accordingly.
These are called after default plugins and in the same order specified here.
   -->
   <p><code>enabled</code> 設置在默認插件之外要啓用的插件。
   如果在調度器的設定文件中也設定了默認插件，則對應插件的權重會被覆蓋。
   此處所設置的插件會在默認插件之後被調用，調用順序與數組中元素順序相同。</p>
</td>
</tr>
<tr><td><code>disabled</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   <!--
   Disabled specifies default plugins that should be disabled.
When all default plugins need to be disabled, an array containing only one &quot;*&quot; should be provided.
   -->
   <p><code>disabled</code> 設置要被禁用的默認插件。
   如果需要禁用所有的默認插件，應該提供僅包含一個元素 "&lowast;" 的數組。</p>
</td>
</tr>
</tbody>
</table>

## `Plugins`     {#kubescheduler-config-k8s-io-v1-Plugins}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)

<!--
Plugins include multiple extension points. When specified, the list of plugins for
a particular extension point are the only ones enabled. If an extension point is
omitted from the config, then the default set of plugins is used for that extension point.
Enabled plugins are called in the order specified here, after default plugins. If they need to
be invoked before default plugins, default plugins must be disabled and re-enabled here in desired order.
-->
<p>Plugins 結構中包含多個擴展點。當此結構被設置時，
針對特定擴展點所啓用的所有插件都在這一列表中。
如果設定中不包含某個擴展點，則使用該擴展點的默認插件集合。
被啓用的插件的調用順序與這裏指定的順序相同，都在默認插件之後調用。
如果它們需要在默認插件之前調用，則需要先行禁止默認插件，
之後在這裏按期望的順序重新啓用。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>preEnqueue</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--PreEnqueue is a list of plugins that should be invoked before adding pods to the scheduling queue.-->
   <p>preEnqueue 是在將 Pod 添加到調度隊列之前應調用的插件的列表。</p>
</td>
</tr>
<tr><td><code>queueSort</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   QueueSort is a list of plugins that should be invoked when sorting pods in the scheduling queue.
   -->
   <p><code>queueSort</code> 是一個在對調度隊列中 Pod 排序時要調用的插件列表。</p>
</td>
</tr>
<tr><td><code>preFilter</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PreFilter is a list of plugins that should be invoked at "PreFilter" extension point of the scheduling framework.
   -->
   <p><code>preFilter</code> 是一個在調度框架中 &quot;PreFilter（預過濾）&quot;擴展點上要調用的插件列表。</p>
</td>
</tr>
<tr><td><code>filter</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Filter is a list of plugins that should be invoked when filtering out nodes that cannot run the Pod.
   -->
   <p><code>filter</code> 是一個在需要過濾掉無法運行 Pod 的節點時被調用的插件列表。</p>
</td>
</tr>
<tr><td><code>postFilter</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PostFilter is a list of plugins that are invoked after filtering phase, but only when no feasible nodes were found for the pod.
   -->
   <p><code>postFilter</code> 是一個在過濾階段結束後會被調用的插件列表；
   這裏的插件只有在找不到合適的節點來運行 Pod 時纔會被調用。</p>
</td>
</tr>
<tr><td><code>preScore</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PreScore is a list of plugins that are invoked before scoring.
   -->
   <p><code>preScore</code> 是一個在打分之前要調用的插件列表。</p>
</td>
</tr>
<tr><td><code>score</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Score is a list of plugins that should be invoked when ranking nodes that have passed the filtering phase.
   -->
   <p><code>score</code> 是一個在對已經通過過濾階段的節點進行排序時調用的插件的列表。</p>
</td>
</tr>
<tr><td><code>reserve</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Reserve is a list of plugins invoked when reserving/unreserving resources
after a node is assigned to run the pod.
   -->
   <p><code>reserve</code> 是一組在運行 Pod 的節點已被選定後，需要預留或者釋放資源時調用的插件的列表。</p>
</td>
</tr>
<tr><td><code>permit</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Permit is a list of plugins that control binding of a Pod. These plugins can prevent or delay binding of a Pod.
   -->
   <p><code>permit</code> 是一個用來控制 Pod 綁定關係的插件列表。
   這些插件可以禁止或者延遲 Pod 的綁定。</p>
</td>
</tr>
<tr><td><code>preBind</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PreBind is a list of plugins that should be invoked before a pod is bound.
   -->
   <p><code>preBind</code> 是一個在 Pod 被綁定到某節點之前要被調用的插件的列表。</p>
</td>
</tr>
<tr><td><code>bind</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Bind is a list of plugins that should be invoked at "Bind" extension point of the scheduling framework.
The scheduler call these plugins in order. Scheduler skips the rest of these plugins as soon as one returns success.
   -->
   <p>
   <code>bind</code> 是一個在調度框架中 &quot;Bind（綁定）&quot;擴展點上要調用的插件的列表。
   調度器按順序調用這些插件。只要其中某個插件返回成功，則調度器就略過餘下的插件。
   </p>
</td>
</tr>
<tr><td><code>postBind</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PostBind is a list of plugins that should be invoked after a pod is successfully bound.
   -->
   <p><code>postBind</code> 是一個在 Pod 已經被成功綁定之後要調用的插件的列表。</p>
</td>
</tr>
<tr><td><code>multiPoint</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   MultiPoint is a simplified config section to enable plugins for all valid extension points.
Plugins enabled through MultiPoint will automatically register for every individual extension
point the plugin has implemented. Disabling a plugin through MultiPoint disables that behavior.
The same is true for disabling "&lowast;" through MultiPoint (no default plugins will be automatically registered).
Plugins can still be disabled through their individual extension points.
   -->
   <p><code>multiPoint</code> 是一個簡化的設定段落，用來爲所有合法的擴展點啓用插件。
   通過 <code>multiPoint</code> 啓用的插件會自動註冊到插件所實現的每個獨立的擴展點上。
   通過 <code>multiPoint</code> 禁用的插件會禁用對應的操作行爲。
   通過 <code>multiPoint</code> 所禁止的 &quot;&lowast;&quot; 
   也是如此，意味着所有默認插件都不會被自動註冊。
   插件也可以通過各個獨立的擴展點來禁用。</p>
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
   <p>就優先序而言，插件設定遵從以下基本層次：</p>
   <ol>
     <li>特定的擴展點；</li>
     <li>顯式設定的 <code>multiPoint</code> 插件；</li>
     <li>默認插件的集合，以及 <code>multiPoint</code> 插件。</li>
   </ol>
   <p>這意味着優先序較高的插件會先被運行，並且覆蓋 <code>multiPoint</code> 中的任何設定。</p>
   <p>使用者顯式設定的插件也會比默認插件優先序高。</p>
   <p>在這樣的層次結構設計之下，<code>enabled</code> 的優先序高於 <code>disabled</code>。
   例如，某插件同時出現在 <code>multiPoint.enabled</code> 和 <code>multiPoint.disalbed</code> 時，
   該插件會被啓用。類似的，
   同時設置 <code>multiPoint.disabled = '&lowast;'</code>和 <code>multiPoint.enabled = pluginA</code> 時，
   插件 pluginA 仍然會被註冊。這一設計與所有其他擴展點的設定行爲是相符的。</p>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadConstraintsDefaulting`     {#kubescheduler-config-k8s-io-v1-PodTopologySpreadConstraintsDefaulting}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 類型的別名）

**出現在：**

- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs)

<!--
PodTopologySpreadConstraintsDefaulting defines how to set default constraints
for the PodTopologySpread plugin.
-->
<p>PodTopologySpreadConstraintsDefaulting
定義如何爲 PodTopologySpread 插件設置默認的約束。</p>


## `RequestedToCapacityRatioParam`     {#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam}

<!--
**Appears in:**
-->
**出現在：**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)

<!--
RequestedToCapacityRatioParam define RequestedToCapacityRatio parameters
-->
<p>RequestedToCapacityRatioParam 結構定義 RequestedToCapacityRatio 的參數。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>shape</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   <!--
   Shape is a list of points defining the scoring function shape.
   -->
   <p><code>shape</code> 是一個定義評分函數曲線的計分點的列表。</p>
</td>
</tr>
</tbody>
</table>

## `ResourceSpec`     {#kubescheduler-config-k8s-io-v1-ResourceSpec}

<!--
**Appears in:**
-->
**出現在：**

- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs)

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)

<!--
ResourceSpec represents a single resource.
-->
<p>ResourceSpec 用來代表某個資源。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
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

## `ScoringStrategy`     {#kubescheduler-config-k8s-io-v1-ScoringStrategy}

<!--
**Appears in:**
-->
**出現在：**

- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)

<!--
ScoringStrategy define ScoringStrategyType for node resource plugin
-->
<p>ScoringStrategy 爲節點資源插件定義 ScoringStrategyType。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>type</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ScoringStrategyType"><code>ScoringStrategyType</code></a>
</td>
<td>
   <!--
   Type selects which strategy to run.
   -->
   <p><code>type</code> 用來選擇要運行的策略。</p>
</td>
</tr>
<tr><td><code>resources</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   <!--
   Resources to consider when scoring.
The default resource set includes "cpu" and "memory" with an equal weight.
Allowed weights go from 1 to 100.
Weight defaults to 1 if not specified or explicitly set to 0.
   -->
   <p><code>resources</code> 設置在評分時要考慮的資源。</p>
   <p>默認的資源集合包含 &quot;cpu&quot; 和 &quot;memory&quot;，且二者權重相同。</p>
   <p>權重的取值範圍爲 1 到 100。</p>
   <p>當權重未設置或者顯式設置爲 0 時，意味着使用默認值 1。</p>
</td>
</tr>
<tr><td><code>requestedToCapacityRatio</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam"><code>RequestedToCapacityRatioParam</code></a>
</td>
<td>
   <!--
   Arguments specific to RequestedToCapacityRatio strategy.
   -->
   <p>特定於 RequestedToCapacityRatio 策略的參數。</p>
</td>
</tr>
</tbody>
</table>

## `ScoringStrategyType`     {#kubescheduler-config-k8s-io-v1-ScoringStrategyType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 數據類型的別名）

**出現在：**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)

<!--
ScoringStrategyType the type of scoring strategy used in NodeResourcesFit plugin.
-->
<p>ScoringStrategyType 是 NodeResourcesFit 插件所使用的的評分策略類型。</p>

## `UtilizationShapePoint`     {#kubescheduler-config-k8s-io-v1-UtilizationShapePoint}

<!--
**Appears in:**
-->
**出現在：**

- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)

- [RequestedToCapacityRatioParam](#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam)

<!--
UtilizationShapePoint represents single point of priority function shape.
-->
<p>UtilizationShapePoint 代表的是優先級函數曲線中的一個評分點。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>utilization</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Utilization (x axis). Valid values are 0 to 100. Fully utilized node maps to 100.
   -->
   <p>利用率（x 軸）。合法值爲 0 到 100。完全被利用的節點映射到 100。</p>
</td>
</tr>
<tr><td><code>score</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Score assigned to given utilization (y axis). Valid values are 0 to 10.
   -->
   <p><code>score</code> 分配給指定利用率的分值（y 軸）。合法值爲 0 到 10。</p>
</td>
</tr>
</tbody>
</table>
