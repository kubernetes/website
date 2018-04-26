---
assignees:
- fgrzadkowski
- jszczepkowski
- directxman12
title: Horizontal Pod Autoscaling
redirect_from:
- "/docs/user-guide/horizontal-pod-autoscaling/"
- "/docs/user-guide/horizontal-pod-autoscaling/index.html"
cn-approvers:
- rootsongjc
cn-reviewers:
- shirdrn
---
<!--
This document describes the current state of Horizontal Pod Autoscaling in Kubernetes.
-->

该文档描述了 Kubernetes 的 Horizontal Pod Autoscaling 的当前状态。

<!--

## What is Horizontal Pod Autoscaling?

With Horizontal Pod Autoscaling, Kubernetes automatically scales the number of pods
in a replication controller, deployment or replica set based on observed CPU utilization
(or, with alpha support, on some other, application-provided metrics).

The Horizontal Pod Autoscaler is implemented as a Kubernetes API resource and a controller.
The resource determines the behavior of the controller.
The controller periodically adjusts the number of replicas in a replication controller or deployment
to match the observed average CPU utilization to the target specified by user.

-->

## 什么是 Horizontal Pod Autoscaling？

利用 Horizontal Pod Autoscaling，kubernetes 能够根据监测到的 CPU 利用率（或者在 alpha 版本中支持的应用提供的 metric）自动的扩缩容 replication controller，deployment 和 replica set 中 pod 的数量。

Horizontal Pod Autoscaler 作为 kubernetes API resource 和 controller 的实现。Resource 确定 controller 的行为。Controller 会根据监测到用户指定的目标的 CPU 利用率周期性地调整 replication controller 或 deployment 的 replica 数量。

<!--

## How does the Horizontal Pod Autoscaler work?

![Horizontal Pod Autoscaler diagram](/images/docs/horizontal-pod-autoscaler.svg)

The Horizontal Pod Autoscaler is implemented as a control loop, with a period controlled
by the controller manager's `--horizontal-pod-autoscaler-sync-period` flag (with a default
value of 30 seconds).

During each period, the controller manager queries the resource utilization against the
metrics specified in each HorizontalPodAutoscaler definition.  The controller manager
obtains the metrics from either the resource metrics API (for per-pod resource metrics),
or the custom metrics API (for all other metrics).

-->

## Horizontal Pod Autoscaler 如何工作？

![Horizontal Pod Autoscaler diagram](/images/docs/horizontal-pod-autoscaler.svg)

Horizontal Pod Autoscaler 由一个控制循环实现，循环周期由 controller manager 中的 `--horizontal-pod-autoscaler-sync-period` 标志指定（默认是 30 秒）。

在每个周期内，controller manager 会查询 HorizontalPodAutoscaler 中定义的 metric 的资源利用率。Controller manager 从 resource metric API（每个 pod 的 resource metric）或者自定义 metric API（所有的metric）中获取 metric。

<!--


* For per-pod resource metrics (like CPU), the controller fetches the metrics
  from the resource metrics API for each pod targeted by the HorizontalPodAutoscaler.
  Then, if a target utilization value is set, the controller calculates the utilization
  value as a percentage of the equivalent resource request on the containers in
  each pod.  If a target raw value is set, the raw metric values are used directly.
  the controller then takes the mean of the utilization or the raw value (depending on the type
  of target specified) across all targeted pods, and produces a ratio used to scale
  the number of desired replicas.

  Please note that if some of the pod's containers do not have the relevant resource request set,
  CPU utilization for the pod will not be defined and the autoscaler will not take any action
  for that metric. See the [autoscaling algorithm design document](https://git.k8s.io/community/contributors/design-proposals/horizontal-pod-autoscaler.md#autoscaling-algorithm) for further
  details about how the autoscaling algorithm works.

* For per-pod custom metrics, the controller functions similarly to per-pod resource metrics,
  except that it works with raw values, not utilization values.

* For object metrics, a single metric is fetched (which describes the object
  in question), and compared to the target value, to produce a ratio as above.

-->

- 每个 Pod 的 resource metric（例如 CPU），controller 通过 resource metric API 获取 HorizontalPodAutoscaler 中定义的每个 Pod 中的 metric。然后，如果设置了目标利用率，controller 计算利用的值与每个 Pod 的容器里的 resource request 值的百分比。如果设置了目标原始值，将直接使用该原始 metric 值。然后 controller 计算所有目标 Pod 的利用率或原始值（取决于所指定的目标类型）的平均值，产生一个用于缩放所需 replica 数量的比率。
   请注意，如果某些 Pod 的容器没有设置相关的 resource request ，则不会定义 Pod 的 CPU 利用率，并且 Autoscaler 也不会对该 metric 采取任何操作。 有关自动缩放算法如何工作的更多细节，请参阅 [自动缩放算法设计文档](https://git.k8s.io/community/contributors/design-proposals/horizontal-pod-autoscaler.md#autoscaling-algorithm)。
- 对于每个 Pod 自定义的 metric，controller 功能类似于每个 Pod 的 resource metric，只是它使用原始值而不是利用率值。
- 对于 object metric，获取单个度量（该问题描述中 object的 metric），并与目标值进行比较，以产生如上所述的比率。

<!--

The HorizontalPodAutoscaler controller can fetch metrics in two different ways: direct Heapster
access, and REST client access.

When using direct Heapster access, the HorizontalPodAutoscaler queries Heapster directly
through the API server's service proxy subresource.  Heapster needs to be deployed on the
cluster and running in the kube-system namespace.

See [Support for custom metrics](#prerequisites) for more details on REST client access.

The autoscaler accesses corresponding replication controller, deployment or replica set by scale sub-resource.
Scale is an interface that allows you to dynamically set the number of replicas and examine each of their current states.
More details on scale sub-resource can be found [here](https://git.k8s.io/community/contributors/design-proposals/horizontal-pod-autoscaler.md#scale-subresource).

-->

HorizontalPodAutoscaler 控制器可以以两种不同的方式获取 metric ：直接的 Heapster 访问和 REST 客户端访问。

当使用直接的 Heapster 访问时，HorizontalPodAutoscaler 直接通过 API 服务器的服务代理子资源查询 Heapster。需要在集群上部署 Heapster 并在 kube-system namespace 中运行。

有关 REST 客户端访问的详细信息，请参阅 [支持自定义度量](#prerequisites)。

Autoscaler 访问相应的 replication controller，deployment 或 replica set 来缩放子资源。

Scale 是一个允许您动态设置副本数并检查其当前状态的接口。

有关缩放子资源的更多细节可以在 [这里](https://git.k8s.io/community/contributors/design-proposals/horizontal-pod-autoscaler.md#scale-subresource) 找到。

<!--

## API Object

The Horizontal Pod Autoscaler is an API resource in the Kubernetes `autoscaling` API group.
The current stable version, which only includes support for CPU autoscaling,
can be found in the `autoscaling/v1` API version.

The alpha version, which includes support for scaling on memory and custom metrics,
can be found in `autoscaling/v2alpha1`. The new fields introduced in `autoscaling/v2alpha1`
are preserved as annotations when working with `autoscaling/v1`.

More details about the API object can be found at
[HorizontalPodAutoscaler Object](https://git.k8s.io/community/contributors/design-proposals/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object).

-->

## API Object

Horizontal Pod Autoscaler 是 kubernetes 的  `autoscaling` API 组中的 API 资源。当前的稳定版本中，只支持 CPU 自动扩缩容，可以在 `autoscaling/v1` API 版本中找到。

在 alpha 版本中支持根据内存和自定义 metric 扩缩容，可以在 `autoscaling/v2alpha1` 中找到。`autoscaling/v2alpha1` 中引入的新字段在 `autoscaling/v1` 中是做为 annotation 而保存的。

关于该 API 对象的更多信息，请参阅 [HorizontalPodAutoscaler Object](https://git.k8s.io/community/contributors/design-proposals/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object)。

<!--

## Support for Horizontal Pod Autoscaler in kubectl

Horizontal Pod Autoscaler, like every API resource, is supported in a standard way by `kubectl`.
We can create a new autoscaler using `kubectl create` command.
We can list autoscalers by `kubectl get hpa` and get detailed description by `kubectl describe hpa`.
Finally, we can delete an autoscaler using `kubectl delete hpa`.

In addition, there is a special `kubectl autoscale` command for easy creation of a Horizontal Pod Autoscaler.
For instance, executing `kubectl autoscale rc foo --min=2 --max=5 --cpu-percent=80`
will create an autoscaler for replication controller *foo*, with target CPU utilization set to `80%`
and the number of replicas between 2 and 5.
The detailed documentation of `kubectl autoscale` can be found [here](/docs/user-guide/kubectl/v1.6/#autoscale).

-->

## 在 kubectl 中支持 Horizontal Pod Autoscaling

Horizontal Pod Autoscaler 和其他的所有 API 资源一样，通过 `kubectl` 以标准的方式支持。

我们可以使用 `kubectl create` 命令创建一个新的 autoscaler。

我们可以使用 `kubectl get hpa` 列出所有的 autoscaler，使用 `kubectl describe hpa` 获取其详细信息。

最后我们可以使用 `kubectl delete hpa` 删除 autoscaler。

另外，可以使用 `kubectl autoscale` 命令，很轻易的就可以创建一个 Horizontal Pod Autoscaler。

例如，执行 `kubectl autoscale rc foo —min=2 —max=5 —cpu-percent=80` 命令将为 replication controller _foo_ 创建一个 autoscaler，目标的 CPU 利用率是`80%`，replica 的数量介于 2 和 5 之间。

关于 `kubectl autoscale` 的更多信息请参阅 [这里](/docs/user-guide/kubectl/v1.6/#autoscale)。

<!--

## Autoscaling during rolling update

Currently in Kubernetes, it is possible to perform a [rolling update](/docs/tasks/run-application/rolling-update-replication-controller/) by managing replication controllers directly,
or by using the deployment object, which manages the underlying replication controllers for you.
Horizontal Pod Autoscaler only supports the latter approach: the Horizontal Pod Autoscaler is bound to the deployment object,
it sets the size for the deployment object, and the deployment is responsible for setting sizes of underlying replication controllers.

Horizontal Pod Autoscaler does not work with rolling update using direct manipulation of replication controllers,
i.e. you cannot bind a Horizontal Pod Autoscaler to a replication controller and do rolling update (e.g. using `kubectl rolling-update`).
The reason this doesn't work is that when rolling update creates a new replication controller,
the Horizontal Pod Autoscaler will not be bound to the new replication controller.

-->

## 滚动更新期间的自动扩缩容

目前在Kubernetes中，可以通过直接管理 replication controller 或使用 deployment 对象来执行 [滚动更新](/docs/tasks/run-application/rolling-update-replication-controller/)，该 deployment 对象为您管理基础 replication controller。

Horizontal Pod Autoscaler 仅支持后一种方法：Horizontal Pod Autoscaler 被绑定到 deployment 对象，它设置 deployment 对象的大小，deployment 负责设置底层 replication controller 的大小。

Horizontal Pod Autoscaler 不能使用直接操作 replication controller 进行滚动更新，即不能将 Horizontal Pod Autoscaler 绑定到 replication controller，并进行滚动更新（例如使用 `kubectl rolling-update`）。

这不行的原因是，当滚动更新创建一个新的 replication controller 时，Horizontal Pod Autoscaler 将不会绑定到新的 replication controller 上。

<!--


## Support for multiple metrics

Kubernetes 1.6 adds support for scaling based on multiple metrics. You can use the `autoscaling/v2alpha1` API
version to specify multiple metrics for the Horizontal Pod Autoscaler to scale on. Then, the Horizontal Pod
Autoscaler controller will evaluate each metric, and propose a new scale based on that metric. The largest of the
proposed scales will be used as the new scale.

-->

## 支持多个 metric

Kubernetes 1.6 中增加了支持基于多个 metric 的扩缩容。您可以使用 `autoscaling/v2alpha1` API 版本来为 Horizontal Pod Autoscaler 指定多个 metric。然后 Horizontal Pod Autoscaler controller 将权衡每一个 metric，并根据该 metric 提议一个新的 scale。在所有提议里最大的那个 scale 将作为最终的 scale。

<!--

## Support for custom metrics

**Note**: Kubernetes 1.2 added alpha support for scaling based on application-specific metrics using special annotations.
Support for these annotations was removed in Kubernetes 1.6 in favor of the `autoscaling/v2alpha1` API.  While the old method for collecting
custom metrics is still available, these metrics will not be available for use by the Horizontal Pod Autoscaler, and the former
annotations for specifying which custom metrics to scale on are no longer honored by the Horizontal Pod Autoscaler controller.

Kubernetes 1.6 adds support for making use of custom metrics in the Horizontal Pod Autoscaler.
You can add custom metrics for the Horizontal Pod Autoscaler to use in the `autoscaling/v2alpha1` API.
Kubernetes then queries the new custom metrics API to fetch the values of the appropriate custom metrics.

-->

## 支持自定义 metric

**注意：** Kubernetes 1.2 根据特定于应用程序的 metric ，通过使用特殊注释的方式，增加了对缩放的 alpha 支持。

在 Kubernetes 1.6中删除了对这些注释的支持，有利于 `autoscaling/v2alpha1` API。 虽然旧的收集自定义 metric 的旧方法仍然可用，但是这些 metric 将不可供 Horizontal Pod Autoscaler 使用，并且用于指定要缩放的自定义 metric 的以前的注释也不在受 Horizontal Pod Autoscaler 认可。

Kubernetes 1.6增加了在 Horizontal Pod Autoscaler 中使用自定义 metric 的支持。

您可以为 `autoscaling/v2alpha1` API 中使用的 Horizontal Pod Autoscaler 添加自定义 metric 。

Kubernetes 然后查询新的自定义 metric API 来获取相应自定义 metric 的值。

<!--


### Prerequisites

In order to use custom metrics in the Horizontal Pod Autoscaler, you must deploy your cluster with the
`--horizontal-pod-autoscaler-use-rest-clients` flag on the controller manager set to true.  You must then configure
your controller manager to speak to the API server through the API server aggregator, by setting the controller
manager's target API server to the API server aggregator (using the `--apiserver` flag). The resource metrics API and
custom metrics API must also be registered with the API server aggregator, and must be served by API servers running
on the cluster.

You can use Heapster's implementation of the resource metrics API by running Heapster with the`--api-server` flag set
to true. A separate component must provide the custom metrics API (more information on the custom metrics API is
available at [the k8s.io/metrics repository](https://github.com/kubernetes/metrics)).

-->

### 前提条件

为了在 Horizontal Pod Autoscaler 中使用自定义 metric，您必须在您集群的 controller manager 中将  `--horizontal-pod-autoscaler-use-rest-clients` 标志设置为 true。然后，您必须通过将 controller manager 的目标 API server 设置为 API server aggregator（使用 `--apiserver` 标志），配置您的 controller manager 通过 API server aggregator 与API server 通信。 Resource metric API和自定义 metric API 也必须向 API server aggregator 注册，并且必须由集群上运行的 API server 提供。

您可以使用 Heapster 实现 resource metric API，方法是将  `--api-server` 标志设置为 true 并运行 Heapster。 单独的组件必须提供自定义 metric API（有关自定义metric API的更多信息，可从 [k8s.io/metrics repository](https://github.com/kubernetes/metrics) 获得）。

<!--


## Further reading

* Design documentation: [Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/horizontal-pod-autoscaler.md).
* kubectl autoscale command: [kubectl autoscale](/docs/user-guide/kubectl/v1.6/#autoscale).
* Usage example of [Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).

-->

## 进一步阅读

- 设计文档：[Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/horizontal-pod-autoscaler.md)
- kubectl autoscale 命令：[kubectl autoscale](/docs/user-guide/kubectl/v1.6/#autoscale)
- 用法举例： [Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)