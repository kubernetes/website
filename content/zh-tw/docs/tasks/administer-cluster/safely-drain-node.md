---
title: 安全地清空一個節點
content_type: task
min-kubernetes-server-version: 1.5
---
<!--
reviewers:
- davidopp
- mml
- foxish
- kow3ns
title: Safely Drain a Node
content_type: task
min-kubernetes-server-version: 1.5
-->

<!-- overview -->
<!-- 
This page shows how to safely drain a node, respecting the PodDisruptionBudget you have defined.
 -->
本頁展示瞭如何在確保 PodDisruptionBudget 的前提下，安全地清空一個{{< glossary_tooltip text="節點" term_id="node" >}}。

## {{% heading "prerequisites" %}}

{{% version-check %}}
<!-- 
This task assumes that you have met the following prerequisites:

* You are using Kubernetes release >= 1.5.
* Either:
  1. You do not require your applications to be highly available during the
     node drain, or
  2. You have read about the [PodDisruptionBudget concept](/docs/concepts/workloads/pods/disruptions/)
     and [Configured PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/) for
     applications that need them.
-->
此任務假定你已經滿足了以下先決條件：

* 使用的 Kubernetes 版本 >= 1.5。
* 以下兩項，具備其一：
  1. 在節點清空期間，不要求應用程式具有高可用性
  2. 你已經瞭解了 [PodDisruptionBudget 的概念](/zh-cn/docs/concepts/workloads/pods/disruptions/)，
     併為需要它的應用程式[配置了 PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/)。

<!-- steps -->

<!--
## (Optional) Configure a disruption budget {#configure-poddisruptionbudget}

To endure that your workloads remain available during maintenance, you can
configure a [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/).

If availability is important for any applications that run or could run on the node(s)
that you are draining, [configure a PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/)
first and then continue following this guide.
-->
## （可選） 配置干擾預算 {#configure-poddisruptionbudget}

為了確保你的負載在維護期間仍然可用，你可以配置一個 [PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/)。
如果可用性對於正在清空的該節點上執行或可能在該節點上執行的任何應用程式很重要，
首先 [配置一個 PodDisruptionBudgets](/zh-cn/docs/tasks/run-application/configure-pdb/) 並繼續遵循本指南。

<!-- 
## Use `kubectl drain` to remove a node from service

You can use `kubectl drain` to safely evict all of your pods from a
node before you perform maintenance on the node (e.g. kernel upgrade,
hardware maintenance, etc.). Safe evictions allow the pod's containers
to [gracefully terminate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
and will respect the `PodDisruptionBudgets` you have specified.
-->
## 使用 `kubectl drain` 從服務中刪除一個節點 {#use-kubectl-drain-to-remove-a-node-from-service}

在對節點執行維護（例如核心升級、硬體維護等）之前，
可以使用 `kubectl drain` 從節點安全地逐出所有 Pods。
安全的驅逐過程允許 Pod 的容器
[體面地終止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)，
並確保滿足指定的 PodDisruptionBudgets。

<!-- 
By default `kubectl drain` will ignore certain system pods on the node
that cannot be killed; see
the [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
documentation for more details.
-->
{{< note >}}
預設情況下， `kubectl drain` 將忽略節點上不能殺死的特定系統 Pod；
有關更多細節，請參閱
[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain) 文件。
{{< /note >}}

<!-- 
When `kubectl drain` returns successfully, that indicates that all of
the pods (except the ones excluded as described in the previous paragraph)
have been safely evicted (respecting the desired graceful termination period,
and respecting the PodDisruptionBudget you have defined). It is then safe to
bring down the node by powering down its physical machine or, if running on a
cloud platform, deleting its virtual machine.

First, identify the name of the node you wish to drain. You can list all of the nodes in your cluster with
-->
`kubectl drain` 的成功返回，表明所有的 Pods（除了上一段中描述的被排除的那些），
已經被安全地逐出（考慮到期望的終止寬限期和你定義的 PodDisruptionBudget）。
然後就可以安全地關閉節點，
比如關閉物理機器的電源，如果它執行在雲平臺上，則刪除它的虛擬機器。

首先，確定想要清空的節點的名稱。可以用以下命令列出叢集中的所有節點:

```shell
kubectl get nodes
```

<!-- 
Next, tell Kubernetes to drain the node:
-->
接下來，告訴 Kubernetes 清空節點：

```shell
kubectl drain <node name>
```

<!-- 
Once it returns (without giving an error), you can power down the node
(or equivalently, if on a cloud platform, delete the virtual machine backing the node).
If you leave the node in the cluster during the maintenance operation, you need to run
-->
一旦它返回（沒有報錯），
你就可以下線此節點（或者等價地，如果在雲平臺上，刪除支援該節點的虛擬機器）。
如果要在維護操作期間將節點留在叢集中，則需要執行：

```shell
kubectl uncordon <node name>
```
<!-- 
afterwards to tell Kubernetes that it can resume scheduling new pods onto the node.
-->
然後告訴 Kubernetes，它可以繼續在此節點上排程新的 Pods。

<!-- 
## Draining multiple nodes in parallel

The `kubectl drain` command should only be issued to a single node at a
time. However, you can run multiple `kubectl drain` commands for
different nodes in parallel, in different terminals or in the
background. Multiple drain commands running concurrently will still
respect the `PodDisruptionBudget` you specify.
-->
## 並行清空多個節點  {#draining-multiple-nodes-in-parallel}

 `kubectl drain` 命令一次只能傳送給一個節點。
 但是，你可以在不同的終端或後臺為不同的節點並行地執行多個 `kubectl drain` 命令。
 同時執行的多個 drain 命令仍然遵循你指定的 PodDisruptionBudget 。

<!-- 
For example, if you have a StatefulSet with three replicas and have
set a PodDisruptionBudget for that set specifying `minAvailable: 2`,
`kubectl drain` only evicts a pod from the StatefulSet if all three
replicas pods are ready; if then you issue multiple drain commands in
parallel, Kubernetes respects the PodDisruptionBudget and ensure
that only 1 (calculated as `replicas - minAvailable`) Pod is unavailable
at any given time. Any drains that would cause the number of ready
replicas to fall below the specified budget are blocked.
-->
例如，如果你有一個三副本的 StatefulSet，
並設定了一個 `PodDisruptionBudget`，指定 `minAvailable: 2`。
如果所有的三個 Pod 均就緒，並且你並行地發出多個 drain 命令，
那麼 `kubectl drain` 只會從 StatefulSet 中逐出一個 Pod，
因為 Kubernetes 會遵守 PodDisruptionBudget 並確保在任何時候只有一個 Pod 不可用
（最多不可用 Pod 個數的計算方法：`replicas - minAvailable`）。
任何會導致就緒副本數量低於指定預算的清空操作都將被阻止。

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
（比如避免呼叫外部命令，或者更細化地控制 pod 驅逐過程），
你也可以用驅逐 API 透過程式設計的方式達到驅逐的效果。
更多資訊，請參閱 [API 發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)。

## {{% heading "whatsnext" %}}

<!-- 
* Follow steps to protect your application by [configuring a Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
-->
* 執行[配置 PDB](/zh-cn/docs/tasks/run-application/configure-pdb/)中的各個步驟，
  保護你的應用
