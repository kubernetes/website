---
title: 用户 命名空间
reviewers:
content_type: concept
weight: 160
min-kubernetes-server-version: v1.25
---

<!--
---
title: User Namespaces
reviewers:
content_type: concept
weight: 160
min-kubernetes-server-version: v1.25
---
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

You can use this feature to reduce the damage a compromised container can do to
the host or other pods in the same node. There are [several security vulnerabilities][KEP-vulns] rated either **HIGH** or **CRITICAL** that were not
exploitable when user namespaces is active. It is expected user namespace will
mitigate some future vulnerabilities too.

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation
-->
本页面说明用户命名空间在Kubernetes Pods中如何使用的。用户命名空间允许将在容器内运行的用户与在主机中运行的用户隔离。

在容器中以root用户身份运行的进程可以在主机中以不同的(非root)用户身份运行；换句话说，该进程对用户命名空间内的操作具有所有权限，但对名称空间外的操作没有特权。

您可以使用此功能来减少受损容器可能对主机或同一节点中的其他Pod造成的损害。当用户命名空间处于活动状态时，有[几个安全漏洞][KEP-vulns]被评为**高**或**严重**，无法利用。预计用户命名空间也将缓解未来的一些漏洞。

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

<!-- body -->
## {{% heading "阅读之前" %}}

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

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74
[containerd-userns-issue]: https://github.com/containerd/containerd/issues/7063
-->
这只是一个Linux特性。除此之外还需要有容器运行环境的的支持才能够在Kubernetes无状态Pods中使用。
* CRI-O: v1.25 已经支持了用户命名空间.

* containerd: 支持被安排在Release 1.7. 详情请参考containerd issue [#7063][containerd-userns-issue] for more details.

* [cri-dockerd 还没有计划][CRI-dockerd-issue] 支持此特性。

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74
[containerd-userns-issue]: https://github.com/containerd/containerd/issues/7063

<!-- 
## Introduction
-->

## 简介
<!-- 
User namespaces is a Linux feature that allows to map users in the container to
different users in the host. Furthermore, the capabilities granted to a pod in
a user namespace are valid only in the namespace and void outside of it.
-->
用户命名空间是Linux的一项功能，它允许将容器中的用户映射到主机中的不同用户。此外，授予用户命名空间中的Pod的能力仅在命名空间中有效，而在命名空间之外无效。

<!--
A pod can opt-in to use user namespaces by setting the `pod.spec.hostUsers` field
to `false`.
-->
Pod可以通过设置`pod.spec.host Users`字段为`false`来选择使用用户命名空间.

<!--
The kubelet will pick host UIDs/GIDs a pod is mapped to, and will do so in a way
to guarantee that no two stateless pods on the same node use the same mapping.
-->
Kubelet将选出Pod映射到的主机UID/GID，并且将以一种方式来确保同一节点上的两个无状态Pod不使用相同的映射。
<!--
The `runAsUser`, `runAsGroup`, `fsGroup`, etc. fields in the `pod.spec` always
refer to the user inside the container.
-->
`pod.spec`中的`runAsUser`、`runAsGroup`、`fsGroup`等字段都是指容器内部的用户。
<!--
The valid UIDs/GIDs when this feature is enabled is the range 0-65535. This
applies to files and processes (`runAsUser`, `runAsGroup`, etc.).
-->
启用此功能时，有效的UID/GID范围为0-65535。这适用于文件和进程(`runAsUser`、`runAsGroup`等)。
<!--
Files using a UID/GID outside this range will be seen as belonging to the
overflow ID, usually 65534 (configured in `/proc/sys/kernel/overflowuid` and
`/proc/sys/kernel/overflowgid`). However, it is not possible to modify those
files, even by running as the 65534 user/group.
-->
UID/GID超出该范围的文件将被视为属于溢出ID，溢出ID的值通常为65534(在`/proc/sys/core/overflow uid`和`/proc/sys/core/overflow gid`中配置)。但是，即使以65534用户/组身份运行，也无法修改这些文件。
<!--
Most applications that need to run as root but don't access other host
namespaces or resources, should continue to run fine without any changes needed
if user namespaces is activated.
-->
如果激活了用户命名空间，则大多数需要以root用户身份运行但不访问其他主机命名空间或资源的应用程序应该可以继续正常运行，而无需进行任何更改。
<!--
## Understanding user namespaces for stateless pods
-->
## 理解无状态Pods下的用户命名空间
<!--
Several container runtimes with their default configuration (like Docker Engine,
containerd, CRI-O) use Linux namespaces for isolation. Other technologies exist
and can be used with those runtimes too (e.g. Kata Containers uses VMs instead of
Linux namespaces). This page is applicable for container runtimes using Linux
namespaces for isolation.
-->
一些默认配置的容器运行时(如Docker Engine、Containerd、CRI-O)使用Linux命名空间进行隔离。还有其他技术也可以用于这些运行时(例如，Kata容器使用的是VM而不是Linux命名空间)。本文适用于使用Linux命名空间进行隔离的容器运行时。

<!--
When creating a pod, by default, several new namespaces are used for isolation:
a network namespace to isolate the network of the container, a PID namespace to
isolate the view of processes, etc. If a user namespace is used, this will
isolate the users in the container from the users in the node.
-->
在创建Pod时，默认情况下会使用几个新的命名空间进行隔离：用于隔离容器网络的网络命名空间、用于隔离进程视图的PID命名空间等。如果使用用户命名空间，则会将容器中的用户与节点中的用户隔离.

<!--
This means containers can run as root and be mapped to a non-root user on the
host. Inside the container the process will think it is running as root (and
therefore tools like `apt`, `yum`, etc. work fine), while in reality the process
doesn't have privileges on the host. You can verify this, for example, if you
check the user the container process is running `ps` from the host. The user
`ps` shows is not the same as the user you see if you execute inside the
container the command `id`.
-->
这意味着容器可以作为root用户运行，并且可以被映射到主机上的非root用户。在容器内，进程会认为它是以root用户运行（因为可以运行`apt`, `yum`等工具），而实际上进程在主机上没有特权。例如，如果您检查用户容器进程正在从主机运行`ps`。`ps`显示的用户与您在容器内执行命令`id`时看到的用户不同。

<!--
This abstraction limits what can happen, for example, if the container manages
to escape to the host. Given that the container is running as a non-privileged
user on the host, it is limited what it can do to the host.
-->
这种抽象限制了可能发生的安全风险，例如，如果容器设法逃逸到宿主。鉴于容器在主机上以非特权用户身份运行，它可以对主机执行的操作受到限制。

<!--
Furthermore, as users on each pod will be mapped to different non-overlapping
users in the host, it is limited what they can do to other pods too.
-->
此外，由于每个Pod上的用户将被映射到主机中不同的非重叠用户，因此他们对其他Pod的操作也受到限制。

<!--
Capabilities granted to a pod are also limited to the pod user namespace and
mostly invalid out of it, some are even completely void. Here are two examples:
- `CAP_SYS_MODULE` does not have any effect if granted to a pod using user
namespaces, the pod isn't able to load kernel modules.
- `CAP_SYS_ADMIN` is limited to the pod's user namespace and invalid outside
of it.
-->
授予Pod的功能也仅限于Pod用户命名空间，其中大部分是无效的，有些甚至是完全无效的。这里有两个例子：
- `CAP_SYS_MODULE` 如果被授予使用用户命名空间的Pod，则不会有任何效果，Pod不能加载内核模块。
- `CAP_sys_ADMIN`受限于Pod的用户命名空间，外部无效。

<!--
Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capability were
granted to the container, the capabilities are valid on the host too. None of
this is true when we use user namespaces.

If you want to know more details about what changes when user namespaces are in
use, see `man 7 user_namespaces`.
-->

在不使用用户命名空间的情况下，以root用户权限运行的容器一旦逃脱，将会在节点上拥有root权限。 并且如果容器被授予一些特性权限，这些特性权限在节点上也合法。用户命名空间可以帮助我们避免类似情况。

如果你想了解使用用户命名空间带来的改变的具体细节，请参考`man 7 user_namespace`。

<!--
## Set up a node to support user namespaces

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

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980
-->

## 设置节点以支持用户命名空间

建议主机文件或者主机进程使用在0-65535 的UID/GID，Kublet将分配比主机更高的UID/GID 给Pods。因此为了尽可能保证更多的隔离， 节点主机文件或进程应该使用0-65535 的UID/GID。

这个建议对减轻一些CVE的影响是很重要的，比如[CVE-2021-25741][CVE-2021-25741]里面提到的Pod可能可以随机读到主机上的文件。如果Pod和主机的UID/GID没有重叠部分，因为Pod的UID/GID不会匹配到主机上文件的拥有者或者拥有者组，所以Pod能做的事情将受到限制。

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980

<!--
## Limitations
-->

## 限制

<!--
When using a user namespace for the pod, it is disallowed to use other host
namespaces. In particular, if you set `hostUsers: false` then you are not
allowed to set any of:

 * `hostNetwork: true`
 * `hostIPC: true`
 * `hostPID: true`

The pod is allowed to use no volumes at all or, if using volumes, only these
volume types are allowed:

 * configmap
 * secret
 * projected
 * downwardAPI
 * emptyDir
-->

当Pod使用用户命名空间时，Pod将不再被允许使用其他的主机命名空间。具体来讲，如果你设置了`hostUsers: false`， 那么你将不被允许设置下面的任何主机命名空间的配置：
 * `hostNetwork: true`
 * `hostIPC: true`
 * `hostPID: true`

<!--
To guarantee that the pod can read the files of such volumes, volumes are
created as if you specified `.spec.securityContext.fsGroup` as `0` for the Pod.
If it is specified to a different value, this other value will of course be
honored instead.
-->
为了确保Pod可以读取文件卷中的文件，文件卷的创建方式就行你指定`.spec.securityContext.fsGroup` 为`0` 一样。 如果它被指定给一个不同的值，那么其他值也会被接受。

<!--
As a by-product of this, folders and files for these volumes will have
permissions for the group, even if `defaultMode` or `mode` to specific items of
the volumes were specified without permissions to groups. For example, it is not
possible to mount these volumes in a way that its files have permissions only
for the owner.
-->
随之而来的影响是，这些卷的文件夹和文件将会有这些组的群贤， 尽管对于特定的文件卷的`defaultMode` 或者 `mode`被指定时没有授予租的权限。例如，不可能仅仅以文件所有者权限的方式挂载这些卷。