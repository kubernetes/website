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
{{< feature-state for_k8s_version="v1.25" state="alpha" >}}
<!--
This page explains how user namespaces are used in Kubernetes pods. A user
namespace allows to isolate the user running inside the container from the one
in the host.

A process running as root in a container can run as a different (non-root) user
in the host; in other words, the process has full privileges for operations
inside the user namespace, but is unprivileged for operations outside the
namespace.
-->
本页解释了在 Kubernetes pods 中如何使用用户命名空间。
用户命名空间允许将容器内运行的用户与主机内的用户隔离开来。

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

{{% thirdparty-content single="true" %}}
<!-- if adding another runtime in the future, omit the single setting -->

<!--
This is a Linux only feature. In addition, support is needed in the 
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
to use this feature with Kubernetes stateless pods:

* CRI-O: v1.25 has support for user namespaces.

* containerd: support is planned for the 1.7 release. See containerd
  issue [#7063][containerd-userns-issue] for more details.

Support for this in [cri-dockerd is not planned][CRI-dockerd-issue] yet.
-->

这是一个只对 Linux 有效的功能特性。此外，需要在{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}提供支持，
才能在 Kubernetes 无状态 Pod 中使用这一功能：

* CRI-O：v1.25 版已经支持用户命名空间。
* containerd：计划在 1.7 版本中支持。更多细节请参见 containerd 问题 [#7063][containerd-userns-issue]。

目前 [cri-dockerd 没有计划][CRI-dockerd-issue]支持此功能。

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74
[containerd-userns-issue]: https://github.com/containerd/containerd/issues/7063

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
to guarantee that no two stateless pods on the same node use the same mapping.

The `runAsUser`, `runAsGroup`, `fsGroup`, etc. fields in the `pod.spec` always
refer to the user inside the container.

The valid UIDs/GIDs when this feature is enabled is the range 0-65535. This
applies to files and processes (`runAsUser`, `runAsGroup`, etc.).
-->
kubelet 将挑选 Pod 所映射的主机 UID/GID，
并将以保证同一节点上没有两个无状态 Pod 使用相同的映射的方式进行。

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
## Understanding user namespaces for stateless pods 
-->
## 了解无状态 Pod 的用户命名空间 {#understanding-user-namespaces-for-stateless-pods}

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
It is recommended that the host's files and host's processes use UIDs/GIDs in
the range of 0-65535.

The kubelet will assign UIDs/GIDs higher than that to pods. Therefore, to
guarantee as much isolation as possible, the UIDs/GIDs used by the host's files
and host's processes should be in the range 0-65535.

Note that this recommendation is important to mitigate the impact of CVEs like
[CVE-2021-25741][CVE-2021-25741], where a pod can potentially read arbitrary
files in the hosts. If the UIDs/GIDs of the pod and the host don't overlap, it
is limited what a pod would be able to do: the pod UID/GID won't match the
host's file owner/group.
-->
建议主机的文件和主机的进程使用 0-65535 范围内的 UID/GID。

kubelet 会把高于这个范围的 UID/GID 分配给 Pod。
因此，为了保证尽可能多的隔离，主机的文件和主机的进程所使用的 UID/GID 应该在 0-65535 范围内。

请注意，这个建议对减轻 [CVE-2021-25741][CVE-2021-25741] 等 CVE 的影响很重要；
在这些 CVE 中，Pod 有可能读取主机中的任意文件。
如果 Pod 和主机的 UID/GID 不重叠，Pod 能够做的事情就会受到限制：
Pod的 UID/GID 不会与主机的文件所有者/组相匹配。

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980

<!-- 
# Limitations 
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

<!--
The pod is allowed to use no volumes at all or, if using volumes, only these
volume types are allowed:

 * configmap
 * secret
 * projected
 * downwardAPI
 * emptyDir
-->
Pod 完全不使用卷是被允许的；如果使用卷，只允许使用以下卷类型：

 * configmap
 * secret
 * projected
 * downwardAPI
 * emptyDir

<!-- 
To guarantee that the pod can read the files of such volumes, volumes are
created as if you specified `.spec.securityContext.fsGroup` as `0` for the Pod.
If it is specified to a different value, this other value will of course be
honored instead.

As a by-product of this, folders and files for these volumes will have
permissions for the group, even if `defaultMode` or `mode` to specific items of
the volumes were specified without permissions to groups. For example, it is not
possible to mount these volumes in a way that its files have permissions only
for the owner. 
-->
为了保证 Pod 可以读取这些卷中的文件，卷的创建操作就像你为 Pod 指定了 `.spec.securityContext.fsGroup` 为 `0` 一样。
如果该属性被设定为不同值，那么这个不同值当然也会被使用。

作为一个副产品，这些卷的文件夹和文件将具有所给组的权限，
即使 `defaultMode` 或 volumes 的特定项目的 `mode` 被指定为没有组的权限。
例如，不可以在挂载这些卷时使其文件只允许所有者访问。