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

Kubernetes v1.38 adds the `CSIGlobalMountReconstruction` feature gate, alpha and off by default.
With it on, kubelet finds these volumes when it starts and unstages them.

## How a volume gets lost

Kubelet lets a pod go once `NodeUnpublishVolume` succeeds. It does not wait for
`NodeUnstageVolume`. A drain only waits for pods, so the drain can finish and the node can reboot
with the unstage still in flight.

What is left is a global mount under `/var/lib/kubelet/plugins/kubernetes.io/csi/` and its
`vol_data.json`, with no pod directory that names the volume. After a restart, kubelet rebuilds
its view of mounted volumes from `/var/lib/kubelet/pods` only, so it never sees this mount. The
volume drops out of `node.status.volumesInUse`, and the attach/detach controller is free to move
it. This is [#121937](https://github.com/kubernetes/kubernetes/issues/121937).

The same orphan shows up with the pod directory still there, when the pod's own `vol_data.json`
cannot be read: a full disk at write time, a write cut short by a shutdown, or a directory cleaned
up by hand. That is [#101791](https://github.com/kubernetes/kubernetes/issues/101791), open since
2021. Until now the documented fix for both was manual cleanup.

## What changes in v1.38

With the gate on, kubelet asks each volume plugin which volumes it still has staged, and the CSI
plugin answers from its own directory. Kubelet records each one it does not already track as
uncertain, and reports it in `volumesInUse` while the node still has it attached, the same way it
treats a volume rebuilt from a pod directory. If a pod still wants the volume, kubelet verifies it. If no pod wants it, kubelet calls
`NodeUnstageVolume`, and removes the directory only after that succeeds.

When the pod-local `vol_data.json` is unreadable, kubelet reads the copy kept beside the global
mount. It finds that copy through the bind mount the pod already holds.

To make that copy enough on its own, `MountDevice` now also writes `specVolID` and
`volumeLifecycleMode` to it, whether the gate is on or not. A volume staged by an older kubelet
lacks those fields and is still recovered.

CSI drivers need no change.

## What alpha does not cover

If both copies of `vol_data.json` are lost, nothing on the node names the volume, and it still
needs manual cleanup.

The pod-local fallback needs the bind mount, so it works after a kubelet restart but not after a
reboot. After a reboot such a volume is still found by the listing and unstaged, but kubelet does not call
`NodeUnpublishVolume` for it first.

In-tree FibreChannel and iSCSI are not covered. They can join later by implementing the same
plugin call, with no change to the volume manager.

## Try it

The gate is read by the kubelet. On a kind cluster with a v1.38 node image:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  CSIGlobalMountReconstruction: true
kubeadmConfigPatches:
- |
  kind: KubeletConfiguration
  logging:
    verbosity: 2
```

The scenario to recover is a drain that interrupts unstaging: the pod is deleted, kubelet stops
after `NodeUnpublishVolume` succeeds and before `NodeUnstageVolume` finishes, and kubelet starts
again. When the gate picks up such a global mount, kubelet logs, at verbosity 2:

```
"Global mount with no pod directory is marked uncertain and added into the actual state" volumeName="kubernetes.io/csi/<driver>^<volume handle>" deviceMountPath="/var/lib/kubelet/plugins/kubernetes.io/csi/<driver>/<hash>/globalmount"
```

The driver then gets `NodeUnstageVolume`, and the `VolumeAttachment` goes away only after it
succeeds. With the gate off, the volume is detached while it is still staged.

The steps, with a mock CSI driver that delays `NodeUnstageVolume`, are in the
[KEP test plan](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/6058-csi-global-mount-fallback#e2e-tests).

## Getting involved

This work is owned by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage),
with SIG Node. The design is [KEP-6058](https://github.com/kubernetes/enhancements/issues/6058),
and the code is [#138454](https://github.com/kubernetes/kubernetes/pull/138454). The scan builds on
the approach Shivam Wayal explored in [#136771](https://github.com/kubernetes/kubernetes/pull/136771).
Feedback is welcome in `#sig-storage` on the [Kubernetes Slack](https://slack.k8s.io/) or at a SIG
Storage meeting.
