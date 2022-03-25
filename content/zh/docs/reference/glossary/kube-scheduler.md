---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /zh/docs/reference/command-line-tools-reference/kube-scheduler/
short_description: >
  控制平面组件，负责监视新创建的、未指定运行节点的 Pod，选择节点让 Pod 在上面运行。

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

  控制平面组件，负责监视新创建的、未指定运行{{< glossary_tooltip term_id="node" text="节点（node）">}}的 {{< glossary_tooltip term_id="pod" text="Pods" >}}，选择节点让 Pod 在上面运行。

<!--more--> 

<!--
Factors taken into account for scheduling decisions include individual and collective resource requirements,  hardware/software/policy constraints, affinity and anti-affinity specifications, data locality, inter-workload interference and deadlines.
-->

调度决策考虑的因素包括单个 Pod 和 Pod 集合的资源需求、硬件/软件/策略约束、亲和性和反亲和性规范、数据位置、工作负载间的干扰和最后时限。
