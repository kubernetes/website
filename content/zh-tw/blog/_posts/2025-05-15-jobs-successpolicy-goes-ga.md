---
layout: blog
title: "Kubernetes 1.33：Job 的 SuccessPolicy 進階至 GA"
date: 2025-05-15T10:30:00-08:00
slug: kubernetes-1-33-jobs-success-policy-goes-ga
authors: >
  [Yuki Iwai](https://github.com/tenzen-y) (CyberAgent, Inc)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.33: Job's SuccessPolicy Goes GA"
date: 2025-05-15T10:30:00-08:00
slug: kubernetes-1-33-jobs-success-policy-goes-ga
authors: >
  [Yuki Iwai](https://github.com/tenzen-y) (CyberAgent, Inc)
-->

<!--
On behalf of the Kubernetes project, I'm pleased to announce that Job _success policy_ has graduated to General Availability (GA) as part of the v1.33 release.
-->
我代表 Kubernetes 項目組，很高興地宣佈在 v1.33 版本中，Job 的**成功策略**已進階至 GA（正式發佈）。

<!--
## About Job's Success Policy

In batch workloads, you might want to use leader-follower patterns like [MPI](https://en.wikipedia.org/wiki/Message_Passing_Interface),
in which the leader controls the execution, including the followers' lifecycle.
-->
## 關於 Job 的成功策略   {#about-jobs-success-policy}

在批處理工作負載中，你可能希望使用類似
[MPI（消息傳遞接口）](https://zh.wikipedia.org/zh-cn/%E8%A8%8A%E6%81%AF%E5%82%B3%E9%81%9E%E4%BB%8B%E9%9D%A2)
的領導者跟隨者（leader-follower）模式，其中領導者控制執行過程，包括跟隨者的生命週期。

<!--
In this case, you might want to mark it as succeeded
even if some of the indexes failed. Unfortunately, a leader-follower Kubernetes Job that didn't use a success policy, in most cases, would have to require **all** Pods to finish successfully
for that Job to reach an overall succeeded state.

For Kubernetes Jobs, the API allows you to specify the early exit criteria using the `.spec.successPolicy`
field (you can only use the `.spec.successPolicy` field for an [indexed Job](/docs/concept/workloads/controllers/job/#completion-mode)).
Which describes a set of rules either using a list of succeeded indexes for a job, or defining a minimal required size of succeeded indexes.
-->
在這種情況下，即使某些索引失敗了，你也可能希望將 Job 標記爲成功。
然而，在沒有使用成功策略的情況下，Kubernetes 中的領導者跟隨者
Job 通常必須要求**所有** Pod 成功完成，整個 Job 纔會被視爲成功。

對於 Kubernetes Job，API 允許你通過 `.spec.successPolicy` 字段指定提前退出的條件
（你只能將此字段用於[帶索引的 Job](/zh-cn/docs/concept/workloads/controllers/job/#completion-mode)）。
此字段通過使用已成功的索引列表或定義成功索引的最小數量來描述一組規則。

<!--
This newly stable field is especially valuable for scientific simulation, AI/ML and High-Performance Computing (HPC) batch workloads.
Users in these areas often run numerous experiments and may only need a specific number to complete successfully, rather than requiring all of them to succeed. 
In this case, the leader index failure is the only relevant Job exit criteria, and the outcomes for individual follower Pods are handled
only indirectly via the status of the leader index.
Moreover, followers do not know when they can terminate themselves.
-->
這個全新的穩定字段對科學仿真、AI/ML 和高性能計算（HPC）等批處理工作負載特別有價值。
這些領域的用戶通常會運行大量實驗，而他們可能只需要其中一部分成功完成，而不需要全部成功。
在這種情況下，領導者索引失敗是對應 Job 的唯一重要退出條件，個別跟隨者 Pod
的結果僅通過領導者索引的狀態間接被處理。此外，跟隨者自身並不知道何時可以終止。

<!--
After Job meets any __Success Policy__, the Job is marked as succeeded, and all Pods are terminated including the running ones.

## How it works

The following excerpt from a Job manifest, using `.successPolicy.rules[0].succeededCount`, shows an example of
using a custom success policy:
-->
一旦 Job 滿足任一**成功策略**，此 Job 就會被標記爲成功，並終止所有 Pod，包括正在運行的 Pod。

## 工作原理   {#how-it-works}

以下是使用 `.successPolicy.rules[0].succeededCount` 的 Job 清單片段，
這是一個自定義成功策略的例子：

```yaml
  parallelism: 10
  completions: 10
  completionMode: Indexed
  successPolicy:
    rules:
    - succeededCount: 1
```

<!--
Here, the Job is marked as succeeded when one index succeeded regardless of its number.
Additionally, you can constrain index numbers against `succeededCount` in `.successPolicy.rules[0].succeededCount`
as shown below:
-->
在這裏，只要有任意一個索引成功，Job 就會被標記爲成功，而不管具體是哪個索引。
此外，你還可以基於 `.successPolicy.rules[0].succeededCount` 限制索引編號，如下所示：

<!--
```yaml
parallelism: 10
completions: 10
completionMode: Indexed
successPolicy:
  rules:
  - succeededIndexes: 0 # index of the leader Pod
    succeededCount: 1
```
-->
```yaml
parallelism: 10
completions: 10
completionMode: Indexed
successPolicy:
  rules:
  - succeededIndexes: 0 # 領導者 Pod 的索引
    succeededCount: 1
```

<!--
This example shows that the Job will be marked as succeeded once a Pod with a specific index (Pod index 0) has succeeded.

Once the Job either reaches one of the `successPolicy` rules, or achieves its `Complete` criteria based on `.spec.completions`,
the Job controller within kube-controller-manager adds the `SuccessCriteriaMet` condition to the Job status.
After that, the job-controller initiates cleanup and termination of Pods for Jobs with `SuccessCriteriaMet` condition.
Eventually, Jobs obtain `Complete` condition when the job-controller finished cleanup and termination.
-->
這個例子表示，只要具有特定索引（Pod 索引 0）的 Pod 成功，整個 Job 就會被標記爲成功。

一旦 Job 滿足任一條 `successPolicy` 規則，或根據 `.spec.completions` 達到其 `Complete` 條件，
kube-controller-manager 中的 Job 控制器就會向 Job 狀態添加 `SuccessCriteriaMet` 狀況。
之後，job-controller 會爲具有 `SuccessCriteriaMet` 狀況的 Job 發起 Pod 的清理和終止。
當 job-controller 完成清理和終止後，Job 會獲得 `Complete` 狀況。

<!--
## Learn more

- Read the documentation for
  [success policy](/docs/concepts/workloads/controllers/job/#success-policy).
- Read the KEP for the [Job success/completion policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3998-job-success-completion-policy)
-->
## 瞭解更多    {#learn-more}

* 閱讀關於[成功策略的文檔](/zh-cn/docs/concepts/workloads/controllers/job/#success-policy)
* 閱讀關於 [Job 成功/完成策略的 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3998-job-success-completion-policy)

<!--
## Get involved

This work was led by the Kubernetes
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) community.

If you are interested in working on new features in the space I recommend
subscribing to our [Slack](https://kubernetes.slack.com/messages/wg-batch)
channel and attending the regular community meetings.
-->
## 加入我們   {#get-involved}

這項工作由 Kubernetes 的
[Batch Working Group（批處理工作組）](https://github.com/kubernetes/community/tree/master/wg-batch)牽頭，並與
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 社區密切協作。

如果你對此領域的新特性開發感興趣，推薦你訂閱我們的
[Slack 頻道](https://kubernetes.slack.com/messages/wg-batch)，並參加定期舉行的社區會議。
