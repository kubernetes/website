---
title: 爲系統守護進程預留計算資源
content_type: task
weight: 290
---
<!--
reviewers:
- vishh
- derekwaynecarr
- dashpole
title: Reserve Compute Resources for System Daemons
content_type: task
weight: 290
-->

<!-- overview -->
<!--
Kubernetes nodes can be scheduled to `Capacity`. Pods can consume all the
available capacity on a node by default. This is an issue because nodes
typically run quite a few system daemons that power the OS and Kubernetes
itself. Unless resources are set aside for these system daemons, pods and system
daemons compete for resources and lead to resource starvation issues on the
node.

The `kubelet` exposes a feature named 'Node Allocatable' that helps to reserve
compute resources for system daemons. Kubernetes recommends cluster
administrators to configure 'Node Allocatable' based on their workload density
on each node.
-->
Kubernetes 的節點可以按照 `Capacity` 調度。默認情況下 pod 能夠使用節點全部可用容量。
這是個問題，因爲節點自己通常運行了不少驅動 OS 和 Kubernetes 的系統守護進程。
除非爲這些系統守護進程留出資源，否則它們將與 Pod 爭奪資源並導致節點資源短缺問題。

`kubelet` 公開了一個名爲 'Node Allocatable' 的特性，有助於爲系統守護進程預留計算資源。
Kubernetes 推薦叢集管理員按照每個節點上的工作負載密度設定 'Node Allocatable'。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- 
You can configure below kubelet [configuration settings](/docs/reference/config-api/kubelet-config.v1beta1/)
using the [kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/).
-->
你可以使用 [kubelet 設定文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)來設定以下
kubelet [設置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)。

<!-- steps -->

<!--
## Node Allocatable

![node capacity](/images/docs/node-capacity.svg)

'Allocatable' on a Kubernetes node is defined as the amount of compute resources
that are available for pods. The scheduler does not over-subscribe
'Allocatable'. 'CPU', 'memory' and 'ephemeral-storage' are supported as of now.

Node Allocatable is exposed as part of `v1.Node` object in the API and as part
of `kubectl describe node` in the CLI.

Resources can be reserved for two categories of system daemons in the `kubelet`.
-->
## 節點可分配資源   {#node-allocatable}

![節點容量](/images/docs/node-capacity.svg)

Kubernetes 節點上的 'Allocatable' 被定義爲 Pod 可用計算資源量。
調度器不會超額申請 'Allocatable'。
目前支持 'CPU'、'memory' 和 'ephemeral-storage' 這幾個參數。

可分配的節點暴露爲 API 中 `v1.Node` 對象的一部分，也是 CLI 中
`kubectl describe node` 的一部分。

在 `kubelet` 中，可以爲兩類系統守護進程預留資源。

<!--
### Enabling QoS and Pod level cgroups

To properly enforce node allocatable constraints on the node, you must
enable the new cgroup hierarchy via the `cgroupsPerQOS` setting. This setting is
enabled by default. When enabled, the `kubelet` will parent all end-user pods
under a cgroup hierarchy managed by the `kubelet`.
-->
### 啓用 QoS 和 Pod 級別的 cgroups  {#enabling-qos-and-pod-level-cgroups}

爲了恰當地在節點範圍實施節點可分配約束，你必須通過 `cgroupsPerQOS`
設置啓用新的 cgroup 層次結構。這個設置是默認啓用的。
啓用後，`kubelet` 將在其管理的 cgroup 層次結構中創建所有終端使用者的 Pod。

<!--
### Configuring a cgroup driver

The `kubelet` supports manipulation of the cgroup hierarchy on
the host using a cgroup driver. The driver is configured via the `cgroupDriver` setting.

The supported values are the following:

* `cgroupfs` is the default driver that performs direct manipulation of the
cgroup filesystem on the host in order to manage cgroup sandboxes.
* `systemd` is an alternative driver that manages cgroup sandboxes using
transient slices for resources that are supported by that init system.

Depending on the configuration of the associated container runtime,
operators may have to choose a particular cgroup driver to ensure
proper system behavior. For example, if operators use the `systemd`
cgroup driver provided by the `containerd` runtime, the `kubelet` must
be configured to use the `systemd` cgroup driver.
-->
### 設定 cgroup 驅動  {#configuring-a-cgroup-driver}

`kubelet` 支持在主機上使用 cgroup 驅動操作 cgroup 層次結構。
該驅動通過 `cgroupDriver` 設置進行設定。

支持的參數值如下：

* `cgroupfs` 是默認的驅動，在主機上直接操作 cgroup 文件系統以對 cgroup
  沙箱進行管理。
* `systemd` 是可選的驅動，使用 init 系統支持的資源的瞬時切片管理
  cgroup 沙箱。

取決於相關容器運行時的設定，操作員可能需要選擇一個特定的 cgroup 驅動來保證系統正常運行。
例如，如果操作員使用 `containerd` 運行時提供的 `systemd` cgroup 驅動時，
必須設定 `kubelet` 使用 `systemd` cgroup 驅動。

<!--
### Kube Reserved

- **KubeletConfiguration Setting**: `kubeReserved: {}`. Example value `{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration Setting**: `kubeReservedCgroup: ""`

`kubeReserved` is meant to capture resource reservation for kubernetes system
daemons like the `kubelet`, `container runtime`, etc.
It is not meant to reserve resources for system daemons that are run as pods.
`kubeReserved` is typically a function of `pod density` on the nodes.

In addition to `cpu`, `memory`, and `ephemeral-storage`, `pid` may be
specified to reserve the specified number of process IDs for
kubernetes system daemons.
-->
### Kube 預留值  {#kube-reserved}

- **KubeletConfiguration 設置**：`kubeReserved: {}`。
  示例值 `{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration 設置**：`kubeReservedCgroup: ""`

`kubeReserved` 用來給諸如 `kubelet`、容器運行時等
Kubernetes 系統守護進程記述其資源預留值。
該設定並非用來給以 Pod 形式運行的系統守護進程預留資源。`kubeReserved`
通常是節點上 `Pod 密度` 的函數。

除了 `cpu`、`內存` 和 `ephemeral-storage` 之外，`pid` 可用來指定爲
Kubernetes 系統守護進程預留指定數量的進程 ID。

<!--
To optionally enforce `kubeReserved` on kubernetes system daemons, specify the parent
control group for kube daemons as the value for `kubeReservedCgroup` setting,
and [add `kube-reserved` to `enforceNodeAllocatable`](#enforcing-node-allocatable).

It is recommended that the kubernetes system daemons are placed under a top
level control group (`runtime.slice` on systemd machines for example). Each
system daemon should ideally run within its own child control group. Refer to
[the design proposal](https://git.k8s.io/design-proposals-archive/node/node-allocatable.md#recommended-cgroups-setup)
for more details on recommended control group hierarchy.
-->
要選擇性地對 Kubernetes 系統守護進程上執行 `kubeReserved` 保護，需要把 kubelet 的
`kubeReservedCgroup` 設置的值設爲 kube 守護進程的父控制組，
並[將 `kube-reserved` 添加到 `enforceNodeAllocatable`](#enforcing-node-allocatable)。

推薦將 Kubernetes 系統守護進程放置於頂級控制組之下（例如 systemd 機器上的 `runtime.slice`）。
理想情況下每個系統守護進程都應該在其自己的子控制組中運行。
請參考[這個設計方案](https://git.k8s.io/design-proposals-archive/node/node-allocatable.md#recommended-cgroups-setup)，
進一步瞭解關於推薦控制組層次結構的細節。

<!--
Note that Kubelet **does not** create `kubeReservedCgroup` if it doesn't
exist. The kubelet will fail to start if an invalid cgroup is specified. With `systemd`
cgroup driver, you should follow a specific pattern for the name of the cgroup you
define: the name should be the value you set for `kubeReservedCgroup`,
with `.slice` appended.
-->
請注意，如果 `kubeReservedCgroup` 不存在，Kubelet 將 **不會** 創建它。
如果指定了一個無效的 cgroup，Kubelet 將會無法啓動。就 `systemd` cgroup 驅動而言，
你要爲所定義的 cgroup 設置名稱時要遵循特定的模式：
所設置的名字應該是你爲 `kubeReservedCgroup` 所給的參數值加上 `.slice` 後綴。

<!--
### System Reserved

- **KubeletConfiguration Setting**: `systemReserved: {}`. Example value `{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration Setting**: `systemReservedCgroup: ""`
-->
### 系統預留值  {#system-reserved}

- **KubeletConfiguration 設置**：`systemReserved: {}`。
  示例值 `{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration 設置**：`systemReservedCgroup: ""`

<!--
`systemReserved` is meant to capture resource reservation for OS system daemons
like `sshd`, `udev`, etc. `systemReserved` should reserve `memory` for the
`kernel` too since `kernel` memory is not accounted to pods in Kubernetes at this time.
Reserving resources for user login sessions is also recommended (`user.slice` in
systemd world).

In addition to `cpu`, `memory`, and `ephemeral-storage`, `pid` may be
specified to reserve the specified number of process IDs for OS system
daemons.
-->
`systemReserved` 用於爲諸如 `sshd`、`udev` 等系統守護進程記述其資源預留值。
`systemReserved` 也應該爲 `kernel` 預留 `內存`，因爲目前 `kernel`
使用的內存並不記在 Kubernetes 的 Pod 上。
同時還推薦爲使用者登錄會話預留資源（systemd 體系中的 `user.slice`）。

除了 `cpu`、`內存` 和 `ephemeral-storage` 之外，`pid` 可用來指定爲
Kubernetes 系統守護進程預留指定數量的進程 ID。

<!--
To optionally enforce `systemReserved` on system daemons, specify the parent
control group for OS system daemons as the value for `systemReservedCgroup` setting,
and [add `system-reserved` to `enforceNodeAllocatable`](#enforcing-node-allocatable).

It is recommended that the OS system daemons are placed under a top level
control group (`system.slice` on systemd machines for example).
-->
要想爲系統守護進程上可選地實施 `systemReserved` 約束，請指定 kubelet 的
`systemReservedCgroup` 設置值爲 OS 系統守護進程的父級控制組，
並[將 `system-reserved` 添加到 `enforceNodeAllocatable`](#enforcing-node-allocatable)。

推薦將 OS 系統守護進程放在一個頂級控制組之下（例如 systemd 機器上的
`system.slice`）。

<!--
Note that `kubelet` **does not** create `systemReservedCgroup` if it doesn't
exist. `kubelet` will fail if an invalid cgroup is specified.  With `systemd`
cgroup driver, you should follow a specific pattern for the name of the cgroup you
define: the name should be the value you set for `systemReservedCgroup`,
with `.slice` appended.
-->
請注意，如果 `systemReservedCgroup` 不存在，`kubelet` **不會** 創建它。
如果指定了無效的 cgroup，`kubelet` 將會失敗。就 `systemd` cgroup 驅動而言，
你在指定 cgroup 名字時要遵循特定的模式：
該名字應該是你爲 `systemReservedCgroup` 參數所設置的值加上 `.slice` 後綴。

<!--
### Explicitly Reserved CPU List
-->
### 顯式預留的 CPU 列表 {#explicitly-reserved-cpu-list}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
**KubeletConfiguration Setting**: `reservedSystemCPUs:`. Example value `0-3`
-->
**KubeletConfiguration 設置**：`reservedSystemCPUs:`。示例值 `0-3`

<!--
`reservedSystemCPUs` is meant to define an explicit CPU set for OS system daemons and
kubernetes system daemons. `reservedSystemCPUs` is for systems that do not intend to
define separate top level cgroups for OS system daemons and kubernetes system daemons
with regard to cpuset resource.
If the Kubelet **does not** have `kubeReservedCgroup` and `systemReservedCgroup`,
the explicit cpuset provided by `reservedSystemCPUs` will take precedence over the CPUs
defined by `kubeReservedCgroup` and `systemReservedCgroup` options.
-->
`reservedSystemCPUs` 旨在爲操作系統守護程序和 Kubernetes 系統守護程序預留一組明確指定編號的 CPU。
`reservedSystemCPUs` 適用於不打算針對 cpuset 資源爲操作系統守護程序和 Kubernetes
系統守護程序定義獨立的頂級 cgroups 的系統。
如果 Kubelet **沒有** 指定參數 `kubeReservedCgroup` 和 `systemReservedCgroup`，
則 `reservedSystemCPUs` 的設置將優先於 `kubeReservedCgroup` 和 `systemReservedCgroup` 選項。

<!--
This option is specifically designed for Telco/NFV use cases where uncontrolled
interrupts/timers may impact the workload performance. you can use this option
to define the explicit cpuset for the system/kubernetes daemons as well as the
interrupts/timers, so the rest CPUs on the system can be used exclusively for
workloads, with less impact from uncontrolled interrupts/timers. To move the
system daemon, kubernetes daemons and interrupts/timers to the explicit cpuset
defined by this option, other mechanism outside Kubernetes should be used.
For example: in Centos, you can do this using the tuned toolset.
-->
此選項是專門爲電信/NFV 用例設計的，在這些用例中不受控制的中斷或計時器可能會影響其工作負載性能。
你可以使用此選項爲系統或 Kubernetes 守護程序以及中斷或計時器顯式定義 cpuset，
這樣系統上的其餘 CPU 可以專門用於工作負載，因不受控制的中斷或計時器的影響得以降低。
要將系統守護程序、Kubernetes 守護程序和中斷或計時器移動到此選項定義的顯式
cpuset 上，應使用 Kubernetes 之外的其他機制。
例如：在 CentOS 系統中，可以使用 tuned 工具集來執行此操作。

<!--
### Eviction Thresholds

**KubeletConfiguration Setting**: `evictionHard: {memory.available: "100Mi", nodefs.available: "10%", nodefs.inodesFree: "5%", imagefs.available: "15%"}`. Example value: `{memory.available: "<500Mi"}`

Memory pressure at the node level leads to System OOMs which affects the entire
node and all pods running on it. Nodes can go offline temporarily until memory
has been reclaimed. To avoid (or reduce the probability of) system OOMs kubelet
provides [out of resource](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
management. Evictions are
supported for `memory` and `ephemeral-storage` only. By reserving some memory via
`evictionHard` setting, the `kubelet` attempts to evict pods whenever memory
availability on the node drops below the reserved value. Hypothetically, if
system daemons did not exist on a node, pods cannot use more than `capacity -
eviction-hard`. For this reason, resources reserved for evictions are not
available for pods.
-->
### 驅逐閾值   {#eviction-Thresholds}

**KubeletConfiguration 設置**：
`evictionHard: {memory.available: "100Mi", nodefs.available: "10%", nodefs.inodesFree: "5%", imagefs.available: "15%"}`。
示例值: `{memory.available: "<500Mi"}`

節點級別的內存壓力將導致系統內存不足，這將影響到整個節點及其上運行的所有 Pod。
節點可以暫時離線直到內存已經回收爲止。爲了防止系統內存不足（或減少系統內存不足的可能性），
kubelet 提供了[資源不足](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)管理。
驅逐操作只支持 `memory` 和 `ephemeral-storage`。
通過 `evictionHard` 設置預留一些內存後，當節點上的可用內存降至預留值以下時，
`kubelet` 將嘗試驅逐 Pod。
如果節點上不存在系統守護進程，Pod 將不能使用超過 `capacity-eviction-hard` 所指定的資源量。
因此，爲驅逐而預留的資源對 Pod 是不可用的。

<!--
### Enforcing Node Allocatable

**KubeletConfiguration setting**: `enforceNodeAllocatable: [pods]`. Example value: `[pods,system-reserved,kube-reserved]`

The scheduler treats 'Allocatable' as the available `capacity` for pods.
-->
### 實施節點可分配約束   {#enforcing-node-allocatable}

**KubeletConfiguration 設置**：`enforceNodeAllocatable: [pods]`。
示例值：`[pods,system-reserved,kube-reserved]`

調度器將 'Allocatable' 視爲 Pod 可用的 `capacity`（資源容量）。

<!--
`kubelet` enforce 'Allocatable' across pods by default. Enforcement is performed
by evicting pods whenever the overall usage across all pods exceeds
'Allocatable'. More details on eviction policy can be found
on the [node pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
page. This enforcement is controlled by
specifying `pods` value to the KubeletConfiguration setting `enforceNodeAllocatable`.
-->
`kubelet` 默認對 Pod 執行 'Allocatable' 約束。
無論何時，如果所有 Pod 的總用量超過了 'Allocatable'，驅逐 Pod 的措施將被執行。
有關驅逐策略的更多細節可以在[節點壓力驅逐](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)頁找到。
可將 KubeletConfiguration `enforceNodeAllocatable` 設置爲 `pods` 值來控制這個措施。

<!--
Optionally, `kubelet` can be made to enforce `kubeReserved` and
`systemReserved` by specifying `kube-reserved` & `system-reserved` values in
the same setting. Note that to enforce `kubeReserved` or `systemReserved`,
`kubeReservedCgroup` or `systemReservedCgroup` needs to be specified
respectively.
-->
可選地，通過在同一設置中同時指定 `kube-reserved` 和 `system-reserved` 值，
可以使 `kubelet` 強制實施 `kubeReserved` 和 `systemReserved` 約束。
請注意，要想執行 `kubeReserved` 或者 `systemReserved` 約束，
需要對應設置 `kubeReservedCgroup` 或者 `systemReservedCgroup`。

<!--
## General Guidelines

System daemons are expected to be treated similar to
[Guaranteed pods](/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-guaranteed).
System daemons can burst within their bounding control groups and this behavior needs
to be managed as part of kubernetes deployments. For example, `kubelet` should
have its own control group and share `kubeReserved` resources with the
container runtime. However, Kubelet cannot burst and use up all available Node
resources if `kubeReserved` is enforced.
-->
## 一般原則   {#general-guidelines}

系統守護進程一般會被按照類似
[Guaranteed 的 Pod](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-guaranteed)
一樣對待。
系統守護進程可以在與其對應的控制組中出現突發資源用量，這一行爲要作爲 Kubernetes 部署的一部分進行管理。
例如，`kubelet` 應該有它自己的控制組並和容器運行時共享 `kubeReserved` 資源。
不過，如果執行了 `kubeReserved` 約束，則 kubelet 不可出現突發負載並用光節點的所有可用資源。

<!--
Be extra careful while enforcing `systemReserved` reservation since it can lead
to critical system services being CPU starved, OOM killed, or unable
to fork on the node. The
recommendation is to enforce `systemReserved` only if a user has profiled their
nodes exhaustively to come up with precise estimates and is confident in their
ability to recover if any process in that group is oom-killed.
-->
在執行 `systemReserved` 預留策略時請加倍小心，因爲它可能導致節點上的關鍵系統服務出現 CPU 資源短缺、
因爲內存不足而被終止或者無法在節點上創建進程。
建議只有當使用者詳盡地描述了他們的節點以得出精確的估計值，
並且對該組中進程因內存不足而被殺死時，有足夠的信心將其恢復時，
纔可以強制執行 `systemReserved` 策略。

<!--
* To begin with enforce 'Allocatable' on `pods`.
* Once adequate monitoring and alerting is in place to track kube system
  daemons, attempt to enforce `kubeReserved` based on usage heuristics.
* If absolutely necessary, enforce `systemReserved` over time.
-->
* 作爲起步，可以先針對 `pods` 上執行 'Allocatable' 約束。
* 一旦用於追蹤系統守護進程的監控和告警的機制到位，可嘗試基於用量估計的方式執行 `kubeReserved` 策略。
* 隨着時間推進，在絕對必要的時候可以執行 `systemReserved` 策略。

<!--
The resource requirements of kube system daemons may grow over time as more and
more features are added. Over time, kubernetes project will attempt to bring
down utilization of node system daemons, but that is not a priority as of now.
So expect a drop in `Allocatable` capacity in future releases.
-->
隨着時間推進和越來越多特性被加入，kube 系統守護進程對資源的需求可能也會增加。
以後 Kubernetes 項目將嘗試減少對節點系統守護進程的利用，但目前這件事的優先級並不是最高。
所以，將來的發佈版本中 `Allocatable` 容量是有可能降低的。

<!-- discussion -->

<!--
## Example Scenario

Here is an example to illustrate Node Allocatable computation:

* Node has `32Gi` of `memory`, `16 CPUs` and `100Gi` of `Storage`
* `kubeReserved` is set to `{cpu: 1000m, memory: 2Gi, ephemeral-storage: 1Gi}`
* `systemReserved` is set to `{cpu: 500m, memory: 1Gi, ephemeral-storage: 1Gi}`
* `evictionHard` is set to `{memory.available: "<500Mi", nodefs.available: "<10%"}`
-->
## 示例場景   {#example-scenario}

這是一個用於說明節點可分配（Node Allocatable）計算方式的示例：

* 節點擁有 `32Gi` `memory`、`16 CPU` 和 `100Gi` `Storage` 資源
* `kubeReserved` 被設置爲 `{cpu: 1000m, memory: 2Gi, ephemeral-storage: 1Gi}`
* `systemReserved` 被設置爲 `{cpu: 500m, memory: 1Gi, ephemeral-storage: 1Gi}`
* `evictionHard` 被設置爲 `{memory.available: "<500Mi", nodefs.available: "<10%"}`

<!--
Under this scenario, 'Allocatable' will be 14.5 CPUs, 28.5Gi of memory and
`88Gi` of local storage.
Scheduler ensures that the total memory `requests` across all pods on this node does
not exceed 28.5Gi and storage doesn't exceed 88Gi.
Kubelet evicts pods whenever the overall memory usage across pods exceeds 28.5Gi,
or if overall disk usage exceeds 88Gi. If all processes on the node consume as
much CPU as they can, pods together cannot consume more than 14.5 CPUs.
-->
在這個場景下，'Allocatable' 將會是 14.5 CPUs、28.5Gi 內存以及 `88Gi` 本地存儲。
調度器保證這個節點上的所有 Pod 的內存 `requests` 總量不超過 28.5Gi，存儲不超過 '88Gi'。
當 Pod 的內存使用總量超過 28.5Gi 或者磁盤使用總量超過 88Gi 時，kubelet 將會驅逐它們。
如果節點上的所有進程都儘可能多地使用 CPU，則 Pod 加起來不能使用超過 14.5 CPUs 的資源。

<!--
If `kubeReserved` and/or `systemReserved` is not enforced and system daemons
exceed their reservation, `kubelet` evicts pods whenever the overall node memory
usage is higher than 31.5Gi or `storage` is greater than 90Gi.
-->
當沒有執行 `kubeReserved` 和/或 `systemReserved` 策略且系統守護進程使用量超過其預留時，
如果節點內存用量高於 31.5Gi 或 `storage` 大於 90Gi，kubelet 將會驅逐 Pod。
