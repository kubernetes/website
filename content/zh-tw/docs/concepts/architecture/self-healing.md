---
title: Kubernetes 自我修復
content_type: concept  
weight: 50
feature:
  title: 自我修復
  anchor: 自動化故障恢復
  description: >
    Kubernetes 會自動重啓崩潰的容器，在必要時替換整個 Pod，
    在發生更大範圍的故障時重新掛載儲存，
    並且能夠與節點自動擴縮容器集成，實現節點級別的自我修復能力。
---
<!--
title: Kubernetes Self-Healing  
content_type: concept  
weight: 50
feature:
  title: Self-healing
  anchor: Automated recovery from damage
  description: >
    Kubernetes restarts containers that crash, replaces entire Pods where needed,
    reattaches storage in response to wider failures, and can integrate with
    node autoscalers to self-heal even at the node level.
-->

<!-- overview -->

<!--
Kubernetes is designed with self-healing capabilities that help maintain the health and availability of workloads. 
It automatically replaces failed containers, reschedules workloads when nodes become unavailable, and ensures that the desired state of the system is maintained.
-->
Kubernetes 旨在通過自我修復能力來維護工作負載的健康和可用性。  
它能夠自動替換失敗的容器，在節點不可用時重新調度工作負載，
並確保系統的期望狀態得以維持。

<!-- body -->

<!--
## Self-Healing capabilities {#self-healing-capabilities} 

- **Container-level restarts:** If a container inside a Pod fails, Kubernetes restarts it based on the [`restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).

- **Replica replacement:** If a Pod in a [Deployment](/docs/concepts/workloads/controllers/deployment/) or [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) fails, Kubernetes creates a replacement Pod to maintain the specified number of replicas.
  If a Pod fails that is part of a [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) fails, the control plane
  creates a replacement Pod to run on the same node.
-->
## 自我修復能力 {#self-healing-capabilities}

- **容器級重啓：** 如果 Pod 中的某個容器失敗，Kubernetes 會根據
  [`restartPolicy`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
  定義的策略重啓此容器。

- **副本替換：** 如果 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)
  或 [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/) 中的某個 Pod 失敗，
  Kubernetes 會創建一個替代 Pod，以維持指定的副本數量。  
  如果屬於 [DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/)
  的某個 Pod 失敗，控制平面會在同一節點上創建一個替代 Pod。

<!--
- **Persistent storage recovery:** If a node is running a Pod with a PersistentVolume (PV) attached, and the node fails, Kubernetes can reattach the volume to a new Pod on a different node.

- **Load balancing for Services:** If a Pod behind a [Service](/docs/concepts/services-networking/service/) fails, Kubernetes automatically removes it from the Service's endpoints to route traffic only to healthy Pods.
-->
- **持久儲存恢復：** 如果某個節點正在運行一個掛載了持久卷（PV）
  的 Pod，且該節點發生故障，Kubernetes 可以將該卷重新掛載到另一個節點上的新 Pod。

- **服務的負載均衡：** 如果 [Service](/zh-cn/docs/concepts/services-networking/service/)
  背後的某個 Pod 失敗，Kubernetes 會自動將其從 Service 的端點中移除，
  以確保流量僅路由到健康的 Pod。

<!--
Here are some of the key components that provide Kubernetes self-healing:

- **[kubelet](/docs/concepts/architecture/#kubelet):** Ensures that containers are running, and restarts those that fail.

- **ReplicaSet, StatefulSet and DaemonSet controller:** Maintains the desired number of Pod replicas.

- **PersistentVolume controller:** Manages volume attachment and detachment for stateful workloads.
-->
以下是提供 Kubernetes 自我修復功能的一些關鍵組件：

- **[kubelet](/zh-cn/docs/concepts/architecture/#kubelet)：** 
  確保容器正在運行，並重啓失敗的容器。

- **ReplicaSet、StatefulSet 和 DaemonSet 控制器：** 維持期望的 Pod 副本數量。

- **PersistentVolume 控制器：** 管理有狀態工作負載的卷掛載和卸載。

<!--
## Considerations {#considerations} 

- **Storage Failures:** If a persistent volume becomes unavailable, recovery steps may be required.

- **Application Errors:** Kubernetes can restart containers, but underlying application issues must be addressed separately.
-->
## 注意事項 {#considerations}

- **儲存故障：** 如果持久卷變得不可用，可能需要執行恢復步驟。

- **應用程式錯誤：** Kubernetes 可以重啓容器，但底層的應用程式問題需要單獨解決。

## {{% heading "whatsnext" %}} 

<!--
- Read more about [Pods](/docs/concepts/workloads/pods/)
- Learn about [Kubernetes Controllers](/docs/concepts/architecture/controller/)
- Explore [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
- Read about [node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/). Node autoscaling
  also provides automatic healing if or when nodes fail in your cluster.
-->
- 進一步閱讀 [Pod](/zh-cn/docs/concepts/workloads/pods/)
- 瞭解 [Kubernetes 控制器](/zh-cn/docs/concepts/architecture/controller/)
- 探索 [持久卷（PersistentVolume）](/zh-cn/docs/concepts/storage/persistent-volumes/)
- 閱讀關於[節點自動擴展](/zh-cn/docs/concepts/cluster-administration/node-autoscaling/)。
  節點自動擴展還能夠在叢集中的節點發生故障時提供自動修復功能。
