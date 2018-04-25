<!-----
title: Configure a Pod Quota for a Namespace
----->
---
title: 为名字空间配置Pod配额
---

{% capture overview %}

This page shows how to set a quota for the total number of Pods that can run
in a namespace. You specify quotas in a
[ResourceQuota](/docs/api-reference/v1.7/#resourcequota-v1-core)
object.
本任务展示了如何为某一名字空间（namespace）设置Pod配额以限制可以在名字空间中运行的Pod数量。
配额通过[ResourceQuota](/docs/api-reference/v1.7/#resourcequota-v1-core)对象设置。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

<!--## Create a namespace-->
## 创建名字空间

<!--Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.-->
创建一个单独的名字空间，以便于隔离您在本练习中创建的资源与集群的其他资源。

```shell
kubectl create namespace quota-pod-example
```

<!--## Create a ResourceQuota-->
## 创建ResourceQuota对象

<!--Here is the configuration file for a ResourceQuota object:-->
以下展示了ResourceQuota对象的配置文件内容：

{% include code.html language="yaml" file="quota-pod.yaml" ghlink="/docs/tasks/administer-cluster/quota-pod.yaml" %}

<!--Create the ResourceQuota:-->
下面，首先创建ResourceQuota对象

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-pod.yaml --namespace=quota-pod-example
```

<!--View detailed information about the ResourceQuota:-->
然后可以通过以下命令查看ResourceQuota对象的详细信息：

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

<!--The output shows that the namespace has a quota of two Pods, and that currently there are
no Pods; that is, none of the quota is used.-->
命令输出显示了这个名字空间的Pod配额是2，由于目前没有Pod运行，所有配额并没有被使用。

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

<!--Here is the configuration file for a Deployment:-->
下面展示的是一个Deployment的配置文件：

{% include code.html language="yaml" file="quota-pod-deployment.yaml" ghlink="/docs/tasks/administer-cluster/quota-pod-deployment.yaml" %}

<!--In the configuration file, `replicas: 3` tells Kubernetes to attempt to create three Pods, all running the same application.-->
从配置文件可以看到，`replicas: 3`将令Kubernetes尝试创建3个Pod，所有的Pod实例都将运行同样的应用程序。

<!--Create the Deployment:-->
接下来尝试创建这个Deployment：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-pod-deployment.yaml --namespace=quota-pod-example
```

<!--View detailed information about the Deployment:-->
并通过以下命令查看Deployment的详细信息：

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

<!--The output shows that even though the Deployment specifies three replicas, only two
Pods were created because of the quota.-->
从命令输出可以看到尽管在Deployment中我们设置了需要启动3个Pod实例，但由于配额的存在，只有两个Pod被成功创建。

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

<!--## Clean up-->
## 练习环境的清理

<!--Delete your namespace:-->
通过删除名字空间即可完成环境的清理：

```shell
kubectl delete namespace quota-pod-example
```

{% endcapture %}

{% capture whatsnext %}

<!--### For cluster administrators-->
### 集群管理员可以参考的配置配额方面的文档

<!--* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/default-memory-request-limit/)-->
* [为名字空间配置默认的内存请求和限制](/docs/tasks/administer-cluster/default-memory-request-limit/)

<!--* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/default-cpu-request-limit/)-->
* [为名字空间配置默认的CPU请求和限制](/docs/tasks/administer-cluster/default-cpu-request-limit/)

<!--* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)-->
* [为名字空间配置最小和最大的内存约束](/docs/tasks/administer-cluster/memory-constraint-namespace/)

<!--* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)-->
* [为名字空间配置最小和最大的CPU约束](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

<!--* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)-->
* [为名字空间配置内存和CPU配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

<!--* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)-->
* [为API对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)

<!--### For app developers-->
### 应用开发者可以参考的配置配额方面的文档

<!--* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)-->
* [为容器和Pod分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

<!--* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)-->
* [为容器和Pod分配CPU资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)-->
* [为Pod配置服务质量要求（Quality of Service）](/docs/tasks/configure-pod-container/quality-service-pod/)

{% endcapture %}


{% include templates/task.md %}
