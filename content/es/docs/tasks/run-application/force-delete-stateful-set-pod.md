---
reviewers:
- ramrodo
title: Eliminación Forzosa de Pods de StatefulSet
content_type: task
weight: 70
---

<!-- overview -->
Esta página muestra cómo eliminar Pods que son parte de un
{{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}},
y explica las consideraciones a tener en cuenta al hacerlo.

## {{% heading "prerequisites" %}}

- Esta es una tarea bastante avanzada y tiene el potencial de violar algunas de las propiedades
  inherentes de StatefulSet.
- Antes de proceder, familiarízate con las consideraciones enumeradas a continuación.

<!-- steps -->

## Consideraciones de StatefulSet

En la operación normal de un StatefulSet, **nunca** hay necesidad de eliminar forzosamente un Pod de StatefulSet.
El [controlador de StatefulSet](/es/docs/concepts/workloads/controllers/statefulset/) es responsable de
crear, escalar y eliminar miembros del StatefulSet. Intenta asegurar que el número especificado
de Pods, desde el ordinal 0 hasta N-1, estén vivos y listos. StatefulSet asegura que, en cualquier momento,
exista como máximo un Pod con una identidad dada, corriendo en un clúster. Esto se refiere a la semántica de
*como máximo uno* proporcionada por un StatefulSet.

La eliminación manual forzada debe realizarse con precaución, ya que tiene el potencial de violar la
semántica de como máximo uno, inherente a StatefulSet. Los StatefulSets pueden usarse para ejecutar aplicaciones distribuidas y
agrupadas que necesitan una identidad de red estable y almacenamiento estable.
Estas aplicaciones a menudo tienen configuraciones que dependen de un conjunto de un número fijo de
miembros con identidades fijas. Tener múltiples miembros con la misma identidad puede ser desastroso
y puede llevar a pérdida de datos (por ejemplo, escenario de cerebro dividido en sistemas basados en quórum).

## Eliminar Pods

Puedes realizar una eliminación de Pod paulatina con el siguiente comando:

```shell
kubectl delete pods <pod>
```

Para que lo anterior conduzca a una terminación paulatina, el Pod no debe especificar un
`pod.Spec.TerminationGracePeriodSeconds` de 0. La práctica de establecer un
`pod.Spec.TerminationGracePeriodSeconds` de 0 segundos es insegura y se desaconseja rotundamente
para los Pods de StatefulSet. La eliminación paulatina es segura y garantizará que el Pod
se apague de [manera paulatina](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination), antes de que kubelet elimine el nombre en el apiserver.

Un Pod no se elimina automáticamente cuando un nodo no es accesible.
Los Pods que se ejecutan en un Nodo inaccesible entran en el estado 'Terminating' o 'Unknown' después de un
[tiempo de espera](es/docs/concepts/architecture/nodes/#Estados).
Los Pods también pueden entrar en estos estados cuando el usuario intenta la eliminación paulatina de un Pod
en un nodo inaccesible.
Las únicas formas en que un Pod en tal estado puede ser eliminado del apiserver son las siguientes:

- El objeto Node es eliminado (ya sea por ti, o por el [Controlador de Nodo](/es/docs/concepts/architecture/nodes/#controlador-de-nodos)).).
- Kubelet, en el nodo no responsivo, comienza a responder, mata el Pod y elimina la entrada del apiserver.
- Eliminación forzada del Pod por el usuario.
- 
La mejor práctica recomendada es usar el primer o segundo enfoque. Si un nodo está confirmado
como muerto (por ejemplo, desconectado permanentemente de la red, apagado, etc.), entonces elimina
el objeto Node. Si el nodo es afectado de una partición de red, entonces trata de resolver esto
o espera a que se resuelva. Cuando la partición se solucione, kubelet completará la eliminación
del Pod y liberará su nombre en el apiserver.

Normalmente, el sistema completa la eliminación una vez que el Pod ya no se está ejecutando en un nodo, o
el nodo es eliminado por un administrador. Puedes anular esto forzando la eliminación del Pod.

### Eliminación Forzosa

Las eliminaciones forzosas **no** esperan confirmación de kubelet de que el Pod ha sido terminado.
Independientemente de si una eliminación forzosa tiene éxito en matar un Pod, inmediatamente
liberará el nombre del apiserver. Esto permitiría que el controlador de StatefulSet cree un Pod de reemplazo
con esa misma identidad; esto puede llevar a la duplicación de un Pod que aún está en ejecución,
y si dicho Pod todavía puede comunicarse con los otros miembros del StatefulSet,
violará la semántica de como máximo uno que StatefulSet está diseñado para garantizar.

Cuando eliminas forzosamente un Pod de StatefulSet, estás afirmando que el Pod en cuestión nunca
volverá a hacer contacto con otros Pods en el StatefulSet y su nombre puede ser liberado de forma segura para que
se cree un reemplazo.


Si quieres eliminar un Pod de forma forzosa usando la versión de kubectl >= 1.5, haz lo siguiente:

```shell
kubectl delete pods <pod> --grace-period=0 --force
```

Si estás usando cualquier versión de kubectl <= 1.4, deberías omitir la opción `--force` y usar:

```shell
kubectl delete pods <pod> --grace-period=0
```

Si incluso después de estos comandos el pod está atascado en el estado `Unknown`, usa el siguiente comando para
eliminar el Pod del clúster:

```shell
kubectl patch pod <pod> -p '{"metadata":{"finalizers":null}}'
```

Siempre realiza la eliminación forzosa de Pods de StatefulSet con cuidado y con pleno conocimiento de los riesgos involucrados.

## {{% heading "whatsnext" %}}

Aprende más sobre [depurar un StatefulSet](/docs/tasks/debug/debug-application/debug-statefulset/).
