---
title: 節點壓力驅逐
id: node-pressure-eviction
date: 2021-05-13
full_link: /zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  節點壓力驅逐是 kubelet 主動使 Pod 失敗以回收節點上的資源的過程。
aka:
- kubelet eviction
tags:
- operation
---
<!-- 
---
title: Node-pressure eviction
id: node-pressure-eviction
date: 2021-05-13
full_link: /docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  Node-pressure eviction is the process by which the kubelet proactively fails
  pods to reclaim resources on nodes.
aka:
- kubelet eviction
tags:
- operation
---
-->

<!-- 
Node-pressure eviction is the process by which the {{<glossary_tooltip term_id="kubelet" text="kubelet">}} proactively terminates
pods to reclaim resources on nodes.
-->
節點壓力驅逐是 {{<glossary_tooltip term_id="kubelet" text="kubelet">}} 主動終止 Pod 以回收節點上資源的過程。

<!--more-->

<!-- 
The kubelet monitors resources like CPU, memory, disk space, and filesystem 
inodes on your cluster's nodes. When one or more of these resources reach
specific consumption levels, the kubelet can proactively fail one or more pods
on the node to reclaim resources and prevent starvation. 
-->
kubelet 監控叢集節點上的 CPU、記憶體、磁碟空間和檔案系統 inode 等資源。
當這些資源中的一個或多個達到特定消耗水平時，
kubelet 可以主動使節點上的一個或多個 Pod 失效，以回收資源並防止飢餓。

<!-- 
Node-pressure eviction is not the same as [API-initiated eviction](/docs/reference/generated/kubernetes-api/v1.23/).
-->
節點壓力驅逐不用於 [API 發起的驅逐](/docs/reference/generated/kubernetes-api/v1.23/)。
