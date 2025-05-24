---
layout: blog
title: "Kubernetes 1.33：Job 的 SuccessPolicy 进阶至 GA"
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
我代表 Kubernetes 项目组，很高兴地宣布在 v1.33 版本中，Job 的**成功策略**已进阶至 GA（正式发布）。

<!--
## About Job's Success Policy

In batch workloads, you might want to use leader-follower patterns like [MPI](https://en.wikipedia.org/wiki/Message_Passing_Interface),
in which the leader controls the execution, including the followers' lifecycle.
-->
## 关于 Job 的成功策略   {#about-jobs-success-policy}

在批处理工作负载中，你可能希望使用类似
[MPI](https://en.wikipedia.org/wiki/Message_Passing_Interface)
的领导者跟随者（leader-follower）模式，其中领导者控制执行过程，包括跟随者的生命周期。

<!--
In this case, you might want to mark it as succeeded
even if some of the indexes failed. Unfortunately, a leader-follower Kubernetes Job that didn't use a success policy, in most cases, would have to require **all** Pods to finish successfully
for that Job to reach an overall succeeded state.

For Kubernetes Jobs, the API allows you to specify the early exit criteria using the `.spec.successPolicy`
field (you can only use the `.spec.successPolicy` field for an [indexed Job](/docs/concept/workloads/controllers/job/#completion-mode)).
Which describes a set of rules either using a list of succeeded indexes for a job, or defining a minimal required size of succeeded indexes.
-->
在这种情况下，即使某些索引失败了，你也可能希望将 Job 标记为成功。
然而，在没有使用成功策略的情况下，Kubernetes 中的领导者跟随者
Job 通常必须要求**所有** Pod 成功完成，整个 Job 才会被视为成功。

对于 Kubernetes Job，API 允许你通过 `.spec.successPolicy` 字段指定提前退出的条件
（你只能将此字段用于[带索引的 Job](/zh-cn/docs/concept/workloads/controllers/job/#completion-mode)）。
此字段通过使用已成功的索引列表或定义成功索引的最小数量来描述一组规则。

<!--
This newly stable field is especially valuable for scientific simulation, AI/ML and High-Performance Computing (HPC) batch workloads.
Users in these areas often run numerous experiments and may only need a specific number to complete successfully, rather than requiring all of them to succeed. 
In this case, the leader index failure is the only relevant Job exit criteria, and the outcomes for individual follower Pods are handled
only indirectly via the status of the leader index.
Moreover, followers do not know when they can terminate themselves.
-->
这个全新的稳定字段对科学仿真、AI/ML 和高性能计算（HPC）等批处理工作负载特别有价值。
这些领域的用户通常会运行大量实验，而他们可能只需要其中一部分成功完成，而不需要全部成功。
在这种情况下，领导者索引失败是对应 Job 的唯一重要退出条件，个别跟随者 Pod
的结果仅通过领导者索引的状态间接被处理。此外，跟随者自身并不知道何时可以终止。

<!--
After Job meets any __Success Policy__, the Job is marked as succeeded, and all Pods are terminated including the running ones.

## How it works

The following excerpt from a Job manifest, using `.successPolicy.rules[0].succeededCount`, shows an example of
using a custom success policy:
-->
一旦 Job 满足任一**成功策略**，此 Job 就会被标记为成功，并终止所有 Pod，包括正在运行的 Pod。

## 工作原理   {#how-it-works}

以下是使用 `.successPolicy.rules[0].succeededCount` 的 Job 清单片段，
这是一个自定义成功策略的例子：

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
在这里，只要有任意一个索引成功，Job 就会被标记为成功，而不管具体是哪个索引。
此外，你还可以基于 `.successPolicy.rules[0].succeededCount` 限制索引编号，如下所示：

<!--
# index of the leader Pod
-->
```yaml
parallelism: 10
completions: 10
completionMode: Indexed
successPolicy:
  rules:
  - succeededIndexes: 0 # 领导者 Pod 的索引
    succeededCount: 1
```

<!--
This example shows that the Job will be marked as succeeded once a Pod with a specific index (Pod index 0) has succeeded.

Once the Job either reaches one of the `successPolicy` rules, or achieves its `Complete` criteria based on `.spec.completions`,
the Job controller within kube-controller-manager adds the `SuccessCriteriaMet` condition to the Job status.
After that, the job-controller initiates cleanup and termination of Pods for Jobs with `SuccessCriteriaMet` condition.
Eventually, Jobs obtain `Complete` condition when the job-controller finished cleanup and termination.
-->
这个例子表示，只要具有特定索引（Pod 索引 0）的 Pod 成功，整个 Job 就会被标记为成功。

一旦 Job 满足任一条 `successPolicy` 规则，或根据 `.spec.completions` 达到其 `Complete` 条件，
kube-controller-manager 中的 Job 控制器就会向 Job 状态添加 `SuccessCriteriaMet` 状况。
之后，job-controller 会为具有 `SuccessCriteriaMet` 状况的 Job 发起 Pod 的清理和终止。
当 job-controller 完成清理和终止后，Job 会获得 `Complete` 状况。

<!--
## Learn more

- Read the documentation for
  [success policy](/docs/concepts/workloads/controllers/job/#success-policy).
- Read the KEP for the [Job success/completion policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3998-job-success-completion-policy)
-->
## 了解更多    {#learn-more}

* 阅读关于[成功策略的文档](/zh-cn/docs/concepts/workloads/controllers/job/#success-policy)
* 阅读关于 [Job 成功/完成策略的 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3998-job-success-completion-policy)

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
## 加入我们   {#get-involved}

这项工作由 Kubernetes 的
[Batch Working Group（批处理工作组）](https://github.com/kubernetes/community/tree/master/wg-batch)牵头，并与
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 社区密切协作。

如果你对此领域的新特性开发感兴趣，推荐你订阅我们的
[Slack 频道](https://kubernetes.slack.com/messages/wg-batch)，并参加定期举行的社区会议。
