---
layout: blog
title: "Kubernetes 1.24: 節點非體面關閉特性進入 Alpha 階段"
date: 2022-05-20
slug: kubernetes-1-24-non-graceful-node-shutdown-alpha
---
<!--
layout: blog
title: "Kubernetes 1.24: Introducing Non-Graceful Node Shutdown Alpha"
date: 2022-05-20
slug: kubernetes-1-24-non-graceful-node-shutdown-alpha
-->

<!--
**Authors** Xing Yang and Yassine Tijani (VMware)
-->
**作者**：Xing Yang 和 Yassine Tijani (VMware)

<!--
Kubernetes v1.24 introduces alpha support for [Non-Graceful Node Shutdown](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown). 
This feature allows stateful workloads to failover to a different node after the original node is shutdown or in a non-recoverable state such as hardware failure or broken OS.
-->
Kubernetes v1.24 引入了對[節點非體面關閉](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown)
（Non-Graceful Node Shutdown）的 Alpha 支持。
此特性允許有狀態工作負載在原節點關閉或處於不可恢復狀態（如硬件故障或操作系統損壞）後，故障轉移到不同的節點。

<!--
## How is this different from Graceful Node Shutdown
-->
## 這與節點體面關閉有何不同

<!--
You might have heard about the [Graceful Node Shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown) capability of Kubernetes,
and are wondering how the Non-Graceful Node Shutdown feature is different from that. Graceful Node Shutdown
allows Kubernetes to detect when a node is shutting down cleanly, and handles that situation appropriately.
A Node Shutdown can be "graceful" only if the node shutdown action can be detected by the kubelet ahead
of the actual shutdown. However, there are cases where a node shutdown action may not be detected by
the kubelet. This could happen either because the shutdown command does not trigger the systemd inhibitor
locks mechanism that kubelet relies upon, or because of a configuration error
(the `ShutdownGracePeriod` and `ShutdownGracePeriodCriticalPods` are not configured properly).
-->
你可能聽說過 Kubernetes 的[節點體面關閉](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)特性，
並且想知道節點非體面關閉特性與之有何不同。節點體面關閉允許 Kubernetes 檢測節點何時完全關閉，並適當地處理這種情況。
只有當 kubelet 在實際關閉之前檢測到節點關閉動作時，節點關閉纔是“體面（graceful）”的。
但是，在某些情況下，kubelet 可能檢測不到節點關閉操作。
這可能是因爲 shutdown 命令沒有觸發 kubelet 所依賴的 systemd 抑制鎖機制，
或者是因爲設定錯誤（`ShutdownGracePeriod` 和 `ShutdownGracePeriodCriticalPods` 設定不正確）。

<!--
Graceful node shutdown relies on Linux-specific support. The kubelet does not watch for upcoming
shutdowns on Windows nodes (this may change in a future Kubernetes release).
-->
節點體面關閉依賴於特定 Linux 的支持。
kubelet 不監視 Windows 節點上即將關閉的情況（這可能在未來的 Kubernetes 版本中會有所改變）。

<!--
When a node is shutdown but without the kubelet detecting it, pods on that node
also shut down ungracefully. For stateless apps, that's often not a problem (a ReplicaSet adds a new pod once
the cluster detects that the affected node or pod has failed). For stateful apps, the story is more complicated.
If you use a StatefulSet and have a pod from that StatefulSet on a node that fails uncleanly, that affected pod
will be marked as terminating; the StatefulSet cannot create a replacement pod because the pod
still exists in the cluster.
As a result, the application running on the StatefulSet may be degraded or even offline. If the original, shut
down node comes up again, the kubelet on that original node reports in, deletes the existing pods, and
the control plane makes a replacement pod for that StatefulSet on a different running node.
If the original node has failed and does not come up, those stateful pods would be stuck in a
terminating status on that failed node indefinitely.
-->
當一個節點被關閉但 kubelet 沒有檢測到時，該節點上的 Pod 也會非體面地關閉。
對於無狀態應用程式，這通常不是問題（一旦叢集檢測到受影響的節點或 Pod 出現故障，ReplicaSet 就會添加一個新的 Pod）。
對於有狀態的應用程式，情況要複雜得多。如果你使用一個 StatefulSet，
並且該 StatefulSet 中的一個 Pod 在某個節點上發生了不乾淨故障，則該受影響的 Pod 將被標記爲終止（Terminating）；
StatefulSet 無法創建替換 Pod，因爲該 Pod 仍存在於叢集中。
因此，在 StatefulSet 上運行的應用程式可能會降級甚至離線。
如果已關閉的原節點再次出現，該節點上的 kubelet 會執行報到操作，刪除現有的 Pod，
並且控制平面會在不同的運行節點上爲該 StatefulSet 生成一個替換 Pod。
如果原節點出現故障並且沒有恢復，這些有狀態的 Pod 將處於終止狀態且無限期地停留在該故障節點上。

```
$ kubectl get pod -o wide
NAME    READY   STATUS        RESTARTS   AGE   IP           NODE                      NOMINATED NODE   READINESS GATES
web-0   1/1     Running       0          100m   10.244.2.4   k8s-node-876-1639279816   <none>           <none>
web-1   1/1     Terminating   0          100m   10.244.1.3   k8s-node-433-1639279804   <none>           <none>
```

<!--
## Try out the new non-graceful shutdown handling

To use the non-graceful node shutdown handling, you must enable the `NodeOutOfServiceVolumeDetach`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for the `kube-controller-manager`
component.
-->
## 嘗試新的非體面關閉處理

要使用節點非體面關閉處理，你必須爲 `kube-controller-manager` 組件啓用
`NodeOutOfServiceVolumeDetach` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
In the case of a node shutdown, you can manually taint that node as out of service. You should make certain that
the node is truly shutdown (not in the middle of restarting) before you add that taint. You could add that
taint following a shutdown that the kubelet did not detect and handle in advance; another case where you
can use that taint is when the node is in a non-recoverable state due to a hardware failure or a broken OS.
The values you set for that taint can be `node.kubernetes.io/out-of-service=nodeshutdown: "NoExecute"`
or `node.kubernetes.io/out-of-service=nodeshutdown:" NoSchedule"`.
Provided you have enabled the feature gate mentioned earlier, setting the out-of-service taint on a Node
means that pods on the node will be deleted unless if there are matching tolerations on the pods.
Persistent volumes attached to the shutdown node will be detached, and for StatefulSets, replacement pods will
be created successfully on a different running node.
-->
在節點關閉的情況下，你可以手動爲該節點標記污點，標示其已停止服務。
在添加污點之前，你應該確保節點確實關閉了（不是在重啓過程中）。
你可以在發生了節點關閉事件，且該事件沒有被 kubelet 提前檢測和處理的情況下，在節點關閉之後添加污點；
你可以使用該污點的另一種情況是當節點由於硬件故障或操作系統損壞而處於不可恢復狀態時。
你可以爲該污點設置的值是 `node.kubernetes.io/out-of-service=nodeshutdown: "NoExecute"` 或
`node.kubernetes.io/out-of-service=nodeshutdown: "NoSchedule"`。
如果你已經啓用了前面提到的特性門控，在節點上設置 out-of-service 污點意味着節點上的 Pod 將被刪除，
除非 Pod 上設置有與之匹配的容忍度。原來掛接到已關閉節點的持久卷（Persistent volume）將被解除掛接，
對於 StatefulSet，系統將在不同的運行節點上成功創建替換 Pod。

```
$ kubectl taint nodes <node-name> node.kubernetes.io/out-of-service=nodeshutdown:NoExecute

$ kubectl get pod -o wide
NAME    READY   STATUS    RESTARTS   AGE    IP           NODE                      NOMINATED NODE   READINESS GATES
web-0   1/1     Running   0          150m   10.244.2.4   k8s-node-876-1639279816   <none>           <none>
web-1   1/1     Running   0          10m    10.244.1.7   k8s-node-433-1639279804   <none>           <none>
```

<!--
Note: Before applying the out-of-service taint, you **must** verify that a node is already in shutdown or power off state (not in the middle of restarting), 
either because the user intentionally shut it down or the node is down due to hardware failures, OS issues, etc.
-->
注意：在應用 out-of-service 污點之前，你**必須**確認節點是否已經處於關閉或斷電狀態（不是在重新啓動過程中），
節點關閉的原因可能是使用者有意將其關閉，也可能是節點由於硬件故障、操作系統問題等而關閉。

<!--
Once all the workload pods that are linked to the out-of-service node are moved to a new running node, and the shutdown node has been recovered, you should remove
that taint on the affected node after the node is recovered.
If you know that the node will not return to service, you could instead delete the node from the cluster.
-->
一旦關聯到無法提供服務的節點的所有工作負載 Pod 都被移動到新的運行中的節點，並且關閉了的節點也已恢復，
你應該在節點恢復後刪除受影響節點上的污點。如果你知道該節點不會恢復服務，則可以改爲從叢集中刪除該節點。

<!--
## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the Non-Graceful Node Shutdown implementation to Beta in either 1.25 or 1.26.
-->
## 下一步是什麼？

根據反饋和採用情況，Kubernetes 團隊計劃在 1.25 或 1.26 版本中將節點非體面關閉實現推送到 Beta 階段。

<!--
This feature requires a user to manually add a taint to the node to trigger workloads failover and remove the taint after the node is recovered. 
In the future, we plan to find ways to automatically detect and fence nodes that are shutdown/failed and automatically failover workloads to another node.
-->
此功能需要使用者手動向節點添加污點以觸發工作負載故障轉移，並要求使用者在節點恢復後移除污點。
未來，我們計劃尋找方法來自動檢測和隔離已關閉的或已失敗的節點，並自動將工作負載故障轉移到另一個節點。

<!--
## How can I learn more?

Check out the [documentation](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)
for non-graceful node shutdown.
-->
## 怎樣才能瞭解更多？

查看節點非體面關閉相關[文檔](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)。

<!--
## How to get involved?
-->
## 如何參與？

<!--
This feature has a long story. Yassine Tijani ([yastij](https://github.com/yastij)) started the KEP more than two years ago. 
Xing Yang ([xing-yang](https://github.com/xing-yang)) continued to drive the effort. 
There were many discussions among SIG Storage, SIG Node, and API reviewers to nail down the design details. 
Ashutosh Kumar ([sonasingh46](https://github.com/sonasingh46)) did most of the implementation and brought it to Alpha in Kubernetes 1.24.
-->
此功能特性由來已久。Yassine Tijani（[yastij](https://github.com/yastij)）在兩年多前啓動了這個 KEP。
Xing Yang（[xing-yang](https://github.com/xing-yang)）繼續推動這項工作。
SIG-Storage、SIG-Node 和 API 評審人員們進行了多次討論，以確定設計細節。
Ashutosh Kumar（[sonasingh46](https://github.com/sonasingh46)）
完成了大部分實現並在 Kubernetes 1.24 版本中將其引進到 Alpha 階段。

<!--
We want to thank the following people for their insightful reviews: Tim Hockin  ([thockin](https://github.com/thockin)) for his guidance on the design, 
Jing Xu ([jingxu97](https://github.com/jingxu97)), Hemant Kumar ([gnufied](https://github.com/gnufied)), and Michelle Au ([msau42](https://github.com/msau42)) for reviews from SIG Storage side, 
and Mrunal Patel ([mrunalp](https://github.com/mrunalp)), David Porter ([bobbypage](https://github.com/bobbypage)), Derek Carr ([derekwaynecarr](https://github.com/derekwaynecarr)), 
and Danielle Endocrimes ([endocrimes](https://github.com/endocrimes)) for reviews from SIG Node side.
-->
我們要感謝以下人員的評審：Tim Hockin（[thockin](https://github.com/thockin)）對設計的指導；
來自 SIG-Storage 的 Jing Xu（[jingxu97](https://github.com/jingxu97)）、
Hemant Kumar（[gnufied](https://github.com/gnufied)）
和 Michelle Au（[msau42](https://github.com/msau42)）的評論；
以及 Mrunal Patel（[mrunalp](https://github.com/mrunalp)）、
David Porter（[bobbypage](https://github.com/bobbypage)）、
Derek Carr（[derekwaynecarr](https://github.com/derekwaynecarr)）
和 Danielle Endocrimes（[endocrimes](https://github.com/endocrimes)）來自 SIG-Node 方面的評論。

<!--
There are many people who have helped review the design and implementation along the way. 
We want to thank everyone who has contributed to this effort including the about 30 people who have reviewed the [KEP](https://github.com/kubernetes/enhancements/pull/1116) and implementation over the last couple of years.
-->
在此過程中，有很多人幫助審查了設計和實現。我們要感謝所有爲此做出貢獻的人，
包括在過去幾年中審覈 [KEP](https://github.com/kubernetes/enhancements/pull/1116) 和實現的大約 30 人。

<!--
This feature is a collaboration between SIG Storage and SIG Node. 
For those interested in getting involved with the design and development of any part of the Kubernetes Storage system, 
join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). 
For those interested in getting involved with the design and development of the components that support the controlled interactions between pods and host resources, 
join the [Kubernetes Node SIG](https://github.com/kubernetes/community/tree/master/sig-node).
-->
此特性是 SIG-Storage 和 SIG-Node 之間的協作。
對於那些有興趣參與 Kubernetes Storage 系統任何部分的設計和開發的人，
請加入 [Kubernetes 儲存特別興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG-Storage）。
對於那些有興趣參與支持 Pod 和主機資源之間受控交互的組件的設計和開發的人，
請加入 [Kubernetes Node SIG](https://github.com/kubernetes/community/tree/master/sig-node)。
