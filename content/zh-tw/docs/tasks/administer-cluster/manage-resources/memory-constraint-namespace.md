---
title: 設定命名空間的最小和最大內存約束
content_type: task
weight: 30
description: >-
  爲命名空間定義一個有效的內存資源限制範圍，在該命名空間中每個新創建
  Pod 的內存資源是在設置的範圍內。
---

<!--
title: Configure Minimum and Maximum Memory Constraints for a Namespace
content_type: task
weight: 30
-->

<!-- overview -->

<!--
This page shows how to set minimum and maximum values for memory used by containers
running in a {{< glossary_tooltip text="namespace" term_id="namespace" >}}. 
You specify minimum and maximum memory values in a
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
object. If a Pod does not meet the constraints imposed by the LimitRange,
it cannot be created in the namespace.
-->
本頁介紹如何設置在{{< glossary_tooltip text="名字空間" term_id="namespace" >}}
中運行的容器所使用的內存的最小值和最大值。你可以在
[LimitRange](/zh-cn/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
對象中指定最小和最大內存值。如果 Pod 不滿足 LimitRange 施加的約束，
則無法在名字空間中創建它。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} 

<!--
You must have access to create namespaces in your cluster.
Each node in your cluster must have at least 1 GiB of memory available for Pods.
-->
在你的叢集裏你必須要有創建命名空間的權限。

叢集中的每個節點都必須至少有 1 GiB 的內存可供 Pod 使用。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 創建命名空間

創建一個命名空間，以便在此練習中創建的資源與叢集的其餘資源隔離。

```shell
kubectl create namespace constraints-mem-example
```

<!--
## Create a LimitRange and a Pod

Here's an example manifest for a LimitRange:
-->
## 創建 LimitRange 和 Pod

下面是 LimitRange 的示例清單：

{{% code_sample file="admin/resource/memory-constraints.yaml" %}}

<!--
Create the LimitRange:
-->
創建 LimitRange：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints.yaml --namespace=constraints-mem-example
```

<!--
View detailed information about the LimitRange:
-->
查看 LimitRange 的詳情：

```shell
kubectl get limitrange mem-min-max-demo-lr --namespace=constraints-mem-example --output=yaml
```

<!--
The output shows the minimum and maximum memory constraints as expected. But
notice that even though you didn't specify default values in the configuration
file for the LimitRange, they were created automatically.
-->
輸出顯示預期的最小和最大內存約束。
但請注意，即使你沒有在 LimitRange 的設定文件中指定默認值，默認值也會自動生成。

```
  limits:
  - default:
      memory: 1Gi
    defaultRequest:
      memory: 1Gi
    max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```

<!--
Now whenever you define a Pod within the constraints-mem-example namespace, Kubernetes
performs these steps:

* If any container in that Pod does not specify its own memory request and limit, 
  the control plane assigns the default memory request and limit to that container.

* Verify that every container in that Pod requests at least 500 MiB of memory.

* Verify that every container in that Pod requests no more than 1024 MiB (1 GiB)
  of memory.

Here's a manifest for a Pod that has one container. Within the Pod spec, the sole
container specifies a memory request of 600 MiB and a memory limit of 800 MiB. These satisfy the
minimum and maximum memory constraints imposed by the LimitRange.
-->
現在，每當在 constraints-mem-example 命名空間中創建 Pod 時，Kubernetes 就會執行下面的步驟：

* 如果 Pod 中的任何容器未聲明自己的內存請求和限制，控制面將爲該容器設置默認的內存請求和限制。
* 確保該 Pod 中的每個容器的內存請求至少 500 MiB。
* 確保該 Pod 中每個容器內存請求不大於 1 GiB。

以下爲包含一個容器的 Pod 清單。該容器聲明瞭 600 MiB 的內存請求和 800 MiB 的內存限制，
這些滿足了 LimitRange 施加的最小和最大內存約束。

{{% code_sample file="admin/resource/memory-constraints-pod.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

<!--
Verify that the Pod is running and that its container is healthy:
-->
確認 Pod 正在運行，並且其容器處於健康狀態：

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 詳情：

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

<!--
The output shows that the container within that Pod has a memory request of 600 MiB and
a memory limit of 800 MiB. These satisfy the constraints imposed by the LimitRange for
this namespace:
-->
輸出結果顯示該 Pod 的容器的內存請求爲 600 MiB，內存限制爲 800 MiB。
這些滿足這個命名空間中 LimitRange 設定的限制範圍。

```yaml
resources:
  limits:
     memory: 800Mi
  requests:
    memory: 600Mi
```

<!--
Delete your Pod:
-->
刪除你創建的 Pod：

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

<!--
## Attempt to create a Pod that exceeds the maximum memory constraint

Here's a manifest for a Pod that has one container. The container specifies a
memory request of 800 MiB and a memory limit of 1.5 GiB.
-->
## 嘗試創建一個超過最大內存限制的 Pod

以下爲包含一個容器的 Pod 的清單。這個容器聲明瞭 800 MiB 的內存請求和 1.5 GiB 的內存限制。

{{% code_sample file="admin/resource/memory-constraints-pod-2.yaml" %}}

<!--
Attempt to create the Pod:
-->
嘗試創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because it defines a container that
requests more memory than is allowed:
-->
輸出結果顯示 Pod 沒有創建成功，因爲它定義了一個容器的內存請求超過了允許的值。

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

<!--
## Attempt to create a Pod that does not meet the minimum memory request

Here's a manifest for a Pod that has one container. That container specifies a
memory request of 100 MiB and a memory limit of 800 MiB.
-->
## 嘗試創建一個不滿足最小內存請求的 Pod

以下爲只有一個容器的 Pod 的清單。這個容器聲明瞭 100 MiB 的內存請求和 800 MiB 的內存限制。

{{% code_sample file="admin/resource/memory-constraints-pod-3.yaml" %}}

<!--
Attempt to create the Pod:
-->
嘗試創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because it defines a container
that requests less memory than the enforced minimum:
-->
輸出結果顯示 Pod 沒有創建成功，因爲它定義了一個容器的內存請求小於強制要求的最小值：

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

<!--
## Create a Pod that does not specify any memory request or limit

Here's a manifest for a Pod that has one container. The container does not
specify a memory request, and it does not specify a memory limit.
-->
## 創建一個沒有聲明內存請求和限制的 Pod

以下爲只有一個容器的 Pod 清單。該容器沒有聲明內存請求，也沒有聲明內存限制。

{{% code_sample file="admin/resource/memory-constraints-pod-4.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 詳情：

```shell
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

<!--
The output shows that the Pod's only container has a memory request of 1 GiB and a memory limit of 1 GiB.
How did that container get those values?
-->
輸出結果顯示 Pod 的唯一容器內存請求爲 1 GiB，內存限制爲 1 GiB。容器怎樣獲得那些數值呢？

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

<!--
Because your Pod did not define any memory request and limit for that container, the cluster
applied a
[default memory request and limit](/docs/tasks/administer-cluster/memory-default-namespace/)
from the LimitRange.
-->
因爲你的 Pod 沒有爲容器聲明任何內存請求和限制，叢集會從 LimitRange
獲取[默認的內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。
應用於容器。

<!--
This means that the definition of that Pod shows those values. You can check it using
`kubectl describe`:

```shell
# Look for the "Requests:" section of the output
kubectl describe pod constraints-mem-demo-4 --namespace=constraints-mem-example
```
-->
這意味着 Pod 的定義會顯示這些值。你可以通過 `kubectl describe` 查看：

```shell
# 查看輸出結果中的 "Requests:" 的值
kubectl describe pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

<!--
At this point, your Pod might be running or it might not be running. Recall that a prerequisite
for this task is that your Nodes have at least 1 GiB of memory. If each of your Nodes has only
1 GiB of memory, then there is not enough allocatable memory on any Node to accommodate a memory
request of 1 GiB. If you happen to be using Nodes with 2 GiB of memory, then you probably have
enough space to accommodate the 1 GiB request.

Delete your Pod:
-->
此時，你的 Pod 可能已經運行起來也可能沒有運行起來。
回想一下我們本次任務的先決條件是你的每個節點都至少有 1 GiB 的內存。
如果你的每個節點都只有 1 GiB 的內存，那將沒有一個節點擁有足夠的可分配內存來滿足 1 GiB 的內存請求。

刪除你的 Pod：

```shell
kubectl delete pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

<!--
## Enforcement of minimum and maximum memory constraints

The maximum and minimum memory constraints imposed on a namespace by a LimitRange are enforced only
when a Pod is created or updated. If you change the LimitRange, it does not affect
Pods that were created previously.
-->
## 強制執行內存最小和最大限制

LimitRange 爲命名空間設定的最小和最大內存限制只有在 Pod 創建和更新時纔會強制執行。
如果你更新 LimitRange，它不會影響此前創建的 Pod。

<!--
## Motivation for minimum and maximum memory constraints
-->
## 設置內存最小和最大限制的動因

<!--
As a cluster administrator, you might want to impose restrictions on the amount of memory that Pods can use.
For example:

* Each Node in a cluster has 2 GiB of memory. You do not want to accept any Pod that requests
more than 2 GiB of memory, because no Node in the cluster can support the request.

* A cluster is shared by your production and development departments.
You want to allow production workloads to consume up to 8 GiB of memory, but
you want development workloads to be limited to 512 MiB. You create separate namespaces
  for production and development, and you apply memory constraints to each namespace.
-->
作爲叢集管理員，你可能想規定 Pod 可以使用的內存總量限制。例如：

* 叢集的每個節點有 2 GiB 內存。你不想接受任何請求超過 2 GiB 的 Pod，因爲叢集中沒有節點可以滿足。
* 叢集由生產部門和開發部門共享。你希望允許產品部門的負載最多耗用 8 GiB 內存，
  但是開發部門的負載最多可使用 512 MiB。
  這時，你可以爲產品部門和開發部門分別創建名字空間，併爲各個名字空間設置內存約束。

<!--
## Clean up

Delete your namespace:
-->
## 清理

刪除你的命名空間：

```shell
kubectl delete namespace constraints-mem-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)
* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)
* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)
* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)
* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

### 叢集管理員參考

* [爲命名空間設定默認內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
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
* [分配 Pod 級別的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [爲 Pod 設定服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
