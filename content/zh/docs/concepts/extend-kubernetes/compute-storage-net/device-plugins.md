---
title: 设备插件
description: 使用 Kubernetes 设备插件框架来实现适用于 GPU、NIC、FPGA、InfiniBand 以及类似的需要特定于供应商设置的资源的插件。
content_template: templates/concept
weight: 20
---

{{% capture overview %}}
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
Kubernetes 提供了一个[设备插件框架](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)，您可以用来将系统硬件资源发布到 {{< glossary_tooltip term_id="kubelet" >}}。

供应商可以实现设备插件，由您手动部署或作为 {{< glossary_tooltip term_id="daemonset" >}} 来部署，而不必定制 Kubernetes 本身的代码。目标设备包括 GPU、高性能 NIC、FPGA、InfiniBand 适配器以及其他类似的、可能需要特定于供应商的初始化和设置的计算资源。

{{% /capture %}}

{{% capture body %}}

## 注册设备插件

<!--
The kubelet exports a `Registration` gRPC service:
-->
kubelet 输出了一个 `Registration` 的 gRPC 服务：

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
    [extended resource naming scheme](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources)
    as `vendor-domain/resourcetype`.
    (For example, an NVIDIA GPU is advertised as `nvidia.com/gpu`.)

Following a successful registration, the device plugin sends the kubelet the
list of devices it manages, and the kubelet is then in charge of advertising those
resources to the API server as part of the kubelet node status update.
For example, after a device plugin registers `hardware-vendor.example/foo` with the kubelet
and reports two healthy devices on a node, the node status is updated
to advertise that the node has 2 “Foo” devices installed and available.
-->
设备插件可以通过此 gRPC 服务在 kubelet 进行注册。在注册期间，设备插件需要发送下面几样内容：
  
  * 设备插件的 Unix 套接字。
  * 设备插件的 API 版本。
  * `ResourceName` 是需要公布的。这里 `ResourceName` 需要遵循[扩展资源命名方案](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources)，类似于 `vendor-domain/resourcetype`。（比如 NVIDIA GPU 就被公布为 `nvidia.com/gpu`。）

成功注册后，设备插件就向 kubelet 发送他所管理的设备列表，然后 kubelet 负责将这些资源发布到 API 服务器，作为 kubelet 节点状态更新的一部分。

比如，设备插件在 kubelet 中注册了 `hardware-vendor.example/foo` 并报告了节点上的两个运行状况良好的设备后，节点状态将更新以通告该节点已安装2个 `Foo` 设备并且是可用的。

<!--
Then, users can request devices in a
[Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
specification as they request other types of resources, with the following limitations:

* Extended resources are only supported as integer resources and cannot be overcommitted.
* Devices cannot be shared among Containers.
-->
然后用户需要去请求其他类型的资源的时候，就可以在[Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)规范请求这类设备，但是有以下的限制：

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
# 而且只能够调度到满足需求的 node 上
#
# 如果该节点中有2个以上的设备可用，其余的可供其他 pod 使用
```

<!--
## Device plugin implementation

The general workflow of a device plugin includes the following steps:

* Initialization. During this phase, the device plugin performs vendor specific
  initialization and setup to make sure the devices are in a ready state.

* The plugin starts a gRPC service, with a Unix socket under host path
  `/var/lib/kubelet/device-plugins/`, that implements the following interfaces:
-->

## 设备插件的实现

设备插件的常规工作流程包括以下几个步骤：

  * 初始化。在这个阶段，设备插件将执行供应商特定的初始化和设置，以确保设备处于就绪状态。
  * 插件使用主机路径 `/var/lib/kubelet/device-plugins/` 下的 Unix socket 启动一个 gRPC 服务，该服务实现以下接口：

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
  }
  ```

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

  * 插件通过 Unix socket 在主机路径 `/var/lib/kubelet/device-plugins/kubelet.sock` 处向 kubelet 注册自身。
  * 成功注册自身后，设备插件将以服务模式运行，在此期间，它将持续监控设备运行状况，并在设备状态发生任何变化时向 kubelet 报告。它还负责响应 `Allocate` gRPC 请求。在`Allocate`期间，设备插件可能还会做一些设备特定的准备；例如 GPU 清理或 QRNG 初始化。如果操作成功，则设备插件将返回 `AllocateResponse`，其中包含用于访问被分配的设备容器运行时的配置。kubelet 将此信息传递到容器运行时。

<!--
### Handling kubelet restarts

A device plugin is expected to detect kubelet restarts and re-register itself with the new
kubelet instance. In the current implementation, a new kubelet instance deletes all the existing Unix sockets
under `/var/lib/kubelet/device-plugins` when it starts. A device plugin can monitor the deletion
of its Unix socket and re-register itself upon such an event.
-->
### 处理 kubelet 重启

设备插件应能监测到 kubelet 重启，并且向新的 kubelet 实例来重新注册自己。在当前实现中，当 kubelet 重启的时候，新的 kubelet 实例会删除 `/var/lib/kubelet/device-plugins` 下所有已经存在的 Unix sockets。设备插件需要能够监控到它的 Unix socket 被删除，并且当发生此类事件时重新注册自己。

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

规范目录 `/var/lib/kubelet/device-plugins` 是需要特权访问的，所以设备插件必须要在被授权的安全的上下文中运行。如果你将设备插件部署为 DaemonSet，`/var/lib/kubelet/device-plugins` 目录必须要在插件的 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 中声明作为 {{< glossary_tooltip term_id="volume" >}} 被 mount 到插件中。

如果你选择 DaemonSet 方法，你可以通过 Kubernetes 进行以下操作：将设备插件的 Pod 放置在节点上，在出现故障后重新启动 daemon Pod，来进行自动进行升级。

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

Kubernetes 设备插件支持还处于 beta 版本。所以在稳定版本出来之前 API 会以不兼容的方式进行更改。作为一个项目，Kubernetes 建议设备插件开发者：

* 注意未来版本的更改
* 支持多个版本的设备插件 API，以实现向后/向前兼容性。

如果你启用 DevicePlugins 功能，并在需要升级到 Kubernetes 版本来获得较新的设备插件 API 版本的节点上运行设备插件，请在升级这些节点之前先升级设备插件以支持这两个版本。采用该方法将确保升级期间设备分配的连续运行。

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

为了监控设备插件提供的资源，监控代理程序需要能够发现节点上正在使用的设备，并获取元数据来描述哪个指标与容器相关联。设备监控代理暴露给 [Prometheus](https://prometheus.io/) 的指标应该遵循 [Kubernetes Instrumentation Guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md)，使用 `pod`、`namespace` 和 `container` 标签来标识容器。

<!--
The kubelet provides a gRPC service to enable discovery of in-use devices, and to provide metadata
for these devices:
-->
kubelet 提供了 gRPC 服务来使得正在使用中的设备被发现，并且还未这些设备提供了元数据：

```gRPC
// PodResourcesLister is a service provided by the kubelet that provides information about the
// node resources consumed by pods and containers on the node
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
}
```

<!--
The gRPC service is served over a unix socket at `/var/lib/kubelet/pod-resources/kubelet.sock`.
Monitoring agents for device plugin resources can be deployed as a daemon, or as a DaemonSet.
The canonical directory `/var/lib/kubelet/pod-resources` requires privileged access, so monitoring
agents must run in a privileged security context.  If a device monitoring agent is running as a
DaemonSet, `/var/lib/kubelet/pod-resources` must be mounted as a
{{< glossary_tooltip term_id="volume" >}} in the plugin's
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

Support for the "PodResources service" requires `KubeletPodResources` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled. It is enabled by default starting with Kubernetes 1.15.
-->
gRPC 服务通过 `/var/lib/kubelet/pod-resources/kubelet.sock` 的 UNIX 套接字来提供服务。设备插件资源的监控代理程序可以部署为守护进程或者 DaemonSet。规范的路径 `/var/lib/kubelet/pod-resources` 需要特权来进入，所以监控代理程序必须要在获得授权的安全的上下文中运行。如果设备监控代理以 DaemonSet 形式运行，必须要在插件的 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 中声明将 `/var/lib/kubelet/pod-resources` 目录以 {{< glossary_tooltip term_id="volume" >}} 形式被 mount 到容器中。

对“PodResources 服务”的支持要求启用 `KubeletPodResources` [特性门控](/docs/reference/command-line-tools-reference/feature-gates/)。从 Kubernetes 1.15 开始默认启用。

<!--
## Device Plugin integration with the Topology Manager

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

The Topology Manager is a Kubelet component that allows resources to be co-ordintated in a Topology aligned manner. In order to do this, the Device Plugin API was extended to include a `TopologyInfo` struct.
-->
## 设备插件与拓扑管理器的集成

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

拓扑管理器是 Kubelet 的一个组件，它允许以拓扑对齐方式来调度资源。为了做到这一点，设备插件 API 进行了扩展来包括一个 `TopologyInfo` 结构体。

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
设备插件希望拓扑管理器可以将填充的 TopologyInfo 结构体作为设备注册的一部分以及设备 ID 和设备的运行状况发送回去。然后设备管理器将使用此信息来咨询拓扑管理器并做出资源分配决策。

`TopologyInfo` 支持定义 `nodes` 字段，允许为 `nil`（默认）或者是一个 NUMA nodes 的列表。这样就可以使设备插件可以跨越 NUMA nodes 去发布。

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
* The [Xilinx FPGA device plugins](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-fpga-device-plugin/trunk) for Xilinx FPGA devices
-->
## 设备插件示例 {#examples}

下面是一些设备插件实现的示例：
 
* [AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
* [Intel device plugins](https://github.com/intel/intel-device-plugins-for-kubernetes) 支持 Intel GPU、FPGA 和 QuickAssist 设备
* [KubeVirt device plugins](https://github.com/kubevirt/kubernetes-device-plugins) 用于硬件辅助的虚拟化
* The [NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin)
    * 需要 [nvidia-docker](https://github.com/NVIDIA/nvidia-docker) 2.0，允许运行 Docker 容器的时候开启 GPU。
* [NVIDIA GPU device plugin for Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [RDMA device plugin](https://github.com/hustcat/k8s-rdma-device-plugin)
* [Solarflare device plugin](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [SR-IOV Network device plugin](https://github.com/intel/sriov-network-device-plugin)
* [Xilinx FPGA device plugins](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-fpga-device-plugin/trunk)

{{% /capture %}}
{{% capture whatsnext %}}

<!--
* Learn about [scheduling GPU resources](/docs/tasks/manage-gpus/scheduling-gpus/) using device plugins
* Learn about [advertising extended resources](/docs/tasks/administer-cluster/extended-resource-node/) on a node
* Read about using [hardware acceleration for TLS ingress](https://kubernetes.io/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) with Kubernetes
* Learn about the [Topology Manager] (/docs/tasks/adminster-cluster/topology-manager/)
-->
* 查看 [调度 GPU 资源](/docs/tasks/manage-gpus/scheduling-gpus/) 来学习使用设备插件
* 查看在 node 上如何[广告扩展资源](/docs/tasks/administer-cluster/extended-resource-node/)
* 阅读如何在 Kubernetes 中如何使用 [TLS 入口的硬件加速](https://kubernetes.io/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) 
* 学习 [Topology Manager] (/docs/tasks/adminster-cluster/topology-manager/)

{{% /capture %}}
