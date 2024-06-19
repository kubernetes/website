---
title: CronJob
id: cronjob
date: 2018-04-12
full_link: /ja/docs/concepts/workloads/controllers/cron-jobs/
short_description: >
  定期的なスケジュールで繰り返し実行されるタスク(ジョブ)


aka: 
tags:
- core-object
- workload
---
定期的なスケジュールで実行される[ジョブ](/ja/docs/concepts/workloads/controllers/job/)を管理します。

<!--more-->

*crontab*ファイルのようにCronJobオブジェクトは[cron](https://ja.wikipedia.org/wiki/Cron)フォーマットを利用しスケジュールを定義できます。