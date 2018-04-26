---
cn-approvers:
- xiaosuiba
cn-reviewers:
- shirdrn 
title: 为 Namespace 配置最小和最大 CPU 限制
---
<!--
title: Configure Minimum and Maximum CPU Constraints for a Namespace
-->

{% capture overview %}

<!--
This page shows how to set minimum and maximum values for the CPU resources used by Containers
and Pods in a namespace. You specify minimum and maximum CPU values in a
[LimitRange](/docs/api-reference/{{page.version}}/#limitrange-v1-core)
object. If a Pod does not meet the constraints imposed by the LimitRange, it cannot be created
in the namespace.
-->
本文展示了如何设置 namespace 中容器和 Pod 使用的 CPU 资源的最小和最大值。您可以设置 [LimitRange](/docs/api-reference/{{page.version}}/#limitrange-v1-core) 对象中 CPU 的最小和最大值。如果 Pod 没有符合 LimitRange 施加的限制，那么它就不能在 namespace 中创建。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

<!--
Each node in your cluster must have at least 1 CPU.
-->
集群中的每个节点至少需要 1 CPU。

{% endcapture %}


{% capture steps %}

<!--
## Create a namespace
-->
## 创建一个 namespace

<!--
Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
请创建一个 namespace，这样您在本练习中创建的资源就可以和集群中其余资源相互隔离。

```shell
kubectl create namespace constraints-cpu-example
```

<!--
## Create a LimitRange and a Pod
-->
## 创建一个 LimitRange 和一个 Pod

<!--
Here's the configuration file for a LimitRange:
-->
这是 LimitRange 的配置文件：

{% include code.html language="yaml" file="cpu-constraints.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints.yaml" %}

<!--
Create the LimitRange:
-->
创建 LimitRange:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints.yaml --namespace=constraints-cpu-example
```

<!--
View detailed information about the LimitRange:
-->
查看 LimitRange 的详细信息：

```shell
kubectl get limitrange cpu-min-max-demo-lr --output=yaml --namespace=constraints-cpu-example
```

<!--
The output shows the minimum and maximum CPU constraints as expected. But
notice that even though you didn't specify default values in the configuration
file for the LimitRange, they were created automatically.
-->
输出显示了符合预期的最小和最大 CPU 限制。但请注意，即使您没有在配置文件中为 LimitRange 指定默认值，它们也会被自动创建。

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
-->
现在，每当在 constraints-cpu-example namespace 中创建一个容器时，Kubernetes 都会执行下列步骤：

<!--
* If the Container does not specify its own CPU request and limit, assign the default
CPU request and limit to the Container.

* Verify that the Container specifies a CPU request that is greater than or equal to 200 millicpu.

* Verify that the Container specifies a CPU limit that is less than or equal to 800 millicpu.
-->
* 如果容器没有指定自己的 CPU 请求（CPU request）和限制（CPU limit），系统将会为其分配默认值。

* 验证容器的 CPU 请求大于等于 200 millicpu。

* 验证容器的 CPU 限制小于等于 800 millicpu。

<!--
Here's the configuration file for a Pod that has one Container. The Container manifest
specifies a CPU request of 500 millicpu and a CPU limit of 800 millicpu. These satisfy the
minimum and maximum CPU constraints imposed by the LimitRange.
-->
这是一份包含一个容器的 Pod 的配置文件。这个容器的配置清单指定了 500 millicpu 的 CPU 请求和 800 millicpu 的 CPU 限制。这些配置符合 LimitRange 施加的最小和最大 CPU 限制。

{% include code.html language="yaml" file="cpu-constraints-pod.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints-pod.yaml" %}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints-pod.yaml --namespace=constraints-cpu-example
```

<!--
Verify that the Pod's Container is running:
-->
验证 Pod 的容器是否运行正常：

```shell
kubectl get pod constraints-cpu-demo --namespace=constraints-cpu-example
```

<!--
View detailed information about the Pod:
-->
查看关于 Pod 的详细信息：

```shell
kubectl get pod constraints-cpu-demo --output=yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Container has a CPU request of 500 millicpu and CPU limit
of 800 millicpu. These satisfy the constraints imposed by the LimitRange.
-->
输出显示了容器的 CPU 请求为 500 millicpu，CPU 限制为 800 millicpu。这符合 LimitRange 施加的限制条件。



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
删除 Pod：

```shell
kubectl delete pod constraints-cpu-demo --namespace=constraints-cpu-example
```

<!--
## Attempt to create a Pod that exceeds the maximum CPU constraint
-->
## 尝试创建一个超过最大 CPU 限制的 Pod

<!--
Here's the configuration file for a Pod that has one Container. The Container specifies a
CPU request of 500 millicpu and a cpu limit of 1.5 cpu.
-->
这是一份包含一个容器的 Pod 的配置文件。这个容器的配置清单指定了 500 millicpu 的 CPU 请求和 1.5 cpu 的 CPU 限制。



{% include code.html language="yaml" file="cpu-constraints-pod-2.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints-pod-2.yaml" %}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints-pod-2.yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod does not get created, because the Container specifies a CPU limit that is
too large:
-->
输出显示 Pod 没有能够成功创建，因为容器指定的 CPU 限制值太大：

```
Error from server (Forbidden): error when creating "docs/tasks/administer-cluster/cpu-constraints-pod-2.yaml":
pods "constraints-cpu-demo-2" is forbidden: maximum cpu usage per Container is 800m, but limit is 1500m.
```

<!--
## Attempt to create a Pod that does not meet the minimum CPU request
-->
## 尝试创建一个不符合最小 CPU 请求的 Pod

<!--
Here's the configuration file for a Pod that has one Container. The Container specifies a
CPU request of 100 millicpu and a CPU limit of 800 millicpu.
-->
这是一份包含一个容器的 Pod 的配置文件。这个容器的配置清单指定了 100 millicpu 的 CPU 请求和 800 millicpu 的 CPU 限制。

{% include code.html language="yaml" file="cpu-constraints-pod-3.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints-pod-3.yaml" %}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints-pod-3.yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod does not get created, because the Container specifies a CPU
request that is too small:
-->
输出显示 Pod 没有能够成功创建，因为容器指定的 CPU 请求值太小：

```
Error from server (Forbidden): error when creating "docs/tasks/administer-cluster/cpu-constraints-pod-3.yaml":
pods "constraints-cpu-demo-4" is forbidden: minimum cpu usage per Container is 200m, but request is 100m.
```

<!--
## Create a Pod that does not specify any CPU request or limit
-->
## 创建一个没有指定任何 CPU 请求和限制的 Pod

<!--
Here's the configuration file for a Pod that has one Container. The Container does not
specify a CPU request, and it does not specify a CPU limit.
-->
这是一份包含一个容器的 Pod 的配置文件。这个容器没有指定 CPU 请求，也没有指定 CPU 限制。



{% include code.html language="yaml" file="cpu-constraints-pod-4.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints-pod-4.yaml" %}

<!--
Create the Pod:
-->
创建 Pod：


```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints-pod-4.yaml --namespace=constraints-cpu-example
```

<!--
View detailed information about the Pod:
-->
查看关于 Pod 的详细信息：

```
kubectl get pod constraints-cpu-demo-4 --namespace=constraints-cpu-example --output=yaml
```

<!--
The output shows that the Pod's Container has a CPU request of 800 millicpu and a CPU limit of 800 millicpu.
How did the Container get those values?
-->
输出显示 Pod 的容器具有 800 millicpu 的 CPU 请求和 800 millicpu 的 CPU 限制。容器是如何获取这些值的呢？


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
因为您的容器没有指定自己的 CPU 请求和限制，所以它将从 LimitRange 获取 [默认的 CPU 请求和限制值](/docs/tasks/administer-cluster/cpu-default-namespace/)。

<!--
At this point, your Container might be running or it might not be running. Recall that a prerequisite
for this task is that your Nodes have at least 1 CPU. If each of your Nodes has only
1 CPU, then there might not be enough allocatable CPU on any Node to accommodate a request
of 800 millicpu. If you happen to be using Nodes with 2 CPU, then you probably have
enough CPU to accommodate the 800 millicpu request.
-->
到目前为止，您的容器可能在运行，也可能没有运行。回想起来，有一个先决条件就是节点必须至少拥有 1 CPU。如果每个节点都只有 1 CPU，那么任何一个节点上都没有足够的可用 CPU 来容纳 800 millicpu 的请求。如果碰巧使用的节点拥有 2 CPU，那么它可能会有足够的 CPU 来容纳 800 millicpu 的请求。

<!--
Delete your Pod:
-->
删除 Pod：

```
kubectl delete pod constraints-cpu-demo-4 --namespace=constraints-cpu-example
```

<!--
## Enforcement of minimum and maximum CPU constraints
-->
## 应用最小和最大 CPU 限制

<!--
The maximum and minimum CPU constraints imposed on a namespace by a LimitRange are enforced only
when a Pod is created or updated. If you change the LimitRange, it does not affect
Pods that were created previously.
-->
LimitRange 在 namespace 中施加的最小和最大 CPU 限制只有在创建和更新 Pod 时才会被应用。改变 LimitRange 不会对之前创建的 Pod 造成影响。

<!--
## Motivation for minimum and maximum CPU constraints
-->
## 最小和最大 CPU 限制的动因

<!--
As a cluster administrator, you might want to impose restrictions on the CPU resources that Pods can use.
For example:
-->
作为一个集群管理员，您可能希望对 Pod 能够使用的 CPU 资源数量施加限制。例如：

<!--
* Each Node in a cluster has 2 CPU. You do not want to accept any Pod that requests
more than 2 CPU, because no Node in the cluster can support the request.

* A cluster is shared by your production and development departments.
You want to allow production workloads to consume up to 3 CPU, but you want development workloads to be limited
to 1 CPU. You create separate namespaces for production and development, and you apply CPU constraints to
each namespace.
-->
* 集群中每个节点拥有 2 CPU。您不希望任何 Pod 请求超过 2 CPU 的资源，因为集群中没有节点能支持这个请求。

* 集群被生产部门和开发部门共享。 您希望生产负载最多使用 3 CPU 而将开发负载限制为 1 CPU。这种情况下，您可以为生产环境和开发环境创建单独的 namespace，并对每个 namespace 应用 CPU 限制。

<!--
## Clean up
-->
## 清理

<!--
Delete your namespace:
-->
删除 namespace：

```shell
kubectl delete namespace constraints-cpu-example
```

{% endcapture %}

{% capture whatsnext %}

<!--
### For cluster administrators
-->
对于集群管理员

<!--
* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
* [为 Namespace 配置默认内存请求和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

* [为 Namespace 配置默认 CPU 请求和限制](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [为 Namespace 配置最小和最大 CPU 限制](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为 Namespace 配置内存和 CPU 配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为 Namespace 配置 Pod 配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [为 API 对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers
-->
### 对于应用开发者

<!--
* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
* [为容器和 Pod 分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [为容器和 Pod 分配 CPU 资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [为 Pod 配置服务质量](/docs/tasks/configure-pod-container/quality-service-pod/)


{% endcapture %}


{% include templates/task.md %}


