---
title: 设备插件
description: 使用 Kubernetes 设备插件框架来实现适用于 GPU、NIC、FPGA、InfiniBand 以及类似的需要特定于供应商设置的资源的插件。
content_type: concept
weight: 20
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.10" state="beta" >}}

<!--
Kubernetes provides a [device plugin framework](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)
that you can use to advertise system hardware resources to the
{{< glossary_tooltip term_id="kubelet" >}}.

Instead of customizing the code for Kubernetes itself, vendors can implement a
device plugin that you deploy either manually or as a {{< glossary_tooltip term_id="daemonset" >}}.
The targeted devices include GPUs, high-performance NICs, FPGAs, InfiniBand adapters,
and other similar computing resources that may require vendor specific initialization
and setup.
-->
Kubernetes 提供了一个
[设备插件框架](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)，你可以用它来将系统硬件资源发布到 {{< glossary_tooltip term_id="kubelet" >}}。

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
  
* 设备插件的 Unix 套接字。
* 设备插件的 API 版本。
* `ResourceName` 是需要公布的。这里 `ResourceName` 需要遵循
  [扩展资源命名方案](/zh/docs/concepts/configuration/manage-resources-containers/#extended-resources)，
  类似于 `vendor-domain/resourcetype`。（比如 NVIDIA GPU 就被公布为 `nvidia.com/gpu`。）

成功注册后，设备插件就向 kubelet 发送它所管理的设备列表，然后 kubelet
负责将这些资源发布到 API 服务器，作为 kubelet 节点状态更新的一部分。

比如，设备插件在 kubelet 中注册了 `hardware-vendor.example/foo` 并报告了
节点上的两个运行状况良好的设备后，节点状态将更新以通告该节点已安装 2 个
"Foo" 设备并且是可用的。

<!--
Then, users can request devices in a
[Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
specification as they request other types of resources, with the following limitations:

* Extended resources are only supported as integer resources and cannot be overcommitted.
* Devices cannot be shared among Containers.
-->
然后用户需要请求其他类型的资源的时候，就可以在
[Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
规范请求这类设备，但是有以下的限制：

* 扩展资源仅可作为整数资源使用，并且不能被过量使用
* 设备不能在容器之间共享

<!--
Suppose a Kubernetes cluster is running a device plugin that advertises resource `hardware-vendor.example/foo`
on certain nodes. Here is an example of a pod requesting this resource to run a demo workload:
-->
假设 Kubernetes 集群正在运行一个设备插件，该插件在一些节点上公布的资源为 `hardware-vendor.example/foo`。
下面就是一个 Pod 示例，请求此资源以运行某演示负载：

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: demo-pod
spec:
  containers:
    - name: demo-container-1
      image: k8s.gcr.io/pause:2.0
      resources:
        limits:
          hardware-vendor.example/foo: 2
#
# 这个 pod 需要两个 hardware-vendor.example/foo 设备
# 而且只能够调度到满足需求的节点上
#
# 如果该节点中有 2 个以上的设备可用，其余的可供其他 Pod 使用
```

<!--
## Device plugin implementation

The general workflow of a device plugin includes the following steps:

* Initialization. During this phase, the device plugin performs vendor specific
  initialization and setup to make sure the devices are in a ready state.

* The plugin starts a gRPC service, with a Unix socket under host path
  `/var/lib/kubelet/device-plugins/`, that implements the following interfaces:
-->
## 设备插件的实现    {#device-plugin-implementation}

设备插件的常规工作流程包括以下几个步骤：

* 初始化。在这个阶段，设备插件将执行供应商特定的初始化和设置，
  以确保设备处于就绪状态。
* 插件使用主机路径 `/var/lib/kubelet/device-plugins/` 下的 Unix 套接字启动
  一个 gRPC 服务，该服务实现以下接口：

  <!--
  ```gRPC
  service DevicePlugin {
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
  `GetPreferredAllocation()` or `PreStartContainer()`. Flags indicating which
  (if any) of these calls are available should be set in the `DevicePluginOptions`
  message sent back by a call to `GetDevicePluginOptions()`. The `kubelet` will
  always call `GetDevicePluginOptions()` to see which optional functions are
  available, before calling any of them directly.
  -->
  插件并非必须为 `GetPreferredAllocation()` 或 `PreStartContainer()` 提供有用
  的实现逻辑，调用 `GetDevicePluginOptions()` 时所返回的 `DevicePluginOptions`
  消息中应该设置这些调用是否可用。`kubelet` 在真正调用这些函数之前，总会调用
  `GetDevicePluginOptions()` 来查看是否存在这些可选的函数。
  {{< /note >}}

<!--
* The plugin registers itself with the kubelet through the Unix socket at host
  path `/var/lib/kubelet/device-plugins/kubelet.sock`.

* After successfully registering itself, the device plugin runs in serving mode, during which it keeps
monitoring device health and reports back to the kubelet upon any device state changes.
It is also responsible for serving `Allocate` gRPC requests. During `Allocate`, the device plugin may
do device-specific preparation; for example, GPU cleanup or QRNG initialization.
If the operations succeed, the device plugin returns an `AllocateResponse` that contains container
runtime configurations for accessing the allocated devices. The kubelet passes this information
to the container runtime.
-->
* 插件通过 Unix socket 在主机路径 `/var/lib/kubelet/device-plugins/kubelet.sock`
  处向 kubelet 注册自身。
* 成功注册自身后，设备插件将以服务模式运行，在此期间，它将持续监控设备运行状况，
  并在设备状态发生任何变化时向 kubelet 报告。它还负责响应 `Allocate` gRPC 请求。
  在 `Allocate` 期间，设备插件可能还会做一些设备特定的准备；例如 GPU 清理或 QRNG 初始化。
  如果操作成功，则设备插件将返回 `AllocateResponse`，其中包含用于访问被分配的设备容器运行时的配置。
  kubelet 将此信息传递到容器运行时。

<!--
### Handling kubelet restarts

A device plugin is expected to detect kubelet restarts and re-register itself with the new
kubelet instance. In the current implementation, a new kubelet instance deletes all the existing Unix sockets
under `/var/lib/kubelet/device-plugins` when it starts. A device plugin can monitor the deletion
of its Unix socket and re-register itself upon such an event.
-->
### 处理 kubelet 重启

设备插件应能监测到 kubelet 重启，并且向新的 kubelet 实例来重新注册自己。
在当前实现中，当 kubelet 重启的时候，新的 kubelet 实例会删除 `/var/lib/kubelet/device-plugins`
下所有已经存在的 Unix 套接字。
设备插件需要能够监控到它的 Unix 套接字被删除，并且当发生此类事件时重新注册自己。

<!--
## Device plugin deployment

You can deploy a device plugin as a DaemonSet, as a package for your node's operating system,
or manually.

The canonical directory `/var/lib/kubelet/device-plugins` requires privileged access,
so a device plugin must run in a privileged security context.
If you're deploying a device plugin as a DaemonSet, `/var/lib/kubelet/device-plugins`
must be mounted as a {{< glossary_tooltip term_id="volume" >}}
in the plugin's
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

If you choose the DaemonSet approach you can rely on Kubernetes to: place the device plugin's
Pod onto Nodes, to restart the daemon Pod after failure, and to help automate upgrades.
-->
## 设备插件部署

你可以将你的设备插件作为节点操作系统的软件包来部署、作为 DaemonSet 来部署或者手动部署。

规范目录 `/var/lib/kubelet/device-plugins` 是需要特权访问的，所以设备插件
必须要在被授权的安全的上下文中运行。
如果你将设备插件部署为 DaemonSet，`/var/lib/kubelet/device-plugins` 目录必须要在插件的
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中声明作为 {{< glossary_tooltip term_id="volume" >}} 被挂载到插件中。

如果你选择 DaemonSet 方法，你可以通过 Kubernetes 进行以下操作：
将设备插件的 Pod 放置在节点上，在出现故障后重新启动守护进程 Pod，来进行自动升级。

<!--
## API compatibility

Kubernetes device plugin support is in beta. The API may change before stabilization,
in incompatible ways. As a project, Kubernetes recommends that device plugin developers:

* Watch for changes in future releases.
* Support multiple versions of the device plugin API for backward/forward compatibility.

If you enable the DevicePlugins feature and run device plugins on nodes that need to be upgraded to
a Kubernetes release with a newer device plugin API version, upgrade your device plugins
to support both versions before upgrading these nodes. Taking that approach will
ensure the continuous functioning of the device allocations during the upgrade.
-->
## API 兼容性

Kubernetes 设备插件支持还处于 beta 版本。所以在稳定版本出来之前 API 会以不兼容的方式进行更改。
作为一个项目，Kubernetes 建议设备插件开发者：

* 注意未来版本的更改
* 支持多个版本的设备插件 API，以实现向后/向前兼容性。

如果你启用 DevicePlugins 功能，并在需要升级到 Kubernetes 版本来获得较新的设备插件 API
版本的节点上运行设备插件，请在升级这些节点之前先升级设备插件以支持这两个版本。
采用该方法将确保升级期间设备分配的连续运行。

<!--
## Monitoring Device Plugin Resources

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

In order to monitor resources provided by device plugins, monitoring agents need to be able to
discover the set of devices that are in-use on the node and obtain metadata to describe which
container the metric should be associated with. [Prometheus](https://prometheus.io/) metrics
exposed by device monitoring agents should follow the
[Kubernetes Instrumentation Guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md),
identifying containers using `pod`, `namespace`, and `container` prometheus labels.
-->
## 监控设备插件资源

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

为了监控设备插件提供的资源，监控代理程序需要能够发现节点上正在使用的设备，
并获取元数据来描述哪个指标与容器相关联。
设备监控代理暴露给 [Prometheus](https://prometheus.io/) 的指标应该遵循
[Kubernetes Instrumentation Guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md)，
使用 `pod`、`namespace` 和 `container` 标签来标识容器。

<!--
The kubelet provides a gRPC service to enable discovery of in-use devices, and to provide metadata
for these devices:
-->
kubelet 提供了 gRPC 服务来使得正在使用中的设备被发现，并且还未这些设备提供了元数据：

```gRPC
// PodResourcesLister 是一个由 kubelet 提供的服务，用来提供供节点上 
// Pods 和容器使用的节点资源的信息
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
}
```

<!--
The `List` endpoint provides information on resources of running pods, with details such as the
id of exclusively allocated CPUs, device id as it was reported by device plugins and id of
the NUMA node where these devices are allocated.
-->
这一 `List` 端点提供运行中 Pods 的资源信息，包括类似独占式分配的
CPU ID、设备插件所报告的设备 ID 以及这些设备分配所处的 NUMA 节点 ID。

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
```

<!--
GetAllocatableResources provides information on resources initially available on the worker node.
It provides more information than kubelet exports to APIServer.
-->
端点 `GetAllocatableResources` 提供最初在工作节点上可用的资源的信息。
此端点所提供的信息比导出给 API 服务器的信息更丰富。


```gRPC
// AllocatableResourcesResponses 包含 kubelet 所了解到的所有设备的信息
message AllocatableResourcesResponse {
    repeated ContainerDevices devices = 1;
    repeated int64 cpu_ids = 2;
}

```

<!--
`ContainerDevices` do expose the topology information declaring to which NUMA cells the device is affine.
The NUMA cells are identified using a opaque integer ID, which value is consistent to what device
plugins report [when they register themselves to the kubelet](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).
-->
`ContainerDevices` 会向外提供各个设备所隶属的 NUMA 单元这类拓扑信息。
NUMA 单元通过一个整数 ID 来标识，其取值与设备插件所报告的一致。
[设备插件注册到 kubelet 时](/zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
会报告这类信息。

<!--
The gRPC service is served over a unix socket at `/var/lib/kubelet/pod-resources/kubelet.sock`.
Monitoring agents for device plugin resources can be deployed as a daemon, or as a DaemonSet.
The canonical directory `/var/lib/kubelet/pod-resources` requires privileged access, so monitoring
agents must run in a privileged security context.  If a device monitoring agent is running as a
DaemonSet, `/var/lib/kubelet/pod-resources` must be mounted as a
{{< glossary_tooltip term_id="volume" >}} in the device monitoring agent's
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

Support for the "PodResourcesLister service" requires `KubeletPodResources` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled.
It is enabled by default starting with Kubernetes 1.15 and is v1 since Kubernetes 1.20.
-->
gRPC 服务通过 `/var/lib/kubelet/pod-resources/kubelet.sock` 的 UNIX 套接字来提供服务。
设备插件资源的监控代理程序可以部署为守护进程或者 DaemonSet。
规范的路径 `/var/lib/kubelet/pod-resources` 需要特权来进入，
所以监控代理程序必须要在获得授权的安全的上下文中运行。
如果设备监控代理以 DaemonSet 形式运行，必须要在插件的
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中声明将 `/var/lib/kubelet/pod-resources` 目录以
{{< glossary_tooltip text="卷" term_id="volume" >}}的形式被挂载到设备监控代理中。

对“PodResourcesLister 服务”的支持要求启用 `KubeletPodResources`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)。
从 Kubernetes 1.15 开始默认启用，自从 Kubernetes 1.20 开始为 v1。

<!--
## Device Plugin integration with the Topology Manager

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}


The Topology Manager is a Kubelet component that allows resources to be co-ordinated in a Topology aligned manner. In order to do this, the Device Plugin API was extended to include a `TopologyInfo` struct.
-->
## 设备插件与拓扑管理器的集成

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

拓扑管理器是 Kubelet 的一个组件，它允许以拓扑对齐方式来调度资源。
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
Device Plugins that wish to leverage the Topology Manager can send back a populated TopologyInfo struct as part of the device registration, along with the device IDs and the health of the device. The device manager will then use this information to consult with the Topology Manager and make resource assignment decisions.

`TopologyInfo` supports a `nodes` field that is either `nil` (the default) or a list of NUMA nodes. This lets the Device Plugin publish that can span NUMA nodes.

An example `TopologyInfo` struct populated for a device by a Device Plugin:

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```
-->
设备插件希望拓扑管理器可以将填充的 TopologyInfo 结构体作为设备注册的一部分以及设备 ID
和设备的运行状况发送回去。然后设备管理器将使用此信息来咨询拓扑管理器并做出资源分配决策。

`TopologyInfo` 支持定义 `nodes` 字段，允许为 `nil`（默认）或者是一个 NUMA 节点的列表。
这样就可以使设备插件可以跨越 NUMA 节点去发布。

下面是一个由设备插件为设备填充 `TopologyInfo` 结构体的示例：

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

<!--
## Device plugin examples {#examples}

Here are some examples of device plugin implementations:

* The [AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
* The [Intel device plugins](https://github.com/intel/intel-device-plugins-for-kubernetes) for Intel GPU, FPGA and QuickAssist devices
* The [KubeVirt device plugins](https://github.com/kubevirt/kubernetes-device-plugins) for hardware-assisted virtualization
* The [NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin)
    * Requires [nvidia-docker](https://github.com/NVIDIA/nvidia-docker) 2.0, which allows you to run GPU-enabled Docker containers.
* The [NVIDIA GPU device plugin for Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* The [RDMA device plugin](https://github.com/hustcat/k8s-rdma-device-plugin)
* The [Solarflare device plugin](https://github.com/vikaschoudhary16/sfc-device-plugin)
* The [SR-IOV Network device plugin](https://github.com/intel/sriov-network-device-plugin)
* The [Xilinx FPGA device plugins](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-fpga-device-plugin) for Xilinx FPGA devices
-->
## 设备插件示例 {#examples}

下面是一些设备插件实现的示例：
 
* [AMD GPU 设备插件](https://github.com/RadeonOpenCompute/k8s-device-plugin)
* [Intel 设备插件](https://github.com/intel/intel-device-plugins-for-kubernetes) 支持 Intel GPU、FPGA 和 QuickAssist 设备
* [KubeVirt 设备插件](https://github.com/kubevirt/kubernetes-device-plugins) 用于硬件辅助的虚拟化
* The [NVIDIA GPU 设备插件](https://github.com/NVIDIA/k8s-device-plugin)
    * 需要 [nvidia-docker](https://github.com/NVIDIA/nvidia-docker) 2.0，以允许运行 Docker 容器的时候启用 GPU。
* [为 Container-Optimized OS 所提供的 NVIDIA GPU 设备插件](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [RDMA 设备插件](https://github.com/hustcat/k8s-rdma-device-plugin)
* [Solarflare 设备插件](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [SR-IOV 网络设备插件](https://github.com/intel/sriov-network-device-plugin)
* [Xilinx FPGA 设备插件](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-fpga-device-plugin)

## {{% heading "whatsnext" %}}

<!--
* Learn about [scheduling GPU resources](/docs/tasks/manage-gpus/scheduling-gpus/) using device plugins
* Learn about [advertising extended resources](/docs/tasks/administer-cluster/extended-resource-node/) on a node
* Read about using [hardware acceleration for TLS ingress](https://kubernetes.io/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) with Kubernetes
* Learn about the [Topology Manager] (/docs/tasks/adminster-cluster/topology-manager/)
-->
* 查看[调度 GPU 资源](/zh/docs/tasks/manage-gpus/scheduling-gpus/) 来学习使用设备插件
* 查看在上如何[公布节点上的扩展资源](/zh/docs/tasks/administer-cluster/extended-resource-node/)
* 阅读如何在 Kubernetes 中使用 [TLS Ingress 的硬件加速](https://kubernetes.io/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) 
* 学习[拓扑管理器](/zh/docs/tasks/administer-cluster/topology-manager/)


