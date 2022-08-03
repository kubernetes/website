---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/deployment/
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
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  Manages a replicated application on your cluster.

aka: 
tags:
- fundamental
- core-object
- workload
---
-->

<!--
 An API object that manages a replicated application, typically by running Pods with no local state.
-->

 Deployment 是管理应用副本的 API 对象，通常通过运行没有本地状态的Pods来实现。

<!--more--> 

<!--
Each replica is represented by a {{< glossary_tooltip term_id="pod" >}}, and the Pods are distributed among the 
{{< glossary_tooltip text="nodes" term_id="node" >}} of a cluster.
For workloads that do require local state, consider using a {{< glossary_tooltip term_id="StatefulSet" >}}.
-->

应用的每个副本就是一个 {{< glossary_tooltip text="Pod" term_id="pod" >}}，
并且这些 Pod 会分散运行在集群的{{< glossary_tooltip text="节点" term_id="node" >}}上。
