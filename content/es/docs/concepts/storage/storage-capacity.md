---
reviewers:
  - edithturn
  - raelga
  - electrocucaracha
title: Capacidad de Almacenamiento
content_type: concept
weight: 45
---

<!-- overview -->

La capacidad de almacenamiento es limitada y puede variar según el nodo en el que un Pod se ejecuta: es posible que no todos los nodos puedan acceder al almacenamiento conectado a la red o que, para empezar, el almacenamiento sea local en un nodo.

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

Esta página describe cómo Kubernetes realiza un seguimiento de la capacidad de almacenamiento y cómo el planificador usa esa información para programar Pods en nodos que tienen acceso a suficiente capacidad de almacenamiento para los volúmenes restantes que faltan. Sin el seguimiento de la capacidad de almacenamiento, el planificador puede elegir un nodo que no tenga suficiente capacidad para aprovisionar un volumen y se necesitarán varios reintentos de planificación.

El seguimiento de la capacidad de almacenamiento es compatible con los controladores de la {{< glossary_tooltip
text="Interfaz de Almacenamiento de Contenedores" term_id="csi" >}} (CSI) y
[necesita estar habilitado](#enabling-storage-capacity-tracking) al instalar un controlador CSI.

<!-- body -->

## API

Hay dos extensiones de API para esta función:

- Los objetos CSIStorageCapacity:
  son producidos por un controlador CSI en el Namespace donde está instalado el controlador. Cada objeto contiene información de capacidad para una clase de almacenamiento y define qué nodos tienen acceso a ese almacenamiento.
- [El campo `CSIDriverSpec.StorageCapacity`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#csidriverspec-v1-storage-k8s-io):
  cuando se establece en `true`, el [Planificador de Kubernetes](/docs/concepts/scheduling-eviction/kube-scheduler/) considerará la capacidad de almacenamiento para los volúmenes que usan el controlador CSI.

## Planificación

El planificador de Kubernetes utiliza la información sobre la capacidad de almacenamiento si:

- la Feature gate de `CSIStorageCapacity` es `true`,
- un Pod usa un volumen que aún no se ha creado,
- ese volumen usa un {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} que hace referencia a un controlador CSI y usa el [modo de enlace de volumen] (/docs/concepts/storage/storage-classes/#volume-binding-mode)`WaitForFirstConsumer`,
  y
- el objeto `CSIDriver` para el controlador tiene `StorageCapacity` establecido en `true`.

En ese caso, el planificador sólo considera los nodos para el Pod que tienen suficiente almacenamiento disponible. Esta verificación es muy simplista y solo compara el tamaño del volumen con la capacidad indicada en los objetos `CSIStorageCapacity` con una topología que incluye el nodo.

Para los volúmenes con el modo de enlace de volumen `Immediate`, el controlador de almacenamiento decide dónde crear el volumen, independientemente de los pods que usarán el volumen.
Luego, el planificador programa los pods en los nodos donde el volumen está disponible después de que se haya creado.

Para los [volúmenes efímeros de CSI](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes),
la planificación siempre ocurre sin considerar la capacidad de almacenamiento. Esto se basa en la suposición de que este tipo de volumen solo lo utilizan controladores CSI especiales que son locales a un nodo y no necesitan allí recursos importantes.

## Replanificación

Cuando se selecciona un nodo para un Pod con volúmenes `WaitForFirstConsumer`, esa decisión sigue siendo tentativa. El siguiente paso es que se le pide al controlador de almacenamiento CSI que cree el volumen con una pista de que el volumen está disponible en el nodo seleccionado.

Debido a que Kubernetes pudo haber elegido un nodo basándose en información de capacidad desactualizada, es posible que el volumen no se pueda crear realmente. Luego, la selección de nodo se restablece y el planificador de Kubernetes intenta nuevamente encontrar un nodo para el Pod.

## Limitaciones

El seguimiento de la capacidad de almacenamiento aumenta las posibilidades de que la planificación funcione en el primer intento, pero no puede garantizarlo porque el planificador tiene que decidir basándose en información potencialmente desactualizada. Por lo general, el mismo mecanismo de reintento que para la planificación sin información de capacidad de almacenamiento es manejado por los errores de planificación.

Una situación en la que la planificación puede fallar de forma permanente es cuando un pod usa varios volúmenes: es posible que un volumen ya se haya creado en un segmento de topología que luego no tenga suficiente capacidad para otro volumen. La intervención manual es necesaria para recuperarse de esto, por ejemplo, aumentando la capacidad o eliminando el volumen que ya se creó. [
Trabajo adicional](https://github.com/kubernetes/enhancements/pull/1703) para manejar esto automáticamente.

## Habilitación del seguimiento de la capacidad de almacenamiento

El seguimiento de la capacidad de almacenamiento es una función beta y está habilitada de forma predeterminada en un clúster de Kubernetes desde Kubernetes 1.21. Además de tener la función habilitada en el clúster, un controlador CSI también tiene que admitirlo. Consulte la documentación del controlador para obtener más detalles.

## {{% heading "whatsnext" %}}

- Para obtener más información sobre el diseño, consulte las
  [Restricciones de Capacidad de Almacenamiento para la Planificación de Pods KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1472-storage-capacity-tracking/README.md).
- Para obtener más información sobre un mayor desarrollo de esta función, consulte [problema de seguimiento de mejoras #1472](https://github.com/kubernetes/enhancements/issues/1472).
- Aprender sobre [Planificador de Kubernetes](/docs/concepts/scheduling-eviction/kube-scheduler/)
