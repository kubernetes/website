---
title: Pod 生命週期
id: pod-lifecycle
date: 2019-02-17
full-link: /zh-cn/docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  關於 Pod 在其生命週期中處於哪個階段的更高層次概述。
---

<!--
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
-->

<!--
A high-level summary of what phase the Pod is in within its lifecyle.
-->
關於 Pod 在其生命週期中處於哪個階段的更高層次概述。

<!--more-->

<!--
The [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) is defined by the states or phases of a Pod. There are five possible Pod phases: Pending, Running, Succeeded, Failed, and Unknown. A high-level description of the Pod state is summarized in the [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) `phase` field.
-->
[Pod 生命週期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/) 是關於 Pod
處於哪個階段的概述。包含了下面 5 種可能的階段：Running、Pending、Succeeded、
Failed、Unknown。關於 Pod 的階段的更高級描述請查閱
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) `phase` 字段。
