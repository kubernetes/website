---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/generated/kubelet
short_description: >
  一个在集群中每个节点上运行的代理。它保证容器都运行在 Pod 中。

aka: 
tags:
- fundamental
- core-object
---
<!--
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/generated/kubelet
short_description: >
  An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.

aka: 
tags:
- fundamental
- core-object
-->

<!--
 An agent that runs on each {{< glossary_tooltip text="node" term_id="node" >}} in the cluster. It makes sure that {{< glossary_tooltip text="containers" term_id="container" >}} are running in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.
-->
一个在集群中每个{{< glossary_tooltip text="节点（node）" term_id="node" >}}上运行的代理。
它保证{{< glossary_tooltip text="容器（containers）" term_id="container" >}}都
运行在 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中。

<!--more--> 

<!--
The kubelet takes a set of PodSpecs that are provided through various mechanisms and ensures that the containers described in those PodSpecs are running and healthy. The kubelet doesn't manage containers which were not created by Kubernetes.
-->
kubelet 接收一组通过各类机制提供给它的 PodSpecs，确保这些 PodSpecs
中描述的容器处于运行状态且健康。
kubelet 不会管理不是由 Kubernetes 创建的容器。

