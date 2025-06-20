---
layout: blog
title: "Kubernetes v1.32：内存管理器进阶至 GA"
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
随着 Kubernetes 1.32 的发布，内存管理器已进阶至正式发布（GA），
这标志着在为容器化应用实现高效和可预测的内存分配的旅程中迈出了重要的一步。
内存管理器自 Kubernetes v1.22 进阶至 Beta 后，其可靠性、稳定性已得到证实，
是 [CPU 管理器](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)的一个良好补充特性。

<!--
As part of kubelet's workload admission process, 
the memory manager provides topology hints 
to optimize memory allocation and alignment. 
This enables users to allocate exclusive
memory for Pods in the [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed) QoS class.
More details about the process can be found in the memory manager goes to beta [blog](/blog/2021/08/11/kubernetes-1-22-feature-memory-manager-moves-to-beta/).
-->
作为 kubelet 的工作负载准入过程的一部分，内存管理器提供拓扑提示以优化内存分配和对齐。这使得用户能够为
[Guaranteed](/zh-cn/docs/concepts/workloads/pods/pod-qos/#guaranteed) QoS 类的 Pod 分配独占的内存。
有关此过程的细节，参见博客：[内存管理器进阶至 Beta](/blog/2021/08/11/kubernetes-1-22-feature-memory-manager-moves-to-beta/)。

<!--
Most of the changes introduced since the Beta are bug fixes, internal refactoring and 
observability improvements, such as metrics and better logging.
-->
自 Beta 以来引入的大部分变更是修复 Bug、内部重构以及改进可观测性（例如优化指标和日志）。

<!--
## Observability improvements

As part of the effort
to increase the observability of memory manager, new metrics have been added
to provide some statistics on memory allocation patterns.
-->
## 改进可观测性   {#observability-improvements}

作为提高内存管理器可观测性工作的一部分，新增了一些指标以提供关于内存分配模式的某些统计信息。

<!--
* **memory_manager_pinning_requests_total** -
tracks the number of times the pod spec required the memory manager to pin memory pages.

* **memory_manager_pinning_errors_total** - 
tracks the number of times the pod spec required the memory manager 
to pin memory pages, but the allocation failed.
-->
* **memory_manager_pinning_requests_total** -
  跟踪 Pod 规约要求内存管理器锁定内存页的次数。

* **memory_manager_pinning_errors_total** -
  跟踪 Pod 规约要求内存管理器锁定内存页但分配失败的次数。

<!--
## Improving memory manager reliability and consistency

The kubelet does not guarantee pod ordering
when admitting pods after a restart or reboot.

In certain edge cases, this behavior could cause
the memory manager to reject some pods,
and in more extreme cases, it may cause kubelet to fail upon restart.
-->
## 提高内存管理器可靠性和一致性   {#improving-memory-manager-reliability-and-consistency}

kubelet 不保证在 Pod 重启或重新引导后准入 Pod 的顺序。

在某些边缘情况下，这种行为可能导致内存管理器拒绝某些 Pod，
在更极端的情况下，可能导致 kubelet 在重启时失败。

<!--
Previously, the beta implementation lacked certain checks and logic to prevent 
these issues.

To stabilize the memory manager for general availability (GA) readiness,
small but critical refinements have been
made to the algorithm, improving its robustness and handling of edge cases.
-->
以前，Beta 实现缺乏某些检查和逻辑来防止这些问题的发生。

为了使内存管理器更为稳定，以便为进阶至正式发布（GA）做好准备，
我们对算法进行了小而美的改进，提高了其稳健性和对边缘场景的处理能力。

<!--
## Future development

There is more to come for the future of Topology Manager in general,
and memory manager in particular.
Notably, ongoing efforts are underway
to extend [memory manager support to Windows](https://github.com/kubernetes/kubernetes/pull/128560),
enabling CPU and memory affinity on a Windows operating system.
-->
## 未来发展   {#future-development}

总体而言，未来对拓扑管理器（Topology Manager），特别是内存管理器，会有更多特性推出。
值得一提的是，目前的工作重心是将[内存管理器支持扩展到 Windows](https://github.com/kubernetes/kubernetes/pull/128560)，
使得在 Windows 操作系统上实现 CPU 和内存亲和性成为可能。

<!--
## Getting involved

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md) community.
Please join us to connect with the community
and share your ideas and feedback around the above feature and
beyond.
We look forward to hearing from you!
-->
## 参与其中   {#getting-involved}

此特性由 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md)
社区推动。请加入我们，与社区建立联系，分享你对上述特性及其他方面的想法和反馈。
我们期待听到你的声音！
