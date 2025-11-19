---
title: 資源配額
api_metadata:
- apiVersion: "v1"
  kind: "ResourceQuota"
content_type: concept
weight: 20
---
<!--
reviewers:
- derekwaynecarr
title: Resource Quotas
api_metadata:
- apiVersion: "v1"
  kind: "ResourceQuota"
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
When several users or teams share a cluster with a fixed number of nodes,
there is a concern that one team could use more than its fair share of resources.

_Resource quotas_ are a tool for administrators to address this concern.
-->
當多個使用者或團隊共享具有固定節點數目的叢集時，人們會擔心有人使用超過其基於公平原則所分配到的資源量。

**資源配額**是幫助管理員解決這一問題的工具。

<!--
A resource quota, defined by a ResourceQuota object, provides constraints that limit
aggregate resource consumption per {{< glossary_tooltip text="namespace" term_id="namespace" >}}. A ResourceQuota can also
limit the [quantity of objects that can be created in a namespace](#quota-on-object-count) by API kind, as well as the total
amount of {{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}} that may be consumed by
API objects found in that namespace.
-->
資源配額，由 ResourceQuota 對象定義，
提供了限制每個{{< glossary_tooltip text="命名空間" term_id="namespace" >}}的資源總消耗的約束。
資源配額還可以限制在命名空間中可以創建的[對象數量](#quota-on-object-count)（按 API 類型計算），
以及該命名空間中存在的 API
對象可能消耗的{{< glossary_tooltip text="基礎設施資源" term_id="infrastructure-resource" >}}的總量。

{{< caution >}}
<!--
Neither contention nor changes to quota will affect already created resources.
-->
不同的資源爭用，或者資源配額的更改不會影響已經創建的資源。
{{< /caution >}}

<!-- body -->

<!--
## How Kubernetes ResourceQuotas work
-->
## Kubernetes ResourceQuota 的工作原理 {#how-kubernetes-resourcequotas-work}

<!--
ResourceQuotas work like this:
-->
ResourceQuota 的工作方式如下：

<!--
- Different teams work in different namespaces. This separation can be enforced with
  [RBAC](/docs/reference/access-authn-authz/rbac/) or any other [authorization](/docs/reference/access-authn-authz/authorization/)
  mechanism.

- A cluster administrator creates at least one ResourceQuota for each namespace.
  - To make sure the enforcement stays enforced, the cluster administrator should also restrict access to delete or update
    that ResourceQuota; for example, by defining a [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).
-->
- 不同團隊在不同的命名空間中工作。
  這種分離可以通過 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)
  或任何其他[鑑權](/zh-cn/docs/reference/access-authn-authz/authorization/)機制來強制執行。

- 叢集管理員爲每個命名空間創建至少一個 ResourceQuota。
  - 爲了確保強制執行不被解除，叢集管理員還應限制對刪除或更新此 ResourceQuota 的訪問；
    例如，通過定義一個[驗證准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)來實現這點。

<!--
- Users create resources (pods, services, etc.) in the namespace, and the quota system
  tracks usage to ensure it does not exceed hard resource limits defined in a ResourceQuota.

  You can apply a [scope](#quota-scopes) to a ResourceQuota to limit where it applies.

- If creating or updating a resource violates a quota constraint, the control plane rejects that request with HTTP
  status code `403 Forbidden`. The error includes a message explaining the constraint that would have been violated.
-->
- 當使用者在命名空間下創建資源（如 Pod、Service 等）時，Kubernetes 的配額系統會跟蹤叢集的資源使用情況，
  以確保使用的資源用量不超過 ResourceQuota 中定義的硬性資源限額。

  你可以對 ResourceQuota 應用一個[範圍](#quota-scopes)，以限制其適用的地方。

- 如果創建或更新資源違反了配額約束，控制平面將使用 HTTP 狀態碼
  `403 Forbidden` 拒絕該請求。錯誤信息包括解釋將要違反的約束的說明。

<!--
- If quotas are enabled in a namespace for {{< glossary_tooltip text="resource" term_id="infrastructure-resource" >}}
  such as `cpu` and `memory`, users must specify requests or limits for those values when they define a Pod; otherwise,
  the quota system may reject pod creation.

  The resource quota [walkthrough](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
  shows an example of how to avoid this problem.
-->
- 如果在命名空間中爲諸如 `cpu` 和 `memory`
  的{{< glossary_tooltip text="資源" term_id="infrastructure-resource" >}}啓用了配額，
  使用者在定義 Pod 時必須指定這些值的請求或限制；否則，配額系統可能會拒絕 Pod 創建。

  資源配額[演練](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)展示了一個如何避免此問題的示例。

{{< note >}}
<!--
* You can define a [LimitRange](/docs/concepts/policy/limit-range/)
  to force defaults on pods that make no compute resource requirements (so that users don't have to remember to do that).
->
* 可以定義 [LimitRange](/docs/concepts/policy/limit-range/) 強制
  Pod 在沒有計算資源需求的情況下設置默認值（這樣使用者就不必記住要這樣做）。
{{< /note >}}

<!--
You often do not create Pods directly; for example, you more usually create a [workload management](/docs/concepts/workloads/controllers/)
object such as a {{< glossary_tooltip term_id="deployment" >}}. If you create a Deployment that tries to use more
resources than are available, the creation of the Deployment (or other workload management object) **succeeds**, but
the Deployment may not be able to get all of the Pods it manages to exist. In that case you can check the status of
the Deployment, for example with `kubectl describe`, to see what has happened.
-->
你通常不會直接創建 Pod；例如，你更常創建一個[工作負載管理](/zh-cn/docs/concepts/workloads/controllers/)對象，
如 {{< glossary_tooltip term_id="deployment" >}}。
如果你創建了一個嘗試使用超出可用資源的 Deployment（或其他工作負載管理對象），
其創建**會成功**，但 Deployment 可能無法使其管理的所有 Pod 都運行起來。
在這種情況下，你可以使用 `kubectl describe` 等命令檢查 Deployment 的狀態，
以查看發生了什麼。

<!--
- For `cpu` and `memory` resources, ResourceQuotas enforce that **every**
  (new) pod in that namespace sets a limit for that resource.
  If you enforce a resource quota in a namespace for either `cpu` or `memory`,
  you, and other clients, **must** specify either `requests` or `limits` for that resource,
  for every new Pod you submit. If you don't, the control plane may reject admission
  for that Pod.
- For other resources: ResourceQuota works and will ignore pods in the namespace without
  setting a limit or request for that resource. It means that you can create a new pod
  without limit/request ephemeral storage if the resource quota limits the ephemeral
  storage of this namespace.

You can use a [LimitRange](/docs/concepts/policy/limit-range/) to automatically set
a default request for these resources.
-->
- 對於 `cpu` 和 `memory` 資源：ResourceQuota 強制該命名空間中的**每個**（新）Pod 爲該資源設置限制。
  如果你在命名空間中爲 `cpu` 和 `memory` 實施資源配額，
  你或其他客戶端**必須**爲你提交的每個新 Pod 指定該資源的 `requests` 或 `limits`。
  否則，控制平面可能會拒絕接納該 Pod
- 對於其他資源：ResourceQuota 可以工作，並且會忽略命名空間中的 Pod，而無需爲該資源設置限制或請求。
  這意味着，如果資源配額限制了此命名空間的臨時存儲，則可以創建沒有限制/請求臨時存儲的新 Pod。

你可以使用 [LimitRange](/zh-cn/docs/concepts/policy/limit-range/) 自動設置對這些資源的默認請求。

<!--
The name of a ResourceQuota object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
ResourceQuota 對象的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
Examples of policies that could be created using namespaces and quotas are:
-->
下面是使用命名空間和配額構建策略的示例：

<!--
- In a cluster with a capacity of 32 GiB RAM, and 16 cores, let team A use 20 GiB and 10 cores,
  let B use 10GiB and 4 cores, and hold 2GiB and 2 cores in reserve for future allocation.
- Limit the "testing" namespace to using 1 core and 1GiB RAM. Let the "production" namespace
  use any amount.
-->
- 在具有 32 GiB 內存和 16 核 CPU 資源的叢集中，允許 A 團隊使用 20 GiB 內存 和 10 核的 CPU 資源，
  允許 B 團隊使用 10 GiB 內存和 4 核的 CPU 資源，並且預留 2 GiB 內存和 2 核的 CPU 資源供將來分配。
- 限制 "testing" 命名空間使用 1 核 CPU 資源和 1GiB 內存。允許 "production" 命名空間使用任意數量。

<!--
In the case where the total capacity of the cluster is less than the sum of the quotas of the namespaces,
there may be contention for resources. This is handled on a first-come-first-served basis.
-->
在叢集容量小於各命名空間配額總和的情況下，可能存在資源競爭。資源競爭時，Kubernetes 系統會遵循先到先得的原則。

<!--
## Enabling Resource Quota

ResourceQuota support is enabled by default for many Kubernetes distributions. It is
enabled when the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
`--enable-admission-plugins=` flag has `ResourceQuota` as
one of its arguments.
-->
## 啓用資源配額  {#enabling-resource-quota}

ResourceQuota 的支持在很多 Kubernetes 版本中是默認啓用的。
當 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}
的命令列標誌 `--enable-admission-plugins=` 中包含 `ResourceQuota` 時，
資源配額會被啓用。

<!--
A resource quota is enforced in a particular namespace when there is a
ResourceQuota in that namespace.
-->
當命名空間中存在一個 ResourceQuota 對象時，對於該命名空間而言，資源配額就是開啓的。

<!--
## Types of resource quota

The ResourceQuota mechanism lets you enforce different kinds of limits. This
section describes the types of limit that you can enforce.

### Quota for infrastructure resources {#compute-resource-quota}

You can limit the total sum of
[compute resources](/docs/concepts/configuration/manage-resources-containers/)
that can be requested in a given namespace.
-->
## 資源配額的類型 {#types-of-resource-quota}

ResourceQuota 機制允許你執行不同類別的限制。本節說明你可以執行的限制類型。

### 基礎設施資源的配額  {#compute-resource-quota}

使用者可以對給定命名空間下的可被請求的[計算資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)總量進行限制。

<!--
The following resource types are supported:
-->
配額機制所支持的資源類型：

<!--
| Resource Name | Description |
| ------------- | ----------- |
| `limits.cpu` | Across all pods in a non-terminal state, the sum of CPU limits cannot exceed this value. |
| `limits.memory` | Across all pods in a non-terminal state, the sum of memory limits cannot exceed this value. |
| `requests.cpu` | Across all pods in a non-terminal state, the sum of CPU requests cannot exceed this value. |
| `requests.memory` | Across all pods in a non-terminal state, the sum of memory requests cannot exceed this value. |
| `hugepages-<size>` | Across all pods in a non-terminal state, the number of huge page requests of the specified size cannot exceed this value. |
| `cpu` | Same as `requests.cpu` |
| `memory` | Same as `requests.memory` |
-->
| 資源名稱 | 描述 |
| ------------- | ----------- |
| `limits.cpu` | 所有非終止狀態的 Pod，其 CPU 限額總量不能超過該值。 |
| `limits.memory` | 所有非終止狀態的 Pod，其內存限額總量不能超過該值。 |
| `requests.cpu` | 所有非終止狀態的 Pod，其 CPU 需求總量不能超過該值。 |
| `requests.memory` | 所有非終止狀態的 Pod，其內存需求總量不能超過該值。 |
| `hugepages-<size>` | 對於所有非終止狀態的 Pod，針對指定尺寸的巨頁請求總數不能超過此值。 |
| `cpu` | 與 `requests.cpu` 相同。 |
| `memory` | 與 `requests.memory` 相同。 |

<!--
### Quota for extended resources

In addition to the resources mentioned above, in release 1.10, quota support for
[extended resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources) is added.
-->
### 擴展資源的配額  {#quota-for-extended-resources}

除上述資源外，在 Kubernetes 1.10 版本中，
還添加了對[擴展資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)的支持。

<!--
As overcommit is not allowed for extended resources, it makes no sense to specify both `requests`
and `limits` for the same extended resource in a quota. So for extended resources, only quota items
with prefix `requests.` are allowed.
-->
由於擴展資源不可超量分配，因此沒有必要在配額中爲同一擴展資源同時指定 `requests` 和 `limits`。
對於擴展資源而言，僅允許使用前綴爲 `requests.` 的配額項。

<!--
Take the GPU resource as an example, if the resource name is `nvidia.com/gpu`, and you want to
limit the total number of GPUs requested in a namespace to 4, you can define a quota as follows:
-->
以 GPU 拓展資源爲例，如果資源名稱爲 `nvidia.com/gpu`，並且要將命名空間中請求的 GPU
資源總數限制爲 4，則可以如下定義配額：

* `requests.nvidia.com/gpu: 4`

<!--
See [Viewing and Setting Quotas](#viewing-and-setting-quotas) for more details.
-->
有關更多詳細信息，請參閱[查看和設置配額](#viewing-and-setting-quotas)。

<!--
### Quota for storage

You can limit the total sum of [storage](/docs/concepts/storage/persistent-volumes/) for volumes
that can be requested in a given namespace.

In addition, you can limit consumption of storage resources based on associated
[StorageClass](/docs/concepts/storage/storage-classes/).
-->
## 存儲的配額  {#quota-for-storage}

你可以對給定命名空間下可以請求的[存儲卷](/zh-cn/docs/concepts/storage/persistent-volumes/)總量進行限制。

此外，你還可以基於關聯的 [StorageClass](/zh-cn/docs/concepts/storage/storage-classes/) 來限制存儲資源的消耗。

<!--
| Resource Name | Description |
| ------------- | ----------- |
| `requests.storage` | Across all persistent volume claims, the sum of storage requests cannot exceed this value. |
| `persistentvolumeclaims` | The total number of [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | Across all persistent volume claims associated with the `<storage-class-name>`, the sum of storage requests cannot exceed this value. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | Across all persistent volume claims associated with the `<storage-class-name>`, the total number of [persistent volume claims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
-->
| 資源名稱 | 描述 |
| ------------- | ----------- |
| `requests.storage` | 所有 PVC，存儲資源的需求總量不能超過該值。 |
| `persistentvolumeclaims` | 在該命名空間中所允許的 [PVC](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) 總量。 |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | 在所有與 `<storage-class-name>` 相關的持久卷申領中，存儲請求的總和不能超過該值。 |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | 在與 storage-class-name 相關的所有持久卷申領中，命名空間中可以存在的[持久卷申領](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)總數。 |

<!--
For example, if you want to quota storage with `gold` StorageClass separate from
a `bronze` StorageClass, you can define a quota as follows:
-->
例如，如果你想要將 `gold` StorageClass 與 `bronze` StorageClass 分開進行存儲配額設定，
則可以按如下方式定義配額：

* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

<!--
#### Quota for local ephemeral storage
-->
#### 本地臨時存儲的配額

{{< feature-state for_k8s_version="v1.8" state="alpha" >}}

<!--
| Resource Name | Description |
| ------------- | ----------- |
| `requests.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage requests cannot exceed this value. |
| `limits.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage limits cannot exceed this value. |
| `ephemeral-storage` | Same as `requests.ephemeral-storage`. |
-->
| 資源名稱 | 描述 |
| ------------- | ----------- |
| `requests.ephemeral-storage` | 在命名空間的所有 Pod 中，本地臨時存儲請求的總和不能超過此值。 |
| `limits.ephemeral-storage` | 在命名空間的所有 Pod 中，本地臨時存儲限制值的總和不能超過此值。 |
| `ephemeral-storage` | 與 `requests.ephemeral-storage` 相同。 |

{{< note >}}
<!--
When using a CRI container runtime, container logs will count against the ephemeral storage quota.
This can result in the unexpected eviction of pods that have exhausted their storage quotas.

Refer to [Logging Architecture](/docs/concepts/cluster-administration/logging/) for details.
-->
如果所使用的是 CRI 容器運行時，容器日誌會被計入臨時存儲配額，
這可能會導致存儲配額耗盡的 Pod 被意外地驅逐出節點。

參考[日誌架構](/zh-cn/docs/concepts/cluster-administration/logging/)瞭解詳細信息。
{{< /note >}}

<!--
### Quota on object count

You can set quota for *the total number of one particular {{< glossary_tooltip text="resource" term_id="api-resource" >}} kind* in the Kubernetes API,
using the following syntax:

* `count/<resource>.<group>` for resources from non-core API groups
* `count/<resource>` for resources from the core API group
-->
### 對象數量的配額  {#quota-on-object-count}

你可以使用以下語法爲 Kubernetes API
中**一種特定{{< glossary_tooltip text="資源" term_id="api-resource" >}}類型的總數**設置配額：

* `count/<resource>.<group>`：用於非核心 API 組的資源
* `count/<resource>`：用於核心 API 組的資源

<!--
For example, the PodTemplate API is in the core API group and so if you want to limit the number of
PodTemplate objects in a namespace, you use `count/podtemplates`.

These types of quotas are useful to protect against exhaustion of control plane storage. For example, you may
want to limit the number of Secrets in a server given their large size. Too many Secrets in a cluster can
actually prevent servers and controllers from starting. You can set a quota for Jobs to protect against
a poorly configured CronJob. CronJobs that create too many Jobs in a namespace can lead to a denial of service.
-->
例如，PodTemplate API 屬於核心 API 組，因此如果你想限制某個命名空間中的
PodTemplate 對象的數量，你可以使用 `count/podtemplates`。

這類配額非常有助於防止控制平面存儲資源耗盡。
例如，由於某臺伺服器上的 Secret 較大，你可能希望對其進行限制。
叢集中 Secret 過多實際上可能導致伺服器和控制器無法啓動。
你也可以爲 Job 設置配額，以防止出現設定不當的 CronJob。
某些 CronJob 如果在一個命名空間中創建了過多的 Job，可能會引發 DoS 攻擊。

<!--
If you define a quota this way, it applies to Kubernetes' APIs that are part of the API server, and
to any custom resources backed by a CustomResourceDefinition.
For example, to create a quota on a `widgets` custom resource in the `example.com` API group,
use `count/widgets.example.com`.
If you use [API aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) to
add additional, custom APIs that are not defined as CustomResourceDefinitions, the core Kubernetes
control plane does not enforce quota for the aggregated API. The extension API server is expected to
provide quota enforcement if that's appropriate for the custom API.
-->
如果你以這種方式定義配額，它將應用於屬於 API 伺服器一部分的 Kubernetes API，以及 CustomResourceDefinition
支持的任何自定義資源。例如，要在 `example.com` API 組中創建 `widgets` 定製資源的配額，可以使用 `count/widgets.example.com`。
如果你使用[聚合 API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
添加未定義爲 CustomResourceDefinitions 的其他自定義 API，則核心 Kubernetes 控制平面不會對聚合 API 實施配額管理。
如果合適，擴展 API 伺服器需要爲自定義 API 提供配額管理。

<!--
##### Generic syntax {#resource-quota-object-count-generic}

This is a list of common examples of object kinds that you may want to put under object count quota,
listed by the configuration string that you would use.
-->
##### 通用語法   {#resource-quota-object-count-generic}

以下是一些常見對象類別的示例，建議你爲這些對象設置數量配額。每一項後面列出了相應的設定字符串：

* `count/pods`
* `count/persistentvolumeclaims`
* `count/services`
* `count/secrets`
* `count/configmaps`
* `count/deployments.apps`
* `count/replicasets.apps`
* `count/statefulsets.apps`
* `count/jobs.batch`
* `count/cronjobs.batch`

<!--
##### Specialized syntax {#resource-quota-object-count-specialized}

There is another syntax only to set the same type of quota, that only works for certain API kinds.
The following types are supported:
-->
##### 特殊語法   {#resource-quota-object-count-specialized}

還有另一種語法只能設置相同類型的配額，只對某些 API 類別起作用。
支持以下類型：

<!--
| Resource Name | Description |
| ------------- | ----------- |
| `configmaps` | The total number of ConfigMaps that can exist in the namespace. |
| `persistentvolumeclaims` | The total number of [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `pods` | The total number of Pods in a non-terminal state that can exist in the namespace.  A pod is in a terminal state if `.status.phase in (Failed, Succeeded)` is true.  |
| `replicationcontrollers` | The total number of ReplicationControllers that can exist in the namespace. |
| `resourcequotas` | The total number of ResourceQuotas that can exist in the namespace. |
| `services` | The total number of Services that can exist in the namespace. |
| `services.loadbalancers` | The total number of Services of type `LoadBalancer` that can exist in the namespace. |
| `services.nodeports` | The total number of `NodePorts` allocated to Services of type `NodePort` or `LoadBalancer` that can exist in the namespace.                                                      |
| `secrets` | The total number of Secrets that can exist in the namespace. |
-->
| 資源名稱 | 描述 |
| ------------------------------- | ------------------------------------------------- |
| `configmaps` | 在該命名空間中允許存在的 ConfigMap 總數上限。 |
| `persistentvolumeclaims` | 在該命名空間中允許存在的 [PVC](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) 的總數上限。 |
| `pods` | 在該命名空間中允許存在的非終止狀態的 Pod 總數上限。Pod 終止狀態等價於 Pod 的 `.status.phase in (Failed, Succeeded)` 爲真。 |
| `replicationcontrollers` | 在該命名空間中允許存在的 ReplicationController 總數上限。 |
| `resourcequotas` | 在該命名空間中允許存在的 ResourceQuota 總數上限。 |
| `services` | 在該命名空間中允許存在的 Service 總數上限。 |
| `services.loadbalancers` | 在該命名空間中允許存在的 LoadBalancer 類型的 Service 總數上限。 |
| `services.nodeports` | 在該命名空間中允許存在的 NodePort 或 LoadBalancer 類型的 Service 的 NodePort 總數上限。 |
| `secrets` | 在該命名空間中允許存在的 Secret 總數上限。 |

<!--
For example, `pods` quota counts and enforces a maximum on the number of `pods`
created in a single namespace that are not terminal. You might want to set a `pods`
quota on a namespace to avoid the case where a user creates many small pods and
exhausts the cluster's supply of Pod IPs.
-->
例如，`pods` 配額統計某個命名空間中所創建的、非終止狀態的 `pods` 個數並確保其不超過某上限值。
使用者可能希望在某命名空間中設置 `pods` 配額，以避免有使用者創建很多小的 Pod，
從而耗盡叢集所能提供的 Pod IP 地址。

<!--
You can find more examples on [Viewing and Setting Quotas](#viewing-and-setting-quotas).
-->
你可以在[查看和設置配額](#viewing-and-setting-quotas)一節查看更多示例。

<!--
## Quota Scopes

Each quota can have an associated set of `scopes`. A quota will only measure usage for a resource if it matches
the intersection of enumerated scopes.
-->
## 配額作用域   {#quota-scopes}

每個配額都有一組相關的 `scope`（作用域），配額只會對作用域內的資源生效。
配額機制僅統計所列舉的作用域的交集中的資源用量。

<!--
When a scope is added to the quota, it limits the number of resources it supports to those that pertain to the scope.
Resources specified on the quota outside of the allowed set results in a validation error.
-->
當一個作用域被添加到配額中後，它會對作用域相關的資源數量作限制。
如配額中指定了允許（作用域）集合之外的資源，會導致驗證錯誤。

<!--
| Scope | Description |
| ----- | ----------- |
| `Terminating` | Match pods where `.spec.activeDeadlineSeconds` >= `0` |
| `NotTerminating` | Match pods where `.spec.activeDeadlineSeconds` is `nil` |
| `BestEffort` | Match pods that have best effort quality of service. |
| `NotBestEffort` | Match pods that do not have best effort quality of service. |
| `PriorityClass` | Match pods that references the specified [priority class](/docs/concepts/scheduling-eviction/pod-priority-preemption). |
| `CrossNamespacePodAffinity` | Match pods that have cross-namespace pod [(anti)affinity terms](/docs/concepts/scheduling-eviction/assign-pod-node). |
| `VolumeAttributesClass` | Match persistentvolumeclaims that references the specified [volume attributes class](/docs/concepts/storage/volume-attributes-classes). |
-->
| 作用域 | 描述 |
| ----- | ----------- |
| `Terminating` | 匹配所有 `spec.activeDeadlineSeconds` 不小於 0 的 Pod。 |
| `NotTerminating` | 匹配所有 `spec.activeDeadlineSeconds` 是 nil 的 Pod。 |
| `BestEffort` | 匹配所有 Qos 是 BestEffort 的 Pod。 |
| `NotBestEffort` | 匹配所有 Qos 不是 BestEffort 的 Pod。 |
| `PriorityClass` | 匹配所有引用了所指定的[優先級類](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption)的 Pod。 |
| `CrossNamespacePodAffinity` | 匹配那些設置了跨名字空間[（反）親和性條件](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node)的 Pod。 |
| `VolumeAttributesClass` | 匹配引用了指定[卷屬性類](/zh-cn/docs/concepts/storage/volume-attributes-classes)的 PersistentVolumeClaim。 |

<!--
The `BestEffort` scope restricts a quota to tracking the following resource:

* `pods`

The `Terminating`, `NotTerminating`, `NotBestEffort` and `PriorityClass`
scopes restrict a quota to tracking the following resources:
-->
`BestEffort` 作用域限制配額跟蹤以下資源：

* `pods`

`Terminating`、`NotTerminating`、`NotBestEffort` 和 `PriorityClass` 這些作用域限制配額跟蹤以下資源：

* `pods`
* `cpu`
* `memory`
* `requests.cpu`
* `requests.memory`
* `limits.cpu`
* `limits.memory`

<!--
Note that you cannot specify both the `Terminating` and the `NotTerminating`
scopes in the same quota, and you cannot specify both the `BestEffort` and
`NotBestEffort` scopes in the same quota either.

The `scopeSelector` supports the following values in the `operator` field:
-->
需要注意的是，你不可以在同一個配額對象中同時設置 `Terminating` 和 `NotTerminating`
作用域，你也不可以在同一個配額中同時設置 `BestEffort` 和 `NotBestEffort`
作用域。

`scopeSelector` 支持在 `operator` 字段中使用以下值：

* `In`
* `NotIn`
* `Exists`
* `DoesNotExist`

<!--
When using one of the following values as the `scopeName` when defining the
`scopeSelector`, the `operator` must be `Exists`.
-->
定義 `scopeSelector` 時，如果使用以下值之一作爲 `scopeName` 的值，則對應的
`operator` 只能是 `Exists`。

* `Terminating`
* `NotTerminating`
* `BestEffort`
* `NotBestEffort`

<!--
If the `operator` is `In` or `NotIn`, the `values` field must have at least
one value. For example:
-->
如果 `operator` 是 `In` 或 `NotIn` 之一，則 `values` 字段必須至少包含一個值。
例如：

```yaml
  scopeSelector:
    matchExpressions:
      - scopeName: PriorityClass
        operator: In
        values:
          - middle
```

<!--
If the `operator` is `Exists` or `DoesNotExist`, the `values` field must *NOT* be
specified.
-->
如果 `operator` 爲 `Exists` 或 `DoesNotExist`，則**不**可以設置 `values` 字段。

<!--
### Resource Quota Per PriorityClass
-->
### 基於優先級類（PriorityClass）來設置資源配額  {#resource-quota-per-priorityclass}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
Pods can be created at a specific [priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority).
You can control a pod's consumption of system resources based on a pod's priority, by using the `scopeSelector`
field in the quota spec.
-->
Pod 可以創建爲特定的[優先級](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)。
通過使用配額規約中的 `scopeSelector` 字段，使用者可以根據 Pod 的優先級控制其系統資源消耗。

<!--
A quota is matched and consumed only if `scopeSelector` in the quota spec selects the pod.
-->
僅當配額規約中的 `scopeSelector` 字段選擇到某 Pod 時，配額機制纔會匹配和計量 Pod 的資源消耗。

<!--
When quota is scoped for priority class using `scopeSelector` field, quota object
is restricted to track only following resources:
-->
如果配額對象通過 `scopeSelector` 字段設置其作用域爲優先級類，
則配額對象只能跟蹤以下資源：

* `pods`
* `cpu`
* `memory`
* `ephemeral-storage`
* `limits.cpu`
* `limits.memory`
* `limits.ephemeral-storage`
* `requests.cpu`
* `requests.memory`
* `requests.ephemeral-storage`

<!--
This example creates a quota object and matches it with pods at specific priorities. The example
works as follows:
-->
本示例創建一個配額對象，並將其與具有特定優先級的 Pod 進行匹配，其工作方式如下：

<!--
- Pods in the cluster have one of the three priority classes, "low", "medium", "high".
- One quota object is created for each priority.
-->
- 叢集中的 Pod 可取三個優先級類之一，即 "low"、"medium"、"high"。
- 爲每個優先級創建一個配額對象。

<!--
Save the following YAML to a file `quota.yaml`.
-->
將以下 YAML 保存到文件 `quota.yaml` 中。

{{% code_sample file="policy/quota.yaml" %}}

<!--
Apply the YAML using `kubectl create`.
-->
使用 `kubectl create` 命令運行以下操作。

```shell
kubectl create -f ./quota.yaml
```

```
resourcequota/pods-high created
resourcequota/pods-medium created
resourcequota/pods-low created
```

<!--
Verify that `Used` quota is `0` using `kubectl describe quota`.
-->
使用 `kubectl describe quota` 操作驗證配額的 `Used` 值爲 `0`。

```shell
kubectl describe quota
```

```
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     1k
memory      0     200Gi
pods        0     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

<!--
Create a pod with priority "high". Save the following YAML to a
file `high-priority-pod.yaml`.
-->
創建優先級爲 "high" 的 Pod。
將以下 YAML 保存到文件 `high-priority-pod.yaml` 中。

{{% code_sample file="policy/high-priority-pod.yaml" %}}

<!--
Apply it with `kubectl create`.
-->
使用 `kubectl create` 運行以下操作。

```shell
kubectl create -f ./high-priority-pod.yaml
```

<!--
Verify that "Used" stats for "high" priority quota, `pods-high`, has changed and that
the other two quotas are unchanged.
-->
確認 "high" 優先級配額 `pods-high` 的 "Used" 統計信息已更改，並且其他兩個配額未更改。

```shell
kubectl describe quota
```

```
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         500m  1k
memory      10Gi  200Gi
pods        1     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

<!--
### Cross-namespace Pod Affinity Quota
-->
### 跨名字空間的 Pod 親和性配額   {#cross-namespace-pod-affinity-quota}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
Operators can use `CrossNamespacePodAffinity` quota scope to limit which namespaces are allowed to
have pods with affinity terms that cross namespaces. Specifically, it controls which pods are allowed
to set `namespaces` or `namespaceSelector` fields in pod affinity terms.
-->
叢集運維人員可以使用 `CrossNamespacePodAffinity`
配額作用域來限制哪個名字空間中可以存在包含跨名字空間親和性規則的 Pod。
更爲具體一點，此作用域用來設定哪些 Pod 可以在其 Pod 親和性規則中設置
`namespaces` 或 `namespaceSelector` 字段。

<!--
Preventing users from using cross-namespace affinity terms might be desired since a pod
with anti-affinity constraints can block pods from all other namespaces
from getting scheduled in a failure domain.
-->
禁止使用者使用跨名字空間的親和性規則可能是一種被需要的能力，
因爲帶有反親和性約束的 Pod 可能會阻止所有其他名字空間的 Pod 被調度到某失效域中。

<!--
Using this scope operators can prevent certain namespaces (`foo-ns` in the example below)
from having pods that use cross-namespace pod affinity by creating a resource quota object in
that namespace with `CrossNamespacePodAffinity` scope and hard limit of 0:
-->
使用此作用域操作符可以避免某些名字空間（例如下面例子中的 `foo-ns`）運行特別的 Pod，
這類 Pod 使用跨名字空間的 Pod 親和性約束，在該名字空間中創建了作用域爲
`CrossNamespacePodAffinity` 的、硬性約束爲 0 的資源配額對象。

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: disable-cross-namespace-affinity
  namespace: foo-ns
spec:
  hard:
    pods: "0"
  scopeSelector:
    matchExpressions:
    - scopeName: CrossNamespacePodAffinity
      operator: Exists
```

<!--
If operators want to disallow using `namespaces` and `namespaceSelector` by default, and
only allow it for specific namespaces, they could configure `CrossNamespacePodAffinity`
as a limited resource by setting the kube-apiserver flag `--admission-control-config-file`
to the path of the following configuration file:
-->
如果叢集運維人員希望默認禁止使用 `namespaces` 和 `namespaceSelector`，
而僅僅允許在特定命名空間中這樣做，他們可以將 `CrossNamespacePodAffinity`
作爲一個被約束的資源。方法是爲 `kube-apiserver` 設置標誌
`--admission-control-config-file`，使之指向如下的設定文件：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: CrossNamespacePodAffinity
        operator: Exists
```

<!--
With the above configuration, pods can use `namespaces` and `namespaceSelector` in pod affinity only
if the namespace where they are created have a resource quota object with
`CrossNamespacePodAffinity` scope and a hard limit greater than or equal to the number of pods using those fields.
-->
基於上面的設定，只有名字空間中包含作用域爲 `CrossNamespacePodAffinity`
且硬性約束大於或等於使用 `namespaces` 和 `namespaceSelector` 字段的 Pod
個數時，纔可以在該名字空間中繼續創建在其 Pod 親和性規則中設置 `namespaces`
或 `namespaceSelector` 的新 Pod。

<!--
### Resource Quota Per VolumeAttributesClass
-->
### 按 VolumeAttributesClass 設置資源配額

{{< feature-state feature_gate_name="VolumeAttributesClass" >}}

<!--
PersistentVolumeClaims can be created with a specific [volume attributes class](/docs/concepts/storage/volume-attributes-classes/), and might be modified after creation. You can control a PVC's consumption of storage resources based on the associated volume attributes classes, by using the `scopeSelector` field in the quota spec.

The PVC references the associated volume attributes class by the following fields:
-->
PersistentVolumeClaim（PVC）可以在創建時指定一個特定的[卷屬性類](/zh-cn/docs/concepts/storage/volume-attributes-classes/)，
並且在創建後也可以進行修改。你可以通過在配額規約中使用 `scopeSelector`
字段，基於關聯的卷屬性類來控制 PVC 對存儲資源的消耗。

PVC 通過以下字段引用關聯的卷屬性類：

* `spec.volumeAttributesClassName`
* `status.currentVolumeAttributesClassName`
* `status.modifyVolumeStatus.targetVolumeAttributesClassName`

<!--
A quota is matched and consumed only if `scopeSelector` in the quota spec selects the PVC.

When the quota is scoped for the volume attributes class using the `scopeSelector` field, the quota object is restricted to track only the following resources:
-->
僅當配額規約中的 `scopeSelector` 選擇 PVC 時，配額纔會被匹配並計入消耗。

當使用 `scopeSelector` 字段爲卷屬性類限定配額範圍時，配額對象只會跟蹤以下資源：

* `persistentvolumeclaims`
* `requests.storage`

<!--
This example creates a quota object and matches it with PVC at specific volume attributes classes. The example works as follows:

- PVCs in the cluster have at least one of the three volume attributes classes, "gold", "silver", "copper".
- One quota object is created for each volume attributes class.

Save the following YAML to a file `quota-vac.yaml`.
-->
以下示例創建一個配額對象，並將其與具有特定卷屬性類的 PVC 進行匹配。示例邏輯如下：

- 叢集中的 PVC 至少屬於三個卷屬性類之一：“gold”、“silver”、“copper”。
- 爲每個卷屬性類分別創建一個配額對象。

將以下 YAML 保存爲文件 `quota-vac.yaml`：

{{% code_sample file="policy/quota-vac.yaml" %}}

<!--
Apply the YAML using `kubectl create`.
-->
使用 `kubectl create` 應用 YAML 文件：

```shell
kubectl create -f ./quota-vac.yaml
```

```
resourcequota/pvcs-gold created
resourcequota/pvcs-silver created
resourcequota/pvcs-copper created
```

<!--
Verify that `Used` quota is `0` using `kubectl describe quota`.
-->
使用 `kubectl describe quota` 驗證 `Used` 配額爲 `0`：

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     30Gi
```

<!--
Create a pvc with volume attributes class "gold". Save the following YAML to a file `gold-vac-pvc.yaml`.
-->
創建一個卷屬性類爲 "gold" 的 PVC。將以下 YAML 保存爲文件 `gold-vac-pvc.yaml`：

{{% code_sample file="policy/gold-vac-pvc.yaml" %}}

<!--
Apply it with `kubectl create`.
-->
使用 `kubectl create` 應用此 YAML：

```shell
kubectl create -f ./gold-vac-pvc.yaml
```

<!--
Verify that "Used" stats for "gold" volume attributes class quota, `pvcs-gold` has changed and that the other two quotas are unchanged.
-->
驗證 "gold" 卷屬性類配額的 "Used" 統計，`pvcs-gold` 已發生了變化，而另外兩個配額沒有變化：

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     30Gi
```

<!--
Once the PVC is bound, it is allowed to modify the desired volume attributes class. Let's change it to "silver" with kubectl patch.
-->
一旦 PVC 被綁定，就允許修改預期卷屬性類。使用 `kubectl patch` 將其修改爲 "silver"：

```shell
kubectl patch pvc gold-vac-pvc --type='merge' -p '{"spec":{"volumeAttributesClassName":"silver"}}'
```

<!--
Verify that "Used" stats for "silver" volume attributes class quota, `pvcs-silver` has changed, `pvcs-copper` is unchanged, and `pvcs-gold` might be unchanged or released, which depends on the PVC's status.
-->
驗證 “silver” 卷屬性類配額的 “Used” 統計，`pvcs-silver` 已發生變化，
`pvcs-copper` 沒有變化，`pvcs-gold` 可能沒有變化或已釋放（具體取決於 PVC 的狀態）：

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     30Gi
```

<!--
Let's change it to "copper" with kubectl patch.
-->
使用 `kubectl patch` 將其修改爲 "copper"：

```shell
kubectl patch pvc gold-vac-pvc --type='merge' -p '{"spec":{"volumeAttributesClassName":"copper"}}'
```

<!--
Verify that "Used" stats for "copper" volume attributes class quota, `pvcs-copper` has changed, `pvcs-silver` and `pvcs-gold` might be unchanged or released, which depends on the PVC's status.
-->
驗證 "copper" 卷屬性類配額的 “Used” 統計，`pvcs-copper` 已經發生變化，
`pvcs-silver` 和 `pvcs-gold` 可能沒有變化或已釋放（取決於 PVC 的狀態）。

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   30Gi
```

<!--
Print the manifest of the PVC using the following command:
-->
使用以下命令打印 PVC 的清單：

```shell
kubectl get pvc gold-vac-pvc -o yaml
```

<!--
It might show the following output:
-->
可能會顯示如下輸出：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gold-vac-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
  storageClassName: default
  volumeAttributesClassName: copper
status:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 2Gi
  currentVolumeAttributesClassName: gold
  phase: Bound
  modifyVolumeStatus:
    status: InProgress
    targetVolumeAttributesClassName: silver
  storageClassName: default
```

<!--
Wait a moment for the volume modification to complete, then verify the quota again.
-->
稍等片刻，待卷修改完成後，再次驗證配額：

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   30Gi
```

<!--
## Requests compared to Limits {#requests-vs-limits}

When allocating compute resources, each container may specify a request and a limit value for either CPU or memory.
The quota can be configured to quota either value.
-->
## 請求與限制的比較   {#requests-vs-limits}

分配計算資源時，每個容器可以爲 CPU 或內存指定請求和約束。
配額可以針對二者之一進行設置。

<!--
If the quota has a value specified for `requests.cpu` or `requests.memory`, then it requires that every incoming
container makes an explicit request for those resources. If the quota has a value specified for `limits.cpu` or `limits.memory`,
then it requires that every incoming container specifies an explicit limit for those resources.
-->
如果配額中指定了 `requests.cpu` 或 `requests.memory` 的值，則它要求每個容器都顯式給出對這些資源的請求。
同理，如果配額中指定了 `limits.cpu` 或 `limits.memory` 的值，那麼它要求每個容器都顯式設定對應資源的限制。

<!--
## Viewing and Setting Quotas

kubectl supports creating, updating, and viewing quotas:
-->
## 查看和設置配額   {#viewing-and-setting-quotas}

kubectl 支持創建、更新和查看配額：

```shell
kubectl create namespace myspace
```

```shell
cat <<EOF > compute-resources.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    requests.cpu: "1"
    requests.memory: "1Gi"
    limits.cpu: "2"
    limits.memory: "2Gi"
    requests.nvidia.com/gpu: 4
EOF
```

```shell
kubectl create -f ./compute-resources.yaml --namespace=myspace
```

```shell
cat <<EOF > object-counts.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    pods: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
EOF
```

```shell
kubectl create -f ./object-counts.yaml --namespace=myspace
```

```shell
kubectl get quota --namespace=myspace
```

```none
NAME                    AGE
compute-resources       30s
object-counts           32s
```

```shell
kubectl describe quota compute-resources --namespace=myspace
```

```none
Name:                    compute-resources
Namespace:               myspace
Resource                 Used  Hard
--------                 ----  ----
limits.cpu               0     2
limits.memory            0     2Gi
requests.cpu             0     1
requests.memory          0     1Gi
requests.nvidia.com/gpu  0     4
```

```shell
kubectl describe quota object-counts --namespace=myspace
```

```none
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
pods                    0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```

<!--
kubectl also supports object count quota for all standard namespaced resources
using the syntax `count/<resource>.<group>`:
-->
kubectl 還使用語法 `count/<resource>.<group>` 支持所有標準的、命名空間域的資源的對象計數配額：

```shell
kubectl create namespace myspace
```

```shell
kubectl create quota test --hard=count/deployments.apps=2,count/replicasets.apps=4,count/pods=3,count/secrets=4 --namespace=myspace
```

```shell
kubectl create deployment nginx --image=nginx --namespace=myspace --replicas=2
```

```shell
kubectl describe quota --namespace=myspace
```

```
Name:                         test
Namespace:                    myspace
Resource                      Used  Hard
--------                      ----  ----
count/deployments.apps        1     2
count/pods                    2     3
count/replicasets.apps        1     4
count/secrets                 1     4
```

<!--
## Quota and Cluster Capacity

ResourceQuotas are independent of the cluster capacity. They are
expressed in absolute units. So, if you add nodes to your cluster, this does *not*
automatically give each namespace the ability to consume more resources.
-->
## 配額和叢集容量   {#quota-and-cluster-capacity}

ResourceQuota 與叢集資源總量是完全獨立的。它們通過絕對的單位來設定。
所以，爲叢集添加節點時，資源配額**不會**自動賦予每個命名空間消耗更多資源的能力。

<!--
Sometimes more complex policies may be desired, such as:

- Proportionally divide total cluster resources among several teams.
- Allow each tenant to grow resource usage as needed, but have a generous
  limit to prevent accidental resource exhaustion.
- Detect demand from one namespace, add nodes, and increase quota.
-->
有時可能需要資源配額支持更復雜的策略，比如：

- 在幾個團隊中按比例劃分總的叢集資源。
- 允許每個租戶根據需要增加資源使用量，但要有足夠的限制以防止資源意外耗盡。
- 探測某個命名空間的需求，添加物理節點並擴大資源配額值。

<!--
Such policies could be implemented using `ResourceQuotas` as building blocks, by
writing a "controller" that watches the quota usage and adjusts the quota
hard limits of each namespace according to other signals.
-->
這些策略可以通過將資源配額作爲一個組成模塊、手動編寫一個控制器來監控資源使用情況，
並結合其他信號調整命名空間上的硬性資源配額來實現。

<!--
Note that resource quota divides up aggregate cluster resources, but it creates no
restrictions around nodes: pods from several namespaces may run on the same node.
-->
注意：資源配額對叢集資源總體進行劃分，但它對節點沒有限制：來自不同命名空間的 Pod 可能在同一節點上運行。

<!--
## Limit Priority Class consumption by default

It may be desired that pods at a particular priority, such as "cluster-services",
should be allowed in a namespace, if and only if, a matching quota object exists.
-->
## 默認情況下限制特定優先級的資源消耗  {#limit-priority-class-consumption-by-default}

有時候可能希望當且僅當某名字空間中存在匹配的配額對象時，纔可以創建特定優先級
（例如 "cluster-services"）的 Pod。

<!--
With this mechanism, operators are able to restrict usage of certain high
priority classes to a limited number of namespaces and not every namespace
will be able to consume these priority classes by default.
-->
通過這種機制，操作人員能夠限制某些高優先級類僅出現在有限數量的命名空間中，
而並非每個命名空間默認情況下都能夠使用這些優先級類。

<!--
To enforce this, `kube-apiserver` flag `--admission-control-config-file` should be
used to pass path to the following configuration file:
-->
要實現此目的，應設置 `kube-apiserver` 的標誌 `--admission-control-config-file` 
指向如下設定文件：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

<!--
Then, create a resource quota object in the `kube-system` namespace:
-->
現在在 `kube-system` 名字空間中創建一個資源配額對象：

{{% code_sample file="policy/priority-class-resourcequota.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/policy/priority-class-resourcequota.yaml -n kube-system
```

```none
resourcequota/pods-cluster-services created
```

<!--
In this case, a pod creation will be allowed if:

1. the Pod's `priorityClassName` is not specified.
1. the Pod's `priorityClassName` is specified to a value other than `cluster-services`.
1. the Pod's `priorityClassName` is set to `cluster-services`, it is to be created
   in the `kube-system` namespace, and it has passed the resource quota check.
-->
在這裏，當以下條件滿足時可以創建 Pod：

1. Pod 未設置 `priorityClassName`
1. Pod 的 `priorityClassName` 設置值不是 `cluster-services`
1. Pod 的 `priorityClassName` 設置值爲 `cluster-services`，它將被創建於
   `kube-system` 名字空間中，並且它已經通過了資源配額檢查。

<!--
A Pod creation request is rejected if its `priorityClassName` is set to `cluster-services`
and it is to be created in a namespace other than `kube-system`.
-->
如果 Pod 的 `priorityClassName` 設置爲 `cluster-services`，但要被創建到
`kube-system` 之外的別的名字空間，則 Pod 創建請求也被拒絕。

## {{% heading "whatsnext" %}}

<!--
- See a [detailed example for how to use resource quota](/docs/tasks/administer-cluster/quota-api-object/).
- Read the ResourceQuota [API reference](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
- Learn about [LimitRanges](/docs/concepts/policy/limit-range/)
- You can read the historical [ResourceQuota design document](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_resource_quota.md)
  for more information.
- You can also read the [Quota support for priority class design document](https://git.k8s.io/design-proposals-archive/scheduling/pod-priority-resourcequota.md).
-->
- 參閱[如何使用資源配額的詳細示例](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)。
- 閱讀 ResourceQuota [API 參考](/zh-cn/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
- 瞭解 [LimitRanges](/zh-cn/docs/concepts/policy/limit-range/)
- 你可以閱讀歷史的
  [ResourceQuota 設計文檔](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_resource_quota.md)獲取更多信息。
- 你也可以閱讀[優先級類配額支持設計文檔](https://git.k8s.io/design-proposals-archive/scheduling/pod-priority-resourcequota.md)。
