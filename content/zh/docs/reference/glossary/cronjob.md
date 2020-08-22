---
title: CronJob
id: cronjob
date: 2018-04-12
full_link: /zh/docs/concepts/workloads/controllers/cron-jobs/
short_description: >
  管理定期运行的 [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)。

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
full_link: /zh/docs/concepts/workloads/controllers/cron-jobs/
short_description: >
  Manages a [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/) that runs on a periodic schedule.

aka: 
tags:
- core-object
- workload
---
-->

<!--
 Manages a [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/) that runs on a periodic schedule.
-->

 管理定期运行的 [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)。

<!--more--> 

<!--
Similar to a line in a *crontab* file, a Cronjob object specifies a schedule using the [Cron](https://en.wikipedia.org/wiki/Cron) format.
-->

Cronjob 对象类似 *crontab* 文件中的一行命令，它声明了一个遵循 [Cron](https://en.wikipedia.org/wiki/Cron) 格式的调度任务。
