---
reviewers:
- edithturn
- raelga
- electrocucaracha
title: Snapshots de Volúmenes
content_type: concept
weight: 20
---

<!-- overview -->

En Kubernetes, un _VolumeSnapshot_ representa un Snapshot de un volumen en un sistema de almacenamiento. Este documento asume que está familiarizado con [volúmenes persistentes](/docs/concepts/storage/persistent-volumes/) de Kubernetes.




<!-- body -->

## Introducción

Al igual que los recursos de API `PersistentVolume` y `PersistentVolumeClaim` se utilizan para aprovisionar volúmenes para usuarios y administradores, `VolumeSnapshotContent` y `VolumeSnapshot` se proporcionan para crear Snapshots de volumen para usuarios y administradores.

Un `VolumeSnapshotContent` es un Snapshot tomado de un volumen en el clúster que ha sido aprovisionado por un administrador. Es un recurso en el clúster al igual que un PersistentVolume es un recurso de clúster.

Un `VolumeSnapshot` es una solicitud de Snapshot de un volumen por parte del usuario. Es similar a un PersistentVolumeClaim.

`VolumeSnapshotClass` permite especificar diferentes atributos que pertenecen a un `VolumeSnapshot`. Estos atributos pueden diferir entre Snapshots tomados del mismo volumen en el sistema de almacenamiento y, por lo tanto, no se pueden expresar mediante el mismo `StorageClass` de un `PersistentVolumeClaim`.

Los Snapshots de volumen brindan a los usuarios de Kubernetes una forma estandarizada de copiar el contenido de un volumen en un momento determinado, sin crear uno completamente nuevo. Esta funcionalidad permite, por ejemplo, a los administradores de bases de datos realizar copias de seguridad de las bases de datos antes de realizar una edición o eliminar modificaciones.

Cuando utilicen esta función los usuarios deben tener en cuenta lo siguiente:

* Los objetos de API `VolumeSnapshot`, `VolumeSnapshotContent`, y `VolumeSnapshotClass` son {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}, y no forman parte de la API principal.
* La compatibilidad con `VolumeSnapshot` solo está disponible para controladores CSI.
* Como parte del proceso de implementación de `VolumeSnapshot`, el equipo de Kubernetes proporciona un controlador de Snapshot para implementar en el plano de control y un sidecar auxiliar llamado csi-snapshotter para implementar junto con el controlador CSI. El controlador de Snapshot observa los objetos `VolumeSnapshot` y `VolumeSnapshotContent` y es responsable de la creación y eliminación del objeto `VolumeSnapshotContent`. El sidecar csi-snapshotter observa los objetos `VolumeSnapshotContent` y activa las operaciones `CreateSnapshot` y `DeleteSnapshot` en un punto final CSI.
* También hay un servidor webhook de validación que proporciona una validación más estricta en los objetos Snapshot. Esto debe ser instalado por las distribuciones de Kubernetes junto con el controlador de Snapshots y los CRDs, no los controladores CSI. Debe instalarse en todos los clústeres de Kubernetes que tengan habilitada la función de Snapshot.
* Los controladores CSI pueden haber implementado o no la funcionalidad de Snapshot de volumen. Los controladores CSI que han proporcionado soporte para Snapshot de volumen probablemente usarán csi-snapshotter. Consulte [CSI Driver documentation](https://kubernetes-csi.github.io/docs/) para obtener más detalles.
* Los CRDs y las instalaciones del controlador de Snapshot son responsabilidad de la distribución de Kubernetes.

## Ciclo de vida de un Snapshot de volumen y el contenido de un Snapshot de volumen.

`VolumeSnapshotContents` son recursos en el clúster. `VolumeSnapshots` son solicitudes de esos recursos. La interacción entre `VolumeSnapshotContents` y `VolumeSnapshots` sigue este ciclo de vida:

### Snapshot del volumen de aprovisionamiento

Hay dos formas de aprovisionar los Snapshots: aprovisionadas previamente o aprovisionadas dinámicamente.

#### Pre-aprovisionado {#static}
Un administrador de clúster crea una serie de `VolumeSnapshotContents`. Llevan los detalles del Snapshot del volumen real en el sistema de almacenamiento que está disponible para que lo utilicen los usuarios del clúster. Existen en la API de Kubernetes y están disponibles para su consumo.

#### Dinámica
En lugar de utilizar un Snapshot preexistente, puede solicitar que se tome una Snapshot dinámicamente de un PersistentVolumeClaim. El [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) especifica los parámetros específicos del proveedor de almacenamiento para usar al tomar una Snapshot.

### Vinculante

El controlador de Snapshots maneja el enlace de un objeto `VolumeSnapshot` con un objeto `VolumeSnapshotContent` apropiado, tanto en escenarios de aprovisionamiento previo como de aprovisionamiento dinámico. El enlace es un mapeo uno a uno.

En el caso de un enlace aprovisionado previamente, el VolumeSnapshot permanecerá sin enlazar hasta que se cree el objeto VolumeSnapshotContent solicitado.

### Persistent Volume Claim como Snapshot Source Protection

El propósito de esta protección es garantizar que los objetos de la API
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
en uso, no se eliminen del sistema mientras se toma un Snapshot (ya que esto puede resultar en la pérdida de datos).

Mientras se toma un Snapshot de un PersistentVolumeClaim, ese PersistentVolumeClaim está en uso. Si elimina un objeto de la API PersistentVolumeClaim en uso activo como fuente de Snapshot, el objeto PersistentVolumeClaim no se elimina de inmediato. En cambio, la eliminación del objeto PersistentVolumeClaim se pospone hasta que el Snapshot esté readyToUse o se cancele.

### Borrar

La eliminación se activa al eliminar el objeto `VolumeSnapshot`, y se seguirá la `DeletionPolicy`. Sí `DeletionPolicy` es `Delete`, entonces el Snapshot de almacenamiento subyacente se eliminará junto con el objeto `VolumeSnapshotContent`. Sí `DeletionPolicy` es `Retain`, tanto el Snapshot subyacente como el `VolumeSnapshotContent` permanecen.

## VolumeSnapshots

Cada VolumeSnapshot contiene una especificación y un estado.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  volumeSnapshotClassName: csi-hostpath-snapclass
  source:
    persistentVolumeClaimName: pvc-test
```

`persistentVolumeClaimName` es el nombre de la fuente de datos PersistentVolumeClaim para el Snapshot. Este campo es obligatorio para aprovisionar dinámicamente un Snapshot.

Un Snapshot de volumen puede solicitar una clase particular especificando el nombre de un [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/)
utilizando el atributo `volumeSnapshotClassName`. Si no se establece nada, se usa la clase predeterminada si está disponible.

Para los Snapshots aprovisionadas previamente, debe especificar un `volumeSnapshotContentName` como el origen del Snapshot, como se muestra en el siguiente ejemplo. El campo de origen `volumeSnapshotContentName` es obligatorio para los Snapshots aprovisionados previamente.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
spec:
  source:
    volumeSnapshotContentName: test-content
```

## Contenido del Snapshot de volumen

Cada VolumeSnapshotContent contiene una especificación y un estado. En el aprovisionamiento dinámico, el controlador común de Snapshots crea objetos `VolumeSnapshotContent`. Aquí hay un ejemplo:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: snapcontent-72d9a349-aacd-42d2-a240-d775650d2455
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    volumeHandle: ee0cfb94-f8d4-11e9-b2d8-0242ac110002
  volumeSnapshotClassName: csi-hostpath-snapclass
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
    uid: 72d9a349-aacd-42d2-a240-d775650d2455
```

`volumeHandle` es el identificador único del volumen creado en el backend de almacenamiento y devuelto por el controlador CSI durante la creación del volumen. Este campo es obligatorio para aprovisionar dinámicamente un Snapshot. Especifica el origen del volumen del Snapshot.

Para los Snapshots aprovisionados previamente, usted (como administrador del clúster) es responsable de crear el objeto `VolumeSnapshotContent` de la siguiente manera.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

`snapshotHandle` es el identificador único del Snapshot de volumen creado en el backend de almacenamiento. Este campo es obligatorio para las Snapshots aprovisionadas previamente. Especifica el ID del Snapshot CSI en el sistema de almacenamiento que representa el `VolumeSnapshotContent`.

## Aprovisionamiento de Volúmenes a partir de Snapshots

Puede aprovisionar un nuevo volumen, rellenado previamente con datos de una Snapshot, mediante el campo *dataSource* en el objeto `PersistentVolumeClaim`.

Para obtener más detalles, consulte
[Volume Snapshot and Restore Volume from Snapshot](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support).
