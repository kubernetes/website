---
title: Conceptos
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

La sección de Conceptos te ayuda a entender las distintas partes de Kubernetes, así como las abstracciones que Kubernetes utiliza para representar tu clúster, permitiéndote obtener un conocimiento profundo de cómo funciona Kubernetes.

{{% /capture %}}

{{% capture body %}}

## Resumen

Cuando trabajas con Kubernetes, se utilizan los *objetos de la API de Kubernetes* para describir lo que se conoce como el *estado deseado*, esto es, qué aplicaciones u otro tipo de procesos quieres ejecutar, qué imágenes de contenedor utilizan, el número de réplicas, qué recursos de red y disco hay disponibles, y más. Para indicar tu estado deseado, deberás crear objetos en la API de Kubernetes, típicamente mediante el interfaz de línea de comandos, `kubectl`. También puedes usar directamente la API de Kubernetes para interactuar con el clúster e indicar o modificar el estado deseado. 

Una vez has establecido el estado deseado, el *Plano de Control de Kubernetes* hace que el estado actual del clúster coincida con dicho estado deseado. Para ello, Kubernetes realiza varias tareas de forma automática -- como arrancar contenedores, escalar el número de réplicas de una aplicación determinada, y más. El Plano de Control de Kubernetes consiste en una colección de procesos que corren en tu clúster: 

* El **Máster de Kubernetes** es una colección de tres procesos que corren en un único nodo de tu clúster, el cual se designa como el nodo máster. Los procesos son: [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) y [kube-scheduler](/docs/admin/kube-scheduler/).
* Por contra, cada nodo que no es máster, corre dos procesos:
  * **[kubelet](/docs/admin/kubelet/)**, que se comunica con el Máster de Kubernetes.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, una delegación a nivel de red que gestiona los servicios de red en cada nodo.

## Objetos de Kubernetes

Kubernetes contiene una serie de abstracciones que representan el estado de tu clúster, esto es, las aplicaciones y procesos desplegados como contenedores, sus recursos de red y disco asociados, y cualquier otra información acerca de lo que tu clúster está haciendo en cada momento. Estas abstracciones se representan en forma de objetos en la API de Kubernetes; ver el [resumen de los Objectos de Kubernetes](/docs/concepts/abstractions/overview/) para más información. 

Los objetos básicos de Kubernetes son:

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

Además, Kubernetes contiene una serie de abstracciones de alto nivel denominadas Controllers. Dichos Controllers se construyen a partir de los objetos básicos y proveen de funcionalidad añadida y características convenientes. Estamos hablando de:

* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## Plano de Control de Kubernetes

Las distintas partes del Plano de Control de Kubernetes, como el Máster de Kubernetes y los procesos kubelet, gobiernan la forma en que Kubernetes se comunica con tu clúster. El Plano de Control mantiene un registro de todos los objetos de Kubernetes en el sistema, ejecutando ciclos continuos de control para gestionar el estado de dichos objetos. Así, en cualquier momento, dichos ciclos de control del Plano de Control responderán a los cambios en el clúster haciendo que el estado actual de todos los objetos en el sistema coincida con el estado deseado que indicaste.

Por ejemplo, cuando utilizas la API de Kubernetes para crear un objeto Deployment, estableces un nuevo estado deseado para el sistema. El Plano de Control de Kubernetes registra la creación de ese objeto y, seguidamente, lleva a cabo tus instrucciones arrancando las aplicaciones que sea necesario, así como planificando su despliegue en los nodos del clúster -- por consiguiente, haciendo coincidir el estado actual del clúster con el estado deseado.

### Máster de Kubernetes

El máster de Kubernetes es el responsable de mantener el estado deseado de tu clúster. Cuando interactúas con Kubernetes, por ejemplo utilizando el interfaz de línea de comandos `kubectl`, te comunicas con el máster de tu clúster de Kubernetes.

> El "máster" se refiere a la colección de procesos que gestionan el estado del clúster. Típicamente, dichos procesos corren todos en un único nodo del clúster, y nos referimos a dicho nodo igualmente como máster. El máster puede estar replicado para garantizar la disponibilidad y la redundancia.

### Nodos de Kubernetes

Los nodos de un clúster son las máquinas (MVs, servidores físicos, etc.) que ejecutan tus aplicaciones y procesos. El máster de Kubernetes controla cada nodo; de hecho, raramente tendrás que interactuar directamente con un nodo no máster.

#### Metadatos de Objeto


* [Anotaciones](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

Si quisieras escribir una página de concepto, echa un vistazo a
[Usando Plantillas de Página](/docs/home/contribute/page-templates/)
para información acerca del tipo de página de concepto y su plantilla asociada.

{{% /capture %}}
