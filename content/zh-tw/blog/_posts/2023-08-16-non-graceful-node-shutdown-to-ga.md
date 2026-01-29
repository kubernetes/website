---
layout: blog
title: "Kubernetes 1.28: 節點非體面關閉進入 GA 階段（正式發佈）"
date: 2023-08-16T10:00:00-08:00
slug: kubernetes-1-28-non-graceful-node-shutdown-GA
---

<!--
layout: blog
title: "Kubernetes 1.28: Non-Graceful Node Shutdown Moves to GA"
date: 2023-08-16T10:00:00-08:00
slug: kubernetes-1-28-non-graceful-node-shutdown-GA
-->

<!--
**Authors:** Xing Yang (VMware) and Ashutosh Kumar (Elastic)
-->
**作者：** Xing Yang (VMware) 和 Ashutosh Kumar (Elastic)

**譯者：** Xin Li (Daocloud)

<!--
The Kubernetes Non-Graceful Node Shutdown feature is now GA in Kubernetes v1.28.
It was introduced as
[alpha](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown)
in Kubernetes v1.24, and promoted to
[beta](https://kubernetes.io/blog/2022/12/16/kubernetes-1-26-non-graceful-node-shutdown-beta/)
in Kubernetes v1.26.
This feature allows stateful workloads to restart on a different node if the
original node is shutdown unexpectedly or ends up in a non-recoverable state
such as the hardware failure or unresponsive OS.
-->
Kubernetes 節點非體面關閉特性現已在 Kubernetes v1.28 中正式發佈。

此特性在 Kubernetes v1.24 中作爲 [Alpha](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown)
特性引入，並在 Kubernetes v1.26 中轉入 [Beta](https://kubernetes.io/blog/2022/12/16/kubernetes-1-26-non-graceful-node-shutdown-beta/)
階段。如果原始節點意外關閉或最終處於不可恢復狀態（例如硬件故障或操作系統無響應），
此特性允許有狀態工作負載在不同節點上重新啓動。

<!--
## What is a Non-Graceful Node Shutdown

In a Kubernetes cluster, a node can be shutdown in a planned graceful way or
unexpectedly because of reasons such as power outage or something else external.
A node shutdown could lead to workload failure if the node is not drained
before the shutdown. A node shutdown can be either graceful or non-graceful.
-->
## 什麼是節點非體面關閉

在 Kubernetes 叢集中，節點可能會按計劃正常關閉，也可能由於斷電或其他外部原因而意外關閉。
如果節點在關閉之前未騰空，則節點關閉可能會導致工作負載失敗。節點關閉可以是正常關閉，也可以是非正常關閉。

<!--
The [Graceful Node Shutdown](https://kubernetes.io/blog/2021/04/21/graceful-node-shutdown-beta/)
feature allows Kubelet to detect a node shutdown event, properly terminate the pods,
and release resources, before the actual shutdown.
-->
[節點體面關閉](https://kubernetes.io/blog/2021/04/21/graceful-node-shutdown-beta/)特性允許
kubelet 在實際關閉之前檢測節點關閉事件、正確終止該節點上的 Pod 並釋放資源。

<!--
When a node is shutdown but not detected by Kubelet's Node Shutdown Manager,
this becomes a non-graceful node shutdown.
Non-graceful node shutdown is usually not a problem for stateless apps, however,
it is a problem for stateful apps.
The stateful application cannot function properly if the pods are stuck on the
shutdown node and are not restarting on a running node.
-->
當節點關閉但 kubelet 的節點關閉管理器未檢測到時，將造成節點非體面關閉。
對於無狀態應用程式來說，節點非體面關閉通常不是問題，但是對於有狀態應用程式來說，這是一個問題。
如果 Pod 停留在關閉節點上並且未在正在運行的節點上重新啓動，則有狀態應用程式將無法正常運行。

<!--
In the case of a non-graceful node shutdown, you can manually add an `out-of-service` taint on the Node.
-->
在節點非體面關閉的情況下，你可以在 Node 上手動添加 `out-of-service` 污點。

```
kubectl taint nodes <node-name> node.kubernetes.io/out-of-service=nodeshutdown:NoExecute
```

<!--
This taint triggers pods on the node to be forcefully deleted if there are no
matching tolerations on the pods. Persistent volumes attached to the shutdown node
will be detached, and new pods will be created successfully on a different running
node.
-->
如果 Pod 上沒有與之匹配的容忍規則，則此污點會觸發節點上的 Pod 被強制刪除。
掛接到關閉中的節點的持久卷將被解除掛接，新的 Pod 將在不同的運行節點上成功創建。

<!--
**Note:** Before applying the out-of-service taint, you must verify that a node is
already in shutdown or power-off state (not in the middle of restarting).

Once all the workload pods that are linked to the out-of-service node are moved to
a new running node, and the shutdown node has been recovered, you should remove that
taint on the affected node after the node is recovered.
-->
**注意：** 在應用 out-of-service 污點之前，你必須驗證節點是否已經處於關閉或斷電狀態（而不是在重新啓動中）。

與 out-of-service 節點有關聯的所有工作負載的 Pod 都被移動到新的運行節點，
並且所關閉的節點已恢復之後，你應該刪除受影響節點上的污點。

<!--
## What’s new in stable

With the promotion of the Non-Graceful Node Shutdown feature to stable, the
feature gate  `NodeOutOfServiceVolumeDetach` is locked to true on
`kube-controller-manager` and cannot be disabled.
-->
## 穩定版中有哪些新內容

隨着非正常節點關閉功能提升到穩定狀態，特性門控
`NodeOutOfServiceVolumeDetach` 在 `kube-controller-manager` 上被鎖定爲 true，並且無法禁用。

<!--
Metrics `force_delete_pods_total` and `force_delete_pod_errors_total` in the
Pod GC Controller are enhanced to account for all forceful pods deletion.
A reason is added to the metric to indicate whether the pod is forcefully deleted
because it is terminated, orphaned, terminating with the `out-of-service` taint,
or terminating and unscheduled.
-->
Pod GC 控制器中的指標 `force_delete_pods_total` 和 `force_delete_pod_errors_total`
得到增強，以考慮所有 Pod 的強制刪除情況。
指標中會添加一個 "reason"，以指示 Pod 是否因終止、孤兒、因 `out-of-service`
污點而終止或因未計劃終止而被強制刪除。

<!--
A "reason" is also added to the metric `attachdetach_controller_forced_detaches`
in the Attach Detach Controller to indicate whether the force detach is caused by
the `out-of-service` taint or a timeout.
-->
Attach Detach Controller 中的指標 `attachdetach_controller_forced_detaches`
中還會添加一個 "reason"，以指示強制解除掛接是由 `out-of-service` 污點還是超時引起的。

<!--
## What’s next?

This feature requires a user to manually add a taint to the node to trigger
workloads failover and remove the taint after the node is recovered.
In the future, we plan to find ways to automatically detect and fence nodes
that are shutdown/failed and automatically failover workloads to another node.
-->
## 接下來

此特性要求使用者手動向節點添加污點以觸發工作負載故障轉移，並在節點恢復後刪除污點。
未來，我們計劃找到方法來自動檢測和隔離關閉/失敗的節點，並自動將工作負載故障轉移到另一個節點。

<!--
## How can I learn more?

Check out additional documentation on this feature
[here](https://kubernetes.io/docs/concepts/architecture/nodes/#non-graceful-node-shutdown).
-->
## 如何瞭解更多？

在[此處](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)可以查看有關此特性的其他文檔。

<!--
## How to get involved?

We offer a huge thank you to all the contributors who helped with design,
implementation, and review of this feature and helped move it from alpha, beta, to stable:
-->
我們非常感謝所有幫助設計、實現和審查此功能並幫助其從 Alpha、Beta 到穩定版的貢獻者：

* Michelle Au ([msau42](https://github.com/msau42)) 
* Derek Carr ([derekwaynecarr](https://github.com/derekwaynecarr))
* Danielle Endocrimes ([endocrimes](https://github.com/endocrimes)) 
* Baofa Fan ([carlory](https://github.com/carlory))
* Tim Hockin  ([thockin](https://github.com/thockin))
* Ashutosh Kumar ([sonasingh46](https://github.com/sonasingh46)) 
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* Yuiko Mouri ([YuikoTakada](https://github.com/YuikoTakada))
* Mrunal Patel ([mrunalp](https://github.com/mrunalp))
* David Porter ([bobbypage](https://github.com/bobbypage))
* Yassine Tijani ([yastij](https://github.com/yastij)) 
* Jing Xu ([jingxu97](https://github.com/jingxu97))
* Xing Yang ([xing-yang](https://github.com/xing-yang))

<!--
This feature is a collaboration between SIG Storage and SIG Node.
For those interested in getting involved with the design and development of any
part of the Kubernetes Storage system, join the Kubernetes Storage Special
Interest Group (SIG).
For those interested in getting involved with the design and development of the
components that support the controlled interactions between pods and host
resources, join the Kubernetes Node SIG.
-->
此特性是 SIG Storage 和 SIG Node 之間的協作。對於那些有興趣參與 Kubernetes
儲存系統任何部分的設計和開發的人，請加入 Kubernetes 儲存特別興趣小組（SIG）。
對於那些有興趣參與支持 Pod 和主機資源之間受控交互的組件的設計和開發，請加入 Kubernetes Node SIG。
