---
title: 节点（Node）
id: node
date: 2018-04-12
full_link: /zh-cn/docs/concepts/architecture/nodes/
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
full_link: /zh-cn/docs/concepts/architecture/nodes/
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
A worker node may be a VM or physical machine, depending on the cluster. It has local daemons or services necessary to run {{< glossary_tooltip text="Pods" term_id="pod" >}} and is managed by the control plane. The daemons on a node include {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, and a container runtime implementing the {{< glossary_tooltip text="CRI" term_id="cri" >}} such as {{< glossary_tooltip term_id="docker" >}}.

In early Kubernetes versions, Nodes were called "Minions".
-->
工作机器可以是虚拟机也可以是物理机，取决于集群的配置。
其上部署了运行 {{< glossary_tooltip text="Pods" term_id="pod" >}}
所必需的本地守护进程或服务，并由主控组件来管理。
节点上的守护进程包括 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}、
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}
以及一个 {{< glossary_tooltip term_id="docker" >}} 这种
实现了 {{< glossary_tooltip text="CRI" term_id="cri" >}}
的容器运行时。

在早期的 Kubernetes 版本中，节点也称作 "Minions"。
