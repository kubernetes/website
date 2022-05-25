---
reviewers:
- edithturn
- raelga
title: Volume Snapshot Classes
content_type: concept
weight: 30
---

<!-- overview -->

Este documento describe el concepto de VolumeSnapshotClass en Kubernetes. Se sugiere estar familiarizado
con [Volume Snapshots](/docs/concepts/storage/volume-snapshots/) y
[Storage Classes](/docs/concepts/storage/storage-classes).


<!-- body -->

## Introducción

Al igual que StorageClass proporciona a los administradores una forma de describir las “clases”
de almacenamiento que ofrecen al aprovisionar un volumen, VolumeSnapshotClass proporciona una
forma de describir las “clases” de almacenamiento al aprovisionar un Snapshot de volumen.

## El Recurso VolumeSnapshotClass

Cada VolumeSnapshotClass contiene los campos `driver`, `deletionPolicy`, y `parameters`,
que se utilizan cuando un VolumeSnapshot que pertenece a la clase, necesita aprovisionarse dinámicamente.

El nombre de un objeto VolumeSnapshotClass es significativo y es la forma en que los usuarios pueden solicitar una clase en particular. Los administradores establecen el nombre y parámetros de una clase cuando crean por primera vez objetos VolumeSnapshotClass; una vez creados los objetos no pueden ser actualizados.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

Los administradores pueden especificar un VolumeSnapshotClass predeterminado para VolumeSnapshots que no solicitan ninguna clase en particular. Para definir la clase predeterminada  agregue la anotación: `snapshot.storage.kubernetes.io/is-default-class: "true"`.

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

Las clases de Snapshot de volumen tienen un controlador que determina que complemento de volumen CSI se utiliza para aprovisionar VolumeSnapshots. Este campo debe especificarse.

### DeletionPolicy

Las clases de Snapshot de volumen tienen un deletionPolicy. Permite configurar lo que sucede con un VolumeSnapshotContent cuando se va a eliminar el objeto VolumeSnapshot al que está vinculado. La deletionPolicy de una clase de Snapshot de volumen puede `Retain` o `Delete`. Este campo debe ser especificado.

Si la deletionPolicy es `Delete`, el Snapshot de almacenamiento subyacente se eliminará junto con el objeto VolumeSnapshotContent. Si deletionPolicy es `Retain`, tanto el Snapshot subyacente como VolumeSnapshotContent permanecerán.

### Parameters

Las clases de Snapshot de volumen tienen parámetros que describen los Snapshots de volumen que pertenecen a la clase de Snapshot de volumen. Se pueden aceptar diferentes parámetros dependiendo del `driver`.

