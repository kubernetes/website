---
layout: blog
title: "Kubernetes 1.27：HorizontalPodAutoscaler ContainerResource 类型指标进阶至 Beta"
date: 2023-05-02T12:00:00+0800
slug: hpa-container-resource-metric
---
<!--
layout: blog
title: "Kubernetes 1.27: HorizontalPodAutoscaler ContainerResource type metric moves to beta"
date: 2023-05-02T12:00:00+0800
slug: hpa-container-resource-metric
-->

<!--
**Author:** [Kensei Nakada](https://github.com/sanposhiho) (Mercari)
-->
**作者:** [Kensei Nakada](https://github.com/sanposhiho) (Mercari)

**译者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
Kubernetes 1.20 introduced the [`ContainerResource` type metric](/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
in HorizontalPodAutoscaler (HPA).

In Kubernetes 1.27, this feature moves to beta and the corresponding feature gate (`HPAContainerMetrics`) gets enabled by default.
-->
Kubernetes 1.20 在 HorizontalPodAutoscaler (HPA) 中引入了
[`ContainerResource` 类型指标](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)。

在 Kubernetes 1.27 中，此特性进阶至 Beta，相应的特性门控 (`HPAContainerMetrics`) 默认被启用。

<!--
## What is the ContainerResource type metric

The ContainerResource type metric allows us to configure the autoscaling based on resource usage of individual containers.

In the following example, the HPA controller scales the target 
so that the average utilization of the cpu in the application container of all the pods is around 60%.
(See [the algorithm details](/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)
to know how the desired replica number is calculated exactly)
-->
## 什么是 ContainerResource 类型指标

ContainerResource 类型指标允许我们根据各个容器的资源使用量来配置自动扩缩。

在下面的示例中，HPA 控制器扩缩目标，以便所有 Pod 的应用程序容器的 CPU 平均利用率约为 60％
（请参见[算法详情](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)以了解预期副本数的确切计算方式）。

```yaml
type: ContainerResource
containerResource:
  name: cpu
  container: application
  target:
    type: Utilization
    averageUtilization: 60
```

<!--
## The difference from the Resource type metric

HPA already had a [Resource type metric](/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-resource-metrics).

You can define the target resource utilization like the following,
and then HPA will scale up/down the replicas based on the current utilization.
-->
## 与 Resource 类型指标的区别

HPA 已具有 [Resource 类型指标](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-resource-metrics)。

你可以定义如下的目标资源利用率，然后 HPA 将基于当前利用率扩缩副本。

```yaml
type: Resource
resource:
  name: cpu
  target:
    type: Utilization
    averageUtilization: 60
```

<!--
But, this Resource type metric refers to the average utilization of the **Pods**.

In case a Pod has multiple containers, the utilization calculation would be:
-->
但这个 Resource 类型指标指的是 **Pod** 的平均利用率。

如果一个 Pod 有多个容器，则利用率计算公式为：

<!--
```
sum{the resource usage of each container} / sum{the resource request of each container}
```
-->
```
sum{每个容器的资源使用量} / sum{每个容器的资源请求}
```

<!--
The resource utilization of each container may not have a direct correlation or may grow at different rates as the load changes.
-->
每个容器的资源利用率可能没有直接关系，或可能随着负载变化而以不同的速度增长。

<!--
For example:
- A sidecar container is only providing an auxiliary service such as log shipping.
  If the application does not log very frequently or does not produce logs in its hotpath
  then the usage of the log shipper will not grow.
- A sidecar container which provides authentication. Due to heavy caching
  the usage will only increase slightly when the load on the main container increases.
  In the current blended usage calculation approach this usually results in
  the HPA not scaling up the deployment because the blended usage is still low.
- A sidecar may be injected without resources set which prevents scaling
  based on utilization. In the current logic the HPA controller can only scale
  on absolute resource usage of the pod when the resource requests are not set.
-->
例如：

- 边车容器仅提供日志传输这类辅助服务。
  如果应用程序不经常记录日志或在其频繁执行的路径中不生成日志，则日志发送器的使用量不会增长。
- 提供身份验证的边车容器。由于重度缓存，当主要容器的负载增加时，使用量只会略微增加。
  在当前的混合用量计算方法中，这通常导致 HPA 不会对 Deployment 向上扩容，因为混合的使用量仍然很低。
- 边车可能在未设置资源的情况下被注入，这会阻止基于利用率进行扩缩。
  在当前的逻辑中，当未设置资源请求时，HPA 控制器只能根据 Pod 的绝对资源使用量进行扩缩。

<!--
And, in such case, if only one container's resource utilization goes high, 
the Resource type metric may not suggest scaling up.

So, for the accurate autoscaling, you may want to use the ContainerResource type metric for such Pods instead.
-->
在这种情况下，如果仅有一个容器的资源利用率增加，则 Resource 类型指标可能不会建议扩容。

因此，为了实现准确的自动扩缩，你可能需要改为使用 ContainerResource 类型指标来替代这些 Pod。

<!--
## What's new for the beta?

For Kubernetes v1.27, the ContainerResource type metric is available by default as described at the beginning
of this article.
(You can still disable it by the `HPAContainerMetrics` feature gate.)
-->
## Beta 版本有哪些新内容？

在 Kubernetes v1.27 中，正如本文开头所述，ContainerResource 类型指标默认可用。
（你仍然可以通过 `HPAContainerMetrics` 特性门禁用它。）

<!--
Also, we've improved the observability of HPA controller by exposing some metrics from the kube-controller-manager:
- `metric_computation_total`: Number of metric computations. 
- `metric_computation_duration_seconds`: The time that the HPA controller takes to calculate one metric.
- `reconciliations_total`: Number of reconciliation of HPA controller. 
- `reconciliation_duration_seconds`: The time that the HPA controller takes to reconcile a HPA object once.
-->
另外，我们已通过从 kube-controller-manager 中公开一些指标来改进 HPA 控制器的可观测性：

- `metric_computation_total`：指标计算的数量。
- `metric_computation_duration_seconds`：HPA 控制器计算一个指标所需的时间。
- `reconciliations_total`：HPA 控制器的协调次数。
- `reconciliation_duration_seconds`：HPA 控制器协调一次 HPA 对象所需的时间。

<!--
These metrics have labels `action` (`scale_up`, `scale_down`, `none`) and `error` (`spec`, `internal`, `none`).
And, in addition to them, the first two metrics have the `metric_type` label
which corresponds to `.spec.metrics[*].type` for a HorizontalPodAutoscaler.
-->
这些指标具有 `action`（`scale_up`、`scale_down`、`none`）和
`error`（`spec`、`internal`、`none`）标签。
除此之外，前两个指标还具有 `metric_type` 标签，该标签对应于
HorizontalPodAutoscaler 的 `.spec.metrics[*].type`。

<!--
All metrics are useful for general monitoring of HPA controller,
you can get deeper insight into which part has a problem, where it takes time, how much scaling tends to happen at which time on your cluster etc.
-->
所有指标都可用于 HPA 控制器的常规监控，你可以深入洞察哪部分存在问题，在哪里耗时，
集群在哪个时间倾向于发生多少次扩缩等问题。

<!--
Another minor stuff, we've changed the `SuccessfulRescale` event's messages
so that everyone can check whether the events came from the resource metric or
the container resource metric (See [the related PR](https://github.com/kubernetes/kubernetes/pull/116045)).
-->
另一件小事是，我们已更改了 `SuccessfulRescale` 事件的消息，
这样每个人都可以检查事件是否来自资源指标或容器资源指标
（请参见[相关 PR](https://github.com/kubernetes/kubernetes/pull/116045)）。

<!--
## Getting involved 

This feature is managed by [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling). 
Please join us and share your feedback. We look forward to hearing from you!
-->
## 参与其中

此特性由 [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling)
进行管理。请加入我们分享反馈。我们期待聆听你的声音！

<!--
## How can I learn more?

- [The official document of the ContainerResource type metric](/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
- [KEP-1610: Container Resource based Autoscaling](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/1610-container-resource-autoscaling)
-->
## 了解更多

- [ContainerResource 类型指标的正式文档](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
- [KEP-1610：Container Resource based Autoscaling（基于容器资源的自动扩缩）](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/1610-container-resource-autoscaling)
