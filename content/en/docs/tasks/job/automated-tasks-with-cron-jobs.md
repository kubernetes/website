---
title: Running automated tasks with cron jobs
reviewers:
- chenopis
content_template: templates/task
weight: 10
---

{{% capture overview %}}

You can use [CronJobs](/docs/concepts/workloads/controllers/cron-jobs) to run jobs on a time-based schedule.
These automated jobs run like [Cron](https://en.wikipedia.org/wiki/Cron) tasks on a Linux or UNIX system.

Cron jobs are useful for creating periodic and recurring tasks, like running backups or sending emails.
Cron jobs can also schedule individual tasks for a specific time, such as if you want to schedule a job for a low activity period.

**Note:** CronJob resource in `batch/v2alpha1` API group has been deprecated starting from cluster version 1.8.
You should switch to using `batch/v1beta1`, instead, which is enabled by default in the API server.
Examples in this document use `batch/v1beta1` in all examples.

Cron jobs have limitations and idiosyncracies.
For example, in certain circumstances, a single cron job can create multiple jobs.
Therefore, jobs should be idempotent.
For more limitations, see [CronJobs](/docs/concepts/workloads/controllers/cron-jobs).

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* You need a working Kubernetes cluster at version >= 1.8 (for CronJob). For previous versions of cluster (< 1.8)
you need to explicitly enable `batch/v2alpha1` API by passing `--runtime-config=batch/v2alpha1=true` to
the API server (see [Turn on or off an API version for your cluster](/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster)
for more), and then restart both the API server and the controller manager
component.

{{% /capture %}}

{{% capture steps %}}

## Creating a Cron Job

Cron jobs require a config file.
This example cron job config `.spec` file prints the current time and a hello message every minute:

{{< codenew file="application/job/cronjob.yaml" >}}

Run the example cron job by downloading the example file and then running this command:

```shell
$ kubectl create -f ./cronjob.yaml
cronjob "hello" created
```

Alternatively, you can use `kubectl run` to create a cron job without writing a full config:

```shell
$ kubectl run hello --schedule="*/1 * * * *" --restart=OnFailure --image=busybox -- /bin/sh -c "date; echo Hello from the Kubernetes cluster"
cronjob "hello" created
```

After creating the cron job, get its status using this command:

```shell
$ kubectl get cronjob hello
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
hello     */1 * * * *   False     0         <none>
```

As you can see from the results of the command, the cron job has not scheduled or run any jobs yet.
Watch for the job to be created in around one minute:

```shell
$ kubectl get jobs --watch
NAME               DESIRED   SUCCESSFUL   AGE
hello-4111706356   1         1         2s
```

Now you've seen one running job scheduled by the "hello" cron job.
You can stop watching the job and view the cron job again to see that it scheduled the job:

```shell
$ kubectl get cronjob hello
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
hello     */1 * * * *   False     0         Mon, 29 Aug 2016 14:34:00 -0700
```

You should see that the cron job "hello" successfully scheduled a job at the time specified in `LAST-SCHEDULE`.
There are currently 0 active jobs, meaning that the job has completed or failed.

Now, find the pods that the last scheduled job created and view the standard output of one of the pods.
Note that the job name and pod name are different.

```shell
# Replace "hello-4111706356" with the job name in your system
$ pods=$(kubectl get pods --show-all --selector=job-name=hello-4111706356 --output=jsonpath={.items..metadata.name})

$ echo $pods
hello-4111706356-o9qcm

$ kubectl logs $pods
Mon Aug 29 21:34:09 UTC 2016
Hello from the Kubernetes cluster
```

## Deleting a Cron Job

When you don't need a cron job any more, delete it with `kubectl delete cronjob`:

```shell
$ kubectl delete cronjob hello
cronjob "hello" deleted
```

Deleting the cron job removes all the jobs and pods it created and stops it from creating additional jobs.
You can read more about removing jobs in [garbage collection](/docs/concepts/workloads/controllers/garbage-collection/).

## Writing a Cron Job Spec

As with all other Kubernetes configs, a cron job needs `apiVersion`, `kind`, and `metadata` fields. For general
information about working with config files, see [deploying applications](/docs/user-guide/deploying-applications),
and [using kubectl to manage resources](/docs/user-guide/working-with-resources) documents.

A cron job config also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status).

**Note:** All modifications to a cron job, especially its `.spec`, are applied only to the following runs.

### Schedule

The `.spec.schedule` is a required field of the `.spec`.
It takes a [Cron](https://en.wikipedia.org/wiki/Cron) format string, such as `0 * * * *` or `@hourly`, as schedule time of its jobs to be created and executed.

**Note:** The question mark (`?`) in the schedule has the same meaning as an asterisk `*`, that is, it stands for any of available value for a given field.

### Job Template

The `.spec.jobTemplate` is the template for the job, and it is required.
It has exactly the same schema as a [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/), except that it is nested and does not have an `apiVersion` or `kind`.
For information about writing a job `.spec`, see [Writing a Job Spec](/docs/concepts/workloads/controllers/jobs-run-to-completion/#writing-a-job-spec).

### Starting Deadline

The `.spec.startingDeadlineSeconds` field is optional.
It stands for the deadline in seconds for starting the job if it misses its scheduled time for any reason.
After the deadline, the cron job does not start the job.
Jobs that do not meet their deadline in this way count as failed jobs.
If this field is not specified, the jobs have no deadline.

### Concurrency Policy

The `.spec.concurrencyPolicy` field is also optional.
It specifies how to treat concurrent executions of a job that is created by this cron job.
the spec may specify only one of the following concurrency policies:

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

### Jobs History Limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields are optional.
These fields specify how many completed and failed jobs should be kept.
By default, they are set to 3 and 1 respectively.  Setting a limit to `0` corresponds to keeping none of the corresponding kind of jobs after they finish.

{{% /capture %}}
