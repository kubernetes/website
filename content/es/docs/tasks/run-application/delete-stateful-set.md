---
title: Borrar un StatefulSet
content_type: task
weight: 60
---
 
<!-- overview -->

Esta página muestra cómo se debe eliminar un {{< glossary_tooltip term_id="StatefulSet" >}}.

## {{% heading "prerequisites" %}}

- Se asume que se tiene una aplicación del tipo StatefulSet corriendo en tu clúster.

<!-- steps -->

## Borrando un StatefulSet

Se puede eliminar un StatefulSet de la misma manera que se eliminan el resto de los recursos en Kubernetes:
Usa el comando `kubectl delete` y especifica el StatefulSet, usando su nombre o el archivo con el que fue creado.

```shell
kubectl delete -f <archivo.yaml>
```

```shell
kubectl delete statefulsets <nombre-del-stateful-set>
```

Puede suceder que necesites eliminar los servicios headless asociados después de eliminar el StatefulSet.

```shell
kubectl delete service <nombre-del-servicio>
```

Cuando se elimina un StatefulSet utilizando `kubectl`, el StatefulSet escala a 0.
Todos los Pods que eran parte de esta carga de trabajo son eliminados. Si tú quieres eliminar
solo el StatefulSet y no los Pods utiliza `--cascade=orphan`. Por ejemplo:

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
y la política de reclamo. Nunca debes asumir la capacidad de acceder a un volumen
después de la eliminación del claim.

{{< note >}}
Ten cuidado al borrar un PVC ya que puede llevar una pérdida de datos.
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
sustituye la misma por tu propia etiqueta.

### Forzar la eliminación de los Pods de un StatefulSet

Si encuentras algunos pods bloqueados en tu StatefulSet en el estado 'Terminating'
o 'Unknown' por un largo período de tiempo, puede ser que necesites intervenir
manualmente para forzar la eliminación de los pods del apiserver.
Ésta es una tarea potencialmente riesgosa. Visita [Forzar eliminación de Pods en StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/)
para más detalles.

## {{% heading "whatsnext" %}}

Aprende más sobre [Forzar eliminación de Pods en StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
