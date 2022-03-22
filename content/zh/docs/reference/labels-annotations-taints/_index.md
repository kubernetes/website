---
title: 常见的标签、注解和污点
content_type: concept
weight: 20
no_list: true
---
<!-- 
---
title: Well-Known Labels, Annotations and Taints
content_type: concept
weight: 20
no_list: true
---
-->

<!-- overview -->

<!-- 
Kubernetes reserves all labels and annotations in the kubernetes.io namespace.

This document serves both as a reference to the values and as a coordination point for assigning values.
-->
Kubernetes 保留命名空间 kubernetes.io 下的所有的标签和注解。

本文档有两个作用，一是作为可用值的参考，二是作为赋值的协调点。

<!-- body -->

<!--
## Labels, annotations and taints used on API objects

### kubernetes.io/arch

Example: `kubernetes.io/arch=amd64`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go. This can be handy if you are mixing arm and x86 nodes.
-->
## 用于 API 对象的标签、注解和污点

### kubernetes.io/arch

示例：`kubernetes.io/arch=amd64`

用于：Node

Kubelet 用 Go 定义的 `runtime.GOARCH` 生成该标签的键值。
在混合使用 ARM 和 x86 节点的场景中，此键值可以带来极大便利。

<!--
### kubernetes.io/os

Example: `kubernetes.io/os=linux`

Used on: Node

The Kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).
-->
### kubernetes.io/os

示例：`kubernetes.io/os=linux`

用于：Node

Kubelet 用 Go 定义的 `runtime.GOOS` 生成该标签的键值。
在混合使用异构操作系统场景下（例如：混合使用 Linux 和 Windows 节点），此键值可以带来极大便利。

<!--
### kubernetes.io/metadata.name

Example: `kubernetes.io/metadata.name=mynamespace`

Used on: Namespaces

The Kubernetes API server (part of the {{< glossary_tooltip text="control plane" term_id="control-plane" >}})
sets this label on all namespaces. The label value is set
to the name of the namespace. You can't change this label's value.

This is useful if you want to target a specific namespace with a label
{{< glossary_tooltip text="selector" term_id="selector" >}}.
-->
### kubernetes.io/metadata.name

示例：`kubernetes.io/metadata.name=mynamespace`

用于：Namespace

Kubernetes API 服务器（{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的一部分）
会在所有命名空间上设置此标签。标签值被设置为命名空间的名称。你无法更改此标签值。

如果你想使用标签{{< glossary_tooltip text="选择器" term_id="selector" >}}来指向特定的命名空间，
此标签很有用。

<!--
### beta.kubernetes.io/arch (deprecated)

This label has been deprecated. Please use `kubernetes.io/arch` instead.

### beta.kubernetes.io/os (deprecated)

This label has been deprecated. Please use `kubernetes.io/os` instead.
-->
### beta.kubernetes.io/arch (已弃用)

此标签已被弃用，取而代之的是 `kubernetes.io/arch`.

### beta.kubernetes.io/os (已弃用)

此标签已被弃用，取而代之的是 `kubernetes.io/os`.

<!--
### kubernetes.io/hostname {#kubernetesiohostname}

Example: `kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

Used on: Node

The Kubelet populates this label with the hostname. Note that the hostname can be changed from the "actual" hostname by passing the `--hostname-override` flag to the `kubelet`.

This label is also used as part of the topology hierarchy.  See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.
-->
### kubernetes.io/hostname {#kubernetesiohostname}

示例：`kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

用于：Node

Kubelet 用主机名生成此标签的取值。
注意可以通过传入参数 `--hostname-override` 给 `kubelet` 来修改此“实际”主机名。

此标签也可用做拓扑层次的一个部分。
更多信息参见 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### kubernetes.io/change-cause {#change-cause}

Example: `kubernetes.io/change-cause=kubectl edit --record deployment foo`

Used on: All Objects

This annotation is a best guess at why something was changed.

It is populated when adding `--record` to a `kubectl` command that may change an object.
-->
### kubernetes.io/change-cause {#change-cause}

示例：`kubernetes.io/change-cause=kubectl edit --record deployment foo`

用于：所有对象

此注解是对改动原因的最好的推测。

当在可能修改一个对象的 `kubectl` 命令中加入 `--record` 时，会生成此注解。

<!--
### kubernetes.io/description {#description}

Example: `kubernetes.io/description: "Description of K8s object."`

Used on: All Objects

This annotation is used for describing specific behaviour of given object.
-->
### kubernetes.io/description {#description}

示例：`kubernetes.io/description: "Description of K8s object."`

用于：所有对象

此注解用于描述给定对象的具体行为

<!--
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

Example: `kubernetes.io/enforce-mountable-secrets: "true"`

Used on: ServiceAccount

The value for this annotation must be **true** to take effect. This annotation indicates that pods running as this service account may only reference Secret API objects specified in the service account's `secrets` field.
-->
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

示例：`kubernetes.io/enforce-mountable-secrets: "true"`

用于：ServiceAccount

此注解只在值为 **true** 时生效。
此注解表示以此服务账号运行的 Pod 只能引用此服务账号的 `secrets` 字段中所写的 Secret API 对象。

<!--
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

Example: `controller.kubernetes.io/pod-deletion-cost=10`

Used on: Pod

This annotation is used to set [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
which allows users to influence ReplicaSet downscaling order. The annotation parses into an `int32` type.
-->
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

示例：`controller.kubernetes.io/pod-deletion-cost=10`

用于：Pod

该注解用于设置 [Pod 删除开销](/zh/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)，
允许用户影响 ReplicaSet 的缩减顺序。该注解解析为 `int32` 类型。

<!--
### beta.kubernetes.io/instance-type (deprecated)

Starting in v1.17, this label is deprecated in favor of [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type).
-->
### beta.kubernetes.io/instance-type (已弃用)

{{< note >}} 
从 v1.17 起，此标签被弃用，取而代之的是 [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type)。
{{< /note >}}

<!--
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

Example: `node.kubernetes.io/instance-type=m3.medium`

Used on: Node

The Kubelet populates this with the instance type as defined by the `cloudprovider`.
This will be set only if you are using a `cloudprovider`. This setting is handy
if you want to target certain workloads to certain instance types, but typically you want
to rely on the Kubernetes scheduler to perform resource-based scheduling. You should aim to schedule based on properties rather than on instance types (for example: require a GPU, instead of requiring a `g2.2xlarge`).
-->
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

示例：`node.kubernetes.io/instance-type=m3.medium`

用于：Node

Kubelet 用 `cloudprovider` 定义的实例类型生成此标签的取值。
所以只有用到 `cloudprovider` 的场合，才会设置此标签。
在你希望把特定工作负载调度到特定实例类型的时候此标签很有用，但更常见的调度方法是基于
Kubernetes 调度器来执行基于资源的调度。
你应该聚焦于使用基于属性的调度方式，而不是基于实例类型（例如：应该申请一个 GPU，而不是 `g2.2xlarge`）。

<!--
### failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

See [topology.kubernetes.io/region](#topologykubernetesioregion).

Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/region](#topologykubernetesioregion).
-->
### failure-domain.beta.kubernetes.io/region (已弃用) {#failure-domainbetakubernetesioregion}

参见 [topology.kubernetes.io/region](#topologykubernetesioregion).

{{< note >}} 
从 v1.17 开始，此标签被弃用，取而代之的是 [topology.kubernetes.io/region](#topologykubernetesioregion)。
{{< /note >}}

<!--
### failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

See [topology.kubernetes.io/zone](#topologykubernetesiozone).

Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### failure-domain.beta.kubernetes.io/zone (已弃用) {#failure-domainbetakubernetesiozone}

参见 [topology.kubernetes.io/zone](#topologykubernetesiozone).

{{< note >}} 
从 v1.17 开始，此标签被弃用，取而代之的是 [topology.kubernetes.io/zone](#topologykubernetesiozone)。
{{< /note >}}

<!--
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

Example:

`statefulset.kubernetes.io/pod-name=mystatefulset-7`

When a StatefulSet controller creates a Pod for the StatefulSet, the control plane
sets this label on that Pod. The value of the label is the name of the Pod being created.

See [Pod Name Label](/docs/concepts/workloads/controllers/statefulset/#pod-name-label) in the
StatefulSet topic for more details.
-->
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

示例：`statefulset.kubernetes.io/pod-name=mystatefulset-7`

当 StatefulSet 控制器为 StatefulSet 创建 Pod 时，控制平面会在该 Pod 上设置此标签。
标签的值是正在创建的 Pod 的名称。

更多细节请参见 StatefulSet 文章中的 [Pod 名称标签](/zh/docs/concepts/workloads/controllers/statefulset/#pod-name-label)。

<!--
### topology.kubernetes.io/region {#topologykubernetesioregion}

Example:

`topology.kubernetes.io/region=us-east-1`

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### topology.kubernetes.io/region {#topologykubernetesioregion}

示例：`topology.kubernetes.io/region=us-east-1`

参见 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### topology.kubernetes.io/zone {#topologykubernetesiozone}

Example:

`topology.kubernetes.io/zone=us-east-1c`

Used on: Node, PersistentVolume
-->
### topology.kubernetes.io/zone {#topologykubernetesiozone}

示例：`topology.kubernetes.io/zone=us-east-1c`

用于：Node、PersistentVolume

<!-- 
On Node: The `kubelet` or the external `cloud-controller-manager` populates this with the information as provided by the `cloudprovider`.  This will be set only if you are using a `cloudprovider`. However, you should consider setting this on nodes if it makes sense in your topology.

On PersistentVolume: topology-aware volume provisioners will automatically set node affinity constraints on `PersistentVolumes`.
-->
Node 场景：`kubelet` 或外部的 `cloud-controller-manager` 用 `cloudprovider` 提供的信息生成此标签。
所以只有在用到 `cloudprovider` 的场景下，此标签才会被设置。
但如果此标签在你的拓扑中有意义，你也可以考虑在 Node 上设置它。

PersistentVolume 场景：拓扑自感知的卷制备程序将在 `PersistentVolumes` 上自动设置节点亲和性限制。

<!-- 
A zone represents a logical failure domain.  It is common for Kubernetes clusters to span multiple zones for increased availability.  While the exact definition of a zone is left to infrastructure implementations, common properties of a zone include very low network latency within a zone, no-cost network traffic within a zone, and failure independence from other zones.  For example, nodes within a zone might share a network switch, but nodes in different zones should not.
-->
一个可用区（Zone）表示一个逻辑故障域。Kubernetes 集群通常会跨越多个可用区以提高可用性。
虽然可用区的确切定义留给基础设施来决定，但可用区常见的属性包括：
可用区内的网络延迟非常低，可用区内的网络通讯无成本，以及故障独立性。
例如，一个可用区中的节点可以共享交换机，但不同可用区则不应该。

<!-- 
A region represents a larger domain, made up of one or more zones.  It is uncommon for Kubernetes clusters to span multiple regions,  While the exact definition of a zone or region is left to infrastructure implementations, common properties of a region include higher network latency between them than within them, non-zero cost for network traffic between them, and failure independence from other zones or regions.  For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but nodes in different regions typically would not.
-->
一个地区（Region）表示一个更大的域，由一个或多个可用区组成。对于 Kubernetes 来说，跨越多个地区的集群很罕见。
虽然可用区和地区的确切定义留给基础设施来决定，但地区的常见属性包括：
相比于地区内通信地区间的网络延迟更高，地区间网络流量成本更高，以及故障独立性。
例如，一个地区内的节点也许会共享电力基础设施（例如 UPS 或发电机），但不同地区内的节点显然不会。

<!-- 
Kubernetes makes a few assumptions about the structure of zones and regions:
1) regions and zones are hierarchical: zones are strict subsets of regions and no zone can be in 2 regions
2) zone names are unique across regions; for example region "africa-east-1" might be comprised of zones "africa-east-1a" and "africa-east-1b"
-->
Kubernetes 对可用区和地区的结构做出一些假设：
1）地区和可用区是层次化的：可用区是地区的严格子集，任何可用区都不能在 2 个地区中出现。
2）可用区名字在地区中独一无二：例如地区 "africa-east-1" 可由可用区 "africa-east-1a" 和 "africa-east-1b" 构成。

<!-- 
It should be safe to assume that topology labels do not change.  Even though labels are strictly mutable, consumers of them can assume that a given node is not going to be moved between zones without being destroyed and recreated.
-->
你可以安全地假定拓扑类的标签是固定不变的。
即使标签严格来说是可变的，使用者依然可以假定一个节点只有通过销毁、重建的方式，才能在可用区间移动。

<!-- 
Kubernetes can use this information in various ways.  For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes in a single-zone cluster (to reduce the impact of node failures, see [kubernetes.io/hostname](#kubernetesiohostname)). With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures). This is achieved via _SelectorSpreadPriority_.
-->
Kubernetes 能以多种方式使用这些信息。
例如，调度器自动地尝试将 ReplicaSet 中的 Pod
打散在单可用区集群的不同节点上（以减少节点故障的影响，参见[kubernetes.io/hostname](#kubernetesiohostname)）。
在多可用区的集群中，这类打散分布的行为也会应用到可用区（以减少可用区故障的影响）。
做到这一点靠的是 _SelectorSpreadPriority_。

<!-- 
_SelectorSpreadPriority_ is a best effort placement. If the zones in your cluster are heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod resource requirements), this placement might prevent equal spreading of your Pods across zones. If desired, you can use homogenous zones (same number and types of nodes) to reduce the probability of unequal spreading.
-->
_SelectorSpreadPriority_ 是一种尽力而为（best effort）的分配方法。
如果集群中的可用区是异构的（例如：节点数量不同、节点类型不同或者 Pod
的资源需求不同），这种分配方法可以防止平均分配 Pod 到可用区。
如果需要，你可以用同构的可用区（相同数量和类型的节点）来减少潜在的不平衡分布。

<!-- 
The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods, that claim a given volume, are only placed into the same zone as that volume. Volumes cannot be attached across zones.
-->
调度器会（通过 _VolumeZonePredicate_ 断言）保障申领了某卷的 Pod 只能分配到该卷相同的可用区。
卷不支持跨可用区挂载。

<!-- 
If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes, you should consider
adding the labels manually (or adding support for `PersistentVolumeLabel`). With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone. If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.
-->
如果 `PersistentVolumeLabel` 不支持给你的 PersistentVolume 自动打标签，你可以考虑手动加标签（或增加
`PersistentVolumeLabel` 支持）。
有了 `PersistentVolumeLabel`，调度器可以防止 Pod 挂载不同可用区中的卷。
如果你的基础架构没有此限制，那你根本就没有必要给卷增加 zone 标签。

<!--
### volume.beta.kubernetes.io/storage-provisioner (deprecated)

Example: `volume.beta.kubernetes.io/storage-provisioner: k8s.io/minikube-hostpath`

Used on: PersistentVolumeClaim

This annotation has been deprecated.
-->
### volume.beta.kubernetes.io/storage-provisioner (已弃用)

示例：`volume.beta.kubernetes.io/storage-provisioner: k8s.io/minikube-hostpath`

用于：PersistentVolumeClaim

该注解已被弃用。

<!--
### volume.kubernetes.io/storage-provisioner

Used on: PersistentVolumeClaim

This annotation will be added to dynamic provisioning required PVC.
-->
### volume.kubernetes.io/storage-provisioner

用于：PersistentVolumeClaim

该注解会被加到动态制备的 PVC 上。

<!--
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

Example: `node.kubernetes.io/windows-build=10.0.17763`

Used on: Node

When the kubelet is running on Microsoft Windows, it automatically labels its node to record the version of Windows Server in use.

The label's value is in the format "MajorVersion.MinorVersion.BuildNumber".
-->
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

示例: `node.kubernetes.io/windows-build=10.0.17763`

用于：Node

当 kubelet 运行于 Microsoft Windows 时，它给节点自动打标签，以记录 Windows Server 的版本。

标签值的格式为 "主版本.次版本.构建号"。

<!--
### service.kubernetes.io/headless {#servicekubernetesioheadless}

Example: `service.kubernetes.io/headless=""`

Used on: Service

The control plane adds this label to an Endpoints object when the owning Service is headless.
-->
### service.kubernetes.io/headless {#servicekubernetesioheadless}

示例：`service.kubernetes.io/headless=""`

用于：Service

在无头（headless）服务的场景下，控制平面为 Endpoints 对象添加此标签。

<!--
### kubernetes.io/service-name {#kubernetesioservice-name}

Example: `kubernetes.io/service-name="nginx"`

Used on: Service

Kubernetes uses this label to differentiate multiple Services. Used currently for `ELB`(Elastic Load Balancer) only.
-->
### kubernetes.io/service-name {#kubernetesioservice-name}

示例：`kubernetes.io/service-name="nginx"`

用于：Service

Kubernetes 用此标签区分多个服务。当前仅用于 `ELB`（Elastic Load Balancer）。

<!--
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

Example: `endpointslice.kubernetes.io/managed-by="controller"`

Used on: EndpointSlices

The label is used to indicate the controller or entity that manages an EndpointSlice. This label aims to enable different EndpointSlice objects to be managed by different controllers or entities within the same cluster.
-->
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

示例：`endpointslice.kubernetes.io/managed-by="controller"`

用于：EndpointSlice

此标签用来标示管理 EndpointSlice 的控制器或实体。
此标签的目的是允许集群中使用不同控制器或实体来管理不同的 EndpointSlice。

<!--
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

Example: `endpointslice.kubernetes.io/skip-mirror="true"`

Used on: Endpoints

The label can be set to `"true"` on an Endpoints resource to indicate that the EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.
-->
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

示例：`endpointslice.kubernetes.io/skip-mirror="true"`

用于：Endpoints

此标签在 Endpoints 资源上设为 `"true"` 时，指示 EndpointSliceMirroring 控制器不要使用 EndpointSlices 镜像此资源。

<!--
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

Example: `service.kubernetes.io/service-proxy-name="foo-bar"`

Used on: Service

The kube-proxy has this label for custom proxy, which delegates service control to custom proxy.
-->
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

示例：`service.kubernetes.io/service-proxy-name="foo-bar"`

用于：Service

此标签被 kube-proxy 用于自定义代理，将服务控制委托给自定义代理。

<!--
### experimental.windows.kubernetes.io/isolation-type (deprecated) {#experimental-windows-kubernetes-io-isolation-type}

Example: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Used on: Pod

The annotation is used to run Windows containers with Hyper-V isolation. To use Hyper-V isolation feature and create a Hyper-V isolated container, the kubelet should be started with feature gates HyperVContainer=true and the Pod should include the annotation experimental.windows.kubernetes.io/isolation-type=hyperv.
-->
### experimental.windows.kubernetes.io/isolation-type (已弃用) {#experimental-windows-kubernetes-io-isolation-type}

示例：`experimental.windows.kubernetes.io/isolation-type: "hyperv"`

用于：Pod

此注解用于运行 Hyper-V 隔离的 Windows 容器。
要使用 Hyper-V 隔离特性，并创建 Hyper-V 隔离的容器，kubelet 应启用特性门控 HyperVContainer=true，并且
Pod 应该包含注解 `experimental.windows.kubernetes.io/isolation-type=hyperv`。

<!--
You can only set this annotation on Pods that have a single container.
Starting from v1.20, this annotation is deprecated. Experimental Hyper-V support was removed in 1.21.
-->
{{< note >}}
你只能在单容器 Pod 上设置此注解。
从 v1.20 开始，此注解被弃用。实验性的 Hyper-V 支持于 1.21 中被移除。
{{< /note >}}

<!--
### ingressclass.kubernetes.io/is-default-class

Example: `ingressclass.kubernetes.io/is-default-class: "true"`

Used on: IngressClass

When a single IngressClass resource has this annotation set to `"true"`, new Ingress resource without a class specified will be assigned this default class.
-->
### ingressclass.kubernetes.io/is-default-class

示例：`ingressclass.kubernetes.io/is-default-class: "true"`

用于：IngressClass

当仅有一个 IngressClass 资源将此注解的值设为 `"true"`，没有指定类的新 Ingress 资源将使用此默认类。

<!--
### kubernetes.io/ingress.class (deprecated)

Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`.
-->
### kubernetes.io/ingress.class (已弃用)

{{< note >}} 
从 v1.18 开始，此注解被弃用，取而代之的是 `spec.ingressClassName`。
{{< /note >}}

<!--
### storageclass.kubernetes.io/is-default-class

Example: `storageclass.kubernetes.io/is-default-class=true`

Used on: StorageClass

When a single StorageClass resource has this annotation set to `"true"`, new PersistentVolumeClaim
resource without a class specified will be assigned this default class.
-->
### storageclass.kubernetes.io/is-default-class

示例：`storageclass.kubernetes.io/is-default-class=true`

用于：StorageClass

当仅有一个 StorageClass 资源将这个注解设置为 `"true"` 时，没有指定类的新
PersistentVolumeClaim 资源将被设定为此默认类。

<!--
### alpha.kubernetes.io/provided-node-ip

Example: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

Used on: Node

The kubelet can set this annotation on a Node to denote its configured IPv4 address.

When kubelet is started with the "external" cloud provider, it sets this annotation on the Node to denote an IP address set from the command line flag (`--node-ip`). This IP is verified with the cloud provider as valid by the cloud-controller-manager.
-->
### alpha.kubernetes.io/provided-node-ip

示例：`alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

用于：Node

kubelet 在 Node 上设置此注解，标示它所配置的 IPv4 地址。

如果 kubelet 启动时配置了“external”云驱动，它会在 Node
上设置此注解以标示通过命令行参数（`--node-ip`）设置的 IP 地址。
该 IP 地址由 cloud-controller-manager 向云驱动验证有效性。

<!--
### batch.kubernetes.io/job-completion-index

Example: `batch.kubernetes.io/job-completion-index: "3"`

Used on: Pod

The Job controller in the kube-controller-manager sets this annotation for Pods
created with Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).
-->
### batch.kubernetes.io/job-completion-index

示例：`batch.kubernetes.io/job-completion-index: "3"`

用于：Pod

kube-controller-manager 中的 Job
控制器给使用索引（Indexed）[完成模式](/zh/docs/concepts/workloads/controllers/job/#completion-mode)创建的
Pod 设置此注解。

<!--
### kubectl.kubernetes.io/default-container

Example: `kubectl.kubernetes.io/default-container: "front-end-app"`

The value of the annotation is the container name that is default for this Pod. For example, `kubectl logs` or `kubectl exec` without `-c` or `--container` flag will use this default container.
-->
### kubectl.kubernetes.io/default-container

示例：`kubectl.kubernetes.io/default-container: "front-end-app"`

此注解的值是 Pod 的默认容器名称。
例如，`kubectl logs` 或 `kubectl exec` 没有传入 `-c` 或 `--container` 参数时，将使用这个默认的容器。

<!--
### endpoints.kubernetes.io/over-capacity

Example: `endpoints.kubernetes.io/over-capacity:truncated`

Used on: Endpoints

In Kubernetes clusters v1.22 (or later), the Endpoints controller adds this annotation to an Endpoints resource if it has more than 1000 endpoints. The annotation indicates that the Endpoints resource is over capacity and the number of endpoints has been truncated to 1000.
-->
### endpoints.kubernetes.io/over-capacity

示例：`endpoints.kubernetes.io/over-capacity:warning`

用于：Endpoints

在 v1.22（或更高版本）的 Kubernetes 集群中，如果 Endpoints
资源中的端点超过了 1000 个，Endpoints 控制器就会向其添加这个注解。
该注解表示此 Endpoints 资源已超过容量，而其端点数已被截断至 1000。

<!--
### batch.kubernetes.io/job-tracking

Example: `batch.kubernetes.io/job-tracking: ""`

Used on: Jobs

The presence of this annotation on a Job indicates that the control plane is
[tracking the Job status using finalizers](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers).
You should **not** manually add or remove this annotation.
-->
### batch.kubernetes.io/job-tracking

示例：`batch.kubernetes.io/job-tracking: ""`

用于：Job

Job 资源中若包含了此注解，则代表控制平面正[使用 Finalizer 追踪 Job 的状态](/zh/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers)。
你**不该**手动添加或移除此注解。

<!--
### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

Used on: Nodes

This annotation requires the [NodePreferAvoidPods scheduling plugin](/docs/reference/scheduling/config/#scheduling-plugins)
to be enabled. The plugin is deprecated since Kubernetes 1.22.
Use [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) instead.
-->
### scheduler.alpha.kubernetes.io/preferAvoidPods (已弃用) {#scheduleralphakubernetesio-preferavoidpods}

用于：Node

此注解要求启用 [NodePreferAvoidPods 调度插件](/zh/docs/reference/scheduling/config/#scheduling-plugins)。
该插件已于 Kubernetes 1.22 起弃用。
请转而使用[污点和容忍度](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)。

<!--
**The taints listed below are always used on Nodes**

### node.kubernetes.io/not-ready

Example: `node.kubernetes.io/not-ready:NoExecute`

The node controller detects whether a node is ready by monitoring its health and adds or removes this taint accordingly.
-->
**以下列出的污点只能用于 Node**

### node.kubernetes.io/not-ready

示例：`node.kubernetes.io/not-ready:NoExecute`

节点控制器通过健康监控来检测节点是否就绪，并据此添加/删除此污点。

<!--
### node.kubernetes.io/unreachable

Example: `node.kubernetes.io/unreachable:NoExecute`

The node controller adds the taint to a node corresponding to the [NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.
-->
### node.kubernetes.io/unreachable

示例：`node.kubernetes.io/unreachable:NoExecute`

如果[节点状况](/zh/docs/concepts/architecture/nodes/#condition)的
`Ready` 键值为 `Unknown`，节点控制器会为节点添加此污点。

<!--
### node.kubernetes.io/unschedulable

Example: `node.kubernetes.io/unschedulable:NoSchedule`

The taint will be added to a node when initializing the node to avoid race condition.
-->
### node.kubernetes.io/unschedulable

示例：`node.kubernetes.io/unschedulable:NoSchedule`

此污点会在节点初始化时被添加，以避免竟态的发生。

<!--
### node.kubernetes.io/memory-pressure

Example: `node.kubernetes.io/memory-pressure:NoSchedule`

The kubelet detects memory pressure based on `memory.available` and `allocatableMemory.available` observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/memory-pressure

示例：`node.kubernetes.io/memory-pressure:NoSchedule`

kubelet 依据节点上观测到的 `memory.available` 和 `allocatableMemory.available` 来检测内存压力。
用观测值对比 kubelet 设置的阈值，以判断是否需要添加/移除节点状况和污点。

<!--
### node.kubernetes.io/disk-pressure

Example: `node.kubernetes.io/disk-pressure:NoSchedule`

The kubelet detects disk pressure based on `imagefs.available`, `imagefs.inodesFree`, `nodefs.available` and `nodefs.inodesFree`(Linux only) observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/disk-pressure

示例：`node.kubernetes.io/disk-pressure:NoSchedule`

kubelet 依据节点上观测到的 `imagefs.available`、`imagefs.inodesFree`、`nodefs.available` 和
`nodefs.inodesFree`(仅 Linux) 来判断磁盘压力。 
用观测值对比 kubelet 设置的阈值，以判断是否需要添加/移除节点状况和污点。

<!--
### node.kubernetes.io/network-unavailable

Example: `node.kubernetes.io/network-unavailable:NoSchedule`

This is initially set by the kubelet when the cloud provider used indicates a requirement for additional network configuration. Only when the route on the cloud is configured properly will the taint be removed by the cloud provider.
-->
### node.kubernetes.io/network-unavailable

示例：`node.kubernetes.io/network-unavailable:NoSchedule`

此污点初始由 kubelet 设置，云驱动用它来指示对额外网络配置的需求。
仅当云中的路由配置妥当后，云驱动才会移除此污点。

<!--
### node.kubernetes.io/pid-pressure

Example: `node.kubernetes.io/pid-pressure:NoSchedule`

The kubelet checks D-value of the size of `/proc/sys/kernel/pid_max` and the PIDs consumed by Kubernetes on a node to get the number of available PIDs that referred to as the `pid.available` metric. The metric is then compared to the corresponding threshold that can be set on the kubelet to determine if the node condition and taint should be added/removed.
-->
### node.kubernetes.io/pid-pressure

示例：`node.kubernetes.io/pid-pressure:NoSchedule`

kubelet 检查 `/proc/sys/kernel/pid_max` 尺寸的 D 值（D-value），以及节点上
Kubernetes 消耗掉的 PID 以获取可用的 PID 数量，即指标 `pid.available` 所指代的值。
然后用此指标对比 kubelet 设置的阈值，以确定节点状态和污点是否可以被添加/移除。

<!--
### node.cloudprovider.kubernetes.io/uninitialized

Example: `node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

Sets this taint on a node to mark it as unusable, when kubelet is started with the "external" cloud provider, until a controller from the cloud-controller-manager initializes this node, and then removes the taint.
-->
### node.cloudprovider.kubernetes.io/uninitialized

示例：`node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

如果 kubelet 启动时设置了“external”云驱动，将在节点上设置此污点以标记节点不可用，直到
cloud-controller-manager 中的某个控制器初始化此节点之后，才会移除此污点。

<!--
### node.cloudprovider.kubernetes.io/shutdown

Example: `node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.
-->
### node.cloudprovider.kubernetes.io/shutdown

示例：`node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

如果 Node 处于云驱动所指定的关机状态，Node 将被打上污点
`node.cloudprovider.kubernetes.io/shutdown`，污点的效果为 `NoSchedule`。

<!--
### pod-security.kubernetes.io/enforce

Example: `pod-security.kubernetes.io/enforce: baseline`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `enforce` label _prohibits_ the creation of any Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce

示例：`pod-security.kubernetes.io/enforce: baseline`

用于：Namespace

此标签的值**必须**是 `privileged`、`baseline`、`restricted` 之一，对应
[Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)中定义的级别。
具体而言，被此标签标记的命名空间下，任何创建不满足安全要求的 Pod 的请求都会被都会被 _禁止_。

更多信息请查阅[执行命名空间级别的 Pod 安全性设置](/zh/docs/concepts/security/pod-security-admission)。

<!--
### pod-security.kubernetes.io/enforce-version

Example: `pod-security.kubernetes.io/enforce-version: {{< skew latestVersion >}}`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce-version

示例：`pod-security.kubernetes.io/enforce-version: {{< skew latestVersion >}}`

用于：Namespace

此标签的值**必须**是 `latest` 或一个以 `v<MAJOR>.<MINOR>` 格式表示的有效的 Kubernets 版本号。
此标签决定了验证 Pod 时所使用的 [Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)策略的版本。

更多信息请查阅[执行命名空间级别的 Pod 安全性设置](/zh/docs/concepts/security/pod-security-admission)。

<!--
### pod-security.kubernetes.io/audit

Example: `pod-security.kubernetes.io/audit: baseline`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `audit` label does not prevent the creation of a Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level, but adds an audit annotation to that Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit

示例：`pod-security.kubernetes.io/audit: baseline`

用于：Namespace

此标签的值**必须**是 `privileged`、`baseline`、`restricted` 之一，对应
[Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)中定义的级别。
具体而言，此标签不会阻止不满足安全性要求的 Pod 的创建，但会在那些 Pod 中添加审计（Audit）注解。

更多信息请查阅[执行命名空间级别的 Pod 安全性设置](/zh/docs/concepts/security/pod-security-admission)。

<!--
### pod-security.kubernetes.io/audit-version

Example: `pod-security.kubernetes.io/audit-version: {{< skew latestVersion >}}`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit-version

示例：`pod-security.kubernetes.io/audit-version: {{< skew latestVersion >}}`

用于：Namespace

此标签的值**必须**是 `latest` 或一个以 `v<MAJOR>.<MINOR>` 格式表示的有效的 Kubernets 版本号。
此标签决定了验证 Pod 时所使用的 [Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)策略的版本。

更多信息请查阅[执行命名空间级别的 Pod 安全性设置](/zh/docs/concepts/security/pod-security-admission)。

<!--
### pod-security.kubernetes.io/warn

Example: `pod-security.kubernetes.io/warn: baseline`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `warn` label does not prevent the creation of a Pod in the labeled Namespace which does not meet the
requirements outlined in the indicated level, but returns a warning to the user after doing so.
Note that warnings are also displayed when creating or updating objects that contain Pod templates,
such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn

示例：`pod-security.kubernetes.io/warn: baseline`

用于：Namespace

此标签的值**必须**是 `privileged`、`baseline`、`restricted` 之一，对应
[Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)中定义的级别。
具体而言，此标签不会阻止不满足安全性要求的 Pod 的创建，但会返回给用户一个警告。
注意在创建或更新包含 Pod 模板的对象（例如 Deployment、Job、StatefulSet 等）时，也会显示该警告。

更多信息请查阅[执行命名空间级别的 Pod 安全性设置](/zh/docs/concepts/security/pod-security-admission)。

<!--
### pod-security.kubernetes.io/warn-version

Example: `pod-security.kubernetes.io/warn-version: {{< skew latestVersion >}}`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod. Note that warnings are also displayed when creating
or updating objects that contain Pod templates, such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn-version

示例：`pod-security.kubernetes.io/warn-version: {{< skew latestVersion >}}`

用于：Namespace

此标签的值**必须**是 `latest` 或一个以 `v<MAJOR>.<MINOR>` 格式表示的有效的 Kubernets 版本号。
此标签决定了验证 Pod 时所使用的 [Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)策略的版本。
注意在创建或更新包含 Pod 模板的对象（例如 Deployment、Job、StatefulSet 等）时，也会显示该警告。

更多信息请查阅[执行命名空间级别的 Pod 安全性设置](/zh/docs/concepts/security/pod-security-admission)。

<!--
### seccomp.security.alpha.kubernetes.io/pod (deprecated) {#seccomp-security-alpha-kubernetes-io-pod}

This annotation has been deprecated since Kubernetes v1.19 and will become non-functional in v1.25.
To specify security settings for a Pod, include the `securityContext` field in the Pod specification.
The [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) field within a Pod's `.spec` defines pod-level security attributes.
When you [specify the security context for a Pod](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod),
the settings you specify apply to all containers in that Pod.
-->
### seccomp.security.alpha.kubernetes.io/pod (已弃用) {#seccomp-security-alpha-kubernetes-io-pod}

此注解已于 Kubernetes v1.19 起被弃用，且将于 v1.25 失效。
要为 Pod 设定具体的安全设置，请在 Pod 规约中加入 `securityContext` 字段。
Pod 的 [`.spec.securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
字段定义了 Pod 级别的安全属性。
当你[为 Pod 设置安全性上下文](/zh/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)时，
你设定的配置会被应用到该 Pod 的所有容器中。

<!--
### container.seccomp.security.alpha.kubernetes.io/[NAME] (deprecated) {#container-seccomp-security-alpha-kubernetes-io}

This annotation has been deprecated since Kubernetes v1.19 and will become non-functional in v1.25.
The tutorial [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) takes
you through the steps you follow to apply a seccomp profile to a Pod or to one of
its containers. That tutorial covers the supported mechanism for configuring seccomp in Kubernetes,
based on setting `securityContext` within the Pod's `.spec`.
-->
### container.seccomp.security.alpha.kubernetes.io/[NAME]（已弃用）{#container-seccomp-security-alpha-kubernetes-io}

此注解已于 Kubernetes v1.19 起被弃用，且将于 v1.25 失效。
[使用 seccomp 限制容器的系统调用](/zh/docs/tutorials/security/seccomp/)教程会指导你完成对
Pod 或其中的一个容器应用 seccomp 配置文件的全部流程。
该教程涵盖了 Kubernetes 所支持的配置 seccomp 的机制，此机制基于 Pod 的 `.spec.securityContext`。

<!--
## Annotations used for audit

- [`pod-security.kubernetes.io/exempt`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)
- [`pod-security.kubernetes.io/enforce-policy`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/audit-violations`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)

See more details on the [Audit Annotations](/docs/reference/labels-annotations-taints/audit-annotations/) page.
-->
## 用于审计的注解

- [`pod-security.kubernetes.io/exempt`](/zh/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)
- [`pod-security.kubernetes.io/enforce-policy`](/zh/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/audit-violations`](/zh/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)

更多细节请参阅[审计注解](/zh/docs/reference/labels-annotations-taints/audit-annotations/)。