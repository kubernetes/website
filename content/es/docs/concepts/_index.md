---
title: Conceptos
main_menu: true
content_type: concept
weight: 40
---

<!-- overview -->

La sección de conceptos te ayudará a conocer los componentes de Kubernetes así como las abstracciones que utiliza para representar tu cluster. Además, te ayudará a obtener un conocimiento más profundo sobre cómo funciona Kubernetes.



<!-- body -->

## Introducción

En Kubernetes se utilizan los *objetos de la API de Kubernetes* para describir el *estado deseado* del clúster: qué aplicaciones u otras cargas de trabajo se quieren ejecutar, qué imagenes de contenedores usan, el número de replicas, qué red y qué recursos de almacenamiento quieres que tengan disponibles, etc. Se especifica el estado deseado del clúster mediante la creación de objetos usando la API de Kubernetes, típicamente mediante la interfaz de línea de comandos, `kubectl`. También se puede usar la API de Kubernetes directamente para interactuar con el clúster y especificar o modificar tu estado deseado.

Una vez que se especifica el estado deseado, el *Plano de Control de Kubernetes* realizará las acciones necesarias para que el estado actual del clúster coincida con el estado deseado. Para ello, Kubernetes realiza diferentes tareas de forma automática, como pueden ser: parar o arrancar contenedores, escalar el número de réplicas de una aplicación dada, etc. El Plano de Control de Kubernetes consiste en un grupo de daemons que corren en tu clúster:

* El **Master de Kubernetes** es un conjunto de tres daemons que se ejecutan en un único nodo del clúster, que se denomina nodo master. Estos daemons son: [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) y [kube-scheduler](/docs/admin/kube-scheduler/).

* Los restantes nodos no master contenidos en tu clúster, ejecutan los siguientes dos daemons:
  * **[kubelet](/docs/admin/kubelet/)**, el cual se comunica con el Master de Kubernetes.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, un proxy de red que implementa los servicios de red de Kubernetes en cada nodo.

## Objetos de Kubernetes

Kubernetes tiene diferentes abstracciones que representan el estado de tu sistema: aplicaciones contenerizadas desplegadas y cargas de trabajo, sus recursos de red y almacenamiento asociados e información adicional acerca de lo que el clúster está haciendo en un momento dado. Estas abstracciones están representadas por objetos de la API de Kubernetes. Puedes revisar [Entendiendo los Objetos de Kubernetes] (/docs/concepts/overview/working-with-objects/kubernetes-objects/) para obtener más detalles.

Los objetos básicos de Kubernetes incluyen:

* [Pod](/es/docs/concepts/workloads/pods/pod/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/es/docs/concepts/overview/working-with-objects/namespaces/)

Además, Kubernetes contiene abstracciónes de nivel superior llamadas Controladores. Los Controladores se basan en los objetos básicos y proporcionan funcionalidades adicionales sobre ellos. Incluyen:

* [ReplicaSet](/es/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/es/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/es/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/es/docs/concepts/workloads/controllers/daemonset/)
* [Job](/es/docs/concepts/workloads/controllers/jobs-run-to-completion/)


## Plano de Control de Kubernetes

Los distintos componentes del Plano de Control de Kubernetes, tales como el Master de Kubernetes y el proceso kubelet, gobiernan cómo Kubernetes se comunica con el clúster. El Plano de Control mantiene un registro de todos los Objetos de Kubernetes presentes en el sistema y ejecuta continuos bucles de control para gestionar el estado de los mismos. En un momento dado, los bucles del Plano de Control responderán a los cambios que se realicen en el clúster y ejecutarán las acciones necesarias para hacer que el estado actual de todos los objetos del sistema converjan hacia el estado deseado que has proporcionado.

Por ejemplo, cuando usas la API de Kubernetes para crear un Deployment, estás proporcionando un nuevo estado deseado para el sistema. El Plano de Control de Kubernetes registra la creación del objeto y lleva a cabo tus instrucciones ejecutando las aplicaciones requeridas en los nodos del clúster, haciendo de esta manera que el estado actual coincida con el estado deseado.

### El Master de Kubernetes

El Master de Kubernetes es el responsable de mantener el estado deseado de tu clúster. Cuando interactuas con Kubernetes, como por ejemplo cuando utilizas la interfaz de línea de comandos `kubectl`, te estás comunicando con el master de tu clúster de Kubernetes.

> Por "master" entendemos la colección de daemons que gestionan el estado del clúster. Típicamente, estos daemons se ejecutan todos en un único nodo del clúster, y este nodo recibe por tanto la denominación de master. El master puede estar replicado por motivos de disponibilidad y redundancia.

### Kubernetes Nodes

En un clúster de Kubernetes, los nodos son las máquinas (máquinas virtuales, servidores físicos, etc) que ejecutan tus aplicaciones y flujos de trabajo en la nube. El master de Kubernetes controla cada nodo, por lo que en raras ocasiones interactuarás con los nodos directamente.

#### Metadatos de los Objectos


* [Annotations](/es/docs/concepts/overview/working-with-objects/annotations/)



## {{% heading "whatsnext" %}}


Si quieres empezar a contribuir a la documentación de Kubernetes accede la pagina [Empieza a contribuir](/es/docs/contribute/start/).


