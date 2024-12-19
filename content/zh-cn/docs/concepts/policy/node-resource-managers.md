---
title: 节点资源管理器
content_type: concept
weight: 50
---
<!-- 
---
reviewers:
- derekwaynecarr
- klueska
title: Node Resource Managers 
content_type: concept
weight: 50
---
-->

<!-- overview -->

<!-- 
In order to support latency-critical and high-throughput workloads, Kubernetes offers a suite of Resource Managers. The managers aim to co-ordinate and optimise node's resources alignment for pods configured with a specific requirement for CPUs, devices, and memory (hugepages) resources. 
-->
Kubernetes 提供了一组资源管理器，用于支持延迟敏感的、高吞吐量的工作负载。
资源管理器的目标是协调和优化节点资源，以支持对 CPU、设备和内存（巨页）等资源有特殊需求的 Pod。

<!-- body -->

<!-- 
## Hardware topology alignment policies
-->
## 硬件拓扑对齐策略

<!--
_Topology Manager_ is a kubelet component that aims to coordinate the set of components that are
responsible for these optimizations. The the overall resource management process is governed using
the policy you specify.
To learn more, read [Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/).
-->
_拓扑管理器（Topology Manager）_ 是一个 kubelet 组件，旨在协调负责这些优化的组件集。
整体资源管理过程通过你指定的策略进行管理。
要了解更多信息，请阅读[控制节点上的拓扑管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。

<!-- 
## Policies for assigning CPUs to Pods
-->
## 为 Pod 分配 CPU 的策略

{{< feature-state feature_gate_name="CPUManager" >}}

<!-- 
Once a Pod is bound to a Node, the kubelet on that node may need to either multiplex the existing
hardware (for example, sharing CPUs across multiple Pods) or allocate hardware by dedicating some
resource (for example, assigning one of more CPUs for a Pod's exclusive use).
-->
一旦 Pod 绑定到节点，该节点上的 kubelet 可能需要多路复用现有硬件（例如，在多个 Pod 之间共享 CPU），
或者通过分配一些资源来分配硬件（例如，为 Pod 独占使用分配一个或多个 CPU）。

<!-- 
By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods, the workload can move to different CPU cores depending on whether the pod is throttled and which CPU cores are available at scheduling time. Many workloads are not sensitive to this migration and thus
work fine without any intervention.
-->
默认情况下，kubelet 使用 [CFS 配额](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
来强制执行 Pod 的 CPU 限制。当节点运行许多 CPU 密集型 Pod 时，工作负载可能会移动到不同的 CPU 内核，具体取决于Pod 是否受到限制以及调度时哪些 CPU 内核可用。许多工作负载对这种迁移不敏感，因此无需任何干预即可正常工作。

<!--
However, in workloads where CPU cache affinity and scheduling latency significantly affect workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.
This is implemented using the _CPU Manager_ and its policy.
There are two available policies:
-->
但是，在 CPU 缓存亲和性和调度延迟会显著影响工作负载性能的工作负载中，kubelet 允许使用替代的 CPU 管理策略来确定节点上的一些放置首选项。
这是使用 _CPU 管理器（CPU Manager）_ 及其策略实现的。
有两种可用的策略：

<!--
- `none`: the `none` policy explicitly enables the existing default CPU
affinity scheme, providing no affinity beyond what the OS scheduler does
automatically.  Limits on CPU usage for
[Guaranteed pods](/docs/concepts/workloads/pods/pod-qos/) and
[Burstable pods](/docs/concepts/workloads/pods/pod-qos/)
are enforced using CFS quota.
-->
- `none`：`none` 策略显式启用现有的默认 CPU 亲和性方案，除了操作系统调度器自动执行的操作外，不提供任何亲和性。
    使用 CFS 配额强制执行 [Guaranteed Pod](/zh-cn/docs/concepts/workloads/pods/pod-qos/) 和 [Burstable Pod](/zh-cn/docs/concepts/workloads/pods/pod-qos/) 的 CPU 使用限制。

<!--
- `static`: the `static` policy allows containers in `Guaranteed` pods with integer CPU
`requests` access to exclusive CPUs on the node. This exclusivity is enforced
using the [cpuset cgroup controller](https://www.kernel.org/doc/Documentation/cgroup-v2.txt).
-->
- `static`：`static` 策略允许具有整数 CPU `requests` 的 `Guaranteed` Pod 中的容器访问节点上的独占 CPU。
    这种独占性是使用 [cpuset cgroup 控制器](https://www.kernel.org/doc/Documentation/cgroup-v2.txt) 强制执行的。


{{< note >}}
<!--
System services such as the container runtime and the kubelet itself can continue to run on these exclusive CPUs.  The exclusivity only extends to other pods.
-->
诸如容器运行时和 kubelet 本身之类的系统服务可以继续在这些独占 CPU 上运行。
独占性仅扩展到其他 Pod。
{{< /note >}}    

<!--
CPU Manager doesn't support offlining and onlining of CPUs at runtime.
-->
CPU 管理器不支持在运行时脱机和联机 CPU。

<!--
### Static policy
-->
### 静态策略

<!--
The static policy enables finer-grained CPU management and exclusive CPU assignment.
This policy manages a shared pool of CPUs that initially contains all CPUs in the
node. The amount of exclusively allocatable CPUs is equal to the total
number of CPUs in the node minus any CPU reservations set by the kubelet configuration.
CPUs reserved by these options are taken, in integer quantity, from the initial shared pool in ascending order by physical
core ID.  This shared pool is the set of CPUs on which any containers in
`BestEffort` and `Burstable` pods run. Containers in `Guaranteed` pods with fractional
CPU `requests` also run on CPUs in the shared pool. Only containers that are
both part of a `Guaranteed` pod and have integer CPU `requests` are assigned
exclusive CPUs.
-->
静态策略可实现更精细的 CPU 管理和独占 CPU 分配。
此策略管理一个共享 CPU 池，该池最初包含节点中的所有 CPU。
可独占分配的 CPU 数量等于节点中的 CPU 总数减去 kubelet 配置设置的任何 CPU 预留。
这些选项预留的 CPU 以整数数量按物理核心 ID 的升序从初始共享池中获取。
此共享池是 `BestEffort` 和 `Burstable` Pod 中的任何容器运行的 CPU 集。
CPU `requests` 为小数值的 `Guaranteed` Pod 中的容器也在共享池中的 CPU 上运行。
只有属于 `Guaranteed` Pod 且具有整数 CPU `requests` 的容器才会被分配独占 CPU。

{{< note >}}
<!--
The kubelet requires a CPU reservation greater than zero when the static policy is enabled.
This is because zero CPU reservation would allow the shared pool to become empty.
-->
当启用静态策略时，kubelet 需要大于零的 CPU 预留。
这是因为零 CPU 预留将允许共享池变空。
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
-->
当满足静态分配要求的 `Guaranteed` Pod 调度到节点时，CPU 会从共享池中删除并放入容器的 cpuset 中。
CFS 配额不用于限制这些容器的 CPU 使用率，因为它们的使用率受调度域本身限制。
换句话说，容器 cpuset 中的 CPU 数量等于 Pod 规约中指定的整数 CPU `limit`。
这种静态分配会提高 CPU 亲和性，并减少因 CPU 密集型工作负载的限制而导致的上下文切换。

<!--
Consider the containers in the following pod specs:
-->
考虑以下 Pod 规约中的容器：

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
上面的 Pod 在 BestEffort QoS 类中运行，因为没有指定资源 requests 或 limits。
它在共享池中运行。

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
上面的 Pod 在 Guaranteed QoS 类中运行，因为 requests 等于 limits。
并且 CPU 资源的容器资源限制是大于或等于 1 的整数。
nginx 容器被授予 2 个独占 CPU。

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
上面的 Pod 在 Guaranteed QoS 类中运行，因为 requests 等于 limits。
但 CPU 资源的容器资源限制是一个小数。它在共享池中运行。

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
上面的 Pod 在 Guaranteed QoS 类中运行，因为仅指定了 limits，并且在未显式指定时 requests 设置为等于 limits。
并且 CPU 资源的容器资源限制是大于或等于 1 的整数。
nginx 容器被授予 2 个独占 CPU。

<!--
#### Static policy options {#cpu-policy-static--options}
-->
#### 策略选项  {#cpu-policy-static--options}

<!--
The behavior of the static policy can be fine-tuned using the CPU Manager policy options.
The following policy options exist for the static CPU management policy:
{{/* options in alphabetical order */}}
-->
可以使用 CPU 管理器策略选项微调 static 策略的行为。
static CPU 管理策略存在以下策略选项：
{{/* options in alphabetical order */}}

<!--
`align-by-socket` (alpha, hidden by default)
: Align CPUs by physical package / socket boundary, rather than logical NUMA boundaries (available since Kubernetes v1.25)
`distribute-cpus-across-cores` (alpha, hidden by default)
: Allocate virtual cores, sometimes called hardware threads, across different physical cores  (available since Kubernetes v1.31)
`distribute-cpus-across-numa` (alpha, hidden by default)
: Spread CPUs across different NUMA domains, aiming for an even balance between the selected domains (available since Kubernetes v1.23)
`full-pcpus-only` (beta, visible by default)
: Always allocate full physical cores (available since Kubernetes v1.22)
`strict-cpu-reservation` (alpha, hidden by default)
: Prevent all the pods regardless of their Quality of Service class to run on reserved CPUs (available since Kubernetes v1.32)
`prefer-align-cpus-by-uncorecache` (alpha, hidden by default)
: Align CPUs  by uncore (Last-Level) cache boundary on a best-effort way (available since Kubernetes v1.32)
-->
`align-by-socket`（alpha，默认隐藏）：
: 通过物理包/套接字边界（而不是逻辑 NUMA 边界）对齐 CPU（自 Kubernetes v1.25 起可用）
`distribute-cpus-across-cores`（alpha，默认隐藏）：
: 在不同的物理核心之间分配虚拟核心（有时称为硬件线程）（自 Kubernetes v1.31 起可用）
`distribute-cpus-across-numa`（alpha，默认隐藏）：
: 在不同的 NUMA 域之间分配 CPU，力求在所选域之间实现均匀平衡（自 Kubernetes v1.23 起可用）
`full-pcpus-only`（beta，默认可见）：
: 始终分配完整的物理核心（自 Kubernetes v1.22 起可用）
`strict-cpu-reservation`（alpha，默认隐藏）：
: 阻止所有 Pod（无论其服务质量类别如何）在预留的 CPU 上运行（自 Kubernetes v1.32 起可用）
`prefer-align-cpus-by-uncorecache`（alpha，默认隐藏）：
: 尽可能通过非核心（最后一级）缓存边界对齐 CPU（自 Kubernetes v1.32 起可用）

<!--
You can toggle groups of options on and off based upon their maturity level
using the following feature gates:
-->
你可以使用以下功能门根据其成熟度级别打开和关闭选项组：
<!--
* `CPUManagerPolicyBetaOptions` (default enabled). Disable to hide beta-level options.
* `CPUManagerPolicyAlphaOptions` (default disabled). Enable to show alpha-level options.
You will still have to enable each option using the `cpuManagerPolicyOptions` field in the
kubelet configuration file.
-->
* `CPUManagerPolicyBetaOptions`（默认启用）。禁用以隐藏 beta 级选项。
* `CPUManagerPolicyAlphaOptions`（默认禁用）。启用以显示 alpha 级选项。
你仍然必须使用 kubelet 配置文件中的 cpuManagerPolicyOptions 字段启用每个选项。

<!--
For more detail about the individual options you can configure, read on.
-->
有关可以配置的各个选项的更多详细信息，请继续阅读。


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
如果指定了 full-pcpus-only 策略选项，则 static 策略将始终分配完整的物理核心。
默认情况下，如果没有此选项，static 策略将使用拓扑感知最佳拟合分配来分配 CPU。
在启用 SMT 的系统上，该策略可以分配与硬件线程对应的单个虚拟核心。
这会导致不同的容器共享相同的物理核心；这种行为反过来会导致 吵闹的邻居问题。
启用该选项后，仅当可以通过分配完整的物理核心来满足其所有容器的 CPU 请求时，kubelet 才会接受该 Pod。
如果 Pod 未通过准入，则会将其置于失败状态，并显示消息 SMTAlignmentError。

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
如果指定了 distribute-cpus-across-numa 策略选项，则在需要多个 NUMA 节点来满足分配的情况下，static 策略将跨 NUMA 节点均匀分配 CPU。
默认情况下，CPUManager 会将 CPU 打包到一个 NUMA 节点上，直到它被填满，任何剩余的 CPU 只会溢出到下一个 NUMA 节点。
这可能会导致依赖于障碍（和类似的同步原语）的并行代码出现不希望的瓶颈，因为这种类型的代码往往只会以其最慢的工作程序的速度运行（最慢的工作程序会因至少一个 NUMA 节点上的可用 CPU 较少而减速）。
通过在 NUMA 节点之间均匀分配 CPU，应用程序开发人员可以更轻松地确保没有单个工作程序比任何其他工作程序遭受更多的 NUMA 影响，从而提高这些类型应用程序的整体性能。

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
如果指定了 align-by-socket 策略选项，则在决定如何将 CPU 分配给容器时，CPU 将被视为在套接字边界处对齐。
默认情况下，CPUManager 会在 NUMA 边界处对齐 CPU 分配，如果需要从多个 NUMA 节点提取 CPU 才能满足分配，则可能会导致性能下降。
虽然它试图确保所有 CPU 都从_最少_数量的 NUMA 节点中分配，但无法保证这些 NUMA 节点会在同一套接字上。
通过指示 CPUManager 在套接字边界而不是 NUMA 边界处显式对齐 CPU，我们可以避免此类问题。
请注意，此策略选项与 TopologyManager single-numa-node 策略不兼容，并且不适用于套接字数量大于 NUMA 节点数量的硬件。


##### `distribute-cpus-across-cores`

<!--
If the `distribute-cpus-across-cores` policy option is specified, the static policy
will attempt to allocate virtual cores (hardware threads) across different physical cores.
By default, the `CPUManager` tends to pack cpus onto as few physical cores as possible,
which can lead to contention among cpus on the same physical core and result
in performance bottlenecks. By enabling the `distribute-cpus-across-cores` policy,
the static policy ensures that cpus are distributed across as many physical cores
as possible, reducing the contention on the same physical core and thereby
improving overall performance. However, it is important to note that this strategy
might be less effective when the system is heavily loaded. Under such conditions,
the benefit of reducing contention diminishes. Conversely, default behavior
can help in reducing inter-core communication overhead, potentially providing
better performance under high load conditions.
-->
如果指定了 distribute-cpus-across-cores 策略选项，则 static 策略将尝试在不同的物理核心之间分配虚拟核心（硬件线程）。
默认情况下，CPUManager 倾向于将 CPU 打包到尽可能少的物理核心上，这可能会导致同一物理核心上的 CPU 之间发生争用，并导致性能瓶颈。
通过启用 distribute-cpus-across-cores 策略，static 策略可确保 CPU 分布在尽可能多的物理核心上，从而减少同一物理核心上的争用，从而提高整体性能。
但是，重要的是要注意，当系统负载过重时，此策略的效果可能会降低。
在这种情况下，减少争用的好处会减少。
相反，默认行为可以帮助减少核心间的通信开销，从而可能在高负载条件下提供更好的性能。

##### `strict-cpu-reservation`

<!--
The `reservedSystemCPUs` parameter in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/),
or the deprecated kubelet command line option `--reserved-cpus`, defines an explicit CPU set for OS system daemons
and kubernetes system daemons.  More details of this parameter can be found on the
[Explicitly Reserved CPU List](/docs/tasks/administer-cluster/reserve-compute-resources/#explicitly-reserved-cpu-list) page.
By default this isolation is implemented only for guaranteed pods with integer CPU requests not for burstable and best-effort pods
(and guaranteed pods with fractional CPU requests). Admission is only comparing the cpu requests against the allocatable cpus.
Since the cpu limit is higher than the request, the default behaviour allows burstable and best-effort pods to use up the capacity
of `reservedSystemCPUs` and cause host OS services to starve in real life deployments.
If the `strict-cpu-reservation` policy option is enabled, the static policy will not allow
any workload to use the CPU cores specified in `reservedSystemCPUs`.
-->
KubeletConfiguration 中的 reservedSystemCPUs 参数
或已弃用的 kubelet 命令行选项 --reserved-cpus 为操作系统系统守护程序和 Kubernetes 系统守护程序定义了显式的 CPU 集。
有关此参数的更多详细信息，请参见显式预留 CPU 列表页面。
默认情况下，此隔离仅针对具有整数 CPU 请求的保证型 Pod 实现，而不适用于突发型和尽力而为型 Pod
（以及具有小数 CPU 请求的保证型 Pod）。准入仅将 CPU 请求与可分配的 CPU 进行比较。
由于 CPU 限制高于请求，因此默认行为允许突发型和尽力而为型 Pod 占用 reservedSystemCPUs 的容量，并导致主机 OS 服务在实际部署中资源不足。
如果启用了 strict-cpu-reservation 策略选项，则 static 策略将不允许任何工作负载使用 reservedSystemCPUs 中指定的 CPU 核心。

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
如果指定了 prefer-align-cpus-by-uncorecache 策略，则 static 策略将为各个容器分配 CPU 资源，
以便分配给容器的所有 CPU 共享同一个非核心缓存块（也称为最后一级缓存或 LLC）。
默认情况下，CPUManager 会紧密打包 CPU 分配，这可能会导致将多个非核心缓存中的 CPU 分配给容器。
此选项使 CPUManager 能够以最大化非核心缓存的有效利用率的方式分配 CPU。
分配是在尽力而为的基础上执行的，旨在使尽可能多的 CPU 位于同一非核心缓存中。
如果容器的 CPU 需求超过了单个非核心缓存的 CPU 容量，则 CPUManager 会尽量减少使用的非核心缓存数量，以保持最佳的非核心缓存对齐。
特定的工作负载可以从减少缓存级别的缓存间延迟和嘈杂的邻居中受益。
如果 CPUManager 在节点具有足够资源的情况下无法最佳地对齐，则仍将使用默认的打包行为接受该容器。

<!--
## Memory Management Policies
-->
## 内存管理策略

{{< feature-state feature_gate_name="MemoryManager" >}}

<!--
The Kubernetes *Memory Manager* enables the feature of guaranteed memory (and hugepages)
allocation for pods in the `Guaranteed` {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}.
-->
Kubernetes 内存管理器（Memory Manager） 为 Guaranteed {{< glossary_tooltip text="QoS 类" term_id="qos-class" >}} 中的 Pod 启用了有保证的内存（和巨页）分配功能。

<!--
The Memory Manager employs hint generation protocol to yield the most suitable NUMA affinity for a pod.
The Memory Manager feeds the central manager (*Topology Manager*) with these affinity hints.
Based on both the hints and Topology Manager policy, the pod is rejected or admitted to the node.
-->
内存管理器采用提示生成协议，为 Pod 生成最合适的 NUMA 亲和性。
内存管理器将这些亲和性提示馈送到中央管理器（拓扑管理器（Topology Manager））。
根据提示和拓扑管理器策略，Pod 将被拒绝或允许进入节点。

<!--
Moreover, the Memory Manager ensures that the memory which a pod requests
is allocated from a minimum number of NUMA nodes.
-->
此外，内存管理器可确保 Pod 请求的内存是从最少数量的 NUMA 节点中分配的。

<!--
## Other resource managers
-->
## 其他资源管理器

<!--
The configuration of individual managers is elaborated in dedicated documents:
-->
各个管理器的配置方式会在专项文档中详细阐述：

- [Device Manager](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
