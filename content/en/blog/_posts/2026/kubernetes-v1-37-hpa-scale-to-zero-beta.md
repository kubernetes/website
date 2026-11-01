---
layout: blog
title: "Kubernetes v1.37: Scale Workloads to Zero with HorizontalPodAutoscaler"
slug: kubernetes-v1-37-hpa-scale-to-zero-beta
author: >
  Johannes Würbach
date: 2026-09-02T10:30:00-08:00
---

Kubernetes v1.37 includes API support for horizontal autoscaling of workloads down
to zero replicas. This feature is now Beta and enabled by default. A
[HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)
(HPA) that uses a suitable _object metric_ or _external metric_ can now scale a
workload to zero replicas, then bring it back when the metric changes.

Before v1.37, you needed an add-on or external component, or you had to enable the
Alpha feature gate, to scale from zero. It is now part of core Kubernetes.

Scaling to zero removes the last idle Pod from workloads such as queue consumers and
batch processors. The savings are largest when each Pod reserves expensive resources,
including dedicated CPUs or GPUs.

The trade-off is cold-start time: the HPA must observe the metric, schedule a Pod, and
start the application. This works well when work can wait in a durable queue.

Kubernetes Services do not buffer requests while no Pods are ready, so HTTP and other
request-driven workloads need a separate buffering layer.

## Why scaling from zero needs a different metric

The HPA commonly scales on CPU or memory usage. Both metrics come from running Pods.
Once the replica count reaches zero, there are no Pods left to measure and no signal
that can tell the HPA to scale back up.

Object and external metrics do not have that limitation. A queue length, for example,
exists independently of the workers that consume it. The HPA can continue reading the
queue length while no workers are running.

The following example scales a queue consumer to and from zero using an external
metric.

## Configure an external metric

The following example uses a Prometheus metric named `queue_consumer_lag`. It assumes
that Prometheus already collects a series similar to this one:

```promql
queue_consumer_lag{namespace="default",name="worker_tasks"}
```

Kubernetes needs a metrics adapter to make that value available through the External
Metrics API. One implementation is the
[Prometheus Adapter](https://github.com/kubernetes-sigs/prometheus-adapter), which can
expose the series using an `externalRules` entry:

```yaml
externalRules:
- seriesQuery: '{__name__="queue_consumer_lag",name!=""}'
  metricsQuery: sum(<<.Series>>{<<.LabelMatchers>>}) by (name)
  resources:
    overrides:
      namespace:
        resource: namespace
```

The exact adapter installation and discovery rules depend on your monitoring setup.
See the Prometheus Adapter guide to
[external metrics](https://github.com/kubernetes-sigs/prometheus-adapter/blob/v0.12.0/docs/externalmetrics.md)
for the full configuration options.

Before creating the HPA, you can verify that Kubernetes can read the metric:

```shell
kubectl get --raw \
  '/apis/external.metrics.k8s.io/v1beta1/namespaces/default/queue_consumer_lag?labelSelector=name%3Dworker_tasks'
```

The request should return the current value for `worker_tasks`. If it does not, fix the
metrics pipeline before configuring the HPA. An HPA cannot scale from zero when its
metric is unavailable.

## Configure the HPA

The following HPA targets a Deployment named `queue-worker`. It allows between zero
and ten replicas, with one replica requested for each 30 queued tasks:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: queue-worker
  annotations:
    kubernetes.io/description: "Scales queue-worker based on the number of queued tasks"
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: queue-worker
  minReplicas: 0
  maxReplicas: 10
  metrics:
  - type: External
    external:
      metric:
        name: queue_consumer_lag
        selector:
          matchLabels:
            name: worker_tasks
      target:
        type: Value
        value: "30"
```

When the queue is empty, the HPA can reduce the Deployment to zero replicas. When
tasks arrive, the external metric remains available and the HPA calculates a new
replica count, capped at ten by `maxReplicas`.

Start the Deployment with at least one replica. Manually setting a Deployment to zero
has always paused autoscaling. The HPA preserves that behavior and will not wake a
workload that it did not scale down itself.

Normal HPA behavior still applies. In particular, the default downscale stabilization
window is five minutes. The window prevents a short drop in queue length from
immediately removing all workers. You can configure the window through
`spec.behavior.scaleDown` if your workload needs different behavior.

## How the HPA distinguishes zero from paused

Scaling from zero creates an ambiguity. A replica count of zero can mean that the HPA
scaled the workload down, or that an operator manually paused it.

The controller resolves this with a `ScaledToZero` status condition. When the HPA
scales a workload from one or more replicas to zero, it records
`ScaledToZero=True`. The condition tells later reconciliation loops that the
controller owns the zero state and should continue evaluating object or external
metrics.

After scaling the workload back up, the controller changes the condition to
`ScaledToZero=False` with the reason `NotScaledToZero`. A workload at zero without
the `ScaledToZero=True` condition remains paused.

You can inspect the conditions with:

```shell
kubectl describe hpa queue-worker
```

If the adapter cannot return the configured metric, the HPA reports
`ScalingActive=False` with a reason such as `FailedGetExternalMetric`. Restore the
metric or manually scale the workload to recover capacity.

## Before upgrading or rolling back

In Kubernetes v1.37, the `HPAScaleToZero` feature gate is enabled by default on both the
`kube-apiserver` and `kube-controller-manager`. The API server accepts
`minReplicas: 0`; the controller manager performs the condition-based scaling.

During a version-skewed control plane upgrade, wait until both components support the
feature and have it enabled before creating HPAs with `minReplicas: 0`. A controller
manager with the feature disabled treats `replicas: 0` as a manual pause and may leave
a workload at zero.

Before disabling the feature gate or downgrading to a version without the
condition-based implementation:

- Change affected HPAs to `minReplicas: 1` or higher.
- Scale any workload currently at zero to at least one replica.

`minReplicas: 0` also requires at least one object or external metric. The API server
rejects an HPA that only contains resource metrics such as CPU or memory.

## From Alpha to Beta

The first Alpha implementation shipped in Kubernetes v1.16. Kubernetes v1.36 added
the `ScaledToZero` condition and the controller behavior needed to distinguish an
automatic scale-down from a manual pause.

Kubernetes v1.37 enables the feature by default after adding integration and end-to-end
coverage for scaling down to zero and back up from an external metric. The next step is
to gather operational feedback before considering graduation to GA.

## How can I learn more?

- Read the documentation for
  [scaling to and from zero](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/#scaling-to-and-from-zero).
- Read
  [KEP-2021: HPA supports scaling to and from zero pods for object and external metrics](https://kep.k8s.io/2021).
- Learn how to configure the
  [Prometheus Adapter for external metrics](https://github.com/kubernetes-sigs/prometheus-adapter/blob/v0.12.0/docs/externalmetrics.md).

## How to get involved

This feature is owned by
[SIG Autoscaling](https://www.kubernetes.dev/community/community-groups/sigs/autoscaling/).
Join [Kubernetes Slack](https://slack.k8s.io/) and the
[`#sig-autoscaling` channel](https://kubernetes.slack.com/archives/C09R1LV8S) to share
feedback from Beta usage.

## Acknowledgements

Thanks to the SIG Autoscaling contributors who took this feature from the original
v1.16 implementation to the condition-based redesign and Beta graduation. Thanks
also to [Guy Templeton](https://github.com/gjtempleton) and
[Adrian Moisey](https://github.com/adrianmoisey) for reviewing the KEP, and to the
release, documentation, and production-readiness reviewers who helped prepare it for
Kubernetes v1.37.
