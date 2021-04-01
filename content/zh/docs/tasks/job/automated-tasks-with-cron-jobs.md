---
title: 使用 CronJob 运行自动化任务
content_type: task
weight: 10
min-kubernetes-server-version: v1.8
---

<!--
title: Running Automated Tasks with a CronJob
reviewers:
- chenopis
content_type: task
weight: 10
min-kubernetes-server-version: v1.8
-->

<!-- overview -->

<!--
You can use [CronJobs](/docs/concepts/workloads/controllers/cron-jobs) to run jobs on a time-based schedule.
These automated jobs run like [Cron](https://en.wikipedia.org/wiki/Cron) tasks on a Linux or UNIX system.

Cron jobs are useful for creating periodic and recurring tasks, like running backups or sending emails.
Cron jobs can also schedule individual tasks for a specific time, such as if you want to schedule a job for a low activity period.
-->

你可以利用 [CronJobs](/zh/docs/concepts/workloads/controllers/cron-jobs) 执行基于时间调度的任务。这些自动化任务和 Linux 或者 Unix 系统的 [Cron](https://en.wikipedia.org/wiki/Cron) 任务类似。

CronJobs 在创建周期性以及重复性的任务时很有帮助，例如执行备份操作或者发送邮件。CronJobs 也可以在特定时间调度单个任务，例如你想调度低活跃周期的任务。

<!--
Cron jobs have limitations and idiosyncrasies.
For example, in certain circumstances, a single cron job can create multiple jobs.
Therefore, jobs should be idempotent.
For more limitations, see [CronJobs](/docs/concepts/workloads/controllers/cron-jobs).
-->
CronJobs 有一些限制和特点。
例如，在特定状况下，同一个 CronJob 可以创建多个任务。
因此，任务应该是幂等的。
查看更多限制，请参考 [CronJobs](/zh/docs/concepts/workloads/controllers/cron-jobs)。

## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Creating a Cron Job

Cron jobs require a config file.
This example cron job config `.spec` file prints the current time and a hello message every minute:
-->
## 创建 CronJob

CronJob 需要一个配置文件。
本例中 CronJob 的`.spec` 配置文件每分钟打印出当前时间和一个问好信息：

{{< codenew file="application/job/cronjob.yaml" >}}

<!--
Run the example cron job by downloading the example file and then running this command:
-->
想要运行示例的 CronJob，可以下载示例文件并执行命令：

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```
```
cronjob.batch/hello created
```

<!--
After creating the cron job, get its status using this command:
-->
创建好 CronJob 后，使用下面的命令来获取其状态：

```shell
kubectl get cronjob hello
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```
<!--
As you can see from the results of the command, the cron job has not scheduled or run any jobs yet.
Watch for the job to be created in around one minute:
-->
就像你从命令返回结果看到的那样，CronJob 还没有调度或执行任何任务。大约需要一分钟任务才能创建好。

```shell
kubectl get jobs --watch
```

```
NAME               COMPLETIONS   DURATION   AGE
hello-4111706356   0/1                      0s
hello-4111706356   0/1           0s         0s
hello-4111706356   1/1           5s         5s
```

<!--
Now you've seen one running job scheduled by the "hello" cron job.
You can stop watching the job and view the cron job again to see that it scheduled the job:
-->
现在你已经看到了一个运行中的任务被 “hello” CronJob 调度。
你可以停止监视这个任务，然后再次查看 CronJob 就能看到它调度任务：

```shell
kubectl get cronjob hello
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

<!--
You should see that the cron job "hello" successfully scheduled a job at the time specified in `LAST-SCHEDULE`.
There are currently 0 active jobs, meaning that the job has completed or failed.

Now, find the pods that the last scheduled job created and view the standard output of one of the pods.
Note that the job name and pod name are different.
-->
你应该能看到 “hello” CronJob 在 `LAST-SCHEDULE` 声明的时间点成功的调度了一次任务。
有 0 个活跃的任务意味着任务执行完毕或者执行失败。

现在，找到最后一次调度任务创建的 Pod 并查看一个 Pod 的标准输出。请注意任务名称和 Pod 名称是不同的。

<!--
The job name and pod name are different.
-->
{{< note >}}
Job 名称和 Pod 名称不同。
{{< /note >}}

```shell
# 在你的系统上将 "hello-4111706356" 替换为 Job 名称
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items..metadata.name})
```

<!--
Show pod log:
-->
查看 Pod 日志：

```shell
kubectl logs $pods
```

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

<!--
## Deleting a Cron Job

When you don't need a cron job any more, delete it with `kubectl delete cronjob <cronjob name>`：
-->

## 删除 CronJob

当你不再需要 CronJob 时，可以用 `kubectl delete cronjob <cronjob name>` 删掉它：

```shell
kubectl delete cronjob hello
```

<!--
Deleting the cron job removes all the jobs and pods it created and stops it from creating additional jobs.
You can read more about removing jobs in [garbage collection](/docs/concepts/workloads/controllers/garbage-collection/).
-->
删除 CronJob 会清除它创建的所有任务和 Pod，并阻止它创建额外的任务。你可以查阅
[垃圾收集](/zh/docs/concepts/workloads/controllers/garbage-collection/)。

<!--
## Writing a Cron Job Spec

As with all other Kubernetes configs, a cron job needs `apiVersion`, `kind`, and `metadata` fields. For general
information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/),
and [using kubectl to manage resources](/docs/concepts/overview/working-with-objects/object-management/) documents.

A cron job config also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->
## 编写 CronJob 声明信息

像 Kubernetes 的其他配置一样，CronJob 需要 `apiVersion`、`kind`、和 `metadata` 域。
配置文件的一般信息，请参考
[部署应用](/zh/docs/tasks/run-application/run-stateless-application-deployment/) 和
[使用 kubectl 管理资源](/zh/docs/concepts/overview/working-with-objects/object-management/).

CronJob 配置也需要包括
[`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

<!--
All modifications to a cron job, especially its `.spec`, are applied only to the following runs.
-->
{{< note >}}
对 CronJob 的所有改动，特别是它的 `.spec`，只会影响将来的运行实例。
{{< /note >}}

<!--
### Schedule

The `.spec.schedule` is a required field of the `.spec`.
It takes a [Cron](https://en.wikipedia.org/wiki/Cron) format string, such as `0 * * * *` or `@hourly`, as schedule time of its jobs to be created and executed.
-->
### 时间安排

`.spec.schedule` 是 `.spec` 需要的域。它使用了 [Cron](https://en.wikipedia.org/wiki/Cron)
格式串，例如 `0 * * * *` or `@hourly` ，做为它的任务被创建和执行的调度时间。

<!--
The format also includes extended `vixie cron` step values. As explained in the [FreeBSD manual](https://www.freebsd.org/cgi/man.cgi?crontab%285%29):
-->
该格式也包含了扩展的 `vixie cron` 步长值。
[FreeBSD 手册](https://www.freebsd.org/cgi/man.cgi?crontab%285%29)中解释如下:

<!--
> Step values can be	used in	conjunction with ranges.  Following a range
> with `/<number>` specifies skips	of the number's	value through the
> range.  For example, `0-23/2` can be used in the	hours field to specify
> command execution every other hour	(the alternative in the	V7 standard is
> `0,2,4,6,8,10,12,14,16,18,20,22`).  Steps are also permitted after an
> asterisk, so if you want to say "every two hours", just use `*/2`.
-->

> 步长可被用于范围组合。范围后面带有 `/<数字>` 可以声明范围内的步幅数值。
> 例如，`0-23/2` 可被用在小时域来声明命令在其他数值的小时数执行
> （ V7 标准中对应的方法是`0,2,4,6,8,10,12,14,16,18,20,22`）。
> 步长也可以放在通配符后面，因此如果你想表达 "每两小时"，就用 `*/2` 。

<!--
A question mark (`?`) in the schedule has the same meaning as an asterisk `*`, that is, it stands for any of available value for a given field.
-->
{{< note >}}
调度中的问号 (`?`) 和星号  `*` 含义相同，表示给定域的任何可用值。
{{< /note >}}

<!--
### Job Template

The `.spec.jobTemplate` is the template for the job, and it is required.
It has exactly the same schema as a [Job](/docs/concepts/workloads/controllers/job/), 
except that it is nested and does not have an `apiVersion` or `kind`.
For information about writing a job `.spec`, see
[Writing a Job Spec](/docs/concepts/workloads/controllers/job/#writing-a-job-spec).
-->
### 任务模版

`.spec.jobTemplate`是任务的模版，它是必须的。它和
[Job](/zh/docs/concepts/workloads/controllers/job/)的语法完全一样，
除了它是嵌套的没有 `apiVersion` 和 `kind`。
编写任务的 `.spec` ，请参考
[编写 Job 的Spec](/zh/docs/concepts/workloads/controllers/job/#writing-a-job-spec)。

<!--
### Starting Deadline

The `.spec.startingDeadlineSeconds` field is optional.
It stands for the deadline in seconds for starting the job if it misses its scheduled time for any reason.
After the deadline, the cron job does not start the job.
Jobs that do not meet their deadline in this way count as failed jobs.
If this field is not specified, the jobs have no deadline.
-->
### 开始的最后期限   {#starting-deadline}

`.spec.startingDeadlineSeconds` 域是可选的。
它表示任务如果由于某种原因错过了调度时间，开始该任务的截止时间的秒数。过了截止时间，CronJob 就不会开始任务。
不满足这种最后期限的任务会被统计为失败任务。如果该域没有声明，那任务就没有最后期限。

<!--
The CronJob controller counts how many missed schedules happen for a cron job. If there are more than 100 missed
schedules, the cron job is no longer scheduled. When `.spec.startingDeadlineSeconds` is not set, the CronJob
controller counts missed schedules from `status.lastScheduleTime` until now. For example, one cron job is
supposed to run every minute, the `status.lastScheduleTime` of the cronjob is 5:00am, but now it's 7:00am.
That means 120 schedules were missed, so the cron job is no longer scheduled. If the `.spec.startingDeadlineSeconds`
field is set (not null), the CronJob controller counts how many missed jobs occurred from the value of
`.spec.startingDeadlineSeconds` until now. For example, if it is set to `200`, it counts how many missed
schedules occurred in the last 200 seconds. In that case, if there were more than 100 missed schedules in the
last 200 seconds, the cron job is no longer scheduled.
-->
CronJob 控制器会统计错过了多少次调度。如果错过了100次以上的调度，CronJob 就不再调度了。
当没有设置 `.spec.startingDeadlineSeconds` 时，CronJob 控制器统计从
`status.lastScheduleTime` 到当前的调度错过次数。
例如一个 CronJob 期望每分钟执行一次，`status.lastScheduleTime`是 `5:00am`，
但现在是 `7:00am`。那意味着 120 次调度被错过了，所以 CronJob 将不再被调度。
如果设置了 `.spec.startingDeadlineSeconds` 域(非空)，CronJob 控制器统计从
`.spec.startingDeadlineSeconds` 到当前时间错过了多少次任务。
例如设置了 `200`，它会统计过去 200 秒内错过了多少次调度。
在那种情况下，如果过去 200 秒内错过了超过 100 次的调度，CronJob 就不再调度。

<!--
### Concurrency Policy

The `.spec.concurrencyPolicy` field is also optional.
It specifies how to treat concurrent executions of a job that is created by this cron job.
the spec may specify only one of the following concurrency policies:

* `Allow` (default): The cron job allows concurrently running jobs
* `Forbid`: The cron job does not allow concurrent runs; if it is time for a new job run and the previous job run hasn't finished yet, the cron job skips the new job run
* `Replace`: If it is time for a new job run and the previous job run hasn't finished yet, the cron job replaces the currently running job run with a new job run

Note that concurrency policy only applies to the jobs created by the same cron job.
If there are multiple cron jobs, their respective jobs are always allowed to run concurrently.
-->
### 并发性规则

`.spec.concurrencyPolicy` 也是可选的。它声明了 CronJob 创建的任务执行时发生重叠如何处理。
spec 仅能声明下列规则中的一种：

* `Allow` (默认)：CronJob 允许并发任务执行。
* `Forbid`： CronJob 不允许并发任务执行；如果新任务的执行时间到了而老任务没有执行完，CronJob 会忽略新任务的执行。
* `Replace`：如果新任务的执行时间到了而老任务没有执行完，CronJob 会用新任务替换当前正在运行的任务。

请注意，并发性规则仅适用于相同 CronJob 创建的任务。如果有多个 CronJob，它们相应的任务总是允许并发执行的。

<!--
### Suspend

The `.spec.suspend` field is also optional.
If it is set to `true`, all subsequent executions are suspended.
This setting does not apply to already started executions.
Defaults to false.
-->
### 挂起

`.spec.suspend`域也是可选的。如果设置为 `true` ，后续发生的执行都会挂起。
这个设置对已经开始的执行不起作用。默认是关闭的。

<!--
Executions that are suspended during their scheduled time count as missed jobs.
When `.spec.suspend` changes from `true` to `false` on an existing cron job without a [starting deadline](#starting-deadline), the missed jobs are scheduled immediately.
-->
{{< caution >}}
在调度时间内挂起的执行都会被统计为错过的任务。当 `.spec.suspend` 从 `true` 改为 `false` 时，
且没有 [开始的最后期限](#starting-deadline)，错过的任务会被立即调度。
{{< /caution >}}

<!--
### Jobs History Limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields are optional.
These fields specify how many completed and failed jobs should be kept.
By default, they are set to 3 and 1 respectively.  Setting a limit to `0` corresponds to keeping none of the corresponding kind of jobs after they finish.
-->
### 任务历史限制

`.spec.successfulJobsHistoryLimit` 和 `.spec.failedJobsHistoryLimit`是可选的。
这两个字段指定应保留多少已完成和失败的任务。
默认设置为3和1。限制设置为0代表相应类型的任务完成后不会保留。


