---
title: 配置 API 物件配額
content_type: task
---

<!--
title: Configure Quotas for API Objects
content_type: task
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
本文討論如何為 API 物件配置配額，包括 PersistentVolumeClaim 和 Service。
配額限制了可以在名稱空間中建立的特定型別物件的數量。
你可以在 [ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core) 物件中指定配額。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 建立名稱空間    {#create-a-namespace}

建立一個名稱空間以便本例中建立的資源和叢集中的其餘部分相隔離。

```shell
kubectl create namespace quota-object-example
```

<!--
## Create a ResourceQuota

Here is the configuration file for a ResourceQuota object:
-->
## 建立 ResourceQuota    {#create-a-resourcequota}

下面是一個 ResourceQuota 物件的配置檔案：

{{< codenew file="admin/resource/quota-objects.yaml" >}}

<!--
Create the ResourceQuota:
-->
建立 ResourceQuota：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects.yaml --namespace=quota-object-example
```

<!--
View detailed information about the ResourceQuota:
-->
檢視 ResourceQuota 的詳細資訊：

```shell
kubectl get resourcequota object-quota-demo --namespace=quota-object-example --output=yaml
```

<!--
The output shows that in the quota-object-example namespace, there can be at most
one PersistentVolumeClaim, at most two Services of type LoadBalancer, and no Services
of type NodePort.
-->
輸出結果表明在 quota-object-example 名稱空間中，至多隻能有一個 PersistentVolumeClaim，
最多兩個 LoadBalancer 型別的服務，不能有 NodePort 型別的服務。

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
## 建立 PersistentVolumeClaim    {#create-a-persistentvolumeclaim}

下面是一個 PersistentVolumeClaim 物件的配置檔案：

{{< codenew file="admin/resource/quota-objects-pvc.yaml" >}}

<!--
Create the PersistentVolumeClaim:
-->
建立 PersistentVolumeClaim：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc.yaml --namespace=quota-object-example
```

<!--
Verify that the PersistentVolumeClaim was created:
-->
確認已建立完 PersistentVolumeClaim：

```shell
kubectl get persistentvolumeclaims --namespace=quota-object-example
```

<!--
The output shows that the PersistentVolumeClaim exists and has status Pending:
-->
輸出資訊表明 PersistentVolumeClaim 存在並且處於 Pending 狀態：

```
NAME             STATUS
pvc-quota-demo   Pending
```

<!--
## Attempt to create a second PersistentVolumeClaim

Here is the configuration file for a second PersistentVolumeClaim:
-->
## 嘗試建立第二個 PersistentVolumeClaim    {#attempt-to-create-a-second-persistentvolumeclaim}

下面是第二個 PersistentVolumeClaim 的配置檔案：

{{< codenew file="admin/resource/quota-objects-pvc-2.yaml" >}}

<!--
Attempt to create the second PersistentVolumeClaim:
-->
嘗試建立第二個 PersistentVolumeClaim：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc-2.yaml --namespace=quota-object-example
```

<!--
The output shows that the second PersistentVolumeClaim was not created,
because it would have exceeded the quota for the namespace.
-->
輸出資訊表明第二個 PersistentVolumeClaim 沒有建立成功，因為這會超出名稱空間的配額。

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
## 說明    {#notes}

下面這些字串可被用來標識那些能被配額限制的 API 資源：

<table>
<!--
<tr><th>String</th><th>API Object</th></tr>
-->
<tr><th>字串</th><th>API 物件</th></tr>
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
<tr><td>"services.nodeports"</td><td>NodePort 型別的 Service</td></tr>
<!--
<tr><td>"services.loadbalancers"</td><td>Service of type LoadBalancer</td></tr>
-->
<tr><td>"services.loadbalancers"</td><td>LoadBalancer 型別的 Service</td></tr>
</table>

<!--
## Clean up

Delete your namespace:
-->
## 清理    {#clean-up}

刪除你的名稱空間：

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

### 叢集管理員參考    {#for-cluster-administrators}

* [為名稱空間配置預設的記憶體請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [為名稱空間配置預設的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [為名稱空間配置記憶體的最小和最大限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [為名稱空間配置 CPU 的最小和最大限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [為名稱空間配置 CPU 和記憶體配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [為名稱空間配置 Pod 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->

### 應用開發者參考    {#for-app-developers}

* [為容器和 Pod 分配記憶體資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [為容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [為 Pod 配置服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)

