---
layout: blog
title: "Kubernetes v1.32：內存管理器進階至 GA"
date: 2024-12-13
slug: memory-manager-goes-ga
author: >
  [Talor Itzhak](https://github.com/Tal-or) (Red Hat)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.32: Memory Manager Goes GA"
date: 2024-12-13
slug: memory-manager-goes-ga
author: >
  [Talor Itzhak](https://github.com/Tal-or) (Red Hat)
-->

<!--
With Kubernetes 1.32, the memory manager has officially graduated to General Availability (GA),
marking a significant milestone in the journey toward efficient and predictable memory allocation for containerized applications.
Since Kubernetes v1.22, where it graduated to beta, the memory manager has proved itself reliable, stable and a good complementary feature for the
[CPU Manager](/docs/tasks/administer-cluster/cpu-management-policies/).
-->
隨着 Kubernetes 1.32 的發佈，內存管理器已進階至正式發佈（GA），
這標誌着在爲容器化應用實現高效和可預測的內存分配的旅程中邁出了重要的一步。
內存管理器自 Kubernetes v1.22 進階至 Beta 後，其可靠性、穩定性已得到證實，
是 [CPU 管理器](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)的一個良好補充特性。

<!--
As part of kubelet's workload admission process, 
the memory manager provides topology hints 
to optimize memory allocation and alignment. 
This enables users to allocate exclusive
memory for Pods in the [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed) QoS class.
More details about the process can be found in the memory manager goes to beta [blog](/blog/2021/08/11/kubernetes-1-22-feature-memory-manager-moves-to-beta/).
-->
作爲 kubelet 的工作負載准入過程的一部分，內存管理器提供拓撲提示以優化內存分配和對齊。這使得使用者能夠爲
[Guaranteed](/zh-cn/docs/concepts/workloads/pods/pod-qos/#guaranteed) QoS 類的 Pod 分配獨佔的內存。
有關此過程的細節，參見博客：[內存管理器進階至 Beta](/blog/2021/08/11/kubernetes-1-22-feature-memory-manager-moves-to-beta/)。

<!--
Most of the changes introduced since the Beta are bug fixes, internal refactoring and 
observability improvements, such as metrics and better logging.
-->
自 Beta 以來引入的大部分變更是修復 Bug、內部重構以及改進可觀測性（例如優化指標和日誌）。

<!--
## Observability improvements

As part of the effort
to increase the observability of memory manager, new metrics have been added
to provide some statistics on memory allocation patterns.
-->
## 改進可觀測性   {#observability-improvements}

作爲提高內存管理器可觀測性工作的一部分，新增了一些指標以提供關於內存分配模式的某些統計資訊。

<!--
* **memory_manager_pinning_requests_total** -
tracks the number of times the pod spec required the memory manager to pin memory pages.

* **memory_manager_pinning_errors_total** - 
tracks the number of times the pod spec required the memory manager 
to pin memory pages, but the allocation failed.
-->
* **memory_manager_pinning_requests_total** -
  跟蹤 Pod 規約要求內存管理器鎖定內存頁的次數。

* **memory_manager_pinning_errors_total** -
  跟蹤 Pod 規約要求內存管理器鎖定內存頁但分配失敗的次數。

<!--
## Improving memory manager reliability and consistency

The kubelet does not guarantee pod ordering
when admitting pods after a restart or reboot.

In certain edge cases, this behavior could cause
the memory manager to reject some pods,
and in more extreme cases, it may cause kubelet to fail upon restart.
-->
## 提高內存管理器可靠性和一致性   {#improving-memory-manager-reliability-and-consistency}

kubelet 不保證在 Pod 重啓或重新引導後准入 Pod 的順序。

在某些邊緣情況下，這種行爲可能導致內存管理器拒絕某些 Pod，
在更極端的情況下，可能導致 kubelet 在重啓時失敗。

<!--
Previously, the beta implementation lacked certain checks and logic to prevent 
these issues.

To stabilize the memory manager for general availability (GA) readiness,
small but critical refinements have been
made to the algorithm, improving its robustness and handling of edge cases.
-->
以前，Beta 實現缺乏某些檢查和邏輯來防止這些問題的發生。

爲了使內存管理器更爲穩定，以便爲進階至正式發佈（GA）做好準備，
我們對算法進行了小而美的改進，提高了其穩健性和對邊緣場景的處理能力。

<!--
## Future development

There is more to come for the future of Topology Manager in general,
and memory manager in particular.
Notably, ongoing efforts are underway
to extend [memory manager support to Windows](https://github.com/kubernetes/kubernetes/pull/128560),
enabling CPU and memory affinity on a Windows operating system.
-->
## 未來發展   {#future-development}

總體而言，未來對拓撲管理器（Topology Manager），特別是內存管理器，會有更多特性推出。
值得一提的是，目前的工作重心是將[內存管理器支持擴展到 Windows](https://github.com/kubernetes/kubernetes/pull/128560)，
使得在 Windows 操作系統上實現 CPU 和內存親和性成爲可能。

<!--
## Getting involved

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md) community.
Please join us to connect with the community
and share your ideas and feedback around the above feature and
beyond.
We look forward to hearing from you!
-->
## 參與其中   {#getting-involved}

此特性由 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md)
社區推動。請加入我們，與社區建立聯繫，分享你對上述特性及其他方面的想法和反饋。
我們期待聽到你的聲音！
