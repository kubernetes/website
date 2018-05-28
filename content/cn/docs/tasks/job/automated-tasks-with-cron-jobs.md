---
title: 使用Cron Job运行自动化任务
reviewers:
- chenopis
content_template: templates/task
---

{{% capture overview %}}

你可以使用  [CronJobs](/cn/docs/concepts/workloads/controllers/cron-jobs) 去运行一个基于时间调度的任务.
这些自动化任务像是在Linux或者Unix系统上运行的  [Cron](https://en.wikipedia.org/wiki/Cron) 任务.

Cron Job可用于创建周期性和重复性的任务，如运行备份或发送电子邮件。
Cron Job还可以为特定时间安排单个任务，例如，您想运行一个低周期的任务。

**注意:** Cron Job 在API 分组 `batch/v2alpha1` 的资源已经从1.8的集群版本开始被废弃了。
你需要切换到使用已经在API server中被默认启动的  `batch/v1beta1`。
这个文档中所有的例子都使用 `batch/v1beta1` 。

Cron Job有限制也有特性。
例如，在某些情况下，单个作业可以创建多个作业。
因此，作业应该是幂等的。
看更多的限制, 查阅 [CronJobs](/docs/concepts/workloads/controllers/cron-jobs).

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}} * 你需要一个版本大于1.8的可用 Kubernetes 集群 . 小于1.8版本的集群，你需要显式的启用 `batch/v2alpha1` API 通过传递  `--runtime-config=batch/v2alpha1=true` 给
API server (查阅 [Turn on or off an API version for your cluster](/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster), 并且把 API server 和 controller manager 都重启。

{{% /capture %}}

{{% capture steps %}}

## 创建一个 Cron Job

Cron Job 需要一个配置文件。
下面是一个 Cron Job 的例子。它会每分钟运行一个 Job，打印出当前时间并输出问候语 hello。

{{< code file="cronjob.yaml" >}}

下载并运行该示例 Cron Job，然后执行如下命令：

```shell
$ kubectl create -f ./cronjob.yaml
cronjob "hello" created
```

可选地，使用 `kubectl run` 创建一个 Cron Job，不需要写完整的配置：

```shell
$ kubectl run hello --schedule="*/1 * * * *" --restart=OnFailure --image=busybox -- /bin/sh -c "date; echo Hello from the Kubernetes cluster"
cronjob "hello" created
```

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

删除Cron Job会删除所有的Job和已经创建的Pod，并且停止创建新的Job。
你可以在 [garbage collection](/docs/concepts/workloads/controllers/garbage-collection/)阅读更多关于删除Job的内容。


## 编写 Cron Job 规约

和其它 Kubernetes 配置一样，Cron Job 需要 `apiVersion`、 `kind`、和 `metadata` 这三个字段。
关于如何实现一个配置文件的更新信息，参考文档 [部署应用](/cn/docs/user-guide/deploying-applications)、
[使用 kubectl 管理资源](/docs/user-guide/working-with-resources)。

Cron Job 也需要 [`.spec` 段](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status)。

**注意：** 对一个 Cron Job 的所有修改，尤其是对其 `.spec` 的修改，仅会在下一次运行的时候生效。

### 调度

 `.spec.schedule` 是 `.spec` 中必需的字段，
 它的值是 [Cron](https://en.wikipedia.org/wiki/Cron) 格式字的符串，例如：`0 * * * *`，或者 `@hourly`，根据指定的调度时间 Job 会被创建和执行。

**注意：** 在预定计划中，问号（`?`）和星号（`*`）的意义是相同的，表示给定字段的取值是任意可用值。

### Job 模板

`.spec.jobTemplate` 是另一个 `.spec` 中必需的字段。它是 Job 的模板。
除了它可以是嵌套的，并且不具有 `apiVersion` 或 `kind` 字段之外，它和 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) 一样具有完全相同的模式（schema）。
参考 [编写 Job 规格](/docs/concepts/jobs/run-to-completion-finite-workloads/#writing-a-job-spec)。


### 启动 Job 的期限（秒级别）

`.spec.startingDeadlineSeconds` 字段是可选的。
它表示启动 Job 的期限（秒级别），如果因为任何原因而错过了被调度的时间，那么错过执行时间的 Job 将被认为是失败的。如果没有指定，则没有期限。


### 并发策略

`.spec.concurrencyPolicy` 字段也是可选的。它指定了如何处理被 Cron Job 创建的 Job 的并发执行。只允许指定下面策略中的一种：

* `Allow`（默认）：允许并发运行 Job
* `Forbid`：禁止并发运行，如果前一个还没有完成，则直接跳过下一个
* `Replace`：取消当前正在运行的 Job，用一个新的来替换

注意，当前策略只能应用于同一个 Cron Job 创建的 Job。如果存在多个 Cron Job，它们创建的 Job 之间总是允许并发运行。


### 挂起

`.spec.suspend` 字段也是可选的。
如果设置为 `true`，后续所有执行都将被挂起。
它对已经开始执行的 Job 不起作用。默认值为 `false`。


### Job 历史限制

`.spec.successfulJobsHistoryLimit` 和 `.spec.failedJobsHistoryLimit` 这两个字段是可选的。
它们指定了可以保留完成和失败 Job 数量的限制。

默认情况下，它们分别被设置成3和1。设置限制值为 `0`，相关类型的 Job 完成后将不会被保留。


{{% /capture %}}
