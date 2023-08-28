---
layout: blog
title: "Kubernetes 1.26：PodDisruptionBudget 守护的不健康 Pod 所用的驱逐策略"
date: 2023-01-06
slug: "unhealthy-pod-eviction-policy-for-pdbs"
---
<!--
layout: blog
title: "Kubernetes 1.26: Eviction policy for unhealthy pods guarded by PodDisruptionBudgets"
date: 2023-01-06
slug: "unhealthy-pod-eviction-policy-for-pdbs"
-->

<!--
**Authors:** Filip Křepinský (Red Hat), Morten Torkildsen (Google), Ravi Gudimetla (Apple)
-->
**作者：** Filip Křepinský (Red Hat), Morten Torkildsen (Google), Ravi Gudimetla (Apple)

**译者：** Michael Yao (DaoCloud)

<!--
Ensuring the disruptions to your applications do not affect its availability isn't a simple
task. Last month's release of Kubernetes v1.26 lets you specify an  _unhealthy pod eviction policy_
for [PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) (PDBs)
to help you maintain that availability during node management operations.
In this article, we will dive deeper into what modifications were introduced for PDBs to
give application owners greater flexibility in managing disruptions.
-->
确保对应用的干扰不影响其可用性不是一个简单的任务。
上个月发布的 Kubernetes v1.26 允许针对
[PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) (PDB)
指定**不健康 Pod 驱逐策略**，这有助于在节点执行管理操作期间保持可用性。

<!--
## What problems does this solve?

API-initiated eviction of pods respects PodDisruptionBudgets (PDBs). This means that a requested [voluntary disruption](https://kubernetes.io/docs/concepts/scheduling-eviction/#pod-disruption)
via an eviction to a Pod, should not disrupt a guarded application and `.status.currentHealthy` of a PDB should not fall
below `.status.desiredHealthy`. Running pods that are [Unhealthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
do not count towards the PDB status, but eviction of these is only possible in case the application
is not disrupted. This helps disrupted or not yet started application to achieve availability
as soon as possible without additional downtime that would be caused by evictions.
-->
## 这解决什么问题？  {#what-problem-does-this-solve}

API 发起的 Pod 驱逐尊重 PodDisruptionBudget (PDB) 约束。这意味着因驱逐 Pod
而请求的[自愿干扰](/zh-cn/docs/concepts/scheduling-eviction/#pod-disruption)不应干扰守护的应用且
PDB 的 `.status.currentHealthy` 不应低于 `.status.desiredHealthy`。
如果正在运行的 Pod 状态为 [Unhealthy](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)，
则该 Pod 不计入 PDB 状态，只有在应用不受干扰时才可以驱逐这些 Pod。
这有助于尽可能确保受干扰或还未启动的应用的可用性，不会因驱逐造成额外的停机时间。

<!--
Unfortunately, this poses a problem for cluster administrators that would like to drain nodes
without any manual interventions. Misbehaving applications with pods in `CrashLoopBackOff`
state (due to a bug or misconfiguration) or pods that are simply failing to become ready
make this task much harder. Any eviction request will fail due to violation of a PDB, 
when all pods of an application are unhealthy. Draining of a node cannot make any progress
in that case.
-->
不幸的是，对于想要腾空节点但又不进行任何手动干预的集群管理员而言，这种机制是有问题的。
若一些应用因 Pod 处于 `CrashLoopBackOff` 状态（由于漏洞或配置错误）或 Pod 无法进入就绪状态而行为异常，
会使这项任务变得更加困难。当某应用的所有 Pod 均不健康时，所有驱逐请求都会因违反 PDB 而失败。
在这种情况下，腾空节点不会有任何作用。

<!--
On the other hand there are users that depend on the existing behavior, in order to:
- prevent data-loss that would be caused by deleting pods that are guarding an underlying resource or storage
- achieve the best availability possible for their application
-->
另一方面，有些用户依赖于现有行为，以便：

- 防止因删除守护基础资源或存储的 Pod 而造成数据丢失
- 让应用达到最佳可用性

<!--
Kubernetes 1.26 introduced a new experimental field to the PodDisruptionBudget API: `.spec.unhealthyPodEvictionPolicy`.
When enabled, this field lets you support both of those requirements.
-->
Kubernetes 1.26 为 PodDisruptionBudget API 引入了新的实验性字段：
`.spec.unhealthyPodEvictionPolicy`。启用此字段后，将允许你支持上述两种需求。

<!--
## How does it work?

API-initiated eviction is the process that triggers graceful pod termination.
The process can be initiated either by calling the API directly,
by using a `kubectl drain` command, or other actors in the cluster.
During this process every pod removal is consulted with appropriate PDBs,
to ensure that a sufficient number of pods is always running in the cluster.
-->
## 工作原理   {#how-does-it-work}

API 发起的驱逐是触发 Pod 优雅终止的一个进程。
这个进程可以通过直接调用 API 发起，也能使用 `kubectl drain` 或集群中的其他主体来发起。
在这个过程中，移除每个 Pod 时将与对应的 PDB 协商，确保始终有足够数量的 Pod 在集群中运行。

<!--
The following policies allow PDB authors to have a greater control how the process deals with unhealthy pods.

There are two policies `IfHealthyBudget` and `AlwaysAllow` to choose from.

The former, `IfHealthyBudget`, follows the existing behavior to achieve the best availability
that you get by default. Unhealthy pods can be disrupted only if their application
has a minimum available `.status.desiredHealthy` number of pods.
-->
以下策略允许 PDB 作者进一步控制此进程如何处理不健康的 Pod。

有两个策略可供选择：`IfHealthyBudget` 和 `AlwaysAllow`。

前者，`IfHealthyBudget` 采用现有行为以达到你默认可获得的最佳的可用性。
不健康的 Pod 只有在其应用中可用的 Pod 个数达到 `.status.desiredHealthy` 即最小可用个数时才会被干扰。

<!--
By setting the `spec.unhealthyPodEvictionPolicy` field of your PDB to `AlwaysAllow`,
you are choosing the best effort availability for your application.
With this policy it is always possible to evict unhealthy pods.
This will make it easier to maintain and upgrade your clusters.

We think that `AlwaysAllow` will often be a better choice, but for some critical workloads you may
still prefer to protect even unhealthy Pods from node drains or other forms of API-initiated
eviction.
-->
通过将 PDB 的 `spec.unhealthyPodEvictionPolicy` 字段设置为 `AlwaysAllow`，
可以表示尽可能为应用选择最佳的可用性。采用此策略时，始终能够驱逐不健康的 Pod。
这可以简化集群的维护和升级。

我们认为 `AlwaysAllow` 通常是一个更好的选择，但是对于某些关键工作负载，
你可能仍然倾向于防止不健康的 Pod 被从节点上腾空或其他形式的 API 发起的驱逐。

<!--
## How do I use it?

This is an alpha feature, which means you have to enable the `PDBUnhealthyPodEvictionPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
with the command line argument `--feature-gates=PDBUnhealthyPodEvictionPolicy=true`
to the kube-apiserver.
-->
## 如何使用？  {#how-do-i-use-it}

这是一个 Alpha 特性，意味着你必须使用命令行参数 `--feature-gates=PDBUnhealthyPodEvictionPolicy=true`
为 kube-apiserver 启用 `PDBUnhealthyPodEvictionPolicy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
Here's an example. Assume that you've enabled the feature gate in your cluster, and that you
already defined a Deployment that runs a plain webserver. You labelled the Pods for that
Deployment with `app: nginx`.
You want to limit avoidable disruption, and you know that best effort availability is
sufficient for this app.
You decide to allow evictions even if those webserver pods are unhealthy.
You create a PDB to guard this application, with the `AlwaysAllow` policy for evicting
unhealthy pods:
-->
以下是一个例子。假设你已在集群中启用了此特性门控且你已定义了运行普通 Web 服务器的 Deployment。
你已为 Deployment 的 Pod 打了标签 `app: nginx`。
你想要限制可避免的干扰，你知道对于此应用而言尽力而为的可用性也是足够的。
你决定即使这些 Web 服务器 Pod 不健康也允许驱逐。
你创建 PDB 守护此应用，使用 `AlwaysAllow` 策略驱逐不健康的 Pod：

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: nginx-pdb
spec:
  selector:
    matchLabels:
      app: nginx
  maxUnavailable: 1
  unhealthyPodEvictionPolicy: AlwaysAllow
```

<!--
## How can I learn more?

- Read the KEP: [Unhealthy Pod Eviction Policy for PDBs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3017-pod-healthy-policy-for-pdb)
- Read the documentation: [Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy) for PodDisruptionBudgets
- Review the Kubernetes documentation for [PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets), [draining of Nodes](/docs/tasks/administer-cluster/safely-drain-node/) and [evictions](/docs/concepts/scheduling-eviction/api-eviction/)
-->
## 查阅更多资料   {#how-can-i-learn-more}

- 阅读 KEP：[Unhealthy Pod Eviction Policy for PDBs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3017-pod-healthy-policy-for-pdb)
- 阅读针对 PodDisruptionBudget
  的[不健康 Pod 驱逐策略](/zh-cn/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)文档
- 参阅 [PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets)、
  [腾空节点](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)和[驱逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)等 Kubernetes 文档

<!--
## How do I get involved?

If you have any feedback, please reach out to us in the [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) channel on Slack (visit https://slack.k8s.io/ for an invitation if you need one), or on the SIG Apps mailing list: kubernetes-sig-apps@googlegroups.com
-->
## 我如何参与？   {#how-do-i-get-involved}

如果你有任何反馈，请通过 Slack [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) 频道
（如有需要，请访问 https://slack.k8s.io/ 获取邀请）或通过 SIG Apps 邮件列表
[kubernetes-sig-apps@googlegroups.com](https://groups.google.com/g/kubernetes-sig-apps) 联系我们。
