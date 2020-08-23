---
title: 节点
id: node
date: 2018-04-12
full_link: /zh/docs/concepts/architecture/nodes/
short_description: >
  Kubernetes 中的工作机器称作节点。

aka: 
tags:
- fundamental
---

<!--
title: Node
id: node
date: 2018-04-12
full_link: /zh/docs/concepts/architecture/nodes/
short_description: >
  A node is a worker machine in Kubernetes.

aka: 
tags:
- fundamental
-->

<!--
  A node is a worker machine in Kubernetes.
-->

Kubernetes 中的工作机器称作节点。

<!--more--> 

<!--
A worker machine may be a VM or physical machine, depending on the cluster. It has the {{< glossary_tooltip text="Services" term_id="service" >}} necessary to run {{< glossary_tooltip text="Pods" term_id="pod" >}} and is managed by the master components. The {{< glossary_tooltip text="Services" term_id="service" >}} on a node include Docker, kubelet and kube-proxy.
-->

工作机器可以是虚拟机也可以是物理机，取决于集群的配置。
其上部署了运行 {{< glossary_tooltip text="Pods" term_id="pod" >}} 所必需的{{< glossary_tooltip text="服务" term_id="service" >}}，
并由主控组件来管理。
节点上的{{< glossary_tooltip text="服务" term_id="service" >}}包括 Docker、kubelet 和 kube-proxy。

