---
reviewers:
- danielqsj
- brancz
title: Metrics Guideline
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

In Kubernetes, the metrics are exposed via HTTP in the [Prometheus metric format](https://prometheus.io/docs/instrumenting/exposition_formats/), which is open and well-understood by a wide range of third party applications and vendors outside of the Prometheus eco-system.

In order to provide consistently named and high quality metrics in line with the rest of the Prometheus ecosystem and consistent labeling in order to allow straightforward joins of metrics. We shoud follow the [official Kubernetes instrumentation guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md) and the [Prometheus instrumentation best practices](https://prometheus.io/docs/practices/instrumentation/).

{{% /capture %}}

{{% capture body %}}
## Quick Start

The following describes the basic steps required to add a new metric (in Go).

1. Import "github.com/prometheus/client_golang/prometheus".

2. Create a top-level var to define the metric. For this, you have to:

    1. Pick the type of metric. Use a Gauge for things you want to set to a particular value, a Counter for things you want to increment, or a Histogram or Summary for histograms/distributions of values (typically for latency). Histograms are better if you're going to aggregate the values across jobs, while summaries are better if you just want the job to give you a useful summary of
the values.
    2. Give the metric a name and description.
    3. Pick whether you want to distinguish different categories of things using labels on the metric. If so, add "Vec" to the name of the type of metric you want and add a slice of the label names to the definition.

   [Example](https://github.com/kubernetes/kubernetes/blob/cd3299307d44665564e1a5c77d0daa0286603ff5/pkg/apiserver/apiserver.go#L53)
   ```go
    requestCounter = prometheus.NewCounterVec(
      prometheus.CounterOpts{
        Name: "apiserver_request_count",
        Help: "Counter of apiserver requests broken out for each verb, API resource, client, and HTTP response code.",
      },
      []string{"verb", "resource", "client", "code"},
    )
   ```

3. Register the metric so that prometheus will know to export it.

   [Example](https://github.com/kubernetes/kubernetes/blob/cd3299307d44665564e1a5c77d0daa0286603ff5/pkg/apiserver/apiserver.go#L78)
   ```go
    func init() {
      prometheus.MustRegister(requestCounter)
      prometheus.MustRegister(requestLatencies)
      prometheus.MustRegister(requestLatenciesSummary)
    }
   ```

4. Use the metric by calling the appropriate method for your metric type (Set, Inc/Add, or Observe, respectively for Gauge, Counter, or Histogram/Summary), first calling WithLabelValues if your metric has any labels

   [Example](https://github.com/kubernetes/kubernetes/blob/cd3299307d44665564e1a5c77d0daa0286603ff5/pkg/apiserver/apiserver.go#L87)
   ```go
  	requestCounter.WithLabelValues(*verb, *resource, client, strconv.Itoa(*httpCode)).Inc()
   ```

{{% /capture %}}

{{% capture whatsnext %}}

### Reference

* [Official Kubernetes instrumentation guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md)
* [Prometheus instrumentation best practices](https://prometheus.io/docs/practices/instrumentation/)
* [Kubernetes Metrics Overhaul](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/0031-kubernetes-metrics-overhaul.md)

{{% /capture %}}
