---
title: Administrando Recursos de Contenedores
content_type: concept
weight: 40
feature:
  title: Automatic bin packing
  description: >
    Automáticamente coloca los contenedores en base a los recursos solicitados y otras limitaciones, mientras no se afecta a la
    disponibilidad.Mezcla las cargas críticas con  un mejor refuerzo para mejorar el uso y ahorrar recursos.
---

<!-- overview -->

Cuando especificas un {{< glossary_tooltip term_id="pod" >}}, opcionalmente puedes especificar
los recursos que necesita un {{< glossary_tooltip text="Contenedor" term_id="container" >}}.
Los recusos que se definen normalmente son CPU y memoria (RAM);pero hay otras.

Cuando especificas el recurso _request_  para  Contenedores en un {{< glossary_tooltip term_id="pod" >}}, 
el scheduler usa esta información para decidir en qué nodo colocar el {{< glossary_tooltip term_id="pod" >}}.
Cuando especificas el recurso _limit_ para un Contenedor, el kubelet fuerza estos límites, así que el contenedor no
puede utilizar más recursos que el límite que le especificamos. EL kubelet también reserva al menos la cantidad
especificada en _request_ para el contenedor.




<!-- body -->

## Peticiones y límites

Si el nodo donde está corriendo un pod tiene suficientes recursos disponibles, es posible 
( si está permitido) que el contenedor utilice más recursos de los que tiene especificados en `request`.
Sin embargo, un contenedor no está autorizado a utilizar más de lo especificado en `limit`.

Por ejemplo, si configuras una petición de `memory` de 256 MiB  para un contenedor, y ese contenedor está
en un Pod colocado en un nodo con 8GiB  de memoria y no hay otros Pods, entonces el contendor puede intentar usar
más RAM.

Si configuras un límite de `memory` de 4GiB  para el Contenedor , el kubelet (y
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}})  fuerza el límite.
El runtime previene al contenedor de usar más recursos de lso configurados en el limit. Por ejemplo: 
cuando un proceso en el contenedor intenta consumir más cantidad de memoria de la permitida,
el núcleo del sistema termina el proceso que intentó la utilización de la memoria, con un error de out of memory (OOM).

Los límites se pueden implementar de forma reactiva ( el sistema interviene cuando ve la violación)
o por refuerzo (el sistema previene al contenedor de exceder el límite). Diferentes runtimes pueden tener diferentes
maneras de implementar as mismas restricciones.

{{< note >}}
Si un Contenedor especifica su propio límite de memoria, pero no especifica la petición de memoria, Kubernetes
automáticamente asigna una petición de memoria igual a la del límite. De igual manera, si un Contenedor especifica su propio límite de CPU, pero no especifica una petición de CPU, Kubernetes automáticamente asigna una petición de CPU igual a la especificada en el límite.
{{< /note >}}

## Tipos de recursos

*CPU* y *memoria* son cada uno un *tipo de recursos*. Un tipo de recurso tiene una unidad base.
CPU representa procesos de computación y es especificada en unidades de [Kubernetes CPUs](#meaning-of-cpu).
Memoria es especificada en unidades de bytes.
Si estás usando Kubernetes v1.14 o posterior, puedes especificar recursos _huge page_.
Huge pages son una característica de Linux específica donde el kernel del nodo asigna bloques
de memoria que son más grandes que el tamaño de paginación por defecto.

Por ejemplo, en un sistema donde el tamaño de apginación por defecto es de 4KiB, podrías
especificar un límite, `hugepages-2Mi: 80Mi`. Si el contenedor intenta asignar
 más de 40 2MiB huge pages ( untotal de 80 MiB), la asignación fallará.

{{< note >}}
No se pueden sobreasignar recursos `hugepages-*`.
Esta es la diferencia con los recursos de `memoria` y `cpu`.
{{< /note >}}

CPU y memoria  son colectivamente conocidos como *recursos de computación*,  o solo como 
*recursos*.  Recursos de computación son cantidades medibles que pueden ser solicitadas, asignadas
y consumidas. SOn distintas de [API resources](/docs/concepts/overview/kubernetes-api/). Recursos API , como Pods y 
[Services](/docs/concepts/services-networking/service/) son objetos que pueden ser leídos y modificados
a través de la API de kubernetes.

## Solicitud de recursos y límites de Pods y Contenedores

Cada contenedor de un Pod puede especificar uno o más de los siguientes:

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.limits.hugepages-<size>`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`
* `spec.containers[].resources.requests.hugepages-<size>`

Aunque las solicitudes y límites pueden ser especificadas solo en contenedores individuales, es conveniente hablar
sobre los recursos de solicitudes y límites del Pod. Un *limite/solicitud de recursos de un Pod* para un tipode recurso particular es la suma de
solicitudes/límites de cada tipo para cada Contenedor del Pod.

## Unidades de recursos en Kubernetes

### Significado de CPU

Límites y solicitudes para recursos de CPU son medidos en unidades de *cpu*.
Una cpu, en kubernetes, es equivalente a **1 vCPU/Core**  para proveedores de cloud y **1 hyperthread** en procesadores bare-metal Intel.

Las solicitudes fraccionadas están permitidas. Un contenedor con `spec.containers[].resources.requests.cpu` de `0.5` tiene garantizada la mitad, tanta
CPU  como otro que requiere 1 CPU. La expresión `0.1` es equivalente a la expresión `100m`, que puede ser leída como "cien millicpu". Algunas personas dicen
"cienmillicores", y se entiende que quiere decir lo mismo. Una solicitud con un punto decimal, como `0.1`,  es convertido a `100m` por la API, y  no se permite
 una precisión mayor que `1m`. Por esta razón, la forma `100m` es la preferente.
CPU es siempre solicitada como una cantidad absoluta, nunca como una cantidad relativa;
0.1 es la misma contidad de cpu que un core-simple, dual-core, o ma´quina de 48-core.

### Significado de memoria

Los límites y solicitudes de `memoria` son medidos en bytes. Puedes expresar la memoria como
un integral como un número decimal usando alguno de estos sufijos:
E, P, T, G, M, K. También puedes usar el poder de dos equivalentes: Ei, Pi, Ti, Gi,
Mi, Ki. Por ejemplo, los siguientes valores representan lo mismo:

```shell
128974848, 129e6, 129M, 123Mi
```

Aquí un ejemplo.
El siguiente Pod tiene dos Contenedores. Cada Contenedor tiene una solicitud de 0.25 cpu
y 64MiB (2<sup>26</sup> bytes) de memoria. Cada Contenedor tiene un límite de 0.5 cpu
y 128MiB de memoria. Puedes decirle al Pod que solicite 0.5 cpu y 128MiB de memoria 
y un límite de 1 cpu y 256MiB de memoria.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## Cómo son colocados los Pods con solicitudes de recursos

Cuando creas un Pod, el scheduler de Kubernetes selecciona un nodo para correr el Pod.
Cada nodo tiene una capacidad máxima para cada tipo de recurso:
la cantidad de CPU y memoria que dispone para los Pods. El scheduler se asegura de que,
colocados es menor que la capacidad del nodo. Aunque los recursos de memoria y CPU
en uso de los nodos es muy baja, el scheduler todavía rechaza colocar un Pod en un nodo si
la comprobación de capacidad falla. Esto protege contra escasez de recursos en un nodo
cuando el uso de recursos posterior crece, por ejemplo, durante un pico diario de
solictudes de  recursos.

## Cómo corren los Pods con límites de recursos

Cundo el kubelet inicia un Contenedor de un Pod, este pasa los límites de CPU y 
memoria al runtime del contenedor.

Cuando usas Docker:

- El `spec.containers[].resources.requests.cpu` es convertido a su valor interno,
  el cuál es fraccional, y multiplicado por 1024. El mayor valor de este número o
  2 es usado por el valor de 
  [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#cpu-share-constraint)
  en el comando `docker run`.

- El `spec.containers[].resources.limits.cpu` se convierte a su valor en milicore y 
  multiplicado por 100. El resultado es el total de tiempo de CPU que un contenedor puede usar
  cada 100ms. Un contenedor no puede usar más tiempo de CPU que el suyo durante el intervalo.

  {{< note >}}
  El período por defecto es de 100ms. La resolución mínima de cuota mínima es 1ms.
  {{</ note >}}

- El `spec.containers[].resources.limits.memory` se convierte a un integral, y 
  se usa como valor de 
  [`--memory`](https://docs.docker.com/engine/reference/run/#/user-memory-constraints)
  del comando  `docker run`.

Si el Contenedor excede su límite de memoria, este quizá se pare. Si es reiniciable,
el kubelet lo reiniciará, así como cualquier otro error.

Si un Contenedor excede su solicitud de memoria, es probable que el Pod sea
desalojado cuando el nodo se quede sin memoria.

Un Contenedor quizá puedan o no tener permitido execeder el límite de CPU por
algunos períodos de tiempo. Sin embargo, esto no matará por excesivo uso de CPU.

Para saber cuando un Contenedor no puede ser colocado o será parado debido a 
límite de recursos, revisa la sección de [Troubleshooting](#troubleshooting).

### Monitorización del uso de recursos de computación y memoria.

The resource usage of a Pod is reported as part of the Pod status.

If optional [tools for monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
are available in your cluster, then Pod resource usage can be retrieved either
from the [Metrics API](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#the-metrics-api)
directly or from your monitoring tools.

## Local ephemeral storage

<!-- feature gate LocalStorageCapacityIsolation -->
{{< feature-state for_k8s_version="v1.10" state="beta" >}}

Nodes have local ephemeral storage, backed by
locally-attached writeable devices or, sometimes, by RAM.
"Ephemeral" means that there is no long-term guarantee about durability.

Pods use ephemeral local storage for scratch space, caching, and for logs.
The kubelet can provide scratch space to Pods using local ephemeral storage to
mount [`emptyDir`](/docs/concepts/storage/volumes/#emptydir)
 {{< glossary_tooltip term_id="volume" text="volumes" >}} into containers.

The kubelet also uses this kind of storage to hold
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level),
container images, and the writable layers of running containers.

{{< caution >}}
If a node fails, the data in its ephemeral storage can be lost.  
Your applications cannot expect any performance SLAs (disk IOPS for example)
from local ephemeral storage.
{{< /caution >}}

As a beta feature, Kubernetes lets you track, reserve and limit the amount
of ephemeral local storage a Pod can consume.

### Configurations for local ephemeral storage

Kubernetes supports two ways to configure local ephemeral storage on a node:
{{< tabs name="local_storage_configurations" >}}
{{% tab name="Single filesystem" %}}
In this configuration, you place all different kinds of ephemeral local data
(`emptyDir` volumes, writeable layers, container images, logs) into one filesystem.
The most effective way to configure the kubelet means dedicating this filesystem
to Kubernetes (kubelet) data.

The kubelet also writes
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
and treats these similarly to ephemeral local storage.

The kubelet writes logs to files inside its configured log directory (`/var/log`
by default); and has a base directory for other locally stored data
(`/var/lib/kubelet` by default).

Typically, both `/var/lib/kubelet` and `/var/log` are on the system root filesystem,
and the kubelet is designed with that layout in mind.

Your node can have as many other filesystems, not used for Kubernetes,
as you like.
{{% /tab %}}
{{% tab name="Two filesystems" %}}
You have a filesystem on the node that you're using for ephemeral data that
comes from running Pods: logs, and `emptyDir` volumes. You can use this filesystem
for other data (for example: system logs not related to Kubernetes); it can even
be the root filesystem.

The kubelet also writes
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
into the first filesystem, and treats these similarly to ephemeral local storage.

You also use a separate filesystem, backed by a different logical storage device.
In this configuration, the directory where you tell the kubelet to place
container image layers and writeable layers is on this second filesystem.

The first filesystem does not hold any image layers or writeable layers.

Your node can have as many other filesystems, not used for Kubernetes,
as you like.
{{% /tab %}}
{{< /tabs >}}

The kubelet can measure how much local storage it is using. It does this provided
that:

- the `LocalStorageCapacityIsolation`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  is enabled (the feature is on by default), and
- you have set up the node using one of the supported configurations
  for local ephemeral storage.

If you have a different configuration, then the kubelet does not apply resource
limits for ephemeral local storage.

{{< note >}}
The kubelet tracks `tmpfs` emptyDir volumes as container memory use, rather
than as local ephemeral storage.
{{< /note >}}

### Setting requests and limits for local ephemeral storage

You can use _ephemeral-storage_ for managing local ephemeral storage. Each Container of a Pod can specify one or more of the following:

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

Limits and requests for `ephemeral-storage` are measured in bytes. You can express storage as
a plain integer or as a fixed-point number using one of these suffixes:
E, P, T, G, M, K. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following represent roughly the same value:

```shell
128974848, 129e6, 129M, 123Mi
```

In the following example, the Pod has two Containers. Each Container has a request of 2GiB of local ephemeral storage. Each Container has a limit of 4GiB of local ephemeral storage. Therefore, the Pod has a request of 4GiB of local ephemeral storage, and a limit of 8GiB of local ephemeral storage.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
```

### How Pods with ephemeral-storage requests are scheduled

When you create a Pod, the Kubernetes scheduler selects a node for the Pod to
run on. Each node has a maximum amount of local ephemeral storage it can provide for Pods. For more information, see [Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

The scheduler ensures that the sum of the resource requests of the scheduled Containers is less than the capacity of the node.

### Ephemeral storage consumption management {#resource-emphemeralstorage-consumption}

If the kubelet is managing local ephemeral storage as a resource, then the
kubelet measures storage use in:

- `emptyDir` volumes, except _tmpfs_ `emptyDir` volumes
- directories holding node-level logs
- writeable container layers

If a Pod is using more ephemeral storage than you allow it to, the kubelet
sets an eviction signal that triggers Pod eviction.

For container-level isolation, if a Container's writable layer and log
usage exceeds its storage limit, the kubelet marks the Pod for eviction.

For pod-level isolation the kubelet works out an overall Pod storage limit by
summing the limits for the containers in that Pod. In this case, if the sum of
the local ephemeral storage usage from all containers and also the Pod's `emptyDir`
volumes exceeds the overall Pod storage limit, then the kubelet also marks the Pod
for eviction.

{{< caution >}}
If the kubelet is not measuring local ephemeral storage, then a Pod
that exceeds its local storage limit will not be evicted for breaching
local storage resource limits.

However, if the filesystem space for writeable container layers, node-level logs,
or `emptyDir` volumes falls low, the node
{{< glossary_tooltip text="taints" term_id="taint" >}} itself as short on local storage
and this taint triggers eviction for any Pods that don't specifically tolerate the taint.

See the supported [configurations](#configurations-for-local-ephemeral-storage)
for ephemeral local storage.
{{< /caution >}}

The kubelet supports different ways to measure Pod storage use:

{{< tabs name="resource-emphemeralstorage-measurement" >}}
{{% tab name="Periodic scanning" %}}
The kubelet performs regular, schedules checks that scan each
`emptyDir` volume, container log directory, and writeable container layer.

The scan measures how much space is used.

{{< note >}}
In this mode, the kubelet does not track open file descriptors
for deleted files.

If you (or a container) create a file inside an `emptyDir` volume,
something then opens that file, and you delete the file while it is
still open, then the inode for the deleted file stays until you close
that file but the kubelet does not categorize the space as in use.
{{< /note >}}
{{% /tab %}}
{{% tab name="Filesystem project quota" %}}

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

Project quotas are an operating-system level feature for managing
storage use on filesystems. With Kubernetes, you can enable project
quotas for monitoring storage use. Make sure that the filesystem
backing the `emptyDir` volumes, on the node, provides project quota support.
For example, XFS and ext4fs offer project quotas.

{{< note >}}
Project quotas let you monitor storage use; they do not enforce limits.
{{< /note >}}

Kubernetes uses project IDs starting from `1048576`. The IDs in use are
registered in `/etc/projects` and `/etc/projid`. If project IDs in
this range are used for other purposes on the system, those project
IDs must be registered in `/etc/projects` and `/etc/projid` so that
Kubernetes does not use them.

Quotas are faster and more accurate than directory scanning. When a
directory is assigned to a project, all files created under a
directory are created in that project, and the kernel merely has to
keep track of how many blocks are in use by files in that project.  
If a file is created and deleted, but has an open file descriptor,
it continues to consume space. Quota tracking records that space accurately
whereas directory scans overlook the storage used by deleted files.

If you want to use project quotas, you should:

* Enable the `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  in the kubelet configuration.

* Ensure that the root filesystem (or optional runtime filesystem)
  has project quotas enabled. All XFS filesystems support project quotas.
  For ext4 filesystems, you need to enable the project quota tracking feature
  while the filesystem is not mounted.
  ```bash
  # For ext4, with /dev/block-device not mounted
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

* Ensure that the root filesystem (or optional runtime filesystem) is
  mounted with project quotas enabled. For both XFS and ext4fs, the
  mount option is named `prjquota`.

{{% /tab %}}
{{< /tabs >}}

## Extended resources

Extended resources are fully-qualified resource names outside the
`kubernetes.io` domain. They allow cluster operators to advertise and users to
consume the non-Kubernetes-built-in resources.

There are two steps required to use Extended Resources. First, the cluster
operator must advertise an Extended Resource. Second, users must request the
Extended Resource in Pods.

### Managing extended resources

#### Node-level extended resources

Node-level extended resources are tied to nodes.

##### Device plugin managed resources
See [Device
Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
for how to advertise device plugin managed resources on each node.

##### Other resources
To advertise a new node-level extended resource, the cluster operator can
submit a `PATCH` HTTP request to the API server to specify the available
quantity in the `status.capacity` for a node in the cluster. After this
operation, the node's `status.capacity` will include a new resource. The
`status.allocatable` field is updated automatically with the new resource
asynchronously by the kubelet. Note that because the scheduler uses the	node
`status.allocatable` value when evaluating Pod fitness, there may be a short
delay between patching the node capacity with a new resource and the first Pod
that requests the resource to be scheduled on that node.

**Example:**

Here is an example showing how to use `curl` to form an HTTP request that
advertises five "example.com/foo" resources on node `k8s-node-1` whose master
is `k8s-master`.

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

{{< note >}}
In the preceding request, `~1` is the encoding for the character `/`
in the patch path. The operation path value in JSON-Patch is interpreted as a
JSON-Pointer. For more details, see
[IETF RFC 6901, section 3](https://tools.ietf.org/html/rfc6901#section-3).
{{< /note >}}

#### Cluster-level extended resources

Cluster-level extended resources are not tied to nodes. They are usually managed
by scheduler extenders, which handle the resource consumption and resource quota.

You can specify the extended resources that are handled by scheduler extenders
in [scheduler policy
configuration](https://github.com/kubernetes/kubernetes/blob/release-1.10/pkg/scheduler/api/v1/types.go#L31).

**Example:**

The following configuration for a scheduler policy indicates that the
cluster-level extended resource "example.com/foo" is handled by the scheduler
extender.

- The scheduler sends a Pod to the scheduler extender only if the Pod requests
     "example.com/foo".
- The `ignoredByScheduler` field specifies that the scheduler does not check
     the "example.com/foo" resource in its `PodFitsResources` predicate.

```json
{
  "kind": "Policy",
  "apiVersion": "v1",
  "extenders": [
    {
      "urlPrefix":"<extender-endpoint>",
      "bindVerb": "bind",
      "managedResources": [
        {
          "name": "example.com/foo",
          "ignoredByScheduler": true
        }
      ]
    }
  ]
}
```

### Consuming extended resources

Users can consume extended resources in Pod specs just like CPU and memory.
The scheduler takes care of the resource accounting so that no more than the
available amount is simultaneously allocated to Pods.

The API server restricts quantities of extended resources to whole numbers.
Examples of _valid_ quantities are `3`, `3000m` and `3Ki`. Examples of
_invalid_ quantities are `0.5` and `1500m`.

{{< note >}}
Extended resources replace Opaque Integer Resources.
Users can use any domain name prefix other than `kubernetes.io` which is reserved.
{{< /note >}}

To consume an extended resource in a Pod, include the resource name as a key
in the `spec.containers[].resources.limits` map in the container spec.

{{< note >}}
Extended resources cannot be overcommitted, so request and limit
must be equal if both are present in a container spec.
{{< /note >}}

A Pod is scheduled only if all of the resource requests are satisfied, including
CPU, memory and any extended resources. The Pod remains in the `PENDING` state
as long as the resource request cannot be satisfied.

**Example:**

The Pod below requests 2 CPUs and 1 "example.com/foo" (an extended resource).

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: myimage
    resources:
      requests:
        cpu: 2
        example.com/foo: 1
      limits:
        example.com/foo: 1
```

## Troubleshooting

### My Pods are pending with event message failedScheduling

If the scheduler cannot find any node where a Pod can fit, the Pod remains
unscheduled until a place can be found. An event is produced each time the
scheduler fails to find a place for the Pod, like this:

```shell
kubectl describe pod frontend | grep -A 3 Events
```
```
Events:
  FirstSeen LastSeen   Count  From          Subobject   PathReason      Message
  36s   5s     6      {scheduler }              FailedScheduling  Failed for reason PodExceedsFreeCPU and possibly others
```

In the preceding example, the Pod named "frontend" fails to be scheduled due to
insufficient CPU resource on the node. Similar error messages can also suggest
failure due to insufficient memory (PodExceedsFreeMemory). In general, if a Pod
is pending with a message of this type, there are several things to try:

- Add more nodes to the cluster.
- Terminate unneeded Pods to make room for pending Pods.
- Check that the Pod is not larger than all the nodes. For example, if all the
  nodes have a capacity of `cpu: 1`, then a Pod with a request of `cpu: 1.1` will
  never be scheduled.

You can check node capacities and amounts allocated with the
`kubectl describe nodes` command. For example:

```shell
kubectl describe nodes e2e-test-node-pool-4lw4
```
```
Name:            e2e-test-node-pool-4lw4
[ ... lines removed for clarity ...]
Capacity:
 cpu:                               2
 memory:                            7679792Ki
 pods:                              110
Allocatable:
 cpu:                               1800m
 memory:                            7474992Ki
 pods:                              110
[ ... lines removed for clarity ...]
Non-terminated Pods:        (5 in total)
  Namespace    Name                                  CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ---------    ----                                  ------------  ----------  ---------------  -------------
  kube-system  fluentd-gcp-v1.38-28bv1               100m (5%)     0 (0%)      200Mi (2%)       200Mi (2%)
  kube-system  kube-dns-3297075139-61lj3             260m (13%)    0 (0%)      100Mi (1%)       170Mi (2%)
  kube-system  kube-proxy-e2e-test-...               100m (5%)     0 (0%)      0 (0%)           0 (0%)
  kube-system  monitoring-influxdb-grafana-v4-z1m12  200m (10%)    200m (10%)  600Mi (8%)       600Mi (8%)
  kube-system  node-problem-detector-v0.1-fj7m3      20m (1%)      200m (10%)  20Mi (0%)        100Mi (1%)
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests    CPU Limits    Memory Requests    Memory Limits
  ------------    ----------    ---------------    -------------
  680m (34%)      400m (20%)    920Mi (11%)        1070Mi (13%)
```

In the preceding output, you can see that if a Pod requests more than 1120m
CPUs or 6.23Gi of memory, it will not fit on the node.

By looking at the `Pods` section, you can see which Pods are taking up space on
the node.

The amount of resources available to Pods is less than the node capacity, because
system daemons use a portion of the available resources. The `allocatable` field
[NodeStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#nodestatus-v1-core)
gives the amount of resources that are available to Pods. For more information, see
[Node Allocatable Resources](https://git.k8s.io/community/contributors/design-proposals/node/node-allocatable.md).

The [resource quota](/docs/concepts/policy/resource-quotas/) feature can be configured
to limit the total amount of resources that can be consumed. If used in conjunction
with namespaces, it can prevent one team from hogging all the resources.

### My Container is terminated

Your Container might get terminated because it is resource-starved. To check
whether a Container is being killed because it is hitting a resource limit, call
`kubectl describe pod` on the Pod of interest:

```shell
kubectl describe pod simmemleak-hra99
```
```
Name:                           simmemleak-hra99
Namespace:                      default
Image(s):                       saadali/simmemleak
Node:                           kubernetes-node-tf0f/10.240.216.66
Labels:                         name=simmemleak
Status:                         Running
Reason:
Message:
IP:                             10.244.2.75
Replication Controllers:        simmemleak (1/1 replicas created)
Containers:
  simmemleak:
    Image:  saadali/simmemleak
    Limits:
      cpu:                      100m
      memory:                   50Mi
    State:                      Running
      Started:                  Tue, 07 Jul 2015 12:54:41 -0700
    Last Termination State:     Terminated
      Exit Code:                1
      Started:                  Fri, 07 Jul 2015 12:54:30 -0700
      Finished:                 Fri, 07 Jul 2015 12:54:33 -0700
    Ready:                      False
    Restart Count:              5
Conditions:
  Type      Status
  Ready     False
Events:
  FirstSeen                         LastSeen                         Count  From                              SubobjectPath                       Reason      Message
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {scheduler }                                                          scheduled   Successfully assigned simmemleak-hra99 to kubernetes-node-tf0f
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   pulled      Pod container image "k8s.gcr.io/pause:0.8.0" already present on machine
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   created     Created with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   started     Started with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    spec.containers{simmemleak}         created     Created with docker id 87348f12526a
```

In the preceding example, the `Restart Count:  5` indicates that the `simmemleak`
Container in the Pod was terminated and restarted five times.

You can call `kubectl get pod` with the `-o go-template=...` option to fetch the status
of previously terminated Containers:

```shell
kubectl get pod -o go-template='{{range.status.containerStatuses}}{{"Container Name: "}}{{.name}}{{"\r\nLastState: "}}{{.lastState}}{{end}}'  simmemleak-hra99
```
```
Container Name: simmemleak
LastState: map[terminated:map[exitCode:137 reason:OOM Killed startedAt:2015-07-07T20:58:43Z finishedAt:2015-07-07T20:58:43Z containerID:docker://0e4095bba1feccdfe7ef9fb6ebffe972b4b14285d5acdec6f0d3ae8a22fad8b2]]
```

You can see that the Container was terminated because of `reason:OOM Killed`, where `OOM` stands for Out Of Memory.






## {{% heading "whatsnext" %}}


* Get hands-on experience [assigning Memory resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/).

* Get hands-on experience [assigning CPU resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).

* For more details about the difference between requests and limits, see
  [Resource QoS](https://git.k8s.io/community/contributors/design-proposals/node/resource-qos.md).

* Read the [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core) API reference

* Read the [ResourceRequirements](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcerequirements-v1-core) API reference

* Read about [project quotas](https://xfs.org/docs/xfsdocs-xml-dev/XFS_User_Guide/tmp/en-US/html/xfs-quotas.html) in XFS
