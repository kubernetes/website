---
title: Kube Scheduler API Reference
description: Reference documentation for Kube Scheduler
weight: 30
---

<p>Packages:</p>
<ul>
<li>
<a href="#kubescheduler.config.k8s.io%2fv1">kubescheduler.config.k8s.io/v1</a>
</li>
<li>
<a href="#kubescheduler.config.k8s.io%2fv1alpha1">kubescheduler.config.k8s.io/v1alpha1</a>
</li>
<li>
<a href="#kubescheduler.config.k8s.io%2fv1alpha2">kubescheduler.config.k8s.io/v1alpha2</a>
</li>
</ul>
<h2 id="kubescheduler.config.k8s.io/v1">kubescheduler.config.k8s.io/v1</h2>
Resource Types:
<ul></ul>
<h3 id="kubescheduler.config.k8s.io/v1.Extender">Extender
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerConfiguration">KubeSchedulerConfiguration</a>, 
<a href="#kubescheduler.config.k8s.io/v1.Policy">Policy</a>)
</p>
<p>
<p>Extender holds the parameters used to communicate with the extender. If a verb is unspecified/empty,
it is assumed that the extender chose not to provide that extension.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>urlPrefix</code></br>
<em>
string
</em>
</td>
<td>
<p>URLPrefix at which the extender is available</p>
</td>
</tr>
<tr>
<td>
<code>filterVerb</code></br>
<em>
string
</em>
</td>
<td>
<p>Verb for the filter call, empty if not supported. This verb is appended to the URLPrefix when issuing the filter call to extender.</p>
</td>
</tr>
<tr>
<td>
<code>preemptVerb</code></br>
<em>
string
</em>
</td>
<td>
<p>Verb for the preempt call, empty if not supported. This verb is appended to the URLPrefix when issuing the preempt call to extender.</p>
</td>
</tr>
<tr>
<td>
<code>prioritizeVerb</code></br>
<em>
string
</em>
</td>
<td>
<p>Verb for the prioritize call, empty if not supported. This verb is appended to the URLPrefix when issuing the prioritize call to extender.</p>
</td>
</tr>
<tr>
<td>
<code>weight</code></br>
<em>
int64
</em>
</td>
<td>
<p>The numeric multiplier for the node scores that the prioritize call generates.
The weight should be a positive integer</p>
</td>
</tr>
<tr>
<td>
<code>bindVerb</code></br>
<em>
string
</em>
</td>
<td>
<p>Verb for the bind call, empty if not supported. This verb is appended to the URLPrefix when issuing the bind call to extender.
If this method is implemented by the extender, it is the extender&rsquo;s responsibility to bind the pod to apiserver. Only one extender
can implement this function.</p>
</td>
</tr>
<tr>
<td>
<code>enableHttps</code></br>
<em>
bool
</em>
</td>
<td>
<p>EnableHTTPS specifies whether https should be used to communicate with the extender</p>
</td>
</tr>
<tr>
<td>
<code>tlsConfig</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.ExtenderTLSConfig">
ExtenderTLSConfig
</a>
</em>
</td>
<td>
<p>TLSConfig specifies the transport layer security config</p>
</td>
</tr>
<tr>
<td>
<code>httpTimeout</code></br>
<em>
time.Duration
</em>
</td>
<td>
<p>HTTPTimeout specifies the timeout duration for a call to the extender. Filter timeout fails the scheduling of the pod. Prioritize
timeout is ignored, k8s/other extenders priorities are used to select the node.</p>
</td>
</tr>
<tr>
<td>
<code>nodeCacheCapable</code></br>
<em>
bool
</em>
</td>
<td>
<p>NodeCacheCapable specifies that the extender is capable of caching node information,
so the scheduler should only send minimal information about the eligible nodes
assuming that the extender already cached full details of all nodes in the cluster</p>
</td>
</tr>
<tr>
<td>
<code>managedResources</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.ExtenderManagedResource">
[]ExtenderManagedResource
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>ManagedResources is a list of extended resources that are managed by
this extender.
- A pod will be sent to the extender on the Filter, Prioritize and Bind
(if the extender is the binder) phases iff the pod requests at least
one of the extended resources in this list. If empty or unspecified,
all pods will be sent to this extender.
- If IgnoredByScheduler is set to true for a resource, kube-scheduler
will skip checking the resource in predicates.</p>
</td>
</tr>
<tr>
<td>
<code>ignorable</code></br>
<em>
bool
</em>
</td>
<td>
<p>Ignorable specifies if the extender is ignorable, i.e. scheduling should not
fail when the extender returns an error or is not reachable.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.ExtenderManagedResource">ExtenderManagedResource
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.Extender">Extender</a>)
</p>
<p>
<p>ExtenderManagedResource describes the arguments of extended resources
managed by an extender.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Name is the extended resource name.</p>
</td>
</tr>
<tr>
<td>
<code>ignoredByScheduler</code></br>
<em>
bool
</em>
</td>
<td>
<p>IgnoredByScheduler indicates whether kube-scheduler should ignore this
resource when applying predicates.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.ExtenderTLSConfig">ExtenderTLSConfig
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.Extender">Extender</a>)
</p>
<p>
<p>ExtenderTLSConfig contains settings to enable TLS with extender</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>insecure</code></br>
<em>
bool
</em>
</td>
<td>
<p>Server should be accessed without verifying the TLS certificate. For testing only.</p>
</td>
</tr>
<tr>
<td>
<code>serverName</code></br>
<em>
string
</em>
</td>
<td>
<p>ServerName is passed to the server for SNI and is used in the client to check server
certificates against. If ServerName is empty, the hostname used to contact the
server is used.</p>
</td>
</tr>
<tr>
<td>
<code>certFile</code></br>
<em>
string
</em>
</td>
<td>
<p>Server requires TLS client certificate authentication</p>
</td>
</tr>
<tr>
<td>
<code>keyFile</code></br>
<em>
string
</em>
</td>
<td>
<p>Server requires TLS client certificate authentication</p>
</td>
</tr>
<tr>
<td>
<code>caFile</code></br>
<em>
string
</em>
</td>
<td>
<p>Trusted root certificates for server</p>
</td>
</tr>
<tr>
<td>
<code>certData</code></br>
<em>
[]byte
</em>
</td>
<td>
<p>CertData holds PEM-encoded bytes (typically read from a client certificate file).
CertData takes precedence over CertFile</p>
</td>
</tr>
<tr>
<td>
<code>keyData</code></br>
<em>
[]byte
</em>
</td>
<td>
<p>KeyData holds PEM-encoded bytes (typically read from a client certificate key file).
KeyData takes precedence over KeyFile</p>
</td>
</tr>
<tr>
<td>
<code>caData</code></br>
<em>
[]byte
</em>
</td>
<td>
<p>CAData holds PEM-encoded bytes (typically read from a root certificates bundle).
CAData takes precedence over CAFile</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.LabelPreference">LabelPreference
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.PriorityArgument">PriorityArgument</a>)
</p>
<p>
<p>LabelPreference holds the parameters that are used to configure the corresponding priority function</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>label</code></br>
<em>
string
</em>
</td>
<td>
<p>Used to identify node &ldquo;groups&rdquo;</p>
</td>
</tr>
<tr>
<td>
<code>presence</code></br>
<em>
bool
</em>
</td>
<td>
<p>This is a boolean flag
If true, higher priority is given to nodes that have the label
If false, higher priority is given to nodes that do not have the label</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.LabelsPresence">LabelsPresence
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.PredicateArgument">PredicateArgument</a>)
</p>
<p>
<p>LabelsPresence holds the parameters that are used to configure the corresponding predicate in scheduler policy configuration.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>labels</code></br>
<em>
[]string
</em>
</td>
<td>
<p>The list of labels that identify node &ldquo;groups&rdquo;
All of the labels should be either present (or absent) for the node to be considered a fit for hosting the pod</p>
</td>
</tr>
<tr>
<td>
<code>presence</code></br>
<em>
bool
</em>
</td>
<td>
<p>The boolean flag that indicates whether the labels should be present or absent from the node</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.Policy">Policy
</h3>
<p>
<p>Policy describes a struct for a policy resource used in api.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>predicates</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.PredicatePolicy">
[]PredicatePolicy
</a>
</em>
</td>
<td>
<p>Holds the information to configure the fit predicate functions</p>
</td>
</tr>
<tr>
<td>
<code>priorities</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.PriorityPolicy">
[]PriorityPolicy
</a>
</em>
</td>
<td>
<p>Holds the information to configure the priority functions</p>
</td>
</tr>
<tr>
<td>
<code>extenders</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.Extender">
[]Extender
</a>
</em>
</td>
<td>
<p>Holds the information to communicate with the extender(s)</p>
</td>
</tr>
<tr>
<td>
<code>hardPodAffinitySymmetricWeight</code></br>
<em>
int32
</em>
</td>
<td>
<p>RequiredDuringScheduling affinity is not symmetric, but there is an implicit PreferredDuringScheduling affinity rule
corresponding to every RequiredDuringScheduling affinity rule.
HardPodAffinitySymmetricWeight represents the weight of implicit PreferredDuringScheduling affinity rule, in the range 1-100.</p>
</td>
</tr>
<tr>
<td>
<code>alwaysCheckAllPredicates</code></br>
<em>
bool
</em>
</td>
<td>
<p>When AlwaysCheckAllPredicates is set to true, scheduler checks all
the configured predicates even after one or more of them fails.
When the flag is set to false, scheduler skips checking the rest
of the predicates after it finds one predicate that failed.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.PredicateArgument">PredicateArgument
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.PredicatePolicy">PredicatePolicy</a>)
</p>
<p>
<p>PredicateArgument represents the arguments to configure predicate functions in scheduler policy configuration.
Only one of its members may be specified</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>serviceAffinity</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.ServiceAffinity">
ServiceAffinity
</a>
</em>
</td>
<td>
<p>The predicate that provides affinity for pods belonging to a service
It uses a label to identify nodes that belong to the same &ldquo;group&rdquo;</p>
</td>
</tr>
<tr>
<td>
<code>labelsPresence</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.LabelsPresence">
LabelsPresence
</a>
</em>
</td>
<td>
<p>The predicate that checks whether a particular node has a certain label
defined or not, regardless of value</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.PredicatePolicy">PredicatePolicy
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.Policy">Policy</a>)
</p>
<p>
<p>PredicatePolicy describes a struct of a predicate policy.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Identifier of the predicate policy
For a custom predicate, the name can be user-defined
For the Kubernetes provided predicates, the name is the identifier of the pre-defined predicate</p>
</td>
</tr>
<tr>
<td>
<code>argument</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.PredicateArgument">
PredicateArgument
</a>
</em>
</td>
<td>
<p>Holds the parameters to configure the given predicate</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.PriorityArgument">PriorityArgument
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.PriorityPolicy">PriorityPolicy</a>)
</p>
<p>
<p>PriorityArgument represents the arguments to configure priority functions in scheduler policy configuration.
Only one of its members may be specified</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>serviceAntiAffinity</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.ServiceAntiAffinity">
ServiceAntiAffinity
</a>
</em>
</td>
<td>
<p>The priority function that ensures a good spread (anti-affinity) for pods belonging to a service
It uses a label to identify nodes that belong to the same &ldquo;group&rdquo;</p>
</td>
</tr>
<tr>
<td>
<code>labelPreference</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.LabelPreference">
LabelPreference
</a>
</em>
</td>
<td>
<p>The priority function that checks whether a particular node has a certain label
defined or not, regardless of value</p>
</td>
</tr>
<tr>
<td>
<code>requestedToCapacityRatioArguments</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.RequestedToCapacityRatioArguments">
RequestedToCapacityRatioArguments
</a>
</em>
</td>
<td>
<p>The RequestedToCapacityRatio priority function is parametrized with function shape.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.PriorityPolicy">PriorityPolicy
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.Policy">Policy</a>)
</p>
<p>
<p>PriorityPolicy describes a struct of a priority policy.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Identifier of the priority policy
For a custom priority, the name can be user-defined
For the Kubernetes provided priority functions, the name is the identifier of the pre-defined priority function</p>
</td>
</tr>
<tr>
<td>
<code>weight</code></br>
<em>
int64
</em>
</td>
<td>
<p>The numeric multiplier for the node scores that the priority function generates
The weight should be non-zero and can be a positive or a negative integer</p>
</td>
</tr>
<tr>
<td>
<code>argument</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.PriorityArgument">
PriorityArgument
</a>
</em>
</td>
<td>
<p>Holds the parameters to configure the given priority function</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.RequestedToCapacityRatioArguments">RequestedToCapacityRatioArguments
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.PriorityArgument">PriorityArgument</a>)
</p>
<p>
<p>RequestedToCapacityRatioArguments holds arguments specific to RequestedToCapacityRatio priority function.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>shape</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.UtilizationShapePoint">
[]UtilizationShapePoint
</a>
</em>
</td>
<td>
<p>Array of point defining priority function shape.</p>
</td>
</tr>
<tr>
<td>
<code>resources</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.ResourceSpec">
[]ResourceSpec
</a>
</em>
</td>
<td>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.ResourceSpec">ResourceSpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.RequestedToCapacityRatioArguments">RequestedToCapacityRatioArguments</a>)
</p>
<p>
<p>ResourceSpec represents single resource and weight for bin packing of priority RequestedToCapacityRatioArguments.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Name of the resource to be managed by RequestedToCapacityRatio function.</p>
</td>
</tr>
<tr>
<td>
<code>weight</code></br>
<em>
int64
</em>
</td>
<td>
<p>Weight of the resource.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.ServiceAffinity">ServiceAffinity
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.PredicateArgument">PredicateArgument</a>)
</p>
<p>
<p>ServiceAffinity holds the parameters that are used to configure the corresponding predicate in scheduler policy configuration.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>labels</code></br>
<em>
[]string
</em>
</td>
<td>
<p>The list of labels that identify node &ldquo;groups&rdquo;
All of the labels should match for the node to be considered a fit for hosting the pod</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.ServiceAntiAffinity">ServiceAntiAffinity
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.PriorityArgument">PriorityArgument</a>)
</p>
<p>
<p>ServiceAntiAffinity holds the parameters that are used to configure the corresponding priority function</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>label</code></br>
<em>
string
</em>
</td>
<td>
<p>Used to identify node &ldquo;groups&rdquo;</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1.UtilizationShapePoint">UtilizationShapePoint
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1.RequestedToCapacityRatioArguments">RequestedToCapacityRatioArguments</a>)
</p>
<p>
<p>UtilizationShapePoint represents single point of priority function shape.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>utilization</code></br>
<em>
int32
</em>
</td>
<td>
<p>Utilization (x axis). Valid values are 0 to 100. Fully utilized node maps to 100.</p>
</td>
</tr>
<tr>
<td>
<code>score</code></br>
<em>
int32
</em>
</td>
<td>
<p>Score assigned to given utilization (y axis). Valid values are 0 to 10.</p>
</td>
</tr>
</tbody>
</table>
<hr/>
<h2 id="kubescheduler.config.k8s.io/v1alpha1">kubescheduler.config.k8s.io/v1alpha1</h2>
Resource Types:
<ul></ul>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.KubeSchedulerConfiguration">KubeSchedulerConfiguration
</h3>
<p>
<p>KubeSchedulerConfiguration configures a scheduler</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>schedulerName</code></br>
<em>
string
</em>
</td>
<td>
<p>SchedulerName is name of the scheduler, used to select which pods
will be processed by this scheduler, based on pod&rsquo;s &ldquo;spec.SchedulerName&rdquo;.</p>
</td>
</tr>
<tr>
<td>
<code>algorithmSource</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.SchedulerAlgorithmSource">
SchedulerAlgorithmSource
</a>
</em>
</td>
<td>
<p>AlgorithmSource specifies the scheduler algorithm source.</p>
</td>
</tr>
<tr>
<td>
<code>hardPodAffinitySymmetricWeight</code></br>
<em>
int32
</em>
</td>
<td>
<p>RequiredDuringScheduling affinity is not symmetric, but there is an implicit PreferredDuringScheduling affinity rule
corresponding to every RequiredDuringScheduling affinity rule.
HardPodAffinitySymmetricWeight represents the weight of implicit PreferredDuringScheduling affinity rule, in the range 0-100.</p>
</td>
</tr>
<tr>
<td>
<code>leaderElection</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.KubeSchedulerLeaderElectionConfiguration">
KubeSchedulerLeaderElectionConfiguration
</a>
</em>
</td>
<td>
<p>LeaderElection defines the configuration of leader election client.</p>
</td>
</tr>
<tr>
<td>
<code>clientConnection</code></br>
<em>
k8s.io/component-base/config/v1alpha1.ClientConnectionConfiguration
</em>
</td>
<td>
<p>ClientConnection specifies the kubeconfig file and client connection
settings for the proxy server to use when communicating with the apiserver.</p>
</td>
</tr>
<tr>
<td>
<code>healthzBindAddress</code></br>
<em>
string
</em>
</td>
<td>
<p>HealthzBindAddress is the IP address and port for the health check server to serve on,
defaulting to 0.0.0.0:10251</p>
</td>
</tr>
<tr>
<td>
<code>metricsBindAddress</code></br>
<em>
string
</em>
</td>
<td>
<p>MetricsBindAddress is the IP address and port for the metrics server to
serve on, defaulting to 0.0.0.0:10251.</p>
</td>
</tr>
<tr>
<td>
<code>DebuggingConfiguration</code></br>
<em>
k8s.io/component-base/config/v1alpha1.DebuggingConfiguration
</em>
</td>
<td>
<p>
(Members of <code>DebuggingConfiguration</code> are embedded into this type.)
</p>
<p>DebuggingConfiguration holds configuration for Debugging related features
TODO: We might wanna make this a substruct like Debugging componentbaseconfigv1alpha1.DebuggingConfiguration</p>
</td>
</tr>
<tr>
<td>
<code>disablePreemption</code></br>
<em>
bool
</em>
</td>
<td>
<p>DisablePreemption disables the pod preemption feature.</p>
</td>
</tr>
<tr>
<td>
<code>percentageOfNodesToScore</code></br>
<em>
int32
</em>
</td>
<td>
<p>PercentageOfNodeToScore is the percentage of all nodes that once found feasible
for running a pod, the scheduler stops its search for more feasible nodes in
the cluster. This helps improve scheduler&rsquo;s performance. Scheduler always tries to find
at least &ldquo;minFeasibleNodesToFind&rdquo; feasible nodes no matter what the value of this flag is.
Example: if the cluster size is 500 nodes and the value of this flag is 30,
then scheduler stops finding further feasible nodes once it finds 150 feasible ones.
When the value is 0, default percentage (5%&ndash;50% based on the size of the cluster) of the
nodes will be scored.</p>
</td>
</tr>
<tr>
<td>
<code>bindTimeoutSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<p>Duration to wait for a binding operation to complete before timing out
Value must be non-negative integer. The value zero indicates no waiting.
If this value is nil, the default value will be used.</p>
</td>
</tr>
<tr>
<td>
<code>podInitialBackoffSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<p>PodInitialBackoffSeconds is the initial backoff for unschedulable pods.
If specified, it must be greater than 0. If this value is null, the default value (1s)
will be used.</p>
</td>
</tr>
<tr>
<td>
<code>podMaxBackoffSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<p>PodMaxBackoffSeconds is the max backoff for unschedulable pods.
If specified, it must be greater than podInitialBackoffSeconds. If this value is null,
the default value (10s) will be used.</p>
</td>
</tr>
<tr>
<td>
<code>plugins</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.Plugins">
Plugins
</a>
</em>
</td>
<td>
<p>Plugins specify the set of plugins that should be enabled or disabled. Enabled plugins are the
ones that should be enabled in addition to the default plugins. Disabled plugins are any of the
default plugins that should be disabled.
When no enabled or disabled plugin is specified for an extension point, default plugins for
that extension point will be used if there is any.</p>
</td>
</tr>
<tr>
<td>
<code>pluginConfig</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginConfig">
[]PluginConfig
</a>
</em>
</td>
<td>
<p>PluginConfig is an optional set of custom plugin arguments for each plugin.
Omitting config args for a plugin is equivalent to using the default config for that plugin.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.KubeSchedulerLeaderElectionConfiguration">KubeSchedulerLeaderElectionConfiguration
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.KubeSchedulerConfiguration">KubeSchedulerConfiguration</a>)
</p>
<p>
<p>KubeSchedulerLeaderElectionConfiguration expands LeaderElectionConfiguration
to include scheduler specific configuration.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>LeaderElectionConfiguration</code></br>
<em>
k8s.io/component-base/config/v1alpha1.LeaderElectionConfiguration
</em>
</td>
<td>
<p>
(Members of <code>LeaderElectionConfiguration</code> are embedded into this type.)
</p>
</td>
</tr>
<tr>
<td>
<code>lockObjectNamespace</code></br>
<em>
string
</em>
</td>
<td>
<p>LockObjectNamespace defines the namespace of the lock object
DEPRECATED: will be removed in favor of resourceNamespace</p>
</td>
</tr>
<tr>
<td>
<code>lockObjectName</code></br>
<em>
string
</em>
</td>
<td>
<p>LockObjectName defines the lock object name
DEPRECATED: will be removed in favor of resourceName</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.Plugin">Plugin
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">PluginSet</a>)
</p>
<p>
<p>Plugin specifies a plugin name and its weight when applicable. Weight is used only for Score plugins.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Name defines the name of plugin</p>
</td>
</tr>
<tr>
<td>
<code>weight</code></br>
<em>
int32
</em>
</td>
<td>
<p>Weight defines the weight of plugin, only used for Score plugins.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.PluginConfig">PluginConfig
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.KubeSchedulerConfiguration">KubeSchedulerConfiguration</a>)
</p>
<p>
<p>PluginConfig specifies arguments that should be passed to a plugin at the time of initialization.
A plugin that is invoked at multiple extension points is initialized once. Args can have arbitrary structure.
It is up to the plugin to process these Args.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Name defines the name of plugin being configured</p>
</td>
</tr>
<tr>
<td>
<code>args</code></br>
<em>
k8s.io/apimachinery/pkg/runtime.Unknown
</em>
</td>
<td>
<p>Args defines the arguments passed to the plugins at the time of initialization. Args can have arbitrary structure.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.PluginSet">PluginSet
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.Plugins">Plugins</a>)
</p>
<p>
<p>PluginSet specifies enabled and disabled plugins for an extension point.
If an array is empty, missing, or nil, default plugins at that extension point will be used.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>enabled</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.Plugin">
[]Plugin
</a>
</em>
</td>
<td>
<p>Enabled specifies plugins that should be enabled in addition to default plugins.
These are called after default plugins and in the same order specified here.</p>
</td>
</tr>
<tr>
<td>
<code>disabled</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.Plugin">
[]Plugin
</a>
</em>
</td>
<td>
<p>Disabled specifies default plugins that should be disabled.
When all default plugins need to be disabled, an array containing only one &ldquo;*&rdquo; should be provided.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.Plugins">Plugins
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.KubeSchedulerConfiguration">KubeSchedulerConfiguration</a>)
</p>
<p>
<p>Plugins include multiple extension points. When specified, the list of plugins for
a particular extension point are the only ones enabled. If an extension point is
omitted from the config, then the default set of plugins is used for that extension point.
Enabled plugins are called in the order specified here, after default plugins. If they need to
be invoked before default plugins, default plugins must be disabled and re-enabled here in desired order.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>queueSort</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>QueueSort is a list of plugins that should be invoked when sorting pods in the scheduling queue.</p>
</td>
</tr>
<tr>
<td>
<code>preFilter</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>PreFilter is a list of plugins that should be invoked at &ldquo;PreFilter&rdquo; extension point of the scheduling framework.</p>
</td>
</tr>
<tr>
<td>
<code>filter</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Filter is a list of plugins that should be invoked when filtering out nodes that cannot run the Pod.</p>
</td>
</tr>
<tr>
<td>
<code>postFilter</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>PostFilter is a list of plugins that are invoked after filtering out infeasible nodes.</p>
</td>
</tr>
<tr>
<td>
<code>score</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Score is a list of plugins that should be invoked when ranking nodes that have passed the filtering phase.</p>
</td>
</tr>
<tr>
<td>
<code>reserve</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Reserve is a list of plugins invoked when reserving a node to run the pod.</p>
</td>
</tr>
<tr>
<td>
<code>permit</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Permit is a list of plugins that control binding of a Pod. These plugins can prevent or delay binding of a Pod.</p>
</td>
</tr>
<tr>
<td>
<code>preBind</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>PreBind is a list of plugins that should be invoked before a pod is bound.</p>
</td>
</tr>
<tr>
<td>
<code>bind</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Bind is a list of plugins that should be invoked at &ldquo;Bind&rdquo; extension point of the scheduling framework.
The scheduler call these plugins in order. Scheduler skips the rest of these plugins as soon as one returns success.</p>
</td>
</tr>
<tr>
<td>
<code>postBind</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>PostBind is a list of plugins that should be invoked after a pod is successfully bound.</p>
</td>
</tr>
<tr>
<td>
<code>unreserve</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Unreserve is a list of plugins invoked when a pod that was previously reserved is rejected in a later phase.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.SchedulerAlgorithmSource">SchedulerAlgorithmSource
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.KubeSchedulerConfiguration">KubeSchedulerConfiguration</a>)
</p>
<p>
<p>SchedulerAlgorithmSource is the source of a scheduler algorithm. One source
field must be specified, and source fields are mutually exclusive.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>policy</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.SchedulerPolicySource">
SchedulerPolicySource
</a>
</em>
</td>
<td>
<p>Policy is a policy based algorithm source.</p>
</td>
</tr>
<tr>
<td>
<code>provider</code></br>
<em>
string
</em>
</td>
<td>
<p>Provider is the name of a scheduling algorithm provider to use.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.SchedulerPolicyConfigMapSource">SchedulerPolicyConfigMapSource
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.SchedulerPolicySource">SchedulerPolicySource</a>)
</p>
<p>
<p>SchedulerPolicyConfigMapSource is a policy serialized into a config map value
under the SchedulerPolicyConfigMapKey key.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>namespace</code></br>
<em>
string
</em>
</td>
<td>
<p>Namespace is the namespace of the policy config map.</p>
</td>
</tr>
<tr>
<td>
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Name is the name of hte policy config map.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.SchedulerPolicyFileSource">SchedulerPolicyFileSource
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.SchedulerPolicySource">SchedulerPolicySource</a>)
</p>
<p>
<p>SchedulerPolicyFileSource is a policy serialized to disk and accessed via
path.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>path</code></br>
<em>
string
</em>
</td>
<td>
<p>Path is the location of a serialized policy.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha1.SchedulerPolicySource">SchedulerPolicySource
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.SchedulerAlgorithmSource">SchedulerAlgorithmSource</a>)
</p>
<p>
<p>SchedulerPolicySource configures a means to obtain a scheduler Policy. One
source field must be specified, and source fields are mutually exclusive.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>file</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.SchedulerPolicyFileSource">
SchedulerPolicyFileSource
</a>
</em>
</td>
<td>
<p>File is a file policy source.</p>
</td>
</tr>
<tr>
<td>
<code>configMap</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha1.SchedulerPolicyConfigMapSource">
SchedulerPolicyConfigMapSource
</a>
</em>
</td>
<td>
<p>ConfigMap is a config map policy source.</p>
</td>
</tr>
</tbody>
</table>
<hr/>
<h2 id="kubescheduler.config.k8s.io/v1alpha2">kubescheduler.config.k8s.io/v1alpha2</h2>
Resource Types:
<ul></ul>
<h3 id="kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerConfiguration">KubeSchedulerConfiguration
</h3>
<p>
<p>KubeSchedulerConfiguration configures a scheduler</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>leaderElection</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerLeaderElectionConfiguration">
KubeSchedulerLeaderElectionConfiguration
</a>
</em>
</td>
<td>
<p>LeaderElection defines the configuration of leader election client.</p>
</td>
</tr>
<tr>
<td>
<code>clientConnection</code></br>
<em>
k8s.io/component-base/config/v1alpha1.ClientConnectionConfiguration
</em>
</td>
<td>
<p>ClientConnection specifies the kubeconfig file and client connection
settings for the proxy server to use when communicating with the apiserver.</p>
</td>
</tr>
<tr>
<td>
<code>healthzBindAddress</code></br>
<em>
string
</em>
</td>
<td>
<p>HealthzBindAddress is the IP address and port for the health check server to serve on,
defaulting to 0.0.0.0:10251</p>
</td>
</tr>
<tr>
<td>
<code>metricsBindAddress</code></br>
<em>
string
</em>
</td>
<td>
<p>MetricsBindAddress is the IP address and port for the metrics server to
serve on, defaulting to 0.0.0.0:10251.</p>
</td>
</tr>
<tr>
<td>
<code>DebuggingConfiguration</code></br>
<em>
k8s.io/component-base/config/v1alpha1.DebuggingConfiguration
</em>
</td>
<td>
<p>
(Members of <code>DebuggingConfiguration</code> are embedded into this type.)
</p>
<p>DebuggingConfiguration holds configuration for Debugging related features
TODO: We might wanna make this a substruct like Debugging componentbaseconfigv1alpha1.DebuggingConfiguration</p>
</td>
</tr>
<tr>
<td>
<code>disablePreemption</code></br>
<em>
bool
</em>
</td>
<td>
<p>DisablePreemption disables the pod preemption feature.</p>
</td>
</tr>
<tr>
<td>
<code>percentageOfNodesToScore</code></br>
<em>
int32
</em>
</td>
<td>
<p>PercentageOfNodeToScore is the percentage of all nodes that once found feasible
for running a pod, the scheduler stops its search for more feasible nodes in
the cluster. This helps improve scheduler&rsquo;s performance. Scheduler always tries to find
at least &ldquo;minFeasibleNodesToFind&rdquo; feasible nodes no matter what the value of this flag is.
Example: if the cluster size is 500 nodes and the value of this flag is 30,
then scheduler stops finding further feasible nodes once it finds 150 feasible ones.
When the value is 0, default percentage (5%&ndash;50% based on the size of the cluster) of the
nodes will be scored.</p>
</td>
</tr>
<tr>
<td>
<code>bindTimeoutSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<p>Duration to wait for a binding operation to complete before timing out
Value must be non-negative integer. The value zero indicates no waiting.
If this value is nil, the default value will be used.</p>
</td>
</tr>
<tr>
<td>
<code>podInitialBackoffSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<p>PodInitialBackoffSeconds is the initial backoff for unschedulable pods.
If specified, it must be greater than 0. If this value is null, the default value (1s)
will be used.</p>
</td>
</tr>
<tr>
<td>
<code>podMaxBackoffSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<p>PodMaxBackoffSeconds is the max backoff for unschedulable pods.
If specified, it must be greater than podInitialBackoffSeconds. If this value is null,
the default value (10s) will be used.</p>
</td>
</tr>
<tr>
<td>
<code>profiles</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerProfile">
[]KubeSchedulerProfile
</a>
</em>
</td>
<td>
<p>Profiles are scheduling profiles that kube-scheduler supports. Pods can
choose to be scheduled under a particular profile by setting its associated
scheduler name. Pods that don&rsquo;t specify any scheduler name are scheduled
with the &ldquo;default-scheduler&rdquo; profile, if present here.</p>
</td>
</tr>
<tr>
<td>
<code>extenders</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1.Extender">
[]Extender
</a>
</em>
</td>
<td>
<p>Extenders are the list of scheduler extenders, each holding the values of how to communicate
with the extender. These extenders are shared by all scheduler profiles.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerLeaderElectionConfiguration">KubeSchedulerLeaderElectionConfiguration
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerConfiguration">KubeSchedulerConfiguration</a>)
</p>
<p>
<p>KubeSchedulerLeaderElectionConfiguration expands LeaderElectionConfiguration
to include scheduler specific configuration.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>LeaderElectionConfiguration</code></br>
<em>
k8s.io/component-base/config/v1alpha1.LeaderElectionConfiguration
</em>
</td>
<td>
<p>
(Members of <code>LeaderElectionConfiguration</code> are embedded into this type.)
</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerProfile">KubeSchedulerProfile
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerConfiguration">KubeSchedulerConfiguration</a>)
</p>
<p>
<p>KubeSchedulerProfile is a scheduling profile.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>schedulerName</code></br>
<em>
string
</em>
</td>
<td>
<p>SchedulerName is the name of the scheduler associated to this profile.
If SchedulerName matches with the pod&rsquo;s &ldquo;spec.schedulerName&rdquo;, then the pod
is scheduled with this profile.</p>
</td>
</tr>
<tr>
<td>
<code>plugins</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.Plugins">
Plugins
</a>
</em>
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
<tr>
<td>
<code>pluginConfig</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginConfig">
[]PluginConfig
</a>
</em>
</td>
<td>
<p>PluginConfig is an optional set of custom plugin arguments for each plugin.
Omitting config args for a plugin is equivalent to using the default config
for that plugin.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha2.Plugin">Plugin
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">PluginSet</a>)
</p>
<p>
<p>Plugin specifies a plugin name and its weight when applicable. Weight is used only for Score plugins.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Name defines the name of plugin</p>
</td>
</tr>
<tr>
<td>
<code>weight</code></br>
<em>
int32
</em>
</td>
<td>
<p>Weight defines the weight of plugin, only used for Score plugins.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha2.PluginConfig">PluginConfig
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerProfile">KubeSchedulerProfile</a>)
</p>
<p>
<p>PluginConfig specifies arguments that should be passed to a plugin at the time of initialization.
A plugin that is invoked at multiple extension points is initialized once. Args can have arbitrary structure.
It is up to the plugin to process these Args.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Name defines the name of plugin being configured</p>
</td>
</tr>
<tr>
<td>
<code>args</code></br>
<em>
k8s.io/apimachinery/pkg/runtime.Unknown
</em>
</td>
<td>
<p>Args defines the arguments passed to the plugins at the time of initialization. Args can have arbitrary structure.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha2.PluginSet">PluginSet
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.Plugins">Plugins</a>)
</p>
<p>
<p>PluginSet specifies enabled and disabled plugins for an extension point.
If an array is empty, missing, or nil, default plugins at that extension point will be used.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>enabled</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.Plugin">
[]Plugin
</a>
</em>
</td>
<td>
<p>Enabled specifies plugins that should be enabled in addition to default plugins.
These are called after default plugins and in the same order specified here.</p>
</td>
</tr>
<tr>
<td>
<code>disabled</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.Plugin">
[]Plugin
</a>
</em>
</td>
<td>
<p>Disabled specifies default plugins that should be disabled.
When all default plugins need to be disabled, an array containing only one &ldquo;*&rdquo; should be provided.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubescheduler.config.k8s.io/v1alpha2.Plugins">Plugins
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.KubeSchedulerProfile">KubeSchedulerProfile</a>)
</p>
<p>
<p>Plugins include multiple extension points. When specified, the list of plugins for
a particular extension point are the only ones enabled. If an extension point is
omitted from the config, then the default set of plugins is used for that extension point.
Enabled plugins are called in the order specified here, after default plugins. If they need to
be invoked before default plugins, default plugins must be disabled and re-enabled here in desired order.</p>
</p>


<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>queueSort</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>QueueSort is a list of plugins that should be invoked when sorting pods in the scheduling queue.</p>
</td>
</tr>
<tr>
<td>
<code>preFilter</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>PreFilter is a list of plugins that should be invoked at &ldquo;PreFilter&rdquo; extension point of the scheduling framework.</p>
</td>
</tr>
<tr>
<td>
<code>filter</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Filter is a list of plugins that should be invoked when filtering out nodes that cannot run the Pod.</p>
</td>
</tr>
<tr>
<td>
<code>preScore</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>PreScore is a list of plugins that are invoked before scoring.</p>
</td>
</tr>
<tr>
<td>
<code>score</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Score is a list of plugins that should be invoked when ranking nodes that have passed the filtering phase.</p>
</td>
</tr>
<tr>
<td>
<code>reserve</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Reserve is a list of plugins invoked when reserving a node to run the pod.</p>
</td>
</tr>
<tr>
<td>
<code>permit</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Permit is a list of plugins that control binding of a Pod. These plugins can prevent or delay binding of a Pod.</p>
</td>
</tr>
<tr>
<td>
<code>preBind</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>PreBind is a list of plugins that should be invoked before a pod is bound.</p>
</td>
</tr>
<tr>
<td>
<code>bind</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Bind is a list of plugins that should be invoked at &ldquo;Bind&rdquo; extension point of the scheduling framework.
The scheduler call these plugins in order. Scheduler skips the rest of these plugins as soon as one returns success.</p>
</td>
</tr>
<tr>
<td>
<code>postBind</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>PostBind is a list of plugins that should be invoked after a pod is successfully bound.</p>
</td>
</tr>
<tr>
<td>
<code>unreserve</code></br>
<em>
<a href="#kubescheduler.config.k8s.io/v1alpha2.PluginSet">
PluginSet
</a>
</em>
</td>
<td>
<p>Unreserve is a list of plugins invoked when a pod that was previously reserved is rejected in a later phase.</p>
</td>
</tr>
</tbody>
</table>
<hr/>
<p><em>
Generated with <code>gen-crd-api-reference-docs</code>
on git commit <code>9e991415</code>.
</em></p>
