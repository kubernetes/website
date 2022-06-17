---
title: 配置名稱空間的最小和最大記憶體約束
content_type: task
weight: 30
description: >-
  為命名口空間定義一個有效的記憶體資源限制範圍，在該名稱空間中每個新建立
  Pod 的記憶體資源是在設定的範圍內。
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
本頁介紹如何設定在{{< glossary_tooltip text="名字空間" term_id="namespace" >}}
中執行的容器所使用的記憶體的最小值和最大值。你可以在
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
物件中指定最小和最大記憶體值。如果 Pod 不滿足 LimitRange 施加的約束，
則無法在名字空間中建立它。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} 

<!--
You must have access to create namespaces in your cluster.
Each node in your cluster must have at least 1 GiB of memory available for Pods.
-->
在你的集群裡你必須要有建立名稱空間的許可權。

叢集中的每個節點都必須至少有 1 GiB 的記憶體可供 Pod 使用。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 建立名稱空間

建立一個名稱空間，以便在此練習中建立的資源與叢集的其餘資源隔離。

```shell
kubectl create namespace constraints-mem-example
```

<!--
## Create a LimitRange and a Pod

Here's an example manifest for a LimitRange:
-->
## 建立 LimitRange 和 Pod

下面是 LimitRange 的示例清單：

{{< codenew file="admin/resource/memory-constraints.yaml" >}}

<!--
Create the LimitRange:
-->
建立 LimitRange:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints.yaml --namespace=constraints-mem-example
```

<!--
View detailed information about the LimitRange:
-->
檢視 LimitRange 的詳情：

```shell
kubectl get limitrange mem-min-max-demo-lr --namespace=constraints-mem-example --output=yaml
```

<!--
The output shows the minimum and maximum memory constraints as expected. But
notice that even though you didn't specify default values in the configuration
file for the LimitRange, they were created automatically.
-->
輸出顯示預期的最小和最大記憶體約束。 但請注意，即使你沒有在 LimitRange 的配置檔案中指定預設值，也會自動建立它們。

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
現在，每當在 constraints-mem-example 名稱空間中建立 Pod 時，Kubernetes 就會執行下面的步驟：

* 如果 Pod 中的任何容器未宣告自己的記憶體請求和限制，控制面將為該容器設定預設的記憶體請求和限制。
* 確保該 Pod 中的每個容器的記憶體請求至少 500 MiB。
* 確保該 Pod 中每個容器記憶體請求不大於 1 GiB。

以下為包含一個容器的 Pod 清單。該容器聲明瞭 600 MiB 的記憶體請求和 800 MiB 的記憶體限制，
這些滿足了 LimitRange 施加的最小和最大記憶體約束。

{{< codenew file="admin/resource/memory-constraints-pod.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

<!--
Verify that the Pod is running and that its container is healthy:
-->
確認 Pod 正在執行，並且其容器處於健康狀態：

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

<!--
View detailed information about the Pod:
-->
檢視 Pod 詳情：

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

<!--
The output shows that the container within that Pod has a memory request of 600 MiB and
a memory limit of 800 MiB. These satisfy the constraints imposed by the LimitRange for
this namespace:
-->
輸出結果顯示該 Pod 的容器的記憶體請求為 600 MiB，記憶體限制為 800 MiB。
這些滿足這個名稱空間中 LimitRange 設定的限制範圍。

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
刪除你建立的 Pod：

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

<!--
## Attempt to create a Pod that exceeds the maximum memory constraint

Here's a manifest for a Pod that has one container. The container specifies a
memory request of 800 MiB and a memory limit of 1.5 GiB.
-->
## 嘗試建立一個超過最大記憶體限制的 Pod

以下為包含一個容器的 Pod 的清單。這個容器聲明瞭 800 MiB 的記憶體請求和 1.5 GiB 的記憶體限制。

{{< codenew file="admin/resource/memory-constraints-pod-2.yaml" >}}

<!--
Attempt to create the Pod:
-->
嘗試建立 Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because it defines a container that
requests more memory than is allowed:
-->
輸出結果顯示 Pod 沒有建立成功，因為它定義了一個容器的記憶體請求超過了允許的值。

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

<!--
## Attempt to create a Pod that does not meet the minimum memory request

Here's a manifest for a Pod that has one container. That container specifies a
memory request of 100 MiB and a memory limit of 800 MiB.
-->
## 嘗試建立一個不滿足最小記憶體請求的 Pod

以下為只有一個容器的 Pod 的清單。這個容器聲明瞭 100 MiB 的記憶體請求和 800 MiB 的記憶體限制。

{{< codenew file="admin/resource/memory-constraints-pod-3.yaml" >}}

<!--
Attempt to create the Pod:
-->
嘗試建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

<!--
The output shows that the Pod does not get created, because it defines a container
that requests less memory than the enforced minimum:
-->
輸出結果顯示 Pod 沒有建立成功，因為它定義了一個容器的記憶體請求小於強制要求的最小值：

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

<!--
## Create a Pod that does not specify any memory request or limit

Here's a manifest for a Pod that has one container. The container does not
specify a memory request, and it does not specify a memory limit.
-->
## 建立一個沒有宣告記憶體請求和限制的 Pod

以下為只有一個容器的 Pod 清單。該容器沒有宣告記憶體請求，也沒有宣告記憶體限制。

{{< codenew file="admin/resource/memory-constraints-pod-4.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

<!--
View detailed information about the Pod:
-->
檢視 Pod 詳情：

```shell
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

<!--
The output shows that the Pod's only container has a memory request of 1 GiB and a memory limit of 1 GiB.
How did that container get those values?
-->
輸出結果顯示 Pod 的唯一容器記憶體請求為 1 GiB，記憶體限制為 1 GiB。容器怎樣獲得那些數值呢？

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
因為你的 Pod 沒有為容器宣告任何記憶體請求和限制，叢集會從 LimitRange
獲取[預設的記憶體請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。
 應用於容器。

<!--
This means that the definition of that Pod shows those values. You can check it using
`kubectl describe`:

```shell
# Look for the "Requests:" section of the output
kubectl describe pod constraints-mem-demo-4 --namespace=constraints-mem-example
```
-->
這意味著 Pod 的定義會顯示這些值。你可以透過 `kubectl describe` 檢視：

```shell
# 檢視輸出結果中的 "Requests:" 的值
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
此時，你的 Pod 可能已經執行起來也可能沒有執行起來。
回想一下我們本次任務的先決條件是你的每個節點都至少有 1 GiB 的記憶體。
如果你的每個節點都只有 1 GiB 的記憶體，那將沒有一個節點擁有足夠的可分配記憶體來滿足 1 GiB 的記憶體請求。

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
## 強制執行記憶體最小和最大限制

LimitRange 為名稱空間設定的最小和最大記憶體限制只有在 Pod 建立和更新時才會強制執行。
如果你更新 LimitRange，它不會影響此前建立的 Pod。

<!--
## Motivation for minimum and maximum memory constraints
-->
## 設定記憶體最小和最大限制的動因

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
作為叢集管理員，你可能想規定 Pod 可以使用的記憶體總量限制。例如：

* 叢集的每個節點有 2 GiB 記憶體。你不想接受任何請求超過 2 GiB 的 Pod，因為叢集中沒有節點可以滿足。
* 叢集由生產部門和開發部門共享。你希望允許產品部門的負載最多耗用 8 GiB 記憶體，
  但是開發部門的負載最多可使用 512 MiB。
  這時，你可以為產品部門和開發部門分別建立名字空間，併為各個名字空間設定記憶體約束。

<!--
## Clean up

Delete your namespace:
-->
## 清理

刪除你的名稱空間：

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

