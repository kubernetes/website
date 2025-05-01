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

Al igual que contenedores de aplicaciones, los Pods se consideran entidades relativamente efímeras.
Los Pods se crean y se les asigna un identificador único ([UID](/es/docs/concepts/overview/working-with-objects/names/#uids)), y se programan para ejecutarse en nodos donde se mantienen hasta que se terminan (de acuerdo con las políticas de reinicio) o se eliminan.

Si un {{< glossary_tooltip text="nodo" term_id="node" >}} muere,
los Pods programados para ejecutarse en ese Nodo
se [programan para eliminarse](#pod-garbage-collection).
El plano de control marca los Pods para ser eliminados luego de un periodo de tiempo.

<!-- body -->

## Ciclo de vida de un Pod

Mientras un Pod se está ejecutando, el kubelet puede reiniciar contenedores para manejar algunos tipos de fallos.
Dentro de un Pod, Kubernetes rastrea distintos [estados](#container-states) del contenedor y determina qué acción realizar para que el Pod esté sano nuevamente.

En la API de Kubernetes, los Pods tienen una especificación y un estatus actual.
El estatus de un objeto Pod consiste en un conjunto de [condiciones del Pod](#pod-conditions).
También puedes inyectar [información de readiness personalizada](#pod-readiness-gate) a los datos de condición de un Pod, si es útil para tu aplicación. 

Los Pods solo se [programan](/docs/concepts/scheduling-eviction/) una vez en su ciclo de vida; asignar un Pod a un nodo específico se llama _vincular_ (binding, en inglés), y el proceso de seleccionar cuál Pod usar se llama _programar_.
Una vez que un Pod está vinculado a un nodo, Kubernetes intenta ejecutar el Pod en ese nodo.
El Pod se ejecuta en ese nodo hasta que termina, o hasta que es [terminado](#pod-termination); si Kubernetes no es capaz de iniciar el Pod en el nodo seleccionado (por ejemplo, si el nodo falla antes que el Pod inicie), entonces ese Pod en particular nunca inicia.

Puedes usar [readiness de programación del Pod](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/) para retrasar la programación de un Pod hasta que todas sus _puertas de programación_ sean removidas.
Por ejemplo, podrías querer definir un conjunto de Pods, pero solo lanzar la programación una vez que todos los Pods hayan sido creados.

### Recuperación de fallos en los Pods {#pod-fault-recovery}

Si falla uno de los contenedores en el Pod, Kubernetes puede intentar reiniciar ese contenedor en específico.
Para saber más, lea [cómo los Pods manejan los errores del contenedor](#container-restarts).

Sin embargo, los Pods pueden fallar de una manera que el clúster no puede recuperar, y en ese caso
Kubernetes no intenta más sanar el Pod; en su lugar, Kubernetes elimina el
Pod y confía en otros componentes para proporcionar una curación automática.

Si un Pod está programado para un {{< glossary_tooltip text="nodo" term_id="node" >}} y ese
nodo luego falla, el Pod se trata como no saludable y Kubernetes eventualmente elimina el Pod.
Un Pod no sobrevivirá a una {{< glossary_tooltip text="evacuación" term_id="eviction" >}} debido
a la falta de recursos o al mantenimiento del Nodo.

Kubernetes utiliza una abstracción de nivel superior, llamada
{{< glossary_tooltip term_id="controller" text="controlador" >}}, que maneja el trabajo de
gestionar las instancias de Pods relativamente desechables.

Un Pod dado (como se define por un UID) nunca es "reprogramado" a un nodo diferente; en su lugar,
ese Pod puede ser reemplazado por un nuevo Pod casi idéntico.
Si hace un Pod de reemplazo, incluso puede
tener el mismo nombre (como en `.metadata.name`) que tenía el Pod antiguo, pero el reemplazo
tendría un `.metadata.uid` diferente del Pod antiguo.

Kubernetes no garantiza que un reemplazo de un Pod existente sea programado
en el mismo nodo en el que el antiguo Pod estaba siendo reemplazado.

### Ciclo de vida asociados

Cuando se dice que algo tiene la misma vida útil que un Pod, como un
{{< glossary_tooltip term_id="volume" text="volúmen" >}},
eso significa que el objeto existe mientras ese Pod específico (con ese UID exacto)
exista.
Si ese Pod se elimina por cualquier razón, e incluso si se crea un reemplazo idéntico,
el objeto relacionado (un volumen, en este ejemplo) también se destruye y se crea nuevamente.

{{< figure src="/images/docs/pod.svg" title="Figura 1." class="diagram-medium" caption="Un Pod de varios contenedores que contiene un extractor de archivos sidecar y un servidor web. El Pod utiliza un volumen efímero `emptyDir` para almacenamiento compartido entre los contenedores." >}}

## Fase del Pod {#pod-phase}

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
| `Pending`   | El clúster de Kubernetes aceptó el Pod, pero uno o más contenedores no se configuraron ni prepararon para ejecutarse. Esto incluye el tiempo que pasa un Pod esperando ser programado, así como el tiempo dedicado a descargar imágenes de contenedores a través de la red. |
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
usar [hooks del ciclo de vida de un contenedor](/es/docs/concepts/containers/container-lifecycle-hooks/)
para lanzar eventos en ciertos puntos en el ciclo de vida de un
contenedor.

Una vez que el {{< glossary_tooltip text="programador" term_id="kube-scheduler" >}}
asigna un Pod a un Nodo,
el kubelet inicia creando los contenedores para ese Pod usando un
{{< glossary_tooltip text="runtime del contenedor" term_id="container-runtime" >}}.
Hay 3 estados posibles para un contenedor: `Waiting`(esperando), `Running`(en ejecución), y `Terminated`(terminado).

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

## Cómo los Pods manejan los problemas con los contenedores {#container-restarts}

Kubernetes maneja los fallos de los contenedores dentro de los Pods usando una [política de reinicio, `restartPolicy` en inglés](#restart-policy) definida en la especificación `spec` del Pod.
Esta política determina cómo reacciona Kubernetes cuando los contenedores salen debido a errores u otras razones, que sigue la siguiente secuencia:

1. **Fallo inicial**: Kubernetes intenta un reinicio inmediato basado en la `restartPolicy` del Pod.
1. **Fallos repetidos**:
   Después del fallo inicial, Kubernetes aplica un retraso exponencial para los reinicios subsiguientes, descrito en [restartPolicy](#restart-policy).
   Esto evita que los intentos de reinicio rápidos y repetidos sobrecarguen el sistema.
1. **Estado de CrashLoopBackOff**:
   Esto indica que el mecanismo de retraso exponencial está actualmente en efecto para un contenedor dado que está en un bucle de fallos, fallando y reiniciando repetidamente.
1. **Reinicio del retraso**:
   Si un contenedor funciona correctamente durante un cierto período (por ejemplo, 10 minutos), Kubernetes reinicia el retraso, tratando cualquier nuevo fallo como el primero.

2. En la práctica, un `CrashLoopBackOff` es una condición o evento que podría verse como salida del comando `kubectl`, al describir o listar Pods, cuando un contenedor en el Pod no arranca correctamente y luego intenta y falla continuamente en un bucle.

En otras palabras, cuando un contenedor entra en el bucle de fallos, Kubernetes aplica el retraso exponencial mencionado en la [Política de reinicio del contenedor](#restart-policy).
Este mecanismo evita que un contenedor defectuoso sobrecargue el sistema con intentos de inicio fallidos continuos.

El `CrashLoopBackOff` puede ser causado por problemas como los siguientes:

* Errores de la aplicación que hacen que el contenedor salga.
* Errores de configuración, como variables de entorno incorrectas o archivos de configuración faltantes.
* Restricciones de recursos, donde el contenedor puede no tener suficiente memoria o CPU para arrancar correctamente.
* Fallos en los chequeos de salud si la aplicación no comienza a servir dentro del tiempo esperado.
* Las sondas de liveness o de arranque del contenedor devuelven un resultado de `Failure` como se menciona en la [sección de sondas](#container-probes).
Para investigar la causa raíz de un problema de `CrashLoopBackOff`, un usuario puede:

1. **Revisar los registros**: Use `kubectl logs <nombre-del-pod>` para revisar los registros del contenedor. Esta es a menudo la forma más directa de diagnosticar el problema que causa los fallos.
1. **Inspeccionar eventos**: Use `kubectl describe pod <nombre-del-pod>` para ver eventos para el Pod, lo que puede proporcionar pistas sobre problemas de configuración o recursos.
1. **Revisar la configuración**: Asegúrese de que la configuración del Pod, incluidas las variables de entorno y los volúmenes montados, sea correcta y que todos los recursos externos necesarios estén disponibles.
1. **Verificar los límites de recursos**: Asegúrese de que el contenedor tenga suficiente CPU y memoria asignada. A veces, aumentar los recursos en la definición del Pod puede resolver el problema.
1. **Depurar la aplicación**: Pueden existir errores o configuraciones incorrectas en el código de la aplicación. Ejecutar esta imagen de contenedor localmente o en un entorno de desarrollo puede ayudar a diagnosticar problemas específicos de la aplicación.

## Política de reinicio del contenedor {#restart-policy}

La especificación (`spec` en inglés) de un Pod tiene un campo `restartPolicy` con los posibles
valores `Always`, `OnFailure`, y `Never`.
El valor por defecto es `Always`.

La política de reinicio (`restartPolicy` en inglés) para un Pod aplica a
{{< glossary_tooltip text="contenedores de apps" term_id="app-container" >}} en el Pod
para [contenedores de inicialización](/es/docs/concepts/workloads/pods/init-containers/) regulares.
Los [contenedores sidecar](/docs/concepts/workloads/pods/sidecar-containers/)
ignoran el campo `restartPolicy`: en Kubernetes, un sidecar se define como una
entrada dentro de `initContainers` que tiene su `restartPolicy` a nivel del contenedor
establecido en `Always`. Para contenedores de inicio que finalizan con un error, el kubelet reinicia el
contenedor de inicio si el nivel del Pod `restartPolicy` es `OnFailure`
o `Always`:

* `Always`: Automáticamente reinicia el contenedor luego de alguna terminación.
* `OnFailure`: Solo reinicia el contenedor si finaliza con un error (estado de salida distinto de cero).
* `Never`: No reinicia el contenedor automáticamente.

Cuando el kubelet está manejando el contenedor, se reinicia de acuerdo con la política de reinicio configurada, que solo se aplica a los reinicios que realizan contenedores de
reemplazo dentro del
mismo Pod y ejecutándose en el mismo nodo.
Después de que los contenedores en un Pod terminan, el kubelet
los reinicia con un retraso de retroceso exponencial (10s, 20s, 40s,...), que
está limitado a
cinco minutos. Una vez que un contenedor se ha ejecutado durante 10 minutos sin
ningún problema, el
kubelet restablece el temporizador de reinicio para ese contenedor.
[Ciclo de vida de contenedores Sidecar y el Pod](/docs/concepts/workloads/pods/sidecar-containers/#sidecar-containers-and-pod-lifecycle)
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
  los [contenedores de inicio](/es/docs/concepts/workloads/pods/init-containers/)
  han terminado exitosamente.
* `Ready`: el Pod es capaz de recibir peticiones y debería ser agregado a los
  grupos de equilibrio de carga de todos los Services que coincidan.

| Nombre del campo     | Descripción                                                                                          |
|:---------------------|:-----------------------------------------------------------------------------------------------------|
| `type`               | Nombre de esta condición del Pod.                                                                    |
| `status`             | Indica si la condición es aplicable, con valores posibles "`True`", "`False`", ó "`Unknown`".        |
| `lastProbeTime`      | Marca de tiempo de cuando se probó por última vez la condición del Pod.                              |
| `lastTransitionTime` | Marca de tiempo de cuando el Pod hizo transición de un estado a otro.                                |
| `reason`             | Texto legible por máquina que indica el motivo de la última transición de la condición.              |
| `message`            | Mensaje legible por humanos indicando detalles acerca de la última transición de estado.             |

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
los [formatos de etiqueta](/es/docs/concepts/overview/working-with-objects/labels/#sintaxis-y-conjunto-de-caracteres)
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
Durante su desarrollo temprano, esta condición se llamó `PodHasNetwork`.
{{< /note >}}

Después de que un Pod es programado en un nodo, necesita ser admitido por el kubelet y
tener cualquier volumen de almacenamiento requerido montado.
Una vez que estas fases se completan,
el kubelet trabaja con
un runtime de contenedores (usando {{< glossary_tooltip term_id="cri" >}}) para configurar un
sandbox de runtime y configurar la red para el Pod.
Si la [puerta de características](/docs/reference/command-line-tools-reference/feature-gates/)
`PodReadyToStartContainersCondition`
 está habilitada
(está habilitada por defecto para Kubernetes {{< skew currentVersion >}}), la
condición `PodReadyToStartContainers` se agregará al campo `status.conditions` de un Pod.

La condición `PodReadyToStartContainers` se establece en `False` por el kubelet cuando detecta que un
Pod no tiene un sandbox de runtime con red configurada.
Esto ocurre en los siguientes escenarios:

- Al principio del ciclo de vida del Pod, cuando el kubelet aún no ha comenzado a configurar un sandbox para
el Pod usando el runtime de contenedores.
- Más adelante en el ciclo de vida del Pod, cuando el sandbox del Pod ha sido destruido debido a:
  - el nodo reiniciándose, sin que el Pod sea desalojado.
  - para runtimes de contenedores que usan máquinas virtuales para aislamiento, la máquina virtual del sandbox del Pod reiniciándose, lo que luego requiere crear un nuevo sandbox y
una nueva configuración de red para el contenedor.

La condición `PodReadyToStartContainers` se establece en `True` por el kubelet después de la
finalización exitosa de la creación del sandbox y la configuración de la red para el Pod
por el plugin de runtime. El kubelet puede comenzar a extraer imágenes de contenedores y crear
contenedores después de que la condición `PodReadyToStartContainers` se haya establecido en True.

Para un Pod con contenedores de inicialización, el kubelet establece la condición `Initialized` en
`True` después de que los contenedores de inicialización se hayan completado exitosamente (lo que ocurre
después de la creación exitosa del sandbox y la configuración de la red por el plugin de runtime).
Para un Pod sin contenedores de inicialización, el kubelet establece la condición `Initialized`
en `True` antes de que comience la creación del sandbox y la configuración de la red.

## Sondeos del contenedor {#container-probes}

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
la creación/bifurcación de múltiples procesos cada vez que se ejecuta.
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
complete. Si el sondeo falla, el kubelet mata el contenedor y el contenedor
está sujeto a su [política de reinicio](#restart-policy). Si un contenedor no
tiene un sondeo de inicio, el estado por defecto es `Success`.

Para mayor información sobre como configurar un sondeo liveness,
readiness o de startup, mira la
sección [Configurar una sonda Liveness, Readiness y Startup](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

#### ¿Cuándo debería utilizar un sondeo liveness?

Si el proceso en tu contenedor es capaz de terminar por sí mismo cuando
encuentra un error o deja de estar sano, no necesitas un sondeo liveness; el
kubelet automáticamente realizará la acción adecuada de acuerdo con la política
de reinicio `restartPolicy` del Pod.

Si te gustaría que tu contenedor fuese destruido y reiniciado si falla un
sondeo, especifica un sondeo liveness y especifica una `restartPolicy`
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
TERM.

Una vez que el período de gracia ha acabado,
se envía la señal KILL a cualquier proceso restante, y luego el Pod se elimina
del {{< glossary_tooltip text="Servidor API" term_id="kube-apiserver" >}}.
Si el kubelet o el tiempo de ejecución del contenedor del servicio que lo
administra se reinicia mientras espera que los procesos terminen, el kubelet
reintenta de nuevo el proceso incluyendo el periodo original de gracia.

Un flujo de finalización de un Pod, ilustrado con un ejemplo:

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
   un [hook](/es/docs/concepts/containers/container-lifecycle-hooks) `preStop` y
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
   el [estado de terminación](/es/docs/concepts/services-networking/endpoint-slices/#condiciones)
   de la API de EndpointSlice
   (y la API de Endpoint legada).
   Los endpoints que están terminando siempre tienen su estatus `ready`
   como `false` (para compatibilidad con versiones anteriores a 1.26), por lo
   que los balanceadores de carga no los usarán para tráfico regular.

   Si se necesita drenar el tráfico en un Pod que está terminando,
   el readiness se puede revisar con la condición `serving`.
   Puedes encontrar más detalles en cómo implementar drenado de conexiones en el
   tutorial [Pods y flujo de terminación de Endpoints](/docs/tutorials/services/pods-and-endpoint-termination-flow/)

<a id="pod-termination-beyond-grace-period" />

1. El kubelet se asegura que el Pod se ha apagado y terminado
   1. Cuando finaliza el tiempo de gracia, si aún existe algún contenedor ejecutándose en el Pod, el kubelet lanza un apagado forzado. 
    El runtime del contenedor envía una señal `SIGKILL` a cualquier proceso ejecutándose en cualquier contenedor en el Pod. 
    El kubelet también limpia un contenedor `pause` oculto si ese contenedor usa uno.
   1. El kubelet hace la transición del Pod a una fase terminal (`Failed` ó `Succeeded` dependiendo del estado final de sus contenedores).
   1. El Kubelet lanza la eliminación forzosa de los objetos del Pod del servidor API, estableciendo el periodo de gracia a 0 (detención inmediata).
   1. El servidor API elimina el objeto API del Pod, que ya no es visible desde ningún cliente.

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

Usando kubectl, debes especificar una opción adicional `--force` junto con `--grace-period=0`
para realizar eliminaciones forzadas.

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
para [borrar Pods de un StatefulSet](/es/docs/tasks/run-application/force-delete-stateful-set-pod/).

### Terminación del Pod y contenedores sidecar {##termination-with-sidecars}

Si tus Pods incluyen uno o más [contenedores sidecar](/docs/concepts/workloads/pods/sidecar-containers/) (contenedores de inicialización con una política de reinicio `Always`), el kubelet retrasará el envío de la señal TERM a estos contenedores sidecar hasta que el último contenedor principal se haya terminado completamente.
Los contenedores sidecar serán eliminados en orden inverso al que se han definido en la especificación del Pod.
Esto asegura que los contenedores sidecar continúan sirviendo a los otros contenedores en el Pod hasta que ya no se necesiten.

Esto significa que la terminación lenta de un contenedor principal también retrasará la terminación de los contenedores sidecar.

Si el periodo de gracia expira antes que se complete el proceso de terminación, el Pod podría entrar en [terminación forzada](#pod-termination-beyond-grace-period).
En este caso, todos los contenedores restantes en el Pod serán terminados simultáneamente con un periodo de gracia corto.

De forma similar, si el Pod tiene un hook `preStop` que excede el periodo de gracia de finalización, puede ocurrir una terminación de emergencia.
En general, si has usado hooks de `preStop` para controlar el orden de terminación sin contenedores sidecar, puedes quitarlos y permitir que el kubelet maneje la terminación de sidecars automáticamente.

### Recolección de elementos no utilizados de los Pods {#pod-garbage-collection}

Cuando los Pods fallan,
los objetos API permanecen en el clúster hasta que un humano o el proceso de
{{< glossary_tooltip term_id="controller" text="controlador" >}} los elimine
explícitamente.

El recolector de elementos no utilizados (PodGC en inglés) es un controlador en
el plano de control que elimina los Pods que se han terminado (con una fase
de `Succeeded` o `Failed`), cuando el número de Pods excede el umbral
configurado (determinado por `terminated-pod-gc-threshold` en el controlador de
kube-controller-manager).
Esto evita la fuga de recursos mientras que los Pods se crean y se eliminan en
el tiempo.

Adicionalmente,
el PodGC limpia cualquier Pod que satisfaga cualquiera de las siguientes
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
  [agregando controladores a los eventos del ciclo de vida del contenedor](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Obtén experiencia práctica
  [configurando sondas de Liveness, Readiness y Startup](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

* Aprende más sobre [hooks del ciclo de vida del contenedor](/es/docs/concepts/containers/container-lifecycle-hooks/).

* Aprende más sobre [contenedores sidecar](/docs/concepts/workloads/pods/sidecar-containers/).

* Para información detallada sobre el estatus del contenedor del Pod en la API,
  mira la documentación de referencia de la API que cubre el [`status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus) del Pod.