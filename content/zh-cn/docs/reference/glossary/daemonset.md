---
title: DaemonSet
id: daemonset
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/daemonset/
short_description: >
  确保 Pod 的副本在集群中的一组节点上运行。

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
 确保 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的副本在{{< glossary_tooltip text="集群" term_id="cluster" >}}中的一组节点上运行。

<!--more--> 

<!--
Used to deploy system daemons such as log collectors and monitoring agents that typically must run on every {{< glossary_tooltip term_id="node" >}}.
-->
用来部署系统守护进程，例如日志搜集和监控代理，这些进程通常必须运行在每个{{< glossary_tooltip text="节点" term_id="node" >}}上。
