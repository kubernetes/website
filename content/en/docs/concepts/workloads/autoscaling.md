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

There are manual and automatic ways to scale your workloads, depending on your use case.

<!-- body -->

## Scaling workloads manually

Kubernetes supports _manual scaling_ of workloads, either by changing the number of
{{< glossary_tooltip text="replicas" term_id="replica">}} defined for an object that manages a set of
{{< glossary_tooltip text="Pods" term_id="pod" >}} (for example a {{< glossary_tooltip text="Deployment" term_id="deployment" >}}),
or by adjusting the resource requests and limits of the replicas managed by the workload
(for example CPU or memory):

- [Running multiple instances of your app](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- [Resizing CPU and memory resources assigned to containers](/docs/tasks/configure-pod-container/resize-container-resources)

{{< note >}}
Resizing a workload in-place **without** restarting the Pods or its Containers requires Kubernetes version 1.27 or later.
{{< /note >}}

## Scaling workloads automatically

Kubernetes also supports _automatic scaling_ of workloads, which is the focus of this page.

The concept of _Autoscaling_ in Kubernetes refers to the ability to automatically update the workloads of your cluster. This can be either an object that manages a set of Pods (for example a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} or Pods or PodTemplates themselves.

Depending on _what_ is being scaled, there are also different options for _how_ to scale:

- scale the number of available instances (such as Replicas in a Deployment)
- scale the available resources on existing instances themselves (such as CPU or memory of a {{< glossary_tooltip text="Container" term_id="container" >}} in a Pod)

The first option is referred to as _horizontal scaling_, while the second is referred to as _vertical scaling_.

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
