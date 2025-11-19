---
title: CronJob
api_metadata:
- apiVersion: "batch/v1"
  kind: "CronJob"
content_type: concept
description: >-
  CronJob 通過重複調度啓動一次性的 Job。
weight: 80
hide_summary: true # 在章節索引中單獨列出
---
<!--
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
api_metadata:
- apiVersion: "batch/v1"
  kind: "CronJob"
content_type: concept
description: >-
  A CronJob starts one-time Jobs on a repeating schedule.
weight: 80
hide_summary: true # Listed separately in section index
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
A _CronJob_ creates {{< glossary_tooltip term_id="job" text="Jobs" >}} on a repeating schedule.

CronJob is meant for performing regular scheduled actions such as backups, report generation,
and so on. One CronJob object is like one line of a _crontab_ (cron table) file on a
Unix system. It runs a Job periodically on a given schedule, written in
[Cron](https://en.wikipedia.org/wiki/Cron) format.
-->
**CronJob** 創建基於時隔重複調度的 {{< glossary_tooltip term_id="job" text="Job" >}}。

CronJob 用於執行排期操作，例如備份、生成報告等。
一個 CronJob 對象就像 Unix 系統上的 **crontab**（cron table）文件中的一行。
它用 [Cron](https://zh.wikipedia.org/wiki/Cron) 格式進行編寫，
並週期性地在給定的調度時間執行 Job。

<!--
CronJobs have limitations and idiosyncrasies.
For example, in certain circumstances, a single CronJob can create multiple concurrent Jobs. See the [limitations](#cron-job-limitations) below.
-->
CronJob 有所限制，也比較特殊。
例如在某些情況下，單個 CronJob 可以創建多個併發任務。
請參閱下面的[限制](#cron-job-limitations)。

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
當控制平面爲 CronJob 創建新的 Job 和（間接）Pod 時，CronJob 的 `.metadata.name` 是命名這些 Pod 的部分基礎。
CronJob 的名稱必須是一個合法的
[DNS 子域](/zh-cn/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)值，
但這會對 Pod 的主機名產生意外的結果。爲獲得最佳兼容性，名稱應遵循更嚴格的
[DNS 標籤](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)規則。
即使名稱是一個 DNS 子域，它也不能超過 52 個字符。這是因爲 CronJob 控制器將自動在你所提供的 Job 名稱後附加
11 個字符，並且存在 Job 名稱的最大長度不能超過 63 個字符的限制。

<!-- body -->

<!--
## Example

This example CronJob manifest prints the current time and a hello message every minute:
-->
## 示例    {#example}

下面的 CronJob 示例清單會在每分鐘打印出當前時間和問候消息：

{{% code_sample file="application/job/cronjob.yaml" %}}

<!--
([Running Automated Tasks with a CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)
takes you through this example in more detail).
-->
[使用 CronJob 運行自動化任務](/zh-cn/docs/tasks/job/automated-tasks-with-cron-jobs/)一文會爲你詳細講解此例。

<!--
## Writing a CronJob spec
### Schedule syntax
The `.spec.schedule` field is required. The value of that field follows the [Cron](https://en.wikipedia.org/wiki/Cron) syntax:
-->
## 編寫 CronJob 聲明信息   {#writing-a-cronjob-spec}

### Cron 時間表語法    {#cron-schedule-syntax}

`.spec.schedule` 字段是必需的。該字段的值遵循 [Cron](https://zh.wikipedia.org/wiki/Cron) 語法：

<!--
```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
# │ │ │ │ │                                   OR sun, mon, tue, wed, thu, fri, sat
# │ │ │ │ │
# │ │ │ │ │
# * * * * *
```
-->
```
# ┌───────────── 分鐘 (0 - 59)
# │ ┌───────────── 小時 (0 - 23)
# │ │ ┌───────────── 月的某天 (1 - 31)
# │ │ │ ┌───────────── 月份 (1 - 12)
# │ │ │ │ ┌───────────── 周的某天 (0 - 6)（週日到週六）
# │ │ │ │ │                          或者是 sun，mon，tue，web，thu，fri，sat
# │ │ │ │ │
# │ │ │ │ │
# * * * * *
```

<!--
For example, `0 3 * * 1` means this task is scheduled to run weekly on a Monday at 3 AM.
-->
例如 `0 3 * * 1` 表示此任務計劃於每週一凌晨 3 點運行。

<!--
The format also includes extended "Vixie cron" step values. As explained in the
[FreeBSD manual](https://www.freebsd.org/cgi/man.cgi?crontab%285%29):
-->
該格式也包含了擴展的 “Vixie cron” 步長值。
[FreeBSD 手冊](https://www.freebsd.org/cgi/man.cgi?crontab%285%29)中解釋如下:

<!--
> Step values can be used in conjunction with ranges. Following a range
> with `/<number>` specifies skips of the number's value through the
> range. For example, `0-23/2` can be used in the hours field to specify
> command execution every other hour (the alternative in the V7 standard is
> `0,2,4,6,8,10,12,14,16,18,20,22`). Steps are also permitted after an
> asterisk, so if you want to say "every two hours", just use `*/2`.
-->
> 步長可被用於範圍組合。範圍後面帶有 `/<數字>` 可以聲明範圍內的步幅數值。
> 例如，`0-23/2` 可被用在小時字段來聲明命令在其他數值的小時數執行
> （V7 標準中對應的方法是 `0,2,4,6,8,10,12,14,16,18,20,22`）。
> 步長也可以放在通配符後面，因此如果你想表達 “每兩小時”，就用 `*/2` 。

{{< note >}}
<!--
A question mark (`?`) in the schedule has the same meaning as an asterisk `*`, that is,
it stands for any of available value for a given field.
-->
時間表中的問號 (`?`) 和星號 `*` 含義相同，它們用來表示給定字段的任何可用值。
{{< /note >}}

<!--
Other than the standard syntax, some macros like `@monthly` can also be used:
-->
除了標準語法，還可以使用一些類似 `@monthly` 的宏：

<!-- 
| Entry 										| Description																									| Equivalent to |
| ------------- 						| ------------- 																							|-------------  |
| @yearly (or @annually)		| Run once a year at midnight of 1 January										| 0 0 1 1 * 		|
| @monthly 									| Run once a month at midnight of the first day of the month	| 0 0 1 * * 		|
| @weekly 									| Run once a week at midnight on Sunday morning								| 0 0 * * 0 		|
| @daily (or @midnight)			| Run once a day at midnight																	| 0 0 * * * 		|
| @hourly 									| Run once an hour at the beginning of the hour								| 0 * * * * 		|
-->
| 輸入                   | 描述                      | 相當於        |
| ---------------------- | ------------------------ | ------------ |
| @yearly (或 @annually) | 每年 1 月 1 日的午夜運行一次 | 0 0 1 1 *    |
| @monthly               | 每月第一天的午夜運行一次     | 0 0 1 * *    |
| @weekly                | 每週的週日午夜運行一次       | 0 0 * * 0    |
| @daily (或 @midnight)  | 每天午夜運行一次            | 0 0 * * *    |
| @hourly                | 每小時的開始一次            | 0 * * * *    |

<!--
To generate CronJob schedule expressions, you can also use web tools like [crontab.guru](https://crontab.guru/).
-->
爲了生成 CronJob 時間表的表達式，你還可以使用 [crontab.guru](https://crontab.guru/) 這類 Web 工具。

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
### 任務模板   {#job-template}

`.spec.jobTemplate`爲 CronJob 創建的 Job 定義模板，它是必需的。它和
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的語法完全一樣，
只不過它是嵌套的，沒有 `apiVersion` 和 `kind`。
你可以爲模板化的 Job 指定通用的元數據，
例如{{< glossary_tooltip text="標籤" term_id="label" >}}或{{< glossary_tooltip text="註解" term_id="annotation" >}}。
有關如何編寫一個 Job 的 `.spec`，
請參考[編寫 Job 規約](/zh-cn/docs/concepts/workloads/controllers/job/#writing-a-job-spec)。

<!--
### Deadline for delayed Job start {#starting-deadline}

The `.spec.startingDeadlineSeconds` field is optional.
This field defines a deadline (in whole seconds) for starting the Job, if that Job misses its scheduled time
for any reason.

After missing the deadline, the CronJob skips that instance of the Job (future occurrences are still scheduled).
For example, if you have a backup Job that runs twice a day, you might allow it to start up to 8 hours late,
but no later, because a backup taken any later wouldn't be useful: you would instead prefer to wait for
the next scheduled run.
-->
### Job 延遲開始的最後期限   {#starting-deadline}

`.spec.startingDeadlineSeconds` 字段是可選的。
它表示 Job 如果由於某種原因錯過了調度時間，開始該 Job 的截止時間的秒數。

過了截止時間，CronJob 就不會開始該 Job 的實例（未來的 Job 仍在調度之中）。
例如，如果你有一個每天運行兩次的備份 Job，你可能會允許它最多延遲 8 小時開始，但不能更晚，
因爲更晚進行的備份將變得沒有意義：你寧願等待下一次計劃的運行。

<!--
For Jobs that miss their configured deadline, Kubernetes treats them as failed Jobs.
If you don't specify `startingDeadlineSeconds` for a CronJob, the Job occurrences have no deadline.

If the `.spec.startingDeadlineSeconds` field is set (not null), the CronJob
controller measures the time between when a Job is expected to be created and
now. If the difference is higher than that limit, it will skip this execution.

For example, if it is set to `200`, it allows a Job to be created for up to 200
seconds after the actual schedule.
-->
對於錯過已設定的最後期限的 Job，Kubernetes 將其視爲失敗的 Job。
如果你沒有爲 CronJob 指定 `startingDeadlineSeconds`，那 Job 就沒有最後期限。

如果 `.spec.startingDeadlineSeconds` 字段被設置（非空），
CronJob 控制器將會計算從預期創建 Job 到當前時間的時間差。
如果時間差大於該限制，則跳過此次執行。

例如，如果將其設置爲 `200`，則 Job 控制器允許在實際調度之後最多 200 秒內創建 Job。

<!--
### Concurrency policy

The `.spec.concurrencyPolicy` field is also optional.
It specifies how to treat concurrent executions of a Job that is created by this CronJob.
The spec may specify only one of the following concurrency policies:
-->
### 併發性規則   {#concurrency-policy}

`.spec.concurrencyPolicy` 字段也是可選的。它聲明瞭 CronJob 創建的 Job 執行時發生重疊如何處理。
spec 僅能聲明下列規則中的一種：

<!--
* `Allow` (default): The CronJob allows concurrently running Jobs
* `Forbid`: The CronJob does not allow concurrent runs; if it is time for a new Job run and the
  previous Job run hasn't finished yet, the CronJob skips the new Job run. Also note that when the
  previous Job run finishes, `.spec.startingDeadlineSeconds` is still taken into account and may
  result in a new Job run.
* `Replace`: If it is time for a new Job run and the previous Job run hasn't finished yet, the
  CronJob replaces the currently running Job run with a new Job run
-->
* `Allow`（默認）：CronJob 允許併發 Job 執行。
* `Forbid`：CronJob 不允許併發執行；如果新 Job 的執行時間到了而老 Job 沒有執行完，CronJob 會忽略新 Job 的執行。
  另請注意，當老 Job 執行完成時，仍然會考慮 `.spec.startingDeadlineSeconds`，可能會導致新的 Job 執行。
* `Replace`：如果新 Job 的執行時間到了而老 Job 沒有執行完，CronJob 會用新 Job 替換當前正在運行的 Job。

<!--
Note that concurrency policy only applies to the Jobs created by the same CronJob.
If there are multiple CronJobs, their respective Jobs are always allowed to run concurrently.
-->
請注意，併發性規則僅適用於相同 CronJob 創建的 Job。如果有多個 CronJob，它們相應的 Job 總是允許併發執行的。

<!--
### Schedule suspension

You can suspend execution of Jobs for a CronJob, by setting the optional `.spec.suspend` field
to true. The field defaults to false.

This setting does _not_ affect Jobs that the CronJob has already started.
-->
### 調度掛起   {#schedule-suspension}

通過將可選的 `.spec.suspend` 字段設置爲 `true`，可以掛起針對 CronJob 執行的任務。

這個設置**不**會影響 CronJob 已經開始的任務。

<!--
If you do set that field to true, all subsequent executions are suspended (they remain
scheduled, but the CronJob controller does not start the Jobs to run the tasks) until
you unsuspend the CronJob.
-->
如果你將此字段設置爲 `true`，後續發生的執行都會被掛起
（這些任務仍然在調度中，但 CronJob 控制器不會啓動這些 Job 來運行任務），直到你取消掛起 CronJob 爲止。

{{< caution >}}
<!--
Executions that are suspended during their scheduled time count as missed Jobs.
When `.spec.suspend` changes from `true` to `false` on an existing CronJob without a
[starting deadline](#starting-deadline), the missed Jobs are scheduled immediately.
-->
在調度時間內掛起的執行都會被統計爲錯過的 Job。當現有的 CronJob 將 `.spec.suspend` 從 `true` 改爲 `false` 時，
且沒有[開始的最後期限](#starting-deadline)，錯過的 Job 會被立即調度。
{{< /caution >}}

<!--
### Jobs history limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields specify
how many completed and failed Jobs should be kept. Both fields are optional.

* `.spec.successfulJobsHistoryLimit`: This field specifies the number of successful finished
jobs to keep. The default value is `3`. Setting this field to `0` will not keep any successful jobs.

* `.spec.failedJobsHistoryLimit`: This field specifies the number of failed finished jobs to keep.
The default value is `1`. Setting this field to `0` will not keep any failed jobs.

For another way to clean up Jobs automatically, see
[Clean up finished Jobs automatically](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).
-->
### 任務歷史限制   {#jobs-history-limits}

`.spec.successfulJobsHistoryLimit` 和 `.spec.failedJobsHistoryLimit`
字段指定應保留多少已完成和失敗的 Job。這兩個字段都是可選的。

* `.spec.successfulJobsHistoryLimit`：此字段指定要保留多少成功完成的 Job。默認值爲 `3`。
 將此字段設置爲 `0` 意味着不會保留任何成功的 Job。

* `.spec.failedJobsHistoryLimit`：此字段指定要保留多少失敗完成的 Job。默認值爲 `1`。
 將此字段設置爲 `0` 意味着不會保留任何失敗的 Job。

有關自動清理 Job 的其他方式，
請參見[自動清理完成的 Job](/zh-cn/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)。

<!-- 
### Time zones
-->
## 時區    {#time-zones}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

<!--
For CronJobs with no time zone specified, the {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
interprets schedules relative to its local time zone.
-->
對於沒有指定時區的 CronJob，
{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
基於本地時區解釋排期表（Schedule）。

<!--
You can specify a time zone for a CronJob by setting `.spec.timeZone` to the name
of a valid [time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
For example, setting `.spec.timeZone: "Etc/UTC"` instructs Kubernetes to interpret
the schedule relative to Coordinated Universal Time.
-->
你可以通過將 `.spec.timeZone`
設置爲一個有效[時區](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)的名稱，
爲 CronJob 指定一個時區。例如設置 `.spec.timeZone: "Etc/UTC"` 將告訴
Kubernetes 基於世界標準時間解讀排期表。

<!--
A time zone database from the Go standard library is included in the binaries and used as a fallback in case an external database is not available on the system.
-->
Go 標準庫中的時區數據庫包含在二進制文件中，並用作備用數據庫，以防系統上沒有可用的外部數據庫。

<!--
## CronJob limitations {#cron-job-limitations}

### Unsupported TimeZone specification
-->
## CronJob 的限制    {#cron-job-limitations}

### 不支持的時區規範   {#unsupported-timezone-spec}

<!--
Specifying a timezone using `CRON_TZ` or `TZ` variables inside `.spec.schedule`
is **not officially supported** (and never has been). If you try to set a schedule
that includes `TZ` or `CRON_TZ` timezone specification, Kubernetes will fail to
create or update the resource with a validation error. You should specify time zones
using the [time zone field](#time-zones), instead.
-->
在 `.spec.schedule` 中通過 `CRON_TZ` 或 `TZ` 變量來指定時區**並未得到官方支持**（而且從未支持過）。
如果你嘗試設置一個包含 `TZ` 或 `CRON_TZ` 時區規範的計劃，Kubernetes
將因驗證錯誤無法創建或更新資源。
你應該使用[時區字段](#time-zones)指定時區。

<!--
### Modifying a CronJob

By design, a CronJob contains a template for _new_ Jobs.
If you modify an existing CronJob, the changes you make will apply to new Jobs that
start to run after your modification is complete. Jobs (and their Pods) that have already
started continue to run without changes.
That is, the CronJob does _not_ update existing Jobs, even if those remain running.
-->
### 修改 CronJob   {#modifying-a-cronjob}

按照設計，CronJob 包含一個用於**新** Job 的模板。
如果你修改現有的 CronJob，你所做的更改將應用於修改完成後開始運行的新任務。
已經開始的任務（及其 Pod）將繼續運行而不會發生任何變化。
也就是說，CronJob **不** 會更新現有任務，即使這些任務仍在運行。

<!--
### Job creation

A CronJob creates a Job object approximately once per execution time of its schedule.
The scheduling is approximate because there
are certain circumstances where two Jobs might be created, or no Job might be created.
Kubernetes tries to avoid those situations, but does not completely prevent them. Therefore,
the Jobs that you define should be _idempotent_.
-->
### Job 創建  {#job-creation}

CronJob 根據其計劃編排，在每次該執行任務的時候大約會創建一個 Job。
我們之所以說 "大約"，是因爲在某些情況下，可能會創建兩個 Job，或者不會創建任何 Job。
我們試圖使這些情況儘量少發生，但不能完全杜絕。因此，Job 應該是 **冪等的**。

<!--
Starting with Kubernetes v1.32, CronJobs apply an annotation
`batch.kubernetes.io/cronjob-scheduled-timestamp` to their created Jobs. This annotation
indicates the originally scheduled creation time for the Job and is formatted in RFC3339.
-->
從 Kubernetes v1.32 開始，CronJob 爲其創建的 Job 添加一個註解 `batch.kubernetes.io/cronjob-scheduled-timestamp`。
此註解表示 Job 最初計劃的創建時間，採用 RFC3339 格式。

<!--
If `startingDeadlineSeconds` is set to a large value or left unset (the default)
and if `concurrencyPolicy` is set to `Allow`, the Jobs will always run
at least once.
-->
如果 `startingDeadlineSeconds` 設置爲很大的數值或未設置（默認），並且
`concurrencyPolicy` 設置爲 `Allow`，則 Job 將始終至少運行一次。

{{< caution >}}
<!--
If `startingDeadlineSeconds` is set to a value less than 10 seconds, the CronJob may not be scheduled. This is because the CronJob controller checks things every 10 seconds.
-->
如果 `startingDeadlineSeconds` 的設置值低於 10 秒鐘，CronJob 可能無法被調度。
這是因爲 CronJob 控制器每 10 秒鐘執行一次檢查。
{{< /caution >}}

<!--
For every CronJob, the CronJob {{< glossary_tooltip term_id="controller" >}} checks how many schedules it missed in the duration from its last scheduled time until now. If there are more than 100 missed schedules, then it does not start the Job and logs the error.
-->
對於每個 CronJob，CronJob {{< glossary_tooltip term_text="控制器" term_id="controller" >}}
檢查從上一次調度的時間點到現在所錯過了調度次數。如果錯過的調度次數超過 100 次，
那麼它就不會啓動這個 Job，並記錄這個錯誤:

```
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
```

<!--
It is important to note that if the `startingDeadlineSeconds` field is set (not `nil`), the controller counts how many missed Jobs occurred from the value of `startingDeadlineSeconds` until now rather than from the last scheduled time until now. For example, if `startingDeadlineSeconds` is `200`, the controller counts how many missed Jobs occurred in the last 200 seconds.
-->
需要注意的是，如果 `startingDeadlineSeconds` 字段非空，則控制器會統計從
`startingDeadlineSeconds` 設置的值到現在而不是從上一個計劃時間到現在錯過了多少次 Job。
例如，如果 `startingDeadlineSeconds` 是 `200`，則控制器會統計在過去 200 秒中錯過了多少次 Job。

<!--
A CronJob is counted as missed if it has failed to be created at its scheduled time. For example, if `concurrencyPolicy` is set to `Forbid` and a CronJob was attempted to be scheduled when there was a previous schedule still running, then it would count as missed.
-->
如果未能在調度時間內創建 CronJob，則計爲錯過。
例如，如果 `concurrencyPolicy` 被設置爲 `Forbid`，並且當前有一個調度仍在運行的情況下，
試圖調度的 CronJob 將被計算爲錯過。

<!--
For example, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` field is not set. If the CronJob controller happens to
be down from `08:29:00` to `10:21:00`, the Job will not start as the number of missed Jobs which missed their schedule is greater than 100.
-->
例如，假設一個 CronJob 被設置爲從 `08:30:00` 開始每隔一分鐘創建一個新的 Job，
並且它的 `startingDeadlineSeconds` 字段未被設置。如果 CronJob 控制器從
`08:29:00` 到 `10:21:00` 終止運行，則該 Job 將不會啓動，
因爲其錯過的調度次數超過了 100。

<!--
To illustrate this concept further, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` is set to 200 seconds. If the CronJob controller happens to
be down for the same period as the previous example (`08:29:00` to `10:21:00`,) the Job will still start at 10:22:00. This happens as the controller now checks how many missed schedules happened in the last 200 seconds (i.e., 3 missed schedules), rather than from the last scheduled time until now.
-->
爲了進一步闡述這個概念，假設將 CronJob 設置爲從 `08:30:00` 開始每隔一分鐘創建一個新的 Job，
並將其 `startingDeadlineSeconds` 字段設置爲 200 秒。
如果 CronJob 控制器恰好在與上一個示例相同的時間段（`08:29:00` 到 `10:21:00`）終止運行，
則 Job 仍將從 `10:22:00` 開始。
造成這種情況的原因是控制器現在檢查在最近 200 秒（即 3 個錯過的調度）中發生了多少次錯過的
Job 調度，而不是從現在爲止的最後一個調度時間開始。

<!--
The CronJob is only responsible for creating Jobs that match its schedule, and
the Job in turn is responsible for the management of the Pods it represents.
-->
CronJob 僅負責創建與其調度時間相匹配的 Job，而 Job 又負責管理其代表的 Pod。

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
* 瞭解 CronJob 所依賴的 [Pod](/zh-cn/docs/concepts/workloads/pods/) 與
  [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的概念。
* 閱讀 CronJob `.spec.schedule` 字段的詳細[格式](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON_Expression_Format)。
* 有關創建和使用 CronJob 的說明及 CronJob 清單的示例，
  請參見[使用 CronJob 運行自動化任務](/zh-cn/docs/tasks/job/automated-tasks-with-cron-jobs/)。
* `CronJob` 是 Kubernetes REST API 的一部分，
  閱讀 {{< api-reference page="workload-resources/cron-job-v1" >}} API 參考瞭解更多細節。
