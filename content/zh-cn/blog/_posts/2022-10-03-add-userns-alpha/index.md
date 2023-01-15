---
layout: blog
title: “Kubernetes 1.25：对使用用户名字空间运行 Pod 提供 Alpha 支持”
date: 2022-10-03
slug: userns-alpha
---
<!--
layout: blog
title: "Kubernetes 1.25: alpha support for running Pods with user namespaces"
date: 2022-10-03
slug: userns-alpha
-->

<!--
**Authors:** Rodrigo Campos (Microsoft), Giuseppe Scrivano (Red Hat)
-->
**作者:** Rodrigo Campos（Microsoft）、Giuseppe Scrivano（Red Hat）

<!--
Kubernetes v1.25 introduces the support for user namespaces.
-->
Kubernetes v1.25 引入了对用户名字空间的支持。

<!--
This is a major improvement for running secure workloads in
Kubernetes.  Each pod will have access only to a limited subset of the
available UIDs and GIDs on the system, thus adding a new security
layer to protect from other pods running on the same system.
-->
这是在 Kubernetes 中运行安全工作负载的一项重大改进。
每个 Pod 只能访问系统上可用 UID 和 GID 的有限子集，
因此添加了一个新的安全层来保护 Pod 免受运行在同一系统上的其他 Pod 的影响。

<!--
## How does it work?
A process running on Linux can use up to 4294967296 different UIDs and
GIDs.

User namespaces is a Linux feature that allows mapping a set of users
in the container to different users in the host, thus restricting what
IDs a process can effectively use.
Furthermore, the capabilities granted in a new user namespace do not
apply in the host initial namespaces.
-->
## 它是如何工作的？  {#how-does-it-work}
在 Linux 上运行的进程最多可以使用 4294967296 个不同的 UID 和 GID。

用户名字空间是 Linux 的一项特性，它允许将容器中的一组用户映射到主机中的不同用户，
从而限制进程可以实际使用的 ID。
此外，在新用户名字空间中授予的权能不适用于主机初始名字空间。

<!--
## Why is it important?
There are mainly two reasons why user namespaces are important:

- improve security since they restrict the IDs a pod can use, so each
pod can run in its own separate environment with unique IDs.

- enable running workloads as root in a safer manner.

In a user namespace we can map the root user inside the pod to a
non-zero ID outside the container, containers believe in running as
root while they are a regular unprivileged ID from the host point of
view.

The process can keep capabilities that are usually restricted to
privileged pods and do it in a safe way since the capabilities granted
in a new user namespace do not apply in the host initial namespaces.
-->
## 它为什么如此重要？  {#why-is-it-important}
用户名字空间之所以重要，主要有两个原因：

- 提高安全性。因为它们限制了 Pod 可以使用的 ID，
  因此每个 Pod 都可以在其自己的具有唯一 ID 的单独环境中运行。

- 以更安全的方式使用 root 身份运行工作负载。

在用户名字空间中，我们可以将 Pod 内的 root 用户映射到容器外的非零 ID，
容器将认为是 root 身份在运行，而从主机的角度来看，它们是常规的非特权 ID。

该进程可以保留通常仅限于特权 Pod 的功能，并以安全的方式执行这类操作，
因为在新用户名字空间中授予的功能不适用于主机初始名字空间。

<!--
## How do I enable user namespaces?
At the moment, user namespaces support is opt-in, so you must enable
it for a pod setting `hostUsers` to `false` under the pod spec stanza:
-->
## 如何启用用户名字空间 {#how-do-i-enable-user-namespaces}
目前，对用户名字空间的支持是可选的，因此你必须在 Pod 规约部分将
`hostUsers` 设置为 `false` 以启用用户名字空间：
```
apiVersion: v1
kind: Pod
spec:
  hostUsers: false
  containers:
  - name: nginx
    image: docker.io/nginx
```

<!--
The feature is behind a feature gate, so make sure to enable
the `UserNamespacesStatelessPodsSupport` gate before you can use
the new feature.
-->
该特性目前还处于 Alpha 阶段，默认是禁用的，因此在使用此新特性之前，
请确保启用了 `UserNamespacesStatelessPodsSupport` 特性门控。

<!--
The runtime must also support user namespaces:

* containerd: support is planned for the 1.7 release.  See containerd
  issue [#7063][containerd-userns-issue] for more details.

* CRI-O: v1.25 has support for user namespaces.

Support for this in `cri-dockerd` is [not planned][CRI-dockerd-issue] yet.
-->
此外，运行时也必须支持用户名字空间：

* Containerd：计划在 1.7 版本中提供支持。
  进一步了解，请参阅 Containerd issue [#7063][containerd-userns-issue]。

* CRI-O：v1.25 支持用户名字空间。

`cri-dockerd` 对用户名字空间的支持[尚无计划][CRI-dockerd-issue]。

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74
[containerd-userns-issue]: https://github.com/containerd/containerd/issues/7063

<!--
## How do I get involved?
You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

You can also contact us directly:
- GitHub / Slack: @rata @giuseppe
-->
## 我如何参与？   {#how-do-i-get-involved}
你可以通过多种方式联系 SIG Node：
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)

- [开源社区 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)

你也可以直接联系我们：
- GitHub / Slack: @rata @giuseppe

- [开源社区 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)
