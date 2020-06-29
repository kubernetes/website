---
title: Raw Block Volume support to Beta
date: 2019-03-07
---

**Authors:**
Ben Swartzlander (NetApp), Saad Ali (Google)

Kubernetes v1.13 moves raw block volume support to beta. This feature allows persistent volumes to be exposed inside containers as a block device instead of as a mounted file system.

## What are block devices?

Block devices enable random access to data in fixed-size blocks. Hard drives, SSDs, and CD-ROMs drives are all examples of block devices.

Typically persistent storage is implemented in a layered maner with a file system (like ext4) on top of a block device (like a spinning disk or SSD). Applications then read and write files instead of operating on blocks. The operating systems take care of reading and writing files, using the specified filesystem, to the underlying device as blocks.

It's worth noting that while whole disks are block devices, so are disk partitions, and so are LUNs from a storage area network (SAN) device.

## Why add raw block volumes to kubernetes?

There are some specialized applications that require direct access to a block device because, for example, the file system layer introduces unneeded overhead. The most common case is databases, which prefer to organize their data directly on the underlying storage. Raw block devices are also commonly used by any software which itself implements some kind of storage service (software defined storage systems).

From a programmer's perspective, a block device is a very large array of bytes, usually with some minimum granularity for reads and writes, often 512 bytes, but frequently 4K or larger.

As it becomes more common to run database software and storage infrastructure software inside of Kubernetes, the need for raw block device support in Kubernetes becomes more important.

## Which volume plugins support raw blocks?

As of the publishing of this blog, the following in-tree volumes types support raw blocks:

- AWS EBS
- Azure Disk
- Cinder
- Fibre Channel
- GCE PD
- iSCSI
- Local volumes
- RBD (Ceph)
- Vsphere

Out-of-tree [CSI volume drivers](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) may also support raw block volumes. Kubernetes CSI support for raw block volumes is currently alpha. See documentation [here](https://kubernetes-csi.github.io/docs/raw-block.html).

## Kubernetes raw block volume API

Raw block volumes share a lot in common with ordinary volumes. Both are requested by creating `PersistentVolumeClaim` objects which bind to `PersistentVolume` objects, and are attached to Pods in Kubernetes by including them in the volumes array of the `PodSpec`.

There are 2 important differences however. First, to request a raw block `PersistentVolumeClaim`, you must set `volumeMode = "Block"` in the `PersistentVolumeClaimSpec`. Leaving `volumeMode` blank is the same as specifying `volumeMode = "Filesystem"` which results in the traditional behavior. `PersistentVolumes` also have a `volumeMode` field in their `PersistentVolumeSpec`, and `"Block"` type PVCs can only bind to `"Block"` type PVs and `"Filesystem"` PVCs can only bind to `"Filesystem"` PVs.

Secondly, when using a raw block volume in your Pods, you must specify a `VolumeDevice` in the Container portion of the `PodSpec` rather than a `VolumeMount`. `VolumeDevices` have `devicePaths` instead of `mountPaths`, and inside the container, applications will see a device at that path instead of a mounted file system.

Applications open, read, and write to the device node inside the container just like they would interact with any block device on a system in a non-containerized or virtualized context.

## Creating a new raw block PVC

First, ensure that the provisioner associated with the storage class you choose is one that support raw blocks. Then create the PVC.

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteMany
  volumeMode: Block
  storageClassName: my-sc
  resources:
    requests:
    storage: 1Gi
```

## Using a raw block PVC

When you use the PVC in a pod definition, you get to choose the device path for the block device rather than the mount path for the file system.

```
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: busybox
      command:
        - sleep
        - “3600”
      volumeDevices:
        - devicePath: /dev/block
          name: my-volume
      imagePullPolicy: IfNotPresent
  volumes:
    - name: my-volume
      persistentVolumeClaim:
        claimName: my-pvc
```

## As a storage vendor, how do I add support for raw block devices to my CSI plugin?

Raw block support for CSI plugins is still alpha, but support can be added today. The [CSI specification](https://github.com/container-storage-interface/spec/blob/master/spec.md) details how to handle requests for volume that have the `BlockVolume` capability instead of the `MountVolume` capability. CSI plugins can support both kinds of volumes, or one or the other. For more details see [documentation here](https://kubernetes-csi.github.io/docs/raw-block.html).


## Issues/gotchas

Because block devices are actually devices, it’s possible to do low-level actions on them from inside containers that wouldn’t be possible with file system volumes. For example, block devices that are actually SCSI disks support sending SCSI commands to the device using Linux ioctls.

By default, Linux won’t allow containers to send SCSI commands to disks from inside containers though. In order to do so, you must grant the `SYS_RAWIO` capability to the container security context to allow this. See documentation [here](/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container).

Also, while Kubernetes is guaranteed to deliver a block device to the container, there’s no guarantee that it’s actually a SCSI disk or any other kind of disk for that matter. The user must either ensure that the desired disk type is used with his pods, or only deploy applications that can handle a variety of block device types.

## How can I learn more?

Check out additional documentation on the snapshot feature here: [Raw Block Volume Support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)

How do I get involved?

Join the Kubernetes storage SIG and the CSI community and help us add more great features and improve existing ones like raw block storage!

https://github.com/kubernetes/community/tree/master/sig-storage
https://github.com/container-storage-interface/community/blob/master/README.md

Special thanks to all the contributors who helped add block volume support to Kubernetes including:

- Ben Swartzlander (https://github.com/bswartz)
- Brad Childs (https://github.com/childsb)
- Erin Boyd (https://github.com/erinboyd)
- Masaki Kimura (https://github.com/mkimuram)
- Matthew Wong (https://github.com/wongma7)
- Michelle Au (https://github.com/msau42)
- Mitsuhiro Tanino (https://github.com/mtanino)
- Saad Ali (https://github.com/saad-ali)
