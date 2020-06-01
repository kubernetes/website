---
reviewers:
- bprashanth
- erictune
- foxish
- smarterclayton
title: 强制删除 StatefulSet 类型的 Pods
content_type: task
weight: 70
---

<!--
---
reviewers:
- bprashanth
- erictune
- foxish
- smarterclayton
title: Force Delete StatefulSet Pods
content_type: task
weight: 70
---
--->

<!-- overview -->
<!--
This page shows how to delete Pods which are part of a stateful set, and explains the considerations to keep in mind when doing so.
--->
本文介绍了如何删除 StatefulSet 管理的部分 pods，并且解释了这样操作时需要记住的注意事项。


## {{% heading "prerequisites" %}}


<!--
* This is a fairly advanced task and has the potential to violate some of the properties inherent to StatefulSet.
* Before proceeding, make yourself familiar with the considerations enumerated below.
--->
* 这是一项相当高级的任务，并且可能会违反 StatefulSet 固有的某些属性。
* 继续任务之前，请熟悉下面列举的注意事项。



<!-- steps -->

<!--
## StatefulSet considerations
--->
## StatefulSet 注意事项

<!--
In normal operation of a StatefulSet, there is **never** a need to force delete a StatefulSet Pod. The StatefulSet controller is responsible for creating, scaling and deleting members of the StatefulSet. It tries to ensure that the specified number of Pods from ordinal 0 through N-1 are alive and ready. StatefulSet ensures that, at any time, there is at most one Pod with a given identity running in a cluster. This is referred to as *at most one* semantics provided by a StatefulSet.
--->
在 StatefulSet 的正常操作中，**永远不**需要强制删除 StatefulSet 管理的 pod。StatefulSet 控制器负责创建，扩容和删除 StatefulSet 管理的 pods。它尝试确保从序号 0 到 N-1 指定数量的 pods 处于活动状态并准备就绪。StatefulSet 确保在任何时候，集群中最多只有一个具有给定标识的 pod。这就是所谓的由 StatefulSet 提供的*最多一个*的语义。

<!--
Manual force deletion should be undertaken with caution, as it has the potential to violate the at most one semantics inherent to StatefulSet. StatefulSets may be used to run distributed and clustered applications which have a need for a stable network identity and stable storage. These applications often have configuration which relies on an ensemble of a fixed number of members with fixed identities. Having multiple members with the same identity can be disastrous and may lead to data loss (e.g. split brain scenario in quorum-based systems).
--->
应谨慎进行手动强制删除操作，因为它可能会违反 StatefulSet 固有的至多一个的语义。StatefulSets 可用于运行分布式和集群级的应用，这些应用需要稳定的网络标识和可靠的存储。这些应用通常配置为具有固定标识固定数量的成员集合。具有相同身份的多个成员可能是灾难性的，并且可能导致数据丢失 (e.g. 基于 quorum 系统中的脑裂场景)。

<!--
## Delete Pods
--->
## 删除 Pods

<!--
You can perform a graceful pod deletion with the following command:
--->
您可以使用下面的命令执行优雅地删除 pod:

```shell
kubectl delete pods <pod>
```

<!--
For the above to lead to graceful termination, the Pod **must not** specify a `pod.Spec.TerminationGracePeriodSeconds` of 0. The practice of setting a `pod.Spec.TerminationGracePeriodSeconds` of 0 seconds is unsafe and strongly discouraged for StatefulSet Pods. Graceful deletion is safe and will ensure that the [Pod shuts down gracefully](/docs/user-guide/pods/#termination-of-pods) before the kubelet deletes the name from the apiserver.
--->
为了使上面的方法能够正常终止，Pod **一定不能**设置  `pod.Spec.TerminationGracePeriodSeconds` 为 0。将 `pod.Spec.TerminationGracePeriodSeconds` 设置为 0s 的做法是不安全的，强烈建议 StatefulSet 类型的 pods 不要使用。优雅删除是安全的，并且会在 kubelet 从 apiserver 中删除名称之前确保 [优雅地关闭 pod ](/docs/user-guide/pods/#termination-of-pods)。

<!--
Kubernetes (versions 1.5 or newer) will not delete Pods just because a Node is unreachable. The Pods running on an unreachable Node enter the 'Terminating' or 'Unknown' state after a [timeout](/docs/admin/node/#node-condition). Pods may also enter these states when the user attempts graceful deletion of a Pod on an unreachable Node. The only ways in which a Pod in such a state can be removed from the apiserver are as follows:
--->
Kubernetes (1.5 版本或者更新版本)不会因为一个 Node 无法访问而删除 pods。在无法访问节点上运行的 pods 在[超时](/docs/admin/node/#node-condition)后会进入'Terminating' 或者 'Unknown' 状态。当用户尝试优雅删除无法访问节点上的 pod 时，pods 也可能会进入这些状态。从 apiserver 中删除处于这些状态 pod 的唯一方法如下：

<!--
   * The Node object is deleted (either by you, or by the [Node Controller](/docs/admin/node)).<br/>
   * The kubelet on the unresponsive Node starts responding, kills the Pod and removes the entry from the apiserver.<br/>
   * Force deletion of the Pod by the user.
--->
   * Node 对象被删除(要么您删除, 或者[Node Controller](/docs/admin/node))。<br/>
   * 无响应节点上的 kubelet 开始响应，杀死 pod 并从 apiserver 中移除该条目。<br/>
   * 用户强制删除 pod。

<!--
The recommended best practice is to use the first or second approach. If a Node is confirmed to be dead (e.g. permanently disconnected from the network, powered down, etc), then delete the Node object. If the Node is suffering from a network partition, then try to resolve this or wait for it to resolve. When the partition heals, the kubelet will complete the deletion of the Pod and free up its name in the apiserver.
--->
推荐使用第一种或者第二种方法。如果确认节点已经不可用了 (比如，永久断开网络，断电等)，则删除 Node 对象。如果节点遇到网裂，请尝试解决该问题或者等待其解决。当网裂愈合时，kubelet 将完成 pod 的删除并从 apiserver 中释放其名字。

<!--
Normally, the system completes the deletion once the Pod is no longer running on a Node, or the Node is deleted by an administrator. You may override this by force deleting the Pod.
--->
通常，pod 一旦不在节点上运行，或者管理员删除了节点，系统就会完成删除。你可以通过强制删除 pod 来覆盖它。

<!--
### Force Deletion
--->
### 强制删除

<!--
Force deletions **do not** wait for confirmation from the kubelet that the Pod has been terminated. Irrespective of whether a force deletion is successful in killing a Pod, it will immediately free up the name from the apiserver. This would let the StatefulSet controller create a replacement Pod with that same identity; this can lead to the duplication of a still-running Pod, and if said Pod can still communicate with the other members of the StatefulSet, will violate the at most one semantics that StatefulSet is designed to guarantee.
--->
强制删除**不要**等待来自 kubelet 的确认 pod 已被终止。无论强制删除是否成功杀死了 pod，它都会立即从 apiserver 中释放该名字。这将让 StatefulSet 控制器创建一个具有相同标识的替换 pod；这可能导致正在运行 pod 的重复，并且如果所述 pod 仍然可以与 StatefulSet 的成员通信，则将违反 StatefulSet 旨在保证的最多一个的语义。

<!--
When you force delete a StatefulSet pod, you are asserting that the Pod in question will never again make contact with other Pods in the StatefulSet and its name can be safely freed up for a replacement to be created.
--->
当你强制删除 StatefulSet 类型的 pod 时，你要确保有问题的 pod 不会再和 StatefulSet 管理的其他 pods通信，并且可以安全地释放其名字以便创建替换 pod。

<!--
If you want to delete a Pod forcibly using kubectl version >= 1.5, do the following:
--->
如果要使用 kubectl version >= 1.5 强制删除 pod，请执行下面命令：

```shell
kubectl delete pods <pod> --grace-period=0 --force
```

<!--
If you're using any version of kubectl <= 1.4, you should omit the `--force` option and use:
--->
如果您使用 kubectl <= 1.4 的任何版本，则应省略 `--force` 选项：

```shell
kubectl delete pods <pod> --grace-period=0
```
<!--
If even after these commands the pod is stuck on `Unknown` state, use the following command to remove the pod from the cluster:
--->
如果在这些命令后 pod 仍处于`Unknown`状态，请使用以下命令从集群中删除 pod:

```shell
kubectl patch pod <pod> -p '{"metadata":{"finalizers":null}}'
```

<!--
Always perform force deletion of StatefulSet Pods carefully and with complete knowledge of the risks involved.
--->
请始终谨慎地执行强制删除 StatefulSet 类型的 pods，并完全了解所涉及地风险。



## {{% heading "whatsnext" %}}


<!--
Learn more about [debugging a StatefulSet](/docs/tasks/debug-application-cluster/debug-stateful-set/).
--->
进一步了解[调试 StatefulSet](/docs/tasks/debug-application-cluster/debug-stateful-set/)。


