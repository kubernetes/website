---
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

A _Cron Job_ manages time based [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/), namely:

* Once at a specified point in time
* Repeatedly at a specified point in time

One CronJob object is like one line of a _crontab_ (cron table) file. It runs a job periodically
on a given schedule, written in [Cron](https://en.wikipedia.org/wiki/Cron) format.

For instructions on creating and working with cron jobs, and for an example of a spec file for a cron job, see [Running automated tasks with cron jobs](/docs/tasks/job/automated-tasks-with-cron-jobs).

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## Cron Job Limitations

A cron job creates a job object _about_ once per execution time of its schedule. We say "about" because there
are certain circumstances where two jobs might be created, or no job might be created. We attempt to make these rare,
but do not completely prevent them. Therefore, jobs should be _idempotent_.

If `startingDeadlineSeconds` is set to a large value or left unset (the default)
and if `concurrencyPolicy` is set to `Allow`, the jobs will always run
at least once.

Jobs may fail to run if the CronJob controller is not running or broken for a
span of time from before the start time of the CronJob to start time plus
`startingDeadlineSeconds`, or if the span covers multiple start times and
`concurrencyPolicy` does not allow concurrency.
For example, suppose a cron job is set to start at exactly `08:30:00` and its
`startingDeadlineSeconds` is set to 10, if the CronJob controller happens to
be down from `08:29:00` to `08:42:00`, the job will not start.
Set a longer `startingDeadlineSeconds` if starting later is better than not
starting at all.

The Cronjob is only responsible for creating Jobs that match its schedule, and
the Job in turn is responsible for the management of the Pods it represents.

{{% /capture %}}
