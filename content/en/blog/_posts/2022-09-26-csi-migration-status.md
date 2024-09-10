---
layout: blog
title: "Kubernetes 1.25: Kubernetes In-Tree to CSI Volume Migration Status Update"
date: 2022-09-26
slug: storage-in-tree-to-csi-migration-status-update-1.25
author: >
  Jiawei Wang (Google)
---

The Kubernetes in-tree storage plugin to [Container Storage Interface (CSI)](/blog/2019/01/15/container-storage-interface-ga/) migration infrastructure has already been [beta](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/) since v1.17. CSI migration was introduced as alpha in Kubernetes v1.14.
Since then, SIG Storage and other Kubernetes special interest groups are working to ensure feature stability and compatibility in preparation for CSI Migration feature to go GA.

SIG Storage is excited to announce that the core CSI Migration feature is **generally available** in Kubernetes v1.25 release!

SIG Storage wrote a blog post in v1.23 for [CSI Migration status update](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/) which discussed the CSI migration status for each storage driver. It has been a while and this article is intended to give a latest status update on each storage driver for their CSI Migration status in Kubernetes v1.25.

## Quick recap: What is CSI Migration, and why migrate?

The Container Storage Interface (CSI) was designed to help Kubernetes replace its existing, in-tree storage driver mechanisms - especially vendor specific plugins.
Kubernetes support for the [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md#README) has been
[generally available](/blog/2019/01/15/container-storage-interface-ga/) since Kubernetes v1.13.
Support for using CSI drivers was introduced to make it easier to add and maintain new integrations between Kubernetes and storage backend technologies. Using CSI drivers allows for better maintainability (driver authors can define their own release cycle and support lifecycle) and reduce the opportunity for vulnerabilities (with less in-tree code, the risks of a mistake are reduced, and cluster operators can select only the storage drivers that their cluster requires).

As more CSI Drivers were created and became production ready, SIG Storage wanted all Kubernetes users to benefit from the CSI model. However, we could not break API compatibility with the existing storage API types due to k8s architecture conventions. The solution we came up with was CSI migration: a feature that translates in-tree APIs to equivalent CSI APIs and delegates operations to a replacement CSI driver.

The CSI migration effort enables the replacement of existing in-tree storage plugins such as `kubernetes.io/gce-pd` or `kubernetes.io/aws-ebs` with a corresponding [CSI driver](https://kubernetes-csi.github.io/docs/introduction.html) from the storage backend.
If CSI Migration is working properly, Kubernetes end users shouldn’t notice a difference. Existing `StorageClass`, `PersistentVolume` and `PersistentVolumeClaim` objects should continue to work.
When a Kubernetes cluster administrator updates a cluster to enable CSI migration, existing workloads that utilize PVCs which are backed by in-tree storage plugins will continue to function as they always have.
However, behind the scenes, Kubernetes hands control of all storage management operations (previously targeting in-tree drivers) to CSI drivers.

For example, suppose you are a `kubernetes.io/gce-pd` user; after CSI migration, you can still use `kubernetes.io/gce-pd` to provision new volumes, mount existing GCE-PD volumes or delete existing volumes. All existing APIs and Interface will still function correctly. However, the underlying function calls are all going through the [GCE PD CSI driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) instead of the in-tree Kubernetes function.

This enables a smooth transition for end users. Additionally as storage plugin developers, we can reduce the burden of maintaining the in-tree storage plugins and eventually remove them from the core Kubernetes binary.

## What is the timeline / status? {#timeline-and-status}

The current and targeted releases for each individual driver is shown in the table below:

| Driver           | Alpha         | Beta (in-tree deprecated) | Beta (on-by-default) | GA            | Target "in-tree plugin" removal |
| ---------------- | ------------- | ------------------------- | -------------------- | ------------- | ------------------------------- |
| AWS EBS          | 1.14          | 1.17                      | 1.23                 | 1.25          | 1.27 (Target)                   |
| Azure Disk       | 1.15          | 1.19                      | 1.23                 | 1.24          | 1.26 (Target)                   |
| Azure File       | 1.15          | 1.21                      | 1.24                 | 1.26 (Target) | 1.28 (Target)                   |
| Ceph FS          | 1.26 (Target) |                           |                      |               |                                 |
| Ceph RBD         | 1.23          | 1.26 (Target)             | 1.27 (Target)        | 1.28 (Target) | 1.30 (Target)                   |
| GCE PD           | 1.14          | 1.17                      | 1.23                 | 1.25          | 1.27 (Target)                   |
| OpenStack Cinder | 1.14          | 1.18                      | 1.21                 | 1.24          | 1.26 (Target)                   |
| Portworx         | 1.23          | 1.25                      | 1.26 (Target)        | 1.27 (Target) | 1.29 (Target)                   |
| vSphere          | 1.18          | 1.19                      | 1.25                 | 1.26 (Target) | 1.28 (Target)                   |

The following storage drivers will not have CSI migration support.
The `scaleio`, `flocker`, `quobyte` and `storageos` drivers were removed; the others are deprecated and will be removed from core Kubernetes in the coming releases.

| Driver    | Deprecated | Code Removal  |
| --------- | ---------- | ------------- |
| Flocker   | 1.22       | 1.25          |
| GlusterFS | 1.25       | 1.26 (Target) |
| Quobyte   | 1.22       | 1.25          |
| ScaleIO   | 1.16       | 1.22          |
| StorageOS | 1.22       | 1.25          |

## What does it mean for the core CSI Migration feature to go GA?

Core CSI Migration goes to GA means that the general framework, core library and API for CSI migration is 
stable for Kubernetes v1.25 and will be part of future Kubernetes releases as well.

- If you are a Kubernetes distribution maintainer, this means if you disabled `CSIMigration` feature gate previously, you are no longer allowed to do so because the feature gate has been locked.
- If you are a Kubernetes storage driver developer, this means you can expect no backwards incompatibility changes in the CSI migration library.
- If you are a Kubernetes maintainer, expect nothing changes from your day to day development flows.
- If you are a Kubernetes user, expect nothing to change from your day-to-day usage flows. If you encounter any storage related issues, contact the people who operate your cluster (if that's you, contact the provider of your Kubernetes distribution, or get help from the [community](/community/#discuss)).

## What does it mean for the storage driver CSI migration to go GA?

Storage Driver CSI Migration goes to GA means that the specific storage driver supports CSI Migration. Expect feature parity between the in-tree plugin with the CSI driver.

- If you are a Kubernetes distribution maintainer, make sure you install the corresponding
CSI driver on the distribution. And make sure you are not disabling the specific `CSIMigration{provider}` flag, as they are locked.
- If you are a Kubernetes storage driver maintainer, make sure the CSI driver can ensure feature parity if it supports CSI migration.
- If you are a Kubernetes maintainer/developer, expect nothing to change from your day-to-day development flows.
- If you are a Kubernetes user, the CSI Migration feature should be completely transparent
to you, the only requirement is to install the corresponding CSI driver.

## What's next?

We are expecting cloud provider in-tree storage plugins code removal to start to happen as part of the v1.26 and v1.27 releases of Kubernetes. More and more drivers that support CSI migration will go GA in the upcoming releases.

## How do I get involved?

The Kubernetes Slack channel [#csi-migration](https://kubernetes.slack.com/messages/csi-migration) along with any of the standard [SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great ways to reach out to the SIG Storage and migration working group teams.

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. We offer a huge thank you to the contributors who stepped up these last quarters to help move the project forward:

* Xing Yang (xing-yang)
* Hemant Kumar (gnufied)

Special thanks to the following people for the insightful reviews, thorough consideration and valuable contribution to the CSI migration feature:

* Andy Zhang (andyzhangz)
* Divyen Patel (divyenpatel)
* Deep Debroy (ddebroy)
* Humble Devassy Chirammal (humblec)
* Ismail Alidzhikov (ialidzhikov)
* Jordan Liggitt (liggitt)
* Matthew Cary (mattcary)
* Matthew Wong (wongma7)
* Neha Arora (nearora-msft)
* Oksana Naumov (trierra)
* Saad Ali (saad-ali)
* Michelle Au (msau42)

Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage). We’re rapidly growing and always welcome new contributors.