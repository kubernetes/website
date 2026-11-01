---
title: 资源管理器
content_type: concept
weight: 10
---
<!--
title: Resource managers
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
In order to support latency-critical and high-throughput workloads, Kubernetes
offers a suite of Resource Managers. The managers aim to co-ordinate and
optimize the alignment of node's resources for pods configured with a specific
requirement for CPUs, devices, and memory (hugepages) resources.
-->
为了支持对延迟敏感和高吞吐量的工作负载，Kubernetes 提供了一组资源管理器。
这些管理器旨在协调并优化节点资源的对齐，
以满足对 CPU、设备和内存（巨页）资源有特定需求的 Pod 的配置要求。

<!-- body -->

<!--
## Topology manager
-->
## 拓扑管理器 {#topology-manager}

{{< feature-state feature_gate_name="TopologyManager" >}}

<!--
*Topology Manager* is a kubelet component that aims to coordinate the set of
components that are responsible for these optimizations. To learn more, read
[Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/).
-->
**拓扑管理器**（Topology Manager）是一个 kubelet 组件，旨在协调负责这些优化的组件集。
要了解更多信息，请阅读[控制节点上的拓扑管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。

<!--
## CPU manager
-->
## CPU 管理器 {#cpu-manager}

{{< feature-state feature_gate_name="CPUManager" >}}

<!--
*CPU Manager* is a kubelet component that provides exclusive resource allocation
for CPU resources. It consults with the Topology Manager to make resource
assignment decisions. To learn more, read
[Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/).
-->
**CPU 管理器**（CPU Manager）是一个 kubelet 组件，为 CPU 资源提供独占的资源分配。
它会与拓扑管理器协商，以做出资源分配决策。
要了解更多信息，请阅读[控制节点上的 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)。

<!--
### Policies for assigning CPUs to Pods
-->
### 为 Pod 分配 CPU 的策略 {#policies-for-assigning-cpus-to-pods}

<!--
Once a Pod is bound to a Node, the kubelet on that node may need to either multiplex the existing
hardware (for example, sharing CPUs across multiple Pods) or allocate hardware by dedicating some
resource (for example, assigning one of more CPUs for a Pod's exclusive use).
-->
一旦 Pod 绑定到某个节点，该节点上的 kubelet 可能需要多路复用现有硬件
（例如在多个 Pod 之间共享 CPU），或者通过专门划出一部分资源来分配硬件
（例如为某个 Pod 的独占使用分配一个或多个 CPU）。

<!--
By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods, the workload can move to
different CPU cores depending on whether the pod is throttled and which CPU cores are available
at scheduling time. Many workloads are not sensitive to this migration and thus
work fine without any intervention.
-->
默认情况下，kubelet 使用 [CFS 配额](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
来强制执行 Pod 的 CPU 限制。当节点上运行许多 CPU 密集型 Pod 时，
工作负载可能会迁移到不同的 CPU 核，具体取决于 Pod
是否被节流以及调度时哪些 CPU 核可用。许多工作负载对这种迁移并不敏感，
因此在没有任何干预的情况下也能正常工作。

<!--
However, in workloads where CPU cache affinity and scheduling latency significantly affect
workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.
This is implemented using the _CPU Manager_ and its policy.
There are two available policies:
-->
但是，对于 CPU 缓存亲和性和调度延迟会显著影响性能的工作负载，
kubelet 允许使用其他 CPU 管理策略来确定节点上的一些放置偏好。
这是通过 **CPU 管理器**及其策略实现的。有两种可用的策略：

<!--
- `none`: the `none` policy explicitly enables the existing default CPU
  affinity scheme, providing no affinity beyond what the OS scheduler does
  automatically.  Limits on CPU usage for
  [Guaranteed pods](/docs/concepts/workloads/pods/pod-qos/) and
  [Burstable pods](/docs/concepts/workloads/pods/pod-qos/)
  are enforced using CFS quota.
- `static`: the `static` policy allows containers in `Guaranteed` pods with integer CPU
  `requests` access to exclusive CPUs on the node. This exclusivity is enforced
  using the [cpuset cgroup controller](https://www.kernel.org/doc/Documentation/cgroup-v2.txt).
-->
- `none`：`none` 策略显式启用现有的默认 CPU 亲和性方案，
  除了操作系统调度器自动完成的操作外不提供任何亲和性。
  [Guaranteed Pod](/zh-cn/docs/concepts/workloads/pods/pod-qos/) 和
  [Burstable Pod](/zh-cn/docs/concepts/workloads/pods/pod-qos/)
  的 CPU 使用限制通过 CFS 配额来强制执行。
- `static`：`static` 策略允许 `Guaranteed` Pod 中具有整数 CPU `requests`
  的容器访问节点上的独占 CPU。这种独占性是使用
  [CPU 集 cgroup 控制器](https://www.kernel.org/doc/Documentation/cgroup-v2.txt)来强制保证的。

{{< note >}}
<!--
System services such as the container runtime and the kubelet itself can continue to run on
these exclusive CPUs.  The exclusivity only extends to other pods.
-->
诸如容器运行时和 kubelet 本身之类的系统服务可以继续在这些独占 CPU 上运行。独占性只延伸到其他 Pod。
{{< /note >}}

<!--
CPU Manager doesn't support offlining and onlining of CPUs at runtime.
-->
CPU 管理器不支持在运行时离线或上线 CPU。

<!--
#### Static policy
-->
#### 静态策略 {#static-policy}

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
静态策略可实现更精细的 CPU 管理和独占 CPU 分配。
此策略管理一个共享 CPU 池，该池最初包含节点中的所有 CPU。
可独占分配的 CPU 数量等于节点中的 CPU 总数减去 kubelet 配置所设置的所有 CPU 预留量。
通过这些选项预留的 CPU 会以整数数量按物理核心 ID 的升序从初始共享池中取用。
此共享池是 `BestEffort` 和 `Burstable` Pod 中任何容器运行所在的 CPU 集合。
CPU `requests` 为小数的 `Guaranteed` Pod 中的容器也在共享池中的 CPU 上运行。
只有属于 `Guaranteed` Pod 且具有整数 CPU `requests` 的容器才会被分配独占 CPU。

{{< note >}}
<!--
The kubelet requires a CPU reservation greater than zero when the static policy is enabled.
This is because a zero CPU reservation would allow the shared pool to become empty.
-->
当启用静态策略时，kubelet 要求 CPU 预留量大于零。这是因为预留量零会让共享池变为空。
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
当容器满足静态分配要求的 `Guaranteed` Pod 被调度到节点时，CPU 会从共享池中移除并放入容器的 CPU 集中。
不会使用 CFS 配额来限制这些容器的 CPU 使用量，因为它们的使用量由调度域本身限制。
换句话说，容器 CPU 集中的 CPU 数量等于 Pod 规约中指定的整数 CPU `limit`。
这种静态分配会提高 CPU 亲和性，并减少 CPU 密集型工作负载因节流而导致的上下文切换。

<!--
Consider the containers in the following pod specs:
-->
考虑以下 Pod 规约中的容器：

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
上面的 Pod 以 `BestEffort` QoS 类运行，因为它没有指定资源 `requests` 或 `limits`。它在共享池中运行。

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
上面的 Pod 以 `Burstable` QoS 类运行，因为资源 `requests` 不等于 `limits`，
并且没有指定 `cpu` 数量。它在共享池中运行。

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
上面的 Pod 以 `Burstable` QoS 类运行，因为资源 `requests` 不等于 `limits`。它在共享池中运行。

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
上面的 Pod 以 `Guaranteed` QoS 类运行，因为 `requests` 等于 `limits`。
且该容器对 CPU 资源的资源限制是大于或等于 1 的整数。`nginx` 容器被授予 2 个独占 CPU。

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
上面的 Pod 以 `Guaranteed` QoS 类运行，因为 `requests` 等于 `limits`。
但该容器对 CPU 资源的资源限制是一个小数。它在共享池中运行。

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
上面的 Pod 以 `Guaranteed` QoS 类运行，因为只指定了 `limits`，
并且在未显式指定时 `requests` 会被设置为等于 `limits`。
且该容器对 CPU 资源的资源限制是大于或等于 1 的整数。
`nginx` 容器被授予 2 个独占 CPU。

<!--
##### Static policy options {#cpu-policy-static--options}
-->
##### 静态策略选项 {#cpu-policy-static--options}

<!--
Here are the available policy options for the static CPU management policy,
listed in alphabetical order:
-->
以下是静态 CPU 管理策略可用的策略选项，按字母顺序列出：

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
`align-by-socket`（Alpha，默认隐藏）
: 按物理封装/插槽边界对齐 CPU，而不是按逻辑 NUMA 边界对齐
  （自 Kubernetes v1.25 起可用）

`distribute-cpus-across-cores`（Alpha，默认隐藏）
: 跨不同的物理核心分配虚拟核心（有时称为硬件线程）
  （自 Kubernetes v1.31 起可用）

`distribute-cpus-across-numa`（Beta，默认可见）
: 跨不同的 NUMA 域分散 CPU，力求在所选域之间实现均衡
  （自 Kubernetes v1.23 起可用）

<!--
`full-pcpus-only` (GA, visible by default)
: Always allocate full physical cores (available since Kubernetes v1.22, GA since Kubernetes v1.33)

`strict-cpu-reservation` (GA, visible by default)
: Prevent all the pods regardless of their Quality of Service class to run on reserved CPUs
  (available since Kubernetes v1.32, GA since Kubernetes v1.35)

`prefer-align-cpus-by-uncorecache` (GA, visible by default)
: Align CPUs by uncore (Last-Level) cache boundary on a best-effort way
  (available since Kubernetes v1.32)
-->
`full-pcpus-only`（GA，默认可见）
: 始终分配完整的物理核心
  （自 Kubernetes v1.22 起可用，自 Kubernetes v1.33 起进阶到 GA）

`strict-cpu-reservation`（GA，默认可见）
: 阻止所有 Pod（无论其服务质量类别如何）在预留的 CPU 上运行
  （自 Kubernetes v1.32 起可用，自 Kubernetes v1.35 起进阶到 GA）

`prefer-align-cpus-by-uncorecache`（GA，默认可见）
: 以尽力而为的方式按 uncore（最后一级）缓存边界对齐 CPU
  （自 Kubernetes v1.32 起可用）

<!--
You can toggle groups of options on and off based upon their maturity level
using the following feature gates:
-->
你可以使用以下特性门控，根据选项组的成熟度级别来启用或禁用这些选项：

<!--
* `CPUManagerPolicyBetaOptions` (default enabled). Disable to hide beta-level options.
* `CPUManagerPolicyAlphaOptions` (default disabled). Enable to show alpha-level options.

You will still have to enable each option using the `cpuManagerPolicyOptions` field in the
kubelet configuration file.
-->
* `CPUManagerPolicyBetaOptions`（默认启用）。禁用可隐藏 Beta 级选项。
* `CPUManagerPolicyAlphaOptions`（默认禁用）。启用可显示 Alpha 级选项。

你仍然必须使用 kubelet 配置文件中的 `cpuManagerPolicyOptions` 字段启用各个选项。

<!--
For more detail about the individual options you can configure, read on.
-->
有关可以配置的各个选项的更多详细信息，请继续阅读。

###### `full-pcpus-only`

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
如果指定了 `full-pcpus-only` 策略选项，静态策略将始终分配完整的物理核心。
默认情况下，若不使用此选项，静态策略会使用拓扑感知的最佳匹配分配来分配 CPU。
在启用了 SMT 的系统上，该策略可以分配与硬件线程对应的各个虚拟核心。
这可能导致不同的容器共享相同的物理核心；
这种行为又会引发[吵闹的邻居问题](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors)。
启用该选项后，只有当某个 Pod 的所有容器的 CPU 请求都能通过分配完整的物理核心得到满足时，kubelet 才会接受该 Pod。
如果该 Pod 未通过准入，它会被置为 Failed 状态，并带有 `SMTAlignmentError` 消息。

###### `distribute-cpus-across-numa`

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
如果指定了 `distribute-cpus-across-numa` 策略选项，
则在需要多个 NUMA 节点才能满足分配的情况下，静态策略会跨 NUMA 节点均匀分配 CPU。
默认情况下，`CPUManager` 会将 CPU 打包到一个 NUMA 节点上直到填满，剩余的 CPU 会直接溢出到下一个 NUMA 节点。
这可能会给依赖屏障（及类似同步原语）的并行代码带来不必要的瓶颈，
因为这类代码的执行速度往往只取决于其最慢的工作线程（而至少有一个 NUMA 节点上可用 CPU 较少会拖慢该线程）。
通过在多个 NUMA 节点之间均匀分配 CPU，应用开发者可以更容易地确保没有单个工作线程比其他线程受到更严重的
NUMA 影响，从而提升这类应用的整体性能。

###### `align-by-socket`

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
如果指定了 `align-by-socket` 策略选项，则在决定如何将 CPU 分配给容器时，
CPU 会被视为以插槽为边界对齐。默认情况下，`CPUManager` 在 NUMA 边界处对齐 CPU 分配，
如果需要从多个 NUMA 节点拉取 CPU 才能满足分配，这可能会导致性能下降。
尽管它试图确保所有 CPU 都从**最少**数量的 NUMA 节点中分配，但无法保证这些 NUMA 节点位于同一个插槽上。
通过指示 `CPUManager` 显式地以插槽边界而不是 NUMA 边界对齐 CPU，
我们可以避免此类问题。注意，此策略选项与 `TopologyManager` 的 `single-numa-node` 策略
不兼容，并且不适用于插槽数量大于 NUMA 节点数量的硬件。

###### `distribute-cpus-across-cores`

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
如果指定了 `distribute-cpus-across-cores` 策略选项，静态策略会尝试跨不同的物理核心分配虚拟核心（硬件线程）。
默认情况下，`CPUManager` 倾向于将 CPU 打包到尽可能少的物理核心上，这可能导致同一物理核心上的 CPU 之间发生争用，造成性能瓶颈。
通过启用 `distribute-cpus-across-cores` 策略，静态策略可确保 CPU 尽可能分散到更多的物理核心上，
减少同一物理核心上的争用，从而提高整体性能。但是，需要注意的是，当系统负载很重时，此策略的效果可能较差。
在这种情况下，减少争用带来的好处会减弱。相反，
默认行为有助于减少核心间通信开销，在高负载条件下可能提供更好的性能。

###### `strict-cpu-reservation`

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
[KubeletConfiguration](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/) 中的
`reservedSystemCPUs` 参数，或已弃用的 kubelet 命令行选项 `--reserved-cpus`，
为 OS 系统守护进程和 Kubernetes 系统守护进程定义了一个显式的 CPU 集合。有关此参数的更多详细信息，
请参见[显式预留的 CPU 列表](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#explicitly-reserved-cpu-list)页面。
默认情况下，这种隔离仅针对具有整数 CPU 请求的 Guaranteed Pod 实现，
而不适用于 Burstable 和 BestEffort Pod（以及具有小数 CPU 请求的 Guaranteed Pod）。
准入只会将 CPU 请求与可分配的 CPU 进行比较。
由于 CPU 限制高于请求，默认行为允许 Burstable 和 BestEffort Pod 占满
`reservedSystemCPUs` 的容量，从而在实际部署中导致主机 OS 服务资源匮乏。
如果启用了 `strict-cpu-reservation` 策略选项，
静态策略将不允许任何工作负载使用 `reservedSystemCPUs` 中指定的 CPU 核心。

###### `prefer-align-cpus-by-uncorecache`

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
如果指定了 `prefer-align-cpus-by-uncorecache` 策略，静态策略会为各个容器分配 CPU 资源，
使分配给某个容器的所有 CPU 共享同一个 uncore 缓存块（也称为最后一级缓存或 LLC）。
默认情况下，`CPUManager` 会紧密打包 CPU 分配，这可能导致分配给容器的 CPU 来自多个 uncore 缓存。
此选项使 `CPUManager` 能够以最大化 uncore 缓存利用效率的方式分配 CPU。
分配以尽力而为的方式进行，目的是让尽可能多的 CPU 归属同一个 uncore 缓存。
如果容器的 CPU 需求超过单个 uncore 缓存的 CPU 容量，
`CPUManager` 会尽量减少所使用的 uncore 缓存数量，以保持最佳的 uncore 缓存对齐。
特定工作负载可以从降低缓存间延迟和缓存层面的吵闹邻居影响中获益。
如果节点资源充足而 `CPUManager` 无法最佳对齐，容器仍会使用默认的紧密打包行为被接受。

<!--
## Memory manager
-->
## 内存管理器 {#memory-manager}

{{< feature-state feature_gate_name="MemoryManager" >}}

<!--
*Memory Manager* is a kubelet component that provides exclusive resource
allocation for memory resources. It consults with the Topology Manager to make
resource assignment decisions. To learn more, read
[Control Memory Management Policies on a Node](/docs/tasks/administer-cluster/memory-manager/).
-->
**内存管理器**（Memory Manager）是一个 kubelet 组件，为内存资源提供独占的资源分配。
它会与拓扑管理器协商，以做出资源分配决策。
要了解更多信息，请阅读[控制节点上的内存管理策略](/zh-cn/docs/tasks/administer-cluster/memory-manager/)。

<!--
### Policies for assigning memory to Pods {#memory-management-policies}
-->
### 为 Pod 分配内存的策略 {#memory-management-policies}

<!--
The Kubernetes *Memory Manager* allocates RAM (memory, and optionally Linux huge pages) resources
for pods in the `Guaranteed` {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}.
-->
Kubernetes **内存管理器**为 `Guaranteed`
{{< glossary_tooltip text="QoS 类" term_id="qos-class" >}}中的 Pod
分配 RAM（内存，以及可选的 Linux 巨页）资源。

<!--
The Memory Manager employs hint generation protocol to yield the most suitable NUMA affinity for a pod.
The Memory Manager feeds the central manager (*Topology Manager*) with these affinity hints.
Based on both the hints and Topology Manager policy, the pod is rejected or admitted to the node.
-->
内存管理器采用提示生成协议，为 Pod 生成最合适的 NUMA 亲和性。
内存管理器将这些亲和性提示提供给中央管理器（**拓扑管理器**）。
根据这些提示和拓扑管理器的策略，Pod 会被拒绝或接入节点。

<!--
Moreover, the Memory Manager ensures that the memory which a pod requests
is allocated from a minimum number of NUMA nodes.
-->
此外，内存管理器确保 Pod 请求的内存从最少数量的 NUMA 节点中分配。

<!--
To learn more, read [Control Memory Management Policies on a Node](/docs/tasks/administer-cluster/memory-manager/).
-->
要了解更多信息，请阅读[控制节点上的内存管理策略](/zh-cn/docs/tasks/administer-cluster/memory-manager/)。

<!--
## Device manager
-->
## 设备管理器 {#device-manager}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
*Device Manager* is a kubelet component that allocates hardware devices to pods
using the device plugin API. It consults with the Topology Manager, using
topology information provided by device plugins, to make resource assignment
decisions. To learn more, read
[Device Plugin Integration with the Topology Manager](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).
-->
**设备管理器**（Device Manager）是一个 kubelet 组件，使用设备插件 API 将硬件设备分配给 Pod。
它会与拓扑管理器协商，利用设备插件提供的拓扑信息来做出资源分配决策。要了解更多信息，
请阅读[设备插件与拓扑管理器的集成](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)。

<!--
## Pod-level resource managers {#pod-level-resource-managers}
-->
## Pod 级资源管理器 {#pod-level-resource-managers}

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

<!--
Pod-level resource support for `kubelet` resource managers (Topology, CPU,
and Memory) allows resource managers to use `.spec.resources` directly for
NUMA alignment and exclusive allocation decisions.
-->
对 `kubelet` 资源管理器（拓扑、CPU 和内存）的 Pod 级资源支持，
允许资源管理器直接使用 `.spec.resources` 做出 NUMA 对齐和独占分配决策。

<!--
To learn more, see the dedicated
[Pod-level resource managers](/docs/concepts/resource-management/pod-level-resource-managers/)
concept page, or read how to
[Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/).
-->
要了解更多信息，请参阅专门的
[Pod 级资源管理器](/zh-cn/docs/concepts/resource-management/pod-level-resource-managers/)概念页面，
或阅读如何[分配 Pod 级 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)。

## {{% heading "whatsnext" %}}

<!--
-   [Node Resource Managers](/docs/concepts/policy/node-resource-managers/)
-->
- [节点资源管理器](/zh-cn/docs/concepts/policy/node-resource-managers/)
