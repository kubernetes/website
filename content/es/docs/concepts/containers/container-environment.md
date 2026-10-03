---
reviewers:
- mikedanese
- thockin
title: Entorno de Contenedores
content_type: concept
weight: 20
---

<!-- overview -->

Esta página describe los recursos disponibles para los Containers (Contenedores) en el entorno del Container.




<!-- body -->

## Entorno del Container

El entorno del Container de Kubernetes proporciona varios recursos importantes a los Containers:

* Un sistema de archivos, que es una combinación de una [imagen](/docs/concepts/containers/images/) y uno o más [volúmenes](/docs/concepts/storage/volumes/).
* Información sobre el Container en sí.
* Información sobre otros objetos en el clúster.

### Información del Container

El *hostname* de un Container es el nombre del Pod en el que se está ejecutando el Container.
Está disponible a través del comando `hostname` o de la función
[`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html)
en libc.

El nombre del Pod y el namespace están disponibles como variables de entorno a través de la
[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

Las variables de entorno definidas por el usuario en la definición del Pod también están disponibles para el Container,
así como cualquier variable de entorno especificada de forma estática en la imagen del contenedor.

### Información del clúster

Una lista de todos los servicios que se estaban ejecutando cuando se creó un Container está disponible para dicho Container como variables de entorno.
Esta lista se limita a los servicios dentro del mismo namespace que el Pod del nuevo Container y a los servicios del plano de control de Kubernetes.

Para un servicio llamado *foo* que expone un conjunto de Pods, cada uno ejecutando un contenedor llamado *bar*,
se definen las siguientes variables:

```shell
FOO_SERVICE_HOST=<el host en el que se está ejecutando el servicio>
FOO_SERVICE_PORT=<el puerto en el que se está ejecutando el servicio>
```

Los servicios tienen direcciones IP dedicadas y están disponibles para el Container a través de DNS,
si el [complemento para DNS](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/) está habilitado.



## {{% heading "whatsnext" %}}


* Obtén más información sobre los [hooks del ciclo de vida del Container](/docs/concepts/containers/container-lifecycle-hooks/).
* Practica
  [añadiendo manejadores a eventos del ciclo de vida de un Container](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

