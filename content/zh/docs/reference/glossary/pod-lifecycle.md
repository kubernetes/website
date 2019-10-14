---
title: Pod 生命周期
id: pod-lifecycle
date: 2019-02-17
full-link: /docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  关于 Pod 在其生命周期内处于什么阶段的概括总结。
 
---
<!--
 A high-level summary of what phase the Pod is in within its lifecyle.
-->

关于 Pod 在其生命周期内处于什么阶段的概括总结。

<!--more--> 

<!--
The [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) is a high level summary of where a Pod is in its lifecyle.  A Pod’s `status` field is a [PodStatus](/docs/reference/generated/kubernetes-api/v1.13/#podstatus-v1-core) object, which has a `phase` field that displays one of the following phases: Running, Pending, Succeeded, Failed, Unknown, Completed, or CrashLoopBackOff.
-->

[Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/)是 Pod 在其生命周期中的概括总结。 Pod 的 'status' 字段是 [PodStatus](/docs/reference/generated/kubernetes-api/v1.13/#podstatus-v1-core)对象，它有一个 'phase' 字段，显示以下阶段之一 ：Running、Pending、Succeeded、Failed、Unknown、Completed 或者 CrashLoopBackOff。
