---
title: 在 Kubernetes 集群中使用 sysctl
content_type: task
---

<!--
title: Using sysctls in a Kubernetes Cluster
reviewers:
- sttts
content_type: task
--->

<!-- overview -->


<!--
This document describes how to configure and use kernel parameters within a
Kubernetes cluster using the {{< glossary_tooltip term_id="sysctl" >}}
interface.
-->
本文档介绍如何通过 {{< glossary_tooltip term_id="sysctl" >}}
接口在 Kubernetes 集群中配置和使用内核参数。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Listing all Sysctl Parameters
-->
## 获取 Sysctl 的参数列表

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
若要获取完整的参数列表，请执行以下命令

```shell
sudo sysctl -a
```

<!--
## Enabling Unsafe Sysctls

Sysctls are grouped into _safe_  and _unsafe_ sysctls. In addition to proper
namespacing a _safe_ sysctl must be properly _isolated_ between pods on the same
node. This means that setting a _safe_ sysctl for one pod
-->
## 启用非安全的 Sysctl 参数

sysctl 参数分为 _安全_ 和 _非安全的_。
_安全_ sysctl 参数除了需要设置恰当的命名空间外，在同一 node 上的不同 Pod 
之间也必须是 _相互隔离的_。这意味着在 Pod 上设置 _安全_ sysctl 参数

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
至今为止，大多数 _有命名空间的_ sysctl 参数不一定被认为是 _安全_ 的。
以下几种 sysctl 参数是 _安全的_：

- `kernel.shm_rmid_forced`
- `net.ipv4.ip_local_port_range`
- `net.ipv4.tcp_syncookies`
- `net.ipv4.ping_group_range` （从 Kubernetes 1.18 开始）

<!--
The example `net.ipv4.tcp_syncookies` is not namespaced on Linux kernel version 4.4 or lower.
-->
{{< note >}}
示例中的 `net.ipv4.tcp_syncookies` 在Linux 内核 4.4 或更低的版本中是无命名空间的。
{{< /note >}}

<!--
This list will be extended in future Kubernetes versions when the kubelet
supports better isolation mechanisms.
-->
在未来的 Kubernetes 版本中，若 kubelet 支持更好的隔离机制，则上述列表中将会
列出更多 _安全的_ sysctl 参数。

<!--
All _safe_ sysctls are enabled by default.
-->
所有 _安全的_ sysctl 参数都默认启用。

<!--
All _unsafe_ sysctls are disabled by default and must be allowed manually by the
cluster admin on a per-node basis. Pods with disabled unsafe sysctls will be
scheduled, but will fail to launch.
-->
所有 _非安全的_ sysctl 参数都默认禁用，且必须由集群管理员在每个节点上手动开启。
那些设置了不安全 sysctl 参数的 Pod 仍会被调度，但无法正常启动。

<!--
With the warning above in mind, the cluster admin can allow certain _unsafe_
sysctls for very special situations like e.g. high-performance or real-time
application tuning. _Unsafe_ sysctls are enabled on a node-by-node basis with a
flag of the kubelet, e.g.:
-->
参考上述警告，集群管理员只有在一些非常特殊的情况下（如：高可用或实时应用调整），
才可以启用特定的 _非安全的_ sysctl 参数。
如需启用 _非安全的_ sysctl 参数，请你在每个节点上分别设置 kubelet 命令行参数，例如：

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
只有 _有命名空间的_ sysctl 参数可以通过该方式启用。

<!--
## Setting Sysctls for a Pod

A number of sysctls are _namespaced_ in today's Linux kernels. This means that
they can be set independently for each pod on a node. Only namespaced sysctls
are configurable via the pod securityContext within Kubernetes.
-->
## 设置 Pod 的 Sysctl 参数

目前，在 Linux 内核中，有许多的 sysctl 参数都是 _有命名空间的_ 。 
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
- `net.*`（内核中可以在容器命名空间里被更改的网络配置项相关参数）。然而也有一些特例
  （例如，`net.netfilter.nf_conntrack_max` 和 `net.netfilter.nf_conntrack_expect_max`
  可以在容器命名空间里被更改，但它们是非命名空间的）。

<!--
Sysctls with no namespace are called _node-level_ sysctls. If you need to set
them, you must manually configure them on each node's operating system, or by
using a DaemonSet with privileged containers.
-->
没有命名空间的 sysctl 参数称为 _节点级别的_ sysctl 参数。
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
`kernel.msgmax` There is no distinction between _safe_ and _unsafe_ sysctls in
the specification.
-->
此示例中，使用 Pod SecurityContext 来对一个安全的 sysctl 参数
`kernel.shm_rmid_forced` 以及两个非安全的 sysctl 参数
`net.core.somaxconn` 和 `kernel.msgmax` 进行设置。
在 Pod 规约中对 _安全的_ 和 _非安全的_ sysctl 参数不做区分。

<!--
Only modify sysctl parameters after you understand their effects, to avoid
destabilizing your operating system.
-->
{{< warning >}}
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
<!--
Due to their nature of being _unsafe_, the use of _unsafe_ sysctls
is at-your-own-risk and can lead to severe problems like wrong behavior of
containers, resource shortage or complete breakage of a node.
-->
{{< warning >}}
由于 _非安全的_ sysctl 参数其本身具有不稳定性，在使用 _非安全的_ sysctl 参数
时可能会导致一些严重问题，如容器的错误行为、机器资源不足或节点被完全破坏，
用户需自行承担风险。
{{< /warning >}}

<!--
It is good practice to consider nodes with special sysctl settings as
_tainted_ within a cluster, and only schedule pods onto them which need those
sysctl settings. It is suggested to use the Kubernetes [_taints and toleration_
feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) to implement this.
-->
最佳实践方案是将集群中具有特殊 sysctl 设置的节点视为 _有污点的_，并且只调度
需要使用到特殊 sysctl 设置的 Pod 到这些节点上。
建议使用 Kubernetes 的
[污点和容忍度特性](/docs/reference/generated/kubectl/kubectl-commands/#taint) 来实现它。

<!--
A pod with the _unsafe_ sysctls will fail to launch on any node which has not
enabled those two _unsafe_ sysctls explicitly. As with _node-level_ sysctls it
is recommended to use
[_taints and toleration_ feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) or
[taints on nodes](/docs/concepts/configuration/taint-and-toleration/)
to schedule those pods onto the right nodes.
-->
设置了 _非安全的_ sysctl 参数的 Pod 在禁用了这两种 _非安全的_ sysctl 参数配置
的节点上启动都会失败。与 _节点级别的_ sysctl 一样，建议开启
[污点和容忍度特性](/docs/reference/generated/kubectl/kubectl-commands/#taint) 或
[为节点配置污点](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)
以便将 Pod 调度到正确的节点之上。

## PodSecurityPolicy

<!--
You can further control which sysctls can be set in pods by specifying lists of
sysctls or sysctl patterns in the `forbiddenSysctls` and/or
`allowedUnsafeSysctls` fields of the PodSecurityPolicy. A sysctl pattern ends
with a `*` character, such as `kernel.*`. A `*` character on its own matches
all sysctls.
-->
你可以通过在 PodSecurityPolicy 的 `forbiddenSysctls` 和/或 `allowedUnsafeSysctls`
字段中，指定 sysctl 或填写 sysctl 匹配模式来进一步为 Pod 设置 sysctl 参数。
sysctl 参数匹配模式以 `*` 字符结尾，如 `kernel.*`。 
单独的 `*`  字符匹配所有 sysctl 参数。

<!--
By default, all safe sysctls are allowed.
-->
所有 _安全的_ sysctl 参数都默认启用。

<!--
Both `forbiddenSysctls` and `allowedUnsafeSysctls` are lists of plain sysctl names
or sysctl patterns (which end with `*`). The string `*` matches all sysctls.
-->
`forbiddenSysctls` 和 `allowedUnsafeSysctls` 的值都是字符串列表类型，
可以添加 sysctl 参数名称，也可以添加 sysctl 参数匹配模式（以`*`结尾）。 
只填写 `*` 则匹配所有的 sysctl 参数。

<!--
The `forbiddenSysctls` field excludes specific sysctls. You can forbid a
combination of safe and unsafe sysctls in the list. To forbid setting any
sysctls, use `*` on its own.
-->
`forbiddenSysctls` 字段用于禁用特定的 sysctl 参数。
你可以在列表中禁用安全和非安全的 sysctl 参数的组合。 
要禁用所有的 sysctl 参数，请设置为 `*`。

<!--
If you specify any unsafe sysctl in the `allowedUnsafeSysctls` field and it is
not present in the `forbiddenSysctls` field, that sysctl can be used in Pods
using this PodSecurityPolicy. To allow all unsafe sysctls in the
PodSecurityPolicy to be set, use `*` on its own.
-->
如果要在 `allowedUnsafeSysctls` 字段中指定一个非安全的 sysctl 参数，
并且它在 `forbiddenSysctls` 字段中未被禁用，则可以在 Pod 中通过
PodSecurityPolicy 启用该 sysctl 参数。
若要在 PodSecurityPolicy 中开启所有非安全的 sysctl 参数，
请设 `allowedUnsafeSysctls` 字段值为 `*`。

<!--
Do not configure these two fields such that there is overlap, meaning that a
given sysctl is both allowed and forbidden.
-->
`allowedUnsafeSysctls` 与 `forbiddenSysctls` 两字段的配置不能重叠，
否则这就意味着存在某个 sysctl 参数既被启用又被禁用。

<!--
If you whitelist unsafe sysctls via the `allowedUnsafeSysctls` field
in a PodSecurityPolicy, any pod using such a sysctl will fail to start
if the sysctl is not whitelisted via the `--allowed-unsafe-sysctls` kubelet
flag as well on that node.
--->
{{< warning >}}
如果你通过 PodSecurityPolicy 中的 `allowedUnsafeSysctls` 字段将非安全的 sysctl
参数列入白名单，但该 sysctl 参数未通过 kubelet 命令行参数
`--allowed-unsafe-sysctls` 在节点上将其列入白名单，则设置了这个 sysctl
参数的 Pod 将会启动失败。
{{< /warning >}}

<!--
This example allows unsafe sysctls prefixed with `kernel.msg` to be set and
disallows setting of the `kernel.shm_rmid_forced` sysctl.
-->
以下示例设置启用了以 `kernel.msg` 为前缀的非安全的 sysctl 参数，同时禁用了
sysctl 参数 `kernel.shm_rmid_forced`。

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: sysctl-psp
spec:
  allowedUnsafeSysctls:
  - kernel.msg*
  forbiddenSysctls:
  - kernel.shm_rmid_forced
 ...
```

