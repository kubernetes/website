---
title: 在 Kubernetes 集群中使用 sysctl
content_type: task
weight: 400
---
<!--
title: Using sysctls in a Kubernetes Cluster
reviewers:
- sttts
content_type: task
weight: 400
--->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}
<!--
This document describes how to configure and use kernel parameters within a
Kubernetes cluster using the {{< glossary_tooltip term_id="sysctl" >}}
interface.
-->
本文档介绍如何通过 {{< glossary_tooltip term_id="sysctl" >}}
接口在 Kubernetes 集群中配置和使用内核参数。

{{< note >}}
<!--
Starting from Kubernetes version 1.23, the kubelet supports the use of either `/` or `.`
as separators for sysctl names.
Starting from Kubernetes version 1.25, setting Sysctls for a Pod supports setting sysctls with slashes.
For example, you can represent the same sysctl name as `kernel.shm_rmid_forced` using a
period as the separator, or as `kernel/shm_rmid_forced` using a slash as a separator.
For more sysctl parameter conversion method details, please refer to
the page [sysctl.d(5)](https://man7.org/linux/man-pages/man5/sysctl.d.5.html) from
the Linux man-pages project.
-->
从 Kubernetes 1.23 版本开始，kubelet 支持使用 `/` 或 `.` 作为 sysctl 参数的分隔符。
从 Kubernetes 1.25 版本开始，支持为 Pod 设置 sysctl 时使用设置名字带有斜线的 sysctl。
例如，你可以使用点或者斜线作为分隔符表示相同的 sysctl 参数，以点作为分隔符表示为： `kernel.shm_rmid_forced`，
或者以斜线作为分隔符表示为：`kernel/shm_rmid_forced`。
更多 sysctl 参数转换方法详情请参考 Linux man-pages
[sysctl.d(5)](https://man7.org/linux/man-pages/man5/sysctl.d.5.html)。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< note >}}
<!--
`sysctl` is a Linux-specific command-line tool used to configure various kernel parameters
and it is not available on non-Linux operating systems.
-->
`sysctl` 是一个 Linux 特有的命令行工具，用于配置各种内核参数，
它在非 Linux 操作系统上无法使用。
{{< /note >}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
For some steps, you also need to be able to reconfigure the command line
options for the kubelets running on your cluster.
-->
对一些步骤，你需要能够重新配置在你的集群里运行的 kubelet 命令行的选项。

<!-- steps -->

<!--
## Listing all Sysctl Parameters
-->
## 获取 Sysctl 的参数列表   {#listing-all-sysctl-parameters}

<!--
In Linux, the sysctl interface allows an administrator to modify kernel
parameters at runtime. Parameters are available via the `/proc/sys/` virtual
process file system. The parameters cover various subsystems such as:
-->
在 Linux 中，管理员可以通过 sysctl 接口修改内核运行时的参数。在 `/proc/sys/`
虚拟文件系统下存放许多内核参数。这些参数涉及了多个内核子系统，如：

<!--
- kernel (common prefix: `kernel.`)
- networking (common prefix: `net.`)
- virtual memory (common prefix: `vm.`)
- MDADM (common prefix: `dev.`)
- More subsystems are described in [Kernel docs](https://www.kernel.org/doc/Documentation/sysctl/README).
-->
- 内核子系统（通常前缀为: `kernel.`）
- 网络子系统（通常前缀为: `net.`）
- 虚拟内存子系统（通常前缀为: `vm.`）
- MDADM 子系统（通常前缀为: `dev.`）
- 更多子系统请参见[内核文档](https://www.kernel.org/doc/Documentation/sysctl/README)。

<!--
To get a list of all parameters, you can run
--->
若要获取完整的参数列表，请执行以下命令：

```shell
sudo sysctl -a
```

<!--
## Safe and Unsafe Sysctls

Kubernetes classes sysctls as either _safe_ or _unsafe_. In addition to proper
namespacing, a _safe_ sysctl must be properly _isolated_ between pods on the
same node. This means that setting a _safe_ sysctl for one pod
-->
## 安全和非安全的 Sysctl 参数  {#safe-and-unsafe-sysctls}

Kubernetes 将 sysctl 参数分为 **安全** 和 **非安全的**。
**安全** 的 sysctl 参数除了需要设置恰当的命名空间外，在同一节点上的不同 Pod
之间也必须是 **相互隔离的**。这意味着 Pod 上设置 **安全的** sysctl 参数时：

<!--
- must not have any influence on any other pod on the node
- must not allow to harm the node's health
- must not allow to gain CPU or memory resources outside of the resource limits
  of a pod.
-->
- 必须不能影响到节点上的其他 Pod
- 必须不能损害节点的健康
- 必须不允许使用超出 Pod 的资源限制的 CPU 或内存资源。

<!--
By far, most of the _namespaced_ sysctls are not necessarily considered _safe_.
The following sysctls are supported in the _safe_ set:
-->
至今为止，大多数 **有命名空间的** sysctl 参数不一定被认为是 **安全** 的。
以下几种 sysctl 参数是 **安全的**：

<!--
- `kernel.shm_rmid_forced`;
- `net.ipv4.ip_local_port_range`;
- `net.ipv4.tcp_syncookies`;
- `net.ipv4.ping_group_range` (since Kubernetes 1.18);
- `net.ipv4.ip_unprivileged_port_start` (since Kubernetes 1.22);
- `net.ipv4.ip_local_reserved_ports` (since Kubernetes 1.27, needs kernel 3.16+);
- `net.ipv4.tcp_keepalive_time` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_fin_timeout` (since Kubernetes 1.29, needs kernel 4.6+);
- `net.ipv4.tcp_keepalive_intvl` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_keepalive_probes` (since Kubernetes 1.29, needs kernel 4.5+).
- `net.ipv4.tcp_rmem` (since Kubernetes 1.32, needs kernel 4.15+).
- `net.ipv4.tcp_wmem` (since Kubernetes 1.32, needs kernel 4.15+).
- `net.ipv4.tcp_slow_start_after_idle` (since Kubernetes 1.37, needs kernel 4.15+).
- `net.ipv4.tcp_notsent_lowat` (since Kubernetes 1.37, needs kernel 4.6+).
-->
- `kernel.shm_rmid_forced`；
- `net.ipv4.ip_local_port_range`；
- `net.ipv4.tcp_syncookies`；
- `net.ipv4.ping_group_range`（从 Kubernetes 1.18 开始）；
- `net.ipv4.ip_unprivileged_port_start`（从 Kubernetes 1.22 开始）；
- `net.ipv4.ip_local_reserved_ports`（从 Kubernetes 1.27 开始，需要 kernel 3.16+）；
- `net.ipv4.tcp_keepalive_time`（从 Kubernetes 1.29 开始，需要 kernel 4.5+）；
- `net.ipv4.tcp_fin_timeout`（从 Kubernetes 1.29 开始，需要 kernel 4.6+）；
- `net.ipv4.tcp_keepalive_intvl`（从 Kubernetes 1.29 开始，需要 kernel 4.5+）；
- `net.ipv4.tcp_keepalive_probes`（从 Kubernetes 1.29 开始，需要 kernel 4.5+）；
- `net.ipv4.tcp_rmem`（从 Kubernetes 1.32 开始，需要 kernel 4.15+）；
- `net.ipv4.tcp_wmem`（从 Kubernetes 1.32 开始，需要 kernel 4.15+）；
- `net.ipv4.tcp_slow_start_after_idle`（从 Kubernetes 1.37 开始，需要 kernel 4.15+）；
- `net.ipv4.tcp_notsent_lowat`（从 Kubernetes 1.37 开始，需要 kernel 4.6+）。

{{< note >}}
<!--
There are some exceptions to the set of safe sysctls:

- The `net.*` sysctls are not allowed with host networking enabled.
- The `net.ipv4.tcp_syncookies` sysctl is not namespaced on Linux kernel version 4.5 or lower.
-->
安全 sysctl 参数有一些例外：

- `net.*` sysctl 参数不允许在启用主机网络的情况下使用。
- `net.ipv4.tcp_syncookies` sysctl 参数在 Linux 内核 4.5 或更低的版本中是无命名空间的。
{{< /note >}}

<!--
This list will be extended in future Kubernetes versions when the kubelet
supports better isolation mechanisms.
-->
在未来的 Kubernetes 版本中，若 kubelet 支持更好的隔离机制，
则上述列表中将会列出更多 **安全的** sysctl 参数。

<!--
### Enabling Unsafe Sysctls

All _safe_ sysctls are enabled by default.
-->
### 启用非安全的 Sysctl 参数   {#enabling-unsafe-sysctls}

所有 **安全的** sysctl 参数都默认启用。

<!--
All _unsafe_ sysctls are disabled by default and must be allowed manually by the
cluster admin on a per-node basis. Pods with disabled unsafe sysctls will be
scheduled, but will fail to launch.
-->
所有 **非安全的** sysctl 参数都默认禁用，且必须由集群管理员在每个节点上手动开启。
那些设置了不安全 sysctl 参数的 Pod 仍会被调度，但无法正常启动。

<!--
With the warning above in mind, the cluster admin can allow certain _unsafe_
sysctls for very special situations such as high-performance or real-time
application tuning. _Unsafe_ sysctls are enabled on a node-by-node basis with a
flag of the kubelet; for example:
-->
参考上述警告，集群管理员只有在一些非常特殊的情况下（如：高可用或实时应用调整），
才可以启用特定的 **非安全的** sysctl 参数。
如需启用 **非安全的** sysctl 参数，请你在每个节点上分别设置 kubelet 命令行参数，例如：

```shell
kubelet --allowed-unsafe-sysctls \
  'kernel.msg*,net.core.somaxconn' ...
```

<!--
For {{< glossary_tooltip term_id="minikube" >}}, this can be done via the `extra-config` flag:
-->
如果你使用 {{< glossary_tooltip term_id="minikube" >}}，可以通过 `extra-config` 参数来配置：

```shell
minikube start --extra-config="kubelet.allowed-unsafe-sysctls=kernel.msg*,net.core.somaxconn"...
```
<!--
Only _namespaced_ sysctls can be enabled this way.
-->
只有 **有命名空间的** sysctl 参数可以通过该方式启用。

<!--
## Setting Sysctls for a Pod

A number of sysctls are _namespaced_ in today's Linux kernels. This means that
they can be set independently for each pod on a node. Only namespaced sysctls
are configurable via the pod securityContext within Kubernetes.
-->
## 设置 Pod 的 Sysctl 参数   {#setting-sysctls-for-pod}

目前，在 Linux 内核中，有许多的 sysctl 参数都是 **有命名空间的**。
这就意味着可以为节点上的每个 Pod 分别去设置它们的 sysctl 参数。
在 Kubernetes 中，只有那些有命名空间的 sysctl 参数可以通过 Pod 的 securityContext 对其进行配置。

<!--
The following sysctls are known to be namespaced. This list could change
in future versions of the Linux kernel.
-->
以下列出有命名空间的 sysctl 参数，在未来的 Linux 内核版本中，此列表可能会发生变化。

- `kernel.shm*`,
- `kernel.msg*`,
- `kernel.sem`,
- `fs.mqueue.*`,
<!--
- Those `net.*` that can be set in container networking namespace. However,
  there are exceptions (e.g., `net.netfilter.nf_conntrack_max` and
  `net.netfilter.nf_conntrack_expect_max` can be set in container networking
  namespace but are unnamespaced before Linux 5.12.2).
-->
- 那些可以在容器网络命名空间中设置的 `net.*`。但是，也有例外（例如
  `net.netfilter.nf_conntrack_max` 和 `net.netfilter.nf_conntrack_expect_max`
  可以在容器网络命名空间中设置，但在 Linux 5.12.2 之前它们是无命名空间的）。

<!--
Sysctls with no namespace are called _node-level_ sysctls. If you need to set
them, you must manually configure them on each node's operating system, or by
using a DaemonSet with privileged containers.
-->
没有命名空间的 sysctl 参数称为 **节点级别的** sysctl 参数。
如果需要对其进行设置，则必须在每个节点的操作系统上手动地去配置它们，
或者通过在 DaemonSet 中运行特权模式容器来配置。

<!--
Use the pod securityContext to configure namespaced sysctls. The securityContext
applies to all containers in the same pod.
-->
可使用 Pod 的 securityContext 来配置有命名空间的 sysctl 参数，
securityContext 应用于同一个 Pod 中的所有容器。

<!--
This example uses the pod securityContext to set a safe sysctl
`kernel.shm_rmid_forced` and two unsafe sysctls `net.core.somaxconn` and
`kernel.msgmax`. There is no distinction between _safe_ and _unsafe_ sysctls in
the specification.
-->
此示例中，使用 Pod SecurityContext 来对一个安全的 sysctl 参数
`kernel.shm_rmid_forced` 以及两个非安全的 sysctl 参数
`net.core.somaxconn` 和 `kernel.msgmax` 进行设置。
在 Pod 规约中对 **安全的** 和 **非安全的** sysctl 参数不做区分。

{{< warning >}}
<!--
Only modify sysctl parameters after you understand their effects, to avoid
destabilizing your operating system.
-->
为了避免破坏操作系统的稳定性，请你在了解变更后果之后再修改 sysctl 参数。
{{< /warning >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
spec:
  securityContext:
    sysctls:
    - name: kernel.shm_rmid_forced
      value: "0"
    - name: net.core.somaxconn
      value: "1024"
    - name: kernel.msgmax
      value: "65536"
  ...
```

<!-- discussion -->

{{< warning >}}
<!--
Due to their nature of being _unsafe_, the use of _unsafe_ sysctls
is at-your-own-risk and can lead to severe problems like wrong behavior of
containers, resource shortage or complete breakage of a node.
-->
由于 **非安全的** sysctl 参数其本身具有不稳定性，在使用 **非安全的** sysctl 参数时可能会导致一些严重问题，
如容器的错误行为、机器资源不足或节点被完全破坏，用户需自行承担风险。
{{< /warning >}}

<!--
It is good practice to consider nodes with special sysctl settings as
_tainted_ within a cluster, and only schedule pods onto them which need those
sysctl settings. It is suggested to use the Kubernetes [_taints and toleration_
feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) to implement this.
-->
最佳实践方案是将集群中具有特殊 sysctl 设置的节点视为 **有污点的**，并且只调度需要使用到特殊
sysctl 设置的 Pod 到这些节点上。建议使用 Kubernetes
的[污点和容忍度特性](/docs/reference/generated/kubectl/kubectl-commands/#taint) 来实现它。

<!--
A pod with the _unsafe_ sysctls will fail to launch on any node which has not
enabled those two _unsafe_ sysctls explicitly. As with _node-level_ sysctls it
is recommended to use
[_taints and toleration_ feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) or
[taints on nodes](/docs/concepts/scheduling-eviction/taint-and-toleration/)
to schedule those pods onto the right nodes.
-->
设置了 **非安全的** sysctl 参数的 Pod 在禁用了这两种 **非安全的** sysctl 参数配置的节点上启动都会失败。
与 **节点级别的** sysctl 一样，
建议开启[污点和容忍度特性](/docs/reference/generated/kubectl/kubectl-commands/#taint)或
[为节点配置污点](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)以便将
Pod 调度到正确的节点之上。

<!--
## Setting Sysctls for All Pods
-->
## 为所有 Pod 设置 sysctl {#setting-sysctls-for-all-pods}

{{< feature-state feature_gate_name="DefaultPodSysctls" >}}

<!--
You can configure a default set of kernel parameters (sysctls) that the `kubelet`
applies to all Pods running on a Linux Node, including {{< glossary_tooltip text="static Pods" term_id="static-pod" >}}.
This is useful when Node administrators need to enforce consistent kernel parameter
tuning across all workloads on a Node or within a Node group (for example,
adjusting TCP buffer sizes for high-performance networking) without requiring
every Pod specification to individually set `securityContext.sysctls`.
-->
你可以配置一组默认的内核参数（sysctl），由 `kubelet` 应用到运行于 Linux 节点上的所有 Pod，
包括{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}}。
当节点管理员需要在节点上或节点组内对所有工作负载强制实施一致的内核参数调优
（例如，为高性能网络调整 TCP 缓冲区大小），而又不要求每个 Pod 规约都单独设置
`securityContext.sysctls` 时，此特性非常有用。

<!--
To use this feature, enable the `DefaultPodSysctls`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for the `kubelet` and specify key-value pairs in the `defaultPodSysctls` field
of your
[KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
要使用此特性，请为 `kubelet` 启用 `DefaultPodSysctls`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并在你的
[KubeletConfiguration](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
中的 `defaultPodSysctls` 字段中指定键值对。

<!--
The `defaultPodSysctls` field supports all namespaced sysctls (`kernel.shm*`,
`kernel.msg*`, `kernel.sem`, `kernel.domainname`, `fs.mqueue.*`, `net.*`, and
`user.*`), covering both _safe_ and _unsafe_ sysctls. Because these defaults
are configured directly by the Node administrator on the `kubelet`, you do not
need to allow-list unsafe sysctls in `allowedUnsafeSysctls`.
-->
`defaultPodSysctls` 字段支持所有带命名空间的 sysctl（`kernel.shm*`、
`kernel.msg*`、`kernel.sem`、`kernel.domainname`、`fs.mqueue.*`、`net.*` 和
`user.*`），涵盖**安全的**和**非安全的** sysctl。由于这些默认值由节点管理员直接在
`kubelet` 上配置，因此你无需在 `allowedUnsafeSysctls` 中为非安全 sysctl 设置白名单。

<!--
The following example configures the `kubelet` to apply default sysctls across
multiple namespaced subsystems (networking, IPC, and user namespaces) to all
Pods on the Node:
-->
以下示例配置 `kubelet` 将跨越多个命名空间子系统（网络、IPC 和用户命名空间）的默认
sysctl 应用到节点上的所有 Pod：

<!--
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  DefaultPodSysctls: true
defaultPodSysctls:
  # Network namespace sysctls (skipped if Pod uses hostNetwork: true)
  net.ipv4.ip_forward: "1"
  net.ipv4.tcp_rmem: "4096 87380 16777216"
  net.ipv4.tcp_wmem: "4096 65536 16777216"
  net.core.somaxconn: "1024"
  # IPC namespace sysctls (skipped if Pod uses hostIPC: true)
  kernel.shmall: "1048576"
  kernel.msgmax: "65536"
  kernel.sem: "250 32000 32 128"
  fs.mqueue.msg_max: "1024"
  # User namespace sysctls (skipped if Pod shares the host user namespace)
  user.max_user_namespaces: "1000"
```
-->
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  DefaultPodSysctls: true
defaultPodSysctls:
  # 网络命名空间 sysctl（如果 Pod 使用 hostNetwork: true 则跳过）
  net.ipv4.ip_forward: "1"
  net.ipv4.tcp_rmem: "4096 87380 16777216"
  net.ipv4.tcp_wmem: "4096 65536 16777216"
  net.core.somaxconn: "1024"
  # IPC 命名空间 sysctl（如果 Pod 使用 hostIPC: true 则跳过）
  kernel.shmall: "1048576"
  kernel.msgmax: "65536"
  kernel.sem: "250 32000 32 128"
  fs.mqueue.msg_max: "1024"
  # 用户命名空间 sysctl（如果 Pod 共享宿主机用户命名空间则跳过）
  user.max_user_namespaces: "1000"
```

<!--
### Precedence and Overriding

Values explicitly set in a Pod's `spec.securityContext.sysctls` always override
the matching default values specified in the `kubelet`'s `defaultPodSysctls`. Overrides
are applied individually on a per-key basis: if a Pod specifies a value for a sysctl
that is also defined in `defaultPodSysctls`, the Pod-level setting takes precedence
for that specific sysctl, while other defaults continue to apply. Note that there are
no groups of connected sysctl settings; if your workload overrides a sysctl that is part
of a related group (for example, networking buffer sizes), the Pod specification must
account for all related settings as needed.
-->
### 优先级与覆盖 {#precedence-and-overriding}

在 Pod 的 `spec.securityContext.sysctls` 中显式设置的值始终会覆盖 `kubelet` 的
`defaultPodSysctls` 中指定的对应默认值。覆盖以逐键方式独立应用：如果 Pod 为某个在
`defaultPodSysctls` 中也有定义的 sysctl 指定了值，则对该特定 sysctl 而言，
Pod 级别的设置优先，而其他默认值继续生效。请注意，sysctl 设置之间不存在关联分组；
如果你的工作负载覆盖了某个关联组（例如网络缓冲区大小）中的 sysctl，
则 Pod 规约必须按需处理所有相关设置。

<!--
### Host Namespaces and Filtering

The `kubelet` applies default sysctls during Pod sandbox creation only if the Pod
runs in a separate namespace for the corresponding subsystem. If a Pod shares a
host namespace, default sysctls for that namespace are skipped for that Pod:
-->
### 宿主机命名空间与过滤 {#host-namespaces-and-filtering}

只有当 Pod 在相应的子系统独立命名空间中运行时，`kubelet` 才会应用默认的 sysctl 设置；
如果 Pod 共享宿主机的命名空间，则该 Pod 将跳过针对该命名空间的默认 sysctl 设置：

<!--
- `net.*` sysctls are skipped if the Pod uses host networking (`hostNetwork: true`).
- IPC sysctls (`kernel.sem`, `kernel.msg*`, `kernel.shm*`, `fs.mqueue.*`) are
  skipped if the Pod uses host IPC (`hostIPC: true`).
- `user.*` sysctls are skipped if the Pod shares the host user namespace
  (`hostUsers: true` or unset).
- UTS sysctls (`kernel.domainname`) are skipped if the Pod uses host networking
  (`hostNetwork: true`).
-->
- 如果 Pod 使用宿主机网络（`hostNetwork: true`），则会跳过 `net.*` 类型的 sysctl 设置。
- 如果 Pod 使用了宿主机 IPC（即 `hostIPC: true`），则会跳过 IPC sysctl 设置
  （`kernel.sem`、`kernel.msg*`、`kernel.shm*`、`fs.mqueue.*`）。
- 如果 Pod 共享宿主机用户命名空间（`hostUsers: true` 或未设置），则会跳过 `user.*` 类型的 sysctl 设置。
- 如果 Pod 使用宿主机网络（`hostNetwork: true`），则跳过 UTS sysctl（`kernel.domainname`）设置。

<!--
### Validation and Limitations

The `kubelet` validates `defaultPodSysctls` during startup. Non-namespaced
sysctls, invalid sysctl names, or duplicate keys will prevent the `kubelet` from
starting.
-->
### 校验与限制 {#validation-and-limitations}

`kubelet` 在启动期间会校验 `defaultPodSysctls`。非命名空间级别的 sysctl、无效的
sysctl 名称或重复的键将阻止 `kubelet` 启动。

<!--
In addition, certain `net.*` sysctls might be unnamespaced depending on your
kernel version. Specifying an unnamespaced `net.*` sysctl in `defaultPodSysctls`
will cause Pod sandbox creation to fail with a `FailedCreatePodSandBox` error.
The Pod will keep retrying to create a sandbox forever. Ensure that all
specified sysctls are namespaced on your Node's kernel.
-->
此外，某些 `net.*` sysctl 可能是非命名空间级别的，具体取决于你的内核版本。在
`defaultPodSysctls` 中指定非命名空间级别的 `net.*` sysctl 将导致 Pod 沙箱创建失败，
并报 `FailedCreatePodSandBox` 错误。Pod 将会永远重试创建沙箱。请确保所有指定的
sysctl 在你的节点内核上都是命名空间级别的。

<!--
Changes to `defaultPodSysctls` apply only to newly created Pods. The `kubelet`
does not dynamically reconfigure existing Pods (see [What Happens After a Node Restart](/docs/reference/node/what-happens-on-restart/#impact-of-a-kubelet-restart)).
Existing Pods continue to run with the sysctls applied when their sandbox was created.
If you want existing Pods to adopt the updated default sysctls, you must recreate those
Pods (for example, by cordoning and draining the Node).
-->
对 `defaultPodSysctls` 的更改仅应用于新建的 Pod。`kubelet` 不会动态重新配置已存在的
Pod（参见[节点重启后会发生什么](/zh-cn/docs/reference/node/what-happens-on-restart/#impact-of-a-kubelet-restart)）。
已存在的 Pod 将继续使用其沙箱创建时所应用的 sysctl 运行。如果你希望已存在的 Pod
采用更新后的默认 sysctl，你必须重新创建这些 Pod（例如，通过隔离并排空节点）。
