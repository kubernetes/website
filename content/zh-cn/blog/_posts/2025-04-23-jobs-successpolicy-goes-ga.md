---
layout: blog
title: "Kubernetes 1.33：Job 的 SuccessPolicy 进阶至 GA"
date: 2025-04-23
draft: true
slug: kubernetes-1-33-jobs-success-policy-goes-ga
authors: >
  [Yuki Iwai](https://github.com/tenzen-y) (CyberAgent, Inc)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.33: Job's SuccessPolicy Goes GA"
date: 2025-04-23
draft: true
slug: kubernetes-1-33-jobs-success-policy-goes-ga
authors: >
  [Yuki Iwai](https://github.com/tenzen-y) (CyberAgent, Inc)
-->

<!--
On behalf of the Kubernetes project, I'm pleased to announce that Job _success policy_ has graduated to General Availability (GA) as part of the v1.33 release.
-->
我代表 Kubernetes 项目组，很高兴地宣布，Job 的**成功策略**已经在 v1.33 版本中正式进阶至 GA（正式发布）。

<!--
## About Job's Success Policy

In batch workloads, you might want to use leader-follower patterns like [MPI](https://en.wikipedia.org/wiki/Message_Passing_Interface),
in which the leader controls the execution, including the followers' lifecycle.
-->
## 关于 Job 的成功策略   {#about-jobs-success-policy}

在批处理工作负载中，你可能希望使用像
[MPI](https://en.wikipedia.org/wiki/Message_Passing_Interface)
这样的领导者追随者（leader-follower）模式，其中领导者控制执行流程，包括管理追随者的生命周期。

<!--
In this case, you might want to mark it as succeeded
even if some of the indexes failed. Unfortunately, a leader-follower Kubernetes Job that didn't use a success policy, in most cases, would have to require **all** Pods to finish successfully
for that Job to reach an overall succeeded state.
-->
在这种情况下，即便某些索引失败了，你可能仍然希望将整个 Job 标记为 Succeeded。
然而，在没有使用成功策略的情况下，一个使用领导者追随者模式的 Kubernetes Job
通常需要**所有** Pod 都成功完成，才能使该 Job 达到整体 Succeeded 的状态。

<!--
For Kubernetes Jobs, the API allows you to specify the early exit criteria using the `.spec.successPolicy`
field (you can only use the `.spec.successPolicy` field for an [indexed Job](/docs/concept/workloads/controllers/job/#completion-mode)).
Which describes a set of rules either using a list of succeeded indexes for a job, or defining a minimal required size of succeeded indexes.
-->
对于 Kubernetes Job，API 允许你通过使用 `.spec.successPolicy` 字段指定提前退出的标准
（你只能将 `.spec.successPolicy` 字段用于[索引型 Job](/zh-cn/docs/concept/workloads/controllers/job/#completion-mode)）。
此字段描述了一组判断 Job 成功与否的规则，可以是使用 Job 的 Succeeded 索引列表，或可以定义 Succeeded 索引要求的最小数量。

<!--
This newly stable field is especially valuable for scientific simulation, AI/ML and High-Performance Computing (HPC) batch workloads.
Users in these areas often run numerous experiments and may only need a specific number to complete successfully, rather than requiring all of them to succeed. 
In this case, the leader index failure is the only relevant Job exit criteria, and the outcomes for individual follower Pods are handled
only indirectly via the status of the leader index.
Moreover, followers do not know when they can terminate themselves.
-->
这个全新的稳定字段对于科学模拟、AI/ML 以及高性能计算（HPC）等批处理工作负载尤其有价值。
这些领域的用户通常会运行大量实验，而他们可能只需要一部分实验成功完成，而不是要求所有实验都成功。
在这种情况下，领导者索引的失败才是 Job 退出的唯一相关标准，个别追随者 Pod 的结果则通过领导者索引的状态间接处理。
此外，追随者通常不知道自己何时可以安全终止。

<!--
After Job meets any __Success Policy__, the Job is marked as succeeded, and all Pods are terminated including the running ones.

## How it works

The following excerpt from a Job manifest, using `.successPolicy.rules[0].succeededCount`, shows an example of
using a custom success policy:
-->
一旦 Job 满足任意任一__成功策略__，Job 就会被标记为 Succeeded，并终止所有 Pod，包括正在运行的 Pod。

## 工作机制   {#how-it-works}

以下是从使用 `.successPolicy.rules[0].succeededCount` 的 Job 清单中摘取的片段，
展示了如何使用自定义的成功策略：

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
在这个例子中，无论成功的是哪个索引，只要有一个索引成功，Job 就会被标记为 Succeeded。
此外，你还可以将 `succeededCount` 与特定的索引号配合使用，如下所示：

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
这个示例表明，只要特定索引（索引为 0 的 Pod）已成功完成，整个 Job 就会被标记为 Succeeded。

一旦 Job 达到了任意一个 `successPolicy` 规则，或者基于 `.spec.completions` 达成了 `Complete` 状况，
kube-controller-manager 中的 Job 控制器会在 Job 状态中添加 `SuccessCriteriaMet` 状况。
之后，Job 控制器将开始清理和终止满足 `SuccessCriteriaMet` 状况的 Job 的 Pod。
最终，当 Job 控制器完成清理和终止操作后，Job 将获得 `Complete` 状况。

<!--
## Learn more

- Read the documentation for
  [success policy](/docs/concepts/workloads/controllers/job/#success-policy).
- Read the KEP for the [Job success/completion policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3998-job-success-completion-policy)
-->
## 了解更多   {#learn-more}

- 阅读[成功策略](/zh-cn/docs/concepts/workloads/controllers/job/#success-policy)的文档。
- 阅读 [Job 成功/完成策略](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3998-job-success-completion-policy)的 KEP。

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

这一特性由 Kubernetes
的[批处理工作组（Batch Working Group）](https://github.com/kubernetes/community/tree/master/wg-batch)
主导开发，并与
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 社区紧密协作完成。

如果你有兴趣参与这一领域的新特性开发，推荐订阅我们的
[Slack](https://kubernetes.slack.com/messages/wg-batch)
频道，并参加定期的社区会议。
