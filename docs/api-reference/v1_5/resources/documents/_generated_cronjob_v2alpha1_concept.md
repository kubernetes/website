

-----------
# CronJob v2alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v2alpha1 | CronJob

<aside class="warning">Alpha objects should not be used in production and may not be compatible with future versions of the resource type.</aside>





CronJob represents the configuration of a single cron job.

<aside class="notice">
Appears In <a href="#cronjoblist-v2alpha1">CronJobList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[CronJobSpec](#cronjobspec-v2alpha1)*  | Spec is a structure defining the expected behavior of a job, including the schedule. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[CronJobStatus](#cronjobstatus-v2alpha1)*  | Status is a structure describing current status of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### CronJobSpec v2alpha1

<aside class="notice">
Appears In <a href="#cronjob-v2alpha1">CronJob</a> </aside>

Field        | Description
------------ | -----------
concurrencyPolicy <br /> *string*  | ConcurrencyPolicy specifies how to treat concurrent executions of a Job.
jobTemplate <br /> *[JobTemplateSpec](#jobtemplatespec-v2alpha1)*  | JobTemplate is the object that describes the job that will be created when executing a CronJob.
schedule <br /> *string*  | Schedule contains the schedule in Cron format, see https://en.wikipedia.org/wiki/Cron.
startingDeadlineSeconds <br /> *integer*  | Optional deadline in seconds for starting the job if it misses scheduled time for any reason.  Missed jobs executions will be counted as failed ones.
suspend <br /> *boolean*  | Suspend flag tells the controller to suspend subsequent executions, it does not apply to already started executions.  Defaults to false.

### CronJobStatus v2alpha1

<aside class="notice">
Appears In <a href="#cronjob-v2alpha1">CronJob</a> </aside>

Field        | Description
------------ | -----------
active <br /> *[ObjectReference](#objectreference-v1) array*  | Active holds pointers to currently running jobs.
lastScheduleTime <br /> *[Time](#time-unversioned)*  | LastScheduleTime keeps information of when was the last time the job was successfully scheduled.

### CronJobList v2alpha1



Field        | Description
------------ | -----------
items <br /> *[CronJob](#cronjob-v2alpha1) array*  | Items is the list of CronJob.
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata





