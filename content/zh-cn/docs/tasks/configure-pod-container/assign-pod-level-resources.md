---
title: 分配 Pod 级别 CPU 和内存资源
content_type: task
weight: 30
min-kubernetes-server-version: 1.32
---
<!--
title: Assign Pod-level CPU and memory resources
content_type: task
weight: 30
min-kubernetes-server-version: 1.32
-->

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResources" >}}

<!--
This page shows how to specify CPU and memory resources for a Pod at pod-level in
addition to container-level resource specifications. A Kubernetes node allocates
resources to a pod based on the pod's resource requests. These requests can be
defined at the pod level or individually for containers within the pod. When
both are present, the pod-level requests take precedence.
-->
本页介绍除了容器级别的资源规约外，如何在 Pod 级别指定 CPU 和内存资源。
Kubernetes 节点基于 Pod 的资源请求分配资源。
这些请求可以在 Pod 级别定义，也可以逐个为 Pod 内的容器定义。
当两种级别的请求都存在时，Pod 级别的请求优先。

<!--
Similarly, a pod's resource usage is restricted by limits, which can also be set at
the pod-level or individually for containers within the pod. Again,
pod-level limits are prioritized when both are present. This allows for flexible
resource management, enabling you to control resource allocation at both the pod and
container levels.

In order to specify the resources at pod-level, it is required to enable
`PodLevelResources` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->
同样，Pod 的资源用量受限于限制值（limits），这些限制值也可以在 Pod 级别或为 Pod 内的容器逐个设置。
另外，当两种级别的限制值都存在时，Pod 级别的设置值优先。
这样可以灵活地管理资源，使你能够在 Pod 级别和容器级别控制资源分配。

要在 Pod 级别指定资源，必须启用 `PodLevelResources`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
For Pod Level Resources:
* Priority: When both pod-level and container-level resources are specified,
  pod-level resources take precedence.
* QoS: Pod-level resources take precedence in influencing the QoS class of the pod.
* OOM Score: The OOM score adjustment calculation considers both pod-level and
  container-level resources.
* Compatibility: Pod-level resources are designed to be compatible with existing
  features.
-->
对于 Pod 级别资源：

* 优先级：当 Pod 级别和容器级别的资源被同时指定时，Pod 级别的资源优先。
* QoS：Pod 级别的资源在影响 Pod 的 QoS 类时优先。
* OOM 分数：OOM 分数调整计算会同时考虑 Pod 级别和容器级别的资源。
* 兼容性：Pod 级别的资源设计为与现有特性兼容。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
The `PodLevelResources` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) must be enabled
for your control plane and for all nodes in your cluster.
-->
你必须为集群中的控制平面和所有节点启用 `PodLevelResources`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建命名空间   {#create-a-namespace}

创建一个命名空间，以便你在本次练习中所创建的资源与集群的其余部分隔离开来。

```shell
kubectl create namespace pod-resources-example
```

<!--
## Create a pod with memory requests and limits at pod-level

To specify memory requests for a Pod at pod-level, include the `resources.requests.memory`
field in the Pod spec manifest. To specify a memory limit, include `resources.limits.memory`.

In this exercise, you create a Pod that has one Container. The Pod has a
memory request of 100 MiB and a memory limit of 200 MiB. Here's the configuration
file for the Pod:
-->
## 创建具有 Pod 级别内存请求和限制的 Pod

要在 Pod 级别为 Pod 指定内存请求，可以在 Pod 规约清单中包含 `resources.requests.memory` 字段。
要指定内存限制，可以包含 `resources.limits.memory` 字段。

在本次练习中，你将创建包含一个容器的 Pod。
此 Pod 的内存请求为 100 MiB，内存限制为 200 MiB。以下是 Pod 的配置文件：

{{% code_sample file="pods/resource/pod-level-memory-request-limit.yaml" %}}

<!--
The `args` section in the manifest provides arguments for the container when it starts.
The `"--vm-bytes", "150M"` arguments tell the Container to attempt to allocate 150 MiB of memory.

Create the Pod:
-->
清单中的 `args` 部分在容器启动时为容器提供参数。
`"--vm-bytes", "150M"` 参数告知容器尝试分配 150 MiB 的内存。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-memory-request-limit.yaml --namespace=pod-resources-example
```

<!--
Verify that the Pod is running:
-->
验证 Pod 正在运行：

```shell
kubectl get pod memory-demo --namespace=pod-resources-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的详细信息：

```shell
kubectl get pod memory-demo --output=yaml --namespace=pod-resources-example
```

<!--
The output shows that the Pod has a memory request of 100 MiB
and a memory limit of 200 MiB.
-->
输出显示 Pod 的内存请求为 100 MiB，内存限制为 200 MiB。

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

<!--
Run `kubectl top` to fetch the metrics for the pod:
-->
运行 `kubectl top` 获取 Pod 的指标度量值：

```shell
kubectl top pod memory-demo --namespace=pod-resources-example
```

<!--
The output shows that the Pod is using about 162,900,000 bytes of memory, which
is about 150 MiB. This is greater than the Pod's 100 MiB request, but within the
Pod's 200 MiB limit.
-->
输出显示 Pod 使用了大约 162,900,000 字节的内存，约 150 MiB。
这个数值超过了 Pod 的 100 MiB 请求值，但小于 Pod 的 200 MiB 限制值。

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

<!--
## Create a pod with CPU requests and limits at pod-level
To specify a CPU request for a Pod, include the `resources.requests.cpu` field
in the Pod spec manifest. To specify a CPU limit, include `resources.limits.cpu`.

In this exercise, you create a Pod that has one container. The Pod has a request
of 0.5 CPU and a limit of 1 CPU. Here is the configuration file for the Pod:
-->
## 创建具有 Pod 级别 CPU 请求和限制的 Pod

要为 Pod 指定 CPU 请求，可以在 Pod 规约清单中包含 `resources.requests.cpu` 字段。
要指定 CPU 限制，可以包含 `resources.limits.cpu` 字段。

在本次练习中，你将创建包含一个容器的 Pod。
此 Pod 的请求为 0.5 CPU，限制为 1 CPU。以下是 Pod 的配置文件：

{{% code_sample file="pods/resource/pod-level-cpu-request-limit.yaml" %}}

<!--
The `args` section of the configuration file provides arguments for the container when it starts.
The `-cpus "2"` argument tells the Container to attempt to use 2 CPUs.

Create the Pod:
-->
配置文件的 `args` 部分在容器启动时为容器提供参数。
`-cpus "2"` 参数告知容器尝试使用 2 个 CPU。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-cpu-request-limit.yaml --namespace=pod-resources-example
```

<!--
Verify that the Pod is running:
-->
验证 Pod 正在运行：

```shell
kubectl get pod cpu-demo --namespace=pod-resources-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的详细信息：

```shell
kubectl get pod cpu-demo --output=yaml --namespace=pod-resources-example
```

<!--
The output shows that the Pod has a CPU request of 500 milliCPU
and a CPU limit of 1 CPU.
-->
输出显示 Pod 的 CPU 请求为 500 milliCPU，CPU 限制为 1 CPU。

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

<!--
Use `kubectl top` to fetch the metrics for the Pod:
-->
使用 `kubectl top` 获取 Pod 的指标度量值：

```shell
kubectl top pod cpu-demo --namespace=pod-resources-example
```

<!--
This example output shows that the Pod is using 974 milliCPU, which is
slightly less than the limit of 1 CPU specified in the Pod configuration.
-->
这个示例的输出显示 Pod 使用了 974 milliCPU，这略低于 Pod 配置中指定的 1 CPU 限制值。

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

<!--
Recall that by setting `-cpu "2"`, you configured the Container to attempt to use 2
CPUs, but the Container is only being allowed to use about 1 CPU. The container's
CPU use is being throttled, because the container is attempting to use more CPU
resources than the Pod CPU limit.
-->
请注意，通过设置 `-cpu "2"`，你配置了容器尝试使用 2 个 CPU，但容器仅被允许使用约 1 个 CPU。
容器的 CPU 用量受到限制，因为容器正在尝试使用超过 Pod CPU 限制值的 CPU 资源。

<!--
## Create a pod with resource requests and limits at both pod-level and container-level

To assign CPU and memory resources to a Pod, you can specify them at both the pod
level and the container level.  Include the `resources` field in the Pod spec to
define resources for the entire Pod. Additionally, include the `resources` field
within container's specification in the Pod's manifest to set container-specific
resource requirements.
-->
## 创建具有 Pod 级别和容器级别资源请求和限制的 Pod

要为 Pod 指定 CPU 和内存资源，你可以在 Pod 级别和容器级别同时指定它们。
在 Pod 规约中包含 `resources` 字段以定义整个 Pod 的资源。
此外，在 Pod 的清单中包含容器规约中的 `resources` 字段，以设置特定于容器的资源要求。

<!--
In this exercise, you'll create a Pod with two containers to explore the interaction
of pod-level and container-level resource specifications. The Pod itself will have
defined CPU requests and limits, while only one of the containers will have its own
explicit resource requests and limits. The other container will inherit the resource
constraints from the pod-level settings. Here's the configuration file for the Pod:
-->
在本次练习中，你将创建包含两个容器的 Pod，以探索 Pod 级别和容器级别资源规约的相互作用。
Pod 本身将定义 CPU 请求和限制，而只有一个容器将带有自己的显式资源请求和限制。
另一个容器将从 Pod 级别设置中继承资源约束。以下是 Pod 的配置文件：

{{% code_sample file="pods/resource/pod-level-resources.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resources.yaml --namespace=pod-resources-example
```

<!--
Verify that the Pod Container is running:
-->
验证 Pod 容器正在运行：

```shell
kubectl get pod-resources-demo --namespace=pod-resources-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的详细信息：

```shell
kubectl get pod memory-demo --output=yaml --namespace=pod-resources-example
```

<!--
The output shows that one container in the Pod has a memory request of 50 MiB and a
CPU request of 0.5 cores, with a memory limit of 100 MiB and a CPU limit of 0.5
cores. The Pod itself has a memory request of 100 MiB and a CPU request of
1 core, and a memory limit of 200 MiB and a CPU limit of 1 core.
-->
输出显示 Pod 中的一个容器具有 50 MiB 的内存请求和 0.5 核的 CPU 请求，
内存限制为 100 MiB，CPU 限制为 0.5 核。
Pod 本身具有 100 MiB 的内存请求和 1 核的 CPU 请求，以及 200 MiB 的内存限制和 1 核的 CPU 限制。

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

<!--
Since pod-level requests and limits are specified, the request guarantees for both
containers in the pod will be equal 1 core or CPU and 100Mi of memory. Additionally,
both containers together won't be able to use more resources than specified in the
pod-level limits, ensuring they cannot exceed a combined total of 200 MiB of memory
and 1 core of CPU.
-->
由于 Pod 级别的请求和限制被指定，所以 Pod 中两个容器的请求保证将等于 1 核 CPU 和 100Mi 内存。
此外，这两个容器能够使用的资源总量将不能超过 Pod 级别限制中指定的资源，
确保其使用的资源不能超过 200 MiB 的内存和 1 核的 CPU。

<!--
## Clean up

Delete your namespace:
-->
## 清理   {#clean-up}

删除你的命名空间：

```shell
kubectl delete namespace pod-resources-example
```

## {{% heading "whatsnext" %}}

<!--
### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
-->
### 对于应用开发者

* [为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [为容器和 Pod 分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
-->
### 对于集群管理员

* [为命名空间配置默认内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置默认 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [为命名空间配置最小和最大内存约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为命名空间配置最小和最大 CPU 约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为命名空间配置内存和 CPU 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
