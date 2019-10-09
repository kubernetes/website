---
title: 为容器管理计算资源
content_template: templates/concept
weight: 20
feature:
  title: 自动装箱
  description: >
    根据资源需求和其他约束自动放置容器，同时不会牺牲可用性，将任务关键工作负载和尽力服务工作负载进行混合放置，以提高资源利用率并节省更多资源。
---

{{% capture overview %}}

<!--
When you specify a [Pod](/docs/concepts/workloads/pods/pod/), you can optionally specify how
much CPU and memory (RAM) each Container needs. When Containers have resource
requests specified, the scheduler can make better decisions about which nodes to
place Pods on. And when Containers have their limits specified, contention for
resources on a node can be handled in a specified manner. For more details about
the difference between requests and limits, see
[Resource QoS](https://git.k8s.io/community/contributors/design-proposals/node/resource-qos.md).
-->
当您定义 [Pod](/docs/user-guide/pods) 的时候可以选择为每个容器指定需要的 CPU 和内存（RAM）大小。当为容器指定了资源请求后，调度器就能够更好的判断出将容器调度到哪个节点上。如果您还为容器指定了资源限制，Kubernetes 就可以按照指定的方式来处理节点上的资源竞争。关于资源请求和限制的不同点和更多资料请参考 [Resource QoS](https://git.k8s.io/community/contributors/design-proposals/resource-qos.md)。

{{% /capture %}}


{{% capture body %}}

<!--
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
-->

## 资源类型

*CPU* 和*内存*都是*资源类型*。资源类型具有基本单位。CPU 的单位是核心数，内存的单位是字节。

CPU和内存统称为*计算资源*，也可以称为*资源*。计算资源的数量是可以被请求、分配、消耗和可测量的。它们与 [API 资源](/docs/concepts/overview/kubernetes-api/) 不同。 API 资源（如 Pod 和 [Service](/docs/concepts/services-networking/service/)）是可通过 Kubernetes API server 读取和修改的对象。

<!--
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
-->

## Pod 和 容器的资源请求和限制

Pod 中的每个容器都可以指定以下的一个或者多个值：

- `spec.containers[].resources.limits.cpu`
- `spec.containers[].resources.limits.memory`
- `spec.containers[].resources.requests.cpu`
- `spec.containers[].resources.requests.memory`

尽管只能在个别容器上指定请求和限制，但是我们可以方便地计算出 Pod 资源请求和限制。特定资源类型的Pod 资源请求/限制是 Pod 中每个容器的该类型的资源请求/限制的总和。

<!--
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
-->

## CPU 的含义

CPU 资源的限制和请求以 *cpu* 为单位。

Kubernetes 中的一个 cpu 等于：

- 1 AWS vCPU
- 1 GCP Core
- 1 Azure vCore
- 1 *Hyperthread* 在带有超线程的裸机 Intel 处理器上

允许浮点数请求。具有 `spec.containers[].resources.requests.cpu` 为 0.5 的容器保证了一半 CPU 要求 1 CPU的一半。表达式 `0.1` 等价于表达式 `100m`，可以看作 “100 millicpu”。有些人说成是“一百毫 cpu”，其实说的是同样的事情。具有小数点（如 `0.1`）的请求由 API 转换为`100m`，精度不超过 `1m`。因此，可能会优先选择 `100m` 的形式。

CPU 总是要用绝对数量，不可以使用相对数量；0.1 的 CPU 在单核、双核、48核的机器中的意义是一样的。

<!--
## Meaning of memory

Limits and requests for `memory` are measured in bytes. You can express memory as
a plain integer or as a fixed-point integer using one of these suffixes:
E, P, T, G, M, K. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following represent roughly the same value:
-->

## 内存的含义

内存的限制和请求以字节为单位。您可以使用以下后缀之一作为平均整数或定点整数表示内存：E，P，T，G，M，K。您还可以使用两个字母的等效的幂数：Ei，Pi，Ti ，Gi，Mi，Ki。例如，以下代表大致相同的值：

```shell
128974848, 129e6, 129M, 123Mi
```

<!--
Here's an example.
The following Pod has two Containers. Each Container has a request of 0.25 cpu
and 64MiB (2<sup>26</sup> bytes) of memory. Each Container has a limit of 0.5
cpu and 128MiB of memory. You can say the Pod has a request of 0.5 cpu and 128
MiB of memory, and a limit of 1 cpu and 256MiB of memory.
-->

下面是个例子。

以下 Pod 有两个容器。每个容器的请求为 0.25 cpu 和 64MiB（2<sup>26</sup> 字节）内存，每个容器的限制为 0.5 cpu 和 128MiB 内存。您可以说该 Pod 请求 0.5 cpu 和 128 MiB 的内存，限制为 1 cpu 和 256MiB 的内存。

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

<!--
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
-->

## 具有资源请求的 Pod 如何调度

当您创建一个 Pod 时，Kubernetes 调度程序将为 Pod 选择一个节点。每个节点具有每种资源类型的最大容量：可为 Pod 提供的 CPU 和内存量。调度程序确保对于每种资源类型，调度的容器的资源请求的总和小于节点的容量。请注意，尽管节点上的实际内存或 CPU 资源使用量非常低，但如果容量检查失败，则调度程序仍然拒绝在该节点上放置 Pod。当资源使用量稍后增加时，例如在请求率的每日峰值期间，这可以防止节点上的资源短缺。

<!--
## How Pods with resource limits are run

When the kubelet starts a Container of a Pod, it passes the CPU and memory limits
to the container runtime.

When using Docker:
-->

## 具有资源限制的 Pod 如何运行

当 kubelet 启动一个 Pod 的容器时，它会将 CPU 和内存限制传递到容器运行时。

当使用 Docker 时：

<!--
- The `spec.containers[].resources.requests.cpu` is converted to its core value,
  which is potentially fractional, and multiplied by 1024. The greater of this number
  or 2 is used as the value of the
  [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#cpu-share-constraint)
  flag in the `docker run` command.

- The `spec.containers[].resources.limits.cpu` is converted to its millicore value and
  multiplied by 100. The resulting value is the total amount of CPU time that a container can use
  every 100ms. A container cannot use more than its share of CPU time during this interval.
-->

- `spec.containers[].resources.requests.cpu` 的值将转换成 millicore 值，这是个浮点数，并乘以 1024，这个数字中的较大者或 2 用作 `docker run` 命令中的[ `--cpu-shares`](https://docs.docker.com/engine/reference/run/#/cpu-share-constraint) 标志的值。

- `spec.containers[].resources.limits.cpu` 被转换成 millicore 值。被乘以 100000 然后 除以 1000。这个数字用作 `docker run` 命令中的 [`--cpu-quota`](https://docs.docker.com/engine/reference/run/#/cpu-quota-constraint) 标志的值。[`--cpu-quota` ] 标志被设置成了 100000，表示测量配额使用的默认100ms 周期。如果 [`--cpu-cfs-quota`] 标志设置为 true，则 kubelet 会强制执行 cpu 限制。从 Kubernetes 1.2 版本起，此标志默认为 true。

<!--
  {{< note >}}
  The default quota period is 100ms. The minimum resolution of CPU quota is 1ms.
  {{</ note >}}
-->

  {{< note >}}
  默认配额限制为 100 毫秒。 CPU配额的最小单位为 1 毫秒。
  {{</ note >}}

<!--
- The `spec.containers[].resources.limits.memory` is converted to an integer, and
  used as the value of the
  [`--memory`](https://docs.docker.com/engine/reference/run/#/user-memory-constraints)
  flag in the `docker run` command.
-->

- `spec.containers[].resources.limits.memory` 被转换为整型，作为 `docker run` 命令中的 [`--memory`](https://docs.docker.com/engine/reference/run/#/user-memory-constraints) 标志的值。

<!--
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
-->

如果容器超过其内存限制，则可能会被终止。如果可重新启动，则与所有其他类型的运行时故障一样，kubelet 将重新启动它。

如果一个容器超过其内存请求，那么当节点内存不足时，它的 Pod 可能被逐出。

容器可能被允许也可能不被允许超过其 CPU 限制时间。但是，由于 CPU 使用率过高，不会被杀死。

要确定容器是否由于资源限制而无法安排或被杀死，请参阅[疑难解答](#troubleshooting) 部分。

<!--
## Monitoring compute resource usage

The resource usage of a Pod is reported as part of the Pod status.

If [optional monitoring](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/README.md)
is configured for your cluster, then Pod resource usage can be retrieved from
the monitoring system.
-->

## 监控计算资源使用

Pod 的资源使用情况被报告为 Pod 状态的一部分。

如果为集群配置了 [可选监控](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/README.md)，则可以从监控系统检索 Pod 资源的使用情况。

<!--
## Troubleshooting

### My Pods are pending with event message failedScheduling

If the scheduler cannot find any node where a Pod can fit, the Pod remains
unscheduled until a place can be found. An event is produced each time the
scheduler fails to find a place for the Pod, like this:
-->

## 疑难解答

### 我的 Pod 处于 pending 状态且事件信息显示 failedScheduling

如果调度器找不到任何该 Pod 可以匹配的节点，则该 Pod 将保持不可调度状态，直到找到一个可以被调度到的位置。每当调度器找不到 Pod 可以调度的地方时，会产生一个事件，如下所示：

```shell
kubectl describe pod frontend | grep -A 3 Events
```
```
Events:
  FirstSeen LastSeen   Count  From          Subobject   PathReason      Message
  36s   5s     6      {scheduler }              FailedScheduling  Failed for reason PodExceedsFreeCPU and possibly others
```

<!--
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
-->

在上述示例中，由于节点上的 CPU 资源不足，名为 “frontend” 的 Pod 将无法调度。由于内存不足（PodExceedsFreeMemory），类似的错误消息也可能会导致失败。一般来说，如果有这种类型的消息而处于 pending 状态，您可以尝试如下几件事情：

- 向集群添加更多节点。
- 终止不需要的 Pod，为待处理的 Pod 腾出空间。
- 检查 Pod 所需的资源是否大于所有节点的资源。 例如，如果全部节点的容量为`cpu：1`，那么一个请求为 `cpu：1.1`的 Pod 永远不会被调度。

您可以使用 `kubectl describe nodes` 命令检查节点容量和分配的数量。 例如：


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

<!--
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
-->

在上面的输出中，您可以看到如果 Pod 请求超过 1120m CPU 或者 6.23Gi 内存，节点将无法满足。

通过查看 `Pods` 部分，您将看到哪些 Pod 占用的节点上的资源。

Pod 可用的资源量小于节点容量，因为系统守护程序使用一部分可用资源。 
[NodeStatus](/docs/resources-reference/{{< param "version" >}}/#nodestatus-v1-core) 的 `allocatable` 字段给出了可用于 Pod 的资源量。
有关更多信息，请参阅 [节点可分配资源](https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md)。

可以将 [资源配额](/docs/concepts/policy/resource-quotas/) 功能配置为限制可以使用的资源总量。如果与 namespace 配合一起使用，就可以防止一个团队占用所有资源。

<!--
### My Container is terminated

Your Container might get terminated because it is resource-starved. To check
whether a Container is being killed because it is hitting a resource limit, call
`kubectl describe pod` on the Pod of interest:
-->

## 我的容器被终止了

您的容器可能因为资源枯竭而被终止了。要查看容器是否因为遇到资源限制而被杀死，请在相关的 Pod 上调用 `kubectl describe pod`：

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

<!--
In the preceding example, the `Restart Count:  5` indicates that the `simmemleak`
Container in the Pod was terminated and restarted five times.

You can call `kubectl get pod` with the `-o go-template=...` option to fetch the status
of previously terminated Containers:
-->

在上面的例子中，`Restart Count: 5` 意味着 Pod 中的 `simmemleak` 容器被终止并重启了五次。

您可以使用 `kubectl get pod` 命令加上 `-o go-template=...` 选项来获取之前终止容器的状态。


```shell
kubectl get pod -o go-template='{{range.status.containerStatuses}}{{"Container Name: "}}{{.name}}{{"\r\nLastState: "}}{{.lastState}}{{end}}'  simmemleak-hra99
```
```
Container Name: simmemleak
LastState: map[terminated:map[exitCode:137 reason:OOM Killed startedAt:2015-07-07T20:58:43Z finishedAt:2015-07-07T20:58:43Z containerID:docker://0e4095bba1feccdfe7ef9fb6ebffe972b4b14285d5acdec6f0d3ae8a22fad8b2]]
```

<!--
You can see that the Container was terminated because of `reason:OOM Killed`, where `OOM` stands for Out Of Memory.
-->

您可以看到容器因为 `reason:OOM killed` 被终止，`OOM` 表示 Out Of Memory。

<!--
## Local ephemeral storage
{{< feature-state state="beta" >}}

Kubernetes version 1.8 introduces a new resource, _ephemeral-storage_ for managing local ephemeral storage. In each Kubernetes node, kubelet's root directory (/var/lib/kubelet by default) and log directory (/var/log) are stored on the root partition of the node. This partition is also shared and consumed by Pods via emptyDir volumes, container logs, image layers and container writable layers.

This partition is “ephemeral” and applications cannot expect any performance SLAs (Disk IOPS for example) from this partition. Local ephemeral storage management only applies for the root partition; the optional partition for image layer and writable layer is out of scope.

{{< note >}}
If an optional runtime partition is used, root partition will not hold any image layer or writable layers.
{{< /note >}}
-->

## 本地临时存储

Kubernetes版本1.8引入了新资源_ephemeral-storage_，用于管理本地临时存储。
在每个Kubernetes节点中，kubelet的根目录（默认为 /var/lib/kubelet）和日志目录（ /var/log ）存储在节点的根分区上。 
Pods还通过emptyDir卷，容器日志，镜像层和容器可写层共享和使用此分区。

该分区是“临时”分区，应用程序无法从该分区获得任何性能SLA（例如磁盘IOPS）。 本地临时存储管理仅适用于根分区。 图像层和可写层的可选分区超出范围。

{{< note >}}
如果使用可选的运行时分区，则根分区将不保存任何镜像层或可写层。
{{< /note >}}

<!--
### Requests and limits setting for local ephemeral storage
Each Container of a Pod can specify one or more of the following:
-->

### 本地临时存储的请求和限制设置
Pod 的每个容器可以指定以下一项或多项：

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

<!--
Limits and requests for `ephemeral-storage` are measured in bytes. You can express storage as
a plain integer or as a fixed-point integer using one of these suffixes:
E, P, T, G, M, K. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following represent roughly the same value:
-->

对“临时存储”的限制和请求以字节为单位。您可以使用以下后缀之一将存储表示为纯整数或小数形式：E，P，T，G，M，K。您还可以使用2的幂次方：Ei，Pi，Ti，Gi，Mi，Ki。例如，以下内容表示的值其实大致相同：

```shell
128974848, 129e6, 129M, 123Mi
```

<!--
For example, the following Pod has two Containers. Each Container has a request of 2GiB of local ephemeral storage. Each Container has a limit of 4GiB of local ephemeral storage. Therefore, the Pod has a request of 4GiB of local ephemeral storage, and a limit of 8GiB of storage.
-->

例如，以下Pod具有两个容器。每个容器都有一个2GiB的本地临时存储请求。每个容器的本地临时存储限制为4GiB。因此，该Pod要求本地临时存储空间为4GiB，存储空间限制为8GiB。

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

<!--
### How Pods with ephemeral-storage requests are scheduled

When you create a Pod, the Kubernetes scheduler selects a node for the Pod to
run on. Each node has a maximum amount of local ephemeral storage it can provide for Pods. For more information, see ["Node Allocatable"](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable). 

The scheduler ensures that the sum of the resource requests of the scheduled Containers is less than the capacity of the node.
-->

### 如何调度临时存储请求的 Pod

创建Pod时，Kubernetes调度程序会选择一个节点来运行Pod。每个节点都可以为Pod提供最大数量的本地临时存储。
有关更多信息，请参见[节点可分配](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)。

调度程序会确保调度的容器的资源请求的总和小于节点的容量。

<!--
### How Pods with ephemeral-storage limits run

For container-level isolation, if a Container's writable layer and logs usage exceeds its storage limit, the Pod will be evicted. For pod-level isolation, if the sum of the local ephemeral storage usage from all containers and also the Pod's emptyDir volumes exceeds the limit, the Pod will be evicted.
-->

### 具有临时存储限制的 Pod 如何运行

对于容器级隔离，如果容器的可写层和日志使用量超出其存储限制，则将驱逐Pod。对于 pod 级别的隔离，如果来自所有容器的本地临时存储使用量以及 Pod 的 emptyDir 卷的总和超过限制，则将驱逐Pod。

<!--
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
-->

### 监控临时存储消耗

使用本地临时存储时，kubelet 会持续对本地临时存储时进行监视。
通过定期扫描，来监视每个 emptyDir 卷，日志目录和可写层。 
从Kubernetes 1.15开始，作为集群操作员的一个选项，可以通过[项目配额](http://xfs.org/docs/xfsdocs-xml-dev/XFS_User_Guide/tmp/en-US/html/xfs-quotas.html) 来管理 emptyDir 卷（但是不包括日志目录或可写层）。
项目配额最初是在XFS中实现的，最近又被移植到ext4fs中。 项目配额可用于监视和执行； 从Kubernetes 1.15开始，它们可用作Alpha功能仅用于监视。

<!--
Quotas are faster and more accurate than directory scanning.  When a
directory is assigned to a project, all files created under a
directory are created in that project, and the kernel merely has to
keep track of how many blocks are in use by files in that project.  If
a file is created and deleted, but with an open file descriptor, it
continues to consume space.  This space will be tracked by the quota,
but will not be seen by a directory scan.
-->

配额比目录扫描更快，更准确。 
将目录分配给项目时，在该目录下创建的所有文件都将在该项目中创建，内核仅需跟踪该项目中的文件正在使用多少块。 
如果创建并删除了文件，但是文件描述符已打开，它将继续占用空间。 该空间将由配额跟踪，但目录扫描不会检查。

<!--
Kubernetes uses project IDs starting from 1048576.  The IDs in use are
registered in `/etc/projects` and `/etc/projid`.  If project IDs in
this range are used for other purposes on the system, those project
IDs must be registered in `/etc/projects` and `/etc/projid` to prevent
Kubernetes from using them.
-->

Kubernetes使用从1048576开始的项目ID。正在使用的ID注册于 `/etc/projects` 和 `/etc/projid`。 
如果此范围内的项目ID用于系统上的其他目的，则这些项目ID必须在 `/etc/projects` 和 `/etc/projid` 中注册，以防止Kubernetes使用它们。

<!--
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
-->

要启用项目配额，集群操作员必须执行以下操作：

* 在kubelet配置中启用 `LocalStorageCapacityIsolationFSQuotaMonitoring = true` 功能。 在Kubernetes 1.15中默认为 false，因此必须显式设置为 true。

* 确保根分区（或可选的运行时分区）是在启用项目配额的情况下构建的。 所有 XFS 文件系统都支持项目配额，但是 ext4 文件系统必须专门构建。

* 确保在启用了项目配额的情况下挂载了根分区（或可选的运行时分区）。

<!--
#### Building and mounting filesystems with project quotas enabled

XFS filesystems require no special action when building; they are
automatically built with project quotas enabled.

Ext4fs filesystems must be built with quotas enabled, then they must
be enabled in the filesystem:
-->

#### 在启用项目配额的情况下构建和挂载文件系统

XFS文件系统在构建时不需要任何特殊操作; 它们是在启用项目配额的情况下自动构建的。

Ext4fs文件系统必须在启用了配额的情况下构建，然后必须在文件系统中启用它们：

```
% sudo mkfs.ext4 other_ext4fs_args... -E quotatype=prjquota /dev/block_device
% sudo tune2fs -O project -Q prjquota /dev/block_device

```

<!--
To mount the filesystem, both ext4fs and XFS require the `prjquota`
option set in `/etc/fstab`:
-->

要挂载文件系统，ext4fs 和 XFS 都需要在 `/etc/fstab` 中设置 `prjquota` 选项：

```
/dev/block_device	/var/kubernetes_data	defaults,prjquota	0	0
```


<!--
## Extended resources

Extended resources are fully-qualified resource names outside the
`kubernetes.io` domain. They allow cluster operators to advertise and users to
consume the non-Kubernetes-built-in resources.

There are two steps required to use Extended Resources. First, the cluster
operator must advertise an Extended Resource. Second, users must request the
Extended Resource in Pods.
-->

## 拓展资源

拓展资源是 `kubernetes.io` 域名之外的标准资源名称。它们允许集群管理员做分发，而且用户可以使用非Kubernetes内置资源。
使用扩展资源需要两个步骤。 首先，集群管理员必须分发拓展资源。 其次，用户必须在 Pod 中请求拓展资源。

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

<!--
### Managing extended resources

#### Node-level extended resources

Node-level extended resources are tied to nodes.
-->

### 管理拓展资源

#### 节点级拓展资源

节点级拓展资源绑定到节点。

<!--
##### Device plugin managed resources
See [Device
Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
for how to advertise device plugin managed resources on each node.
-->

##### 设备插件托管资源

有关如何在每个节点上分发设备插件托管资源的信息，请参阅[设备插件](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。

<!--
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
-->

##### 其他资源
为了发布新的节点级拓展资源，集群操作员可以向API服务器提交 `PATCH` HTTP 请求，
以在 `status.capacity` 中为集群中的节点指定可用数量。 
完成此操作后，节点的 `status.capacity` 将包含新资源。 
由kubelet异步使用新资源自动更新 `status.allocatable` 字段。 
请注意，由于调度程序在评估Pod适合性时使用节点的状态 `status.allocatable` 值，
因此在用新资源修补节点容量和请求在该节点上调度资源的第一个Pod之间可能会有短暂的延迟。

<!--
**Example:**

Here is an example showing how to use `curl` to form an HTTP request that
advertises five "example.com/foo" resources on node `k8s-node-1` whose master
is `k8s-master`.
-->

**示例:**

这是一个示例，显示了如何使用 `curl` 进行HTTP请求，该请求在主节点为 `k8s-master` 的子节点 `k8s-node-1` 
上通告五个 `example.com/foo` 资源。

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

{{< note >}}

<!--
In the preceding request, `~1` is the encoding for the character `/`
in the patch path. The operation path value in JSON-Patch is interpreted as a
JSON-Pointer. For more details, see
-->

在前面的请求中，`~1` 是 Patch 路径中字符 `/` 的编码。 JSON-Patch中的操作路径值被解释为JSON-Pointer。 
有关更多详细信息，请参见
[IETF RFC 6901, section 3](https://tools.ietf.org/html/rfc6901#section-3).
{{< /note >}}

<!--
#### Cluster-level extended resources

Cluster-level extended resources are not tied to nodes. They are usually managed
by scheduler extenders, which handle the resource consumption and resource quota.

You can specify the extended resources that are handled by scheduler extenders
in [scheduler policy
configuration](https://github.com/kubernetes/kubernetes/blob/release-1.10/pkg/scheduler/api/v1/types.go#L31).
-->

#### 集群级扩展资源

群集级扩展资源不绑定到节点。 它们通常由调度程序扩展程序管理，这些程序处理资源消耗和资源配额。

您可以在[调度程序策略配置](https://github.com/kubernetes/kubernetes/blob/release-1.10/pkg/scheduler/api/v1/types.go#L31)中指定由调度程序扩展程序处理的扩展资源。

<!--
**Example:**

The following configuration for a scheduler policy indicates that the
cluster-level extended resource "example.com/foo" is handled by the scheduler
extender.

- The scheduler sends a Pod to the scheduler extender only if the Pod requests
     "example.com/foo".
- The `ignoredByScheduler` field specifies that the scheduler does not check
     the "example.com/foo" resource in its `PodFitsResources` predicate.
-->

**示例:**

通过调度程序策略的以下配置，指示群集级扩展资源 "example.com/foo" 由调度程序扩展程序处理。

- 仅当Pod请求 "example.com/foo" 时，调度程序才会将 Pod 发送到调度程序扩展程序。
- `ignoredByScheduler` 字段指定调度程序不在其 `PodFitsResources` 字段中检查 "example.com/foo" 资源。

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

<!--
### Consuming extended resources

Users can consume extended resources in Pod specs just like CPU and memory.
The scheduler takes care of the resource accounting so that no more than the
available amount is simultaneously allocated to Pods.

The API server restricts quantities of extended resources to whole numbers.
Examples of _valid_ quantities are `3`, `3000m` and `3Ki`. Examples of
_invalid_ quantities are `0.5` and `1500m`.
-->

### 消耗扩展资源

就像 CPU 和内存一样，用户可以使用 Pod 的扩展资源。 
调度程序负责核算资源，因此不会同时将过多的可用资源分配给 Pod。

{{< note >}}

<!--
Extended resources replace Opaque Integer Resources.
Users can use any domain name prefix other than `kubernetes.io` which is reserved.
-->

扩展资源取代了 Opaque 整数资源。 用户可以使用保留字 `kubernetes.io` 以外的任何域名前缀。

{{< /note >}}

<!--
To consume an extended resource in a Pod, include the resource name as a key
in the `spec.containers[].resources.limits` map in the container spec.
-->

要在Pod中使用扩展资源，请在容器规范的 `spec.containers[].resources.limits` 映射中包含资源名称作为键。

{{< note >}}

<!--
Extended resources cannot be overcommitted, so request and limit
must be equal if both are present in a container spec.
-->

扩展资源不能过量使用，因此如果容器规范中存在请求和限制，则它们必须一致。

{{< /note >}}

<!--
A Pod is scheduled only if all of the resource requests are satisfied, including
CPU, memory and any extended resources. The Pod remains in the `PENDING` state
as long as the resource request cannot be satisfied.

**Example:**

The Pod below requests 2 CPUs and 1 "example.com/foo" (an extended resource).
-->

仅当满足所有资源请求(包括 CPU ，内存和任何扩展资源)时，才能调度 Pod。 只要资源请求无法满足，则 Pod 保持在 `PENDING` 状态。

**示例:**

下面的 Pod 请求2个 CPU 和1个"example.com/foo"(扩展资源)。

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

<!--
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
-->

## 计划改进

在 kubernetes 1.5 版本中仅允许在容器上指定资源量。计划改进对所有容器在 Pod 中共享资源的计量，
如 [emptyDir volume](/docs/concepts/storage/volumes/#emptydir)。

在 kubernetes 1.5 版本中仅支持容器对 CPU 和内存的申请和限制。计划增加新的资源类型，包括节点磁盘空间资源和一个可支持自定义 
[资源类型](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/resources.md) 的框架。

Kubernetes 通过支持通过多级别的 [服务质量](http://issue.k8s.io/168) 来支持资源的过度使用。

在 kubernetes 1.5 版本中，一个 CPU 单位在不同的云提供商和同一云提供商的不同机器类型中的意味都不同。例如，在 AWS 上，节点的容量报告为 [ECU](http://aws.amazon.com/ec2/faqs/)，而在 GCE 中报告为逻辑内核。我们计划修改 cpu 资源的定义，以便在不同的提供商和平台之间保持一致。

{{% /capture %}}


{{% capture whatsnext %}}

<!--
* Get hands-on experience [assigning Memory resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/).

* Get hands-on experience [assigning CPU resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).

* [Container API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)

* [ResourceRequirements](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcerequirements-v1-core)
-->

* 获取将 [分配内存资源给容器和 Pod ](/docs/tasks/configure-pod-container/assign-memory-resource/) 的实践经验

* 获取将 [分配 CPU 资源给容器和 Pod ](/docs/tasks/configure-pod-container/assign-cpu-resource/) 的实践经验

* [容器](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)

* [资源需求](/docs/resources-reference/{{< param "version" >}}/#resourcerequirements-v1-core)

{{% /capture %}}
