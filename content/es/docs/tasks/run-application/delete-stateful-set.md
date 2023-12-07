---
title: Borrar un StatefulSet
content_type: task
weight: 60
---

<!-- overview -->

Esta página muestra como se debe eliminar un {{< glossary_tooltip term_id="StatefulSet" >}}.

## {{% heading "prerequisites" %}}

- Se asume que se tiene una aplicación del tipo StatefulSet corriendo en su clúster.

<!-- steps -->

## Borrando un StatefulSet

Se puede eliminar un StatefulSet de la misma manera que se eliminan otros recursos en Kubernetes:
Use el comando `kubectl delete` y especifique el StatefulSet, usando su nombre o el archivo con el que fue creado.

```shell
kubectl delete -f <archivo.yaml>
```

```shell
kubectl delete statefulsets <nombre-del-stateful-set>
```

Puede suceder que necesite eliminar los servicios headless asociados después de eliminar el StatefulSet.

```shell
kubectl delete service <nombre-del-servicio>
```

Cuando se elimina un StatefulSet utilizando `kubectl`, el StatefulSet escala a 0.
Todos los Pods que eran parte de esta carga de trabajo son eliminados. Si usted quiere eliminar
solo el StatefulSet y no los Pods utilice `--cascade=orphan`. Por ejemplo:

```shell
kubectl delete -f <archivo.yaml> --cascade=orphan
```

Agregando `--cascade=orphan` al comando `kubectl delete`, los Pods administrados por el StatefulSet
dejan de pertenecer al StatefulSet cuando es eliminado. Si los pods tienen una
etiqueta `app.kubernetes.io/name=MyApp` se los puede eliminar de la siguiente manera:

```shell
kubectl delete pods -l app.kubernetes.io/name=MyApp
```

### Volúmenes Persistentes

Eliminar los Pods de un StatefulSet no va a eliminar los volúmenes asociados.
Esto es para asegurar que se tiene una oportunidad de copiar los datos fuera del volumen
antes de eliminarlo. Borrar el PVC después de que los pods estén terminados puede disparar
la eliminación del Volumen Persistente que hay detrás dependiendo de la clase de almacenamiento
y la política de reclamo. #TODO You should never assume ability to access a volume
after claim deletion.

{{< note >}}
Tenga cuidado al borrar un PVC ya que puede llevar una pérdida de datos.
{{< /note >}}

### Eliminación completa de un StatefulSet

Para eliminar todo en un StatefulSet, incluyendo los pods asociados,
se puede correr una serie de comandos similares a los siguientes:

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app.kubernetes.io/name=MyApp
sleep $grace
kubectl delete pvc -l app.kubernetes.io/name=MyApp

```

En este ejemplo, los Pods tienen la etiqueta  `app.kubernetes.io/name=MyApp`,
sustituya la misma por su propia etiqueta.

### Forzar la eliminación de los Pods de un StatefulSet

Si encuentra algún pod bloqueado en su StatefulSet en el estado 'Terminating'
o 'Unknow' por un largo período de tiempo, puede ser que necesite intervenir
manualmente para forzar la eliminación del pod del apiserver.
Esta es una tarea potencialmente riesgosa. Visite [Forzar eliminación de Pods en StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/)
para más detalles.

## {{% heading "whatsnext" %}}

Aprenda más sobre [Forzar eliminación de Pods en StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
