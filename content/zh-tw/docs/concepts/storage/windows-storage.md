---
title: Windows 儲存
content_type: concept
---
<!--
reviewers:
- jingxu97
- mauriciopoppe
- jayunit100
- jsturtevant
- marosset
- aravindhp
title: Windows Storage
content_type: concept
-->

<!-- overview -->
<!--
This page provides an storage overview specific to the Windows operating system.
-->
此頁面提供特定於 Windows 作業系統的儲存概述。
<!-- body -->

<!--
## Persistent storage {#storage}

Windows has a layered filesystem driver to mount container layers and create a copy
filesystem based on NTFS. All file paths in the container are resolved only within
the context of that container.
-->
## 持久儲存 {#storage}
Windows 有一個分層檔案系統驅動程式用來掛載容器層和建立基於 NTFS 的檔案系統複製。
容器中的所有檔案路徑僅在該容器的上下文中解析。

<!--
* With Docker, volume mounts can only target a directory in the container, and not
  an individual file. This limitation does not apply to containerd.
* Volume mounts cannot project files or directories back to the host filesystem.
* Read-only filesystems are not supported because write access is always required
  for the Windows registry and SAM database. However, read-only volumes are supported.
* Volume user-masks and permissions are not available. Because the SAM is not shared
  between the host & container, there's no mapping between them. All permissions are
  resolved within the context of the container.
-->
* 使用 Docker 時，卷掛載只能是容器中的目錄，而不能是單個檔案。此限制不適用於 containerd。
* 卷掛載不能將檔案或目錄映射回宿主檔案系統。
* 不支援只讀檔案系統，因為 Windows 登錄檔和 SAM 資料庫始終需要寫訪問許可權。不過，Windows 支援只讀的卷。
* 不支援卷的使用者掩碼和訪問許可，因為宿主與容器之間並不共享 SAM，二者之間不存在對映關係。
  所有訪問許可都是在容器上下文中解析的。

<!--
As a result, the following storage functionality is not supported on Windows nodes:
-->
因此，Windows 節點不支援以下儲存功能：

<!--
* Volume subpath mounts: only the entire volume can be mounted in a Windows container
* Subpath volume mounting for Secrets
* Host mount projection
* Read-only root filesystem (mapped volumes still support `readOnly`)
* Block device mapping
* Memory as the storage medium (for example, `emptyDir.medium` set to `Memory`)
* File system features like uid/gid; per-user Linux filesystem permissions
* Setting [secret permissions with DefaultMode](/docs/concepts/configuration/secret/#secret-files-permissions) (due to UID/GID dependency)
* NFS based storage/volume support
* Expanding the mounted volume (resizefs)
-->
* 卷子路徑掛載：只能在 Windows 容器上掛載整個卷
* Secret 的子路徑掛載
* 宿主掛載對映
* 只讀的根檔案系統（對映的卷仍然支援 `readOnly`）
* 塊裝置對映
* 記憶體作為儲存介質（例如 `emptyDir.medium` 設定為 `Memory`）
* 類似 UID/GID、各使用者不同的 Linux 檔案系統訪問許可等檔案系統特性
* 使用 [DefaultMode 設定 Secret 許可權](/zh-cn/docs/concepts/configuration/secret/#secret-files-permissions)
  （因為該特性依賴 UID/GID）
* 基於 NFS 的儲存和卷支援
* 擴充套件已掛載卷（resizefs）

<!--
Kubernetes {{< glossary_tooltip text="volumes" term_id="volume" >}} enable complex
applications, with data persistence and Pod volume sharing requirements, to be deployed
on Kubernetes. Management of persistent volumes associated with a specific storage
back-end or protocol includes actions such as provisioning/de-provisioning/resizing
of volumes, attaching/detaching a volume to/from a Kubernetes node and
mounting/dismounting a volume to/from individual containers in a pod that needs to
persist data.
-->
使用 Kubernetes {{< glossary_tooltip text="卷" term_id="volume" >}}，
對資料永續性和 Pod 卷共享有需求的複雜應用也可以部署到 Kubernetes 上。
管理與特定儲存後端或協議相關的持久卷時，相關的操作包括：對卷的製備（Provisioning）、
去配（De-provisioning）和調整大小，將卷掛接到 Kubernetes 節點或從節點上解除掛接，
將卷掛載到需要持久資料的 Pod 中的某容器上或從容器上解除安裝。

<!--
Volume management components are shipped as Kubernetes volume
[plugin](/docs/concepts/storage/volumes/#types-of-volumes).
The following broad classes of Kubernetes volume plugins are supported on Windows:
-->
卷管理元件作為 Kubernetes 卷[外掛](/zh-cn/docs/concepts/storage/volumes/#types-of-volumes)釋出。
Windows 支援以下型別的 Kubernetes 卷外掛：

<!--
* [`FlexVolume plugins`](/docs/concepts/storage/volumes/#flexVolume)
  * Please note that FlexVolumes have been deprecated as of 1.23
* [`CSI Plugins`](/docs/concepts/storage/volumes/#csi)
-->
* [`FlexVolume plugins`](/zh-cn/docs/concepts/storage/volumes/#flexVolume)
  * 請注意自 1.23 版本起，FlexVolume 已被棄用
* [`CSI Plugins`](/zh-cn/docs/concepts/storage/volumes/#csi)

<!--
##### In-tree volume plugins

The following in-tree plugins support persistent storage on Windows nodes:
-->
##### 樹內（In-Tree）卷外掛  {#in-tree-volume-plugins}

以下樹內（In-Tree）外掛支援 Windows 節點上的持久儲存：

<!--
* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk)
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile)
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcepersistentdisk)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume)
-->
* [`awsElasticBlockStore`](/zh-cn/docs/concepts/storage/volumes/#awselasticblockstore)
* [`azureDisk`](/zh-cn/docs/concepts/storage/volumes/#azuredisk)
* [`azureFile`](/zh-cn/docs/concepts/storage/volumes/#azurefile)
* [`gcePersistentDisk`](/zh-cn/docs/concepts/storage/volumes/#gcepersistentdisk)
* [`vsphereVolume`](/zh-cn/docs/concepts/storage/volumes/#vspherevolume)