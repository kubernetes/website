---
layout: blog
title: "使用者命名空間：對運行有狀態 Pod 的支持進入 Alpha 階段!"
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

**譯者：** Xin Li (DaoCloud)

<!--
Kubernetes v1.25 introduced support for user namespaces for only stateless
pods. Kubernetes 1.28 lifted that restriction, after some design changes were
done in 1.27.
-->
Kubernetes v1.25 引入使用者命名空間（User Namespace）特性，僅支持無狀態（Stateless）Pod。
Kubernetes 1.28 在 1.27 的基礎上中進行了一些改進後，取消了這一限制。

<!--
The beauty of this feature is that:
 * it is trivial to adopt (you just need to set a bool in the pod spec)
 * doesn't need any changes for **most** applications
 * improves security by _drastically_ enhancing the isolation of containers and
   mitigating CVEs rated HIGH and CRITICAL.
-->
此特性的精妙之處在於：

 * 使用起來很簡單（只需在 Pod 規約（spec）中設置一個 bool）
 * **大多數**應用程式不需要任何更改
 * 通過**大幅度**加強容器的隔離性以及應對評級爲高（HIGH）和關鍵（CRITICAL）的 CVE 來提高安全性。

<!--
This post explains the basics of user namespaces and also shows:
 * the changes that arrived in the recent Kubernetes v1.28 release
 * a **demo of a vulnerability rated as HIGH** that is not exploitable with user namespaces
 * the runtime requirements to use this feature
 * what you can expect in future releases regarding user namespaces.
-->
這篇文章介紹了使用者命名空間的基礎知識，並展示了：

* 最近的 Kubernetes v1.28 版本中出現的變化
* 一個評級爲**高（HIGH）的漏洞的演示（Demo）**，該漏洞無法在使用者命名空間中被利用
* 使用此特性的運行時要求
* 關於使用者命名空間的未來版本中可以期待的內容

<!--
## What is a user namespace?

A user namespace is a Linux feature that isolates the user and group identifiers
(UIDs and GIDs) of the containers from the ones on the host. The indentifiers
in the container can be mapped to indentifiers on the host in a way where the
host UID/GIDs used for different containers never overlap. Even more, the
identifiers can be mapped to *unprivileged* non-overlapping UIDs and GIDs on the
host. This basically means two things:
-->
## 使用者命名空間是什麼？

使用者命名空間是 Linux 的一項特性，它將容器的使用者和組標識符（UID 和 GID）與宿主機上的標識符隔離開來。
容器中的標識符可以映射到宿主機上的標識符，其中用於不同容器的主機 UID/GID 從不重疊。
更重要的是，標識符可以映射到宿主機上的**非特權**、非重疊的 UID 和 GID。這基本上意味着兩件事：

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
 * 由於不同容器的 UID 和 GID 映射到宿主機上不同的 UID 和 GID，因此即使它們逃逸出了容器的邊界，也很難相互攻擊。
   例如，如果容器 A 在宿主機上使用與容器 B 不同的 UID 和 GID 運行，則它可以對容器 B
   的檔案和進程執行的操作受到限制：只能讀/寫允許其他人使用的檔案，
   因爲它永遠不會擁有所有者或組的權限（宿主機上的 UID/GID 保證對於不同的容器是不同的）。

<!--
 * As the UIDs and GIDs are mapped to unprivileged users on the host, if a
   container escapes the container boundaries, even if it is running as root
   inside the container, it has no privileges on the host. This greatly
   protects what host files it can read/write, which process it can send signals
   to, etc.

Furthermore, capabilities granted are only valid inside the user namespace and
not on the host.
-->
 * 由於 UID 和 GID 映射到宿主機上的非特權使用者，如果容器逃逸出了容器邊界，
   即使它在容器內以 root 身份運行，它在宿主機上也沒有特權。
   這極大地保護了它可以讀/寫哪些宿主機檔案、可以向哪個進程發送信號等。

此外，所授予的權能（Capability）僅在使用者命名空間內有效，而在宿主機上無效。

<!--
Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capabilities
were granted to the container, the capabilities are valid on the host too. None
of this is true when using user namespaces (modulo bugs, of course 🙂).
-->
在不使用使用者命名空間的情況下，以 root 身份運行的容器在發生逃逸的情況下會獲得節點上的
root 權限。如果某些權能被授予容器，那麼這些權能在主機上也有效。
當使用使用者命名空間時，這些情況都會被避免（當然，除非存在漏洞 🙂）。

<!--
## Changes in 1.28

As already mentioned, starting from 1.28, Kubernetes supports user namespaces
with stateful pods. This means that pods with user namespaces can use any type
of volume, they are no longer limited to only some volume types as before.
-->
## 1.28 版本的變化

正如之前提到的，從 1.28 版本開始，Kubernetes 支持有狀態的 Pod 的使用者命名空間。
這意味着具有使用者命名空間的 Pod 可以使用任何類型的卷，不再僅限於以前的部分卷類型。

<!--
The feature gate to activate this feature was renamed, it is no longer
`UserNamespacesStatelessPodsSupport` but from 1.28 onwards you should use
`UserNamespacesSupport`. There were many changes done and the requirements on
the node hosts changed. So with Kubernetes 1.28 the feature flag was renamed to
reflect this.
-->
從 1.28 版本開始，用於激活此特性的特性門控已被重命名，不再是 `UserNamespacesStatelessPodsSupport`，
而應該使用 `UserNamespacesSupport`。此特性經歷了許多更改，
對節點主機的要求也發生了變化。因此，Kubernetes 1.28 版本將該特性標誌重命名以反映這一變化。

<!--
## Demo

Rodrigo created a demo which exploits [CVE 2022-0492][cve-link] and shows how
the exploit can occur without user namespaces. He also shows how it is not
possible to use this exploit from a Pod where the containers are using this
feature.
-->
## 演示

Rodrigo 創建了一個利用 [CVE 2022-0492][cve-link] 的演示，
用以展現如何在沒有使用者命名空間的情況下利用該漏洞。
他還展示了在容器使用了此特性的 Pod 中無法利用此漏洞的情況。

<!--
This vulnerability is rated **HIGH** and allows **a container with no special
privileges to read/write to any path on the host** and launch processes as root
on the host too.

{{< youtube id="M4a2b4KkXN8" title="Mitigation of CVE-2022-0492 on Kubernetes by enabling User Namespace support">}}
-->
此漏洞被評爲高危，允許一個沒有特殊特權的容器讀/寫宿主機上的任何路徑，並在宿主機上以 root 身份啓動進程。

{{< youtube id="M4a2b4KkXN8" title="Mitigation of CVE-2022-0492 on Kubernetes by enabling User Namespace support">}}

<!--
Most applications in containers run as root today, or as a semi-predictable
non-root user (user ID 65534 is a somewhat popular choice). When you run a Pod
with containers using a userns, Kubernetes runs those containers as unprivileged
users, with no changes needed in your app.
-->
如今，容器中的大多數應用程式都以 root 身份運行，或者以半可預測的非 root
使用者身份運行（使用者 ID 65534 是一個比較流行的選擇）。
當你運行某個 Pod，而其中帶有使用使用者名命名空間（userns）的容器時，Kubernetes
以非特權使用者身份運行這些容器，無需在你的應用程式中進行任何更改。

<!--
This means two containers running as user 65534 will effectively be mapped to
different users on the host, limiting what they can do to each other in case of
an escape, and if they are running as root, the privileges on the host are
reduced to the one of an unprivileged user.

[cve-link]: https://unit42.paloaltonetworks.com/cve-2022-0492-cgroups/
-->
這意味着兩個以使用者 65534 身份運行的容器實際上會被映射到宿主機上的不同使用者，
從而限制了它們在發生逃逸的情況下能夠對彼此執行的操作，如果它們以 root 身份運行，
宿主機上的特權也會降低到非特權使用者的權限。

[cve-link]: https://unit42.paloaltonetworks.com/cve-2022-0492-cgroups/

<!--
## Node system requirements

There are requirements on the Linux kernel version as well as the container
runtime to use this feature.
-->
## 節點系統要求 

要使用此功能，對 Linux 內核版本以及容器運行時有一定要求。

<!--
On Linux you need Linux 6.3 or greater. This is because the feature relies on a
kernel feature named idmap mounts, and support to use idmap mounts with tmpfs
was merged in Linux 6.3.

If you are using CRI-O with crun, this is [supported in CRI-O
1.28.1][CRIO-release] and crun 1.9 or greater. If you are using CRI-O with runc,
this is still not supported.
-->
在 Linux上，你需要 Linux 6.3 或更高版本。這是因爲該特性依賴於一個名爲
idmap mounts 的內核特性，而 Linux 6.3 中合併了針對 tmpfs 使用 idmap mounts 的支持

如果你使用 CRI-O 與 crun，這一特性在 [CRI-O 1.28.1][CRIO-release] 和 crun 1.9 或更高版本中受支持。
如果你使用 CRI-O 與 runc，目前仍不受支持。

<!--
containerd support is currently targeted for containerd 2.0; it is likely that
it won't matter if you use it with crun or runc.

Please note that containerd 1.7 added _experimental_ support for user
namespaces as implemented in Kubernetes 1.25 and 1.26. The redesign done in 1.27
is not supported by containerd 1.7, therefore it only works, in terms of user
namespaces support, with Kubernetes 1.25 and 1.26.
-->
containerd 對此的支持目前設定的目標是 containerd 2.0；不管你是否與 crun 或 runc 一起使用，或許都不重要。

請注意，containerd 1.7 添加了對使用者命名空間的實驗性支持，正如在 Kubernetes 1.25
和 1.26 中實現的那樣。1.27 版本中進行的重新設計不受 containerd 1.7 支持，
因此它在使用者命名空間支持方面僅適用於 Kubernetes 1.25 和 1.26。

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
containerd 1.7 存在的一個限制是，在 Pod 啓動期間需要更改容器映像檔中每個檔案和目錄的所有權。
這意味着它具有儲存開銷，並且可能會顯著影響容器啓動延遲。containerd 2.0
可能會包括一個實現，可以消除增加的啓動延遲和儲存開銷。如果計劃在生產中使用
containerd 1.7 與使用者命名空間，請考慮這一點。

這些 Containerd 限制均不適用於 [CRI-O 1.28][CRIO 版本]。

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
## 接下來？

展望 Kubernetes 1.29，計劃是與 SIG Auth 合作，將使用者命名空間集成到 Pod 安全標準（PSS）和 Pod 安全准入中。
目前的計劃是在使用使用者命名空間時放寬 Pod 安全標準（PSS）策略中的檢查。這意味着如果使用使用者命名空間，那麼字段
`spec[.*].securityContext`、`runAsUser`、`runAsNonRoot`、`allowPrivilegeEscalation和capabilities`
將不會觸發違規，此行爲可能會通過使用 API Server 特性門控來控制，比如 `UserNamespacesPodSecurityStandards` 或其他類似的。

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
## 我該如何參與？

你可以通過以下方式與 SIG Node 聯繫：

- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

你還可以直接聯繫我們：

- GitHub：@rata @giuseppe @saschagrunert
- Slack：@rata @giuseppe @sascha
