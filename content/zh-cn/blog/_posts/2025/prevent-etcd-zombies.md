---
layout: blog
summary: >
  SIG-etcd 已修复了一个可能阻碍从 v3.5 升级到 v3.6 的问题。
  如果你要升级，务必先升级到 etcd v3.5.26 或更高版本。
title: "避免升级到 etcd v3.6 时出现僵尸集群成员"
date: 2025-12-21
canonicalUrl: https://etcd.io/blog/2025/zombie_members_upgrade/
slug: preventing-etcd-zombies
author: >
  [Benjamin Wang](https://github.com/ahrtr)（VMware by Broadcom），
  [Josh Berkus](https://github.com/jberkus)（Red Hat）
---

<!--
layout: blog
summary: >
  The key takeaway? Always upgrade to etcd v3.5.26 or later before moving to v3.6.
  This ensures your cluster is automatically repaired, and avoids zombie members.
title: "Avoiding Zombie Cluster Members When Upgrading to etcd v3.6"
date: 2025-12-21
canonicalUrl: https://etcd.io/blog/2025/zombie_members_upgrade/
slug: preventing-etcd-zombies
author: >
  [Benjamin Wang](https://github.com/ahrtr) VMware by Broadcom,
  [Josh Berkus](https://github.com/jberkus) Red Hat
-->

<!--
*This article is a mirror of an [original](https://etcd.io/blog/2025/zombie_members_upgrade/) that was recently published to the official etcd blog*.
-->
*本文是对近期发布在官方 etcd 博客[原文](https://etcd.io/blog/2025/zombie_members_upgrade/)的镜像转载。*

<!--
The [key takeaway](https://etcd.io/blog/2025/zombie_members_upgrade/#key-takeaway)?
Always upgrade to etcd v3.5.26 or later before moving to v3.6. This ensures your cluster is automatically repaired, and avoids zombie members.
-->
[关键信息](https://etcd.io/blog/2025/zombie_members_upgrade/#key-takeaway)：
升级到 v3.6 之前，务必先升级到 etcd v3.5.26 或更高版本。这样能自动修复集群，避免僵尸成员问题。

<!--
## Issue summary
-->
## 问题概述

<!--
Recently, the etcd community addressed an issue that may appear when users [upgrade from v3.5 to v3.6].  This bug can cause the cluster to report "zombie members", which are etcd nodes that were removed from the database cluster some time ago, and are re-appearing and joining database consensus.  The etcd cluster is then inoperable until these zombie members are removed.
-->
最近，etcd 社区解决了一个升级时可能出现的问题：当用户[从 v3.5 升级到 v3.6][upgrade from v3.5 to v3.6] 时，集群可能会出现“僵尸成员”。这些僵尸成员是之前从数据库集群中移除的 etcd 节点，却又重新出现并加入数据库共识。集群会因此无法正常工作，直到这些僵尸成员被再次移除。

<!--
In etcd v3.5 and earlier, the v2store was the source of truth for membership data, even though the v3store was also present. As a part of our [v2store deprecation plan], in v3.6 the v3store is the source of truth for cluster membership. Through a [bug report] we found out that, in some older clusters, v2store and v3store could become inconsistent.  This inconsistency manifests after upgrading as seeing old, removed "zombie" cluster members re-appearing in the cluster.
-->
在 etcd v3.5 及以前版本，尽管 v3store 已存在，但集群成员数据的权威来源仍是 v2store。作为 [v2store 废弃计划][v2store deprecation plan]的一部分，从 v3.6 开始，集群成员数据的权威来源变为 v3store。通过一次 [bug 报告][bug report]，我们发现部分老集群中 v2store 和 v3store 可能不一致。这种不一致在升级后会表现为旧的、已移除的“僵尸”成员重新出现在集群中。

<!--
## The fix and upgrade path
-->
## 解决方案和升级路径

<!--
We’ve added a [mechanism in etcd v3.5.26] to automatically sync v3store from v2store, ensuring that affected clusters are repaired before upgrading to 3.6.x.
-->
etcd v3.5.26 已引入[自动同步机制][mechanism in etcd v3.5.26]，会将 v2store 中的成员信息同步到 v3store，确保受影响的集群在升级到 3.6.x 之前得到修复。

<!--
To support the many users currently upgrading to 3.6, we have provided the following safe upgrade path:
-->
为了支持大量正在升级到 3.6 的用户，我们建议采用以下安全升级路径：

<!--
1. Upgrade your cluster to [v3.5.26] or later.
2. Wait and confirm that all members are healthy post-update.
3. Upgrade to v3.6.
-->
1. 先将集群升级到 [v3.5.26][v3.5.26] 或更高版本。
2. 等待并确认升级后所有成员状态健康。
3. 再升级到 v3.6。

<!--
We are unable to provide a safe workaround path for users who have some obstacle preventing updating to v3.5.26.  As such, if v3.5.26 is not available from your packaging source or vendor, you should delay upgrading to v3.6 until it is.
-->
如果你由于某些限制无法升级到 v3.5.26，我们目前无法提供同等安全的替代路径。因此，如果你的包源或供应商尚未提供 v3.5.26，建议暂缓升级到 v3.6。

<!--
## Additional technical detail
-->
## 额外技术细节

<!--
**Information below is offered for reference only.  Users can follow the safe upgrade path without knowledge of the following details.**
-->
**以下信息仅供参考。即使不了解这些技术细节，也可以按前述安全路径完成升级。**

<!--
This issue is encountered with clusters that have been running in production on etcd v3.5.25 or earlier.  It is a side effect of adding and removing members from the cluster, or recovering the cluster from failure.  This means that the issue is more likely the older the etcd cluster is, but it cannot be ruled out for any user regardless of the age of the cluster.
-->
该问题主要出现在长期运行 etcd v3.5.25 或更早版本的生产集群中。它是集群增删成员或故障恢复过程中的副作用。这意味着集群越老，出现问题的概率通常越高；但无论集群新旧，都不能完全排除风险。

<!--
etcd maintainers, working with issue reporters, have found three possible triggers for the issue based on symptoms and an analysis of etcd code and logs:
-->
etcd 维护者与问题报告者在分析症状、代码和日志后，总结了三个可能触发条件：

<!--
1. **Bug in `etcdctl snapshot restore` (v3.4 and old versions)**: When restoring a snapshot using `etcdctl snapshot restore`, etcdctl was supposed to remove existing members before adding the new ones. In v3.4, due to a bug, old members were not removed, resulting in zombie members. Refer to the [comment on etcdctl].
-->
1. **`etcdctl snapshot restore` 的 bug（v3.4 及更早版本）**：使用 `etcdctl snapshot restore` 恢复快照时，etcdctl 本应先移除旧成员再添加新成员。v3.4 中由于 bug，旧成员未被移除，从而产生僵尸成员。详见 [etcdctl 相关评论][comment on etcdctl]。

<!--
2. **`--force-new-cluster` in v3.5 and earlier versions**: In rare cases, forcibly creating a new single-member cluster did not fully remove old members, leaving zombies. The issue was [resolved](https://github.com/etcd-io/etcd/pull/20339) in v3.5.22. Please refer to [this PR](https://github.com/etcd-io/raft/pull/300) in the Raft project for detailed technical information.
-->
2. **v3.5 及更早版本中使用 `--force-new-cluster`**：在极少数情况下，强制创建新的单成员集群时未能彻底移除旧成员，导致僵尸成员残留。该问题已在 v3.5.22 [修复](https://github.com/etcd-io/etcd/pull/20339)。更多技术细节可参考 Raft 项目的 [PR](https://github.com/etcd-io/raft/pull/300)。

<!--
3. **--unsafe-no-sync enabled**: If `--unsafe-no-sync` is enabled, in rare cases etcd might persist a membership change to v3store but crash before writing it to the WAL, causing inconsistency between v2store and v3store. This is a problem for single-member clusters. For multi-member clusters, forcibly creating a new single-member cluster from the crashed node’s data may lead to zombie members.
-->
3. **启用 `--unsafe-no-sync`**：启用该参数时，在极少数情况下 etcd 可能已将成员变更写入 v3store，但在写入 WAL 之前崩溃，从而导致 v2store 与 v3store 不一致。这对单成员集群影响更大；多成员集群若从崩溃节点数据强制创建单成员集群，也可能引入僵尸成员。

{{% alert title="Note" color="info" %}}
<!--
`--unsafe-no-sync` is generally not recommended, as it may break the guarantees given by the consensus protocol.
-->
`--unsafe-no-sync` 一般不推荐使用，因为它可能破坏共识协议所提供的保证。
{{% /alert %}}

<!--
Importantly, there may be other triggers for v2store and v3store membership data becoming inconsistent that we have not yet found.  This means that you cannot assume that you are safe just because you have not performed any of the three actions above.
Once users are upgraded to etcd v3.6, v3store becomes the source of membership data, and further inconsistency is not possible.
-->
需要强调的是，除了以上三种情况外，可能还存在我们尚未发现的其他触发因素，导致 v2store 与 v3store 成员数据不一致。因此，不能因为“没有执行上述三种操作”就认为一定安全。升级到 etcd v3.6 后，v3store 成为成员数据唯一权威来源，这类不一致问题将不再发生。

<!--
Advanced users who want to verify the consistency between v2store and v3store can follow the steps described in this [comment].   This check is not required to fix the issue, nor does SIG etcd recommend bypassing the v3.5.26 update regardless of the results of the check.
-->
想要验证 v2store 和 v3store 一致性的高级用户，可以参考这条[评论][comment]中的步骤。该检测不是修复问题的必要条件，且无论检测结果如何，SIG etcd 都不建议跳过 v3.5.26 这一步升级。

<!--
## Key takeaway
-->
## 关键要点

<!--
Always upgrade to [v3.5.26] or later before moving to v3.6. This ensures your cluster is automatically repaired and avoids zombie members.
-->
升级到 v3.6 之前，务必先升级到 [v3.5.26][v3.5.26] 或更高版本。这样可以自动修复集群并避免僵尸成员问题。

<!--
## Acknowledgements
-->
## 致谢

<!--
We would like to thank [Christian Baumann] for reporting this long-standing upgrade issue. His report and follow-up work helped bring the issue to our attention so that we could investigate and resolve it upstream.
-->
感谢 [Christian Baumann][Christian Baumann] 报告了这一长期存在的升级问题。他的反馈和后续工作帮助我们及时定位并在上游完成修复。

<!--
[upgrade from v3.5 to v3.6]: https://etcd.io/docs/v3.6/upgrades/upgrade_3_6/
[v2store deprecation plan]: https://github.com/etcd-io/etcd/issues/12913
[bug report]: https://github.com/etcd-io/etcd/issues/20967
[mechanism in etcd v3.5.26]: https://github.com/etcd-io/etcd/pull/20995
[v3.5.26]: https://github.com/etcd-io/etcd/releases/tag/v3.5.26
[comment on etcdctl]: https://github.com/etcd-io/etcd/issues/20967#issuecomment-3618010356
[Christian Baumann]: https://github.com/thechristschn
[comment]: https://github.com/etcd-io/etcd/issues/20967#issuecomment-3590609775
-->

## 参考资料

1. 升级指南（v3.5 -> v3.6）：<https://etcd.io/docs/v3.6/upgrades/upgrade_3_6/>
2. v2store 废弃计划：<https://github.com/etcd-io/etcd/issues/12913>
3. Bug 报告：<https://github.com/etcd-io/etcd/issues/20967>
4. v3.5.26 自动同步机制：<https://github.com/etcd-io/etcd/pull/20995>
5. v3.5.26 版本发布：<https://github.com/etcd-io/etcd/releases/tag/v3.5.26>
6. etcdctl 相关评论：[1] <https://github.com/etcd-io/etcd/issues/20967#issuecomment-3618010356>
7. Raft 项目 PR：[2] <https://github.com/etcd-io/raft/pull/300>
8. 一致性检查评论：[3] <https://github.com/etcd-io/etcd/issues/20967#issuecomment-3590609775>
9. Christian Baumann：<https://github.com/thechristschn>

[upgrade from v3.5 to v3.6]: https://etcd.io/docs/v3.6/upgrades/upgrade_3_6/
[v2store deprecation plan]: https://github.com/etcd-io/etcd/issues/12913
[bug report]: https://github.com/etcd-io/etcd/issues/20967
[mechanism in etcd v3.5.26]: https://github.com/etcd-io/etcd/pull/20995
[v3.5.26]: https://github.com/etcd-io/etcd/releases/tag/v3.5.26
[comment on etcdctl]: https://github.com/etcd-io/etcd/issues/20967#issuecomment-3618010356
[Christian Baumann]: https://github.com/thechristschn
[comment]: https://github.com/etcd-io/etcd/issues/20967#issuecomment-3590609775
