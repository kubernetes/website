---
layout: blog
title: "Kubernetes v1.36：Kubernetes PSI 指标升级到 GA"
date: 2026-05-12T10:35:00-08:00
slug: kubernetes-v1-36-psi-metrics-ga
author: "Maria Fernanda Romano Silva (Google Cloud)"
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: PSI Metrics for Kubernetes Graduates to GA"
date: 2026-05-12T10:35:00-08:00
slug: kubernetes-v1-36-psi-metrics-ga
author: "Maria Fernanda Romano Silva (Google Cloud)"
---
-->

<!--
Since its original implementation in the Linux kernel in 2018,
_Pressure Stall Information_ (PSI) has provided users
with the high-fidelity signals needed to identify resource saturation before it becomes an outage.
Unlike traditional utilization metrics, PSI tells the story of tasks stalled and time lost, all in nicely-packaged percentages of time across the CPU, memory, and I/O.
-->
自 2018 年在 Linux 内核中首次实现以来，
**Pressure Stall Information**（PSI）为用户提供了在资源饱和演变为停机之前识别它所需的高保真信号。
与传统的利用率指标不同，PSI 以 CPU、内存和 I/O 的时间百分比形式，清晰地展示了任务停滞和时间损失的情况。

<!--
With the recent release of Kubernetes v1.36, users across the ecosystem have a stable, reliable interface to observe resource contention at the node, pod, and container levels. In this post, we will dive into the improvements and performance testing that proved its readiness for production.
-->
随着 Kubernetes v1.36 的发布，生态系统中的用户现在拥有一个稳定、可靠的接口，
可在节点、Pod 和容器级别观察资源竞争情况。在本文中，我们将深入探讨证明其已准备好投入生产的改进和性能测试。

<!--
## Beyond utilization: why PSI?
-->
## 超越利用率：为什么选择 PSI？

<!--
Monitoring CPU or memory usage alone can be misleading. A node may report XX% (below 100%) CPU utilization while certain tasks are experiencing severe latency due to scheduling delays. PSI fills this gap by providing:
* **Cumulative Totals**: Absolute time spent in a stalled state.
* **Moving Averages**: 10s, 60s, and 300s windows that allow operators to distinguish between transient spikes and sustained resource tension.
-->
仅监控 CPU 或内存使用情况可能会产生误导。一个节点可能报告 XX%（低于 100%）的 CPU 利用率，
而某些任务却因调度延迟而经历严重延迟。PSI 通过提供以下信息填补了这一空白：
* **累计总计**：处于停滞状态的绝对时间。
* **移动平均值**：10 秒、60 秒和 300 秒的窗口，允许运维人员区分瞬时峰值和持续的资源紧张。

<!--
## Proving stability: performance testing at scale
-->
## 证明稳定性：大规模性能测试

<!--
A common concern when graduating telemetry features is the resource overhead required to collect and serve the metrics. To address this, SIG Node conducted extensive performance validation on high-density workloads (80+ pods) across various machine types.
-->
遥测功能升级时的一个常见担忧是收集和提供指标所需的资源开销。
为解决此问题，SIG Node 对各种机器类型上的高密度工作负载（80+ Pod）进行了广泛的性能验证。

<!--
Our testing focused on two primary scenarios to isolate the impact of the Kubelet and kernel-level collection respectively:
1. **Kernel PSI ON / Kubelet Feature OFF** vs **Kernel PSI ON / Kubelet Feature ON** (Kubelet overhead)
2. **Kernel PSI OFF / Kubelet Feature ON** vs **Kernel PSI ON / Kubelet Feature ON** (Kernel overhead)
-->
我们的测试集中在两个主要场景，分别隔离 kubelet 和内核级别的收集影响：
1. **Kernel PSI ON / kubelet Feature OFF** 对比 **Kernel PSI ON / kubelet Feature ON**（kubelet 开销）
2. **Kernel PSI OFF / kubelet Feature ON** 对比 **Kernel PSI ON / kubelet Feature ON**（内核开销）

<!--
#### Scenario 1: The Kubelet Overhead
First, we looked at the kubelet usage on 4 core machines (Case 1). For these, the Linux kernel was already tracking pressure on both clusters by default(`psi=1`), but we toggled the `KubeletPSI` feature gate to see if the Kubelet actively querying and exposing these metrics impacted the resource usage. The synchronized bursts seen in the graph are practically identical in both magnitude and frequency, confirming that the Kubelet's collection logic is highly lightweight and blends seamlessly into standard housekeeping cycles. There is no issue about the feature affecting the pre-existing resource use, staying within the normal 0.1 cores or **2.5% of the total node capacity**, and is therefore safe for production-scale deployments.

{{< figure src="/images/kubeletPSI_kubelet_cpu_usage_rate_graph.png" alt="A line graph comparing the kubelet CPU usage rate over elapsed time with the Kubelet PSI feature turned off versus on and kernel PSI always on." title="(Case 1) Kubelet CPU Usage Rate Comparison" caption="Figure 2: Kubelet CPU Usage Rate Comparison." >}} 
-->
#### 场景 1：kubelet 开销

首先，我们查看了 4 核机器上的 kubelet 使用情况（案例 1）。
对于这些机器，Linux 内核默认已经在两个集群上跟踪压力（`psi=1`），
但我们切换了 `KubeletPSI` 特性门控，以查看 kubelet 主动查询和暴露这些指标是否会影响资源使用。
图表中看到的同步突发在幅度和频率上几乎完全相同，证实了 kubelet 的收集逻辑非常轻量级，
可以无缝融入标准的内务处理周期。
该特性不会影响现有的资源使用，保持在正常的 0.1 核或**节点总容量的 2.5%** 以内，
因此对于生产规模的部署是安全的。

{{< figure src="/images/kubeletPSI_kubelet_cpu_usage_rate_graph.png" alt="比较 Kubelet PSI 特性关闭与开启（内核 PSI 始终开启）时，kubelet CPU 使用率随时间变化的折线图。" title="（案例 1）kubelet CPU 使用率对比" caption="图 2：kubelet CPU 使用率对比。" >}} 

<!--
Next, we evaluated the system overhead in the same run. As seen in the following graph, the **System CPU** usage lines for the Kubelet PSI-enabled (red) follows the same pattern as the Kubelet PSI-disabled (blue) clusters, with a slight expected increase from the baseline. This visualizes that once the OS is tracking PSI, at around **2.5 cores**, the act of Kubernetes reading those cgroup metrics is negligible to performance. 

{{< figure src="/images/kubeletPSI_sys_cpu_usage_rate_graph.png" alt="A line graph comparing the system CPU usage rate over elapsed time with the PSI feature turned off versus on and kernel PSI default ON." title="(Case 1) System CPU Usage Rate Comparison" caption="Figure 1: Node System CPU Usage Rate Comparison." >}}
-->
接下来，我们在同一运行中评估了系统开销。
如下列图表所示，启用 Kubelet PSI（红色）的 **System CPU** 使用率曲线与禁用
kubelet PSI（蓝色）的集群遵循相同模式，比基线略有预期的增加。
这表明一旦操作系统跟踪 PSI（约 **2.5 核**），
Kubernetes 读取这些 CGroup 指标的行为对性能的影响可以忽略不计。

{{< figure src="/images/kubeletPSI_sys_cpu_usage_rate_graph.png" alt="比较 PSI 特性关闭与开启（内核 PSI 默认开启）时，系统 CPU 使用率随时间变化的折线图。" title="（案例 1）系统 CPU 使用率对比" caption="图 1：节点系统 CPU 使用率对比。" >}}

<!--
#### Scenario 2: The Kernel Overhead
Shifting gears, we evaluated the underlying overhead of enabling PSI on the Linux kernel also on a 4 core machine. By comparing a cluster booted with `psi=1` (COS default) against a cluster with `psi=0`, we isolated the exact cost of the OS-level bookkeeping. Even under heavy I/O and CPU load at an 80-pod density, the **System CPU** delta between the kernel-enabled and kernel-disabled clusters remained consistently between **0.037 cores** and **0.125 cores** or **0.925% - 3.125%** of the total node capacity. There was a single spike to **0.225 cores**, or **5.6%**, but was controlled back down within a few seconds. This confirms that the internal kernel tracking is highly efficient under load.

{{< figure src="/images/node_sys_cpu_usage_rate_comparison.png" alt="A line graph comparing the Node System (Kernel) CPU usage rate with Kernel PSI ON and OFF over elapsed time." title="(Case 2) Node System CPU Usage Rate Comparison" caption="Figure 3: Node System CPU Usage Rate Comparison." >}}
-->
#### 场景 2：内核开销

换个角度，我们在 4 核机器上评估了在 Linux 内核上启用 PSI 的底层开销。
通过比较使用 `psi=1`（COS 默认值）启动的集群与使用 `psi=0` 的集群，
我们分离出了操作系统级簿记的确切成本。即使在 80 Pod 密度下的繁重 I/O 和 CPU 负载下，
启用内核和禁用内核的集群之间的 **System CPU** 差异始终保持在 **0.037 核** 到 **0.125 核** 之间，
即节点总容量的 **0.925% - 3.125%**。有一次峰值达到 **0.225 核**（即 **5.6%**），
但在几秒钟内就被控制下来。这证实了内核内部跟踪在负载下非常高效。

{{< figure src="/images/node_sys_cpu_usage_rate_comparison.png" alt="比较内核 PSI 开启和关闭时，节点系统（内核）CPU 使用率随时间变化的折线图。" title="（案例 2）节点系统 CPU 使用率对比" caption="图 3：节点系统 CPU 使用率对比。" >}}

<!--
Figure 4 zooms in on the kubelet process itself, which serves as the primary collector for these metrics. . The results show that even while the kubelet performs periodic _sweeps_ to aggregate data from the cgroup hierarchy, its CPU usage remains remarkably low with interchangeable spikes and nothing exceeding **0.25 cores** or **6.25%** of total capacity for longer than a second.

{{< figure src="/images/kubelet_cpu_usage_rate_comparison.png" alt="A line graph comparing the kubelet CPU usage rate over elapsed time with the Kernel PSI feature turned off versus on." title="(Case 2) Kubelet CPU Usage Rate Comparison" caption="Figure 4: Kubelet CPU Usage Rate Comparison." >}}
-->
图 4 放大了 kubelet 进程本身，它是这些指标的主要收集器。
结果表明，即使 kubelet 定期执行**扫描**以从 CGroup 层次结构聚合数据，
其 CPU 使用率仍然非常低，峰值可互换，且没有任何峰值超过 **0.25 核** 或总容量的 **6.25%** 超过一秒。

{{< figure src="/images/kubelet_cpu_usage_rate_comparison.png" alt="比较内核 PSI 特性关闭与开启时，kubelet CPU 使用率随时间变化的折线图。" title="（案例 2）kubelet CPU 使用率对比" caption="图 4：kubelet CPU 使用率对比。" >}}

<!--
## Improvements between beta (1.34) and stable (1.36)
-->
## Beta（1.34）到 Stable（1.36）之间的改进

<!--
- **Smarter Metric Emission for GA:** We improved how the Kubelet handles underlying OS support for PSI. Previously, if the feature was enabled in Kubernetes but the underlying Linux kernel didn't support PSI (`psi=0`), the Kubelet would emit misleading zero-valued metrics. These could trigger false alarms when read as real metrics instead of missing values. In v1.36, the Kubelet now detects OS-level PSI support via cgroup configurations before reporting. This ensures that pressure metrics are only collected and emitted when they are actually supported by the node, providing cleaner data for monitoring and alerting systems.
-->
- **GA 的智能指标发布：**我们改进了 kubelet 处理底层操作系统对 PSI 支持的方式。
  以前，如果在 Kubernetes 中启用了该特性，但底层 Linux 内核不支持 PSI（`psi=0`），
  kubelet 会发布误导性的零值指标。当这些指标被当作真实指标而不是缺失值读取时，可能会触发误报。
  在 v1.36 中，kubelet 现在会在报告之前通过 CGroup 配置检测操作系统级别的 PSI 支持。
  这确保了压力指标仅在节点实际支持时才被收集和发布，为监控和告警系统提供更清晰的数据。

<!--
## Getting started
-->
## 入门指南

<!--
To use PSI metrics in your Kubernetes cluster, your nodes must meet the following requirements:

1. **Ensure your nodes are running a Linux kernel version 4.20 or later and are using cgroup v2.**
2. **Ensure PSI is enabled at the OS level** (your kernel must be compiled with `CONFIG_PSI=y` and must not be booted with the `psi=0` parameter).
-->
要在你的 Kubernetes 集群中使用 PSI 指标，你的节点必须满足以下要求：

1. **确保你的节点运行 Linux 内核版本 4.20 或更高版本，并使用 CGroup v2。**
2. **确保在操作系统级别启用 PSI**（你的内核必须使用 `CONFIG_PSI=y` 编译，并且不得使用 `psi=0` 参数启动）。

<!--
As of v1.36, Kubelet PSI metrics are generally available and you do not need to opt in to any feature gate. 
-->
从 v1.36 开始，Kubelet PSI 指标已普遍可用，你无需选择加入任何特性门控。

<!--
Once the OS prerequisites are met, you can start scraping the `/metrics/cadvisor` endpoint with your Prometheus-compatible monitoring solution or query the Summary API to collect and visualize the new PSI metrics. Note that PSI is a Linux-kernel feature, so these metrics are not available on Windows nodes. Your cluster can contain a mix of Linux and Windows nodes, and on the Windows nodes, the kubelet will simply omit the PSI metrics.
-->
满足操作系统先决条件后，你可以开始使用兼容 Prometheus 的监控解决方案抓取 `/metrics/cadvisor` 端点，
或查询 Summary API 来收集和可视化新的 PSI 指标。
请注意，PSI 是 Linux 内核特性，因此这些指标在 Windows 节点上不可用。
你的集群可以包含 Linux 和 Windows 节点的混合，在 Windows 节点上，kubelet 将简单地省略 PSI 指标。

<!--
If your cluster is running a recent enough version of Kubernetes and you are a privileged node administrator, you can also proxy to the kubelet's HTTP API via the control plane's API server to see real-time pressure data from the Summary API. 

> **Caution:** Proxying to the kubelet is a privileged operation. Granting access to it is a security risk, so ensure you have the appropriate administrative permissions before executing these commands.
-->
如果你的集群运行的是足够新的 Kubernetes 版本，并且你是特权节点管理员，
你还可以通过控制平面的 API 服务器代理到 kubelet 的 HTTP API，
以从 Summary API 查看实时压力数据。

> **注意：**代理到 kubelet 是一项特权操作。授予访问权限存在安全风险，
因此在执行这些命令之前，请确保你拥有适当的管理权限。

```bash
CONTAINER_NAME="example-container"
kubectl get --raw "/api/v1/nodes/$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')/proxy/stats/summary" | jq '.pods[].containers[] | select(.name=="'"$CONTAINER_NAME"'") | {name, cpu: .cpu.psi, memory: .memory.psi, io: .io.psi}'
```

<!--
## Further reading
-->
## 进一步阅读

<!--
If you want to dive deeper into how these metrics are calculated and exposed, check out these resources:
1. [The official Kernel documentation](https://docs.kernel.org/accounting/psi.html)
2. [Understanding PSI](/docs/reference/instrumentation/understand-psi-metrics/) in the Kubernetes documentation
3. [cAdvisor Metrics Implementation](https://github.com/google/cadvisor/blob/master/metrics/prometheus.go) 
-->
如果你想深入了解这些指标是如何计算和暴露的，请查看以下资源：
1. [官方内核文档](https://docs.kernel.org/accounting/psi.html)
2. Kubernetes 文档中的 [Understanding PSI](/zh-cn/docs/reference/instrumentation/understand-psi-metrics/)
3. [cAdvisor Metrics Implementation](https://github.com/google/cadvisor/blob/master/metrics/prometheus.go)

<!--
## Acknowledgements
-->
## 致谢

<!--
Support for PSI metrics was developed through the collaborative efforts of [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/). Special thanks to all contributors who helped design, implement, test, review, and document this feature across its journey from alpha in v1.33, through beta in v1.34, to GA in v1.36.

To provide feedback on this feature, join the [Kubernetes Node Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-node), participate in discussions on the [public Slack channel](http://slack.k8s.io/) (#sig-node), or file an issue on [GitHub](https://github.com/kubernetes/kubernetes/issues).
-->
PSI 指标的支持是通过 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/)
的协作努力开发的。特别感谢所有在该特性从 v1.33 的 Alpha、v1.34 的 Beta 到 v1.36 的 GA
整个过程中帮助设计、实现、测试、审查和文档化的贡献者。

要为此特性提供反馈，请加入 [Kubernetes Node 特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-node)，
参与[公共 Slack 频道](http://slack.k8s.io/)（#sig-node）上的讨论，
或在 [GitHub](https://github.com/kubernetes/kubernetes/issues) 上提交 Issue。

<!--
## Feedback
-->
## 反馈

<!--
If you have feedback and want to share your experience using this feature, join the discussion:

- [SIG Node community page](https://github.com/kubernetes/community/tree/master/sig-node)
- [Kubernetes Slack](http://slack.k8s.io/) in the #sig-node channel
- [SIG Node mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)

SIG Node would love to hear about your experiences using this feature in production!
-->
如果你有反馈并想分享使用此特性的经验，请加入讨论：

- [SIG Node 社区页面](https://github.com/kubernetes/community/tree/master/sig-node)
- [Kubernetes Slack](http://slack.k8s.io/) 的 #sig-node 频道
- [SIG Node 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)

SIG Node 很想了解你在生产中使用此特性的经验！
