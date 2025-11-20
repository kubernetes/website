---
title: 安全地清空一個節點
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
本頁展示瞭如何在確保 PodDisruptionBudget 的前提下，
安全地清空一個{{< glossary_tooltip text="節點" term_id="node" >}}。

## {{% heading "prerequisites" %}}

<!-- 
This task assumes that you have met the following prerequisites:

1. You do not require your applications to be highly available during the
   node drain, or
1. You have read about the [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) concept,
   and have [configured PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/) for
   applications that need them.
-->
此任務假定你已經滿足了以下先決條件：

1. 在節點清空期間，不要求應用具有高可用性
2. 你已經瞭解了 [PodDisruptionBudget 的概念](/zh-cn/docs/concepts/workloads/pods/disruptions/)，
   併爲需要它的應用[設定了 PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/)。

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
## （可選）設定干擾預算 {#configure-poddisruptionbudget}

爲了確保你的負載在維護期間仍然可用，你可以設定一個
[PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/)。
如果可用性對於正在清空的該節點上運行或可能在該節點上運行的任何應用程式很重要，
首先 [設定一個 PodDisruptionBudgets](/zh-cn/docs/tasks/run-application/configure-pdb/) 並繼續遵循本指南。

建議爲你的 PodDisruptionBudgets 設置 `AlwaysAllow` 
[不健康 Pod 驅逐策略](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)，
以在節點清空期間支持驅逐異常的應用程式。 
預設行爲是等待應用程式的 Pod 變爲 [健康](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)後，
才能進行清空操作。

<!-- 
## Use `kubectl drain` to remove a node from service

You can use `kubectl drain` to safely evict all of your pods from a
node before you perform maintenance on the node (e.g. kernel upgrade,
hardware maintenance, etc.). Safe evictions allow the pod's containers
to [gracefully terminate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
and will respect the `PodDisruptionBudgets` you have specified.
-->
## 使用 `kubectl drain` 從服務中刪除一個節點 {#use-kubectl-drain-to-remove-a-node-from-service}

在對節點執行維護（例如內核升級、硬件維護等）之前，
可以使用 `kubectl drain` 從節點安全地逐出所有 Pod。
安全的驅逐過程允許 Pod 的容器[體面地終止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)，
並確保滿足指定的 `PodDisruptionBudgets`。

{{< note >}}
<!-- 
By default `kubectl drain` will ignore certain system pods on the node
that cannot be killed; see
the [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
documentation for more details.
-->
預設情況下，`kubectl drain` 將忽略節點上不能殺死的特定系統 Pod；
有關更多細節，請參閱
[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain) 文檔。
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
已經被安全地逐出（考慮到期望的終止寬限期和你定義的 PodDisruptionBudget）。
然後就可以安全地關閉節點，
比如關閉物理機器的電源，如果它運行在雲平臺上，則刪除它的虛擬機。

{{< note >}}
<!--
If any new Pods tolerate the `node.kubernetes.io/unschedulable` taint, then those Pods
might be scheduled to the node you have drained. Avoid tolerating that taint other than
for DaemonSets.
-->
如果存在新的、能夠容忍 `node.kubernetes.io/unschedulable` 污點的 Pod，
那麼這些 Pod 可能會被調度到你已經清空的節點上。
除了 DaemonSet 之外，請避免容忍此污點。

<!--
If you or another API user directly set the [`nodeName`](/docs/concepts/scheduling-eviction/assign-pod-node/#nodename)
field for a Pod (bypassing the scheduler), then the Pod is bound to the specified node
and will run there, even though you have drained that node and marked it unschedulable.
-->
如果你或另一個 API 使用者（繞過調度器）直接爲 Pod 設置了
[`nodeName`](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodename)字段，
則即使你已將該節點清空並標記爲不可調度，Pod 仍將被綁定到這個指定的節點並在該節點上運行。
{{< /note >}}

<!--
First, identify the name of the node you wish to drain. You can list all of the nodes in your cluster with
-->
首先，確定想要清空的節點的名稱。可以用以下命令列出叢集中的所有節點:

```shell
kubectl get nodes
```

<!-- 
Next, tell Kubernetes to drain the node:
-->
接下來，告訴 Kubernetes 清空節點：

```shell
kubectl drain --ignore-daemonsets <節點名稱>
```

<!--
If there are pods managed by a DaemonSet, you will need to specify
`--ignore-daemonsets` with `kubectl` to successfully drain the node. The `kubectl drain` subcommand on its own does not actually drain
a node of its DaemonSet pods:
the DaemonSet controller (part of the control plane) immediately replaces missing Pods with
new equivalent Pods. The DaemonSet controller also creates Pods that ignore unschedulable
taints, which allows the new Pods to launch onto a node that you are draining.
-->
如果存在 DaemonSet 管理的 Pod，你將需要爲 `kubectl` 設置 `--ignore-daemonsets` 以成功地清空節點。
`kubectl drain` 子命令自身實際上不清空節點上的 DaemonSet Pod 集合：
DaemonSet 控制器（作爲控制平面的一部分）會立即用新的等效 Pod 替換缺少的 Pod。
DaemonSet 控制器還會創建忽略不可調度污點的 Pod，這種污點允許在你正在清空的節點上啓動新的 Pod。

<!--
Once it returns (without giving an error), you can power down the node
(or equivalently, if on a cloud platform, delete the virtual machine backing the node).
If you leave the node in the cluster during the maintenance operation, you need to run
-->
一旦它返回（沒有報錯），
你就可以下線此節點（或者等價地，如果在雲平臺上，刪除支持該節點的虛擬機）。
如果要在維護操作期間將節點留在叢集中，則需要運行：

```shell
kubectl uncordon <node name>
```
<!-- 
afterwards to tell Kubernetes that it can resume scheduling new pods onto the node.
-->
然後告訴 Kubernetes，它可以繼續在此節點上調度新的 Pod。

<!-- 
## Draining multiple nodes in parallel

The `kubectl drain` command should only be issued to a single node at a
time. However, you can run multiple `kubectl drain` commands for
different nodes in parallel, in different terminals or in the
background. Multiple drain commands running concurrently will still
respect the `PodDisruptionBudget` you specify.
-->
## 並行清空多個節點  {#draining-multiple-nodes-in-parallel}

`kubectl drain` 命令一次只能發送給一個節點。
但是，你可以在不同的終端或後臺爲不同的節點並行地運行多個 `kubectl drain` 命令。
同時運行的多個 drain 命令仍然遵循你指定的 `PodDisruptionBudget`。

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
例如，如果你有一個三副本的 StatefulSet，
並設置了一個 `PodDisruptionBudget`，指定 `minAvailable: 2`。
如果所有的三個 Pod 處於[健康（healthy）](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)狀態，
並且你並行地發出多個 drain 命令，那麼 `kubectl drain` 只會從 StatefulSet 中逐出一個 Pod，
因爲 Kubernetes 會遵守 PodDisruptionBudget 並確保在任何時候只有一個 Pod 不可用
（最多不可用 Pod 個數的計算方法：`replicas - minAvailable`）。
任何會導致處於[健康（healthy）](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
狀態的副本數量低於指定預算的清空操作都將被阻止。

<!-- 
## The Eviction API

If you prefer not to use [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain) (such as
to avoid calling to an external command, or to get finer control over the pod
eviction process), you can also programmatically cause evictions using the
eviction API.
For more information, see [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/).
-->
## 驅逐 API {#the-eviction-api}

如果你不喜歡使用
[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
（比如避免調用外部命令，或者更細化地控制 Pod 驅逐過程），
你也可以用驅逐 API 通過編程的方式達到驅逐的效果。
更多資訊，請參閱 [API 發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)。

## {{% heading "whatsnext" %}}

<!-- 
* Follow steps to protect your application by [configuring a Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
-->
* 執行[設定 PDB](/zh-cn/docs/tasks/run-application/configure-pdb/) 中的各個步驟，
  保護你的應用。
