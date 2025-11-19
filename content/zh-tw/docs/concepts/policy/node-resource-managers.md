---
title: 節點資源管理器
content_type: concept
weight: 50
---
<!-- 
reviewers:
- derekwaynecarr
- klueska
title: Node Resource Managers 
content_type: concept
weight: 50
-->

<!-- overview -->

<!-- 
In order to support latency-critical and high-throughput workloads, Kubernetes offers a suite of
Resource Managers. The managers aim to co-ordinate and optimise the alignment of node's resources for pods
configured with a specific requirement for CPUs, devices, and memory (hugepages) resources.
-->
Kubernetes 提供了一組資源管理器，用於支持延遲敏感的、高吞吐量的工作負載。
資源管理器的目標是協調和優化節點資源，以支持對 CPU、設備和內存（巨頁）等資源有特殊需求的 Pod。

<!-- body -->

<!-- 
## Hardware topology alignment policies
-->
## 硬件拓撲對齊策略   {#hardware-topology-alignment-policies}

<!--
_Topology Manager_ is a kubelet component that aims to coordinate the set of components that are
responsible for these optimizations. The overall resource management process is governed using
the policy you specify. To learn more, read
[Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/).
-->
**拓撲管理器（Topology Manager）**是一個 kubelet 組件，旨在協調負責這些優化的組件集。
整體資源管理過程通過你指定的策略進行管理。
要了解更多信息，請閱讀[控制節點上的拓撲管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。

<!-- 
## Policies for assigning CPUs to Pods
-->
## 爲 Pod 分配 CPU 的策略   {#policies-for-assigning-cpus-to-pods}

{{< feature-state feature_gate_name="CPUManager" >}}

<!-- 
Once a Pod is bound to a Node, the kubelet on that node may need to either multiplex the existing
hardware (for example, sharing CPUs across multiple Pods) or allocate hardware by dedicating some
resource (for example, assigning one of more CPUs for a Pod's exclusive use).
-->
一旦 Pod 綁定到節點，該節點上的 kubelet 可能需要多路複用現有硬件（例如，在多個 Pod 之間共享 CPU），
或者通過專門劃分一些資源來分配硬件（例如，爲 Pod 獨佔使用分配一個或多個 CPU）。

<!-- 
By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods, the workload can move to
different CPU cores depending on whether the pod is throttled and which CPU cores are available
at scheduling time. Many workloads are not sensitive to this migration and thus
work fine without any intervention.
-->
默認情況下，kubelet 使用 [CFS 配額](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
來強制執行 Pod 的 CPU 限制。當節點運行許多 CPU 密集型 Pod 時，工作負載可能會移動到不同的 CPU 核，
具體取決於 Pod 執行是否受到抑制以及調度時刻哪些 CPU 核可用。
許多工作負載對這種遷移不敏感，因此無需任何干預即可正常工作。

<!--
However, in workloads where CPU cache affinity and scheduling latency significantly affect
workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.
This is implemented using the _CPU Manager_ and its policy.
There are two available policies:
-->
但是，對於某些工作負載而言，CPU 緩存親和性和調度延遲會顯著影響其性能；針對這些工作負載，
kubelet 允許使用不同的 CPU 管理策略來確定節點上的一些放置偏好。
這是使用 **CPU 管理器（CPU Manager）** 及其策略實現的。
有兩種可用的策略：

<!--
- `none`: the `none` policy explicitly enables the existing default CPU
  affinity scheme, providing no affinity beyond what the OS scheduler does
  automatically.  Limits on CPU usage for
  [Guaranteed pods](/docs/concepts/workloads/pods/pod-qos/) and
  [Burstable pods](/docs/concepts/workloads/pods/pod-qos/)
  are enforced using CFS quota.
-->
- `none`：`none` 策略顯式啓用現有的默認 CPU 親和性方案，除了操作系統調度器自動執行的操作外，不提供任何親和性。
  使用 CFS 配額強制爲 [Guaranteed Pod](/zh-cn/docs/concepts/workloads/pods/pod-qos/) 
  和 [Burstable Pod](/zh-cn/docs/concepts/workloads/pods/pod-qos/) 實施 CPU 使用限制。

<!--
- `static`: the `static` policy allows containers in `Guaranteed` pods with integer CPU
  `requests` access to exclusive CPUs on the node. This exclusivity is enforced
  using the [cpuset cgroup controller](https://www.kernel.org/doc/Documentation/cgroup-v2.txt).
-->
- `static`：`static` 策略允許具有整數 CPU `requests` 的 `Guaranteed` Pod 中的容器訪問節點上的獨佔 CPU。
  這種獨佔性是使用 [cpuset cgroup 控制器](https://www.kernel.org/doc/Documentation/cgroup-v2.txt)
  來強制保證的。

{{< note >}}
<!--
System services such as the container runtime and the kubelet itself can continue to run on these exclusive CPUs.  The System services such as the container runtime and the kubelet itself can continue to run on
these exclusive CPUs.  The exclusivity only extends to other pods.
-->
諸如容器運行時和 kubelet 本身之類的系統服務可以繼續在這些獨佔 CPU 上運行。
獨佔性僅針對其他 Pod。
{{< /note >}}

<!--
CPU Manager doesn't support offlining and onlining of CPUs at runtime.
-->
CPU 管理器不支持在運行時熱插拔 CPU。

<!--
### Static policy
-->
### 靜態策略  {#static-policy}

<!--
The static policy enables finer-grained CPU management and exclusive CPU assignment.
This policy manages a shared pool of CPUs that initially contains all CPUs in the
node. The amount of exclusively allocatable CPUs is equal to the total
number of CPUs in the node minus any CPU reservations set by the kubelet configuration.
CPUs reserved by these options are taken, in integer quantity, from the initial shared pool in ascending order by physical
core ID.  This shared pool is the set of CPUs on which any containers in
`BestEffort` and `Burstable` pods run. Containers in `Guaranteed` pods with fractional
CPU `requests` also run on CPUs in the shared pool. Only containers that are
part of a `Guaranteed` pod and have integer CPU `requests` are assigned
exclusive CPUs.
-->
靜態策略可實現更精細的 CPU 管理和獨佔性的 CPU 分配。
此策略管理一個共享 CPU 池，該池最初包含節點中的所有 CPU。
可獨佔分配的 CPU 數量等於節點中的 CPU 總數減去 kubelet 配置所設置的所有預留 CPU。
kubelet 選項所預留的 CPU 以整數數量按物理核心 ID 的升序從初始共享池中取用。
此共享池是供 `BestEffort` 和 `Burstable` Pod 中的所有容器運行使用的 CPU 集。
CPU `requests` 爲小數值的 `Guaranteed` Pod 中的容器也在共享池中的 CPU 上運行。
只有屬於 `Guaranteed` Pod 且具有整數 CPU `requests` 的容器纔會被分配獨佔 CPU。

{{< note >}}
<!--
The kubelet requires a CPU reservation greater than zero when the static policy is enabled.
This is because a zero CPU reservation would allow the shared pool to become empty.
-->
當啓用靜態策略時，kubelet 要求 CPU 預留個數大於零。
這是因爲預留 CPU 個數爲零意味着將允許共享池變空。
{{< /note >}}

<!--
As `Guaranteed` pods whose containers fit the requirements for being statically
assigned are scheduled to the node, CPUs are removed from the shared pool and
placed in the cpuset for the container. CFS quota is not used to bound
the CPU usage of these containers as their usage is bound by the scheduling domain
itself. In others words, the number of CPUs in the container cpuset is equal to the integer
CPU `limit` specified in the pod spec. This static assignment increases CPU
affinity and decreases context switches due to throttling for the CPU-bound
workload.
-->
當容器滿足靜態分配要求的 `Guaranteed` Pod 被調度到節點時，kubelet 會從共享池中刪除 CPU 並將其放入容器的 cpuset 中。
kubelet 不使用 CFS 配額來限制這些容器的 CPU 使用率，因爲它們的使用率受調度域本身限制。
換句話說，容器 cpuset 中的 CPU 數量等於 Pod 規約中指定的整數 CPU `limit`。
這種靜態分配會提高 CPU 親和性，並減少因 CPU 密集型工作負載下因爲限流而導致的上下文切換。

<!--
Consider the containers in the following pod specs:
-->
考慮以下 Pod 規約中的容器：

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
```

<!--
The pod above runs in the `BestEffort` QoS class because no resource `requests` or
`limits` are specified. It runs in the shared pool.
-->
上面的 Pod 以 `BestEffort` QoS 類運行，因爲它沒有指定資源 `requests` 或 `limits`。
它在共享池中運行。

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
The pod above runs in the `Burstable` QoS class because resource `requests` do not
equal `limits` and the `cpu` quantity is not specified. It runs in the shared
pool.
-->
上面的 Pod 以 `Burstable` QoS 類運行，因爲 `requests` 資源不等於 `limits` 且 `cpu` 數量未被指定。
它在共享池中運行。

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
The pod above runs in the `Burstable` QoS class because resource `requests` do not
equal `limits`. It runs in the shared pool.
-->
上面的 Pod 以 `Burstable` QoS 類運行，因爲 `requests` 資源不等於 `limits`。
它在共享池中運行。

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
The pod above runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
And the container's resource limit for the CPU resource is an integer greater than
or equal to one. The `nginx` container is granted 2 exclusive CPUs.
-->
上面的 Pod 以 `Guaranteed` QoS 類運行，因爲其 `requests` 等於 `limits`。
並且 CPU 資源的容器資源限制是大於或等於 1 的整數。
nginx 容器被授予 2 個獨佔 CPU。

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
The pod above runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
But the container's resource limit for the CPU resource is a fraction. It runs in
the shared pool.
-->
上面的 Pod 以 `Guaranteed` QoS 類運行，因爲 `requests` 等於 `limits`。
但是 CPU 資源的容器資源限制是一個小數。
它在共享池中運行。

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
The pod above runs in the `Guaranteed` QoS class because only `limits` are specified
and `requests` are set equal to `limits` when not explicitly specified. And the
container's resource limit for the CPU resource is an integer greater than or
equal to one. The `nginx` container is granted 2 exclusive CPUs.
-->
上面的 Pod 以 `Guaranteed` QoS 類運行，因爲僅指定了 `limits`，
並且在未顯式指定時 `requests` 會被設置爲等於 `limits`。
並且 CPU 資源的容器資源限制是大於或等於 1 的整數。
nginx 容器被授予 2 個獨佔 CPU。

<!--
#### Static policy options {#cpu-policy-static--options}
-->
#### 靜態策略選項  {#cpu-policy-static--options}

<!--
Here are the available policy options for the static CPU management policy,
listed in alphabetical order:
-->
以下是靜態 CPU 管理策略可用的策略選項，以字母順序列出：

<!--
`align-by-socket` (alpha, hidden by default)
: Align CPUs by physical package / socket boundary, rather than logical NUMA boundaries
  (available since Kubernetes v1.25)

`distribute-cpus-across-cores` (alpha, hidden by default)
: Allocate virtual cores, sometimes called hardware threads, across different physical cores
  (available since Kubernetes v1.31)

`distribute-cpus-across-numa` (beta, visible by default)
: Spread CPUs across different NUMA domains, aiming for an even balance between the selected domains
  (available since Kubernetes v1.23)
-->
`align-by-socket`（Alpha，默認隱藏）：
: 以物理芯片/插槽爲邊界（而不是邏輯 NUMA 邊界）對齊 CPU（自 Kubernetes v1.25 起可用）

`distribute-cpus-across-cores`（Beta，默認可見）：
: 跨多個不同的物理核心分配虛擬核心（有時稱爲硬件線程）（自 Kubernetes v1.31 起可用）

`distribute-cpus-across-numa`（Alpha，默認隱藏）：
: 跨多個不同的 NUMA 域分配 CPU，力求在所選域之間實現均勻平衡（自 Kubernetes v1.23 起可用）

<!--
`full-pcpus-only` (GA, visible by default)
: Always allocate full physical cores (available since Kubernetes v1.22, GA since Kubernetes v1.33)

`strict-cpu-reservation` (beta, visible by default)
: Prevent all the pods regardless of their Quality of Service class to run on reserved CPUs
  (available since Kubernetes v1.32)

`prefer-align-cpus-by-uncorecache` (beta, visible by default)
: Align CPUs by uncore (Last-Level) cache boundary on a best-effort way
  (available since Kubernetes v1.32)
-->
`full-pcpus-only`（GA，默認可見）
: 始終分配完整的物理核心（自 Kubernetes v1.22 起可用，自 Kubernetes v1.33 起進階到 GA）

`strict-cpu-reservation`（Beta，默認可見）
: 阻止所有 Pod（無論其服務質量類別如何）在預留的 CPU 上運行（自 Kubernetes v1.32 起可用）

`prefer-align-cpus-by-uncorecache`（Beta，默認可見）
: 儘可能通過非核心（最後一級）高速緩存邊界對齊 CPU（自 Kubernetes v1.32 起可用）

<!--
You can toggle groups of options on and off based upon their maturity level
using the following feature gates:
-->
你可以使用以下特性門控根據選項組的成熟度級別來啓用或禁止它們：

<!--
* `CPUManagerPolicyBetaOptions` (default enabled). Disable to hide beta-level options.
* `CPUManagerPolicyAlphaOptions` (default disabled). Enable to show alpha-level options.

You will still have to enable each option using the `cpuManagerPolicyOptions` field in the
kubelet configuration file.
-->
* `CPUManagerPolicyBetaOptions`（默認啓用）。禁用以隱藏 Beta 級選項。
* `CPUManagerPolicyAlphaOptions`（默認禁用）。啓用以顯示 Alpha 級選項。

你仍然必須使用 kubelet 配置文件中的 cpuManagerPolicyOptions 字段啓用每個選項。

<!--
For more detail about the individual options you can configure, read on.
-->
有關可以配置的各個選項的更多詳細信息，請繼續閱讀。

##### `full-pcpus-only`

<!--
If the `full-pcpus-only` policy option is specified, the static policy will always allocate full physical cores.
By default, without this option, the static policy allocates CPUs using a topology-aware best-fit allocation.
On SMT enabled systems, the policy can allocate individual virtual cores, which correspond to hardware threads.
This can lead to different containers sharing the same physical cores; this behaviour in turn contributes
to the [noisy neighbours problem](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).
With the option enabled, the pod will be admitted by the kubelet only if the CPU request of all its containers
can be fulfilled by allocating full physical cores.
If the pod does not pass the admission, it will be put in Failed state with the message `SMTAlignmentError`.
-->
如果指定了 full-pcpus-only 策略選項，則 static 策略將始終分配完整的物理核心。
默認情況下，如果沒有此選項，static 策略將使用拓撲感知的最佳匹配策略來分配 CPU。
在啓用 SMT 的系統上，該策略可以分配與硬件線程對應的一個個虛擬核心。
這樣做會導致不同的容器共享相同的物理核；這種行爲反過來會導致吵鬧的鄰居問題。
啓用該選項後，僅當可以通過分配完整的物理核心來滿足某 Pod 中所有容器的 CPU 請求時，kubelet 纔會接受該 Pod。
如果 Pod 未通過准入，則系統會將其置於 Failed 狀態，並顯示消息 SMTAlignmentError。

##### `distribute-cpus-across-numa`

<!--
If the `distribute-cpus-across-numa`policy option is specified, the static
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
如果指定了 `distribute-cpus-across-numa` 策略選項，則在需要多個 NUMA 節點來滿足分配的情況下，
static 策略將跨多個 NUMA 節點均勻分配 CPU。
默認情況下，CPUManager 會將 CPU 打包到一個 NUMA 節點上，直到它被填滿，剩餘的所有 CPU 會溢出到下一個 NUMA 節點。
這可能會導致依賴於障礙（和類似的同步原語）的並行代碼出現不希望的瓶頸，
因爲這種類型的代碼往往只會以其最慢的工作程序的速度運行（這一工作程序因爲至少一個 NUMA 節點上的可用 CPU 較少而被減速）。
通過在跨多個 NUMA 節點均勻分配 CPU，應用程序開發人員可以更輕鬆地確保沒有單個工作程序比所有其他工作程序受
NUMA 影響更嚴重，從而提高這些類型的應用的整體性能。

##### `align-by-socket`

<!--
If the `align-by-socket` policy option is specified, CPUs will be considered
aligned at the socket boundary when deciding how to allocate CPUs to a
container. By default, the `CPUManager` aligns CPU allocations at the NUMA
boundary, which could result in performance degradation if CPUs need to be
pulled from more than one NUMA node to satisfy the allocation. Although it
tries to ensure that all CPUs are allocated from the _minimum_ number of NUMA
nodes, there is no guarantee that those NUMA nodes will be on the same socket.
By directing the `CPUManager` to explicitly align CPUs at the socket boundary
rather than the NUMA boundary, we are able to avoid such issues. Note, this
policy option is not compatible with `TopologyManager` `single-numa-node`
policy and does not apply to hardware where the number of sockets is greater
than number of NUMA nodes.
-->
如果指定了 align-by-socket 策略選項，則在決定如何將 CPU 分配給容器時，CPU 將被視爲以插槽爲邊界對齊。
默認情況下，CPUManager 會在 NUMA 邊界處對齊 CPU 分配，如果需要從多個 NUMA 節點提取 CPU 才能滿足分配，則可能會導致性能下降。
雖然它試圖確保所有 CPU 都從_最少_數量的 NUMA 節點中分配，但無法保證這些 NUMA 節點會在同一插槽上。
通過指示 CPUManager 以插槽爲邊界而不是以 NUMA 節點爲邊界顯式對齊 CPU，我們可以避免此類問題。
請注意，此策略選項與 TopologyManager 的 `single-numa-node` 策略不兼容，
並且不適用於插槽數量大於 NUMA 節點數量的硬件。

##### `distribute-cpus-across-cores`

<!--
If the `distribute-cpus-across-cores` policy option is specified, the static policy
will attempt to allocate virtual cores (hardware threads) across different physical cores.
By default, the `CPUManager` tends to pack CPUs onto as few physical cores as possible,
which can lead to contention among CPUs on the same physical core and result
in performance bottlenecks. By enabling the `distribute-cpus-across-cores` policy,
the static policy ensures that CPUs are distributed across as many physical cores
as possible, reducing the contention on the same physical core and thereby
improving overall performance. However, it is important to note that this strategy
might be less effective when the system is heavily loaded. Under such conditions,
the benefit of reducing contention diminishes. Conversely, default behavior
can help in reducing inter-core communication overhead, potentially providing
better performance under high load conditions.
-->
如果指定了 `distribute-cpus-across-cores` 策略選項，則 static
策略將嘗試跨多個不同的物理核來分配虛擬核（硬件線程）。
默認情況下，CPUManager 傾向於將 CPU 打包到儘可能少的物理核上，這可能會導致同一物理核上的 CPU
之間發生爭用，並導致性能瓶頸。
通過啓用 `distribute-cpus-across-cores` 策略，static 策略可確保 CPU 分佈在儘可能多的物理核上，
從而減少同一物理核上的爭用，從而提高整體性能。
但是，重要的是要注意，當系統負載過重時，此策略的效果可能會降低。
在這種情況下，減少爭用的好處會減少。
相反，默認行爲可以幫助減少處理器核之間的通信開銷，從而可能在高負載條件下提供更好的性能。

##### `strict-cpu-reservation`

<!--
The `reservedSystemCPUs` parameter in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/),
or the deprecated kubelet command line option `--reserved-cpus`, defines an explicit CPU set for OS system daemons
and kubernetes system daemons. More details of this parameter can be found on the
[Explicitly Reserved CPU List](/docs/tasks/administer-cluster/reserve-compute-resources/#explicitly-reserved-cpu-list) page.
By default, this isolation is implemented only for guaranteed pods with integer CPU requests not for burstable and best-effort pods
(and guaranteed pods with fractional CPU requests). Admission is only comparing the CPU requests against the allocatable CPUs.
Since the CPU limit is higher than the request, the default behaviour allows burstable and best-effort pods to use up the capacity
of `reservedSystemCPUs` and cause host OS services to starve in real life deployments.
If the `strict-cpu-reservation` policy option is enabled, the static policy will not allow
any workload to use the CPU cores specified in `reservedSystemCPUs`.
-->
KubeletConfiguration 中的 `reservedSystemCPUs` 參數
或已棄用的 kubelet 命令行選項 `--reserved-cpus` 定義顯式的 CPU 集合，
用來運行操作系統系統守護進程和 Kubernetes 系統守護進程。
有關此參數的更多詳細信息，
請參見[顯式預留 CPU 列表](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#explicitly-reserved-cpu-list)頁面。
默認情況下，此隔離僅針對 CPU 請求數量爲整數的 Guaranteed 類的 Pod 實現，
而不適用於 Burstable 和 BestEffort 類的 Pod
（以及具有小數 CPU 請求的保證型 Pod）。准入僅將 CPU 請求與可分配的 CPU 進行比較。
由於 CPU 限制數量高於請求數量，因此默認行爲允許 Burstable 和 BestEffort 類的 Pod 佔用
`reservedSystemCPUs` 所預留的容量，並在實際部署中導致主機 OS 服務資源不足。
如果啓用了 `strict-cpu-reservation` 策略選項，則 static 策略將不允許任何工作負載使用
`reservedSystemCPUs` 中指定的 CPU 核。

##### `prefer-align-cpus-by-uncorecache`

<!--
If the `prefer-align-cpus-by-uncorecache` policy is specified, the static policy
will allocate CPU resources for individual containers such that all CPUs assigned
to a container share the same uncore cache block (also known as the Last-Level Cache
or LLC). By default, the `CPUManager` will tightly pack CPU assignments which can
result in containers being assigned CPUs from multiple uncore caches. This option
enables the `CPUManager` to allocate CPUs in a way that maximizes the efficient use
of the uncore cache. Allocation is performed on a best-effort basis, aiming to
affine as many CPUs as possible within the same uncore cache. If the container's
CPU requirement exceeds the CPU capacity of a single uncore cache, the `CPUManager`
minimizes the number of uncore caches used in order to maintain optimal uncore
cache alignment. Specific workloads can benefit in performance from the reduction
of inter-cache latency and noisy neighbors at the cache level. If the `CPUManager`
cannot align optimally while the node has sufficient resources, the container will
still be admitted using the default packed behavior.
-->
如果指定了 `prefer-align-cpus-by-uncorecache` 策略，則 static 策略爲各個容器分配 CPU 資源時，
會讓分配給容器的所有 CPU 共享同一個非處理核緩存塊（也稱爲最後一級緩存或 LLC）。
默認情況下，CPUManager 會壓縮打包 CPU 分配，這可能會導致分配給容器的 CPU 使用來自多個非核心的高速緩存塊。
此選項使 CPUManager 能夠在分配 CPU 時將非核心緩存的有效利用率最大化。
分配是在盡力而爲的，目的是使共享同一非核心高速緩存的 CPU 個數儘可能多。
如果容器的 CPU 需求超過了單個非核心緩存對應的 CPU 個數，則 CPUManager
會盡量減少所使用的非核高速緩存數量，以保持最佳的非核高速緩存對齊。
某些的工作負載可以從降低緩存級別的緩存間延遲，減少嘈雜鄰居的影響中受益。
如果 CPUManager 在節點具有足夠資源的情況下無法最佳地對齊，則仍將使用默認的打包行爲接受該容器。

<!--
## Memory Management Policies
-->
## 內存管理策略   {#memory-management-policies}

{{< feature-state feature_gate_name="MemoryManager" >}}

<!--
The Kubernetes *Memory Manager* enables the feature of guaranteed memory (and hugepages)
allocation for pods in the `Guaranteed` {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}.
-->
Kubernetes 內存管理器（Memory Manager） 爲 Guaranteed
{{< glossary_tooltip text="QoS 類" term_id="qos-class" >}}中的 Pod
啓用有保證的內存（和巨頁）分配能力。

<!--
The Memory Manager employs hint generation protocol to yield the most suitable NUMA affinity for a pod.
The Memory Manager feeds the central manager (*Topology Manager*) with these affinity hints.
Based on both the hints and Topology Manager policy, the pod is rejected or admitted to the node.
-->
內存管理器採用提示生成協議，爲 Pod 生成最合適的 NUMA 親和性。
內存管理器將這些親和性提示提交到中央管理器，即拓撲管理器（Topology Manager）。
取決於提示信息和拓撲管理器的策略，Pod 將被拒絕或允許進入節點。

<!--
Moreover, the Memory Manager ensures that the memory which a pod requests
is allocated from a minimum number of NUMA nodes.
-->
此外，內存管理器可確保 Pod 請求的內存是從最少數量的 NUMA 節點中分配的。

<!--
## Other resource managers
-->
## 其他資源管理器   {#other-resource-managers}

<!--
The configuration of individual managers is elaborated in dedicated documents:

- [Device Manager](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
-->
各個管理器的配置方式會在專項文檔中詳細闡述：

- [Device Manager](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
