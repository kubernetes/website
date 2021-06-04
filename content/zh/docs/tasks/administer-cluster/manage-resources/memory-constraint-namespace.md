---
title: 配置命名空间的最小和最大内存约束
content_type: task
weight: 30
---

<!--
title: Configure Minimum and Maximum Memory Constraints for a Namespace
content_type: task
weight: 30
-->

<!-- overview -->

<!--
This page shows how to set minimum and maximum values for memory used by Containers
running in a namespace. You specify minimum and maximum memory values in a
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
object. If a Pod does not meet the constraints imposed by the LimitRange,
it cannot be created in the namespace.
-->
本页介绍如何设置在命名空间中运行的容器使用的内存的最小值和最大值。 你可以在
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
对象中指定最小和最大内存值。如果 Pod 不满足 LimitRange 施加的约束，则无法在命名空间中创建它。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Each node in your cluster must have at least 1 GiB of memory.
-->
集群中每个节点必须至少要有 1 GiB 的内存。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建命名空间

创建一个命名空间，以便在此练习中创建的资源与群集的其余资源隔离。

```shell
kubectl create namespace constraints-mem-example
```

<!--
## Create a LimitRange and a Pod

Here's the configuration file for a LimitRange:
-->
## 创建 LimitRange 和 Pod

下面是 LimitRange 的配置文件：

{{< codenew file="admin/resource/memory-constraints.yaml" >}}

<!--
Create the LimitRange:
-->
创建 LimitRange:

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
输出显示预期的最小和最大内存约束。 但请注意，即使你没有在 LimitRange 的配置文件中指定默认值，也会自动创建它们。

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
Now whenever a Container is created in the constraints-mem-example namespace, Kubernetes
performs these steps:

* If the Container does not specify its own memory request and limit, assign the default
memory request and limit to the Container.

* Verify that the Container has a memory request that is greater than or equal to 500 MiB.

* Verify that the Container has a memory limit that is less than or equal to 1 GiB.

Here's the configuration file for a Pod that has one Container. The Container manifest
specifies a memory request of 600 MiB and a memory limit of 800 MiB. These satisfy the
minimum and maximum memory constraints imposed by the LimitRange.
-->
现在，只要在 constraints-mem-example 命名空间中创建容器，Kubernetes 就会执行下面的步骤：

* 如果 Container 未指定自己的内存请求和限制，将为它指定默认的内存请求和限制。

* 验证 Container 的内存请求是否大于或等于500 MiB。

* 验证 Container 的内存限制是否小于或等于1 GiB。

这里给出了包含一个 Container 的 Pod 配置文件。Container 声明了 600 MiB 的内存请求和
800 MiB 的内存限制， 这些满足了 LimitRange 施加的最小和最大内存约束。

{{< codenew file="admin/resource/memory-constraints-pod.yaml" >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

<!--
Verify that the Pod's Container is running:
-->
确认下 Pod 中的容器在运行：

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
The output shows that the Container has a memory request of 600 MiB and a memory limit
of 800 MiB. These satisfy the constraints imposed by the LimitRange.
-->
输出结果显示容器的内存请求为600 MiB，内存限制为800 MiB。这些满足了 LimitRange 设定的限制范围。

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

Here's the configuration file for a Pod that has one Container. The Container specifies a
memory request of 800 MiB and a memory limit of 1.5 GiB.
-->
## 尝试创建一个超过最大内存限制的 Pod

这里给出了包含一个容器的 Pod 的配置文件。容器声明了800 MiB 的内存请求和1.5 GiB 的内存限制。

{{< codenew file="admin/resource/memory-constraints-pod-2.yaml" >}}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because the Container specifies a memory limit that is
too large:
-->
输出结果显示 Pod 没有创建成功，因为容器声明的内存限制太大了：

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

<!--
## Attempt to create a Pod that does not meet the minimum memory request

Here's the configuration file for a Pod that has one Container. The Container specifies a
memory request of 100 MiB and a memory limit of 800 MiB.
-->
## 尝试创建一个不满足最小内存请求的 Pod

这里给出了包含一个容器的 Pod 的配置文件。容器声明了100 MiB 的内存请求和800 MiB 的内存限制。

{{< codenew file="admin/resource/memory-constraints-pod-3.yaml" >}}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because the Container specifies a memory
request that is too small:
-->
输出结果显示 Pod 没有创建成功，因为容器声明的内存请求太小了：

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

<!--
## Create a Pod that does not specify any memory request or limit

Here's the configuration file for a Pod that has one Container. The Container does not
specify a memory request, and it does not specify a memory limit.
-->
## 创建一个没有声明内存请求和限制的 Pod

这里给出了包含一个容器的 Pod 的配置文件。容器没有声明内存请求，也没有声明内存限制。

{{< codenew file="admin/resource/memory-constraints-pod-4.yaml" >}}

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

```
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

<!--
The output shows that the Pod's Container has a memory request of 1 GiB and a memory limit of 1 GiB.
How did the Container get those values?
-->
输出结果显示 Pod 的内存请求为1 GiB，内存限制为1 GiB。容器怎样获得哪些数值呢？

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

<!--
Because your Container did not specify its own memory request and limit, it was given the
[default memory request and limit](/docs/tasks/administer-cluster/memory-default-namespace/)
from the LimitRange.
-->
因为你的容器没有声明自己的内存请求和限制，它从 LimitRange 那里获得了
[默认的内存请求和限制](/zh/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。

<!--
At this point, your Container might be running or it might not be running. Recall that a prerequisite
for this task is that your Nodes have at least 1 GiB of memory. If each of your Nodes has only
1 GiB of memory, then there is not enough allocatable memory on any Node to accommodate a memory
request of 1 GiB. If you happen to be using Nodes with 2 GiB of memory, then you probably have
enough space to accommodate the 1 GiB request.

Delete your Pod:
-->
此时，你的容器可能运行起来也可能没有运行起来。
回想一下我们本次任务的先决条件是你的每个节点都至少有1 GiB 的内存。
如果你的每个节点都只有1 GiB 的内存，那将没有一个节点拥有足够的可分配内存来满足1 GiB 的内存请求。

删除你的 Pod：

```
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

* Each Node in a cluster has 2 GB of memory. You do not want to accept any Pod that requests
  more than 2 GB of memory, because no Node in the cluster can support the request.

* A cluster is shared by your production and development departments.
  You want to allow production workloads to consume up to 8 GB of memory, but
  you want development workloads to be limited to 512 MB. You create separate namespaces
  for production and development, and you apply memory constraints to each namespace.
-->
作为集群管理员，你可能想规定 Pod 可以使用的内存总量限制。例如：

* 集群的每个节点有 2 GB 内存。你不想接受任何请求超过 2 GB 的 Pod，因为集群中没有节点可以满足。
* 集群由生产部门和开发部门共享。你希望允许产品部门的负载最多耗用 8 GB 内存，
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

* [为命名空间配置默认内存请求和限制](/zh/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置内存限制的最小值和最大值](/zh/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为命名空间配置 CPU 限制的最小值和最大值](/zh/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为命名空间配置内存和 CPU 配额](/zh/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [为命名空间配置 Pod 配额](/zh/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [为 API 对象配置配额](/zh/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->

### 应用开发者参考

* [为容器和 Pod 分配内存资源](/zh/docs/tasks/configure-pod-container/assign-memory-resource/)
* [为容器和 Pod 分配 CPU 资源](/zh/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [为 Pod 配置服务质量](/zh/docs/tasks/configure-pod-container/quality-service-pod/)

