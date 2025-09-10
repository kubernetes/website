---
title: Assign Pod-level CPU and memory resources
content_type: task
weight: 30
min-kubernetes-server-version: 1.34
---


<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResources" >}}

This page shows how to specify CPU and memory resources for a Pod at pod-level in
addition to container-level resource specifications. A Kubernetes node allocates
resources to a pod based on the pod's resource requests. These requests can be
defined at the pod level or individually for containers within the pod. When
both are present, the pod-level requests take precedence.

Similarly, a pod's resource usage is restricted by limits, which can also be set at
the pod-level or individually for containers within the pod. Again,
pod-level limits are prioritized when both are present. This allows for flexible
resource management, enabling you to control resource allocation at both the pod and
container levels.

In order to specify the resources at pod-level, it is required to enable
`PodLevelResources` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

For Pod Level Resources:
* Priority: When both pod-level and container-level resources are specified,
  pod-level resources take precedence.
* QoS: Pod-level resources take precedence in influencing the QoS class of the pod.
* OOM Score: The OOM score adjustment calculation considers both pod-level and
  container-level resources.
* Compatibility: Pod-level resources are designed to be compatible with existing
  features.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

The `PodLevelResources` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) must be enabled
for your control plane and for all nodes in your cluster.

## Limitations

For Kubernetes {{< skew currentVersion >}}, resizing pod-level resources has the
following limitations:

* **Resource Types:** Only CPU, memory and hugepages resources can be specified at pod-level.
* **Operating System:** Pod-level resources are not supported for Windows
  pods.
* **Resource Managers:** The Topology Manager, Memory Manager and CPU Manager do not
  align pods and containers based on pod-level resources as these resource managers 
  don't currently support pod-level resources.
* **[In-Place
  Resize](https://kubernetes.io/docs/tasks/configure-pod-container/resize-container-resources/):**
  In-place resize of pod-level resources is not supported. Modifying the pod-level resource
  limits or requests on a pod result in a field.Forbidden error. The error message
  explicitly states, "pods with pod-level resources cannot be resized."

<!-- steps -->

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace pod-resources-example
```

## Create a pod with memory requests and limits at pod-level

To specify memory requests for a Pod at pod-level, include the `resources.requests.memory`
field in the Pod spec manifest. To specify a memory limit, include `resources.limits.memory`.

In this exercise, you create a Pod that has one Container. The Pod has a
memory request of 100 MiB and a memory limit of 200 MiB. Here's the configuration
file for the Pod:

{{% code_sample file="pods/resource/pod-level-memory-request-limit.yaml" %}}

The `args` section in the manifest provides arguments for the container when it starts.
The `"--vm-bytes", "150M"` arguments tell the Container to attempt to allocate 150 MiB of memory.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-memory-request-limit.yaml --namespace=pod-resources-example
```

Verify that the Pod is running:

```shell
kubectl get pod memory-demo --namespace=pod-resources-example
```

View detailed information about the Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=pod-resources-example
```

The output shows that the Pod has a memory request of 100 MiB
and a memory limit of 200 MiB.


```yaml
...
spec: 
  containers:    
  ...
  resources:
    requests:
      memory: 100Mi
    limits:
      memory: 200Mi
...
```

Run `kubectl top` to fetch the metrics for the pod:

```shell
kubectl top pod memory-demo --namespace=pod-resources-example
```

The output shows that the Pod is using about 162,900,000 bytes of memory, which
is about 150 MiB. This is greater than the Pod's 100 MiB request, but within the
Pod's 200 MiB limit.

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

## Create a pod with CPU requests and limits at pod-level
To specify a CPU request for a Pod, include the `resources.requests.cpu` field
in the Pod spec manifest. To specify a CPU limit, include `resources.limits.cpu`.

In this exercise, you create a Pod that has one container. The Pod has a request
of 0.5 CPU and a limit of 1 CPU. Here is the configuration file for the Pod:

{{% code_sample file="pods/resource/pod-level-cpu-request-limit.yaml" %}}

The `args` section of the configuration file provides arguments for the container when it starts.
The `-cpus "2"` argument tells the Container to attempt to use 2 CPUs.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-cpu-request-limit.yaml --namespace=pod-resources-example
```

Verify that the Pod is running:

```shell
kubectl get pod cpu-demo --namespace=pod-resources-example
```

View detailed information about the Pod:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=pod-resources-example
```

The output shows that the Pod has a CPU request of 500 milliCPU
and a CPU limit of 1 CPU.

```yaml
spec:
  containers:
  ...
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

Use `kubectl top` to fetch the metrics for the Pod:

```shell
kubectl top pod cpu-demo --namespace=pod-resources-example
```

This example output shows that the Pod is using 974 milliCPU, which is
slightly less than the limit of 1 CPU specified in the Pod configuration.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Recall that by setting `-cpu "2"`, you configured the Container to attempt to use 2
CPUs, but the Container is only being allowed to use about 1 CPU. The container's
CPU use is being throttled, because the container is attempting to use more CPU
resources than the Pod CPU limit.

## Create a pod with resource requests and limits at both pod-level and container-level

To assign CPU and memory resources to a Pod, you can specify them at both the pod
level and the container level.  Include the `resources` field in the Pod spec to
define resources for the entire Pod. Additionally, include the `resources` field
within container's specification in the Pod's manifest to set container-specific
resource requirements.

In this exercise, you'll create a Pod with two containers to explore the interaction
of pod-level and container-level resource specifications. The Pod itself will have
defined CPU requests and limits, while only one of the containers will have its own
explicit resource requests and limits. The other container will inherit the resource
constraints from the pod-level settings. Here's the configuration file for the Pod:

{{% code_sample file="pods/resource/pod-level-resources.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resources.yaml --namespace=pod-resources-example
```

Verify that the Pod Container is running:

```shell
kubectl get pod-resources-demo --namespace=pod-resources-example
```

View detailed information about the Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=pod-resources-example
```

The output shows that one container in the Pod has a memory request of 50 MiB and a
CPU request of 0.5 cores, with a memory limit of 100 MiB and a CPU limit of 0.5
cores. The Pod itself has a memory request of 100 MiB and a CPU request of
1 core, and a memory limit of 200 MiB and a CPU limit of 1 core.

```yaml
...
containers:
  name: pod-resources-demo-ctr-1
  resources:
      requests:
        cpu: 500m
        memory: 50Mi
      limits:
        cpu: 500m
        memory: 100Mi
  ...
  name: pod-resources-demo-ctr-2
  resources: {}  
resources:
  limits:
      cpu: 1
      memory: 200Mi
    requests:
      cpu: 1
      memory: 100Mi
...
```

Since pod-level requests and limits are specified, the request guarantees for both
containers in the pod will be equal 1 core or CPU and 100Mi of memory. Additionally,
both containers together won't be able to use more resources than specified in the
pod-level limits, ensuring they cannot exceed a combined total of 200 MiB of memory
and 1 core of CPU.

## Clean up

Delete your namespace:

```shell
kubectl delete namespace pod-resources-example
```

## {{% heading "whatsnext" %}}


### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
