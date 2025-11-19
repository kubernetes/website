---
title: 資源（基礎設施）
id: infrastructure-resource
date: 2025-02-09
short_description: >
  數量確定的可供使用的基礎設施（CPU、內存等）。

aka:
tags:
- architecture
---
<!--
title: Resource (infrastructure)
id: infrastructure-resource
date: 2025-02-09
short_description: >
  A defined amount of infrastructure available for consumption (CPU, memory, etc).

aka:
tags:
- architecture
-->

<!--
Capabilities provided to one or more {{< glossary_tooltip text="nodes" term_id="node" >}} (CPU, memory, GPUs, etc), and made available for consumption by
{{< glossary_tooltip text="Pods" term_id="pod" >}} running on those nodes.

Kubernetes also uses the term _resource_ to describe an {{< glossary_tooltip text="API resource" term_id="api-resource" >}}.
-->
提供給一個或多個{{< glossary_tooltip text="節點" term_id="node" >}}的能力（CPU、內存、GPU 等），
這些能力可以供這些節點上運行的 {{< glossary_tooltip text="Pod" term_id="pod" >}} 使用。

Kubernetes 也使用**資源**這個術語來描述 {{< glossary_tooltip text="API 資源" term_id="api-resource" >}}。

<!--more-->

<!--
Computers provide fundamental hardware facilities: processing power, storage memory, network, etc.
These resources have finite capacity, measured in a unit applicable to that resource (number of CPUs, bytes of memory, etc).
Kubernetes abstracts common [resources](/docs/concepts/configuration/manage-resources-containers/)
for allocation to workloads and utilizes operating system primitives (for example, Linux {{< glossary_tooltip text="cgroups" term_id="cgroup" >}}) to manage consumption by {{< glossary_tooltip text="workloads" term_id="workload" >}}).
-->
計算機提供基礎硬件設施：處理能力、存儲內存、網絡等。
這些資源的容量有限，每個資源具有合適的測量單位（CPU 個數、內存字節數等）。
Kubernetes 抽象出常見的[資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)分配給工作負載，
並利用操作系統的原語（例如 Linux {{< glossary_tooltip text="cgroup" term_id="cgroup" >}}）
來管理{{< glossary_tooltip text="工作負載" term_id="workload" >}}的使用。

<!--
You can also use [dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) to
manage complex resource allocations automatically.
-->
你也可以使用[動態資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)來自動管理複雜的資源分配。
