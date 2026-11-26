---
title: 调整使用独占 CPU 的 Pod 的 CPU 资源
content_type: task
weight: 35
min-kubernetes-server-version: 1.38
---
<!--
title: Resize CPU Resources of Pods with Exclusive CPUs
content_type: task
weight: 35
min-kubernetes-server-version: 1.38
-->

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScalingExclusiveCPUs" >}}

<!--
This page explains how to change the number of CPUs assigned to a running
container without restarting it, when the container uses CPUs that the kubelet
allocated exclusively for that container.
-->
本页面说明如何在容器使用由 kubelet 独占分配给它的 CPU 时，
在不重启容器的情况下更改分配给运行中容器的 CPU 数量。

<!--
This page covers in-place resize for containers that use exclusive CPUs.
For general in-place resizing of CPU and memory, see
[Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).
-->
本页面介绍使用独占 CPU 的容器的原地调整。
有关一般的 CPU 和内存原地调整，请参阅
[调整分配给容器的 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)。

<!--
The `InPlacePodVerticalScalingExclusiveCPUs` feature gate was introduced in
Kubernetes 1.32. The kubelet implements the behavior described on this page
starting with Kubernetes 1.38.
-->
Kubernetes v1.32 引入了 `InPlacePodVerticalScalingExclusiveCPUs` 特性门控。
从 Kubernetes v1.38 开始，kubelet 才实现本页面描述的行为。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need the following for the exercise on this page:

* The `InPlacePodVerticalScalingExclusiveCPUs` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  enabled for all nodes in your cluster.
* The [static CPU manager policy](/docs/tasks/administer-cluster/cpu-management-policies/)
  configured on your nodes.
* A `kubectl` client at version v1.32 or later, to use the `--subresource=resize` flag.
* At least 3 CPUs on the node that the static CPU manager policy can allocate
  exclusively.
-->
完成本页的练习需要满足以下条件：

* 在集群中的所有节点上启用 `InPlacePodVerticalScalingExclusiveCPUs`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
* 在节点上配置
  [`static` CPU 管理器策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)。
* 使用 v1.32 或更高版本的 `kubectl` 客户端，以便使用 `--subresource=resize` 参数。
* 节点上至少有 3 个可由 `static` CPU 管理器策略独占分配的 CPU。

<!--
## About exclusive CPUs

With the [static CPU manager policy](/docs/tasks/administer-cluster/cpu-management-policies/),
the kubelet assigns CPUs exclusively to containers in
[Guaranteed](/docs/concepts/workloads/pods/pod-qos/) Pods that request an integer
number of CPUs. In a Guaranteed Pod, the CPU request equals the CPU limit. A
container that uses exclusive CPUs runs only on these CPUs and does not share
them with other containers. The kubelet runs all other containers on the remaining CPUs
of the node, which are called the *shared pool*.

The *baseline CPUs* of a container are the exclusive CPUs that the kubelet
assigned to that container when it started. The kubelet keeps the baseline CPUs
assigned to the container across resizes.
-->
## 关于独占 CPU   {#about-exclusive-cpus}

使用 [`static` CPU 管理器策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)时，
kubelet 会将 CPU 独占分配给请求整数个 CPU 的
[Guaranteed](/zh-cn/docs/concepts/workloads/pods/pod-qos/) Pod 中的容器。
在 Guaranteed Pod 中，CPU 请求等于 CPU 限制。使用独占 CPU 的容器仅在这些 CPU
上运行，不与其他容器共享这些 CPU。kubelet 将其他所有容器安排在节点的其余 CPU
上运行，这些 CPU 称为**共享池**。

容器的**基线 CPU** 是 kubelet 在容器启动时分配给它的独占 CPU。
在资源调整过程中，kubelet 会始终将基线 CPU 分配给该容器。

<!--
## How in-place CPU resizing works

You change the CPU request and limit of a container that uses exclusive CPUs by
updating the Pod's `resize` subresource, for example with `kubectl patch`. The
kubelet changes the CPU assignment of the running container. For the default CPU
`resizePolicy` of `NotRequired`, the container does not restart, and
`status.containerStatuses[*].restartCount` does not change.

Depending on the direction of the resize, the kubelet behaves as follows:

* **Scale up:** The kubelet keeps the baseline CPUs and adds CPUs from the
  shared pool. The kubelet selects CPUs that are topologically close to the CPUs
  that the container already uses. If you configure a
  [Topology Manager](/docs/tasks/administer-cluster/topology-manager/) policy
  other than `none`, the new CPUs also match the Pod's NUMA affinity.
* **Scale down:** The kubelet removes the excess CPUs from the container and
  returns them to the shared pool. The container keeps its baseline CPUs.
* **Unchanged CPU count:** If a resize changes only memory, or only another
  container of the Pod, the CPU assignment of this container does not change.

In most cases, when the kubelet cannot fulfill a resize, it rejects the resize
as infeasible and does not retry it. The Pod gets a `PodResizePending` condition
with `reason: Infeasible`, and the kubelet increments the
`pod_infeasible_resizes_total` metric. The following resize requests are
infeasible for a container that uses exclusive CPUs:
-->
## 原地 CPU 调整的工作方式   {#how-in-place-cpu-resizing-works}

要更改使用独占 CPU 的容器的 CPU 请求和限制，可以更新 Pod 的 `resize`
子资源，例如使用 `kubectl patch`。kubelet 会更改运行中容器的 CPU 分配。
对于默认的 CPU `resizePolicy`（`NotRequired`），容器不会重启，
`status.containerStatuses[*].restartCount` 也不会变化。

根据调整方向的不同，kubelet 的行为如下：

* **增加 CPU：** kubelet 保留基线 CPU，并从共享池添加 CPU。
  kubelet 会选择拓扑上与容器已使用 CPU 相近的 CPU。如果配置了非 `none` 的
  [拓扑管理器（Topology Manager）](/zh-cn/docs/tasks/administer-cluster/topology-manager/)策略，
  新 CPU 还会与 Pod 的 NUMA 亲和性匹配。
* **减少 CPU：** kubelet 从容器中移除多余的 CPU，并将其归还给共享池。
  容器保留其基线 CPU。
* **CPU 数量不变：** 如果调整仅更改内存，或仅更改 Pod 中的另一个容器，
  则此容器的 CPU 分配不会变化。

在大多数情况下，当 kubelet 无法满足调整请求时，会将请求视为不可行并拒绝，
且不会重试。Pod 会获得一个 `reason: Infeasible` 的 `PodResizePending` 状况，
kubelet 会递增 `pod_infeasible_resizes_total` 指标。
对于使用独占 CPU 的容器，以下调整请求不可行：

<!--
* Moving a container between the shared pool and exclusive CPUs. An integer CPU
  request can only resize to another integer CPU request. For example, a resize
  from 2 to 3 CPUs is possible, but a resize from 2 to 1500m or from 800m to 2
  is infeasible.
* Resizing a non-restartable init container that uses exclusive CPUs.
* Adding or removing a container that uses exclusive CPUs in a Guaranteed Pod.
* Scaling a container below its baseline CPUs.
* Scaling up a container when the CPU Manager cannot allocate the additional
  CPUs, for example because other containers use the remaining exclusive CPUs.
* Resizing a container when the static policy runs with the `full-pcpus-only`
  option and the requested CPU count does not satisfy the SMT alignment: the
  count is not a multiple of the CPUs per physical core, or the node does not
  have enough free physical CPUs.
-->
* 在共享池和独占 CPU 之间移动容器。整数 CPU 请求只能调整为另一个整数 CPU
  请求。例如，从 2 个 CPU 调整到 3 个 CPU 是可行的，但从 2 调整到 1500m
  或从 800m 调整到 2 则不可行。
* 调整使用独占 CPU 且不可重启的初始化容器。
* 在 Guaranteed Pod 中添加或删除使用独占 CPU 的容器。
* 将容器的 CPU 数量减少到基线 CPU 以下。
* 当 CPU 管理器无法分配额外的 CPU 时增加容器的 CPU，例如其他容器正在使用剩余的独占 CPU。
* 当 `static` 策略使用 `full-pcpus-only` 选项运行，并且请求的 CPU
  数量不满足 SMT 对齐要求时调整容器：请求数量不是每个物理核心的 CPU
  数量的整数倍，或者节点没有足够的空闲物理 CPU。

<!--
In one case the kubelet defers a resize instead of rejecting it: the CPU Manager
can allocate the requested CPUs, but the total CPU requests of the Pods on the
node, including the resized Pod, exceed the allocatable CPU of the node, for
example because of the requests of Pods in the shared pool.
The Pod gets a `PodResizePending` condition with `reason: Deferred`, and the
kubelet retries the resize when other Pods release capacity.

Pods that request fractional CPUs, such as 800m, run in the shared pool. When
the `InPlacePodVerticalScalingExclusiveCPUs` feature gate is enabled, the kubelet
resizes these Pods in-place as usual. For example, a Guaranteed Pod with a CPU
request of 800m can resize to 1500m in-place. This resize path does not use
exclusive CPUs.
-->
在一种情况下，kubelet 会延后调整而不是拒绝它：CPU 管理器可以分配所请求的
CPU，但节点上所有 Pod（包括正在调整的 Pod）的 CPU 请求总量超过节点的可分配
CPU，例如共享池中的 Pod 请求可能导致这种情况。
Pod 会获得一个 `reason: Deferred` 的 `PodResizePending` 状况，
当其他 Pod 释放容量时，kubelet 会重试调整。

请求非整数 CPU（例如 800m）的 Pod 在共享池中运行。
启用 `InPlacePodVerticalScalingExclusiveCPUs` 特性门控后，kubelet
会照常原地调整这些 Pod。例如，CPU 请求为 800m 的 Guaranteed Pod
可以原地调整到 1500m。这种调整路径不使用独占 CPU。

<!--
### Resizing with the Topology Manager

If you configure a
[Topology Manager](/docs/tasks/administer-cluster/topology-manager/) policy
other than `none`, the kubelet considers the NUMA affinity when it allocates the
new CPUs:

* For a scale-up, the kubelet keeps the Pod's current NUMA affinity when that
  affinity can accommodate the new CPU count. When the kubelet must expand the
  affinity, the new NUMA affinity includes all NUMA nodes of the current affinity.
* With the `pod` scope, the kubelet aligns the CPUs of all containers of the Pod
  together. With the `container` scope, the kubelet aligns only the CPUs of the
  resized container.
* With the `pod` scope and the `restricted` or `single-numa-node` policy, a
  single resize request can change the exclusive CPUs of only one container. To
  resize several containers, send one resize request per container.
* When the Topology Manager cannot align a resize, the kubelet rejects the resize
  with a `PodResizePending` condition of `reason: Infeasible` and the message
  `Resources cannot be allocated with Topology locality`. The kubelet does not
  retry such a resize. With the `restricted` or `single-numa-node` policy, this
  can also affect a scale-down. A scale-down only keeps CPUs that the container
  already uses, but the preferred NUMA affinity is the narrowest one that fits
  the new CPU count. If the CPUs that the container keeps do not fit into that
  affinity, the kubelet rejects the scale-down.
-->
### 通过拓扑管理器进行调整   {#resizing-with-the-topology-manager}

如果配置了非 `none` 的
[拓扑管理器（Topology Manager）](/zh-cn/docs/tasks/administer-cluster/topology-manager/)策略，
kubelet 在分配新 CPU 时会考虑 NUMA 亲和性：

* 增加 CPU 时，如果 Pod 当前的 NUMA 亲和性可以容纳新的 CPU 数量，
  kubelet 会保持该亲和性。当 kubelet 必须扩展亲和性时，新的 NUMA
  亲和性会包含当前亲和性中的所有 NUMA 节点。
* 使用 `pod` 作用域时，kubelet 会对齐 Pod 中所有容器的 CPU。
  使用 `container` 作用域时，kubelet 仅对齐被调整容器的 CPU。
* 使用 `pod` 作用域以及 `restricted` 或 `single-numa-node` 策略时，
  单个调整请求只能更改一个容器的独占 CPU。要调整多个容器，请为每个容器分别发送调整请求。
* 当拓扑管理器无法对齐调整请求时，kubelet 会拒绝调整，并为 Pod 添加
  `reason: Infeasible` 的 `PodResizePending` 状况，消息为
  `Resources cannot be allocated with Topology locality`。kubelet 不会重试此类调整。
  使用 `restricted` 或 `single-numa-node` 策略时，这也可能影响减少 CPU 的操作。
  减少 CPU 仅保留容器已经在使用的 CPU，但首选 NUMA 亲和性是适合新 CPU
  数量的最窄范围。如果容器保留的 CPU 不适合该亲和性，kubelet 会拒绝减少 CPU 的请求。

<!--
## Example: resize CPUs of a Pod using exclusive CPUs

### Create a Pod with exclusive CPUs

Create a namespace for this exercise:
-->
## 示例：调整使用独占 CPU 的 Pod 的 CPU   {#example-resize-cpus-of-a-pod-using-exclusive-cpus}

### 创建使用独占 CPU 的 Pod   {#create-a-pod-with-exclusive-cpus}

为此练习创建一个命名空间：

```shell
kubectl create namespace cpu-exclusive-example
```

{{% code_sample file="pods/resource/pod-resize-exclusive-cpus.yaml" %}}

<!--
The container in this Pod has no workload of its own. You verify its CPU
assignment by reading the `Cpus_allowed_list` field from the container's
`/proc` filesystem.

Create the Pod:
-->
此 Pod 中的容器没有自身的工作负载。你可以通过读取容器 `/proc`
文件系统中的 `Cpus_allowed_list` 字段来验证其 CPU 分配。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-resize-exclusive-cpus.yaml \
  -n cpu-exclusive-example
```

<!--
Wait for the Pod to become ready:
-->
等待 Pod 就绪：

```shell
kubectl wait --for=condition=Ready pod/resize-exclusive-cpus-demo -n cpu-exclusive-example
```

<!--
The output is similar to this:
-->
输出类似于：

```
pod/resize-exclusive-cpus-demo condition met
```

<!--
Check the container's CPUs:
-->
检查容器的 CPU：

```shell
kubectl exec resize-exclusive-cpus-demo -n cpu-exclusive-example -- \
  grep Cpus_allowed_list /proc/1/status
```

<!--
The output is similar to this:
-->
输出类似于：

```
Cpus_allowed_list:	1-2
```

<!--
The exact CPUs depend on your node. Verify the CPU assignment in the Pod status:
-->
具体的 CPU 取决于你的节点。在 Pod 状态中验证 CPU 分配：

```shell
kubectl get pod resize-exclusive-cpus-demo -n cpu-exclusive-example --output=yaml
```

<!--
The output shows:

* `spec.containers[0].resources` with a CPU request and limit of 2.
* `status.containerStatuses[0].allocatedResources` with `cpu` set to 2.
* `status.containerStatuses[0].resources` with `cpu` set to 2.
* `status.containerStatuses[0].restartCount` equal to 0.
-->
输出显示：

* `spec.containers[0].resources` 中的 CPU 请求和限制为 2。
* `status.containerStatuses[0].allocatedResources` 中的 `cpu` 为 2。
* `status.containerStatuses[0].resources` 中的 `cpu` 为 2。
* `status.containerStatuses[0].restartCount` 为 0。

<!--
### Scale up by one CPU

Increase the CPU request and limit from 2 to 3:
-->
### 增加一个 CPU   {#scale-up-by-one-cpu}

将 CPU 请求和限制从 2 增加到 3：

```shell
kubectl -n cpu-exclusive-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"app-container","resources":{"requests":{"cpu":"3"},"limits":{"cpu":"3"}}}]}}'
```

<!--
Check the Pod status again:
-->
再次检查 Pod 状态：

```shell
kubectl get pod resize-exclusive-cpus-demo -n cpu-exclusive-example --output=yaml
```

<!--
The output shows:

* `spec.containers[0].resources` with a CPU request and limit of 3.
* `status.containerStatuses[0].allocatedResources` with `cpu` set to 3.
* `status.containerStatuses[0].resources` with `cpu` set to 3.
* `status.containerStatuses[0].restartCount` still 0.
-->
输出显示：

* `spec.containers[0].resources` 中的 CPU 请求和限制为 3。
* `status.containerStatuses[0].allocatedResources` 中的 `cpu` 为 3。
* `status.containerStatuses[0].resources` 中的 `cpu` 为 3。
* `status.containerStatuses[0].restartCount` 仍为 0。

<!--
Check the container's CPUs again:
-->
再次检查容器的 CPU：

```shell
kubectl exec resize-exclusive-cpus-demo -n cpu-exclusive-example -- \
  grep Cpus_allowed_list /proc/1/status
```

<!--
The output is similar to this:
-->
输出类似于：

```
Cpus_allowed_list:	1-3
```

<!--
The container kept its baseline CPUs 1-2 and received the additional CPU 3
from the shared pool.
-->
容器保留了基线 CPU 1-2，并从共享池获得了额外的 CPU 3。

<!--
### Attempt a resize the kubelet cannot fulfill

Decrease the CPU request and limit to 1500m. A container that uses exclusive
CPUs cannot move to the shared pool, so the kubelet rejects this resize:
-->
### 尝试执行 kubelet 无法满足的调整   {#attempt-a-resize-the-kubelet-cannot-fulfill}

将 CPU 请求和限制减少到 1500m。使用独占 CPU 的容器不能移动到共享池，
因此 kubelet 会拒绝此次调整：

```shell
kubectl -n cpu-exclusive-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"app-container","resources":{"requests":{"cpu":"1500m"},"limits":{"cpu":"1500m"}}}]}}'
```

<!--
Check the Pod status:
-->
检查 Pod 状态：

```shell
kubectl get pod resize-exclusive-cpus-demo -n cpu-exclusive-example --output=yaml
```

<!--
The output shows:

* A `PodResizePending` condition with `reason: Infeasible`. The condition's
  `message` contains `cannot move container from exclusive to shared pool,
  (requested CPUs = 1500m)`.
* `spec.containers[0].resources` with `cpu` set to 1500m, the desired state of
  the pending resize request.
* `status.containerStatuses[0].resources` still with `cpu` set to 3.
* `status.containerStatuses[0].restartCount` still 0.
-->
输出显示：

* 一个 `reason: Infeasible` 的 `PodResizePending` 状况。状况的 `message`
  包含 `cannot move container from exclusive to shared pool, (requested CPUs = 1500m)`。
* `spec.containers[0].resources` 中的 `cpu` 为 1500m，这是挂起调整请求的期望状态。
* `status.containerStatuses[0].resources` 中的 `cpu` 仍为 3。
* `status.containerStatuses[0].restartCount` 仍为 0。

<!--
Verify that the container still runs on its previous CPUs:
-->
验证容器仍在之前的 CPU 上运行：

```shell
kubectl exec resize-exclusive-cpus-demo -n cpu-exclusive-example -- \
  grep Cpus_allowed_list /proc/1/status
```

<!--
The output is similar to this:
-->
输出类似于：

```
Cpus_allowed_list:	1-3
```

<!--
The pending resize request stays in the Pod spec until you send another resize
request.
-->
挂起的调整请求会保留在 Pod 规约中，直到你发送另一个调整请求。

<!--
### Scale down to the baseline CPUs

Decrease the CPU request and limit from 3 back to 2:
-->
### 减少到基线 CPU   {#scale-down-to-the-baseline-cpus}

将 CPU 请求和限制从 3 降回 2：

```shell
kubectl -n cpu-exclusive-example patch pod resize-exclusive-cpus-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"app-container","resources":{"requests":{"cpu":"2"},"limits":{"cpu":"2"}}}]}}'
```

<!--
Check the container's CPUs again:
-->
再次检查容器的 CPU：

```shell
kubectl exec resize-exclusive-cpus-demo -n cpu-exclusive-example -- \
  grep Cpus_allowed_list /proc/1/status
```

<!--
The output is similar to this:
-->
输出类似于：

```
Cpus_allowed_list:	1-2
```

<!--
The container keeps its baseline CPUs 1-2. The kubelet returned the extra CPU
to the shared pool, where other Pods can use it.
-->
容器保留了基线 CPU 1-2。kubelet 将额外的 CPU 归还到共享池，供其他 Pod 使用。

<!--
### Clean up

Delete the namespace. This deletes the Pod from this exercise:
-->
### 清理   {#clean-up}

删除命名空间。这将删除本练习中的 Pod：

```shell
kubectl delete namespace cpu-exclusive-example
```

<!--
## Troubleshooting

When the kubelet cannot apply a resize, the Pod gets a `PodResizePending`
condition. The condition `reason` is `Deferred` when the resize can succeed
later, and `Infeasible` when it cannot succeed. The `message` field of the
condition explains the reason. For an infeasible resize, the kubelet also
increments the `pod_infeasible_resizes_total` metric, with a `reason_detail`
label that identifies the reason. For more information about resize status
conditions, see
[Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status).

Common reasons why the kubelet does not apply a CPU resize of a container that
uses exclusive CPUs:
-->
## 故障排查   {#troubleshooting}

当 kubelet 无法应用调整时，Pod 会获得一个 `PodResizePending` 状况。
如果调整稍后可能成功，状况的 `reason` 为 `Deferred`；如果调整不可能成功，
则为 `Infeasible`。状况的 `message` 字段会解释原因。对于不可行的调整，
kubelet 还会递增 `pod_infeasible_resizes_total` 指标，并使用 `reason_detail`
标签标识原因。有关调整状态状况的详细信息，请参阅
[Pod 大小调整状态](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status)。

kubelet 无法对使用独占 CPU 的容器应用 CPU 调整，常见原因如下：

<!--
* **Feature gate disabled:** The kubelet rejects every CPU resize of a
  Guaranteed Pod that the static CPU manager policy manages when you do not
  enable the `InPlacePodVerticalScalingExclusiveCPUs` feature gate. The
  condition message contains `Resize is infeasible for Guaranteed Pods`. Enable
  the feature gate on your nodes.
* **Not enough free CPUs:** Other containers use the exclusive CPUs that the
  resize needs. The condition's `message` contains `Unable to resize container
  exclusively allocated pool` and `not enough cpus available to satisfy
  request`, and the kubelet does not retry the resize. Free CPUs and then send
  the resize request again, or send a resize request for fewer CPUs. With the
  `restricted` or `single-numa-node` Topology Manager policy, the Topology
  Manager rejects the resize before the CPU Manager allocates CPUs, and the
  condition's `message` is `Resources cannot be allocated with Topology
  locality` instead.
* **Not enough allocatable CPU on the node:** The CPU Manager can allocate the
  CPUs, but the total CPU requests of the Pods on the node, including the
  resized Pod, exceed the allocatable CPU of the node.
  The condition `reason` is `Deferred`, and the kubelet retries the resize when
  other Pods release capacity.
* **Shared pool and exclusive CPUs cannot be mixed:** A container that runs on
  shared CPUs cannot grow into exclusive CPUs, and a container that uses
  exclusive CPUs cannot shrink into the shared pool. Recreate the Pod with the
  desired CPU request instead.
-->
* **特性门控未启用：** 如果未启用 `InPlacePodVerticalScalingExclusiveCPUs`
  特性门控，kubelet 会拒绝 `static` CPU 管理器策略所管理的 Guaranteed Pod
  的所有 CPU 调整。状况消息包含 `Resize is infeasible for Guaranteed Pods`。
  请在节点上启用此特性门控。
* **空闲 CPU 不足：** 其他容器正在使用调整所需的独占 CPU。状况的 `message`
  包含 `Unable to resize container exclusively allocated pool` 和
  `not enough cpus available to satisfy request`，且 kubelet 不会重试调整。
  请释放 CPU 后重新发送调整请求，或者发送请求更少 CPU 的调整请求。
  使用 `restricted` 或 `single-numa-node` 拓扑管理器策略时，拓扑管理器会在
  CPU 管理器分配 CPU 之前拒绝调整，此时状况的 `message` 为
  `Resources cannot be allocated with Topology locality`。
* **节点上没有足够的可分配 CPU：** CPU 管理器可以分配 CPU，但节点上所有
  Pod（包括正在调整的 Pod）的 CPU 请求总量超过节点的可分配 CPU。
  状况的 `reason` 为 `Deferred`，当其他 Pod 释放容量时，kubelet 会重试调整。
* **共享池和独占 CPU 不能混用：** 在共享 CPU 上运行的容器不能通过增加
  CPU 转为使用独占 CPU，使用独占 CPU 的容器也不能通过减少 CPU 转入共享池。
  请改用所需的 CPU 请求重新创建 Pod。

<!--
* **Resize below the baseline CPUs:** A container cannot release its baseline
  CPUs. The condition's `message` contains `not allowed to reduce container
  exclusively allocated pool below baseline`.
* **SMT alignment error:** With the `full-pcpus-only` static policy option, the
  condition's `message` contains `SMT Alignment Error` when the requested CPU
  count is not a multiple of the CPUs per physical core, or the node does not
  have enough free physical CPUs. The kubelet does not retry the resize. Send a
  new resize request for a multiple of the CPUs per physical core, or free
  physical CPUs and then send the resize request again.
* **Topology alignment error:** The Topology Manager cannot align the new CPUs with
  the Pod's NUMA affinity. This can also affect a scale-down. The condition's
  `message` is `Resources cannot be allocated with Topology locality`, and the
  kubelet does not retry the resize. Free CPUs that give the topology room to
  align and then send the resize request again, or use a less restrictive
  Topology Manager policy.
* **Several containers in one request:** With the `pod` scope and the
  `restricted` or `single-numa-node` policy, the condition's `message` contains
  `not allowed to resize exclusive CPUs of more than one container in a single
  operation`. Send one resize request per container.
-->
* **调整到基线 CPU 以下：** 容器不能释放其基线 CPU。状况的 `message`
  包含 `not allowed to reduce container exclusively allocated pool below baseline`。
* **SMT 对齐错误：** 使用 `full-pcpus-only` `static` 策略选项时，
  如果请求的 CPU 数量不是每个物理核心的 CPU 数量的整数倍，或者节点没有足够的
  空闲物理 CPU，状况的 `message` 会包含 `SMT Alignment Error`。
  kubelet 不会重试调整。请发送一个新请求，将 CPU 数量设为每个物理核心的
  CPU 数量的整数倍，或者释放物理 CPU 后重新发送调整请求。
* **拓扑对齐错误：** 拓扑管理器无法将新 CPU 与 Pod 的 NUMA 亲和性对齐。
  这也可能影响减少 CPU 的操作。状况的 `message` 为
  `Resources cannot be allocated with Topology locality`，且 kubelet 不会重试调整。
  请释放能够为拓扑对齐提供空间的 CPU 后重新发送调整请求，或者使用限制较少的拓扑管理器策略。
* **一个请求中调整多个容器：** 使用 `pod` 作用域以及 `restricted` 或
  `single-numa-node` 策略时，状况的 `message` 包含
  `not allowed to resize exclusive CPUs of more than one container in a single operation`。
  请为每个容器分别发送调整请求。

## {{% heading "whatsnext" %}}

<!--
* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
* [CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
* [调整分配给容器的 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)
* [控制节点上的 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)
* [配置 Pod 的服务质量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
