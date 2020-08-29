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
  关于 Pod 在其生命周期中处于哪个阶段的更高层次概述。
---

<!--
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
-->

<!--
 A high-level summary of what phase the Pod is in within its lifecyle.
-->

 关于 Pod 在其生命周期中处于哪个阶段的更高层次概述。

<!--more-->

<!--
The [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) is a high level summary of where a Pod is in its lifecyle.  A Pod’s `status` field is a [PodStatus](/docs/reference/generated/kubernetes-api/v1.13/#podstatus-v1-core) object, which has a `phase` field that displays one of the following phases: Running, Pending, Succeeded, Failed, Unknown, Completed, or CrashLoopBackOff.
-->
[Pod 生命周期](/zh/docs/concepts/workloads/pods/pod-lifecycle/) 是关于 Pod 在其生命周期中处于哪个阶段的更高层次概述。Pod 的`status` 字段是 [PodStatus](/docs/reference/generated/kubernetes-api/v1.13/#podstatus-v1-core) 对象, 该对象的 `phase` 字段包含了下面的状态: Running、Pending、Succeeded、Failed、Unknown、Completed 或 CrashLoopBackOff。
