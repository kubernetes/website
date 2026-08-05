---
title: Controladores
content_type: concept
weight: 30
---

<!-- overview -->

En robótica y automatización, un _bucle de control_ es
un bucle continuo que regula el estado de un sistema.

Aquí tenemos un ejemplo de un bucle de control: un termostato en una habitación.

Al ajustar la temperatura, le indicas al termostato 
cuál es el *estado deseado*. La temperatura actual es el 
*estado actual*. El termostato actúa para acercar la temperatura actual 
a la deseada, encendiendo o apagando los aparatos.

{{< glossary_definition term_id="controller" length="short">}}

<!-- body -->

## Patrón de controlador

Un controlador realiza un seguimiento de al menos un tipo de recurso de Kubernetes. 
Estos {{< glossary_tooltip text="objetos" term_id="object" >}} tienen un campo de 
especificación que representa el estado deseado. El/Los 
controlador/es de ese recurso son responsables de hacer que el estado 
actual se aproxime a ese estado deseado.

El controlador podría llevar a cabo la acción por sí mismo; más comúnmente, en Kubernetes, 
un controlador enviará mensajes al 
{{< glossary_tooltip text="servidor API" term_id="kube-apiserver" >}} que tienen 
efectos secundarios útiles. Verás ejemplos de esto más abajo.

{{< comment >}}
Algunos controladores integrados, como el controlador de namespace, actúan sobre objetos
que no tienen una especificación. Para simplificar, en esta página se omite la explicación de ese
detalle.
{{< /comment >}}

### Control mediante el servidor API

El controlador de {{< glossary_tooltip text="Job" term_id="job" >}} es un ejemplo de un
controlador integrado de Kubernetes. Los controladores integrados gestionan el estado 
interactuando con el servidor API del clúster.

Job es un recurso de Kubernetes que ejecuta un 
{{< glossary_tooltip text="Pod" term_id="pod" >}}, o quizás varios Pods, para realizar 
una tarea y luego detenerse.

(Una vez [programado](/docs/concepts/scheduling-eviction/), los objetos Pod pasan a formar 
parte del estado deseado para un kubelet).

Cuando el controlador de Job ve una nueva tarea, se asegura de que, en algún lugar 
de tu clúster, los kubelets en un conjunto de nodos estén ejecutando la cantidad correcta 
de Pods para realizar el trabajo. El controlador de Job no ejecuta ningún Pod ni contenedor 
por sí mismo. En cambio, el controlador de Job le indica al servidor API que cree o elimine 
Pods. Otros componentes en el {{< glossary_tooltip text="plano de control" term_id="control-plane" >}} 
actúan en función de la nueva información (hay nuevos Pods que programar y ejecutar) y, 
finalmente, el trabajo estará terminado.

Después de crear un nuevo Job, el estado deseado es que dicho Job esté completado. 
El controlador de Job hace que el estado actual de ese trabajo se acerque al estado deseado: 
creando Pods que realizan el trabajo que se le asignó a ese Job, de modo que el Job esté más 
cerca de completarse.

Los controladores también actualizan los objetos que los configuran. 
Por ejemplo: una vez que se ha realizado el trabajo para un Job, el controlador de Job 
actualiza ese objeto de Job para marcarlo `Finished`, o sea terminado.

(Esto es algo parecido a cómo algunos termostatos apagan una luz para indicar que la 
habitación ya está a la temperatura que programaste).

### Control directo

A diferencia de Job, algunos controladores necesitan realizar cambios 
en elementos externos a tu clúster.

Por ejemplo, si utilizas un bucle de control para asegurarse de que haya 
suficientes {{< glossary_tooltip text="Nodos" term_id="node" >}} en tu clúster, 
ese controlador necesita algo fuera del clúster actual para configurar nuevos Nodos 
cuando sea necesario.

Los controladores que interactúan con el estado externo obtienen el estado deseado 
del servidor API y, a continuación, se comunican directamente con un sistema externo 
para alinear el estado actual.

(De hecho, existe un [controlador](https://github.com/kubernetes/autoscaler/) que 
escala horizontalmente los nodos de tu clúster).

Lo importante aquí es que el controlador realiza algunos cambios para lograr el estado deseado
y luego informa el estado actual al servidor API de tu clúster. Otros bucles de control pueden
observar esos datos y tomar sus propias medidas.

En el ejemplo del termostato, si la habitación está muy fría, otro controlador podría activar 
un calefactor antihielo. Con los clústeres de Kubernetes, el plano de control interactúa
indirectamente con herramientas de gestión de direcciones IP, servicios de almacenamiento, 
API de proveedores de nube y otros servicios, [extendiendo Kubernetes](/docs/concepts/extend-kubernetes/)
para implementar estas funcionalidades.

## Estado deseado frente al estado actual {#desired-vs-current}

Kubernetes adopta una visión nativa de la nube para los sistemas 
y es capaz de gestionar cambios constantes.

Tu clúster podría estar cambiando en cualquier momento a medida que se realizan
las tareas y los bucles de control corrigen automáticamente los fallos. Esto 
significa que, potencialmente, tu clúster nunca alcanzará un estado estable.

Siempre y cuando los controladores de tu clúster estén en funcionamiento y puedan 
realizar cambios útiles, no importa si el estado general es estable o no.

## Diseño

Como principio fundamental de su diseño, Kubernetes utiliza numerosos controladores, 
cada uno de los cuales gestiona un aspecto específico del estado del clúster. Generalmente,
un bucle de control (controlador) utiliza un tipo de recurso como estado deseado y gestiona
otro tipo de recurso para lograr dicho estado. Por ejemplo, un controlador de trabajos (Jobs) 
realiza un seguimiento de los objetos Job (para descubrir nuevas tareas) y de los objetos Pod
(para ejecutar los Jobs y comprobar cuándo finalizan). En este caso, otro componente crea los 
Jobs, mientras que el controlador de Jobs crea los Pods.

Es útil contar con controladores sencillos en lugar de un conjunto monolítico de bucles de control
interconectados. Los controladores pueden fallar, por lo que Kubernetes está diseñado para permitirlo.

{{< note >}}
Puede haber varios controladores que creen o actualicen el mismo tipo de objeto. 
Entre bastidores, los controladores de Kubernetes se aseguran de prestar atención 
únicamente a los recursos vinculados al recurso que controlan.

Por ejemplo, puede tener Deployments y Jobs; ambos crean Pods. El controlador de Job no elimina
los Pods que creó tu Deployment, porque hay información
({{< glossary_tooltip text="etiquetas" term_id="label">}}) que los controladores pueden usar
para diferenciar esos Pods.
{{< /note >}}

## Formas de ejecutar controladores {#running-controllers}

Kubernetes viene con un conjunto de controladores integrados que se ejecutan dentro 
del {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}. 
Estos controladores integrados proporcionan comportamientos básicos importantes.

El controlador de Deployment y el controlador de Jobs son ejemplos de controladores 
que vienen integrados en Kubernetes. Kubernetes permite ejecutar un plano de control resiliente,
de modo que si alguno de los controladores integrados falla, otra parte del plano de control
asumirá la tarea.

Puedes encontrar controladores que se ejecutan fuera del plano de control para extender Kubernetes.
O, si lo prefieres, puedes escribir tu propio controlador. Puedes ejecutarlo como un conjunto de Pods
o externamente a Kubernetes. La mejor opción dependerá de la funcionalidad específica del controlador.

## {{% heading "whatsnext" %}}

* Lea sobre el [plano de control de Kubernetes](/docs/concepts/architecture/#control-plane-components)
* Descubre algunos de los [objetos básicos de Kubernetes](/docs/concepts/overview/working-with-objects/)
* Obtén más información sobre el [API de Kubernetes](/docs/concepts/overview/kubernetes-api/)
* Si quieres escribir tu propio controlador, consulta
  [los patrones de extensión de Kubernetes](/docs/concepts/extend-kubernetes/#extension-patterns)
   el repositorio [sample-controller](https://github.com/kubernetes/sample-controller).

