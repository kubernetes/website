---
layout: blog
title: "Introducing Single Pod Access Mode for PersistentVolumes"
date: 2021-09-13
slug: read-write-once-pod-access-mode-alpha
author: >
  Chris Henzie (Google)
---

Last month's release of Kubernetes v1.22 introduced a new ReadWriteOncePod access mode for [PersistentVolumes](/docs/concepts/storage/persistent-volumes/#persistent-volumes) and [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
With this alpha feature, Kubernetes allows you to restrict volume access to a single pod in the cluster.

## What are access modes and why are they important?

When using storage, there are different ways to model how that storage is consumed.

For example, a storage system like a network file share can have many users all reading and writing data simultaneously.
In other cases maybe everyone is allowed to read data but not write it.
For highly sensitive data, maybe only one user is allowed to read and write data but nobody else.

In the world of Kubernetes, [access modes](/docs/concepts/storage/persistent-volumes/#access-modes) are the way you can define how durable storage is consumed.
These access modes are a part of the spec for PersistentVolumes (PVs) and PersistentVolumeClaims (PVCs).

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: shared-cache
spec:
  accessModes:
  - ReadWriteMany # Allow many nodes to access shared-cache simultaneously.
  resources:
    requests:
      storage: 1Gi
```

Before v1.22, Kubernetes offered three access modes for PVs and PVCs:

- ReadWriteOnce &ndash; the volume can be mounted as read-write by a single node
- ReadOnlyMany &ndash; the volume can be mounted read-only by many nodes
- ReadWriteMany &ndash; the volume can be mounted as read-write by many nodes

These access modes are enforced by Kubernetes components like the `kube-controller-manager` and `kubelet` to ensure only certain pods are allowed to access a given PersistentVolume.

## What is this new access mode and how does it work?

Kubernetes v1.22 introduced a fourth access mode for PVs and PVCs, that you can use for CSI volumes:

- ReadWriteOncePod &ndash; the volume can be mounted as read-write by a single pod

If you create a pod with a PVC that uses the ReadWriteOncePod access mode, Kubernetes ensures that pod is the only pod across your whole cluster that can read that PVC or write to it.

If you create another pod that references the same PVC with this access mode, the pod will fail to start because the PVC is already in use by another pod.
For example:

```
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  1s    default-scheduler  0/1 nodes are available: 1 node has pod using PersistentVolumeClaim with the same name and ReadWriteOncePod access mode.
```

### How is this different than the ReadWriteOnce access mode?

The ReadWriteOnce access mode restricts volume access to a single *node*, which means it is possible for multiple pods on the same node to read from and write to the same volume.
This could potentially be a major problem for some applications, especially if they require at most one writer for data safety guarantees.

With ReadWriteOncePod these issues go away.
Set the access mode on your PVC, and Kubernetes guarantees that only a single pod has access.

## How do I use it?

The ReadWriteOncePod access mode is in alpha for Kubernetes v1.22 and is only supported for CSI volumes.
As a first step you need to enable the ReadWriteOncePod [feature gate](/docs/reference/command-line-tools-reference/feature-gates) for `kube-apiserver`, `kube-scheduler`, and `kubelet`.
You can enable the feature by setting command line arguments:

```
--feature-gates="...,ReadWriteOncePod=true"
```

You also need to update the following CSI sidecars to these versions or greater:

- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)

### Creating a PersistentVolumeClaim

In order to use the ReadWriteOncePod access mode for your PVs and PVCs, you will need to create a new PVC with the access mode:

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

If your storage plugin supports [dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/), new PersistentVolumes will be created with the ReadWriteOncePod access mode applied.

#### Migrating existing PersistentVolumes

If you have existing PersistentVolumes, they can be migrated to use ReadWriteOncePod.

In this example, we already have a "cat-pictures-pvc" PersistentVolumeClaim that is bound to a "cat-pictures-pv" PersistentVolume, and a "cat-pictures-writer" Deployment that uses this PersistentVolumeClaim.

As a first step, you need to edit your PersistentVolume's `spec.persistentVolumeReclaimPolicy` and set it to `Retain`.
This ensures your PersistentVolume will not be deleted when we delete the corresponding PersistentVolumeClaim:

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
```

Next you need to stop any workloads that are using the PersistentVolumeClaim bound to the PersistentVolume you want to migrate, and then delete the PersistentVolumeClaim.

Once that is done, you need to clear your PersistentVolume's `spec.claimRef.uid` to ensure PersistentVolumeClaims can bind to it upon recreation:

```shell
kubectl scale --replicas=0 deployment cat-pictures-writer
kubectl delete pvc cat-pictures-pvc
kubectl patch pv cat-pictures-pv -p '{"spec":{"claimRef":{"uid":""}}}'
```

After that you need to replace the PersistentVolume's access modes with ReadWriteOncePod:

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"accessModes":["ReadWriteOncePod"]}}'
```

{{< note >}}
The ReadWriteOncePod access mode cannot be combined with other access modes.
Make sure ReadWriteOncePod is the only access mode on the PersistentVolume when updating, otherwise the request will fail.
{{< /note >}}

Next you need to modify your PersistentVolumeClaim to set ReadWriteOncePod as the only access mode.
You should also set your PersistentVolumeClaim's `spec.volumeName` to the name of your PersistentVolume.

Once this is done, you can recreate your PersistentVolumeClaim and start up your workloads:

```shell
# IMPORTANT: Make sure to edit your PVC in cat-pictures-pvc.yaml before applying. You need to:
# - Set ReadWriteOncePod as the only access mode
# - Set spec.volumeName to "cat-pictures-pv"

kubectl apply -f cat-pictures-pvc.yaml
kubectl apply -f cat-pictures-writer-deployment.yaml
```

Lastly you may edit your PersistentVolume's `spec.persistentVolumeReclaimPolicy` and set to it back to `Delete` if you previously changed it.

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
```

You can read [Configure a Pod to Use a PersistentVolume for Storage](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/) for more details on working with PersistentVolumes and PersistentVolumeClaims.

## What volume plugins support this?

The only volume plugins that support this are CSI drivers.
SIG Storage does not plan to support this for in-tree plugins because they are being deprecated as part of [CSI migration](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#what-is-the-timeline-status).
Support may be considered for beta for users that prefer to use the legacy in-tree volume APIs with CSI migration enabled.

## As a storage vendor, how do I add support for this access mode to my CSI driver?

The ReadWriteOncePod access mode will work out of the box without any required updates to CSI drivers, but [does require updates to CSI sidecars](#update-your-csi-sidecars).
With that being said, if you would like to stay up to date with the latest changes to the CSI specification (v1.5.0+), read on.

Two new access modes were introduced to the CSI specification in order to disambiguate the legacy [`SINGLE_NODE_WRITER`](https://github.com/container-storage-interface/spec/blob/v1.5.0/csi.proto#L418-L420) access mode.
They are [`SINGLE_NODE_SINGLE_WRITER` and `SINGLE_NODE_MULTI_WRITER`](https://github.com/container-storage-interface/spec/blob/v1.5.0/csi.proto#L437-L447).
In order to communicate to sidecars (like the [external-provisioner](https://github.com/kubernetes-csi/external-provisioner)) that your driver understands and accepts these two new CSI access modes, your driver will also need to advertise the `SINGLE_NODE_MULTI_WRITER` capability for the [controller service](https://github.com/container-storage-interface/spec/blob/v1.5.0/csi.proto#L1073-L1081) and [node service](https://github.com/container-storage-interface/spec/blob/v1.5.0/csi.proto#L1515-L1524).

If you'd like to read up on the motivation for these access modes and capability bits, you can also read the [CSI Specification Changes, Volume Capabilities](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2485-read-write-once-pod-pv-access-mode/README.md#csi-specification-changes-volume-capabilities) section of KEP-2485 (ReadWriteOncePod PersistentVolume Access Mode).

### Update your CSI driver to use the new interface

As a first step you will need to update your driver's `container-storage-interface` dependency to v1.5.0+, which contains support for these new access modes and capabilities.

### Accept new CSI access modes

If your CSI driver contains logic for validating CSI access modes for requests , it may need updating.
If it currently accepts `SINGLE_NODE_WRITER`, it should be updated to also accept `SINGLE_NODE_SINGLE_WRITER` and `SINGLE_NODE_MULTI_WRITER`.

Using the [GCP PD CSI driver validation logic](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver/blob/v1.2.2/pkg/gce-pd-csi-driver/utils.go#L116-L130) as an example, here is how it can be extended:

```diff
diff --git a/pkg/gce-pd-csi-driver/utils.go b/pkg/gce-pd-csi-driver/utils.go
index 281242c..b6c5229 100644
--- a/pkg/gce-pd-csi-driver/utils.go
+++ b/pkg/gce-pd-csi-driver/utils.go
@@ -123,6 +123,8 @@ func validateAccessMode(am *csi.VolumeCapability_AccessMode) error {
        case csi.VolumeCapability_AccessMode_SINGLE_NODE_READER_ONLY:
        case csi.VolumeCapability_AccessMode_MULTI_NODE_READER_ONLY:
        case csi.VolumeCapability_AccessMode_MULTI_NODE_MULTI_WRITER:
+       case csi.VolumeCapability_AccessMode_SINGLE_NODE_SINGLE_WRITER:
+       case csi.VolumeCapability_AccessMode_SINGLE_NODE_MULTI_WRITER:
        default:
                return fmt.Errorf("%v access mode is not supported for for PD", am.GetMode())
        }
```

### Advertise new CSI controller and node service capabilities

Your CSI driver will also need to return the new `SINGLE_NODE_MULTI_WRITER` capability as part of the `ControllerGetCapabilities` and `NodeGetCapabilities` RPCs.

Using the [GCP PD CSI driver capability advertisement logic](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver/blob/v1.2.2/pkg/gce-pd-csi-driver/gce-pd-driver.go#L54-L77) as an example, here is how it can be extended:

```diff
diff --git a/pkg/gce-pd-csi-driver/gce-pd-driver.go b/pkg/gce-pd-csi-driver/gce-pd-driver.go
index 45903f3..0d7ea26 100644
--- a/pkg/gce-pd-csi-driver/gce-pd-driver.go
+++ b/pkg/gce-pd-csi-driver/gce-pd-driver.go
@@ -56,6 +56,8 @@ func (gceDriver *GCEDriver) SetupGCEDriver(name, vendorVersion string, extraVolu
                csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER,
                csi.VolumeCapability_AccessMode_MULTI_NODE_READER_ONLY,
                csi.VolumeCapability_AccessMode_MULTI_NODE_MULTI_WRITER,
+               csi.VolumeCapability_AccessMode_SINGLE_NODE_SINGLE_WRITER,
+               csi.VolumeCapability_AccessMode_SINGLE_NODE_MULTI_WRITER,
        }
        gceDriver.AddVolumeCapabilityAccessModes(vcam)
        csc := []csi.ControllerServiceCapability_RPC_Type{
@@ -67,12 +69,14 @@ func (gceDriver *GCEDriver) SetupGCEDriver(name, vendorVersion string, extraVolu
                csi.ControllerServiceCapability_RPC_EXPAND_VOLUME,
                csi.ControllerServiceCapability_RPC_LIST_VOLUMES,
                csi.ControllerServiceCapability_RPC_LIST_VOLUMES_PUBLISHED_NODES,
+               csi.ControllerServiceCapability_RPC_SINGLE_NODE_MULTI_WRITER,
        }
        gceDriver.AddControllerServiceCapabilities(csc)
        ns := []csi.NodeServiceCapability_RPC_Type{
                csi.NodeServiceCapability_RPC_STAGE_UNSTAGE_VOLUME,
                csi.NodeServiceCapability_RPC_EXPAND_VOLUME,
                csi.NodeServiceCapability_RPC_GET_VOLUME_STATS,
+               csi.NodeServiceCapability_RPC_SINGLE_NODE_MULTI_WRITER,
        }
        gceDriver.AddNodeServiceCapabilities(ns)
```

### Implement `NodePublishVolume` behavior

The CSI spec outlines expected behavior for the `NodePublishVolume` RPC when called more than once for the same volume but with different arguments (like the target path).
Please refer to [the second table in the NodePublishVolume section of the CSI spec](https://github.com/container-storage-interface/spec/blob/v1.5.0/spec.md#nodepublishvolume) for more details on expected behavior when implementing in your driver.

### Update your CSI sidecars

When deploying your CSI drivers, you must update the following CSI sidecars to versions that depend on CSI spec v1.5.0+ and the Kubernetes v1.22 API.
The minimum required versions are:

- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)

## What’s next?

As part of the beta graduation for this feature, SIG Storage plans to update the Kubernetes scheduler to support pod preemption in relation to ReadWriteOncePod storage.
This means if two pods request a PersistentVolumeClaim with ReadWriteOncePod, the pod with highest priority will gain access to the PersistentVolumeClaim and any pod with lower priority will be preempted from the node and be unable to access the PersistentVolumeClaim.

## How can I learn more?

Please see [KEP-2485](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2485-read-write-once-pod-pv-access-mode/README.md) for more details on the ReadWriteOncePod access mode and motivations for CSI spec changes.

## How do I get involved?

The [Kubernetes #csi Slack channel](https://kubernetes.slack.com/messages/csi) and any of the [standard SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and the CSI teams.

Special thanks to the following people for their insightful reviews and design considerations:

* Abdullah Gharaibeh (ahg-g)
* Aldo Culquicondor (alculquicondor)
* Ben Swartzlander (bswartz)
* Deep Debroy (ddebroy)
* Hemant Kumar (gnufied)
* Humble Devassy Chirammal (humblec)
* James DeFelice (jdef)
* Jan Šafránek (jsafrane)
* Jing Xu (jingxu97)
* Jordan Liggitt (liggitt)
* Michelle Au (msau42)
* Saad Ali (saad-ali)
* Tim Hockin (thockin)
* Xing Yang (xing-yang)

If you’re interested in getting involved with the design and development of CSI or any part of the Kubernetes storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We’re rapidly growing and always welcome new contributors.
