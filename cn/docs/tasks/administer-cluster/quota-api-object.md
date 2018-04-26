---
title: 配置API对象（API Object）的配额（Quota）
---


{% capture overview %}

<!--This page shows how to configure quotas for API objects, including
PersistentVolumeClaims and Services. A quota restricts the number of
objects, of a particular type, that can be created in a namespace.
You specify quotas in a
[ResourceQuota](/docs/api-reference/v1.7/#resourcequota-v1-core)
object.-->
本任务将展示如何配置API对象的配额，包括对Kubernetes PersistentVolumeClaim对象
和Service对象的配额配置。配额限制了可以在某一名字空间（namespace）中所创建的特定类型的对象
的数量。可以通过[ResourceQuota](/docs/api-reference/v1.7/#resourcequota-v1-core)
对象设定配额。

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
kubectl create namespace quota-object-example
```

<!--## Create a ResourceQuota-->
## 创建ResourceQuota对象

<!--Here is the configuration file for a ResourceQuota object:-->
以下展示了ResourceQuota对象的配置文件内容：

{% include code.html language="yaml" file="quota-objects.yaml" ghlink="/docs/tasks/administer-cluster/quota-objects.yaml" %}

<!--Create the ResourceQuota:-->
下面，首先创建ResourceQuota对象：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-objects.yaml --namespace=quota-object-example
```

<!--View detailed information about the ResourceQuota:-->
然后可以通过以下命令查看ResourceQuota对象的详细信息：

```shell
kubectl get resourcequota object-quota-demo --namespace=quota-object-example --output=yaml
```

<!--The output shows that in the quota-object-example namespace, there can be at most
one PersistentVolumeClaim, at most two Services of type LoadBalancer, and no Services
of type NodePort. -->
上述命令的输出显示在quota-object-example名字空间中，最多可以创建一个PersistentVolumeClaim以及两个
LoadBalancer类型的Service，不能创建NodePort类型的Service。

```yaml
status:
  hard:
    persistentvolumeclaims: "1"
    services.loadbalancers: "2"
    services.nodeports: "0"
  used:
    persistentvolumeclaims: "0"
    services.loadbalancers: "0"
    services.nodeports: "0"
```

<!--## Create a PersistentVolumeClaim:-->
## 创建一个PersistentVolumeClaim：

<!--Here is the configuration file for a PersistentVolumeClaim object:-->
下面展示了一个PersistentVolumeClaim对象的配置文件内容：

{% include code.html language="yaml" file="quota-objects-pvc.yaml" ghlink="/docs/tasks/administer-cluster/quota-objects-pvc.yaml" %}

<!--Create the PersistentVolumeClaim:-->
创建这个PersistentVolumeClaim:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-objects-pvc.yaml --namespace=quota-object-example
```

<!--Verify that the PersistentVolumeClaim was created:-->
接下来验证这个PersistentVolumeClaim已经被成功创建：

```shell
kubectl get persistentvolumeclaims --namespace=quota-object-example
```

<!--The output shows that the PersistentVolumeClaim exists and has status Pending:-->
上述命令的输出显示这个PersistentVolumeClaim已经存在在系统中并处于Pending状态：

```shell
NAME             STATUS
pvc-quota-demo   Pending
```

<!--## Attempt to create a second PersistentVolumeClaim:-->
## 尝试创建第二个PersistentVolumeClaim：

<!--Here is the configuration file for a second PersistentVolumeClaim:-->
第二个PersistentVolumeClaim的配置文件如下所示：

{% include code.html language="yaml" file="quota-objects-pvc-2.yaml" ghlink="/docs/tasks/administer-cluster/quota-objects-pvc-2.yaml" %}

<!--Attempt to create the second PersistentVolumeClaim:-->
尝试创建第二个PersistentVolumeClaim：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-objects-pvc-2.yaml --namespace=quota-object-example
```

<!--The output shows that the second PersistentVolumeClaim was not created,
because it would have exceeded the quota for the namespace.-->
以上命令的输出中可以看到第二个PersistentVolumeClaim没有被创建，因为如果创建
第二个PersistentVolumeClaim对象将违反名字空间中的配额限制。

```
persistentvolumeclaims "pvc-quota-demo-2" is forbidden:
exceeded quota: object-quota-demo, requested: persistentvolumeclaims=1,
used: persistentvolumeclaims=1, limited: persistentvolumeclaims=1
```

<!--## Notes-->
## 注意

<!--These are the strings used to identify API resources that can be constrained
by quotas:-->
以下字符串用于标记可以由配额限制的API资源：

<!--<table>
<tr><th>String</th><th>API Object</th></tr>
<tr><td>"pods"</td><td>Pod</td></tr>
<tr><td>"services</td><td>Service</td></tr>
<tr><td>"replicationcontrollers"</td><td>ReplicationController</td></tr>
<tr><td>"resourcequotas"</td><td>ResourceQuota</td></tr>
<tr><td>"secrets"</td><td>Secret</td></tr>
<tr><td>"configmaps"</td><td>ConfigMap</td></tr>
<tr><td>"persistentvolumeclaims"</td><td>PersistentVolumeClaim</td></tr>
<tr><td>"services.nodeports"</td><td>Service of type NodePort</td></tr>
<tr><td>"services.loadbalancers"</td><td>Service of type LoadBalancer</td></tr>
</table>-->
<table>
<tr><th>字符串</th><th>API对象</th></tr>
<tr><td>"pods"</td><td>Pod</td></tr>
<tr><td>"services</td><td>Service</td></tr>
<tr><td>"replicationcontrollers"</td><td>ReplicationController</td></tr>
<tr><td>"resourcequotas"</td><td>ResourceQuota</td></tr>
<tr><td>"secrets"</td><td>Secret</td></tr>
<tr><td>"configmaps"</td><td>ConfigMap</td></tr>
<tr><td>"persistentvolumeclaims"</td><td>PersistentVolumeClaim</td></tr>
<tr><td>"services.nodeports"</td><td>NodePort类型的Service</td></tr>
<tr><td>"services.loadbalancers"</td><td>LoadBalancer类型的Service</td></tr>
</table>

<!--## Clean up-->
## 环境清理

<!--Delete your namespace:-->
删除在本练习中创建的名字空间即可完成环境清理：

```shell
kubectl delete namespace quota-object-example
```

{% endcapture %}

{% capture whatsnext %}

<!--### For cluster administrators-->
### 集群管理员可以参考的配置配额方面的文档

<!--* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)-->
* [为名字空间配置默认的内存请求和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

<!--* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)-->
* [为名字空间配置默认的CPU请求和限制](/docs/tasks/administer-cluster/cpu-default-namespace/)

<!--* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)-->
* [为名字空间配置最小和最大的内存约束](/docs/tasks/administer-cluster/memory-constraint-namespace/)

<!--* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)-->
* [为名字空间配置最小和最大的CPU约束](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

<!--* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)-->
* [为名字空间配置内存和CPU配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

<!--* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)-->
* [为名字空间配置Pod配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

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
