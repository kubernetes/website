---
layout: blog
title: "Kubernetes 1.26: Pod Scheduling Readiness"
date: 2022-12-26
slug: pod-scheduling-readiness-alpha
author: >
  Wei Huang (Apple),
  Abdullah Gharaibeh (Google)
---

Kubernetes 1.26 introduced a new Pod feature: _scheduling gates_. In Kubernetes, scheduling gates
are keys that tell the scheduler when a Pod is ready to be considered for scheduling.

## What problem does it solve?

When a Pod is created, the scheduler will continuously attempt to find a node that fits it. This
infinite loop continues until the scheduler either finds a node for the Pod, or the Pod gets deleted.

Pods that remain unschedulable for long periods of time (e.g., ones that are blocked on some external event) 
waste scheduling cycles. A scheduling cycle may take ≅20ms or more depending on the complexity of
the Pod's scheduling constraints. Therefore, at scale, those wasted cycles significantly impact the
scheduler's performance. See the arrows in the "scheduler" box below.

{{< mermaid >}}
graph LR;
  pod((New Pod))-->queue
  subgraph Scheduler
    queue(scheduler queue)
    sched_cycle[/scheduling cycle/]
    schedulable{schedulable?}
    
    queue==>|Pop out|sched_cycle
    sched_cycle==>schedulable
    schedulable==>|No|queue
    subgraph note [Cycles wasted on keep rescheduling 'unready' Pods]
    end
  end
  
 classDef plain fill:#ddd,stroke:#fff,stroke-width:1px,color:#000;
 classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
 classDef Scheduler fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
 classDef note fill:#edf2ae,stroke:#fff,stroke-width:1px;
 class queue,sched_cycle,schedulable k8s;
 class pod plain;
 class note note;
 class Scheduler Scheduler;
{{< /mermaid >}}

Scheduling gates helps address this problem. It allows declaring that newly created Pods are not
ready for scheduling. When scheduling gates are present on a Pod, the scheduler ignores the Pod
and therefore saves unnecessary scheduling attempts. Those Pods will also be ignored by Cluster
Autoscaler if you have it installed in the cluster.

Clearing the gates is the responsibility of external controllers with knowledge of when the Pod
should be considered for scheduling (e.g., a quota manager).

{{< mermaid >}}
graph LR;
  pod((New Pod))-->queue
  subgraph Scheduler
    queue(scheduler queue)
    sched_cycle[/scheduling cycle/]
    schedulable{schedulable?}
    popout{Pop out?}
    
    queue==>|PreEnqueue check|popout
    popout-->|Yes|sched_cycle
    popout==>|No|queue
    sched_cycle-->schedulable
    schedulable-->|No|queue
    subgraph note [A knob to gate Pod's scheduling]
    end
  end
  
 classDef plain fill:#ddd,stroke:#fff,stroke-width:1px,color:#000;
 classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
 classDef Scheduler fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
 classDef note fill:#edf2ae,stroke:#fff,stroke-width:1px;
 classDef popout fill:#f96,stroke:#fff,stroke-width:1px;
 class queue,sched_cycle,schedulable k8s;
 class pod plain;
 class note note;
 class popout popout;
 class Scheduler Scheduler;
{{< /mermaid >}}

## How does it work?

Scheduling gates in general works very similar to Finalizers. Pods with a non-empty 
`spec.schedulingGates` field will show as status `SchedulingGated` and be blocked from
scheduling. Note that more than one gate can be added, but they all should be added upon Pod
creation (e.g., you can add them as part of the spec or via a mutating webhook).

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
Specifically, the manager could add a `example.com/quota-check` scheduling gate to all Pods created in the
cluster (using a mutating webhook). The manager would then remove the gate when there is quota to
start the Pod.

## Whats next?

To use this feature, the `PodSchedulingReadiness` feature gate must be enabled in the API Server
and scheduler. You're more than welcome to test it out and tell us (SIG Scheduling) what you think!

## Additional resources

- [Pod Scheduling Readiness](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
 in the Kubernetes documentation
- [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness/README.md)
