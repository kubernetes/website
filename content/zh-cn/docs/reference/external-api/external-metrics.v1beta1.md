---
title: Kubernetes 外部指标 (v1beta1)
content_type: tool-reference
package: external.metrics.k8s.io/v1beta1
---
<!--
title: Kubernetes External Metrics (v1beta1)
content_type: tool-reference
package: external.metrics.k8s.io/v1beta1
auto_generated: true
-->

<p>
<!--
Package v1beta1 is the v1beta1 version of the external metrics API.
-->
v1beta1 包是 v1beta1 版本的外部指标 API。
</p>

<!--
## Resource Types
-->
## 资源类型   {#resource-types}

- [ExternalMetricValue](#external-metrics-k8s-io-v1beta1-ExternalMetricValue)
- [ExternalMetricValueList](#external-metrics-k8s-io-v1beta1-ExternalMetricValueList)

## `ExternalMetricValue`     {#external-metrics-k8s-io-v1beta1-ExternalMetricValue}

<!--
**Appears in:**
-->
**出现在：**

- [ExternalMetricValueList](#external-metrics-k8s-io-v1beta1-ExternalMetricValueList)

<p>
<!--
ExternalMetricValue is a metric value for external metric
A single metric value is identified by metric name and a set of string labels.
For one metric there can be multiple values with different sets of labels.
-->
ExternalMetricValue 是外部指标的一个度量值。
单个度量值由指标名称和一组字符串标签标识。
对于一个指标，可以有多个具有不同标签集的值。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>external.metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExternalMetricValue</code></td></tr>
    
  
<tr><td><code>metricName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   the name of the metric
   -->
   指标的名称。
   </p>
</td>
</tr>
<tr><td><code>metricLabels</code> <B><!--[Required]-->[必需]</B><br/>
<code>map[string]string</code>
</td>
<td>
   <p>
   <!--
   a set of labels that identify a single time series for the metric
   -->
   用于标识指标的单个时间序列的标签集。
   </p>
</td>
</tr>
<tr><td><code>timestamp</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>
   <!--
   indicates the time at which the metrics were produced
   -->
   标明这些度量值生成的时间。
   </p>
</td>
</tr>
<tr><td><code>window</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <p>
   <!--
   indicates the window ([Timestamp-Window, Timestamp]) from
which these metrics were calculated, when returning rate
metrics calculated from cumulative metrics (or zero for
non-calculated instantaneous metrics).
   -->
   当返回根据累积度量计算的速率度量值时，此字段标明计算这些度量值的时间窗口
   （[Timestamp-Window, Timestamp]）（或对于非计算的瞬时度量值为零）。
   </p>
</td>
</tr>
<tr><td><code>value</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity"><code>k8s.io/apimachinery/pkg/api/resource.Quantity</code></a>
</td>
<td>
   <p>
   <!--
   the value of the metric
   -->
   度量值。
   </p>
</td>
</tr>
</tbody>
</table>

## `ExternalMetricValueList`     {#external-metrics-k8s-io-v1beta1-ExternalMetricValueList}

<p>
<!--
ExternalMetricValueList is a list of values for a given metric for some set labels
-->
ExternalMetricValueList 是某个给定指标的某些标签集的数值列表。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>external.metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExternalMetricValueList</code></td></tr>
    
  
<tr><td><code>metadata</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted">
   <!--
   No description provided.
   -->
   无描述。
   </span></td>
</tr>
<tr><td><code>items</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#external-metrics-k8s-io-v1beta1-ExternalMetricValue"><code>[]ExternalMetricValue</code></a>
</td>
<td>
   <p>
   <!--
   value of the metric matching a given set of labels
   -->
   与给定标签集匹配的度量值。
   </p>
</td>
</tr>
</tbody>
</table>
