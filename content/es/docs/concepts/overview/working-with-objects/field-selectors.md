---
title: Selectores de Campo
weight: 60
---

Los _selectores de campo_ te permiten [seleccionar recursos de Kubernetes](/docs/concepts/overview/working-with-objects/kubernetes-objects) basados en el valor de uno o más campos del recurso. Aquí se presentan varios ejemplos de consultas de selectores de campo:

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

Este comando `kubectl` selecciona todos los Pods para los cuales el valor del campo [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) es igual a `Running`:

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
Los selectores de campo son esencialmente *filtros* de recursos. Por defecto, no se aplica ningún selector/filtro, lo que significa que todos los tipos de recursos son seleccionados. Esto hace que las siguientes consultas con `kubectl` sean equivalentes:

```shell
kubectl get pods
kubectl get pods --field-selector ""
```
{{< /note >}}

## Campos soportados

Los selectores de campos soportados varían según el tipo de recursos de Kubernetes. Todos los tipos de recursos permiten los campos `metadata.name` y `metadata.namespace`. El uso de un selector de campo no soportado provoca un error. Por ejemplo:

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

## Operadores soportados

Puedes usar los operadores `=`, `==`, y `!=` en los selectores de campo (`=` y `==` significan lo mismo). Este comando de `kubectl`, por ejemplo, selecciona todos los servicios de Kubernetes que no están en el espacio de nombres `default`:

```shell
kubectl get services --field-selector metadata.namespace!=default
```

## Selectores anidados

De la misma manera que con una [etiqueta](/docs/concepts/overview/working-with-objects/labels) y otros selectores, los selectores de campo pueden anidarse como una lista de elementos separados por coma. Este comando de `kubectl` selecciona todos los Pods para los que el campo `status.phase` no es igual a `Running` y el campo `spec.restartPolicy` es igual a `Always`:

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## Múltiples tipos de recursos

Puedes usar los selectores de campo entre múltiples tipos de recursos. Este comando de `kubectl` selecciona todos los Statefulsets y Services que no están en el espacio de nombres `default`:

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
