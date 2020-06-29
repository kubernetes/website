---
title: 污点
id: taint
date: 2019-01-11
full_link: /docs/concepts/configuration/taint-and-toleration/
short_description: >
  一个核心对象，由三个必需的属性组成：键，值和效果。污点会阻止在节点或节点组上调度 Pod。

aka:
tags:
- core-object
- fundamental
---
 一个核心对象，由三个必需的属性组成：键，值和效果。污点会阻止在节点或节点组上调度 Pod。
 
<!--
---
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
---
 A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of pods on nodes or node groups.
-->

<!--more-->

<!--
Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a {{< glossary_tooltip text="node" term_id="node" >}}. A node should only schedule a pod with the matching tolerations for the configured taints.
-->

污点和 {{< glossary_tooltip text="容忍度" term_id="toleration" >}} 一起工作，以确保不会将 Pod 调度到不适合的节点上。一个或多个污点应用于 {{< glossary_tooltip text="节点" term_id="node" >}}。节点应该仅能调度那些带着能与污点相匹配容忍度的 pod。