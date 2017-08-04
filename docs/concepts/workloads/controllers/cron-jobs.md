---
assignees:
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

* TOC
{:toc}

<!--
## What is a cron job?

A _Cron Job_ manages time based [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/), namely:

* Once at a specified point in time
* Repeatedly at a specified point in time

One CronJob object is like one line of a _crontab_ (cron table) file. It runs a job periodically
on a given schedule, written in [Cron](https://en.wikipedia.org/wiki/Cron) format.
-->

## Cron Job 是什么？

_Cron Job_ 管理基于时间的 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/)，即：

* 在给定时间点只运行一次
* 周期性地在给定时间点运行

一个 CronJob 对象类似于 _crontab_ （cron table）文件中的一行。它根据指定的预定计划周期性地运行一个 Job，格式可以参考 [Cron](https://en.wikipedia.org/wiki/Cron) 。

<!--
**Note:** The question mark (`?`) in the schedule has the same meaning as an asterisk `*`,
that is, it stands for any of available value for a given field.

**Note:** ScheduledJob resource was introduced in Kubernetes version 1.4, but starting
from version 1.5 its current name is CronJob.

A typical use case is:
-->

**注意：** 在预定计划中，问号（`?`）和星号（`*`）的意义是相同的，表示给定的字段的取值是任何可用的值。

**注意：** 在 Kubernetes 1.4 版本引入了 ScheduledJob 资源，但从 1.5 版本开始改成了 CronJob。

典型的用法如下所示：

<!--
* Schedule a job execution at a given point in time.
* Create a periodic job, e.g. database backup, sending emails.

### Prerequisites
-->

* 在给定的时间点调度 Job 运行
* 创建周期性运行的 Job，例如：数据库备份、发送邮件。

### 前提条件

<!--
You need a working Kubernetes cluster at version >= 1.4 (for ScheduledJob), >= 1.5 (for CronJob),
with batch/v2alpha1 API turned on by passing `--runtime-config=batch/v2alpha1=true` while bringing up
the API server (see [Turn on or off an API version for your cluster](/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster)
for more).

## Creating a Cron Job

Here is an example Cron Job. Every minute, it runs a simple job to print current time and then say
hello.

{% include code.html language="yaml" file="cronjob.yaml" ghlink="/docs/concepts/workloads/controllers/cronjob.yaml" %}

Run the example cron job by downloading the example file and then running this command:
-->

当使用的 Kubernetes 集群，版本 >= 1.4（对 ScheduledJob），>= 1.5（对 CronJob），当启动 API Server（参考 [为集群开启或关闭 API 版本](/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster) 获取更多信息）时，通过传递选项 `--runtime-config=batch/v2alpha1=true`  可以开启 batch/v2alpha1 API。

## 创建 Cron Job

下面是一个 Cron Job 的例子。它会每分钟运行一个 Job，打印出当前时间并输出问候语 hello。

% include code.html language="yaml" file="cronjob.yaml" ghlink="/docs/concepts/workloads/controllers/cronjob.yaml" %}

下载并运行该示例 Cron Job，然后执行如下命令：

```shell
$ kubectl create -f ./cronjob.yaml
cronjob "hello" created
```

<!--
Alternatively, use `kubectl run` to create a cron job without writing full config:
-->

可选地，使用 `kubectl run` 创建一个 Cron Job，不需要写完整的配置：

```shell
$ kubectl run hello --schedule="*/1 * * * *" --restart=OnFailure --image=busybox -- /bin/sh -c "date; echo Hello from the Kubernetes cluster"
cronjob "hello" created
```

<!--
After creating the cron job, get its status using this command:
-->

创建该 Cron Job 之后，通过如下命令获取它的状态信息：

```shell
$ kubectl get cronjob hello
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
hello     */1 * * * *   False     0         <none>
```

<!--
As you can see above, there's no active job yet, and no job has been scheduled, either.

Watch for the job to be created in around one minute:
-->

如上所示，既没有 active 的 Job，也没有被调度的 Job。

等待并观察创建的 Job，大约一分钟时间：

```shell
$ kubectl get jobs --watch
NAME               DESIRED   SUCCESSFUL   AGE
hello-4111706356   1         1         2s
```

<!--
Now you've seen one running job scheduled by "hello". We can stop watching it and get the cron job again:
-->

现在能看到一个名称为 hello 的 Job 在运行。我们可以停止观察，并再次获取该 Job 的状态信息：

```shell
$ kubectl get cronjob hello
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
hello     */1 * * * *   False     0         Mon, 29 Aug 2016 14:34:00 -0700
```
<!--
You should see that "hello" successfully scheduled a job at the time specified in `LAST-SCHEDULE`. There are
currently 0 active jobs, meaning that the job that's scheduled is completed or failed.

Now, find the pods created by the job last scheduled and view the standard output of one of the pods. Note that
your job name and pod name would be different.
-->

应该能够看到名称为 “hello” 的 Job 在 `LAST-SCHEDULE` 指定的时间点被调度了。当前存在 0 个 active 的 Job，说明该 Job 已经被调度运行完成或失败。

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
<!--
## Deleting a Cron Job

Once you don't need a cron job anymore, simply delete it with `kubectl`:
-->

## 删除 Cron Job

一旦不再需要 Cron Job，简单地可以使用 `kubectl` 命令删除它：

```shell
$ kubectl delete cronjob hello
cronjob "hello" deleted
```

<!--
This stops new jobs from being created. However, running jobs won't be stopped, and no jobs or their pods will
be deleted. To clean up those jobs and pods, you need to list all jobs created by the cron job, and delete them all:
-->

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

<!--
Once the jobs are deleted, the pods created by them are deleted as well. Note that all jobs created by cron
job "hello" will be prefixed "hello-". You can delete them at once with `kubectl delete jobs --all`, if you want to
delete all jobs in the current namespace (not just the ones created by "hello".)
-->

一旦 Job 被删除，由 Job 创建的 Pod 也会被删除。注意，所有由名称为 “hello” 的 Cron Job 创建的 Job 会以前缀字符串 “hello-” 进行命名。如果想要删除当前 Namespace 中的所有 Job，可以通过命令 `kubectl delete jobs --all` 立刻删除它们。

<!--
## Cron Job Limitations

A cron job creates a job object _about_ once per execution time of its schedule. We say "about" because there
are certain circumstances where two jobs might be created, or no job might be created. We attempt to make these rare,
but do not completely prevent them. Therefore, jobs should be _idempotent_.

The job is responsible for retrying pods, parallelism among pods it creates, and determining the success or failure
of the set of pods. A cron job does not examine pods at all.
-->

## Cron Job 限制

Cron Job 在每次调度运行时间内 _大概_ 会创建一个 Job 对象。我们之所以说 _大概_ ，是因为在特定的环境下可能会创建两个 Job，或者一个 Job 都没创建。我们尝试少发生这种情况，但却不能完全避免。因此，创建 Job 操作应该是 _幂等的_。

Job 根据它所创建的 Pod 的并行度，负责重试创建 Pod，并就决定这一组 Pod 的成功或失败。Cron Job 根本就不会去检查 Pod。

<!--
## Writing a Cron Job Spec

As with all other Kubernetes configs, a cron job needs `apiVersion`, `kind`, and `metadata` fields. For general
information about working with config files, see [deploying applications](/docs/user-guide/deploying-applications),
[configuring containers](/docs/user-guide/configuring-containers), and
[using kubectl to manage resources](/docs/user-guide/working-with-resources) documents.

A cron job also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status).

**Note:** All modifications to a cron job, especially its `.spec`, will be applied only to the next run.
-->

## 编写 Cron Job Spec

和其它 Kubernetes 配置一样，Cron Job 需要 `apiVersion`、 `kind`、和 `metadata` 这三个字段。关于更多如何实现一个配置文件，参考文档 [部署应用](/docs/user-guide/deploying-applications)、
[配置容器](/docs/user-guide/configuring-containers) 和 
[使用 kubectl 管理资源](/docs/user-guide/working-with-resources)。

<!--
### Schedule

The `.spec.schedule` is a required field of the `.spec`. It takes a [Cron](https://en.wikipedia.org/wiki/Cron) format
string, e.g. `0 * * * *` or `@hourly`, as schedule time of its jobs to be created and executed.
-->

### 调度

 `.spec.schedule` 是 `.spec` 中必需的字段，它的值是 [Cron](https://en.wikipedia.org/wiki/Cron) 格式字符串，例如：`0 * * * *`，或者 `@hourly`，根据指定的调度时间 Job 会被创建和执行。

<!--
### Job Template

The `.spec.jobTemplate` is another required field of the `.spec`. It is a job template. It has exactly the same schema
as a [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/), except it is nested and does not have an `apiVersion` or `kind`, see
[Writing a Job Spec](/docs/concepts/jobs/run-to-completion-finite-workloads/#writing-a-job-spec).
-->

### Job 模板

`.spec.jobTemplate` 是另一个 `.spec` 中必需的字段。它是 Job 的模板。它和 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) 一样具有完全相同的模式（schema），除了它是可以嵌套的，并且不具有 `apiVersion` 或 `kind` 字段。参考 [编写 Job 规格](/docs/concepts/jobs/run-to-completion-finite-workloads/#writing-a-job-spec)。

<!--
### Starting Deadline Seconds

The `.spec.startingDeadlineSeconds` field is optional. It stands for the deadline (in seconds) for starting the job
if it misses its scheduled time for any reason. Missed jobs executions will be counted as failed ones. If not specified,
there's no deadline.
-->

### 启动 Job 的期限（秒级别）

`.spec.startingDeadlineSeconds` 字段是可选的。它表示启动 Job 的期限（秒级别），如果因为任何原因而错过了被调度的时间，那么错过执行时间的 Job 将被认为是失败的。如果没有指定，则没有期限。

<!--
### Concurrency Policy

The `.spec.concurrencyPolicy` field is also optional. It specifies how to treat concurrent executions of a job
created by this cron job. Only one of the following concurrent policies may be specified:

* `Allow` (default): allows concurrently running jobs
* `Forbid`: forbids concurrent runs, skipping next run if previous hasn't finished yet
* `Replace`: cancels currently running job and replaces it with a new one

Note that concurrency policy only applies to the jobs created by the same cron job. If there are multiple
cron jobs, their respective jobs are always allowed to run concurrently.
-->

### 并发策略

`.spec.concurrencyPolicy` 字段也是可选的。它指定了如何处理被 Cron Job 创建的 Job 的并发执行。只允许指定下面策略中的一种：

* `Allow`（默认）：允许并发运行 Job
* `Forbid`：禁止并发运行，如果前一个还没有完成，则直接跳过下一个
* `Replace`：取消当前正在运行的 Job，用一个新的来替换

注意，当前策略只能应用于同一个 Cron Job 创建的 Job。如果存在多个 Cron Job，它们创建的 Job 之间总是允许并发运行。

<!--
### Suspend

The `.spec.suspend` field is also optional. If set to `true`, all subsequent executions will be suspended. It does not
apply to already started executions. Defaults to false.
-->

### 挂起

`.spec.suspend` 字段也是可选的。如果设置为 `true`，后续所有执行都会被挂起。它对已经开始执行的 Job 不起作用。默认值为 `false`。

<!--
### Jobs History Limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields are optional. These fields specify how many completed and failed jobs should be kept.

By default, there are no limits, and all successful and failed jobs are kept. However, jobs can pile up quickly when running a cron job, and setting these fields is recommended. Setting a limit to `0` corresponds to keeping none of the corresponding kind of jobs after they finish.
-->

### Job 历史限制

`.spec.successfulJobsHistoryLimit` 和 `.spec.failedJobsHistoryLimit` 是可选的字段。它们指定了可以保留多少完成和失败的 Job。

默认没有限制，所有成功和失败的 Job 都会被保留。然而，当运行一个 Cron Job 时，Job 可以很快就堆积很多，推荐设置这两个字段的值。设置限制的值为 `0`，相关类型的 Job 完成后将不会被保留。
