---
title: 安全地清空一个节点
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
本页展示了如何在确保 PodDisruptionBudget 的前提下，安全地清空一个{{< glossary_tooltip text="节点" term_id="node" >}}。

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
此任务假定你已经满足了以下先决条件：

* 使用的 Kubernetes 版本 >= 1.5。
* 以下两项，具备其一：
  1. 在节点清空期间，不要求应用程序具有高可用性
  2. 你已经了解了 [PodDisruptionBudget 的概念](/zh/docs/concepts/workloads/pods/disruptions/)，
     并为需要它的应用程序[配置了 PodDisruptionBudget](/zh/docs/tasks/run-application/configure-pdb/)。

<!-- steps -->

<!--
## (Optional) Configure a disruption budget {#configure-poddisruptionbudget}

To endure that your workloads remain available during maintenance, you can
configure a [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/).

If availability is important for any applications that run or could run on the node(s)
that you are draining, [configure a PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/)
first and the continue following this guide.
-->
## （可选） 配置干扰预算 {#configure-poddisruptionbudget}

为了确保你的负载在维护期间仍然可用，你可以配置一个 [PodDisruptionBudget](/zh/docs/concepts/workloads/pods/disruptions/)。
如果可用性对于正在清空的该节点上运行或可能在该节点上运行的任何应用程序很重要，
首先 [配置一个 PodDisruptionBudgets](/zh/docs/tasks/run-application/configure-pdb/) 并继续遵循本指南。

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
可以使用 `kubectl drain` 从节点安全地逐出所有 Pods。
安全的驱逐过程允许 Pod 的容器
[体面地终止](/zh/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)，
并确保满足指定的 PodDisruptionBudgets。

<!-- 
By default `kubectl drain` will ignore certain system pods on the node
that cannot be killed; see
the [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
documentation for more details.
-->
{{< note >}}
默认情况下， `kubectl drain` 将忽略节点上不能杀死的特定系统 Pod；
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

First, identify the name of the node you wish to drain. You can list all of the nodes in your cluster with
-->
`kubectl drain` 的成功返回，表明所有的 Pods（除了上一段中描述的被排除的那些），
已经被安全地逐出（考虑到期望的终止宽限期和你定义的 PodDisruptionBudget）。
然后就可以安全地关闭节点，
比如关闭物理机器的电源，如果它运行在云平台上，则删除它的虚拟机。

首先，确定想要清空的节点的名称。可以用以下命令列出集群中的所有节点:

```shell
kubectl get nodes
```

<!-- 
Next, tell Kubernetes to drain the node:
-->
接下来，告诉 Kubernetes 清空节点：

```shell
kubectl drain <node name>
```

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
然后告诉 Kubernetes，它可以继续在此节点上调度新的 Pods。

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
 同时运行的多个 drain 命令仍然遵循你指定的 PodDisruptionBudget 。

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
例如，如果你有一个三副本的 StatefulSet，
并设置了一个 `PodDisruptionBudget`，指定 `minAvailable: 2`。
如果所有的三个 Pod 均就绪，并且你并行地发出多个 drain 命令，
那么 `kubectl drain` 只会从 StatefulSet 中逐出一个 Pod，
因为 Kubernetes 会遵守 PodDisruptionBudget 并确保在任何时候只有一个 Pod 不可用
（最多不可用 Pod 个数的计算方法：`replicas - minAvailable`）。
任何会导致就绪副本数量低于指定预算的清空操作都将被阻止。

<!-- 
## The Eviction API

If you prefer not to use [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain) (such as
to avoid calling to an external command, or to get finer control over the pod
eviction process), you can also programmatically cause evictions using the eviction API.
-->
## 驱逐 API {#the-eviction-api}
如果你不喜欢使用
[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
（比如避免调用外部命令，或者更细化地控制 pod 驱逐过程），
你也可以用驱逐 API 通过编程的方式达到驱逐的效果。

<!-- 
You should first be familiar with using [Kubernetes language clients](/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api).

The eviction subresource of a
pod can be thought of as a kind of policy-controlled DELETE operation on the pod
itself. To attempt an eviction (perhaps more REST-precisely, to attempt to
*create* an eviction), you POST an attempted operation. Here's an example:
-->
首先应该熟悉使用 
[Kubernetes 语言客户端](/zh/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api)。

Pod 的 Eviction 子资源可以看作是一种策略控制的 DELETE 操作，作用于 Pod 本身。
要尝试驱逐（更准确地说，尝试 *创建* 一个 Eviction），需要用 POST 发出所尝试的操作。这里有一个例子：

```json
{
  "apiVersion": "policy/v1beta1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```

<!-- 
You can attempt an eviction using `curl`:
-->
你可以使用 `curl` 尝试驱逐：

```bash
curl -v -H 'Content-type: application/json' http://127.0.0.1:8080/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

<!-- 
The API can respond in one of three ways:

- If the eviction is granted, then the pod is deleted just as if you had sent
  a `DELETE` request to the pod's URL and you get back `200 OK`.
- If the current state of affairs wouldn't allow an eviction by the rules set
  forth in the budget, you get back `429 Too Many Requests`. This is
  typically used for generic rate limiting of *any* requests, but here we mean
  that this request isn't allowed *right now* but it may be allowed later.
  Currently, callers do not get any `Retry-After` advice, but they may in
  future versions.
- If there is some kind of misconfiguration, like multiple budgets pointing at
  the same pod, you will get `500 Internal Server Error`.
-->
API 可以通过以下三种方式之一进行响应：

- 如果驱逐被授权，那么 Pod 将被删掉，并且你会收到 `200 OK`，
  就像你向 Pod 的 URL 发送了 `DELETE` 请求一样。
- 如果按照预算中规定，目前的情况不允许的驱逐，你会收到 `429 Too Many Requests`。
  这通常用于对 *一些* 请求进行通用速率限制，
  但这里我们的意思是：此请求 *现在* 不允许，但以后可能会允许。
  目前，调用者不会得到任何 `Retry-After` 的提示，但在将来的版本中可能会得到。
- 如果有一些错误的配置，比如多个预算指向同一个 Pod，你将得到 `500 Internal Server Error`。

<!-- 
For a given eviction request, there are two cases:

- There is no budget that matches this pod. In this case, the server always
  returns `200 OK`.
- There is at least one budget. In this case, any of the three above responses may
   apply.
-->
对于一个给定的驱逐请求，有两种情况：

- 没有匹配这个 Pod 的预算。这种情况，服务器总是返回 `200 OK`。
- 至少匹配一个预算。在这种情况下，上述三种回答中的任何一种都可能适用。

<!-- 
## Stuck evictions

In some cases, an application may reach a broken state, one where unless you intervene the
eviction API will never return anything other than 429 or 500.

For example: this can happen if ReplicaSet is creating Pods for your application but
the replacement Pods do not become `Ready`. You can also see similar symptoms if the
last Pod evicted has a very long termination grace period.
-->
## 驱逐阻塞

在某些情况下，应用程序可能会到达一个中断状态，除了 429 或 500 之外，它将永远不会返回任何内容。
例如 ReplicaSet 创建的替换 Pod 没有变成就绪状态，或者被驱逐的最后一个
Pod 有很长的终止宽限期，就会发生这种情况。

<!--
In this case, there are two potential solutions:

- Abort or pause the automated operation. Investigate the reason for the stuck application,
  and restart the automation.
- After a suitably long wait, `DELETE` the Pod from your cluster's control plane, instead
  of using the eviction API.

Kubernetes does not specify what the behavior should be in this case; it is up to the
application owners and cluster owners to establish an agreement on behavior in these cases.
-->
在这种情况下，有两种可能的解决方案：

- 中止或暂停自动操作。调查应用程序卡住的原因，并重新启动自动化。
- 经过适当的长时间等待后，从集群中删除 Pod 而不是使用驱逐 API。

Kubernetes 并没有具体说明在这种情况下应该采取什么行为，
这应该由应用程序所有者和集群所有者紧密沟通，并达成对行动一致意见。

## {{% heading "whatsnext" %}}

<!-- 
* Follow steps to protect your application by [configuring a Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
-->
* 执行[配置 PDB](/zh/docs/tasks/run-application/configure-pdb/)中的各个步骤，
  保护你的应用
