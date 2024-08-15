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

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- 
Dynamic resource allocation is an API for requesting and sharing resources
between pods and containers inside a pod. It is a generalization of the
persistent volumes API for generic resources. Third-party resource drivers are
responsible for tracking and allocating resources, with additional support
provided by Kubernetes via _structured parameters_ (introduced in Kubernetes 1.30).
When a driver uses structured parameters, Kubernetes handles scheduling
and resource allocation without having to communicate with the driver.
Different kinds of resources support arbitrary parameters for defining requirements and
initialization.
-->
动态资源分配是一个用于在 Pod 之间和 Pod 内部容器之间请求和共享资源的 API。
它是持久卷 API 的通用资源化。第三方资源驱动程序负责跟踪和分配资源，
Kubernetes 通过**结构化参数**（在 Kubernetes 1.30 中引入）提供了额外的支持。
当驱动程序使用结构化参数时，Kubernetes 可以处理调度和资源分配，而无需与驱动程序通信。
而不同类型的资源，可支持用于“定义需求”和“初始化”的任意参数。

## {{% heading "prerequisites" %}}

<!-- 
Kubernetes v{{< skew currentVersion >}} includes cluster-level API support for
dynamic resource allocation, but it [needs to be
enabled](#enabling-dynamic-resource-allocation) explicitly.  You also must
install a resource driver for specific resources that are meant to be managed
using this API.  If you are not running Kubernetes v{{< skew currentVersion>}},
check the documentation for that version of Kubernetes.
-->
Kubernetes v{{< skew currentVersion >}} 包含用于动态资源分配的集群级 API 支持，
但它需要被[显式启用](#enabling-dynamic-resource-allocation)。
你还必须为此 API 要管理的特定资源安装资源驱动程序。
如果你未运行 Kubernetes v{{< skew currentVersion>}}，
请查看对应版本的 Kubernetes 文档。

<!-- body -->

## API

<!-- 
The `resource.k8s.io/v1alpha2` {{< glossary_tooltip text="API group"
term_id="api-group" >}} provides these types:
-->
`resource.k8s.io/v1alpha2`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}
提供了以下类型：

<!-- 
ResourceClass
: Defines which resource driver handles a certain kind of
  resource and provides common parameters for it. ResourceClasses
  are created by a cluster administrator when installing a resource
  driver.

ResourceClaim
: Defines a particular resource instance that is required by a
  workload. Created by a user (lifecycle managed manually, can be shared
  between different Pods) or for individual Pods by the control plane based on
  a ResourceClaimTemplate (automatic lifecycle, typically used by just one
  Pod).

ResourceClaimTemplate
: Defines the spec and some metadata for creating
  ResourceClaims. Created by a user when deploying a workload.

PodSchedulingContext
: Used internally by the control plane and resource drivers
  to coordinate pod scheduling when ResourceClaims need to be allocated
  for a Pod.
-->
ResourceClass
: 定义由哪个资源驱动程序处理某种资源，并为其提供通用参数。
  集群管理员在安装资源驱动程序时创建 ResourceClass。

ResourceClaim
: 定义工作负载所需的特定资源实例。
  由用户创建（手动管理生命周期，可以在不同的 Pod 之间共享），
  或者由控制平面基于 ResourceClaimTemplate 为特定 Pod 创建
  （自动管理生命周期，通常仅由一个 Pod 使用）。

ResourceClaimTemplate
: 定义用于创建 ResourceClaim 的 spec 和一些元数据。
  部署工作负载时由用户创建。

PodSchedulingContext
: 供控制平面和资源驱动程序内部使用，
  在需要为 Pod 分配 ResourceClaim 时协调 Pod 调度。
<!--
ResourceSlice
: Used with structured parameters to publish information about resources
  that are available in the cluster.

ResourceClaimParameters
: Contain the parameters for a ResourceClaim which influence scheduling,
  in a format that is understood by Kubernetes (the "structured parameter
  model"). Additional parameters may be embedded in an opaque
  extension, for use by the vendor driver when setting up the underlying
  resource.

ResourceClassParameters
: Similar to ResourceClaimParameters, the ResourceClassParameters provides
  a type for ResourceClass parameters which is understood by Kubernetes.
-->
ResourceSlice
: 与结构化参数一起使用，发布集群中可用资源的信息。

ResourceClaimParameters
: 包含影响调度的 ResourceClaim 参数，
  以 Kubernetes 理解的格式（“结构化参数模型”）呈现。
  提供了供应商驱动程序，在设置底层资源时，使用的不透明扩展中可能嵌入其他参数。

ResourceClassParameters
: 类似于 ResourceClaimParameters，ResourceClassParameters 为 Kubernetes 理解的 ResourceClass 参数提供了一种类型。


<!-- 
Parameters for ResourceClass and ResourceClaim are stored in separate objects,
typically using the type defined by a {{< glossary_tooltip
term_id="CustomResourceDefinition" text="CRD" >}} that was created when
installing a resource driver.
-->
ResourceClass 和 ResourceClaim 的参数存储在单独的对象中，通常使用安装资源驱动程序时创建的
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}} 所定义的类型。

<!--
The developer of a resource driver decides whether they want to handle these
parameters in their own external controller or instead rely on Kubernetes to
handle them through the use of structured parameters. A
custom controller provides more flexibility, but cluster autoscaling is not
going to work reliably for node-local resources. Structured parameters enable
cluster autoscaling, but might not satisfy all use-cases.
-->
资源驱动程序的开发者决定他们是要在自己的外部控制器中处理这些参数，
还是依赖 Kubernetes 通过使用结构化参数来处理它们。
自定义控制器提供更多的灵活性，但对于节点本地资源，集群自动缩放可能无法可靠工作。
结构化参数使集群自动缩放成为可能，但可能无法满足所有用例。

<!--
When a driver uses structured parameters, it is still possible to let the
end-user specify parameters with vendor-specific CRDs. When doing so, the
driver needs to translate those
custom parameters into the in-tree types. Alternatively, a driver may also
document how to use the in-tree types directly.
-->
当驱动程序使用结构化参数时，仍然可以让最终用户使用供应商特定的 CRD 指定参数。
在这种情况下，驱动程序需要将这些自定义参数转换为内部类型。
或者，驱动程序也可以直接使用内部类型的文档。

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
apiVersion: resource.k8s.io/v1alpha2
kind: ResourceClass
name: resource.example.com
driverName: resource-driver.example.com
---
apiVersion: cats.resource.example.com/v1
kind: ClaimParameters
name: large-black-cat-claim-parameters
spec:
  color: black
  size: large
---
apiVersion: resource.k8s.io/v1alpha2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    resourceClassName: resource.example.com
    parametersRef:
      apiGroup: cats.resource.example.com
      kind: ClaimParameters
      name: large-black-cat-claim-parameters
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
    source:
      resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    source:
      resourceClaimTemplateName: large-black-cat-claim-template
```

<!-- 
## Scheduling
-->
## 调度  {#scheduling}

<!--
### Without structured parameters
-->
### 不使用结构化参数 {#without-structured-parameters}

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
ResourceClaims can get allocated as soon as they are created ("immediate
allocation"), without considering which Pods will use them. The default is to
delay allocation until a Pod gets scheduled which needs the ResourceClaim
(i.e. "wait for first consumer").
-->
ResourceClaim 可以在创建时就进行分配（“立即分配”），不用考虑哪些 Pod 将使用它。
默认情况下采用延迟分配，直到需要 ResourceClaim 的 Pod 被调度时
（即“等待第一个消费者”）再进行分配。

<!-- 
In that mode, the scheduler checks all ResourceClaims needed by a Pod and
creates a PodScheduling object where it informs the resource drivers
responsible for those ResourceClaims about nodes that the scheduler considers
suitable for the Pod. The resource drivers respond by excluding nodes that
don't have enough of the driver's resources left. Once the scheduler has that
information, it selects one node and stores that choice in the PodScheduling
object. The resource drivers then allocate their ResourceClaims so that the
resources will be available on that node. Once that is complete, the Pod
gets scheduled.
-->
在这种模式下，调度器检查 Pod 所需的所有 ResourceClaim，并创建一个 PodScheduling 对象，
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
that remain.  The exact resources selected are subject to the constraints
provided in any ResourceClaimParameters or ResourceClassParameters associated
with the ResourceClaim.
-->
当驱动程序使用结构化参数时，调度器负责在 Pod 需要资源时为 ResourceClaim 分配资源。
通过从 ResourceSlice 对象中检索可用资源的完整列表，
跟踪已分配给现有 ResourceClaim 的资源，然后从剩余的资源中进行选择。
所选资源受与 ResourceClaim 关联的 ResourceClaimParameters 或 ResourceClassParameters 提供的约束的影响。

<!--
The chosen resource is recorded in the ResourceClaim status together with any
vendor-specific parameters, so when a pod is about to start on a node, the
resource driver on the node has all the information it needs to prepare the
resource.
-->
所选资源与供应商特定参数一起被记录在 ResourceClaim 状态中，
因此当 Pod 即将在节点上启动时，节点上的资源驱动程序具有准备资源所需的所有信息。

<!--
By using structured parameters, the scheduler is able to reach a decision
without communicating with any DRA resource drivers. It is also able to
schedule multiple pods quickly by keeping information about ResourceClaim
allocations in memory and writing this information to the ResourceClaim objects
in the background while concurrently binding the pod to a node.
-->
通过使用结构化参数，调度器能够在不与 DRA 资源驱动程序通信的情况下做出决策。
它还能够通过将 ResourceClaim 分配信息保存在内存中，并在同时将 Pod 绑定到节点的同时将此信息写入 ResourceClaim 对象中，
快速调度多个 Pod。

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
`DynamicResourceAllocation` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) and the
`resource.k8s.io/v1alpha2` {{< glossary_tooltip text="API group"
term_id="api-group" >}} are enabled. For details on that, see the
`--feature-gates` and `--runtime-config` [kube-apiserver
parameters](/docs/reference/command-line-tools-reference/kube-apiserver/).
kube-scheduler, kube-controller-manager and kubelet also need the feature gate.
-->
动态资源分配是一个 **Alpha 特性**，只有在启用 `DynamicResourceAllocation`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
和 `resource.k8s.io/v1alpha2`
{{< glossary_tooltip text="API 组" term_id="api-group" >}} 时才启用。
有关详细信息，参阅 `--feature-gates` 和 `--runtime-config`
[kube-apiserver 参数](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。
kube-scheduler、kube-controller-manager 和 kubelet 也需要设置该特性门控。

<!-- 
A quick check whether a Kubernetes cluster supports the feature is to list
ResourceClass objects with:
-->
快速检查 Kubernetes 集群是否支持该功能的方法是列出 ResourceClass 对象：

```shell
kubectl get resourceclasses
```

<!-- 
If your cluster supports dynamic resource allocation, the response is either a
list of ResourceClass objects or:
-->
如果你的集群支持动态资源分配，则响应是 ResourceClass 对象列表或：

```
No resources found
```

<!-- 
If not supported, this error is printed instead:
-->
如果不支持，则会输出如下错误：

```
error: the server doesn't have a resource type "resourceclasses"
```

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
[Dynamic Resource Allocation KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)
   and the [Structured Parameters KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters).

-->
- 了解更多该设计的信息，
  参阅[动态资源分配 KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)
  和[结构化参数 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)。
