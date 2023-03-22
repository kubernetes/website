---
title: 污点（Taint）
id: taint
date: 2019-01-11
full_link: /zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  污点是一种核心对象，包含三个必需的属性：key、value 和 effect。
  污点会阻止在节点或节点组上调度 Pod。

aka:
tags:
- core-object
- fundamental
---

<!--
title: Taint
id: taint
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of pods on nodes or node groups.

aka:
tags:
- core-object
- fundamental
-->

<!--
A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of {{< glossary_tooltip text="Pods" term_id="pod" >}} on {{< glossary_tooltip text="nodes" term_id="node" >}} or node groups.
-->
污点是一种核心对象，包含三个必需的属性：key、value 和 effect。
污点会阻止在{{< glossary_tooltip text="节点" term_id="node" >}}或节点组上调度
{{< glossary_tooltip text="Pod" term_id="pod" >}}。

<!--more-->

<!--
Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node. A node should only schedule a Pod with the matching tolerations for the configured taints.
-->
污点和{{< glossary_tooltip text="容忍度" term_id="toleration" >}}一起工作，
以确保不会将 Pod 调度到不适合的节点上。
同一{{< glossary_tooltip text="节点" term_id="node" >}}上可标记一个或多个污点。
节点应该仅调度那些带着能与污点相匹配容忍度的 Pod。
