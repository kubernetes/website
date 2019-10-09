<!--
---
title: Configure Default Memory Requests and Limits for a Namespace
content_template: templates/task
weight: 10
---
-->

---
title: 为命名空间配置默认的内存请求和限制
content_template: templates/task
weight: 10
---

{{% capture overview %}}

<!--
This page shows how to configure default memory requests and limits for a namespace.
If a Container is created in a namespace that has a default memory limit, and the Container
does not specify its own memory limit, then the Container is assigned the default memory limit.
Kubernetes assigns a default memory request under certain conditions that are explained later in this topic.
-->

本文介绍怎样给命名空间配置默认的内存请求和限制。如果在一个有默认内存限制的命名空间创建容器，该容器没有声明自己的内存限制时，将会被指定默认内存限制。Kubernetes 还为某些情况指定了默认的内存请求，本章后面会进行介绍。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Each node in your cluster must have at least 2 GiB of memory.
-->

你的集群中的每个节点必须至少有2 GiB的内存。

{{% /capture %}}

{{% capture steps %}}

<!--
## Create a namespace
-->

## 创建命名空间

<!--
Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->

创建一个命名空间，以便本练习中所建的资源与集群的其余资源相隔离。

```shell
kubectl create namespace default-mem-example
```

<!--
## Create a LimitRange and a Pod
-->

## 创建 LimitRange 和 Pod

<!--
Here's the configuration file for a LimitRange object. The configuration specifies
a default memory request and a default memory limit.
-->

这里给出了一个限制范围对象的配置文件。该配置声明了一个默认的内存请求和一个默认的内存限制。

{{< codenew file="admin/resource/memory-defaults.yaml" >}}

<!--
Create the LimitRange in the default-mem-example namespace:
-->

在 default-mem-example 命名空间创建限制范围：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

<!--
Now if a Container is created in the default-mem-example namespace, and the
Container does not specify its own values for memory request and memory limit,
the Container is given a default memory request of 256 MiB and a default
memory limit of 512 MiB.

Here's the configuration file for a Pod that has one Container. The Container
does not specify a memory request and limit.
-->

现在，如果在 default-mem-example 命名空间创建容器，并且该容器没有声明自己的内存请求和限制值，它将被指定一个默认的内存请求256 MiB和一个默认的内存限制512 Mib。

{{< codenew file="admin/resource/memory-defaults-pod.yaml" >}}

<!--
Create the Pod.
-->

创建 Pod

```shell
kubectl create -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->

查看 Pod 的详情：

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the Pod's Container has a memory request of 256 MiB and
a memory limit of 512 MiB. These are the default values specified by the LimitRange.
-->

输出内容显示该Pod的容器有一个256 MiB的内存请求和一个512 MiB的内存限制。这些都是限制范围声明的默认值。

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
## What if you specify a Container's limit, but not its request?
-->

## 声明容器的限制而不声明它的请求会怎么样？

<!--
Here's the configuration file for a Pod that has one Container. The Container
specifies a memory limit, but not a request:
-->

这里给出了包含一个容器的 Pod 的配置文件。该容器声明了内存限制，而没有声明内存请求：

{{< codenew file="admin/resource/memory-defaults-pod-2.yaml" >}}

<!--
Create the Pod:
-->

创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->

查看 Pod 的详情：

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the Container's memory request is set to match its memory limit.
Notice that the Container was not assigned the default memory request value of 256Mi.
-->

输出结果显示容器的内存请求被设置为它的内存限制相同的值。注意该容器没有被指定默认的内存请求值256Mi。

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

<!--
## What if you specify a Container's request, but not its limit?
-->

## 声明容器的内存请求而不声明内存限制会怎么样？

<!--
Here's the configuration file for a Pod that has one Container. The Container
specifies a memory request, but not a limit:
-->

这里给出了一个包含一个容器的 Pod 的配置文件。该容器声明了内存请求，但没有内存限制：

{{< codenew file="admin/resource/memory-defaults-pod-3.yaml" >}}

<!--
Create the Pod:
-->

创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

<!--
View the Pod's specification:
-->

查看 Pod 声明：

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the Container's memory request is set to the value specified in the
Container's configuration file. The Container's memory limit is set to 512Mi, which is the
default memory limit for the namespace.
-->

输出结果显示该容器的内存请求被设置为了容器配置文件中声明的数值。容器的内存限制被设置为512Mi，即命名空间的默认内存限制。

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

<!--
## Motivation for default memory limits and requests
-->

## 设置默认内存限制和请求的动机

<!--
If your namespace has a resource quota,
it is helpful to have a default value in place for memory limit.
Here are two of the restrictions that a resource quota imposes on a namespace:
-->

如果你的命名空间有资源配额，那么默认内存限制是很有帮助的。下面是一个例子，通过资源配额为命名空间设置两项约束：

<!--
* Every Container that runs in the namespace must have its own memory limit.
* The total amount of memory used by all Containers in the namespace must not exceed a specified limit.
-->

* 运行在命名空间中的每个容器必须有自己的内存限制。
* 命名空间中所有容器的内存使用量之和不能超过声明的限制值。 

<!--
If a Container does not specify its own memory limit, it is given the default limit, and then
it can be allowed to run in a namespace that is restricted by a quota.
-->

如果一个容器没有声明自己的内存限制，会被指定默认限制，然后它才会被允许在限定了配额的命名空间中运行。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
### For cluster administrators
-->

### 集群管理员参考

<!--
* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

* [为命名空间配置默认的 CPU 请求和限制](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [为命名空间配置最小和最大内存限制](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [为命名空间配置最小和最大 CPU 限制](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为命名空间配置内存和 CPU 配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为命名空间配置 Pod 配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [为 API 对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers
-->

### 应用开发者参考

<!--
* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->

* [为容器和 Pod 分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [为容器和 Pod 分配 CPU 资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [为 Pod 配置服务数量](/docs/tasks/configure-pod-container/quality-service-pod/)

{{% /capture %}}


