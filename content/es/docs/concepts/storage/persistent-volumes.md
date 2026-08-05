---
reviewers:
  - ramrodo
  - krol3
  - electrocucaracha
title: Volúmenes Persistentes
feature:
  title: Orquestación de almacenamiento
  description: >
    Monta automáticamente el sistema de almacenamiento de tu elección, ya sea de almacenamiento local, un proveedor de nube pública o un sistema de almacenamiento en red como iSCSI o NFS.
content_type: concept
weight: 20
---

<!-- overview -->

Este documento describe _volúmenes persistentes_ en Kubernetes. Se sugiere familiarizarse con
[volumes](/es/docs/concepts/storage/volumes/), [StorageClasses](/es/docs/concepts/storage/storage-classes/)
y [VolumeAttributesClasses](/docs/concepts/storage/volume-attributes-classes/).

<!-- body -->

## Introducción

La gestión del almacenamiento es un problema distinto al de la gestión de instancias de cómputo.
El subsistema PersistentVolume proporciona una API para usuarios y administradores
que abstrae los detalles de cómo se proporciona el almacenamiento de cómo se consume.
Para hacer esto, introducimos dos nuevos recursos de API: PersistentVolume y PersistentVolumeClaim.

Un _PersistentVolume_ (PV) es una pieza de almacenamiento en el clúster que ha sido
provisionada por un administrador o provisionada dinámicamente usando
[Storage Classes](/es/docs/concepts/storage/storage-classes/). Es un recurso en
el clúster al igual que un nodo es un recurso del clúster. Los PVs son plugins de volumen como
Volúmenes, que tienen un ciclo de vida independiente de cualquier Pod individual que use el PV.
Este objeto API captura los detalles de la implementación del almacenamiento, sea
NFS, iSCSI o un sistema de almacenamiento específico de un proveedor de nube.

Un _PersistentVolumeClaim_ (PVC) es una solicitud de almacenamiento por parte de un usuario. Es similar
a un Pod. Los Pods consumen recursos de nodos y los PVCs consumen recursos de PVs. Los Pods pueden
solicitar niveles específicos de recursos (CPU y Memoria). Las solicitudes pueden pedir tamaños específicos
y modos de acceso (por ejemplo, pueden montarse como ReadWriteOnce, ReadOnlyMany,
ReadWriteMany o ReadWriteOncePod, ver [Modos de Acceso](#modos-de-acceso)).

Aunque los PersistentVolumeClaims permiten a un usuario consumir recursos de almacenamiento abstractos,
es común que los usuarios necesiten PersistentVolumes con propiedades variadas, tales como
rendimiento, para diferentes problemas. Los administradores del clúster necesitan poder
ofrecer una variedad de PersistentVolumes que difieran en más aspectos que el tamaño y los modos de acceso, sin exponer a los usuarios a los detalles de cómo se implementan esos volúmenes.
Para estas necesidades, existe el recurso _StorageClass_.

Vea el [tutorial detallado con ejemplos prácticos](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).

## Ciclo de vida de un volumen y una solicitud

Los PVs son recursos en el clúster. Los PVCs son solicitudes para esos recursos y también actúan
como comprobantes de reclamo al recurso. La interacción entre PVs y PVCs sigue este ciclo de vida:

### Aprovisionamiento

Hay dos formas en que los PVs pueden ser aprovisionados: estáticamente o dinámicamente.

#### Estático

Un administrador del clúster crea un número de PVs. Llevan los detalles del
almacenamiento real, que está disponible para uso de los usuarios del clúster. Existen en la
API de Kubernetes y están disponibles para su consumo.

#### Dinámico

Cuando ninguno de los PVs estáticos creados por el administrador coincide con un PersistentVolumeClaim de un usuario,
el clúster puede intentar aprovisionar dinámicamente un volumen especialmente para el PVC.
Este aprovisionamiento se basa en StorageClasses: el PVC debe solicitar una
[clase de almacenamiento](/es/docs/concepts/storage/storage-classes/) y
el administrador debe haber creado y configurado esa clase para que ocurra el aprovisionamiento
dinámico. Las solicitudes que piden la clase `""` efectivamente desactivan
el aprovisionamiento dinámico para sí mismas.

Para habilitar el aprovisionamiento dinámico de almacenamiento basado en clases de almacenamiento, el administrador del clúster
necesita habilitar el controlador de admisión `DefaultStorageClass`
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
en el servidor API. Esto se puede hacer, por ejemplo, asegurándose de que `DefaultStorageClass` esté
entre la lista de valores delimitados por comas y ordenados para la bandera `--enable-admission-plugins` del
componente del servidor API. Para más información sobre las opciones de línea de comandos del servidor API,
consulta la documentación de [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

### Binding

Un usuario crea, o en el caso de aprovisionamiento dinámico, ya ha creado,
un PersistentVolumeClaim con una cantidad específica de almacenamiento solicitado y con
ciertos modos de acceso. Un bucle de control en el plano de control observa los nuevos PVCs, encuentra
un PV coincidente (si es posible) y los une. Si un PV fue aprovisionado dinámicamente
para un nuevo PVC, el bucle siempre unirá ese PV al PVC. De lo contrario,
el usuario siempre obtendrá al menos lo que pidió, pero el volumen puede ser
superior a lo solicitado. Una vez unidos, los enlaces PersistentVolumeClaim son exclusivos,
independientemente de cómo se hayan unido. Una unión PVC a PV es un mapeo uno a uno,
utilizando un ClaimRef que es una unión bidireccional entre el PersistentVolume
y el PersistentVolumeClaim.

Las solicitudes permanecerán sin unir indefinidamente si no existe un volumen coincidente.
Las solicitudes se unirán a medida que los volúmenes coincidentes estén disponibles. Por ejemplo, un
clúster aprovisionado con muchos PVs de 50Gi no coincidirá con un PVC que solicite 100Gi.
El PVC puede unirse cuando se agregue un PV de 100Gi al clúster.

### Uso

Los Pods usan las solicitudes como volúmenes. El clúster inspecciona la solicitud para encontrar el volumen unido
y monta ese volumen para un Pod. Para los volúmenes que admiten múltiples modos de acceso, el usuario especifica qué modo desea cuando utiliza su solicitud como volumen en un Pod.

Una vez que un usuario tiene una solicitud y esa solicitud está unida, el PV unido pertenece al
usuario mientras lo necesiten. Los usuarios programan Pods y acceden a sus PVs reclamados incluyendo una sección de `persistentVolumeClaim` en el bloque `volumes` de un Pod.
Consulta [Solicitudes como Volúmenes](#solicitudes-como-volumenes) para más detalles sobre esto.

### Protección de Objeto de Almacenamiento en Uso

El propósito de la función de Protección de Objeto de Almacenamiento en Uso es asegurar que
las PersistentVolumeClaims (PVCs) en uso activo por un Pod y los PersistentVolumes (PVs)
que están unidos a PVCs no sean eliminados del sistema, ya que esto podría resultar en pérdida de datos.

{{< note >}}
Un PVC está en uso activo por un Pod cuando existe un objeto Pod que está utilizando el PVC.
{{< /note >}}

Si un usuario elimina un PVC en uso activo por un Pod, el PVC no se elimina inmediatamente.
La eliminación del PVC se pospone hasta que el PVC ya no esté en uso activo por ningún Pod. Además,
si un administrador elimina un PV que está unido a un PVC, el PV no se elimina inmediatamente.
La eliminación del PV se pospone hasta que el PV ya no esté unido a ningún PVC.

Puedes ver que un PVC está protegido cuando el estado del PVC es `Terminating` y la lista de `Finalizers` incluye `kubernetes.io/pvc-protection`:

```shell
kubectl describe pvc hostpath
Name:          hostpath
Namespace:     default
StorageClass:  example-hostpath
Status:        Terminating
Volume:
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-class=example-hostpath
               volume.beta.kubernetes.io/storage-provisioner=example.com/hostpath
Finalizers:    [kubernetes.io/pvc-protection]
...
```

Puedes ver que un PV está protegido cuando el estado del PV es `Terminating` y la lista de `Finalizers` incluye también `kubernetes.io/pv-protection`:

```shell
kubectl describe pv task-pv-volume
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Terminating
Claim:
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:
Events:            <none>
```

### Reclamación

Cuando un usuario ha concluido con el uso de su volumen, puede eliminar los objetos PVC de la
API que permite la recuperación del recurso. La política de reclamación para un PersistentVolume
le dice al clúster que hacer con el volumen después de que ha sido liberado de su solicitud.
Actualmente, los volúmenes pueden ser Retenidos, Reciclados o Eliminados.

#### Retener

La política de reclamación `Retain` permite la recuperación manual del recurso.
Cuando se elimina el PersistentVolumeClaim, el PersistentVolume todavía existe
y el volumen se considera "liberado". Pero aún no está disponible para
otra solicitud porque los datos del reclamante anterior permanecen en el volumen.
Un administrador puede reclamar manualmente el volumen con los siguientes pasos.

1. Eliminar el PersistentVolume. El recurso de almacenamiento asociado en la infraestructura externa
   todavía existe después de que se haya eliminado el PV.
1. Limpiar manualmente los datos en el recurso de almacenamiento asociado en consecuencia.
1. Eliminar manualmente el recurso de almacenamiento asociado.

Si deseas reutilizar el mismo recurso de almacenamiento, crea un nuevo PersistentVolume con
la misma definición de recurso de almacenamiento.

#### Eliminar

Para los plugins de volumen que soportan la política de reclamación `Delete`, la eliminación remueve
tanto el objeto PersistentVolume de Kubernetes, como el recurso de almacenamiento asociado
en la infraestructura externa. Los volúmenes que fueron aprovisionados dinámicamente
heredan la [política de reclamación de su StorageClass](#politica-de-reclamacion), que
por defecto es `Delete`. El administrador debe configurar la StorageClass
de acuerdo con las expectativas de los usuarios; de lo contrario, el PV debe ser editado o
modificado después de que se haya creado. Consulta
[Cambiar la Política de Reclamación de un PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

#### Reciclar

{{< warning >}}
La política de reclamación `Recycle` está obsoleta. En su lugar, el enfoque recomendado
es utilizar el aprovisionamiento dinámico.
{{< /warning >}}

Si es compatible con el plugin de volumen subyacente, la política de reclamación `Recycle` realiza
un borrado básico (`rm -rf /elvolumen/*`) en el volumen y lo hace disponible nuevamente para una nueva solicitud.

Sin embargo, un administrador puede configurar una plantilla de Pod reciclador personalizada usando
los argumentos de línea de comandos del administrador del controlador de Kubernetes como se describe en la
[referencia](/docs/reference/command-line-tools-reference/kube-controller-manager/).
La plantilla de Pod reciclador personalizada debe contener una especificación de `volumes`, como
se muestra en el ejemplo a continuación:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler
  namespace: default
spec:
  restartPolicy: Never
  volumes:
    - name: vol
      hostPath:
        path: /any/path/it/will/be/replaced
  containers:
    - name: pv-recycler
      image: "registry.k8s.io/busybox"
      command:
        [
          "/bin/sh",
          "-c",
          'test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z "$(ls -A /scrub)" || exit 1',
        ]
      volumeMounts:
        - name: vol
          mountPath: /scrub
```

Sin embargo, la ruta particular especificada en la plantilla de Pod reciclador personalizado en la parte de `volumes` se reemplaza con la ruta particular del volumen que está siendo reciclado.

### Finalizador de protección de eliminación de PersistentVolume

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

Los finalizadores pueden agregarse en un PersistentVolume para asegurar que los PersistentVolumes
con política de reclamación `Delete` solo se eliminen después de que se eliminen los almacenamientos subyacentes.

Los finalizadores recién introducidos `kubernetes.io/pv-controller` y
`external-provisioner.volume.kubernetes.io/finalizer`
solo se agregan a los volúmenes provisionados dinámicamente.

El finalizador `kubernetes.io/pv-controller` se agrega a los volúmenes de plugins integrados.
El siguiente es un ejemplo.

```shell
kubectl describe pv pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Name:            pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Labels:          <none>
Annotations:     kubernetes.io/createdby: vsphere-volume-dynamic-provisioner
                 pv.kubernetes.io/bound-by-controller: yes
                 pv.kubernetes.io/provisioned-by: kubernetes.io/vsphere-volume
Finalizers:      [kubernetes.io/pv-protection kubernetes.io/pv-controller]
StorageClass:    vcp-sc
Status:          Bound
Claim:           default/vcp-pvc-1
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        1Gi
Node Affinity:   <none>
Message:
Source:
    Type:               vSphereVolume (a Persistent Disk resource in vSphere)
    VolumePath:         [vsanDatastore] d49c4a62-166f-ce12-c464-020077ba5d46/kubernetes-dynamic-pvc-74a498d6-3929-47e8-8c02-078c1ece4d78.vmdk
    FSType:             ext4
    StoragePolicyName:  vSAN Default Storage Policy
Events:                 <none>
```

El finalizador `external-provisioner.volume.kubernetes.io/finalizer` se agrega para los volúmenes CSI.
El siguiente es un ejemplo:

```shell
Name:            pvc-2f0bab97-85a8-4552-8044-eb8be45cf48d
Labels:          <none>
Annotations:     pv.kubernetes.io/provisioned-by: csi.vsphere.vmware.com
Finalizers:      [kubernetes.io/pv-protection external-provisioner.volume.kubernetes.io/finalizer]
StorageClass:    fast
Status:          Bound
Claim:           demo-app/nginx-logs
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        200Mi
Node Affinity:   <none>
Message:
Source:
    Type:              CSI (a Container Storage Interface (CSI) volume source)
    Driver:            csi.vsphere.vmware.com
    FSType:            ext4
    VolumeHandle:      44830fa8-79b4-406b-8b58-621ba25353fd
    ReadOnly:          false
    VolumeAttributes:      storage.kubernetes.io/csiProvisionerIdentity=1648442357185-8081-csi.vsphere.vmware.com
                           type=vSphere CNS Block Volume
Events:                <none>
```

Cuando la bandera de funcionalidad `CSIMigration{provider}` está habilitada para un plugin de volumen integrado específico,
el finalizador `kubernetes.io/pv-controller` se reemplaza por el finalizador
`external-provisioner.volume.kubernetes.io/finalizer`.

### Reservando un PersistentVolume

El plano de control puede [unir PersistentVolumeClaims a PersistentVolumes correspondientes](#binding)
en el clúster. Sin embargo, si quieres que un PVC se una a un PV específico, necesitas pre-unirlos.

Al especificar un PersistentVolume en un PersistentVolumeClaim, declaras una unión
entre ese PV y PVC específicos. Si el PersistentVolume existe y no ha reservado
PersistentVolumeClaims a través de su campo `claimRef`, entonces el PersistentVolume y
el PersistentVolumeClaim se unirán.

La unión ocurre independientemente de algunos criterios de coincidencia de volumen, incluida la afinidad de nodo.
El plano de control aún verifica que la [clase de almacenamiento](/es/docs/concepts/storage/storage-classes/),
los modos de acceso y el tamaño de almacenamiento solicitado sean válidos.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # La cadena vacía debe establecerse explícitamente; de lo contrario, se establecerá la StorageClass predeterminada
  volumeName: foo-pv
  ...
```

Este método no garantiza ningún privilegio de unión al PersistentVolume.
Si otros PersistentVolumeClaims pudieran usar el PV que especificas, primero
necesitas reservar ese volumen de almacenamiento. Especifica el PersistentVolumeClaim relevante
en el campo `claimRef` del PV para que otros PVCs no puedan unirse a él.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: foo-pv
spec:
  storageClassName: ""
  claimRef:
    name: foo-pvc
    namespace: foo
  ...
```

Esto es útil si deseas consumir PersistentVolumes que tienen su `claimPolicy` establecido
en `Retain`, incluyendo casos donde estás reutilizando un PV existente.

### Expandiendo Persistent Volume Claims

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

El soporte para expandir PersistentVolumeClaims (PVCs) está habilitado por defecto. Puedes expandir
los siguientes tipos de volúmenes:

- azureFile (obsoleto)
- {{< glossary_tooltip text="csi" term_id="csi" >}}
- flexVolume (obsoleto)
- rbd (obsoleto)
- portworxVolume (obsoleto)

Solo puedes expandir un PVC si el campo `allowVolumeExpansion` de su clase de almacenamiento está establecido en verdadero.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-vol-default
provisioner: vendor-name.example/magicstorage
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

Para solicitar un volumen más grande para un PVC, edita el objeto PVC y especifica un tamaño
mayor. Esto desencadena la expansión del volumen que respalda el PersistentVolume subyacente. Nunca se crea un nuevo PersistentVolume para satisfacer la solicitud. En cambio, se redimensiona un volumen existente.

{{< warning >}}
Editar directamente el tamaño de un PersistentVolume puede impedir un redimensionamiento automático de ese volumen.
Si editas la capacidad de un PersistentVolume, y luego editas el `.spec` de un PersistentVolumeClaim coincidente para hacer que el tamaño del PersistentVolumeClaim coincida con el PersistentVolume,
entonces no ocurre ningún redimensionamiento de almacenamiento.
El plano de control de Kubernetes verá que el estado deseado de ambos recursos coincide,
concluirá que el tamaño del volumen de respaldo se ha aumentado manualmente
y que no es necesario ningún redimensionamiento.
{{< /warning >}}

#### Expansión de volúmenes CSI

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

El soporte para la expansión de volúmenes CSI está habilitado por defecto, pero también requiere que un
controlador CSI específico soporte la expansión de volumen. Consulta la documentación del
controlador CSI específico para obtener más información.

#### Redimensionando un volumen que contiene un sistema de archivos

Solo puedes redimensionar volúmenes que contienen un sistema de archivos si el sistema de archivos es XFS, Ext3 o Ext4.

Cuando un volumen contiene un sistema de archivos, el sistema de archivos solo se redimensiona cuando un nuevo Pod está utilizando
el PersistentVolumeClaim en modo `ReadWrite`. La expansión del sistema de archivos se realiza cuando un Pod se está iniciando
o cuando un Pod está en ejecución y el sistema de archivos subyacente soporta la expansión en línea.

Los FlexVolumes (obsoletos desde Kubernetes v1.23) permiten redimensionar si el controlador está configurado con la
capacidad `RequiresFSResize` en `true`. El FlexVolume se puede redimensionar al reiniciar el Pod.

#### Redimensionando un PersistentVolumeClaim en uso

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

En este caso, no necesitas eliminar y recrear un Pod o despliegue que esté utilizando un PVC existente.
Cualquier PVC en uso se vuelve automáticamente disponible para su Pod tan pronto como su sistema de archivos haya sido expandido.
Esta característica no tiene efecto en PVCs que no están en uso por un Pod o despliegue. Debes crear un Pod que
utilice el PVC antes de que la expansión pueda completarse.

Similar a otros tipos de volúmenes - los volúmenes FlexVolume también pueden ser expandidos cuando están en uso por un Pod.

{{< note >}}
El redimensionamiento de FlexVolume es posible solo cuando el controlador subyacente soporta el redimensionamiento.
{{< /note >}}

#### Recuperación de fallos al expandir volúmenes

Si un usuario especifica un nuevo tamaño que es demasiado grande para ser satisfecho por el sistema de almacenamiento subyacente, la expansión del PVC será reintentada continuamente hasta que el usuario o el administrador del clúster tomen alguna acción. Esto puede ser indeseable y por lo tanto Kubernetes proporciona los siguientes métodos de recuperación de tales fallos.

{{< tabs name="recovery_methods" >}}
{{% tab name="Manualmente con acceso de Administrador del Clúster" %}}

Si la expansión del almacenamiento subyacente falla, el administrador del clúster puede recuperar manualmente
el estado del Persistent Volume Claim (PVC) y cancelar las solicitudes de redimensionamiento.
De lo contrario, las solicitudes de redimensionamiento son reintentadas continuamente por el controlador sin
intervención del administrador.

1. Marca el PersistentVolume (PV) que está vinculado al PersistentVolumeClaim (PVC) con una política de reclamación `Retain`.
2. Elimina el PVC. Dado que el PV tiene una política de reclamación `Retain`, no perderemos ningún dato al recrear el PVC.
3. Elimina la entrada `claimRef` de las especificaciones del PV, para que un nuevo PVC pueda vincularse a él. Esto debería hacer que el PV esté `Available` (Disponible).
4. Vuelve a crear el PVC con un tamaño menor que el PV y establece el campo `volumeName` del PVC con el nombre del PV. Esto debería vincular el nuevo PVC al PV existente.
5. No olvides restaurar la política de reclamación del PV.

{{% /tab %}}
{{% tab name="Solicitando ampliación a un tamaño menor" %}}
{{% feature-state for_k8s_version="v1.23" state="alpha" %}}

{{< note >}}
La recuperación de la expansión fallida de PVC por parte de los usuarios está disponible como una característica alfa desde Kubernetes 1.23. La funcionalidad `RecoverVolumeExpansionFailure` debe estar habilitada para que esta característica funcione. Consulta la documentación de [interruptores de funcionalidades](/docs/reference/command-line-tools-reference/feature-gates/) para más información.
{{< /note >}}

Si el interruptor de funcionalidad de `RecoverVolumeExpansionFailure` está habilitado en tu clúster, y la expansión ha fallado para un PVC, puedes intentar nuevamente la expansión con un tamaño menor al valor previamente solicitado. Para solicitar un nuevo intento de expansión con un tamaño propuesto menor, edita `.spec.resources` para ese PVC y elige un valor que sea menor al valor que intentaste previamente.
Esto es útil si la expansión a un valor más alto no tuvo éxito debido a una restricción de capacidad.
Si eso ha ocurrido, o sospechas que podría haber ocurrido, puedes intentar nuevamente la expansión especificando un tamaño que esté dentro de los límites de capacidad del proveedor de almacenamiento subyacente. Puedes monitorear el estado de la operación de redimensionamiento observando `.status.allocatedResourceStatuses` y los eventos en el PVC.

Ten en cuenta que, aunque puedes especificar una cantidad menor de almacenamiento que la solicitada anteriormente, el nuevo valor aún debe ser mayor que `.status.capacity`.
Kubernetes no admite reducir un PVC a menos de su tamaño actual.
{{% /tab %}}
{{% /tabs %}}

## Tipos de Persistent Volumes

Los tipos de PersistentVolume se implementan como plugins. Actualmente, Kubernetes admite los siguientes plugins:

- [`csi`](/es/docs/concepts/storage/volumes/#csi) - Interfaz de Almacenamiento de Contenedores (CSI)
- [`fc`](/es/docs/concepts/storage/volumes/#fc) - Almacenamiento de Canal de Fibra (FC)
- [`hostPath`](/es/docs/concepts/storage/volumes/#hostpath) - Volumen HostPath
  (solo para pruebas en un único nodo; NO FUNCIONARÁ en un clúster multinodo;
  considera usar el volumen `local` en su lugar)
- [`iscsi`](/es/docs/concepts/storage/volumes/#iscsi) - iSCSI (SCSI sobre IP) almacenamiento
- [`local`](/es/docs/concepts/storage/volumes/#local) - dispositivos de almacenamiento locales
  montados en los nodos.
- [`nfs`](/es/docs/concepts/storage/volumes/#nfs) - Almacenamiento del Sistema de Archivos de Red (NFS)

Los siguientes tipos de PersistentVolume están obsoletos.
Esto significa que el soporte aún está disponible, pero se eliminará en una futura versión de Kubernetes.

- [`azureFile`](/es/docs/concepts/storage/volumes/#azurefile) - Azure File
  (**obsoleto** en v1.21)
- [`flexVolume`](/es/docs/concepts/storage/volumes/#flexvolume) - FlexVolume
  (**obsoleto** en v1.23)
- [`portworxVolume`](/es/docs/concepts/storage/volumes/#portworxvolume) - Volumen Portworx
  (**obsoleto** en v1.25)
- [`vsphereVolume`](/es/docs/concepts/storage/volumes/#vspherevolume) - Volumen VMDK de vSphere
  (**obsoleto** en v1.19)
- [`cephfs`](/es/docs/concepts/storage/volumes/#cephfs) - Volumen CephFS
  (**obsoleto** en v1.28)
- [`rbd`](/es/docs/concepts/storage/volumes/#rbd) - Dispositivo de Bloque Rados (RBD)
  (**obsoleto** en v1.28)

Versiones anteriores de Kubernetes también soportaban los siguientes tipos de PersistentVolume integrados:

- [`awsElasticBlockStore`](/es/docs/concepts/storage/volumes/#awselasticblockstore) - AWS Elastic Block Store (EBS)
  (**no disponible** en v1.27)
- [`azureDisk`](/es/docs/concepts/storage/volumes/#azuredisk) - Disco Azure
  (**no disponible** en v1.27)
- [`cinder`](/es/docs/concepts/storage/volumes/#cinder) - Cinder (almacenamiento en bloque de OpenStack)
  (**no disponible** en v1.26)
- `photonPersistentDisk` - Disco persistente del controlador Photon.
  (**no disponible** a partir de v1.15)
- `scaleIO` - Volumen ScaleIO.
  (**no disponible** a partir de v1.21)
- `flocker` - Almacenamiento Flocker.
  (**no disponible** a partir de v1.25)
- `quobyte` - Volumen Quobyte.
  (**no disponible** a partir de v1.25)
- `storageos` - Volumen StorageOS.
  (**no disponible** a partir de v1.25)

## Volúmenes Persistentes

Cada PV contiene una especificación y un estado, que corresponden a la especificación y el estado del volumen.
El nombre de un objeto PersistentVolume debe ser un válido
[nombre de subdominio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

{{< note >}}
Es posible que se requieran programas auxiliares relacionados con el tipo de volumen para el uso de un PersistentVolume dentro de un clúster. En este ejemplo, el PersistentVolume es de tipo NFS y se requiere el programa auxiliar /sbin/mount.nfs para permitir el montaje de sistemas de archivos NFS.
{{< /note >}}

### Capacidad

Por lo general, un PV tendrá una capacidad de almacenamiento específica. Esto se establece utilizando el atributo `capacity` del PV. Lea el término del glosario [Cantidad](/docs/reference/glossary/?all=true#term-quantity) para comprender las unidades esperadas por `capacity`.

Actualmente, el tamaño de almacenamiento es el único recurso que se puede establecer o solicitar. En el futuro, los atributos adicionales pueden incluir IOPS, throughput, etc.

### Modo de Volumen

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Kubernetes admite dos `volumeModes` (modos de volumen) para PersistentVolumes: `Filesystem` y `Block` (Sistema de archivos y Bloque).

`volumeMode` es un parámetro opcional de la API.
`Filesystem` es el modo predeterminado que se utiliza cuando se omite el parámetro `volumeMode`.

Un volumen con `volumeMode: Filesystem` se _monta_ en Pods en un directorio. Si el volumen está respaldado por un dispositivo de bloque y el dispositivo está vacío, Kubernetes crea un sistema de archivos en el dispositivo antes de montarlo por primera vez.

Puedes establecer el valor de `volumeMode` en `Block` para utilizar un volumen como un dispositivo de bloque sin formato. Este tipo de volumen se presenta en un Pod como un dispositivo de bloque, sin ningún sistema de archivos en él.
Este modo es útil para proporcionar al Pod la forma más rápida posible de acceder a un volumen, sin ninguna capa de sistema de archivos entre el Pod y el volumen.

Por otro lado, la aplicación que se ejecuta en el Pod debe saber cómo manejar un dispositivo de bloque sin formato.

Consulta [Soporte para Volúmenes en Bloque sin Procesar](#soporte-para-volumenes-en-bloque-sin-procesar) para ver un ejemplo de cómo usar un volumen con `volumeMode: Block` en un Pod.

### Modos de Acceso

Un PersistentVolume puede montarse en un host de cualquier manera compatible con el proveedor de recursos. Como se muestra en la tabla a continuación, los proveedores tendrán diferentes capacidades y los modos de acceso de cada PV se establecerán en los modos específicos admitidos por ese volumen en particular.
Por ejemplo, NFS puede admitir múltiples clientes de lectura/escritura, pero un PV de NFS específico podría exportarse en el servidor como de solo lectura. Cada PV tiene su propio conjunto de modos de acceso que describen las capacidades específicas de ese PV en particular.

Los modos de acceso son:

`ReadWriteOnce`
: el volumen puede montarse como lectura-escritura por un solo nodo. El modo de acceso ReadWriteOnce aún puede permitir que varios Pods accedan al volumen cuando los Pods se ejecutan en el mismo nodo. Para el acceso de un solo Pod, consulta ReadWriteOncePod.

`ReadOnlyMany`
: el volumen puede montarse como solo lectura por muchos nodos.

`ReadWriteMany`
: el volumen puede montarse como lectura-escritura por muchos nodos.

`ReadWriteOncePod`
: {{< feature-state for_k8s_version="v1.29" state="stable" >}}
el volumen puede montarse como lectura-escritura por un solo Pod. Utiliza el modo de acceso ReadWriteOncePod si deseas garantizar que solo un Pod en todo el clúster pueda leer ese PVC o escribir en él.

{{< note >}}
El modo de acceso `ReadWriteOncePod` solo es compatible con los volúmenes {{< glossary_tooltip text="CSI" term_id="csi" >}} y Kubernetes versión 1.22+. Para utilizar esta función, deberás actualizar los siguientes [CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html) a estas versiones o superiores:

- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
  {{< /note >}}

En la línea de comandos (CLI), los modos de acceso se abrevian de la siguiente manera:

- RWO - ReadWriteOnce (Lectura/Escritura para Uno)
- ROX - ReadOnlyMany (Solo Lectura para Muchos)
- RWX - ReadWriteMany (Lectura/Escritura para Muchos)
- RWOP - ReadWriteOncePod (Lectura/Escritura para Uno por Pod)

{{< note >}}
Kubernetes utiliza modos de acceso de volumen para hacer coincidir las solicitudes de PersistentVolumeClaims y los PersistentVolumes. En algunos casos, los modos de acceso de volumen también restringen dónde se puede montar el PersistentVolume. Los modos de acceso de volumen **no** imponen protección contra escritura una vez que el almacenamiento se ha montado. Incluso si se especifican los modos de acceso como ReadWriteOnce, ReadOnlyMany o ReadWriteMany, no establecen ninguna restricción en el volumen. Por ejemplo, incluso si se crea un PersistentVolume como ReadOnlyMany, no garantiza que sea de solo lectura. Si los modos de acceso se especifican como ReadWriteOncePod, el volumen está restringido y solo se puede montar en un único Pod.
{{< /note >}}

> **¡Importante!** Un volumen solo puede montarse utilizando un modo de acceso a la vez, incluso si admite varios modos.

| Volume Plugin  |     ReadWriteOnce     |     ReadOnlyMany      |           ReadWriteMany            | ReadWriteOncePod      |
| :------------- | :-------------------: | :-------------------: | :--------------------------------: | --------------------- | --- |
| AzureFile      |       &#x2713;        |       &#x2713;        |              &#x2713;              | -                     |
| CephFS         |       &#x2713;        |       &#x2713;        |              &#x2713;              | -                     |
| CSI            | depends on the driver | depends on the driver |       depends on the driver        | depends on the driver |
| FC             |       &#x2713;        |       &#x2713;        |                 -                  | -                     |
| FlexVolume     |       &#x2713;        |       &#x2713;        |       depends on the driver        | -                     |
| HostPath       |       &#x2713;        |           -           |                 -                  | -                     |
| iSCSI          |       &#x2713;        |       &#x2713;        |                 -                  | -                     |
| NFS            |       &#x2713;        |       &#x2713;        |              &#x2713;              | -                     |
| RBD            |       &#x2713;        |       &#x2713;        |                 -                  | -                     |
| VsphereVolume  |       &#x2713;        |           -           | - (works when Pods are collocated) | -                     |
| PortworxVolume |       &#x2713;        |           -           |              &#x2713;              | -                     | -   |

### Clase

Un PV puede tener una clase, que se especifica configurando el atributo `storageClassName` con el nombre de una [StorageClass](/es/docs/concepts/storage/storage-classes/). Un PV de una clase particular solo puede vincularse a PVC que soliciten esa clase. Un PV sin `storageClassName` no tiene clase y solo puede vincularse a PVC que no soliciten una clase en particular.

En el pasado, en lugar del atributo `storageClassName`, se utilizaba la anotación `volume.beta.kubernetes.io/storage-class`. Esta anotación todavía funciona; sin embargo, quedará completamente en desuso en una versión futura de Kubernetes.

### Política de Reclamación

Las políticas de reclamación actuales son:

- Retain (Retener) -- reclamación manual
- Recycle (Reciclar) -- limpieza básica (`rm -rf /elvolumen/*`)
- Delete (Eliminar) -- eliminar el volumen

Para Kubernetes {{< skew currentVersion >}}, solo los tipos de volumen `nfs` y `hostPath` admiten el reciclaje.

### Opciones de Montaje

Un administrador de Kubernetes puede especificar opciones de montaje adicionales cuando se monta un Persistent Volume en un nodo.

{{< note >}}
No todos los tipos de Persistent Volumes admiten opciones de montaje.
{{< /note >}}

Los siguientes tipos de volumen admiten opciones de montaje:

- `azureFile`
- `cephfs` (**desaconsejado** en v1.28)
- `cinder` (**desaconsejado** en v1.18)
- `iscsi`
- `nfs`
- `rbd` (**desaconsejado** en v1.28)
- `vsphereVolume`

Las opciones de montaje no se validan. Si una opción de montaje es inválida, el montaje falla.

En el pasado, en lugar del atributo `mountOptions`, se utilizaba la anotación `volume.beta.kubernetes.io/mount-options`. Esta anotación todavía funciona; sin embargo, quedará completamente en desuso en una versión futura de Kubernetes. Se recomienda utilizar el atributo `mountOptions` para especificar las opciones de montaje en lugar de la anotación.

### Afinidad de Nodos

{{< note >}}
Para la mayoría de los tipos de volumen, no es necesario establecer este campo.
Debes establecer esto explícitamente para los volúmenes [locales](/es/docs/concepts/storage/volumes/#local).
{{< /note >}}

Un PV puede especificar la afinidad de nodos para definir restricciones que limiten desde qué nodos se puede acceder a este volumen. Los Pods que utilizan un PV solo se programarán en nodos seleccionados por la afinidad de nodos. Para especificar la afinidad de nodos, configura `nodeAffinity` en `.spec` de un PV. La referencia de API de [PersistentVolume](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec) tiene más detalles sobre este campo.

### Fase

Un PersistentVolume estará en una de las siguientes fases:

`Available` (Disponible)
: un recurso gratuito que aún no está vinculado a una solicitud

`Bound` (Vinculado)
: el volumen está vinculado a una solicitud

`Released` (Liberado)
: la solicitud ha sido eliminada, pero el recurso de almacenamiento asociado aún no ha sido reclamado por el clúster

`Failed` (Fallido)
: el volumen ha fallado en su proceso de reclamación (automatizada)

Puedes ver el nombre de la PVC vinculada al PV utilizando `kubectl describe persistentvolume <nombre>`.

#### Marca de tiempo de transición de fase

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

El campo `.status` de un PersistentVolume puede incluir un campo `lastPhaseTransitionTime` en versión alfa. Este campo registra la marca de tiempo de la última transición de fase del volumen. Para volúmenes recién creados, la fase se establece en `Pending` (Pendiente) y `lastPhaseTransitionTime` se establece en el tiempo actual.

{{< note >}}
Debes habilitar el [interruptor de funcionalidad](/docs/reference/command-line-tools-reference/feature-gates/) `PersistentVolumeLastPhaseTransitionTime` para poder usar o ver el campo `lastPhaseTransitionTime`.
{{< /note >}}

## PersistentVolumeClaims

Cada PVC contiene un spec (especificación) y un status (estado), que es la especificación y el estado de la solicitud. El nombre de un objeto PersistentVolumeClaim debe ser un [nombre de subdominio DNS válido](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - { key: environment, operator: In, values: [dev] }
```

### Modos de Acceso

Las solicitudes utilizan [las mismas convenciones que los volúmenes](#modos-de-acceso) al solicitar almacenamiento con modos de acceso específicos.

### Modos de Volumen

Las solicitudes utilizan [la misma convención que los volúmenes](#modo-de-volumen) para indicar el consumo del volumen como un sistema de archivos o un dispositivo de bloque.

### Recursos

Las solicitudes, al igual que los Pods, pueden solicitar cantidades específicas de un recurso. En este caso, la solicitud es para almacenamiento. El mismo [modelo de recurso](https://git.k8s.io/design-proposals-archive/scheduling/resources.md) se aplica tanto a los volúmenes como a las solicitudes.

### Selector

Las solicitudes pueden especificar un [selector de etiqueta](/es/docs/concepts/overview/working-with-objects/labels/#label-selectors) para filtrar aún más el conjunto de volúmenes. Solo los volúmenes cuyas etiquetas coincidan con el selector pueden vincularse a la solicitud. El selector puede constar de dos campos:

- `matchLabels` (coincidencia de etiquetas) - el volumen debe tener una etiqueta con este valor.
- `matchExpressions` (expresiones de coincidencia) - una lista de requisitos especificados por clave, lista de valores y operador que relaciona la clave y los valores. Los operadores válidos incluyen In, NotIn, Exists y DoesNotExist.

Todos los requisitos, tanto de `matchLabels` como de `matchExpressions`, se combinan mediante un operador AND: todos deben cumplirse para que haya coincidencia.

### Clase

Una solicitud puede solicitar una clase en particular especificando el nombre de una [StorageClass](/es/docs/concepts/storage/storage-classes/) utilizando el atributo `storageClassName`. Solo los PV de la clase solicitada, es decir, aquellos con el mismo `storageClassName` que el PVC, pueden vincularse al PVC.

Las PVC no necesariamente tienen que solicitar una clase. Una PVC con su `storageClassName` configurado igual a `""` siempre se interpreta como una solicitud de un PV sin clase, por lo que solo puede vincularse a PV sin clase (sin anotación o con `""` configurado). Una PVC sin `storageClassName` no es exactamente lo mismo y se trata de manera diferente por parte del clúster, dependiendo de si el plugin de admisión [`DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) está activado.

- Si el plugin de admisión está activado, el administrador puede especificar una StorageClass predeterminada. Todas las PVC que no tengan `storageClassName` solo podrán vincularse a los PV de esa clase predeterminada. La especificación de una StorageClass predeterminada se realiza configurando la anotación `storageclass.kubernetes.io/is-default-class` igual a `true` en un objeto StorageClass. Si el administrador no especifica una predeterminada, el clúster responderá a la creación de PVC como si el plugin de admisión estuviera desactivado. Si se especifican más de una StorageClass predeterminada, la más nueva se utilizará cuando se provisione dinámicamente la PVC.
- Si el plugin de admisión está desactivado, no existe una noción de una StorageClass predeterminada. Todas las PVC que tengan `storageClassName` configurado como `""` solo podrán vincularse a los PV que también tengan `storageClassName` configurado como `""`. Sin embargo, las PVC sin `storageClassName` pueden actualizarse más adelante una vez que esté disponible la StorageClass predeterminada. Si la PVC se actualiza, ya no se vinculará a los PV que tengan `storageClassName` configurado como `""`.

Consulta [asignación retroactiva de StorageClass predeterminada](#retroactive-default-storageclass-assignment) para obtener más detalles.

Según el método de instalación, el administrador puede implementar una StorageClass predeterminada en un clúster de Kubernetes mediante el administrador de complementos durante la instalación.

Cuando una PVC especifica un `selector` además de solicitar una StorageClass, los requisitos se combinan mediante una operación AND: solo se puede vincular un PV de la clase solicitada y con las etiquetas solicitadas a la PVC.

{{< note >}}
Actualmente, una PVC con un `selector` no vacío no puede tener un PV provisionado dinámicamente para ella.
{{< /note >}}

En el pasado, en lugar del atributo `storageClassName`, se utilizaba la anotación `volume.beta.kubernetes.io/storage-class`. Esta anotación todavía funciona; sin embargo, no será compatible en futuras versiones de Kubernetes. Se recomienda utilizar el atributo `storageClassName` en su lugar.

#### Asignación retroactiva de StorageClass predeterminada

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

Puedes crear una PersistentVolumeClaim sin especificar un `storageClassName` para la nueva PVC, incluso cuando no exista una StorageClass predeterminada en tu clúster. En este caso, la nueva PVC se crea tal como la definiste, y el `storageClassName` de esa PVC permanece sin configurar hasta que esté disponible la predeterminada.

Cuando está disponible una StorageClass predeterminada, el plano de control identifica cualquier PVC existente sin `storageClassName`. Para las PVC que tienen un valor vacío para `storageClassName` o que no tienen esta clave, el plano de control actualiza esas PVC para establecer `storageClassName` de acuerdo con la nueva StorageClass predeterminada. Si tienes una PVC existente donde `storageClassName` es `""`, y configuras una StorageClass predeterminada, entonces esta PVC no se actualizará.

Para seguir vinculando a PV con `storageClassName` configurado como `""` (mientras existe una StorageClass predeterminada), debes establecer el `storageClassName` de la PVC asociada en `""`.

Este comportamiento ayuda a los administradores a cambiar la StorageClass predeterminada eliminando primero la antigua y luego creando o configurando otra. Este breve período en el que no hay una predeterminada hace que las PVC creadas en ese momento sin `storageClassName` no tengan ninguna predeterminada, pero debido a la asignación retroactiva de la StorageClass predeterminada, esta forma de cambiar las predeterminadas es segura.

## Solicitudes como Volúmenes

Los Pods acceden al almacenamiento utilizando la solicitud como un volumen. Las solicitudes deben existir en el mismo Namespace que el Pod que utiliza la solicitud. El clúster encuentra la solicitud en el Namespace del Pod y la utiliza para obtener el PersistentVolume que respalda la solicitud. Luego, el volumen se monta en el host y dentro del Pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
        - mountPath: "/var/www/html"
          name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

### Una Nota sobre Espacios de Nombres

Las vinculaciones de PersistentVolumes son exclusivas y, dado que las PersistentVolumeClaims son objetos con espacio de nombres, montar solicitudes con modos "Many" (`ROX`, `RWX`) solo es posible dentro de un mismo espacio de nombres (namespace).

### Los PersistentVolumes de tipo `hostPath`

Los PersistentVolumes de tipo `hostPath` utilizan un archivo o directorio en el nodo para emular almacenamiento conectado a la red. Consulta [un ejemplo de un volumen de tipo `hostPath`](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).

## Soporte para Volúmenes en Bloque sin Procesar

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Los siguientes complementos de volumen admiten volúmenes en bloque sin procesar, incluida la provisión dinámica cuando corresponda:

- CSI
- FC (Fibre Channel)
- iSCSI
- Volumen local
- OpenStack Cinder
- RBD (desaconsejado)
- RBD (Ceph Block Device; desaconsejado)
- VsphereVolume

### PersistentVolume que Utiliza un Volumen en Bloque sin Procesar {#persistent-volume-using-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: block-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  persistentVolumeReclaimPolicy: Retain
  fc:
    targetWWNs: ["50060e801049cfd1"]
    lun: 0
    readOnly: false
```

### PersistentVolumeClaim Solicitando un Volumen en Bloque sin Procesar {#persistent-volume-claim-requesting-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: block-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  resources:
    requests:
      storage: 10Gi
```

### Especificación de Pod Agregando la Ruta del Dispositivo en Bloque sin Procesar en el Contenedor

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: fc-container
      image: fedora:26
      command: ["/bin/sh", "-c"]
      args: ["tail -f /dev/null"]
      volumeDevices:
        - name: data
          devicePath: /dev/xvda
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: block-pvc
```

{{< note >}}
Cuando agregas un dispositivo en bloque sin procesar para un Pod, especificas la ruta del dispositivo en el contenedor en lugar de una ruta de montaje.
{{< /note >}}

### Vinculación de Volúmenes en Bloque

Si un usuario solicita un volumen en bloque sin procesar indicándolo mediante el campo `volumeMode` en la especificación de PersistentVolumeClaim, las reglas de vinculación difieren ligeramente de versiones anteriores que no consideraban este modo como parte de la especificación. A continuación, se muestra una tabla de las posibles combinaciones que el usuario y el administrador pueden especificar para solicitar un dispositivo en bloque sin procesar. La tabla indica si el volumen se vinculará o no dadas las combinaciones: Matriz de vinculación de volumen para volúmenes provisionados estáticamente:

| PV volumeMode | PVC volumeMode |  Resultado |
| ------------- | :------------: | ------: |
| unspecified   |  unspecified   |    BIND |
| unspecified   |     Block      | NO BIND |
| unspecified   |   Filesystem   |    BIND |
| Block         |  unspecified   | NO BIND |
| Block         |     Block      |    BIND |
| Block         |   Filesystem   | NO BIND |
| Filesystem    |   Filesystem   |    BIND |
| Filesystem    |     Block      | NO BIND |
| Filesystem    |  unspecified   |    BIND |

{{< note >}}
Solo se admiten volúmenes provisionados estáticamente en la versión alfa. Los administradores deben tener en cuenta estos valores al trabajar con dispositivos en bloque sin procesar.
{{< /note >}}

## Soporte para Instantáneas de Volúmenes y Restauración de Volúmenes desde Instantáneas

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Las instantáneas de volúmenes solo admiten los plugins de volumen CSI fuera del árbol. Para obtener más detalles, consulta [Instantáneas de Volúmenes](/es/docs/concepts/storage/volume-snapshots/). Los plugins de volumen dentro del árbol están obsoletos. Puedes obtener información sobre los plugins de volumen obsoletos en el [FAQ de Plugins de Volumen](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).

### Crear una PersistentVolumeClaim desde una Instantánea de Volumen {#create-persistent-volume-claim-from-volume-snapshot}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: new-snapshot-test
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Clonación de Volúmenes

[Clonación de Volúmenes](/es/docs/concepts/storage/volume-pvc-datasource/)
solo está disponible para plugins de volumen CSI.

### Crear una PersistentVolumeClaim desde una PVC existente {#create-persistent-volume-claim-from-an-existing-pvc}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cloned-pvc
spec:
  storageClassName: my-csi-plugin
  dataSource:
    name: existing-src-pvc-name
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Pobladores de Volúmenes y Fuentes de Datos

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

Kubernetes admite pobladores de volúmenes personalizados.
Para utilizar pobladores de volúmenes personalizados, debes habilitar la característica `AnyVolumeDataSource`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) para el kube-apiserver y kube-controller-manager.

Los pobladores de volúmenes aprovechan un campo de especificación de PVC llamado `dataSourceRef`. A diferencia del campo `dataSource`, que solo puede contener una referencia a otra PersistentVolumeClaim o a un VolumeSnapshot, el campo `dataSourceRef` puede contener una referencia a cualquier objeto en el mismo Namespace, excepto los objetos principales que no sean PVC. Para los clústeres que tienen habilitada la característica, se prefiere el uso de `dataSourceRef` en lugar de `dataSource`.

## Fuentes de Datos entre Espacios de Nombres

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

Kubernetes admite fuentes de datos de volúmenes entre espacios de nombres.
Para utilizar fuentes de datos de volúmenes entre espacios de nombres, debes habilitar las características `AnyVolumeDataSource` y `CrossNamespaceVolumeDataSource`
[Interruptores de funcionalidades (feature gates)](/docs/reference/command-line-tools-reference/feature-gates/) para el kube-apiserver y kube-controller-manager.
Además, debes habilitar la característica `CrossNamespaceVolumeDataSource` para el csi-provisioner.

Al habilitar la característica `CrossNamespaceVolumeDataSource`, puedes especificar un Namespace en el campo dataSourceRef.

{{< note >}}
Cuando especificas un Namespace para una fuente de datos de volumen, Kubernetes verifica la existencia de un ReferenceGrant en el otro Namespace antes de aceptar la referencia. ReferenceGrant forma parte de las API de extensiones de `gateway.networking.k8s.io`. Consulta [ReferenceGrant](https://gateway-api.sigs.k8s.io/api-types/referencegrant/) en la documentación de la API de Gateway para obtener detalles. Esto significa que debes extender tu clúster de Kubernetes con al menos ReferenceGrant de la API de Gateway antes de poder utilizar este mecanismo.
{{< /note >}}

## Las referencias a fuentes de datos

El campo `dataSourceRef` se comporta de manera casi idéntica al campo `dataSource`. Si se especifica uno mientras que el otro no, el servidor de la API asignará el mismo valor a ambos campos. Ninguno de los campos puede cambiarse después de su creación, y cualquier intento de especificar valores diferentes para los dos campos resultará en un error de validación. Por lo tanto, los dos campos siempre tendrán el mismo contenido.

Hay dos diferencias importantes entre el campo `dataSourceRef` y el campo `dataSource` que los usuarios deben tener en cuenta:

- El campo `dataSource` ignora los valores no válidos (como si el campo estuviera en blanco), mientras que el campo `dataSourceRef` nunca ignora los valores y generará un error si se utiliza un valor no válido. Los valores no válidos son cualquier objeto central (objetos sin apiGroup) excepto PVCs.

- El campo `dataSourceRef` puede contener diferentes tipos de objetos, mientras que el campo `dataSource` solo permite PVCs y VolumeSnapshots.

Cuando se habilita la característica `CrossNamespaceVolumeDataSource`, existen diferencias adicionales:

- El campo `dataSource` solo permite objetos locales, mientras que el campo `dataSourceRef` permite objetos en cualquier Namespaces.
- Cuando se especifica un Namespace, `dataSource` y `dataSourceRef` no están sincronizados.

Los usuarios siempre deben utilizar `dataSourceRef` en clústeres que tengan habilitada la puerta de enlace de características y recurrir a `dataSource` en clústeres que no la tengan habilitada. No es necesario mirar ambos campos bajo ninguna circunstancia. Los valores duplicados con semántica ligeramente diferente existen solo por compatibilidad con versiones anteriores. En particular, una mezcla de controladores más antiguos y más nuevos pueden interoperar porque los campos son iguales.

### Uso de pobladores de volúmenes

Los pobladores de volúmenes son controladores que pueden crear volúmenes no vacíos, donde el contenido del volumen es determinado por un Recurso Personalizado. Los usuarios crean un volumen poblado haciendo referencia a un Recurso Personalizado utilizando el campo `dataSourceRef`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: populated-pvc
spec:
  dataSourceRef:
    name: example-name
    kind: ExampleDataSource
    apiGroup: example.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

Dado que los pobladores de volúmenes son componentes externos, los intentos de crear una PVC que los utilice pueden fallar si no se han instalado todos los componentes correctos. Los controladores externos deben generar eventos en la PVC para proporcionar retroalimentación sobre el estado de la creación, incluyendo advertencias si la PVC no puede ser creada debido a la falta de algún componente necesario. Esto ayuda a los usuarios a comprender por qué la creación de la PVC ha fallado y qué componentes faltan para que funcione correctamente.

Puedes instalar el controlador [volume data source validator](https://github.com/kubernetes-csi/volume-data-source-validator) en tu clúster. Este controlador genera eventos de advertencia en una PVC en caso de que no haya ningún poblador registrado para manejar ese tipo de fuente de datos. Cuando se instala un poblador adecuado para una PVC, es responsabilidad de ese controlador de poblador informar sobre eventos relacionados con la creación del volumen y problemas durante el proceso. Esto proporciona información útil para los usuarios y administradores del clúster sobre el estado y los problemas relacionados con las PVC que utilizan pobladores de volúmenes.

### Uso de una fuente de datos de volumen entre Namespaces

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

Crea un ReferenceGrant para permitir que el propietario del Namespace acepte la referencia.
Define un volumen poblado especificando una fuente de datos de volumen entre Namespaces utilizando el campo `dataSourceRef`. Debes tener un ReferenceGrant válido en el Namespace de origen previamente:

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-ns1-pvc
  namespace: default
spec:
  from:
    - group: ""
      kind: PersistentVolumeClaim
      namespace: ns1
  to:
    - group: snapshot.storage.k8s.io
      kind: VolumeSnapshot
      name: new-snapshot-demo
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: ns1
spec:
  storageClassName: example
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  dataSourceRef:
    apiGroup: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
    namespace: default
  volumeMode: Filesystem
```

## Escribiendo configuraciones portátiles

Si estás escribiendo plantillas de configuración o ejemplos que se ejecutarán en una amplia gama de clústeres y necesitas almacenamiento persistente, se recomienda que utilices el siguiente patrón:

- Incluye objetos PersistentVolumeClaim en tu conjunto de configuración (junto con Despliegues, ConfigMaps, etc.).
- No incluyas objetos PersistentVolume en la configuración, ya que el usuario que instala la configuración puede no tener permisos para crear PersistentVolumes.
- Ofrece al usuario la opción de proporcionar un nombre de clase de almacenamiento al instanciar la plantilla.
  - Si el usuario proporciona un nombre de clase de almacenamiento, coloca ese valor en el campo `persistentVolumeClaim.storageClassName`.
    Esto hará que la PVC coincida con la clase de almacenamiento correcta si el administrador del clúster ha habilitado las StorageClasses.
  - Si el usuario no proporciona un nombre de clase de almacenamiento, deja el campo `persistentVolumeClaim.storageClassName` como nulo. Esto hará que se provisione automáticamente un PV para el usuario con la StorageClass predeterminada en el clúster. Muchos entornos de clúster tienen una StorageClass predeterminada instalada, o los administradores pueden crear su propia StorageClass predeterminada.
- En tus herramientas, observa las PVC que no se están enlazando después de algún tiempo y comunica esto al usuario, ya que esto puede indicar que el clúster no tiene soporte de almacenamiento dinámico (en cuyo caso el usuario debe crear un PV correspondiente) o que el clúster no tiene un sistema de almacenamiento (en cuyo caso el usuario no puede implementar configuraciones que requieran PVCs).

## {{% heading "whatsnext" %}}

- Aprende más sobre [Cómo crear un PersistentVolume](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).
- Aprende más sobre [Cómo crear un PersistentVolumeClaim](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim).
- Lee el [documento de diseño de almacenamiento persistente](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### Referencias de API {#reference}

Puedes encontrar información detallada sobre las APIs [`PersistentVolume`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/) y [`PersistentVolumeClaim`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/) en la documentación oficial de Kubernetes. Estos enlaces te llevarán a las páginas de referencia que describen las especificaciones y los campos de estas API, junto con ejemplos y ejercicios de uso.
