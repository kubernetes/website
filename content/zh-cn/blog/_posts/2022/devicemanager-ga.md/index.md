---
layout: blog
title: 'Kubernetes 1.26：设备管理器正式发布'
date: 2022-12-19
slug: devicemanager-ga
---

<!--
layout: blog
title: 'Kubernetes 1.26: Device Manager graduates to GA'
date: 2022-12-19
slug: devicemanager-ga
-->

<!--
**Author:** Swati Sehgal (Red Hat)
-->
**作者**： Swati Sehgal (Red Hat)

**译者**： Jin Li (UOS)

<!--
The Device Plugin framework was introduced in the Kubernetes v1.8 release as a vendor
independent framework to enable discovery, advertisement and allocation of external
devices without modifying core Kubernetes. The feature graduated to Beta in v1.10.
With the recent release of Kubernetes v1.26, Device Manager is now generally
available (GA).
-->
设备插件框架是在 Kubernetes v1.8 版本中引入的，它是一个与供应商无关的框架，
旨在实现对外部设备的发现、公布和分配，而无需修改核心 Kubernetes。
该功能在 v1.10 版本中升级为 Beta 版本。随着 Kubernetes v1.26 的最新发布，
设备管理器现已正式发布（GA）。

<!--
Within the kubelet, the Device Manager facilitates communication with device plugins
using gRPC through Unix sockets. Device Manager and Device plugins both act as gRPC
servers and clients by serving and connecting to the exposed gRPC services respectively.
Device plugins serve a gRPC service that kubelet connects to for device discovery,
advertisement (as extended resources) and allocation. Device Manager connects to
the `Registration` gRPC service served by kubelet to register itself with kubelet.
-->
在 kubelet 中，设备管理器通过 Unix 套接字使用 gRPC 实现与设备插件的通信。
设备管理器和设备插件都充当 gRPC 服务器和客户端的角色，分别提供暴露的 gRPC 服务并进行连接。
设备插件提供 gRPC 服务，kubelet 连接该服务进行设备的发现、公布（作为扩展资源）和分配。
设备管理器连接到 kubelet 提供的 `Registration` gRPC 服务，以向 kubelet 注册自身。

<!--
Please refer to the documentation for an [example](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#example-pod) on how a pod can request a device exposed to the cluster by a device plugin.
-->
请查阅文档中的[示例](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#example-pod),
了解一个 Pod 如何通过设备插件请求集群中暴露的设备。

<!--
Here are some example implementations of device plugins:
- [AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
- [Collection of Intel device plugins for Kubernetes](https://github.com/intel/intel-device-plugins-for-kubernetes)
- [NVIDIA device plugin for Kubernetes](https://github.com/NVIDIA/k8s-device-plugin)
- [SRIOV network device plugin for Kubernetes](https://github.com/k8snetworkplumbingwg/sriov-network-device-plugin)
-->
以下是设备插件的一些示例实现:
- [AMD GPU 设备插件](https://github.com/RadeonOpenCompute/k8s-device-plugin)
- [用于 Kubernetes 的 Intel 设备插件集合](https://github.com/intel/intel-device-plugins-for-kubernetes)
- [用于 Kubernetes 的 NVIDIA 设备插件](https://github.com/NVIDIA/k8s-device-plugin)
- [用于 Kubernetes 的 SRIOV 网络设备插件](https://github.com/k8snetworkplumbingwg/sriov-network-device-plugin)

<!--
## Noteworthy developments since Device Plugin framework introduction
-->
## 自设备插件框架引入以来的重要进展

<!--
### Kubelet APIs moved to kubelet staging repo
External facing `deviceplugin` API packages moved from `k8s.io/kubernetes/pkg/kubelet/apis/`
to `k8s.io/kubelet/pkg/apis/` in v1.17. Refer to [Move external facing kubelet apis to staging](https://github.com/kubernetes/kubernetes/pull/83551) for more details on the rationale behind this change.
-->
### Kubelet APIs 移至 kubelet 暂存库
在 v1.17 版本中，面向外部的 `deviceplugin` API 包已从 `k8s.io/kubernetes/pkg/kubelet/apis/`
移动到了 `k8s.io/kubelet/pkg/apis/`。有关此变更背后的更多详细信息，
请参阅 [Move external facing kubelet apis to staging](https://github.com/kubernetes/kubernetes/pull/83551)

<!--
### Device Plugin API updates
-->
### 设备插件 API 更新

<!--
Additional gRPC endpoints introduced:
  1. `GetDevicePluginOptions` is used by device plugins to communicate
     options to the `DeviceManager` in order to indicate if `PreStartContainer`,
     `GetPreferredAllocation` or other future optional calls are supported and
     can be called before making devices available to the container.
-->
新增了额外的 gRPC 端点：

1. `GetDevicePluginOptions` 用于设备插件向 `DeviceManager` 传递选项，以指示是否支持
   `PreStartContainer`、`GetPreferredAllocation` 或其他将来的可选调用，
   并可在向容器提供设备之前进行调用。

<!--
  1. `GetPreferredAllocation` allows a device plugin to forward allocation
     preferrence to the `DeviceManager` so it can incorporate this information
     into its allocation decisions. The `DeviceManager` will call out to a
     plugin at pod admission time asking for a preferred device allocation
     of a given size from a list of available devices to make a more informed
     decision. E.g. Specifying inter-device constraints to indicate preferrence
     on best-connected set of devices when allocating devices to a container.
-->
2. `GetPreferredAllocation` 允许设备插件将优先分配信息传递给 `DeviceManager`，
   使其能够将此信息纳入其分配决策中。`DeviceManager` 在 Pod
   准入时向插件请求指定大小的优选设备分配，以便做出更明智的决策。
   例如，在为容器分配设备时，指定设备间的约束条件以表明对最佳连接设备集合的偏好。

<!--
  1. `PreStartContainer` is called before each container start if indicated by
     device plugins during registration phase. It allows Device Plugins to run device
     specific operations on the Devices requested. E.g. reconfiguring or
     reprogramming FPGAs before the container starts running. 
-->
3. 在注册阶段由设备插件指示时，`PreStartContainer` 会在每次容器启动之前被调用。
   它允许设备插件在所请求的设备上执行特定的设备操作。
   例如，在容器启动前对 FPGA 进行重新配置或重新编程。

<!--
Pull Requests that introduced these changes are here:
1. [Invoke preStart RPC call before container start, if desired by plugin](https://github.com/kubernetes/kubernetes/pull/58282)
1. [Add GetPreferredAllocation() call to the v1beta1 device plugin API](https://github.com/kubernetes/kubernetes/pull/92665)
-->
引入这些更改的 PR 为：
1. [Invoke preStart RPC call before container start, if desired by plugin](https://github.com/kubernetes/kubernetes/pull/58282)
1. [Add GetPreferredAllocation() call to the v1beta1 device plugin API](https://github.com/kubernetes/kubernetes/pull/92665)

<!--
With introduction of the above endpoints the interaction between Device Manager in
kubelet and Device Manager can be shown as below:
-->
引入上述端点后，kubelet 中的设备管理器与设备管理器之间的交互如下所示：

<!--
{{< figure src="deviceplugin-framework-overview.svg" alt="Representation of the Device Plugin framework showing the relationship between the kubelet and a device plugin" class="diagram-large" caption="Device Plugin framework Overview" >}}
-->
{{< figure src="deviceplugin-framework-overview.svg" 
alt="展示设备插件框架，显示 kubelet 与设备插件之间的关系" 
class="diagram-large" caption="设备插件框架概述" >}}

<!--
### Change in semantics of device plugin registration process 
Device plugin code was refactored to separate 'plugin' package under the `devicemanager`
package to lay the groundwork for introducing a `v1beta2` device plugin API. This would
allow adding support in `devicemanager` to service multiple device plugin APIs at the
same time.
-->
### 设备插件注册流程的语义变更
设备插件的代码经过重构，将 'plugin' 包独立于 `devicemanager` 包之外，
为引入 `v1beta2` 设备插件 API 做好了前期准备。
这将允许在 `devicemanager` 中添加支持，以便同时为多个设备插件 API 提供服务。

<!--
With this refactoring work, it is now mandatory for a device plugin to start serving its gRPC
service before registering itself with kubelet. Previously, these two operations were asynchronous
and device plugin could register itself before starting its gRPC server which is no longer the
case. For more details, refer to [PR #109016](https://github.com/kubernetes/kubernetes/pull/109016) and [Issue #112395](https://github.com/kubernetes/kubernetes/issues/112395).
-->
通过这次重构工作，现在设备插件必须在向 kubelet 注册之前开始提供其 gRPC 服务。
之前这两个操作是异步的，设备插件可以在启动其 gRPC 服务器之前注册自己，但现在不再允许。
更多细节请参考 [PR #109016](https://github.com/kubernetes/kubernetes/pull/109016) 和
[Issue #112395](https://github.com/kubernetes/kubernetes/issues/112395)。

<!--
### Dynamic resource allocation
In Kubernetes 1.26, inspired by how [Persistent Volumes](/docs/concepts/storage/persistent-volumes)
are handled in Kubernetes, [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
has been introduced to cater to devices that have more sophisticated resource requirements like:
-->
### 动态资源分配

在 Kubernetes 1.26 中，受 Kubernetes
处理[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes)方式的启发，
引入了[动态资源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)，
以满足那些具有更复杂资源需求的设备，例如：

<!--
1. Decouple device initialization and allocation from the pod lifecycle.
1. Facilitate dynamic sharing of devices between containers and pods.
1. Support custom resource-specific parameters
1. Enable resource-specific setup and cleanup actions
1. Enable support for Network-attached resources, not just node-local resources
-->
1. 将设备的初始化和分配与 Pod 生命周期解耦。
1. 促进容器和 Pod 之间设备的动态共享。
1. 支持自定义特定资源参数。
1. 启用特定资源的设置和清理操作。
1. 实现对网络附加资源的支持，不再局限于节点本地资源。

<!--
## Is the Device Plugin API stable now?
No, the Device Plugin API is still not stable; the latest Device Plugin API version
available is `v1beta1`. There are plans in the community to introduce `v1beta2` API
to service multiple plugin APIs at once. A per-API call with request/response types
would allow adding support for newer API versions without explicitly bumping the API.
-->
## 设备插件 API 目前已经稳定了吗？
不，设备插件 API 仍然不稳定；目前最新的可用设备插件 API 版本是 `v1beta1`。
社区计划引入 `v1beta2` API，以便同时为多个插件 API 提供服务。
对每个 API 的调用都具有请求/响应类型，可以在不明确升级 API 的情况下添加对新 API 版本的支持。

<!--
In addition to that, there are existing proposals in the community to introduce additional
endpoints [KEP-3162: Add Deallocate and PostStopContainer to Device Manager API](https://github.com/kubernetes/enhancements/issues/3162).
-->
除此之外，社区中存在一些提案，打算引入额外的端点
[KEP-3162: Add Deallocate and PostStopContainer to Device Manager API](https://github.com/kubernetes/enhancements/issues/3162)。
