---
title: 在命名空间中配置默认的CPU请求与限额  
---

<!--
---
title: Configure Default CPU Requests and Limits for a Namespace
---
-->

{% capture overview %}

<!--
This page shows how to configure default CPU requests and limits for a namespace.
A Kubernetes cluster can be divided into namespaces. If a Container is created in a namespace
that has a default CPU limit, and the Container does not specify its own CPU limit, then
the Container is assigned the default CPU limit. Kubernetes assigns a default CPU request
under certain conditions that are explained later in this topic.
-->
本页展示了如何在命名空间中配置默认的CPU请求与限额。  
一个Kubernetes集群能细分为不同的命名空间。如果在一个拥有默认CPU限额的命名空间中创建一个容器，则这个容器不需要指定它自己的CPU限额，
它会被分配这个默认的CPU限额值。Kubernetes在某些条件下才会分配默认的CPU请求值，这个将在本主题的后面解释。

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建一个命名空间

创建一个命名空间为了使你在本练习中创建的资源与集群的其它部分相隔离。

```shell
kubectl create namespace default-cpu-example
```

<!--
## Create a LimitRange and a Pod

Here's the configuration file for a LimitRange object. The configuration specifies
a default CPU request and a default CPU limit.
-->
## 创建一个LimitRange和一个Pod

以下是一个LimitRange对象的配置文件。这个配置中指定了一个默认的CPU请求和一个默认的CPU限额。

{% include code.html language="yaml" file="cpu-defaults.yaml" ghlink="/docs/tasks/administer-cluster/cpu-defaults.yaml" %}

<!--
Create the LimitRange in the default-cpu-example namespace:
-->
在这个defaule-cpu-example命名空间中创建这个LimitRange:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-defaults.yaml --namespace=default-cpu-example
```

<!--
Now if a Container is created in the default-cpu-example namespace, and the
Container does not specify its own values for CPU request and CPU limit,
the Container is given a default CPU request of 0.5 and a default
CPU limit of 1.

Here's the configuration file for a Pod that has one Container. The Container
does not specify a CPU request and limit.
-->
现在如果在这个defaule-cpu-example命名空间中创建一个容器，则该容器不需要指定它自己的CPU请求和CPU限额，
该容器会被赋予一个默认的CPU请求值0.5和一个默认的CPU限额值1。

{% include code.html language="yaml" file="cpu-defaults-pod.yaml" ghlink="/docs/tasks/administer-cluster/cpu-defaults-pod.yaml" %}

<!--
Create the Pod.
-->
创建Pod

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

<!--
View the Pod's specification:
-->
查看该Pod的配置：

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the Pod's Container has a CPU request of 500 millicpus and
a CPU limit of 1 cpu. These are the default values specified by the LimitRange.
-->
输出显示该Pod的容器含有一个CPU请求值500m和一个CPU限额值1。
这些是由LimitRange指定的默认值。

```shel
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

Here's the configuration file for a Pod that has one Container. The Container
specifies a CPU limit, but not a request:
-->
## 如果你指定了一个容器的限额值，但未指定请求值，会发生什么？

以下是一个含有一个容器的Pod的配置文件。该容器指定了一个CPU限额，但未指定请求：

{% include code.html language="yaml" file="cpu-defaults-pod-2.yaml" ghlink="/docs/tasks/administer-cluster/cpu-defaults-pod-2.yaml" %}

<!--
Create the Pod:
-->
创建该Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

<!--
View the Pod specification:
-->
查看该Pod的配置：

```
kubectl get pod cpu-limit-no-request --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the Container's CPU request is set to match its CPU limit.
Notice that the Container was not assigned the default CPU request value of 0.5 cpu.
-->
输出展示该容器的CPU请求值与它的限额值相等。  
注意该容器并未被赋予这个默认的CPU请求值0.5。

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

<!--
## What if you specify a Container's request, but not its limit?

Here's the configuration file for a Pod that has one Container. The Container
specifies a CPU request, but not a limit:
-->
## 如果你指定了一个容器的请求值，未指定限额值，会发生什么？

以下是含有一个容器的Pod的配置文件。该容器指定了一个CPU请求，但未指定一个限额：

{% include code.html language="yaml" file="cpu-defaults-pod-3.yaml" ghlink="/docs/tasks/administer-cluster/cpu-defaults-pod-3.yaml" %}

<!--
Create the Pod:
-->
创建该Pod

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

<!--
The output shows that the Container's CPU request is set to the value specified in the
Container's configuration file. The Container's CPU limit is set to 1 cpu, which is the
default CPU limit for the namespace.
-->
输出显示该容器的CPU请求值被设置为该容器配置文件中指定的值。该容器的CPU限额设置为1，这是该命名空间的默认CPU的限额值。

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

<!--
## Motivation for default CPU limits and requests

If your namespace has a
[resource quota](),
it is helpful to have a default value in place for CPU limit.
Here are two of the restrictions that a resource quota imposes on a namespace:

* Every Container that runs in the namespace must have its own CPU limit.
* The total amount of CPU used by all Containers in the namespace must not exceed a specified limit.

If a Container does not specify its own CPU limit, it is given the default limit, and then
it can be allowed to run in a namespace that is restricted by a quota.
-->
## 默认CPU限额和请求的动机

如果你的命名空间含有[资源配额](https://kubernetes.io/docs/tasks/administer-cluster/cpu-default-namespace/),
它对于设置一个CPU限额的默认值是有帮助的。
以下是资源配额对命名空间施加的两个限制：

* 在命名空间运行的每一个容器必须含有它自己的CPU限额。
* 在命名空间中所有容器使用的CPU总量不能超出指定的限额。

如果一个容器没有指定它自己的CPU限额，它将被赋予默认的限额值，然后它可以在被配额限制的命名空间中运行。

{% endcapture %}

{% capture whatsnext %}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/default-memory-request-limit/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
### 对于集群管理员

* [为命名空间配置默认的内存请求和限额](/docs/tasks/administer-cluster/default-memory-request-limit/)

* [为命名空间配置最小和最大的内存约束](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [为命名空间配置最小和最大的CPU约束](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为命名空间配置内存和CPU配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为命名空间配置配置Pod配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [为API对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 对于应用开发人员

* [给容器和Pods分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [给容器和Pods分配CPU资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [配置Pod的服务质量](/docs/tasks/configure-pod-container/quality-service-pod/)

{% endcapture %}

{% include templates/task.md %}
