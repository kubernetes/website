---
title: Autorreparación de Kubernetes 
content_type: concept  
weight: 50  
feature:
  title: Autorreparación
  anchor: Recuperación automatizada ante fallos
  description: >
    Kubernetes reinicia los contenedores que fallan, reemplaza Pods enteros cuando es necesario,
    vuelve a adjuntar el almacenamiento en respuesta a fallos de mayor alcance, y puede integrarse con 
    escaladores automáticos de nodos para autorrepararse incluso a nivel de nodo.
---
<!-- overview -->

Kubernetes está diseñado con capacidades de autorreparación que ayudan a mantener la salud y disponibilidad de las cargas de trabajo.
Automáticamente reemplaza contenedores fallidos, reprograma cargas de trabajo cuando los nodos están indisponibles, y asegura que el estado deseado del sistema se mantenga.

<!-- body -->

## Capacidades de autorreparación {#self-healing-capabilities} 

- **Reinicios a nivel de contenedor:** Si un contenedor dentro de un Pod falla, Kubernetes lo reiniciará en base a su [`restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).

- **Reemplazo de réplicas:** Si un Pod en un [Deployment](/docs/concepts/workloads/controllers/deployment/) o [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) falla, Kubernetes crea un Pod de reemplazo para mantener el número especificado de réplicas.
  Si un Pod que es parte de un [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) falla, el plano de control 
  crea un Pod de reemplazo para ejecutarse en el mismo nodo.
  
- **Recuperación de almacenamiento persistente:** Si un nodo está ejecutando un Pod con un PersistentVolume (PV) adjunto, y el nodo falla, Kubernetes puede volver a adjuntar el volumen a un nuevo Pod en un nodo diferente.

- **Balanceo de carga para los Services:** Si un Pod detrás de un [Service](/docs/concepts/services-networking/service/) falla, Kubernetes automáticamente lo elimina de los endpoints del Service para enrutar el tráfico únicamente a Pods saludables.

Estos son algunos de los componentes clave que proporcionan autorreparación a Kubernetes:

- **[kubelet](/docs/concepts/architecture/#kubelet):** Asegura que los contenedores estén ejecutándose, y reinicia aquellos que fallan.

- **Controladores de Deployment (vía ReplicaSet), ReplicaSet, StatefulSet y DaemonSet:** Mantienen el número deseado de réplicas del Pod.

- **Controlador de PersistentVolume:** Gestiona la conexión y desconexión de volúmenes para cargas de trabajo con estado.

## Consideraciones {#considerations} 

- **Fallos de almacenamiento:** Si un volumen persistente deja de estar disponible, pueden requerirse pasos de recuperación.

- **Errores de aplicación:** Kubernetes puede reiniciar contenedores, pero los problemas subyacentes a la aplicación deben ser atendidos por separado.

## {{% heading "whatsnext" %}} 

- Lee más sobre [Pods](/docs/concepts/workloads/pods/)
- Aprende sobre [Controladores de Kubernetes](/docs/concepts/architecture/controller/)
- Explora [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
- Lee sobre el [escalado automático de nodos](/docs/concepts/cluster-administration/node-autoscaling/). El escalado automático de nodos
  también proporciona reparación automática si los nodos de tu clúster fallan.
