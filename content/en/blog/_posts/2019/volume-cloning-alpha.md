---
layout: blog
title: 'Introducing Volume Cloning Alpha for Kubernetes'
date: 2019-06-21
author: >
  John Griffith (Red Hat)
---

Kubernetes v1.15 introduces alpha support for volume cloning. This feature allows you to create new volumes using the contents of existing volumes in the user's namespace using the Kubernetes API.

## What is a Clone?

Many storage systems provide the ability to create a "clone" of a volume.  A clone is a duplicate of an existing volume that is its own unique volume on the system, but the data on the source is duplicated to the destination (clone).  A clone is similar to a snapshot in that it's a point in time copy of a volume, however rather than creating a new snapshot object from a volume, we're instead creating a new independent volume, sometimes thought of as pre-populating the newly created volume.

## Why add cloning to Kubernetes

The Kubernetes volume plugin system already provides a powerful abstraction that automates the provisioning, attaching, and mounting of block and file storage.

Underpinning all these features is the Kubernetes goal of workload portability: Kubernetes aims to create an abstraction layer between distributed systems applications and underlying clusters so that applications can be agnostic to the specifics of the cluster they run on and application deployment requires no specific storage device knowledge.

The [Kubernetes Storage SIG](https://github.com/kubernetes/community/tree/master/sig-storage) identified clone operations as critical functionality for many stateful workloads. For example, a database administrator may want to duplicate a database volume and create another instance of an existing database.

By providing a standard way to trigger clone operations in the Kubernetes API, Kubernetes users can now handle use cases like this without having to go around the Kubernetes API (and manually executing storage system specific operations).  While cloning is similar in behavior to creating a snapshot of a volume, then creating a volume from the snapshot, a clone operation is more streamlined and is more efficient for many backend devices.

Kubernetes users are now empowered to incorporate clone operations in a cluster agnostic way into their tooling and policy with the comfort of knowing that it will work against arbitrary Kubernetes clusters regardless of the underlying storage.

## Kubernetes API and Cloning

The cloning feature in Kubernetes is enabled via the `PersistentVolumeClaim.DataSource` field.  Prior to v1.15 the only valid object type permitted for use as a dataSource was a `VolumeSnapshot`.  The cloning feature extends the allowed `PersistentVolumeclaim.DataSource.Kind` field to not only allow `VolumeSnapshot` but also `PersistentVolumeClaim`.  The existing behavior is not changed. 

There are no new objects introduced to enable cloning. Instead, the existing dataSource field in the PersistentVolumeClaim object is expanded to be able to accept the name of an existing PersistentVolumeClaim in the same namespace.  It is important to note that from a users perspective a clone is just another PersistentVolume and PersistentVolumeClaim, the only difference being that that PersistentVolume is being populated with the contents of another PersistentVolume at creation time.  After creation it behaves exactly like any other Kubernetes PersistentVolume and adheres to the same behaviors and rules.


## Which volume plugins support Kubernetes Cloning?

Kubernetes supports three types of volume plugins: in-tree, Flex, and [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI). See [Kubernetes Volume Plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md) for details.

Cloning is only supported for CSI drivers (not for in-tree or Flex). To use the Kubernetes cloning feature, ensure that a CSI Driver that implements cloning is deployed on your cluster.
For a list of CSI drivers that currently support cloning see the [CSI Drivers doc](https://kubernetes-csi.github.io/docs/drivers.html).

## Kubernetes Cloning Requirements

Before using Kubernetes Volume Cloning, you must:

* Ensure a CSI driver implementing Cloning is deployed and running on your Kubernetes cluster.
* Enable the Kubernetes Volume Cloning feature via new Kubernetes feature gate (disabled by default for alpha):
  * Set the following flag on the API server binary: `--feature-gates=VolumePVCDataSource=true`
* The source and destination claims must be in the same namespace.


## Creating a clone with Kubernetes

To provision a new volume pre-populated with data from an existing Kubernetes Volume, use the dataSource field in the `PersistentVolumeClaim`.  There are three parameters:

* name - name of the `PersistentVolumeClaim` object to use as source
* kind - must be `PersistentVolumeClaim`
* apiGroup - must be `""`

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-clone
  Namespace: demo-namespace
spec:
  storageClassName: csi-storageclass
  dataSource:
    name: src-pvc
    kind: PersistentVolumeClaim 
    apiGroup: ""
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi # NOTE this capacity must be specified and must be >= the capacity of the source volume
```

When the `PersistentVolumeClaim` object is created, it will trigger provisioning of a new volume that is pre-populated with data from the specified `dataSource` volume.  It is the sole responsbility of the CSI Plugin to implement the cloning of volumes.

## As a storage vendor, how do I add support for cloning to my CSI driver?

For more information on how to implement cloning in your CSI Plugin, reference the [developing a CSI driver for Kubernetes](https://kubernetes-csi.github.io/docs/developing.html) section of the CSI docs.

## What are the limitations of alpha?

The alpha implementation of cloning for Kubernetes has the following limitations:

* Does not support cloning volumes across different namespaces
* Does not support cloning volumes across different storage classes (backends)

## Future
Depending on feedback and adoption, the Kubernetes team plans to push the CSI cloning implementation to beta in 1.16.

A common question that users have regarding cloning is "what about cross namespace clones".  As we've mentioned, the current release requires that source and destination be in the same namespace.  There are however efforts underway to propose a namespace transfer API, future versions of Kubernetes may provide the ability to transfer volume resources from one namespace to another.  This feature is still under discussion and design, and may or may not be available in a future release.

## How can I learn more?

You can find additional documentation on the cloning feature in the [storage concept docs](https://k8s.io/docs/concepts/storage/volume-pvc-datasource.md) and also the [CSI docs](https://kubernetes-csi.github.io/docs/volume-cloning.html).

## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.

We offer a huge thank you to all the contributors in Kubernetes Storage SIG and CSI community who helped review the design and implementation of the project, including but not limited to the following:

* Saad Ali ([saadali](https://github.com/saadali))
* Tim Hockin ([thockin](https://github.com/thockin))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Michelle Au ([msau42](https://github.com/msau42))
* Xing Yang ([xing-yang](https://github.com/xing-yang))

If you’re interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
