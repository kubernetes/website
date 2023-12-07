---
title: Deployment
feature:
  title: Despliegues y _rollback_ automáticos
  description: >
    Kubernetes despliega los cambios a tu aplicación o su configuración de forma progresiva mientras monitoriza la salud de la aplicación para asegurarse que no elimina todas tus instancias al mismo tiempo. Si algo sale mal, Kubernetes revertirá el cambio por ti. Aprovéchate del creciente ecosistema de soluciones de despliegue.

content_type: concept
weight: 30
---

<!-- overview -->

Un controlador de _Deployment_ proporciona actualizaciones declarativas para los [Pods](/docs/concepts/workloads/pods/pod/) y los
[ReplicaSets](/docs/concepts/workloads/controllers/replicaset/).

Cuando describes el _estado deseado_ en un objeto Deployment, el controlador del Deployment se encarga de cambiar el estado actual al estado deseado de forma controlada.
Puedes definir Deployments para crear nuevos ReplicaSets, o eliminar Deployments existentes y adoptar todos sus recursos con nuevos Deployments.

{{< note >}}
No deberías gestionar directamente los ReplicaSets que pertenecen a un Deployment.
Todos los casos de uso deberían cubrirse manipulando el objeto Deployment.
Considera la posibilidad de abrir un incidente en el repositorio principal de Kubernetes si tu caso de uso no está soportado por el motivo que sea.
{{< /note >}}




<!-- body -->

## Casos de uso

A continuación se presentan los casos de uso típicos de los Deployments:

* [Crear un Deployment para desplegar un ReplicaSet](#creating-a-deployment). El ReplicaSet crea los Pods en segundo plano. Comprueba el estado del despliegue para comprobar si es satisfactorio o no.
* [Declarar el nuevo estado de los Pods](#updating-a-deployment) actualizando el PodTemplateSpec del Deployment. Ello crea un nuevo ReplicaSet y el Deployment gestiona el cambio de los Pods del viejo ReplicaSet al nuevo de forma controlada. Cada nuevo ReplicaSet actualiza la revisión del Deployment.
* [Retroceder a una revisión anterior del Deployment](#rolling-back-a-deployment) si el estado actual de un Deployment no es estable. Cada retroceso actualiza la revisión del Deployment.
* [Escalar horizontalmente el Deployment para soportar más carga](#scaling-a-deployment).
* [Pausar el Deployment](#pausing-and-resuming-a-deployment) para aplicar múltiples arreglos a su PodTemplateSpec y, a continuación, reanúdalo para que comience un nuevo despliegue.
* [Usar el estado del Deployment](#deployment-status) como un indicador de que el despliegue se ha atascado.
* [Limpiar los viejos ReplicaSets](#clean-up-policy) que no necesites más.

## Crear un Deployment

El siguiente ejemplo de un Deployment crea un ReplicaSet para arrancar tres Pods con `nginx`:

{{% codenew file="controllers/nginx-deployment.yaml" %}}

En este ejemplo:

* Se crea un Deployment denominado `nginx-deployment`, indicado a través del campo `.metadata.name`.
* El Deployment crea tres Pods replicados, indicado a través del campo `replicas`.
* El campo `selector` define cómo el Deployment identifica los Pods que debe gestionar.
  En este caso, simplemente seleccionas una etiqueta que se define en la plantilla Pod (`app: nginx`).
  Sin embargo, es posible definir reglas de selección más sofisticadas,
  siempre que la plantilla Pod misma satisfaga la regla.

  {{< note >}}
  `matchLabels` es un mapa de entradas {clave,valor}. Una entrada simple {clave,valor} en el mapa `matchLabels`
  es equivalente a un elemento de `matchExpressions` cuyo campo sea la "clave", el operador sea "In",
  y la matriz de valores contenga únicamente un "valor". Todos los requisitos se concatenan con AND.
  {{< /note >}}

* El campo `template` contiene los siguientes sub-campos:
  * Los Pods se etiquetan como `app: nginx` usando el campo `labels`.
  * La especificación de la plantilla Pod, o el campo `.template.spec`, indica
  que los Pods ejecutan un contenedor, `nginx`, que utiliza la versión 1.7.9 de la imagen de `nginx` de
  [Docker Hub](https://hub.docker.com/).
  * Crea un contenedor y lo llamar `nginx` usando el campo `name`.
  * Ejecuta la imagen `nginx` en su versión `1.7.9`.
  * Abre el puerto `80` para que el contenedor pueda enviar y recibir tráfico.

Para crear este Deployment, ejecuta el siguiente comando:

```shell
kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
```

{{< note >}}
Debes indicar el parámetro `--record` para registrar el comando ejecutado en la anotación de recurso `kubernetes.io/change-cause`.
Esto es útil para futuras introspecciones, por ejemplo para comprobar qué comando se ha ejecutado en cada revisión del Deployment.
{{< /note >}}

A continuación, ejecuta el comando `kubectl get deployments`. La salida debe ser parecida a la siguiente:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE 
nginx-deployment   3/3     3            3           1s  
```

Cuando inspeccionas los Deployments de tu clúster, se muestran los siguientes campos:

* `NAME` enumera los nombre de los Deployments del clúster.
* `READY` muestra cuántas réplicas de la aplicación están disponibles para sus usuarios. Sigue el patrón número de réplicas `listas/deseadas`.
* `UP-TO-DATE` muestra el número de réplicas que se ha actualizado para alcanzar el estado deseado.
* `AVAILABLE` muestra cuántas réplicas de la aplicación están disponibles para los usuarios.
* `AGE` muestra la cantidad de tiempo que la aplicación lleva ejecutándose.

Nótese cómo los valores de cada campo corresponden a los valores de la especificación del Deployment:

* El número de réplicas deseadas es 3 de acuerdo con el campo `.spec.replicas`.
* El número de réplicas actuales es 0 de acuerdo con el campo `.status.replicas`.
* El número de réplicas actualizadas es 0 de acuerdo con el campo `.status.updatedReplicas`.
* El número de réplicas disponibles es 0 de acuerdo con el campo `.status.availableReplicas`.

Si deseamos obtener más información del Deployment utilice el parámetro '-o wide', ejecutando el comando 'kubectl get deployments -o wide'. La salida será parecida a la siguiente:

```shell
NAME               READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES         SELECTOR
nginx-deployment   3/3     3            3           10s   nginx        nginx:1.7.9   app=nginx
```

Ejecutando el comando anterior se muestran los siguientes campos adicionales:

* `CONTAINERS` muestra los nombres de los contenedores declarados en `.spec.template.spec.containers.[name]`.
* `IMAGES` muestra los nombres de las imágenes declaradas en `.spec.template.spec.containers.[image]`.
* 'SELECTOR' muestra el Label selector que se declaró en matchLabels o matchExpressions.


Para ver el estado del Deployment, ejecuta el comando `kubectl rollout status deployment.v1.apps/nginx-deployment`. Este comando devuelve el siguiente resultado:

```shell
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
deployment "nginx-deployment" successfully rolled out
```

Ejecuta de nuevo el comando `kubectl get deployments` unos segundos más tarde:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE 
nginx-deployment   3/3     3            3           18s  
```

Fíjate que el Deployment ha creado todas las tres réplicas, y que todas las réplicas están actualizadas (contienen
la última plantilla Pod) y están disponibles (el estado del Pod tiene el valor Ready al menos para el campo `.spec.minReadySeconds` del Deployment).

Para ver el ReplicaSet (`rs`) creado por el Deployment, ejecuta el comando `kubectl get rs`:

```
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-75675f5897   3         3         3       18s
```

Fíjate que el nombre del ReplicaSet siempre se formatea con el patrón `[DEPLOYMENT-NAME]-[RANDOM-STRING]`. La cadena aleatoria se
genera de forma aleatoria y usa el pod-template-hash como semilla.

Para ver las etiquetas generadas automáticamente en cada pod, ejecuta el comando `kubectl get pods --show-labels`. Se devuelve la siguiente salida:

```
NAME                                READY     STATUS    RESTARTS   AGE       LABELS
nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
```

El ReplicaSet creado garantiza que hay tres Pods de `nginx` ejecutándose en todo momento.

{{< note >}}
En un Deployment, debes especificar un selector apropiado y etiquetas de plantilla Pod (en este caso,
`app: nginx`). No entremezcles etiquetas o selectores con otros controladores (incluyendo otros Deployments y StatefulSets).
Kubernetes no te impide que lo hagas, pero en el caso de que múltiples controladores tengan selectores mezclados, dichos controladores pueden entrar en conflicto y provocar resultados inesperados.
{{< /note >}}

### Etiqueta pod-template-hash

{{< note >}}
No cambies esta etiqueta.
{{< /note >}}

La etiqueta `pod-template-hash` es añadida por el controlador del Deployment a cada ReplicaSet que el Deployment crea o adopta.

Esta etiqueta garantiza que todos los hijos ReplicaSets de un Deployment no se entremezclan. Se genera mediante una función hash aplicada al `PodTemplate` del ReplicaSet
y usando el resultado de la función hash como el valor de la etiqueta que se añade al selector del ReplicaSet, en las etiquetas de la plantilla Pod,
y en cualquier Pod existente que el ReplicaSet tenga.

## Actualizar un Deployment

{{< note >}}
El lanzamiento de un Deployment se activa si y sólo si la plantilla Pod del Deployment (esto es, `.spec.template`)
se cambia, por ejemplo si se actualiza las etiquetas o las imágenes de contenedor de la plantilla.
Otras actualizaciones, como el escalado del Deployment, no conllevan un lanzamiento de despliegue.
{{< /note >}}

Asumiendo que ahora quieres actualizar los Pods nginx para que usen la imagen `nginx:1.9.1`
en vez de la imagen `nginx:1.7.9`.

```shell
kubectl --record deployment.apps/nginx-deployment set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1
```
```
image updated
```

De forma alternativa, puedes `editar` el Deployment y cambiar el valor del campo `.spec.template.spec.containers[0].image` de `nginx:1.7.9` a `nginx:1.9.1`:

```shell
kubectl edit deployment.v1.apps/nginx-deployment
```
```
deployment.apps/nginx-deployment edited
```

Para ver el estado del despliegue, ejecuta:

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```
```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
deployment "nginx-deployment" successfully rolled out
```

Cuando el despliegue funciona, puede que quieras `obtener` el Deployment:

```shell
kubectl get deployments
```
```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE 
nginx-deployment   3/3     3            3           36s 
```

El número de réplicas actualizadas indica que el Deployment ha actualizado las réplicas según la última configuración.
Las réplicas actuales indican el total de réplicas que gestiona este Deployment, y las réplicas disponibles indican
el número de réplicas actuales que están disponibles.

Puedes ejecutar el comando `kubectl get rs` para ver que el Deployment actualizó los Pods creando un nuevo ReplicaSet y escalándolo
hasta las 3 réplicas, así como escalando el viejo ReplicaSet a 0 réplicas.

```shell
kubectl get rs
```
```
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-1564180365   3         3         3       6s
nginx-deployment-2035384211   0         0         0       36s
```

Si ejecutas el comando `get pods` deberías ver los nuevos Pods:

```shell
kubectl get pods
```
```
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1564180365-khku8   1/1       Running   0          14s
nginx-deployment-1564180365-nacti   1/1       Running   0          14s
nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
```

La próxima vez que quieras actualizar estos Pods, sólo necesitas actualizar la plantilla Pod del Deployment otra vez.

El Deployment permite garantizar que sólo un número determinado de Pods puede eliminarse mientras se están actualizando.
Por defecto, garantiza que al menos el 25% menos del número deseado de Pods se está ejecutando (máx. 25% no disponible).

El Deployment también permite garantizar que sólo un número determinado de Pods puede crearse por encima del número deseado de
Pods. Por defecto, garantiza que al menos el 25% más del número deseado de Pods se está ejecutando (máx. 25% de aumento).

Por ejemplo, si miras detenidamente el Deployment de arriba, verás que primero creó un Pod,
luego eliminó algunos viejos Pods y creó otros nuevos. No elimina los viejos Pods hasta que un número suficiente de
nuevos Pods han arrancado, y no crea nuevos Pods hasta que un número suficiente de viejos Pods se han eliminado.
De esta forma, asegura que el número de Pods disponibles siempre es al menos 2, y el número de Pods totales es cómo máximo 4.

```shell
kubectl describe deployments
```
```
Name:                   nginx-deployment
Namespace:              default
CreationTimestamp:      Thu, 30 Nov 2017 10:56:25 +0000
Labels:                 app=nginx
Annotations:            deployment.kubernetes.io/revision=2
Selector:               app=nginx
Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:        nginx:1.9.1
    Port:         80/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   nginx-deployment-1564180365 (3/3 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  2m    deployment-controller  Scaled up replica set nginx-deployment-2035384211 to 3
  Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 1
  Normal  ScalingReplicaSet  22s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 2
  Normal  ScalingReplicaSet  22s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 2
  Normal  ScalingReplicaSet  19s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 1
  Normal  ScalingReplicaSet  19s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 3
  Normal  ScalingReplicaSet  14s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 0
```

Aquí puedes ver que cuando creaste por primera vez el Deployment, este creó un ReplicaSet (nginx-deployment-2035384211)
y lo escaló a 3 réplicas directamente. Cuando actualizaste el Deployment, creó un nuevo ReplicaSet
(nginx-deployment-1564180365) y lo escaló a 1 y entonces escaló el viejo ReplicaSet a 2, de forma que al menos
hubiera 2 Pods disponibles y como mucho 4 Pods en total en todo momento. Entonces, continuó escalando
el nuevo y el viejo ReplicaSet con la misma estrategia de actualización continua. Finalmente, el nuevo ReplicaSet acaba con 3 réplicas
disponibles, y el viejo ReplicaSet se escala a 0.

### Sobrescritura (o sea, múltiples actualizaciones a la vez)

Cada vez que el controlador del Deployment observa un nuevo objeto de despliegue, se crea un ReplicaSet para arrancar
los Pods deseados si es que no existe otro ReplicaSet haciéndolo. Los ReplicaSet existentes que controlan los Pods cuyas etiquetas
coinciden con el valor del campo `.spec.selector`, pero cuya plantilla no coincide con el valor del campo `.spec.template` se reducen. Al final,
el nuevo ReplicaSet se escala hasta el valor del campo `.spec.replicas` y todos los viejos ReplicaSets se escalan a 0.

Si actualizas un Deployment mientras otro despliegue está en curso, el Deployment creará un nuevo ReplicaSet
como consecuencia de la actualización y comenzará a escalarlo, y sobrescribirá al ReplicaSet que estaba escalando anteriormente
 -- lo añadirá a su lista de viejos ReplicaSets y comenzará a reducirlos.

Por ejemplo, supongamos que creamos un Deployment para crear 5 réplicas de `nginx:1.7.9`,
pero entonces actualizamos el Deployment para crear 5 réplicas de `nginx:1.9.1` cuando sólo se ha creado 3
réplicas de `nginx:1.7.9`. En este caso, el Deployment comenzará automáticamente a matar los 3 Pods de `nginx:1.7.9`
que había creado, y empezará a crear los Pods de `nginx:1.9.1`. Es decir, no esperará a que se creen las 5 réplicas de `nginx:1.7.9`
antes de aplicar la nueva configuración.

### Actualizaciones del selector de etiquetas

No se recomienda hacer cambios al selector del etiquetas y, por ello, se aconseja encarecidamente planificar el valor de dichos selectores por adelantado.
En cualquier caso, si necesitas cambiar un selector de etiquetas, hazlo con mucho cuidado y asegúrate que entiendes todas sus implicaciones.

{{< note >}}
En la versión `apps/v1` de la API, el selector de etiquetas del Deployment es inmutable una vez se ha creado.
{{< /note >}}

* Las adiciones posteriores al selector obligan también a actualizar las etiquetas de la plantilla Pod en la especificación del Deployment con los nuevos valores,
ya que de lo contrario se devolvería un error. Este cambio no es de superposición, es decir, que el nuevo selector
no selecciona los ReplicaSets y Pods creados con el viejo selector, lo que provoca que todos los viejos ReplicaSets se marquen como huérfanos y
la creación de un nuevo ReplicaSet.
* Las actualizaciones de selector -- esto es, cambiar el valor actual en una clave de selector -- provocan el mismo comportamiento que las adiciones.
* Las eliminaciones de selector -- esto es, eliminar una clave actual del selector del Deployment -- no necesitan de cambios en las etiquetas de la plantilla Pod.
No se marca ningún ReplicaSet existente como huérfano, y no se crea ningún ReplicaSet nuevo, pero debe tenerse en cuenta que
la etiqueta eliminada todavía existe en los Pods y ReplicaSets que se están ejecutando.

## Revertir un Deployment

En ocasiones necesitas revertir un Deployment; por ejemplo, cuando el Deployment no es estable, como cuando no para de reiniciarse.
Por defecto, toda la historia de despliegue del Deployment se mantiene en el sistema de forma que puedes revertir en cualquier momento
(se puede modificar este comportamiento cambiando el límite de la historia de revisiones de modificaciones).

{{< note >}}
Cuando se lanza el despligue de un Deployment, se crea una nueva revisión. Esto quiere decir que
la nueva revisión se crea si y sólo si la plantilla Pod del Deployment (`.spec.template`) se cambia;
por ejemplo, si cambias las etiquetas o la imagen del contenedor de la plantilla.
Otras actualizaciones, como escalar el Deployment,
no generan una nueva revisión del Deployment, para poder facilitar el escalado manual simultáneo - o auto-escalado.
Esto significa que cuando reviertes a una versión anterior, sólo la parte de la plantilla Pod del Deployment se revierte.
{{< /note >}}

Vamos a suponer que hemos cometido un error al actualizar el Deployment, poniendo como nombre de imagen `nginx:1.91` en vez de `nginx:1.9.1`:

```shell
kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91 --record=true
```
```
deployment.apps/nginx-deployment image updated
```

El despliegue se atasca y no progresa.

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```
```
Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
```

Presiona Ctrl-C para detener la monitorización del despliegue de arriba. Para obtener más información sobre despliegues atascados,
[lee más aquí](#deployment-status).

Verás que el número de réplicas viejas (nginx-deployment-1564180365 y nginx-deployment-2035384211) es 2, y el número de nuevas réplicas (nginx-deployment-3066724191) es 1.

```shell
kubectl get rs
```
```
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-1564180365   3         3         3       25s
nginx-deployment-2035384211   0         0         0       36s
nginx-deployment-3066724191   1         1         0       6s
```

Echando un vistazo a los Pods creados, verás que uno de los Pods creados por el nuevo ReplicaSet está atascado en un bucle intentando bajar la imagen:

```shell
kubectl get pods
```
```
NAME                                READY     STATUS             RESTARTS   AGE
nginx-deployment-1564180365-70iae   1/1       Running            0          25s
nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
```

{{< note >}}
El controlador del Deployment parará el despliegue erróneo de forma automática, y detendrá el escalado del nuevo
ReplicaSet. Esto depende de los parámetros del rollingUpdate (`maxUnavailable` específicamente) que hayas configurado.
Kubernetes por defecto establece el valor en el 25%.
{{< /note >}}

```shell
kubectl describe deployment
```
```
Name:           nginx-deployment
Namespace:      default
CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
Labels:         app=nginx
Selector:       app=nginx
Replicas:       3 desired | 1 updated | 4 total | 3 available | 1 unavailable
StrategyType:       RollingUpdate
MinReadySeconds:    0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:        nginx:1.91
    Port:         80/TCP
    Host Port:    0/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    ReplicaSetUpdated
OldReplicaSets:     nginx-deployment-1564180365 (3/3 replicas created)
NewReplicaSet:      nginx-deployment-3066724191 (1/1 replicas created)
Events:
  FirstSeen LastSeen    Count   From                    SubobjectPath   Type        Reason              Message
  --------- --------    -----   ----                    -------------   --------    ------              -------
  1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
  22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
  22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
  22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
  21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 1
  21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
  13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
  13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
```

Para arreglar este problema, necesitas volver a una revisión previa del Deployment que sea estable.

### Comprobar la Historia de Despliegues de un Deployment

Primero, comprobemos las revisiones de este despliegue:

```shell
kubectl rollout history deployment.v1.apps/nginx-deployment
```
```
deployments "nginx-deployment"
REVISION    CHANGE-CAUSE
1           kubectl apply --filename=https://k8s.io/examples/controllers/nginx-deployment.yaml --record=true
2           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
3           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91 --record=true
```
En el momento de la creación, el mensaje en `CHANGE-CAUSE` se copia de la anotación `kubernetes.io/change-cause` del Deployment a sus revisiones. Podrías indicar el mensaje `CHANGE-CAUSE`:

* Anotando el Deployment con el comando `kubectl annotate deployment.v1.apps/nginx-deployment kubernetes.io/change-cause="image updated to 1.9.1"`
* Añadiendo el parámetro `--record` para registrar el comando `kubectl` que está haciendo cambios en el recurso.
* Manualmente editando el manifiesto del recursos.

Para ver más detalles de cada revisión, ejecuta:

```shell
kubectl rollout history deployment.v1.apps/nginx-deployment --revision=2
```
```
deployments "nginx-deployment" revision 2
  Labels:       app=nginx
          pod-template-hash=1159050644
  Annotations:  kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
  Containers:
   nginx:
    Image:      nginx:1.9.1
    Port:       80/TCP
     QoS Tier:
        cpu:      BestEffort
        memory:   BestEffort
    Environment Variables:      <none>
  No volumes.
```

### Retroceder a una Revisión Previa

Ahora has decidido que quieres deshacer el despliegue actual y retrocederlo a la revisión previa:

```shell
kubectl rollout undo deployment.v1.apps/nginx-deployment
```
```
deployment.apps/nginx-deployment
```

Alternativamente, puedes retroceder a una revisión específica con el parámetro `--to-revision`:

```shell
kubectl rollout undo deployment.v1.apps/nginx-deployment --to-revision=2
```
```
deployment.apps/nginx-deployment
```

Para más detalles acerca de los comandos relacionados con las revisiones de un Deployment, echa un vistazo a [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout).

El Deployment se ha revertido ahora a una revisión previa estable. Como se puede comprobar, el controlador del Deployment genera un evento `DeploymentRollback`
al retroceder a la revisión 2.

```shell
kubectl get deployment nginx-deployment
```
```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE 
nginx-deployment   3/3     3            3           30m 
```

```shell
kubectl describe deployment nginx-deployment
```
```
Name:                   nginx-deployment
Namespace:              default
CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
Labels:                 app=nginx
Annotations:            deployment.kubernetes.io/revision=4
                        kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
Selector:               app=nginx
Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:        nginx:1.9.1
    Port:         80/TCP
    Host Port:    0/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   nginx-deployment-c4747d96c (3/3 replicas created)
Events:
  Type    Reason              Age   From                   Message
  ----    ------              ----  ----                   -------
  Normal  ScalingReplicaSet   12m   deployment-controller  Scaled up replica set nginx-deployment-75675f5897 to 3
  Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 1
  Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 2
  Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 2
  Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 1
  Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 3
  Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 0
  Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-595696685f to 1
  Normal  DeploymentRollback  15s   deployment-controller  Rolled back deployment "nginx-deployment" to revision 2
  Normal  ScalingReplicaSet   15s   deployment-controller  Scaled down replica set nginx-deployment-595696685f to 0
```

## Escalar un Deployment

Puedes escalar un Deployment usando el siguiente comando:

```shell
kubectl scale deployment.v1.apps/nginx-deployment --replicas=10
```
```
deployment.apps/nginx-deployment scaled
```

Asumiendo que se ha habilitado el [escalado horizontal de pod](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
en tu clúster, puedes configurar un auto-escalado para tu Deployment y elegir el mínimo y máximo número de Pods
que quieres ejecutar en base al uso de CPU de tus Pods actuales.

```shell
kubectl autoscale deployment.v1.apps/nginx-deployment --min=10 --max=15 --cpu-percent=80
```
```
deployment.apps/nginx-deployment scaled
```

### Escalado proporcional

La actualización continua de los Deployments permite la ejecución de múltiples versiones de una aplicación al mismo tiempo.
Cuando tú o un auto-escalado escala un Deployment con actualización continua que está en medio de otro despliegue (bien en curso o pausado),
entonces el controlador del Deployment balanceará las réplicas adicionales de los ReplicaSets activos (ReplicaSets con Pods)
para así poder mitigar el riesgo. Esto se conoce como *escalado proporcional*.

Por ejemplo, imagina que estás ejecutando un Deployment con 10 réplicas, donde [maxSurge](#max-surge)=3, y [maxUnavailable](#max-unavailable)=2.

```shell
kubectl get deploy
```
```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE 
nginx-deployment   10/10   10           10          50s 
```

Si actualizas a una nueva imagen que no puede descargarse desde el clúster:

```shell
kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:sometag
```
```
deployment.apps/nginx-deployment image updated
```

La actualización de la imagen arranca un nuevo despliegue con el ReplicaSet nginx-deployment-1989198191,
pero se bloquea debido al requisito `maxUnavailable` indicado arriba:

```shell
kubectl get rs
```
```
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   5         5         0         9s
nginx-deployment-618515232    8         8         8         1m
```

Y entonces se origina una nueva petición de escalado para el Deployment. El auto-escalado incrementa las réplicas del Deployment
a 15. El controlador del Deployment necesita ahora decidir dónde añadir esas nuevas 5 réplicas.
Si no estuvieras usando el escalado proporcional, las 5 se añadirían al nuevo ReplicaSet. Pero con el escalado proporcional,
las réplicas adicionales se distribuyen entre todos los ReplicaSets. Las partes más grandes van a los ReplicaSets
con el mayor número de réplicas y las partes más pequeñas van a los ReplicaSets con menos réplicas. Cualquier resto sobrante se añade
al ReplicaSet con mayor número de réplicas. Aquellos ReplicaSets con 0 réplicas no se escalan.

En nuestro ejemplo anterior, se añadirán 3 réplicas al viejo ReplicaSet y 2 réplicas al nuevo ReplicaSet.
EL proceso de despliegue debería al final mover todas las réplicas al nuevo ReplicaSet, siempre que las nuevas
réplicas arranquen positivamente.

```shell
kubectl get deploy
```
```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE 
nginx-deployment   18/15   7            8           7m 
```

```shell
kubectl get rs
```
```
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

## Pausar y Reanudar un Deployment

Puedes pausar un Deployment antes de arrancar una o más modificaciones y luego reanudarlo. Esto te permite aplicar múltiples arreglos
entre la pausa y la reanudación sin necesidad de arrancar despliegues innecesarios.

Por ejemplo, con un Deployment que acaba de crearse:

```shell
kubectl get deploy
```
```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE 
nginx-deployment   3/3     3            3           1m 
```
```shell
kubectl get rs
```
```
NAME               DESIRED   CURRENT   READY     AGE
nginx-2142116321   3         3         3         1m
```

Lo pausamos ejecutando el siguiente comando:

```shell
kubectl rollout pause deployment.v1.apps/nginx-deployment
```
```
deployment.apps/nginx-deployment paused
```

Y luego actualizamos la imagen del Deployment:

```shell
kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1
```
```
deployment.apps/nginx-deployment image updated
```

Nótese que no se arranca ningún despliegue nuevo:

```shell
kubectl rollout history deployment.v1.apps/nginx-deployment
```
```
deployments "nginx"
REVISION  CHANGE-CAUSE
1   <none>
```

```shell
kubectl get rs
```
```
NAME               DESIRED   CURRENT   READY     AGE
nginx-2142116321   3         3         3         2m
```

Puedes realizar tantas modificaciones como quieras, por ejemplo, para actualizar los recursos a utilizar:

```shell
kubectl set resources deployment.v1.apps/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
```
```
deployment.apps/nginx-deployment resource requirements updated
```

El estado inicial del Deployment anterior a la pausa continuará su función, pero las nuevas modificaciones
del Deployment no tendrán efecto ya que el Deployment está pausado.

Al final, reanuda el Deployment y observa cómo se genera un nuevo ReplicaSet con todos los cambios:

```shell
kubectl rollout resume deployment.v1.apps/nginx-deployment
```

```
deployment.apps/nginx-deployment resumed
```

```shell
kubectl get rs -w
```

```
NAME               DESIRED   CURRENT   READY     AGE
nginx-2142116321   2         2         2         2m
nginx-3926361531   2         2         0         6s
nginx-3926361531   2         2         1         18s
nginx-2142116321   1         2         2         2m
nginx-2142116321   1         2         2         2m
nginx-3926361531   3         2         1         18s
nginx-3926361531   3         2         1         18s
nginx-2142116321   1         1         1         2m
nginx-3926361531   3         3         1         18s
nginx-3926361531   3         3         2         19s
nginx-2142116321   0         1         1         2m
nginx-2142116321   0         1         1         2m
nginx-2142116321   0         0         0         2m
nginx-3926361531   3         3         3         20s

```
```shell
kubectl get rs
```
```
NAME               DESIRED   CURRENT   READY     AGE
nginx-2142116321   0         0         0         2m
nginx-3926361531   3         3         3         28s
```

{{< note >}}
No se puede revertir un Deployment pausado hasta que se vuelve a reanudar.
{{< /note >}}

## Estado del Deployment

Un Deployment pasa por varios estados a lo largo de su ciclo de vida. Así, puede estar [progresando](#progressing-deployment) mientras
se despliega un nuevo ReplicaSet, puede estar [completo](#complete-deployment), o puede quedar en estado [fallido](#failed-deployment).

### Progresar un Deployment

Kubernetes marca un Deployment como _progresando_ cuando se realiza cualquiera de las siguientes tareas:

* El Deployment crea un nuevo ReplicaSet.
* El Deployment está escalando su ReplicaSet más nuevo.
* El Deployment está reduciendo su(s) ReplicaSet(s) más antiguo(s).
* Hay nuevos Pods disponibles y listos (listo por lo menos [MinReadySeconds](#min-ready-seconds)).

Puedes monitorizar el progreso de un Deployment usando el comando `kubectl rollout status`.

### Completar un Deployment

Kubernetes marca un Deployment como _completado_ cuando presenta las siguientes características:

* Todas las réplicas asociadas con el Deployment han sido actualizadas a la última versión indicada, lo cual quiere decir
que todas las actualizaciones se han completado.
* Todas las réplicas asociadas con el Deployment están disponibles.
* No están ejecutándose viejas réplicas del Deployment.

Puedes comprobar si un Deployment se ha completado usando el comando `kubectl rollout status`. Si el despliegue se ha completado
de forma satisfactoria, el comando `kubectl rollout status` devuelve un código 0 de salida.

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```
```
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
$ echo $?
0
```

### Deployment fallido

Tu Deployment puede quedarse bloqueado intentando desplegar su nuevo ReplicaSet sin nunca completarse. Esto puede ocurrir
debido a algunos de los factores siguientes:

* Cuota insuficiente
* Fallos en la prueba de estar listo
* Errores en la descarga de imágenes
* Permisos insuficientes
* Rangos de límites de recursos
* Mala configuración del motor de ejecución de la aplicación

Una forma de detectar este tipo de situación es especificar un parámetro de vencimiento en la especificación de tu Deployment:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` denota el número
de segundos que el controlador del Deployment debe esperar antes de indicar (en el estado del Deployment) que el
Deployment no avanza.

El siguiente comando `kubectl` configura el campo `progressDeadlineSeconds` para forzar al controlador a
informar de la falta de avance de un Deployment después de 10 minutos:

```shell
kubectl patch deployment.v1.apps/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```
```
deployment.apps/nginx-deployment patched
```
Una vez que se ha excedido el vencimiento, el controlador del Deployment añade una DeploymentCondition
con los siguientes atributos al campo `.status.conditions` del Deployment:

* Type=Progressing
* Status=False
* Reason=ProgressDeadlineExceeded

Ver las [convenciones de la API de Kubernetes](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) para más información acerca de las condiciones de estado.

{{< note >}}
Kubernetes no emprenderá ninguna acción ante un Deployment parado que no sea la de reportar el estado mediante
`Reason=ProgressDeadlineExceeded`. Los orquestradores de alto nivel pueden aprovecharse y actuar consecuentemente, por ejemplo,
retrocediendo el Deployment a su versión previa.
{{< /note >}}

{{< note >}}
Si pausas un Deployment, Kubernetes no comprueba el avance en base al vencimiento indicado. Así, es posible pausar
de forma segura un Deployment en medio de un despliegue y reanudarlo sin que se arranque el estado de exceso de vencimiento.
{{< /note >}}

Puede que notes errores transitorios en tus Deployments, bien debido a un tiempo de vencimiento muy pequeño que hayas configurado
o bien a cualquier otro tipo de error que puede considerarse como transitorio. Por ejemplo,
supongamos que no tienes suficiente cuota. Si describes el Deployment, te darás cuenta de la sección siguiente:

```shell
kubectl describe deployment nginx-deployment
```
```
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

Si ejecutas el comando `kubectl get deployment nginx-deployment -o yaml`, el estado del Deployment puede parecerse a:

```
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

Al final, una vez que se supera el vencimiento del progreso del Deployment, Kubernetes actualiza el estado
y la razón de el estado de progreso:

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

Puedes solucionar un problema de cuota insuficiente simplemente reduciendo el número de réplicas de tu Deployment, reduciendo
otros controladores que puedas estar ejecutando, o incrementando la cuota en tu espacio de nombres. Si una vez satisfechas las condiciones de tu cuota,
el controlador del Deployment completa el despliegue, entonces verás que el estado del Deployment se actualiza al estado satisfactorio (`Status=True` y `Reason=NewReplicaSetAvailable`).

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`Type=Available` con `Status=True` significa que tu Deployment tiene disponibilidad mínima. La disponibilidad mínima se prescribe
mediante los parámetros indicados en la estrategia de despligue. `Type=Progressing` con `Status=True` significa que tu Deployment
está bien en medio de un despliegue y está progresando o bien que se ha completado de forma satisfactoria y el número mínimo
requerido de nuevas réplicas ya está disponible (ver la Razón del estado para cada caso particular - en nuestro caso
`Reason=NewReplicaSetAvailable` significa que el Deployment se ha completado).

Puedes comprobar si un Deployment ha fallado en su progreso usando el comando `kubectl rollout status`. `kubectl rollout status`
devuelve un código de salida distinto de 0 si el Deployment ha excedido su tiempo de vencimiento.

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```
```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
$ echo $?
1
```

### Actuar ante un despliegue fallido

Todas las acciones que aplican a un Deployment completado también aplican a un Deployment fallido. Puedes escalarlo/reducirlo, retrocederlo
a una revisión previa, o incluso pausarlo si necesitas realizar múltiples cambios a la plantilla Pod del Deployment.

## Regla de Limpieza

Puedes configurar el campo `.spec.revisionHistoryLimit` de un Deployment para especificar cuántos ReplicaSets viejos quieres conservar
para este Deployment. El resto será eliminado en segundo plano. Por defecto, es 10.

{{< note >}}
Poner este campo de forma explícita a 0 resulta en la limpieza de toda la historia de tu Deployment,
por lo que tu Deployment no podrá retroceder a revisiones previas.
{{< /note >}}

## Casos de Uso

### Despligue Canary

Si quieres desplegar nuevas versiones a un sub-conjunto de usuarios o servidores usando el Deployment,
puedes hacerlo creando múltiples Deployments, uno para cada versión nueva, siguiendo el patrón canary descrito en
[gestionar recursos](/docs/concepts/cluster-administration/manage-deployment/#canary-deployments).

## Escribir una especificación de Deployment

Al igual que con el resto de configuraciones de Kubernetes, un Deployment requiere los campos `apiVersion`, `kind`, y `metadata`.
Para información general acerca de cómo trabajar con ficheros de configuración, ver los documentos acerca de [desplegar aplicaciones](/docs/tutorials/stateless-application/run-stateless-application-deployment/),
configurar contenedores, y [usar kubectl para gestionar recursos](/docs/concepts/overview/object-management-kubectl/overview/).

Un Deployment también necesita una [sección `.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Plantilla Pod

Tanto `.spec.template` como `.spec.selector` sin campos obligatorios dentro de `.spec`.

El campo `.spec.template` es una [plantilla Pod](/docs/concepts/workloads/pods/pod-overview/#pod-templates). Tiene exactamente el mismo esquema que un [Pod](/docs/concepts/workloads/pods/pod/),
excepto por el hecho de que está anidado y no tiene `apiVersion` ni `kind`.

Junto con los campos obligatorios de un Pod, una plantilla Pod de un Deployment debe indicar las etiquetas
y las reglas de reinicio apropiadas. Para el caso de las etiquetas, asegúrate que no se entremezclan con otros controladores. Ver [selector](#selector)).

Únicamente se permite una [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) igual a `Always`,
que es el valor por defecto si no se indica.

### Réplicas

`.spec.replicas` es un campo opcional que indica el número de Pods deseados. Su valor por defecto es 1.

### Selector

`.spec.selector` es un campo opcional que indica un [selector de etiquetas](/docs/concepts/overview/working-with-objects/labels/)
para los Pods objetivo del deployment.

`.spec.selector` debe coincidir con `.spec.template.metadata.labels`, o será descartado por la API.

A partir de la versión `apps/v1` de la API, `.spec.selector` y `.metadata.labels` no toman como valor por defecto el valor de `.spec.template.metadata.labels` si no se indica.
Por ello, debe especificarse de forma explícita. Además hay que mencionar que `.spec.selector` es inmutable tras la creación del Deployment en `apps/v1`.

Un Deployment puede finalizar aquellos Pods cuyas etiquetas coincidan con el selector si su plantilla es diferente
de `.spec.template` o si el número total de dichos Pods excede `.spec.replicas`. Arranca nuevos
Pods con `.spec.template` si el número de Pods es menor que el número deseado.

{{< note >}}
No deberías crear otros Pods cuyas etiquetas coincidan con este selector, ni directamente creando
otro Deployment, ni creando otro controlador como un ReplicaSet o un ReplicationController. Si lo haces,
el primer Deployment pensará que también creó esos otros Pods. Kubernetes no te impide hacerlo.
{{< /note >}}

Si tienes múltiples controladores que entremezclan sus selectores, dichos controladores competirán entre ellos
y no se comportarán de forma correcta.

### Estrategia

`.spec.strategy` especifica la estrategia usada para remplazar los Pods viejos con los nuevos.
`.spec.strategy.type` puede tener el valor "Recreate" o "RollingUpdate". "RollingUpdate" el valor predeterminado.

#### Despliegue mediante recreación

Todos los Pods actuales se eliminan antes de que los nuevos se creen cuando `.spec.strategy.type==Recreate`.

#### Despliegue mediante actualización continua

El Deployment actualiza los Pods en modo de [actualización continua](/docs/tasks/run-application/rolling-update-replication-controller/)
cuando `.spec.strategy.type==RollingUpdate`. Puedes configurar los valores de `maxUnavailable` y `maxSurge`
para controlar el proceso de actualización continua.

##### Número máximo de pods no disponibles

`.spec.strategy.rollingUpdate.maxUnavailable` es un campo opcional que indica el número máximo
de Pods que pueden no estar disponibles durante el proceso de actualización. El valor puede ser un número absoluto (por ejemplo, 5)
o un porcentaje de los Pods deseados (por ejemplo, 10%). El número absoluto se calcula a partir del porcentaje
con redondeo a la baja. El valor no puede ser 0 si `.spec.strategy.rollingUpdate.maxSurge` es 0. El valor predeterminado es 25%.

Por ejemplo, cuando este valor es 30%, el ReplicaSet viejo puede escalarse al 70% de los
Pods deseados de forma inmediata tras comenzar el proceso de actualización. Una vez que los Pods están listos,
el ReplicaSet viejo puede reducirse aún mas, seguido de un escalado del nuevo ReplicaSet,
asegurándose que el número total de Pods disponibles en todo momento durante la actualización
es de al menos el 70% de los Pods deseados.

##### Número máximo de pods por encima del número deseado

`.spec.strategy.rollingUpdate.maxSurge` es un campo opcional que indica el número máximo de Pods
que puede crearse por encima del número deseado de Pods. El valor puede ser un número absoluto (por ejemplo, 5)
o un porcentaje de los Pods deseados (por ejemplo, 10%). El valor no puede ser 0 si `MaxUnavailable` es 0.
El número absoluto se calcula a partir del porcentaje con redondeo al alza. El valor predeterminado es 25%.

Por ejemplo, cuando este valor es 30%, el nuevo ReplicaSet puede escalarse inmediatamente cuando
comienza la actualización continua, de forma que el número total de Pods viejos y nuevos no
excede el 130% de los Pods deseados. Una vez que los viejos Pods se han eliminado, el nuevo ReplicaSet
puede seguir escalándose, asegurándose que el número total de Pods ejecutándose en todo momento
durante la actualización es como mucho del 130% de los Pods deseados.

### Segundos para vencimiento del progreso

`.spec.progressDeadlineSeconds` es un campo opcional que indica el número de segundos que quieres
esperar a que tu Deployment avance antes de que el sistema reporte que dicho Deployment
[ha fallado en su avance](#failed-deployment) - expresado como un estado con `Type=Progressing`, `Status=False`.
y `Reason=ProgressDeadlineExceeded` en el recurso. El controlador del Deployment seguirá intentando
el despliegue. En el futuro, una vez que se implemente el retroceso automático, el controlador del Deployment
retrocederá el despliegue en cuanto detecte ese estado.

Si se especifica, este campo debe ser mayor que `.spec.minReadySeconds`.

### Tiempo mínimo para considerar el Pod disponible

`.spec.minReadySeconds` es un campo opcional que indica el número mínimo de segundos en que
un Pod recién creado debería estar listo sin que falle ninguno de sus contenedores, para que se considere disponible.
Por defecto su valor es 0 (el Pod se considera disponible en el momento que está listo). Para aprender más acerca de
cuándo un Pod se considera que está listo, ver las [pruebas de contenedor](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

### Vuelta atrás

El campo `.spec.rollbackTo` se ha quitado de las versiones `extensions/v1beta1` y `apps/v1beta1` de la API, y ya no se permite en las versiones de la API a partir de `apps/v1beta2`.
En su caso, se debería usar `kubectl rollout undo`, tal y como se explicó en [Retroceder a una Revisión Previa](#rolling-back-to-a-previous-revision).

### Límite del histórico de revisiones

La historia de revisiones de un Deployment se almacena en los ReplicaSets que este controla.

`.spec.revisionHistoryLimit` es un campo opcional que indica el número de ReplicaSets viejos a retener
para permitir los retrocesos. Estos ReplicaSets viejos consumen recursos en `etcd` y rebosan la salida de `kubectl get rs`.
La configuración de cada revisión de Deployment se almacena en sus ReplicaSets;
por lo tanto, una vez que se elimina el ReplicaSet viejo, se pierde la posibilidad de retroceder a dicha revisión del Deployment.
Por defecto, se retienen hasta 10 ReplicaSets viejos; pero su valor ideal depende de la frecuencia y la estabilidad de los nuevos Deployments.

De forma más específica, si ponemos este campo a cero quiere decir que todos los ReplicaSets viejos con 0 réplicas se limpiarán.
En este caso, el nuevo despliegue del Deployment no se puede deshacer, ya que su historia de revisiones se habrá limpiado.

### Pausa

`.spec.paused` es un campo booleano opcional para pausar y reanudar un Deployment. La única diferencia entre
un Deployment pausado y otro que no lo está es que cualquier cambio al PodTemplateSpec del Deployment pausado
no generará nuevos despliegues mientras esté pausado. Un Deployment se pausa de forma predeterminada cuando se crea.

## Alternativa a los Deployments

### kubectl rolling update

[`kubectl rolling update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update) actualiza los Pods y los ReplicationControllers
de forma similar. Pero se recomienda el uso de Deployments porque se declaran del lado del servidor, y proporcionan características adicionales
como la posibilidad de retroceder a revisiones anteriores incluso después de haber terminado una actualización continua.
