---
layout: blog
title: "Kubernetes 1.33: Job's Backoff Limit Per Index Goes GA"
date: 2025-04-23
slug: kubernetes-1-33-jobs-backoff-limit-per-index-goes-ga
author: >
  [Michał Woźniak](https://github.com/mimowo) (Google)
---

In Kubernetes v1.33, the _Backoff Limit Per Index_ feature reaches general
availability (GA). This blog describes the Backoff Limit Per Index feature and
its benefits.

## About Backoff Limit Per Index

When you run workloads on Kubernetes, you must consider scenarios where Pod
failures can affect the completion of your workloads. Ideally, your workload
should tolerate transient failures and continue running.

To achieve failure tolerance in Kubernetes Job, you can set the
`spec.backoffLimit` field. This field specifies the total number of tolerated
failures.

However, for workloads where every index is considered independent, like
[embarassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel)
workloads, the `spec.backoffLimit` field is often not flexible enough if you use
Indexed Jobs. For example, integration tests. In that scenario, a fast-failing
index is likely to consume your entire budget for tolerating Pod failures, and
you might not be able to run the other indexes.

In order to address this limitation, we introduce _Backoff Limit Per Index_,
which allows you to control the number of retries per index.

## How Backoff Limit Per Index works

To use Backoff Limit Per Index for Indexed Jobs, configure the following:
* Specify the number of tolerated Pod failures per index with the
  `spec.backoffLimitPerIndex` field. When you set this field, the Job executes
  all indexes by default.
* Specify the cap on the total number of failed indexes by setting the
  `spec.maxFailedIndexes` field. When the limit is exceeded the entire Job is
  terminated.
* Define a short-circuit to detect a failed index by using the `FailIndex` action in the
  [Pod Failure Policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)
  feature.

When the number of tolerated failures is exceeded, the Job marks that index as
failed and lists it in the Job's `status.failedIndexes` field.

### Example

The following Job spec snippet is an example of how to combine Backoff Limit Per
Index with the _Pod Failure Policy_ feature:

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
  containers finished with the exit code 42 - based on the matching "FailIndex"
  rule.
- Retries the first failure of any index, unless the index failed due to the
  matching `FailIndex` rule.
- Fails the entire Job if the number of failed indexes exceeded 5 (set by the
  `spec.maxFailedIndexes` field).

## Learn more

- Read the blog post on the closely related feature of Pod Failure Policy [Kubernetes 1.31: Pod Failure Policy for Jobs Goes GA](/blog/2024/08/19/kubernetes-1-31-pod-failure-policy-for-jobs-goes-ga/)
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
