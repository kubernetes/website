---
title: 週期排程任務（CronJob）
id: cronjob
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/cron-jobs/
short_description: >
  週期排程的任務（作業）。

aka: 
tags:
- core-object
- workload
---

<!--
---
title: CronJob
id: cronjob
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/cron-jobs/
short_description: >
  A repeating task (a Job) that runs on a regular schedule.

aka: 
tags:
- core-object
- workload
---
-->

<!--
 Manages a [Job](/docs/concepts/workloads/controllers/job/) that runs on a periodic schedule.
-->

 管理定期執行的 [任務](/zh-cn/docs/concepts/workloads/controllers/job/)。

<!--more--> 

<!--
Similar to a line in a *crontab* file, a Cronjob object specifies a schedule using the [Cron](https://en.wikipedia.org/wiki/Cron) format.
-->

Cronjob 物件類似 *crontab* 檔案中的一行命令，它聲明瞭一個遵循 [Cron](https://en.wikipedia.org/wiki/Cron) 格式的排程任務。
