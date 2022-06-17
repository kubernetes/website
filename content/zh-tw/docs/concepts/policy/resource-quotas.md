---
title: 資源配額
content_type: concept
weight: 20
---

<!--
reviewers:
- derekwaynecarr
title: Resource Quotas
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
When several users or teams share a cluster with a fixed number of nodes,
there is a concern that one team could use more than its fair share of resources.

Resource quotas are a tool for administrators to address this concern.
-->
當多個使用者或團隊共享具有固定節點數目的叢集時，人們會擔心有人使用超過其基於公平原則所分配到的資源量。

資源配額是幫助管理員解決這一問題的工具。

<!-- body -->

<!--
A resource quota, defined by a `ResourceQuota` object, provides constraints that limit
aggregate resource consumption per namespace.  It can limit the quantity of objects that can
be created in a namespace by type, as well as the total amount of compute resources that may
be consumed by resources in that namespace.
-->
資源配額，透過 `ResourceQuota` 物件來定義，對每個名稱空間的資源消耗總量提供限制。
它可以限制名稱空間中某種型別的物件的總數目上限，也可以限制命令空間中的 Pod 可以使用的計算資源的總上限。

<!--
Resource quotas work like this:
-->
資源配額的工作方式如下：

<!--
- Different teams work in different namespaces. This can be enforced with [RBAC](/docs/reference/access-authn-authz/rbac/).
- The administrator creates one ResourceQuota for each namespace.
- Users create resources (pods, services, etc.) in the namespace, and the quota system
  tracks usage to ensure it does not exceed hard resource limits defined in a ResourceQuota.
- If creating or updating a resource violates a quota constraint, the request will fail with HTTP
  status code `403 FORBIDDEN` with a message explaining the constraint that would have been violated.
- If quota is enabled in a namespace for compute resources like `cpu` and `memory`, users must specify
  requests or limits for those values; otherwise, the quota system may reject pod creation.  Hint: Use
  the `LimitRanger` admission controller to force defaults for pods that make no compute resource requirements.
  See the [walkthrough](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/) for an example of how to avoid this problem.
-->
- 不同的團隊可以在不同的名稱空間下工作。這可以透過 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 強制執行。
- 叢集管理員可以為每個名稱空間建立一個或多個 ResourceQuota 物件。
- 當用戶在名稱空間下建立資源（如 Pod、Service 等）時，Kubernetes 的配額系統會
  跟蹤叢集的資源使用情況，以確保使用的資源用量不超過 ResourceQuota 中定義的硬性資源限額。
- 如果資源建立或者更新請求違反了配額約束，那麼該請求會報錯（HTTP 403 FORBIDDEN），
  並在訊息中給出有可能違反的約束。
- 如果名稱空間下的計算資源 （如 `cpu` 和 `memory`）的配額被啟用，則使用者必須為
  這些資源設定請求值（request）和約束值（limit），否則配額系統將拒絕 Pod 的建立。
  提示: 可使用 `LimitRanger` 准入控制器來為沒有設定計算資源需求的 Pod 設定預設值。
  
  若想避免這類問題，請參考
  [演練](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)示例。

<!--
The name of a ResourceQuota object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
ResourceQuota 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
Examples of policies that could be created using namespaces and quotas are:
-->
下面是使用名稱空間和配額構建策略的示例：

<!--
- In a cluster with a capacity of 32 GiB RAM, and 16 cores, let team A use 20 GiB and 10 cores,
  let B use 10GiB and 4 cores, and hold 2GiB and 2 cores in reserve for future allocation.
- Limit the "testing" namespace to using 1 core and 1GiB RAM.  Let the "production" namespace
  use any amount.
-->
- 在具有 32 GiB 記憶體和 16 核 CPU 資源的叢集中，允許 A 團隊使用 20 GiB 記憶體 和 10 核的 CPU 資源，
  允許 B 團隊使用 10 GiB 記憶體和 4 核的 CPU 資源，並且預留 2 GiB 記憶體和 2 核的 CPU 資源供將來分配。
- 限制 "testing" 名稱空間使用 1 核 CPU 資源和 1GiB 記憶體。允許 "production" 名稱空間使用任意數量。

<!--
In the case where the total capacity of the cluster is less than the sum of the quotas of the namespaces,
there may be contention for resources.  This is handled on a first-come-first-served basis.

Neither contention nor changes to quota will affect already created resources.
-->
在叢集容量小於各名稱空間配額總和的情況下，可能存在資源競爭。資源競爭時，Kubernetes 系統會遵循先到先得的原則。

不管是資源競爭還是配額的修改，都不會影響已經建立的資源使用物件。

<!--
## Enabling Resource Quota

Resource Quota support is enabled by default for many Kubernetes distributions. It is
enabled when the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
`--enable-admission-plugins=` flag has `ResourceQuota` as
one of its arguments.
-->
## 啟用資源配額

資源配額的支援在很多 Kubernetes 版本中是預設啟用的。
當 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}
的命令列標誌 `--enable-admission-plugins=` 中包含 `ResourceQuota` 時，
資源配額會被啟用。

<!--
A resource quota is enforced in a particular namespace when there is a
ResourceQuota in that namespace.
-->
當名稱空間中存在一個 ResourceQuota 物件時，對於該名稱空間而言，資源配額就是開啟的。

<!--
## Compute Resource Quota

You can limit the total sum of
[compute resources](/docs/concepts/configuration/manage-resources-containers/)
that can be requested in a given namespace.
-->
## 計算資源配額

使用者可以對給定名稱空間下的可被請求的
[計算資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
總量進行限制。

<!--
The following resource types are supported:
-->
配額機制所支援的資源型別：

<!--
| Resource Name | Description |
| --------------------- | --------------------------------------------------------- |
| `limits.cpu` | Across all pods in a non-terminal state, the sum of CPU limits cannot exceed this value. |
| `limits.memory` | Across all pods in a non-terminal state, the sum of memory limits cannot exceed this value. |
| `requests.cpu` | Across all pods in a non-terminal state, the sum of CPU requests cannot exceed this value. |
| `requests.memory` | Across all pods in a non-terminal state, the sum of memory requests cannot exceed this value. |
| `hugepages-<size>` | Across all pods in a non-terminal state, the number of huge page requests of the specified size cannot exceed this value. |
| `cpu` | Same as `requests.cpu` |
| `memory` | Same as `requests.memory` |
-->
| 資源名稱 | 描述 |
| --------------------- | --------------------------------------------- |
| `limits.cpu` | 所有非終止狀態的 Pod，其 CPU 限額總量不能超過該值。 |
| `limits.memory` | 所有非終止狀態的 Pod，其記憶體限額總量不能超過該值。 |
| `requests.cpu` | 所有非終止狀態的 Pod，其 CPU 需求總量不能超過該值。 |
| `requests.memory` | 所有非終止狀態的 Pod，其記憶體需求總量不能超過該值。 |
| `hugepages-<size>` | 對於所有非終止狀態的 Pod，針對指定尺寸的巨頁請求總數不能超過此值。 |
| `cpu` | 與 `requests.cpu` 相同。 |
| `memory` | 與 `requests.memory` 相同。 |

<!--
### Resource Quota For Extended Resources

In addition to the resources mentioned above, in release 1.10, quota support for
[extended resources](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources) is added.
-->
### 擴充套件資源的資源配額

除上述資源外，在 Kubernetes 1.10 版本中，還添加了對
[擴充套件資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)
的支援。

<!--
As overcommit is not allowed for extended resources, it makes no sense to specify both `requests`
and `limits` for the same extended resource in a quota. So for extended resources, only quota items
with prefix `requests.` is allowed for now.
-->
由於擴充套件資源不可超量分配，因此沒有必要在配額中為同一擴充套件資源同時指定 `requests` 和 `limits`。
對於擴充套件資源而言，目前僅允許使用字首為 `requests.` 的配額項。

<!--
Take the GPU resource as an example, if the resource name is `nvidia.com/gpu`, and you want to
limit the total number of GPUs requested in a namespace to 4, you can define a quota as follows:
-->
以 GPU 拓展資源為例，如果資源名稱為 `nvidia.com/gpu`，並且要將名稱空間中請求的 GPU
資源總數限制為 4，則可以如下定義配額：

* `requests.nvidia.com/gpu: 4`

<!--
See [Viewing and Setting Quotas](#viewing-and-setting-quotas) for more detail information.
-->
有關更多詳細資訊，請參閱[檢視和設定配額](#viewing-and-setting-quotas)。

<!--
## Storage Resource Quota

You can limit the total sum of [storage resources](/docs/concepts/storage/persistent-volumes/) that can be requested in a given namespace.

In addition, you can limit consumption of storage resources based on associated storage-class.
-->
## 儲存資源配額

使用者可以對給定名稱空間下的[儲存資源](/zh-cn/docs/concepts/storage/persistent-volumes/)
總量進行限制。

此外，還可以根據相關的儲存類（Storage Class）來限制儲存資源的消耗。

<!--
| Resource Name | Description |
| --------------------- | --------------------------------------------------------- |
| `requests.storage` | Across all persistent volume claims, the sum of storage requests cannot exceed this value. |
| `persistentvolumeclaims` | The total number of [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | Across all persistent volume claims associated with the `<storage-class-name>`, the sum of storage requests cannot exceed this value. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | Across all persistent volume claims associated with the storage-class-name, the total number of [persistent volume claims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
-->
| 資源名稱 | 描述 |
| --------------------- | ----------------------------------------------------------- |
| `requests.storage` | 所有 PVC，儲存資源的需求總量不能超過該值。 |
| `persistentvolumeclaims` | 在該名稱空間中所允許的 [PVC](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) 總量。 |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | 在所有與 `<storage-class-name>` 相關的持久卷申領中，儲存請求的總和不能超過該值。 |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` |  在與 storage-class-name 相關的所有持久卷申領中，名稱空間中可以存在的[持久卷申領](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)總數。 |

<!--
For example, if an operator wants to quota storage with `gold` storage class separate from `bronze` storage class, the operator can
define a quota as follows:
-->
例如，如果一個操作人員針對 `gold` 儲存型別與 `bronze` 儲存型別設定配額，
操作人員可以定義如下配額：

* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

<!--
In release 1.8, quota support for local ephemeral storage is added as an alpha feature:
-->
在 Kubernetes 1.8 版本中，本地臨時儲存的配額支援已經是 Alpha 功能：

<!--
| Resource Name | Description |
| ------------------------------- |----------------------------------------------------------- |
| `requests.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage requests cannot exceed this value. |
| `limits.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage limits cannot exceed this value. |
| `ephemeral-storage` | Same as `requests.ephemeral-storage`. |
-->
| 資源名稱 | 描述 |
| ------------------------------- |----------------------------------------------------------- |
| `requests.ephemeral-storage` | 在名稱空間的所有 Pod 中，本地臨時儲存請求的總和不能超過此值。 |
| `limits.ephemeral-storage` | 在名稱空間的所有 Pod 中，本地臨時儲存限制值的總和不能超過此值。 |
| `ephemeral-storage` | 與 `requests.ephemeral-storage` 相同。 |

{{< note >}}
<!--
When using a CRI container runtime, container logs will count against the ephemeral storage quota.
This can result in the unexpected eviction of pods that have exhausted their storage quotas.
Refer to [Logging Architecture](/docs/concepts/cluster-administration/logging/) for details.
-->
如果所使用的是 CRI 容器執行時，容器日誌會被計入臨時儲存配額。
這可能會導致儲存配額耗盡的 Pods 被意外地驅逐出節點。
參考[日誌架構](/zh-cn/docs/concepts/cluster-administration/logging/)
瞭解詳細資訊。
{{< /note >}}

<!--
## Object Count Quota

You can set quota for the total number of certain resources of all standard,
namespaced resource types using the following syntax:

* `count/<resource>.<group>` for resources from non-core groups
* `count/<resource>` for resources from the core group
-->
## 物件數量配額

你可以使用以下語法對所有標準的、名稱空間域的資源型別進行配額設定：

* `count/<resource>.<group>`：用於非核心（core）組的資源
* `count/<resource>`：用於核心組的資源

<!--
Here is an example set of resources users may want to put under object count quota:
-->
這是使用者可能希望利用物件計數配額來管理的一組資源示例。

* `count/persistentvolumeclaims`
* `count/services`
* `count/secrets`
* `count/configmaps`
* `count/replicationcontrollers`
* `count/deployments.apps`
* `count/replicasets.apps`
* `count/statefulsets.apps`
* `count/jobs.batch`
* `count/cronjobs.batch`

<!--
The same syntax can be used for custom resources.
For example, to create a quota on a `widgets` custom resource in the `example.com` API group, use `count/widgets.example.com`.
-->
相同語法也可用於自定義資源。
例如，要對 `example.com` API 組中的自定義資源 `widgets` 設定配額，請使用
`count/widgets.example.com`。

<!--
When using `count/*` resource quota, an object is charged against the quota if it exists in server storage.
These types of quotas are useful to protect against exhaustion of storage resources.  For example, you may
want to limit the number of Secrets in a server given their large size. Too many Secrets in a cluster can
actually prevent servers and controllers from starting. You can set a quota for Jobs to protect against
a poorly configured CronJob. CronJobs that create too many Jobs in a namespace can lead to a denial of service.
-->
當使用 `count/*` 資源配額時，如果物件存在於伺服器儲存中，則會根據配額管理資源。
這些型別的配額有助於防止儲存資源耗盡。例如，使用者可能想根據伺服器的儲存能力來對伺服器中
Secret 的數量進行配額限制。
叢集中存在過多的 Secret 實際上會導致伺服器和控制器無法啟動。
使用者可以選擇對 Job 進行配額管理，以防止配置不當的 CronJob 在某名稱空間中建立太多
Job 而導致叢集拒絕服務。

<!--
It is possible to do generic object count quota on a limited set of resources.
In addition, it is possible to further constrain quota for particular resources by their type.

The following types are supported:
-->
對有限的一組資源上實施一般性的物件數量配額也是可能的。
此外，還可以進一步按資源的型別設定其配額。

支援以下型別：

<!--
| Resource Name | Description |
| ----------------------------|--------------------------------------------- |
| `configmaps` | The total number of ConfigMaps that can exist in the namespace. |
| `persistentvolumeclaims` | The total number of [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `pods` | The total number of Pods in a non-terminal state that can exist in the namespace.  A pod is in a terminal state if `.status.phase in (Failed, Succeeded)` is true.  |
| `replicationcontrollers` | The total number of ReplicationControllers that can exist in the namespace. |
| `resourcequotas` | The total number of ResourceQuotas that can exist in the namespace. |
| `services` | The total number of Services that can exist in the namespace. |
| `services.loadbalancers` | The total number of Services of type `LoadBalancer` that can exist in the namespace. |
| `services.nodeports` | The total number of Services of type `NodePort` that can exist in the namespace. |
| `secrets` | The total number of Secrets that can exist in the namespace. |
-->
| 資源名稱 | 描述 |
| ------------------------------- | ------------------------------------------------- |
| `configmaps` | 在該名稱空間中允許存在的 ConfigMap 總數上限。 |
| `persistentvolumeclaims` | 在該名稱空間中允許存在的 [PVC](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) 的總數上限。 |
| `pods` | 在該名稱空間中允許存在的非終止狀態的 Pod 總數上限。Pod 終止狀態等價於 Pod 的 `.status.phase in (Failed, Succeeded)` 為真。 |
| `replicationcontrollers` | 在該名稱空間中允許存在的 ReplicationController 總數上限。 |
| `resourcequotas` | 在該名稱空間中允許存在的 ResourceQuota 總數上限。 |
| `services` | 在該名稱空間中允許存在的 Service 總數上限。 |
| `services.loadbalancers` | 在該名稱空間中允許存在的 LoadBalancer 型別的 Service 總數上限。 |
| `services.nodeports` | 在該名稱空間中允許存在的 NodePort 型別的 Service 總數上限。 |
| `secrets` | 在該名稱空間中允許存在的 Secret 總數上限。 |

<!--
For example, `pods` quota counts and enforces a maximum on the number of `pods`
created in a single namespace that are not terminal. You might want to set a `pods`
quota on a namespace to avoid the case where a user creates many small pods and
exhausts the cluster's supply of Pod IPs.
-->
例如，`pods` 配額統計某個名稱空間中所建立的、非終止狀態的 `Pod` 個數並確保其不超過某上限值。
使用者可能希望在某名稱空間中設定 `pods` 配額，以避免有使用者建立很多小的 Pod，
從而耗盡叢集所能提供的 Pod IP 地址。

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
當一個作用域被新增到配額中後，它會對作用域相關的資源數量作限制。
如配額中指定了允許（作用域）集合之外的資源，會導致驗證錯誤。

<!--
| Scope | Description |
| ----- | ------------ |
| `Terminating` | Match pods where `.spec.activeDeadlineSeconds >= 0` |
| `NotTerminating` | Match pods where `.spec.activeDeadlineSeconds is nil` |
| `BestEffort` | Match pods that have best effort quality of service. |
| `NotBestEffort` | Match pods that do not have best effort quality of service. |
| `PriorityClass` | Match pods that references the specified [priority class](/docs/concepts/scheduling-eviction/pod-priority-preemption). |
| `CrossNamespacePodAffinity` | Match pods that have cross-namespace pod [(anti)affinity terms](/docs/concepts/scheduling-eviction/assign-pod-node). |
-->
| 作用域 | 描述 |
| ----- | ----------- |
| `Terminating` | 匹配所有 `spec.activeDeadlineSeconds` 不小於 0 的 Pod。 |
| `NotTerminating` | 匹配所有 `spec.activeDeadlineSeconds` 是 nil 的 Pod。 |
| `BestEffort` | 匹配所有 Qos 是 BestEffort 的 Pod。 |
| `NotBestEffort` | 匹配所有 Qos 不是 BestEffort 的 Pod。 |
| `PriorityClass` | 匹配所有引用了所指定的[優先順序類](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption)的 Pods。 |
| `CrossNamespacePodAffinity` | 匹配那些設定了跨名字空間 [（反）親和性條件](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node)的 Pod。 |

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
需要注意的是，你不可以在同一個配額物件中同時設定 `Terminating` 和 `NotTerminating`
作用域，你也不可以在同一個配額中同時設定 `BestEffort` 和 `NotBestEffort`
作用域。

`scopeSelector` 支援在 `operator` 欄位中使用以下值：

* `In`
* `NotIn`
* `Exists`
* `DoesNotExist`

<!--
When using one of the following values as the `scopeName` when defining the
`scopeSelector`, the `operator` must be `Exists`. 
-->
定義 `scopeSelector` 時，如果使用以下值之一作為 `scopeName` 的值，則對應的
`operator` 只能是 `Exists`。

* `Terminating`
* `NotTerminating`
* `BestEffort`
* `NotBestEffort`

<!--
If the `operator` is `In` or `NotIn`, the `values` field must have at least
one value. For example:
-->
如果 `operator` 是 `In` 或 `NotIn` 之一，則 `values` 欄位必須至少包含一個值。
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
If the `operator` is `Exists` or `DoesNotExist`, the `values field must *NOT* be
specified.
-->
如果 `operator` 為 `Exists` 或 `DoesNotExist`，則*不*可以設定 `values` 欄位。

<!--
### Resource Quota Per PriorityClass
-->
### 基於優先順序類（PriorityClass）來設定資源配額

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
Pods can be created at a specific [priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority).
You can control a pod's consumption of system resources based on a pod's priority, by using the `scopeSelector`
field in the quota spec.
-->
Pod 可以建立為特定的[優先順序](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)。
透過使用配額規約中的 `scopeSelector` 欄位，使用者可以根據 Pod 的優先順序控制其系統資源消耗。

<!--
A quota is matched and consumed only if `scopeSelector` in the quota spec selects the pod.
-->
僅當配額規範中的 `scopeSelector` 欄位選擇到某 Pod 時，配額機制才會匹配和計量 Pod 的資源消耗。

<!--
When quota is scoped for priority class using `scopeSelector` field, quota object
is restricted to track only following resources:
-->
如果配額物件透過 `scopeSelector` 欄位設定其作用域為優先順序類，則配額物件只能
跟蹤以下資源：

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
本示例建立一個配額物件，並將其與具有特定優先順序的 Pod 進行匹配。
該示例的工作方式如下：

<!--
- Pods in the cluster have one of the three priority classes, "low", "medium", "high".
- One quota object is created for each priority.
-->
- 叢集中的 Pod 可取三個優先順序類之一，即 "low"、"medium"、"high"。
- 為每個優先順序建立一個配額物件。

<!-- Save the following YAML to a file `quota.yml`.  -->
將以下 YAML 儲存到檔案 `quota.yml` 中。

```yaml
apiVersion: v1
kind: List
items:
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-high
  spec:
    hard:
      cpu: "1000"
      memory: 200Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["high"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-medium
  spec:
    hard:
      cpu: "10"
      memory: 20Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["medium"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-low
  spec:
    hard:
      cpu: "5"
      memory: 10Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["low"]
```

<!--
Apply the YAML using `kubectl create`.
-->
使用 `kubectl create` 命令執行以下操作。

```shell
kubectl create -f ./quota.yml
```

```
resourcequota/pods-high created
resourcequota/pods-medium created
resourcequota/pods-low created
```

<!--
Verify that `Used` quota is `0` using `kubectl describe quota`.
-->
使用 `kubectl describe quota` 操作驗證配額的 `Used` 值為 `0`。

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
file `high-priority-pod.yml`.
-->
建立優先順序為 "high" 的 Pod。
將以下 YAML 儲存到檔案 `high-priority-pod.yml` 中。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: high-priority
spec:
  containers:
  - name: high-priority
    image: ubuntu
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo hello; sleep 10;done"]
    resources:
      requests:
        memory: "10Gi"
        cpu: "500m"
      limits:
        memory: "10Gi"
        cpu: "500m"
  priorityClassName: high
```

<!--
Apply it with `kubectl create`.
-->
使用 `kubectl create` 執行以下操作。

```shell
kubectl create -f ./high-priority-pod.yml
```

<!--
Verify that "Used" stats for "high" priority quota, `pods-high`, has changed and that
the other two quotas are unchanged.
-->
確認 "high" 優先順序配額 `pods-high` 的 "Used" 統計資訊已更改，並且其他兩個配額未更改。

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
叢集運維人員可以使用 `CrossNamespacePodAffinity` 配額作用域來
限制哪個名字空間中可以存在包含跨名字空間親和性規則的 Pod。
更為具體一點，此作用域用來配置哪些 Pod 可以在其 Pod 親和性規則
中設定 `namespaces` 或 `namespaceSelector` 欄位。

<!--
Preventing users from using cross-namespace affinity terms might be desired since a pod
with anti-affinity constraints can block pods from all other namespaces 
from getting scheduled in a failure domain. 
-->
禁止使用者使用跨名字空間的親和性規則可能是一種被需要的能力，因為帶有
反親和性約束的 Pod 可能會阻止所有其他名字空間的 Pod 被排程到某失效域中。

<!--
Using this scope operators can prevent certain namespaces (`foo-ns` in the example below) 
from having pods that use cross-namespace pod affinity by creating a resource quota object in
that namespace with `CrossNamespaceAffinity` scope and hard limit of 0:
-->
使用此作用域運算子可以避免某些名字空間（例如下面例子中的 `foo-ns`）執行
特別的 Pod，這類 Pod 使用跨名字空間的 Pod 親和性約束，在該名字空間中建立
了作用域為 `CrossNamespaceAffinity` 的、硬性約束為 0 的資源配額物件。

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
    - scopeName: CrossNamespaceAffinity
```

<!--
If operators want to disallow using `namespaces` and `namespaceSelector` by default, and 
only allow it for specific namespaces, they could configure `CrossNamespaceAffinity` 
as a limited resource by setting the kube-apiserver flag -admission-control-config-file
to the path of the following configuration file:
-->
如果叢集運維人員希望預設禁止使用 `namespaces` 和 `namespaceSelector`，而
僅僅允許在特定名字空間中這樣做，他們可以將 `CrossNamespaceAffinity` 作為一個
被約束的資源。方法是為 `kube-apiserver` 設定標誌
`--admission-control-config-file`，使之指向如下的配置檔案：

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
      - scopeName: CrossNamespaceAffinity
```

<!--
With the above configuration, pods can use `namespaces` and `namespaceSelector` in pod affinity only
if the namespace where they are created have a resource quota object with 
`CrossNamespaceAffinity` scope and a hard limit greater than or equal to the number of pods using those fields.
-->
基於上面的配置，只有名字空間中包含作用域為 `CrossNamespaceAffinity` 且
硬性約束大於或等於使用 `namespaces` 和 `namespaceSelector` 欄位的 Pods
個數時，才可以在該名字空間中繼續建立在其 Pod 親和性規則中設定 `namespaces`
或 `namespaceSelector` 的新 Pod。

<!--
## Requests compared to Limits {#requests-vs-limits}

When allocating compute resources, each container may specify a request and a limit value for either CPU or memory.
The quota can be configured to quota either value.
-->
## 請求與限制的比較   {#requests-vs-limits}

分配計算資源時，每個容器可以為 CPU 或記憶體指定請求和約束。
配額可以針對二者之一進行設定。

<!--
If the quota has a value specified for `requests.cpu` or `requests.memory`, then it requires that every incoming
container makes an explicit request for those resources.  If the quota has a value specified for `limits.cpu` or `limits.memory`,
then it requires that every incoming container specifies an explicit limit for those resources.
-->
如果配額中指定了 `requests.cpu` 或 `requests.memory` 的值，則它要求每個容器都顯式給出對這些資源的請求。
同理，如果配額中指定了 `limits.cpu` 或 `limits.memory` 的值，那麼它要求每個容器都顯式設定對應資源的限制。

<!--
## Viewing and Setting Quotas

Kubectl supports creating, updating, and viewing quotas:
-->
## 檢視和設定配額 {#viewing-and-setting-quotas}

Kubectl 支援建立、更新和檢視配額：

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
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
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
Kubectl also supports object count quota for all standard namespaced resources
using the syntax `count/<resource>.<group>`:
-->
kubectl 還使用語法 `count/<resource>.<group>` 支援所有標準的、名稱空間域的資源的物件計數配額：

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
expressed in absolute units.  So, if you add nodes to your cluster, this does *not*
automatically give each namespace the ability to consume more resources.
-->
## 配額和叢集容量   {#quota-and-cluster-capacity}

ResourceQuota 與叢集資源總量是完全獨立的。它們透過絕對的單位來配置。
所以，為叢集新增節點時，資源配額*不會*自動賦予每個名稱空間消耗更多資源的能力。

<!--
Sometimes more complex policies may be desired, such as:

- Proportionally divide total cluster resources among several teams.
- Allow each tenant to grow resource usage as needed, but have a generous
  limit to prevent accidental resource exhaustion.
- Detect demand from one namespace, add nodes, and increase quota.
-->
有時可能需要資源配額支援更復雜的策略，比如：

- 在幾個團隊中按比例劃分總的叢集資源。
- 允許每個租戶根據需要增加資源使用量，但要有足夠的限制以防止資源意外耗盡。
- 探測某個名稱空間的需求，新增物理節點並擴大資源配額值。

<!--
Such policies could be implemented using `ResourceQuotas` as building blocks, by
writing a "controller" that watches the quota usage and adjusts the quota
hard limits of each namespace according to other signals.
-->
這些策略可以透過將資源配額作為一個組成模組、手動編寫一個控制器來監控資源使用情況，
並結合其他訊號調整名稱空間上的硬性資源配額來實現。

<!--
Note that resource quota divides up aggregate cluster resources, but it creates no
restrictions around nodes: pods from several namespaces may run on the same node.
-->
注意：資源配額對叢集資源總體進行劃分，但它對節點沒有限制：來自不同名稱空間的 Pod 可能在同一節點上執行。

<!--
## Limit Priority Class consumption by default

It may be desired that pods at a particular priority, eg. "cluster-services",
should be allowed in a namespace, if and only if, a matching quota object exists.
-->
## 預設情況下限制特定優先順序的資源消耗

有時候可能希望當且僅當某名字空間中存在匹配的配額物件時，才可以建立特定優先順序
（例如 "cluster-services"）的 Pod。

<!--
With this mechanism, operators will be able to restrict usage of certain high
priority classes to a limited number of namespaces and not every namespace
will be able to consume these priority classes by default.
-->
透過這種機制，操作人員能夠將限制某些高優先順序類僅出現在有限數量的名稱空間中，
而並非每個名稱空間預設情況下都能夠使用這些優先順序類。

<!--
To enforce this, kube-apiserver flag `-admission-control-config-file` should be
used to pass path to the following configuration file:
-->
要實現此目的，應設定 kube-apiserver 的標誌 `--admission-control-config-file` 
指向如下配置檔案：

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
現在在 `kube-system` 名字空間中建立一個資源配額物件：

{{< codenew file="policy/priority-class-resourcequota.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/policy/priority-class-resourcequota.yaml -n kube-system
```

```none
resourcequota/pods-cluster-services created
```

<!--
In this case, a pod creation will be allowed if:

1.  the Pod's `priorityClassName` is not specified.
1.  the Pod's `priorityClassName` is specified to a value other than `cluster-services`.
1.  the Pod's `priorityClassName` is set to `cluster-services`, it is to be created
   in the `kube-system` namespace, and it has passed the resource quota check.
-->
在這裡，當以下條件滿足時可以建立 Pod：

1. Pod 未設定 `priorityClassName`
1. Pod 的 `priorityClassName` 設定值不是 `cluster-services`
1. Pod 的 `priorityClassName` 設定值為 `cluster-services`，它將被創建於
   `kube-system` 名字空間中，並且它已經通過了資源配額檢查。

<!--
A Pod creation request is rejected if its `priorityClassName` is set to `cluster-services`
and it is to be created in a namespace other than `kube-system`.
-->
如果 Pod 的 `priorityClassName` 設定為 `cluster-services`，但要被建立到
`kube-system` 之外的別的名字空間，則 Pod 建立請求也被拒絕。

## {{% heading "whatsnext" %}}

<!--
- See [ResourceQuota design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md) for more information.
- See a [detailed example for how to use resource quota](/docs/tasks/administer-cluster/quota-api-object/).
- Read [Quota support for priority class design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/pod-priority-resourcequota.md).
- See [LimitedResources](https://github.com/kubernetes/kubernetes/pull/36765)
-->
- 檢視[資源配額設計文件](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md)
- 檢視[如何使用資源配額的詳細示例](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)。
- 閱讀[優先順序類配額支援的設計文件](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/pod-priority-resourcequota.md)。
  瞭解更多資訊。
- 參閱 [LimitedResources](https://github.com/kubernetes/kubernetes/pull/36765)

