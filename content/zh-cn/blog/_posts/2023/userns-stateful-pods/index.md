---
layout: blog
title: "用户命名空间：对运行有状态 Pod 的支持进入 Alpha 阶段!"
date: 2023-09-13
slug: userns-alpha
---

<!--
layout: blog
title: "User Namespaces: Now Supports Running Stateful Pods in Alpha!"
date: 2023-09-13
slug: userns-alpha
-->

<!--
**Authors:** Rodrigo Campos Catelin (Microsoft), Giuseppe Scrivano (Red Hat), Sascha Grunert (Red Hat)
-->
**作者：** Rodrigo Campos Catelin (Microsoft), Giuseppe Scrivano (Red Hat), Sascha Grunert (Red Hat)

**译者：** Xin Li (DaoCloud)

<!--
Kubernetes v1.25 introduced support for user namespaces for only stateless
pods. Kubernetes 1.28 lifted that restriction, after some design changes were
done in 1.27.
-->
Kubernetes v1.25 引入用户命名空间（User Namespace）特性，仅支持无状态（Stateless）Pod。
Kubernetes 1.28 在 1.27 的基础上中进行了一些改进后，取消了这一限制。

<!--
The beauty of this feature is that:
 * it is trivial to adopt (you just need to set a bool in the pod spec)
 * doesn't need any changes for **most** applications
 * improves security by _drastically_ enhancing the isolation of containers and
   mitigating CVEs rated HIGH and CRITICAL.
-->
此特性的精妙之处在于：

 * 使用起来很简单（只需在 Pod 规约（spec）中设置一个 bool）
 * **大多数**应用程序不需要任何更改
 * 通过**大幅度**加强容器的隔离性以及应对评级为高（HIGH）和关键（CRITICAL）的 CVE 来提高安全性。

<!--
This post explains the basics of user namespaces and also shows:
 * the changes that arrived in the recent Kubernetes v1.28 release
 * a **demo of a vulnerability rated as HIGH** that is not exploitable with user namespaces
 * the runtime requirements to use this feature
 * what you can expect in future releases regarding user namespaces.
-->
这篇文章介绍了用户命名空间的基础知识，并展示了：

* 最近的 Kubernetes v1.28 版本中出现的变化
* 一个评级为**高（HIGH）的漏洞的演示（Demo）**，该漏洞无法在用户命名空间中被利用
* 使用此特性的运行时要求
* 关于用户命名空间的未来版本中可以期待的内容

<!--
## What is a user namespace?

A user namespace is a Linux feature that isolates the user and group identifiers
(UIDs and GIDs) of the containers from the ones on the host. The indentifiers
in the container can be mapped to indentifiers on the host in a way where the
host UID/GIDs used for different containers never overlap. Even more, the
identifiers can be mapped to *unprivileged* non-overlapping UIDs and GIDs on the
host. This basically means two things:
-->
## 用户命名空间是什么？

用户命名空间是 Linux 的一项特性，它将容器的用户和组标识符（UID 和 GID）与宿主机上的标识符隔离开来。
容器中的标识符可以映射到宿主机上的标识符，其中用于不同容器的主机 UID/GID 从不重叠。
更重要的是，标识符可以映射到宿主机上的**非特权**、非重叠的 UID 和 GID。这基本上意味着两件事：

<!--
 * As the UIDs and GIDs for different containers are mapped to different UIDs
   and GIDs on the host, containers have a harder time to attack each other even
   if they escape the container boundaries. For example, if container A is running
   with different UIDs and GIDs on the host than container B, the operations it
   can do on container B's files and process are limited: only read/write what a
   file allows to others, as it will never have permission for the owner or
   group (the UIDs/GIDs on the host are guaranteed to be different for
   different containers).
-->
 * 由于不同容器的 UID 和 GID 映射到宿主机上不同的 UID 和 GID，因此即使它们逃逸出了容器的边界，也很难相互攻击。
   例如，如果容器 A 在宿主机上使用与容器 B 不同的 UID 和 GID 运行，则它可以对容器 B
   的文件和进程执行的操作受到限制：只能读/写允许其他人使用的文件，
   因为它永远不会拥有所有者或组的权限（宿主机上的 UID/GID 保证对于不同的容器是不同的）。

<!--
 * As the UIDs and GIDs are mapped to unprivileged users on the host, if a
   container escapes the container boundaries, even if it is running as root
   inside the container, it has no privileges on the host. This greatly
   protects what host files it can read/write, which process it can send signals
   to, etc.

Furthermore, capabilities granted are only valid inside the user namespace and
not on the host.
-->
 * 由于 UID 和 GID 映射到宿主机上的非特权用户，如果容器逃逸出了容器边界，
   即使它在容器内以 root 身份运行，它在宿主机上也没有特权。
   这极大地保护了它可以读/写哪些宿主机文件、可以向哪个进程发送信号等。

此外，所授予的权能（Capability）仅在用户命名空间内有效，而在宿主机上无效。

<!--
Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capabilities
were granted to the container, the capabilities are valid on the host too. None
of this is true when using user namespaces (modulo bugs, of course 🙂).
-->
在不使用用户命名空间的情况下，以 root 身份运行的容器在发生逃逸的情况下会获得节点上的
root 权限。如果某些权能被授予容器，那么这些权能在主机上也有效。
当使用用户命名空间时，这些情况都会被避免（当然，除非存在漏洞 🙂）。

<!--
## Changes in 1.28

As already mentioned, starting from 1.28, Kubernetes supports user namespaces
with stateful pods. This means that pods with user namespaces can use any type
of volume, they are no longer limited to only some volume types as before.
-->
## 1.28 版本的变化

正如之前提到的，从 1.28 版本开始，Kubernetes 支持有状态的 Pod 的用户命名空间。
这意味着具有用户命名空间的 Pod 可以使用任何类型的卷，不再仅限于以前的部分卷类型。

<!--
The feature gate to activate this feature was renamed, it is no longer
`UserNamespacesStatelessPodsSupport` but from 1.28 onwards you should use
`UserNamespacesSupport`. There were many changes done and the requirements on
the node hosts changed. So with Kubernetes 1.28 the feature flag was renamed to
reflect this.
-->
从 1.28 版本开始，用于激活此特性的特性门控已被重命名，不再是 `UserNamespacesStatelessPodsSupport`，
而应该使用 `UserNamespacesSupport`。此特性经历了许多更改，
对节点主机的要求也发生了变化。因此，Kubernetes 1.28 版本将该特性标志重命名以反映这一变化。

<!--
## Demo

Rodrigo created a demo which exploits [CVE 2022-0492][cve-link] and shows how
the exploit can occur without user namespaces. He also shows how it is not
possible to use this exploit from a Pod where the containers are using this
feature.
-->
## 演示

Rodrigo 创建了一个利用 [CVE 2022-0492][cve-link] 的演示，
用以展现如何在没有用户命名空间的情况下利用该漏洞。
他还展示了在容器使用了此特性的 Pod 中无法利用此漏洞的情况。

<!--
This vulnerability is rated **HIGH** and allows **a container with no special
privileges to read/write to any path on the host** and launch processes as root
on the host too.

{{< youtube id="M4a2b4KkXN8" title="Mitigation of CVE-2022-0492 on Kubernetes by enabling User Namespace support">}}
-->
此漏洞被评为高危，允许一个没有特殊特权的容器读/写宿主机上的任何路径，并在宿主机上以 root 身份启动进程。

{{< youtube id="M4a2b4KkXN8" title="Mitigation of CVE-2022-0492 on Kubernetes by enabling User Namespace support">}}

<!--
Most applications in containers run as root today, or as a semi-predictable
non-root user (user ID 65534 is a somewhat popular choice). When you run a Pod
with containers using a userns, Kubernetes runs those containers as unprivileged
users, with no changes needed in your app.
-->
如今，容器中的大多数应用程序都以 root 身份运行，或者以半可预测的非 root
用户身份运行（用户 ID 65534 是一个比较流行的选择）。
当你运行某个 Pod，而其中带有使用用户名命名空间（userns）的容器时，Kubernetes
以非特权用户身份运行这些容器，无需在你的应用程序中进行任何更改。

<!--
This means two containers running as user 65534 will effectively be mapped to
different users on the host, limiting what they can do to each other in case of
an escape, and if they are running as root, the privileges on the host are
reduced to the one of an unprivileged user.

[cve-link]: https://unit42.paloaltonetworks.com/cve-2022-0492-cgroups/
-->
这意味着两个以用户 65534 身份运行的容器实际上会被映射到宿主机上的不同用户，
从而限制了它们在发生逃逸的情况下能够对彼此执行的操作，如果它们以 root 身份运行，
宿主机上的特权也会降低到非特权用户的权限。

[cve-link]: https://unit42.paloaltonetworks.com/cve-2022-0492-cgroups/

<!--
## Node system requirements

There are requirements on the Linux kernel version as well as the container
runtime to use this feature.
-->
## 节点系统要求 

要使用此功能，对 Linux 内核版本以及容器运行时有一定要求。

<!--
On Linux you need Linux 6.3 or greater. This is because the feature relies on a
kernel feature named idmap mounts, and support to use idmap mounts with tmpfs
was merged in Linux 6.3.

If you are using CRI-O with crun, this is [supported in CRI-O
1.28.1][CRIO-release] and crun 1.9 or greater. If you are using CRI-O with runc,
this is still not supported.
-->
在 Linux上，你需要 Linux 6.3 或更高版本。这是因为该特性依赖于一个名为
idmap mounts 的内核特性，而 Linux 6.3 中合并了针对 tmpfs 使用 idmap mounts 的支持

如果你使用 CRI-O 与 crun，这一特性在 [CRI-O 1.28.1][CRIO-release] 和 crun 1.9 或更高版本中受支持。
如果你使用 CRI-O 与 runc，目前仍不受支持。

<!--
containerd support is currently targeted for containerd 2.0; it is likely that
it won't matter if you use it with crun or runc.

Please note that containerd 1.7 added _experimental_ support for user
namespaces as implemented in Kubernetes 1.25 and 1.26. The redesign done in 1.27
is not supported by containerd 1.7, therefore it only works, in terms of user
namespaces support, with Kubernetes 1.25 and 1.26.
-->
containerd 对此的支持目前设定的目标是 containerd 2.0；不管你是否与 crun 或 runc 一起使用，或许都不重要。

请注意，containerd 1.7 添加了对用户命名空间的实验性支持，正如在 Kubernetes 1.25
和 1.26 中实现的那样。1.27 版本中进行的重新设计不受 containerd 1.7 支持，
因此它在用户命名空间支持方面仅适用于 Kubernetes 1.25 和 1.26。

<!--
One limitation present in containerd 1.7 is that it needs to change the
ownership of every file and directory inside the container image, during Pod
startup. This means it has a storage overhead and can significantly impact the
container startup latency. Containerd 2.0 will probably include a implementation
that will eliminate the startup latency added and the storage overhead. Take
this into account if you plan to use containerd 1.7 with user namespaces in
production.

None of these containerd limitations apply to [CRI-O 1.28][CRIO-release].

[CRIO-release]: https://github.com/cri-o/cri-o/releases/tag/v1.28.1
-->
containerd 1.7 存在的一个限制是，在 Pod 启动期间需要更改容器镜像中每个文件和目录的所有权。
这意味着它具有存储开销，并且可能会显著影响容器启动延迟。containerd 2.0
可能会包括一个实现，可以消除增加的启动延迟和存储开销。如果计划在生产中使用
containerd 1.7 与用户命名空间，请考虑这一点。

这些 Containerd 限制均不适用于 [CRI-O 1.28][CRIO 版本]。

[CRIO-release]: https://github.com/cri-o/cri-o/releases/tag/v1.28.1

<!--
## What’s next?

Looking ahead to Kubernetes 1.29, the plan is to work with SIG Auth to integrate user
namespaces to Pod Security Standards (PSS) and the Pod Security Admission. For
the time being, the plan is to relax checks in PSS policies when user namespaces are
in use. This means that the fields `spec[.*].securityContext` `runAsUser`,
`runAsNonRoot`, `allowPrivilegeEscalation` and `capabilities` will not trigger a
violation if user namespaces are in use. The behavior will probably be controlled by
utilizing a API Server feature gate, like `UserNamespacesPodSecurityStandards`
or similar.
-->
## 接下来？

展望 Kubernetes 1.29，计划是与 SIG Auth 合作，将用户命名空间集成到 Pod 安全标准（PSS）和 Pod 安全准入中。
目前的计划是在使用用户命名空间时放宽 Pod 安全标准（PSS）策略中的检查。这意味着如果使用用户命名空间，那么字段
`spec[.*].securityContext`、`runAsUser`、`runAsNonRoot`、`allowPrivilegeEscalation和capabilities`
将不会触发违规，此行为可能会通过使用 API Server 特性门控来控制，比如 `UserNamespacesPodSecurityStandards` 或其他类似的。

<!--
## How do I get involved?

You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

You can also contact us directly:
- GitHub: @rata @giuseppe @saschagrunert
- Slack: @rata @giuseppe @sascha
-->
## 我该如何参与？

你可以通过以下方式与 SIG Node 联系：

- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

你还可以直接联系我们：

- GitHub：@rata @giuseppe @saschagrunert
- Slack：@rata @giuseppe @sascha
