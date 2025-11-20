---
title: 爲命名空間設定預設的 CPU 請求和限制
content_type: task
weight: 20
description: >-
  爲命名空間定義預設的 CPU 資源限制，在該命名空間中每個新建的 Pod 都會被設定上 CPU 資源限制。
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
本章介紹如何爲{{< glossary_tooltip text="命名空間" term_id="namespace" >}}設定預設的 CPU 請求和限制。

一個 Kubernetes 叢集可被劃分爲多個命名空間。
如果你在具有預設 CPU [限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
的命名空間內創建一個 Pod，並且這個 Pod 中任何容器都沒有聲明自己的 CPU 限制，
那麼{{< glossary_tooltip text="控制面" term_id="control-plane" >}}會爲容器設定預設的 CPU 限制。

Kubernetes 在一些特定情況還可以設置預設的 CPU 請求，本文後續章節將會對其進行解釋。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.

If you're not already familiar with what Kubernetes means by 1.0 CPU,
read [meaning of CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu).
-->
在你的叢集裏你必須要有創建命名空間的權限。

如果你還不熟悉 Kubernetes 中 1.0 CPU 的含義，
請閱讀 [CPU 的含義](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 創建命名空間

創建一個命名空間，以便本練習中創建的資源和叢集的其餘部分相隔離。

```shell
kubectl create namespace default-cpu-example
```

<!--
## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}.
The manifest specifies a default CPU request and a default CPU limit.
-->
## 創建 LimitRange 和 Pod

以下爲 {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} 的示例清單。
清單中聲明瞭預設 CPU 請求和預設 CPU 限制。

{{% code_sample file="admin/resource/cpu-defaults.yaml" %}}

<!--
Create the LimitRange in the default-cpu-example namespace:
-->
在命名空間 default-cpu-example 中創建 LimitRange 對象：

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
現在如果你在 default-cpu-example 命名空間中創建一個 Pod，
並且該 Pod 中所有容器都沒有聲明自己的 CPU 請求和 CPU 限制，
控制面會將 CPU 的預設請求值 0.5 和預設限制值 1 應用到 Pod 上。

以下爲只包含一個容器的 Pod 的清單。該容器沒有聲明 CPU 請求和限制。

{{% code_sample file="admin/resource/cpu-defaults-pod.yaml" %}}

<!--
Create the Pod.
-->
創建 Pod。

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

<!--
View the Pod's specification:
-->
查看該 Pod 的聲明：

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the Pod's only container has a CPU request of 500m `cpu`
(which you can read as “500 millicpu”), and a CPU limit of 1 `cpu`.
These are the default values specified by the LimitRange.
-->
輸出顯示該 Pod 的唯一的容器有 500m `cpu` 的 CPU 請求和 1 `cpu` 的 CPU 限制。
這些是 LimitRange 聲明的預設值。

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
## 你只聲明容器的限制，而不聲明請求會怎麼樣？

以下爲只包含一個容器的 Pod 的清單。該容器聲明瞭 CPU 限制，而沒有聲明 CPU 請求。

{{% code_sample file="admin/resource/cpu-defaults-pod-2.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

<!--
View the [specification](/docs/concepts/overview/working-with-objects/#object-spec-and-status)
of the Pod that you created:
-->
查看你所創建的 Pod 的[規約](/zh-cn/docs/concepts/overview/working-with-objects/#object-spec-and-status)：

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the container's CPU request is set to match its CPU limit.
Notice that the container was not assigned the default CPU request value of 0.5 `cpu`:
-->
輸出顯示該容器的 CPU 請求和 CPU 限制設置相同。注意該容器沒有被指定預設的 CPU 請求值 0.5 `cpu`：

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
## 你只聲明容器的請求，而不聲明它的限制會怎麼樣？

這裏給出了包含一個容器的 Pod 的示例清單。該容器聲明瞭 CPU 請求，而沒有聲明 CPU 限制。

{{% code_sample file="admin/resource/cpu-defaults-pod-3.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

<!--
View the specification of the Pod that you created:
-->
查看你所創建的 Pod 的規約：

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

<!--
The output shows that the container's CPU request is set to the value you specified at
the time you created the Pod (in other words: it matches the manifest).
However, the same container's CPU limit is set to 1 `cpu`, which is the default CPU limit
for that namespace.
-->
輸出顯示你所創建的 Pod 中，容器的 CPU 請求爲 Pod 清單中聲明的值。
然而同一容器的 CPU 限制被設置爲 1 `cpu`，此值是該命名空間的預設 CPU 限制值。

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
* CPU limits apply a resource reservation on the node where the Pod in question is scheduled.
  The total amount of CPU that is reserved for use by all Pods in the namespace must not
  exceed a specified limit.
-->
## 預設 CPU 限制和請求的動機

如果你的命名空間設置了 CPU {{< glossary_tooltip text="資源配額" term_id="resource-quota" >}}，
爲 CPU 限制設置一個預設值會很有幫助。
以下是 CPU 資源配額對命名空間的施加的兩條限制：

* 命名空間中運行的每個 Pod 中的容器都必須有 CPU 限制。

* CPU 限制用來在 Pod 被調度到的節點上執行資源預留。

預留給命名空間中所有 Pod 使用的 CPU 總量不能超過規定的限制。

<!--
When you add a LimitRange:

If any Pod in that namespace that includes a container does not specify its own CPU limit,
the control plane applies the default CPU limit to that container, and the Pod can be
allowed to run in a namespace that is restricted by a CPU ResourceQuota.
-->
當你添加 LimitRange 時：

如果該命名空間中的任何 Pod 的容器未指定 CPU 限制，
控制面將預設 CPU 限制應用於該容器，
這樣 Pod 可以在受到 CPU ResourceQuota 限制的命名空間中運行。

<!--
## Clean up

Delete your namespace:

```shell
kubectl delete namespace default-cpu-example
```
-->
## 清理

刪除你的命名空間：

```shell
kubectl delete namespace default-cpu-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
### 叢集管理員參考

* [爲命名空間設定預設內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [爲命名空間設定內存限制的最小值和最大值](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [爲命名空間設定 CPU 限制的最小值和最大值](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [爲命名空間設定內存和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [爲命名空間設定 Pod 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [爲 API 對象設定配額](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 應用開發者參考

* [爲容器和 Pod 分配內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [爲容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [分配 Pod 級 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [爲 Pod 設定服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
