---
title: "Pod Conditions"
content_type: concept
weight: 35
---

In Kubernetes, many objects have _conditions_. 
Conditions are markers for some aspect of the actual state of the thing the object represents.
Pods have conditions, and Kubernetes Pod conditions are an important aspect of how controllers
(and people doing troubleshooting) can understand the health of a Pod.

A Pod's [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) provides a high-level
summary of where the Pod is in its lifecycle, but a single value cannot capture the full
picture. For example, a Pod may be in the `Running` phase but not yet ready to serve traffic.
Pod conditions complement the phase by tracking multiple aspects of the Pod's state
independently, such as whether it has been scheduled, whether its containers are ready,
whether a resize is in progress, or whether the Pod is about to be disrupted due to a
{{< glossary_tooltip text="taint" term_id="taint" >}}.

## Structure of a Pod condition

A Pod's status includes an array of
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
that indicate whether the Pod has passed certain checkpoints.

Each element of the PodCondition array has the following fields:

{{< table caption="Fields of a PodCondition" >}}
| Field name           | Description                                                                                          |
|:---------------------|:-----------------------------------------------------------------------------------------------------|
| `type`               | Name of this Pod condition.                                                                          |
| `status`             | Indicates whether that condition is applicable, with possible values `"True"`, `"False"`, or `"Unknown"`. |
| `lastProbeTime`      | Timestamp of when the Pod condition was last probed.                                                 |
| `lastTransitionTime` | Timestamp for when the Pod last transitioned from one status to another.                             |
| `reason`             | Machine-readable, UpperCamelCase text indicating the reason for the condition's last transition.     |
| `message`            | Human-readable message indicating details about the last status transition.                          |
| `observedGeneration` | The `.metadata.generation` of the Pod at the time the condition was recorded. See [Pod generation](/docs/concepts/workloads/pods/#pod-generation). |
{{< /table >}}

## Built-in Pod conditions {#built-in-pod-conditions}

Kubernetes manages the following Pod conditions:

[Lifecycle conditions](#lifecycle-pod-conditions): set as a Pod progresses through its lifecycle, roughly in this order:
`PodScheduled`, `PodReadyToStartContainers`, `Initialized`, `ContainersReady`, `Ready`.

[Other conditions](#other-pod-conditions): set in response to specific operations or events:
`DisruptionTarget`, `PodResizePending`, `PodResizeInProgress`.

In addition to the built-in conditions above, you can define custom conditions
using [Pod readiness gates](#pod-readiness).

## Lifecycle Pod conditions {#lifecycle-pod-conditions}

As a Pod progresses through its lifecycle, the kubelet sets the following conditions roughly in this order:

1. `PodScheduled`: the Pod has been scheduled to a node.
1. `PodReadyToStartContainers`: the Pod sandbox has been successfully created and networking configured. The sandbox and network are set up by the {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} and {{< glossary_tooltip text="CNI" term_id="cni" >}} plugin.
1. `Initialized`: all [init containers](/docs/concepts/workloads/pods/init-containers/) have completed successfully. For a Pod without init containers, this is set to `True` before sandbox creation.
1. `ContainersReady`: all containers in the Pod are ready. A container's readiness is determined by its [readiness probe](/docs/concepts/configuration/liveness-readiness-startup-probes/), if configured.
1. `Ready`: the Pod is able to serve requests and should be added to the load balancing pools of all matching [Services](/docs/concepts/services-networking/service/). Pods that are not `Ready` are removed from Service endpoints.

{{< note >}}
The `Ready` condition depends on more than just `ContainersReady`. If the Pod specifies `readinessGates`, all of those custom conditions must also be `True` for the Pod to be `Ready`. See [Pod readiness](#pod-readiness) for details.
{{< /note >}}

You can inspect a Pod's conditions using kubectl:

```shell
kubectl get pod <pod-name> -o yaml
```

The following shows what `status.conditions` looks like for a running Pod:

```yaml
status:
  conditions:
    - type: PodScheduled
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: PodReadyToStartContainers
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:16Z"
      observedGeneration: 1
    - type: Initialized
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: ContainersReady
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
    - type: Ready
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
```

### PodReadyToStartContainers {#pod-ready-to-start-containers}

{{< feature-state feature_gate_name="PodReadyToStartContainersCondition" >}}

{{< note >}}
During its early development, this condition was named `PodHasNetwork`.
{{< /note >}}

After a Pod gets scheduled on a node, it needs to be admitted by the kubelet
and to have any required storage volumes mounted. Once these phases are complete,
the kubelet works with a container runtime
(using {{< glossary_tooltip text="Container Runtime Interface (CRI)" term_id="cri" >}})
to set up a runtime sandbox and configure networking for the Pod.
If the `PodReadyToStartContainersCondition` feature gate is enabled
(it is enabled by default for Kubernetes {{< skew currentVersion >}}),
the `PodReadyToStartContainers` condition will be added to the `status.conditions` field of a Pod.

The `PodReadyToStartContainers` condition is set to `False` by the kubelet
when it detects a Pod does not have a runtime sandbox with networking configured. This occurs in the following scenarios:

- Early in the lifecycle of the Pod, when the kubelet has not yet begun to set up a sandbox for the Pod using the container runtime.
- Later in the lifecycle of the Pod, when the Pod sandbox has been destroyed due to either:
  - the node rebooting, without the Pod getting evicted
  - for container runtimes that use virtual machines for isolation, the Pod sandbox virtual machine rebooting, which then requires creating a new sandbox and fresh container network configuration.

The `PodReadyToStartContainers` condition is set to `True` by the kubelet after the successful completion of sandbox creation and network configuration for the Pod by the runtime plugin. The kubelet can start pulling container images and create containers after `PodReadyToStartContainers` condition has been set to `True`.

For a Pod with init containers, the kubelet sets the `Initialized` condition to `True` after the init containers have successfully completed (which happens after successful sandbox creation and network configuration by the runtime plugin). For a Pod without init containers, the kubelet sets the `Initialized` condition to `True` before sandbox creation and network configuration starts.

## Other Pod conditions {#other-pod-conditions}

The following conditions are not part of the normal Pod lifecycle progression.
They are set in response to specific operations or events.

### DisruptionTarget {#disruption-target}

A dedicated Pod `DisruptionTarget` condition is added to indicate that
the Pod is about to be deleted due to a {{<glossary_tooltip term_id="disruption" text="disruption">}}.
The `reason` field of the condition additionally
indicates one of the following reasons for the Pod termination:

`PreemptionByScheduler`
: Pod is due to be {{<glossary_tooltip term_id="preemption" text="preempted">}} by a scheduler in order to accommodate a new Pod with a higher priority. For more information, see [Pod priority preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

`DeletionByTaintManager`
: Pod is due to be deleted by Taint Manager (which is part of the node lifecycle controller within `kube-controller-manager`) due to a `NoExecute` taint that the Pod does not tolerate; see {{<glossary_tooltip term_id="taint" text="taint">}}-based evictions.

`EvictionByEvictionAPI`
: Pod has been marked for {{<glossary_tooltip term_id="api-eviction" text="eviction using the Kubernetes API">}} .

`DeletionByPodGC`
: Pod, that is bound to a no longer existing Node, is due to be deleted by [Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection).

`TerminationByKubelet`
: Pod has been terminated by the kubelet, because of either {{<glossary_tooltip term_id="node-pressure-eviction" text="node pressure eviction">}},
  the [graceful node shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown),
  or preemption for [system critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).

In all other disruption scenarios, like eviction due to exceeding
[Pod container limits](/docs/concepts/configuration/manage-resources-containers/),
Pods don't receive the `DisruptionTarget` condition because the disruptions were
probably caused by the Pod and would reoccur on retry.

{{< note >}}
A Pod disruption might be interrupted. The control plane might re-attempt to
continue the disruption of the same Pod, but it is not guaranteed. As a result,
the `DisruptionTarget` condition might be added to a Pod, but that Pod might then not actually be
deleted. In such a situation, after some time, the
Pod disruption condition will be cleared.
{{< /note >}}

Along with cleaning up the pods, the Pod garbage collector (PodGC) will also mark them as failed if they are in a non-terminal
phase (see also [Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)).

When using a Job (or CronJob), you may want to use these Pod disruption conditions as part of your Job's
[Pod failure policy](/docs/concepts/workloads/controllers/job#pod-failure-policy).

For more details, see [Disruptions](/docs/concepts/workloads/pods/disruptions/).

### PodResizePending and PodResizeInProgress {#pod-resize-conditions}

The kubelet updates the Pod's status conditions to indicate the state of a resize request:

- `type: PodResizePending`: The kubelet cannot immediately grant the request. The `message` field provides an explanation of why.
  - `reason: Infeasible`: The requested resize is impossible on the current node (for example, requesting more resources than the node has).
  - `reason: Deferred`: The requested resize is currently not possible, but might become feasible later (for example if another pod is removed). The kubelet will retry the resize.
- `type: PodResizeInProgress`: The kubelet has accepted the resize and allocated resources, but the changes are still being applied. This is usually brief but might take longer depending on the resource type and runtime behavior. Any errors during actuation are reported in the `message` field (along with `reason: Error`).

If the requested resize is _Deferred_, the kubelet will periodically re-attempt the resize, for example when another pod is removed or scaled down.

For more details on Pod resize, see [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).

## Enhanced Pod readiness

Your application can inject extra feedback or signals into the Pod's `.status`;
this is known as _enhanced Pod readiness_.
To use this, set `readinessGates` in the Pod's `spec` to specify a list of additional
conditions that the kubelet evaluates for Pod readiness.
You then implement, or install, a controller that manages these custom conditions,
and the kubelet uses that as an extra input to decide if the Pod is ready.

Readiness gates are determined by the current state of `status.condition` fields for the Pod.
If Kubernetes cannot find such a condition in the `status.conditions` field of a Pod, the status of the condition is defaulted to "`False`".

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # a built-in PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # an extra PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

The Pod conditions you add must have names that meet the Kubernetes [label key format](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set).

### Status for Pod readiness

To set these `status.conditions` for the Pod, applications and
{{< glossary_tooltip term_id="operator-pattern" text="operators">}} should use
the `PATCH` action on the Pod's status subresource. You can use `kubectl patch`
with `--subresource=status`, or a [Kubernetes client library](/docs/reference/using-api/client-libraries/) to write
code that sets custom Pod conditions for Pod readiness.

For a Pod that uses custom conditions, that Pod is evaluated to be ready **only** when both the following statements apply:

- All containers in the Pod are ready.
- All conditions specified in `readinessGates` are `True`.

When a Pod's containers are Ready but at least one custom condition is missing or `False`,
the kubelet sets the Pod's `Ready` condition to `status: "False"` with `reason: ReadinessGatesNotReady`.

## {{% heading "whatsnext" %}}

- Learn about the [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
- Learn about [Disruptions](/docs/concepts/workloads/pods/disruptions/).
- Learn about [container probes](/docs/concepts/configuration/liveness-readiness-startup-probes/) and how they affect Pod readiness.
- Learn how to [resize Pod resources in-place](/docs/tasks/configure-pod-container/resize-container-resources/).
