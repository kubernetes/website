---
title: 动态资源分配
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceSlice"
---
<!--
reviewers:
- klueska
- pohly
title: Dynamic Resource Allocation
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceSlice"
-->

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

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
-->
动态资源分配是一个用于在 Pod 之间和 Pod 内部容器之间请求和共享资源的 API。
它是持久卷 API 针对一般资源的泛化。通常这些资源是 GPU 这类设备。

第三方资源驱动程序负责跟踪和准备资源，
Kubernetes 通过**结构化参数**（在 Kubernetes 1.30 中引入）处理资源的分配。
不同类别的资源支持任意参数来定义要求和初始化。

<!--
Kubernetes v1.26 through to 1.31 included an (alpha) implementation of _classic DRA_,
which is no longer supported. This documentation, which is for Kubernetes
v{{< skew currentVersion >}}, explains the current approach to dynamic resource
allocation within Kubernetes.
-->
Kubernetes v1.26 至 1.31 包含了**经典 DRA** 的（Alpha）实现，该实现已不再支持。
本文档适用于 Kubernetes v{{< skew currentVersion >}}，解释了 Kubernetes
中当前的动态资源分配方法。

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
The `resource.k8s.io/v1beta1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} provides these types:
-->
`resource.k8s.io/v1beta1`
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
ResourceSlice
: Used with structured parameters to publish information about resources
  that are available in the cluster.
-->
ResourceSlice
: 用于 DRA 驱动程序发布关于集群中可用资源的信息。

<!--
All parameters that select devices are defined in the ResourceClaim and
DeviceClass with in-tree types. Configuration parameters can be embedded there.
Which configuration parameters are valid depends on the DRA driver -- Kubernetes
only passes them through without interpreting them.
-->
所有选择设备的参数都在 ResourceClaim 和 DeviceClass 中使用内置类型定义。
其中可以嵌入配置参数。哪些配置参数有效取决于 DRA 驱动程序 —— Kubernetes 只是将它们传递下去而不进行解释。

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
apiVersion: resource.k8s.io/v1beta1
kind: DeviceClass
name: resource.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == "resource-driver.example.com"
---
apiVersion: resource.k8s.io/v1beta1
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
### With structured parameters
-->
### 使用结构化参数 {#with-structured-parameters}

<!-- 
The scheduler is responsible for allocating resources to a ResourceClaim whenever a pod needs
them. It does so by retrieving the full list of available resources from
ResourceSlice objects, tracking which of those resources have already been
allocated to existing ResourceClaims, and then selecting from those resources
that remain.
-->
调度器负责在 Pod 需要资源时为 ResourceClaim 分配资源。
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
detects this and tries to make the Pod runnable by reserving the required
ResourceClaims. However, this only works if those were allocated by
the scheduler for some other pod.
-->
这种情况也可能发生在 Pod 被调度时调度器中未启用动态资源分配支持的时候（原因可能是版本偏差、配置、特性门控等）。
kube-controller-manager 能够检测到这一点，并尝试通过预留所需的一些 ResourceClaim 来使 Pod 可运行。
然而，这只有在这些 ResourceClaim 已经被调度器为其他 Pod 分配的情况下才有效。

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
## Admin access
-->
## 管理性质的访问  {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

<!--
You can mark a request in a ResourceClaim or ResourceClaimTemplate as having privileged features.
A request with admin access grants access to devices which are in use and
may enable additional permissions when making the device available in a
container:
-->
你可以在 ResourceClaim 或 ResourceClaimTemplate 中标记一个请求为具有特权特性。
具有管理员访问权限的请求可以允许用户访问使用中的设备，并且在将设备提供给容器时可能授权一些额外的访问权限：

```yaml
apiVersion: resource.k8s.io/v1beta1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        deviceClassName: resource.example.com
        adminAccess: true
```

<!--
If this feature is disabled, the `adminAccess` field will be removed
automatically when creating such a ResourceClaim.

Admin access is a privileged mode which should not be made available to normal
users in a multi-tenant cluster. Cluster administrators can restrict usage of
this feature by installing a validating admission policy similar to the following
example. Cluster administrators need to adapt at least the names and replace
"dra.example.com".
-->
如果此特性被禁用，创建此类 ResourceClaim 时将自动移除 `adminAccess` 字段。

管理性质访问是一种特权模式，在多租户集群中不应该对普通用户开放。
集群管理员可以通过安装类似于以下示例的验证准入策略来限制哪些负载能够使用此特性。
集群管理员至少需要调整 name 属性并将 "dra.example.com" 替换为有意义的值。

<!--
# Permission to use admin access is granted only in namespaces which have the
# "admin-access.dra.example.com" label. Other ways of making that decision are
# also possible.
-->
```yaml
# 仅将管理性质访问权限授予具有 "admin-access.dra.example.com" 标签的命名空间。
# 也可以采用其他方式做出此类决定。
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: resourceclaim-policy.dra.example.com
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["resource.k8s.io"]
      apiVersions: ["v1alpha3", "v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["resourceclaims"]
  validations:
    - expression: '! object.spec.devices.requests.exists(e, has(e.adminAccess) && e.adminAccess)'
      reason: Forbidden
      messageExpression: '"admin access to devices not enabled"'
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: resourceclaim-binding.dra.example.com
spec:
  policyName:  resourceclaim-policy.dra.example.com
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: admin-access.dra.example.com
        operator: DoesNotExist
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: resourceclaimtemplate-policy.dra.example.com
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["resource.k8s.io"]
      apiVersions: ["v1alpha3", "v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["resourceclaimtemplates"]
  validations:
    - expression: '! object.spec.spec.devices.requests.exists(e, has(e.adminAccess) && e.adminAccess)'
      reason: Forbidden
      messageExpression: '"admin access to devices not enabled"'
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: resourceclaimtemplate-binding.dra.example.com
spec:
  policyName:  resourceclaimtemplate-policy.dra.example.com
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: admin-access.dra.example.com
        operator: DoesNotExist
```

<!--
## ResourceClaim Device Status
-->
ResourceClaim 设备状态  {#resourceclaim-device-status}

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

<!--
The drivers can report driver-specific device status data for each allocated device
in a resource claim. For example, IPs assigned to a network interface device can be 
reported in the ResourceClaim status.

The drivers setting the status, the accuracy of the information depends on the implementation 
of those DRA Drivers. Therefore, the reported status of the device may not always reflect the 
real time changes of the state of the device.

When the feature is disabled, that field automatically gets cleared when storing the ResourceClaim. 

A ResourceClaim device status is supported when it is possible, from a DRA driver, to update an 
existing ResourceClaim where the `status.devices` field is set.
-->
驱动程序可以报告资源申领中各个已分配设备的、特定于驱动程序的设备状态。
例如，可以在 ResourceClaim 状态中报告分配给网络接口设备的 IP。

驱动程序设置状态，信息的准确性取决于 DRA 驱动程序的具体实现。因此，所报告的设备状态可能并不总是反映设备状态的实时变化。

当此特性被禁用时，该字段会在存储 ResourceClaim 时自动清除。

针对一个已经设置了 `status.devices` 字段的现有 ResourceClaim 而言，如果 DRA
驱动能够更新该 ResourceClaim，则有可能支持 ResourceClaim 设备状态这一特性。

<!-- 
## Enabling dynamic resource allocation
-->
## 启用动态资源分配 {#enabling-dynamic-resource-allocation}

<!--
Dynamic resource allocation is a *beta feature* which is off by default and only enabled when the
`DynamicResourceAllocation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
and the `resource.k8s.io/v1beta1` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled. For details on that, see the `--feature-gates` and `--runtime-config`
[kube-apiserver parameters](/docs/reference/command-line-tools-reference/kube-apiserver/).
kube-scheduler, kube-controller-manager and kubelet also need the feature gate.
-->
动态资源分配是一个 **Beta 特性**，默认关闭，只有在启用 `DynamicResourceAllocation`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
和 `resource.k8s.io/v1beta1`
{{< glossary_tooltip text="API 组" term_id="api-group" >}} 时才启用。
有关详细信息，参阅 `--feature-gates` 和 `--runtime-config`
[kube-apiserver 参数](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。
kube-scheduler、kube-controller-manager 和 kubelet 也需要设置该特性门控。

<!--
When a resource driver reports the status of the devices, then the
`DRAResourceClaimDeviceStatus` feature gate has to be enabled in addition to
`DynamicResourceAllocation`.
-->
当资源驱动程序报告设备状态时，除了需要启用 `DynamicResourceAllocation` 外，
还必须启用 `DRAResourceClaimDeviceStatus` 特性门控。

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

<!--
### Enabling admin access

[Admin access](#admin-access) is an *alpha feature* and only enabled when the
`DRAAdminAccess` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver and kube-scheduler.
-->
### 启用管理性质访问  {#enabling-admin-access}

[管理性质访问](#admin-access) 是一个 **Alpha 级别特性**，仅在 kube-apiserver 和 kube-scheduler
中启用了 `DRAAdminAccess` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才生效。

<!--
### Enabling Device Status

[ResourceClaim Device Status](#resourceclaim-device-status) is an *alpha feature* 
and only enabled when the `DRAResourceClaimDeviceStatus` 
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver.
-->
### 启用设备状态  {#enabling-device-status}

[ResourceClaim 设备状态](#resourceclaim-device-status) 是一个 **Alpha 级别特性**，
仅在 kube-apiserver 中启用了 `DRAResourceClaimDeviceStatus`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才生效。

## {{% heading "whatsnext" %}}

<!-- 
- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP.
-->
- 了解更多该设计的信息，
  参阅[使用结构化参数的动态资源分配 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)。
