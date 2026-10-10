---
title: Monitor a Kubernetes Cluster with Metrics
content_type: tutorial
weight: 70
description: >-
  Select, validate, and operate a baseline set of Kubernetes metrics for cluster monitoring.
---

<!-- overview -->

This tutorial shows cluster operators how to establish a practical metrics
baseline for a Kubernetes cluster. You will identify the signals that answer
common operational questions, check that your monitoring system receives those
signals, and use maintained dashboards and rules as a starting point.

This tutorial does not prescribe a monitoring product or deploy a monitoring
stack. It uses Prometheus terminology and query examples because Kubernetes
components expose metrics in the Prometheus format. The same monitoring model
applies to other tools that can scrape and query those metrics.

<!-- objectives -->

## {{% heading "objectives" %}}

* Identify the metric sources required for baseline cluster monitoring.
* Verify that your monitoring system can see those sources.
* Organize dashboards and alerts around actionable operational questions.
* Generate dashboards, alert rules, and recording rules from the Kubernetes
  mixin as a versioned, customizable baseline.

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

Before you begin, you need:

* A Kubernetes cluster and sufficient permissions to view its workloads and
  monitoring configuration.
* A monitoring system that scrapes metrics in the Prometheus format and offers
  a PromQL-compatible query interface. This tutorial calls it your _metrics
  system_.
* Metrics from your control plane components, kubelets, and
  [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/).
  For node-level resource signals, also collect metrics from a node exporter or
  an equivalent source.
* If you follow the Kubernetes mixin section, a workstation with Git, `make`,
  and the build dependencies listed by that project.

This tutorial is about monitoring, not the resource metrics API. The
[Metrics Server](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server)
provides resource metrics for features such as `kubectl top` and autoscaling;
it is not a replacement for a cluster monitoring pipeline with retained metrics,
dashboards, and alerting.

<!-- lessoncontent -->

## Select a baseline of signals

Start with questions that an operator must be able to answer during an incident
or when planning capacity. Avoid beginning with a list of every metric exposed
by Kubernetes components. The [Kubernetes Metrics Reference](/docs/reference/instrumentation/metrics/)
is the complete catalog; it is not a prioritized monitoring checklist.

The following table maps common questions to the metric sources that can answer
them.

| Operational question | Useful metric sources |
| --- | --- |
| Can the monitoring system reach Kubernetes components? | Scrape-target health for the API server, scheduler, controller manager, kubelet, and kube-proxy |
| Are workloads available and progressing? | kube-state-metrics for object status, desired replicas, ready replicas, and Pod state |
| Are nodes or workloads approaching resource limits? | kubelet resource and cAdvisor metrics, plus a node exporter or equivalent source |
| Is the control plane responding reliably? | API server, scheduler, and controller manager metrics |
| Is storage becoming constrained? | kube-state-metrics for PersistentVolume and PersistentVolumeClaim state, plus node-level filesystem metrics |

Begin with these broad signals. Add specialized metrics only when they support
a documented service objective, capacity decision, or incident response.
Examples include workload-specific request metrics, device metrics, and
[Pressure Stall Information (PSI)](/docs/reference/instrumentation/understand-psi-metrics/).

## Verify collection before creating alerts

An alert or dashboard is useful only when its input is complete. In your
metrics system, first list the available scrape jobs:

```promql
count by (job) (up)
```

The names of jobs vary by monitoring deployment. Check that the results include
jobs for the sources you selected, then look for targets that are currently
unreachable:

```promql
up == 0
```

Investigate a missing or unhealthy target before treating an absent workload or
node metric as a cluster condition. A failed scrape, an RBAC denial, or a
selector that does not match your deployment can otherwise look like a healthy
zero value.

Also check the labels that identify cluster, node, namespace, Pod, and
workload. Use a stable cluster label if you query more than one cluster. Avoid
adding labels with an unbounded number of values, such as request IDs, to
metrics that you retain or aggregate; high-cardinality labels make queries and
storage more expensive.

## Design dashboards and alerts around decisions

Use dashboards to establish context and alerts to prompt a human or an
automated response. A baseline set of views and alerts should cover these
areas:

* **Collection health**: failed or missing scrape targets.
* **Workload health**: Pods that are not ready, repeated restarts, and a gap
  between desired and available replicas.
* **Capacity and saturation**: CPU, memory, filesystem, and Pod-capacity
  pressure at the node and cluster levels.
* **Control plane health**: API server availability and latency, scheduling
  failures, and controller work that does not make progress.
* **Storage health**: persistent volume capacity and claims or volumes that
  cannot be bound or mounted.

Each alert should include enough context to route it to an owner and to start
investigation. Link it to a dashboard or runbook when possible. Tune thresholds
and alert durations for your service objectives and operating model rather than
adopting values from another cluster unchanged.

Use recording rules for queries that are expensive, are used in several
dashboards, or provide a standard aggregation such as per-cluster or
per-namespace resource use. Keep the source query with the recording rule and
review it whenever you change scrape labels or upgrade Kubernetes.

## Use the Kubernetes mixin as a maintained baseline

{{% thirdparty-content single="true" %}}

The [Kubernetes mixin](https://github.com/kubernetes-monitoring/kubernetes-mixin)
packages Grafana dashboards with Prometheus alert and recording rules for
Kubernetes. It is a useful baseline because its rules, dashboards, and
compatibility guidance are versioned together. You can use another monitoring
integration; keep the same practice of managing dashboards and rules as
versioned configuration.

Before using the mixin, choose a release that is compatible with your
Kubernetes, Prometheus, and kube-state-metrics versions. The mixin's
[compatibility matrix](https://github.com/kubernetes-monitoring/kubernetes-mixin#releases)
lists the supported combinations.

To inspect the generated artifacts for a selected release, clone that release
and generate its configuration:

```shell
git clone --branch <release-tag> --depth 1 https://github.com/kubernetes-monitoring/kubernetes-mixin.git
cd kubernetes-mixin
make generate
```

The command generates the following artifacts:

* `prometheus_alerts.yaml` contains alert rules.
* `prometheus_rules.yaml` contains recording rules.
* `dashboards_out/` contains Grafana dashboard definitions.

Do not deploy those artifacts unchanged. The mixin has defaults for Prometheus
job selectors such as `kubelet`, `kube-state-metrics`, and `node-exporter`.
Compare those selectors with the `job` labels that you verified earlier and
customize them in your infrastructure configuration. You can also customize
dashboard names, tags, and multi-cluster labels. Follow the mixin's
[customization guidance](https://github.com/kubernetes-monitoring/kubernetes-mixin#customising-the-mixin)
to keep local changes separate from the upstream mixin.

After you review the selectors and rules, load the alert and recording rules
through the configuration mechanism for your metrics system and import the
dashboard definitions into your visualization system. Check that dashboards
return data before enabling notifications from their associated alerts.

## Keep the monitoring baseline current

Treat monitoring configuration as part of operating the cluster:

1. Pin the mixin and other monitoring dependencies to reviewed releases.
1. Review changes to rules, dashboards, and metric selectors before upgrading
   them.
1. After upgrading Kubernetes or changing your scrape configuration, repeat the
   collection checks and investigate rules that no longer return data.
1. Review alert volume after incidents and remove, tune, or route alerts that
   are not actionable.

Kubernetes assigns [stability levels to component metrics](/docs/concepts/cluster-administration/system-metrics/#metric-lifecycle).
Prefer stable metrics for long-lived operational automation. When a beta or
alpha metric is essential, document the dependency and review it as part of
every Kubernetes upgrade.

## {{% heading "whatsnext" %}}

* Learn how Kubernetes components expose [system metrics](/docs/concepts/cluster-administration/system-metrics/).
* Explore the complete [Kubernetes Metrics Reference](/docs/reference/instrumentation/metrics/).
* Read the [Observability](/docs/concepts/cluster-administration/observability/) concept page for logs and traces alongside metrics.
* Learn how to collect [resource usage metrics](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) for `kubectl top` and autoscaling.
