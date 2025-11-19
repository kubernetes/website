---
title: DaemonSet
id: daemonset
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/daemonset/
short_description: >
  確保 Pod 的副本在集羣中的一組節點上運行。

aka: 
tags:
- fundamental
- core-object
- workload
---
<!--
title: DaemonSet
id: daemonset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  Ensures a copy of a Pod is running across a set of nodes in a cluster.

aka: 
tags:
- fundamental
- core-object
- workload
-->

<!--
 Ensures a copy of a {{< glossary_tooltip text="Pod" term_id="pod" >}} is running across a set of nodes in a {{< glossary_tooltip text="cluster" term_id="cluster" >}}.
-->
 確保 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的副本在{{< glossary_tooltip text="集羣" term_id="cluster" >}}中的一組節點上運行。

<!--more--> 

<!--
Used to deploy system daemons such as log collectors and monitoring agents that typically must run on every {{< glossary_tooltip term_id="node" >}}.
-->
用來部署系統守護進程，例如日誌蒐集和監控代理，這些進程通常必須運行在每個{{< glossary_tooltip text="節點" term_id="node" >}}上。
