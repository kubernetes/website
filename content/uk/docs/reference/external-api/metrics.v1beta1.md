---
title: Kubernetes Metrics (v1beta1)
content_type: tool-reference
package: metrics.k8s.io/v1beta1
auto_generated: false
---
Пакет v1beta1 є версією v1beta1 API метрик.

## Типи ресурсів {#resource-types}

- [NodeMetrics](#metrics-k8s-io-v1beta1-NodeMetrics)
- [NodeMetricsList](#metrics-k8s-io-v1beta1-NodeMetricsList)
- [PodMetrics](#metrics-k8s-io-v1beta1-PodMetrics)
- [PodMetricsList](#metrics-k8s-io-v1beta1-PodMetricsList)

## `NodeMetrics` {#metrics-k8s-io-v1beta1-NodeMetrics}

**Зʼявляється в:**

- [NodeMetricsList](#metrics-k8s-io-v1beta1-NodeMetricsList)

NodeMetrics встановлює метрики використання ресурсів вузла.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeMetrics</code></td></tr>
<tr><td><code>metadata</code><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a></td>
<td>
   <p>Стандартні метадані обʼєкта. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</p>
   Звіряйтесь з документацією Kubernetes API для полів <code>metadata</code>.</td>
</tr>
<tr><td><code>timestamp</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a></td>
<td>
   <p>Наступні поля визначають інтервал часу, з якого метрики були зібрані, з інтервалу [Timestamp-Window, Timestamp].</p>
</td>
</tr>
<tr><td><code>window</code> <b>[Обовʼязково]</b><br/><a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a></td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>usage</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#resourcelist-v1-core"><code>core/v1.ResourceList</code></a></td>
<td>
   <p>Використання памʼяті — це робочий набір памʼяті.</p>
</td>
</tr>
</tbody>
</table>

## `NodeMetricsList` {#metrics-k8s-io-v1beta1-NodeMetricsList}

NodeMetricsList — це список NodeMetrics.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeMetricsList</code></td></tr>
<tr><td><code>metadata</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a></td>
<td>
   <p>Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</p>
</td>
</tr>
<tr><td><code>items</code> <b>[Обовʼязково]</b><br/><a href="#metrics-k8s-io-v1beta1-NodeMetrics"><code>[]NodeMetrics</code></a></td>
<td>
   <p>Список метрик вузла.</p>
</td>
</tr>
</tbody>
</table>

## `PodMetrics` {#metrics-k8s-io-v1beta1-PodMetrics}

**Зʼявляється в:**

- [PodMetricsList](#metrics-k8s-io-v1beta1-PodMetricsList)

PodMetrics встановлює метрики використання ресурсів Pod.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodMetrics</code></td></tr>
<tr><td><code>metadata</code><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a></td>
<td>
   <p>Стандартні метадані обʼєкта. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</p>
   Звіряйтесь з документацією Kubernetes API для полів <code>metadata</code>.</td>
</tr>
<tr><td><code>timestamp</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a></td>
<td>
   <p>Наступні поля визначають інтервал часу, з якого метрики були зібрані, з інтервалу [Timestamp-Window, Timestamp].</p>
</td>
</tr>
<tr><td><code>window</code> <b>[Обовʼязково]</b><br/><a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a></td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>containers</code> <b>[Обовʼязково]</b><br/><a href="#metrics-k8s-io-v1beta1-ContainerMetrics"><code>[]ContainerMetrics</code></a></td>
<td>
   <p>Метрики для всіх контейнерів збираються в одному часовому інтервалі.</p>
</td>
</tr>
</tbody>
</table>

## `PodMetricsList` {#metrics-k8s-io-v1beta1-PodMetricsList}

PodMetricsList — це список PodMetrics.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodMetricsList</code></td></tr>
<tr><td><code>metadata</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a></td>
<td>
   <p>Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</p>
</td>
</tr>
<tr><td><code>items</code> <b>[Обовʼязково]</b><br/><a href="#metrics-k8s-io-v1beta1-PodMetrics"><code>[]PodMetrics</code></a></td>
<td>
   <p>Список метрик поду.</p>
</td>
</tr>
</tbody>
</table>

## `ContainerMetrics` {#metrics-k8s-io-v1beta1-ContainerMetrics}

**Зʼявляється в:**

- [PodMetrics](#metrics-k8s-io-v1beta1-PodMetrics)

ContainerMetrics встановлює метрики використання ресурсів контейнера.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/><code>string</code></td>
<td>
   <p>Назва контейнера відповідає тій, що з pod.spec.containers.</p>
</td>
</tr>
<tr><td><code>usage</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#resourcelist-v1-core"><code>core/v1.ResourceList</code></a></td>
<td>
   <p>Використання памʼяті — це робочий набір памʼяті.</p>
</td>
</tr>
</tbody>
</table>