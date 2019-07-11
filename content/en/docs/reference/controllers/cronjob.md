---
toc_hide: true
title: Cron job controller
content_template: templates/concept
---

{{% capture overview %}}

The CronJob {{< glossary_tooltip term_id="controller" text="controller" >}} creates
{{< glossary_tooltip text="Jobs" term_id="job" >}} for a
{{< glossary_tooltip term_id="cronjob" >}} on a time-based schedule.


{{% /capture %}}


{{% capture body %}}

The CronJob controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

The cron job controller creates a Job object _about_ once per execution time
of its schedule. In certain circumstances, the controller might create one
job, or none.

For every CronJob, the CronJob controller checks how many schedules it
missed in the duration from its last scheduled time until now. If there
are too many, then it does not start the Job and instead records an Event
to log the error.

The CronJob controller is only responsible for creating Jobs that match a
CronJob's schedule. The [Job controller](/docs/reference/controllers/job/)
takes care of running Jobs by creating Pods.

{{< note >}}
All `schedule:` times for CronJobs are based on the timezone of the Kubernetes control plane.
{{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}

* Read about [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)
* Learn about [running automated tasks with cron jobs](/docs/tasks/job/automated-tasks-with-cron-jobs).
* Read about other [workload controllers](/docs/reference/controllers/workload-controllers/)

{{% /capture %}}
