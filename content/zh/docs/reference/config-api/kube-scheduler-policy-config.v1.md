---
title: kube-scheduler Policy Configuration (v1)
content_type: tool-reference
package: kubescheduler.config.k8s.io/v1
auto_generated: true
---


## Resource Types 


- [Policy](#kubescheduler-config-k8s-io-v1-Policy)
  
    


## `Policy`     {#kubescheduler-config-k8s-io-v1-Policy}
    




Policy describes a struct for a policy resource used in api.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Policy</code></td></tr>
    

  
  
<tr><td><code>predicates</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PredicatePolicy"><code>[]PredicatePolicy</code></a>
</td>
<td>
   Holds the information to configure the fit predicate functions</td>
</tr>
    
  
<tr><td><code>priorities</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PriorityPolicy"><code>[]PriorityPolicy</code></a>
</td>
<td>
   Holds the information to configure the priority functions</td>
</tr>
    
  
<tr><td><code>extenders</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-LegacyExtender"><code>[]LegacyExtender</code></a>
</td>
<td>
   Holds the information to communicate with the extender(s)</td>
</tr>
    
  
<tr><td><code>hardPodAffinitySymmetricWeight</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   RequiredDuringScheduling affinity is not symmetric, but there is an implicit PreferredDuringScheduling affinity rule
corresponding to every RequiredDuringScheduling affinity rule.
HardPodAffinitySymmetricWeight represents the weight of implicit PreferredDuringScheduling affinity rule, in the range 1-100.</td>
</tr>
    
  
<tr><td><code>alwaysCheckAllPredicates</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   When AlwaysCheckAllPredicates is set to true, scheduler checks all
the configured predicates even after one or more of them fails.
When the flag is set to false, scheduler skips checking the rest
of the predicates after it finds one predicate that failed.</td>
</tr>
    
  
</tbody>
</table>
    


## `ExtenderManagedResource`     {#kubescheduler-config-k8s-io-v1-ExtenderManagedResource}
    



**Appears in:**

- [Extender](#kubescheduler-config-k8s-io-v1beta1-Extender)

- [LegacyExtender](#kubescheduler-config-k8s-io-v1-LegacyExtender)


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
    


## `ExtenderTLSConfig`     {#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig}
    



**Appears in:**

- [Extender](#kubescheduler-config-k8s-io-v1beta1-Extender)

- [LegacyExtender](#kubescheduler-config-k8s-io-v1-LegacyExtender)


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
    


## `LabelPreference`     {#kubescheduler-config-k8s-io-v1-LabelPreference}
    



**Appears in:**

- [PriorityArgument](#kubescheduler-config-k8s-io-v1-PriorityArgument)


LabelPreference holds the parameters that are used to configure the corresponding priority function

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>label</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Used to identify node "groups"</td>
</tr>
    
  
<tr><td><code>presence</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   This is a boolean flag
If true, higher priority is given to nodes that have the label
If false, higher priority is given to nodes that do not have the label</td>
</tr>
    
  
</tbody>
</table>
    


## `LabelsPresence`     {#kubescheduler-config-k8s-io-v1-LabelsPresence}
    



**Appears in:**

- [PredicateArgument](#kubescheduler-config-k8s-io-v1-PredicateArgument)


LabelsPresence holds the parameters that are used to configure the corresponding predicate in scheduler policy configuration.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>labels</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   The list of labels that identify node "groups"
All of the labels should be either present (or absent) for the node to be considered a fit for hosting the pod</td>
</tr>
    
  
<tr><td><code>presence</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   The boolean flag that indicates whether the labels should be present or absent from the node</td>
</tr>
    
  
</tbody>
</table>
    


## `LegacyExtender`     {#kubescheduler-config-k8s-io-v1-LegacyExtender}
    



**Appears in:**

- [Policy](#kubescheduler-config-k8s-io-v1-Policy)


LegacyExtender holds the parameters used to communicate with the extender. If a verb is unspecified/empty,
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
    
  
<tr><td><code>enableHttps</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   EnableHTTPS specifies whether https should be used to communicate with the extender</td>
</tr>
    
  
<tr><td><code>tlsConfig</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig"><code>ExtenderTLSConfig</code></a>
</td>
<td>
   TLSConfig specifies the transport layer security config</td>
</tr>
    
  
<tr><td><code>httpTimeout</code> <B>[Required]</B><br/>
<a href="https://godoc.org/time#Duration"><code>time.Duration</code></a>
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
<a href="#kubescheduler-config-k8s-io-v1-ExtenderManagedResource"><code>[]ExtenderManagedResource</code></a>
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
    


## `PredicateArgument`     {#kubescheduler-config-k8s-io-v1-PredicateArgument}
    



**Appears in:**

- [PredicatePolicy](#kubescheduler-config-k8s-io-v1-PredicatePolicy)


PredicateArgument represents the arguments to configure predicate functions in scheduler policy configuration.
Only one of its members may be specified

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>serviceAffinity</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ServiceAffinity"><code>ServiceAffinity</code></a>
</td>
<td>
   The predicate that provides affinity for pods belonging to a service
It uses a label to identify nodes that belong to the same "group"</td>
</tr>
    
  
<tr><td><code>labelsPresence</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-LabelsPresence"><code>LabelsPresence</code></a>
</td>
<td>
   The predicate that checks whether a particular node has a certain label
defined or not, regardless of value</td>
</tr>
    
  
</tbody>
</table>
    


## `PredicatePolicy`     {#kubescheduler-config-k8s-io-v1-PredicatePolicy}
    



**Appears in:**

- [Policy](#kubescheduler-config-k8s-io-v1-Policy)


PredicatePolicy describes a struct of a predicate policy.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Identifier of the predicate policy
For a custom predicate, the name can be user-defined
For the Kubernetes provided predicates, the name is the identifier of the pre-defined predicate</td>
</tr>
    
  
<tr><td><code>argument</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PredicateArgument"><code>PredicateArgument</code></a>
</td>
<td>
   Holds the parameters to configure the given predicate</td>
</tr>
    
  
</tbody>
</table>
    


## `PriorityArgument`     {#kubescheduler-config-k8s-io-v1-PriorityArgument}
    



**Appears in:**

- [PriorityPolicy](#kubescheduler-config-k8s-io-v1-PriorityPolicy)


PriorityArgument represents the arguments to configure priority functions in scheduler policy configuration.
Only one of its members may be specified

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>serviceAntiAffinity</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ServiceAntiAffinity"><code>ServiceAntiAffinity</code></a>
</td>
<td>
   The priority function that ensures a good spread (anti-affinity) for pods belonging to a service
It uses a label to identify nodes that belong to the same "group"</td>
</tr>
    
  
<tr><td><code>labelPreference</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-LabelPreference"><code>LabelPreference</code></a>
</td>
<td>
   The priority function that checks whether a particular node has a certain label
defined or not, regardless of value</td>
</tr>
    
  
<tr><td><code>requestedToCapacityRatioArguments</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioArguments"><code>RequestedToCapacityRatioArguments</code></a>
</td>
<td>
   The RequestedToCapacityRatio priority function is parametrized with function shape.</td>
</tr>
    
  
</tbody>
</table>
    


## `PriorityPolicy`     {#kubescheduler-config-k8s-io-v1-PriorityPolicy}
    



**Appears in:**

- [Policy](#kubescheduler-config-k8s-io-v1-Policy)


PriorityPolicy describes a struct of a priority policy.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Identifier of the priority policy
For a custom priority, the name can be user-defined
For the Kubernetes provided priority functions, the name is the identifier of the pre-defined priority function</td>
</tr>
    
  
<tr><td><code>weight</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   The numeric multiplier for the node scores that the priority function generates
The weight should be non-zero and can be a positive or a negative integer</td>
</tr>
    
  
<tr><td><code>argument</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-PriorityArgument"><code>PriorityArgument</code></a>
</td>
<td>
   Holds the parameters to configure the given priority function</td>
</tr>
    
  
</tbody>
</table>
    


## `RequestedToCapacityRatioArguments`     {#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioArguments}
    



**Appears in:**

- [PriorityArgument](#kubescheduler-config-k8s-io-v1-PriorityArgument)


RequestedToCapacityRatioArguments holds arguments specific to RequestedToCapacityRatio priority function.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>shape</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   Array of point defining priority function shape.</td>
</tr>
    
  
<tr><td><code>resources</code> <B>[Required]</B><br/>
<a href="#kubescheduler-config-k8s-io-v1-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span>
   </td>
</tr>
    
  
</tbody>
</table>
    


## `ResourceSpec`     {#kubescheduler-config-k8s-io-v1-ResourceSpec}
    



**Appears in:**

- [RequestedToCapacityRatioArguments](#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioArguments)


ResourceSpec represents single resource and weight for bin packing of priority RequestedToCapacityRatioArguments.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Name of the resource to be managed by RequestedToCapacityRatio function.</td>
</tr>
    
  
<tr><td><code>weight</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   Weight of the resource.</td>
</tr>
    
  
</tbody>
</table>
    


## `ServiceAffinity`     {#kubescheduler-config-k8s-io-v1-ServiceAffinity}
    



**Appears in:**

- [PredicateArgument](#kubescheduler-config-k8s-io-v1-PredicateArgument)


ServiceAffinity holds the parameters that are used to configure the corresponding predicate in scheduler policy configuration.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>labels</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   The list of labels that identify node "groups"
All of the labels should match for the node to be considered a fit for hosting the pod</td>
</tr>
    
  
</tbody>
</table>
    


## `ServiceAntiAffinity`     {#kubescheduler-config-k8s-io-v1-ServiceAntiAffinity}
    



**Appears in:**

- [PriorityArgument](#kubescheduler-config-k8s-io-v1-PriorityArgument)


ServiceAntiAffinity holds the parameters that are used to configure the corresponding priority function

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>label</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Used to identify node "groups"</td>
</tr>
    
  
</tbody>
</table>
    


## `UtilizationShapePoint`     {#kubescheduler-config-k8s-io-v1-UtilizationShapePoint}
    



**Appears in:**

- [RequestedToCapacityRatioArguments](#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioArguments)


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
    
  
