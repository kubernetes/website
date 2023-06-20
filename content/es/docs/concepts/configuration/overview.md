---
revisores:
- mikedanés
título: Prácticas recomendadas de configuración
content_type: concepto
peso: 10
---

<!-- resumen -->
Este documento destaca y consolida las mejores prácticas de configuración que se presentan
a lo largo de la guía del usuario, la documentación de introducción y los ejemplos.

Este es un documento vivo. Si se te ocurre algo que no está en esta lista pero que te puede ser útil
a otros, no dude en presentar un problema o enviar un PR.

<!-- cuerpo -->
## Consejos generales de configuración

- Al definir configuraciones, especifique la última versión estable de la API.

- Los archivos de configuración deben almacenarse en el control de versiones antes de enviarse al clúster. Este
   le permite revertir rápidamente un cambio de configuración si es necesario. También ayuda a agrupar
   recreación y restauración.

- Escriba sus archivos de configuración usando YAML en lugar de JSON. Aunque estos formatos se pueden utilizar
   indistintamente en casi todos los escenarios, YAML tiende a ser más fácil de usar.

- Agrupar objetos relacionados en un solo archivo siempre que tenga sentido. Un archivo suele ser más fácil de
   administrar que varios. Ver el
   [libro de visitas-todo-en-uno.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-todo-en-uno.yaml)
   archivo como un ejemplo de esta sintaxis.

- Tenga en cuenta también que muchos comandos `kubectl` se pueden llamar en un directorio. Por ejemplo, puede llamar
   `kubectl apply` en un directorio de archivos de configuración.

- No especifique valores predeterminados innecesariamente: una configuración simple y mínima hará que los errores sean menos probables.

- Poner descripciones de objetos en anotaciones, para permitir una mejor introspección.

## Pods "desnudos" versus conjuntos de réplicas, implementaciones y trabajos {#naked-pods-vs-replicasets-deployments-and-jobs}

- No use Pods desnudos (es decir, Pods no vinculados a un [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) o
   [Implementación](/docs/concepts/workloads/controllers/deployment/)) si puede evitarlo. Vainas desnudas
   no se reprogramará en caso de falla de un nodo.

   Una implementación, que crea un ReplicaSet para garantizar que se alcance la cantidad deseada de pods.
   siempre disponible y especifica una estrategia para reemplazar los Pods (como
   [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), es
   casi siempre preferible a crear Pods directamente, excepto por algunos explícitos
   [`restartPolicy: Never`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) escenarios.
   Un [Trabajo](/docs/concepts/workloads/controllers/job/) también puede ser apropiado.

## Servicios

- Crear un [Servicio](/docs/concepts/services-networking/service/) antes de su backend correspondiente
   cargas de trabajo (Implementaciones o ReplicaSets), y antes de cualquier carga de trabajo que necesite acceder a él.
   Cuando Kubernetes inicia un contenedor, proporciona variables de entorno que apuntan a todos los Servicios
   que se estaban ejecutando cuando se inició el contenedor. Por ejemplo, si existe un Servicio llamado `foo`,
   todos los contenedores obtendrán las siguientes variables en su entorno inicial:

   ```concha
   FOO_SERVICE_HOST=<el host en el que se ejecuta el Servicio>
   FOO_SERVICE_PORT=<el puerto en el que se ejecuta el Servicio>
   ```

   *Esto implica un requisito de pedido* - cualquier 'Servicio' al que un 'Pod' quiera acceder debe ser
   creado antes del `Pod` en sí mismo, de lo contrario, las variables de entorno no se completarán.
   DNS no tiene esta restricción.

- Un [complemento de clúster] opcional (aunque muy recomendable) (/docs/concepts/cluster-administration/addons/)
   es un servidor DNS. El servidor DNS observa la API de Kubernetes en busca de nuevos `Servicios` y crea un conjunto
   de registros DNS para cada uno. Si el DNS se ha habilitado en todo el clúster, todos los "Pods" deben estar
   Capaz de hacer la resolución de nombres de `Servicios` automáticamente.

- No especifique un `hostPort` para un Pod a menos que sea absolutamente necesario. Cuando vinculas un Pod a un
   `hostPort`, limita la cantidad de lugares en los que se puede programar el Pod, porque cada <`hostIP`,
   La combinación `hostPort`, `protocol`> debe ser única. Si no especifica el `hostIP` y
   `protocolo` explícitamente, Kubernetes usará `0.0.0.0` como el `hostIP` predeterminado y `TCP` como el
   `protocolo` por defecto.

   Si solo necesita acceder al puerto con fines de depuración, puede utilizar el
   [proxy del servidor ap](/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apserver-proxy-urls)
   o [`kubectl port-forward`](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

   Si necesita exponer explícitamente el puerto de un Pod en el nodo, considere usar un
   [NodePort](/docs/concepts/services-networking/service/#type-nodeport) Servicio antes de recurrir a
   `hostPort`.

- Evite usar `hostNetwork`, por las mismas razones que `hostPort`.

- Usar [Servicios sin cabeza](/docs/concepts/services-networking/service/#headless-services)
   (que tienen un `ClusterIP` de `Ninguno`) para el descubrimiento de servicios cuando no necesita `kube-proxy`
   balanceo de carga.

## Uso de etiquetas

- Definir y usar [etiquetas](/docs/concepts/overview/working-with-objects/labels/) que identifiquen
   __semántico a
