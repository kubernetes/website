---
title:  初始化容器（Init Container）
id: init-container
date: 2018-04-12
full_link: 
short_description: >
  應用容器執行前必須先執行完成的一個或多個初始化容器。 

aka: 
tags:
- fundamental
---

<!--
---
title: Init Container
id: init-container
date: 2018-04-12
full_link: 
short_description: >
  One or more initialization containers that must run to completion before any app containers run.

aka: 
tags:
- fundamental
---
-->

<!--
 One or more initialization {{< glossary_tooltip text="containers" term_id="container" >}} that must run to completion before any app containers run.
-->

 應用{{< glossary_tooltip text="容器" term_id="container" >}}執行前必須先執行完成的一個或多個初始化容器。

<!--more--> 

<!--
Initialization (init) containers are like regular app containers, with one difference: init containers must run to completion before any app containers can start. Init containers run in series: each init container must run to completion before the next init container begins.
-->

初始化（init）容器像常規應用容器一樣，只有一點不同：初始化（init）容器必須在應用容器啟動前執行完成。
Init 容器的執行順序：一個初始化（init）容器必須在下一個初始化（init）容器開始前執行完成。
