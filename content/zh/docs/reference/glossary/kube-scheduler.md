---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  主节点上的组件，该组件监视那些新创建的未指定运行节点的 Pod，并选择节点让 Pod 在上面运行。

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
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Component on the master that watches newly created pods that have no node assigned, and selects a node for them to run on.

aka: 
tags:
- architecture
---
-->

<!--
 Component on the master that watches newly created pods that have no node assigned, and selects a node for them to run on.
-->

主节点上的组件，该组件监视那些新创建的未指定运行节点的 Pod，并选择节点让 Pod 在上面运行。

<!--more--> 

<!--
Factors taken into account for scheduling decisions include individual and collective resource requirements,  hardware/software/policy constraints, affinity and anti-affinity specifications, data locality, inter-workload interference and deadlines.
-->

调度决策考虑的因素包括单个 Pod 和 Pod 集合的资源需求、硬件/软件/策略约束、亲和性和反亲和性规范、数据位置、工作负载间的干扰和最后时限。
