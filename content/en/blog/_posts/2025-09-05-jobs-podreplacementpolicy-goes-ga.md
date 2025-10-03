---
layout: blog
title: "Kubernetes v1.34: Pod Replacement Policy for Jobs Goes GA"
date: 2025-09-05T10:30:00-08:00
slug: kubernetes-v1-34-pod-replacement-policy-for-jobs-goes-ga
author: >
  [Dejan Zele Pejchev](https://github.com/dejanzele) (G-Research)
---

In Kubernetes v1.34, the _Pod replacement policy_ feature has reached general availability (GA).
This blog post describes the Pod replacement policy feature and how to use it in your Jobs.

## About Pod Replacement Policy

By default, the Job controller immediately recreates Pods as soon as they fail or begin terminating (when they have a deletion timestamp).

As a result, while some Pods are terminating, the total number of running Pods for a Job can temporarily exceed the specified parallelism.
For Indexed Jobs, this can even mean multiple Pods running for the same index at the same time.

This behavior works fine for many workloads, but it can cause problems in certain cases.

For example, popular machine learning frameworks like TensorFlow and
[JAX](https://jax.readthedocs.io/en/latest/) expect exactly one Pod per worker index.
If two Pods run at the same time, you might encounter errors such as:
```
/job:worker/task:4: Duplicate task registration with task_name=/job:worker/replica:0/task:4
```

Additionally, starting replacement Pods before the old ones fully terminate can lead to:
- Scheduling delays by kube-scheduler as the nodes remain occupied.
- Unnecessary cluster scale-ups to accommodate the replacement Pods.
- Temporary bypassing of quota checks by workload orchestrators like [Kueue](https://kueue.sigs.k8s.io/).

With Pod replacement policy, Kubernetes gives you control over when the control plane
replaces terminating Pods, helping you avoid these issues.

## How Pod Replacement Policy works

This enhancement means that Jobs in Kubernetes have an optional field `.spec.podReplacementPolicy`.  
You can choose one of two policies:
- `TerminatingOrFailed` (default): Replaces Pods as soon as they start terminating.
- `Failed`: Replaces Pods only after they fully terminate and transition to the `Failed` phase.

Setting the policy to `Failed` ensures that a new Pod is only created after the previous one has completely terminated.

For Jobs with a Pod Failure Policy, the default `podReplacementPolicy` is `Failed`, and no other value is allowed.
See [Pod Failure Policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy) to learn more about Pod Failure Policies for Jobs.

You can check how many Pods are currently terminating by inspecting the Job’s `.status.terminating` field:

```shell
kubectl get job myjob -o=jsonpath='{.status.terminating}'
```

## Example

Here’s a Job example that executes a task two times (`spec.completions: 2`) in parallel (`spec.parallelism: 2`) and 
replaces Pods only after they fully terminate (`spec.podReplacementPolicy: Failed`):
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  completions: 2
  parallelism: 2
  podReplacementPolicy: Failed
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: worker
        image: your-image
```

If a Pod receives a SIGTERM signal (deletion, eviction, preemption...), it begins terminating.
When the container handles termination gracefully, cleanup may take some time.

When the Job starts, we will see two Pods running:
```shell
kubectl get pods

NAME                READY   STATUS    RESTARTS   AGE
example-job-qr8kf   1/1     Running   0          2s
example-job-stvb4   1/1     Running   0          2s
```

Let's delete one of the Pods (`example-job-qr8kf`).

With the `TerminatingOrFailed` policy, as soon as one Pod (`example-job-qr8kf`) starts terminating, the Job controller immediately creates a new Pod (`example-job-b59zk`) to replace it.
```shell
kubectl get pods

NAME                READY   STATUS        RESTARTS   AGE
example-job-b59zk   1/1     Running       0          1s
example-job-qr8kf   1/1     Terminating   0          17s
example-job-stvb4   1/1     Running       0          17s
```

With the `Failed` policy, the new Pod (`example-job-b59zk`) is not created while the old Pod (`example-job-qr8kf`) is terminating.
```shell
kubectl get pods

NAME                READY   STATUS        RESTARTS   AGE
example-job-qr8kf   1/1     Terminating   0          17s
example-job-stvb4   1/1     Running       0          17s
```

When the terminating Pod has fully transitioned to the `Failed` phase, a new Pod is created:
```shell
kubectl get pods

NAME                READY   STATUS        RESTARTS   AGE
example-job-b59zk   1/1     Running       0          1s
example-job-stvb4   1/1     Running       0          25s
```

## How can you learn more?

- Read the user-facing documentation for [Pod Replacement Policy](/docs/concepts/workloads/controllers/job/#pod-replacement-policy),
  [Backoff Limit per Index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index), and
  [Pod Failure Policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy).
- Read the KEPs for [Pod Replacement Policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated),
  [Backoff Limit per Index](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs), and
  [Pod Failure Policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures).


## Acknowledgments

As with any Kubernetes feature, multiple people contributed to getting this
done, from testing and filing bugs to reviewing code.

As this feature moves to stable after 2 years, we would like to thank the following people:
* [Kevin Hannon](https://github.com/kannon92) - for writing the KEP and the initial implementation.
* [Michał Woźniak](https://github.com/mimowo) - for guidance, mentorship, and reviews.
* [Aldo Culquicondor](https://github.com/alculquicondor) - for guidance, mentorship, and reviews.
* [Maciej Szulik](https://github.com/soltysh) - for guidance, mentorship, and reviews.
* [Dejan Zele Pejchev](https://github.com/dejanzele) - for taking over the feature and promoting it from Alpha through Beta to GA.

## Get involved

This work was sponsored by the Kubernetes
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) community.

If you are interested in working on new features in the space we recommend
subscribing to our [Slack](https://kubernetes.slack.com/messages/wg-batch)
channel and attending the regular community meetings.
