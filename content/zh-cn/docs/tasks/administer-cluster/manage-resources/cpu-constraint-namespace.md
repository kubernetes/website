---
title: 为命名空间配置 CPU 最小和最大约束
content_type: task
weight: 40
description: >-
  为命名空间定义一个有效的 CPU 资源限制范围，使得在该命名空间中所有新建
  Pod 的 CPU 资源是在你所设置的范围内。
---

<!--
title: Configure Minimum and Maximum CPU Constraints for a Namespace
content_type: task
weight: 40
description: >-
  Define a range of valid CPU resource limits for a namespace, so that every new Pod
  in that namespace falls within the range you configure.
-->

<!-- overview -->

<!--
This page shows how to set minimum and maximum values for the CPU resources used by containers
and Pods in a {{< glossary_tooltip text="namespace" term_id="namespace" >}}. You specify minimum
and maximum CPU values in a
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
object. If a Pod does not meet the constraints imposed by the LimitRange, it cannot be created
in the namespace.
-->
本页介绍如何为{{< glossary_tooltip text="命名空间" term_id="namespace" >}}中的容器和 Pod
设置其所使用的 CPU 资源的最小和最大值。你可以通过 [LimitRange](/zh-cn/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
对象声明 CPU 的最小和最大值.
如果 Pod 不能满足 LimitRange 的限制，就无法在该命名空间中被创建。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} 

<!--
You must have access to create namespaces in your cluster.

Each node in your cluster must have at least 1.0 CPU available for Pods.
See [meaning of CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
to learn what Kubernetes means by “1 CPU”.
-->
在你的集群里你必须要有创建命名空间的权限。

集群中的每个节点都必须至少有 1.0 个 CPU 可供 Pod 使用。

请阅读 [CPU 的含义](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
理解 "1 CPU" 在 Kubernetes 中的含义。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建命名空间

创建一个命名空间，以便本练习中创建的资源和集群的其余资源相隔离。

```shell
kubectl create namespace constraints-cpu-example
```

<!--
## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}:
-->
## 创建 LimitRange 和 Pod

以下为 {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} 的示例清单：

{{% code_sample file="admin/resource/cpu-constraints.yaml" %}}

<!--
Create the LimitRange:
-->
创建 LimitRange：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints.yaml --namespace=constraints-cpu-example
```

<!--
View detailed information about the LimitRange:
-->
查看 LimitRange 详情：

```shell
kubectl get limitrange cpu-min-max-demo-lr --output=yaml --namespace=constraints-cpu-example
```

<!--
The output shows the minimum and maximum CPU constraints as expected. But
notice that even though you didn't specify default values in the configuration
file for the LimitRange, they were created automatically.
-->
输出结果显示 CPU 的最小和最大限制符合预期。但需要注意的是，尽管你在 LimitRange 
的配置文件中你没有声明默认值，默认值也会被自动创建。

```yaml
limits:
- default:
    cpu: 800m
  defaultRequest:
    cpu: 800m
  max:
    cpu: 800m
  min:
    cpu: 200m
  type: Container
```

<!--
Now whenever you create a Pod in the constraints-cpu-example namespace (or some other client
of the Kubernetes API creates an equivalent Pod), Kubernetes performs these steps:

* If any container in that Pod does not specify its own CPU request and limit, the control plane
  assigns the default CPU request and limit to that container.

* Verify that every container in that Pod specifies a CPU request that is greater than or equal to 200 millicpu.

* Verify that every container in that Pod specifies a CPU limit that is less than or equal to 800 millicpu.
-->

现在，每当你在 constraints-cpu-example 命名空间中创建 Pod 时，或者某些其他的
Kubernetes API 客户端创建了等价的 Pod 时，Kubernetes 就会执行下面的步骤：

* 如果 Pod 中的任何容器未声明自己的 CPU 请求和限制，控制面将为该容器设置默认的 CPU 请求和限制。

* 确保该 Pod 中的每个容器的 CPU 请求至少 200 millicpu。

* 确保该 Pod 中每个容器 CPU 请求不大于 800 millicpu。

<!--
When creating a `LimitRange` object, you can specify limits on huge-pages
or GPUs as well. However, when both `default` and `defaultRequest` are specified
on these resources, the two values must be the same.
-->
{{< note >}}
当创建 `LimitRange` 对象时，你也可以声明大页面和 GPU 的限制。
当这些资源同时声明了 `default` 和 `defaultRequest` 参数时，两个参数值必须相同。
{{< /note >}}

<!--
Here's a manifest for a Pod that has one container. The container manifest
specifies a CPU request of 500 millicpu and a CPU limit of 800 millicpu. These satisfy the
minimum and maximum CPU constraints imposed by the LimitRange for this namespace.
-->
以下为某个仅包含一个容器的 Pod 的清单。
该容器声明了 CPU 请求 500 millicpu 和 CPU 限制 800 millicpu。
这些参数满足了 LimitRange 对象为此名字空间规定的 CPU 最小和最大限制。

{{% code_sample file="admin/resource/cpu-constraints-pod.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod.yaml --namespace=constraints-cpu-example
```

<!--
Verify that the Pod is running and that its container is healthy:
-->
确认 Pod 正在运行，并且其容器处于健康状态：

```shell
kubectl get pod constraints-cpu-demo --namespace=constraints-cpu-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的详情：

```shell
kubectl get pod constraints-cpu-demo --output=yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod's only container has a CPU request of 500 millicpu and CPU limit
of 800 millicpu. These satisfy the constraints imposed by the LimitRange.
-->
输出结果显示该 Pod 的容器的 CPU 请求为 500 millicpu，CPU 限制为 800 millicpu。
这些参数满足 LimitRange 规定的限制范围。

```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 500m
```

<!--
## Delete the Pod
-->
## 删除 Pod

```shell
kubectl delete pod constraints-cpu-demo --namespace=constraints-cpu-example
```

<!--
## Attempt to create a Pod that exceeds the maximum CPU constraint

Here's a manifest for a Pod that has one container. The container specifies a
CPU request of 500 millicpu and a cpu limit of 1.5 cpu.
-->
## 尝试创建一个超过最大 CPU 限制的 Pod

这里给出了包含一个容器的 Pod 清单。容器声明了 500 millicpu 的 CPU 
请求和 1.5 CPU 的 CPU 限制。

{{% code_sample file="admin/resource/cpu-constraints-pod-2.yaml" %}}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-2.yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod does not get created, because it defines an unacceptable container.
That container is not acceptable because it specifies a CPU limit that is too large:
-->
输出结果表明 Pod 没有创建成功，因为其中定义了一个无法被接受的容器。
该容器之所以无法被接受是因为其中设定了过高的 CPU 限制值：

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-2.yaml":
pods "constraints-cpu-demo-2" is forbidden: maximum cpu usage per Container is 800m, but limit is 1500m.
```

<!--
## Attempt to create a Pod that does not meet the minimum CPU request

Here's a manifest for a Pod that has one container. The container specifies a
CPU request of 100 millicpu and a CPU limit of 800 millicpu.
-->
## 尝试创建一个不满足最小 CPU 请求的 Pod

以下为某个只有一个容器的 Pod 的清单。该容器声明了 CPU 请求 100 millicpu 和 CPU 限制 800 millicpu。

{{% code_sample file="admin/resource/cpu-constraints-pod-3.yaml" %}}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-3.yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod does not get created, because it defines an unacceptable container.
That container is not acceptable because it specifies a CPU request that is lower than the
enforced minimum:
-->
输出结果显示 Pod 没有创建成功，因为其中定义了一个无法被接受的容器。
该容器无法被接受的原因是其中所设置的 CPU 请求小于最小值的限制：

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-3.yaml":
pods "constraints-cpu-demo-3" is forbidden: minimum cpu usage per Container is 200m, but request is 100m.
```

<!--
## Create a Pod that does not specify any CPU request or limit

Here's a manifest for a Pod that has one container. The container does not
specify a CPU request, nor does it specify a CPU limit.
-->
## 创建一个没有声明 CPU 请求和 CPU 限制的 Pod

以下为一个只有一个容器的 Pod 的清单。该容器没有声明 CPU 请求，也没有声明 CPU 限制。

{{% code_sample file="admin/resource/cpu-constraints-pod-4.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-4.yaml --namespace=constraints-cpu-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的详情：

```
kubectl get pod constraints-cpu-demo-4 --namespace=constraints-cpu-example --output=yaml
```

<!--
The output shows that the Pod's single container has a CPU request of 800 millicpu and a
CPU limit of 800 millicpu.
How did that container get those values?
-->
输出结果显示 Pod 的唯一容器的 CPU 请求为 800 millicpu，CPU 限制为 800 millicpu。

容器是怎样获得这些数值的呢？


```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 800m
```

<!--
Because that container did not specify its own CPU request and limit, the control plane
applied the
[default CPU request and limit](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
from the LimitRange for this namespace.
-->
因为这一容器没有声明自己的 CPU 请求和限制，
控制面会根据命名空间中配置 LimitRange
设置[默认的 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)。

<!--
At this point, your Pod may or may not be running. Recall that a prerequisite for
this task is that your Nodes must have at least 1 CPU available for use. If each of your Nodes has only 1 CPU,
then there might not be enough allocatable CPU on any Node to accommodate a request of 800 millicpu. 
If you happen to be using Nodes with 2 CPU, then you probably have enough CPU to accommodate the 800 millicpu request.

Delete your Pod:
-->
此时，你的 Pod 可能已经运行起来也可能没有运行起来。
回想一下我们本次任务的先决条件是你的每个节点都至少有 1 CPU。
如果你的每个节点都只有 1 CPU，那将没有一个节点拥有足够的可分配 CPU 来满足 800 millicpu 的请求。
如果你在用的节点恰好有 2 CPU，那么有可能有足够的 CPU 来满足 800 millicpu 的请求。

删除你的 Pod：

```
kubectl delete pod constraints-cpu-demo-4 --namespace=constraints-cpu-example
```

<!--
## Enforcement of minimum and maximum CPU constraints

The maximum and minimum CPU constraints imposed on a namespace by a LimitRange are enforced only
when a Pod is created or updated. If you change the LimitRange, it does not affect
Pods that were created previously.
-->
## CPU 最小和最大限制的强制执行

只有当 Pod 创建或者更新时，LimitRange 为命名空间规定的 CPU 最小和最大限制才会被强制执行。
如果你对 LimitRange 进行修改，那不会影响此前创建的 Pod。

<!--
## Motivation for minimum and maximum CPU constraints

As a cluster administrator, you might want to impose restrictions on the CPU resources that Pods can use.
For example:
-->
## 最小和最大 CPU 限制范围的动机

作为集群管理员，你可能想设定 Pod 可以使用的 CPU 资源限制。例如：

<!--
* Each Node in a cluster has 2 CPU. You do not want to accept any Pod that requests
more than 2 CPU, because no Node in the cluster can support the request.

* A cluster is shared by your production and development departments.
You want to allow production workloads to consume up to 3 CPU, but you want development workloads to be limited
to 1 CPU. You create separate namespaces for production and development, and you apply CPU constraints to
each namespace.
-->
* 集群中的每个节点有两个 CPU。你不想接受任何请求超过 2 个 CPU 的 Pod，
  因为集群中没有节点可以支持这种请求。
* 你的生产和开发部门共享一个集群。你想允许生产工作负载消耗 3 个 CPU，
  而开发部门工作负载的消耗限制为 1 个 CPU。
  你可以为生产和开发创建不同的命名空间，并且为每个命名空间都应用 CPU 限制。

<!--
## Clean up

Delete your namespace:
-->
## 清理

删除你的命名空间：

```shell
kubectl delete namespace constraints-cpu-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

### 集群管理员参考

* [为命名空间配置默认内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置默认 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [为命名空间配置内存限制的最小值和最大值](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
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
