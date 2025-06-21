---
title: Resource (infrastructure)
id: infrastructure-resource
date: 2025-02-09
short_description: >
  A defined amount of infrastructure available for consumption (CPU, memory, etc).

aka:
tags:
- architecture
---
Capabilities provided to one or more {{< glossary_tooltip text="nodes" term_id="node" >}} (CPU, memory, GPUs, etc), and made available for consumption by
{{< glossary_tooltip text="Pods" term_id="pod" >}} running on those nodes.

Kubernetes also uses the term _resource_ to describe an {{< glossary_tooltip text="API resource" term_id="api-resource" >}}.

<!--more-->
Computers provide fundamental hardware facilities: processing power, storage memory, network, etc.
These resources have finite capacity, measured in a unit applicable to that resource (number of CPUs, bytes of memory, etc).
Kubernetes abstracts common [resources](/docs/concepts/configuration/manage-resources-containers/)
for allocation to workloads and utilizes operating system primitives (for example, Linux {{< glossary_tooltip text="cgroups" term_id="cgroup" >}}) to manage consumption by {{< glossary_tooltip text="workloads" term_id="workload" >}}).

You can also use [dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) to
manage complex resource allocations automatically.
