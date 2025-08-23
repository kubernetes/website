---
layout: blog
title: "Kubernetes v1.34: Moving Volume Group Snapshots to v1beta2"
draft: true
date: 2025-XX-XX
slug: kubernetes-v1-34-volume-group-snapshot-beta-2
author: >
   Xing Yang (VMware by Broadcom)
---

Volume group snapshots were [introduced](/blog/2023/05/08/kubernetes-1-27-volume-group-snapshot-alpha/)
as an Alpha feature with the Kubernetes 1.27 release and moved to [Beta](/blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/) in the Kubernetes 1.32 release.
The recent release of Kubernetes v1.34 moved that support to a second beta.
The support for volume group snapshots relies on a set of
[extension APIs for group snapshots](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis).
These APIs allow users to take crash consistent snapshots for a set of volumes.
Behind the scenes, Kubernetes uses a label selector to group multiple PersistentVolumeClaims
for snapshotting.
A key aim is to allow you restore that set of snapshots to new volumes and
recover your workload based on a crash consistent recovery point.

This new feature is only supported for [CSI](https://kubernetes-csi.github.io/docs/) volume drivers.

## What's new in Beta 2?

While testing the beta version, we encountered an [issue](https://github.com/kubernetes-csi/external-snapshotter/issues/1271) where the `restoreSize` field is not set for individual VolumeSnapshotContents and VolumeSnapshots if CSI driver does not implement the ListSnapshots RPC call.
We evaluated various options [here](https://docs.google.com/document/d/1LLBSHcnlLTaP6ZKjugtSGQHH2LGZPndyfnNqR1YvzS4/edit?tab=t.0) and decided to make this change releasing a new beta for the API.

Specifically, a VolumeSnapshotInfo struct is added in v1beta2, it contains information for an individual volume snapshot that is a member of a volume group snapshot.
VolumeSnapshotInfoList, a list of VolumeSnapshotInfo, is added to VolumeGroupSnapshotContentStatus, replacing VolumeSnapshotHandlePairList.
VolumeSnapshotInfoList is a list of snapshot information returned by the CSI driver to identify snapshots on the storage system.
VolumeSnapshotInfoList is populated by the csi-snapshotter sidecar based on the CSI CreateVolumeGroupSnapshotResponse returned by the CSI driver's CreateVolumeGroupSnapshot call.

The existing v1beta1 API objects will be converted to the new v1beta2 API objects by a conversion webhook.

## What’s next?

Depending on feedback and adoption, the Kubernetes project plans to push the volume
group snapshot implementation to general availability (GA) in a future release.

## How can I learn more?

- The [design spec](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)
  for the volume group snapshot feature.
- The [code repository](https://github.com/kubernetes-csi/external-snapshotter) for volume group
  snapshot APIs and controller.
- CSI [documentation](https://kubernetes-csi.github.io/docs/) on the group snapshot feature.

## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors
from diverse backgrounds working together. On behalf of SIG Storage, I would like to
offer a huge thank you to the contributors who stepped up these last few quarters
to help the project reach beta:

* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Madhu Rajanna ([Madhu-1](https://github.com/Madhu-1))
* Michelle Au ([msau42](https://github.com/msau42))
* Niels de Vos ([nixpanic](https://github.com/nixpanic))
* Leonardo Cecchi ([leonardoce](https://github.com/leonardoce))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))

For those interested in getting involved with the design and development of CSI or
any part of the Kubernetes Storage system, join the
[Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We always welcome new contributors.

We also hold regular [Data Protection Working Group meetings](https://github.com/kubernetes/community/tree/master/wg-data-protection).
New attendees are welcome to join our discussions.
