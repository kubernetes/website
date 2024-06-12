---
title: 边车容器
id: sidecar-container
date: 2018-04-12
full_link: 
short_description: >
  在 Pod 的整个生命期内保持运行的辅助容器。

full_link: /zh-cn/docs/concepts/workloads/pods/sidecar-containers/
tags:
- fundamental
---

<!--
title: Sidecar Container
id: sidecar-container
date: 2018-04-12
full_link: 
short_description: >
  An auxilliary container that stays running throughout the lifecycle of a Pod.

full_link: /docs/concepts/workloads/pods/sidecar-containers/
tags:
- fundamental
-->

<!--
One or more {{< glossary_tooltip text="containers" term_id="container" >}} that are typically started before any app containers run.
-->
通常在任意应用容器运行之前启动的一个或多个{{< glossary_tooltip text="容器" term_id="container" >}}。

<!--more--> 

<!--
Sidecar containers are like regular app containers, but with a different purpose: 
the sidecar provides a Pod-local service to the main app container.
Unlike {{< glossary_tooltip text="init containers" term_id="init-container" >}}, sidecar containers
continue running after Pod startup.

Read [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) for more information.
-->
边车容器与常规应用容器类似，但目的不同：边车为主应用容器提供了一个 Pod 内的本地服务。
与{{< glossary_tooltip text="Init 容器" term_id="init-container" >}}不同，边车容器在 Pod 启动后继续运行。

更多细节参阅[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)。
