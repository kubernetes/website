---
title: 用户名字空间
reviewers:
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
-->
本页介绍如何在 Kubernetes Pod 中使用**用户名字空间（User Namespace）**。
用户名字空间可以将容器内的用户与主机上的用户隔离开来。

<!--
A process running as root in a container can run as a different (non-root) user
in the host; in other words, the process has full privileges for operations
inside the user namespace, but is unprivileged for operations outside the
namespace.
-->
在容器中以 root 用户运行的进程，可以在主机中以不同的用户（非 root）运行，
换言之，进程在用户名字空间内部拥有操作的全部权限，但在用户名字空间外没有执行操作的特权。

<!--
You can use this feature to reduce the damage a compromised container can do to
the host or other pods in the same node. There are [several security
vulnerabilities][KEP-vulns] rated either **HIGH** or **CRITICAL** that were not
exploitable when user namespaces is active. It is expected user namespace will
mitigate some future vulnerabilities too.
-->
你可以使用这个功能来减少有危害的容器对同一主机上其他容器的影响。
当用户名字空间被启用后，一些被评为 **HIGH** 或者 **CRITICAL** 的[安全漏洞][KEP-vulns]是无法被利用的。
相信用户名字空间也能减轻一些未来漏洞的影响。

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
这是 Linux 独有的功能。除此之外，
还需要{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}提供相应的支持，
才能将此功能与 Kubernetes 无状态 Pod 一起使用：

* CRI-O：v1.25 已支持用户名字空间。

* containerd：计划在 1.7 版本中提供支持。
  进一步了解，请参阅 containerd issue [#7063][containerd-userns-issue]。

[cri-dockerd 尚未计划][CRI-dockerd-issue]对此提供支持。

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74
[containerd-userns-issue]: https://github.com/containerd/containerd/issues/7063

<!--
## Introduction

User namespaces is a Linux feature that allows to map users in the container to
different users in the host. Furthermore, the capabilities granted to a pod in
a user namespace are valid only in the namespace and void outside of it.
-->
## 介绍 {#introduction}

用户名字空间是 Linux 的一项特性，它允许将容器中的用户映射到主机中不同的用户。
此外，在用户名字空间中授予 Pod 的功能仅在名字空间内有效，在外部无效。

<!--
A pod can opt-in to use user namespaces by setting the `pod.spec.hostUsers` field
to `false`.

The kubelet will pick host UIDs/GIDs a pod is mapped to, and will do so in a way
to guarantee that no two stateless pods on the same node use the same mapping.
-->
设置 Pod 的 `pod.spec.hostUsers` 字段的值为 `false` 来启用用户名字空间。
kubelet 将采集 Pod 映射到的这些主机 UID/GID，
这种方式能保证在同一节点上不会有两个无状态 Pod 使用同一个映射。

<!--
The `runAsUser`, `runAsGroup`, `fsGroup`, etc. fields in the `pod.spec` always
refer to the user inside the container.

The valid UIDs/GIDs when this feature is enabled is the range 0-65535. This
applies to files and processes (`runAsUser`, `runAsGroup`, etc.).
-->
`pod.spec` 中的 `runAsUser`、`runAsGroup`、`fsGroup` 等字段始终指向容器内的用户。
启用此功能后，UID/GID 的有效值为 0-65535。这些可用于文件和进程（`runAsUser`、`runAsGroup` 等）。

<!--
Files using a UID/GID outside this range will be seen as belonging to the
overflow ID, usually 65534 (configured in `/proc/sys/kernel/overflowuid` and
`/proc/sys/kernel/overflowgid`). However, it is not possible to modify those
files, even by running as the 65534 user/group.
-->
在这个范围之外使用 UID/GID 的文件将被视为属于溢出的 ID，
通常是 65534（在 `/proc/sys/kernel/overflowuid` 和 `/proc/sys/kernel/overflowgid` 中配置的）。
然而，即使以 65534 用户/组身份运行也无法修改这些文件。

<!--
Most applications that need to run as root but don't access other host
namespaces or resources, should continue to run fine without any changes needed
if user namespaces is activated.
-->
大多数应用程序，以 root 用户运行但不访问其他主机的名字空间或者资源，
当用户名字空间被启用后，这些应用程序不需要做任何更改也应该继续正常运行。

<!--
## Understanding user namespaces for stateless pods

Several container runtimes with their default configuration (like Docker Engine,
containerd, CRI-O) use Linux namespaces for isolation. Other technologies exist
and can be used with those runtimes too (e.g. Kata Containers uses VMs instead of
Linux namespaces). This page is applicable for container runtimes using Linux
namespaces for isolation.
-->
## 理解无状态 Pod 的用户名字空间 {#understanding-user-namespaces-for-stateless-pods}

一些具有默认配置的容器运行时（如 Docker Engine、containerd、CRI-O）使用 Linux 名字空间进行隔离。
也有一些其他技术可以在运行时使用（例如 Kata Containers 使用 VM 而不是 Linux 名字空间）。
本文适用于使用 Linux 名字空间进行隔离的容器运行时。

<!--
When creating a pod, by default, several new namespaces are used for isolation:
a network namespace to isolate the network of the container, a PID namespace to
isolate the view of processes, etc. If a user namespace is used, this will
isolate the users in the container from the users in the node.
-->
在创建 Pod 时，默认情况下，会使用几个新的名字空间进行隔离：
一个网络名字空间来隔离容器的网络，一个 PID 名字空间隔离进程的视图等。
如果使用用户名称空间，这将把容器中的用户与节点中的用户隔离开来。

<!--
This means containers can run as root and be mapped to a non-root user on the
host. Inside the container the process will think it is running as root (and
therefore tools like `apt`, `yum`, etc. work fine), while in reality the process
doesn't have privileges on the host. You can verify this, for example, if you
check the user the container process is running `ps` from the host. The user
`ps` shows is not the same as the user you see if you execute inside the
container the command `id`.
-->
这意味着容器可以以 root 用户运行并映射到主机的一个非 root 用户。
在容器内，进程会认为它以 root 用户运行（因此像 `apt`、`yum` 等工具可以正常工作），
而实际上这个进程没有主机的权限。
你可以这样验证，例如，如果你检查用户，则容器进程正在从主机运行 `ps`。
用户 `ps` 显示的命令 `id` 和你在容器内执行的是不同的。

<!--
This abstraction limits what can happen, for example, if the container manages
to escape to the host. Given that the container is running as a non-privileged
user on the host, it is limited what it can do to the host.

Furthermore, as users on each pod will be mapped to different non-overlapping
users in the host, it is limited what they can do to other pods too.
-->
这种抽象限制了一些可能发生的情况，例如，如果容器设法逃到主机，
假设容器以主机上的一个非特权用户运行，那么它在主机上可执行的操作是有限的。

此外，由于每个 Pod 上的用户将被映射到主机中不同的不重复的用户，
所以他们对其他 Pod 的操作也是有限的。

<!--
Capabilities granted to a pod are also limited to the pod user namespace and
mostly invalid out of it, some are even completely void. Here are two examples:
- `CAP_SYS_MODULE` does not have any effect if granted to a pod using user
namespaces, the pod isn't able to load kernel modules.
- `CAP_SYS_ADMIN` is limited to the pod's user namespace and invalid outside
of it.
-->
赋予 Pod 的一些能力也仅限于 Pod 用户名字空间内，其中大部分是无效的，有些甚至完全无效。
这里有两个例子：
- `CAP_SYS_MODULE` 被授予给使用用户名字空间的 Pod 后是不会起作用的，Pod 将无法加载到内核模块。
- `CAP_SYS_ADMIN` 仅限于 Pod 的用户名字空间，在外部无效。

<!--
Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capability were
granted to the container, the capabilities are valid on the host too. None of
this is true when we use user namespaces.

If you want to know more details about what changes when user namespaces are in
use, see `man 7 user_namespaces`.
-->
在不使用用户名字空间的情况下，对于以 root 用户运行的容器而言，当发生容器逃逸时，
容器将拥有在主机上的 root 用户权限。如果容器被授予了某些能力，则这些能力在主机上同样有效。
当我们使用用户名字空间后就不会出现这样的问题。

如果你想详细了解关于用户名字空间在使用时会发生什么变化，请参见 `man 7 user_namespaces`。

<!--
## Set up a node to support user namespaces

It is recommended that the host's files and host's processes use UIDs/GIDs in
the range of 0-65535.
 
The kubelet will assign UIDs/GIDs higher than that to pods. Therefore, to
guarantee as much isolation as possible, the UIDs/GIDs used by the host's files
and host's processes should be in the range 0-65535.
-->
## 设置节点支持用户名字空间 {#set-up-a-node-to-support-user-namespaces}

建议主机的文件和进程使用 UID/GID 的范围为 0-65535。

kubelet 将分配给 Pod 更高的 UID/GID。
因此，为了尽可能保证隔离，主机上的文件和主机进程使用的 UID/GID 应在 0-65535 范围内。

<!--
Note that this recommendation is important to mitigate the impact of CVEs like
[CVE-2021-25741][CVE-2021-25741], where a pod can potentially read arbitrary
files in the hosts. If the UIDs/GIDs of the pod and the host don't overlap, it
is limited what a pod would be able to do: the pod UID/GID won't match the
host's file owner/group.
-->
请注意，此建议对于降低 CVE 的影响非常重要，
例如 [CVE-2021-25741][CVE-2021-25741]，Pod 可以读取主机中的任意文件。
如果 Pod 和主机的 UID/GID 不重叠，
那么 Pod 能做的事情就会被限制：Pod 的 UID/GID 与主机的文件所有者/组不匹配。

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980

<!--
## Limitations

When using a user namespace for the pod, it is disallowed to use other host
namespaces. In particular, if you set `hostUsers: false` then you are not
allowed to set any of:
-->
## 限制 {#limitations}

当 Pod 使用了用户名字空间，就不在允许使用其他主机名字空间。
特别是，如果设置了 `hostUsers: false`，则不允许设置以下任何一项：

* `hostNetwork: true`
* `hostIPC: true`
* `hostPID: true`

<!--
The pod is allowed to use no volumes at all or, if using volumes, only these
volume types are allowed:
-->
Pod 可以完全不使用任何卷，如果需要使用卷，则只有以下类型的允许使用：

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
-->
为保证 Pod 可以读取到这些卷中的文件，
卷的创建就像你指定 Pod 的 `.spec.securityContext.fsGroup` 指定为 `0` 一样。
如果它被指定为一个不同的值，当然会使用你指定的值。

<!--
As a by-product of this, folders and files for these volumes will have
permissions for the group, even if `defaultMode` or `mode` to specific items of
the volumes were specified without permissions to groups. For example, it is not
possible to mount these volumes in a way that its files have permissions only
for the owner.
-->
作为此操作的副作用是，这些卷中的文件夹和文件将拥有该组的权限，
即使在没有组权限的情况下为卷的 `defaultMode` 或 `mode` 设置了值。
例如，无法以这些文件仅对所有者具权限的方式挂载这些卷。
