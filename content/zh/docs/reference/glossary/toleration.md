---
title: Toleration
id: toleration
date: 2019-01-11
full_link: /docs/concepts/configuration/taint-and-toleration/
short_description: >
  A core object consisting of three required properties: key, value, and effect. Tolerations enable the scheduling of pods on nodes or node groups that have a matching taint.

aka:
tags:
- core-object
- fundamental
---
<!--
A core object consisting of three required properties: key, value, and effect. Tolerations enable the scheduling of pods on nodes or node groups that have matching {{< glossary_tooltip text="taints" term_id="taint" >}}.
-->
由三个必需属性组成的核心对象：键，值和效果。 Tolerations 的作用是在具有匹配 {{< glossary_tooltip text="taints" term_id="taint" >}} 的节点或节点组上调度 pod。
<!--more-->

<!--
Tolerations and {{< glossary_tooltip text="taints" term_id="taint" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more tolerations are applied to a {{< glossary_tooltip text="pod" term_id="pod" >}}. A toleration indicates that the {{< glossary_tooltip text="pod" term_id="pod" >}} is allowed (but not required) to be scheduled on nodes or node groups with matching {{< glossary_tooltip text="taints" term_id="taint" >}}.
-->
Tolerations 和 {{< glossary_tooltip text="taints" term_id="taint" >}} 一起工作以确保 pod 未被安排到不适当的节点上。一个或多个 tolerations 适用于{{<glossary_tooltip text =“pod”term_id =“pod”>}}。Tolerations 表示允许（但不强制）具有 {{< glossary_tooltip text="pod" term_id="pod" >}} 的 pod 被调度到具有匹配 {{< glossary_tooltip text="taints" term_id="taint" >}} 的节点或节点组上运行。
