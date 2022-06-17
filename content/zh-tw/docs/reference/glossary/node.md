---
title: 節點（Node）
id: node
date: 2018-04-12
full_link: /zh-cn/docs/concepts/architecture/nodes/
short_description: >
  Kubernetes 中的工作機器稱作節點。

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
Kubernetes 中的工作機器稱作節點。

<!--more--> 

<!--
A worker node may be a VM or physical machine, depending on the cluster. It has local daemons or services necessary to run {{< glossary_tooltip text="Pods" term_id="pod" >}} and is managed by the control plane. The daemons on a node include {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, and a container runtime implementing the {{< glossary_tooltip text="CRI" term_id="cri" >}} such as {{< glossary_tooltip term_id="docker" >}}.

In early Kubernetes versions, Nodes were called "Minions".
-->
工作機器可以是虛擬機器也可以是物理機，取決於叢集的配置。
其上部署了執行 {{< glossary_tooltip text="Pods" term_id="pod" >}}
所必需的本地守護程序或服務，
並由主控元件來管理。
節點上的的守護程序包括 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}、
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}
以及一個 {{< glossary_tooltip term_id="docker" >}} 這種
實現了 {{< glossary_tooltip text="CRI" term_id="cri" >}}
的容器執行時。

在早期的 Kubernetes 版本中，節點也稱作 "Minions"。

