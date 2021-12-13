---
title: Affinity
id: affinity
date: 2019-01-11
full_link: zh/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     调度程序用于确定在何处放置 Pods（亲和性）的规则
aka:
tags:
- fundamental
---
<!--
---
title: Affinity
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     Rules used by the scheduler to determine where to place pods
aka:
tags:
- fundamental
---
-->

<!--
In Kubernetes, _affinity_ is a set of rules that give hints to the scheduler about where to place pods.
-->
在 Kubernetes 中，_affinity_ 是一组规则，它向调度程序提示在何处放置亲和性 Pods。
<!--more-->
<!--
There are two kinds of affinity:
-->
affinity 有两种:
<!--
* [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [pod-to-pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
-->
* [node affinity](zh/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [pod-to-pod affinity](zh/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

<!--
The rules are defined using the Kubernetes {{< glossary_tooltip term_id="label" text="labels">}},
and {{< glossary_tooltip term_id="selector" text="selectors">}} specified in {{< glossary_tooltip term_id="pod" text="pods" >}}, 
and they can be either required or preferred, depending on how strictly you want the scheduler to enforce them.
-->
这些规则是使用 Kubernetes {{< glossary_tooltip term_id="label" text="标签">}}（label）
和 {{< glossary_tooltip term_id="pod" text="pods" >}} 中指定的{{< glossary_tooltip term_id="selector" text="调度器">}}（selectors）定义的，
它们可以是必需的或首选的，这取决于您希望调度程序执行它们的严格程度。
