---
title: Expanding Persistent Volumes
content_type: concept
weight: 80
---

<!-- overview -->

PersistentVolumes can be configured to be expandable. This allows you to resize the
volume by editing the corresponding PersistentVolumeClaim (PVC) object, requesting a
new larger amount of storage.

<!-- body -->

## Expanding Persistent Volume Claims

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Support for expanding PersistentVolumeClaims (PVCs) is enabled by default. You can expand
the following types of volumes:

* {{< glossary_tooltip text="csi" term_id="csi" >}} (including some CSI migrated
volume types)
* flexVolume (deprecated)
* portworxVolume (deprecated)

You can only expand a PVC if its storage class's `allowVolumeExpansion` field is set to true.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-vol-default
provisioner: vendor-name.example/magicstorage
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

The following types of volumes support volume expansion, when the underlying
StorageClass has the field `allowVolumeExpansion` set to true.

{{< table caption = "Table of Volume types and the version of Kubernetes they require"  >}}

| Volume type              | Required Kubernetes version for volume expansion |
| :----------------------- | :----------------------------------------------- |
| CSI                      | 1.24                                             |
| Azure File (deprecated)  | 1.11                                             |
| FlexVolume (deprecated)  | 1.13                                             |
| Portworx (deprecated)    | 1.11                                             |
| rbd (deprecated)         | 1.11                                             |

{{< /table >}}

{{< note >}}
You can only use the volume expansion feature to grow a Volume, not to shrink it.
{{< /note >}}

To request a larger volume for a PVC, edit the PVC object and specify a larger
size. This triggers expansion of the volume that backs the underlying PersistentVolume. A
new PersistentVolume is never created to satisfy the claim. Instead, an existing volume is resized.

{{< warning >}}
Directly editing the size of a PersistentVolume can prevent an automatic resize of that volume.
If you edit the capacity of a PersistentVolume, and then edit the `.spec` of a matching
PersistentVolumeClaim to make the size of the PersistentVolumeClaim match the PersistentVolume,
then no storage resize happens.
The Kubernetes control plane will see that the desired state of both resources matches,
conclude that the backing volume size has been manually
increased and that no resize is necessary.
{{< /warning >}}

## CSI Volume expansion

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Support for expanding CSI volumes is enabled by default but it also requires a
specific CSI driver to support volume expansion. Refer to documentation of the
specific CSI driver for more information.

## Resizing a volume containing a file system

You can only resize volumes containing a file system if the file system is XFS, Ext3, or Ext4.

When a volume contains a file system, the file system is only resized when a new Pod is using
the PersistentVolumeClaim in `ReadWrite` mode. File system expansion is either done when a Pod is starting up
or when a Pod is running and the underlying file system supports online expansion.

FlexVolumes (deprecated since Kubernetes v1.23) allow resize if the driver is configured with the
`RequiresFSResize` capability to `true`. The FlexVolume can be resized on Pod restart.

## Resizing an in-use PersistentVolumeClaim

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

In this case, you don't need to delete and recreate a Pod or deployment that is using an existing PVC.
Any in-use PVC automatically becomes available to its Pod as soon as its file system has been expanded.
This feature has no effect on PVCs that are not in use by a Pod or deployment. You must create a Pod that
uses the PVC before the expansion can complete.

Similar to other volume types - FlexVolume volumes can also be expanded when in-use by a Pod.

{{< note >}}
FlexVolume resize is possible only when the underlying driver supports resize.
{{< /note >}}

## Recovering from Failure when Expanding Volumes

If a user specifies a new size that is too big to be satisfied by underlying
storage system, expansion of PVC will be continuously retried until user or
cluster administrator takes some action. This can be undesirable and hence
Kubernetes provides following methods of recovering from such failures.

{{< tabs name="recovery_methods" >}}
{{% tab name="Manually with Cluster Administrator access" %}}

If expanding underlying storage fails, the cluster administrator can manually
recover the Persistent Volume Claim (PVC) state and cancel the resize requests.
Otherwise, the resize requests are continuously retried by the controller without
administrator intervention.

1. Mark the PersistentVolume(PV) that is bound to the PersistentVolumeClaim(PVC)
   with `Retain` reclaim policy.
2. Delete the PVC. Since PV has `Retain` reclaim policy - we will not lose any data
   when we recreate the PVC.
3. Delete the `claimRef` entry from PV specs, so as new PVC can bind to it.
   This should make the PV `Available`.
4. Re-create the PVC with smaller size than PV and set `volumeName` field of the
   PVC to the name of the PV. This should bind new PVC to existing PV.
5. Don't forget to restore the reclaim policy of the PV.

{{% /tab %}}
{{% tab name="By requesting expansion to smaller size" %}}

If expansion has failed for a PVC, you can retry expansion with a
smaller size than the previously requested value. To request a new expansion attempt with a
smaller proposed size, edit `.spec.resources` for that PVC and choose a value that is less than the
value you previously tried.
This is useful if expansion to a higher value did not succeed because of capacity constraint.
If that has happened, or you suspect that it might have, you can retry expansion by specifying a
size that is within the capacity limits of underlying storage provider. You can monitor status of
resize operation by watching `.status.allocatedResourceStatuses` and events on the PVC.

Note that,
although you can specify a lower amount of storage than what was requested previously,
the new value must still be higher than `.status.capacity`.
Kubernetes does not support shrinking a PVC to less than its current size.
{{% /tab %}}
{{% /tabs %}}

## {{% heading "whatsnext" %}}

* Learn about [StorageClasses](/docs/concepts/storage/storage-classes/) and the
  `allowVolumeExpansion` field.
* Learn more about [Persistent Volumes](/docs/concepts/storage/persistent-volumes/).
