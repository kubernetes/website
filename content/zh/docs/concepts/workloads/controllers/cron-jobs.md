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

一个 CronJob 对象类似于 _crontab_ （cron table）文件中的一行。它根据指定的预定计划周期性地运行一个 Job，格式可以参考 [Cron](https://en.wikipedia.org/wiki/Cron) 。



**注意：** 在预定计划中，问号（`?`）和星号（`*`）的意义是相同的，表示给定字段的取值是任意可用值。

**注意：** 在 Kubernetes 1.4 版本引入了 ScheduledJob 资源，但从 1.5 版本开始改成了 CronJob。

典型的用法如下所示：



* 在给定的时间点调度 Job 运行
* 创建周期性运行的 Job，例如：数据库备份、发送邮件。

### 前提条件



当使用的 Kubernetes 集群，版本 >= 1.4（对 ScheduledJob），>= 1.5（对 CronJob），当启动 API Server（参考 [为集群开启或关闭 API 版本](/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster) 获取更多信息）时，通过传递选项 `--runtime-config=batch/v2alpha1=true`  可以开启 batch/v2alpha1 API。

## 创建 Cron Job

下面是一个 Cron Job 的例子。它会每分钟运行一个 Job，打印出当前时间并输出问候语 hello。

% include code.html language="yaml" file="cronjob.yaml" ghlink="/docs/concepts/workloads/controllers/cronjob.yaml" %}

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
