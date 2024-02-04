---
title: Autoscaling Workloads
description: >-
  With autoscaling, you can automatically update your workloads in one way or another. This allows your cluster to react to changes in resource demand more elastically and efficiently.
content_type: concept
weight: 40
---

<!-- overview -->

In Kubernetes, you can _scale_ a workload depending on the current demand of resources.
This allows your cluster to react to changes in resource demand more elastically and efficiently.

When you scale a workload, you can either increase or decrease the number of replicas managed by
the workload, or adjust the resources available to the replicas in-place.

The first approach is referred to as _horizontal scaling_, while the second is referred to as
_vertical scaling_.

There are manual and automatic ways to scale your workloads, depending on your use case.

<!-- body -->

## Scaling workloads manually

Kubernetes supports _manual scaling_ of workloads. Horizontal scaling can be done
using the `kubectl` CLI.
For vertical scaling, you need to _patch_ the resource definition of your workload.

See below for examples of both strategies.

- **Horizontal scaling**: [Running multiple instances of your app](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- **Vertical scaling**: [Resizing CPU and memory resources assigned to containers](/docs/tasks/configure-pod-container/resize-container-resources)

{{< note >}}
Resizing a workload in-place **without** restarting the {{< glossary_tooltip text="Pods" term_id="pod" >}}
or its {{< glossary_tooltip text="Containers" term_id="container" >}} requires Kubernetes version 1.27 or later.
{{< /note >}}

## Scaling workloads automatically

Kubernetes also supports _automatic scaling_ of workloads, which is the focus of this page.

The concept of _Autoscaling_ in Kubernetes refers to the ability to automatically update an
object that manages a set of Pods (for example a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}.

### Scaling workloads horizontally

In Kubernetes, you can automatically scale a workload horizontally using a _HorizontalPodAutoscaler_ (HPA).

It is implemented as a Kubernetes API resource and a {{< glossary_tooltip text="controller" term_id="controller" >}}
and periodically adjusts the number of {{< glossary_tooltip text="replicas" term_id="replica" >}}
in a workload to match observed resource utilization such as CPU or memory usage.

There is a [walkthrough tutorial](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough) of configuring a HorizontalPodAutoscaler for a Deployment.

### Scaling workloads vertically

_tbd_

### Event driven Autoscaling

_tbd_

### Autoscaling based on cluster size

_tbd_

### Autoscaling based on schedules

_tbd_

## Scaling cluster infrastructure

_tbd_, short summary

## Third-party Autoscalers

_tbd_, short summary of KEDA and KNative autoscalers

## {{% heading "whatsnext" %}}

- item 1
- item 2
  - subitem 1
  - subitem 2
- item 3
