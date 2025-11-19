---
title: 爲命名空間配置默認的內存請求和限制
content_type: task
weight: 10
description: >-
  爲命名空間定義默認的內存資源限制，這樣在該命名空間中每個新建的 Pod 都會被配置上內存資源限制。
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
本章介紹如何爲{{< glossary_tooltip text="命名空間" term_id="namespace" >}}配置默認的內存請求和限制。

一個 Kubernetes 集羣可被劃分爲多個命名空間。
如果你在具有默認內存[限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
的命名空間內嘗試創建一個 Pod，並且這個 Pod 中的容器沒有聲明自己的內存資源限制，
那麼{{< glossary_tooltip text="控制面" term_id="control-plane" >}}會爲該容器設定默認的內存限制。

Kubernetes 還爲某些情況指定了默認的內存請求，本章後面會進行介紹。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.

Each node in your cluster must have at least 2 GiB of memory.
-->
在你的集羣裏你必須要有創建命名空間的權限。

你的集羣中的每個節點必須至少有 2 GiB 的內存。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 創建命名空間

創建一個命名空間，以便本練習中所建的資源與集羣的其餘資源相隔離。

```shell
kubectl create namespace default-mem-example
```

<!--
## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}.
The manifest specifies a default memory
request and a default memory limit.
-->
## 創建 LimitRange 和 Pod

以下爲 {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} 的示例清單。
清單中聲明瞭默認的內存請求和默認的內存限制。

{{% code_sample file="admin/resource/memory-defaults.yaml" %}}

<!--
Create the LimitRange in the default-mem-example namespace:
-->
在 default-mem-example 命名空間創建限制範圍：

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
現在如果你在 default-mem-example 命名空間中創建一個 Pod，
並且該 Pod 中所有容器都沒有聲明自己的內存請求和內存限制，
{{< glossary_tooltip text="控制面" term_id="control-plane" >}}
會將內存的默認請求值 256MiB 和默認限制值 512MiB 應用到 Pod 上。

以下爲只包含一個容器的 Pod 的清單。該容器沒有聲明內存請求和限制。

{{% code_sample file="admin/resource/memory-defaults-pod.yaml" %}}

<!--
Create the Pod.
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的詳情：

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the Pod's container has a memory request of 256 MiB and
a memory limit of 512 MiB. These are the default values specified by the LimitRange.
-->
輸出內容顯示該 Pod 的容器有 256 MiB 的內存請求和 512 MiB 的內存限制。
這些都是 LimitRange 設置的默認值。

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
## 聲明容器的限制而不聲明它的請求會怎麼樣？

以下爲只包含一個容器的 Pod 的清單。該容器聲明瞭內存限制，而沒有聲明內存請求。

{{% code_sample file="admin/resource/memory-defaults-pod-2.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的詳情：

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the container's memory request is set to match its memory limit.
Notice that the container was not assigned the default memory request value of 256Mi.
-->
輸出結果顯示容器的內存請求被設置爲它的內存限制相同的值。注意該容器沒有被指定默認的內存請求值 256MiB。

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
## 聲明容器的內存請求而不聲明內存限制會怎麼樣？

<!--
Here's a manifest for a Pod that has one container. The container
specifies a memory request, but not a limit:
-->
以下爲只包含一個容器的 Pod 的清單。該容器聲明瞭內存請求，但沒有內存限制：

{{% code_sample file="admin/resource/memory-defaults-pod-3.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

<!--
View the Pod's specification:
-->
查看 Pod 聲明：

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

<!--
The output shows that the container's memory request is set to the value specified in the
container's manifest. The container is limited to use no more than 512MiB of
memory, which matches the default memory limit for the namespace.
-->
輸出結果顯示所創建的 Pod 中，容器的內存請求爲 Pod 清單中聲明的值。
然而同一容器的內存限制被設置爲 512MiB，此值是該命名空間的默認內存限制值。

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

{{< note >}}

<!--
A `LimitRange` does **not** check the consistency of the default values it applies. This means that a default value for the _limit_ that is set by `LimitRange` may be less than the _request_ value specified for the container in the spec that a client submits to the API server. If that happens, the final Pod will not be scheduleable.
See [Constraints on resource limits and requests](/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests) for more details.
-->
`LimitRange` **不會**檢查它應用的默認值的一致性。 這意味着 `LimitRange` 設置的 **limit** 的默認值可能小於客戶端提交給
API 服務器的聲明中爲容器指定的 **request** 值。如果發生這種情況，最終會導致 Pod 無法調度。更多信息，
請參閱[資源限制的 limit 和 request](/zh-cn/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests)。

{{< /note >}}

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
## 設置默認內存限制和請求的動機

如果你的命名空間設置了內存 {{< glossary_tooltip text="資源配額" term_id="resource-quota" >}}，
那麼爲內存限制設置一個默認值會很有幫助。
以下是內存資源配額對命名空間的施加的三條限制：

* 命名空間中運行的每個 Pod 中的容器都必須有內存限制。
  （如果爲 Pod 中的每個容器聲明瞭內存限制，
  Kubernetes 可以通過將其容器的內存限制相加推斷出 Pod 級別的內存限制）。

* 內存限制用來在 Pod 被調度到的節點上執行資源預留。
  預留給命名空間中所有 Pod 使用的內存總量不能超過規定的限制。

* 命名空間中所有 Pod 實際使用的內存總量也不能超過規定的限制。

<!--
When you add a LimitRange:

If any Pod in that namespace that includes a container does not specify its own memory limit,
the control plane applies the default memory limit to that container, and the Pod can be
allowed to run in a namespace that is restricted by a memory ResourceQuota.
-->
當你添加 LimitRange 時：

如果該命名空間中的任何 Pod 的容器未指定內存限制，
控制面將默認內存限制應用於該容器，
這樣 Pod 可以在受到內存 ResourceQuota 限制的命名空間中運行。

<!--
## Clean up

Delete your namespace:
-->
## 清理

刪除你的命名空間：

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
### 集羣管理員參考

* [爲命名空間配置默認的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [爲命名空間配置最小和最大內存限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [爲命名空間配置最小和最大 CPU 限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [爲命名空間配置內存和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [爲命名空間配置 Pod 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [爲 API 對象配置配額](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)

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
* [分配 Pod 級別的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [爲 Pod 配置服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
