---
title: 容器运行时接口（Container Runtime Interface；CRI）
id: cri
date: 2019-03-07
full_link: /zh-cn/docs/concepts/overview/components/#container-runtime
short_description: >
  一组与 kubelet 集成的容器运行时 API 


aka:
tags:
- fundamental
---
<!--
title: Container runtime interface (CRI)
id: cri
date: 2019-03-07
full_link: /docs/concepts/overview/components/#container-runtime
short_description: >
    An API for container runtimes to integrate with kubelet


aka:
tags:
- fundamental
-->

<!--
The container runtime interface (CRI) is an API for container runtimes
to integrate with {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on a node.
-->
容器运行时接口（Container Runtime Interface；CRI）是一组让容器运行时与节点上
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 集成的 API。

<!--more-->

<!--
For more information, see the [CRI](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md) API and specifications.
-->
更多信息，请参考[容器运行时接口（CRI）](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)
API 与规范。

