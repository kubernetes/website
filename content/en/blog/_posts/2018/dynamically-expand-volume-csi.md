---
layout: blog
title:  'Dynamically Expand Volume with CSI and Kubernetes'
date:   2018-08-02
author: >
  Orain Xiong (WoquTech) 
---

_There is a very powerful storage subsystem within Kubernetes itself, covering a fairly broad spectrum of use cases. Whereas, when planning to build a product-grade relational database platform with Kubernetes, we face a big challenge: coming up with storage. This article describes how to extend latest Container Storage Interface 0.2.0 and integrate with Kubernetes, and demonstrates the essential facet of dynamically expanding volume capacity._

## Introduction

As we focalize our customers, especially in financial space, there is a huge upswell in the adoption of container orchestration technology.

They are looking forward to open source solutions to redesign already existing monolithic applications, which have been running for several years on virtualization infrastructure or bare metal.

Considering extensibility and the extent of technical maturity, Kubernetes and Docker are at the very top of the list. But migrating monolithic applications to a distributed orchestration like Kubernetes is challenging, the relational database is critical for the migration.

With respect to the relational database, we should pay attention to storage. There is a very powerful storage subsystem within Kubernetes itself. It is very useful and covers a fairly broad spectrum of use cases. When planning to run a relational database with Kubernetes in production, we face a big challenge: coming up with storage. There are still some fundamental functionalities which are left unimplemented. Specifically, dynamically expanding volume. It sounds boring but is highly required, except for actions like create and delete and mount and unmount.

Currently, expanding volume is only available with those storage provisioners:

* gcePersistentDisk
* awsElasticBlockStore
* OpenStack Cinder
* glusterfs
* rbd

In order to enable this feature, we should set feature gate `ExpandPersistentVolumes` true and turn on the `PersistentVolumeClaimResize` admission plugin. Once `PersistentVolumeClaimResize` has been enabled, resizing will be allowed by a Storage Class whose `allowVolumeExpansion` field is set to true.

Unfortunately, dynamically expanding volume through the Container Storage Interface (CSI) and Kubernetes is unavailable, even though the underlying storage providers have this feature.

This article will give a simplified view of CSI, followed by a walkthrough of how to introduce a new expanding volume feature on the existing CSI and Kubernetes. Finally, the article will demonstrate how to dynamically expand volume capacity.

## Container Storage Interface (CSI)

To have a better understanding of what we're going to do, the first thing we need to know is what the Container Storage Interface is. Currently, there are still some problems for already existing storage subsystem within Kubernetes. Storage driver code is maintained in the Kubernetes core repository which is difficult to test. But beyond that, Kubernetes needs to give permissions to storage vendors to check code into the Kubernetes core repository. Ideally, that should be implemented externally.

CSI is designed to define an industry standard that will enable storage providers who enable CSI to be available across container orchestration systems that support CSI.

This diagram depicts a kind of high-level Kubernetes archetypes integrated with CSI:

![csi diagram](/images/blog/2018-08-02-dynamically-expand-volume-csi/csi-diagram.png)

* Three new external components are introduced to decouple Kubernetes and Storage Provider logic
* Blue arrows present the conventional way to call against API Server
* Red arrows present gRPC to call against Volume Driver

For more details, please visit: https://github.com/container-storage-interface/spec/blob/master/spec.md

## Extend CSI and Kubernetes

In order to enable the feature of expanding volume atop Kubernetes, we should extend several components including CSI specification, “in-tree” volume plugin, external-provisioner and external-attacher.

## Extend CSI spec

The feature of expanding volume is still undefined in latest CSI 0.2.0. The new 3 RPCs, including `RequiresFSResize` and `ControllerResizeVolume` and `NodeResizeVolume`, should be introduced.

```
service Controller {
 rpc CreateVolume (CreateVolumeRequest)
   returns (CreateVolumeResponse) {}
……
 rpc RequiresFSResize (RequiresFSResizeRequest)
   returns (RequiresFSResizeResponse) {}
 rpc ControllerResizeVolume (ControllerResizeVolumeRequest)
   returns (ControllerResizeVolumeResponse) {}
}

service Node {
 rpc NodeStageVolume (NodeStageVolumeRequest)
   returns (NodeStageVolumeResponse) {}
……
 rpc NodeResizeVolume (NodeResizeVolumeRequest)
   returns (NodeResizeVolumeResponse) {}
}
```

## Extend “In-Tree” Volume Plugin

In addition to the extend CSI specification, the `csiPlugin﻿` interface within Kubernetes should also implement `expandablePlugin`. The `csiPlugin` interface will expand `PersistentVolumeClaim` representing for `ExpanderController`.


```go
type ExpandableVolumePlugin interface {
VolumePlugin
ExpandVolumeDevice(spec Spec, newSize resource.Quantity, oldSize resource.Quantity) (resource.Quantity, error)
RequiresFSResize() bool
}
```

### Implement Volume Driver

Finally, to abstract complexity of the implementation, we should hard code the separate storage provider management logic into the following functions which is well-defined in the CSI specification:

* CreateVolume
* DeleteVolume
* ControllerPublishVolume
* ControllerUnpublishVolume
* ValidateVolumeCapabilities
* ListVolumes
* GetCapacity
* ControllerGetCapabilities
* RequiresFSResize
* ControllerResizeVolume

## Demonstration

Let’s demonstrate this feature with a concrete user case.

* Create storage class for CSI storage provisioner

```yaml
allowVolumeExpansion: true
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-qcfs
parameters:
  csiProvisionerSecretName: orain-test
  csiProvisionerSecretNamespace: default
provisioner: csi-qcfsplugin
reclaimPolicy: Delete
volumeBindingMode: Immediate
```

* Deploy CSI Volume Driver including storage provisioner `csi-qcfsplugin` across Kubernetes cluster

* Create PVC `qcfs-pvc` which will be dynamically provisioned by storage class `csi-qcfs`

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: qcfs-pvc
  namespace: default
....
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 300Gi
  storageClassName: csi-qcfs
```

* Create MySQL 5.7 instance to use PVC `qcfs-pvc`
* In order to mirror the exact same production-level scenario, there are actually two different types of workloads including:
    * Batch insert to make MySQL consuming more file system capacity
    * Surge query request
* Dynamically expand volume capacity through edit pvc `qcfs-pvc` configuration

The Prometheus and Grafana integration allows us to visualize corresponding critical metrics.

![prometheus grafana](/images/blog/2018-08-02-dynamically-expand-volume-csi/prometheus-grafana.png)

We notice that the middle reading shows MySQL datafile size increasing slowly during bulk inserting. At the same time, the bottom reading shows file system expanding twice in about 20 minutes, from 300 GiB to 400 GiB and then 500 GiB. Meanwhile, the upper reading shows the whole process of expanding volume immediately completes and hardly impacts MySQL QPS.

## Conclusion

Regardless of whatever infrastructure applications have been running on, the database is always a critical resource. It is essential to have a more advanced storage subsystem out there to fully support database requirements. This will help drive the more broad adoption of cloud native technology.
