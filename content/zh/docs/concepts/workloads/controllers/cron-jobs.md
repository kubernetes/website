---
title: CronJob
content_type: concept
weight: 80
---

<!--
title: CronJob
content_type: concept
weight: 80
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.8" state="beta" >}}

<!--
A _Cron Job_ creates [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) on a time-based schedule.

One CronJob object is like one line of a _crontab_ (cron table) file. It runs a job periodically
on a given schedule, written in [Cron](https://en.wikipedia.org/wiki/Cron) format.
-->
_Cron Job_ 创建基于时间调度的 [Jobs](/zh/docs/concepts/workloads/controllers/job/)。

一个 CronJob 对象就像 _crontab_ (cron table) 文件中的一行。
它用 [Cron](https://en.wikipedia.org/wiki/Cron) 格式进行编写，
并周期性地在给定的调度时间执行 Job。

<!--
All **CronJob** `schedule:` times are based on the timezone of the

If your control plane runs the kube-controller-manager in Pods or bare
containers, the timezone set for the kube-controller-manager container determines the timezone
that the cron job controller uses.
-->

{{< caution >}}
所有 **CronJob** 的 `schedule:` 时间都是基于
{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}.
的时区。

如果你的控制平面在 Pod 或是裸容器中运行了 kube-controller-manager，
那么为该容器所设置的时区将会决定 Cron Job 的控制器所使用的时区。
{{< /caution >}}

<!--
When creating the manifest for a CronJob resource, make sure the name you provide
is a valid [DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
The name must be no longer than 52 characters. This is because the CronJob controller will automatically
append 11 characters to the job name provided and there is a constraint that the
maximum length of a Job name is no more than 63 characters.
-->
为 CronJob 资源创建清单时，请确保所提供的名称是一个合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
名称不能超过 52 个字符。
这是因为 CronJob 控制器将自动在提供的 Job 名称后附加 11 个字符，并且存在一个限制，
即 Job 名称的最大长度不能超过 63 个字符。

<!-- body -->

<!--
## CronJob

CronJobs are useful for creating periodic and recurring tasks, like running backups or
sending emails. CronJobs can also schedule individual tasks for a specific time, such as
scheduling a Job for when your cluster is likely to be idle.
-->
## CronJob

CronJobs 对于创建周期性的、反复重复的任务很有用，例如执行数据备份或者发送邮件。
CronJobs 也可以用来计划在指定时间来执行的独立任务，例如计划当集群看起来很空闲时
执行某个 Job。

<!--
### Example

This example CronJob manifest prints the current time and a hello message every minute:
-->
### 示例

下面的 CronJob 示例清单会在每分钟打印出当前时间和问候消息：

{{< codenew file="application/job/cronjob.yaml" >}}

[使用 CronJob 运行自动化任务](/zh/docs/tasks/job/automated-tasks-with-cron-jobs/)
一文会为你详细讲解此例。

<!--
### Cron schedule syntax
-->
### Cron 时间表语法

```
# ┌───────────── 分钟 (0 - 59)
# │ ┌───────────── 小时 (0 - 23)
# │ │ ┌───────────── 月的某天 (1 - 31)
# │ │ │ ┌───────────── 月份 (1 - 12)
# │ │ │ │ ┌───────────── 周的某天 (0 - 6) （周日到周一；在某些系统上，7 也是星期日）
# │ │ │ │ │                                   
# │ │ │ │ │
# │ │ │ │ │
# * * * * *
```


<!-- 
| Entry 										| Description																									| Equivalent to |
| ------------- 						| ------------- 																							|-------------  |
| @yearly (or @annually)		| Run once a year at midnight of 1 January										| 0 0 1 1 * 		|
| @monthly 									| Run once a month at midnight of the first day of the month	| 0 0 1 * * 		|
| @weekly 									| Run once a week at midnight on Sunday morning								| 0 0 * * 0 		|
| @daily (or @midnight)			| Run once a day at midnight																	| 0 0 * * * 		|
| @hourly 									| Run once an hour at the beginning of the hour								| 0 * * * * 		|
-->
| 输入                      | 描述                            | 相当于         |
| -------------             | -------------                  |-------------   |
| @yearly (or @annually)		| 每年 1 月 1 日的午夜运行一次     | 0 0 1 1 *      |
| @monthly 									| 每月第一天的午夜运行一次         | 0 0 1 * *      |
| @weekly 									| 每周的周日午夜运行一次           | 0 0 * * 0      |
| @daily (or @midnight)			| 每天午夜运行一次                 | 0 0 * * *      |
| @hourly 									| 每小时的开始一次                 | 0 * * * *      |


<!--  
For example, the line below states that the task must be started every Friday at midnight, as well as on the 13th of each month at midnight:
-->
例如，下面这行指出必须在每个星期五的午夜以及每个月 13 号的午夜开始任务：

`0 0 13 * 5`

<!--  
To generate CronJob schedule expressions, you can also use web tools like [crontab.guru](https://crontab.guru/).
-->
要生成 CronJob 时间表表达式，你还可以使用 [crontab.guru](https://crontab.guru/) 之类的 Web 工具。

<!--
## CronJob Limitations

A cron job creates a job object _about_ once per execution time of its schedule. We say "about" because there
are certain circumstances where two jobs might be created, or no job might be created. We attempt to make these rare,
but do not completely prevent them. Therefore, jobs should be _idempotent_.
-->
## CronJob 限制  {#cron-job-limitations}

CronJob 根据其计划编排，在每次该执行任务的时候大约会创建一个 Job。
我们之所以说 "大约"，是因为在某些情况下，可能会创建两个 Job，或者不会创建任何 Job。
我们试图使这些情况尽量少发生，但不能完全杜绝。因此，Job 应该是 _幂等的_。

<!--
If `startingDeadlineSeconds` is set to a large value or left unset (the default)
and if `concurrencyPolicy` is set to `Allow`, the jobs will always run
at least once.
-->
如果 `startingDeadlineSeconds` 设置为很大的数值或未设置（默认），并且
`concurrencyPolicy` 设置为 `Allow`，则作业将始终至少运行一次。

{{< caution >}}
<!--
If `startingDeadlineSeconds` is set to a value less than 10 seconds, the CronJob may not be scheduled. This is because the CronJob controller checks things every 10 seconds.
-->
如果 `startingDeadlineSeconds` 的设置值低于 10 秒钟，CronJob 可能无法被调度。
这是因为 CronJob 控制器每 10 秒钟执行一次检查。
{{< /caution >}}

<!--
For every CronJob, the CronJob {{< glossary_tooltip term_id="controller" >}} checks how many schedules it missed in the duration from its last scheduled time until now. If there are more than 100 missed schedules, then it does not start the job and logs the error
-->
对于每个 CronJob，CronJob {{< glossary_tooltip term_text="控制器" term_id="controller" >}}
检查从上一次调度的时间点到现在所错过了调度次数。如果错过的调度次数超过 100 次，
那么它就不会启动这个任务，并记录这个错误:

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
````

<!--
It is important to note that if the `startingDeadlineSeconds` field is set (not `nil`), the controller counts how many missed jobs occurred from the value of `startingDeadlineSeconds` until now rather than from the last scheduled time until now. For example, if `startingDeadlineSeconds` is `200`, the controller counts how many missed jobs occurred in the last 200 seconds.
-->
需要注意的是，如果 `startingDeadlineSeconds` 字段非空，则控制器会统计从
`startingDeadlineSeconds` 设置的值到现在而不是从上一个计划时间到现在错过了多少次 Job。
例如，如果 `startingDeadlineSeconds` 是 `200`，则控制器会统计在过去 200 秒中错过了多少次 Job。

<!--
A CronJob is counted as missed if it has failed to be created at its scheduled time. For example, If `concurrencyPolicy` is set to `Forbid` and a CronJob was attempted to be scheduled when there was a previous schedule still running, then it would count as missed.
-->
如果未能在调度时间内创建 CronJob，则计为错过。
例如，如果 `concurrencyPolicy` 被设置为 `Forbid`，并且当前有一个调度仍在运行的情况下，
试图调度的 CronJob 将被计算为错过。

<!--
For example, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` field is not set. If the CronJob controller happens to
be down from `08:29:00` to `10:21:00`, the job will not start as the number of missed jobs which missed their schedule is greater than 100.
-->
例如，假设一个 CronJob 被设置为从 `08:30:00` 开始每隔一分钟创建一个新的 Job，并且它的 `startingDeadlineSeconds` 字段
未被设置。如果 CronJob 控制器从 `08:29:00` 到 `10:21:00` 终止运行，则该 Job 将不会启动，因为其错过的调度次数超过了100。

<!--
To illustrate this concept further, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` is set to 200 seconds. If the CronJob controller happens to
be down for the same period as the previous example (`08:29:00` to `10:21:00`,) the Job will still start at 10:22:00. This happens as the controller now checks how many missed schedules happened in the last 200 seconds (ie, 3 missed schedules), rather than from the last scheduled time until now.
-->
为了进一步阐述这个概念，假设将 CronJob 设置为从 `08:30:00` 开始每隔一分钟创建一个新的 Job，
并将其 `startingDeadlineSeconds` 字段设置为 200 秒。 
如果 CronJob 控制器恰好在与上一个示例相同的时间段（`08:29:00` 到 `10:21:00`）终止运行，
则 Job 仍将从 `10:22:00` 开始。
造成这种情况的原因是控制器现在检查在最近 200 秒（即 3 个错过的调度）中发生了多少次错过的
Job 调度，而不是从现在为止的最后一个调度时间开始。

<!--
The CronJob is only responsible for creating Jobs that match its schedule, and
the Job in turn is responsible for the management of the Pods it represents.
-->
CronJob 仅负责创建与其调度时间相匹配的 Job，而 Job 又负责管理其代表的 Pod。

<!--
## New controller

There's an alternative implementation of the CronJob controller, available as an alpha feature since Kubernetes 1.20. To select version 2 of the CronJob controller, pass the following [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) flag to the {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}.

```
--feature-gates="CronJobControllerV2=true"
```
-->
## 新控制器

CronJob 控制器有一个替代的实现，自 Kubernetes 1.20 开始以 alpha 特性引入。
如果选择 CronJob 控制器的 v2 版本，请在 {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
中设置以下[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/) 标志。

```
--feature-gates="CronJobControllerV2=true"
```

## {{% heading "whatsnext" %}}
<!--
[Cron expression format](https://en.wikipedia.org/wiki/Cron)
documents the format of CronJob `schedule` fields.

For instructions on creating and working with cron jobs, and for an example of a spec file for a cron job, see [Running automated tasks with cron jobs](/docs/tasks/job/automated-tasks-with-cron-jobs).
-->

* 进一步了解 [Cron 表达式的格式](https://en.wikipedia.org/wiki/Cron)，学习设置 CronJob `schedule` 字段
* 有关创建和使用 CronJob 的说明及示例规约文件，请参见
  [使用 CronJob 运行自动化任务](/zh/docs/tasks/job/automated-tasks-with-cron-jobs/)。

