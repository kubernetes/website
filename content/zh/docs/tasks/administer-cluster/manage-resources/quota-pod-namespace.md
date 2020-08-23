---
title: 配置命名空间下 Pod 配额
content_type: task
weight: 60
---

<!-- overview -->

<!--
This page shows how to set a quota for the total number of Pods that can run
in a namespace. You specify quotas in a
[ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
object.
-->
本文主要描述如何配置一个命名空间下可运行的 Pod 个数配额。
你可以使用
[ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
对象来配置配额。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建一个命名空间

首先创建一个命名空间，这样可以将本次操作中创建的资源与集群其他资源隔离开来。

```shell
kubectl create namespace quota-pod-example
```

<!--
## Create a ResourceQuota

Here is the configuration file for a ResourceQuota object:
-->
## 创建 ResourceQuota

下面是一个 ResourceQuota 的配置文件：

{{< codenew file="admin/resource/quota-pod.yaml" >}}

<!-- 创建 ResourceQuota: -->
创建这个 ResourceQuota：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod.yaml --namespace=quota-pod-example
```

<!--
View detailed information about the ResourceQuota:
-->
查看资源配额的详细信息：

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

<!--
The output shows that the namespace has a quota of two Pods, and that currently there are
no Pods; that is, none of the quota is used.
-->
从输出的信息我们可以看到，该命名空间下 Pod 的配额是 2 个，目前创建的 Pod 数为 0，
配额使用率为 0。

```yaml
spec:
  hard:
    pods: "2"
status:
  hard:
    pods: "2"
  used:
    pods: "0"
```

<!--
Here is the configuration file for a Deployment:
-->
下面是一个 Deployment 的配置文件：

{{< codenew file="admin/resource/quota-pod-deployment.yaml" >}}

<!--
In the configuration file, `replicas: 3` tells Kubernetes to attempt to create three Pods, all running the same application.

Create the Deployment:
-->
在配置文件中，`replicas: 3` 告诉 Kubernetes 尝试创建三个 Pods，且运行相同的应用。

创建这个 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod-deployment.yaml --namespace=quota-pod-example
```

<!--
View detailed information about the Deployment:
-->
查看 Deployment 的详细信息：

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

<!--
The output shows that even though the Deployment specifies three replicas, only two
Pods were created because of the quota.
-->
从输出的信息我们可以看到，尽管尝试创建三个 Pod，但是由于配额的限制，只有两个 Pod 能被成功创建。

```yaml
spec:
  ...
  replicas: 3
...
status:
  availableReplicas: 2
...
lastUpdateTime: 2017-07-07T20:57:05Z
    message: 'unable to create pods: pods "pod-quota-demo-1650323038-" is forbidden:
      exceeded quota: pod-demo, requested: pods=1, used: pods=2, limited: pods=2'
```

<!--
## Clean up

Delete your namespace:
-->
## 清理

删除命名空间：

```shell
kubectl delete namespace quota-pod-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
### 集群管理人员参考

* [为命名空间配置默认的内存请求和限制](/zh/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置默认的的 CPU 请求和限制](/zh/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [为命名空间配置内存的最小值和最大值约束](/zh/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为命名空间配置 CPU 的最小值和最大值约束](/zh/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为命名空间配置内存和 CPU 配额](/zh/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [为 API 对象的设置配额](/zh/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 应用开发人员参考

* [为容器和 Pod 分配内存资源](/zh/docs/tasks/configure-pod-container/assign-memory-resource/)
* [给容器和 Pod 分配 CPU 资源](/zh/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [配置 Pod 的服务质量](/zh/docs/tasks/configure-pod-container/quality-service-pod/)

