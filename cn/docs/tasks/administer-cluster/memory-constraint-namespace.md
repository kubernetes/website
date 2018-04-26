---
cn-approvers:
- xiaosuiba
cn-reviewers:
title: 为 Namespace 设置最小和最大内存限制
---
<!--
title: Configure Minimum and Maximum Memory Constraints for a Namespace
-->


{% capture overview %}

<!--
This page shows how to set minimum and maximum values for memory used by Containers
running in a namespace. You specify minimum and maximum memory values in a
[LimitRange](/docs/api-reference/{{page.version}}/#limitrange-v1-core)
object. If a Pod does not meet the constraints imposed by the LimitRange,
it cannot be created in the namespace.
-->
本文展示了如何为 namespace 中运行的容器设置内存的最小和最大值。您可以设置 [LimitRange](/docs/api-reference/{{page.version}}/#limitrange-v1-core) 对象中内存的最小和最大值。如果 Pod 没有符合 LimitRange 施加的限制，那么它就不能在 namespace 中创建。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

<!--
Each node in your cluster must have at least 1 GiB of memory.
-->
集群中的每个节点至少需要 1 GiB 内存。

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
kubectl create namespace constraints-mem-example
```

<!--
## Create a LimitRange and a Pod
-->
## 创建一个 LimitRange 和一个 Pod

<!--
Here's the configuration file for a LimitRange:
-->
这是 LimitRange 的配置文件：

{% include code.html language="yaml" file="memory-constraints.yaml" ghlink="/docs/tasks/administer-cluster/memory-constraints.yaml" %}

<!--
Create the LimitRange:
-->
创建 LimitRange:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/memory-constraints.yaml --namespace=constraints-mem-example
```

<!--
View detailed information about the LimitRange:
-->
查看 LimitRange 的详细信息：

```shell
kubectl get limitrange cpu-min-max-demo --namespace=constraints-mem-example --output=yaml
```

<!--
The output shows the minimum and maximum memory constraints as expected. But
notice that even though you didn't specify default values in the configuration
file for the LimitRange, they were created automatically.
-->
输出显示了符合预期的最小和最大内存限制。但请注意，即使您没有在配置文件中为 LimitRange 指定默认值，它们也会被自动创建。

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
-->
现在，每当在 constraints-mem-example namespace 中创建一个容器时，Kubernetes 都会执行下列步骤：

<!--
* If the Container does not specify its own memory request and limit, assign the default
memory request and limit to the Container.

* Verify that the Container has a memory request that is greater than or equal to 500 MiB.

* Verify that the Container has a memory limit that is less than or equal to 1 GiB.
-->
* 如果容器没有指定自己的内存请求（request）和限制（limit），系统将会为其分配默认值。
* 验证容器的内存请求大于等于 500 MiB。
* 验证容器的内存限制小于等于 1 GiB。

<!--
Here's the configuration file for a Pod that has one Container. The Container manifest
specifies a memory request of 600 MiB and a memory limit of 800 MiB. These satisfy the
minimum and maximum memory constraints imposed by the LimitRange.
-->
这是一份包含一个容器的 Pod 的配置文件。这个容器的配置清单指定了 600 MiB 的内存请求和 800 MiB 的内存限制。这些配置符合 LimitRange 施加的最小和最大内存限制。

{% include code.html language="yaml" file="memory-constraints-pod.yaml" ghlink="/docs/tasks/administer-cluster/memory-constraints-pod.yaml" %}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

<!--
Verify that the Pod's Container is running:
-->
验证 Pod 的容器是否运行正常：

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

<!--
View detailed information about the Pod:
-->
查看关于 Pod 的详细信息：

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Container has a memory request of 600 MiB and a memory limit
of 800 MiB. These satisfy the constraints imposed by the LimitRange.
-->
输出显示了容器的内存请求为 600 MiB，内存限制为 800 MiB。这符合 LimitRange 施加的限制。

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
删除 Pod：

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

<!--
## Attempt to create a Pod that exceeds the maximum memory constraint
-->
## 尝试创建一个超过最大内存限制的 Pod

<!--
Here's the configuration file for a Pod that has one Container. The Container specifies a
memory request of 800 MiB and a memory limit of 1.5 GiB.
-->
这是一份包含一个容器的 Pod 的配置文件。这个容器的配置清单指定了 800 MiB 的内存请求和 1.5 GiB 的内存限制。

{% include code.html language="yaml" file="memory-constraints-pod-2.yaml" ghlink="/docs/tasks/administer-cluster/memory-constraints-pod-2.yaml" %}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because the Container specifies a memory limit that is
too large:
-->
输出显示 Pod 没有能够成功创建，因为容器指定的内存限制值太大：

```
Error from server (Forbidden): error when creating "docs/tasks/administer-cluster/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

<!--
## Attempt to create a Pod that does not meet the minimum memory request
-->
## 尝试创建一个不符合最小内存请求的 Pod

<!--
Here's the configuration file for a Pod that has one Container. The Container specifies a
memory request of 200 MiB and a memory limit of 800 MiB.
-->
这是一份包含一个容器的 Pod 的配置文件。这个容器的配置清单指定了 200 MiB 的内存请求和 800 MiB 的内存限制。

{% include code.html language="yaml" file="memory-constraints-pod-3.yaml" ghlink="/docs/tasks/administer-cluster/memory-constraints-pod-3.yaml" %}

<!--
Attempt to create the Pod:
-->
尝试创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because the Container specifies a memory
request that is too small:
-->
输出显示 Pod 没有能够成功创建，因为容器指定的内存请求值太小：

```
Error from server (Forbidden): error when creating "docs/tasks/administer-cluster/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

<!--
## Create a Pod that does not specify any memory request or limit
-->
## 创建一个没有指定任何内存请求和限制的 Pod


<!--
Here's the configuration file for a Pod that has one Container. The Container does not
specify a memory request, and it does not specify a memory limit.
-->
这是一份包含一个容器的 Pod 的配置文件。这个容器没有指定内存请求，也没有指定内存限制。

{% include code.html language="yaml" file="memory-constraints-pod-4.yaml" ghlink="/docs/tasks/administer-cluster/memory-constraints-pod-4.yaml" %}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

<!--
View detailed information about the Pod:
-->
查看关于 Pod 的细节信息：

```
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

<!--
The output shows that the Pod's Container has a memory request of 1 GiB and a memory limit of 1 GiB.
How did the Container get those values?
-->
输出显示 Pod 的容器具有 1 GiB 的内存请求和 1 GiB 的内存限制。容器是如何获取这些值的呢？

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
因为您的容器没有指定自己的内存请求和限制，它将从 LimitRange 获取 [默认的内存请求和限制值](/docs/tasks/administer-cluster/memory-default-namespace/)。

<!--
At this point, your Container might be running or it might not be running. Recall that a prerequisite
for this task is that your Nodes have at least 1 GiB of memory. If each of your Nodes has only
1 GiB of memory, then there is not enough allocatable memory on any Node to accommodate a memory
request of 1 GiB. If you happen to be using Nodes with 2 GiB of memory, then you probably have
enough space to accommodate the 1 GiB request.
-->
到目前为止，您的容器可能在运行，也可能没有运行。回想起来，有一个先决条件就是节点必须拥有至少 1 GiB 内存。如果每个节点都只有 1 GiB 内存，那么任何一个节点上都没有足够的内存来容纳 1 GiB 的内存请求。如果碰巧使用的节点拥有 2 GiB 内存，那么它可能会有足够的内存来容纳 1 GiB 的内存请求。

<!--
Delete your Pod:
-->
删除 Pod：

```
kubectl delete pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

<!--
## Enforcement of minimum and maximum memory constraints
-->
## 应用最小和最大内存限制

<!--
The maximum and minimum memory constraints imposed on a namespace by a LimitRange are enforced only
when a Pod is created or updated. If you change the LimitRange, it does not affect
Pods that were created previously.
-->
LimitRange 在 namespace 中施加的最小和最大内存限制只有在创建和更新 Pod 时才会被应用。改变 LimitRange 不会对之前创建的 Pod 造成影响。

<!--
## Motivation for minimum and maximum memory constraints
-->
## 最小和最大内存限制的动因

<!--
As a cluster administrator, you might want to impose restrictions on the amount of memory that Pods can use.
For example:
-->
作为一个集群管理员，您可能希望为 Pod 能够使用的内存数量施加限制。例如：

<!--
* Each Node in a cluster has 2 GB of memory. You do not want to accept any Pod that requests
more than 2 GB of memory, because no Node in the cluster can support the request.

* A cluster is shared by your production and development departments.
You want to allow production workloads to consume up to 8 GB of memory, but
you want development workloads to be limited to 512 MB. You create separate namespaces
for production and development, and you apply memory constraints to each namespace.
-->
* 集群中每个节点拥有 2 GB 内存。您不希望任何 Pod 请求超过 2 GB 的内存，因为集群中没有节点能支持这个请求。

* 集群被生产部门和开发部门共享。
您希望生产负载最多使用 8 GB 的内存而将开发负载限制为 512 MB。这种情况下，您可以为生产环境和开发环境创建单独的 namespace，并对每个 namespace 应用内存限制。

<!--
## Clean up
-->
## 清理

<!--
Delete your namespace:
-->
删除 namespace：

```shell
kubectl delete namespace constraints-mem-example
```

{% endcapture %}

{% capture whatsnext %}

<!--
### For cluster administrators
-->
### 对于集群管理员

<!--
* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

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
