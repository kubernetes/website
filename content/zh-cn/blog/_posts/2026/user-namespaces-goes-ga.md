---
layout: blog
title: "Kubernetes 中的用户命名空间：终于达到正式可用（GA）"
date: 2026-04-22
slug: userns-ga
draft: true
author: >
  Rodrigo Campos Catelin (Amutable),
  Giuseppe Scrivano (Red Hat)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: "User Namespaces in Kubernetes: Finally GA"
date: 2026-04-22
slug: userns-ga
draft: true
author: >
  Rodrigo Campos Catelin (Amutable),
  Giuseppe Scrivano (Red Hat)
-->

<!--
After several years of development, User Namespaces support in
Kubernetes reached General Availability (GA) with the v1.36 release.
This is a Linux-only feature.

For those of us working on low level container runtimes and rootless
technologies, this has been a long awaited milestone. We finally
reached point where "rootless" security isolation can be used for
Kubernetes workloads.
-->
经过多年的研发，Kubernetes 中的用户命名空间支持在 v1.36 版本中达到了正式可用（GA）。
这是一个仅适用于 Linux 的特性。

对于我们这些从事底层容器运行时和无根技术的人来说，这是一个期待已久的里程碑。
我们终于达到了可以将 "rootless" 安全隔离用于 Kubernetes 工作负载的节点。

<!--
This feature also enables a critical pattern: running workloads with
privileges and still being confined in user namespace.  When
`hostUsers: false` is set, capabilities like `CAP_NET_ADMIN` become
**namespaced**, meaning they grant administrative power over container
local resources without affecting host.  This effectively enables
new use cases that were not possible before without running a fully
privileged container.
-->
此特性还启用了一个关键模式：在用户命名空间中以特权运行工作负载，同时仍然受到限制。
当设置 `hostUsers: false` 时，像 `CAP_NET_ADMIN` 这样的能力变为**命名空间化的**，
这意味着它们授予对容器本地资源的管理权限，而不会影响主机。
这有效地实现了以前不运行完全特权容器就无法实现的新用例。

<!--
## The Problem with UID 0

A process running as root inside a container is also seen from the
kernel as root on host.  If an attacker manages to break out of
the container, whether through a kernel vulnerability or a
misconfigured mount, they are root on host.

While there are many security measures in place for running
containers, these measures don't change underlying identity of the
process, it still has some "parts" of root.
-->
## UID 0 的问题   {#the-problem-with-uid-0}

在容器内以 root 身份运行的进程在内核看来也是主机上的 root。
如果攻击者设法突破容器，无论是通过内核漏洞还是错误配置的挂载，
他们就是主机上的 root。

虽然运行容器有许多安全措施，但这些措施不会改变进程的底层身份，
它仍然具有 root 的一些"部分"。

<!--
## The engine: ID-mapped mounts

The road to GA wasn't just about the Kubernetes API; it was about
making the kernel work for us.  In the early stages, one of the
biggest blockers was volume ownership.  If you mapped a container to a
high UID range, the Kubelet had to recursively `chown` every file in
the attached volume so the container could read/write them.  For large
volumes, this was such an expensive operation that destroyed startup
performance.
-->
## 引擎：ID 映射挂载 {#the-engine-id-mapped-mounts}

通往 GA 的道路不仅仅是关于 Kubernetes API；它是关于让内核为我们工作。
在早期阶段，最大的障碍之一是卷所有权。如果你将容器映射到高 UID 范围，
kubelet 必须递归地对附加卷中的每个文件执行 `chown` 操作，以便容器可以读取/写入它们。
对于大卷，这是一个十分昂贵的操作，会影响启动性能。

<!--
The key enabler was *ID-mapped mounts* (introduced in Linux
5.12 and refined in later versions). Instead of rewriting file
ownership on disk, the kernel remaps it at mount time.

When a volume is mounted into a Pod with User Namespaces enabled, the
kernel performs a transparent translation of the UIDs (user ids) and
GIDs (group ids). To the container, the files appear owned by
UID 0. On disk, file ownership is unchanged — no `chown` is needed.
This is an `O(1)` operation, instant and efficient.
-->
关键推动因素是 **ID 映射挂载**（在 Linux 5.12 中引入，并在后续版本中改进）。
内核在挂载时重新映射文件所有权，而不是在磁盘上重写文件所有权。

当卷挂载到启用了用户命名空间的 Pod 中时，内核对 UID（用户 ID）和 GID（组 ID）
执行透明转换。对于容器来说，文件看起来是由 UID 0 拥有的。
在磁盘上，文件所有权保持不变——不需要 `chown`。
这是一个 `O(1)` 操作，即时且高效。

<!--
## Using it in Kubernetes v1.36

Using user namespaces is straightforward: all you need to do is set
`hostUsers: false` in your Pod spec. No changes to your container
images, no complex configuration. The interface remains the same one
introduced during the Alpha phase. In `spec` for a Pod (or PodTemplate), you explicitly
opt-out of the host user namespace:
-->
## 在 Kubernetes v1.36 中使用 {#using-it-in-kubernetes-v1-36}

使用用户命名空间很简单：你只需要在 Pod 规约中设置 `hostUsers: false`。
不需要更改容器镜像，不需要复杂的配置。
接口保持与 Alpha 阶段引入的相同。
在 Pod（或 PodTemplate）的 `spec` 中，你明确选择退出主机用户命名空间：

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
有关用户命名空间在实际中如何工作的更多详细信息以及被评为 HIGH 的 CVE 缓解演示，
请参阅之前的博客文章：
[用户命名空间 Alpha](/blog/2022/10/03/userns-alpha/)、
[用户命名空间有状态 Pod 在 Alpha 中](/blog/2023/09/13/userns-alpha/)、
[用户命名空间 Beta](/blog/2024/04/22/userns-beta/) 和
[默认启用用户命名空间](/blog/2025/04/25/userns-enabled-by-default/)。

<!--
## Getting involved

If you're interested in user namespaces or want to contribute, here
are some useful links:
-->
## 参与其中 {#getting-involved}

如果你对用户命名空间感兴趣或想要做出贡献，这里有一些有用的链接：

- [用户命名空间文档](/zh-cn/docs/concepts/workloads/pods/user-namespaces/)
- [KEP-127：支持用户命名空间](https://kep.k8s.io/127)
- [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)

<!--
## Acknowledgments

This feature has been years in the making: the first KEP was opened
10 years ago by other贡献者, and we have been actively working
on it for the last 6 years. We'd like to thank everyone who
contributed across SIG Node, the container runtimes, and the Linux
kernel. Special thanks to the reviewers and early adopters who helped
shape the design through multiple alpha and beta cycles.
-->
## 致谢 {#acknowledgments}

这个特性已经酝酿多年：第一个 KEP 是 10 年前由其他贡献者提出的，
我们在过去 6 年中一直在积极开发它。
我们要感谢在 SIG Node、容器运行时和 Linux 内核方面做出贡献的每个人。
特别感谢审阅者和早期采用者，他们在多个 Alpha 和 Beta 周期中帮助塑造了设计。
