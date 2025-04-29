---
layout: blog
title: "Kubernetes v1.33：HorizontalPodAutoscaler 可配置容差"
slug: kubernetes-1-33-hpa-configurable-tolerance
math: true # for formulae
date: 2025-04-29T10:30:00-08:00
author: "Jean-Marc François (Google)"
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: HorizontalPodAutoscaler Configurable Tolerance"
slug: kubernetes-1-33-hpa-configurable-tolerance
math: true # for formulae
date: 2025-04-29T10:30:00-08:00
author: "Jean-Marc François (Google)"
-->

<!--
This post describes _configurable tolerance for horizontal Pod autoscaling_,
a new alpha feature first available in Kubernetes 1.33.
-->
这篇文章描述了**水平 Pod 自动扩缩的可配置容差**，
这是在 Kubernetes 1.33 中首次出现的一个新的 Alpha 特性。

<!--
## What is it?

[Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/)
is a well-known Kubernetes feature that allows your workload to
automatically resize by adding or removing replicas based on resource
utilization.
-->
## 它是什么？

[水平 Pod 自动扩缩](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
是 Kubernetes 中一个众所周知的特性，它允许你的工作负载根据资源利用率自动增减副本数量。

<!--
Let's say you have a web application running in a Kubernetes cluster with 50
replicas. You configure the Horizontal Pod Autoscaler (HPA) to scale based on
CPU utilization, with a target of 75% utilization. Now, imagine that the current
CPU utilization across all replicas is 90%, which is higher than the desired
75%. The HPA will calculate the required number of replicas using the formula:
-->
假设你在 Kubernetes 集群中运行了一个具有 50 个副本的 Web 应用程序。
你配置了 Horizontal Pod Autoscaler （HPA）根据 CPU 利用率进行扩缩，
目标利用率 75%。现在，假设所有副本的当前 CPU 利用率为 90%，
这高于预期的 75%。HPA 将使用以下公式计算所需的副本数量：

```math
desiredReplicas = ceil\left\lceil currentReplicas \times \frac{currentMetricValue}{desiredMetricValue} \right\rceil
```

<!--
In this example:
-->
在此示例中：

```math
50 \times (90/75) = 60
```

<!--
So, the HPA will increase the number of replicas from 50 to 60 to reduce the
load on each pod. Similarly, if the CPU utilization were to drop below 75%, the
HPA would scale down the number of replicas accordingly. The Kubernetes
documentation provides a
[detailed description of the scaling algorithm](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details).
-->
因此，HPA 将增加副本数量从 50 个提高到 60 个，以减少每个 Pod 的负载。
同样，如果 CPU 利用率降至 75% 以下，HPA 会相应地减少副本数量。
Kubernetes 文档提供了[扩缩算法的详细描述](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)。

<!--
In order to avoid replicas being created or deleted whenever a small metric
fluctuation occurs, Kubernetes applies a form of hysteresis: it only changes the
number of replicas when the current and desired metric values differ by more
than 10%. In the example above, since the ratio between the current and desired
metric values is \\(90/75\\), or 20% above target, exceeding the 10% tolerance,
the scale-up action will proceed.
-->
为了避免在指标发生小波动时创建或删除副本，
Kubernetes 应用了一种迟滞形式：仅当当前和期望的指标值差异超过 10% 时，
才改变副本数量。在上面的例子中，因为当前和期望的指标值比率是 \\(90/75\\)，
即超出目标 20%，超过了 10% 的容差，所以扩容操作将继续进行。

<!--
This default tolerance of 10% is cluster-wide; in older Kubernetes releases, it
could not be fine-tuned. It's a suitable value for most usage, but too coarse
for large deployments, where a 10% tolerance represents tens of pods. As a
result, the community has long
[asked](https://github.com/kubernetes/kubernetes/issues/116984) to be able to
tune this value.

In Kubernetes v1.33, this is now possible.
-->
这个 10% 的默认容差是集群范围的；在旧版本的 Kubernetes 中，
它无法进行微调。对于大多数使用场景来说，这是一个合适的值，
但对于大型部署而言则过于粗糙，因为 10% 的容差代表着数十个 Pod。
因此，社区长期以来[要求](https://github.com/kubernetes/kubernetes/issues/116984)能够调整这个值。

在 Kubernetes v1.33 中，现在这已成为可能。

<!--
## How do I use it?

After enabling the `HPAConfigurableTolerance`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) in
your Kubernetes v1.33 cluster, you can add your desired tolerance for your
HorizontalPodAutoscaler object.
-->
## 我如何使用它？

在你的 Kubernetes v1.33 集群中启用 `HPAConfigurableTolerance`
[特性门控][/zh-cn/docs/reference/command-line-tools-reference/feature-gates/]后，
你可以为你的 HorizontalPodAutoscaler 对象添加期望的容差。

<!--
Tolerances appear under the `spec.behavior.scaleDown` and
`spec.behavior.scaleUp` fields and can thus be different for scale up and scale
down. A typical usage would be to specify a small tolerance on scale up (to
react quickly to spikes), but higher on scale down (to avoid adding and removing
replicas too quickly in response to small metric fluctuations).

For example, an HPA with a tolerance of 5% on scale-down, and no tolerance on
scale-up, would look like the following:
-->
容差出现在 `spec.behavior.scaleDown` 和 `spec.behavior.scaleUp`
字段下，因此对于扩容和缩容可以有不同的设置。一个典型的用法是在扩容时指定一个小的容差（以快速响应峰值），
而在缩容时指定较大的容差（以避免因小的指标波动而过快地添加或移除副本）。

例如，一个在缩容时有 5% 容差，在扩容时没有容差的 HPA 配置如下所示：

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app
spec:
  ...
  behavior:
    scaleDown:
      tolerance: 0.05
    scaleUp:
      tolerance: 0
```

<!--
## I want all the details!

Get all the technical details by reading
[KEP-4951](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/4951-configurable-hpa-tolerance)
and follow [issue 4951](https://github.com/kubernetes/enhancements/issues/4951)
to be notified of the feature graduation.
-->
## 所有细节

通过阅读
[KEP-4951](https://github.com/kubernetes/zh-enhancements/tree/master/keps/sig-autoscaling/4951-configurable-hpa-tolerance)
获取所有技术细节，并关注 [Issue 4951](https://github.com/kubernetes/zh-enhancements/issues/4951)
以获得**特性毕业**的通知。
