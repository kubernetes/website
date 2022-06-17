---
title: 配置 Pod 的服務質量
content_type: task
weight: 30
---

<!--
title: Configure Quality of Service for Pods
content_type: task
weight: 30
-->

<!-- overview -->

<!--
This page shows how to configure Pods so that they will be assigned particular
Quality of Service (QoS) classes. Kubernetes uses QoS classes to make decisions about
scheduling and evicting Pods.
-->
本頁介紹怎樣配置 Pod 讓其獲得特定的服務質量（QoS）類。Kubernetes 使用 QoS 類來決定 Pod 的排程和驅逐策略。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## QoS classes

When Kubernetes creates a Pod it assigns one of these QoS classes to the Pod:
-->
## QoS 類  {#qos-classes}

Kubernetes 建立 Pod 時就給它指定了下列一種 QoS 類：

* Guaranteed
* Burstable
* BestEffort

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->

## 建立名稱空間

建立一個名稱空間，以便將本練習所建立的資源與叢集的其餘資源相隔離。

```shell
kubectl create namespace qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of Guaranteed

For a Pod to be given a QoS class of Guaranteed:

* Every Container in the Pod must have a memory limit and a memory request.
* For every Container in the Pod, the memory limit must equal the memory request.
* Every Container in the Pod must have a CPU limit and a CPU request.
* For every Container in the Pod, the CPU limit must equal the CPU request.

These restrictions apply to init containers and app containers equally.

Here is the configuration file for a Pod that has one Container. The Container has a memory limit and a
memory request, both equal to 200 MiB. The Container has a CPU limit and a CPU request, both equal to 700 milliCPU:
-->
## 建立一個 QoS 類為 Guaranteed 的 Pod

對於 QoS 類為 Guaranteed 的 Pod：

* Pod 中的每個容器都必須指定記憶體限制和記憶體請求。
* 對於 Pod 中的每個容器，記憶體限制必須等於記憶體請求。
* Pod 中的每個容器都必須指定 CPU 限制和 CPU 請求。
* 對於 Pod 中的每個容器，CPU 限制必須等於 CPU 請求。

這些限制同樣適用於初始化容器和應用程式容器。

下面是包含一個容器的 Pod 配置檔案。
容器設定了記憶體請求和記憶體限制，值都是 200 MiB。
容器設定了 CPU 請求和 CPU 限制，值都是 700 milliCPU：

{{< codenew file="pods/qos/qos-pod.yaml" >}}

<!--
Create the Pod:
-->

建立 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->

檢視 Pod 詳情：

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of Guaranteed. The output also
verifies that the Pod Container has a memory request that matches its memory limit, and it has
a CPU request that matches its CPU limit.
-->

結果表明 Kubernetes 為 Pod 配置的 QoS 類為 Guaranteed。
結果也確認了 Pod 容器設定了與記憶體限制匹配的記憶體請求，設定了與 CPU 限制匹配的 CPU 請求。

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
  ...
status:
  qosClass: Guaranteed
```

{{< note >}}
<!--
If a Container specifies its own memory limit, but does not specify a memory request, Kubernetes
automatically assigns a memory request that matches the limit. Similarly, if a Container specifies its own
CPU limit, but does not specify a CPU request, Kubernetes automatically assigns a CPU request that matches
the limit.
-->
如果容器指定了自己的記憶體限制，但沒有指定記憶體請求，Kubernetes 會自動為它指定與記憶體限制匹配的記憶體請求。
同樣，如果容器指定了自己的 CPU 限制，但沒有指定 CPU 請求，Kubernetes 會自動為它指定與 CPU 限制匹配的 CPU 請求。
{{< /note >}}

<!--
Delete your Pod:
-->

刪除 Pod：

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of Burstable

A Pod is given a QoS class of Burstable if:

* The Pod does not meet the criteria for QoS class Guaranteed.
* At least one Container in the Pod has a memory or CPU request or limit.

Here is the configuration file for a Pod that has one Container. The Container has a memory limit of 200 MiB
and a memory request of 100 MiB.
-->
## 建立一個 QoS 類為 Burstable 的 Pod

如果滿足下麵條件，將會指定 Pod 的 QoS 類為 Burstable：

* Pod 不符合 Guaranteed QoS 類的標準。
* Pod 中至少一個容器具有記憶體或 CPU 的請求或限制。

下面是包含一個容器的 Pod 配置檔案。
容器設定了記憶體限制 200 MiB 和記憶體請求 100 MiB。

{{< codenew file="pods/qos/qos-pod-2.yaml" >}}

<!--
Create the Pod:
-->

建立 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->

檢視 Pod 詳情：

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of Burstable.
-->

結果表明 Kubernetes 為 Pod 配置的 QoS 類為 Burstable。

```yaml
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
  ...
status:
  qosClass: Burstable
```

<!--
Delete your Pod:
-->
刪除 Pod：

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of BestEffort

For a Pod to be given a QoS class of BestEffort, the Containers in the Pod must not
have any memory or CPU limits or requests.

Here is the configuration file for a Pod that has one Container. The Container has no memory or CPU
limits or requests:
-->
## 建立一個 QoS 類為 BestEffort 的 Pod

對於 QoS 類為 BestEffort 的 Pod，Pod 中的容器必須沒有設定記憶體和 CPU 限制或請求。

下面是包含一個容器的 Pod 配置檔案。
容器沒有設定記憶體和 CPU 限制或請求。

{{< codenew file="pods/qos/qos-pod-3.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->
檢視 Pod 詳情：

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of BestEffort.
-->
結果表明 Kubernetes 為 Pod 配置的 QoS 類為 BestEffort。

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
status:
  qosClass: BestEffort
```

<!--
Delete your Pod:
-->
刪除 Pod：

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

<!--
## Create a Pod that has two Containers

Here is the configuration file for a Pod that has two Containers. One container specifies a memory
request of 200 MiB. The other Container does not specify any requests or limits.
-->
## 建立包含兩個容器的 Pod

下面是包含兩個容器的 Pod 配置檔案。
一個容器指定了記憶體請求 200 MiB。
另外一個容器沒有指定任何請求和限制。

{{< codenew file="pods/qos/qos-pod-4.yaml" >}}

<!--
Notice that this Pod meets the criteria for QoS class Burstable. That is, it does not meet the
criteria for QoS class Guaranteed, and one of its Containers has a memory request.

Create the Pod:
-->
注意此 Pod 滿足 Burstable QoS 類的標準。
也就是說它不滿足 Guaranteed QoS 類標準，因為它的一個容器設有記憶體請求。

建立 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->
檢視 Pod 詳情：

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of Burstable:
-->
結果表明 Kubernetes 為 Pod 配置的 QoS 類為 Burstable：

```yaml
spec:
  containers:
    ...
    name: qos-demo-4-ctr-1
    resources:
      requests:
        memory: 200Mi
    ...
    name: qos-demo-4-ctr-2
    resources: {}
    ...
status:
  qosClass: Burstable
```

<!--
Delete your Pod:
-->
刪除 Pod：

```shell
kubectl delete pod qos-demo-4 --namespace=qos-example
```

<!--
## Clean up

Delete your namespace:
-->
## 環境清理

刪除名稱空間：

```shell
kubectl delete namespace qos-example
```

## {{% heading "whatsnext" %}}

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
-->
### 應用開發者參考

* [為 Pod 和容器分配記憶體資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)

* [為 Pod 和容器分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

* [Control Topology Management policies on a node](/docs/tasks/administer-cluster/topology-manager/)
-->

### 叢集管理員參考

* [為名稱空間配置預設的記憶體請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [為名稱空間配置預設的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace)

* [為名稱空間配置最小和最大記憶體限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [為名稱空間配置最小和最大 CPU 限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [為名稱空間配置記憶體和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [為名稱空間配置 Pod 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [為 API 物件配置配額](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)

* [控制節點上的拓撲管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)



