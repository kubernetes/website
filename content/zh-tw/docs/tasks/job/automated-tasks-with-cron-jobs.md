---
title: 使用 CronJob 執行自動化任務
content_type: task
weight: 10
min-kubernetes-server-version: v1.21
---

<!--
title: Running Automated Tasks with a CronJob
reviewers:
- chenopis
content_type: task
weight: 10
min-kubernetes-server-version: v1.21
-->

<!-- overview -->

<!--

CronJobs was promoted to general availability in Kubernetes v1.21. If you are using an older version of
Kubernetes, please refer to the documentation for the version of Kubernetes that you are using,
so that you see accurate information. Older Kubernetes versions do not support the `batch/v1` CronJob API.

You can use [CronJobs](/docs/concepts/workloads/controllers/cron-jobs) to run jobs on a time-based schedule.
These automated jobs run like [Cron](https://en.wikipedia.org/wiki/Cron) tasks on a Linux or UNIX system.

Cron jobs are useful for creating periodic and recurring tasks, like running backups or sending emails.
Cron jobs can also schedule individual tasks for a specific time, such as if you want to schedule a job for a low activity period.
-->

在Kubernetes v1.21 版本中，CronJob 被提升為通用版本。如果你使用的是舊版本的 Kubernetes，請參考你正在使用的 Kubernetes 版本的文件，這樣你就能看到準確的資訊。舊的 Kubernetes 版本不支援`batch/v1` CronJob API。

你可以利用 [CronJobs](/zh-cn/docs/concepts/workloads/controllers/cron-jobs) 執行基於時間排程的任務。這些自動化任務和 Linux 或者 Unix 系統的 [Cron](https://en.wikipedia.org/wiki/Cron) 任務類似。

CronJobs 在建立週期性以及重複性的任務時很有幫助，例如執行備份操作或者傳送郵件。CronJobs 也可以在特定時間排程單個任務，例如你想排程低活躍週期的任務。

<!--
Cron jobs have limitations and idiosyncrasies.
For example, in certain circumstances, a single cron job can create multiple jobs.
Therefore, jobs should be idempotent.
For more limitations, see [CronJobs](/docs/concepts/workloads/controllers/cron-jobs).
-->
CronJobs 有一些限制和特點。
例如，在特定狀況下，同一個 CronJob 可以建立多個任務。
因此，任務應該是冪等的。

檢視更多限制，請參考 [CronJobs](/zh-cn/docs/concepts/workloads/controllers/cron-jobs)。

## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Creating a Cron Job

Cron jobs require a config file.
This example cron job config `.spec` file prints the current time and a hello message every minute:
-->
## 建立 CronJob

CronJob 需要一個配置檔案。
本例中 CronJob 的`.spec` 配置檔案每分鐘打印出當前時間和一個問好資訊：

{{< codenew file="application/job/cronjob.yaml" >}}

<!--
Run the example cron job by downloading the example file and then running this command:
-->
想要執行示例的 CronJob，可以下載示例檔案並執行命令：

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```
```
cronjob.batch/hello created
```

<!--
After creating the cron job, get its status using this command:
-->
建立好 CronJob 後，使用下面的命令來獲取其狀態：

```shell
kubectl get cronjob hello
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```
<!--
As you can see from the results of the command, the cron job has not scheduled or run any jobs yet.
Watch for the job to be created in around one minute:
-->
就像你從命令返回結果看到的那樣，CronJob 還沒有排程或執行任何任務。大約需要一分鐘任務才能建立好。

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
現在你已經看到了一個執行中的任務被 “hello” CronJob 排程。
你可以停止監視這個任務，然後再次檢視 CronJob 就能看到它排程任務：

```shell
kubectl get cronjob hello
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

<!--
You should see that the cron job `hello` successfully scheduled a job at the time specified in `LAST SCHEDULE`. There are currently 0 active jobs, meaning that the job has completed or failed.

Now, find the pods that the last scheduled job created and view the standard output of one of the pods.
-->
你應該能看到 `hello` CronJob 在 `LAST SCHEDULE` 宣告的時間點成功的排程了一次任務。
有 0 個活躍的任務意味著任務執行完畢或者執行失敗。

現在，找到最後一次排程任務建立的 Pod 並檢視一個 Pod 的標準輸出。

<!--
The job name and pod name are different.
-->
{{< note >}}
Job 名稱和 Pod 名稱不同。
{{< /note >}}

```shell
# 在你的系統上將 "hello-4111706356" 替換為 Job 名稱
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items..metadata.name})
```

<!--
Show pod log:
-->
檢視 Pod 日誌：

```shell
kubectl logs $pods
```
<!--
The output is similar to this:
-->
輸出與此類似：

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

<!--
## Deleting a Cron Job

When you don't need a cron job any more, delete it with `kubectl delete cronjob <cronjob name>`：
-->

## 刪除 CronJob

當你不再需要 CronJob 時，可以用 `kubectl delete cronjob <cronjob name>` 刪掉它：

```shell
kubectl delete cronjob hello
```

<!--
Deleting the cron job removes all the jobs and pods it created and stops it from creating additional jobs.
You can read more about removing jobs in [garbage collection](/docs/concepts/workloads/controllers/garbage-collection/).
-->
刪除 CronJob 會清除它建立的所有任務和 Pod，並阻止它建立額外的任務。你可以查閱
[垃圾收集](/zh-cn/docs/concepts/workloads/controllers/garbage-collection/)。

<!--
## Writing a Cron Job Spec

As with all other Kubernetes configs, a cron job needs `apiVersion`, `kind`, and `metadata` fields. For general
information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/),
and [using kubectl to manage resources](/docs/concepts/overview/working-with-objects/object-management/) documents.

A cron job config also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->
## 編寫 CronJob 宣告資訊

像 Kubernetes 的其他配置一樣，CronJob 需要 `apiVersion`、`kind`、和 `metadata` 域。
配置檔案的一般資訊，請參考
[部署應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/) 和
[使用 kubectl 管理資源](/zh-cn/docs/concepts/overview/working-with-objects/object-management/).

CronJob 配置也需要包括
[`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

<!--
All modifications to a cron job, especially its `.spec`, are applied only to the following runs.
-->
{{< note >}}
對 CronJob 的所有改動，特別是它的 `.spec`，只會影響將來的執行例項。
{{< /note >}}

<!--
### Schedule

The `.spec.schedule` is a required field of the `.spec`.
It takes a [Cron](https://en.wikipedia.org/wiki/Cron) format string, such as `0 * * * *` or `@hourly`, as schedule time of its jobs to be created and executed.
-->
### 時間安排

`.spec.schedule` 是 `.spec` 需要的域。它使用了 [Cron](https://en.wikipedia.org/wiki/Cron)
格式串，例如 `0 * * * *` or `@hourly` ，作為它的任務被建立和執行的排程時間。

<!--
The format also includes extended "Vixie cron" step values. As explained in the [FreeBSD manual](https://www.freebsd.org/cgi/man.cgi?crontab%285%29):
-->
該格式也包含了擴充套件的 "Vixie cron" 步長值。
[FreeBSD 手冊](https://www.freebsd.org/cgi/man.cgi?crontab%285%29)中解釋如下:

<!--
> Step values can be	used in	conjunction with ranges.  Following a range
> with `/<number>` specifies skips	of the number's	value through the
> range.  For example, `0-23/2` can be used in the	hours field to specify
> command execution every other hour	(the alternative in the	V7 standard is
> `0,2,4,6,8,10,12,14,16,18,20,22`).  Steps are also permitted after an
> asterisk, so if you want to say "every two hours", just use `*/2`.
-->

> 步長可被用於範圍組合。範圍後面帶有 `/<數字>` 可以聲明範圍內的步幅數值。
> 例如，`0-23/2` 可被用在小時域來宣告命令在其他數值的小時數執行
> （ V7 標準中對應的方法是`0,2,4,6,8,10,12,14,16,18,20,22`）。
> 步長也可以放在萬用字元後面，因此如果你想表達 "每兩小時"，就用 `*/2` 。

<!--
A question mark (`?`) in the schedule has the same meaning as an asterisk `*`, that is, it stands for any of available value for a given field.
-->
{{< note >}}
排程中的問號 (`?`) 和星號  `*` 含義相同，表示給定域的任何可用值。
{{< /note >}}

<!--
### Job Template

The `.spec.jobTemplate` is the template for the job, and it is required.
It has exactly the same schema as a [Job](/docs/concepts/workloads/controllers/job/), 
except that it is nested and does not have an `apiVersion` or `kind`.
For information about writing a job `.spec`, see
[Writing a Job Spec](/docs/concepts/workloads/controllers/job/#writing-a-job-spec).
-->
### 任務模版

`.spec.jobTemplate`是任務的模版，它是必須的。它和
[Job](/zh-cn/docs/concepts/workloads/controllers/job/)的語法完全一樣，
除了它是巢狀的沒有 `apiVersion` 和 `kind`。
編寫任務的 `.spec` ，請參考
[編寫 Job 的Spec](/zh-cn/docs/concepts/workloads/controllers/job/#writing-a-job-spec)。

<!--
### Starting Deadline

The `.spec.startingDeadlineSeconds` field is optional.
It stands for the deadline in seconds for starting the job if it misses its scheduled time for any reason.
After the deadline, the cron job does not start the job.
Jobs that do not meet their deadline in this way count as failed jobs.
If this field is not specified, the jobs have no deadline.
-->
### 開始的最後期限   {#starting-deadline}

`.spec.startingDeadlineSeconds` 域是可選的。
它表示任務如果由於某種原因錯過了排程時間，開始該任務的截止時間的秒數。過了截止時間，CronJob 就不會開始任務。
不滿足這種最後期限的任務會被統計為失敗任務。如果該域沒有宣告，那任務就沒有最後期限。

<!--
If the `.spec.startingDeadlineSeconds` field is set (not null), the CronJob
controller measures the time between when a job is expected to be created and
now. If the difference is higher than that limit, it will skip this execution.

For example, if it is set to `200`, it allows a job to be created for up to 200
seconds after the actual schedule.
-->
如果`.spec.startingDeadlineSeconds`欄位被設定(非空)，CronJob 控制器會計算從預期建立 Job 到當前時間的時間差。
如果時間差大於該限制，則跳過此次執行。

例如，如果將其設定為 `200`，則 Job 控制器允許在實際排程之後最多 200 秒內建立 Job。

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
### 併發性規則

`.spec.concurrencyPolicy` 也是可選的。它聲明瞭 CronJob 建立的任務執行時發生重疊如何處理。
spec 僅能宣告下列規則中的一種：

* `Allow` (預設)：CronJob 允許併發任務執行。
* `Forbid`： CronJob 不允許併發任務執行；如果新任務的執行時間到了而老任務沒有執行完，CronJob 會忽略新任務的執行。
* `Replace`：如果新任務的執行時間到了而老任務沒有執行完，CronJob 會用新任務替換當前正在執行的任務。

請注意，併發性規則僅適用於相同 CronJob 建立的任務。如果有多個 CronJob，它們相應的任務總是允許併發執行的。

<!--
### Suspend

The `.spec.suspend` field is also optional.
If it is set to `true`, all subsequent executions are suspended.
This setting does not apply to already started executions.
Defaults to false.
-->
### 掛起

`.spec.suspend`域也是可選的。如果設定為 `true` ，後續發生的執行都會掛起。
這個設定對已經開始的執行不起作用。預設是關閉的。

<!--
Executions that are suspended during their scheduled time count as missed jobs.
When `.spec.suspend` changes from `true` to `false` on an existing cron job without a [starting deadline](#starting-deadline), the missed jobs are scheduled immediately.
-->
{{< caution >}}
在排程時間內掛起的執行都會被統計為錯過的任務。當 `.spec.suspend` 從 `true` 改為 `false` 時，
且沒有 [開始的最後期限](#starting-deadline)，錯過的任務會被立即排程。
{{< /caution >}}

<!--
### Jobs History Limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields are optional.
These fields specify how many completed and failed jobs should be kept.
By default, they are set to 3 and 1 respectively.  Setting a limit to `0` corresponds to keeping none of the corresponding kind of jobs after they finish.
-->
### 任務歷史限制

`.spec.successfulJobsHistoryLimit` 和 `.spec.failedJobsHistoryLimit`是可選的。
這兩個欄位指定應保留多少已完成和失敗的任務。
預設設定為3和1。限制設定為 `0` 代表相應型別的任務完成後不會保留。


