---
title: API 发起的驱逐
id: api-eviction
date: 2021-04-27
full_link: /zh/docs/concepts/scheduling-eviction/pod-eviction/#api-eviction
short_description: >
  API 发起的驱逐是一个先调用 Eviction API 创建驱逐对象，再由该对象体面地中止 Pod 的过程。
aka:
tags:
- operation
---

<!-- ---
title: API-initiated eviction
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/pod-eviction/#api-eviction
short_description: >
  API-initiated eviction is the process by which you use the Eviction API to create an
  Eviction object that triggers graceful pod termination.
aka:
tags:
- operation
---
-->
<!-- 
API-initiated eviction is the process by which you use the [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
to create an `Eviction` object that triggers graceful pod termination.
-->
API 发起的驱逐是一个先调用
[Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/create-eviction-pod-v1-core)
创建驱逐对象，再由该对象体面地中止 Pod 的过程。

<!--more-->

<!-- 
You can request eviction either by directly calling the Eviction API 
using a client of the kube-apiserver, like the `kubectl drain` command. 
When an `Eviction` object is created, the API server terminates the Pod. 

API-initiated eviction is not the same as [node-pressure eviction](/docs/concepts/scheduling-eviction/eviction/#kubelet-eviction).
-->
你可以通过 kube-apiserver 的客户端，比如 `kubectl drain` 这样的命令，直接调用 Eviction API 发起驱逐。
当 `Eviction` 对象创建出来之后，该对象将驱动 API 服务器终止选定的Pod。

API 发起的驱逐不同于
[节点压力引发的驱逐](/zh/docs/concepts/scheduling-eviction/eviction/#kubelet-eviction)。
