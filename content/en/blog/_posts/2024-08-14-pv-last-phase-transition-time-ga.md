---
layout: blog
title: "Kubernetes v1.31: PersistentVolume Last Phase Transition Time Moves to GA"
date: 2024-08-14
slug: last-phase-transition-time-ga
author: >
  Roman Bednář (Red Hat)
---

Announcing the graduation to General Availability (GA) of the PersistentVolume `lastTransitionTime` status
field, in Kubernetes v1.31!

The Kubernetes SIG Storage team is excited to announce that the "PersistentVolumeLastPhaseTransitionTime" feature, introduced
as an alpha in Kubernetes v1.28, has now reached GA status and is officially part of the Kubernetes v1.31 release. This enhancement
helps Kubernetes users understand when a [PersistentVolume](/docs/concepts/storage/persistent-volumes/) transitions between 
different phases, allowing for more efficient and informed resource management.

For a v1.31 cluster, you can now assume that every PersistentVolume object has a
`.status.lastTransitionTime` field, that holds a timestamp of
when the volume last transitioned its phase. This change is not immediate; the new field will be populated whenever a PersistentVolume
is updated and first transitions between phases (`Pending`, `Bound`, or `Released`) after upgrading to Kubernetes v1.31.

## What changed?

The API strategy for updating PersistentVolume objects has been modified to populate the `.status.lastTransitionTime` field with the
current timestamp whenever a PersistentVolume transitions phases. Users are allowed to set this field manually if needed, but it will
be overwritten when the PersistentVolume transitions phases again.

For more details, read about
[Phase transition timestamp](/docs/concepts/storage/persistent-volumes/#phase-transition-timestamp) in the Kubernetes documentation.
You can also read the previous [blog post](/blog/2023/10/23/persistent-volume-last-phase-transition-time) announcing the feature as alpha in v1.28.

To provide feedback, join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
or participate in discussions on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
