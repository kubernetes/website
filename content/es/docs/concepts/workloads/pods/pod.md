---
reviewers:
title: Pods
content_type: concept
weight: 20
---

<!-- overview -->

Los _Pods_ son las unidades de computación desplegables más pequeñas que se pueden crear y gestionar en Kubernetes.




<!-- body -->

## ¿Qué és un Pod?

Un _Pod_ (como en una vaina de ballenas o vaina de guisantes) es un grupo de uno o más contenedores (como contenedores Docker), con almacenamiento/red compartidos, y unas especificaciones de cómo ejecutar los contenedores. Los contenidos de un Pod son siempre coubicados, coprogramados y ejecutados en un contexto compartido. Un Pod modela un "host lógico" específico de la aplicación: contiene uno o más contenedores de aplicaciones relativamente entrelazados. Antes de la llegada de los contenedores, ejecutarse en la misma máquina física o virtual significaba ser ejecutado en el mismo host lógico.

Mientras que Kubernetes soporta más {{<glossary_tooltip text="runtimes de contenedores" term_id="container-runtime">}} a parte de Docker, este último es el más conocido y ayuda a describir Pods en términos de Docker.

El contexto compartido de un Pod es un conjunto de namespaces de Linux, cgroups y, potencialmente, otras facetas de aislamiento, las mismas cosas que aíslan un contenedor Docker. Dentro del contexto de un Pod, las aplicaciones individuales pueden tener más subaislamientos aplicados.

Los contenedores dentro de un Pod comparten dirección IP y puerto, y pueden encontrarse a través de `localhost`. También pueden comunicarse entre sí mediante comunicaciones estándar entre procesos, como semáforos de SystemV o la memoria compartida POSIX. Los contenedores en diferentes Pods tienen direcciones IP distintas y no pueden comunicarse por IPC sin [configuración especial](/docs/concepts/policy/pod-security-policy/).
Estos contenedores normalmente se comunican entre sí a través de las direcciones IP del Pod.

Las aplicaciones dentro de un Pod también tienen acceso a {{<glossary_tooltip text="volúmenes" term_id="volume">}} compartidos, que se definen como parte de un Pod y están disponibles para ser montados en el sistema de archivos de cada aplicación.

En términos de [Docker](https://www.docker.com/), un Pod se modela como un grupo de contenedores de Docker con namespaces y volúmenes de sistemas de archivos compartidos.

Al igual que los contenedores de aplicaciones individuales, los Pods se consideran entidades relativamente efímeras (en lugar de duraderas). Como se explica en [ciclo de vida del pod](/docs/concepts/workloads/pods/pod-lifecycle/), los Pods se crean, se les asigna un identificador único (UID) y se planifican en nodos donde permanecen hasta su finalización (según la política de reinicio) o supresión. Si un {{<glossary_tooltip text="nodo" term_id="node">}} muere, los Pods programados para ese nodo se programan para su eliminación después de un período de tiempo de espera. Un Pod dado (definido por su UID) no se "replanifica" a un nuevo nodo; en su lugar, puede reemplazarse por un Pod idéntico, con incluso el mismo nombre si lo desea, pero con un nuevo UID (consulte [controlador de replicación](/es/docs/concepts/workloads/controllers/replicationcontroller/) para obtener más detalles).

Cuando se dice que algo tiene la misma vida útil que un Pod, como un volumen, significa que existe mientras exista ese Pod (con ese UID). Si ese Pod se elimina por cualquier motivo, incluso si se crea un reemplazo idéntico, el recurso relacionado (por ejemplo, el volumen) también se destruye y se crea de nuevo.
{{< figure src="/images/docs/pod.svg" title="diagrama de Pod" width="50%" >}}

*Un Pod de múltiples contenedores que contiene un extractor de archivos y un servidor web que utiliza un volumen persistente para el almacenamiento compartido entre los contenedores.*

## Motivación para los Pods

### Gestión

Los Pods son un modelo del patrón de múltiples procesos de cooperación que forman una unidad de servicio cohesiva. Simplifican la implementación y la administración de las aplicaciones proporcionando una abstracción de mayor nivel que el conjunto de las aplicaciones que lo constituyen. Los Pods sirven como unidad de despliegue, escalado horizontal y replicación. La colocación (coprogramación), el destino compartido (por ejemplo, la finalización), la replicación coordinada, el uso compartido de recursos y la gestión de dependencias se controlan automáticamente para los contenedores en un Pod.

### Recursos compartidos y comunicación

Los Pods permiten el intercambio de datos y la comunicación entre los contenedores que lo constituyen.

Todas las aplicaciones en un Pod utilizan el mismo namespace de red (la misma IP y puerto) y, por lo tanto, pueden "encontrarse" entre sí y comunicarse utilizando `localhost`.
Debido a esto, las aplicaciones en un Pod deben coordinar su uso de puertos. Cada Pod tiene una dirección IP en un espacio de red compartido que tiene comunicación completa con otros servidores físicos y Pods a través de la red.

Los contenedores dentro del Pod ven que el hostname del sistema es el mismo que el `nombre` configurado para el Pod. Hay más información sobre esto en la sección [networking](/docs/concepts/cluster-administration/networking/).

Además de definir los contenedores de aplicaciones que se ejecutan en el Pod, el Pod especifica un conjunto de volúmenes de almacenamiento compartido. Los volúmenes permiten que los datos sobrevivan a reinicios de contenedores y se compartan entre las aplicaciones dentro del Pod.

## Usos de Pods

Los Pods pueden ser usados para alojar pilas de aplicaciones integradas (por ejemplo, LAMP), pero su objetivo principal es apoyar los programas de ayuda coubicados y coadministrados, como:

* sistemas de gestión de contenido, loaders de datos y archivos, gestores de caché locales, etc.
* copia de seguridad de registro y punto de control, compresión, rotación, captura de imágenes, etc.
* observadores de cambio de datos, adaptadores de registro y monitoreo, publicadores de eventos, etc.
* proxies, bridges y adaptadores.
* controladores, configuradores y actualizadores.

Los Pods individuales no están diseñados para ejecutar varias instancias de la misma aplicación, en general.

Para una explicación más detallada, ver [El sistema distribuido ToolKit: Patrones para Contenedores multiaplicación](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns).

## Alternativas

_¿Por qué simplemente no ejecutar múltiples programas en un solo contenedor de Docker?_

1. Transparencia. Hacer visibles los contenedores dentro del Pod
   a la infraestructura permite que esta brinde servicios, como gestión de procesos 
   y monitoreo de recursos, a los contenedores, facilitando una
   serie de comodidades a los usuarios.
1. Desacople de dependencias de software. Los contenedores individuales pueden ser
   versionados, reconstruidos y redistribuidos independientemente. Kubernetes podría incluso apoyar
   actualizaciones en vivo de contenedores individuales en un futuro.
1. Facilidad de uso. Los usuarios no necesitan ejecutar sus propios administradores de procesos,
   para propagación de señales, códigos de salida, etc.
1. Eficiencia. Debido a que la infraestructura asume más responsabilidad,
   los contenedores pueden ser más livianos.

_¿Por qué no admitir la planificación conjunta de contenedores por afinidad?_

Ese enfoque proporcionaría la ubicación conjunta, pero no la mayor parte de
beneficios de los Pods, como compartir recursos, IPC, compartir el destino garantizado y
gestión simplificada.

## Durabilidad de pods (o su ausencia)

Los Pods no están destinados a ser tratados como entidades duraderas. No sobrevivirán a errores de planificación, caídas de nodo u otros desalojos, ya sea por falta de recursos o en el caso de mantenimiento de nodos.

En general, los usuarios no deberían necesitar crear Pods directamente, deberían
usar siempre controladores incluso para Pods individuales, como por ejemplo, los 
[Deployments](/es/docs/concepts/workloads/controllers/deployment/).
Los controladores proporcionan autorecuperación con un alcance de clúster, así como replicación
y gestión de despliegue.
Otros controladores como los [StatefulSet](/es/docs/concepts/workloads/controllers/statefulset/)
pueden tambien proporcionar soporte para Pods que necesiten persistir el estado.

El uso de API colectivas como la principal primitiva de cara al usuario es relativamente común entre los sistemas de planificación de clúster, incluyendo [Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), y [Tupperware](http://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997).

El Pod se expone como primitiva para facilitar:

* planificación y capacidad de conexión del controlador
* soporte para operaciones a nivel de Pod sin la necesidad de "proxy" a través de las API del controlador
* desacople de la vida útil del Pod de la vida útil del controlador, como para el arranque
* desacople de controladores y servicios, el endpoint del controlador solo mira Pods
* composición limpia de funcionalidad a nivel de Kubelet con funcionalidad a nivel de clúster, Kubelet es efectivamente el "controlador de Pod"
* aplicaciones en alta disponibilidad, que esperan que los Pods sean reemplazados antes de su finalización y ciertamente antes de su eliminación, como en el caso de desalojos planificados o descarga previa de imágenes.

## Finalización de Pods

Debido a que los Pods representan procesos en ejecución en los nodos del clúster, es importante permitir que esos procesos finalicen de forma correcta cuando ya no se necesiten (en lugar de ser detenidos bruscamente con una señal de KILL). Los usuarios deben poder solicitar la eliminación y saber cuándo finalizan los procesos, pero también deben poder asegurarse de que las eliminaciones finalmente se completen. Cuando un usuario solicita la eliminación de un Pod, el sistema registra el período de gracia previsto antes de que el Pod pueda ser eliminado de forma forzada, y se envía una señal TERM al proceso principal en cada contenedor. Una vez que el período de gracia ha expirado, la señal KILL se envía a esos procesos y el Pod se elimina del servidor API. Si se reinicia Kubelet o el administrador de contenedores mientras se espera que finalicen los procesos, la terminación se volverá a intentar con el período de gracia completo.

Un ejemplo del ciclo de terminación de un Pod:

1. El usuario envía un comando para eliminar Pod, con un período de gracia predeterminado (30s)
1. El Pod en el servidor API se actualiza con el tiempo a partir del cual el Pod se considera "muerto" junto con el período de gracia.
1. El Pod aparece como "Terminando" cuando aparece en los comandos del cliente
1. (simultáneo con 3) Cuando el Kubelet ve que un Pod se ha marcado como terminado porque se ha configurado el tiempo en 2, comienza el proceso de apagado del Pod.
    1. Si uno de los contenedores del Pod ha definido un [preStop hook](/es/docs/concepts/containers/container-lifecycle-hooks/#hook-details), se invoca dentro del contenedor. Si el hook `preStop` todavía se está ejecutando después de que expire el período de gracia, el paso 2 se invoca con un pequeño período de gracia extendido (2s).
    1. El contenedor recibe la señal TERM. Tenga en cuenta que no todos los contenedores en el Pod recibirán la señal TERM al mismo tiempo y cada uno puede requerir un hook `preStop` si el orden en el que se cierra es importante.
1. (simultáneo con 3) Pod se elimina de la lista de endponts del servicio, y ya no se considera parte del conjunto de Pods en ejecución para controladores de replicación. Los Pods que se apagan lentamente no pueden continuar sirviendo el tráfico ya que los balanceadores de carga (como el proxy de servicio) los eliminan de sus rotaciones.
1. Cuando expira el período de gracia, todos los procesos que todavía se ejecutan en el Pod se eliminan con SIGKILL.
1. El Kubelet terminará de eliminar el Pod en el servidor API configurando el período de gracia 0 (eliminación inmediata). El Pod desaparece de la API y ya no es visible desde el cliente.

Por defecto, todas las eliminaciones se realizan correctamente en 30 segundos. El comando `kubectl delete` admite la opción` --grace-period = <seconds> `que permite al usuario anular el valor predeterminado y especificar su propio valor. El valor `0` [forzar eliminación](/es/docs/concepts/workloads/pods/pod/#forzar-destrucción-de-pods) del Pod.
Debe especificar un indicador adicional `--force` junto con `--grace-period = 0` para realizar eliminaciones forzadas.

### Forzar destrucción de Pods

La eliminación forzada de un Pod se define como la eliminación de un Pod del estado del clúster y etcd inmediatamente. Cuando se realiza una eliminación forzada, el apiserver no espera la confirmación del kubelet de que el Pod ha finalizado en el nodo en el que se estaba ejecutando. Elimina el Pod en la API inmediatamente para que se pueda crear un nuevo Pod con el mismo nombre. En el nodo, los Pods que están configurados para terminar de inmediato recibirán un pequeño período de gracia antes de ser forzadas a matar.

Estas eliminaciones pueden ser potencialmente peligrosas para algunos Pods y deben realizarse con precaución. En el caso de Pods de StatefulSets, consulte la documentación de la tarea para [eliminando Pods de un StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

## Modo privilegiado para Pods

Cualquier contenedor en un Pod puede habilitar el modo privilegiado, utilizando el indicador `privilegiado` en el [contexto de seguridad](/docs/tasks/configure-pod-container/security-context/) de la especificación del contenedor. Esto es útil para contenedores que desean usar capacidades de Linux como manipular la pila de red y acceder a dispositivos. Los procesos dentro del contenedor obtienen casi los mismos privilegios que están disponibles para los procesos fuera de un contenedor. Con el modo privilegiado, debería ser más fácil escribir complementos de red y volumen como Pods separados que no necesitan compilarse en el kubelet.

{{< note >}}
El {{<glossary_tooltip text="runtime de contenedores" term_id="container-runtime">}} debe admitir el concepto de un contenedor privilegiado para que esta configuración sea relevante.
{{< /note >}}

## API

Pod es un recurso de nivel superior en la API REST de Kubernetes.
La definición de [objeto de API Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
describe el objeto en detalle.


