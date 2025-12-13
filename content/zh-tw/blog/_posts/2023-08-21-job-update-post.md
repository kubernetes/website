---
layout: blog
title: "Kubernetes 1.28：Job 失效處理的改進"
date: 2023-08-21
slug: kubernetes-1-28-jobapi-update
---

<!--
layout: blog
title: "Kubernetes 1.28: Improved failure handling for Jobs"
date: 2023-08-21
slug: kubernetes-1-28-jobapi-update
-->

<!--
**Authors:** Kevin Hannon (G-Research), Michał Woźniak (Google)
-->
**作者：** Kevin Hannon (G-Research), Michał Woźniak (Google)

**譯者：** Xin Li (Daocloud)

<!--
This blog discusses two new features in Kubernetes 1.28 to improve Jobs for batch
users: [Pod replacement policy](/docs/concepts/workloads/controllers/job/#pod-replacement-policy)
and [Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index).
-->
本博客討論 Kubernetes 1.28 中的兩個新特性，用於爲批處理使用者改進 Job：
[Pod 更換策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-replacement-policy)
和[基於索引的回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)。

<!--
These features continue the effort started by the
[Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
to improve the handling of Pod failures in a Job.
-->
這些特性延續了 [Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)
爲開端的工作，用來改進對 Job 中 Pod 失效的處理。

<!--
## Pod replacement policy {#pod-replacement-policy}

By default, when a pod enters a terminating state (e.g. due to preemption or
eviction), Kubernetes immediately creates a replacement Pod. Therefore, both Pods are running
at the same time. In API terms, a pod is considered terminating when it has a
`deletionTimestamp` and it has a phase `Pending` or `Running`.
-->
## Pod 更換策略  {#pod-replacement-policy}

預設情況下，當 Pod 進入終止（Terminating）狀態（例如由於搶佔或驅逐機制）時，Kubernetes
會立即創建一個替換的 Pod，因此這時會有兩個 Pod 同時運行。就 API 而言，當 Pod 具有
`deletionTimestamp` 字段並且處於 `Pending` 或 `Running` 階段時會被視爲終止。

<!--
The scenario when two Pods are running at a given time is problematic for
some popular machine learning frameworks, such as
TensorFlow and [JAX](https://jax.readthedocs.io/en/latest/), which require at most one Pod running at the same time,
for a given index. 
Tensorflow gives the following error if two pods are running for a given index.
-->
對於一些流行的機器學習框架來說，在給定時間運行兩個 Pod 的情況是有問題的，
例如 TensorFlow 和 [JAX](https://jax.readthedocs.io/en/latest/)，
對於給定的索引，它們最多同時運行一個 Pod。如果兩個 Pod 使用同一個索引來運行，
Tensorflow 會拋出以下錯誤：

```
 /job:worker/task:4: Duplicate task registration with task_name=/job:worker/replica:0/task:4
```

<!--
See more details in the ([issue](https://github.com/kubernetes/kubernetes/issues/115844)).

Creating the replacement Pod before the previous one fully terminates can also
cause problems in clusters with scarce resources or with tight budgets, such as:
* cluster resources can be difficult to obtain for Pods pending to be scheduled,
  as Kubernetes might take a long time to find available nodes until the existing
  Pods are fully terminated.
* if cluster autoscaler is enabled, the replacement Pods might produce undesired
  scale ups.
-->
可參考[問題報告](https://github.com/kubernetes/kubernetes/issues/115844)進一步瞭解細節。

在前一個 Pod 完全終止之前創建替換的 Pod 也可能會導致資源或預算緊張的叢集出現問題，例如：

* 對於待調度的 Pod 來說，很難分配到叢集資源，導致 Kubernetes 需要很長時間才能找到可用節點，
  直到現有 Pod 完全終止。
* 如果啓用了叢集自動擴縮器（Cluster Autoscaler），可能會產生不必要的叢集規模擴增。

<!--
### How can you use it? {#pod-replacement-policy-how-to-use}

This is an alpha feature, which you can enable by turning on `JobPodReplacementPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) in
your cluster.

Once the feature is enabled in your cluster, you can use it by creating a new Job that specifies a
`podReplacementPolicy` field as shown here:
-->
### 如何使用？  {#pod-replacement-policy-how-to-use}

這是一項 Alpha 級別特性，你可以通過在叢集中啓用 `JobPodReplacementPolicy`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
來啓用該特性。

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  podReplacementPolicy: Failed
  ...
```

<!--
In that Job, the Pods would only be replaced once they reached the `Failed` phase,
and not when they are terminating.

Additionally, you can inspect the `.status.terminating` field of a Job. The value
of the field is the number of Pods owned by the Job that are currently terminating.
-->
在此 Job 中，Pod 僅在達到 `Failed` 階段時纔會被替換，而不是在它們處於終止過程中（Terminating）時被替換。

此外，你可以檢查 Job 的 `.status.termination` 字段。該字段的值表示終止過程中的
Job 所關聯的 Pod 數量。

```shell
kubectl get jobs/myjob -o=jsonpath='{.items[*].status.terminating}'
```

```
3 # three Pods are terminating and have not yet reached the Failed phase
```

<!--
This can be particularly useful for external queueing controllers, such as
[Kueue](https://github.com/kubernetes-sigs/kueue), that tracks quota
from running Pods of a Job until the resources are reclaimed from
the currently terminating Job.

Note that the `podReplacementPolicy: Failed` is the default when using a custom
[Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy).
-->
這一特性對於外部排隊控制器（例如 [Kueue](https://github.com/kubernetes-sigs/kueue)）特別有用，
它跟蹤作業的運行 Pod 的配額，直到從當前終止過程中的 Job 資源被回收爲止。

請注意，使用自定義 [Pod 失敗策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)時，
`podReplacementPolicy: Failed` 是預設值。

<!--
## Backoff limit per index {#backoff-limit-per-index}

By default, Pod failures for [Indexed Jobs](/docs/concepts/workloads/controllers/job/#completion-mode)
are counted towards the global limit of retries, represented by `.spec.backoffLimit`.
This means, that if there is a consistently failing index, it is restarted
repeatedly until it exhausts the limit. Once the limit is reached the entire
Job is marked failed and some indexes may never be even started.
-->
## 逐索引的回退限制  {#backoff-limit-per-index}

預設情況下，[帶索引的 Job（Indexed Job）](/zh-cn/docs/concepts/workloads/controllers/job/#completion-mode)的
Pod 失敗情況會被統計下來，受 `.spec.backoffLimit` 字段所設置的全局重試次數限制。
這意味着，如果存在某個索引值的 Pod 一直持續失敗，則會 Pod 會被重新啓動，直到重試次數達到限制值。
一旦達到限制值，整個 Job 將被標記爲失敗，並且對應某些索引的 Pod 甚至可能從不曾被啓動。

<!--
This is problematic for use cases where you want to handle Pod failures for
every index independently. For example, if you use Indexed Jobs for running
integration tests where each index corresponds to a testing suite. In that case,
you may want to account for possible flake tests allowing for 1 or 2 retries per
suite. There might be some buggy suites, making the corresponding
indexes fail consistently. In that case you may prefer to limit retries for
the buggy suites, yet allowing other suites to complete.
-->
對於你想要獨立處理不同索引值的 Pod 的失敗的場景而言，這是有問題的。
例如，如果你使用帶索引的 Job（Indexed Job）來運行集成測試，其中每個索引值對應一個測試套件。
在這種情況下，你可能需要考慮可能發生的脆弱測試（Flake Test），允許每個套件重試 1 次或 2 次。
可能存在一些有缺陷的套件，導致對應索引的 Pod 始終失敗。在這種情況下，
你或許更希望限制有問題的套件的重試，而允許其他套件完成。

<!--
The feature allows you to:
* complete execution of all indexes, despite some indexes failing.
* better utilize the computational resources by avoiding unnecessary retries of consistently failing indexes.
-->
此特性允許你：
* 儘管某些索引值的 Pod 失敗，但仍完成執行所有索引值的 Pod。
* 通過避免對持續失敗的、特定索引值的 Pod 進行不必要的重試，更好地利用計算資源。

<!--
### How can you use it? {#backoff-limit-per-index-how-to-use}

This is an alpha feature, which you can enable by turning on the
`JobBackoffLimitPerIndex`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
in your cluster.

Once the feature is enabled in your cluster, you can create an Indexed Job with the
`.spec.backoffLimitPerIndex` field specified.
-->
### 可以如何使用它？  {#backoff-limit-per-index-how-to-use}

這是一個 Alpha 特性，你可以通過啓用叢集的 `JobBackoffLimitPerIndex`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來啓用此特性。

在叢集中啓用該特性後，你可以在創建帶索引的 Job（Indexed Job）時指定 `.spec.backoffLimitPerIndex` 字段。

<!--
#### Example

The following example demonstrates how to use this feature to make sure the
Job executes all indexes (provided there is no other reason for the early Job
termination, such as reaching the `activeDeadlineSeconds` timeout, or being
manually deleted by the user), and the number of failures is controlled per index.
-->
#### 示例

下面的示例演示如何使用此功能來確保 Job 執行所有索引值的 Pod（前提是沒有其他原因導致 Job 提前終止，
例如達到 `activeDeadlineSeconds` 超時，或者被使用者手動刪除），以及按索引控制失敗次數。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-backoff-limit-per-index-execute-all
spec:
  completions: 8
  parallelism: 2
  completionMode: Indexed
  backoffLimitPerIndex: 1
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: example # 當此示例容器作爲任何 Job 中的第二個或第三個索引運行時（即使在重試之後），它會返回錯誤並失敗
        image: python
        command:
        - python3
        - -c
        - |
          import os, sys, time
          id = int(os.environ.get("JOB_COMPLETION_INDEX"))
          if id == 1 or id == 2:
            sys.exit(1)
          time.sleep(1)
```

<!--
Now, inspect the Pods after the job is finished:
-->
現在，在 Job 完成後檢查 Pod：

```sh
kubectl get pods -l job-name=job-backoff-limit-per-index-execute-all
```

<!--
Returns output similar to this:
-->
返回的輸出類似與：

```
NAME                                              READY   STATUS      RESTARTS   AGE
job-backoff-limit-per-index-execute-all-0-b26vc   0/1     Completed   0          49s
job-backoff-limit-per-index-execute-all-1-6j5gd   0/1     Error       0          49s
job-backoff-limit-per-index-execute-all-1-6wd82   0/1     Error       0          37s
job-backoff-limit-per-index-execute-all-2-c66hg   0/1     Error       0          32s
job-backoff-limit-per-index-execute-all-2-nf982   0/1     Error       0          43s
job-backoff-limit-per-index-execute-all-3-cxmhf   0/1     Completed   0          33s
job-backoff-limit-per-index-execute-all-4-9q6kq   0/1     Completed   0          28s
job-backoff-limit-per-index-execute-all-5-z9hqf   0/1     Completed   0          28s
job-backoff-limit-per-index-execute-all-6-tbkr8   0/1     Completed   0          23s
job-backoff-limit-per-index-execute-all-7-hxjsq   0/1     Completed   0          22s
```

<!--
Additionally, you can take a look at the status for that Job:
-->
此外，你可以查看該 Job 的狀態：

```sh
kubectl get jobs job-backoff-limit-per-index-fail-index -o yaml
```

<!--
The output ends with a `status` similar to:
-->
輸出內容以 `status` 結尾，類似於：

```yaml
  status:
    completedIndexes: 0,3-7
    failedIndexes: 1,2
    succeeded: 6
    failed: 4
    conditions:
    - message: Job has failed indexes
      reason: FailedIndexes
      status: "True"
      type: Failed
```

<!--
Here, indexes `1`  and `2` were both retried once. After the second failure,
in each of them, the specified `.spec.backoffLimitPerIndex` was exceeded, so
the retries were stopped. For comparison, if the per-index backoff was disabled,
then the buggy indexes would retry until the global `backoffLimit` was exceeded,
and then the entire Job would be marked failed, before some of the higher
indexes are started.
-->
這裏，索引爲 `1` 和 `2` 的 Pod 都被重試了一次。這兩個 Pod 在第二次失敗後都超出了指定的
`.spec.backoffLimitPerIndex`，因此停止重試。相比之下，如果禁用了基於索引的回退，
那麼有問題的、特定索引的 Pod 將被重試，直到超出全局 `backoffLimit`，之後在啓動一些索引值較高的 Pod 之前，
整個 Job 將被標記爲失敗。

<!--
## How can you learn more?

- Read the user-facing documentation for [Pod replacement policy](/docs/concepts/workloads/controllers/job/#pod-replacement-policy),
[Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index), and
[Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
- Read the KEPs for [Pod Replacement Policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated),
[Backoff limit per index](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs), and
[Pod failure policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures).
-->
## 如何進一步瞭解 {#how-can-you-learn-more}

- 閱讀面向使用者的 [Pod 替換策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-replacement-policy)文檔、
  [逐索引的回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)和
  [Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)
- 閱讀 [Pod 替換策略](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated))、
  [逐索引的回退限制](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs)和
  [Pod 失效策略](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures)的 KEP。

<!--
## Getting Involved

These features were sponsored by [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps).  Batch use cases are actively
being improved for Kubernetes users in the
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch).
Working groups are relatively short-lived initiatives focused on specific goals.
The goal of the WG Batch is to improve experience for batch workload users, offer support for
batch processing use cases, and enhance the
Job API for common use cases.  If that interests you, please join the working
group either by subscriping to our
[mailing list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on
[Slack](https://kubernetes.slack.com/messages/wg-batch).
-->
## 參與其中 {#getting-Involved}

這些功能由 [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 贊助。
社區正在爲[批處理工作組](https://github.com/kubernetes/community/tree/master/wg-batch)中的
Kubernetes 使用者積極改進批處理場景。
工作組是相對短暫的舉措，專注於特定目標。WG Batch 的目標是改善批處理工作負載的使用者體驗、
提供對批處理場景的支持並增強常見場景下的 Job API。
如果你對此感興趣，請通過訂閱我們的[郵件列表](https://groups.google.com/a/kubernetes.io/g/wg-batch)或通過
[Slack](https://kubernetes.slack.com/messages/wg-batch) 加入進來。

<!--
## Acknowledgments

As with any Kubernetes feature, multiple people contributed to getting this
done, from testing and filing bugs to reviewing code.

We would not have been able to achieve either of these features without Aldo
Culquicondor (Google) providing excellent domain knowledge and expertise
throughout the Kubernetes ecosystem.
-->
## 致謝 {#acknowledgments}

與其他 Kubernetes 特性一樣，從測試、報告缺陷到代碼審查，很多人爲此特性做出了貢獻。

如果沒有 Aldo Culquicondor（Google）提供出色的領域知識和跨整個 Kubernetes 生態系統的知識，
我們可能無法實現這些特性。
