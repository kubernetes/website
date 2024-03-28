---
title: 自动扩缩工作负载
description: >-
  通过自动扩缩，你可以用某种方式自动更新你的工作负载。在面对资源需求变化的时候可以使你的集群更灵活、更高效。
content_type: concept
weight: 40
---
<!--
title: Autoscaling Workloads
description: >-
  With autoscaling, you can automatically update your workloads in one way or another. This allows your cluster to react to changes in resource demand more elastically and efficiently.
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
In Kubernetes, you can _scale_ a workload depending on the current demand of resources.
This allows your cluster to react to changes in resource demand more elastically and efficiently.

When you scale a workload, you can either increase or decrease the number of replicas managed by
the workload, or adjust the resources available to the replicas in-place.

The first approach is referred to as _horizontal scaling_, while the second is referred to as
_vertical scaling_.

There are manual and automatic ways to scale your workloads, depending on your use case.
-->
在 Kubernetes 中，你可以根据当前的资源需求**扩缩**工作负载。
这让你的集群可以更灵活、更高效地面对资源需求的变化。

当你扩缩工作负载时，你可以增加或减少工作负载所管理的副本数量，或者就地调整副本的可用资源。

第一种手段称为**水平扩缩**，第二种称为**垂直扩缩**。

扩缩工作负载有手动和自动两种方式，这取决于你的使用情况。

<!-- body -->

<!--
## Scaling workloads manually
-->
## 手动扩缩工作负载   {#scaling-workloads-manually}

<!--
Kubernetes supports _manual scaling_ of workloads. Horizontal scaling can be done
using the `kubectl` CLI.
For vertical scaling, you need to _patch_ the resource definition of your workload.

See below for examples of both strategies.
-->
Kubernetes 支持工作负载的手动扩缩。水平扩缩可以使用 `kubectl` 命令行工具完成。
对于垂直扩缩，你需要**更新**工作负载的资源定义。

这两种策略的示例见下文。

<!--
- **Horizontal scaling**: [Running multiple instances of your app](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- **Vertical scaling**: [Resizing CPU and memory resources assigned to containers](/docs/tasks/configure-pod-container/resize-container-resources)
-->
- **水平扩缩**：[运行应用程序的多个实例](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- **垂直扩缩**：[调整分配给容器的 CPU 和内存资源](/docs/tasks/configure-pod-container/resize-container-resources)

<!--
## Scaling workloads automatically
-->
## 自动扩缩工作负载   {#scaling-workloads-automatically}

<!--
Kubernetes also supports _automatic scaling_ of workloads, which is the focus of this page.
-->
Kubernetes 也支持工作负载的**自动扩缩**，这也是本页的重点。

<!--
The concept of _Autoscaling_ in Kubernetes refers to the ability to automatically update an
object that manages a set of Pods (for example a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}).
-->
在 Kubernetes 中**自动扩缩**的概念是指自动更新管理一组 Pod 的能力（例如
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）。

<!--
### Scaling workloads horizontally
-->
### 水平扩缩工作负载   {#scaling-workloads-horizontally}

<!--
In Kubernetes, you can automatically scale a workload horizontally using a _HorizontalPodAutoscaler_ (HPA).
-->
在 Kubernetes 中，你可以使用 HorizontalPodAutoscaler (HPA) 实现工作负载的自动水平扩缩。

<!--
It is implemented as a Kubernetes API resource and a {{< glossary_tooltip text="controller" term_id="controller" >}}
and periodically adjusts the number of {{< glossary_tooltip text="replicas" term_id="replica" >}}
in a workload to match observed resource utilization such as CPU or memory usage.
-->
它以 Kubernetes API 资源和{{< glossary_tooltip text="控制器" term_id="controller" >}}的方式实现，
并定期调整工作负载中{{< glossary_tooltip text="副本" term_id="replica" >}}的数量
以满足设置的资源利用率，如 CPU 或内存利用率。

<!--
There is a [walkthrough tutorial](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough) of configuring a HorizontalPodAutoscaler for a Deployment.
-->
这是一个为 Deployment 部署配置 HorizontalPodAutoscaler 的[示例教程](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough)。

<!--
### Scaling workloads vertically
-->
### 垂直扩缩工作负载   {#scaling-workloads-vertically}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
You can automatically scale a workload vertically using a _VerticalPodAutoscaler_ (VPA).
Unlike the HPA, the VPA doesn't come with Kubernetes by default, but is a separate project
that can be found [on GitHub](https://github.com/kubernetes/autoscaler/tree/9f87b78df0f1d6e142234bb32e8acbd71295585a/vertical-pod-autoscaler).
-->
你可以使用 VerticalPodAutoscaler (VPA) 实现工作负载的垂直扩缩。
不同于 HPA，VPA 并非默认来源于 Kubernetes，而是一个独立的项目，
参见 [on GitHub](https://github.com/kubernetes/autoscaler/tree/9f87b78df0f1d6e142234bb32e8acbd71295585a/vertical-pod-autoscaler)。

<!--
Once installed, it allows you to create {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}}
(CRDs) for your workloads which define _how_ and _when_ to scale the resources of the managed replicas.
-->
安装后，你可以为工作负载创建 {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}}(CRDs)，
定义**如何**以及**何时**扩缩被管理副本的资源。

{{< note >}}
<!--
You will need to have the [Metrics Server](https://github.com/kubernetes-sigs/metrics-server)
installed to your cluster for the HPA to work.
-->
你需要在集群中安装 [Metrics Server](https://github.com/kubernetes-sigs/metrics-server)，这样，你的 HPA 才能正常工作。
{{< /note >}}

<!--
At the moment, the VPA can operate in four different modes:
-->
目前，VPA 可以有四种不同的运行模式：

<!--
{{< table caption="Different modes of the VPA" >}}
Mode | Description
:----|:-----------
`Auto` | Currently, `Recreate` might change to in-place updates in the future
`Recreate` | The VPA assigns resource requests on pod creation as well as updates them on existing pods by evicting them when the requested resources differ significantly from the new recommendation
`Initial` | The VPA only assigns resource requests on pod creation and never changes them later.
`Off` | The VPA does not automatically change the resource requirements of the pods. The recommendations are calculated and can be inspected in the VPA object.
{{< /table >}}
-->
{{< table caption="VPA 的不同模式" >}}
模式 | 描述
:----|:-----------
`Auto` | 目前是 `Recreate`，将来可能改为就地更新
`Recreate` | VPA 会在创建 Pod 时分配资源请求，并且当请求的资源与新的建议值区别很大时通过驱逐 Pod 的方式来更新现存的 Pod
`Initial` | VPA 只有在创建时分配资源请求，之后不做更改
`Off` | VPA 不会自动更改 Pod 的资源需求，建议值仍会计算并可在 VPA 对象中查看
{{< /table >}}

<!--
#### Requirements for in-place resizing
-->
#### 就地调整的要求

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

<!--
Resizing a workload in-place **without** restarting the {{< glossary_tooltip text="Pods" term_id="pod" >}}
or its {{< glossary_tooltip text="Containers" term_id="container" >}} requires Kubernetes version 1.27 or later.
Additionally, the `InPlaceVerticalScaling` feature gate needs to be enabled.
-->
在**不**重启 {{< glossary_tooltip text="Pod" term_id="pod" >}} 或其中{{< glossary_tooltip text="容器" term_id="container" >}}就地调整工作负载的情况下要求 Kubernetes 版本大于 1.27。
此外，特性门控 `InPlaceVerticalScaling` 需要开启。

{{< feature-gate-description name="InPlacePodVerticalScaling" >}}

<!--
### Autoscaling based on cluster size
-->
### 根据集群规模自动扩缩   {#autoscaling-based-on-cluster-size}

<!--
For workloads that need to be scaled based on the size of the cluster (for example
`cluster-dns` or other system components), you can use the
[_Cluster Proportional Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).
Just like the VPA, it is not part of the Kubernetes core, but hosted as its
own project on GitHub.
-->
对于需要根据集群规模实现扩缩的工作负载（例如：`cluster-dns` 或者其他系统组件），
你可以使用 [Cluster Proportional Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)。
与 VPA 一样，这个项目不是 Kubernetes 核心项目的一部分，它在 GitHub 上有自己的项目。 

<!--
The Cluster Proportional Autoscaler watches the number of schedulable {{< glossary_tooltip text="nodes" term_id="node" >}}
and cores and scales the number of replicas of the target workload accordingly.
-->
集群弹性伸缩器 (Cluster Proportional Autoscaler) 会观测可调度 {{< glossary_tooltip text="节点" term_id="node" >}} 和 内核数量，
并调整目标工作负载的副本数量。

<!--
If the number of replicas should stay the same, you can scale your workloads vertically according to the cluster size using
the [_Cluster Proportional Vertical Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler).
The project is **currently in beta** and can be found on GitHub.
-->
如果副本的数量需要保持一致，你可以使用 [Cluster Proportional Vertical Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler) 来根据集群规模进行垂直扩缩。
这个项目目前处于 **beta** 阶段，你可以在 GitHub 上找到它。

<!--
While the Cluster Proportional Autoscaler scales the number of replicas of a workload, the Cluster Proportional Vertical Autoscaler
adjusts the resource requests for a workload (for example a Deployment or DaemonSet) based on the number of nodes and/or cores
in the cluster.
-->
集群弹性伸缩器会扩缩工作负载的副本数量，垂直集群弹性伸缩器 (Cluster Proportional Vertical Autoscaler) 会根据节点和/或核心的数量
调整工作负载的资源请求（例如 Deployment 和 DaemonSet）。

<!--
### Event driven Autoscaling
-->
### 事件驱动型自动扩缩   {#event-driven-autoscaling}

<!--
It is also possible to scale workloads based on events, for example using the
[_Kubernetes Event Driven Autoscaler_ (**KEDA**)](https://keda.sh/).
-->
通过事件驱动实现工作负载的扩缩也是可行的，
例如使用 [Kubernetes Event Driven Autoscaler (**KEDA**)](https://keda.sh/)。

<!--
KEDA is a CNCF graduated enabling you to scale your workloads based on the number
of events to be processed, for example the amount of messages in a queue. There exists
a wide range of adapters for different event sources to choose from.
-->
KEDA 是 CNCF 的毕业项目，能让你根据要处理事件的数量对工作负载进行扩缩，例如队列中消息的数量。
有多种针对不同事件源的适配可供选择。

<!--
### Autoscaling based on schedules
-->
### 根据计划自动扩缩   {#autoscaling-based-on-schedules}

<!--
Another strategy for scaling your workloads is to **schedule** the scaling operations, for example in order to
reduce resource consumption during off-peak hours.
-->
扩缩工作负载的另一种策略是**计划**进行扩缩，例如在非高峰时段减少资源消耗。

<!--
Similar to event driven autoscaling, such behavior can be achieved using KEDA in conjunction with
its [`Cron` scaler](https://keda.sh/docs/2.13/scalers/cron/). The `Cron` scaler allows you to define schedules
(and time zones) for scaling your workloads in or out.
-->
与事件驱动型自动扩缩相似，这种行为可以使用 KEDA 和 [`Cron` scaler](https://keda.sh/docs/2.13/scalers/cron/) 实现。
你可以在计划扩缩器 (Cron scaler) 中定义计划来实现工作负载的横向扩缩。

<!--
## Scaling cluster infrastructure
-->
## 扩缩集群基础设施   {#scaling-cluster-infrastructure}

<!--
If scaling workloads isn't enough to meet your needs, you can also scale your cluster infrastructure itself.
-->
如果扩缩工作负载无法满足你的需求，你也可以扩缩集群基础设施本身。

<!--
Scaling the cluster infrastructure normally means adding or removing {{< glossary_tooltip text="nodes" term_id="node" >}}.
-->
扩缩集群基础设施通常是指增加或移除{{< glossary_tooltip text="节点" term_id="node" >}}。

<!--
Read [cluster autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/)
for more information.
-->
阅读[集群自动扩缩](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/)了解更多信息。

## {{% heading "whatsnext" %}}

<!--
- Learn more about scaling horizontally
  - [Scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/)
  - [HorizontalPodAutoscaler Walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [Resize Container Resources In-Place](/docs/tasks/configure-pod-container/resize-container-resources/)
- [Autoscale the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
- Learn about [cluster autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/)
-->
- 了解有关横向扩缩的更多信息
  - [扩缩 StatefulSet](/zh-cn/docs/tasks/run-application/scale-stateful-set/)
  - [HorizontalPodAutoscaler 演练](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [调整分配给容器的 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)
- [自动扩缩集群 DNS 服务](/zh-cn/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
- 了解[集群自动扩缩]((/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/))
