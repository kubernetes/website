---
title: Running Automated Tasks with a CronJob
min-kubernetes-server-version: v1.21
reviewers:
- chenopis
content_type: task
weight: 10
---

<!-- overview -->

This page shows how to run automated tasks using Kubernetes {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} object.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Creating a CronJob {#creating-a-cron-job}

Cron jobs require a config file.
Here is a manifest for a CronJob that runs a simple demonstration task every minute:

{{% code_sample file="application/job/cronjob.yaml" %}}

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
{{< glossary_tooltip text="Watch" term_id="watch" >}} for the job to be created in around one minute:

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

You should see that the cron job `hello` successfully scheduled a job at the time specified in
`LAST SCHEDULE`. There are currently 0 active jobs, meaning that the job has completed or failed.

Now, find the pods that the last scheduled job created and view the standard output of one of the pods.

{{< note >}}
The job name is different from the pod name.
{{< /note >}}

```shell
# Replace "hello-4111706356" with the job name in your system
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items[*].metadata.name})
```
Show the pod log:

```shell
kubectl logs $pods
```
The output is similar to this:

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

## Deleting a CronJob {#deleting-a-cron-job}

When you don't need a cron job any more, delete it with `kubectl delete cronjob <cronjob name>`:

```shell
kubectl delete cronjob hello
```

Deleting the cron job removes all the jobs and pods it created and stops it from creating additional jobs.
You can read more about removing jobs in [garbage collection](/docs/concepts/architecture/garbage-collection/).
