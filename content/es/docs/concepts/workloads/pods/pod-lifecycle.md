---
title: Ciclo de vida de un Pod
content_type: concept
weight: 30
---

<!-- overview -->
Esta página describe el ciclo de vida de un Pod.
Los Pods siguen un ciclo de vida definido, comenzando en la fase [`Pending`](#pod-phase),
y luego pasando a "en ejecución" `Running` si al menos uno de sus contenedores primarios se
inicia correctamente,
y luego pasando a "exitoso" (`Succeeded`) o "fallido" (`Failed`) si uno de los contenedores de un Pod
termina en error.

Mientras un Pod está en `Running`,
el kubelet puede reiniciar sus contenedores para manejar algunos errores.
Dentro de un Pod,
Kubernetes rastrea diferentes [estados](#container-states) de contenedores y
decide qué acción tomar para que el Pod esté sano otra vez.

En la API de Kubernetes, los Pods tienen una especificación y un estado actual.
El estado de un Pod consiste en un conjunto
de [condiciones de un Pod](#pod-conditions).
También puedes
inyectar [información de estado personalizada](#pod-readiness-gate) en los datos
de condiciones de un Pod, si es útil para tu aplicación.

Los Pods se [programan](/docs/concepts/scheduling-eviction/) únicamente una vez
en su tiempo de vida.
Una vez que un Pod se programa (asigna) a un Nodo, el Pod se ejecuta en ese Nodo
hasta que se termine o se [elimina](#pod-termination).

<!-- body -->

## Ciclo de vida de un Pod

Igual que contenedores de aplicación individuales,
se considera que los Pods son entidades relativamente efímeras
(en lugar de durables).
Los Pods se crean y se les 
asigna un identificador único
([UID](/es/docs/concepts/overview/working-with-objects/names/#uids)),
y se programan para ejecutarse en nodos donde se mantienen hasta que se terminan
(de acuerdo con las políticas de reinicio) o se eliminan.

Si un {{< glossary_tooltip term_id="node" text="nodo" >}} muere,
los Pods programados para ejecutarse en ese Nodo
se [programan para eliminarse](#pod-garbage-collection) luego de un periodo de
tiempo.

Los Pods, por sí mismos, no se curan automáticamente.
Si un Pod está programado para un {{< glossary_tooltip text="nodo" term_id="node" >}} y luego falla,
el Pod se elimina; de la misma manera,
un Pod no sobrevivirá a un desalojo debido a falta de recursos o mantenimiento
del Nodo.
Kubernetes utiliza una abstracción llamada {{< glossary_tooltip term_id="controller" text="controlador" >}}, que se encarga del trabajo de gestionar las instancias de Pod relativamente desechables.

Un Pod determinado (según lo definido por un UID) nunca se "reprograma" a un nodo diferente; en cambio,
ese Pod puede ser reemplazado por un Pod nuevo, casi idéntico, incluso con el mismo nombre si
deseado, pero con un UID diferente.

Cuando se dice que algo tiene la misma vida útil que un Pod, como un
{{< glosario_tooltip term_id="volume" text="volumen" >}},
eso significa que la cosa existe mientras ese Pod específico (con ese UID exacto)
existe. Si ese Pod se elimina por cualquier motivo, e incluso si se requiere un reemplazo idéntico
se crea, el objeto relacionado (un volumen, en este ejemplo) también se destruye y
creado de nuevo.

{{< figure src="/images/docs/pod.svg" title="Diagrama de un Pod" class=" diagram-medium" >}}

Un Pod con múltiples contenedores que contiene un extractor de ficheros y un
servidor web que usa un volumen persistente para compartir datos entre los
contenedores.

## Fase del Pod

El campo `status` de un Pod es un objeto
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) 
de Kubernetes que tiene un campo `phase`.

La fase de un Pod es un resumen simple y de alto nivel de dónde se encuentra el
Pod en su ciclo de vida. La fase no pretende ser un resumen completo de
observaciones del estado del contenedor o Pod, ni tampoco pretende ser una
máquina de estado completa.

El número y los significados de los valores de fase de un Pod están
estrechamente guardados.
Aparte de lo que se documenta aquí, no se debe asumir nada acerca de los Pods
que tienen un valor de `phase` determinado.

Aquí están los posibles valores de `phase`:

| Valor       | Descripción                                                                                                                                                                                                                                                                 |
|:------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Pending`   | El clúster de Kubernetes aceptó el pod, pero uno o más contenedores no se configuraron ni prepararon para ejecutarse. Esto incluye el tiempo que pasa un Pod esperando ser programado, así como el tiempo dedicado a descargar imágenes de contenedores a través de la red. |
| `Running`   | El Pod se vinculó a un nodo y se crearon todos los contenedores. Al menos un contenedor todavía se está ejecutando o está en proceso de iniciarse o reiniciarse.                                                                                                            |
| `Succeeded` | Todos los contenedores del Pod finalizaron con éxito y no se reiniciarán.                                                                                                                                                                                                   |
| `Failed`    | Todos los contenedores del Pod han finalizado y al menos un contenedor ha finalizado con error. Es decir, el contenedor salió con un estado distinto de cero o el sistema lo canceló.                                                                                       |
| `Unknown`   | Por alguna razón no se pudo obtener el estado del Pod. Esta fase generalmente ocurre debido a un error en la comunicación con el nodo donde debería ejecutarse el Pod.                                                                                                      |

{{< note >}}
Cuando se está borrando un Pod, se muestra como `Terminating` por algunos
comandos de kubectl.
Este estado `Terminating` no es una de las fases del Pod.
A un Pod se le garantiza un tiempo para terminar con gracia,
cuyo valor por defecto es 30 segundos.
Puedes utilizar el flag `--force`
para [terminar un Pod por la fuerza](#pod-termination-forced).
{{< /note >}}

A partir de la versión 1.27 de Kubernetes, el kubelet aplica una transición de
los Pods borrados, excepto
por [Pods estáticos](/docs/tasks/configure-pod-container/static-pod/)
y [Pods borrados por la fuerza](#pod-termination-forced) sin un finalizador, a
una fase terminal
(`Failed` o `Succeeded` dependiendo de los códigos de salida de los contenedores
del Pod) antes de su eliminación del servidor API.

Si un Nodo muere o se desconecta del resto del clúster,
Kubernetes aplica una política para establecer la `phase` de todos los Pods
en `Failed`.

## Estados del contenedor {#container-states}

Así como la fase del Pod en general, Kubernetes rastrea el estado de cada
contenedor dentro de un Pod.
Puedes
usar [hooks del ciclo de vida de un contenedor](/docs/concepts/containers/container-lifecycle-hooks/)
para lanzar eventos en ciertos puntos en el ciclo de vida de un
contenedor.

Una vez que el {{< glossary_tooltip text="programador" term_id="kube-scheduler" >}}
asigna un Pod a un Nodo,
el kubelet inicia creando los contenedores para ese Pod usando un
{{< glossary_tooltip text="espacio de ejecución del contenedor" term_id="container-runtime" >}}.
Hay 3 estados posibles para un contenedor: `Waiting`, `Running`, y `Terminated`.

Para revisar el estado de los contenedores de un Pod,
puedes usar `kubectl describe pod <name-of-pod>`.
La salida muestra el estado de cada contenedor dentro del Pod.

Cada estado tiene un significado específico:

### `Waiting` {#container-state-waiting}

Si un contenedor no está en el estado `Running` o `Terminated`, está `Waiting`.
Un contenedor en el estado `Waiting` aún está ejecutando las operaciones que
requiere para completar su arranque:
por ejemplo,
descargar la imagen del contenedor de un registro de imágenes de un contenedor,
o aplicando datos {{< glossary_tooltip text="secretos" term_id="secret" >}}.

### `Running` {#container-state-running}

El estado `Running` indica que el contenedor se está ejecutando sin problemas.
Si hay un hook `postStart` configurado, ya se ha ejecutado y finalizado.
Cuando utilizas el comando `kubectl` para consultar un Pod con un contenedor que
está `Running`,
también puedes ver información sobre cuando el contenedor entró en
estado `Running`.

### `Terminated` {#container-state-terminated}

Un contenedor en el estado `Terminated` comenzó su ejecución y luego se terminó
con éxito o falló por alguna razón.
Cuando usas `kubectl` para consultar un Pod con un contenedor que
está `Terminated`, puedes ver un motivo, y un código de salida, y la hora de
inicio y de finalización del contenedor.

Si un contenedor tiene un hook `preStop` configurado, el hook se ejecuta antes
de que el contenedor entre en estado `Terminated`.

## Política de reinicio del contenedor {#restart-policy}

La especificación (`spec` en inglés) de un Pod tiene un campo `restartPolicy` con los posibles
valores `Always`, `OnFailure`, y `Never`.
El valor por defecto es `Always`.

La política de reinicio (`restartPolicy` en inglés) para un Pod aplica a
{{< glossary_tooltip text="contenedores de apps" term_id="app-container" >}} en el Pod
para [contenedores de inicialización](/docs/concepts/workloads/pods/init-containers/) regulares.
Los [contenedores sidecar](/docs/concepts/workloads/pods/sidecar-containers/)
ignoran el campo `restartPolicy`: en Kubernetes, un sidecar se define como una
entrada dentro de `initContainers` que tiene su `restartPolicy` a nivel del contenedor
establecido en `Always`. Para contenedores de inicio que finalizan con un error, el kubelet reinicia el
contenedor de inicio if el nivel del Pod `restartPolicy` es `OnFailure`
o `Always`.

Cuando el kubelet está manejando el contenedor se reinicia de acuerdo con la política de reinicio configurada, que solo se aplica a los reinicios que realizan contenedores de
reemplazo dentro del
mismo Pod y ejecutándose en el mismo nodo.
Después de que los contenedores en un Pod terminan, el kubelet
los reinicia con un retraso de retroceso exponencial (10 s, 20 s, 40 s,...), que
está limitado a
cinco minutos. Una vez que un contenedor se ha ejecutado durante 10 minutos sin
ningún problema, el
kubelet restablece el temporizador de reinicio para ese contenedor.
[Ciclo de vida de contenedores Sidecar y el Pod](#sidecar-containers-and-pod-lifecycle)
explica el comportamiento de `init containers` cuando
especifica una `restartPolicy`.


## Condiciones del Pod {#pod-conditions}

Un Pod tiene un `PodStatus`, que tiene un listado de
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
a través de los cuales el Pod ha pasado o no.
El kubelet administra las siguientes condiciones del Pod:

* `PodScheduled`: El Pod está programado para un nodo.
* `PodReadyToStartContainers`: (característica beta; habilitada
  por [defecto](#pod-has-network)) La zona de pruebas del Pod se creó
  correctamente y se configuró la red.
* `ContainersReady`: todos los contenedores en el Pod están listos.
* `Initialized`: todos
  los [contenedores de inicio](/docs/concepts/workloads/pods/init-containers/)
  han terminado exitosamente.
* `Ready`: el Pod es capaz de recibir peticiones y debería ser agregado a los
  grupos de equilibrio de carga de todos los Services que coincidan.

| Nombre del campo     | Descripción                                                                                           |
|:---------------------|:------------------------------------------------------------------------------------------------------|
| `type`               | Nombre de esta condición del Pod.                                                                     |
| `status`             | Indica si la condición es aplicable, con valores posibles "`True`", "`False`", ó "`Unknown`".         |
| `lastProbeTime`      | Marca de tiempo de cuando se probó por última vez la condición del Pod.                               |
| `lastTransitionTime` | Marca de tiempo de cuando el Pod hizo transición de un estado a otro.                                 |
| `reason`             | Texto legible por máquina que indica el motivo de la última transición de la condición.               |
| `message`            | Mensaje legible por humanos indicando detalles acerca ade la última transición de estado.             |

### Preparación del Pod {#pod-readiness-gate}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Tu aplicación puede inyectar retroalimentación adicional o señales
al `PodStatus`:
_Pod readiness_.
Para usar esto, establece `readinessGates` en la `spec` del Pod para especificar una
lista de condiciones adicionales que el kubelet evalúa para la preparación del
Pod.

Las condiciones de preparación están determinadas por el estado actual de los
campos `status.conditions` de un Pod.
Si Kubernetes no puede encontrar una condición en el campo `status.conditions`
de un Pod, el estado de la condición se establece en "`False`".

Aquí hay un ejemplo:

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # una PodCondition construida
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # una PodCondition extra
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

Las condiciones del Pod que incluyas deben tener nombres que sean válidos para
los [formatos de etiqueta](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)
de Kubernetes.

### Estado de preparación del Pod {#pod-readiness-status}

El comando `kubectl patch` no admite actualizar el estado del objeto.
Para establecer estas `status.conditions` para el Pod, las aplicaciones y
los {{< glossary_tooltip term_id="operator-pattern" text="operadores">}}
deberían utilizar la acción `Patch`.

Puedes utilizar
una [librería cliente de Kubernetes](/docs/reference/using-api/client-libraries/)
para escribir código que establece condiciones personalizadas de un Pod para su
preparación.

Para los Pods que utilizan condiciones personalizadas, ese Pod es evaluado para
estar listo **solamente** cuando ambas afirmaciones aplican:

* Todos los contenedores del Pod están listos.
* Todas las condiciones personalizadas especificadas en `readinessGates`
  están `True`.

Cuando los contenedores de un Pod están listos, pero al menos una condición
personalizada está ausente o `False`,
el kubelet establece la [condición](#pod-conditions) del Pod
en `ContainersReady`.

### Preparación de la red del Pod {#pod-has-network}

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

{{< note >}}
Durante su desarrollo temprano, esta condición se llamaba `PodhasNetwork`.
{{< /note >}}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Tu aplicación puede inyectar retroalimentación adicional o señales
al `PodStatus`:
_Pod readiness_.
Para usar esto, establece `readinessGates` en la `spec` del Pod para especificar una
lista de condiciones adicionales que el kubelet evalúa para la preparación del
Pod.

Las condiciones de preparación están determinadas por el estado actual de los
campos `status.conditions` de un Pod.
Si Kubernetes no puede encontrar una condición en el campo `status.conditions`
de un Pod, el estado de la condición se establece en "`False`".

Aquí hay un ejemplo:

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # una PodCondition construida
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # una PodCondition extra
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

Las condiciones del Pod que incluyas deben tener nombres que sean válidos para
los [formatos de etiqueta](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)
de Kubernetes.

### Estado de preparación del Pod {#pod-readiness-status}

El comando `kubectl patch` no admite actualizar el estado del objeto.
Para establecer estas `status.conditions` para el Pod, las aplicaciones y
los {{< glossary_tooltip term_id="operator-pattern" text="operadores">}}
deberían utilizar la acción `Patch`.

Puedes utilizar
una [librería cliente de Kubernetes](/docs/reference/using-api/client-libraries/)
para escribir código que establece condiciones personalizadas de un Pod para su
preparación.

Para los Pods que utilizan condiciones personalizadas, ese Pod es evaluado para
estar listo **solamente** cuando ambas afirmaciones aplican:

* Todos los contenedores del Pod están listos.
* Todas las condiciones personalizadas especificadas en `readinessGates`
  están `True`.

Cuando los contenedores de un Pod están listos, pero al menos una condición
personalizada está ausente o `False`,
el kubelet establece la [condición](#pod-conditions) del Pod
en `ContainersReady`.

### Preparación de la red del Pod {#pod-has-network}

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

{{< note >}}
Durante su desarrollo temprano, esta condición se llamaba `PodhasNetwork`.
{{< /note >}}

### Preparación de la programación del Pod {#pod-scheduling-readiness-gate}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

Revisa [Preparación de la programación del Pod](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
para más información.

## Sondeos del contenedor

Una _sonda_ es un diagnóstico realizado periódicamente por
el [kubelet](/docs/reference/command-line-tools-reference/kubelet/) en un
contenedor.
Para ejecutar este diagnóstico, el kubelet ejecuta código dentro del contenedor
o realiza una solicitud de red.

### Mecanismos de revisión {#probe-check-methods}

Existen cuatro maneras diferentes de revisar un contenedor usando una sonda.
Cada sonda debe definir exactamente una de estas cuatro maneras:

`exec`: Ejecuta un comando especificado dentro del contenedor.
El diagnóstico se considera exitoso si el comando termina con un código de
estado 0.

`grpc`
: Realiza una llamada de procedimiento remoto usando [gRPC](https://grpc.io/).
El destino debe
implementar [revisión de estado de gRPC](https://grpc.io/grpc/core/md_doc_health-checking.html).
El diagnóstico se considera exitoso si el `status` de la respuesta es `SERVING`.

`httpGet`
: Realiza una petición HTTP `GET` contra la dirección IP en la ruta y puerto
especificado.
El diagnóstico se considera exitoso si la respuesta tiene un código de estado
mayor o igual que 200 y menor que 400.

`tcpSocket`
: Realiza una revisión TCP contra la dirección IP del Pod en un puerto
específico.
El diagnóstico se considera exitoso si el puerto está abierto.
Si el sistema remoto (el contenedor) cierra la conexión inmediatamente después
de abrir la conexión, el diagnóstico se considera exitoso.

{{< caution >}}
A diferencia de otros mecanismos, la implementación de la sonda `exec` involucra
la creación/bifuración de múltiples procesos cada vez que se ejecuta.
Como resultado, en caso de clústers con mayor densidad de Pods, intérvalos más
bajos de `initialDelaySeconds`, `periodSeconds`, configurando un sondeo
con `exec` puede introducir una sobrecarga en el uso de la CPU del nodo.

En tales escenarios, considere la utilización de los mecanismos alternativos de
sondeo para evitar la sobrecarga.
{{< /caution >}}

### Resultados de sondeos

Cada sondeo puede tener uno de tres resultados:

`Success`
: El contenedor ha pasado el diagnóstico.

`Failure`
: El contenedor ha fallado el diagnóstico.

`Unknown`
: El diagnóstico ha fallado (no se debe tomar ninguna acción, y el kubelet hará
más revisiones adicionales).

### Tipos de sondeo

Opcionalmente,
el kubelet puede ejecutar y reaccionar a tres tipos de sondeos en contenedores
en ejecución:

`livenessProbe`
: Indica si el contenedor se está ejecutando.
Si el sondeo falla, el kubelet mata el contenedor,
y el contenedor está sujeto a su [política de reinicio](#restart-policy).
Si un contenedor no tiene un sondeo de liveness, el estado por defecto
es `Success`.

`readinessProbe`
: Indica si un contenedor está preparado para responder a peticiones.
Si el sondeo falla,
el controlador de endpoints elimina las direcciones IP del Pod de los endpoints
de todos los Services que coinciden con el Pod.
El estado por defecto de readiness antes del retraso inicial es `Failure`.
Si un contenedor no tiene un sondeo de readiness, el estado por defecto
es `Success`.

`startupProbe`
: Indica si la aplicación dentro del contenedor ha iniciado. El resto de los
sondeos están deshabilitados si un sondeo de inicio se proporciona, hasta que se
complete. Si el sondeo falla, el kubelet mata el contenedor, y el contenedor
está sujeto a su [política de reinicio](#restart-policy). Si un contenedor no
tiene un sondeo de inicio, el estado por defecto es `Success`.

Para mayor información sobre como configurar un sondeo liveness,
readiness o de startup, mire la
sección [Configurar una sonda Liveness, Readiness y Startup](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

#### ¿Cuándo debería utilizar un sondeo liveness?

Si el proceso en tu contenedor es capaz de terminar por sí mismo cuando
encuentra un error o deja de estar sano, no necesitas un sondeo liveness; el
kubelet automáticamente realizará la acción adecuada de acuerdo con la política
de reinicio `restartPolicy` del Pod.

Si te gustaría que tu contenedor fuese destruido y reiniciado si falla un
sondeo, especifica un sondeo liveness, y especifica una `restartPolicy`
de `Always` o `OnFailure`.

#### ¿Cuándo debería utilizar un sondeo readiness?

Se te gustaría enviar tráfico al Pod solo cuando una sonda sea exitosa,
especifica un sondeo readiness.
En este caso,
el sondeo readiness podría ser el mismo que el liveness,
pero la existencia del sondeo readines en la especificación significa que el Pod
iniciará sin recibir ningún tráfico y solo iniciará cuando el sondeo readiness
sea exitoso.

Si quieres que tu contenedor sea capaz de darse de baja por mantenimiento por sí
mismo,
puedes especificar un sondeo de readiness que revisa un endpoint específico de
readiness que es distinto del sondeo liveness.

Si tu aplicación tiene una dependencia estricta con servicios de trasfondo,
puedes implementar ambos sondeos de liveness y readiness.
El sondeo de liveness pasa cuando la aplicación por sí misma está sana, pero el
sondeo de readiness revisa adicionalmente que cada servicio de trasfondo está
disponible.
Esto ayuda a evitar enviar a Pods que solo pueden responder con errores.

Si tu contenedor necesita trabajar cargando grandes datos, ficheros de
configuración, o migraciones durante el inicio, puedes usar
un [sondeo de inicio](#when-should-you-use-a-startup-probe).
Sin embargo, si quieres detectar la diferencia entre una aplicación que ha
fallado y una aplicación que todavía está procesando datos de inicialización,
puedes usar un sondeo de readiness.

{{< note >}}
Si quieres ser capaz de drenar peticiones cuando se elimina el Pod,
no necesitas un sondeo readiness;
cuando se elimina el Pod,
automáticamente se cambia al estado `unready` sin importar si existe el sondeo
readiness.
El Pod permanece en el estado `unready` mientras espera que los contenedores en
el Pod se paren.
{{< /note >}}

#### ¿Cuándo debería utilizar un sondeo de inicialización?

Los sondeos de inicialización son útiles para Pods que tienen contenedores que
se toman un largo tiempo para estar en servicio.
En lugar de especificar un intérvalo largo de liveness, puedes crear una
configuración separada para sondear el contenedor en el inicio, permitiendo un
tiempo mayor que el intervalo de liveness.

Si tu contenedor usualmente inicia en más
de `initialDelaySeconds + failureThreshold × periodSeconds`, deberías
especificar un sondeo de inicialización que revise el mismo endpoint que la
sonda liveness.
El periodo por defecto `periodSeconds` es de 10 segundos.
Deberías especificar el campo `failureThreshold` lo suficientemente alto para
permitir al contenedor arrancar, sin cambiar los valores por defecto de la sonda
liveness.
Esto ayuda a proteger contra puntos muertos.

## Finalización de Pods {#pod-termination}

Ya que los Pods representan procesos ejecutándose en nodos de un clúster, es
importante permitir que esos procesos terminen con gracia cuando no se
necesitan (en lugar de detenerse abruptamente con una señal `Kill` y sin
oportunidad de limpiarse).

El diseño está orientado a permitir que puedas solicitar la eliminación de un
Pod y saber cuándo finalizan los procesos, pero también para asegurar que la
eliminación se completa eventualmente.
Cuando solicitas la eliminación de un Pod, el clúster registra y rastrea el
periodo de gracia antes de que el Pod se elimine por la fuerza.
Con este rastreo de detención forzada en marcha,
el {{< glossary_tooltip text=" kubelet" term_id="kubelet" >}} intenta pararlo con gracia.

Típicamente, con esta finalización con gracia del Pod, el kubelet hace
peticiones al tiempo de ejecución del contenedor para intentar detener los
contenedores en el Pod, primeramente enviando una señal `Term` (ej. SIGTERM),
con un período de tiempo de gracia, al proceso principal de cada contenedor.
Las peticiones para parar los contenedores se procesan de forma asíncrona en el
tiempo de ejecución del contenedor.
No hay garantía del orden de procesamiento de estas peticiones.
Muchos contenedores respetan el valor `STOPSIGNAL` definido en la imagen del
contenedor y, si es diferente, envían el valor de `STOPSIGNAL` en lugar de
SIGTERM.

Una vez que el período de gracia ha acabado,
se envía la señal KILL a cualquier processo restante, y luego el Pod se elimina
del {{< glossary_tooltip text="Servidor API" term_id="kube-apiserver" >}}.
Si el kubelet o el tiempo de ejecución del contenedor del servicio que lo
administra se reinicia mientras espera que los procesos terminen, el kubelet
reintenta de nuevo el proceso incluyendo el periodo original de gracia.

Un flujo de ejemplo:

1. Utilizas la herramienta `kubectl` para eliminar manualmente un Pod
   específico, con un periodo de gracia por defecto (30 segundos).

1. El Pod en el servidor API se actualiza con el tiempo más allá del cual el Pod
   se considera "muerto"
   junto con el periodo de gracia.
   Si utilizas `kubectl describe` para revisar el Pod que estás borrando,
   ese Pod se mostrará como `Terminating`.
   En el nodo donde se ejecuta el Pod: tan pronto como el kubelet observa que el
   Pod se ha marcado como terminando (se ha definido una duración de parada con
   gracia), el kubelet comienza el proceso local de parar el Pod.

1. Si uno de los contenedores del Pod tiene definido
   un [hook](/docs/concepts/containers/container-lifecycle-hooks) `preStop` y
   el `terminationGracePeriodSeconds` en la especificación del Pod no está
   definido en 0, el kubelet ejecuta ese hook dentro del contenedor.
   El `terminationGracePeriodSeconds` por defecto es 30 segundos.

   Si el hook `preStop` todavía se está ejecutando luego de la expiración del
   período de gracia, el kubelet solicita una extensión 2 segundos del periodo
   de gracia.

   {{< note >}}
   Si el hook `preStop` necesita más tiempo para completar que el tiempo
   permitido por defecto,
   debes modificar el `terminationGracePeriodSeconds` para adaptarlo.
   {{< /note >}}

1. El kubelet lanza el tiempo de ejecución del contenedor para enviar una
   señal TERM al proceso 1 dentro de cada contenedor.
   {{< note >}}
   Los contenedores en el Pod reciben la señal TERM en tiempos diferentes y en
   orden arbitrario.
   Si el orden de finalización importa, considera utilizar un hook `preStop`
   para sincronizarlos.
   {{< /note >}}

1. Al mismo tiempo que el kubelet inicia la finalización con gracia del Pod, el
   panel de control evalúa si quitar este Pod en finalización de los
   objetos `EndpointSlice` (y `Endpoints`), donde aquellos objetos representan
   un {{< glossary_tooltip term_id="service" text=" Service" >}} con un {{< glossary_tooltip text="selector" term_id="selector" >}} configurado.

   Los {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} y otros
   recursos de carga de trabajo ya no consideran al Pod como réplica válida, en
   servicio.

   Los Pods que finalizan lentamente no servirían tráfico regular y debería
   iniciar la finalización de procesamiento de conexiones abiertas.
   Algunas aplicaciones necesitan ir más allá de finalizar las conexiones
   abiertas y necesitan finalización aún con más gracia, por ejemplo, drenar y
   completar una sesión.

   Cualquier endpoint que representa los Pods en finalización no son removidos
   inmediatamente de `EndpointSlices` y se expone un estatus indicando
   el [estado de terminación](/docs/concepts/services-networking/endpoint-slices/#conditions)
   de la API de EndpointSlice
   (y la API de Endpoint legada).
   Los endpoints que están terminando siempre tienen su estatus `ready`
   como `false` (para compatibilidad con versiones anteriores a 1.26), por lo
   que los balanceadores de carga no los usarán para tráfico regular.

   Si se necesita drenar el tráfico en un Pod que está terminando,
   el readiness se puede revisar con la condición `serving`.
   Puedes encontrar más detalles en cómo implementar drenado de conexiones en el
   tutorial [Pods y flujo de terminación de Endpoints](/docs/tutorials/services/pods-and-endpoint-termination-flow/)

{{<note>}}
Si no tienes la `EndpointSliceTerminatingCondition` habilitada en tu clúster (la
característica está habilitada por defecto desde Kubernetes 1.22, y se bloquea en
1.26), entonces el plano de control de Kubernetes elimina un Pod de cualquier
EndpointSlices relevante tan pronto como inicia el período de gracia terminación
del Pod.
El comportamiento descrito arriba aplica para cuando la característica `EndpointSliceTerminatingCondition` está habilitada.
{{</note>}}

{{<note>}}
A partir de Kubernetes 1.29, si tu Pod incluye uno o más contenedores sidecars
(contenedores de inicialización con política de reinicio `AlwaysRestart`), el
kubelet retrasará enviar la señal TERM a estos contenedores sidecar hasta que el
último contenedor principal del Pod haya finalizado.

Los contenedores sidecar terminarán en el orden inverso del que están definidos
en la especificación del Pod.
Esto asegura que los contenedores sidecar continúen sirviendo a los demás
contenedores en el Pod mientras no se necesitan más.

Ten en cuenta que la terminación lenta de un controlador principal también
retrasará la terminación de los contenedores sidecar.
Si el período de gracia expira antes que acabe el proceso de terminación, el Pod
entrará en terminación de emergencia.
En este caso, todos los contenedores restantes en el Pod se terminarán
simultáneamente con un período de gracia corto.

Igualmente, si el Pod tiene un hook `PreStop` que excede el périodo de gracia de
finalización, puede ocurrir una terminación de emergencia.
En general, si has usado hooks de `preStop` para controlar el orden de
terminación sin contenedores sidecar, puedes quitarlos y permitir que el kubelet
los administre automáticamente.
{{</note>}}

1. Cuando expira el tiempo de gracia,
   el kubelet lanza un apagado forzado.
   El tiempo de ejecución del contenedor envía una señal `SIGKILL`a cualquier
   proceso que se esté ejecutando en cualquier contenedor en el Pod.
   El kubelet también limpia un contenedor `pause` escondido si ese tiempo de
   ejecución del contenedor usa uno.
1. El kubelet hace una transición del Pod a fase terminal
   (`Failed` o `Succeeded`, dependiendo del estado de sus contenedores).
   Este paso está garantizado desde la versión 1.27.
1. El kubelet lanza la eliminación forzada del objeto Pod del servidor API,
   estableciendo el período de gracia a 0 (detención inmediata).
1. El servidor API borra el objeto API del Pod,
   que ya no es visible desde ningún cliente.

### Terminación Forzada del Pod {#pod-termination-forced}

{{< caution >}}
Eliminaciones forzadas pueden ser potencialmente disruptivas para algunas cargas
de trabajo y sus Pods.
{{< /caution >}}

Por defecto, todas las eliminaciones tienen un tiempo de gracia de 30 segundos.
El comando `kubelet delete` soporta la opción `--grace-period=<segundos>` que
permite sobreescribir el valor por defecto y especificar tu propio valor.

Establecer el período de gracia a `0` elimina de forma forzada e inmediata el
Pod del servidor API.
Si el Pod aún se está ejecutando en un nodo, esa eliminación forzada hace que
el kubelet inicie una limpieza inmediata.

{{< note >}}
Debes especificar una opción adicional `--force` junto con `--grace-period=0`
para realizar eliminaciones forzadas.
{{< /note >}}

Cuando se realiza una eliminación forzada,
el servidor API no espera la confirmación del kubelet de que el Pod ha terminado
en el nodo en que se está ejecutando.
Este elimina el Pod en la API inmediatamente para que se pueda crear un Pod con
el mismo nombre.
En el nodo, los Pods que están por terminar inmediatamente aún pueden tener un
pequeño período de gracia antes de ser eliminados de forma forzada.

{{< caution >}}
La eliminación inmediata no espera la confirmación de que el recurso en ejecución
ha terminado.
El recurso puede continuar ejecutándose en el clúster de forma indefinida.
{{< /caution >}}

Si necesitas eliminar Pods por la fuerza y son parte de un `StatefulSet`,
mira la documentación
para [borrar Pods de un StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
### Recolección de elementos no utilizados de los Pods {#pod-garbage-collection}

Cuando los Pods fallan,
los objetos API permanecen en el clúster hasta que un humano o el proceso de
{{< glossary_tooltip term_id="controller" text="controlador" >}} los elimina
explícitamente.

El recolector de elementos no utilizados (PodGC en inglés) es un controlador en
el plano de control que elimina los Pods que se han terminado (con una fase
de `Succeeded` o `Failed`), cuando el número de Pods excede el umbral
configurado (determinado por `terminated-pod-gc-threshold` en el controlador de
kube-controller-manager).
Esto evita la fuga de recursos mientras que los Pods se crean y se eliminan en
el tiempo.

Adicionalmente,
el PodGC limpia cualquier Pod que satisfaga cualquiera de las siguiente
condiciones:

1. Pods huérfanos - asociados a un Nodo que ya no existe,
1. Pods que están finalizando y no están programados,
1. Pods que están finalizando,
   asociados a un nodo que no está listo, contaminado
   con [`node.kubernetes.io/out-of-service`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-out-of-service),
   cuando la condición `NodeOutOfServiceVolumeDetach` está habilitada.

Cuando la condición `PodDisruptionCondition` está habilitada,
además de limpiar los Pods,
el PodGC también los marcará como fallidos si están en una fase no terminal.
También, el PodGC agrega una condición de disrupción del Pod cuando realiza la limpieza de un Pod huérfano.
Mira [condiciones de disrupción del Pod](/docs/concepts/workloads/pods/disruptions#pod-disruption-conditions) para más detalles.

## {{% heading "whatsnext" %}}

* Obtén experiencia práctica
  [agregar controladores a los eventos del ciclo de vida del contenedor](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Obtén experiencia práctica
  [configurar sondas de Liveness, Readiness y Startup](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

* Aprende más sobre [hooks del ciclo de vida del contenedor](/docs/concepts/containers/container-lifecycle-hooks/).

* Aprende más sobre [contenedores sidecar](/docs/concepts/workloads/pods/sidecar-containers/).

* Para información detallada sobre el estatus del contenedor del Pod en la API,
  mira la documentación de referencia de la API que cubre el [`status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus) del Pod.