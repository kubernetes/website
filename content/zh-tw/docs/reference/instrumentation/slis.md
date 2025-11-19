---
title: Kubernetes 組件 SLI 指標
linkTitle: 服務水平指示器指標
content_type: reference
weight: 20
description: >-
  用於衡量 Kubernetes 組件可靠性和性能的高級指標。
---
<!--
reviewers:
- logicalhan
title: Kubernetes Component SLI Metrics
linkTitle: Service Level Indicator Metrics
content_type: reference
weight: 20
description: >-
  High-level indicators for measuring the reliability and performance of Kubernetes components.
-->

<!-- overview -->

{{< feature-state feature_gate_name="ComponentSLIs" >}}

<!--
By default, Kubernetes {{< skew currentVersion >}} publishes Service Level Indicator (SLI) metrics 
for each Kubernetes component binary. This metric endpoint is exposed on the serving 
HTTPS port of each component, at the path `/metrics/slis`. The 
`ComponentSLIs` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
defaults to enabled for each Kubernetes component as of v1.27.
-->
默認情況下，Kubernetes {{< skew currentVersion >}} 會爲每個 Kubernetes 組件的二進制文件發佈服務等級指標（SLI）。
此指標端點被暴露在每個組件提供 HTTPS 服務的端口上，路徑爲 `/metrics/slis`。
從 v1.27 版本開始，對每個 Kubernetes 組件而言，
`ComponentSLIs` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)都是默認啓用的。

<!-- body -->

<!--
## SLI Metrics

With SLI metrics enabled, each Kubernetes component exposes two metrics,
labeled per healthcheck:

- a gauge (which represents the current state of the healthcheck)
- a counter (which records the cumulative counts observed for each healthcheck state)
-->
## SLI 指標   {#sli-metrics}

啓用 SLI 指標時，每個 Kubernetes 組件暴露兩個指標，按照健康檢查添加標籤：

- 計量值（表示健康檢查的當前狀態）
- 計數值（記錄觀察到的每個健康檢查狀態的累計次數）

<!--
You can use the metric information to calculate per-component availability statistics.
For example, the API server checks the health of etcd. You can work out and report how
available or unavailable etcd has been - as reported by its client, the API server.

The prometheus gauge data looks like this:
-->
你可以使用此指標信息計算每個組件的可用性統計信息。例如，API 伺服器檢查 etcd 的健康。
你可以計算並報告 etcd 的可用或不可用情況，具體由其客戶端（即 API 伺服器）進行報告。

Prometheus 計量表數據看起來類似於：

```
# HELP kubernetes_healthcheck [ALPHA] This metric records the result of a single healthcheck.
# TYPE kubernetes_healthcheck gauge
kubernetes_healthcheck{name="autoregister-completion",type="healthz"} 1
kubernetes_healthcheck{name="autoregister-completion",type="readyz"} 1
kubernetes_healthcheck{name="etcd",type="healthz"} 1
kubernetes_healthcheck{name="etcd",type="readyz"} 1
kubernetes_healthcheck{name="etcd-readiness",type="readyz"} 1
kubernetes_healthcheck{name="informer-sync",type="readyz"} 1
kubernetes_healthcheck{name="log",type="healthz"} 1
kubernetes_healthcheck{name="log",type="readyz"} 1
kubernetes_healthcheck{name="ping",type="healthz"} 1
kubernetes_healthcheck{name="ping",type="readyz"} 1
```

<!--
While the counter data looks like this:
-->
而計數器數據看起來類似於：

```
# HELP kubernetes_healthchecks_total [ALPHA] This metric records the results of all healthcheck.
# TYPE kubernetes_healthchecks_total counter
kubernetes_healthchecks_total{name="autoregister-completion",status="error",type="readyz"} 1
kubernetes_healthchecks_total{name="autoregister-completion",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="autoregister-completion",status="success",type="readyz"} 14
kubernetes_healthchecks_total{name="etcd",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="etcd",status="success",type="readyz"} 15
kubernetes_healthchecks_total{name="etcd-readiness",status="success",type="readyz"} 15
kubernetes_healthchecks_total{name="informer-sync",status="error",type="readyz"} 1
kubernetes_healthchecks_total{name="informer-sync",status="success",type="readyz"} 14
kubernetes_healthchecks_total{name="log",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="log",status="success",type="readyz"} 15
kubernetes_healthchecks_total{name="ping",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="ping",status="success",type="readyz"} 15
```

<!--
## Using this data

The component SLIs metrics endpoint is intended to be scraped at a high frequency. Scraping
at a high frequency means that you end up with greater granularity of the gauge's signal, which
can be then used to calculate SLOs. The `/metrics/slis` endpoint provides the raw data necessary
to calculate an availability SLO for the respective Kubernetes component.
-->
## 使用此類數據   {#using-this-data}

組件 SLI 指標端點旨在以高頻率被抓取。
高頻率抓取意味着你最終會獲得更細粒度的計量信號，然後可以將其用於計算 SLO。
`/metrics/slis` 端點爲各個 Kubernetes 組件提供了計算可用性 SLO 所需的原始數據。
