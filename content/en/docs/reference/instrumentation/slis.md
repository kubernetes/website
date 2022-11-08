---
reviewers:
- logicalhan
title: Kubernetes Component SLIs
content_type: reference
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

The Component SLIs feature allows enabling of a new metrics endpoint for each Kubernetes
binary. This metric endpoint is exposed on the serving HTTPS port of each component,
at the path
`metrics/slis`. 
You must enable to the `ComponentSLIs` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for every component from which you want to scrape SLI metrics.

<!-- body -->

## SLI Metrics

We expose two metrics; a gauge (which represents the current state of the healthcheck) and a
counter (which records the cumulative counts that we've observed for each healthcheck state).

```golang
var (
   // healthcheck is a Prometheus Gauge metrics used for recording the results of a k8s healthcheck.
   healthcheck = k8smetrics.NewGaugeVec(
      &k8smetrics.GaugeOpts{
         Namespace:      "kubernetes",
         Name:           "healthcheck",
         Help:           "This metric records the result of a single healthcheck.",
         StabilityLevel: k8smetrics.ALPHA,
      },
      []string{"name", "type"},
   )

   // healthchecksTotal is a Prometheus Counter metrics used for counting the results of a k8s healthcheck.
   healthchecksTotal = k8smetrics.NewCounterVec(
      &k8smetrics.CounterOpts{
         Namespace:      "kubernetes",
         Name:           "healthchecks_total",
         Help:           "This metric records the results of all healthcheck.",
         StabilityLevel: k8smetrics.ALPHA,
      },
      []string{"name", "type", "status"},
   )
)
```

The gauge data looks like this:

```shell
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

While the counter data looks like this:

```shell
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

## Using this data

The component SLIs metrics endpoint is intended to be scraped at a high frequency. Scraping
at a high frequency means that you end up with greater granularity of the gauge's signal, which
can be then used to calculate SLOs. The `metrics/slis` endpoint provides the raw data necessary
to calculate an availability SLO for the respective Kubernetes component. 
