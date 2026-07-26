---
layout: blog
title: "Kubernetes v1.33：Job 逐索引的回退限制进阶至 GA"
date: 2025-05-13T10:30:00-08:00
slug: kubernetes-v1-33-jobs-backoff-limit-per-index-goes-ga
author: >
  [Michał Woźniak](https://github.com/mimowo) (Google)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: Job's Backoff Limit Per Index Goes GA"
date: 2025-05-13T10:30:00-08:00
slug: kubernetes-v1-33-jobs-backoff-limit-per-index-goes-ga
author: >
  [Michał Woźniak](https://github.com/mimowo) (Google)
-->

<!--
In Kubernetes v1.33, the _Backoff Limit Per Index_ feature reaches general
availability (GA). This blog describes the Backoff Limit Per Index feature and
its benefits.
-->
在 Kubernetes v1.33 中，**逐索引的回退限制**特性进阶至 GA（正式发布）。本文介绍此特性及其优势。

<!--
## About backoff limit per index

When you run workloads on Kubernetes, you must consider scenarios where Pod
failures can affect the completion of your workloads. Ideally, your workload
should tolerate transient failures and continue running.

To achieve failure tolerance in a Kubernetes Job, you can set the
`spec.backoffLimit` field. This field specifies the total number of tolerated
failures.
-->
## 关于逐索引的回退限制   {#about-backoff-limit-per-index}

当你在 Kubernetes 上运行工作负载时，必须考虑 Pod 失效可能影响工作负载完成的场景。
理想情况下，你的工作负载应该能够容忍短暂的失效并继续运行。

为了在 Kubernetes Job 中容忍失效，你可以设置 `spec.backoffLimit` 字段。
此字段指定容忍的失效总数。

<!--
However, for workloads where every index is considered independent, like
[embarassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel)
workloads - the `spec.backoffLimit` field is often not flexible enough.
For example, you may choose to run multiple suites of integration tests by
representing each suite as an index within an [Indexed Job](/docs/tasks/job/indexed-parallel-processing-static/).
In that setup, a fast-failing index  (test suite) is likely to consume your
entire budget for tolerating Pod failures, and you might not be able to run the
other indexes.
-->
但是，对于每个索引都被视为独立单元的工作负载，
比如[过易并行](https://zh.wikipedia.org/zh-cn/%E8%BF%87%E6%98%93%E5%B9%B6%E8%A1%8C)的工作负载，
`spec.backoffLimit` 字段通常不够灵活。例如，你可以选择运行多个继承测试套件，
将每个套件作为[带索引的 Job](/zh-cn/docs/tasks/job/indexed-parallel-processing-static/)内的某个索引。
在这种情况下，快速失效的索引（测试套件）很可能消耗你全部的 Pod 失效容忍预算，你可能无法运行其他索引的 Pod。

<!--
In order to address this limitation, Kubernetes introduced _backoff limit per index_,
which allows you to control the number of retries per index.

## How backoff limit per index works

To use Backoff Limit Per Index for Indexed Jobs, specify the number of tolerated
Pod failures per index with the `spec.backoffLimitPerIndex` field. When you set
this field, the Job executes all indexes by default.
-->
为了解决这一限制，Kubernetes 引入了**逐索引的回退限制**，允许你控制逐索引的重试次数。

## 逐索引回退限制的工作原理   {#how-backoff-limit-per-index-works}

要在带索引的 Job 中使用逐索引的回退限制，可以通过 `spec.backoffLimitPerIndex`
字段指定每个索引允许的 Pod 失效次数。当你设置此字段后，Job 默认将执行所有索引。

<!--
Additionally, to fine-tune the error handling:
* Specify the cap on the total number of failed indexes by setting the
  `spec.maxFailedIndexes` field. When the limit is exceeded the entire Job is
  terminated.
* Define a short-circuit to detect a failed index by using the `FailIndex` action in the
  [Pod Failure Policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
  mechanism.
-->
另外，你可以通过以下方式微调错误处理：

* 通过设置 `spec.maxFailedIndexes` 字段，指定失效索引总数的上限。超过此限制时，整个 Job 会被终止。
* 通过 [Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)机制中的
  `FailIndex` 动作定义短路来检测失效的索引。

<!--
When the number of tolerated failures is exceeded, the Job marks that index as
failed and lists it in the Job's `status.failedIndexes` field.

### Example

The following Job spec snippet is an example of how to combine backoff limit per
index with the _Pod Failure Policy_ feature:
-->
当超过容忍的失效次数时，Job 会将该索引标记为失效，并在 Job 的 `status.failedIndexes` 字段中列出该索引。

### 示例

下面的 Job 规约片段展示了如何将逐索引的回退限制与 **Pod 失效策略**特性结合使用：

```yaml
completions: 10
parallelism: 10
completionMode: Indexed
backoffLimitPerIndex: 1
maxFailedIndexes: 5
podFailurePolicy:
  rules:
  - action: Ignore
    onPodConditions:
    - type: DisruptionTarget
  - action: FailIndex
    onExitCodes:
      operator: In
      values: [ 42 ]
```

<!--
In this example, the Job handles Pod failures as follows:

- Ignores any failed Pods that have the built-in
  [disruption condition](/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions),
  called `DisruptionTarget`. These Pods don't count towards Job backoff limits.
- Fails the index corresponding to the failed Pod if any of the failed Pod's
  containers finished with the exit code 42 - based on the matching "FailIndex"
  rule.
-->
在此例中，Job 对 Pod 失效的处理逻辑如下：

* 忽略具有内置[干扰状况](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions)
  （称为 `DisruptionTarget`）的失效 Pod。这些 Pod 不计入 Job 的回退限制。
* 如果失效的 Pod 中任何容器的退出码是 42，则基于匹配的 `FailIndex` 规则，将对应的索引标记为失效。
<!--
- Retries the first failure of any index, unless the index failed due to the
  matching `FailIndex` rule.
- Fails the entire Job if the number of failed indexes exceeded 5 (set by the
  `spec.maxFailedIndexes` field).
-->
* 除非索引因匹配的 `FailIndex` 规则失效，否则会重试该索引的首次失效。
* 如果失效索引数量超过 5 个（由 `spec.maxFailedIndexes` 设置），则整个 Job 失效。

<!--
## Learn more

- Read the blog post on the closely related feature of Pod Failure Policy [Kubernetes 1.31: Pod Failure Policy for Jobs Goes GA](/blog/2024/08/19/kubernetes-1-31-pod-failure-policy-for-jobs-goes-ga/)
- For a hands-on guide to using Pod failure policy, including the use of FailIndex, see
  [Handling retriable and non-retriable pod failures with Pod failure policy](/docs/tasks/job/pod-failure-policy/)
- Read the documentation for
  [Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index) and
  [Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
- Read the KEP for the [Backoff Limits Per Index For Indexed Jobs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs)
-->
## 进一步了解

* 阅读与 Pod 失效策略密切相关的博客文章：[Kubernetes 1.31：Job 的 Pod 失效策略进阶至 GA](/zh-cn/blog/2024/08/19/kubernetes-1-31-pod-failure-policy-for-jobs-goes-ga/)
* 查看包含 FailIndex 用法在内的 Pod 失效策略实操指南：
  [使用 Pod 失效策略处理可重试和不可重试的 Pod 失效](/zh-cn/docs/tasks/job/pod-failure-policy/)
* 阅读[逐索引的回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)和
  [Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)等文档
* 查阅 KEP：[带索引的 Job 的逐索引回退限制](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs)

<!--
## Get involved

This work was sponsored by the Kubernetes
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) community.

If you are interested in working on new features in the space we recommend
subscribing to our [Slack](https://kubernetes.slack.com/messages/wg-batch)
channel and attending the regular community meetings.
-->
## 参与此工作   {#get-involved}

这项工作由 Kubernetes [Batch Working Group（批处理工作组）](https://github.com/kubernetes/community/tree/master/wg-batch)负责，且与
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 社区密切协作。

如果你有兴趣参与此领域的新特性开发，建议订阅我们的
[Slack 频道](https://kubernetes.slack.com/messages/wg-batch)，并参加定期社区会议。
