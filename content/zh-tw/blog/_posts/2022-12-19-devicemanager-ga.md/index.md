---
layout: blog
title: 'Kubernetes 1.26：設備管理器正式發佈'
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

**譯者**： Jin Li (UOS)

<!--
The Device Plugin framework was introduced in the Kubernetes v1.8 release as a vendor
independent framework to enable discovery, advertisement and allocation of external
devices without modifying core Kubernetes. The feature graduated to Beta in v1.10.
With the recent release of Kubernetes v1.26, Device Manager is now generally
available (GA).
-->
設備插件框架是在 Kubernetes v1.8 版本中引入的，它是一個與供應商無關的框架，
旨在實現對外部設備的發現、公佈和分配，而無需修改核心 Kubernetes。
該功能在 v1.10 版本中升級爲 Beta 版本。隨着 Kubernetes v1.26 的最新發布，
設備管理器現已正式發佈（GA）。

<!--
Within the kubelet, the Device Manager facilitates communication with device plugins
using gRPC through Unix sockets. Device Manager and Device plugins both act as gRPC
servers and clients by serving and connecting to the exposed gRPC services respectively.
Device plugins serve a gRPC service that kubelet connects to for device discovery,
advertisement (as extended resources) and allocation. Device Manager connects to
the `Registration` gRPC service served by kubelet to register itself with kubelet.
-->
在 kubelet 中，設備管理器通過 Unix 套接字使用 gRPC 實現與設備插件的通信。
設備管理器和設備插件都充當 gRPC 伺服器和客戶端的角色，分別提供暴露的 gRPC 服務並進行連接。
設備插件提供 gRPC 服務，kubelet 連接該服務進行設備的發現、公佈（作爲擴展資源）和分配。
設備管理器連接到 kubelet 提供的 `Registration` gRPC 服務，以向 kubelet 註冊自身。

<!--
Please refer to the documentation for an [example](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#example-pod) on how a pod can request a device exposed to the cluster by a device plugin.
-->
請查閱文檔中的[示例](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#example-pod),
瞭解一個 Pod 如何通過設備插件請求叢集中暴露的設備。

<!--
Here are some example implementations of device plugins:
- [AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
- [Collection of Intel device plugins for Kubernetes](https://github.com/intel/intel-device-plugins-for-kubernetes)
- [NVIDIA device plugin for Kubernetes](https://github.com/NVIDIA/k8s-device-plugin)
- [SRIOV network device plugin for Kubernetes](https://github.com/k8snetworkplumbingwg/sriov-network-device-plugin)
-->
以下是設備插件的一些示例實現:
- [AMD GPU 設備插件](https://github.com/RadeonOpenCompute/k8s-device-plugin)
- [用於 Kubernetes 的 Intel 設備插件集合](https://github.com/intel/intel-device-plugins-for-kubernetes)
- [用於 Kubernetes 的 NVIDIA 設備插件](https://github.com/NVIDIA/k8s-device-plugin)
- [用於 Kubernetes 的 SRIOV 網路設備插件](https://github.com/k8snetworkplumbingwg/sriov-network-device-plugin)

<!--
## Noteworthy developments since Device Plugin framework introduction
-->
## 自設備插件框架引入以來的重要進展

<!--
### Kubelet APIs moved to kubelet staging repo
External facing `deviceplugin` API packages moved from `k8s.io/kubernetes/pkg/kubelet/apis/`
to `k8s.io/kubelet/pkg/apis/` in v1.17. Refer to [Move external facing kubelet apis to staging](https://github.com/kubernetes/kubernetes/pull/83551) for more details on the rationale behind this change.
-->
### Kubelet APIs 移至 kubelet 暫存庫
在 v1.17 版本中，面向外部的 `deviceplugin` API 包已從 `k8s.io/kubernetes/pkg/kubelet/apis/`
移動到了 `k8s.io/kubelet/pkg/apis/`。有關此變更背後的更多詳細信息，
請參閱 [Move external facing kubelet apis to staging](https://github.com/kubernetes/kubernetes/pull/83551)

<!--
### Device Plugin API updates
-->
### 設備插件 API 更新

<!--
Additional gRPC endpoints introduced:
  1. `GetDevicePluginOptions` is used by device plugins to communicate
     options to the `DeviceManager` in order to indicate if `PreStartContainer`,
     `GetPreferredAllocation` or other future optional calls are supported and
     can be called before making devices available to the container.
-->
新增了額外的 gRPC 端點：

1. `GetDevicePluginOptions` 用於設備插件向 `DeviceManager` 傳遞選項，以指示是否支持
   `PreStartContainer`、`GetPreferredAllocation` 或其他將來的可選調用，
   並可在向容器提供設備之前進行調用。

<!--
  1. `GetPreferredAllocation` allows a device plugin to forward allocation
     preferrence to the `DeviceManager` so it can incorporate this information
     into its allocation decisions. The `DeviceManager` will call out to a
     plugin at pod admission time asking for a preferred device allocation
     of a given size from a list of available devices to make a more informed
     decision. E.g. Specifying inter-device constraints to indicate preferrence
     on best-connected set of devices when allocating devices to a container.
-->
2. `GetPreferredAllocation` 允許設備插件將優先分配信息傳遞給 `DeviceManager`，
   使其能夠將此信息納入其分配決策中。`DeviceManager` 在 Pod
   准入時向插件請求指定大小的優選設備分配，以便做出更明智的決策。
   例如，在爲容器分配設備時，指定設備間的約束條件以表明對最佳連接設備集合的偏好。

<!--
  1. `PreStartContainer` is called before each container start if indicated by
     device plugins during registration phase. It allows Device Plugins to run device
     specific operations on the Devices requested. E.g. reconfiguring or
     reprogramming FPGAs before the container starts running. 
-->
3. 在註冊階段由設備插件指示時，`PreStartContainer` 會在每次容器啓動之前被調用。
   它允許設備插件在所請求的設備上執行特定的設備操作。
   例如，在容器啓動前對 FPGA 進行重新設定或重新編程。

<!--
Pull Requests that introduced these changes are here:
1. [Invoke preStart RPC call before container start, if desired by plugin](https://github.com/kubernetes/kubernetes/pull/58282)
1. [Add GetPreferredAllocation() call to the v1beta1 device plugin API](https://github.com/kubernetes/kubernetes/pull/92665)
-->
引入這些更改的 PR 爲：
1. [Invoke preStart RPC call before container start, if desired by plugin](https://github.com/kubernetes/kubernetes/pull/58282)
1. [Add GetPreferredAllocation() call to the v1beta1 device plugin API](https://github.com/kubernetes/kubernetes/pull/92665)

<!--
With introduction of the above endpoints the interaction between Device Manager in
kubelet and Device Manager can be shown as below:
-->
引入上述端點後，kubelet 中的設備管理器與設備管理器之間的交互如下所示：

<!--
{{< figure src="deviceplugin-framework-overview.svg" alt="Representation of the Device Plugin framework showing the relationship between the kubelet and a device plugin" class="diagram-large" caption="Device Plugin framework Overview" >}}
-->
{{< figure src="deviceplugin-framework-overview.svg" 
alt="展示設備插件框架，顯示 kubelet 與設備插件之間的關係" 
class="diagram-large" caption="設備插件框架概述" >}}

<!--
### Change in semantics of device plugin registration process 
Device plugin code was refactored to separate 'plugin' package under the `devicemanager`
package to lay the groundwork for introducing a `v1beta2` device plugin API. This would
allow adding support in `devicemanager` to service multiple device plugin APIs at the
same time.
-->
### 設備插件註冊流程的語義變更
設備插件的代碼經過重構，將 'plugin' 包獨立於 `devicemanager` 包之外，
爲引入 `v1beta2` 設備插件 API 做好了前期準備。
這將允許在 `devicemanager` 中添加支持，以便同時爲多個設備插件 API 提供服務。

<!--
With this refactoring work, it is now mandatory for a device plugin to start serving its gRPC
service before registering itself with kubelet. Previously, these two operations were asynchronous
and device plugin could register itself before starting its gRPC server which is no longer the
case. For more details, refer to [PR #109016](https://github.com/kubernetes/kubernetes/pull/109016) and [Issue #112395](https://github.com/kubernetes/kubernetes/issues/112395).
-->
通過這次重構工作，現在設備插件必須在向 kubelet 註冊之前開始提供其 gRPC 服務。
之前這兩個操作是異步的，設備插件可以在啓動其 gRPC 伺服器之前註冊自己，但現在不再允許。
更多細節請參考 [PR #109016](https://github.com/kubernetes/kubernetes/pull/109016) 和
[Issue #112395](https://github.com/kubernetes/kubernetes/issues/112395)。

<!--
### Dynamic resource allocation
In Kubernetes 1.26, inspired by how [Persistent Volumes](/docs/concepts/storage/persistent-volumes)
are handled in Kubernetes, [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
has been introduced to cater to devices that have more sophisticated resource requirements like:
-->
### 動態資源分配

在 Kubernetes 1.26 中，受 Kubernetes
處理[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes)方式的啓發，
引入了[動態資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)，
以滿足那些具有更復雜資源需求的設備，例如：

<!--
1. Decouple device initialization and allocation from the pod lifecycle.
1. Facilitate dynamic sharing of devices between containers and pods.
1. Support custom resource-specific parameters
1. Enable resource-specific setup and cleanup actions
1. Enable support for Network-attached resources, not just node-local resources
-->
1. 將設備的初始化和分配與 Pod 生命週期解耦。
1. 促進容器和 Pod 之間設備的動態共享。
1. 支持自定義特定資源參數。
1. 啓用特定資源的設置和清理操作。
1. 實現對網路附加資源的支持，不再侷限於節點本地資源。

<!--
## Is the Device Plugin API stable now?
No, the Device Plugin API is still not stable; the latest Device Plugin API version
available is `v1beta1`. There are plans in the community to introduce `v1beta2` API
to service multiple plugin APIs at once. A per-API call with request/response types
would allow adding support for newer API versions without explicitly bumping the API.
-->
## 設備插件 API 目前已經穩定了嗎？
不，設備插件 API 仍然不穩定；目前最新的可用設備插件 API 版本是 `v1beta1`。
社區計劃引入 `v1beta2` API，以便同時爲多個插件 API 提供服務。
對每個 API 的調用都具有請求/響應類型，可以在不明確升級 API 的情況下添加對新 API 版本的支持。

<!--
In addition to that, there are existing proposals in the community to introduce additional
endpoints [KEP-3162: Add Deallocate and PostStopContainer to Device Manager API](https://github.com/kubernetes/enhancements/issues/3162).
-->
除此之外，社區中存在一些提案，打算引入額外的端點
[KEP-3162: Add Deallocate and PostStopContainer to Device Manager API](https://github.com/kubernetes/enhancements/issues/3162)。
