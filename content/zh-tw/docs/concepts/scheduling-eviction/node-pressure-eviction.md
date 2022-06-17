---
title: 節點壓力驅逐
content_type: concept
weight: 60
---
<!-- 
title: Node-pressure Eviction
content_type: concept
weight: 60 
-->

{{<glossary_definition term_id="node-pressure-eviction" length="short">}}</br>

<!-- 
The {{<glossary_tooltip term_id="kubelet" text="kubelet">}} monitors resources 
like CPU, memory, disk space, and filesystem inodes on your cluster's nodes. 
When one or more of these resources reach specific consumption levels, the 
kubelet can proactively fail one or more pods on the node to reclaim resources
and prevent starvation. 

During a node-pressure eviction, the kubelet sets the `PodPhase` for the
selected pods to `Failed`. This terminates the pods. 

Node-pressure eviction is not the same as 
[API-initiated eviction](/docs/reference/generated/kubernetes-api/v1.23/).
-->
{{<glossary_tooltip term_id="kubelet" text="kubelet">}}
監控叢集節點的 CPU、記憶體、磁碟空間和檔案系統的 inode 等資源。
當這些資源中的一個或者多個達到特定的消耗水平，
kubelet 可以主動地使節點上一個或者多個 Pod 失效，以回收資源防止飢餓。

在節點壓力驅逐期間，kubelet 將所選 Pod 的 `PodPhase` 設定為 `Failed`。這將終止 Pod。

節點壓力驅逐不同於 [API 發起的驅逐](/docs/reference/generated/kubernetes-api/v1.23/)。

<!-- 
The kubelet does not respect your configured `PodDisruptionBudget` or the pod's
`terminationGracePeriodSeconds`. If you use [soft eviction thresholds](#soft-eviction-thresholds),
the kubelet respects your configured `eviction-max-pod-grace-period`. If you use
[hard eviction thresholds](#hard-eviction-thresholds), it uses a `0s` grace period for termination.

If the pods are managed by a {{< glossary_tooltip text="workload" term_id="workload" >}}
resource (such as {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
or {{< glossary_tooltip text="Deployment" term_id="deployment" >}}) that
replaces failed pods, the control plane or `kube-controller-manager` creates new 
pods in place of the evicted pods.
-->
kubelet 並不理會你配置的 `PodDisruptionBudget` 或者是 Pod 的 `terminationGracePeriodSeconds`。
如果你使用了[軟碟機逐條件](#soft-eviction-thresholds)，kubelet 會考慮你所配置的
`eviction-max-pod-grace-period`。
如果你使用了[硬驅逐條件](#hard-eviction-thresholds)，它使用 `0s` 寬限期來終止 Pod。

如果 Pod 是由替換失敗 Pod 的{{< glossary_tooltip text="工作負載" term_id="workload" >}}資源
（例如 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
或者 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}）管理，
則控制平面或 `kube-controller-manager` 會建立新的 Pod 來代替被驅逐的 Pod。

{{<note>}}
<!-- 
The kubelet attempts to [reclaim node-level resources](#reclaim-node-resources)
before it terminates end-user pods. For example, it removes unused container
images when disk resources are starved.
-->
kubelet 在終止終端使用者 Pod 之前會嘗試[回收節點級資源](#reclaim-node-resources)。
例如，它會在磁碟資源不足時刪除未使用的容器映象。
{{</note>}}

<!-- 
The kubelet uses various parameters to make eviction decisions, like the following:

  * Eviction signals
  * Eviction thresholds
  * Monitoring intervals
-->
kubelet 使用各種引數來做出驅逐決定，如下所示：

  * 驅逐訊號
  * 驅逐條件
  * 監控間隔

<!-- 
### Eviction signals {#eviction-signals}

Eviction signals are the current state of a particular resource at a specific
point in time. Kubelet uses eviction signals to make eviction decisions by
comparing the signals to eviction thresholds, which are the minimum amount of 
the resource that should be available on the node. 

Kubelet uses the following eviction signals:
-->
### 驅逐訊號 {#eviction-signals}

驅逐訊號是特定資源在特定時間點的當前狀態。
kubelet 使用驅逐訊號，透過將訊號與驅逐條件進行比較來做出驅逐決定，
驅逐條件是節點上應該可用資源的最小量。

kubelet 使用以下驅逐訊號：

| 驅逐訊號              | 描述                                                                                   |
|----------------------|---------------------------------------------------------------------------------------|
| `memory.available`   | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |
| `nodefs.available`   | `nodefs.available` := `node.stats.fs.available`                                       |
| `nodefs.inodesFree`  | `nodefs.inodesFree` := `node.stats.fs.inodesFree`                                     |
| `imagefs.available`  | `imagefs.available` := `node.stats.runtime.imagefs.available`                         |
| `imagefs.inodesFree` | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree`                       |
| `pid.available`      | `pid.available` := `node.stats.rlimit.maxpid` - `node.stats.rlimit.curproc`           |

<!-- 
In this table, the `Description` column shows how kubelet gets the value of the
signal. Each signal supports either a percentage or a literal value. Kubelet 
calculates the percentage value relative to the total capacity associated with
the signal. 
-->
在上表中，`描述`列顯示了 kubelet 如何獲取訊號的值。每個訊號支援百分比值或者是字面值。
kubelet 計算相對於與訊號有關的總量的百分比值。

<!--
The value for `memory.available` is derived from the cgroupfs instead of tools
like `free -m`. This is important because `free -m` does not work in a
container, and if users use the [node
allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) feature, out of resource decisions
are made local to the end user Pod part of the cgroup hierarchy as well as the
root node. This [script](/examples/admin/resource/memory-available.sh)
reproduces the same set of steps that the kubelet performs to calculate
`memory.available`. The kubelet excludes inactive_file (i.e. # of bytes of
file-backed memory on inactive LRU list) from its calculation as it assumes that
memory is reclaimable under pressure.  
-->
`memory.available` 的值來自 cgroupfs，而不是像 `free -m` 這樣的工具。
這很重要，因為 `free -m` 在容器中不起作用，如果使用者使用
[節點可分配資源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
這一功能特性，資源不足的判定是基於 CGroup 層次結構中的使用者 Pod 所處的區域性及 CGroup 根節點作出的。
這個[指令碼](/zh-cn/examples/admin/resource/memory-available.sh)
重現了 kubelet 為計算 `memory.available` 而執行的相同步驟。
kubelet 在其計算中排除了 inactive_file（即非活動 LRU 列表上基於檔案來虛擬的記憶體的位元組數），
因為它假定在壓力下記憶體是可回收的。

<!--
The kubelet supports the following filesystem partitions:

1. `nodefs`: The node's main filesystem, used for local disk volumes, emptyDir,
   log storage, and more. For example, `nodefs` contains `/var/lib/kubelet/`. 
1. `imagefs`: An optional filesystem that container runtimes use to store container
   images and container writable layers.

Kubelet auto-discovers these filesystems and ignores other filesystems. Kubelet
does not support other configurations. 
-->
kubelet 支援以下檔案系統分割槽：

1. `nodefs`：節點的主要檔案系統，用於本地磁碟卷、emptyDir、日誌儲存等。
   例如，`nodefs` 包含 `/var/lib/kubelet/`。
1. `imagefs`：可選檔案系統，供容器執行時儲存容器映象和容器可寫層。

kubelet 會自動發現這些檔案系統並忽略其他檔案系統。kubelet 不支援其他配置。

{{<note>}}
<!-- 
Some kubelet garbage collection features are deprecated in favor of eviction.
For a list of the deprecated features, see [kubelet garbage collection deprecation](/docs/concepts/cluster-administration/kubelet-garbage-collection/#deprecation).
-->
一些 kubelet 垃圾收集功能已被棄用，以支援驅逐。
有關已棄用功能的列表，請參閱
[kubelet 垃圾收集棄用](/zh-cn/docs/concepts/cluster-administration/kubelet-garbage-collection/#deprecation)。
{{</note>}}

<!-- 
### Eviction thresholds

You can specify custom eviction thresholds for the kubelet to use when it makes
eviction decisions.

Eviction thresholds have the form `[eviction-signal][operator][quantity]`, where:

* `eviction-signal` is the [eviction signal](#eviction-signals) to use.
* `operator` is the [relational operator](https://en.wikipedia.org/wiki/Relational_operator#Standard_relational_operators)
  you want, such as `<` (less than).
* `quantity` is the eviction threshold amount, such as `1Gi`. The value of `quantity`
  must match the quantity representation used by Kubernetes. You can use either
  literal values or percentages (`%`).
-->
### 驅逐條件 {#eviction-thresholds}

你可以為 kubelet 指定自定義驅逐條件，以便在作出驅逐決定時使用。

驅逐條件的形式為 `[eviction-signal][operator][quantity]`，其中：

* `eviction-signal` 是要使用的[驅逐訊號](#eviction-signals)。
* `operator` 是你想要的[關係運算符](https://en.wikipedia.org/wiki/Relational_operator#Standard_relational_operators)，
  比如 `<`（小於）。
* `quantity` 是驅逐條件數量，例如 `1Gi`。
  `quantity` 的值必須與 Kubernetes 使用的數量表示相匹配。
  你可以使用文字值或百分比（`%`）。

<!--
For example, if a node has `10Gi` of total memory and you want trigger eviction if
the available memory falls below `1Gi`, you can define the eviction threshold as
either `memory.available<10%` or `memory.available<1Gi`. You cannot use both.

You can configure soft and hard eviction thresholds.  
-->
例如，如果一個節點的總記憶體為 10Gi 並且你希望在可用記憶體低於 1Gi 時觸發驅逐，
則可以將驅逐條件定義為 `memory.available<10%` 或 `memory.available< 1G`。
你不能同時使用二者。

你可以配置軟和硬驅逐條件。

<!--  
#### Soft eviction thresholds {#soft-eviction-thresholds}

A soft eviction threshold pairs an eviction threshold with a required
administrator-specified grace period. The kubelet does not evict pods until the
grace period is exceeded. The kubelet returns an error on startup if there is no
specified grace period. 
-->
#### 軟碟機逐條件 {#soft-eviction-thresholds}

軟碟機逐條件將驅逐條件與管理員所必須指定的寬限期配對。
在超過寬限期之前，kubelet 不會驅逐 Pod。
如果沒有指定的寬限期，kubelet 會在啟動時返回錯誤。

<!-- 
You can specify both a soft eviction threshold grace period and a maximum
allowed pod termination grace period for kubelet to use during evictions. If you
specify a maximum allowed grace period and the soft eviction threshold is met, 
the kubelet uses the lesser of the two grace periods. If you do not specify a
maximum allowed grace period, the kubelet kills evicted pods immediately without
graceful termination.
-->
你可以既指定軟碟機逐條件寬限期，又指定 Pod 終止寬限期的上限，，給 kubelet 在驅逐期間使用。
如果你指定了寬限期的上限並且 Pod 滿足軟碟機逐閾條件，則 kubelet 將使用兩個寬限期中的較小者。
如果你沒有指定寬限期上限，kubelet 會立即殺死被驅逐的 Pod，不允許其體面終止。

<!--  
You can use the following flags to configure soft eviction thresholds:

* `eviction-soft`: A set of eviction thresholds like `memory.available<1.5Gi`
  that can trigger pod eviction if held over the specified grace period.
* `eviction-soft-grace-period`: A set of eviction grace periods like `memory.available=1m30s`
  that define how long a soft eviction threshold must hold before triggering a Pod eviction.
* `eviction-max-pod-grace-period`: The maximum allowed grace period (in seconds)
  to use when terminating pods in response to a soft eviction threshold being met.
-->
你可以使用以下標誌來配置軟碟機逐條件：

* `eviction-soft`：一組驅逐條件，如 `memory.available<1.5Gi`，
  如果驅逐條件持續時長超過指定的寬限期，可以觸發 Pod 驅逐。
* `eviction-soft-grace-period`：一組驅逐寬限期，
  如 `memory.available=1m30s`，定義軟碟機逐條件在觸發 Pod 驅逐之前必須保持多長時間。
* `eviction-max-pod-grace-period`：在滿足軟碟機逐條件而終止 Pod 時使用的最大允許寬限期（以秒為單位）。 

<!-- 
#### Hard eviction thresholds {#hard-eviction-thresholds}

A hard eviction threshold has no grace period. When a hard eviction threshold is
met, the kubelet kills pods immediately without graceful termination to reclaim
the starved resource.

You can use the `eviction-hard` flag to configure a set of hard eviction 
thresholds like `memory.available<1Gi`. 
-->
#### 硬驅逐條件 {#hard-eviction-thresholds}

硬驅逐條件沒有寬限期。當達到硬驅逐條件時，
kubelet 會立即殺死 pod，而不會正常終止以回收緊缺的資源。

你可以使用 `eviction-hard` 標誌來配置一組硬驅逐條件，
例如 `memory.available<1Gi`。

<!-- 
The kubelet has the following default hard eviction thresholds:

* `memory.available<100Mi`
* `nodefs.available<10%`
* `imagefs.available<15%`
* `nodefs.inodesFree<5%` (Linux nodes)
-->
kubelet 具有以下預設硬驅逐條件：

* `memory.available<100Mi`
* `nodefs.available<10%`
* `imagefs.available<15%`
* `nodefs.inodesFree<5%`（Linux 節點）

<!--  
### Eviction monitoring interval

The kubelet evaluates eviction thresholds based on its configured `housekeeping-interval`
which defaults to `10s`.
-->
### 驅逐監測間隔

kubelet 根據其配置的 `housekeeping-interval`（預設為 `10s`）評估驅逐條件。

<!--
### Node conditions {#node-conditions}

The kubelet reports node conditions to reflect that the node is under pressure
because hard or soft eviction threshold is met, independent of configured grace
periods. 
-->
### 節點條件 {#node-conditions}

kubelet 報告節點狀況以反映節點處於壓力之下，因為滿足硬或軟碟機逐條件，與配置的寬限期無關。

<!--  
The kubelet maps eviction signals to node conditions as follows: 

| Node Condition    | Eviction Signal                                                                       | Description                                                                                                                  |
|-------------------|---------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| `MemoryPressure`  | `memory.available`                                                                    | Available memory on the node has satisfied an eviction threshold                                                             |
| `DiskPressure`    | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, or `imagefs.inodesFree` | Available disk space and inodes on either the node's root filesystem or image filesystem has satisfied an eviction threshold |
| `PIDPressure`     | `pid.available`                                                                       | Available processes identifiers on the (Linux) node has fallen below an eviction threshold                                   |

The kubelet updates the node conditions based on the configured 
`--node-status-update-frequency`, which defaults to `10s`.
-->
kubelet 根據下表將驅逐訊號對映為節點狀況：

| 節點條件 | 驅逐訊號 | 描述 |
|---------|--------|------|
| `MemoryPressure` | `memory.available` | 節點上的可用記憶體已滿足驅逐條件 |
| `DiskPressure`   | `nodefs.available`、`nodefs.inodesFree`、`imagefs.available` 或 `imagefs.inodesFree` | 節點的根檔案系統或映像檔案系統上的可用磁碟空間和 inode 已滿足驅逐條件 |
| `PIDPressure`    | `pid.available` | (Linux) 節點上的可用程序識別符號已低於驅逐條件 |

kubelet 根據配置的 `--node-status-update-frequency` 更新節點條件，預設為 `10s`。

<!-- 
#### Node condition oscillation

In some cases, nodes oscillate above and below soft eviction thresholds without
holding for the defined grace periods. This causes the reported node condition
to constantly switch between `true` and `false`, leading to bad eviction decisions.

To protect against oscillation, you can use the `eviction-pressure-transition-period`
flag, which controls how long the kubelet must wait before transitioning a node
condition to a different state. The transition period has a default value of `5m`.
-->
#### 節點條件振盪

在某些情況下，節點在軟碟機逐條件上下振盪，而沒有保持定義的寬限期。
這會導致報告的節點條件在 `true` 和 `false` 之間不斷切換，從而導致錯誤的驅逐決策。

為了防止振盪，你可以使用 `eviction-pressure-transition-period` 標誌，
該標誌控制 kubelet 在將節點條件轉換為不同狀態之前必須等待的時間。
過渡期的預設值為 `5m`。

<!-- 
### Reclaiming node level resources {#reclaim-node-resources}

The kubelet tries to reclaim node-level resources before it evicts end-user pods.

When a `DiskPressure` node condition is reported, the kubelet reclaims node-level
resources based on the filesystems on the node. 
-->
### 回收節點級資源 {#reclaim-node-resources}

kubelet 在驅逐終端使用者 Pod 之前會先嚐試回收節點級資源。

當報告 `DiskPressure` 節點狀況時，kubelet 會根據節點上的檔案系統回收節點級資源。

<!--
#### With `imagefs`

If the node has a dedicated `imagefs` filesystem for container runtimes to use,
the kubelet does the following:

  * If the `nodefs` filesystem meets the eviction thresholds, the kubelet garbage collects
    dead pods and containers. 
  * If the `imagefs` filesystem meets the eviction thresholds, the kubelet
    deletes all unused images.
-->
#### 有 `imagefs`

如果節點有一個專用的 `imagefs` 檔案系統供容器執行時使用，kubelet 會執行以下操作：

   * 如果 `nodefs` 檔案系統滿足驅逐條件，kubelet 垃圾收集死亡 Pod 和容器。
   * 如果 `imagefs` 檔案系統滿足驅逐條件，kubelet 將刪除所有未使用的映象。

<!-- 
#### Without `imagefs`

If the node only has a `nodefs` filesystem that meets eviction thresholds,
the kubelet frees up disk space in the following order:

1. Garbage collect dead pods and containers
1. Delete unused images
-->
#### 沒有 `imagefs`

如果節點只有一個滿足驅逐條件的 `nodefs` 檔案系統，
kubelet 按以下順序釋放磁碟空間：

1. 對死亡的 Pod 和容器進行垃圾收集
1. 刪除未使用的映象

<!-- 
### Pod selection for kubelet eviction

If the kubelet's attempts to reclaim node-level resources don't bring the eviction
signal below the threshold, the kubelet begins to evict end-user pods. 

The kubelet uses the following parameters to determine pod eviction order:

1. Whether the pod's resource usage exceeds requests
1. [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
1. The pod's resource usage relative to requests
-->
### kubelet 驅逐時 Pod 的選擇

如果 kubelet 回收節點級資源的嘗試沒有使驅逐訊號低於條件，
則 kubelet 開始驅逐終端使用者 Pod。

kubelet 使用以下引數來確定 Pod 驅逐順序：

1. Pod 的資源使用是否超過其請求
1. [Pod 優先順序](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
1. Pod 相對於請求的資源使用情況

<!-- 
As a result, kubelet ranks and evicts pods in the following order:

1. `BestEffort` or `Burstable` pods where the usage exceeds requests. These pods
   are evicted based on their Priority and then by how much their usage level
   exceeds the request.
1. `Guaranteed` pods and `Burstable` pods where the usage is less than requests
   are evicted last, based on their Priority.
-->
因此，kubelet 按以下順序排列和驅逐 Pod：

1. 首先考慮資源使用量超過其請求的 `BestEffort` 或 `Burstable` Pod。
   這些 Pod 會根據它們的優先順序以及它們的資源使用級別超過其請求的程度被逐出。
1. 資源使用量少於請求量的 `Guaranteed` Pod 和 `Burstable` Pod 根據其優先順序被最後驅逐。

{{<note>}}
<!-- 
The kubelet does not use the pod's QoS class to determine the eviction order.
You can use the QoS class to estimate the most likely pod eviction order when 
reclaiming resources like memory. QoS does not apply to EphemeralStorage requests,
so the above scenario will not apply if the node is, for example, under `DiskPressure`.
-->
kubelet 不使用 Pod 的 QoS 類來確定驅逐順序。
在回收記憶體等資源時，你可以使用 QoS 類來估計最可能的 Pod 驅逐順序。
QoS 不適用於臨時儲存（EphemeralStorage）請求，
因此如果節點在 `DiskPressure` 下，則上述場景將不適用。
{{</note>}}

<!-- 
`Guaranteed` pods are guaranteed only when requests and limits are specified for
all the containers and they are equal. These pods will never be evicted because
of another pod's resource consumption. If a system daemon (such as `kubelet`,
and `journald`) is consuming more resources than were reserved via 
`system-reserved` or `kube-reserved` allocations, and the node only has
`Guaranteed` or `Burstable` pods using less resources than requests left on it,
then the kubelet must choose to evict one of these pods to preserve node stability
and to limit the impact of resource starvation on other pods. In this case, it
will choose to evict pods of lowest Priority first.
-->
僅當 `Guaranteed` Pod 中所有容器都被指定了請求和限制並且二者相等時，才保證 Pod 不被驅逐。
這些 Pod 永遠不會因為另一個 Pod 的資源消耗而被驅逐。
如果系統守護程序（例如 `kubelet` 和 `journald`）
消耗的資源比透過 `system-reserved` 或 `kube-reserved` 分配保留的資源多，
並且該節點只有 `Guaranteed` 或 `Burstable` Pod 使用的資源少於其上剩餘的請求，
那麼 kubelet 必須選擇驅逐這些 Pod 中的一個以保持節點穩定性並減少資源匱乏對其他 Pod 的影響。 
在這種情況下，它會選擇首先驅逐最低優先順序的 Pod。

<!--  
When the kubelet evicts pods in response to `inode` or `PID` starvation, it uses
the Priority to determine the eviction order, because `inodes` and `PIDs` have no
requests.

The kubelet sorts pods differently based on whether the node has a dedicated
`imagefs` filesystem:
-->
當 kubelet 因 inode 或 PID 不足而驅逐 pod 時，
它使用優先順序來確定驅逐順序，因為 inode 和 PID 沒有請求。

kubelet 根據節點是否具有專用的 `imagefs` 檔案系統對 Pod 進行不同的排序：

<!-- 
#### With `imagefs`

If `nodefs` is triggering evictions, the kubelet sorts pods based on `nodefs`
usage (`local volumes + logs of all containers`).

If `imagefs` is triggering evictions, the kubelet sorts pods based on the
writable layer usage of all containers.

#### Without `imagefs`

If `nodefs` is triggering evictions, the kubelet sorts pods based on their total
disk usage (`local volumes + logs & writable layer of all containers`)
-->
#### 有 `imagefs`

如果 `nodefs` 觸發驅逐，
kubelet 會根據 `nodefs` 使用情況（`本地卷 + 所有容器的日誌`）對 Pod 進行排序。

如果 `imagefs` 觸發驅逐，kubelet 會根據所有容器的可寫層使用情況對 Pod 進行排序。

#### 沒有 `imagefs`

如果 `nodefs` 觸發驅逐，
kubelet 會根據磁碟總用量（`本地卷 + 日誌和所有容器的可寫層`）對 Pod 進行排序。

<!-- 
### Minimum eviction reclaim

In some cases, pod eviction only reclaims a small amount of the starved resource.
This can lead to the kubelet repeatedly hitting the configured eviction thresholds
and triggering multiple evictions. 
-->
### 最小驅逐回收  {#minimum-eviction-reclaim}

在某些情況下，驅逐 Pod 只會回收少量的緊俏資源。
這可能導致 kubelet 反覆達到配置的驅逐條件並觸發多次驅逐。

<!-- 
You can use the `--eviction-minimum-reclaim` flag or a [kubelet config file](/docs/tasks/administer-cluster/kubelet-config-file/)
to configure a minimum reclaim amount for each resource. When the kubelet notices
that a resource is starved, it continues to reclaim that resource until it
reclaims the quantity you specify. 

For example, the following configuration sets minimum reclaim amounts: 
-->
你可以使用 `--eviction-minimum-reclaim` 標誌或
[kubelet 配置檔案](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)
為每個資源配置最小回收量。
當 kubelet 注意到某個資源耗盡時，它會繼續回收該資源，直到回收到你所指定的數量為止。

例如，以下配置設定最小回收量：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
evictionHard:
  memory.available: "500Mi"
  nodefs.available: "1Gi"
  imagefs.available: "100Gi"
evictionMinimumReclaim:
  memory.available: "0Mi"
  nodefs.available: "500Mi"
  imagefs.available: "2Gi"
```

<!-- 
In this example, if the `nodefs.available` signal meets the eviction threshold,
the kubelet reclaims the resource until the signal reaches the threshold of `1Gi`,
and then continues to reclaim the minimum amount of `500Mi` it until the signal
reaches `1.5Gi`. 

Similarly, the kubelet reclaims the `imagefs` resource until the `imagefs.available`
signal reaches `102Gi`. 

The default `eviction-minimum-reclaim` is `0` for all resources.
-->
在這個例子中，如果 `nodefs.available` 訊號滿足驅逐條件，
kubelet 會回收資源，直到訊號達到 `1Gi` 的條件，
然後繼續回收至少 `500Mi` 直到訊號達到 `1.5Gi`。

類似地，kubelet 會回收 `imagefs` 資源，直到 `imagefs.available` 訊號達到 `102Gi`。

對於所有資源，預設的 `eviction-minimum-reclaim` 為 `0`。

<!-- 
### Node out of memory behavior

If the node experiences an out of memory (OOM) event prior to the kubelet
being able to reclaim memory, the node depends on the [oom_killer](https://lwn.net/Articles/391222/)
to respond.

The kubelet sets an `oom_score_adj` value for each container based on the QoS for the pod.
-->
### 節點記憶體不足行為

如果節點在 kubelet 能夠回收記憶體之前遇到記憶體不足（OOM）事件，
則節點依賴 [oom_killer](https://lwn.net/Articles/391222/) 來響應。

kubelet 根據 Pod 的服務質量（QoS）為每個容器設定一個 `oom_score_adj` 值。

| 服務質量            | oom_score_adj                                                                     |
|--------------------|-----------------------------------------------------------------------------------|
| `Guaranteed`       | -997                                                                              |
| `BestEffort`       | 1000                                                                              |
| `Burstable`        | min(max(2, 1000 - (1000 * memoryRequestBytes) / machineMemoryCapacityBytes), 999) |

{{<note>}}
<!-- 
The kubelet also sets an `oom_score_adj` value of `-997` for containers in Pods that have
`system-node-critical` {{<glossary_tooltip text="Priority" term_id="pod-priority">}}
-->
kubelet 還將具有 `system-node-critical`
{{<glossary_tooltip text="優先順序" term_id="pod-priority">}}
的 Pod 中的容器 `oom_score_adj` 值設為 `-997`。
{{</note>}}

<!-- 
If the kubelet can't reclaim memory before a node experiences OOM, the
`oom_killer` calculates an `oom_score` based on the percentage of memory it's
using on the node, and then adds the `oom_score_adj` to get an effective `oom_score`
for each container. It then kills the container with the highest score.

This means that containers in low QoS pods that consume a large amount of memory
relative to their scheduling requests are killed first.

Unlike pod eviction, if a container is OOM killed, the `kubelet` can restart it 
based on its `RestartPolicy`.
-->
如果 kubelet 在節點遇到 OOM 之前無法回收記憶體，
則 `oom_killer` 根據它在節點上使用的記憶體百分比計算 `oom_score`，
然後加上 `oom_score_adj` 得到每個容器有效的 `oom_score`。
然後它會殺死得分最高的容器。

這意味著低 QoS Pod 中相對於其排程請求消耗記憶體較多的容器，將首先被殺死。

與 Pod 驅逐不同，如果容器被 OOM 殺死，
`kubelet` 可以根據其 `RestartPolicy` 重新啟動它。

<!-- 
### Best practices {#node-pressure-eviction-good-practices}

The following sections describe best practices for eviction configuration.
-->
### 最佳實踐 {#node-pressure-eviction-good-practices}

以下部分描述了驅逐配置的最佳實踐。

<!-- 
#### Schedulable resources and eviction policies

When you configure the kubelet with an eviction policy, you should make sure that
the scheduler will not schedule pods if they will trigger eviction because they
immediately induce memory pressure.
-->
#### 可排程的資源和驅逐策略

當你為 kubelet 配置驅逐策略時，
你應該確保排程程式不會在 Pod 觸發驅逐時對其進行排程，因為這類 Pod 會立即引起記憶體壓力。

<!-- 
Consider the following scenario:

* Node memory capacity: `10Gi`
* Operator wants to reserve 10% of memory capacity for system daemons (kernel, `kubelet`, etc.)
* Operator wants to evict Pods at 95% memory utilization to reduce incidence of system OOM.
-->
考慮以下場景：

* 節點記憶體容量：`10Gi`
* 操作員希望為系統守護程序（核心、`kubelet` 等）保留 10% 的記憶體容量
* 操作員希望驅逐記憶體利用率為 95% 的Pod，以減少系統 OOM 的機率。

<!-- 
For this to work, the kubelet is launched as follows:
-->
為此，kubelet 啟動設定如下：

```
--eviction-hard=memory.available<500Mi
--system-reserved=memory=1.5Gi
```

<!-- 
In this configuration, the `--system-reserved` flag reserves `1.5Gi` of memory
for the system, which is `10% of the total memory + the eviction threshold amount`. 

The node can reach the eviction threshold if a pod is using more than its request,
or if the system is using more than `1Gi` of memory, which makes the `memory.available`
signal fall below `500Mi` and triggers the threshold. 
-->
在此配置中，`--system-reserved` 標誌為系統預留了 `1.5Gi` 的記憶體，
即 `總記憶體的 10% + 驅逐條件量`。

如果 Pod 使用的記憶體超過其請求值或者系統使用的記憶體超過 `1Gi`，
則節點可以達到驅逐條件，這使得 `memory.available` 訊號低於 `500Mi` 並觸發條件。

<!-- 
#### DaemonSet

Pod Priority is a major factor in making eviction decisions. If you do not want
the kubelet to evict pods that belong to a `DaemonSet`, give those pods a high
enough `priorityClass` in the pod spec. You can also use a lower `priorityClass`
or the default to only allow `DaemonSet` pods to run when there are enough 
resources.
-->
### DaemonSet

Pod 優先順序是做出驅逐決定的主要因素。
如果你不希望 kubelet 驅逐屬於 `DaemonSet` 的 Pod，
請在 Pod 規約中為這些 Pod 提供足夠高的 `priorityClass`。
你還可以使用優先順序較低的 `priorityClass` 或預設配置，
僅在有足夠資源時才執行 `DaemonSet` Pod。

<!-- 
### Known issues

The following sections describe known issues related to out of resource handling.
-->
### 已知問題

以下部分描述了與資源不足處理相關的已知問題。

<!-- 
#### kubelet may not observe memory pressure right away

By default, the kubelet polls `cAdvisor` to collect memory usage stats at a
regular interval. If memory usage increases within that window rapidly, the
kubelet may not observe `MemoryPressure` fast enough, and the `OOMKiller`
will still be invoked. 
-->
#### kubelet 可能不會立即觀察到記憶體壓力

預設情況下，kubelet 輪詢 `cAdvisor` 以定期收集記憶體使用情況統計資訊。
如果該輪詢時間視窗內記憶體使用量迅速增加，kubelet 可能無法足夠快地觀察到 `MemoryPressure`，
但是 `OOMKiller` 仍將被呼叫。

<!-- 
You can use the `--kernel-memcg-notification` flag to enable the `memcg`
notification API on the kubelet to get notified immediately when a threshold
is crossed.

If you are not trying to achieve extreme utilization, but a sensible measure of
overcommit, a viable workaround for this issue is to use the `--kube-reserved`
and `--system-reserved` flags to allocate memory for the system. 
-->
你可以使用 `--kernel-memcg-notification`
標誌在 kubelet 上啟用 `memcg` 通知 API，以便在超過條件時立即收到通知。

如果你不是追求極端利用率，而是要採取合理的過量使用措施，
則解決此問題的可行方法是使用 `--kube-reserved` 和 `--system-reserved` 標誌為系統分配記憶體。

<!-- 
#### active_file memory is not considered as available memory

On Linux, the kernel tracks the number of bytes of file-backed memory on active 
LRU list as the `active_file` statistic. The kubelet treats `active_file` memory
areas as not reclaimable. For workloads that make intensive use of block-backed 
local storage, including ephemeral local storage, kernel-level caches of file 
and block data means that many recently accessed cache pages are likely to be 
counted as `active_file`. If enough of these kernel block buffers are on the 
active LRU list, the kubelet is liable to observe this as high resource use and 
taint the node as experiencing memory pressure - triggering pod eviction.
-->
#### active_file 記憶體未被視為可用記憶體

在 Linux 上，核心跟蹤活動 LRU 列表上的基於檔案所虛擬的記憶體位元組數作為 `active_file` 統計資訊。
kubelet 將 `active_file` 記憶體區域視為不可回收。
對於大量使用塊裝置形式的本地儲存（包括臨時本地儲存）的工作負載，
檔案和塊資料的核心級快取意味著許多最近訪問的快取頁面可能被計為 `active_file`。
如果這些核心塊緩衝區中在活動 LRU 列表上有足夠多，
kubelet 很容易將其視為資源用量過量併為節點設定記憶體壓力汙點，從而觸發 Pod 驅逐。

<!-- 
For more more details, see [https://github.com/kubernetes/kubernetes/issues/43916](https://github.com/kubernetes/kubernetes/issues/43916)

You can work around that behavior by setting the memory limit and memory request
the same for containers likely to perform intensive I/O activity. You will need 
to estimate or measure an optimal memory limit value for that container.
-->
更多細節請參見 [https://github.com/kubernetes/kubernetes/issues/43916](https://github.com/kubernetes/kubernetes/issues/43916)

你可以透過為可能執行 I/O 密集型活動的容器設定相同的記憶體限制和記憶體請求來應對該行為。
你將需要估計或測量該容器的最佳記憶體限制值。

## {{% heading "whatsnext" %}}

<!-- 
* Learn about [API-initiated Eviction](/docs/reference/generated/kubernetes-api/v1.23/)
* Learn about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* Learn about [PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/)
* Learn about [Quality of Service](/docs/tasks/configure-pod-container/quality-service-pod/) (QoS)
* Check out the [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
-->
* 瞭解 [API 發起的驅逐](/docs/reference/generated/kubernetes-api/v1.23/)
* 瞭解 [Pod 優先順序和驅逐](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* 瞭解 [PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/)
* 瞭解[服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)（QoS）
* 檢視[驅逐 API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
