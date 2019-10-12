---
title: 将 CPU 资源分配给容器和 Pods
content_template: templates/task
weight: 20
---
<!--

---
title: Assign CPU Resources to Containers and Pods
content_template: templates/task
weight: 20
---

-->

{{% capture overview %}}

<!--
This page shows how to assign a CPU *request* and a CPU *limit* to
a Container. A Container is guaranteed to have as much CPU as it requests,
but is not allowed to use more CPU than its limit.
-->
此页面讲述如何将 CPU *请求* 和CPU *限制* 分配给一个容器。保证容器具有所需的 CPU 数量，
但不允许使用超过其限制的 CPU。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Each node in your cluster must have at least 1 CPU.

A few of the steps on this page require you to run the
[metrics-server](https://github.com/kubernetes-incubator/metrics-server)
service in your cluster. If you have the metrics-server
running, you can skip those steps.
-->
在你集群中的每一个节点必须至少有一个 CPU。

下面是需要您在你的集群上运行[metrics-server](https://github.com/kubernetes-incubator/metrics-server) 服务的一些步骤。
如果您有 metrics-server 在运行，您可以跳过这些步骤。

<!--
If you are running minikube, run the following command to enable
metrics-server:

```shell
minikube addons enable metrics-server
```

To see whether metrics-server (or another provider of the resource metrics
API, `metrics.k8s.io`) is running, type the following command:

```shell
kubectl get apiservices
```

If the resource metrics API is available, the output will include a
reference to `metrics.k8s.io`.

```shell
NAME
v1beta1.metrics.k8s.io
```
-->
如果你正在运行 minikube，执行以下命令去启动 metrics-server：

```shell
minikube addons enable metrics-server
```

查看 metrics-server （或者资源度量 API `metrics.k8s.io` 的不同提供者）是否正在运行，输入以下命令：

```shell
kubectl get apiservices
```

如果资源度量 API 可用，则输出将包含一个对 `metrics.k8s.io` 的引用。

```shell
NAME
v1beta1.metrics.k8s.io
```

{{% /capture %}}

{{% capture steps %}}

<!-- ## Create a namespace -->
## 创建一个命名空间

<!--
Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace cpu-example
```
-->
创建一个命名空间，以便在您在本练习中创建的资源与集群的其余部分隔离。

```shell
kubectl create namespace cpu-example
```

<!-- ## Specify a CPU request and a CPU limit -->
## 指定 CPU 请求和 CPU 限制

<!--
To specify a CPU request for a Container, include the `resources:requests` field
in the Container resource manifest. To specify a CPU limit, include `resources:limits`.

In this exercise, you create a Pod that has one Container. The Container has a request of 0.5 CPU and a limit of 1 CPU. Here is the configuration file for the Pod:
-->
如果要为容器指定 CPU 请求，可以在容器资源清单中包含 `resources:requests` 字段。
如果要指定 CPU 限制，可以包含 `resources:limits` 字段。

在本次练习中，您将创建一个具有一个容器的 Pod。该容器的请求为 0.5 CPU，限制为 1 CPU。 这是此 Pod 的配置文件：

{{< codenew file="pods/resource/cpu-request-limit.yaml" >}}

<!--
The `args` section of the configuration file provides arguments for the Container when it starts.
The `-cpus "2"` argument tells the Container to attempt to use 2 CPUs.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

Verify that the Pod Container is running:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

View detailed information about the Pod:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```
-->
配置文件中的 `args` 部分提供了容器启动时的参数。这个 `-cpus "2"` 参数说明容器尝试使用 2 个 CPU。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

确认容器正在运行：

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

查看有关 Pod 的详细信息：

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

<!--
The output shows that the one Container in the Pod has a CPU request of 500 milliCPU
and a CPU limit of 1 CPU.

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

Use `kubectl top` to fetch the metrics for the pod:

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

The output shows that the Pod is using 974 milliCPU, which is just a bit less than
the limit of 1 CPU specified in the Pod configuration file.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Recall that by setting `-cpu "2"`, you configured the Container to attempt to use 2 CPUs, but the Container is only being allowed to use about 1 CPU. The Container CPU use is being throttled, because the Container is attempting to use more CPU resources than its limit.
-->
输出显示 Pod 中的一个容器的 CPU 请求为 500 milliCPU 且其 CPU 限制为 1 个 CPU。

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

使用 `kubectl top` 来获取 Pod 的度量值：

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

输出显示这个 Pod 使用的是 974 milliCPU，仅比 Pod 配置文件中指定的 1 个 CPU 限制少一点。

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

回想一下，通过设置 `-cpu“ 2”`，您配置容器尝试使用 2 个 CPU，但是这个容器只被允许使用大约 1 个 CPU。
因为容器正在尝试使用超出其限制的 CPU 资源，所以容器的 CPU 使用被限制。

<!--
Another possible explanation for the CPU throttling is that the Node might not have
enough CPU resources available. Recall that the prerequisites for this exercise require each of
your Nodes to have at least 1 CPU. If your Container runs on a Node that has only 1 CPU, the Container
cannot use more than 1 CPU regardless of the CPU limit specified for the Container.
-->

{{< note >}}
**注意**：CPU 节流的另一个可能解释是节点可能没有足够的 CPU 资源可用。
回想一下，此练习的先决条件需要您的节点至少具有 1 个 CPU。如果您的容器在只有 1 个 CPU 的节点上运行，
则无论为容器指定的 CPU 限制如何，这个容器都不能使用超过 1 个 CPU 的资源。
{{< /note >}}

<!-- ## CPU units -->

## CPU 单位

<!--
The CPU resource is measured in *CPU* units. One CPU, in Kubernetes, is equivalent to:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 Hyperthread on a bare-metal Intel processor with Hyperthreading

Fractional values are allowed. A Container that requests 0.5 CPU is guaranteed half as much
CPU as a Container that requests 1 CPU. You can use the suffix m to mean milli. For example
100m CPU, 100 milliCPU, and 0.1 CPU are all the same. Precision finer than 1m is not allowed.

CPU is always requested as an absolute quantity, never as a relative quantity; 0.1 is the same
amount of CPU on a single-core, dual-core, or 48-core machine.

Delete your Pod:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```
-->
CPU 资源以 *CPU* 单元为度量单位。在 Kubernetes 中，一个 CPU 等效于：

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 一台配备英特尔处理器的具有超线程功能的裸机上的一个超线程

允许使用小数值。保证 CPU 为 0.5 的容器的 CPU 数量是请求一个 CPU 的容器的一半。您可以使用后缀 m 表示毫。例如
100m CPU、100 milliCPU 和 0.1 CPU 都是相同的。精度不能超过 1m。

Kubernetes 只允许使用绝对数值来请求 CPU，而不是相对数量；在单核、双核或 48 核的计算机上，0.1 代表着相同的 CPU 数量。

<!-- ## Specify a CPU request that is too big for your Nodes -->

## 指定超过节点能力的CPU请求

<!--
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
-->

CPU 请求和限制是与容器相关联的，不过假定 Pod 也具有 CPU 请求和限制也是有用的想法。
一个 Pod 的 CPU 请求是这个 Pod 中的所有容器的 CPU 请求之和。
同样，一个 Pod 的 CPU 限制是这个 Pod 中所有容器的 CPU 限制数量之和。

Kubernetes 基于资源请求值来调度 Pod。仅当某节点具有足够的 CPU 资源可满足某 Pod 的 CPU 请求时，该 Pod 才可能被调度运行到该节点上。

在本练习中，您将创建一个 Pod，该 Pod 的 CPU 请求是如此的大以至于超过集群中任何节点的容量。
这是仅有一个容器的 Pod 的配置文件。这个容器请求 100 个 CPU，这可能会超出集群中任何节点的容量。

{{< codenew file="pods/resource/cpu-request-limit-2.yaml" >}}

<!--
Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

View the Pod status:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

查看 Pod 的状态：

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

<!--
The output shows that the Pod status is Pending. That is, the Pod has not been
scheduled to run on any Node, and it will remain in the Pending state indefinitely:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

View detailed information about the Pod, including events:

```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

The output shows that the Container cannot be scheduled because of insufficient
CPU resources on the Nodes:

```shell
Events:
  Reason			Message
  ------			-------
  FailedScheduling	No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```
-->
输出显示 Pod 状态为 Pending。也就是说，这个 Pod 还没有被调度到任何节点上运行，并且它将无限期地处于 Pending 状态：

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

查看有关 Pod 的详细信息，包括事件：

```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

输出显示容器不能被调度，原因是节点上没有足够的 CPU 资源：

```shell
Events:
  Reason			Message
  ------			-------
  FailedScheduling	No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

<!--
Delete your Pod:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```
-->
删除你的 Pod：

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

<!-- ## If you do not specify a CPU limit -->

## 如果您不指定 CPU 的限制数量

<!--
If you do not specify a CPU limit for a Container, then one of these situations applies:

* The Container has no upper bound on the CPU resources it can use. The Container
could use all of the CPU resources available on the Node where it is running.

* The Container is running in a namespace that has a default CPU limit, and the
Container is automatically assigned the default limit. Cluster administrators can use a
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
to specify a default value for the CPU limit.
-->
如果您没有为容器指定 CPU 限制，则会发生以下情况之一：

* 容器在可以使用的 CPU 资源上没有上限。容器可以使用运行节点上的所有可用的 CPU 资源。

* 容器在具有默认 CPU 限制的命名空间中运行，并且系统会自动为容器分配默认限制。集群管理员可以使用
[限制范围](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
指定 CPU 限制的默认值。

<!-- ## Motivation for CPU requests and limits -->

## CPU请求和限制的动机

<!--
By configuring the CPU requests and limits of the Containers that run in your
cluster, you can make efficient use of the CPU resources available on your cluster
Nodes. By keeping a Pod CPU request low, you give the Pod a good chance of being
scheduled. By having a CPU limit that is greater than the CPU request, you accomplish two things:

* The Pod can have bursts of activity where it makes use of CPU resources that happen to be available.
* The amount of CPU resources a Pod can use during a burst is limited to some reasonable amount.
-->
通过配置在集群中运行容器的 CPU 请求和限制，您可以有效地利用在集群节点上的可用 CPU 资源。
通过将 Pod CPU 请求保持在较低水平，可以使 Pod 更好的被调度。通过设置 CPU 限制大于 CPU 请求，您可以实现达到以下两个目的：

* 在 Pod 上突发大量活动期间，它可以利用节点上碰巧可用的 CPU 资源。
* Pod 在突发负载期间可使用的 CPU 资源数量仍被限制为合理的数值。

<!-- ## Clean up -->
## 清理

<!--
Delete your namespace:

```shell
kubectl delete namespace cpu-example
```
-->
删除命名空间：

```shell
kubectl delete namespace cpu-example
```

{{% /capture %}}

{{% capture whatsnext %}}

<!-- ### For app developers -->
### 对于应用程序开发人员

<!--
* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->

* [将内存资源分配给容器和 Pod]](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [配置 Pod 的服务质量](/docs/tasks/configure-pod-container/quality-service-pod/)

<!-- ### For cluster administrators -->
### 对于集群管理者

<!--
* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

* [配置命名空间的默认内存请求和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

* [配置命名空间的默认 CPU 请求和限制](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [为命名空间配置最小和最大内存限制](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [为命名空间配置最小和最大 CPU 约束](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为命名空间配置内存和 CPU 配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为命名空间配置 Pod 配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [配置 API 对象的配额](/docs/tasks/administer-cluster/quota-api-object/)

{{% /capture %}}
