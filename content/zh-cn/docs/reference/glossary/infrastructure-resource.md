---
title: 资源（基础设施）
id: infrastructure-resource
date: 2025-02-09
short_description: >
  数量确定的可供使用的基础设施（CPU、内存等）。

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
提供给一个或多个{{< glossary_tooltip text="节点" term_id="node" >}}的能力（CPU、内存、GPU 等），
这些能力可以供这些节点上运行的 {{< glossary_tooltip text="Pod" term_id="pod" >}} 使用。

Kubernetes 也使用**资源**这个术语来描述 {{< glossary_tooltip text="API 资源" term_id="api-resource" >}}。

<!--more-->

<!--
Computers provide fundamental hardware facilities: processing power, storage memory, network, etc.
These resources have finite capacity, measured in a unit applicable to that resource (number of CPUs, bytes of memory, etc).
Kubernetes abstracts common [resources](/docs/concepts/configuration/manage-resources-containers/)
for allocation to workloads and utilizes operating system primitives (for example, Linux {{< glossary_tooltip text="cgroups" term_id="cgroup" >}}) to manage consumption by {{< glossary_tooltip text="workloads" term_id="workload" >}}).
-->
计算机提供基础硬件设施：处理能力、存储内存、网络等。
这些资源的容量有限，每个资源具有合适的测量单位（CPU 个数、内存字节数等）。
Kubernetes 抽象出常见的[资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)分配给工作负载，
并利用操作系统的原语（例如 Linux {{< glossary_tooltip text="cgroup" term_id="cgroup" >}}）
来管理{{< glossary_tooltip text="工作负载" term_id="workload" >}}的使用。

<!--
You can also use [dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) to
manage complex resource allocations automatically.
-->
你也可以使用[动态资源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)来自动管理复杂的资源分配。
