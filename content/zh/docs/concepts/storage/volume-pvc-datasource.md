---
title: CSI 卷克隆
content_template: templates/concept
weight: 30
---

<!--
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
-->

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="beta" >}}
<!--
This document describes the concept of cloning existing CSI Volumes in Kubernetes.  Familiarity with [Volumes](/docs/concepts/storage/volumes) is suggested.
-->

本文档介绍 Kubernetes 中克隆现有 CSI 卷的概念。阅读前建议先熟悉[卷](/docs/concepts/storage/volumes)。

{{% /capture %}}


{{% capture body %}}

<!--
## Introduction
-->

## 介绍

<!--
The {{< glossary_tooltip text="CSI" term_id="csi" >}} Volume Cloning feature adds support for specifying existing {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}s in the `dataSource` field to indicate a user would like to clone a {{< glossary_tooltip term_id="volume" >}}.
-->

{{< glossary_tooltip text="CSI" term_id="csi" >}} 卷克隆功能增加了通过在 `dataSource` 字段中指定存在的 {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}s，来表示用户想要克隆的 {{< glossary_tooltip term_id="volume" >}}。

<!--
A Clone is defined as a duplicate of an existing Kubernetes Volume that can be consumed as any standard Volume would be.  The only difference is that upon provisioning, rather than creating a "new" empty Volume, the back end device creates an exact duplicate of the specified Volume.
-->

克隆，意思是为已有的 Kubernetes 卷创建副本，它可以像任何其它标准卷一样被使用。唯一的区别就是配置后，后端设备将创建指定完全相同的副本，而不是创建一个“新的”空卷。

<!--
The implementation of cloning, from the perspective of the Kubernetes API simply adds the ability to specify an existing unbound PVC as a dataSource during new pvc creation.
-->

从 Kubernetes API 的角度看，克隆的实现只是在创建新的 PVC 时，增加了指定一个现有未绑定 PVC 作为数据源的能力。

<!--
Users need to be aware of the following when using this feature:
-->

用户在使用该功能时，需要注意以下事项：

<!--
* Cloning support (`VolumePVCDataSource`) is only available for CSI drivers.
* Cloning support is only available for dynamic provisioners.
* CSI drivers may or may not have implemented the volume cloning functionality.
* You can only clone a PVC when it exists in the same namespace as the destination PVC (source and destination must be in the same namespace).
* Cloning is only supported within the same Storage Class.
    - Destination volume must be the same storage class as the source
    - Default storage class can be used and storageClassName omitted in the spec
-->

* 克隆支持（`VolumePVCDataSource`）仅适用于 CSI 驱动。
* 克隆支持仅适用于 动态供应器。
* CSI 驱动可能实现，也可能未实现卷克隆功能。
* 仅当 PVC 与目标 PVC 存在于同一命名空间（源和目标 PVC 必须在相同的命名空间）时，才可以克隆 PVC。
* 仅在同一存储类中支持克隆。
    - 目标卷必须和源卷具有相同的存储类
    - 可以使用默认的存储类并且 storageClassName 字段在规格中忽略了


<!--
## Provisioning
-->

## 供应

<!--
Clones are provisioned just like any other PVC with the exception of adding a dataSource that references an existing PVC in the same namespace.
-->

克隆卷与其他任何 PVC 一样配置，除了需要增加 dataSource 来引用同一命名空间中现有的 PVC。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
    name: clone-of-pvc-1
    namespace: myns
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: cloning
  resources:
    requests:
      storage: 5Gi
  dataSource:
    kind: PersistentVolumeClaim
    name: pvc-1
```

<!--
You must specify a capacity value for `spec.resources.requests.storage`, and the value you specify must be the same or larger than the capacity of the source volume.
-->

{{< note >}}
你必须为 `spec.resources.requests.storage` 指定一个值，并且你指定的值必须大于或等于源卷的值。
{{< /note >}}

<!--
The result is a new PVC with the name `clone-of-pvc-1` that has the exact same content as the specified source `pvc-1`.
-->

结果是一个名称为 `clone-of-pvc-1` 的新 PVC 与指定的源 `pvc-1` 拥有相同的内容。

<!--
## Usage
-->

## 用法

<!--
Upon availability of the new PVC, the cloned PVC is consumed the same as other PVC.  It's also expected at this point that the newly created PVC is an independent object.  It can be consumed, cloned, snapshotted, or deleted independently and without consideration for it's original dataSource PVC.  This also implies that the source is not linked in any way to the newly created clone, it may also be modified or deleted without affecting the newly created clone.
-->

一旦新的 PVC 可用，被克隆的 PVC 项其他 PVC 一样被使用。可以预期的是，新创建的 PVC 是一个独立的对象。可以独立使用，克隆，快照或删除它，而不需要考虑它的原始数据源 PVC。这也意味着，源没有以任何方式链接到新创建的 PVC，它也可以被修改或删除，而不会影响到新创建的克隆。

{{% /capture %}}
