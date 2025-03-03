---
layout: blog
title: "Kubernetes 1.33: Job's Backoff Limit Per Index Goes GA"
date: 2025-04-23
slug: kubernetes-1-33-jobs-backoff-limit-per-index-goes-ga
author: >
  [Michał Woźniak](https://github.com/mimowo) (Google)
---

This post describes the Job's _Backoff Limit Per Index_, which graduates to
stable in Kubernetes 1.33, and how to use it in your Jobs.

## About

When you run workloads on Kubernetes, you need to account for Pod failures due
to variety of reasons. Ideally, your workload can tolerate some transient
failures and continue running to completion.

One way to achieve failure tolerance in Kubenetes Job is by setting the
`spec.backoffLimit` field which specifies the total number of tolerated
failures.

However, for Indexed Jobs this is often not flexible enough for embarassingly
parallel workloads, where every index is considered independent, for example
in case of running integration tests. In that scenario, a fast-failing index is
likely to consume your entire budget for tolerating Pod failures, and you may
not be able to run the other indexes.

In order to address this limitation we introduce the new feature, called
_Backoff Limit Per Index_, which allows you to control the number of retries
per index.

## How it works

You can specify the number of tolerated Pod failures per index with the new
`spec.backoffLimitPerIndex` field.

When the number of tolerated failures is exceeded the Job considers the index as
failed, and this index is listed in the Job's `status.failedIndexes` field.

Additionally, you can configure short-circuit for detecting a failed index by
using the "FailIndex" action in the _Pod Failure Policy_ feature (see the
example below).

When the `spec.backoffLimitPerIndex` the Job executes all indexes, unless the cap
of the total number of failed indexes is specified by the `spec.maxFailedIndexes`
field.

### Example

The Job spec snippet below demonstrates an example use, combining the feature
with the _Pod Failure Policy_ feature:

```yaml
completions: 10
parallelism: 10
completionMode: Indexed
backoffLimitPerIndex: 1
maxFailedIndexes: 5
podFailurePolicy:
  rules:
  - action: Ignore
    onPodConditions:
    - type: DisruptionTarget
  - action: FailIndex
    onExitCodes:
      operator: In
      values: [ 42 ]
```

In this example, the Job handles Pod failures as follows:

- Ignores any failed Pods that have the built-in `DisruptionTarget`
  condition. These Pods don't count towards backoff limits.
- Fails the index corresponding to the failed Pod if any of the failed Pod's
  containers exited with the exit code 42 - based on the matching "FailIndex"
  rule.
- Retries the first failure of any index, unless the index if failed due to the
  matching FailIndex rule.
- Fails the entire Job if the number of failed indexes exceeded 5 (set by the
  `spec.maxFailedIndexes` field).

## Learn more

- Read the blog post on the closely related feature of Pod Failure Policy [Kubernetes 1.31: Pod Failure Policy for Jobs Goes GA](https://kubernetes.io/blog/2024/08/19/kubernetes-1-31-pod-failure-policy-for-jobs-goes-ga/)
- For a hands-on guide to using Pod failure policy, including the use of FailIndex, see
  [Handling retriable and non-retriable pod failures with Pod failure policy](/docs/tasks/job/pod-failure-policy/)
- Read the documentation for
  [Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index) and
  [Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
- Read the KEP for the [Backoff Limits Per Index For Indexed Jobs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs)

## Get involved

This work was sponsored by
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) community.

If you are interested in working on new features in the space we recommend
subscribing to our [Slack](https://kubernetes.slack.com/messages/wg-batch)
channel and attending the regular community meetings.
