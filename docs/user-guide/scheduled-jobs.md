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
`--runtime-config=batch/v2alpha1` while bringing up the API server (see [Turn on or off an API version
for your cluster](/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster) for
more). You cannot use Scheduled Jobs on a hosted Kubernetes provider that has disabled alpha resources.

## Creating a Scheduled Job

Here is an example Scheduled Job. Every minute, it runs a simple job to print current time and then say
hello.

{% include code.html language="yaml" file="sj.yaml" ghlink="/docs/user-guide/sj.yaml" %}

Run the example scheduled job by downloading the example file and then running this command:

```shell
$ kubectl create -f ./sj.yaml
scheduledjob "hello" created
```

Alternatively, use `kubectl run` to create a scheduled job without writing full config:

```shell
$ kubectl run hello --schedule="0/1 * * * ?" --restart=OnFailure --image=busybox -- /bin/sh -c "date; echo Hello from the Kubernetes cluster"
scheduledjob "hello" created
```

After creating the scheduled job, get its status using this command:

```shell
$ kubectl get scheduledjob hello
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
hello     0/1 * * * ?   False     0         <none>
```

As you can see above, there's no active job yet, and no job has been scheduled, either. 

Watch for the job to be created in around one minute:

```shell
$ kubectl get jobs --watch
NAME               DESIRED   SUCCESSFUL   AGE
hello-4111706356   1         1         2s
```

Now you've seen one running job scheduled by "hello". We can stop watching it and get the scheduled job again:

```shell
$ kubectl get scheduledjob hello
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST-SCHEDULE
hello     0/1 * * * ?   False     0         Mon, 29 Aug 2016 14:34:00 -0700
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

## Deleting a Scheduled Job 

Once you don't need a scheduled job anymore, simply delete it with `kubectl`:

```shell
$ kubectl delete scheduledjob hello
scheduledjob "hello" deleted
```

This stops new jobs from being created. However, running jobs won't be stopped, and no jobs or their pods will
be deleted. To clean up those jobs and pods, you need to list all jobs created by the scheduled job, and delete them all:

```shell
$ kubectl get jobs
NAME               DESIRED   SUCCESSFUL   AGE
hello-1201907962   1         1            11m
hello-1202039034   1         1            8m
...

$ kubectl delete jobs hello-1201907962 hello-1202039034 ...
job "hello-1201907962" deleted
job "hello-1202039034" deleted
...
```

Once the jobs are deleted, the pods created by them are deleted as well. Note that all jobs created by scheduled
job "hello" will be prefixed "hello-". You can delete them at once with `kubectl delete jobs --all`, if you want to 
delete all jobs in the current namespace (not just the ones created by "hello".)

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

**Note:** All modifications to a scheduled job, especially its `.spec`, will be applied only to the next run.

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

The `.spec.concurrencyPolicy` field is also optional. It specifies how to treat concurrent executions of a job
created by this scheduled job. Only one of the following concurrent policies may be specified:

* `Allow` (default): allows concurrently running jobs
* `Forbid`: forbids concurrent runs, skipping next run if previous hasn't finished yet
* `Replace`: cancels currently running job and replaces it with a new one

Note that concurrency policy only applies to the jobs created by the same scheduled job. If there are multiple
scheduled jobs, their respective jobs are always allowed to run concurrently.

### Suspend

The `.spec.suspend` field is also optional. If set to `true`, all subsequent executions will be suspended. It does not 
apply to already started executions. Defaults to false. 
