---
layout: blog
title: "Kubernetes v1.33：HorizontalPodAutoscaler 可設定容差"
slug: kubernetes-v1-33-hpa-configurable-tolerance
math: true # for formulae
date: 2025-04-28T10:30:00-08:00
author: "Jean-Marc François (Google)"
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: HorizontalPodAutoscaler Configurable Tolerance"
slug: kubernetes-v1-33-hpa-configurable-tolerance
math: true # for formulae
date: 2025-04-28T10:30:00-08:00
author: "Jean-Marc François (Google)"
-->

<!--
This post describes _configurable tolerance for horizontal Pod autoscaling_,
a new alpha feature first available in Kubernetes 1.33.
-->
這篇文章描述了**水平 Pod 自動擴縮的可設定容差**，
這是在 Kubernetes 1.33 中首次出現的一個新的 Alpha 特性。

<!--
## What is it?

[Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/)
is a well-known Kubernetes feature that allows your workload to
automatically resize by adding or removing replicas based on resource
utilization.
-->
## 它是什麼？

[水平 Pod 自動擴縮](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
是 Kubernetes 中一個衆所周知的特性，它允許你的工作負載根據資源利用率自動增減副本數量。

<!--
Let's say you have a web application running in a Kubernetes cluster with 50
replicas. You configure the Horizontal Pod Autoscaler (HPA) to scale based on
CPU utilization, with a target of 75% utilization. Now, imagine that the current
CPU utilization across all replicas is 90%, which is higher than the desired
75%. The HPA will calculate the required number of replicas using the formula:
-->
假設你在 Kubernetes 叢集中運行了一個具有 50 個副本的 Web 應用程式。
你設定了 Horizontal Pod Autoscaler （HPA）根據 CPU 利用率進行擴縮，
目標利用率 75%。現在，假設所有副本的當前 CPU 利用率爲 90%，
這高於預期的 75%。HPA 將使用以下公式計算所需的副本數量：

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
因此，HPA 將增加副本數量從 50 個提高到 60 個，以減少每個 Pod 的負載。
同樣，如果 CPU 利用率降至 75% 以下，HPA 會相應地減少副本數量。
Kubernetes 文檔提供了[擴縮算法的詳細描述](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)。

<!--
In order to avoid replicas being created or deleted whenever a small metric
fluctuation occurs, Kubernetes applies a form of hysteresis: it only changes the
number of replicas when the current and desired metric values differ by more
than 10%. In the example above, since the ratio between the current and desired
metric values is \\(90/75\\), or 20% above target, exceeding the 10% tolerance,
the scale-up action will proceed.
-->
爲了避免在指標發生小波動時創建或刪除副本，
Kubernetes 應用了一種遲滯形式：僅噹噹前和期望的指標值差異超過 10% 時，
才改變副本數量。在上面的例子中，因爲當前和期望的指標值比率是 \\(90/75\\)，
即超出目標 20%，超過了 10% 的容差，所以擴容操作將繼續進行。

<!--
This default tolerance of 10% is cluster-wide; in older Kubernetes releases, it
could not be fine-tuned. It's a suitable value for most usage, but too coarse
for large deployments, where a 10% tolerance represents tens of pods. As a
result, the community has long
[asked](https://github.com/kubernetes/kubernetes/issues/116984) to be able to
tune this value.

In Kubernetes v1.33, this is now possible.
-->
這個 10% 的預設容差是叢集範圍的；在舊版本的 Kubernetes 中，
它無法進行微調。對於大多數使用場景來說，這是一個合適的值，
但對於大型部署而言則過於粗糙，因爲 10% 的容差代表着數十個 Pod。
因此，社區長期以來[要求](https://github.com/kubernetes/kubernetes/issues/116984)能夠調整這個值。

在 Kubernetes v1.33 中，現在這已成爲可能。

<!--
## How do I use it?

After enabling the `HPAConfigurableTolerance`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) in
your Kubernetes v1.33 cluster, you can add your desired tolerance for your
HorizontalPodAutoscaler object.
-->
## 我如何使用它？

在你的 Kubernetes v1.33 叢集中啓用 `HPAConfigurableTolerance`
[特性門控][/zh-cn/docs/reference/command-line-tools-reference/feature-gates/]後，
你可以爲你的 HorizontalPodAutoscaler 對象添加期望的容差。

<!--
Tolerances appear under the `spec.behavior.scaleDown` and
`spec.behavior.scaleUp` fields and can thus be different for scale up and scale
down. A typical usage would be to specify a small tolerance on scale up (to
react quickly to spikes), but higher on scale down (to avoid adding and removing
replicas too quickly in response to small metric fluctuations).

For example, an HPA with a tolerance of 5% on scale-down, and no tolerance on
scale-up, would look like the following:
-->
容差出現在 `spec.behavior.scaleDown` 和 `spec.behavior.scaleUp`
字段下，因此對於擴容和縮容可以有不同的設置。一個典型的用法是在擴容時指定一個小的容差（以快速響應峯值），
而在縮容時指定較大的容差（以避免因小的指標波動而過快地添加或移除副本）。

例如，一個在縮容時有 5% 容差，在擴容時沒有容差的 HPA 設定如下所示：

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
## 所有細節

通過閱讀
[KEP-4951](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/4951-configurable-hpa-tolerance)
獲取所有技術細節，並關注 [Issue 4951](https://github.com/kubernetes/enhancements/issues/4951)
以獲得**特性畢業**的通知。
