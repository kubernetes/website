---
title: 为命名空间配置 Pod 配额
content_template: templates/task
weight: 60
---

<!--
---
title: Configure a Pod Quota for a Namespace
content_template: templates/task
weight: 60
---
-->

{{% capture overview %}}

<!--
This page shows how to set a quota for the total number of Pods that can run
in a namespace. You specify quotas in a
[ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
object.
-->

本文介绍怎样给命名空间配置可以运行的 Pod 总数配额。你在 [ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)对象中可以进行声明。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->

## 创建命名空间

创建一个命名空间，以便本练习所创建的资源和集群的其余资源相隔离。

```shell
kubectl create namespace quota-pod-example
```

<!--
## Create a ResourceQuota

Here is the configuration file for a ResourceQuota object:
-->

## 创建一个 ResourceQuota

这里给出了一个 ResourceQuota 对象的配置文件：

{{< codenew file="admin/resource/quota-pod.yaml" >}}

<!--
Create the ResourceQuota:
-->

创建 ResourceQuota

```shell
kubectl create -f https://k8s.io/examples/admin/resource/quota-pod.yaml --namespace=quota-pod-example
```

<!--
View detailed information about the ResourceQuota:
-->

查看 ResourceQuota 详情：

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

<!--
The output shows that the namespace has a quota of two Pods, and that currently there are
no Pods; that is, none of the quota is used.
-->

输出结果显示该命名空间有两个 Pod 的配额，并且当前没有 Pod；也就是配额没有被使用。

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

这里给出了一个 Deployment 的配置文件：

{{< codenew file="admin/resource/quota-pod-deployment.yaml" >}}

<!--
In the configuration file, `replicas: 3` tells Kubernetes to attempt to create three Pods, all running the same application.

Create the Deployment:
-->

配置文件中，`replicas: 3` 使 Kubernetes 尝试创建3个 Pod，都运行相同的应用。

创建 Deployment：

```shell
kubectl create -f https://k8s.io/examples/admin/resource/quota-pod-deployment.yaml --namespace=quota-pod-example
```

<!--
View detailed information about the Deployment:
-->

查看 Deployment 详情：

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

<!--
The output shows that even though the Deployment specifies three replicas, only two
Pods were created because of the quota.
-->

输出结果显示尽管 Deployment 声明了三个副本，但由于配额的限制只创建了两个 Pod。

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

## 清理环境

删除你的命名空间：

```shell
kubectl delete namespace quota-pod-example
```

{{% /capture %}}

{{% capture whatsnext %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

### 集群管理员参考

* [为命名空间配置默认内存请求和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

* [为命名空间配置内存限制的最小值和最大值](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [为命名空间配置 CPU 限制的最小值和最大值](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为命名空间配置内存和 CPU 配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为命名空间配置 Pod 配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [为 API 对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->

### 应用开发者参考

* [为容器和 Pod 分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [为容器和 Pod 分配 CPU 资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [为 Pod 配置 Service 数量](/docs/tasks/configure-pod-container/quality-service-pod/)

{{% /capture %}}


