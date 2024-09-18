---
title: 动态资源分配
content_type: concept
weight: 65
---
<!--
reviewers:
- klueska
- pohly
title: Dynamic Resource Allocation
content_type: concept
weight: 65
-->

<!-- overview -->

<!--
Core Dynamic Resource Allocation with structured parameters:
-->
使用结构化参数进行核心动态资源分配：

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!--
Dynamic Resource Allocation with control plane controller:
-->
使用控制平面控制器进行动态资源分配：

{{< feature-state feature_gate_name="DRAControlPlaneController" >}}

<!-- 
Dynamic resource allocation is an API for requesting and sharing resources
between pods and containers inside a pod. It is a generalization of the
persistent volumes API for generic resources. Typically those resources
are devices like GPUs.

Third-party resource drivers are
responsible for tracking and preparing resources, with allocation of
resources handled by Kubernetes via _structured parameters_ (introduced in Kubernetes 1.30).
Different kinds of resources support arbitrary parameters for defining requirements and
initialization.

When a driver provides a _control plane controller_, the driver itself
handles allocation in cooperation with the Kubernetes scheduler.
-->
动态资源分配是一个用于在 Pod 之间和 Pod 内部容器之间请求和共享资源的 API。
它是持久卷 API 针对一般资源的泛化。通常这些资源是 GPU 这类设备。

第三方资源驱动程序负责跟踪和准备资源，
Kubernetes 通过**结构化参数**（在 Kubernetes 1.30 中引入）处理资源的分配。
不同类别的资源支持任意参数来定义要求和初始化。

当驱动程序提供**控制平面控制器**时，驱动程序本身与 Kubernetes 调度器合作一起处理资源分配。

## {{% heading "prerequisites" %}}

<!-- 
Kubernetes v{{< skew currentVersion >}} includes cluster-level API support for
dynamic resource allocation, but it [needs to be enabled](#enabling-dynamic-resource-allocation)
explicitly. You also must install a resource driver for specific resources that
are meant to be managed using this API. If you are not running Kubernetes
v{{< skew currentVersion>}}, check the documentation for that version of Kubernetes.
-->
Kubernetes v{{< skew currentVersion >}} 包含用于动态资源分配的集群级 API 支持，
但它需要被[显式启用](#enabling-dynamic-resource-allocation)。
你还必须为此 API 要管理的特定资源安装资源驱动程序。
如果你未运行 Kubernetes v{{< skew currentVersion>}}，
请查看对应版本的 Kubernetes 文档。

<!-- body -->

## API

<!-- 
The `resource.k8s.io/v1alpha3`
{{< glossary_tooltip text="API group" term_id="api-group" >}} provides these types:
-->
`resource.k8s.io/v1alpha3`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}
提供了以下类型：

<!--
ResourceClaim
: Describes a request for access to resources in the cluster,
  for use by workloads. For example, if a workload needs an accelerator device
  with specific properties, this is how that request is expressed. The status
  stanza tracks whether this claim has been satisfied and what specific
  resources have been allocated.
-->
ResourceClaim
: 描述对集群中资源的访问请求，工作负载需要使用这些资源。
  例如，如果工作负载需要具有特定属性的加速器设备，就可以通过这种方式表达该请求。
  状态部分跟踪此请求是否已被满足以及具体已分配了哪些资源。

<!--
ResourceClaimTemplate
: Defines the spec and some metadata for creating
  ResourceClaims. Created by a user when deploying a workload.
  The per-Pod ResourceClaims are then created and removed by Kubernetes
  automatically.
-->
ResourceClaimTemplate
: 定义用于创建 ResourceClaim 的规约和一些元数据。
  部署工作负载时由用户创建。
  每个 Pod 的 ResourceClaim 随后会被 Kubernetes 自动创建和移除。

<!--
DeviceClass
: Contains pre-defined selection criteria for certain devices and
  configuration for them. DeviceClasses are created by a cluster administrator
  when installing a resource driver. Each request to allocate a device
  in a ResourceClaim must reference exactly one DeviceClass.
-->
DeviceClass
: 包含某些设备的预定义选择标准和配置。
  DeviceClass 由集群管理员在安装资源驱动程序时创建。
  对 ResourceClaim 中某个设备的每个分配请求都必须准确引用一个 DeviceClass。

<!--
PodSchedulingContext
: Used internally by the control plane and resource drivers
  to coordinate pod scheduling when ResourceClaims need to be allocated
  for a Pod and those ResourceClaims use a control plane controller.

ResourceSlice
: Used with structured parameters to publish information about resources
  that are available in the cluster.
-->
PodSchedulingContext
: 供控制平面和资源驱动程序内部使用，
  在需要为 Pod 分配 ResourceClaim 且这些 ResourceClaim 使用控制平面控制器时协调 Pod 调度。

ResourceSlice
: 与结构化参数一起使用，以发布有关集群中可用资源的信息。

<!--
The developer of a resource driver decides whether they want to handle
allocation themselves with a control plane controller or instead rely on allocation
through Kubernetes with structured parameters. A
custom controller provides more flexibility, but cluster autoscaling is not
going to work reliably for node-local resources. Structured parameters enable
cluster autoscaling, but might not satisfy all use-cases.
-->
资源驱动程序的开发者决定他们是要使用控制平面控制器自己处理资源分配，
还是依赖 Kubernetes 使用结构化参数来处理资源分配。
自定义控制器提供更多的灵活性，但对于节点本地资源，集群自动扩缩可能无法可靠工作。
结构化参数使集群自动扩缩成为可能，但可能无法满足所有使用场景。

<!--
When a driver uses structured parameters, all parameters that select devices
are defined in the ResourceClaim and DeviceClass with in-tree types. Configuration
parameters can be embedded there as arbitrary JSON objects.
-->
当驱动程序使用结构化参数时，所有选择设备的参数都在
ResourceClaim 和 DeviceClass 中以树内类型被定义。
配置参数可以作为任意 JSON 对象嵌入其中。

<!-- 
The `core/v1` `PodSpec` defines ResourceClaims that are needed for a Pod in a
`resourceClaims` field. Entries in that list reference either a ResourceClaim
or a ResourceClaimTemplate. When referencing a ResourceClaim, all Pods using
this PodSpec (for example, inside a Deployment or StatefulSet) share the same
ResourceClaim instance. When referencing a ResourceClaimTemplate, each Pod gets
its own instance.
-->
`core/v1` 的 `PodSpec` 在 `resourceClaims` 字段中定义 Pod 所需的 ResourceClaim。
该列表中的条目引用 ResourceClaim 或 ResourceClaimTemplate。
当引用 ResourceClaim 时，使用此 PodSpec 的所有 Pod
（例如 Deployment 或 StatefulSet 中的 Pod）共享相同的 ResourceClaim 实例。
引用 ResourceClaimTemplate 时，每个 Pod 都有自己的实例。

<!-- 
The `resources.claims` list for container resources defines whether a container gets
access to these resource instances, which makes it possible to share resources
between one or more containers.

Here is an example for a fictional resource driver. Two ResourceClaim objects
will get created for this Pod and each container gets access to one of them.
-->
容器资源的 `resources.claims` 列表定义容器可以访问的资源实例，
从而可以实现在一个或多个容器之间共享资源。

下面是一个虚构的资源驱动程序的示例。
该示例将为此 Pod 创建两个 ResourceClaim 对象，每个容器都可以访问其中一个。

```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: DeviceClass
name: resource.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == "resource-driver.example.com"
---
apiVersion: resource.k8s.io/v1alpha2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        deviceClassName: resource.example.com
        selectors:
        - cel:
           expression: |-
              device.attributes["resource-driver.example.com"].color == "black" &&
              device.attributes["resource-driver.example.com"].size == "large"
–--
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  containers:
  - name: container0
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: container1
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  resourceClaims:
  - name: cat-0
    resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    resourceClaimTemplateName: large-black-cat-claim-template
```

<!-- 
## Scheduling
-->
## 调度  {#scheduling}

<!--
### With control plane controller
-->
### 使用控制平面控制器  {#with-control-plane-controller}

<!-- 
In contrast to native resources (CPU, RAM) and extended resources (managed by a
device plugin, advertised by kubelet), without structured parameters
the scheduler has no knowledge of what
dynamic resources are available in a cluster or how they could be split up to
satisfy the requirements of a specific ResourceClaim. Resource drivers are
responsible for that. They mark ResourceClaims as "allocated" once resources
for it are reserved. This also then tells the scheduler where in the cluster a
ResourceClaim is available.
-->
与原生资源（CPU、RAM）和扩展资源（由设备插件管理，并由 kubelet 公布）不同，
如果没有结构化参数，调度器无法知道集群中有哪些动态资源，
也不知道如何将它们拆分以满足特定 ResourceClaim 的要求。
资源驱动程序负责这些任务。
资源驱动程序在为 ResourceClaim 保留资源后将其标记为“已分配（Allocated）”。
然后告诉调度器集群中可用的 ResourceClaim 的位置。

<!-- 
When a pod gets scheduled, the scheduler checks all ResourceClaims needed by a Pod and
creates a PodScheduling object where it informs the resource drivers
responsible for those ResourceClaims about nodes that the scheduler considers
suitable for the Pod. The resource drivers respond by excluding nodes that
don't have enough of the driver's resources left. Once the scheduler has that
information, it selects one node and stores that choice in the PodScheduling
object. The resource drivers then allocate their ResourceClaims so that the
resources will be available on that node. Once that is complete, the Pod
gets scheduled.
-->
当 Pod 被调度时，调度器检查 Pod 所需的所有 ResourceClaim，并创建一个 PodScheduling 对象，
通知负责这些 ResourceClaim 的资源驱动程序，告知它们调度器认为适合该 Pod 的节点。
资源驱动程序通过排除没有足够剩余资源的节点来响应调度器。
一旦调度器有了这些信息，它就会选择一个节点，并将该选择存储在 PodScheduling 对象中。
然后，资源驱动程序为分配其 ResourceClaim，以便资源可用于该节点。
完成后，Pod 就会被调度。

<!-- 
As part of this process, ResourceClaims also get reserved for the
Pod. Currently ResourceClaims can either be used exclusively by a single Pod or
an unlimited number of Pods.
-->
作为此过程的一部分，ResourceClaim 会为 Pod 保留。
目前，ResourceClaim 可以由单个 Pod 独占使用或不限数量的多个 Pod 使用。

<!-- 
One key feature is that Pods do not get scheduled to a node unless all of
their resources are allocated and reserved. This avoids the scenario where a Pod
gets scheduled onto one node and then cannot run there, which is bad because
such a pending Pod also blocks all other resources like RAM or CPU that were
set aside for it.
-->
除非 Pod 的所有资源都已分配和保留，否则 Pod 不会被调度到节点，这是一个重要特性。
这避免了 Pod 被调度到一个节点但无法在那里运行的情况，
这种情况很糟糕，因为被挂起 Pod 也会阻塞为其保留的其他资源，如 RAM 或 CPU。

{{< note >}}
<!--
Scheduling of pods which use ResourceClaims is going to be slower because of
the additional communication that is required. Beware that this may also impact
pods that don't use ResourceClaims because only one pod at a time gets
scheduled, blocking API calls are made while handling a pod with
ResourceClaims, and thus scheduling the next pod gets delayed.
-->
由于需要额外的通信，使用 ResourceClaim 的 Pod 的调度将会变慢。
请注意，这也可能会影响不使用 ResourceClaim 的 Pod，因为一次仅调度一个
Pod，在使用 ResourceClaim 处理 Pod 时会进行阻塞 API 调用，
从而推迟调度下一个 Pod。
{{< /note >}}

<!--
### With structured parameters
-->
### 使用结构化参数 {#with-structured-parameters}

<!-- 
When a driver uses structured parameters, the scheduler takes over the
responsibility of allocating resources to a ResourceClaim whenever a pod needs
them. It does so by retrieving the full list of available resources from
ResourceSlice objects, tracking which of those resources have already been
allocated to existing ResourceClaims, and then selecting from those resources
that remain.
-->
当驱动程序使用结构化参数时，调度器负责在 Pod 需要资源时为 ResourceClaim 分配资源。
通过从 ResourceSlice 对象中检索可用资源的完整列表，
跟踪已分配给现有 ResourceClaim 的资源，然后从剩余的资源中进行选择。

<!--
The only kind of supported resources at the moment are devices. A device
instance has a name and several attributes and capacities. Devices get selected
through CEL expressions which check those attributes and capacities. In
addition, the set of selected devices also can be restricted to sets which meet
certain constraints.
-->
目前唯一支持的资源类别是设备。
设备实例具有名称以及多个属性和容量信息。
设备通过 CEL 表达式被选择，这些表达式检查设备的属性和容量。
此外，所选择的设备集合还可以限制为满足特定约束的集合。

<!--
The chosen resource is recorded in the ResourceClaim status together with any
vendor-specific configuration, so when a pod is about to start on a node, the
resource driver on the node has all the information it needs to prepare the
resource.
-->
所选资源与所有供应商特定配置一起被记录在 ResourceClaim 状态中，
因此当 Pod 即将在节点上启动时，节点上的资源驱动程序具有准备资源所需的所有信息。

<!--
By using structured parameters, the scheduler is able to reach a decision
without communicating with any DRA resource drivers. It is also able to
schedule multiple pods quickly by keeping information about ResourceClaim
allocations in memory and writing this information to the ResourceClaim objects
in the background while concurrently binding the pod to a node.
-->
通过使用结构化参数，调度器能够在不与 DRA 资源驱动程序通信的情况下做出决策。
它还能够通过将 ResourceClaim 分配信息保存在内存中，并在同时将 Pod 绑定到节点的同时将此信息写入
ResourceClaim 对象中，快速调度多个 Pod。

<!-- 
## Monitoring resources
-->
## 监控资源  {#monitoring-resources}

<!-- 
The kubelet provides a gRPC service to enable discovery of dynamic resources of
running Pods. For more information on the gRPC endpoints, see the
[resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
-->
kubelet 提供了一个 gRPC 服务，以便发现正在运行的 Pod 的动态资源。
有关 gRPC 端点的更多信息，请参阅[资源分配报告](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。

<!--
## Pre-scheduled Pods

When you - or another API client - create a Pod with `spec.nodeName` already set, the scheduler gets bypassed.
If some ResourceClaim needed by that Pod does not exist yet, is not allocated
or not reserved for the Pod, then the kubelet will fail to run the Pod and
re-check periodically because those requirements might still get fulfilled
later.
-->
## 预调度的 Pod   {#pre-scheduled-pods}

当你（或别的 API 客户端）创建设置了 `spec.nodeName` 的 Pod 时，调度器将被绕过。
如果 Pod 所需的某个 ResourceClaim 尚不存在、未被分配或未为该 Pod 保留，那么 kubelet
将无法运行该 Pod，并会定期重新检查，因为这些要求可能在以后得到满足。

<!--
Such a situation can also arise when support for dynamic resource allocation
was not enabled in the scheduler at the time when the Pod got scheduled
(version skew, configuration, feature gate, etc.). kube-controller-manager
detects this and tries to make the Pod runnable by triggering allocation and/or
reserving the required ResourceClaims.
-->
这种情况也可能发生在 Pod 被调度时调度器中未启用动态资源分配支持的时候（原因可能是版本偏差、配置、特性门控等）。
kube-controller-manager 能够检测到这一点，并尝试通过触发分配和/或预留所需的 ResourceClaim 来使 Pod 可运行。

{{< note >}}
<!--
This only works with resource drivers that don't use structured parameters.
-->
这仅适用于不使用结构化参数的资源驱动程序。
{{< /note >}}

<!--
It is better to avoid bypassing the scheduler because a Pod that is assigned to a node
blocks normal resources (RAM, CPU) that then cannot be used for other Pods
while the Pod is stuck. To make a Pod run on a specific node while still going
through the normal scheduling flow, create the Pod with a node selector that
exactly matches the desired node:
-->
绕过调度器并不是一个好的选择，因为分配给节点的 Pod 会锁住一些正常的资源（RAM、CPU），
而这些资源在 Pod 被卡住时无法用于其他 Pod。为了让一个 Pod 在特定节点上运行，
同时仍然通过正常的调度流程进行，请在创建 Pod 时使用与期望的节点精确匹配的节点选择算符：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: name-of-the-intended-node
  ...
```

<!--
You may also be able to mutate the incoming Pod, at admission time, to unset
the `.spec.nodeName` field and to use a node selector instead.
-->
你还可以在准入时变更传入的 Pod，取消设置 `.spec.nodeName` 字段，并改为使用节点选择算符。

<!-- 
## Enabling dynamic resource allocation
-->
## 启用动态资源分配 {#enabling-dynamic-resource-allocation}

<!-- 
Dynamic resource allocation is an *alpha feature* and only enabled when the
`DynamicResourceAllocation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
and the `resource.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled. For details on that, see the `--feature-gates` and `--runtime-config`
[kube-apiserver parameters](/docs/reference/command-line-tools-reference/kube-apiserver/).
kube-scheduler, kube-controller-manager and kubelet also need the feature gate.
-->
动态资源分配是一个 **Alpha 特性**，只有在启用 `DynamicResourceAllocation`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
和 `resource.k8s.io/v1alpha3`
{{< glossary_tooltip text="API 组" term_id="api-group" >}} 时才启用。
有关详细信息，参阅 `--feature-gates` 和 `--runtime-config`
[kube-apiserver 参数](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。
kube-scheduler、kube-controller-manager 和 kubelet 也需要设置该特性门控。

<!--
When a resource driver uses a control plane controller, then the
`DRAControlPlaneController` feature gate has to be enabled in addition to
`DynamicResourceAllocation`.
-->
当资源驱动程序使用控制平面控制器时，除了需要启用 `DynamicResourceAllocation` 外，
还必须启用 `DRAControlPlaneController` 特性门控。

<!-- 
A quick check whether a Kubernetes cluster supports the feature is to list
DeviceClass objects with:
-->
快速检查 Kubernetes 集群是否支持该特性的方法是列举 DeviceClass 对象：

```shell
kubectl get deviceclasses
```

<!-- 
If your cluster supports dynamic resource allocation, the response is either a
list of DeviceClass objects or:
-->
如果你的集群支持动态资源分配，则响应是 DeviceClass 对象列表或：

```
No resources found
```

<!-- 
If not supported, this error is printed instead:
-->
如果不支持，则会输出如下错误：

```
error: the server doesn't have a resource type "deviceclasses"
```

<!--
A control plane controller is supported when it is possible to create a
ResourceClaim where the `spec.controller` field is set. When the
`DRAControlPlaneController` feature is disabled, that field automatically
gets cleared when storing the ResourceClaim.
-->
当可以创建设置了 `spec.controller` 字段的 ResourceClaim 时，控制平面控制器是受支持的。
当 `DRAControlPlaneController` 特性被禁用时，存储 ResourceClaim 时该字段会自动被清除。

<!-- 
The default configuration of kube-scheduler enables the "DynamicResources"
plugin if and only if the feature gate is enabled and when using
the v1 configuration API. Custom configurations may have to be modified to
include it.
-->
kube-scheduler 的默认配置仅在启用特性门控且使用 v1 配置 API 时才启用 "DynamicResources" 插件。
自定义配置可能需要被修改才能启用它。

<!-- 
In addition to enabling the feature in the cluster, a resource driver also has to
be installed. Please refer to the driver's documentation for details.
-->
除了在集群中启用该功能外，还必须安装资源驱动程序。
欲了解详细信息，请参阅驱动程序的文档。

## {{% heading "whatsnext" %}}

<!-- 
- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  and the
  [Dynamic Resource Allocation with Control Plane Controller](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md) KEPs.
-->
- 了解更多该设计的信息，
  参阅[使用结构化参数的动态资源分配 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  和[使用控制平面控制器的动态资源分配 KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)。
