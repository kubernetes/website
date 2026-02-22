---
title: Contenedores de Inicialización
content_type: concept
weight: 40
---

<!-- overview -->
Esta página proporciona una descripción general de los contenedores de inicialización (init containers): contenedores especializados que se ejecutan
antes de los contenedores de aplicación en un {{< glossary_tooltip text="Pod" term_id="pod" >}}.
Los contenedores de inicialización pueden contener utilidades o scripts de instalación no presentes en una imagen de aplicación.

Tú puedes especificar contenedores de inicialización en la especificación del Pod junto con el arreglo de `containers`
(el cual describe los contenedores de aplicación).

<!-- body -->
## Entendiendo los contenedores de inicialización

Un {{< glossary_tooltip text="Pod" term_id="pod" >}} puede tener múltiples contenedores
ejecutando aplicaciones dentro de él, pero también puede tener uno o más contenedores de inicialización
que se ejecutan antes de que se inicien los contenedores de aplicación.

Los contenedores de inicialización son exactamente iguales a los contenedores regulares excepto por:

* Los contenedores de inicialización siempre se ejecutan hasta su finalización.
* Cada contenedor de inicialiación debe completarse correctamente antes de que comience el siguiente.

Si el contenedor de inicialización de un Pod falla, kubelet reinicia repetidamente ese contenedor de inicialización hasta que tenga éxito.
Sin embargo, si el Pod tiene una `restartPolicy` de `Never` y un contenedor de inicialización falla durante el inicio de ese Pod, Kubernetes trata al Pod en general como fallido.

Para especificar un contenedor de inicialización para un Pod, agrega el campo `initContainers` en
la [especificación del Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec),
como un arreglo de elementos `container` (similar al campo `containers` de aplicación y su contenido).
Consulta [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) en la
referencia de API para más detalles.

El estado de los contenedores de inicialización se devuelve en el campo `.status.initContainerStatuses`
como un arreglo de los estados del contenedor (similar al campo `.status.containerStatuses`).

### Diferencias con los contenedores regulares

Los contenedores de inicialización admiten todos los campos y características de los contenedores de aplicaciones,
incluidos los límites de recursos, los volúmenes y la configuración de seguridad. Sin embargo, las
solicitudes de recursos y los límites para un contenedor de inicialización se manejan de manera diferente,
como se documenta en [Recursos](#resources).

Además, los contenedores de inicialización no admiten `lifecycle`, `livenessProbe`, `readinessProbe` o
`startupProbe` porque deben de ejecutarse hasta su finalización antes de que el Pod pueda estar listo.

Si especificas varios contenedores de inicialización para un Pod, kubelet ejecuta cada contenedor
de inicialización secuencialmente. Cada contenedor de inicialización debe tener éxito antes de que se pueda ejecutar el siguiente.
Cuando todos los contenedores de inicialización se hayan ejecutado hasta su finalización, kubelet inicializa
los contenedores de aplicación para el Pod y los ejecuta como de costumbre.

### Usando contenedores de inicialización

Dado que los contenedores de inicialización tienen imágenes separadas de los contenedores de aplicaciones, estos
tienen algunas ventajas sobre el código relacionado de inicio:

* Los contenedores de inicialización pueden contener utilidades o código personalizado para la configuración que no están presentes en una
  imagen de aplicación. Por ejemplo, no hay necesidad de hacer una imagen `FROM` de otra imagen solo para usar una herramienta como
  `sed`, `awk`, `python` o `dig` durante la instalación.
* Los roles de constructor e implementador de imágenes de aplicación pueden funcionar de forma independiente sin
  la necesidad de construir conjuntamente una sola imagen de aplicación.
* Los contenedores de inicialización pueden ejecutarse con una vista diferente al sistema de archivos que los contenedores de aplicaciones en
  el mismo Pod. En consecuencia, se les puede dar acceso a
  {{<glossary_tooltip text = "Secrets" term_id = "secret">}} a los que los contenedores de aplicaciones no pueden acceder.
* Debido a que los contenedores de inicialización se ejecutan hasta su finalización antes de que se inicien los contenedores de aplicaciones, los contenedores de inicialización ofrecen
  un mecanismo para bloquear o retrasar el inicio del contenedor de aplicación hasta que se cumplan una serie de condiciones previas. Una vez
  que las condiciones previas se cumplen, todos los contenedores de aplicaciones de un Pod pueden iniciarse en paralelo.
* Los contenedores de inicialización pueden ejecutar de forma segura utilidades o código personalizado que de otro modo harían a una imagen de aplicación
  de contenedor menos segura. Si mantiene separadas herramientas innecesarias, puede limitar la superficie de ataque
  a la imagen del contenedor de aplicación.

### Ejemplos

A continuación, se muestran algunas ideas sobre cómo utilizar los contenedores de inicialización:

* Esperar a que se cree un {{< glossary_tooltip text="Service" term_id="service">}}
  usando una sola linea de comando de shell:

  ```shell
  for i in {1..100}; do sleep 1; if nslookup myservice; then exit 0; fi; done; exit 1
  ```

* Registrar este Pod con un servidor remoto desde la downward API con un comando como:

  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```

* Esperar algo de tiempo antes de iniciar el contenedor de aplicación con un comando como:

  ```shell
  sleep 60
  ```

* Clonar un repositorio de Git en un {{< glossary_tooltip text="Volume" term_id="volume" >}}

* Colocar valores en un archivo de configuración y ejecutar una herramienta de plantilla para generar
  dinámicamente un archivo de configuración para el contenedor de aplicación principal. Por ejemplo,
  colocar el valor `POD_IP` en una configuración y generar el archivo de configuración
  de la aplicación principal usando Jinja.

#### Contenedores de inicialización en uso

Este ejemplo define un simple Pod que tiene dos contenedores de inicialización.
El primero espera por `myservice` y el segundo espera por `mydb`. Una vez que ambos
contenedores de inicialización se completen, el Pod ejecuta el contenedor de aplicación desde su sección `spec`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app.kubernetes.io/name: MyApp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo ¡La aplicación se está ejecutando! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo esperando a myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo esperando a mydb; sleep 2; done"]
```

Puedes iniciar este Pod ejecutando:

```shell
kubectl apply -f myapp.yaml
```

El resultado es similar a esto:

```shell
pod/myapp-pod created
```

Y verificar su estado con:

```shell
kubectl get -f myapp.yaml
```

El resultado es similar a esto:

```shell
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

o para más detalles:

```shell
kubectl describe -f myapp.yaml
```

El resultado es similar a esto:

```shell
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app.kubernetes.io/name=MyApp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container with docker id 5ced34a04634; Security:[seccomp=unconfined]
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container with docker id 5ced34a04634
```

Para ver los logs de los contenedores de inicialización en este Pod ejecuta:

```shell
kubectl logs myapp-pod -c init-myservice # Inspecciona el primer contenedor de inicialización
kubectl logs myapp-pod -c init-mydb      # Inspecciona el segundo contenedor de inicialización
```

En este punto, estos contenedores de inicialización estarán esperando para descubrir los Servicios denominados
`mydb` y `myservice`.

Aquí hay una configuración que puedes usar para que aparezcan esos Servicios:

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

Para crear los servicios de `mydb` y `myservice`:

```shell
kubectl apply -f services.yaml
```

El resultado es similar a esto:

```shell
service/myservice created
service/mydb created
```

Luego verás que esos contenedores de inicialización se completan y que el Pod `myapp-pod`
pasa al estado `Running`:

```shell
kubectl get -f myapp.yaml
```

El resultado es similar a esto:

```shell
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

Este sencillo ejemplo debería servirte de inspiración para crear tus propios
contenedores de inicialización. [¿Qué es lo que sigue?](#what-s-next) contiene un enlace a un ejemplo más detallado.

## Comportamiento detallado

Durante el inicio del Pod, kubelet retrasa la ejecución de contenedores de inicialización hasta que la red
y el almacenamiento estén listos. Después, kubelet ejecuta los contenedores de inicialización del Pod en el orden que
aparecen en la especificación del Pod.

Cada contenedor de inicialización debe salir correctamente antes de que
comience el siguiente contenedor. Si un contenedor falla en iniciar debido al tiempo de ejecución o
sale con una falla, se vuelve a intentar de acuerdo con el `restartPolicy` del Pod. Sin embargo,
si el `restartPolicy` del Pod se establece en `Always`, los contenedores de inicialización usan
el `restartPolicy` como `OnFailure`.

Un Pod no puede estar `Ready` sino hasta que todos los contenedores de inicialización hayan tenido éxito. Los puertos en un
contenedor de inicialización no se agregan a un Servicio. Un Pod que se está inicializando,
está en el estado de `Pending`, pero debe tener una condición `Initialized` configurada como falsa.

Si el Pod [se reinicia](#pod-restart-reasons) o es reiniciado, todos los contenedores de inicialización
deben ejecutarse de nuevo.

Los cambios en la especificación del contenedor de inicialización se limitan al campo de la imagen del contenedor.
Alterar un campo de la imagen del contenedor de inicialización equivale a reiniciar el Pod.

Debido a que los contenedores de inicialización se pueden reiniciar, reintentar o volverse a ejecutar, el código del contenedor de inicialización
debe ser idempotente. En particular, el código que escribe en archivos en `EmptyDirs`
debe estar preparado para la posibilidad de que ya exista un archivo de salida.

Los contenedores de inicialización tienen todos los campos de un contenedor de aplicaciones. Sin embargo, Kubernetes
prohíbe el uso de `readinessProbe` porque los contenedores de inicialización no pueden
definir el `readiness` distinto de la finalización. Esto se aplica durante la validación.

Usa `activeDeadlineSeconds` en el Pod para prevenir que los contenedores de inicialización fallen por siempre.
La fecha límite incluye contenedores de inicialización.
Sin embargo, se recomienda utilizar `activeDeadlineSeconds` si el usuario implementa su aplicación
como un `Job` porque `activeDeadlineSeconds` tiene un efecto incluso después de que `initContainer` finaliza.
El Pod que ya se está ejecutando correctamente sería eliminado por `activeDeadlineSeconds` si lo estableces.

El nombre de cada aplicación y contenedor de inicialización en un Pod debe ser único; un
error de validación es arrojado para cualquier contenedor que comparta un nombre con otro.

### Recursos

Dado el orden y la ejecución de los contenedores de inicialización, las siguientes reglas
para el uso de recursos se aplican:

* La solicitud más alta de cualquier recurso o límite particular definido en todos los contenedores
  de inicialización es la *solicitud/límite de inicialización efectiva*. Si algún recurso no tiene un
  límite de recursos especificado éste se considera como el límite más alto.
* La *solicitud/límite efectiva* para un recurso es la más alta entre:
  * la suma de todas las solicitudes/límites de los contenedores de aplicación, y
  * la solicitud/límite de inicialización efectiva para un recurso
* La planificación es hecha con base en las solicitudes/límites efectivos, lo que significa
  que los contenedores de inicialización pueden reservar recursos para la inicialización que no se utilizan
  durante la vida del Pod.
* El nivel de `QoS` (calidad de servicio) del *nivel de `QoS` efectivo* del Pod es el
  nivel de `QoS` tanto para los contenedores de inicialización como para los contenedores de aplicación.

La cuota y los límites son aplicados con base en la solicitud y límite efectivos de Pod.

Los grupos de control de nivel de Pod (cgroups) se basan en la solicitud y el límite de Pod efectivos, al igual que el planificador de Kubernetes ({{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}).

### Razones de reinicio del Pod

Un Pod puede reiniciarse, provocando la re-ejecución de los contenedores de inicialización por las siguientes razones:

* Se reinicia el contenedor de infraestructura del Pod. Esto es poco común y debería hacerlo alguien con acceso de root a los nodos.
* Todos los contenedores en un Pod son terminados mientras `restartPolicy` esté configurado en `Always`,
  forzando un reinicio y el registro de finalización del contenedor de inicialización se ha perdido debido a
  la recolección de basura.

El Pod no se reiniciará cuando se cambie la imagen del contenedor de inicialización o cuando
se pierda el registro de finalización del contenedor de inicialización debido a la recolección de basura. Esto
se aplica a Kubernetes v1.20 y posteriores. Si estás utilizando una versión anterior de
Kubernetes, consulta la documentación de la versión que estás utilizando.

## {{% heading "whatsnext" %}}

* Lee acerca de [creando un Pod que tiene un contenedor de inicialización](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)
* Aprende cómo [depurar contenedores de inicialización](/docs/tasks/debug/debug-application/debug-init-containers/)
