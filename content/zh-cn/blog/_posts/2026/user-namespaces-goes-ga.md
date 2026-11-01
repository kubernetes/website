---
layout: blog
title: "Kubernetes v1.36：用户命名空间终于正式可用"
date: 2026-04-23T10:35:00-08:00
slug: userns-ga
author: >
  Rodrigo Campos Catelin (Amutable),
  Giuseppe Scrivano (Red Hat)
translator: >
  [Paco Xu](https://github.com/pacoxu) (DaoCloud)
---
<!--
layout: blog
title: "User Namespaces in Kubernetes: Finally GA"
date: 2026-04-23T10:35:00-08:00
slug: userns-ga
author: >
  Rodrigo Campos Catelin (Amutable),
  Giuseppe Scrivano (Red Hat)
-->

<!--
After several years of development, User Namespaces support in
Kubernetes reached General Availability (GA) with the v1.36 release.
This is a Linux-only feature.
-->
经过数年的开发，Kubernetes 中的用户命名空间（User Namespaces）支持已随着 v1.36 发布进入正式发布（GA）阶段。
这是一个仅适用于 Linux 的特性。

<!--
For those of us working on low level container runtimes and rootless
technologies, this has been a long awaited milestone. We finally
reached the point where "rootless" security isolation can be used for
Kubernetes workloads.
-->
对于从事底层容器运行时（Container Runtimes）和 rootless 技术的我们来说，
这是一个期待已久的里程碑。
我们终于走到了可以将 **rootless** 安全隔离用于 Kubernetes 工作负载的阶段。

<!--
This feature also enables a critical pattern: running workloads with
privileges and still being confined in the user namespace.  When
`hostUsers: false` is set, capabilities like `CAP_NET_ADMIN` become
**namespaced**, meaning they grant administrative power over container
local resources without affecting the host.  This effectively enables
new use cases that were not possible before without running a fully
privileged container.
-->
这一特性还开启了一种关键模式：让工作负载在拥有特权的同时，依然被限制在用户命名空间内。
当设置 `hostUsers: false` 时，`CAP_NET_ADMIN` 这类权能（capabilities）会变成 __被命名空间化（namespaced）__ 的权能，
这意味着它们只会授予容器本地资源的管理能力，而不会影响主机。
这实际上开启了此前只有运行完全特权容器（fully privileged container）才能实现的新用例。

<!--
## The Problem with UID 0
-->
## UID 0 的问题 {#the-problem-with-uid-0}

<!--
A process running as root inside a container is also seen from the
kernel as root on the host.  If an attacker manages to break out of
the container, whether through a kernel vulnerability or a
misconfigured mount, they are root on the host.
-->
在容器内以 `root` 身份运行的进程，从内核视角看，在主机上同样是 `root`。
如果攻击者成功逃逸出容器，无论是利用内核漏洞，还是借助配置错误的挂载（misconfigured mount），
他们都会在主机上获得 `root` 权限。

<!--
While there are many security measures in place for running
containers, these measures don't change the underlying identity of the
process, it still has some "parts" of root.
-->
虽然运行容器时已经有许多安全防护措施，但这些措施并不会改变进程的底层身份，
它依然保留着 `root` 的某些“部分能力”。

<!--
## The engine: ID-mapped mounts
-->
## 核心机制：ID-mapped mounts {#the-engine-id-mapped-mounts}

<!--
The road to GA wasn't just about the Kubernetes API; it was about
making the kernel work for us.  In the early stages, one of the
biggest blockers was volume ownership.  If you mapped a container to a
high UID range, the Kubelet had to recursively `chown` every file in
the attached volume so the container could read/write them.  For large
volumes, this was such an expensive operation that destroyed startup
performance.
-->
通往 GA 的道路并不只是 Kubernetes API 的演进，更关键的是让内核真正为我们所用。
在早期阶段，最大的阻碍之一是卷的所有权问题。
如果你把容器映射到较高的 UID 范围，Kubelet 就必须递归地对挂载卷中的每个文件执行 `chown`，
这样容器才能对这些文件进行读写。
对于大型卷来说，这一操作的成本高得惊人，足以摧毁启动性能。

<!--
The key enabler was *ID-mapped mounts* (introduced in Linux
5.12 and refined in later versions). Instead of rewriting file
ownership on disk, the kernel remaps it at mount time.
-->
实现这一目标的关键，是 __ID-mapped mounts__（在 Linux 5.12 中引入，并在后续版本中持续完善）。
借助这一机制，内核可以在挂载时重映射文件所有权，而不必改写磁盘上的实际所有权信息。

<!--
When a volume is mounted into a Pod with User Namespaces enabled, the
kernel performs a transparent translation of the UIDs (user ids) and
GIDs (group ids). To the container, the files appear owned by
UID 0. On disk, file ownership is unchanged — no `chown` is needed.
This is an `O(1)` operation, instant and efficient.
-->
当一个卷被挂载到启用了用户命名空间的 Pod 中时，内核会透明地转换 UID（user ids）和 GID（group ids）。
对容器来说，这些文件看起来像是由 UID 0 拥有。
而在磁盘上，文件所有权完全不会变化，因此不需要执行 `chown`。
这是一个 `O(1)` 操作，既即时又高效。

<!--
## Using it in Kubernetes v1.36
-->
## 在 Kubernetes v1.36 中使用它 {#using-it-in-kubernetes-v136}

<!--
Using user namespaces is straightforward: all you need to do is set
`hostUsers: false` in your Pod spec. No changes to your container
images, no complex configuration. The interface remains the same one
introduced during the Alpha phase. In the `spec` for a Pod (or PodTemplate), you explicitly
opt-out of the host user namespace:
-->
使用用户命名空间非常直接：你只需要在 Pod spec 中设置 `hostUsers: false`。
无需修改容器镜像，也不需要复杂配置。
它仍然使用 Alpha 阶段引入的同一套接口。
在 Pod（或 PodTemplate）的 `spec` 中，你可以显式选择不使用主机用户命名空间：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: isolated-workload
spec:
  hostUsers: false
  containers:
  - name: app
    image: fedora:42
    securityContext:
      runAsUser: 0
```

<!--
For more details on how user namespaces work in practice and demos of
CVEs rated HIGH mitigated, see the previous blog posts:
[User Namespaces alpha](/blog/2022/10/03/userns-alpha/),
[User Namespaces stateful pods in alpha](/blog/2023/09/13/userns-alpha/),
[User Namespaces beta](/blog/2024/04/22/userns-beta/), and
[User Namespaces enabled by default](/blog/2025/04/25/userns-enabled-by-default/).
-->
如果你想进一步了解用户命名空间在实践中的工作方式，以及它如何缓解被评为 __HIGH__ 的 CVE，
请参阅此前的博客文章：
[User Namespaces alpha](/zh-cn/blog/2022/10/03/userns-alpha/)、
[User Namespaces stateful pods in alpha](/zh-cn/blog/2023/09/13/userns-alpha/)、
[User Namespaces beta](/zh-cn/blog/2024/04/22/userns-beta/)，以及
[User Namespaces enabled by default](/blog/2025/04/25/userns-enabled-by-default/)。

<!--
## Getting involved
-->
## 参与其中 {#getting-involved}

<!--
If you're interested in user namespaces or want to contribute, here
are some useful links:
-->
如果你对用户命名空间感兴趣，或希望参与贡献，这里有一些有用的链接：

<!--
- [User Namespaces documentation](/docs/concepts/workloads/pods/user-namespaces/)
- [KEP-127: Support User Namespaces](https://kep.k8s.io/127)
- [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)
-->
- [User Namespaces 文档](/zh-cn/docs/concepts/workloads/pods/user-namespaces/)
- [KEP-127: Support User Namespaces](https://kep.k8s.io/127)
- [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)

<!--
## Acknowledgments
-->
## 致谢 {#acknowledgments}

<!--
This feature has been years in the making: the first KEP was opened
10 years ago by other contributors, and we have been actively working
on it for the last 6 years. We'd like to thank everyone who
contributed across SIG Node, the container runtimes, and the Linux
kernel. Special thanks to the reviewers and early adopters who helped
shape the design through multiple alpha and beta cycles.
-->
这一特性历经多年才走到今天：第一份 KEP 在 10 年前由其他贡献者提出，
而我们在过去 6 年里一直积极推动它向前发展。
我们感谢所有在 SIG Node、容器运行时以及 Linux 内核领域参与贡献的人。
同时，也特别感谢那些在多个 Alpha 和 Beta 周期中帮助打磨设计的评审者与早期采用者。
