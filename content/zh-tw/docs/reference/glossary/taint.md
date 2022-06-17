---
title: 汙點（Taint）
id: taint
date: 2019-01-11
full_link: /zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  汙點是一種一個核心物件，包含三個必需的屬性：key、value 和 effect。
  汙點會阻止在節點或節點組上排程 Pod。

aka:
tags:
- core-object
- fundamental
---

<!--
title: Taint
id: taint
date: 2019-01-11
full_link: /docs/concepts/configuration/taint-and-toleration/
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
汙點是一種一個核心物件，包含三個必需的屬性：key、value 和 effect。
汙點會阻止在{{< glossary_tooltip text="節點" term_id="node" >}}
或節點組上排程 {{< glossary_tooltip text="Pods" term_id="pod" >}}。 

<!--more-->

<!--
Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node. A node should only schedule a Pod with the matching tolerations for the configured taints.
-->
汙點和{{< glossary_tooltip text="容忍度" term_id="toleration" >}}一起工作，
以確保不會將 Pod 排程到不適合的節點上。
同一{{< glossary_tooltip text="節點" term_id="node" >}}上可標記一個或多個汙點。
節點應該僅排程那些帶著能與汙點相匹配容忍度的 Pod。
