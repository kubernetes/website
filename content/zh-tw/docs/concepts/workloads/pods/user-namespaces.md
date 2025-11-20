---
title: 使用者命名空間
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
{{< feature-state for_k8s_version="v1.30" state="beta" >}}
<!--
This page explains how user namespaces are used in Kubernetes pods. A user
namespace isolates the user running inside the container from the one
in the host.

A process running as root in a container can run as a different (non-root) user
in the host; in other words, the process has full privileges for operations
inside the user namespace, but is unprivileged for operations outside the
namespace.
-->
本頁解釋了在 Kubernetes Pod 中如何使用使用者命名空間。
使用者命名空間將容器內運行的使用者與主機中的使用者隔離開來。

在容器中以 Root 身份運行的進程可以在主機中以不同的（非 Root）使用者身份運行；
換句話說，該進程在使用者命名空間內的操作具有完全的權限，
但在命名空間外的操作是無特權的。

<!--
You can use this feature to reduce the damage a compromised container can do to
the host or other pods in the same node. There are [several security
vulnerabilities][KEP-vulns] rated either **HIGH** or **CRITICAL** that were not
exploitable when user namespaces is active. It is expected user namespace will
mitigate some future vulnerabilities too.
-->
你可以使用這個功能來減少被破壞的容器對主機或同一節點中的其他 Pod 的破壞。
有[幾個安全漏洞][KEP-vulns]被評爲 **高（HIGH）** 或 **重要（CRITICAL）**，
當使用者命名空間處於激活狀態時，這些漏洞是無法被利用的。
預計使用者命名空間也會減輕一些未來的漏洞。

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

<!-- body -->

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

<!--
This is a Linux-only feature and support is needed in Linux for idmap mounts on
the filesystems used. This means:

* On the node, the filesystem you use for `/var/lib/kubelet/pods/`, or the
  custom directory you configure for this, needs idmap mount support.
* All the filesystems used in the pod's volumes must support idmap mounts.
-->
這是一個只對 Linux 有效的功能特性，且需要 Linux 支持在所用檔案系統上掛載 idmap。
這意味着：

* 在節點上，你用於 `/var/lib/kubelet/pods/` 的檔案系統，或你爲此設定的自定義目錄，
  需要支持 idmap 掛載。
* Pod 卷中使用的所有檔案系統都必須支持 idmap 掛載。

<!--
In practice this means you need at least Linux 6.3, as tmpfs started supporting
idmap mounts in that version. This is usually needed as several Kubernetes
features use tmpfs (the service account token that is mounted by default uses a
tmpfs, Secrets use a tmpfs, etc.)

Some popular filesystems that support idmap mounts in Linux 6.3 are: btrfs,
ext4, xfs, fat, tmpfs, overlayfs.
-->
在實踐中，這意味着你最低需要 Linux 6.3，因爲 tmpfs 在該版本中開始支持 idmap 掛載。
這通常是需要的，因爲有幾個 Kubernetes 功能特性使用 tmpfs
（預設情況下掛載的服務賬號令牌使用 tmpfs、Secret 使用 tmpfs 等等）。

Linux 6.3 中支持 idmap 掛載的一些比較流行的檔案系統是：btrfs、ext4、xfs、fat、
tmpfs、overlayfs。

<!--
In addition, the container runtime and its underlying OCI runtime must support
user namespaces. The following OCI runtimes offer support:

* [crun](https://github.com/containers/crun) version 1.9 or greater (it's recommend version 1.13+).
* [runc](https://github.com/opencontainers/runc) version 1.2 or greater
-->

此外，容器運行時及其底層 OCI 運行時必須支持使用者命名空間。以下 OCI 運行時提供支持：

* [crun](https://github.com/containers/crun) 1.9 或更高版本（推薦 1.13+ 版本）。
* [runc](https://github.com/opencontainers/runc) 1.2 或更高版本。

{{< note >}}
<!--
Some OCI runtimes do not include the support needed for using user namespaces in
Linux pods. If you use a managed Kubernetes, or have downloaded it from packages
and set it up, it's possible that nodes in your cluster use a runtime that doesn't
include this support.
-->
一些 OCI 運行時不包含在 Linux Pod 中使用使用者命名空間所需的支持。
如果你使用託管 Kubernetes，或者使用軟體包下載並安裝 Kubernetes 叢集，
則叢集中的節點可能使用不包含支持此特性的運行時。
{{< /note >}}

<!--
To use user namespaces with Kubernetes, you also need to use a CRI
 {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
 to use this feature with Kubernetes pods:

* containerd: version 2.0 (and later) supports user namespaces for containers.
* CRI-O: version 1.25 (and later) supports user namespaces for containers.
-->
此外，需要在{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}提供支持，
才能在 Kubernetes Pod 中使用這一功能：

* containerd：2.0（及更高）版本支持容器使用使用者命名空間。
* CRI-O：1.25（及更高）版本支持設定容器的使用者命名空間。

<!--
You can see the status of user namespaces support in cri-dockerd tracked in an [issue][CRI-dockerd-issue]
on GitHub.
-->
你可以在 GitHub 上的 [Issue][CRI-dockerd-issue] 中查看 cri-dockerd
中使用者命名空間支持的狀態。

<!--
## Introduction
-->
## 介紹 {#introduction}

<!--
User namespaces is a Linux feature that allows to map users in the container to
different users in the host. Furthermore, the capabilities granted to a pod in
a user namespace are valid only in the namespace and void outside of it.

A pod can opt-in to use user namespaces by setting the `pod.spec.hostUsers` field
to `false`.
-->
使用者命名空間是一個 Linux 功能，允許將容器中的使用者映射到主機中的不同使用者。
此外，在某使用者命名空間中授予 Pod 的權能只在該命名空間中有效，在該命名空間之外無效。

一個 Pod 可以通過將 `pod.spec.hostUsers` 字段設置爲 `false` 來選擇使用使用者命名空間。

<!--
The kubelet will pick host UIDs/GIDs a pod is mapped to, and will do so in a way
to guarantee that no two pods on the same node use the same mapping.

The `runAsUser`, `runAsGroup`, `fsGroup`, etc. fields in the `pod.spec` always
refer to the user inside the container. These users will be used for volume
mounts (specified in `pod.spec.volumes`) and therefore the host UID/GID will not
have any effect on writes/reads from volumes the pod can mount. In other words,
the inodes created/read in volumes mounted by the pod will be the same as if the
pod wasn't using user namespaces.
-->
kubelet 將挑選 Pod 所映射的主機 UID/GID，
並以此保證同一節點上沒有兩個 Pod 使用相同的方式進行映射。

`pod.spec` 中的 `runAsUser`、`runAsGroup`、`fsGroup` 等字段總是指的是容器內的使用者。
這些使用者將用於卷掛載（在 `pod.spec.volumes` 中指定），
因此，主機上的 UID/GID 不會影響 Pod 掛載卷的讀寫操作。
換句話說，由 Pod 掛載卷中創建或讀取的 inode，將與 Pod 未使用使用者命名空間時相同。

<!--
This way, a pod can easily enable and disable user namespaces (without affecting
its volume's file ownerships) and can also share volumes with pods without user
namespaces by just setting the appropriate users inside the container
(`RunAsUser`, `RunAsGroup`, `fsGroup`, etc.). This applies to any volume the pod
can mount, including `hostPath` (if the pod is allowed to mount `hostPath`
volumes).

By default, the valid UIDs/GIDs when this feature is enabled is the range 0-65535.
This applies to files and processes (`runAsUser`, `runAsGroup`, etc.).
-->
通過這種方式，Pod 可以輕鬆啓用或禁用使用者命名空間（不會影響其卷中檔案的所有權），
並且可以通過在容器內部設置適當的使用者（`runAsUser`、`runAsGroup`、`fsGroup` 等），
即可與沒有使用者命名空間的 Pod 共享卷。這一點適用於 Pod 可掛載的任何卷，
包括 `hostPath`（前提是允許 Pod 掛載 `hostPath` 卷）。

預設情況下，當啓用該功能時，有效的 UID/GID 在 0-65535 範圍內。
這適用於檔案和進程（`runAsUser`、`runAsGroup` 等）。

<!--
Files using a UID/GID outside this range will be seen as belonging to the
overflow ID, usually 65534 (configured in `/proc/sys/kernel/overflowuid` and
`/proc/sys/kernel/overflowgid`). However, it is not possible to modify those
files, even by running as the 65534 user/group.

If the range 0-65535 is extended with a configuration knob, the aforementioned
restrictions apply to the extended range.

Most applications that need to run as root but don't access other host
namespaces or resources, should continue to run fine without any changes needed
if user namespaces is activated.
-->
使用這個範圍之外的 UID/GID 的檔案將被視爲屬於溢出 ID，
通常是 65534（設定在 `/proc/sys/kernel/overflowuid和/proc/sys/kernel/overflowgid`）。
然而，即使以 65534 使用者/組的身份運行，也不可能修改這些檔案。

如果用設定旋鈕將 0-65535 範圍擴展，則上述限制適用於擴展的範圍。

大多數需要以 Root 身份運行但不訪問其他主機命名空間或資源的應用程式，
在使用者命名空間被啓用時，應該可以繼續正常運行，不需要做任何改變。

<!--
## Understanding user namespaces for pods {#pods-and-userns}
-->
## 瞭解 Pod 的使用者命名空間 {#pods-and-userns}

<!--
Several container runtimes with their default configuration (like Docker Engine,
containerd, CRI-O) use Linux namespaces for isolation. Other technologies exist
and can be used with those runtimes too (e.g. Kata Containers uses VMs instead of
Linux namespaces). This page is applicable for container runtimes using Linux
namespaces for isolation.

When creating a pod, by default, several new namespaces are used for isolation:
a network namespace to isolate the network of the container, a PID namespace to
isolate the view of processes, etc. If a user namespace is used, this will
isolate the users in the container from the users in the node.
-->
一些容器運行時的預設設定（如 Docker Engine、containerd、CRI-O）使用 Linux 命名空間進行隔離。
其他技術也存在，也可以與這些運行時（例如，Kata Containers 使用虛擬機而不是 Linux 命名空間）結合使用。
本頁適用於使用 Linux 命名空間進行隔離的容器運行時。

在創建 Pod 時，預設情況下會使用幾個新的命名空間進行隔離：
一個網路命名空間來隔離容器網路，一個 PID 命名空間來隔離進程視圖等等。
如果使用了一個使用者命名空間，這將把容器中的使用者與節點中的使用者隔離開來。

<!--
This means containers can run as root and be mapped to a non-root user on the
host. Inside the container the process will think it is running as root (and
therefore tools like `apt`, `yum`, etc. work fine), while in reality the process
doesn't have privileges on the host. You can verify this, for example, if you
check which user the container process is running by executing `ps aux` from
the host. The user `ps` shows is not the same as the user you see if you
execute inside the container the command `id`.

This abstraction limits what can happen, for example, if the container manages
to escape to the host. Given that the container is running as a non-privileged
user on the host, it is limited what it can do to the host.
-->
這意味着容器可以以 Root 身份運行，並將該身份映射到主機上的一個非 Root 使用者。
在容器內，進程會認爲它是以 Root 身份運行的（因此像 `apt`、`yum` 等工具可以正常工作），
而實際上該進程在主機上沒有權限。
你可以驗證這一點，例如，如果你從主機上執行 `ps aux` 來檢查容器進程是以哪個使用者運行的。
`ps` 顯示的使用者與你在容器內執行 `id` 命令時看到的使用者是不一樣的。

這種抽象限制了可能發生的情況，例如，容器設法逃逸到主機上時的後果。
鑑於容器是作爲主機上的一個非特權使用者運行的，它能對主機做的事情是有限的。

<!--
Furthermore, as users on each pod will be mapped to different non-overlapping
users in the host, it is limited what they can do to other pods too.

Capabilities granted to a pod are also limited to the pod user namespace and
mostly invalid out of it, some are even completely void. Here are two examples:
- `CAP_SYS_MODULE` does not have any effect if granted to a pod using user
namespaces, the pod isn't able to load kernel modules.
- `CAP_SYS_ADMIN` is limited to the pod's user namespace and invalid outside
of it.
-->
此外，由於每個 Pod 上的使用者將被映射到主機中不同的非重疊使用者，
他們對其他 Pod 可以執行的操作也是有限的。

授予一個 Pod 的權能也被限制在 Pod 的使用者命名空間內，
並且在這一命名空間之外大多無效，有些甚至完全無效。這裏有兩個例子：

- `CAP_SYS_MODULE` 若被授予一個使用使用者命名空間的 Pod 則沒有任何效果，這個 Pod 不能加載內核模塊。
- `CAP_SYS_ADMIN` 只限於 Pod 所在的使用者命名空間，在該命名空間之外無效。

<!--
Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capability were
granted to the container, the capabilities are valid on the host too. None of
this is true when we use user namespaces.

If you want to know more details about what changes when user namespaces are in
use, see `man 7 user_namespaces`.
-->
在不使用使用者命名空間的情況下，以 Root 賬號運行的容器，在容器逃逸時，在節點上有 Root 權限。
而且如果某些權能被授予了某容器，這些權能在宿主機上也是有效的。
當我們使用使用者命名空間時，這些都不再成立。

如果你想知道關於使用使用者命名空間時的更多變化細節，請參見 `man 7 user_namespaces`。

<!--
## Set up a node to support user namespaces
-->
## 設置一個節點以支持使用者命名空間 {#set-up-a-node-to-support-user-namespaces}

<!--
By default, the kubelet assigns pods UIDs/GIDs above the range 0-65535, based on
the assumption that the host's files and processes use UIDs/GIDs within this
range, which is standard for most Linux distributions. This approach prevents
any overlap between the UIDs/GIDs of the host and those of the pods.
-->
預設情況下，kubelet 會分配 0-65535 範圍以上的 Pod UID/GID，
這是基於主機的檔案和進程使用此範圍內的 UID/GID 的假設，也是大多數 Linux 發行版的標準。
此方法可防止主機的 UID/GID 與 Pod 的 UID/GID 之間出現重疊。

<!--
Avoiding the overlap is important to mitigate the impact of vulnerabilities such
as [CVE-2021-25741][CVE-2021-25741], where a pod can potentially read arbitrary
files in the host. If the UIDs/GIDs of the pod and the host don't overlap, it is
limited what a pod would be able to do: the pod UID/GID won't match the host's
file owner/group.
-->
避免重疊對於減輕 [CVE-2021-25741][CVE-2021-25741] 等漏洞的影響非常重要，
其中 Pod 可能會讀取主機中的任意檔案。
如果 Pod 和主機的 UID/GID 不重疊，則 Pod 的功能將受到限制：
Pod UID/GID 將與主機的檔案所有者/組不匹配。

<!--
The kubelet can use a custom range for user IDs and group IDs for pods. To
configure a custom range, the node needs to have:

 * A user `kubelet` in the system (you cannot use any other username here)
 * The binary `getsubids` installed (part of [shadow-utils][shadow-utils]) and
   in the `PATH` for the kubelet binary.
 * A configuration of subordinate UIDs/GIDs for the `kubelet` user (see
   [`man 5 subuid`](https://man7.org/linux/man-pages/man5/subuid.5.html) and
   [`man 5 subgid`](https://man7.org/linux/man-pages/man5/subgid.5.html)).
-->
kubelet 可以對 Pod 的使用者 ID 和組 ID 使用自定義範圍。要設定自定義範圍，節點需要具有：
* 系統中的使用者 `kubelet`（此處不能使用任何其他使用者名）。
* 已安裝二進制檔案 `getsubids`（[shadow-utils][shadow-utils] 的一部分）並位於 kubelet 二進制檔案的 `PATH` 中。
* `kubelet` 使用者的從屬 UID/GID 設定
  （請參閱 [`man 5 subuid`](https://man7.org/linux/man-pages/man5/subuid.5.html) 和
  [`man 5 subgid`](https://man7.org/linux/man-pages/man5/subgid.5.html)）

<!--
This setting only gathers the UID/GID range configuration and does not change
the user executing the `kubelet`.

You must follow some constraints for the subordinate ID range that you assign
to the `kubelet` user:
-->
此設置僅收集 UID/GID 範圍設定，不會更改執行 `kubelet` 的使用者。

對於分配給 `kubelet` 使用者的從屬 ID 範圍， 你必須遵循一些限制：

<!--
* The subordinate user ID, that starts the UID range for Pods, **must** be a
  multiple of 65536 and must also be greater than or equal to 65536. In other
  words, you cannot use any ID from the range 0-65535 for Pods; the kubelet
  imposes this restriction to make it difficult to create an accidentally insecure
  configuration.
-->
* 啓動 Pod 的 UID 範圍的從屬使用者 ID **必須**是 65536 的倍數，並且還必須大於或等於 65536。
  換句話說，Pod 不能使用 0-65535 範圍內的任何 ID；kubelet 施加此限制是爲了使創建意外不安全的設定變得困難。

<!--
* The subordinate ID count must be a multiple of 65536

* The subordinate ID count must be at least `65536 x <maxPods>` where `<maxPods>`
  is the maximum number of pods that can run on the node.

* You must assign the same range for both user IDs and for group IDs, It doesn't
  matter if other users have user ID ranges that don't align with the group ID
  ranges.
-->
* 從屬 ID 計數必須是 65536 的倍數。

* 從屬 ID 計數必須至少爲 `65536 x <maxPods>`，其中 `<maxPods>` 是節點上可以運行的最大 Pod 數量。

* 你必須爲使用者 ID 和組 ID 分配相同的範圍。如果其他使用者的使用者 ID 範圍與組 ID 範圍不一致也沒關係。

<!--
* None of the assigned ranges should overlap with any other assignment.

* The subordinate configuration must be only one line. In other words, you can't
  have multiple ranges.

For example, you could define `/etc/subuid` and `/etc/subgid` to both have
these entries for the `kubelet` user:
-->
* 所分配的範圍不得與任何其他分配重疊。

* 從屬設定必須只有一行。換句話說，你不能有多個範圍。

例如，你可以定義 `/etc/subuid` 和 `/etc/subgid` 來爲 `kubelet` 使用者定義以下條目：

<!--
```
# The format is
#   name:firstID:count of IDs
# where
# - firstID is 65536 (the minimum value possible)
# - count of IDs is 110 * 65536
#   (110 is the default limit for number of pods on the node)
```
-->
```
# 格式爲：
#   name:firstID:count of IDs
# 其中：
# - firstID 是 65536 （可能的最小值）
# - ID 的數量是 110 * 65536（110 是節點上 Pod 數量的默認限制）

kubelet:65536:7208960
```

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980
[shadow-utils]: https://github.com/shadow-maint/shadow

<!--
## ID count for each of Pods

Starting with Kubernetes v1.33, the ID count for each of Pods can be set in
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
## Pod 的 ID 計數   {#id-count-for-each-of-pods}

從 Kubernetes v1.33 開始，每個 Pod 的 ID 計數可以在 
[`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/) 中設置。

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
userNamespaces:
  idsPerPod: 1048576
```

<!--
The value of `idsPerPod` (uint32) must be a multiple of 65536.
The default value is 65536.
This value only applies to containers created after the kubelet was started with
this `KubeletConfiguration`.
Running containers are not affected by this config.

In Kubernetes prior to v1.33, the ID count for each of Pods was hard-coded to
65536.
-->
`idsPerPod` 的值（uint32）必須是 65536 的倍數。
預設值是 65536。
此值僅適用於使用此 `KubeletConfiguration` 啓動 kubelet 後創建的容器。
正在運行的容器不受此設定的影響。

在 Kubernetes v1.33 之前，每個 Pod 的 ID 計數被硬編碼爲 65536。

<!--
## Integration with Pod security admission checks
-->
## 與 Pod 安全准入檢查的集成   {#integration-with-pod-security-admission-checks}

{{< feature-state state="alpha" for_k8s_version="v1.29" >}}

<!--
For Linux Pods that enable user namespaces, Kubernetes relaxes the application of
[Pod Security Standards](/docs/concepts/security/pod-security-standards) in a controlled way.
This behavior can be controlled by the [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/)
`UserNamespacesPodSecurityStandards`, which allows an early opt-in for end
users. Admins have to ensure that user namespaces are enabled by all nodes
within the cluster if using the feature gate.
-->
對於啓用了使用者命名空間的 Linux Pod，Kubernetes 會以受控方式放寬
[Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards)的應用。
這種行爲可以通過[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) 
`UserNamespacesPodSecurityStandards` 進行控制，可以讓最終使用者提前嘗試此特性。
如果管理員啓用此特性門控，必須確保羣集中的所有節點都啓用了使用者命名空間。

<!--
If you enable the associated feature gate and create a Pod that uses user
namespaces, the following fields won't be constrained even in contexts that enforce the
_Baseline_ or _Restricted_ pod security standard. This behavior does not
present a security concern because `root` inside a Pod with user namespaces
actually refers to the user inside the container, that is never mapped to a
privileged user on the host. Here's the list of fields that are **not** checks for Pods in those
circumstances:
-->
如果你啓用相關特性門控並創建了使用使用者命名空間的 Pod，以下的字段不會被限制，
即使在執行了 **Baseline** 或 **Restricted** Pod 安全性標準的上下文中。這種行爲不會帶來安全問題，
因爲帶有使用者命名空間的 Pod 內的 `root` 實際上指的是容器內的使用者，絕不會映射到主機上的特權使用者。
以下是在這種情況下**不進行**檢查的 Pod 字段列表：

- `spec.securityContext.runAsNonRoot`
- `spec.containers[*].securityContext.runAsNonRoot`
- `spec.initContainers[*].securityContext.runAsNonRoot`
- `spec.ephemeralContainers[*].securityContext.runAsNonRoot`
- `spec.securityContext.runAsUser`
- `spec.containers[*].securityContext.runAsUser`
- `spec.initContainers[*].securityContext.runAsUser`

<!--
## Limitations
-->
## 限制 {#limitations}

<!--
When using a user namespace for the pod, it is disallowed to use other host
namespaces. In particular, if you set `hostUsers: false` then you are not
allowed to set any of:

 * `hostNetwork: true`
 * `hostIPC: true`
 * `hostPID: true`
-->
當 Pod 使用使用者命名空間時，不允許 Pod 使用其他主機命名空間。
特別是，如果你設置了 `hostUsers: false`，那麼你就不可以設置如下屬性：

* `hostNetwork: true`
* `hostIPC: true`
* `hostPID: true`

<!--
No container can use `volumeDevices` (raw block volumes, like /dev/sda) either.
This includes all the container arrays in the pod spec:
 * `containers`
 * `initContainers`
 * `ephemeralContainers`
-->
任何容器都不能使用 `volumeDevices`（原始塊設備卷，例如 /dev/sda）。
這包括 Pod 規約中的所有容器數組：
 * `containers`
 * `initContainers`
 * `ephemeralContainers`

<!--
## Metrics and observability

The kubelet exports two prometheus metrics specific to user-namespaces:
* `started_user_namespaced_pods_total`: a counter that tracks the number of user namespaced pods that are attempted to be created.
* `started_user_namespaced_pods_errors_total`: a counter that tracks the number of errors creating user namespaced pods.
-->
## 指標與可觀測性

kubelet 會導出兩項與使用者命名空間相關的 Prometheus 指標：
 * `started_user_namespaced_pods_total`：這個計數器跟蹤嘗試創建的、作用域爲使用者命名空間的 Pod 數量。
 * `started_user_namespaced_pods_errors_total`：這個計數器跟蹤創建作用域爲使用者命名空間的 Pod 時發生的錯誤次數。

## {{% heading "whatsnext" %}}

<!--
* Take a look at [Use a User Namespace With a Pod](/docs/tasks/configure-pod-container/user-namespaces/)
-->
* 查閱[爲 Pod 設定使用者命名空間](/zh-cn/docs/tasks/configure-pod-container/user-namespaces/)
