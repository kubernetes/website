---
title: 親和性（Affinity）
id: affinity
date: 2019-01-11
full_link: /zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     調度程序用於確定在何處放置 Pod（親和性）的規則。
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
在 Kubernetes 中 **親和性（affinity）** 是一組規則，它們爲調度程序提供在何處放置 Pod 提示信息。

<!--more-->

<!--
There are two kinds of affinity:
-->
親和性有兩種：

<!--
* [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [pod-to-pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
-->
* [節點親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [Pod 間親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

<!--
The rules are defined using the Kubernetes {{< glossary_tooltip term_id="label" text="labels">}},
and {{< glossary_tooltip term_id="selector" text="selectors">}} specified in {{< glossary_tooltip term_id="pod" text="pods" >}}, 
and they can be either required or preferred, depending on how strictly you want the scheduler to enforce them.
-->
這些規則是使用 Kubernetes {{< glossary_tooltip term_id="label" text="標籤">}}（label）
和 {{< glossary_tooltip term_id="pod" text="Pod" >}}
中指定的{{< glossary_tooltip term_id="selector" text="選擇算符">}}定義的，
這些規則可以是必需的或首選的，這取決於你希望調度程序執行它們的嚴格程度。
