---
title: kube-scheduler Configuration (v1)
content_type: tool-reference
package: kubescheduler.config.k8s.io/v1
auto_generated: true
---


## Resource Types 


- [DefaultPreemptionArgs](#kubescheduler-config-k8s-io-v1-DefaultPreemptionArgs)
- [InterPodAffinityArgs](#kubescheduler-config-k8s-io-v1-InterPodAffinityArgs)
- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)
- [NodeAffinityArgs](#kubescheduler-config-k8s-io-v1-NodeAffinityArgs)
- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs)
- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)
- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs)
- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)
  
    
    

## `ClientConnectionConfiguration`     {#ClientConnectionConfiguration}
    

**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)


<p>ClientConnectionConfiguration contains details for constructing a client.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>kubeconfig</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>kubeconfig is the path to a KubeConfig file.</p>
</td>
</tr>
<tr><td><code>acceptContentTypes</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>acceptContentTypes defines the Accept header sent by clients when connecting to a server, overriding the
default value of 'application/json'. This field will control all connections to the server used by a particular
client.</p>
</td>
</tr>
<tr><td><code>contentType</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>contentType is the content type used when sending data to the server from this client.</p>
</td>
</tr>
<tr><td><code>qps</code> <B>[Required]</B><br/>
<code>float32</code>
</td>
<td>
   <p>qps controls the number of queries per second allowed for this connection.</p>
</td>
</tr>
<tr><td><code>burst</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>burst allows extra queries to accumulate when a client is exceeding its rate.</p>
</td>
</tr>
</tbody>
</table>

## `DebuggingConfiguration`     {#DebuggingConfiguration}
    

**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)


<p>DebuggingConfiguration holds configuration for Debugging related features.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>enableProfiling</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>enableProfiling enables profiling via web interface host:port/debug/pprof/</p>
</td>
</tr>
<tr><td><code>enableContentionProfiling</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>enableContentionProfiling enables block profiling, if
enableProfiling is true.</p>
</td>
</tr>
</tbody>
</table>

## `LeaderElectionConfiguration`     {#LeaderElectionConfiguration}
    

**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)


<p>LeaderElectionConfiguration defines the configuration of leader election
clients for components that can run with leader election enabled.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>leaderElect</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>leaderElect enables a leader election client to gain leadership
before executing the main loop. Enable this when running replicated
components for high availability.</p>
</td>
</tr>
<tr><td><code>leaseDuration</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>leaseDuration is the duration that non-leader candidates will wait
after observing a leadership renewal until attempting to acquire
leadership of a led but unrenewed leader slot. This is effectively the
maximum duration that a leader can be stopped before it is replaced
by another candidate. This is only applicable if leader election is
enabled.</p>
</td>
</tr>
<tr><td><code>renewDeadline</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>renewDeadline is the interval between attempts by the acting master to
renew a leadership slot before it stops leading. This must be less
than or equal to the lease duration. This is only applicable if leader
election is enabled.</p>
</td>
</tr>
<tr><td><code>retryPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>retryPeriod is the duration the clients should wait between attempting
acquisition and renewal of a leadership. This is only applicable if
leader election is enabled.</p>
</td>
</tr>
<tr><td><code>resourceLock</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>resourceLock indicates the resource object type that will be used to lock
during leader election cycles.</p>
</td>
</tr>
<tr><td><code>resourceName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>resourceName indicates the name of resource object that will be used to lock
during leader election cycles.</p>
</td>
</tr>
<tr><td><code>resourceNamespace</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>resourceName indicates the namespace of resource object that will be used to lock
during leader election cycles.</p>
</td>
</tr>
</tbody>
</table>
  

## `DefaultPreemptionArgs`     {#kubescheduler-config-k8s-io-v1-DefaultPreemptionArgs}
    


<p>DefaultPreemptionArgs holds arguments used to configure the
DefaultPreemption plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>DefaultPreemptionArgs</code></td></tr>
    
  
<tr><td><code>minCandidateNodesPercentage</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>MinCandidateNodesPercentage is the minimum number of candidates to
shortlist when dry running preemption as a percentage of number of nodes.
Must be in the range [0, 100]. Defaults to 10% of the cluster size if
unspecified.</p>
</td>
</tr>
<tr><td><code>minCandidateNodesAbsolute</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>MinCandidateNodesAbsolute is the absolute minimum number of candidates to
shortlist. The likely number of candidates enumerated for dry running
preemption is given by the formula:
numCandidates = max(numNodes * minCandidateNodesPercentage, minCandidateNodesAbsolute)
We say &quot;likely&quot; because there are other factors such as PDB violations
that play a role in the number of candidates shortlisted. Must be at least
0 nodes. Defaults to 100 nodes if unspecified.</p>
</td>
</tr>
</tbody>
</table>

## `InterPodAffinityArgs`     {#kubescheduler-config-k8s-io-v1-InterPodAffinityArgs}
    


<p>InterPodAffinityArgs holds arguments used to configure the InterPodAffinity plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InterPodAffinityArgs</code></td></tr>
    
  
<tr><td><code>hardPodAffinityWeight</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>HardPodAffinityWeight is the scoring weight for existing pods with a
matching hard affinity to the incoming pod.</p>
</td>
</tr>
<tr><td><code>ignorePreferredTermsOfExistingPods</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>IgnorePreferredTermsOfExistingPods configures the scheduler to ignore existing pods' preferred affinity
rules when scoring candidate nodes, unless the incoming pod has inter-pod affinities.</p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerConfiguration`     {#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration}
    


<p>KubeSchedulerConfiguration configures a scheduler</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeSchedulerConfiguration</code></td></tr>
    
  
<tr><td><code>parallelism</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>Parallelism defines the amount of parallelism in algorithms for scheduling a Pods. Must be greater than 0. Defaults to 16</p>
</td>
</tr>
<tr><td><code>leaderElection</code> <B>[Required]</B><br/>
<a href="#LeaderElectionConfiguration"><code>LeaderElectionConfiguration</code></a>
</td>
<td>
   <p>LeaderElection defines the configuration of leader election client.</p>
</td>
</tr>
<tr><td><code>clientConnection</code> <B>[Required]</B><br/>
<a href="#ClientConnectionConfiguration"><code>ClientConnectionConfiguration</code></a>
</td>
<td>
   <p>ClientConnection specifies the kubeconfig file and client connection
settings for the proxy server to use when communicating with the apiserver.</p>
</td>
</tr>
<tr><td><code>DebuggingConfiguration</code> <B>[Required]</B><br/>
<a href="#DebuggingConfiguration"><code>DebuggingConfiguration</code></a>
</td>
<td>(Members of <code>DebuggingConfiguration</code> are embedded into this type.)
   <p>DebuggingConfiguration holds configuration for Debugging related features
TODO: We might wanna make this a substruct like Debugging componentbaseconfigv1alpha1.DebuggingConfiguration</p>
</td>
</tr>
<tr><td><code>percentageOfNodesToScore</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>PercentageOfNodesToScore is the percentage of all nodes that once found feasible
for running a pod, the scheduler stops its search for more feasible nodes in
the cluster. This helps improve scheduler's performance. Scheduler always tries to find
at least &quot;minFeasibleNodesToFind&quot; feasible nodes no matter what the value of this flag is.
Example: if the cluster size is 500 nodes and the value of this flag is 30,
then scheduler stops finding further feasible nodes once it finds 150 feasible ones.
When the value is 0, default percentage (5%--50% based on the size of the cluster) of the
nodes will be scored. It is overridden by profile level PercentageOfNodesToScore.</p>
</td>
</tr>
<tr><td><code>podInitialBackoffSeconds</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   <p>PodInitialBackoffSeconds is the initial backoff for unschedulable pods.
If specified, it must be greater than 0. If this value is null, the default value (1s)
will be used.</p>
</td>
</tr>
<tr><td><code>podMaxBackoffSeconds</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   <p>PodMaxBackoffSeconds is the max backoff for unschedulable pods.
If specified, it must be greater than podInitialBackoffSeconds. If this value is null,
the default value (10s) will be used.</p>
</td>
</tr>
<tr><td><code>profiles</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile"><code>[]KubeSchedulerProfile</code></a>
</td>
<td>
   <p>Profiles are scheduling profiles that kube-scheduler supports. Pods can
choose to be scheduled under a particular profile by setting its associated
scheduler name. Pods that don't specify any scheduler name are scheduled
with the &quot;default-scheduler&quot; profile, if present here.</p>
</td>
</tr>
<tr><td><code>extenders</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-Extender"><code>[]Extender</code></a>
</td>
<td>
   <p>Extenders are the list of scheduler extenders, each holding the values of how to communicate
with the extender. These extenders are shared by all scheduler profiles.</p>
</td>
</tr>
<tr><td><code>delayCacheUntilActive</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>DelayCacheUntilActive specifies when to start caching. If this is true and leader election is enabled,
the scheduler will wait to fill informer caches until it is the leader. Doing so will have slower
failover with the benefit of lower memory overhead while waiting to become leader.
Defaults to false.</p>
</td>
</tr>
</tbody>
</table>

## `NodeAffinityArgs`     {#kubescheduler-config-k8s-io-v1-NodeAffinityArgs}
    


<p>NodeAffinityArgs holds arguments to configure the NodeAffinity plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeAffinityArgs</code></td></tr>
    
  
<tr><td><code>addedAffinity</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#nodeaffinity-v1-core"><code>core/v1.NodeAffinity</code></a>
</td>
<td>
   <p>AddedAffinity is applied to all Pods additionally to the NodeAffinity
specified in the PodSpec. That is, Nodes need to satisfy AddedAffinity
AND .spec.NodeAffinity. AddedAffinity is empty by default (all Nodes
match).
When AddedAffinity is used, some Pods with affinity requirements that match
a specific Node (such as Daemonset Pods) might remain unschedulable.</p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesBalancedAllocationArgs`     {#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs}
    


<p>NodeResourcesBalancedAllocationArgs holds arguments used to configure NodeResourcesBalancedAllocation plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesBalancedAllocationArgs</code></td></tr>
    
  
<tr><td><code>resources</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   <p>Resources to be managed, the default is &quot;cpu&quot; and &quot;memory&quot; if not specified.</p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesFitArgs`     {#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs}
    


<p>NodeResourcesFitArgs holds arguments used to configure the NodeResourcesFit plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesFitArgs</code></td></tr>
    
  
<tr><td><code>ignoredResources</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>IgnoredResources is the list of resources that NodeResources fit filter
should ignore. This doesn't apply to scoring.</p>
</td>
</tr>
<tr><td><code>ignoredResourceGroups</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>IgnoredResourceGroups defines the list of resource groups that NodeResources fit filter should ignore.
e.g. if group is [&quot;example.com&quot;], it will ignore all resource names that begin
with &quot;example.com&quot;, such as &quot;example.com/aaa&quot; and &quot;example.com/bbb&quot;.
A resource group name can't contain '/'. This doesn't apply to scoring.</p>
</td>
</tr>
<tr><td><code>scoringStrategy</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ScoringStrategy"><code>ScoringStrategy</code></a>
</td>
<td>
   <p>ScoringStrategy selects the node resource scoring strategy.
The default strategy is LeastAllocated with an equal &quot;cpu&quot; and &quot;memory&quot; weight.</p>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadArgs`     {#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs}
    


<p>PodTopologySpreadArgs holds arguments used to configure the PodTopologySpread plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodTopologySpreadArgs</code></td></tr>
    
  
<tr><td><code>defaultConstraints</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#topologyspreadconstraint-v1-core"><code>[]core/v1.TopologySpreadConstraint</code></a>
</td>
<td>
   <p>DefaultConstraints defines topology spread constraints to be applied to
Pods that don't define any in <code>pod.spec.topologySpreadConstraints</code>.
<code>.defaultConstraints[*].labelSelectors</code> must be empty, as they are
deduced from the Pod's membership to Services, ReplicationControllers,
ReplicaSets or StatefulSets.
When not empty, .defaultingType must be &quot;List&quot;.</p>
</td>
</tr>
<tr><td><code>defaultingType</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-PodTopologySpreadConstraintsDefaulting"><code>PodTopologySpreadConstraintsDefaulting</code></a>
</td>
<td>
   <p>DefaultingType determines how .defaultConstraints are deduced. Can be one
of &quot;System&quot; or &quot;List&quot;.</p>
<ul>
<li>&quot;System&quot;: Use kubernetes defined constraints that spread Pods among
Nodes and Zones.</li>
<li>&quot;List&quot;: Use constraints defined in .defaultConstraints.</li>
</ul>
<p>Defaults to &quot;System&quot;.</p>
</td>
</tr>
</tbody>
</table>

## `VolumeBindingArgs`     {#kubescheduler-config-k8s-io-v1-VolumeBindingArgs}
    


<p>VolumeBindingArgs holds arguments used to configure the VolumeBinding plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>VolumeBindingArgs</code></td></tr>
    
  
<tr><td><code>bindTimeoutSeconds</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   <p>BindTimeoutSeconds is the timeout in seconds in volume binding operation.
Value must be non-negative integer. The value zero indicates no waiting.
If this value is nil, the default value (600) will be used.</p>
</td>
</tr>
<tr><td><code>shape</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   <p>Shape specifies the points defining the score function shape, which is
used to score nodes based on the utilization of statically provisioned
PVs. The utilization is calculated by dividing the total requested
storage of the pod by the total capacity of feasible PVs on each node.
Each point contains utilization (ranges from 0 to 100) and its
associated score (ranges from 0 to 10). You can turn the priority by
specifying different scores for different utilization numbers.
The default shape points are:</p>
<ol>
<li>0 for 0 utilization</li>
<li>10 for 100 utilization
All points must be sorted in increasing order by utilization.</li>
</ol>
</td>
</tr>
</tbody>
</table>

## `Extender`     {#kubescheduler-config-k8s-io-v1-Extender}
    

**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)


<p>Extender holds the parameters used to communicate with the extender. If a verb is unspecified/empty,
it is assumed that the extender chose not to provide that extension.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>urlPrefix</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>URLPrefix at which the extender is available</p>
</td>
</tr>
<tr><td><code>filterVerb</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Verb for the filter call, empty if not supported. This verb is appended to the URLPrefix when issuing the filter call to extender.</p>
</td>
</tr>
<tr><td><code>preemptVerb</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Verb for the preempt call, empty if not supported. This verb is appended to the URLPrefix when issuing the preempt call to extender.</p>
</td>
</tr>
<tr><td><code>prioritizeVerb</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Verb for the prioritize call, empty if not supported. This verb is appended to the URLPrefix when issuing the prioritize call to extender.</p>
</td>
</tr>
<tr><td><code>weight</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   <p>The numeric multiplier for the node scores that the prioritize call generates.
The weight should be a positive integer</p>
</td>
</tr>
<tr><td><code>bindVerb</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Verb for the bind call, empty if not supported. This verb is appended to the URLPrefix when issuing the bind call to extender.
If this method is implemented by the extender, it is the extender's responsibility to bind the pod to apiserver. Only one extender
can implement this function.</p>
</td>
</tr>
<tr><td><code>enableHTTPS</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>EnableHTTPS specifies whether https should be used to communicate with the extender</p>
</td>
</tr>
<tr><td><code>tlsConfig</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig"><code>ExtenderTLSConfig</code></a>
</td>
<td>
   <p>TLSConfig specifies the transport layer security config</p>
</td>
</tr>
<tr><td><code>httpTimeout</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>HTTPTimeout specifies the timeout duration for a call to the extender. Filter timeout fails the scheduling of the pod. Prioritize
timeout is ignored, k8s/other extenders priorities are used to select the node.</p>
</td>
</tr>
<tr><td><code>nodeCacheCapable</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>NodeCacheCapable specifies that the extender is capable of caching node information,
so the scheduler should only send minimal information about the eligible nodes
assuming that the extender already cached full details of all nodes in the cluster</p>
</td>
</tr>
<tr><td><code>managedResources</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-ExtenderManagedResource"><code>[]ExtenderManagedResource</code></a>
</td>
<td>
   <p>ManagedResources is a list of extended resources that are managed by
this extender.</p>
<ul>
<li>A pod will be sent to the extender on the Filter, Prioritize and Bind
(if the extender is the binder) phases iff the pod requests at least
one of the extended resources in this list. If empty or unspecified,
all pods will be sent to this extender.</li>
<li>If IgnoredByScheduler is set to true for a resource, kube-scheduler
will skip checking the resource in predicates.</li>
</ul>
</td>
</tr>
<tr><td><code>ignorable</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>Ignorable specifies if the extender is ignorable, i.e. scheduling should not
fail when the extender returns an error or is not reachable.</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderManagedResource`     {#kubescheduler-config-k8s-io-v1-ExtenderManagedResource}
    

**Appears in:**

- [Extender](#kubescheduler-config-k8s-io-v1-Extender)


<p>ExtenderManagedResource describes the arguments of extended resources
managed by an extender.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name is the extended resource name.</p>
</td>
</tr>
<tr><td><code>ignoredByScheduler</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>IgnoredByScheduler indicates whether kube-scheduler should ignore this
resource when applying predicates.</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderTLSConfig`     {#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig}
    

**Appears in:**

- [Extender](#kubescheduler-config-k8s-io-v1-Extender)


<p>ExtenderTLSConfig contains settings to enable TLS with extender</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>insecure</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>Server should be accessed without verifying the TLS certificate. For testing only.</p>
</td>
</tr>
<tr><td><code>serverName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>ServerName is passed to the server for SNI and is used in the client to check server
certificates against. If ServerName is empty, the hostname used to contact the
server is used.</p>
</td>
</tr>
<tr><td><code>certFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Server requires TLS client certificate authentication</p>
</td>
</tr>
<tr><td><code>keyFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Server requires TLS client certificate authentication</p>
</td>
</tr>
<tr><td><code>caFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Trusted root certificates for server</p>
</td>
</tr>
<tr><td><code>certData</code> <B>[Required]</B><br/>
<code>[]byte</code>
</td>
<td>
   <p>CertData holds PEM-encoded bytes (typically read from a client certificate file).
CertData takes precedence over CertFile</p>
</td>
</tr>
<tr><td><code>keyData</code> <B>[Required]</B><br/>
<code>[]byte</code>
</td>
<td>
   <p>KeyData holds PEM-encoded bytes (typically read from a client certificate key file).
KeyData takes precedence over KeyFile</p>
</td>
</tr>
<tr><td><code>caData</code> <B>[Required]</B><br/>
<code>[]byte</code>
</td>
<td>
   <p>CAData holds PEM-encoded bytes (typically read from a root certificates bundle).
CAData takes precedence over CAFile</p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerProfile`     {#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile}
    

**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)


<p>KubeSchedulerProfile is a scheduling profile.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>schedulerName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>SchedulerName is the name of the scheduler associated to this profile.
If SchedulerName matches with the pod's &quot;spec.schedulerName&quot;, then the pod
is scheduled with this profile.</p>
</td>
</tr>
<tr><td><code>percentageOfNodesToScore</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>PercentageOfNodesToScore is the percentage of all nodes that once found feasible
for running a pod, the scheduler stops its search for more feasible nodes in
the cluster. This helps improve scheduler's performance. Scheduler always tries to find
at least &quot;minFeasibleNodesToFind&quot; feasible nodes no matter what the value of this flag is.
Example: if the cluster size is 500 nodes and the value of this flag is 30,
then scheduler stops finding further feasible nodes once it finds 150 feasible ones.
When the value is 0, default percentage (5%--50% based on the size of the cluster) of the
nodes will be scored. It will override global PercentageOfNodesToScore. If it is empty,
global PercentageOfNodesToScore will be used.</p>
</td>
</tr>
<tr><td><code>plugins</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-Plugins"><code>Plugins</code></a>
</td>
<td>
   <p>Plugins specify the set of plugins that should be enabled or disabled.
Enabled plugins are the ones that should be enabled in addition to the
default plugins. Disabled plugins are any of the default plugins that
should be disabled.
When no enabled or disabled plugin is specified for an extension point,
default plugins for that extension point will be used if there is any.
If a QueueSort plugin is specified, the same QueueSort Plugin and
PluginConfig must be specified for all profiles.</p>
</td>
</tr>
<tr><td><code>pluginConfig</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginConfig"><code>[]PluginConfig</code></a>
</td>
<td>
   <p>PluginConfig is an optional set of custom plugin arguments for each plugin.
Omitting config args for a plugin is equivalent to using the default config
for that plugin.</p>
</td>
</tr>
</tbody>
</table>

## `Plugin`     {#kubescheduler-config-k8s-io-v1-Plugin}
    

**Appears in:**

- [PluginSet](#kubescheduler-config-k8s-io-v1-PluginSet)


<p>Plugin specifies a plugin name and its weight when applicable. Weight is used only for Score plugins.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name defines the name of plugin</p>
</td>
</tr>
<tr><td><code>weight</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>Weight defines the weight of plugin, only used for Score plugins.</p>
</td>
</tr>
</tbody>
</table>

## `PluginConfig`     {#kubescheduler-config-k8s-io-v1-PluginConfig}
    

**Appears in:**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)


<p>PluginConfig specifies arguments that should be passed to a plugin at the time of initialization.
A plugin that is invoked at multiple extension points is initialized once. Args can have arbitrary structure.
It is up to the plugin to process these Args.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name defines the name of plugin being configured</p>
</td>
</tr>
<tr><td><code>args</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <p>Args defines the arguments passed to the plugins at the time of initialization. Args can have arbitrary structure.</p>
</td>
</tr>
</tbody>
</table>

## `PluginSet`     {#kubescheduler-config-k8s-io-v1-PluginSet}
    

**Appears in:**

- [Plugins](#kubescheduler-config-k8s-io-v1-Plugins)


<p>PluginSet specifies enabled and disabled plugins for an extension point.
If an array is empty, missing, or nil, default plugins at that extension point will be used.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>enabled</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   <p>Enabled specifies plugins that should be enabled in addition to default plugins.
If the default plugin is also configured in the scheduler config file, the weight of plugin will
be overridden accordingly.
These are called after default plugins and in the same order specified here.</p>
</td>
</tr>
<tr><td><code>disabled</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   <p>Disabled specifies default plugins that should be disabled.
When all default plugins need to be disabled, an array containing only one &quot;*&quot; should be provided.</p>
</td>
</tr>
</tbody>
</table>

## `Plugins`     {#kubescheduler-config-k8s-io-v1-Plugins}
    

**Appears in:**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)


<p>Plugins include multiple extension points. When specified, the list of plugins for
a particular extension point are the only ones enabled. If an extension point is
omitted from the config, then the default set of plugins is used for that extension point.
Enabled plugins are called in the order specified here, after default plugins. If they need to
be invoked before default plugins, default plugins must be disabled and re-enabled here in desired order.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>preEnqueue</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PreEnqueue is a list of plugins that should be invoked before adding pods to the scheduling queue.</p>
</td>
</tr>
<tr><td><code>queueSort</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>QueueSort is a list of plugins that should be invoked when sorting pods in the scheduling queue.</p>
</td>
</tr>
<tr><td><code>preFilter</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PreFilter is a list of plugins that should be invoked at &quot;PreFilter&quot; extension point of the scheduling framework.</p>
</td>
</tr>
<tr><td><code>filter</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Filter is a list of plugins that should be invoked when filtering out nodes that cannot run the Pod.</p>
</td>
</tr>
<tr><td><code>postFilter</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PostFilter is a list of plugins that are invoked after filtering phase, but only when no feasible nodes were found for the pod.</p>
</td>
</tr>
<tr><td><code>preScore</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PreScore is a list of plugins that are invoked before scoring.</p>
</td>
</tr>
<tr><td><code>score</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Score is a list of plugins that should be invoked when ranking nodes that have passed the filtering phase.</p>
</td>
</tr>
<tr><td><code>reserve</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Reserve is a list of plugins invoked when reserving/unreserving resources
after a node is assigned to run the pod.</p>
</td>
</tr>
<tr><td><code>permit</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Permit is a list of plugins that control binding of a Pod. These plugins can prevent or delay binding of a Pod.</p>
</td>
</tr>
<tr><td><code>preBind</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PreBind is a list of plugins that should be invoked before a pod is bound.</p>
</td>
</tr>
<tr><td><code>bind</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Bind is a list of plugins that should be invoked at &quot;Bind&quot; extension point of the scheduling framework.
The scheduler call these plugins in order. Scheduler skips the rest of these plugins as soon as one returns success.</p>
</td>
</tr>
<tr><td><code>postBind</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PostBind is a list of plugins that should be invoked after a pod is successfully bound.</p>
</td>
</tr>
<tr><td><code>multiPoint</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>MultiPoint is a simplified config section to enable plugins for all valid extension points.
Plugins enabled through MultiPoint will automatically register for every individual extension
point the plugin has implemented. Disabling a plugin through MultiPoint disables that behavior.
The same is true for disabling &quot;*&quot; through MultiPoint (no default plugins will be automatically registered).
Plugins can still be disabled through their individual extension points.</p>
<p>In terms of precedence, plugin config follows this basic hierarchy</p>
<ol>
<li>Specific extension points</li>
<li>Explicitly configured MultiPoint plugins</li>
<li>The set of default plugins, as MultiPoint plugins
This implies that a higher precedence plugin will run first and overwrite any settings within MultiPoint.
Explicitly user-configured plugins also take a higher precedence over default plugins.
Within this hierarchy, an Enabled setting takes precedence over Disabled. For example, if a plugin is
set in both <code>multiPoint.Enabled</code> and <code>multiPoint.Disabled</code>, the plugin will be enabled. Similarly,
including <code>multiPoint.Disabled = '*'</code> and <code>multiPoint.Enabled = pluginA</code> will still register that specific
plugin through MultiPoint. This follows the same behavior as all other extension point configurations.</li>
</ol>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadConstraintsDefaulting`     {#kubescheduler-config-k8s-io-v1-PodTopologySpreadConstraintsDefaulting}
    
(Alias of `string`)

**Appears in:**

- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs)


<p>PodTopologySpreadConstraintsDefaulting defines how to set default constraints
for the PodTopologySpread plugin.</p>




## `RequestedToCapacityRatioParam`     {#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam}
    

**Appears in:**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)


<p>RequestedToCapacityRatioParam define RequestedToCapacityRatio parameters</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>shape</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   <p>Shape is a list of points defining the scoring function shape.</p>
</td>
</tr>
</tbody>
</table>

## `ResourceSpec`     {#kubescheduler-config-k8s-io-v1-ResourceSpec}
    

**Appears in:**

- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs)

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)


<p>ResourceSpec represents a single resource.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name of the resource.</p>
</td>
</tr>
<tr><td><code>weight</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   <p>Weight of the resource.</p>
</td>
</tr>
</tbody>
</table>

## `ScoringStrategy`     {#kubescheduler-config-k8s-io-v1-ScoringStrategy}
    

**Appears in:**

- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)


<p>ScoringStrategy define ScoringStrategyType for node resource plugin</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>type</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ScoringStrategyType"><code>ScoringStrategyType</code></a>
</td>
<td>
   <p>Type selects which strategy to run.</p>
</td>
</tr>
<tr><td><code>resources</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   <p>Resources to consider when scoring.
The default resource set includes &quot;cpu&quot; and &quot;memory&quot; with an equal weight.
Allowed weights go from 1 to 100.
Weight defaults to 1 if not specified or explicitly set to 0.</p>
</td>
</tr>
<tr><td><code>requestedToCapacityRatio</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam"><code>RequestedToCapacityRatioParam</code></a>
</td>
<td>
   <p>Arguments specific to RequestedToCapacityRatio strategy.</p>
</td>
</tr>
</tbody>
</table>

## `ScoringStrategyType`     {#kubescheduler-config-k8s-io-v1-ScoringStrategyType}
    
(Alias of `string`)

**Appears in:**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)


<p>ScoringStrategyType the type of scoring strategy used in NodeResourcesFit plugin.</p>




## `UtilizationShapePoint`     {#kubescheduler-config-k8s-io-v1-UtilizationShapePoint}
    

**Appears in:**

- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)

- [RequestedToCapacityRatioParam](#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam)


<p>UtilizationShapePoint represents single point of priority function shape.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>utilization</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>Utilization (x axis). Valid values are 0 to 100. Fully utilized node maps to 100.</p>
</td>
</tr>
<tr><td><code>score</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>Score assigned to given utilization (y axis). Valid values are 0 to 10.</p>
</td>
</tr>
</tbody>
</table>
  