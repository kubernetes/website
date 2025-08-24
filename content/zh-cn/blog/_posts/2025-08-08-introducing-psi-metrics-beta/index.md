---
layout: blog
title: "Kubernetes 中的 PSI 指标进入 Beta 阶段"
date: 2025-XX-XX
draft: true
slug: introducing-psi-metrics-beta
author: "Haowei Cai (Google)"
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "PSI Metrics for Kubernetes Graduates to Beta"
date: 2025-XX-XX
draft: true
slug: introducing-psi-metrics-beta
author: "Haowei Cai (Google)"
-->

<!--
As Kubernetes clusters grow in size and complexity, understanding the health and performance of individual nodes becomes increasingly critical. We are excited to announce that as of Kubernetes v1.34, **Pressure Stall Information (PSI) Metrics** has graduated to Beta.
-->
随着 Kubernetes 集群规模和复杂性的增长，了解各个节点的健康状况和性能变得越来越关键。
我们很高兴地宣布，从 Kubernetes v1.34 开始，**压力停滞信息 (PSI) 指标**已升级到 Beta 版本。

<!--
## What is Pressure Stall Information (PSI)?
-->
## 什么是压力停滞信息 (PSI)？ {#what-is-pressure-stall-information-psi}

<!--
[Pressure Stall Information (PSI)](https://docs.kernel.org/accounting/psi.html) is a feature of the Linux kernel (version 4.20 and later)
that provides a canonical way to quantify pressure on infrastructure resources,
in terms of whether demand for a resource exceeds current supply.
It moves beyond simple resource utilization metrics and instead
measures the amount of time that tasks are stalled due to resource contention.
This is a powerful way to identify and diagnose resource bottlenecks that can impact application performance.
-->
[压力停滞信息 (PSI)](https://docs.kernel.org/accounting/psi.html) 是 Linux 内核（4.20 及更高版本）的一项功能，
它提供了一种规范化的方式来量化基础设施资源的压力，
即资源需求是否超过当前供应。
它超越了简单的资源利用率指标，而是测量任务因资源竞争而停滞的时间。
这是识别和诊断可能影响应用程序性能的资源瓶颈的强大方法。

<!--
PSI exposes metrics for CPU, memory, and I/O, categorized as either `some` or `full` pressure:
-->
PSI 暴露了 CPU、内存和 I/O 的指标，分为 `some` 或 `full` 压力：

<!--
`some`
: The percentage of time that **at least one** task is stalled on a resource. This indicates some level of resource contention.
-->
`some`
: **至少一个**任务在资源上停滞的时间百分比。这表明存在某种程度的资源竞争。

<!--
`full`
: The percentage of time that **all** non-idle tasks are stalled on a resource simultaneously. This indicates a more severe resource bottleneck.
{{< figure src="/images/psi-metrics-some-vs-full.svg" alt="Diagram illustrating the difference between 'some' and 'full' PSI pressure." title="PSI: 'Some' vs. 'Full' Pressure" >}}
-->
`full`
: **所有**非空闲任务同时在资源上停滞的时间百分比。这表明存在更严重的资源瓶颈。
{{< figure src="/images/psi-metrics-some-vs-full.svg" alt="展示 'some' 与 'full' PSI 压力差异的示意图。" title="PSI：'Some' 与 'Full' 压力对比" >}}

<!--
These metrics are aggregated over 10-second, 1-minute, and 5-minute rolling windows, providing a comprehensive view of resource pressure over time.
-->
这些指标在 10 秒、1 分钟和 5 分钟的滚动窗口上进行聚合，提供了随时间变化的资源压力的全面视图。

<!--
## PSI metrics in Kubernetes
-->
## Kubernetes 中的 PSI 指标 {#psi-metrics-in-kubernetes}

<!--
With the `KubeletPSI` feature gate enabled, the kubelet can now collect PSI metrics from the Linux kernel and expose them through two channels: the [Summary API](/docs/reference/instrumentation/node-metrics#summary-api-source) and the `/metrics/cadvisor` Prometheus endpoint. This allows you to monitor and alert on resource pressure at the node, pod, and container level.
-->
启用 `KubeletPSI` 特性门控后，kubelet 现在可以从 Linux 内核收集 PSI 指标，
并通过两个渠道暴露它们：[Summary API](/docs/reference/instrumentation/node-metrics#summary-api-source)
和 `/metrics/cadvisor` Prometheus 端点。这允许你在节点、Pod 和容器级别监控和告警资源压力。

<!--
The following new metrics are available in Prometheus exposition format via `/metrics/cadvisor`:
-->
以下新指标可通过 `/metrics/cadvisor` 以 Prometheus 暴露格式获得：
*   `container_pressure_cpu_stalled_seconds_total`
*   `container_pressure_cpu_waiting_seconds_total`
*   `container_pressure_memory_stalled_seconds_total`
*   `container_pressure_memory_waiting_seconds_total`
*   `container_pressure_io_stalled_seconds_total`
*   `container_pressure_io_waiting_seconds_total`

<!--
These metrics, along with the data from the Summary API, provide a granular view of resource pressure, enabling you to pinpoint the source of performance issues and take corrective action. For example, you can use these metrics to:
-->
这些指标与 Summary API 的数据一起，提供了资源压力的细粒度视图，
使你能够精确定位性能问题的根源并采取纠正措施。
例如，你可以使用这些指标来：

<!--
*   **Identify memory leaks:** A steadily increasing `some` pressure for memory can indicate a memory leak in an application.
-->
*   **识别内存泄漏：** 内存的 `some` 压力持续增加可能表明应用程序中存在内存泄漏。

<!--
*   **Optimize resource requests and limits:** By understanding the resource pressure of your workloads, you can more accurately tune their resource requests and limits.
-->
*   **优化资源请求和限制：** 通过了解你的工作负载的资源压力，你可以更准确地调整其资源请求和限制。

<!--
*   **Autoscale workloads:** You can use PSI metrics to trigger autoscaling events, ensuring that your workloads have the resources they need to perform optimally.
-->
*   **自动扩缩容工作负载：** 你可以使用 PSI 指标触发自动扩缩容事件，确保你的工作负载拥有最佳性能所需的资源。

<!--
## How to enable PSI metrics
-->
## 如何启用 PSI 指标 {#how-to-enable-psi-metrics}

<!--
To enable PSI metrics in your Kubernetes cluster, you need to:
-->
要在你的 Kubernetes 集群中启用 PSI 指标，你需要：

<!--
1.  **Ensure your nodes are running a Linux kernel version 4.20 or later and are using cgroup v2.**
-->
1.  **确保你的节点运行 Linux 内核版本 4.20 或更高版本，并使用 cgroup v2。**

<!--
2.  **Enable the `KubeletPSI` feature gate on the kubelet.**
-->
2.  **在 kubelet 上启用 `KubeletPSI` 特性门控。**

<!--
Once enabled, you can start scraping the `/metrics/cadvisor` endpoint with your Prometheus-compatible monitoring solution or query the Summary API to collect and visualize the new PSI metrics. Note that PSI is a Linux-kernel feature, so these metrics are not available on Windows nodes. Your cluster can contain a mix of Linux and Windows nodes, and on the Windows nodes the kubelet does not expose PSI metrics.
-->
启用后，你可以开始使用 Prometheus 兼容的监控解决方案抓取 `/metrics/cadvisor` 端点，
或查询 Summary API 来收集和可视化新的 PSI 指标。
请注意，PSI 是 Linux 内核功能，因此这些指标在 Windows 节点上不可用。
你的集群可以包含 Linux 和 Windows 节点的混合，在 Windows 节点上，kubelet 不会暴露 PSI 指标。

<!--
## What's next?
-->
## 接下来是什么？ {#whats-next}

<!--
We are excited to bring PSI metrics to the Kubernetes community and look forward to your feedback. As a beta feature, we are actively working on improving and extending this functionality towards a stable GA release. We encourage you to try it out and share your experiences with us.
-->
我们很高兴为 Kubernetes 社区带来 PSI 指标，并期待你的反馈。
作为 Beta 功能，我们正在积极改进和扩展此功能，以实现稳定的 GA 发布。
我们鼓励你试用并与我们分享你的经验。

<!--
To learn more about PSI metrics, check out the official [Kubernetes documentation](/docs/reference/instrumentation/understand-psi-metrics/). You can also get involved in the conversation on the [#sig-node](https://kubernetes.slack.com/messages/sig-node) Slack channel.
-->
要了解有关 PSI 指标的更多信息，请查看官方 [Kubernetes 文档](/docs/reference/instrumentation/understand-psi-metrics/)。
你还可以参与 [#sig-node](https://kubernetes.slack.com/messages/sig-node) Slack 频道的对话。
