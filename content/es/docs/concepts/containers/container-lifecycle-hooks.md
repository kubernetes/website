---
title: Container Lifecycle Hooks
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Esta página describe como los contenedores gestionados por kubelet pueden utilizar el framework _Container lifecycle hook_ (hook del ciclo de vida del contenedor)
para ejecutar código disparado por eventos durante la gestión de su ciclo de vida (lifecycle).

{{% /capture %}}


{{% capture body %}}

## Introducción

De manera análoga a muchos frameworks de lenguajes de programación que tienen componentes hooks de lifecycle, como Angular,
Kubernetes también proporciona esta funcionalidad para los contenedores.
Los hooks permiten a los contenedores conocer los eventos en su gestión de ciclo de vida
y ejecutar el código implementado en un controlador cuando el hook de ciclo de vida correspondiente es ejecutado.

## Hooks de contenedores

Hay dos hooks expuestos en los contenedores:

`PostStart`

Este hook se ejecuta inmediatamente después de crear un contenedor.
Sin embargo, no es posible garantizar que el hook se ejecute antes del ENTRYPOINT del contenedor.
No se le pasa ningún parámetro.

`PreStop`

Este hook se llama inmediatamente antes de que se finalice un contenedor debido a una solicitud de API o evento de gestión como un fallo liveness, o contención de recursos entre otros. Una llamada al hook de Prestop falla si el contenedor ya está en estado terminated (finalizado) o completed (completado).
Es bloqueante, lo que significa que es sincrónico,
por lo que debe completarse antes de que la llamada para eliminar el contenedor pueda ser enviada.
No se le pasa ningún parámetro.

Puedes encontrar información más detallada sobre el comportamiento de finalización de un contenedor
[Finalización de Pods](/docs/es/concepts/workloads/pods/pod/#termination-of-pods).

### Implementación de controladores de hooks

Los contenedores pueden acceder a un hook implementando y registrado en un controlador de este hook.
Hay dos tipos de controladores de hooks que se pueden implementar para los contenedores:

* Exec: ejecuta un comando específico, como `pre-stop.sh`, dentro de cgroups y namespaces del contenedor.
Los recursos consumidos por el comando serán tomados en cuenta para el contenedor.
* HTTP: ejecuta una petición HTTP contra un endpoint específico dentro del contenedor.

### Ejecución de controladores de hooks

Cuando se llama un hook de gestión de ciclo de vida de un contenedor,
el sistema de gestión de Kubernetes ejecuta el controlador en el contenedor registrado para este hook.

Las llamadas al controlador de hooks son síncronas dentro del contexto del Pod que contiene el contenedor.
Esto significa que para un hook `PostStart`,
el ENTRYPOINT del contenedor y el hook se disparan de forma asíncrona.
Sin embargo, si el hook tarda demasiado en ejecutarse o se cuelga,
el contenedor no puede alcanzar el estado de `running` (en ejecución).

El comportamiento es similar para un hook `PreStop`.
Si el hook se cuelga durante la ejecución,
la fase del Pod permanece en un estado de `terminating` (finalizando) y se cancela después del  `terminationGracePeriodSeconds` (finalización después del periodo de gracia) del pod en cuestión.
Si un hook `PostStart` o` PreStop` falla, se mata el contenedor.

Los usuarios deben hacer que sus controladores de hooks sean lo más livianos posible.
Hay casos, sin embargo, que los comandos de larga ejecución tienen sentido,
como cuando se guarda el estado antes de detener un contenedor.

### Garantías de entrega de hooks

La entrega de un hook está destinada a ser enviada *al menos una vez*,
lo que significa que un hook puede ser llamado varias veces para cualquier evento dado,
tanto para `PostStart` como para ` PreStop`.
Depende de la implementación del hook manejar esto correctamente.

En general, solo se realizan entregas individuales.
Si, por ejemplo, un receptor hook HTTP está inactivo y no puede recibir tráfico,
no hay ningún reintento.
Sin embargo, en algunos casos puede ocurrir una doble entrega.
Por ejemplo, si un Kubelet se reinicia durante la ejecución de envio de un hook,
el hook puede volver a enviarse después de que el kubelet se levante.


### Depurando controladores de hooks

Los logs de un controlador de hooks no son expuestos en los eventos del Pod.
Si un controlador falla por alguna razón, emite un evento.
Para `PostStart`, es el evento `FailedPostStartHook`,
y para `PreStop`, el evento `FailedPreStopHook`.
Puedes ver que eventos están en ejecución con el comando `kubectl describe pod <pod_name>`.
El siguiente ejemplo muestra los eventos en ejecución a través del comando anterior:

```
Events:
  FirstSeen  LastSeen  Count  From                                                   SubobjectPath          Type      Reason               Message
  ---------  --------  -----  ----                                                   -------------          --------  ------               -------
  1m         1m        1      {default-scheduler }                                                          Normal    Scheduled            Successfully assigned test-1730497541-cq1d2 to gke-test-cluster-default-pool-a07e5d30-siqd
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulling              pulling image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Created              Created container with docker id 5c6a256a2567; Security:[seccomp=unconfined]
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulled               Successfully pulled image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Started              Started container with docker id 5c6a256a2567
  38s        38s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 5c6a256a2567: PostStart handler: Error executing in Docker Container: 1
  37s        37s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 8df9fdfd7054: PostStart handler: Error executing in Docker Container: 1
  38s        37s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}                         Warning   FailedSync           Error syncing pod, skipping: failed to "StartContainer" for "main" with RunContainerError: "PostStart handler: Error executing in Docker Container: 1"
  1m         22s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Warning   FailedPostStartHook
```

{{% /capture %}}

{{% capture whatsnext %}}

* Aprende más sobre [variables de entorno de contenedores](/docs/concepts/containers/container-environment-variables/).
* Practica 
  [adjuntando controladores a los eventos de lifecycle de los contenedores](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

{{% /capture %}}
