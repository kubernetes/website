---
title: Job controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip term_id="job" >}} controller creates 
{{< glossary_tooltip term_id="pod" text="Pods" >}} to run each
Job to completion.

As its pods successfully complete, the controller tracks successful completions.
When a specified number of successful completions is reached, the Job
controller updates the Job object to mark it complete.

{{% /capture %}}


{{% capture body %}}

The job controller is built in to kube-controller-manager. It creates
one or more Pods to run each Job to completion.

## Cleanup for finished Jobs

Finished Jobs are usually no longer needed in the system.
This controller leaves Job objects in place even after they are finished.
If another controller, such as the
[CronJob controller](/docs/reference/controllers/cron-jobs/),
is managing Job objects, then the other controller is responsible for
the Jobs it created and can clean them up.

The [TTL after finished controller](/docs/reference/controllers/ttlafterfinished/)
provides an alternative cleanup mechanism for finished resources,
such as Jobs.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [Jobs](/docs/concepts/workloads/controllers/job-run-to-completion/)
{{% /capture %}}
