---
title: 为容器和 Pods 分配 CPU 资源
content_type: task
weight: 20
---

<!--
title: Assign CPU Resources to Containers and Pods
content_type: task
weight: 20
-->

<!-- overview -->

<!--
This page shows how to assign a CPU *request* and a CPU *limit* to
a container. Containers cannot use more CPU than the configured limit.
Provided the system has CPU time free, a container is guaranteed to be
allocated as much CPU as it requests.
-->
本页面展示如何为容器设置 CPU **request（请求）** 和 CPU **limit（限制）**。
容器使用的 CPU 不能超过所配置的限制。
如果系统有空闲的 CPU 时间，则可以保证给容器分配其所请求数量的 CPU 资源。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Your cluster must have at least 1 CPU available for use to run the task examples.

A few of the steps on this page require you to run the
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
service in your cluster. If you have the metrics-server
running, you can skip those steps.

If you are running {{< glossary_tooltip term_id="minikube" >}}, run the
following command to enable metrics-server:
-->
你的集群必须至少有 1 个 CPU 可用才能运行本任务中的示例。

本页的一些步骤要求你在集群中运行
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
服务。如果你的集群中已经有正在运行的 metrics-server 服务，可以跳过这些步骤。

如果你正在运行 {{< glossary_tooltip term_id="minikube" >}}，请运行以下命令启用 metrics-server：

```shell
minikube addons enable metrics-server
```

<!-- 
To see whether metrics-server (or another provider of the resource metrics
API, `metrics.k8s.io`) is running, type the following command:
-->
查看 metrics-server（或者其他资源指标 API `metrics.k8s.io` 服务提供者）是否正在运行，
请键入以下命令：

```shell
kubectl get apiservices
```

<!-- 
If the resource metrics API is available, the output will include a
reference to `metrics.k8s.io`.
-->
如果资源指标 API 可用，则会输出将包含一个对 `metrics.k8s.io` 的引用。

```
NAME
v1beta1.metrics.k8s.io
```

<!-- steps -->

<!-- 
## Create a namespace

Create a {{< glossary_tooltip term_id="namespace" >}} so that the resources you
create in this exercise are isolated from the rest of your cluster.
-->
## 创建一个名字空间 {#create-a-namespace}

创建一个{{< glossary_tooltip text="名字空间" term_id="namespace" >}}，以便将
本练习中创建的资源与集群的其余部分资源隔离。

```shell
kubectl create namespace cpu-example
```

<!-- 
## Specify a CPU request and a CPU limit

To specify a CPU request for a container, include the `resources:requests` field
in the Container resource manifest. To specify a CPU limit, include `resources:limits`.

In this exercise, you create a Pod that has one container. The container has a request
of 0.5 CPU and a limit of 1 CPU. Here is the configuration file for the Pod:

{{% code_sample file="pods/resource/cpu-request-limit.yaml" %}}

The `args` section of the configuration file provides arguments for the container when it starts.
The `-cpus "2"` argument tells the Container to attempt to use 2 CPUs.

Create the Pod:
-->
## 指定 CPU 请求和 CPU 限制 {#specify-a-CPU-request-and-a-CPU-limit}

要为容器指定 CPU 请求，请在容器资源清单中包含 `resources: requests` 字段。
要指定 CPU 限制，请包含 `resources:limits`。

在本练习中，你将创建一个具有一个容器的 Pod。容器将会请求 0.5 个 CPU，而且最多限制使用 1 个 CPU。
这是 Pod 的配置文件：

{{% code_sample file="pods/resource/cpu-request-limit.yaml" %}}

配置文件的 `args` 部分提供了容器启动时的参数。
`-cpus "2"` 参数告诉容器尝试使用 2 个 CPU。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

<!-- 
Verify that the Pod is running:
-->
验证所创建的 Pod 处于 Running 状态

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

<!-- 
View detailed information about the Pod:
-->
查看显示关于 Pod 的详细信息：

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

<!-- 
The output shows that the one container in the Pod has a CPU request of 500 milliCPU
and a CPU limit of 1 CPU.
-->
输出显示 Pod 中的一个容器的 CPU 请求为 500 milliCPU，并且 CPU 限制为 1 个 CPU。

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

<!-- 
Use `kubectl top` to fetch the metrics for the Pod:
-->
使用 `kubectl top` 命令来获取该 Pod 的指标：

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

<!-- 
This example output shows that the Pod is using 974 milliCPU, which is
slightly less than the limit of 1 CPU specified in the Pod configuration.
-->
此示例输出显示 Pod 使用的是 974 milliCPU，即略低于 Pod 配置中指定的 1 个 CPU 的限制。

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

<!-- 
Recall that by setting `-cpu "2"`, you configured the Container to attempt to use 2 CPUs, but the Container is only being allowed to use about 1 CPU. The container's CPU use is being throttled, because the container is attempting to use more CPU resources than its limit.
-->
回想一下，通过设置 `-cpu "2"`，你将容器配置为尝试使用 2 个 CPU，
但是容器只被允许使用大约 1 个 CPU。
容器的 CPU 用量受到限制，因为该容器正尝试使用超出其限制的 CPU 资源。

{{< note >}}
<!-- 
Another possible explanation for the CPU use being below 1.0 is that the Node might not have
enough CPU resources available. Recall that the prerequisites for this exercise require your cluster to have at least 1 CPU available for use. If your Container runs on a Node that has only 1 CPU, the Container cannot use more than 1 CPU regardless of the CPU limit specified for the Container.
-->
CPU 使用率低于 1.0 的另一种可能的解释是，节点可能没有足够的 CPU 资源可用。
回想一下，此练习的先决条件需要你的集群至少具有 1 个 CPU 可用。
如果你的容器在只有 1 个 CPU 的节点上运行，则容器无论为容器指定的 CPU 限制如何，
都不能使用超过 1 个 CPU。
{{< /note >}}

<!-- 
## CPU units

The CPU resource is measured in *CPU* units. One CPU, in Kubernetes, is equivalent to:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 Hyperthread on a bare-metal Intel processor with Hyperthreading
-->
## CPU 单位  {#cpu-units}

CPU 资源以 **CPU** 单位度量。Kubernetes 中的一个 CPU 等同于：

* 1 个 AWS vCPU 
* 1 个 GCP核心
* 1 个 Azure vCore
* 裸机上具有超线程能力的英特尔处理器上的 1 个超线程

<!-- 
Fractional values are allowed. A Container that requests 0.5 CPU is guaranteed half as much
CPU as a Container that requests 1 CPU. You can use the suffix m to mean milli. For example
100m CPU, 100 milliCPU, and 0.1 CPU are all the same. Precision finer than 1m is not allowed.

CPU is always requested as an absolute quantity, never as a relative quantity; 0.1 is the same
amount of CPU on a single-core, dual-core, or 48-core machine.

Delete your Pod:
-->
小数值是可以使用的。一个请求 0.5 CPU 的容器保证会获得请求 1 个 CPU 的容器的 CPU 的一半。
你可以使用后缀 `m` 表示毫。例如 `100m` CPU、100 milliCPU 和 0.1 CPU 都相同。
精度不能超过 1m。

CPU 请求只能使用绝对数量，而不是相对数量。0.1 在单核、双核或 48 核计算机上的 CPU 数量值是一样的。

删除 Pod：

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

<!-- 
## Specify a CPU request that is too big for your Nodes

CPU requests and limits are associated with Containers, but it is useful to think
of a Pod as having a CPU request and limit. The CPU request for a Pod is the sum
of the CPU requests for all the Containers in the Pod. Likewise, the CPU limit for
a Pod is the sum of the CPU limits for all the Containers in the Pod.

Pod scheduling is based on requests. A Pod is scheduled to run on a Node only if
the Node has enough CPU resources available to satisfy the Pod CPU request.

In this exercise, you create a Pod that has a CPU request so big that it exceeds
the capacity of any Node in your cluster. Here is the configuration file for a Pod
that has one Container. The Container requests 100 CPU, which is likely to exceed the
capacity of any Node in your cluster.

{{% code_sample file="pods/resource/cpu-request-limit-2.yaml" %}}

Create the Pod:
-->
## 设置超过节点能力的 CPU 请求 {#specify-a-CPU-request-that-is-too-big-for-your-nodes}

CPU 请求和限制与都与容器相关，但是我们可以考虑一下 Pod 具有对应的 CPU 请求和限制这样的场景。
Pod 对 CPU 用量的请求等于 Pod 中所有容器的请求数量之和。
同样，Pod 的 CPU 资源限制等于 Pod 中所有容器 CPU 资源限制数之和。

Pod 调度是基于资源请求值来进行的。
仅在某节点具有足够的 CPU 资源来满足 Pod CPU 请求时，Pod 将会在对应节点上运行：

在本练习中，你将创建一个 Pod，该 Pod 的 CPU 请求对于集群中任何节点的容量而言都会过大。
下面是 Pod 的配置文件，其中有一个容器。容器请求 100 个 CPU，这可能会超出集群中任何节点的容量。

{{% code_sample file="pods/resource/cpu-request-limit-2.yaml" %}}

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```
<!-- 
View the Pod status:
-->
查看该 Pod 的状态：

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

<!-- 
The output shows that the Pod status is Pending. That is, the Pod has not been
scheduled to run on any Node, and it will remain in the Pending state indefinitely:
-->
输出显示 Pod 状态为 Pending。也就是说，Pod 未被调度到任何节点上运行，
并且 Pod 将无限期地处于 Pending 状态：

```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

<!-- 
View detailed information about the Pod, including events:
-->

查看有关 Pod 的详细信息，包含事件：

```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

<!-- 
The output shows that the Container cannot be scheduled because of insufficient
CPU resources on the Nodes:
-->
输出显示由于节点上的 CPU 资源不足，无法调度容器：

```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

<!-- 
Delete your Pod:
-->
删除你的 Pod： 

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

<!-- 
## If you do not specify a CPU limit

If you do not specify a CPU limit for a Container, then one of these situations applies:

* The Container has no upper bound on the CPU resources it can use. The Container
could use all of the CPU resources available on the Node where it is running.

* The Container is running in a namespace that has a default CPU limit, and the
Container is automatically assigned the default limit. Cluster administrators can use a
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
to specify a default value for the CPU limit.
-->
## 如果不指定 CPU 限制 {#if-you-do-not-specify-a-cpu-limit}

如果你没有为容器指定 CPU 限制，则会发生以下情况之一：

* 容器在可以使用的 CPU 资源上没有上限。因而可以使用所在节点上所有的可用 CPU 资源。

* 容器在具有默认 CPU 限制的名字空间中运行，系统会自动为容器设置默认限制。
  集群管理员可以使用
  [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
  指定 CPU 限制的默认值。

<!--
## If you specify a CPU limit but do not specify a CPU request

If you specify a CPU limit for a Container but do not specify a CPU request, Kubernetes automatically
assigns a CPU request that matches the limit. Similarly, if a Container specifies its own memory limit,
but does not specify a memory request, Kubernetes automatically assigns a memory request that matches
the limit.
-->
## 如果你设置了 CPU 限制但未设置 CPU 请求 {#if-you-specify-a-CPU-limit-but-do-not-specify-a-CPU-request}

如果你为容器指定了 CPU 限制值但未为其设置 CPU 请求，Kubernetes 会自动为其
设置与 CPU 限制相同的 CPU 请求值。类似的，如果容器设置了内存限制值但未设置
内存请求值，Kubernetes 也会为其设置与内存限制值相同的内存请求。

<!-- 
## Motivation for CPU requests and limits

By configuring the CPU requests and limits of the Containers that run in your
cluster, you can make efficient use of the CPU resources available on your cluster
Nodes. By keeping a Pod CPU request low, you give the Pod a good chance of being
scheduled. By having a CPU limit that is greater than the CPU request, you accomplish two things:

* The Pod can have bursts of activity where it makes use of CPU resources that happen to be available.
* The amount of CPU resources a Pod can use during a burst is limited to some reasonable amount.
-->
## CPU 请求和限制的初衷 {#motivation-for-CPU-requests-and-limits}

通过配置你的集群中运行的容器的 CPU 请求和限制，你可以有效利用集群上可用的 CPU 资源。
通过将 Pod CPU 请求保持在较低水平，可以使 Pod 更有机会被调度。
通过使 CPU 限制大于 CPU 请求，你可以完成两件事：

* Pod 可能会有突发性的活动，它可以利用碰巧可用的 CPU 资源。

* Pod 在突发负载期间可以使用的 CPU 资源数量仍被限制为合理的数量。	

<!-- 
## Clean up

Delete your namespace:
-->
## 清理 {#clean-up}

删除名字空间：

```shell
kubectl delete namespace cpu-example
```

## {{% heading "whatsnext" %}}


<!-- 
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

-->
### 针对应用开发者 {#for-app-developers}

* [将内存资源分配给容器和 Pod](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)

* [配置 Pod 服务质量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)

<!-- 
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
-->
### 针对集群管理员 {for-cluster-administrators}

* [配置名字空间的默认内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为名字空间配置默认 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [为名字空间配置最小和最大内存限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为名字空间配置最小和最大 CPU 约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为名字空间配置内存和 CPU 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [为名字空间配置 Pod 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [配置 API 对象的配额](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)
* [调整分配给容器的 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)
 