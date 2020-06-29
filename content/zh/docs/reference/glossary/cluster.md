---
title: 集群
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   集群由一组被称作节点的机器组成。这些节点上运行 Kubernetes 所管理的容器化应用。集群具有至少一个工作节点和至少一个主节点。 

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
   A set of machines, called nodes, that run containerized applications managed by Kubernetes. A cluster has at least one worker node and at least one master node. 

aka: 
tags:
- fundamental
- operation
--- 
-->

<!-- A set of machines, called nodes, that run containerized applications managed by Kubernetes. A cluster has at least one worker node and at least one master node.  -->
集群由一组被称作节点的机器组成。这些节点上运行 Kubernetes 所管理的容器化应用。集群具有至少一个工作节点和至少一个主节点。

<!--more-->
<!-- The worker node(s) host the pods that are the components of the application. The master node(s) manages the worker nodes and the pods in the cluster. Multiple master nodes are used to provide a cluster with failover and high availability. -->
工作节点托管作为应用程序组件的 Pod 。主节点管理集群中的工作节点和 Pod 。多个主节点用于为集群提供故障转移和高可用性。
