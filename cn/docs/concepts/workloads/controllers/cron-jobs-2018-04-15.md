---
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
---

* TOC
{:toc}

## What is a cron job?

A _Cron Job_ manages time based [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/), namely:

* Once at a specified point in time
* Repeatedly at a specified point in time

One CronJob object is like one line of a _crontab_ (cron table) file. It runs a job periodically
on a given schedule, written in [Cron](https://en.wikipedia.org/wiki/Cron) format.

**Note:** The question mark (`?`) in the schedule has the same meaning as an asterisk `*`,
that is, it stands for any of available value for a given field.

**Note:** CronJob resource in `batch/v2alpha1` API group has been deprecated starting
from cluster version 1.8. You should switch to using `batch/v1beta1`, instead, which is
enabled by default in the API server.  Further in this document, we will be using
`batch/v1beta1` in all the examples.

A typical use case is:

* Schedule a job execution at a given point in time.
* Create a periodic job, e.g. database backup, sending emails.

### Prerequisites

You need a working Kubernetes cluster at version >= 1.8 (for CronJob). For previous versions of cluster (< 1.8)
you need to explicitly enable `batch/v2alpha1` API by passing `--runtime-config=batch/v2alpha1=true` to
the API server (see [Turn on or off an API version for your cluster](/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster)
for more), and then restart both the API server and the controller manager
component.

## Creating a Cron Job

Here is an example Cron Job. Every minute, it runs a simple job to print current time and then say
hello.

{% include code.html language="yaml" file="cronjob.yaml" ghlink="/docs/concepts/workloads/controllers/cronjob.yaml" %}

Run the example cron job by downloading the example file and then running this command:

```shell
$ kubectl create -f ./cronjob.yaml
cronjob "hello" created
```

Alternatively, use `kubectl run` to create a cron job without writing full config:

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

As you can see above, there's no active job yet, and no job has been scheduled, either.

Watch for the job to be created in around one minute:

```shell
$ kubectl get jobs --watch
NAME               DESIRED   SUCCESSFUL   AGE
hello-4111706356   1         1         2s
```

Now you've seen one running job scheduled by "hello". We can stop watching it and get the cron job again:

```shell
$ kubectl get cronjob hello
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
hello     */1 * * * *   False     0         Mon, 29 Aug 2016 14:34:00 -0700
```

You should see that "hello" successfully scheduled a job at the time specified in `LAST-SCHEDULE`. There are
currently 0 active jobs, meaning that the job that's scheduled is completed or failed.

Now, find the pods created by the job last scheduled and view the standard output of one of the pods. Note that
your job name and pod name would be different.

```shell
# Replace "hello-4111706356" with the job name in your system
$ pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items..metadata.name})

$ echo $pods
hello-4111706356-o9qcm

$ kubectl logs $pods
Mon Aug 29 21:34:09 UTC 2016
Hello from the Kubernetes cluster
```

## Deleting a Cron Job

Once you don't need a cron job anymore, simply delete it with `kubectl`:

```shell
$ kubectl delete cronjob hello
cronjob "hello" deleted
```

This stops new jobs from being created and removes all the jobs and pods created by this cronjob.
You can read more about it in [garbage collection section](/docs/concepts/workloads/controllers/garbage-collection/).

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

## Writing a Cron Job Spec

As with all other Kubernetes configs, a cron job needs `apiVersion`, `kind`, and `metadata` fields. For general
information about working with config files, see [deploying applications](/docs/user-guide/deploying-applications),
and [using kubectl to manage resources](/docs/user-guide/working-with-resources) documents.

A cron job also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status).

**Note:** All modifications to a cron job, especially its `.spec`, will be applied only to the next run.

### Schedule

The `.spec.schedule` is a required field of the `.spec`. It takes a [Cron](https://en.wikipedia.org/wiki/Cron) format
string, e.g. `0 * * * *` or `@hourly`, as schedule time of its jobs to be created and executed.

### Job Template

The `.spec.jobTemplate` is another required field of the `.spec`. It is a job template. It has exactly the same schema
as a [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/), except it is nested and does not have an `apiVersion` or `kind`, see
[Writing a Job Spec](/docs/concepts/workloads/controllers/jobs-run-to-completion/#writing-a-job-spec).

### Starting Deadline Seconds

The `.spec.startingDeadlineSeconds` field is optional. It stands for the deadline (in seconds) for starting the job
if it misses its scheduled time for any reason. Missed jobs executions will be counted as failed ones. If not specified,
there's no deadline.

### Concurrency Policy

The `.spec.concurrencyPolicy` field is also optional. It specifies how to treat concurrent executions of a job
created by this cron job. Only one of the following concurrent policies may be specified:

* `Allow` (default): allows concurrently running jobs
* `Forbid`: forbids concurrent runs, skipping next run if previous hasn't finished yet
* `Replace`: cancels currently running job and replaces it with a new one

Note that concurrency policy only applies to the jobs created by the same cron job. If there are multiple
cron jobs, their respective jobs are always allowed to run concurrently.

### Suspend

The `.spec.suspend` field is also optional. If set to `true`, all subsequent executions will be suspended. It does not
apply to already started executions. Defaults to false.

### Jobs History Limits

The `.spec.successfulJobsHistoryLimit` and `.spec.failedJobsHistoryLimit` fields are optional.
These fields specify how many completed and failed jobs should be kept.  By default, they are
set to 3 and 1 respectively.  Setting a limit to `0` corresponds to keeping none of the corresponding
kind of jobs after they finish.
