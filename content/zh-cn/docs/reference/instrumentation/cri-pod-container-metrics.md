---
title: CRI Pod 和容器指标
content_type: reference
weight: 50
description: >-
  通过 CRI 收集 Pod 和容器指标
---
<!--
title: CRI Pod & Container Metrics
content_type: reference
weight: 50
description: >-
  Collection of Pod & Container metrics via the CRI.
-->

<!-- overview -->

{{< feature-state feature_gate_name="PodAndContainerStatsFromCRI" >}}

<!--
The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) collects pod and
container metrics via [cAdvisor](https://github.com/google/cadvisor). As a beta feature,
Kubernetes lets you configure the collection of pod and container
metrics via the {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI). You
must enable the `PodAndContainerStatsFromCRI`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and
use a compatible CRI implementation (containerd >= 2.2, CRI-O >= 1.31.0) to
use the CRI based collection mechanism.
-->
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 通过
[cAdvisor](https://github.com/google/cadvisor) 收集 Pod 和容器指标。作为一个 Beta 特性，
Kubernetes 允许你通过{{< glossary_tooltip term_id="cri" text="容器运行时接口">}}（CRI）
配置收集 Pod 和容器指标。要使用基于 CRI 的收集机制，你必须启用 `PodAndContainerStatsFromCRI`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
并使用兼容的 CRI 实现（containerd >= 2.2, CRI-O >= 1.31.0）。

<!-- body -->

<!--
## CRI Pod & Container Metrics

With `PodAndContainerStatsFromCRI` enabled, the kubelet polls the underlying container
runtime for pod and container stats instead of inspecting the host system directly using cAdvisor.
The benefits of relying on the container runtime for this information as opposed to direct
collection with cAdvisor include:
-->
## CRI Pod 和容器指标   {#cri-pod-container-metrics}

当启用 `PodAndContainerStatsFromCRI` 时，kubelet 轮询底层容器运行时以获取
Pod 和容器统计信息，而不是直接使用 cAdvisor 检查主机系统。同直接使用 cAdvisor
收集信息相比，依靠容器运行时获取这些信息的好处包括：

<!--
- Potential improved performance if the container runtime already collects this information
  during normal operations. In this case, the data can be re-used instead of being aggregated
  again by the kubelet.
-->
- 潜在的性能改善，如果容器运行时在正常操作中已经收集了这些信息。
  在这种情况下，这些数据可以被重用，而不是由 kubelet 再次进行聚合。

<!--
- It further decouples the kubelet and the container runtime allowing collection of metrics for
  container runtimes that don't run processes directly on the host with kubelet where they are
  observable by cAdvisor (for example: container runtimes that use virtualization).
-->
- 这种做法进一步解耦了 kubelet 和容器运行时。
  对于使用 kubelet 来在主机上运行进程的容器运行时，其行为可用 cAdvisor 观测；
  对于其他运行时（例如，使用虚拟化的容器运行时）而言，
  这种做法提供了允许收集容器运行时指标的可能性。

{{< note >}}
<!--
As of Kubernetes v1.37, cAdvisor-based pod and container metrics collection in the kubelet is
deprecated. CRI runtimes that do not support the required metrics will lose pod and container
level metrics collection when this feature reaches general availability (GA).
-->
从 Kubernetes v1.37 起，kubelet 中基于 cAdvisor 的 Pod 和容器指标收集已被弃用。
当此特性达到正式发布（GA）阶段时，不支持所需指标的 CRI 运行时将失去 Pod 和容器级别的指标收集能力。
{{< /note >}}

<!--
## Affected endpoints

When the feature gate is enabled, the kubelet queries the CRI runtime for pod and container
level data instead of cAdvisor. Node-level and image filesystem stats continue to be collected
from cAdvisor. The following endpoints are affected:
-->
## 受影响的端点 {#affected-endpoints}

当特性门控启用时，kubelet 会向 CRI 运行时查询 Pod 和容器级别的数据，而非使用 cAdvisor。
节点级别和镜像文件系统的统计信息仍从 cAdvisor 收集。以下端点受到影响：

<!--
### Summary API (`/stats/summary`)

The kubelet fetches pod and container stats from the CRI runtime instead of cAdvisor for the
[Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/). This includes CPU, memory,
network, and process stats for pods and containers.
-->
### Summary API（`/stats/summary`）

kubelet 从 CRI 运行时而非 cAdvisor 获取 Pod 和容器统计信息，用于
[Summary API](/zh-cn/docs/reference/config-api/kubelet-stats.v1alpha1/)。
这包括 Pod 和容器的 CPU、内存、网络和进程统计信息。

<!--
### `/metrics/cadvisor`

The kubelet queries the CRI runtime for pod and container metrics via the
`ListPodSandboxMetrics` RPC and serves them on the `/metrics/cadvisor` endpoint. This replaces
the cAdvisor-based collection at the pod and container level while preserving the same endpoint
path and metric names. Node and machine-level metrics on this endpoint continue to be served by
cAdvisor.
-->
### `/metrics/cadvisor`

kubelet 通过 `ListPodSandboxMetrics` RPC 向 CRI 运行时查询 Pod 和容器指标，
并在 `/metrics/cadvisor` 端点上提供这些指标。这取代了 Pod 和容器级别上基于 cAdvisor 的收集，
同时保留了相同的端点路径和指标名称。此端点上的节点和机器级别指标继续由 cAdvisor 提供。

<!--
## Identifying the active metrics provider

The kubelet exposes a `kubelet_metrics_provider` metric with a `provider` label set to either
`cri` or `cadvisor`. You can use this metric to verify which source is actively providing
pod and container stats on a given node.
-->
## 标识活跃的指标提供者 {#identifying-the-active-metrics-provider}

kubelet 暴露了一个 `kubelet_metrics_provider` 指标，其 `provider` 标签设置为
`cri` 或 `cadvisor`。你可以使用此指标来验证在给定节点上是哪个来源正在活跃地提供
Pod 和容器统计信息。

<!--
## Requirements

To use CRI-based metrics collection, you need:
-->
## 要求 {#requirements}

要使用基于 CRI 的指标收集，你需要：

<!--
- **containerd** version 2.2 or later, or **CRI-O** version 1.31.0 or later
- The `PodAndContainerStatsFromCRI`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled on the
  kubelet
-->
- **containerd** 2.2 或更高版本，或 **CRI-O** 1.31.0 或更高版本
- 在 kubelet 上启用 `PodAndContainerStatsFromCRI`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)

{{< note >}}
<!--
CRI-O added `namespace`, `pod`, and `container` labels to CRI metrics on the
`/metrics/cadvisor` endpoint starting in release 1.36.3. Earlier versions do not include
these labels, which may affect metric queries that rely on them to match
cAdvisor-produced metrics.
-->
CRI-O 从 1.36.3 版本开始，在 `/metrics/cadvisor` 端点上为 CRI 指标添加了 `namespace`、
`pod` 和 `container` 标签。更早的版本不包含这些标签，这可能会影响依赖它们来匹配
cAdvisor 生成的指标的查询。
{{< /note >}}

<!--
## Fallback behavior

If the CRI runtime does not report the expected metrics, the kubelet falls back to using
cAdvisor for pod and container stats collection, even when the feature gate is enabled. You
can disable the feature gate with a kubelet restart to fully revert to cAdvisor-based
collection.
-->
## 回退行为 {#fallback-behavior}

如果 CRI 运行时未报告预期的指标，即使特性门控已启用，kubelet 也会回退到使用 cAdvisor
进行 Pod 和容器统计信息收集。你可以通过重启 kubelet 来禁用特性门控，从而完全恢复到基于
cAdvisor 的收集方式。
