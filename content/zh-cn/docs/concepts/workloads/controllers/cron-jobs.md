---
title: CronJob
content_type: concept
weight: 80
---
<!--
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
content_type: concept
weight: 80
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
A _CronJob_ creates {{< glossary_tooltip term_id="job" text="Jobs" >}} on a repeating schedule.

CronJob is meant for performing regular scheduled actions such as backups, report generation,
and so on. One CronJob object is like one line of a _crontab_ (cron table) file on a
Unix system. It runs a job periodically on a given schedule, written in
[Cron](https://en.wikipedia.org/wiki/Cron) format.
-->
**CronJob** 创建基于时隔重复调度的 {{< glossary_tooltip term_id="job" text="Job" >}}。

CronJob 用于执行排期操作，例如备份、生成报告等。
一个 CronJob 对象就像 Unix 系统上的 **crontab**（cron table）文件中的一行。
它用 [Cron](https://zh.wikipedia.org/wiki/Cron) 格式进行编写，
并周期性地在给定的调度时间执行 Job。

<!--
CronJobs have limitations and idiosyncrasies.
For example, in certain circumstances, a single CronJob can create multiple concurrent Jobs. See the [limitations](#cron-job-limitations) below.
-->
CronJob 有所限制，也比较特殊。
例如在某些情况下，单个 CronJob 可以创建多个并发任务。
请参阅下面的[限制](#cron-job-limitations)。

<!--
When the control plane creates new Jobs and (indirectly) Pods for a CronJob, the `.metadata.name`
of the CronJob is part of the basis for naming those Pods.  The name of a CronJob must be a valid
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
value, but this can produce unexpected results for the Pod hostnames.  For best compatibility,
the name should follow the more restrictive rules for a
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).
Even when the name is a DNS subdomain, the name must be no longer than 52
characters.  This is because the CronJob controller will automatically append
11 characters to the name you provide and there is a constraint that the
length of a Job name is no more than 63 characters.
-->
当控制平面为 CronJob 创建新的 Job 和（间接）Pod 时，CronJob 的 `.metadata.name` 是命名这些 Pod 的部分基础。
CronJob 的名称必须是一个合法的
[DNS 子域](/zh-cn/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)值，
但这会对 Pod 的主机名产生意外的结果。为获得最佳兼容性，名称应遵循更严格的
[DNS 标签](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)规则。
即使名称是一个 DNS 子域，它也不能超过 52 个字符。这是因为 CronJob 控制器将自动在你所提供的 Job 名称后附加
11 个字符，并且存在 Job 名称的最大长度不能超过 63 个字符的限制。

<!-- body -->

<!--
## Example

This example CronJob manifest prints the current time and a hello message every minute:
-->
## 示例    {#example}

下面的 CronJob 示例清单会在每分钟打印出当前时间和问候消息：

{{< codenew file="application/job/cronjob.yaml" >}}

<!--
([Running Automated Tasks with a CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)
takes you through this example in more detail).
-->
[使用 CronJob 运行自动化任务](/zh-cn/docs/tasks/job/automated-tasks-with-cron-jobs/)一文会为你详细讲解此例。

<!--
## Writing a CronJob spec
### Schedule syntax
The `.spec.schedule` field is required. The value of that field follows the [Cron](https://en.wikipedia.org/wiki/Cron) syntax:
-->
## 编写 CronJob 声明信息 {#writing-a-cronjob-spec}

### Cron 时间表语法    {#cron-schedule-syntax}

`.spec.schedule` 字段是必需的。该字段的值遵循 [Cron](https://zh.wikipedia.org/wiki/Cron) 语法：

<!--
```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │                                   7 is also Sunday on some systems)
# │ │ │ │ │                                   OR sun, mon, tue, wed, thu, fri, sat
# │ │ │ │ │
# * * * * *
```
-->
```
# ┌───────────── 分钟 (0 - 59)
# │ ┌───────────── 小时 (0 - 23)
# │ │ ┌───────────── 月的某天 (1 - 31)
# │ │ │ ┌───────────── 月份 (1 - 12)
# │ │ │ │ ┌───────────── 周的某天 (0 - 6)（周日到周一；在某些系统上，7 也是星期日）
# │ │ │ │ │                          或者是 sun，mon，tue，web，thu，fri，sat
# │ │ │ │ │
# │ │ │ │ │
# * * * * *
```

<!--
For example, `0 0 13 * 5` states that the task must be started every Friday at midnight, as well as on the 13th of each month at midnight.
-->
例如 `0 0 13 * 5` 表示此任务必须在每个星期五的午夜以及每个月的 13 日的午夜开始。

<!--
The format also includes extended "Vixie cron" step values. As explained in the
[FreeBSD manual](https://www.freebsd.org/cgi/man.cgi?crontab%285%29):
-->
该格式也包含了扩展的 “Vixie cron” 步长值。
[FreeBSD 手册](https://www.freebsd.org/cgi/man.cgi?crontab%285%29)中解释如下:

<!--
> Step values can be used in conjunction with ranges. Following a range
> with `/<number>` specifies skips of the number's value through the
> range. For example, `0-23/2` can be used in the hours field to specify
> command execution every other hour (the alternative in the V7 standard is
> `0,2,4,6,8,10,12,14,16,18,20,22`). Steps are also permitted after an
> asterisk, so if you want to say "every two hours", just use `*/2`.
-->
> 步长可被用于范围组合。范围后面带有 `/<数字>` 可以声明范围内的步幅数值。
> 例如，`0-23/2` 可被用在小时字段来声明命令在其他数值的小时数执行
> （V7 标准中对应的方法是 `0,2,4,6,8,10,12,14,16,18,20,22`）。
> 步长也可以放在通配符后面，因此如果你想表达 “每两小时”，就用 `*/2` 。

{{< note >}}
<!--
A question mark (`?`) in the schedule has the same meaning as an asterisk `*`, that is,
it stands for any of available value for a given field.
-->
时间表中的问号 (`?`) 和星号 `*` 含义相同，它们用来表示给定字段的任何可用值。
{{< /note >}}

<!--
Other than the standard syntax, some macros like `@monthly` can also be used:
-->
除了标准语法，还可以使用一些类似 `@monthly` 的宏：

<!-- 
| Entry 										| Description																									| Equivalent to |
| ------------- 						| ------------- 																							|-------------  |
| @yearly (or @annually)		| Run once a year at midnight of 1 January										| 0 0 1 1 * 		|
| @monthly 									| Run once a month at midnight of the first day of the month	| 0 0 1 * * 		|
| @weekly 									| Run once a week at midnight on Sunday morning								| 0 0 * * 0 		|
| @daily (or @midnight)			| Run once a day at midnight																	| 0 0 * * * 		|
| @hourly 									| Run once an hour at the beginning of the hour								| 0 * * * * 		|
-->
| 输入                   | 描述                      | 相当于        |
| ---------------------- | ------------------------ | ------------ |
| @yearly (或 @annually) | 每年 1 月 1 日的午夜运行一次 | 0 0 1 1 *    |
| @monthly               | 每月第一天的午夜运行一次     | 0 0 1 * *    |
| @weekly                | 每周的周日午夜运行一次       | 0 0 * * 0    |
| @daily (或 @midnight)  | 每天午夜运行一次            | 0 0 * * *    |
| @hourly                | 每小时的开始一次            | 0 * * * *    |

<!--
To generate CronJob schedule expressions, you can also use web tools like [crontab.guru](https://crontab.guru/).
-->
为了生成 CronJob 时间表的表达式，你还可以使用 [crontab.guru](https://crontab.guru/) 这类 Web 工具。

<!--
### Job template

The `.spec.jobTemplate` defines a template for the Jobs that the CronJob creates, and it is required.
It has exactly the same schema as a [Job](/docs/concepts/workloads/controllers/job/), except that
it is nested and does not have an `apiVersion` or `kind`.
You can specify common metadata for the templated Jobs, such as
{{< glossary_tooltip text="labels" term_id="label" >}} or
{{< glossary_tooltip text="annotations" term_id="annotation" >}}.
For information about writing a Job `.spec`, see [Writing a Job Spec](/docs/concepts/workloads/controllers/job/#writing-a-job-spec).
-->
### 任务模板 {#job-template}

`.spec.jobTemplate`为 CronJob 创建的 Job 定义模板，它是必需的。它和
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的语法完全一样，
只不过它是嵌套的，没有 `apiVersion` 和 `kind`。
你可以为模板化的 Job 指定通用的元数据，
例如{{< glossary_tooltip text="标签" term_id="label" >}}或{{< glossary_tooltip text="注解" term_id="annotation" >}}。
有关如何编写一个任务的 `.spec`，
请参考[编写 Job 规约](/zh-cn/docs/concepts/workloads/controllers/job/#writing-a-job-spec)。

<!--
### Deadline for delayed job start {#starting-deadline}

The `.spec.startingDeadlineSeconds` field is optional.
This field defines a deadline (in whole seconds) for starting the Job, if that Job misses its scheduled time
for any reason.

After missing the deadline, the CronJob skips that instance of the Job (future occurrences are still scheduled).
For example, if you have a backup job that runs twice a day, you might allow it to start up to 8 hours late,
but no later, because a backup taken any later wouldn't be useful: you would instead prefer to wait for
the next scheduled run.
-->
### 任务延迟开始的最后期限 {#starting-deadline}

`.spec.startingDeadlineSeconds` 字段是可选的。
它表示任务如果由于某种原因错过了调度时间，开始该任务的截止时间的秒数。

过了截止时间，CronJob 就不会开始该任务的实例（未来的任务仍在调度之中）。
例如，如果你有一个每天运行两次的备份任务，你可能会允许它最多延迟 8 小时开始，但不能更晚，
因为更晚进行的备份将变得没有意义：你宁愿等待下一次计划的运行。

<!--
For Jobs that miss their configured deadline, Kubernetes treats them as failed Jobs.
If you don't specify `startingDeadlineSeconds` for a CronJob, the Job occurrences have no deadline.

If the `.spec.startingDeadlineSeconds` field is set (not null), the CronJob
controller measures the time between when a job is expected to be created and
now. If the difference is higher than that limit, it will skip this execution.

For example, if it is set to `200`, it allows a job to be created for up to 200
seconds after the actual schedule.
-->
对于错过已配置的最后期限的 Job，Kubernetes 将其视为失败的任务。
如果你没有为 CronJob 指定 `startingDeadlineSeconds`，那 Job 就没有最后期限。

如果 `.spec.startingDeadlineSeconds` 字段被设置（非空），
CronJob 控制器将会计算从预期创建 Job 到当前时间的时间差。
如果时间差大于该限制，则跳过此次执行。

例如，如果将其设置为 `200`，则 Job 控制器允许在实际调度之后最多 200 秒内创建 Job。

<!--
### Concurrency policy

The `.spec.concurrencyPolicy` field is also optional.
It specifies how to treat concurrent executions of a job that is created by this CronJob.
The spec may specify only one of the following concurrency policies:

* `Allow` (default): The CronJob allows concurrently running jobs
* `Forbid`: The CronJob does not allow concurrent runs; if it is time for a new job run and the
  previous job run hasn't finished yet, the CronJob skips the new job run
* `Replace`: If it is time for a new job run and the previous job run hasn't finished yet, the
  CronJob replaces the currently running job run with a new job run

Note that concurrency policy only applies to the jobs created by the same cron job.
If there are multiple CronJobs, their respective jobs are always allowed to run concurrently.
-->
### 并发性规则 {#concurrency-policy}

`.spec.concurrencyPolicy` 也是可选的。它声明了 CronJob 创建的任务执行时发生重叠如何处理。
spec 仅能声明下列规则中的一种：

* `Allow`（默认）：CronJob 允许并发任务执行。
* `Forbid`： CronJob 不允许并发任务执行；如果新任务的执行时间到了而老任务没有执行完，CronJob 会忽略新任务的执行。
* `Replace`：如果新任务的执行时间到了而老任务没有执行完，CronJob 会用新任务替换当前正在运行的任务。

请注意，并发性规则仅适用于相同 CronJob 创建的任务。如果有多个 CronJob，它们相应的任务总是允许并发执行的。

<!--
### Schedule suspension

You can suspend execution of Jobs for a CronJob, by setting the optional `.spec.suspend` field
to true. The field defaults to false.

This setting does _not_ affect Jobs that the CronJob has already started.
-->
### 调度挂起 {#schedule-suspension}

通过将可选的 `.spec.suspend` 字段设置为 `true`，可以挂起针对 CronJob 执行的任务。

这个设置**不**会影响 CronJob 已经开始的任务。

<!--
If you do set that field to true, all subsequent executions are suspended (they remain
scheduled, but the CronJob controller does not start the Jobs to run the tasks) until
you unsuspend the CronJob.
-->
如果你将此字段设置为 `true`，后续发生的执行都会被挂起
（这些任务仍然在调度中，但 CronJob 控制器不会启动这些 Job 来运行任务），直到你取消挂起 CronJob 为止。

{{< caution >}}
<!--
Executions that are suspended during their scheduled time count as missed jobs.
When `.spec.suspend` changes from `true` to `false` on an existing CronJob without a
[starting deadline](#starting-deadline), the missed jobs are scheduled immediately.
-->
在调度时间内挂起的执行都会被统计为错过的任务。当现有的 CronJob 将 `.spec.suspend` 从 `true` 改为 `false` 时，
且没有[开始的最后期限](#starting-deadline)，错过的任务会被立即调度。
{{< /caution >}}

<!--
### Jobs history limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields are optional.
These fields specify how many completed and failed jobs should be kept.
By default, they are set to 3 and 1 respectively.  Setting a limit to `0` corresponds to keeping
none of the corresponding kind of jobs after they finish.

For another way to clean up jobs automatically, see [Clean up finished jobs automatically](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).
-->
### 任务历史限制 {#jobs-history-limits}

`.spec.successfulJobsHistoryLimit` 和 `.spec.failedJobsHistoryLimit` 字段是可选的。
这两个字段指定应保留多少已完成和失败的任务。
默认设置分别为 3 和 1。将限制设置为 `0` 代表相应类型的任务完成后不会保留。

有关自动清理任务的其他方式，
请参见[自动清理完成的 Job](/zh-cn/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)。

<!-- 
### Time zones
-->
## 时区    {#time-zones}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

<!--
For CronJobs with no time zone specified, the {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
interprets schedules relative to its local time zone.
-->
对于没有指定时区的 CronJob，
{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
基于本地时区解释排期表（Schedule）。

<!--
You can specify a time zone for a CronJob by setting `.spec.timeZone` to the name
of a valid [time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
For example, setting `.spec.timeZone: "Etc/UTC"` instructs Kubernetes to interpret
the schedule relative to Coordinated Universal Time.
-->
你可以通过将 `.spec.timeZone`
设置为一个有效[时区](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)的名称，
为 CronJob 指定一个时区。例如设置 `.spec.timeZone: "Etc/UTC"` 将告诉
Kubernetes 基于世界标准时间解读排期表。

<!--
A time zone database from the Go standard library is included in the binaries and used as a fallback in case an external database is not available on the system.
-->
Go 标准库中的时区数据库包含在二进制文件中，并用作备用数据库，以防系统上没有可用的外部数据库。

<!--
## CronJob limitations {#cron-job-limitations}

### Unsupported TimeZone specification
-->
## CronJob 的限制    {#cronjob-limitations}

### 不支持的时区规范   {#unsupported-timezone-spec}

<!--
The implementation of the CronJob API in Kubernetes {{< skew currentVersion >}} lets you set
the `.spec.schedule` field to include a timezone; for example: `CRON_TZ=UTC * * * * *`
or `TZ=UTC * * * * *`.
-->
Kubernetes {{< skew currentVersion >}} 中的 CronJob API 实现允许你设置
`.spec.schedule` 字段，在其中包括时区信息；
例如 `CRON_TZ=UTC * * * * *` 或 `TZ=UTC * * * * *`。

<!--
Specifying a timezone that way is **not officially supported** (and never has been).

If you try to set a schedule that includes `TZ` or `CRON_TZ` timezone specification,
Kubernetes reports a [warning](/blog/2020/09/03/warnings/) to the client.
Future versions of Kubernetes will prevent setting the unofficial timezone mechanism entirely.
-->
以这种方式指定时区是 **未正式支持的**（而且也从未正式支持过）。

如果你尝试设置包含 `TZ` 或 `CRON_TZ` 时区规范的排期表，
Kubernetes 会向客户端报告一条[警告](/blog/2020/09/03/warnings/)。
后续的 Kubernetes 版本将完全阻止设置非正式的时区机制。

<!--
### Modifying a CronJob

By design, a CronJob contains a template for _new_ Jobs.
If you modify an existing CronJob, the changes you make will apply to new Jobs that
start to run after your modification is complete. Jobs (and their Pods) that have already
started continue to run without changes.
That is, the CronJob does _not_ update existing Jobs, even if those remain running.
-->
### 修改 CronJob   {#modifying-a-cronjob}

按照设计，CronJob 包含一个用于**新** Job 的模板。
如果你修改现有的 CronJob，你所做的更改将应用于修改完成后开始运行的新任务。
已经开始的任务（及其 Pod）将继续运行而不会发生任何变化。
也就是说，CronJob **不** 会更新现有任务，即使这些任务仍在运行。

<!--
### Job creation

A CronJob creates a Job object approximately once per execution time of its schedule.
The scheduling is approximate because there
are certain circumstances where two Jobs might be created, or no Job might be created.
Kubernetes tries to avoid those situations, but does not completely prevent them. Therefore,
the Jobs that you define should be _idempotent_.
-->
### Job 创建  {#job-creation}

CronJob 根据其计划编排，在每次该执行任务的时候大约会创建一个 Job。
我们之所以说 "大约"，是因为在某些情况下，可能会创建两个 Job，或者不会创建任何 Job。
我们试图使这些情况尽量少发生，但不能完全杜绝。因此，Job 应该是 **幂等的**。

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
For every CronJob, the CronJob {{< glossary_tooltip term_id="controller" >}} checks how many schedules it missed in the duration from its last scheduled time until now. If there are more than 100 missed schedules, then it does not start the job and logs the error.
-->
对于每个 CronJob，CronJob {{< glossary_tooltip term_text="控制器" term_id="controller" >}}
检查从上一次调度的时间点到现在所错过了调度次数。如果错过的调度次数超过 100 次，
那么它就不会启动这个任务，并记录这个错误:

```
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
```

<!--
It is important to note that if the `startingDeadlineSeconds` field is set (not `nil`), the controller counts how many missed jobs occurred from the value of `startingDeadlineSeconds` until now rather than from the last scheduled time until now. For example, if `startingDeadlineSeconds` is `200`, the controller counts how many missed jobs occurred in the last 200 seconds.
-->
需要注意的是，如果 `startingDeadlineSeconds` 字段非空，则控制器会统计从
`startingDeadlineSeconds` 设置的值到现在而不是从上一个计划时间到现在错过了多少次 Job。
例如，如果 `startingDeadlineSeconds` 是 `200`，则控制器会统计在过去 200 秒中错过了多少次 Job。

<!--
A CronJob is counted as missed if it has failed to be created at its scheduled time. For example, if `concurrencyPolicy` is set to `Forbid` and a CronJob was attempted to be scheduled when there was a previous schedule still running, then it would count as missed.
-->
如果未能在调度时间内创建 CronJob，则计为错过。
例如，如果 `concurrencyPolicy` 被设置为 `Forbid`，并且当前有一个调度仍在运行的情况下，
试图调度的 CronJob 将被计算为错过。

<!--
For example, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` field is not set. If the CronJob controller happens to
be down from `08:29:00` to `10:21:00`, the job will not start as the number of missed jobs which missed their schedule is greater than 100.
-->
例如，假设一个 CronJob 被设置为从 `08:30:00` 开始每隔一分钟创建一个新的 Job，
并且它的 `startingDeadlineSeconds` 字段未被设置。如果 CronJob 控制器从
`08:29:00` 到 `10:21:00` 终止运行，则该 Job 将不会启动，
因为其错过的调度次数超过了 100。

<!--
To illustrate this concept further, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` is set to 200 seconds. If the CronJob controller happens to
be down for the same period as the previous example (`08:29:00` to `10:21:00`,) the Job will still start at 10:22:00. This happens as the controller now checks how many missed schedules happened in the last 200 seconds (i.e., 3 missed schedules), rather than from the last scheduled time until now.
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

## {{% heading "whatsnext" %}}

<!--
* Learn about [Pods](/docs/concepts/workloads/pods/) and
  [Jobs](/docs/concepts/workloads/controllers/job/), two concepts
  that CronJobs rely upon.
* Read about the detailed [format](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON_Expression_Format)
  of CronJob `.spec.schedule` fields.
* For instructions on creating and working with CronJobs, and for an example
  of a CronJob manifest,
  see [Running automated tasks with CronJobs](/docs/tasks/job/automated-tasks-with-cron-jobs/).
* `CronJob` is part of the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/cron-job-v1" >}}
  API reference for more details.
-->
* 了解 CronJob 所依赖的 [Pod](/zh-cn/docs/concepts/workloads/pods/) 与
  [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的概念。
* 阅读 CronJob `.spec.schedule` 字段的详细[格式](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON_Expression_Format)。
* 有关创建和使用 CronJob 的说明及 CronJob 清单的示例，
  请参见[使用 CronJob 运行自动化任务](/zh-cn/docs/tasks/job/automated-tasks-with-cron-jobs/)。
* `CronJob` 是 Kubernetes REST API 的一部分，
  阅读 {{< api-reference page="workload-resources/cron-job-v1" >}} API 参考了解更多细节。
