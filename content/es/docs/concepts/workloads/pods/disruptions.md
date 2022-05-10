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
que tipos de interrupciones pueden suceder en los Pods.

También es para los administradores de clústers que quieren aplicar acciones
automatizadas en sus clústers, cómo actualizar o autoescalar los clústers.

<!-- body -->

## Interrupciones voluntarias e involuntarias

Los Pods no desaparecen hasta que algo (una persona o un controlador) los destruye
ó hay problemas de hardware ó software que son inevitables.

Nosotros llamamos a esos casos inevitables *interrupciones involuntarias* de
una aplicación. Algunos ejemplos:

- Una falla en hardware de la máquina física del nodo
- Un administrador del clúster borra una VM (instancia) por error
- El proveedor de la nube o el hipervisor falla y hace desaparecer la VM
- Un kernel panic
- El nodo desaparece del clúster por un problema de red que lo separa del clúster
- Una remoción del Pod porque el nodo [no tiene recursos suficientes](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

A excepción de la condición sin recursos suficientes, todas estas condiciones
deben ser familiares para la mayoría de los usuarios, no son específicas
de Kubernetes

Nosotros llamamos a los otros casos *interrupciones voluntarias*. Estas incluyen
las acciones iniciadas por el dueño de la aplicación y aquellas iniciadas por el Administrador
del Clúster. Las acciones típicas de los dueños de la aplicación incluye:

- borrar el Deployment u otro controlador que maneja el Pod
- actualizar el Deployment del Pod que causa un reinicio 
- borrar un Pod (por ejemplo, por accidente)

Las acciones del administrador del clúster incluyen:

- [Drenar un nodo](/docs/tasks/administer-cluster/safely-drain-node/) para reparar o actualizar.
- Drenar un nodo del clúster para reducir el clúster (aprenda acerca de [Autoescalamiento de Clúster](https://github.com/kubernetes/autoscaler/#readme)
).
- Remover un Pod de un nodo para permitir que otra cosa pueda ingresar a ese nodo.

Estas acciones pueden ser realizadas directamente por el administrador del clúster, por
tareas automatizadas del administrador del clúster ó por el proveedor del clúster.

Consulte al administrador de su clúster, a su proveedor de la nube ó a la documentación de su distribución
para determinar si alguna de estas interrupciones voluntarias están habilitadas en su clúster.
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
respeten el presupuesto de interrupción de Pods utilizando la [API de Desalojo](/docs/tasks/administer-clúster/safely-drain-node/#eviction-api)
en vez de directamente borrar Pods o Deployments.

Por ejemplo, el subcomando `kubectl drain` le permite marcar un nodo a un modo fuera de
servicio. Cuando se ejecuta `kubectl drain`, la herramienta trata de quitar a todos los Pods en
el nodo que se esta dejando fuera de servicio. La petición de desalojo que `kubectl` solicita en 
su nombre puede ser temporalmente denegado, entonces la herramienta periodicamente reintenta todas las 
peticiones fallidas hasta que todos los Pods en el nodo afectado son terminados ó hasta que el tiempo de espera,
que puede ser configurado, es alcanzado.
 
Un PDB especifica el número de réplicas que una aplicación puede tolerar, relativo a cuantas
se pretende tener. Por ejemplo, un Deployment que tiene un `.spec.replicas: 5` se
supone que tiene 5 Pods en cualquier momento. Si su PDB permite tener 4 a la vez,
entonces la API de Desalojo va a permitir interrupciones voluntarias de un (pero no a dos) Pod a la vez.

El grupo de Pods que comprende a la aplicación esta especificada usando una etiqueta selectora, la misma
que es usada por el controlador de aplicación (deployment, stateful-set, etc).

El numero de Pods "deseado" es calculado a partir de `.spec.replicas` de el recurso de Workload
que es manejado para esos Pods. El plano de control descubre el recurso Workload perteneciente a el
examinando las `.metadata.ownerReferences` del Pod.

Las [Interrupciones Involuntarias](#voluntary-and-involuntary-disruptions) no pueden ser prevenidas por los PDB; pero si
son contabilizadas a partir este presupuesto.

Los Pods que son borrados o no estan disponibles debido a una actualización continua de una aplicación forman parte del presupuesto de interrupciones, pero los recursos Workload (como los Deployments y StatefulSet)
no están limitados por los PDBs cuando se hacen actualizaciones continuas. En cambio, la administración de fallas
durante la actualización de la aplicación es configurada en la especificación para este recurso Workload específico.

Cuando un Pod es quitado usando la API de desalojo, este es 
[terminado](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) correctamente, haciendo honor al 
`terminationGracePeriodSeconds` configurado en su [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

## Ejemplo de Presupuesto de Interrupción de POD {#pdb-example}

Considere un clúster con 3 nodos, `nodo-1` hasta `nodo-3`.
El clúster esta corriendo varias aplicaciones. Uno de ellos tiene 3 replicas, que llamaremos
`pod-a`, `pod-b`, y `pod-c`. Otro Pod no relacionado y sin PDB, llamado `pod-x`, también se muestra.

Inicialmente los pods estan distribuidos de esta manera:


|       nodo-1         |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *available*   | pod-b *available*   | pod-c *available*  |
| pod-x  *available*   |                     |                    |

Los 3 Pods son parte de un Deployment, ellos colectivamente tienen un PDB que requiere
que por lo menos 2 de los 3 Pods esten disponibles todo el tiempo.

Por ejemplo, supongamos que el administrador del clúster quiere reiniciar para actualizar el kernel y arreglar un bug.
El administrador del clúster primero intenta desocupar el `nodo-1` usando el comando `kubectl drain`.
La herramienta intenta desalojar a los pods `pod-a` y `pod-x`. Esto tiene éxito inmediatamente.
Ambos Pods van al estado `terminating` al mismo tiempo.
Pone al clúster en el siguiente estado:

| nodo-1 *draining* |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* |                     |                    |

El Deployment detecta que uno de los Pods esta terminando, entonces crea un reemplazo
llamado `pod-d`. Como el `nodo-1` esta bloqueado, el pod termina en otro nodo. Algo más, adicionalmente
a creado el pod `pod-y` como un reemplazo del `pod-x` . 

(Nota: para un StatefulSet, `pod-a`, el cual debería ser llamado algo como `pod-0`, necesitaría ser terminado completamente antes de su remplazo, el cual también es llamado `pod-0` pero tiene un UID diferente, podría ser creado. De lo contrario, el ejemplo también aplica a un StatefulSet.)

Ahora el clúster esta en este estado:

| nodo-1 *draining* |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* | pod-d *starting*    | pod-y              |

En algún punto, los Pods finalizan y el clúster se ve de esta forma:

|  nodo-1 *drained* |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *starting*    | pod-y              |

En este estado, si un administrador del clúster impaciente intenta desalojar el `nodo-2` ó el 
`nodo-3`, el comando drain va a ser bloqueado, porque hay solamente 2 Pods disponibles para
el Deployment y el PDB requiere por lo menos 2. Después de pasado un tiempo el `pod-d` esta disponible.

El estado del clúster ahora se ve así:

|  nodo-1 *drained* |       nodo-2        |       nodo-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *available*   | pod-y              |

Ahora, el administrador del clúster desaloja el `nodo-2`.
El comando drain tratará de desalojar a los 2 Pods con algún orden, digamos
primero el `pod-b` y después el `pod-d`. Va a tener éxito en quitar el `pod-b`.
Pero cuando intente desalojar al `pod-d`, va a ser rechazado porque esto va a dejar 
un Pod solamente disponible para el Deployment. 

El Deployment crea un reemplazo para el `pod-b` llamado `pod-e`.
Porque no hay recursos suficientes disponibles en el clúster para programar
el `pod-e` el desalojo será bloqueado nuevamente. El clúster va a terminar en este
estado:

|    nodo-1 *drained*  |       nodo-2        |       nodo-3       | *no node*          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | pod-b *terminating* | pod-c *available*  | pod-e *pending*    |
|                      | pod-d *available*   | pod-y              |                    |

Ahora, el administrador del clúster necesita
agregar un nuevo nodo en el clúster para continuar con la actualización.

Usted puede ver como Kubernetes varia la tasa a la que las interrupciones
pueden suceder, en función de: 

- cuantas réplicas una aplicación necesita
- cuanto toma apagar una instancia de manera correcta
- cuanto tiempo toma que una nueva instancia inicie
- el tipo de controlador
- la capacidad de recursos del clúster

## Separando al dueño del Clúster y los roles de dueños de la Aplicación

Muchas veces es útil pensar en el Administrador del Clúster
y al dueño de la aplicación como roles separados con conocimiento limitado
el uno del otro. Esta separación de responsabilidades
puede tener sentido en estos escenarios:

- Cuando hay muchas equipos con aplicaciones compartiendo un clúster de Kubernetes y 
  hay una especialización natural de roles
- Cuando una herramienta de terceros o servicio es usado para automatizar el control del clúster

El presupuesto de interrupción de Pods soporta esta separación de roles, ofreciendo
una interfaz entre los roles.

Si no se tiene tal separación de responsabilidades en la organización,
posiblemente no se necesite el Presupuesto de Interrupción de Pods.

## Como realizar Acciones Disruptivas en el Clúster

Si usted es el Administrador del Clúster y necesita realizar una acción disruptiva en todos
los nodos en el clúster, como ser una actualización de nodo o de software, estas son algunas de las opciones:

- Aceptar el tiempo sin funcionar mientras dura la actualización.
- Conmutar a otra replica completa del clúster.
   - No hay tiempo sin funcionar, pero puede ser costoso tener duplicados los nodos
   y tambien un esfuerzo humano para orquestar dicho cambio.
- Escribir la toleracia a la falla de la aplicación y usar PDBs.
   - No hay tiempo sin funcionar.
   - Duplicación de recursos mínimo.
   - Permite mucha más automatización de la administración del clúster.
   - Escribir aplicaciones que tengan tolerancia a fallas es complicado, pero el trabajo para tolerar interrupciones
     involuntarias, largamente se sobrepone con el trabajo que es dar soporte a autoescalamientos y tolerar
     interrupciones involuntarias.




## {{% heading "whatsnext" %}}


* Siga los pasos para proteger su aplicación con [configurar el Presupuesto de Interrupciones de Pods](/docs/tasks/run-application/configure-pdb/).

* Aprenda más sobre [desalojar nodos](/docs/tasks/administer-clúster/safely-drain-node/)

* Aprenda sobre [actualizar un Deployment](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment)
  incluyendo los pasos para mantener su disponibilidad mientras dura la actualización.

