---
layout: blog
title: “Kubernetes 1.25：對使用使用者名字空間運行 Pod 提供 Alpha 支持”
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
Kubernetes v1.25 引入了對使用者名字空間的支持。

<!--
This is a major improvement for running secure workloads in
Kubernetes.  Each pod will have access only to a limited subset of the
available UIDs and GIDs on the system, thus adding a new security
layer to protect from other pods running on the same system.
-->
這是在 Kubernetes 中運行安全工作負載的一項重大改進。
每個 Pod 只能訪問系統上可用 UID 和 GID 的有限子集，
因此添加了一個新的安全層來保護 Pod 免受運行在同一系統上的其他 Pod 的影響。

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
在 Linux 上運行的進程最多可以使用 4294967296 個不同的 UID 和 GID。

使用者名字空間是 Linux 的一項特性，它允許將容器中的一組使用者映射到主機中的不同使用者，
從而限制進程可以實際使用的 ID。
此外，在新使用者名字空間中授予的權能不適用於主機初始名字空間。

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
## 它爲什麼如此重要？  {#why-is-it-important}
使用者名字空間之所以重要，主要有兩個原因：

- 提高安全性。因爲它們限制了 Pod 可以使用的 ID，
  因此每個 Pod 都可以在其自己的具有唯一 ID 的單獨環境中運行。

- 以更安全的方式使用 root 身份運行工作負載。

在使用者名字空間中，我們可以將 Pod 內的 root 使用者映射到容器外的非零 ID，
容器將認爲是 root 身份在運行，而從主機的角度來看，它們是常規的非特權 ID。

該進程可以保留通常僅限於特權 Pod 的功能，並以安全的方式執行這類操作，
因爲在新使用者名字空間中授予的功能不適用於主機初始名字空間。

<!--
## How do I enable user namespaces?
At the moment, user namespaces support is opt-in, so you must enable
it for a pod setting `hostUsers` to `false` under the pod spec stanza:
-->
## 如何啓用使用者名字空間 {#how-do-i-enable-user-namespaces}
目前，對使用者名字空間的支持是可選的，因此你必須在 Pod 規約部分將
`hostUsers` 設置爲 `false` 以啓用使用者名字空間：
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
該特性目前還處於 Alpha 階段，預設是禁用的，因此在使用此新特性之前，
請確保啓用了 `UserNamespacesStatelessPodsSupport` 特性門控。

<!--
The runtime must also support user namespaces:

* containerd: support is planned for the 1.7 release.  See containerd
  issue [#7063][containerd-userns-issue] for more details.

* CRI-O: v1.25 has support for user namespaces.

Support for this in `cri-dockerd` is [not planned][CRI-dockerd-issue] yet.
-->
此外，運行時也必須支持使用者名字空間：

* Containerd：計劃在 1.7 版本中提供支持。
  進一步瞭解，請參閱 Containerd issue [#7063][containerd-userns-issue]。

* CRI-O：v1.25 支持使用者名字空間。

`cri-dockerd` 對使用者名字空間的支持[尚無計劃][CRI-dockerd-issue]。

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
## 我如何參與？   {#how-do-i-get-involved}
你可以通過多種方式聯繫 SIG Node：
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)

- [開源社區 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)

你也可以直接聯繫我們：
- GitHub / Slack: @rata @giuseppe

- [開源社區 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)
