---
title: "服务、负载均衡和联网"
weight: 60
description: Kubernetes 网络背后的概念和资源。
---

<!--
Kubernetes networking addresses four concerns:
- Containers within a Pod use networking to communicate via loopback.
- Cluster networking provides communication between different Pods.
- The Service resource lets you expose an application running in Pods to be reachable from outside your cluster.
- You can also use Services to publish services only for consumption inside your cluster.
-->

Kubernetes 网络解决四方面的问题：
- 一个 Pod 中的容器之间通过本地回路（loopback）通信。
- 集群网络在不同 pod 之间提供通信。
- Service 资源允许你对外暴露 Pods 中运行的应用程序，以支持来自于集群外部的访问。
- 可以使用 Services 来发布仅供集群内部使用的服务。