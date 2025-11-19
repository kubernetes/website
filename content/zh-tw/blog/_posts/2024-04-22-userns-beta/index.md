---
layout: blog
title: "Kubernetes 1.30：對 Pod 使用用戶命名空間的支持進階至 Beta"
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
Linux 提供了不同的命名空間來將進程彼此隔離。
例如，一個典型的 Kubernetes Pod 運行在一個網絡命名空間中可以隔離網絡身份，運行在一個 PID 命名空間中可以隔離進程。

Linux 有一個以前一直未被容器化應用所支持的命名空間是[用戶命名空間](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)。
這個命名空間允許我們將容器內使用的用戶標識符和組標識符（UID 和 GID）與主機上的標識符隔離開來。

<!--
This is a powerful abstraction that allows us to run containers as "root": we
are root inside the container and can do everything root can inside the pod,
but our interactions with the host are limited to what a non-privileged user can
do. This is great for limiting the impact of a container breakout.
-->
這是一個強大的抽象，允許我們以 “root” 身份運行容器：
我們在容器內部有 root 權限，可以在 Pod 內執行所有 root 能做的操作，
但我們與主機的交互僅限於非特權用戶可以執行的操作。這對於限制容器逃逸的影響非常有用。

<!--
A container breakout is when a process inside a container can break out
onto the host using some unpatched vulnerability in the container runtime or the
kernel and can access/modify files on the host or other containers. If we
run our pods with user namespaces, the privileges the container has over the
rest of the host are reduced, and the files outside the container it can access
are limited too.
-->
容器逃逸是指容器內的進程利用容器運行時或內核中的某些未打補丁的漏洞逃逸到主機上，
並可以訪問/修改主機或其他容器上的文件。如果我們以用戶命名空間運行我們的 Pod，
容器對主機其餘部分的特權將減少，並且此容器可以訪問的容器外的文件也將受到限制。

<!--
In Kubernetes v1.25, we introduced support for user namespaces only for stateless
pods. Kubernetes 1.28 lifted that restriction, and now, with Kubernetes 1.30, we
are moving to beta!
-->
在 Kubernetes v1.25 中，我們僅爲無狀態 Pod 引入了對用戶命名空間的支持。
Kubernetes 1.28 取消了這一限制，目前在 Kubernetes 1.30 中，這個特性進階到了 Beta！

<!--
## What is a user namespace?

Note: Linux user namespaces are a different concept from [Kubernetes
namespaces](/docs/concepts/overview/working-with-objects/namespaces/).
The former is a Linux kernel feature; the latter is a Kubernetes feature.
-->
## 什麼是用戶命名空間？   {#what-is-a-user-namespace}

注意：Linux 用戶命名空間與
[Kubernetes 命名空間](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)是不同的概念。
前者是一個 Linux 內核特性；後者是一個 Kubernetes 特性。

<!--
User namespaces are a Linux feature that isolates the UIDs and GIDs of the
containers from the ones on the host. The identifiers in the container can be
mapped to identifiers on the host in a way where the host UID/GIDs used for
different containers never overlap. Furthermore, the identifiers can be mapped
to unprivileged, non-overlapping UIDs and GIDs on the host. This brings two key
benefits:
-->
用戶命名空間是一個 Linux 特性，它將容器的 UID 和 GID 與主機上的隔離開來。
容器中的標識符可以被映射爲主機上的標識符，並且保證不同容器所使用的主機 UID/GID 不會重疊。
此外，這些標識符可以被映射到主機上沒有特權的、非重疊的 UID 和 GID。這帶來了兩個關鍵好處：

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
* __防止橫向移動__：由於不同容器的 UID 和 GID 被映射到主機上的不同 UID 和 GID，
  即使這些標識符逃出了容器的邊界，容器之間也很難互相攻擊。
  例如，假設容器 A 在主機上使用的 UID 和 GID 與容器 B 不同。
  在這種情況下，它對容器 B 的文件和進程的操作是有限的：只能讀取/寫入某文件所允許的操作，
  因爲它永遠不會擁有文件所有者或組權限（主機上的 UID/GID 保證對不同容器是不同的）。

<!--
* _Increased host isolation_: As the UIDs and GIDs are mapped to unprivileged
users on the host, if a container escapes the container boundaries, even if it
runs as root inside the container, it has no privileges on the host. This
greatly protects what host files it can read/write, which process it can send
signals to, etc. Furthermore, capabilities granted are only valid inside the
user namespace and not on the host, limiting the impact a container
escape can have.
-->
* __增加主機隔離__：由於 UID 和 GID 被映射到主機上的非特權用戶，如果某容器逃出了它的邊界，
  即使它在容器內部以 root 身份運行，它在主機上也沒有特權。
  這大大保護了它可以讀取/寫入的主機文件，它可以向哪個進程發送信號等。
  此外，所授予的權能僅在用戶命名空間內有效，而在主機上無效，這就限制了容器逃逸的影響。

<!--
{{< figure src="/images/blog/2024-04-22-userns-beta/userns-ids.png" alt="Image showing IDs 0-65535 are reserved to the host, pods use higher IDs" title="User namespace IDs allocation" >}}
-->
{{< figure src="/images/blog/2024-04-22-userns-beta/userns-ids.png" alt="此圖顯示了 ID 0-65535 爲主機預留，Pod 使用更大的 ID" title="用戶命名空間 ID 分配" >}}

<!--
Without using a user namespace, a container running as root in the case of a
container breakout has root privileges on the node. If some capabilities
were granted to the container, the capabilities are valid on the host too. None
of this is true when using user namespaces (modulo bugs, of course 🙂).
-->
如果不使用用戶命名空間，容器逃逸時以 root 運行的容器在節點上將具有 root 特權。
如果某些權能授權給了此容器，這些權能在主機上也會有效。
如果使用用戶命名空間，就不會是這種情況（當然，除非有漏洞 🙂）。

<!--
## Changes in 1.30

In Kubernetes 1.30, besides moving user namespaces to beta, the contributors
working on this feature:
-->
## 1.30 的變化   {#changes-in-1.30}

在 Kubernetes 1.30 中，除了將用戶命名空間進階至 Beta，參與此特性的貢獻者們還：

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
* 爲 kubelet 引入了一種使用自定義範圍進行 UID/GID 映射的方式
* 爲 Kubernetes 添加了一種強制執行的方式讓運行時支持用戶命名空間所需的所有特性。
  如果不支持這些特性，Kubernetes 在嘗試創建具有用戶命名空間的 Pod 時，會顯示一個明確的錯誤。
  在 1.30 之前，如果容器運行時不支持用戶命名空間，Pod 可能會在沒有用戶命名空間的情況下被創建。
* 新增了更多的測試，包括在 [cri-tools](https://github.com/kubernetes-sigs/cri-tools/pull/1354) 倉庫中的測試。

<!--
You can check the
[documentation](/docs/concepts/workloads/pods/user-namespaces/#set-up-a-node-to-support-user-namespaces)
on user namespaces for how to configure custom ranges for the mapping.
-->
你可以查閱有關用戶命名空間的[文檔](/zh-cn/docs/concepts/workloads/pods/user-namespaces/#set-up-a-node-to-support-user-namespaces)，
瞭解如何配置映射的自定義範圍。

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

幾個月前，[CVE-2024-21626][runc-cve] 被披露。
這個 **漏洞評分爲 8.6（高）**。它允許攻擊者讓容器逃逸，並**讀取/寫入節點上的任何路徑以及同一節點上託管的其他 Pod**。

Rodrigo 創建了一個濫用 [CVE 2024-21626][runc-cve] 的演示，
演示了此漏洞在沒有用戶命名空間時的工作方式，而在使用用戶命名空間後 **得到了緩解**。

<!--
{{< youtube id="07y5bl5UDdA" title="Mitigation of CVE-2024-21626 on Kubernetes by enabling User Namespace support" class="youtube-quote-sm" >}}
-->
{{< youtube id="07y5bl5UDdA" title="通過啓用用戶命名空間支持來在 Kubernetes 上緩解 CVE-2024-21626" class="youtube-quote-sm" >}}

<!--
Please note that with user namespaces, an attacker can do on the host file system
what the permission bits for "others" allow. Therefore, the CVE is not
completely prevented, but the impact is greatly reduced.
-->
請注意，使用用戶命名空間時，攻擊者可以在主機文件系統上執行“其他”權限位所允許的操作。
因此，此 CVE 並沒有完全被修復，但影響大大降低。

[runc-cve]: https://github.com/opencontainers/runc/security/advisories/GHSA-xr7r-f8xq-vfvv

<!--
## Node system requirements

There are requirements on the Linux kernel version and the container
runtime to use this feature.

On Linux you need Linux 6.3 or greater. This is because the feature relies on a
kernel feature named idmap mounts, and support for using idmap mounts with tmpfs
was merged in Linux 6.3.
-->
## 節點系統要求   {#node-system-requirements}

使用此特性對 Linux 內核版本和容器運行時有一些要求。

在 Linux 上，你需要 Linux 6.3 或更高版本。
這是因爲此特性依賴於一個名爲 idmap 掛載的內核特性，而支持 idmap 掛載與 tmpfs 一起使用的特性是在 Linux 6.3 中合併的。

<!--
Suppose you are using [CRI-O][crio] with crun; as always, you can expect support for
Kubernetes 1.30 with CRI-O 1.30. Please note you also need [crun][crun] 1.9 or
greater. If you are using CRI-O with [runc][runc], this is still not supported.

Containerd support is currently targeted for [containerd][containerd] 2.0, and
the same crun version requirements apply. If you are using containerd with runc,
this is still not supported.
-->
假設你使用 [CRI-O][crio] 和 crun；就像往常一樣，你可以期待 CRI-O 1.30 支持 Kubernetes 1.30。
請注意，你還需要 [crun][crun] 1.9 或更高版本。如果你使用的是 CRI-O 和 [runc][runc]，則仍然不支持用戶命名空間。

containerd 對此特性的支持目前鎖定爲 [containerd][containerd] 2.0，同樣 crun 也有適用的版本要求。
如果你使用的是 containerd 和 runc，則仍然不支持用戶命名空間。

<!--
Please note that containerd 1.7 added _experimental_ support for user
namespaces, as implemented in Kubernetes 1.25 and 1.26. We did a redesign in
Kubernetes 1.27, which requires changes in the container runtime. Those changes
are not present in containerd 1.7, so it only works with user namespaces
support in Kubernetes 1.25 and 1.26.
-->
請注意，正如在 Kubernetes 1.25 和 1.26 中實現的那樣，containerd 1.7 增加了對用戶命名空間的**實驗性**支持。
我們曾在 Kubernetes 1.27 中進行了重新設計，所以容器運行時需要做一些變更。
而 containerd 1.7 並未包含這些變更，所以它僅在 Kubernetes 1.25 和 1.26 中支持使用用戶命名空間。

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
containerd 1.7 的另一個限制是，它需要在 Pod 啓動期間變更容器鏡像內的每個文件和目錄的所有權。
這會增加存儲開銷，並可能顯著影響容器啓動延遲。containerd 2.0 可能會包含一個實現，以消除增加的啓動延遲和存儲開銷。
如果你計劃在生產環境中使用 containerd 1.7 和用戶命名空間，請考慮這一點。

containerd 1.7 的這些限制均不適用於 CRI-O。

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
## 如何參與？   {#how-do-i-get-involved}

你可以通過以下方式聯繫 SIG Node：

- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [提交社區 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)

<!--
You can also contact us directly:
- GitHub: @rata @giuseppe @saschagrunert
- Slack: @rata @giuseppe @sascha
-->
你也可以通過以下方式直接聯繫我們：

- GitHub：@rata @giuseppe @saschagrunert
- Slack：@rata @giuseppe @sascha
