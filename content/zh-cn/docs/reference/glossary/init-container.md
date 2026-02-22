---
title: Init 容器（Init Container）
id: init-container
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/pods/init-containers/
short_description: >
  应用容器运行前必须先运行完成的一个或多个 Init 容器（Init Container）。
aka: 
tags:
- fundamental
---

<!--
title: Init Container
id: init-container
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/init-containers/
short_description: >
  One or more initialization containers that must run to completion before any app containers run.
aka: 
tags:
- fundamental
-->

<!--
 One or more initialization {{< glossary_tooltip text="containers" term_id="container" >}} that must run to completion before any app containers run.
-->
应用{{< glossary_tooltip text="容器" term_id="container" >}}运行前必须先运行完成的一个或多个 Init 容器（Init Container）。

<!--more--> 

<!--
Initialization (init) containers are like regular app containers, with one difference: init containers must run to completion before any app containers can start. Init containers run in series: each init container must run to completion before the next init container begins.
-->
Init 容器像常规应用容器一样，只有一点不同：Init 容器必须在应用容器启动前运行完成。
Init 容器的运行顺序：一个 Init 容器必须在下一个 Init 容器开始前运行完成。

<!--
Unlike {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}}, init containers do not remain running after Pod startup.

For more information, read [init containers](/docs/concepts/workloads/pods/init-containers/).
-->
与{{< glossary_tooltip text="边车容器" term_id="sidecar-container" >}}不同，Init 容器在 Pod 启动后不会继续运行。

有关更多信息，请阅读 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)。
