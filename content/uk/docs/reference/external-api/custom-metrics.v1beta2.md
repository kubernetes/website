---
title: Kubernetes Custom Metrics (v1beta2)
content_type: tool-reference
package: custom.metrics.k8s.io/v1beta2
auto_generated: false
---

Пакунок v1beta2 - це версія v1beta2 API custom_metrics.

## Типи ресурсів {#resource-types}

- [MetricListOptions](#custom-metrics-k8s-io-v1beta2-MetricListOptions)
- [MetricValue](#custom-metrics-k8s-io-v1beta2-MetricValue)
- [MetricValueList](#custom-metrics-k8s-io-v1beta2-MetricValueList)

## `MetricListOptions` {#custom-metrics-k8s-io-v1beta2-MetricListOptions}

MetricListOptions використовується для вибору метрик за їх селекторами міток

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>custom.metrics.k8s.io/v1beta2</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>MetricListOptions</code></td></tr>
<tr><td><code>labelSelector</code><br/><code>string</code></td>
<td><p>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Стандартно — всі обʼєкти.</p></td></tr>
<tr><td><code>metricLabelSelector</code><br/><code>string</code></td>
<td><p>Селектор для обмеження списку метрик, що повертаються, за їхніми мітками</p></td></tr>
</tbody>
</table>

## `MetricValue` {#custom-metrics-k8s-io-v1beta2-MetricValue}

**Зʼявляється в:**

- [MetricValueList](#custom-metrics-k8s-io-v1beta2-MetricValueList)

MetricValue — це значення метрики для певного обʼєкта.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>custom.metrics.k8s.io/v1beta2</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>MetricValue</code></td></tr>
<tr><td><code>describedObject</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#objectreference-v1-core"><code>core/v1.ObjectReference</code></a></td>
<td><p>посилання на описуваний обʼєкт</p></td></tr>
<tr><td><code>metric</code> <b>[Обовʼязково]</b><br/><a href="#custom-metrics-k8s-io-v1beta2-MetricIdentifier"><code>MetricIdentifier</code></a></td>
<td><span class="text-muted">Опис відсутній.</span></td></tr>
<tr><td><code>timestamp</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a></td>
<td><p>вказує час, коли були створені метрики</p></td></tr>
<tr><td><code>windowSeconds</code> <b>[Обовʼязково]</b><br/><code>int64</code></td>
<td><p>вказує на вікно ([Timestamp-Window, Timestamp]), з якого були розраховані ці метрики, при поверненні показника метрики, розраховані з кумулятивних метрик (або нуль для нерозрахованих миттєвих метрик).</p></td></tr>
<tr><td><code>value</code> <b>[Обовʼязково]</b><br/><a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity"><code>k8s.io/apimachinery/pkg/api/resource.Quantity</code></a></td>
<td><p>значення метрики для цього обʼєкта</p></td></tr>
</tbody>
</table>

## `MetricValueList` {#custom-metrics-k8s-io-v1beta2-MetricValueList}

MetricValueList — це список значень для даної метрики для певного набору обʼєктів

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>custom.metrics.k8s.io/v1beta2</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>MetricValueList</code></td></tr>
<tr><td><code>metadata</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a></td>
<td><span class="text-muted">Опис відсутній.</span></td></tr>
<tr><td><code>items</code> <b>[Обовʼязково]</b><br/><a href="#custom-metrics-k8s-io-v1beta2-MetricValue"><code>[]MetricValue</code></a></td>
<td><p>значення метрики для описаних обʼєктів</p></td></tr>
</tbody>
</table>

## `MetricIdentifier` {#custom-metrics-k8s-io-v1beta2-MetricIdentifier}

**Зʼявляється в:**

- [MetricValue](#custom-metrics-k8s-io-v1beta2-MetricValue)

MetricIdentifier ідентифікує метрику за назвою та, за потреби, селектором.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/><code>string</code></td>
<td><p>name - це назва даної метрики</p></td></tr>
<tr><td><code>selector</code><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#labelselector-v1-meta"><code>meta/v1.LabelSelector</code></a></td>
<td><p>selector представляє селектор міток, який можна використати для вибору цієї метрики, і зазвичай буде просто селектором, переданим у запиті для отримання цієї метрики. Якщо залишити порожнім, для збору метрик буде використано лише назву метрики.</p></td></tr>
</tbody>
</table>
