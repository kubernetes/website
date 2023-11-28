---
title: Storage Volumes
weight: 145
no_list: true
---

<!-- overview -->
This reference contains references to different volume types.

## Deprecated volume types

### azureFile

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

The `azureFile` volume type mounts a Microsoft Azure File volume (SMB 2.1 and 3.0)
into a pod.

For more details, see the [`azureFile` volume plugin](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md).

#### azureFile CSI migration

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

The `CSIMigration` feature for `azureFile`, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `file.csi.azure.com` Container
Storage Interface (CSI) Driver. In order to use this feature, the
[Azure File CSI Driver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
must be installed on the cluster and the `CSIMigrationAzureFile`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) must be enabled.

Azure File CSI driver does not support using same volume with different fsgroups. If
`CSIMigrationAzureFile` is enabled, using same volume with different fsgroups
won't be supported at all.

#### azureFile CSI migration complete

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

To disable the `azureFile` storage plugin from being loaded by the controller manager
and the kubelet, set the `InTreePluginAzureFileUnregister` flag to `true`.

### cephfs

{{< feature-state for_k8s_version="v1.28" state="deprecated" >}}

The Kubernetes project suggests that you use the [CephFS CSI](https://github.com/ceph/ceph-csi)
third party storage driver instead.

{{< note >}}
You must have your own Ceph server running with the share exported before you can use it.
{{< /note >}}

A `cephfs` volume allows an existing CephFS volume to be mounted into your Pod.
Unlike `emptyDir`, which is erased when a pod is removed, the contents of a
`cephfs` volume are preserved and the volume is merely unmounted.
This means that a `cephfs` volume can be pre-populated with data, and that data can be
shared between pods. The `cephfs` volume can be mounted by multiple writers simultaneously.

See the [CephFS example](https://github.com/kubernetes/examples/tree/master/volumes/cephfs/)
for more details.

### flexVolume

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

The Kubernetes project suggests that you use an out-of-tree CSI driver
to integrate external storage with Kubernetes.

{{< note >}}
Maintainers of FlexVolume driver should implement a CSI Driver and help to
migrate users of FlexVolume drivers to CSI.
{{< /note >}}

FlexVolume is an out-of-tree plugin interface that uses an exec-based model to interface
with storage drivers. The FlexVolume driver binaries must be installed in a pre-defined
volume plugin path on each node and in some cases the control plane nodes as well.

Pods interact with FlexVolume drivers through the `flexVolume` in-tree volume plugin.
For more details, see the FlexVolume
[README](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md#readme)
document.

The following FlexVolume [plugins](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows),
deployed as PowerShell scripts on the host, supporting Windows nodes:

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

### gcePersistentDisk

{{< feature-state for_k8s_version="v1.17" state="deprecated" >}}

{{< note >}}
You must create a PD using `gcloud` or the GCE API or UI before you can use it.
{{< /note >}}

A `gcePersistentDisk` volume mounts a Google Compute Engine (GCE)
[persistent disk](https://cloud.google.com/compute/docs/disks) (PD) into your Pod.
Unlike `emptyDir`, which is erased when a pod is removed, the contents of a PD are
preserved and the volume is merely unmounted. This means that a PD can be
pre-populated with data, and that data can be shared between pods.

There are some restrictions when using a `gcePersistentDisk`:

* the nodes on which Pods are running must be GCE VMs
* those VMs need to be in the same GCE project and zone as the persistent disk

One feature of GCE persistent disk is concurrent read-only access to a persistent disk.
A `gcePersistentDisk` volume permits multiple consumers to simultaneously mount
a persistent disk as read-only. This means that you can pre-populate a PD with
your dataset and then serve it in parallel from as many Pods as you need.
Unfortunately, PDs can only be mounted by a single consumer in read-write mode.
Simultaneous writers are not allowed.

Using a GCE persistent disk with a Pod controlled by a ReplicaSet will fail unless
the PD is read-only or the replica count is 0 or 1.

#### GCE CSI migration

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

The `CSIMigration` feature for GCE PD, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `pd.csi.storage.gke.io` Container
Storage Interface (CSI) Driver. In order to use this feature, the [GCE PD CSI
Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
must be installed on the cluster.

#### GCE CSI migration complete

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

To disable the `gcePersistentDisk` storage plugin from being loaded by the controller manager
and the kubelet, set the `InTreePluginGCEUnregister` flag to `true`.

### gitRepo

{{< note >}}
If you want to provision a container with a git repo, the Kubernetes project
suggests you to mount an [EmptyDir](#emptydir) into an InitContainer that
clones the repo using git, then mount the [EmptyDir](#emptydir) into the Pod's
container.
{{< /note >}}

A `gitRepo` volume is an example of a volume plugin. This plugin
mounts an empty directory and clones a git repository into this directory
for your Pod to use.

### portworxVolume

{{< feature-state for_k8s_version="v1.25" state="deprecated" >}}

{{< note >}}
Make sure you have an existing PortworxVolume with name `pxvol`
before using it in the Pod.
{{< /note >}}

A `portworxVolume` is an elastic block storage layer that runs hyperconverged with
Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) fingerprints storage
in a server, tiers based on capabilities, and aggregates capacity across multiple servers.
Portworx runs in-guest in virtual machines or on bare metal Linux nodes.

A `portworxVolume` can be dynamically created through Kubernetes or it can also
be pre-provisioned and referenced inside a Pod. For more details, see the
[Portworx volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md)
examples.

#### Portworx CSI migration

{{< feature-state for_k8s_version="v1.25" state="beta" >}}

The `CSIMigration` feature for Portworx has been added but disabled by default
in Kubernetes 1.23 since it's in alpha state.
It has been beta now since v1.25 but it is still turned off by default.
It redirects all plugin operations from the existing in-tree plugin to the
`pxd.portworx.com` Container Storage Interface (CSI) Driver.
[Portworx CSI Driver](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi)
must be installed on the cluster.
To enable the feature, set `CSIMigrationPortworx=true` in
the `kube-controller-manager` and the `kubelet`.

### rbd

{{< feature-state for_k8s_version="v1.28" state="deprecated" >}}

{{< note >}}
The Kubernetes project suggests that you use the [Ceph CSI](https://github.com/ceph/ceph-csi)
third party storage driver instead, in RBD mode.
{{< /note >}}

{{< note >}}
You must have a Ceph installation running before you can use RBD.
{{< /note >}}

An `rbd` volume allows a [Rados Block Device](https://docs.ceph.com/en/latest/rbd/)
(RBD) volume to mount into your Pod. Unlike `emptyDir`, which is erased when a
pod is removed, the contents of an `rbd` volume are preserved and the volume is
unmounted. This means that a RBD volume can be pre-populated with data, and that
data can be shared between pods.

A feature of RBD is that it can be mounted as read-only by multiple consumers
simultaneously. This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many pods as you need. Unfortunately,
RBD volumes can only be mounted by a single consumer in read-write mode.
Simultaneous writers are not allowed.

See the [RBD example](https://github.com/kubernetes/examples/tree/master/volumes/rbd)
for more details.

#### RBD CSI migration {#rbd-csi-migration}

{{< feature-state for_k8s_version="v1.28" state="deprecated" >}}

The `CSIMigration` feature for `RBD`, when enabled, redirects all plugin
operations from the existing in-tree plugin to the `rbd.csi.ceph.com`
{{< glossary_tooltip text="CSI" term_id="csi" >}} driver. In order to use this
feature, the [Ceph CSI driver](https://github.com/ceph/ceph-csi)
must be installed on the cluster and the `CSIMigrationRBD`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled. (Note that the `csiMigrationRBD` flag has been removed and
replaced with `CSIMigrationRBD` in release v1.24)

{{< note >}}
As a Kubernetes cluster operator that administers storage, here are the
prerequisites that you must complete before you attempt migration to the
RBD CSI driver:

* You must install the Ceph CSI driver (`rbd.csi.ceph.com`), v3.5.0 or above,
  into your Kubernetes cluster.
* considering the `clusterID` field is a required parameter for CSI driver for
  its operations, but in-tree StorageClass has `monitors` field as a required
  parameter, a Kubernetes storage admin has to create a clusterID based on the
  monitors hash ( ex:`#echo -n
  '<monitors_string>' | md5sum`) in the CSI config map and keep the monitors
  under this clusterID configuration.
* Also, if the value of `adminId` in the in-tree Storageclass is different from
 `admin`, the `adminSecretName` mentioned in the in-tree Storageclass has to be
  patched with the base64 value of the `adminId` parameter value, otherwise this
  step can be skipped.
{{< /note >}}

### vsphereVolume

{{< note >}}
The Kubernetes project recommends using the [vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver)
out-of-tree storage driver instead.
{{< /note >}}

A `vsphereVolume` is used to mount a vSphere VMDK volume into your Pod.  The contents
of a volume are preserved when it is unmounted. It supports both VMFS and VSAN datastore.

For more information, see the [vSphere volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)
examples.

#### vSphere CSI migration {#vsphere-csi-migration}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree
`vsphereVolume` type are redirected to the `csi.vsphere.vmware.com`
{{< glossary_tooltip text="CSI" term_id="csi" >}} driver.
You must run vSphere 7.0u2 or later in order to migrate to the vSphere CSI driver.

The [vSphere CSI driver](https://github.com/kubernetes-sigs/vsphere-csi-driver)
must be installed on the cluster. You can find additional advice on how to
migrate in-tree `vsphereVolume` in VMware's documentation page
[Migrating In-Tree vSphere Volumes to vSphere Container Storage lug-in](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-968D421F-D464-4E22-8127-6CB9FF54423F.html).
If the vSphere CSI Driver is not installed, volume operations cannot be
performed on the PV created with the in-tree `vsphereVolume` type.

{{< note >}}
The following StorageClass parameters from the built-in `vsphereVolume` plugin
are not supported by the vSphere CSI driver:

* `diskformat`
* `hostfailurestotolerate`
* `forceprovisioning`
* `cachereservation`
* `diskstripes`
* `objectspacereservation`
* `iopslimit`

Existing volumes created using these parameters will be migrated to the vSphere
CSI driver, but new volumes created by the vSphere CSI driver will not be
honoring these parameters.
{{< /note >}}

If you are running a version of Kubernetes other than v{{< skew currentVersion >}},
consult the documentation for that version of Kubernetes.

#### vSphere CSI migration complete {#vsphere-csi-migration-complete}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

To turn off the `vsphereVolume` plugin from being loaded by the controller
manager and the kubelet, you need to set `InTreePluginvSphereUnregister` feature
flag to `true`. You must install a `csi.vsphere.vmware.com` CSI
driver on all worker nodes.


## Removed volume types

### awsElasticBlockStore

<!--
maintenance note:
OK to remove all mentions of this removed volume types once v1.27 is out of support.
-->

Kubernetes {{< skew currentVersion >}} does not include a `awsElasticBlockStore` volume type.

The AWSElasticBlockStore in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.

The Kubernetes project suggests that you use the
[AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) third party
storage driver instead.

### azureDisk

<!--
maintenance note:
OK to remove all mentions of this removed volume types once v1.27 is out of support.
-->
Kubernetes {{< skew currentVersion >}} does not include a `azureDisk` volume type.

The AzureDisk in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.

The Kubernetes project suggests that you use the
[Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver) third party
storage driver instead.

### cinder

<!--
maintenance note:
OK to remove all mentions of this removed volume types once v1.26 is out of support.
-->
Kubernetes {{< skew currentVersion >}} does not include a `cinder` volume type.

The OpenStack Cinder in-tree storage driver was deprecated in the Kubernetes v1.11 release
and then removed entirely in the v1.26 release.

The Kubernetes project suggests that you use the 
[OpenStack Cinder](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)
third party storage driver instead.

### glusterfs

<!--
maintenance note:
OK to remove all mentions of this removed volume types once v1.26 is out of support.
-->
Kubernetes {{< skew currentVersion >}} does not include a `glusterfs` volume type.

The GlusterFS in-tree storage driver was deprecated in the Kubernetes v1.25 release
and then removed entirely in the v1.26 release.

