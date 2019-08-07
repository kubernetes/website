---
title: Cron job controller
content_template: templates/concept
---

{{% capture overview %}}

The cron job controller creates {{< glossary_tooltip text="Jobs" term_id="job" >}} for a
{{< glossary_tooltip term_id="cronjob" >}} on a time-based schedule.

{{< note >}}
All `schedule:` times for CronJobs are based on the timezone of the Kubernetes control plane.
{{< /note >}}


{{% /capture %}}


{{% capture body %}}

The CronJob controller is built in to kube-controller-manager.

## Controller behavior

The cron job controller creates a job object _about_ once per execution time
of its schedule. In certain circumstances, the controller might create one
job, or none. Although the controller is designed to make those situations rare,
they can happen.
You should make Jobs idempotent: if a CronJob sets up two Job
objects, the outcome should be the same as if just one Job ran.

If you set `startingDeadlineSeconds` to a large value, or you don't set it,
and if `concurrencyPolicy` is set to `Allow`, the jobs will always run at least once.

For every CronJob, the CronJob controller checks how many schedules it missed in the duration from its last scheduled time until now. If there are more than 100 missed schedules, then it does not start the job and logs the error

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
````

It is important to note that if the `startingDeadlineSeconds` field is set (not `nil`), the controller counts how many missed jobs occurred from the value of `startingDeadlineSeconds` until now rather than from the last scheduled time until now. For example, if `startingDeadlineSeconds` is `200`, the controller counts how many missed jobs occurred in the last 200 seconds.

A CronJob is counted as missed if it has failed to be created at its scheduled time. For example, If `concurrencyPolicy` is set to `Forbid` and a CronJob was attempted to be scheduled when there was a previous schedule still running, then it would count as missed.

For example, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` field is not set. If the CronJob controller happens to
be down from `08:29:00` to `10:21:00`, the job will not start as the number of missed jobs which missed their schedule is greater than 100.

To illustrate this concept further, suppose a CronJob is set to schedule a new Job every one minute beginning at `08:30:00`, and its
`startingDeadlineSeconds` is set to 200 seconds. If the CronJob controller happens to
be down for the same period as the previous example (`08:29:00` to `10:21:00`,) the Job will still start at 10:22:00. This happens as the controller now checks how many missed schedules happened in the last 200 seconds (ie, 3 missed schedules), rather than from the last scheduled time until now.

The Cronjob is only responsible for creating Jobs that match its schedule, and
the Job in turn is responsible for the management of the Pods it represents.

{{% /capture %}}

{{% capture whatsnext %}}

* Learn about [running automated tasks with cron jobs](/docs/tasks/job/automated-tasks-with-cron-jobs).

{{% /capture %}}
