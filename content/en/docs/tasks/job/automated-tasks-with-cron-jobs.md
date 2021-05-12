---
title: Running Automated Tasks with a CronJob
min-kubernetes-server-version: v1.21
reviewers:
- chenopis
content_type: task
weight: 10
---

<!-- overview -->

CronJobs was promoted to general availability in Kubernetes v1.21. If you are using an older version of
Kubernetes, please refer to the documentation for the version of Kubernetes that you are using,
so that you see accurate information. Older Kubernetes versions do not support the `batch/v1` CronJob API.

You can use a {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} to run {{< glossary_tooltip text="Jobs" term_id="job" >}} on a time-based schedule.
These automated jobs run like [Cron](https://en.wikipedia.org/wiki/Cron) tasks on a Linux or UNIX system.

Cron jobs are useful for creating periodic and recurring tasks, like running backups or sending emails.
Cron jobs can also schedule individual tasks for a specific time, such as if you want to schedule a job for a low activity period.

Cron jobs have limitations and idiosyncrasies.
For example, in certain circumstances, a single cron job can create multiple jobs.
Therefore, jobs should be idempotent.

For more limitations, see [CronJobs](/docs/concepts/workloads/controllers/cron-jobs).



## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}}



<!-- steps -->

## Creating a Cron Job

Cron jobs require a config file.
This example cron job config `.spec` file prints the current time and a hello message every minute:

{{< codenew file="application/job/cronjob.yaml" >}}

Run the example CronJob by using this command:

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```
The output is similar to this:

```
cronjob.batch/hello created
```

After creating the cron job, get its status using this command:

```shell
kubectl get cronjob hello
```
The output is similar to this:

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        <none>          10s
```

As you can see from the results of the command, the cron job has not scheduled or run any jobs yet.
Watch for the job to be created in around one minute:

```shell
kubectl get jobs --watch
```
The output is similar to this:

```
NAME               COMPLETIONS   DURATION   AGE
hello-4111706356   0/1                      0s
hello-4111706356   0/1           0s         0s
hello-4111706356   1/1           5s         5s
```

Now you've seen one running job scheduled by the "hello" cron job.
You can stop watching the job and view the cron job again to see that it scheduled the job:

```shell
kubectl get cronjob hello
```
The output is similar to this:

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

You should see that the cron job `hello` successfully scheduled a job at the time specified in `LAST SCHEDULE`. There are currently 0 active jobs, meaning that the job has completed or failed.

Now, find the pods that the last scheduled job created and view the standard output of one of the pods.

{{< note >}}
The job name and pod name are different.
{{< /note >}}

```shell
# Replace "hello-4111706356" with the job name in your system
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items[*].metadata.name})
```
Show pod log:

```shell
kubectl logs $pods
```
The output is similar to this:

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

## Deleting a Cron Job

When you don't need a cron job any more, delete it with `kubectl delete cronjob <cronjob name>`:

```shell
kubectl delete cronjob hello
```

Deleting the cron job removes all the jobs and pods it created and stops it from creating additional jobs.
You can read more about removing jobs in [garbage collection](/docs/concepts/workloads/controllers/garbage-collection/).

## Writing a Cron Job Spec

As with all other Kubernetes configs, a cron job needs `apiVersion`, `kind`, and `metadata` fields. For general
information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/),
and [using kubectl to manage resources](/docs/concepts/overview/working-with-objects/object-management/) documents.

A cron job config also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

{{< note >}}
All modifications to a cron job, especially its `.spec`, are applied only to the following runs.
{{< /note >}}

### Schedule

The `.spec.schedule` is a required field of the `.spec`.
It takes a [Cron](https://en.wikipedia.org/wiki/Cron) format string, such as `0 * * * *` or `@hourly`, as schedule time of its jobs to be created and executed.

The format also includes extended `vixie cron` step values. As explained in the
[FreeBSD manual](https://www.freebsd.org/cgi/man.cgi?crontab%285%29):

> Step values can be	used in	conjunction with ranges.  Following a range
> with `/<number>` specifies skips	of the number's	value through the
> range.  For example, `0-23/2` can be used in the	hours field to specify
> command execution every other hour	(the alternative in the	V7 standard is
> `0,2,4,6,8,10,12,14,16,18,20,22`).  Steps are also permitted after an
> asterisk, so if you want to say "every two hours", just use `*/2`.

{{< note >}}
A question mark (`?`) in the schedule has the same meaning as an asterisk `*`, that is, it stands for any of available value for a given field.
{{< /note >}}

### Job Template

The `.spec.jobTemplate` is the template for the job, and it is required.
It has exactly the same schema as a [Job](/docs/concepts/workloads/controllers/job/), except that it is nested and does not have an `apiVersion` or `kind`.
For information about writing a job `.spec`, see [Writing a Job Spec](/docs/concepts/workloads/controllers/job/#writing-a-job-spec).

### Starting Deadline

The `.spec.startingDeadlineSeconds` field is optional.
It stands for the deadline in seconds for starting the job if it misses its scheduled time for any reason.
After the deadline, the cron job does not start the job.
Jobs that do not meet their deadline in this way count as failed jobs.
If this field is not specified, the jobs have no deadline.

If the `.spec.startingDeadlineSeconds` field is set (not null), the CronJob
controller measures the time between when a job is expected to be created and
now. If the difference is higher than that limit, it will skip this execution.

For example, if it is set to `200`, it allows a job to be created for up to 200
seconds after the actual schedule.

### Concurrency Policy

The `.spec.concurrencyPolicy` field is also optional.
It specifies how to treat concurrent executions of a job that is created by this cron job.
The spec may specify only one of the following concurrency policies:

* `Allow` (default): The cron job allows concurrently running jobs
* `Forbid`: The cron job does not allow concurrent runs; if it is time for a new job run and the previous job run hasn't finished yet, the cron job skips the new job run
* `Replace`: If it is time for a new job run and the previous job run hasn't finished yet, the cron job replaces the currently running job run with a new job run

Note that concurrency policy only applies to the jobs created by the same cron job.
If there are multiple cron jobs, their respective jobs are always allowed to run concurrently.

### Suspend

The `.spec.suspend` field is also optional.
If it is set to `true`, all subsequent executions are suspended.
This setting does not apply to already started executions.
Defaults to false.

{{< caution >}}
Executions that are suspended during their scheduled time count as missed jobs.
When `.spec.suspend` changes from `true` to `false` on an existing cron job without a [starting deadline](#starting-deadline), the missed jobs are scheduled immediately.
{{< /caution >}}

### Jobs History Limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields are optional.
These fields specify how many completed and failed jobs should be kept.
By default, they are set to 3 and 1 respectively.  Setting a limit to `0` corresponds to keeping none of the corresponding kind of jobs after they finish.


