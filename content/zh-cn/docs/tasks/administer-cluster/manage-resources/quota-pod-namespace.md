---
title: 配置命名空间下 Pod 配额
content_type: task
weight: 60
description: >-
  限制在命名空间中创建的 Pod 数量。
---

<!--
title: Configure a Pod Quota for a Namespace
content_type: task
weight: 60
description: >-
  Restrict how many Pods you can create within a namespace.
-->

<!-- overview -->

<!--
This page shows how to set a quota for the total number of Pods that can run
in a {{< glossary_tooltip text="Namespace" term_id="namespace" >}}. You specify quotas in a
[ResourceQuota](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
object.
-->
本文主要介绍如何在{{< glossary_tooltip text="命名空间" term_id="namespace" >}}中设置可运行 Pod 总数的配额。
你可以通过使用
[ResourceQuota](/zh-cn/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
对象来配置配额。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.
-->
在你的集群里你必须要有创建命名空间的权限。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建一个命名空间  {#create-a-namespace}

首先创建一个命名空间，这样可以将本次操作中创建的资源与集群其他资源隔离开来。

```shell
kubectl create namespace quota-pod-example
```

<!--
## Create a ResourceQuota

Here is an example manifest for a ResourceQuota:
-->
## 创建 ResourceQuota {#create-a-resourcequota}

下面是 ResourceQuota 的示例清单：

{{% code_sample file="admin/resource/quota-pod.yaml" %}}

<!--
Create the ResourceQuota:
-->
创建 ResourceQuota：

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
Here is an example manifest for a {{< glossary_tooltip term_id="deployment" >}}:
-->
下面是一个 {{< glossary_tooltip term_id="deployment" >}} 的示例清单：

{{% code_sample file="admin/resource/quota-pod-deployment.yaml" %}}

<!--
In that manifest, `replicas: 3` tells Kubernetes to attempt to create three new Pods, all
running the same application.

Create the Deployment:
-->
在清单中，`replicas: 3` 告诉 Kubernetes 尝试创建三个新的 Pod，
且运行相同的应用。

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
Pods were created because of the quota you defined earlier:
-->
从输出的信息显示，即使 Deployment 指定了三个副本，
也只有两个 Pod 被创建，原因是之前已经定义了配额：

```yaml
spec:
  ...
  replicas: 3
...
status:
  availableReplicas: 2
...
lastUpdateTime: 2021-04-02T20:57:05Z
    message: 'unable to create pods: pods "pod-quota-demo-1650323038-" is forbidden:
      exceeded quota: pod-demo, requested: pods=1, used: pods=2, limited: pods=2'
```

<!--
### Choice of resource

In this task you have defined a ResourceQuota that limited the total number of Pods, but
you could also limit the total number of other kinds of object. For example, you
might decide to limit how many {{< glossary_tooltip text="CronJobs" term_id="cronjob" >}}
that can live in a single namespace.
-->
### 资源的选择  {#choice-of-resource}
在此任务中，你定义了一个限制 Pod 总数的 ResourceQuota，
你也可以限制其他类型对象的总数。
例如，你可以限制在一个命名空间中可以创建的 {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} 的数量。

<!--
## Clean up

Delete your namespace:
-->
## 清理 {#clean-up}

删除你的命名空间：

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
### 集群管理人员参考 {#for-cluster-administrators}

* [为命名空间配置默认的内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置默认的 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [为命名空间配置内存的最小值和最大值约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为命名空间配置 CPU 的最小值和最大值约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为命名空间配置内存和 CPU 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [为 API 对象的设置配额](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 应用开发人员参考 {#for-app-developers}

* [为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [给容器和 Pod 分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [配置 Pod 的服务质量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
