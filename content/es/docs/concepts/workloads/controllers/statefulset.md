---
title: StatefulSets
content_type: concept
weight: 40
---

<!-- overview -->

Un StatefulSet es el objeto de la API workload que se usa para gestionar aplicaciones con estado.

{{< note >}}
Los StatefulSets son estables (GA) en la versión 1.9.
{{< /note >}}

{{< glossary_definition term_id="statefulset" length="all" >}}


<!-- body -->

## Usar StatefulSets

Los StatefulSets son valiosos para aquellas aplicaciones que necesitan uno o más de los siguientes:

* Identificadores de red estables, únicos.
* Almacenamiento estable, persistente.
* Despliegue y escalado ordenado, controlado.
* Actualizaciones en línea ordenadas, automatizadas.

De los de arriba, estable es sinónimo de persistencia entre (re)programaciones de Pods.
Si una aplicación no necesita ningún identificador estable o despliegue,
eliminación, o escalado ordenado, deberías desplegar tu aplicación con un controlador que
proporcione un conjunto de réplicas sin estado, como un
[Deployment](/docs/concepts/workloads/controllers/deployment/) o un
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/), ya que están mejor preparados
 para tus necesidades sin estado.

## Limitaciones

* El almacenamiento de un determinado Pod debe provisionarse por un [Provisionador de PersistentVolume](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/README.md) basado en la `storage class` requerida, o pre-provisionarse por un administrador.
* Eliminar y/o reducir un StatefulSet *no* eliminará los volúmenes asociados con el StatefulSet. Este comportamiento es intencional y sirve para garantizar la seguridad de los datos, que da más valor que la purga automática de los recursos relacionados del StatefulSet.
* Los StatefulSets actualmente necesitan un [Servicio Headless](/docs/concepts/services-networking/service/#headless-services) como responsable de la identidad de red de los Pods. Es tu responsabilidad crear este Service.
* Los StatefulSets no proporcionan ninguna garantía de la terminación de los pods cuando se elimina un StatefulSet. Para conseguir un término de los pods ordenado y controlado en el StatefulSet, es posible reducir el StatefulSet a 0 réplicas justo antes de eliminarlo.
* Cuando se usan las [Actualizaciones en línea](#rolling-updates) con la
  [Regla de Gestión de Pod](#pod-management-policies) (`OrderedReady`) por defecto,
  es posible entrar en un estado inconsistente que requiere de una
  [intervención manual para su reparación](#retroceso-forzado).

## Componentes
El ejemplo de abajo demuestra los componentes de un StatefulSet:

* Un servicio Headless, llamado nginx, se usa para controlar el dominio de red.
* Un StatefulSet, llamado web, que tiene una especificación que indica que se lanzarán 3 réplicas del contenedor nginx en Pods únicos.
* Un volumeClaimTemplate que proporciona almacenamiento estable por medio de [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) provisionados por un provisionador de tipo PersistentVolume.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # tiene que coincidir con .spec.template.metadata.labels
  serviceName: "nginx"
  replicas: 3 # por defecto es 1
  template:
    metadata:
      labels:
        app: nginx # tiene que coincidir con .spec.selector.matchLabels
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

## Selector de Pod
Debes poner el valor del campo `.spec.selector` de un StatefulSet para que coincida con las etiquetas de su campo `.spec.template.metadata.labels`. Antes de Kubernetes 1.8,
el campo `.spec.selector` se predeterminaba cuando se omitía. A partir de la versión 1.8, si no se especifica un selector de coincidencia de Pods, se produce un error de validación
durante la creación del StatefulSet.

## Identidad de Pod
Los Pods de un StatefulSet tienen una identidad única que está formada por un ordinal,
una identidad estable de red, y almacenamiento estable. La identidad se asocia al Pod,
independientemente del nodo en que haya sido (re)programado.

### Índice Ordinal

Para un StatefulSet con N réplicas, a cada Pod del StatefulSet se le asignará
un número entero ordinal, desde 0 hasta N-1, y que es único para el conjunto.

### ID estable de Red

El nombre de anfitrión (hostname) de cada Pod de un StatefulSet se deriva del nombre del StatefulSet
y del número ordinal del Pod. El patrón para construir dicho hostname
es `$(statefulset name)-$(ordinal)`. Así, el ejemplo de arriba creará tres Pods
denominados `web-0,web-1,web-2`.
Un StatefulSet puede usar un [Servicio Headless](/docs/concepts/services-networking/service/#headless-services)
para controlar el nombre de dominio de sus Pods. El nombre de dominio gestionado por este Service tiene la forma:
`$(service name).$(namespace).svc.cluster.local`, donde "cluster.local" es el nombre de dominio del clúster.
Conforme se crea cada Pod, se le asigna un nombre DNS correspondiente de subdominio, que tiene la forma:
`$(podname).$(governing service domain)`, donde el servicio en funciones se define por el campo
`serviceName` del StatefulSet.

Como se indicó en la sección [limitaciones](#limitaciones), la creación del
[Servicio Headless](/docs/concepts/services-networking/service/#headless-services)
encargado de la identidad de red de los pods es enteramente tu responsabilidad.

Aquí se muestran algunos ejemplos de elecciones de nombres de Cluster Domain, nombres de Service,
nombres de StatefulSet, y cómo impactan en los nombres DNS de los Pods del StatefulSet:

Cluster Domain | Service (ns/nombre) | StatefulSet (ns/nombre)  | StatefulSet Domain  | Pod DNS | Pod Hostname |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

{{< note >}}
El valor de Cluster Domain se pondrá a `cluster.local` a menos que
[se configure de otra forma](/docs/concepts/services-networking/dns-pod-service/).
{{< /note >}}

### Almacenamiento estable

Kubernetes crea un [PersistentVolume](/docs/concepts/storage/persistent-volumes/) para cada
VolumeClaimTemplate. En el ejemplo de nginx de arriba, cada Pod recibirá un único PersistentVolume
con una StorageClass igual a `my-storage-class` y 1 GiB de almacenamiento provisionado. Si no se indica ninguna StorageClass,
entonces se usa la StorageClass por defecto. Cuando un Pod se (re)programa
en un nodo, sus `volumeMounts` montan los PersistentVolumes asociados con sus
PersistentVolume Claims. Nótese que los PersistentVolumes asociados con los
PersistentVolume Claims de los Pods no se eliminan cuando los Pods, o los StatefulSet se eliminan.
Esto debe realizarse manualmente.

### Etiqueta de Nombre de Pod

Cuando el controlador del StatefulSet crea un Pod, añade una etiqueta, `statefulset.kubernetes.io/pod-name`,
que toma el valor del nombre del Pod. Esta etiqueta te permite enlazar un Service a un Pod específico
en el StatefulSet.

## Garantías de Despliegue y Escalado

* Para un StatefulSet con N réplicas, cuando los Pods se despliegan, se crean secuencialmente, en orden de {0..N-1}.
* Cuando se eliminan los Pods, se terminan en orden opuesto, de {N-1..0}.
* Antes de que una operación de escalado se aplique a un Pod, todos sus predecesores deben estar Running y Ready.
* Antes de que se termine un Pod, todos sus sucesores deben haberse apagado completamente.

El StatefulSet no debería tener que indicar un valor 0 para el campo `pod.Spec.TerminationGracePeriodSeconds`.
Esta práctica no es segura y se aconseja no hacerlo. Para una explicación más detallada, por favor echa un vistazo a cómo [forzar la eliminación de Pods de un StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

Cuando el ejemplo nginx de arriba se crea, se despliegan tres Pods en el orden
web-0, web-1, web-2. web-1 no se desplegará hasta que web-0 no esté
[Running y Ready](/docs/user-guide/pod-states/), y web-2 no se desplegará hasta que
web-1 esté Running y Ready. En caso de que web-0 fallase, después de que web-1 estuviera Running y Ready, pero antes
de que se desplegara web-2, web-2 no se desplegaría hasta que web-0 se redesplegase con éxito y estuviera
Running y Ready.

Si un usuario fuera a escalar el ejemplo desplegado parcheando el StatefulSet de forma que
`replicas=1`, web-2 se terminaría primero. web-1 no se terminaría hasta que web-2
no se hubiera apagado y eliminado por completo. Si web-0 fallase después de que web-2 se hubiera terminado y
apagado completamente, pero antes del término de web-1, entonces web-1 no se terminaría hasta
que web-0 estuviera Running y Ready.

### Reglas de Gestión de Pods
En Kubernetes 1.7 y versiones posteriores, el StatefulSet permite flexibilizar sus garantías de ordenación
al mismo tiempo que preservar su garantía de singularidad e identidad a través del campo `.spec.podManagementPolicy`.

#### Gestión de tipo OrderedReady de Pods

La gestión de tipo `OrderedReady` de pods es la predeterminada para los StatefulSets. Implementa el comportamiento
descrito [arriba](#deployment-and-scaling-guarantees).

#### Gestión de tipo Parallel de Pods

La gestión de tipo `Parallel` de pods le dice al controlador del StatefulSet que lance y termine
todos los Pods en paralelo, y que no espere a que los Pods estén Running
y Ready o completamente terminados antes de lanzar o terminar otro Pod.

## Estrategias de Actualización

En Kubernetes 1.7 y a posteriori, el campo `.spec.updateStrategy` del StatefulSet permite configurar
y deshabilitar las actualizaciones automátizadas en línea para los contenedores, etiquetas, peticiones/límites de recursos,
y anotaciones de los Pods del StatefulSet.

### On Delete

La estrategia de actualización `OnDelete` implementa el funcionamiento tradicional (1.6 y previo). Cuando el campo
`.spec.updateStrategy.type` de un StatefulSet se pone al valor `OnDelete`, el controlador del StatefulSet no actualizará automáticamente
los Pods del StatefulSet. Los usuarios deben eliminar manualmente los Pods para forzar al controlador a crear
nuevos Pods que reflejen las modificaciones hechas al campo `.spec.template` del StatefulSet.

### Rolling Updates

La estrategia de actualización `RollingUpdate` implementa una actualización automatizada en línea de los Pods del
StatefulSet. Es la estrategia por defecto cuando el campo `.spec.updateStrategy` se deja sin valor. Cuando el campo `.spec.updateStrategy.type` de un StatefulSet
se pone al valor `RollingUpdate`, el controlador del StatefulSet lo eliminará y recreará cada Pod en el StatefulSet. Procederá
en el mismo orden en que ha terminado los Pod (del número ordinal más grande al más pequeño), actualizando
cada Pod uno por uno. Esperará a que el Pod actualizado esté Running y Ready antes de
actualizar su predecesor.

#### Particiones

La estrategia de actualización `RollingUpdate` puede particionarse, indicando el valor del campo
`.spec.updateStrategy.rollingUpdate.partition`. Si se indica una partición, todos los Pods con un
número ordinal mayor o igual que el de la partición serán actualizados cuando el campo `.spec.template`
del StatefulSet se actualice. Todos los Pods con un número ordinal que sea menor que el de la partición
no serán actualizados, e incluso si son eliminados, serán recreados con la versión anterior. Si el campo
`.spec.updateStrategy.rollingUpdate.partition` de un StatefulSet es mayor que el valor del campo `.spec.replicas`,
las modificaciones al campo `.spec.template` no se propagarán a sus Pods.
En la mayoría de ocasiones, no necesitarás usar una partición, pero pueden resultar útiles si quieres preparar una actualización,
realizar un despliegue tipo canary, o llevar a cabo un despliegue en fases.

#### Retroceso Forzado

Cuando se usa [Actualizaciones en línea](#rolling-updates) con el valor de la
[Regla de Gestión de Pod](#pod-management-policies) (`OrderedReady`) por defecto,
es posible acabar en un estado inconsistente que requiera de una intervención manual para arreglarlo.

Si actualizas la plantilla Pod a una configuración que nunca llega a Running y
Ready (por ejemplo, debido a un binario incorrecto o un error de configuración a nivel de aplicación),
el StatefulSet detendrá el despliegue y esperará.

En este estado, no es suficiente con revertir la plantilla Pod a la configuración buena.
Debido a un [problema conocido](https://github.com/kubernetes/kubernetes/issues/67250),
el StatefulSet seguirá esperando a que los Pod estropeados se pongan en Ready
(lo que nunca ocurre) antes de intentar revertirla a la configuración que funcionaba.

Antes de revertir la plantilla, debes también eliminar cualquier Pod que el StatefulSet haya
intentando ejecutar con la configuración incorrecta.
El StatefulSet comenzará entonces a recrear los Pods usando la plantilla revertida.


## {{% heading "whatsnext" %}}


* Sigue el ejemplo de cómo [desplegar un aplicación con estado](/docs/tutorials/stateful-application/basic-stateful-set/).
* Sigue el ejemplo de cómo [desplegar Cassandra con StatefulSets](/docs/tutorials/stateful-application/cassandra/).



