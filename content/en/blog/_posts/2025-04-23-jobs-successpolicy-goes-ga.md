---
layout: blog
title: "Kubernetes 1.33: Job's SuccessPolicy Goes GA"
date: 2025-04-23
slug: kubernetes-1-33-jobs-success-policy-goes-ga
authors: >
  [Yuki Iwai](https://github.com/tenzen-y) (CyberAgent, Inc)
---

We're pleased to announce that Job's __Success Policy__ will  graduate to General Availability (GA) as part of Kubernetes v1.33 release.

## About Job's Success Policy

In batch workloads, you might want to use leader-follower pattern
which is the leader role process controls a whole batch workload, and the follower role processes execute actual batch processing.

In this case, you might want to mark it as succeeded
even if some the indexes failed. Unfortunately, the Kubernetes Job without __Success Policy__ requires in most cases all Pods succeeded for Job succeeded.

Job's __Success Policy__ allows you to specify the early exit criteria for a Job using  the `.spec.successPolicy` 
field only for the [Indexed Job](/docs/concept/workloads/controllers/job/#completion-mode). 
Which describes a set of rules either using a list of succeeded indexes for a job, or defining a minimal required size of succeeded indexes. 

This feature is especially useful for the scientific simulation workloads and AI/ML or High-Performance computing batch workloads.
The scientific workloads sometimes perform simulations with different parameters and do not want to care about the number of successful experiments.
The AI/ML or High-Performance computing workloads sometimes use leader-follower patterns like MPI, in which the leader controls everything, including the followers' lifecycle.
In this case, the Job failure criteria are leader index failure, and followers failure do not indicate Job failure.
Additionally, followers do not know when they can terminate themselves.

After Job meets any __Success Policy__, the Job is marked as succeeded, and all Pods are terminated including running ones.

## How it works

The below Job spec with `.successPolicy.rules[0].succeededCount` shows the example of __Success Policy__ feature:

```yaml
parallelism: 10
completions: 10
completionMode: Indexed
successPolicy:
  rules:
  - succeededCount: 1
```

In this example, the Job is marked as succeeded when one index succeeded regardless of index number.
Additionally, we can add constraints for index numbers against `succeededCount` to `.successPolicy.rules[0].succeededCount`
as shown below:

```yaml
parallelism: 10
completions: 10
completionMode: Indexed
successPolicy:
  rules:
  - succeededIndexes: 0,2-4
    succeededCount: 1
```

This example shows that the Job is marked as succeeded when one of the indexes 0, 2, 3, or 4 succeeded.

## Learn more

- Read the documentation for
  [Success Policy](/docs/concepts/workloads/controllers/job/#success-policy)
- Read the KEP for the [Job success/completion policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3998-job-success-completion-policy)

## Get involved

This work was sponsored by
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) community.

If you are interested in working on new features in the space we recommend
subscribing to our [Slack](https://kubernetes.slack.com/messages/wg-batch)
channel and attending the regular community meetings.
