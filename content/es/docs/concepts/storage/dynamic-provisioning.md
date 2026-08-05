---
reviewers:
  - edithturn
  - raelga
  - electrocucaracha
title: Aprovisionamiento Dinámico de volumen
content_type: concept
weight: 40
---

<!-- overview -->

El aprovisionamiento dinámico de volúmenes permite crear volúmenes de almacenamiento bajo demanda. Sin el aprovisionamiento dinámico, los administradores de clústeres tienen que realizar llamadas manualmente a su proveedor de almacenamiento o nube para crear nuevos volúmenes de almacenamiento y luego crear [objetos de `PersistentVolume`](/docs/concepts/storage/persistent-volumes/)
para representarlos en Kubernetes. La función de aprovisionamiento dinámico elimina la necesidad de que los administradores del clúster aprovisionen previamente el almacenamiento. En cambio, el aprovisionamiento ocurre automáticamente cuando los usuarios lo solicitan.

<!-- body -->

## Antecedentes

La implementación del aprovisionamiento dinámico de volúmenes se basa en el objeto API `StorageClass`
del grupo API `storage.k8s.io`. Un administrador de clúster puede definir tantos objetos
`StorageClass` como sea necesario, cada uno especificando un _volume plugin_ (aka
_provisioner_) que aprovisiona un volumen y el conjunto de parámetros para pasar a ese aprovisionador. Un administrador de clúster puede definir y exponer varios tipos de almacenamiento (del mismo o de diferentes sistemas de almacenamiento) dentro de un clúster, cada uno con un conjunto personalizado de parámetros. Este diseño también garantiza que los usuarios finales no tengan que preocuparse por la complejidad y los matices de cómo se aprovisiona el almacenamiento, pero que aún tengan la capacidad de seleccionar entre múltiples opciones de almacenamiento.

Puede encontrar más información sobre las clases de almacenamiento
[aqui](/docs/concepts/storage/storage-classes/).

## Habilitación del aprovisionamiento dinámico

Para habilitar el aprovisionamiento dinámico, un administrador de clúster debe crear previamente uno o más objetos StorageClass para los usuarios. Los objetos StorageClass definen qué aprovisionador se debe usar y qué parámetros se deben pasar a ese aprovisionador cuando se invoca el aprovisionamiento dinámico.
El nombre de un objeto StorageClass debe ser un
[nombre de subdominio de DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.

El siguiente manifiesto crea una clase de almacenamiento llamada "slow" que aprovisiona discos persistentes estándar similares a discos.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

El siguiente manifiesto crea una clase de almacenamiento llamada "fast" que aprovisiona discos persistentes similares a SSD.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

## Usar Aprovisionamiento Dinámico

Los usuarios solicitan almacenamiento aprovisionado dinámicamente al incluir una clase de almacenamiento en su `PersistentVolumeClaim`. Antes de Kubernetes v1.6, esto se hacía a través del la anotación
`volume.beta.kubernetes.io/storage-class`. Sin embargo, esta anotación está obsoleta desde v1.9. Los usuarios ahora pueden y deben usar el campo
`storageClassName` del objeto `PersistentVolumeClaim`. El valor de este campo debe coincidir con el nombre de un `StorageClass` configurada por el administrador
(ver [documentación](#habilitación-del-aprovisionamiento-dinámico)).

Para seleccionar la clase de almacenamiento llamada "fast", por ejemplo, un usuario crearía el siguiente PersistentVolumeClaim:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim1
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  resources:
    requests:
      storage: 30Gi
```

Esta afirmación da como resultado que se aprovisione automáticamente un disco persistente similar a SSD. Cuando se elimina la petición, se destruye el volumen.

## Comportamiento Predeterminado

El aprovisionamiento dinámico se puede habilitar en un clúster de modo que todas las peticiones se aprovisionen dinámicamente si no se especifica una clase de almacenamiento. Un administrador de clúster puede habilitar este comportamiento al:

- Marcar un objeto `StorageClass` como _default_;
- Asegúrese de que el [controlador de admisión `DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) esté habilitado en el servidor de API.

Un administrador puede marcar un `StorageClass` específico como predeterminada agregando la anotación
`storageclass.kubernetes.io/is-default-class`.
Cuando existe un `StorageClass` predeterminado en un clúster y un usuario crea un
`PersistentVolumeClaim` con `storageClassName` sin especificar, el controlador de admisión
`DefaultStorageClass` agrega automáticamente el campo
`storageClassName` que apunta a la clase de almacenamiento predeterminada.

Tenga en cuenta que puede haber como máximo una clase de almacenamiento _default_, o un `PersistentVolumeClaim` sin `storageClassName` especificado explícitamente.

## Conocimiento de la Topología

En los clústeres [Multi-Zone](/docs/setup/multiple-zones), los Pods se pueden distribuir en zonas de una región. Los backends de almacenamiento de zona única deben aprovisionarse en las zonas donde se programan los Pods. Esto se puede lograr configurando el [Volume Binding
Mode](/docs/concepts/storage/storage-classes/#volume-binding-mode).
