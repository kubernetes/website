---
title: 週期調度任務（CronJob）
id: cronjob
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/cron-jobs/
short_description: >
  週期調度的任務（作業）。

aka: 
tags:
- core-object
- workload
---
<!--
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
-->

<!--
 Manages a [Job](/docs/concepts/workloads/controllers/job/) that runs on a periodic schedule.
-->
管理定期運行的[任務](/zh-cn/docs/concepts/workloads/controllers/job/)。

<!--more--> 

<!--
Similar to a line in a *crontab* file, a CronJob object specifies a schedule using the [cron](https://en.wikipedia.org/wiki/Cron) format.
-->
與 **crontab** 文件中的一行命令類似，週期調度任務（CronJob）對象使用
[cron](https://zh.wikipedia.org/wiki/Cron) 格式設置排期表。
