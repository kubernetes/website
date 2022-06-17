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

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
A _CronJob_ creates {{< glossary_tooltip term_id="job" text="Jobs" >}} on a repeating schedule.

One CronJob object is like one line of a _crontab_ (cron table) file. It runs a job periodically
on a given schedule, written in [Cron](https://en.wikipedia.org/wiki/Cron) format.
-->
_CronJob_ 建立基於時隔重複排程的 {{< glossary_tooltip term_id="job" text="Jobs" >}}。

一個 CronJob 物件就像 _crontab_ (cron table) 檔案中的一行。
它用 [Cron](https://en.wikipedia.org/wiki/Cron) 格式進行編寫，
並週期性地在給定的排程時間執行 Job。

<!--
All **CronJob** `schedule:` times are based on the timezone of the

If your control plane runs the kube-controller-manager in Pods or bare
containers, the timezone set for the kube-controller-manager container determines the timezone
that the cron job controller uses.
-->

{{< caution >}}
所有 **CronJob** 的 `schedule:` 時間都是基於
{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}.
的時區。

如果你的控制平面在 Pod 或是裸容器中運行了 kube-controller-manager，
那麼為該容器所設定的時區將會決定 Cron Job 的控制器所使用的時區。
{{< /caution >}}

<!--
The [v1 CronJob API](/docs/reference/kubernetes-api/workload-resources/cron-job-v1/)
does not officially support setting timezone as explained above.

Setting variables such as `CRON_TZ` or `TZ` is not officially supported by the Kubernetes project.
`CRON_TZ` or `TZ` is an implementation detail of the internal library being used
for parsing and calculating the next Job creation time. Any usage of it is not
recommended in a production cluster.
-->

{{< caution >}}
如 [v1 CronJob API](/zh-cn/docs/reference/kubernetes-api/workload-resources/cron-job-v1/) 所述，官方並不支援設定時區。

Kubernetes 專案官方並不支援設定如 `CRON_TZ` 或者 `TZ` 等變數。
`CRON_TZ` 或者 `TZ` 是用於解析和計算下一個 Job 建立時間所使用的內部庫中一個實現細節。
不建議在生產叢集中使用它。
{{< /caution>}}

<!--
When creating the manifest for a CronJob resource, make sure the name you provide
is a valid [DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
The name must be no longer than 52 characters. This is because the CronJob controller will automatically
append 11 characters to the job name provided and there is a constraint that the
maximum length of a Job name is no more than 63 characters.
-->
為 CronJob 資源建立清單時，請確保所提供的名稱是一個合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
名稱不能超過 52 個字元。
這是因為 CronJob 控制器將自動在提供的 Job 名稱後附加 11 個字元，並且存在一個限制，
即 Job 名稱的最大長度不能超過 63 個字元。

<!-- body -->

<!--
## CronJob

CronJobs are meant for performing regular scheduled actions such as backups,
report generation, and so on. Each of those tasks should be configured to recur
indefinitely (for example: once a day / week / month); you can define the point
in time within that interval when the job should start.
-->
## CronJob


CronJob 用於執行週期性的動作，例如備份、報告生成等。
這些任務中的每一個都應該配置為週期性重複的（例如：每天/每週/每月一次）；
你可以定義任務開始執行的時間間隔。

<!--
### Example

This example CronJob manifest prints the current time and a hello message every minute:
-->
### 示例

下面的 CronJob 示例清單會在每分鐘打印出當前時間和問候訊息：

{{< codenew file="application/job/cronjob.yaml" >}}

[使用 CronJob 執行自動化任務](/zh-cn/docs/tasks/job/automated-tasks-with-cron-jobs/)
一文會為你詳細講解此例。

<!--
### Cron schedule syntax
-->
### Cron 時間表語法

```
# ┌───────────── 分鐘 (0 - 59)
# │ ┌───────────── 小時 (0 - 23)
# │ │ ┌───────────── 月的某天 (1 - 31)
# │ │ │ ┌───────────── 月份 (1 - 12)
# │ │ │ │ ┌───────────── 周的某天 (0 - 6)（週日到週一；在某些系統上，7 也是星期日）
# │ │ │ │ │                          或者是 sun，mon，tue，web，thu，fri，sat
# │ │ │ │ │
# │ │ │ │ │
# * * * * *
```

<!-- 
| Entry 	| Description   | Equivalent to |
| ------------- | ------------- |-------------  |
| @yearly (or @annually) | Run once a year at midnight of 1 January | 0 0 1 1 * |
| @monthly               | Run once a month at midnight of the first day of the month | 0 0 1 * * |
| @weekly                | Run once a week at midnight on Sunday morning | 0 0 * * 0 |
| @daily (or @midnight)  | Run once a day at midnight | 0 0 * * * |
| @hourly                | Run once an hour at the beginning of the hour | 0 * * * * |
-->
| 輸入                      | 描述                          | 相當於         |
| -------------             | -------------                 |-------------   |
| @yearly (or @annually)    | 每年 1 月 1 日的午夜執行一次  | 0 0 1 1 *      |
| @monthly                  | 每月第一天的午夜執行一次      | 0 0 1 * *      |
| @weekly                   | 每週的週日午夜執行一次        | 0 0 * * 0      |
| @daily (or @midnight)     | 每天午夜執行一次              | 0 0 * * *      |
| @hourly                   | 每小時的開始一次              | 0 * * * *      |

<!--  
For example, the line below states that the task must be started every Friday at midnight, as well as on the 13th of each month at midnight:
-->
例如，下面這行指出必須在每個星期五的午夜以及每個月 13 號的午夜開始任務：

`0 0 13 * 5`

<!--  
To generate CronJob schedule expressions, you can also use web tools like [crontab.guru](https://crontab.guru/).
-->
要生成 CronJob 時間表表示式，你還可以使用 [crontab.guru](https://crontab.guru/) 之類的 Web 工具。

<!-- 
## Time zones
For CronJobs with no time zone specified, the kube-controller-manager interprets schedules relative to its local time zone.

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

If you enable the  `CronJobTimeZone` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
you can specify a time zone for a CronJob (if you don't enable that feature gate, or if you are using a version of
Kubernetes that does not have experimental time zone support, all CronJobs in your cluster have an unspecified
timezone).

When you have the feature enabled, you can set `spec.timeZone` to the name of a valid [time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) name. For example, setting
`spec.timeZone: "Etc/UTC"` instructs Kubernetes to interpret the schedule relative to Coordinated Universal Time.

A time zone database from the Go standard library is included in the binaries and used as a fallback in case an external database is not available on the system.
-->

## 時區 {#time-zones}
對於沒有指定時區的 CronJob，kube-controller-manager 基於本地時區解釋排期表（Schedule）。

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

如果啟用了 `CronJobTimeZone` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
你可以為 CronJob 指定一個時區（如果你沒有啟用該特性門控，或者你使用的是不支援試驗性時區功能的
Kubernetes 版本，叢集中所有 CronJob 的時區都是未指定的）。

啟用該特性後，你可以將 `spec.timeZone`
設定為有效[時區](https://zh.wikipedia.org/zh-hant/%E6%97%B6%E5%8C%BA%E4%BF%A1%E6%81%AF%E6%95%B0%E6%8D%AE%E5%BA%93s)名稱。 
例如，設定 `spec.timeZone: "Etc/UTC"` 指示 Kubernetes 採用 UTC 來解釋排期表。

Go 標準庫中的時區資料庫包含在二進位制檔案中，並用作備用資料庫，以防系統上沒有可用的外部資料庫。


<!--
## Time zones
For CronJobs with no time zone specified, the kube-controller-manager interprets schedules relative to its local time zone.
-->
## 時區  {#time-zones}
對於沒有指定時區的 CronJob，kube-controller-manager 會根據其本地時區來解釋其排期表（schedule）。

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

<!--
If you enable the  `CronJobTimeZone` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
you can specify a time zone for a CronJob (if you don't enable that feature gate, or if you are using a version of
Kubernetes that does not have experimental time zone support, all CronJobs in your cluster have an unspecified
timezone).
-->
如果啟用 `CronJobTimeZone` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
你可以為 CronJob 指定時區（如果你不啟用該特性門控，或者如果你使用的 Kubernetes 版本不支援實驗中的時區特性，
則叢集中的所有 CronJob 都屬於未指定時區）。

<!--
When you have the feature enabled, you can set `spec.timeZone` to the name of a valid [time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) name. For example, setting
`spec.timeZone: "Etc/UTC"` instructs Kubernetes to interpret the schedule relative to Coordinated Universal Time.

A time zone database from the Go standard library is included in the binaries and used as a fallback in case an external database is not available on the system.
-->
當你啟用該特性時，你可以將 `spec.timeZone` 設定為有效的[時區](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)名稱。
例如，設定 `spec.timeZone: "Etc/UTC"` 表示 Kubernetes
使用協調世界時（Coordinated Universal Time）進行解釋排期表。

Go 標準庫中的時區資料庫包含在二進位制檔案中，並用作備用資料庫，以防系統上沒有外部資料庫可用。
<!--
## CronJob Limitations

A cron job creates a job object _about_ once per execution time of its schedule. We say "about" because there
are certain circumstances where two jobs might be created, or no job might be created. We attempt to make these rare,
but do not completely prevent them. Therefore, jobs should be _idempotent_.
-->
## CronJob 限制  {#cron-job-limitations}

CronJob 根據其計劃編排，在每次該執行任務的時候大約會建立一個 Job。
我們之所以說 "大約"，是因為在某些情況下，可能會建立兩個 Job，或者不會建立任何 Job。
我們試圖使這些情況儘量少發生，但不能完全杜絕。因此，Job 應該是 _冪等的_。

<!--
If `startingDeadlineSeconds` is set to a large value or left unset (the default)
and if `concurrencyPolicy` is set to `Allow`, the jobs will always run
at least once.
-->
如果 `startingDeadlineSeconds` 設定為很大的數值或未設定（預設），並且
`concurrencyPolicy` 設定為 `Allow`，則作業將始終至少執行一次。

{{< caution >}}
<!--
If `startingDeadlineSeconds` is set to a value less than 10 seconds, the CronJob may not be scheduled. This is because the CronJob controller checks things every 10 seconds.
-->
如果 `startingDeadlineSeconds` 的設定值低於 10 秒鐘，CronJob 可能無法被排程。
這是因為 CronJob 控制器每 10 秒鐘執行一次檢查。
{{< /caution >}}

<!--
For every CronJob, the CronJob {{< glossary_tooltip term_id="controller" >}} checks how many schedules it missed in the duration from its last scheduled time until now. If there are more than 100 missed schedules, then it does not start the job and logs the error
-->
對於每個 CronJob，CronJob {{< glossary_tooltip term_text="控制器" term_id="controller" >}}
檢查從上一次排程的時間點到現在所錯過了排程次數。如果錯過的排程次數超過 100 次，
那麼它就不會啟動這個任務，並記錄這個錯誤:

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
````

<!--
It is important to note that if the `startingDeadlineSeconds` field is set (not `nil`), the controller counts how many missed jobs occurred from the value of `startingDeadlineSeconds` until now rather than from the last scheduled time until now. For example, if `startingDeadlineSeconds` is `200`, the controller counts how many missed jobs occurred in the last 200 seconds.
-->
需要注意的是，如果 `startingDeadlineSeconds` 欄位非空，則控制器會統計從
`startingDeadlineSeconds` 設定的值到現在而不是從上一個計劃時間到現在錯過了多少次 Job。
例如，如果 `startingDeadlineSeconds` 是 `200`，則控制器會統計在過去 200 秒中錯過了多少次 Job。

<!--
A CronJob is counted as missed if it has failed to be created at its scheduled time. For example, If `concurrencyPolicy` is set to `Forbid` and a CronJob was attempted to be scheduled when there was a previous schedule still running, then it would count as missed.
-->
如果未能在排程時間內建立 CronJob，則計為錯過。
例如，如果 `concurrencyPolicy` 被設定為 `Forbid`，並且當前有一個排程仍在執行的情況下，
試圖排程的 CronJob 將被計算為錯過。

<!--
For example, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` field is not set. If the CronJob controller happens to
be down from `08:29:00` to `10:21:00`, the job will not start as the number of missed jobs which missed their schedule is greater than 100.
-->
例如，假設一個 CronJob 被設定為從 `08:30:00` 開始每隔一分鐘建立一個新的 Job，
並且它的 `startingDeadlineSeconds` 欄位未被設定。如果 CronJob 控制器從
`08:29:00` 到 `10:21:00` 終止執行，則該 Job 將不會啟動，因為其錯過的排程
次數超過了 100。

<!--
To illustrate this concept further, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` is set to 200 seconds. If the CronJob controller happens to
be down for the same period as the previous example (`08:29:00` to `10:21:00`,) the Job will still start at 10:22:00. This happens as the controller now checks how many missed schedules happened in the last 200 seconds (ie, 3 missed schedules), rather than from the last scheduled time until now.
-->
為了進一步闡述這個概念，假設將 CronJob 設定為從 `08:30:00` 開始每隔一分鐘建立一個新的 Job，
並將其 `startingDeadlineSeconds` 欄位設定為 200 秒。 
如果 CronJob 控制器恰好在與上一個示例相同的時間段（`08:29:00` 到 `10:21:00`）終止執行，
則 Job 仍將從 `10:22:00` 開始。
造成這種情況的原因是控制器現在檢查在最近 200 秒（即 3 個錯過的排程）中發生了多少次錯過的
Job 排程，而不是從現在為止的最後一個排程時間開始。

<!--
The CronJob is only responsible for creating Jobs that match its schedule, and
the Job in turn is responsible for the management of the Pods it represents.
-->
CronJob 僅負責建立與其排程時間相匹配的 Job，而 Job 又負責管理其代表的 Pod。

<!--
## Controller version {#new-controller}

Starting with Kubernetes v1.21 the second version of the CronJob controller
is the default implementation. To disable the default CronJob controller
and use the original CronJob controller instead, one pass the `CronJobControllerV2`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
flag to the {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}},
and set this flag to `false`. For example:
-->
## 控制器版本   {#new-controller}

從 Kubernetes v1.21 版本開始，CronJob 控制器的第二個版本被用作預設實現。
要禁用此預設 CronJob 控制器而使用原來的 CronJob 控制器，請在
{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
中設定[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
`CronJobControllerV2`，將此標誌設定為 `false`。例如：

```
--feature-gates="CronJobControllerV2=false"
```

## {{% heading "whatsnext" %}}
<!--
* Learn about [Pods](/docs/concepts/workloads/pods/) and
  [Jobs](/docs/concepts/workloads/controllers/job/), two concepts
  that CronJobs rely upon.
* Read about the [format](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON_Expression_Format)
  of CronJob `.spec.schedule` fields.
* For instructions on creating and working with CronJobs, and for an example
  of a CronJob manifest,
  see [Running automated tasks with CronJobs](/docs/tasks/job/automated-tasks-with-cron-jobs/).
* For instructions to clean up failed or completed jobs automatically,
  see [Clean up Jobs automatically](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)
* `CronJob` is part of the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/cron-job-v1" >}}
  object definition to understand the API for Kubernetes cron jobs.
-->

* 瞭解 CronJob 所依賴的 [Pods](/zh-cn/docs/concepts/workloads/pods/) 與 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的概念。
* 閱讀 CronJob `.spec.schedule` 欄位的[格式](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON_Expression_Format)。
* 有關建立和使用 CronJob 的說明及示例規約檔案，請參見
  [使用 CronJob 執行自動化任務](/zh-cn/docs/tasks/job/automated-tasks-with-cron-jobs/)。
* 有關自動清理失敗或完成作業的說明，請參閱[自動清理作業](/zh-cn/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)
* `CronJob` 是 Kubernetes REST API 的一部分，
   閱讀 {{< api-reference page="workload-resources/cron-job-v1" >}}
   物件定義以瞭解關於該資源的 API。
