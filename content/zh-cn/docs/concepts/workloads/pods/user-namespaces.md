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
本页介绍了如何在 Kubernetes Pod 中使用用户名字空间。
用户名字空间允许在容器中运行的用户与在主机中的用户隔离。

<!-- 
A process running as root in a container can run as a different (non-root) user
in the host; in other words, the process has full privileges for operations
inside the user namespace, but is unprivileged for operations outside the
namespace. 
-->
在容器中以 root 身份运行的进程可以在主机中以不同的（非 root 用户）用户身份运行；
换句话说，该进程对用户名字空间内的操作具有完全的权限，但对在名字空间外的操作没有特权。

<!-- 
You can use this feature to reduce the damage a compromised container can do to
the host or other pods in the same node. There are [several security
vulnerabilities][KEP-vulns] rated either **HIGH** or **CRITICAL** that were not
exploitable when user namespaces is active. It is expected user namespace will
mitigate some future vulnerabilities too. 
-->
你可以使用这个功能来减少受损的容器可能对主机或者同一节点上其他 Pod 造成的损害。
当用户名字空间处于活动状态时，有 [安全漏洞][KEP-vulns] 被评为 **HIGH** 或 **CRITICAL**
时这些漏洞是不可利用的。
预计用户名字空间也将减少一些未来的漏洞。

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

<!-- body -->
## {{% heading "prerequisites" %}}

{{% thirdparty-content single="true" %}}
<!-- if adding another runtime in the future, omit the single setting -->

<!-- 
This is a Linux only feature. In addition, support is needed in the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
to use this feature with Kubernetes stateless pods: 
-->
这是 Linux 独有的功能，另外，在 Kubernetes 无状态 Pod
中使用此功能需要{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}的支持。

<!-- 
* CRI-O: v1.25 has support for user namespaces.

* containerd: support is planned for the 1.7 release. See containerd
  issue [#7063][containerd-userns-issue] for more details. 
-->
* CRI-O：v1.25 已经支持用户名字空间。

* containerd：计划在 1.7 版本中提供支持，
  更详细信息，请查阅 containerd issue [#7063][containerd-userns-issue]。

<!--
Support for this in [cri-dockerd is not planned][CRI-dockerd-issue] yet.

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74
[containerd-userns-issue]: https://github.com/containerd/containerd/issues/7063 
-->
[cri-dockerd 还没有计划][CRI-dockerd-issue]提供用户名字空间支持。

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74
[containerd-userns-issue]: https://github.com/containerd/containerd/issues/7063 

<!-- 
## Introduction 

User namespaces is a Linux feature that allows to map users in the container to
different users in the host. Furthermore, the capabilities granted to a pod in
a user namespace are valid only in the namespace and void outside of it. 
-->
## 简介   {#introduction}

用户名字空间是一个 Linux 功能，它允许将容器中的用户映射到主机中的不同用户。
此外，在用户名字空间中授权 Pod 的功能仅在名字空间中有效，在名字空间之外无效。

<!-- 
A pod can opt-in to use user nameapces by setting the `pod.spec.hostUsers` field
to `false`.

The kubelet will pick host UIDs/GIDs a pod is mapped to, and will do so in a way
to guarantee that no two stateless pods on the same node use the same mapping. 
-->
Pod 可以通过设置 `pod.spec.hostUsers` 字段为 `false`
来选择使用用户名字空间。

Kubelet 将选择某个 Pod 所映射的主机 UID/GID，
这样做的方式是确保同一节点上的没有两个无状态的 Pod 使用相同的映射。

<!-- 
The `runAsUser`, `runAsGroup`, `fsGroup`, etc. fields in the `pod.spec` always
refer to the user inside the container.

The valid UIDs/GIDs when this feature is enabled is the range 0-65535. This
applies to files and processes (`runAsUser`, `runAsGroup`, etc.). 
-->
`pod.spec` 中的 `runAsUser`、`runAsGroup`、`fsGroup` 等字段总是指容器内的用户。

启用此特性时有效的 UIDs/GIDs 范围是 0-65535。
范围的限制适用于文件和进程（`runAsUser`、`runAsGroup` 等）。

<!-- 
Files using a UID/GID outside this range will be seen as belonging to the
overflow ID, usually 65534 (configured in `/proc/sys/kernel/overflowuid` and
`/proc/sys/kernel/overflowgid`). However, it is not possible to modify those
files, even by running as the 65534 user/group. 
-->
使用超出此范围的 UID/GID 的文件将被视为属于溢出 ID，通常为 65534
（配置在 `/proc/sys/kernel/overflowuid` 和 `/proc/sys/kernel/overflowgid`）。
但是，即使以 65534 用户/组的身份运行，也不可能修改这些文件。

<!-- 
Most applications that need to run as root but don't access other host
namespaces or resources, should continue to run fine without any changes needed
if user namespaces is activated. 
-->
对于需要以 root 身份运行但是不需要访问宿主名字空间或者宿主资源的大多数应用而言，
如果用户名字空间被激活，应用可以继续运行而不需要修改。

<!-- 
## Understanding user namespaces for stateless pods

Several container runtimes with their default configuration (like Docker Engine,
containerd, CRI-O) use Linux namespaces for isolation. Other technologies exist
and can be used with those runtimes too (e.g. Kata Containers uses VMs instead of
Linux namespaces). This page is applicable for container runtimes using Linux
namespaces for isolation. 
-->
## 了解无状态 Pod 的用户名字空间   {#understanding-user-namespaces-for-stateless-pods}

一些容器运行时的默认配置（如 Docker Engine、containerd、CRI-O）使用 Linux 名字空间进行隔离。
其他技术也存在并且可以和这些运行时一起使用（例如 Kata Containers 使用虚拟机而不是 Linux 名字空间）。
本页适用于使用 Linux 名字空间进行隔离的容器运行时。

<!-- 
When creating a pod, by default, several new namespaces are used for isolation:
a network namespace to isolate the network of the container, a PID namespace to
isolate the view of processes, etc. If a user namespace is used, this will
isolate the users in the container from the users in the node. 
-->
在创建 Pod 时，默认会使用几个新的名字空间实现隔离：
一个用来隔离容器网络的网络名字空间，一个用户隔离进程视图的 PID 名字空间等。
如果使用了一个用户名字空间，将会把容器中的用户与节点中的用户隔离开来。

<!-- 
This means containers can run as root and be mapped to a non-root user on the
host. Inside the container the process will think it is running as root (and
therefore tools like `apt`, `yum`, etc. work fine), while in reality the process
doesn't have privileges on the host. You can verify this, for example, if you
check the user the container process is running `ps` from the host. The user
`ps` shows is not the same as the user you see if you execute inside the
container the command `id`. 
-->
这意味着容器可以以 root 身份运行，并映射到主机上的一个非 root 用户。
在容器内，进程会认为它是以 root 身份运行（因此像 `apt`、`yum` 等命令可以正常执行），
而实际上该进程在主机没有这些特权。
你可以验证这一点，例如，如果你在主机上检查容器进程运行的 `ps` 用户，
`ps` 用户与你在容器中执行命令 `id` 显示的不同。

<!-- 
This abstraction limits what can happen, for example, if the container manages
to escape to the host. Given that the container is running as a non-privileged
user on the host, it is limited what it can do to the host. 
-->
这种抽象限制了当容器成功逃逸到主机上这类事件时可能引发的后果。
鉴于容器是在主机上作为非特权用户运行，它能对主机执行的操作是受限的。

<!-- 
Furthermore, as users on each pod will be mapped to different non-overlapping
users in the host, it is limited what they can do to other pods too. 
-->
此外，由于每个 Pod 中的用户将被映射到主机上不同的、互不重叠的用户，
这些用户可以对其他 Pod 执行的操作也同样是受限的。

<!-- 
Capabilities granted to a pod are also limited to the pod user namespace and
mostly invalid out of it, some are even completely void. Here are two examples:
- `CAP_SYS_MODULE` does not have any effect if granted to a pod using user
namespaces, the pod isn't able to load kernel modules.
- `CAP_SYS_ADMIN` is limited to the pod's user namespace and invalid outside
of it. 
-->
一个 Pod 所被赋予的权能也受限于该 Pod 的用户名字空间，而在该名字空间之外大部分是无效的，有些甚至是无效的。
以下是两个示例：
- 当 `CAP_SYS_MODULE` 权能被赋予一个使用用户名字空间的 Pod 时没有任何效果，且 Pod 无法加载内核模块。
- `CAP_SYS_ADMIN` 权能仅限于 Pod 的用户名字空间，在该名字空间之外是无效的。

<!-- 
Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capability were
granted to the container, the capabilities are valid on the host too. None of
this is true when we use user namespaces. 
-->
在不使用用户名字空间的情况下，如果容器以 root 身份运行，容器一旦完成逃逸，在节点上就会拥有 root 特权。
如果某些权能被赋予给某容器，这些权能在主机上也是有效的。
当我们使用用户名字空间时，这些都不会发生。

<!-- 
If you want to know more details about what changes when user namespaces are in
use, see `man 7 user_namespaces`. 
-->
如果你想了解有关使用用户名字空间时会发生哪些变化的进一步详细信息，
参阅 `man 7 user_namespaces`。

<!-- 
## Set up a node to support user namespaces

It is recommended that the host's files and host's processes use UIDs/GIDs in
the range of 0-65535. 
-->
## 设置节点以支持用户名字空间   {#set-up-a-node-to-support-user-namespaces}

建议主机上的文件和主机上的进程使用 0-65535 范围内的 UID/GID 值。

<!-- 
The kubelet will assign UIDs/GIDs higher than that to pods. Therefore, to
guarantee as much isolation as possible, the UIDs/GIDs used by the host's files
and host's processes should be in the range 0-65535. 
-->
Kubelet 会将高于该值的 UID/GID 值分配给 Pod 使用。
因此，为了尽可能地保证隔离，主机上的文件和主机上的进程使用的 UID/GID 应在 0-65535 范围内。

<!-- 
Note that this recommendation is important to mitigate the impact of CVEs like
[CVE-2021-25741][CVE-2021-25741], where a pod can potentially read arbitrary
files in the hosts. If the UIDs/GIDs of the pod and the host don't overlap, it
is limited what a pod would be able to do: the pod UID/GID won't match the
host's file owner/group. 
-->
这个建议对于缓解类似 [CVE-2021-25741][CVE-2021-25741] 这类 CVE 所造成的影响很重要，
这类 CVE 会导致 Pod 能够读取主机上的任意文件。
如果 Pod 和主机之间的 UID/GID 集合不重叠，那么 Pod 能做的事情就是有限的：
Pod UID/GID 不会匹配主机上的文件所有者/组。

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980

<!-- 
## Limitations

When using a user namespace for the pod, it is disallowed to use other host
namespaces. In particular, if you set `hostUsers: false` then you are not
allowed to set any of: 

 * `hostNetwork: true`
 * `hostIPC: true`
 * `hostPID: true`
-->
## 限制   {#limitations}

当一个 Pod 使用了用户名字空间时，它将不被允许使用其他的宿主名字空间。
特别是，如果你设置了 `hostUsers: false`，则不允许你设置以下任何一项：

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
这样的 Pod 或者完全不允许使用卷，或者如果使用卷，只能允许使用以下卷类型。

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
为了保证 Pod 可以读这些卷中的文件，
卷被创建时就像你将 Pod 的 `.spec.securityContext.fsGroup` 设置为 `0` 一样。
如果这一属性被设置为别的值，那么所设置的值当然会被正确处理。

<!-- 
As a by-product of this, folders and files for these volumes will have
permissions for the group, even if `defaultMode` or `mode` to specific items of
the volumes were specified without permissions to groups. For example, it is not
possible to mount these volumes in a way that its files have permissions only
for the owner. 
-->
作为一种副作用，这些卷中的文件夹和文件将允许所给用户组访问，
即使 `defaultMode` 或卷中的特定条目对应的 `mode` 没有为所指定的用户组授权也是一样。
例如，不可以设置所挂载的这些卷只允许所有者访问其中的文件。
