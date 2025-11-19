---
title: API 發起的驅逐
content_type: concept
weight: 110
---
<!--
title: API-initiated Eviction
content_type: concept
weight: 110
-->

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

<!--
You can request eviction by calling the Eviction API directly, or programmatically
using a client of the {{<glossary_tooltip term_id="kube-apiserver" text="API server">}}, like the `kubectl drain` command. This
creates an `Eviction` object, which causes the API server to terminate the Pod.

API-initiated evictions respect your configured [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
and [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

Using the API to create an Eviction object for a Pod is like performing a
policy-controlled [`DELETE` operation](/docs/reference/kubernetes-api/workload-resources/pod-v1/#delete-delete-a-pod)
on the Pod.
-->
你可以通過直接調用 Eviction API 發起驅逐，也可以通過編程的方式使用
{{<glossary_tooltip term_id="kube-apiserver" text="API 服務器">}}的客戶端來發起驅逐，
比如 `kubectl drain` 命令。
此操作創建一個 `Eviction` 對象，該對象再驅動 API 服務器終止選定的 Pod。

API 發起的驅逐將遵從你的
[`PodDisruptionBudgets`](/zh-cn/docs/tasks/run-application/configure-pdb/)
和 [`terminationGracePeriodSeconds`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-termination)
配置。

使用 API 創建 Eviction 對象，就像對 Pod 執行策略控制的
[`DELETE` 操作](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#delete-delete-a-pod)

<!--
## Calling the Eviction API

You can use a [Kubernetes language client](/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api)
to access the Kubernetes API and create an `Eviction` object. To do this, you
POST the attempted operation, similar to the following example:
-->
## 調用 Eviction API   {#calling-eviction-api}

你可以使用 [Kubernetes 語言客戶端](/zh-cn/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api)
來訪問 Kubernetes API 並創建 `Eviction` 對象。
要執行此操作，你應該用 POST 發出要嘗試的請求，類似於下面的示例：

{{< tabs name="Eviction_example" >}}
{{% tab name="policy/v1" %}}
{{< note >}}
<!--
`policy/v1` Eviction is available in v1.22+. Use `policy/v1beta1` with prior releases.
-->
`policy/v1` 版本的 Eviction 在 v1.22 以及更高的版本中可用，之前的發行版本使用 `policy/v1beta1` 版本。
{{< /note >}}

```json
{
  "apiVersion": "policy/v1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{% tab name="policy/v1beta1" %}}
{{< note >}}
<!--
Deprecated in v1.22 in favor of `policy/v1`
-->
在 v1.22 版本廢棄以支持 `policy/v1`。
{{< /note >}}

```json
{
  "apiVersion": "policy/v1beta1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
Alternatively, you can attempt an eviction operation by accessing the API using
`curl` or `wget`, similar to the following example:
-->
或者，你可以通過使用 `curl` 或者 `wget` 來訪問 API 以嘗試驅逐操作，類似於以下示例：

```bash
curl -v -H 'Content-type: application/json' https://your-cluster-api-endpoint.example/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

<!--
## How API-initiated eviction works

When you request an eviction using the API, the API server performs admission
checks and responds in one of the following ways:
-->
## API 發起驅逐的工作原理   {#how-api-initiated-eviction-works}

當你使用 API 來請求驅逐時，API 服務器將執行准入檢查，並通過以下方式之一做出響應：

<!--
* `200 OK`: the eviction is allowed, the `Eviction` subresource is created, and
  the Pod is deleted, similar to sending a `DELETE` request to the Pod URL.
* `429 Too Many Requests`: the eviction is not currently allowed because of the
  configured {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}.
  You may be able to attempt the eviction again later. You might also see this
  response because of API rate limiting.
* `500 Internal Server Error`: the eviction is not allowed because there is a
  misconfiguration, like if multiple PodDisruptionBudgets reference the same Pod.
-->
* `200 OK`：允許驅逐，子資源 `Eviction` 被創建，並且 Pod 被刪除，
  類似於發送一個 `DELETE` 請求到 Pod 地址。
* `429 Too Many Requests`：當前不允許驅逐，因爲配置了
  {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}。
  你可以稍後再嘗試驅逐。你也可能因爲 API 速率限制而看到這種響應。
* `500 Internal Server Error`：不允許驅逐，因爲存在配置錯誤，
  例如存在多個 PodDisruptionBudgets 引用同一個 Pod。

<!--
If the Pod you want to evict isn't part of a workload that has a
PodDisruptionBudget, the API server always returns `200 OK` and allows the
eviction.

If the API server allows the eviction, the Pod is deleted as follows:
-->
如果你想驅逐的 Pod 不屬於有 PodDisruptionBudget 的工作負載，
API 服務器總是返回 `200 OK` 並且允許驅逐。

如果 API 服務器允許驅逐，Pod 按照如下方式刪除：

<!--
1. The `Pod` resource in the API server is updated with a deletion timestamp,
   after which the API server considers the `Pod` resource to be terminated. The
   `Pod` resource is also marked with the configured grace period.
1. The {{<glossary_tooltip term_id="kubelet" text="kubelet">}} on the node where the local Pod is running notices that the `Pod`
   resource is marked for termination and starts to gracefully shut down the
   local Pod.
1. While the kubelet is shutting the Pod down, the control plane removes the Pod
   from {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}
   objects. As a result, controllers no longer consider the Pod as a valid object.
1. After the grace period for the Pod expires, the kubelet forcefully terminates
   the local Pod.
1. The kubelet tells the API server to remove the `Pod` resource.
1. The API server deletes the `Pod` resource.
-->
1. API 服務器中的 `Pod` 資源會更新上刪除時間戳，之後 API 服務器會認爲此 `Pod` 資源將被終止。
   此 `Pod` 資源還會標記上配置的寬限期。
1. 本地運行狀態的 Pod 所處的節點上的 {{<glossary_tooltip term_id="kubelet" text="kubelet">}}
   注意到 `Pod` 資源被標記爲終止，並開始優雅停止本地 Pod。
1. 當 kubelet 停止 Pod 時，控制面從 {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}
   對象中移除該 Pod。因此，控制器不再將此 Pod 視爲有用對象。
1. Pod 的寬限期到期後，kubelet 強制終止本地 Pod。
1. kubelet 告訴 API 服務器刪除 `Pod` 資源。
1. API 服務器刪除 `Pod` 資源。

<!--
## Troubleshooting stuck evictions

In some cases, your applications may enter a broken state, where the Eviction
API will only return `429` or `500` responses until you intervene. This can
happen if, for example, a ReplicaSet creates pods for your application but new
pods do not enter a `Ready` state. You may also notice this behavior in cases
where the last evicted Pod had a long termination grace period.
-->
## 解決驅逐被卡住的問題   {#troubleshooting-stuck-evictions}

在某些情況下，你的應用可能進入中斷狀態，
在你干預之前，驅逐 API 總是返回 `429` 或 `500`。
例如，如果 ReplicaSet 爲你的應用程序創建了 Pod，
但新的 Pod 沒有進入 `Ready` 狀態，就會發生這種情況。
在最後一個被驅逐的 Pod 有很長的終止寬限期的情況下，你可能也會注意到這種行爲。

<!--
If you notice stuck evictions, try one of the following solutions:

* Abort or pause the automated operation causing the issue. Investigate the stuck
  application before you restart the operation.
* Wait a while, then directly delete the Pod from your cluster control plane
  instead of using the Eviction API.
-->
如果你注意到驅逐被卡住，請嘗試以下解決方案之一：

* 終止或暫停導致問題的自動化操作，重新啓動操作之前，請檢查被卡住的應用程序。
* 等待一段時間後，直接從集羣控制平面刪除 Pod，而不是使用 Eviction API。

## {{% heading "whatsnext" %}}

<!--
* Learn how to protect your applications with a [Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
* Learn about [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Learn about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
-->
* 瞭解如何使用 [Pod 干擾預算](/zh-cn/docs/tasks/run-application/configure-pdb/)保護你的應用。
* 瞭解[節點壓力引發的驅逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)。
* 瞭解 [Pod 優先級和搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。
