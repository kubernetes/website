---
title: Windows 存儲
content_type: concept
weight: 110
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
此頁面提供特定於 Windows 操作系統的存儲概述。
<!-- body -->

<!--
## Persistent storage {#storage}

Windows has a layered filesystem driver to mount container layers and create a copy
filesystem based on NTFS. All file paths in the container are resolved only within
the context of that container.
-->
## 持久存儲 {#storage}
Windows 有一個分層文件系統驅動程序用來掛載容器層和創建基於 NTFS 的文件系統拷貝。
容器中的所有文件路徑僅在該容器的上下文中解析。

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
* 使用 Docker 時，卷掛載只能是容器中的目錄，而不能是單個文件。此限制不適用於 containerd。
* 卷掛載不能將文件或目錄映射回宿主文件系統。
* 不支持只讀文件系統，因爲 Windows 註冊表和 SAM 數據庫始終需要寫訪問權限。不過，Windows 支持只讀的卷。
* 不支持卷的用戶掩碼和訪問許可，因爲宿主與容器之間並不共享 SAM，二者之間不存在映射關係。
  所有訪問許可都是在容器上下文中解析的。

<!--
As a result, the following storage functionality is not supported on Windows nodes:
-->
因此，Windows 節點不支持以下存儲功能：

<!--
* Volume subpath mounts: only the entire volume can be mounted in a Windows container
* Subpath volume mounting for Secrets
* Host mount projection
* Read-only root filesystem (mapped volumes still support `readOnly`)
* Block device mapping
* Memory as the storage medium (for example, `emptyDir.medium` set to `Memory`)
* File system features like uid/gid; per-user Linux filesystem permissions
* Setting [secret permissions with DefaultMode](/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys) (due to UID/GID dependency)
* NFS based storage/volume support
* Expanding the mounted volume (resizefs)
-->
* 卷子路徑掛載：只能在 Windows 容器上掛載整個卷
* Secret 的子路徑掛載
* 宿主掛載映射
* 只讀的根文件系統（映射的卷仍然支持 `readOnly`）
* 塊設備映射
* 內存作爲存儲介質（例如 `emptyDir.medium` 設置爲 `Memory`）
* 類似 UID/GID、各用戶不同的 Linux 文件系統訪問許可等文件系統特性
* 使用 [DefaultMode 設置 Secret 權限](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys)
  （因爲該特性依賴 UID/GID）
* 基於 NFS 的存儲和卷支持
* 擴展已掛載卷（resizefs）

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
對數據持久性和 Pod 卷共享有需求的複雜應用也可以部署到 Kubernetes 上。
管理與特定存儲後端或協議相關的持久卷時，相關的操作包括：對卷的製備（Provisioning）、
去配（De-provisioning）和調整大小，將卷掛接到 Kubernetes 節點或從節點上解除掛接，
將卷掛載到需要持久數據的 Pod 中的某容器上或從容器上卸載。

<!--
Volume management components are shipped as Kubernetes volume
[plugin](/docs/concepts/storage/volumes/#volume-types).
The following broad classes of Kubernetes volume plugins are supported on Windows:
-->
卷管理組件作爲 Kubernetes 卷[插件](/zh-cn/docs/concepts/storage/volumes/#volume-types)發佈。
Windows 支持以下類型的 Kubernetes 卷插件：

<!--
* [`FlexVolume plugins`](/docs/concepts/storage/volumes/#flexvolume)
  * Please note that FlexVolumes have been deprecated as of 1.23
* [`CSI Plugins`](/docs/concepts/storage/volumes/#csi)
-->
* [`FlexVolume plugins`](/zh-cn/docs/concepts/storage/volumes/#flexvolume)
  * 請注意自 1.23 版本起，FlexVolume 已被棄用
* [`CSI Plugins`](/zh-cn/docs/concepts/storage/volumes/#csi)

<!--
##### In-tree volume plugins

The following in-tree plugins support persistent storage on Windows nodes:
-->
##### 樹內（In-Tree）卷插件  {#in-tree-volume-plugins}

以下樹內（In-Tree）插件支持 Windows 節點上的持久存儲：

<!--
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume)
-->
* [`azureFile`](/zh-cn/docs/concepts/storage/volumes/#azurefile)
* [`vsphereVolume`](/zh-cn/docs/concepts/storage/volumes/#vspherevolume)