---
layout: blog
title: "Kubernetes 1.26: 節點非體面關閉進入 Beta 階段"
date: 2022-12-16T10:00:00-08:00
slug: kubernetes-1-26-non-graceful-node-shutdown-beta
---

<!--
layout: blog
title: "Kubernetes 1.26: Non-Graceful Node Shutdown Moves to Beta"
date: 2022-12-16T10:00:00-08:00
slug: kubernetes-1-26-non-graceful-node-shutdown-beta
-->

<!--
**Author:** Xing Yang (VMware), Ashutosh Kumar (VMware)

Kubernetes v1.24 [introduced](https://kubernetes.io/blog/2022/05/20/kubernetes-1-24-non-graceful-node-shutdown-alpha/) an alpha quality implementation of improvements
for handling a [non-graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown).
In Kubernetes v1.26, this feature moves to beta. This feature allows stateful workloads to failover to a different node after the original node is shut down or in a non-recoverable state, such as the hardware failure or broken OS.
-->
**作者：** Xing Yang (VMware), Ashutosh Kumar (VMware)

**譯者：** Xin Li (DaoCloud)

Kubernetes v1.24 [引入](https://kubernetes.io/blog/2022/05/20/kubernetes-1-24-non-graceful-node-shutdown-alpha/)
了用於處理[節點非體面關閉](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)改進的
Alpha 質量實現。

<!--
## What is a node shutdown in Kubernetes?

In a Kubernetes cluster, it is possible for a node to shut down. This could happen either in a planned way or it could happen unexpectedly. You may plan for a security patch, or a kernel upgrade and need to reboot the node, or it may shut down due to preemption of VM instances. A node may also shut down due to a hardware failure or a software problem.
-->
## 什麼是 Kubernetes 中的節點關閉

在 Kubernetes 叢集中，節點可能會關閉。這可能在計劃內發生，也可能意外發生。
你可能計劃進行安全補丁或內核升級並需要重新啓動節點，或者它可能由於 VM 實例搶佔而關閉。
節點也可能由於硬件故障或軟件問題而關閉。

<!--
To trigger a node shutdown, you could run a `shutdown` or `poweroff` command in a shell,
 or physically press a button to power off a machine.

A node shutdown could lead to workload failure if the node is not drained before the shutdown.

In the following, we will describe what is a graceful node shutdown and what is a non-graceful node shutdown.
-->
要觸發節點關閉，你可以在 shell 中運行 `shutdown` 或 `poweroff` 命令，或者按下按鈕關閉機器電源。

下面分別介紹什麼是節點體面關閉，什麼是節點非體面關閉。

<!--
## What is a _graceful_ node shutdown?

The kubelet's handling for a [graceful node shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown)
allows the kubelet to detect a node shutdown event, properly terminate the pods on that node,
and release resources before the actual shutdown.
[Critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
are terminated after all the regular pods are terminated, to ensure that the
essential functions of an application can continue to work as long as possible.
-->
## 什麼是節點**體面**關閉？

kubelet 對[節點體面關閉](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)
的處理在於允許 kubelet 檢測節點關閉事件，正確終止該節點上的 Pod，並在實際關閉之前釋放資源。
[關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
在所有常規 Pod 終止後終止，以確保應用程序的基本功能可以儘可能長時間地繼續工作。

<!--
## What is a _non-graceful_ node shutdown?

A Node shutdown can be graceful only if the kubelet's _node shutdown manager_ can
detect the upcoming node shutdown action. However, there are cases where a kubelet
does not detect a node shutdown action. This could happen because the `shutdown`
command does not trigger the [Inhibitor Locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit) mechanism used by the kubelet on Linux, or because of a user error. For example, if
the `shutdownGracePeriod` and `shutdownGracePeriodCriticalPods` details are not
configured correctly for that node.
-->
## 什麼是節點**非體面**關閉？

僅當 kubelet 的**節點關閉管理器**可以檢測到即將到來的節點關閉操作時，節點關閉纔可能是體面的。
但是，在某些情況下，kubelet 不能檢測到節點關閉操作。
這可能是因爲 `shutdown` 命令沒有觸發 Linux 上 kubelet 使用的 [Inhibitor Locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit)
機制，或者是因爲使用者的失誤導致。
例如，如果該節點的 `shutdownGracePeriod` 和 `shutdownGracePeriodCriticalPods` 詳細信息設定不正確。

<!--
When a node is shut down (or crashes), and that shutdown was **not** detected by the kubelet
node shutdown manager, it becomes a non-graceful node shutdown. Non-graceful node shutdown
is a problem for stateful apps.
If a node containing a pod that is part of a StatefulSet is shut down in a non-graceful way, the Pod
will be stuck in `Terminating` status indefinitely, and the control plane cannot create a replacement
Pod for that StatefulSet on a healthy node.
You can delete the failed Pods manually, but this is not ideal for a self-healing cluster.
Similarly, pods that ReplicaSets created as part of a Deployment will be stuck in `Terminating` status, and
that were bound to the now-shutdown node, stay as `Terminating` indefinitely.
If you have set a horizontal scaling limit, even those terminating Pods count against the limit,
so your workload may struggle to self-heal if it was already at maximum scale.
(By the way: if the node that had done a non-graceful shutdown comes back up, the kubelet does delete
the old Pod, and the control plane can make a replacement.)
-->
當一個節點關閉（或崩潰），並且 kubelet 節點關閉管理器**沒有**檢測到該關閉時，
就出現了非體面的節點關閉。節點非體面關閉對於有狀態應用程序而言是一個問題。
如果節點以非正常方式關閉且節點上存在屬於某 StatefulSet 的 Pod，
則該 Pod 將被無限期地阻滯在 `Terminating` 狀態，並且控制平面無法在健康節點上爲該 StatefulSet 創建替代 Pod。
你可以手動刪除失敗的 Pod，但這對於叢集自愈來說並不是理想狀態。
同樣，作爲 Deployment 的一部分創建的 ReplicaSet 中的 Pod 也將滯留在 `Terminating` 狀態，
對於綁定到正在被關閉的節點上的其他 Pod，也將無限期地處於 `Terminating` 狀態。
如果你設置了水平縮放限制，即使那些處於終止過程中的 Pod 也會被計入該限制，
因此如果你的工作負載已經達到最大縮放比例，則它可能難以自我修復。
（順便說一句：如果非體面關閉的節點重新啓動，kubelet 確實會刪除舊的 Pod，並且控制平面可以進行替換。）

<!--
## What's new for the beta?

For Kubernetes v1.26, the non-graceful node shutdown feature is beta and enabled by default.
The `NodeOutOfServiceVolumeDetach`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled by default
on `kube-controller-manager` instead of being opt-in; you can still disable it if needed
(please also file an issue to explain the problem).
-->

## Beta 階段帶來的新功能
在 Kubernetes v1.26 中，非體面節點關閉特性是 Beta 版，默認被啓用。
`NodeOutOfServiceVolumeDetach` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)在
`kube-controller-manager` 中從可選啓用變成默認啓用。如果需要，
你仍然可以選擇禁用此特性（也請提交一個 issue 來解釋問題）。

<!--
On the instrumentation side, the kube-controller-manager reports two new metrics.

`force_delete_pods_total`
: number of pods that are being forcibly deleted (resets on Pod garbage collection controller restart)

`force_delete_pod_errors_total`
: number of errors encountered when attempting forcible Pod deletion (also resets on Pod garbage collection controller restart)
-->
在檢測方面，kub​​e-controller-manager 報告了兩個新指標。

`force_delete_pods_total`：被強制刪除的 Pod 數（在 Pod 垃圾收集控制器重啓時重置）

`force_delete_pod_errors_total`：嘗試強制刪除 Pod 時遇到的錯誤數（也會在 Pod 垃圾收集控制器重啓時重置）

<!--
## How does it work?

In the case of a node shutdown, if a graceful shutdown is not working or the node is in a
non-recoverable state due to hardware failure or broken OS, you can manually add an `out-of-service`
taint on the Node. For example, this can be `node.kubernetes.io/out-of-service=nodeshutdown:NoExecute`
or `node.kubernetes.io/out-of-service=nodeshutdown:NoSchedule`. This taint trigger pods on the node to
be forcefully deleted if there are no matching tolerations on the pods. Persistent volumes attached to the shutdown node will be detached, and new pods will be created successfully on a different running node.
-->
## 它是如何工作的？

在節點關閉的情況下，如果正常關閉不起作用或節點由於硬件故障或操作系統損壞而處於不可恢復狀態，
你可以在 Node 上手動添加 `out-of-service` 污點。
例如，污點可以是 `node.kubernetes.io/out-of-service=nodeshutdown:NoExecute` 或
`node.kubernetes.io/out-of-service=nodeshutdown:NoSchedule`。
如果 Pod 上沒有與之匹配的容忍規則，則此污點會觸發節點上的 Pod 被強制刪除。
附加到關閉中的節點的持久卷將被分離，新的 Pod 將在不同的運行節點上成功創建。

```
kubectl taint nodes <node-name> node.kubernetes.io/out-of-service=nodeshutdown:NoExecute
```

<!--
**Note:** Before applying the out-of-service taint, you must verify that a node is already in shutdown
or power-off state (not in the middle of restarting), either because the user intentionally shut it down
or the node is down due to hardware failures, OS issues, etc.

Once all the workload pods that are linked to the out-of-service node are moved to a new running node, and the shutdown node has been recovered, you should remove that taint on the affected node after the node is recovered.
-->
**注意**：在應用 out-of-service 污點之前，你必須驗證節點是否已經處於關閉或斷電狀態（而不是在重新啓動中），
要麼是因爲使用者有意關閉它，要麼是由於硬件故障或操作系統問題等導致節點關閉。

與 out-of-service 節點有關聯的所有工作負載的 Pod 都被移動到新的運行節點，
並且所關閉的節點已恢復之後，你應該刪除受影響節點上的污點。

<!--
## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the Non-Graceful Node Shutdown implementation to GA in either 1.27 or 1.28.

This feature requires a user to manually add a taint to the node to trigger the failover of workloads and remove the taint after the node is recovered.

The cluster operator can automate this process by automatically applying the `out-of-service` taint
if there is a programmatic way to determine that the node is really shut down and there isn’t IO between
the node and storage. The cluster operator can then automatically remove the taint after the workload
fails over successfully to another running node and that the shutdown node has been recovered.

In the future, we plan to find ways to automatically detect and fence nodes that are shut down or in a non-recoverable state and fail their workloads over to another node.
-->
## 接下來

根據反饋和採用情況，Kubernetes 團隊計劃在 1.27 或 1.28 中將非體面節點關閉實現推向正式發佈（GA）狀態。

此功能需要使用者手動向節點添加污點以觸發工作負載的故障轉移並在節點恢復後刪除污點。

如果有一種編程方式可以確定節點確實關閉並且節點和存儲之間沒有 IO，
則叢集操作員可以通過自動應用 `out-of-service` 污點來自動執行此過程。

在工作負載成功轉移到另一個正在運行的節點並且曾關閉的節點已恢復後，叢集操作員可以自動刪除污點。

將來，我們計劃尋找方法來自動檢測來隔離已關閉或處於不可恢復狀態的節點，
並將其工作負載故障轉移到另一個節點。

<!--
## How can I learn more?

To learn more, read [Non Graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown) in the Kubernetes documentation.
-->
## 如何學習更多？

要了解更多信息，請閱讀 Kubernetes 文檔中的[非體面節點關閉](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)。

<!--
## How to get involved?

We offer a huge thank you to all the contributors who helped with design, implementation, and review of this feature:
-->
## 如何參與

我們非常感謝所有幫助設計、實施和審查此功能的貢獻者：

* Michelle Au ([msau42](https://github.com/msau42)) 
* Derek Carr ([derekwaynecarr](https://github.com/derekwaynecarr))
* Danielle Endocrimes ([endocrimes](https://github.com/endocrimes)) 
* Tim Hockin  ([thockin](https://github.com/thockin))
* Ashutosh Kumar ([sonasingh46](https://github.com/sonasingh46)) 
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* Yuiko Mouri([YuikoTakada](https://github.com/YuikoTakada))
* Mrunal Patel ([mrunalp](https://github.com/mrunalp))
* David Porter ([bobbypage](https://github.com/bobbypage))
* Yassine Tijani ([yastij](https://github.com/yastij)) 
* Jing Xu ([jingxu97](https://github.com/jingxu97))
* Xing Yang ([xing-yang](https://github.com/xing-yang))

<!--
There are many people who have helped review the design and implementation along the way. We want to thank everyone who has contributed to this effort including the about 30 people who have reviewed the [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown) and implementation over the last couple of years.

This feature is a collaboration between SIG Storage and SIG Node. For those interested in getting involved with the design and development of any part of the Kubernetes Storage system, join the Kubernetes Storage Special Interest Group (SIG). For those interested in getting involved with the design and development of the components that support the controlled interactions between pods and host resources, join the Kubernetes Node SIG.
-->
一路上有很多人幫助審閱了設計和實現。我們要感謝爲這項工作做出貢獻的所有人，包括在過去幾年中審查
[KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown)
和實現的大約 30 人。

此功能是 SIG Storage 和 SIG Node 之間的協作。對於那些有興趣參與 Kubernetes
存儲系統任何部分的設計和開發的人，請加入 Kubernetes 存儲特別興趣小組 (SIG)。
對於那些有興趣參與支持 Pod 和主機資源之間受控交互的組件的設計和開發，請加入 Kubernetes Node SIG。

