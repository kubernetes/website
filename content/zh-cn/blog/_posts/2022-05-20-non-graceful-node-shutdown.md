---
layout: blog
title: "Kubernetes 1.24: 节点非体面关闭特性进入 Alpha 阶段"
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
Kubernetes v1.24 引入了对[节点非体面关闭](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown)
（Non-Graceful Node Shutdown）的 Alpha 支持。
此特性允许有状态工作负载在原节点关闭或处于不可恢复状态（如硬件故障或操作系统损坏）后，故障转移到不同的节点。

<!--
## How is this different from Graceful Node Shutdown
-->
## 这与节点体面关闭有何不同

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
你可能听说过 Kubernetes 的[节点体面关闭](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)特性，
并且想知道节点非体面关闭特性与之有何不同。节点体面关闭允许 Kubernetes 检测节点何时完全关闭，并适当地处理这种情况。
只有当 kubelet 在实际关闭之前检测到节点关闭动作时，节点关闭才是“体面（graceful）”的。
但是，在某些情况下，kubelet 可能检测不到节点关闭操作。
这可能是因为 shutdown 命令没有触发 kubelet 所依赖的 systemd 抑制锁机制，
或者是因为配置错误（`ShutdownGracePeriod` 和 `ShutdownGracePeriodCriticalPods` 配置不正确）。

<!--
Graceful node shutdown relies on Linux-specific support. The kubelet does not watch for upcoming
shutdowns on Windows nodes (this may change in a future Kubernetes release).
-->
节点体面关闭依赖于特定 Linux 的支持。
kubelet 不监视 Windows 节点上即将关闭的情况（这可能在未来的 Kubernetes 版本中会有所改变）。

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
当一个节点被关闭但 kubelet 没有检测到时，该节点上的 Pod 也会非体面地关闭。
对于无状态应用程序，这通常不是问题（一旦集群检测到受影响的节点或 Pod 出现故障，ReplicaSet 就会添加一个新的 Pod）。
对于有状态的应用程序，情况要复杂得多。如果你使用一个 StatefulSet，
并且该 StatefulSet 中的一个 Pod 在某个节点上发生了不干净故障，则该受影响的 Pod 将被标记为终止（Terminating）；
StatefulSet 无法创建替换 Pod，因为该 Pod 仍存在于集群中。
因此，在 StatefulSet 上运行的应用程序可能会降级甚至离线。
如果已关闭的原节点再次出现，该节点上的 kubelet 会执行报到操作，删除现有的 Pod，
并且控制平面会在不同的运行节点上为该 StatefulSet 生成一个替换 Pod。
如果原节点出现故障并且没有恢复，这些有状态的 Pod 将处于终止状态且无限期地停留在该故障节点上。

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
## 尝试新的非体面关闭处理

要使用节点非体面关闭处理，你必须为 `kube-controller-manager` 组件启用
`NodeOutOfServiceVolumeDetach` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

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
在节点关闭的情况下，你可以手动为该节点标记污点，标示其已停止服务。
在添加污点之前，你应该确保节点确实关闭了（不是在重启过程中）。
你可以在发生了节点关闭事件，且该事件没有被 kubelet 提前检测和处理的情况下，在节点关闭之后添加污点；
你可以使用该污点的另一种情况是当节点由于硬件故障或操作系统损坏而处于不可恢复状态时。
你可以为该污点设置的值是 `node.kubernetes.io/out-of-service=nodeshutdown: "NoExecute"` 或
`node.kubernetes.io/out-of-service=nodeshutdown: "NoSchedule"`。
如果你已经启用了前面提到的特性门控，在节点上设置 out-of-service 污点意味着节点上的 Pod 将被删除，
除非 Pod 上设置有与之匹配的容忍度。原来挂接到已关闭节点的持久卷（Persistent volume）将被解除挂接，
对于 StatefulSet，系统将在不同的运行节点上成功创建替换 Pod。

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
注意：在应用 out-of-service 污点之前，你**必须**确认节点是否已经处于关闭或断电状态（不是在重新启动过程中），
节点关闭的原因可能是用户有意将其关闭，也可能是节点由于硬件故障、操作系统问题等而关闭。

<!--
Once all the workload pods that are linked to the out-of-service node are moved to a new running node, and the shutdown node has been recovered, you should remove
that taint on the affected node after the node is recovered.
If you know that the node will not return to service, you could instead delete the node from the cluster.
-->
一旦关联到无法提供服务的节点的所有工作负载 Pod 都被移动到新的运行中的节点，并且关闭了的节点也已恢复，
你应该在节点恢复后删除受影响节点上的污点。如果你知道该节点不会恢复服务，则可以改为从集群中删除该节点。

<!--
## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the Non-Graceful Node Shutdown implementation to Beta in either 1.25 or 1.26.
-->
## 下一步是什么？

根据反馈和采用情况，Kubernetes 团队计划在 1.25 或 1.26 版本中将节点非体面关闭实现推送到 Beta 阶段。

<!--
This feature requires a user to manually add a taint to the node to trigger workloads failover and remove the taint after the node is recovered. 
In the future, we plan to find ways to automatically detect and fence nodes that are shutdown/failed and automatically failover workloads to another node.
-->
此功能需要用户手动向节点添加污点以触发工作负载故障转移，并要求用户在节点恢复后移除污点。
未来，我们计划寻找方法来自动检测和隔离已关闭的或已失败的节点，并自动将工作负载故障转移到另一个节点。

<!--
## How can I learn more?

Check out the [documentation](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)
for non-graceful node shutdown.
-->
## 怎样才能了解更多？

查看节点非体面关闭相关[文档](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)。

<!--
## How to get involved?
-->
## 如何参与？

<!--
This feature has a long story. Yassine Tijani ([yastij](https://github.com/yastij)) started the KEP more than two years ago. 
Xing Yang ([xing-yang](https://github.com/xing-yang)) continued to drive the effort. 
There were many discussions among SIG Storage, SIG Node, and API reviewers to nail down the design details. 
Ashutosh Kumar ([sonasingh46](https://github.com/sonasingh46)) did most of the implementation and brought it to Alpha in Kubernetes 1.24.
-->
此功能特性由来已久。Yassine Tijani（[yastij](https://github.com/yastij)）在两年多前启动了这个 KEP。
Xing Yang（[xing-yang](https://github.com/xing-yang)）继续推动这项工作。
SIG-Storage、SIG-Node 和 API 评审人员们进行了多次讨论，以确定设计细节。
Ashutosh Kumar（[sonasingh46](https://github.com/sonasingh46)）
完成了大部分实现并在 Kubernetes 1.24 版本中将其引进到 Alpha 阶段。

<!--
We want to thank the following people for their insightful reviews: Tim Hockin  ([thockin](https://github.com/thockin)) for his guidance on the design, 
Jing Xu ([jingxu97](https://github.com/jingxu97)), Hemant Kumar ([gnufied](https://github.com/gnufied)), and Michelle Au ([msau42](https://github.com/msau42)) for reviews from SIG Storage side, 
and Mrunal Patel ([mrunalp](https://github.com/mrunalp)), David Porter ([bobbypage](https://github.com/bobbypage)), Derek Carr ([derekwaynecarr](https://github.com/derekwaynecarr)), 
and Danielle Endocrimes ([endocrimes](https://github.com/endocrimes)) for reviews from SIG Node side.
-->
我们要感谢以下人员的评审：Tim Hockin（[thockin](https://github.com/thockin)）对设计的指导；
来自 SIG-Storage 的 Jing Xu（[jingxu97](https://github.com/jingxu97)）、
Hemant Kumar（[gnufied](https://github.com/gnufied)）
和 Michelle Au（[msau42](https://github.com/msau42)）的评论；
以及 Mrunal Patel（[mrunalp](https://github.com/mrunalp)）、
David Porter（[bobbypage](https://github.com/bobbypage)）、
Derek Carr（[derekwaynecarr](https://github.com/derekwaynecarr)）
和 Danielle Endocrimes（[endocrimes](https://github.com/endocrimes)）来自 SIG-Node 方面的评论。

<!--
There are many people who have helped review the design and implementation along the way. 
We want to thank everyone who has contributed to this effort including the about 30 people who have reviewed the [KEP](https://github.com/kubernetes/enhancements/pull/1116) and implementation over the last couple of years.
-->
在此过程中，有很多人帮助审查了设计和实现。我们要感谢所有为此做出贡献的人，
包括在过去几年中审核 [KEP](https://github.com/kubernetes/enhancements/pull/1116) 和实现的大约 30 人。

<!--
This feature is a collaboration between SIG Storage and SIG Node. 
For those interested in getting involved with the design and development of any part of the Kubernetes Storage system, 
join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). 
For those interested in getting involved with the design and development of the components that support the controlled interactions between pods and host resources, 
join the [Kubernetes Node SIG](https://github.com/kubernetes/community/tree/master/sig-node).
-->
此特性是 SIG-Storage 和 SIG-Node 之间的协作。
对于那些有兴趣参与 Kubernetes Storage 系统任何部分的设计和开发的人，
请加入 [Kubernetes 存储特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG-Storage）。
对于那些有兴趣参与支持 Pod 和主机资源之间受控交互的组件的设计和开发的人，
请加入 [Kubernetes Node SIG](https://github.com/kubernetes/community/tree/master/sig-node)。
