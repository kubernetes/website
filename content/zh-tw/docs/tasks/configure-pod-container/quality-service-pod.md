---
title: 設定 Pod 的服務質量
content_type: task
weight: 60
---

<!--
title: Configure Quality of Service for Pods
content_type: task
weight: 60
-->

<!-- overview -->

<!--
This page shows how to configure Pods so that they will be assigned particular
{{< glossary_tooltip text="Quality of Service (QoS) classes" term_id="qos-class" >}}.
Kubernetes uses QoS classes to make decisions about evicting Pods when Node resources are exceeded.
-->
本頁介紹怎樣設定 Pod 以讓其歸屬於特定的
{{< glossary_tooltip text="服務質量類（Quality of Service class，QoS class）" term_id="qos-class" >}}.
Kubernetes 在 Node 資源不足時使用 QoS 類來就驅逐 Pod 作出決定。

<!--
When Kubernetes creates a Pod it assigns one of these QoS classes to the Pod:

* [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed)
* [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable)
* [BestEffort](/docs/concepts/workloads/pods/pod-qos/#besteffort)
-->
Kubernetes 創建 Pod 時，會將如下 QoS 類之一設置到 Pod 上：

* [Guaranteed](/zh-cn/docs/concepts/workloads/pods/pod-qos/#guaranteed)
* [Burstable](/zh-cn/docs/concepts/workloads/pods/pod-qos/#burstable)
* [BestEffort](/zh-cn/docs/concepts/workloads/pods/pod-qos/#besteffort)

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You also need to be able to create and delete namespaces.
-->
你還需要能夠創建和刪除名字空間。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 創建名字空間  {#create-a-namespace}

創建一個名字空間，以便將本練習所創建的資源與叢集的其餘資源相隔離。

```shell
kubectl create namespace qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of Guaranteed

For a Pod to be given a QoS class of `Guaranteed`:

* Every Container in the Pod must have a memory limit and a memory request.
* For every Container in the Pod, the memory limit must equal the memory request.
* Every Container in the Pod must have a CPU limit and a CPU request.
* For every Container in the Pod, the CPU limit must equal the CPU request.

-->
## 創建一個 QoS 類爲 Guaranteed 的 Pod  {#create-a-pod-that-gets-assigned-a-qos-class-of-guaranteed}

對於 QoS 類爲 `Guaranteed` 的 Pod：

* Pod 中的每個容器都必須指定內存限制和內存請求。
* 對於 Pod 中的每個容器，內存限制必須等於內存請求。
* Pod 中的每個容器都必須指定 CPU 限制和 CPU 請求。
* 對於 Pod 中的每個容器，CPU 限制必須等於 CPU 請求。

<!--
These restrictions apply to init containers and app containers equally.
[Ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/)
cannot define resources so these restrictions do not apply.

Here is a manifest for a Pod that has one Container. The Container has a memory limit and a
memory request, both equal to 200 MiB. The Container has a CPU limit and a CPU request, both equal to 700 milliCPU:
-->

這些限制同樣適用於初始化容器和應用程序容器。
[臨時容器（Ephemeral Container）](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)
無法定義資源，因此不受這些約束限制。

下面是包含一個 Container 的 Pod 清單。該 Container 設置了內存請求和內存限制，值都是 200 MiB。
該 Container 設置了 CPU 請求和 CPU 限制，值都是 700 milliCPU：

{{% code_sample file="pods/qos/qos-pod.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 詳情：

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of `Guaranteed`. The output also
verifies that the Pod Container has a memory request that matches its memory limit, and it has
a CPU request that matches its CPU limit.
-->
結果表明 Kubernetes 爲 Pod 設定的 QoS 類爲 `Guaranteed`。
結果也確認了 Pod 容器設置了與內存限制匹配的內存請求，設置了與 CPU 限制匹配的 CPU 請求。

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
如果某 Container 指定了自己的內存限制，但沒有指定內存請求，Kubernetes
會自動爲它指定與內存限制相等的內存請求。同樣，如果容器指定了自己的 CPU 限制，
但沒有指定 CPU 請求，Kubernetes 會自動爲它指定與 CPU 限制相等的 CPU 請求。
{{< /note >}}

<!--
#### Clean up {#clean-up-guaranteed}
-->
#### 清理 {#clean-up-guaranteed}

<!--
Delete your Pod:
-->
刪除 Pod：

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of Burstable

A Pod is given a QoS class of `Burstable` if:

* The Pod does not meet the criteria for QoS class `Guaranteed`.
* At least one Container in the Pod has a memory or CPU request or limit.

Here is a manifest for a Pod that has one Container. The Container has a memory limit of 200 MiB
and a memory request of 100 MiB.
-->
## 創建一個 QoS 類爲 Burstable 的 Pod  {#create-a-pod-that-gets-assigned-a-qos-class-of-burstable}

如果滿足下麪條件，Kubernetes 將會指定 Pod 的 QoS 類爲 `Burstable`：

* Pod 不符合 `Guaranteed` QoS 類的標準。
* Pod 中至少一個 Container 具有內存或 CPU 的請求或限制。

下面是包含一個 Container 的 Pod 清單。該 Container 設置的內存限制爲 200 MiB，
內存請求爲 100 MiB。

{{% code_sample file="pods/qos/qos-pod-2.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 詳情：

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of `Burstable`:
-->
結果表明 Kubernetes 爲 Pod 設定的 QoS 類爲 `Burstable`：

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
#### Clean up {#clean-up-burstable}
-->
#### 清理  {#clean-up-burstable}

<!--
Delete your Pod:
-->
刪除 Pod：

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of BestEffort

For a Pod to be given a QoS class of `BestEffort`, the Containers in the Pod must not
have any memory or CPU limits or requests.

Here is a manifest for a Pod that has one Container. The Container has no memory or CPU
limits or requests:
-->
## 創建一個 QoS 類爲 BestEffort 的 Pod  {#create-a-pod-that-gets-assigned-a-qos-class-of-besteffort}

對於 QoS 類爲 `BestEffort` 的 Pod，Pod 中的 Container 必須沒有設置內存和 CPU 限制或請求。

下面是包含一個 Container 的 Pod 清單。該 Container 沒有設置內存和 CPU 限制或請求。

{{% code_sample file="pods/qos/qos-pod-3.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 詳情：

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of `BestEffort`:
-->
結果表明 Kubernetes 爲 Pod 設定的 QoS 類爲 `BestEffort`。

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
#### Clean up {#clean-up-besteffort}
-->
#### 清理   {#clean-up-besteffort}

<!--
Delete your Pod:
-->
刪除 Pod：

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

<!--
## Create a Pod that has two Containers

Here is a manifest for a Pod that has two Containers. One container specifies a memory
request of 200 MiB. The other Container does not specify any requests or limits.
-->
## 創建包含兩個容器的 Pod  {#create-a-pod-that-has-two-containers}

下面是包含兩個 Container 的 Pod 清單。一個 Container 指定內存請求爲 200 MiB。
另外一個 Container 沒有指定任何請求或限制。

{{% code_sample file="pods/qos/qos-pod-4.yaml" %}}

<!--
Notice that this Pod meets the criteria for QoS class `Burstable`. That is, it does not meet the
criteria for QoS class `Guaranteed`, and one of its Containers has a memory request.

Create the Pod:
-->
注意此 Pod 滿足 `Burstable` QoS 類的標準。也就是說它不滿足 `Guaranteed` QoS 類標準，
因爲它的 Container 之一設有內存請求。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 詳情：

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of `Burstable`:
-->
結果表明 Kubernetes 爲 Pod 設定的 QoS 類爲 `Burstable`：

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
## Retrieve the QoS class for a Pod

Rather than see all the fields, you can view just the field you need:
-->
## 檢視 Pod 的 QoS 類  {#retrieve-the-qos-class-for-a-pod}

<!--
Rather than see all the fields, you can view just the field you need:
-->
你也可以只查看你所需要的字段，而不是查看所有字段：

```bash
kubectl --namespace=qos-example get pod qos-demo-4 -o jsonpath='{ .status.qosClass}{"\n"}'
```

```none
Burstable
```

<!--
## Clean up

Delete your namespace:
-->
## 環境清理  {#clean-up}

刪除名字空間：

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

* [爲 Pod 和容器分配內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [爲 Pod 和容器分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

* [Control Topology Management policies on a node](/docs/tasks/administer-cluster/topology-manager/)
-->
### 叢集管理員參考

* [爲名字空間設定默認的內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [爲名字空間設定默認的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [爲名字空間設定最小和最大內存限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [爲名字空間設定最小和最大 CPU 限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [爲名字空間設定內存和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [爲名字空間設定 Pod 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [爲 API 對象設定配額](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)
* [控制節點上的拓撲管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)
