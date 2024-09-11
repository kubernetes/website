---
title: 设备插件
description: > 
  设备插件可以让你配置集群以支持需要特定于供应商设置的设备或资源，例如 GPU、NIC、FPGA 或非易失性主存储器。
content_type: concept
weight: 20
---
<!--
title: Device Plugins
description: >
  Device plugins let you configure your cluster with support for devices or resources that require
  vendor-specific setup, such as GPUs, NICs, FPGAs, or non-volatile main memory.
content_type: concept
weight: 20
-->

<!-- overview -->
{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
Kubernetes provides a device plugin framework that you can use to advertise system hardware
resources to the {{< glossary_tooltip term_id="kubelet" >}}.

Instead of customizing the code for Kubernetes itself, vendors can implement a
device plugin that you deploy either manually or as a {{< glossary_tooltip term_id="daemonset" >}}.
The targeted devices include GPUs, high-performance NICs, FPGAs, InfiniBand adapters,
and other similar computing resources that may require vendor specific initialization
and setup.
-->
Kubernetes 提供了一个设备插件框架，你可以用它来将系统硬件资源发布到
{{< glossary_tooltip term_id="kubelet" >}}。

供应商可以实现设备插件，由你手动部署或作为 {{< glossary_tooltip term_id="daemonset" >}}
来部署，而不必定制 Kubernetes 本身的代码。目标设备包括 GPU、高性能 NIC、FPGA、
InfiniBand 适配器以及其他类似的、可能需要特定于供应商的初始化和设置的计算资源。

<!-- body -->

<!--
## Device plugin registration
-->
## 注册设备插件    {#device-plugin-registration}

<!--
The kubelet exports a `Registration` gRPC service:
-->
`kubelet` 提供了一个 `Registration` 的 gRPC 服务：

```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```

<!--
A device plugin can register itself with the kubelet through this gRPC service.
During the registration, the device plugin needs to send:

* The name of its Unix socket.
* The Device Plugin API version against which it was built.
* The `ResourceName` it wants to advertise. Here `ResourceName` needs to follow the
  [extended resource naming scheme](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
  as `vendor-domain/resourcetype`.
  (For example, an NVIDIA GPU is advertised as `nvidia.com/gpu`.)

Following a successful registration, the device plugin sends the kubelet the
list of devices it manages, and the kubelet is then in charge of advertising those
resources to the API server as part of the kubelet node status update.
For example, after a device plugin registers `hardware-vendor.example/foo` with the kubelet
and reports two healthy devices on a node, the node status is updated
to advertise that the node has 2 "Foo" devices installed and available.
-->
设备插件可以通过此 gRPC 服务在 kubelet 进行注册。在注册期间，设备插件需要发送下面几样内容：

* 设备插件的 UNIX 套接字。
* 设备插件的 API 版本。
* `ResourceName` 是需要公布的。这里 `ResourceName`
  需要遵循[扩展资源命名方案](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)，
  类似于 `vendor-domain/resourcetype`。（比如 NVIDIA GPU 就被公布为 `nvidia.com/gpu`。）

成功注册后，设备插件就向 kubelet 发送它所管理的设备列表，然后 kubelet
负责将这些资源发布到 API 服务器，作为 kubelet 节点状态更新的一部分。

比如，设备插件在 kubelet 中注册了 `hardware-vendor.example/foo`
并报告了节点上的两个运行状况良好的设备后，节点状态将更新以通告该节点已安装 2 个
"Foo" 设备并且是可用的。

<!--
Then, users can request devices as part of a Pod specification
(see [`container`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)).
Requesting extended resources is similar to how you manage requests and limits for
other resources, with the following differences:
* Extended resources are only supported as integer resources and cannot be overcommitted.
* Devices cannot be shared between containers.
-->
然后，用户可以请求设备作为 Pod 规范的一部分，
参见 [Container](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)。
请求扩展资源类似于管理请求和限制的方式，
其他资源，有以下区别：

* 扩展资源仅可作为整数资源使用，并且不能被过量使用
* 设备不能在容器之间共享

<!--
### Example {#example-pod}
-->
### 示例 {#example-pod}

<!--
Suppose a Kubernetes cluster is running a device plugin that advertises resource `hardware-vendor.example/foo`
on certain nodes. Here is an example of a pod requesting this resource to run a demo workload:
-->
假设 Kubernetes 集群正在运行一个设备插件，该插件在一些节点上公布的资源为 `hardware-vendor.example/foo`。
下面就是一个 Pod 示例，请求此资源以运行一个工作负载的示例：

<!--
#
# This Pod needs 2 of the hardware-vendor.example/foo devices
# and can only schedule onto a Node that's able to satisfy
# that need.
#
# If the Node has more than 2 of those devices available, the
# remainder would be available for other Pods to use.
-->
```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: demo-pod
spec:
  containers:
    - name: demo-container-1
      image: registry.k8s.io/pause:2.0
      resources:
        limits:
          hardware-vendor.example/foo: 2
#
# 这个 Pod 需要两个 hardware-vendor.example/foo 设备
# 而且只能够调度到满足需求的节点上
#
# 如果该节点中有 2 个以上的设备可用，其余的可供其他 Pod 使用
```

<!--
## Device plugin implementation

The general workflow of a device plugin includes the following steps:

1. Initialization. During this phase, the device plugin performs vendor-specific
   initialization and setup to make sure the devices are in a ready state.

1. The plugin starts a gRPC service, with a Unix socket under the host path
   `/var/lib/kubelet/device-plugins/`, that implements the following interfaces:
-->
## 设备插件的实现    {#device-plugin-implementation}

设备插件的常规工作流程包括以下几个步骤：

1. 初始化。在这个阶段，设备插件将执行特定于供应商的初始化和设置，以确保设备处于就绪状态。

2. 插件使用主机路径 `/var/lib/kubelet/device-plugins/` 下的 UNIX 套接字启动一个
   gRPC 服务，该服务实现以下接口：

   <!--
   ```gRPC
   service DevicePlugin {
         // GetDevicePluginOptions returns options to be communicated with Device Manager.
         rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

         // ListAndWatch returns a stream of List of Devices
         // Whenever a Device state change or a Device disappears, ListAndWatch
         // returns the new list
         rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

         // Allocate is called during container creation so that the Device
         // Plugin can run device specific operations and instruct Kubelet
         // of the steps to make the Device available in the container
         rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

         // GetPreferredAllocation returns a preferred set of devices to allocate
         // from a list of available ones. The resulting preferred allocation is not
         // guaranteed to be the allocation ultimately performed by the
         // devicemanager. It is only designed to help the devicemanager make a more
         // informed allocation decision when possible.
         rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

         // PreStartContainer is called, if indicated by Device Plugin during registeration phase,
         // before each container start. Device plugin can run device specific operations
         // such as resetting the device before making devices available to the container.
         rpc PreStartContainer(PreStartContainerRequest) returns (PreStartContainerResponse) {}
   }
   ```
   -->
   ```gRPC
   service DevicePlugin {
         // GetDevicePluginOptions 返回与设备管理器沟通的选项。
         rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

         // ListAndWatch 返回 Device 列表构成的数据流。
         // 当 Device 状态发生变化或者 Device 消失时，ListAndWatch
         // 会返回新的列表。
         rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

         // Allocate 在容器创建期间调用，这样设备插件可以运行一些特定于设备的操作，
         // 并告诉 kubelet 如何令 Device 可在容器中访问的所需执行的具体步骤
         rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

         // GetPreferredAllocation 从一组可用的设备中返回一些优选的设备用来分配，
         // 所返回的优选分配结果不一定会是设备管理器的最终分配方案。
         // 此接口的设计仅是为了让设备管理器能够在可能的情况下做出更有意义的决定。
         rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

         // PreStartContainer 在设备插件注册阶段根据需要被调用，调用发生在容器启动之前。
         // 在将设备提供给容器使用之前，设备插件可以运行一些诸如重置设备之类的特定于
         // 具体设备的操作，
         rpc PreStartContainer(PreStartContainerRequest) returns (PreStartContainerResponse) {}
   }
   ```

   {{< note >}}
   <!--
   Plugins are not required to provide useful implementations for
   `GetPreferredAllocation()` or `PreStartContainer()`. Flags indicating
   the availability of these calls, if any, should be set in the `DevicePluginOptions`
   message sent back by a call to `GetDevicePluginOptions()`. The `kubelet` will
   always call `GetDevicePluginOptions()` to see which optional functions are
   available, before calling any of them directly.
   -->
   插件并非必须为 `GetPreferredAllocation()` 或 `PreStartContainer()` 提供有用的实现逻辑，
   调用 `GetDevicePluginOptions()` 时所返回的 `DevicePluginOptions`
   消息中应该设置一些标志，表明这些调用（如果有）是否可用。`kubelet` 在直接调用这些函数之前，总会调用
   `GetDevicePluginOptions()` 来查看哪些可选的函数可用。
   {{< /note >}}

<!--
1. The plugin registers itself with the kubelet through the Unix socket at host
   path `/var/lib/kubelet/device-plugins/kubelet.sock`.
-->
3. 插件通过位于主机路径 `/var/lib/kubelet/device-plugins/kubelet.sock` 下的 UNIX
   套接字向 kubelet 注册自身。

   {{< note >}}
   <!--
   The ordering of the workflow is important. A plugin MUST start serving gRPC
   service before registering itself with kubelet for successful registration.
   -->
   工作流程的顺序很重要。插件必须在向 kubelet 注册自己之前开始提供 gRPC 服务，才能保证注册成功。
   {{< /note >}}

<!--
1. After successfully registering itself, the device plugin runs in serving mode, during which it keeps
   monitoring device health and reports back to the kubelet upon any device state changes.
   It is also responsible for serving `Allocate` gRPC requests. During `Allocate`, the device plugin may
   do device-specific preparation; for example, GPU cleanup or QRNG initialization.
   If the operations succeed, the device plugin returns an `AllocateResponse` that contains container
   runtime configurations for accessing the allocated devices. The kubelet passes this information
   to the container runtime.
-->
4. 成功注册自身后，设备插件将以提供服务的模式运行，在此期间，它将持续监控设备运行状况，
   并在设备状态发生任何变化时向 kubelet 报告。它还负责响应 `Allocate` gRPC 请求。
   在 `Allocate` 期间，设备插件可能还会做一些特定于设备的准备；例如 GPU 清理或 QRNG 初始化。
   如果操作成功，则设备插件将返回 `AllocateResponse`，其中包含用于访问被分配的设备容器运行时的配置。
   kubelet 将此信息传递到容器运行时。

   <!--
   An `AllocateResponse` contains zero or more `ContainerAllocateResponse` objects. In these, the
   device plugin defines modifications that must be made to a container's definition to provide
   access to the device. These modifications include:
   -->
   `AllocateResponse` 包含零个或多个 `ContainerAllocateResponse` 对象。
   设备插件在这些对象中给出为了访问设备而必须对容器定义所进行的修改。
   这些修改包括：

   <!--
   * [Annotations](/docs/concepts/overview/working-with-objects/annotations/)
   * device nodes
   * environment variables
   * mounts
   * fully-qualified CDI device names
   -->
   * [注解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)
   * 设备节点
   * 环境变量
   * 挂载点
   * 完全限定的 CDI 设备名称

   {{< note >}}
   <!--
   The processing of the fully-qualified CDI device names by the Device Manager requires
   that the `DevicePluginCDIDevices` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
   is enabled for both the kubelet and the kube-apiserver. This was added as an alpha feature in Kubernetes
   v1.28, graduated to beta in v1.29 and to GA in v1.31.
   -->
   设备管理器处理完全限定的 CDI 设备名称时，
   需要为 kubelet 和 kube-apiserver 启用 `DevicePluginCDIDevices`
   [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
   在 Kubernetes v1.28 版本中作为 Alpha 特性被加入，在 v1.29 版本中升级为 Beta 特性并在
   v1.31 版本升级为稳定可用特性。
   {{< /note >}}

<!--
### Handling kubelet restarts

A device plugin is expected to detect kubelet restarts and re-register itself with the new
kubelet instance. A new kubelet instance deletes all the existing Unix sockets under
`/var/lib/kubelet/device-plugins` when it starts. A device plugin can monitor the deletion
of its Unix socket and re-register itself upon such an event.
-->
### 处理 kubelet 重启   {#handling-kubelet-restarts}

设备插件应能监测到 kubelet 重启，并且向新的 kubelet 实例来重新注册自己。
新的 kubelet 实例启动时会删除 `/var/lib/kubelet/device-plugins` 下所有已经存在的 UNIX 套接字。
设备插件需要能够监控到它的 UNIX 套接字被删除，并且当发生此类事件时重新注册自己。

<!--
### Device plugin and unhealthy devices

There are cases when devices fail or are shut down. The responsibility of the Device Plugin
in this case is to notify the kubelet about the situation using the `ListAndWatchResponse` API.
-->
### 设备插件和不健康的设备

有时会发生设备出现故障或者被关闭的情况，这时，设备插件的职责是使用
`ListAndWatch Response` API 将相关情况通报给 kubelet。

<!--
Once a device is marked as unhealthy, the kubelet will decrease the allocatable count
for this resource on the Node to reflect how many devices can be used for scheduling new pods.
Capacity count for the resource will not change.
-->
一旦设备被标记为不健康，kubelet 将减少节点上此资源的可分配数量，
以反映有多少设备可用于调度新的 Pod，资源的容量数量不会因此发生改变。

<!--
Pods that were assigned to the failed devices will continue be assigned to this device.
It is typical that code relying on the device will start failing and Pod may get
into Failed phase if `restartPolicy` for the Pod was not `Always` or enter the crash loop
otherwise.
-->
分配给故障设备的 Pod 将继续分配给该设备。
通常情况下，依赖于设备的代码将开始失败，如果 Pod 的 `restartPolicy` 不是
`Always`，则 Pod 可能会进入 Failed 阶段，否则会进入崩溃循环。

<!--
Before Kubernetes v1.31, the way to know whether or not a Pod is associated with the
failed device is to use the [PodResources API](#monitoring-device-plugin-resources).
-->
在 Kubernetes v1.31 之前，要知道 Pod 是否与故障设备关联，
可以使用 [PodResources API](#monitoring-device-plugin-resources)。

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

<!--
By enabling the feature gate `ResourceHealthStatus`, the field `allocatedResourcesStatus`
will be added to each container status, within the `.status` for each Pod. The `allocatedResourcesStatus`
field
reports health information for each device assigned to the container.
-->
通过启用特性门控 `ResourceHealthStatus`，系统将在每个 Pod 的
`.status` 字段中的每个容器状态内添加 `allocatedResourcesStatus` 字段，
`allocatedResourcesStatus` 字段报告分配给容器的每个设备的健康信息。

<!--
For a failed Pod, or or where you suspect a fault, you can use this status to understand whether
the Pod behavior may be associated with device failure. For example, if an accelerator is reporting
an over-temperature event, the `allocatedResourcesStatus` field may be able to report this.
-->
对于发生故障的 Pod，或者你怀疑存在故障的情况，你可以使用此状态来了解
Pod 行为是否可能与设备故障有关。例如，如果加速器报告过热事件，
则 `allocatedResourcesStatus` 字段可能能够报告此情况。

<!--
## Device plugin deployment

You can deploy a device plugin as a DaemonSet, as a package for your node's operating system,
or manually.

The canonical directory `/var/lib/kubelet/device-plugins` requires privileged access,
so a device plugin must run in a privileged security context.
If you're deploying a device plugin as a DaemonSet, `/var/lib/kubelet/device-plugins`
must be mounted as a {{< glossary_tooltip term_id="volume" >}}
in the plugin's [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

If you choose the DaemonSet approach you can rely on Kubernetes to: place the device plugin's
Pod onto Nodes, to restart the daemon Pod after failure, and to help automate upgrades.
-->
## 设备插件部署   {#device-plugin-deployment}

你可以将你的设备插件作为节点操作系统的软件包来部署、作为 DaemonSet 来部署或者手动部署。

规范目录 `/var/lib/kubelet/device-plugins` 是需要特权访问的，
所以设备插件必须要在被授权的安全的上下文中运行。
如果你将设备插件部署为 DaemonSet，`/var/lib/kubelet/device-plugins` 目录必须要在插件的
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中声明作为 {{< glossary_tooltip term_id="volume" >}} 被挂载到插件中。

如果你选择 DaemonSet 方法，你可以通过 Kubernetes 进行以下操作：
将设备插件的 Pod 放置在节点上，在出现故障后重新启动守护进程 Pod，来进行自动升级。

<!--
## API compatibility

Previously, the versioning scheme required the Device Plugin's API version to match
exactly the Kubelet's version. Since the graduation of this feature to Beta in v1.12
this is no longer a hard requirement. The API is versioned and has been stable since
Beta graduation of this feature. Because of this, kubelet upgrades should be seamless
but there still may be changes in the API before stabilization making upgrades not
guaranteed to be non-breaking.
-->
## API 兼容性   {#api-compatibility}

之前版本控制方案要求设备插件的 API 版本与 kubelet 的版本完全匹配。
自从此特性在 v1.12 中进阶为 Beta 后，这不再是硬性要求。
API 是版本化的，并且自此特性进阶 Beta 后一直表现稳定。
因此，kubelet 升级应该是无缝的，但在稳定之前 API 仍然可能会有变更，还不能保证升级不会中断。

{{< note >}}
<!--
Although the Device Manager component of Kubernetes is a generally available feature,
the _device plugin API_ is not stable. For information on the device plugin API and
version compatibility, read [Device Plugin API versions](/docs/reference/node/device-plugin-api-versions/).
-->
尽管 Kubernetes 的设备管理器（Device Manager）组件是正式发布的特性，
但**设备插件 API** 还不稳定。有关设备插件 API 和版本兼容性的信息，
请参阅[设备插件 API 版本](/zh-cn/docs/reference/node/device-plugin-api-versions/)。
{{< /note >}}

<!--
As a project, Kubernetes recommends that device plugin developers:

* Watch for Device Plugin API changes in the future releases.
* Support multiple versions of the device plugin API for backward/forward compatibility.
-->
作为一个项目，Kubernetes 建议设备插件开发者：

* 注意未来版本中设备插件 API 的变更。
* 支持多个版本的设备插件 API，以实现向后/向前兼容性。

<!--
To run device plugins on nodes that need to be upgraded to a Kubernetes release with
a newer device plugin API version, upgrade your device plugins to support both versions
before upgrading these nodes. Taking that approach will ensure the continuous functioning
of the device allocations during the upgrade.
-->
若在需要升级到具有较新设备插件 API 版本的某个 Kubernetes 版本的节点上运行这些设备插件，
请在升级这些节点之前先升级设备插件以支持这两个版本。
采用该方法将确保升级期间设备分配的连续运行。

<!--
## Monitoring device plugin resources
-->
## 监控设备插件资源   {#monitoring-device-plugin-resources}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
In order to monitor resources provided by device plugins, monitoring agents need to be able to
discover the set of devices that are in-use on the node and obtain metadata to describe which
container the metric should be associated with. [Prometheus](https://prometheus.io/) metrics
exposed by device monitoring agents should follow the
[Kubernetes Instrumentation Guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md),
identifying containers using `pod`, `namespace`, and `container` prometheus labels.
-->
为了监控设备插件提供的资源，监控代理程序需要能够发现节点上正在使用的设备，
并获取元数据来描述哪个指标与容器相关联。
设备监控代理暴露给 [Prometheus](https://prometheus.io/) 的指标应该遵循
[Kubernetes Instrumentation Guidelines（英文）](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md)，
使用 `pod`、`namespace` 和 `container` 标签来标识容器。

<!--
The kubelet provides a gRPC service to enable discovery of in-use devices, and to provide metadata
for these devices:

```gRPC
// PodResourcesLister is a service provided by the kubelet that provides information about the
// node resources consumed by pods and containers on the node
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
    rpc Get(GetPodResourcesRequest) returns (GetPodResourcesResponse) {}
}
```
-->
kubelet 提供了 gRPC 服务来使得正在使用中的设备被发现，并且还为这些设备提供了元数据：

```gRPC
// PodResourcesLister 是一个由 kubelet 提供的服务，用来提供供节点上
// Pod 和容器使用的节点资源的信息
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
    rpc Get(GetPodResourcesRequest) returns (GetPodResourcesResponse) {}
}
```

<!--
### `List` gRPC endpoint {#grpc-endpoint-list}
-->
### `List` gRPC 端点 {#grpc-endpoint-list}

<!--
The `List` endpoint provides information on resources of running pods, with details such as the
id of exclusively allocated CPUs, device id as it was reported by device plugins and id of
the NUMA node where these devices are allocated. Also, for NUMA-based machines, it contains the
information about memory and hugepages reserved for a container.
-->
这一 `List` 端点提供运行中 Pod 的资源信息，包括类似独占式分配的
CPU ID、设备插件所报告的设备 ID 以及这些设备分配所处的 NUMA 节点 ID。
此外，对于基于 NUMA 的机器，它还会包含为容器保留的内存和大页的信息。

<!--
Starting from Kubernetes v1.27, the `List` endpoint can provide information on resources
of running pods allocated in `ResourceClaims` by the `DynamicResourceAllocation` API. To enable
this feature `kubelet` must be started with the following flags:
-->
从 Kubernetes v1.27 开始，`List` 端点可以通过 `DynamicResourceAllocation` API 提供在
`ResourceClaims` 中分配的当前运行 Pod 的资源信息。
要启用此特性，必须使用以下标志启动 `kubelet`：

```
--feature-gates=DynamicResourceAllocation=true,KubeletPodResourcesDynamicResources=true
```

<!--
```gRPC
// ListPodResourcesResponse is the response returned by List function
message ListPodResourcesResponse {
    repeated PodResources pod_resources = 1;
}

// PodResources contains information about the node resources assigned to a pod
message PodResources {
    string name = 1;
    string namespace = 2;
    repeated ContainerResources containers = 3;
}

// ContainerResources contains information about the resources assigned to a container
message ContainerResources {
    string name = 1;
    repeated ContainerDevices devices = 2;
    repeated int64 cpu_ids = 3;
    repeated ContainerMemory memory = 4;
    repeated DynamicResource dynamic_resources = 5;
}

// ContainerMemory contains information about memory and hugepages assigned to a container
message ContainerMemory {
    string memory_type = 1;
    uint64 size = 2;
    TopologyInfo topology = 3;
}

// Topology describes hardware topology of the resource
message TopologyInfo {
        repeated NUMANode nodes = 1;
}

// NUMA representation of NUMA node
message NUMANode {
        int64 ID = 1;
}

// ContainerDevices contains information about the devices assigned to a container
message ContainerDevices {
    string resource_name = 1;
    repeated string device_ids = 2;
    TopologyInfo topology = 3;
}

// DynamicResource contains information about the devices assigned to a container by Dynamic Resource Allocation
message DynamicResource {
    string class_name = 1;
    string claim_name = 2;
    string claim_namespace = 3;
    repeated ClaimResource claim_resources = 4;
}

// ClaimResource contains per-plugin resource information
message ClaimResource {
    repeated CDIDevice cdi_devices = 1 [(gogoproto.customname) = "CDIDevices"];
}

// CDIDevice specifies a CDI device information
message CDIDevice {
    // Fully qualified CDI device name
    // for example: vendor.com/gpu=gpudevice1
    // see more details in the CDI specification:
    // https://github.com/container-orchestrated-devices/container-device-interface/blob/main/SPEC.md
    string name = 1;
}
```
-->
```gRPC
// ListPodResourcesResponse 是 List 函数的响应
message ListPodResourcesResponse {
    repeated PodResources pod_resources = 1;
}

// PodResources 包含关于分配给 Pod 的节点资源的信息
message PodResources {
    string name = 1;
    string namespace = 2;
    repeated ContainerResources containers = 3;
}

// ContainerResources 包含分配给容器的资源的信息
message ContainerResources {
    string name = 1;
    repeated ContainerDevices devices = 2;
    repeated int64 cpu_ids = 3;
    repeated ContainerMemory memory = 4;
    repeated DynamicResource dynamic_resources = 5;
}

// ContainerMemory 包含分配给容器的内存和大页信息
message ContainerMemory {
    string memory_type = 1;
    uint64 size = 2;
    TopologyInfo topology = 3;
}

// Topology 描述资源的硬件拓扑结构
message TopologyInfo {
        repeated NUMANode nodes = 1;
}

// NUMA 代表的是 NUMA 节点
message NUMANode {
        int64 ID = 1;
}

// ContainerDevices 包含分配给容器的设备信息
message ContainerDevices {
    string resource_name = 1;
    repeated string device_ids = 2;
    TopologyInfo topology = 3;
}

// DynamicResource 包含通过 Dynamic Resource Allocation 分配到容器的设备信息
message DynamicResource {
    string class_name = 1;
    string claim_name = 2;
    string claim_namespace = 3;
    repeated ClaimResource claim_resources = 4;
}

// ClaimResource 包含每个插件的资源信息
message ClaimResource {
    repeated CDIDevice cdi_devices = 1 [(gogoproto.customname) = "CDIDevices"];
}

// CDIDevice 指定 CDI 设备信息
message CDIDevice {
    // 完全合格的 CDI 设备名称
    // 例如：vendor.com/gpu=gpudevice1
    // 参阅 CDI 规范中的更多细节：
    // https://github.com/container-orchestrated-devices/container-device-interface/blob/main/SPEC.md
    string name = 1;
}
```

{{< note >}}
<!--
cpu_ids in the `ContainerResources` in the `List` endpoint correspond to exclusive CPUs allocated
to a particular container. If the goal is to evaluate CPUs that belong to the shared pool, the `List`
endpoint needs to be used in conjunction with the `GetAllocatableResources` endpoint as explained
below:
1. Call `GetAllocatableResources` to get a list of all the allocatable CPUs
2. Call `GetCpuIds` on all `ContainerResources` in the system
3. Subtract out all of the CPUs from the `GetCpuIds` calls from the `GetAllocatableResources` call
-->
`List` 端点中的 `ContainerResources` 中的 cpu_ids 对应于分配给某个容器的专属 CPU。
如果要统计共享池中的 CPU，`List` 端点需要与 `GetAllocatableResources` 端点一起使用，如下所述：

1. 调用 `GetAllocatableResources` 获取所有可用的 CPU。
2. 在系统中所有的 `ContainerResources` 上调用 `GetCpuIds`。
3. 用 `GetAllocatableResources` 获取的 CPU 数减去 `GetCpuIds` 获取的 CPU 数。
{{< /note >}}

<!--
### `GetAllocatableResources` gRPC endpoint {#grpc-endpoint-getallocatableresources}
-->
### `GetAllocatableResources` gRPC 端点 {#grpc-endpoint-getallocatableresources}

{{< feature-state state="stable" for_k8s_version="v1.28" >}}

<!--
GetAllocatableResources provides information on resources initially available on the worker node.
It provides more information than kubelet exports to APIServer.
-->
端点 `GetAllocatableResources` 提供工作节点上原始可用的资源信息。
此端点所提供的信息比导出给 API 服务器的信息更丰富。

{{< note >}}
<!--
`GetAllocatableResources` should only be used to evaluate [allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
resources on a node. If the goal is to evaluate free/unallocated resources it should be used in
conjunction with the List() endpoint. The result obtained by `GetAllocatableResources` would remain
the same unless the underlying resources exposed to kubelet change. This happens rarely but when
it does (for example: hotplug/hotunplug, device health changes), client is expected to call
`GetAlloctableResources` endpoint.

However, calling `GetAllocatableResources` endpoint is not sufficient in case of cpu and/or memory
update and Kubelet needs to be restarted to reflect the correct resource capacity and allocatable.
-->
`GetAllocatableResources` 应该仅被用于评估一个节点上的[可分配的](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)资源。
如果目标是评估空闲/未分配的资源，此调用应该与 `List()` 端点一起使用。
除非暴露给 kubelet 的底层资源发生变化，否则 `GetAllocatableResources` 得到的结果将保持不变。
这种情况很少发生，但当发生时（例如：热插拔，设备健康状况改变），客户端应该调用 `GetAlloctableResources` 端点。

然而，调用 `GetAllocatableResources` 端点在 CPU、内存被更新的情况下是不够的，
kubelet 需要重新启动以获取正确的资源容量和可分配的资源。
{{< /note >}}

```gRPC
// AllocatableResourcesResponses 包含 kubelet 所了解到的所有设备的信息
message AllocatableResourcesResponse {
    repeated ContainerDevices devices = 1;
    repeated int64 cpu_ids = 2;
    repeated ContainerMemory memory = 3;
}
```

<!--
`ContainerDevices` do expose the topology information declaring to which NUMA cells the device is
affine. The NUMA cells are identified using a opaque integer ID, which value is consistent to
what device plugins report
[when they register themselves to the kubelet](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).
-->
`ContainerDevices` 会向外提供各个设备所隶属的 NUMA 单元这类拓扑信息。
NUMA 单元通过一个整数 ID 来标识，其取值与设备插件所报告的一致。
[设备插件注册到 kubelet 时](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
会报告这类信息。

<!--
The gRPC service is served over a unix socket at `/var/lib/kubelet/pod-resources/kubelet.sock`.
Monitoring agents for device plugin resources can be deployed as a daemon, or as a DaemonSet.
The canonical directory `/var/lib/kubelet/pod-resources` requires privileged access, so monitoring
agents must run in a privileged security context. If a device monitoring agent is running as a
DaemonSet, `/var/lib/kubelet/pod-resources` must be mounted as a
{{< glossary_tooltip term_id="volume" >}} in the device monitoring agent's
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).
-->
gRPC 服务通过 `/var/lib/kubelet/pod-resources/kubelet.sock` 的 UNIX 套接字来提供服务。
设备插件资源的监控代理程序可以部署为守护进程或者 DaemonSet。
规范的路径 `/var/lib/kubelet/pod-resources` 需要特权来进入，
所以监控代理程序必须要在获得授权的安全的上下文中运行。
如果设备监控代理以 DaemonSet 形式运行，必须要在插件的
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中声明将 `/var/lib/kubelet/pod-resources`
目录以{{< glossary_tooltip text="卷" term_id="volume" >}}的形式被挂载到设备监控代理中。

{{< note >}}

<!--
When accessing the `/var/lib/kubelet/pod-resources/kubelet.sock` from DaemonSet
or any other app deployed as a container on the host, which is mounting socket as
a volume, it is a good practice to mount directory `/var/lib/kubelet/pod-resources/`
instead of the `/var/lib/kubelet/pod-resources/kubelet.sock`. This will ensure
that after kubelet restart, container will be able to re-connect to this socket.
-->
在从 DaemonSet 或以容器形式部署在主机上的任何其他应用中访问
`/var/lib/kubelet/pod-resources/kubelet.sock` 时，
如果将套接字作为卷挂载，最好的做法是挂载目录 `/var/lib/kubelet/pod-resources/`
而不是 `/var/lib/kubelet/pod-resources/kubelet.sock`。
这样可以确保在 kubelet 重新启动后，容器将能够重新连接到此套接字。

<!--
Container mounts are managed by inode referencing the socket or directory,
depending on what was mounted. When kubelet restarts, socket is deleted
and a new socket is created, while directory stays untouched.
So the original inode for the socket become unusable. Inode to directory
will continue working.
-->
容器挂载是通过引用套接字或目录的 inode 进行管理的，具体取决于挂载的内容。
当 kubelet 重新启动时，套接字会被删除并创建一个新的套接字，而目录则保持不变。
因此，针对原始套接字的 inode 将变得无法使用，而到目录的 inode 将继续正常工作。

{{< /note >}}

<!--
### `Get` gRPC endpoint {#grpc-endpoint-get}
-->
### `Get` gRPC 端点   {#grpc-endpoint-get}

{{< feature-state state="alpha" for_k8s_version="v1.27" >}}

<!--
The `Get` endpoint provides information on resources of a running Pod. It exposes information
similar to those described in the `List` endpoint. The `Get` endpoint requires `PodName`
and `PodNamespace` of the running Pod.
-->
`Get` 端点提供了当前运行 Pod 的资源信息。它会暴露与 `List` 端点中所述类似的信息。
`Get` 端点需要当前运行 Pod 的 `PodName` 和 `PodNamespace`。

<!--
```gRPC
// GetPodResourcesRequest contains information about the pod
message GetPodResourcesRequest {
    string pod_name = 1;
    string pod_namespace = 2;
}
```
-->
```gRPC
// GetPodResourcesRequest 包含 Pod 相关信息
message GetPodResourcesRequest {
    string pod_name = 1;
    string pod_namespace = 2;
}
```

<!--
To enable this feature, you must start your kubelet services with the following flag:
-->
要启用此特性，你必须使用以下标志启动 kubelet 服务：

```
--feature-gates=KubeletPodResourcesGet=true
```

<!--
The `Get` endpoint can provide Pod information related to dynamic resources
allocated by the dynamic resource allocation API. To enable this feature, you must
ensure your kubelet services are started with the following flags:
-->
`Get` 端点可以提供与动态资源分配 API 所分配的动态资源相关的 Pod 信息。
要启用此特性，你必须确保使用以下标志启动 kubelet 服务：

```
--feature-gates=KubeletPodResourcesGet=true,DynamicResourceAllocation=true,KubeletPodResourcesDynamicResources=true
```

<!--
## Device plugin integration with the Topology Manager
-->
## 设备插件与拓扑管理器的集成   {#device-plugin-integration-with-the-topology-manager}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

<!--
The Topology Manager is a Kubelet component that allows resources to be co-ordinated in a Topology
aligned manner. In order to do this, the Device Plugin API was extended to include a
`TopologyInfo` struct.
-->
拓扑管理器是 kubelet 的一个组件，它允许以拓扑对齐方式来调度资源。
为了做到这一点，设备插件 API 进行了扩展来包括一个 `TopologyInfo` 结构体。

```gRPC
message TopologyInfo {
    repeated NUMANode nodes = 1;
}

message NUMANode {
    int64 ID = 1;
}
```

<!--
Device Plugins that wish to leverage the Topology Manager can send back a populated TopologyInfo
struct as part of the device registration, along with the device IDs and the health of the device.
The device manager will then use this information to consult with the Topology Manager and make
resource assignment decisions.

`TopologyInfo` supports setting a `nodes` field to either `nil` or a list of NUMA nodes. This
allows the Device Plugin to advertise a device that spans multiple NUMA nodes.

Setting `TopologyInfo` to `nil` or providing an empty list of NUMA nodes for a given device
indicates that the Device Plugin does not have a NUMA affinity preference for that device.

An example `TopologyInfo` struct populated for a device by a Device Plugin:
-->
设备插件希望拓扑管理器可以将填充的 TopologyInfo 结构体作为设备注册的一部分以及设备 ID
和设备的运行状况发送回去。然后设备管理器将使用此信息来咨询拓扑管理器并做出资源分配决策。

`TopologyInfo` 支持将 `nodes` 字段设置为 `nil` 或一个 NUMA 节点的列表。
这样就可以使设备插件通告跨越多个 NUMA 节点的设备。

将 `TopologyInfo` 设置为 `nil` 或为给定设备提供一个空的
NUMA 节点列表表示设备插件没有该设备的 NUMA 亲和偏好。

下面是一个由设备插件为设备填充 `TopologyInfo` 结构体的示例：

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

<!--
## Device plugin examples {#examples}
-->
## 设备插件示例 {#examples}

{{% thirdparty-content %}}

<!--
Here are some examples of device plugin implementations:

* [Akri](https://github.com/project-akri/akri), which lets you easily expose heterogeneous leaf devices (such as IP cameras and USB devices).
* The [AMD GPU device plugin](https://github.com/ROCm/k8s-device-plugin)
* The [generic device plugin](https://github.com/squat/generic-device-plugin) for generic Linux devices and USB devices
* The [Intel device plugins](https://github.com/intel/intel-device-plugins-for-kubernetes) for
  Intel GPU, FPGA, QAT, VPU, SGX, DSA, DLB and IAA devices
* The [KubeVirt device plugins](https://github.com/kubevirt/kubernetes-device-plugins) for
  hardware-assisted virtualization
* The [NVIDIA GPU device plugin for Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* The [RDMA device plugin](https://github.com/hustcat/k8s-rdma-device-plugin)
* The [SocketCAN device plugin](https://github.com/collabora/k8s-socketcan)
* The [Solarflare device plugin](https://github.com/vikaschoudhary16/sfc-device-plugin)
* The [SR-IOV Network device plugin](https://github.com/intel/sriov-network-device-plugin)
* The [Xilinx FPGA device plugins](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin) for Xilinx FPGA devices
-->
下面是一些设备插件实现的示例：

* [Akri](https://github.com/project-akri/akri)，它可以让你轻松公开异构叶子设备（例如 IP 摄像机和 USB 设备）。
* [AMD GPU 设备插件](https://github.com/ROCm/k8s-device-plugin)
* 适用于通用 Linux 设备和 USB 设备的[通用设备插件](https://github.com/squat/generic-device-plugin)
* [Intel 设备插件](https://github.com/intel/intel-device-plugins-for-kubernetes)支持
  Intel GPU、FPGA、QAT、VPU、SGX、DSA、DLB 和 IAA 设备
* [KubeVirt 设备插件](https://github.com/kubevirt/kubernetes-device-plugins)用于硬件辅助的虚拟化
* [为 Container-Optimized OS 所提供的 NVIDIA GPU 设备插件](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [RDMA 设备插件](https://github.com/hustcat/k8s-rdma-device-plugin)
* [SocketCAN 设备插件](https://github.com/collabora/k8s-socketcan)
* [Solarflare 设备插件](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [SR-IOV 网络设备插件](https://github.com/intel/sriov-network-device-plugin)
* [Xilinx FPGA 设备插件](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin)

## {{% heading "whatsnext" %}}

<!--
* Learn about [scheduling GPU resources](/docs/tasks/manage-gpus/scheduling-gpus/) using device
  plugins
* Learn about [advertising extended resources](/docs/tasks/administer-cluster/extended-resource-node/)
  on a node
* Learn about the [Topology Manager](/docs/tasks/administer-cluster/topology-manager/)
* Read about using [hardware acceleration for TLS ingress](/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/)
  with Kubernetes
-->
* 查看[调度 GPU 资源](/zh-cn/docs/tasks/manage-gpus/scheduling-gpus/)来学习使用设备插件
* 查看在节点上如何[公布扩展资源](/zh-cn/docs/tasks/administer-cluster/extended-resource-node/)
* 学习[拓扑管理器](/zh-cn/docs/tasks/administer-cluster/topology-manager/)
* 阅读如何在 Kubernetes 中使用 [TLS Ingress 的硬件加速](/zh-cn/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/)
