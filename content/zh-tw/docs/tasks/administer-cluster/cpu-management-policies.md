---
title: 控制節點上的 CPU 管理策略
content_type: task
---
<!--
title: Control CPU Management Policies on the Node
reviewers:
- sjenning
- ConnorDoyle
- balajismaniam
content_type: task
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.12" state="beta" >}}

<!--
Kubernetes keeps many aspects of how pods execute on nodes abstracted
from the user. This is by design.  However, some workloads require
stronger guarantees in terms of latency and/or performance in order to operate
acceptably. The kubelet provides methods to enable more complex workload
placement policies while keeping the abstraction free from explicit placement
directives.
-->
按照設計，Kubernetes 對 Pod 執行相關的很多方面進行了抽象，使得使用者不必關心。
然而，為了正常執行，有些工作負載要求在延遲和/或效能方面有更強的保證。
為此，kubelet 提供方法來實現更復雜的負載放置策略，同時保持抽象，避免顯式的放置指令。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## CPU Management Policies

By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods,
the workload can move to different CPU cores depending on
whether the pod is throttled and which CPU cores are available at
scheduling time.  Many workloads are not sensitive to this migration and thus
work fine without any intervention.
-->
## CPU 管理策略

預設情況下，kubelet 使用 [CFS 配額](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
來執行 Pod 的 CPU 約束。
當節點上運行了很多 CPU 密集的 Pod 時，工作負載可能會遷移到不同的 CPU 核，
這取決於排程時 Pod 是否被扼制，以及哪些 CPU 核是可用的。
許多工作負載對這種遷移不敏感，因此無需任何干預即可正常工作。

<!--
However, in workloads where CPU cache affinity and scheduling latency
significantly affect workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.
-->
然而，有些工作負載的效能明顯地受到 CPU 快取親和性以及排程延遲的影響。
對此，kubelet 提供了可選的 CPU 管理策略，來確定節點上的一些分配偏好。

<!--
### Configuration

The CPU Manager policy is set with the `--cpu-manager-policy` kubelet
flag or the `cpuManagerPolicy` field in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).
There are two supported policies:
-->
### 配置

CPU 管理策略透過 kubelet 引數 `--cpu-manager-policy`
或 [KubeletConfiguration](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
中的 `cpuManagerPolicy` 欄位來指定。
支援兩種策略：

<!--
* `none`: the default, which represents the existing scheduling behavior.
* `static`: allows pods with certain resource characteristics to be
  granted increased CPU affinity and exclusivity on the node.
-->
* `none`: 預設策略，表示現有的排程行為。
* `static`: 允許為節點上具有某些資源特徵的 Pod 賦予增強的 CPU 親和性和獨佔性。

<!--
The CPU manager periodically writes resource updates through the CRI in
order to reconcile in-memory CPU assignments with cgroupfs. The reconcile
frequency is set through a new Kubelet configuration value
`-cpu-manager-reconcile-period`. If not specified, it defaults to the same
duration as `-node-status-update-frequency`.
-->
CPU 管理器定期透過 CRI 寫入資源更新，以保證記憶體中 CPU 分配與 cgroupfs 一致。
同步頻率透過新增的 Kubelet 配置引數 `--cpu-manager-reconcile-period` 來設定。
如果不指定，預設與 `--node-status-update-frequency` 的週期相同。

<!--
The behavior of the static policy can be fine-tuned using the `--cpu-manager-policy-options` flag.
The flag takes a comma-separated list of `key=value` policy options.
This feature can be disabled completely using the `CPUManagerPolicyOptions` feature gate.
-->
Static 策略的行為可以使用 `--cpu-manager-policy-options` 引數來微調。
該引數採用一個逗號分隔的 `key=value` 策略選項列表。
此特性可以透過 `CPUManagerPolicyOptions` 特性門控來完全禁用。

<!--
The policy options are split into two groups: alpha quality (hidden by default) and beta quality
(visible by default). The groups are guarded respectively by the `CPUManagerPolicyAlphaOptions`
and `CPUManagerPolicyBetaOptions` feature gates. Diverging from the Kubernetes standard, these
feature gates guard groups of options, because it would have been too cumbersome to add a feature
gate for each individual option.
-->
策略選項分為兩組：alpha 質量（預設隱藏）和 beta 質量（預設可見）。
這些組分別由 `CPUManagerPolicyAlphaOptions` 和 `CPUManagerPolicyBetaOptions` 特性門控來管控。
不同於 Kubernetes 標準，這裡是由這些特性門控來管控選項組，因為為每個單獨選項都新增一個特性門控過於繁瑣。

<!--
### Changing the CPU Manager Policy

Since the CPU manger policy can only be applied when kubelet spawns new pods, simply changing from
"none" to "static" won't apply to existing pods. So in order to properly change the CPU manager
policy on a node, perform the following steps:
-->
### 更改 CPU 管理器策略

由於 CPU 管理器策略只能在 kubelet 生成新 Pod 時應用，所以簡單地從 "none" 更改為 "static"
將不會對現有的 Pod 起作用。
因此，為了正確更改節點上的 CPU 管理器策略，請執行以下步驟：

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
3. 刪除舊的 CPU 管理器狀態檔案。該檔案的路徑預設為 `/var/lib/kubelet/cpu_manager_state`。
   這將清除 CPUManager 維護的狀態，以便新策略設定的 cpu-sets 不會與之衝突。
4. 編輯 kubelet 配置以將 CPU 管理器策略更改為所需的值。
5. 啟動 kubelet。

<!--
Repeat this process for every node that needs its CPU manager policy changed. Skipping this
process will result in kubelet crashlooping with the following error:

```
could not restore state from checkpoint: configured policy "static" differs from state checkpoint policy "none", please drain this node and delete the CPU manager checkpoint file "/var/lib/kubelet/cpu_manager_state" before restarting Kubelet
```
-->
對需要更改其 CPU 管理器策略的每個節點重複此過程。
跳過此過程將導致 kubelet crashlooping 並出現以下錯誤：

```
could not restore state from checkpoint: configured policy "static" differs from state checkpoint policy "none", please drain this node and delete the CPU manager checkpoint file "/var/lib/kubelet/cpu_manager_state" before restarting Kubelet
```

<!--
### None policy

The `none` policy explicitly enables the existing default CPU
affinity scheme, providing no affinity beyond what the OS scheduler does
automatically.  Limits on CPU usage for
[Guaranteed pods](/docs/tasks/configure-pod-container/quality-service-pod/) and
[Burstable pods](/docs/tasks/configure-pod-container/quality-service-pod/)
are enforced using CFS quota.
-->
### none 策略

`none` 策略顯式地啟用現有的預設 CPU 親和方案，不提供作業系統排程器預設行為之外的親和性策略。
透過 CFS 配額來實現 [Guaranteed Pods](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
和 [Burstable Pods](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
的 CPU 使用限制。

<!--
### Static policy

The `static` policy allows containers in `Guaranteed` pods with integer CPU
`requests` access to exclusive CPUs on the node. This exclusivity is enforced
using the [cpuset cgroup controller](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt).
-->
### static 策略

`static` 策略針對具有整數型 CPU `requests` 的 `Guaranteed` Pod ，它允許該類 Pod
中的容器訪問節點上的獨佔 CPU 資源。這種獨佔性是使用
[cpuset cgroup 控制器](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt) 來實現的。

<!--
System services such as the container runtime and the kubelet itself can continue to run on these exclusive CPUs.  The exclusivity only extends to other pods.
-->
{{< note >}}
諸如容器執行時和 kubelet 本身的系統服務可以繼續在這些獨佔 CPU 上執行。獨佔性僅針對其他 Pod。
{{< /note >}}

<!--
CPU Manager doesn't support offlining and onlining of
CPUs at runtime. Also, if the set of online CPUs changes on the node,
the node must be drained and CPU manager manually reset by deleting the
state file `cpu_manager_state` in the kubelet root directory.
-->
{{< note >}}
CPU 管理器不支援執行時下線和上線 CPUs。此外，如果節點上的線上 CPUs 集合發生變化，
則必須驅逐節點上的 Pod，並透過刪除 kubelet 根目錄中的狀態檔案 `cpu_manager_state`
來手動重置 CPU 管理器。
{{< /note >}}

<!--
This policy manages a shared pool of CPUs that initially contains all CPUs in the
node. The amount of exclusively allocatable CPUs is equal to the total
number of CPUs in the node minus any CPU reservations by the kubelet `--kube-reserved` or
`--system-reserved` options. From 1.17, the CPU reservation list can be specified
explicitly by kubelet `--reserved-cpus` option. The explicit CPU list specified by
`--reserved-cpus` takes precedence over the CPU reservation specified by
`--kube-reserved` and `--system-reserved`. CPUs reserved by these options are taken, in
integer quantity, from the initial shared pool in ascending order by physical
core ID.  This shared pool is the set of CPUs on which any containers in
`BestEffort` and `Burstable` pods run. Containers in `Guaranteed` pods with fractional
CPU `requests` also run on CPUs in the shared pool. Only containers that are
both part of a `Guaranteed` pod and have integer CPU `requests` are assigned
exclusive CPUs.
--->
此策略管理一個 CPU 共享池，該共享池最初包含節點上所有的 CPU 資源。
可獨佔性 CPU 資源數量等於節點的 CPU 總量減去透過 kubelet `--kube-reserved` 或 `--system-reserved`
引數保留的 CPU 資源。
從 1.17 版本開始，可以透過 kubelet `--reserved-cpus` 引數顯式地指定 CPU 預留列表。
由 `--reserved-cpus` 指定的顯式 CPU 列表優先於由 `--kube-reserved` 和 `--system-reserved`
指定的 CPU 預留。
透過這些引數預留的 CPU 是以整數方式，按物理核心 ID 升序從初始共享池獲取的。
共享池是 `BestEffort` 和 `Burstable` Pod 執行的 CPU 集合。
`Guaranteed` Pod 中的容器，如果聲明瞭非整數值的 CPU `requests`，也將執行在共享池的 CPU 上。
只有 `Guaranteed` Pod 中，指定了整數型 CPU `requests` 的容器，才會被分配獨佔 CPU 資源。

<!--
The kubelet requires a CPU reservation greater than zero be made
using either `--kube-reserved` and/or `--system-reserved`  or `--reserved-cpus` when the static
policy is enabled. This is because zero CPU reservation would allow the shared
pool to become empty.
--->
{{< note >}}
當啟用 static 策略時，要求使用 `--kube-reserved` 和/或 `--system-reserved` 或
`--reserved-cpus` 來保證預留的 CPU 值大於零。
這是因為零預留 CPU 值可能使得共享池變空。
{{< /note >}}

<!--
As `Guaranteed` pods whose containers fit the requirements for being statically
assigned are scheduled to the node, CPUs are removed from the shared pool and
placed in the cpuset for the container. CFS quota is not used to bound
the CPU usage of these containers as their usage is bound by the scheduling domain
itself. In others words, the number of CPUs in the container cpuset is equal to the integer
CPU `limit` specified in the pod spec. This static assignment increases CPU
affinity and decreases context switches due to throttling for the CPU-bound
workload.

Consider the containers in the following pod specs:
-->
當 `Guaranteed` Pod 排程到節點上時，如果其容器符合靜態分配要求，
相應的 CPU 會被從共享池中移除，並放置到容器的 cpuset 中。
因為這些容器所使用的 CPU 受到排程域本身的限制，所以不需要使用 CFS 配額來進行 CPU 的繫結。
換言之，容器 cpuset  中的 CPU 數量與 Pod 規約中指定的整數型 CPU `limit` 相等。
這種靜態分配增強了 CPU 親和性，減少了 CPU 密集的工作負載在節流時引起的上下文切換。

考慮以下 Pod 規格的容器：

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
```

<!--
This pod runs in the `BestEffort` QoS class because no resource `requests` or
`limits` are specified. It runs in the shared pool.
-->
該 Pod 屬於 `BestEffort` QoS 型別，因為其未指定 `requests` 或 `limits` 值。
所以該容器執行在共享 CPU 池中。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
      requests:
        memory: "100Mi"
```

<!--
This pod runs in the `Burstable` QoS class because resource `requests` do not
equal `limits` and the `cpu` quantity is not specified. It runs in the shared
pool.
-->
該 Pod 屬於 `Burstable` QoS 型別，因為其資源 `requests` 不等於 `limits`，且未指定 `cpu` 數量。
所以該容器執行在共享 CPU 池中。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
      requests:
        memory: "100Mi"
        cpu: "1"
```

<!--
This pod runs in the `Burstable` QoS class because resource `requests` do not
equal `limits`. It runs in the shared pool.
-->
該 Pod 屬於 `Burstable` QoS 型別，因為其資源 `requests` 不等於 `limits`。
所以該容器執行在共享 CPU 池中。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
      requests:
        memory: "200Mi"
        cpu: "2"
```

<!--
This pod runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
And the container's resource limit for the CPU resource is an integer greater than
or equal to one. The `nginx` container is granted 2 exclusive CPUs.
-->
該 Pod 屬於 `Guaranteed` QoS 型別，因為其 `requests` 值與 `limits`相等。
同時，容器對 CPU 資源的限制值是一個大於或等於 1 的整數值。
所以，該 `nginx` 容器被賦予 2 個獨佔 CPU。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "1.5"
      requests:
        memory: "200Mi"
        cpu: "1.5"
```

<!--
This pod runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
But the container's resource limit for the CPU resource is a fraction. It runs in
the shared pool.
-->
該 Pod 屬於 `Guaranteed` QoS 型別，因為其 `requests` 值與 `limits`相等。
但是容器對 CPU 資源的限制值是一個小數。所以該容器執行在共享 CPU 池中。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
```

<!--
This pod runs in the `Guaranteed` QoS class because only `limits` are specified
and `requests` are set equal to `limits` when not explicitly specified. And the
container's resource limit for the CPU resource is an integer greater than or
equal to one. The `nginx` container is granted 2 exclusive CPUs.
-->
該 Pod 屬於 `Guaranteed` QoS 型別，因其指定了 `limits` 值，同時當未顯式指定時，
`requests` 值被設定為與 `limits` 值相等。
同時，容器對 CPU 資源的限制值是一個大於或等於 1 的整數值。
所以，該 `nginx` 容器被賦予 2 個獨佔 CPU。

<!--
#### Static policy options

You can toggle groups of options on and off based upon their maturity level
using the following feature gates:
* `CPUManagerPolicyBetaOptions` default enabled. Disable to hide beta-level options.
* `CPUManagerPolicyAlphaOptions` default disabled. Enable to show alpha-level options.
You will still have to enable each option using the `CPUManagerPolicyOptions` kubelet option.

The following policy options exist for the static `CPUManager` policy:
* `full-pcpus-only` (beta, visible by default)
* `distribute-cpus-across-numa` (alpha, hidden by default)
-->
#### Static 策略選項

你可以使用以下特性門控根據成熟度級別開啟或關閉選項組：
* `CPUManagerPolicyBetaOptions` 預設啟用。禁用以隱藏 beta 級選項。
* `CPUManagerPolicyAlphaOptions` 預設禁用。啟用以顯示 alpha 級選項。
你仍然必須使用 `CPUManagerPolicyOptions` kubelet 選項啟用每個選項。

靜態 `CPUManager` 策略存在以下策略選項：
* `full-pcpus-only`（beta，預設可見）
* `distribute-cpus-across-numa`（alpha，預設隱藏）

<!--
If the `full-pcpus-only` policy option is specified, the static policy will always allocate full physical cores.
By default, without this option, the static policy allocates CPUs using a topology-aware best-fit allocation.
On SMT enabled systems, the policy can allocate individual virtual cores, which correspond to hardware threads.
This can lead to different containers sharing the same physical cores; this behaviour in turn contributes
to the [noisy neighbours problem](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).
-->
如果使用 `full-pcpus-only` 策略選項，static 策略總是會分配完整的物理核心。
預設情況下，如果不使用該選項，static 策略會使用拓撲感知最適合的分配方法來分配 CPU。
在啟用了 SMT 的系統上，此策略所分配是與硬體執行緒對應的、獨立的虛擬核。
這會導致不同的容器共享相同的物理核心，該行為進而會導致
[吵鬧的鄰居問題](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors)。
<!--
With the option enabled, the pod will be admitted by the kubelet only if the CPU request of all its containers
can be fulfilled by allocating full physical cores.
If the pod does not pass the admission, it will be put in Failed state with the message `SMTAlignmentError`.
-->
啟用該選項之後，只有當一個 Pod 裡所有容器的 CPU 請求都能夠分配到完整的物理核心時，
kubelet 才會接受該 Pod。
如果 Pod 沒有被准入，它會被置於 Failed 狀態，錯誤訊息是 `SMTAlignmentError`。

<!--
If the `distribute-cpus-across-numa` policy option is specified, the static
policy will evenly distribute CPUs across NUMA nodes in cases where more than
one NUMA node is required to satisfy the allocation.
By default, the `CPUManager` will pack CPUs onto one NUMA node until it is
filled, with any remaining CPUs simply spilling over to the next NUMA node.
This can cause undesired bottlenecks in parallel code relying on barriers (and
similar synchronization primitives), as this type of code tends to run only as
fast as its slowest worker (which is slowed down by the fact that fewer CPUs
are available on at least one NUMA node).
By distributing CPUs evenly across NUMA nodes, application developers can more
easily ensure that no single worker suffers from NUMA effects more than any
other, improving the overall performance of these types of applications.
-->
如果使用 `distribute-cpus-across-numa` 策略選項，
在需要多個 NUMA 節點來滿足分配的情況下，
static 策略會在 NUMA 節點上平均分配 CPU。
預設情況下，`CPUManager` 會將 CPU 分配到一個 NUMA 節點上，直到它被填滿，
剩餘的 CPU 會簡單地溢位到下一個 NUMA 節點。
這會導致依賴於同步屏障（以及類似的同步原語）的並行程式碼出現不期望的瓶頸，
因為此類程式碼的執行速度往往取決於最慢的工作執行緒
（由於至少一個 NUMA 節點存在可用 CPU 較少的情況，因此速度變慢）。
透過在 NUMA 節點上平均分配 CPU，
應用程式開發人員可以更輕鬆地確保沒有某個工作執行緒單獨受到 NUMA 影響，
從而提高這些型別應用程式的整體效能。

<!--
The `full-pcpus-only` option can be enabled by adding `full-pcups-only=true` to
the CPUManager policy options.
Likewise, the `distribute-cpus-across-numa` option can be enabled by adding
`distribute-cpus-across-numa=true` to the CPUManager policy options.
When both are set, they are "additive" in the sense that CPUs will be
distributed across NUMA nodes in chunks of full-pcpus rather than individual
cores.
-->
可以透過將 `full-pcups-only=true` 新增到 CPUManager 策略選項來啟用 `full-pcpus-only` 選項。
同樣地，可以透過將 `distribute-cpus-across-numa=true`
新增到 CPUManager 策略選項來啟用 `distribute-cpus-across-numa` 選項。
當兩者都設定時，它們是“累加的”，因為 CPU 將分佈在 NUMA 節點的 full-pcpus 塊中，
而不是單個核心。
