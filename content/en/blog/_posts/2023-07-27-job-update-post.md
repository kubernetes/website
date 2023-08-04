---
layout: blog
title: "Kubernetes 1.28: New Job features"
date: 2023-08-15
slug: kubernetes-1-28-jobapi-update
---

**Authors:** Kevin Hannon (G-Research), Michał Woźniak (Google)

This blog discusses two new features in Kubernetes 1.28 to improve Jobs for batch
users: [PodReplacementPolicy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated)
and [BackoffLimitPerIndex](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs).

## Pod Replacement Policy

### What problem does this solve?

By default, when a pod enters a terminating state (e.g. due to preemption or
eviction), a replacement pod is created immediately, and both pods are running
at the same time.

This is problematic for some popular machine learning frameworks, such as
TensorFlow and [JAX](https://jax.readthedocs.io/en/latest/), which require at most one pod running at the same time,
for a given index (see more details in the [issue](https://github.com/kubernetes/kubernetes/issues/115844)).

Creating the replacement Pod before the previous one fully terminates can also
cause problems in clusters with scarce resources or with tight budgets. These
resources can be difficult to obtain so pods can take a long time to find
resources and they may only be able to find nodes until the existing pods are
fully terminated. Further, if cluster autoscaler is enabled, the replacement
Pods might produce undesired scale ups.

### How can I use it

This is an alpha feature, which you can enable by enabling the `JobPodReplacementPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) in
your cluster.

Once the feature is enabled you can use it by creating a new Job, which specifies
`podReplacementPolicy` field as shown here:

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  podReplacementPolicy: Failed
  ...
```

Additionally, you can inspect the `.status.terminating` field of a Job. The value
of the field is the number of Pods owned by the Job that are currently terminating.

```shell
kubectl get jobs/myjob -o yaml
```

```yaml
apiVersion: batch/v1
kind: Job
status:
  terminating: 3 # three Pods are terminating and have not yet reached the Failed phase
```

This can be particularly useful for external queueing controllers, such as
[Kueue](https://github.com/kubernetes-sigs/kueue), that would calculate the
quota and suspend the start of a new Job until the resources are reclaimed from
the currently terminating Job.

### How can I learn more?

- Read the KEP: [PodReplacementPolicy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated)

## Job Backoff Limit per Index

### What problem does this solve?

By default, pod failures for [Indexed Jobs](/docs/concepts/workloads/controllers/job/#completion-mode)
are counted towards the global limit of retries, represented by `.spec.backoffLimit`.
This means, that if there is a consistently failing index, it is restarted
repeatedly until it exhausts the limit. Once the limit is exceeded the entire
Job is marked failed and some indexes may never be even started.

This is problematic for use cases where you want to handle pod failures for
every index independently. For example, if you use Indexed Jobs for running
integration tests where each index corresponds to a testing suite. In that case,
you may want to account for possible flake tests allowing for 1 or 2 retries per
suite. Additionally, there might be some buggy suites, making the corresponding
indexes fail consistently. In that case you may prefer to terminate retries for
that indexes, yet allowing other suites to complete.

The feature allows you to:
* complete execution of all indexes, despite some indexes failing,
* better utilize the computational resources by avoiding unnecessary retries of consistently failing indexes.

### How to use it?

This is an alpha feature, which you can enable by enabling the
`JobBackoffLimitPerIndex`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
in your cluster.

Once the feature is enabled, you can create an Indexed Job with the
`.spec.backoffLimitPerIndex` field specified.

#### Example

The following example demonstrates how to use this feature to make sure the
Job executes all indexes, and the number of failures is controller per index.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-backoff-limit-per-index-execute-all
spec:
  completions: 8
  parallelism: 2
  completionMode: Indexed
  backoffLimitPerIndex: 1
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: example
        image: python
        command:
        - python3
        - -c
        - |
          import os, sys, time
          id = int(os.environ.get("JOB_COMPLETION_INDEX"))
          if id == 1 or id == 2:
            sys.exit(1)
          time.sleep(1)
```

Now, inspect the pods after the job is finished:

```sh
kubectl get pods -l job-name=job-backoff-limit-per-index-execute-all
```

Returns output similar to this:
```
NAME                                              READY   STATUS      RESTARTS   AGE
job-backoff-limit-per-index-execute-all-0-b26vc   0/1     Completed   0          49s
job-backoff-limit-per-index-execute-all-1-6j5gd   0/1     Error       0          49s
job-backoff-limit-per-index-execute-all-1-6wd82   0/1     Error       0          37s
job-backoff-limit-per-index-execute-all-2-c66hg   0/1     Error       0          32s
job-backoff-limit-per-index-execute-all-2-nf982   0/1     Error       0          43s
job-backoff-limit-per-index-execute-all-3-cxmhf   0/1     Completed   0          33s
job-backoff-limit-per-index-execute-all-4-9q6kq   0/1     Completed   0          28s
job-backoff-limit-per-index-execute-all-5-z9hqf   0/1     Completed   0          28s
job-backoff-limit-per-index-execute-all-6-tbkr8   0/1     Completed   0          23s
job-backoff-limit-per-index-execute-all-7-hxjsq   0/1     Completed   0          22s
```

Additionally, let's take a look at the job status:

```sh
kubectl get jobs job-backoff-limit-per-index-fail-index -o yaml
```

Returns output similar to this:

```yaml
  status:
    completedIndexes: 0,3-7
    failedIndexes: 1,2
    succeeded: 6
    failed: 4
    conditions:
    - message: Job has failed indexes
      reason: FailedIndexes
      status: "True"
      type: Failed
```

Here, indexes `1`  and `2` were both retried once. After the second failure,
in each of them, the specified `.spec.backoffLimitPerIndex` was exceeded, so
the retries were stopped. For comparison, if the per-index backoff was disabled,
then the buggy indexes would retry until the global `backoffLimit` was exceeded,
and then the entire Job would be marked failed, before some of the higher
indexes are started.

### Getting Involved

These features were sponsored under the domain of SIG Apps.  Batch is actively
being improved for Kubernetes users in the
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch).
Working groups are relatively short-lived initiatives focused on specific goals.
In the case of Batch, the goal is to improve/support batch users and enhance the
Job API for common use cases.  If that interests you, please join the working
group either by subscriping to our
[mailing list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on
[Slack](https://kubernetes.slack.com/messages/wg-batch).

### Acknowledgments

As with any Kubernetes feature, multiple people contributed to getting this
done, from testing and filing bugs to reviewing code.

We would not have been able to achieve either of these features without Aldo
Culquicondor (Google) providing excellent domain knowledge and expertise
throughout the Kubernetes ecosystem.
