---
title: Kubernetes Custom Metrics (v1beta2)
content_type: tool-reference
package: custom.metrics.k8s.io/v1beta2
auto_generated: true
---
<p>Package v1beta2 is the v1beta2 version of the custom_metrics API.</p>


## Resource Types 


- [MetricListOptions](#custom-metrics-k8s-io-v1beta2-MetricListOptions)
- [MetricValue](#custom-metrics-k8s-io-v1beta2-MetricValue)
- [MetricValueList](#custom-metrics-k8s-io-v1beta2-MetricValueList)
  
    

## `MetricListOptions`     {#custom-metrics-k8s-io-v1beta2-MetricListOptions}
    


<p>MetricListOptions is used to select metrics by their label selectors</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>custom.metrics.k8s.io/v1beta2</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>MetricListOptions</code></td></tr>
    
  
<tr><td><code>labelSelector</code><br/>
<code>string</code>
</td>
<td>
   <p>A selector to restrict the list of returned objects by their labels.
Defaults to everything.</p>
</td>
</tr>
<tr><td><code>metricLabelSelector</code><br/>
<code>string</code>
</td>
<td>
   <p>A selector to restrict the list of returned metrics by their labels</p>
</td>
</tr>
</tbody>
</table>

## `MetricValue`     {#custom-metrics-k8s-io-v1beta2-MetricValue}
    

**Appears in:**

- [MetricValueList](#custom-metrics-k8s-io-v1beta2-MetricValueList)


<p>MetricValue is the metric value for some object</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>custom.metrics.k8s.io/v1beta2</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>MetricValue</code></td></tr>
    
  
<tr><td><code>describedObject</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#objectreference-v1-core"><code>core/v1.ObjectReference</code></a>
</td>
<td>
   <p>a reference to the described object</p>
</td>
</tr>
<tr><td><code>metric</code> <B>[Required]</B><br/>
<a href="#custom-metrics-k8s-io-v1beta2-MetricIdentifier"><code>MetricIdentifier</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>timestamp</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>indicates the time at which the metrics were produced</p>
</td>
</tr>
<tr><td><code>windowSeconds</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   <p>indicates the window ([Timestamp-Window, Timestamp]) from
which these metrics were calculated, when returning rate
metrics calculated from cumulative metrics (or zero for
non-calculated instantaneous metrics).</p>
</td>
</tr>
<tr><td><code>value</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity"><code>k8s.io/apimachinery/pkg/api/resource.Quantity</code></a>
</td>
<td>
   <p>the value of the metric for this</p>
</td>
</tr>
</tbody>
</table>

## `MetricValueList`     {#custom-metrics-k8s-io-v1beta2-MetricValueList}
    


<p>MetricValueList is a list of values for a given metric for some set of objects</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>custom.metrics.k8s.io/v1beta2</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>MetricValueList</code></td></tr>
    
  
<tr><td><code>metadata</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>items</code> <B>[Required]</B><br/>
<a href="#custom-metrics-k8s-io-v1beta2-MetricValue"><code>[]MetricValue</code></a>
</td>
<td>
   <p>the value of the metric across the described objects</p>
</td>
</tr>
</tbody>
</table>

## `MetricIdentifier`     {#custom-metrics-k8s-io-v1beta2-MetricIdentifier}
    

**Appears in:**

- [MetricValue](#custom-metrics-k8s-io-v1beta2-MetricValue)


<p>MetricIdentifier identifies a metric by name and, optionally, selector</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>name is the name of the given metric</p>
</td>
</tr>
<tr><td><code>selector</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#labelselector-v1-meta"><code>meta/v1.LabelSelector</code></a>
</td>
<td>
   <p>selector represents the label selector that could be used to select
this metric, and will generally just be the selector passed in to
the query used to fetch this metric.
When left blank, only the metric's Name will be used to gather metrics.</p>
</td>
</tr>
</tbody>
</table>
  