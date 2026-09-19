---
reviewers:
- mikedanese
- thockin
title: Entorno del contenedor
content_type: concept
weight: 20
---

<!-- overview -->

En esta página se describen los recursos disponibles para los contenedores en el entorno del contenedor. 




<!-- body -->

## Entorno del contenedor

El entorno de contenedor de Kubernetes proporciona varios recursos importantes a los contenedores:

* Un sistema de archivos, que es una combinación de una [imagen](/docs/concepts/containers/images/) y uno o más [volúmenes](/docs/concepts/storage/volumes/).
* Información sobre el propio contenedor.
* Información sobre otros objetos en el clúster.

### Información del contenedor

El *hostname* de un contenedor es el nombre del Pod en el que se está ejecutando.
Está disponible a través del comando `hostname` o de la
llamada a la función [`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html)
en libc.

El nombre y el espacio de nombres del Pod están disponibles como variables de entorno a través de la
[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

Las variables de entorno definidas por el usuario en la definición del Pod también están disponibles para el contenedor,
al igual que cualquier variable de entorno especificada estáticamente en la imagen del contenedor.

### Información del clúster

Una lista de todos los servicios que estaban en ejecución cuando se creó un contenedor está disponible para dicho contenedor como variables de entorno.
Esta lista se limita a los servicios dentro del mismo espacio de nombres que el Pod del nuevo contenedor y a los servicios del plano de control de Kubernetes.

Para un servicio llamado *foo* que expone un conjunto de Pods, cada uno ejecutando un contenedor llamado *bar*,
se definen las siguientes variables:

```shell
FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>
```

Los servicios tienen direcciones IP dedicadas y están disponibles para el contenedor a través de DNS,
si el [complemento de DNS](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/) está habilitado. 



## {{% heading "whatsnext" %}}


* Aprende más sobre los [hooks del ciclo de vida de los contenedores](/docs/concepts/containers/container-lifecycle-hooks/).
* Adquiere experiencia práctica
  [adjuntando manejadores a los eventos del ciclo de vida del contenedor](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
