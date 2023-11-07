---
revisores:
- bprashanth
- enisoc
- erictune
- zorro
- janetkuo
- kow3ns
- Clayton más inteligente
título: Escalar un StatefulSet
tipo de contenido: tarea
peso: 50
---

<!-- descripción general -->

Esta tarea muestra cómo escalar un StatefulSet. Escalar un StatefulSet se refiere a
aumentando o disminuyendo el número de réplicas.

## {{% encabezado "requisitos previos" %}}

- Los StatefulSets solo están disponibles en la versión 1.5 o posterior de Kubernetes.
  Para verificar su versión de Kubernetes, ejecute `kubectl version`.

- No todas las aplicaciones con estado escalan bien. Si no está seguro de si
  para escalar sus StatefulSets, consulte [conceptos de StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
  o [tutorial de StatefulSet](/docs/tutorials/stateful-application/basic-stateful-set/) para obtener más información.

- Debe realizar el escalado solo cuando esté seguro de que su aplicación con estado
  El clúster está completamente sano.

<!-- pasos -->

## Escalado de conjuntos con estado

### Utilice kubectl para escalar StatefulSets

Primero, busque el StatefulSet que desea escalar.

```cáscara
kubectl get statefulsets <stateful-set-name>
```

Cambie la cantidad de réplicas de su StatefulSet:

```cáscara
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

### Realice actualizaciones in situ en sus StatefulSets

Alternativamente, puedes hacer
[actualizaciones locales](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources)
en sus StatefulSets.

Si su StatefulSet se creó inicialmente con "kubectl apply",
actualice `.spec.replicas` de los manifiestos StatefulSet y luego haga una `kubectl apply`:

```cáscara
kubectl apply -f <stateful-set-file-updated>
```

De lo contrario, edite ese campo con `kubectl edit`:

```cáscara
kubectl edit statefulsets <stateful-set-name>
```

O use `kubectl patch`:

```cáscara
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```

## Solución de problemas

### Reducir la escala no funciona bien

No se puede reducir un StatefulSet cuando cualquiera de los Pods con estado que administra está
insalubre. La reducción solo se lleva a cabo después de que esos Pods con estado estén ejecutándose y listos.

Si spec.replicas > 1, Kubernetes no puede determinar el motivo de un Pod en mal estado.
Puede ser el resultado de una falla permanente o de una falla transitoria. Un transitorio
La falla puede deberse a un reinicio requerido por una actualización o mantenimiento.

Si el Pod no está en buen estado debido a una falla permanente, escalar
sin corregir la falla puede conducir a un estado en el que la membresía de StatefulSet
cae por debajo de un cierto número mínimo de réplicas que se necesitan para funcionar
correctamente. Esto puede hacer que su StatefulSet deje de estar disponible.

Si el Pod no está en buen estado debido a una falla transitoria y es posible que vuelva a estar disponible,
el error transitorio puede interferir con su operación de ampliación o reducción. Algunos distribuidos
Las bases de datos tienen problemas cuando los nodos se unen y salen al mismo tiempo. Es mejor
razonar sobre el escalamiento de las operaciones a nivel de aplicación en estos casos, y
realice el escalado solo cuando esté seguro de que su clúster de aplicaciones con estado está
completamente sano.

## {{% encabezado "qué sigue" %}}

- Obtenga más información sobre [eliminar un StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
