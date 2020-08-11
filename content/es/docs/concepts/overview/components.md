---
reviewers:
- raelga
title: Componentes de Kubernetes
content_type: concept
weight: 20
card:
  name: concepts
  weight: 20
---

<!-- overview -->

Este documento describe los distintos componentes que
son necesarios para operar un clúster de Kubernetes.

<!-- body -->

## Componentes del plano de control

Los componentes que forman el plano de control toman decisiones globales sobre
el clúster (por ejemplo, la planificación) y detectan y responden a eventos del clúster, como la creación
de un nuevo pod cuando la propiedad `replicas` de un controlador de replicación no se cumple.

Estos componentes pueden ejecutarse en cualquier nodo del clúster. Sin embargo para simplificar, los
scripts de instalación típicamente se inician en el mismo nodo de forma exclusiva,
sin que se ejecuten contenedores de los usuarios en esos nodos. El plano de control se ejecuta en varios nodos
para garantizar la [alta disponibilidad](/docs/admin/high-availability/).

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Estos controladores incluyen:

  * Controlador de nodos: es el responsable de detectar y responder cuándo un nodo deja de funcionar
  * Controlador de replicación: es el responsable de mantener el número correcto de pods para cada controlador
  de replicación del sistema
  * Controlador de endpoints: construye el objeto `Endpoints`, es decir, hace una unión entre los `Services` y los `Pods`
  * Controladores de tokens y cuentas de servicio: crean cuentas y tokens de acceso a la API por defecto para los nuevos {{< glossary_tooltip text="Namespaces" term_id="namespace">}}.

### cloud-controller-manager

[cloud-controller-manager](/docs/tasks/administer-cluster/running-cloud-controller/) ejecuta controladores que
interactúan con proveedores de la nube. El binario `cloud-controller-manager` es una característica alpha que se introdujo en la versión 1.6 de Kubernetes.

`cloud-controller-manager` sólo ejecuta ciclos de control específicos para cada proveedor de la nube. Es posible
desactivar estos ciclos en `kube-controller-manager` pasando la opción `--cloud-provider= external` cuando se arranque el `kube-controller-manager`.

`cloud-controller-manager` permite que el código de Kubernetes y el del proveedor de la nube evolucionen de manera independiente. Anteriormente, el código de Kubernetes dependía de la funcionalidad específica de cada proveedor de la nube. En el futuro, el código que sea específico a una plataforma debería ser mantenido por el proveedor de la nube y enlazado a `cloud-controller-manager` al correr Kubernetes.

Los siguientes controladores dependen de alguna forma de un proveedor de la nube:

  * Controlador de nodos: es el responsable de detectar y actuar cuándo un nodo deja de responder
  * Controlador de rutas: para configurar rutas en la infraestructura de nube subyacente
  * Controlador de servicios: para crear, actualizar y eliminar balanceadores de carga en la nube
  * Controlador de volúmenes: para crear, conectar y montar volúmenes e interactuar con el proveedor de la nube para orquestarlos

## Componentes de nodo

Los componentes de nodo corren en cada nodo, manteniendo a los pods en funcionamiento y proporcionando el entorno de ejecución de Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

[kube-proxy](/docs/admin/kube-proxy/) permite abstraer un servicio en Kubernetes manteniendo las
reglas de red en el anfitrión y haciendo reenvío de conexiones.

### Runtime de contenedores

El {{< glossary_tooltip term_id="container-runtime" text="runtime de los contenedores" >}} es el software responsable de ejecutar los contenedores. Kubernetes soporta varios de
ellos: [Docker](http://www.docker.com), [containerd](https://containerd.io), [cri-o](https://cri-o.io/), [rktlet](https://github.com/kubernetes-incubator/rktlet) y cualquier implementación de la interfaz de runtime de contenedores de Kubernetes, o [Kubernetes CRI](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).

## Addons

Los _addons_ son pods y servicios que implementan funcionalidades del clúster. Estos pueden ser administrados
por `Deployments`, `ReplicationControllers` y otros. Los _addons_ asignados a un espacio de nombres se crean en el espacio `kube-system`.

Más abajo se describen algunos _addons_. Para una lista más completa de los _addons_ disponibles, por favor visite [Addons](/docs/concepts/cluster-administration/addons/).

### DNS

Si bien los otros _addons_ no son estrictamente necesarios, todos los clústers de Kubernetes deberían tener un [DNS interno del clúster](/docs/concepts/services-networking/dns-pod-service/) ya que la mayoría de los ejemplos lo requieren.

El DNS interno del clúster es un servidor DNS, adicional a los que ya podrías tener en tu red, que sirve registros DNS a los servicios de Kubernetes.

Los contenedores que son iniciados por Kubernetes incluyen automáticamente este servidor en sus búsquedas DNS.

### Interfaz Web (Dashboard) {#dashboard}

El [Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) es una interfaz Web de propósito general para clústeres de Kubernetes. Le permite a los usuarios administrar y resolver problemas que puedan presentar tanto las aplicaciones como el clúster.

### Monitor de recursos de contenedores

El [Monitor de recursos de contenedores](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) almacena
de forma centralizada series de tiempo con métricas sobre los contenedores, y provee una interfaz para navegar estos
datos.

### Registros del clúster

El mecanismo de [registros del clúster](/docs/concepts/cluster-administration/logging/) está a cargo de almacenar
los registros de los contenedores de forma centralizada, proporcionando una interfaz de búsqueda y navegación.
