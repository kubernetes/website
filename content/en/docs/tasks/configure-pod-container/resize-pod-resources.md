---
title: Resize CPU and Memory Resources assigned to Pods
content_type: task
weight: 30
min-kubernetes-server-version: 1.36
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodLevelResourcesVerticalScaling" >}}

This page explains how to change the CPU and memory resources set at the Pod level without recreating the Pod.

The In-place Pod Resize feature allows modifying resource allocations for a running Pod, avoiding application disruption. The process for resizing individual container resources is covered in [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).

This page highlights in-place Pod-level resources resize. Pod-level resources
are defined in `spec.resources` and act as the upper bound on the aggregate resources
consumed by all containers in the Pod. In-place Pod-level resize lets you change
these aggregate CPU and memory allocations for a running Pod directly.

**Key Concepts:**

* **Desired Resources (`spec.resources`):** The mutable Pod-level CPU and memory
  `requests` and `limits` updated through the Pod's `/resize` subresource.
* **Actual Resources (`status.resources`):** The Pod-level resource requests and
  limits currently configured for the running Pod on the node (including any
  `spec.overhead`; for limits, overhead is added only to non-zero limits).
* **Allocated Resources (`status.allocatedResources`):** The total resource
  requests admitted and allocated for the Pod by the kubelet on the node
  (including any `spec.overhead`). When a resize is pending or in progress, the
  scheduler accounts for the maximum of desired, allocated, and actual requests.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* The `kubectl` client version must be at least v1.32 to use the `--subresource=resize` flag.
* Using a container runtime version that supports the CRI `UpdatePodSandboxResources` API
  (such as recent versions of containerd or CRI-O) on Linux worker nodes is recommended so the
  runtime stays in sync with Pod-level resource updates (on runtimes that do not implement it
  yet, kubelet proceeds best-effort).

## Pod Resize Status and Retry Logic

The mechanism the `kubelet` uses to track and retry resource changes is shared between container-level and Pod-level resize requests.

The statuses, reasons, and retry priorities are identical to those defined for container resize:

* **Status Conditions:** The `kubelet` uses `PodResizePending` (with reasons `Infeasible` or `Deferred`) and `PodResizeInProgress` to communicate the state of the request.

* **Retry Priority:** Deferred resizes are retried based on `PriorityClass`, then QoS class (`Guaranteed` over `Burstable`), and finally by the duration they have been deferred.

* **Tracking:** You can use the `observedGeneration` fields to track which Pod specification (`metadata.generation`) corresponds to the status of the latest processed resize request.

For a full description of these conditions and retry logic, refer to the [Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status) section in the container resize documentation.

## Container Resize Policy and Pod-Level Resize

Pod-level resource resize does not support or require its own restart policy.

* **No Pod-Level Policy:** Changes to the Pod's aggregate resources (`spec.resources`) are always applied in-place without triggering a Pod-wide restart. This is because Pod-level resources act as an overall constraint on the Pod's cgroup and do not directly manage the application runtime within containers.

* **[Container Policy](/docs/tasks/configure-pod-container/resize-container-resources/#container-resize-policies) Still Governs:** The `resizePolicy` must still be configured at the container level (`spec.containers[*].resizePolicy`, and `spec.initContainers[*].resizePolicy` for sidecar containers). This policy governs whether an individual container is restarted when its effective resource requests or limits change, regardless of whether that change was initiated by a direct container-level resize or by an update to the Pod-level resource specification.

## Limitations

For Kubernetes {{< skew currentVersion >}}, resizing Pod-level resources in-place is subject to all the limitations described for container-level resource resize, which you can find here: [Resize CPU and Memory Resources assigned to Containers: Limitations](/docs/tasks/configure-pod-container/resize-container-resources/#limitations).

Additionally, the following constraints are specific to Pod-level resource resize:

* **Container Requests Validation:** A resize is only permitted if the resulting
  Pod-level resource requests (`spec.resources.requests`) are greater than or equal to
  the effective aggregate resource requests of the containers in the Pod (including
  init and sidecar containers). This maintains the minimum guaranteed resource
  availability for the Pod.

* **Container Limits Validation:** A resize is permitted only if each individual
  container's limit (including init and sidecar containers) is less than or equal to
  the Pod-level resource limit (`spec.resources.limits`). The Pod-level limit serves
  as a boundary that no single container may exceed, while the sum of container CPU
  or memory limits is permitted to exceed the Pod-level limit, enabling resource
  sharing across containers within the Pod.

* **Resource Removal:** You can add or modify Pod-level CPU and memory requests and
  limits on a running Pod without changing its QoS class, but once `spec.resources`
  or an individual Pod-level request or limit is set, it cannot be removed.

* **Swap (`LimitedSwap`):** On nodes configured with `LimitedSwap`, a swap-eligible
  Pod's cgroup swap limit is configured at Pod creation rather than resized in place.
  Resizes that change Pod swap eligibility, change effective Pod memory requests for a
  swap-eligible Pod, or add Pod-level resources to a running swap-enabled container-only
  Pod are rejected as `Infeasible`, even if containers set `RestartContainer` as their
  memory resize policy. (CPU-only resizes, memory limit changes that preserve swap
  eligibility, and resizes on non-swap-eligible Pods remain allowed.)

## Example: Resizing Pod-Level Resources

First, create a Pod with `pause` configured for in-place CPU resize (`NotRequired`) and `nginx-server` configured to restart on CPU resize (`RestartContainer`) without explicit container-level limits.

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

Observe `spec.resources`, `status.resources`, and `status.allocatedResources`
(`200m` CPU, `200Mi` memory). Note that
`status.containerStatuses[0].restartCount` (`pause`) and
`status.containerStatuses[1].restartCount` (`nginx-server`) are both `0`.

Now, increase the pod-level CPU request and limit to `300m`. You use `kubectl patch` with the `--subresource resize` command line argument.

```shell
kubectl patch pod pod-level-resize-demo --subresource resize --patch \
  '{"spec":{"resources":{"requests":{"cpu":"300m"}, "limits":{"cpu":"300m"}}}}'

# Alternative methods:
# kubectl edit pod pod-level-resize-demo --subresource resize
# kubectl apply -f <updated-manifest> --subresource resize --server-side
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
* Once the resize completes, `status.resources` and `status.allocatedResources`
  reflect `cpu: 300m`.
* `status.containerStatuses[0].restartCount` (`pause`) remains `0`, because its
  CPU `resizePolicy` is `NotRequired`.
* `status.containerStatuses[1].restartCount` (`nginx-server`) increased to `1`,
  indicating the container was restarted to apply the CPU change. Because
  `nginx-server` did not define an explicit container-level CPU limit, it
  inherited the Pod-level CPU limit as its effective limit. Updating
  `spec.resources.limits.cpu` from `200m` to `300m` changed that effective limit,
  so the `kubelet` honored `nginx-server`'s `RestartContainer` CPU resize policy
  and restarted the container.

## Clean up

Delete the pod:

```shell
kubectl delete pod pod-level-resize-demo
```

## {{% heading "whatsnext" %}}


### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)

### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
