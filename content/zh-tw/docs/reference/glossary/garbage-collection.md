---
title: 垃圾收集（Garbage Collection）
id: garbage-collection
date: 2021-07-07
full_link: /zh-cn/docs/concepts/architecture/garbage-collection/
short_description: >
  Kubernetes 用於清理叢集資源的各種機制的統稱。

aka: 
tags:
- fundamental
- operation
---
<!-- 
title: Garbage Collection
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
  A collective term for the various mechanisms Kubernetes uses to clean up cluster
  resources.

aka: 
tags:
- fundamental
- operation
-->

<!-- 
 Garbage collection is a collective term for the various mechanisms Kubernetes uses to clean up
 cluster resources. 
-->
垃圾收集（Garbage Collection）是 Kubernetes 用於清理叢集資源的各種機制的統稱。

<!--more-->

<!-- 
Kubernetes uses garbage collection to clean up resources like
[unused containers and images](/docs/concepts/architecture/garbage-collection/#containers-images),
[failed Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection),
[objects owned by the targeted resource](/docs/concepts/overview/working-with-objects/owners-dependents/),
[completed Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/), and resources
that have expired or failed.
-->
Kubernetes 使用垃圾收集機制來清理資源，例如：
[未使用的容器和映像檔](/zh-cn/docs/concepts/architecture/garbage-collection/#containers-images)、
[失敗的 Pod](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)、
[目標資源擁有的對象](/zh-cn/docs/concepts/overview/working-with-objects/owners-dependents/)、
[已完成的 Job](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)、
過期或出錯的資源。
