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

The job controller is built in to kube-controller-manager.

## Pod creation

The Job controller makes sure that the .spec.selector field for the Job
has a valid Pod selector. If there isn't one set (the most common way
to use Jobs), the controller invents a new label and sets the selector
to match that.

The controller then creates one or more Pods based on its Pod spec:

### No parallism

If you created a Job with .spec.completions and .spec.parallelism
unset, the controller will create one Pod.

### Parallel pods with a completion count

If you specified .spec.completions to be more than 1, the controller
starts Pods to run the Job. You can set .spec.parallelism to let
more than one Pod run at once for a given Job. The controller will make
sure that if all running Pods return success, the completion count won't
exceed .spec.completions.

Once the controller has seen .spec.completions Pods complete successfully
for the Job, the overall Job is a success.

### Parallel pods with a work queue

If you specified .spec.parallelism to be more than 1 and left
.spec.completions as default (1), the controller starts the configured
number of Pods in parallel. Those Pods need to coordinate amongst
themselves to determine what each Pod should work on. The Pods might
rely on a separate controller or external service such as a work queue.

Once those Pods have decided between themselves that the work is done,
one (or more) of the Pods should terminate with success, indicating
completion. The Job controller sees this and updates the Job to have
finished successfully.

## Deadline

If the Job has activeDeadlineSeconds set, the Job will terminate if
it is active for longer than the configured duration.

## Pod failure

By default, a Job will run uninterrupted unless a Pod fails.
If a Job has .spec.backoffLimit set to more than 1 (the default is 6),
and a Pod for that Job fails, the controller waits a short period and
then creates another Pod.

The controller increases the delay exponentially (10s, 20s, 40s…), capping it
at 6 minutes.

After the Job controller has retried making any Pod more than the configured
back-off limit, it will treat the overall Job as failed. If the Job controller
checks status and no failures have occurred since the last check, it resets
the retry count and the delay.

{{< note >}}
A Job's .spec.activeDeadlineSeconds takes precedence over its .spec.backoffLimit.
Therefore, a Job that is retrying one or more failed Pods will not deploy additional
Pods once it reaches the time limit specified by activeDeadlineSeconds, even if
the backoffLimit is not yet reached.
{{< note >}}

## Job termination and cleanup

When a Job completes, no more Pods are created, but the Pods are not deleted either.
Keeping them around allows you to still view the logs of completed pods
to check for errors, warnings, or other diagnostic output.

You can clean up the Pods for a Job by deleting the Job.

The job object also remains after it is completed so that you can view its status.  If you
created the Job yourself, it is up to you to delete it (eg with
{{< glossary_tooltip term_id="kubectl" >}}).

The activeDeadlineSeconds applies to the duration of the Job, no matter
how many Pods are created.
Once a Job reaches `activeDeadlineSeconds`, the controller terminates
all its Pods and sets the Job's status to `type: Failed` with
`reason: DeadlineExceeded`.

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
* Read about [Jobs](/docs/concepts/workloads/job/)
{{% /capture %}}
