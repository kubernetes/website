---
title: 控制节点上的 CPU 管理策略
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
按照设计，Kubernetes 对 Pod 执行相关的很多方面进行了抽象，使得用户不必关心。
然而，为了正常运行，有些工作负载要求在延迟和/或性能方面有更强的保证。
为此，kubelet 提供方法来实现更复杂的负载放置策略，同时保持抽象，避免显式的放置指令。

<!--
For detailed information on resource management, please refer to the
[Resource Management for Pods and Containers](/docs/concepts/configuration/manage-resources-containers)
documentation.
-->
有关资源管理的详细信息，
请参阅 [Pod 和容器的资源管理](/zh-cn/docs/concepts/configuration/manage-resources-containers)文档。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
If you are running an older version of Kubernetes, please look at the documentation for the version you are actually running.
-->
如果你正在运行一个旧版本的 Kubernetes，请参阅与该版本对应的文档。

<!-- steps -->

<!--
## CPU Management Policies

By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods,
the workload can move to different CPU cores depending on
whether the pod is throttled and which CPU cores are available at
scheduling time. Many workloads are not sensitive to this migration and thus
work fine without any intervention.
-->
## CPU 管理策略   {#cpu-management-policies}

默认情况下，kubelet 使用 [CFS 配额](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
来执行 Pod 的 CPU 约束。
当节点上运行了很多 CPU 密集的 Pod 时，工作负载可能会迁移到不同的 CPU 核，
这取决于调度时 Pod 是否被扼制，以及哪些 CPU 核是可用的。
许多工作负载对这种迁移不敏感，因此无需任何干预即可正常工作。

<!--
However, in workloads where CPU cache affinity and scheduling latency
significantly affect workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.
-->
然而，有些工作负载的性能明显地受到 CPU 缓存亲和性以及调度延迟的影响。
对此，kubelet 提供了可选的 CPU 管理策略，来确定节点上的一些分配偏好。

<!--
### Configuration

The CPU Manager policy is set with the `--cpu-manager-policy` kubelet
flag or the `cpuManagerPolicy` field in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).
There are two supported policies:
-->
### 配置   {#configuration}

CPU 管理策略通过 kubelet 参数 `--cpu-manager-policy`
或 [KubeletConfiguration](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
中的 `cpuManagerPolicy` 字段来指定。
支持两种策略：

<!--
* [`none`](#none-policy): the default policy.
* [`static`](#static-policy): allows pods with certain resource characteristics to be
  granted increased CPU affinity and exclusivity on the node.
-->
* [`none`](#none-policy)：默认策略。
* [`static`](#static-policy)：允许为节点上具有某些资源特征的 Pod 赋予增强的 CPU 亲和性和独占性。

<!--
The CPU manager periodically writes resource updates through the CRI in
order to reconcile in-memory CPU assignments with cgroupfs. The reconcile
frequency is set through a new Kubelet configuration value
`--cpu-manager-reconcile-period`. If not specified, it defaults to the same
duration as `--node-status-update-frequency`.
-->
CPU 管理器定期通过 CRI 写入资源更新，以保证内存中 CPU 分配与 cgroupfs 一致。
同步频率通过新增的 Kubelet 配置参数 `--cpu-manager-reconcile-period` 来设置。
如果不指定，默认与 `--node-status-update-frequency` 的周期相同。

<!--
The behavior of the static policy can be fine-tuned using the `--cpu-manager-policy-options` flag.
The flag takes a comma-separated list of `key=value` policy options.
If you disable the `CPUManagerPolicyOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
then you cannot fine-tune CPU manager policies. In that case, the CPU manager
operates only using its default settings.
-->
Static 策略的行为可以使用 `--cpu-manager-policy-options` 参数来微调。
该参数采用一个逗号分隔的 `key=value` 策略选项列表。
如果你禁用 `CPUManagerPolicyOptions`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
则你不能微调 CPU 管理器策略。这种情况下，CPU 管理器仅使用其默认设置运行。

<!--
In addition to the top-level `CPUManagerPolicyOptions` feature gate, the policy options are split
into two groups: alpha quality (hidden by default) and beta quality (visible by default).
The groups are guarded respectively by the `CPUManagerPolicyAlphaOptions`
and `CPUManagerPolicyBetaOptions` feature gates. Diverging from the Kubernetes standard, these
feature gates guard groups of options, because it would have been too cumbersome to add a feature
gate for each individual option.
-->
除了顶级的 `CPUManagerPolicyOptions` 特性门控，
策略选项分为两组：Alpha 质量（默认隐藏）和 Beta 质量（默认可见）。
这些组分别由 `CPUManagerPolicyAlphaOptions` 和 `CPUManagerPolicyBetaOptions` 特性门控来管控。
不同于 Kubernetes 标准，这里是由这些特性门控来管控选项组，因为为每个单独选项都添加一个特性门控过于繁琐。

<!--
### Changing the CPU Manager Policy

Since the CPU manager policy can only be applied when kubelet spawns new pods, simply changing from
"none" to "static" won't apply to existing pods. So in order to properly change the CPU manager
policy on a node, perform the following steps:
-->
### 更改 CPU 管理器策略   {#changing-the-cpu-manager-policy}

由于 CPU 管理器策略只能在 kubelet 生成新 Pod 时应用，所以简单地从 "none" 更改为 "static"
将不会对现有的 Pod 起作用。
因此，为了正确更改节点上的 CPU 管理器策略，请执行以下步骤：

<!--
1. [Drain](/docs/tasks/administer-cluster/safely-drain-node) the node.
2. Stop kubelet.
3. Remove the old CPU manager state file. The path to this file is
`/var/lib/kubelet/cpu_manager_state` by default. This clears the state maintained by the
CPUManager so that the cpu-sets set up by the new policy won’t conflict with it.
4. Edit the kubelet configuration to change the CPU manager policy to the desired value.
5. Start kubelet.
-->
1. [腾空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node)节点。
2. 停止 kubelet。
3. 删除旧的 CPU 管理器状态文件。该文件的路径默认为 `/var/lib/kubelet/cpu_manager_state`。
   这将清除 CPUManager 维护的状态，以便新策略设置的 cpu-sets 不会与之冲突。
4. 编辑 kubelet 配置以将 CPU 管理器策略更改为所需的值。
5. 启动 kubelet。

<!--
Repeat this process for every node that needs its CPU manager policy changed. Skipping this
process will result in kubelet crashlooping with the following error:
-->
对需要更改其 CPU 管理器策略的每个节点重复此过程。
跳过此过程将导致 kubelet crashlooping 并出现以下错误：

```
could not restore state from checkpoint: configured policy "static" differs from state checkpoint policy "none", please drain this node and delete the CPU manager checkpoint file "/var/lib/kubelet/cpu_manager_state" before restarting Kubelet
```

<!--
### None policy

The `none` policy explicitly enables the existing default CPU
affinity scheme, providing no affinity beyond what the OS scheduler does
automatically.  Limits on CPU usage for
[Guaranteed pods](/docs/tasks/configure-pod-container/quality-service-pod/) and
[Burstable pods](/docs/tasks/configure-pod-container/quality-service-pod/)
are enforced using CFS quota.
-->
### none 策略   {#none-policy}

`none` 策略显式地启用现有的默认 CPU 亲和方案，不提供操作系统调度器默认行为之外的亲和性策略。
通过 CFS 配额来实现 [Guaranteed Pods](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
和 [Burstable Pods](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
的 CPU 使用限制。

<!--
### Static policy

The `static` policy allows containers in `Guaranteed` pods with integer CPU
`requests` access to exclusive CPUs on the node. This exclusivity is enforced
using the [cpuset cgroup controller](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt).
-->
### static 策略   {#static-policy}

`static` 策略针对具有整数型 CPU `requests` 的 `Guaranteed` Pod，
它允许该类 Pod 中的容器访问节点上的独占 CPU 资源。这种独占性是使用
[cpuset cgroup 控制器](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt)来实现的。

{{< note >}}
<!--
System services such as the container runtime and the kubelet itself can continue to run on these exclusive CPUs.  The exclusivity only extends to other pods.
-->
诸如容器运行时和 kubelet 本身的系统服务可以继续在这些独占 CPU 上运行。独占性仅针对其他 Pod。
{{< /note >}}

{{< note >}}
<!--
CPU Manager doesn't support offlining and onlining of
CPUs at runtime. Also, if the set of online CPUs changes on the node,
the node must be drained and CPU manager manually reset by deleting the
state file `cpu_manager_state` in the kubelet root directory.
-->
CPU 管理器不支持运行时下线和上线 CPU。此外，如果节点上的在线 CPU 集合发生变化，
则必须驱逐节点上的 Pod，并通过删除 kubelet 根目录中的状态文件 `cpu_manager_state`
来手动重置 CPU 管理器。
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
core ID.  This shared pool is the set of CPUs on which any containers in
`BestEffort` and `Burstable` pods run. Containers in `Guaranteed` pods with fractional
CPU `requests` also run on CPUs in the shared pool. Only containers that are
both part of a `Guaranteed` pod and have integer CPU `requests` are assigned
exclusive CPUs.
--->
此策略管理一个 CPU 共享池，该共享池最初包含节点上所有的 CPU 资源。
可独占性 CPU 资源数量等于节点的 CPU 总量减去通过 kubelet `--kube-reserved` 或 `--system-reserved`
参数保留的 CPU 资源。
从 1.17 版本开始，可以通过 kubelet `--reserved-cpus` 参数显式地指定 CPU 预留列表。
由 `--reserved-cpus` 指定的显式 CPU 列表优先于由 `--kube-reserved` 和 `--system-reserved`
指定的 CPU 预留。
通过这些参数预留的 CPU 是以整数方式，按物理核心 ID 升序从初始共享池获取的。
共享池是 `BestEffort` 和 `Burstable` Pod 运行的 CPU 集合。
`Guaranteed` Pod 中的容器，如果声明了非整数值的 CPU `requests`，也将运行在共享池的 CPU 上。
只有 `Guaranteed` Pod 中，指定了整数型 CPU `requests` 的容器，才会被分配独占 CPU 资源。

{{< note >}}
<!--
The kubelet requires a CPU reservation greater than zero be made
using either `--kube-reserved` and/or `--system-reserved` or `--reserved-cpus` when
the static policy is enabled. This is because zero CPU reservation would allow the shared
pool to become empty.
--->
当启用 static 策略时，要求使用 `--kube-reserved` 和/或 `--system-reserved` 或
`--reserved-cpus` 来保证预留的 CPU 值大于零。
这是因为零预留 CPU 值可能使得共享池变空。
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

Consider the containers in the following pod specs:
-->
当 `Guaranteed` Pod 调度到节点上时，如果其容器符合静态分配要求，
相应的 CPU 会被从共享池中移除，并放置到容器的 cpuset 中。
因为这些容器所使用的 CPU 受到调度域本身的限制，所以不需要使用 CFS 配额来进行 CPU 的绑定。
换言之，容器 cpuset  中的 CPU 数量与 Pod 规约中指定的整数型 CPU `limit` 相等。
这种静态分配增强了 CPU 亲和性，减少了 CPU 密集的工作负载在节流时引起的上下文切换。

考虑以下 Pod 规格的容器：

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
上例的 Pod 属于 `BestEffort` QoS 类，因为其未指定 `requests` 或 `limits` 值。
所以该容器运行在共享 CPU 池中。

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
上例的 Pod 属于 `Burstable` QoS 类，因为其资源 `requests` 不等于 `limits`，且未指定 `cpu` 数量。
所以该容器运行在共享 CPU 池中。

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
上例的 Pod 属于 `Burstable` QoS 类，因为其资源 `requests` 不等于 `limits`。
所以该容器运行在共享 CPU 池中。

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
上例的 Pod 属于 `Guaranteed` QoS 类，因为其 `requests` 值与 `limits` 相等。
同时，容器对 CPU 资源的限制值是一个大于或等于 1 的整数值。
所以，该 `nginx` 容器被赋予 2 个独占 CPU。

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
上例的 Pod 属于 `Guaranteed` QoS 类，因为其 `requests` 值与 `limits` 相等。
但是容器对 CPU 资源的限制值是一个小数。所以该容器运行在共享 CPU 池中。

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
上例的 Pod 属于 `Guaranteed` QoS 类，因其指定了 `limits` 值，同时当未显式指定时，
`requests` 值被设置为与 `limits` 值相等。
同时，容器对 CPU 资源的限制值是一个大于或等于 1 的整数值。
所以，该 `nginx` 容器被赋予 2 个独占 CPU。

<!--
#### Static policy options

You can toggle groups of options on and off based upon their maturity level
using the following feature gates:
* `CPUManagerPolicyBetaOptions` default enabled. Disable to hide beta-level options.
* `CPUManagerPolicyAlphaOptions` default disabled. Enable to show alpha-level options.
You will still have to enable each option using the `CPUManagerPolicyOptions` kubelet option.

The following policy options exist for the static `CPUManager` policy:
* `full-pcpus-only` (beta, visible by default) (1.22 or higher)
* `distribute-cpus-across-numa` (alpha, hidden by default) (1.23 or higher)
* `align-by-socket` (alpha, hidden by default) (1.25 or higher)
* `distribute-cpus-across-cores` (alpha, hidden by default) (1.31 or higher)
-->
#### Static 策略选项

你可以使用以下特性门控根据成熟度级别打开或关闭选项组：
* `CPUManagerPolicyBetaOptions` 默认启用。禁用以隐藏 beta 级选项。
* `CPUManagerPolicyAlphaOptions` 默认禁用。启用以显示 alpha 级选项。
你仍然必须使用 `CPUManagerPolicyOptions` kubelet 选项启用每个选项。

静态 `CPUManager` 策略存在以下策略选项：
* `full-pcpus-only`（Beta，默认可见）（1.22 或更高版本）
* `distribute-cpus-across-numa`（Alpha，默认隐藏）（1.23 或更高版本）
* `align-by-socket`（Alpha，默认隐藏）（1.25 或更高版本）
* `distribute-cpus-across-cores` (Alpha，默认隐藏) (1.31 或更高版本)

<!--
If the `full-pcpus-only` policy option is specified, the static policy will always allocate full physical cores.
By default, without this option, the static policy allocates CPUs using a topology-aware best-fit allocation.
On SMT enabled systems, the policy can allocate individual virtual cores, which correspond to hardware threads.
This can lead to different containers sharing the same physical cores; this behaviour in turn contributes
to the [noisy neighbours problem](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).
-->
如果使用 `full-pcpus-only` 策略选项，static 策略总是会分配完整的物理核心。
默认情况下，如果不使用该选项，static 策略会使用拓扑感知最适合的分配方法来分配 CPU。
在启用了 SMT 的系统上，此策略所分配是与硬件线程对应的、独立的虚拟核。
这会导致不同的容器共享相同的物理核心，
该行为进而会导致[吵闹的邻居问题](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors)。
<!--
With the option enabled, the pod will be admitted by the kubelet only if the CPU request of all its containers
can be fulfilled by allocating full physical cores.
If the pod does not pass the admission, it will be put in Failed state with the message `SMTAlignmentError`.
-->
启用该选项之后，只有当一个 Pod 里所有容器的 CPU 请求都能够分配到完整的物理核心时，
kubelet 才会接受该 Pod。
如果 Pod 没有被准入，它会被置于 Failed 状态，错误消息是 `SMTAlignmentError`。

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
如果使用 `distribute-cpus-across-numa` 策略选项，
在需要多个 NUMA 节点来满足分配的情况下，
static 策略会在 NUMA 节点上平均分配 CPU。
默认情况下，`CPUManager` 会将 CPU 分配到一个 NUMA 节点上，直到它被填满，
剩余的 CPU 会简单地溢出到下一个 NUMA 节点。
这会导致依赖于同步屏障（以及类似的同步原语）的并行代码出现不期望的瓶颈，
因为此类代码的运行速度往往取决于最慢的工作线程
（由于至少一个 NUMA 节点存在可用 CPU 较少的情况，因此速度变慢）。
通过在 NUMA 节点上平均分配 CPU，
应用程序开发人员可以更轻松地确保没有某个工作线程单独受到 NUMA 影响，
从而提高这些类型应用程序的整体性能。

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
如果指定了 `align-by-socket` 策略选项，那么在决定如何分配 CPU 给容器时，CPU 将被视为在 CPU 的插槽边界对齐。
默认情况下，`CPUManager` 在 NUMA 边界对齐 CPU 分配，如果需要从多个 NUMA 节点提取出 CPU 以满足分配，将可能会导致系统性能下降。
尽管该默认策略试图确保从 NUMA 节点的**最小**数量分配所有 CPU，但不能保证这些 NUMA 节点将位于同一个 CPU 的插槽上。
通过指示 `CPUManager` 在 CPU 的插槽边界而不是 NUMA 边界显式对齐 CPU，我们能够避免此类问题。
注意，此策略选项不兼容 `TopologyManager` 与 `single-numa-node` 策略，并且不适用于 CPU 的插槽数量大于 NUMA 节点数量的硬件。

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
如果指定了 `distribute-cpus-across-cores` 策略选项，
静态策略将尝试将虚拟核（硬件线程）分配到不同的物理核上。默认情况下，
`CPUManager` 倾向于将 CPU 打包到尽可能少的物理核上，
这可能导致同一物理核上的 CPU 争用，从而导致性能瓶颈。
启用 `distribute-cpus-across-cores` 策略后，静态策略将确保 CPU 尽可能分布在多个物理核上，
从而减少同一物理核上的争用，提升整体性能。然而，需要注意的是，当系统负载较重时，
这一策略的效果可能会减弱。在这种情况下，减少争用的好处会减少。
相反，默认行为可以帮助减少跨核的通信开销，在高负载条件下可能会提供更好的性能。

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
可以通过将 `full-pcpus-only=true` 添加到 CPUManager 策略选项来启用 `full-pcpus-only` 选项。
同样地，可以通过将 `distribute-cpus-across-numa=true` 添加到 CPUManager 策略选项来启用 `distribute-cpus-across-numa` 选项。
当两者都设置时，它们是“累加的”，因为 CPU 将分布在 NUMA 节点的 full-pcpus 块中，而不是单个核心。
可以通过将 `align-by-socket=true` 添加到 `CPUManager` 策略选项来启用 `align-by-socket` 策略选项。
同样，也能够将 `distribute-cpus-across-numa=true` 添加到 `full-pcpus-only`
和 `distribute-cpus-across-numa` 策略选项中。

<!--
The `distribute-cpus-across-cores` option can be enabled by adding
`distribute-cpus-across-cores=true` to the `CPUManager` policy options.
It cannot be used with `full-pcpus-only` or `distribute-cpus-across-numa` policy
options together at this moment.
-->
可以通过将 `distribute-cpus-across-cores=true` 添加到 `CPUManager` 策略选项中来启用 `distribute-cpus-across-cores` 选项。
当前，该选项不能与 `full-pcpus-only` 或 `distribute-cpus-across-numa` 策略选项同时使用。