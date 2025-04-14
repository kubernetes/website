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

In batch workloads, you might want to use leader-follower patterns like [MPI](https://en.wikipedia.org/wiki/Message_Passing_Interface),
in which the leader controls the execution, including the followers' lifecycle.

In this case, you might want to mark it as succeeded
even if some the indexes failed. Unfortunately, the Kubernetes Job without __Success Policy__, in most cases,
requires all Pods to finish successfully for a Job to reach succeeded state.

Job's __Success Policy__ allows you to specify the early exit criteria using the `.spec.successPolicy` 
field only for the [Indexed Job](/docs/concept/workloads/controllers/job/#completion-mode). 
Which describes a set of rules either using a list of succeeded indexes for a job, or defining a minimal required size of succeeded indexes. 

This feature is especially useful for the scientific simulation workloads, AI/ML and High-Performance computing batch workloads. 
In those workloads users perform various simulations and might not necessarily care about all the experiments to complete successfully,
rather they require only a certain number of them to finish successfully. 
In this case, the leader index failure is only the Job's failure criteria, and followers results are relevant
only indirectly via the status of the leader index.
Moreover, followers do not know when they can terminate themselves.

After Job meets any __Success Policy__, the Job is marked as succeeded, and all Pods are terminated including the running ones.

## How it works

The below Job spec with `.successPolicy.rules[0].succeededCount` shows an example of __Success Policy__ feature:

```yaml
parallelism: 10
completions: 10
completionMode: Indexed
successPolicy:
  rules:
  - succeededCount: 1
```

Here, the Job is marked as succeeded when one index succeeded regardless of its number.
Additionally, we can constrain index numbers against `succeededCount` in `.successPolicy.rules[0].succeededCount`
as shown below:

```yaml
parallelism: 10
completions: 10
completionMode: Indexed
successPolicy:
  rules:
  - succeededIndexes: 0
    succeededCount: 1
```

This example shows that the Job is marked as succeeded when one of the indexes 0 succeeded.

Once the Job reaches the one of successPolicy rules or `Complete` criteria like `.spec.backoffLimit`,
the kube-controller-manager job-controller adds the `SuccessCriteriaMet` condition to the Job condition.
After that, the job-controller executes terminating processes like terminating running Pods against Jobs with `SuccessCriteriaMet` condition. 

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
