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

For detailed information on how the kubelet implements resource management, please refer to the
[Node ResourceManagers](/docs/concepts/policy/node-resource-managers) documentation.
-->
有关资源管理的详细信息，
请参阅 [Pod 和容器的资源管理](/zh-cn/docs/concepts/configuration/manage-resources-containers)文档。

有关 kubelet 如何实现资源管理的详细信息，
请参阅[节点资源管理](/zh-cn/docs/concepts/policy/node-resource-managers)文档。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
If you are running an older version of Kubernetes, please look at the documentation for the version you are actually running.
-->
如果你正在运行一个旧版本的 Kubernetes，请参阅与该版本对应的文档。

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
## 配置 CPU 管理策略   {#cpu-management-policies}

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
## Windows Support

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

CPU Manager support can be enabled on Windows by using the `WindowsCPUAndMemoryAffinity` feature gate
and it requires support in the container runtime.
Once the feature gate is enabled, follow the steps below to configure the [CPU manager policy](#configuration).
-->
## Windows 支持

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

可以通过使用 "WindowsCPUAndMemoryAffinity" 特性门控在 Windows 上启用 CPU 管理器支持。
这个能力还需要容器运行时的支持。

<!--
## Configuration

The CPU Manager policy is set with the `--cpu-manager-policy` kubelet
flag or the `cpuManagerPolicy` field in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).
There are two supported policies:
-->
## 配置   {#configuration}

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
## Changing the CPU Manager Policy

Since the CPU manager policy can only be applied when kubelet spawns new pods, simply changing from
"none" to "static" won't apply to existing pods. So in order to properly change the CPU manager
policy on a node, perform the following steps:
-->
## 更改 CPU 管理器策略   {#changing-the-cpu-manager-policy}

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

{{< note >}}
<!--
if the set of online CPUs changes on the node, the node must be drained and CPU manager manually reset by deleting the
state file `cpu_manager_state` in the kubelet root directory.
-->
如果节点上的在线 CPU 集发生变化，则必须腾空该节点，并通过删除 kubelet
根目录中的状态文件 `cpu_manager_state` 来手动重置 CPU 管理器。
{{< /note >}}

<!--
### `none` policy configuration

This policy has no extra configuration items.
-->
### `none` 策略配置

该策略没有额外的配置项。

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
### `static` 策略配置

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
### Static policy options {#cpu-policy-static--options}

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
* `strict-cpu-reservation` (beta, visible by default) (1.32 or higher)
* `prefer-align-cpus-by-uncorecache` (alpha, hidden by default) (1.32 or higher)
-->
### Static 策略选项  {#cpu-policy-static--options}

你可以使用以下特性门控根据成熟度级别打开或关闭选项组：
* `CPUManagerPolicyBetaOptions` 默认启用。禁用以隐藏 beta 级选项。
* `CPUManagerPolicyAlphaOptions` 默认禁用。启用以显示 alpha 级选项。
你仍然必须使用 `CPUManagerPolicyOptions` kubelet 选项启用每个选项。

静态 `CPUManager` 策略存在以下策略选项：
* `full-pcpus-only`（Beta，默认可见）（1.22 或更高版本）
* `distribute-cpus-across-numa`（Alpha，默认隐藏）（1.23 或更高版本）
* `align-by-socket`（Alpha，默认隐藏）（1.25 或更高版本）
* `distribute-cpus-across-cores` (Alpha，默认隐藏) (1.31 或更高版本)
* `strict-cpu-reservation` (Beta，默认可见) (1.32 或更高版本)
* `prefer-align-cpus-by-uncorecache` (Alpha, 默认隐藏) (1.32 或更高版本)

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
可以通过将 `strict-cpu-reservation=true` 添加到 CPUManager 策略选项中，
然后删除 `/var/lib/kubelet/cpu_manager_state` 文件并重新启动 kubelet
来启用 `strict-cpu-reservation` 选项。

可以通过将 `prefer-align-cpus-by-uncorecache` 添加到 `CPUManager` 策略选项来启用
`prefer-align-cpus-by-uncorecache` 选项。
如果使用不兼容的选项，kubelet 将无法启动，并在日志中解释所出现的错误。

有关你可以配置的各个选项的行为的模式详细信息，请参阅[节点资源管理](/zh-cn/docs/concepts/policy/node-resource-managers)文档。
