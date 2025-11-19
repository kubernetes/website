---
layout: blog
title: "Kubernetes 1.27：高效的 SELinux 卷重新標記（Beta 版）"
date: 2023-04-18T10:00:00-08:00
slug: kubernetes-1-27-efficient-selinux-relabeling-beta
---

<!--
layout: blog
title: "Kubernetes 1.27: Efficient SELinux volume relabeling (Beta)"
date: 2023-04-18T10:00:00-08:00
slug: kubernetes-1-27-efficient-selinux-relabeling-beta
-->

**作者**：Jan Šafránek (Red Hat)
<!--
**Author:** Jan Šafránek (Red Hat)
-->

**譯者**：Wilson Wu (DaoCloud)

<!--
## The problem
-->
## 問題 {#the-problem}

<!--
On Linux with Security-Enhanced Linux (SELinux) enabled, it's traditionally the container runtime that applies SELinux labels to a Pod and all its volumes. Kubernetes only passes the SELinux label from a Pod's `securityContext` fields to the container runtime.
-->
在啓用了 Security-Enhancled Linux（SELinux）系統上，傳統做法是讓容器運行時負責爲
Pod 及所有卷應用 SELinux 標籤。
Kubernetes 僅將 SELinux 標籤從 Pod 的 `securityContext` 字段傳遞給容器運行時。

<!--
The container runtime then recursively changes SELinux label on all files that are visible to the Pod's containers. This can be time-consuming if there are many files on the volume, especially when the volume is on a remote filesystem.
-->
然後，容器運行時以遞歸的方式更改 Pod 容器可見的所有文件上的 SELinux 標籤。
如果捲上有許多文件，這一過程可能會非常耗時，尤其是當卷位於遠程文件系統上時。

{{% alert title="Note" color="info" %}}
<!--
If a container uses `subPath` of a volume, only that `subPath` of the whole volume is relabeled. This allows two pods that have two different SELinux labels to use the same volume, as long as they use different subpaths of it.
-->
如果容器使用卷的 `subPath`，則系統僅重新標記整個卷的 `subPath`。
這樣，使用不同 SELinux 標籤的兩個 Pod 可以使用同一卷，只要它們使用該卷的不同子路徑即可。
{{% /alert %}}

<!--
If a Pod does not have any SELinux label assigned in Kubernetes API, the container runtime assigns a unique random one, so a process that potentially escapes the container boundary cannot access data of any other container on the host. The container runtime still recursively relabels all pod volumes with this random SELinux label.
-->
如果 Pod 沒有從 Kubernetes API 中獲得任何 SELinux 標籤，則容器運行時會分配一個唯一的隨機標籤，
因此可能逃離容器邊界的進程將無法訪問主機上任何其他容器的數據。
容器運行時仍然使用此隨機 SELinux 標籤遞歸地重新標記所有 Pod 卷。

<!--
## Improvement using mount options
-->
## 使用掛載選項進行改進 {#improvement-using-mount-options}

<!--
If a Pod and its volume meet **all** of the following conditions, Kubernetes will _mount_ the volume directly with the right SELinux label. Such mount will happen in a constant time and the container runtime will not need to recursively relabel any files on it.
-->
如果 Pod 及其卷滿足以下所有條件，Kubernetes 將直接使用正確的 SELinux 標籤掛載該卷。
這種掛載將在確定時間內完成，容器運行時不需要遞歸地重新標記其上的任何文件。

<!--
1. The operating system must support SELinux.

   Without SELinux support detected, kubelet and the container runtime do not do anything with regard to SELinux.
-->
1. 操作系統必須支持 SELinux。

   如果沒有檢測到 SELinux 支持，kubelet 和容器運行時不會對 SELinux 執行任何操作。

<!--
1. The [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `ReadWriteOncePod` and `SELinuxMountReadWriteOncePod` must be enabled. These feature gates are Beta in Kubernetes 1.27 and Alpha in 1.25.

   With any of these feature gates disabled, SELinux labels will be always applied by the container runtime by a recursive walk through the volume (or its subPaths).
-->
2. 必須啓用[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
   `ReadWriteOncePod` 和 `SELinuxMountReadWriteOncePod`。這些特性門控在 Kubernetes 1.27 中是 Beta 版，在 1.25 中是 Alpha 版。

   禁用這些功能中任何一個後，SELinux 標籤將始終由容器運行時通過遞歸遍歷卷（或其 subPath）來應用。

<!--
1. The Pod must have at least `seLinuxOptions.level` assigned in its [Pod Security Context](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) or all Pod containers must have it set in their [Security Contexts](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1). Kubernetes will read the default `user`, `role` and `type` from the operating system defaults (typically `system_u`, `system_r` and `container_t`).

   Without Kubernetes knowing at least the SELinux `level`, the container runtime will assign a random one _after_ the volumes are mounted. The container runtime will still relabel the volumes recursively in that case.
-->
3. Pod 必須在其 [Pod 安全上下文](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)中至少設置
   `seLinuxOptions.level`，或者所有 Pod 容器必須在[安全上下文](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)中對其進行設置。
   否則 Kubernetes 將從操作系統默認值（通常是 `system_u`、`system_r` 和 `container_t`）中讀取默認的 `user`、`role` 和 `type`。

   如果 Kubernetes 不瞭解任何 SELinux `level`，容器運行時將在卷掛載**後**爲其分配一個隨機級別。
   在這種情況下，容器運行時仍會遞歸地對捲進行重新標記。

<!--
1. The volume must be a Persistent Volume with [Access Mode](/docs/concepts/storage/persistent-volumes/#access-modes) `ReadWriteOncePod`.

   This is a limitation of the initial implementation. As described above, two Pods can have a different SELinux label and still use the same volume, as long as they use a different `subPath` of it. This use case is not possible when the volumes are _mounted_ with the SELinux label, because the whole volume is mounted and most filesystems don't support mounting a single volume multiple times with multiple SELinux labels.

   If running two Pods with two different SELinux contexts and using different `subPaths` of the same volume is necessary in your deployments, please comment in the [KEP](https://github.com/kubernetes/enhancements/issues/1710) issue (or upvote any existing comment - it's best not to duplicate). Such pods may not run when the feature is extended to cover all volume access modes.
-->
4. 存儲卷必須是[訪問模式](/zh-cn/docs/concepts/storage/persistent-volumes/#access-modes) 
   爲 `ReadWriteOncePod` 的持久卷。

   這是最初的實現的限制。如上所述，兩個 Pod 可以具有不同的 SELinux 標籤，但仍然使用相同的卷，
   只要它們使用不同的 `subPath` 即可。對於**已掛載的**帶有 SELinux 標籤的卷，此場景是無法支持的，
   因爲整個卷已掛載，並且大多數文件系統不支持使用不同的 SELinux 標籤多次掛載同一個卷。

   如果在你的環境中需要使用兩個不同的 SELinux 上下文運行兩個 Pod 並使用同一卷的不同 `subPath`，
   請在 [KEP](https://github.com/kubernetes/enhancements/issues/1710) 問題中發表評論（或對任何現有評論進行投票 - 最好不要重複）。
   當此特性擴展到覆蓋所有卷訪問模式時，這類 Pod 可能無法運行。

<!--
1. The volume plugin or the CSI driver responsible for the volume supports mounting with SELinux mount options.

   These in-tree volume plugins support mounting with SELinux mount options: `fc`, `iscsi`, and `rbd`.

   CSI drivers that support mounting with SELinux mount options must announce that in their [CSIDriver](/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/) instance by setting `seLinuxMount` field.

   Volumes managed by other volume plugins or CSI drivers that don't set `seLinuxMount: true` will be recursively relabelled by the container runtime.
-->
5. 卷插件或負責卷的 CSI 驅動程序支持使用 SELinux 掛載選項進行掛載。

   這些樹內卷插件支持使用 SELinux 掛載選項進行掛載：`fc`、`iscsi` 和 `rbd`。

   支持使用 SELinux 掛載選項掛載的 CSI 驅動程序必須通過設置 `seLinuxMount`
   字段在其 [CSIDriver](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/) 實例中聲明這一點。

   由其他未設置 `seLinuxMount: true` 的卷插件或 CSI 驅動程序管理的卷將由容器運行時遞歸地重新標記。

<!--
### Mounting with SELinux context
-->
### 使用 SELinux 上下文掛載 {#mounting-with-selinux-context}

<!--
When all aforementioned conditions are met, kubelet will pass `-o context=<SELinux label>` mount option to the volume plugin or CSI driver. CSI driver vendors must ensure that this mount option is supported by their CSI driver and, if necessary, the CSI driver appends other mount options that are needed for `-o context` to work.
-->
當滿足所有上述條件時，kubelet 會將 `-o context=<SELinux label>` 掛載選項傳遞給卷插件或 CSI 驅動程序。
CSI 驅動程序提供者必須確保其 CSI 驅動程序支持此安裝選項，並且如有必要，CSI 驅動程序要附加
`-o context` 所需的其他安裝選項。

<!--
For example, NFS may need `-o context=<SELinux label>,nosharecache`, so each volume mounted from the same NFS server can have a different SELinux label value. Similarly, CIFS may need `-o context=<SELinux label>,nosharesock`.
-->
例如，NFS 可能需要 `-o context=<SELinux label>,nosharecache`，這樣來自同一
NFS 伺服器的多個卷被掛載時可以具有不同的 SELinux 標籤值。
類似地，CIFS 可能需要 `-o context=<SELinux label>,nosharesock`。

<!--
It's up to the CSI driver vendor to test their CSI driver in a SELinux enabled environment before setting `seLinuxMount: true` in the CSIDriver instance.
-->
在 CSIDriver 實例中設置 `seLinuxMount: true` 之前，CSI 驅動程序提供者需要在啓用 SELinux
的環境中測試其 CSI 驅動程序。

<!--
## How can I learn more?
-->
## 如何瞭解更多？ {#how-can-i-learn-more}

<!--
SELinux in containers: see excellent [visual SELinux guide](https://opensource.com/business/13/11/selinux-policy-guide) by Daniel J Walsh. Note that the guide is older than Kubernetes, it describes *Multi-Category Security* (MCS) mode using virtual machines as an example, however, a similar concept is used for containers.
-->
容器中的 SELinux：請參閱 Daniel J Walsh 撰寫的[可視化 SELinux 指南（英文）](https://opensource.com/business/13/11/selinux-policy-guide)。
請注意，該指南早於 Kubernetes，它以虛擬機爲例描述了**多類別安全**（MCS）模式，但是，類似的概念也適用於容器。

<!--
See a series of blog posts for details how exactly SELinux is applied to containers by container runtimes:
-->
請參閱以下系列博客文章，詳細瞭解容器運行時如何將 SELinux 應用於容器：

<!--
* [How SELinux separates containers using Multi-Level Security](https://www.redhat.com/en/blog/how-selinux-separates-containers-using-multi-level-security)
* [Why you should be using Multi-Category Security for your Linux containers](https://www.redhat.com/en/blog/why-you-should-be-using-multi-category-security-your-linux-containers)
-->
* [SELinux 如何使用多級安全性分離容器](https://www.redhat.com/en/blog/how-selinux-separates-containers-using-multi-level-security)
* [爲什麼應該爲 Linux 容器使用多類別安全性](https://www.redhat.com/en/blog/why-you-should-be-using-multi-category-security-your-linux-containers)

<!--
Read the KEP: [Speed up SELinux volume relabeling using mounts](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling)
-->
閱讀 KEP：[使用掛載加速 SELinux 卷重新標記](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling)
