---
title: 为命名空间配置默认的内存请求和限制
content_type: task
weight: 10
description: >-
  为命名空间定义默认的内存资源限制，这样在该命名空间中每个新建的 Pod 都会被配置上内存资源限制。
---

<!--
title: Configure Default Memory Requests and Limits for a Namespace
content_type: task
weight: 10
description: >-
  Define a default memory resource limit for a namespace, so that every new Pod
  in that namespace has a memory resource limit configured.
-->

<!-- overview -->

<!--
This page shows how to configure default memory requests and limits for a
{{< glossary_tooltip text="namespace" term_id="namespace" >}}.

A Kubernetes cluster can be divided into namespaces. Once you have a namespace that
has a default memory
[limit](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits),
and you then try to create a Pod with a container that does not specify its own memory
limit, then the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} assigns the default
memory limit to that container.

Kubernetes assigns a default memory request under certain conditions that are explained later in this topic.
-->
本章介绍如何为{{< glossary_tooltip text="命名空间" term_id="namespace" >}}配置默认的内存请求和限制。

一个 Kubernetes 集群可被划分为多个命名空间。
如果你在具有默认内存[限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
的命名空间内尝试创建一个 Pod，并且这个 Pod 中的容器没有声明自己的内存资源限制，
那么{{< glossary_tooltip text="控制面" term_id="control-plane" >}}会为该容器设定默认的内存限制。

Kubernetes 还为某些情况指定了默认的内存请求，本章后面会进行介绍。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.

Each node in your cluster must have at least 2 GiB of memory.
-->
在你的集群里你必须要有创建命名空间的权限。

你的集群中的每个节点必须至少有 2 GiB 的内存。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建命名空间

创建一个命名空间，以便本练习中所建的资源与集群的其余资源相隔离。

```shell
kubectl create namespace default-mem-example
```

<!--
## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}.
The manifest specifies a default memory
request and a default memory limit.
-->
## 创建 LimitRange 和 Pod

以下为 {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} 的示例清单。
清单中声明了默认的内存请求和默认的内存限制。

{{% code_sample file="admin/resource/memory-defaults.yaml" %}}

<!--
Create the LimitRange in the default-mem-example namespace:
-->
在 default-mem-example 命名空间创建限制范围：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

<!--
Now if you create a Pod in the default-mem-example namespace, and any container
within that Pod does not specify its own values for memory request and memory limit,
then the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
applies default values: a memory request of 256MiB and a memory limit of 512MiB.

Here's an example manifest for a Pod that has one container. The container
does not specify a memory request and limit.
-->
现在如果你在 default-mem-example 命名空间中创建一个 Pod，
并且该 Pod 中所有容器都没有声明自己的内存请求和内存限制，
{{< glossary_tooltip text="控制面" term_id="control-plane" >}}
会将内存的默认请求值 256MiB 和默认限制值 512MiB 应用到 Pod 上。

以下为只包含一个容器的 Pod 的清单。该容器没有声明内存请求和限制。

{{% code_sample file="admin/resource/memory-defaults-pod.yaml" %}}

<!--
Create the Pod.
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的详情：

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the Pod's container has a memory request of 256 MiB and
a memory limit of 512 MiB. These are the default values specified by the LimitRange.
-->
输出内容显示该 Pod 的容器有 256 MiB 的内存请求和 512 MiB 的内存限制。
这些都是 LimitRange 设置的默认值。

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-mem-demo-ctr
  resources:
    limits:
      memory: 512Mi
    requests:
      memory: 256Mi
```

<!--
Delete your Pod:
-->
删除你的 Pod：

```shell
kubectl delete pod default-mem-demo --namespace=default-mem-example
```

<!--
## What if you specify a container's limit, but not its request?

Here's a manifest for a Pod that has one container. The container
specifies a memory limit, but not a request:
-->
## 声明容器的限制而不声明它的请求会怎么样？

以下为只包含一个容器的 Pod 的清单。该容器声明了内存限制，而没有声明内存请求。

{{% code_sample file="admin/resource/memory-defaults-pod-2.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的详情：

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the container's memory request is set to match its memory limit.
Notice that the container was not assigned the default memory request value of 256Mi.
-->
输出结果显示容器的内存请求被设置为它的内存限制相同的值。注意该容器没有被指定默认的内存请求值 256MiB。

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

<!--
## What if you specify a container's request, but not its limit?
-->
## 声明容器的内存请求而不声明内存限制会怎么样？

<!--
Here's a manifest for a Pod that has one container. The container
specifies a memory request, but not a limit:
-->
以下为只包含一个容器的 Pod 的清单。该容器声明了内存请求，但没有内存限制：

{{% code_sample file="admin/resource/memory-defaults-pod-3.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

<!--
View the Pod's specification:
-->
查看 Pod 声明：

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the container's memory request is set to the value specified in the
container's manifest. The container is limited to use no more than 512MiB of
memory, which matches the default memory limit for the namespace.
-->
输出结果显示所创建的 Pod 中，容器的内存请求为 Pod 清单中声明的值。
然而同一容器的内存限制被设置为 512MiB，此值是该命名空间的默认内存限制值。

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

{{< note >}}

<!--
A `LimitRange` does **not** check the consistency of the default values it applies. This means that a default value for the _limit_ that is set by `LimitRange` may be less than the _request_ value specified for the container in the spec that a client submits to the API server. If that happens, the final Pod will not be scheduleable.
See [Constraints on resource limits and requests](/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests) for more details.
-->
`LimitRange` **不会**检查它应用的默认值的一致性。 这意味着 `LimitRange` 设置的 **limit** 的默认值可能小于客户端提交给
API 服务器的声明中为容器指定的 **request** 值。如果发生这种情况，最终会导致 Pod 无法调度。更多信息，
请参阅[资源限制的 limit 和 request](/zh-cn/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests)。

{{< /note >}}

<!--
## Motivation for default memory limits and requests

If your namespace has a memory {{< glossary_tooltip text="resource quota" term_id="resource-quota" >}}
configured,
it is helpful to have a default value in place for memory limit.
Here are three of the restrictions that a resource quota imposes on a namespace:

* For every Pod that runs in the namespace, the Pod and each of its containers must have a memory limit.
  (If you specify a memory limit for every container in a Pod, Kubernetes can infer the Pod-level memory
  limit by adding up the limits for its containers).
* Memory limits apply a resource reservation on the node where the Pod in question is scheduled.
  The total amount of memory reserved for all Pods in the namespace must not exceed a specified limit.
* The total amount of memory actually used by all Pods in the namespace must also not exceed a specified limit.
-->
## 设置默认内存限制和请求的动机

如果你的命名空间设置了内存 {{< glossary_tooltip text="资源配额" term_id="resource-quota" >}}，
那么为内存限制设置一个默认值会很有帮助。
以下是内存资源配额对命名空间的施加的三条限制：

* 命名空间中运行的每个 Pod 中的容器都必须有内存限制。
  （如果为 Pod 中的每个容器声明了内存限制，
  Kubernetes 可以通过将其容器的内存限制相加推断出 Pod 级别的内存限制）。

* 内存限制用来在 Pod 被调度到的节点上执行资源预留。
  预留给命名空间中所有 Pod 使用的内存总量不能超过规定的限制。

* 命名空间中所有 Pod 实际使用的内存总量也不能超过规定的限制。

<!--
When you add a LimitRange:

If any Pod in that namespace that includes a container does not specify its own memory limit,
the control plane applies the default memory limit to that container, and the Pod can be
allowed to run in a namespace that is restricted by a memory ResourceQuota.
-->
当你添加 LimitRange 时：

如果该命名空间中的任何 Pod 的容器未指定内存限制，
控制面将默认内存限制应用于该容器，
这样 Pod 可以在受到内存 ResourceQuota 限制的命名空间中运行。

<!--
## Clean up

Delete your namespace:
-->
## 清理

删除你的命名空间：

```shell
kubectl delete namespace default-mem-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
### 集群管理员参考

* [为命名空间配置默认的 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [为命名空间配置最小和最大内存限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为命名空间配置最小和最大 CPU 限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
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
