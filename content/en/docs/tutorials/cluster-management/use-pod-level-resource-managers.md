---
title: Use pod-level resources with Kubelet resource managers
reviewers:
- ffromani
- ndixita
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.36
---

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

This tutorial demonstrates how to configure the Kubelet's resource managers
(Topology, CPU, and Memory) to support pod-level resource specifications. By
using the `PodLevelResourceManagers` feature, you can define hybrid allocation
models where some containers receive exclusive, NUMA-aligned resources while
others share the remaining resources from a pod-level shared pool.

To learn more about the concepts behind this feature, read the
[Pod-level resource managers](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)
concept page.

<!-- lessoncontent -->

## {{% heading "objectives" %}}

*   Configure Kubelet resource managers (CPU, Memory, and Topology) to support
    pod-level resources.
*   Deploy workloads using the `pod` Topology Manager scope to achieve
    single-NUMA alignment with mixed exclusive and shared containers.
*   Inspect and verify how CPU and memory resources are partitioned between
    exclusive containers and the pod shared pool.
*   Understand admission rejection rules when a pod-level shared pool would be
    empty.
*   Deploy workloads using the `container` Topology Manager scope with mixed
    container allocations.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

To use this feature, ensure the following
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) are
enabled for your control plane and for all nodes in your cluster:

-   `PodLevelResources`
-   `PodLevelResourceManagers`

## Create a namespace {#create-namespace}

Create a namespace so that the resources created in this tutorial are isolated
from the rest of your cluster:

```shell
kubectl create namespace plrm-tutorial
```

## Use pod scope with mixed allocation {#use-pod-scope-with-mixed-allocation}

When the Topology Manager scope is set to `pod`, the Kubelet performs a single
NUMA alignment for the entire Pod based on `.spec.resources`. The resulting
resource budget is then partitioned: containers requesting `Guaranteed`
resources receive exclusive slices, while `non-Guaranteed` containers share the
remaining budget in a pod-level shared pool.

### Step 1: Configure Kubelet for pod scope

To enable this behavior, configure the Kubelet with the required policies. You
can update your
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) as
follows:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cpuManagerPolicy: "static"
memoryManagerPolicy: "Static"
topologyManagerScope: "pod"
topologyManagerPolicy: "single-numa-node"
```

*   For `topologyManagerPolicy`, valid options for this feature are
    `"single-numa-node"`, `"restricted"`, or `"best-effort"`.

Restart the Kubelet service to apply the configuration.

### Step 2: Deploy a mixed-allocation pod

Consider the following example pod manifest. The pod requests a total budget of
4 CPUs at the pod level (`.spec.resources`). Inside the pod:

-   `main-app` requests an exclusive 2 CPU slice (`requests` = `limits` = 2
    CPU).
-   `metrics-sidecar` and `logging-sidecar` do not specify container-level
    requests, so they share the remaining 2 CPUs in the pod-level shared pool.

{{% code_sample file="pods/resource/pod-level-resource-managers-pod-scope-mixed.yaml" %}}

Apply the manifest to your cluster:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-pod-scope-mixed.yaml --namespace=plrm-tutorial
```

### Step 3: Verify and inspect resource partitioning

1.  Check that the Pod is running successfully:

    ```shell
    kubectl get pod pod-scope-mixed --namespace=plrm-tutorial
    ```

2.  Understand what happened behind the scenes:

    ```
    Pod-Level Budget (.spec.resources: 4 CPUs, 4Gi Memory)
    │
    ├── main-app (Exclusive) ────────────────► 2 CPUs, 2Gi Memory (Dedicated cores)
    │
    └── Pod Shared Pool ──────────────────────► 2 CPUs, 2Gi Memory (Pod-isolated pool)
        ├── metrics-sidecar
        └── logging-sidecar
    ```

    -   Pod Alignment: The Topology Manager evaluated the 4 CPU pod request
        (`spec.resources`) and assigned the entire Pod to a single NUMA node.
    -   Exclusive Allocation: The CPU Manager allocated a dedicated 2 CPU slice
        to `main-app`. CPU CFS quota throttling is disabled for `main-app`,
        giving it unthrottled access to those exclusive cores.
    -   Pod Shared Pool: The remaining 2 CPUs form a pod-level shared pool.
        `metrics-sidecar` and `logging-sidecar` specify no container-level
        resources (`resources: {}`), so they run within this pod-isolated shared
        pool with CFS quota enforcement enabled. While shared between these two
        sidecars, the pool is isolated from external workloads on the node,
        providing the sidecars with dedicated NUMA locality and protection from
        node-level resource contention.

## Observe empty shared pool admission restrictions {#empty-shared-pool-restrictions}

When using the `pod` scope, Kubelet admission control rejects pod specifications
that would result in an empty pod shared pool when there are containers that
require one.

If the sum of exclusive resource requests from `Guaranteed` containers equals
the total pod-level budget, and at least one other container requires the shared
pool, the pod cannot be admitted.

### Step 1: Examine the invalid pod manifest

Consider the following manifest. The pod requests a total budget of 4 CPUs.
`container-a` requests an exclusive 1 CPU and `container-b` requests an
exclusive 3 CPUs (totaling 4 CPUs). `container-c` does not request exclusive
resources and requires a shared pool, but 0 CPUs remain:

{{% code_sample file="pods/resource/pod-level-resource-managers-empty-shared-pool.yaml" %}}

### Step 2: Attempt deployment and observe rejection

1.  Apply the manifest:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-empty-shared-pool.yaml --namespace=plrm-tutorial
    ```

2.  Inspect the Pod events to observe the admission error:

    ```shell
    kubectl describe pod empty-shared-pool --namespace=plrm-tutorial
    ```

    Notice the event message explaining that admission was rejected because the
    pod-level shared pool would be empty for containers requiring shared
    resources:

    ```
    Status:           Failed
    Reason:           TopologyAffinityError
    Message:          Pod was rejected: Pod Scope pod with pod-level resources failed admission under pod-scope topology manager
    ```

    ```
    Pod-Level Budget (.spec.resources: 4 CPUs, 4Gi Memory)
    │
    ├── main-app (Exclusive) ────────────────► 3 CPUs, 3Gi Memory
    ├── metrics-sidecar (Exclusive) ────────► 1 CPU,  1Gi Memory
    │
    └── Pod Shared Pool ──────────────────────► 0 CPUs, 0Gi Memory  ◄── REJECTED!
        └── logging-sidecar (Requires shared pool, but 0 CPUs remain)
    ```

## Use container scope with mixed allocation {#use-container-scope-with-mixed-allocation}

You can also configure the Topology Manager scope to `container`. In this mode,
Kubelet evaluates each container individually for exclusive allocation, while
the overall pod budget in `.spec.resources` still enforces QoS and cgroup limit
boundaries.

### Step 1: Configure Kubelet for container scope

Update your
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) for
the `container` scope:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cpuManagerPolicy: "static"
memoryManagerPolicy: "Static"
topologyManagerScope: "container"
topologyManagerPolicy: "single-numa-node"
```

Restart the Kubelet service to apply the configuration.

### Step 2: Deploy a container-scoped mixed workload

Consider the following example pod manifest. The pod has a total budget of 4
CPUs:

-   `infrastructure-sidecar` requests an exclusive 2 CPU slice (`requests` =
    `limits` = 2 CPU).
-   `worker-1` and `worker-2` do not specify container-level requests and run in
    the general, node-wide shared pool.

{{% code_sample file="pods/resource/pod-level-resource-managers-container-scope-mixed.yaml" %}}

Apply the manifest:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-container-scope-mixed.yaml --namespace=plrm-tutorial
```

### Step 3: Verify the deployment

1.  Check that the Pod is running:

    ```shell
    kubectl get pod container-scope-mixed --namespace=plrm-tutorial
    ```

2.  Understand what happened behind the scenes:

    ```
    Pod-Level Budget (.spec.resources: 4 CPUs, 4Gi Memory)
    │
    ├── infrastructure-sidecar ──────────────► 2 CPUs, 2Gi Memory (Exclusive NUMA slice)
    │
    └── Node Shared Pool (General) ──────────► 2 CPUs remaining under Pod ceiling
        ├── worker-1 (Runs in node shared pool)
        └── worker-2 (Runs in node shared pool)
    ```

    -   Container-Scoped Alignment: Under `container` scope, the Kubelet
        evaluates containers individually. `infrastructure-sidecar` receives an
        exclusive, NUMA-aligned 2 CPU slice directly from the node's allocatable
        pool.
    -   Node Shared Pool: `worker-1` and `worker-2` specify no container-level
        resource requests (`resources: {}`), so under `container` scope they run
        in the node's general shared pool (rather than a pod-isolated pool).
    -   Pod Limit Enforcement: The total CPU consumption across all containers
        remains capped at 4 CPUs by the pod-level limit
        (`spec.resources.limits`).

## Clean up {#clean-up}

Delete the namespace and all sample Pods created during this tutorial:

```shell
kubectl delete namespace plrm-tutorial
```

## {{% heading "whatsnext" %}}

* Read the concept documentation:
  * [Pod-level resource managers](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)
* Learn how to configure node-level resource managers:
  * [Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/)
  * [Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/)
  * [Utilizing the NUMA-aware Memory Manager](/docs/tasks/administer-cluster/memory-manager/)
* Learn how to assign resources:
  * [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
  * [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
  * [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
