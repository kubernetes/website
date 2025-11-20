---
title: 節點壓力驅逐
content_type: concept
weight: 100
---
<!--
title: Node-pressure Eviction
content_type: concept
weight: 100
-->

{{<glossary_definition term_id="node-pressure-eviction" length="short">}}</br>

<!--
The {{<glossary_tooltip term_id="kubelet" text="kubelet">}} monitors resources
like memory, disk space, and filesystem inodes on your cluster's nodes.
When one or more of these resources reach specific consumption levels, the
kubelet can proactively fail one or more pods on the node to reclaim resources
and prevent starvation.
-->
{{<glossary_tooltip term_id="kubelet" text="kubelet">}}
監控叢集節點的內存、磁盤空間和檔案系統的 inode 等資源。
當這些資源中的一個或者多個達到特定的消耗水平，
kubelet 可以主動地使節點上一個或者多個 Pod 失效，以回收資源防止飢餓。

<!--
During a node-pressure eviction, the kubelet sets the [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) for the
selected pods to `Failed`, and terminates the Pod.

Node-pressure eviction is not the same as
[API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/).
-->
在節點壓力驅逐期間，kubelet 將所選 Pod
的[階段](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)設置爲
`Failed` 並終止 Pod。

節點壓力驅逐不同於 [API 發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)。

<!--
The kubelet does not respect your configured {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}
or the pod's
`terminationGracePeriodSeconds`. If you use [soft eviction thresholds](#soft-eviction-thresholds),
the kubelet respects your configured `eviction-max-pod-grace-period`. If you use
[hard eviction thresholds](#hard-eviction-thresholds), the kubelet uses a `0s` grace period (immediate shutdown) for termination.
-->
kubelet 並不理會你設定的 {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}
或者是 Pod 的 `terminationGracePeriodSeconds`。
如果你使用了[軟驅逐條件](#soft-eviction-thresholds)，kubelet 會考慮你所設定的
`eviction-max-pod-grace-period`。
如果你使用了[硬驅逐條件](#hard-eviction-thresholds)，kubelet 使用 `0s`
寬限期（立即關閉）來終止 Pod。

<!--
## Self healing behavior

The kubelet attempts to [reclaim node-level resources](#reclaim-node-resources)
before it terminates end-user pods. For example, it removes unused container
images when disk resources are starved.
-->
## 自我修復行爲   {#self-healing-behavior}

kubelet 在終止最終使用者 Pod 之前會嘗試[回收節點級資源](#reclaim-node-resources)。
例如，它會在磁盤資源不足時刪除未使用的容器映像檔。

<!--
If the pods are managed by a {{< glossary_tooltip text="workload" term_id="workload" >}}
resource (such as {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
or {{< glossary_tooltip text="Deployment" term_id="deployment" >}}) that
replaces failed pods, the control plane or `kube-controller-manager` creates new
pods in place of the evicted pods.
-->
如果 Pod 是由替換失敗 Pod 的{{< glossary_tooltip text="工作負載" term_id="workload" >}}資源
（例如 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
或者 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}）管理，
則控制平面或 `kube-controller-manager` 會創建新的 Pod 來代替被驅逐的 Pod。

<!--
### Self healing for static pods
-->
### 靜態 Pod 的自我修復   {#self-healing-for-static-pods}

<!--
If you are running a [static pod](/docs/concepts/workloads/pods/#static-pods)
on a node that is under resource pressure, the kubelet may evict that static
Pod. The kubelet then tries to create a replacement, because static Pods always
represent an intent to run a Pod on that node.
-->
如果你在面臨資源壓力的節點上運行靜態 Pod，則 kubelet 可能會驅逐該靜態 Pod。
由於靜態 Pod 始終表示在該節點上運行 Pod 的意圖，kubelet 會嘗試創建替代 Pod。

<!--
The kubelet takes the _priority_ of the static pod into account when creating
a replacement. If the static pod manifest specifies a low priority, and there
are higher-priority Pods defined within the cluster's control plane, and the
node is under resource pressure, the kubelet may not be able to make room for
that static pod. The kubelet continues to attempt to run all static pods even
when there is resource pressure on a node.
-->
創建替代 Pod 時，kubelet 會考慮靜態 Pod 的優先級。如果靜態 Pod 清單指定了低優先級，
並且叢集的控制平面內定義了優先級更高的 Pod，並且節點面臨資源壓力，則 kubelet
可能無法爲該靜態 Pod 騰出空間。
即使節點上存在資源壓力，kubelet 也會繼續嘗試運行所有靜態 Pod。

<!--
## Eviction signals and thresholds

The kubelet uses various parameters to make eviction decisions, like the following:

- Eviction signals
- Eviction thresholds
- Monitoring intervals
-->
## 驅逐信號和閾值  {#eviction-signals-and-thresholds}

kubelet 使用各種參數來做出驅逐決定，如下所示：

- 驅逐信號
- 驅逐條件
- 監控間隔

<!--
### Eviction signals {#eviction-signals}

Eviction signals are the current state of a particular resource at a specific
point in time. The kubelet uses eviction signals to make eviction decisions by
comparing the signals to eviction thresholds, which are the minimum amount of
the resource that should be available on the node.

The kubelet uses the following eviction signals:
-->
### 驅逐信號 {#eviction-signals}

驅逐信號是特定資源在特定時間點的當前狀態。
kubelet 使用驅逐信號，通過將信號與驅逐條件進行比較來做出驅逐決定，
驅逐條件是節點上應該可用資源的最小量。

kubelet 使用以下驅逐信號：

<!--
| Eviction Signal          | Description                                                                           | Linux Only |
|--------------------------|---------------------------------------------------------------------------------------|------------|
| `memory.available`       | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |            |
| `nodefs.available`       | `nodefs.available` := `node.stats.fs.available`                                       |            |
| `nodefs.inodesFree`      | `nodefs.inodesFree` := `node.stats.fs.inodesFree`                                     |      •     |
| `imagefs.available`      | `imagefs.available` := `node.stats.runtime.imagefs.available`                         |            |
| `imagefs.inodesFree`     | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree`                       |      •     |
| `containerfs.available`  | `containerfs.available` := `node.stats.runtime.containerfs.available`                 |            |
| `containerfs.inodesFree` | `containerfs.inodesFree` := `node.stats.runtime.containerfs.inodesFree`               |      •     |
| `pid.available`          | `pid.available` := `node.stats.rlimit.maxpid` - `node.stats.rlimit.curproc`           |      •     |
-->
| 驅逐信號                  | 描述                                                                                  | 僅限於 Linux |
|--------------------------|---------------------------------------------------------------------------------------|------------|
| `memory.available`       | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |            |
| `nodefs.available`       | `nodefs.available` := `node.stats.fs.available`                                       |            |
| `nodefs.inodesFree`      | `nodefs.inodesFree` := `node.stats.fs.inodesFree`                                     |      •     |
| `imagefs.available`      | `imagefs.available` := `node.stats.runtime.imagefs.available`                         |            |
| `imagefs.inodesFree`     | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree`                       |      •     |
| `containerfs.available`  | `containerfs.available` := `node.stats.runtime.containerfs.available`                 |            |
| `containerfs.inodesFree` | `containerfs.inodesFree` := `node.stats.runtime.containerfs.inodesFree`               |      •     |
| `pid.available`          | `pid.available` := `node.stats.rlimit.maxpid` - `node.stats.rlimit.curproc`           |      •     |

<!--
In this table, the **Description** column shows how kubelet gets the value of the
signal. Each signal supports either a percentage or a literal value. The Kubelet
calculates the percentage value relative to the total capacity associated with
the signal.
-->
在上表中，**描述**列顯示了 kubelet 如何獲取信號的值。每個信號支持百分比值或者是字面值。
kubelet 計算相對於與信號有關的總量的百分比值。

<!--
#### Memory signals

On Linux nodes, the value for `memory.available` is derived from the cgroupfs instead of tools
like `free -m`. This is important because `free -m` does not work in a
container, and if users use the [node allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
feature, out of resource decisions
are made local to the end user Pod part of the cgroup hierarchy as well as the
root node. This [script](/examples/admin/resource/memory-available.sh) or
[cgroupv2 script](/examples/admin/resource/memory-available-cgroupv2.sh)
reproduces the same set of steps that the kubelet performs to calculate
`memory.available`. The kubelet excludes inactive_file (the number of bytes of
file-backed memory on inactive LRU list) from its calculation as it assumes that
memory is reclaimable under pressure.
-->
#### 內存信號 {#memory-signals}

在 Linux 節點上，`memory.available` 的值來自 CGroupFs，而不是像 `free -m` 這樣的工具。
這很重要，因爲 `free -m` 在容器中不起作用，
如果使用者使用[節點可分配資源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)這一功能特性，
資源不足的判定是基於 CGroup 層次結構中的使用者 Pod 所處的局部及 CGroup 根節點作出的。
這個[腳本](/zh-cn/examples/admin/resource/memory-available.sh)或者
[CGroupv2 腳本](/zh-cn/examples/admin/resource/memory-available-cgroupv2.sh)重現了
kubelet 爲計算 `memory.available` 而執行的相同步驟。
kubelet 在其計算中排除了 inactive_file（非活動 LRU 列表上基於檔案來虛擬的內存的字節數），
因爲它假定在壓力下內存是可回收的。

<!--
On Windows nodes, the value for `memory.available` is derived from the node's global
memory commit levels (queried through the [`GetPerformanceInfo()`](https://learn.microsoft.com/windows/win32/api/psapi/nf-psapi-getperformanceinfo)
system call) by subtracting the node's global [`CommitTotal`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information) from the node's [`CommitLimit`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information). Please note that `CommitLimit` can change if the node's page-file size changes!
-->
在 Windows 節點上，`memory.available` 的值來自節點的全局內存提交級別
（通過 [`GetPerformanceInfo()`](https://learn.microsoft.com/windows/win32/api/psapi/nf-psapi-getperformanceinfo)
系統調用查詢），方法是從節點的
[`CommitLimit`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information)
減去節點的全局 [`CommitTotal`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information)。
請注意，如果節點的頁面檔案大小發生變化，`CommitLimit` 也會發生變化！

<!--
#### Filesystem signals

The kubelet recognizes three specific filesystem identifiers that can be used with
eviction signals (`<identifier>.inodesFree` or `<identifier>.available`):

1. `nodefs`: The node's main filesystem, used for local disk volumes,
    emptyDir volumes not backed by memory, log storage, ephemeral storage,
    and more. For example, `nodefs` contains `/var/lib/kubelet`.
-->
#### 檔案系統信號 {#filesystem-signals}

kubelet 可識別三個可與驅逐信號一起使用的特定檔案系統標識符（`<identifier>.inodesFree` 或
`<identifier>.available`）：

1. `nodefs`：節點的主檔案系統，用於本地磁盤卷、
   非內存介質的 `emptyDir` 卷、日誌儲存、臨時儲存等。
   例如，`nodefs` 包含 `/var/lib/kubelet`。

<!--
1. `imagefs`: An optional filesystem that container runtimes can use to store
   container images (which are the read-only layers) and container writable
   layers.

1. `containerfs`: An optional filesystem that container runtime can use to
   store the writeable layers. Similar to the main filesystem (see `nodefs`),
   it's used to store local disk volumes, emptyDir volumes not backed by memory,
   log storage, and ephemeral storage, except for the container images. When
   `containerfs` is used, the `imagefs` filesystem can be split to only store
   images (read-only layers) and nothing else.
-->
2. `imagefs`：可供容器運行時儲存容器映像檔（只讀層）和容器可寫層的可選檔案系統。

3. `containerfs`：可供容器運行時儲存可寫層的可選檔案系統。
   與主檔案系統（參見 `nodefs`）類似，
   它用於儲存本地磁盤卷、非內存介質的 `emptyDir` 卷、
   日誌儲存和臨時儲存，但容器映像檔除外。
   當使用 `containerfs` 時，`imagefs` 檔案系統可以分割爲僅儲存映像檔（只讀層）而不儲存其他任何內容。

{{<note>}}
<!--
{{< feature-state feature_gate_name="KubeletSeparateDiskGC" >}}
The _split image filesystem_ feature, which enables support for the `containerfs`
filesystem, adds several new eviction signals, thresholds and metrics. To use
`containerfs`, the Kubernetes release v{{< skew currentVersion >}} requires the
`KubeletSeparateDiskGC` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to be enabled. Currently, only CRI-O (v1.29 or higher) offers the `containerfs`
filesystem support.
-->
{{< feature-state feature_gate_name="KubeletSeparateDiskGC" >}}
**拆分映像檔檔案系統** 功能支持 `containerfs` 檔案系統，並增加了幾個新的驅逐信號、閾值和指標。
要使用 `containerfs`，Kubernetes 版本 v{{< skew currentVersion >}} 需要啓用 `KubeletSeparateDiskGC`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
目前，只有 CRI-O（v1.29 或更高版本）提供對 `containerfs` 檔案系統的支持。
{{</note>}}

<!--
As such, kubelet generally allows three options for container filesystems:

- Everything is on the single `nodefs`, also referred to as "rootfs" or
  simply "root", and there is no dedicated image filesystem.

- Container storage (see `nodefs`) is on a dedicated disk, and `imagefs`
  (writable and read-only layers) is separate from the root filesystem.
  This is often referred to as "split disk" (or "separate disk") filesystem.

- Container filesystem `containerfs` (same as `nodefs` plus writable
  layers) is on root and the container images (read-only layers) are
  stored on separate `imagefs`. This is often referred to as "split image"
  filesystem.
-->
因此，kubelet 通常允許三種容器檔案系統選項：

- 所有內容都位於單個 `nodefs` 上，也稱爲 `rootfs` 或簡稱爲 `root`，
  並且沒有專用映像檔檔案系統。

- 容器儲存（參見 `nodefs`）位於專用磁盤上，
  而 `imagefs`（可寫和只讀層）與根檔案系統分開。
  這通常稱爲“分割磁盤”（或“單獨磁盤”）檔案系統。

- 容器檔案系統 `containerfs`（與 `nodefs` 加上可寫層相同）位於根檔案系統上，
  容器映像檔（只讀層）儲存在單獨的 `imagefs` 上。這通常稱爲“分割映像檔”檔案系統。

<!--
The kubelet will attempt to auto-discover these filesystems with their current
configuration directly from the underlying container runtime and will ignore
other local node filesystems.

The kubelet does not support other container filesystems or storage configurations,
and it does not currently support multiple filesystems for images and containers.
-->
kubelet 將嘗試直接從底層容器運行時自動發現這些檔案系統及其當前設定，並忽略其他本地節點檔案系統。

kubelet 不支持其他容器檔案系統或儲存設定，並且目前不支持爲映像檔和容器提供多個檔案系統。

<!--
### Deprecated kubelet garbage collection features

Some kubelet garbage collection features are deprecated in favor of eviction:

| Existing Flag | Rationale |
| ------------- | --------- |
| `--maximum-dead-containers` | deprecated once old logs are stored outside of container's context |
| `--maximum-dead-containers-per-container` | deprecated once old logs are stored outside of container's context |
| `--minimum-container-ttl-duration` | deprecated once old logs are stored outside of container's context |
-->
### 棄用的 kubelet 垃圾收集功能 {#deprecated-kubelet-garbage-collection-features}

一些 kubelet 垃圾收集功能已被棄用，以鼓勵使用驅逐機制。

| 現有標誌                                   | 原因                                  |
| ----------------------------------------- | ------------------------------------ |
| `--maximum-dead-containers`               | 一旦舊的日誌儲存在容器的上下文之外就會被棄用 |
| `--maximum-dead-containers-per-container` | 一旦舊的日誌儲存在容器的上下文之外就會被棄用 |
| `--minimum-container-ttl-duration`        | 一旦舊的日誌儲存在容器的上下文之外就會被棄用 |

<!--
### Eviction thresholds

You can specify custom eviction thresholds for the kubelet to use when it makes
eviction decisions. You can configure [soft](#soft-eviction-thresholds) and
[hard](#hard-eviction-thresholds) eviction thresholds.

Eviction thresholds have the form `[eviction-signal][operator][quantity]`, where:

- `eviction-signal` is the [eviction signal](#eviction-signals) to use.
- `operator` is the [relational operator](https://en.wikipedia.org/wiki/Relational_operator#Standard_relational_operators)
  you want, such as `<` (less than).
- `quantity` is the eviction threshold amount, such as `1Gi`. The value of `quantity`
  must match the quantity representation used by Kubernetes. You can use either
  literal values or percentages (`%`).
-->
### 驅逐條件 {#eviction-thresholds}

你可以爲 kubelet 指定自定義驅逐條件，以便在作出驅逐決定時使用。
你可以設置[軟性的](#soft-eviction-thresholds)和[硬性的](#hard-eviction-thresholds)驅逐閾值。

驅逐條件的形式爲 `[eviction-signal][operator][quantity]`，其中：

- `eviction-signal` 是要使用的[驅逐信號](#eviction-signals)。
- `operator` 是你想要的[關係運算符](https://en.wikipedia.org/wiki/Relational_operator#Standard_relational_operators)，
  比如 `<`（小於）。
- `quantity` 是驅逐條件數量，例如 `1Gi`。
  `quantity` 的值必須與 Kubernetes 使用的數量表示相匹配。
  你可以使用文字值或百分比（`%`）。

<!--
For example, if a node has 10GiB of total memory and you want trigger eviction if
the available memory falls below 1GiB, you can define the eviction threshold as
either `memory.available<10%` or `memory.available<1Gi` (you cannot use both).

You can configure soft and hard eviction thresholds.
-->
例如，如果一個節點的總內存爲 10GiB 並且你希望在可用內存低於 1GiB 時觸發驅逐，
則可以將驅逐條件定義爲 `memory.available<10%` 或
`memory.available<1Gi`（你不能同時使用二者）。

你可以設定軟和硬驅逐條件。

<!--
#### Soft eviction thresholds {#soft-eviction-thresholds}

A soft eviction threshold pairs an eviction threshold with a required
administrator-specified grace period. The kubelet does not evict pods until the
grace period is exceeded. The kubelet returns an error on startup if you do
not specify a grace period.
-->
#### 軟驅逐條件 {#soft-eviction-thresholds}

軟驅逐條件將驅逐條件與管理員所必須指定的寬限期配對。
在超過寬限期之前，kubelet 不會驅逐 Pod。
如果沒有指定的寬限期，kubelet 會在啓動時返回錯誤。

<!--
You can specify both a soft eviction threshold grace period and a maximum
allowed pod termination grace period for kubelet to use during evictions. If you
specify a maximum allowed grace period and the soft eviction threshold is met,
the kubelet uses the lesser of the two grace periods. If you do not specify a
maximum allowed grace period, the kubelet kills evicted pods immediately without
graceful termination.
-->
你可以既指定軟驅逐條件寬限期，又指定 Pod 終止寬限期的上限，給 kubelet 在驅逐期間使用。
如果你指定了寬限期的上限並且 Pod 滿足軟驅逐閾條件，則 kubelet 將使用兩個寬限期中的較小者。
如果你沒有指定寬限期上限，kubelet 會立即殺死被驅逐的 Pod，不允許其體面終止。

<!--
You can use the following flags to configure soft eviction thresholds:

- `eviction-soft`: A set of eviction thresholds like `memory.available<1.5Gi`
  that can trigger pod eviction if held over the specified grace period.
- `eviction-soft-grace-period`: A set of eviction grace periods like `memory.available=1m30s`
  that define how long a soft eviction threshold must hold before triggering a Pod eviction.
- `eviction-max-pod-grace-period`: The maximum allowed grace period (in seconds)
  to use when terminating pods in response to a soft eviction threshold being met.
-->
你可以使用以下標誌來設定軟驅逐條件：

- `eviction-soft`：一組驅逐條件，如 `memory.available<1.5Gi`，
  如果驅逐條件持續時長超過指定的寬限期，可以觸發 Pod 驅逐。
- `eviction-soft-grace-period`：一組驅逐寬限期，
  如 `memory.available=1m30s`，定義軟驅逐條件在觸發 Pod 驅逐之前必須保持多長時間。
- `eviction-max-pod-grace-period`：在滿足軟驅逐條件而終止 Pod 時使用的最大允許寬限期（以秒爲單位）。

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
kubelet 會立即殺死 Pod，而不會正常終止以回收緊缺的資源。

你可以使用 `eviction-hard` 標誌來設定一組硬驅逐條件，
例如 `memory.available<1Gi`。

<!--
The kubelet has the following default hard eviction thresholds:

- `memory.available<100Mi` (Linux nodes)
- `memory.available<500Mi` (Windows nodes)
- `nodefs.available<10%`
- `imagefs.available<15%`
- `nodefs.inodesFree<5%` (Linux nodes)
- `imagefs.inodesFree<5%` (Linux nodes)
-->
kubelet 具有以下預設硬驅逐條件：

- `memory.available<100Mi`（Linux 節點）
- `nodefs.available<10%`（Windows 節點）
- `imagefs.available<15%`
- `nodefs.inodesFree<5%`（Linux 節點）
- `imagefs.inodesFree<5%` (Linux 節點)

<!--
These default values of hard eviction thresholds will only be set if none
of the parameters is changed. If you change the value of any parameter,
then the values of other parameters will not be inherited as the default
values and will be set to zero. In order to provide custom values, you
should provide all the thresholds respectively. You can also set the kubelet config
MergeDefaultEvictionSettings to true in the kubelet configuration file.
If set to true and any paramater is changed, then the other parameters will
inherit their default values instead of 0.
-->
只有在沒有更改任何參數的情況下，硬驅逐閾值纔會被設置成這些預設值。
如果你更改了任何參數的值，則其他參數的取值不會繼承其預設值設置，而將被設置爲零。
爲了提供自定義值，你應該分別設置所有閾值。
你也可以在 kubelet 設定檔案中設置 `mergeDefaultEvictionSettings` 爲 `true`。
如果該值設爲 `true`，並且某個參數被修改，則其他參數將繼承其預設值，而不是被設爲 0。

<!--
The `containerfs.available` and `containerfs.inodesFree` (Linux nodes) default
eviction thresholds will be set as follows:

- If a single filesystem is used for everything, then `containerfs` thresholds
  are set the same as `nodefs`.

- If separate filesystems are configured for both images and containers,
  then `containerfs` thresholds are set the same as `imagefs`.

Setting custom overrides for thresholds related to `containersfs` is currently
not supported, and a warning will be issued if an attempt to do so is made; any
provided custom values will, as such, be ignored.
-->
`containerfs.available` 和 `containerfs.inodesFree`（Linux 節點）預設驅逐閾值將被設置如下：

- 如果所有資料都使用同一檔案系統，則 `containerfs` 閾值將設置爲與 `nodefs` 相同。

- 如果爲映像檔和容器設定了單獨的檔案系統，則 `containerfs` 閾值將設置爲與 `imagefs` 相同。

目前不支持爲與 `containersfs` 相關的閾值設置自定義覆蓋，如果嘗試這樣做，將發出警告；
因此，所提供的所有自定義值都將被忽略。

<!--
## Eviction monitoring interval

The kubelet evaluates eviction thresholds based on its configured `housekeeping-interval`,
which defaults to `10s`.
-->
## 驅逐監測間隔   {#eviction-monitoring-interval}

kubelet 根據其設定的 `housekeeping-interval`（預設爲 `10s`）評估驅逐條件。

<!--
## Node conditions {#node-conditions}

The kubelet reports [node conditions](/docs/concepts/architecture/nodes/#condition)
to reflect that the node is under pressure because hard or soft eviction
threshold is met, independent of configured grace periods.
-->
## 節點狀況 {#node-conditions}

kubelet 報告[節點狀況](/zh-cn/docs/concepts/architecture/nodes/#condition)以反映節點處於壓力之下，
原因是滿足硬性的或軟性的驅逐條件，與設定的寬限期無關。

<!--
The kubelet maps eviction signals to node conditions as follows:

| Node Condition    | Eviction Signal                                                                       | Description                                                                                |
|-------------------|---------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `MemoryPressure`  | `memory.available`                                                                    | Available memory on the node has satisfied an eviction threshold                           |
| `DiskPressure`    | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, `imagefs.inodesFree`, `containerfs.available`, or `containerfs.inodesFree` | Available disk space and inodes on either the node's root filesystem, image filesystem, or container filesystem has satisfied an eviction threshold              |
| `PIDPressure`     | `pid.available`                                                                       | Available processes identifiers on the (Linux) node has fallen below an eviction threshold |
-->
kubelet 根據下表將驅逐信號映射爲節點狀況：

| 節點狀況 | 驅逐信號 | 描述 |
|---------|--------|------|
| `MemoryPressure` | `memory.available` | 節點上的可用內存已滿足驅逐條件 |
| `DiskPressure`   | `nodefs.available`、`nodefs.inodesFree`、`imagefs.available`、`imagefs.inodesFree`、`containerfs.available` 或 `containerfs.inodesFree` | 節點的根檔案系統、映像檔檔案系統或容器檔案系統上的可用磁盤空間和 inode 已滿足驅逐閾值 |
| `PIDPressure`    | `pid.available` | （Linux）節點上的可用進程標識符已低於驅逐條件 |

<!--
The control plane also [maps](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)
these node conditions to taints.

The kubelet updates the node conditions based on the configured
`--node-status-update-frequency`, which defaults to `10s`.
-->
控制平面還將這些節點狀況[映射](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)爲其污點。

kubelet 根據設定的 `--node-status-update-frequency` 更新節點狀況，預設爲 `10s`。

<!--
### Node condition oscillation

In some cases, nodes oscillate above and below soft eviction thresholds without
holding for the defined grace periods. This causes the reported node condition
to constantly switch between `true` and `false`, leading to bad eviction decisions.

To protect against oscillation, you can use the `eviction-pressure-transition-period`
flag, which controls how long the kubelet must wait before transitioning a node
condition to a different state. The transition period has a default value of `5m`.
-->
### 節點狀況波動   {#node-condition-oscillation}

在某些情況下，節點在軟驅逐條件上下振盪，而沒有保持定義的寬限期。
這會導致報告的節點狀況在 `true` 和 `false` 之間不斷切換，從而導致錯誤的驅逐決策。

爲了防止振盪，你可以使用 `eviction-pressure-transition-period` 標誌，
該標誌控制 kubelet 在將節點狀況轉換爲不同狀態之前必須等待的時間。
過渡期的預設值爲 `5m`。

<!--
### Reclaiming node level resources {#reclaim-node-resources}

The kubelet tries to reclaim node-level resources before it evicts end-user pods.

When a `DiskPressure` node condition is reported, the kubelet reclaims node-level
resources based on the filesystems on the node.
-->
### 回收節點級資源 {#reclaim-node-resources}

kubelet 在驅逐最終使用者 Pod 之前會先嚐試回收節點級資源。

當報告 `DiskPressure` 節點狀況時，kubelet 會根據節點上的檔案系統回收節點級資源。

<!--
#### Without `imagefs` or `containerfs`

If the node only has a `nodefs` filesystem that meets eviction thresholds,
the kubelet frees up disk space in the following order:

1. Garbage collect dead pods and containers.
1. Delete unused images.
-->
#### 沒有 `imagefs` 或 `containerfs` {#without-imagefs-or-containerfs}

如果節點只有一個 `nodefs` 檔案系統且該檔案系統達到驅逐閾值，
kubelet 將按以下順序釋放磁盤空間：

1. 對已死亡的 Pod 和容器執行垃圾收集操作。

1. 刪除未使用的映像檔。

<!--
#### With `imagefs`

If the node has a dedicated `imagefs` filesystem for container runtimes to use,
the kubelet does the following:

- If the `nodefs` filesystem meets the eviction thresholds, the kubelet garbage
  collects dead pods and containers.
- If the `imagefs` filesystem meets the eviction thresholds, the kubelet
  deletes all unused images.
-->
#### 有 `imagefs`

如果節點有一個專用的 `imagefs` 檔案系統供容器運行時使用，kubelet 會執行以下操作：

- 如果 `nodefs` 檔案系統滿足驅逐條件，kubelet 垃圾收集死亡 Pod 和容器。
- 如果 `imagefs` 檔案系統滿足驅逐條件，kubelet 將刪除所有未使用的映像檔。

<!--
#### With `imagefs` and `containerfs`

If the node has a dedicated `containerfs` alongside the `imagefs` filesystem
configured for the container runtimes to use, then kubelet will attempt to
reclaim resources as follows:

- If the `containerfs` filesystem meets the eviction thresholds, the kubelet
  garbage collects dead pods and containers.

- If the `imagefs` filesystem meets the eviction thresholds, the kubelet
  deletes all unused images.
-->
#### 有 `imagefs` 和 `containerfs` {#with-imagefs-and-containerfs}

如果節點除了 `imagefs` 檔案系統之外還設定了專用的 `containerfs` 以供容器運行時使用，
則 kubelet 將嘗試按如下方式回收資源：

- 如果 `containerfs` 檔案系統滿足驅逐閾值，則 kubelet 將垃圾收集死機的 Pod 和容器。

- 如果 `imagefs` 檔案系統滿足驅逐閾值，則 kubelet 將刪除所有未使用的映像檔。

<!--
### Pod selection for kubelet eviction

If the kubelet's attempts to reclaim node-level resources don't bring the eviction
signal below the threshold, the kubelet begins to evict end-user pods.

The kubelet uses the following parameters to determine the pod eviction order:

1. Whether the pod's resource usage exceeds requests
1. [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
1. The pod's resource usage relative to requests
-->
### kubelet 驅逐時 Pod 的選擇

如果 kubelet 回收節點級資源的嘗試沒有使驅逐信號低於條件，
則 kubelet 開始驅逐最終使用者 Pod。

kubelet 使用以下參數來確定 Pod 驅逐順序：

1. Pod 的資源使用是否超過其請求
1. [Pod 優先級](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
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
   這些 Pod 會根據它們的優先級以及它們的資源使用級別超過其請求的程度被逐出。
1. 資源使用量少於請求量的 `Guaranteed` Pod 和 `Burstable` Pod 根據其優先級被最後驅逐。

{{<note>}}
<!--
The kubelet does not use the pod's [QoS class](/docs/concepts/workloads/pods/pod-qos/) to determine the eviction order.
You can use the QoS class to estimate the most likely pod eviction order when
reclaiming resources like memory. QoS classification does not apply to EphemeralStorage requests,
so the above scenario will not apply if the node is, for example, under `DiskPressure`.
-->
kubelet 不使用 Pod 的 [QoS 類](/zh-cn/docs/concepts/workloads/pods/pod-qos/)來確定驅逐順序。
在回收內存等資源時，你可以使用 QoS 類來估計最可能的 Pod 驅逐順序。
QoS 分類不適用於臨時儲存（EphemeralStorage）請求，
因此如果節點在 `DiskPressure` 下，則上述場景將不適用。
{{</note>}}

<!--
`Guaranteed` pods are guaranteed only when requests and limits are specified for
all the containers and they are equal. These pods will never be evicted because
of another pod's resource consumption. If a system daemon (such as `kubelet`
and `journald`) is consuming more resources than were reserved via
`system-reserved` or `kube-reserved` allocations, and the node only has
`Guaranteed` or `Burstable` pods using less resources than requests left on it,
then the kubelet must choose to evict one of these pods to preserve node stability
and to limit the impact of resource starvation on other pods. In this case, it
will choose to evict pods of lowest Priority first.
-->
僅當 `Guaranteed` Pod 中所有容器都被指定了請求和限制並且二者相等時，才保證 Pod 不被驅逐。
這些 Pod 永遠不會因爲另一個 Pod 的資源消耗而被驅逐。
如果系統守護進程（例如 `kubelet` 和 `journald`）
消耗的資源比通過 `system-reserved` 或 `kube-reserved` 分配保留的資源多，
並且該節點只有 `Guaranteed` 或 `Burstable` Pod 使用的資源少於其上剩餘的請求，
那麼 kubelet 必須選擇驅逐這些 Pod 中的一個以保持節點穩定性並減少資源匱乏對其他 Pod 的影響。
在這種情況下，它會選擇首先驅逐最低優先級的 Pod。

<!--
If you are running a [static pod](/docs/concepts/workloads/pods/#static-pods)
and want to avoid having it evicted under resource pressure, set the
`priority` field for that Pod directly. Static pods do not support the
`priorityClassName` field.
-->
如果你正在運行[靜態 Pod](/zh-cn/docs/concepts/workloads/pods/#static-pods)
並且希望避免其在資源壓力下被驅逐，請直接爲該 Pod 設置 `priority` 字段。
靜態 Pod 不支持 `priorityClassName` 字段。

<!--
When the kubelet evicts pods in response to inode or process ID starvation, it uses
the Pods' relative priority to determine the eviction order, because inodes and PIDs have no
requests.

The kubelet sorts pods differently based on whether the node has a dedicated
`imagefs` or `containerfs` filesystem:
-->
當 kubelet 因 inode 或 進程 ID 不足而驅逐 Pod 時，
它使用 Pod 的相對優先級來確定驅逐順序，因爲 inode 和 PID 沒有對應的請求字段。

kubelet 根據節點是否具有專用的 `imagefs` 檔案系統或者 `containerfs`
檔案系統對 Pod 進行不同的排序：

<!--
#### Without `imagefs` or `containerfs` (`nodefs` and `imagefs` use the same filesystem) {#without-imagefs}

- If `nodefs` triggers evictions, the kubelet sorts pods based on their
  total disk usage (`local volumes + logs **and** a writable layer of all containers`).

#### With `imagefs` (`nodefs` and `imagefs` filesystems are separate) {#with-imagefs}

- If `nodefs` triggers evictions, the kubelet sorts pods based on `nodefs`
  usage (`local volumes + logs of all containers`).

- If `imagefs` triggers evictions, the kubelet sorts pods based on the
  writable layer usage of all containers.
-->
#### 沒有 `imagefs` 或 `containerfs`（`nodefs` 和 `imagefs` 使用相同的檔案系統）{#without-imagefs}

- 如果 `nodefs` 觸發驅逐，kubelet 將根據 Pod 的總磁盤使用量（`本地卷 + 日誌和所有容器的可寫層`）對 Pod 進行排序。

#### 有 `imagefs`（`nodefs` 和 `imagefs` 檔案系統是獨立的）{#with-imagefs}

- 如果 `nodefs` 觸發驅逐，kubelet 將根據 `nodefs` 使用量（`本地卷 + 所有容器的日誌`）對 Pod 進行排序。

- 如果 `imagefs` 觸發驅逐，kubelet 將根據所有容器的可寫層用量對 Pod 進行排序。

<!--
#### With `imagesfs` and `containerfs` (`imagefs` and `containerfs` have been split) {#with-containersfs}

- If `containerfs` triggers evictions, the kubelet sorts pods based on
  `containerfs` usage (`local volumes + logs and a writable layer of all containers`).

- If `imagefs` triggers evictions, the kubelet sorts pods based on the
  `storage of images` rank, which represents the disk usage of a given image.
-->
#### 有 `imagesfs` 和 `containerfs`（`imagefs` 和 `containerfs` 已拆分）{#with-containersfs}

- 如果 `containerfs` 觸發驅逐，kubelet 將根據
  `containerfs` 使用情況（`本地卷 + 日誌和所有容器的可寫層`）對 Pod 進行排序。

- 如果 `imagefs` 觸發驅逐，kubelet
  將根據`鏡像存儲`用量對 Pod 進行排序，該用量表示給定映像檔的磁盤使用情況。

<!--
### Minimum eviction reclaim
-->
### 最小驅逐回收 {#minimum-eviction-reclaim}

{{<note>}}
<!--
As of Kubernetes v{{< skew currentVersion >}}, you cannot set a custom value
for the `containerfs.available` metric. The configuration for this specific
metric will be set automatically to reflect values set for either the `nodefs`
or `imagefs`, depending on the configuration.
-->
在 Kubernetes v{{< skew currentVersion >}} 中，你無法爲 `containerfs.available` 指標設置自定義值。
此特定指標的設定將自動設置爲反映爲 `nodefs` 或 `imagefs` 設置的值，具體取決於設定。
{{</note>}}

<!--
In some cases, pod eviction only reclaims a small amount of the starved resource.
This can lead to the kubelet repeatedly hitting the configured eviction thresholds
and triggering multiple evictions.
-->
在某些情況下，驅逐 Pod 只會回收少量的緊俏資源。
這可能導致 kubelet 反覆達到設定的驅逐條件並觸發多次驅逐。

<!--
You can use the `--eviction-minimum-reclaim` flag or a [kubelet config file](/docs/tasks/administer-cluster/kubelet-config-file/)
to configure a minimum reclaim amount for each resource. When the kubelet notices
that a resource is starved, it continues to reclaim that resource until it
reclaims the quantity you specify.

For example, the following configuration sets minimum reclaim amounts:
-->
你可以使用 `--eviction-minimum-reclaim` 標誌或
[kubelet 設定檔案](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)爲每個資源設定最小回收量。
當 kubelet 注意到某個資源耗盡時，它會繼續回收該資源，直到回收到你所指定的數量爲止。

例如，以下設定設置最小回收量：

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
the kubelet reclaims the resource until the signal reaches the threshold of 1GiB,
and then continues to reclaim the minimum amount of 500MiB, until the available
nodefs storage value reaches 1.5GiB.

Similarly, the kubelet tries to reclaim the `imagefs` resource until the `imagefs.available`
value reaches `102Gi`, representing 102 GiB of available container image storage. If the amount
of storage that the kubelet could reclaim is less than 2GiB, the kubelet doesn't reclaim anything.

The default `eviction-minimum-reclaim` is `0` for all resources.
-->
在這個例子中，如果 `nodefs.available` 信號滿足驅逐條件，
kubelet 會回收資源，直到信號達到 1GiB 的條件，
然後繼續回收至少 500MiB 直到信號達到 1.5GiB。

類似地，kubelet 嘗試回收 `imagefs` 資源，直到 `imagefs.available` 值達到 `102Gi`，
即 102 GiB 的可用容器映像檔儲存。如果 kubelet 可以回收的儲存量小於 2GiB，
則 kubelet 不會回收任何內容。

對於所有資源，預設的 `eviction-minimum-reclaim` 爲 `0`。

<!--
## Node out of memory behavior

If the node experiences an _out of memory_ (OOM) event prior to the kubelet
being able to reclaim memory, the node depends on the [oom_killer](https://lwn.net/Articles/391222/)
to respond.

The kubelet sets an `oom_score_adj` value for each container based on the QoS for the pod.
-->
## 節點內存不足行爲   {#node-out-of-memory-behavior}

如果節點在 kubelet 能夠回收內存之前遇到**內存不足**（OOM）事件，
則節點依賴 [oom_killer](https://lwn.net/Articles/391222/) 來響應。

kubelet 根據 Pod 的服務質量（QoS）爲每個容器設置一個 `oom_score_adj` 值。

<!--
| Quality of Service | `oom_score_adj`                                                                   |
|--------------------|-----------------------------------------------------------------------------------|
| `Guaranteed`       | -997                                                                              |
| `BestEffort`       | 1000                                                                              |
| `Burstable`        | _min(max(2, 1000 - (1000 × memoryRequestBytes) / machineMemoryCapacityBytes), 999)_ |
-->
| 服務質量            | `oom_score_adj`                                                                        |
|--------------------|---------------------------------------------------------------------------------------|
| `Guaranteed`       | -997                                                                                  |
| `BestEffort`       | 1000                                                                                  |
| `Burstable`        | **min(max(2, 1000 - (1000 * memoryRequestBytes) / machineMemoryCapacityBytes), 999)** |

{{<note>}}
<!--
The kubelet also sets an `oom_score_adj` value of `-997` for any containers in Pods that have
`system-node-critical` {{<glossary_tooltip text="Priority" term_id="pod-priority">}}.
-->
kubelet 還將具有 `system-node-critical`
{{<glossary_tooltip text="優先級" term_id="pod-priority">}}的任何
Pod 中的容器 `oom_score_adj` 值設爲 `-997`。
{{</note>}}

<!--
If the kubelet can't reclaim memory before a node experiences OOM, the
`oom_killer` calculates an `oom_score` based on the percentage of memory it's
using on the node, and then adds the `oom_score_adj` to get an effective `oom_score`
for each container. It then kills the container with the highest score.

This means that containers in low QoS pods that consume a large amount of memory
relative to their scheduling requests are killed first.

Unlike pod eviction, if a container is OOM killed, the kubelet can restart it
based on its `restartPolicy`.
-->
如果 kubelet 在節點遇到 OOM 之前無法回收內存，
則 `oom_killer` 根據它在節點上使用的內存百分比計算 `oom_score`，
然後加上 `oom_score_adj` 得到每個容器有效的 `oom_score`。
然後它會殺死得分最高的容器。

這意味着低 QoS Pod 中相對於其調度請求消耗內存較多的容器，將首先被殺死。

與 Pod 驅逐不同，如果容器被 OOM 殺死，
kubelet 可以根據其 `restartPolicy` 重新啓動它。

<!--
## Good practices {#node-pressure-eviction-good-practices}

The following sections describe good practices for eviction configuration.
-->
### 良好實踐 {#node-pressure-eviction-good-practices}

以下各小節闡述驅逐設定的好的做法。

<!--
### Schedulable resources and eviction policies

When you configure the kubelet with an eviction policy, you should make sure that
the scheduler will not schedule pods if they will trigger eviction because they
immediately induce memory pressure.
-->
#### 可調度的資源和驅逐策略

當你爲 kubelet 設定驅逐策略時，
你應該確保調度程式不會在 Pod 觸發驅逐時對其進行調度，因爲這類 Pod 會立即引起內存壓力。

<!--
Consider the following scenario:

- Node memory capacity: 10GiB
- Operator wants to reserve 10% of memory capacity for system daemons (kernel, `kubelet`, etc.)
- Operator wants to evict Pods at 95% memory utilization to reduce incidence of system OOM.
-->
考慮以下場景：

* 節點內存容量：10GiB
* 操作員希望爲系統守護進程（內核、`kubelet` 等）保留 10% 的內存容量
* 操作員希望在節點內存利用率達到 95% 以上時驅逐 Pod，以減少系統 OOM 的概率。

<!--
For this to work, the kubelet is launched as follows:
-->
爲此，kubelet 啓動設置如下：

```none
--eviction-hard=memory.available<500Mi
--system-reserved=memory=1.5Gi
```

<!--
In this configuration, the `--system-reserved` flag reserves 1.5GiB of memory
for the system, which is `10% of the total memory + the eviction threshold amount`.

The node can reach the eviction threshold if a pod is using more than its request,
or if the system is using more than 1GiB of memory, which makes the `memory.available`
signal fall below 500MiB and triggers the threshold.
-->
在此設定中，`--system-reserved` 標誌爲系統預留了 1GiB 的內存，
即 `總內存的 10% + 驅逐條件量`。

如果 Pod 使用的內存超過其請求值或者系統使用的內存超過 `1Gi`，
則節點可以達到驅逐條件，這使得 `memory.available` 信號低於 500MiB 並觸發條件。

<!--
### DaemonSets and node-pressure eviction {#daemonset}

Pod priority is a major factor in making eviction decisions. If you do not want
the kubelet to evict pods that belong to a DaemonSet, give those pods a high
enough priority by specifying a suitable `priorityClassName` in the pod spec.
You can also use a lower priority, or the default, to only allow pods from that
DaemonSet to run when there are enough resources.
-->
### DaemonSet 和節點壓力驅逐  {#daemonset}

Pod 優先級是做出驅逐決定的主要因素。
如果你不希望 kubelet 驅逐屬於 DaemonSet 的 Pod，
請在 Pod 規約中通過指定合適的 `priorityClassName` 爲這些 Pod
提供足夠高的 `priorityClass`。
你還可以使用較低優先級或預設優先級，以便僅在有足夠資源時才運行 `DaemonSet` Pod。

<!--
## Known issues

The following sections describe known issues related to out of resource handling.
-->
## 已知問題   {#known-issues}

以下部分描述了與資源不足處理相關的已知問題。

<!--
### kubelet may not observe memory pressure right away

By default, the kubelet polls cAdvisor to collect memory usage stats at a
regular interval. If memory usage increases within that window rapidly, the
kubelet may not observe `MemoryPressure` fast enough, and the OOM killer
will still be invoked.
-->
#### kubelet 可能不會立即觀察到內存壓力

預設情況下，kubelet 輪詢 cAdvisor 以定期收集內存使用情況統計資訊。
如果該輪詢時間窗口內內存使用量迅速增加，kubelet 可能無法足夠快地觀察到 `MemoryPressure`，
但是 OOM killer 仍將被調用。

<!--
You can use the `--kernel-memcg-notification` flag to enable the `memcg`
notification API on the kubelet to get notified immediately when a threshold
is crossed.

If you are not trying to achieve extreme utilization, but a sensible measure of
overcommit, a viable workaround for this issue is to use the `--kube-reserved`
and `--system-reserved` flags to allocate memory for the system.
-->
你可以使用 `--kernel-memcg-notification`
標誌在 kubelet 上啓用 `memcg` 通知 API，以便在超過條件時立即收到通知。

如果你不是追求極端利用率，而是要採取合理的過量使用措施，
則解決此問題的可行方法是使用 `--kube-reserved` 和 `--system-reserved` 標誌爲系統分配內存。

<!--
### active_file memory is not considered as available memory

On Linux, the kernel tracks the number of bytes of file-backed memory on active
least recently used (LRU) list as the `active_file` statistic. The kubelet treats `active_file` memory
areas as not reclaimable. For workloads that make intensive use of block-backed
local storage, including ephemeral local storage, kernel-level caches of file
and block data means that many recently accessed cache pages are likely to be
counted as `active_file`. If enough of these kernel block buffers are on the
active LRU list, the kubelet is liable to observe this as high resource use and
taint the node as experiencing memory pressure - triggering pod eviction.
-->
### active_file 內存未被視爲可用內存

在 Linux 上，內核跟蹤活動最近最少使用（LRU）列表上的基於檔案所虛擬的內存字節數作爲 `active_file` 統計資訊。
kubelet 將 `active_file` 內存區域視爲不可回收。
對於大量使用塊設備形式的本地儲存（包括臨時本地儲存）的工作負載，
檔案和塊資料的內核級緩存意味着許多最近訪問的緩存頁面可能被計爲 `active_file`。
如果這些內核塊緩衝區中在活動 LRU 列表上有足夠多，
kubelet 很容易將其視爲資源用量過量併爲節點設置內存壓力污點，從而觸發 Pod 驅逐。

<!--
For more details, see [https://github.com/kubernetes/kubernetes/issues/43916](https://github.com/kubernetes/kubernetes/issues/43916)

You can work around that behavior by setting the memory limit and memory request
the same for containers likely to perform intensive I/O activity. You will need
to estimate or measure an optimal memory limit value for that container.
-->
更多細節請參見
[https://github.com/kubernetes/kubernetes/issues/43916](https://github.com/kubernetes/kubernetes/issues/43916)。

你可以通過爲可能執行 I/O 密集型活動的容器設置相同的內存限制和內存請求來應對該行爲。
你將需要估計或測量該容器的最佳內存限制值。

## {{% heading "whatsnext" %}}

<!--
- Learn about [API-initiated Eviction](/docs/concepts/scheduling-eviction/api-eviction/)
- Learn about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
- Learn about [PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/)
- Learn about [Quality of Service](/docs/tasks/configure-pod-container/quality-service-pod/) (QoS)
- Check out the [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
-->
- 瞭解 [API 發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)
- 瞭解 [Pod 優先級和搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
- 瞭解 [PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/)
- 瞭解[服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)（QoS）
- 查看[驅逐 API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
