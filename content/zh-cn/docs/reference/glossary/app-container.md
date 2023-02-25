---
title: 应用程序容器（App Container）
id: app-container
date: 2019-02-12
full_link:
short_description: >
  用于运行部分工作负载的容器。与 Init 容器比较而言。

aka:
tags:
- workload
---
<!--
title: App Container
id: app-container
date: 2019-02-12
full_link:
short_description: >
  A container used to run part of a workload. Compare with init container.

aka:
tags:
- workload
-->

<!--
 Application containers (or app containers) are the {{< glossary_tooltip text="containers" term_id="container" >}} in a {{< glossary_tooltip text="pod" term_id="pod" >}} that are started after any {{< glossary_tooltip text="init containers" term_id="init-container" >}} have completed.
-->
应用程序容器是在 {{< glossary_tooltip text="Pod" term_id="pod" >}}
中的{{< glossary_tooltip text="容器" term_id="container" >}}（或 app 容器），
在 {{< glossary_tooltip text="Init 容器" term_id="init-container" >}}启动完毕后才开始启动。

<!--more-->

<!--
An init container lets you separate initialization details that are important for the overall 
{{< glossary_tooltip text="workload" term_id="workload" >}}, and that don't need to keep running
once the application container has started.
If a pod doesn't have any init containers configured, all the containers in that pod are app containers.
-->
Init 容器使你可以分离对于{{< glossary_tooltip text="工作负载" term_id="workload" >}}整体而言很重要的初始化细节，
并且一旦应用容器启动，它不需要继续运行。
如果 Pod 没有配置 Init 容器，则该 Pod 中的所有容器都是应用程序容器。
