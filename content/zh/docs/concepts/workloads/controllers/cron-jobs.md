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

{{% /capture %}}
