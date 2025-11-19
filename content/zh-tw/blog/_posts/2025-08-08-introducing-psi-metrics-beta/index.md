---
layout: blog
title: "Kubernetes 中的 PSI 指標進入 Beta 階段"
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
隨着 Kubernetes 叢集規模和複雜性的增長，瞭解各個節點的健康狀況和性能變得越來越關鍵。
我們很高興地宣佈，從 Kubernetes v1.34 開始，**壓力停滯信息 (PSI) 指標**已升級到 Beta 版本。

<!--
## What is Pressure Stall Information (PSI)?
-->
## 什麼是壓力停滯信息 (PSI)？ {#what-is-pressure-stall-information-psi}

<!--
[Pressure Stall Information (PSI)](https://docs.kernel.org/accounting/psi.html) is a feature of the Linux kernel (version 4.20 and later)
that provides a canonical way to quantify pressure on infrastructure resources,
in terms of whether demand for a resource exceeds current supply.
It moves beyond simple resource utilization metrics and instead
measures the amount of time that tasks are stalled due to resource contention.
This is a powerful way to identify and diagnose resource bottlenecks that can impact application performance.
-->
[壓力停滯信息 (PSI)](https://docs.kernel.org/accounting/psi.html) 是 Linux 內核（4.20 及更高版本）的一項功能，
它提供了一種規範化的方式來量化基礎設施資源的壓力，
即資源需求是否超過當前供應。
它超越了簡單的資源利用率指標，而是測量任務因資源競爭而停滯的時間。
這是識別和診斷可能影響應用程序性能的資源瓶頸的強大方法。

<!--
PSI exposes metrics for CPU, memory, and I/O, categorized as either `some` or `full` pressure:
-->
PSI 暴露了 CPU、內存和 I/O 的指標，分爲 `some` 或 `full` 壓力：

<!--
`some`
: The percentage of time that **at least one** task is stalled on a resource. This indicates some level of resource contention.
-->
`some`
: **至少一個**任務在資源上停滯的時間百分比。這表明存在某種程度的資源競爭。

<!--
`full`
: The percentage of time that **all** non-idle tasks are stalled on a resource simultaneously. This indicates a more severe resource bottleneck.
{{< figure src="/images/psi-metrics-some-vs-full.svg" alt="Diagram illustrating the difference between 'some' and 'full' PSI pressure." title="PSI: 'Some' vs. 'Full' Pressure" >}}
-->
`full`
: **所有**非空閒任務同時在資源上停滯的時間百分比。這表明存在更嚴重的資源瓶頸。
{{< figure src="/images/psi-metrics-some-vs-full.svg" alt="展示 'some' 與 'full' PSI 壓力差異的示意圖。" title="PSI：'Some' 與 'Full' 壓力對比" >}}

<!--
These metrics are aggregated over 10-second, 1-minute, and 5-minute rolling windows, providing a comprehensive view of resource pressure over time.
-->
這些指標在 10 秒、1 分鐘和 5 分鐘的滾動窗口上進行聚合，提供了隨時間變化的資源壓力的全面視圖。

<!--
## PSI metrics in Kubernetes
-->
## Kubernetes 中的 PSI 指標 {#psi-metrics-in-kubernetes}

<!--
With the `KubeletPSI` feature gate enabled, the kubelet can now collect PSI metrics from the Linux kernel and expose them through two channels: the [Summary API](/docs/reference/instrumentation/node-metrics#summary-api-source) and the `/metrics/cadvisor` Prometheus endpoint. This allows you to monitor and alert on resource pressure at the node, pod, and container level.
-->
啓用 `KubeletPSI` 特性門控後，kubelet 現在可以從 Linux 內核收集 PSI 指標，
並通過兩個渠道暴露它們：[Summary API](/docs/reference/instrumentation/node-metrics#summary-api-source)
和 `/metrics/cadvisor` Prometheus 端點。這允許你在節點、Pod 和容器級別監控和告警資源壓力。

<!--
The following new metrics are available in Prometheus exposition format via `/metrics/cadvisor`:
-->
以下新指標可通過 `/metrics/cadvisor` 以 Prometheus 暴露格式獲得：
*   `container_pressure_cpu_stalled_seconds_total`
*   `container_pressure_cpu_waiting_seconds_total`
*   `container_pressure_memory_stalled_seconds_total`
*   `container_pressure_memory_waiting_seconds_total`
*   `container_pressure_io_stalled_seconds_total`
*   `container_pressure_io_waiting_seconds_total`

<!--
These metrics, along with the data from the Summary API, provide a granular view of resource pressure, enabling you to pinpoint the source of performance issues and take corrective action. For example, you can use these metrics to:
-->
這些指標與 Summary API 的數據一起，提供了資源壓力的細粒度視圖，
使你能夠精確定位性能問題的根源並採取糾正措施。
例如，你可以使用這些指標來：

<!--
*   **Identify memory leaks:** A steadily increasing `some` pressure for memory can indicate a memory leak in an application.
-->
*   **識別內存泄漏：** 內存的 `some` 壓力持續增加可能表明應用程序中存在內存泄漏。

<!--
*   **Optimize resource requests and limits:** By understanding the resource pressure of your workloads, you can more accurately tune their resource requests and limits.
-->
*   **優化資源請求和限制：** 通過了解你的工作負載的資源壓力，你可以更準確地調整其資源請求和限制。

<!--
*   **Autoscale workloads:** You can use PSI metrics to trigger autoscaling events, ensuring that your workloads have the resources they need to perform optimally.
-->
*   **自動擴縮容工作負載：** 你可以使用 PSI 指標觸發自動擴縮容事件，確保你的工作負載擁有最佳性能所需的資源。

<!--
## How to enable PSI metrics
-->
## 如何啓用 PSI 指標 {#how-to-enable-psi-metrics}

<!--
To enable PSI metrics in your Kubernetes cluster, you need to:
-->
要在你的 Kubernetes 叢集中啓用 PSI 指標，你需要：

<!--
1.  **Ensure your nodes are running a Linux kernel version 4.20 or later and are using cgroup v2.**
-->
1.  **確保你的節點運行 Linux 內核版本 4.20 或更高版本，並使用 cgroup v2。**

<!--
2.  **Enable the `KubeletPSI` feature gate on the kubelet.**
-->
2.  **在 kubelet 上啓用 `KubeletPSI` 特性門控。**

<!--
Once enabled, you can start scraping the `/metrics/cadvisor` endpoint with your Prometheus-compatible monitoring solution or query the Summary API to collect and visualize the new PSI metrics. Note that PSI is a Linux-kernel feature, so these metrics are not available on Windows nodes. Your cluster can contain a mix of Linux and Windows nodes, and on the Windows nodes the kubelet does not expose PSI metrics.
-->
啓用後，你可以開始使用 Prometheus 兼容的監控解決方案抓取 `/metrics/cadvisor` 端點，
或查詢 Summary API 來收集和可視化新的 PSI 指標。
請注意，PSI 是 Linux 內核功能，因此這些指標在 Windows 節點上不可用。
你的叢集可以包含 Linux 和 Windows 節點的混合，在 Windows 節點上，kubelet 不會暴露 PSI 指標。

<!--
## What's next?
-->
## 接下來是什麼？ {#whats-next}

<!--
We are excited to bring PSI metrics to the Kubernetes community and look forward to your feedback. As a beta feature, we are actively working on improving and extending this functionality towards a stable GA release. We encourage you to try it out and share your experiences with us.
-->
我們很高興爲 Kubernetes 社區帶來 PSI 指標，並期待你的反饋。
作爲 Beta 功能，我們正在積極改進和擴展此功能，以實現穩定的 GA 發佈。
我們鼓勵你試用並與我們分享你的經驗。

<!--
To learn more about PSI metrics, check out the official [Kubernetes documentation](/docs/reference/instrumentation/understand-psi-metrics/). You can also get involved in the conversation on the [#sig-node](https://kubernetes.slack.com/messages/sig-node) Slack channel.
-->
要了解有關 PSI 指標的更多信息，請查看官方 [Kubernetes 文檔](/docs/reference/instrumentation/understand-psi-metrics/)。
你還可以參與 [#sig-node](https://kubernetes.slack.com/messages/sig-node) Slack 頻道的對話。
