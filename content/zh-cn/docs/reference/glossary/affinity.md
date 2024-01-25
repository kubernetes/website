---
title: 亲和性（Affinity）
id: affinity
date: 2019-01-11
full_link: /zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     调度程序用于确定在何处放置 Pod（亲和性）的规则。
aka:
tags:
- fundamental
---
<!--
title: Affinity
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     Rules used by the scheduler to determine where to place pods
aka:
tags:
- fundamental
-->

<!--
In Kubernetes, _affinity_ is a set of rules that give hints to the scheduler about where to place pods.
-->
在 Kubernetes 中 **亲和性（affinity）** 是一组规则，它们为调度程序提供在何处放置 Pod 提示信息。

<!--more-->

<!--
There are two kinds of affinity:
-->
亲和性有两种：

<!--
* [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [pod-to-pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
-->
* [节点亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [Pod 间亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

<!--
The rules are defined using the Kubernetes {{< glossary_tooltip term_id="label" text="labels">}},
and {{< glossary_tooltip term_id="selector" text="selectors">}} specified in {{< glossary_tooltip term_id="pod" text="pods" >}}, 
and they can be either required or preferred, depending on how strictly you want the scheduler to enforce them.
-->
这些规则是使用 Kubernetes {{< glossary_tooltip term_id="label" text="标签">}}（label）
和 {{< glossary_tooltip term_id="pod" text="Pod" >}}
中指定的{{< glossary_tooltip term_id="selector" text="选择算符">}}定义的，
这些规则可以是必需的或首选的，这取决于你希望调度程序执行它们的严格程度。
