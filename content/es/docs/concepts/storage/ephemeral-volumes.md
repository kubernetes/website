---
reviewers:
- electrocucaracha
- raelga
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
de cacheo estan limitados habitualmente por el tamaño de la memoria y pueden mover de manera
infrecuente datos de usuario al disco, esto es más lento que la memoria y tiene un pequeño impacto
en el rendimiento global.

Otras aplicaciones esperan algun tipo de dato de solo lectura que debe estar presente entre sus
archivos, como los archivos de configuración con claves secretas.

Los _Volúmenes efímeros_ estan diseñados para este tipo de casos. Porque los volúmenes
siguen toda la vida del Pod y son creados y borrados junto con el
Pod, los Pods pueden ser frenados y reiniciados sin ser limitados por
la ubicación y disponibilidad de algún volúmen persistente. 

Los volúmenes efímeros se especifican _en linea_ dentro de las especificaciones del Pod, esto 
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
  similar al anterior tipo de volúmen pero manejado por el driver 
  [CSI drivers](https://github.com/container-storage-interface/spec/blob/master/spec.md)
  que específicamente [soporta esta característica](https://kubernetes-csi.github.io/docs/drivers.html)
- [volúmenes efímeros genéricos](#generic-ephemeral-volumes), que
  puede ser proporcionado por todos los drivers de almacenamiento que tienen soporte para volúmenes persistentes

`emptyDir`, `configMap`, `downwardAPI`, `secret` son proporcionados como
[almacenamiento efímero
local](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).
Estos son administrados por kubelet en cada uno de los nodos.

Los volúmenes efímeros CSI *deben* ser proporcionados por un controlador de almacenamiento
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

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Esta carácteristica requiere `CSIInlineVolume` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) para estar habilitado. Este
esta habilitado por defecto desde Kubernetes 1.16.

{{< note >}}
Los volúmenes efímeros CSI son solamente soportados por un subconjunto de controladores CSI.
La [lista de controladores](https://kubernetes-csi.github.io/docs/drivers.html) CSI de Kubernetes
muestra cuales controladores soportan volúmenes efímeros.
{{< /note >}}

Conceptualmente, los volúmenes efímeros CSI son similares a los tipos de volúmen
 `configMap`, `downwardAPI`y `secret`: el almacenamiento es administrado localmente en cada
nodo y es creato junto con otros recursos locales después de programar el Pod
en uno de los nodos. Kubernetes no tiene el concepto de reprogramar Pods
en esta etapa. La creación del volúmen no tendría que fallar,
de lo contrario el inicio del Pod queda bloqueado. En particular, [storage capacity
aware Pod scheduling](/docs/concepts/storage/storage-capacity/) no esta
soportada en estos volúmenes. Estos actualmente no estan cubiertos por
el límite de recursos de almacenamiento del Pod, porque esto es algo
que kubelet solamente puede hacer cumplir para almacenamientos que él administra.


Aca hay un manifiesto de ejemplo para un Pod que usa un volúmen efímero CSI:

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

El `volumeAttributes` determina que volúmen esta preparado por el
controlador. Estos atributos son específicos para cada controlador y no esta
estandarizado. Vea la documentación para cada controlador CSI para información
adicional.

Como administrador del Cluster, usted puede usar una [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/) para controlar que controlador CSI puede ser usado el el Pod, especificando con
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
  [snapshotting](/docs/concepts/storage/volume-snapshots/),
  [cloning](/docs/concepts/storage/volume-pvc-datasource/),
  [resizing](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims),
  y [storage capacity tracking](/docs/concepts/storage/storage-capacity/).

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

The key design idea is that the
[parameters for a volume claim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1alpha1-core)
are allowed inside a volume source of the Pod. Labels, annotations and
the whole set of fields for a PersistentVolumeClaim are supported. When such a Pod gets
created, the ephemeral volume controller then creates an actual PersistentVolumeClaim
object in the same namespace as the Pod and ensures that the PersistentVolumeClaim
gets deleted when the Pod gets deleted.

That triggers volume binding and/or provisioning, either immediately if
the {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} uses immediate volume binding or when the Pod is
tentatively scheduled onto a node (`WaitForFirstConsumer` volume
binding mode). The latter is recommended for generic ephemeral volumes
because then the scheduler is free to choose a suitable node for
the Pod. With immediate binding, the scheduler is forced to select a node that has
access to the volume once it is available.

In terms of [resource ownership](/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents),
a Pod that has generic ephemeral storage is the owner of the PersistentVolumeClaim(s)
that provide that ephemeral storage. When the Pod is deleted,
the Kubernetes garbage collector deletes the PVC, which then usually
triggers deletion of the volume because the default reclaim policy of
storage classes is to delete volumes. You can create quasi-ephemeral local storage
using a StorageClass with a reclaim policy of `retain`: the storage outlives the Pod, 
and in this case you need to ensure that volume clean up happens separately.

While these PVCs exist, they can be used like any other PVC. In
particular, they can be referenced as data source in volume cloning or
snapshotting. The PVC object also holds the current status of the
volume.

### PersistentVolumeClaim naming

Naming of the automatically created PVCs is deterministic: the name is
a combination of Pod name and volume name, with a hyphen (`-`) in the
middle. In the example above, the PVC name will be
`my-app-scratch-volume`.  This deterministic naming makes it easier to
interact with the PVC because one does not have to search for it once
the Pod name and volume name are known.

The deterministic naming also introduces a potential conflict between different
Pods (a Pod "pod-a" with volume "scratch" and another Pod with name
"pod" and volume "a-scratch" both end up with the same PVC name
"pod-a-scratch") and between Pods and manually created PVCs.

Such conflicts are detected: a PVC is only used for an ephemeral
volume if it was created for the Pod. This check is based on the
ownership relationship. An existing PVC is not overwritten or
modified. But this does not resolve the conflict because without the
right PVC, the Pod cannot start.

{{< caution >}}
Take care when naming Pods and volumes inside the
same namespace, so that these conflicts can't occur.
{{< /caution >}}

### Security

Enabling the GenericEphemeralVolume feature allows users to create
PVCs indirectly if they can create Pods, even if they do not have
permission to create PVCs directly. Cluster administrators must be
aware of this. If this does not fit their security model, they have
two choices:
- Use a [Pod Security
  Policy](/docs/concepts/policy/pod-security-policy/) where the
  `volumes` list does not contain the `ephemeral` volume type
  (deprecated in Kubernetes 1.21).
- Use an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  which rejects objects like Pods that have a generic ephemeral
  volume.

The normal [namespace quota for PVCs](/docs/concepts/policy/resource-quotas/#storage-resource-quota) still applies, so
even if users are allowed to use this new mechanism, they cannot use
it to circumvent other policies.

## {{% heading "whatsnext" %}}

### Ephemeral volumes managed by kubelet

See [local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).

### CSI ephemeral volumes

- For more information on the design, see the [Ephemeral Inline CSI
  volumes KEP](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md).
- For more information on further development of this feature, see the [enhancement tracking issue #596](https://github.com/kubernetes/enhancements/issues/596).

### Generic ephemeral volumes

- For more information on the design, see the
[Generic ephemeral inline volumes KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md).
