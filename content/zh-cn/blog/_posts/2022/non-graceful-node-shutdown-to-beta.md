---
layout: blog
title: "Kubernetes 1.26: 节点非体面关闭进入 Beta 阶段"
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

**译者：** Xin Li (DaoCloud)

Kubernetes v1.24 [引入](https://kubernetes.io/blog/2022/05/20/kubernetes-1-24-non-graceful-node-shutdown-alpha/)
了用于处理[节点非体面关闭](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)改进的
Alpha 质量实现。

<!--
## What is a node shutdown in Kubernetes?

In a Kubernetes cluster, it is possible for a node to shut down. This could happen either in a planned way or it could happen unexpectedly. You may plan for a security patch, or a kernel upgrade and need to reboot the node, or it may shut down due to preemption of VM instances. A node may also shut down due to a hardware failure or a software problem.
-->
## 什么是 Kubernetes 中的节点关闭

在 Kubernetes 集群中，节点可能会关闭。这可能在计划内发生，也可能意外发生。
你可能计划进行安全补丁或内核升级并需要重新启动节点，或者它可能由于 VM 实例抢占而关闭。
节点也可能由于硬件故障或软件问题而关闭。

<!--
To trigger a node shutdown, you could run a `shutdown` or `poweroff` command in a shell,
 or physically press a button to power off a machine.

A node shutdown could lead to workload failure if the node is not drained before the shutdown.

In the following, we will describe what is a graceful node shutdown and what is a non-graceful node shutdown.
-->
要触发节点关闭，你可以在 shell 中运行 `shutdown` 或 `poweroff` 命令，或者按下按钮关闭机器电源。

下面分别介绍什么是节点体面关闭，什么是节点非体面关闭。

<!--
## What is a _graceful_ node shutdown?

The kubelet's handling for a [graceful node shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown)
allows the kubelet to detect a node shutdown event, properly terminate the pods on that node,
and release resources before the actual shutdown.
[Critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
are terminated after all the regular pods are terminated, to ensure that the
essential functions of an application can continue to work as long as possible.
-->
## 什么是节点**体面**关闭？

kubelet 对[节点体面关闭](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)
的处理在于允许 kubelet 检测节点关闭事件，正确终止该节点上的 Pod，并在实际关闭之前释放资源。
[关键 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
在所有常规 Pod 终止后终止，以确保应用程序的基本功能可以尽可能长时间地继续工作。

<!--
## What is a _non-graceful_ node shutdown?

A Node shutdown can be graceful only if the kubelet's _node shutdown manager_ can
detect the upcoming node shutdown action. However, there are cases where a kubelet
does not detect a node shutdown action. This could happen because the `shutdown`
command does not trigger the [Inhibitor Locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit) mechanism used by the kubelet on Linux, or because of a user error. For example, if
the `shutdownGracePeriod` and `shutdownGracePeriodCriticalPods` details are not
configured correctly for that node.
-->
## 什么是节点**非体面**关闭？

仅当 kubelet 的**节点关闭管理器**可以检测到即将到来的节点关闭操作时，节点关闭才可能是体面的。
但是，在某些情况下，kubelet 不能检测到节点关闭操作。
这可能是因为 `shutdown` 命令没有触发 Linux 上 kubelet 使用的 [Inhibitor Locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit)
机制，或者是因为用户的失误导致。
例如，如果该节点的 `shutdownGracePeriod` 和 `shutdownGracePeriodCriticalPods` 详细信息配置不正确。

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
当一个节点关闭（或崩溃），并且 kubelet 节点关闭管理器**没有**检测到该关闭时，
就出现了非体面的节点关闭。节点非体面关闭对于有状态应用程序而言是一个问题。
如果节点以非正常方式关闭且节点上存在属于某 StatefulSet 的 Pod，
则该 Pod 将被无限期地阻滞在 `Terminating` 状态，并且控制平面无法在健康节点上为该 StatefulSet 创建替代 Pod。
你可以手动删除失败的 Pod，但这对于集群自愈来说并不是理想状态。
同样，作为 Deployment 的一部分创建的 ReplicaSet 中的 Pod 也将滞留在 `Terminating` 状态，
对于绑定到正在被关闭的节点上的其他 Pod，也将无限期地处于 `Terminating` 状态。
如果你设置了水平缩放限制，即使那些处于终止过程中的 Pod 也会被计入该限制，
因此如果你的工作负载已经达到最大缩放比例，则它可能难以自我修复。
（顺便说一句：如果非体面关闭的节点重新启动，kubelet 确实会删除旧的 Pod，并且控制平面可以进行替换。）

<!--
## What's new for the beta?

For Kubernetes v1.26, the non-graceful node shutdown feature is beta and enabled by default.
The `NodeOutOfServiceVolumeDetach`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled by default
on `kube-controller-manager` instead of being opt-in; you can still disable it if needed
(please also file an issue to explain the problem).
-->

## Beta 阶段带来的新功能
在 Kubernetes v1.26 中，非体面节点关闭特性是 Beta 版，默认被启用。
`NodeOutOfServiceVolumeDetach` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)在
`kube-controller-manager` 中从可选启用变成默认启用。如果需要，
你仍然可以选择禁用此特性（也请提交一个 issue 来解释问题）。

<!--
On the instrumentation side, the kube-controller-manager reports two new metrics.

`force_delete_pods_total`
: number of pods that are being forcibly deleted (resets on Pod garbage collection controller restart)

`force_delete_pod_errors_total`
: number of errors encountered when attempting forcible Pod deletion (also resets on Pod garbage collection controller restart)
-->
在检测方面，kub​​e-controller-manager 报告了两个新指标。

`force_delete_pods_total`：被强制删除的 Pod 数（在 Pod 垃圾收集控制器重启时重置）

`force_delete_pod_errors_total`：尝试强制删除 Pod 时遇到的错误数（也会在 Pod 垃圾收集控制器重启时重置）

<!--
## How does it work?

In the case of a node shutdown, if a graceful shutdown is not working or the node is in a
non-recoverable state due to hardware failure or broken OS, you can manually add an `out-of-service`
taint on the Node. For example, this can be `node.kubernetes.io/out-of-service=nodeshutdown:NoExecute`
or `node.kubernetes.io/out-of-service=nodeshutdown:NoSchedule`. This taint trigger pods on the node to
be forcefully deleted if there are no matching tolerations on the pods. Persistent volumes attached to the shutdown node will be detached, and new pods will be created successfully on a different running node.
-->
## 它是如何工作的？

在节点关闭的情况下，如果正常关闭不起作用或节点由于硬件故障或操作系统损坏而处于不可恢复状态，
你可以在 Node 上手动添加 `out-of-service` 污点。
例如，污点可以是 `node.kubernetes.io/out-of-service=nodeshutdown:NoExecute` 或
`node.kubernetes.io/out-of-service=nodeshutdown:NoSchedule`。
如果 Pod 上没有与之匹配的容忍规则，则此污点会触发节点上的 Pod 被强制删除。
附加到关闭中的节点的持久卷将被分离，新的 Pod 将在不同的运行节点上成功创建。

```
kubectl taint nodes <node-name> node.kubernetes.io/out-of-service=nodeshutdown:NoExecute
```

<!--
**Note:** Before applying the out-of-service taint, you must verify that a node is already in shutdown
or power-off state (not in the middle of restarting), either because the user intentionally shut it down
or the node is down due to hardware failures, OS issues, etc.

Once all the workload pods that are linked to the out-of-service node are moved to a new running node, and the shutdown node has been recovered, you should remove that taint on the affected node after the node is recovered.
-->
**注意**：在应用 out-of-service 污点之前，你必须验证节点是否已经处于关闭或断电状态（而不是在重新启动中），
要么是因为用户有意关闭它，要么是由于硬件故障或操作系统问题等导致节点关闭。

与 out-of-service 节点有关联的所有工作负载的 Pod 都被移动到新的运行节点，
并且所关闭的节点已恢复之后，你应该删除受影响节点上的污点。

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
## 接下来

根据反馈和采用情况，Kubernetes 团队计划在 1.27 或 1.28 中将非体面节点关闭实现推向正式发布（GA）状态。

此功能需要用户手动向节点添加污点以触发工作负载的故障转移并在节点恢复后删除污点。

如果有一种编程方式可以确定节点确实关闭并且节点和存储之间没有 IO，
则集群操作员可以通过自动应用 `out-of-service` 污点来自动执行此过程。

在工作负载成功转移到另一个正在运行的节点并且曾关闭的节点已恢复后，集群操作员可以自动删除污点。

将来，我们计划寻找方法来自动检测来隔离已关闭或处于不可恢复状态的节点，
并将其工作负载故障转移到另一个节点。

<!--
## How can I learn more?

To learn more, read [Non Graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown) in the Kubernetes documentation.
-->
## 如何学习更多？

要了解更多信息，请阅读 Kubernetes 文档中的[非体面节点关闭](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)。

<!--
## How to get involved?

We offer a huge thank you to all the contributors who helped with design, implementation, and review of this feature:
-->
## 如何参与

我们非常感谢所有帮助设计、实施和审查此功能的贡献者：

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
一路上有很多人帮助审阅了设计和实现。我们要感谢为这项工作做出贡献的所有人，包括在过去几年中审查
[KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown)
和实现的大约 30 人。

此功能是 SIG Storage 和 SIG Node 之间的协作。对于那些有兴趣参与 Kubernetes
存储系统任何部分的设计和开发的人，请加入 Kubernetes 存储特别兴趣小组 (SIG)。
对于那些有兴趣参与支持 Pod 和主机资源之间受控交互的组件的设计和开发，请加入 Kubernetes Node SIG。

