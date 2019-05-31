---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: CSI Volume Cloning
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.15" state="alpha" >}} 
This document describes the concept of cloning existing CSI Volumes in Kubernetes.  Familiarity with [Volumes](/docs/concepts/storage/volumes) is suggested.

This feature requires VolumePVCDataSource feature gate to be enabled:

```
--feature-gates=VolumePVCDataSource=true
```


{{% /capture %}}


{{% capture body %}}

## Introduction

The {{< glossary_tooltip text="CSI" term_id="csi" >}} Volume Cloning feature adds support for specifying existing {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}s in the `dataSource` field to indicate a user would like to clone a {{< glossary_tooltip term_id="volume" >}}.

A Clone is defined as a duplicate of an existing Kubernetes Volume that can be consumed as any standard Volume would be.  The only difference is that upon provisioning, rather than creating a "new" empty Volume, the back end device creates an exact duplicate of the specified Volume.

The implementation of cloning, from the perspective of the Kubernetes API simply adds the ability to specify an existing unbound PVC as a dataSource during new pvc creation. 

Users need to be aware of the following when using this feature:

* Cloning support (`VolumePVCDataSource`) is only available for CSI drivers.
* Cloning support is only available for dynamic provisioners.
* CSI drivers may or may not have implemented the volume cloning functionality.
* You can only clone a PVC when it exists in the same namespace as the destination PVC (source and destination must be in the same namespace).

## Provisioning

Clones are provisioned just like any other PVC with the exception of adding a dataSource that references an existing PVC in the same namespace.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
    name: clone-of-pvc-1
    namespace: myns
spec:
  capacity:
    storage: 10Gi
  dataSource:
    kind: PersistentVolumeClaim
    name: pvc-1
```

The result is a new PVC with the name `clone-of-pvc-1` that has the exact same content as the specified source `pvc-1`.

## Usage

Upon availability of the new PVC, the cloned PVC is consumed the same as other PVC.  It's also expected at this point that the newly created PVC is an independent object.  It can be consumed, cloned, snapshotted, or deleted independently and without consideration for it's original dataSource PVC.  This also implies that the source is not linked in any way to the newly created clone, it may also be modified or deleted without affecting the newly created clone.

{{% /capture %}}
