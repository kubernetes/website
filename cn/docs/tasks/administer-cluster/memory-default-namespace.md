---
title: 为命名空间配置默认的内存请求与限额
---

<!--
---
title: Configure Default Memory Requests and Limits for a Namespace
---
-->

{% capture overview %}

<!--
This page shows how to configure default memory requests and limits for a namespace.
If a Container is created in a namespace that has a default memory limit, and the Container
does not specify its own memory limit, then the Container is assigned the default memory limit.
Kubernetes assigns a default memory request under certain conditions that are explained later in this topic.
-->
本页展示了如何给命名空间配置默认的内存请求与限额。
如果在一个拥有默认内存限额的命名空间中创建一个容器，并且这个容器未指定它自己的内存限额，
它会被分配这个默认的内存限额值。Kubernetes 在某些条件下才会分配默认的内存请求值，这个将在本主题的后面解释。

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

<!--
Each node in your cluster must have at least 300 GiB of memory.
-->
集群中的每个节点必须具有至少 300GiB 的内存。

{% endcapture %}

{% capture steps %}

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建命名空间

创建一个命名空间，以便您在本练习中创建的资源与集群的其它部分相隔离。

```shell
kubectl create namespace default-mem-example
```

<!--
## Create a LimitRange and a Pod

Here's the configuration file for a LimitRange object. The configuration specifies
a default memory request and a default memory limit.
-->
## 创建 LimitRange 和 Pod

以下是一个 LimitRange 对象的配置文件。该配置指定了默认的内存请求与默认的内存限额。

{% include code.html language="yaml" file="memory-defaults.yaml" ghlink="/docs/tasks/administer-cluster/memory-defaults.yaml" %}

<!--
Create the LimitRange in the default-mem-example namespace:
-->
在 default-mem-example 命名空间中创建 LimitRange：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/memory-defaults.yaml --namespace=default-mem-example
```

<!--
Now if a Container is created in the default-mem-example namespace, and the
Container does not specify its own values for memory request and memory limit,
the Container is given a default memory request of 256 MiB and a default
memory limit of 512 MiB.

Here's the configuration file for a Pod that has one Container. The Container
does not specify a memory request and limit.
-->
现在如果在这个 default-mem-example 命名空间中创建一个容器，并且该容器未指定它自己的内存请求与内存限额，
该容器会被赋予默认的内存请求值 256MiB 和默认的内存限额值 512MiB。

以下是一个 Pod 的配置文件，它含有一个容器。这个容器没有指定内存请求和限额。

{% include code.html language="yaml" file="memory-defaults-pod.yaml" ghlink="/docs/tasks/administer-cluster/memory-defaults-pod.yaml" %}

<!--
Create the Pod.
-->
创建 Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/memory-defaults-pod.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->
查看关于该 Pod 的详细信息：

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the Pod's Container has a memory request of 256 MiB and
a memory limit of 512 MiB. These are the default values specified by the LimitRange.
-->
输出显示该 Pod 的容器的内存请求值是 256MiB, 内存限额值是 512MiB.
这些是由 LimitRange 指定的默认值。

```shel
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
删除 Pod:

```shell
kubectl delete pod default-mem-demo --namespace=default-mem-example
```

<!--
## What if you specify a Container's limit, but not its request?

Here's the configuration file for a Pod that has one Container. The Container
specifies a memory limit, but not a request:
-->
## 如果您指定了容器的限额值，但未指定请求值，会发生什么？

以下是含有一个容器的 Pod 的配置文件。该容器指定了内存限额，但未指定请求：

{% include code.html language="yaml" file="memory-defaults-pod-2.yaml" ghlink="/docs/tasks/administer-cluster/memory-defaults-pod-2.yaml" %}

<!--
Create the Pod:
-->
创建 Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->
查看关于该 Pod 的详细信息：

```shell
kubectl get pod mem-limit-no-request --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the Container's memory request is set to match its memory limit.
Notice that the Container was not assigned the default memory request value of 256Mi.
-->
输出显示该容器的内存请求值与它的限额值相等。  
注意该容器并未被赋予默认的内存请求值 256MiB。

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

<!--
## What if you specify a Container's request, but not its limit?

Here's the configuration file for a Pod that has one Container. The Container
specifies a memory request, but not a limit:
-->
## 如果您指定了容器的请求值，但未指定限额值，会发生什么？

以下是含有一个容器的 Pod 的配置文件。该容器指定了内存请求，但未指定限额：

{% include code.html language="yaml" file="memory-defaults-pod-3.yaml" ghlink="/docs/tasks/administer-cluster/memory-defaults-pod-3.yaml" %}

<!--
Create the Pod:
-->
创建该 Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

<!--
View the Pod's specification:
-->
查看该 Pod 的配置信息：

```shell
kubectl get pod default-mem-request-no-limit --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the Container's memory request is set to the value specified in the
Container's configuration file. The Container's memory limit is set to 512Mi, which is the
default memory limit for the namespace.
-->
输出显示该容器的内存请求值被设置为该容器配置文件中指定的值。该容器的内存限额设置为 512Mi，这是该命名空间的默认内存限额值。

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

<!--
## Motivation for default memory limits and requests

If your namespace has a resource quota,
it is helpful to have a default value in place for memory limit.
Here are two of the restrictions that a resource quota imposes on a namespace:

* Every Container that runs in the namespace must have its own memory limit.
* The total amount of memory used by all Containers in the namespace must not exceed a specified limit.

If a Container does not specify its own memory limit, it is given the default limit, and then
it can be allowed to run in a namespace that is restricted by a quota.
-->
## 默认内存限额与请求的动机

如果您的命名空间具有资源配额,
它为内存限额设置默认值是有意义的。
以下是资源配额对命名空间施加的两个限制：

* 在命名空间运行的每一个容器必须有它自己的内存限额。
* 在命名空间中所有的容器使用的内存总量不能超出指定的限额。

如果一个容器没有指定它自己的内存限额，它将被赋予默认的限额值，然后它才可以在被配额限制的命名空间中运行。

{% endcapture %}

{% capture whatsnext %}

<!--
### For cluster administrators

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/default-cpu-request-limit/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
### 给集群管理员的参考

* [为命名空间配置默认的 CPU 请求与限额](/docs/tasks/administer-cluster/default-cpu-request-limit/)

* [为命名空间配置最小和最大的内存约束](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [为命名空间配置最小和最大的 CPU 约束](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为命名空间配置内存和 CPU 配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为命名空间配置配置 Pod 配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [为 API 对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 给应用开发者的参考

* [给容器和 Pod 分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [给容器和 Pod 分配 CPU 资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [配置 Pod 的服务质量](/docs/tasks/configure-pod-container/quality-service-pod/)

{% endcapture %}

{% include templates/task.md %}
