---
layout: blog
title: "Kubernetes v1.37：Metrics API 进阶至稳定版"
slug: kubernetes-v1-37-metrics-api-ga
date: 2026-08-27T10:30:00-08:00
author: >
  [ChengHao Yang](https://github.com/tico88612)
translator: >
  [Paco Xu](https://github.com/pacoxu) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.37: Metrics API graduates to stable"
slug: kubernetes-v1-37-metrics-api-ga
date: 2026-08-27T10:30:00-08:00
author: >
  [ChengHao Yang](https://github.com/tico88612)
-->

<!--
Kubernetes v1.37 promotes the `metrics.k8s.io` API to stable (`v1`). This
API provides CPU and memory usage for nodes and Pods, and is the API behind
commands such as `kubectl top` and resource-metrics-based autoscaling.
-->
在 Kubernetes v1.37 中，`metrics.k8s.io` API 正式进入稳定阶段，版本为 `v1`。
该 API 提供节点和 Pod 的 CPU 和内存用量数据，供 `kubectl top`
等命令以及基于资源指标的自动扩缩容使用。

<!--
For cluster operators and application developers, this graduation means that
the API now has the stability guarantees associated with a Kubernetes stable
API. The `v1` API has the same resource types and fields as `v1beta1`; this is
an API-version graduation, not a change to the metrics that are collected or
returned.
-->
对集群运维人员和应用开发者而言，这意味着 Kubernetes 对稳定版 API
的稳定性承诺现在也适用于该 API。`v1` 与 `v1beta1` 的资源类型和字段完全相同；此次变更只涉及
API 版本的稳定级别，并未改变所收集或返回的指标。

<!--
## A long-lived API reaches stable
-->
## 沿用多年的 API 进入稳定阶段 {#a-long-lived-api-reaches-stable}

<!--
The resource Metrics API was introduced as alpha in Kubernetes v1.6 and became
beta in v1.8. It has remained unchanged and has been used in production for
years by clients including the HorizontalPodAutoscaler (HPA) and `kubectl top`.
Kubernetes v1.37 formally graduates that proven API to `metrics.k8s.io/v1`.
-->
资源指标 API 在 Kubernetes v1.6 中以 Alpha 状态引入，并在 v1.8 进入 Beta 阶段。
此后，该 API 的定义一直未变，并已在生产环境中使用多年；
HorizontalPodAutoscaler（HPA）控制器和 `kubectl top` 等客户端都依赖该 API。
经过多年生产环境验证后，该 API 在 Kubernetes v1.37 中正式进入稳定阶段（`metrics.k8s.io/v1`）。

<!--
The API exposes two resource types:

- `NodeMetrics`, for CPU and memory usage for a node.
- `PodMetrics`, for CPU and memory usage for a Pod, with a per-container
    breakdown in its `containers` field.
-->
该 API 提供以下两种资源类型：

- `NodeMetrics`：提供节点的 CPU 和内存用量。
- `PodMetrics`：提供 Pod 的 CPU 和内存用量，并在 `containers` 字段中列出各容器的用量明细。

<!--
The API remains intentionally small. It provides the resource metrics needed
for autoscaling and basic inspection; it is not a replacement for a full
monitoring pipeline or the custom metrics (`custom.metrics.k8s.io`) API.
-->
按照设计，该 API 的范围有意保持精简。
它只提供自动扩缩容和日常资源用量查看所需的指标，
不能替代完整的监控体系或自定义指标 API（`custom.metrics.k8s.io`）。

<!--
## What changed with the v1.37 release? {#changes}
-->
## v1.37 中有哪些变化？ {#changes}

<!--
The `v1` API surface is identical to `v1beta1`, except for the API version.
There are no renamed fields, new fields, or changes to the meaning of the
returned CPU and memory values.
-->
除 API 版本外，`v1` 与 `v1beta1` 的 API 定义完全相同。
没有字段被重命名或新增，返回的 CPU 和内存数值含义也没有变化。

<!--
For example, a client can retrieve node metrics from the stable endpoint:
-->
例如，客户端可以通过稳定版 API 端点获取节点指标：

```shell
kubectl get --raw /apis/metrics.k8s.io/v1/nodes
```

<!--
Likewise, it can retrieve metrics for the pods in a namespace:
-->
同样，客户端也可以获取某个命名空间内所有 Pod 的指标：

```shell
kubectl get --raw /apis/metrics.k8s.io/v1/namespaces/default/pods
```

<!--
`kubectl top` supports both API versions. It prefers `v1` when available and
automatically falls back to `v1beta1` on clusters that do not yet serve `v1`.
The HPA controller currently supports only `v1beta1`. Support for
discovery-based selection between `v1` and `v1beta1` is planned, but is not
available in Kubernetes v1.37.
-->
`kubectl top` 同时支持这两个 API 版本。`v1` 可用时，它会优先使用 `v1`；
如果集群尚未提供 `v1`，则自动回退到 `v1beta1`。
HPA 控制器目前仅支持 `v1beta1`。后续计划让它根据 API 发现结果在 `v1` 和
`v1beta1` 之间选择合适的版本，但 Kubernetes v1.37 尚未提供这一能力。

<!--
## What you need to do
-->
## 你需要做什么 {#what-you-need-to-do}

<!--
You don't need to enable any feature gate. The Metrics API is served through the
[API aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/),
by an implementation such as [metrics-server](https://github.com/kubernetes-sigs/metrics-server).
You can choose any implementation of `metrics.k8s.io`; for the v1 metrics API to be
available in your cluster, your chosen implementation must serve the `v1.metrics.k8s.io` API, and you need to [register](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) an associated [APIService](/docs/reference/kubernetes-api/apiregistration/api-service-v1/).
-->
无需启用任何特性门控。
Metrics API 由 [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
等实现通过 [API 聚合层](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)提供服务。
你可以选用 `metrics.k8s.io` 的任何实现。
要在集群中使用 v1 Metrics API，所选实现必须提供 `v1.metrics.k8s.io` API，
你还需要[注册](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)关联的
[APIService](/zh-cn/docs/reference/kubernetes-api/cluster-resources/api-service-v1/)。

<!--
During the transition, implementations should serve both `v1` and `v1beta1`.
Keeping both versions available maintains compatibility with older clients.
The `v1beta1` API remains available in Kubernetes v1.37.
-->
过渡期间，各实现应同时提供 `v1` 和 `v1beta1`，以确保兼容旧版客户端。
Kubernetes v1.37 仍然提供 `v1beta1` API。

<!--
You can see which versions your cluster serves with:
-->
可以通过以下命令查看集群当前提供哪些 API 版本：

```shell
kubectl get --raw /apis/metrics.k8s.io/ | jq .
```

<!--
Once your metrics implementation supports `v1`, you can also check that its
APIService is available:
-->
所选 Metrics API 实现支持 `v1` 后，还可以确认对应的 APIService 是否可用：

```shell
kubectl get apiservice v1.metrics.k8s.io
```

<!--
## Learn more
-->
## 了解更多 {#learn-more}

<!--
- Read the [Resource metrics pipeline](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
  documentation.
- Read [KEP-5207](https://www.kubernetes.dev/resources/keps/5207/), the proposal for (graduating) this API.
- Learn about the [Metrics API](https://github.com/kubernetes/metrics#resource-metrics-api)
  and its reference implementation, [metrics-server](https://github.com/kubernetes-sigs/metrics-server).
-->
- 阅读[资源指标管道](/zh-cn/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)文档。
- 阅读 [KEP-5207](https://www.kubernetes.dev/resources/keps/5207/)，了解该 API 进入稳定阶段的提案。
- 了解 [Metrics API](https://github.com/kubernetes/metrics#resource-metrics-api)
  及其参考实现 [metrics-server](https://github.com/kubernetes-sigs/metrics-server)。

<!--
## Get involved
-->
## 参与其中 {#get-involved}

<!--
The Metrics API is maintained by [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/).
To ask questions, share feedback, or contribute, join the
[#sig-instrumentation](https://kubernetes.slack.com/messages/sig-instrumentation)
channel on Kubernetes Slack or attend a SIG Instrumentation meeting.
-->
Metrics API 由 [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/) 维护。
如需提问、提供反馈或参与贡献，请加入 Kubernetes Slack 上的
[#sig-instrumentation](https://kubernetes.slack.com/messages/sig-instrumentation) 频道，
或参加 SIG Instrumentation 例会。
