---
title: Controlador TTL para Recursos Finalizados
content_type: concept
weight: 65
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

El controlador TTL proporciona un mecanismo TTL para limitar el tiempo de vida de los objetos
de recurso que ya han terminado su ejecución. El controlador TTL sólo se ocupa de los
[Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) por el momento,
y puede que se extienda para gestionar otros recursos que terminen su ejecución,
como los Pods y los recursos personalizados.

Descargo de responsabilidad Alpha: esta característica está actualmente en versión alpha, y puede habilitarse mediante el
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`TTLAfterFinished`.







<!-- body -->

## Controlador TTL

El controlador TTL sólo soporta los Jobs por ahora. Un operador del clúster puede usar esta funcionalidad para limpiar
los Jobs terminados (bien `Complete` o `Failed`) automáticamente especificando el valor del campo
`.spec.ttlSecondsAfterFinished` del Job, como en este
[ejemplo](/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically).
El controlador TTL asumirá que un recurso es candidato a ser limpiado
TTL segundos después de que el recurso haya terminado; dicho de otra forma, cuando el TTL haya expirado.
Cuando el controlador TTL limpia un recursos, lo elimina en cascada, esto es, borra
sus objetos subordinados juntos. Nótese que cuando se elimina un recurso,
se respetan las garantías de su ciclo de vida, como con los finalizadores.

Los segundos TTL pueden ser configurados en cualquier momento. Aquí se muestran algunos ejemplos para poner valores al campo
`.spec.ttlSecondsAfterFinished` de un Job:

* Indicando este campo en el manifiesto de los recursos, de forma que se pueda limpiar un Job
  automáticamente un tiempo después de que haya finalizado.
* Haciendo que el campo de los recursos existentes, ya finalizados, adopte esta nueva característica.
* Usando un [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  para poner el valor de este campo dinámicamente en el momento de la creación del recursos. Los administradores del clúster pueden
  usar este enfoque para forzar una regla TTL para los recursos terminados.
* Usando un
  [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  para poner el valor de este campo dinámicamente después de que el recurso haya terminado,
  y eligiendo diferentes valores TTL basados en los estados de los recursos, etiquetas, etc.

## Advertencia

### Actualizar los segundos TTL

Cabe señalar que el período TTL , ej. campo `.spec.ttlSecondsAfterFinished` de los Jobs,
puede modificarse después de que el recurso haya sido creado o terminado. Sin embargo, una vez
que el Job se convierte en candidato para ser eliminado (cuando el TTL ha expirado), el sistema
no garantiza que se mantendrán los Jobs, incluso si una modificación para extender el TTL
devuelve una respuesta API satisfactoria.

### Diferencia horaria

Como el controlador TTL usa marcas de fecha/hora almacenadas en los recursos de Kubernetes
para determinar si el TTL ha expirado o no, esta funcionalidad es sensible a las
diferencias horarias del clúster, lo que puede provocar que el controlador TTL limpie recursos
en momentos equivocados.

En Kubernetes, se necesita ejecutar NTP en todos los nodos
(ver [#6159](https://github.com/kubernetes/kubernetes/issues/6159#issuecomment-93844058))
para evitar este problema. Los relojes no siempre son correctos, pero la diferencia debería ser muy pequeña.
Ten presente este riesgo cuando pongas un valor distinto de cero para el TTL.



## {{% heading "whatsnext" %}}


[Limpiar Jobs automáticamente](/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically)

[Documento de diseño](https://github.com/kubernetes/community/blob/master/keps/sig-apps/0026-ttl-after-finish.md)


