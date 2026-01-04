---
layout: blog
title: "Kubernetes 1.28: Improved failure handling for Jobs"
date: 2023-08-21
slug: kubernetes-1-28-jobapi-update
author: >
  Kevin Hannon (G-Research),
  Michał Woźniak (Google)
---

This blog discusses two new features in Kubernetes 1.28 to improve Jobs for batch
users: [Pod replacement policy](/docs/concepts/workloads/controllers/job/#pod-replacement-policy)
and [Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index).

These features continue the effort started by the
[Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
to improve the handling of Pod failures in a Job.

## Pod replacement policy {#pod-replacement-policy}

By default, when a pod enters a terminating state (e.g. due to preemption or
eviction), Kubernetes immediately creates a replacement Pod. Therefore, both Pods are running
at the same time. In API terms, a pod is considered terminating when it has a
`deletionTimestamp` and it has a phase `Pending` or `Running`.

The scenario when two Pods are running at a given time is problematic for
some popular machine learning frameworks, such as
TensorFlow and [JAX](https://jax.readthedocs.io/en/latest/), which require at most one Pod running at the same time,
for a given index. 
Tensorflow gives the following error if two pods are running for a given index.

```
 /job:worker/task:4: Duplicate task registration with task_name=/job:worker/replica:0/task:4
```

See more details in the ([issue](https://github.com/kubernetes/kubernetes/issues/115844)).


Creating the replacement Pod before the previous one fully terminates can also
cause problems in clusters with scarce resources or with tight budgets, such as:
* cluster resources can be difficult to obtain for Pods pending to be scheduled,
  as Kubernetes might take a long time to find available nodes until the existing
  Pods are fully terminated.
* if cluster autoscaler is enabled, the replacement Pods might produce undesired
  scale ups.

### How can you use it? {#pod-replacement-policy-how-to-use}

This is an alpha feature, which you can enable by turning on `JobPodReplacementPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) in
your cluster.

Once the feature is enabled in your cluster, you can use it by creating a new Job that specifies a
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

In that Job, the Pods would only be replaced once they reached the `Failed` phase,
and not when they are terminating.

Additionally, you can inspect the `.status.terminating` field of a Job. The value
of the field is the number of Pods owned by the Job that are currently terminating.

```shell
kubectl get jobs/myjob -o=jsonpath='{.items[*].status.terminating}'
```

```
3 # three Pods are terminating and have not yet reached the Failed phase
```

This can be particularly useful for external queueing controllers, such as
[Kueue](https://github.com/kubernetes-sigs/kueue), that tracks quota
from running Pods of a Job until the resources are reclaimed from
the currently terminating Job.

Note that the `podReplacementPolicy: Failed` is the default when using a custom
[Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy).

## Backoff limit per index {#backoff-limit-per-index}

By default, Pod failures for [Indexed Jobs](/docs/concepts/workloads/controllers/job/#completion-mode)
are counted towards the global limit of retries, represented by `.spec.backoffLimit`.
This means, that if there is a consistently failing index, it is restarted
repeatedly until it exhausts the limit. Once the limit is reached the entire
Job is marked failed and some indexes may never be even started.

This is problematic for use cases where you want to handle Pod failures for
every index independently. For example, if you use Indexed Jobs for running
integration tests where each index corresponds to a testing suite. In that case,
you may want to account for possible flake tests allowing for 1 or 2 retries per
suite. There might be some buggy suites, making the corresponding
indexes fail consistently. In that case you may prefer to limit retries for
the buggy suites, yet allowing other suites to complete.

The feature allows you to:
* complete execution of all indexes, despite some indexes failing.
* better utilize the computational resources by avoiding unnecessary retries of consistently failing indexes.

### How can you use it? {#backoff-limit-per-index-how-to-use}

This is an alpha feature, which you can enable by turning on the
`JobBackoffLimitPerIndex`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
in your cluster.

Once the feature is enabled in your cluster, you can create an Indexed Job with the
`.spec.backoffLimitPerIndex` field specified.

#### Example

The following example demonstrates how to use this feature to make sure the
Job executes all indexes (provided there is no other reason for the early Job
termination, such as reaching the `activeDeadlineSeconds` timeout, or being
manually deleted by the user), and the number of failures is controlled per index.

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
      - name: example # this example container returns an error, and fails,
                      # when it is run as the second or third index in any Job
                      # (even after a retry)        
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

Now, inspect the Pods after the job is finished:

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

Additionally, you can take a look at the status for that Job:

```sh
kubectl get jobs job-backoff-limit-per-index-fail-index -o yaml
```

The output ends with a `status` similar to:

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

## How can you learn more?

- Read the user-facing documentation for [Pod replacement policy](/docs/concepts/workloads/controllers/job/#pod-replacement-policy),
[Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index), and
[Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
- Read the KEPs for [Pod Replacement Policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated),
[Backoff limit per index](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs), and
[Pod failure policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures).

## Getting Involved

These features were sponsored by [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps).  Batch use cases are actively
being improved for Kubernetes users in the
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch).
Working groups are relatively short-lived initiatives focused on specific goals.
The goal of the WG Batch is to improve experience for batch workload users, offer support for
batch processing use cases, and enhance the
Job API for common use cases.  If that interests you, please join the working
group either by subscriping to our
[mailing list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on
[Slack](https://kubernetes.slack.com/messages/wg-batch).

## Acknowledgments

As with any Kubernetes feature, multiple people contributed to getting this
done, from testing and filing bugs to reviewing code.

We would not have been able to achieve either of these features without Aldo
Culquicondor (Google) providing excellent domain knowledge and expertise
throughout the Kubernetes ecosystem.
