---
layout: blog
title: "Kubernetes 1.33: Job's SuccessPolicy Goes GA"
date: 2025-04-23
draft: true
slug: kubernetes-1-33-jobs-success-policy-goes-ga
authors: >
  [Yuki Iwai](https://github.com/tenzen-y) (CyberAgent, Inc)
---

On behalf of the Kubernetes project, I'm pleased to announce that Job _success policy_ has graduated to General Availability (GA) as part of the v1.33 release.

## About Job's Success Policy

In batch workloads, you might want to use leader-follower patterns like [MPI](https://en.wikipedia.org/wiki/Message_Passing_Interface),
in which the leader controls the execution, including the followers' lifecycle.

In this case, you might want to mark it as succeeded
even if some of the indexes failed. Unfortunately, a leader-follower Kubernetes Job that didn't use a success policy, in most cases, would have to require **all** Pods to finish successfully
for that Job to reach an overall succeeded state.

For Kubernetes Jobs, the API allows you to specify the early exit criteria using the `.spec.successPolicy`
field (you can only use the `.spec.successPolicy` field for an [indexed Job](/docs/concept/workloads/controllers/job/#completion-mode)).
Which describes a set of rules either using a list of succeeded indexes for a job, or defining a minimal required size of succeeded indexes. 

This newly stable field is especially valuable for scientific simulation, AI/ML and High-Performance Computing (HPC) batch workloads.
Users in these areas often run numerous experiments and may only need a specific number to complete successfully, rather than requiring all of them to succeed. 
In this case, the leader index failure is the only relevant Job exit criteria, and the outcomes for individual follower Pods are handled
only indirectly via the status of the leader index.
Moreover, followers do not know when they can terminate themselves.

After Job meets any __Success Policy__, the Job is marked as succeeded, and all Pods are terminated including the running ones.

## How it works

The following excerpt from a Job manifest, using `.successPolicy.rules[0].succeededCount`, shows an example of
using a custom success policy:

```yaml
  parallelism: 10
  completions: 10
  completionMode: Indexed
  successPolicy:
    rules:
    - succeededCount: 1
```

Here, the Job is marked as succeeded when one index succeeded regardless of its number.
Additionally, you can constrain index numbers against `succeededCount` in `.successPolicy.rules[0].succeededCount`
as shown below:

```yaml
parallelism: 10
completions: 10
completionMode: Indexed
successPolicy:
  rules:
  - succeededIndexes: 0 # index of the leader Pod
    succeededCount: 1
```

This example shows that the Job will be marked as succeeded once a Pod with a specific index (Pod index 0) has succeeded.

Once the Job either reaches one of the `successPolicy` rules, or achieves its `Complete` criteria based on `.spec.completions`,
the Job controller within kube-controller-manager adds the `SuccessCriteriaMet` condition to the Job status.
After that, the job-controller initiates cleanup and termination of Pods for Jobs with `SuccessCriteriaMet` condition.
Eventually, Jobs obtain `Complete` condition when the job-controller finished cleanup and termination.

## Learn more

- Read the documentation for
  [success policy](/docs/concepts/workloads/controllers/job/#success-policy).
- Read the KEP for the [Job success/completion policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3998-job-success-completion-policy)

## Get involved

This work was led by the Kubernetes
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) community.

If you are interested in working on new features in the space I recommend
subscribing to our [Slack](https://kubernetes.slack.com/messages/wg-batch)
channel and attending the regular community meetings.
