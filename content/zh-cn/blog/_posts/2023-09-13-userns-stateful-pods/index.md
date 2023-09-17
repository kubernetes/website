---
layout: blog
title: "用户命名空间：Alpha 版现已支持运行有状态 Pod！"
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
**作者**：Rodrigo Campos Catelin (Microsoft), Giuseppe Scrivano (Red Hat), Sascha Grunert (Red Hat)

**译者**：Wilson Wu (DaoCloud)

<!--
Kubernetes v1.25 introduced support for user namespaces for only stateless pods. Kubernetes 1.28 lifted that restriction, after some design changes were done in 1.27.
-->
Kubernetes v1.25 仅引入了用户命名空间的无状态 Pod 支持。
通过在 1.27 中进行的一些设计更改后，Kubernetes 1.28 取消了该限制。

<!--
The beauty of this feature is that:
-->
这个功能的美妙之处在于：

<!--
 * it is trivial to adopt (you just need to set a bool in the pod spec)
 * doesn't need any changes for **most** applications
 * improves security by _drastically_ enhancing the isolation of containers and mitigating CVEs rated HIGH and CRITICAL.
-->
 * 使用起来很简单（你只需要在 Pod Spec 中设置一个 bool 值即可）
 * 对于**大多数**应用不需要做任何更改
 * 通过**大幅度**增强容器的隔离并减少评级为 HIGH 和 CRITICAL 的 CVE 来提高安全性。

<!--
This post explains the basics of user namespaces and also shows:
-->
本文对用户命名空间的基础知识做出解释，并进行展示：

<!--
 * the changes that arrived in the recent Kubernetes v1.28 release
 * a **demo of a vulnerability rated as HIGH** that is not exploitable with user namespaces
 * the runtime requirements to use this feature
 * what you can expect in future releases regarding user namespaces.
-->
 * 最近的 Kubernetes v1.28 版本中的更改
 * **评级为 HIGH 的漏洞演示**，该漏洞无法通过用户命名空间被利用
 * 使用此功能的运行时要求
 * 你可以在未来版本中期待有关用户命名空间的内容

<!--
## What is a user namespace?
-->
## 什么是用户命名空间？ {#what-is-a-user-namespace}

<!--
A user namespace is a Linux feature that isolates the user and group identifiers (UIDs and GIDs) of the containers from the ones on the host. The indentifiers in the container can be mapped to indentifiers on the host in a way where the host UID/GIDs used for different containers never overlap. Even more, the identifiers can be mapped to *unprivileged* non-overlapping UIDs and GIDs on the host. This basically means two things:
-->
用户命名空间是一项 Linux 功能，它将容器的用户和组标识（UID 和 GID）与主机上的用户和组标识进行隔离。
容器中的标识可以被映射到主机上，其中用于不同容器的主机 UID/GID 不会重叠。
更重要的是，标识可以映射到主机上的**非特权**非重叠 UID 和 GID。这基本上意味着两件事：

<!--
 * As the UIDs and GIDs for different containers are mapped to different UIDs and GIDs on the host, containers have a harder time to attack each other even if they escape the container boundaries. For example, if container A is running with different UIDs and GIDs on the host than container B, the operations it can do on container B's files and process are limited: only read/write what a file allows to others, as it will never have permission for the owner or group (the UIDs/GIDs on the host are guaranteed to be different for different containers).

 * As the UIDs and GIDs are mapped to unprivileged users on the host, if a container escapes the container boundaries, even if it is running as root inside the container, it has no privileges on the host. This greatly protects what host files it can read/write, which process it can send signals to, etc.
-->
 * 由于不同容器的 UID 和 GID 映射到主机上不同的 UID 和 GID，容器即使逃出了容器边界也很难互相攻击。
   例如，如果容器 A 在主机上使用与容器 B 不同的 UID 和 GID 运行，
   则它可以对容器 B 的文件和进程执行的操作受到限制：只能读/写文件允许其他人执行的操作，
   因为它永远不会执行其他操作。所有者或组的权限（主机上的 UID/GID 保证对于不同的容器是不同的）。

 * 由于 UID 和 GID 被映射到主机上的非特权用户，如果容器逃出了容器边界，
   即使它在容器内以root身份运行，它在主机上也没有特权。
   这极大地保护了它可以读/写哪些主机文件、可以向哪个进程发送信号等。

<!--
Furthermore, capabilities granted are only valid inside the user namespace and not on the host.
-->
此外，授予的功能仅在用户命名空间内有效，而在主机上无效。

<!--
Without using a user namespace a container running as root, in the case of a container breakout, has root privileges on the node. And if some capabilities were granted to the container, the capabilities are valid on the host too. None of this is true when using user namespaces (modulo bugs, of course 🙂).
-->
在不使用用户命名空间的情况下，以 root 身份运行的容器在容器突破的情况下具有节点上的 root 权限。
如果某些功能被授予容器，那么这些功能在主机上也有效。使用用户命名空间时，这一切都不是真的（当然，模块的错误🙂）。

<!--
## Changes in 1.28
-->
## 1.28 中的变化 {#changes-in-1-28}

<!--
As already mentioned, starting from 1.28, Kubernetes supports user namespaces with stateful pods. This means that pods with user namespaces can use any type of volume, they are no longer limited to only some volume types as before.
-->
如前所述，从 1.28 开始，Kubernetes 支持具有有状态 Pod 的用户命名空间。
这意味着具有用户命名空间的 Pod 可以使用任何类型的卷，它们不再像以前那样仅限于某些卷类型。

<!--
The feature gate to activate this feature was renamed, it is no longer `UserNamespacesStatelessPodsSupport` but from 1.28 onwards you should use `UserNamespacesSupport`. There were many changes done and the requirements on the node hosts changed. So with Kubernetes 1.28 the feature flag was renamed to reflect this.
-->
激活此功能的特性门控已重命名，不再是 `UserNamespacesStatelessPodsSupport`，
从 1.28 开始，你应该使用 `UserNamespacesSupport`。随着这些大量变更，
以及对节点主机的要求也发生了变化。因此，在 Kubernetes 1.28 中，功能标志被重命名以反映这一点。

<!--
## Demo
-->
## 演示 {#demo}

<!--
Rodrigo created a demo which exploits [CVE 2022-0492][cve-link] and shows how the exploit can occur without user namespaces. He also shows how it is not possible to use this exploit from a Pod where the containers are using this feature.
-->
Rodrigo 创建了一个基于 [CVE 2022-0492][cve-link] 的利用演示，并展示了如何在没有用户命名空间的情况下利用该漏洞。
他还展示了如何无法从正在使用此功能的容器 Pod 中利用该漏洞。

<!--
This vulnerability is rated **HIGH** and allows **a container with no special privileges to read/write to any path on the host** and launch processes as root on the host too.
-->
该漏洞的评级为 **HIGH**，允许**没有特殊权限的容器读取/写入主机上的任何路径**，
并以主机上的 root 身份启动进程。

<!--
{{< youtube id="M4a2b4KkXN8" title="Mitigation of CVE-2022-0492 on Kubernetes by enabling User Namespace support">}}
-->
{{< youtube id="M4a2b4KkXN8" title="通过启用用户命名空间支持缓解 Kubernetes 上的 CVE-2022-0492">}}

<!--
Most applications in containers run as root today, or as a semi-predictable non-root user (user ID 65534 is a somewhat popular choice). When you run a Pod with containers using a userns, Kubernetes runs those containers as unprivileged users, with no changes needed in your app.
-->
如今，容器中的大多数应用都以 root 身份运行，或者以半可预测的非 root 用户身份运行
（用户 ID 65534 是一个比较流行的选择）。当你运行带有用户命名空间容器的 Pod 时，
Kubernetes 以非特权用户身份运行这些容器，无需在你的应用中进行任何更改。

<!--
This means two containers running as user 65534 will effectively be mapped to different users on the host, limiting what they can do to each other in case of an escape, and if they are running as root, the privileges on the host are reduced to the one of an unprivileged user.
-->
这意味着以用户 65534 身份运行的两个容器将有效地映射到主机上的不同用户，
从而限制它们在逃逸时可以对彼此执行的操作，并且如果它们以 root 身份运行，
则主机上的权限将降级到其中一种非特权用户。

[cve-link]: https://unit42.paloaltonetworks.com/cve-2022-0492-cgroups/

<!--
## Node system requirements
-->
## 节点的系统需求 {#node-system-requirements}

<!--
There are requirements on the Linux kernel version as well as the container runtime to use this feature.
-->
要使用此功能，对 Linux 内核版本以及容器运行时有要求。

<!--
On Linux you need Linux 6.3 or greater. This is because the feature relies on a kernel feature named idmap mounts, and support to use idmap mounts with tmpfs was merged in Linux 6.3.
-->
在 Linux 上，你需要 Linux 6.3 或更高版本。这是因为该功能依赖于名为 idmap 挂载的内核功能，
并且在 Linux 6.3 中合并了对 idmap 挂载与 tmpfs 一起使用的支持。

<!--
If you are using CRI-O with crun, this is [supported in CRI-O 1.28.1][CRIO-release] and crun 1.9 or greater. If you are using CRI-O with runc, this is still not supported.
-->
如果你将 CRI-O 与 crun 一起使用，则 [CRI-O 1.28.1 支持][CRIO-release]和
crun 1.9 或更高版本。如果你将 CRI-O 与 runc 一起使用，则仍然不支持。

<!--
containerd support is currently targeted for containerd 2.0; it is likely that it won't matter if you use it with crun or runc.
-->
目前，Containerd 支持的目标版本是 Containerd 2.0；如果你将它与 crun 或 runc 一起使用，可能并不重要。

<!--
Please note that containerd 1.7 added _experimental_ support for user namespaces as implemented in Kubernetes 1.25 and 1.26. The redesign done in 1.27 is not supported by containerd 1.7, therefore it only works, in terms of user namespaces support, with Kubernetes 1.25 and 1.26.
-->
请注意，Containerd 1.7 添加了对用户命名空间的实验性支持，如 Kubernetes 1.25 和 1.26 中实现的那样。
1.27 中完成的重新设计不受 Containerd 1.7 支持，因此就用户命名空间支持而言，它仅适用于 Kubernetes 1.25 和 1.26。

<!--
One limitation present in containerd 1.7 is that it needs to change the ownership of every file and directory inside the container image, during Pod startup. This means it has a storage overhead and can significantly impact the container startup latency. Containerd 2.0 will probably include a implementation that will eliminate the startup latency added and the storage overhead. Take this into account if you plan to use containerd 1.7 with user namespaces in production.
-->
Containerd 1.7 中存在的一个限制是，它需要在 Pod 启动期间更改容器映像内每个文件和目录的所有权。
这意味着它会产生存储开销，并且会显着影响容器启动时长。Containerd 2.0 可能会包含一个消除启动延迟和存储开销的实现。
如果你计划在生产中使用带有用户命名空间的 Containerd 1.7，请考虑这一点。

<!--
None of these containerd limitations apply to [CRI-O 1.28][CRIO-release].
-->
这些 Containerd 限制均不适用于 [CRI-O 1.28][CRIO-release]。

[CRIO-release]: https://github.com/cri-o/cri-o/releases/tag/v1.28.1

<!--
## What’s next?
-->
## 接下来是什么？ {#what-s-next}

<!--
Looking ahead to Kubernetes 1.29, the plan is to work with SIG Auth to integrate user namespaces to Pod Security Standards (PSS) and the Pod Security Admission. For the time being, the plan is to relax checks in PSS policies when user namespaces are in use. This means that the fields `spec[.*].securityContext` `runAsUser`, `runAsNonRoot`, `allowPrivilegeEscalation` and `capabilities` will not trigger a violation if user namespaces are in use. The behavior will probably be controlled by utilizing a API Server feature gate, like `UserNamespacesPodSecurityStandards` or similar.
-->
展望 Kubernetes 1.29，计划将与 SIG Auth 合作，把用户命名空间集成到
Pod Security Standards（PSS）和 Pod Security Admission 中。
目前，计划在使用用户命名空间时放松对 PSS 策略的检查。这意味着如果使用用户命名空间，
字段 `spec[.*].securityContext`、`runAsUser`、`runAsNonRoot`、`allowPrivilegeEscalation` 和 `capabilities`
将不会触发违规。该行为可能会通过使用例如 `UserNamespacesPodSecurityStandards` 或类似的 API 服务器特性门控来控制。

<!--
## How do I get involved?
-->
## 我如何参与？ {#how-do-i-get-involved}

<!--
You can reach SIG Node by several means:
-->
你可以通过多种方式到达 SIG 节点：

<!--
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
-->
- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [开放社区 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)

<!--
You can also contact us directly:
-->
你也可以直接联系我们：

<!--
- GitHub: @rata @giuseppe @saschagrunert
- Slack: @rata @giuseppe @sascha
-->
- GitHub：@rata @giuseppe @saschagrunert
- Slack：@rata @giuseppe @sascha
