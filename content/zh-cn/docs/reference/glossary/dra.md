---
title: 动态资源分配
id: dra
date: 2025-05-13
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  Kubernetes 提供的一项特性，用于在 Pod 之间请求和共享资源，例如硬件加速器。

aka:
- DRA
tags:
- extension
---
<!--
title: Dynamic Resource Allocation
id: dra
date: 2025-05-13
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  A Kubernetes feature for requesting and sharing resources, like hardware
  accelerators, among Pods.

aka:
- DRA
tags:
- extension
-->

<!--
A Kubernetes feature that lets you request and share resources among Pods.
These resources are often attached
{{< glossary_tooltip text="devices" term_id="device" >}} like hardware
accelerators.
-->
Kubernetes 提供的一项特性，允许你在多个 Pod 之间请求和共享资源。  
这些资源通常是挂接的{{< glossary_tooltip text="设备" term_id="device" >}}，例如硬件加速器。

<!--more-->

<!--
With DRA, device drivers and cluster admins define device _classes_ that are
available to _claim_ in workloads. Kubernetes allocates matching devices to
specific claims and places the corresponding Pods on nodes that can access the
allocated devices.
-->
借助 DRA，设备驱动和集群管理员可以定义设备的**类别**，这些类别可供工作负载中的 Pod 申领。
Kubernetes 会将匹配的设备分配给特定的申领，并将相应的 Pod 调度到能够访问这些已分配设备的节点上。
