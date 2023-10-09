---
title: Event Rate Limit Configuration (v1alpha1)
content_type: tool-reference
package: eventratelimit.admission.k8s.io/v1alpha1
auto_generated: true
---


## Resource Types 


- [Configuration](#eventratelimit-admission-k8s-io-v1alpha1-Configuration)
  

## `Configuration`     {#eventratelimit-admission-k8s-io-v1alpha1-Configuration}
    


<p>Configuration provides configuration for the EventRateLimit admission
controller.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>eventratelimit.admission.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Configuration</code></td></tr>
    
  
<tr><td><code>limits</code> <B>[Required]</B><br/>
<a href="#eventratelimit-admission-k8s-io-v1alpha1-Limit"><code>[]Limit</code></a>
</td>
<td>
   <p>limits are the limits to place on event queries received.
Limits can be placed on events received server-wide, per namespace,
per user, and per source+object.
At least one limit is required.</p>
</td>
</tr>
</tbody>
</table>

## `Limit`     {#eventratelimit-admission-k8s-io-v1alpha1-Limit}
    

**Appears in:**

- [Configuration](#eventratelimit-admission-k8s-io-v1alpha1-Configuration)


<p>Limit is the configuration for a particular limit type</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>type</code> <B>[Required]</B><br/>
<a href="#eventratelimit-admission-k8s-io-v1alpha1-LimitType"><code>LimitType</code></a>
</td>
<td>
   <p>type is the type of limit to which this configuration applies</p>
</td>
</tr>
<tr><td><code>qps</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>qps is the number of event queries per second that are allowed for this
type of limit. The qps and burst fields are used together to determine if
a particular event query is accepted. The qps determines how many queries
are accepted once the burst amount of queries has been exhausted.</p>
</td>
</tr>
<tr><td><code>burst</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>burst is the burst number of event queries that are allowed for this type
of limit. The qps and burst fields are used together to determine if a
particular event query is accepted. The burst determines the maximum size
of the allowance granted for a particular bucket. For example, if the burst
is 10 and the qps is 3, then the admission control will accept 10 queries
before blocking any queries. Every second, 3 more queries will be allowed.
If some of that allowance is not used, then it will roll over to the next
second, until the maximum allowance of 10 is reached.</p>
</td>
</tr>
<tr><td><code>cacheSize</code><br/>
<code>int32</code>
</td>
<td>
   <p>cacheSize is the size of the LRU cache for this type of limit. If a bucket
is evicted from the cache, then the allowance for that bucket is reset. If
more queries are later received for an evicted bucket, then that bucket
will re-enter the cache with a clean slate, giving that bucket a full
allowance of burst queries.</p>
<p>The default cache size is 4096.</p>
<p>If limitType is 'server', then cacheSize is ignored.</p>
</td>
</tr>
</tbody>
</table>

## `LimitType`     {#eventratelimit-admission-k8s-io-v1alpha1-LimitType}
    
(Alias of `string`)

**Appears in:**

- [Limit](#eventratelimit-admission-k8s-io-v1alpha1-Limit)


<p>LimitType is the type of the limit (e.g., per-namespace)</p>



  