---
title: 驅逐（Eviction）
id: eviction
date: 2021-05-08
full_link: /zh-cn/docs/concepts/scheduling-eviction/
short_description: >
    終止節點上一個或多個 Pod 的過程。
aka:
tags:
- operation
---
<!--
title: Eviction
id: eviction
date: 2021-05-08
full_link: /docs/concepts/scheduling-eviction/
short_description: >
    Process of terminating one or more Pods on Nodes
aka:
tags:
- operation
-->

<!--
Eviction is the process of terminating one or more Pods on Nodes.
-->
驅逐（Eviction）即終止節點上一個或多個 Pod 的過程。

<!--more-->

<!--
There are two kinds of eviction:
* [Node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/)
-->
驅逐的兩種類型：
* [節點壓力驅逐](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [API 發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)
