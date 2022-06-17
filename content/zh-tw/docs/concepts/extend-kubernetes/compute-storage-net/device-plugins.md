---
title: 裝置外掛
description: 使用 Kubernetes 裝置外掛框架來實現適用於 GPU、NIC、FPGA、InfiniBand 以及類似的需要特定於供應商設定的資源的外掛。
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
Kubernetes 提供了一個
[裝置外掛框架](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)，你可以用它來將系統硬體資源釋出到 {{< glossary_tooltip term_id="kubelet" >}}。

供應商可以實現裝置外掛，由你手動部署或作為 {{< glossary_tooltip term_id="daemonset" >}}
來部署，而不必定製 Kubernetes 本身的程式碼。目標裝置包括 GPU、高效能 NIC、FPGA、
InfiniBand 介面卡以及其他類似的、可能需要特定於供應商的初始化和設定的計算資源。

<!-- body -->

<!--
## Device plugin registration
-->
## 註冊裝置外掛    {#device-plugin-registration}

<!--
The kubelet exports a `Registration` gRPC service:
-->
`kubelet` 提供了一個 `Registration` 的 gRPC 服務：

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
裝置外掛可以透過此 gRPC 服務在 kubelet 進行註冊。在註冊期間，裝置外掛需要傳送下面幾樣內容：

* 裝置外掛的 Unix 套接字。
* 裝置外掛的 API 版本。
* `ResourceName` 是需要公佈的。這裡 `ResourceName` 需要遵循
  [擴充套件資源命名方案](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)，
  類似於 `vendor-domain/resourcetype`。（比如 NVIDIA GPU 就被公佈為 `nvidia.com/gpu`。）

成功註冊後，裝置外掛就向 kubelet 傳送它所管理的裝置列表，然後 kubelet
負責將這些資源釋出到 API 伺服器，作為 kubelet 節點狀態更新的一部分。

比如，裝置外掛在 kubelet 中註冊了 `hardware-vendor.example/foo` 並報告了
節點上的兩個執行狀況良好的裝置後，節點狀態將更新以通告該節點已安裝 2 個
"Foo" 裝置並且是可用的。

<!--
Then, users can request devices as part of a Pod specification
(see [`container`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)).
Requesting extended resources is similar to how you manage requests and limits for
other resources, with the following differences:
* Extended resources are only supported as integer resources and cannot be overcommitted.
* Devices cannot be shared between containers.
-->
然後，使用者可以請求裝置作為 Pod 規範的一部分，
參見[Container](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)。
請求擴充套件資源類似於管理請求和限制的方式，
其他資源，有以下區別：

* 擴充套件資源僅可作為整數資源使用，並且不能被過量使用
* 裝置不能在容器之間共享

### 示例 {#example-pod}

<!--
Suppose a Kubernetes cluster is running a device plugin that advertises resource `hardware-vendor.example/foo`
on certain nodes. Here is an example of a pod requesting this resource to run a demo workload:
-->
假設 Kubernetes 叢集正在執行一個裝置外掛，該外掛在一些節點上公佈的資源為 `hardware-vendor.example/foo`。
下面就是一個 Pod 示例，請求此資源以執行一個工作負載的示例：

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
# 這個 pod 需要兩個 hardware-vendor.example/foo 裝置
# 而且只能夠排程到滿足需求的節點上
#
# 如果該節點中有 2 個以上的裝置可用，其餘的可供其他 Pod 使用
```

<!--
## Device plugin implementation

The general workflow of a device plugin includes the following steps:

* Initialization. During this phase, the device plugin performs vendor specific
  initialization and setup to make sure the devices are in a ready state.

* The plugin starts a gRPC service, with a Unix socket under host path
  `/var/lib/kubelet/device-plugins/`, that implements the following interfaces:
-->
## 裝置外掛的實現    {#device-plugin-implementation}

裝置外掛的常規工作流程包括以下幾個步驟：

* 初始化。在這個階段，裝置外掛將執行供應商特定的初始化和設定，
  以確保裝置處於就緒狀態。
* 外掛使用主機路徑 `/var/lib/kubelet/device-plugins/` 下的 Unix 套接字啟動
  一個 gRPC 服務，該服務實現以下介面：

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
        // GetDevicePluginOptions 返回與裝置管理器溝通的選項。
        rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

        // ListAndWatch 返回 Device 列表構成的資料流。
        // 當 Device 狀態發生變化或者 Device 消失時，ListAndWatch
        // 會返回新的列表。
        rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

        // Allocate 在容器建立期間呼叫，這樣裝置外掛可以執行一些特定於裝置的操作，
        // 並告訴 kubelet 如何令 Device 可在容器中訪問的所需執行的具體步驟
        rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

        // GetPreferredAllocation 從一組可用的裝置中返回一些優選的裝置用來分配，
        // 所返回的優選分配結果不一定會是裝置管理器的最終分配方案。
        // 此介面的設計僅是為了讓裝置管理器能夠在可能的情況下做出更有意義的決定。
        rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

        // PreStartContainer 在裝置外掛註冊階段根據需要被呼叫，呼叫發生在容器啟動之前。
        // 在將裝置提供給容器使用之前，裝置外掛可以執行一些諸如重置裝置之類的特定於
        // 具體裝置的操作，
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
  外掛並非必須為 `GetPreferredAllocation()` 或 `PreStartContainer()` 提供有用
  的實現邏輯，呼叫 `GetDevicePluginOptions()` 時所返回的 `DevicePluginOptions`
  訊息中應該設定這些呼叫是否可用。`kubelet` 在真正呼叫這些函式之前，總會呼叫
  `GetDevicePluginOptions()` 來檢視是否存在這些可選的函式。
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
* 外掛透過 Unix socket 在主機路徑 `/var/lib/kubelet/device-plugins/kubelet.sock`
  處向 kubelet 註冊自身。
* 成功註冊自身後，裝置外掛將以服務模式執行，在此期間，它將持續監控裝置執行狀況，
  並在裝置狀態發生任何變化時向 kubelet 報告。它還負責響應 `Allocate` gRPC 請求。
  在 `Allocate` 期間，裝置外掛可能還會做一些裝置特定的準備；例如 GPU 清理或 QRNG 初始化。
  如果操作成功，則裝置外掛將返回 `AllocateResponse`，其中包含用於訪問被分配的裝置容器執行時的配置。
  kubelet 將此資訊傳遞到容器執行時。

<!--
### Handling kubelet restarts

A device plugin is expected to detect kubelet restarts and re-register itself with the new
kubelet instance. In the current implementation, a new kubelet instance deletes all the existing Unix sockets
under `/var/lib/kubelet/device-plugins` when it starts. A device plugin can monitor the deletion
of its Unix socket and re-register itself upon such an event.
-->
### 處理 kubelet 重啟

裝置外掛應能監測到 kubelet 重啟，並且向新的 kubelet 例項來重新註冊自己。
在當前實現中，當 kubelet 重啟的時候，新的 kubelet 例項會刪除 `/var/lib/kubelet/device-plugins`
下所有已經存在的 Unix 套接字。
裝置外掛需要能夠監控到它的 Unix 套接字被刪除，並且當發生此類事件時重新註冊自己。

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
## 裝置外掛部署

你可以將你的裝置外掛作為節點作業系統的軟體包來部署、作為 DaemonSet 來部署或者手動部署。

規範目錄 `/var/lib/kubelet/device-plugins` 是需要特權訪問的，所以裝置外掛
必須要在被授權的安全的上下文中執行。
如果你將裝置外掛部署為 DaemonSet，`/var/lib/kubelet/device-plugins` 目錄必須要在外掛的
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中宣告作為 {{< glossary_tooltip term_id="volume" >}} 被掛載到外掛中。

如果你選擇 DaemonSet 方法，你可以透過 Kubernetes 進行以下操作：
將裝置外掛的 Pod 放置在節點上，在出現故障後重新啟動守護程序 Pod，來進行自動升級。

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
## API 相容性

Kubernetes 裝置外掛支援還處於 beta 版本。所以在穩定版本出來之前 API 會以不相容的方式進行更改。
作為一個專案，Kubernetes 建議裝置外掛開發者：

* 注意未來版本的更改
* 支援多個版本的裝置外掛 API，以實現向後/向前相容性。

如果你啟用 DevicePlugins 功能，並在需要升級到 Kubernetes 版本來獲得較新的裝置外掛 API
版本的節點上執行裝置外掛，請在升級這些節點之前先升級裝置外掛以支援這兩個版本。
採用該方法將確保升級期間裝置分配的連續執行。

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
## 監控裝置外掛資源

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

為了監控裝置外掛提供的資源，監控代理程式需要能夠發現節點上正在使用的裝置，
並獲取元資料來描述哪個指標與容器相關聯。
裝置監控代理暴露給 [Prometheus](https://prometheus.io/) 的指標應該遵循
[Kubernetes Instrumentation Guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md)，
使用 `pod`、`namespace` 和 `container` 標籤來標識容器。

<!--
The kubelet provides a gRPC service to enable discovery of in-use devices, and to provide metadata
for these devices:
-->
kubelet 提供了 gRPC 服務來使得正在使用中的裝置被發現，並且還未這些裝置提供了元資料：

```gRPC
// PodResourcesLister 是一個由 kubelet 提供的服務，用來提供供節點上 
// Pods 和容器使用的節點資源的資訊
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
}
```

### `List` gRPC 端點 {#grpc-endpoint-list}

<!--
The `List` endpoint provides information on resources of running pods, with details such as the
id of exclusively allocated CPUs, device id as it was reported by device plugins and id of
the NUMA node where these devices are allocated. Also, for NUMA-based machines, it contains
the information about memory and hugepages reserved for a container.
-->
這一 `List` 端點提供執行中 Pods 的資源資訊，包括類似獨佔式分配的
CPU ID、裝置外掛所報告的裝置 ID 以及這些裝置分配所處的 NUMA 節點 ID。
此外，對於基於 NUMA 的機器，它還會包含為容器保留的記憶體和大頁的資訊。

```gRPC
// ListPodResourcesResponse 是 List 函式的響應
message ListPodResourcesResponse {
    repeated PodResources pod_resources = 1;
}

// PodResources 包含關於分配給 Pod 的節點資源的資訊
message PodResources {
    string name = 1;
    string namespace = 2;
    repeated ContainerResources containers = 3;
}

// ContainerResources 包含分配給容器的資源的資訊
message ContainerResources {
    string name = 1;
    repeated ContainerDevices devices = 2;
    repeated int64 cpu_ids = 3;
    repeated ContainerMemory memory = 4;
}

// ContainerMemory 包含分配給容器的記憶體和大頁資訊
message ContainerMemory {
    string memory_type = 1;
    uint64 size = 2;
    TopologyInfo topology = 3;
}

// Topology 描述資源的硬體拓撲結構
message TopologyInfo {
        repeated NUMANode nodes = 1;
}

// NUMA 代表的是 NUMA 節點
message NUMANode {
        int64 ID = 1;
}

// ContainerDevices 包含分配給容器的裝置資訊
message ContainerDevices {
    string resource_name = 1;
    repeated string device_ids = 2;
    TopologyInfo topology = 3;
}
```

<!--
{{< note >}}
cpu_ids in the `ContainerResources` in the `List` endpoint correspond to exclusive CPUs allocated
to a partilar container. If the goal is to evaluate CPUs that belong to the shared pool, the `List`
endpoint needs to be used in conjunction with the `GetAllocatableResources` endpoint as explained
below:
1. Call `GetAllocatableResources` to get a list of all the allocatable CPUs
2. Call `GetCpuIds` on all `ContainerResources` in the system
3. Subtract out all of the CPUs from the `GetCpuIds` calls from the `GetAllocatableResources` call
{{< /note >}}
-->
{{< note >}}
`List` 端點中的 `ContainerResources` 中的 cpu_ids 對應於分配給某個容器的專屬 CPU。
如果要統計共享池中的 CPU，`List` 端點需要與 `GetAllocatableResources` 端點一起使用，如下所述:

1. 呼叫 `GetAllocatableResources` 獲取所有可用的 CPUs。
2. 在系統中所有的 `ContainerResources` 上呼叫 `GetCpuIds`。
3. 用 `GetAllocatableResources` 獲取的 CPU 數減去 `GetCpuIds` 獲取的 CPU 數。
{{< /note >}}

### `GetAllocatableResources` gRPC 端點 {#grpc-endpoint-getallocatableresources}

{{< feature-state state="beta" for_k8s_version="v1.23" >}}

<!--
GetAllocatableResources provides information on resources initially available on the worker node.
It provides more information than kubelet exports to APIServer.
-->
端點 `GetAllocatableResources` 提供工作節點上原始可用的資源資訊。
此端點所提供的資訊比匯出給 API 伺服器的資訊更豐富。

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
`GetAllocatableResources` 應該僅被用於評估一個節點上的[可分配的](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
資源。如果目標是評估空閒/未分配的資源，此呼叫應該與 List() 端點一起使用。
除非暴露給 kubelet 的底層資源發生變化 否則 `GetAllocatableResources` 得到的結果將保持不變。
這種情況很少發生，但當發生時（例如：熱插拔，裝置健康狀況改變），客戶端應該呼叫 `GetAlloctableResources` 端點。
然而，呼叫 `GetAllocatableResources` 端點在 cpu、記憶體被更新的情況下是不夠的，
Kubelet 需要重新啟動以獲取正確的資源容量和可分配的資源。
{{< /note >}}


```gRPC
// AllocatableResourcesResponses 包含 kubelet 所瞭解到的所有裝置的資訊
message AllocatableResourcesResponse {
    repeated ContainerDevices devices = 1;
    repeated int64 cpu_ids = 2;
    repeated ContainerMemory memory = 3;
}

```

<!--
Starting from Kubernetes v1.23, the `GetAllocatableResources` is enabled by default.
You can disable it by turning off the
`KubeletPodResourcesGetAllocatable` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

Preceding Kubernetes v1.23, to enable this feature `kubelet` must be started with the following flag:

`--feature-gates=KubeletPodResourcesGetAllocatable=true`
-->
從 Kubernetes v1.23 開始，`GetAllocatableResources` 被預設啟用。
你可以透過關閉 `KubeletPodResourcesGetAllocatable`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) 來禁用。

在 Kubernetes v1.23 之前，要啟用這一功能，`kubelet` 必須用以下標誌啟動：

`--feature-gates=KubeletPodResourcesGetAllocatable=true`

<!--
`ContainerDevices` do expose the topology information declaring to which NUMA cells the device is affine.
The NUMA cells are identified using a opaque integer ID, which value is consistent to what device
plugins report [when they register themselves to the kubelet](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).
-->
`ContainerDevices` 會向外提供各個裝置所隸屬的 NUMA 單元這類拓撲資訊。
NUMA 單元透過一個整數 ID 來標識，其取值與裝置外掛所報告的一致。
[裝置外掛註冊到 kubelet 時](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
會報告這類資訊。

<!--
The gRPC service is served over a unix socket at `/var/lib/kubelet/pod-resources/kubelet.sock`.
Monitoring agents for device plugin resources can be deployed as a daemon, or as a DaemonSet.
The canonical directory `/var/lib/kubelet/pod-resources` requires privileged access, so monitoring
agents must run in a privileged security context.  If a device monitoring agent is running as a
DaemonSet, `/var/lib/kubelet/pod-resources` must be mounted as a
{{< glossary_tooltip term_id="volume" >}} in the device monitoring agent's
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

Support for the `PodResourcesLister service` requires `KubeletPodResources` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled.
It is enabled by default starting with Kubernetes 1.15 and is v1 since Kubernetes 1.20.
-->
gRPC 服務透過 `/var/lib/kubelet/pod-resources/kubelet.sock` 的 UNIX 套接字來提供服務。
裝置外掛資源的監控代理程式可以部署為守護程序或者 DaemonSet。
規範的路徑 `/var/lib/kubelet/pod-resources` 需要特權來進入，
所以監控代理程式必須要在獲得授權的安全的上下文中執行。
如果裝置監控代理以 DaemonSet 形式執行，必須要在外掛的
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中宣告將 `/var/lib/kubelet/pod-resources` 目錄以
{{< glossary_tooltip text="卷" term_id="volume" >}}的形式被掛載到裝置監控代理中。

對“PodResourcesLister 服務”的支援要求啟用 `KubeletPodResources`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
從 Kubernetes 1.15 開始預設啟用，自從 Kubernetes 1.20 開始為 v1。

<!--
## Device Plugin integration with the Topology Manager

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}


The Topology Manager is a Kubelet component that allows resources to be co-ordinated in a Topology aligned manner. In order to do this, the Device Plugin API was extended to include a `TopologyInfo` struct.
-->
## 裝置外掛與拓撲管理器的整合

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

拓撲管理器是 Kubelet 的一個元件，它允許以拓撲對齊方式來排程資源。
為了做到這一點，裝置外掛 API 進行了擴充套件來包括一個 `TopologyInfo` 結構體。

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
裝置外掛希望拓撲管理器可以將填充的 TopologyInfo 結構體作為設備註冊的一部分以及裝置 ID
和裝置的執行狀況傳送回去。然後裝置管理器將使用此資訊來諮詢拓撲管理器並做出資源分配決策。

`TopologyInfo` 支援定義 `nodes` 欄位，允許為 `nil`（預設）或者是一個 NUMA 節點的列表。
這樣就可以使裝置外掛可以跨越 NUMA 節點去釋出。

下面是一個由裝置外掛為裝置填充 `TopologyInfo` 結構體的示例：

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

<!--
## Device plugin examples {#examples}

Here are some examples of device plugin implementations:

* The [AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
* The [Intel device plugins](https://github.com/intel/intel-device-plugins-for-kubernetes) for Intel GPU, FPGA and QuickAssist devices
* The [KubeVirt device plugins](https://github.com/kubevirt/kubernetes-device-plugins) for hardware-assisted virtualization
* The [NVIDIA GPU device plugin for Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* The [RDMA device plugin](https://github.com/hustcat/k8s-rdma-device-plugin)
* The [Solarflare device plugin](https://github.com/vikaschoudhary16/sfc-device-plugin)
* The [SR-IOV Network device plugin](https://github.com/intel/sriov-network-device-plugin)
* The [Xilinx FPGA device plugins](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-fpga-device-plugin) for Xilinx FPGA devices
-->
## 裝置外掛示例 {#examples}

下面是一些裝置外掛實現的示例：

* [AMD GPU 裝置外掛](https://github.com/RadeonOpenCompute/k8s-device-plugin)
* [Intel 裝置外掛](https://github.com/intel/intel-device-plugins-for-kubernetes) 支援 Intel GPU、FPGA 和 QuickAssist 裝置
* [KubeVirt 裝置外掛](https://github.com/kubevirt/kubernetes-device-plugins) 用於硬體輔助的虛擬化
* [為 Container-Optimized OS 所提供的 NVIDIA GPU 裝置外掛](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [RDMA 裝置外掛](https://github.com/hustcat/k8s-rdma-device-plugin)
* [SocketCAN 裝置外掛](https://github.com/collabora/k8s-socketcan)
* [Solarflare 裝置外掛](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [SR-IOV 網路裝置外掛](https://github.com/intel/sriov-network-device-plugin)
* [Xilinx FPGA 裝置外掛](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-fpga-device-plugin)

## {{% heading "whatsnext" %}}

<!--
* Learn about [scheduling GPU resources](/docs/tasks/manage-gpus/scheduling-gpus/) using device plugins
* Learn about [advertising extended resources](/docs/tasks/administer-cluster/extended-resource-node/) on a node
* Learn about the [Topology Manager](/docs/tasks/administer-cluster/topology-manager/)
* Read about using [hardware acceleration for TLS ingress](/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) with Kubernetes
-->
* 檢視[排程 GPU 資源](/zh-cn/docs/tasks/manage-gpus/scheduling-gpus/) 來學習使用裝置外掛
* 檢視在上如何[公佈節點上的擴充套件資源](/zh-cn/docs/tasks/administer-cluster/extended-resource-node/)
* 學習[拓撲管理器](/zh-cn/docs/tasks/administer-cluster/topology-manager/)
* 閱讀如何在 Kubernetes 中使用 [TLS Ingress 的硬體加速](/zh-cn/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/)
