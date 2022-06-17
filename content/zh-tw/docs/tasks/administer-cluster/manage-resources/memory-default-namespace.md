---
title: 為名稱空間配置預設的記憶體請求和限制
content_type: task
weight: 10
description: >-
  為名稱空間定義預設的記憶體資源限制，這樣在該名稱空間中每個新建的 Pod 都會被配置上記憶體資源限制。
---

<!--
title: Configure Default Memory Requests and Limits for a Namespace
content_type: task
weight: 10
description: >-
  Define a default memory resource limit for a namespace, so that every new Pod
  in that namespace has a memory resource limit configured.
-->

<!-- overview -->

<!--
This page shows how to configure default memory requests and limits for a
{{< glossary_tooltip text="namespace" term_id="namespace" >}}.

A Kubernetes cluster can be divided into namespaces. Once you have a namespace that
has a default memory
[limit](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits),
and you then try to create a Pod with a container that does not specify its own memory
limit, then the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} assigns the default
memory limit to that container.

Kubernetes assigns a default memory request under certain conditions that are explained later in this topic.
-->
本章介紹如何為{{< glossary_tooltip text="名稱空間" term_id="namespace" >}}配置預設的記憶體請求和限制。

一個 Kubernetes 叢集可被劃分為多個名稱空間。
如果你在具有預設記憶體[限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
的名稱空間內嘗試建立一個 Pod，並且這個 Pod 中的容器沒有宣告自己的記憶體資源限制，
那麼{{< glossary_tooltip text="控制面" term_id="control-plane" >}}會為該容器設定預設的記憶體限制。

Kubernetes 還為某些情況指定了預設的記憶體請求，本章後面會進行介紹。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.

Each node in your cluster must have at least 2 GiB of memory.
-->
在你的集群裡你必須要有建立名稱空間的許可權。

你的叢集中的每個節點必須至少有 2 GiB 的記憶體。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 建立名稱空間

建立一個名稱空間，以便本練習中所建的資源與叢集的其餘資源相隔離。

```shell
kubectl create namespace default-mem-example
```

<!--
## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}.
The manifest specifies a default memory
request and a default memory limit.
-->
## 建立 LimitRange 和 Pod

以下為 {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} 的示例清單。
清單中聲明瞭預設的記憶體請求和預設的記憶體限制。

{{< codenew file="admin/resource/memory-defaults.yaml" >}}

<!--
Create the LimitRange in the default-mem-example namespace:
-->
在 default-mem-example 名稱空間建立限制範圍：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

<!--
Now if you create a Pod in the default-mem-example namespace, and any container
within that Pod does not specify its own values for memory request and memory limit,
then the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
applies default values: a memory request of 256MiB and a memory limit of 512MiB.

Here's an example manifest for a Pod that has one container. The container
does not specify a memory request and limit.
-->
現在如果你在 default-mem-example 名稱空間中建立一個 Pod，
並且該 Pod 中所有容器都沒有宣告自己的記憶體請求和記憶體限制，
{{< glossary_tooltip text="控制面" term_id="control-plane" >}}
會將記憶體的預設請求值 256MiB 和預設限制值 512MiB 應用到 Pod 上。

以下為只包含一個容器的 Pod 的清單。該容器沒有宣告記憶體請求和限制。

{{< codenew file="admin/resource/memory-defaults-pod.yaml" >}}

<!--
Create the Pod.
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->
檢視 Pod 的詳情：

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the Pod's container has a memory request of 256 MiB and
a memory limit of 512 MiB. These are the default values specified by the LimitRange.
-->
輸出內容顯示該 Pod 的容器有 256 MiB 的記憶體請求和 512 MiB 的記憶體限制。
這些都是 LimitRange 設定的預設值。

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-mem-demo-ctr
  resources:
    limits:
      memory: 512Mi
    requests:
      memory: 256Mi
```

<!--
Delete your Pod:
-->
刪除你的 Pod：

```shell
kubectl delete pod default-mem-demo --namespace=default-mem-example
```

<!--
## What if you specify a container's limit, but not its request?

Here's a manifest for a Pod that has one container. The container
specifies a memory limit, but not a request:
-->
## 宣告容器的限制而不宣告它的請求會怎麼樣？

以下為只包含一個容器的 Pod 的清單。該容器聲明瞭記憶體限制，而沒有宣告記憶體請求。

{{< codenew file="admin/resource/memory-defaults-pod-2.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->
檢視 Pod 的詳情：

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the container's memory request is set to match its memory limit.
Notice that the container was not assigned the default memory request value of 256Mi.
-->
輸出結果顯示容器的記憶體請求被設定為它的記憶體限制相同的值。注意該容器沒有被指定預設的記憶體請求值 256MiB。

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

<!--
## What if you specify a container's request, but not its limit?
-->
## 宣告容器的記憶體請求而不宣告記憶體限制會怎麼樣？

<!--
Here's a manifest for a Pod that has one container. The container
specifies a memory request, but not a limit:
-->
以下為只包含一個容器的 Pod 的清單。該容器聲明瞭記憶體請求，但沒有記憶體限制：

{{< codenew file="admin/resource/memory-defaults-pod-3.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

<!--
View the Pod's specification:
-->
檢視 Pod 宣告：

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the container's memory request is set to the value specified in the
container's manifest. The container is limited to use no more than 512MiB of
memory, which matches the default memory limit for the namespace.
-->
輸出結果顯示所建立的 Pod 中，容器的記憶體請求為 Pod 清單中宣告的值。
然而同一容器的記憶體限制被設定為 512MiB，此值是該名稱空間的預設記憶體限制值。

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

<!--
## Motivation for default memory limits and requests

If your namespace has a memory {{< glossary_tooltip text="resource quota" term_id="resource-quota" >}}
configured,
it is helpful to have a default value in place for memory limit.
Here are three of the restrictions that a resource quota imposes on a namespace:

* For every Pod that runs in the namespace, the Pod and each of its containers must have a memory limit.
  (If you specify a memory limit for every container in a Pod, Kubernetes can infer the Pod-level memory
  limit by adding up the limits for its containers).
* Memory limits apply a resource reservation on the node where the Pod in question is scheduled.
  The total amount of memory reserved for all Pods in the namespace must not exceed a specified limit.
* The total amount of memory actually used by all Pods in the namespace must also not exceed a specified limit.
-->
## 設定預設記憶體限制和請求的動機

如果你的名稱空間設定了記憶體 {{< glossary_tooltip text="資源配額" term_id="resource-quota" >}}，
那麼為記憶體限制設定一個預設值會很有幫助。
以下是記憶體資源配額對名稱空間的施加的三條限制：

* 名稱空間中執行的每個 Pod 中的容器都必須有記憶體限制。
  （如果為 Pod 中的每個容器聲明瞭記憶體限制，
  Kubernetes 可以透過將其容器的記憶體限制相加推斷出 Pod 級別的記憶體限制）。

* 記憶體限制用來在 Pod 被排程到的節點上執行資源預留。
  預留給名稱空間中所有 Pod 使用的記憶體總量不能超過規定的限制。

* 名稱空間中所有 Pod 實際使用的記憶體總量也不能超過規定的限制。

<!--
When you add a LimitRange:

If any Pod in that namespace that includes a container does not specify its own memory limit,
the control plane applies the default memory limit to that container, and the Pod can be
allowed to run in a namespace that is restricted by a memory ResourceQuota.
-->
當你新增 LimitRange 時：

如果該名稱空間中的任何 Pod 的容器未指定記憶體限制，
控制面將預設記憶體限制應用於該容器，
這樣 Pod 可以在受到記憶體 ResourceQuota 限制的名稱空間中執行。

<!--
## Clean up

Delete your namespace:
-->
## 清理

刪除你的名稱空間：

```shell
kubectl delete namespace default-mem-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
### 叢集管理員參考

* [為名稱空間配置預設的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [為名稱空間配置最小和最大記憶體限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [為名稱空間配置最小和最大 CPU 限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
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

