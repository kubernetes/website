---
reviewers:
- electrocucaracha
- raelga
- gamba47
title: Interrupciones
content_type: concept
weight: 60
---

<!-- overview -->
Esta guía es para los dueños de aplicaciones que quieren crear
aplicaciones con alta disponibilidad y que necesitan entender
qué tipos de interrupciones pueden suceder en los Pods.

También es para los administradores de clústeres que quieren aplicar acciones
automatizadas en sus clústeres, como actualizar o autoescalar los clústeres.

<!-- body -->

## Interrupciones voluntarias e involuntarias

Los Pods no desaparecen hasta que algo (una persona o un controlador) los destruye
o hay problemas de hardware o software que son inevitables.

Nosotros llamamos a esos casos inevitables *interrupciones involuntarias* de
una aplicación. Algunos ejemplos:

- Una falla en el hardware de la máquina física del nodo.
- Un administrador del clúster borra una VM (instancia) por error.
- El proveedor de la nube o el hipervisor falla y hace desaparecer la VM.
- Un kernel panic.
- El nodo desaparece del clúster por un problema de red que lo separa del clúster.
- Una remoción del Pod porque el nodo [no tiene recursos suficientes](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

A excepción de la condición sin recursos suficientes, todas estas condiciones
deben ser familiares para la mayoría de los usuarios, no son específicas
de Kubernetes.

Nosotros llamamos a los otros casos *interrupciones voluntarias*. Estas incluyen
las acciones iniciadas por el dueño de la aplicación y aquellas iniciadas por el Administrador
del Clúster. Las acciones típicas de los dueños de la aplicación incluyen:

- borrar el Deployment u otro controlador que maneja el Pod
- actualizar el Deployment del Pod que causa un reinicio 
- borrar un Pod (por ejemplo, por accidente)

Las acciones del administrador del clúster incluyen:

- [Drenar un nodo](/docs/tasks/administer-cluster/safely-drain-node/) para reparar o actualizar.
- Drenar un nodo del clúster para reducir el clúster (aprenda acerca de [Autoescalamiento de Clúster](https://github.com/kubernetes/autoscaler/#readme)).
- Remover un Pod de un nodo para permitir que otra cosa pueda ingresar a ese nodo.

Estas acciones pueden ser realizadas directamente por el administrador del clúster, por
tareas automatizadas del administrador del clúster o por el proveedor del clúster.

Consulte al administrador de su clúster, a su proveedor de la nube o a la documentación de su distribución
para determinar si alguna de estas interrupciones voluntarias está habilitada en su clúster.
Si ninguna se encuentra habilitada, puede omitir la creación del presupuesto de Interrupción de Pods.

{{< caution >}}
No todas las interrupciones voluntarias son consideradas por el presupuesto de interrupción de Pods. Por ejemplo,
borrar un Deployment o Pods que evitan el uso del presupuesto.
{{< /caution >}}

## Tratando con las interrupciones

Estas son algunas de las maneras para mitigar las interrupciones involuntarias:

- Asegurarse que el Pod [solicite los recursos](/docs/tasks/configure-pod-container/assign-memory-resource) que necesita.
- Replique su aplicación si usted necesita alta disponibilidad. (Aprenda sobre correr aplicaciones replicadas
  [stateless](/docs/tasks/run-application/run-stateless-application-deployment/)
  y [stateful](/docs/tasks/run-application/run-replicated-stateful-application/)
- Incluso, para una alta disponibilidad mayor cuando se corren aplicaciones replicadas,
  propague las aplicaciones por varios racks (usando
  [anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity))
  o usando zonas (si usa un [clúster multi-zona](/docs/setup/multiple-zones).)

La frecuencia de las interrupciones voluntarias varía. En un clúster basico de Kubernetes, no hay 
interrupciones voluntarias automáticas (solo el usuario las genera). Sin embargo, su administrador del clúster o proveedor de alojamiento
puede correr algun servicio adicional que pueda causar estas interrupciones voluntarias. Por ejemplo,
desplegando una actualización de software en los nodos puede causar interrupciones. También, algunas implementaciones
de clústers con autoescalamiento de nodos puede causar interrupciones para defragmentar o compactar los nodos.
Su administrador de clúster o proveedor de alojamiento debe tener documentado cuál es el nivel de interrupciones
voluntarias esperadas, sí es que las hay. Ciertas opciones de configuración, como ser
[usar PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
en las especificaciones de su Pod pueden también causar interrupciones voluntarias (o involuntarias).


## Presupuesto de Interrupción de Pods

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Kubernetes ofrece carácteristicas para ayudar a ejecutar aplicaciones con alta disponibliidad, incluso cuando usted
introduce interrupciones voluntarias frecuentes.

Como dueño de la aplicación, usted puede crear un presupuesto de interrupción de Pods (PDB por sus siglas en inglés) para cada aplicación.
Un PDB limita el numero de Pods de una aplicación replicada, que estan caídos de manera simultánea por
interrupciones voluntarias. Por ejemplo, una aplicación basada en quórum puede
asegurarse que el número de réplicas corriendo nunca es menor al
número necesitado para obtener el quórum. Una web de tipo front end puede querer
asegurarse que el número de réplicas atendiendo al tráfico nunca puede caer bajo un cierto
porcentaje del total.

Los administradores del clúster y proveedores de hosting pueden usar herramientas que
respeten el presupuesto de interrupción de Pods utilizando la [API de Desalojo](/docs/tasks/administer-cluster/safely-drain-node/#eviction-api)
en vez de directamente borrar Pods o Deployments.

Por ejemplo, el subcomando `kubectl drain` le permite marcar un nodo a un modo fuera de
servicio. Cuando se ejecuta `kubectl drain`, la herramienta trata de quitar a todos los Pods en
el nodo que se esta dejando fuera de servicio. La petición de desalojo que `kubectl` solicita en 
su nombre puede ser temporalmente denegado, entonces la herramienta periodicamente reintenta todas las 
peticiones fallidas hasta que todos los Pods en el nodo afectado son terminados o hasta que el tiempo de espera,
que puede ser configurado, es alcanzado.
 
Un PDB especifica el número de réplicas que una aplicación puede tolerar, relativo a cuantas
se pretende tener. Por ejemplo, un Deployment que tiene un `.spec.replicas: 5` se
supone que tiene 5 Pods en cualquier momento. Si su PDB permite tener 4 a la vez,
entonces la API de Desalojo va a permitir interrupciones voluntarias de uno (pero no de dos) Pod a la vez.

El grupo de Pods que comprende a la aplicación está especificado usando una etiqueta selectora, la misma
que es usada por el controlador de aplicación (deployment, stateful-set, etc).

El número de Pods "deseado" es calculado a partir de `.spec.replicas` del recurso de Workload
que es manejado para esos Pods. El plano de control descubre el recurso Workload perteneciente al
examinar las `.metadata.ownerReferences` del Pod.

Las [Interrupciones Involuntarias](#voluntary-and-involuntary-disruptions) no pueden ser prevenidas por los PDB; pero si
son contabilizadas a partir de este presupuesto.

Los Pods que son borrados o no están disponibles debido a una actualización continua de una aplicación forman parte del presupuesto de interrupciones, pero los recursos Workload (como los Deployments y StatefulSet)
no están limitados por los PDBs cuando se hacen actualizaciones continuas. En cambio, la administración de fallas
durante la actualización de la aplicación está configurada en la especificación para este recurso Workload específico.

Cuando un Pod es eliminado usando la API de desalojo, este es 
[terminado](/docs/concepts/workloads/Pods/pod-lifecycle/#pod-termination) correctamente, haciendo honor al 
`terminationGracePeriodSeconds` configurado en su [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#Podspec-v1-core).

## Ejemplo de Presupuesto de Interrupción de POD {#pdb-example}

Considere un clúster con 3 nodos, `nodo-1` hasta `nodo-3`.
El clúster está ejecutando varias aplicaciones. Uno de ellos tiene 3 replicas, que llamaremos
`pod-a`, `pod-b`, y `pod-c`. Otro Pod no relacionado y sin PDB, llamado `pod-x`, también se muestra.

Inicialmente los Pods están distribuidos de esta manera:


|       nodo-1         |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *available*   | pod-b *available*   | pod-c *available*  |
| pod-x  *available*   |                     |                    |

Los 3 Pods son parte de un Deployment, ellos colectivamente tienen un PDB que requiere
que por lo menos 2 de los 3 Pods estén disponibles en todo momento.

Por ejemplo, supongamos que el administrador del clúster quiere reiniciar para actualizar el kernel y solucionar un error.
El administrador del clúster primero intenta drenar el `nodo-1` usando el comando `kubectl drain`.
La herramienta intenta drenar los Pods `pod-a` y `pod-x`. Esto tiene éxito inmediatamente.
Ambos Pods pasan al estado `terminating` al mismo tiempo.
Esto pone al clúster en el siguiente estado:

| nodo-1 *draining* |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* |                     |                    |

El Deployment detecta que uno de los Pods está terminando, entonces crea un reemplazo
llamado `pod-d`. Dado que el `nodo-1` está bloqueado, el pod se inicia en otro nodo. Además,
se crea el pod `pod-y` como reemplazo de `pod-x`.

(Nota: para un StatefulSet, `pod-a`, que debería llamarse algo como `pod-0`, debe terminar completamente antes de su reemplazo, que también se llama `pod-0` pero tiene un UID diferente, puede ser creado. De lo contrario, el ejemplo también se aplica a un StatefulSet).

Ahora el clúster está en este estado:

| nodo-1 *draining* |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* | pod-d *starting*    | pod-y *starting*   |

En algún momento, los Pods terminan y el clúster se ve así:

|  nodo-1 *drained* |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *starting*    | pod-y *starting*   |

En este estado, si un administrador del clúster impaciente intenta drenar el `nodo-2` o el 
`nodo-3`, el comando de drenado será bloqueado, porque solo hay 2 Pods disponibles para
el Deployment y el PDB requiere al menos 2. Después de un tiempo, `pod-d` y `pod-y` están disponibles.

El estado del clúster ahora se ve así:

|  nodo-1 *drained* |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *available*   | pod-y *available*  |

Ahora, el administrador del clúster drena el `nodo-2`.
El comando de drenado intentará drenar los 2 Pods en algún orden, digamos
primero `pod-b` y luego `pod-d`. Tendrá éxito en eliminar `pod-b`.
Pero cuando intente drenar `pod-d`, será rechazado porque eso dejará
solo un Pod disponible para el Deployment. 

El Deployment crea un reemplazo para `pod-b` llamado `pod-e`.
Dado que no hay suficientes recursos disponibles en el clúster para programar
`pod-e`, el drenado será bloqueado nuevamente. El clúster terminará en este
estado:

|    nodo-1 *drained*  |       nodo-2        |       nodo-3       | *no node*          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | pod-b *terminating* | pod-c *available*  | pod-e *pending*    |
|                      | pod-d *available*   | pod-y *available*  |                    |

Ahora, el administrador del clúster necesita
agregar un nuevo nodo en el clúster para continuar con la actualización.

Usted puede ver cómo Kubernetes varía la tasa a la que ocurren las interrupciones,
según:

- cuántas réplicas necesita una aplicación
- cuánto tiempo lleva apagar una instancia correctamente
- cuánto tiempo lleva iniciar una nueva instancia
- el tipo de controlador
- la capacidad de recursos del clúster

## Separación entre el dueño del Clúster y los roles de dueños de la Aplicación

Muchas veces es útil pensar en el Administrador del Clúster
y al dueño de la aplicación como roles separados con conocimiento limitado
el uno del otro. Esta separación de responsabilidades
puede tener sentido en estos escenarios:

- Cuando hay muchos equipos con aplicaciones compartiendo un clúster de Kubernetes y 
  hay una especialización natural de roles
- Cuando se usa una herramienta de terceros o un servicio para automatizar el control del clúster

El presupuesto de interrupción de Pods respalda esta separación de roles, proporcionando
una interfaz entre los roles.

Si no hay tal separación de responsabilidades en la organización,
es posible que no sea necesario el Presupuesto de Interrupción de Pods.

## Cómo realizar Acciones Disruptivas en el Clúster

Si usted es el Administrador del Clúster y necesitas realizar una acción disruptiva en todos
los nodos del clúster, como una actualización de nodo o de software, estas son algunas de las opciones:

- Aceptar el tiempo de inactividad mientras dura la actualización.
- Cambiar a otra réplica completa del clúster.
   - No hay tiempo de inactividad, pero puede ser costoso tener duplicados los nodos
   y también se requiere esfuerzo humano para orquestar dicho cambio.
- Diseñar la tolerancia a fallas en la aplicación y usar PDBs.
   - No hay tiempo de inactividad.
   - Duplicación mínima de recursos.
   - Permite mucha más automatización en la administración del clúster.
   - Diseñar aplicaciones para tolerar fallas es complicado, pero el trabajo para tolerar interrupciones
     involuntarias a menudo vale la pena en comparación con el trabajo de admitir autoescalado y tolerar
     interrupciones involuntarias.




## {{% heading "whatsnext" %}}


* Siga los pasos para proteger su aplicación con [configurar el Presupuesto de Interrupciones de Pods](/docs/tasks/run-application/configure-pdb/).

* Aprenda más sobre [drenar nodos](/docs/tasks/administer-cluster/safely-drain-node/).

* Aprenda sobre [actualizar un Deployment](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment)
  incluyendo los pasos para mantener su disponibilidad durante la actualización.

