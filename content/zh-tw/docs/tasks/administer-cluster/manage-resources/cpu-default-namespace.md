---
title: 為名稱空間配置預設的 CPU 請求和限制
content_type: task
weight: 20
description: >-
  為名稱空間定義預設的 CPU 資源限制，在該名稱空間中每個新建的 Pod 都會被配置上 CPU 資源限制。
---

<!--
title: Configure Default CPU Requests and Limits for a Namespace
content_type: task
weight: 20
-->

<!-- overview -->
<!--
This page shows how to configure default CPU requests and limits for a
{{< glossary_tooltip text="namespace" term_id="namespace" >}}.

A Kubernetes cluster can be divided into namespaces. If you create a Pod within a
namespace that has a default CPU
[limit](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits), and any container in that Pod does not specify
its own CPU limit, then the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} assigns the default
CPU limit to that container.

Kubernetes assigns a default CPU
[request](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits),
but only under certain conditions that are explained later in this page.

-->
本章介紹如何為{{< glossary_tooltip text="名稱空間" term_id="namespace" >}}配置預設的 CPU 請求和限制。

一個 Kubernetes 叢集可被劃分為多個名稱空間。
如果你在具有預設 CPU[限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
的名稱空間內建立一個 Pod，並且這個 Pod 中任何容器都沒有宣告自己的 CPU 限制，
那麼{{< glossary_tooltip text="控制面" term_id="control-plane" >}}會為容器設定預設的 CPU 限制。

Kubernetes 在一些特定情況還可以設定預設的 CPU 請求，本文後續章節將會對其進行解釋。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.

If you're not already familiar with what Kubernetes means by 1.0 CPU,
read [meaning of CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu).
-->
在你的集群裡你必須要有建立名稱空間的許可權。

如果你還不熟悉 Kubernetes 中 1.0 CPU 的含義，
請閱讀 [CPU 的含義](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 建立名稱空間

建立一個名稱空間，以便本練習中建立的資源和叢集的其餘部分相隔離。

```shell
kubectl create namespace default-cpu-example
```

<!--
## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}.
The manifest specifies a default CPU request and a default CPU limit.
-->
## 建立 LimitRange 和 Pod

以下為 {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} 的示例清單。
清單中聲明瞭預設 CPU 請求和預設 CPU 限制。

{{< codenew file="admin/resource/cpu-defaults.yaml" >}}

<!--
Create the LimitRange in the default-cpu-example namespace:
-->
在名稱空間 default-cpu-example 中建立 LimitRange 物件：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults.yaml --namespace=default-cpu-example
```

<!--
Now if you create a Pod in the default-cpu-example namespace, and any container
in that Pod does not specify its own values for CPU request and CPU limit,
then the control plane applies default values: a CPU request of 0.5 and a default
CPU limit of 1.

Here's a manifest for a Pod that has one container. The container
does not specify a CPU request and limit.
-->
現在如果你在 default-cpu-example 名稱空間中建立一個 Pod，
並且該 Pod 中所有容器都沒有宣告自己的 CPU 請求和 CPU 限制，
控制面會將 CPU 的預設請求值 0.5 和預設限制值 1 應用到 Pod 上。

以下為只包含一個容器的 Pod 的清單。該容器沒有宣告 CPU 請求和限制。

{{< codenew file="admin/resource/cpu-defaults-pod.yaml" >}}

<!--
Create the Pod.
-->
建立 Pod。

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

<!--
View the Pod's specification:
-->
檢視該 Pod 的宣告：

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the Pod's only container has a CPU request of 500m `cpu`
(which you can read as “500 millicpu”), and a CPU limit of 1 `cpu`.
These are the default values specified by the LimitRange.
-->
輸出顯示該 Pod 的唯一的容器有 500m `cpu` 的 CPU 請求和 1 `cpu` 的 CPU 限制。
這些是 LimitRange 宣告的預設值。

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-cpu-demo-ctr
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

<!--
## What if you specify a container's limit, but not its request?

Here's a manifest for a Pod that has one container. The container
specifies a CPU limit, but not a request:
-->
## 你只宣告容器的限制，而不宣告請求會怎麼樣？

以下為只包含一個容器的 Pod 的清單。該容器聲明瞭 CPU 限制，而沒有宣告 CPU 請求。

{{< codenew file="admin/resource/cpu-defaults-pod-2.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

<!--
View the [specification](/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
of the Pod that you created:
-->
檢視你所建立的 Pod 的[規約](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)：

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the Container's CPU request is set to match its CPU limit.
Notice that the container was not assigned the default CPU request value of 0.5 `cpu`:
-->
輸出顯示該容器的 CPU 請求和 CPU 限制設定相同。注意該容器沒有被指定預設的 CPU 請求值 0.5 `cpu`：

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

<!--
## What if you specify a container's request, but not its limit?

Here's an example manifest for a Pod that has one container. The container
specifies a CPU request, but not a limit:
-->
## 你只宣告容器的請求，而不宣告它的限制會怎麼樣？

這裡給出了包含一個容器的 Pod 的示例清單。該容器聲明瞭 CPU 請求，而沒有宣告 CPU 限制。

{{< codenew file="admin/resource/cpu-defaults-pod-3.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

<!--
View the [specification](/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
of the Pod that you created:
-->
檢視你所建立的 Pod 的[規約](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)：

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the container's CPU request is set to the value you specified at
the time you created the Pod (in other words: it matches the manifest).
However, the same container's CPU limit is set to 1 `cpu`, which is the default CPU limit
for that namespace.
-->
輸出顯示你所建立的 Pod 中，容器的 CPU 請求為 Pod 清單中宣告的值。
然而同一容器的 CPU 限制被設定為 1 `cpu`，此值是該名稱空間的預設 CPU 限制值。

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

<!--
## Motivation for default CPU limits and requests

If your namespace has a CPU {{< glossary_tooltip text="resource quota" term_id="resource-quota" >}}
configured,
it is helpful to have a default value in place for CPU limit.
Here are two of the restrictions that a CPU resource quota imposes on a namespace:

* For every Pod that runs in the namespace, each of its containers must have a CPU limit.
* CPU request apply a resource reservation on the node where the Pod in question is scheduled.
  The total amount of CPU that is reserved for use by all Pods in the namespace must not
  exceed a specified limit.

-->
## 預設 CPU 限制和請求的動機

如果你的名稱空間設定了 CPU {{< glossary_tooltip text="資源配額" term_id="resource-quota" >}}，
為 CPU 限制設定一個預設值會很有幫助。
以下是 CPU 資源配額對名稱空間的施加的兩條限制：

* 名稱空間中執行的每個 Pod 中的容器都必須有 CPU 限制。

* CPU 限制用來在 Pod 被排程到的節點上執行資源預留。

預留給名稱空間中所有 Pod 使用的 CPU 總量不能超過規定的限制。

<!--
When you add a LimitRange:

If any Pod in that namespace that includes a container does not specify its own CPU limit,
the control plane applies the default CPU limit to that container, and the Pod can be
allowed to run in a namespace that is restricted by a CPU ResourceQuota.
-->
當你新增 LimitRange 時：

如果該名稱空間中的任何 Pod 的容器未指定 CPU 限制，
控制面將預設 CPU 限制應用於該容器，
這樣 Pod 可以在受到 CPU ResourceQuota 限制的名稱空間中執行。

<!--
## Clean up

Delete your namespace:

```shell
kubectl delete namespace default-cpu-example
```
-->
## 清理

刪除你的名稱空間：

```shell
kubectl delete namespace constraints-cpu-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)
* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)
* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)
* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)
* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
### 叢集管理員參考

* [為名稱空間配置預設記憶體請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [為名稱空間配置記憶體限制的最小值和最大值](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [為名稱空間配置 CPU 限制的最小值和最大值](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [為名稱空間配置記憶體和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [為名稱空間配置 Pod 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [為 API 物件配置配額](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 應用開發者參考

* [為容器和 Pod 分配記憶體資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [為容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [為 Pod 配置服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)


