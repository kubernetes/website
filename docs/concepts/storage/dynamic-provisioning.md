---
approvers:
- saad-ali
title: Dynamic Volume Provisioning
---

{% capture overview %}

Dynamic volume provisioning allows storage volumes to be created on-demand.
Without dynamic provisioning, cluster administrators have to manually make
calls to their cloud or storage provider to create new storage volumes, and
then create [`PersistentVolume` objects](/docs/concepts/storage/persistent-volumes/)
to represent them in Kubernetes. The dynamic provisioning feature eliminates
the need for cluster administrators to pre-provision storage. Instead, it
automatically provisions storage when it is requested by users.

{% endcapture %}

{:toc}

{% capture body %}

## Background

The implementation of dynamic volume provisioning is based on the API object `StorageClass`
from the API group `storage.k8s.io`. A cluster administrator can define as many
`StorageClass` objects as needed, each specifying a *volume plugin* (aka
*provisioner*) that provisions a volume and the set of parameters to pass to
that provisioner when provisioning.
A cluster administrator can define and expose multiple flavors of storage (from
the same or different storage systems) within a cluster, each with a custom set
of parameters. This design also ensures that end users don’t have to worry
about the the complexity and nuances of how storage is provisioned, but still
have the ability to select from multiple storage options.

More information on storage classes can be found
[here](/docs/concepts/storage/persistent-volumes/#storageclasses).

## Using Dynamic Provisioning

Users request dynamically provisioned storage by including a storage class in
their `PersistentVolumeClaim`. Before Kubernetes v1.6, this was done via the
`volume.beta.kubernetes.io/storage-class` annotation. However, this annotation
is deprecated since v1.6. Users now can and should instead use the
`storageClassName` field of the `PersistentVolumeClaim` object. The value of
this field must match the name of a `StorageClass` configured by the
administrator (see [below](#enabling-dynamic-provisioning)).

To select the “fast” storage class, for example, a user would create the
following `PersistentVolumeClaim`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim1
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  resources:
    requests:
      storage: 30Gi
```

This claim will result in an SSD-like Persistent Disk being automatically
provisioned. When the claim is deleted, the volume will be destroyed.

## Enabling Dynamic Provisioning

To enable dynamic provisioning, a cluster administrator need to pre-create
some storage class objects for users.
The following manifest creates a storage class "slow" which will provision
standard disk-like persistent disks.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

The following manifest creates a storage class "fast" which will provision
SSD-like persistent disks.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

## Defaulting Behavior

Dynamic provisioning can be enabled on a cluster such that all claims are
dynamically provisioned if no storage class is specified. A cluster administrator
can enable this behavior by:

- Marking one `StorageClass` object as *default*;
- Making sure that the [`DefaultStorageClass` admission controller](/docs/admin/admission-controllers/#defaultstorageclass)
  is enabled on the API server.

An administrator can mark a specific `StorageClass` as default by adding the
`storageclass.kubernetes.io/is-default-class` annotation to it.
When a default `StorageClass` exists in a cluster and a user creates a
`PersistentVolumeClaim` with `storageClassName` unspecified, the
`DefaultStorageClass` admission controller will automatically adds the
`storageClassName` field pointing to the default storage class.

Note that there can be at most one *default* storage class on a cluster, or
a `PersistentVolumeClaim` with `storageClassName` explicitly specified cannot
be created.

{% endcapture %}

{% include templates/concept.md %}
