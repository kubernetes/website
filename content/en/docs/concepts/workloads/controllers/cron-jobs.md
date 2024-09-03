---
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
api_metadata:
- apiVersion: "batch/v1"
  kind: "CronJob"
content_type: concept
description: >-
  A CronJob starts one-time Jobs on a repeating schedule.
weight: 80
hide_summary: true # Listed separately in section index
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

A _CronJob_ creates {{< glossary_tooltip term_id="job" text="Jobs" >}} on a repeating schedule.

CronJob is meant for performing regular scheduled actions such as backups, report generation,
and so on. One CronJob object is like one line of a _crontab_ (cron table) file on a
Unix system. It runs a Job periodically on a given schedule, written in
[Cron](https://en.wikipedia.org/wiki/Cron) format.

CronJobs have limitations and idiosyncrasies.
For example, in certain circumstances, a single CronJob can create multiple concurrent Jobs. See the [limitations](#cron-job-limitations) below.

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

{{% code_sample file="application/job/cronjob.yaml" %}}

([Running Automated Tasks with a CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)
takes you through this example in more detail).

## Writing a CronJob spec
### Schedule syntax
The `.spec.schedule` field is required. The value of that field follows the [Cron](https://en.wikipedia.org/wiki/Cron) syntax:

```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
# │ │ │ │ │                                   OR sun, mon, tue, wed, thu, fri, sat
# │ │ │ │ │ 
# │ │ │ │ │
# * * * * *
```

For example, `0 3 * * 1` means this task is scheduled to run weekly on a Monday at 3 AM.

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

### Job template

The `.spec.jobTemplate` defines a template for the Jobs that the CronJob creates, and it is required.
It has exactly the same schema as a [Job](/docs/concepts/workloads/controllers/job/), except that
it is nested and does not have an `apiVersion` or `kind`.
You can specify common metadata for the templated Jobs, such as
{{< glossary_tooltip text="labels" term_id="label" >}} or
{{< glossary_tooltip text="annotations" term_id="annotation" >}}.
For information about writing a Job `.spec`, see [Writing a Job Spec](/docs/concepts/workloads/controllers/job/#writing-a-job-spec).

### Deadline for delayed Job start {#starting-deadline}

The `.spec.startingDeadlineSeconds` field is optional.
This field defines a deadline (in whole seconds) for starting the Job, if that Job misses its scheduled time
for any reason.

After missing the deadline, the CronJob skips that instance of the Job (future occurrences are still scheduled).
For example, if you have a backup Job that runs twice a day, you might allow it to start up to 8 hours late,
but no later, because a backup taken any later wouldn't be useful: you would instead prefer to wait for
the next scheduled run.

For Jobs that miss their configured deadline, Kubernetes treats them as failed Jobs.
If you don't specify `startingDeadlineSeconds` for a CronJob, the Job occurrences have no deadline.

If the `.spec.startingDeadlineSeconds` field is set (not null), the CronJob
controller measures the time between when a Job is expected to be created and
now. If the difference is higher than that limit, it will skip this execution.

For example, if it is set to `200`, it allows a Job to be created for up to 200
seconds after the actual schedule.

### Concurrency policy

The `.spec.concurrencyPolicy` field is also optional.
It specifies how to treat concurrent executions of a Job that is created by this CronJob.
The spec may specify only one of the following concurrency policies:

* `Allow` (default): The CronJob allows concurrently running Jobs
* `Forbid`: The CronJob does not allow concurrent runs; if it is time for a new Job run and the
  previous Job run hasn't finished yet, the CronJob skips the new Job run. Also note that when the
  previous Job run finishes, `.spec.startingDeadlineSeconds` is still taken into account and may
  result in a new Job run.
* `Replace`: If it is time for a new Job run and the previous Job run hasn't finished yet, the
  CronJob replaces the currently running Job run with a new Job run

Note that concurrency policy only applies to the Jobs created by the same CronJob.
If there are multiple CronJobs, their respective Jobs are always allowed to run concurrently.

### Schedule suspension

You can suspend execution of Jobs for a CronJob, by setting the optional `.spec.suspend` field
to true. The field defaults to false.

This setting does _not_ affect Jobs that the CronJob has already started.

If you do set that field to true, all subsequent executions are suspended (they remain
scheduled, but the CronJob controller does not start the Jobs to run the tasks) until
you unsuspend the CronJob.

{{< caution >}}
Executions that are suspended during their scheduled time count as missed Jobs.
When `.spec.suspend` changes from `true` to `false` on an existing CronJob without a
[starting deadline](#starting-deadline), the missed Jobs are scheduled immediately.
{{< /caution >}}

### Jobs history limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields specify
how many completed and failed Jobs should be kept. Both fields are optional.

* `.spec.successfulJobsHistoryLimit`: This field specifies the number of successful finished
jobs to keep. The default value is `3`. Setting this field to `0` will not keep any successful jobs.

* `.spec.failedJobsHistoryLimit`: This field specifies the number of failed finished jobs to keep.
The default value is `1`. Setting this field to `0` will not keep any failed jobs.

For another way to clean up Jobs automatically, see
[Clean up finished Jobs automatically](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).

### Time zones

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

For CronJobs with no time zone specified, the {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
interprets schedules relative to its local time zone.

You can specify a time zone for a CronJob by setting `.spec.timeZone` to the name
of a valid [time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
For example, setting `.spec.timeZone: "Etc/UTC"` instructs Kubernetes to interpret
the schedule relative to Coordinated Universal Time.

A time zone database from the Go standard library is included in the binaries and used as a fallback in case an external database is not available on the system.

## CronJob limitations {#cron-job-limitations}

### Unsupported TimeZone specification

Specifying a timezone using `CRON_TZ` or `TZ` variables inside `.spec.schedule`
is **not officially supported** (and never has been).

Starting with Kubernetes 1.29 if you try to set a schedule that includes `TZ` or `CRON_TZ`
timezone specification, Kubernetes will fail to create the resource with a validation
error.
Updates to CronJobs already using `TZ` or `CRON_TZ` will continue to report a
[warning](/blog/2020/09/03/warnings/) to the client.

### Modifying a CronJob

By design, a CronJob contains a template for _new_ Jobs.
If you modify an existing CronJob, the changes you make will apply to new Jobs that
start to run after your modification is complete. Jobs (and their Pods) that have already
started continue to run without changes.
That is, the CronJob does _not_ update existing Jobs, even if those remain running.

### Job creation

A CronJob creates a Job object approximately once per execution time of its schedule.
The scheduling is approximate because there
are certain circumstances where two Jobs might be created, or no Job might be created.
Kubernetes tries to avoid those situations, but does not completely prevent them. Therefore,
the Jobs that you define should be _idempotent_.

If `startingDeadlineSeconds` is set to a large value or left unset (the default)
and if `concurrencyPolicy` is set to `Allow`, the Jobs will always run
at least once.

{{< caution >}}
If `startingDeadlineSeconds` is set to a value less than 10 seconds, the CronJob may not be scheduled. This is because the CronJob controller checks things every 10 seconds.
{{< /caution >}}


For every CronJob, the CronJob {{< glossary_tooltip term_id="controller" >}} checks how many schedules it missed in the duration from its last scheduled time until now. If there are more than 100 missed schedules, then it does not start the Job and logs the error.

```
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
```

It is important to note that if the `startingDeadlineSeconds` field is set (not `nil`), the controller counts how many missed Jobs occurred from the value of `startingDeadlineSeconds` until now rather than from the last scheduled time until now. For example, if `startingDeadlineSeconds` is `200`, the controller counts how many missed Jobs occurred in the last 200 seconds.

A CronJob is counted as missed if it has failed to be created at its scheduled time. For example, if `concurrencyPolicy` is set to `Forbid` and a CronJob was attempted to be scheduled when there was a previous schedule still running, then it would count as missed.

For example, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` field is not set. If the CronJob controller happens to
be down from `08:29:00` to `10:21:00`, the Job will not start as the number of missed Jobs which missed their schedule is greater than 100.

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
  API reference for more details.
