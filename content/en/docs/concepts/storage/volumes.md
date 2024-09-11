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

On-disk files in a container are ephemeral, which presents some problems for
non-trivial applications when running in containers. One problem occurs when 
a container crashes or is stopped. Container state is not saved so all of the 
files that were created or modified during the lifetime of the container are lost. 
During a crash, kubelet restarts the container with a clean state. 
Another problem occurs when multiple containers are running in a `Pod` and 
need to share files. It can be challenging to setup 
and access a shared filesystem across all of the containers.
The Kubernetes {{< glossary_tooltip text="volume" term_id="volume" >}} abstraction
solves both of these problems.
Familiarity with [Pods](/docs/concepts/workloads/pods/) is suggested.

<!-- body -->

## Background

Kubernetes supports many types of volumes. A {{< glossary_tooltip term_id="pod" text="Pod" >}}
can use any number of volume types simultaneously.
[Ephemeral volume](/docs/concepts/storage/ephemeral-volumes/) types have a lifetime of a pod, 
but [persistent volumes](/docs/concepts/storage/persistent-volumes/) exist beyond
the lifetime of a pod. When a pod ceases to exist, Kubernetes destroys ephemeral volumes;
however, Kubernetes does not destroy persistent volumes.
For any kind of volume in a given pod, data is preserved across container restarts.

At its core, a volume is a directory, possibly with some data in it, which
is accessible to the containers in a pod. How that directory comes to be, the
medium that backs it, and the contents of it are determined by the particular
volume type used.

To use a volume, specify the volumes to provide for the Pod in `.spec.volumes`
and declare where to mount those volumes into containers in `.spec.containers[*].volumeMounts`.
A process in a container sees a filesystem view composed from the initial contents of
the {{< glossary_tooltip text="container image" term_id="image" >}}, plus volumes
(if defined) mounted inside the container.
The process sees a root filesystem that initially matches the contents of the container
image.
Any writes to within that filesystem hierarchy, if allowed, affect what that process views
when it performs a subsequent filesystem access.
Volumes mount at the [specified paths](#using-subpath) within
the image.
For each container defined within a Pod, you must independently specify where
to mount each volume that the container uses.

Volumes cannot mount within other volumes (but see [Using subPath](#using-subpath)
for a related mechanism). Also, a volume cannot contain a hard link to anything in
a different volume.

## Types of volumes {#volume-types}

Kubernetes supports several types of volumes.

### awsElasticBlockStore (deprecated) {#awselasticblockstore}

<!-- maintenance note: OK to remove all mention of awsElasticBlockStore once the v1.27 release of
Kubernetes has gone out of support -->

In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `awsElasticBlockStore` type
are redirected to the `ebs.csi.aws.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.


The AWSElasticBlockStore in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.

The Kubernetes project suggests that you use the [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) third party
storage driver instead.

### azureDisk (deprecated) {#azuredisk}

<!-- maintenance note: OK to remove all mention of azureDisk once the v1.27 release of
Kubernetes has gone out of support -->

In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `azureDisk` type
are redirected to the `disk.csi.azure.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The AzureDisk in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.

The Kubernetes project suggests that you use the [Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver) third party
storage driver instead.

### azureFile (deprecated) {#azurefile}

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

The `azureFile` volume type mounts a Microsoft Azure File volume (SMB 2.1 and 3.0)
into a pod.

For more details, see the [`azureFile` volume plugin](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md).

#### azureFile CSI migration

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

The `CSIMigration` feature for `azureFile`, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `file.csi.azure.com` Container
Storage Interface (CSI) Driver. In order to use this feature, the [Azure File CSI
Driver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
must be installed on the cluster and the `CSIMigrationAzureFile`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) must be enabled.

Azure File CSI driver does not support using same volume with different fsgroups. If
`CSIMigrationAzureFile` is enabled, using same volume with different fsgroups won't be supported at all.

#### azureFile CSI migration complete

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

To disable the `azureFile` storage plugin from being loaded by the controller manager
and the kubelet, set the `InTreePluginAzureFileUnregister` flag to `true`.

### cephfs (removed) {#cephfs}

<!-- maintenance note: OK to remove all mention of cephfs once the v1.30 release of
Kubernetes has gone out of support -->

Kubernetes {{< skew currentVersion >}} does not include a `cephfs` volume type.

The `cephfs` in-tree storage driver was deprecated in the Kubernetes v1.28 release and then removed entirely in the v1.31 release.

### cinder (deprecated) {#cinder}

<!-- maintenance note: OK to remove all mention of cinder once the v1.26 release of
Kubernetes has gone out of support -->

In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `cinder` type
are redirected to the `cinder.csi.openstack.org` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The OpenStack Cinder in-tree storage driver was deprecated in the Kubernetes v1.11 release
and then removed entirely in the v1.26 release.

The Kubernetes project suggests that you use the 
[OpenStack Cinder](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)
third party storage driver instead.

### configMap

A [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
provides a way to inject configuration data into pods.
The data stored in a ConfigMap can be referenced in a volume of type
`configMap` and then consumed by containerized applications running in a pod.

When referencing a ConfigMap, you provide the name of the ConfigMap in the
volume. You can customize the path to use for a specific
entry in the ConfigMap. The following configuration shows how to mount
the `log-config` ConfigMap onto a Pod called `configmap-pod`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox:1.28
      command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

The `log-config` ConfigMap is mounted as a volume, and all contents stored in
its `log_level` entry are mounted into the Pod at path `/etc/config/log_level`.
Note that this path is derived from the volume's `mountPath` and the `path`
keyed with `log_level`.

{{< note >}}

* You must [create a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap)
  before you can use it.

* A ConfigMap is always mounted as `readOnly`.

* A container using a ConfigMap as a [`subPath`](#using-subpath) volume mount will not
  receive ConfigMap updates.
  
* Text data is exposed as files using the UTF-8 character encoding. For other character encodings, use `binaryData`.

{{< /note >}}

### downwardAPI {#downwardapi}

A `downwardAPI` volume makes {{< glossary_tooltip term_id="downward-api" text="downward API" >}}
data available to applications. Within the volume, you can find the exposed
data as read-only files in plain text format.

{{< note >}}
A container using the downward API as a [`subPath`](#using-subpath) volume mount does not
receive updates when field values change.
{{< /note >}}

See [Expose Pod Information to Containers Through Files](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
to learn more.

### emptyDir {#emptydir}

For a Pod that defines an `emptyDir` volume, the volume is created when the Pod is assigned to a node.
As the name says, the `emptyDir` volume is initially empty. All containers in the Pod can read and write the same
files in the `emptyDir` volume, though that volume can be mounted at the same
or different paths in each container. When a Pod is removed from a node for
any reason, the data in the `emptyDir` is deleted permanently.

{{< note >}}
A container crashing does *not* remove a Pod from a node. The data in an `emptyDir` volume
is safe across container crashes.
{{< /note >}}

Some uses for an `emptyDir` are:

* scratch space, such as for a disk-based merge sort
* checkpointing a long computation for recovery from crashes
* holding files that a content-manager container fetches while a webserver
  container serves the data

The `emptyDir.medium` field controls where `emptyDir` volumes are stored. By
default `emptyDir` volumes are stored on whatever medium that backs the node
such as disk, SSD, or network storage, depending on your environment. If you set
the `emptyDir.medium` field to `"Memory"`, Kubernetes mounts a tmpfs (RAM-backed
filesystem) for you instead.  While tmpfs is very fast be aware that, unlike
disks, files you write count against the memory limit of the container that wrote them.


A size limit can be specified for the default medium, which limits the capacity
of the `emptyDir` volume. The storage is allocated from [node ephemeral
storage](/docs/concepts/configuration/manage-resources-containers/#setting-requests-and-limits-for-local-ephemeral-storage).
If that is filled up from another source (for example, log files or image
overlays), the `emptyDir` may run out of capacity before this limit.

{{< note >}}
You can specify a size for memory backed volumes, provided that the `SizeMemoryBackedVolumes`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in your cluster (this has been beta, and active by default, since the Kubernetes 1.22 release).
If you don't specify a volume size, memory backed volumes are sized to node allocatable memory.
{{< /note>}}

{{< caution >}}
Please check [here](/docs/concepts/configuration/manage-resources-containers/#memory-backed-emptydir)
for points to note in terms of resource management when using memory-backed `emptyDir`.
{{< /caution >}}

#### emptyDir configuration example

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir:
      sizeLimit: 500Mi
```

### fc (fibre channel) {#fc}

An `fc` volume type allows an existing fibre channel block storage volume
to mount in a Pod. You can specify single or multiple target world wide names (WWNs)
using the parameter `targetWWNs` in your Volume configuration. If multiple WWNs are specified,
targetWWNs expect that those WWNs are from multi-path connections.

{{< note >}}
You must configure FC SAN Zoning to allocate and mask those LUNs (volumes) to the target WWNs
beforehand so that Kubernetes hosts can access them.
{{< /note >}}

See the [fibre channel example](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel)
for more details.

### gcePersistentDisk (deprecated) {#gcepersistentdisk}

In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `gcePersistentDisk` type
are redirected to the `pd.csi.storage.gke.io` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The `gcePersistentDisk` in-tree storage driver was deprecated in the Kubernetes v1.17 release
and then removed entirely in the v1.28 release.

The Kubernetes project suggests that you use the [Google Compute Engine Persistent Disk CSI](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) 
third party storage driver instead.

### gitRepo (deprecated) {#gitrepo}

{{< warning >}}
The `gitRepo` volume type is deprecated.

To provision a Pod that has a Git repository mounted, you can
mount an
[`emptyDir`](#emptydir) volume into an [init container](/docs/concepts/workloads/pods/init-containers/) that
clones the repo using Git, then mount the
[EmptyDir](#emptydir) into the Pod's container.

---

You can restrict the use of `gitRepo` volumes in your cluster using
[policies](/docs/concepts/policy/) such as
[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).
You can use the following Common Expression Language (CEL) expression as
part of a policy to reject use of `gitRepo` volumes:
`has(object.spec.volumes) || !object.spec.volumes.exists(v, has(v.gitRepo))`.

{{< /warning >}}

A `gitRepo` volume is an example of a volume plugin. This plugin
mounts an empty directory and clones a git repository into this directory
for your Pod to use.

Here is an example of a `gitRepo` volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /mypath
      name: git-volume
  volumes:
  - name: git-volume
    gitRepo:
      repository: "git@somewhere:me/my-git-repository.git"
      revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```
### glusterfs (removed) {#glusterfs}

<!-- maintenance note: OK to remove all mention of glusterfs once the v1.25 release of
Kubernetes has gone out of support -->

Kubernetes {{< skew currentVersion >}} does not include a `glusterfs` volume type.

The GlusterFS in-tree storage driver was deprecated in the Kubernetes v1.25 release
and then removed entirely in the v1.26 release.

### hostPath {#hostpath}

A `hostPath` volume mounts a file or directory from the host node's filesystem
into your Pod. This is not something that most Pods will need, but it offers a
powerful escape hatch for some applications.

{{< warning >}}
Using the `hostPath` volume type presents many security risks.
If you can avoid using a `hostPath` volume, you should. For example,
define a [`local` PersistentVolume](#local), and use that instead.

If you are restricting access to specific directories on the node using
admission-time validation, that restriction is only effective when you
additionally require that any mounts of that `hostPath` volume are
**read only**. If you allow a read-write mount of any host path by an
untrusted Pod, the containers in that Pod may be able to subvert the
read-write host mount.

---

Take care when using `hostPath` volumes, whether these are mounted as read-only
or as read-write, because:

* Access to the host filesystem can expose privileged system credentials (such as for the kubelet) or privileged APIs
  (such as the container runtime socket), that can be used for container escape or to attack other
  parts of the cluster.
* Pods with identical configuration (such as created from a PodTemplate) may
  behave differently on different nodes due to different files on the nodes.
* `hostPath` volume usage is not treated as ephemeral storage usage.
  You need to monitor the disk usage by yourself because excessive `hostPath` disk
  usage will lead to disk pressure on the node.
{{< /warning >}}

Some uses for a `hostPath` are:

* running a container that needs access to node-level system components
  (such as a container that transfers system logs to a central location,
  accessing those logs using a read-only mount of `/var/log`)
* making a configuration file stored on the host system available read-only
  to a {{< glossary_tooltip text="static pod" term_id="static-pod" >}};
  unlike normal Pods, static Pods cannot access ConfigMaps

#### `hostPath` volume types

In addition to the required `path` property, you can optionally specify a
`type` for a `hostPath` volume.

The available values for `type` are:

<!-- empty string represented using U+200C ZERO WIDTH NON-JOINER -->

| Value | Behavior |
|:------|:---------|
| `‌""` | Empty string (default) is for backward compatibility, which means that no checks will be performed before mounting the `hostPath` volume. |
| `DirectoryOrCreate` | If nothing exists at the given path, an empty directory will be created there as needed with permission set to 0755, having the same group and ownership with Kubelet. |
| `Directory` | A directory must exist at the given path |
| `FileOrCreate` | If nothing exists at the given path, an empty file will be created there as needed with permission set to 0644, having the same group and ownership with Kubelet. |
| `File` | A file must exist at the given path |
| `Socket` | A UNIX socket must exist at the given path |
| `CharDevice` | _(Linux nodes only)_ A character device must exist at the given path |
| `BlockDevice` | _(Linux nodes only)_ A block device must exist at the given path |

{{< caution >}}
The `FileOrCreate` mode does **not** create the parent directory of the file. If the parent directory
of the mounted file does not exist, the pod fails to start. To ensure that this mode works,
you can try to mount directories and files separately, as shown in the
[`FileOrCreate` example](#hostpath-fileorcreate-example) for `hostPath`.
{{< /caution >}}

Some files or directories created on the underlying hosts might only be
accessible by root. You then either need to run your process as root in a
[privileged container](/docs/tasks/configure-pod-container/security-context/)
or modify the file permissions on the host to be able to read from
(or write to) a `hostPath` volume.

#### hostPath configuration example

{{< tabs name="hostpath_examples" >}}
{{< tab name="Linux node" codelang="yaml" >}}
---
# This manifest mounts /data/foo on the host as /foo inside the
# single container that runs within the hostpath-example-linux Pod.
#
# The mount into the container is read-only.
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-example-linux
spec:
  os: { name: linux }
  nodeSelector:
    kubernetes.io/os: linux
  containers:
  - name: example-container
    image: registry.k8s.io/test-webserver
    volumeMounts:
    - mountPath: /foo
      name: example-volume
      readOnly: true
  volumes:
  - name: example-volume
    # mount /data/foo, but only if that directory already exists
    hostPath:
      path: /data/foo # directory location on host
      type: Directory # this field is optional
{{< /tab >}}
{{< tab name="Windows node" codelang="yaml" >}}
---
# This manifest mounts C:\Data\foo on the host as C:\foo, inside the
# single container that runs within the hostpath-example-windows Pod.
#
# The mount into the container is read-only.
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-example-windows
spec:
  os: { name: windows }
  nodeSelector:
    kubernetes.io/os: windows
  containers:
  - name: example-container
    image: microsoft/windowsservercore:1709
    volumeMounts:
    - name: example-volume
      mountPath: "C:\\foo"
      readOnly: true
  volumes:
    # mount C:\Data\foo from the host, but only if that directory already exists
  - name: example-volume
    hostPath:
      path: "C:\\Data\\foo" # directory location on host
      type: Directory       # this field is optional
{{< /tab >}}
{{< /tabs >}}

#### hostPath FileOrCreate configuration example {#hostpath-fileorcreate-example}

The following manifest defines a Pod that mounts `/var/local/aaa`
inside the single container in the Pod. If the node does not
already have a path `/var/local/aaa`, the kubelet creates
it as a directory and then mounts it into the Pod.

If `/var/local/aaa` already exists but is not a directory,
the Pod fails. Additionally, the kubelet attempts to make
a file named `/var/local/aaa/1.txt` inside that directory
(as seen from the host); if something already exists at
that path and isn't a regular file, the Pod fails.

Here's the example manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-webserver
spec:
  os: { name: linux }
  nodeSelector:
    kubernetes.io/os: linux
  containers:
  - name: test-webserver
    image: registry.k8s.io/test-webserver:latest
    volumeMounts:
    - mountPath: /var/local/aaa
      name: mydir
    - mountPath: /var/local/aaa/1.txt
      name: myfile
  volumes:
  - name: mydir
    hostPath:
      # Ensure the file directory is created.
      path: /var/local/aaa
      type: DirectoryOrCreate
  - name: myfile
    hostPath:
      path: /var/local/aaa/1.txt
      type: FileOrCreate
```

### image

{{< feature-state feature_gate_name="ImageVolume" >}}

An `image` volume source represents an OCI object (a container image or
artifact) which is available on the kubelet's host machine.

One example to use the `image` volume source is:

{{% code_sample file="pods/image-volumes.yaml" %}}

The volume is resolved at pod startup depending on which `pullPolicy` value is
provided:

`Always`
: the kubelet always attempts to pull the reference. If the pull fails, the kubelet sets the Pod to `Failed`.

`Never`
: the kubelet never pulls the reference and only uses a local image or artifact. The Pod becomes `Failed` if any layers of the image aren't already present locally, or if the manifest for that image isn't already cached.

`IfNotPresent`
: the kubelet pulls if the reference isn't already present on disk. The Pod becomes `Failed` if the reference isn't present and the pull fails.

The volume gets re-resolved if the pod gets deleted and recreated, which means
that new remote content will become available on pod recreation. A failure to
resolve or pull the image during pod startup will block containers from starting
and may add significant latency. Failures will be retried using normal volume
backoff and will be reported on the pod reason and message.

The types of objects that may be mounted by this volume are defined by the
container runtime implementation on a host machine and at minimum must include
all valid types supported by the container image field. The OCI object gets
mounted in a single directory (`spec.containers[*].volumeMounts.mountPath`) by
will be mounted read-only. On Linux, the container runtime typically also mounts the 
volume with file execution blocked (`noexec`).

Beside that:
- Sub path mounts for containers are not supported
  (`spec.containers[*].volumeMounts.subpath`).
- The field `spec.securityContext.fsGroupChangePolicy` has no effect on this
  volume type.
- The [`AlwaysPullImages` Admission Controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  does also work for this volume source like for container images.

The following fields are available for the `image` type:

`reference`
: Artifact reference to be used. For example, you could specify
`registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}` to load the
files from the Kubernetes conformance test image. Behaves in the same way as
`pod.spec.containers[*].image`. Pull secrets will be assembled in the same way
as for the container image by looking up node credentials, service account image
pull secrets, and pod spec image pull secrets. This field is optional to allow
higher level config management to default or override container images in
workload controllers like Deployments and StatefulSets.
[More info about container images](/docs/concepts/containers/images)

`pullPolicy`
: Policy for pulling OCI objects. Possible values are: `Always`, `Never` or
`IfNotPresent`. Defaults to `Always` if `:latest` tag is specified, or
`IfNotPresent` otherwise.

See the [_Use an Image Volume With a Pod_](/docs/tasks/configure-pod-container/image-volumes)
example for more details on how to use the volume source.

### iscsi

An `iscsi` volume allows an existing iSCSI (SCSI over IP) volume to be mounted
into your Pod. Unlike `emptyDir`, which is erased when a Pod is removed, the
contents of an `iscsi` volume are preserved and the volume is merely
unmounted. This means that an iscsi volume can be pre-populated with data, and
that data can be shared between pods.

{{< note >}}
You must have your own iSCSI server running with the volume created before you can use it.
{{< /note >}}

A feature of iSCSI is that it can be mounted as read-only by multiple consumers
simultaneously. This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many Pods as you need. Unfortunately,
iSCSI volumes can only be mounted by a single consumer in read-write mode.
Simultaneous writers are not allowed.

See the [iSCSI example](https://github.com/kubernetes/examples/tree/master/volumes/iscsi) for more details.

### local

A `local` volume represents a mounted local storage device such as a disk,
partition or directory.

Local volumes can only be used as a statically created PersistentVolume. Dynamic
provisioning is not supported.

Compared to `hostPath` volumes, `local` volumes are used in a durable and
portable manner without manually scheduling pods to nodes. The system is aware
of the volume's node constraints by looking at the node affinity on the PersistentVolume.

However, `local` volumes are subject to the availability of the underlying
node and are not suitable for all applications. If a node becomes unhealthy,
then the `local` volume becomes inaccessible by the pod. The pod using this volume
is unable to run. Applications using `local` volumes must be able to tolerate this
reduced availability, as well as potential data loss, depending on the
durability characteristics of the underlying disk.

The following example shows a PersistentVolume using a `local` volume and
`nodeAffinity`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - example-node
```

You must set a PersistentVolume `nodeAffinity` when using `local` volumes.
The Kubernetes scheduler uses the PersistentVolume `nodeAffinity` to schedule
these Pods to the correct node.

PersistentVolume `volumeMode` can be set to "Block" (instead of the default
value "Filesystem") to expose the local volume as a raw block device.

When using local volumes, it is recommended to create a StorageClass with
`volumeBindingMode` set to `WaitForFirstConsumer`. For more details, see the
local [StorageClass](/docs/concepts/storage/storage-classes/#local) example.
Delaying volume binding ensures that the PersistentVolumeClaim binding decision
will also be evaluated with any other node constraints the Pod may have,
such as node resource requirements, node selectors, Pod affinity, and Pod anti-affinity.

An external static provisioner can be run separately for improved management of
the local volume lifecycle. Note that this provisioner does not support dynamic
provisioning yet. For an example on how to run an external local provisioner,
see the [local volume provisioner user
guide](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).

{{< note >}}
The local PersistentVolume requires manual cleanup and deletion by the
user if the external static provisioner is not used to manage the volume
lifecycle.
{{< /note >}}

### nfs

An `nfs` volume allows an existing NFS (Network File System) share to be
mounted into a Pod. Unlike `emptyDir`, which is erased when a Pod is
removed, the contents of an `nfs` volume are preserved and the volume is merely
unmounted. This means that an NFS volume can be pre-populated with data, and
that data can be shared between pods. NFS can be mounted by multiple
writers simultaneously.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /my-nfs-data
      name: test-volume
  volumes:
  - name: test-volume
    nfs:
      server: my-nfs-server.example.com
      path: /my-nfs-volume
      readOnly: true
```

{{< note >}}
You must have your own NFS server running with the share exported before you can use it.

Also note that you can't specify NFS mount options in a Pod spec. You can either set mount options server-side or
use [/etc/nfsmount.conf](https://man7.org/linux/man-pages/man5/nfsmount.conf.5.html).
You can also mount NFS volumes via PersistentVolumes which do allow you to set mount options.
{{< /note >}}

See the [NFS example](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs)
for an example of mounting NFS volumes with PersistentVolumes.

### persistentVolumeClaim {#persistentvolumeclaim}

A `persistentVolumeClaim` volume is used to mount a
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) into a Pod. PersistentVolumeClaims
are a way for users to "claim" durable storage (such as an iSCSI volume)
without knowing the details of the particular cloud environment.

See the information about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) for more
details.

### portworxVolume (deprecated) {#portworxvolume}

{{< feature-state for_k8s_version="v1.25" state="deprecated" >}}

A `portworxVolume` is an elastic block storage layer that runs hyperconverged with
Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) fingerprints storage
in a server, tiers based on capabilities, and aggregates capacity across multiple servers.
Portworx runs in-guest in virtual machines or on bare metal Linux nodes.

A `portworxVolume` can be dynamically created through Kubernetes or it can also
be pre-provisioned and referenced inside a Pod.
Here is an example Pod referencing a pre-provisioned Portworx volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /mnt
      name: pxvol
  volumes:
  - name: pxvol
    # This Portworx volume must already exist.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< note >}}
Make sure you have an existing PortworxVolume with name `pxvol`
before using it in the Pod.
{{< /note >}}

For more details, see the [Portworx volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md) examples.

#### Portworx CSI migration
{{< feature-state for_k8s_version="v1.25" state="beta" >}}

By default, Kubernetes {{% skew currentVersion %}} attempts to migrate legacy
Portworx volumes to use CSI. (CSI migration for Portworx has been available since
Kubernetes v1.23, but was only turned on by default since the v1.31 release).
If you want to disable automatic migration, you can set the `CSIMigrationPortworx`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to `false`; you need to make that change for the kube-controller-manager **and** on
every relevant kubelet.

It redirects all plugin operations from the existing in-tree plugin to the
`pxd.portworx.com` Container Storage Interface (CSI) Driver.
[Portworx CSI Driver](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi)
must be installed on the cluster.

### projected

A projected volume maps several existing volume sources into the same
directory. For more details, see [projected volumes](/docs/concepts/storage/projected-volumes/).

### rbd (removed) {#rbd}

<!-- maintenance note: OK to remove all mention of rbd once the v1.30 release of
Kubernetes has gone out of support -->

Kubernetes {{< skew currentVersion >}} does not include a `rbd` volume type.

The [Rados Block Device](https://docs.ceph.com/en/latest/rbd/) (RBD) in-tree storage driver and its csi migration support were deprecated in the Kubernetes v1.28 release
and then removed entirely in the v1.31 release.


### secret

A `secret` volume is used to pass sensitive information, such as passwords, to
Pods. You can store secrets in the Kubernetes API and mount them as files for
use by pods without coupling to Kubernetes directly. `secret` volumes are
backed by tmpfs (a RAM-backed filesystem) so they are never written to
non-volatile storage.

{{< note >}}

* You must create a Secret in the Kubernetes API before you can use it.

* A Secret is always mounted as `readOnly`.

* A container using a Secret as a [`subPath`](#using-subpath) volume mount will not
receive Secret updates.

{{< /note >}}

For more details, see [Configuring Secrets](/docs/concepts/configuration/secret/).

### vsphereVolume (deprecated) {#vspherevolume}

{{< note >}}
The Kubernetes project recommends using the [vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver)
out-of-tree storage driver instead.
{{< /note >}}

A `vsphereVolume` is used to mount a vSphere VMDK volume into your Pod.  The contents
of a volume are preserved when it is unmounted. It supports both VMFS and VSAN datastore.

For more information, see the [vSphere volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere) examples.

#### vSphere CSI migration {#vsphere-csi-migration}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `vsphereVolume` type
are redirected to the `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

[vSphere CSI driver](https://github.com/kubernetes-sigs/vsphere-csi-driver)
must be installed on the cluster. You can find additional advice on how to migrate in-tree `vsphereVolume` in VMware's documentation page
[Migrating In-Tree vSphere Volumes to vSphere Container Storage Plug-in](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-968D421F-D464-4E22-8127-6CB9FF54423F.html).
If vSphere CSI Driver is not installed volume operations can not be performed on the PV created with the in-tree `vsphereVolume` type.

You must run vSphere 7.0u2 or later in order to migrate to the vSphere CSI driver.

If you are running a version of Kubernetes other than v{{< skew currentVersion >}}, consult
the documentation for that version of Kubernetes.


{{< note >}}
The following StorageClass parameters from the built-in `vsphereVolume` plugin are not supported by the vSphere CSI driver:

* `diskformat`
* `hostfailurestotolerate`
* `forceprovisioning`
* `cachereservation`
* `diskstripes`
* `objectspacereservation`
* `iopslimit`

Existing volumes created using these parameters will be migrated to the vSphere CSI driver,
but new volumes created by the vSphere CSI driver will not be honoring these parameters.
{{< /note >}}

#### vSphere CSI migration complete {#vsphere-csi-migration-complete}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

To turn off the `vsphereVolume` plugin from being loaded by the controller manager and the kubelet, you need to set `InTreePluginvSphereUnregister` feature flag to `true`. You must install a `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver on all worker nodes.

## Using subPath {#using-subpath}

Sometimes, it is useful to share one volume for multiple uses in a single pod.
The `volumeMounts[*].subPath` property specifies a sub-path inside the referenced volume
instead of its root.

The following example shows how to configure a Pod with a LAMP stack (Linux Apache MySQL PHP)
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

The storage media (such as Disk or SSD) of an `emptyDir` volume is determined by the
medium of the filesystem holding the kubelet root dir (typically
`/var/lib/kubelet`). There is no limit on how much space an `emptyDir` or
`hostPath` volume can consume, and no isolation between containers or between
pods.

To learn about requesting space using a resource specification, see
[how to manage resources](/docs/concepts/configuration/manage-resources-containers/).

## Out-of-tree volume plugins

The out-of-tree volume plugins include
{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI), and also FlexVolume (which is deprecated). These plugins enable storage vendors to create custom storage plugins
without adding their plugin source code to the Kubernetes repository.

Previously, all volume plugins were "in-tree". The "in-tree" plugins were built, linked, compiled,
and shipped with the core Kubernetes binaries. This meant that adding a new storage system to
Kubernetes (a volume plugin) required checking code into the core Kubernetes code repository.

Both CSI and FlexVolume allow volume plugins to be developed independent of
the Kubernetes code base, and deployed (installed) on Kubernetes clusters as
extensions.

For storage vendors looking to create an out-of-tree volume plugin, please refer
to the [volume plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).

### csi

[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)
(CSI) defines a standard interface for container orchestration systems (like
Kubernetes) to expose arbitrary storage systems to their container workloads.

Please read the [CSI design proposal](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md) for more information.

{{< note >}}
Support for CSI spec versions 0.2 and 0.3 are deprecated in Kubernetes
v1.13 and will be removed in a future release.
{{< /note >}}

{{< note >}}
CSI drivers may not be compatible across all Kubernetes releases.
Please check the specific CSI driver's documentation for supported
deployments steps for each Kubernetes release and a compatibility matrix.
{{< /note >}}

Once a CSI compatible volume driver is deployed on a Kubernetes cluster, users
may use the `csi` volume type to attach or mount the volumes exposed by the
CSI driver.

A `csi` volume can be used in a Pod in three different ways:

* through a reference to a [PersistentVolumeClaim](#persistentvolumeclaim)
* with a [generic ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
* with a [CSI ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes) if the driver supports that

The following fields are available to storage administrators to configure a CSI
persistent volume:

* `driver`: A string value that specifies the name of the volume driver to use.
  This value must correspond to the value returned in the `GetPluginInfoResponse`
  by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo).
  It is used by Kubernetes to identify which CSI driver to call out to, and by
  CSI driver components to identify which PV objects belong to the CSI driver.
* `volumeHandle`: A string value that uniquely identifies the volume. This value
  must correspond to the value returned in the `volume.id` field of the
  `CreateVolumeResponse` by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The value is passed as `volume_id` on all calls to the CSI volume driver when
  referencing the volume.
* `readOnly`: An optional boolean value indicating whether the volume is to be
  "ControllerPublished" (attached) as read only. Default is false. This value is passed
  to the CSI driver via the `readonly` field in the `ControllerPublishVolumeRequest`.
* `fsType`: If the PV's `VolumeMode` is `Filesystem` then this field may be used
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
  `NodeExpandVolume` call. This field is optional, and may be empty if no
  secret is required. If the object contains more than one secret, all
  secrets are passed.  When you have configured secret data for node-initiated
  volume expansion, the kubelet passes that data via the `NodeExpandVolume()`
  call to the CSI driver. All supported versions of Kubernetes offer the
  `nodeExpandSecretRef` field, and have it available by default. Kubernetes releases
  prior to v1.25 did not include this support.
* Enable the [feature gate](/docs/reference/command-line-tools-reference/feature-gates-removed/)
  named `CSINodeExpandSecret` for each kube-apiserver and for the kubelet on every
  node. Since Kubernetes version 1.27 this feature has been enabled by default
  and no explicit enablement of the feature gate is required.
  You must also be using a CSI driver that supports or requires secret data during
  node-initiated storage resize operations.
* `nodePublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodePublishVolume` call. This field is optional, and may be empty if no
  secret is required. If the secret object contains more than one secret, all
  secrets are passed.
* `nodeStageSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodeStageVolume` call. This field is optional, and may be empty if no secret
  is required. If the Secret contains more than one secret, all secrets
  are passed.

#### CSI raw block volume support

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Vendors with external CSI drivers can implement raw block volume support
in Kubernetes workloads.

You can set up your
[PersistentVolume/PersistentVolumeClaim with raw block volume support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) as usual, without any CSI specific changes.

#### CSI ephemeral volumes

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

You can directly configure CSI volumes within the Pod
specification. Volumes specified in this way are ephemeral and do not
persist across pod restarts. See [Ephemeral
Volumes](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
for more information.

For more information on how to develop a CSI driver, refer to the
[kubernetes-csi documentation](https://kubernetes-csi.github.io/docs/)

#### Windows CSI proxy

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

CSI node plugins need to perform various privileged
operations like scanning of disk devices and mounting of file systems. These operations
differ for each host operating system. For Linux worker nodes, containerized CSI node 
plugins are typically deployed as privileged containers. For Windows worker nodes,
privileged operations for containerized CSI node plugins is supported using
[csi-proxy](https://github.com/kubernetes-csi/csi-proxy), a community-managed,
stand-alone binary that needs to be pre-installed on each Windows node.

For more details, refer to the deployment guide of the CSI plugin you wish to deploy.

#### Migrating to CSI drivers from in-tree plugins

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

The `CSIMigration` feature directs operations against existing in-tree
plugins to corresponding CSI plugins (which are expected to be installed and configured).
As a result, operators do not have to make any
configuration changes to existing Storage Classes, PersistentVolumes or PersistentVolumeClaims
(referring to in-tree plugins) when transitioning to a CSI driver that supersedes an in-tree plugin.

{{< note >}}
Existing PVs created by a in-tree volume plugin can still be used in the future without any configuration
changes, even after the migration to CSI is completed for that volume type, and even after you upgrade to a
version of Kubernetes that doesn't have compiled-in support for that kind of storage.

As part of that migration, you - or another cluster administrator - **must** have installed and configured
the appropriate CSI driver for that storage. The core of Kubernetes does not install that software for you.

---

After that migration, you can also define new PVCs and PVs that refer to the legacy, built-in
storage integrations.
Provided you have the appropriate CSI driver installed and configured, the PV creation continues
to work, even for brand new volumes. The actual storage management now happens through
the CSI driver.
{{< /note >}}

The operations and features that are supported include:
provisioning/delete, attach/detach, mount/unmount and resizing of volumes.

In-tree plugins that support `CSIMigration` and have a corresponding CSI driver implemented
are listed in [Types of Volumes](#volume-types).

The following in-tree plugins support persistent storage on Windows nodes:

* [`azureFile`](#azurefile)
* [`gcePersistentDisk`](#gcepersistentdisk)
* [`vsphereVolume`](#vspherevolume)

### flexVolume (deprecated)   {#flexvolume}

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

FlexVolume is an out-of-tree plugin interface that uses an exec-based model to interface
with storage drivers. The FlexVolume driver binaries must be installed in a pre-defined
volume plugin path on each node and in some cases the control plane nodes as well.

Pods interact with FlexVolume drivers through the `flexVolume` in-tree volume plugin.
For more details, see the FlexVolume [README](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md#readme) document.

The following FlexVolume [plugins](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows),
deployed as PowerShell scripts on the host, support Windows nodes:

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

{{< note >}}
FlexVolume is deprecated. Using an out-of-tree CSI driver is the recommended way to integrate external storage with Kubernetes.

Maintainers of FlexVolume driver should implement a CSI Driver and help to migrate users of FlexVolume drivers to CSI.
Users of FlexVolume should move their workloads to use the equivalent CSI Driver.
{{< /note >}}

## Mount propagation

  {{< caution >}}
  Mount propagation is a low-level feature that does not work consistently on all
  volume types. It is recommended to use only with `hostPath` or in-memory `emptyDir`
  volumes. See [this discussion](https://github.com/kubernetes/kubernetes/issues/95049)
  for more context. 
  {{< /caution >}}

Mount propagation allows for sharing volumes mounted by a container to
other containers in the same pod, or even to other pods on the same node.

Mount propagation of a volume is controlled by the `mountPropagation` field
in `containers[*].volumeMounts`. Its values are:

* `None` - This volume mount will not receive any subsequent mounts
  that are mounted to this volume or any of its subdirectories by the host.
  In similar fashion, no mounts created by the container will be visible on
  the host. This is the default mode.

  This mode is equal to `rprivate` mount propagation as described in
  [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

  However, the CRI runtime may choose `rslave` mount propagation (i.e.,
  `HostToContainer`) instead, when `rprivate` propagation is not applicable.
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

* `Bidirectional` - This volume mount behaves the same the `HostToContainer` mount.
  In addition, all volume mounts created by the container will be propagated
  back to the host and to all containers of all pods that use the same volume.

  A typical use case for this mode is a Pod with a FlexVolume or CSI driver or
  a Pod that needs to mount something on the host using a `hostPath` volume.

  This mode is equal to `rshared` mount propagation as described in the
  [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

  {{< warning >}}
  `Bidirectional` mount propagation can be dangerous. It can damage
  the host operating system and therefore it is allowed only in privileged
  containers. Familiarity with Linux kernel behavior is strongly recommended.
  In addition, any volume mounts created by containers in pods must be destroyed
  (unmounted) by the containers on termination.
  {{< /warning >}}

## Read-only mounts

A mount can be made read-only by setting the `.spec.containers[].volumeMounts[].readOnly`
field to `true`.
This does not make the volume itself read-only, but that specific container will
not be able to write to it.
Other containers in the Pod may mount the same volume as read-write.

On Linux, read-only mounts are not recursively read-only by default.
For example, consider a Pod which mounts the hosts `/mnt` as a `hostPath` volume.  If
there is another filesystem mounted read-write on `/mnt/<SUBMOUNT>` (such as tmpfs,
NFS, or USB storage), the volume mounted into the container(s) will also have a writeable
`/mnt/<SUBMOUNT>`, even if the mount itself was specified as read-only.

### Recursive read-only mounts

{{< feature-state feature_gate_name="RecursiveReadOnlyMounts" >}}

Recursive read-only mounts can be enabled by setting the
`RecursiveReadOnlyMounts` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for kubelet and kube-apiserver, and setting the `.spec.containers[].volumeMounts[].recursiveReadOnly`
field for a pod.

The allowed values are:

* `Disabled` (default): no effect.

* `Enabled`: makes the mount recursively read-only.
  Needs all the following requirements to be satisfied:
  * `readOnly` is set to `true`
  * `mountPropagation` is unset, or, set to `None`
  * The host is running with Linux kernel v5.12 or later
  * The [CRI-level](/docs/concepts/architecture/cri) container runtime supports recursive read-only mounts
  * The OCI-level container runtime supports recursive read-only mounts.
  It will fail if any of these is not true.

* `IfPossible`: attempts to apply `Enabled`, and falls back to `Disabled`
  if the feature is not supported by the kernel or the runtime class.

Example:
{{% code_sample file="storage/rro.yaml" %}}

When this property is recognized by kubelet and kube-apiserver,
the `.status.containerStatuses[].volumeMounts[].recursiveReadOnly` field is set to either
`Enabled` or `Disabled`.


#### Implementations {#implementations-rro}

{{% thirdparty-content %}}

The following container runtimes are known to support recursive read-only mounts.

CRI-level:
- [containerd](https://containerd.io/), since v2.0

OCI-level:
- [runc](https://runc.io/), since v1.1
- [crun](https://github.com/containers/crun), since v1.8.6

## {{% heading "whatsnext" %}}

Follow an example of [deploying WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
