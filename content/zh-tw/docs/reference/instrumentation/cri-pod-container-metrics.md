---
title: CRI Pod 和容器指標
content_type: reference
weight: 50
description: >-
  通過 CRI 收集 Pod 和容器指標
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
metrics via the {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI). You
must enable the `PodAndContainerStatsFromCRI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and
use a compatible CRI implementation (containerd >= 1.6.0, CRI-O >= 1.23.0) to
use the CRI based collection mechanism.
-->
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 通過
[cAdvisor](https://github.com/google/cadvisor) 收集 Pod 和容器指標。作爲一個 Alpha 特性，
Kubernetes 允許你通過{{< glossary_tooltip term_id="cri" text="容器運行時介面">}}（CRI）
設定收集 Pod 和容器指標。要使用基於 CRI 的收集機制，你必須啓用 `PodAndContainerStatsFromCRI`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
並使用兼容的 CRI 實現（containerd >= 1.6.0, CRI-O >= 1.23.0）。

<!-- body -->

<!--
## CRI Pod & Container Metrics

With `PodAndContainerStatsFromCRI` enabled, the kubelet polls the underlying container
runtime for pod and container stats instead of inspecting the host system directly using cAdvisor.
The benefits of relying on the container runtime for this information as opposed to direct
collection with cAdvisor include:
-->
## CRI Pod 和容器指標   {#cri-pod-container-metrics}

當啓用 `PodAndContainerStatsFromCRI` 時，kubelet 輪詢底層容器運行時以獲取
Pod 和容器統計資訊，而不是直接使用 cAdvisor 檢查主機系統。同直接使用 cAdvisor
收集資訊相比，依靠容器運行時獲取這些資訊的好處包括：

<!--
- Potential improved performance if the container runtime already collects this information
  during normal operations. In this case, the data can be re-used instead of being aggregated
  again by the kubelet.
-->
- 潛在的性能改善，如果容器運行時在正常操作中已經收集了這些資訊。
  在這種情況下，這些資料可以被重用，而不是由 kubelet 再次進行聚合。

<!--
- It further decouples the kubelet and the container runtime allowing collection of metrics for
  container runtimes that don't run processes directly on the host with kubelet where they are
  observable by cAdvisor (for example: container runtimes that use virtualization).
-->
- 這種做法進一步解耦了 kubelet 和容器運行時。
  對於使用 kubelet 來在主機上運行進程的容器運行時，其行爲可用 cAdvisor 觀測；
  對於其他運行時（例如，使用虛擬化的容器運行時）而言，
  這種做法提供了允許收集容器運行時指標的可能性。
