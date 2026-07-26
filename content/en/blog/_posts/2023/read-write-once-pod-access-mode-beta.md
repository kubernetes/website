---
layout: blog
title: "Kubernetes 1.27: Single Pod Access Mode for PersistentVolumes Graduates to Beta"
date: 2023-04-20
slug: read-write-once-pod-access-mode-beta
author: >
   Chris Henzie (Google)
---

With the release of Kubernetes v1.27 the ReadWriteOncePod feature has graduated
to beta. In this blog post, we'll take a closer look at this feature, what it
does, and how it has evolved in the beta release.

## What is ReadWriteOncePod?

ReadWriteOncePod is a new access mode for
[PersistentVolumes](/docs/concepts/storage/persistent-volumes/#persistent-volumes) (PVs)
and [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVCs)
introduced in Kubernetes v1.22. This access mode enables you to restrict volume
access to a single pod in the cluster, ensuring that only one pod can write to
the volume at a time. This can be particularly useful for stateful workloads
that require single-writer access to storage.

For more context on access modes and how ReadWriteOncePod works read
[What are access modes and why are they important?](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#what-are-access-modes-and-why-are-they-important)
in the _Introducing Single Pod Access Mode for PersistentVolumes_ article from 2021.

## Changes in the ReadWriteOncePod beta

The ReadWriteOncePod beta adds support for
[scheduler preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
of pods using ReadWriteOncePod PVCs.

Scheduler preemption allows higher-priority pods to preempt lower-priority pods,
so that they can start running on the same node. With this release, pods using
ReadWriteOncePod PVCs can also be preempted if a higher-priority pod requires
the same PVC.

## How can I start using ReadWriteOncePod?

With ReadWriteOncePod now in beta, it will be enabled by default in cluster
versions v1.27 and beyond.

Note that ReadWriteOncePod is
[only supported for CSI volumes](/docs/concepts/storage/persistent-volumes/#access-modes).
Before using this feature you will need to update the following
[CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
to these versions or greater:

- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)

To start using ReadWriteOncePod, create a PVC with the ReadWriteOncePod access mode:

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: single-writer-only
spec:
  accessModes:
  - ReadWriteOncePod # Allow only a single pod to access single-writer-only.
  resources:
    requests:
      storage: 1Gi
```

If your storage plugin supports
[dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/),
new PersistentVolumes will be created with the ReadWriteOncePod access mode applied.

Read [Migrating existing PersistentVolumes](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#migrating-existing-persistentvolumes)
for details on migrating existing volumes to use ReadWriteOncePod.

## How can I learn more?

Please see the [alpha blog post](/blog/2021/09/13/read-write-once-pod-access-mode-alpha)
and [KEP-2485](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2485-read-write-once-pod-pv-access-mode/README.md)
for more details on the ReadWriteOncePod access mode and motivations for CSI spec changes.

## How do I get involved?

The [Kubernetes #csi Slack channel](https://kubernetes.slack.com/messages/csi)
and any of the standard
[SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)
are great mediums to reach out to the SIG Storage and the CSI teams.

Special thanks to the following people whose thoughtful reviews and feedback helped shape this feature:

* Abdullah Gharaibeh (ahg-g)
* Aldo Culquicondor (alculquicondor)
* Antonio Ojea (aojea)
* David Eads (deads2k)
* Jan Šafránek (jsafrane)
* Joe Betz (jpbetz)
* Kante Yin (kerthcet)
* Michelle Au (msau42)
* Tim Bannister (sftim)
* Xing Yang (xing-yang)

If you’re interested in getting involved with the design and development of CSI
or any part of the Kubernetes storage system, join the
[Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We’re rapidly growing and always welcome new contributors.
