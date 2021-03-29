---
reviewers:
- glo-pena
title: Nodos
content_type: concept
weight: 10
---

<!-- overview -->

Un nodo es una máquina de trabajo en Kubernetes, previamente conocida como `minion`. Un nodo puede ser una máquina virtual o física, dependiendo del tipo de clúster. Cada nodo está gestionado por el componente máster y contiene los servicios necesarios para ejecutar [pods](/docs/concepts/workloads/pods/pod). Los servicios en un nodo incluyen el [container runtime](/docs/concepts/overview/components/#node-components), kubelet y el kube-proxy. Accede a la sección [The Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) en el documento de diseño de arquitectura para más detalle.




<!-- body -->

## Estado del Nodo

El estado de un nodo comprende la siguiente información:

* [Direcciones](#direcciones)
* [Estados](#estados)
* [Capacidad](#capacidad)
* [Información](#información)

### Direcciones

El uso de estos campos varía dependiendo del proveedor de servicios en la nube y/o de la configuración en máquinas locales.

* `HostName`: El nombre de la máquina huésped como aparece en el kernel del nodo. Puede ser reconfigurado a través del kubelet usando el parámetro `--hostname-override`.
* `ExternalIP`: La dirección IP del nodo que es accesible externamente (que está disponible desde fuera del clúster).
* `InternalIP`: La dirección IP del nodo que es accesible únicamente desde dentro del clúster.

### Estados

El campo `conditions` describe el estado de todos los nodos en modo `Running`.

| Estado  | Descripción |
|--------------------|-------------|
| `OutOfDisk`        | `True` si no hay espacio suficiente en el nodo para añadir nuevos pods; sino `False` |
| `Ready`            | `True` si el nodo está en buen estado y preparado para aceptar nuevos pods, `Falso` si no puede aceptar nuevos pods, y `Unknown` si el controlador aún no tiene constancia del nodo después del último `node-monitor-grace-period` (por defecto cada 40 segundos)|
| `MemoryPressure`   | `True` si hay presión en la memoria del nodo -- es decir, si el consumo de memoria en el nodo es elevado; sino `False` |
| `PIDPressure`    | `True` si el número de PIDs consumidos en el nodo es alto -- es decir, si hay demasiados procesos en el nodo; sino `False` |
| `DiskPressure`   | `True` si hay presión en el tamaño del disco -- esto es, si la capacidad del disco es baja; sino `False` |
| `NetworkUnavailable`  | `True` si la configuración de red del nodo no es correcta; sino `False` |

El estado del nodo se representa como un objeto JSON. Por ejemplo, la siguiente respuesta describe un nodo en buen estado:

```json
"conditions": [
  {
    "type": "Ready",
    "status": "True"
  }
]
```

Si el `status` de la condición `Ready` se mantiene como `Unknown` o `False` por más tiempo de lo que dura un `pod-eviction-timeout`, se pasa un argumento al [kube-controller-manager](/docs/admin/kube-controller-manager/) y todos los pods en el nodo se marcan para borrado por el controlador de nodos. El tiempo de desalojo por defecto es de **cinco minutos**. En algunos casos, cuando el nodo se encuentra inaccesible, el API Server no puede comunicar con el kubelet del nodo. La decisión de borrar pods no se le puede hacer llegar al kubelet hasta que la comunicación con el API Server se ha restablecido. Mientras tanto, los pods marcados para borrado pueden continuar ejecutándose en el nodo aislado.

En versiones de Kubernetes anteriores a 1.5, el controlador de nodos [forzaba el borrado](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) de dichos pods inaccesibles desde el API Server. Sin embargo, desde la versión 1.5, el nodo controlador no fuerza el borrado de pods hasta que se confirma que dichos pods han dejado de ejecutarse en el clúster. Pods que podrían estar ejecutándose en un nodo inalcanzable se muestran como `Terminating` o `Unknown`. En aquellos casos en los que Kubernetes no puede deducir si un nodo ha abandonado el clúster de forma permanente, puede que sea el administrador el que tenga que borrar el nodo de forma manual. Borrar un objeto `Node` en un clúster de Kubernetes provoca que los objetos Pod que se ejecutaban en el nodo sean eliminados en el API Server y libera sus nombres.

En la versión 1.12, la funcionalidad `TaintNodesByCondition` se eleva a beta, de forma que el controlador del ciclo de vida de nodos crea [taints](/docs/concepts/configuration/taint-and-toleration/) de forma automática, que representan estados de nodos.
De forma similar, el planificador de tareas ignora estados cuando evalúa un nodo; en su lugar mira los taints del nodo y las tolerancias de los pods.

En la actualidad, los usuarios pueden elegir entre la versión de planificación antigua y el nuevo, más flexible, modelo de planificación.
Un pod que no tiene definida ninguna tolerancia es planificado utilizando el modelo antiguo, pero si un nodo tiene definidas ciertas tolerancias, sólo puede ser asignado a un nodo que lo permita.

{{< caution >}}
Habilitar esta funcionalidad crea una pequeña demora entre que una condición es evaluada y un taint creado. Esta demora suele ser inferior a un segundo, pero puede incrementar el número de pods que se planifican con éxito pero que luego son rechazados por el kubelet.
{{< /caution >}}

### Capacidad

Describe los recursos disponibles en el nodo: CPU, memoria, y el número máximo de pods que pueden ser planificados dentro del nodo.

### Información

Información general sobre el nodo: versión del kernel, versión de Kubernetes (versiones del kubelet y del kube-proxy), versión de Docker (si se utiliza), nombre del sistema operativo. Toda esta información es recogida por el kubelet en el nodo.

## Gestión

A diferencia de [pods](/docs/concepts/workloads/pods/pod/) y [services](/docs/concepts/services-networking/service/), los nodos no son creados por Kubernetes de forma inherente; o son creados de manera externa por los proveedores de servicios en la nube como Google Compute Engine, o existen en la colección de máquinas virtuales o físicas. De manera que cuando Kubernetes crea un nodo, crea un objeto que representa el nodo. Después de ser creado, Kubernetes comprueba si el nodo es válido o no. Por ejemplo, si intentas crear un nodo con el siguiente detalle:

```json
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```
Kubernetes crea un objeto `Node` internamente (la representación), y valida el nodo comprobando su salud en el campo `metadata.name`. Si el nodo es válido -- es decir, si todos los servicios necesarios están ejecutándose -- el nodo es elegible para correr un pod. Sino, es ignorado para cualquier actividad del clúster hasta que se convierte en un nodo válido.

{{< note >}}
Kubernetes conserva el objeto de un nodo inválido y continúa probando por si el nodo, en algún momento, entrase en servicio.
Para romper este ciclo deberás borrar el objeto `Node` explícitamente.
{{< /note >}}

Actualmente, hay tres componentes que interactúan con la interfaz de nodos de Kubernetes: controlador de nodos, kubelet y kubectl.

### Controlador de Nodos

El controlador de nodos es un componente maestro en Kubernetes que gestiona diferentes aspectos de los nodos.

El controlador juega múltiples papeles en la vida de un nodo. El primero es asignar un bloque CIDR (Class Inter-Domain Routing) al nodo cuando este se registra (si la asignación CIDR está activada) que contendrá las IPs disponibles para asignar a los objetos que se ejecutarán en ese nodo.

El segundo es mantener actualizada la lista interna del controlador con la lista de máquinas disponibles a través del proveedor de servicios en la nube. Cuando Kubernetes se ejecuta en la nube, si un nodo deja de responder, el controlador del nodo preguntará al proveedor si la máquina virtual de dicho nodo continúa estando disponible. Si no lo está, el controlador borrará dicho nodo de su lista interna.

El tercero es el de monitorizar la salud de los nodos. El controlador de nodos es el responsable de actualizar la condición `NodeReady` del campo `NodeStatus` a `ConditionUnknown` cuando un nodo deja de estar accesible (por ejemplo, si deja de recibir señales de vida del nodo indicando que está disponible, conocidas como latidos o `hearbeats` en inglés) y, también es responsable de posteriormente desalojar todos los pods del nodo si este continúa estando inalcanzable. Por defecto, cuando un nodo deja de responder, el controlador sigue reintentando contactar con el nodo durante 40 segundos antes de marcar el nodo con `ConditionUnknown` y, si el nodo no se recupera de ese estado pasados 5 minutos, empezará a drenar los pods del nodo para desplegarlos en otro nodo que esté disponible.

El controlador comprueba el estado de cada nodo cada `--node-monitor-period` segundos.

En versiones de Kubernetes previas a 1.13, `NodeStatus` es el `heartbeat` del nodo. Empezando con 1.13 la funcionalidad de `node lease` se introduce como alfa (`NodeLease`,
[KEP-0009](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/0009-node-heartbeat.md)). Cuando la funcionalidad está habilitada, cada nodo tiene un objeto `Lease` asociado en el namespace `kube-node-lease` que se renueva periódicamente y ambos, el `NodeStatus` y el `Lease` son considerados como `hearbeats` del nodo. `Node leases` se renuevan con frecuencia, mientras que `NodeStatus` se transmite desde el nodo al máster únicamente si hay cambios o si ha pasado cierto tiempo (por defecto, 1 minuto, que es más que la cuenta atrás por defecto de 40 segundos que marca un nodo como inalcanzable). Al ser los `node lease` más ligeros que `NodeStatus`, los `hearbeats` resultan más económicos desde las perspectivas de escalabilidad y de rendimiento.

En Kubernetes 1.4, se actualizó la lógica del controlador de nodos para gestionar mejor los casos en los que un gran número de nodos tiene problemas alcanzando el nodo máster (Por ejemplo, cuando el nodo máster es el que tiene un problema de red). Desde 1.4, el controlador de nodos observa el estado de todos los nodos en el clúster cuando toma decisiones sobre desalojo de pods.

En la mayoría de los casos, el controlador de nodos limita el ritmo de desalojo `--node-eviction-rate` (0.1 por defecto) por segundo, lo que significa que no desalojará pods de más de un nodo cada diez segundos.

El comportamiento de desalojo de nodos cambia cuando un nodo en una zona de disponibilidad tiene problemas. El controlador de nodos comprobará qué porcentaje de nodos en la zona no se encuentran en buen estado (es decir, que su condición `NodeReady` tiene un valor `ConditionUnknown` o `ConditionFalse`) al mismo tiempo. Si la fracción de nodos con problemas es de al menos `--unhealthy-zone-threshold` (0.55 por defecto) entonces se reduce el ratio de desalojos: si el clúster es pequeño (por ejemplo, tiene menos o los mismos nodos que `--large-cluster-size-threshold` - 50 por defecto) entonces los desalojos se paran. Sino, el ratio se reduce a `--secondary-node-eviction-rate` (0.01 por defecto) por segundo. 

La razón por la que estas políticas se implementan por zonas de disponibilidad es debido a que una zona puede quedarse aislada del nodo máster mientras que las demás continúan conectadas. Si un clúster no comprende más de una zona, todo el clúster se considera una única zona.

La razón principal por la que se distribuyen nodos entre varias zonas de disponibilidad es para que el volumen de trabajo se transfiera a aquellas zonas que se encuentren en buen estado cuando una de las zonas se caiga.
Por consiguiente, si todos los nodos de una zona se encuentran en mal estado, el nodo controlador desaloja al ritmo normal `--node-eviction-rate`. En el caso extremo de que todas las zonas se encuentran en mal estado (es decir, no responda ningún nodo del clúster), el controlador de nodos asume que hay algún tipo de problema con la conectividad del nodo máster y paraliza todos los desalojos hasta que se restablezca la conectividad.

Desde la versión 1.6 de Kubernetes el controlador de nodos también es el responsable de desalojar pods que están ejecutándose en nodos con `NoExecute` taints, cuando los pods no permiten dichos taints. De forma adicional, como una funcionalidad alfa que permanece deshabilitada por defecto, el `NodeController` es responsable de añadir taints que se corresponden con problemas en los nodos del tipo nodo inalcanzable o nodo no preparado. En [esta sección de la documentación](/docs/concepts/configuration/taint-and-toleration/) hay más detalles acerca de los taints `NoExecute` y de la funcionalidad alfa.

Desde la versión 1.8, el controlador de nodos puede ser responsable de la creación de taints que representan condiciones de nodos. Esta es una funcionalidad alfa en 1.8.

### Auto-Registro de Nodos

Cuando el atributo del kubelet `--register-node` está habilitado (el valor por defecto), el kubelet intentará auto-registrarse con el API Server. Este es el patrón de diseño preferido, y utilizado por la mayoría de distribuciones.

Para auto-registro, el kubelet se inicia con las siguientes opciones:

- `--kubeconfig` - La ruta a las credenciales para autentificarse con el API Server.
- `--cloud-provider` - Cómo comunicarse con un proveedor de servicios para leer meta-datos sobre si mismo.
- `--register-node` - Registro automático con el API Server.
- `--register-with-taints` - Registro del nodo con la lista de taints proporcionada (separada por comas `<key>=<value>:<effect>`). Esta opción se ignora si el atributo`--register-node` no está habilitado.
- `--node-ip` - La dirección IP del nodo.
- `--node-labels` - Etiquetas para añadir al nodo durante el registro en el clúster (ver las restricciones que impone el [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) en 1.13+).
- `--node-status-update-frequency` - Especifica la frecuencia con la que el nodo envía información de estado al máster.

Cuando el [Node authorization mode](/docs/reference/access-authn-authz/node/) y el [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) están habilitados, los kubelets sólo tienen permisos para crear/modificar su propio objeto `Node`.

### Administración Manual de Nodos

Los administradores del clúster pueden crear y modificar objetos `Node`.

Si un administrador desea crear objetos `Node` de forma manual, debe levantar kubelet con el atributo `--register-node=false`.

Los administradores del clúster pueden modificar recursos `Node` (independientemente del valor de `--register-node`). Dichas modificaciones incluyen crear etiquetas en el nodo y/o marcarlo como no-planificable (de forma que pods no pueden ser planificados para instalación en el nodo).

Etiquetas y selectores de nodos pueden utilizarse de forma conjunta para controlar las tareas de planificación, por ejemplo, para determinar un subconjunto de nodos elegibles para ejecutar un pod.

Marcar un nodo como no-planificable impide que nuevos pods sean planificados en dicho nodo, pero no afecta a ninguno de los pods que existían previamente en el nodo. Esto resulta de utilidad como paso preparatorio antes de reiniciar un nodo, etc. Por ejemplo, para marcar un nodo como no-planificable, se ejecuta el siguiente comando:

```shell
kubectl cordon $NODENAME
```

{{< note >}}
Los pods creados por un controlador DaemonSet ignoran el planificador de Kubernetes y no respetan el atributo no-planificable de un nodo. Se asume que los daemons pertenecen a la máquina huésped y que se ejecutan incluso cuando esta está siendo drenada de aplicaciones en preparación de un reinicio.
{{< /note >}}

### Capacidad del Nodo

La capacidad del nodo (número de CPUs y cantidad de memoria) es parte del objeto `Node`.
Normalmente, nodos se registran a sí mismos y declaran sus capacidades cuando el objeto `Node` es creado. Si se está haciendo [administración manual](#administración-manual-de-nodos), las capacidades deben configurarse en el momento de añadir el nodo.

El planificador de Kubernetes asegura la existencia de recursos suficientes para todos los pods que se ejecutan en un nodo. Comprueba que la suma recursos solicitados por los pods no exceda la capacidad del nodo. Incluye todos los pods iniciados por el kubelet, pero no tiene control sobre contenedores iniciados directamente por el [runtime de contenedores](/docs/concepts/overview/components/#node-components) ni sobre otros procesos que corren fuera de contenedores.

Para reservar explícitamente recursos en la máquina huésped para procesos no relacionados con pods, sigue este tutorial [reserva de recursos para daemons de sistema](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).


## Objeto API

Un nodo es un recurso principal dentro de la REST API de Kubernetes. Más detalles sobre el objeto en la  API se puede encontrar en: [Object Node API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).



