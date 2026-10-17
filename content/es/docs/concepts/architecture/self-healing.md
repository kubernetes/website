---
title: Autorrecuperación en Kubernetes
content_type: concept
weight: 50
feature:
  title: Autorrecuperación
  anchor: Recuperación automatizada ante fallos
  description: >
    Kubernetes reinicia los contenedores que fallan, reemplaza Pods completos donde sea necesario,
    vuelve a asociar el almacenamiento en respuesta a fallos más amplios y puede integrarse con
    escaladores automáticos de nodos para autorrecuperarse incluso a nivel de nodo.
---
<!-- overview -->

Kubernetes está diseñado con capacidades de autorrecuperación que ayudan a mantener el estado y la disponibilidad de las cargas de trabajo.
Reemplaza automáticamente contenedores fallidos, reprograma cargas de trabajo cuando los nodos dejan de estar disponibles y asegura que se mantenga el estado deseado del sistema.

<!-- body -->

## Capacidades de autorrecuperación {#capacidades-de-autorrecuperación}

- **Reinicios a nivel de contenedor:** Si un contenedor dentro de un Pod falla, Kubernetes lo reinicia según la política [`restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).

- **Reemplazo de réplicas:** Si un Pod en un [Deployment](/docs/concepts/workloads/controllers/deployment/) o [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) falla, Kubernetes crea un Pod de reemplazo para mantener la cantidad especificada de réplicas.
  Si un Pod que forma parte de un [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) falla, el plano de control
  crea un Pod de reemplazo para que se ejecute en el mismo nodo.
  
- **Recuperación de almacenamiento persistente:** Si un nodo está ejecutando un Pod con un PersistentVolume (PV) adjunto y el nodo falla, Kubernetes puede volver a adjuntar el volumen a un nuevo Pod en un nodo diferente.

- **Balanceo de carga para Services:** Si un Pod detrás de un [Service](/docs/concepts/services-networking/service/) falla, Kubernetes lo elimina automáticamente de los endpoints del Service para enrutar el tráfico únicamente a Pods saludables.

A continuación se presentan algunos de los componentes clave que proporcionan la autorrecuperación en Kubernetes:

- **[kubelet](/docs/concepts/architecture/#kubelet):** Garantiza que los contenedores estén en ejecución y reinicia aquellos que fallan.

- **Controladores de Deployment (vía ReplicaSet), ReplicaSet, StatefulSet y DaemonSet:** Mantienen la cantidad deseada de réplicas de Pods.

- **Controlador de PersistentVolume:** Gestiona la conexión y desconexión de volúmenes para cargas de trabajo con estado.

## Consideraciones {#consideraciones}

- **Fallos de almacenamiento:** Si un volumen persistente deja de estar disponible, es posible que se requieran pasos de recuperación manuales.

- **Errores de aplicación:** Kubernetes puede reiniciar contenedores, pero los problemas subyacentes de la aplicación deben resolverse por separado.

## {{% heading "whatsnext" %}}

- Lee más sobre los [Pods](/docs/concepts/workloads/pods/)
- Aprende sobre los [Controladores de Kubernetes](/docs/concepts/architecture/controller/)
- Explora los [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
- Lee sobre el [escalado automático de nodos](/docs/concepts/cluster-administration/node-autoscaling/). El escalado automático de nodos
  también proporciona autorrecuperación cuando fallan nodos en tu clúster.
