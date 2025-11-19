---
title: 控制節點上的 CPU 管理策略
content_type: task
min-kubernetes-server-version: v1.26
weight: 140
---
<!--
title: Control CPU Management Policies on the Node
reviewers:
- sjenning
- ConnorDoyle
- balajismaniam

content_type: task
min-kubernetes-server-version: v1.26
weight: 140
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
Kubernetes keeps many aspects of how pods execute on nodes abstracted
from the user. This is by design.  However, some workloads require
stronger guarantees in terms of latency and/or performance in order to operate
acceptably. The kubelet provides methods to enable more complex workload
placement policies while keeping the abstraction free from explicit placement
directives.
-->
按照設計，Kubernetes 對 Pod 執行相關的很多方面進行了抽象，使得使用者不必關心。
然而，爲了正常運行，有些工作負載要求在延遲和/或性能方面有更強的保證。
爲此，kubelet 提供方法來實現更復雜的負載放置策略，同時保持抽象，避免顯式的放置指令。

<!--
For detailed information on resource management, please refer to the
[Resource Management for Pods and Containers](/docs/concepts/configuration/manage-resources-containers)
documentation.

For detailed information on how the kubelet implements resource management, please refer to the
[Node ResourceManagers](/docs/concepts/policy/node-resource-managers) documentation.
-->
有關資源管理的詳細信息，
請參閱 [Pod 和容器的資源管理](/zh-cn/docs/concepts/configuration/manage-resources-containers)文檔。

有關 kubelet 如何實現資源管理的詳細信息，
請參閱[節點資源管理](/zh-cn/docs/concepts/policy/node-resource-managers)文檔。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
If you are running an older version of Kubernetes, please look at the documentation for the version you are actually running.
-->
如果你正在運行一箇舊版本的 Kubernetes，請參閱與該版本對應的文檔。

<!-- steps -->

<!--
## Configuring CPU management policies

By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods,
the workload can move to different CPU cores depending on
whether the pod is throttled and which CPU cores are available at
scheduling time. Many workloads are not sensitive to this migration and thus
work fine without any intervention.
-->
## 設定 CPU 管理策略   {#cpu-management-policies}

默認情況下，kubelet 使用 [CFS 配額](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
來執行 Pod 的 CPU 約束。
當節點上運行了很多 CPU 密集的 Pod 時，工作負載可能會遷移到不同的 CPU 核，
這取決於調度時 Pod 是否被扼制，以及哪些 CPU 核是可用的。
許多工作負載對這種遷移不敏感，因此無需任何干預即可正常工作。

<!--
However, in workloads where CPU cache affinity and scheduling latency
significantly affect workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.
-->
然而，有些工作負載的性能明顯地受到 CPU 緩存親和性以及調度延遲的影響。
對此，kubelet 提供了可選的 CPU 管理策略，來確定節點上的一些分配偏好。

<!--
## Windows Support

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

CPU Manager support can be enabled on Windows by using the `WindowsCPUAndMemoryAffinity` feature gate
and it requires support in the container runtime.
Once the feature gate is enabled, follow the steps below to configure the [CPU manager policy](#configuration).
-->
## Windows 支持

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

可以通過使用 "WindowsCPUAndMemoryAffinity" 特性門控在 Windows 上啓用 CPU 管理器支持。
這個能力還需要容器運行時的支持。

<!--
## Configuration

The CPU Manager policy is set with the `--cpu-manager-policy` kubelet
flag or the `cpuManagerPolicy` field in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).
There are two supported policies:
-->
## 設定   {#configuration}

CPU 管理策略通過 kubelet 參數 `--cpu-manager-policy`
或 [KubeletConfiguration](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
中的 `cpuManagerPolicy` 字段來指定。
支持兩種策略：

<!--
* [`none`](#none-policy): the default policy.
* [`static`](#static-policy): allows pods with certain resource characteristics to be
  granted increased CPU affinity and exclusivity on the node.
-->
* [`none`](#none-policy)：默認策略。
* [`static`](#static-policy)：允許爲節點上具有某些資源特徵的 Pod 賦予增強的 CPU 親和性和獨佔性。

<!--
The CPU manager periodically writes resource updates through the CRI in
order to reconcile in-memory CPU assignments with cgroupfs. The reconcile
frequency is set through a new Kubelet configuration value
`--cpu-manager-reconcile-period`. If not specified, it defaults to the same
duration as `--node-status-update-frequency`.
-->
CPU 管理器定期通過 CRI 寫入資源更新，以保證內存中 CPU 分配與 cgroupfs 一致。
同步頻率通過新增的 Kubelet 設定參數 `--cpu-manager-reconcile-period` 來設置。
如果不指定，默認與 `--node-status-update-frequency` 的週期相同。

<!--
The behavior of the static policy can be fine-tuned using the `--cpu-manager-policy-options` flag.
The flag takes a comma-separated list of `key=value` policy options.
If you disable the `CPUManagerPolicyOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
then you cannot fine-tune CPU manager policies. In that case, the CPU manager
operates only using its default settings.
-->
Static 策略的行爲可以使用 `--cpu-manager-policy-options` 參數來微調。
該參數採用一個逗號分隔的 `key=value` 策略選項列表。
如果你禁用 `CPUManagerPolicyOptions`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
則你不能微調 CPU 管理器策略。這種情況下，CPU 管理器僅使用其默認設置運行。

<!--
In addition to the top-level `CPUManagerPolicyOptions` feature gate, the policy options are split
into two groups: alpha quality (hidden by default) and beta quality (visible by default).
The groups are guarded respectively by the `CPUManagerPolicyAlphaOptions`
and `CPUManagerPolicyBetaOptions` feature gates. Diverging from the Kubernetes standard, these
feature gates guard groups of options, because it would have been too cumbersome to add a feature
gate for each individual option.
-->
除了頂級的 `CPUManagerPolicyOptions` 特性門控，
策略選項分爲兩組：Alpha 質量（默認隱藏）和 Beta 質量（默認可見）。
這些組分別由 `CPUManagerPolicyAlphaOptions` 和 `CPUManagerPolicyBetaOptions` 特性門控來管控。
不同於 Kubernetes 標準，這裏是由這些特性門控來管控選項組，因爲爲每個單獨選項都添加一個特性門控過於繁瑣。

<!--
## Changing the CPU Manager Policy

Since the CPU manager policy can only be applied when kubelet spawns new pods, simply changing from
"none" to "static" won't apply to existing pods. So in order to properly change the CPU manager
policy on a node, perform the following steps:
-->
## 更改 CPU 管理器策略   {#changing-the-cpu-manager-policy}

由於 CPU 管理器策略只能在 kubelet 生成新 Pod 時應用，所以簡單地從 "none" 更改爲 "static"
將不會對現有的 Pod 起作用。
因此，爲了正確更改節點上的 CPU 管理器策略，請執行以下步驟：

<!--
1. [Drain](/docs/tasks/administer-cluster/safely-drain-node) the node.
2. Stop kubelet.
3. Remove the old CPU manager state file. The path to this file is
`/var/lib/kubelet/cpu_manager_state` by default. This clears the state maintained by the
CPUManager so that the cpu-sets set up by the new policy won’t conflict with it.
4. Edit the kubelet configuration to change the CPU manager policy to the desired value.
5. Start kubelet.
-->
1. [騰空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node)節點。
2. 停止 kubelet。
3. 刪除舊的 CPU 管理器狀態文件。該文件的路徑默認爲 `/var/lib/kubelet/cpu_manager_state`。
   這將清除 CPUManager 維護的狀態，以便新策略設置的 cpu-sets 不會與之衝突。
4. 編輯 kubelet 設定以將 CPU 管理器策略更改爲所需的值。
5. 啓動 kubelet。

<!--
Repeat this process for every node that needs its CPU manager policy changed. Skipping this
process will result in kubelet crashlooping with the following error:
-->
對需要更改其 CPU 管理器策略的每個節點重複此過程。
跳過此過程將導致 kubelet crashlooping 並出現以下錯誤：

```
could not restore state from checkpoint: configured policy "static" differs from state checkpoint policy "none", please drain this node and delete the CPU manager checkpoint file "/var/lib/kubelet/cpu_manager_state" before restarting Kubelet
```

{{< note >}}
<!--
if the set of online CPUs changes on the node, the node must be drained and CPU manager manually reset by deleting the
state file `cpu_manager_state` in the kubelet root directory.
-->
如果節點上的在線 CPU 集發生變化，則必須騰空該節點，並通過刪除 kubelet
根目錄中的狀態文件 `cpu_manager_state` 來手動重置 CPU 管理器。
{{< /note >}}

<!--
### `none` policy configuration

This policy has no extra configuration items.
-->
### `none` 策略設定

該策略沒有額外的設定項。

<!--
### `static` policy configuration

This policy manages a shared pool of CPUs that initially contains all CPUs in the
node. The amount of exclusively allocatable CPUs is equal to the total
number of CPUs in the node minus any CPU reservations by the kubelet `--kube-reserved` or
`--system-reserved` options. From 1.17, the CPU reservation list can be specified
explicitly by kubelet `--reserved-cpus` option. The explicit CPU list specified by
`--reserved-cpus` takes precedence over the CPU reservation specified by
`--kube-reserved` and `--system-reserved`. CPUs reserved by these options are taken, in
integer quantity, from the initial shared pool in ascending order by physical
core ID.  This shared pool is the set of CPUs on which any containers in
`BestEffort` and `Burstable` pods run. Containers in `Guaranteed` pods with fractional
CPU `requests` also run on CPUs in the shared pool. Only containers that are
both part of a `Guaranteed` pod and have integer CPU `requests` are assigned
exclusive CPUs.
--->
### `static` 策略設定

此策略管理一個 CPU 共享池，該共享池最初包含節點上所有的 CPU 資源。
可獨佔性 CPU 資源數量等於節點的 CPU 總量減去通過 kubelet `--kube-reserved` 或 `--system-reserved`
參數保留的 CPU 資源。
從 1.17 版本開始，可以通過 kubelet `--reserved-cpus` 參數顯式地指定 CPU 預留列表。
由 `--reserved-cpus` 指定的顯式 CPU 列表優先於由 `--kube-reserved` 和 `--system-reserved`
指定的 CPU 預留。
通過這些參數預留的 CPU 是以整數方式，按物理核心 ID 升序從初始共享池獲取的。
共享池是 `BestEffort` 和 `Burstable` Pod 運行的 CPU 集合。
`Guaranteed` Pod 中的容器，如果聲明瞭非整數值的 CPU `requests`，也將運行在共享池的 CPU 上。
只有 `Guaranteed` Pod 中，指定了整數型 CPU `requests` 的容器，纔會被分配獨佔 CPU 資源。

{{< note >}}
<!--
The kubelet requires a CPU reservation greater than zero be made
using either `--kube-reserved` and/or `--system-reserved` or `--reserved-cpus` when
the static policy is enabled. This is because zero CPU reservation would allow the shared
pool to become empty.
--->
當啓用 static 策略時，要求使用 `--kube-reserved` 和/或 `--system-reserved` 或
`--reserved-cpus` 來保證預留的 CPU 值大於零。
這是因爲零預留 CPU 值可能使得共享池變空。
{{< /note >}}

<!--
### Static policy options {#cpu-policy-static--options}

You can toggle groups of options on and off based upon their maturity level
using the following feature gates:
* `CPUManagerPolicyBetaOptions` default enabled. Disable to hide beta-level options.
* `CPUManagerPolicyAlphaOptions` default disabled. Enable to show alpha-level options.
You will still have to enable each option using the `CPUManagerPolicyOptions` kubelet option.

The following policy options exist for the static `CPUManager` policy:
* `full-pcpus-only` (GA, visible by default) (1.33 or higher)
* `distribute-cpus-across-numa` (beta, visible by default) (1.33 or higher)
* `align-by-socket` (alpha, hidden by default) (1.25 or higher)
* `distribute-cpus-across-cores` (alpha, hidden by default) (1.31 or higher)
* `strict-cpu-reservation` (beta, visible by default) (1.32 or higher)
* `prefer-align-cpus-by-uncorecache` (beta, visible by default) (1.34 or higher)
-->
### Static 策略選項  {#cpu-policy-static--options}

你可以使用以下特性門控根據成熟度級別打開或關閉選項組：
* `CPUManagerPolicyBetaOptions` 默認啓用。禁用以隱藏 beta 級選項。
* `CPUManagerPolicyAlphaOptions` 默認禁用。啓用以顯示 alpha 級選項。
你仍然必須使用 `CPUManagerPolicyOptions` kubelet 選項啓用每個選項。

靜態 `CPUManager` 策略存在以下策略選項：
* `full-pcpus-only`（GA，默認可見）（1.33 或更高版本）
* `distribute-cpus-across-numa`（Beta，默認可見）（1.33 或更高版本）
* `align-by-socket`（Alpha，默認隱藏）（1.25 或更高版本）
* `distribute-cpus-across-cores` (Alpha，默認隱藏) (1.31 或更高版本)
* `strict-cpu-reservation` (Beta，默認可見) (1.32 或更高版本)
* `prefer-align-cpus-by-uncorecache` (Beta, 默認可見) (1.34 或更高版本)

<!--
The `full-pcpus-only` option can be enabled by adding `full-pcpus-only=true` to
the CPUManager policy options.
Likewise, the `distribute-cpus-across-numa` option can be enabled by adding
`distribute-cpus-across-numa=true` to the CPUManager policy options.
When both are set, they are "additive" in the sense that CPUs will be
distributed across NUMA nodes in chunks of full-pcpus rather than individual
cores.
The `align-by-socket` policy option can be enabled by adding `align-by-socket=true`
to the `CPUManager` policy options. It is also additive to the `full-pcpus-only`
and `distribute-cpus-across-numa` policy options.
-->
可以通過將 `full-pcpus-only=true` 添加到 CPUManager 策略選項來啓用 `full-pcpus-only` 選項。
同樣地，可以通過將 `distribute-cpus-across-numa=true` 添加到 CPUManager 策略選項來啓用 `distribute-cpus-across-numa` 選項。
當兩者都設置時，它們是“累加的”，因爲 CPU 將分佈在 NUMA 節點的 full-pcpus 塊中，而不是單個核心。
可以通過將 `align-by-socket=true` 添加到 `CPUManager` 策略選項來啓用 `align-by-socket` 策略選項。
同樣，也能夠將 `distribute-cpus-across-numa=true` 添加到 `full-pcpus-only`
和 `distribute-cpus-across-numa` 策略選項中。

<!--
The `distribute-cpus-across-cores` option can be enabled by adding
`distribute-cpus-across-cores=true` to the `CPUManager` policy options.
It cannot be used with `full-pcpus-only` or `distribute-cpus-across-numa` policy
options together at this moment.
-->
可以通過將 `distribute-cpus-across-cores=true` 添加到 `CPUManager` 策略選項中來啓用 `distribute-cpus-across-cores` 選項。
當前，該選項不能與 `full-pcpus-only` 或 `distribute-cpus-across-numa` 策略選項同時使用。

<!--
The `strict-cpu-reservation` option can be enabled by adding `strict-cpu-reservation=true` to
the CPUManager policy options followed by removing the `/var/lib/kubelet/cpu_manager_state` file and restart kubelet.

The `prefer-align-cpus-by-uncorecache` option can be enabled by adding the
`prefer-align-cpus-by-uncorecache` to the `CPUManager` policy options. If 
incompatible options are used, the kubelet will fail to start with the error 
explained in the logs.

For mode detail about the behavior of the individual options you can configure, please refer to the
[Node ResourceManagers](/docs/concepts/policy/node-resource-managers) documentation.
-->
可以通過將 `strict-cpu-reservation=true` 添加到 CPUManager 策略選項中，
然後刪除 `/var/lib/kubelet/cpu_manager_state` 文件並重新啓動 kubelet
來啓用 `strict-cpu-reservation` 選項。

可以通過將 `prefer-align-cpus-by-uncorecache` 添加到 `CPUManager` 策略選項來啓用
`prefer-align-cpus-by-uncorecache` 選項。
如果使用不兼容的選項，kubelet 將無法啓動，並在日誌中解釋所出現的錯誤。

有關你可以設定的各個選項的行爲的模式詳細信息，請參閱[節點資源管理](/zh-cn/docs/concepts/policy/node-resource-managers)文檔。
