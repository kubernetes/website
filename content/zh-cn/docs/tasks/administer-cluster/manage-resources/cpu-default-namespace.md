---
title: 为命名空间配置默认的 CPU 请求和限制
content_type: task
weight: 20
description: >-
  为命名空间定义默认的 CPU 资源限制，在该命名空间中每个新建的 Pod 都会被配置上 CPU 资源限制。
---

<!--
title: Configure Default CPU Requests and Limits for a Namespace
content_type: task
weight: 20
-->

<!-- overview -->
<!--
This page shows how to configure default CPU requests and limits for a
{{< glossary_tooltip text="namespace" term_id="namespace" >}}.

A Kubernetes cluster can be divided into namespaces. If you create a Pod within a
namespace that has a default CPU
[limit](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits), and any container in that Pod does not specify
its own CPU limit, then the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} assigns the default
CPU limit to that container.

Kubernetes assigns a default CPU
[request](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits),
but only under certain conditions that are explained later in this page.
-->
本章介绍如何为{{< glossary_tooltip text="命名空间" term_id="namespace" >}}配置默认的 CPU 请求和限制。

一个 Kubernetes 集群可被划分为多个命名空间。
如果你在具有默认 CPU [限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
的命名空间内创建一个 Pod，并且这个 Pod 中任何容器都没有声明自己的 CPU 限制，
那么{{< glossary_tooltip text="控制面" term_id="control-plane" >}}会为容器设定默认的 CPU 限制。

Kubernetes 在一些特定情况还可以设置默认的 CPU 请求，本文后续章节将会对其进行解释。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.

If you're not already familiar with what Kubernetes means by 1.0 CPU,
read [meaning of CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu).
-->
在你的集群里你必须要有创建命名空间的权限。

如果你还不熟悉 Kubernetes 中 1.0 CPU 的含义，
请阅读 [CPU 的含义](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建命名空间

创建一个命名空间，以便本练习中创建的资源和集群的其余部分相隔离。

```shell
kubectl create namespace default-cpu-example
```

<!--
## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}.
The manifest specifies a default CPU request and a default CPU limit.
-->
## 创建 LimitRange 和 Pod

以下为 {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} 的示例清单。
清单中声明了默认 CPU 请求和默认 CPU 限制。

{{% code_sample file="admin/resource/cpu-defaults.yaml" %}}

<!--
Create the LimitRange in the default-cpu-example namespace:
-->
在命名空间 default-cpu-example 中创建 LimitRange 对象：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults.yaml --namespace=default-cpu-example
```

<!--
Now if you create a Pod in the default-cpu-example namespace, and any container
in that Pod does not specify its own values for CPU request and CPU limit,
then the control plane applies default values: a CPU request of 0.5 and a default
CPU limit of 1.

Here's a manifest for a Pod that has one container. The container
does not specify a CPU request and limit.
-->
现在如果你在 default-cpu-example 命名空间中创建一个 Pod，
并且该 Pod 中所有容器都没有声明自己的 CPU 请求和 CPU 限制，
控制面会将 CPU 的默认请求值 0.5 和默认限制值 1 应用到 Pod 上。

以下为只包含一个容器的 Pod 的清单。该容器没有声明 CPU 请求和限制。

{{% code_sample file="admin/resource/cpu-defaults-pod.yaml" %}}

<!--
Create the Pod.
-->
创建 Pod。

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

<!--
View the Pod's specification:
-->
查看该 Pod 的声明：

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the Pod's only container has a CPU request of 500m `cpu`
(which you can read as “500 millicpu”), and a CPU limit of 1 `cpu`.
These are the default values specified by the LimitRange.
-->
输出显示该 Pod 的唯一的容器有 500m `cpu` 的 CPU 请求和 1 `cpu` 的 CPU 限制。
这些是 LimitRange 声明的默认值。

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-cpu-demo-ctr
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

<!--
## What if you specify a container's limit, but not its request?

Here's a manifest for a Pod that has one container. The container
specifies a CPU limit, but not a request:
-->
## 你只声明容器的限制，而不声明请求会怎么样？

以下为只包含一个容器的 Pod 的清单。该容器声明了 CPU 限制，而没有声明 CPU 请求。

{{% code_sample file="admin/resource/cpu-defaults-pod-2.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

<!--
View the [specification](/docs/concepts/overview/working-with-objects/#object-spec-and-status)
of the Pod that you created:
-->
查看你所创建的 Pod 的[规约](/zh-cn/docs/concepts/overview/working-with-objects/#object-spec-and-status)：

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the container's CPU request is set to match its CPU limit.
Notice that the container was not assigned the default CPU request value of 0.5 `cpu`:
-->
输出显示该容器的 CPU 请求和 CPU 限制设置相同。注意该容器没有被指定默认的 CPU 请求值 0.5 `cpu`：

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

<!--
## What if you specify a container's request, but not its limit?

Here's an example manifest for a Pod that has one container. The container
specifies a CPU request, but not a limit:
-->
## 你只声明容器的请求，而不声明它的限制会怎么样？

这里给出了包含一个容器的 Pod 的示例清单。该容器声明了 CPU 请求，而没有声明 CPU 限制。

{{% code_sample file="admin/resource/cpu-defaults-pod-3.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

<!--
View the specification of the Pod that you created:
-->
查看你所创建的 Pod 的规约：

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the container's CPU request is set to the value you specified at
the time you created the Pod (in other words: it matches the manifest).
However, the same container's CPU limit is set to 1 `cpu`, which is the default CPU limit
for that namespace.
-->
输出显示你所创建的 Pod 中，容器的 CPU 请求为 Pod 清单中声明的值。
然而同一容器的 CPU 限制被设置为 1 `cpu`，此值是该命名空间的默认 CPU 限制值。

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

<!--
## Motivation for default CPU limits and requests

If your namespace has a CPU {{< glossary_tooltip text="resource quota" term_id="resource-quota" >}}
configured,
it is helpful to have a default value in place for CPU limit.
Here are two of the restrictions that a CPU resource quota imposes on a namespace:

* For every Pod that runs in the namespace, each of its containers must have a CPU limit.
* CPU limits apply a resource reservation on the node where the Pod in question is scheduled.
  The total amount of CPU that is reserved for use by all Pods in the namespace must not
  exceed a specified limit.
-->
## 默认 CPU 限制和请求的动机

如果你的命名空间设置了 CPU {{< glossary_tooltip text="资源配额" term_id="resource-quota" >}}，
为 CPU 限制设置一个默认值会很有帮助。
以下是 CPU 资源配额对命名空间的施加的两条限制：

* 命名空间中运行的每个 Pod 中的容器都必须有 CPU 限制。

* CPU 限制用来在 Pod 被调度到的节点上执行资源预留。

预留给命名空间中所有 Pod 使用的 CPU 总量不能超过规定的限制。

<!--
When you add a LimitRange:

If any Pod in that namespace that includes a container does not specify its own CPU limit,
the control plane applies the default CPU limit to that container, and the Pod can be
allowed to run in a namespace that is restricted by a CPU ResourceQuota.
-->
当你添加 LimitRange 时：

如果该命名空间中的任何 Pod 的容器未指定 CPU 限制，
控制面将默认 CPU 限制应用于该容器，
这样 Pod 可以在受到 CPU ResourceQuota 限制的命名空间中运行。

<!--
## Clean up

Delete your namespace:

```shell
kubectl delete namespace default-cpu-example
```
-->
## 清理

删除你的命名空间：

```shell
kubectl delete namespace default-cpu-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
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
