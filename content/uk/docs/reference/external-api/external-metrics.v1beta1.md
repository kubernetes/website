---
title: Kubernetes External Metrics (v1beta1)
content_type: tool-reference
package: external.metrics.k8s.io/v1beta1
auto_generated: false
---
Пакет v1beta1 є версією v1beta1 зовнішнього API метрик.

## Типи ресурсів {#resource-types}

- [ExternalMetricValue](#external-metrics-k8s-io-v1beta1-ExternalMetricValue)
- [ExternalMetricValueList](#external-metrics-k8s-io-v1beta1-ExternalMetricValueList)

## `ExternalMetricValue` {#external-metrics-k8s-io-v1beta1-ExternalMetricValue}

**Зʼявляється в:**

- [ExternalMetricValueList](#external-metrics-k8s-io-v1beta1-ExternalMetricValueList)

ExternalMetricValue — це значення метрики для зовнішньої метрики. Окрема метрика ідентифікується за назвою метрики та набором рядкових міток. Для однієї метрики може бути кілька значень з різними наборами міток.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>external.metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExternalMetricValue</code></td></tr>
<tr><td><code>metricName</code> <b>[Обовʼязково]</b><br/><code>string</code></td>
<td><p>назва метрики</p></td></tr>
<tr><td><code>metricLabels</code> <b>[Обовʼязково]</b><br/><code>map[string]string</code></td>
<td><p>набір міток, які ідентифікують один часовий ряд для метрики</p></td></tr>
<tr><td><code>timestamp</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a></td>
<td><p>вказує час, коли були створені метрики</p></td></tr>
<tr><td><code>window</code> <b>[Обовʼязково]</b><br/><code>int64</code></td>
<td><p>вказує на вікно ([Timestamp-Window, Timestamp]), з якого були розраховані ці метрики, при поверненні показника метрики, розраховані з кумулятивних метрик (або нуль для нерозрахованих миттєвих метрик).</p></td></tr>
<tr><td><code>value</code> <b>[Обовʼязково]</b><br/><a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity"><code>k8s.io/apimachinery/pkg/api/resource.Quantity</code></a></td>
<td><p>значення метрики</p></td></tr>
</tbody>
</table>

## `ExternalMetricValueList` {#external-metrics-k8s-io-v1beta1-ExternalMetricValueList}

ExternalMetricValueList — це список значень для даної метрики для певного набору міток

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>external.metrics.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExternalMetricValueList</code></td></tr>
<tr><td><code>metadata</code> <b>[Обовʼязково]</b><br/><a href="/docs/reference/generated/kubernetes-api/v1.28/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a></td>
<td><span class="text-muted">Опис відсутній.</span></td></tr>
<tr><td><code>items</code> <b>[Обовʼязково]</b><br/><a href="#external-metrics-k8s-io-v1beta1-ExternalMetricValue"><code>[]ExternalMetricValue</code></a></td>
<td><p>значення метрики для відповідного набору міток</p></td></tr>
</tbody>
</table>
