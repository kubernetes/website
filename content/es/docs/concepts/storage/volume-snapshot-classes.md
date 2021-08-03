---
reviewers:
- saad-ali
- thockin
- msau42
- jingxu97
- xing-yang
- yuxiangqian
title: Volume Snapshot Classes
content_type: concept
weight: 30
---

<!-- overview -->

Este documento describe el concepto de VolumeSnapshotClass en Kubernetes. Se sugiere estar familiarizado 
con [volume snapshots](/docs/concepts/storage/volume-snapshots/) y
[storage classes](/docs/concepts/storage/storage-classes).


<!-- body -->

## Introducción

Al igual que StorageClass proporciona a los administradores una forma de describir las “clases”
de almacenamiento que ofrecen al aprovisionar un volumen, VolumeSnapshotClass proporciona una
forma de describir las “clases” de almacenamiento al aprovisionar una instantánea de volumen.

## El Recurso VolumeSnapshotClass

Cada VolumeSnapshotClass contiene los campos `driver`, `deletionPolicy`, y `parameters`,
que se utilizan cuando un VolumeSnapshot que pertenece a la clase, necesita aprovisionarse dinámicamente.

El nombre de un objeto VolumeSnapshotClass es significativo y es la forma en que los usuarios  pueden solicitar una clase en particular. Los Administradores establecen el nombre y otros parámetros de una clase cuando crean por primera vez objetos VolumeSnapshotClass, y los objetos no se pueden actualizar una vez creados.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

Los administradores pueden especificar un VolumeSnapshotClass  predeterminado para VolumeSnapshots que no solicitan ninguna clase en particular para vincularse agregando la anotación: `snapshot.storage.kubernetes.io/is-default-class: "true"`.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
  annotations:
    snapshot.storage.kubernetes.io/is-default-class: "true"
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

### Driver

Las clases de instantáneas de volumen tienen un controlador que determina qué complemento de volumen CSI se utiliza para aprovisionar VolumeSnapshots. Este campo debe especificarse.

### DeletionPolicy

Las clases de instantáneas de volumen tienen un  deletionPolicy. Le permite configurar lo que sucede con un VolumeSnapshotContent  cuando se va a eliminar el objeto VolumeSnapshot al que está vinculado. La deletionPolicy de una clase de instantánea de volumen  puede `Retain` o `Delete`. This field must be specified.

Si la deletionPolicy es `Delete`, la instantánea de almacenamiento subyacente se eliminará junto con el objeto VolumeSnapshotContent. Si deletionPolicy es `Retain`, tanto la instantánea subyacente como VolumeSnapshotContent permanecerán.

## Parameters

Las clases de instantáneas de volumen tienen parámetros que describen las instantáneas de volumen que pertenecen a la clase de instantáneas de volumen. Se pueden aceptar diferentes parámetros dependiendo del `driver`.


