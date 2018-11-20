<!--
---
title: Configure Minimum and Maximum CPU Constraints for a Namespace
content_template: templates/task
weight: 40
---
-->

---
title: 为命名空间配置CPU最小和最大限制
content_template: templates/task
weight: 40
---


{{% capture overview %}}

<!--
This page shows how to set minimum and maximum values for the CPU resources used by Containers
and Pods in a namespace. You specify minimum and maximum CPU values in a
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
object. If a Pod does not meet the constraints imposed by the LimitRange, it cannot be created
in the namespace.
-->

本章介绍命名空间中可以被容器和Pod使用的CPU资源的最小和最大值。你可以通过 [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core) 对象声明 CPU 的最小和最大值. 如果 Pod 不能满足 LimitRange 的限制，它就不能在命名空间中创建。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Each node in your cluster must have at least 1 CPU.
-->

你的集群中每个节点至少要有1个CPU。

{{% /capture %}}


{{% capture steps %}}

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

Here's the configuration file for a LimitRange:
-->

## 创建 LimitRange 和 Pod

这里给出了 LimitRange 的配置文件：

{{< codenew file="admin/resource/cpu-constraints.yaml" >}}

<!--
Create the LimitRange:
-->

创建 LimitRange:

```shell
kubectl create -f https://k8s.io/examples/admin/resource/cpu-constraints.yaml --namespace=constraints-cpu-example
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

输出结果显示 CPU 的最小和最大限制符合预期。但需要注意的是，尽管你在 LimitRange 的配置文件中你没有声明默认值，默认值也会被自动创建。

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
Now whenever a Container is created in the constraints-cpu-example namespace, Kubernetes
performs these steps:

* If the Container does not specify its own CPU request and limit, assign the default
CPU request and limit to the Container.

* Verify that the Container specifies a CPU request that is greater than or equal to 200 millicpu.

* Verify that the Container specifies a CPU limit that is less than or equal to 800 millicpu.
-->

现在不管什么时候在 constraints-cpu-example 命名空间中创建容器，Kubernetes 都会执行下面这些步骤：

* 如果容器没有声明自己的 CPU 请求和限制，将为容器指定默认 CPU 请求和限制。

* 核查容器声明的 CPU 请求确保其大于或者等于200 millicpu。

* 核查容器声明的 CPU 限制确保其小于或者等于800 millicpu。


{{< note >}} 当创建 LimitRange 对象时，你也可以声明 huge-page 和 GPU 的限制。当这些资源同时声明了 'default' 和 ‘defaultRequest’ 参数时，两个参数值必须相同。 {{< /note >}}
<!--
When creating a `LimitRange` object, you can specify limits on huge-pages
or GPUs as well. However, when both `default` and `defaultRequest` are specified
on these resources, the two values must be the same.
-->




<!--
Here's the configuration file for a Pod that has one Container. The Container manifest
specifies a CPU request of 500 millicpu and a CPU limit of 800 millicpu. These satisfy the
minimum and maximum CPU constraints imposed by the LimitRange.
-->

这里给出了包含一个容器的 Pod 的配置文件。该容器声明了500 millicpu的 CPU 请求和800 millicpu的 CPU 限制。这些参数满足了 LimitRange 对象规定的 CPU 最小和最大限制。

{{< codenew file="admin/resource/cpu-constraints-pod.yaml" >}}

<!--
Create the Pod:
-->

创建Pod：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/cpu-constraints-pod.yaml --namespace=constraints-cpu-example
```

<!--
Verify that the Pod's Container is running:
-->

确认一下 Pod 中的容器在运行：

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
The output shows that the Container has a CPU request of 500 millicpu and CPU limit
of 800 millicpu. These satisfy the constraints imposed by the LimitRange.
-->

输出结果表明容器的 CPU 请求为500 millicpu，CPU限制为800 millicpu。这些参数满足 LimitRange 规定的限制范围。

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

Here's the configuration file for a Pod that has one Container. The Container specifies a
CPU request of 500 millicpu and a cpu limit of 1.5 cpu.
-->

## 尝试创建一个超过最大 CPU 限制的 Pod

这里给出了包含一个容器的 Pod 的配置文件。容器声明了500 millicpu的CPU请求和1.5 cpu的 CPU 限制。

{{< codenew file="admin/resource/cpu-constraints-pod-2.yaml" >}}

<!--
Attempt to create the Pod:
-->

尝试创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-2.yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod does not get created, because the Container specifies a CPU limit that is
too large:
-->

输出结果表明 Pod 没有创建成功，因为容器声明的 CPU 限制太大了：

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-2.yaml":
pods "constraints-cpu-demo-2" is forbidden: maximum cpu usage per Container is 800m, but limit is 1500m.
```

<!--
## Attempt to create a Pod that does not meet the minimum CPU request

Here's the configuration file for a Pod that has one Container. The Container specifies a
CPU request of 100 millicpu and a CPU limit of 800 millicpu.
-->

## 尝试创建一个不满足最小 CPU 请求的 Pod

这里给出了包含一个容器的 Pod 的配置文件。该容器声明了100 millicpu的 CPU 请求和800 millicpu的 CPU 限制。

{{< codenew file="admin/resource/cpu-constraints-pod-3.yaml" >}}

<!--
Attempt to create the Pod:
-->

尝试创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-3.yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod does not get created, because the Container specifies a CPU
request that is too small:
-->

输出结果显示 Pod 没有创建成功，因为容器声明的 CPU 请求太小了：

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-3.yaml":
pods "constraints-cpu-demo-4" is forbidden: minimum cpu usage per Container is 200m, but request is 100m.
```

<!--
## Create a Pod that does not specify any CPU request or limit

Here's the configuration file for a Pod that has one Container. The Container does not
specify a CPU request, and it does not specify a CPU limit.
-->

## 创建一个没有声明CPU请求和CPU限制的Pod

这里给出了包含一个容器的Pod的配置文件。该容器没有声明CPU请求和CPU限制。

{{< codenew file="admin/resource/cpu-constraints-pod-4.yaml" >}}

<!--
Create the Pod:
-->

创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-4.yaml --namespace=constraints-cpu-example
```

<!--
View detailed information about the Pod:
-->

查看 Pod 的详情：

```
kubectl get pod constraints-cpu-demo-4 --namespace=constraints-cpu-example --output=yaml
```

<!--
The output shows that the Pod's Container has a CPU request of 800 millicpu and a CPU limit of 800 millicpu.
How did the Container get those values?
-->

输出结果显示 Pod 的容器有个800 millicpu的 CPU 请求和800 millicpu的 CPU 限制。容器时怎样得到那些值的呢？

```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 800m
```

<!--
Because your Container did not specify its own CPU request and limit, it was given the
[default CPU request and limit](/docs/tasks/administer-cluster/cpu-default-namespace/)
from the LimitRange.
-->

因为你的容器没有声明自己的 CPU 请求和限制，LimitRange 给它指定了[默认的CPU请求和限制](/docs/tasks/administer-cluster/cpu-default-namespace/)

<!--
At this point, your Container might be running or it might not be running. Recall that a prerequisite
for this task is that your Nodes have at least 1 CPU. If each of your Nodes has only
1 CPU, then there might not be enough allocatable CPU on any Node to accommodate a request
of 800 millicpu. If you happen to be using Nodes with 2 CPU, then you probably have
enough CPU to accommodate the 800 millicpu request.

Delete your Pod:
-->

此时，你的容器可能运行也可能没有运行。回想一下，本任务的先决条件是你的节点要有1 个 CPU。如果你的每个节点仅有1个 CPU，那么可能没有任何一个节点可以满足800 millicpu的 CPU 请求。如果你在用的节点恰好有两个 CPU，那么你才可能有足够的 CPU来满足800 millicpu的请求。

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

只有当Pod创建或者更新时，LimitRange为命名空间规定的CPU最小和最大限制才会被强制执行。如果你对LimitRange进行修改，那不会影响此前创建的Pod。

<!--
## Motivation for minimum and maximum CPU constraints
-->

## 最小和最大 CPU 限制范围的动机

<!--
As a cluster administrator, you might want to impose restrictions on the CPU resources that Pods can use.
For example:
-->

作为集群管理员，你可能想设定 Pod 可以使用的 CPU 资源限制。例如：

<!--
* Each Node in a cluster has 2 CPU. You do not want to accept any Pod that requests
more than 2 CPU, because no Node in the cluster can support the request.

* A cluster is shared by your production and development departments.
You want to allow production workloads to consume up to 3 CPU, but you want development workloads to be limited
to 1 CPU. You create separate namespaces for production and development, and you apply CPU constraints to
each namespace.
-->

* 集群中的每个节点有两个 CPU。你不想接受任何请求超过2个 CPU 的 Pod，因为集群中没有节点可以支持这种请求。

* 你的生产和开发部门共享一个集群。你想允许生产工作负载消耗3个 CPU，而开发工作负载的消耗限制为1个 CPU。你为生产和开发创建不同的命名空间，并且你为每个命名空间都应用了 CPU 限制。

<!--
## Clean up

Delete your namespace:
-->

## 环境清理

删除你的命名空间：

```shell
kubectl delete namespace constraints-cpu-example
```

{{% /capture %}}

{{% capture whatsnext %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

### 集群管理员参考：

* [为命名空间配置默认内存请求和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

* [为命名空间配置内存限制的最小值和最大值](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [为命名空间配置CPU限制的最小值和最大值](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为命名空间配置内存和CPU配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为命名空间配置Pod配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [为API对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->

### 应用开发者参考：

* [为容器和Pod分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [为容器和Pod分配CPU资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [为Pod配置Service数量](/docs/tasks/configure-pod-container/quality-service-pod/)

{{% /capture %}}





