---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /zh-cn/docs/reference/command-line-tools-reference/kubelet
short_description: >
  一個在叢集中每個節點上運行的代理。它保證容器都運行在 Pod 中。

aka:
tags:
- fundamental
---
<!--
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kubelet
short_description: >
  An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.

aka:
tags:
- fundamental
-->

<!--
 An agent that runs on each {{< glossary_tooltip text="node" term_id="node" >}} in the cluster. It makes sure that {{< glossary_tooltip text="containers" term_id="container" >}} are running in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.
-->
`kubelet` 會在叢集中每個{{< glossary_tooltip text="節點（node）" term_id="node" >}}上運行。
它保證{{< glossary_tooltip text="容器（containers）" term_id="container" >}}都運行在
{{< glossary_tooltip text="Pod" term_id="pod" >}} 中。

<!--more-->

<!--
The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) takes a set of PodSpecs that 
are provided through various mechanisms and ensures that the containers described in those 
PodSpecs are running and healthy. The kubelet doesn't manage containers which were not created by 
Kubernetes.
-->
[kubelet](/docs/reference/command-line-tools-reference/kubelet/)
接收一組通過各類機制提供給它的 PodSpec，確保這些 PodSpec 中描述的容器處於運行狀態且健康。
kubelet 不會管理不是由 Kubernetes 創建的容器。

