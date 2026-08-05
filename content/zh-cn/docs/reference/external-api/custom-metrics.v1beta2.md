---
title: Kubernetes 自定义指标 (v1beta2)
content_type: tool-reference
package: custom.metrics.k8s.io/v1beta2
---
<!--
title: Kubernetes Custom Metrics (v1beta2)
content_type: tool-reference
package: custom.metrics.k8s.io/v1beta2
auto_generated: true
-->

<!--
<p>Package v1beta2 is the v1beta2 version of the custom_metrics API.</p>
-->
<p>v1beta2 包是 v1beta2 版本的 custom_metrics API。</p>

## 资源类型   {#resource-types}

- [MetricListOptions](#custom-metrics-k8s-io-v1beta2-MetricListOptions)
- [MetricValue](#custom-metrics-k8s-io-v1beta2-MetricValue)
- [MetricValueList](#custom-metrics-k8s-io-v1beta2-MetricValueList)

## `MetricListOptions`     {#custom-metrics-k8s-io-v1beta2-MetricListOptions}

<p>
<!--
<p>MetricListOptions is used to select metrics by their label selectors</p>
-->
<p>MetricListOptions 用于按其标签选择算符来选择指标。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>custom.metrics.k8s.io/v1beta2</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>MetricListOptions</code></td></tr>
    
  
<tr><td><code>labelSelector</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>A selector to restrict the list of returned objects by their labels.
Defaults to everything.</p>
   -->
   <p>这个选择算符通过标签来限制所返回对象的列表。
默认为任意值。</p>
</td>
</tr>
<tr><td><code>metricLabelSelector</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>A selector to restrict the list of returned metrics by their labels</p>
   -->
   <p>这个选择算符通过标签来限制所返回指标的列表。</p>
</td>
</tr>
</tbody>
</table>

## `MetricValue`     {#custom-metrics-k8s-io-v1beta2-MetricValue}

<!--
**Appears in:**
-->
**出现在：**

- [MetricValueList](#custom-metrics-k8s-io-v1beta2-MetricValueList)

<!--
<p>MetricValue is the metric value for some object</p>
-->
<p>MetricValue 是某些对象的指标值。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>custom.metrics.k8s.io/v1beta2</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>MetricValue</code></td></tr>
    
  
<tr><td><code>describedObject</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#objectreference-v1-core"><code>core/v1.ObjectReference</code></a>
</td>
<td>
   <!--
   <p>a reference to the described object</p>
   -->
   <p>指向描述对象的引用。</p>
</td>
</tr>
<tr><td><code>metric</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#custom-metrics-k8s-io-v1beta2-MetricIdentifier"><code>MetricIdentifier</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->无描述。</span></td>
</tr>
<tr><td><code>timestamp</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <!--
   <p>indicates the time at which the metrics were produced</p>
   -->
   <p>标明度量值生成的时间。</p>
</td>
</tr>
<tr><td><code>windowSeconds</code> <B><!--[Required]-->[必需]</B><br/>
<code>int64</code>
</td>
<td>
   <!--
   <p>indicates the window ([Timestamp-Window, Timestamp]) from
which these metrics were calculated, when returning rate
metrics calculated from cumulative metrics (or zero for
non-calculated instantaneous metrics).</p>
   -->
   <p>当返回根据累积度量计算的速率度量值时，此字段标明计算这些度量值的时间窗口
   （[Timestamp-Window, Timestamp]）（或对于非计算的瞬时度量值为零）。</p>
</td>
</tr>
<tr><td><code>value</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity"><code>k8s.io/apimachinery/pkg/api/resource.Quantity</code></a>
</td>
<td>
   <!--
   <p>the value of the metric for this</p>
   -->
   <p>度量值。</p>
</td>
</tr>
</tbody>
</table>

## `MetricValueList`     {#custom-metrics-k8s-io-v1beta2-MetricValueList}

<!--
<p>MetricValueList is a list of values for a given metric for some set of objects</p>
-->
<p>MetricValueList 是某个给定指标的某些对象集的数值列表。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>custom.metrics.k8s.io/v1beta2</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>MetricValueList</code></td></tr>
    
  
<tr><td><code>metadata</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->无描述。</span></td>
</tr>
<tr><td><code>items</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#custom-metrics-k8s-io-v1beta2-MetricValue"><code>[]MetricValue</code></a>
</td>
<td>
   <!--
   <p>the value of the metric across the described objects</p>
   -->
   <p>所描述对象的度量值。</p>
</td>
</tr>
</tbody>
</table>

## `MetricIdentifier`     {#custom-metrics-k8s-io-v1beta2-MetricIdentifier}

<!--
**Appears in:**
-->
**出现在：**

- [MetricValue](#custom-metrics-k8s-io-v1beta2-MetricValue)

<!--
<p>MetricIdentifier identifies a metric by name and, optionally, selector</p>
-->
<p>MetricIdentifier 按名称和可选的选择算符来标识指标。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>name is the name of the given metric</p>
   -->
   <p>name 是给定指标的名称。</p>
</td>
</tr>
<tr><td><code>selector</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#labelselector-v1-meta"><code>meta/v1.LabelSelector</code></a>
</td>
<td>
   <!--
   <p>selector represents the label selector that could be used to select
this metric, and will generally just be the selector passed in to
the query used to fetch this metric.
When left blank, only the metric's Name will be used to gather metrics.</p>
   -->
   <p>selector 表示可用于选择此指标的标签选择算符，通常就是传递给查询用于获取此指标的选择算符。
当留空时，仅使用指标的 Name 来采集指标。</p>
</td>
</tr>
</tbody>
</table>
  