---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/deployment/
short_description: >
  管理叢集上的多副本應用。
aka: 
tags:
- fundamental
- core-object
- workload
---
<!--
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
-->

<!--
 An API object that manages a replicated application, typically by running Pods with no local state.
-->
管理多副本應用的一種 API 對象，通常通過運行沒有本地狀態的 Pod 來完成工作。

<!--more--> 

<!--
Each replica is represented by a {{< glossary_tooltip term_id="pod" >}}, and the Pods are distributed among the 
{{< glossary_tooltip text="nodes" term_id="node" >}} of a cluster.
For workloads that do require local state, consider using a {{< glossary_tooltip term_id="StatefulSet" >}}.
-->
每個副本表現爲一個 {{<glossary_tooltip term_id="pod" >}}，
Pod 分佈在叢集中的{{<glossary_tooltip text="節點" term_id="node" >}}上。
對於確實需要本地狀態的工作負載，請考慮使用 {{<glossary_tooltip term_id="StatefulSet" >}}。
