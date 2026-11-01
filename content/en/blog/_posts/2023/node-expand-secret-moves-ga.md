---
layout: blog
title: "Kubernetes 1.29: CSI Storage Resizing Authenticated and Generally Available in v1.29"
date: 2023-12-15
slug: csi-node-expand-secret-support-ga
author: >
  Humble Chirammal (Vmware),
  Louis Koo (deeproute.ai)
---

Kubernetes version v1.29 brings generally available support for authentication
during CSI (Container Storage Interface) storage resize operations.

Let's embark on the evolution of this feature, initially introduced in alpha in
Kubernetes v1.25, and unravel the changes accompanying its transition to GA.

## Authenticated CSI storage resizing unveiled

Kubernetes harnesses the capabilities of CSI to seamlessly integrate with third-party
storage systems, empowering your cluster to seamlessly expand storage volumes
managed by the CSI driver. The recent elevation of authentication secret support
for resizes from Beta to GA ushers in new horizons, enabling volume expansion in
scenarios where the underlying storage operation demands credentials for backend
cluster operations – such as accessing a SAN/NAS fabric. This enhancement addresses
a critical limitation for CSI drivers, allowing volume expansion at the node level,
especially in cases necessitating authentication for resize operations.

The challenges extend beyond node-level expansion. Within the Special Interest
Group (SIG) Storage, use cases have surfaced, including scenarios where the
CSI driver needs to validate the actual size of backend block storage before
initiating a node-level filesystem expand operation. This validation prevents
false positive returns from the backend storage cluster during file system expansion.
Additionally, for PersistentVolumes representing encrypted block storage (e.g., using LUKS),
a passphrase is mandated to expand the device and grow the filesystem, underscoring
the necessity for authenticated resizing.

## What's new for Kubernetes v1.29
With the graduation to GA, the feature remains enabled by default. Support for
node-level volume expansion secrets has been seamlessly integrated into the CSI
external-provisioner sidecar controller. To take advantage, ensure your external
CSI storage provisioner sidecar controller is operating at v3.3.0 or above.

## Navigating Authenticated CSI Storage Resizing
Assuming all requisite components, including the CSI driver, are deployed and operational
on your cluster, and you have a CSI driver supporting resizing, you can initiate a
`NodeExpand` operation on a CSI volume. Credentials for the CSI `NodeExpand` operation
can be conveniently provided as a Kubernetes Secret, specifying the Secret via the
StorageClass. Here's an illustrative manifest for a Secret holding credentials:

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: test-secret
  namespace: default
data:
  stringData:
    username: admin
    password: t0p-Secret
```
And here's an example manifest for a StorageClass referencing those credentials:

```yaml
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-blockstorage-sc
parameters:
  csi.storage.k8s.io/node-expand-secret-name: test-secret
  csi.storage.k8s.io/node-expand-secret-namespace: default
provisioner: blockstorage.cloudprovider.example
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

Upon successful creation of the PersistentVolumeClaim (PVC), you can verify the
configuration within the .spec.csi field of the PersistentVolume. To confirm,
execute `kubectl get persistentvolume <pv_name> -o yaml`.

## Engage with the Evolution!
For those enthusiastic about contributing or delving deeper into the technical
intricacies, the enhancement proposal comprises exhaustive details about the
feature's history and implementation. Explore the realms of StorageClass-based
dynamic provisioning in Kubernetes by referring to the [storage class documentation]
(https://kubernetes.io/docs/concepts/storage/persistent-volumes/#class)
and the overarching [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) documentation.

Join the Kubernetes Storage SIG (Special Interest Group) to actively participate
in elevating this feature. Your insights are invaluable, and we eagerly anticipate
welcoming more contributors to shape the future of Kubernetes storage!

