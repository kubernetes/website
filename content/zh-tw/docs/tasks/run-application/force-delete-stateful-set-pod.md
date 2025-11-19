---
title: 強制刪除 StatefulSet 中的 Pod
content_type: task
weight: 70
---
<!--
reviewers:
- bprashanth
- erictune
- foxish
- smarterclayton
title: Force Delete StatefulSet Pods
content_type: task
weight: 70
-->

<!-- overview -->

<!--
This page shows how to delete Pods which are part of a
{{< glossary_tooltip text="stateful set" term_id="StatefulSet" >}},
and explains the considerations to keep in mind when doing so.
-->
本文介紹如何刪除 {{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}}
管理的 Pod，並解釋這樣操作時需要記住的一些注意事項。

## {{% heading "prerequisites" %}}

<!--
- This is a fairly advanced task and has the potential to violate some of the properties
  inherent to StatefulSet.
- Before proceeding, make yourself familiar with the considerations enumerated below.
-->
- 這是一項相當高級的任務，並且可能會違反 StatefulSet 固有的某些屬性。
- 請先熟悉下面列舉的注意事項再開始操作。

<!-- steps -->

<!--
## StatefulSet considerations

In normal operation of a StatefulSet, there is **never** a need to force delete a StatefulSet Pod.
The [StatefulSet controller](/docs/concepts/workloads/controllers/statefulset/) is responsible for
creating, scaling and deleting members of the StatefulSet. It tries to ensure that the specified
number of Pods from ordinal 0 through N-1 are alive and ready. StatefulSet ensures that, at any time,
there is at most one Pod with a given identity running in a cluster. This is referred to as
*at most one* semantics provided by a StatefulSet.
-->
## StatefulSet 注意事項   {#statefulset-considerations}

在正常操作 StatefulSet 時，**永遠不**需要強制刪除 StatefulSet 管理的 Pod。
[StatefulSet 控制器](/zh-cn/docs/concepts/workloads/controllers/statefulset/)負責創建、
擴縮和刪除 StatefulSet 管理的 Pod。此控制器盡力確保指定數量的從序數 0 到 N-1 的 Pod
處於活躍狀態並準備就緒。StatefulSet 確保在任何時候，叢集中最多隻有一個具有給定標識的 Pod。
這就是所謂的由 StatefulSet 提供的**最多一個（At Most One）** Pod 的語義。

<!--
Manual force deletion should be undertaken with caution, as it has the potential to violate the
at most one semantics inherent to StatefulSet. StatefulSets may be used to run distributed and
clustered applications which have a need for a stable network identity and stable storage.
These applications often have configuration which relies on an ensemble of a fixed number of
members with fixed identities. Having multiple members with the same identity can be disastrous
and may lead to data loss (e.g. split brain scenario in quorum-based systems).
-->
應謹慎進行手動強制刪除操作，因爲它可能會違反 StatefulSet 固有的至多一個的語義。
StatefulSet 可用於運行分佈式和叢集級的應用，這些應用需要穩定的網路標識和可靠的存儲。
這些應用通常設定爲具有固定標識固定數量的成員集合。
具有相同身份的多個成員可能是災難性的，並且可能導致數據丟失 (例如票選系統中的腦裂場景)。

<!--
## Delete Pods

You can perform a graceful pod deletion with the following command:
-->
## 刪除 Pod   {#delete-pods}

你可以使用下面的命令執行體面地刪除 Pod：

```shell
kubectl delete pods <pod>
```

<!--
For the above to lead to graceful termination, the Pod **must not** specify a
`pod.Spec.TerminationGracePeriodSeconds` of 0. The practice of setting a
`pod.Spec.TerminationGracePeriodSeconds` of 0 seconds is unsafe and strongly discouraged
for StatefulSet Pods. Graceful deletion is safe and will ensure that the Pod
[shuts down gracefully](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
before the kubelet deletes the name from the apiserver.
-->
爲了讓上面操作能夠體面地終止 Pod，Pod **一定不能**設置 `pod.Spec.TerminationGracePeriodSeconds` 爲 0。
將 `pod.Spec.TerminationGracePeriodSeconds` 設置爲 0 秒的做法是不安全的，強烈建議 StatefulSet 類型的
Pod 不要使用。體面刪除是安全的，並且會在 kubelet 從 API 伺服器中刪除資源名稱之前確保
[體面地結束 Pod](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。

<!--
A Pod is not deleted automatically when a node is unreachable.
The Pods running on an unreachable Node enter the 'Terminating' or 'Unknown' state after a
[timeout](/docs/concepts/architecture/nodes/#condition).
Pods may also enter these states when the user attempts graceful deletion of a Pod
on an unreachable Node.
The only ways in which a Pod in such a state can be removed from the apiserver are as follows:
-->
當某個節點不可達時，不會引發自動刪除 Pod。在無法訪問的節點上運行的 Pod
在[超時](/zh-cn/docs/concepts/architecture/nodes/#condition)後會進入
“Terminating” 或者 “Unknown” 狀態。
當使用者嘗試體面地刪除無法訪問的節點上的 Pod 時 Pod 也可能會進入這些狀態。
從 API 伺服器上刪除處於這些狀態 Pod 的僅有可行方法如下：

<!--
- The Node object is deleted (either by you, or by the
  [Node Controller](/docs/concepts/architecture/nodes/#node-controller)).
- The kubelet on the unresponsive Node starts responding, kills the Pod and removes the entry
   from the apiserver.
- Force deletion of the Pod by the user.
-->
- 刪除 Node 對象（要麼你來刪除, 要麼[節點控制器](/zh-cn/docs/concepts/architecture/nodes/#node-controller)
  來刪除）
- 無響應節點上的 kubelet 開始響應，殺死 Pod 並從 API 伺服器上移除 Pod 對象
- 使用者強制刪除 Pod

<!--
The recommended best practice is to use the first or second approach. If a Node is confirmed
to be dead (e.g. permanently disconnected from the network, powered down, etc), then delete
the Node object. If the Node is suffering from a network partition, then try to resolve this
or wait for it to resolve. When the partition heals, the kubelet will complete the deletion
of the Pod and free up its name in the apiserver.
-->
推薦使用第一種或者第二種方法。
如果確認節點已經不可用了（比如，永久斷開網路、斷電等），
則應刪除 Node 對象。
如果節點遇到網裂問題，請嘗試解決該問題或者等待其解決。
當網裂癒合時，kubelet 將完成 Pod 的刪除並從 API 伺服器上釋放其名字。

<!--
Normally, the system completes the deletion once the Pod is no longer running on a Node, or
the Node is deleted by an administrator. You may override this by force deleting the Pod.
-->
通常，Pod 一旦不在節點上運行，或者管理員刪除了節點，系統就會完成其刪除動作。
你也可以通過強制刪除 Pod 來繞過這一機制。

<!--
### Force Deletion

Force deletions **do not** wait for confirmation from the kubelet that the Pod has been terminated.
Irrespective of whether a force deletion is successful in killing a Pod, it will immediately
free up the name from the apiserver. This would let the StatefulSet controller create a replacement
Pod with that same identity; this can lead to the duplication of a still-running Pod,
and if said Pod can still communicate with the other members of the StatefulSet,
will violate the at most one semantics that StatefulSet is designed to guarantee.
-->
### 強制刪除    {#force-deletion}

強制刪除**不會**等待來自 kubelet 對 Pod 已終止的確認消息。
無論強制刪除是否成功殺死了 Pod，它都會立即從 API 伺服器中釋放該名字。
這將讓 StatefulSet 控制器創建一個具有相同標識的替身 Pod；因而可能導致正在運行 Pod 的重複，
並且如果所述 Pod 仍然可以與 StatefulSet 的成員通信，則將違反 StatefulSet
所要保證的最多一個的語義。

<!--
When you force delete a StatefulSet pod, you are asserting that the Pod in question will never
again make contact with other Pods in the StatefulSet and its name can be safely freed up for a
replacement to be created.
-->
當你強制刪除 StatefulSet 類型的 Pod 時，你要確保有問題的 Pod 不會再和 StatefulSet 管理的其他
Pod 通信並且可以安全地釋放其名字以便創建替代 Pod。

<!--
If you want to delete a Pod forcibly using kubectl version >= 1.5, do the following:
-->
如果要使用 kubectl 1.5 以上版本強制刪除 Pod，請執行下面命令：

```shell
kubectl delete pods <pod> --grace-period=0 --force
```

<!--
If you're using any version of kubectl <= 1.4, you should omit the `--force` option and use:
-->
如果你使用 kubectl 的 1.4 以下版本，則應省略 `--force` 選項：

```shell
kubectl delete pods <pod> --grace-period=0
```

<!--
If even after these commands the pod is stuck on `Unknown` state, use the following command to
remove the pod from the cluster:
-->
如果在執行這些命令後 Pod 仍處於 `Unknown` 狀態，請使用以下命令從叢集中刪除 Pod：

```shell
kubectl patch pod <pod> -p '{"metadata":{"finalizers":null}}'
```

<!--
Always perform force deletion of StatefulSet Pods carefully and with complete knowledge of the risks involved.
-->
請始終謹慎地執行強制刪除 StatefulSet 類型的 Pod，並充分了解強制刪除操作所涉及的風險。

## {{% heading "whatsnext" %}}

<!--
Learn more about [debugging a StatefulSet](/docs/tasks/debug/debug-application/debug-statefulset/).
-->
進一步瞭解[調試 StatefulSet](/zh-cn/docs/tasks/debug/debug-application/debug-statefulset/)。
