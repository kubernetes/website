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

## Scaling workloads automatically

Kubernetes also supports _automatic scaling_ of workloads, which is the focus of this page.

The concept of _Autoscaling_ in Kubernetes refers to the ability to automatically update an
object that manages a set of Pods (for example a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}).

### Scaling workloads horizontally

In Kubernetes, you can automatically scale a workload horizontally using a _HorizontalPodAutoscaler_ (HPA).

It is implemented as a Kubernetes API resource and a {{< glossary_tooltip text="controller" term_id="controller" >}}
and periodically adjusts the number of {{< glossary_tooltip text="replicas" term_id="replica" >}}
in a workload to match observed resource utilization such as CPU or memory usage.

There is a [walkthrough tutorial](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough) of configuring a HorizontalPodAutoscaler for a Deployment.

### Scaling workloads vertically

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

You can automatically scale a workload vertically using a _VerticalPodAutoscaler_ (VPA).
Unlike the HPA, the VPA doesn't come with Kubernetes by default, but is a separate project
that can be found [on GitHub](https://github.com/kubernetes/autoscaler/tree/9f87b78df0f1d6e142234bb32e8acbd71295585a/vertical-pod-autoscaler).

Once installed, it allows you to create {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}}
(CRDs) for your workloads which define _how_ and _when_ to scale the resources of the managed replicas.

{{< note >}}
You will need to have the [Metrics Server](https://github.com/kubernetes-sigs/metrics-server)
installed to your cluster for the HPA to work.
{{< /note >}}

At the moment, the VPA can operate in four different modes:

{{< table caption="Different modes of the VPA" >}}
Mode | Description
:----|:-----------
`Auto` | Currently, `Recreate` might change to in-place updates in the future
`Recreate` | The VPA assigns resource requests on pod creation as well as updates them on existing pods by evicting them when the requested resources differ significantly from the new recommendation
`Initial` | The VPA only assigns resource requests on pod creation and never changes them later.
`Off` | The VPA does not automatically change the resource requirements of the pods. The recommendations are calculated and can be inspected in the VPA object.
{{< /table >}}

#### Requirements for in-place resizing

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

Resizing a workload in-place **without** restarting the {{< glossary_tooltip text="Pods" term_id="pod" >}}
or its {{< glossary_tooltip text="Containers" term_id="container" >}} requires Kubernetes version 1.27 or later.
Additionally, the `InPlaceVerticalScaling` feature gate needs to be enabled.

{{< feature-gate-description name="InPlacePodVerticalScaling" >}}

### Autoscaling based on cluster size

For workloads that need to be scaled based on the size of the cluster (for example
`cluster-dns` or other system components), you can use the
[_Cluster Proportional Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).
Just like the VPA, it is not part of the Kubernetes core, but hosted as its
own project on GitHub.

The Cluster Proportional Autoscaler watches the number of schedulable {{< glossary_tooltip text="nodes" term_id="node" >}}
and cores and scales the number of replicas of the target workload accordingly.

If the number of replicas should stay the same, you can scale your workloads vertically according to the cluster size using
the [_Cluster Proportional Vertical Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler).
The project is **currently in beta** and can be found on GitHub.

While the Cluster Proportional Autoscaler scales the number of replicas of a workload, the Cluster Proportional Vertical Autoscaler
adjusts the resource requests for a workload (for example a Deployment or DaemonSet) based on the number of nodes and/or cores
in the cluster.

### Event driven Autoscaling

It is also possible to scale workloads based on events, for example using the
[_Kubernetes Event Driven Autoscaler_ (**KEDA**)](https://keda.sh/).

KEDA is a CNCF graduated enabling you to scale your workloads based on the number
of events to be processed, for example the amount of messages in a queue. There exists
a wide range of adapters for different event sources to choose from.

### Autoscaling based on schedules

Another strategy for scaling your workloads is to **schedule** the scaling operations, for example in order to
reduce resource consumption during off-peak hours.

Similar to event driven autoscaling, such behavior can be achieved using KEDA in conjunction with
its [`Cron` scaler](https://keda.sh/docs/2.13/scalers/cron/). The `Cron` scaler allows you to define schedules
(and time zones) for scaling your workloads in or out.

## Scaling cluster infrastructure

If scaling workloads isn't enough to meet your needs, you can also scale your cluster infrastructure itself.

Scaling the cluster infrastructure normally means adding or removing {{< glossary_tooltip text="nodes" term_id="node" >}}.
Read [cluster autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/)
for more information.

## {{% heading "whatsnext" %}}

- Learn more about scaling horizontally
  - [Scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/)
  - [HorizontalPodAutoscaler Walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [Resize Container Resources In-Place](/docs/tasks/configure-pod-container/resize-container-resources/)
- [Autoscale the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
- Learn about [cluster autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/)
