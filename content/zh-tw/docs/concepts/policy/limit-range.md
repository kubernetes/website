---
title: 限制範圍（LimitRange）
api_metadata:
- apiVersion: "v1"
  kind: "LimitRange"
content_type: concept
weight: 10
---
<!--
reviewers:
- nelvadas
title: Limit Ranges
api_metadata:
- apiVersion: "v1"
  kind: "LimitRange"
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
By default, containers run with unbounded
[compute resources](/docs/concepts/configuration/manage-resources-containers/) on a Kubernetes cluster.
Using  Kubernetes [resource quotas](/docs/concepts/policy/resource-quotas/),
administrators (also termed _cluster operators_) can restrict consumption and creation
of cluster resources (such as CPU time, memory, and persistent storage) within a specified
{{< glossary_tooltip text="namespace" term_id="namespace" >}}.
Within a namespace, a {{< glossary_tooltip text="Pod" term_id="Pod" >}} can consume as much CPU and memory
as is allowed by the ResourceQuotas that apply to that namespace.
As a cluster operator, or as a namespace-level administrator, you might also be concerned
about making sure that a single object cannot monopolize all available resources within a namespace.

A LimitRange is a policy to constrain the resource allocations (limits and requests) that you can specify for
each applicable object kind (such as Pod or {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}})
in a namespace.
-->
默認情況下， Kubernetes 叢集上的容器運行使用的[計算資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)沒有限制。
使用 Kubernetes [資源配額](/zh-cn/docs/concepts/policy/resource-quotas/)，
管理員（也稱爲**叢集操作者**）可以在一個指定的{{< glossary_tooltip text="命名空間" term_id="namespace" >}}內限制叢集資源的使用與創建。
在命名空間中，一個 {{< glossary_tooltip text="Pod" term_id="Pod" >}} 最多能夠使用命名空間的資源配額所定義的 CPU 和內存用量。
作爲叢集操作者或命名空間級的管理員，你可能也會擔心如何確保一個 Pod 不會壟斷命名空間內所有可用的資源。

LimitRange 是限制命名空間內可爲每個適用的對象類別
（例如 Pod 或 {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}）
指定的資源分配量（限制和請求）的策略對象。

<!-- body -->

<!--
A _LimitRange_ provides constraints that can:

- Enforce minimum and maximum compute resources usage per Pod or Container in a namespace.
- Enforce minimum and maximum storage request per
  {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} in a namespace.
- Enforce a ratio between request and limit for a resource in a namespace.
- Set default request/limit for compute resources in a namespace and automatically
  inject them to Containers at runtime.
-->
一個 **LimitRange（限制範圍）** 對象提供的限制能夠做到：

- 在一個命名空間中實施對每個 Pod 或 Container 最小和最大的資源使用量的限制。
- 在一個命名空間中實施對每個 {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
  能申請的最小和最大的存儲空間大小的限制。
- 在一個命名空間中實施對一種資源的申請值和限制值的比值的控制。
- 設置一個命名空間中對計算資源的默認申請/限制值，並且自動的在運行時注入到多個 Container 中。

<!--
Kubernetes constrains resource allocations to Pods in a particular namespace
whenever there is at least one LimitRange object in that namespace.
-->
只要特定命名空間中至少有一個 LimitRange 對象，Kubernetes 就會限制對該命名空間中的
Pod 的資源分配。

<!--
The name of a LimitRange object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
LimitRange 的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
## Constraints on resource limits and requests

- The administrator creates a LimitRange in a namespace.
- Users create (or try to create) objects in that namespace, such as Pods or
  PersistentVolumeClaims.
- First, the LimitRange admission controller applies default request and limit values
  for all Pods (and their containers) that do not set compute resource requirements.
- Second, the LimitRange tracks usage to ensure it does not exceed resource minimum,
  maximum and ratio defined in any LimitRange present in the namespace.
- If you attempt to create or update an object (Pod or PersistentVolumeClaim) that violates
  a LimitRange constraint, your request to the API server will fail with an HTTP status
  code `403 Forbidden` and a message explaining the constraint that has been violated.
- If you add a LimitRange in a namespace that applies to compute-related resources
  such as `cpu` and `memory`, you must specify requests or limits for those values.
  Otherwise, the system may reject Pod creation.
- LimitRange validations occur only at Pod admission stage, not on running Pods.
  If you add or modify a LimitRange, the Pods that already exist in that namespace
  continue unchanged.
- If two or more LimitRange objects exist in the namespace, it is not deterministic
  which default value will be applied.
-->
## 資源限制和請求的約束   {#constraints-on-resource-limits-and-requests}

- 管理員在一個命名空間內創建一個 LimitRange 對象。
- 使用者在此命名空間內創建（或嘗試創建） Pod 和 PersistentVolumeClaim 等對象。
- 首先，LimitRange 准入控制器對所有沒有設置計算資源需求的所有 Pod（及其容器）設置默認請求值與限制值。
- 其次，LimitRange 跟蹤其使用量以保證沒有超出命名空間中存在的任意 LimitRange 所定義的最小、最大資源使用量以及使用量比值。
- 若嘗試創建或更新的對象（Pod 和 PersistentVolumeClaim）違反了 LimitRange 的約束，
  向 API 伺服器的請求會失敗，並返回 HTTP 狀態碼 `403 Forbidden` 以及描述哪一項約束被違反的消息。
- 若你在命名空間中添加 LimitRange 啓用了對 `cpu` 和 `memory` 等計算相關資源的限制，
  你必須指定這些值的請求使用量與限制使用量。否則，系統將會拒絕創建 Pod。
- LimitRange 的驗證僅在 Pod 准入階段進行，不對正在運行的 Pod 進行驗證。
  如果你添加或修改 LimitRange，命名空間中已存在的 Pod 將繼續不變。
- 如果命名空間中存在兩個或更多 LimitRange 對象，應用哪個默認值是不確定的。

<!--
## LimitRange and admission checks for Pods

A LimitRange does **not** check the consistency of the default values it applies.
This means that a default value for the _limit_ that is set by LimitRange may be
less than the _request_ value specified for the container in the spec that a client
submits to the API server. If that happens, the final Pod will not be schedulable.

For example, you define a LimitRange with this manifest:
-->
## Pod 的 LimitRange 和准入檢查     {#limitrange-and-admission-checks-for-pod}

LimitRange **不**檢查所應用的默認值的一致性。
這意味着 LimitRange 設置的 **limit** 的默認值可能小於客戶端提交給 API 伺服器的規約中爲容器指定的 **request** 值。
如果發生這種情況，最終 Pod 將無法調度。

例如，你使用如下清單定義一個 LimitRange：

{{< note >}}
<!--
The following examples operate within the default namespace of your cluster, as the namespace
parameter is undefined and the LimitRange scope is limited to the namespace level.
This implies that any references or operations within these examples will interact
with elements within the default namespace of your cluster. You can override the
operating namespace by configuring namespace in the `metadata.namespace` field.
-->
以下示例在叢集的 default 命名空間內運行，因爲命名空間參數未定義，並且
LimitRange 範圍僅限於命名空間級別。
這意味着這些示例中的任何引用或操作都將與叢集的 default 命名空間中的元素進行交互。
你可以通過在 `metadata.namespace` 字段中設定命名空間來覆蓋要使用的命名空間。
{{< /note >}}

{{% code_sample file="concepts/policy/limit-range/problematic-limit-range.yaml" %}}

<!--
along with a Pod that declares a CPU resource request of `700m`, but not a limit:
-->
以及一個聲明 CPU 資源請求爲 `700m` 但未聲明限制值的 Pod：

{{% code_sample file="concepts/policy/limit-range/example-conflict-with-limitrange-cpu.yaml" %}}

<!--
then that Pod will not be scheduled, failing with an error similar to:
-->
那麼該 Pod 將不會被調度，失敗並出現類似以下的錯誤：

```
Pod "example-conflict-with-limitrange-cpu" is invalid: spec.containers[0].resources.requests: Invalid value: "700m": must be less than or equal to cpu limit
```

<!--
If you set both `request` and `limit`, then that new Pod will be scheduled successfully
even with the same LimitRange in place:
-->
如果你同時設置了 `request` 和 `limit`，那麼即使使用相同的 LimitRange，新 Pod 也會被成功調度：

{{% code_sample file="concepts/policy/limit-range/example-no-conflict-with-limitrange-cpu.yaml" %}}

<!--
## Example resource constraints

Examples of policies that could be created using LimitRange are:

- In a 2 node cluster with a capacity of 8 GiB RAM and 16 cores, constrain Pods in a
  namespace to request 100m of CPU with a max limit of 500m for CPU and request 200Mi
  for Memory with a max limit of 600Mi for Memory.
- Define default CPU limit and request to 150m and memory default request to 300Mi for
  Containers started with no cpu and memory requests in their specs.
-->
## 資源約束示例   {#example-resource-constraints}

能夠使用限制範圍創建的策略示例有：

- 在一個有兩個節點，8 GiB 內存與16個核的叢集中，限制一個命名空間的 Pod 申請
  100m 單位，最大 500m 單位的 CPU，以及申請 200Mi，最大 600Mi 的內存。
- 爲 spec 中沒有 cpu 和內存需求值的 Container 定義默認 CPU 限制值與需求值
  150m，內存默認需求值 300Mi。

<!--
In the case where the total limits of the namespace is less than the sum of the limits
of the Pods/Containers, there may be contention for resources. In this case, the
Containers or Pods will not be created.
-->
在命名空間的總限制值小於 Pod 或 Container 的限制值的總和的情況下，可能會產生資源競爭。
在這種情況下，將不會創建 Container 或 Pod。

<!--
Neither contention nor changes to a LimitRange will affect already created resources.
-->
競爭和對 LimitRange 的改變都不會影響任何已經創建了的資源。

## {{% heading "whatsnext" %}}

<!--
For examples on using limits, see:

- [how to configure minimum and maximum CPU constraints per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/).
- [how to configure minimum and maximum Memory constraints per namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/).
- [how to configure default CPU Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/).
- [how to configure default Memory Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/).
- [how to configure minimum and maximum Storage consumption per namespace](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage).
- a [detailed example on configuring quota per namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/).

Refer to the [LimitRanger design document](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md)
for context and historical information.
-->
關於使用限值的例子，可參閱：

- [如何設定每個命名空間最小和最大的 CPU 約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)。
- [如何設定每個命名空間最小和最大的內存約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)。
- [如何設定每個命名空間默認的 CPU 申請值和限制值](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)。
- [如何設定每個命名空間默認的內存申請值和限制值](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。
- [如何設定每個命名空間最小和最大存儲使用量](/zh-cn/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage)。
- [設定每個命名空間的配額的詳細例子](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)。

有關上下文和歷史信息，請參閱
[LimitRanger 設計文檔](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md)。
