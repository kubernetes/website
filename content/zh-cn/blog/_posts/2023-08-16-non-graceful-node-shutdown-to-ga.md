---
layout: blog
title: "Kubernetes 1.28: 节点非体面关闭进入 GA 阶段（正式发布）"
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

**译者：** Xin Li (Daocloud)

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
Kubernetes 节点非体面关闭特性现已在 Kubernetes v1.28 中正式发布。

此特性在 Kubernetes v1.24 中作为 [Alpha](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown)
特性引入，并在 Kubernetes v1.26 中转入 [Beta](https://kubernetes.io/blog/2022/12/16/kubernetes-1-26-non-graceful-node-shutdown-beta/)
阶段。如果原始节点意外关闭或最终处于不可恢复状态（例如硬件故障或操作系统无响应），
此特性允许有状态工作负载在不同节点上重新启动。

<!--
## What is a Non-Graceful Node Shutdown

In a Kubernetes cluster, a node can be shutdown in a planned graceful way or
unexpectedly because of reasons such as power outage or something else external.
A node shutdown could lead to workload failure if the node is not drained
before the shutdown. A node shutdown can be either graceful or non-graceful.
-->
## 什么是节点非体面关闭

在 Kubernetes 集群中，节点可能会按计划正常关闭，也可能由于断电或其他外部原因而意外关闭。
如果节点在关闭之前未腾空，则节点关闭可能会导致工作负载失败。节点关闭可以是正常关闭，也可以是非正常关闭。

<!--
The [Graceful Node Shutdown](https://kubernetes.io/blog/2021/04/21/graceful-node-shutdown-beta/)
feature allows Kubelet to detect a node shutdown event, properly terminate the pods,
and release resources, before the actual shutdown.
-->
[节点体面关闭](https://kubernetes.io/blog/2021/04/21/graceful-node-shutdown-beta/)特性允许
kubelet 在实际关闭之前检测节点关闭事件、正确终止该节点上的 Pod 并释放资源。

<!--
When a node is shutdown but not detected by Kubelet's Node Shutdown Manager,
this becomes a non-graceful node shutdown.
Non-graceful node shutdown is usually not a problem for stateless apps, however,
it is a problem for stateful apps.
The stateful application cannot function properly if the pods are stuck on the
shutdown node and are not restarting on a running node.
-->
当节点关闭但 kubelet 的节点关闭管理器未检测到时，将造成节点非体面关闭。
对于无状态应用程序来说，节点非体面关闭通常不是问题，但是对于有状态应用程序来说，这是一个问题。
如果 Pod 停留在关闭节点上并且未在正在运行的节点上重新启动，则有状态应用程序将无法正常运行。

<!--
In the case of a non-graceful node shutdown, you can manually add an `out-of-service` taint on the Node.
-->
在节点非体面关闭的情况下，你可以在 Node 上手动添加 `out-of-service` 污点。

```
kubectl taint nodes <node-name> node.kubernetes.io/out-of-service=nodeshutdown:NoExecute
```

<!--
This taint triggers pods on the node to be forcefully deleted if there are no
matching tolerations on the pods. Persistent volumes attached to the shutdown node
will be detached, and new pods will be created successfully on a different running
node.
-->
如果 Pod 上没有与之匹配的容忍规则，则此污点会触发节点上的 Pod 被强制删除。
挂接到关闭中的节点的持久卷将被解除挂接，新的 Pod 将在不同的运行节点上成功创建。

<!--
**Note:** Before applying the out-of-service taint, you must verify that a node is
already in shutdown or power-off state (not in the middle of restarting).

Once all the workload pods that are linked to the out-of-service node are moved to
a new running node, and the shutdown node has been recovered, you should remove that
taint on the affected node after the node is recovered.
-->
**注意：** 在应用 out-of-service 污点之前，你必须验证节点是否已经处于关闭或断电状态（而不是在重新启动中）。

与 out-of-service 节点有关联的所有工作负载的 Pod 都被移动到新的运行节点，
并且所关闭的节点已恢复之后，你应该删除受影响节点上的污点。

<!--
## What’s new in stable

With the promotion of the Non-Graceful Node Shutdown feature to stable, the
feature gate  `NodeOutOfServiceVolumeDetach` is locked to true on
`kube-controller-manager` and cannot be disabled.
-->
## 稳定版中有哪些新内容

随着非正常节点关闭功能提升到稳定状态，特性门控
`NodeOutOfServiceVolumeDetach` 在 `kube-controller-manager` 上被锁定为 true，并且无法禁用。

<!--
Metrics `force_delete_pods_total` and `force_delete_pod_errors_total` in the
Pod GC Controller are enhanced to account for all forceful pods deletion.
A reason is added to the metric to indicate whether the pod is forcefully deleted
because it is terminated, orphaned, terminating with the `out-of-service` taint,
or terminating and unscheduled.
-->
Pod GC 控制器中的指标 `force_delete_pods_total` 和 `force_delete_pod_errors_total`
得到增强，以考虑所有 Pod 的强制删除情况。
指标中会添加一个 "reason"，以指示 Pod 是否因终止、孤儿、因 `out-of-service`
污点而终止或因未计划终止而被强制删除。

<!--
A "reason" is also added to the metric `attachdetach_controller_forced_detaches`
in the Attach Detach Controller to indicate whether the force detach is caused by
the `out-of-service` taint or a timeout.
-->
Attach Detach Controller 中的指标 `attachdetach_controller_forced_detaches`
中还会添加一个 "reason"，以指示强制解除挂接是由 `out-of-service` 污点还是超时引起的。

<!--
## What’s next?

This feature requires a user to manually add a taint to the node to trigger
workloads failover and remove the taint after the node is recovered.
In the future, we plan to find ways to automatically detect and fence nodes
that are shutdown/failed and automatically failover workloads to another node.
-->
## 接下来

此特性要求用户手动向节点添加污点以触发工作负载故障转移，并在节点恢复后删除污点。
未来，我们计划找到方法来自动检测和隔离关闭/失败的节点，并自动将工作负载故障转移到另一个节点。

<!--
## How can I learn more?

Check out additional documentation on this feature
[here](https://kubernetes.io/docs/concepts/architecture/nodes/#non-graceful-node-shutdown).
-->
## 如何了解更多？

在[此处](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)可以查看有关此特性的其他文档。

<!--
## How to get involved?

We offer a huge thank you to all the contributors who helped with design,
implementation, and review of this feature and helped move it from alpha, beta, to stable:
-->
我们非常感谢所有帮助设计、实现和审查此功能并帮助其从 Alpha、Beta 到稳定版的贡献者：

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
此特性是 SIG Storage 和 SIG Node 之间的协作。对于那些有兴趣参与 Kubernetes
存储系统任何部分的设计和开发的人，请加入 Kubernetes 存储特别兴趣小组（SIG）。
对于那些有兴趣参与支持 Pod 和主机资源之间受控交互的组件的设计和开发，请加入 Kubernetes Node SIG。
