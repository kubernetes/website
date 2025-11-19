---
title: Linux 節點的安全性
content_type: concept
weight: 40
---
<!--
reviewers:
- lmktfy
title: Security For Linux Nodes
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This page describes security considerations and best practices specific to the Linux operating system.
-->
本篇介紹特定於 Linux 操作系統的安全注意事項和最佳實踐。

<!-- body -->

<!--
## Protection for Secret data on nodes
-->
## 保護節點上的 Secret 數據   {#protection-for-secret-data-on-nodes}

<!--
On Linux nodes, memory-backed volumes (such as [`secret`](/docs/concepts/configuration/secret/)
volume mounts, or [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) with `medium: Memory`)
are implemented with a `tmpfs` filesystem.
-->
在 Linux 節點上，由內存支持的卷（例如 [`secret`](/zh-cn/docs/concepts/configuration/secret/)
卷掛載，或帶有 `medium: Memory` 的 [`emptyDir`](/zh-cn/docs/concepts/storage/volumes/#emptydir)）
使用 `tmpfs` 文件系統實現。

<!--
If you have swap configured and use an older Linux kernel (or a current kernel and an unsupported configuration of Kubernetes),
**memory** backed volumes can have data written to persistent storage.
-->
如果你設定了交換分區並且使用較舊的 Linux 內核（或者內核是最新的，但其中某項設定是 Kubernetes 所不支持的），
**內存**支持的卷可能會將數據寫入持久存儲。

<!--
The Linux kernel officially supports the `noswap` option from version 6.3,
therefore it is recommended the used kernel version is 6.3 or later,
or supports the `noswap` option via a backport, if swap is enabled on the node.
-->
Linux 內核從 6.3 版本開始正式支持 `noswap` 選項，
因此建議使用 6.3 或更新版本的內核，
或者如果節點上啓用了交換分區，確保內核通過補丁向下移植支持 `noswap` 選項。

<!--
Read [swap memory management](/docs/concepts/cluster-administration/swap-memory-management/#memory-backed-volumes)
for more info.
-->
更多信息參閱[交換內存管理](/zh-cn/docs/concepts/cluster-administration/swap-memory-management/#memory-backed-volumes)。
