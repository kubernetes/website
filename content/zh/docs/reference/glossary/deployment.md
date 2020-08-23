---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /zh/docs/concepts/workloads/controllers/deployment/
short_description: >
  Deployment 是管理应用副本的 API 对象。

aka: 
tags:
- fundamental
- core-object
- workload
---

<!--
---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /zh/docs/concepts/workloads/controllers/deployment/
short_description: >
  An API object that manages a replicated application.

aka: 
tags:
- fundamental
- core-object
- workload
---
-->

<!--
 An API object that manages a replicated application.
-->

 Deployment 是管理应用副本的 API 对象。

<!--more--> 

<!--
Each replica is represented by a {{< glossary_tooltip term_id="pod" >}}, and the Pods are distributed among the nodes of a cluster.
-->

应用的每个副本就是一个 {{< glossary_tooltip term_id="pod" >}}，并且这些 Pod 会分散运行在集群的节点上。
