## CronJob v2alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
Batch | v2alpha1 | CronJob



CronJob represents the configuration of a single cron job.

<aside class="notice">
Appears In  <a href="#cronjoblist-v2alpha1">CronJobList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[CronJobSpec](#cronjobspec-v2alpha1)*  | Spec is a structure defining the expected behavior of a job, including the schedule. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[CronJobStatus](#cronjobstatus-v2alpha1)*  | Status is a structure describing current status of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

