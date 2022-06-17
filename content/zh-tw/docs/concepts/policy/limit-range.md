---
title: 限制範圍
content_type: concept
weight: 10
---

<!-- overview -->

<!--
By default, containers run with unbounded [compute resources](/docs/concepts/configuration/manage-resources-containers/) on a Kubernetes cluster.
With resource quotas, cluster administrators can restrict resource consumption and creation on a {{< glossary_tooltip text="namespace" term_id="namespace" >}} basis.
Within a namespace, a Pod or Container can consume as much CPU and memory as defined by the namespace's resource quota. There is a concern that one Pod or Container could monopolize all available resources. A LimitRange is a policy to constrain resource allocations (to Pods or Containers) in a namespace.
-->
預設情況下， Kubernetes 叢集上的容器執行使用的[計算資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)沒有限制。
使用資源配額，叢集管理員可以以{{< glossary_tooltip text="名字空間" term_id="namespace" >}}為單位，限制其資源的使用與建立。
在名稱空間中，一個 Pod 或 Container 最多能夠使用名稱空間的資源配額所定義的 CPU 和記憶體用量。
有人擔心，一個 Pod 或 Container 會壟斷所有可用的資源。
LimitRange 是在名稱空間內限制資源分配（給多個 Pod 或 Container）的策略物件。

<!-- body -->

<!--
A _LimitRange_ provides constraints that can:

- Enforce minimum and maximum compute resources usage per Pod or Container in a namespace.
- Enforce minimum and maximum storage request per PersistentVolumeClaim in a namespace.
- Enforce a ratio between request and limit for a resource in a namespace.
- Set default request/limit for compute resources in a namespace and automatically inject them to Containers at runtime.
-->

一個 _LimitRange（限制範圍）_ 物件提供的限制能夠做到：

- 在一個名稱空間中實施對每個 Pod 或 Container 最小和最大的資源使用量的限制。
- 在一個名稱空間中實施對每個 PersistentVolumeClaim 能申請的最小和最大的儲存空間大小的限制。
- 在一個名稱空間中實施對一種資源的申請值和限制值的比值的控制。
- 設定一個名稱空間中對計算資源的預設申請/限制值，並且自動的在執行時注入到多個 Container 中。

<!--
## Enabling LimitRange

LimitRange support has been enabled by default since Kubernetes 1.10.

LimitRange support is enabled by default for many Kubernetes distributions.
-->
## 啟用 LimitRange

對 LimitRange 的支援自 Kubernetes 1.10 版本預設啟用。

LimitRange 支援在很多 Kubernetes 發行版本中也是預設啟用的。

<!--
The name of a LimitRange object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
LimitRange 的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
### Overview of Limit Range

- The administrator creates one `LimitRange` in one namespace.
- Users create resources like Pods, Containers, and PersistentVolumeClaims in the namespace.
- The `LimitRanger` admission controller enforces defaults and limits for all Pods and Containers that do not set compute resource requirements and tracks usage to ensure it does not exceed resource minimum, maximum and ratio defined in any LimitRange present in the namespace.
- If creating or updating a resource (Pod, Container, PersistentVolumeClaim) that violates a LimitRange constraint, the request to the API server will fail with an HTTP status code `403 FORBIDDEN` and a message explaining the constraint that have been violated.
- If a LimitRange is activated in a namespace for compute resources like `cpu` and `memory`, users must specify
  requests or limits for those values. Otherwise, the system may reject Pod creation.
- LimitRange validations occurs only at Pod Admission stage, not on Running Pods.
-->
### 限制範圍總覽

- 管理員在一個名稱空間內建立一個 `LimitRange` 物件。
- 使用者在名稱空間內建立 Pod ，Container 和 PersistentVolumeClaim 等資源。
- `LimitRanger` 准入控制器對所有沒有設定計算資源需求的 Pod 和 Container 設定預設值與限制值，
  並跟蹤其使用量以保證沒有超出名稱空間中存在的任意 LimitRange 物件中的最小、最大資源使用量以及使用量比值。
- 若建立或更新資源（Pod、 Container、PersistentVolumeClaim）違反了 LimitRange 的約束，
  向 API 伺服器的請求會失敗，並返回 HTTP 狀態碼 `403 FORBIDDEN` 與描述哪一項約束被違反的訊息。
- 若名稱空間中的 LimitRange 啟用了對 `cpu` 和 `memory` 的限制，
  使用者必須指定這些值的需求使用量與限制使用量。否則，系統將會拒絕建立 Pod。
- LimitRange 的驗證僅在 Pod 准入階段進行，不對正在執行的 Pod 進行驗證。

<!--
Examples of policies that could be created using limit range are:

- In a 2 node cluster with a capacity of 8 GiB RAM and 16 cores, constrain Pods in a namespace to request 100m of CPU with a max limit of 500m for CPU and request 200Mi for Memory with a max limit of 600Mi for Memory.
- Define default CPU limit and request to 150m and memory default request to 300Mi for Containers started with no cpu and memory requests in their specs.
-->
能夠使用限制範圍建立的策略示例有：

- 在一個有兩個節點，8 GiB 記憶體與16個核的叢集中，限制一個名稱空間的 Pod 申請
  100m 單位，最大 500m 單位的 CPU，以及申請 200Mi，最大 600Mi 的記憶體。
- 為 spec 中沒有 cpu 和記憶體需求值的 Container 定義預設 CPU 限制值與需求值
  150m，記憶體預設需求值 300Mi。

<!--
In the case where the total limits of the namespace is less than the sum of the limits of the Pods/Containers,
there may be contention for resources. In this case, the Containers or Pods will not be created.
-->
在名稱空間的總限制值小於 Pod 或 Container 的限制值的總和的情況下，可能會產生資源競爭。
在這種情況下，將不會建立 Container 或 Pod。

<!--
Neither contention nor changes to a LimitRange will affect already created resources.
-->
競爭和對 LimitRange 的改變都不會影響任何已經建立了的資源。

## {{% heading "whatsnext" %}}

<!--
See [LimitRanger design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md) for more information.
-->
參閱 [LimitRanger 設計文件](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md)獲取更多資訊。

<!--
For examples on using limits, see:

- See [how to configure minimum and maximum CPU constraints per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/).
- See [how to configure minimum and maximum Memory constraints per namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/).
- See [how to configure default CPU Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/).
- See [how to configure default Memory Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/).
- Check [how to configure minimum and maximum Storage consumption per namespace](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage).
- See a [detailed example on configuring quota per namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/).
-->
關於使用限值的例子，可參看

- [如何配置每個名稱空間最小和最大的 CPU 約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)。
- [如何配置每個名稱空間最小和最大的記憶體約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)。
- [如何配置每個名稱空間預設的 CPU 申請值和限制值](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)。
- [如何配置每個名稱空間預設的記憶體申請值和限制值](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。
- [如何配置每個名稱空間最小和最大儲存使用量](/zh-cn/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage)。
- [配置每個名稱空間的配額的詳細例子](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)。

