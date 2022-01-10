---
title: API 发起的驱逐
content_type: concept
weight: 70
---
<!-- 
---
title: API-initiated Eviction
content_type: concept
weight: 70
---
-->
{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

<!-- 
You can request eviction by directly calling the Eviction API 
using a client of the kube-apiserver, like the `kubectl drain` command. 
This creates an `Eviction` object, which causes the API server to terminate the Pod. 

API-initiated evictions respect your configured [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
and [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination). 
-->
你可以通过 kube-apiserver 的客户端，比如 `kubectl drain` 这样的命令，直接调用 Eviction API 发起驱逐。
此操作创建一个 `Eviction` 对象，该对象再驱动 API 服务器终止选定的 Pod。

API 发起的驱逐将遵从你的
[`PodDisruptionBudgets`](/zh/docs/tasks/run-application/configure-pdb/)
和 [`terminationGracePeriodSeconds`](/zh/docs/concepts/workloads/pods/pod-lifecycle#pod-termination)
配置。

## {{% heading "whatsnext" %}}

<!-- 
* Learn about [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* Learn about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
-->
* 了解[节点压力引发的驱逐](/zh/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* 了解 [Pod 优先级和抢占](/zh/docs/concepts/scheduling-eviction/pod-priority-preemption/)
