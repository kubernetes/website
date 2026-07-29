---
title: Drenar un nodo de forma segura
content_type: task
weight: 310
---

<!-- overview -->
Esta página muestra cómo drenar de forma segura un {{< glossary_tooltip text="nodo" term_id="node" >}},
opcionalmente con respecto al presupuesto de interrupción de pods definido.

## {{% heading "prerequisites" %}}

Esta tarea asume que cumples los siguientes requisitos previos:

  1. No requieres que tus aplicaciones sean altamente disponibles durante el drenaje del nodo, o
  2. Has leído sobre el concepto de [presupuesto de interrupción de pods](/es/docs/concepts/workloads/pods/disruptions/) 
     y has [configurado presupuestos de interrupción de pods](/es/docs/tasks/run-application/configure-pdb/) para
     las aplicaciones que lo necesiten.

<!-- steps -->

## (Opcional) Configura un presupuesto de interrupción

Para asegurarte de que tus cargas de trabajo permanecen disponibles durante el mantenimiento, puedes
configurar un [presupuesto de interrupción de pods](/es/docs/concepts/workloads/pods/disruptions/).

Si la disponibilidad es importante para cualquiera de las aplicaciones que podrían ejecutarse en el/los nodo(s)
que estás drenando, [configura un presupuesto de interrupción de pods](/es/docs/tasks/run-application/configure-pdb/)
antes de seguir con esta guía.

Se recomienda configurar `AlwaysAllow` como [Política de Desalojo de pods No Saludables](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)
en tu presupuesto de interrupción de pods para permitir el desalojo de aplicaciones que no funcionen correctamente durante el drenaje de un nodo.
El comportamiento por defecto es esperar a que los pods de la aplicación pasen a estar [saludables](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
antes de proceder con el drenaje.

## Usa `kubectl drain` para eliminar un nodo del servicio

Puedes usar `kubectl drain` para desalojar de forma segura todos los pods de
un nodo antes de realizar las tareas de mantenimiento en dicho nodo (por ejemplo, la
actualización del kernel, mantenimiento del hardware, etc.). Los desalojos seguros permiten
que los contenedores de los pods [no terminen abruptamente](/es/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) y respeten el presupuesto de interrupción de pods que has especificado.

{{< note >}}
Por defecto `kubectl drain` ignora ciertos pods de sistema que no podrán ser eliminados; revisa
[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
para más detalles.
{{< /note >}}

Cuando `kubectl drain` devuelve un resultado exitoso, esto indica que todos
los pods (excepto los descritos en el párrafo anterior) han sido desalojados
de forma segura (respetando el periodo de terminación no abrupta y el
presupuesto de interrupción de pods que hayas definido). En este momento, 
es seguro apagar el nodo desconectando su máquina física o, si se ejecuta en
una plataforma en la nube, eliminando su máquina virtual.

{{< note >}}
Si cualquier pod nuevo tolera la anotación (taint) `node.kubernetes.io/unschedulable`, es posible que esos pods
se programen en el nodo que acabas de drenar. Evita tolerar esa anotación salvo para el caso de los DaemonSets.

Si tú o cualquier usuario de la API configura directamente el campo [`nodeName`](/docs/concepts/scheduling-eviction/assign-pod-node/#nodename) 
(evitando el {{< glossary_tooltip text="programador" term_id="kube-scheduler" >}}), dicho pod quedará
vinculado al nodo especificado y se ejecutará allí aunque hayas vaciado ese nodo y haya quedado marcado 
como no programable.
{{< /note >}}

En primer lugar, identifica el nombre del nodo que quieres drenar. Puedes ver la lista de todos los nodos de tu clúster con:

```shell
kubectl get nodes
```

A continuación, dile a Kubernetes que drene el nodo:

```shell
kubectl drain --ignore-daemonsets <nombre del nodo>
```

Si hay pods gestionados por un DaemonSet, necesitarás especificar 
`--ignore-daemonsets` con `kubectl` para poder drenar el nodo de forma exitosa. El subcomando `kubectl drain` en sí mismo no drena
los pods del DaemonSet de un nodo:
el controlador de DaemonSets (plano de control) inmediatamente reemplaza los pods que faltan por
nuevos pods equivalentes. El controlador de DaemonSets también crea pods que toleran las anotaciones no programables
(`node.kubernetes.io/unschedulable`), lo que permite que los nuevos pods se inicien en el nodo que estás drenando.

Una vez que devuelva un resultado (sin dar ningún error), puedes apagar el nodo
(o, si se trata de una plataforma en la nube, eliminar la máquina virtual que aloja el nodo).

Posteriormente, cuando el nodo vuelva a estar operativo después de las tareas de mantenimiento, necesitas ejecutar:

```shell
kubectl uncordon <nombre del nodo>
```

para indicarle a Kubernetes que puede reanudar la programación de nuevos pods en el nodo.

## Drenando múltiples nodos en paralelo

El comando `kubectl drain` solo debe ejecutarse en un único nodo a la
vez. Sin embargo, puedes ejecutar múltiples comandos `kubectl drain` para
diferentes nodos en paralelo, en diferentes terminales o en
segundo plano. Aunque se ejecuten varios comandos de drenaje al mismo tiempo,
seguirán respetando el presupuesto de interrupción de pods que especifiques.

Por ejemplo, si tienes un StatefulSet con tres réplicas y un presupuesto de interrupción 
de `minAvailable: 2` para él, `kubectl drain` solo desalojará un pod del StatefulSet si
las tres réplicas están [saludables](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod);
si ejecutas varios comandos de drenaje en paralelo, Kubernetes respetará el
presupuesto de interrupción de pods y asegurará que solo 1 pod (calculado como `replicas - minAvailable`)
esté no disponible en cualquier momento. Cualquier drenaje que pudiera causar que el número de
réplicas [saludables](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod) caiga debajo
del presupuesto especificado, sería bloqueado.

## La API de desalojos

Si prefieres no usar [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain) (por ejemplo,
para evitar llamar a un comando externo o para tener un control más preciso sobre el proceso de desalojo de
pods), puedes provocar los desalojos de manera programática usando la API de desalojos.

Para más información, consulta [desalojo iniciado por API](/docs/concepts/scheduling-eviction/api-eviction/).

## {{% heading "whatsnext" %}}

* Sigue estos pasos para proteger tu aplicación [configurando un presupuesto de interrupción de pods](/es/docs/tasks/run-application/configure-pdb/).

