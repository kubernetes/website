---
title: 容忍度（Toleration）
id: toleration
date: 2019-01-11
full_link: /zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  容忍度是一种核心对象，包含三个必需的属性：key、value 和 effect。
  容忍度允许将 Pod 调度到具有对应污点的节点或节点组上。

aka:
tags:
- core-object
- fundamental
---

<!--
title: Toleration
id: toleration
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  A core object consisting of three required properties: key, value, and effect. Tolerations enable the scheduling of pods on nodes or node groups that have a matching taint.

aka:
tags:
- core-object
- fundamental
-->

<!--
A core object consisting of three required properties: key, value, and effect. Tolerations enable the scheduling of pods on nodes or node groups that have matching {{< glossary_tooltip text="taints" term_id="taint" >}}.
-->
容忍度是一种核心对象，包含三个必需的属性：key、value 和 effect。容忍度允许将 Pod
调度到具有对应{{< glossary_tooltip text="污点" term_id="taint" >}}的节点或节点组上。

<!--more-->

<!--
Tolerations and {{< glossary_tooltip text="taints" term_id="taint" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more tolerations are applied to a {{< glossary_tooltip text="pod" term_id="pod" >}}. A toleration indicates that the {{< glossary_tooltip text="pod" term_id="pod" >}} is allowed (but not required) to be scheduled on nodes or node groups with matching {{< glossary_tooltip text="taints" term_id="taint" >}}.
-->
容忍度和{{< glossary_tooltip text="污点" term_id="taint" >}}共同作用可以确保不会将 Pod
调度在不适合的节点上。在同一 {{< glossary_tooltip text="Pod" term_id="pod" >}}
上可以设置一个或者多个容忍度。
容忍度表示在包含对应{{< glossary_tooltip text="污点" term_id="taint" >}}的节点或节点组上调度
{{< glossary_tooltip text="Pod" term_id="pod" >}}是允许的（但并非必需）。
