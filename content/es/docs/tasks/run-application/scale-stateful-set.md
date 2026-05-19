---
title: Escalar un StatefulSet
content_type: task
weight: 50
---

<!-- overview -->


Esta página muestra cómo escalar un StatefulSet. Escalar un StatefulSet es
incrementar o decrementar el número de réplicas.

## {{% heading "prerequisites" %}}

- Los StatefulSets están solamente disponibles en Kubernetes 1.5 o posterior.
 Para verificar su versión de Kubernetes puede ejecutar `kubectl version`.

- No todas las aplicaciones que manejan estados escalan correctamente. Si no está seguro sobre si
 puede escalar sus StatefulSets, visite los [conceptos de StatefulSet](/docs/es/concepts/workloads/controllers/statefulset/)
 o el [tutorial sobre StatefulSet](/docs/tutorials/stateful-application/basic-stateful-set/) para más información.

- Solamente se debe realizar un escalamiento cuando esté lo suficientemente seguro del buen funcionamiento
 de su clúster y de las aplicaciones que manejan estados.
<!-- steps -->


## Escalando StatefulSets

### Uso de kubectl para escalar StatefulSets

Como primer paso, identifica el StatefulSet que deseas escalar.

```shell
kubectl get statefulsets <nombre-del-stateful-set>
```

Cambia el número de réplicas de tu StatefulSet:

```shell
kubectl scale statefulsets <nombre-del-stateful-set> --replicas=<número-de-réplicas>
```

### Hacer actualizaciones "in-place" en los StatefulSets

De manera alternativa, se pueden hacer [actualizaciones in-place](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources)
en tus StatefulSets.

Si el StatefulSet fue inicialmente creado con `kubectl apply`,
puedes actualizar `.spec.replicas` en el manifiesto previamente definido y ahí hacer `kubectl apply`:

```shell
kubectl apply -f <archivo-stateful-set-actualizado>
```

De otra manera, edita esa línea con `kubectl edit`:

```shell
kubectl edit statefulsets <nombre-del-stateful-set>
```

También puedes usar `kubectl patch`:

```shell
kubectl patch statefulsets <nombre-del-stateful-set> -p '{"spec":{"replicas":<número-de-réplicas>}}'
```

## Solución de Problemas

### El escalamiento hacia abajo no funciona correctamente

No se puede escalar hacia abajo un StatefulSet cuando alguno de los Pods que administra está
dañado. Desescalar solo tiene lugar después de tener los Pods disponibles.

Si spec.replicas > 1, Kubernetes no puede determinar la razón de un Pod dañado.
Esto puede ser el resultado de una falla permanente o una falla transitoria. Una falla
transitoria puede ser causada por un reinicio necesario para una actualización o mantenimiento.

Si el Pod está dañado con una falla permanente, escalar
sin corregir la falla puede llevarnos a un estado donde el StatefulSet cae en
una cantidad de miembros inferior a la cantidad de replicas que son necesarias para funcionar
correctamente. Esto puede causar que el StatefulSet no este disponible.

Si el Pod está dañado por una falla transitoria y el Pod puede volver a estar disponible nuevamente,
el error transitorio puede interferir con la operación de escalar. Algunas bases de datos
distribuidas tienen errores cuando los nodos se unen y abandonan en el mismo momento. Es mejor
analizar acerca de escalar la operación a nivel de la aplicación y realizar
el escalamiento solamente cuando está seguro que el clúster de la aplicación está
funcionando y en buen estado.

## {{% heading "whatsnext" %}}

- Aprenda más acerca de [borrar un StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
