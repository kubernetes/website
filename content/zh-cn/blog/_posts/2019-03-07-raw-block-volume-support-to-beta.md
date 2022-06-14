---
title: Raw Block Volume 支持进入 Beta
date: 2019-03-07
---
<!--
---
title: Raw Block Volume support to Beta
date: 2019-03-07
---
--->

<!--
**Authors:**
Ben Swartzlander (NetApp), Saad Ali (Google)

Kubernetes v1.13 moves raw block volume support to beta. This feature allows persistent volumes to be exposed inside containers as a block device instead of as a mounted file system.
--->
**作者：**
Ben Swartzlander (NetApp), Saad Ali (Google)

Kubernetes v1.13 中对原生数据块卷（Raw Block Volume）的支持进入 Beta 阶段。此功能允许将持久卷作为块设备而不是作为已挂载的文件系统暴露在容器内部。

<!--
## What are block devices?

Block devices enable random access to data in fixed-size blocks. Hard drives, SSDs, and CD-ROMs drives are all examples of block devices.

Typically persistent storage is implemented in a layered maner with a file system (like ext4) on top of a block device (like a spinning disk or SSD). Applications then read and write files instead of operating on blocks. The operating systems take care of reading and writing files, using the specified filesystem, to the underlying device as blocks.

It's worth noting that while whole disks are block devices, so are disk partitions, and so are LUNs from a storage area network (SAN) device.
--->
## 什么是块设备？

块设备允许对固定大小的块中的数据进行随机访问。硬盘驱动器、SSD 和 CD-ROM 驱动器都是块设备的例子。

通常，持久性性存储是在通过在块设备（例如磁盘或 SSD）之上构造文件系统（例如 ext4）的分层方式实现的。这样应用程序就可以读写文件而不是操作数据块进。操作系统负责使用指定的文件系统将文件读写转换为对底层设备的数据块读写。

值得注意的是，整个磁盘都是块设备，磁盘分区也是如此，存储区域网络（SAN）设备中的 LUN 也是一样的。

<!--
## Why add raw block volumes to kubernetes?

There are some specialized applications that require direct access to a block device because, for example, the file system layer introduces unneeded overhead. The most common case is databases, which prefer to organize their data directly on the underlying storage. Raw block devices are also commonly used by any software which itself implements some kind of storage service (software defined storage systems).
--->
## 为什么要将 raw block volume 添加到 kubernetes？

有些特殊的应用程序需要直接访问块设备，原因例如，文件系统层会引入不必要的开销。最常见的情况是数据库，通常会直接在底层存储上组织数据。原生的块设备（Raw Block Devices）还通常由能自己实现某种存储服务的软件（软件定义的存储系统）使用。

<!--
From a programmer's perspective, a block device is a very large array of bytes, usually with some minimum granularity for reads and writes, often 512 bytes, but frequently 4K or larger.

As it becomes more common to run database software and storage infrastructure software inside of Kubernetes, the need for raw block device support in Kubernetes becomes more important.
--->
从程序员的角度来看，块设备是一个非常大的字节数组，具有某种最小读写粒度，通常为 512 个字节，大部分情况为 4K 或更大。

随着在 Kubernetes 中运行数据库软件和存储基础架构软件变得越来越普遍，在 Kubernetes 中支持原生块设备的需求变得越来越重要。

<!--
## Which volume plugins support raw blocks?

As of the publishing of this blog, the following in-tree volumes types support raw blocks:
--->
## 哪些卷插件支持 raw block？

在发布此博客时，以下 in-tree 卷类型支持原生块设备：

- AWS EBS
- Azure Disk
- Cinder
- Fibre Channel
- GCE PD
- iSCSI
- Local volumes
- RBD (Ceph)
- Vsphere

<!--
Out-of-tree [CSI volume drivers](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) may also support raw block volumes. Kubernetes CSI support for raw block volumes is currently alpha. See documentation [here](https://kubernetes-csi.github.io/docs/raw-block.html).
--->
Out-of-tree [CSI 卷驱动程序](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) 可能也支持原生数据块卷。Kubernetes CSI 对原生数据块卷的支持目前为 alpha 阶段。参考 [这篇](https://kubernetes-csi.github.io/docs/raw-block.html) 文档。

<!--
## Kubernetes raw block volume API

Raw block volumes share a lot in common with ordinary volumes. Both are requested by creating `PersistentVolumeClaim` objects which bind to `PersistentVolume` objects, and are attached to Pods in Kubernetes by including them in the volumes array of the `PodSpec`.

There are 2 important differences however. First, to request a raw block `PersistentVolumeClaim`, you must set `volumeMode = "Block"` in the `PersistentVolumeClaimSpec`. Leaving `volumeMode` blank is the same as specifying `volumeMode = "Filesystem"` which results in the traditional behavior. `PersistentVolumes` also have a `volumeMode` field in their `PersistentVolumeSpec`, and `"Block"` type PVCs can only bind to `"Block"` type PVs and `"Filesystem"` PVCs can only bind to `"Filesystem"` PVs.
--->
## Kubernetes raw block volume 的 API

原生数据块卷与普通存储卷有很多共同点。两者都通过创建与 `PersistentVolume` 对象绑定的 `PersistentVolumeClaim` 对象发起请求，并通过将它们加入到 `PodSpec` 的 volumes 数组中来连接到 Kubernetes 中的 Pod。

但是有两个重要的区别。首先，要请求原生数据块设备的 `PersistentVolumeClaim` 必须在 `PersistentVolumeClaimSpec` 中设置 `volumeMode = "Block"`。`volumeMode` 为空时与传统设置方式中的指定 `volumeMode = "Filesystem"` 是一样的。`PersistentVolumes` 在其 `PersistentVolumeSpec` 中也有一个 `volumeMode` 字段，`"Block"` 类型的 PVC 只能绑定到 `"Block"` 类型的 PV 上，而`"Filesystem"` 类型的 PVC 只能绑定到 `"Filesystem"` PV 上。

<!--
Secondly, when using a raw block volume in your Pods, you must specify a `VolumeDevice` in the Container portion of the `PodSpec` rather than a `VolumeMount`. `VolumeDevices` have `devicePaths` instead of `mountPaths`, and inside the container, applications will see a device at that path instead of a mounted file system.

Applications open, read, and write to the device node inside the container just like they would interact with any block device on a system in a non-containerized or virtualized context.
--->
其次，在 Pod 中使用原生数据块卷时，必须在 `PodSpec` 的 Container 部分指定一个 `VolumeDevice`，而不是 `VolumeMount`。`VolumeDevices` 具备 `devicePaths` 而不是 `mountPaths`，在容器中，应用程序将看到位于该路径的设备，而不是挂载了的文件系统。

应用程序打开、读取和写入容器内的设备节点，就像它们在非容器化或虚拟环境中与系统上的任何块设备交互一样。

<!--
## Creating a new raw block PVC

First, ensure that the provisioner associated with the storage class you choose is one that support raw blocks. Then create the PVC.
--->
## 创建一个新的原生块设备 PVC

首先，请确保与您选择的存储类关联的驱动支持原生块设备。然后创建 PVC。

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

<!--
## Using a raw block PVC

When you use the PVC in a pod definition, you get to choose the device path for the block device rather than the mount path for the file system.
--->
## 使用原生块 PVC

在 Pod 定义中使用 PVC 时，需要选择块设备的设备路径，而不是文件系统的安装路径。

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

<!--
## As a storage vendor, how do I add support for raw block devices to my CSI plugin?

Raw block support for CSI plugins is still alpha, but support can be added today. The [CSI specification](https://github.com/container-storage-interface/spec/blob/master/spec.md) details how to handle requests for volume that have the `BlockVolume` capability instead of the `MountVolume` capability. CSI plugins can support both kinds of volumes, or one or the other. For more details see [documentation here](https://kubernetes-csi.github.io/docs/raw-block.html).
--->
## 作为存储供应商，我如何在 CSI 插件中添加对原生块设备的支持？

CSI 插件的原生块支持仍然是 alpha 版本，但是现在可以改进了。[CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md) 详细说明了如何处理具有 `BlockVolume` 能力而不是 `MountVolume` 能力的卷的请求。CSI 插件可以支持两种类型的卷，也可以支持其中一种或另一种。更多详细信息，请查看 [这个文档](https://kubernetes-csi.github.io/docs/raw-block.html)。


<!--
## Issues/gotchas

Because block devices are actually devices, it’s possible to do low-level actions on them from inside containers that wouldn’t be possible with file system volumes. For example, block devices that are actually SCSI disks support sending SCSI commands to the device using Linux ioctls.
--->
## 问题/陷阱

由于块设备实质上还是设备，因此可以从容器内部对其进行底层操作，而文件系统的卷则无法执行这些操作。例如，实际上是块设备的 SCSI 磁盘支持使用 Linux ioctl 向设备发送 SCSI 命令。

<!--
By default, Linux won’t allow containers to send SCSI commands to disks from inside containers though. In order to do so, you must grant the `SYS_RAWIO` capability to the container security context to allow this. See documentation [here](/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container).

Also, while Kubernetes is guaranteed to deliver a block device to the container, there’s no guarantee that it’s actually a SCSI disk or any other kind of disk for that matter. The user must either ensure that the desired disk type is used with his pods, or only deploy applications that can handle a variety of block device types.
--->
默认情况下，Linux 不允许容器将 SCSI 命令从容器内部发送到磁盘。为此，必须向容器安全层级认证 `SYS_RAWIO` 功能实现这种行为。请参阅 [这篇](/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container) 文档。

另外，尽管 Kubernetes 保证可以将块设备交付到容器中，但不能保证它实际上是 SCSI 磁盘或任何其他类型的磁盘。用户必须确保所需的磁盘类型与 Pod 一起使用，或只部署可以处理各种块设备类型的应用程序。

<!--
## How can I learn more?

Check out additional documentation on the snapshot feature here: [Raw Block Volume Support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)

How do I get involved?

Join the Kubernetes storage SIG and the CSI community and help us add more great features and improve existing ones like raw block storage!
--->
## 如何学习更多？

在此处查看有关 snapshot 功能的其他文档：[Raw Block Volume 支持](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)

如何参与进来？

加入 Kubernetes 存储 SIG 和 CSI 社区，帮助我们添加更多出色的功能并改进现有功能，就像 raw block 存储一样！

https://github.com/kubernetes/community/tree/master/sig-storage
https://github.com/container-storage-interface/community/blob/master/README.md

<!--
Special thanks to all the contributors who helped add block volume support to Kubernetes including:
--->
特别感谢所有为 Kubernetes 增加 block volume 支持的贡献者，包括：

- Ben Swartzlander (https://github.com/bswartz)
- Brad Childs (https://github.com/childsb)
- Erin Boyd (https://github.com/erinboyd)
- Masaki Kimura (https://github.com/mkimuram)
- Matthew Wong (https://github.com/wongma7)
- Michelle Au (https://github.com/msau42)
- Mitsuhiro Tanino (https://github.com/mtanino)
- Saad Ali (https://github.com/saad-ali)
