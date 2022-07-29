---
reviewers:
- astuky
- raelga
title: Variables de entorno de un Container
content_type: concept
weight: 20
---

<!-- overview -->

Esta página explica los recursos disponibles para Containers dentro del entorno de un Container.




<!-- body -->

## Entorno del Container

El entorno de los Containers de Kubernetes, añade múltiples recursos importantes a los Containers:

* Un sistema de ficheros que es la combinación de una [imagen](/docs/concepts/containers/images/) y uno o más [volúmenes](/docs/concepts/storage/volumes/).
* Información sobre el propio Container.
* Información sobre otros objetos en el clúster.

### Información del Container

El *hostname* de un Container es el nombre del Pod donde el Container está funcionando.
Está disponible a través del comando `hostname` o con la función [`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html) de la libc.

El nombre del Pod y el namespace están disponibles como variables de entorno a través de la
[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

Las variables de entorno definidas por el usuario en la definición del Pod están también disponibles en el Container,
así como cualquier variable de entorno definida de forma estática en la imagen de Docker.

### Información del Cluster

Una lista de todos los servicios que se ejecutaban cuando se creó el Container está disponible a través de variables de entorno.
La sintaxis de estas variables de entorno coincide con la de los links de Docker.

Para un servicio llamado *foo* que mapea un Container llamado *bar*,
las siguientes variables de entorno estan definidas:

```shell
FOO_SERVICE_HOST=<El host donde está funcionando el servicio>
FOO_SERVICE_PORT=<El puerto dónde está funcionando el servicio>
```
Los servicios tienen direcciones IP dedicadas y están disponibles para el Container a través de DNS,
si el [complemento para DNS](http://releases.k8s.io/master/cluster/addons/dns/) está habilitado.



## {{% heading "whatsnext" %}}


* Más información sobre cómo ejecutar código en respuesta a los cambios de etapa durante ciclo de vida de un contenedor la puedes encontrar en [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
* Practica [añadiendo handlers a los lifecycle events de un Container ](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).


