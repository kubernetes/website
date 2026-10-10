---
reviewers:
- jingxu97
- mauriciopoppe
- jayunit100
- jsturtevant
- marosset
- aravindhp
title: Windows Storage
content_type: concept
weight: 110
---

<!-- overview -->

This page provides an storage overview specific to the Windows operating system.

<!-- body -->

## Persistent storage {#storage}

Windows has a layered filesystem driver to mount container layers and create a copy
filesystem based on NTFS. All file paths in the container are resolved only within
the context of that container.

* With Docker, volume mounts can only target a directory in the container, and not
  an individual file. This limitation does not apply to containerd.
* Volume mounts cannot project files or directories back to the host filesystem.
* Read-only filesystems are not supported because write access is always required
  for the Windows registry and SAM database. However, read-only volumes are supported.
* Volume user-masks and permissions are not available. Because the SAM is not shared
  between the host & container, there's no mapping between them. All permissions are
  resolved within the context of the container.

As a result, the following storage functionality is not supported on Windows nodes:

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

Kubernetes {{< glossary_tooltip text="volumes" term_id="volume" >}} enable complex
applications, with data persistence and Pod volume sharing requirements, to be deployed
on Kubernetes. Management of persistent volumes associated with a specific storage
back-end or protocol includes actions such as provisioning/de-provisioning/resizing
of volumes, attaching/detaching a volume to/from a Kubernetes node and
mounting/dismounting a volume to/from individual containers in a pod that needs to
persist data.

Volume management components are shipped as Kubernetes volume
[plugin](/docs/concepts/storage/volumes/#volume-types).
The following broad classes of Kubernetes volume plugins are supported on Windows:

* [`FlexVolume plugins`](/docs/concepts/storage/volumes/#flexvolume)
  * Please note that FlexVolumes have been deprecated as of 1.23
* [`CSI Plugins`](/docs/concepts/storage/volumes/#csi)

##### In-tree volume plugins

The following in-tree plugins support persistent storage on Windows nodes:

* [`azureFile`](/docs/concepts/storage/volumes/#azurefile)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume)
