---
title: kube-scheduler 配置 (v1)
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
## 资源类型 {#resource-types}

- [DefaultPreemptionArgs](#kubescheduler-config-k8s-io-v1-DefaultPreemptionArgs)
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
**出现在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

<!--
ClientConnectionConfiguration contains details for constructing a client.
-->
<p>ClientConnectionConfiguration 中包含用来构造客户端所需的细节。</p>

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
   <p><code>kubeconfig</code> 字段为指向 KubeConfig 文件的路径。</p>
</td>
</tr>
<tr><td><code>acceptContentTypes</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   acceptContentTypes defines the Accept header sent by clients when connecting to a server, overriding the
default value of 'application/json'. This field will control all connections to the server used by a particular
client.
   -->
   <p>
   <code>acceptContentTypes</code> 定义的是客户端与服务器建立连接时要发送的 Accept 头部，
   这里的设置值会覆盖默认值 "application/json"。此字段会影响某特定客户端与服务器的所有连接。
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
   <code>contentType</code> 包含的是此客户端向服务器发送数据时使用的内容类型（Content Type）。
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
   <p><code>qps</code> 控制此连接允许的每秒查询次数。</p>
</td>
</tr>
<tr><td><code>burst</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   burst allows extra queries to accumulate when a client is exceeding its rate.
   -->
   <p><code>burst</code> 允许在客户端超出其速率限制时可以累积的额外查询个数。</p>
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

<!--
DebuggingConfiguration holds configuration for Debugging related features.
-->
<p>DebuggingConfiguration 包含与调试功能相关的配置。</p>

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
   <p><code>enableProfiling</code> 字段允许通过 Web 接口 host:port/debug/pprof/ 执行性能分析。</p>
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
   <code>enableProfiling</code> 为 true 时启用阻塞分析。</p>
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

<!--
LeaderElectionConfiguration defines the configuration of leader election
clients for components that can run with leader election enabled.
-->
<p>
LeaderElectionConfiguration 为能够支持领导者选举的组件定义其领导者选举客户端的配置。
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
   <code>leaderElect</code> 允许领导者选举客户端在进入主循环执行之前先获得领导者角色。
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
   <code>leaseDuration</code> 是非领导角色候选者在观察到需要领导席位更新时要等待的时间；
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
   <code>renewDeadline</code> 设置的是当前领导者在停止扮演领导角色之前需要刷新领导状态的时间间隔。
   此值必须小于或等于租约期限的长度。只有到启用了领导者选举时此字段才有意义。
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
   <code>retryPeriod</code> 是客户端在连续两次尝试获得或者刷新领导状态之间需要等待的时长。
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
   resourceName indicates the namespace of resource object that will be used to lock
during leader election cycles.
   -->
   <p><code>resourceNamespace</code> 字段给出在领导者选举期间要作为锁来使用的资源对象所在名字空间。</p>
</td>
</tr>
</tbody>
</table>

## `DefaultPreemptionArgs`     {#kubescheduler-config-k8s-io-v1-DefaultPreemptionArgs}
    
<!--
DefaultPreemptionArgs holds arguments used to configure the
DefaultPreemption plugin.
-->
<p>DefaultPreemptionArgs 包含用来配置 DefaultPreemption 插件的参数。</p>

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
   <p><code>minCandidateNodesPercentage</code> 字段为试运行抢占时 shortlist 中候选节点数的下限，
   数值为节点数的百分比。字段值必须介于 [0, 100] 之间。未指定时默认值为整个集群规模的 10%。</p>
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
   <p><code>minCandidateNodesAbsolute</code> 字段设置 shortlist 中候选节点的绝对下限。
   用于试运行抢占而列举的候选节点个数近似于通过下面的公式计算的：<br/>
   候选节点数 = max(节点数 * minCandidateNodesPercentage, minCandidateNodesAbsolute)<br/>
   之所以说是&quot;近似于&quot;是因为存在一些类似于 PDB 违例这种因素，
   会影响到进入 shortlist 中候选节点的个数。
   取值至少为 0 节点。若未设置默认为 100 节点。</p>
</td>
</tr>
</tbody>
</table>

## `InterPodAffinityArgs`     {#kubescheduler-config-k8s-io-v1-InterPodAffinityArgs}

<!--
InterPodAffinityArgs holds arguments used to configure the InterPodAffinity plugin.
-->
<p>InterPodAffinityArgs 包含用来配置 InterPodAffinity 插件的参数。</p>

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
   <p><code>hardPodAffinityWeight</code> 字段是一个计分权重值。针对新增的 Pod，要对现存的、
   带有与新 Pod 匹配的硬性亲和性设置的 Pods 计算亲和性得分。
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
   <p>ignorePreferredTermsOfExistingPods 配置调度器在为候选节点评分时忽略现有 Pod 的优选亲和性规则，
   除非传入的 Pod 具有 Pod 间的亲和性。</p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerConfiguration`     {#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration}

<!--
KubeSchedulerConfiguration configures a scheduler
-->
<p>KubeSchedulerConfiguration 用来配置调度器。</p>

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
   <code>parallelism</code> 字段设置为调度 Pod 而执行算法时的并发度。此值必须大于 0。默认值为 16。
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
   <p>LeaderElection 字段用来定义领导者选举客户端的配置。</p>
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
   <p><code>clientConnection</code> 字段为与 API 服务器通信时使用的代理服务器设置 kubeconfig 文件和客户端连接配置。</p>
</td>
</tr>
<tr><td><code>DebuggingConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#DebuggingConfiguration"><code>DebuggingConfiguration</code></a>
</td>
<!--
(Members of <code>DebuggingConfiguration</code> are embedded into this type.)
-->
<td>（<code>DebuggingConfiguration</code> 的成员被内嵌到此类型中）
   <!--
   DebuggingConfiguration holds configuration for Debugging related features
   TODO: We might wanna make this a substruct like Debugging componentbaseconfigv1alpha1.DebuggingConfiguration
   -->
   <p><code>DebuggingConfiguration</code> 字段设置与调试相关功能特性的配置。
   TODO：我们可能想把它做成一个子结构，像调试 component-base/config/v1alpha1.DebuggingConfiguration 一样。</p>
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
nodes will be scored. It is overridden by profile level PercentageofNodesToScore.
   -->
   <p>
   <code>percentageOfNodesToScore</code> 字段为所有节点的百分比，一旦调度器找到所设置比例的、能够运行 Pod 的节点，
   则停止在集群中继续寻找更合适的节点。这一配置有助于提高调度器的性能。
   调度器总会尝试寻找至少 &quot;minFeasibleNodesToFind&quot; 个可行节点，无论此字段的取值如何。
   例如：当集群规模为 500 个节点，而此字段的取值为 30，
   则调度器在找到 150 个合适的节点后会停止继续寻找合适的节点。当此值为 0 时，
   调度器会使用默认节点数百分比（基于集群规模确定的值，在 5% 到 50% 之间）来执行打分操作。
   它可被配置文件级别的 PercentageofNodesToScore 覆盖。
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
   <p><code>podInitialBackoffSeconds</code> 字段设置不可调度 Pod 的初始回退秒数。
   如果设置了此字段，其取值必须大于零。若此值为 null，则使用默认值（1s）。</p>
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
   <p><code>podMaxBackoffSeconds</code> 字段设置不可调度的 Pod 的最大回退秒数。
   如果设置了此字段，则其值必须大于 podInitialBackoffSeconds 字段值。
   如果此值设置为 null，则使用默认值（10s）。</p>
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
   <code>profiles</code> 字段为 kube-scheduler 所支持的方案（profiles）。
   Pod 可以通过设置其对应的调度器名称来选择使用特定的方案。
   未指定调度器名称的 Pod 会使用 &quot;default-scheduler&quot; 方案来调度，如果存在的话。
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
   <p><code>extenders</code> 字段为调度器扩展模块（Extender）的列表，每个元素包含如何与某扩展模块通信的配置信息。
   所有调度器方案会共享此扩展模块列表。</p>
</td>
</tr>
<tr><td><code>delayCacheUntilActive</code> <B>[Required]</B><br/>
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
   DelayCacheUntilActive 指定何时开始缓存。如果字段设置为 true 并且启用了领导者选举，
   则调度程序将等待填充通知者缓存，直到它成为领导者，这样做会减慢故障转移速度，
   并在等待成为领导者时降低内存开销。
   默认为 false。
   </p>
</td>
</tr>
</tbody>
</table>

## `NodeAffinityArgs`     {#kubescheduler-config-k8s-io-v1-NodeAffinityArgs}

<!--
NodeAffinityArgs holds arguments to configure the NodeAffinity plugin.
-->
<p>NodeAffinityArgs 中包含配置 NodeAffinity 插件的参数。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeAffinityArgs</code></td></tr>
  
<tr><td><code>addedAffinity</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#nodeaffinity-v1-core"><code>core/v1.NodeAffinity</code></a>
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
   <code>addedAffinity</code> 会作为附加的亲和性属性添加到所有 Pod 的规约中指定的 NodeAffinity 中。
   换言之，节点需要同时满足 addedAffinity 和 .spec.nodeAffinity。
   默认情况下，addedAffinity 为空（与所有节点匹配）。使用了 addedAffinity 时，
   某些带有已经能够与某特定节点匹配的亲和性需求的 Pod （例如 DaemonSet Pod）可能会继续呈现不可调度状态。
   </p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesBalancedAllocationArgs`     {#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs}

<!--
NodeResourcesBalancedAllocationArgs holds arguments used to configure NodeResourcesBalancedAllocation plugin.
-->
<p>NodeResourcesBalancedAllocationArgs 包含用来配置 NodeResourcesBalancedAllocation 插件的参数。</p>

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
   <p>要管理的资源；如果未设置，则默认值为 &quot;cpu&quot; 和 &quot;memory&quot;。</p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesFitArgs`     {#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs}

<!--
NodeResourcesFitArgs holds arguments used to configure the NodeResourcesFit plugin.
-->
<p>NodeResourcesFitArgs 包含用来配置 NodeResourcesFit 插件的参数。</p>

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
   <p><code>ignoredResources</code> 字段为 NodeResources 匹配过滤器要忽略的资源列表。此列表不影响节点打分。</p>
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
   <p><code>ignoredResourceGroups</code> 字段定义 NodeResources 匹配过滤器要忽略的资源组列表。
   例如，如果配置值为 [&quot;example.com&quot;]，
   则以 &quot;example.com&quot; 开头的资源名
   （如&quot;example.com/aaa&quot; 和 &quot;example.com/bbb&quot;）都会被忽略。
   资源组名称中不可以包含 '/'。此设置不影响节点的打分。</p>
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
   <p><code>scoringStrategy</code> 用来选择节点资源打分策略。默认的策略为 LeastAllocated，
   且 &quot;cpu&quot; 和 &quot;memory&quot; 的权重相同。</p>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadArgs`     {#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs}

<!--
PodTopologySpreadArgs holds arguments used to configure the PodTopologySpread plugin.
-->
<p>PodTopologySpreadArgs 包含用来配置 PodTopologySpread 插件的参数。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodTopologySpreadArgs</code></td></tr>

<tr><td><code>defaultConstraints</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#topologyspreadconstraint-v1-core"><code>[]core/v1.TopologySpreadConstraint</code></a>
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
   <p><code>defaultConstraints</code> 字段针对未定义 <code>.spec.topologySpreadConstraints</code> 的 Pod，
   为其提供拓扑分布约束。<code>.defaultConstraints[&lowast;].labelSelectors</code>必须为空，
   因为这一信息要从 Pod 所属的 Service、ReplicationController、ReplicaSet 或 StatefulSet 来推导。
   此字段不为空时，<code>.defaultingType</code> 必须为 &quot;List&quot;。</p>
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
   <p><code>defaultingType</code> 决定如何推导 <code>.defaultConstraints</code>。
   可选值为 &quot;System&quot; 或 &quot;List&quot;。</p>
   <ul>
     <li>&quot;System&quot;：使用 Kubernetes 定义的约束，将 Pod 分布到不同节点和可用区；</li>
     <li>&quot;List&quot;：使用 <code>.defaultConstraints</code> 中定义的约束。</li>
   </ul>
   <p>默认值为 "System"。</p>
</td>
</tr>
</tbody>
</table>

## `VolumeBindingArgs`     {#kubescheduler-config-k8s-io-v1-VolumeBindingArgs}

<!--
VolumeBindingArgs holds arguments used to configure the VolumeBinding plugin.
-->
<p>VolumeBindingArgs 包含用来配置 VolumeBinding 插件的参数。</p>

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
   <p><code>bindTimeoutSeconds</code> 字段设置卷绑定操作的超时秒数。字段值必须是非负数。
   取值为 0 意味着不等待。如果此值为 null，则使用默认值（600）。</p>
</td>
</tr>
<tr><td><code>shape</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
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
   <p><code>shape</code> 用来设置打分函数曲线所使用的计分点，
   这些计分点用来基于静态制备的 PV 卷的利用率为节点打分。
   卷的利用率是计算得来的，
   将 Pod 所请求的总的存储空间大小除以每个节点上可用的总的卷容量。
   每个计分点包含利用率（范围从 0 到 100）和其对应的得分（范围从 0 到 10）。
   你可以通过为不同的使用率值设置不同的得分来反转优先级：</p>
   <p>默认的曲线计分点为：</p>
   <ol>
     <li>利用率为 0 时得分为 0；</li>
     <li>利用率为 100 时得分为 10。</li>
   </ol>
   <p>所有计分点必须按利用率值的升序来排序。</p>
</td>
</tr>
</tbody>
</table>

## `Extender`     {#kubescheduler-config-k8s-io-v1-Extender}

<!--
**Appears in:**
-->
**出现在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

<!--
Extender holds the parameters used to communicate with the extender. If a verb is unspecified/empty,
it is assumed that the extender chose not to provide that extension.
-->
<p>Extender 包含与扩展模块（Extender）通信所用的参数。
如果未指定 verb 或者 verb 为空，则假定对应的扩展模块选择不提供该扩展功能。</p>

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
   <p>用来访问扩展模块的 URL 前缀。</p>
</td>
</tr>
<tr><td><code>filterVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the filter call, empty if not supported. This verb is appended to the URLPrefix when issuing the filter call to extender.
   -->
   <p>filter 调用所使用的动词，如果不支持过滤操作则为空。
   此动词会在向扩展模块发送 filter 调用时追加到 urlPrefix 后面。</p>
</td>
</tr>
<tr><td><code>preemptVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the preempt call, empty if not supported. This verb is appended to the URLPrefix when issuing the preempt call to extender.
   -->
   <p>preempt 调用所使用的动词，如果不支持 preempt 操作则为空。
   此动词会在向扩展模块发送 preempt 调用时追加到 urlPrefix 后面。</p>
</td>
</tr>
<tr><td><code>prioritizeVerb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Verb for the prioritize call, empty if not supported. This verb is appended to the URLPrefix when issuing the prioritize call to extender.
   -->
   <p>prioritize 调用所使用的动词，如果不支持 prioritize 操作则为空。
   此动词会在向扩展模块发送 prioritize 调用时追加到 urlPrefix 后面。</p>
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
   <p>针对 prioritize 调用所生成的节点分数要使用的数值系数。
   weight 值必须是正整数。</p>
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
   <p>bind 调用所使用的动词，如果不支持 bind 操作则为空。
   此动词会在向扩展模块发送 bind 调用时追加到 urlPrefix 后面。
   如果扩展模块实现了此方法，扩展模块要负责将 Pod 绑定到 API 服务器。
   只有一个扩展模块可以实现此函数。</p>
</td>
</tr>
<tr><td><code>enableHTTPS</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   EnableHTTPS specifies whether https should be used to communicate with the extender
   -->
   <p><code>enableHTTPS</code> 字段设置是否需要使用 HTTPS 来与扩展模块通信。</p>
</td>
</tr>
<tr><td><code>tlsConfig</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig"><code>ExtenderTLSConfig</code></a>
</td>
<td>
   <!--
   TLSConfig specifies the transport layer security config
   -->
   <p><code>tlsConfig</code> 字段设置传输层安全性（TLS）配置。</p>
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
   <p><code>httpTimeout</code> 给出扩展模块功能调用的超时值。filter 操作超时会导致 Pod 无法被调度。
   prioritize 操作超时会被忽略，
   Kubernetes 或者其他扩展模块所给出的优先级值会被用来选择节点。</p>
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
   <p><code>nodeCacheCapable</code> 指示扩展模块可以缓存节点信息，从而调度器应该发送关于可选节点的最少信息，
   假定扩展模块已经缓存了集群中所有节点的全部详细信息。</p>
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
   <p><code>managedResources</code> 是一个由此扩展模块所管理的扩展资源的列表。</p>
   <ul>
     <li>如果某 Pod 请求了此列表中的至少一个扩展资源，则 Pod 会在 filter、
      prioritize 和 bind （如果扩展模块可以执行绑定操作）阶段被发送到该扩展模块。</li>
     <li>如果某资源上设置了 <code>ignoredByScheduler</code> 为 true，则 kube-scheduler
      会在断言阶段略过对该资源的检查。</li>
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
   <p><code>ignorable</code> 用来设置扩展模块是否是可忽略的。
   换言之，当扩展模块返回错误或者完全不可达时，调度操作不应失败。</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderManagedResource`     {#kubescheduler-config-k8s-io-v1-ExtenderManagedResource}

<!--
**Appears in:**
-->
**出现在：**

- [Extender](#kubescheduler-config-k8s-io-v1-Extender)

<!--
ExtenderManagedResource describes the arguments of extended resources
managed by an extender.
-->
<p>ExtenderManagedResource 描述某扩展模块所管理的扩展资源的参数。</p>

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
   <p>扩展资源的名称。</p>
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
   <p><code>ignoredByScheduler</code> 标明 kube-scheduler 是否应在应用断言时忽略此资源。</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderTLSConfig`     {#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig}

<!--
**Appears in:**
-->
**出现在：**

- [Extender](#kubescheduler-config-k8s-io-v1-Extender)

<!--
ExtenderTLSConfig contains settings to enable TLS with extender
-->
<p>ExtenderTLSConfig 包含启用与扩展模块间 TLS 传输所需的配置参数。</p>

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
   <p>访问服务器时不需要检查 TLS 证书。此配置仅针对测试用途。</p>
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
   <p><code>serverName</code> 会被发送到服务器端，作为 SNI 标志；
   客户端会使用此设置来检查服务器证书。
   如果 <code>serverName</code> 为空，则会使用联系服务器时所用的主机名。
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
   <p>服务器端所要求的 TLS 客户端证书认证。</p>
</td>
</tr>
<tr><td><code>keyFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Server requires TLS client certificate authentication
   -->
   <p>服务器端所要求的 TLS 客户端秘钥认证。</p>
</td>
</tr>
<tr><td><code>caFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Trusted root certificates for server
   -->
   <p>服务器端被信任的根证书。</p>
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
   <p><code>certData</code> 包含 PEM 编码的字节流（通常从某客户端证书文件读入）。
   此字段优先级高于 certFile 字段。</p>
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
   <p><code>keyData</code> 包含 PEM 编码的字节流（通常从某客户端证书秘钥文件读入）。
   此字段优先级高于 keyFile 字段。</p>
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
   <p><code>caData</code> 包含 PEM 编码的字节流（通常从某根证书包文件读入）。
   此字段优先级高于 caFile 字段。</p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerProfile`     {#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile}

<!--
**Appears in:**
-->
**出现在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

<!--
KubeSchedulerProfile is a scheduling profile.
-->
<p>KubeSchedulerProfile 是一个调度方案。</p>

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
   <p><code>schedulerName</code> 是与此调度方案相关联的调度器的名称。
   如果 <code>schedulerName</code> 与 Pod 的 <code>spec.schedulerName</code> 匹配，
   则该 Pod 会使用此方案来调度。</p>
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
   <p>percentageOfNodesToScore 是已发现可运行 Pod 的节点与所有节点的百分比，
   调度器所发现的可行节点到达此阈值时，将停止在集群中继续搜索可行节点。
这有助于提高调度器的性能。无论此标志的值是多少，调度器总是尝试至少找到 “minFeasibleNodesToFind” 个可行的节点。
例如：如果集群大小为 500 个节点并且此标志的值为 30，则调度器在找到 150 个可行节点后将停止寻找更多可行的节点。
当值为 0 时，默认百分比（根据集群大小为 5% - 50%）的节点将被评分。此设置值将覆盖全局的 PercentageOfNodesToScore 值。
如果为空，将使用全局 PercentageOfNodesToScore。</p>
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
   <p><code>plugins</code> 设置一组应该被启用或禁止的插件。
   被启用的插件是指除了默认插件之外需要被启用的插件。
   被禁止的插件是指需要被禁用的默认插件。</p>
   <p>如果针对某个扩展点没有设置被启用或被禁止的插件，
   则使用该扩展点的默认插件（如果有的话）。如果设置了 QueueSort 插件，
   则同一个 QueueSort 插件和 <code>pluginConfig</code> 要被设置到所有调度方案之上。
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
   <p><code>pluginConfig</code> 是为每个插件提供的一组可选的定制插件参数。
   如果忽略了插件的配置参数，则意味着使用该插件的默认配置。</p>
</td>
</tr>
</tbody>
</table>

## `Plugin`     {#kubescheduler-config-k8s-io-v1-Plugin}

<!--
**Appears in:**
-->
**出现在：**

- [PluginSet](#kubescheduler-config-k8s-io-v1-PluginSet)

<!--
Plugin specifies a plugin name and its weight when applicable. Weight is used only for Score plugins.
-->
<p>Plugin 指定插件的名称及其权重（如果适用的话）。权重仅用于评分（Score）插件。</p>


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
   <p>插件的名称。</p>
</td>
</tr>
<tr><td><code>weight</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Weight defines the weight of plugin, only used for Score plugins.
   -->
   <p>插件的权重；仅适用于评分（Score）插件。</p>
</td>
</tr>
</tbody>
</table>

## `PluginConfig`     {#kubescheduler-config-k8s-io-v1-PluginConfig}

<!--
**Appears in:**
-->
**出现在：**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)

<!--
PluginConfig specifies arguments that should be passed to a plugin at the time of initialization.
A plugin that is invoked at multiple extension points is initialized once. Args can have arbitrary structure.
It is up to the plugin to process these Args.
-->
<p>PluginConfig 给出初始化阶段要传递给插件的参数。
在多个扩展点被调用的插件仅会被初始化一次。
参数可以是任意结构。插件负责处理这里所传的参数。</p>

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
   <p><code>name</code> 是所配置的插件的名称。</p>
</td>
</tr>
<tr><td><code>args</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <!--
   Args defines the arguments passed to the plugins at the time of initialization. Args can have arbitrary structure.
   -->
   <p><code>args</code> 定义在初始化阶段要传递给插件的参数。参数可以为任意结构。</p>
</td>
</tr>
</tbody>
</table>

## `PluginSet`     {#kubescheduler-config-k8s-io-v1-PluginSet}

<!--
**Appears in:**
-->
**出现在：**

- [Plugins](#kubescheduler-config-k8s-io-v1-Plugins)

<!--
PluginSet specifies enabled and disabled plugins for an extension point.
If an array is empty, missing, or nil, default plugins at that extension point will be used.
-->
<p>PluginSet 为某扩展点设置要启用或禁用的插件。
如果数组为空，或者取值为 null，则使用该扩展点的默认插件集合。</p>

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
   <p><code>enabled</code> 设置在默认插件之外要启用的插件。
   如果在调度器的配置文件中也配置了默认插件，则对应插件的权重会被覆盖。
   此处所设置的插件会在默认插件之后被调用，调用顺序与数组中元素顺序相同。</p>
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
   <p><code>disabled</code> 设置要被禁用的默认插件。
   如果需要禁用所有的默认插件，应该提供仅包含一个元素 "&lowast;" 的数组。</p>
</td>
</tr>
</tbody>
</table>

## `Plugins`     {#kubescheduler-config-k8s-io-v1-Plugins}

<!--
**Appears in:**
-->
**出现在：**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)

<!--
Plugins include multiple extension points. When specified, the list of plugins for
a particular extension point are the only ones enabled. If an extension point is
omitted from the config, then the default set of plugins is used for that extension point.
Enabled plugins are called in the order specified here, after default plugins. If they need to
be invoked before default plugins, default plugins must be disabled and re-enabled here in desired order.
-->
<p>Plugins 结构中包含多个扩展点。当此结构被设置时，
针对特定扩展点所启用的所有插件都在这一列表中。
如果配置中不包含某个扩展点，则使用该扩展点的默认插件集合。
被启用的插件的调用顺序与这里指定的顺序相同，都在默认插件之后调用。
如果它们需要在默认插件之前调用，则需要先行禁止默认插件，
之后在这里按期望的顺序重新启用。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>preEnqueue</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--PreEnqueue is a list of plugins that should be invoked before adding pods to the scheduling queue.-->
   <p>preEnqueue 是在将 Pod 添加到调度队列之前应调用的插件的列表。</p>
</td>
</tr>
<tr><td><code>queueSort</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   QueueSort is a list of plugins that should be invoked when sorting pods in the scheduling queue.
   -->
   <p><code>queueSort</code> 是一个在对调度队列中 Pod 排序时要调用的插件列表。</p>
</td>
</tr>
<tr><td><code>preFilter</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PreFilter is a list of plugins that should be invoked at "PreFilter" extension point of the scheduling framework.
   -->
   <p><code>preFilter</code> 是一个在调度框架中 &quot;PreFilter（预过滤）&quot;扩展点上要调用的插件列表。</p>
</td>
</tr>
<tr><td><code>filter</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Filter is a list of plugins that should be invoked when filtering out nodes that cannot run the Pod.
   -->
   <p><code>filter</code> 是一个在需要过滤掉无法运行 Pod 的节点时被调用的插件列表。</p>
</td>
</tr>
<tr><td><code>postFilter</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PostFilter is a list of plugins that are invoked after filtering phase, but only when no feasible nodes were found for the pod.
   -->
   <p><code>postFilter</code> 是一个在过滤阶段结束后会被调用的插件列表；
   这里的插件只有在找不到合适的节点来运行 Pod 时才会被调用。</p>
</td>
</tr>
<tr><td><code>preScore</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PreScore is a list of plugins that are invoked before scoring.
   -->
   <p><code>preScore</code> 是一个在打分之前要调用的插件列表。</p>
</td>
</tr>
<tr><td><code>score</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Score is a list of plugins that should be invoked when ranking nodes that have passed the filtering phase.
   -->
   <p><code>score</code> 是一个在对已经通过过滤阶段的节点进行排序时调用的插件的列表。</p>
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
   <p><code>reserve</code> 是一组在运行 Pod 的节点已被选定后，需要预留或者释放资源时调用的插件的列表。</p>
</td>
</tr>
<tr><td><code>permit</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   Permit is a list of plugins that control binding of a Pod. These plugins can prevent or delay binding of a Pod.
   -->
   <p><code>permit</code> 是一个用来控制 Pod 绑定关系的插件列表。
   这些插件可以禁止或者延迟 Pod 的绑定。</p>
</td>
</tr>
<tr><td><code>preBind</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <!--
   PreBind is a list of plugins that should be invoked before a pod is bound.
   -->
   <p><code>preBind</code> 是一个在 Pod 被绑定到某节点之前要被调用的插件的列表。</p>
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
   <code>bind</code> 是一个在调度框架中 &quot;Bind（绑定）&quot;扩展点上要调用的插件的列表。
   调度器按顺序调用这些插件。只要其中某个插件返回成功，则调度器就略过余下的插件。
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
   <p><code>postBind</code> 是一个在 Pod 已经被成功绑定之后要调用的插件的列表。</p>
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
   <p><code>multiPoint</code> 是一个简化的配置段落，用来为所有合法的扩展点启用插件。
   通过 <code>multiPoint</code> 启用的插件会自动注册到插件所实现的每个独立的扩展点上。
   通过 <code>multiPoint</code> 禁用的插件会禁用对应的操作行为。
   通过 <code>multiPoint</code> 所禁止的 &quot;&lowast;&quot; 
   也是如此，意味着所有默认插件都不会被自动注册。
   插件也可以通过各个独立的扩展点来禁用。</p>
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
   <p>就优先序而言，插件配置遵从以下基本层次：</p>
   <ol>
     <li>特定的扩展点；</li>
     <li>显式配置的 <code>multiPoint</code> 插件；</li>
     <li>默认插件的集合，以及 <code>multiPoint</code> 插件。</li>
   </ol>
   <p>这意味着优先序较高的插件会先被运行，并且覆盖 <code>multiPoint</code> 中的任何配置。</p>
   <p>用户显式配置的插件也会比默认插件优先序高。</p>
   <p>在这样的层次结构设计之下，<code>enabled</code> 的优先序高于 <code>disabled</code>。
   例如，某插件同时出现在 <code>multiPoint.enabled</code> 和 <code>multiPoint.disalbed</code> 时，
   该插件会被启用。类似的，
   同时设置 <code>multiPoint.disabled = '&lowast;'</code>和 <code>multiPoint.enabled = pluginA</code> 时，
   插件 pluginA 仍然会被注册。这一设计与所有其他扩展点的配置行为是相符的。</p>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadConstraintsDefaulting`     {#kubescheduler-config-k8s-io-v1-PodTopologySpreadConstraintsDefaulting}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 类型的别名）

**出现在：**

- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs)

<!--
PodTopologySpreadConstraintsDefaulting defines how to set default constraints
for the PodTopologySpread plugin.
-->
<p>PodTopologySpreadConstraintsDefaulting
定义如何为 PodTopologySpread 插件设置默认的约束。</p>


## `RequestedToCapacityRatioParam`     {#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam}

<!--
**Appears in:**
-->
**出现在：**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)

<!--
RequestedToCapacityRatioParam define RequestedToCapacityRatio parameters
-->
<p>RequestedToCapacityRatioParam 结构定义 RequestedToCapacityRatio 的参数。</p>

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
   <p><code>shape</code> 是一个定义评分函数曲线的计分点的列表。</p>
</td>
</tr>
</tbody>
</table>

## `ResourceSpec`     {#kubescheduler-config-k8s-io-v1-ResourceSpec}

<!--
**Appears in:**
-->
**出现在：**

- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs)

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)

<!--
ResourceSpec represents a single resource.
-->
<p>ResourceSpec 用来代表某个资源。</p>

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
   <p>资源名称。</p>
</td>
</tr>
<tr><td><code>weight</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <!--
   Weight of the resource.
   -->
   <p>资源权重。</p>
</td>
</tr>
</tbody>
</table>

## `ScoringStrategy`     {#kubescheduler-config-k8s-io-v1-ScoringStrategy}

<!--
**Appears in:**
-->
**出现在：**

- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)

<!--
ScoringStrategy define ScoringStrategyType for node resource plugin
-->
<p>ScoringStrategy 为节点资源插件定义 ScoringStrategyType。</p>

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
   <p><code>type</code> 用来选择要运行的策略。</p>
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
   <p><code>resources</code> 设置在评分时要考虑的资源。</p>
   <p>默认的资源集合包含 &quot;cpu&quot; 和 &quot;memory&quot;，且二者权重相同。</p>
   <p>权重的取值范围为 1 到 100。</p>
   <p>当权重未设置或者显式设置为 0 时，意味着使用默认值 1。</p>
</td>
</tr>
<tr><td><code>requestedToCapacityRatio</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam"><code>RequestedToCapacityRatioParam</code></a>
</td>
<td>
   <!--
   Arguments specific to RequestedToCapacityRatio strategy.
   -->
   <p>特定于 RequestedToCapacityRatio 策略的参数。</p>
</td>
</tr>
</tbody>
</table>

## `ScoringStrategyType`     {#kubescheduler-config-k8s-io-v1-ScoringStrategyType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 数据类型的别名）

**出现在：**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)

<!--
ScoringStrategyType the type of scoring strategy used in NodeResourcesFit plugin.
-->
<p>ScoringStrategyType 是 NodeResourcesFit 插件所使用的的评分策略类型。</p>

## `UtilizationShapePoint`     {#kubescheduler-config-k8s-io-v1-UtilizationShapePoint}

<!--
**Appears in:**
-->
**出现在：**

- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)

- [RequestedToCapacityRatioParam](#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam)

<!--
UtilizationShapePoint represents single point of priority function shape.
-->
<p>UtilizationShapePoint 代表的是优先级函数曲线中的一个评分点。</p>

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
   <p>利用率（x 轴）。合法值为 0 到 100。完全被利用的节点映射到 100。</p>
</td>
</tr>
<tr><td><code>score</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <!--
   Score assigned to given utilization (y axis). Valid values are 0 to 10.
   -->
   <p><code>score</code> 分配给指定利用率的分值（y 轴）。合法值为 0 到 10。</p>
</td>
</tr>
</tbody>
</table>
