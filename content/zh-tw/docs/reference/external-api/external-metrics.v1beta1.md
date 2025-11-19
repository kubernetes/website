---
title: Kubernetes 外部指標 (v1beta1)
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
v1beta1 包是 v1beta1 版本的外部指標 API。
</p>

<!--
## Resource Types
-->
## 資源類型   {#resource-types}

- [ExternalMetricValue](#external-metrics-k8s-io-v1beta1-ExternalMetricValue)
- [ExternalMetricValueList](#external-metrics-k8s-io-v1beta1-ExternalMetricValueList)

## `ExternalMetricValue`     {#external-metrics-k8s-io-v1beta1-ExternalMetricValue}

<!--
**Appears in:**
-->
**出現在：**

- [ExternalMetricValueList](#external-metrics-k8s-io-v1beta1-ExternalMetricValueList)

<p>
<!--
ExternalMetricValue is a metric value for external metric
A single metric value is identified by metric name and a set of string labels.
For one metric there can be multiple values with different sets of labels.
-->
ExternalMetricValue 是外部指標的一個度量值。
單個度量值由指標名稱和一組字符串標籤標識。
對於一個指標，可以有多個具有不同標籤集的值。
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
   指標的名稱。
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
   用於標識指標的單個時間序列的標籤集。
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
   標明這些度量值生成的時間。
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
   當返回根據累積度量計算的速率度量值時，此字段標明計算這些度量值的時間窗口
   （[Timestamp-Window, Timestamp]）（或對於非計算的瞬時度量值爲零）。
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
ExternalMetricValueList 是某個給定指標的某些標籤集的數值列表。
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
   無描述。
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
   與給定標籤集匹配的度量值。
   </p>
</td>
</tr>
</tbody>
</table>
