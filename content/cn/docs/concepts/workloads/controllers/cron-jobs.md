---
approvers:
- erictune
- soltysh
- janetkuo
title: Cron Job
redirect_from:
- "/docs/concepts/jobs/cron-jobs/"
- "/docs/concepts/jobs/cron-jobs.html"
- "/docs/user-guide/cron-jobs/"
- "/docs/user-guide/cron-jobs.html"
---

{{< toc >}}



## Cron Job 是什么？

_Cron Job_ 管理基于时间的 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/)，即：

* 在给定时间点只运行一次
* 在给定时间点周期性地运行

一个 Cron Job 对象类似于 _crontab_ （cron table）文件中的一行。它根据指定的预定计划周期性地运行一个 Job，格式可以参考 [Cron](https://en.wikipedia.org/wiki/Cron) 。


有关创建和使用Cron Job的说明，以及Cron Job的规约文件示例，请参阅使[用Cron Job运行自动化任务](/cn/docs/tasks/job/automated-tasks-with-cron-jobs/)。


## Cron Job 限制

一个cron作业大约按每个执行时间创建一个作业对象。我们说“大约”，是因为在某些情况下可能会创建两个Job，或者一个也不创建。我们试图让这些很少，但不能完全阻止这种情况。因此，Job应该是幂等的。

如果startsDeadlineSeconds设置为较大值或未设置（默认值），并且concurrencyPolicy设置为Allow，则作业将始终运行至少一次。

如果Cron Job控制器未从Cron Job的开始时间到startDeadlineSeconds之前的一段时间内运行或中断，或者跨度覆盖了多个开始时间并且并发策略不允许并发，则作业可能无法运行。例如，假设一个cron作业设置为刚好在08:30:00开始，并且它的startingDeadlineSeconds设置为10，如果CronJob控制器碰巧从08:29:00到08:42:00关闭，那么作业将会不开始。如果稍后开始比不开始好的话，则设置较长的startingDeadlineSeconds。

Cron Job只负责创建与其时间表匹配的作业，然后作业负责管理其代表的Pod。


