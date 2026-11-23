---
title: Resize CPU and Memory Resources assigned to Containers
content_type: task
weight: 30
min-kubernetes-server-version: 1.33
---


<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

This page explains how to change the CPU and memory resource requests and limits
assigned to a container *without recreating the Pod*.

Traditionally, changing a Pod's resource requirements necessitated deleting the existing Pod
and creating a replacement, often managed by a [workload controller](/docs/concepts/workloads/controllers/).
In-place Pod Resize allows changing the CPU/memory allocation of container(s) within a running Pod
while potentially avoiding application disruption. The process for resizing Pod resources is covered in [Resize CPU and Memory Resources assigned to Pods](/docs/tasks/configure-pod-container/resize-pod-resources).

**Key Concepts:**

* **Desired Resources:** A container's `spec.containers[*].resources` represent
  the *desired* resources for the container, and are mutable for CPU and memory.
* **Actual Resources:** The `status.containerStatuses[*].resources` field
  reflects the resources *currently configured* for a running container.
  For containers that haven't started or were restarted,
  it reflects the resources allocated upon their next start.
* **Triggering a Resize:** You can request a resize by updating the desired `requests`
  and `limits` in the Pod's specification.
  This is typically done using `kubectl patch`, `kubectl apply`, or `kubectl edit`
  targeting the Pod's `resize` subresource.
  When the desired resources don't match the allocated resources,
  the Kubelet will attempt to resize the container.
* **Allocated Resources (Advanced):**
  The `status.containerStatuses[*].allocatedResources` field tracks resource values
  confirmed by the Kubelet, primarily used for internal scheduling logic.
  For most monitoring and validation purposes, focus on `status.containerStatuses[*].resources`.

If a node has pods with a pending or incomplete resize (see [Pod Resize Status](#pod-resize-status) below),
the {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} uses
the *maximum* of a container's desired requests, allocated requests,
and actual requests from the status when making scheduling decisions.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

To enable automatic scheduler preemption for deferred resize requests, the
`InPlacePodVerticalScalingSchedulerPreemption`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled for your control plane.

To dynamically resize memory-backed (`medium: Memory`) `emptyDir` volumes, the `InPlacePodVerticalScalingMemoryBackedVolumes` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) must also be enabled for your control plane and nodes, and the underlying nodes must be running cgroup v2.

To allow pods with certain resource characteristics to be granted increased CPU affinity and exclusivity on the node, the CPU Manager Policy must be set to [static](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-configuration) for your ndodes.

To resize In-place CPU resource of [Pods with Guaranteed Quality of Service](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#guaranteed)(QoS) class which make use of exclusive CPUs using the [static](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-configuration) CPU management policy, the `InPlacePodVerticalScalingExclusiveCPUs`[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) must also be enabled for your nodes.

The `kubectl` client version must be at least v1.32 to use the `--subresource=resize` flag.

## Pod resize status

The Kubelet updates the Pod's status conditions to indicate the state of a resize request:

* `type: PodResizePending`: The Kubelet cannot immediately grant the request.
  The `message` field provides an explanation of why.
    * `reason: Infeasible`: The requested resize is impossible on the current node
      (for example, requesting more resources than the node has).
    * `reason: Deferred`: The requested resize is currently not possible,
      but might become feasible later (for example if another pod is removed).
      The Kubelet will retry the resize.
* `type: PodResizeInProgress`: The Kubelet has accepted the resize and allocated resources,
  but the changes are still being applied.
  This is usually brief but might take longer depending on the resource type and runtime behavior.
  Any errors during actuation are reported in the `message` field (along with `reason: Error`).

### How deferred resizes are retried and preempted

If the requested resize is _Deferred_, the kubelet will periodically re-attempt the resize,
for example when another pod is removed or scaled down.

{{< note >}}
{{< feature-state feature_gate_name="InPlacePodVerticalScalingSchedulerPreemption" >}}

When the `InPlacePodVerticalScalingSchedulerPreemption` feature gate is enabled,
`kube-scheduler` watches for pods with `Deferred` resize status.
If a node lacks sufficient capacity to fulfill a higher-priority Pod's resize
request, the scheduler can preempt (evict) lower-priority pods on that node
to free up the required CPU or memory capacity.
For more details, see
[Preemption for in-place Pod resize](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption-for-in-place-pod-resize).
{{< /note >}}

If there are multiple deferred
resizes, they are retried according to the following priority:

* Pods with a higher Priority (based on PriorityClass) will have their resize request retried first.
* If two pods have the same Priority, resize of guaranteed pods will be retried before the resize of burstable pods.
* If all else is the same, pods that have been in the Deferred state longer will be prioritized.

A higher priority resize being marked as pending will not block the remaining pending resizes from being attempted;
all remaining pending resizes will still be retried even if a higher-priority resize gets deferred again. 


### Leveraging `observedGeneration` Fields

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

* The top-level `status.observedGeneration` field shows the `metadata.generation` corresponding to the latest pod specification that the kubelet has acknowledged. You can use this to determine the most recent resize request the kubelet has processed.
* In the `PodResizeInProgress` condition, the `conditions[].observedGeneration` field indicates the `metadata.generation` of the podSpec when the current in-progress resize was initiated.
* In the `PodResizePending` condition, the `conditions[].observedGeneration` field indicates the `metadata.generation` of the podSpec when the pending resize's allocation was last attempted.

## Container resize policies

You can control whether a container should be restarted when resizing
by setting `resizePolicy` in the container specification.
This allows fine-grained control based on resource type (CPU or memory).

```yaml
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: RestartContainer
```

* `NotRequired`: (Default) Apply the resource change to the running container without restarting it.
* `RestartContainer`: Restart the container to apply the new resource values.
  This is often necessary for memory changes because many applications
  and runtimes cannot adjust their memory allocation dynamically.

If `resizePolicy[*].restartPolicy` is not specified for a resource, it defaults to `NotRequired`.

{{< note >}}
If a Pod's overall `restartPolicy` is `Never`, then any container `resizePolicy` must be `NotRequired` for all resources.
You cannot configure a resize policy that would require a restart in such Pods.
{{< /note >}}

**Example Scenario:**

Consider a container configured with `restartPolicy: NotRequired` for CPU and `restartPolicy: RestartContainer` for memory.
* If only CPU resources are changed, the container is resized in-place.
* If only memory resources are changed, the container is restarted.
* If *both* CPU and memory resources are changed simultaneously, the container is restarted (due to the memory policy).

## Resizing memory-backed emptyDir volumes

{{< feature-state feature_gate_name="InPlacePodVerticalScalingMemoryBackedVolumes" >}}

When the `InPlacePodVerticalScalingMemoryBackedVolumes` feature gate is enabled, the Pod `/resize` subresource supports updating the `sizeLimit` of memory-backed (`medium: Memory`) `emptyDir` volumes on running Pods without restarting containers or recreating the Pod.

When a volume's `sizeLimit` is updated via the `/resize` subresource, the Kubelet dynamically updates the underlying `tmpfs` mount without container disruption while safely preventing out-of-memory errors or false-positive eviction triggers.

To resize a memory-backed `emptyDir` volume, update `spec.volumes[].emptyDir.sizeLimit` targeting the Pod's `resize` subresource:

```shell
kubectl patch pod <pod-name> --subresource resize --patch \
  '{"spec":{"volumes":[{"name":"cache-volume", "emptyDir":{"sizeLimit":"200Mi"}}]}}'
```

You can monitor the resize progress using the Pod's status conditions (`PodResizePending` and `PodResizeInProgress`). Once completed, you can verify the actual volume capacity inside the running container (for example, using `kubectl exec` to run `df -h`).

## Resizing CPUs of Guaranteed QoS Pods managed by static CPU manager policy

{{< feature-state feature_gate_name="InPlacePodVerticalScalingExclusiveCPUs" >}}

When the `InPlacePodVerticalScalingExclusiveCPUs` feature gate is enabled, the Pod `/resize` subresource supports in-place updating the CPUs of Guaranteed QoS Pods managed by [static CPU manager policy](/docs/tasks/administer-cluster/cpu-management-policies/).

If `InPlacePodVerticalScalingExclusiveCPUs` feature gate is disable, In-place resource resizing is infeasible for Guaranteed QoS pods on nodes configured with a Static CPU Policy. Any attempt of in-place resize for Guaranteed QoS pods with static CPU policy will fail and update status to Infeasible.

In-place resize is allowed with multiple containers per operation when topology management policy of node is [container topology manager scope](/docs/tasks/administer-cluster/topology-manager/#container-scope) or with [pod topology manager scope](/docs/tasks/administer-cluster/topology-manager/#pod-scope) for [none](/docs/tasks/administer-cluster/topology-manager/#policy-none) and [best-effort](/docs/tasks/administer-cluster/topology-manager/#policy-best-effort) multi container scaling is allowed.

### Key concepts 

* **baseline CPUs:** is the cpuset allocated when the container was admitted the first time
* **assigned CPUs:** is the cpuset allocated before a resize, when the container in question is asked to resize
* **resized CPUs:**  is the cpuset allocated after a successful resize, the "resized CPUs" is always a superset of "baseline CPUs" i.e. baselineCPUs < resizedCPUs_A_UpSize < resizedCPUs_B_UpSize ... < resizedCPUs_N_UpSize in case of N successive up sizes.

### Use cases

#### CPU limit increase

  During CPU limit increase ( upsize or scale up ) of a running container of a Guaranteed Pod managed by Static CPU Policy, the Kubelet:
  - ensures that "assigned CPUs" of a running container of a Guaranteed Pod CPUs managed by static CPU policies are kept.
  - Attempt of allocating additional CPUs should adhere to the combination of Topology/Memory/CPU/Device/kubelet reservation policies.

#### CPU limit decrease

  During CPU limit decrease of a running container of a Guaranteed Pod managed of Static CPU Policy, the Kubelet: 
  - to be successfull must ensures that after resize there is no decrease of number of CPUs below the CPUs allocated
    upon creation of the Guaranteed Pod (“baseline CPUs”) for the running container in question. If this is not possible
    resize will fail and update status to Infeasible.
  - allows the decrease of number of CPUs up to the CPUs allocated upon creation of the Guaranteed Pod ("baseline CPUs")
    of a running container of a Guaranteed Pod keeping "baseline CPUs".
  - applies same rules for NUMA Topology applicable for CPU Limit increase for CPU Limit decrease
  - allows retained CPUs ("resized CPUs") to be a subset of the previous `assigned CPUs`, and "baseline CPUs" are kept
```
    i.e. _baselineCPUs < resizedCPUS_A_UpSize, baselineCPUs <= resizedCPUS_B_DownSize < resizedCPUS_A_UpSize._
```
  - Downsize does not need to be an upsize in reverse for example below is a valid flow.
  ```
    upsize: baseline = 4 -> 8 -> 12
    downsize: 12 -> 6
  ```

### Topology hints

When the CPU Manager, under a static policy, generates a NUMA Topology hint for a Guaranteed pod undergoing an in place CPU pod-resize, it follows these rules to determine the new affinity:

The pod's current NUMA Affinity (single or multiple NUMA nodes) can accommodate the resized CPU request. If yes, the current affinity is maintained.
If the current affinity is insufficient and expansion is needed the new NUMA affinity must always include all NUMA nodes from the current affinity.
On downsize the end result must be a superset of the "baseline CPUs" and a subset of the "resized CPUs".

## Limitations

For Kubernetes {{< skew currentVersion >}}, resizing pod resources in-place has the following limitations:

* **Resource Types:** Only CPU and memory resources can be resized.
* **Memory Decrease:** If the memory resize restart policy is `NotRequired` (or unspecified), the kubelet will make a
best-effort attempt to prevent oom-kills when decreasing memory limits, but doesn't provide any guarantees. 
Before decreasing container memory limits, if memory usage exceeds the requested limit, the resize will be skipped
and the status will remain in an "In Progress" state. This is considered best-effort because it is still subject
to a race condition where memory usage may spike right after the check is performed. 
* **QoS Class:** The Pod's original [Quality of Service (QoS) class](/docs/concepts/workloads/pods/pod-qos/)
  (Guaranteed, Burstable, or BestEffort) is determined at creation and **cannot** be changed by a resize.
  The resized resource values must still adhere to the rules of the original QoS class:
    * *Guaranteed*: Requests must continue to equal limits for both CPU and memory after resizing.
    * *Burstable*: Requests and limits cannot become equal for *both* CPU and memory simultaneously
      (as this would change it to Guaranteed).
    * *BestEffort*: Resource requirements (`requests` or `limits`) cannot be added
      (as this would change it to Burstable or Guaranteed).
* **Container Types:** {{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}} cannot be resized.
  [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) can be resized.
  Non-restartable {{< glossary_tooltip text="init containers" term_id="init-container" >}} can be resized
  while they are running; their `resizePolicy` cannot be set to `RestartContainer`.
* **Resource Removal:** Resource requests and limits cannot be entirely removed once set;
  they can only be changed to different values.
* **Operating System:** Windows pods do not support in-place resize.
* **Node Policies:** Pods managed by [static Memory manager policies](/docs/tasks/administer-cluster/memory-manager/)
  cannot be resized in-place. When `InPlacePodVerticalScalingExclusiveCPUs` is disabled, Pods managed by [static CPU manager policies](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-configuration) cannot be resized in-place.
* **Swap:** Pods utilizing [swap memory](/docs/concepts/architecture/nodes/#swap-memory) cannot resize memory requests
  unless the `resizePolicy` for memory is `RestartContainer`.
* **Memory-Backed Volume Resizing:** Resizing memory-backed (`medium: Memory`) `emptyDir` volumes in-place requires nodes running cgroup v2. On cgroup v1 nodes, in-place volume resize requests are rejected as infeasible. Disk-backed `emptyDir` volumes and persistent volumes cannot be resized via the Pod `/resize` subresource.

{{< note >}}
When `InPlacePodVerticalScalingExclusiveCPUs` is enabled, resizing CPUs of Guaranteed QoS Pods managed by static CPU manager policy has the following limitations:

- Cannot move container from shared to exclusive pool.
- Cannot move container from exclusive to shared pool.
- Not allowed to resize non-restartable init-container with exclusively allocated pool.
- Not allowed to reduce container exclusively allocated pool below baseline.
- Not allowed to resize multiple containers per operation ( batch-resize ) when topology management policy of node is [pod topology manager scope](docs/tasks/administer-cluster/topology-manager/#pod-scope) with [restricted](/docs/tasks/administer-cluster/topology-manager/#policy-restricted) and [single-numa-mode](docs/tasks/administer-cluster/topology-manager/#policy-single-numa-node) topology manager policy. Only single single container scaling is allowed. 
{{< /note >}}

These restrictions might be relaxed in future Kubernetes versions.

## Create a namespace

Create a namespace so that the resources you create in this exercise are isolated from the rest of your cluster.

```shell
kubectl create namespace rcr-example
```

## Example 1: Resizing CPU without restart

First, create a Pod designed for in-place CPU resize and restart-required memory resize.

{{% code_sample file="pods/resource/pod-resize.yaml" %}}

Create the pod:

```shell
kubectl create -f pod-resize.yaml -n rcr-example
```

This pod starts in the Guaranteed QoS class. Verify its initial state:

```shell
# Wait a moment for the pod to be running
kubectl get pod resize-demo --output=yaml -n rcr-example
```

Observe the `spec.containers[0].resources` and `status.containerStatuses[0].resources`.
They should match the manifest (700m CPU, 200Mi memory). Note the `status.containerStatuses[0].restartCount` (should be 0).

Check the pod logs to verify which CPUs are also assigned.

```shell
kubectl logs resize-demo -n rcr-example
```

You should see an output similar to (exact number will depending on nodes CPUs , below example is from a node with 5 CPUs)
```
CPUs assigned during admission (baselineCPUs) = 0-4
```

Note that above are a confirmation that the container is using CPUs from the shared pool.

Now, increase the CPU request and limit to `800m`. You use `kubectl patch` with the `--subresource resize` command line argument.

```shell
kubectl patch pod resize-demo -n rcr-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"cpu":"800m"}, "limits":{"cpu":"800m"}}}]}}'

# Alternative methods:
# kubectl -n rcr-example edit pod resize-demo --subresource resize
# kubectl -n rcr-example apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
The `--subresource resize` command line argument requires `kubectl` client version v1.32.0 or later.
Older versions will report an `invalid subresource` error.
{{< /note >}}

Check the pod status again after patching:

```shell
kubectl get pod resize-demo --output=yaml --namespace=rcr-example
```

You should see:
* `spec.containers[0].resources` now shows `cpu: 800m`.
* `status.containerStatuses[0].allocatedResources` also shows `cpu: 800m`.
* `status.containerStatuses[0].resources` also shows `cpu: 800m`, indicating the resize was successful on the node.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU `resizePolicy` was `NotRequired`.

Check the pod logs to verify that container is still using CPUs from the shared pool.

```shell
kubectl logs resize-demo -n rcr-example
```

You should see the same output as in the previous step unchanged.

```
CPUs assigned during admission (baselineCPUs) = 0-4
```

## Example 2: Resizing memory with restart

Now, resize the memory for the *same* pod by increasing it to `300Mi`.
Since the memory `resizePolicy` is `RestartContainer`, the container is expected to restart.

```shell
kubectl patch pod resize-demo -n rcr-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"memory":"300Mi"}, "limits":{"memory":"300Mi"}}}]}}'
```

Check the pod status shortly after patching:

```shell
kubectl get pod resize-demo --output=yaml --namespace=rcr-example
```

You should now observe:
* `spec.containers[0].resources` shows `memory: 300Mi`.
* `status.containerStatuses[0].allocatedResources` also shows `memory: 300Mi`.
* `status.containerStatuses[0].resources` also shows `memory: 300Mi`.
* `status.containerStatuses[0].restartCount` has increased to `1` (or more, if restarts happened previously),
  indicating the container was restarted to apply the memory change.

Check the pod logs to verify that container, after the restart is still using CPUs from the shared pool.

```shell
kubectl logs resize-demo -n rcr-example
```

You should see the same output as in the previous steps unchanged.

```
CPUs assigned during admission (baselineCPUs) = 0-4
```

## Troubleshooting: Infeasible resize request

Next, try requesting an unreasonable amount of CPU, such as 1000 full cores (written as `"1000"` instead of `"1000m"` for millicores), which likely exceeds node capacity.

```shell
# Attempt to patch with an excessively large CPU request
kubectl patch pod resize-demo -n rcr-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"cpu":"1000"}, "limits":{"cpu":"1000"}}}]}}'
```

Query the Pod's details:

```shell
kubectl get pod resize-demo --output=yaml --namespace=rcr-example
```

You'll see changes indicating the problem:

* The `spec.containers[0].resources` reflects the *desired* state (`cpu: "1k"`).
* A condition with `type: PodResizePending` and `reason: Infeasible` was added to the Pod.
* The condition's `message` will explain why but will differ depending if `InPlacePodVerticalScalingExclusiveCPUs` feature gate is enabled or not
  - if not enabled (default), reason will be (`Node didn't have enough capacity: cpu, requested: 1000, capacity: ...`)
  - if enabled (default), reason will be (`Error from server (Forbidden): pods "resize-demo" is forbidden: node didn't have enough allocatable resources: cpu, requested: 1000000, allocatable: ...`)
  because the infeasible resize was not applied by the Kubelet.
* `status.containerStatuses[0].restartCount` remains `1`, due to this failed attempt.

Check the pod logs to verify that container, is still using CPUs from the shared pool.

```shell
kubectl logs resize-demo -n rcr-example
```

You should see the same output as in the previous steps unchanged.

```
CPUs assigned during admission (baselineCPUs) = 0-4
```

To fix this, we increase the CPU request and limit to `1500m`. You use `kubectl patch` with the `--subresource resize` command line argument.

```shell
kubectl patch pod resize-demo -n rcr-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"cpu":"1500m"}, "limits":{"cpu":"1500m"}}}]}}'
```

Check the pod status again after patching:

```shell
kubectl get pod resize-demo --output=yaml --namespace=rcr-example
```

You should see:
* `spec.containers[0].resources` now shows `cpu: 1500m`.
* `status.containerStatuses[0].allocatedResources` also shows `cpu: 1500m`.
* `status.containerStatuses[0].resources` also shows `cpu: 1500m`, indicating the resize was successful on the node.
* `status.containerStatuses[0].restartCount` remains `1`, because the CPU `resizePolicy` was `NotRequired`.

Check the pod logs to verify that container is still using CPUs from the shared pool.

```shell
kubectl logs resize-demo -n rcr-example
```

You should see the same output as in the previous step unchanged.

```
CPUs assigned during admission (baselineCPUs) = 0-4
```

Keep this pod running and proceed with next example.

## Example 3: Resizing CPU without restart, alongside Static CPU Management policy


### Create a pod using two exclusive CPUs

First, create a guaranteed Pod using exclusive CPUs designed for in-place CPU resize.

{{% code_sample file="pods/resource/pod-resize-exclusive-cpus.yaml" %}}

Create the pod:

```shell
kubectl -n rcr-example create -f pod-resize-exclusive-cpus.yaml
```

This pod starts in the Guaranteed QoS class, using exclusive CPUs. Verify its initial state:

```shell
# Wait a moment for the pod to be running
kubectl -n rcr-example get pod resize-exclusive-cpus-demo --output=yaml
```

Observe `spec.containers[0].resources` , `status.containerStatuses[0].resources` and `status.containerStatuses[0].allocatedResources`.

They should match the manifest (2 CPU, 200Mi memory). Note the `status.containerStatuses[0].restartCount` (should be 0).

Check first the newly created pod logs to verify exclusive CPUs are also assigned.

```shell
kubectl logs resize-exclusive-cpus-demo -n rcr-example
```

You should see an output similar to:
```
CPUs assigned during admission (baselineCPUs) = 1-2
```

The CPUs allocated might be different depending on your node, what is important is to notice that two CPUs are allocated.

Now check the pod we created in the previous steps and is still running. 

```shell
kubectl logs resize-demo -n rcr-example
```

You should see an output similar to:
```
CPUs assigned during admission (baselineCPUs) = 0-4
CPUs assigned updated from 0-4 to 0,3-4 (baselineCPUs) 0-4
```

Observe that after the creation of the creation of the guaranteed Pod using exclusive CPUs
continues to use CPUs from the shared pool but now shared pool is reduced by the 2 CPUs.

Also observe that since this pod is in shared pool  newly assigned CPUs is not a subset of baseline CPUs.

To proceed with the next step now we will delete the pod which uses CPUs from the shared pool, 
to free up CPUs.

```
kubectl delete pod resize-demo -n rcr-example
```

Now check that the pod is deleted checking the logs.

```shell
kubectl logs resize-demo -n rcr-example
```

You should see an output similar to:
```
error: error from server (NotFound): pods "resize-demo" not found in namespace "rcr-example"
```

### Scale up pod with one additional CPU

Now, increase the CPU request and limit to `3`. You use `kubectl patch` with the `--subresource resize` command line argument.

```shell
kubectl -n rcr-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"cpu":"3"}, "limits":{"cpu":"3"}}}]}}'
```

Check the pod status again after patching:

```shell
kubectl -n rcr-example get pod resize-exclusive-cpus-demo --output=yaml
```

You should see:
* `spec.containers[0].resources` now shows `cpu: 3` both for limits and requests.
* `status.containerStatuses[0].allocatedResources` shows `cpu: 3`, indicating the resize was successful on the node.
* `status.containerStatuses[0].resources` also shows `cpu: 3`, indicating the resize was successful on the node.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU `resizePolicy` was `NotRequired`.

Check the pod logs to verify CPUs are also assigned.

```shell
kubectl logs resize-exclusive-cpus-demo -n rcr-example
```

You should see an output similar to ( exact numbers depends on your node):
```
CPUs assigned during admission (baselineCPUs) = 1-2
CPUs assigned updated from 1-2 to 1-3 (baselineCPUs) 1-2
```

Observe that the CPUs are now increase by one, in the above example from CPUs 1-2, to CPUs 1,2,3 maintaining the baseline CPUs 1-2


### Scale down reducing CPUs back to baseline CPUs


Now, decrease the CPU request and limit to the total number of baselineCPUs, for our example it was `2`.

```shell
kubectl -n rcr-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"cpu":"2"}, "limits":{"cpu":"2"}}}]}}'
```

Check the pod status again after patching:

```shell
kubectl -n rcr-example get pod resize-exclusive-cpus-demo --output=yaml
```

You should see:
* `spec.containers[0].resources` now shows `cpu: 2` both for limits and requests.
* `status.containerStatuses[0].allocatedResources` shows `cpu: 2`, indicating the resize was successful on the node.
* `status.containerStatuses[0].resources` also shows `cpu: 2`, indicating the resize was successful on the node.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU `resizePolicy` was `NotRequired`.

Check the pod logs to verify CPUs are also assigned.

```shell
kubectl logs resize-exclusive-cpus-demo -n rcr-example
```

You should see an output similar to ( exact numbers depends on your node):
```
CPUs assigned during admission (baselineCPUs) = 1-2
CPUs assigned updated from 1-2 to 1-3 (baselineCPUs) 1-2
CPUs assigned updated from 1-3 to 1-2 (baselineCPUs) 1-2
```

Observe that the CPUs are now reduced from 1-3 to 1-2 equal to baseline CPUs 1-2


### Troubleshooting, attempting to resize below baseline CPUs

Now, decrease the CPU request and limit to `1`, this value is less than baseline CPUs.

```shell
kubectl -n rcr-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"cpu":"1"}, "limits":{"cpu":"1"}}}]}}'
```

Check the pod status again after patching:

```shell
kubectl -n rcr-example get pod resize-exclusive-cpus-demo --output=yaml
```

You'll see changes indicating the problem:

* The `spec.containers[0].resources` reflects the *desired* state (`cpu: "1"`).
* A condition with `type: PodResizePending` and `reason: Infeasible` was added to the Pod.
* The condition's `message` will explain why (`Resize is not feasible, ... not allowed to reduce container exclusively allocated pool below baseline, (baseline CPUs = 2, requested CPUs = 1)`)
* Crucially, `status.containerStatuses[0].allocatedResources` will *still show the previous values* (`cpu: 2`, `memory: 200Mi`),
  because the resize was not applied by the Kubelet.
* The `restartCount` will not have changed due to this failed attempt.

Check the pod logs to verify that CPUs were not updated

```shell
kubectl logs resize-exclusive-cpus-demo -n rcr-example
```

You should see an output similar to ( exact numbers depends on your node):
```
CPUs assigned during admission (baselineCPUs) = 1-2
CPUs assigned updated from 1-2 to 1-3 (baselineCPUs) 1-2
CPUs assigned updated from 1-3 to 1-2 (baselineCPUs) 1-2
```

### Troubleshooting a non feasible CPU increase attempting to move from exclusive to a shared pool CPUs

Now, increase the CPU request and limit to `2500m`, observe that this value even if it is above the baseline CPUs (2) it is not integer,
which means this resize attempt we know before hand that it will fail since we cannot move container from exclusive to shared pool.

```shell
kubectl -n rcr-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"cpu":"2500m"}, "limits":{"cpu":"2500m"}}}]}}'
```

Check the pod status again after patching:

```shell
kubectl -n rcr-example get pod resize-exclusive-cpus-demo --output=yaml
```

You'll see changes indicating the problem:

* The `spec.containers[0].resources` reflects the *desired* state (`cpu: "2500m"`).
* A condition with `type: PodResizePending` and `reason: Infeasible` was added to the Pod.
* The condition's `message` will explain why (`Resize is not feasible, nothing to be done ... cannot move container from exclusive to shared pool`)
* Crucially, `status.containerStatuses[0].allocatedResources` will *still show the previous values* (`cpu: 2`, `memory: 200Mi`),
  because the resize was not applied by the Kubelet.
* The `restartCount` will not have changed due to this failed attempt.


To fix this, we patch the pod again with a feasible resource values.

```shell
kubectl -n rcr-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"cpu":"3"}, "limits":{"cpu":"3"}}}]}}'
```

Check the pod status again after patching:

```shell
kubectl -n rcr-example get pod resize-exclusive-cpus-demo --output=yaml
```

You should see:
* `spec.containers[0].resources` now shows `cpu: 3`.
* `status.containerStatuses[0].resources` also shows `cpu: 3`, indicating the resize was successful on the node.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU `resizePolicy` was `NotRequired`.

Check the pod logs to verify that CPUs were not updated

```shell
kubectl logs resize-exclusive-cpus-demo -n rcr-example
```

You should see an output similar to ( exact numbers depends on your node):
```
CPUs assigned during admission (baselineCPUs) = 1-2
CPUs assigned updated from 1-2 to 1-3 (baselineCPUs) 1-2
CPUs assigned updated from 1-3 to 1-2 (baselineCPUs) 1-2
CPUs assigned updated from 1-2 to 1-3 (baselineCPUs) 1-2
```

### Troubelshooting a non feasible CPU increase attempting to allocate CPUs beyond nodes capacity

Next, try requesting one thousand CPUs, an extreme number

```shell
# Attempt to patch with an excessively large CPU request one thousand CPUs
kubectl -n rcr-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"nginx", "resources":{"requests":{"cpu":"1k"}, "limits":{"cpu":"1k"}}}]}}'
```

You should see an output similar to ( exact numbers for allocatable depends on your node):
```sheel
Error from server (Forbidden): pods "resize-exclusive-cpus-demo" is forbidden: node didn't have enough allocatable resources: cpu, requested: 1000000, allocatable: 4500
```

Query the Pod's details:

```shell
kubectl -n rcr-example get pod resize-exclusive-cpus-demo --output=yaml
```

Observe that since the patch was rejected from the server, you'll see changes indicating the problem:

* The `spec.containers[0].resources` reflects the *desired* state and is unchanged (`cpu: "3"`)
* Crucially, `status.containerStatuses[0].allocatedResources` will *still show the previous values* (`cpu: 3`, `memory: 200Mi`), because the resize was rejected in from Kubernetes API and was never applied by the Kubelet.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU `resizePolicy` was `NotRequired`.

## Clean up

Delete your namespace. This deletes all the Pods that you created for this task:

```shell
kubectl delete namespace rcr-example
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
