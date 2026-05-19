---
reviewers:
  - edithturn
  - raelga
  - electrocucaracha
title: StorageClass (Clases de Almacenamiento)
content_type: concept
weight: 40
---

<!-- overview -->

Este documento describe el concepto de una StorageClass (Clases de Almacenamiento) en Kubernetes. Necesita estar familiarizado con
[volumes](/docs/concepts/storage/volumes/) y
[persistent volumes](/docs/concepts/storage/persistent-volumes).

<!-- body -->

## Introducción

Una StorageClass proporciona una forma para que los administradores describan las "clases" de
almacenamiento que ofrecen. Diferentes clases pueden corresponder a niveles de calidad de servicio,
o a políticas de copia de seguridad, o a políticas arbitrarias determinadas por los administradores del clúster
de Kubernetes. Kubernetes en sí no tiene opiniones sobre lo que representan las clases. Este concepto a veces se denomina "profiles" en otros sistemas de almacenamiento.

## El recurso StorageClass

Cada StorageClass contiene los campos `provisioner`, `parameters` y
`reclaimPolicy`, que se utilizan cuando un PersistentVolume que pertenece a
la clase debe aprovisionarse dinámicamente.

El nombre de un objeto StorageClass es significativo y es la forma en que los usuarios pueden
solicitar una clase en particular. Los administradores establecen el nombre y otros parámetros
de una clase al crear objetos StorageClass por primera vez, y los objetos no pueden
actualizarse una vez creados.

Los administradores pueden especificar una StorageClass predeterminada solo para los PVC que no
solicite cualquier clase en particular a la que vincularse: vea la
[sección PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
para detalles.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Retain
allowVolumeExpansion: true
mountOptions:
  - debug
volumeBindingMode: Immediate
```

### Proveedor

Cada StorageClass tiene un aprovisionador que determina qué complemento de volumen se usa
para el aprovisionamiento de PV. Este campo debe ser especificado.

| Complemento de volumen | Aprovisionador interno |       Ejemplo de configuración        |
| :--------------------- | :--------------------: | :-----------------------------------: |
| AWSElasticBlockStore   |        &#x2713;        |          [AWS EBS](#aws-ebs)          |
| AzureFile              |        &#x2713;        |       [Azure File](#azure-file)       |
| AzureDisk              |        &#x2713;        |       [Azure Disk](#azure-disk)       |
| CephFS                 |           -            |                   -                   |
| Cinder                 |        &#x2713;        | [OpenStack Cinder](#openstack-cinder) |
| FC                     |           -            |                   -                   |
| FlexVolume             |           -            |                   -                   |
| GCEPersistentDisk      |        &#x2713;        |           [GCE PD](#gce-pd)           |
| iSCSI                  |           -            |                   -                   |
| NFS                    |           -            |              [NFS](#nfs)              |
| RBD                    |        &#x2713;        |         [Ceph RBD](#ceph-rbd)         |
| VsphereVolume          |        &#x2713;        |          [vSphere](#vsphere)          |
| PortworxVolume         |        &#x2713;        |  [Portworx Volume](#portworx-volume)  |
| Local                  |           -            |            [Local](#local)            |

No está restringido especificar los aprovisionadores "internos"
enumerados aquí (cuyos nombres tienen el prefijo "kubernetes.io" y se envían
junto con Kubernetes). También puede ejecutar y especificar aprovisionadores externos,
que son programas independientes que siguen una [especificación](https://git.k8s.io/design-proposals-archive/storage/volume-provisioning.md)
definida por Kubernetes. Los autores de proveedores externos tienen total discreción
sobre dónde vive su código, cómo se envía el aprovisionador, cómo debe ser
ejecutada, qué complemento de volumen usa (incluido Flex), etc. El repositorio
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
alberga una biblioteca para escribir aprovisionadores externos que implementa la mayor parte de
la especificación. Algunos proveedores externos se enumeran en el repositorio
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner).

Por ejemplo, NFS no proporciona un aprovisionador interno, pero se puede usar un aprovisionador externo. También hay casos en los que los proveedores de almacenamiento de terceros proporcionan su propio aprovisionador externo.

### Política de reclamación

Los PersistentVolumes creados dinámicamente por StorageClass tendrán la política de recuperación especificada en el campo `reclaimPolicy` de la clase, que puede ser `Delete` o `Retain`. Si no se especifica `reclaimPolicy` cuando se crea un objeto StorageClass, el valor predeterminado será `Delete`.

Los PersistentVolumes que se crean manualmente y se administran a través de StorageClass tendrán la política de recuperación que se les asignó en el momento de la creación.

### Permitir expansión de volumen

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

PersistentVolumes se puede configurar para que sea ampliable. Esta función, cuando se establece en `true`, permite a los usuarios cambiar el tamaño del volumen editando el objeto de PVC correspondiente.

Los siguientes tipos de volúmenes admiten la expansión de volumen, cuando el StorageClass subyacente tiene el campo `allowVolumeExpansion` establecido en verdadero.

{{< table caption = "Table of Volume types and the version of Kubernetes they require"  >}}

| Tipo de volumen      | Versión requerida de Kubernetes |
| :------------------- | :------------------------------ |
| gcePersistentDisk    | 1.11                            |
| awsElasticBlockStore | 1.11                            |
| Cinder               | 1.11                            |
| rbd                  | 1.11                            |
| Azure File           | 1.11                            |
| Azure Disk           | 1.11                            |
| Portworx             | 1.11                            |
| FlexVolume           | 1.13                            |
| CSI                  | 1.14 (alpha), 1.16 (beta)       |

{{< /table >}}

{{< note >}}
Solo puede usar la función de expansión de volumen para aumentar un volumen, no para reducirlo.
{{< /note >}}

### Opciones de montaje

Los PersistentVolumes creados dinámicamente por StorageClass tendrán las opciones de montaje especificadas en el campo `mountOptions` de la clase.

Si el complemento de volumen no admite opciones de montaje pero se especifican opciones de montaje, el aprovisionamiento fallará. Las opciones de montura no se validan ni en la clase ni en el PV. Si una opción de montaje no es válida, el montaje PV falla.

### Modo de enlace de volumen

El campo `volumeBindingMode` controla cuándo debe ocurrir [enlace de volumen y aprovisionamiento dinámico](/docs/concepts/storage/persistent-volumes/#provisioning). Cuando no está configurado, el modo "Inmediato" se usa de manera predeterminada.

El modo `Inmediato` indica que el enlace de volumen y la dinámica
el aprovisionamiento ocurre una vez que se crea PersistentVolumeClaim. Para los backends de almacenamiento que están restringidos por topología y no son accesibles globalmente desde todos los nodos del clúster, los volúmenes persistentes se vincularán o aprovisionarán sin conocimiento de los requisitos de programación del pod. Esto puede resultar en Pods no programables.

Un administrador de clústeres puede abordar este problema especificando el modo `WaitForFirstConsumer` que retrasará el enlace y el aprovisionamiento de un PersistentVolume hasta que se cree un Pod que use PersistentVolumeClaim.
PersistentVolumes se seleccionarán o aprovisionarán de acuerdo con la topología especificada por las restricciones de programación del pod. Estos incluyen, pero no se limitan a [requerimientos de recursos](/docs/concepts/configuration/manage-resources-containers/),
[node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector),
[pod affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity),
y [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration).

Los siguientes complementos admiten `WaitForFirstConsumer` con aprovisionamiento dinámico:

- [AWSElasticBlockStore](#aws-ebs)
- [GCEPersistentDisk](#gce-pd)
- [AzureDisk](#azure-disk)

Los siguientes complementos admiten `WaitForFirstConsumer` con enlace PersistentVolume creado previamente:

- Todo lo anterior
- [Local](#local)

{{< feature-state state="stable" for_k8s_version="v1.17" >}}
[CSI volumes](/docs/concepts/storage/volumes/#csi) también son compatibles con el aprovisionamiento dinámico y los PV creados previamente, pero deberá consultar la documentación de un controlador CSI específico para ver sus claves de topología y ejemplos compatibles.

{{< note >}}
Si elige usar `WaitForFirstConsumer`, no use `nodeName` en la especificación del pod para especificar la afinidad del nodo. Si se utiliza `nodeName` en este caso, el planificador se omitirá y el PVC permanecerá en estado `pendiente`.

En su lugar, puede usar el selector de nodos para el nombre de host en este caso, como se muestra a continuación.
{{< /note >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: task-pv-pod
spec:
  nodeSelector:
    kubernetes.io/hostname: kube-01
  volumes:
    - name: task-pv-storage
      persistentVolumeClaim:
        claimName: task-pv-claim
  containers:
    - name: task-pv-container
      image: nginx
      ports:
        - containerPort: 80
          name: "http-server"
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: task-pv-storage
```

### Topologías permitidas

Cuando un operador de clúster especifica el modo de enlace de volumen `WaitForFirstConsumer`, ya no es necesario restringir el aprovisionamiento a topologías específicas en la mayoría de las situaciones. Sin embargo, si todavía es necesario, se puede especificar `allowedTopologies`.

Este ejemplo demuestra cómo restringir la topología de los volúmenes aprovisionados a determinadas
zonas y debe usarse como reemplazo de los parámetros `zone` y `zones` para el
complementos compatibles.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
volumeBindingMode: WaitForFirstConsumer
allowedTopologies:
  - matchLabelExpressions:
      - key: failure-domain.beta.kubernetes.io/zone
        values:
          - us-central-1a
          - us-central-1b
```

## Parámetros

Las clases de almacenamiento tienen parámetros que describen los volúmenes que pertenecen a la clase de almacenamiento. Se pueden aceptar diferentes parámetros dependiendo del `provisioner`. Por ejemplo, el valor `io1`, para el parámetro `type` y el parámetro `iopsPerGB` son específicos de EBS. Cuando se omite un parámetro, se utiliza algún valor predeterminado.

Puede haber como máximo 512 parámetros definidos para StorageClass.
La longitud total del objeto de parámetros, incluidas sus claves y valores, no puede superar los 256 KiB.

### AWS EBS

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/aws-ebs
parameters:
  type: io1
  iopsPerGB: "10"
  fsType: ext4
```

- `type`: `io1`, `gp2`, `sc1`, `st1`. Ver
  [AWS docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)
  para detalles. Por defecto: `gp2`.
- `zone` (Obsoleto): AWS zona. Si no se especifica `zone` ni `zones`, los volúmenes generalmente se distribuyen por turnos en todas las zonas activas donde el clúster de Kubernetes tiene un nodo. Los parámetros `zone` y `zones` no deben usarse al mismo tiempo.
- `zones` (Obsoleto): una lista separada por comas de las zonas de AWS. Si no se especifica `zone` ni `zones`, los volúmenes generalmente se distribuyen por turnos en todas las zonas activas donde el clúster de Kubernetes tiene un nodo. Los parámetros `zone` y `zones` no deben usarse al mismo tiempo.

- `iopsPerGB`: solo para volúmenes `io1`. Operaciones de E/S por segundo por GiB. El complemento de volumen de AWS multiplica esto por el tamaño del volumen solicitado para calcular las IOPS del volumen y lo limita a 20 000 IOPS (máximo admitido por AWS, consulte [Documentos de AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)). Aquí se espera una cadena, es decir, `"10"`, no `10`.
- `fsType`: fsType que es compatible con kubernetes. Predeterminado: `"ext4"`.
- `encrypted`: indica si el volumen de EBS debe cifrarse o no. Los valores válidos son `"true"` o `"false"`. Aquí se espera una cadena, es decir, `"true"`, no `true`.
- `kmsKeyId`: opcional. El nombre de recurso de Amazon completo de la clave que se utilizará al cifrar el volumen. Si no se proporciona ninguno pero `encrypted` es verdadero, AWS genera una clave. Consulte los documentos de AWS para obtener un valor de ARN válido.

{{< note >}}
`zone` y `zones` Los parámetros están en desuso y se reemplazan con
[allowedTopologies](#allowed-topologies)
{{< /note >}}

### GCE PD

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  fstype: ext4
  replication-type: none
```

- `type`: `pd-standard` o `pd-ssd`. Por defecto: `pd-standard`
- `zone` (Obsoleto): zona GCE. Si no se especifica `zone` ni `zones`, los volúmenes generalmente se distribuyen por turnos en todas las zonas activas donde el clúster de Kubernetes tiene un nodo. Los parámetros `zone` y `zones` no deben usarse al mismo tiempo.
- `zones` (Obsoleto): Una lista separada por comas de zona(s) GCE. Si no se especifica `zone` ni `zones`, los volúmenes generalmente se distribuyen por turnos en todas las zonas activas donde el clúster de Kubernetes tiene un nodo. Los parámetros `zone` y `zones` no deben usarse al mismo tiempo.

- `fstype`: `ext4` o `xfs`. Por defecto: `ext4`. El tipo de sistema de archivos definido debe ser compatible con el sistema operativo host.
- `replication-type`: `none` or `regional-pd`. Por defecto: `none`.

Si `replication-type` se establece en `none`, se aprovisionará un PD regular (zonal).

Si `replication-type` se establece en`regional-pd`, a
[Regional Persistent Disk](https://cloud.google.com/compute/docs/disks/#repds)
será aprovisionado. Es muy recomendable tener
`volumeBindingMode: WaitForFirstConsumer` establecido, en cuyo caso cuando crea un Pod que consume un PersistentVolumeClaim que usa esta clase de almacenamiento, un disco persistente regional se aprovisiona con dos zonas. Una zona es la misma que la zona en la que está programado el Pod. La otra zona se selecciona aleatoriamente de las zonas disponibles para el clúster. Las zonas de disco se pueden restringir aún más usando `allowedTopologies`.

{{< note >}}
`zone` y `zones` parámetros están en desuso y se reemplazan con
[allowedTopologies](#allowed-topologies)
{{< /note >}}

### NFS

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-nfs
provisioner: example.com/external-nfs
parameters:
  server: nfs-server.example.com
  path: /share
  readOnly: "false"
```

- `server`: Servidor es el nombre de host o la dirección IP del servidor NFS.
- `path`: Ruta que exporta el servidor NFS.
- `readOnly`: Una bandera que indica si el almacenamiento se montará como solo lectura (falso por defecto)

Kubernetes no incluye un proveedor de NFS interno. Debe usar un aprovisionador externo para crear una StorageClass para NFS.
Aquí hay unos ejemplos:

- [Servidor NFS Ganesha y aprovisionador externo](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
- [Aprovisionador externo de subdirección NFS](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)

### OpenStack Cinder

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gold
provisioner: kubernetes.io/cinder
parameters:
  availability: nova
```

- `availability`: Zona de disponibilidad. Si no se especifica, los volúmenes generalmente se distribuyen por turnos en todas las zonas activas donde el clúster de Kubernetes tiene un nodo.

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.11" >}}
Este proveedor interno de OpenStack está obsoleto. Por favor use [el proveedor de nube externo para OpenStack](https://github.com/kubernetes/cloud-provider-openstack).
{{< /note >}}

### vSphere

Hay dos tipos de aprovisionadores para las clases de almacenamiento de vSphere:

- [CSI provisioner](#vsphere-provisioner-csi): `csi.vsphere.vmware.com`
- [vCP provisioner](#vcp-provisioner): `kubernetes.io/vsphere-volume`

Los proveedores In-tree estan [obsoletos](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi). Para obtener más información sobre el aprovisionador de CSI, consulte [Kubernetes vSphere CSI Driver](https://vsphere-csi-driver.sigs.k8s.io/) y [vSphereVolume CSI migration](/docs/concepts/storage/volumes/#vsphere-csi-migration).

#### Aprovisionador de CSI {#vsphere-provisioner-csi}

El aprovisionador vSphere CSI StorageClass funciona con clústeres de Tanzu Kubernetes. Para ver un ejemplo, consulte el [vSphere CSI repository](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml).

#### Aprovisionador de vCP

Los siguientes ejemplos utilizan el aprovisionador StorageClass de VMware Cloud Provider (vCP).

1. Cree una StorageClass con un formato de disco especificado por el usuario.

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: fast
   provisioner: kubernetes.io/vsphere-volume
   parameters:
     diskformat: zeroedthick
   ```

   `diskformat`: `thin`, `zeroedthick` y `eagerzeroedthick`. Por defecto: `"thin"`.

2. Cree una StorageClass con un formato de disco en un almacén de datos especificado por el usuario.

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: fast
   provisioner: kubernetes.io/vsphere-volume
   parameters:
     diskformat: zeroedthick
     datastore: VSANDatastore
   ```

   `datastore`: el usuario también puede especificar el almacén de datos en StorageClass. El volumen se creará en el almacén de datos especificado en StorageClass, que en este caso es `VSANDatastore`. Este campo es opcional. Si no se especifica el almacén de datos, el volumen se creará en el almacén de datos especificado en el archivo de configuración de vSphere utilizado para inicializar vSphere Cloud Provider.

3. Gestión de políticas de almacenamiento dentro de Kubernetes

   - Uso de la política de vCenter SPBM existente

     Una de las características más importantes de vSphere for Storage Management es la administración basada en políticas. La gestión basada en políticas de almacenamiento (SPBM) es un marco de políticas de almacenamiento que proporciona un único plano de control unificado en una amplia gama de servicios de datos y soluciones de almacenamiento. SPBM permite a los administradores de vSphere superar los desafíos iniciales de aprovisionamiento de almacenamiento, como la planificación de la capacidad, los niveles de servicio diferenciados y la gestión del margen de capacidad.

     Las políticas de SPBM se pueden especificar en StorageClass mediante el parámetro `storagePolicyName`.

   - Soporte de políticas Virtual SAN dentro de Kubernetes

     Los administradores de Vsphere Infrastructure (VI) tendrán la capacidad de especificar capacidades de almacenamiento Virtual SAN personalizadas durante el aprovisionamiento dinámico de volúmenes. Ahora puede definir los requisitos de almacenamiento, como el rendimiento y la disponibilidad, en forma de capacidades de almacenamiento durante el aprovisionamiento dinámico de volúmenes.
     Los requisitos de capacidad de almacenamiento se convierten en una política de Virtual SAN que luego se transfiere a la capa de Virtual SAN cuando se crea un volumen persistente (disco virtual). El disco virtual se distribuye en el almacén de datos de Virtual SAN para cumplir con los requisitos.

     Puedes ver la [Administración basada en políticas de almacenamiento para el aprovisionamiento dinámico de volúmenes](https://github.com/vmware-archive/vsphere-storage-for-kubernetes/blob/fa4c8b8ad46a85b6555d715dd9d27ff69839df53/documentation/policy-based-mgmt.md)
     para obtener más detalles sobre cómo utilizar las políticas de almacenamiento para la gestión de volúmenes persistentes.

Hay pocos
[ejemplos de vSphere](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)
que prueba para la administración persistente de volúmenes dentro de Kubernetes para vSphere.

### Ceph RBD

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/rbd
parameters:
  monitors: 10.16.153.105:6789
  adminId: kube
  adminSecretName: ceph-secret
  adminSecretNamespace: kube-system
  pool: kube
  userId: kube
  userSecretName: ceph-secret-user
  userSecretNamespace: default
  fsType: ext4
  imageFormat: "2"
  imageFeatures: "layering"
```

- `monitors`: Monitores Ceph, delimitados por comas. Este parámetro es obligatorio.
- `adminId`: ID de cliente de Ceph que es capaz de crear imágenes en el grupo.
  El valor predeterminado es "admin".
- `adminSecretName`: Nombre secreto para `adminId`. Este parámetro es obligatorio. El secreto proporcionado debe tener el tipo "kubernetes.io/rbd".
- `adminSecretNamespace`: El espacio de nombres para `adminSecretName`. El valor predeterminado es "predeterminado".
- `pool`: Grupo Ceph RBD. El valor predeterminado es "rbd".
- `userId`: ID de cliente de Ceph que se utiliza para asignar la imagen RBD. El valor predeterminado es el mismo que `adminId`.
- `userSecretName`: El nombre de Ceph Secret para `userId` para mapear la imagen RBD. Él
  debe existir en el mismo espacio de nombres que los PVC. Este parámetro es obligatorio.
  El secreto proporcionado debe tener el tipo "kubernetes.io/rbd", por ejemplo creado de esta manera:

  ```shell
  kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
    --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
    --namespace=kube-system
  ```

- `userSecretNamespace`: El espacio de nombres para `userSecretName`.
- `fsType`: fsType que es compatible con Kubernetes. Por defecto: `"ext4"`.
- `imageFormat`: Ceph RBD formato de imagen, "1" o "2". El valor predeterminado es "2".
- `imageFeatures`: Este parámetro es opcional y solo debe usarse si
  establece `imageFormat` a "2". Las características admitidas actualmente son `layering` solamente.
  El valor predeterminado es "" y no hay funciones activadas.

### Azure Disk

#### Clase de almacenamiento Azure Unmanaged Disk {#azure-unmanaged-disk-storage-class}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/azure-disk
parameters:
  skuName: Standard_LRS
  location: eastus
  storageAccount: azure_storage_account_name
```

- `skuName`: Nivel de SKU de la cuenta de almacenamiento de Azure. El valor predeterminado está vacío.
- `location`: Ubicación de la cuenta de almacenamiento de Azure. El valor predeterminado está vacío.
- `storageAccount`: Nombre de la cuenta de almacenamiento de Azure. Si se proporciona una cuenta de almacenamiento, debe residir en el mismo grupo de recursos que el clúster y se ignora la `location`. Si no se proporciona una cuenta de almacenamiento, se creará una nueva cuenta de almacenamiento en el mismo grupo de recursos que el clúster.

#### Clase de almacenamiento Azure Disk (empezando desde v1.7.2) {#azure-disk-storage-class}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/azure-disk
parameters:
  storageaccounttype: Standard_LRS
  kind: managed
```

- `storageaccounttype`: Nivel de SKU de la cuenta de almacenamiento de Azure. El valor predeterminado está vacío.
- `kind`: Los valores posibles `shared`, `dedicated`, y `managed` (por defecto).
  Cuando `kind` es `shared`, todos los discos no administrados se crean en algunas cuentas de almacenamiento compartido en el mismo grupo de recursos que el clúster. Cuando `kind` es
  `dedicated`, se creará una nueva cuenta de almacenamiento dedicada para el nuevo disco no administrado en el mismo grupo de recursos que el clúster. Cuando `kind` es
  `managed`, todos los discos administrados se crean en el mismo grupo de recursos que el clúster.
- `resourceGroup`: Especifique el grupo de recursos en el que se creará el disco de Azure.
  Debe ser un nombre de grupo de recursos existente. Si no se especifica, el disco se colocará en el mismo grupo de recursos que el clúster de Kubernetes actual.

* Premium VM puede conectar discos Standard_LRS y Premium_LRS, mientras que Standard VM solo puede conectar discos Standard_LRS.
* La VM administrada solo puede adjuntar discos administrados y la VM no administrada solo puede adjuntar discos no administrados.

### Azure File

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
parameters:
  skuName: Standard_LRS
  location: eastus
  storageAccount: azure_storage_account_name
```

- `skuName`: Nivel de SKU de la cuenta de almacenamiento de Azure. El valor predeterminado está vacío.
- `location`: Ubicación de la cuenta de almacenamiento de Azure. El valor predeterminado está vacío.
- `storageAccount`: Nombre de la cuenta de almacenamiento de Azure. El valor predeterminado está vacío. Si un almacenamiento
  no se proporciona la cuenta, se buscan todas las cuentas de almacenamiento asociadas con el grupo de recursos para encontrar una que coincida con `skuName` y `location`. Si se proporciona una cuenta de almacenamiento, debe residir en el mismo grupo de recursos que el clúster y se ignoran `skuName` y `location`.
- `secretNamespace`: el espacio de nombres del secreto que contiene el nombre y la clave de la cuenta de Azure Storage. El valor predeterminado es el mismo que el Pod.
- `secretName`: el nombre del secreto que contiene el nombre y la clave de la cuenta de Azure Storage. El valor predeterminado es `azure-storage-account-<accountName>-secret`
- `readOnly`: una bandera que indica si el almacenamiento se montará como de solo lectura. El valor predeterminado es falso, lo que significa un montaje de lectura/escritura. Esta configuración también afectará la configuración `ReadOnly` en VolumeMounts.

Durante el aprovisionamiento de almacenamiento, se crea un secreto denominado `secretName` para las credenciales de montaje. Si el clúster ha habilitado ambos [RBAC](/docs/reference/access-authn-authz/rbac/) y [Controller Roles](/docs/reference/access-authn-authz/rbac/#controller-roles), agregue el permiso de `create` de recurso `secret` para clusterrole
`system:controller:persistent-volume-binder`.

En un contexto de tenencia múltiple, se recomienda enfáticamente establecer el valor para `secretNamespace` explícitamente; de lo contrario, las credenciales de la cuenta de almacenamiento pueden ser leído por otros usuarios.

### Volumen Portworx

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: portworx-io-priority-high
provisioner: kubernetes.io/portworx-volume
parameters:
  repl: "1"
  snap_interval: "70"
  priority_io: "high"
```

- `fs`: sistema de archivos a distribuir: `none/xfs/ext4` (predeterminado: `ext4`).
- `block_size`: tamaño de bloque en Kbytes (predeterminado: `32`).
- `repl`: número de réplicas síncronas que se proporcionarán en forma de
  factor de replicación `1..3` (predeterminado: `1`) Aquí se espera una cadena, es decir
  `"1"` y no `1`.
- `priority_io`: determina si el volumen se creará a partir de un almacenamiento de mayor rendimiento o de menor prioridad `high/medium/low` (predeterminado: `low`).

- `snap_interval`: reloj/intervalo de tiempo en minutos para determinar cuándo activar las instantáneas. Las instantáneas son incrementales según la diferencia con la instantánea anterior, 0 desactiva las instantáneas (predeterminado: `0`). Aquí se espera una cadena, es decir `"70"` y no `70`.
- `aggregation_level`: especifica el número de fragmentos en los que se distribuiría el volumen, 0 indica un volumen no agregado (predeterminado: `0`). Aquí se espera una cadena, es decir, `"0"` y no `0`
- `ephemeral`: especifica si el volumen debe limpiarse después de desmontarlo o si debe ser persistente. El caso de uso `emptyDir` puede establecer este valor en verdadero y el caso de uso de `persistent volumes`, como para bases de datos como Cassandra, debe establecerse en falso, `true/false` (predeterminado `false`). Aquí se espera una cadena, es decir, `"true"` y no `true`.

### Local

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

Actualmente, los volúmenes locales no admiten el aprovisionamiento dinámico; sin embargo, aún se debe crear una StorageClass para retrasar el enlace del volumen hasta la programación del Pod. Esto se especifica mediante el modo de enlace de volumen `WaitForFirstConsumer`.

Retrasar el enlace de volumen permite que el programador considere todos los datos de un Pod.
restricciones de programación al elegir un PersistentVolume apropiado para un PersistentVolumeClaim.
