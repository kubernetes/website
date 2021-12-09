---
title: kube-scheduler Configuration (v1beta3)
content_type: tool-reference
package: kubescheduler.config.k8s.io/v1beta3
auto_generated: true
---


## Resource Types 


- [DefaultPreemptionArgs](#kubescheduler-config-k8s-io-v1beta3-DefaultPreemptionArgs)
- [InterPodAffinityArgs](#kubescheduler-config-k8s-io-v1beta3-InterPodAffinityArgs)
- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)
- [NodeAffinityArgs](#kubescheduler-config-k8s-io-v1beta3-NodeAffinityArgs)
- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1beta3-NodeResourcesBalancedAllocationArgs)
- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs)
- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadArgs)
- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1beta3-VolumeBindingArgs)
  
    


## `DefaultPreemptionArgs`     {#kubescheduler-config-k8s-io-v1beta3-DefaultPreemptionArgs}
    




DefaultPreemptionArgs holds arguments used to configure the
DefaultPreemption plugin.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>DefaultPreemptionArgs</code></td></tr>
    

  
  
<tr><td><code>minCandidateNodesPercentage</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   MinCandidateNodesPercentage is the minimum number of candidates to
shortlist when dry running preemption as a percentage of number of nodes.
Must be in the range [0, 100]. Defaults to 10% of the cluster size if
unspecified.</td>
</tr>
    
  
<tr><td><code>minCandidateNodesAbsolute</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   MinCandidateNodesAbsolute is the absolute minimum number of candidates to
shortlist. The likely number of candidates enumerated for dry running
preemption is given by the formula:
numCandidates = max(numNodes &lowast; minCandidateNodesPercentage, minCandidateNodesAbsolute)
We say "likely" because there are other factors such as PDB violations
that play a role in the number of candidates shortlisted. Must be at least
0 nodes. Defaults to 100 nodes if unspecified.</td>
</tr>
    
  
</tbody>
</table>
    


## `InterPodAffinityArgs`     {#kubescheduler-config-k8s-io-v1beta3-InterPodAffinityArgs}
    




InterPodAffinityArgs holds arguments used to configure the InterPodAffinity plugin.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InterPodAffinityArgs</code></td></tr>
    

  
  
<tr><td><code>hardPodAffinityWeight</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   HardPodAffinityWeight is the scoring weight for existing pods with a
matching hard affinity to the incoming pod.</td>
</tr>
    
  
</tbody>
</table>
    


## `KubeSchedulerConfiguration`     {#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration}
    




KubeSchedulerConfiguration configures a scheduler

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeSchedulerConfiguration</code></td></tr>
    

  
  
<tr><td><code>parallelism</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   Parallelism defines the amount of parallelism in algorithms for scheduling a Pods. Must be greater than 0. Defaults to 16</td>
</tr>
    
  
<tr><td><code>leaderElection</code> <B>[Required]</B><br/>
<a href="#LeaderElectionConfiguration"><code>LeaderElectionConfiguration</code></a>
</td>
<td>
   LeaderElection defines the configuration of leader election client.</td>
</tr>
    
  
<tr><td><code>clientConnection</code> <B>[Required]</B><br/>
<a href="#ClientConnectionConfiguration"><code>ClientConnectionConfiguration</code></a>
</td>
<td>
   ClientConnection specifies the kubeconfig file and client connection
settings for the proxy server to use when communicating with the apiserver.</td>
</tr>
    
  
<tr><td><code>DebuggingConfiguration</code> <B>[Required]</B><br/>
<a href="#DebuggingConfiguration"><code>DebuggingConfiguration</code></a>
</td>
<td>(Members of <code>DebuggingConfiguration</code> are embedded into this type.)
   DebuggingConfiguration holds configuration for Debugging related features
TODO: We might wanna make this a substruct like Debugging componentbaseconfigv1alpha1.DebuggingConfiguration</td>
</tr>
    
  
<tr><td><code>percentageOfNodesToScore</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   PercentageOfNodesToScore is the percentage of all nodes that once found feasible
for running a pod, the scheduler stops its search for more feasible nodes in
the cluster. This helps improve scheduler's performance. Scheduler always tries to find
at least "minFeasibleNodesToFind" feasible nodes no matter what the value of this flag is.
Example: if the cluster size is 500 nodes and the value of this flag is 30,
then scheduler stops finding further feasible nodes once it finds 150 feasible ones.
When the value is 0, default percentage (5%--50% based on the size of the cluster) of the
nodes will be scored.</td>
</tr>
    
  
<tr><td><code>podInitialBackoffSeconds</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   PodInitialBackoffSeconds is the initial backoff for unschedulable pods.
If specified, it must be greater than 0. If this value is null, the default value (1s)
will be used.</td>
</tr>
    
  
<tr><td><code>podMaxBackoffSeconds</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   PodMaxBackoffSeconds is the max backoff for unschedulable pods.
If specified, it must be greater than podInitialBackoffSeconds. If this value is null,
the default value (10s) will be used.</td>
</tr>
    
  
<tr><td><code>profiles</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile"><code>[]KubeSchedulerProfile</code></a>
</td>
<td>
   Profiles are scheduling profiles that kube-scheduler supports. Pods can
choose to be scheduled under a particular profile by setting its associated
scheduler name. Pods that don't specify any scheduler name are scheduled
with the "default-scheduler" profile, if present here.</td>
</tr>
    
  
<tr><td><code>extenders</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-Extender"><code>[]Extender</code></a>
</td>
<td>
   Extenders are the list of scheduler extenders, each holding the values of how to communicate
with the extender. These extenders are shared by all scheduler profiles.</td>
</tr>
    
  
</tbody>
</table>
    


## `NodeAffinityArgs`     {#kubescheduler-config-k8s-io-v1beta3-NodeAffinityArgs}
    




NodeAffinityArgs holds arguments to configure the NodeAffinity plugin.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeAffinityArgs</code></td></tr>
    

  
  
<tr><td><code>addedAffinity</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#nodeaffinity-v1-core"><code>core/v1.NodeAffinity</code></a>
</td>
<td>
   AddedAffinity is applied to all Pods additionally to the NodeAffinity
specified in the PodSpec. That is, Nodes need to satisfy AddedAffinity
AND .spec.NodeAffinity. AddedAffinity is empty by default (all Nodes
match).
When AddedAffinity is used, some Pods with affinity requirements that match
a specific Node (such as Daemonset Pods) might remain unschedulable.</td>
</tr>
    
  
</tbody>
</table>
    


## `NodeResourcesBalancedAllocationArgs`     {#kubescheduler-config-k8s-io-v1beta3-NodeResourcesBalancedAllocationArgs}
    




NodeResourcesBalancedAllocationArgs holds arguments used to configure NodeResourcesBalancedAllocation plugin.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesBalancedAllocationArgs</code></td></tr>
    

  
  
<tr><td><code>resources</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   Resources to be managed, the default is "cpu" and "memory" if not specified.</td>
</tr>
    
  
</tbody>
</table>
    


## `NodeResourcesFitArgs`     {#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs}
    




NodeResourcesFitArgs holds arguments used to configure the NodeResourcesFit plugin.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesFitArgs</code></td></tr>
    

  
  
<tr><td><code>ignoredResources</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   IgnoredResources is the list of resources that NodeResources fit filter
should ignore. This doesn't apply to scoring.</td>
</tr>
    
  
<tr><td><code>ignoredResourceGroups</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   IgnoredResourceGroups defines the list of resource groups that NodeResources fit filter should ignore.
e.g. if group is ["example.com"], it will ignore all resource names that begin
with "example.com", such as "example.com/aaa" and "example.com/bbb".
A resource group name can't contain '/'. This doesn't apply to scoring.</td>
</tr>
    
  
<tr><td><code>scoringStrategy</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy"><code>ScoringStrategy</code></a>
</td>
<td>
   ScoringStrategy selects the node resource scoring strategy.
The default strategy is LeastAllocated with an equal "cpu" and "memory" weight.</td>
</tr>
    
  
</tbody>
</table>
    


## `PodTopologySpreadArgs`     {#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadArgs}
    




PodTopologySpreadArgs holds arguments used to configure the PodTopologySpread plugin.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodTopologySpreadArgs</code></td></tr>
    

  
  
<tr><td><code>defaultConstraints</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#topologyspreadconstraint-v1-core"><code>[]core/v1.TopologySpreadConstraint</code></a>
</td>
<td>
   DefaultConstraints defines topology spread constraints to be applied to
Pods that don't define any in `pod.spec.topologySpreadConstraints`.
`.defaultConstraints[&lowast;].labelSelectors` must be empty, as they are
deduced from the Pod's membership to Services, ReplicationControllers,
ReplicaSets or StatefulSets.
When not empty, .defaultingType must be "List".</td>
</tr>
    
  
<tr><td><code>defaultingType</code><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadConstraintsDefaulting"><code>PodTopologySpreadConstraintsDefaulting</code></a>
</td>
<td>
   DefaultingType determines how .defaultConstraints are deduced. Can be one
of "System" or "List".

- "System": Use kubernetes defined constraints that spread Pods among
  Nodes and Zones.
- "List": Use constraints defined in .defaultConstraints.

Defaults to "List" if feature gate DefaultPodTopologySpread is disabled
and to "System" if enabled.</td>
</tr>
    
  
</tbody>
</table>
    


## `VolumeBindingArgs`     {#kubescheduler-config-k8s-io-v1beta3-VolumeBindingArgs}
    




VolumeBindingArgs holds arguments used to configure the VolumeBinding plugin.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>VolumeBindingArgs</code></td></tr>
    

  
  
<tr><td><code>bindTimeoutSeconds</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   BindTimeoutSeconds is the timeout in seconds in volume binding operation.
Value must be non-negative integer. The value zero indicates no waiting.
If this value is nil, the default value (600) will be used.</td>
</tr>
    
  
<tr><td><code>shape</code><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
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
All points must be sorted in increasing order by utilization.</td>
</tr>
    
  
</tbody>
</table>
    


## `Extender`     {#kubescheduler-config-k8s-io-v1beta3-Extender}
    



**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)


Extender holds the parameters used to communicate with the extender. If a verb is unspecified/empty,
it is assumed that the extender chose not to provide that extension.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>urlPrefix</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   URLPrefix at which the extender is available</td>
</tr>
    
  
<tr><td><code>filterVerb</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Verb for the filter call, empty if not supported. This verb is appended to the URLPrefix when issuing the filter call to extender.</td>
</tr>
    
  
<tr><td><code>preemptVerb</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Verb for the preempt call, empty if not supported. This verb is appended to the URLPrefix when issuing the preempt call to extender.</td>
</tr>
    
  
<tr><td><code>prioritizeVerb</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Verb for the prioritize call, empty if not supported. This verb is appended to the URLPrefix when issuing the prioritize call to extender.</td>
</tr>
    
  
<tr><td><code>weight</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   The numeric multiplier for the node scores that the prioritize call generates.
The weight should be a positive integer</td>
</tr>
    
  
<tr><td><code>bindVerb</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Verb for the bind call, empty if not supported. This verb is appended to the URLPrefix when issuing the bind call to extender.
If this method is implemented by the extender, it is the extender's responsibility to bind the pod to apiserver. Only one extender
can implement this function.</td>
</tr>
    
  
<tr><td><code>enableHTTPS</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   EnableHTTPS specifies whether https should be used to communicate with the extender</td>
</tr>
    
  
<tr><td><code>tlsConfig</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ExtenderTLSConfig"><code>ExtenderTLSConfig</code></a>
</td>
<td>
   TLSConfig specifies the transport layer security config</td>
</tr>
    
  
<tr><td><code>httpTimeout</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   HTTPTimeout specifies the timeout duration for a call to the extender. Filter timeout fails the scheduling of the pod. Prioritize
timeout is ignored, k8s/other extenders priorities are used to select the node.</td>
</tr>
    
  
<tr><td><code>nodeCacheCapable</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   NodeCacheCapable specifies that the extender is capable of caching node information,
so the scheduler should only send minimal information about the eligible nodes
assuming that the extender already cached full details of all nodes in the cluster</td>
</tr>
    
  
<tr><td><code>managedResources</code><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ExtenderManagedResource"><code>[]ExtenderManagedResource</code></a>
</td>
<td>
   ManagedResources is a list of extended resources that are managed by
this extender.
- A pod will be sent to the extender on the Filter, Prioritize and Bind
  (if the extender is the binder) phases iff the pod requests at least
  one of the extended resources in this list. If empty or unspecified,
  all pods will be sent to this extender.
- If IgnoredByScheduler is set to true for a resource, kube-scheduler
  will skip checking the resource in predicates.</td>
</tr>
    
  
<tr><td><code>ignorable</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   Ignorable specifies if the extender is ignorable, i.e. scheduling should not
fail when the extender returns an error or is not reachable.</td>
</tr>
    
  
</tbody>
</table>
    


## `ExtenderManagedResource`     {#kubescheduler-config-k8s-io-v1beta3-ExtenderManagedResource}
    



**Appears in:**

- [Extender](#kubescheduler-config-k8s-io-v1beta3-Extender)


ExtenderManagedResource describes the arguments of extended resources
managed by an extender.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Name is the extended resource name.</td>
</tr>
    
  
<tr><td><code>ignoredByScheduler</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   IgnoredByScheduler indicates whether kube-scheduler should ignore this
resource when applying predicates.</td>
</tr>
    
  
</tbody>
</table>
    


## `ExtenderTLSConfig`     {#kubescheduler-config-k8s-io-v1beta3-ExtenderTLSConfig}
    



**Appears in:**

- [Extender](#kubescheduler-config-k8s-io-v1beta3-Extender)


ExtenderTLSConfig contains settings to enable TLS with extender

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>insecure</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   Server should be accessed without verifying the TLS certificate. For testing only.</td>
</tr>
    
  
<tr><td><code>serverName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   ServerName is passed to the server for SNI and is used in the client to check server
certificates against. If ServerName is empty, the hostname used to contact the
server is used.</td>
</tr>
    
  
<tr><td><code>certFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Server requires TLS client certificate authentication</td>
</tr>
    
  
<tr><td><code>keyFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Server requires TLS client certificate authentication</td>
</tr>
    
  
<tr><td><code>caFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Trusted root certificates for server</td>
</tr>
    
  
<tr><td><code>certData</code> <B>[Required]</B><br/>
<code>[]byte</code>
</td>
<td>
   CertData holds PEM-encoded bytes (typically read from a client certificate file).
CertData takes precedence over CertFile</td>
</tr>
    
  
<tr><td><code>keyData</code> <B>[Required]</B><br/>
<code>[]byte</code>
</td>
<td>
   KeyData holds PEM-encoded bytes (typically read from a client certificate key file).
KeyData takes precedence over KeyFile</td>
</tr>
    
  
<tr><td><code>caData</code> <B>[Required]</B><br/>
<code>[]byte</code>
</td>
<td>
   CAData holds PEM-encoded bytes (typically read from a root certificates bundle).
CAData takes precedence over CAFile</td>
</tr>
    
  
</tbody>
</table>
    


## `KubeSchedulerProfile`     {#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile}
    



**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)


KubeSchedulerProfile is a scheduling profile.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>schedulerName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   SchedulerName is the name of the scheduler associated to this profile.
If SchedulerName matches with the pod's "spec.schedulerName", then the pod
is scheduled with this profile.</td>
</tr>
    
  
<tr><td><code>plugins</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-Plugins"><code>Plugins</code></a>
</td>
<td>
   Plugins specify the set of plugins that should be enabled or disabled.
Enabled plugins are the ones that should be enabled in addition to the
default plugins. Disabled plugins are any of the default plugins that
should be disabled.
When no enabled or disabled plugin is specified for an extension point,
default plugins for that extension point will be used if there is any.
If a QueueSort plugin is specified, the same QueueSort Plugin and
PluginConfig must be specified for all profiles.</td>
</tr>
    
  
<tr><td><code>pluginConfig</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginConfig"><code>[]PluginConfig</code></a>
</td>
<td>
   PluginConfig is an optional set of custom plugin arguments for each plugin.
Omitting config args for a plugin is equivalent to using the default config
for that plugin.</td>
</tr>
    
  
</tbody>
</table>
    


## `Plugin`     {#kubescheduler-config-k8s-io-v1beta3-Plugin}
    



**Appears in:**

- [PluginSet](#kubescheduler-config-k8s-io-v1beta3-PluginSet)


Plugin specifies a plugin name and its weight when applicable. Weight is used only for Score plugins.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Name defines the name of plugin</td>
</tr>
    
  
<tr><td><code>weight</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   Weight defines the weight of plugin, only used for Score plugins.</td>
</tr>
    
  
</tbody>
</table>
    


## `PluginConfig`     {#kubescheduler-config-k8s-io-v1beta3-PluginConfig}
    



**Appears in:**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile)


PluginConfig specifies arguments that should be passed to a plugin at the time of initialization.
A plugin that is invoked at multiple extension points is initialized once. Args can have arbitrary structure.
It is up to the plugin to process these Args.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Name defines the name of plugin being configured</td>
</tr>
    
  
<tr><td><code>args</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   Args defines the arguments passed to the plugins at the time of initialization. Args can have arbitrary structure.</td>
</tr>
    
  
</tbody>
</table>
    


## `PluginSet`     {#kubescheduler-config-k8s-io-v1beta3-PluginSet}
    



**Appears in:**

- [Plugins](#kubescheduler-config-k8s-io-v1beta3-Plugins)


PluginSet specifies enabled and disabled plugins for an extension point.
If an array is empty, missing, or nil, default plugins at that extension point will be used.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>enabled</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   Enabled specifies plugins that should be enabled in addition to default plugins.
If the default plugin is also configured in the scheduler config file, the weight of plugin will
be overridden accordingly.
These are called after default plugins and in the same order specified here.</td>
</tr>
    
  
<tr><td><code>disabled</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   Disabled specifies default plugins that should be disabled.
When all default plugins need to be disabled, an array containing only one "&lowast;" should be provided.</td>
</tr>
    
  
</tbody>
</table>
    


## `Plugins`     {#kubescheduler-config-k8s-io-v1beta3-Plugins}
    



**Appears in:**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile)


Plugins include multiple extension points. When specified, the list of plugins for
a particular extension point are the only ones enabled. If an extension point is
omitted from the config, then the default set of plugins is used for that extension point.
Enabled plugins are called in the order specified here, after default plugins. If they need to
be invoked before default plugins, default plugins must be disabled and re-enabled here in desired order.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>queueSort</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   QueueSort is a list of plugins that should be invoked when sorting pods in the scheduling queue.</td>
</tr>
    
  
<tr><td><code>preFilter</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   PreFilter is a list of plugins that should be invoked at "PreFilter" extension point of the scheduling framework.</td>
</tr>
    
  
<tr><td><code>filter</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   Filter is a list of plugins that should be invoked when filtering out nodes that cannot run the Pod.</td>
</tr>
    
  
<tr><td><code>postFilter</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   PostFilter is a list of plugins that are invoked after filtering phase, but only when no feasible nodes were found for the pod.</td>
</tr>
    
  
<tr><td><code>preScore</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   PreScore is a list of plugins that are invoked before scoring.</td>
</tr>
    
  
<tr><td><code>score</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   Score is a list of plugins that should be invoked when ranking nodes that have passed the filtering phase.</td>
</tr>
    
  
<tr><td><code>reserve</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   Reserve is a list of plugins invoked when reserving/unreserving resources
after a node is assigned to run the pod.</td>
</tr>
    
  
<tr><td><code>permit</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   Permit is a list of plugins that control binding of a Pod. These plugins can prevent or delay binding of a Pod.</td>
</tr>
    
  
<tr><td><code>preBind</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   PreBind is a list of plugins that should be invoked before a pod is bound.</td>
</tr>
    
  
<tr><td><code>bind</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   Bind is a list of plugins that should be invoked at "Bind" extension point of the scheduling framework.
The scheduler call these plugins in order. Scheduler skips the rest of these plugins as soon as one returns success.</td>
</tr>
    
  
<tr><td><code>postBind</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   PostBind is a list of plugins that should be invoked after a pod is successfully bound.</td>
</tr>
    
  
<tr><td><code>multiPoint</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   MultiPoint is a simplified config section to enable plugins for all valid extension points.
Plugins enabled through MultiPoint will automatically register for every individual extension
point the plugin has implemented. Disabling a plugin through MultiPoint disables that behavior.
The same is true for disabling "&lowast;" through MultiPoint (no default plugins will be automatically registered).
Plugins can still be disabled through their individual extension points.

In terms of precedence, plugin config follows this basic hierarchy
  1. Specific extension points
  2. Explicitly configured MultiPoint plugins
  3. The set of default plugins, as MultiPoint plugins
This implies that a higher precedence plugin will run first and overwrite any settings within MultiPoint.
Explicitly user-configured plugins also take a higher precedence over default plugins.
Within this hierarchy, an Enabled setting takes precedence over Disabled. For example, if a plugin is
set in both `multiPoint.Enabled` and `multiPoint.Disabled`, the plugin will be enabled. Similarly,
including `multiPoint.Disabled = '&lowast;'` and `multiPoint.Enabled = pluginA` will still register that specific
plugin through MultiPoint. This follows the same behavior as all other extension point configurations.</td>
</tr>
    
  
</tbody>
</table>
    


## `PodTopologySpreadConstraintsDefaulting`     {#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadConstraintsDefaulting}
    
(Alias of `string`)


**Appears in:**

- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1beta3-PodTopologySpreadArgs)


PodTopologySpreadConstraintsDefaulting defines how to set default constraints
for the PodTopologySpread plugin.


    


## `RequestedToCapacityRatioParam`     {#kubescheduler-config-k8s-io-v1beta3-RequestedToCapacityRatioParam}
    



**Appears in:**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy)


RequestedToCapacityRatioParam define RequestedToCapacityRatio parameters

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>shape</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   Shape is a list of points defining the scoring function shape.</td>
</tr>
    
  
</tbody>
</table>
    


## `ResourceSpec`     {#kubescheduler-config-k8s-io-v1beta3-ResourceSpec}
    



**Appears in:**

- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1beta3-NodeResourcesBalancedAllocationArgs)

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy)


ResourceSpec represents a single resource.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Name of the resource.</td>
</tr>
    
  
<tr><td><code>weight</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   Weight of the resource.</td>
</tr>
    
  
</tbody>
</table>
    


## `ScoringStrategy`     {#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy}
    



**Appears in:**

- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs)


ScoringStrategy define ScoringStrategyType for node resource plugin

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>type</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ScoringStrategyType"><code>ScoringStrategyType</code></a>
</td>
<td>
   Type selects which strategy to run.</td>
</tr>
    
  
<tr><td><code>resources</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   Resources to consider when scoring.
The default resource set includes "cpu" and "memory" with an equal weight.
Allowed weights go from 1 to 100.
Weight defaults to 1 if not specified or explicitly set to 0.</td>
</tr>
    
  
<tr><td><code>requestedToCapacityRatio</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1beta3-RequestedToCapacityRatioParam"><code>RequestedToCapacityRatioParam</code></a>
</td>
<td>
   Arguments specific to RequestedToCapacityRatio strategy.</td>
</tr>
    
  
</tbody>
</table>
    


## `ScoringStrategyType`     {#kubescheduler-config-k8s-io-v1beta3-ScoringStrategyType}
    
(Alias of `string`)


**Appears in:**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy)


ScoringStrategyType the type of scoring strategy used in NodeResourcesFit plugin.


    


## `UtilizationShapePoint`     {#kubescheduler-config-k8s-io-v1beta3-UtilizationShapePoint}
    



**Appears in:**

- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1beta3-VolumeBindingArgs)

- [RequestedToCapacityRatioParam](#kubescheduler-config-k8s-io-v1beta3-RequestedToCapacityRatioParam)


UtilizationShapePoint represents single point of priority function shape.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>utilization</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   Utilization (x axis). Valid values are 0 to 100. Fully utilized node maps to 100.</td>
</tr>
    
  
<tr><td><code>score</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   Score assigned to given utilization (y axis). Valid values are 0 to 10.</td>
</tr>
    
  
</tbody>
</table>
    
  
  
    

## `ClientConnectionConfiguration`     {#ClientConnectionConfiguration}
    



**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)


ClientConnectionConfiguration contains details for constructing a client.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>kubeconfig</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   kubeconfig is the path to a KubeConfig file.</td>
</tr>
    
  
<tr><td><code>acceptContentTypes</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   acceptContentTypes defines the Accept header sent by clients when connecting to a server, overriding the
default value of 'application/json'. This field will control all connections to the server used by a particular
client.</td>
</tr>
    
  
<tr><td><code>contentType</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   contentType is the content type used when sending data to the server from this client.</td>
</tr>
    
  
<tr><td><code>qps</code> <B>[Required]</B><br/>
<code>float32</code>
</td>
<td>
   qps controls the number of queries per second allowed for this connection.</td>
</tr>
    
  
<tr><td><code>burst</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   burst allows extra queries to accumulate when a client is exceeding its rate.</td>
</tr>
    
  
</tbody>
</table>

## `DebuggingConfiguration`     {#DebuggingConfiguration}
    



**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)


DebuggingConfiguration holds configuration for Debugging related features.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>enableProfiling</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   enableProfiling enables profiling via web interface host:port/debug/pprof/</td>
</tr>
    
  
<tr><td><code>enableContentionProfiling</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   enableContentionProfiling enables lock contention profiling, if
enableProfiling is true.</td>
</tr>
    
  
</tbody>
</table>

## `FormatOptions`     {#FormatOptions}
    



**Appears in:**

- [LoggingConfiguration](#LoggingConfiguration)


FormatOptions contains options for the different logging formats.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>json</code> <B>[Required]</B><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
   [Experimental] JSON contains options for logging format "json".</td>
</tr>
    
  
</tbody>
</table>

## `JSONOptions`     {#JSONOptions}
    



**Appears in:**

- [FormatOptions](#FormatOptions)


JSONOptions contains options for logging format "json".

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>splitStream</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   [Experimental] SplitStream redirects error messages to stderr while
info messages go to stdout, with buffering. The default is to write
both to stdout, without buffering.</td>
</tr>
    
  
<tr><td><code>infoBufferSize</code> <B>[Required]</B><br/>
<code>k8s.io/apimachinery/pkg/api/resource.QuantityValue</code>
</td>
<td>
   [Experimental] InfoBufferSize sets the size of the info stream when
using split streams. The default is zero, which disables buffering.</td>
</tr>
    
  
</tbody>
</table>

## `LeaderElectionConfiguration`     {#LeaderElectionConfiguration}
    



**Appears in:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta2-KubeSchedulerConfiguration)

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerConfiguration)


LeaderElectionConfiguration defines the configuration of leader election
clients for components that can run with leader election enabled.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>leaderElect</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   leaderElect enables a leader election client to gain leadership
before executing the main loop. Enable this when running replicated
components for high availability.</td>
</tr>
    
  
<tr><td><code>leaseDuration</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   leaseDuration is the duration that non-leader candidates will wait
after observing a leadership renewal until attempting to acquire
leadership of a led but unrenewed leader slot. This is effectively the
maximum duration that a leader can be stopped before it is replaced
by another candidate. This is only applicable if leader election is
enabled.</td>
</tr>
    
  
<tr><td><code>renewDeadline</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   renewDeadline is the interval between attempts by the acting master to
renew a leadership slot before it stops leading. This must be less
than or equal to the lease duration. This is only applicable if leader
election is enabled.</td>
</tr>
    
  
<tr><td><code>retryPeriod</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   retryPeriod is the duration the clients should wait between attempting
acquisition and renewal of a leadership. This is only applicable if
leader election is enabled.</td>
</tr>
    
  
<tr><td><code>resourceLock</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   resourceLock indicates the resource object type that will be used to lock
during leader election cycles.</td>
</tr>
    
  
<tr><td><code>resourceName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   resourceName indicates the name of resource object that will be used to lock
during leader election cycles.</td>
</tr>
    
  
<tr><td><code>resourceNamespace</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   resourceName indicates the namespace of resource object that will be used to lock
during leader election cycles.</td>
</tr>
    
  
</tbody>
</table>

## `LoggingConfiguration`     {#LoggingConfiguration}
    



**Appears in:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)


LoggingConfiguration contains logging options
Refer [Logs Options](https://github.com/kubernetes/component-base/blob/master/logs/options.go) for more information.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>format</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Format Flag specifies the structure of log messages.
default value of format is `text`</td>
</tr>
    
  
<tr><td><code>flushFrequency</code> <B>[Required]</B><br/>
<a href="https://godoc.org/time#Duration"><code>time.Duration</code></a>
</td>
<td>
   Maximum number of seconds between log flushes. Ignored if the
selected logging backend writes log messages without buffering.</td>
</tr>
    
  
<tr><td><code>verbosity</code> <B>[Required]</B><br/>
<code>uint32</code>
</td>
<td>
   Verbosity is the threshold that determines which log messages are
logged. Default is zero which logs only the most important
messages. Higher values enable additional messages. Error messages
are always logged.</td>
</tr>
    
  
<tr><td><code>vmodule</code> <B>[Required]</B><br/>
<a href="#VModuleConfiguration"><code>VModuleConfiguration</code></a>
</td>
<td>
   VModule overrides the verbosity threshold for individual files.
Only supported for "text" log format.</td>
</tr>
    
  
<tr><td><code>sanitization</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   [Experimental] When enabled prevents logging of fields tagged as sensitive (passwords, keys, tokens).
Runtime log sanitization may introduce significant computation overhead and therefore should not be enabled in production.`)</td>
</tr>
    
  
<tr><td><code>options</code> <B>[Required]</B><br/>
<a href="#FormatOptions"><code>FormatOptions</code></a>
</td>
<td>
   [Experimental] Options holds additional parameters that are specific
to the different logging formats. Only the options for the selected
format get used, but all of them get validated.</td>
</tr>
    
  
</tbody>
</table>

## `VModuleConfiguration`     {#VModuleConfiguration}
    
(Alias of `[]k8s.io/component-base/config/v1alpha1.VModuleItem`)


**Appears in:**

- [LoggingConfiguration](#LoggingConfiguration)


VModuleConfiguration is a collection of individual file names or patterns
and the corresponding verbosity threshold.


