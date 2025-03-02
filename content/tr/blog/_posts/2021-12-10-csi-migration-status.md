---
layout: blog
title: "Kubernetes 1.23: Kubernetes In-Tree to CSI Volume Migration Status Update"
date: 2021-12-10
slug: storage-in-tree-to-csi-migration-status-update
author: >
  Jiawei Wang (Google)
---

The Kubernetes in-tree storage plugin to [Container Storage Interface (CSI)](/blog/2019/01/15/container-storage-interface-ga/) migration infrastructure has already been [beta](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/) since v1.17. CSI migration was introduced as alpha in Kubernetes v1.14.

Since then, SIG Storage and other Kubernetes special interest groups are working to ensure feature stability and compatibility in preparation for GA.
This article is intended to give a status update to the feature as well as changes between Kubernetes 1.17 and 1.23. In addition, I will also cover the future roadmap for the CSI migration feature GA for each storage plugin.

## Quick recap: What is CSI Migration, and why migrate?

The Container Storage Interface (CSI) was designed to help Kubernetes replace its existing, in-tree storage driver mechanisms - especially vendor specific plugins.
Kubernetes support for the [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md#README) has been 
[generally available](/blog/2019/01/15/container-storage-interface-ga/) since Kubernetes v1.13.
Support for using CSI drivers was introduced to make it easier to add and maintain new integrations between Kubernetes and storage backend technologies. Using CSI drivers allows for for better maintainability (driver authors can define their own release cycle and support lifecycle) and reduce the opportunity for vulnerabilities (with less in-tree code, the risks of a mistake are reduced, and cluster operators can select only the storage drivers that their cluster requires).

As more CSI Drivers were created and became production ready, SIG Storage group wanted all Kubernetes users to benefit from the CSI model. However, we cannot break API compatibility with the existing storage API types. The solution we came up with was CSI migration: a feature that translates in-tree APIs to equivalent CSI APIs and delegates operations to a replacement CSI driver.

The CSI migration effort enables the replacement of existing in-tree storage plugins such as `kubernetes.io/gce-pd` or `kubernetes.io/aws-ebs` with a corresponding [CSI driver](https://kubernetes-csi.github.io/docs/introduction.html) from the storage backend.
If CSI Migration is working properly, Kubernetes end users shouldn’t notice a difference. Existing `StorageClass`, `PersistentVolume` and `PersistentVolumeClaim` objects should continue to work.
When a Kubernetes cluster administrator updates a cluster to enable CSI migration, existing workloads that utilize PVCs which are backed by in-tree storage plugins will continue to function as they always have. 
However, behind the scenes, Kubernetes hands control of all storage management operations (previously targeting in-tree drivers) to CSI drivers.

For example, suppose you are a `kubernetes.io/gce-pd` user, after CSI migration, you can still use `kubernetes.io/gce-pd` to provision new volumes, mount existing GCE-PD volumes or delete existing volumes. All existing API/Interface will still function correctly. However, the underlying function calls are all going through the [GCE PD CSI driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) instead of the in-tree Kubernetes function.

This enables a smooth transition for end users. Additionally as storage plugin developers, we can reduce the burden of maintaining the in-tree storage plugins and eventually remove them from the core Kubernetes binary.

## What has been changed, and what's new?

Building on the work done in Kubernetes v1.17 and earlier, the releases since then have
made a series of changes:

### New feature gates

The Kubernetes v1.21 release deprecated the `CSIMigration{provider}Complete` feature flags, and stopped honoring them. In their place came new feature flags named `InTreePlugin{vendor}Unregister`, that replace the old feature flag and retain all the functionality that `CSIMigration{provider}Complete` provided.

`CSIMigration{provider}Complete` was introduced before as a supplementary feature gate once CSI migration is enabled on all of the nodes. This flag unregisters the in-tree storage plugin you specify with the `{provider}` part of the flag name.

When you enable that feature gate, then instead of using the in-tree driver code, your cluster directly selects and uses the relevant CSI driver. This happens without any check for whether CSI migration is enabled on the node, or whether you have in fact deployed that CSI driver.

While this feature gate is a great helper, SIG Storage (and, I'm sure, lots of cluster operators) also wanted a feature gate that lets you disable an in-tree storage plugin, even without also enabling CSI migration. For example, you might want to disable the EBS storage plugin on a GCE cluster, because EBS volumes are specific to a different vendor's cloud (AWS).

To make this possible, Kubernetes v1.21 introduced a new feature flag set: `InTreePlugin{vendor}Unregister`.

`InTreePlugin{vendor}Unregister` is a standalone feature gate that can be enabled and disabled independently from CSI Migration. When enabled, the component will not register the specific in-tree storage plugin to the supported list. If the cluster operator only enables this flag, end users will get an error from PVC saying it cannot find the plugin when the plugin is used. The cluster operator may want to enable this regardless of CSI Migration if they do not want to support the legacy in-tree APIs and only support CSI moving forward.

### Observability

Kubernetes v1.21 introduced [metrics](https://github.com/kubernetes/kubernetes/issues/98279) for tracking CSI migration.
You can use these metrics to observe how your cluster is using storage services and whether access to that storage is using the legacy in-tree driver or its CSI-based replacement.

| Components                                   | Metrics                            | Notes                                                                                                                                                                                  |
| -------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kube-Controller-Manager                      | storage_operation_duration_seconds | A new label `migrated` is added to the metric to indicate whether this storage operation is a CSI migration operation(string value `true` for enabled and `false` for not enabled).    |
| Kubelet                                      | csi_operations_seconds             | The new metric exposes labels including `driver_name`, `method_name`, `grpc_status_code` and `migrated`. The meaning of these labels is identical to `csi_sidecar_operations_seconds`. |
| CSI Sidecars(provisioner, attacher, resizer) | csi_sidecar_operations_seconds     | A new label `migrated` is added to the metric to indicate whether this storage operation is a CSI migration operation(string value `true` for enabled and `false` for not enabled).    |

### Bug fixes and feature improvement

We have fixed numerous bugs like dangling attachment, garbage collection, incorrect topology label through the help of our beta testers.

### Cloud Provider && Cluster Lifecycle Collaboration

SIG Storage has been working closely with SIG Cloud Provider and SIG Cluster Lifecycle on the rollout of CSI migration.

If you are a user of a managed Kubernetes service, check with your provider if anything needs to be done. In many cases, the provider will manage the migration and no additional work is required.

If you use a distribution of Kubernetes, check its official documentation for information about support for this feature. For the CSI Migration feature graduation to GA, SIG Storage and SIG Cluster Lifecycle are collaborating towards making the migration mechanisms available in tooling (such as kubeadm) as soon as they're available in Kubernetes itself.

## What is the timeline / status? {#timeline-and-status}

The current and targeted releases for each individual driver is shown in the table below:

| Driver           | Alpha | Beta (in-tree deprecated) | Beta (on-by-default) | GA            | Target "in-tree plugin" removal |
| ---------------- | ----- | ------------------------- | -------------------- | ------------- | ------------------------------- |
| AWS EBS          | 1.14  | 1.17                      | 1.23                 | 1.24 (Target) | 1.26 (Target)                   |
| GCE PD           | 1.14  | 1.17                      | 1.23                 | 1.24 (Target) | 1.26 (Target)                   |
| OpenStack Cinder | 1.14  | 1.18                      | 1.21                 | 1.24 (Target) | 1.26 (Target)                   |
| Azure Disk       | 1.15  | 1.19                      | 1.23                 | 1.24 (Target) | 1.26 (Target)                   |
| Azure File       | 1.15  | 1.21                      | 1.24 (Target)        | 1.25 (Target) | 1.27 (Target)                   |
| vSphere          | 1.18  | 1.19                      | 1.24 (Target)        | 1.25 (Target) | 1.27 (Target)                   |
| Ceph RBD         | 1.23  |
| Portworx         | 1.23  |

The following storage drivers will not have CSI migration support. The ScaleIO driver was already removed; the others are deprecated and will be removed from core Kubernetes.

| Driver    | Deprecated | Code Removal  |
| --------- | ---------- | ------------- |
| ScaleIO   | 1.16       | 1.22          |
| Flocker   | 1.22       | 1.25 (Target) |
| Quobyte   | 1.22       | 1.25 (Target) |
| StorageOS | 1.22       | 1.25 (Target) |

## What's next?

With more CSI drivers graduating to GA, we hope to soon mark the overall CSI Migration feature as GA. We are expecting cloud provider in-tree storage plugins code removal to happen by Kubernetes v1.26 and v1.27.

## What should I do as a user?

Note that all new features for the Kubernetes storage system (such as volume snapshotting) will only be added to the CSI interface. Therefore, if you are starting up a new cluster, creating stateful applications for the first time, or require these new features we recommend using CSI drivers natively (instead of the in-tree volume plugin API). Follow the [updated user guides for CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html) and use the new CSI APIs.

However, if you choose to roll a cluster forward or continue using specifications with the legacy volume APIs, CSI Migration will ensure we continue to support those deployments with the new CSI drivers. However, if you want to leverage new features like snapshot, it will require a manual migration to re-import an existing intree PV as a CSI PV.

## How do I get involved?

The Kubernetes Slack channel [#csi-migration](https://kubernetes.slack.com/messages/csi-migration) along with any of the standard [SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and migration working group teams.

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. We offer a huge thank you to the contributors who stepped up these last quarters to help move the project forward:

* Michelle Au (msau42)
* Jan Šafránek (jsafrane)
* Hemant Kumar (gnufied)

Special thanks to the following people for the insightful reviews, thorough consideration and valuable contribution to the CSI migration feature:

* Andy Zhang (andyzhangz)
* Divyen Patel (divyenpatel)
* Deep Debroy (ddebroy)
* Humble Devassy Chirammal (humblec)
* Jing Xu (jingxu97)
* Jordan Liggitt (liggitt)
* Matthew Cary (mattcary)
* Matthew Wong (wongma7)
* Neha Arora (nearora-msft)
* Oksana Naumov (trierra)
* Saad Ali (saad-ali)
* Tim Bannister (sftim)
* Xing Yang (xing-yang)

Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage). We’re rapidly growing and always welcome new contributors.
