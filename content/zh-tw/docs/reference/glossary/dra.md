---
title: 動態資源分配
id: dra
date: 2025-05-13
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  Kubernetes 提供的一項特性，用於在 Pod 之間請求和共享資源，例如硬件加速器。

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
Kubernetes 提供的一項特性，允許你在多個 Pod 之間請求和共享資源。  
這些資源通常是掛接的{{< glossary_tooltip text="設備" term_id="device" >}}，例如硬件加速器。

<!--more-->

<!--
With DRA, device drivers and cluster admins define device _classes_ that are
available to _claim_ in workloads. Kubernetes allocates matching devices to
specific claims and places the corresponding Pods on nodes that can access the
allocated devices.
-->
藉助 DRA，設備驅動和集羣管理員可以定義設備的**類別**，這些類別可供工作負載中的 Pod 申領。
Kubernetes 會將匹配的設備分配給特定的申領，並將相應的 Pod 調度到能夠訪問這些已分配設備的節點上。
