---
reviewers:
- msau42
- gnufied
- xing-yang
title: Volume Attributes Classes
content_type: concept
weight: 120
---

<!-- overview -->

This document describes the concept of a VolumeAttributesClass in Kubernetes. 
Familiarity with [volumes](/docs/concepts/storage/volumes/) and 
[persistent volumes](/docs/concepts/storage/persistent-volumes) is suggested.

<!-- body -->

## Introduction

// TDB

## The VolumeAttributesClass Resource

Each VolumeAttributesClass contains the fields driverName and parameters, which 
are used when the mutable attributes of a Volume needs to be set or changed.

The name of a VolumeAttributesClass object is significant, and is how users can 
request a particular class. Administrators set the name and other parameters of 
a class when first creating VolumeAttributesClass objects, and the objects 
cannot be updated once they are created.

Administrators can specify a default VolumeAttributesClass only for PVCs that 
don't request any particular volume attributes class to bind to: see the 
[PersistentVolumeClaim section](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) 
for details.

```yaml
apiVersion: storage.k8s.io/v1alpha1
kind: VolumeAttributesClass
metadata:
  name: silver
parameters:
  iops: "500"
  throughput: "50MiB/s"
```

### Default VolumeAttributesClass

When a PVC does not specify a volumeAttributesClass, the default VolumeAttributesClass is used. 
The cluster can only have one default VolumeAttributesClass. If more than one default VolumeAttributesClass 
is accidentally set, the newest default is used when the PVC is dynamically provisioned.

## Parameters

Volume Attributes Classes have parameters that describe the mutable attributes 
of volumes belonging to the volume attributes class. Different parameters may 
be accepted depending on the csi-driver.

There can be at most 512 parameters defined for a VolumeAttributesClass. The 
total length of the parameters object including its keys and values cannot exceed 
256 KiB.
