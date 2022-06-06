---
title: 集群（Cluster）
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   集群由一组被称作节点的机器组成。这些节点上运行 Kubernetes 所管理的容器化应用。集群具有至少一个工作节点。 

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
集群是由一组被称作节点的机器组成，这些节点上会运行由 Kubernetes 所管理的容器化应用。
且每个集群至少有一个工作节点。

<!--more-->
<!-- 
The worker node(s) host the {{< glossary_tooltip text="Pods" term_id="pod" >}} that are
the components of the application workload. The
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} manages the worker
nodes and the Pods in the cluster. In production environments, the control plane usually
runs across multiple computers and a cluster usually runs multiple nodes, providing
fault-tolerance and high availability.
-->
工作节点会托管所谓的 Pods，而 Pod 就是作为应用负载的组件。
控制平面管理集群中的工作节点和 Pods。
为集群提供故障转移和高可用性，
这些控制平面一般跨多主机运行，而集群也会跨多个节点运行。
