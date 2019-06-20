---
title: Managing Compute Resources for Containers
content_template: templates/concept
weight: 20
feature:
  title: Automatic bin packing
  description: >
    Automatically places containers based on their resource requirements and other constraints, while not sacrificing availability. Mix critical and best-effort workloads in order to drive up utilization and save even more resources.
---

{{% capture overview %}}

When you specify a [Pod](/docs/concepts/workloads/pods/pod/), you can optionally specify how
much CPU and memory (RAM) each Container needs. When Containers have resource
requests specified, the scheduler can make better decisions about which nodes to
place Pods on. And when Containers have their limits specified, contention for
resources on a node can be handled in a specified manner. For more details about
the difference between requests and limits, see
[Resource QoS](https://git.k8s.io/community/contributors/design-proposals/node/resource-qos.md).

{{% /capture %}}


{{% capture body %}}

## Resource types

*CPU* and *memory* are each a *resource type*. A resource type has a base unit.
CPU is specified in units of cores, and memory is specified in units of bytes.

CPU and memory are collectively referred to as *compute resources*, or just
*resources*. Compute
resources are measurable quantities that can be requested, allocated, and
consumed. They are distinct from
[API resources](/docs/concepts/overview/kubernetes-api/). API resources, such as Pods and
[Services](/docs/concepts/services-networking/service/) are objects that can be read and modified
through the Kubernetes API server.

## Resource requests and limits of Pod and Container

Each Container of a Pod can specify one or more of the following:

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`

Although requests and limits can only be specified on individual Containers, it
is convenient to talk about Pod resource requests and limits. A
*Pod resource request/limit* for a particular resource type is the sum of the
resource requests/limits of that type for each Container in the Pod.

## Meaning of CPU

Limits and requests for CPU resources are measured in *cpu* units.
One cpu, in Kubernetes, is equivalent to:

- 1 AWS vCPU
- 1 GCP Core
- 1 Azure vCore
- 1 IBM vCPU
- 1 *Hyperthread* on a bare-metal Intel processor with Hyperthreading

Fractional requests are allowed. A Container with
`spec.containers[].resources.requests.cpu` of `0.5` is guaranteed half as much
CPU as one that asks for 1 CPU.  The expression `0.1` is equivalent to the
expression `100m`, which can be read as "one hundred millicpu". Some people say
"one hundred millicores", and this is understood to mean the same thing. A
request with a decimal point, like `0.1`, is converted to `100m` by the API, and
precision finer than `1m` is not allowed. For this reason, the form `100m` might
be preferred.

CPU is always requested as an absolute quantity, never as a relative quantity;
0.1 is the same amount of CPU on a single-core, dual-core, or 48-core machine.

## Meaning of memory

Limits and requests for `memory` are measured in bytes. You can express memory as
a plain integer or as a fixed-point integer using one of these suffixes:
E, P, T, G, M, K. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following represent roughly the same value:

```shell
128974848, 129e6, 129M, 123Mi
```

Here's an example.
The following Pod has two Containers. Each Container has a request of 0.25 cpu
and 64MiB (2<sup>26</sup> bytes) of memory. Each Container has a limit of 0.5
cpu and 128MiB of memory. You can say the Pod has a request of 0.5 cpu and 128
MiB of memory, and a limit of 1 cpu and 256MiB of memory.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: db
    image: mysql
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: "password"
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: wp
    image: wordpress
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## How Pods with resource requests are scheduled

When you create a Pod, the Kubernetes scheduler selects a node for the Pod to
run on. Each node has a maximum capacity for each of the resource types: the
amount of CPU and memory it can provide for Pods. The scheduler ensures that,
for each resource type, the sum of the resource requests of the scheduled
Containers is less than the capacity of the node. Note that although actual memory
or CPU resource usage on nodes is very low, the scheduler still refuses to place
a Pod on a node if the capacity check fails. This protects against a resource
shortage on a node when resource usage later increases, for example, during a
daily peak in request rate.

## How Pods with resource limits are run

When the kubelet starts a Container of a Pod, it passes the CPU and memory limits
to the container runtime.

When using Docker:

- The `spec.containers[].resources.requests.cpu` is converted to its core value,
  which is potentially fractional, and multiplied by 1024. The greater of this number
  or 2 is used as the value of the
  [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#/cpu-share-constraint)
  flag in the `docker run` command.

- The `spec.containers[].resources.limits.cpu` is converted to its millicore value and
  multiplied by 100. The resulting value is the total amount of CPU time that a container can use
  every 100ms. A container cannot use more than its share of CPU time during this interval.

  {{< note >}}
  The default quota period is 100ms. The minimum resolution of CPU quota is 1ms.
  {{</ note >}}

- The `spec.containers[].resources.limits.memory` is converted to an integer, and
  used as the value of the
  [`--memory`](https://docs.docker.com/engine/reference/run/#/user-memory-constraints)
  flag in the `docker run` command.

If a Container exceeds its memory limit, it might be terminated. If it is
restartable, the kubelet will restart it, as with any other type of runtime
failure.

If a Container exceeds its memory request, it is likely that its Pod will
be evicted whenever the node runs out of memory.

A Container might or might not be allowed to exceed its CPU limit for extended
periods of time. However, it will not be killed for excessive CPU usage.

To determine whether a Container cannot be scheduled or is being killed due to
resource limits, see the
[Troubleshooting](#troubleshooting) section.

## Monitoring compute resource usage

The resource usage of a Pod is reported as part of the Pod status.

If [optional monitoring](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/README.md)
is configured for your cluster, then Pod resource usage can be retrieved from
the monitoring system.

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
  680m (34%)      400m (20%)    920Mi (12%)        1070Mi (14%)
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

## Local ephemeral storage
{{< feature-state state="beta" >}}

Kubernetes version 1.8 introduces a new resource, _ephemeral-storage_ for managing local ephemeral storage. In each Kubernetes node, kubelet's root directory (/var/lib/kubelet by default) and log directory (/var/log) are stored on the root partition of the node. This partition is also shared and consumed by Pods via emptyDir volumes, container logs, image layers and container writable layers.

This partition is “ephemeral” and applications cannot expect any performance SLAs (Disk IOPS for example) from this partition. Local ephemeral storage management only applies for the root partition; the optional partition for image layer and writable layer is out of scope.

{{< note >}}
If an optional runtime partition is used, root partition will not hold any image layer or writable layers.
{{< /note >}}

### Requests and limits setting for local ephemeral storage
Each Container of a Pod can specify one or more of the following:

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

Limits and requests for `ephemeral-storage` are measured in bytes. You can express storage as
a plain integer or as a fixed-point integer using one of these suffixes:
E, P, T, G, M, K. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following represent roughly the same value:

```shell
128974848, 129e6, 129M, 123Mi
```

For example, the following Pod has two Containers. Each Container has a request of 2GiB of local ephemeral storage. Each Container has a limit of 4GiB of local ephemeral storage. Therefore, the Pod has a request of 4GiB of local ephemeral storage, and a limit of 8GiB of storage.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: db
    image: mysql
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: "password"
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
  - name: wp
    image: wordpress
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
```

### How Pods with ephemeral-storage requests are scheduled

When you create a Pod, the Kubernetes scheduler selects a node for the Pod to
run on. Each node has a maximum amount of local ephemeral storage it can provide for Pods. For more information, see ["Node Allocatable"](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable). 

The scheduler ensures that the sum of the resource requests of the scheduled Containers is less than the capacity of the node.

### How Pods with ephemeral-storage limits run

For container-level isolation, if a Container's writable layer and logs usage exceeds its storage limit, the Pod will be evicted. For pod-level isolation, if the sum of the local ephemeral storage usage from all containers and also the Pod's emptyDir volumes exceeds the limit, the Pod will be evicted.

### Monitoring ephemeral-storage consumption

When local ephemeral storage is used, it is monitored on an ongoing
basis by the kubelet.  The monitoring is performed by scanning each
emptyDir volume, log directories, and writable layers on a periodic
basis.  Starting with Kubernetes 1.15, emptyDir volumes (but not log
directories or writable layers) may, at the cluster operator's option,
be managed by use of [project
quotas](http://xfs.org/docs/xfsdocs-xml-dev/XFS_User_Guide/tmp/en-US/html/xfs-quotas.html).
Project quotas were originally implemented in XFS, and have more
recently been ported to ext4fs.  Project quotas can be used for both
monitoring and enforcement; as of Kubernetes 1.15, they are available
as alpha functionality for monitoring only.

Quotas are faster and more accurate than directory scanning.  When a
directory is assigned to a project, all files created under a
directory are created in that project, and the kernel merely has to
keep track of how many blocks are in use by files in that project.  If
a file is created and deleted, but with an open file descriptor, it
continues to consume space.  This space will be tracked by the quota,
but will not be seen by a directory scan.

Kubernetes uses project IDs starting from 1048576.  The IDs in use are
registered in `/etc/projects` and `/etc/projid`.  If project IDs in
this range are used for other purposes on the system, those project
IDs must be registered in `/etc/projects` and `/etc/projid` to prevent
Kubernetes from using them.

To enable use of project quotas, the cluster operator must do the
following:

* Enable the `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  feature gate in the kubelet configuration.  This defaults to `false`
  in Kubernetes 1.15, so must be explicitly set to `true`.

* Ensure that the root partition (or optional runtime partition) is
  built with project quotas enabled.  All XFS filesystems support
  project quotas, but ext4 filesystems must be built specially.

* Ensure that the root partition (or optional runtime partition) is
  mounted with project quotas enabled.

#### Building and mounting filesystems with project quotas enabled

XFS filesystems require no special action when building; they are
automatically built with project quotas enabled.

Ext4fs filesystems must be built with quotas enabled, then they must
be enabled in the filesystem:

```
% sudo mkfs.ext4 other_ext4fs_args... -E quotatype=prjquota /dev/block_device
% sudo tune2fs -O project -Q prjquota /dev/block_device

```

To mount the filesystem, both ext4fs and XFS require the `prjquota`
option set in `/etc/fstab`:

```
/dev/block_device	/var/kubernetes_data	defaults,prjquota	0	0
```


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

## Planned Improvements

Kubernetes version 1.5 only allows resource quantities to be specified on a
Container. It is planned to improve accounting for resources that are shared by
all Containers in a Pod, such as
[emptyDir volumes](/docs/concepts/storage/volumes/#emptydir).

Kubernetes version 1.5 only supports Container requests and limits for CPU and
memory. It is planned to add new resource types, including a node disk space
resource, and a framework for adding custom
[resource types](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/scheduling/resources.md).

Kubernetes supports overcommitment of resources by supporting multiple levels of
[Quality of Service](http://issue.k8s.io/168).

In Kubernetes version 1.5, one unit of CPU means different things on different
cloud providers, and on different machine types within the same cloud providers.
For example, on AWS, the capacity of a node is reported in
[ECUs](http://aws.amazon.com/ec2/faqs/), while in GCE it is reported in logical
cores. We plan to revise the definition of the cpu resource to allow for more
consistency across providers and platforms.

{{% /capture %}}


{{% capture whatsnext %}}

* Get hands-on experience [assigning Memory resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/).

* Get hands-on experience [assigning CPU resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).

* [Container API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)

* [ResourceRequirements](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcerequirements-v1-core)

{{% /capture %}}
