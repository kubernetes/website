---
layout: blog
title: "Kubernetes 1.28：Job 失效处理的改进"
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

**译者：** Xin Li (Daocloud)

<!--
This blog discusses two new features in Kubernetes 1.28 to improve Jobs for batch
users: [Pod replacement policy](/docs/concepts/workloads/controllers/job/#pod-replacement-policy)
and [Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index).
-->
本博客讨论 Kubernetes 1.28 中的两个新特性，用于为批处理用户改进 Job：
[Pod 更换策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-replacement-policy)
和[基于索引的回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)。

<!--
These features continue the effort started by the
[Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
to improve the handling of Pod failures in a Job.
-->
这些特性延续了 [Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)
为开端的工作，用来改进对 Job 中 Pod 失效的处理。

<!--
## Pod replacement policy {#pod-replacement-policy}

By default, when a pod enters a terminating state (e.g. due to preemption or
eviction), Kubernetes immediately creates a replacement Pod. Therefore, both Pods are running
at the same time. In API terms, a pod is considered terminating when it has a
`deletionTimestamp` and it has a phase `Pending` or `Running`.
-->
## Pod 更换策略  {#pod-replacement-policy}

默认情况下，当 Pod 进入终止（Terminating）状态（例如由于抢占或驱逐机制）时，Kubernetes
会立即创建一个替换的 Pod，因此这时会有两个 Pod 同时运行。就 API 而言，当 Pod 具有
`deletionTimestamp` 字段并且处于 `Pending` 或 `Running` 阶段时会被视为终止。

<!--
The scenario when two Pods are running at a given time is problematic for
some popular machine learning frameworks, such as
TensorFlow and [JAX](https://jax.readthedocs.io/en/latest/), which require at most one Pod running at the same time,
for a given index. 
Tensorflow gives the following error if two pods are running for a given index.
-->
对于一些流行的机器学习框架来说，在给定时间运行两个 Pod 的情况是有问题的，
例如 TensorFlow 和 [JAX](https://jax.readthedocs.io/en/latest/)，
对于给定的索引，它们最多同时运行一个 Pod。如果两个 Pod 使用同一个索引来运行，
Tensorflow 会抛出以下错误：

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
可参考[问题报告](https://github.com/kubernetes/kubernetes/issues/115844)进一步了解细节。

在前一个 Pod 完全终止之前创建替换的 Pod 也可能会导致资源或预算紧张的集群出现问题，例如：

* 对于待调度的 Pod 来说，很难分配到集群资源，导致 Kubernetes 需要很长时间才能找到可用节点，
  直到现有 Pod 完全终止。
* 如果启用了集群自动扩缩器（Cluster Autoscaler），可能会产生不必要的集群规模扩增。

<!--
### How can you use it? {#pod-replacement-policy-how-to-use}

This is an alpha feature, which you can enable by turning on `JobPodReplacementPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) in
your cluster.

Once the feature is enabled in your cluster, you can use it by creating a new Job that specifies a
`podReplacementPolicy` field as shown here:
-->
### 如何使用？  {#pod-replacement-policy-how-to-use}

这是一项 Alpha 级别特性，你可以通过在集群中启用 `JobPodReplacementPolicy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
来启用该特性。

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
在此 Job 中，Pod 仅在达到 `Failed` 阶段时才会被替换，而不是在它们处于终止过程中（Terminating）时被替换。

此外，你可以检查 Job 的 `.status.termination` 字段。该字段的值表示终止过程中的
Job 所关联的 Pod 数量。

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
这一特性对于外部排队控制器（例如 [Kueue](https://github.com/kubernetes-sigs/kueue)）特别有用，
它跟踪作业的运行 Pod 的配额，直到从当前终止过程中的 Job 资源被回收为止。

请注意，使用自定义 [Pod 失败策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)时，
`podReplacementPolicy: Failed` 是默认值。

<!--
## Backoff limit per index {#backoff-limit-per-index}

By default, Pod failures for [Indexed Jobs](/docs/concepts/workloads/controllers/job/#completion-mode)
are counted towards the global limit of retries, represented by `.spec.backoffLimit`.
This means, that if there is a consistently failing index, it is restarted
repeatedly until it exhausts the limit. Once the limit is reached the entire
Job is marked failed and some indexes may never be even started.
-->
## 逐索引的回退限制  {#backoff-limit-per-index}

默认情况下，[带索引的 Job（Indexed Job）](/zh-cn/docs/concepts/workloads/controllers/job/#completion-mode)的
Pod 失败情况会被统计下来，受 `.spec.backoffLimit` 字段所设置的全局重试次数限制。
这意味着，如果存在某个索引值的 Pod 一直持续失败，则会 Pod 会被重新启动，直到重试次数达到限制值。
一旦达到限制值，整个 Job 将被标记为失败，并且对应某些索引的 Pod 甚至可能从不曾被启动。

<!--
This is problematic for use cases where you want to handle Pod failures for
every index independently. For example, if you use Indexed Jobs for running
integration tests where each index corresponds to a testing suite. In that case,
you may want to account for possible flake tests allowing for 1 or 2 retries per
suite. There might be some buggy suites, making the corresponding
indexes fail consistently. In that case you may prefer to limit retries for
the buggy suites, yet allowing other suites to complete.
-->
对于你想要独立处理不同索引值的 Pod 的失败的场景而言，这是有问题的。
例如，如果你使用带索引的 Job（Indexed Job）来运行集成测试，其中每个索引值对应一个测试套件。
在这种情况下，你可能需要考虑可能发生的脆弱测试（Flake Test），允许每个套件重试 1 次或 2 次。
可能存在一些有缺陷的套件，导致对应索引的 Pod 始终失败。在这种情况下，
你或许更希望限制有问题的套件的重试，而允许其他套件完成。

<!--
The feature allows you to:
* complete execution of all indexes, despite some indexes failing.
* better utilize the computational resources by avoiding unnecessary retries of consistently failing indexes.
-->
此特性允许你：
* 尽管某些索引值的 Pod 失败，但仍完成执行所有索引值的 Pod。
* 通过避免对持续失败的、特定索引值的 Pod 进行不必要的重试，更好地利用计算资源。

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

这是一个 Alpha 特性，你可以通过启用集群的 `JobBackoffLimitPerIndex`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)来启用此特性。

在集群中启用该特性后，你可以在创建带索引的 Job（Indexed Job）时指定 `.spec.backoffLimitPerIndex` 字段。

<!--
#### Example

The following example demonstrates how to use this feature to make sure the
Job executes all indexes (provided there is no other reason for the early Job
termination, such as reaching the `activeDeadlineSeconds` timeout, or being
manually deleted by the user), and the number of failures is controlled per index.
-->
#### 示例

下面的示例演示如何使用此功能来确保 Job 执行所有索引值的 Pod（前提是没有其他原因导致 Job 提前终止，
例如达到 `activeDeadlineSeconds` 超时，或者被用户手动删除），以及按索引控制失败次数。

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
      - name: example # 当此示例容器作为任何 Job 中的第二个或第三个索引运行时（即使在重试之后），它会返回错误并失败
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
现在，在 Job 完成后检查 Pod：

```sh
kubectl get pods -l job-name=job-backoff-limit-per-index-execute-all
```

<!--
Returns output similar to this:
-->
返回的输出类似与：

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
此外，你可以查看该 Job 的状态：

```sh
kubectl get jobs job-backoff-limit-per-index-fail-index -o yaml
```

<!--
The output ends with a `status` similar to:
-->
输出内容以 `status` 结尾，类似于：

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
这里，索引为 `1` 和 `2` 的 Pod 都被重试了一次。这两个 Pod 在第二次失败后都超出了指定的
`.spec.backoffLimitPerIndex`，因此停止重试。相比之下，如果禁用了基于索引的回退，
那么有问题的、特定索引的 Pod 将被重试，直到超出全局 `backoffLimit`，之后在启动一些索引值较高的 Pod 之前，
整个 Job 将被标记为失败。

<!--
## How can you learn more?

- Read the user-facing documentation for [Pod replacement policy](/docs/concepts/workloads/controllers/job/#pod-replacement-policy),
[Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index), and
[Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
- Read the KEPs for [Pod Replacement Policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated),
[Backoff limit per index](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs), and
[Pod failure policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures).
-->
## 如何进一步了解 {#how-can-you-learn-more}

- 阅读面向用户的 [Pod 替换策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-replacement-policy)文档、
  [逐索引的回退限制](/zh-cn/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)和
  [Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job/#pod-failure-policy)
- 阅读 [Pod 替换策略](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated))、
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
## 参与其中 {#getting-Involved}

这些功能由 [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 赞助。
社区正在为[批处理工作组](https://github.com/kubernetes/community/tree/master/wg-batch)中的
Kubernetes 用户积极改进批处理场景。
工作组是相对短暂的举措，专注于特定目标。WG Batch 的目标是改善批处理工作负载的用户体验、
提供对批处理场景的支持并增强常见场景下的 Job API。
如果你对此感兴趣，请通过订阅我们的[邮件列表](https://groups.google.com/a/kubernetes.io/g/wg-batch)或通过
[Slack](https://kubernetes.slack.com/messages/wg-batch) 加入进来。

<!--
## Acknowledgments

As with any Kubernetes feature, multiple people contributed to getting this
done, from testing and filing bugs to reviewing code.

We would not have been able to achieve either of these features without Aldo
Culquicondor (Google) providing excellent domain knowledge and expertise
throughout the Kubernetes ecosystem.
-->
## 致谢 {#acknowledgments}

与其他 Kubernetes 特性一样，从测试、报告缺陷到代码审查，很多人为此特性做出了贡献。

如果没有 Aldo Culquicondor（Google）提供出色的领域知识和跨整个 Kubernetes 生态系统的知识，
我们可能无法实现这些特性。
