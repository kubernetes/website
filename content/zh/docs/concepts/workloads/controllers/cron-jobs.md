---
title: CronJob
content_type: concept
weight: 80
---

<!--
---
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
content_type: concept
weight: 80
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.8" state="beta" >}}

<!--
A _Cron Job_ creates [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) on a time-based schedule.

One CronJob object is like one line of a _crontab_ (cron table) file. It runs a job periodically
on a given schedule, written in [Cron](https://en.wikipedia.org/wiki/Cron) format.
-->

_Cron Job_ 创建基于时间调度的 [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)。

一个 CronJob 对象就像 _crontab_ (cron table) 文件中的一行。它用 [Cron](https://en.wikipedia.org/wiki/Cron) 格式进行编写，并周期性地在给定的调度时间执行 Job。

<!--
All **CronJob** `schedule:` times are based on the timezone of the

If your control plane runs the kube-controller-manager in Pods or bare
containers, the timezone set for the kube-controller-manager container determines the timezone
that the cron job controller uses.
-->

{{< caution >}}
所有 **CronJob** 的 `schedule:` 时间都是基于初始 Job 的主控节点的时区。

如果你的控制平面在 Pod 或是裸容器中运行了主控程序 (kube-controller-manager)，
那么为该容器设置的时区将会决定定时任务的控制器所使用的时区。
{{< /caution >}}

<!--
When creating the manifest for a CronJob resource, make sure the name you provide
is no longer than 52 characters. This is because the CronJob controller will automatically
append 11 characters to the job name provided and there is a constraint that the
maximum length of a Job name is no more than 63 characters.
-->
为 CronJob 资源创建清单时，请确保创建的名称不超过 52 个字符。这是因为 CronJob 控制器将自动在提供的作业名称后附加 11 个字符，并且存在一个限制，即作业名称的最大长度不能超过 63 个字符。


<!--
For instructions on creating and working with cron jobs, and for an example of a spec file for a cron job, see [Running automated tasks with cron jobs](/docs/tasks/job/automated-tasks-with-cron-jobs).
-->

有关创建和使用 CronJob 的说明及规范文件的示例，请参见[使用 CronJob 运行自动化任务](/zh/docs/tasks/job/automated-tasks-with-cron-jobs/)。





<!-- body -->

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
For every CronJob, the CronJob {{< glossary_tooltip term_id="controller" >}} checks how many schedules it missed in the duration from its last scheduled time until now. If there are more than 100 missed schedules, then it does not start the job and logs the error
-->

对于每个 CronJob，CronJob  {{< glossary_tooltip term_text="控制器" term_id="controller" >}} 检查从上一次调度的时间点到现在所错过了调度次数。如果错过的调度次数超过 100 次，那么它就不会启动这个任务，并记录这个错误:

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
````

<!--
It is important to note that if the `startingDeadlineSeconds` field is set (not `nil`), the controller counts how many missed jobs occurred from the value of `startingDeadlineSeconds` until now rather than from the last scheduled time until now. For example, if `startingDeadlineSeconds` is `200`, the controller counts how many missed jobs occurred in the last 200 seconds.
-->

需要注意的是，如果 `startingDeadlineSeconds` 字段非空，则控制器会统计从 `startingDeadlineSeconds` 设置的值到现在而不是从上一个计划时间到现在错过了多少次 Job。例如，如果 `startingDeadlineSeconds` 是 `200`，则控制器会统计在过去 200 秒中错过了多少次 Job。

<!--
A CronJob is counted as missed if it has failed to be created at its scheduled time. For example, If `concurrencyPolicy` is set to `Forbid` and a CronJob was attempted to be scheduled when there was a previous schedule still running, then it would count as missed.
-->

如果未能在调度时间内创建 CronJob，则计为错过。例如，如果 `concurrencyPolicy` 被设置为 `Forbid`，并且当前有一个调度仍在运行的情况下，试图调度的 CronJob 将被计算为错过。

<!--
For example, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` field is not set. If the CronJob controller happens to
be down from `08:29:00` to `10:21:00`, the job will not start as the number of missed jobs which missed their schedule is greater than 100.
-->

例如，假设一个 CronJob 被设置为 `08:30:00` 准时开始，它的 `startingDeadlineSeconds` 字段被设置为 10，如果在 `08:29:00` 时将 CronJob 控制器的时间改为 `08:42:00`，Job 将不会启动。
如果觉得晚些开始比没有启动好，那请设置一个较长的 `startingDeadlineSeconds`。

<!--
To illustrate this concept further, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` is set to 200 seconds. If the CronJob controller happens to
be down for the same period as the previous example (`08:29:00` to `10:21:00`,) the Job will still start at 10:22:00. This happens as the controller now checks how many missed schedules happened in the last 200 seconds (ie, 3 missed schedules), rather than from the last scheduled time until now.
-->
为了进一步阐述这个概念，假设将 CronJob 设置为从 `08:30:00` 开始每隔一分钟创建一个新的 Job，并将其 `startingDeadlineSeconds` 字段设置为 200 秒。 如果 CronJob 控制器恰好在与上一个示例相同的时间段（`08:29:00` 到 `10:21:00`）停机，则 Job 仍将从 `10:22:00` 开始。造成这种情况的原因是控制器现在检查在最近 200 秒（即 3 个错过的调度）中发生了多少次错过的 Job 调度，而不是从现在为止的最后一个调度时间开始。

<!--
The CronJob is only responsible for creating Jobs that match its schedule, and
the Job in turn is responsible for the management of the Pods it represents.
-->
CronJob 仅负责创建与其调度时间相匹配的 Job，而 Job 又负责管理其代表的 Pod。


 
