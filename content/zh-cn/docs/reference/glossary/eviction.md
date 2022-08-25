---
title: 驱逐
id: eviction
date: 2021-05-08
full_link: /zh-cn/docs/concepts/scheduling-eviction/
short_description: >
    终止节点上一个或多个 Pod 的过程。
aka:
tags:
- operation
---
<!--
---
title: Eviction
id: eviction
date: 2021-05-08
full_link: /docs/concepts/scheduling-eviction/
short_description: >
    Process of terminating one or more Pods on Nodes
aka:
tags:
- operation
---
-->
<!--
Eviction is the process of terminating one or more Pods on Nodes.
-->
驱逐即终止节点上一个或多个 Pod 的过程。
<!--more-->
<!--
There are two kinds of eviction:
* [Node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [API-initiated eviction](/docs/reference/generated/kubernetes-api/v1.23/)
-->
驱逐的两种类型
* [节点压力驱逐](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [API 发起的驱逐](/docs/reference/generated/kubernetes-api/v1.23/)

