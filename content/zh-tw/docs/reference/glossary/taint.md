---
title: 污點（Taint）
id: taint
date: 2019-01-11
full_link: /zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  污點是一種核心對象，包含三個必需的屬性：key、value 和 effect。
  污點會阻止在節點或節點組上調度 Pod。

aka:
tags:
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
- fundamental
-->

<!--
A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of {{< glossary_tooltip text="Pods" term_id="pod" >}} on {{< glossary_tooltip text="nodes" term_id="node" >}} or node groups.
-->
污點是一種核心對象，包含三個必需的屬性：key、value 和 effect。
污點會阻止在{{< glossary_tooltip text="節點" term_id="node" >}}或節點組上調度
{{< glossary_tooltip text="Pod" term_id="pod" >}}。

<!--more-->

<!--
Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node. A node should only schedule a Pod with the matching tolerations for the configured taints.
-->
污點和{{< glossary_tooltip text="容忍度" term_id="toleration" >}}一起工作，
以確保不會將 Pod 調度到不適合的節點上。
同一{{< glossary_tooltip text="節點" term_id="node" >}}上可標記一個或多個污點。
節點應該僅調度那些帶着能與污點相匹配容忍度的 Pod。
