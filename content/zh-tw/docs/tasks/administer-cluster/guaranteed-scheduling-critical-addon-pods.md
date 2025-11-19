---
title: 關鍵插件 Pod 的調度保證
content_type: concept
weight: 220
---
<!--
title: Guaranteed Scheduling For Critical Add-On Pods
content_type: concept
weight: 220
-->

<!-- overview -->

<!-- 
Kubernetes core components such as the API server, scheduler, and controller-manager run on a control plane node. However, add-ons must run on a regular cluster node.
Some of these add-ons are critical to a fully functional cluster, such as metrics-server, DNS, and UI.
A cluster may stop working properly if a critical add-on is evicted (either manually or as a side effect of another operation like upgrade)
and becomes pending (for example when the cluster is highly utilized and either there are other pending pods that schedule into the space
vacated by the evicted critical add-on pod or the amount of resources available on the node changed for some other reason).
-->
Kubernetes 核心組件（如 API 服務器、調度器、控制器管理器）在控制平面節點上運行。
但是插件必須在常規集羣節點上運行。
其中一些插件對於功能完備的集羣至關重要，例如 Heapster、DNS 和 UI。
如果關鍵插件被逐出（手動或作爲升級等其他操作的副作用）或者變成掛起狀態，集羣可能會停止正常工作。
關鍵插件進入掛起狀態的例子有：集羣利用率過高；被逐出的關鍵插件 Pod 釋放了空間，但該空間被之前懸決的
Pod 佔用；由於其它原因導致節點上可用資源的總量發生變化。

<!--
Note that marking a pod as critical is not meant to prevent evictions entirely; it only prevents the pod from becoming permanently unavailable.
A static pod marked as critical can't be evicted. However, non-static pods marked as critical are always rescheduled.
-->
注意，把某個 Pod 標記爲關鍵 Pod 並不意味着完全避免該 Pod 被逐出；它只能防止該 Pod 變成永久不可用。
被標記爲關鍵性的靜態 Pod 不會被逐出。但是，被標記爲關鍵性的非靜態 Pod 總是會被重新調度。

<!-- body -->

<!--
### Marking pod as critical
-->
### 標記關鍵 Pod

<!--
To mark a Pod as critical, set priorityClassName for that Pod to `system-cluster-critical` or `system-node-critical`. `system-node-critical` is the highest available priority, even higher than `system-cluster-critical`.
-->
要將 Pod 標記爲關鍵性（critical），設置 Pod 的 priorityClassName 爲 `system-cluster-critical` 或者 `system-node-critical`。
`system-node-critical` 是最高級別的可用性優先級，甚至比 `system-cluster-critical` 更高。
