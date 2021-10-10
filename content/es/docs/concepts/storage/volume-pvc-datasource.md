---
reviewers:
  - edithturn
  - raelga
  - electrocucaracha
title: Clonación de volumen CSI
content_type: concept
weight: 30
---

<!-- overview -->

Este documento describe el concepto para clonar volúmenes CSI existentes en Kubernetes. Se sugiere estar familiarizado con [Volúmenes](/docs/concepts/storage/volumes).

<!-- body -->

## Introducción

La función de clonación de volumen {{< glossary_tooltip text="CSI" term_id="csi" >}} agrega soporte para especificar {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}s existentes en el campo `dataSource` para indicar que un usuario desea clonar un {{< glossary_tooltip term_id="volume" >}}.

Un Clon se define como un duplicado de un volumen de Kubernetes existente que se puede consumir como lo sería cualquier volumen estándar. La única diferencia es que al aprovisionar, en lugar de crear un "nuevo" Volumen vacío, el dispositivo de backend crea un duplicado exacto del Volumen especificado.

La implementación de la clonación, desde la perspectiva de la API de Kubernetes, agrega la capacidad de especificar un PVC existente como dataSource durante la creación de un nuevo PVC. El PVC de origen debe estar vinculado y disponible (no en uso).

Los usuarios deben tener en cuenta lo siguiente cuando utilicen esta función:

- El soporte de clonación (`VolumePVCDataSource`) sólo está disponible para controladores CSI.
- El soporte de clonación sólo está disponible para aprovisionadores dinámicos.
- Los controladores CSI pueden haber implementado o no la funcionalidad de clonación de volúmenes.
- Sólo puede clonar un PVC cuando existe en el mismo Namespace que el PVC de destino (el origen y el destino deben estar en el mismo Namespace).
- La clonación sólo se admite dentro de la misma Clase de Almacenamiento.
  - El volumen de destino debe ser de la misma clase de almacenamiento que el origen
  - Se puede utilizar la clase de almacenamiento predeterminada y se puede omitir storageClassName en la especificación
- La clonación sólo se puede realizar entre dos volúmenes que usan la misma configuración de VolumeMode (si solicita un volumen en modo de bloqueo, la fuente DEBE también ser en modo de bloqueo)

## Aprovisionamiento

Los clones se aprovisionan como cualquier otro PVC con la excepción de agregar un origen de datos que hace referencia a un PVC existente en el mismo Namespace.

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

{{< note >}}
Debe especificar un valor de capacidad para `spec.resources.requests.storage` y el valor que especifique debe ser igual o mayor que la capacidad del volumen de origen.
{{< /note >}}

El resultado es un nuevo PVC con el nombre `clone-of-pvc-1` que tiene exactamente el mismo contenido que la fuente especificada `pvc-1`.

## Uso

Una vez disponible el nuevo PVC, el PVC clonado se consume igual que el resto de PVC. También se espera en este punto que el PVC recién creado sea un objeto independiente. Se puede consumir, clonar, tomar snapshots, o eliminar de forma independiente y sin tener en cuenta sus datos originales. Esto también implica que la fuente no está vinculada de ninguna manera al clon recién creado, también puede modificarse o eliminarse sin afectar al clon recién creado.
