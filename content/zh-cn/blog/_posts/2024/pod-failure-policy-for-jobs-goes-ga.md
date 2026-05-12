---
layout: blog
title: "Kubernetes 1.31：针对 Job 的 Pod 失效策略进阶至 GA"
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
这篇博文阐述在 Kubernetes 1.31 中进阶至 Stable 的 **Pod 失效策略**，还介绍如何在你的 Job 中使用此策略。  

<!--
## About Pod failure policy

When you run workloads on Kubernetes, Pods might fail for a variety of reasons.
Ideally, workloads like Jobs should be able to ignore transient, retriable
failures and continue running to completion.
-->
## 关于 Pod 失效策略  

当你在 Kubernetes 上运行工作负载时，Pod 可能因各种原因而失效。
理想情况下，像 Job 这样的工作负载应该能够忽略瞬时的、可重试的失效，并继续运行直到完成。  

<!--
To allow for these transient failures, Kubernetes Jobs include the `backoffLimit`
field, which lets you specify a number of Pod failures that you're willing to tolerate
during Job execution. However, if you set a large value for the `backoffLimit` field
and rely solely on this field, you might notice unnecessary increases in operating
costs as Pods restart excessively until the backoffLimit is met.
-->
要允许这些瞬时的失效，Kubernetes Job 需包含 `backoffLimit` 字段，
此字段允许你指定在 Job 执行期间你愿意容忍的 Pod 失效次数。然而，
如果你为 `backoffLimit` 字段设置了一个较大的值，并完全依赖这个字段，
你可能会发现，由于在满足 backoffLimit 条件之前 Pod 重启次数太多，导致运营成本发生不必要的增加。

<!--
This becomes particularly problematic when running large-scale Jobs with
thousands of long-running Pods across thousands of nodes.

The Pod failure policy extends the backoff limit mechanism to help you reduce
costs in the following ways:

- Gives you control to fail the Job as soon as a non-retriable Pod failure occurs.
- Allows you to ignore retriable errors without increasing the `backoffLimit` field.
-->
在运行大规模的、包含跨数千节点且长时间运行的 Pod 的 Job 时，这个问题尤其严重。

Pod 失效策略扩展了回退限制机制，帮助你通过以下方式降低成本：

- 让你在出现不可重试的 Pod 失效时控制 Job 失败。  
- 允许你忽略可重试的错误，而不增加 `backoffLimit` 字段。

<!--
For example, you can use a Pod failure policy to run your workload on more affordable spot machines
by ignoring Pod failures caused by
[graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown).

The policy allows you to distinguish between retriable and non-retriable Pod
failures based on container exit codes or Pod conditions in a failed Pod.
-->
例如，通过忽略由[节点体面关闭](/zh-cn/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)引起的
Pod 失效，你可以使用 Pod 失效策略在更实惠的临时机器上运行你的工作负载。  

此策略允许你基于失效 Pod 中的容器退出码或 Pod 状况来区分可重试和不可重试的 Pod 失效。

<!--
## How it works

You specify a Pod failure policy in the Job specification, represented as a list
of rules.

For each rule you define _match requirements_ based on one of the following properties:

- Container exit codes: the `onExitCodes` property.
- Pod conditions: the `onPodConditions` property.
-->
## 它是如何工作的  

你在 Job 规约中指定的 Pod 失效策略是一个规则的列表。

对于每个规则，你基于以下属性之一来定义**匹配条件**：

- 容器退出码：`onExitCodes` 属性。  
- Pod 状况：`onPodConditions` 属性。  

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
此外，对于每个规则，你要指定在 Pod 与此规则匹配时应采取的动作，可选动作为以下之一：

- `Ignore`：不将失效计入 `backoffLimit` 或 `backoffLimitPerIndex`。  
- `FailJob`：让整个 Job 失败并终止所有运行的 Pod。  
- `FailIndex`：与失效 Pod 对应的索引失效。  
  此动作与[逐索引回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)特性一起使用。  
- `Count`：将失效计入 `backoffLimit` 或 `backoffLimitPerIndex`。这是默认行为。

<!--
When Pod failures occur in a running Job, Kubernetes matches the
failed Pod status against the list of Pod failure policy rules, in the specified
order, and takes the corresponding actions for the first matched rule.

Note that when specifying the Pod failure policy, you must also set the Job's
Pod template with `restartPolicy: Never`. This prevents race conditions between
the kubelet and the Job controller when counting Pod failures.
-->
当在运行的 Job 中发生 Pod 失效时，Kubernetes 按所给的顺序将失效 Pod 的状态与
Pod 失效策略规则的列表进行匹配，并根据匹配的第一个规则采取相应的动作。

请注意，在指定 Pod 失效策略时，你还必须在 Job 的 Pod 模板中设置 `restartPolicy: Never`。
此字段可以防止在对 Pod 失效计数时在 kubelet 和 Job 控制器之间出现竞争条件。

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
### Kubernetes 发起的 Pod 干扰

为了允许将 Pod 失效策略规则与由 Kubernetes 引发的干扰所导致的失效进行匹配，
此特性引入了 `DisruptionTarget` Pod 状况。  

Kubernetes 会将此状况添加到因可重试的[干扰场景](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions)而失效的所有
Pod，无论其是否由 Job 控制器管理。其中 `DisruptionTarget` 状况包含与这些干扰场景对应的以下原因之一：

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
  [抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption)以接纳更高优先级的新 Pod。
- `DeletionByTaintManager` - Pod 因其不容忍的 `NoExecute`
  [污点](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)而被 `kube-controller-manager` 删除。
- `EvictionByEvictionAPI` - Pod 因为 [API 发起的驱逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)而被删除。
- `DeletionByPodGC` - Pod 被绑定到一个不再存在的节点，并将通过
  [Pod 垃圾收集](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)而被删除。  
- `TerminationByKubelet` - Pod 因[节点体面关闭](/zh-cn/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)、
  [节点压力驱逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)或被[系统关键 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)抢占

<!--
In all other disruption scenarios, like eviction due to exceeding
[Pod container limits](/docs/concepts/configuration/manage-resources-containers/),
Pods don't receive the `DisruptionTarget` condition because the disruptions were
likely caused by the Pod and would reoccur on retry.

### Example

The Pod failure policy snippet below demonstrates an example use:
-->
在所有其他干扰场景中，例如因超过
[Pod 容器限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/)而驱逐，
Pod 不会收到 `DisruptionTarget` 状况，因为干扰可能是由 Pod 引起的，并且在重试时会再次发生干扰。  

### 示例  

下面的 Pod 失效策略片段演示了一种用法：

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
在这个例子中，Pod 失效策略执行以下操作：  

- 忽略任何具有内置 `DisruptionTarget` 状况的失效 Pod。这些 Pod 不计入 Job 回退限制。  
- 如果任何失效的 Pod 具有用户自定义的、由自定义控制器或 Webhook 添加的 `ConfigIssue`
  状况，则让 Job 失败。
- 如果任何容器以退出码 42 退出，则让 Job 失败。  
- 将所有其他 Pod 失效计入默认的 `backoffLimit`（在合适的情况下，计入 `backoffLimitPerIndex`）。  

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
## 进一步了解

- 有关使用 Pod 失效策略的实践指南，
  参见[使用 Pod 失效策略处理可重试和不可重试的 Pod 失效](/zh-cn/docs/tasks/job/pod-failure-policy/)  
- 阅读文档：[Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)和[逐索引回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)
- 阅读文档：[Pod 干扰状况](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions)
- 阅读 KEP：[Pod 失效策略](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures)  

<!--
## Related work

Based on the concepts introduced by Pod failure policy, the following additional work is in progress:
- JobSet integration: [Configurable Failure Policy API](https://github.com/kubernetes-sigs/jobset/issues/262)
- [Pod failure policy extension to add more granular failure reasons](https://github.com/kubernetes/enhancements/issues/4443)
- Support for Pod failure policy via JobSet in [Kubeflow Training v2](https://github.com/kubeflow/training-operator/pull/2171)
- Proposal: [Disrupted Pods should be removed from endpoints](https://docs.google.com/document/d/1t25jgO_-LRHhjRXf4KJ5xY_t8BZYdapv7MDAxVGY6R8)
-->
## 相关工作  

基于 Pod 失效策略所引入的概念，正在进行中的进一步工作如下：

- JobSet 集成：[可配置的失效策略 API](https://github.com/kubernetes-sigs/jobset/issues/262)
- [扩展 Pod 失效策略以添加更细粒度的失效原因](https://github.com/kubernetes/enhancements/issues/4443)
- 通过 JobSet 在 [Kubeflow Training v2](https://github.com/kubeflow/training-operator/pull/2171)
  中支持 Pod 失效策略
- 提案：[受干扰的 Pod 应从端点中移除](https://docs.google.com/document/d/1t25jgO_-LRHhjRXf4KJ5xY_t8BZYdapv7MDAxVGY6R8)

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
## 参与其中  

这项工作由 [Batch Working Group（批处理工作组）](https://github.com/kubernetes/community/tree/master/wg-batch) 发起，
与 [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps)、
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)
和 [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)
社区密切合作。

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
如果你有兴趣处理这个领域中的新特性，建议你订阅我们的
[Slack](https://kubernetes.slack.com/messages/wg-batch) 频道，并参加定期的社区会议。  

## 感谢  

我想感谢在这些年里参与过这个项目的每个人。
这是一段旅程，也是一个社区共同努力的见证！
以下名单是我尽力记住并对此特性产生过影响的人。感谢大家！  

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
- [Aldo Culquicondor](https://github.com/alculquicondor/) 在整个过程中提供指导和审查
- [Jordan Liggitt](https://github.com/liggitt) 审查 KEP 和 API
- [David Eads](https://github.com/deads2k) 审查 API
- [Maciej Szulik](https://github.com/soltysh) 从 SIG Apps 角度审查 KEP
- [Clayton Coleman](https://github.com/smarterclayton) 提供指导和 SIG Node 审查
- [Sergey Kanzhelev](https://github.com/SergeyKanzhelev) 从 SIG Node 角度审查 KEP
- [Dawn Chen](https://github.com/dchen1107) 从 SIG Node 角度审查 KEP
- [Daniel Smith](https://github.com/lavalamp) 从 SIG API Machinery 角度进行审查
- [Antoine Pelisse](https://github.com/apelisse) 从 SIG API Machinery 角度进行审查
- [John Belamaric](https://github.com/johnbelamaric) 审查 PRR
- [Filip Křepinský](https://github.com/atiratree) 从 SIG Apps 角度进行全面审查并修复 Bug
- [David Porter](https://github.com/bobbypage) 从 SIG Node 角度进行全面审查
- [Jensen Lo](https://github.com/jensentanlo) 进行早期需求讨论、测试和报告问题
- [Daniel Vega-Myhre](https://github.com/danielvegamyhre) 推进 JobSet 集成并报告问题
- [Abdullah Gharaibeh](https://github.com/ahg-g) 进行早期设计讨论和指导
- [Antonio Ojea](https://github.com/aojea) 审查测试
- [Yuki Iwai](https://github.com/tenzen-y) 审查并协调相关 Job 特性的实现  
- [Kevin Hannon](https://github.com/kannon92) 审查并协调相关 Job 特性的实现  
- [Tim Bannister](https://github.com/sftim) 审查文档  
- [Shannon Kularathna](https://github.com/shannonxtreme) 审查文档  
- [Paola Cortés](https://github.com/cortespao) 审查文档
