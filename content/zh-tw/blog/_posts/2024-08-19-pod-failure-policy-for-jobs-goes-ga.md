---
layout: blog
title: "Kubernetes 1.31：針對 Job 的 Pod 失效策略進階至 GA"
date: 2024-08-19
slug: kubernetes-1-31-pod-failure-policy-for-jobs-goes-ga
author: >
  [Michał Woźniak](https://github.com/mimowo) (Google),
  [Shannon Kularathna](https://github.com/shannonxtreme) (Google)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.31: Pod Failure Policy for Jobs Goes GA"
date: 2024-08-19
slug: kubernetes-1-31-pod-failure-policy-for-jobs-goes-ga
author: >
  [Michał Woźniak](https://github.com/mimowo) (Google),
  [Shannon Kularathna](https://github.com/shannonxtreme) (Google)
-->

<!--
This post describes _Pod failure policy_, which graduates to stable in Kubernetes
1.31, and how to use it in your Jobs.
-->
這篇博文闡述在 Kubernetes 1.31 中進階至 Stable 的 **Pod 失效策略**，還介紹如何在你的 Job 中使用此策略。  

<!--
## About Pod failure policy

When you run workloads on Kubernetes, Pods might fail for a variety of reasons.
Ideally, workloads like Jobs should be able to ignore transient, retriable
failures and continue running to completion.
-->
## 關於 Pod 失效策略  

當你在 Kubernetes 上運行工作負載時，Pod 可能因各種原因而失效。
理想情況下，像 Job 這樣的工作負載應該能夠忽略瞬時的、可重試的失效，並繼續運行直到完成。  

<!--
To allow for these transient failures, Kubernetes Jobs include the `backoffLimit`
field, which lets you specify a number of Pod failures that you're willing to tolerate
during Job execution. However, if you set a large value for the `backoffLimit` field
and rely solely on this field, you might notice unnecessary increases in operating
costs as Pods restart excessively until the backoffLimit is met.
-->
要允許這些瞬時的失效，Kubernetes Job 需包含 `backoffLimit` 字段，
此字段允許你指定在 Job 執行期間你願意容忍的 Pod 失效次數。然而，
如果你爲 `backoffLimit` 字段設置了一個較大的值，並完全依賴這個字段，
你可能會發現，由於在滿足 backoffLimit 條件之前 Pod 重啓次數太多，導致運營成本發生不必要的增加。

<!--
This becomes particularly problematic when running large-scale Jobs with
thousands of long-running Pods across thousands of nodes.

The Pod failure policy extends the backoff limit mechanism to help you reduce
costs in the following ways:

- Gives you control to fail the Job as soon as a non-retriable Pod failure occurs.
- Allows you to ignore retriable errors without increasing the `backoffLimit` field.
-->
在運行大規模的、包含跨數千節點且長時間運行的 Pod 的 Job 時，這個問題尤其嚴重。

Pod 失效策略擴展了回退限制機制，幫助你通過以下方式降低成本：

- 讓你在出現不可重試的 Pod 失效時控制 Job 失敗。  
- 允許你忽略可重試的錯誤，而不增加 `backoffLimit` 字段。

<!--
For example, you can use a Pod failure policy to run your workload on more affordable spot machines
by ignoring Pod failures caused by
[graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown).

The policy allows you to distinguish between retriable and non-retriable Pod
failures based on container exit codes or Pod conditions in a failed Pod.
-->
例如，通過忽略由[節點體面關閉](/zh-cn/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)引起的
Pod 失效，你可以使用 Pod 失效策略在更實惠的臨時機器上運行你的工作負載。  

此策略允許你基於失效 Pod 中的容器退出碼或 Pod 狀況來區分可重試和不可重試的 Pod 失效。

<!--
## How it works

You specify a Pod failure policy in the Job specification, represented as a list
of rules.

For each rule you define _match requirements_ based on one of the following properties:

- Container exit codes: the `onExitCodes` property.
- Pod conditions: the `onPodConditions` property.
-->
## 它是如何工作的  

你在 Job 規約中指定的 Pod 失效策略是一個規則的列表。

對於每個規則，你基於以下屬性之一來定義**匹配條件**：

- 容器退出碼：`onExitCodes` 屬性。  
- Pod 狀況：`onPodConditions` 屬性。  

<!--
Additionally, for each rule, you specify one of the following actions to take
when a Pod matches the rule:
- `Ignore`: Do not count the failure towards the `backoffLimit` or `backoffLimitPerIndex`.
- `FailJob`: Fail the entire Job and terminate all running Pods.
- `FailIndex`: Fail the index corresponding to the failed Pod.
  This action works with the [Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index) feature.
- `Count`: Count the failure towards the `backoffLimit` or `backoffLimitPerIndex`.
  This is the default behavior.
-->
此外，對於每個規則，你要指定在 Pod 與此規則匹配時應採取的動作，可選動作爲以下之一：

- `Ignore`：不將失效計入 `backoffLimit` 或 `backoffLimitPerIndex`。  
- `FailJob`：讓整個 Job 失敗並終止所有運行的 Pod。  
- `FailIndex`：與失效 Pod 對應的索引失效。  
  此動作與[逐索引回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)特性一起使用。  
- `Count`：將失效計入 `backoffLimit` 或 `backoffLimitPerIndex`。這是預設行爲。

<!--
When Pod failures occur in a running Job, Kubernetes matches the
failed Pod status against the list of Pod failure policy rules, in the specified
order, and takes the corresponding actions for the first matched rule.

Note that when specifying the Pod failure policy, you must also set the Job's
Pod template with `restartPolicy: Never`. This prevents race conditions between
the kubelet and the Job controller when counting Pod failures.
-->
當在運行的 Job 中發生 Pod 失效時，Kubernetes 按所給的順序將失效 Pod 的狀態與
Pod 失效策略規則的列表進行匹配，並根據匹配的第一個規則採取相應的動作。

請注意，在指定 Pod 失效策略時，你還必須在 Job 的 Pod 模板中設置 `restartPolicy: Never`。
此字段可以防止在對 Pod 失效計數時在 kubelet 和 Job 控制器之間出現競爭條件。

<!--
### Kubernetes-initiated Pod disruptions

To allow matching Pod failure policy rules against failures caused by
disruptions initiated by Kubernetes, this feature introduces the `DisruptionTarget`
Pod condition.

Kubernetes adds this condition to any Pod, regardless of whether it's managed by
a Job controller, that fails because of a retriable
[disruption scenario](/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions).
The `DisruptionTarget` condition contains one of the following reasons that
corresponds to these disruption scenarios:
-->
### Kubernetes 發起的 Pod 干擾

爲了允許將 Pod 失效策略規則與由 Kubernetes 引發的干擾所導致的失效進行匹配，
此特性引入了 `DisruptionTarget` Pod 狀況。  

Kubernetes 會將此狀況添加到因可重試的[干擾場景](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions)而失效的所有
Pod，無論其是否由 Job 控制器管理。其中 `DisruptionTarget` 狀況包含與這些干擾場景對應的以下原因之一：

<!--
- `PreemptionByKubeScheduler`: [Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption)
   by `kube-scheduler` to accommodate a new Pod that has a higher priority.
- `DeletionByTaintManager` - the Pod is due to be deleted by
   `kube-controller-manager` due to a `NoExecute` [taint](/docs/concepts/scheduling-eviction/taint-and-toleration/)
   that the Pod doesn't tolerate.
- `EvictionByEvictionAPI` - the Pod is due to be deleted by an
   [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/).
- `DeletionByPodGC` - the Pod is bound to a node that no longer exists, and is due to
   be deleted by [Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection).
- `TerminationByKubelet` - the Pod was terminated by
  [graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown),
  [node pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
  or preemption for [system critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
-->
- `PreemptionByKubeScheduler`：由 `kube-scheduler`
  [搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption)以接納更高優先級的新 Pod。
- `DeletionByTaintManager` - Pod 因其不容忍的 `NoExecute`
  [污點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)而被 `kube-controller-manager` 刪除。
- `EvictionByEvictionAPI` - Pod 因爲 [API 發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)而被刪除。
- `DeletionByPodGC` - Pod 被綁定到一個不再存在的節點，並將通過
  [Pod 垃圾收集](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)而被刪除。  
- `TerminationByKubelet` - Pod 因[節點體面關閉](/zh-cn/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)、
  [節點壓力驅逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)或被[系統關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)搶佔

<!--
In all other disruption scenarios, like eviction due to exceeding
[Pod container limits](/docs/concepts/configuration/manage-resources-containers/),
Pods don't receive the `DisruptionTarget` condition because the disruptions were
likely caused by the Pod and would reoccur on retry.

### Example

The Pod failure policy snippet below demonstrates an example use:
-->
在所有其他干擾場景中，例如因超過
[Pod 容器限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/)而驅逐，
Pod 不會收到 `DisruptionTarget` 狀況，因爲干擾可能是由 Pod 引起的，並且在重試時會再次發生干擾。  

### 示例  

下面的 Pod 失效策略片段演示了一種用法：

```yaml
podFailurePolicy:
  rules:
  - action: Ignore
    onPodConditions:
    - type: DisruptionTarget
  - action: FailJob
    onPodConditions:
    - type: ConfigIssue
  - action: FailJob
    onExitCodes:
      operator: In
      values: [ 42 ]
```

<!--
In this example, the Pod failure policy does the following:

- Ignores any failed Pods that have the built-in `DisruptionTarget`
  condition. These Pods don't count towards Job backoff limits.
- Fails the Job if any failed Pods have the custom user-supplied
  `ConfigIssue` condition, which was added either by a custom controller or webhook.
- Fails the Job if any containers exited with the exit code 42.
- Counts all other Pod failures towards the default `backoffLimit` (or
  `backoffLimitPerIndex` if used).
-->
在這個例子中，Pod 失效策略執行以下操作：  

- 忽略任何具有內置 `DisruptionTarget` 狀況的失效 Pod。這些 Pod 不計入 Job 回退限制。  
- 如果任何失效的 Pod 具有使用者自定義的、由自定義控制器或 Webhook 添加的 `ConfigIssue`
  狀況，則讓 Job 失敗。
- 如果任何容器以退出碼 42 退出，則讓 Job 失敗。  
- 將所有其他 Pod 失效計入預設的 `backoffLimit`（在合適的情況下，計入 `backoffLimitPerIndex`）。  

<!--
## Learn more

- For a hands-on guide to using Pod failure policy, see
  [Handling retriable and non-retriable pod failures with Pod failure policy](/docs/tasks/job/pod-failure-policy/)
- Read the documentation for
  [Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy) and
  [Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)
- Read the documentation for
  [Pod disruption conditions](/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions)
- Read the KEP for [Pod failure policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures)
-->
## 進一步瞭解

- 有關使用 Pod 失效策略的實踐指南，
  參見[使用 Pod 失效策略處理可重試和不可重試的 Pod 失效](/zh-cn/docs/tasks/job/pod-failure-policy/)  
- 閱讀文檔：[Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)和[逐索引回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)
- 閱讀文檔：[Pod 干擾狀況](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions)
- 閱讀 KEP：[Pod 失效策略](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures)  

<!--
## Related work

Based on the concepts introduced by Pod failure policy, the following additional work is in progress:
- JobSet integration: [Configurable Failure Policy API](https://github.com/kubernetes-sigs/jobset/issues/262)
- [Pod failure policy extension to add more granular failure reasons](https://github.com/kubernetes/enhancements/issues/4443)
- Support for Pod failure policy via JobSet in [Kubeflow Training v2](https://github.com/kubeflow/training-operator/pull/2171)
- Proposal: [Disrupted Pods should be removed from endpoints](https://docs.google.com/document/d/1t25jgO_-LRHhjRXf4KJ5xY_t8BZYdapv7MDAxVGY6R8)
-->
## 相關工作  

基於 Pod 失效策略所引入的概念，正在進行中的進一步工作如下：

- JobSet 集成：[可設定的失效策略 API](https://github.com/kubernetes-sigs/jobset/issues/262)
- [擴展 Pod 失效策略以添加更細粒度的失效原因](https://github.com/kubernetes/enhancements/issues/4443)
- 通過 JobSet 在 [Kubeflow Training v2](https://github.com/kubeflow/training-operator/pull/2171)
  中支持 Pod 失效策略
- 提案：[受干擾的 Pod 應從端點中移除](https://docs.google.com/document/d/1t25jgO_-LRHhjRXf4KJ5xY_t8BZYdapv7MDAxVGY6R8)

<!--
## Get involved

This work was sponsored by
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps),
and [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node),
and [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)
communities.
-->
## 參與其中  

這項工作由 [Batch Working Group（批處理工作組）](https://github.com/kubernetes/community/tree/master/wg-batch) 發起，
與 [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps)、
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)
和 [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)
社區密切合作。

<!--
If you are interested in working on new features in the space we recommend
subscribing to our [Slack](https://kubernetes.slack.com/messages/wg-batch)
channel and attending the regular community meetings.

## Acknowledgments

I would love to thank everyone who was involved in this project over the years -
it's been a journey and a joint community effort! The list below is
my best-effort attempt to remember and recognize people who made an impact.
Thank you!
-->
如果你有興趣處理這個領域中的新特性，建議你訂閱我們的
[Slack](https://kubernetes.slack.com/messages/wg-batch) 頻道，並參加定期的社區會議。  

## 感謝  

我想感謝在這些年裏參與過這個項目的每個人。
這是一段旅程，也是一個社區共同努力的見證！
以下名單是我盡力記住並對此特性產生過影響的人。感謝大家！  

<!--
- [Aldo Culquicondor](https://github.com/alculquicondor/) for guidance and reviews throughout the process
- [Jordan Liggitt](https://github.com/liggitt) for KEP and API reviews
- [David Eads](https://github.com/deads2k) for API reviews
- [Maciej Szulik](https://github.com/soltysh) for KEP reviews from SIG Apps PoV
- [Clayton Coleman](https://github.com/smarterclayton) for guidance and SIG Node reviews
- [Sergey Kanzhelev](https://github.com/SergeyKanzhelev) for KEP reviews from SIG Node PoV
- [Dawn Chen](https://github.com/dchen1107) for KEP reviews from SIG Node PoV
- [Daniel Smith](https://github.com/lavalamp) for reviews from SIG API machinery PoV
- [Antoine Pelisse](https://github.com/apelisse) for reviews from SIG API machinery PoV
- [John Belamaric](https://github.com/johnbelamaric) for PRR reviews
- [Filip Křepinský](https://github.com/atiratree) for thorough reviews from SIG Apps PoV and bug-fixing
- [David Porter](https://github.com/bobbypage) for thorough reviews from SIG Node PoV
- [Jensen Lo](https://github.com/jensentanlo) for early requirements discussions, testing and reporting issues
- [Daniel Vega-Myhre](https://github.com/danielvegamyhre) for advancing JobSet integration and reporting issues
- [Abdullah Gharaibeh](https://github.com/ahg-g) for early design discussions and guidance
- [Antonio Ojea](https://github.com/aojea) for test reviews
- [Yuki Iwai](https://github.com/tenzen-y) for reviews and aligning implementation of the closely related Job features
- [Kevin Hannon](https://github.com/kannon92) for reviews and aligning implementation of the closely related Job features
- [Tim Bannister](https://github.com/sftim) for docs reviews
- [Shannon Kularathna](https://github.com/shannonxtreme) for docs reviews
- [Paola Cortés](https://github.com/cortespao) for docs reviews
-->
- [Aldo Culquicondor](https://github.com/alculquicondor/) 在整個過程中提供指導和審查
- [Jordan Liggitt](https://github.com/liggitt) 審查 KEP 和 API
- [David Eads](https://github.com/deads2k) 審查 API
- [Maciej Szulik](https://github.com/soltysh) 從 SIG Apps 角度審查 KEP
- [Clayton Coleman](https://github.com/smarterclayton) 提供指導和 SIG Node 審查
- [Sergey Kanzhelev](https://github.com/SergeyKanzhelev) 從 SIG Node 角度審查 KEP
- [Dawn Chen](https://github.com/dchen1107) 從 SIG Node 角度審查 KEP
- [Daniel Smith](https://github.com/lavalamp) 從 SIG API Machinery 角度進行審查
- [Antoine Pelisse](https://github.com/apelisse) 從 SIG API Machinery 角度進行審查
- [John Belamaric](https://github.com/johnbelamaric) 審查 PRR
- [Filip Křepinský](https://github.com/atiratree) 從 SIG Apps 角度進行全面審查並修復 Bug
- [David Porter](https://github.com/bobbypage) 從 SIG Node 角度進行全面審查
- [Jensen Lo](https://github.com/jensentanlo) 進行早期需求討論、測試和報告問題
- [Daniel Vega-Myhre](https://github.com/danielvegamyhre) 推進 JobSet 集成並報告問題
- [Abdullah Gharaibeh](https://github.com/ahg-g) 進行早期設計討論和指導
- [Antonio Ojea](https://github.com/aojea) 審查測試
- [Yuki Iwai](https://github.com/tenzen-y) 審查並協調相關 Job 特性的實現  
- [Kevin Hannon](https://github.com/kannon92) 審查並協調相關 Job 特性的實現  
- [Tim Bannister](https://github.com/sftim) 審查文檔  
- [Shannon Kularathna](https://github.com/shannonxtreme) 審查文檔  
- [Paola Cortés](https://github.com/cortespao) 審查文檔
