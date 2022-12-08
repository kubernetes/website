---
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

A _CronJob_ creates {{< glossary_tooltip term_id="job" text="Jobs" >}} on a repeating schedule.

CronJob is meant for performing regular scheduled actions such as backups, report generation, 
and so on. One CronJob object is like one line of a _crontab_ (cron table) file on a 
Unix system. It runs a job periodically on a given schedule, written in 
[Cron](https://en.wikipedia.org/wiki/Cron) format.

CronJobs have limitations and idiosyncrasies.
For example, in certain circumstances, a single cron job can create multiple jobs. See the [limitations](#cron-job-limitations) below.

When the control plane creates new Jobs and (indirectly) Pods for a CronJob, the `.metadata.name`
of the CronJob is part of the basis for naming those Pods.  The name of a CronJob must be a valid
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
value, but this can produce unexpected results for the Pod hostnames.  For best compatibility,
the name should follow the more restrictive rules for a
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).
Even when the name is a DNS subdomain, the name must be no longer than 52
characters.  This is because the CronJob controller will automatically append
11 characters to the name you provide and there is a constraint that the
length of a Job name is no more than 63 characters.

<!-- body -->
## Example

This example CronJob manifest prints the current time and a hello message every minute:

{{< codenew file="application/job/cronjob.yaml" >}}

([Running Automated Tasks with a CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)
takes you through this example in more detail).

## Writing a CronJob spec
### Schedule
The `.spec.schedule` is a required field and follows the [Cron](https://en.wikipedia.org/wiki/Cron) syntax below:

```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │                                   7 is also Sunday on some systems)
# │ │ │ │ │                                   OR sun, mon, tue, wed, thu, fri, sat
# │ │ │ │ │
# * * * * *
```

For example, `0 0 13 * 5` states that the task must be started every Friday at midnight, as well as on the 13th of each month at midnight.

The format also includes extended "Vixie cron" step values. As explained in the
[FreeBSD manual](https://www.freebsd.org/cgi/man.cgi?crontab%285%29):

> Step values can be used in conjunction with ranges. Following a range
> with `/<number>` specifies skips of the number's value through the
> range. For example, `0-23/2` can be used in the hours field to specify
> command execution every other hour (the alternative in the V7 standard is
> `0,2,4,6,8,10,12,14,16,18,20,22`). Steps are also permitted after an
> asterisk, so if you want to say "every two hours", just use `*/2`.

{{< note >}}
A question mark (`?`) in the schedule has the same meaning as an asterisk `*`, that is,
it stands for any of available value for a given field.
{{< /note >}}

Other than the standard syntax, some macros like `@monthly` can also be used:

| Entry 										| Description																									| Equivalent to |
| ------------- 						| ------------- 																							|-------------  |
| @yearly (or @annually)		| Run once a year at midnight of 1 January										| 0 0 1 1 * 		|
| @monthly 									| Run once a month at midnight of the first day of the month	| 0 0 1 * * 		|
| @weekly 									| Run once a week at midnight on Sunday morning								| 0 0 * * 0 		|
| @daily (or @midnight)			| Run once a day at midnight																	| 0 0 * * * 		|
| @hourly 									| Run once an hour at the beginning of the hour								| 0 * * * * 		|

To generate CronJob schedule expressions, you can also use web tools like [crontab.guru](https://crontab.guru/).

### Job Template

The `.spec.jobTemplate` is the template for the job, and it is required.
It has exactly the same schema as a [Job](/docs/concepts/workloads/controllers/job/), except that
it is nested and does not have an `apiVersion` or `kind`.
For information about writing a job `.spec`, see [Writing a Job Spec](/docs/concepts/workloads/controllers/job/#writing-a-job-spec).

### Starting Deadline

The `.spec.startingDeadlineSeconds` field is optional.
It stands for the deadline in seconds for starting the job if it misses its scheduled time for any reason.
After the deadline, the CronJob does not start the job.
Jobs that do not meet their deadline in this way count as failed jobs.
If this field is not specified, the jobs have no deadline.

If the `.spec.startingDeadlineSeconds` field is set (not null), the CronJob
controller measures the time between when a job is expected to be created and
now. If the difference is higher than that limit, it will skip this execution.

For example, if it is set to `200`, it allows a job to be created for up to 200
seconds after the actual schedule.

### Concurrency Policy

The `.spec.concurrencyPolicy` field is also optional.
It specifies how to treat concurrent executions of a job that is created by this CronJob.
The spec may specify only one of the following concurrency policies:

* `Allow` (default): The CronJob allows concurrently running jobs
* `Forbid`: The CronJob does not allow concurrent runs; if it is time for a new job run and the
  previous job run hasn't finished yet, the CronJob skips the new job run
* `Replace`: If it is time for a new job run and the previous job run hasn't finished yet, the
  CronJob replaces the currently running job run with a new job run

Note that concurrency policy only applies to the jobs created by the same cron job.
If there are multiple CronJobs, their respective jobs are always allowed to run concurrently.

### Suspend

The `.spec.suspend` field is also optional.
If it is set to `true`, all subsequent executions are suspended.
This setting does not apply to already started executions.
Defaults to false.

{{< caution >}}
Executions that are suspended during their scheduled time count as missed jobs.
When `.spec.suspend` changes from `true` to `false` on an existing CronJob without a
[starting deadline](#starting-deadline), the missed jobs are scheduled immediately.
{{< /caution >}}

### Jobs History Limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields are optional.
These fields specify how many completed and failed jobs should be kept.
By default, they are set to 3 and 1 respectively.  Setting a limit to `0` corresponds to keeping
none of the corresponding kind of jobs after they finish.

For another way to clean up jobs automatically, see [Clean up finished jobs automatically](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).

### Time zones

For CronJobs with no time zone specified, the {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}} interprets schedules relative to its local time zone.

{{< feature-state for_k8s_version="v1.25" state="beta" >}}

If you enable the  `CronJobTimeZone` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
you can specify a time zone for a CronJob (if you don't enable that feature gate, or if you are using a version of
Kubernetes that does not have experimental time zone support, all CronJobs in your cluster have an unspecified
timezone).

When you have the feature enabled, you can set `.spec.timeZone` to the name of a valid [time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). For example, setting
`.spec.timeZone: "Etc/UTC"` instructs Kubernetes to interpret the schedule relative to Coordinated Universal Time.

{{< caution >}}
Historically you may set the `.spec.schedule` field to a timezone like `CRON_TZ=UTC * * * * *` or
`TZ=UTC * * * * *`. This way is not recommended any more and you should consider use the
`.spec.timeZone` field as described above.
{{< /caution >}}

A time zone database from the Go standard library is included in the binaries and used as a fallback in case an external database is not available on the system.

## CronJob limitations {#cron-job-limitations}

### Modifying a CronJob
If you modify a CronJob, the changes you make will apply to new jobs that start to run after your modification
is complete. Jobs (and their Pods) that have already started continue to run without changes.
That is, the CronJob does _not_ update existing jobs, even if those remain running.

### Job creation

A CronJob creates a job object _about_ once per execution time of its schedule. We say "about" because there
are certain circumstances where two jobs might be created, or no job might be created. We attempt to make these rare,
but do not completely prevent them. Therefore, jobs should be _idempotent_.

If `startingDeadlineSeconds` is set to a large value or left unset (the default)
and if `concurrencyPolicy` is set to `Allow`, the jobs will always run
at least once.

{{< caution >}}
If `startingDeadlineSeconds` is set to a value less than 10 seconds, the CronJob may not be scheduled. This is because the CronJob controller checks things every 10 seconds.
{{< /caution >}}


For every CronJob, the CronJob {{< glossary_tooltip term_id="controller" >}} checks how many schedules it missed in the duration from its last scheduled time until now. If there are more than 100 missed schedules, then it does not start the job and logs the error.

```
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
```

It is important to note that if the `startingDeadlineSeconds` field is set (not `nil`), the controller counts how many missed jobs occurred from the value of `startingDeadlineSeconds` until now rather than from the last scheduled time until now. For example, if `startingDeadlineSeconds` is `200`, the controller counts how many missed jobs occurred in the last 200 seconds.

A CronJob is counted as missed if it has failed to be created at its scheduled time. For example, if `concurrencyPolicy` is set to `Forbid` and a CronJob was attempted to be scheduled when there was a previous schedule still running, then it would count as missed.

For example, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` field is not set. If the CronJob controller happens to
be down from `08:29:00` to `10:21:00`, the job will not start as the number of missed jobs which missed their schedule is greater than 100.

To illustrate this concept further, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` is set to 200 seconds. If the CronJob controller happens to
be down for the same period as the previous example (`08:29:00` to `10:21:00`,) the Job will still start at 10:22:00. This happens as the controller now checks how many missed schedules happened in the last 200 seconds (i.e., 3 missed schedules), rather than from the last scheduled time until now.

The CronJob is only responsible for creating Jobs that match its schedule, and
the Job in turn is responsible for the management of the Pods it represents.

## {{% heading "whatsnext" %}}

* Learn about [Pods](/docs/concepts/workloads/pods/) and
  [Jobs](/docs/concepts/workloads/controllers/job/), two concepts
  that CronJobs rely upon.
* Read about the detailed [format](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON_Expression_Format)
  of CronJob `.spec.schedule` fields.
* For instructions on creating and working with CronJobs, and for an example
  of a CronJob manifest,
  see [Running automated tasks with CronJobs](/docs/tasks/job/automated-tasks-with-cron-jobs/).
* `CronJob` is part of the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/cron-job-v1" >}}
  reference doc for more details.
