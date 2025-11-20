---
title: 調整分配給容器的 CPU 和內存資源
content_type: task
weight: 30
min-kubernetes-server-version: 1.33
---
<!--
title: Resize CPU and Memory Resources assigned to Containers
content_type: task
weight: 30
min-kubernetes-server-version: 1.33
-->

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

<!--
This page explains how to change the CPU and memory resource requests and limits
assigned to a container *without recreating the Pod*.
-->
本頁面說明了如何在**不重新創建 Pod** 的情況下，更改分配給容器的 CPU 和內存資源請求與限制。

<!--
Traditionally, changing a Pod's resource requirements necessitated deleting the existing Pod
and creating a replacement, often managed by a [workload controller](/docs/concepts/workloads/controllers/).
In-place Pod Resize allows changing the CPU/memory allocation of container(s) within a running Pod
while potentially avoiding application disruption.
-->
傳統上，更改 Pod 的資源需求需要刪除現有 Pod 並創建一個替代 Pod，
這通常由[工作負載控制器](/zh-cn/docs/concepts/workloads/controllers/)管理。
而就地 Pod 調整功能允許在運行中的 Pod 內變更容器的 CPU 和內存分配，從而可能避免干擾應用。

<!--
**Key Concepts:**

* **Desired Resources:** A container's `spec.containers[*].resources` represent
  the *desired* resources for the container, and are mutable for CPU and memory.
* **Actual Resources:** The `status.containerStatuses[*].resources` field
  reflects the resources *currently configured* for a running container.
  For containers that haven't started or were restarted,
  it reflects the resources allocated upon their next start.
* **Triggering a Resize:** You can request a resize by updating the desired `requests`
  and `limits` in the Pod's specification.
  This is typically done using `kubectl patch`, `kubectl apply`, or `kubectl edit`
  targeting the Pod's `resize` subresource.
  When the desired resources don't match the allocated resources,
  the Kubelet will attempt to resize the container.
* **Allocated Resources (Advanced):**
  The `status.containerStatuses[*].allocatedResources` field tracks resource values
  confirmed by the Kubelet, primarily used for internal scheduling logic.
  For most monitoring and validation purposes, focus on `status.containerStatuses[*].resources`.
-->
**關鍵概念：**

- **期望資源（Desired Resources）**：容器的 `spec.containers[*].resources`
  字段表示容器的**期望**資源，對於 CPU 和內存是可變的。
- **實際資源（Actual Resources）**：`status.containerStatuses[*].resources`
  字段反映當前運行容器**實際設定**的資源。
  對於尚未啓動或重新啓動的容器，該字段表示其下次啓動時分配的資源。
- **觸發調整（Triggering a Resize）**：你可以通過更新 Pod 規約中的 `requests` 和 `limits` 來請求調整。
  這通常通過 `kubectl patch`、`kubectl apply` 或 `kubectl edit` 操作
  Pod 的 `resize` 子資源來完成。
  當期望資源與已分配資源不一致時，Kubelet 會嘗試調整容器資源。
- **已分配資源（Allocated Resources，進階）**：`status.containerStatuses[*].allocatedResources`
  字段用於記錄由 Kubelet 確認的資源值，主要用於內部調度邏輯。
  在大多數監控和驗證場景中，建議關注 `status.containerStatuses[*].resources` 字段。

<!--
If a node has pods with a pending or incomplete resize (see [Pod Resize Status](#pod-resize-status) below),
the {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} uses
the *maximum* of a container's desired requests, allocated requests,
and actual requests from the status when making scheduling decisions.
-->
如果某個節點上存在處於掛起或未完成調整狀態的 Pod（見下文 [Pod 調整狀態](#pod-resize-status)），
{{< glossary_tooltip text="調度器" term_id="kube-scheduler" >}}會在進行調度決策時，
使用容器的期望請求、已分配請求和實際請求三者中的**最大值**。

## {{% heading "prerequisites" %}}

<!--
The `InPlacePodVerticalScaling` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled
for your control plane and for all nodes in your cluster.

The `kubectl` client version must be at least v1.32 to use the `--subresource=resize` flag.
-->

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

你需要在控制平面和叢集中的所有節點上啓用 `InPlacePodVerticalScaling` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。  

要使用 `--subresource=resize` 參數，`kubectl` 客戶端版本需至少爲 v1.32。

<!--
## Pod resize status

The Kubelet updates the Pod's status conditions to indicate the state of a resize request:

* `type: PodResizePending`: The Kubelet cannot immediately grant the request.
  The `message` field provides an explanation of why.
    * `reason: Infeasible`: The requested resize is impossible on the current node
      (for example, requesting more resources than the node has).
    * `reason: Deferred`: The requested resize is currently not possible,
      but might become feasible later (for example if another pod is removed).
      The Kubelet will retry the resize.
* `type: PodResizeInProgress`: The Kubelet has accepted the resize and allocated resources,
  but the changes are still being applied.
  This is usually brief but might take longer depending on the resource type and runtime behavior.
  Any errors during actuation are reported in the `message` field (along with `reason: Error`).
-->
## Pod 大小調整狀態   {#pod-resize-status}

Kubelet 會通過更新 Pod 的狀態狀況來反映調整請求的當前狀態：

* `type: PodResizePending`：Kubelet 當前無法立即執行該請求。`message` 字段會說明原因：
  * `reason: Infeasible`：請求的資源在當前節點上不可行（例如請求超出節點總資源）。
  * `reason: Deferred`：請求的資源當前無法滿足，但未來可能滿足（例如其他 Pod 被移除後），
    Kubelet 會重試調整。
* `type: PodResizeInProgress`：Kubelet 已接受調整並分配了資源，但調整仍在進行中。  
  這一狀態通常很短暫，但也可能因資源類型或運行時行爲而延長。
  執行過程中的任何錯誤都會在 `message` 字段中報告，同時帶有 `reason: Error`。

<!--
### How kubelet retries Deferred resizes

If the requested resize is _Deferred_, the kubelet will periodically re-attempt the resize,
for example when another pod is removed or scaled down. If there are multiple deferred
resizes, they are retried according to the following priority:

* Pods with a higher Priority (based on PriorityClass) will have their resize request retried first.
* If two pods have the same Priority, resize of guaranteed pods will be retried before the resize of burstable pods.
* If all else is the same, pods that have been in the Deferred state longer will be prioritized.

A higher priority resize being marked as pending will not block the remaining pending resizes from being attempted;
all remaining pending resizes will still be retried even if a higher-priority resize gets deferred again.
-->
### 如何重試 Deferred 調整大小

如果請求的調整大小操作被標記爲 **Deferred**，kubelet 會定期重新嘗試執行該調整，例如當其他 Pod 被移除或縮容時。
當存在多個延遲的調整操作時，kubelet 會按照以下優先級順序進行重試：

* 優先級（基於 PriorityClass）較高的 Pod，其調整請求會先被重試。
* 如果兩個 Pod 擁有相同的優先級，則會先重試 Guaranteed 類型的 Pod，再重試 Burstable 的類型 Pod。
* 如果上述條件均相同，則優先處理在延遲狀態下停留時間更長的 Pod。

需要注意的是，即使高優先級的調整被再次標記爲待處理，也不會阻塞其餘待處理的調整操作；其餘的待處理調整仍會被繼續重試。

<!--
### Leveraging `observedGeneration` Fields

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

* The top-level `status.observedGeneration` field shows the `metadata.generation` corresponding to the latest pod specification that the kubelet has acknowledged. You can use this to determine the most recent resize request the kubelet has processed.
* In the `PodResizeInProgress` condition, the `conditions[].observedGeneration` field indicates the `metadata.generation` of the podSpec when the current in-progress resize was initiated.
* In the `PodResizePending` condition, the `conditions[].observedGeneration` field indicates the `metadata.generation` of the podSpec when the pending resize's allocation was last attempted.
-->
### 利用 `observedGeneration` 字段

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

* 頂層的 `status.observedGeneration` 字段顯示了 kubelet 已確認的最新 Pod 規約所對應的 `metadata.generation`。
  你可以使用該字段來判斷 kubelet 已處理的最近一次調整請求。
* 在 `PodResizeInProgress` 狀態條件，`conditions[].observedGeneration` 字段表示當前正在進行的調整操作開始時，
  該 Pod 規約（podSpec）的 `metadata.generation`。
* 在 `PodResizePending` 狀態條件，`conditions[].observedGeneration` 字段表示上一次嘗試爲待處理調整請求分配資源時，
  Pod 規約的 `metadata.generation`。

<!--
## Container resize policies

Containers can specify an optional `resizePolicy` array as part of the resource requirements.
Each entry defines how a particular resource should be handled during in-place resize.
-->
## 容器調整策略   {#container-resize-policies}

容器可以在資源需求中指定可選的 `resizePolicy` 數組。  
該數組中的每一項定義了某種資源在就地調整期間應如何處理。

<!--
You can control whether a container should be restarted when resizing
by setting `resizePolicy` in the container specification.
This allows fine-grained control based on resource type (CPU or memory).
-->
你可以通過在容器規約中設置 `resizePolicy`，控制在調整資源時容器是否需要重啓。
這樣可以針對不同資源類型（CPU 或內存）進行精細化控制。

```yaml
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: RestartContainer
```

<!--
* `NotRequired`: (Default) Apply the resource change to the running container without restarting it.
* `RestartContainer`: Restart the container to apply the new resource values.
  This is often necessary for memory changes because many applications
  and runtimes cannot adjust their memory allocation dynamically.

If `resizePolicy[*].restartPolicy` is not specified for a resource, it defaults to `NotRequired`.
-->
* `NotRequired`：（預設）在不重啓容器的情況下應用資源變更。
* `RestartContainer`：重啓容器以應用新的資源值。
  對於內存變更，許多應用和運行時無法動態調整內存分配，因此通常需要重啓。

如果未爲某個資源指定 `resizePolicy[*].restartPolicy`，則預設爲 `NotRequired`。

{{< note >}}
<!--
If a Pod's overall `restartPolicy` is `Never`, then any container `resizePolicy` must be `NotRequired` for all resources.
You cannot configure a resize policy that would require a restart in such Pods.
-->
如果 Pod 的整體 `restartPolicy` 爲 `Never`，則所有容器的 `resizePolicy` 必須對所有資源都設置爲 `NotRequired`。
此類 Pod 不允許設定需要重啓的調整策略。
{{< /note >}}

<!--
**Example Scenario:**

Consider a container configured with `restartPolicy: NotRequired` for CPU and `restartPolicy: RestartContainer` for memory.
* If only CPU resources are changed, the container is resized in-place.
* If only memory resources are changed, the container is restarted.
* If *both* CPU and memory resources are changed simultaneously, the container is restarted (due to the memory policy).
-->
**示例場景：**

考慮一個容器，其 CPU 的 `restartPolicy` 爲 `NotRequired`，內存的 `restartPolicy` 爲 `RestartContainer`：
* 如果僅更改 CPU 資源，容器將原地調整大小。
* 如果僅更改內存資源，容器將重啓。
* 如果**同時**更改 CPU 和內存資源，容器將重啓（由於內存策略）。

<!--
## Limitations

For Kubernetes v{{< skew currentVersion >}}, resizing pod resources in-place has the following limitations:
-->
## 限制   {#limitations}

對於 Kubernetes v{{< skew currentVersion >}}，原地調整 Pod 資源大小存在以下限制：

<!--
* **Resource Types:** Only CPU and memory resources can be resized.
-->
* **資源類型**：只能調整 CPU 和內存資源。

<!--
* **Memory Decrease:** If the memory resize restart policy is `NotRequired` (or unspecified), the kubelet will make a
best-effort attempt to prevent oom-kills when decreasing memory limits, but doesn't provide any guarantees. 
Before decreasing container memory limits, if memory usage exceeds the requested limit, the resize will be skipped
and the status will remain in an "In Progress" state. This is considered best-effort because it is still subject
to a race condition where memory usage may spike right after the check is performed. 
-->
* **內存減少**：如果內存調整的重啓策略爲 `NotRequired`（或未指定），kubelet 會盡力在降低內存限制時避免 OOM（內存不足導致的進程被殺死），
  但並不提供任何保證。在降低容器內存限制之前，如果內存使用量已超過請求的限制，則此次調整會被跳過，
  狀態將保持在 "In Progress"。之所以稱爲盡力而爲，是因爲該過程仍可能受到競爭條件影響：
  在檢查完成後，內存使用量可能會立即出現峯值。

<!--
* **QoS Class:** The Pod's original [Quality of Service (QoS) class](/docs/concepts/workloads/pods/pod-qos/)
  (Guaranteed, Burstable, or BestEffort) is determined at creation and **cannot** be changed by a resize.
  The resized resource values must still adhere to the rules of the original QoS class:
    * *Guaranteed*: Requests must continue to equal limits for both CPU and memory after resizing.
    * *Burstable*: Requests and limits cannot become equal for *both* CPU and memory simultaneously
      (as this would change it to Guaranteed).
    * *BestEffort*: Resource requirements (`requests` or `limits`) cannot be added
      (as this would change it to Burstable or Guaranteed).
-->
* **QoS 類**：Pod 的原始[服務質量（QoS）類](/zh-cn/docs/concepts/workloads/pods/pod-qos/)
  （Guaranteed、Burstable 或 BestEffort）在創建時確定，**不能**通過調整大小來更改。
  調整後的資源值仍必須遵守原始 QoS 類的規則：
  * **Guaranteed**：調整後，CPU 和內存的請求必須繼續等於限制。
  * **Burstable**：CPU 和內存的請求和限制不能**同時**變爲相等
    （因爲這會將其更改爲 Guaranteed）。
  * **BestEffort**：不能添加資源要求（`requests` 或 `limits`）
    （因爲這會將其更改爲 Burstable 或 Guaranteed）。

<!--
* **Container Types:** Non-restartable {{< glossary_tooltip text="init containers" term_id="init-container" >}} and
  {{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}} cannot be resized.
  [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) can be resized.
-->
* **容器類型**：不可重啓的{{< glossary_tooltip text="Init 容器" term_id="init-container" >}}和
  {{< glossary_tooltip text="臨時容器" term_id="ephemeral-container" >}}不能調整大小。
  [邊車容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)可以調整大小。

<!--
* **Resource Removal:** Resource requests and limits cannot be entirely removed once set;
  they can only be changed to different values.
-->
* **資源移除**：一旦設置了資源請求和限制，就不能完全移除；
  只能更改爲不同的值。

<!--
* **Operating System:** Windows pods do not support in-place resize.
-->
* **操作系統**：Windows Pod 不支持原地調整大小。

<!--
* **Node Policies:** Pods managed by [static CPU or Memory manager policies](/docs/tasks/administer-cluster/cpu-management-policies/)
  cannot be resized in-place.
-->
* **節點策略**：由[靜態 CPU 或內存管理器策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)管理的
  Pod 不能原地調整大小。

<!--
* **Swap:** Pods utilizing [swap memory](/docs/concepts/architecture/nodes/#swap-memory) cannot resize memory requests
  unless the `resizePolicy` for memory is `RestartContainer`.
-->
* **交換內存**：使用[交換內存](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)的 Pod 不能調整內存請求，
  除非內存的 `resizePolicy` 爲 `RestartContainer`。

<!--
These restrictions might be relaxed in future Kubernetes versions.
-->
這些限制可能會在未來的 Kubernetes 版本中放寬。

<!--
## Example 1: Resizing CPU without restart

First, create a Pod designed for in-place CPU resize and restart-required memory resize.
-->
## 示例 1：調整 CPU 而不重啓   {#example-1-resizing-cpu-without-restart}

首先，創建一個設計用於原地 CPU 調整和需要重啓的內存調整的 Pod。

{{% code_sample file="pods/resource/pod-resize.yaml" %}}

<!--
Create the pod:
-->
創建 Pod：

```shell
kubectl create -f pod-resize.yaml
```

<!--
This pod starts in the Guaranteed QoS class. Verify its initial state:
-->
這個 Pod 以 Guaranteed QoS 類啓動。驗證其初始狀態：

```shell
# 等待 Pod 運行
kubectl get pod resize-demo --output=yaml
```

<!--
Observe the `spec.containers[0].resources` and `status.containerStatuses[0].resources`.
They should match the manifest (700m CPU, 200Mi memory). Note the `status.containerStatuses[0].restartCount` (should be 0).
-->
觀察 `spec.containers[0].resources` 和 `status.containerStatuses[0].resources`。
它們應該與清單檔案匹配（700m CPU，200Mi 內存）。注意 `status.containerStatuses[0].restartCount`（應該爲 0）。

<!--
Now, increase the CPU request and limit to `800m`. You use `kubectl patch` with the `--subresource resize` command line argument.
-->
現在，將 CPU 請求和限制增加到 `800m`。使用帶有 `--subresource resize` 命令列參數的 `kubectl patch`。

```shell
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"800m"}, "limits":{"cpu":"800m"}}}]}}'

# 替代方法：
# kubectl -n qos-example edit pod resize-demo --subresource resize
# kubectl -n qos-example apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
<!--
The `--subresource resize` command line argument requires `kubectl` client version v1.32.0 or later.
Older versions will report an `invalid subresource` error.
-->
`--subresource resize` 命令列參數要求 `kubectl` 客戶端版本爲 v1.32.0 或更高。
較早版本會報告 `invalid subresource` 錯誤。
{{< /note >}}

<!--
Check the pod status again after patching:
-->
在應用補丁後再次檢查 Pod 狀態：

```shell
kubectl get pod resize-demo --output=yaml --namespace=qos-example
```

<!--
You should see:
* `spec.containers[0].resources` now shows `cpu: 800m`.
* `status.containerStatuses[0].resources` also shows `cpu: 800m`, indicating the resize was successful on the node.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU `resizePolicy` was `NotRequired`.
-->
你應該看到：
* `spec.containers[0].resources` 現在顯示 `cpu: 800m`。
* `status.containerStatuses[0].resources` 也顯示 `cpu: 800m`，表明節點上的調整已成功。
* `status.containerStatuses[0].restartCount` 保持爲 `0`，因爲 CPU 的 `resizePolicy` 是 `NotRequired`。

<!--
## Example 2: Resizing memory with restart

Now, resize the memory for the *same* pod by increasing it to `300Mi`.
Since the memory `resizePolicy` is `RestartContainer`, the container is expected to restart.
-->
## 示例 2：調整內存並重啓   {#example-2-resizing-memory-with-restart}

現在，將**同一個** Pod 的內存增加到 `300Mi`。
由於內存的 `resizePolicy` 是 `RestartContainer`，容器將會重啓。

```shell
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"memory":"300Mi"}, "limits":{"memory":"300Mi"}}}]}}'
```

<!--
Check the pod status shortly after patching:
-->
在應用補丁後立即檢查 Pod 狀態：

```shell
kubectl get pod resize-demo --output=yaml
```

<!--
You should now observe:
* `spec.containers[0].resources` shows `memory: 300Mi`.
* `status.containerStatuses[0].resources` also shows `memory: 300Mi`.
* `status.containerStatuses[0].restartCount` has increased to `1` (or more, if restarts happened previously),
  indicating the container was restarted to apply the memory change.
-->
你現在應該觀察到：
* `spec.containers[0].resources` 顯示 `memory: 300Mi`。
* `status.containerStatuses[0].resources` 也顯示 `memory: 300Mi`。
* `status.containerStatuses[0].restartCount` 增加到 `1`（如果之前發生過重啓，可能會更多），
  表明容器已重啓以應用內存變更。

<!--
## Troubleshooting: Infeasible resize request

Next, try requesting an unreasonable amount of CPU, such as 1000 full cores (written as `"1000"` instead of `"1000m"` for millicores), which likely exceeds node capacity.
-->
## 故障排查：不可行的調整請求   {#troubleshooting-infeasible-resize-request}

接下來，嘗試請求不合理的 CPU 數量，例如 1000 個完整核心（寫作 `"1000"` 而不是 `"1000m"` 毫核），這很可能超出節點容量。

```shell
# 嘗試使用過大的 CPU 請求進行補丁
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"1000"}, "limits":{"cpu":"1000"}}}]}}'
```

<!--
Query the Pod's details:
-->
查詢 Pod 的詳細資訊：

```shell
kubectl get pod resize-demo --output=yaml
```

<!--
You'll see changes indicating the problem:

* The `spec.containers[0].resources` reflects the *desired* state (`cpu: "1000"`).
* A condition with `type: PodResizePending` and `reason: Infeasible` was added to the Pod.
* The condition's `message` will explain why (`Node didn't have enough capacity: cpu, requested: 800000, capacity: ...`)
* Crucially, `status.containerStatuses[0].resources` will *still show the previous values* (`cpu: 800m`, `memory: 300Mi`),
  because the infeasible resize was not applied by the Kubelet.
* The `restartCount` will not have changed due to this failed attempt.

To fix this, you would need to patch the pod again with feasible resource values.
-->
你會看到表明問題的變更：

* `spec.containers[0].resources` 反映了**期望**狀態（`cpu: "1000"`）。
* Pod 添加了一個 `type: PodResizePending` 和 `reason: Infeasible` 的條件。
* 狀況的 `message` 會解釋原因（`Node didn't have enough capacity: cpu, requested: 800000, capacity: ...`）
* 重要的是，`status.containerStatuses[0].resources` **仍然顯示之前的值**（`cpu: 800m`，`memory: 300Mi`），
  因爲不可行的調整未被 Kubelet 應用。
* 由於這次失敗的嘗試，`restartCount` 不會發生變化。

要修復這個問題，你需要使用可行的資源值再次對 Pod 進行補丁。

<!--
## Clean up

Delete the pod:
-->
## 清理   {#clean-up}

刪除 Pod：

```shell
kubectl delete pod resize-demo
```

## {{% heading "whatsnext" %}}

<!--
### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
-->
### 對於應用開發人員

* [爲容器和 Pod 分配內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)

* [爲容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [分配 Pod 級別的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
-->
### 對於叢集管理員

* [爲名字空間設定預設內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [爲名字空間設定預設 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [爲名字空間設定最小和最大內存約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [爲名字空間設定最小和最大 CPU 約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [爲名字空間設定內存和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
