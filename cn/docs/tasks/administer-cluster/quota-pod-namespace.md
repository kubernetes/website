---
title: 配置命名空间下pod总数
---


{% capture overview %}

本文主要描述如何配置一个命名空间下可运行的pod总数。资源配额详细信息可查看：[资源配额](/docs/api-reference/v1.7/#resourcequota-v1-core)
。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## 创建一个命名空间

首先创建一个命名空间，这样可以将本次操作中创建的资源与集群其他资源隔离开来。

```shell
kubectl create namespace quota-pod-example
```

## 创建资源配额

下面是一个资源配额的配置文件：

{% include code.html language="yaml" file="quota-pod.yaml" ghlink="/docs/tasks/administer-cluster/quota-pod.yaml" %}

创建这个资源配额：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-pod.yaml --namespace=quota-pod-example
```

查看资源配额的详细信息：

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

从输出的信息我们可以看到，该命名空间下pod的配额是2个，目前创建的pods数为0，配额使用率为0。

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

下面是一个Deployment的配置文件：

{% include code.html language="yaml" file="quota-pod-deployment.yaml" ghlink="/docs/tasks/administer-cluster/quota-pod-deployment.yaml" %}

在配置文件中， `replicas: 3` 告诉kubernetes尝试创建三个pods，且运行相同的应用。

创建这个Deployment：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-pod-deployment.yaml --namespace=quota-pod-example
```

查看Deployment的详细信息：

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

从输出的信息我们可以看到，尽管尝试创建三个pod，但是由于配额的限制，只有两个pod能被成功创建。

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

## 清理

删除命名空间：

```shell
kubectl delete namespace quota-pod-example
```

{% endcapture %}

{% capture whatsnext %}

### 对于集群管理

* [配置命名空间下，内存默认的request值和limit值](/docs/tasks/administer-cluster/memory-default-namespace/)

* [配置命名空间下，CPU默认的request值和limit值](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [配置命名空间下，内存的最小值和最大值](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [配置命名空间下，CPU的最小值和最大值](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [配置命名空间下，内存和CPU的配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [配置命名空间下，API对象的配额](/docs/tasks/administer-cluster/quota-api-object/)

### 对于应用开发

* [给容器和pod分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [给容器和pod分配CPU资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [配置pod的QoS](/docs/tasks/configure-pod-container/quality-service-pod/)

{% endcapture %}


{% include templates/task.md %}


