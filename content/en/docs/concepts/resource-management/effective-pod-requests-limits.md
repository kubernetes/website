---
title: Effective Pod requests and limits
content_type: concept
weight: 20
---

<!-- overview -->

This page explains the _effective request_ and _effective limit_ of a
{{< glossary_tooltip text="Pod" term_id="pod" >}}, and how Kubernetes determines them
from the requests and limits that you specify for the Pod as a whole, or from the
[resource requests and limits](/docs/concepts/configuration/manage-resources-containers/)
that you specify for the containers in that Pod.
Kubernetes uses these values for the Pod as a whole, for example when it schedules the Pod,
enforces resource quota, or sizes the Pod-level cgroup on Linux.

The {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
places the Pod only on a node that has enough resources for the effective request,
and the node keeps the effective request reserved for the Pod,
even after initialization finishes.
When Kubernetes calculates the effective values from the containers,
they are not always a simple sum of the container values,
because init containers run one at a time,
while sidecar containers keep running during and after initialization.
Understanding this calculation helps you set requests on init and sidecar containers
without reserving more node resources than the Pod needs.

<!-- body -->

## Pod-level resources

{{< feature-state feature_gate_name="PodLevelResources" >}}

If you specify a request or limit for a resource in the `spec.resources` field of a Pod,
then that value, plus the [pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/),
is the effective request or limit of the Pod for that resource.

For a resource that you don't specify in `spec.resources`, Kubernetes calculates
the effective value from the containers, as described in
[Calculating effective requests and limits](#calculating-effective-requests-and-limits).

The pod-level request for a resource must be at least the effective request
that Kubernetes would calculate from the containers.

### Example {#pod-level-resources-example}

Here is an example of a Pod that has a Pod-level request for resources
as well as specific requests on two of its individual containers:

{{% code_sample file="pods/resource/pod-level-request.yaml" %}}

* The effective CPU request of the Pod is the pod-level CPU request, which is 500m.
* The `sidecar` container doesn't set a CPU request, so it doesn't reserve any CPU of its own.
  Instead, it can use the part of the pod-level request that the other running containers
  don't reserve:
  * During initialization, the `init` container reserves 200m,
    so the remaining 300m is available to the `sidecar` container.
  * After initialization, the `app` container reserves 400m,
    so the remaining 100m is available to the `sidecar` container.

See [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
to learn how to set resources at the Pod level.

## Calculating effective requests and limits

If you don't specify a pod-level request or limit for a resource, Kubernetes
calculates the effective request or limit for that resource from the containers
in the Pod.

The `initContainers` field of a Pod is a list that can contain init containers,
sidecar containers, or both.
A sidecar container is an entry in that list that has `restartPolicy: Always`.

For each resource, Kubernetes calculates a request/limit for two phases:

* During initialization: init containers run one at a time, alongside any
  sidecar containers that have already started. The request/limit for this phase
  is the *effective init request/limit*, which is the highest amount needed at any
  point during initialization:
  * For each init container, take its request/limit for the resource and add the
    requests/limits of all sidecar containers that are listed before it in the
    `initContainers` field.
  * The highest of these values is the effective init request/limit.

  If any resource has no resource limit specified this is considered as the highest limit.
* After initialization: all sidecar containers and app containers run at the
  same time. The request/limit for this phase is the sum of the requests/limits of
  all non-init containers (app and sidecar containers).

The Pod's *effective request/limit* for a resource is the higher of the value during
initialization (the effective init request/limit) and the value after initialization
(the sum for all non-init containers), plus the
[pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/).
See [Examples of effective requests](#examples-of-effective-requests) to learn how
this calculation works for specific Pods.

The following rules also apply:

* Scheduling is done based on effective requests, which means
  init containers can reserve resources for initialization that are not used
  during the life of the Pod.
* The Pod has a single QoS (quality of service) class, which applies to
  all init, sidecar and app containers alike.

Quota and limits are applied based on the effective Pod request and
limit.

## Examples of effective requests

The following examples show how Kubernetes calculates the effective CPU request
of a Pod from its containers.
None of these Pods sets pod-level resources or has any pod overhead.

In this Pod, the sidecar container is listed before the init container:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-before-init
spec:
  initContainers:
  - name: sidecar
    image: busybox:1.38
    command: ["sleep", "infinity"]
    restartPolicy: Always # make this container a sidecar
    resources:
      requests:
        cpu: 100m
  - name: init
    image: busybox:1.38
    command: ["sleep", "5"]
    resources:
      requests:
        cpu: 200m
  containers:
  - name: app
    image: busybox:1.38
    command: ["sleep", "infinity"]
    resources:
      requests:
        cpu: 50m
```

* During initialization, the `sidecar` container is already running when the `init`
  container starts, so the effective init request is 100m + 200m = 300m.
* After initialization, the `sidecar` and `app` containers run at the same time,
  so the sum of their requests is 100m + 50m = 150m.
* The effective CPU request of the Pod is the higher of the two values
  (300m and 150m), which is 300m.

This Pod has the same containers, but the init container is listed before the
sidecar container:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: init-before-sidecar
spec:
  initContainers:
  - name: init
    image: busybox:1.38
    command: ["sleep", "5"]
    resources:
      requests:
        cpu: 200m
  - name: sidecar
    image: busybox:1.38
    command: ["sleep", "infinity"]
    restartPolicy: Always # make this container a sidecar
    resources:
      requests:
        cpu: 100m
  containers:
  - name: app
    image: busybox:1.38
    command: ["sleep", "infinity"]
    resources:
      requests:
        cpu: 50m
```

* During initialization, no sidecar container is running when the `init` container
  starts, so the effective init request is 200m.
* After initialization, the `sidecar` and `app` containers run at the same time,
  so the sum of their requests is 100m + 50m = 150m.
* The effective CPU request of the Pod is the higher of the two values
  (200m and 150m), which is 200m.

In this Pod, the sidecar container is again listed before the init container, but this
time the app container requests more CPU:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: large-app
spec:
  initContainers:
  - name: sidecar
    image: busybox:1.38
    command: ["sleep", "infinity"]
    restartPolicy: Always # make this container a sidecar
    resources:
      requests:
        cpu: 100m
  - name: init
    image: busybox:1.38
    command: ["sleep", "5"]
    resources:
      requests:
        cpu: 200m
  containers:
  - name: app
    image: busybox:1.38
    command: ["sleep", "infinity"]
    resources:
      requests:
        cpu: 400m
```

* During initialization, the effective init request is 100m + 200m = 300m.
* After initialization, the `sidecar` and `app` containers run at the same time,
  so the sum of their requests is 100m + 400m = 500m.
* The effective CPU request of the Pod is the higher of the two values
  (300m and 500m), which is 500m.

## Linux cgroups {#cgroups}

On Linux, resource allocations for Pod level control groups (cgroups) are based on the effective Pod
request and limit, the same as the scheduler.

## {{% heading "whatsnext" %}}

* Read about [resource management for Pods and containers](/docs/concepts/configuration/manage-resources-containers/).
* Learn about [init containers](/docs/concepts/workloads/pods/init-containers/).
* Learn about [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/).
* Learn about [resource quotas](/docs/concepts/policy/resource-quotas/).
* Learn about [Pod Quality of Service classes](/docs/concepts/workloads/pods/pod-qos/).
