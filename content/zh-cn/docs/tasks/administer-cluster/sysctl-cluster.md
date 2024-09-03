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
- `net.ipv4.tcp_keepalive_probes`（从 Kubernetes 1.29 开始，需要 kernel 4.5+）。

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
