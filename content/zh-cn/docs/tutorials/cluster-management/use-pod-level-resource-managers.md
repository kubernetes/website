---
title: 使用 Pod 级资源与 kubelet 资源管理器
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.36
---
<!--
title: Use Pod-Level Resources with kubelet Resource Managers
reviewers:
- ffromani
- ndixita
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.36
-->

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

<!--
This tutorial demonstrates how to configure the kubelet's resource managers
(topology, CPU, and memory) to support pod-level resource specifications. You
can define *hybrid allocation models* where some containers receive exclusive,
NUMA-aligned infrastructure resources while others share the remaining resources
from a pod-level shared pool.
-->
本教程演示如何配置 `kubelet` 的资源管理器（拓扑、CPU 和内存）
以支持 Pod 级资源规约。你可以定义**混合分配模型**：
其中一些容器获得独占的、NUMA 对齐的基础设施资源，
而另一些容器则共享 Pod 级共享池中的剩余资源。

<!--
To learn more about the concepts behind this feature, read the
[Pod-level resource managers](/docs/concepts/resource-management/pod-level-resource-managers/)
concept page.
-->
要了解该特性背后的概念，请阅读
[Pod 级资源管理器](/zh-cn/docs/concepts/resource-management/pod-level-resource-managers/)概念页面。

<!-- lessoncontent -->

## {{% heading "objectives" %}}

<!--
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
-->
- 配置 `kubelet` 资源管理器（CPU、内存和拓扑）以支持 Pod 级资源。
- 使用 `pod` 拓扑管理器作用域部署工作负载，以实现混合的独占容器和共享容器，并达到单 NUMA 对齐。
- 查看并验证 CPU 和内存资源如何在独占容器与 Pod 共享池之间划分。
- 了解当 Pod 级共享池将为空时的准入拒绝规则。
- 使用 `container` 拓扑管理器作用域和混合的容器分配部署工作负载。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
To complete this tutorial, you need:

-   A Kubernetes cluster with **Linux worker nodes** (pod-level resource
    managers are not supported on Windows nodes).
-   At least one worker node with **NUMA topology** (preferably multiple NUMA
    nodes to observe alignment).
-   **Administrative access** (root or `sudo`) on the worker node(s) to modify
    [`kubelet` configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
    and restart the `kubelet` service.
-   `kubectl` access with permission to create namespaces and pods.
-->
要完成本教程，你需要：

- 一个带有 **Linux 工作节点**的 Kubernetes 集群
  （Pod 级资源管理器在 Windows 节点上不受支持）。
- 至少一个具有 **NUMA 拓扑**的工作节点
  （最好有多个 NUMA 节点，以便观察对齐情况）。
- 在工作节点上拥有**管理权限**（root 或 `sudo`），
  以修改 [`kubelet` 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)并重启 `kubelet` 服务。
- 拥有 `kubectl` 访问权限，且具备创建名字空间和 Pod 的权限。

<!--
Ensure the following
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) are
enabled for your control plane and for the worker nodes:
-->
确保为控制平面和工作节点启用了以下[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)：

- `PodLevelResources`
- `PodLevelResourceManagers`

<!--
## Create a namespace {#create-namespace}

Create a namespace so that the resources created in this tutorial are isolated
from the rest of your cluster:
-->
## 创建一个名字空间 {#create-namespace}

创建一个名字空间，使本教程中创建的资源与集群的其余部分隔离开来：

```shell
kubectl create namespace plrm-tutorial
```

<!--
## Use pod scope with mixed allocation {#use-pod-scope-with-mixed-allocation}

When the Topology Manager scope is set to `pod`, the `kubelet` performs a single
NUMA alignment for the entire Pod based on `.spec.resources`. The resulting
resource budget is then partitioned: containers requesting `Guaranteed`
resources receive exclusive slices, while containers that do not receive an
exclusive allocation share the remaining budget in a pod-level shared pool.
-->
## 在混合分配场景中使用 Pod 作用域  {#use-pod-scope-with-mixed-allocation}

当拓扑管理器的作用域设置为 `pod` 时，`kubelet` 会基于 `.spec.resources`
为整个 Pod 执行一次 NUMA 对齐。得到的资源预算随后被划分：
请求 `Guaranteed` 资源的容器获得独占切片，
而未获得独占分配的容器则在 Pod 级共享池中共享剩余的预算。

<!--
### Step 1: Configure kubelet for pod scope

To enable this behavior, configure the `kubelet` on the target worker node(s)
where you want to run these workloads with the required policies. You can update
your [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
for those nodes as follows:
-->
### 第 1 步：针对 Pod 作用域配置 kubelet  {#step-1-configure-kubelet-for-pod-scope}

若要启用此行为，请在希望以所需策略运行这些工作负载的目标工作节点上配置 `kubelet`。
你可以按如下方式更新这些节点的
[kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cpuManagerPolicy: "static"
memoryManagerPolicy: "Static"
topologyManagerScope: "pod"
topologyManagerPolicy: "single-numa-node"
```

<!--
-   For `topologyManagerPolicy`, the valid values are
    `single-numa-node`, `restricted`, or `best-effort`. You cannot specify
    any other value when using Pod-level resource management.
-->
- 对于 `topologyManagerPolicy`，有效值为 `single-numa-node`、`restricted` 或 `best-effort`。
  使用 Pod 级资源管理时，你不能指定其他任何值。

<!--
Restart the kubelet to apply the configuration. For example, on Linux with
systemd: `systemctl restart kubelet.service`.
-->
重启 kubelet 以应用该配置。例如，在使用 systemd 的 Linux 上：
`systemctl restart kubelet.service`。

<!--
### Step 2: Deploy a mixed-allocation pod

Consider the following example Pod manifest. The Pod requests a total budget of
4 CPUs at the pod level (`.spec.resources`). Inside the Pod:
-->
### 第 2 步：部署混合分配的 Pod {#step-2-deploy-a-mixed-allocation-pod}

请考虑以下示例 Pod 清单。该 Pod 在 Pod 级别（`.spec.resources`）
请求总计 4 个 CPU 的预算。在该 Pod 内部：

<!--
-   the `main-app` container requests an exclusive allocation of 2 entire CPU
    cores (`requests` = `limits` = 2 CPU).
-   because `metrics-sidecar` and `logging-sidecar` do not specify
    container-level requests, those two sidecar containers share the CPU cores
    that remain from the pod-level shared pool: 2 CPU cores.
-->
- `main-app` 容器请求 2 个完整 CPU 核心的独占分配
  （`requests` = `limits` = 2 CPU）。
- 由于 `metrics-sidecar` 和 `logging-sidecar` 未指定容器级别的 requests，
  这两个边车容器共享 Pod 级共享池中剩余的 CPU 核心：2 个 CPU 核心。

{{% code_sample file="pods/resource/pod-level-resource-managers-pod-scope-mixed.yaml" %}}

<!--
Apply the manifest to your cluster:
-->
将清单应用到你的集群：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-pod-scope-mixed.yaml --namespace=plrm-tutorial
```

<!--
### Step 3: Verify and inspect resource partitioning

1.  Check that the Pod is running successfully:
-->
### 第 3 步：验证和检查资源划分 {#step-3-verify-and-inspect-resource-partitioning}

1. 检查 Pod 是否成功运行：

   ```shell
   kubectl get pod pod-scope-mixed --namespace=plrm-tutorial
   ```

<!--
2.  Understand what happened behind the scenes:
-->
2. 了解背后发生了什么：

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

   <!--
   -   Pod Alignment: The Topology Manager evaluated the 4 CPU pod request
        (`spec.resources`) and assigned the entire Pod to a single NUMA node.
   -   Exclusive Allocation: The CPU Manager allocated a dedicated 2 CPU slice
        to `main-app`. CPU CFS quota throttling is disabled for `main-app`,
        giving it unthrottled access to those exclusive cores.
   -->

   - **Pod 对齐：** 拓扑管理器评估了 4 个 CPU 的 Pod 请求
    （`spec.resources`），并将整个 Pod 分配到单个 NUMA 节点。
   - **独占分配：** CPU 管理器为 `main-app` 分配了一个专属的 2 个 CPU 切片。
    `main-app` 的 CPU CFS 配额节流被禁用，使其能够不受节流地访问这些独占核心。

   <!--
   - Pod Shared Pool: The remaining 2 CPUs form a pod-level shared pool.
     `metrics-sidecar` and `logging-sidecar` specify no container-level
     resources (`resources: {}`), so they run within this pod-isolated shared
     pool with CFS quota enforcement enabled. While shared between these two
     sidecars, the pool is isolated from external workloads on the node,
     providing the sidecars with dedicated NUMA locality and protection from
     node-level resource contention.
   -->

   - **Pod 共享池：** 剩余的 2 个 CPU 构成一个 Pod 级共享池。
     `metrics-sidecar` 和 `logging-sidecar` 未指定任何容器级资源
     （`resources: {}`），因此它们在这个 Pod 隔离的共享池中运行，
     并启用了 CFS 配额强制执行。虽然该池由这两个边车共享，
     但它与节点上的外部工作负载隔离开来，为这些边车提供专属的 NUMA 局部性，并防止节点级资源争用。

<!--
## Observe empty shared pool admission restrictions {#empty-shared-pool-restrictions}

When using the `pod` scope, `kubelet` admission control rejects Pod
specifications that would result in an empty Pod shared pool when there are
containers that require one.
-->
## 观察空共享池的准入限制 {#empty-shared-pool-restrictions}

使用 `pod` 作用域时，如果存在需要共享池的容器，而某些 Pod 规约会导致 Pod 共享池为空，
则 `kubelet` 的准入控制会拒绝这些 Pod 规约。

<!--
If the sum of exclusive resource requests from `Guaranteed` containers equals
the total pod-level budget, and at least one other container requires the shared
pool, the `kubelet` rejects the Pod.
-->
如果来自 `Guaranteed` 容器的独占资源请求之和等于 Pod 级总预算，
并且至少还有一个容器需要共享池，那么 `kubelet` 将拒绝该 Pod。

<!--
### Step 4: Examine the invalid pod manifest

Consider the following manifest. The Pod requests a total budget of 4 CPUs.
`container-a` requests an exclusive 1 CPU and `container-b` requests an
exclusive 3 CPUs (totaling 4 CPUs). `container-c` does not request exclusive
resources and requires a shared pool, but 0 CPUs remain:
-->
### 第 4 步：检查无效的 Pod 清单 {#step-4-examine-the-invalid-pod-manifest}

请考虑以下清单。该 Pod 请求总计 4 个 CPU 的预算。
`container-a` 请求独占的 1 个 CPU，`container-b` 请求独占的 3 个 CPU
（合计 4 个 CPU）。`container-c` 未请求独占资源且需要共享池，但已剩下 0 个 CPU：

{{% code_sample file="pods/resource/pod-level-resource-managers-empty-shared-pool.yaml" %}}

<!--
### Step 5: Attempt deployment and observe rejection

1.  Apply the manifest:
-->
### 第 5 步：尝试部署并观察拒绝 {#step-5-attempt-deployment-and-observe-rejection}

1. 应用此清单：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-empty-shared-pool.yaml --namespace=plrm-tutorial
   ```

<!--
2.  Inspect the Pod events to observe the admission error:
-->
2. 查看 Pod 事件以观察准入错误：

   ```shell
   kubectl describe pod empty-shared-pool --namespace=plrm-tutorial
   ```

   <!--
   Notice the event message explaining that the `kubelet` rejected the Pod
   because the pod-level shared pool would be empty for containers requiring
   shared resources:
   -->

   请注意事件消息，它说明 `kubelet` 拒绝该 Pod 的原因是：
   对于需要共享资源的容器而言，Pod 级共享池将为空：

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

<!--
## Use container scope with mixed allocation {#use-container-scope-with-mixed-allocation}

You can also configure the Topology Manager scope to `container`. In this mode,
the `kubelet` evaluates each container individually for exclusive allocation,
while the overall Pod budget in `.spec.resources` still enforces QoS and cgroup
limit boundaries.
-->
## 在混合分配场景下使用 container 作用域 {#use-container-scope-with-mixed-allocation}

你也可以将拓扑管理器的作用域配置为 `container`。在此模式下，`kubelet` 会逐个评估每个容器以进行独占分配，
而 `.spec.resources` 中的 Pod 总体预算仍会强制执行 QoS 和 cgroup 限额边界。

<!--
### Step 6: Configure kubelet for container scope

Update your
[kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/) on
the target worker node(s) for the `container` scope:
-->
### 第 6 步：为 container 作用域配置 kubelet {#step-6-configure-kubelet-for-container-scope}

在目标工作节点上更新你的
[kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)，以使用 `container` 作用域：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cpuManagerPolicy: "static"
memoryManagerPolicy: "Static"
topologyManagerScope: "container"
topologyManagerPolicy: "single-numa-node"
```

<!--
Restart the kubelet to apply the configuration. For example, on Linux with
systemd: `systemctl restart kubelet.service`.
-->
重启 kubelet 以应用该配置。例如，在使用 systemd 的 Linux 上：
`systemctl restart kubelet.service`。

<!--
### Step 7: Deploy a container-scoped mixed workload

Consider the following example Pod manifest. The Pod has a total budget of 4
CPUs:
-->
### 第 7 步：部署容器作用域的混合工作负载 {#step-7-deploy-a-container-scoped-mixed-workload}

请考虑以下示例 Pod 清单。该 Pod 的总预算为 4 个 CPU：

<!--
-   `infrastructure-sidecar` requests an exclusive 2 CPU slice (`requests` =
    `limits` = 2 CPU).
-   `worker-1` and `worker-2` do not specify container-level requests and run in
    the general, node-wide shared pool.
-->
- `infrastructure-sidecar` 请求独占的 2 个 CPU 切片（`requests` = `limits` = 2 CPU）。
- `worker-1` 和 `worker-2` 未指定容器级别的 requests，而是在常规的节点级共享池中运行。

{{% code_sample file="pods/resource/pod-level-resource-managers-container-scope-mixed.yaml" %}}

<!--
Apply the manifest:
-->
应用该清单：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-container-scope-mixed.yaml --namespace=plrm-tutorial
```

<!--
### Step 8: Verify the deployment

1.  Check that the Pod is running:
-->
### 第 8 步：验证部署 {#step-8-verify-the-deployment}

1. 检查 Pod 是否正在运行：

   ```shell
   kubectl get pod container-scope-mixed --namespace=plrm-tutorial
   ```

<!--
2.  Understand what happened behind the scenes:
-->
2. 了解背后发生了什么：

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

   <!--
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
   -->

   - **容器作用域对齐：** 在 `container` 作用域下，`kubelet` 会逐个评估容器。
     `infrastructure-sidecar` 直接从节点的可分配池中获得一个独占的、NUMA 对齐的 2 个 CPU 切片。
   - **节点共享池：** `worker-1` 和 `worker-2` 未指定任何容器级资源请求
     （`resources: {}`），因此在 `container` 作用域下，它们在节点的常规共享池中运行（而不是在 Pod 隔离的池中）。
   - **Pod 限额强制执行：** 所有容器的 CPU 消耗总量仍由 Pod 级限额（`spec.resources.limits`）限制在 4 个 CPU 以内。

## {{% heading "cleanup" %}}

<!--
Delete the namespace and all sample Pods created during this tutorial:
-->
删除本教程中创建的名字空间和所有示例 Pod：

```shell
kubectl delete namespace plrm-tutorial
```

## {{% heading "whatsnext" %}}

<!--
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
-->
- 阅读概念文档：
  - [Pod 级资源管理器](/zh-cn/docs/concepts/resource-management/pod-level-resource-managers/)
- 了解如何配置节点级资源管理器：
  - [控制节点上的拓扑管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)
  - [控制节点上的 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)
  - [控制节点上的内存管理策略](/zh-cn/docs/tasks/administer-cluster/memory-manager/)
- 了解如何分配资源：
  - [分配 Pod 级别 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)
  - [为容器和 Pods 分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
  - [为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
