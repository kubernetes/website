---
title: 為名稱空間配置 CPU 最小和最大約束
content_type: task
weight: 40
description: >-
  為名稱空間定義一個有效的 CPU 資源限制範圍，使得在該名稱空間中所有新建 Pod 的 CPU 資源是在你所設定的範圍內。
---

<!--
title: Configure Minimum and Maximum CPU Constraints for a Namespace
content_type: task
weight: 40
description: >-
  Define a range of valid CPU resource limits for a namespace, so that every new Pod
  in that namespace falls within the range you configure.
-->

<!-- overview -->

<!--
This page shows how to set minimum and maximum values for the CPU resources used by containers
and Pods in a {{< glossary_tooltip text="namespace" term_id="namespace" >}}. You specify minimum
and maximum CPU values in a
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
object. If a Pod does not meet the constraints imposed by the LimitRange, it cannot be created
in the namespace.
-->
本頁介紹如何為{{< glossary_tooltip text="名稱空間" term_id="namespace" >}}中的容器和 Pod
設定其所使用的 CPU 資源的最小和最大值。
你可以透過
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
物件宣告 CPU 的最小和最大值.
如果 Pod 不能滿足 LimitRange 的限制，就無法在該名稱空間中被建立。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} 

<!--
You must have access to create namespaces in your cluster.

Each node in your cluster must have at least 1.0 CPU available for Pods.
See [meaning of CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
to learn what Kubernetes means by “1 CPU”.
-->
在你的集群裡你必須要有建立名稱空間的許可權。

叢集中的每個節點都必須至少有 1.0 個 CPU 可供 Pod 使用。

請閱讀 [CPU 的含義](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
理解 "1 CPU" 在 Kubernetes 中的含義。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 建立名稱空間

建立一個名稱空間，以便本練習中建立的資源和叢集的其餘資源相隔離。

```shell
kubectl create namespace constraints-cpu-example
```

<!--
## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}:
-->
## 建立 LimitRange 和 Pod

以下為 {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} 的示例清單：

{{< codenew file="admin/resource/cpu-constraints.yaml" >}}

<!--
Create the LimitRange:
-->
建立 LimitRange:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints.yaml --namespace=constraints-cpu-example
```

<!--
View detailed information about the LimitRange:
-->
檢視 LimitRange 詳情：

```shell
kubectl get limitrange cpu-min-max-demo-lr --output=yaml --namespace=constraints-cpu-example
```

<!--
The output shows the minimum and maximum CPU constraints as expected. But
notice that even though you didn't specify default values in the configuration
file for the LimitRange, they were created automatically.
-->
輸出結果顯示 CPU 的最小和最大限制符合預期。但需要注意的是，儘管你在 LimitRange 
的配置檔案中你沒有宣告預設值，預設值也會被自動建立。

```yaml
limits:
- default:
    cpu: 800m
  defaultRequest:
    cpu: 800m
  max:
    cpu: 800m
  min:
    cpu: 200m
  type: Container
```

<!--
Now whenever you create a Pod in the constraints-cpu-example namespace (or some other client
of the Kubernetes API creates an equivalent Pod), Kubernetes performs these steps:

* If any container in that Pod does not specify its own CPU request and limit, the control plane
  assigns the default CPU request and limit to that container.

* Verify that every container in that Pod specifies a CPU request that is greater than or equal to 200 millicpu.

* Verify that every container in that Pod specifies a CPU limit that is less than or equal to 800 millicpu.
-->

現在，每當你在 constraints-mem-example 名稱空間中建立 Pod 時，或者某些其他的
Kubernetes API 客戶端建立了等價的 Pod 時，Kubernetes 就會執行下面的步驟：

* 如果 Pod 中的任何容器未宣告自己的 CPU 請求和限制，控制面將為該容器設定預設的 CPU 請求和限制。

* 確保該 Pod 中的每個容器的 CPU 請求至少 200 millicpu。

* 確保該 Pod 中每個容器 CPU 請求不大於 800 millicpu。

<!--
When creating a `LimitRange` object, you can specify limits on huge-pages
or GPUs as well. However, when both `default` and `defaultRequest` are specified
on these resources, the two values must be the same.
-->
{{< note >}}
當建立 LimitRange 物件時，你也可以宣告大頁面和 GPU 的限制。
當這些資源同時聲明瞭 'default' 和 'defaultRequest' 引數時，兩個引數值必須相同。
{{< /note >}}

<!--
Here's a manifest for a Pod that has one container. The container manifest
specifies a CPU request of 500 millicpu and a CPU limit of 800 millicpu. These satisfy the
minimum and maximum CPU constraints imposed by the LimitRange for this namespace.
-->
以下為某個僅包含一個容器的 Pod 的清單。
該容器聲明瞭 CPU 請求 500 millicpu 和 CPU 限制 800 millicpu 。
這些引數滿足了 LimitRange 物件為此名字空間規定的 CPU 最小和最大限制。

{{< codenew file="admin/resource/cpu-constraints-pod.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod.yaml --namespace=constraints-cpu-example
```

<!--
Verify that the Pod is running and that its container is healthy:
-->
確認 Pod 正在執行，並且其容器處於健康狀態：

```shell
kubectl get pod constraints-cpu-demo --namespace=constraints-cpu-example
```

<!--
View detailed information about the Pod:
-->
檢視 Pod 的詳情：

```shell
kubectl get pod constraints-cpu-demo --output=yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod's only container has a CPU request of 500 millicpu and CPU limit
of 800 millicpu. These satisfy the constraints imposed by the LimitRange.
-->
輸出結果顯示該 Pod 的容器的 CPU 請求為 500 millicpu，CPU 限制為 800 millicpu。
這些引數滿足 LimitRange 規定的限制範圍。

```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 500m
```

<!--
## Delete the Pod
-->
## 刪除 Pod

```shell
kubectl delete pod constraints-cpu-demo --namespace=constraints-cpu-example
```

<!--
## Attempt to create a Pod that exceeds the maximum CPU constraint

Here's the configuration file for a Pod that has one Container. The Container specifies a
CPU request of 500 millicpu and a cpu limit of 1.5 cpu.
-->
## 嘗試建立一個超過最大 CPU 限制的 Pod

這裡給出了包含一個容器的 Pod 的配置檔案。容器聲明瞭 500 millicpu 的 CPU 
請求和 1.5 CPU 的 CPU 限制。

{{< codenew file="admin/resource/cpu-constraints-pod-2.yaml" >}}

<!--
Attempt to create the Pod:
-->
嘗試建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-2.yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod does not get created, because it defines an unacceptable container.
That container is not acceptable because it specifies a CPU limit that is too large:
-->
輸出結果表明 Pod 沒有建立成功，因為其中定義了一個無法被接受的容器。
該容器之所以無法被接受是因為其中設定了過高的 CPU 限制值：

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-2.yaml":
pods "constraints-cpu-demo-2" is forbidden: maximum cpu usage per Container is 800m, but limit is 1500m.
```

<!--
## Attempt to create a Pod that does not meet the minimum CPU request

Here's a manifest for a Pod that has one container. The container specifies a
CPU request of 100 millicpu and a CPU limit of 800 millicpu.
-->
## 嘗試建立一個不滿足最小 CPU 請求的 Pod

以下為某個只有一個容器的 Pod 的清單。該容器聲明瞭 CPU 請求 100 millicpu 和 CPU 限制 800 millicpu。

{{< codenew file="admin/resource/cpu-constraints-pod-3.yaml" >}}

<!--
Attempt to create the Pod:
-->
嘗試建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-3.yaml --namespace=constraints-cpu-example
```

<!--
The output shows that the Pod does not get created, because it defines an unacceptable container.
That container is not acceptable because it specifies a CPU request that is lower than the
enforced minimum:
-->
輸出結果顯示 Pod 沒有建立成功，因為其中定義了一個無法被接受的容器。
該容器無法被接受的原因是其中所設定的 CPU 請求小於最小值的限制：

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-3.yaml":
pods "constraints-cpu-demo-4" is forbidden: minimum cpu usage per Container is 200m, but request is 100m.
```

<!--
## Create a Pod that does not specify any CPU request or limit

Here's a manifest for a Pod that has one container. The container does not
specify a CPU request, nor does it specify a CPU limit.
-->
## 建立一個沒有宣告 CPU 請求和 CPU 限制的 Pod

以下為一個只有一個容器的 Pod 的清單。該容器沒有宣告 CPU 請求，也沒有宣告 CPU 限制。

{{< codenew file="admin/resource/cpu-constraints-pod-4.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-4.yaml --namespace=constraints-cpu-example
```

<!--
View detailed information about the Pod:
-->
檢視 Pod 的詳情：

```
kubectl get pod constraints-cpu-demo-4 --namespace=constraints-cpu-example --output=yaml
```

<!--
The output shows that the Pod's single container has a CPU request of 800 millicpu and a
CPU limit of 800 millicpu.
How did that container get those values?
-->
輸出結果顯示 Pod 的唯一容器的 CPU 請求為 800 millicpu，CPU 限制為 800 millicpu。

容器是怎樣獲得這些數值的呢？


```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 800m
```

<!--
Because that container did not specify its own CPU request and limit, the control plane
applied the
[default CPU request and limit](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
from the LimitRange for this namespace.
-->
因為這一容器沒有宣告自己的 CPU 請求和限制，
控制面會根據名稱空間中配置 LimitRange
設定[預設的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)。

<!--
At this point, your Pod may or may not be running. Recall that a prerequisite for
this task is that your Nodes must have at least 1 CPU available for use. If each of your Nodes has only 1 CPU,
then there might not be enough allocatable CPU on any Node to accommodate a request of 800 millicpu. 
If you happen to be using Nodes with 2 CPU, then you probably have enough CPU to accommodate the 800 millicpu request.

Delete your Pod:
-->
此時，你的 Pod 可能已經執行起來也可能沒有執行起來。
回想一下我們本次任務的先決條件是你的每個節點都至少有 1 CPU。
如果你的每個節點都只有 1 CPU，那將沒有一個節點擁有足夠的可分配 CPU 來滿足 800 millicpu 的請求。
如果你在用的節點恰好有 2 CPU，那麼有可能有足夠的 CPU 來滿足 800 millicpu 的請求。

刪除你的 Pod：

```
kubectl delete pod constraints-cpu-demo-4 --namespace=constraints-cpu-example
```

<!--
## Enforcement of minimum and maximum CPU constraints

The maximum and minimum CPU constraints imposed on a namespace by a LimitRange are enforced only
when a Pod is created or updated. If you change the LimitRange, it does not affect
Pods that were created previously.
-->
## CPU 最小和最大限制的強制執行

只有當 Pod 建立或者更新時，LimitRange 為名稱空間規定的 CPU 最小和最大限制才會被強制執行。
如果你對 LimitRange 進行修改，那不會影響此前建立的 Pod。

<!--
## Motivation for minimum and maximum CPU constraints

As a cluster administrator, you might want to impose restrictions on the CPU resources that Pods can use.
For example:
-->
## 最小和最大 CPU 限制範圍的動機

作為叢集管理員，你可能想設定 Pod 可以使用的 CPU 資源限制。例如：

<!--
* Each Node in a cluster has 2 CPU. You do not want to accept any Pod that requests
more than 2 CPU, because no Node in the cluster can support the request.

* A cluster is shared by your production and development departments.
You want to allow production workloads to consume up to 3 CPU, but you want development workloads to be limited
to 1 CPU. You create separate namespaces for production and development, and you apply CPU constraints to
each namespace.
-->
* 叢集中的每個節點有兩個 CPU。你不想接受任何請求超過 2 個 CPU 的 Pod，因為叢集中沒有節點可以支援這種請求。
* 你的生產和開發部門共享一個叢集。你想允許生產工作負載消耗 3 個 CPU，
  而開發部門工作負載的消耗限制為 1 個 CPU。
  你可以為生產和開發建立不同的名稱空間，並且為每個名稱空間都應用 CPU 限制。

<!--
## Clean up

Delete your namespace:
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

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->

### 叢集管理員參考：

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

### 應用開發者參考：

* [為容器和 Pod 分配記憶體資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [為容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [為 Pod 配置服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)

