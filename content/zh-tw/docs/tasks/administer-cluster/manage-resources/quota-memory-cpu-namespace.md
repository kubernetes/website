---
title: 爲命名空間設定內存和 CPU 配額
content_type: task
weight: 50
description: >-
  爲命名空間定義總的 CPU 和內存資源限制。
---

<!--
title: Configure Memory and CPU Quotas for a Namespace
content_type: task
weight: 50
description: >-
  Define overall memory and CPU resource limits for a namespace.
-->

<!-- overview -->

<!--
This page shows how to set quotas for the total amount memory and CPU that
can be used by all Pods running in a {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
You specify quotas in a
[ResourceQuota](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
object.
-->
本文介紹如何爲{{< glossary_tooltip text="命名空間" term_id="namespace" >}}下運行的所有
Pod 設置總的內存和 CPU 配額。你可以通過使用 [ResourceQuota](/zh-cn/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
對象設置配額.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.

Each node in your cluster must have at least 1 GiB of memory.
-->
在你的叢集裏你必須要有創建命名空間的權限。

叢集中每個節點至少有 1 GiB 的內存。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 創建命名空間

創建一個命名空間，以便本練習中創建的資源和叢集的其餘部分相隔離。

```shell
kubectl create namespace quota-mem-cpu-example
```

<!--
## Create a ResourceQuota

Here is a manifest for an example ResourceQuota:
-->
## 創建 ResourceQuota

下面是 ResourceQuota 的示例清單：

{{% code_sample file="admin/resource/quota-mem-cpu.yaml" %}}

<!--
Create the ResourceQuota:
-->
創建 ResourceQuota：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu.yaml --namespace=quota-mem-cpu-example
```

<!--
View detailed information about the ResourceQuota:
-->
查看 ResourceQuota 詳情：

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

<!--
The ResourceQuota places these requirements on the quota-mem-cpu-example namespace:

* For every Pod in the namespace, each container must have a memory request, memory limit, cpu request, and cpu limit.
* The memory request total for all Pods in that namespace must not exceed 1 GiB.
* The memory limit total for all Pods in that namespace must not exceed 2 GiB.
* The CPU request total for all Pods in that namespace must not exceed 1 cpu.
* The CPU limit total for all Pods in that namespace must not exceed 2 cpu.

See [meaning of CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
to learn what Kubernetes means by “1 CPU”.
-->
ResourceQuota 在 quota-mem-cpu-example 命名空間中設置瞭如下要求：

* 在該命名空間中的每個 Pod 的所有容器都必須要有內存請求和限制，以及 CPU 請求和限制。
* 在該命名空間中所有 Pod 的內存請求總和不能超過 1 GiB。
* 在該命名空間中所有 Pod 的內存限制總和不能超過 2 GiB。
* 在該命名空間中所有 Pod 的 CPU 請求總和不能超過 1 cpu。
* 在該命名空間中所有 Pod 的 CPU 限制總和不能超過 2 cpu。

請閱讀 [CPU 的含義](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
理解 "1 CPU" 在 Kubernetes 中的含義。
<!--
## Create a Pod

Here is a manifest for an example Pod:
-->
## 創建 Pod

以下是 Pod 的示例清單：

{{% code_sample file="admin/resource/quota-mem-cpu-pod.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod.yaml --namespace=quota-mem-cpu-example
```

<!--
Verify that the Pod is running and that its (only) container is healthy:
-->
確認 Pod 正在運行，並且其容器處於健康狀態：

```shell
kubectl get pod quota-mem-cpu-demo --namespace=quota-mem-cpu-example
```

<!--
Once again, view detailed information about the ResourceQuota:
-->
再查看 ResourceQuota 的詳情：

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

<!--
The output shows the quota along with how much of the quota has been used.
You can see that the memory and CPU requests and limits for your Pod do not
exceed the quota.
-->
輸出結果顯示了配額以及有多少配額已經被使用。你可以看到 Pod 的內存和 CPU 請求值及限制值沒有超過配額。

```
status:
  hard:
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.cpu: "1"
    requests.memory: 1Gi
  used:
    limits.cpu: 800m
    limits.memory: 800Mi
    requests.cpu: 400m
    requests.memory: 600Mi
```

<!--
If you have the `jq` tool, you can also query (using [JSONPath](/docs/reference/kubectl/jsonpath/))
for just the `used` values, **and** pretty-print that that of the output. For example:
-->
如果有 `jq` 工具的話，你可以通過（使用 [JSONPath](/zh-cn/docs/reference/kubectl/jsonpath/)）
直接查詢 `used` 字段的值，並且輸出整齊的 JSON 格式。

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example -o jsonpath='{ .status.used }' | jq .
```

<!--
## Attempt to create a second Pod

Here is a manifest for a second Pod:
-->
## 嘗試創建第二個 Pod

以下爲第二個 Pod 的清單：

{{% code_sample file="admin/resource/quota-mem-cpu-pod-2.yaml" %}}

<!--
In the manifest, you can see that the Pod has a memory request of 700 MiB.
Notice that the sum of the used memory request and this new memory
request exceeds the memory request quota: 600 MiB + 700 MiB > 1 GiB.

Attempt to create the Pod:
-->

在清單中，你可以看到 Pod 的內存請求爲 700 MiB。
請注意新的內存請求與已經使用的內存請求之和超過了內存請求的配額：
600 MiB + 700 MiB > 1 GiB。

嘗試創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod-2.yaml --namespace=quota-mem-cpu-example
```

<!--
The second Pod does not get created. The output shows that creating the second Pod
would cause the memory request total to exceed the memory request quota.
-->
第二個 Pod 不能被創建成功。輸出結果顯示創建第二個 Pod 會導致內存請求總量超過內存請求配額。

```
Error from server (Forbidden): error when creating "examples/admin/resource/quota-mem-cpu-pod-2.yaml":
pods "quota-mem-cpu-demo-2" is forbidden: exceeded quota: mem-cpu-demo,
requested: requests.memory=700Mi,used: requests.memory=600Mi, limited: requests.memory=1Gi
```

<!--
## Discussion

As you have seen in this exercise, you can use a ResourceQuota to restrict
the memory request total for all Pods running in a namespace.
You can also restrict the totals for memory limit, cpu request, and cpu limit.

Instead of managing total resource use within a namespace, you might want to restrict
individual Pods, or the containers in those Pods. To achieve that kind of limiting, use a
[LimitRange](/docs/concepts/policy/limit-range/).
-->
## 討論

如你在本練習中所見，你可以用 ResourceQuota 限制命名空間中所有 Pod 的內存請求總量。
同樣你也可以限制內存限制總量、CPU 請求總量、CPU 限制總量。

除了可以管理命名空間資源使用的總和，如果你想限制單個 Pod，或者限制這些 Pod 中的容器資源，
可以使用 [LimitRange](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
實現這類的功能。

<!--
## Clean up

Delete your namespace:
-->
## 清理

刪除你的命名空間：

```shell
kubectl delete namespace quota-mem-cpu-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
### 叢集管理員參考

* [爲命名空間設定預設內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [爲命名空間設定預設 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [爲命名空間設定內存限制的最小值和最大值](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [爲命名空間設定 CPU 限制的最小值和最大值](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
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
* [分配 Pod 級別的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [爲容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [爲 Pod 設定服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
