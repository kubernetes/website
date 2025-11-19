---
title: Init 容器（Init Container）
id: init-container
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/pods/init-containers/
short_description: >
  應用容器運行前必須先運行完成的一個或多個 Init 容器（Init Container）。
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
應用{{< glossary_tooltip text="容器" term_id="container" >}}運行前必須先運行完成的一個或多個 Init 容器（Init Container）。

<!--more--> 

<!--
Initialization (init) containers are like regular app containers, with one difference: init containers must run to completion before any app containers can start. Init containers run in series: each init container must run to completion before the next init container begins.
-->
Init 容器像常規應用容器一樣，只有一點不同：Init 容器必須在應用容器啓動前運行完成。
Init 容器的運行順序：一個 Init 容器必須在下一個 Init 容器開始前運行完成。

<!--
Unlike {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}}, init containers do not remain running after Pod startup.

For more information, read [init containers](/docs/concepts/workloads/pods/init-containers/).
-->
與{{< glossary_tooltip text="邊車容器" term_id="sidecar-container" >}}不同，Init 容器在 Pod 啓動後不會繼續運行。

有關更多信息，請閱讀 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)。
