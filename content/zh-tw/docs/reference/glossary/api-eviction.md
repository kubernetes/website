---
title: API 發起的驅逐（API-initiated eviction）
id: api-eviction
date: 2021-04-27
full_link: /zh-cn/docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  API 發起的驅逐是一個先調用 Eviction API 創建驅逐對象，再由該對象體面地中止 Pod 的過程。
aka:
tags:
- operation
---
<!--
title: API-initiated eviction
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  API-initiated eviction is the process by which you use the Eviction API to create an
  Eviction object that triggers graceful pod termination.
aka:
tags:
- operation
-->

<!-- 
API-initiated eviction is the process by which you use the [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
to create an `Eviction` object that triggers graceful pod termination.
-->
API 發起的驅逐是一個先調用
[Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
創建 `Eviction` 對象，再由該對象體面地中止 Pod 的過程。

<!--more-->

<!-- 
You can request eviction either by directly calling the Eviction API 
using a client of the kube-apiserver, like the `kubectl drain` command. 
When an `Eviction` object is created, the API server terminates the Pod. 

API-initiated evictions respect your configured [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
and [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

API-initiated eviction is not the same as [node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
-->
你可以通過 kube-apiserver 的客戶端，比如 `kubectl drain` 這樣的命令，直接調用 Eviction API 發起驅逐。
當 `Eviction` 對象創建出來之後，該對象將驅動 API 伺服器終止選定的 Pod。

API 發起的驅逐取決於你設定的 [`PodDisruptionBudgets`](/zh-cn/docs/tasks/run-application/configure-pdb/)
和 [`terminationGracePeriodSeconds`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-termination)。

API 發起的驅逐不同於[節點壓力引發的驅逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)。

<!--
* See [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/) for more information.
-->
* 有關詳細信息，請參閱 [API 發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)。
