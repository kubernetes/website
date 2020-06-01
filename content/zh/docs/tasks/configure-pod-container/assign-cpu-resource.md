<!--
---
title: Assign CPU Resources to Containers and Pods
content_type: task
weight: 20
---
-->

---
title: 为容器和 Pods 分配 CPU 资源
content_type: task
weight: 20
---

<!-- overview -->

<!--
This page shows how to assign a CPU *request* and a CPU *limit* to
a container. Containers cannot use more CPU than the configured limit.
Provided the system has CPU time free, a container is guaranteed to be
allocated as much CPU as it requests.
-->
此页面显示如何将 CPU *request* 和 CPU *limit* 分配给一个容器。容器使用的 CPU 不能超过配额限制。
如果系统有空闲的 CPU 时间，则可以保证根据请求给容器分配尽可能多的 CPU 资源。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Each node in your cluster must have at least 1 CPU.

A few of the steps on this page require you to run the
[metrics-server](https://github.com/kubernetes-incubator/metrics-server)
service in your cluster. If you have the metrics-server
running, you can skip those steps.

If you are running {{< glossary_tooltip term_id="minikube" >}}, run the
following command to enable metrics-server:
-->

集群中的每个节点必须至少具有 1 个 CPU。

此页面上的一些步骤要求您在集群中运行[metrics-server](https://github.com/kubernetes-incubator/metrics-server)
服务。如果您的集群中已经有正在运行的 metrics-server 服务，那么您可以跳过这些步骤。

如果您正在运行{{< glossary_tooltip term_id="minikube" >}}，请运行以下命令启用 metrics-server：


```shell
minikube addons enable metrics-server
```
<!-- 
To see whether metrics-server (or another provider of the resource metrics
API, `metrics.k8s.io`) is running, type the following command:
-->

查看是 metrics-server（或者其他资源度量 API 服务提供者，`metrics.k8s.io` ）是否正在运行，请键入以下命令：

```shell
kubectl get apiservices
```
<!-- 
If the resource metrics  API  is available, the output will include a
reference to `metrics.k8s.io`.
-->

如果资源指标 API 可用，则会输出将包含一个参考信息 `metrics.k8s.io`。


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
## 创建一个命名空间
创建一个命名空间 {{< glossary_tooltip term_id="namespace" >}}，以便在本练习中创建的资源与集群的其余部分资源隔离。

```shell
kubectl create namespace cpu-example
```

<!-- 
## Specify a CPU request and a CPU limit

To specify a CPU request for a container, include the `resources:requests` field
in the Container resource manifest. To specify a CPU limit, include `resources:limits`.

In this exercise, you create a Pod that has one container. The container has a request
of 0.5 CPU and a limit of 1 CPU. Here is the configuration file for the Pod:

{{< codenew file="pods/resource/cpu-request-limit.yaml" >}}

The `args` section of the configuration file provides arguments for the container when it starts.
The `-cpus "2"` argument tells the Container to attempt to use 2 CPUs.

Create the Pod:
-->

## 指定一个 CPU 请求和 CPU 限制

要为容器指定 CPU 请求，请包含 `resources：requests` 字段
在容器资源清单中。要指定 CPU 限制，请包含 `resources：limits`。

在本练习中，您将创建一个具有一个容器的 Pod。容器将会请求 0.5 个 CPU，而且最多限制使用 1 个 CPU。
这是 Pod 的配置文件：

{{< codenew file="pods/resource/cpu-request-limit.yaml" >}}

配置文件的 `args` 部分提供了容器启动时的参数。
-cpus "2"参数告诉容器尝试使用 2 个 CPU。

创建 Pod 命令如下：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

<!-- 
Verify that the  Pod  is running:
-->
验证上述创建的 Pod 处于 Running 状态

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

<!-- 
View detailed information about the Pod:
-->
查看显示关于 Pod 的详细信息

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

<!-- 
The output shows that the one container in the Pod has a CPU request of 500 milliCPU
and a CPU limit of 1 CPU.
-->

输出显示 Pod 中的一个容器的 CPU 请求为 500 milli CPU，并且 CPU 限制为 1 个 CPU。

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

<!-- 
Use `kubectl top` to fetch the metrics for the pod:
-->
使用 `kubectl top` 命令来获取该 Pod 的指标数据：

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

<!-- 
This example output shows that the Pod is using 974 milliCPU, which is
just a bit less than the limit of 1 CPU specified in the Pod configuration.
-->
此示例的输出，显示 Pod 使用的是974 milliCPU，即仅略低于 Pod 配置中指定的 1 个 CPU 的限制。
```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```
<!-- 
Recall that by setting `-cpu "2"`, you configured the Container to attempt to use 2 CPUs, but the Container is only being allowed to use about 1 CPU. The container's CPU use is being throttled, because the container is attempting to use more CPU resources than its limit.
-->
回想一下，通过设置 `- CPU "2"`，您将容器配置为尝试使用 2 个 CPU，但是只允许容器使用大约 1 个 CPU。容器的 CPU 使用量受到限制，因为该容器正尝试使用超出其限制的 CPU 资源。


<!-- 
{{< note >}}
Another possible explanation for the CPU use being below 1.0 is that the Node might not have
enough CPU resources available. Recall that the prerequisites for this exercise require each of
your Nodes to have at least 1 CPU. If your Container runs on a Node that has only 1 CPU, the Container
cannot use more than 1 CPU regardless of the CPU limit specified for the Container.
{{< /note >}}
-->

{{< note >}}
CPU 使用率低于1.0的另一种可能的解释是，节点可能没有足够的 CPU 资源可用。回想一下，此练习的先决条件需要
您的节点至少具有 1 个 CPU。如果您的容器在只有 1 个 CPU 的节点上运行，则容器无论为容器指定的 CPU 限制如何，都不能使用超过 1 个 CPU。
{{< /note >}}

<!-- 
## CPU units

The CPU resource is measured in *CPU* units. One CPU, in Kubernetes, is equivalent to:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 Hyperthread on a bare-metal Intel processor with Hyperthreading
-->

## CPU 单元
 CPU 资源以 *CPU* 单位度量。Kubernetes中的一个 CPU 等同于：

* 1 个 AWS vCPU 
* 1 个 GCP核心
* 1 个 Azure vCore
* 1 个具有超线程功能的裸机英特尔处理器上的超线程

<!-- 
Fractional values are allowed. A Container that requests 0.5 CPU is guaranteed half as much
CPU as a Container that requests 1 CPU. You can use the suffix m to mean milli. For example
100m CPU, 100 milliCPU, and 0.1 CPU are all the same. Precision finer than 1m is not allowed.

CPU is always requested as an absolute quantity, never as a relative quantity; 0.1 is the same
amount of CPU on a single-core, dual-core, or 48-core machine.

Delete your Pod:
-->

允许使用小数值。要求 0.5 CPU 的容器保证一半 CPU 作为请求 1 个 CPU 的容器。
您可以使用后缀 m 表示毫。例如 100m CPU，100 milliCPU 和 0.1 CPU 都相同。
精度不能超过 1m。

始终要求 CPU 是绝对数量，而不是相对数量。0.1 在单核，双核或 48 核计算机上的 CPU 数量值是一样的。


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

{{< codenew file="pods/resource/cpu-request-limit-2.yaml" >}}

Create the Pod:
-->


## 对您的节点而言，设置一个 CPU 过大的请求

CPU 请求和限制与容器相关联，但是我们可以考虑一下 CPU 对应 Pod 的请求和限制这样的场景：Pod 对 CPU 使用量的请求等于 Pod 中所有容器的请求数量。
同样，CPU 对 Pod 请求资源的限制等于 Pod 中所有容器的请求的 CPU 资源限制数。

Pod 调度基于请求。仅在以下情况下，Pod 将会在节点上运行：节点具有足够的 CPU 资源可用于满足 Pod CPU 请求。

在本练习中，您将创建一个 Pod，该 Pod 的 CPU 请求对于集群中任何节点的容量而言都会过大。

这是 Pod 的配置文件，Pod 中有一个容器。容器请求 100 个 CPU，这可能会超出集群中任何节点的容量。

{{< codenew file="pods/resource/cpu-request-limit-2.yaml" >}}

使用如下命令创建该 Pod 	


```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```
<!-- 
View the  Pod  status:
-->
查看该 Pod 的状态

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

<!-- 
The output shows that the Pod status is Pending. That is, the Pod has not been
scheduled to run on any Node, and it will remain in the Pending state indefinitely:
-->

输出显示 Pod 状态为Pending。也就是说，尚未将 Pod 调度到任何节点上运行，
并且 Pod 将无限期地处于Pending状态：

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```
```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```


<!-- 
View detailed information about the Pod, including events:
-->

查看有关 Pod 的详细信息，包括事件如下：
```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

<!-- 
The output shows that the Container cannot be scheduled because of insufficient
CPU resources on the Nodes:
-->

输出显示由于节点上的 CPU 资源不足，无法调度容器

```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

<!-- 
Delete your Pod:
-->

删除您的 Pod 

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
## 如果没有指定 CPU 限制

如果您没有为容器指定 CPU 限制，则适用以下情况之一：

* 容器在可以使用的 CPU 资源上没有上限。容器可以使用运行该节点的所有可用 CPU 资源。

* 容器在具有默认 CPU 限制的命名空间中运行，并且系统会自动为容器分配默认限制。集群管理员可以使用
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
指定 CPU 限制的默认值。


<!-- 
## Motivation for CPU requests and limits

By configuring the CPU requests and limits of the Containers that run in your
cluster, you can make efficient use of the CPU resources available on your cluster
Nodes. By keeping a Pod CPU request low, you give the Pod a good chance of being
scheduled. By having a CPU limit that is greater than the CPU request, you accomplish two things:

* The Pod can have bursts of activity where it makes use of CPU resources that happen to be available.
* The amount of CPU resources a Pod can use during a burst is limited to some reasonable amount.
-->

## CPU 请求和限制的初衷

通过配置 CPU 请求和在您的容器中运行的容器的限制
集群，您可以有效利用集群上可用的 CPU 资源
节点。通过将 Pod CPU 请求保持在较低水平，可以使 Pod 成为
预定的。通过使 CPU 限制大于 CPU 请求，您可以完成两件事：

*  Pod 可能会有大量活动，它利用恰好可用的 CPU 资源。
*  Pod 在突发期间可以使用的 CPU 资源数量被限制为合理的数量。	



<!-- 
## Clean up

Delete your namespace:
-->

## 清理

删除名称空间：

```shell
kubectl delete namespace cpu-example
```



## {{% heading "whatsnext" %}}


<!-- 
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

-->
### 针对应用开发者
* [将内存资源分配给容器和 Pod](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [配置 Pod 服务质量](/docs/tasks/configure-pod-container/quality-service-pod/)

<!-- 
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

-->
### 针对集群管理员

* [配置名称空间的默认内存请求和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

* [为命名空间配置默认的 CPU 请求和限制](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [为命名空间配置最小和最大内存限制](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [为命名空间配置最小和最大 CPU 约束](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为命名空间配置内存和 CPU 配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为命名空间配置 Pod 配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [配置 API 对象的配额](/docs/tasks/administer-cluster/quota-api-object/)



