---
title: Windows 存储
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
此页面提供特定于 Windows 操作系统的存储概述。
<!-- body -->

<!--
## Persistent storage {#storage}

Windows has a layered filesystem driver to mount container layers and create a copy
filesystem based on NTFS. All file paths in the container are resolved only within
the context of that container.
-->
## 持久存储 {#storage}
Windows 有一个分层文件系统驱动程序用来挂载容器层和创建基于 NTFS 的文件系统拷贝。
容器中的所有文件路径仅在该容器的上下文中解析。

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
* 使用 Docker 时，卷挂载只能是容器中的目录，而不能是单个文件。此限制不适用于 containerd。
* 卷挂载不能将文件或目录映射回宿主文件系统。
* 不支持只读文件系统，因为 Windows 注册表和 SAM 数据库始终需要写访问权限。不过，Windows 支持只读的卷。
* 不支持卷的用户掩码和访问许可，因为宿主与容器之间并不共享 SAM，二者之间不存在映射关系。
  所有访问许可都是在容器上下文中解析的。

<!--
As a result, the following storage functionality is not supported on Windows nodes:
-->
因此，Windows 节点不支持以下存储功能：

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
* 卷子路径挂载：只能在 Windows 容器上挂载整个卷
* Secret 的子路径挂载
* 宿主挂载映射
* 只读的根文件系统（映射的卷仍然支持 `readOnly`）
* 块设备映射
* 内存作为存储介质（例如 `emptyDir.medium` 设置为 `Memory`）
* 类似 UID/GID、各用户不同的 Linux 文件系统访问许可等文件系统特性
* 使用 [DefaultMode 设置 Secret 权限](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys)
  （因为该特性依赖 UID/GID）
* 基于 NFS 的存储和卷支持
* 扩展已挂载卷（resizefs）

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
对数据持久性和 Pod 卷共享有需求的复杂应用也可以部署到 Kubernetes 上。
管理与特定存储后端或协议相关的持久卷时，相关的操作包括：对卷的制备（Provisioning）、
去配（De-provisioning）和调整大小，将卷挂接到 Kubernetes 节点或从节点上解除挂接，
将卷挂载到需要持久数据的 Pod 中的某容器上或从容器上卸载。

<!--
Volume management components are shipped as Kubernetes volume
[plugin](/docs/concepts/storage/volumes/#volume-types).
The following broad classes of Kubernetes volume plugins are supported on Windows:
-->
卷管理组件作为 Kubernetes 卷[插件](/zh-cn/docs/concepts/storage/volumes/#volume-types)发布。
Windows 支持以下类型的 Kubernetes 卷插件：

<!--
* [`FlexVolume plugins`](/docs/concepts/storage/volumes/#flexvolume)
  * Please note that FlexVolumes have been deprecated as of 1.23
* [`CSI Plugins`](/docs/concepts/storage/volumes/#csi)
-->
* [`FlexVolume plugins`](/zh-cn/docs/concepts/storage/volumes/#flexvolume)
  * 请注意自 1.23 版本起，FlexVolume 已被弃用
* [`CSI Plugins`](/zh-cn/docs/concepts/storage/volumes/#csi)

<!--
##### In-tree volume plugins

The following in-tree plugins support persistent storage on Windows nodes:
-->
##### 树内（In-Tree）卷插件  {#in-tree-volume-plugins}

以下树内（In-Tree）插件支持 Windows 节点上的持久存储：

<!--
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume)
-->
* [`azureFile`](/zh-cn/docs/concepts/storage/volumes/#azurefile)
* [`vsphereVolume`](/zh-cn/docs/concepts/storage/volumes/#vspherevolume)