---
layout: blog
title: "Kubernetes v1.37: Metrics API graduates to stable"
slug: kubernetes-v1-37-metrics-api-ga
draft: true
author: >
  [ChengHao Yang](https://github.com/tico88612)
---

Kubernetes v1.37 promotes the `metrics.k8s.io` API to stable (`v1`). This
API provides CPU and memory usage for nodes and Pods, and is the API behind
commands such as `kubectl top` and resource-metrics-based autoscaling.

For cluster operators and application developers, this graduation means that
the API now has the stability guarantees associated with a Kubernetes stable
API. The `v1` API has the same resource types and fields as `v1beta1`; this is
an API-version graduation, not a change to the metrics that are collected or
returned.

## A long-lived API reaches stable

The resource Metrics API was introduced as alpha in Kubernetes v1.6 and became
beta in v1.8. It has remained unchanged and has been used in production for
years by clients including the HorizontalPodAutoscaler (HPA) and `kubectl top`.
Kubernetes v1.37 formally graduates that proven API to `metrics.k8s.io/v1`.

The API exposes two resource types:

- `NodeMetrics`, for CPU and memory usage for a node.
- `PodMetrics`, for CPU and memory usage for a Pod, with a per-container
    breakdown in its `containers` field.

The API remains intentionally small. It provides the resource metrics needed
for autoscaling and basic inspection; it is not a replacement for a full
monitoring pipeline or the custom metrics (`custom.metrics.k8s.io`) API.

## What changed with the v1.37 release? {#changes}

The `v1` API surface is identical to `v1beta1`, except for the API version.
There are no renamed fields, new fields, or changes to the meaning of the
returned CPU and memory values.

For example, a client can retrieve node metrics from the stable endpoint:

```shell
kubectl get --raw /apis/metrics.k8s.io/v1/nodes
```

Likewise, it can retrieve metrics for the pods in a namespace:

```shell
kubectl get --raw /apis/metrics.k8s.io/v1/namespaces/default/pods
```

`kubectl top` supports both API versions. It prefers `v1` when available and
automatically falls back to `v1beta1` on clusters that do not yet serve `v1`.
The HPA controller currently supports only `v1beta1`. Support for
discovery-based selection between `v1` and `v1beta1` is planned, but is not
available in Kubernetes v1.37.

## What you need to do

You don't need to enable any feature gate. The Metrics API is served through the
[API aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/),
by an implementation such as [metrics-server](https://github.com/kubernetes-sigs/metrics-server).
You can choose any implementation of `metrics.k8s.io`; for the v1 metrics API to be
available in your cluster, your chosen implementation must serve the `v1.metrics.k8s.io` API, and you need to [register](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) an associated [APIService](/docs/reference/kubernetes-api/apiregistration/api-service-v1/).

During the transition, implementations should serve both `v1` and `v1beta1`.
Keeping both versions available maintains compatibility with older clients.
The `v1beta1` API remains available in Kubernetes v1.37.

You can see which versions your cluster serves with:

```shell
kubectl get --raw /apis/metrics.k8s.io/ | jq .
```

Once your metrics implementation supports `v1`, you can also check that its
APIService is available:

```shell
kubectl get apiservice v1.metrics.k8s.io
```

## Learn more

- Read the [Resource metrics pipeline](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
  documentation.
- Read [KEP-5207](https://www.kubernetes.dev/resources/keps/5207/), the proposal for (graduating) this API.
- Learn about the [Metrics API](https://github.com/kubernetes/metrics#resource-metrics-api)
  and its reference implementation, [metrics-server](https://github.com/kubernetes-sigs/metrics-server).

## Get involved

The Metrics API is maintained by [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/).
To ask questions, share feedback, or contribute, join the
[#sig-instrumentation](https://kubernetes.slack.com/messages/sig-instrumentation)
channel on Kubernetes Slack or attend a SIG Instrumentation meeting.
