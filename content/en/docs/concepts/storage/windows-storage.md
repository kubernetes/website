---
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title: Volume Storage on Windows nodes
content_type: concept
weight: 75
---

<!-- overview -->

This page describes storage/volume behaviors and functionality specific to the Windows operating system.

<!-- body -->

Windows has a layered filesystem driver to mount container layers and create a copy
filesystem based on NTFS. All file paths in the container are resolved only within
the context of that container.

* With Docker, volume mounts can only target a directory in the container, and not
  an individual file. This limitation does not exist with CRI-containerD runtime.
* Volume mounts cannot project files or directories back to the host filesystem.
* Read-only filesystems are not supported because write access is always required
  for the Windows registry and SAM database. However, read-only volumes are supported.
* Volume user-masks and permissions are not available. Because the SAM is not shared
  between the host & container, there's no mapping between them. All permissions are
  resolved within the context of the container.

As a result, the following storage functionality is **not** supported on Windows nodes:

* Volume subpath mounts: only the entire volume can be mounted in a Windows container
* Subpath volume mounting for Secrets
* Host mount projection
* Read-only root filesystem (mapped volumes still support `readOnly`)
* Block device mapping
* Memory as the storage medium (for example, `emptyDir.medium` set to `Memory`)
* File system features like uid/gid; per-user Linux filesystem permissions
* DefaultMode (due to UID/GID dependency)
* NFS based storage/volume support
* Expanding the mounted volume (resizefs)

Kubernetes {{< glossary_tooltip text="volumes" term_id="volume" >}} enable complex
applications, with data persistence and Pod volume sharing requirements, to be deployed
on Kubernetes. Management of persistent volumes associated with a specific storage
back-end or protocol includes actions such as provisioning/de-provisioning/resizing
of volumes, attaching/detaching a volume to/from a Kubernetes node and
mounting/dismounting a volume to/from individual containers in a pod that needs to
persist data.

The code implementing these volume management actions for a specific storage back-end
or protocol is shipped in the form of a Kubernetes volume
[plugin](/docs/concepts/storage/volumes/#types-of-volumes).
The following broad classes of Kubernetes volume plugins are supported on Windows:

### In-tree volume plugins

Code associated with in-tree volume plugins ship as part of the core Kubernetes code
base. Deployment of in-tree volume plugins do not require installation of additional
scripts or deployment of separate containerized plugin components. These plugins can
handle provisioning/de-provisioning and resizing of volumes in the storage backend,
attaching/detaching of volumes to/from a Kubernetes node and mounting/dismounting a
volume to/from individual containers in a pod. The following in-tree plugins support
persistent storage on Windows nodes:

* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk)
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile)
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcepersistentdisk)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume)

## FlexVolume plugins

Code associated with [FlexVolume](/docs/concepts/storage/volumes/#flexVolume)
plugins ship as out-of-tree scripts or binaries that need to be deployed directly
on the host. FlexVolume plugins handle attaching/detaching of volumes to/from a
Kubernetes node and mounting/dismounting a volume to/from individual containers
in a pod. Provisioning/De-provisioning of persistent volumes associated
with FlexVolume plugins may be handled through an external provisioner that
is typically separate from the FlexVolume plugins. The following FlexVolume
[plugins](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows),
deployed as PowerShell scripts on the host, support Windows nodes:

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

## CSI plugins

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Code associated with {{< glossary_tooltip text="CSI" term_id="csi" >}} plugins ship
as out-of-tree scripts and binaries that are typically distributed as container
images and deployed using standard Kubernetes constructs like DaemonSets and
StatefulSets.
CSI plugins handle a wide range of volume management actions in Kubernetes:
provisioning/de-provisioning/resizing of volumes, attaching/detaching of volumes
to/from a Kubernetes node and mounting/dismounting a volume to/from individual
containers in a pod, backup/restore of persistent data using snapshots and cloning.
CSI plugins typically consist of node plugins (that run on each node as a DaemonSet)
and controller plugins.

CSI node plugins (especially those associated with persistent volumes exposed as
either block devices or over a shared file-system) need to perform various privileged
operations like scanning of disk devices, mounting of file systems, etc. These
operations differ for each host operating system. For Linux worker nodes, containerized
CSI node plugins are typically deployed as privileged containers. For Windows worker
nodes, privileged operations for containerized CSI node plugins is supported using
[csi-proxy](https://github.com/kubernetes-csi/csi-proxy), a community-managed,
stand-alone binary that needs to be pre-installed on each Windows node.

For more details, refer to the deployment guide of the CSI plugin you wish to deploy.
