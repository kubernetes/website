---
reviewers:
- electrocucaracha
- raelga
- edithrut
title: Ephemeral Volumes
content_type: concept
weight: 30
---

<!-- overview -->

Este documento describe los _volúmenes efímeros_ en Kubernetes. Es recomendable
estar familiarizado con los [volúmenes](/docs/es/concepts/storage/volumes/), en 
particular con PersistentVolumeClaim y PersistentVolume.

<!-- body -->

Algunas aplicaciones necesitan almacenamiento adicional pero no se preocupa si
los datos son guardados persistentemente durante los reinicios. Por ejemplo, servicios
de cacheo están limitados habitualmente por el tamaño de la memoria y pueden mover de manera
infrecuente datos de usuario al disco, esto es más lento que la memoria y tiene un pequeño impacto
en el rendimiento global.

Otras aplicaciones esperan algun tipo de dato de solo lectura que debe estar presente entre sus
archivos, como los archivos de configuración con claves secretas.

Los _Volúmenes efímeros_ estan diseñados para este tipo de casos. Porque los volúmenes
siguen toda la vida del Pod y son creados y borrados junto con el
Pod, los Pods pueden ser parados y reiniciados sin estar limitados por
la ubicación y disponibilidad de algún volumen persistente. 

Los volúmenes efímeros se especifican _en línea_ dentro de las especificaciones del Pod, esto 
simplifica el despliegue y manejo de la aplicación. 

### Tipos de volúmenes efímeros

Kubernetes soporta varios tipos diferentes de volúmenes efímeros para 
diferentes propósitos:
- [emptyDir](/docs/concepts/storage/volumes/#emptydir): vacío al inicio del Pod, 
  con almacenamiento local proveniente del directorio base de kubelet ( usualmente
  la raíz del disco) o la memoria RAM.
- [configMap](/docs/concepts/storage/volumes/#configmap),
  [downwardAPI](/docs/concepts/storage/volumes/#downwardapi),
  [secret](/docs/concepts/storage/volumes/#secret): Injectar diferentes
  tipos de datos de Kubernetes dentro del Pod
- [CSI ephemeral volumes](#csi-ephemeral-volumes):
  similar al anterior tipo de volumen pero manejado por un controlador que implemente la Container Storage Interface 
  [CSI drivers](https://github.com/container-storage-interface/spec/blob/master/spec.md)
  que específicamente [soportan esta característica](https://kubernetes-csi.github.io/docs/drivers.html)
- [volúmenes efímeros genéricos](#generic-ephemeral-volumes), que
  pueden ser proporcionados por todos los controladores de almacenamiento que tienen soporte para volúmenes persistentes

`emptyDir`, `configMap`, `downwardAPI`, `secret` son proporcionados como
[almacenamiento efímero local](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).
Estos son administrados por kubelet en cada uno de los nodos.

Los volúmenes efímeros CSI (Container Storage Interface) *deben* ser proporcionados por un controlador de almacenamiento
de terceros.

Los volúmenes efímeros genéricos *pueden* ser proporcionados por controladores de almacenamiento
de terceros, pero tambien puede ser por cualquier otro controlador de almacenamiento que tenga soporte para aprovisionamiento
dinámico. Algunos drivers CSI estan escritos específicamente para volúmenes
efímeros CSI y no tienen soporte para aprovisionamiento dinámico: estos 
no pueden ser usados por volúmenes efímeros genéricos.

```Necesito una revisión a esta frase no quedó bien```
La ventaja de usar controladores de terceros es que estos pueden ofrecer
funcionalidades que Kubernetes por si mismo no soporta, por ejemplo
almacenamiento con diferentes caracteristicas de rendimiento que el disco que
es administrado por kubelet ó injectando datos diferentes.

### Volúmenes efímeros CSI

```esta linea para mi debe ser eliminada, ya estamos en versiones más nuevas y la 1.16 ya no tiene soporte```
{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Esta característica requiere `CSIInlineVolume` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) para estar habilitado. Este
esta habilitado por defecto desde Kubernetes 1.16.

{{< note >}}
Los volúmenes efímeros CSI son solamente soportados por un subconjunto de controladores CSI.
La [lista de controladores](https://kubernetes-csi.github.io/docs/drivers.html) CSI de Kubernetes
muestra cuales controladores soportan volúmenes efímeros.
{{< /note >}}

Conceptualmente, los volúmenes efímeros CSI son similares a los tipos de volúmen
 `configMap`, `downwardAPI`y `secret`: el almacenamiento es administrado localmente en cada
nodo y es creato junto con otros recursos locales después de planificar el Pod
en uno de los nodos. Kubernetes no tiene el concepto de replanificar Pods
en esta etapa. La creación del volúmen no tendría que fallar,
de lo contrario el inicio del Pod queda bloqueado. En particular, [storage capacity
aware Pod scheduling](/docs/concepts/storage/storage-capacity/) no esta
soportada en estos volúmenes. Estos actualmente no estan cubiertos por
el límite de recursos de almacenamiento del Pod, porque esto es algo
que kubelet solamente puede hacer cumplir para almacenamientos que él administra.


Manifiesto de ejemplo para un Pod que usa un volumen efímero CSI:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-inline-vol
      command: [ "sleep", "1000000" ]
  volumes:
    - name: my-csi-inline-vol
      csi:
        driver: inline.storage.kubernetes.io
        volumeAttributes:
          foo: bar
```

El `volumeAttributes` determina que volumen esta preparado por el
controlador. Estos atributos son específicos para cada controlador y no esta
estandarizado. Vea la documentación para cada controlador CSI para información
adicional.

Como administrador del Cluster, usted puede usar una [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/) para definir que controlador CSI puede ser usado el el Pod, especificando con
[`allowedCSIDrivers` field](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritypolicyspec-v1beta1-policy).

### Volúmenes efímeros genéricos

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Los volúmenes efímeros genericos son similares a los volúmenes `emptyDir` en el 
sentido de que ellos proveen un directorio por Pod para inicializar datos que
usualmente estan vacíos antes de aprovisionar. Pero ellos pueden tener características
adicionales:

- El almacenamiento puede ser local o estar en la red.
- Los volúmenes pueden tener un tamaño fijo que los Pods no pueden exceder.
- Los volúmenes pueden tener datos iniciales, dependiendo del controlador y de
  los parámetros.
- Las operaciones típicas en volúmenes estan soportadas, asumiendo que el controlador
  las soporta, incluyendo
  [instantáneas](/docs/concepts/storage/volume-snapshots/),
  [clonado](/docs/concepts/storage/volume-pvc-datasource/),
  [cambio de tamaño](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims),
  y [seguimiento de capacidad de almacenamiento](/docs/concepts/storage/storage-capacity/).

Ejemplo:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-app
spec:
  containers:
    - name: my-frontend
      image: busybox
      volumeMounts:
      - mountPath: "/scratch"
        name: scratch-volume
      command: [ "sleep", "1000000" ]
  volumes:
    - name: scratch-volume
      ephemeral:
        volumeClaimTemplate:
          metadata:
            labels:
              type: my-frontend-volume
          spec:
            accessModes: [ "ReadWriteOnce" ]
            storageClassName: "scratch-storage-class"
            resources:
              requests:
                storage: 1Gi
```

### Ciclo de vida y PersistentVolumeClaim

```to be done```
The key design idea is that the
[parameters for a volume claim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1alpha1-core)
are allowed inside a volume source of the Pod. Labels, annotations and
the whole set of fields for a PersistentVolumeClaim are supported. When such a Pod gets
created, the ephemeral volume controller then creates an actual PersistentVolumeClaim
object in the same namespace as the Pod and ensures that the PersistentVolumeClaim
gets deleted when the Pod gets deleted.

Esto desencadena la vinculación y/o aprovisionamiento del volumen, ya sea inmediatamente si
el {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} usa la vinculación inmediata del volumen o cuando el Pod es
programado tentativamente dentro del nodo (modo de vinculación de volumen
`WaitForFirstConsumer`). Se recomienda esto último para volúmenes efímeros genéricos
porque entonces el planificador de Kubernetes es libre de eligir un nodo apropiado para
el Pod. Con vinculación inmediata, el planificador de Kubernetes se ve forzado a seleccionar el nodo que tiene
acceso al volumen una vez que esta disponible.

En términos de la [propiedad de los recursos](/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents),
un Pod que tiene un almacenamiento efímero genérico es el dueño del `PersistenVolumeClaim`
que proporciona este almacenamiento efímero. Cuando un Pod es borrado,
el recolector de basura de Kubernetes borra el PVC, que usualmente
desencadena el borrado del volumen porque la política de reclamos por defecto de 
esta clase de almacenamiento es eliminar los volúmenes. Usted puede crear almacenamiento local cuasi-efímero
usando un `StorageClass` que tenga una politica de recupero de `retención`: el almacenamiento sobrevive al Pod,
y en este caso se necesita asegurarse que la limpieza de este volumen suceda separadamente.

Mientras estos PVCs existan, ellos pueden ser usados como cualquier otro PVC. En
particular, estos pueden ser referenciados como fuente de datos para clonar volúmenes o
instantáneas. El objeto PVC tambien guarda el estado actual del
volumen.

### Nombrado de PersistentVolumeClaim

El nombrado automático de los PVCs creados es determinístico: el nombre es
una combinación del nombre del Pod y el nombre del volumen, con un guión (`-`) en el 
medio. En el siguiente ejemplo, el nombre del PVC será
`my-app-scratch-volume`. Este nombrado determinístico hace más fácil la
interacción con el PVC porque uno no tiene que buscar el mismo una
vez que el nombre del Pod y del volumen se conocen.

El nombrar de manera determinística tambien introduce un conflicto potencia entre diferentes
Pods (un Pod "pod-a" con un volumen "scratch" y otro Pod con nombre
"pod" y un volumen "a-scratch" terminan con el mismo nombre del PVC
"pod-a-scratch") y entre los Pods y PVCs creados manualmente.

Este tipo de conflictos son detectados: un PVC solamente es usado por un volumen
efímero si este fue creado por el Pod. Esta verificacion esta basada en la
relación de propiedad. Un PVC existente no es sobreescrito o
modificado. Pero esto no resuelve el conflicto porque sin el PVC
correcto, el Pod no puede iniciar.

{{< caution >}}
Tenga cuidado cuando nombre Pods y volúmenes dentro del 
mismo namespace, para que estos conflictos no ocurran.
{{< /caution >}}

### Seguridad

Habilitar la característica VolumenGenéricoEfímero permite a los usuarios crear
PVCs indirectamente si ellos pueden crear Pods, aún si ellos no tiene
permisos para crear PVCs de manera directa. Los administradores del cluster deben
ser concientes de esto. Si esto no cumple con el modelo de seguridad, se tienen
dos opciones:
- Usar una [Politica de Seguridad en Pods](/docs/concepts/policy/pod-security-policy/) donde la
  lista de `volúmenes` no contine el tipo de volumen efímero
  (obsoleto desde Kubernetes 1.21).
- Usar un [webhook de admisión](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  que niega a los objetos como Pods que tengan un volumen genérico
  efímero.

La [cuota en namespace para PVCs](/docs/concepts/policy/resource-quotas/#storage-resource-quota) se sigue aplicando, entonces
aún si los usuarios tienen permisos para usar este mecanismo, ellos no pueden usar
este para evitar otras políticas.

## {{% heading "whatsnext" %}}

### Volúmenes efímeros administrados por kubelet

Vea [almacenamiento local efímero](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).

### Volúmenes efímeros CSI

- Para más información sobre el diseño, visite [Ephemeral Inline CSI
  volumes KEP](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md).
- Para más información sobre el desarrollo de esta característica, visite [enhancement tracking issue #596](https://github.com/kubernetes/enhancements/issues/596).

### Volúmenes efímeros genéricos

- Para más información en su diseño, visite
[Generic ephemeral inline volumes KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md).
