---
layout: blog
title: "Kubernetes v1.28: Retroactive Default StorageClass move to GA"
date: 2023-08-18
slug: retroactive-default-storage-class-ga
author: >
  Roman Bednář (Red Hat)
---

Announcing graduation to General Availability (GA) - Retroactive Default StorageClass Assignment in Kubernetes v1.28!

Kubernetes SIG Storage team is thrilled to announce that the "Retroactive Default StorageClass Assignment" feature,
introduced as an alpha in Kubernetes v1.25, has now graduated to GA and is officially part of the Kubernetes v1.28 release.
This enhancement brings a significant improvement to how default
[StorageClasses](/docs/concepts/storage/storage-classes/) are assigned to PersistentVolumeClaims (PVCs).

With this feature enabled, you no longer need to create a default StorageClass first and then a PVC to assign the class.
Instead, any PVCs without a StorageClass assigned will now be retroactively updated to include the default StorageClass.
This enhancement ensures that PVCs no longer get stuck in an unbound state, and storage provisioning works seamlessly,
even when a default StorageClass is not defined at the time of PVC creation.

## What changed?

The PersistentVolume (PV) controller has been modified to automatically assign a default StorageClass to any unbound
PersistentVolumeClaim with the `storageClassName` not set. Additionally, the PersistentVolumeClaim
admission validation mechanism within
the API server has been adjusted to allow changing values from an unset state to an actual StorageClass name.

## How to use it?

As this feature has graduated to GA, there's no need to enable a feature gate anymore.
Simply make sure you are running Kubernetes v1.28 or later, and the feature will be available for use.

For more details, read about
[default StorageClass assignment](/docs/concepts/storage/persistent-volumes/#retroactive-default-storageclass-assignment) in the Kubernetes documentation.
You can also read the previous [blog post](/blog/2023/01/05/retroactive-default-storage-class/) announcing beta graduation in v1.26.

To provide feedback, join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
or participate in discussions on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
