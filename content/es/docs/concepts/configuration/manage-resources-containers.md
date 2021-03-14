---
title: Administrando los recursos de los contenedores
content_type: concept
weight: 40
feature:
  title: Bin packing automático
  description: >
    Coloca los contenedores automáticamente en base a los recursos solicitados y otras limitaciones, mientras no se afecte la
    disponibilidad. Combina cargas críticas y best-effort para mejorar el uso y ahorrar recursos.
---

<!-- overview -->

Cuando especificas un {{< glossary_tooltip term_id="pod" >}}, opcionalmente puedes especificar
los recursos que necesita un {{< glossary_tooltip text="Contenedor" term_id="container" >}}.
Los recursos que normalmente se definen son CPU y memoria (RAM);  pero hay otros.

Cuando especificas el recurso _request_  para  Contenedores en un {{< glossary_tooltip term_id="pod" >}}, 
el {{< glossary_tooltip text="Scheduler de Kubernetes " term_id="kube-scheduler" >}} usa esta información para decidir en qué nodo colocar el {{< glossary_tooltip term_id="pod" >}}.
Cuando especificas el recurso _limit_ para un Contenedor, Kubelet impone estos límites, así que el contenedor no
puede utilizar más recursos que el límite que le definimos. Kubelet también reserva al menos la cantidad
especificada en _request_ para el contenedor.




<!-- body -->

## Peticiones y límites

Si el nodo donde está corriendo un pod tiene suficientes recursos disponibles, es posible 
(y válido) que el {{< glossary_tooltip text="contenedor" term_id="container" >}} utilice más recursos de los especificados en `request`.
Sin embargo, un {{< glossary_tooltip text="contenedor" term_id="container" >}} no está autorizado a utilizar más de lo especificado en `limit`.

Por ejemplo, si configuras una petición de `memory` de 256 MiB  para un {{< glossary_tooltip text="contenedor" term_id="container" >}}, y ese contenedor está
en un {{< glossary_tooltip term_id="pod" >}} colocado en un nodo con 8GiB de memoria y no hay otros {{< glossary_tooltip term_id="pods" >}}, entonces el contenedor puede intentar usar
más RAM.

Si configuras un límite de `memory` de 4GiB  para el contenedor, {{< glossary_tooltip text="kubelet" term_id="kubelet" >}})
 (y
{{< glossary_tooltip text="motor de ejecución del contenedor" term_id="container-runtime" >}})  impone el límite.
El Runtime evita que el {{< glossary_tooltip text="contenedor" term_id="container" >}} use más recursos de los configurados en el límite. Por ejemplo: 
cuando un proceso en el {{< glossary_tooltip text="contenedor" term_id="container" >}} intenta consumir más cantidad de memoria de la permitida,
el Kernel del sistema termina el proceso que intentó la utilización de la memoria, con un error de out of memory (OOM).

Los límites se pueden implementar de forma reactiva (el sistema interviene cuando ve la violación)
o por imposición (el sistema previene al contenedor de exceder el límite). Diferentes Runtimes pueden tener distintas
implementaciones a las mismas restricciones.

{{< note >}}
Si un contenedor especifica su propio límite de memoria, pero no especifica la petición de memoria, Kubernetes
automáticamente asigna una petición de memoria igual a la del límite. De igual manera, si un contenedor especifica su propio límite de CPU, pero no especifica una petición de CPU, Kubernetes automáticamente asigna una petición de CPU igual a la especificada en el límite.
{{< /note >}}

## Tipos de recursos

*CPU* y *memoria* son cada uno un *tipo de recurso*. Un tipo de recurso tiene una unidad base.
CPU representa procesos de computación y es especificada en unidades de [Kubernetes CPUs](#meaning-of-cpu).
Memoria es especificada en unidades de bytes.
Si estás usando Kubernetes v1.14 o posterior, puedes especificar recursos _huge page_.
Huge pages son una característica de Linux específica donde el kernel del nodo asigna bloques
de memoria que son más grandes que el tamaño de paginación por defecto.

Por ejemplo, en un sistema donde el tamaño de paginación por defecto es de 4KiB, podrías
especificar un límite, `hugepages-2Mi: 80Mi`. Si el contenedor intenta asignar
 más de 40 2MiB huge pages (un total de 80 MiB), la asignación fallará.

{{< note >}}
No se pueden sobreasignar recursos `hugepages-*`.
A diferencia de los recursos de `memoria` y `cpu`.
{{< /note >}}

CPU y memoria son colectivamente conocidos como *recursos de computación*,  o simplemente como 
*recursos*.  Los recursos de computación son cantidades medibles que pueden ser solicitadas, asignadas
y consumidas. Son distintas a los [Recursos API](/docs/concepts/overview/kubernetes-api/). Los recursos API , como {{< glossary_tooltip text="Pods" term_id="pod" >}} y 
[Services](/docs/concepts/services-networking/service/) son objetos que pueden ser leídos y modificados
a través de la API de Kubernetes.

## Peticiones y límites de recursos de Pods y Contenedores

Cada contenedor de un Pod puede especificar uno o más de los siguientes:

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.limits.hugepages-<size>`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`
* `spec.containers[].resources.requests.hugepages-<size>`

Aunque las peticiones y límites pueden ser especificadas solo en contenedores individuales, es conveniente hablar
sobre los recursos de peticiones y límites del Pod. Un *limite/petición
 de recursos de un Pod* para un tipo de recurso particular es la suma de
peticiones/límites de cada tipo para cada contenedor del Pod.

## Unidades de recursos en Kubernetes

### Significado de CPU

Límites y peticiones para recursos de CPU son medidos en unidades de *cpu*.
Una cpu, en Kubernetes, es equivalente a **1 vCPU/Core**  para proveedores de cloud y **1 hyperthread** en procesadores bare-metal Intel.

Las peticiones fraccionadas están permitidas. Un contenedor con `spec.containers[].resources.requests.cpu` de `0.5` tiene garantizada la mitad, tanto
CPU como otro que requiere 1 CPU. La expresión `0.1` es equivalente a la expresión `100m`, que puede ser leída como "cien millicpus". Algunas personas dicen
"cienmilicores", y se entiende que quiere decir lo mismo. Una solicitud con un punto decimal, como `0.1`,  es convertido a `100m` por la API, y no se permite
 una precisión mayor que `1m`. Por esta razón, la forma `100m` es la preferente.
CPU es siempre solicitada como una cantidad absoluta, nunca como una cantidad relativa;
0.1 es la misma cantidad de cpu que un core-simple, dual-core, o máquina de 48-core.

### Significado de memoria

Los límites y peticiones de `memoria` son medidos en bytes. Puedes expresar la memoria como
un número entero o como un número decimal usando alguno de estos sufijos:
E, P, T, G, M, K. También puedes usar los equivalentes en potencia de dos: Ei, Pi, Ti, Gi,
Mi, Ki. Por ejemplo, los siguientes valores representan lo mismo:

```shell
128974848, 129e6, 129M, 123Mi
```

Aquí un ejemplo.
El siguiente {{< glossary_tooltip text="Pod" term_id="pod" >}} tiene dos contenedores. Cada contenedor tiene una petición de 0.25 cpu
y 64MiB (2<sup>26</sup> bytes) de memoria. Cada contenedor tiene un límite de 0.5 cpu
y 128MiB de memoria. Puedes decirle al Pod que solicite 0.5 cpu y 128MiB de memoria 
y un límite de 1 cpu y 256MiB de memoria.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## Cómo son programados los Pods con solicitudes de recursos

Cuando creas un {{< glossary_tooltip text="Pod" term_id="pod" >}}, el  {{< glossary_tooltip text="planificador de Kubernetes " term_id="kube-scheduler" >}} determina el nodo para correr dicho {{< glossary_tooltip text="Pod" term_id="pod" >}}.
Cada nodo tiene una capacidad máxima para cada tipo de recurso:
la cantidad de CPU y memoria que dispone para los Pods. El {{< glossary_tooltip text="planificador de Kubernetes" term_id="kube-scheduler" >}} se asegura de que,
 para cada tipo de recurso, la suma de los recursos solicitados de los contenedores programados sea menor a la capacidad del nodo. Cabe mencionar que aunque la memoria actual o CPU
en uso de los nodos sea muy baja, el {{< glossary_tooltip text="planificador" term_id="kube-scheduler" >}} todavía rechaza programar un {{< glossary_tooltip text="Pod" term_id="pod" >}} en un nodo si
la comprobación de capacidad falla. Esto protege contra escasez de recursos en un nodo
cuando el uso de recursos posterior crece, por ejemplo, durante un pico diario de
solicitud de  recursos.

## Cómo corren los Pods con límites de recursos

Cuando el {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} inicia un {{< glossary_tooltip text="contenedor" term_id="container" >}} de un {{< glossary_tooltip text="Pod" term_id="pod" >}}, este pasa los límites de CPU y
memoria al {{< glossary_tooltip text="runtime del contenedor" term_id="container-runtime" >}}.

Cuando usas Docker:

- El `spec.containers[].resources.requests.cpu` es convertido a su valor interno,
  el cuál es fraccional, y multiplicado por 1024. El mayor valor de este número o
  2 es usado por el valor de 
  [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#cpu-share-constraint)
  en el comando `docker run`.

- El `spec.containers[].resources.limits.cpu` se convierte a su valor en milicore y 
  multiplicado por 100. El resultado es el tiempo total de CPU que un contenedor puede usar
  cada 100ms. Un contenedor no puede usar más tiempo de CPU que del solicitado durante este intervalo.

  {{< note >}}
  El período por defecto es de 100ms. La resolución mínima de cuota mínima es 1ms.
  {{</ note >}}

- El `spec.containers[].resources.limits.memory` se convierte a entero, y 
  se usa como valor de 
  [`--memory`](https://docs.docker.com/engine/reference/run/#/user-memory-constraints)
  del comando  `docker run`.

Si el {{< glossary_tooltip text="contenedor" term_id="container" >}} excede su límite de memoria, este quizá se detenga. Si es reiniciable,
el {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} lo reiniciará, así como cualquier otro error.

Si un Contenedor excede su petición de memoria, es probable que ese Pod sea
desalojado en cualquier momento que el nodo se quede sin memoria.

Un Contenedor puede o no tener permitido exceder el límite de CPU por
algunos períodos de tiempo. Sin embargo, esto no lo destruirá por uso excesivo de CPU.

Para conocer cuando un Contenedor no puede ser programado o será destruido debido a 
límite de recursos, revisa la sección de [Troubleshooting](#troubleshooting).

### Monitorización del uso de recursos de computación y memoria.

El uso de recursos de un Pod es reportado como parte del estado del Pod.

Si [herramientas opcionales para monitorización](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
están disponibles en tu cluster, entonces el uso de recursos del Pod puede extraerse directamente de
[Métricas API](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#the-metrics-api)
o desde tus herramientas de monitorización.

## Almacenamiento local efímero

<!-- feature gate LocalStorageCapacityIsolation -->
{{< feature-state for_k8s_version="v1.10" state="beta" >}}

Los nodos tienen almacenamiento local efímero, respaldado por
dispositivos de escritura agregados o, a veces, por RAM.
"Efímero" significa que no se garantiza la durabilidad a largo plazo.
.
Los Pods usan el almacenamiento local efímero para añadir espacio, caché, y para logs.
Kubelet puede proveer espacio añadido a los Pods usando almacenamiento local efímero para
montar [`emptyDir`](/docs/concepts/storage/volumes/#emptydir)
 {{< glossary_tooltip term_id="volume" text="volumes" >}} en los contenedores.

Kubelet también usa este tipo de almacenamiento para guardar
[logs de contenedores a nivel de nodo](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level),
imágenes de contenedores, y la capa de escritura de los contenedores.

{{< caution >}}
Si un nodo falla, los datos en el almacenamiento efímero se pueden perder.
Tus aplicaciones no pueden esperar ningun SLA (IOPS de disco, por ejemplo)
del almacenamiento local efímero.
{{< /caution >}}

Como característica beta, Kubernetes te deja probar, reservar y limitar la cantidad
de almacenamiento local efímero que un Pod puede consumir.

### Configuraciones para almacenamiento local efímero

Kubernetes soporta 2 maneras de configurar el almacenamiento local efímero en un nodo:
{{< tabs name="local_storage_configurations" >}}
{{% tab name="Single filesystem" %}}
En esta configuración, colocas todos los tipos de datos (`emptyDir` volúmenes, capa de escritura,
imágenes de contenedores, logs) en un solo sistema de ficheros.
La manera más efectiva de configurar Kubelet es dedicando este sistema de archivos para los datos de Kubernetes (kubelet).

Kubelet también escribe 
[logs de contenedores a nivel de nodo](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
y trata estos de manera similar al almacenamiento efímero.

Kubelet escribe logs en ficheros dentro del directorio de logs (por defecto `/var/log`
); y tiene un directorio base para otros datos almacenados localmente
(`/var/lib/kubelet` por defecto).

Por lo general, `/var/lib/kubelet` y `/var/log`  están en el sistema de archivos de root,
y Kubelet es diseñado con ese objetivo en mente.

Tu nodo puede tener tantos otros sistema de archivos, no usados por Kubernetes,
como quieras.
{{% /tab %}}
{{% tab name="Two filesystems" %}}
Tienes un sistema de archivos en el nodo que estás usando para datos efímeros que
provienen de los Pods corriendo: logs, y volúmenes `emptyDir`.
Puedes usar este sistema de archivos para otros datos (por ejemplo: logs del sistema no relacionados
 con Kubernetes); estos pueden ser incluso del sistema de archivos root.

Kubelet también escribe
[logs de contenedores a nivel de nodo](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
en el primer sistema de archivos, y trata estos de manera similar al almacenamiento efímero.

También usas un sistema de archivos distinto, respaldado por un dispositivo de almacenamiento lógico diferente.
En esta configuración, el directorio donde le dices a Kubelet que coloque
las capas de imágenes de los contenedores y capas de escritura es este segundo sistema de archivos.

El primer sistema de archivos no guarda ninguna capa de imágenes o de escritura.

Tu nodo puede tener tantos sistemas de archivos, no usados por Kubernetes, como quieras.
{{% /tab %}}
{{< /tabs >}}

Kubelet puede medir la cantidad de almacenamiento local que se está usando. Esto es posible por:

- el `LocalStorageCapacityIsolation`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  está habilitado (esta caracterísitca está habilitada por defecto), y
- has configurado el nodo usando una de las configuraciones soportadas
  para almacenamiento local efímero..

Si tienes una configuración diferente, entonces Kubelet no aplica límites de recursos
para almacenamiento local efímero.

{{< note >}}
Kubelet rastrea `tmpfs` volúmenes emptyDir como uso de memoria de contenedor, en lugar de
almacenamiento local efímero.
{{< /note >}}

### Configurando solicitudes y límites para almacenamiento local efímero

Puedes usar _ephemeral-storage_ para manejar almacenamiento local efímero. Cada contenedor de un Pod puede especificar
uno o más de los siguientes:

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

Los límites y solicitudes para `almacenamiento-efímero` son medidos en bytes. Puedes expresar el almacenamiento 
como un numero entero o flotante usando los siguientes sufijos:
E, P, T, G, M, K. También puedes usar las siguientes equivalencias: Ei, Pi, Ti, Gi,
Mi, Ki. Por ejemplo, los siguientes representan el mismo valor:

```shell
128974848, 129e6, 129M, 123Mi
```

En el siguiente ejemplo, el Pod tiene dos contenedores. Cada contenedor tiene una petición de 2GiB de almacenamiento local efímero. Cada
contenedor tiene un límite de 4GiB de almacenamiento local efímero. Sin embargo, el Pod tiene una petición de 4GiB de almacenamiento efímero
, y un límite de 8GiB de almacenamiento local efímero.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
```

### Como son programados los Pods con solicitudes de almacenamiento efímero

Cuando creas un Pod, el planificador de Kubernetes selecciona un nodo para el Pod donde sera creado.
Cada nodo tiene una cantidad máxima de almacenamiento local efímero que puede proveer a los Pods. Para
más información, mira [Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

El planificador se asegura de que el total de los recursos solicitados para los contenedores sea menor que la capacidad del nodo.

### Manejo del consumo de almacenamiento efímero {#resource-emphemeralstorage-consumption}

Si Kubelet está manejando el almacenamiento efímero local como un recurso, entonces
Kubelet mide el uso de almacenamiento en:

- volúmenes `emptyDir`, excepto _tmpfs_  volúmenes`emptyDir` 
- directorios que guardan logs de nivel de nodo
- capas de escritura de contenedores

Si un Pod está usando más almacenamiento efímero que el permitido, Kubelet
establece una señal de desalojo que desencadena el desalojo del Pod.

Para aislamiento a nivel de contenedor, si una capa de escritura del contenedor y 
logs excede el límite de uso del almacenamiento, Kubelet marca el Pod para desalojo.

Para aislamiento a nivel de Pod, Kubelet calcula un límite de almacenamiento 
general para el Pod sumando los límites de los contenedores de ese Pod.
En este caso, si la suma del uso de almacenamiento local efímero para todos los contenedores
y los volúmenes `emptyDir` de los Pods excede el límite de almacenamiento general del
Pod, Kubelet marca el Pod para desalojo.

{{< caution >}}
Si Kubelet no está midiendo el almacenamiento local efímero, entonces el Pod
que excede este límite de almacenamiento, no será desalojado para liberar 
el límite del recurso de almacenamiento.

Sin embargo, si el espacio del sistema de archivos para la capa de escritura del contenedor,
logs a nivel de nodo o volúmenes `emptyDir` decae, el 
{{< glossary_tooltip text="taints" term_id="taint" >}}  del nodo lanza la desalojo para 
cualquier Pod que no tolere dicho taint. 

Mira las [configuraciones soportadas](#configurations-for-local-ephemeral-storage)
para almacenamiento local efímero.
{{< /caution >}}

Kubelet soporta diferentes maneras de medir el uso de almacenamiento del Pod:


{{< tabs name="resource-emphemeralstorage-measurement" >}}
{{% tab name="Periodic scanning" %}}
Kubelet realiza frecuentemente, verificaciones programadas que revisan cada
volumen `emptyDir`, directorio de logs del contenedor, y capa de escritura
del contenedor.

El escáner mide cuanto espacio está en uso.

{{< note >}}
En este modo, Kubelet no rastrea descriptores de archivos abiertos 
para archivos eliminados.

Si tú (o un contenedor) creas un archivo dentro de un volumen `emptyDir`,
y algo mas abre ese archivo, y tú lo borras mientras este está abierto,
entonces el inodo para este fichero borrado se mantiene hasta que cierras
el archivo, pero Kubelet no cataloga este espacio como en uso.
{{< /note >}}
{{% /tab %}}
{{% tab name="Filesystem project quota" %}}

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

Las cuotas de proyecto están en las características de nivel de sistema operativo
para el manejo de uso de almacenamiento en uso de sistema de archivos.
Con kubernetes, puedes habilitar las cuotas de proyecto para el uso
de la monitorización del almacenamiento. Asegúrate que el respaldo del
Sistema de archivos de los volúmenes `emptyDir` , en el nodo, provee soporte de
cuotas de proyecto.
Por ejemplo, XFS y ext4fs ofrecen cuotas de proyecto.

{{< note >}}
Las cuotas de proyecto te permiten monitorear el uso del almacenamiento; no 
fuerzan los límites.
{{< /note >}}

Kubernetes usa IDs de proyecto empezando por `1048576`. Los IDs en uso
son registrados en `/etc/projects` y `/etc/projid`. Si los IDs de proyecto
en este rango son usados para otros propósitos en el sistema, esos IDs 
de proyecto deben ser registrados en `/etc/projects` y `/etc/projid` para 
que Kubernetes no los use.

Las cuotas son más rápidas y más precisas que el escáner de directorios. 
Cuando un directorio es asignado a un proyecto, todos los ficheros creados 
bajo un directorio son creados en ese proyecto, y el kernel simplemente
tiene que mantener rastreados cuántos bloques están en uso por ficheros
en ese proyecto. Si un fichero es creado y borrado, pero tiene un fichero abierto,
continúa consumiendo espacio. El seguimiento de cuotas registra ese espacio 
con precisión mientras que los escaneos de directorios pasan por alto 
el almacenamiento utilizado por los archivos eliminados
 
Si quieres usar cuotas de proyecto, debes:

* Habilitar el `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  en la configuración del kubelet.

* Asegúrese de que el sistema de archivos raíz (o el sistema de archivos en tiempo de ejecución opcional)
  tiene las cuotas de proyectos habilitadas. Todos los sistemas de archivos XFS admiten cuotas de proyectos.
  Para los sistemas de archivos ext4, debe habilitar la función de seguimiento de cuotas del proyecto
  mientras el sistema de archivos no está montado.

  ```bash
  # For ext4, with /dev/block-device not mounted
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

* Asegúrese de que el sistema de archivos raíz (o el sistema de archivos de tiempo de ejecución opcional) esté
  montado con cuotas de proyecto habilitadas. Tanto para XFS como para ext4fs, la opción de montaje 
  se llama `prjquota`.

{{% /tab %}}
{{< /tabs >}}

## Recursos extendidos

Los recursos extendidos son nombres de recursos calificados fuera del
dominio `kubernetes.io`. Permiten que los operadores de clústers publiciten y los usuarios
consuman los recursos no integrados de Kubernetes.

Hay dos pasos necesarios para utilizar los recursos extendidos. Primero, el operador del clúster
debe anunciar un Recurso Extendido. En segundo lugar, los usuarios deben solicitar
el Recurso Extendido en los Pods.

### Manejando recursos extendidos

#### Recursos extendido a nivel de nodo

Los recursos extendidos a nivel de nodo están vinculados a los nodos

##### Device plugin managed resources
Mira [Plugins de
Dispositivos](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
para percibir como los plugins de dispositivos manejan los recursos
en cada nodo.

##### Otros recursos

Para anunciar un nuevo recurso extendido a nivel de nodo, el operador del clúster puede
enviar una solicitud HTTP `PATCH` al servidor API para especificar la cantidad 
disponible en el `status.capacity` para un nodo en el clúster. Después de esta
operación, el `status.capacity` del nodo incluirá un nuevo recurso. El campo 
`status.allocatable` se actualiza automáticamente con el nuevo recurso
de forma asíncrona por el {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}. Tenga en cuenta que debido a que el {{< glossary_tooltip text="planificador" term_id="kube-scheduler" >}}
utiliza el valor de `status.allocatable` del nodo cuando evalúa la aptitud del {{< glossary_tooltip text="Pod" term_id="pod" >}}, puede haber un breve
retraso entre parchear la capacidad del nodo con un nuevo recurso y el primer Pod
que solicita el recurso en ese nodo.

**Ejemplo:**

Aquí hay un ejemplo que muestra cómo usar `curl` para formar una solicitud HTTP que
anuncia cinco recursos "example.com/foo" en el nodo `k8s-node-1` cuyo nodo master
es `k8s-master`.

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

{{< note >}}
En la solicitud anterior, `~ 1` es la codificación del carácter` / `
en la ruta del parche. El valor de la ruta de operación en JSON-Patch se interpreta como un
puntero JSON. Para obtener más detalles, consulte
[IETF RFC 6901, sección 3](https://tools.ietf.org/html/rfc6901#section-3).
{{< /note >}}

#### Recursos extendidos a nivel de Clúster

Los recursos extendidos a nivel de clúster no están vinculados a los nodos. Suelen estar gestionados
por extensores del scheduler, que manejan el consumo de recursos y la cuota de recursos.

Puedes especificar los recursos extendidos que son mantenidos por los extensores del scheduler en
[configuración de políticas del scheduler](https://github.com/kubernetes/kubernetes/blob/release-1.10/pkg/scheduler/api/v1/types.go#L31).

**Ejemplo:**

La siguiente configuración para una política del scheduler indica que el
recurso extendido a nivel de clúster "example.com/foo" es mantenido 
por el extensor del scheduler.

- El scheduler envía un Pod al extensor del scheduler solo si la solicitud del Pod "example.com/foo".
- El campo `ignoredByScheduler` especifica que el schduler no compruba el recurso
  "example.com/foo"  en su predicado `PodFitsResources`.

```json
{
  "kind": "Policy",
  "apiVersion": "v1",
  "extenders": [
    {
      "urlPrefix":"<extender-endpoint>",
      "bindVerb": "bind",
      "managedResources": [
        {
          "name": "example.com/foo",
          "ignoredByScheduler": true
        }
      ]
    }
  ]
}
```

### Consumiendo recursos extendidos

Los usuarios pueden consumir recursos extendidos en las especificaciones del Pod, como la CPU y la memoria.
El {{< glossary_tooltip text="planificador" term_id="kube-scheduler" >}} se encarga de la contabilidad de recursos para que no más de
la cantidad disponible sea asignada simultáneamente a los Pods.

El servidor de API restringe las cantidades de recursos extendidos a números enteros.
Ejemplos de cantidades _validas_ son `3`,` 3000m` y `3Ki`. Ejemplos de
_cantidades no válidas_ son `0.5` y` 1500m`.

{{< note >}}
Los recursos extendidos reemplazan los Recursos Integrales Opacos.
Los usuarios pueden usar cualquier otro prefijo de dominio que `kubernetes.io`
tenga reservado.
{{< /note >}}

Para consumir un recurso extendido en un Pod, incluye un nombre de recurso
como clave en `spec.containers[].resources.limits` en las especificaciones del contenedor.

{{< note >}}
Los Recursos Extendidos no pueden ser sobreescritos, así que solicitudes y límites
deben ser iguales si ambos están presentes en las especificaciones de un contenedor.
{{< /note >}}

Un pod se programa solo si se satisfacen todas las solicitudes de recursos, incluidas
CPU, memoria y cualquier recurso extendido. El {{< glossary_tooltip text="Pod" term_id="pod" >}} permanece en estado `PENDING`
siempre que no se pueda satisfacer la solicitud de recursos.

**Ejemplo:**

El siguiente {{< glossary_tooltip text="Pod" term_id="pod" >}} solicita 2CPUs y 1 "example.com/foo" (un recurso extendido).

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: myimage
    resources:
      requests:
        cpu: 2
        example.com/foo: 1
      limits:
        example.com/foo: 1
```

## Solución de problemas

### Mis Pods están en estado pendiente con un mensaje de failedScheduling

Si el {{< glossary_tooltip text="planificador" term_id="kube-scheduler" >}} no puede encontrar ningún nodo donde pueda colocar un {{< glossary_tooltip text="Pod" term_id="pod" >}}, el {{< glossary_tooltip text="Pod" term_id="pod" >}} permanece
no programado hasta que se pueda encontrar un lugar. Se produce un evento cada vez que
el {{< glossary_tooltip text="planificador" term_id="kube-scheduler" >}} no encuentra un lugar para el {{< glossary_tooltip text="Pod" term_id="pod" >}}, como este:

```shell
kubectl describe pod frontend | grep -A 3 Events
```
```
Events:
  FirstSeen LastSeen   Count  From          Subobject   PathReason      Message
  36s   5s     6      {scheduler }              FailedScheduling  Failed for reason PodExceedsFreeCPU and possibly others
```
En el ejemplo anterior, el Pod llamado "frontend" no se puede programar debido a
recursos de CPU insuficientes en el nodo. Mensajes de error similares también pueden sugerir
fallo debido a memoria insuficiente (PodExceedsFreeMemory). En general, si un Pod
está pendiente con un mensaje de este tipo, hay varias cosas para probar:

- Añadir más nodos al clúster.
- Terminar Pods innecesarios para hacer hueco a los Pods en estado pendiente.
- Compruebe que el Pod no sea más grande que todos los nodos. Por ejemplo, si todos los
  los nodos tienen una capacidad de `cpu: 1`, entonces un Pod con una solicitud de` cpu: 1.1`
  nunca se programará.

Puedes comprobar las capacidades del nodo y cantidad utilizada con el comando 
`kubectl describe nodes`. Por ejemplo:

```shell
kubectl describe nodes e2e-test-node-pool-4lw4
```
```
Name:            e2e-test-node-pool-4lw4
[ ... lines removed for clarity ...]
Capacity:
 cpu:                               2
 memory:                            7679792Ki
 pods:                              110
Allocatable:
 cpu:                               1800m
 memory:                            7474992Ki
 pods:                              110
[ ... lines removed for clarity ...]
Non-terminated Pods:        (5 in total)
  Namespace    Name                                  CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ---------    ----                                  ------------  ----------  ---------------  -------------
  kube-system  fluentd-gcp-v1.38-28bv1               100m (5%)     0 (0%)      200Mi (2%)       200Mi (2%)
  kube-system  kube-dns-3297075139-61lj3             260m (13%)    0 (0%)      100Mi (1%)       170Mi (2%)
  kube-system  kube-proxy-e2e-test-...               100m (5%)     0 (0%)      0 (0%)           0 (0%)
  kube-system  monitoring-influxdb-grafana-v4-z1m12  200m (10%)    200m (10%)  600Mi (8%)       600Mi (8%)
  kube-system  node-problem-detector-v0.1-fj7m3      20m (1%)      200m (10%)  20Mi (0%)        100Mi (1%)
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests    CPU Limits    Memory Requests    Memory Limits
  ------------    ----------    ---------------    -------------
  680m (34%)      400m (20%)    920Mi (11%)        1070Mi (13%)
```

EN la salida anterior, puedes ver si una solicitud de Pod mayor que 1120m
CPUs o 6.23Gi de memoria, no cabrán en el nodo.

Echando un vistazo a la sección `Pods`, puedes ver qué Pods están ocupando espacio
en el nodo.

La cantidad de recursos disponibles para los pods es menor que la capacidad del nodo, porque
los demonios del sistema utilizan una parte de los recursos disponibles. El campo `allocatable`
[NodeStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#nodestatus-v1-core)
indica la cantidad de recursos que están disponibles para los Pods. Para más información, mira 
[Node Allocatable Resources](https://git.k8s.io/community/contributors/design-proposals/node/node-allocatable.md).

La característica [resource quota](/docs/concepts/policy/resource-quotas/) se puede configurar
para limitar la cantidad total de recursos que se pueden consumir. Si se usa en conjunto
con espacios de nombres, puede evitar que un equipo acapare todos los recursos.

### Mi contenedor está terminado

Es posible que su contenedor se cancele porque carece de recursos. Para verificar
si un contenedor está siendo eliminado porque está alcanzando un límite de recursos, ejecute
`kubectl describe pod` en el Pod de interés:

```shell
kubectl describe pod simmemleak-hra99
```
```
Name:                           simmemleak-hra99
Namespace:                      default
Image(s):                       saadali/simmemleak
Node:                           kubernetes-node-tf0f/10.240.216.66
Labels:                         name=simmemleak
Status:                         Running
Reason:
Message:
IP:                             10.244.2.75
Replication Controllers:        simmemleak (1/1 replicas created)
Containers:
  simmemleak:
    Image:  saadali/simmemleak
    Limits:
      cpu:                      100m
      memory:                   50Mi
    State:                      Running
      Started:                  Tue, 07 Jul 2015 12:54:41 -0700
    Last Termination State:     Terminated
      Exit Code:                1
      Started:                  Fri, 07 Jul 2015 12:54:30 -0700
      Finished:                 Fri, 07 Jul 2015 12:54:33 -0700
    Ready:                      False
    Restart Count:              5
Conditions:
  Type      Status
  Ready     False
Events:
  FirstSeen                         LastSeen                         Count  From                              SubobjectPath                       Reason      Message
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {scheduler }                                                          scheduled   Successfully assigned simmemleak-hra99 to kubernetes-node-tf0f
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   pulled      Pod container image "k8s.gcr.io/pause:0.8.0" already present on machine
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   created     Created with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   started     Started with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    spec.containers{simmemleak}         created     Created with docker id 87348f12526a
```

En el ejemplo anterior, `Restart Count:  5` indica que el contenedor `simmemleak`
del Pod se reinició cinco veces.

Puedes ejecutar `kubectl get pod` con la opción `-o go-template=...` para extraer el estado 
previos de los Contenedores terminados:

```shell
kubectl get pod -o go-template='{{range.status.containerStatuses}}{{"Container Name: "}}{{.name}}{{"\r\nLastState: "}}{{.lastState}}{{end}}'  simmemleak-hra99
```
```
Container Name: simmemleak
LastState: map[terminated:map[exitCode:137 reason:OOM Killed startedAt:2015-07-07T20:58:43Z finishedAt:2015-07-07T20:58:43Z containerID:docker://0e4095bba1feccdfe7ef9fb6ebffe972b4b14285d5acdec6f0d3ae8a22fad8b2]]
```

Puedes ver que el Contenedor fué terminado a causa de `reason:OOM Killed`, donde `OOM` indica una falta de memoria.






## {{% heading "whatsnext" %}}


* Obtén experiencia práctica [assigning Memory resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/).

* Obtén experiencia práctica [assigning CPU resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).

* Para más detalles sobre la diferencia entre solicitudes y límites, mira
  [Resource QoS](https://git.k8s.io/community/contributors/design-proposals/node/resource-qos.md).

* Lee [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core) referencia de API

* Lee [ResourceRequirements](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcerequirements-v1-core) referencia de API

* Lee sobre [project quotas](https://xfs.org/docs/xfsdocs-xml-dev/XFS_User_Guide/tmp/en-US/html/xfs-quotas.html) en XFS
