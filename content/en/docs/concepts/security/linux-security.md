---
reviewers:
- lmktfy
title: Security For Linux Nodes
content_type: concept
weight: 40
---

<!-- overview -->

This page describes security considerations and best practices specific to the Linux operating system.

<!-- body -->

## Protection for Secret data on nodes

On Linux nodes, memory-backed volumes (such as [`secret`](/docs/concepts/configuration/secret/)
volume mounts, or [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) with `medium: Memory`)
are implemented with a `tmpfs` filesystem.

The Linux kernel officially supports the `noswap` option from version 6.3,
therefore it is recommended the used kernel version is 6.3 or later,
or supports the `noswap` option via a backport, if swap is enabled on the node.

Please check [this documentation](docs/concepts/cluster-administration/swap-memory-management.md#memory-backed-volumes)
for more info.