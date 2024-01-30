---
reviewers: []
title: Autoscaling Workloads
description: >-
  With Autoscaling, you can automatically update your workloads or infrastructure in one way or another. This allows your cluster to react to changes in resource demand more elastically and efficiently.
content_type: concept
weight: 40
hide_summary: true # Listed separately in section index
---

<!-- overview -->

The concept of _Autoscaling_ in Kubernetes refers to the ability to automatically update the available
resources of your cluster. This can be either a replication controller (for example a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} or
{{< glossary_tooltip text="ReplicaSet" term_id="replica-set" >}}), or the cluster infrastructure
itself (for example the number of {{< glossary_tooltip text="Nodes" term_id="node" >}}).

Besides the differentiation in _what_ is being scaled, there are also different options for _how_ to scale:

- scale the number of available instances (such as Pods or Nodes)
- scale the available resources on existing instances themselves (such as CPU or memory)

The first option is referred to as _horizontal scaling_, while the second is referred to as _vertical scaling_.

<!-- body -->

## Scaling Workloads Horizontally

In Kubernetes, you can scale a workload horizontally using a _HorizontalPodAutoscaler_ (HPA).
It is implemented as a Kubernetes API resource and a {{< glossary_tooltip text="controller" term_id="controller" >}}
and periodically adjusts the number of {{< glossary_tooltip text="replicas" term_id="replica" >}}
in a workload to match observed resource utilization such as CPU or memory usage.

There is a [walkthrough example](../../../tasks/run-application/horizontal-pod-autoscale-walkthrough.md) of configuring a HorizontalPodAutoscaler for a Deployment.

## Scaling Workloads Vertically

_tba_ about VerticalPodAutoscaler

## Scaling the Cluster

_tba_ about Cluster Autoscaler and Karpenter

## Advanced Scenarios

_tba_ about Cluster Proportional Autoscaler, KEDA, and KNative Autoscaler

## {{% heading "whatsnext" %}}

- item 1
- item 2
  - subitem 1
  - subitem 2
- item 3
