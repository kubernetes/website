---
title: Use Pod-Level Resources with kubelet Resource Managers
reviewers:
- ffromani
- ndixita
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.36
---

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

This tutorial demonstrates how to configure the kubelet's resource managers
(topology, CPU, and memory) to support pod-level resource specifications. You
can define *hybrid allocation models* where some containers receive exclusive,
NUMA-aligned infrastructure resources while others share the remaining resources
from a pod-level shared pool.

To learn more about the concepts behind this feature, read the
[Pod-level resource managers](/docs/concepts/resource-management/pod-level-resource-managers/)
concept page.

<!-- lessoncontent -->

## {{% heading "objectives" %}}

-   Configure kubelet resource managers (CPU, memory, and topology) to support
    pod-level resources.
-   Deploy workloads using the `pod` Topology Manager scope to achieve
    single-NUMA alignment with mixed exclusive and shared containers.
-   Inspect and verify how CPU and memory resources are partitioned between
    exclusive containers and the pod shared pool.
-   Understand admission rejection rules when a pod-level shared pool would be
    empty.
-   Deploy workloads using the `container` Topology Manager scope with mixed
    container allocations.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

To complete this tutorial, you need:

-   A Kubernetes cluster with **Linux worker nodes** (pod-level resource
    managers are not supported on Windows nodes).
-   At least one worker node with **NUMA topology** (preferably multiple NUMA
    nodes to observe alignment).
-   **Administrative access** (root or `sudo`) on the worker node(s) to modify
    [`kubelet` configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
    and restart the `kubelet` service.
-   `kubectl` access with permission to create namespaces and pods.

Ensure the following
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) are
enabled for your control plane and for the worker nodes:

-   `PodLevelResources`
-   `PodLevelResourceManagers`

## Create a namespace {#create-namespace}

Create a namespace so that the resources created in this tutorial are isolated
from the rest of your cluster:

```shell
kubectl create namespace plrm-tutorial
```

## Use pod scope with mixed allocation {#use-pod-scope-with-mixed-allocation}

When the Topology Manager scope is set to `pod`, the `kubelet` performs a single
NUMA alignment for the entire Pod based on `.spec.resources`. The resulting
resource budget is then partitioned: containers requesting `Guaranteed`
resources receive exclusive slices, while containers that do not receive an
exclusive allocation share the remaining budget in a pod-level shared pool.

### Step 1: Configure kubelet for pod scope

To enable this behavior, configure the `kubelet` on the target worker node(s)
where you want to run these workloads with the required policies. You can update
your [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
for those nodes as follows:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cpuManagerPolicy: "static"
memoryManagerPolicy: "Static"
topologyManagerScope: "pod"
topologyManagerPolicy: "single-numa-node"
```

-   For `topologyManagerPolicy`, the valid values are
    `single-numa-node`, `restricted`, or `best-effort`. You cannot specify
    any other value when using Pod-level resource management.

Restart the kubelet to apply the configuration. For example, on Linux with
systemd: `systemctl restart kubelet.service`.

### Step 2: Deploy a mixed-allocation pod

Consider the following example Pod manifest. The Pod requests a total budget of
4 CPUs at the pod level (`.spec.resources`). Inside the Pod:

-   the `main-app` container requests an exclusive allocation of 2 entire CPU
    cores (`requests` = `limits` = 2 CPU).
-   because `metrics-sidecar` and `logging-sidecar` do not specify
    container-level requests, those two sidecar containers share the CPU cores
    that remain from the pod-level shared pool: 2 CPU cores.

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

    ```mermaid
    flowchart TD
        subgraph Pod["Pod-Level Budget: 4 CPUs, 4Gi Memory"]
            direction TB
            C1["main-app<br/>(Exclusive: 2 CPUs, 2Gi Memory)"]
            subgraph Pool["Pod Shared Pool: 2 CPUs, 2Gi Memory"]
                C2["metrics-sidecar"]
                C3["logging-sidecar"]
            end
        end
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

When using the `pod` scope, `kubelet` admission control rejects Pod
specifications that would result in an empty Pod shared pool when there are
containers that require one.

If the sum of exclusive resource requests from `Guaranteed` containers equals
the total pod-level budget, and at least one other container requires the shared
pool, the `kubelet` rejects the Pod.

### Step 4: Examine the invalid pod manifest

Consider the following manifest. The Pod requests a total budget of 4 CPUs.
`container-a` requests an exclusive 1 CPU and `container-b` requests an
exclusive 3 CPUs (totaling 4 CPUs). `container-c` does not request exclusive
resources and requires a shared pool, but 0 CPUs remain:

{{% code_sample file="pods/resource/pod-level-resource-managers-empty-shared-pool.yaml" %}}

### Step 5: Attempt deployment and observe rejection

1.  Apply the manifest:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-empty-shared-pool.yaml --namespace=plrm-tutorial
    ```

2.  Inspect the Pod events to observe the admission error:

    ```shell
    kubectl describe pod empty-shared-pool --namespace=plrm-tutorial
    ```

    Notice the event message explaining that the `kubelet` rejected the Pod
    because the pod-level shared pool would be empty for containers requiring
    shared resources:

    ```
    Status:           Failed
    Reason:           TopologyAffinityError
    Message:          Pod was rejected: Pod Scope pod with pod-level resources failed admission under pod-scope topology manager
    ```

    ```mermaid
    flowchart TD
        subgraph Pod["Pod-Level Budget: 4 CPUs, 4Gi Memory"]
            direction TB
            C1["container-a<br/>(Exclusive: 1 CPU, 1Gi Memory)"]
            C2["container-b<br/>(Exclusive: 3 CPUs, 3Gi Memory)"]
            subgraph Pool["Pod Shared Pool: 0 CPUs, 0Gi Memory"]
                C3["container-c<br/>(Requires shared pool)"]
            end
        end
        Pool --> Rejection["Admission Error: Pod Rejected!"]
        style Rejection fill:#ffcccc,stroke:#ff0000,stroke-width:2px
    ```

## Use container scope with mixed allocation {#use-container-scope-with-mixed-allocation}

You can also configure the Topology Manager scope to `container`. In this mode,
the `kubelet` evaluates each container individually for exclusive allocation,
while the overall Pod budget in `.spec.resources` still enforces QoS and cgroup
limit boundaries.

### Step 6: Configure kubelet for container scope

Update your
[kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/) on
the target worker node(s) for the `container` scope:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cpuManagerPolicy: "static"
memoryManagerPolicy: "Static"
topologyManagerScope: "container"
topologyManagerPolicy: "single-numa-node"
```

Restart the kubelet to apply the configuration. For example, on Linux with
systemd: `systemctl restart kubelet.service`.

### Step 7: Deploy a container-scoped mixed workload

Consider the following example Pod manifest. The Pod has a total budget of 4
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

### Step 8: Verify the deployment

1.  Check that the Pod is running:

    ```shell
    kubectl get pod container-scope-mixed --namespace=plrm-tutorial
    ```

2.  Understand what happened behind the scenes:

    ```mermaid
    flowchart TD
        subgraph Pod["Pod-Level Budget: 4 CPUs, 4Gi Memory"]
            direction TB
            C1["infrastructure-sidecar<br/>(Exclusive NUMA Slice: 2 CPUs, 2Gi Memory)"]
            subgraph NodePool["Node Shared Pool: Pod-level limit"]
                C3["worker-2"]
                C2["worker-1"]
            end
        end
    ```

    -   Container-Scoped Alignment: Under `container` scope, the `kubelet`
        evaluates containers individually. `infrastructure-sidecar` receives an
        exclusive, NUMA-aligned 2 CPU slice directly from the node's allocatable
        pool.
    -   Node Shared Pool: `worker-1` and `worker-2` specify no container-level
        resource requests (`resources: {}`), so under `container` scope they run
        in the node's general shared pool (rather than a pod-isolated pool).
    -   Pod Limit Enforcement: The total CPU consumption across all containers
        remains capped at 4 CPUs by the pod-level limit
        (`spec.resources.limits`).

## {{% heading "cleanup" %}}

Delete the namespace and all sample Pods created during this tutorial:

```shell
kubectl delete namespace plrm-tutorial
```

## {{% heading "whatsnext" %}}

- Read the concept documentation:
  - [Pod-level resource managers](/docs/concepts/resource-management/pod-level-resource-managers/)
- Learn how to configure node-level resource managers:
  - [Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/)
  - [Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/)
  - [Utilizing the NUMA-aware Memory Manager](/docs/tasks/administer-cluster/memory-manager/)
- Learn how to assign resources:
  - [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
  - [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
  - [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
