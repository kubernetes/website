---
title: Kubernetes External Metrics (v1beta1)
content_type: tool-reference
package: external.metrics.k8s.io/v1beta1
auto_generated: true
---
<p>Package v1beta1 is the v1beta1 version of the external metrics API.</p>


## Resource Types 


- [ExternalMetricValue](#external-metrics-k8s-io-v1beta1-ExternalMetricValue)
- [ExternalMetricValueList](#external-metrics-k8s-io-v1beta1-ExternalMetricValueList)
  
    

## `ExternalMetricValue`     {#external-metrics-k8s-io-v1beta1-ExternalMetricValue}
    

**Appears in:**

- [ExternalMetricValueList](#external-metrics-k8s-io-v1beta1-ExternalMetricValueList)


<p>ExternalMetricValue is a metric value for external metric
A single metric value is identified by metric name and a set of string labels.
For one metric there can be multiple values with different sets of labels.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>external.metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExternalMetricValue</code></td></tr>
    
  
<tr><td><code>metricName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>the name of the metric</p>
</td>
</tr>
<tr><td><code>metricLabels</code> <B>[Required]</B><br/>
<code>map[string]string</code>
</td>
<td>
   <p>a set of labels that identify a single time series for the metric</p>
</td>
</tr>
<tr><td><code>timestamp</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>indicates the time at which the metrics were produced</p>
</td>
</tr>
<tr><td><code>window</code> <B>[Required]</B><br/>
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
   <p>the value of the metric</p>
</td>
</tr>
</tbody>
</table>

## `ExternalMetricValueList`     {#external-metrics-k8s-io-v1beta1-ExternalMetricValueList}
    


<p>ExternalMetricValueList is a list of values for a given metric for some set labels</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>external.metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExternalMetricValueList</code></td></tr>
    
  
<tr><td><code>metadata</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>items</code> <B>[Required]</B><br/>
<a href="#external-metrics-k8s-io-v1beta1-ExternalMetricValue"><code>[]ExternalMetricValue</code></a>
</td>
<td>
   <p>value of the metric matching a given set of labels</p>
</td>
</tr>
</tbody>
</table>
  