---
title: Kubernetes 组件 SLI 指标
linkTitle: 服务水平指示器指标
content_type: reference
weight: 20
---
<!--
reviewers:
- logicalhan
title: Kubernetes Component SLI Metrics
linkTitle: Service Level Indicator Metrics
content_type: reference
weight: 20
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.29" state="stable" >}}

<!--
By default, Kubernetes {{< skew currentVersion >}} publishes Service Level Indicator (SLI) metrics 
for each Kubernetes component binary. This metric endpoint is exposed on the serving 
HTTPS port of each component, at the path `/metrics/slis`. The 
`ComponentSLIs` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
defaults to enabled for each Kubernetes component as of v1.27.
-->
默认情况下，Kubernetes {{< skew currentVersion >}} 会为每个 Kubernetes 组件的二进制文件发布服务等级指标（SLI）。
此指标端点被暴露在每个组件提供 HTTPS 服务的端口上，路径为 `/metrics/slis`。
从 v1.27 版本开始，对每个 Kubernetes 组件而言，
`ComponentSLIs` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)都是默认启用的。

<!-- body -->

<!--
## SLI Metrics

With SLI metrics enabled, each Kubernetes component exposes two metrics,
labeled per healthcheck:

- a gauge (which represents the current state of the healthcheck)
- a counter (which records the cumulative counts observed for each healthcheck state)
-->
## SLI 指标   {#sli-metrics}

启用 SLI 指标时，每个 Kubernetes 组件暴露两个指标，按照健康检查添加标签：

- 计量值（表示健康检查的当前状态）
- 计数值（记录观察到的每个健康检查状态的累计次数）

<!--
You can use the metric information to calculate per-component availability statistics.
For example, the API server checks the health of etcd. You can work out and report how
available or unavailable etcd has been - as reported by its client, the API server.

The prometheus gauge data looks like this:
-->
你可以使用此指标信息计算每个组件的可用性统计信息。例如，API 服务器检查 etcd 的健康。
你可以计算并报告 etcd 的可用或不可用情况，具体由其客户端（即 API 服务器）进行报告。

Prometheus 计量表数据看起来类似于：

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
而计数器数据看起来类似于：

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
## 使用此类数据   {#using-this-data}

组件 SLI 指标端点旨在以高频率被抓取。
高频率抓取意味着你最终会获得更细粒度的计量信号，然后可以将其用于计算 SLO。
`/metrics/slis` 端点为各个 Kubernetes 组件提供了计算可用性 SLO 所需的原始数据。
