---
reviewers:
- msau42
- xing-yang
title: Volume Attributes Classes
content_type: concept
weight: 40
---
<!-- overview -->

{{< feature-state feature_gate_name="VolumeAttributesClass" >}}

This page assumes that you are familiar with [StorageClasses](/docs/concepts/storage/storage-classes/),
[volumes](/docs/concepts/storage/volumes/) and [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
in Kubernetes.

<!-- body -->

A VolumeAttributesClass provides a way for administrators to describe the mutable
"classes" of storage they offer. Different classes might map to different quality-of-service levels.
Kubernetes itself is un-opinionated about what these classes represent.

This is a beta feature and disabled by default.

If you want to test the feature whilst it's beta, you need to enable the `VolumeAttributesClass`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for the kube-controller-manager, kube-scheduler,
and the kube-apiserver. You use the `--feature-gates` command line argument:

```
--feature-gates="...,VolumeAttributesClass=true"
```

You will also have to enable the `storage.k8s.io/v1beta1` API group through the
`kube-apiserver` [runtime-config](https://kubernetes.io/docs/tasks/administer-cluster/enable-disable-api/).
You use the following command line argument:

```
--runtime-config=storage.k8s.io/v1beta1=true
```

You can also only use VolumeAttributesClasses with storage backed by
{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}, and only where the
relevant CSI driver implements the `ModifyVolume` API.

## The VolumeAttributesClass API

Each VolumeAttributesClass contains the `driverName` and `parameters`, which are
used when a PersistentVolume (PV) belonging to the class needs to be dynamically provisioned
or modified.

The name of a VolumeAttributesClass object is significant and is how users can request a particular class.
Administrators set the name and other parameters of a class when first creating VolumeAttributesClass objects.
While the name of a VolumeAttributesClass object in a `PersistentVolumeClaim` is mutable, the parameters in an existing class are immutable.

```yaml
apiVersion: storage.k8s.io/v1beta1
kind: VolumeAttributesClass
metadata:
  name: silver
driverName: pd.csi.storage.gke.io
parameters:
  provisioned-iops: "3000"
  provisioned-throughput: "50" 
```

### Provisioner

Each VolumeAttributesClass has a provisioner that determines what volume plugin is used for
provisioning PVs. The field `driverName` must be specified.

The feature support for VolumeAttributesClass is implemented in
[kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner).

You are not restricted to specifying the [kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner).
You can also run and specify external provisioners,
which are independent programs that follow a specification defined by Kubernetes.
Authors of external provisioners have full discretion over where their code lives, how
the provisioner is shipped, how it needs to be run, what volume plugin it uses, etc.

### Resizer

Each VolumeAttributesClass has a resizer that determines what volume plugin is used
for modifying PVs. The field `driverName` must be specified.

The modifying volume feature support for VolumeAttributesClass is implemented in
[kubernetes-csi/external-resizer](https://github.com/kubernetes-csi/external-resizer).

For example, an existing PersistentVolumeClaim is using a VolumeAttributesClass named silver:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  …
  volumeAttributesClassName: silver
  …
```

A new VolumeAttributesClass gold is available in the cluster:

```yaml
apiVersion: storage.k8s.io/v1beta1
kind: VolumeAttributesClass
metadata:
  name: gold
driverName: pd.csi.storage.gke.io
parameters:
  iops: "4000"
  throughput: "60"
```

The end user can update the PVC with the new VolumeAttributesClass gold and apply:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  …
  volumeAttributesClassName: gold
  …
```

## Parameters

VolumeAttributeClasses have parameters that describe volumes belonging to them. Different parameters may be accepted
depending on the provisioner or the resizer. For example, the value `4000`, for the parameter `iops`,
and the parameter `throughput` are specific to GCE PD.
When a parameter is omitted, the default is used at volume provisioning.
If a user applies the PVC with a different VolumeAttributesClass with omitted parameters, the default value of
the parameters may be used depending on the CSI driver implementation.
Please refer to the related CSI driver documentation for more details.

There can be at most 512 parameters defined for a VolumeAttributesClass.
The total length of the parameters object including its keys and values cannot exceed 256 KiB.
