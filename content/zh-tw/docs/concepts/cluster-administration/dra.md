---
title: 集羣管理員使用動態資源分配的良好實踐
content_type: concept
weight: 60
---
<!--
title: Good practices for Dynamic Resource Allocation as a Cluster Admin
content_type: concept
weight: 60
-->

<!-- overview -->
<!--
This page describes good practices when configuring a Kubernetes cluster
utilizing Dynamic Resource Allocation (DRA). These instructions are for cluster
administrators.
-->
本文介紹在利用動態資源分配（DRA）配置 Kubernetes 集羣時的良好實踐。這些指示說明適用於集羣管理員。

<!-- body -->
<!--
## Separate permissions to DRA related APIs

DRA is orchestrated through a number of different APIs. Use authorization tools
(like RBAC, or another solution) to control access to the right APIs depending
on the persona of your user.

In general, DeviceClasses and ResourceSlices should be restricted to admins and
the DRA drivers. Cluster operators that will be deploying Pods with claims will
need access to ResourceClaim and ResourceClaimTemplate APIs; both of these APIs
are namespace scoped.
-->
## 分離 DRA 相關 API 的權限   {#separate-permissions-to-dra-related-apis}

DRA 是通過多個不同的 API 進行編排的。使用鑑權工具（如 RBAC 或其他方案）根據用戶的角色來控制對相關 API 的訪問權限。

通常情況下，DeviceClass 和 ResourceSlice 應僅限管理員和 DRA 驅動訪問。
通過申領機制來部署 Pod 的集羣運維人員將需要訪問 ResourceClaim API 和 ResourceClaimTemplate API。
這兩個 API 的作用範圍都是命名空間。

<!--
## DRA driver deployment and maintenance

DRA drivers are third-party applications that run on each node of your cluster
to interface with the hardware of that node and Kubernetes' native DRA
components. The installation procedure depends on the driver you choose, but is
likely deployed as a DaemonSet to all or a selection of the nodes (using node
selectors or similar mechanisms) in your cluster.
-->
## 部署與維護 DRA 驅動  {#dra-driver-deployment-and-maintenance}

DRA 驅動是運行在集羣的每個節點上的第三方應用，對接節點的硬件和 Kubernetes 原生的 DRA 組件。
安裝方式取決於你所選的驅動，但通常會作爲 DaemonSet 部署到集羣中所有或部分節點上（可使用節點選擇算符或類似機制）。

<!--
### Use drivers with seamless upgrade if available

DRA drivers implement the [`kubeletplugin` package
interface](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin).
Your driver may support _seamless upgrades_ by implementing a property of this
interface that allows two versions of the same DRA driver to coexist for a short
time. This is only available for kubelet versions 1.33 and above and may not be
supported by your driver for heterogeneous clusters with attached nodes running
older versions of Kubernetes - check your driver's documentation to be sure.
-->
### 使用支持無縫升級的驅動（如可用） {#use-drivers-with-seamless-upgrade-if-available}

DRA 驅動實現
[`kubeletplugin` 包接口](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)。
你的驅動可能通過實現此接口的一個屬性，支持兩個版本共存一段時間，從而實現**無縫升級**。
該功能僅適用於 kubelet v1.33 及更高版本，對於運行舊版 Kubernetes 的節點所組成的異構集羣，
可能不支持這種功能。請查閱你的驅動文檔予以確認。

<!--
If seamless upgrades are available for your situation, consider using it to
minimize scheduling delays when your driver updates.

If you cannot use seamless upgrades, during driver downtime for upgrades you may
observe that:
-->
如果你的環境支持無縫升級，建議使用此功能以最大限度地減少驅動升級期間的調度延遲。

如果你無法使用無縫升級，則在升級期間因驅動停機時，你可能會觀察到：

<!--
* Pods cannot start unless the claims they depend on were already prepared for
  use.
* Cleanup after the last pod which used a claim gets delayed until the driver is
  available again. The pod is not marked as terminated. This prevents reusing
  the resources used by the pod for other pods.
* Running pods will continue to run.
-->
* 除非相關申領已準備就緒，否則 Pod 無法啓動。
* 在驅動可能之前，使用了申領的最後一個 Pod 的清理操作將延遲。
  此 Pod 不會被標記爲已終止，這會阻止此 Pod 所用的資源被其他 Pod 重用。
* 運行中的 Pod 將繼續運行。

<!--
### Confirm your DRA driver exposes a liveness probe and utilize it

Your DRA driver likely implements a gRPC socket for healthchecks as part of DRA
driver good practices. The easiest way to utilize this grpc socket is to
configure it as a liveness probe for the DaemonSet deploying your DRA driver.
Your driver's documentation or deployment tooling may already include this, but
if you are building your configuration separately or not running your DRA driver
as a Kubernetes pod, be sure that your orchestration tooling restarts the DRA
driver on failed healthchecks to this grpc socket. Doing so will minimize any
accidental downtime of the DRA driver and give it more opportunities to self
heal, reducing scheduling delays or troubleshooting time.
-->
### 確認你的 DRA 驅動暴露了存活探針並加以利用 {#confirm-your-dra-driver-exposes-a-liveness-probe-and-utilize-it}

你的 DRA 驅動可能已實現用於健康檢查的 gRPC 套接字，這是 DRA 驅動的良好實踐之一。
最簡單的利用方式是將該 grpc 套接字配置爲部署 DRA 驅動 DaemonSet 的存活探針。
驅動文檔或部署工具可能已包括此項配置，但如果你是自行配置或未以 Kubernetes Pod 方式運行 DRA 驅動，
確保你的編排工具在該 grpc 套接字健康檢查失敗時能重啓驅動。這樣可以最大程度地減少 DRA 驅動的意外停機，
並提升其自我修復能力，從而減少調度延遲或排障時間。

<!--
### When draining a node, drain the DRA driver as late as possible

The DRA driver is responsible for unpreparing any devices that were allocated to
Pods, and if the DRA driver is {{< glossary_tooltip text="drained"
term_id="drain" >}} before Pods with claims have been deleted, it will not be
able to finalize its cleanup. If you implement custom drain logic for nodes,
consider checking that there are no allocated/reserved ResourceClaim or
ResourceClaimTemplates before terminating the DRA driver itself.
-->
### 騰空節點時儘可能最後再騰空 DRA 驅動  {#when-draining-a-node-drain-the-dra-driver-as-late-as-possible}

DRA 驅動負責取消爲 Pod 分配的任意設備的就緒狀態。如果在具有申領的 Pod 被刪除之前 DRA
驅動就被{{< glossary_tooltip text="騰空" term_id="drain" >}}，它將無法完成清理流程。
如果你實現了自定義的節點騰空邏輯，建議在終止 DRA 驅動之前檢查是否存在已分配/已保留的
ResourceClaim 或 ResourceClaimTemplate。

<!--
## Monitor and tune components for higher load, especially in high scale environments

Control plane component {{< glossary_tooltip text="kube-scheduler"
term_id="kube-scheduler" >}} and the internal ResourceClaim controller
orchestrated by the component {{< glossary_tooltip
text="kube-controller-manager" term_id="kube-controller-manager" >}} do the
heavy lifting during scheduling of Pods with claims based on metadata stored in
the DRA APIs. Compared to non-DRA scheduled Pods, the number of API server
calls, memory, and CPU utilization needed by these components is increased for
Pods using DRA claims. In addition, node local components like the DRA driver
and kubelet utilize DRA APIs to allocated the hardware request at Pod sandbox
creation time. Especially in high scale environments where clusters have many
nodes, and/or deploy many workloads that heavily utilize DRA defined resource
claims, the cluster administrator should configure the relevant components to
anticipate the increased load.
-->
## 在大規模環境中在高負載場景下監控和調優組件  {#monitor-and-tune-components-for-higher-load-especially-in-high-scale-environments}

控制面組件 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
以及 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
中的內部 ResourceClaim 控制器在調度使用 DRA 申領的 Pod 時承擔了大量任務。與不使用 DRA 的 Pod 相比，
這些組件所需的 API 服務器調用次數、內存和 CPU 使用率都更高。此外，
節點本地組件（如 DRA 驅動和 kubelet）也在創建 Pod 沙箱時使用 DRA API 分配硬件請求資源。
尤其在集羣節點數量衆多或大量工作負載依賴 DRA 定義的資源申領時，
集羣管理員應當預先爲相關組件配置合理參數以應對增加的負載。

<!--
The effects of mistuned components can have direct or snowballing affects
causing different symptoms during the Pod lifecycle. If the `kube-scheduler`
component's QPS and burst configurations are too low, the scheduler might
quickly identify a suitable node for a Pod but take longer to bind the Pod to
that node. With DRA, during Pod scheduling, the QPS and Burst parameters in the
client-go configuration within `kube-controller-manager` are critical.
-->
組件配置不當可能會直接或連鎖地影響 Pod 生命週期中的多個環節。例如，如果 `kube-scheduler`
組件的 QPS 和 Burst 配置值過低，調度器可能能快速識別適合的節點，但綁定 Pod 到節點的過程則會變慢。
在使用 DRA 的調度流程中，`kube-controller-manager` 中 client-go 的 QPS 和 Burst 參數尤爲關鍵。

<!--
The specific values to tune your cluster to depend on a variety of factors like
number of nodes/pods, rate of pod creation, churn, even in non-DRA environments;
see the [SIG Scalability README on Kubernetes scalability
 thresholds](https://github.com/kubernetes/community/blob/master/sig-scalability/configs-and-limits/thresholds.md)
for more information. In scale tests performed against a DRA enabled cluster
with 100 nodes, involving 720 long-lived pods (90% saturation) and 80 churn pods
(10% churn, 10 times), with a job creation QPS of 10, `kube-controller-manager`
QPS could be set to as low as 75 and Burst to 150 to meet equivalent metric
targets for non-DRA deployments. At this lower bound, it was observed that the
client side rate limiter was triggered enough to protect the API server from
explosive burst but was high enough that pod startup SLOs were not impacted.
While this is a good starting point, you can get a better idea of how to tune
the different components that have the biggest effect on DRA performance for
your deployment by monitoring the following metrics. For more information on all
the stable metrics in Kubernetes, see the [Kubernetes Metrics
Reference](/docs/reference/generated/metrics/).
-->
集羣調優所需的具體數值取決於多個因素，如節點/Pod 數量、Pod 創建速率、變化頻率，甚至與是否使用 DRA 無關。更多信息請參考
[SIG Scalability README 中的可擴縮性閾值](https://github.com/kubernetes/community/blob/master/sig-scalability/configs-and-limits/thresholds.md)。
在一項針對啓用了 DRA 的 100 節點集羣的規模測試中，部署了 720 個長生命週期 Pod（90% 飽和度）和 80
個短週期 Pod（10% 流失，重複 10 次），作業創建 QPS 爲 10。將 `kube-controller-manager` 的 QPS
設置爲 75、Burst 設置爲 150，能達到與非 DRA 部署中相同的性能指標。在這個下限設置下，
客戶端速率限制器能有效保護 API 服務器避免突發請求，同時不影響 Pod 啓動 SLO。
這可作爲一個良好的起點。你可以通過監控下列指標，進一步判斷對 DRA 性能影響最大的組件，從而優化其配置。
有關 Kubernetes 中所有穩定指標的更多信息，請參閱 [Kubernetes 指標參考](/zh-cn/docs/reference/generated/metrics/)。

<!--
### `kube-controller-manager` metrics

The following metrics look closely at the internal ResourceClaim controller
managed by the `kube-controller-manager` component.
-->
### `kube-controller-manager` 指標  {#kube-controller-manager-metrics}

以下指標聚焦於由 `kube-controller-manager` 組件管理的內部 ResourceClaim 控制器：

<!--
* Workqueue Add Rate: Monitor {{< highlight promql "hl_inline=true"  >}} sum(rate(workqueue_adds_total{name="resource_claim"}[5m])) {{< /highlight >}} to gauge how quickly items are added to the ResourceClaim controller.
* Workqueue Depth: Track
  {{< highlight promql "hl_inline=true" >}}sum(workqueue_depth{endpoint="kube-controller-manager",
  name="resource_claim"}){{< /highlight >}} to identify any backlogs in the ResourceClaim
  controller.
* Workqueue Work Duration: Observe {{< highlight promql "hl_inline=true">}}histogram_quantile(0.99,
  sum(rate(workqueue_work_duration_seconds_bucket{name="resource_claim"}[5m]))
  by (le)){{< /highlight >}} to understand the speed at which the ResourceClaim controller
  processes work.
-->
* 工作隊列添加速率：監控 {{< highlight promql "hl_inline=true"  >}}sum(rate(workqueue_adds_total{name="resource_claim"}[5m])){{< /highlight >}}，
  以衡量任務加入 ResourceClaim 控制器的速度。
* 工作隊列深度：跟蹤 {{< highlight promql "hl_inline=true" >}}sum(workqueue_depth{endpoint="kube-controller-manager", name="resource_claim"}){{< /highlight >}}，
  識別 ResourceClaim 控制器中是否存在積壓。
* 工作隊列處理時長：觀察
  {{< highlight promql "hl_inline=true">}}histogram_quantile(0.99, sum(rate(workqueue_work_duration_seconds_bucket{name="resource_claim"}[5m])) by (le)){{< /highlight >}}，
  以瞭解 ResourceClaim 控制器的處理速度。

<!--
If you are experiencing low Workqueue Add Rate, high Workqueue Depth, and/or
high Workqueue Work Duration, this suggests the controller isn't performing
optimally. Consider tuning parameters like QPS, burst, and CPU/memory
configurations.

If you are experiencing high Workequeue Add Rate, high Workqueue Depth, but
reasonable Workqueue Work Duration, this indicates the controller is processing
work, but concurrency might be insufficient. Concurrency is hardcoded in the
controller, so as a cluster administrator, you can tune for this by reducing the
pod creation QPS, so the add rate to the resource claim workqueue is more
manageable.
-->
如果你觀察到工作隊列添加速率低、工作隊列深度高和/或工作隊列處理時間長，
則說明控制器性能可能不理想。你可以考慮調優 QPS、Burst 以及 CPU/內存配置。

如果你觀察到工作隊列添加速率高、工作隊列深度高，但工作隊列處理時間合理，
則說明控制器正在有效處理任務，但併發可能不足。由於控制器併發是硬編碼的，
所以集羣管理員可以通過降低 Pod 創建 QPS 來減緩資源申領任務隊列的壓力。

<!--
### `kube-scheduler` metrics

The following scheduler metrics are high level metrics aggregating performance
across all Pods scheduled, not just those using DRA. It is important to note
that the end-to-end metrics are ultimately influenced by the
`kube-controller-manager`'s performance in creating ResourceClaims from
ResourceClainTemplates in deployments that heavily use ResourceClainTemplates.
-->
### `kube-scheduler` 指標 {#kube-scheduler-metrics}

以下調度器指標是所有 Pod 的整體性能聚合指標，不僅限於使用 DRA 的 Pod。需注意，
這些端到端指標最終也會受到 `kube-controller-manager` 創建 ResourceClaim
的性能影響，尤其在廣泛使用 ResourceClaimTemplate 的部署中。

<!--
* Scheduler End-to-End Duration: Monitor {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(increase(scheduler_pod_scheduling_sli_duration_seconds_bucket[5m])) by
  (le)){{< /highlight >}}.
* Scheduler Algorithm Latency: Track {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(increase(scheduler_scheduling_algorithm_duration_seconds_bucket[5m])) by
  (le)){{< /highlight >}}.
-->
* 調度器端到端耗時：監控
  {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(increase(scheduler_pod_scheduling_sli_duration_seconds_bucket[5m])) by (le)){{< /highlight >}}。
* 調度器算法延遲：跟蹤
  {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(increase(scheduler_scheduling_algorithm_duration_seconds_bucket[5m])) by (le)){{< /highlight >}}。

<!--
### `kubelet` metrics

When a Pod bound to a node must have a ResourceClaim satisfied, kubelet calls
the `NodePrepareResources` and `NodeUnprepareResources` methods of the DRA
driver. You can observe this behavior from the kubelet's point of view with the
following metrics.
-->
### `kubelet` 指標  {#kubelet-metrics}

當綁定到節點的 Pod 必須滿足 ResourceClaim 時，kubelet 會調用 DRA 驅動的
`NodePrepareResources` 和 `NodeUnprepareResources` 方法。你可以通過以下指標從 kubelet 的角度觀察其行爲。

<!--
* Kubelet NodePrepareResources: Monitor {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_operations_duration_seconds_bucket{operation_name="PrepareResources"}[5m]))
  by (le)){{< /highlight >}}.
* Kubelet NodeUnprepareResources: Track {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_operations_duration_seconds_bucket{operation_name="UnprepareResources"}[5m]))
  by (le)){{< /highlight >}}.
-->
* kubelet 調用 PrepareResources：監控
  {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_operations_duration_seconds_bucket{operation_name="PrepareResources"}[5m])) by (le)){{< /highlight >}}。
* kubelet 調用 UnprepareResources：跟蹤
  {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_operations_duration_seconds_bucket{operation_name="UnprepareResources"}[5m])) by (le)){{< /highlight >}}。
<!--
### DRA kubeletplugin operations

DRA drivers implement the [`kubeletplugin` package
interface](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
which surfaces its own metric for the underlying gRPC operation
`NodePrepareResources` and `NodeUnprepareResources`. You can observe this
behavior from the point of view of the internal kubeletplugin with the following
metrics.
-->
### DRA kubeletplugin 操作  {#dra-kubeletplugin-operations}

DRA 驅動實現 [`kubeletplugin` 包接口](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)，
該接口會針對底層 gRPC 操作 `NodePrepareResources` 和 `NodeUnprepareResources` 暴露指標。
你可以從內部 kubeletplugin 的角度通過以下指標觀察其行爲：

<!--
* DRA kubeletplugin gRPC NodePrepareResources operation: Observe {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodePrepareResources"}[5m]))
  by (le)){{< /highlight >}}.
* DRA kubeletplugin gRPC NodeUnprepareResources operation: Observe {{< highlight promql "hl_inline=true" >}} histogram_quantile(0.99,
  sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodeUnprepareResources"}[5m]))
  by (le)){{< /highlight >}}.
-->
* DRA kubeletplugin 的 NodePrepareResources 操作：觀察
  {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodePrepareResources"}[5m])) by (le)){{< /highlight >}}。
* DRA kubeletplugin 的 NodeUnprepareResources 操作：觀察
  {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodeUnprepareResources"}[5m])) by (le)){{< /highlight >}}。

## {{% heading "whatsnext" %}}

<!--
* [Learn more about
  DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
* Read the [Kubernetes Metrics
  Reference](/docs/reference/generated/metrics/)
-->
* [進一步瞭解 DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* 閱讀 [Kubernetes 指標參考](/zh-cn/docs/reference/generated/metrics/)
