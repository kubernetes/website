---
layout: blog
title: "Kubernetes v1.34: VolumeAttributesClass for Volume Modification GA"
date: 2025-09-08T10:30:00-08:00
slug: kubernetes-v1-34-volume-attributes-class
author: >
  Sunny Song (Google)
---

The VolumeAttributesClass API, which empowers users to dynamically modify volume attributes, has officially graduated to General Availability (GA) in Kubernetes v1.34. This marks a significant milestone, providing a robust and stable way to tune your persistent storage directly within Kubernetes.


## What is VolumeAttributesClass?

At its core, VolumeAttributesClass is a cluster-scoped resource that defines a set of mutable parameters for a volume. Think of it as a "profile" for your storage, allowing cluster administrators to expose different quality-of-service (QoS) levels or performance tiers.

Users can then specify a `volumeAttributesClassName` in their PersistentVolumeClaim (PVC) to indicate which class of attributes they desire. The magic happens through the Container Storage Interface (CSI): when a PVC referencing a VolumeAttributesClass is updated, the associated CSI driver interacts with the underlying storage system to apply the specified changes to the volume.

This means you can now:

*   Dynamically scale performance: Increase IOPS or throughput for a busy database, or reduce it for a less critical application.
*   Optimize costs: Adjust attributes on the fly to match your current needs, avoiding over-provisioning.
*   Simplify operations: Manage volume modifications directly within the Kubernetes API, rather than relying on external tools or manual processes.


## What is new from Beta to GA

There are two major enhancements from beta.

### Cancel support from infeasible errors

To improve resilience and user experience, the GA release introduces explicit cancel support when a requested volume modification becomes infeasible. If the underlying storage system or CSI driver indicates that the requested changes cannot be applied (e.g., due to invalid arguments), users can cancel the operation and revert the volume to its previous stable configuration, preventing the volume from being left in an inconsistent state.


### Quota support based on scope

While VolumeAttributesClass doesn't add a new quota type, the Kubernetes control plane can be configured to enforce quotas on PersistentVolumeClaims that reference a specific VolumeAttributesClass.

This is achieved by using the `scopeSelector` field in a ResourceQuota to target PVCs that have `.spec.volumeAttributesClassName` set to a particular VolumeAttributesClass name. Please see more details [here]( https://kubernetes.io/docs/concepts/policy/resource-quotas/#resource-quota-per-volumeattributesclass).


## Drivers support VolumeAttributesClass

*   Amazon EBS CSI Driver: The AWS EBS CSI driver has robust support for VolumeAttributesClass and allows you to modify parameters like volume type (e.g., gp2 to gp3, io1 to io2), IOPS, and throughput of EBS volumes dynamically.
*   Google Compute Engine (GCE) Persistent Disk CSI Driver (pd.csi.storage.gke.io): This driver also supports dynamic modification of persistent disk attributes, including IOPS and throughput, via VolumeAttributesClass.


## Contact

For any inquiries or specific questions related to VolumeAttributesClass, please reach out to the [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
