---
title: Depurar Contenedores de Inicialización
content_type: task
---

<!-- overview -->

Esta página muestra cómo investigar problemas relacionados con la ejecución
de los contenedores de inicialización (init containers). Las líneas de comando del ejemplo de abajo
se refieren al Pod como `<pod-name>` y a los Init Containers como `<init-container-1>` e
  `<init-container-2>` respectivamente.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Deberías estar familizarizado con el concepto de [Init Containers](/docs/concepts/abstractions/init-containers/).
* Deberías conocer la [Configuración de un Init Container](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container/).



<!-- steps -->

## Comprobar el estado de los Init Containers

Muestra el estado de tu pod:

```shell
kubectl get pod <pod-name>
```

Por ejemplo, un estado de `Init:1/2` indica que uno de los Init Containers
se ha ejecutado satisfactoriamente:

```
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

Echa un vistazo a [Comprender el estado de un Pod](#understanding-pod-status) para más ejemplos
de valores de estado y sus significados.

## Obtener detalles acerca de los Init Containers

Para ver información detallada acerca de la ejecución de un Init Container:

```shell
kubectl describe pod <pod-name>
```

Por ejemplo, un Pod con dos Init Containers podría mostrar lo siguiente:

```
Init Containers:
  <init-container-1>:
    Container ID:    ...
    ...
    State:           Terminated
      Reason:        Completed
      Exit Code:     0
      Started:       ...
      Finished:      ...
    Ready:           True
    Restart Count:   0
    ...
  <init-container-2>:
    Container ID:    ...
    ...
    State:           Waiting
      Reason:        CrashLoopBackOff
    Last State:      Terminated
      Reason:        Error
      Exit Code:     1
      Started:       ...
      Finished:      ...
    Ready:           False
    Restart Count:   3
    ...
```

También puedes acceder al estado del Init Container de forma programática mediante
la lectura del campo `status.initContainerStatuses` dentro del Pod Spec:


```shell
kubectl get pod nginx --template '{{.status.initContainerStatuses}}'
```


Este comando devolverá la misma información que arriba en formato JSON.

## Acceder a los logs de los Init Containers

Indica el nombre del Init Container así como el nombre del Pod para
 acceder a sus logs.

```shell
kubectl logs <pod-name> -c <init-container-2>
```

Los Init Containers que ejecutan secuencias de línea de comandos muestran los comandos
conforme se van ejecutando. Por ejemplo, puedes hacer lo siguiente en Bash
indicando `set -x` al principio de la secuencia.



<!-- discussion -->

## Comprender el estado de un Pod

Un estado de un Pod que comienza con `Init:` especifica el estado de la ejecución de
un Init Container. La tabla a continuación muestra algunos valores de estado de ejemplo
que puedes encontrar al depurar Init Containers.

Estado | Significado
------ | -------
`Init:N/M` | El Pod tiene `M` Init Containers, y por el momento se han completado `N`.
`Init:Error` | Ha fallado la ejecución de un Init Container.
`Init:CrashLoopBackOff` | Un Init Container ha fallado de forma repetida.
`Pending` | El Pod todavía no ha comenzado a ejecutar sus Init Containers.
`PodInitializing` o `Running` | El Pod ya ha terminado de ejecutar sus Init Containers.





