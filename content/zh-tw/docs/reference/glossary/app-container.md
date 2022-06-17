---
title: 應用程式容器（App Container）
id: app-container
date: 2019-02-12
full_link:
short_description: >
  用於執行部分工作負載的容器。與初始化容器比較而言。

aka:
tags:
- workload
---

<!--
---
title: App Container
id: app-container
date: 2019-02-12
full_link:
short_description: >
  A container used to run part of a workload. Compare with init container.

aka:
tags:
- workload
---
-->

<!--
 Application containers (or app containers) are the {{< glossary_tooltip text="containers" term_id="container" >}} in a {{< glossary_tooltip text="pod" term_id="pod" >}} that are started after any {{< glossary_tooltip text="init containers" term_id="init-container" >}} have completed.
-->
  應用程式 {{< glossary_tooltip text="容器" term_id="container" >}} （或 app 容器）在 {{< glossary_tooltip text="pod" term_id="pod" >}} 中，在 {{< glossary_tooltip text="初始化容器" term_id="init-container" >}} 啟動完畢後才開始啟動。



<!--more-->

<!--
An init container lets you separate initialization details that are important for the overall 
{{< glossary_tooltip text="workload" term_id="workload" >}}, and that don't need to keep running
once the application container has started.
If a pod doesn't have any init containers configured, all the containers in that pod are app containers.
-->

初始化容器使你可以分離對於{{< glossary_tooltip text="工作負載" term_id="workload" >}}
整體而言很重要的初始化細節，並且一旦應用容器啟動，它不需要繼續執行。
如果 pod 沒有配置任何初始化容器，則該 pod 中的所有容器都是應用程式容器。