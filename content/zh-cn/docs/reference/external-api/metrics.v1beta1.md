---
title: Kubernetes 指标 (v1beta1)
content_type: tool-reference
package: metrics.k8s.io/v1beta1
---
<!--
title: Kubernetes Metrics (v1beta1)
content_type: tool-reference
package: metrics.k8s.io/v1beta1
auto_generated: true
-->

<!--
<p>Package v1beta1 is the v1beta1 version of the metrics API.</p>
-->
<p>v1beta1 包是 v1beta1 版本的指标 API。</p>

<!--
## Resource Types
-->
## 资源类型   {#resource-types}

- [NodeMetrics](#metrics-k8s-io-v1beta1-NodeMetrics)
- [NodeMetricsList](#metrics-k8s-io-v1beta1-NodeMetricsList)
- [PodMetrics](#metrics-k8s-io-v1beta1-PodMetrics)
- [PodMetricsList](#metrics-k8s-io-v1beta1-PodMetricsList)

## `NodeMetrics`     {#metrics-k8s-io-v1beta1-NodeMetrics}

<!--
**Appears in:**
-->
**出现在：**

- [NodeMetricsList](#metrics-k8s-io-v1beta1-NodeMetricsList)

<!--
<p>NodeMetrics sets resource usage metrics of a node.</p>
-->
<p>NodeMetrics 设置节点的资源用量指标。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeMetrics</code></td></tr>
    
  
<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a>
</td>
<td>
   <!--
   <p>Standard object's metadata.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</p>
Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.
   -->
   <p>标准的对象元数据。更多信息：
   https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</p>
参阅 Kubernetes API 文档了解 <code>metadata</code> 字段。
</td>
</tr>
<tr><td><code>timestamp</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <!--
   <p>The following fields define time interval from which metrics were
collected from the interval [Timestamp-Window, Timestamp].</p>
   -->
   <p>以下字段定义从时间间隔 [Timestamp-Window，Timestamp] 中收集指标的时间间隔。</p>
</td>
</tr>
<tr><td><code>window</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <span class="text-muted">
   <!--
   No description provided.
   -->
   无描述。
   </span></td>
</tr>
<tr><td><code>usage</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#resourcelist-v1-core"><code>core/v1.ResourceList</code></a>
</td>
<td>
   <!--
   <p>The memory usage is the memory working set.</p>
   -->
   <p>内存用量是内存工作集。</p>
</td>
</tr>
</tbody>
</table>

## `NodeMetricsList`     {#metrics-k8s-io-v1beta1-NodeMetricsList}

<!--
<p>NodeMetricsList is a list of NodeMetrics.</p>
-->
<p>NodeMetricsList 是 NodeMetrics 的列表。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeMetricsList</code></td></tr>
    
  
<tr><td><code>metadata</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <!--
   <p>Standard list metadata.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</p>
   -->
   <p>标准的列表元数据。更多信息：
   https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</p>
</td>
</tr>
<tr><td><code>items</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#metrics-k8s-io-v1beta1-NodeMetrics"><code>[]NodeMetrics</code></a>
</td>
<td>
   <!--
   <p>List of node metrics.</p>
   -->
   <p>节点指标的列表。</p>
</td>
</tr>
</tbody>
</table>

## `PodMetrics`     {#metrics-k8s-io-v1beta1-PodMetrics}

<!--
**Appears in:**
-->
**出现在：**

- [PodMetricsList](#metrics-k8s-io-v1beta1-PodMetricsList)

<!--
<p>PodMetrics sets resource usage metrics of a pod.</p>
-->
<p>PodMetrics 设置 Pod 的资源用量指标。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodMetrics</code></td></tr>
    
  
<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a>
</td>
<td>
   <!--
   <p>Standard object's metadata.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</p>
Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.
   -->
   <p>标准的对象元数据。更多信息：
   https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</p>
参阅 Kubernetes API 文档了解 <code>metadata</code> 字段。

</td>
</tr>
<tr><td><code>timestamp</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <!--
   <p>The following fields define time interval from which metrics were
collected from the interval [Timestamp-Window, Timestamp].</p>
   -->
   <p>以下字段定义了从时间间隔 [Timestamp-Window，Timestamp] 中收集指标的时间间隔。</p>
</td>
</tr>
<tr><td><code>window</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <span class="text-muted">
   <!--
   No description provided.
   -->
   无描述。
   </span></td>
</tr>
<tr><td><code>containers</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#metrics-k8s-io-v1beta1-ContainerMetrics"><code>[]ContainerMetrics</code></a>
</td>
<td>
   <!--
   <p>Metrics for all containers are collected within the same time window.</p>
   -->
   <p>在相同时间窗口内收集所有容器的指标。</p>
</td>
</tr>
</tbody>
</table>

## `PodMetricsList`     {#metrics-k8s-io-v1beta1-PodMetricsList}

<!--
<p>PodMetricsList is a list of PodMetrics.</p>
-->
<p>PodMetricsList 是 PodMetrics 的列表。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodMetricsList</code></td></tr>
  
<tr><td><code>metadata</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <!--
   <p>Standard list metadata.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</p>
   -->
   <p>标准的列表元数据。更多信息：
   https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</p>
</td>
</tr>
<tr><td><code>items</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#metrics-k8s-io-v1beta1-PodMetrics"><code>[]PodMetrics</code></a>
</td>
<td>
   <!--
   <p>List of pod metrics.</p>
   -->
   <p>Pod 指标的列表。</p>
</td>
</tr>
</tbody>
</table>

## `ContainerMetrics`     {#metrics-k8s-io-v1beta1-ContainerMetrics}

<!--
**Appears in:**
-->
**出现在：**

- [PodMetrics](#metrics-k8s-io-v1beta1-PodMetrics)

<!--
<p>ContainerMetrics sets resource usage metrics of a container.</p>
-->
<p>ContainerMetrics 设置容器的资源用量指标。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>Container name corresponding to the one from pod.spec.containers.</p>
   -->
   <p>与 pod.spec.containers 中某个对应的容器名称。</p>
</td>
</tr>
<tr><td><code>usage</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#resourcelist-v1-core"><code>core/v1.ResourceList</code></a>
</td>
<td>
   <!--
   <p>The memory usage is the memory working set.</p>
   -->
   <p>内存用量是内容工作集。</p>
</td>
</tr>
</tbody>
</table>
