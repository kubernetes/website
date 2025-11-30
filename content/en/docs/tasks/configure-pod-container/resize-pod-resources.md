---
title: Resize CPU and Memory Resources assigned to Containers
content_type: task
weight: 30
min-kubernetes-server-version: 1.35
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodLevelResourcesVerticalScaling" >}}

This page explains how to change the CPU and memory resources set at the Pod level without recreating the Pod.

The In-place Pod Resize feature allows modifying resource allocations for a running Pod, avoiding application disruption. The process for resizing individual container resources is covered in [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources).

This page highlights In-place Pod-level resources resize. Pod-level resources
are defined in `spec.resources` and they act as the upper bound on the aggregate resources
consumed by all containers in the Pod. The In-place Pod-level resources resize feature
lets you change these aggregate CPU and memory allocations for a running Pod directly.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

The following [feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled for your control plane and for all nodes in your cluster:

* [`InPlacePodLevelResourcesVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodLevelResourcesVerticalScaling)
* [`PodLevelResources`](/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResources)
* [`InPlacePodVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScaling)
* [`NodeDeclaredFeatures`](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)

The kubectl client version must be at least v1.32 to use the `--subresource=resize` flag.

## Pod Resize Status and Retry Logic

The mechanism the `kubelet` uses to track and retry resource changes is shared between container-level and Pod-level resize requests.

The statuses, reasons, and retry priorities are identical to those defined for container resize:

* Status Conditions: The `kubelet` uses PodResizePending (with reasons like Infeasible or Deferred) and PodResizeInProgress to communicate the state of the request.

* Retry Priority: Deferred resizes are retried based on PriorityClass, then QoS class (Guaranteed over Burstable), and finally by the duration they have been deferred.

* Tracking: You can use the `observedGeneration` fields to track which Pod specification (metadata.generation) corresponds to the status of the latest processed resize request.

For a full description of these conditions and retry logic, please refer to the [Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status) section in the container resize documentation.

## Container Resize Policy and Pod-Level Resize

Pod-level resource resize does not support or require its own restart policy.

* No Pod-Level Policy: Changes to the Pod's aggregate resources (spec.resources) are always applied in-place without triggering a restart. This is because Pod-level resources act as an overall constraint on the Pod's cgroup and do not directly manage the application runtime within containers.

* [Container Policy](/docs/tasks/configure-pod-container/resize-container-resources/#container-resize-policies) Still Governs: The resizePolicy must still be configured at the container level (spec.containers[*].resizePolicy). This policy governs whether an individual container is restarted when its resource requests or limits change, regardless of whether that change was initiated by a direct container-level resize or by an update to the overall Pod-level resource envelope.

## Limitations

For Kubernetes {{< skew currentVersion >}}, resizing Pod-level resources in-place is subject to all the limitations described for container-level resource resize, which you can find here: (Resize CPU and Memory Resources assigned to Containers: Limitations)[docs/tasks/configure-pod-container/resize-container-resources/#limitations].

Additionally, the following constraint is specific to Pod-level resource resize:
* Container Requests Validation: A resize is only permitted if the resulting
  Pod-level resource requests (spec.resources.requests) are greater than or equal to
  the sum of the corresponding resource requests from all individual containers
  within the Pod. This maintains the minimum guaranteed resource availability for
  the Pod.

* Container Limits Validation: A resize is permitted if individual container limits
  are less than or equal to the Pod-level resource limits (spec.resources.limits).
  The Pod-level limit serves as a boundary that no single container may exceed, but
  the sum of container limits is permitted to exceed the Pod-level limit, enabling
  resource sharing across containers within the Pod.

## Example: Resizing Pod-Level Resources

First, create a Pod designed for in-place CPU resize and restart-required memory resize.

{{% code_sample file="pods/resource/pod-level-resize.yaml" %}}

Create the pod:

```shell
kubectl create -f pod-level-resize.yaml
```

This pod starts in the Guaranteed QoS class as pod-level requests are equal to limits. Verify its initial state:

```shell
# Wait a moment for the pod to be running
kubectl get pod pod-level-resize-demo --output=yaml
```

Observe the `spec.resources`(200m CPU, 200Mi memory). Note the
`status.containerStatuses[0].restartCount` (should be 0) and
`status.containerStatuses[1].restartCount` (should be 0).

Now, increase the pod-level CPU request and limit to `300m`. You use `kubectl patch` with the `--subresource resize` command line argument.

```shell
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"resources":{"requests":{"cpu":"300m"}, "limits":{"cpu":"300m"}}}}'

# Alternative methods:
# kubectl -n qos-example edit pod resize-demo --subresource resize
# kubectl -n qos-example apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
The `--subresource resize` command line argument requires `kubectl` client version v1.32.0 or later.
Older versions will report an `invalid subresource` error.
{{< /note >}}

Check the pod status again after patching:

```shell
kubectl get pod pod-level-resize-demo --output=yaml
```

You should see:
* `spec.resources.requests` and `spec.resources.limits` now show `cpu: 300m`.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU
  `resizePolicy` was `NotRequired`.
* `status.containerStatuses[1].restartCount` increased to `1` indicating the
  container was restarted to apply the CPU change. The restart occurred in Container 1 despite the resize being applied at the Pod level, due to the intricate relationship between Pod-level limits and container-level policies. Because Container 1 did not specify an explicit CPU limit, its underlying resource configuration (For example, cgroups) implicitly adopted the Pod's overall CPU limit as its effective maximum consumption boundary. When the Pod-level CPU limit was patched from 200m to 300m, this action consequently changed the implicit limit enforced on Container 1. Since Container 1 had its resizePolicy explicitly set to RestartContainer for CPU, the `kubelet` was obligated to restart the container to correctly apply this change in the underlying resource enforcement mechanism, thus confirming that altering Pod-level limits can trigger container restart policies even when container limits are not directly defined.

## Clean up

Delete the pod:

```shell
kubectl pod-level-resize-demo
```

## {{% heading "whatsnext" %}}


### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
