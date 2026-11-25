---
title: Resize CPU Resources of Pods with Exclusive CPUs
content_type: task
weight: 35
min-kubernetes-server-version: 1.38
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScalingExclusiveCPUs" >}}

This page explains how to change the number of CPUs assigned to a running
container without restarting it, when the container uses CPUs that the kubelet
allocated exclusively for that container.

This page covers in-place resize for containers that use exclusive CPUs.
For general in-place resizing of CPU and memory, see
[Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).

The `InPlacePodVerticalScalingExclusiveCPUs` feature gate was introduced in
Kubernetes 1.32. The kubelet implements the behavior described on this page
starting with Kubernetes 1.38.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

You need the following for the exercise on this page:

* The `InPlacePodVerticalScalingExclusiveCPUs` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  enabled for all nodes in your cluster.
* The [static CPU manager policy](/docs/tasks/administer-cluster/cpu-management-policies/)
  configured on your nodes.
* A `kubectl` client at version v1.32 or later, to use the `--subresource=resize` flag.
* At least 3 CPUs on the node available for exclusive allocation by the static
  CPU manager policy, in addition to the CPUs reserved for system daemons and the
  CPU requests of all other Pods, including `kube-system` Pods.

## About exclusive CPUs

With the [static CPU manager policy](/docs/tasks/administer-cluster/cpu-management-policies/),
the kubelet assigns CPUs exclusively to containers in
[Guaranteed](/docs/concepts/workloads/pods/pod-qos/) Pods that request an integer
number of CPUs. In a Guaranteed Pod, the CPU request equals the CPU limit. A
container that uses exclusive CPUs runs only on these CPUs and does not share
them with other containers. The kubelet runs all other containers on the remaining CPUs
of the node, which are called the *shared pool*.

The *baseline CPUs* of a container are the exclusive CPUs that the kubelet
assigned to that container when it started. The kubelet keeps the baseline CPUs
assigned to the container across resizes.

## How in-place CPU resizing works

You change the CPU request and limit of a container that uses exclusive CPUs by
updating the Pod's `resize` subresource, for example with `kubectl patch`. The
kubelet changes the CPU assignment of the running container. For the default CPU
`resizePolicy` of `NotRequired`, the container does not restart, and
`status.containerStatuses[*].restartCount` does not change.

Depending on the direction of the resize, the kubelet behaves as follows:

* **Scale up:** The kubelet keeps all CPUs that the container already uses and
  adds CPUs from the shared pool that are topologically close to them. If you
  configure a
  [Topology Manager](/docs/tasks/administer-cluster/topology-manager/) policy
  other than `none`, the new CPUs also match the Pod's NUMA affinity.
* **Scale down:** The kubelet removes the excess CPUs from the container and
  returns them to the shared pool. The container keeps its baseline CPUs.
* **Unchanged CPU count:** If a resize changes only memory, or only another
  container of the Pod, the CPU assignment of this container does not change.

In most cases, when the kubelet cannot fulfill a resize, it rejects the resize
as infeasible and does not retry it. The Pod gets a `PodResizePending` condition
with `reason: Infeasible`, and the kubelet increments the
`kubelet_pod_infeasible_resizes_total` metric. The following resize requests are
infeasible for a container that uses exclusive CPUs:

* Moving a container between the shared pool and exclusive CPUs. An integer CPU
  request can only resize to another integer CPU request. For example, a resize
  from 2 to 3 CPUs is possible, but a resize from 2 to 2500m or from 800m to 2
  is infeasible.
* Resizing a non-restartable init container that uses exclusive CPUs.
* Adding or removing a container that uses exclusive CPUs in a Guaranteed Pod.
* Scaling a container below its baseline CPUs.
* Scaling up a container when the CPU Manager cannot allocate the additional
  CPUs, for example because other containers already use all CPUs that the
  kubelet can allocate exclusively.
* Resizing a container when the static policy runs with the `full-pcpus-only`
  option and the requested CPU count does not satisfy the SMT alignment: the
  count is not a multiple of the CPUs per physical core, or the node does not
  have enough free physical CPUs.

In one case the kubelet defers a resize instead of rejecting it: the CPU Manager
can allocate the requested CPUs, but the total CPU requests of the Pods on the
node, including the resized Pod, exceed the allocatable CPU of the node, for
example because of the requests of Pods in the shared pool.
The Pod gets a `PodResizePending` condition with `reason: Deferred`, and the
kubelet retries the resize when other Pods release capacity.

Pods that request fractional CPUs, such as 800m, run in the shared pool. When
the `InPlacePodVerticalScalingExclusiveCPUs` feature gate is enabled, the kubelet
resizes these Pods in-place as usual. For example, a Guaranteed Pod with a CPU
request of 800m can resize to 1500m in-place. This resize path does not use
exclusive CPUs.

### Resizing with the Topology Manager

If you configure a
[Topology Manager](/docs/tasks/administer-cluster/topology-manager/) policy
other than `none`, the kubelet considers the NUMA affinity when it allocates the
new CPUs:

* For a scale-up, the kubelet keeps the Pod's current NUMA affinity when that
  affinity can accommodate the new CPU count. When the kubelet must expand the
  affinity, the new NUMA affinity includes all NUMA nodes of the current affinity.
* With the `pod` scope, the kubelet aligns the CPUs of all containers of the Pod
  together. With the `container` scope, the kubelet aligns only the CPUs of the
  resized container.
* With the `pod` scope and the `restricted` or `single-numa-node` policy, a
  single resize request can change the exclusive CPUs of only one container. To
  resize several containers, send one resize request per container.
* When the Topology Manager cannot align a resize, the kubelet rejects the resize
  with a `PodResizePending` condition of `reason: Infeasible` and the message
  `Resources cannot be allocated with Topology locality`. The kubelet does not
  retry such a resize. With the `restricted` or `single-numa-node` policy, this
  can also affect a scale-down. A scale-down only keeps CPUs that the container
  already uses, but the preferred NUMA affinity is the narrowest one that fits
  the new CPU count. If the CPUs that the container keeps do not fit into that
  affinity, the kubelet rejects the scale-down.

## Example: resize CPUs of a Pod using exclusive CPUs

### Create a Pod with exclusive CPUs

Create a namespace for this exercise:

```shell
kubectl create namespace cpu-exclusive-example
```

{{% code_sample file="pods/resource/pod-resize-exclusive-cpus.yaml" %}}

The container in this Pod has no workload of its own. You verify its CPU
assignment by reading the `Cpus_allowed_list` field from the container's
`/proc` filesystem.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-resize-exclusive-cpus.yaml \
  -n cpu-exclusive-example
```

Wait for the Pod to become ready:

```shell
kubectl wait --for=condition=Ready pod/resize-exclusive-cpus-demo -n cpu-exclusive-example
```

The output is similar to this:

```
pod/resize-exclusive-cpus-demo condition met
```

Check the container's CPUs:

```shell
kubectl exec resize-exclusive-cpus-demo -n cpu-exclusive-example -- \
  grep Cpus_allowed_list /proc/1/status
```

The output is similar to this:

```
Cpus_allowed_list:	1-2
```

The exact CPUs depend on your node. Verify the CPU assignment in the Pod status:

```shell
kubectl get pod resize-exclusive-cpus-demo -n cpu-exclusive-example --output=yaml
```

The output shows:

* `spec.containers[0].resources` with a CPU request and limit of 2.
* `status.containerStatuses[0].allocatedResources` with `cpu` set to 2.
* `status.containerStatuses[0].resources` with `cpu` set to 2.
* `status.containerStatuses[0].restartCount` equal to 0.

### Scale up by one CPU

Increase the CPU request and limit from 2 to 3:

```shell
kubectl -n cpu-exclusive-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"app-container","resources":{"requests":{"cpu":"3"},"limits":{"cpu":"3"}}}]}}'
```

Check the Pod status again:

```shell
kubectl get pod resize-exclusive-cpus-demo -n cpu-exclusive-example --output=yaml
```

The output shows:

* `spec.containers[0].resources` with a CPU request and limit of 3.
* `status.containerStatuses[0].allocatedResources` with `cpu` set to 3.
* `status.containerStatuses[0].resources` with `cpu` set to 3.
* `status.containerStatuses[0].restartCount` still 0.

Check the container's CPUs again:

```shell
kubectl exec resize-exclusive-cpus-demo -n cpu-exclusive-example -- \
  grep Cpus_allowed_list /proc/1/status
```

The output is similar to this:

```
Cpus_allowed_list:	1-3
```

The container kept its baseline CPUs 1-2 and received the additional CPU 3
from the shared pool.

### Attempt a resize the kubelet cannot fulfill

Decrease the CPU request and limit to 2500m. A container that uses exclusive
CPUs cannot move to the shared pool, so the kubelet rejects this resize:

```shell
kubectl -n cpu-exclusive-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"app-container","resources":{"requests":{"cpu":"2500m"},"limits":{"cpu":"2500m"}}}]}}'
```

Check the Pod status:

```shell
kubectl get pod resize-exclusive-cpus-demo -n cpu-exclusive-example --output=yaml
```

The output shows:

* A `PodResizePending` condition with `reason: Infeasible`. The condition's
  `message` contains `cannot move container from exclusive to shared pool,
  (requested CPUs = 2500m)`.
* `spec.containers[0].resources` with `cpu` set to 2500m, the desired state of
  the pending resize request.
* `status.containerStatuses[0].resources` still with `cpu` set to 3.
* `status.containerStatuses[0].restartCount` still 0.

Verify that the container still runs on its previous CPUs:

```shell
kubectl exec resize-exclusive-cpus-demo -n cpu-exclusive-example -- \
  grep Cpus_allowed_list /proc/1/status
```

The output is similar to this:

```
Cpus_allowed_list:	1-3
```

The pending resize request stays in the Pod spec until you send another resize
request.

### Scale down to the baseline CPUs

Decrease the CPU request and limit from 3 back to 2:

```shell
kubectl -n cpu-exclusive-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"app-container","resources":{"requests":{"cpu":"2"},"limits":{"cpu":"2"}}}]}}'
```

Check the container's CPUs again:

```shell
kubectl exec resize-exclusive-cpus-demo -n cpu-exclusive-example -- \
  grep Cpus_allowed_list /proc/1/status
```

The output is similar to this:

```
Cpus_allowed_list:	1-2
```

The container keeps its baseline CPUs 1-2. The kubelet returned the extra CPU
to the shared pool, where other Pods can use it.

### Clean up

Delete the namespace. This deletes the Pod from this exercise:

```shell
kubectl delete namespace cpu-exclusive-example
```

## Troubleshooting

When the kubelet cannot apply a resize, the Pod gets a `PodResizePending`
condition. The condition `reason` is `Deferred` when the resize can succeed
later, and `Infeasible` when it cannot succeed. The `message` field of the
condition explains the reason. For an infeasible resize, the kubelet also
increments the `kubelet_pod_infeasible_resizes_total` metric, with a
`reason_detail` label that identifies the reason. For more information about
resize status conditions, see
[Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status).

Common reasons why the kubelet does not apply a CPU resize of a container that
uses exclusive CPUs:

* **Feature gate disabled:** The kubelet rejects every CPU resize of a
  Guaranteed Pod that the static CPU manager policy manages when you do not
  enable the `InPlacePodVerticalScalingExclusiveCPUs` feature gate. The
  condition message contains `Resize is infeasible for Guaranteed Pods`. Enable
  the feature gate on your nodes.
* **Not enough free CPUs:** The node does not have enough free CPUs that the
  kubelet can allocate exclusively, because other containers already use them.
  The condition's `message` contains `Unable to resize container
  exclusively allocated pool` and `not enough cpus available to satisfy
  request`, and the kubelet does not retry the resize. Free CPUs and then send
  the resize request again, or send a resize request for fewer CPUs. With the
  `restricted` or `single-numa-node` Topology Manager policy, the Topology
  Manager rejects the resize before the CPU Manager allocates CPUs, and the
  condition's `message` is `Resources cannot be allocated with Topology
  locality` instead.
* **Not enough allocatable CPU on the node:** The CPU Manager can allocate the
  CPUs, but the total CPU requests of the Pods on the node, including the
  resized Pod, exceed the allocatable CPU of the node.
  The condition `reason` is `Deferred`, and the kubelet retries the resize when
  other Pods release capacity.
* **Shared pool and exclusive CPUs cannot be mixed:** A container that runs on
  shared CPUs cannot grow into exclusive CPUs, and a container that uses
  exclusive CPUs cannot shrink into the shared pool. Recreate the Pod with the
  desired CPU request instead.
* **Resize below the baseline CPUs:** A container cannot release its baseline
  CPUs. The condition's `message` contains `not allowed to reduce container
  exclusively allocated pool below baseline`.
* **SMT alignment error:** With the `full-pcpus-only` static policy option, the
  condition's `message` contains `SMT Alignment Error` when the requested CPU
  count is not a multiple of the CPUs per physical core, or the node does not
  have enough free physical CPUs. The kubelet does not retry the resize. Send a
  new resize request for a multiple of the CPUs per physical core, or free
  physical CPUs and then send the resize request again.
* **Topology alignment error:** The Topology Manager cannot align the new CPUs with
  the Pod's NUMA affinity. This can also affect a scale-down. The condition's
  `message` is `Resources cannot be allocated with Topology locality`, and the
  kubelet does not retry the resize. For a scale-up, free CPUs that give the
  topology room to align and then send the resize request again. For a
  scale-down, freeing CPUs does not help, because the container keeps only CPUs
  that it already uses. Send a resize request for a different CPU count
  instead. In both cases, you can also use a less restrictive Topology Manager
  policy.
* **Several containers in one request:** With the `pod` scope and the
  `restricted` or `single-numa-node` policy, the condition's `message` contains
  `not allowed to resize exclusive CPUs of more than one container in a single
  operation`. Send one resize request per container.

## {{% heading "whatsnext" %}}

* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
* [CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
