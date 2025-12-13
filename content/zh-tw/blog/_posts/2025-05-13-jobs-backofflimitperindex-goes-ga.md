---
layout: blog
title: "Kubernetes v1.33：Job 逐索引的回退限制進階至 GA"
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
在 Kubernetes v1.33 中，**逐索引的回退限制**特性進階至 GA（正式發佈）。本文介紹此特性及其優勢。

<!--
## About backoff limit per index

When you run workloads on Kubernetes, you must consider scenarios where Pod
failures can affect the completion of your workloads. Ideally, your workload
should tolerate transient failures and continue running.

To achieve failure tolerance in a Kubernetes Job, you can set the
`spec.backoffLimit` field. This field specifies the total number of tolerated
failures.
-->
## 關於逐索引的回退限制   {#about-backoff-limit-per-index}

當你在 Kubernetes 上運行工作負載時，必須考慮 Pod 失效可能影響工作負載完成的場景。
理想情況下，你的工作負載應該能夠容忍短暫的失效並繼續運行。

爲了在 Kubernetes Job 中容忍失效，你可以設置 `spec.backoffLimit` 字段。
此字段指定容忍的失效總數。

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
但是，對於每個索引都被視爲獨立單元的工作負載，
比如[過易並行](https://zh.wikipedia.org/zh-cn/%E8%BF%87%E6%98%93%E5%B9%B6%E8%A1%8C)的工作負載，
`spec.backoffLimit` 字段通常不夠靈活。例如，你可以選擇運行多個繼承測試套件，
將每個套件作爲[帶索引的 Job](/zh-cn/docs/tasks/job/indexed-parallel-processing-static/)內的某個索引。
在這種情況下，快速失效的索引（測試套件）很可能消耗你全部的 Pod 失效容忍預算，你可能無法運行其他索引的 Pod。

<!--
In order to address this limitation, Kubernetes introduced _backoff limit per index_,
which allows you to control the number of retries per index.

## How backoff limit per index works

To use Backoff Limit Per Index for Indexed Jobs, specify the number of tolerated
Pod failures per index with the `spec.backoffLimitPerIndex` field. When you set
this field, the Job executes all indexes by default.
-->
爲了解決這一限制，Kubernetes 引入了**逐索引的回退限制**，允許你控制逐索引的重試次數。

## 逐索引回退限制的工作原理   {#how-backoff-limit-per-index-works}

要在帶索引的 Job 中使用逐索引的回退限制，可以通過 `spec.backoffLimitPerIndex`
字段指定每個索引允許的 Pod 失效次數。當你設置此字段後，Job 預設將執行所有索引。

<!--
Additionally, to fine-tune the error handling:
* Specify the cap on the total number of failed indexes by setting the
  `spec.maxFailedIndexes` field. When the limit is exceeded the entire Job is
  terminated.
* Define a short-circuit to detect a failed index by using the `FailIndex` action in the
  [Pod Failure Policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
  mechanism.
-->
另外，你可以通過以下方式微調錯誤處理：

* 通過設置 `spec.maxFailedIndexes` 字段，指定失效索引總數的上限。超過此限制時，整個 Job 會被終止。
* 通過 [Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)機制中的
  `FailIndex` 動作定義短路來檢測失效的索引。

<!--
When the number of tolerated failures is exceeded, the Job marks that index as
failed and lists it in the Job's `status.failedIndexes` field.

### Example

The following Job spec snippet is an example of how to combine backoff limit per
index with the _Pod Failure Policy_ feature:
-->
當超過容忍的失效次數時，Job 會將該索引標記爲失效，並在 Job 的 `status.failedIndexes` 字段中列出該索引。

### 示例

下面的 Job 規約片段展示瞭如何將逐索引的回退限制與 **Pod 失效策略**特性結合使用：

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
在此例中，Job 對 Pod 失效的處理邏輯如下：

* 忽略具有內置[干擾狀況](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions)
  （稱爲 `DisruptionTarget`）的失效 Pod。這些 Pod 不計入 Job 的回退限制。
* 如果失效的 Pod 中任何容器的退出碼是 42，則基於匹配的 `FailIndex` 規則，將對應的索引標記爲失效。
<!--
- Retries the first failure of any index, unless the index failed due to the
  matching `FailIndex` rule.
- Fails the entire Job if the number of failed indexes exceeded 5 (set by the
  `spec.maxFailedIndexes` field).
-->
* 除非索引因匹配的 `FailIndex` 規則失效，否則會重試該索引的首次失效。
* 如果失效索引數量超過 5 個（由 `spec.maxFailedIndexes` 設置），則整個 Job 失效。

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
## 進一步瞭解

* 閱讀與 Pod 失效策略密切相關的博客文章：[Kubernetes 1.31：Job 的 Pod 失效策略進階至 GA](/zh-cn/blog/2024/08/19/kubernetes-1-31-pod-failure-policy-for-jobs-goes-ga/)
* 查看包含 FailIndex 用法在內的 Pod 失效策略實操指南：
  [使用 Pod 失效策略處理可重試和不可重試的 Pod 失效](/zh-cn/docs/tasks/job/pod-failure-policy/)
* 閱讀[逐索引的回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)和
  [Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)等文檔
* 查閱 KEP：[帶索引的 Job 的逐索引回退限制](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs)

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
## 參與此工作   {#get-involved}

這項工作由 Kubernetes [Batch Working Group（批處理工作組）](https://github.com/kubernetes/community/tree/master/wg-batch)負責，且與
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 社區密切協作。

如果你有興趣參與此領域的新特性開發，建議訂閱我們的
[Slack 頻道](https://kubernetes.slack.com/messages/wg-batch)，並參加定期社區會議。
