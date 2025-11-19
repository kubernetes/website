---
title: 設備插件
description: > 
  設備插件可以讓你配置集羣以支持需要特定於供應商設置的設備或資源，例如 GPU、NIC、FPGA 或非易失性主存儲器。
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
Kubernetes 提供了一個設備插件框架，你可以用它來將系統硬件資源發佈到
{{< glossary_tooltip term_id="kubelet" >}}。

供應商可以實現設備插件，由你手動部署或作爲 {{< glossary_tooltip term_id="daemonset" >}}
來部署，而不必定製 Kubernetes 本身的代碼。目標設備包括 GPU、高性能 NIC、FPGA、
InfiniBand 適配器以及其他類似的、可能需要特定於供應商的初始化和設置的計算資源。

<!-- body -->

<!--
## Device plugin registration
-->
## 註冊設備插件    {#device-plugin-registration}

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
-->
設備插件可以通過此 gRPC 服務在 kubelet 進行註冊。在註冊期間，設備插件需要發送下面幾樣內容：

* 設備插件的 UNIX 套接字。
* 設備插件的 API 版本。
* `ResourceName` 是需要公佈的。這裏 `ResourceName`
  需要遵循[擴展資源命名方案](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)，
  類似於 `vendor-domain/resourcetype`。（比如 NVIDIA GPU 就被公佈爲 `nvidia.com/gpu`。）

<!--
Following a successful registration, the device plugin sends the kubelet the
list of devices it manages, and the kubelet is then in charge of advertising those
resources to the API server as part of the kubelet node status update.
For example, after a device plugin registers `hardware-vendor.example/foo` with the kubelet
and reports two healthy devices on a node, the node status is updated
to advertise that the node has 2 "Foo" devices installed and available.
-->
成功註冊後，設備插件就向 kubelet 發送它所管理的設備列表，然後 kubelet
負責將這些資源發佈到 API 服務器，作爲 kubelet 節點狀態更新的一部分。

比如，設備插件在 kubelet 中註冊了 `hardware-vendor.example/foo`
並報告了節點上的兩個運行狀況良好的設備後，節點狀態將更新以通告該節點已安裝 2 個
"Foo" 設備並且是可用的。

<!--
Then, users can request devices as part of a Pod specification
(see [`container`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)).
Requesting extended resources is similar to how you manage requests and limits for
other resources, with the following differences:
* Extended resources are only supported as integer resources and cannot be overcommitted.
* Devices cannot be shared between containers.
-->
然後，用戶可以請求設備作爲 Pod 規範的一部分，
參見 [Container](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)。
請求擴展資源類似於管理請求和限制的方式，
其他資源，有以下區別：

* 擴展資源僅可作爲整數資源使用，並且不能被過量使用
* 設備不能在容器之間共享

<!--
### Example {#example-pod}
-->
### 示例 {#example-pod}

<!--
Suppose a Kubernetes cluster is running a device plugin that advertises resource `hardware-vendor.example/foo`
on certain nodes. Here is an example of a pod requesting this resource to run a demo workload:
-->
假設 Kubernetes 集羣正在運行一個設備插件，該插件在一些節點上公佈的資源爲 `hardware-vendor.example/foo`。
下面就是一個 Pod 示例，請求此資源以運行一個工作負載的示例：

<!--
```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: demo-pod
spec:
  containers:
    - name: demo-container-1
      image: registry.k8s.io/pause:3.8
      resources:
        limits:
          hardware-vendor.example/foo: 2
#
# This Pod needs 2 of the hardware-vendor.example/foo devices
# and can only schedule onto a Node that's able to satisfy
# that need.
#
# If the Node has more than 2 of those devices available, the
# remainder would be available for other Pods to use.
```
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
      image: registry.k8s.io/pause:3.8
      resources:
        limits:
          hardware-vendor.example/foo: 2
#
# 這個 Pod 需要兩個 hardware-vendor.example/foo 設備
# 而且只能夠調度到滿足需求的節點上
#
# 如果該節點中有 2 個以上的設備可用，其餘的可供其他 Pod 使用
```

<!--
## Device plugin implementation

The general workflow of a device plugin includes the following steps:

1. Initialization. During this phase, the device plugin performs vendor-specific
   initialization and setup to make sure the devices are in a ready state.

1. The plugin starts a gRPC service, with a Unix socket under the host path
   `/var/lib/kubelet/device-plugins/`, that implements the following interfaces:
-->
## 設備插件的實現    {#device-plugin-implementation}

設備插件的常規工作流程包括以下幾個步驟：

1. 初始化。在這個階段，設備插件將執行特定於供應商的初始化和設置，以確保設備處於就緒狀態。

2. 插件使用主機路徑 `/var/lib/kubelet/device-plugins/` 下的 UNIX 套接字啓動一個
   gRPC 服務，該服務實現以下接口：

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
         // GetDevicePluginOptions 返回與設備管理器溝通的選項。
         rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

         // ListAndWatch 返回 Device 列表構成的數據流。
         // 當 Device 狀態發生變化或者 Device 消失時，ListAndWatch
         // 會返回新的列表。
         rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

         // Allocate 在容器創建期間調用，這樣設備插件可以運行一些特定於設備的操作，
         // 並告訴 kubelet 如何令 Device 可在容器中訪問的所需執行的具體步驟
         rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

         // GetPreferredAllocation 從一組可用的設備中返回一些優選的設備用來分配，
         // 所返回的優選分配結果不一定會是設備管理器的最終分配方案。
         // 此接口的設計僅是爲了讓設備管理器能夠在可能的情況下做出更有意義的決定。
         rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

         // PreStartContainer 在設備插件註冊階段根據需要被調用，調用發生在容器啓動之前。
         // 在將設備提供給容器使用之前，設備插件可以運行一些諸如重置設備之類的特定於
         // 具體設備的操作，
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
   插件並非必須爲 `GetPreferredAllocation()` 或 `PreStartContainer()` 提供有用的實現邏輯，
   調用 `GetDevicePluginOptions()` 時所返回的 `DevicePluginOptions`
   消息中應該設置一些標誌，表明這些調用（如果有）是否可用。`kubelet` 在直接調用這些函數之前，總會調用
   `GetDevicePluginOptions()` 來查看哪些可選的函數可用。
   {{< /note >}}

<!--
1. The plugin registers itself with the kubelet through the Unix socket at host
   path `/var/lib/kubelet/device-plugins/kubelet.sock`.
-->
3. 插件通過位於主機路徑 `/var/lib/kubelet/device-plugins/kubelet.sock` 下的 UNIX
   套接字向 kubelet 註冊自身。

   {{< note >}}
   <!--
   The ordering of the workflow is important. A plugin MUST start serving gRPC
   service before registering itself with kubelet for successful registration.
   -->
   工作流程的順序很重要。插件必須在向 kubelet 註冊自己之前開始提供 gRPC 服務，才能保證註冊成功。
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
4. 成功註冊自身後，設備插件將以提供服務的模式運行，在此期間，它將持續監控設備運行狀況，
   並在設備狀態發生任何變化時向 kubelet 報告。它還負責響應 `Allocate` gRPC 請求。
   在 `Allocate` 期間，設備插件可能還會做一些特定於設備的準備；例如 GPU 清理或 QRNG 初始化。
   如果操作成功，則設備插件將返回 `AllocateResponse`，其中包含用於訪問被分配的設備容器運行時的配置。
   kubelet 將此信息傳遞到容器運行時。

   <!--
   An `AllocateResponse` contains zero or more `ContainerAllocateResponse` objects. In these, the
   device plugin defines modifications that must be made to a container's definition to provide
   access to the device. These modifications include:
   -->
   `AllocateResponse` 包含零個或多個 `ContainerAllocateResponse` 對象。
   設備插件在這些對象中給出爲了訪問設備而必須對容器定義所進行的修改。
   這些修改包括：

   <!--
   * [Annotations](/docs/concepts/overview/working-with-objects/annotations/)
   * device nodes
   * environment variables
   * mounts
   * fully-qualified CDI device names
   -->
   * [註解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)
   * 設備節點
   * 環境變量
   * 掛載點
   * 完全限定的 CDI 設備名稱

   {{< note >}}
   <!--
   The processing of the fully-qualified CDI device names by the Device Manager requires
   that the `DevicePluginCDIDevices` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
   is enabled for both the kubelet and the kube-apiserver. This was added as an alpha feature in Kubernetes
   v1.28, graduated to beta in v1.29 and to GA in v1.31.
   -->
   設備管理器處理完全限定的 CDI 設備名稱時，
   需要爲 kubelet 和 kube-apiserver 啓用 `DevicePluginCDIDevices`
   [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
   在 Kubernetes v1.28 版本中作爲 Alpha 特性被加入，在 v1.29 版本中升級爲 Beta 特性並在
   v1.31 版本升級爲穩定可用特性。
   {{< /note >}}

<!--
### Handling kubelet restarts

A device plugin is expected to detect kubelet restarts and re-register itself with the new
kubelet instance. A new kubelet instance deletes all the existing Unix sockets under
`/var/lib/kubelet/device-plugins` when it starts. A device plugin can monitor the deletion
of its Unix socket and re-register itself upon such an event.
-->
### 處理 kubelet 重啓   {#handling-kubelet-restarts}

設備插件應能監測到 kubelet 重啓，並且向新的 kubelet 實例來重新註冊自己。
新的 kubelet 實例啓動時會刪除 `/var/lib/kubelet/device-plugins` 下所有已經存在的 UNIX 套接字。
設備插件需要能夠監控到它的 UNIX 套接字被刪除，並且當發生此類事件時重新註冊自己。

<!--
### Device plugin and unhealthy devices

There are cases when devices fail or are shut down. The responsibility of the Device Plugin
in this case is to notify the kubelet about the situation using the `ListAndWatchResponse` API.
-->
### 設備插件和不健康的設備

有時會發生設備出現故障或者被關閉的情況，這時，設備插件的職責是使用
`ListAndWatch Response` API 將相關情況通報給 kubelet。

<!--
Once a device is marked as unhealthy, the kubelet will decrease the allocatable count
for this resource on the Node to reflect how many devices can be used for scheduling new pods.
Capacity count for the resource will not change.
-->
一旦設備被標記爲不健康，kubelet 將減少節點上此資源的可分配數量，
以反映有多少設備可用於調度新的 Pod，資源的容量數量不會因此發生改變。

<!--
Pods that were assigned to the failed devices will continue be assigned to this device.
It is typical that code relying on the device will start failing and Pod may get
into Failed phase if `restartPolicy` for the Pod was not `Always` or enter the crash loop
otherwise.
-->
分配給故障設備的 Pod 將繼續分配給該設備。
通常情況下，依賴於設備的代碼將開始失敗，如果 Pod 的 `restartPolicy` 不是
`Always`，則 Pod 可能會進入 Failed 階段，否則會進入崩潰循環。

<!--
Before Kubernetes v1.31, the way to know whether or not a Pod is associated with the
failed device is to use the [PodResources API](#monitoring-device-plugin-resources).
-->
在 Kubernetes v1.31 之前，要知道 Pod 是否與故障設備關聯，
可以使用 [PodResources API](#monitoring-device-plugin-resources)。

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

<!--
By enabling the feature gate `ResourceHealthStatus`, the field `allocatedResourcesStatus`
will be added to each container status, within the `.status` for each Pod. The `allocatedResourcesStatus`
field
reports health information for each device assigned to the container.
-->
通過啓用特性門控 `ResourceHealthStatus`，系統將在每個 Pod 的
`.status` 字段中的每個容器狀態內添加 `allocatedResourcesStatus` 字段，
`allocatedResourcesStatus` 字段報告分配給容器的每個設備的健康信息。

<!--
For a failed Pod, or where you suspect a fault, you can use this status to understand whether
the Pod behavior may be associated with device failure. For example, if an accelerator is reporting
an over-temperature event, the `allocatedResourcesStatus` field may be able to report this.
-->
對於發生故障的 Pod，或者你懷疑存在故障的情況，你可以使用此狀態來了解
Pod 行爲是否可能與設備故障有關。例如，如果加速器報告過熱事件，
則 `allocatedResourcesStatus` 字段可能能夠報告此情況。

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
## 設備插件部署   {#device-plugin-deployment}

你可以將你的設備插件作爲節點操作系統的軟件包來部署、作爲 DaemonSet 來部署或者手動部署。

規範目錄 `/var/lib/kubelet/device-plugins` 是需要特權訪問的，
所以設備插件必須要在被授權的安全的上下文中運行。
如果你將設備插件部署爲 DaemonSet，`/var/lib/kubelet/device-plugins` 目錄必須要在插件的
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中聲明作爲 {{< glossary_tooltip term_id="volume" >}} 被掛載到插件中。

如果你選擇 DaemonSet 方法，你可以通過 Kubernetes 進行以下操作：
將設備插件的 Pod 放置在節點上，在出現故障後重新啓動守護進程 Pod，來進行自動升級。

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

之前版本控制方案要求設備插件的 API 版本與 kubelet 的版本完全匹配。
自從此特性在 v1.12 中進階爲 Beta 後，這不再是硬性要求。
API 是版本化的，並且自此特性進階 Beta 後一直表現穩定。
因此，kubelet 升級應該是無縫的，但在穩定之前 API 仍然可能會有變更，還不能保證升級不會中斷。

{{< note >}}
<!--
Although the Device Manager component of Kubernetes is a generally available feature,
the _device plugin API_ is not stable. For information on the device plugin API and
version compatibility, read [Device Plugin API versions](/docs/reference/node/device-plugin-api-versions/).
-->
儘管 Kubernetes 的設備管理器（Device Manager）組件是正式發佈的特性，
但**設備插件 API** 還不穩定。有關設備插件 API 和版本兼容性的信息，
請參閱[設備插件 API 版本](/zh-cn/docs/reference/node/device-plugin-api-versions/)。
{{< /note >}}

<!--
As a project, Kubernetes recommends that device plugin developers:

* Watch for Device Plugin API changes in the future releases.
* Support multiple versions of the device plugin API for backward/forward compatibility.
-->
作爲一個項目，Kubernetes 建議設備插件開發者：

* 注意未來版本中設備插件 API 的變更。
* 支持多個版本的設備插件 API，以實現向後/向前兼容性。

<!--
To run device plugins on nodes that need to be upgraded to a Kubernetes release with
a newer device plugin API version, upgrade your device plugins to support both versions
before upgrading these nodes. Taking that approach will ensure the continuous functioning
of the device allocations during the upgrade.
-->
若在需要升級到具有較新設備插件 API 版本的某個 Kubernetes 版本的節點上運行這些設備插件，
請在升級這些節點之前先升級設備插件以支持這兩個版本。
採用該方法將確保升級期間設備分配的連續運行。

<!--
## Monitoring device plugin resources
-->
## 監控設備插件資源   {#monitoring-device-plugin-resources}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
In order to monitor resources provided by device plugins, monitoring agents need to be able to
discover the set of devices that are in-use on the node and obtain metadata to describe which
container the metric should be associated with. [Prometheus](https://prometheus.io/) metrics
exposed by device monitoring agents should follow the
[Kubernetes Instrumentation Guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/metric-instrumentation.md),
identifying containers using `pod`, `namespace`, and `container` prometheus labels.
-->
爲了監控設備插件提供的資源，監控代理程序需要能夠發現節點上正在使用的設備，
並獲取元數據來描述哪個指標與容器相關聯。
設備監控代理暴露給 [Prometheus](https://prometheus.io/) 的指標應該遵循
[Kubernetes Instrumentation Guidelines（英文）](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/metric-instrumentation.md)，
使用 `pod`、`namespace` 和 `container` 標籤來標識容器。

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
kubelet 提供了 gRPC 服務來使得正在使用中的設備被發現，並且還爲這些設備提供了元數據：

```gRPC
// PodResourcesLister 是一個由 kubelet 提供的服務，用來提供供節點上
// Pod 和容器使用的節點資源的信息
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
    rpc Get(GetPodResourcesRequest) returns (GetPodResourcesResponse) {}
}
```

<!--
### `List` gRPC endpoint {#grpc-endpoint-list}
-->
### `List` gRPC 端點 {#grpc-endpoint-list}

<!--
The `List` endpoint provides information on resources of running pods, with details such as the
id of exclusively allocated CPUs, device id as it was reported by device plugins and id of
the NUMA node where these devices are allocated. Also, for NUMA-based machines, it contains the
information about memory and hugepages reserved for a container.
-->
這一 `List` 端點提供運行中 Pod 的資源信息，包括類似獨佔式分配的
CPU ID、設備插件所報告的設備 ID 以及這些設備分配所處的 NUMA 節點 ID。
此外，對於基於 NUMA 的機器，它還會包含爲容器保留的內存和大頁的信息。

<!--
Starting from Kubernetes v1.27, the `List` endpoint can provide information on resources
of running pods allocated in `ResourceClaims` by the `DynamicResourceAllocation` API.
Starting from Kubernetes v1.34, this feature is enabled by default.
To disable, `kubelet` must be started with the following flags:
-->
從 Kubernetes v1.27 開始，`List` 端點可以通過 `DynamicResourceAllocation` API 提供在
`ResourceClaims` 中分配的當前運行 Pod 的資源信息。
從 Kubernetes v1.34 開始，此特性默認啓用。
要禁用此特性，必須使用以下標誌啓動 `kubelet`：

```
--feature-gates=KubeletPodResourcesDynamicResources=false
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
// ListPodResourcesResponse 是 List 函數的響應
message ListPodResourcesResponse {
    repeated PodResources pod_resources = 1;
}

// PodResources 包含關於分配給 Pod 的節點資源的信息
message PodResources {
    string name = 1;
    string namespace = 2;
    repeated ContainerResources containers = 3;
}

// ContainerResources 包含分配給容器的資源的信息
message ContainerResources {
    string name = 1;
    repeated ContainerDevices devices = 2;
    repeated int64 cpu_ids = 3;
    repeated ContainerMemory memory = 4;
    repeated DynamicResource dynamic_resources = 5;
}

// ContainerMemory 包含分配給容器的內存和大頁信息
message ContainerMemory {
    string memory_type = 1;
    uint64 size = 2;
    TopologyInfo topology = 3;
}

// Topology 描述資源的硬件拓撲結構
message TopologyInfo {
        repeated NUMANode nodes = 1;
}

// NUMA 代表的是 NUMA 節點
message NUMANode {
        int64 ID = 1;
}

// ContainerDevices 包含分配給容器的設備信息
message ContainerDevices {
    string resource_name = 1;
    repeated string device_ids = 2;
    TopologyInfo topology = 3;
}

// DynamicResource 包含通過 Dynamic Resource Allocation 分配到容器的設備信息
message DynamicResource {
    string class_name = 1;
    string claim_name = 2;
    string claim_namespace = 3;
    repeated ClaimResource claim_resources = 4;
}

// ClaimResource 包含每個插件的資源信息
message ClaimResource {
    repeated CDIDevice cdi_devices = 1 [(gogoproto.customname) = "CDIDevices"];
}

// CDIDevice 指定 CDI 設備信息
message CDIDevice {
    // 完全合格的 CDI 設備名稱
    // 例如：vendor.com/gpu=gpudevice1
    // 參閱 CDI 規範中的更多細節：
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
`List` 端點中的 `ContainerResources` 中的 cpu_ids 對應於分配給某個容器的專屬 CPU。
如果要統計共享池中的 CPU，`List` 端點需要與 `GetAllocatableResources` 端點一起使用，如下所述：

1. 調用 `GetAllocatableResources` 獲取所有可用的 CPU。
2. 在系統中所有的 `ContainerResources` 上調用 `GetCpuIds`。
3. 用 `GetAllocatableResources` 獲取的 CPU 數減去 `GetCpuIds` 獲取的 CPU 數。
{{< /note >}}

<!--
### `GetAllocatableResources` gRPC endpoint {#grpc-endpoint-getallocatableresources}
-->
### `GetAllocatableResources` gRPC 端點 {#grpc-endpoint-getallocatableresources}

{{< feature-state state="stable" for_k8s_version="v1.28" >}}

<!--
GetAllocatableResources provides information on resources initially available on the worker node.
It provides more information than kubelet exports to APIServer.
-->
端點 `GetAllocatableResources` 提供工作節點上原始可用的資源信息。
此端點所提供的信息比導出給 API 服務器的信息更豐富。

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
`GetAllocatableResources` 應該僅被用於評估一個節點上的[可分配的](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)資源。
如果目標是評估空閒/未分配的資源，此調用應該與 `List()` 端點一起使用。
除非暴露給 kubelet 的底層資源發生變化，否則 `GetAllocatableResources` 得到的結果將保持不變。
這種情況很少發生，但當發生時（例如：熱插拔，設備健康狀況改變），客戶端應該調用 `GetAlloctableResources` 端點。

然而，調用 `GetAllocatableResources` 端點在 CPU、內存被更新的情況下是不夠的，
kubelet 需要重新啓動以獲取正確的資源容量和可分配的資源。
{{< /note >}}

```gRPC
// AllocatableResourcesResponses 包含 kubelet 所瞭解到的所有設備的信息
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
`ContainerDevices` 會向外提供各個設備所隸屬的 NUMA 單元這類拓撲信息。
NUMA 單元通過一個整數 ID 來標識，其取值與設備插件所報告的一致。
[設備插件註冊到 kubelet 時](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
會報告這類信息。

<!--
The gRPC service is served over a unix socket at `/var/lib/kubelet/pod-resources/kubelet.sock`.
Monitoring agents for device plugin resources can be deployed as a daemon, or as a DaemonSet.
The canonical directory `/var/lib/kubelet/pod-resources` requires privileged access, so monitoring
agents must run in a privileged security context. If a device monitoring agent is running as a
DaemonSet, `/var/lib/kubelet/pod-resources` must be mounted as a
{{< glossary_tooltip term_id="volume" >}} in the device monitoring agent's
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).
-->
gRPC 服務通過 `/var/lib/kubelet/pod-resources/kubelet.sock` 的 UNIX 套接字來提供服務。
設備插件資源的監控代理程序可以部署爲守護進程或者 DaemonSet。
規範的路徑 `/var/lib/kubelet/pod-resources` 需要特權來進入，
所以監控代理程序必須要在獲得授權的安全的上下文中運行。
如果設備監控代理以 DaemonSet 形式運行，必須要在插件的
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中聲明將 `/var/lib/kubelet/pod-resources`
目錄以{{< glossary_tooltip text="卷" term_id="volume" >}}的形式被掛載到設備監控代理中。

{{< note >}}

<!--
When accessing the `/var/lib/kubelet/pod-resources/kubelet.sock` from DaemonSet
or any other app deployed as a container on the host, which is mounting socket as
a volume, it is a good practice to mount directory `/var/lib/kubelet/pod-resources/`
instead of the `/var/lib/kubelet/pod-resources/kubelet.sock`. This will ensure
that after kubelet restart, container will be able to re-connect to this socket.
-->
在從 DaemonSet 或以容器形式部署在主機上的任何其他應用中訪問
`/var/lib/kubelet/pod-resources/kubelet.sock` 時，
如果將套接字作爲卷掛載，最好的做法是掛載目錄 `/var/lib/kubelet/pod-resources/`
而不是 `/var/lib/kubelet/pod-resources/kubelet.sock`。
這樣可以確保在 kubelet 重新啓動後，容器將能夠重新連接到此套接字。

<!--
Container mounts are managed by inode referencing the socket or directory,
depending on what was mounted. When kubelet restarts, socket is deleted
and a new socket is created, while directory stays untouched.
So the original inode for the socket become unusable. Inode to directory
will continue working.
-->
容器掛載是通過引用套接字或目錄的 inode 進行管理的，具體取決於掛載的內容。
當 kubelet 重新啓動時，套接字會被刪除並創建一個新的套接字，而目錄則保持不變。
因此，針對原始套接字的 inode 將變得無法使用，而到目錄的 inode 將繼續正常工作。

{{< /note >}}

<!--
### `Get` gRPC endpoint {#grpc-endpoint-get}
-->
### `Get` gRPC 端點   {#grpc-endpoint-get}

{{< feature-state state="beta" for_k8s_version="v1.34" >}}

<!--
The `Get` endpoint provides information on resources of a running Pod. It exposes information
similar to those described in the `List` endpoint. The `Get` endpoint requires `PodName`
and `PodNamespace` of the running Pod.
-->
`Get` 端點提供了當前運行 Pod 的資源信息。它會暴露與 `List` 端點中所述類似的信息。
`Get` 端點需要當前運行 Pod 的 `PodName` 和 `PodNamespace`。

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
// GetPodResourcesRequest 包含 Pod 相關信息
message GetPodResourcesRequest {
    string pod_name = 1;
    string pod_namespace = 2;
}
```

<!--
To disable this feature, you must start your kubelet services with the following flag:
-->
要禁用此特性，你必須使用以下標誌啓動 kubelet 服務：

```
--feature-gates=KubeletPodResourcesGet=false
```

<!--
The `Get` endpoint can provide Pod information related to dynamic resources
allocated by the dynamic resource allocation API.
Starting from Kubernetes v1.34, this feature is enabled by default.
To disable, `kubelet` must be started with the following flags:
-->
`Get` 端點可以提供與動態資源分配 API 所分配的動態資源相關的 Pod 信息。
從 Kubernetes v1.34 開始，此特性已默認啓用。
要禁用此特性，你必須確保使用以下標誌啓動 kubelet 服務：

```
--feature-gates=KubeletPodResourcesDynamicResources=false
```

<!--
## Device plugin integration with the Topology Manager
-->
## 設備插件與拓撲管理器的集成   {#device-plugin-integration-with-the-topology-manager}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

<!--
The Topology Manager is a Kubelet component that allows resources to be co-ordinated in a Topology
aligned manner. In order to do this, the Device Plugin API was extended to include a
`TopologyInfo` struct.
-->
拓撲管理器是 kubelet 的一個組件，它允許以拓撲對齊方式來調度資源。
爲了做到這一點，設備插件 API 進行了擴展來包括一個 `TopologyInfo` 結構體。

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
設備插件希望拓撲管理器可以將填充的 TopologyInfo 結構體作爲設備註冊的一部分以及設備 ID
和設備的運行狀況發送回去。然後設備管理器將使用此信息來諮詢拓撲管理器並做出資源分配決策。

`TopologyInfo` 支持將 `nodes` 字段設置爲 `nil` 或一個 NUMA 節點的列表。
這樣就可以使設備插件通告跨越多個 NUMA 節點的設備。

將 `TopologyInfo` 設置爲 `nil` 或爲給定設備提供一個空的
NUMA 節點列表表示設備插件沒有該設備的 NUMA 親和偏好。

下面是一個由設備插件爲設備填充 `TopologyInfo` 結構體的示例：

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

<!--
## Device plugin examples {#examples}
-->
## 設備插件示例 {#examples}

{{% thirdparty-content %}}

<!--
Here are some examples of device plugin implementations:

* [Akri](https://github.com/project-akri/akri), which lets you easily expose heterogeneous leaf devices (such as IP cameras and USB devices).
* The [AMD GPU device plugin](https://github.com/ROCm/k8s-device-plugin)
* The [generic device plugin](https://github.com/squat/generic-device-plugin) for generic Linux devices and USB devices
* The [HAMi](https://github.com/Project-HAMi/HAMi) for heterogeneous AI computing virtualization middleware (for example, NVIDIA, Cambricon, Hygon, Iluvatar, MThreads, Ascend, Metax)
* The [Intel device plugins](https://github.com/intel/intel-device-plugins-for-kubernetes) for
  Intel GPU, FPGA, QAT, VPU, SGX, DSA, DLB and IAA devices
* The [KubeVirt device plugins](https://github.com/kubevirt/kubernetes-device-plugins) for
  hardware-assisted virtualization
* The [NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin), NVIDIA's 
  official device plugin to expose NVIDIA GPUs and monitor GPU health
* The [NVIDIA GPU device plugin for Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* The [RDMA device plugin](https://github.com/hustcat/k8s-rdma-device-plugin)
* The [SocketCAN device plugin](https://github.com/collabora/k8s-socketcan)
* The [Solarflare device plugin](https://github.com/vikaschoudhary16/sfc-device-plugin)
* The [SR-IOV Network device plugin](https://github.com/intel/sriov-network-device-plugin)
* The [Xilinx FPGA device plugins](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin) for Xilinx FPGA devices
-->
下面是一些設備插件實現的示例：

* [Akri](https://github.com/project-akri/akri)，它可以讓你輕鬆公開異構葉子設備（例如 IP 攝像機和 USB 設備）。
* [AMD GPU 設備插件](https://github.com/ROCm/k8s-device-plugin)
* 適用於通用 Linux 設備和 USB 設備的[通用設備插件](https://github.com/squat/generic-device-plugin)
* 用於異構 AI 計算虛擬化中間件（例如 NVIDIA、Cambricon、Hygon、Iluvatar、MThreads、Ascend、Metax 設備）的
  [HAMi](https://github.com/Project-HAMi/HAMi)
* [Intel 設備插件](https://github.com/intel/intel-device-plugins-for-kubernetes)支持
  Intel GPU、FPGA、QAT、VPU、SGX、DSA、DLB 和 IAA 設備
* [KubeVirt 設備插件](https://github.com/kubevirt/kubernetes-device-plugins)用於硬件輔助的虛擬化
* [NVIDIA GPU 設備插件](https://github.com/NVIDIA/k8s-device-plugin)NVIDIA 的官方設備插件，
  用於公佈 NVIDIA GPU 和監控 GPU 健康狀態。
* [爲 Container-Optimized OS 所提供的 NVIDIA GPU 設備插件](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [RDMA 設備插件](https://github.com/hustcat/k8s-rdma-device-plugin)
* [SocketCAN 設備插件](https://github.com/collabora/k8s-socketcan)
* [Solarflare 設備插件](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [SR-IOV 網絡設備插件](https://github.com/intel/sriov-network-device-plugin)
* [Xilinx FPGA 設備插件](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin)

## {{% heading "whatsnext" %}}

<!--
* Learn about [scheduling GPU resources](/docs/tasks/manage-gpus/scheduling-gpus/) using device
  plugins
* Learn about [advertising extended resources](/docs/tasks/administer-cluster/extended-resource-node/)
  on a node
* Learn about the [Topology Manager](/docs/tasks/administer-cluster/topology-manager/)
* Read about using [hardware acceleration for TLS ingress](/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/)
  with Kubernetes
* Read more about [Extended Resource allocation by DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
-->
* 查看[調度 GPU 資源](/zh-cn/docs/tasks/manage-gpus/scheduling-gpus/)來學習使用設備插件
* 查看在節點上如何[公佈擴展資源](/zh-cn/docs/tasks/administer-cluster/extended-resource-node/)
* 學習[拓撲管理器](/zh-cn/docs/tasks/administer-cluster/topology-manager/)
* 閱讀如何在 Kubernetes 中使用 [TLS Ingress 的硬件加速](/zh-cn/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/)
* 閱讀更多關於[使用 DRA 分配擴展資源](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
