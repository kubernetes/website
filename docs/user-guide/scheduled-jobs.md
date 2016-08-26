---
assignees:
- erictune
- soltysh
- janetkuo

---

* TOC
{:toc}

## What is a _Scheduled Job_?

A _Scheduled Job_ manages time based [Jobs](/docs/user-guide/jobs/), namely:

* Once at a specified point in time
* Repeatedly at a specified point in time

One ScheduledJob object is like one line of a _crontab_ (cron table) file. It runs a job periodically
on a given schedule, written in [Cron](https://en.wikipedia.org/wiki/Cron) format.

A typical use case is:

* Schedule a job execution at a given point in time.
* Create a periodic job, e.g. database backup, sending emails.

### Prerequisites

You need a working Kubernetes cluster at version >= 1.4, with batch/v2alpha1 API turned on by passing
`--runtime-config=batch/v2alpha1` while brining up the API server (see [Turn on or off an API version
for your cluster](/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster) for
more). You cannot use Scheduled Jobs on a hosted Kubernetes provider that has disabled alpha resources.

## Creating a Scheduled Job

Here is an example Scheduled Job. Every minute, it runs a simple job to compute π to 2000 places and prints it out.

{% include code.html language="yaml" file="sj.yaml" ghlink="/docs/user-guide/sj.yaml" %}

Run the example scheduled job by downloading the example file and then running this command:

```shell
$ kubectl create -f ./sj.yaml
scheduledjob "pi" created
```

Alternatively, use `kubectl run` to create a scheduled job without writing full config:

```shell
$ kubectl run pi --schedule="0/1 * * * ?" --image=perl --restart=OnFailure -- perl -Mbignum=bpi -wle 'print bpi(2000)'
scheduledjob "pi" created
```

After creating the scheduled job, get its status using this command:

```shell
$ kubectl get scheduledjob pi
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
pi        0/1 * * * ?   False     0         <none>
```

As you can see above, there's no active job yet, and no job has been scheduled, either. 

Watch for the job to be created in around one minute:

```shell
$ kubectl get jobs --watch
NAME            DESIRED   SUCCESSFUL   AGE
pi-3972638982   1         1            41s
```

Now you've seen one running job scheduled by "pi". We can stop watching it and get the scheduled job again:

```shell
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
pi        0/1 * * * ?   False     1         Fri, 26 Aug 2016 15:13:00 -0700
```

## Deleting a Scheduled Job 

Once you don't need a scheduled job anymore, simply delete it with `kubectl`:

```shell
$ kubectl delete scheduledjob pi
scheduledjob "pi" deleted
```

This stops new jobs from being created. However, running jobs won't be stopped, and no jobs or their pods will
be deleted. To clean up those jobs and pods, you need to list all jobs created by the scheduled job, and delete them all:

```shell
$ kubectl get jobs
NAME            DESIRED   SUCCESSFUL   AGE
pi-1063102732   1         1            7m
pi-1133619459   1         1            4m
...

$ kubectl delete jobs pi-1063102732 pi-1133619459 ...
job "pi-1063102732" deleted
job "pi-1133619459" deleted
...
```

Once the jobs are deleted, the pods created by them are deleted as well. Note that all jobs created by scheduled
job "pi" will be prefixed "pi-". You can delete them at once with `kubectl delete jobs --all`, if you want to 
delete all jobs in the system (not just the ones created by "pi".)

## Scheduled Job Limitations

A scheduled job creates a job object _about_ once per execution time of its schedule. We say "about" because there
are certain circumstances where two jobs might be created, or no job might be created. We attempt to make these rare,
but do not completely prevent them. Therefore, jobs should be _idempotent_.

The job is responsible for retrying pods, parallelism among pods it creates, and determining the success or failure
of the set of pods. A scheduled job does not examine pods at all.

## Writing a Scheduled Job Spec

As with all other Kubernetes configs, a scheduled job needs `apiVersion`, `kind`, and `metadata` fields. For general
information about working with config files, see [deploying applications](/docs/user-guide/deploying-applications), 
[configuring containers](/docs/user-guide/configuring-containers), and
[using kubectl to manage resources](/docs/user-guide/working-with-resources) documents.

A scheduled job also needs a [`.spec` section](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api-conventions.md#spec-and-status).

### Schedule 

The `.spec.schedule` is a required field of the `.spec`. It takes a [Cron](https://en.wikipedia.org/wiki/Cron) format
string, e.g. `0 * * * *` or `@hourly`, as schedule time of its jobs to be created and executed. 

### Job Template

The `.spec.jobTemplate` is another required field of the `.spec`. It is a job template. It has exactly the same schema
as a [Job](/docs/user-guide/jobs), except it is nested and does not have an `apiVersion` or `kind`, see
[Writing a Job Spec](/docs/user-guide/jobs/#writing-a-job-spec).

### Starting Deadline Seconds

The `.spec.startingDeadlineSeconds` field is optional. It stands for the deadline (in seconds) for starting the job
if it misses its scheduled time for any reason. Missed jobs executions will be counted as failed ones. If not specified, 
there's no deadline.  

### Concurrency Policy

The `.spec.concurrencyPolicy` field is also optional. It specifies how to treat concurrent executions of a job.
Only one of the following concurrent policies may be specified:

* `Allow` (default): allows concurrently running jobs 
* `Forbid`: forbids concurrent runs, skipping next run if previous hasn't finished yet
* `Replace`: cancels currently running job and replaces it with a new one

### Suspend

The `.spec.suspend` field is also optional. If set to `true`, all subsequent executions will be suspended. It does not 
apply to already started executions. Defaults to false. 
