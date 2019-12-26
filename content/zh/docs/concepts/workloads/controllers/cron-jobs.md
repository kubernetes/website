---
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

<!--
A _Cron Job_ creates [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) on a time-based schedule.

One CronJob object is like one line of a _crontab_ (cron table) file. It runs a job periodically
on a given schedule, written in [Cron](https://en.wikipedia.org/wiki/Cron) format.
-->

_Cron Job_ 创建基于时间调度的 [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)。

一个 CronJob 对象就像 _crontab_ (cron table) 文件中的一行。它用 [Cron](https://en.wikipedia.org/wiki/Cron) 格式进行编写，并周期性的在给定的调度时间执行 Job。

{{< note >}}
<!--All **CronJob** `schedule:` times are denoted in UTC.-->
所有 **CronJob** 的 `schedule:` 时间都是用 UTC 表示。
{{< /note >}}

<!--
For instructions on creating and working with cron jobs, and for an example of a spec file for a cron job, see [Running automated tasks with cron jobs](/docs/tasks/job/automated-tasks-with-cron-jobs).
-->

有关创建和使用 CronJob 的说明及规范文件的示例，请参见 [使用 CronJob 运行自动任务](/docs/tasks/job/automated-tasks-with-cron-jobs)。


{{% /capture %}}


{{% capture body %}}

<!--
## Cron Job Limitations

A cron job creates a job object _about_ once per execution time of its schedule. We say "about" because there
are certain circumstances where two jobs might be created, or no job might be created. We attempt to make these rare,
but do not completely prevent them. Therefore, jobs should be _idempotent_.
-->

## CronJob 限制

CronJob 创建 Job 对象，每个 Job 的执行次数大约为一次。
我们之所以说 "大约"，是因为在某些情况下，可能会创建两个 Job，或者不会创建任何 Job。
我们试图使这些情况尽量少发生，但不能完全杜绝。因此，Job 应该是 _幂等的_。

<!--
If `startingDeadlineSeconds` is set to a large value or left unset (the default)
and if `concurrencyPolicy` is set to `Allow`, the jobs will always run
at least once.
-->

如果 `startingDeadlineSeconds` 设置为很大的数值或未设置（默认），并且 `concurrencyPolicy` 设置为 `Allow`，则作业将始终至少运行一次。

<!--
For every CronJob, the CronJob controller checks how many schedules it missed in the duration from its last scheduled time until now. If there are more than 100 missed schedules, then it does not start the job and logs the error
-->

对于每个 CronJob，CronJob 控制器检查从上一次调度的时间点到现在所错过了调度次数。如果错过的调度次数超过 100 次，那么它就不会启动这个任务，并记录这个错误:

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.

````

<!--
It is important to note that if the `startingDeadlineSeconds` field is set (not `nil`), the controller counts how many missed jobs occurred from the value of `startingDeadlineSeconds` until now rather than from the last scheduled time until now. For example, if `startingDeadlineSeconds` is `200`, the controller counts how many missed jobs occurred in the last 200 seconds.
-->

需要注意的是，如果设置 `startingDeadlineSeconds` 字段非空，则控制器会统计从 `startingDeadlineSeconds` 的值到现在而不是从上一个计划时间到现在错过了多少次 Job。例如，如果 `startingDeadlineSeconds` 是 `200`，则控制器会统计在过去 200 秒中错过了多少次 Job。

<!--
A CronJob is counted as missed if it has failed to be created at its scheduled time. For example, If `concurrencyPolicy` is set to `Forbid` and a CronJob was attempted to be scheduled when there was a previous schedule still running, then it would count as missed.
-->

如果未能在调度时间内创建 CronJob，则计为错过。例如，如果 `concurrencyPolicy` 被设置为 `Forbid`，并且当前有一个调度仍在运行的情况下，试图调度的 CronJob 将被计算为错过。

<!--
For example, suppose a cron job is set to start at exactly `08:30:00` and its
`startingDeadlineSeconds` is set to 10, if the CronJob controller happens to
be down from `08:29:00` to `08:42:00`, the job will not start.
Set a longer `startingDeadlineSeconds` if starting later is better than not
starting at all.
-->

例如，假设一个 CronJob 被设置为`08:30:00` 准时开始，它的 `startingDeadlineSeconds` 属性被设置为10，如果在`08:29:00` 时将 CronJob 控制器的时间改为 `08:42:00`，Job 将不会启动。
如果觉得晚些开始比没有启动好，那请设置一个较长的 `startingDeadlineSeconds`。

<!--
The Cronjob is only responsible for creating Jobs that match its schedule, and
the Job in turn is responsible for the management of the Pods it represents.
-->

CronJob 只负责创建与其时间表相匹配的 Job，相应的 Job 又会负责管理它所代表的Pod。

创建该 Cron Job 之后，通过如下命令获取它的状态信息：

```shell
$ kubectl get cronjob hello
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
hello     */1 * * * *   False     0         <none>
```



如上所示，既没有 active 的 Job，也没有被调度的 Job。

等待并观察创建的 Job，大约一分钟时间：

```shell
$ kubectl get jobs --watch
NAME               DESIRED   SUCCESSFUL   AGE
hello-4111706356   1         1         2s
```



现在能看到一个名称为 hello 的 Job 在运行。我们可以停止观察，并再次获取该 Job 的状态信息：

```shell
$ kubectl get cronjob hello
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
hello     */1 * * * *   False     0         Mon, 29 Aug 2016 14:34:00 -0700
```


应该能够看到名称为 “hello” 的 Job 在 `LAST-SCHEDULE` 指定的时间点被调度了。当前存在 0 个活跃（Active）的 Job，说明该 Job 已经被调度运行完成或失败。

现在，找到最近一次被调度的 Job 创建的 Pod，能够看到其中一个 Pod 的标准输出。注意，Job 名称和 Pod 名称是不一样的。

```shell
# Replace "hello-4111706356" with the job name in your system
$ pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items..metadata.name})

$ echo $pods
hello-4111706356-o9qcm

$ kubectl logs $pods
Mon Aug 29 21:34:09 UTC 2016
Hello from the Kubernetes cluster
```


## 删除 Cron Job

一旦不再需要 Cron Job，简单地可以使用 `kubectl` 命令删除它：

```shell
$ kubectl delete cronjob hello
cronjob "hello" deleted
```



这将会终止正在创建的 Job。然而，运行中的 Job 将不会被终止，不会删除 Job 或 它们的 Pod。为了清理那些 Job 和 Pod，需要列出该 Cron Job 创建的全部 Job，然后删除它们：

```shell
$ kubectl get jobs
NAME               DESIRED   SUCCESSFUL   AGE
hello-1201907962   1         1            11m
hello-1202039034   1         1            8m
...

$ kubectl delete jobs hello-1201907962 hello-1202039034 ...
job "hello-1201907962" deleted
job "hello-1202039034" deleted
...
```



一旦 Job 被删除，由 Job 创建的 Pod 也会被删除。注意，所有由名称为 “hello” 的 Cron Job 创建的 Job 会以前缀字符串 “hello-” 进行命名。如果想要删除当前 Namespace 中的所有 Job，可以通过命令 `kubectl delete jobs --all` 立刻删除它们。



## Cron Job 限制

Cron Job 在每次调度运行时间内 _大概_ 会创建一个 Job 对象。我们之所以说 _大概_ ，是因为在特定的环境下可能会创建两个 Job，或者一个 Job 都没创建。我们尝试少发生这种情况，但却不能完全避免。因此，创建 Job 操作应该是 _幂等的_。

Job 根据它所创建的 Pod 的并行度，负责重试创建 Pod，并就决定这一组 Pod 的成功或失败。Cron Job 根本不会去检查 Pod。



## 编写 Cron Job 规约

和其它 Kubernetes 配置一样，Cron Job 需要 `apiVersion`、 `kind`、和 `metadata` 这三个字段。
关于如何实现一个配置文件的更新信息，参考文档 [部署应用](/docs/user-guide/deploying-applications)、
[配置容器](/docs/user-guide/configuring-containers) 和
[使用 kubectl 管理资源](/docs/user-guide/working-with-resources)。

Cron Job 也需要 [`.spec` 段](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

**注意：** 对一个 Cron Job 的所有修改，尤其是对其 `.spec` 的修改，仅会在下一次运行的时候生效。


### 调度

 `.spec.schedule` 是 `.spec` 中必需的字段，它的值是 [Cron](https://en.wikipedia.org/wiki/Cron) 格式字的符串，例如：`0 * * * *`，或者 `@hourly`，根据指定的调度时间 Job 会被创建和执行。



### Job 模板

`.spec.jobTemplate` 是另一个 `.spec` 中必需的字段。它是 Job 的模板。
除了它可以是嵌套的，并且不具有 `apiVersion` 或 `kind` 字段之外，它和 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) 一样具有完全相同的模式（schema）。
参考 [编写 Job 规格](/docs/concepts/jobs/run-to-completion-finite-workloads/#writing-a-job-spec)。



### 启动 Job 的期限（秒级别）

`.spec.startingDeadlineSeconds` 字段是可选的。它表示启动 Job 的期限（秒级别），如果因为任何原因而错过了被调度的时间，那么错过执行时间的 Job 将被认为是失败的。如果没有指定，则没有期限。



### 并发策略

`.spec.concurrencyPolicy` 字段也是可选的。它指定了如何处理被 Cron Job 创建的 Job 的并发执行。只允许指定下面策略中的一种：

* `Allow`（默认）：允许并发运行 Job
* `Forbid`：禁止并发运行，如果前一个还没有完成，则直接跳过下一个
* `Replace`：取消当前正在运行的 Job，用一个新的来替换

注意，当前策略只能应用于同一个 Cron Job 创建的 Job。如果存在多个 Cron Job，它们创建的 Job 之间总是允许并发运行。



### 挂起

`.spec.suspend` 字段也是可选的。如果设置为 `true`，后续所有执行都将被挂起。它对已经开始执行的 Job 不起作用。默认值为 `false`。



### Job 历史限制

`.spec.successfulJobsHistoryLimit` 和 `.spec.failedJobsHistoryLimit` 这两个字段是可选的。它们指定了可以保留完成和失败 Job 数量的限制。

默认没有限制，所有成功和失败的 Job 都会被保留。然而，当运行一个 Cron Job 时，很快就会堆积很多 Job，推荐设置这两个字段的值。设置限制值为 `0`，相关类型的 Job 完成后将不会被保留。
