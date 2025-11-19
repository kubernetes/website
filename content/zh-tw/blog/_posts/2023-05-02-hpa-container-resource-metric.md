---
layout: blog
title: "Kubernetes 1.27：HorizontalPodAutoscaler ContainerResource 類型指標進階至 Beta"
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

**譯者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
Kubernetes 1.20 introduced the [`ContainerResource` type metric](/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
in HorizontalPodAutoscaler (HPA).

In Kubernetes 1.27, this feature moves to beta and the corresponding feature gate (`HPAContainerMetrics`) gets enabled by default.
-->
Kubernetes 1.20 在 HorizontalPodAutoscaler (HPA) 中引入了
[`ContainerResource` 類型指標](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)。

在 Kubernetes 1.27 中，此特性進階至 Beta，相應的特性門控 (`HPAContainerMetrics`) 默認被啓用。

<!--
## What is the ContainerResource type metric

The ContainerResource type metric allows us to configure the autoscaling based on resource usage of individual containers.

In the following example, the HPA controller scales the target 
so that the average utilization of the cpu in the application container of all the pods is around 60%.
(See [the algorithm details](/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)
to know how the desired replica number is calculated exactly)
-->
## 什麼是 ContainerResource 類型指標

ContainerResource 類型指標允許我們根據各個容器的資源使用量來配置自動擴縮。

在下面的示例中，HPA 控制器擴縮目標，以便所有 Pod 的應用程序容器的 CPU 平均利用率約爲 60％
（請參見[算法詳情](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)以瞭解預期副本數的確切計算方式）。

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
## 與 Resource 類型指標的區別

HPA 已具有 [Resource 類型指標](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-resource-metrics)。

你可以定義如下的目標資源利用率，然後 HPA 將基於當前利用率擴縮副本。

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
但這個 Resource 類型指標指的是 **Pod** 的平均利用率。

如果一個 Pod 有多個容器，則利用率計算公式爲：

<!--
```
sum{the resource usage of each container} / sum{the resource request of each container}
```
-->
```
sum{每個容器的資源使用量} / sum{每個容器的資源請求}
```

<!--
The resource utilization of each container may not have a direct correlation or may grow at different rates as the load changes.
-->
每個容器的資源利用率可能沒有直接關係，或可能隨着負載變化而以不同的速度增長。

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

- 邊車容器僅提供日誌傳輸這類輔助服務。
  如果應用程序不經常記錄日誌或在其頻繁執行的路徑中不生成日誌，則日誌發送器的使用量不會增長。
- 提供身份驗證的邊車容器。由於重度緩存，當主要容器的負載增加時，使用量只會略微增加。
  在當前的混合用量計算方法中，這通常導致 HPA 不會對 Deployment 向上擴容，因爲混合的使用量仍然很低。
- 邊車可能在未設置資源的情況下被注入，這會阻止基於利用率進行擴縮。
  在當前的邏輯中，當未設置資源請求時，HPA 控制器只能根據 Pod 的絕對資源使用量進行擴縮。

<!--
And, in such case, if only one container's resource utilization goes high, 
the Resource type metric may not suggest scaling up.

So, for the accurate autoscaling, you may want to use the ContainerResource type metric for such Pods instead.
-->
在這種情況下，如果僅有一個容器的資源利用率增加，則 Resource 類型指標可能不會建議擴容。

因此，爲了實現準確的自動擴縮，你可能需要改爲使用 ContainerResource 類型指標來替代這些 Pod。

<!--
## What's new for the beta?

For Kubernetes v1.27, the ContainerResource type metric is available by default as described at the beginning
of this article.
(You can still disable it by the `HPAContainerMetrics` feature gate.)
-->
## Beta 版本有哪些新內容？

在 Kubernetes v1.27 中，正如本文開頭所述，ContainerResource 類型指標默認可用。
（你仍然可以通過 `HPAContainerMetrics` 特性門禁用它。）

<!--
Also, we've improved the observability of HPA controller by exposing some metrics from the kube-controller-manager:
- `metric_computation_total`: Number of metric computations. 
- `metric_computation_duration_seconds`: The time that the HPA controller takes to calculate one metric.
- `reconciliations_total`: Number of reconciliation of HPA controller. 
- `reconciliation_duration_seconds`: The time that the HPA controller takes to reconcile a HPA object once.
-->
另外，我們已通過從 kube-controller-manager 中公開一些指標來改進 HPA 控制器的可觀測性：

- `metric_computation_total`：指標計算的數量。
- `metric_computation_duration_seconds`：HPA 控制器計算一個指標所需的時間。
- `reconciliations_total`：HPA 控制器的協調次數。
- `reconciliation_duration_seconds`：HPA 控制器協調一次 HPA 對象所需的時間。

<!--
These metrics have labels `action` (`scale_up`, `scale_down`, `none`) and `error` (`spec`, `internal`, `none`).
And, in addition to them, the first two metrics have the `metric_type` label
which corresponds to `.spec.metrics[*].type` for a HorizontalPodAutoscaler.
-->
這些指標具有 `action`（`scale_up`、`scale_down`、`none`）和
`error`（`spec`、`internal`、`none`）標籤。
除此之外，前兩個指標還具有 `metric_type` 標籤，該標籤對應於
HorizontalPodAutoscaler 的 `.spec.metrics[*].type`。

<!--
All metrics are useful for general monitoring of HPA controller,
you can get deeper insight into which part has a problem, where it takes time, how much scaling tends to happen at which time on your cluster etc.
-->
所有指標都可用於 HPA 控制器的常規監控，你可以深入洞察哪部分存在問題，在哪裏耗時，
集羣在哪個時間傾向於發生多少次擴縮等問題。

<!--
Another minor stuff, we've changed the `SuccessfulRescale` event's messages
so that everyone can check whether the events came from the resource metric or
the container resource metric (See [the related PR](https://github.com/kubernetes/kubernetes/pull/116045)).
-->
另一件小事是，我們已更改了 `SuccessfulRescale` 事件的消息，
這樣每個人都可以檢查事件是否來自資源指標或容器資源指標
（請參見[相關 PR](https://github.com/kubernetes/kubernetes/pull/116045)）。

<!--
## Getting involved 

This feature is managed by [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling). 
Please join us and share your feedback. We look forward to hearing from you!
-->
## 參與其中

此特性由 [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling)
進行管理。請加入我們分享反饋。我們期待聆聽你的聲音！

<!--
## How can I learn more?

- [The official document of the ContainerResource type metric](/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
- [KEP-1610: Container Resource based Autoscaling](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/1610-container-resource-autoscaling)
-->
## 瞭解更多

- [ContainerResource 類型指標的正式文檔](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
- [KEP-1610：Container Resource based Autoscaling（基於容器資源的自動擴縮）](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/1610-container-resource-autoscaling)
