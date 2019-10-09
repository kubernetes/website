<!--
---
title: Configure Default CPU Requests and Limits for a Namespace
content_template: templates/task
weight: 20
---
-->

---
title: 为命名空间配置默认的CPU请求和限制
content_template: templates/task
weight: 20
---

{{% capture overview %}}
<!--
This page shows how to configure default CPU requests and limits for a namespace.
A Kubernetes cluster can be divided into namespaces. If a Container is created in a namespace
that has a default CPU limit, and the Container does not specify its own CPU limit, then
the Container is assigned the default CPU limit. Kubernetes assigns a default CPU request
under certain conditions that are explained later in this topic.
-->

本章介绍怎样为命名空间配置默认的 CPU 请求和限制。
一个 Kubernetes 集群可被划分为多个命名空间。如果在配置了 CPU 限制的命名空间创建容器，并且该容器没有声明自己的 CPU 限制，那么这个容器会被指定默认的 CPU 限制。Kubernetes 在一些特定情况还会指定 CPU 请求，本文后续章节将会对其进行解释。
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
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

创建一个命名空间，以便本练习中创建的资源和集群的其余部分相隔离。

```shell
kubectl create namespace default-cpu-example
```

<!--
## Create a LimitRange and a Pod
-->

创建 LimitRange 和 Pod

<!--
Here's the configuration file for a LimitRange object. The configuration specifies
a default CPU request and a default CPU limit.
-->

这里给出了 LimitRange 对象的配置文件。该配置声明了一个默认的 CPU 请求和一个默认的 CPU 限制。

{{< codenew file="admin/resource/cpu-defaults.yaml" >}}

<!--
Create the LimitRange in the default-cpu-example namespace:
-->

在命名空间 default-cpu-example 中创建 LimitRange 对象：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/cpu-defaults.yaml --namespace=default-cpu-example
```

<!--
Now if a Container is created in the default-cpu-example namespace, and the
Container does not specify its own values for CPU request and CPU limit,
the Container is given a default CPU request of 0.5 and a default
CPU limit of 1.

Here's the configuration file for a Pod that has one Container. The Container
does not specify a CPU request and limit.
-->

现在如果在 default-cpu-example 命名空间创建一个容器，该容器没有声明自己的 CPU 请求和限制时，将会给它指定默认的 CPU 请求0.5和默认的 CPU 限制值1.

这里给出了包含一个容器的 Pod 的配置文件。该容器没有声明 CPU 请求和限制。

{{< codenew file="admin/resource/cpu-defaults-pod.yaml" >}}

<!--
Create the Pod.
-->

创建 Pod。

```shell
kubectl create -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

<!--
View the Pod's specification:
-->

查看该 Pod 的声明：

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the Pod's Container has a CPU request of 500 millicpus and
a CPU limit of 1 cpu. These are the default values specified by the LimitRange.
-->

输出显示该 Pod 的容器有一个500 millicpus的 CPU 请求和一个1 cpu的 CPU 限制。这些是 LimitRange 声明的默认值。

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
## What if you specify a Container's limit, but not its request?
-->

## 你只声明容器的限制，而不声明请求会怎么样？

<!--
Here's the configuration file for a Pod that has one Container. The Container
specifies a CPU limit, but not a request:
-->

这是包含一个容器的 Pod 的配置文件。该容器声明了 CPU 限制，而没有声明 CPU 请求。

{{< codenew file="admin/resource/cpu-defaults-pod-2.yaml" >}}

<!--
Create the Pod:
-->

创建 Pod

```shell
kubectl create -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

<!--
View the Pod specification:
-->

查看 Pod 的声明：

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the Container's CPU request is set to match its CPU limit.
Notice that the Container was not assigned the default CPU request value of 0.5 cpu.
-->

输出显示该容器的 CPU 请求和 CPU 限制设置相同。注意该容器没有被指定默认的 CPU 请求值0.5 cpu。

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

<!--
## What if you specify a Container's request, but not its limit?
-->

## 你只声明容器的请求，而不声明它的限制会怎么样？

<!--
Here's the configuration file for a Pod that has one Container. The Container
specifies a CPU request, but not a limit:
-->

这里给出了包含一个容器的 Pod 的配置文件。该容器声明了 CPU 请求，而没有声明 CPU 限制。

{{< codenew file="admin/resource/cpu-defaults-pod-3.yaml" >}}

<!--
Create the Pod:
-->

创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

<!--
View the Pod specification:
-->

查看 Pod 的声明：

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the Container's CPU request is set to the value specified in the
Container's configuration file. The Container's CPU limit is set to 1 cpu, which is the
default CPU limit for the namespace.
-->

结果显示该容器的 CPU 请求被设置为容器配置文件中声明的数值。容器的CPU限制被设置为1 cpu，即该命名空间的默认 CPU 限制值。

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

<!--
## Motivation for default CPU limits and requests
-->

## 默认 CPU 限制和请求的动机

<!--
If your namespace has a
[resource quota](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/),
it is helpful to have a default value in place for CPU limit.
Here are two of the restrictions that a resource quota imposes on a namespace:

* Every Container that runs in the namespace must have its own CPU limit.
* The total amount of CPU used by all Containers in the namespace must not exceed a specified limit.

If a Container does not specify its own CPU limit, it is given the default limit, and then
it can be allowed to run in a namespace that is restricted by a quota.
-->

如果你的命名空间有一个[资源配额](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/),那么有一个默认的 CPU 限制是有帮助的。这里有两条资源配额强加给命名空间的限制：

* 命名空间中运行的每个容器必须有自己的 CPU 限制。
* 命名空间中所有容器使用的 CPU 总和不能超过一个声明值。

如果容器没有声明自己的 CPU 限制，将会给它一个默认限制，这样它就能被允许运行在一个有配额限制的命名空间中。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
### For cluster administrators
-->

### 集群管理员参考

<!--
* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

* [为命名空间配置默认内存请求和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

* [为命名空间配置内存限制的最小值和最大值](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [为命名空间配置CPU限制的最小值和最大值](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为命名空间配置内存和CPU配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为命名空间配置Pod配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [为API对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers
-->

### 应用开发者参考

<!--
* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->

* [为容器和Pod分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [为容器和Pod分配CPU资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [为Pod配置Service数量](/docs/tasks/configure-pod-container/quality-service-pod/)

{{% /capture %}}


