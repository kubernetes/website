---
title: 卷快照类
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

<!-- 
This document describes the concept of `VolumeSnapshotClass` in Kubernetes. Familiarity
with [volume snapshots](/docs/concepts/storage/volume-snapshots/) and
[storage classes](/docs/concepts/storage/storage-classes) is suggested.
-->

本文档描述了 Kubernetes 中 `VolumeSnapshotClass` 的概念。 建议熟悉[卷快照（Volume Snapshots）](/docs/concepts/storage/volume-snapshots/)和[存储类（Storage Class）](/docs/concepts/storage/storage-classes)。

{{% /capture %}}


{{% capture body %}}

<!-- 
## Introduction

Just like `StorageClass` provides a way for administrators to describe the "classes"
of storage they offer when provisioning a volume, `VolumeSnapshotClass` provides a
way to describe the "classes" of storage when provisioning a volume snapshot.
-->

## 介绍

就像 `StorageClass` 为管理员提供了一种在配置卷时描述存储“类”的方法，`VolumeSnapshotClass` 提供了一种在配置卷快照时描述存储“类”的方法。

<!-- 
## The VolumeSnapshotClass Resource

Each `VolumeSnapshotClass` contains the fields `snapshotter` and `parameters`,
which are used when a `VolumeSnapshot` belonging to the class needs to be
dynamically provisioned.

The name of a `VolumeSnapshotClass` object is significant, and is how users can
request a particular class. Administrators set the name and other parameters
of a class when first creating `VolumeSnapshotClass` objects, and the objects cannot
be updated once they are created.

Administrators can specify a default `VolumeSnapshotClass` just for VolumeSnapshots
that don't request any particular class to bind to.
-->

## VolumeSnapshotClass 资源

每个 `VolumeSnapshotClass` 都包含 `snapshotter` 和 `parameters` 字段，当需要动态配置属于该类的 `VolumeSnapshot` 时使用。

`VolumeSnapshotClass` 对象的名称很重要，是用户可以请求特定类的方式。
管理员在首次创建 `VolumeSnapshotClass` 对象时设置类的名称和其他参数，对象一旦创建就无法更新。

管理员可以为不请求任何特定类绑定的 VolumeSnapshots 指定默认的 `VolumeSnapshotClass`。


```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
snapshotter: csi-hostpath
parameters:
```

<!-- 
### Snapshotter

Volume snapshot classes have a snapshotter that determines what CSI volume plugin is
used for provisioning VolumeSnapshots. This field must be specified.
-->
 
### 快照生成器（Snapshotter）

卷快照类具有一个快照生成器，用于确定配置 VolumeSnapshot 的 CSI 卷插件。 必须指定此字段。

<!-- 
## Parameters

Volume snapshot classes have parameters that describe volume snapshots belonging to
the volume snapshot class. Different parameters may be accepted depending on the
`snapshotter`.
-->

## 参数

卷快照类具有描述属于卷快照类的卷快照参数。 可根据 `snapshotter` 接受不同的参数。

{{% /capture %}}
