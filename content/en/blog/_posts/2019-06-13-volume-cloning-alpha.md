---
layout: blog
title: 'Introducing Volume Cloning Alpha for Kubernetes'
date: 2019-06-12
---

**Author**: John Griffith (Red Hat)

Kubernetes v1.15 introduces alpha support for volume cloning. This feature allows creating new volumes using the contents of existing volumes in the users namespace using the Kubernetes API.

## What is a Clone?

Many storage systems provide the ability to to create a "clone" of a volume.  A clone is a duplicate of an existing volume that is it's own unique and independent object on the system, but is an exact duplicate of in terms of its contents.  A clone is similar to a snapshot in that it's a point in time copy of a volume, however rather than creating a new snapshot object from a volume, we're instead creating a new independent volume, sometimes thought of as pre-populating the newly created volume.

## Why add cloning to Kubernetes

The Kubernetes volume plugin system already provides a powerful abstraction that automates the provisioning, attaching, and mounting of block and file storage.

Underpinning all these features is the Kubernetes goal of workload portability: Kubernetes aims to create an abstraction layer between distributed systems applications and underlying clusters so that applications can be agnostic to the specifics of the cluster they run on and application deployment requires no “cluster specific” knowledge.

The [Kubernetes Storage SIG](https://github.com/kubernetes/community/tree/master/sig-storage) identified clone operations as critical functionality for many stateful workloads. For example, a database administrator may want to duplicate a database volume and create another instance of an existing database.

By providing a standard way to trigger clone operations in the Kubernetes API, Kubernetes users can now handle use cases like this without having to go around the Kubernetes API (and manually executing storage system specific operations).

Instead, Kubernetes users are now empowered to incorporate clone operations in a cluster agnostic way into their tooling and policy with the comfort of knowing that it will work against arbitrary Kubernetes clusters regardless of the underlying storage.

## Which volume plugins support Kubernetes Cloning?

Kubernetes supports three types of volume plugins: in-tree, Flex, and CSI. See [Kubernetes Volume Plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md) for details.

Cloning is only supported for CSI drivers (not for in-tree or Flex). To use the Kubernetes cloning feature, ensure that a CSI Driver that implements cloning is deployed on your cluster.

## Kubernetes API and Cloning

The cloning feature in Kubernetes is an enhancement to the existing PersistentVolumeClaim objects and it's API.  There are no new objects introduced to enable cloning, instead the existing DataSource field in the PersistentVolumeClaim object is expanded to be able to accept the name of an existin PersistentVolumeClaim in the users namespace.  It is important to note that from a users perspective a clone is just another Volume, the only difference being that that volume is being populated with the contents of another volume at creation time.  After creation it behaves exactly like any other Kubernetes Volume and adhers to the same behaviors and rules as any other Volume.

## Kubernetes Cloning Requirements

Before using Kubernetes Volume Cloning, you must:

* Ensure a CSI driver implementing Cloning is deployed and running on your Kubernetes cluster.
* Enable the Kubernetes Volume Cloning feature via new Kubernetes feature gate (disabled by default for alpha):
  * Set the following flag on the API server binary: `--feature-gates=VolumePVCDataSource=true`

## Creating a clone with Kubernetes

To provision a new volume pre-populated with data from an existing Kubernetes Volume, use the dataSource field in the `PersistentVolumeClaim`.  There are three parameters:

* name - name of the `PersistentVolumeClaim` object to use as source
* kind - must be `PersistentVolumeClaim`
* apiGroup - must be `""`

The namespace of the source `PersistentVolumeClaim` (source) object is assumed to be the same as the namespace of the new `PersistentVolumeClaim` (dstination) being created object.

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
    kind: PersistentVolumeclaim 
    apiGroup: ""
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

When the `PersistentVolumeClaim` object is created, it will trigger provisioning of a new volume that is pre-populated with data from the specified `dataSource` volume.  It is the sole responsbility of the CSI Plugin to implement the cloning of volumes.

## As a storage vendor, how do I add support for cloning to my CSI driver?

To implement the cloning feature, a CSI driver MUST add cloning support to its controller capabilities `CLONE_VOLUME`. For details, see [the CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md).

Cloning is an parameter added to the `CreateVolumeRequest` and checks to detect a clone option are added to the existing `Provision` function in the external provisioner.  From a CSI Plugin authors perspective, the requires that you modify your `CreateVolume` implementation to check and check the `CreateVolumeRequest` parameters for a data source.

Although Kubernetes is as [minimally prescriptive](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md#third-party-csi-volume-drivers) on the packaging and deployment of a CSI Volume Driver as possible, it provides a [suggested mechanism](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md#recommended-mechanism-for-deploying-csi-drivers-on-kubernetes) for deploying an arbitrary containerized CSI driver on Kubernetes to simplify deployment of containerized CSI compatible volume drivers.


The cloning features does not require any additional sidecar containers than the standard external provisioner.  There are however updates that have been made to the  external provisioner to enable cloning so you will need to update to the latest version of the provisioner <insert-link-or-version-number-here>

## What are the limitations of alpha?

The alpha implementation of cloning for Kubernetes has the following limitations:

* Does not support cloning volumes across different namespaces
* Does not support cloning volumes across different storage classes (backends)
* Does not support cloning of `in-use` volumes

## What’s next?
Depending on feedback and adoption, the Kubernetes team plans to push the CSI cloning implementation to beta in either 1.16.

## How can I learn more?

Check out additional documentation on the cloning feature here: http://k8s.io/docs/concepts/storage/volume-pvc-datasource.md and https://kubernetes-csi.github.io/docs/

## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.

We offer a huge thank you to all the contributors in Kubernetes Storage SIG and CSI community who helped review the design and implementation of the project, including but not limited to the following:

* Saad Ali ([saadali](https://github.com/saadali))
* Tim Hockin ([thockin](https://github.com/thockin))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Michelle Au ([msau42](https://github.com/msau42))
* Xing Yang ([xing-yang](https://github.com/xing-yang))

If you’re interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
