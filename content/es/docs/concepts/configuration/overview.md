---
title: Prácticas Recomendadas de Configuración
content_type: concept
weight: 10
---

<!-- overview -->
Este documento destaca y consolida las prácticas recomendadas de configuración que se presentan
a lo largo de la guía del usuario, la documentación de Introducción y los ejemplos.

Este es un documento vivo. Si se te ocurre algo que no está en esta lista pero que puede ser útil
a otros, no dudes en crear un _issue_ o enviar un PR.

<!-- body -->
## Consejos Generales de Configuración

- Al definir configuraciones, especifica la última versión estable de la API.

- Los archivos de configuración deben almacenarse en el control de versiones antes de enviarse al clúster. Este
  le permite revertir rápidamente un cambio de configuración si es necesario. También ayuda a
  la recreación y restauración del clúster.

- Escribe tus archivos de configuración usando YAML en lugar de JSON. Aunque estos formatos se pueden utilizarse
   indistintamente en casi todos los escenarios, YAML tiende a ser más amigable con el usuario.

- Agrupa los objetos relacionados en un solo archivo siempre que tenga sentido. Un archivo suele ser más fácil de
  administrar que varios. Ver el archivo
  [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml)
  como un ejemplo de esta sintaxis.

- Ten en cuenta también que se pueden llamar muchos comandos `kubectl` en un directorio. Por ejemplo, puedes llamar
   `kubectl apply` en un directorio de archivos de configuración.

- No especifiques valores predeterminados innecesariamente: una configuración simple y mínima hará que los errores sean menos probables.

- Coloca descripciones de objetos en anotaciones, para permitir una mejor introspección.

## "Naked" Pods vs ReplicaSets, Deployments y Jobs {#naked-pods-vs-replicasets-deployments-and-jobs}

- No usar "Naked" Pods (es decir, Pods no vinculados a un [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) o a un
  [Deployment](/docs/concepts/workloads/controllers/deployment/)) si puedes evitarlo. Los Naked Pods
  no se reprogramará en caso de falla de un nodo.

  Un Deployment, que crea un ReplicaSet para garantizar que se alcance la cantidad deseada de Pods está
  siempre disponible y especifica una estrategia para reemplazar los Pods (como
  [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), es
  casi siempre preferible a crear Pods directamente, excepto por algunos explícitos
  [`restartPolicy: Never`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) escenarios.
  Un [Job](/docs/concepts/workloads/controllers/job/) también puede ser apropiado.

## Servicios

- Crea un [Service](/docs/concepts/services-networking/service/) antes de tus cargas de trabajo de backend correspondientes
  (Deployments o ReplicaSets) y antes de cualquier carga de trabajo que necesite acceder a él.
  Cuando Kubernetes inicia un contenedor, proporciona variables de entorno que apuntan a todos los _Services_
  que se estaban ejecutando cuando se inició el contenedor. Por ejemplo, si existe un _Service_ llamado `foo`,
  todos los contenedores obtendrán las siguientes variables en su entorno inicial:

  ```shell
  FOO_SERVICE_HOST=<el host en el que se ejecuta el Service>
  FOO_SERVICE_PORT=<el puerto en el que se ejecuta el Service>
  ```

  \* Esto implica un requisito de ordenamiento - cualquier `Service` al que un `Pod` quiera acceder debe ser
  creado antes del `Pod` en sí mismo, de lo contrario, las variables de entorno no se completarán.
  El DNS no tiene esta restricción.

- Un [cluster add-on](/docs/concepts/cluster-administration/addons/) opcional (aunque muy recomendable)
  es un servidor DNS. El servidor DNS observa la API de Kubernetes en busca de nuevos `Servicios` y crea un conjunto
  de registros DNS para cada uno. Si el DNS se ha habilitado en todo el clúster, todos los `Pods` deben ser
  capaces de hacer la resolución de nombres de `Services` automáticamente.

- No especifiques un `hostPort` para un Pod a menos que sea absolutamente necesario. Cuando vinculas un Pod a un
   `hostPort`, limita la cantidad de lugares en los que se puede agendar el Pod, porque cada combinación <`hostIP`,
   `hostPort`, `protocol`> debe ser única. Si no especificas el `hostIP` y
   `protocol` explícitamente, Kubernetes usará `0.0.0.0` como el `hostIP` predeterminado y `TCP` como el
   `protocol` por defecto.

  Si solo necesitas acceder al puerto con fines de depuración, puedes utilizar el
  [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls)
  o [`kubectl port-forward`](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

  Si necesitas exponer explícitamente el puerto de un Pod en el nodo, considera usar un
  [NodePort](/docs/concepts/services-networking/service/#type-nodeport) Service antes de recurrir a
  `hostPort`.

- Evita usar `hostNetwork`, por las mismas razones que `hostPort`.

- Usa [headless Services](/docs/concepts/services-networking/service/#headless-services)
  (que tiene un `ClusterIP` de `None`) para el descubrimiento de servicios cuando no necesites
  balanceo de carga `kube-proxy`.

## Usando Labels

- Define y usa [labels](/docs/concepts/overview/working-with-objects/labels/) que identifiquen
  __atributos semánticos__ de tu aplicación o Deployment, como `{ app.kubernetes.io/name:
  MyApp, tier: frontend, phase: test, deployment: v3 }`. Puedes utilizar estas labels para seleccionar los
  Pods apropiados para otros recursos; por ejemplo, un Service que selecciona todo los
  Pods `tier: frontend`, o todos los componentes `phase: test` de `app.kubernetes.io/name: MyApp`.
  Revisa el [libro de visitas](https://github.com/kubernetes/examples/tree/master/guestbook/)
  para ver ejemplos de este enfoque.

  Un Service puede hacer que abarque múltiples Deployments omitiendo las labels específicas de la versión de su
  selector. Cuando necesites actualizar un servicio en ejecución sin downtime, usa un
  [Deployment](/docs/concepts/workloads/controllers/deployment/).

  Un estado deseado de un objeto se describe mediante una implementación, y si los cambios a esa especificación son
  _aplicados_, el controlador de implementación cambia el estado actual al estado deseado en un
  ritmo controlado.

- Use las [labels comunes de Kubernetes](/docs/concepts/overview/working-with-objects/common-labels/)
  para casos de uso común. Estas labels estandarizadas enriquecen los metadatos de una manera que permite que las herramientas,
  incluyendo `kubectl` y el [dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard),
  trabajen de forma interoperable.

- Puedes manipular las labels para la depuración. Debido a que los controladores de Kubernetes (como ReplicaSet) y
  los Services coinciden con los Pods usando labels de selector, se detendrá la eliminación de las labels relevantes de un Pod
  que sea considerado por un controlador o que un Service sirva tráfico. si quitas
  las labels de un Pod existente, su controlador creará un nuevo Pod para ocupar su lugar. Esto es un
  forma útil de depurar un Pod previamente "vivo" en un entorno de "cuarentena". Para eliminar interactivamente
  o agregar labels, usa [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label).

## Usando kubectl

- Usa `kubectl apply -f <directorio>`. Esto busca la configuración de Kubernetes en todos los `.yaml`,
   `.yml`, y `.json` en `<directorio>` y lo pasa a `apply`.

- Usa selectores de labels para las operaciones `get` y `delete` en lugar de nombres de objetos específicos. Ve las
  secciones en [selectores de labels](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
  y [usar labels de forma eficaz](/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively).

- Usa `kubectl create deployment` y `kubectl expose` para crear rápidamente un contenedor único
   Deployments y Services.
   Consulta [Usar un Service para Acceder a una Aplicación en un Clúster](/docs/tasks/access-application-cluster/service-access-application-cluster/)
   para un ejemplo.
