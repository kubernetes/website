---
title: 为命名空间配置内存和 CPU 配额
content_type: task
weight: 50
---

<!--
title: Configure Memory and CPU Quotas for a Namespace
content_type: task
weight: 50
-->

<!-- overview -->

<!--
This page shows how to set quotas for the total amount memory and CPU that
can be used by all Containers running in a namespace. You specify quotas in a
[ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
object.
-->
本文介绍怎样为命名空间设置容器可用的内存和 CPU 总量。你可以通过
[ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
对象设置配额.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Each node in your cluster must have at least 1 GiB of memory.
-->
集群中每个节点至少有 1 GiB 的内存。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->

## 创建命名空间

创建一个命名空间，以便本练习中创建的资源和集群的其余部分相隔离。

```shell
kubectl create namespace quota-mem-cpu-example
```

<!--
## Create a ResourceQuota

Here is the configuration file for a ResourceQuota object:
-->
## 创建 ResourceQuota

这里给出一个 ResourceQuota 对象的配置文件：

{{< codenew file="admin/resource/quota-mem-cpu.yaml" >}}

<!--
Create the ResourceQuota:
-->
创建 ResourceQuota

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu.yaml --namespace=quota-mem-cpu-example
```

<!--
View detailed information about the ResourceQuota:
-->
查看 ResourceQuota 详情：

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

<!--
The ResourceQuota places these requirements on the quota-mem-cpu-example namespace:

* Every Container must have a memory request, memory limit, cpu request, and cpu limit.
* The memory request total for all Containers must not exceed 1 GiB.
* The memory limit total for all Containers must not exceed 2 GiB.
* The CPU request total for all Containers must not exceed 1 cpu.
* The CPU limit total for all Containers must not exceed 2 cpu.
-->
ResourceQuota 在 quota-mem-cpu-example 命名空间中设置了如下要求：

* 每个容器必须有内存请求和限制，以及 CPU 请求和限制。
* 所有容器的内存请求总和不能超过1 GiB。
* 所有容器的内存限制总和不能超过2 GiB。
* 所有容器的 CPU 请求总和不能超过1 cpu。
* 所有容器的 CPU 限制总和不能超过2 cpu。

<!--
## Create a Pod

Here is the configuration file for a Pod:
-->
## 创建 Pod

这里给出 Pod 的配置文件：

{{< codenew file="admin/resource/quota-mem-cpu-pod.yaml" >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod.yaml --namespace=quota-mem-cpu-example
```

<!--
Verify that the Pod's Container is running:
-->
检查下 Pod 中的容器在运行：

```
kubectl get pod quota-mem-cpu-demo --namespace=quota-mem-cpu-example
```

<!--
Once again, view detailed information about the ResourceQuota:
-->
再查看 ResourceQuota 的详情：

```
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

<!--
The output shows the quota along with how much of the quota has been used.
You can see that the memory and CPU requests and limits for your Pod do not
exceed the quota.
-->
输出结果显示了配额以及有多少配额已经被使用。你可以看到 Pod 的内存和 CPU 请求值及限制值没有超过配额。

```
status:
  hard:
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.cpu: "1"
    requests.memory: 1Gi
  used:
    limits.cpu: 800m
    limits.memory: 800Mi
    requests.cpu: 400m
    requests.memory: 600Mi
```

<!--
## Attempt to create a second Pod

Here is the configuration file for a second Pod:
-->
## 尝试创建第二个 Pod

这里给出了第二个 Pod 的配置文件：

{{< codenew file="admin/resource/quota-mem-cpu-pod-2.yaml" >}}

<!--
In the configuration file, you can see that the Pod has a memory request of 700 MiB.
Notice that the sum of the used memory request and this new memory
request exceeds the memory request quota. 600 MiB + 700 MiB > 1 GiB.

Attempt to create the Pod:
-->

配置文件中，你可以看到 Pod 的内存请求为 700 MiB。
请注意新的内存请求与已经使用的内存请求只和超过了内存请求的配额。
600 MiB + 700 MiB > 1 GiB。

尝试创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod-2.yaml --namespace=quota-mem-cpu-example
```

<!--
The second Pod does not get created. The output shows that creating the second Pod
would cause the memory request total to exceed the memory request quota.
-->
第二个 Pod 不能被创建成功。输出结果显示创建第二个 Pod 会导致内存请求总量超过内存请求配额。

```
Error from server (Forbidden): error when creating "examples/admin/resource/quota-mem-cpu-pod-2.yaml":
pods "quota-mem-cpu-demo-2" is forbidden: exceeded quota: mem-cpu-demo,
requested: requests.memory=700Mi,used: requests.memory=600Mi, limited: requests.memory=1Gi
```

<!--
## Discussion

As you have seen in this exercise, you can use a ResourceQuota to restrict
the memory request total for all Containers running in a namespace.
You can also restrict the totals for memory limit, cpu request, and cpu limit.

If you want to restrict individual Containers, instead of totals for all Containers, use a
[LimitRange](/docs/tasks/administer-cluster/memory-constraint-namespace/).
-->
## 讨论

如你在本练习中所见，你可以用 ResourceQuota 限制命名空间中所有容器的内存请求总量。
同样你也可以限制内存限制总量、CPU 请求总量、CPU 限制总量。

如果你想对单个容器而不是所有容器进行限制，就请使用
[LimitRange](/zh/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)。

<!--
## Clean up

Delete your namespace:
-->
## 清理

删除你的命名空间：

```shell
kubectl delete namespace quota-mem-cpu-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)
* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)
* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)
* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)
* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

### 集群管理员参考

* [为命名空间配置默认内存请求和限制](/zh/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置内存限制的最小值和最大值](/zh/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为命名空间配置 CPU 限制的最小值和最大值](/zh/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为命名空间配置内存和 CPU 配额](/zh/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [为命名空间配置 Pod 配额](/zh/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [为 API 对象配置配额](/zh/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 应用开发者参考

* [为容器和 Pod 分配内存资源](/zh/docs/tasks/configure-pod-container/assign-memory-resource/)
* [为容器和 Pod 分配CPU资源](/zh/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [为 Pod 配置服务质量](/zh/docs/tasks/configure-pod-container/quality-service-pod/)

