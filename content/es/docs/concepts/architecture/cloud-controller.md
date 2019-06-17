---
title: Conceptos subyacentes del Cloud Controller Manager
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

El concepto del Cloud Controller Manager (CCM) (no confundir con el ejecutable) fue creado originalmente para permitir que Kubernetes y el código específico de proveedores de servicios en la nube evolucionasen de forma independiente. El Cloud Controller Manager se ejecuta a la par con otros componentes maestros como el Kubernetes Controller Manager, el API Server y el planificador. También puede ejecutarse como un extra, en cuyo caso se ejecuta por encima de Kubernetes.

El diseño del Cloud Controller Manager está basado en un sistema de plugins, lo que permite a nuevos proveedores de servicios integrarse de forma fácil con Kubernetes. Se está trabajando en incorporar nuevos proveedores de servicios y para migrar los existentes del viejo modelo al nuevo CCM.

Este documento describe los conceptos tras el Cloud Controller Manager y da detalles sobre sus funciones asociadas.

En la siguiente imagen, se puede ver la arquitectura de un cluster de Kubernetes que no utiliza el Cloud Controller Manager:

![Arquitectura previa a CCM](/images/docs/pre-ccm-arch.png)

{{% /capture %}}


{{% capture body %}}

## Diseño

En el diagrama anterior, Kubernetes y el proveedor de servicios en la nube están integrados a través de diferentes componentes:

* Kubelet
* Kubernetes controller manager
* Kubernetes API server

El CCM consolida toda la lógica dependiente de la nube de estos tres componentes para crear un punto de integración único. La nueva arquitectura con CCM se muestra a continuación:

![Arquitectura CCM](/images/docs/post-ccm-arch.png)

## Componentes del CCM

El CCM secciona parte de la funcionalidad del Kubernetes Controller Manager (KCM) y la ejecuta como procesos independientes. Específicamente, aquellos controladores en el KCM que son dependientes de la nube:

 * Controlador de Nodos
 * Controlador de Volúmenes
 * Controlador de Rutas
 * Controlador de Servicios

En la versión 1.9, el CCM se encarga de la ejecución de los siguientes controladores:

 * Controlador de Nodos
 * Controlador de Rutas
 * Controlador de Servicios

{{< note >}}
El controlador de volúmenes se dejó fuera del CCM de forma explícita. Debido a la complejidad que ello requería y a los esfuerzos existentes para abstraer lógica de volúmenes específica a proveedores de servicios, se decidió que el controlador de volúmenes no fuese movido al CCM.
{{< /note >}}

El plan original para habilitar volúmenes en CCM era utilizar volúmenes Flex con soporte para volúmenes intercambiables. Sin embargo, otro programa conocido como CSI (Container Storage Interface) se está planeando para reemplazar Flex.

Considerando todo lo anterior, se ha decidido esperar hasta que CSI esté listo.

## Funciones del CCM

El CCM hereda sus funciones de componentes que son dependientes de un proveedor de servicios en la nube. Esta sección se ha estructurado basado en dichos componentes:

### 1. Kubernetes Controller Manager

La mayoría de las funciones del CCM derivan del KCM. Como se ha mencionado en la sección anterior, el CCM es responsable de los siguientes circuitos de control: 

 * Controlador de Nodos
 * Controlador de Rutas
 * Controlador de Servicios

#### Controlador de Nodos

El controlador de nodos es responsable de inicializar un nodo obteniendo información del proveedor de servicios sobre los nodos ejecutándose en el clúster. El controlador de nodos lleva a cabo las siguientes funciones: 

1. Inicializa un nodo con etiquetas de región y zona específicas del proveedor.
2. Inicializa un nodo con detalles de la instancia específicos del proveedor, como por ejemplo, el tipo o el tamaño.
3. Obtiene las direcciones de red del nodo y su hostname.
4. En caso de que el nodo deje de responder, comprueba la nube para ver si el nodo ha sido borrado. Si lo ha sido, borra el objeto nodo en Kubernetes.

#### Controlador de Rutas

El controlador de Rutas es responsable de configurar rutas en la nube para que contenedores en diferentes nodos dentro de un clúster kubernetes se puedan comunicar entre sí.

#### Controlador de Servicios

El controlador de servicios es responsable de monitorizar eventos de creación, actualización y borrado de servicios. Basándose en el estado actual de los servicios en el clúster Kubernetes, configura balanceadores de carga del proveedor (como Amazon ELB, Google LB, or Oracle Cloud Infrastructure Lb) de forma que estos reflejen los servicios definidos en Kubernetes. Adicionalmente, se asegura de que los sistemas de apoyo de servicios para balanceadores de carga en la nube se encuentren actualizados.

### 2. Kubelet

El controlador de nodos incluye la funcionalidad del kubelet que es dependiente de la nube. Previa a la introducción de CCM, el kubelet era responsable de inicializar un nodo con detalles específicos al proveedor como direcciones IP, etiquetas de región/zona y tipo de instancia. La introduccion de CCM transfiere esta inicialización del kubelet al CCM.

En este nuevo modelo, el kubelet inicializa un nodo sin información especifica del proveedor de servicios. Sin embargo, añade un `taint` al nodo recién creado de forma que este no esté disponible para el planificador hasta que el CCM completa el nodo con la información específica del proveedor. Sólo entonces elimina el `taint` y el nodo se vuelve accesible.

## Mecanismo de Plugins (extensiones)

El Cloud Controller Manager utiliza interfaces Go(lang), lo que permite que implementaciones de cualquier proveedor de servicios sean conectadas. Específicamente, utiliza el CloudProvider Interface definido [aquí](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62).

La implementación de los cuatro controladores referenciados en este documento, algunas estructuras de inicialización junto con el interface CloudProvider, permanecerán como parte del núcleo de Kubernetes. 

Para más información sobre el desarrollo de extensiones/plugins, consultar [Desarrollo del CCM](https://kubernetes.io/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Autorización

Esta sección divide el nivel de acceso requerido por varios objetos API para que el CCM pueda llevar acabo sus operaciones.

### Controlador de Nodos

El controlador de nodos sólo opera con objetos Nodo. Necesita de acceso total para obtener, listar, crear, actualizar, arreglar, monitorizar y borrar objetos Nodo.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Controlador de Rutas

El controlador de rutas permanece a la escucha de eventos de creación de nodos y configura sus rutas. Necesita acceso a los objetos Nodo. 

v1/Node:

- Get

### Controlador de Servicios

El controlador de servicios permanece a la escucha de eventos de creación, actualización y borrado de objetos Servicio, y se encarga de configurar los endpoints para dichos servicios.

Para acceder a los objetos Servicio, necesita permisos para listar y monitorizar. Para el mantenimiento de servicios necesita permisos para parchear y actualizar.

Para configurar endpoints para los servicios necesita permisos para crear, listar, obtener, monitorizar y actualizar.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### Otros

La implementación del núcleo de CCM requiere acceso para crear eventos, y para asegurar la seguridad de operaciones; necesita acceso para crear ServiceAccounts.

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

El RBAC ClusterRole para CCM se muestra a continuación:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - patch
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```

## Implementaciones de Proveedores

Los siguientes proveedores de servicios en la nube han implementado CCMs:

* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [Azure](https://github.com/kubernetes/kubernetes/tree/master/pkg/cloudprovider/providers/azure)
* [GCE](https://github.com/kubernetes/kubernetes/tree/master/pkg/cloudprovider/providers/gce)
* [AWS](https://github.com/kubernetes/kubernetes/tree/master/pkg/cloudprovider/providers/aws)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)

## Administración del Clúster

Instrucciones para configurar y ejecutar el CCM pueden encontrarse [aquí](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).

{{% /capture %}}
