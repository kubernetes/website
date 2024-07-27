---
title: 用户命名空间
content_type: concept
weight: 160
min-kubernetes-server-version: v1.25
---
<!--
title: User Namespaces
reviewers:
content_type: concept
weight: 160
min-kubernetes-server-version: v1.25
-->

<!-- overview -->
{{< feature-state for_k8s_version="v1.30" state="beta" >}}
<!--
This page explains how user namespaces are used in Kubernetes pods. A user
namespace isolates the user running inside the container from the one
in the host.

A process running as root in a container can run as a different (non-root) user
in the host; in other words, the process has full privileges for operations
inside the user namespace, but is unprivileged for operations outside the
namespace.
-->
本页解释了在 Kubernetes Pod 中如何使用用户命名空间。
用户命名空间将容器内运行的用户与主机中的用户隔离开来。

在容器中以 root 身份运行的进程可以在主机中以不同的（非 root）用户身份运行；
换句话说，该进程在用户命名空间内的操作具有完全的权限，
但在命名空间外的操作是无特权的。

<!--
You can use this feature to reduce the damage a compromised container can do to
the host or other pods in the same node. There are [several security
vulnerabilities][KEP-vulns] rated either **HIGH** or **CRITICAL** that were not
exploitable when user namespaces is active. It is expected user namespace will
mitigate some future vulnerabilities too.
-->
你可以使用这个功能来减少被破坏的容器对主机或同一节点中的其他 Pod 的破坏。
有[几个安全漏洞][KEP-vulns]被评为 **高** 或 **重要**，
当用户命名空间处于激活状态时，这些漏洞是无法被利用的。
预计用户命名空间也会减轻一些未来的漏洞。

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

<!-- body -->
## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

<!--
This is a Linux-only feature and support is needed in Linux for idmap mounts on
the filesystems used. This means:

* On the node, the filesystem you use for `/var/lib/kubelet/pods/`, or the
  custom directory you configure for this, needs idmap mount support.
* All the filesystems used in the pod's volumes must support idmap mounts.

In practice this means you need at least Linux 6.3, as tmpfs started supporting
idmap mounts in that version. This is usually needed as several Kubernetes
features use tmpfs (the service account token that is mounted by default uses a
tmpfs, Secrets use a tmpfs, etc.)

Some popular filesystems that support idmap mounts in Linux 6.3 are: btrfs,
ext4, xfs, fat, tmpfs, overlayfs.
-->
这是一个只对 Linux 有效的功能特性，且需要 Linux 支持在所用文件系统上挂载 idmap。
这意味着：

* 在节点上，你用于 `/var/lib/kubelet/pods/` 的文件系统，或你为此配置的自定义目录，
  需要支持 idmap 挂载。
* Pod 卷中使用的所有文件系统都必须支持 idmap 挂载。

在实践中，这意味着你最低需要 Linux 6.3，因为 tmpfs 在该版本中开始支持 idmap 挂载。
这通常是需要的，因为有几个 Kubernetes 功能特性使用 tmpfs
（默认情况下挂载的服务账号令牌使用 tmpfs、Secret 使用 tmpfs 等等）。

Linux 6.3 中支持 idmap 挂载的一些比较流行的文件系统是：btrfs、ext4、xfs、fat、
tmpfs、overlayfs。

<!--
In addition, the container runtime and its underlying OCI runtime must support
user namespaces. The following OCI runtimes offer support:

* [crun](https://github.com/containers/crun) version 1.9 or greater (it's recommend version 1.13+).
-->

此外，容器运行时及其底层 OCI 运行时必须支持用户命名空间。以下 OCI 运行时提供支持：

* [crun](https://github.com/containers/crun) 1.9 或更高版本（推荐 1.13+ 版本）。

<!-- ideally, update this if a newer minor release of runc comes out, whether or not it includes the idmap support -->

{{< note >}}
<!--
Many OCI runtimes do not include the support needed for using user namespaces in
Linux pods. If you use a managed Kubernetes, or have downloaded it from packages
and set it up, it's likely that nodes in your cluster use a runtime that doesn't
include this support. For example, the most widely used OCI runtime is `runc`,
and version `1.1.z` of runc doesn't support all the features needed by the
Kubernetes implementation of user namespaces.
-->
许多 OCI 运行时不包含在 Linux Pod 中使用用户命名空间所需的支持。
如果你使用托管 Kubernetes，或者使用软件包下载并安装 Kubernetes 集群，
则集群中的节点可能使用不包含支持此特性的运行时。
例如，最广泛使用的 OCI 运行时是 `runc`，而 runc 的 `1.1.z`
版本不支持 Kubernetes 实现用户命名空间所需的所有特性。

<!--
If there is a newer release of runc than 1.1 available for use, check its
documentation and release notes for compatibility (look for idmap mounts support
in particular, because that is the missing feature).
-->
如果有比 1.1 更新的 runc 版本可供使用，请检查其文档和发行说明以了解兼容性
（特别寻找 idmap 挂载支持，因为这一特性是缺失的）。
{{< /note >}}

<!--
To use user namespaces with Kubernetes, you also need to use a CRI
 {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
 to use this feature with Kubernetes pods:

* CRI-O: version 1.25 (and later) supports user namespaces for containers.
-->
此外，需要在{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}提供支持，
才能在 Kubernetes Pod 中使用这一功能：

* CRI-O：1.25（及更高）版本支持配置容器的用户命名空间。

<!--
containerd v1.7 is not compatible with the userns support in Kubernetes v1.27 to v{{< skew latestVersion >}}.
Kubernetes v1.25 and v1.26 used an earlier implementation that **is** compatible with containerd v1.7,
in terms of userns support.
If you are using a version of Kubernetes other than {{< skew currentVersion >}},
check the documentation for that version of Kubernetes for the most relevant information.
If there is a newer release of containerd than v1.7 available for use, also check the containerd
documentation for compatibility information.

You can see the status of user namespaces support in cri-dockerd tracked in an [issue][CRI-dockerd-issue]
on GitHub.
-->
containerd v1.7 与 Kubernetes v1.27 至 v{{< skew currentVersion >}}
版本中的用户命名空间不兼容。
Kubernetes v1.25 和 v1.26 使用了早期的实现，在用户命名空间方面与 containerd v1.7 兼容。
如果你使用的 Kubernetes 版本不是 {{< skew currentVersion >}}，请查看该版本 Kubernetes
的文档以获取更准确的信息。
如果有比 v1.7 更新的 containerd 版本可供使用，请检查 containerd 文档以获取兼容性信息。

你可以在 GitHub 上的 [issue][CRI-dockerd-issue] 中查看 cri-dockerd
中用户命名空间支持的状态。

<!--
## Introduction
-->
## 介绍 {#introduction}

<!--
User namespaces is a Linux feature that allows to map users in the container to
different users in the host. Furthermore, the capabilities granted to a pod in
a user namespace are valid only in the namespace and void outside of it.

A pod can opt-in to use user namespaces by setting the `pod.spec.hostUsers` field
to `false`.
-->
用户命名空间是一个 Linux 功能，允许将容器中的用户映射到主机中的不同用户。
此外，在某用户命名空间中授予 Pod 的权能只在该命名空间中有效，在该命名空间之外无效。

一个 Pod 可以通过将 `pod.spec.hostUsers` 字段设置为 `false` 来选择使用用户命名空间。

<!--
The kubelet will pick host UIDs/GIDs a pod is mapped to, and will do so in a way
to guarantee that no two pods on the same node use the same mapping.

The `runAsUser`, `runAsGroup`, `fsGroup`, etc. fields in the `pod.spec` always
refer to the user inside the container.

The valid UIDs/GIDs when this feature is enabled is the range 0-65535. This
applies to files and processes (`runAsUser`, `runAsGroup`, etc.).
-->
kubelet 将挑选 Pod 所映射的主机 UID/GID，
并以此保证同一节点上没有两个 Pod 使用相同的方式进行映射。

`pod.spec` 中的 `runAsUser`、`runAsGroup`、`fsGroup` 等字段总是指的是容器内的用户。
启用该功能时，有效的 UID/GID 在 0-65535 范围内。这以限制适用于文件和进程（`runAsUser`、`runAsGroup` 等）。

<!--
Files using a UID/GID outside this range will be seen as belonging to the
overflow ID, usually 65534 (configured in `/proc/sys/kernel/overflowuid` and
`/proc/sys/kernel/overflowgid`). However, it is not possible to modify those
files, even by running as the 65534 user/group.

Most applications that need to run as root but don't access other host
namespaces or resources, should continue to run fine without any changes needed
if user namespaces is activated.
-->
使用这个范围之外的 UID/GID 的文件将被视为属于溢出 ID，
通常是 65534（配置在 `/proc/sys/kernel/overflowuid和/proc/sys/kernel/overflowgid`）。
然而，即使以 65534 用户/组的身份运行，也不可能修改这些文件。

大多数需要以 root 身份运行但不访问其他主机命名空间或资源的应用程序，
在用户命名空间被启用时，应该可以继续正常运行，不需要做任何改变。

<!--
## Understanding user namespaces for pods {#pods-and-userns}
-->
## 了解 Pod 的用户命名空间 {#pods-and-userns}

<!--
Several container runtimes with their default configuration (like Docker Engine,
containerd, CRI-O) use Linux namespaces for isolation. Other technologies exist
and can be used with those runtimes too (e.g. Kata Containers uses VMs instead of
Linux namespaces). This page is applicable for container runtimes using Linux
namespaces for isolation.

When creating a pod, by default, several new namespaces are used for isolation:
a network namespace to isolate the network of the container, a PID namespace to
isolate the view of processes, etc. If a user namespace is used, this will
isolate the users in the container from the users in the node.
-->
一些容器运行时的默认配置（如 Docker Engine、containerd、CRI-O）使用 Linux 命名空间进行隔离。
其他技术也存在，也可以与这些运行时（例如，Kata Containers 使用虚拟机而不是 Linux 命名空间）结合使用。
本页适用于使用 Linux 命名空间进行隔离的容器运行时。

在创建 Pod 时，默认情况下会使用几个新的命名空间进行隔离：
一个网络命名空间来隔离容器网络，一个 PID 命名空间来隔离进程视图等等。
如果使用了一个用户命名空间，这将把容器中的用户与节点中的用户隔离开来。

<!--
This means containers can run as root and be mapped to a non-root user on the
host. Inside the container the process will think it is running as root (and
therefore tools like `apt`, `yum`, etc. work fine), while in reality the process
doesn't have privileges on the host. You can verify this, for example, if you
check which user the container process is running by executing `ps aux` from
the host. The user `ps` shows is not the same as the user you see if you
execute inside the container the command `id`.

This abstraction limits what can happen, for example, if the container manages
to escape to the host. Given that the container is running as a non-privileged
user on the host, it is limited what it can do to the host.
-->
这意味着容器可以以 root 身份运行，并将该身份映射到主机上的一个非 root 用户。
在容器内，进程会认为它是以 root 身份运行的（因此像 `apt`、`yum` 等工具可以正常工作），
而实际上该进程在主机上没有权限。
你可以验证这一点，例如，如果你从主机上执行 `ps aux` 来检查容器进程是以哪个用户运行的。
`ps` 显示的用户与你在容器内执行 `id` 命令时看到的用户是不一样的。

这种抽象限制了可能发生的情况，例如，容器设法逃逸到主机上时的后果。
鉴于容器是作为主机上的一个非特权用户运行的，它能对主机做的事情是有限的。

<!--
Furthermore, as users on each pod will be mapped to different non-overlapping
users in the host, it is limited what they can do to other pods too.

Capabilities granted to a pod are also limited to the pod user namespace and
mostly invalid out of it, some are even completely void. Here are two examples:
- `CAP_SYS_MODULE` does not have any effect if granted to a pod using user
namespaces, the pod isn't able to load kernel modules.
- `CAP_SYS_ADMIN` is limited to the pod's user namespace and invalid outside
of it.
-->
此外，由于每个 Pod 上的用户将被映射到主机中不同的非重叠用户，
他们对其他 Pod 可以执行的操作也是有限的。

授予一个 Pod 的权能也被限制在 Pod 的用户命名空间内，
并且在这一命名空间之外大多无效，有些甚至完全无效。这里有两个例子：

- `CAP_SYS_MODULE` 若被授予一个使用用户命名空间的 Pod 则没有任何效果，这个 Pod 不能加载内核模块。
- `CAP_SYS_ADMIN` 只限于 Pod 所在的用户命名空间，在该命名空间之外无效。

<!--
Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capability were
granted to the container, the capabilities are valid on the host too. None of
this is true when we use user namespaces.

If you want to know more details about what changes when user namespaces are in
use, see `man 7 user_namespaces`.
-->
在不使用用户命名空间的情况下，以 root 账号运行的容器，在容器逃逸时，在节点上有 root 权限。
而且如果某些权能被授予了某容器，这些权能在宿主机上也是有效的。
当我们使用用户命名空间时，这些都不再成立。

如果你想知道关于使用用户命名空间时的更多变化细节，请参见 `man 7 user_namespaces`。

<!--
## Set up a node to support user namespaces
-->
## 设置一个节点以支持用户命名空间 {#set-up-a-node-to-support-user-namespaces}

<!--
By default, the kubelet assigns pods UIDs/GIDs above the range 0-65535, based on
the assumption that the host's files and processes use UIDs/GIDs within this
range, which is standard for most Linux distributions. This approach prevents
any overlap between the UIDs/GIDs of the host and those of the pods.
-->
默认情况下，kubelet 会分配 0-65535 范围以上的 Pod UID/GID，
这是基于主机的文件和进程使用此范围内的 UID/GID 的假设，也是大多数 Linux 发行版的标准。
此方法可防止主机的 UID/GID 与 Pod 的 UID/GID 之间出现重叠。

<!--
Avoiding the overlap is important to mitigate the impact of vulnerabilities such
as [CVE-2021-25741][CVE-2021-25741], where a pod can potentially read arbitrary
files in the host. If the UIDs/GIDs of the pod and the host don't overlap, it is
limited what a pod would be able to do: the pod UID/GID won't match the host's
file owner/group.
-->
避免重叠对于减轻 [CVE-2021-25741][CVE-2021-25741] 等漏洞的影响非常重要，
其中 Pod 可能会读取主机中的任意文件。
如果 Pod 和主机的 UID/GID 不重叠，则 Pod 的功能将受到限制：
Pod UID/GID 将与主机的文件所有者/组不匹配。

<!--
The kubelet can use a custom range for user IDs and group IDs for pods. To
configure a custom range, the node needs to have:

 * A user `kubelet` in the system (you cannot use any other username here)
 * The binary `getsubids` installed (part of [shadow-utils][shadow-utils]) and
   in the `PATH` for the kubelet binary.
 * A configuration of subordinate UIDs/GIDs for the `kubelet` user (see
   [`man 5 subuid`](https://man7.org/linux/man-pages/man5/subuid.5.html) and
   [`man 5 subgid`](https://man7.org/linux/man-pages/man5/subgid.5.html)).
-->
kubelet 可以对 Pod 的用户 ID 和组 ID 使用自定义范围。要配置自定义范围，节点需要具有：
* 系统中的用户 `kubelet`（此处不能使用任何其他用户名）。
* 已安装二进制文件 `getsubids`（[shadow-utils][shadow-utils] 的一部分）并位于 kubelet 二进制文件的 `PATH` 中。
* `kubelet` 用户的从属 UID/GID 配置
  （请参阅 [`man 5 subuid`](https://man7.org/linux/man-pages/man5/subuid.5.html) 和
  [`man 5 subgid`](https://man7.org/linux/man-pages/man5/subgid.5.html)）

<!--
This setting only gathers the UID/GID range configuration and does not change
the user executing the `kubelet`.

You must follow some constraints for the subordinate ID range that you assign
to the `kubelet` user:
-->
此设置仅收集 UID/GID 范围配置，不会更改执行 `kubelet` 的用户。

对于分配给 `kubelet` 用户的从属 ID 范围， 你必须遵循一些限制：

<!--
* The subordinate user ID, that starts the UID range for Pods, **must** be a
  multiple of 65536 and must also be greater than or equal to 65536. In other
  words, you cannot use any ID from the range 0-65535 for Pods; the kubelet
  imposes this restriction to make it difficult to create an accidentally insecure
  configuration.
-->
* 启动 Pod 的 UID 范围的从属用户 ID **必须**是 65536 的倍数，并且还必须大于或等于 65536。
  换句话说，Pod 不能使用 0-65535 范围内的任何 ID；kubelet 施加此限制是为了使创建意外不安全的配置变得困难。

<!--
* The subordinate ID count must be a multiple of 65536

* The subordinate ID count must be at least `65536 x <maxPods>` where `<maxPods>`
  is the maximum number of pods that can run on the node.

* You must assign the same range for both user IDs and for group IDs, It doesn't
  matter if other users have user ID ranges that don't align with the group ID
  ranges.
-->
* 从属 ID 计数必须是 65536 的倍数

* 从属 ID 计数必须至少为 `65536 x <maxPods>`，其中 `<maxPods>` 是节点上可以运行的最大 Pod 数量。

* 你必须为用户 ID 和组 ID 分配相同的范围。如果其他用户的用户 ID 范围与组 ID 范围不一致也没关系。

<!--
* None of the assigned ranges should overlap with any other assignment.

* The subordinate configuration must be only one line. In other words, you can't
  have multiple ranges.

For example, you could define `/etc/subuid` and `/etc/subgid` to both have
these entries for the `kubelet` user:
-->
* 所分配的范围不得与任何其他分配重叠。

* 从属配置必须只有一行。换句话说，你不能有多个范围。

例如，你可以定义 `/etc/subuid` 和 `/etc/subgid` 来为 `kubelet` 用户定义以下条目：

<!--
```
# The format is
#   name:firstID:count of IDs
# where
# - firstID is 65536 (the minimum value possible)
# - count of IDs is 110 (default limit for number of) * 65536
```
-->
```
# 格式为：
#   name:firstID:count of IDs
# 在哪里：
# - firstID 是 65536 （可能的最小值）
# - IDs 的数量是 110（默认数量限制）* 65536
kubelet:65536:7208960
```

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980
[shadow-utils]: https://github.com/shadow-maint/shadow

<!--
## Integration with Pod security admission checks
-->
## 与 Pod 安全准入检查的集成   {#integration-with-pod-security-admission-checks}

{{< feature-state state="alpha" for_k8s_version="v1.29" >}}

<!--
For Linux Pods that enable user namespaces, Kubernetes relaxes the application of
[Pod Security Standards](/docs/concepts/security/pod-security-standards) in a controlled way.
This behavior can be controlled by the [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/)
`UserNamespacesPodSecurityStandards`, which allows an early opt-in for end
users. Admins have to ensure that user namespaces are enabled by all nodes
within the cluster if using the feature gate.
-->
对于启用了用户命名空间的 Linux Pod，Kubernetes 会以受控方式放宽
[Pod 安全性标准](/zh-cn/docs/concepts/security/pod-security-standards)的应用。
这种行为可以通过[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) 
`UserNamespacesPodSecurityStandards` 进行控制，可以让最终用户提前尝试此特性。
如果管理员启用此特性门控，必须确保群集中的所有节点都启用了用户命名空间。

<!--
If you enable the associated feature gate and create a Pod that uses user
namespaces, the following fields won't be constrained even in contexts that enforce the
_Baseline_ or _Restricted_ pod security standard. This behavior does not
present a security concern because `root` inside a Pod with user namespaces
actually refers to the user inside the container, that is never mapped to a
privileged user on the host. Here's the list of fields that are **not** checks for Pods in those
circumstances:
-->
如果你启用相关特性门控并创建了使用用户命名空间的 Pod，以下的字段不会被限制，
即使在执行了 _Baseline_ 或 _Restricted_ Pod 安全性标准的上下文中。这种行为不会带来安全问题，
因为带有用户命名空间的 Pod 内的 `root` 实际上指的是容器内的用户，绝不会映射到主机上的特权用户。
以下是在这种情况下**不进行**检查的 Pod 字段列表：

- `spec.securityContext.runAsNonRoot`
- `spec.containers[*].securityContext.runAsNonRoot`
- `spec.initContainers[*].securityContext.runAsNonRoot`
- `spec.ephemeralContainers[*].securityContext.runAsNonRoot`
- `spec.securityContext.runAsUser`
- `spec.containers[*].securityContext.runAsUser`
- `spec.initContainers[*].securityContext.runAsUser`

<!--
## Limitations
-->
## 限制 {#limitations}

<!--
When using a user namespace for the pod, it is disallowed to use other host
namespaces. In particular, if you set `hostUsers: false` then you are not
allowed to set any of:

 * `hostNetwork: true`
 * `hostIPC: true`
 * `hostPID: true`
-->
当 Pod 使用用户命名空间时，不允许 Pod 使用其他主机命名空间。
特别是，如果你设置了 `hostUsers: false`，那么你就不可以设置如下属性：

* `hostNetwork: true`
* `hostIPC: true`
* `hostPID: true`

## {{% heading "whatsnext" %}}

<!--
* Take a look at [Use a User Namespace With a Pod](/docs/tasks/configure-pod-container/user-namespaces/)
-->
* 查阅[为 Pod 配置用户命名空间](/zh-cn/docs/tasks/configure-pod-container/user-namespaces/)
