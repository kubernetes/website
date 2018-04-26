---
cn-approvers:
- tianshapjq
approvers:
- sttts
title: 在 Kubernetes 集群中使用 Sysctl
---
<!--
---
approvers:
- sttts
title: Using Sysctls in a Kubernetes Cluster
---
-->

* TOC
{:toc}

<!--
This document describes how sysctls are used within a Kubernetes cluster.
-->
本文档描述如何在 Kubernetes 集群中使用 sysctl。

<!--
## What is a Sysctl?
-->
## Sysctl 是什么？

<!--
In Linux, the sysctl interface allows an administrator to modify kernel
parameters at runtime. Parameters are available via the `/proc/sys/` virtual
process file system. The parameters cover various subsystems such as:
-->
在 Linux 系统中，sysctl 接口允许管理员在运行时修改内核参数。参数能够通过 `/proc/sys/` 虚拟进程文件系统获得。这些参数覆盖多个子系统，例如：

<!--
- kernel (common prefix: `kernel.`)
- networking (common prefix: `net.`)
- virtual memory (common prefix: `vm.`)
- MDADM (common prefix: `dev.`)
- More subsystems are described in [Kernel docs](https://www.kernel.org/doc/Documentation/sysctl/README).
-->
- 内核（通用前缀：`kernel.`）
- 网络（通用前缀：`net.`）
- 虚拟内存（通用前缀：`vm.`）
- MDADM（通用前缀：`dev.`）
- 更多子系统请参阅 [Kernel docs](https://www.kernel.org/doc/Documentation/sysctl/README).

<!--
To get a list of all parameters, you can run
-->
您可以通过运行以下命令来获得所有参数的列表

```
$ sudo sysctl -a
```

<!--
## Namespaced vs. Node-Level Sysctls
-->
## 命名空间化与 Node 级别的 Sysctl 对比

<!--
A number of sysctls are _namespaced_ in today's Linux kernels. This means that
they can be set independently for each pod on a node. Being namespaced is a
requirement for sysctls to be accessible in a pod context within Kubernetes.
-->
在目前的 Linux 内核中，有很多 sysctl 是 _命名空间化的（namespaced）_。这意味着每个 node 上的 pod 都能单独设置 sysctl。在 Kubernetes 的 pod 上下文中能够访问 sysctl 的前提就是命名空间化。

<!--
The following sysctls are known to be _namespaced_:
-->
以下是已知 _命名空间化_ 的 sysctl：

- `kernel.shm*`,
- `kernel.msg*`,
- `kernel.sem`,
- `fs.mqueue.*`,
- `net.*`.

<!--
Sysctls which are not namespaced are called _node-level_ and must be set
manually by the cluster admin, either by means of the underlying Linux
distribution of the nodes (e.g. via `/etc/sysctls.conf`) or using a DaemonSet
with privileged containers.
-->
没有命名空间的 Sysctl 称为 _node 级别_，并且必须通过管理员手动设置，也就是要么设置 node 的底层 Linux 分布（例如通过 `/etc/sysctls.conf`），要么使用具有特权容器的 DaemonSet。

<!--
**Note**: it is good practice to consider nodes with special sysctl settings as
_tainted_ within a cluster, and only schedule pods onto them which need those
sysctl settings. It is suggested to use the Kubernetes [_taints and toleration_
feature](/docs/user-guide/kubectl/{{page.version}}/#taint) to implement this.
-->
**注意**：这里有一个很好的练习：集群中已经 _tainted_ 具有特殊 sysctl 配置的 node，如何将需要这些特殊 sysctl 配置的 pod 调度到这些 node 上。建议使用 Kubernetes 的 [_taints 和 toleration_ 特性](/docs/user-guide/kubectl/{{page.version}}/#taint) 来完成这个练习。

<!--
## Safe vs. Unsafe Sysctls
-->
## 安全与不安全的 Sysctl 对比

<!--
Sysctls are grouped into _safe_  and _unsafe_ sysctls. In addition to proper
namespacing a _safe_ sysctl must be properly _isolated_ between pods on the same
node. This means that setting a _safe_ sysctl for one pod
-->
Sysctl 被分为 _安全_ 和 _不安全_ 组。为了能够更好的实现命名空间化，一个 _安全的_ sysctl 必须对同一个 node 上的 pod 进行合理的 _隔离_。这意味着为一个 pod 设置一个 _安全的_ sysctl 要做到

<!--
- must not have any influence on any other pod on the node
- must not allow to harm the node's health
- must not allow to gain CPU or memory resources outside of the resource limits
  of a pod.
-->
- 不能影响 node 上的其它 pod
- 不允许损害 node 的健康状态
- 不允许在 pod 的资源限制外获取 CPU 或者内存资源

<!--
By far, most of the _namespaced_ sysctls are not necessarily considered _safe_.
-->
目前为止，大部分已 _命名空间化_ 的 sysctl 不一定被认为是 _安全的_。

<!--
For Kubernetes 1.4, the following sysctls are supported in the _safe_ set:
-->
在 Kubernetes 1.4 版本中，_安全_ 的 sysctl 集合支持以下 sysctl：

- `kernel.shm_rmid_forced`,
- `net.ipv4.ip_local_port_range`,
- `net.ipv4.tcp_syncookies`.

<!--
This list will be extended in future Kubernetes versions when the kubelet
supports better isolation mechanisms.

All _safe_ sysctls are enabled by default.
-->
当 kubelet 在未来的 Kubernetes 版本中支持更好的隔离机制后，这个列表将会得到扩展。

所有 _安全的_ sysctl 默认都是启用状态。

<!--
All _unsafe_ sysctls are disabled by default and must be allowed manually by the
cluster admin on a per-node basis. Pods with disabled unsafe sysctls will be
scheduled, but will fail to launch.

**Warning**: Due to their nature of being _unsafe_, the use of _unsafe_ sysctls
is at-your-own-risk and can lead to severe problems like wrong behavior of
containers, resource shortage or complete breakage of a node.
-->
所有 _不安全的_ sysctl 默认都是禁用的，并且允许管理员在每个节点上进行手动修改。带有不安全的 sysctl 的 pod 能够被调度，但是无法启动。

**警告**：由于 _不安全_ 的特性，使用 _不安全的_ sysctl 您需要自担风险，这可能会导致一些问题，如容器的错误行为、资源短缺或者 node 的完全损坏。

<!--
## Enabling Unsafe Sysctls
-->
## 启用不安全的 Sysctl

<!--
With the warning above in mind, the cluster admin can allow certain _unsafe_
sysctls for very special situations like e.g. high-performance or real-time
application tuning. _Unsafe_ sysctls are enabled on a node-by-node basis with a
flag of the kubelet, e.g.:
-->
考虑到上面的警告，在非常特殊的场景下管理员可以允许某些 _不安全的_ sysctl，例如要求高性能或者实时性应用程序调优。能够通过 kubelet 的参数来启用 _不安全的_ sysctl，例如：

```shell
$ kubelet --experimental-allowed-unsafe-sysctls 'kernel.msg*,net.ipv4.route.min_pmtu' ...
```

<!--
Only _namespaced_ sysctls can be enabled this way.
-->
只有 _命名空间化_ 的 sysctl 能够通过这种方式启用。

<!--
## Setting Sysctls for a Pod
-->
## 为 Pod 设置 Sysctl

<!--
The sysctl feature is an alpha API in Kubernetes 1.4. Therefore, sysctls are set
using annotations on pods. They apply to all containers in the same pod.

Here is an example, with different annotations for _safe_ and _unsafe_ sysctls:
-->
sysctl 特性是 Kubernetes 1.4 版本中的一个 alpha API。因此，需要通过 pod 的注解来设置 sysctl。这将被应用于 pod 中的所有容器。

以下是通过注解来设置 _安全的_ 和 _不安全的_ sysctl 的示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
  annotations:
    security.alpha.kubernetes.io/sysctls: kernel.shm_rmid_forced=1
    security.alpha.kubernetes.io/unsafe-sysctls: net.ipv4.route.min_pmtu=1000,kernel.msgmax=1 2 3
spec:
  ...
```

<!--
**Note**: a pod with the _unsafe_ sysctls specified above will fail to launch on
any node which has not enabled those two _unsafe_ sysctls explicitly. As with
_node-level_ sysctls it is recommended to use [_taints and toleration_
feature](/docs/user-guide/kubectl/v1.6/#taint) or [taints on nodes](/docs/concepts/configuration/taint-and-toleration/)
to schedule those pods onto the right nodes.
-->
**注意**：在没有显式启用上述两个 _不安全的_ sysctl 的 node 上，使用上述 _不安全的_ sysctl 的 pod 将会启动失败。如果想要使用 _node 级别_ 的 sysctl，建议您使用 [_taints 和 toleration_ 特性](/docs/user-guide/kubectl/v1.6/#taint) 或者 [node 上的 taint](/docs/concepts/configuration/taint-and-toleration/) 来把 pod 调度到正确的 node 上。
