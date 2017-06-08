## CronJobSpec v2alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v2alpha1 | CronJobSpec



CronJobSpec describes how the job execution will look like and when it will actually run.

<aside class="notice">
Appears In  <a href="#cronjob-v2alpha1">CronJob</a> </aside>

Field        | Description
------------ | -----------
concurrencyPolicy <br /> *string*  | ConcurrencyPolicy specifies how to treat concurrent executions of a Job.
jobTemplate <br /> *[JobTemplateSpec](#jobtemplatespec-v2alpha1)*  | JobTemplate is the object that describes the job that will be created when executing a CronJob.
schedule <br /> *string*  | Schedule contains the schedule in Cron format, see https://en.wikipedia.org/wiki/Cron.
startingDeadlineSeconds <br /> *integer*  | Optional deadline in seconds for starting the job if it misses scheduled time for any reason.  Missed jobs executions will be counted as failed ones.
suspend <br /> *boolean*  | Suspend flag tells the controller to suspend subsequent executions, it does not apply to already started executions.  Defaults to false.

