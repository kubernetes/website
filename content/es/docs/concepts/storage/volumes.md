---
title: Volumes
content_type: concept
weight: 10
---

<!-- overview -->

Los archivos localizados dentro de un contenedor son efímeros, lo cual presenta problemas
para aplicaciones no triviales cuando se ejecutan en contenedores. Un problema es la
pérdida de archivos cuando el contenedor termina. Kubelet reinicia el contenedor con un estado limpio.
Un segundo problema ocurre cuando compartimos ficheros entre contenedores corriendo juntos dentro de un `Pod`. La abstracción {{< glossary_tooltip text="volume" term_id="volume" >}} de Kubernetes resuelve ambos problemas.
Se sugiere familiaridad con [Pods](/docs/concepts/workloads/pods/)

<!-- body -->

## Trasfondo

Docker tiene el concepto de [volúmenes](https://docs.docker.com/storage/), aunque es algo más flojo y menos controlado.
Un volumen de Docker es un directorio en disco o en otro contenedor. Docker provee controladores de volúmenes, pero la funcionalidad es algo limitada.

Kubernetes soporta muchos tipos de volúmenes. Un {{< glossary_tooltip term_id="pod" text="Pod" >}}
puede utilizar cualquier número de tipos de volúmenes simultáneamente. Los tipos de volúmenes efímeros tienen el mismo tiempo de vida que un Pod, pero los volúmenes persistentes existen más allá del tiempo de vida de un Pod. Cuando un Pod deja de existir,
Kubernetes destruye los volúmenes efímeros; sin embargo, Kubernetes no destruye los volúmenes persistentes. Para cualquier tipo de volumen en un Pod dado, los datos son preservados a lo largo de los reinicios del contenedor.

En su núcleo, un volumen es un directorio, posiblemente con algunos datos en este, que puede ser accesible para los contenedores en un Pod. Cómo ese directorio llega a crearse, el medio que lo respalda, y el contenido de este se determinan por el tipo de volumen usado.

Para usar un volumen, especifica los volúmenes a proveer al por en `.spec.volumes` y declara
dónde montar estos volúmenes dentro de los contenedores en `.spec.containers[*].volumeMounts`.
Un proceso en el contenedor observa una vista del sistema de archivos compuesta por la imagen Docker y volúmenes.
La [imagen Docker](https://docs.docker.com/userguide/dockerimages/) está en la raíz de la jerarquía del sistema de archivos.
Los volúmenes se montan en las rutas especificadas dentro de la imagen. Los volúmenes no se pueden montar en otros volúmenes o tener enlaces duros a otros volúmenes. Cada contenedor en la configuración del Pod debe especificar de forma independiente donde montar cada volumen.

## Tipos de volúmenes {#volume-types}

Kubernetes soporta varios tipos de volúmenes

### awsElasticBlockStore {#awselasticblockstore}

Un volumen `awsElasticBlockStore` monta un
[volumen EBS](https://aws.amazon.com/ebs/) de Amazon Web Services (AWS) en tu Pod. A diferencia de
`emptyDir`, que se borra cuando se quita un Pod, el contenido de un volumen EBS es persistido cuando se desmonta el volumen.
Esto significa que un volumen EBS puede ser pre-poblado con datos, y que los datos puedes ser compartidos entre pods.

{{< note >}}
Debes crear un volumen EBS usando `aws ec2 create-volume` o la API de AWS antes de poder usarlo.
{{< /note >}}

Existen algunas restricciones cuando usas un volumen `awsElasticBlockStore`:

- Los nodos en los que corren los pods deben ser instances AWS EC2.
- Estas instancias deben estar en la misma región y zona de disponibilidad que el volumen EBS
- EBS solo soporta una única instancia EC2 montando un volumen

#### Creando un volumen AWS EBS

Antes poder usar un volumen EBS en un Pod, necesitas crearlo.

```shell
aws ec2 create-volume --availability-zone=eu-west-1a --size=10 --volume-type=gp2
```

Asegúrate de que la zona coincide con la zona en que has creado el clúster. Revisa que el tamaño y el tipo de
volumen EBS son compatibles para tu uso.

#### Ejemplo de configuración AWS EBS

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-ebs
spec:
  containers:
    - image: registry.k8s.io/test-webserver
      name: test-container
      volumeMounts:
        - mountPath: /test-ebs
          name: test-volume
  volumes:
    - name: test-volume
      # Este volumen EBS debe existir anteriormente.
      awsElasticBlockStore:
        volumeID: "<volume id>"
        fsType: ext4
```

Si el volumen EBS está particionado, puedes suministrar el campo opcional `partition: "<partition number>"` para especificar cuál partición montar.

#### Migración CSI AWS EBS CSI

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

La función `CSIMigration` para `awsElasticBlockStore`, cuando se habilita, redirige todas las operaciones
de complemento desde el complemento existente dentro del árbol existente al controlador de Interfaz de Almacenamiento del Contenedor (CSI) de `ebs.csi.aws.com`. Para utilizar esta función, el [controlador AWS EBS CSI](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) debe ser instalado en el clúster y las características beta
`CSIMigration` y `CSIMigrationAWS` deben estar habilitadas.

#### Migración CSI AWS EBS CSI completa

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

Para desactivar el complemento de almacenamiento `awsElasticBlockStore` de ser cargado por el administrador de controladores y el kubelet, establece el atributo `CSIMigrationAWSComplete` a `true`. Esta función requiere tener instalado el controlador de interfaz de almacenamiento del contenedor (CSI) en todos los nodos en obreros.

### azureDisk {#azuredisk}

El tipo de volumen `azureDisk` monta un [Data Disk](https://docs.microsoft.com/en-us/azure/aks/csi-storage-drivers) de Microsoft Azure en el Pod.

Para más detalles, mira el [`azureDisk` volume plugin](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_disk/README.md).

#### Migración CSI azureDisk

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

La función `CSIMigration` para `azureDisk`, cuando se habilita, redirige todas las operaciones
de complemento desde el complemento existente dentro del árbol existente al controlador de Interfaz de Almacenamiento del Contenedor (CSI) de `disk.csi.azure.com`. Para utilizar esta función, el [controlador Azure Disk CSI](https://github.com/kubernetes-sigs/azuredisk-csi-driver) debe ser instalado en el clúster y las características beta
`CSIMigration` y `CSIMigrationAzureDisk` deben estar habilitadas.

### azureFile {#azurefile}

El tipo de volumen `azureFile` monta un volumen de ficheros de Microsoft Azure (SMB 2.1 and 3.0) en un Pod.

Para más detalles, mira el [`azureFile` volume plugin](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md).

#### Migración CSI azureFile CSI

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

La función `CSIMigration` para `azureFile`, cuando se habilita, redirige todas las operaciones
de complemento desde el complemento existente dentro del árbol existente al controlador de Interfaz de Almacenamiento del Contenedor (CSI) de `file.csi.azure.com`. Para utilizar esta función, el [controlador Azure File CSI
Driver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
debe ser instalado en el clúster y las [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `CSIMigration` y `CSIMigrationAzureFile` deben estar habilitadas.

El controlador Azure File CSI no soporta usar el mismo volumen con fsgroups diferentes, si está habilitadla migración CSI Azurefile, usar el mismo volumen con fsgorups diferentes no será compatible en absoluto.

### cephfs

Un volumen `cephfs` permite montar un volumen CephFS existente en tu Pod.
A diferencia de `emptydir`, que es borrado cuando se remueve el Pod, el contenido de un volumen `cephfs` es preservado y el volumen es meramente desmontado. Esto significa que un volumen `cephfs`puede ser pre-poblado por múltiples escritores simultáneamente.

{{< note >}}
Debes tener tu propio servidor Ceph corriendo con el recurso compartido exportado antes de usarlo.
{{< /note >}}

Mira el [CephFS example](https://github.com/kubernetes/examples/tree/master/volumes/cephfs/) para más detalles.

### cinder

{{< note >}}
Kubernetes no debe ser configurado con el proveedor cloud OpenStack.
{{< /note >}}

El tipo de volumen `cinder` se usa para montar un volumen Cinder de OpenStack en tu Pod.

#### Cinder volume configuration example

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-cinder
spec:
  containers:
    - image: registry.k8s.io/test-webserver
      name: test-cinder-container
      volumeMounts:
        - mountPath: /test-cinder
          name: test-volume
  volumes:
    - name: test-volume
      # Este volumen de  OpenStack debe existir anteriormente.
      cinder:
        volumeID: "<volume id>"
        fsType: ext4
```

#### Migración CSI OpenStack

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

La función `CSIMigration` para Cinder está habilitada por defecto en Kubernetes 1.21.
Esta redirige todas las operaciones de complemento desde el complemento existente dentro del árbol existente al controlador de Interfaz de Almacenamiento del Contenedor (CSI) de `cinder.csi.openstack.org`.
El controlador [OpenStack Cinder CSI Driver](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md) debe estar instalado en el clúster.

Puedes deshabilitar la migración CSI para tu clúster estableciendo el [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `CSIMigrationOpenStack` a `false`.
Si deshabilitas la función `CSIMigrationOpenStack`, el complemento del volumen Cinder dentro del árbol toma la responsabilidad para todos los aspectos de la administración del almacenamiento del volumen Cinder.

### configMap

Un [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
provee una manera de inyectar datos de configuración a los pods.
Los datos almacenados en un ConfigMap se pueden referenciar en un volumen de tipo `configMap`
y luego ser consumidos por aplicaciones contenerizadas corriendo en un Pod.

Cuando haces referencia a un ConfigMap, provees el nombre del ConfigMap en el volumen.
Puedes personalizar la ruta para una entrada específica en el ConfigMap.
La siguiente configuración muestra cómo montar un ConfigMap `log-config` en un Pod llamado `configmap-pod`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox:1.28
      command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

El ConfigMap `log-config` es montado como un volumen, y todo el contenido almacenado en su entrada `log_level` es
montado en el Pod en la ruta `/etc/config/log_level`. Ten en cuenta que esta ruta se deriva del `mountPath`del volumen y el `path` cuya clave es `log_level`.

{{< note >}}

- Debes crear un [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) antes de usarlo.
- Un contenedor usando un ConfigMap montado como un volumen [`subPath`](#using-subpath) no recibirá actualizaciones del ConfigMap
- Los datos de texto son expuestos como ficheros usando la codificación de caracteres UTF-8. Para otras codificaciones de caracteres, use `binaryData`.
{{< /note >}}

### downwardAPI {#downwardapi}

Un volumen de `downwardAPI` hace que los datos API descendentes estén disponibles para las aplicaciones.
Monta un directorio y escribe los datos solicitados en archivos de texto sin formato.

{{< note >}}
Un contenedor usando la API descendiente montado como un volumen [`subPath`](#using-subpath) no recibirá actualizaciones API descendientes.
{{< /note >}}

Mira el [downward API example](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) para mayores detalles.

### emptyDir {#emptydir}

Un volumen `emptyDir`es creado primero cuando se asigna un Pod a un nodo, y existe mientras el Pod está corriendo en el nodo.
Como su nombre lo indica un volumen `emptydir`está inicialmente vacío. Todos los contenedores en el Pod pueden leer y escribir
los archivos en el volumen `emptyDir`, aunque ese volumen se puede montar en la misma o diferente ruta en cada contenedor. Cuando un Pod es removido del nodo por alguna razón, los datos en `emptydir` se borran permanentemente.

{{< note >}}
Un contenedor que colapsa _no_ remueve el Pod del nodo. Los datos en un volumen `emptyDir` están seguros en caso de
colapso del contenedor.
{{< /note >}}

Algunos usos para un `emptyDir` son:

- Espacio temporal, como para una clasificación de combinación basada en disco
- Marcar un largo cálculo para la recuperación de fallos
- Contener archivos que un contenedor de administrador de contenido recupera mientras un contenedor de servidor web
  sirve los datos

Dependiendo de tu entorno, los volúmenes `emptydir` se almacenan en cualquier medio que respalde el nodo tales como disco SSD, o almacenamiento de red. Sin embargo, si se establece el campo `emptydir.medium` a `Memory`, Kubernetes monta en su lugar un tmpfs (sistema de ficheros respaldado por la RAM). Mientras que tmpfs es muy rápido, ten en cuenta que a diferencia de los discos, tmpfs se limpia cuando el nodo reinicia y cualquier archivo que escribas cuenta con el límite de memoria del contenedor.

{{< note >}}
Si el [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `SizeMemoryBackedVolumes` está habilitado,
puedes especificar un tamaño para los volúmenes respaldados en memoria. Si no se especifica ningún tamaño, los volúmenes respaldados en memoria tienen un tamaño del 50% de la memoria en un host Linux.
{{< /note>}}

#### Ejemplo de configuración de emptyDir

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
    - image: registry.k8s.io/test-webserver
      name: test-container
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
```

### fc (canal de fibra) {#fc}

Un tipo de volumen `fc` permite que un volumen de almacenamiento de bloque de canal de fibra existente se monte en un Pod.
Puede especificar nombres mundiales de destino únicos o múltiples (WWN) utilizando el parámetro `targetWWNs` en su configuración de volumen.
Si se especifican varios WWN, targettWWNs esperan que esos WWN sean de conexiones de múltiples rutas.

{{< note >}}
Debes configurar FC SAN zoning para asignar y enmascarar esos (volúmenes) LUNs para apuntar a los WWNs de destino de antemano
para que los hosts Kubernetes pueda acceder a ellos.
{{< /note >}}

Revisa el [ejemplo de canal de fibra](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel) para más detalles.

### flocker (deprecado) {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) es un administrador open-source de volúmenes de contenedor agrupado por clúster.
Flocker proporciona administración y orquestación de volúmenes de datos respaldados por una variedad de backends de almacenamiento.

Un volumen `flocker` permite montar un conjunto de datos Flocker en un Pod. Si el conjunto de datos no existe en Flocker, necesita ser creado primero con el CLI de Flocker o usando la API de Flocker. Si el conjunto de datos existe será adjuntado
de nuevo por Flocker al nodo donde el Pod está programado. Esto significa que los datos pueden ser compartidos entre pods como sea necesario.

{{< note >}}
Debes tener una instalación propia de Flocker ejecutándose antes de poder usarla.
{{< /note >}}

Mira el [ejemplo de Flocker ](https://github.com/kubernetes/examples/tree/master/staging/volumes/flocker) para más detalles.

### gcePersistentDisk

Un volumen `gcePersistentDisk` monta un volumen de Google Compute Engine (GCE)
de [disco persistente](https://cloud.google.com/compute/docs/disks) (DP) en tu Pod.
A diferencia de `emptyDir`, que se borra cuando el Pod es removido, el contenido de un disco persistente es preservado
y el volumen solamente se desmonta. Esto significa que un disco persistente puede ser pre-poblado con datos,
y que esos datos se pueden compartir entre pods.

{{< note >}}
Debes crear un disco persistente usando `gcloud`, la API de GCE o la UI antes de poder usarlo.
{{< /note >}}

Existen algunas restricciones cuando usas `gcePersistentDisk`:

- Los nodos en los que se ejecutan los pods deben ser máquinas virtuales GCE.
- Esas máquinas virtuales deben estar en el mismo proyecto GCE y zona que el disco persistente se encuentra.

Una de las características del disco persistente CGE es acceso concurrente de solo lectura al disco persistente.
Un volumen `gcePersistentDisk` permite montar simultáneamente un disco de solo lectura a múltiples consumidores.
Esto significa que puedes pre-poblar un DP con tu conjunto de datos y luego servirlo en paralelo desde tantos pods como necesites. Desafortunadamente, los DPs solo se pueden montar por un único consumidor en modo lectura-escritura.
No están permitidos escritores simultáneos.

Usar un disco persistente GCE con un Pod controlado por un ReplicaSet fallará a manos que el DP sea de solo lectura o el número de réplicas sea 0 o 1.

#### Creando un disco persistente GCE {#gce-create-persistent-disk}

Antes de poder usar un disco persistente GCE en un Pod, necesitas crearlo.

```shell
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

#### Ejemplo de configuración de un disco persistente GCE

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
    - image: registry.k8s.io/test-webserver
      name: test-container
      volumeMounts:
        - mountPath: /test-pd
          name: test-volume
  volumes:
    - name: test-volume
      # Este PD GCE debe existir con anterioridad.
      gcePersistentDisk:
        pdName: my-data-disk
        fsType: ext4
```

#### Discos regionales persistentes

La función de [discos regionales persistentes](https://cloud.google.com/compute/docs/disks/#repds)
permite la creación de discos persistentes que están disponibles en dos zonas dentro de la misma región.
Para usar esta función, el volumen debe ser provisto como un PersistentVolumen; referenciar el volumen directamente desde un Pod no está soportado.

#### Aprovisionamiento manual de un PD PersistentVolume Regional

El aprovisionamiento dinámico es posible usando un [StorageClass para el DP GCE](/docs/concepts/storage/storage-classes/#gce-pd).
Antes de crear un PersistentVolume, debes crear el disco persistente:

```shell
gcloud compute disks create --size=500GB my-data-disk
  --region us-central1
  --replica-zones us-central1-a,us-central1-b
```

#### Ejemplo de configuración de un disco persistente regional

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-volume
spec:
  capacity:
    storage: 400Gi
  accessModes:
    - ReadWriteOnce
  gcePersistentDisk:
    pdName: my-data-disk
    fsType: ext4
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: failure-domain.beta.kubernetes.io/zone
              operator: In
              values:
                - us-central1-a
                - us-central1-b
```

#### Migración CSI GCE

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

La función `CSIMigration` para el DP GCE, cuando se habilita, redirige todas las operaciones
de complemento desde el complemento existente dentro del árbol existente al controlador de Interfaz de Almacenamiento del Contenedor (CSI) de `pd.csi.storage.gke.io`. Para poder usar esta función, el [controlador PD GCE](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) debe ser instalado en el clúster y habilitar las funciones beta
`CSIMigration` y `CSIMigrationGCE`.

### gitRepo (deprecado) {#gitrepo}

{{< warning >}}
El volumen `gitRepo` está deprecado. Para aprovisionar un contenedor con un repositorio git, monta un [EmptyDir](#emptydir) en un InitContainer que clona un repositorio usando git, luego monta el [EmptyDir](#emptydir) en el contenedor del Pod.
{{< /warning >}}

Un volumen `gitRepo` es un ejemplo de un complemento de volumen. Este complemento monta un directorio vacío y clona un repositorio git en este directorio para que tu Pod pueda usarlo.

Aquí un ejemplo de un volumen `gitrepo`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
    - image: nginx
      name: nginx
      volumeMounts:
        - mountPath: /mypath
          name: git-volume
  volumes:
    - name: git-volume
      gitRepo:
        repository: "git@somewhere:me/my-git-repository.git"
        revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```

### glusterfs

Un volumen `glusterfs` permite montar un volumen [Glusterfs](https://www.gluster.org) en tu Pod.
A diferencia de `emptyDir`, que se borra cuando se remueve un Pod, el contenido de un volumen `glusterfs` es preservado 
y el volumen solamente se desmonta. Esto significa que un volumen glusterfs puede ser pre-poblado con datos,
y que los datos pueden ser compartidos entre pods. GlusterFS puede ser montado por múltiples escritores simultáneamente.

{{< note >}}
Debes tener tu propia instalación de GlusterFS ejecutándose antes de poder usarla.
{{< /note >}}

Mira el [ejemplo de GlusterFS](https://github.com/kubernetes/examples/tree/master/volumes/glusterfs) para más detalles.

### hostPath {#hostpath}

Un volumen `hostPath` monta un archivo o un directorio del sistema de archivos del nodo host a tu Pod.
Esto no es algo de muchos Pods necesiten, pero ofrece una trampa de escape poderosa para algunas aplicaciones.

Por ejemplo, algunos usos de un `hostPath` son:

- ejecutar un contenedor que necesita acceso a los directorios internos de Docker, usa un `hostPath` de `/var/lib/docker`
- ejecutar un cAdvisor en un contenedor; usa un `hostPath` de `/sys`
- permitir a un Pod especificar si un `hostPath` dado debería existir ante de correr el Pod, si debe crearse, cómo debe existir

Además de la propiedad requerida `path`, puedes especificar opcionalmente un `tipo`para un volumen `hostPath`.

Los valores soportados para el campo `tipo` son:

| Valor               | Comportamiento                                                                                                                                                   |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                     | Una cadena vacía (por defecto) es para compatibilidad con versiones anteriores, lo que significa que no se harán revisiones antes de montar el volumen hostPath. |
| `DirectoryOrCreate` | Si no hay nada en la ruta dada, se creará un directorio vacío como es requerido con los permisos a 0755, teniendo el mismo grupo y propiedad que el Kubelet.     |
| `Directory`         | Un directorio debe existir en la ruta dada                                                                                                                       |
| `FileOrCreate`      | Si no hay nada en la ruta dada, se creará un archivo vacío como es requerido con los permisos a 0644, teniendo el mismo grupo y propiedad que el Kubelet.        |
| `File`              | Un archivo debe existir en la ruta dada                                                                                                                          |
| `Socket`            | Un socket de UNIX debe existir en la ruta dada                                                                                                                   |
| `CharDevice`        | Un dispositivo de caracteres debe existir en la ruta data                                                                                                        |
| `BlockDevice`       | Un dispositivo de bloques dbe existir en la ruta dada                                                                                                            |

Ten cuidado cuando uses este tipo de volumen, porque:

- Los Pods con configuración idéntica (tales como los creados por un PodTemplate) pueden comportarse de forma distinta
  en nodos distintos debido a diferentes ficheros en los nodos.
- Los ficheros o directorios creados en los hosts subyacentes son modificables solo por root. Debes ejecutar tu proceso como root en un [Contenedor privilegiado](/docs/tasks/configure-pod-container/security-context/) o modificar los permisos de archivo en el host para escribir a un volumen `hostPath`

#### Ejemplo de configuración hostPath

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
    - image: registry.k8s.io/test-webserver
      name: test-container
      volumeMounts:
        - mountPath: /test-pd
          name: test-volume
  volumes:
    - name: test-volume
      hostPath:
        # localización del directorio en el host
        path: /data
        # este campo es opcional
        type: Directory
```

{{< caution >}}
El modo `FileOrCreate` no crea el directorio padre del archivo. Si el directorio padre del archivo montado no existe,
el Pod falla en iniciar. Para asegurar que este modo funciona, puedes intentar montar directorios y ficheros de forma separada,
tal como se muestra en la [ confugiración `FileOrCreate`](#hostpath-fileorcreate-example)
{{< /caution >}}

#### ejemplo de configuración hostPath FileOrCreate {#hostpath-fileorcreate-example}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-webserver
spec:
  containers:
    - name: test-webserver
      image: registry.k8s.io/test-webserver:latest
      volumeMounts:
        - mountPath: /var/local/aaa
          name: mydir
        - mountPath: /var/local/aaa/1.txt
          name: myfile
  volumes:
    - name: mydir
      hostPath:
        # Asegúrate que el directorio del archivo es creado.
        path: /var/local/aaa
        type: DirectoryOrCreate
    - name: myfile
      hostPath:
        path: /var/local/aaa/1.txt
        type: FileOrCreate
```

### iscsi

Un volumen `iscsi` permite que se monte un volumen ISCSI (SCSI sobre IP) existente
en tu Pod. A diferencia de `emptydir`, que es removido cuando se remueve un Pod,
el contenido de un volumen `iscsi` es preservado y el volumen solamente se desmonta.
Esto significa que un volumen iscsi puede ser pre-poblado con datos, y que estos datos se pueden compartir entre pods.

{{< note >}}
Debes tener tu propio servidor ISCSI corriendo con el volumen creado antes de poder usarlo.
{{< /note >}}

Una función de SCSI es que puede ser montado como de solo lectura por múltiples consumidores simultáneamente.
Esto significa que puedes pre-poblar un volumen con tu conjunto de datos y servirlo en paralelo para tantos Pods como necesites.
Desafortunadamente, los volúmenes ISCSI solo se pueden montar por un único consumidor en modo lectura-escritura.
Escritores simultáneos no está permitido.

Mira el [ejemplo iSCSI](https://github.com/kubernetes/examples/tree/master/volumes/iscsi) para más detalles.

### local

Un volumen `local` representa un dispositivo de almacenamiento local como un disco, una partición o un directorio.

Los volúmenes locales solo se pueden usar como un PersistenVolume creado estáticamente.
El aprovisionamiento dinámico no está soportado.

Comparados con volúmenes `hostPath`, los volúmenes `local` se usan de manera duradera y portátil sin programar pods manualmente
a los nodos. El sistema está consciente de las limitaciones del nodo del volumen al mirar la afinidad del nodo en el PersistenVolumen.

Sin embargo, los volúmenes `local`están sujetos a la disponibilidad del nodo subyacente y no son compatibles para todas las aplicaciones.

Si un nodo deja de estar sano, entonces el volumen `local` se vuelve inaccesible al Pod.
El Pod que utiliza este volumen no se puede ejecutar.
Las aplicaciones que usan volúmenes `local` deben ser capaces de tolerar esta disponibilidad reducida,
así como la pérdida potencial de datos, dependiendo de las características de durabilidad del disco subyacente.

El siguiente ejemplo muestra un PersistentVolume usando un volumen `local`y `nodeAffinity`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/hostname
              operator: In
              values:
                - example-node
```

Debes establecer un valor de `nodeAffinity` del PersistenVolume cuando uses volúmenes `local`.
El Scheduler de Kubernetes usa `nodeaffinity` del PersistenVolume para programar estos Pods al nodo correcto.

El `volumeMode` del PersistentVolume se puede establecer en "Block" (en lugar del valor por defecto, "Filesystem")
para exponer el volumen local como un dispositivo de bloque sin formato.

Cuando usas volúmenes locales, se recomienda crear un StorageClass con `volumeBindingMode` en `WaitForFirstConsumer`.
Para más detalles, mira el ejemplo de [StorageClass](/docs/concepts/storage/storage-classes/#local). Retrasar el enlace con el volumen asegura que la decisión del PersistenVolumeClaim sea evaluada con otras limitaciones que el Pod pueda tener,
tales como requisitos de recursos del nodo, selectores de nodo, afinidad del Pod, y anti-afinidad del Pod.

Se puede ejecutar un aprovisionador estático externo para un manejo mejorado del ciclo de vida del volumen local.
Ten en cuenta que este aprovisionador no soporta aprovisionamiento dinámico todavía. Para un ejemplo de un aprovisionador local externo, mira la [guía de usuario de aprovisionador de volumen local](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner)

{{< note >}}
El PersistentVolume local requiere limpieza y borrado manual por el usuario si no se utiliza el aprovisionador estático externo para manejar el ciclo de vida del volumen.
{{< /note >}}

### nfs

Un volumen `nfs` permite montar un NFS (Sistema de Ficheros de Red) compartido en tu Pod.
A diferencia de `emptyDir` que se borra cuando el Pod es removido, el contenido de un volumen `nfs` solamente se desmonta.
Esto significa que un volumen NFS puede ser pre-poblado con datos, y que estos datos puedes ser compartidos entre pods.
NFS puede ser montado por múltiples escritores simultáneamente.

{{< note >}}
Debes tener tu propio servidor NFS en ejecución con el recurso compartido exportado antes de poder usarlo.
{{< /note >}}

Mira el [ ejemplo NFS ](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs) para más información.

### persistentVolumeClaim {#persistentvolumeclaim}

Un volumen `persistenceVolumeClain` se utiliza para montar un [PersistentVolume](/docs/concepts/storage/persistent-volumes/) en tu Pod. PersistentVolumeClaims son una forma en que el usuario "reclama" almacenamiento duradero (como un PersistentDisk GCE o un volumen ISCSI) sin conocer los detalles del entorno de la nube en particular.

Mira la información spbre [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) para más detalles.

### portworxVolume {#portworxvolume}

Un `portworxVolume` es un almacenamiento de bloque elástico que corre hiperconvergido con Kubernetes.
Almacenamiento de huellas de [Portworx](https://portworx.com/use-case/kubernetes-storage/) en un servidor, niveles basados en capacidades y capacidad agregada en múltiples servidores.
Portworx se ejecuta como invitado en máquinas virtuales o en nodos Linux nativos.

Un `portworxVolume` puede ser creado dinámicamente a través de Kubernetes o puede ser pre-aprovisionado y referido dentro de un Pod. Aquí un Pod de ejemplo refiriendo a un volumen Portworx pre-aprovisionado:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
    - image: registry.k8s.io/test-webserver
      name: test-container
      volumeMounts:
        - mountPath: /mnt
          name: pxvol
  volumes:
    - name: pxvol
      # Este volumen portworx debe sxistir con anterioridad.
      portworxVolume:
        volumeID: "pxvol"
        fsType: "<fs-type>"
```

{{< note >}}
Asegúrate de tener un PortworxVolume con el nombre `pxvol` antes de usarlo en el Pod.
{{< /note >}}

Para más detalles, mira los ejemplos de [volumen Portworx](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md).

### projected

Un volumen `projected` mapea distintas fuentes de volúmenes existentes en un mismo directorio.

Actualmente, se pueden los siguientes tipos de volúmenes:

- [`secret`](#secret)
- [`downwardAPI`](#downwardapi)
- [`configMap`](#configmap)
- `serviceAccountToken`

Se requiere que todas las fuentes estén en el mismo namespace que el Pod. Para más detalles mira el [all-in-one volume design document](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/node/all-in-one-volume.md).

#### Configuración de ejemplo con un secret, un downwardAPI, y un configMap {#example-configuration-secret-downwardapi-configmap}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
    - name: container-test
      image: busybox
      volumeMounts:
        - name: all-in-one
          mountPath: "/projected-volume"
          readOnly: true
  volumes:
    - name: all-in-one
      projected:
        sources:
          - secret:
              name: mysecret
              items:
                - key: username
                  path: my-group/my-username
          - downwardAPI:
              items:
                - path: "labels"
                  fieldRef:
                    fieldPath: metadata.labels
                - path: "cpu_limit"
                  resourceFieldRef:
                    containerName: container-test
                    resource: limits.cpu
          - configMap:
              name: myconfigmap
              items:
                - key: config
                  path: my-group/my-config
```

#### Configuración de ejemplo: secrets con un modo de permisos no predeterminados {#example-configuration-secrets-nondefault-permission-mode}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
    - name: container-test
      image: busybox
      volumeMounts:
        - name: all-in-one
          mountPath: "/projected-volume"
          readOnly: true
  volumes:
    - name: all-in-one
      projected:
        sources:
          - secret:
              name: mysecret
              items:
                - key: username
                  path: my-group/my-username
          - secret:
              name: mysecret2
              items:
                - key: password
                  path: my-group/my-password
                  mode: 511
```

Cada volumen proyectado está listado en spec bajo `sources`. Los parámetros son casi los mismos salvo dos excepciones:

- Para los secrets, el campo `secretName` ha sido cambiado a `name` para ser consistente con el nombre del configMap.
- El `defaultMode` solo se puede especificar en el nivel proyectado y no para cada fuente de volumen. Sin, como se muestra arriba, puedes establecer explícitamente el `mode` para cada proyección individual.

Cuando la función `TokenRequestProjection` está habilitada, puedes inyectar el token para el [service account](/docs/reference/access-authn-authz/authentication/#service-account-tokens) actual en un Pod en la ruta especificada.
Por ejemplo:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sa-token-test
spec:
  containers:
    - name: container-test
      image: busybox
      volumeMounts:
        - name: token-vol
          mountPath: "/service-account"
          readOnly: true
  volumes:
    - name: token-vol
      projected:
        sources:
          - serviceAccountToken:
              audience: api
              expirationSeconds: 3600
              path: token
```

El Pod de ejemplo tiene un volumen proyectado que contiene el token del serviceAccount inyectado.
Este token se puede usar por el contenedor de un Pod para acceder a la API del servidor de Kubernetes.
El `audience` contiene la audiencia dirigida del token. Un recipiente del token debe identificarse a sí mismo con
un identificador especificado en la audiencia del token, de lo contrario debería rechazar el token. Este campo es opcional y por defecto tiene el valor del identificador del servidor API.

EL campo `expirationSeconds` es la duración esperada de la validez del token del serviceAccount.
Su valor por defecto es 1 hora y debe ser al menos 10 minutos (600 segundos). Un administrador puede limitar
su valor máximo al especificar la opción `--service-account-max-token-expiration` para el servidor API. El campo `path` especifica una ruta relativa al punto de montaje del volumen proyectado.

{{< note >}}
Un contenedor que usa una fuente de volumen proyectado como un volumen [`subPath`](#using-subpath) no recibirá actualizaciones de estas fuentes de volumen.  
{{< /note >}}

### quobyte

Un volumen `quobyte` permite montar un volumen [Quobyte](https://www.quobyte.com) en tu Pod.

{{< note >}}
Debes tener tu propia configuración Quobyte ejecutándose con los volúmenes creados antes de usarlo.
{{< /note >}}

Quobyte soporta el {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}.
CSI es el complemento recomendado para usar Quobyte dentro de Kubernetes. El proyecto Github de Quobyte tiene [instrucciones](https://github.com/quobyte/quobyte-csi#quobyte-csi) para desplegar usando CSI, junto con ejemplos.

### rbd

Un volumen `rbd` permite montar un volumen [Rados Block Device](https://docs.ceph.com/en/latest/rbd/) (RBD) en tu Pod.
A diferencia de `emptyDir`, que se borra cuando el Pod es removido, el contenido de un volumen `rbd` es preservado y el volumen se desmonta. Esto significa que un volumen RBD puede ser pre-poblado con datos, y que estos datos pueden ser compartidos entre pods.

{{< note >}}
Debes tener una instalación de Ceph ejecutándose antes de usar RBD.
{{< /note >}}

Una función de RBD es que solo se puede montar como de solo lectura por múltiples consumidores simultáneamente.
Esto significa que puedes pre-poblar un volumen con tu conjunto de datos y luego servirlo en paralelo desde tantos pods como necesites. Desafortunadamente, los volúmenes RBD solo se pueden montar por un único consumidor en modo lectura-escritura. No se permiten escritores simultáneos.

Mira el [ejemplo RBD](https://github.com/kubernetes/examples/tree/master/volumes/rbd) para más detalles.

### scaleIO (deprecado) {#scaleio}

ScaleIO es una plataforma de almacenamiento basada en software que usa el hardware existente para crear clústeres de almacenamiento en red de bloques compartidos escalables. El complemento de volumen `scaleIO` permite a los pods desplegados acceder a volúmenes existentes ScaleIO. Para información acerca de aprovisionamiento dinámico de nuevos persistence volumen claims, mira [ScaleIO persistent volumes](/docs/concepts/storage/persistent-volumes/#scaleio)

{{< note >}}
Debes tener un Cluster ScaleIO ya configurado y ejecutándose con los volúmenes creados antes de poder usarlos.
{{< /note >}}

El siguiente ejemplo es una configuración de un Pod con ScaleIO:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-0
spec:
  containers:
    - image: registry.k8s.io/test-webserver
      name: pod-0
      volumeMounts:
        - mountPath: /test-pd
          name: vol-0
  volumes:
    - name: vol-0
      scaleIO:
        gateway: https://localhost:443/api
        system: scaleio
        protectionDomain: sd0
        storagePool: sp1
        volumeName: vol-0
        secretRef:
          name: sio-secret
        fsType: xfs
```

Para más detalles, mira los ejemplos de [ScaleIO](https://github.com/kubernetes/examples/tree/master/staging/volumes/scaleio)

### secret

Un volumen `seret` se utiliza para pasar información sensible, como contraseñas, a los Pods.
Puedes guardar secrets en la API de Kubernetes y montarlos como ficheros para usarlos con los pods sin acoplarlos con Kubernetes directamente. Los volúmenes `secret` son respaldados por tmpfs (un sistema de ficheros respaldado por la RAM) así que nunca se escriben en un almacenamiento no volátil.

{{< note >}}
Debes crear un secreto en la API de Kubernetes antes de poder usarlo.
{{< /note >}}

{{< note >}}
Un contenedor que usa un Secret como un volumen [`subPath`](#using-subpath) no recibirá las actualizaciones del Secret.
{{< /note >}}

Para más detalles, mira [Configurando Secrets](/docs/concepts/configuration/secret/).

### storageOS {#storageos}

Un volumen `storageos` permite montar un volumen existente [StorageOS](https://www.storageos.com) en tu Pod.

StorageOS corre como un contenedor dentro de tu contenedor Kubernetes, haciendo accesible el almacenamiento local o adjunto desde cualquier node dentro del cluster de Kubernetes.
Los datos pueden ser replicados para protegerlos contra fallos del nodo. Este aprovisionamiento y compresión pueden mejorar el uso y reducir costes.

El contenedor StorageOs requiere Linux de 64 bits y no tiene dependencias adicionales.
Una licencia gratuita para desarrolladores está disponible.

{{< caution >}}
Debes correr un contenedor StorageOS en cada nodo que quiera acceder a los volúmenes StorageOS o que contribuyan a la capacidad de almacenamiento al grupo.
Para instrucciones de instalación, consulta la [documentación StorageOS](https://docs.storageos.com)
{{< /caution >}}

El siguiente ejemplo es una configuración de un Pod con Storage OS:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: redis
    role: master
  name: test-storageos-redis
spec:
  containers:
    - name: master
      image: kubernetes/redis:v1
      env:
        - name: MASTER
          value: "true"
      ports:
        - containerPort: 6379
      volumeMounts:
        - mountPath: /redis-master-data
          name: redis-data
  volumes:
    - name: redis-data
      storageos:
        # El volumen `redis-vol01` debe existir dentro de StorageOS en el namespace `default`.
        volumeName: redis-vol01
        fsType: ext4
```

Para más información sobre StorageOS, aprovisionamiento dinámico, y PersistentVolumeClaims, mira los
[ ejemplos de StorageOS examples](https://github.com/kubernetes/examples/blob/master/volumes/storageos).

### vsphereVolume {#vspherevolume}

{{< note >}}
Debes configurar el proveedor en la nube de vSphere de Kubernetes.
Para configuración de proveedores en la nube, mira la [ guía de inicio de vSphere ](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/).
{{< /note >}}

Un volumen `vsphereVolume` se usa para montar un volumen VMDK vSphere en tu Pod. El contenido de un volumen es preservado cuando se desmonta. Tiene soporte para almacén de datos VMFS y VSAN.

{{< note >}}
Debes crear un volumen vSphere VMDK usando uno de los siguientes métodos antes de usarlo con un Pod.
{{< /note >}}

#### Creando un volumen VMDK {#creating-vmdk-volume}

Elige uno de los siguientes métodos para crear un VMDK.

{{< tabs name="tabs_volumes" >}}
{{% tab name="Create using vmkfstools" %}}
Primero entra mediante ssh en ESX, luego usa uno de los siguientes comandos para crear un VMDK:

```shell
vmkfstools -c 2G /vmfs/volumes/DatastoreName/volumes/myDisk.vmdk
```

{{% /tab %}}
{{% tab name="Create using vmware-vdiskmanager" %}}
Usa el siguiente comando para crear un VMDK:

```shell
vmware-vdiskmanager -c -t 0 -s 40GB -a lsilogic myDisk.vmdk
```

{{% /tab %}}

{{< /tabs >}}

#### Ejemplo de configuración vSphere VMDK {#vsphere-vmdk-configuration}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-vmdk
spec:
  containers:
    - image: registry.k8s.io/test-webserver
      name: test-container
      volumeMounts:
        - mountPath: /test-vmdk
          name: test-volume
  volumes:
    - name: test-volume
      # Este volumen VMDK ya debe existir.
      vsphereVolume:
        volumePath: "[DatastoreName] volumes/myDisk"
        fsType: ext4
```

Para mayor información, mira el ejemplo de [vSphere volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere).

#### Migración CSI vSphere {#vsphere-csi-migration}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}
Cuando la función `CSIMigration` está habilitada, redirige todas las operaciones de complemento desde el complemento existente en el árbol al controlador {{< glossary_tooltip text="CSI" term_id="csi" >}} `csi.vsphere.vmware.com`. Para
usar esta función, el [controlador vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver) debe estar instalado en el clúster y las [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `CSIMigration` y `CSIMigrationvSphere` deben estar habilitadas.

Esto también requiere que la versión de vSphere vCenter/ESXi sea la 7.0u1 y la versión mínima de HW version sea VM versión 15.

{{< note >}}
Los siguientes parámetros de Storageclass desde el complemento incorporado `vsphereVolume` no están soportados por el controlador vSphere CSI:

- `diskformat`
- `hostfailurestotolerate`
- `forceprovisioning`
- `cachereservation`
- `diskstripes`
- `objectspacereservation`
- `iopslimit`

Los volúmenes existentes creados usando estos parámetros serán migrados al controlador vSphere CSI, pero los volúmenes nuevos creados por el controlador vSphere CSI no respetarán estos parámetros
{{< /note >}}

#### migración completa de vSphere CSI {#vsphere-csi-migration-complete}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}
Para apagar el complemento `vsphereVolume` y no cargarlo por el administrador del controlador y el kubelet, necesitas establecer eta función a `true`. Debes instalar un controlador de tipo `csi.vsphere.vmware.com` en todos los nodos worker.

## Uso de subPath {#using-subpath}

Algunas veces es útil compartir un volumen para múltiples usos en un único Pod.
La propiedad `volumeMounts[*].subPath` especifica una sub-ruta dentro del volumen referenciado en lugar de su raíz.

El siguiente ejemplo muestra cómo configurar un Pod con la pila LAMP (Linux Apache MySQL PHP) usando un único volumen compartido. Esta configuración de ejemplo usando `subPath` no se recomienda para su uso en producción.

El código de la aplicación PHP y los recursos apuntan al directorio `html` del volumen y la base de datos MySQL se almacena en el directorio `mysql`. Por ejemplo:
The PHP application's code and assets map to the volume's `html` folder and
the MySQL database is stored in the volume's `mysql` folder. For example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
  containers:
    - name: mysql
      image: mysql
      env:
        - name: MYSQL_ROOT_PASSWORD
          value: "rootpasswd"
      volumeMounts:
        - mountPath: /var/lib/mysql
          name: site-data
          subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
        - mountPath: /var/www/html
          name: site-data
          subPath: html
  volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

### Uso de subPath con variables de entorno expandidas {#using-subpath-expanded-environment}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}
Usa el campo `subPathExpr` para construir un nombre de directorio `subPath` desde variables de entorno de la API.
Las propiedades `subPath` y `subPathExpr` son mutuamente exclusivas.

En este ejemplo, un `Pod` usa `subPathExpr` para crear un directorio `pod1` dentro del volumen `hostPath` `var/logs/pods`.
El volumen `hostPath` toma el nombre del `Pod` desde la `downwardAPI`.
El directorio anfitrión `var/log/pods/pod1` se monta en `/logs` en el contenedor.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
    - name: container1
      env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.name
      image: busybox
      command:
        [
          "sh",
          "-c",
          "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt",
        ]
      volumeMounts:
        - name: workdir1
          mountPath: /logs
          subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
    - name: workdir1
      hostPath:
        path: /var/log/pods
```

## Recursos

El medio de almacenamiento (como un disco o un SSD) de un volumen `emptyDir`
se determina por el medio del sistema de archivos que contiene el directorio raíz
del kubelet (típicamente `/var/lib/kubelet`).
No hay límite de cuánto espacio puede consumir un volumen `emptydir` o `hostPath`,
y no hay aislamiento entre contenedores o entre pods.

Para aprender más sobre requerir espacio usando una espacificación de recurso, mira [cómo administrar recursos](/docs/concepts/configuration/manage-resources-containers/).

## Complementos de volúmenes fuera del árbol

Los complementos de volumen fuera del árbol incluyen {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) y FlexVolume. Estos complementos permiten a los proveedores de almacenamiento crear complementos de almacenamiento personalizados sin añadir su código fuente al repositorio de Kubernetes.

Anteriormente, todos los complementos de volumen estaban "en el árbol". Los complementos "en el árbol" se construían, enlazaban, compilaban y enviaban con los binarios del núcleo de Kubernetes. Esto significaba que agregar un nuevo sistema de almacenamiento a Kubernetes (un complemento de volumen) requería verificar el código en el repositorio de código del núcleo de Kubernetes.

Tanto CSI como FlexVolume permiten que se desarrollen complementos de volúmenes independientemente del código base de Kubernetes, y se desplieguen (instalen) en los clústeres de Kubernetes como extensiones.

Para los proveedores de almacenamiento que buscan crear un complemento de volumen fuera del árbol, por favor refiéranse a [Preguntas frecuentees de complementos de volumen](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).

### csi

La [interfaz de almacenamiento del contenedor](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) define una interfaz estándar para sistemas de orquestación del contenedor (como Kubernetes) para exponer sistemas de almacenamiento arbitrario a sus cargas de trabajo del contenedor.

Por favor, lee la [propuesta de diseño CSI](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md) para más información.

{{< note >}}
El soporte para las especificaciones de las versiones CSI 0.2 y 0.3 están deprecadas en Kubernetes v1.13 y serán removidos en una versión futura.
{{< /note >}}

{{< note >}}
Los controladores CSI podrían no ser compatibles con todas las versiones de Kubernetes. 
Por favor, revisa la documentación específica del controlador CSI para los pasos de despliegue soportados para cada versión de Kubernetes y una matriz de compatibilidad.
{{< /note >}}

Una vez que se despliega un controlador de volumen CSI compatible, los usuarios pueden usar el tipo de volumen `csi` para adjuntar o montar los volúmenes expuestos por el controlador CSI.

Un volumen `csi` puede ser usado en un Pod en tres maneras distintas:

- a través de una referencia a [PersistentVolumeClaim](#persistentvolumeclaim)
- con un [volumen general efímero](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
  (característica alpha)
- con un [volumen efímero CSI](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes) si el controlador permite esta (característica beta)

Los siguientes campos están disponibles para que los administradores de almacenamiento configuren el volumen persistente CSI

- `driver`: Un valor de cadena de caracteres que especifica el nombre del controlador de volumen a usar. Este valor debe corresponder al valor de respuesta en el `GetPluginInfoResponse` por el controlador CSI tal como se define en la [especificación CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo). Es usado por Kubernetes para identificar cuál controlador llamar, y por los componentes del controlador CSI para identificar cuáles objetos PV pertenecen al controlador CSI.
- `volumenHandle`: Un valor de cadena de caracteres que identifica el volumen unívocamente. Este valor debe corresponder al valor en el campo `volumen.id` del `CreateVolumeResponse` por el controlador CSI como se define en la [especificación CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume). El valor es pasado como `volume.id` en todas las llamadas al controlador de volumen CSI cuando referencias el volumen.
- `readOnly`: Un valor booleano opcional que indica si el volumen es para ser "ControllerPublished" (adjuntado) como solo lectura. Por defecto es falso. Este valor es pasado el controlador CSI en el campo `readOnly` en el `ControllerPublishVolumeRequest`.
- `fsType`: Si el `VolumeMode`del PV es `Filesystem` entonces este campo se puede usar para especificar el sistema de archivos que debería usarse para montar el volumen. Si el volumen no ha sido formateado y soportado, este valor se utilizará para formatear el volumen. Este valor se para al controlador CSI con el campo `VolumeCapability` de `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, y `NodePublishVolumeRequest`.
- `volumeAttributes`: Un mapa de cadena de caracteres que especifica las propiedades estáticas de un volumen. Este mapa debe corresponder al map devuelto por el campo `volume.attributes` del `CreateVolumeResponse` por el controlador CSI tal como se define en la [especificación CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume). El mapa es pasado al controlador CSI con el campo `volume.context` en el `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, y `NodePublishVolumeRequest`.
- `controllerPublishSecretRef`: Una referencia al objeto secret que contiene información sensible para pasar al controlador CSI para completar las llamadas CSI `ControllerPublishVolume` y `ControllerUnpublishVolume`. Este campo es opcional, y puede estar vacío si no se requiere un secret. Si el Secret contiene más de un secret, se pasan todos los secrets.
- `nodeStageSecretRef`: Una referencia al objeto secret que contiene información sensible a pasar al controlador CSI para completar la llamada CSI `NodeStageVolume`. Este ampo es opcional, y puede estar vacío si no se requiere un secret. Si el Secret contiene más de un secret, todos los secrets son pasados.
- `nodePublishSecretRef`: Una referencia al objeto que contiene información sensible a pasar al controlador CSI para completar la llamada CSI `NodePublishVolume`. Este ampo es opcional, y puede estar vacío si no se requiere un secret. Si el Secret contiene más de un secret, todos los secrets son pasados.

#### Soporte de volumen CSI de fila de bloques

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Los proveedores con controladores CSI externos pueden implementar soporte de volumen de bloques sin procesar en cargas de trabajo de Kubernetes.

Puedes configurar tu
You can set up your [PersistentVolume/PersistentVolumeClaim with raw block volume support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) como de costumbre, sin ningún cambio específico CSI.

#### Volúmenes efímeros CSI

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Puedes configurar directamente volúmenes CSI dentro de la especificación del Pod.
Los volúmenes especificados de esta manera son efímeros y no se persisten entre reinicios del Pod. Mira [Volúmenes efímeros](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes) para más información.

Para más información de cómo desarrollador un controlador CSI, mira la [documentación kubernetes-csi](https://kubernetes-csi.github.io/docs/)

#### Migrando a controladores CSI desde complementos en el árbol.

{{< feature-state for_k8s_version="v1.17" state="beta" >}}
La función `CSIMigration`, cuando está habilitada, dirige todas las operaciones hacia complementos existentes en el árbol a complementos CSI correspondientes (que se espera que estén instalados y configurados). Como resultado, los operadores no tienen que hacer ningún cambio de configuración a las clases de almacenamiento, PersistentVolumes o PersistentVolumeClaims (refiriéndose a complementos en el árbol) cuando haces la transición a un controlador CSI que un reemplaza complemento en el árbol.

Las operaciones y funciones que están soportadas incluye:
aprovisionamiento/borrado, adjuntar/separar, montar/desmontar y redimensionar volúmenes.

In-tree plugins that support `CSIMigration` and have a corresponding CSI driver implemented
are listed in [Types of Volumes](#volume-types).

### flexVolume

FlexVolume is an out-of-tree plugin interface that has existed in Kubernetes
since version 1.2 (before CSI). It uses an exec-based model to interface with
drivers. The FlexVolume driver binaries must be installed in a pre-defined volume
plugin path on each node and in some cases the control plane nodes as well.

Pods interact with FlexVolume drivers through the `flexvolume` in-tree volume plugin.
For more details, see the [FlexVolume](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md) examples.

## Propagación del montaje

La propagación del montaje permite compartir volúmenes montados por un contenedor para otros contenedores en el mismo Pod, o aun para otros pods en el mismo nodo.

La propagación del montaje de un volumen es controlada por el campo `mountPropagation` en `containers[*].volumeMounts`. Sus valores son:

- `None` - Este montaje de volumen no recibirá ningún montaje posterior que el host haya montado en este volumen o en cualquiera de sus subdirectorios. De manera similar, los montajes creados por el contenedor no serán visibles en el host. Este es el modo por defecto.

  Este modo es igual la propagación del montaje `private` tal como se describe en la [ documentación Linux kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

- `HostToContainer` - Este montaje de volumen recibirá todos los montajes subsecuentes que son montados a este volumen o cualquiera de sus subdirectorios.

  En otras palabras, si el host monta algo dentro del montaje del volumen, el contenedor lo verá montado allí.

  De manera similar, si cualquier Pod con propagación de montaje `Bidirectional` al mismo volumen monta algo allí, el contenedor con propagación de montaje` HostToContainer` lo verá.

  Este modo es igual a la propagación de montaje `rslave` tal como se describe en la [documentación del kernel de Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

- `Bidirectional`- Este montaje de volumen se comporta de la misma manera de el montaje`HostToContainer`. Adicionalmente, todos los montajes de volúmenes creados por el contenedor serán propagados de vuelta al host y a todos los contenedores de todos los pods que usan el mismo volumen.

  Un uso típico para este modo es un Pod con un FlexVolumen o un controlador CSI o un Pod que necesita montar al en el host usando un volumen `hostPath`.

  Este modo es igual a la propagación de montaje `rshared` tal como se describe en la [documentación del kernel de Linux documentación](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

  {{< warning >}}
  La propagación por montaje `Bidirectional` puede ser peligrosa. Puede dañar el sistema operativo host y, por lo tanto, solo se permite en contenedores privilegiados. Se recomienda encarecidamente estar familiarizado con el comportamiento del kernel de Linux.
  Además, cualquier montaje de volumen creado por contenedores en pods debe destruirse (desmontado) por los contenedores en el momento de la terminación.
  {{< /warning >}}

### Configuration

Before mount propagation can work properly on some deployments (CoreOS,
RedHat/Centos, Ubuntu) mount share must be configured correctly in
Docker as shown below.

Edit your Docker's `systemd` service file. Set `MountFlags` as follows:

```shell
MountFlags=shared
```

Or, remove `MountFlags=slave` if present. Then restart the Docker daemon:

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## {{% heading "whatsnext" %}}

Sigue un ejemplo de [desplegar WordPrss y MySQL con volúmenes persistentes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
