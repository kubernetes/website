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

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}
<!--
The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) collects pod and
container metrics via [cAdvisor](https://github.com/google/cadvisor). As an alpha feature,
Kubernetes lets you configure the collection of pod and container
metrics via the {{< glossary_tooltip term_id="container-runtime-interface" text="Container Runtime Interface">}} (CRI). You
must enable the `PodAndContainerStatsFromCRI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and
use a compatible CRI implementation (containerd >= 1.6.0, CRI-O >= 1.23.0) to
use the CRI based collection mechanism.
-->
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 通过
[cAdvisor](https://github.com/google/cadvisor) 收集 Pod 和容器指标。作为一个 Alpha 特性，
Kubernetes 允许你通过{{< glossary_tooltip term_id="container-runtime-interface" text="容器运行时接口">}}（CRI）
配置收集 Pod 和容器指标。要使用基于 CRI 的收集机制，你必须启用 `PodAndContainerStatsFromCRI`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
并使用兼容的 CRI 实现（containerd >= 1.6.0, CRI-O >= 1.23.0）。 

<!-- body -->

<!--
## CRI Pod & Container Metrics

With `PodAndContainerStatsFromCRI` enabled, the kubelet polls the underlying container
runtime for pod and container stats instead of inspecting the host system directly using cAdvisor.
The benefits of relying on the container runtime for this information as opposed to direct
collection with cAdvisor include:
-->
## CRI Pod 和容器指标   {#cri-pod-container-metrics}

当启用 `PodAndContainerStatsFromCRI` 时，Kubelet 轮询底层容器运行时以获取
Pod 和容器统计信息，而不是直接使用 cAdvisor 检查主机系统。同直接使用 cAdvisor
收集信息相比，依靠容器运行时获取这些信息的好处包括：

<!--
- Potential improved performance if the container runtime already collects this information
  during normal operations. In this case, the data can be re-used instead of being aggregated
  again by the kubelet.
-->
- 潜在的性能改善，如果容器运行时在正常操作中已经收集了这些信息。
  在这种情况下，这些数据可以被重用，而不是由 Kubelet 再次进行聚合。

<!--
- It further decouples the kubelet and the container runtime allowing collection of metrics for
  container runtimes that don't run processes directly on the host with kubelet where they are
  observable by cAdvisor (for example: container runtimes that use virtualization).
-->
- 这种做法进一步解耦了 Kubelet 和容器运行时。
  对于使用 Kubelet 来在主机上运行进程的容器运行时，其行为可用 cAdvisor 观测；
  对于其他运行时（例如，使用虚拟化的容器运行时）而言，
  这种做法提供了允许收集容器运行时指标的可能性。
