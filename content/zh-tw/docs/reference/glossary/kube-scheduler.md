---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/
short_description: >
  控制平面組件，負責監視新創建的、未指定運行節點的 Pod，選擇節點讓 Pod 在上面運行。

aka: 
tags:
- architecture
- scheduler
---

<!--
---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-scheduler/
short_description: >
  Control plane component that watches for newly created pods with no assigned node, and selects a node for them to run on.

aka: 
tags:
- architecture
---
-->

<!--
Control plane component that watches for newly created
{{< glossary_tooltip term_id="pod" text="Pods" >}} with no assigned
{{< glossary_tooltip term_id="node" text="node">}}, and selects a node for them
to run on.-->

  `kube-scheduler` 是{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的組件，
  負責監視新創建的、未指定運行{{< glossary_tooltip term_id="node" text="節點（node）">}}的 {{< glossary_tooltip term_id="pod" text="Pods" >}}，
  並選擇節點來讓 Pod 在上面運行。

<!--more--> 

<!--
Factors taken into account for scheduling decisions include individual and collective resource requirements,  hardware/software/policy constraints, affinity and anti-affinity specifications, data locality, inter-workload interference and deadlines.
-->

調度決策考慮的因素包括單個 Pod 及 Pods 集合的資源需求、軟硬件及策略約束、
親和性及反親和性規範、資料位置、工作負載間的干擾及最後時限。
