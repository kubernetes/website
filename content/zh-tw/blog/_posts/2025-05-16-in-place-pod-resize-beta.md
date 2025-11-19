---
layout: blog
title: "Kubernetes v1.33：原地調整 Pod 資源特性升級爲 Beta"
slug: kubernetes-v1-33-in-place-pod-resize-beta
date: 2025-05-16T10:30:00-08:00
author: "Tim Allclair (Google)"
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: In-Place Pod Resize Graduated to Beta"
slug: kubernetes-v1-33-in-place-pod-resize-beta
date: 2025-05-16T10:30:00-08:00
author: "Tim Allclair (Google)"
-->

<!--
On behalf of the Kubernetes project, I am excited to announce that the **in-place Pod resize** feature (also known as In-Place Pod Vertical Scaling), first introduced as alpha in Kubernetes v1.27, has graduated to **Beta** and will be enabled by default in the Kubernetes v1.33 release! This marks a significant milestone in making resource management for Kubernetes workloads more flexible and less disruptive.
-->
代表 Kubernetes 項目，我很高興地宣佈，**原地 Pod 調整大小**特性（也稱爲原地 Pod 垂直縮放），
在 Kubernetes v1.27 中首次引入爲 Alpha 版本，現在已升級爲 **Beta** 版本，
並將在 Kubernetes v1.33 發行版中默認啓用！
這標誌着 Kubernetes 工作負載的資源管理變得更加靈活和不那麼具有干擾性的一個重要里程碑。

<!--
## What is in-place Pod resize?

Traditionally, changing the CPU or memory resources allocated to a container required restarting the Pod. While acceptable for many stateless applications, this could be disruptive for stateful services, batch jobs, or any workloads sensitive to restarts.
-->
## 什麼是原地 Pod 調整大小？   {#what-is-in-place-pod-resize}

傳統上，更改分配給容器的 CPU 或內存資源需要重啓 Pod。
雖然這對於許多無狀態應用來說是可以接受的，
但這對於有狀態服務、批處理作業或任何對重啓敏感的工作負載可能會造成干擾。

<!--
In-place Pod resizing allows you to change the CPU and memory requests and limits assigned to containers within a *running* Pod, often without requiring a container restart.
-->
原地 Pod 調整大小允許你更改**運行中**的 Pod 內容器的 CPU
和內存請求及限制，通常無需重啓容器。

<!--
Here's the core idea:
* The `spec.containers[*].resources` field in a Pod specification now represents the *desired* resources and is mutable for CPU and memory.
* The `status.containerStatuses[*].resources` field reflects the *actual* resources currently configured on a running container.
* You can trigger a resize by updating the desired resources in the Pod spec via the new `resize` subresource.
-->
核心思想如下：

* Pod 規約中的 `spec.containers[*].resources` 字段現在代表**期望的**資源，並且對於 CPU 和內存是可變更的。
* `status.containerStatuses[*].resources` 字段反映當前運行容器上已配置的**實際**資源。
* 你可以通過新的 `resize` 子資源更新 Pod 規約中的期望資源來觸發調整大小。

<!--
You can try it out on a v1.33 Kubernetes cluster by using kubectl to edit a Pod (requires `kubectl` v1.32+):
-->
你可以在 v1.33 的 Kubernetes 集羣上使用 kubectl 編輯
Pod 來嘗試（需要 v1.32+ 的 kubectl）：

<!--
```shell
kubectl edit pod <pod-name> --subresource resize
```
-->
```shell
kubectl edit pod <Pod 名稱> --subresource resize
```

<!--
For detailed usage instructions and examples, please refer to the official Kubernetes documentation:
[Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).
-->
有關詳細使用說明和示例，請參閱官方 Kubernetes 文檔：
[調整分配給容器的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)。

<!--
## Why does in-place Pod resize matter?

Kubernetes still excels at scaling workloads horizontally (adding or removing replicas), but in-place Pod resizing unlocks several key benefits for vertical scaling:
-->
## 爲什麼原地 Pod 調整大小很重要？   {#why-does-in-place-pod-resize-matter}

Kubernetes 在水平擴縮工作負載（添加或移除副本）方面仍然表現出色，但原地
Pod 調整大小爲垂直擴縮解鎖了幾個關鍵優勢：

<!--
* **Reduced Disruption:** Stateful applications, long-running batch jobs, and sensitive workloads can have their resources adjusted without suffering the downtime or state loss associated with a Pod restart.
* **Improved Resource Utilization:** Scale down over-provisioned Pods without disruption, freeing up resources in the cluster. Conversely, provide more resources to Pods under heavy load without needing a restart.
* **Faster Scaling:** Address transient resource needs more quickly. For example Java applications often need more CPU during startup than during steady-state operation. Start with higher CPU and resize down later.
-->
* **減少干擾：** 有狀態應用、長時間運行的批處理作業和敏感工作負載可以在不經歷
  Pod 重啓相關的停機或狀態丟失的情況下調整資源。

* **改進資源利用率：** 無需中斷即可縮小過度配置的 Pod，從而釋放集羣中的資源。
  相反，在重負載下的 Pod 可以在不重啓的情況下獲得更多的資源。

* **更快的擴縮：** 更快速地解決瞬時資源需求。例如，Java
  應用在啓動期間通常比在穩定狀態下需要更多的 CPU。
  可以開始時使用更高的 CPU 配置，然後在之後調整減小。

<!--
## What's changed between Alpha and Beta?

Since the alpha release in v1.27, significant work has gone into maturing the feature, improving its stability, and refining the user experience based on feedback and further development. Here are the key changes:
-->
## 從 Alpha 到 Beta 有哪些變化？   {#whats-changed-between-alpha-and-beta}

自從 v1.27 的 Alpha 版本發佈以來，爲了完善此特性、
提高其穩定性並根據反饋和進一步開發優化用戶體驗，已經進行了大量工作。
以下是關鍵變化：

<!--
### Notable user-facing changes

* **`resize` Subresource:** Modifying Pod resources must now be done via the Pod's `resize` subresource (`kubectl patch pod <name> --subresource resize ...`). `kubectl` versions v1.32+ support this argument.
* **Resize Status via Conditions:** The old `status.resize` field is deprecated. The status of a resize operation is now exposed via two Pod conditions:
    * `PodResizePending`: Indicates the Kubelet cannot grant the resize immediately (e.g., `reason: Deferred` if temporarily unable, `reason: Infeasible` if impossible on the node).
    * `PodResizeInProgress`: Indicates the resize is accepted and being applied. Errors encountered during this phase are now reported in this condition's message with `reason: Error`.
* **Sidecar Support:** Resizing {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}} in-place is now supported.
-->
### 顯著的用戶可感知的變化

* **`resize` 子資源：** 修改 Pod 資源現在必須通過 Pod 的 `resize`
  子資源進行（`kubectl patch pod <name> --subresource resize ...`）。
  kubectl 版本 v1.32+ 支持此參數。
* **通過狀況顯示調整大小狀態：** 舊的 `status.resize` 字段已被棄用。
  調整大小操作的狀態現在通過兩個 Pod 狀況暴露：
    * `PodResizePending`：表示 kubelet 無法立即批准調整大小
     （例如，如果暫時不能，則 `reason: Deferred`；如果在節點上不可能，則 `reason: Infeasible`）。
    * `PodResizeInProgress`：表示調整大小已被接受並正在應用。
      在此階段遇到的錯誤現在會在此狀況的消息中報告爲 `reason: Error`。
* **支持邊車容器：** 現在支持對{{< glossary_tooltip text="邊車容器" term_id="sidecar-container" >}}進行原地調整大小。

<!--
### Stability and reliability enhancements

* **Refined Allocated Resources Management:** The allocation management logic with the Kubelet was significantly reworked, making it more consistent and robust. The changes eliminated whole classes of bugs, and greatly improved the reliability of in-place Pod resize.
-->
### 穩定性和可靠性增強

* **改進的已分配資源管理：** 對 Kubelet 的分配管理邏輯進行了重大重新設計，
  使其更加一致和穩健。這些更改消除了很多種錯誤，並大大提高了原地 Pod 調整大小的可靠性。
<!--
* **Improved Checkpointing & State Tracking:** A more robust system for tracking "allocated" and "actuated" resources was implemented, using new checkpoint files (`allocated_pods_state`, `actuated_pods_state`) to reliably manage resize state across Kubelet restarts and handle edge cases where runtime-reported resources differ from requested ones. Several bugs related to checkpointing and state restoration were fixed. Checkpointing efficiency was also improved.
-->
* **改進的檢查點操作和狀態跟蹤操作：** 實現了更健壯的系統來跟蹤“已分配”和“已執行”的資源，
  使用新的檢查點文件（`allocated_pods_state`，`actuated_pods_state`）以可靠地管理
  kubelet 重啓時的調整大小狀態，並處理運行時報告的資源與請求的資源不同的邊緣情況。
  修復了幾個與檢查點和狀態恢複相關的錯誤。還提高了檢查點的效率。
<!--
* **Faster Resize Detection:** Enhancements to the Kubelet's Pod Lifecycle Event Generator (PLEG) allow the Kubelet to respond to and complete resizes much more quickly.
* **Enhanced CRI Integration:** A new `UpdatePodSandboxResources` CRI call was added to better inform runtimes and plugins (like NRI) about Pod-level resource changes.
* **Numerous Bug Fixes:** Addressed issues related to systemd cgroup drivers, handling of containers without limits, CPU minimum share calculations, container restart backoffs, error propagation, test stability, and more.
-->
* **更快的調整大小檢測：** 對 kubelet 的 Pod 生命週期事件生成器（PLEG）進行了增強，
  使 kubelet 能夠更快地響應並完成大小調整。
* **增強的 CRI 集成：** 添加了新的 `UpdatePodSandboxResources` CRI 調用，
  以更好地通知運行時和插件（如 NRI）有關 Pod 級別的資源變化。
* **衆多 Bug 修復：** 解決了與 systemd CGroup 驅動程序、未設資源限制的容器的處理、CPU
  最小份額計算、容器重啓退避、錯誤傳播、測試穩定性等相關的問題。

<!--
## What's next?

Graduating to Beta means the feature is ready for broader adoption, but development doesn't stop here! Here's what the community is focusing on next:
-->
## 接下來是什麼？   {#whats-next}

晉升爲 Beta 意味着該特性已經準備好被更廣泛地採用，但開發工作並不會止步於此！
以下是社區接下來的關注重點：

<!--
* **Stability and Productionization:** Continued focus on hardening the feature, improving performance, and ensuring it is robust for production environments.
* **Addressing Limitations:** Working towards relaxing some of the current limitations noted in the documentation, such as allowing memory limit decreases.
-->
* **穩定性和產品化：** 持續關注增強特性，提升性能，並確保它在生產環境中足夠穩健。
* **解決限制：** 致力於解除文檔中提到的一些當前限制，例如允許降低內存限制值。
<!--
* **[VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/#scaling-workloads-vertically) (VPA) Integration:** Work to enable VPA to leverage in-place Pod resize is already underway. A new `InPlaceOrRecreate` update mode will allow it to attempt non-disruptive resizes first, or fall back to recreation if needed. This will allow users to benefit from VPA's recommendations with significantly less disruption.
* **User Feedback:** Gathering feedback from users adopting the beta feature is crucial for prioritizing further enhancements and addressing any uncovered issues or bugs.
-->
* **[垂直 Pod 自動擴縮](/zh-cn/docs/concepts/workloads/autoscaling/#scaling-workloads-vertically)（VPA）集成：**
  此任務正在進行，爲的是使 VPA 能夠利用原地 Pod 重新調整大小。一個新的 **InPlaceOrRecreate**
  更新模式將允許它首先嚐試非干擾性的重新調整大小，或者在需要時回退到重建。
  這將使用戶能夠受益於 VPA 的建議，並顯著減少干擾。
* **用戶反饋：** 收集採用 Beta 版特性的用戶反饋，對於優先處理後續的增強特性以及解決發現的任何問題或錯誤至關重要。

<!--
## Getting started and providing feedback

With the `InPlacePodVerticalScaling` feature gate enabled by default in v1.33, you can start experimenting with in-place Pod resizing right away!

Refer to the [documentation](/docs/tasks/configure-pod-container/resize-container-resources/) for detailed guides and examples.
-->
## 開始使用並提供反饋   {#getting-started-and-providing-feedback}

隨着 **InPlacePodVerticalScaling** 特性門控在 v1.33 中默認啓用，
你可以立即開始嘗試原地 Pod 資源調整大小！

參考[文檔](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)獲取詳細的指南和示例。

<!--
As this feature moves through Beta, your feedback is invaluable. Please report any issues or share your experiences via the standard Kubernetes communication channels (GitHub issues, mailing lists, Slack). You can also review the [KEP-1287: In-place Update of Pod Resources](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1287-in-place-update-pod-resources) for the full in-depth design details.

We look forward to seeing how the community leverages in-place Pod resize to build more efficient and resilient applications on Kubernetes!
-->
隨着此特性從 Beta 階段逐步推進，你的反饋是無價的。請通過 Kubernetes
標準溝通渠道（GitHub Issues、郵件列表、Slack）報告任何問題或分享你的經驗。
你也可以查看
[KEP-1287: In-place Update of Pod Resources](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1287-in-place-update-pod-resources)
以獲取完整的深入設計細節。

我們期待看到社區如何利用原地 Pod 調整大小來構建更高效、彈性更好的 Kubernetes 應用！
