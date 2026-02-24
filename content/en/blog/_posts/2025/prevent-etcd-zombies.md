---
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
---

*This article is a mirror of an [original](https://etcd.io/blog/2025/zombie_members_upgrade/) that was recently published to the official etcd blog*.
The [key takeaway](https://etcd.io/blog/2025/zombie_members_upgrade/#key-takeaway)?
Always upgrade to etcd v3.5.26 or later before moving to v3.6. This ensures your cluster is automatically repaired, and avoids zombie members.

## Issue summary

Recently, the etcd community addressed an issue that may appear when users [upgrade from v3.5 to v3.6].  This bug can cause the cluster to report "zombie members", which are etcd nodes that were removed from the database cluster some time ago, and are re-appearing and joining database consensus.  The etcd cluster is then inoperable until these zombie members are removed.

In etcd v3.5 and earlier, the v2store was the source of truth for membership data, even though the v3store was also present. As a part of our [v2store deprecation plan], in v3.6 the v3store is the source of truth for cluster membership. Through a [bug report] we found out that, in some older clusters, v2store and v3store could become inconsistent.  This inconsistency manifests after upgrading as seeing old, removed "zombie" cluster members re-appearing in the cluster.

## The fix and upgrade path

We’ve added a [mechanism in etcd v3.5.26] to automatically sync v3store from v2store, ensuring that affected clusters are repaired before upgrading to 3.6.x.

To support the many users currently upgrading to 3.6, we have provided the following safe upgrade path:

1. Upgrade your cluster to [v3.5.26] or later.
2. Wait and confirm that all members are healthy post-update.
3. Upgrade to v3.6.

We are unable to provide a safe workaround path for users who have some obstacle preventing updating to v3.5.26.  As such, if v3.5.26 is not available from your packaging source or vendor, you should delay upgrading to v3.6 until it is.

## Additional technical detail

**Information below is offered for reference only.  Users can follow the safe upgrade path without knowledge of the following details.**

This issue is encountered with clusters that have been running in production on etcd v3.5.25 or earlier.  It is a side effect of adding and removing members from the cluster, or recovering the cluster from failure.  This means that the issue is more likely the older the etcd cluster is, but it cannot be ruled out for any user regardless of the age of the cluster.

etcd maintainers, working with issue reporters, have found three possible triggers for the issue based on symptoms and an analysis of etcd code and logs:

1. **Bug in `etcdctl snapshot restore` (v3.4 and old versions)**: When restoring a snapshot using `etcdctl snapshot restore`, etcdctl was supposed to remove existing members before adding the new ones. In v3.4, due to a bug, old members were not removed, resulting in zombie members. Refer to the [comment on etcdctl].
2. **`--force-new-cluster` in v3.5 and earlier versions**: In rare cases, forcibly creating a new single-member cluster did not fully remove old members, leaving zombies. The issue was [resolved](https://github.com/etcd-io/etcd/pull/20339) in v3.5.22. Please refer to [this PR](https://github.com/etcd-io/raft/pull/300) in the Raft project for detailed technical information.
3. **--unsafe-no-sync enabled**: If `--unsafe-no-sync` is enabled, in rare cases etcd might persist a membership change to v3store but crash before writing it to the WAL, causing inconsistency between v2store and v3store. This is a problem for single-member clusters. For multi-member clusters, forcibly creating a new single-member cluster from the crashed node’s data may lead to zombie members.

{{% alert title="Note" color="info" %}}
`--unsafe-no-sync` is generally not recommended, as it may break the guarantees given by the consensus protocol.
{{% /alert %}}

Importantly, there may be other triggers for v2store and v3store membership data becoming inconsistent that we have not yet found.  This means that you cannot assume that you are safe just because you have not performed any of the three actions above.
Once users are upgraded to etcd v3.6, v3store becomes the source of membership data, and further inconsistency is not possible.

Advanced users who want to verify the consistency between v2store and v3store can follow the steps described in this [comment].   This check is not required to fix the issue, nor does SIG etcd recommend bypassing the v3.5.26 update regardless of the results of the check.

## Key takeaway

Always upgrade to [v3.5.26] or later before moving to v3.6. This ensures your cluster is automatically repaired and avoids zombie members.

## Acknowledgements

We would like to thank [Christian Baumann] for reporting this long-standing upgrade issue. His report and follow-up work helped bring the issue to our attention so that we could investigate and resolve it upstream.

[upgrade from v3.5 to v3.6]: https://etcd.io/docs/v3.6/upgrades/upgrade_3_6/
[v2store deprecation plan]: https://github.com/etcd-io/etcd/issues/12913
[bug report]: https://github.com/etcd-io/etcd/issues/20967
[mechanism in etcd v3.5.26]: https://github.com/etcd-io/etcd/pull/20995
[v3.5.26]: https://github.com/etcd-io/etcd/releases/tag/v3.5.26
[comment on etcdctl]: https://github.com/etcd-io/etcd/issues/20967#issuecomment-3618010356
[Christian Baumann]: https://github.com/thechristschn
[comment]: https://github.com/etcd-io/etcd/issues/20967#issuecomment-3590609775
