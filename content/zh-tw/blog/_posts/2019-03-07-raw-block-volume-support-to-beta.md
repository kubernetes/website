---
title: Raw Block Volume 支援進入 Beta
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

Kubernetes v1.13 中對原生資料塊卷（Raw Block Volume）的支援進入 Beta 階段。此功能允許將持久卷作為塊裝置而不是作為已掛載的檔案系統暴露在容器內部。

<!--
## What are block devices?

Block devices enable random access to data in fixed-size blocks. Hard drives, SSDs, and CD-ROMs drives are all examples of block devices.

Typically persistent storage is implemented in a layered maner with a file system (like ext4) on top of a block device (like a spinning disk or SSD). Applications then read and write files instead of operating on blocks. The operating systems take care of reading and writing files, using the specified filesystem, to the underlying device as blocks.

It's worth noting that while whole disks are block devices, so are disk partitions, and so are LUNs from a storage area network (SAN) device.
--->
## 什麼是塊裝置？

塊裝置允許對固定大小的塊中的資料進行隨機訪問。硬碟驅動器、SSD 和 CD-ROM 驅動器都是塊裝置的例子。

通常，永續性性儲存是在透過在塊裝置（例如磁碟或 SSD）之上構造檔案系統（例如 ext4）的分層方式實現的。這樣應用程式就可以讀寫檔案而不是操作資料塊進。作業系統負責使用指定的檔案系統將檔案讀寫轉換為對底層裝置的資料塊讀寫。

值得注意的是，整個磁碟都是塊裝置，磁碟分割槽也是如此，儲存區域網路（SAN）裝置中的 LUN 也是一樣的。

<!--
## Why add raw block volumes to kubernetes?

There are some specialized applications that require direct access to a block device because, for example, the file system layer introduces unneeded overhead. The most common case is databases, which prefer to organize their data directly on the underlying storage. Raw block devices are also commonly used by any software which itself implements some kind of storage service (software defined storage systems).
--->
## 為什麼要將 raw block volume 新增到 kubernetes？

有些特殊的應用程式需要直接訪問塊裝置，原因例如，檔案系統層會引入不必要的開銷。最常見的情況是資料庫，通常會直接在底層儲存上組織資料。原生的塊裝置（Raw Block Devices）還通常由能自己實現某種儲存服務的軟體（軟體定義的儲存系統）使用。

<!--
From a programmer's perspective, a block device is a very large array of bytes, usually with some minimum granularity for reads and writes, often 512 bytes, but frequently 4K or larger.

As it becomes more common to run database software and storage infrastructure software inside of Kubernetes, the need for raw block device support in Kubernetes becomes more important.
--->
從程式設計師的角度來看，塊裝置是一個非常大的位元組陣列，具有某種最小讀寫粒度，通常為 512 個位元組，大部分情況為 4K 或更大。

隨著在 Kubernetes 中執行資料庫軟體和儲存基礎架構軟體變得越來越普遍，在 Kubernetes 中支援原生塊裝置的需求變得越來越重要。

<!--
## Which volume plugins support raw blocks?

As of the publishing of this blog, the following in-tree volumes types support raw blocks:
--->
## 哪些卷外掛支援 raw block？

在釋出此部落格時，以下 in-tree 卷型別支援原生塊裝置：

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
Out-of-tree [CSI 卷驅動程式](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) 可能也支援原生資料塊卷。Kubernetes CSI 對原生資料塊卷的支援目前為 alpha 階段。參考 [這篇](https://kubernetes-csi.github.io/docs/raw-block.html) 文件。

<!--
## Kubernetes raw block volume API

Raw block volumes share a lot in common with ordinary volumes. Both are requested by creating `PersistentVolumeClaim` objects which bind to `PersistentVolume` objects, and are attached to Pods in Kubernetes by including them in the volumes array of the `PodSpec`.

There are 2 important differences however. First, to request a raw block `PersistentVolumeClaim`, you must set `volumeMode = "Block"` in the `PersistentVolumeClaimSpec`. Leaving `volumeMode` blank is the same as specifying `volumeMode = "Filesystem"` which results in the traditional behavior. `PersistentVolumes` also have a `volumeMode` field in their `PersistentVolumeSpec`, and `"Block"` type PVCs can only bind to `"Block"` type PVs and `"Filesystem"` PVCs can only bind to `"Filesystem"` PVs.
--->
## Kubernetes raw block volume 的 API

原生資料塊卷與普通儲存卷有很多共同點。兩者都透過建立與 `PersistentVolume` 物件繫結的 `PersistentVolumeClaim` 物件發起請求，並透過將它們加入到 `PodSpec` 的 volumes 陣列中來連線到 Kubernetes 中的 Pod。

但是有兩個重要的區別。首先，要請求原生資料塊裝置的 `PersistentVolumeClaim` 必須在 `PersistentVolumeClaimSpec` 中設定 `volumeMode = "Block"`。`volumeMode` 為空時與傳統設定方式中的指定 `volumeMode = "Filesystem"` 是一樣的。`PersistentVolumes` 在其 `PersistentVolumeSpec` 中也有一個 `volumeMode` 欄位，`"Block"` 型別的 PVC 只能繫結到 `"Block"` 型別的 PV 上，而`"Filesystem"` 型別的 PVC 只能繫結到 `"Filesystem"` PV 上。

<!--
Secondly, when using a raw block volume in your Pods, you must specify a `VolumeDevice` in the Container portion of the `PodSpec` rather than a `VolumeMount`. `VolumeDevices` have `devicePaths` instead of `mountPaths`, and inside the container, applications will see a device at that path instead of a mounted file system.

Applications open, read, and write to the device node inside the container just like they would interact with any block device on a system in a non-containerized or virtualized context.
--->
其次，在 Pod 中使用原生資料塊卷時，必須在 `PodSpec` 的 Container 部分指定一個 `VolumeDevice`，而不是 `VolumeMount`。`VolumeDevices` 具備 `devicePaths` 而不是 `mountPaths`，在容器中，應用程式將看到位於該路徑的裝置，而不是掛載了的檔案系統。

應用程式開啟、讀取和寫入容器內的裝置節點，就像它們在非容器化或虛擬環境中與系統上的任何塊裝置互動一樣。

<!--
## Creating a new raw block PVC

First, ensure that the provisioner associated with the storage class you choose is one that support raw blocks. Then create the PVC.
--->
## 建立一個新的原生塊裝置 PVC

首先，請確保與您選擇的儲存類關聯的驅動支援原生塊裝置。然後建立 PVC。

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
## 使用原生塊 PVC

在 Pod 定義中使用 PVC 時，需要選擇塊裝置的裝置路徑，而不是檔案系統的安裝路徑。

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
## 作為儲存供應商，我如何在 CSI 外掛中新增對原生塊裝置的支援？

CSI 外掛的原生塊支援仍然是 alpha 版本，但是現在可以改進了。[CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md) 詳細說明了如何處理具有 `BlockVolume` 能力而不是 `MountVolume` 能力的卷的請求。CSI 外掛可以支援兩種型別的卷，也可以支援其中一種或另一種。更多詳細資訊，請檢視 [這個文件](https://kubernetes-csi.github.io/docs/raw-block.html)。


<!--
## Issues/gotchas

Because block devices are actually devices, it’s possible to do low-level actions on them from inside containers that wouldn’t be possible with file system volumes. For example, block devices that are actually SCSI disks support sending SCSI commands to the device using Linux ioctls.
--->
## 問題/陷阱

由於塊裝置實質上還是裝置，因此可以從容器內部對其進行底層操作，而檔案系統的卷則無法執行這些操作。例如，實際上是塊裝置的 SCSI 磁碟支援使用 Linux ioctl 向裝置傳送 SCSI 命令。

<!--
By default, Linux won’t allow containers to send SCSI commands to disks from inside containers though. In order to do so, you must grant the `SYS_RAWIO` capability to the container security context to allow this. See documentation [here](/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container).

Also, while Kubernetes is guaranteed to deliver a block device to the container, there’s no guarantee that it’s actually a SCSI disk or any other kind of disk for that matter. The user must either ensure that the desired disk type is used with his pods, or only deploy applications that can handle a variety of block device types.
--->
預設情況下，Linux 不允許容器將 SCSI 命令從容器內部發送到磁碟。為此，必須向容器安全層級認證 `SYS_RAWIO` 功能實現這種行為。請參閱 [這篇](/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container) 文件。

另外，儘管 Kubernetes 保證可以將塊裝置交付到容器中，但不能保證它實際上是 SCSI 磁碟或任何其他型別的磁碟。使用者必須確保所需的磁碟型別與 Pod 一起使用，或只部署可以處理各種塊裝置型別的應用程式。

<!--
## How can I learn more?

Check out additional documentation on the snapshot feature here: [Raw Block Volume Support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)

How do I get involved?

Join the Kubernetes storage SIG and the CSI community and help us add more great features and improve existing ones like raw block storage!
--->
## 如何學習更多？

在此處檢視有關 snapshot 功能的其他文件：[Raw Block Volume 支援](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)

如何參與進來？

加入 Kubernetes 儲存 SIG 和 CSI 社群，幫助我們新增更多出色的功能並改進現有功能，就像 raw block 儲存一樣！

https://github.com/kubernetes/community/tree/master/sig-storage
https://github.com/container-storage-interface/community/blob/master/README.md

<!--
Special thanks to all the contributors who helped add block volume support to Kubernetes including:
--->
特別感謝所有為 Kubernetes 增加 block volume 支援的貢獻者，包括：

- Ben Swartzlander (https://github.com/bswartz)
- Brad Childs (https://github.com/childsb)
- Erin Boyd (https://github.com/erinboyd)
- Masaki Kimura (https://github.com/mkimuram)
- Matthew Wong (https://github.com/wongma7)
- Michelle Au (https://github.com/msau42)
- Mitsuhiro Tanino (https://github.com/mtanino)
- Saad Ali (https://github.com/saad-ali)
