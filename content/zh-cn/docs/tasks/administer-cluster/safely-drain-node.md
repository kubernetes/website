---
title: 安全地清空一个节点
content_type: task
weight: 310
---
<!--
reviewers:
- davidopp
- mml
- foxish
- kow3ns
title: Safely Drain a Node
content_type: task
weight: 310
-->

<!-- overview -->
<!-- 
This page shows how to safely drain a node, respecting the PodDisruptionBudget you have defined.
-->
本页展示了如何在确保 PodDisruptionBudget 的前提下，
安全地清空一个{{< glossary_tooltip text="节点" term_id="node" >}}。

## {{% heading "prerequisites" %}}

<!-- 
This task assumes that you have met the following prerequisites:

1. You do not require your applications to be highly available during the
   node drain, or
1. You have read about the [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) concept,
   and have [configured PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/) for
   applications that need them.
-->
此任务假定你已经满足了以下先决条件：

1. 在节点清空期间，不要求应用具有高可用性
2. 你已经了解了 [PodDisruptionBudget 的概念](/zh-cn/docs/concepts/workloads/pods/disruptions/)，
   并为需要它的应用[配置了 PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/)。

<!-- steps -->

<!--
## (Optional) Configure a disruption budget {#configure-poddisruptionbudget}

To endure that your workloads remain available during maintenance, you can
configure a [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/).

If availability is important for any applications that run or could run on the node(s)
that you are draining, [configure a PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/)
first and then continue following this guide.

It is recommended to set `AlwaysAllow` [Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)
to your PodDisruptionBudgets to support eviction of misbehaving applications during a node drain.
The default behavior is to wait for the application pods to become [healthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
before the drain can proceed.
-->
## （可选）配置干扰预算 {#configure-poddisruptionbudget}

为了确保你的负载在维护期间仍然可用，你可以配置一个
[PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/)。
如果可用性对于正在清空的该节点上运行或可能在该节点上运行的任何应用程序很重要，
首先 [配置一个 PodDisruptionBudgets](/zh-cn/docs/tasks/run-application/configure-pdb/) 并继续遵循本指南。

建议为你的 PodDisruptionBudgets 设置 `AlwaysAllow` 
[不健康 Pod 驱逐策略](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)，
以在节点清空期间支持驱逐异常的应用程序。 
默认行为是等待应用程序的 Pod 变为 [健康](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)后，
才能进行清空操作。

<!-- 
## Use `kubectl drain` to remove a node from service

You can use `kubectl drain` to safely evict all of your pods from a
node before you perform maintenance on the node (e.g. kernel upgrade,
hardware maintenance, etc.). Safe evictions allow the pod's containers
to [gracefully terminate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
and will respect the `PodDisruptionBudgets` you have specified.
-->
## 使用 `kubectl drain` 从服务中删除一个节点 {#use-kubectl-drain-to-remove-a-node-from-service}

在对节点执行维护（例如内核升级、硬件维护等）之前，
可以使用 `kubectl drain` 从节点安全地逐出所有 Pod。
安全的驱逐过程允许 Pod 的容器[体面地终止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)，
并确保满足指定的 `PodDisruptionBudgets`。

{{< note >}}
<!-- 
By default `kubectl drain` will ignore certain system pods on the node
that cannot be killed; see
the [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
documentation for more details.
-->
默认情况下，`kubectl drain` 将忽略节点上不能杀死的特定系统 Pod；
有关更多细节，请参阅
[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain) 文档。
{{< /note >}}

<!-- 
When `kubectl drain` returns successfully, that indicates that all of
the pods (except the ones excluded as described in the previous paragraph)
have been safely evicted (respecting the desired graceful termination period,
and respecting the PodDisruptionBudget you have defined). It is then safe to
bring down the node by powering down its physical machine or, if running on a
cloud platform, deleting its virtual machine.
-->
`kubectl drain` 的成功返回，表明所有的 Pod（除了上一段中描述的被排除的那些），
已经被安全地逐出（考虑到期望的终止宽限期和你定义的 PodDisruptionBudget）。
然后就可以安全地关闭节点，
比如关闭物理机器的电源，如果它运行在云平台上，则删除它的虚拟机。

{{< note >}}
<!--
If any new Pods tolerate the `node.kubernetes.io/unschedulable` taint, then those Pods
might be scheduled to the node you have drained. Avoid tolerating that taint other than
for DaemonSets.
-->
如果存在新的、能够容忍 `node.kubernetes.io/unschedulable` 污点的 Pod，
那么这些 Pod 可能会被调度到你已经清空的节点上。
除了 DaemonSet 之外，请避免容忍此污点。

<!--
If you or another API user directly set the [`nodeName`](/docs/concepts/scheduling-eviction/assign-pod-node/#nodename)
field for a Pod (bypassing the scheduler), then the Pod is bound to the specified node
and will run there, even though you have drained that node and marked it unschedulable.
-->
如果你或另一个 API 用户（绕过调度器）直接为 Pod 设置了
[`nodeName`](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodename)字段，
则即使你已将该节点清空并标记为不可调度，Pod 仍将被绑定到这个指定的节点并在该节点上运行。
{{< /note >}}

<!--
First, identify the name of the node you wish to drain. You can list all of the nodes in your cluster with
-->
首先，确定想要清空的节点的名称。可以用以下命令列出集群中的所有节点:

```shell
kubectl get nodes
```

<!-- 
Next, tell Kubernetes to drain the node:
-->
接下来，告诉 Kubernetes 清空节点：

```shell
kubectl drain --ignore-daemonsets <节点名称>
```

<!--
If there are pods managed by a DaemonSet, you will need to specify
`--ignore-daemonsets` with `kubectl` to successfully drain the node. The `kubectl drain` subcommand on its own does not actually drain
a node of its DaemonSet pods:
the DaemonSet controller (part of the control plane) immediately replaces missing Pods with
new equivalent Pods. The DaemonSet controller also creates Pods that ignore unschedulable
taints, which allows the new Pods to launch onto a node that you are draining.
-->
如果存在 DaemonSet 管理的 Pod，你将需要为 `kubectl` 设置 `--ignore-daemonsets` 以成功地清空节点。
`kubectl drain` 子命令自身实际上不清空节点上的 DaemonSet Pod 集合：
DaemonSet 控制器（作为控制平面的一部分）会立即用新的等效 Pod 替换缺少的 Pod。
DaemonSet 控制器还会创建忽略不可调度污点的 Pod，这种污点允许在你正在清空的节点上启动新的 Pod。

<!--
Once it returns (without giving an error), you can power down the node
(or equivalently, if on a cloud platform, delete the virtual machine backing the node).
If you leave the node in the cluster during the maintenance operation, you need to run
-->
一旦它返回（没有报错），
你就可以下线此节点（或者等价地，如果在云平台上，删除支持该节点的虚拟机）。
如果要在维护操作期间将节点留在集群中，则需要运行：

```shell
kubectl uncordon <node name>
```
<!-- 
afterwards to tell Kubernetes that it can resume scheduling new pods onto the node.
-->
然后告诉 Kubernetes，它可以继续在此节点上调度新的 Pod。

<!-- 
## Draining multiple nodes in parallel

The `kubectl drain` command should only be issued to a single node at a
time. However, you can run multiple `kubectl drain` commands for
different nodes in parallel, in different terminals or in the
background. Multiple drain commands running concurrently will still
respect the `PodDisruptionBudget` you specify.
-->
## 并行清空多个节点  {#draining-multiple-nodes-in-parallel}

`kubectl drain` 命令一次只能发送给一个节点。
但是，你可以在不同的终端或后台为不同的节点并行地运行多个 `kubectl drain` 命令。
同时运行的多个 drain 命令仍然遵循你指定的 `PodDisruptionBudget`。

<!-- 
For example, if you have a StatefulSet with three replicas and have
set a PodDisruptionBudget for that set specifying `minAvailable: 2`,
`kubectl drain` only evicts a pod from the StatefulSet if all three
replicas pods are [healthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod);
if then you issue multiple drain commands in parallel,
Kubernetes respects the PodDisruptionBudget and ensure that
only 1 (calculated as `replicas - minAvailable`) Pod is unavailable
at any given time. Any drains that would cause the number of [healthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
replicas to fall below the specified budget are blocked.
-->
例如，如果你有一个三副本的 StatefulSet，
并设置了一个 `PodDisruptionBudget`，指定 `minAvailable: 2`。
如果所有的三个 Pod 处于[健康（healthy）](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)状态，
并且你并行地发出多个 drain 命令，那么 `kubectl drain` 只会从 StatefulSet 中逐出一个 Pod，
因为 Kubernetes 会遵守 PodDisruptionBudget 并确保在任何时候只有一个 Pod 不可用
（最多不可用 Pod 个数的计算方法：`replicas - minAvailable`）。
任何会导致处于[健康（healthy）](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
状态的副本数量低于指定预算的清空操作都将被阻止。

<!-- 
## The Eviction API

If you prefer not to use [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain) (such as
to avoid calling to an external command, or to get finer control over the pod
eviction process), you can also programmatically cause evictions using the
eviction API.
For more information, see [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/).
-->
## 驱逐 API {#the-eviction-api}

如果你不喜欢使用
[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
（比如避免调用外部命令，或者更细化地控制 Pod 驱逐过程），
你也可以用驱逐 API 通过编程的方式达到驱逐的效果。
更多信息，请参阅 [API 发起的驱逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)。

## {{% heading "whatsnext" %}}

<!-- 
* Follow steps to protect your application by [configuring a Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
-->
* 执行[配置 PDB](/zh-cn/docs/tasks/run-application/configure-pdb/) 中的各个步骤，
  保护你的应用。
