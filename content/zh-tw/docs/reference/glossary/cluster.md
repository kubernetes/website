---
title: 叢集（Cluster）
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   一組工作機器，稱爲節點，會運行容器化應用程序。每個叢集至少有一個工作節點。

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
一組工作機器，稱爲{{< glossary_tooltip text="節點" term_id="node" >}}，
會運行容器化應用程序。每個叢集至少有一個工作節點。

<!--more-->

<!-- 
The worker node(s) host the {{< glossary_tooltip text="Pods" term_id="pod" >}} that are
the components of the application workload. The
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} manages the worker
nodes and the Pods in the cluster. In production environments, the control plane usually
runs across multiple computers and a cluster usually runs multiple nodes, providing
fault-tolerance and high availability.
-->
工作節點會託管 {{< glossary_tooltip text="Pod" term_id="pod" >}}，而 Pod 就是作爲應用負載的組件。
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}管理叢集中的工作節點和 Pod。
在生產環境中，控制平面通常跨多臺計算機運行，
一個叢集通常運行多個節點，提供容錯性和高可用性。
