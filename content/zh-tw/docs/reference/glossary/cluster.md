---
title: 叢集（Cluster）
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   叢集由一組被稱作節點的機器組成。這些節點上執行 Kubernetes 所管理的容器化應用。叢集具有至少一個工作節點。

aka: 
tags:
- fundamental
- operation
---

<!-- 
---
title: Cluster
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   A set of worker machines, called nodes, that run containerized applications. Every cluster has at least one worker node.

aka: 
tags:
- fundamental
- operation
--- 
-->

<!-- 
A set of worker machines, called {{< glossary_tooltip text="nodes" term_id="node" >}},
that run containerized applications. Every cluster has at least one worker node.
-->
叢集是由一組被稱作{{< glossary_tooltip text="節點（node）" term_id="node" >}}的機器組成，
這些節點上會執行由 Kubernetes 所管理的容器化應用。
且每個叢集至少有一個工作節點。
<!--more-->
<!-- 
The worker node(s) host the {{< glossary_tooltip text="Pods" term_id="pod" >}} that are
the components of the application workload. The
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} manages the worker
nodes and the Pods in the cluster. In production environments, the control plane usually
runs across multiple computers and a cluster usually runs multiple nodes, providing
fault-tolerance and high availability.
-->
工作節點會託管所謂的 Pods，而 Pod 就是作為應用負載的元件。
控制平面管理叢集中的工作節點和 Pods。
為叢集提供故障轉移和高可用性，
這些控制平面一般跨多主機執行，而叢集也會跨多個節點執行。
