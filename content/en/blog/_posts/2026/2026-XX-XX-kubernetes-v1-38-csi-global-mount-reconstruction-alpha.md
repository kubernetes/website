---
layout: blog
title: "Kubernetes v1.38: Kubelet Recovers Orphaned CSI Global Mounts (Alpha)"
draft: true
date: 2026-XX-XX
slug: kubernetes-v1-38-csi-global-mount-reconstruction-alpha
author: "Cesar Celis (CCH Software Inc.)"
---

After a kubelet restart or a node reboot, kubelet can report a CSI volume as unused while it is
still staged on the node. The attach/detach controller then attaches it to another node, and two
nodes write to the same device.

Kubernetes v1.38 adds the `CSIGlobalMountReconstruction` feature gate (alpha, off by default).
With it, kubelet finds these volumes on its own and unstages them.

<!-- TODO(@cniackz): content by feature owner. -->

## How a volume gets lost

A drain finishes once every pod has finished `NodeUnpublishVolume`. If the node reboots before
`NodeUnstageVolume` finishes, the global mount stays, and no pod directory names it.

<!-- TODO: the second route, an unreadable pod-local vol_data.json (#101791). Issues #121937 and #101791. -->

## What changes in v1.38

Reconstruction no longer starts only from `/var/lib/kubelet/pods`. It also walks the CSI plugin
directory on the node (`/var/lib/kubelet/plugins/kubernetes.io/csi/`), and sends each global mount
it finds down the normal unmount path.

<!-- TODO: what kubelet reports in node.status.volumesInUse, and that no CSI driver change is needed. -->

## What alpha does not cover

If both copies of `vol_data.json` are lost, nothing on disk names the volume, and it still needs
manual cleanup.

<!-- TODO: in-tree FibreChannel and iSCSI, and the reboot limit of the pod-local fallback. -->

## Try it

Enable `CSIGlobalMountReconstruction` on the kubelet.

<!-- TODO: a reproduction on kind, with the commands and their output. -->

## Getting involved

This work belongs to SIG Storage, with SIG Node. The design is in
[KEP-6058](https://github.com/kubernetes/enhancements/issues/6058).

<!-- TODO: SIG Storage meeting and Slack channel links. -->
