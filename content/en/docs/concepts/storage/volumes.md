---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Volumes
api_metadata:
- apiVersion: ""
  kind: "Volume"
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetes {{< glossary_tooltip text="volumes" term_id="volume">}} provide a way for containers in a {{< glossary_tooltip text="Pod" term_id="pod" >}}
to access and share data via the filesystem. There are different kinds of volume that you can use for different purposes,
such as:

- populating a configuration file based on a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
  or a {{< glossary_tooltip text="Secret" term_id="secret" >}}
- providing some temporary scratch space for a Pod
- sharing a filesystem between two different containers in the same Pod
- sharing a filesystem between two different Pods (even if those Pods run on different nodes)
- durably storing data so that it stays available even if the Pod restarts or is replaced
- passing configuration information to an app running in a container, based on details of the Pod
  the container is in
  (for example: telling a {{< glossary_tooltip text="sidecar container" term_id="sidecar-container" >}}
  what namespace the Pod is running in)
- providing read-only access to data in a different container image

Data sharing can be between different local processes within a container, or between different containers,
or between Pods.

## Why volumes are important

- **Data persistence:** On-disk files in a {{< glossary_tooltip text="container" term_id="container">}} are ephemeral, which presents some problems for
  non-trivial applications when running in containers. One problem occurs when
  a container crashes or is stopped; the container state is not saved, so all of the
  files that were created or modified during the lifetime of the container are lost.
  After a crash, kubelet restarts the container with a clean state.

- **Shared storage:** Another problem occurs when multiple containers are running in a `Pod` and
  need to share files. It can be challenging to set up
  and access a shared filesystem across all of the containers.

The Kubernetes {{< glossary_tooltip text="volume" term_id="volume" >}} abstraction
can help you to solve both of these problems.

Before you learn about {{< glossary_tooltip text="volumes" term_id="volume" >}}, {{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}, and {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}, you should read up
about {{< glossary_tooltip term_id="Pod" text="Pods" >}} and make sure that you understand how
Kubernetes uses Pods to run containers.
  
<!-- body -->

## How volumes work

Kubernetes supports many types of volumes. A {{< glossary_tooltip term_id="pod" text="Pod" >}}
can use any number of volume types simultaneously.
[Ephemeral volume](/docs/concepts/storage/ephemeral-volumes/) types have a lifetime linked to a specific Pod,
but [persistent volumes](/docs/concepts/storage/persistent-volumes/) exist beyond
the lifetime of any individual Pod. When a Pod ceases to exist, Kubernetes destroys ephemeral volumes;
however, Kubernetes does not destroy persistent volumes.
For any kind of volume in a given Pod, data is preserved across container restarts.

At its core, a volume is a directory, possibly with some data in it, which
is accessible to the containers in a pod. How that directory comes to be, the
medium that backs it, and the contents of it are determined by the particular
volume type used.

To use a volume, specify the volumes to provide for the Pod in `.spec.volumes`
and declare where to mount those volumes into containers in `.spec.containers[*].volumeMounts`.

When a Pod is launched, a process in the container sees a filesystem view composed from the initial contents of
the {{< glossary_tooltip text="container image" term_id="image" >}}, plus volumes
(if defined) mounted inside the container.
The process sees a root filesystem that initially matches the contents of the container image.
Any writes to within that filesystem hierarchy, if allowed, affect what that process views
when it performs a subsequent filesystem access.
Volumes are mounted at [specified paths](#using-subpath) within the container filesystem.
For each container defined within a Pod, you must independently specify where
to mount each volume that the container uses.

Volumes cannot mount within other volumes (but see [Using subPath](#using-subpath)
for a related mechanism). Also, a volume cannot contain a hard link to anything in
a different volume.

## Types of volumes {#volume-types}

<a id="types-of-volumes"></a>

Kubernetes supports the following types of
{{< glossary_tooltip text="volumes" term_id="volume" >}}.

<a id="gcepersistentdisk"></a>
<a id="gitrepo"></a>
<a id="portworxvolume"></a>
<a id="portworx-csi-migration"></a>
<a id="awselasticblockstore"></a>
<a id="azuredisk"></a>
<a id="azurefile"></a>
<a id="cephfs"></a>
<a id="cinder"></a>
<a id="glusterfs"></a>
<a id="rbd"></a>
<a id="storageos"></a>
<a id="vspherevolume"></a>
<a id="vsphere-csi-migration"></a>
<a id="flocker"></a>
<a id="quobyte"></a>
<a id="scaleio"></a>
See [Volume Types](/docs/reference/storage/volume-types/) for details of every
volume type, including deprecated and removed types.

### Volumes that share the Pod's lifecycle {#pod-lifetime-volume-types}

Kubernetes creates these volumes when the Pod starts on a node,
then deletes them when the Pod is removed.

You can only use them in a Pod.

* <a id="configmap"></a>[`configMap`](/docs/reference/storage/volume-types/#configmap): mounts the
  data from a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} in a
  read-only directory.
* <a id="secret"></a>[`secret`](/docs/reference/storage/volume-types/#secret): mounts the data from
  a {{< glossary_tooltip text="Secret" term_id="secret" >}} in a read-only
  directory.
* <a id="downwardapi"></a>[`downwardAPI`](/docs/reference/storage/volume-types/#downwardapi): exposes
  information about the Pod, such as its
  {{< glossary_tooltip text="labels" term_id="label" >}}, through the
  {{< glossary_tooltip text="downward API" term_id="downward-api" >}}, in a
  read-only directory.
* <a id="projected"></a>[`projected`](/docs/reference/storage/volume-types/#projected): combines
  several sources, such as a {{< glossary_tooltip text="Secret" term_id="secret">}} and a {{< glossary_tooltip text="ConfigMap" term_id="configmap">}}, into one directory.
* <a id="emptydir"></a>
  <a id="emptydir-configuration-example"></a>
  <a id="emptydir-memory-configuration-example"></a>
  <a id="emptydir-permissions-configuration-example"></a>
  [`emptyDir`](/docs/reference/storage/volume-types/#emptydir): empty scratch
  space that is initialized when the Pod is assigned to a
  {{< glossary_tooltip text="node" term_id="node" >}}, and is deleted when the
  Pod is removed from that node.
* <a id="image"></a>
  <a id="image-volume-pod-status"></a>
  [`image`](/docs/reference/storage/volume-types/#image): the files from a
  {{< glossary_tooltip text="container image" term_id="image" >}} or artifact,
  mounted read-only.

### Volumes that use existing storage {#existing-storage-volume-types}

These volumes connect to storage that exists outside the Pod.
Their data persist after the Pod is removed.

You can use `hostPath`, `nfs`, `iscsi`, and `fc` in a Pod or in a {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}.

* <a id="hostpath"></a>
  <a id="hostpath-volume-types"></a>
  <a id="hostpath-configuration-example"></a>
  <a id="hostpath-fileorcreate-example"></a>
  [`hostPath`](/docs/reference/storage/volume-types/#hostpath): a file or
  directory from the node's filesystem.
* <a id="local"></a>[`local`](/docs/reference/storage/volume-types/#local): a disk, partition or
  directory on the node's filesystem.
* <a id="nfs"></a>[`nfs`](/docs/reference/storage/volume-types/#nfs): an existing NFS share.
* <a id="iscsi"></a>[`iscsi`](/docs/reference/storage/volume-types/#iscsi): an existing iSCSI
  volume.
* <a id="fc"></a>[`fc`](/docs/reference/storage/volume-types/#fc): an existing Fibre Channel
  block storage volume.

{{< note >}}
You can only use `local` in a PersistentVolume.
{{< /note >}}

### Volumes that use a PersistentVolumeClaim {#persistentvolumeclaim-volume-types}

These volumes request storage from a {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim">}}.

The PersistentVolumeClaim binds to a {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume">}}, which provides the underlying storage.

The PersistentVolume can use a type from the previous group, or an out-of-tree plugin.
You can only use these types in a Pod.

* <a id="persistentvolumeclaim"></a>[`persistentVolumeClaim`](/docs/reference/storage/volume-types/#persistentvolumeclaim):
  durable storage that you request through a {{< glossary_tooltip
  text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}.
* [`ephemeral`](/docs/reference/storage/volume-types/#ephemeral):
  a {{< glossary_tooltip
  text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} that Kubernetes creates and deletes with the Pod.

### Volumes from out-of-tree plugins {#out-of-tree-volume-types}

These types use out-of-tree
{{< glossary_tooltip text="volume plugins" term_id="volume-plugin" >}}.
These are plugins developed by storage vendors outside of the
Kubernetes code base.

You can use these types in a Pod or in a PersistentVolume.

For details, see [Out-of-tree volume plugins](#out-of-tree-volume-plugins).

* [`csi`](#csi): a driver that implements the
  {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}
  (CSI).
* [`flexVolume`](#flexvolume) (deprecated): an older, exec-based plugin
  interface.

{{< note >}}
In a Pod, `csi` only works for drivers that support ephemeral volumes.
{{< /note >}}

## Using subPath {#using-subpath}

Sometimes, it is useful to share one volume for multiple uses in a single Pod.
The `volumeMounts[*].subPath` property specifies a sub-path inside the referenced volume
instead of its root.

The following example shows how to configure a Pod with a LAMP stack (Linux, Apache, MySQL, PHP)
using a single, shared volume. This sample `subPath` configuration is not recommended
for production use.

The PHP application's code and assets map to the volume's `html` folder and
the MySQL database is stored in the volume's `mysql` folder. For example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: "rootpasswd"
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

### Using subPath with expanded environment variables {#using-subpath-expanded-environment}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Use the `subPathExpr` field to construct `subPath` directory names from
downward API environment variables.
The `subPath` and `subPathExpr` properties are mutually exclusive.

In this example, a `Pod` uses `subPathExpr` to create a directory `pod1` within
the `hostPath` volume `/var/log/pods`.
The `hostPath` volume takes the `Pod` name from the `downwardAPI`.
The host directory `/var/log/pods/pod1` is mounted at `/logs` in the container.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: container1
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    image: busybox:1.28
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      # The variable expansion uses round brackets (not curly brackets).
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

## Resources

The storage medium (such as Disk or SSD) of an `emptyDir` volume is determined by the
medium of the filesystem holding the kubelet root dir (typically
`/var/lib/kubelet`). There is no limit on how much space an `emptyDir` or
`hostPath` volume can consume, and no isolation between containers or
Pods.

To learn about requesting space using a resource specification, see
[how to manage resources](/docs/concepts/configuration/manage-resources-containers/).

## Out-of-tree volume plugins

The out-of-tree volume plugins include
{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI), and also
FlexVolume (which is deprecated). These plugins enable storage vendors to create custom storage plugins
without adding their plugin source code to the Kubernetes repository.

Previously, all volume plugins were "in-tree". The "in-tree" plugins were built, linked, compiled,
and shipped with the core Kubernetes binaries. This meant that adding a new storage system to
Kubernetes (a volume plugin) required checking code into the core Kubernetes code repository.

Both CSI and FlexVolume allow volume plugins to be developed independently of
the Kubernetes code base, and deployed (installed) on Kubernetes clusters as
extensions.

For storage vendors looking to create an out-of-tree volume plugin, please refer
to the [volume plugin FAQ](https://github.com/kubernetes/community/blob/main/sig-storage/volume-plugin-faq.md).

### csi

[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)
(CSI) defines a standard interface for container orchestration systems (like
Kubernetes) to expose arbitrary storage systems to their container workloads.

Please read the [CSI design proposal](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
for more information.

{{< note >}}
Support for CSI spec versions 0.2 and 0.3 is deprecated in Kubernetes
v1.13 and will be removed in a future release.
{{< /note >}}

{{< note >}}
CSI drivers may not be compatible across all Kubernetes releases.
Please check the specific CSI driver's documentation for supported
deployment steps for each Kubernetes release and a compatibility matrix.
{{< /note >}}

Once a CSI-compatible volume driver is deployed on a Kubernetes cluster, users
may use the `csi` volume type to attach or mount the volumes exposed by the
CSI driver.

A `csi` volume can be used in a Pod in three different ways:

* through a reference to a [PersistentVolumeClaim](/docs/reference/storage/volume-types/#persistentvolumeclaim)
* with a [generic ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
* with a [CSI ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
  if the driver supports that

The following fields are available to storage administrators to configure a CSI
persistent volume:

* `driver`: A string value that specifies the name of the volume driver to use.
  This value must correspond to the value returned in the `GetPluginInfoResponse`
  by the CSI driver as defined in the
  [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo).
  It is used by Kubernetes to identify which CSI driver to call out to, and by
  CSI driver components to identify which PV objects belong to the CSI driver.
* `volumeHandle`: A string value that uniquely identifies the volume. This value
  must correspond to the value returned in the `volume.id` field of the
  `CreateVolumeResponse` by the CSI driver as defined in the
  [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The value is passed as `volume_id` in all calls to the CSI volume driver when
  referencing the volume.
* `readOnly`: An optional boolean value indicating whether the volume is to be
  "ControllerPublished" (attached) as read-only. Default is false. This value is passed
  to the CSI driver via the `readonly` field in the `ControllerPublishVolumeRequest`.
* `fsType`: If the PV's `VolumeMode` is `Filesystem`, then this field may be used
  to specify the filesystem that should be used to mount the volume. If the
  volume has not been formatted and formatting is supported, this value will be
  used to format the volume.
  This value is passed to the CSI driver via the `VolumeCapability` field of
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
* `volumeAttributes`: A map of string to string that specifies static properties
  of a volume. This map must correspond to the map returned in the
  `volume.attributes` field of the `CreateVolumeResponse` by the CSI driver as
  defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The map is passed to the CSI driver via the `volume_context` field in the
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
* `controllerPublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `ControllerPublishVolume` and `ControllerUnpublishVolume` calls. This field is
  optional, and may be empty if no secret is required. If the Secret
  contains more than one secret, all secrets are passed.
* `nodeExpandSecretRef`: A reference to the secret containing sensitive
  information to pass to the CSI driver to complete the CSI
  `NodeExpandVolume` call. This field is optional and may be empty if no
  secret is required. If the object contains more than one secret, all
  secrets are passed. When you have configured secret data for node-initiated
  volume expansion, the kubelet passes that data via the `NodeExpandVolume()`
  call to the CSI driver. All supported versions of Kubernetes offer the
  `nodeExpandSecretRef` field, and have it available by default. Kubernetes releases
  prior to v1.25 did not include this support.
* Enable the [feature gate](/docs/reference/command-line-tools-reference/feature-gates-removed/)
  named `CSINodeExpandSecret` for each kube-apiserver and for the kubelet on every
  node. Since Kubernetes version 1.27, this feature has been enabled by default
  and no explicit enablement of the feature gate is required.
  You must also be using a CSI driver that supports or requires secret data during
  node-initiated storage resize operations.
* `nodePublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodePublishVolume` call. This field is optional and may be empty if no
  secret is required. If the secret object contains more than one secret, all
  secrets are passed.
* `nodeStageSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodeStageVolume` call. This field is optional and may be empty if no secret
  is required. If the Secret contains more than one secret, all secrets
  are passed.

#### CSI raw block volume support

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Vendors with external CSI drivers can implement raw block volume support
in Kubernetes workloads.

You can set up your
[PersistentVolume/PersistentVolumeClaim with raw block volume support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)
as usual, without any CSI-specific changes.

#### CSI ephemeral volumes

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

You can directly configure CSI volumes within the Pod
specification. Volumes specified in this way are ephemeral and do not
persist across Pod restarts. See
[Ephemeral Volumes](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
for more information.

For more information on how to develop a CSI driver, refer to the
[kubernetes-csi documentation](https://kubernetes-csi.github.io/docs/)

#### Windows CSI proxy

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

CSI node plugins need to perform various privileged
operations like scanning of disk devices and mounting of file systems. These operations
differ for each host operating system. For Linux worker nodes, containerized CSI node
plugins are typically deployed as privileged containers. For Windows worker nodes,
privileged operations for containerized CSI node plugins are supported using
[csi-proxy](https://github.com/kubernetes-csi/csi-proxy), a community-managed,
stand-alone binary that needs to be pre-installed on each Windows node.

For more details, refer to the deployment guide of the CSI plugin you wish to deploy.

#### Migrating to CSI drivers from in-tree plugins

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

The `CSIMigration` feature directs operations against existing in-tree
plugins to corresponding CSI plugins (which are expected to be installed and configured).
As a result, operators do not have to make any
configuration changes to existing Storage Classes, PersistentVolumes, or PersistentVolumeClaims
(referring to in-tree plugins) when transitioning to a CSI driver that supersedes an in-tree plugin.

{{< note >}}
Existing PVs created by an in-tree volume plugin can still be used in the future without any configuration
changes, even after the migration to CSI is completed for that volume type, and even after you upgrade to a
version of Kubernetes that doesn't have compiled-in support for that kind of storage.

As part of that migration, you - or another cluster administrator - **must** have installed and configured
the appropriate CSI driver for that storage. The core of Kubernetes does not install that software for you.

---

After that migration, you can also define new PVCs and PVs that refer to the legacy, built-in
storage integrations.
Provided you have the appropriate CSI driver installed and configured, the PV creation continues
to work, even for brand-new volumes. The actual storage management now happens through
the CSI driver.
{{< /note >}}

The operations and features that are supported include:
provisioning/delete, attach/detach, mount/unmount, and resizing of volumes.

In-tree plugins that support `CSIMigration` and have a corresponding CSI driver implemented
are listed in [Removed volume types](/docs/reference/storage/volume-types/#removed-volume-types).

### flexVolume (deprecated)   {#flexvolume}

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

FlexVolume is an out-of-tree plugin interface that uses an exec-based model to interface
with storage drivers. The FlexVolume driver binaries must be installed in a pre-defined
volume plugin path on each node, and in some cases, the control plane nodes as well.

Pods interact with FlexVolume drivers through the `flexVolume` in-tree volume plugin.

The following FlexVolume [plugins](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows),
deployed as PowerShell scripts on the host, support Windows nodes:

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

{{< note >}}
FlexVolume is deprecated. Using an out-of-tree CSI driver is the recommended way to integrate external storage with Kubernetes.

Maintainers of the FlexVolume driver should implement a CSI Driver and help migrate users of FlexVolume drivers to CSI.
Users of FlexVolume should move their workloads to use the equivalent CSI Driver.
{{< /note >}}

## Mount propagation

{{< caution >}}
Mount propagation is a low-level feature that does not work consistently on all
volume types. The Kubernetes project recommends only using mount propagation with `hostPath`
or memory-backed `emptyDir` volumes. See
[Kubernetes issue #95049](https://github.com/kubernetes/kubernetes/issues/95049)
for more context.
{{< /caution >}}

Mount propagation allows for sharing volumes mounted by a container to
other containers in the same Pod, or even to other Pods on the same node.

Mount propagation of a volume is controlled by the `mountPropagation` field
in `containers[*].volumeMounts`. Its values are:

* `None` - This volume mount will not receive any subsequent mounts
  that are mounted to this volume or any of its subdirectories by the host.
  In a similar fashion, no mounts created by the container will be visible on
  the host. This is the default mode.

  This mode is equal to `rprivate` mount propagation as described in
  [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

  However, the CRI runtime may choose `rslave` mount propagation (i.e.,
  `HostToContainer`) when `rprivate` propagation is not applicable.
  cri-dockerd (Docker) is known to choose `rslave` mount propagation when the
  mount source contains the Docker daemon's root directory (`/var/lib/docker`).

* `HostToContainer` - This volume mount will receive all subsequent mounts
  that are mounted to this volume or any of its subdirectories.

  In other words, if the host mounts anything inside the volume mount, the
  container will see it mounted there.

  Similarly, if any Pod with `Bidirectional` mount propagation to the same
  volume mounts anything there, the container with `HostToContainer` mount
  propagation will see it.

  This mode is equal to `rslave` mount propagation as described in the
  [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

* `Bidirectional` - This volume mount behaves the same as the `HostToContainer` mount.
  In addition, all volume mounts created by the container will be propagated
  back to the host and to all containers of all Pods that use the same volume.

  A typical use case for this mode is a Pod with a FlexVolume or CSI driver, or
  a Pod that needs to mount something on the host using a `hostPath` volume.

  This mode is equal to `rshared` mount propagation as described in the
  [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

  {{< warning >}}
  `Bidirectional` mount propagation can be dangerous. It can damage
  the host operating system, and therefore, it is allowed only in privileged
  containers. Familiarity with Linux kernel behavior is strongly recommended.
  In addition, any volume mounts created by containers in Pods must be destroyed
  (unmounted) by the containers on termination.
  {{< /warning >}}

## Read-only mounts

A mount can be made read-only by setting the `.spec.containers[*].volumeMounts[*].readOnly`
field to `true`.
This does not make the volume itself read-only, but that specific container will
not be able to write to it.
Other containers in the Pod may mount the same volume as read-write.

On Linux, read-only mounts are not recursively read-only by default.
For example, consider a Pod that mounts the hosts `/mnt` as a `hostPath` volume. If
there is another filesystem mounted read-write on `/mnt/<SUBMOUNT>` (such as tmpfs,
NFS, or USB storage), the volume mounted into the container(s) will also have a writeable
`/mnt/<SUBMOUNT>`, even if the mount itself was specified as read-only.

### Recursive read-only mounts

{{< feature-state feature_gate_name="RecursiveReadOnlyMounts" >}}

Recursive read-only mounts can be enabled by setting the
`RecursiveReadOnlyMounts` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for kubelet and kube-apiserver, and setting the `.spec.containers[*].volumeMounts[*].recursiveReadOnly`
field for a Pod.

The allowed values are:

* `Disabled` (default): no effect.

* `Enabled`: makes the mount recursively read-only.
  Needs all the following requirements to be satisfied:

  * `readOnly` is set to `true`
  * `mountPropagation` is unset, or set to `None`
  * The host is running with Linux kernel v5.12 or later
  * The [CRI-level](/docs/concepts/architecture/cri) container runtime supports recursive read-only mounts
  * The OCI-level container runtime supports recursive read-only mounts.
    
  It will fail if any of these is not true.

* `IfPossible`: attempts to apply `Enabled`, and falls back to `Disabled`
  if the feature is not supported by the kernel or the runtime class.

Example:
{{% code_sample file="storage/rro.yaml" %}}

When this property is recognized by kubelet and kube-apiserver,
the `.status.containerStatuses[*].volumeMounts[*].recursiveReadOnly` field is set to either
`Enabled` or `Disabled`.

## File owner

### Group ownership (GID)

Volume file group ownership (GID) is controlled by the pod's `spec.securityContext.fsGroup`.

For detailed configuration steps, refer to
[Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).

### User ownership (UID)

{{< feature-state feature_gate_name="AtomicWriteVolumeUserFields" >}}

Setting the `AtomicWriteVolumeUserFields` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enables file user ownership (UID) fields of `configMap`, `secret`, `downwardAPI` and `projected` volumes.

When `defaultUser` is specified at the volume level, it sets the owner UID for all its data files at creation time.
At the item level, the `user` field controls owner UID of an individual file and takes precedence over `defaultUser`.

Example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-user-fields-example
spec:
  containers:
  - name: test
    image: busybox:1.28
    command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
    volumeMounts:
    - name: volA
      mountPath: /mnt/volA
    - name: volB
      mountPath: /mnt/volB
    - name: volC
      mountPath: /mnt/volC
  volumes:
  - name: volA
    configMap:
      defaultUser: 1000
      name: cm1
      items:
      - key: foo # Owner=defaultUser
        path: foo
      - key: bar # Owner=user
        path: bar
        user: 1001
  - name: volB
    secret: # Owner=defaultUser
      defaultUser: 1000
      secretName: secret1
  - name: volC
    projected:
      sources:
      - secret:
          name: secret2
          items:
          - key: moo # Owner=root
            path: moo
          - key: baa # Owner=user
            path: baa
            user: 1000
```

#### Implementations {#implementations-rro}

{{% thirdparty-content %}}

The following container runtimes are known to support recursive read-only mounts.

CRI-level:

- [containerd](https://containerd.io/), since v2.0
- [CRI-O](https://cri-o.io/), since v1.30

OCI-level:

- [runc](https://runc.io/), since v1.1
- [crun](https://github.com/containers/crun), since v1.8.6

## Bind mount options

{{< feature-state feature_gate_name="VolumeBindMountOptions" >}}

The `.spec.containers[*].volumeMounts[*].bindMountOptions` field lets you apply security-related
Linux bind mount flags to any volume mount. The allowed values are:

* `noexec` - prevents execution of binaries on the mounted volume
* `nodev` - ignores device special files on the mounted volume
* `nosuid` - ignores set-user-identifier or set-group-identifier bits on the mounted volume

These options apply per container, so different containers in the same Pod can mount
the same volume with different bind mount options. The field is not supported with
[image volumes](/docs/reference/storage/volume-types/#image).

{{< note >}}
The container runtime (such as containerd or CRI-O) must support the `mount_options`
field in the CRI `Mount` message. If the runtime does not advertise support, the kubelet
rejects Pods that use `bindMountOptions`. This field has no effect on Windows nodes.
{{< /note >}}

## {{% heading "whatsnext" %}}

Follow an example of [deploying WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
