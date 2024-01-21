---
title: 集群（Cluster）
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   一组工作机器，称为节点，会运行容器化应用程序。每个集群至少有一个工作节点。

aka: 
tags:
- fundamental
- operation
---
<!-- 
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
-->

<!-- 
A set of worker machines, called {{< glossary_tooltip text="nodes" term_id="node" >}},
that run containerized applications. Every cluster has at least one worker node.
-->
一组工作机器，称为{{< glossary_tooltip text="节点" term_id="node" >}}，
会运行容器化应用程序。每个集群至少有一个工作节点。

<!--more-->

<!-- 
The worker node(s) host the {{< glossary_tooltip text="Pods" term_id="pod" >}} that are
the components of the application workload. The
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} manages the worker
nodes and the Pods in the cluster. In production environments, the control plane usually
runs across multiple computers and a cluster usually runs multiple nodes, providing
fault-tolerance and high availability.
-->
工作节点会托管 {{< glossary_tooltip text="Pod" term_id="pod" >}}，而 Pod 就是作为应用负载的组件。
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}管理集群中的工作节点和 Pod。
在生产环境中，控制平面通常跨多台计算机运行，
一个集群通常运行多个节点，提供容错性和高可用性。
