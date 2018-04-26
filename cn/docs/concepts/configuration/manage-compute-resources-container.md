---
title: Managing Compute Resources for Containers
cn-approvers:
- rootsongjc
cn-reviewers:
- shirdrn
---

{% capture overview %}

<!--

When you specify a [Pod](/docs/user-guide/pods), you can optionally specify how
much CPU and memory (RAM) each Container needs. When Containers have resource
requests specified, the scheduler can make better decisions about which nodes to
place Pods on. And when Containers have their limits specified, contention for
resources on a node can be handled in a specified manner. For more details about
the difference between requests and limits, see
[Resource QoS](https://git.k8s.io/community/contributors/design-proposals/resource-qos.md).

-->

当您定义 [Pod](/docs/user-guide/pods) 的时候可以选择为每个容器指定需要的 CPU 和内存（RAM）大小。当为容器指定了资源请求后，调度器就能够更好的判断出将容器调度到哪个节点上。如果您还为容器指定了资源限制，节点上的资源就可以按照指定的方式做竞争。关于资源请求和限制的不同点和更多资料请参考 [Resource QoS](https://git.k8s.io/community/contributors/design-proposals/resource-qos.md)。

{% endcapture %}


{% capture body %}

<!--

## Resource types

*CPU* and *memory* are each a *resource type*. A resource type has a base unit.
CPU is specified in units of cores, and memory is specified in units of bytes.

CPU and memory are collectively referred to as *compute resources*, or just
*resources*. Compute
resources are measurable quantities that can be requested, allocated, and
consumed. They are distinct from
[API resources](/docs/api/). API resources, such as Pods and
[Services](/docs/user-guide/services) are objects that can be read and modified
through the Kubernetes API server.

-->

## 资源类型

*CPU* 和 *内存* 都是 *资源类型*。资源类型具有基本单位。CPU 的单位是 core，内存的单位是 byte。

CPU和内存统称为*计算资源*，也可以称为*资源*。计算资源的数量是可以被请求、分配和消耗的可测量的。它们与 [API 资源](/docs/api/) 不同。 API 资源（如 Pod 和 [Service](/docs/user-guide/services)）是可通过 Kubernetes API server 读取和修改的对象。

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
and 64MiB (2<sup>26</sup> bytes) of memory Each Container has a limit of 0.5
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

- The `spec.containers[].resources.requests.cpu` is converted to its core value,
  which is potentially fractional, and multiplied by 1024. The greater of this number
  or 2 is used as the value of the
  [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#/cpu-share-constraint)
  flag in the `docker run` command.

- The `spec.containers[].resources.limits.cpu` is converted to its millicore value,
  multiplied by 100000, and then divided by 1000. This number is used as the value
  of the [`--cpu-quota`](https://docs.docker.com/engine/reference/run/#/cpu-quota-constraint)
  flag in the `docker run` command.  The [`--cpu-period`] flag is set to 100000,
   which represents the default 100ms period for measuring quota usage. The
   kubelet enforces cpu limits if it is started with the
  [`--cpu-cfs-quota`] flag set to true. As of Kubernetes version 1.2, this flag
  defaults to true.

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

-->

## 具有资源限制的 Pod 如何运行

当 kubelet 启动一个 Pod 的容器时，它会将 CPU 和内存限制传递到容器运行时。

当使用 Docker 时：

- `spec.containers[].resources.requests.cpu` 的值将转换成 millicore 值，这是个浮点数，并乘以1024，这个数字中的较大者或2用作 `docker run` 命令中的[ `--cpu-shares`](https://docs.docker.com/engine/reference/run/#/cpu-share-constraint) 标志的值。
- `spec.containers[].resources.limits.cpu` 被转换成 millicore 值。被乘以 100000 然后 除以 1000。这个数字用作 `docker run` 命令中的 [`--cpu-quota`](https://docs.docker.com/engine/reference/run/#/cpu-quota-constraint) 标志的值。[`--cpu-quota` ] 标志被设置成了 100000，表示测量配额使用的默认100ms 周期。如果 [`--cpu-cfs-quota`] 标志设置为 true，则 kubelet 会强制执行 cpu 限制。从 Kubernetes 1.2 版本起，此标志默认为 true。
- `spec.containers[].resources.limits.memory` 被转换为整型，作为 `docker run` 命令中的 [`--memory`](https://docs.docker.com/engine/reference/run/#/user-memory-constraints) 标志的值。

如果容器超过其内存限制，则可能会被终止。如果可重新启动，则与所有其他类型的运行时故障一样，kubelet 将重新启动它。

如果一个容器超过其内存请求，那么当节点内存不足时，它的 Pod 可能被逐出。

容器可能被允许也可能不被允许超过其 CPU 限制时间。但是，由于 CPU 使用率过高，不会被杀死。

要确定容器是否由于资源限制而无法安排或被杀死，请参阅 [疑难解答](#troubleshooting) 部分。

<!--

## Monitoring compute resource usage

The resource usage of a Pod is reported as part of the Pod status.

If [optional monitoring](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/cluster-monitoring/README.md)
is configured for your cluster, then Pod resource usage can be retrieved from
the monitoring system.

-->

## 监控计算资源使用

Pod 的资源使用情况被报告为 Pod 状态的一部分。

如果为集群配置了 [可选监控](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/cluster-monitoring/README.md)，则可以从监控系统检索 Pod 资源的使用情况。

<!--

## Troubleshooting

### My Pods are pending with event message failedScheduling

If the scheduler cannot find any node where a Pod can fit, the Pod remains
unscheduled until a place can be found. An event is produced each time the
scheduler fails to find a place for the Pod, like this:

## 疑难解答

### 我的 Pod 处于 pending 状态且事件信息显示 failedScheduling

如果调度器找不到任何该 Pod 可以匹配的节点，则该 Pod 将保持不可调度状态，直到找到一个可以被调度到的位置。每当调度器找不到 Pod 可以调度的地方时，会产生一个事件，如下所示：

-->

```shell
$ kubectl describe pod frontend | grep -A 3 Events
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

```shell
$ kubectl describe nodes e2e-test-minion-group-4lw4
Name:            e2e-test-minion-group-4lw4
[ ... lines removed for clarity ...]
Capacity:
 alpha.kubernetes.io/nvidia-gpu:    0
 cpu:                               2
 memory:                            7679792Ki
 pods:                              110
Allocatable:
 alpha.kubernetes.io/nvidia-gpu:    0
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
[NodeStatus](/docs/resources-reference/{{page.version}}/#nodestatus-v1-core)
gives the amount of resources that are available to Pods. For more information, see
[Node Allocatable Resources](https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md).

The [resource quota](/docs/concepts/policy/resource-quotas/) feature can be configured
to limit the total amount of resources that can be consumed. If used in conjunction
with namespaces, it can prevent one team from hogging all the resources.

-->

在上面的输出中，您可以看到如果 Pod 请求超过 1120m CPU 或者 6.23Gi 内存，节点将无法满足。

通过查看 `Pods` 部分，您将看到哪些 Pod 占用的节点上的资源。

Pod 可用的资源量小于节点容量，因为系统守护程序使用一部分可用资源。 [NodeStatus](/docs/resources-reference/{{page.version}}/#nodestatus-v1-core)  的 `allocatable` 字段给出了可用于 Pod 的资源量。有关更多信息，请参阅 [节点可分配资源](https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md)。

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
[12:54:41] $ kubectl describe pod simmemleak-hra99
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
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   pulled      Pod container image "gcr.io/google_containers/pause:0.8.0" already present on machine
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

```shell{% raw %}
[13:59:01] $ kubectl get pod -o go-template='{{range.status.containerStatuses}}{{"Container Name: "}}{{.name}}{{"\r\nLastState: "}}{{.lastState}}{{end}}'  simmemleak-60xbc
Container Name: simmemleak
LastState: map[terminated:map[exitCode:137 reason:OOM Killed startedAt:2015-07-07T20:58:43Z finishedAt:2015-07-07T20:58:43Z containerID:docker://0e4095bba1feccdfe7ef9fb6ebffe972b4b14285d5acdec6f0d3ae8a22fad8b2]]{% endraw %}
```

<!--

You can see that the Container was terminated because of `reason:OOM Killed`,
where `OOM` stands for Out Of Memory.

-->

您可以看到容器因为 `reason:OOM killed` 被终止，`OOM` 表示 Out Of Memory。

<!--

## Opaque integer resources (Alpha feature)

Kubernetes version 1.5 introduces Opaque integer resources. Opaque
integer resources allow cluster operators to advertise new node-level
resources that would be otherwise unknown to the system.

Users can consume these resources in Pod specs just like CPU and memory.
The scheduler takes care of the resource accounting so that no more than the
available amount is simultaneously allocated to Pods.

**Note:** Opaque integer resources are Alpha in Kubernetes version 1.5.
Only resource accounting is implemented; node-level isolation is still
under active development.

Opaque integer resources are resources that begin with the prefix
`pod.alpha.kubernetes.io/opaque-int-resource-`. The API server
restricts quantities of these resources to whole numbers. Examples of
_valid_ quantities are `3`, `3000m` and `3Ki`. Examples of _invalid_
quantities are `0.5` and `1500m`.

There are two steps required to use opaque integer resources. First, the
cluster operator must advertise a per-node opaque resource on one or more
nodes. Second, users must request the opaque resource in Pods.

To advertise a new opaque integer resource, the cluster operator should
submit a `PATCH` HTTP request to the API server to specify the available
quantity in the `status.capacity` for a node in the cluster. After this
operation, the node's `status.capacity` will include a new resource. The
`status.allocatable` field is updated automatically with the new resource
asynchronously by the kubelet. Note that because the scheduler uses the
node `status.allocatable` value when evaluating Pod fitness, there may
be a short delay between patching the node capacity with a new resource and the
first pod that requests the resource to be scheduled on that node.

**Example:**

Here is an HTTP request that advertises five "foo" resources on node `k8s-node-1` whose master is `k8s-master`.

-->

## 不透明整型资源（Alpha功能）

Kubernetes 1.5 版本中引入不透明整型资源。不透明的整数资源允许集群运维人员发布新的节点级资源，否则系统将不了解这些资源。

用户可以在 Pod 的 spec 中消费这些资源，就像 CPU 和内存一样。调度器负责资源计量，以便在不超过可用量的同时分配给 Pod。

**注意：** 不透明整型资源在 kubernetes 1.5 中还是 Alpha 版本。只实现了资源计量，节点级别的隔离还处于积极的开发阶段。

不透明整型资源是以 `pod.alpha.kubernetes.io/opaque-int-resource-` 为前缀的资源。API server 将限制这些资源的数量为整数。*有效* 数量的例子有 `3`、`3000m` 和 `3Ki`。*无效*数量的例子有 `0.5` 和 `1500m`。

申请使用不透明整型资源需要两步。首先，集群运维人员必须在一个或多个节点上通告每个节点不透明的资源。然后，用户必须在 Pod 中请求不透明资源。

要发布新的不透明整型资源，集群运维人员应向 API server 提交 `PATCH` HTTP请求，以指定集群中节点的`status.capacity` 的可用数量。在此操作之后，节点的 `status.capacity` 将包括一个新的资源。 `status.allocatable` 字段由 kubelet 异步地使用新资源自动更新。请注意，由于调度器在评估 Pod 适应度时使用节点 `status.allocatable` 值，所以在使用新资源修补节点容量和请求在该节点上调度资源的第一个 pod 之间可能会有短暂的延迟。

**示例**

这是一个 HTTP 请求，master 节点是 k8s-master，在 k8s-node-1 节点上通告 5 个 “foo” 资源。

```http
PATCH /api/v1/nodes/k8s-node-1/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "add",
    "path": "/status/capacity/pod.alpha.kubernetes.io~1opaque-int-resource-foo",
    "value": "5"
  }
]
```

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/pod.alpha.kubernetes.io~1opaque-int-resource-foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

<!--

**Note**: In the preceding request, `~1` is the encoding for the character `/`
in the patch path. The operation path value in JSON-Patch is interpreted as a
JSON-Pointer. For more details, see
[IETF RFC 6901, section 3](https://tools.ietf.org/html/rfc6901#section-3).

To consume an opaque resource in a Pod, include the name of the opaque
resource as a key in the `spec.containers[].resources.requests` map.

The Pod is scheduled only if all of the resource requests are
satisfied, including cpu, memory and any opaque resources. The Pod will
remain in the `PENDING` state as long as the resource request cannot be met by
any node.

**Example:**

The Pod below requests 2 cpus and 1 "foo" (an opaque resource.)

-->

**注意：** 在前面的请求中，`~1` 是 patch 路径中 `/` 字符的编码。JSON-Patch 中的操作路径值被解释为 JSON-Pointer。更多详细信息请参阅 [IETF RFC 6901, section 3](https://tools.ietf.org/html/rfc6901#section-3)。

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
        pod.alpha.kubernetes.io/opaque-int-resource-foo: 1
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
[resource types](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/resources.md).

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

在 kubernetes 1.5 版本中仅允许在容器上指定资源量。计划改进对所有容器在 Pod 中共享资源的计量，如 [emptyDir volume](/docs/concepts/storage/volumes/#emptydir)。

在 kubernetes 1.5 版本中仅支持容器对 CPU 和内存的申请和限制。计划增加新的资源类型，包括节点磁盘空间资源和一个可支持自定义 [资源类型](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/resources.md) 的框架。

Kubernetes 通过支持通过多级别的 [服务质量](http://issue.k8s.io/168) 来支持资源的过度使用。

在 kubernetes 1.5 版本中，一个 CPU 单位在不同的云提供商和同一云提供商的不同机器类型中的意味都不同。例如，在 AWS 上，节点的容量报告为 [ECU](http://aws.amazon.com/ec2/faqs/)，而在 GCE 中报告为逻辑内核。我们计划修改 cpu 资源的定义，以便在不同的提供商和平台之间保持一致。

{% endcapture %}

{% capture whatsnext %}

<!--

* Get hands-on experience
  [assigning CPU and RAM resources to a container](/docs/tasks/configure-pod-container/assign-cpu-ram-container/).
* [Container](/docs/api-reference/{{page.version}}/#container-v1-core)
* [ResourceRequirements](/docs/resources-reference/{{page.version}}/#resourcerequirements-v1-core)

-->

- 获取将 [CPU 和内存资源分配给容器](/docs/tasks/configure-pod-container/assign-cpu-ram-container/) 的实践经验
- [容器](/docs/api-reference/{{page.version}}/#container-v1-core)
- [ResourceRequirements](/docs/resources-reference/{{page.version}}/#resourcerequirements-v1-core)

{% endcapture %}

{% include templates/concept.md %}

