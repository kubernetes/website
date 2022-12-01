---
layout: blog
title: "Kubernetes 1.26: Pod Scheduling Readiness to Alpha"
date: 2022-11-29
slug: pod-scheduling-readiness-alpha-1-26
---

**Author:** Wei Huang (Apple), Abdullah Gharaibeh (Google)

Kubernetes 1.26 introduced a new Pod feature: _scheduling gates. In Kubernetes, scheduling gates
are keys that tell the scheduler when a Pod is ready to be considered for scheduling.

## What problem does it solve?

When a Pod is created, the scheduler will continuously attempt to find a node that fits it. This
infinite loop continues until the scheduler either finds a node for the Pod, or the Pod gets deleted.

Pods that remain unschedulable for long periods of time (e.g., one that is blocked on some external event) 
waste scheduling cycles. A scheduling cycle may take ~20ms or more depending on the complexity of
the Pod's scheduling constraints. Therefore, at scale, those wasted cycles significantly impact the
scheduler's performance. See the cycle in red arrows below.

![](./scheduler-workflow-1.png)

Scheduling gates helps address this problem. It allows declaring that newly created Pods are not
ready for scheduling. When scheduling gates are present on a Pod, the scheduler ignores the Pod
and therefore saves unnecessary scheduling attempts. Clearing the gates is the responsibility of
external controllers with knowledge of when the Pod should be considered for scheduling (e.g., 
a resource provisioner).

![](scheduler-workflow-2.png)

## How does it work?

Scheduling gates in general works very similar to Finalizers. Pods with non-empty 
`spec.schedulingGates` field will show as status `SchedulingGated` and be blocked from
scheduling. Note that more than one gate can be added, but they all should be added upon Pod
creation (e.g., you can add them as part of the spec of via a mutating webhook).

```
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          10s
```

To clear the gates, you update the Pod by removing all of the items from the Pod's `schedulingGates`
field. The gates do not need to be removed all at once, but only when all the gates are removed the
scheduler will start to consider the Pod for scheduling.

Under the hood, scheduling gates are implemented as a PreEnqueue scheduler plugin, a new scheduler
framework extension point that is invoked at the beginning of each scheduling cycle.

## Use Cases

An important use case this feature enables is dynamic quota management. Kubernetes supports
[ResourceQuota](/docs/concepts/policy/resource-quotas/), however the API Server enforces quota at
the time you attempt Pod creation. For example, if a new Pod exceeds the CPU quota, it gets rejected.
The API Server doesn't queue the Pod; therefore, whoever created the Pod needs to continuously attempt
to recreate it again. This either means a delay between resources becoming available and the Pod
actually running, or it means load on the API server and Scheduler due to constant attempts.

Scheduling gates allows an external quota manager to address the above limitation of ResourceQuota.
Specifically, the manager could add a `example-com/quota-check` scheduling gate to all Pods created in the
cluster (using a mutating webhook). The manager would then remove the gate when there is quota to
start the Pod.

## Whats next?

To use this feature, the `PodSchedulingReadiness` feature gate must be enabled in the API Server
and Scheduler. You're more than welcome to test it out and tell us (sig-scheduling) what you think!

## Additional resources

- [Pod Scheduling Readiness](https://kubernetes.io/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
in the Kubernetes documentation
- [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness/README.md)
