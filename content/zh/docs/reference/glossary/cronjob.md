---
title: 周期调度任务（CronJob）
id: cronjob
date: 2018-04-12
full_link: /zh/docs/concepts/workloads/controllers/cron-jobs/
short_description: >
  周期调度的任务（作业）。

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

 管理定期运行的 [任务](/zh/docs/concepts/workloads/controllers/job/)。

<!--more--> 

<!--
Similar to a line in a *crontab* file, a Cronjob object specifies a schedule using the [Cron](https://en.wikipedia.org/wiki/Cron) format.
-->

Cronjob 对象类似 *crontab* 文件中的一行命令，它声明了一个遵循 [Cron](https://en.wikipedia.org/wiki/Cron) 格式的调度任务。
