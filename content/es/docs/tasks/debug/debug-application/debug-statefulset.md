---
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Depurar un StatefulSet
content_type: task
weight: 30
---

<!-- overview -->
Esta tarea muestra cómo depurar un StatefulSet.

## {{% heading "prerequisites" %}}

* Necesitas un clúster de Kubernetes, y la herramienta de línea de comandos kubectl debe estar configurada para comunicarse con tu clúster.
* Deberías tener un StatefulSet en ejecución que quieras investigar.

<!-- steps -->

## Depurar un StatefulSet

Con el fin de listar todos los Pods que pertenecen a un StatefulSet, que tienen una etiqueta `app.kubernetes.io/name=MyApp` configurada,
puedes utilizar lo siguiente:

```shell
kubectl get pods -l app.kubernetes.io/name=MyApp
```

Si encuentras que cualquiera de los Pods listados está en un estado `Unknown` o `Terminating` por un período de tiempo prolongado,
consulta la tarea [Eliminar Pods de un StatefulSet](/docs/tasks/run-application/delete-stateful-set/) para
instrucciones sobre cómo tratarlos.
Puedes depurar Pods individuales en un StatefulSet utilizando la guía
[Depurar Pods](/docs/tasks/debug/debug-application/debug-pods/).

## {{% heading "whatsnext" %}}

Aprende más sobre [Depurar un Init Container](/docs/tasks/debug/debug-application/debug-init-containers/).

