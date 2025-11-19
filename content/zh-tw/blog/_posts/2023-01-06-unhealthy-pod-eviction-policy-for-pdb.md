---
layout: blog
title: "Kubernetes 1.26：PodDisruptionBudget 守護的不健康 Pod 所用的驅逐策略"
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

**譯者：** Michael Yao (DaoCloud)

<!--
Ensuring the disruptions to your applications do not affect its availability isn't a simple
task. Last month's release of Kubernetes v1.26 lets you specify an  _unhealthy pod eviction policy_
for [PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) (PDBs)
to help you maintain that availability during node management operations.
In this article, we will dive deeper into what modifications were introduced for PDBs to
give application owners greater flexibility in managing disruptions.
-->
確保對應用的干擾不影響其可用性不是一個簡單的任務。
上個月發佈的 Kubernetes v1.26 允許針對
[PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) (PDB)
指定**不健康 Pod 驅逐策略**，這有助於在節點執行管理操作期間保持可用性。

<!--
## What problems does this solve?

API-initiated eviction of pods respects PodDisruptionBudgets (PDBs). This means that a requested [voluntary disruption](https://kubernetes.io/docs/concepts/scheduling-eviction/#pod-disruption)
via an eviction to a Pod, should not disrupt a guarded application and `.status.currentHealthy` of a PDB should not fall
below `.status.desiredHealthy`. Running pods that are [Unhealthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
do not count towards the PDB status, but eviction of these is only possible in case the application
is not disrupted. This helps disrupted or not yet started application to achieve availability
as soon as possible without additional downtime that would be caused by evictions.
-->
## 這解決什麼問題？  {#what-problem-does-this-solve}

API 發起的 Pod 驅逐尊重 PodDisruptionBudget (PDB) 約束。這意味着因驅逐 Pod
而請求的[自願干擾](/zh-cn/docs/concepts/scheduling-eviction/#pod-disruption)不應干擾守護的應用且
PDB 的 `.status.currentHealthy` 不應低於 `.status.desiredHealthy`。
如果正在運行的 Pod 狀態爲 [Unhealthy](/zh-cn/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)，
則該 Pod 不計入 PDB 狀態，只有在應用不受干擾時纔可以驅逐這些 Pod。
這有助於儘可能確保受干擾或還未啓動的應用的可用性，不會因驅逐造成額外的停機時間。

<!--
Unfortunately, this poses a problem for cluster administrators that would like to drain nodes
without any manual interventions. Misbehaving applications with pods in `CrashLoopBackOff`
state (due to a bug or misconfiguration) or pods that are simply failing to become ready
make this task much harder. Any eviction request will fail due to violation of a PDB, 
when all pods of an application are unhealthy. Draining of a node cannot make any progress
in that case.
-->
不幸的是，對於想要騰空節點但又不進行任何手動干預的集羣管理員而言，這種機制是有問題的。
若一些應用因 Pod 處於 `CrashLoopBackOff` 狀態（由於漏洞或配置錯誤）或 Pod 無法進入就緒狀態而行爲異常，
會使這項任務變得更加困難。當某應用的所有 Pod 均不健康時，所有驅逐請求都會因違反 PDB 而失敗。
在這種情況下，騰空節點不會有任何作用。

<!--
On the other hand there are users that depend on the existing behavior, in order to:
- prevent data-loss that would be caused by deleting pods that are guarding an underlying resource or storage
- achieve the best availability possible for their application
-->
另一方面，有些用戶依賴於現有行爲，以便：

- 防止因刪除守護基礎資源或存儲的 Pod 而造成數據丟失
- 讓應用達到最佳可用性

<!--
Kubernetes 1.26 introduced a new experimental field to the PodDisruptionBudget API: `.spec.unhealthyPodEvictionPolicy`.
When enabled, this field lets you support both of those requirements.
-->
Kubernetes 1.26 爲 PodDisruptionBudget API 引入了新的實驗性字段：
`.spec.unhealthyPodEvictionPolicy`。啓用此字段後，將允許你支持上述兩種需求。

<!--
## How does it work?

API-initiated eviction is the process that triggers graceful pod termination.
The process can be initiated either by calling the API directly,
by using a `kubectl drain` command, or other actors in the cluster.
During this process every pod removal is consulted with appropriate PDBs,
to ensure that a sufficient number of pods is always running in the cluster.
-->
## 工作原理   {#how-does-it-work}

API 發起的驅逐是觸發 Pod 優雅終止的一個進程。
這個進程可以通過直接調用 API 發起，也能使用 `kubectl drain` 或集羣中的其他主體來發起。
在這個過程中，移除每個 Pod 時將與對應的 PDB 協商，確保始終有足夠數量的 Pod 在集羣中運行。

<!--
The following policies allow PDB authors to have a greater control how the process deals with unhealthy pods.

There are two policies `IfHealthyBudget` and `AlwaysAllow` to choose from.

The former, `IfHealthyBudget`, follows the existing behavior to achieve the best availability
that you get by default. Unhealthy pods can be disrupted only if their application
has a minimum available `.status.desiredHealthy` number of pods.
-->
以下策略允許 PDB 作者進一步控制此進程如何處理不健康的 Pod。

有兩個策略可供選擇：`IfHealthyBudget` 和 `AlwaysAllow`。

前者，`IfHealthyBudget` 採用現有行爲以達到你默認可獲得的最佳的可用性。
不健康的 Pod 只有在其應用中可用的 Pod 個數達到 `.status.desiredHealthy` 即最小可用個數時纔會被幹擾。

<!--
By setting the `spec.unhealthyPodEvictionPolicy` field of your PDB to `AlwaysAllow`,
you are choosing the best effort availability for your application.
With this policy it is always possible to evict unhealthy pods.
This will make it easier to maintain and upgrade your clusters.

We think that `AlwaysAllow` will often be a better choice, but for some critical workloads you may
still prefer to protect even unhealthy Pods from node drains or other forms of API-initiated
eviction.
-->
通過將 PDB 的 `spec.unhealthyPodEvictionPolicy` 字段設置爲 `AlwaysAllow`，
可以表示儘可能爲應用選擇最佳的可用性。採用此策略時，始終能夠驅逐不健康的 Pod。
這可以簡化集羣的維護和升級。

我們認爲 `AlwaysAllow` 通常是一個更好的選擇，但是對於某些關鍵工作負載，
你可能仍然傾向於防止不健康的 Pod 被從節點上騰空或其他形式的 API 發起的驅逐。

<!--
## How do I use it?

This is an alpha feature, which means you have to enable the `PDBUnhealthyPodEvictionPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
with the command line argument `--feature-gates=PDBUnhealthyPodEvictionPolicy=true`
to the kube-apiserver.
-->
## 如何使用？  {#how-do-i-use-it}

這是一個 Alpha 特性，意味着你必須使用命令行參數 `--feature-gates=PDBUnhealthyPodEvictionPolicy=true`
爲 kube-apiserver 啓用 `PDBUnhealthyPodEvictionPolicy`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

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
以下是一個例子。假設你已在集羣中啓用了此特性門控且你已定義了運行普通 Web 服務器的 Deployment。
你已爲 Deployment 的 Pod 打了標籤 `app: nginx`。
你想要限制可避免的干擾，你知道對於此應用而言盡力而爲的可用性也是足夠的。
你決定即使這些 Web 服務器 Pod 不健康也允許驅逐。
你創建 PDB 守護此應用，使用 `AlwaysAllow` 策略驅逐不健康的 Pod：

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
## 查閱更多資料   {#how-can-i-learn-more}

- 閱讀 KEP：[Unhealthy Pod Eviction Policy for PDBs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3017-pod-healthy-policy-for-pdb)
- 閱讀針對 PodDisruptionBudget
  的[不健康 Pod 驅逐策略](/zh-cn/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)文檔
- 參閱 [PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets)、
  [騰空節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)和[驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)等 Kubernetes 文檔

<!--
## How do I get involved?

If you have any feedback, please reach out to us in the [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) channel on Slack (visit https://slack.k8s.io/ for an invitation if you need one), or on the SIG Apps mailing list: kubernetes-sig-apps@googlegroups.com
-->
## 我如何參與？   {#how-do-i-get-involved}

如果你有任何反饋，請通過 Slack [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) 頻道
（如有需要，請訪問 https://slack.k8s.io/ 獲取邀請）或通過 SIG Apps 郵件列表
[kubernetes-sig-apps@googlegroups.com](https://groups.google.com/g/kubernetes-sig-apps) 聯繫我們。
