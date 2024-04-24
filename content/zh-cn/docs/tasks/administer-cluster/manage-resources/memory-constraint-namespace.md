---
title: 配置命名空间的最小和最大内存约束
content_type: task
weight: 30
description: >-
  为命名空间定义一个有效的内存资源限制范围，在该命名空间中每个新创建
  Pod 的内存资源是在设置的范围内。
---

<!--
title: Configure Minimum and Maximum Memory Constraints for a Namespace
content_type: task
weight: 30
-->

<!-- overview -->

<!--
This page shows how to set minimum and maximum values for memory used by containers
running in a {{< glossary_tooltip text="namespace" term_id="namespace" >}}. 
You specify minimum and maximum memory values in a
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
object. If a Pod does not meet the constraints imposed by the LimitRange,
it cannot be created in the namespace.
-->
本页介绍如何设置在{{< glossary_tooltip text="名字空间" term_id="namespace" >}}
中运行的容器所使用的内存的最小值和最大值。你可以在
[LimitRange](/zh-cn/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
对象中指定最小和最大内存值。如果 Pod 不满足 LimitRange 施加的约束，
则无法在名字空间中创建它。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} 

<!--
You must have access to create namespaces in your cluster.
Each node in your cluster must have at least 1 GiB of memory available for Pods.
-->
在你的集群里你必须要有创建命名空间的权限。

集群中的每个节点都必须至少有 1 GiB 的内存可供 Pod 使用。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建命名空间

创建一个命名空间，以便在此练习中创建的资源与集群的其余资源隔离。

```shell
kubectl create namespace constraints-mem-example
```

<!--
## Create a LimitRange and a Pod

Here's an example manifest for a LimitRange:
-->
## 创建 LimitRange 和 Pod

下面是 LimitRange 的示例清单：

{{% code_sample file="admin/resource/memory-constraints.yaml" %}}

<!--
Create the LimitRange:
-->
创建 LimitRange：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints.yaml --namespace=constraints-mem-example
```

<!--
View detailed information about the LimitRange:
-->
查看 LimitRange 的详情：

```shell
kubectl get limitrange mem-min-max-demo-lr --namespace=constraints-mem-example --output=yaml
```

<!--
The output shows the minimum and maximum memory constraints as expected. But
notice that even though you didn't specify default values in the configuration
file for the LimitRange, they were created automatically.
-->
输出显示预期的最小和最大内存约束。
但请注意，即使你没有在 LimitRange 的配置文件中指定默认值，默认值也会自动生成。

```
  limits:
  - default:
      memory: 1Gi
    defaultRequest:
      memory: 1Gi
    max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```

<!--
Now whenever you define a Pod within the constraints-mem-example namespace, Kubernetes
performs these steps:

* If any container in that Pod does not specify its own memory request and limit, 
  the control plane assigns the default memory request and limit to that container.

* Verify that every container in that Pod requests at least 500 MiB of memory.

* Verify that every container in that Pod requests no more than 1024 MiB (1 GiB)
  of memory.

Here's a manifest for a Pod that has one container. Within the Pod spec, the sole
container specifies a memory request of 600 MiB and a memory limit of 800 MiB. These satisfy the
minimum and maximum memory constraints imposed by the LimitRange.
-->
现在，每当在 constraints-mem-example 命名空间中创建 Pod 时，Kubernetes 就会执行下面的步骤：

* 如果 Pod 中的任何容器未声明自己的内存请求和限制，控制面将为该容器设置默认的内存请求和限制。
* 确保该 Pod 中的每个容器的内存请求至少 500 MiB。
* 确保该 Pod 中每个容器内存请求不大于 1 GiB。

以下为包含一个容器的 Pod 清单。该容器声明了 600 MiB 的内存请求和 800 MiB 的内存限制，
这些满足了 LimitRange 施加的最小和最大内存约束。

{{% code_sample file="admin/resource/memory-constraints-pod.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

<!--
Verify that the Pod is running and that its container is healthy:
-->
确认 Pod 正在运行，并且其容器处于健康状态：

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 详情：

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

<!--
The output shows that the container within that Pod has a memory request of 600 MiB and
a memory limit of 800 MiB. These satisfy the constraints imposed by the LimitRange for
this namespace:
-->
输出结果显示该 Pod 的容器的内存请求为 600 MiB，内存限制为 800 MiB。
这些满足这个命名空间中 LimitRange 设定的限制范围。

```yaml
resources:
  limits:
     memory: 800Mi
  requests:
    memory: 600Mi
```

<!--
Delete your Pod:
-->
删除你创建的 Pod：

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

<!--
## Attempt to create a Pod that exceeds the maximum memory constraint

Here's a manifest for a Pod that has one container. The container specifies a
memory request of 800 MiB and a memory limit of 1.5 GiB.
-->
## 尝试创建一个超过最大内存限制的 Pod

以下为包含一个容器的 Pod 的清单。这个容器声明了 800 MiB 的内存请求和 1.5 GiB 的内存限制。

{{% code_sample file="admin/resource/memory-constraints-pod-2.yaml" %}}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because it defines a container that
requests more memory than is allowed:
-->
输出结果显示 Pod 没有创建成功，因为它定义了一个容器的内存请求超过了允许的值。

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

<!--
## Attempt to create a Pod that does not meet the minimum memory request

Here's a manifest for a Pod that has one container. That container specifies a
memory request of 100 MiB and a memory limit of 800 MiB.
-->
## 尝试创建一个不满足最小内存请求的 Pod

以下为只有一个容器的 Pod 的清单。这个容器声明了 100 MiB 的内存请求和 800 MiB 的内存限制。

{{% code_sample file="admin/resource/memory-constraints-pod-3.yaml" %}}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because it defines a container
that requests less memory than the enforced minimum:
-->
输出结果显示 Pod 没有创建成功，因为它定义了一个容器的内存请求小于强制要求的最小值：

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

<!--
## Create a Pod that does not specify any memory request or limit

Here's a manifest for a Pod that has one container. The container does not
specify a memory request, and it does not specify a memory limit.
-->
## 创建一个没有声明内存请求和限制的 Pod

以下为只有一个容器的 Pod 清单。该容器没有声明内存请求，也没有声明内存限制。

{{% code_sample file="admin/resource/memory-constraints-pod-4.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 详情：

```shell
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

<!--
The output shows that the Pod's only container has a memory request of 1 GiB and a memory limit of 1 GiB.
How did that container get those values?
-->
输出结果显示 Pod 的唯一容器内存请求为 1 GiB，内存限制为 1 GiB。容器怎样获得那些数值呢？

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

<!--
Because your Pod did not define any memory request and limit for that container, the cluster
applied a
[default memory request and limit](/docs/tasks/administer-cluster/memory-default-namespace/)
from the LimitRange.
-->
因为你的 Pod 没有为容器声明任何内存请求和限制，集群会从 LimitRange
获取[默认的内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。
应用于容器。

<!--
This means that the definition of that Pod shows those values. You can check it using
`kubectl describe`:

```shell
# Look for the "Requests:" section of the output
kubectl describe pod constraints-mem-demo-4 --namespace=constraints-mem-example
```
-->
这意味着 Pod 的定义会显示这些值。你可以通过 `kubectl describe` 查看：

```shell
# 查看输出结果中的 "Requests:" 的值
kubectl describe pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

<!--
At this point, your Pod might be running or it might not be running. Recall that a prerequisite
for this task is that your Nodes have at least 1 GiB of memory. If each of your Nodes has only
1 GiB of memory, then there is not enough allocatable memory on any Node to accommodate a memory
request of 1 GiB. If you happen to be using Nodes with 2 GiB of memory, then you probably have
enough space to accommodate the 1 GiB request.

Delete your Pod:
-->
此时，你的 Pod 可能已经运行起来也可能没有运行起来。
回想一下我们本次任务的先决条件是你的每个节点都至少有 1 GiB 的内存。
如果你的每个节点都只有 1 GiB 的内存，那将没有一个节点拥有足够的可分配内存来满足 1 GiB 的内存请求。

删除你的 Pod：

```shell
kubectl delete pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

<!--
## Enforcement of minimum and maximum memory constraints

The maximum and minimum memory constraints imposed on a namespace by a LimitRange are enforced only
when a Pod is created or updated. If you change the LimitRange, it does not affect
Pods that were created previously.
-->
## 强制执行内存最小和最大限制

LimitRange 为命名空间设定的最小和最大内存限制只有在 Pod 创建和更新时才会强制执行。
如果你更新 LimitRange，它不会影响此前创建的 Pod。

<!--
## Motivation for minimum and maximum memory constraints
-->
## 设置内存最小和最大限制的动因

<!--
As a cluster administrator, you might want to impose restrictions on the amount of memory that Pods can use.
For example:

* Each Node in a cluster has 2 GiB of memory. You do not want to accept any Pod that requests
more than 2 GiB of memory, because no Node in the cluster can support the request.

* A cluster is shared by your production and development departments.
You want to allow production workloads to consume up to 8 GiB of memory, but
you want development workloads to be limited to 512 MiB. You create separate namespaces
  for production and development, and you apply memory constraints to each namespace.
-->
作为集群管理员，你可能想规定 Pod 可以使用的内存总量限制。例如：

* 集群的每个节点有 2 GiB 内存。你不想接受任何请求超过 2 GiB 的 Pod，因为集群中没有节点可以满足。
* 集群由生产部门和开发部门共享。你希望允许产品部门的负载最多耗用 8 GiB 内存，
  但是开发部门的负载最多可使用 512 MiB。
  这时，你可以为产品部门和开发部门分别创建名字空间，并为各个名字空间设置内存约束。

<!--
## Clean up

Delete your namespace:
-->
## 清理

删除你的命名空间：

```shell
kubectl delete namespace constraints-mem-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)
* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)
* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)
* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)
* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

### 集群管理员参考

* [为命名空间配置默认内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置内存限制的最小值和最大值](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为命名空间配置 CPU 限制的最小值和最大值](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为命名空间配置内存和 CPU 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [为命名空间配置 Pod 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [为 API 对象配置配额](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->

### 应用开发者参考

* [为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [为容器和 Pod 分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [为 Pod 配置服务质量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
