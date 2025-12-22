---
title: Linux 节点的安全性
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
本篇介绍特定于 Linux 操作系统的安全注意事项和最佳实践。

<!-- body -->

<!--
## Protection for Secret data on nodes
-->
## 保护节点上的 Secret 数据   {#protection-for-secret-data-on-nodes}

<!--
On Linux nodes, memory-backed volumes (such as [`secret`](/docs/concepts/configuration/secret/)
volume mounts, or [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) with `medium: Memory`)
are implemented with a `tmpfs` filesystem.
-->
在 Linux 节点上，由内存支持的卷（例如 [`secret`](/zh-cn/docs/concepts/configuration/secret/)
卷挂载，或带有 `medium: Memory` 的 [`emptyDir`](/zh-cn/docs/concepts/storage/volumes/#emptydir)）
使用 `tmpfs` 文件系统实现。

<!--
If you have swap configured and use an older Linux kernel (or a current kernel and an unsupported configuration of Kubernetes),
**memory** backed volumes can have data written to persistent storage.
-->
如果你配置了交换分区并且使用较旧的 Linux 内核（或者内核是最新的，但其中某项配置是 Kubernetes 所不支持的），
**内存**支持的卷可能会将数据写入持久存储。

<!--
The Linux kernel officially supports the `noswap` option from version 6.3,
therefore it is recommended the used kernel version is 6.3 or later,
or supports the `noswap` option via a backport, if swap is enabled on the node.
-->
Linux 内核从 6.3 版本开始正式支持 `noswap` 选项，
因此建议使用 6.3 或更新版本的内核，
或者如果节点上启用了交换分区，确保内核通过补丁向下移植支持 `noswap` 选项。

<!--
Read [swap memory management](/docs/concepts/cluster-administration/swap-memory-management/#memory-backed-volumes)
for more info.
-->
更多信息参阅[交换内存管理](/zh-cn/docs/concepts/cluster-administration/swap-memory-management/#memory-backed-volumes)。
