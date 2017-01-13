

-----------
# CronJobStatus v2alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v2alpha1 | CronJobStatus







CronJobStatus represents the current state of a cron job.

<aside class="notice">
Appears In <a href="#cronjob-v2alpha1">CronJob</a> </aside>

Field        | Description
------------ | -----------
active <br /> *[ObjectReference](#objectreference-v1) array*  | Active holds pointers to currently running jobs.
lastScheduleTime <br /> *[Time](#time-unversioned)*  | LastScheduleTime keeps information of when was the last time the job was successfully scheduled.






