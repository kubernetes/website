---
layout: blog
title: "Kubernetes 1.30：对 Pod 使用用户命名空间的支持进阶至 Beta"
date: 2024-04-22
slug: userns-beta
author: >
  Rodrigo Campos Catelin (Microsoft),
  Giuseppe Scrivano (Red Hat),
  Sascha Grunert (Red Hat) 
translator: >
  Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.30: Beta Support For Pods With User Namespaces"
date: 2024-04-22
slug: userns-beta
author: >
  Rodrigo Campos Catelin (Microsoft),
  Giuseppe Scrivano (Red Hat),
  Sascha Grunert (Red Hat)
-->

<!--
Linux provides different namespaces to isolate processes from each other. For
example, a typical Kubernetes pod runs within a network namespace to isolate the
network identity and a PID namespace to isolate the processes.

One Linux namespace that was left behind is the [user
namespace](https://man7.org/linux/man-pages/man7/user_namespaces.7.html). This
namespace allows us to isolate the user and group identifiers (UIDs and GIDs) we
use inside the container from the ones on the host.
-->
Linux 提供了不同的命名空间来将进程彼此隔离。
例如，一个典型的 Kubernetes Pod 运行在一个网络命名空间中可以隔离网络身份，运行在一个 PID 命名空间中可以隔离进程。

Linux 有一个以前一直未被容器化应用所支持的命名空间是[用户命名空间](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)。
这个命名空间允许我们将容器内使用的用户标识符和组标识符（UID 和 GID）与主机上的标识符隔离开来。

<!--
This is a powerful abstraction that allows us to run containers as "root": we
are root inside the container and can do everything root can inside the pod,
but our interactions with the host are limited to what a non-privileged user can
do. This is great for limiting the impact of a container breakout.
-->
这是一个强大的抽象，允许我们以 “root” 身份运行容器：
我们在容器内部有 root 权限，可以在 Pod 内执行所有 root 能做的操作，
但我们与主机的交互仅限于非特权用户可以执行的操作。这对于限制容器逃逸的影响非常有用。

<!--
A container breakout is when a process inside a container can break out
onto the host using some unpatched vulnerability in the container runtime or the
kernel and can access/modify files on the host or other containers. If we
run our pods with user namespaces, the privileges the container has over the
rest of the host are reduced, and the files outside the container it can access
are limited too.
-->
容器逃逸是指容器内的进程利用容器运行时或内核中的某些未打补丁的漏洞逃逸到主机上，
并可以访问/修改主机或其他容器上的文件。如果我们以用户命名空间运行我们的 Pod，
容器对主机其余部分的特权将减少，并且此容器可以访问的容器外的文件也将受到限制。

<!--
In Kubernetes v1.25, we introduced support for user namespaces only for stateless
pods. Kubernetes 1.28 lifted that restriction, and now, with Kubernetes 1.30, we
are moving to beta!
-->
在 Kubernetes v1.25 中，我们仅为无状态 Pod 引入了对用户命名空间的支持。
Kubernetes 1.28 取消了这一限制，目前在 Kubernetes 1.30 中，这个特性进阶到了 Beta！

<!--
## What is a user namespace?

Note: Linux user namespaces are a different concept from [Kubernetes
namespaces](/docs/concepts/overview/working-with-objects/namespaces/).
The former is a Linux kernel feature; the latter is a Kubernetes feature.
-->
## 什么是用户命名空间？   {#what-is-a-user-namespace}

注意：Linux 用户命名空间与
[Kubernetes 命名空间](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)是不同的概念。
前者是一个 Linux 内核特性；后者是一个 Kubernetes 特性。

<!--
User namespaces are a Linux feature that isolates the UIDs and GIDs of the
containers from the ones on the host. The identifiers in the container can be
mapped to identifiers on the host in a way where the host UID/GIDs used for
different containers never overlap. Furthermore, the identifiers can be mapped
to unprivileged, non-overlapping UIDs and GIDs on the host. This brings two key
benefits:
-->
用户命名空间是一个 Linux 特性，它将容器的 UID 和 GID 与主机上的隔离开来。
容器中的标识符可以被映射为主机上的标识符，并且保证不同容器所使用的主机 UID/GID 不会重叠。
此外，这些标识符可以被映射到主机上没有特权的、非重叠的 UID 和 GID。这带来了两个关键好处：

<!--
* _Prevention of lateral movement_: As the UIDs and GIDs for different
containers are mapped to different UIDs and GIDs on the host, containers have a
harder time attacking each other, even if they escape the container boundaries.
For example, suppose container A runs with different UIDs and GIDs on the host
than container B. In that case, the operations it can do on container B's files and processes
are limited: only read/write what a file allows to others, as it will never
have permission owner or group permission (the UIDs/GIDs on the host are
guaranteed to be different for different containers).
-->
* __防止横向移动__：由于不同容器的 UID 和 GID 被映射到主机上的不同 UID 和 GID，
  即使这些标识符逃出了容器的边界，容器之间也很难互相攻击。
  例如，假设容器 A 在主机上使用的 UID 和 GID 与容器 B 不同。
  在这种情况下，它对容器 B 的文件和进程的操作是有限的：只能读取/写入某文件所允许的操作，
  因为它永远不会拥有文件所有者或组权限（主机上的 UID/GID 保证对不同容器是不同的）。

<!--
* _Increased host isolation_: As the UIDs and GIDs are mapped to unprivileged
users on the host, if a container escapes the container boundaries, even if it
runs as root inside the container, it has no privileges on the host. This
greatly protects what host files it can read/write, which process it can send
signals to, etc. Furthermore, capabilities granted are only valid inside the
user namespace and not on the host, limiting the impact a container
escape can have.
-->
* __增加主机隔离__：由于 UID 和 GID 被映射到主机上的非特权用户，如果某容器逃出了它的边界，
  即使它在容器内部以 root 身份运行，它在主机上也没有特权。
  这大大保护了它可以读取/写入的主机文件，它可以向哪个进程发送信号等。
  此外，所授予的权能仅在用户命名空间内有效，而在主机上无效，这就限制了容器逃逸的影响。

<!--
{{< figure src="/images/blog/2024-04-22-userns-beta/userns-ids.png" alt="Image showing IDs 0-65535 are reserved to the host, pods use higher IDs" title="User namespace IDs allocation" >}}
-->
{{< figure src="/images/blog/2024-04-22-userns-beta/userns-ids.png" alt="此图显示了 ID 0-65535 为主机预留，Pod 使用更大的 ID" title="用户命名空间 ID 分配" >}}

<!--
Without using a user namespace, a container running as root in the case of a
container breakout has root privileges on the node. If some capabilities
were granted to the container, the capabilities are valid on the host too. None
of this is true when using user namespaces (modulo bugs, of course 🙂).
-->
如果不使用用户命名空间，容器逃逸时以 root 运行的容器在节点上将具有 root 特权。
如果某些权能授权给了此容器，这些权能在主机上也会有效。
如果使用用户命名空间，就不会是这种情况（当然，除非有漏洞 🙂）。

<!--
## Changes in 1.30

In Kubernetes 1.30, besides moving user namespaces to beta, the contributors
working on this feature:
-->
## 1.30 的变化   {#changes-in-1.30}

在 Kubernetes 1.30 中，除了将用户命名空间进阶至 Beta，参与此特性的贡献者们还：

<!--
* Introduced a way for the kubelet to use custom ranges for the UIDs/GIDs mapping 
 * Have added a way for Kubernetes to enforce that the runtime supports all the features
   needed for user namespaces. If they are not supported, Kubernetes will show a
   clear error when trying to create a pod with user namespaces. Before 1.30, if
   the container runtime didn't support user namespaces, the pod could be created
   without a user namespace.
 * Added more tests, including [tests in the
   cri-tools](https://github.com/kubernetes-sigs/cri-tools/pull/1354)
   repository.
-->
* 为 kubelet 引入了一种使用自定义范围进行 UID/GID 映射的方式
* 为 Kubernetes 添加了一种强制执行的方式让运行时支持用户命名空间所需的所有特性。
  如果不支持这些特性，Kubernetes 在尝试创建具有用户命名空间的 Pod 时，会显示一个明确的错误。
  在 1.30 之前，如果容器运行时不支持用户命名空间，Pod 可能会在没有用户命名空间的情况下被创建。
* 新增了更多的测试，包括在 [cri-tools](https://github.com/kubernetes-sigs/cri-tools/pull/1354) 仓库中的测试。

<!--
You can check the
[documentation](/docs/concepts/workloads/pods/user-namespaces/#set-up-a-node-to-support-user-namespaces)
on user namespaces for how to configure custom ranges for the mapping.
-->
你可以查阅有关用户命名空间的[文档](/zh-cn/docs/concepts/workloads/pods/user-namespaces/#set-up-a-node-to-support-user-namespaces)，
了解如何配置映射的自定义范围。

<!--
## Demo

A few months ago, [CVE-2024-21626][runc-cve] was disclosed. This **vulnerability
score is 8.6 (HIGH)**. It allows an attacker to escape a container and
**read/write to any path on the node and other pods hosted on the same node**.

Rodrigo created a demo that exploits [CVE 2024-21626][runc-cve] and shows how
the exploit, which works without user namespaces, **is mitigated when user
namespaces are in use.**
-->
## 演示   {#demo}

几个月前，[CVE-2024-21626][runc-cve] 被披露。
这个 **漏洞评分为 8.6（高）**。它允许攻击者让容器逃逸，并**读取/写入节点上的任何路径以及同一节点上托管的其他 Pod**。

Rodrigo 创建了一个滥用 [CVE 2024-21626][runc-cve] 的演示，
演示了此漏洞在没有用户命名空间时的工作方式，而在使用用户命名空间后 **得到了缓解**。

<!--
{{< youtube id="07y5bl5UDdA" title="Mitigation of CVE-2024-21626 on Kubernetes by enabling User Namespace support" class="youtube-quote-sm" >}}
-->
{{< youtube id="07y5bl5UDdA" title="通过启用用户命名空间支持来在 Kubernetes 上缓解 CVE-2024-21626" class="youtube-quote-sm" >}}

<!--
Please note that with user namespaces, an attacker can do on the host file system
what the permission bits for "others" allow. Therefore, the CVE is not
completely prevented, but the impact is greatly reduced.
-->
请注意，使用用户命名空间时，攻击者可以在主机文件系统上执行“其他”权限位所允许的操作。
因此，此 CVE 并没有完全被修复，但影响大大降低。

[runc-cve]: https://github.com/opencontainers/runc/security/advisories/GHSA-xr7r-f8xq-vfvv

<!--
## Node system requirements

There are requirements on the Linux kernel version and the container
runtime to use this feature.

On Linux you need Linux 6.3 or greater. This is because the feature relies on a
kernel feature named idmap mounts, and support for using idmap mounts with tmpfs
was merged in Linux 6.3.
-->
## 节点系统要求   {#node-system-requirements}

使用此特性对 Linux 内核版本和容器运行时有一些要求。

在 Linux 上，你需要 Linux 6.3 或更高版本。
这是因为此特性依赖于一个名为 idmap 挂载的内核特性，而支持 idmap 挂载与 tmpfs 一起使用的特性是在 Linux 6.3 中合并的。

<!--
Suppose you are using [CRI-O][crio] with crun; as always, you can expect support for
Kubernetes 1.30 with CRI-O 1.30. Please note you also need [crun][crun] 1.9 or
greater. If you are using CRI-O with [runc][runc], this is still not supported.

Containerd support is currently targeted for [containerd][containerd] 2.0, and
the same crun version requirements apply. If you are using containerd with runc,
this is still not supported.
-->
假设你使用 [CRI-O][crio] 和 crun；就像往常一样，你可以期待 CRI-O 1.30 支持 Kubernetes 1.30。
请注意，你还需要 [crun][crun] 1.9 或更高版本。如果你使用的是 CRI-O 和 [runc][runc]，则仍然不支持用户命名空间。

containerd 对此特性的支持目前锁定为 [containerd][containerd] 2.0，同样 crun 也有适用的版本要求。
如果你使用的是 containerd 和 runc，则仍然不支持用户命名空间。

<!--
Please note that containerd 1.7 added _experimental_ support for user
namespaces, as implemented in Kubernetes 1.25 and 1.26. We did a redesign in
Kubernetes 1.27, which requires changes in the container runtime. Those changes
are not present in containerd 1.7, so it only works with user namespaces
support in Kubernetes 1.25 and 1.26.
-->
请注意，正如在 Kubernetes 1.25 和 1.26 中实现的那样，containerd 1.7 增加了对用户命名空间的**实验性**支持。
我们曾在 Kubernetes 1.27 中进行了重新设计，所以容器运行时需要做一些变更。
而 containerd 1.7 并未包含这些变更，所以它仅在 Kubernetes 1.25 和 1.26 中支持使用用户命名空间。

<!--
Another limitation of containerd 1.7 is that it needs to change the
ownership of every file and directory inside the container image during Pod
startup. This has a storage overhead and can significantly impact the
container startup latency. Containerd 2.0 will probably include an implementation
that will eliminate the added startup latency and storage overhead. Consider
this if you plan to use containerd 1.7 with user namespaces in
production.

None of these containerd 1.7 limitations apply to CRI-O.
-->
containerd 1.7 的另一个限制是，它需要在 Pod 启动期间变更容器镜像内的每个文件和目录的所有权。
这会增加存储开销，并可能显著影响容器启动延迟。containerd 2.0 可能会包含一个实现，以消除增加的启动延迟和存储开销。
如果你计划在生产环境中使用 containerd 1.7 和用户命名空间，请考虑这一点。

containerd 1.7 的这些限制均不适用于 CRI-O。

[crio]: https://cri-o.io/
[crun]: https://github.com/containers/crun
[runc]: https://github.com/opencontainers/runc/
[containerd]: https://containerd.io/

<!--
## How do I get involved?

You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
-->
## 如何参与？   {#how-do-i-get-involved}

你可以通过以下方式联系 SIG Node：

- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [提交社区 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)

<!--
You can also contact us directly:
- GitHub: @rata @giuseppe @saschagrunert
- Slack: @rata @giuseppe @sascha
-->
你也可以通过以下方式直接联系我们：

- GitHub：@rata @giuseppe @saschagrunert
- Slack：@rata @giuseppe @sascha
