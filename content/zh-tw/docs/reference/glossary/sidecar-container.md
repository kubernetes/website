---
title: 邊車容器
id: sidecar-container
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/pods/sidecar-containers/
short_description: >
  在 Pod 的整個生命期內保持運行的輔助容器。
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
通常在任意應用容器運行之前啓動的一個或多個{{< glossary_tooltip text="容器" term_id="container" >}}。

<!--more--> 

<!--
Sidecar containers are like regular app containers, but with a different purpose: 
the sidecar provides a Pod-local service to the main app container.
Unlike {{< glossary_tooltip text="init containers" term_id="init-container" >}}, sidecar containers
continue running after Pod startup.

Read [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) for more information.
-->
邊車容器與常規應用容器類似，但目的不同：邊車爲主應用容器提供了一個 Pod 內的本地服務。
與{{< glossary_tooltip text="Init 容器" term_id="init-container" >}}不同，邊車容器在 Pod 啓動後繼續運行。

更多細節參閱[邊車容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)。
