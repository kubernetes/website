---
title: 配置 API 对象配额
content_type: task
weight: 130
---

<!--
title: Configure Quotas for API Objects
content_type: task
weight: 130
-->

<!-- overview -->

<!--
This page shows how to configure quotas for API objects, including
PersistentVolumeClaims and Services. A quota restricts the number of
objects, of a particular type, that can be created in a namespace.
You specify quotas in a
[ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
object.
-->
本文讨论如何为 API 对象配置配额，包括 PersistentVolumeClaim 和 Service。
配额限制了可以在命名空间中创建的特定类型对象的数量。
你可以在 [ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
对象中指定配额。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建命名空间    {#create-a-namespace}

创建一个命名空间以便本例中创建的资源和集群中的其余部分相隔离。

```shell
kubectl create namespace quota-object-example
```

<!--
## Create a ResourceQuota

Here is the configuration file for a ResourceQuota object:
-->
## 创建 ResourceQuota    {#create-a-resourcequota}

下面是一个 ResourceQuota 对象的配置文件：

{{% code_sample file="admin/resource/quota-objects.yaml" %}}

<!--
Create the ResourceQuota:
-->
创建 ResourceQuota：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects.yaml --namespace=quota-object-example
```

<!--
View detailed information about the ResourceQuota:
-->
查看 ResourceQuota 的详细信息：

```shell
kubectl get resourcequota object-quota-demo --namespace=quota-object-example --output=yaml
```

<!--
The output shows that in the quota-object-example namespace, there can be at most
one PersistentVolumeClaim, at most two Services of type LoadBalancer, and no Services
of type NodePort.
-->
输出结果表明在 quota-object-example 命名空间中，至多只能有一个 PersistentVolumeClaim，
最多两个 LoadBalancer 类型的服务，不能有 NodePort 类型的服务。

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

<!--
## Create a PersistentVolumeClaim

Here is the configuration file for a PersistentVolumeClaim object:
-->
## 创建 PersistentVolumeClaim    {#create-a-persistentvolumeclaim}

下面是一个 PersistentVolumeClaim 对象的配置文件：

{{% code_sample file="admin/resource/quota-objects-pvc.yaml" %}}

<!--
Create the PersistentVolumeClaim:
-->
创建 PersistentVolumeClaim：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc.yaml --namespace=quota-object-example
```

<!--
Verify that the PersistentVolumeClaim was created:
-->
确认已创建完 PersistentVolumeClaim：

```shell
kubectl get persistentvolumeclaims --namespace=quota-object-example
```

<!--
The output shows that the PersistentVolumeClaim exists and has status Pending:
-->
输出信息表明 PersistentVolumeClaim 存在并且处于 Pending 状态：

```
NAME             STATUS
pvc-quota-demo   Pending
```

<!--
## Attempt to create a second PersistentVolumeClaim

Here is the configuration file for a second PersistentVolumeClaim:
-->
## 尝试创建第二个 PersistentVolumeClaim    {#attempt-to-create-a-second-persistentvolumeclaim}

下面是第二个 PersistentVolumeClaim 的配置文件：

{{% code_sample file="admin/resource/quota-objects-pvc-2.yaml" %}}

<!--
Attempt to create the second PersistentVolumeClaim:
-->
尝试创建第二个 PersistentVolumeClaim：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc-2.yaml --namespace=quota-object-example
```

<!--
The output shows that the second PersistentVolumeClaim was not created,
because it would have exceeded the quota for the namespace.
-->
输出信息表明第二个 PersistentVolumeClaim 没有创建成功，因为这会超出命名空间的配额。

```
persistentvolumeclaims "pvc-quota-demo-2" is forbidden:
exceeded quota: object-quota-demo, requested: persistentvolumeclaims=1,
used: persistentvolumeclaims=1, limited: persistentvolumeclaims=1
```

<!--
## Notes

These are the strings used to identify API resources that can be constrained
by quotas:
-->
## 说明    {#notes}

下面这些字符串可被用来标识那些能被配额限制的 API 资源：

<table>
<!--
<tr><th>String</th><th>API Object</th></tr>
-->
<tr><th>字符串</th><th>API 对象</th></tr>
<tr><td>"pods"</td><td>Pod</td></tr>
<tr><td>"services"</td><td>Service</td></tr>
<tr><td>"replicationcontrollers"</td><td>ReplicationController</td></tr>
<tr><td>"resourcequotas"</td><td>ResourceQuota</td></tr>
<tr><td>"secrets"</td><td>Secret</td></tr>
<tr><td>"configmaps"</td><td>ConfigMap</td></tr>
<tr><td>"persistentvolumeclaims"</td><td>PersistentVolumeClaim</td></tr>
<!--
<tr><td>"services.nodeports"</td><td>Service of type NodePort</td></tr>
-->
<tr><td>"services.nodeports"</td><td>NodePort 类型的 Service</td></tr>
<!--
<tr><td>"services.loadbalancers"</td><td>Service of type LoadBalancer</td></tr>
-->
<tr><td>"services.loadbalancers"</td><td>LoadBalancer 类型的 Service</td></tr>
</table>

<!--
## Clean up

Delete your namespace:
-->
## 清理    {#clean-up}

删除你的命名空间：

```shell
kubectl delete namespace quota-object-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
-->

### 集群管理员参考    {#for-cluster-administrators}

* [为命名空间配置默认的内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置默认的 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [为命名空间配置内存的最小和最大限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为命名空间配置 CPU 的最小和最大限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为命名空间配置 CPU 和内存配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [为命名空间配置 Pod 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->

### 应用开发者参考    {#for-app-developers}

* [为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [为容器和 Pod 分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [为 Pod 配置服务质量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
