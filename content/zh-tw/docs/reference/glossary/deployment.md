---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/deployment/
short_description: >
  Deployment 是管理應用副本的 API 物件。

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

 Deployment 是管理應用副本的 API 物件，通常透過執行沒有本地狀態的Pods來實現。

<!--more--> 

<!--
Each replica is represented by a {{< glossary_tooltip term_id="pod" >}}, and the Pods are distributed among the 
{{< glossary_tooltip text="nodes" term_id="node" >}} of a cluster.
For workloads that do require local state, consider using a {{< glossary_tooltip term_id="StatefulSet" >}}.
-->

應用的每個副本就是一個 {{< glossary_tooltip text="Pod" term_id="pod" >}}，
並且這些 Pod 會分散執行在叢集的{{< glossary_tooltip text="節點" term_id="node" >}}上。
