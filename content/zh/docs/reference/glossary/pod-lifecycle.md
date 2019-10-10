---
title: Pod Lifecycle
id: pod-lifecycle
date: 2019-02-17
full-link: /docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  A high-level summary of what phase the Pod is in within its lifecyle.
 
---
<!--
 A high-level summary of what phase the Pod is in within its lifecyle.
-->

关于 Pod 在其生命周期内处于什么阶段的高级摘要。

<!--more--> 

<!--
The [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) is a high level summary of where a Pod is in its lifecyle.  A Pod’s `status` field is a [PodStatus](/docs/reference/generated/kubernetes-api/v1.13/#podstatus-v1-core) object, which has a `phase` field that displays one of the following phases: Running, Pending, Succeeded, Failed, Unknown, Completed, or CrashLoopBackOff.
-->

[Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/)是 Pod 在其生命周期中的高级摘要。 Pod 的 'status' 字段是 [PodStatus](/docs/reference/generated/kubernetes-api/v1.13/#podstatus-v1-core)对象，它有一个 'phase' 字段，显示以下阶段之一 ：运行，挂起，成功，失败，未知，已完成或回滚。
